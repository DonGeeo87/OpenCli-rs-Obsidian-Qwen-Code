/**
 * Send Emails - Envío de emails vía Resend para Jess Vitrofusión
 * 
 * Lee emails aprobados desde Notion (checkbox marcado)
 * y los envía automáticamente.
 * 
 * Uso: node src/send-emails.js [--force]
 */

require('dotenv').config();
const { Resend } = require('resend');
const { Client } = require('@notionhq/client');
const fs = require('fs');
const path = require('path');

// Configuración
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const NOTION_API_KEY = process.env.NOTION_API_KEY;
const EMAIL_FROM = process.env.EMAIL_FROM || 'guerrerobritocarlos@gmail.com';
const EMAIL_CC = process.env.EMAIL_CC || 'chicjessy@gmail.com';
const EMAIL_REPLY_TO = process.env.EMAIL_REPLY_TO || EMAIL_FROM;
const WEBSITE = process.env.WEBSITE || 'https://jessvitrofusion.art/';
const EMAILS_DATABASE_ID = process.env.NOTION_EMAILS_DATABASE_ID;

// Limites
const EMAILS_POR_ENVIO = parseInt(process.env.EMAILS_POR_ENVIO) || 2;

// Inicializar clientes
const resend = new Resend(RESEND_API_KEY);
const notion = new Client({ auth: NOTION_API_KEY });

/**
 * Obtiene emails pendientes de enviar desde Notion
 * (checkbox "¿Enviar?" marcado)
 */
async function getPendingEmails() {
  if (!EMAILS_DATABASE_ID) {
    console.error('❌ NOTION_EMAILS_DATABASE_ID no configurado');
    console.error('Ejecuta: node src/setup-notion-exportaradar.js PAGE_ID');
    return [];
  }

  try {
    const response = await notion.databases.query({
      database_id: EMAILS_DATABASE_ID,
      filter: {
        and: [
          {
            property: '¿Enviar?',
            checkbox: { equals: true }
          },
          {
            property: 'Estado',
            select: { equals: '⏳ Pendiente' }
          }
        ]
      },
      sorts: [
        {
          property: 'Fecha Envío',
          direction: 'ascending'
        }
      ],
      page_size: EMAILS_POR_ENVIO
    });

    return response.results.map(page => ({
      id: page.id,
      tienda: getTextProperty(page, 'Tienda'),
      email: getEmailProperty(page, 'Email Tienda'),
      pais: getSelectProperty(page, 'País'),
      borrador: getTextProperty(page, 'Email Borrador'),
      fechaEnvio: getDateProperty(page, 'Fecha Envío')
    }));
  } catch (error) {
    console.error('❌ Error obteniendo emails de Notion:', error.message);
    return [];
  }
}

/**
 * Envía email vía Resend
 */
async function sendEmail(emailData) {
  const { id, tienda, email, pais, borrador } = emailData;

  if (!email) {
    console.log(`⚠️ Email sin destinatario: ${tienda}`);
    return { success: false, error: 'Sin email' };
  }

  try {
    console.log(`\n📧 Enviando a ${tienda} (${email})...`);

    // Parsear el borrador para extraer asunto y cuerpo
    const { subject, body } = parseEmailDraft(borrador);

    const data = {
      from: `Jess Vitrofusión <${EMAIL_FROM}>`,
      to: [email],
      cc: [EMAIL_CC],
      reply_to: EMAIL_REPLY_TO,
      subject: subject,
      text: body,
      html: convertToHtml(body),
      tags: {
        country: pais || 'Unknown',
        store: tienda || 'Unknown',
        website: 'jessvitrofusion.art'
      }
    };

    const { data: sendResult, error } = await resend.emails.send(data);

    if (error) {
      console.error(`  ❌ Error: ${error.message}`);
      return { success: false, error: error.message };
    }

    console.log(`  ✅ Enviado: ${sendResult.id}`);
    return { success: true, id: sendResult.id };
  } catch (error) {
    console.error(`  ❌ Error: ${error.message}`);
    return { success: false, error: error.message };
  }
}

/**
 * Parsea el borrador para extraer asunto y cuerpo
 */
function parseEmailDraft(draft) {
  // El borrador viene en formato:
  // Asunto: [subject]
  // [body]
  
  const lines = draft.split('\n');
  let subject = 'Propuesta de colaboración';
  let bodyStartIndex = 0;

  // Buscar línea de asunto
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].startsWith('Asunto:')) {
      subject = lines[i].replace('Asunto:', '').trim();
      bodyStartIndex = i + 1;
      break;
    }
    if (lines[i].startsWith('Subject:')) {
      subject = lines[i].replace('Subject:', '').trim();
      bodyStartIndex = i + 1;
      break;
    }
  }

  const body = lines.slice(bodyStartIndex).join('\n').trim();

  return { subject, body };
}

/**
 * Convierte texto plano a HTML simple
 */
function convertToHtml(text) {
  return `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; white-space: pre-wrap;">
      ${text.replace(/\n/g, '<br>')}
    </div>
  `;
}

/**
 * Actualiza estado en Notion después de enviar
 */
async function updateEmailStatus(pageId, sentData) {
  try {
    await notion.pages.update({
      page_id: pageId,
      properties: {
        'Estado': {
          select: sentData.success ? '✅ Enviado' : '❌ Error'
        },
        'Fecha Envío': {
          date: sentData.success ? { start: new Date().toISOString() } : null
        },
        'Notas': {
          rich_text: sentData.success 
            ? [{ type: 'text', text: { content: `Enviado: ${sentData.id}` } }]
            : [{ type: 'text', text: { content: `Error: ${sentData.error}` } }]
        }
      }
    });

    if (sentData.success) {
      console.log(`  📊 Notion actualizado: ✅ Enviado`);
    }
  } catch (error) {
    console.error(`  ⚠️ Error actualizando Notion: ${error.message}`);
  }
}

/**
 * Helpers para obtener propiedades de Notion
 */
function getTextProperty(page, propName) {
  const prop = page.properties[propName];
  if (!prop) return null;
  if (prop.type === 'title' && prop.title.length > 0) {
    return prop.title[0].plain_text;
  }
  if (prop.type === 'rich_text' && prop.rich_text.length > 0) {
    return prop.rich_text[0].plain_text;
  }
  return null;
}

function getEmailProperty(page, propName) {
  const prop = page.properties[propName];
  if (!prop) return null;
  return prop.email;
}

function getSelectProperty(page, propName) {
  const prop = page.properties[propName];
  if (!prop) return null;
  return prop.select?.name || null;
}

function getDateProperty(page, propName) {
  const prop = page.properties[propName];
  if (!prop) return null;
  return prop.date?.start || null;
}

/**
 * Función principal
 */
async function main() {
  console.log('========================================');
  console.log('  Jess Vitrofusión - Envío de Emails');
  console.log('========================================\n');

  // Verificar configuración
  if (!RESEND_API_KEY) {
    console.error('❌ RESEND_API_KEY no configurada');
    console.error('Crea archivo .env con tu API key de Resend');
    return;
  }

  if (!NOTION_API_KEY) {
    console.error('❌ NOTION_API_KEY no configurada');
    return;
  }

  // Verificar conexión con Resend
  try {
    const domains = await resend.domains.list();
    console.log(`✅ Conectado a Resend`);
    console.log(`   Dominios: ${domains.data.length} configurados\n`);
  } catch (error) {
    console.error(`⚠️ Warning Resend: ${error.message}`);
  }

  // Obtener emails pendientes
  const pendingEmails = await getPendingEmails();

  if (pendingEmails.length === 0) {
    console.log('✅ ¡No hay emails pendientes!');
    console.log('\n💡 Tus papás deben:');
    console.log('   1. Abrir dashboard en Notion');
    console.log('   2. Revisar emails en "📧 Emails Enviados"');
    console.log('   3. Marcar checkbox "¿Enviar?" en los que quieran enviar\n');
    return;
  }

  console.log(`📋 Emails pendientes: ${pendingEmails.length}\n`);

  // Enviar emails
  let enviados = 0;
  let errores = 0;

  for (const email of pendingEmails) {
    const result = await sendEmail(email);
    
    if (result.success) {
      enviados++;
    } else {
      errores++;
    }

    // Actualizar estado en Notion
    await updateEmailStatus(email.id, result);

    // Pequeña pausa entre emails (anti-spam)
    if (pendingEmails.indexOf(email) < pendingEmails.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }

  // Resumen
  console.log('\n========================================');
  console.log('  Resumen');
  console.log('========================================');
  console.log(`  ✅ Enviados: ${enviados}`);
  console.log(`  ❌ Errores: ${errores}`);
  console.log(`  📊 Total: ${pendingEmails.length}`);
  console.log('========================================\n');
}

// Ejecutar
main().catch(console.error);

// Exportar para uso en cron
module.exports = { sendEmail, getPendingEmails };
