/**
 * Setup de Notion para ExportaRadar
 * Crea las databases necesarias para el dashboard de emprendedores
 * 
 * Uso: node src/setup-notion-exportaradar.js <page_id>
 */

const { Client } = require('@notionhq/client');
const fs = require('fs');
const path = require('path');

// Configuración
let NOTION_API_KEY = process.env.NOTION_API_KEY;

// Cargar desde .env si existe
const envPath = path.join(__dirname, '..', '.env');
if (!NOTION_API_KEY && fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8');
  const match = envContent.match(/NOTION_API_KEY=(.+)/);
  if (match) {
    NOTION_API_KEY = match[1].trim();
  }
}

if (!NOTION_API_KEY) {
  console.error('❌ Notion API key no configurada');
  console.error('Crea un archivo .env con tu API key');
  process.exit(1);
}

const notion = new Client({ auth: NOTION_API_KEY });

/**
 * Crear database de Tiendas/Prospectos
 */
async function createStoresDatabase(parentPageId) {
  console.log('\n📦 Creando database de Tiendas...');
  
  const response = await notion.databases.create({
    parent: { type: 'page_id', page_id: parentPageId },
    title: [{ type: 'text', text: { content: '🏪 Tiendas/Prospectos' } }],
    description: [{ type: 'text', text: { content: 'Lista de tiendas encontradas para contactar' } }],
    properties: {
      'Nombre': {
        title: {}
      },
      'País': {
        select: {
          options: [
            { name: 'España', color: 'red' },
            { name: 'Alemania', color: 'yellow' },
            { name: 'Francia', color: 'blue' },
            { name: 'Italia', color: 'green' },
            { name: 'Reino Unido', color: 'purple' },
            { name: 'Países Bajos', color: 'orange' },
            { name: 'Bélgica', color: 'red' },
            { name: 'Portugal', color: 'green' }
          ]
        }
      },
      'Email': {
        email: {}
      },
      'Website': {
        url: {}
      },
      'Estado': {
        select: {
          options: [
            { name: '🆕 Por contactar', color: 'blue' },
            { name: '📧 Contactado', color: 'yellow' },
            { name: '✅ Respondió', color: 'green' },
            { name: '❌ No interesado', color: 'red' },
            { name: '⏳ Seguimiento', color: 'orange' }
          ]
        }
      },
      'Fecha Contacto': {
        date: {}
      },
      'Notas': {
        rich_text: {}
      },
      'Keyword': {
        rich_text: {}
      }
    }
  });

  console.log(`✅ Database creada: ${response.id}`);
  return response.id;
}

/**
 * Crear database de Emails Enviados
 */
async function createEmailsDatabase(parentPageId) {
  console.log('\n📧 Creando database de Emails Enviados...');
  
  const response = await notion.databases.create({
    parent: { type: 'page_id', page_id: parentPageId },
    title: [{ type: 'text', text: { content: '📧 Emails Enviados' } }],
    description: [{ type: 'text', text: { content: 'Track de emails enviados y respuestas' } }],
    properties: {
      'Tienda': {
        title: {}
      },
      'País': {
        select: {
          options: [
            { name: 'España', color: 'red' },
            { name: 'Alemania', color: 'yellow' },
            { name: 'Francia', color: 'blue' },
            { name: 'Italia', color: 'green' },
            { name: 'Reino Unido', color: 'purple' }
          ]
        }
      },
      'Fecha Envío': {
        date: {}
      },
      'Respuesta': {
        select: {
          options: [
            { name: '⏳ Pendiente', color: 'gray' },
            { name: '✅ Sí - Positivo', color: 'green' },
            { name: '⏸️ Sí - Más info', color: 'yellow' },
            { name: '❌ No interesado', color: 'red' }
          ]
        }
      },
      'Email Tienda': {
        email: {}
      },
      'Seguimiento': {
        date: {}
      }
    }
  });

  console.log(`✅ Database creada: ${response.id}`);
  return response.id;
}

/**
 * Crear database de Estadísticas
 */
async function createStatsDatabase(parentPageId) {
  console.log('\n📊 Creando database de Estadísticas...');
  
  const response = await notion.databases.create({
    parent: { type: 'page_id', page_id: parentPageId },
    title: [{ type: 'text', text: { content: '📈 Estadísticas' } }],
    description: [{ type: 'text', text: { content: 'Métricas y progreso semanal' } }],
    properties: {
      'Semana': {
        title: {}
      },
      'Tiendas Encontradas': {
        number: { format: 'number' }
      },
      'Emails Enviados': {
        number: { format: 'number' }
      },
      'Respuestas Recibidas': {
        number: { format: 'number' }
      },
      'Tasa Respuesta': {
        formula: {
          expression: 'if(prop("Emails Enviados") > 0, prop("Respuestas Recibidas") / prop("Emails Enviados") * 100, 0)'
        }
      },
      'País': {
        select: {
          options: [
            { name: 'España', color: 'red' },
            { name: 'Alemania', color: 'yellow' },
            { name: 'Francia', color: 'blue' },
            { name: 'Italia', color: 'green' },
            { name: 'Reino Unido', color: 'purple' },
            { name: 'Todos', color: 'gray' }
          ]
        }
      }
    }
  });

  console.log(`✅ Database creada: ${response.id}`);
  return response.id;
}

/**
 * Crear página de dashboard principal
 */
async function createDashboardPage(parentPageId, databaseIds) {
  console.log('\n🎯 Creando dashboard principal...');
  
  const response = await notion.pages.create({
    parent: { type: 'page_id', page_id: parentPageId },
    properties: {
      title: [{ type: 'text', text: { content: '🚀 Dashboard ExportaRadar' } }]
    },
    children: [
      {
        object: 'block',
        type: 'paragraph',
        paragraph: {
          rich_text: [{
            type: 'text',
            text: { content: 'Bienvenidos a ExportaRadar - Tu puente para vender al mundo 🌍' }
          }]
        }
      },
      {
        object: 'block',
        type: 'callout',
        callout: {
          rich_text: [{
            type: 'text',
            text: { content: '📋 Instrucciones: Revisa las databases de abajo para ver tiendas, emails enviados y estadísticas.' }
          }],
          icon: { emoji: '💡' },
          color: 'blue_background'
        }
      },
      {
        object: 'block',
        type: 'divider',
        divider: {}
      },
      {
        object: 'block',
        type: 'heading_2',
        heading_2: {
          rich_text: [{ type: 'text', text: { content: '🏪 Tiendas para Contactar' } }]
        }
      },
      {
        object: 'block',
        type: 'paragraph',
        paragraph: {
          rich_text: [{
            type: 'text',
            text: { content: 'Lista completa de tiendas encontradas con su estado de contacto.' }
          }]
        }
      },
      {
        object: 'block',
        type: 'divider',
        divider: {}
      },
      {
        object: 'block',
        type: 'heading_2',
        heading_2: {
          rich_text: [{ type: 'text', text: { content: '📧 Emails Enviados' } }]
        }
      },
      {
        object: 'block',
        type: 'paragraph',
        paragraph: {
          rich_text: [{
            type: 'text',
            text: { content: 'Track de todos los emails enviados y sus respuestas.' }
          }]
        }
      },
      {
        object: 'block',
        type: 'divider',
        divider: {}
      },
      {
        object: 'block',
        type: 'heading_2',
        heading_2: {
          rich_text: [{ type: 'text', text: { content: '📈 Estadísticas' } }]
        }
      },
      {
        object: 'block',
        type: 'paragraph',
        paragraph: {
          rich_text: [{
            type: 'text',
            text: { content: 'Métricas de progreso semanal.' }
          }]
        }
      }
    ]
  });

  console.log(`✅ Dashboard creado: ${response.id}`);
  return response.id;
}

/**
 * Guardar configuración en archivo
 */
function saveConfig(databaseIds, dashboardId) {
  const configPath = path.join(__dirname, '..', 'config', 'notion-exportaradar.json');
  
  const config = {
    dashboardPageId: dashboardId,
    databases: databaseIds,
    createdAt: new Date().toISOString()
  };
  
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2), 'utf-8');
  console.log(`\n💾 Configuración guardada en: ${configPath}`);
}

// Main
async function main() {
  const pageId = process.argv[2];
  
  if (!pageId) {
    console.log('========================================');
    console.log('  Setup de Notion para ExportaRadar');
    console.log('========================================\n');
    console.log('Uso: node src/setup-notion-exportaradar.js <page_id>\n');
    console.log('Instrucciones:');
    console.log('1. Crea una página en Notion para ExportaRadar');
    console.log('2. Comparte la página con tu integración');
    console.log('3. Copia el page_id de la URL');
    console.log('4. Ejecuta: node src/setup-notion-exportaradar.js PAGE_ID\n');
    console.log('Ejemplo:');
    console.log('node src/setup-notion-exportaradar.js 3344821260be8019bad7efa47f99c2da\n');
    return;
  }
  
  console.log('========================================');
  console.log('  Creando Dashboard ExportaRadar');
  console.log('========================================');
  console.log(`\n📄 Página padre: ${pageId}`);
  
  try {
    // Verificar conexión
    const user = await notion.users.me();
    console.log(`✅ Conectado como: ${user.name}`);
    
    // Crear databases
    const storesDbId = await createStoresDatabase(pageId);
    const emailsDbId = await createEmailsDatabase(pageId);
    const statsDbId = await createStatsDatabase(pageId);
    
    const databaseIds = {
      stores: storesDbId,
      emails: emailsDbId,
      stats: statsDbId
    };
    
    // Crear dashboard
    const dashboardId = await createDashboardPage(pageId, databaseIds);
    
    // Guardar configuración
    saveConfig(databaseIds, dashboardId);
    
    console.log('\n========================================');
    console.log('  ✅ ¡Dashboard ExportaRadar Creado!');
    console.log('========================================\n');
    console.log('📍 Dashboard:');
    console.log(`https://www.notion.so/${dashboardId.replace(/-/g, '')}\n`);
    console.log('🎯 Próximos pasos:');
    console.log('1. Abre el dashboard en Notion');
    console.log('2. Comparte con guerrerobritocarlos@gmail.com');
    console.log('3. ¡Listo para usar!\n');
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error('\nVerifica:');
    console.log('- El page_id es correcto');
    console.log('- La página está compartida con tu integración');
    console.log('- La API key es válida\n');
  }
}

main();
