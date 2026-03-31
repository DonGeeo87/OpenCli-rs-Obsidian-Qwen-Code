/**
 * Daily Digest - Recopila trends de 5 plataformas
 * 
 * Uso: node src/digest.js
 */

const { runOpenCli, getTodayDate, getTimestamp, ensureFolderExists, saveJsonFile } = require('./utils');
const path = require('path');

// Configuración
const CONFIG = require('../config.json');
const VAULT_PATH = CONFIG.vaultPath;
const INBOX_FOLDER = path.join(VAULT_PATH, CONFIG.inboxFolder, 'daily-digests');

// Plataformas para el daily digest
const PLATFORMS = CONFIG.platforms.dailyDigest.filter(p => p.enabled);

async function runDailyDigest() {
  console.log('========================================');
  console.log('  Daily Digest - opencli-rs-tools');
  console.log(`  ${getTimestamp()}`);
  console.log('========================================\n');

  ensureFolderExists(INBOX_FOLDER);

  const digestData = {
    date: getTodayDate(),
    timestamp: getTimestamp(),
    platforms: {}
  };

  // Recopilar trends de cada plataforma
  for (const platform of PLATFORMS) {
    console.log(`\n📊 Recopilando ${platform.name}...`);
    
    const [command, ...args] = platform.command.split(' ');
    // Agregar limit si está especificado
    if (platform.limit) {
      args.push('--limit', platform.limit.toString());
    }
    const results = runOpenCli(command, args);
    
    if (results && Array.isArray(results)) {
      const limitedResults = results.slice(0, platform.limit);
      digestData.platforms[platform.id] = {
        name: platform.name,
        items: limitedResults,
        total: limitedResults.length
      };
      console.log(`✅ ${platform.name}: ${limitedResults.length} trends obtenidos`);
    } else {
      console.log(`⚠️ ${platform.name}: No se pudieron obtener datos`);
      digestData.platforms[platform.id] = {
        name: platform.name,
        items: [],
        total: 0
      };
    }
  }

  // Guardar backup JSON
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').split('T')[1];
  const backupPath = path.join(INBOX_FOLDER, `daily-digest-${getTodayDate()}-${timestamp}.json`);
  saveJsonFile(backupPath, digestData);

  // Resumen
  console.log('\n========================================');
  console.log('  Resumen del Daily Digest');
  console.log('========================================');
  
  let totalTrends = 0;
  for (const [platformId, data] of Object.entries(digestData.platforms)) {
    console.log(`  ${data.name}: ${data.total} trends`);
    totalTrends += data.total;
  }
  console.log(`\n  Total: ${totalTrends} trends recopilados`);
  console.log(`  Backup: ${backupPath}`);
  console.log('========================================\n');

  return digestData;
}

// Ejecutar si es el script principal
if (require.main === module) {
  runDailyDigest()
    .then(() => {
      console.log('✅ Daily Digest completado');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Error en Daily Digest:', error);
      process.exit(1);
    });
}

module.exports = { runDailyDigest };
