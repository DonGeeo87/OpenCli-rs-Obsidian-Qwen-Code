/**
 * Notion Email Sync - Genera emails en Notion desde tiendas
 * 
 * Uso: node src/notion-email-sync.js
 */

require('dotenv').config();
const { Client } = require('@notionhq/client');
const templates = require('./email-templates');

// Configuración
const NOTION_API_KEY = process.env.NOTION_API_KEY;
const STORES_DATABASE_ID = process.env.NOTION_STORES_DATABASE_ID;
const EMAILS_DATABASE_ID = process.env.NOTION_EMAILS_DATABASE_ID;

const notion = new Client({ auth: NOTION_API_KEY });

/**
 * Obtiene tiendas desde Notion
 */
async function getStoresFromNotion() {
  if (!STORES_DATABASE_ID) {
    console.error('❌ NOTION_STORES_DATABASE_ID no configurado');
    return [];
  }

  try {
    const response = await notion.databases.query({
      database_id: STORES_DATABASE_ID,
      page_size: 100
    });

    return response.results.map(page => {
      // Obtener nombre del title
      const name = page.properties.Name?.title?.[0]?.plain_text || 'Tienda';
      
      return {
        id: page.id,
        name: name,
        country: name.includes('España') ? 'España' : 'Unknown',
        email: null,
        website: null
      };
    });
  } catch (error) {
    console.error('❌ Error obteniendo tiendas:', error.message);
    return [];
  }
}

/**
 * Genera email draft para una tienda
 */
function generateEmailDraft(store) {
  const template = templates.es; // Usar español por defecto
  
  if (!template) {
    return null;
  }

  let subject = template.subject;
  let body = template.body;

  const replacements = {
    '[NOMBRE_TIENDA]': store.name,
    '[TU NOMBRE]': 'Carlos Guerrero / Jessica',
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
    body: body,
    full: `Asunto: ${subject}\n\n${body}`
  };
}

/**
 * Crea email en Notion
 */
async function createEmailInNotion(store, draft) {
  if (!EMAILS_DATABASE_ID) {
    console.error('❌ EMAILS_DATABASE_ID no configurado');
    return null;
  }

  try {
    await notion.pages.create({
      parent: { database_id: EMAILS_DATABASE_ID },
      properties: {
        'Name': {
          title: [{ text: { content: store.name } }]
        }
      },
      children: [
        {
          object: 'block',
          type: 'paragraph',
          paragraph: {
            rich_text: [{
              type: 'text',
              text: { content: draft.full }
            }]
          }
        }
      ]
    });

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
  console.log('  ExportaRadar - Sync de Emails');
  console.log('========================================\n');

  if (!STORES_DATABASE_ID || !EMAILS_DATABASE_ID) {
    console.error('❌ Database IDs no configurados en .env');
    return;
  }

  // Obtener tiendas
  console.log('📦 Obteniendo tiendas desde Notion...');
  const stores = await getStoresFromNotion();

  if (stores.length === 0) {
    console.log('⚠️ No se encontraron tiendas en Notion');
    console.log('\n💡 Primero debes cargar tiendas:');
    console.log('   node src/load-stores-simple.js joyerias-es.json');
    return;
  }

  console.log(`✅ ${stores.length} tiendas encontradas\n`);

  // Generar emails
  console.log('📧 Generando emails...\n');
  let created = 0;

  for (const store of stores) {
    const draft = generateEmailDraft(store);
    
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
  console.log('      - Marcar checkbox "¿Enviar?"');
  console.log('      - Ejecutar: npm run exporta:send\n');
}

// Ejecutar
main().catch(console.error);
