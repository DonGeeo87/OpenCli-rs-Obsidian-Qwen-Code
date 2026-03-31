/**
 * Cargar Tiendas a Notion - Importa tiendas desde JSON a Notion
 * 
 * Uso: node src/load-stores-to-notion.js [archivo.json]
 */

require('dotenv').config();
const { Client } = require('@notionhq/client');
const fs = require('fs');
const path = require('path');

// Configuración
const NOTION_API_KEY = process.env.NOTION_API_KEY;
const STORES_DATABASE_ID = process.env.NOTION_STORES_DATABASE_ID;

const notion = new Client({ auth: NOTION_API_KEY });

/**
 * Carga tiendas desde archivo JSON a Notion
 */
async function loadStoresToNotion(filename) {
  console.log('========================================');
  console.log('  Cargando Tiendas a Notion');
  console.log('========================================\n');

  if (!STORES_DATABASE_ID) {
    console.error('❌ NOTION_STORES_DATABASE_ID no configurado');
    console.error('Ejecuta: node src/setup-notion-exportaradar.js PAGE_ID');
    return;
  }

  // Cargar archivo JSON
  const filePath = path.join(__dirname, '..', 'data', filename);
  
  if (!fs.existsSync(filePath)) {
    console.error(`❌ Archivo no encontrado: ${filePath}`);
    return;
  }

  const stores = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  console.log(`📦 Tiendas cargadas desde JSON: ${stores.length}\n`);

  // Cargar a Notion
  let created = 0;
  let skipped = 0;
  let errors = 0;

  for (const store of stores) {
    try {
      // Usar solo propiedades básicas que existen en todas las databases
      const properties = {
        'Name': {
          title: [{ text: { content: `${store.name || 'Tienda'} (${store.country})` } }]
        }
      };
      
      // Agregar Email si existe
      if (store.email) {
        properties['Email'] = { email: store.email };
      }
      
      // Agregar Website si existe
      if (store.website) {
        properties['Website'] = { url: store.website };
      }

      await notion.pages.create({
        parent: { database_id: STORES_DATABASE_ID },
        properties
      });

      console.log(`  ✅ ${store.name || 'Tienda'} (${store.country})`);
      created++;
    } catch (error) {
      console.error(`  ❌ Error: ${error.message}`);
      errors++;
    }

    // Pequeña pausa para no saturar API
    await new Promise(resolve => setTimeout(resolve, 200));
  }

  // Resumen
  console.log('\n========================================');
  console.log('  Resumen');
  console.log('========================================');
  console.log(`  ✅ Creadas: ${created}`);
  console.log(`  ❌ Errores: ${errors}`);
  console.log(`  📊 Total: ${stores.length}`);
  console.log('========================================\n');

  console.log('🎯 Próximos pasos:');
  console.log('   1. Abre Notion → Dashboard ExportaRadar');
  console.log('   2. Ve a "🏪 Tiendas/Prospectos"');
  console.log('   3. Verás las tiendas cargadas');
  console.log('   4. Ejecuta: npm run exporta:sync\n');
}

// Main
const filename = process.argv[2] || 'joyerias-es.json';
loadStoresToNotion(filename).catch(console.error);
