/**
 * Inject - Ejecuta Daily Digest e inyecta los trends en la Daily Note de Obsidian
 * 
 * Uso: node src/inject.js
 */

const { runDailyDigest } = require('./digest');
const { getTodayDate, getTimestamp, ensureFolderExists, formatTrendMarkdown } = require('./utils');
const fs = require('fs');
const path = require('path');

// Configuración
const CONFIG = require('../config.json');
const VAULT_PATH = CONFIG.vaultPath;
const DAILY_FOLDER = path.join(VAULT_PATH, CONFIG.dailyNotesFolder);

/**
 * Genera el contenido Markdown del Daily Digest
 */
function generateDigestMarkdown(digestData) {
  const date = digestData.date;
  const dateObj = new Date(date + 'T12:00:00');
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const formattedDate = dateObj.toLocaleDateString('es-ES', options);

  let markdown = `---
created: ${getTimestamp()}
tags: [daily-digest, trends]
fecha: ${date}
plataformas: ${Object.values(digestData.platforms).map(p => p.name).join(', ')}
---

# ${date}

## 📅 Día
${formattedDate}

## 🎯 Focus del Día


## 📝 Notas


## 🔥 Trends del Día

---

`;

  // Agregar trends por plataforma
  for (const [platformId, platformData] of Object.entries(digestData.platforms)) {
    if (platformData.items.length === 0) continue;

    markdown += `### ${platformData.name}\n\n`;
    
    platformData.items.forEach((item, index) => {
      markdown += formatTrendMarkdown(item, platformId, index) + '\n';
    });
    
    markdown += '\n---\n\n';
  }

  markdown += `## ✅ Tareas del Día
- [ ]

## 📚 Referencias


---
*Nota creada automáticamente con opencli-rs-tools*
`;

  return markdown;
}

/**
 * Inyecta el digest en la Daily Note
 */
async function injectToDailyNote(digestData) {
  console.log('\n📝 Inyectando trends en Daily Note...\n');

  ensureFolderExists(DAILY_FOLDER);

  const date = getTodayDate();
  const dailyNotePath = path.join(DAILY_FOLDER, `Daily-${date}.md`);

  // Verificar si ya existe la Daily Note
  let existingContent = '';
  let fileExists = false;
  
  if (fs.existsSync(dailyNotePath)) {
    existingContent = fs.readFileSync(dailyNotePath, 'utf-8');
    fileExists = true;
    console.log(`📄 Daily Note existente encontrada: ${dailyNotePath}`);
  } else {
    console.log(`📄 Creando nueva Daily Note: ${dailyNotePath}`);
  }

  // Generar contenido del digest
  const digestMarkdown = generateDigestMarkdown(digestData);

  // Si el archivo ya existe, actualizar la sección de trends
  if (fileExists) {
    // Buscar si ya existe una sección de "## 🔥 Trends del Día"
    const trendsSectionRegex = /## 🔥 Trends del Día[\s\S]*?(?=## |$)/;
    const match = existingContent.match(trendsSectionRegex);
    
    if (match) {
      // Reemplazar sección existente
      const newContent = existingContent.replace(
        trendsSectionRegex,
        '## 🔥 Trends del Día\n\n' + digestMarkdown.match(/## 🔥 Trends del Día([\s\S]*?)## ✅ Tareas del Día/)[1]
      );
      fs.writeFileSync(dailyNotePath, newContent, 'utf-8');
      console.log(`✅ Daily Note actualizada exitosamente`);
    } else {
      // Agregar sección de trends antes de "## ✅ Tareas del Día"
      const tasksRegex = /## ✅ Tareas del Día/;
      if (tasksRegex.test(existingContent)) {
        const newContent = existingContent.replace(
          tasksRegex,
          digestMarkdown.match(/## 🔥 Trends del Día([\s\S]*?)## ✅ Tareas del Día/)[1] + '\n## ✅ Tareas del Día'
        );
        fs.writeFileSync(dailyNotePath, newContent, 'utf-8');
        console.log(`✅ Daily Note actualizada exitosamente`);
      } else {
        // Agregar al final
        fs.appendFileSync(dailyNotePath, '\n\n' + digestMarkdown, 'utf-8');
        console.log(`✅ Daily Note actualizada exitosamente`);
      }
    }
  } else {
    // Crear nuevo archivo
    fs.writeFileSync(dailyNotePath, digestMarkdown, 'utf-8');
    console.log(`✅ Daily Note creada exitosamente`);
  }

  console.log(`📍 Ruta: ${dailyNotePath}`);
  return dailyNotePath;
}

/**
 * Ejecuta el flujo completo: Daily Digest + Inyección
 */
async function runInject() {
  console.log('========================================');
  console.log('  Inject - Daily Digest → Obsidian');
  console.log(`  ${getTimestamp()}`);
  console.log('========================================\n');

  // Ejecutar Daily Digest
  const digestData = await runDailyDigest();

  // Inyectar en Daily Note
  await injectToDailyNote(digestData);

  console.log('\n========================================');
  console.log('  ✅ Inject completado exitosamente');
  console.log('========================================\n');

  return digestData;
}

// Ejecutar si es el script principal
if (require.main === module) {
  runInject()
    .then(() => {
      console.log('🎉 ¡Trends inyectados en Obsidian!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Error en Inject:', error);
      process.exit(1);
    });
}

module.exports = { runInject, injectToDailyNote };
