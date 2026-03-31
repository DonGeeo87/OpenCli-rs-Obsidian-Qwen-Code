/**
 * Cargar Tiendas a Notion - Versión simple (solo Name)
 * 
 * Uso: node src/load-stores-simple.js [archivo.json]
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

  // Cargar a Notion (solo Name - las otras propiedades se agregan manual)
  let created = 0;
  let errors = 0;

  for (const store of stores) {
    try {
      const storeName = store.name || 'Tienda';
      const displayName = `${storeName} (${store.country})`;
      
      await notion.pages.create({
        parent: { database_id: STORES_DATABASE_ID },
        properties: {
          'Name': {
            title: [{ text: { content: displayName } }]
          }
        }
      });

      console.log(`  ✅ ${displayName}`);
      created++;
    } catch (error) {
      console.error(`  ❌ Error: ${error.message}`);
      errors++;
    }

    // Pequeña pausa
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

  console.log('⚠️  Las tiendas se crearon solo con el nombre.');
  console.log('   Para agregar Email, Website, etc., debes:');
  console.log('   1. Abrir Notion → Tiendas/Prospectos');
  console.log('   2. Agregar columnas manualmente:');
  console.log('      - Email (Email)');
  console.log('      - Website (URL)');
  console.log('      - País (Select)');
  console.log('      - Estado (Select)');
  console.log('   3. Luego ejecutar: npm run exporta:sync\n');
}

// Main
const filename = process.argv[2] || 'joyerias-es.json';
loadStoresToNotion(filename).catch(console.error);
