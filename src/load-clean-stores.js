/**
 * Cargar Tiendas LIMPIAS a Notion
 * 
 * Uso: node src/load-clean-stores.js [archivo.json]
 */

require('dotenv').config();
const { Client } = require('@notionhq/client');
const fs = require('fs');
const path = require('path');

// Configuración
const NOTION_API_KEY = process.env.NOTION_API_KEY;
const STORES_DATABASE_ID = process.env.NOTION_STORES_DATABASE_ID;

const notion = new Client({ auth: NOTION_API_KEY });

async function main() {
  console.log('========================================');
  console.log('  Cargando Tiendas LIMPIAS a Notion');
  console.log('========================================\n');

  if (!STORES_DATABASE_ID) {
    console.error('❌ NOTION_STORES_DATABASE_ID no configurado');
    return;
  }

  const filename = process.argv[2] || 'joyerias-es.json';
  const filePath = path.join(__dirname, '..', 'data', filename);
  
  if (!fs.existsSync(filePath)) {
    console.error(`❌ Archivo no encontrado: ${filePath}`);
    return;
  }

  const stores = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  console.log(`📦 Tiendas a cargar: ${stores.length}\n`);

  let created = 0;

  for (const store of stores) {
    try {
      await notion.pages.create({
        parent: { database_id: STORES_DATABASE_ID },
        properties: {
          'Name': {
            title: [{ text: { content: store.name } }]
          }
        }
      });

      console.log(`  ✅ ${store.name}`);
      created++;
    } catch (error) {
      console.error(`  ❌ ${store.name}: ${error.message}`);
    }

    await new Promise(resolve => setTimeout(resolve, 150));
  }

  console.log(`\n========================================`);
  console.log(`  ✅ Creadas: ${created}/${stores.length}`);
  console.log(`========================================\n`);
}

main().catch(console.error);
