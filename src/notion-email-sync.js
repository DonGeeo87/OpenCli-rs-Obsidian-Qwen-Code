/**
 * Notion Email Sync - Genera emails en Notion desde tiendas encontradas
 * 
 * Lee tiendas desde "🏪 Tiendas/Prospectos"
 * Genera emails personalizados
 * Crea entradas en "📧 Emails Enviados" para revisión
 * 
 * Uso: node src/notion-email-sync.js [pais]
 */

require('dotenv').config();
const { Client } = require('@notionhq/client');
const templates = require('./email-templates');
const fs = require('fs');
const path = require('path');

// Configuración
const NOTION_API_KEY = process.env.NOTION_API_KEY;
const STORES_DATABASE_ID = process.env.NOTION_STORES_DATABASE_ID;
const EMAILS_DATABASE_ID = process.env.NOTION_EMAILS_DATABASE_ID;

const notion = new Client({ auth: NOTION_API_KEY });

/**
 * Obtiene tiendas desde Notion
 */
async function getStoresFromNotion(country = null) {
  if (!STORES_DATABASE_ID) {
    console.error('❌ NOTION_STORES_DATABASE_ID no configurado');
    return [];
  }

  try {
    const query = {
      database_id: STORES_DATABASE_ID,
      page_size: 100
    };

    // Filtrar por país si se especifica
    if (country) {
      query.filter = {
        property: 'País',
        select: { equals: country }
      };
    }

    const response = await notion.databases.query(query);

    return response.results.map(page => ({
      id: page.id,
      name: getTextProperty(page, 'Nombre'),
      country: getSelectProperty(page, 'País'),
      email: getEmailProperty(page, 'Email'),
      website: getUrlProperty(page, 'Website'),
      keyword: getTextProperty(page, 'Keyword')
    }));
  } catch (error) {
    console.error('❌ Error obteniendo tiendas:', error.message);
    return [];
  }
}

/**
 * Obtiene emails ya creados para evitar duplicados
 */
async function getExistingEmails() {
  if (!EMAILS_DATABASE_ID) {
    return [];
  }

  try {
    const response = await notion.databases.query({
      database_id: EMAILS_DATABASE_ID,
      page_size: 100
    });

    return response.results.map(page => getTextProperty(page, 'Tienda'));
  } catch (error) {
    console.error('⚠️ Error obteniendo emails existentes:', error.message);
    return [];
  }
}

/**
 * Genera email personalizado para una tienda
 */
function generateEmailDraft(store) {
  const template = getTemplateByCountry(store.country);
  
  if (!template) {
    console.log(`⚠️ No hay plantilla para: ${store.country}`);
    return null;
  }

  // Reemplazar variables
  let subject = template.subject;
  let body = template.body;

  const replacements = {
    '[NOMBRE_TIENDA]': store.name || 'su tienda',
    '[TU NOMBRE]': 'Carlos Guerrero',
    '[TU_EMPRENDIMIENTO]': 'VitroArte Chile',
    '[TU_NUMERO]': '+569XXXXXXXX',
    '[TU_WEBSITE_O_INSTAGRAM]': 'https://instagram.com/tu_emprendimiento'
  };

  for (const [key, value] of Object.entries(replacements)) {
    subject = subject.replace(new RegExp(key, 'g'), value);
    body = body.replace(new RegExp(key, 'g'), value);
  }

  return {
    subject: subject,
    body: body,
    full: `Asunto: ${subject}\n\n${body}`
  };
}

/**
 * Obtiene plantilla por país
 */
function getTemplateByCountry(countryName) {
  const countryMap = {
    'España': 'es',
    'Alemania': 'de',
    'Francia': 'fr',
    'Italia': 'it',
    'Reino Unido': 'gb',
    'Países Bajos': 'nl',
    'Bélgica': 'be',
    'Portugal': 'pt'
  };

  const langCode = countryMap[countryName];
  if (langCode && templates[langCode]) {
    return templates[langCode];
  }

  // Fallback a español
  console.log(`  Usando plantilla en español para ${countryName}`);
  return templates.es;
}

/**
 * Crea email en Notion para revisión
 */
async function createEmailInNotion(store, draft) {
  if (!EMAILS_DATABASE_ID) {
    console.error('❌ EMAILS_DATABASE_ID no configurado');
    return null;
  }

  try {
    const page = await notion.pages.create({
      parent: { database_id: EMAILS_DATABASE_ID },
      properties: {
        'Tienda': {
          title: [{ text: { content: store.name || 'Tienda sin nombre' } }]
        },
        'País': {
          select: { name: store.country || 'Unknown' }
        },
        'Email Tienda': {
          email: store.email
        },
        'Email Borrador': {
          rich_text: [{ text: { content: draft.full } }]
        },
        '¿Enviar?': {
          checkbox: false
        },
        'Estado': {
          select: { name: '⏳ Pendiente' }
        },
        'Notas': {
          rich_text: [{ text: { content: `Generado automáticamente desde ${store.keyword || 'búsqueda'}` } }]
        }
      }
    });

    console.log(`  ✅ Email creado: ${store.name}`);
    return page.id;
  } catch (error) {
    console.error(`  ❌ Error creando email: ${error.message}`);
    return null;
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

function getUrlProperty(page, propName) {
  const prop = page.properties[propName];
  if (!prop) return null;
  return prop.url;
}

/**
 * Función principal
 */
async function main() {
  console.log('========================================');
  console.log('  ExportaRadar - Sync de Emails');
  console.log('========================================\n');

  const countryArg = process.argv[2];

  // Verificar configuración
  if (!STORES_DATABASE_ID) {
    console.error('❌ NOTION_STORES_DATABASE_ID no configurado');
    console.error('Actualiza tu archivo .env con el database ID');
    return;
  }

  if (!EMAILS_DATABASE_ID) {
    console.error('❌ NOTION_EMAILS_DATABASE_ID no configurado');
    console.error('Ejecuta: node src/setup-notion-exportaradar.js PAGE_ID');
    return;
  }

  // Obtener tiendas
  console.log(`📦 Obteniendo tiendas...${countryArg ? ` (${countryArg})` : ''}`);
  const stores = await getStoresFromNotion(countryArg);

  if (stores.length === 0) {
    console.log('⚠️ No se encontraron tiendas');
    console.log('\n💡 Primero debes:');
    console.log('   1. Ejecutar: npm run exporta:buscar');
    console.log('   2. Cargar tiendas a Notion (próximamente automático)');
    return;
  }

  console.log(`✅ ${stores.length} tiendas encontradas\n`);

  // Obtener emails ya creados
  console.log('📋 Verificando emails existentes...');
  const existingEmails = await getExistingEmails();
  console.log(`✅ ${existingEmails.length} emails existentes\n`);

  // Filtrar tiendas que ya tienen email
  const newStores = stores.filter(store => 
    !existingEmails.includes(store.name) && store.email
  );

  console.log(`📧 Generando ${newStores.length} emails nuevos...\n`);

  // Generar emails
  let created = 0;
  let skipped = 0;

  for (const store of newStores) {
    const draft = generateEmailDraft(store);

    if (!draft) {
      skipped++;
      continue;
    }

    await createEmailInNotion(store, draft);
    created++;

    // Pequeña pausa para no saturar API
    await new Promise(resolve => setTimeout(resolve, 200));
  }

  // Resumen
  console.log('\n========================================');
  console.log('  Resumen');
  console.log('========================================');
  console.log(`  ✅ Emails creados: ${created}`);
  console.log(`  ⏭️ Saltados (ya existen): ${skipped}`);
  console.log(`  ⏸️ Sin email: ${stores.length - newStores.length - skipped}`);
  console.log('========================================\n');

  console.log('🎯 Próximos pasos:');
  console.log('   1. Abre Notion → Dashboard ExportaRadar');
  console.log('   2. Ve a "📧 Emails Enviados"');
  console.log('   3. Revisa los emails generados');
  console.log('   4. Marca checkbox "¿Enviar?" en los que quieras enviar');
  console.log('   5. Ejecuta: npm run exporta:send\n');
}

// Ejecutar
main().catch(console.error);

// Exportar
module.exports = {
  getStoresFromNotion,
  generateEmailDraft,
  createEmailInNotion
};
