/**
 * Cron Sender - Envío automático de emails cada 5 minutos
 * 
 * Revisa emails con checkbox "¿Enviar?" marcado en Notion
 * y los envía automáticamente vía Resend
 * 
 * Uso: node src/cron-sender.js
 */

require('dotenv').config();
const cron = require('node-cron');
const { sendEmail, getPendingEmails } = require('./send-emails');
const { Client } = require('@notionhq/client');

// Configuración
const NOTION_API_KEY = process.env.NOTION_API_KEY;
const EMAILS_DATABASE_ID = process.env.NOTION_EMAILS_DATABASE_ID;
const INTERVAL_MINUTOS = parseInt(process.env.INTERVALO_ENVIO_MINUTOS) || 5;
const EMAILS_POR_ENVIO = parseInt(process.env.EMAILS_POR_ENVIO) || 2;

const notion = new Client({ auth: NOTION_API_KEY });

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
  } catch (error) {
    console.error(`  ⚠️ Error actualizando Notion: ${error.message}`);
  }
}

/**
 * Tarea que se ejecuta cada X minutos
 */
async function sendPendingEmails() {
  console.log(`\n[${new Date().toLocaleString()}] 🔄 Revisando emails pendientes...`);

  const pendingEmails = await getPendingEmails();

  if (pendingEmails.length === 0) {
    console.log('   ✅ No hay emails pendientes\n');
    return;
  }

  console.log(`   📋 Emails pendientes: ${pendingEmails.length}\n`);

  // Enviar emails (límite por ejecución)
  const toSend = pendingEmails.slice(0, EMAILS_POR_ENVIO);
  
  for (const email of toSend) {
    const result = await sendEmail(email);
    await updateEmailStatus(email.id, result);

    // Pausa anti-spam
    if (toSend.indexOf(email) < toSend.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }

  console.log('');
}

/**
 * Configurar cron job
 */
function startCron() {
  console.log('========================================');
  console.log('  ExportaRadar - Cron Sender');
  console.log('========================================\n');

  console.log('⚙️ Configuración:');
  console.log(`   Intervalo: Cada ${INTERVAL_MINUTOS} minutos`);
  console.log(`   Emails por envío: ${EMAILS_POR_ENVIO}`);
  console.log(`   Máximo emails/hora: ${EMAILS_POR_ENVIO * (60 / INTERVAL_MINUTOS)}`);
  console.log(`   Máximo emails/día: ${EMAILS_POR_ENVIO * (60 / INTERVAL_MINUTOS) * 24}`);
  console.log('');

  // Programar cron job
  // Ejecuta cada X minutos
  const cronExpression = `*/${INTERVAL_MINUTOS} * * * *`;
  
  console.log(`🕐 Cron expression: ${cronExpression}`);
  console.log('   (Cada 5 minutos, 0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55)');
  console.log('');

  // Ejecutar inmediatamente la primera vez
  console.log('🚀 Ejecutando primera revisión...');
  sendPendingEmails();

  // Programar ejecuciones futuras
  cron.schedule(cronExpression, () => {
    sendPendingEmails();
  });

  console.log('✅ Cron job iniciado');
  console.log('');
  console.log('💡 Para detener: Presiona Ctrl+C');
  console.log('');
  console.log('📊 Próximas ejecuciones:');
  
  // Mostrar próximas 5 ejecuciones
  for (let i = 1; i <= 5; i++) {
    const nextTime = new Date(Date.now() + i * INTERVAL_MINUTOS * 60 * 1000);
    console.log(`   ${i}. ${nextTime.toLocaleString()}`);
  }
  console.log('');
}

// Manejar cierre graceful
process.on('SIGINT', () => {
  console.log('\n\n👋 Deteniendo cron job...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n\n👋 Deteniendo cron job...');
  process.exit(0);
});

// Iniciar
startCron();
