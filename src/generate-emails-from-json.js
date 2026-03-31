/**
 * Generar Emails desde JSON - Sin Notion
 * 
 * Uso: node src/generate-emails-from-json.js [archivo.json]
 */

require('dotenv').config();
const { Client } = require('@notionhq/client');
const templates = require('./email-templates-plain');
const fs = require('fs');
const path = require('path');

// Configuración
const NOTION_API_KEY = process.env.NOTION_API_KEY;
const EMAILS_DATABASE_ID = process.env.NOTION_EMAILS_DATABASE_ID;

const notion = new Client({ auth: NOTION_API_KEY });

/**
 * Genera email draft
 */
function generateEmailDraft(storeName) {
  const template = templates.es;

  if (!template) return null;

  let subject = template.subject;
  let body = template.body;

  // Reemplazar variables (usan guiones bajos en la plantilla)
  const replacements = {
    '[NOMBRE_TIENDA]': storeName,
    '[TU_NOMBRE]': 'Carlos Guerrero / Jessica',
    '[TU_EMPRENDIMIENTO]': 'Jess Vitrofusión',
    '[TU_NUMERO]': '+569XXXXXXXX',
    '[TU_WEBSITE_O_INSTAGRAM]': 'https://jessvitrofusion.art/'
  };

  for (const [key, value] of Object.entries(replacements)) {
    subject = subject.replace(new RegExp(key, 'g'), value);
    body = body.replace(new RegExp(key, 'g'), value);
  }

  return {
    subject: subject,
    body: body
  };
}

/**
 * Crea email en Notion con TODOS los datos de la tienda
 */
async function createEmailInNotion(store, draft) {
  if (!EMAILS_DATABASE_ID) {
    console.error('❌ EMAILS_DATABASE_ID no configurado');
    return false;
  }

  try {
    // Crear página con nombre de la tienda y asunto
    const page = await notion.pages.create({
      parent: { database_id: EMAILS_DATABASE_ID },
      properties: {
        'Name': {
          title: [{ text: { content: store.name } }]
        }
      }
    });

    // Agregar el cuerpo del email como bloques divididos
    const blocks = [];
    const maxCharsPerBlock = 1900;
    
    for (let i = 0; i < draft.body.length; i += maxCharsPerBlock) {
      const chunk = draft.body.substring(i, i + maxCharsPerBlock);
      blocks.push({
        object: 'block',
        type: 'paragraph',
        paragraph: {
          rich_text: [{
            type: 'text',
            text: { content: chunk }
          }]
        }
      });
    }

    if (blocks.length > 0) {
      await notion.blocks.children.append({
        block_id: page.id,
        children: blocks
      });
    }

    console.log(`  ✅ Email creado: ${store.name}`);
    return true;
  } catch (error) {
    console.error(`  ❌ Error: ${error.message}`);
    return false;
  }
}

/**
 * Función principal
 */
async function main() {
  console.log('========================================');
  console.log('  Generar Emails desde JSON');
  console.log('========================================\n');

  const filename = process.argv[2] || 'joyerias-es.json';
  const filePath = path.join(__dirname, '..', 'data', filename);
  
  if (!fs.existsSync(filePath)) {
    console.error(`❌ Archivo no encontrado: ${filePath}`);
    return;
  }

  const stores = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  console.log(`📦 Tiendas cargadas desde JSON: ${stores.length}\n`);

  if (!EMAILS_DATABASE_ID) {
    console.error('❌ EMAILS_DATABASE_ID no configurado en .env');
    console.error('Asegúrate de haber ejecutado: node src/setup-notion-exportaradar.js PAGE_ID');
    return;
  }

  // Generar emails
  console.log('📧 Generando emails...\n');
  let created = 0;

  for (const store of stores) {
    const draft = generateEmailDraft(store.name);
    
    if (!draft) continue;

    const success = await createEmailInNotion(store, draft);
    if (success) created++;

    await new Promise(resolve => setTimeout(resolve, 200));
  }

  // Resumen
  console.log('\n========================================');
  console.log('  Resumen');
  console.log('========================================');
  console.log(`  ✅ Emails creados: ${created}`);
  console.log(`  📊 Total tiendas: ${stores.length}`);
  console.log('========================================\n');

  console.log('🎯 Próximos pasos:');
  console.log('   1. Abre Notion → Dashboard ExportaRadar');
  console.log('   2. Ve a "📧 Emails Enviados"');
  console.log('   3. Verás los emails generados');
  console.log('   4. Para enviar:');
  console.log('      - Leer email');
  console.log('      - Marcar checkbox "¿Enviar?" ✅');
  console.log('      - Ejecutar: npm run exporta:send\n');
}

// Ejecutar
main().catch(console.error);
