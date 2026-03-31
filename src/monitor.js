/**
 * Brand Monitor - Busca menciones de keywords en redes sociales
 * 
 * Uso: node src/monitor.js
 */

const { runOpenCli, getTodayDate, getTimestamp, ensureFolderExists, saveJsonFile } = require('./utils');
const path = require('path');
const fs = require('fs');

// Configuración
const CONFIG = require('../config.json');
const VAULT_PATH = CONFIG.vaultPath;
const BRAND_FOLDER = path.join(VAULT_PATH, CONFIG.inboxFolder, 'brand-mentions');
const KEYWORDS = CONFIG.keywords;
const PLATFORMS = CONFIG.platforms.brandMonitor.filter(p => p.enabled);

/**
 * Busca menciones de una keyword en una plataforma
 */
function searchMentions(keyword, platform) {
  console.log(`  Buscando "${keyword}" en ${platform.name}...`);
  
  try {
    const [command, ...args] = platform.command.split(' ');
    // opencli-rs search <query> -f json
    // El keyword va entre comillas si tiene espacios
    const query = keyword.includes(' ') ? `"${keyword}"` : keyword;
    const results = runOpenCli(command, [...args, query]);
    
    if (results && Array.isArray(results)) {
      return results.map(item => ({
        keyword: keyword,
        platform: platform.id,
        platformName: platform.name,
        title: item.title || 'Sin título',
        url: item.url || null,
        author: item.author || null,
        score: item.score || null,
        timestamp: getTimestamp()
      }));
    }
    return [];
  } catch (error) {
    console.error(`    Error buscando "${keyword}" en ${platform.name}:`, error.message);
    return [];
  }
}

/**
 * Genera reporte Markdown del Brand Monitor
 */
function generateReportMarkdown(mentionsData) {
  const date = getTodayDate();
  const dateObj = new Date(date + 'T12:00:00');
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const formattedDate = dateObj.toLocaleDateString('es-ES', options);

  // Agrupar menciones por keyword
  const byKeyword = {};
  KEYWORDS.forEach(kw => {
    byKeyword[kw] = { twitter: [], reddit: [], hackernews: [], bilibili: [] };
  });

  mentionsData.forEach(mention => {
    if (byKeyword[mention.keyword]) {
      byKeyword[mention.keyword][mention.platform]?.push(mention);
    }
  });

  let markdown = `---
created: ${getTimestamp()}
tags: [brand-monitor, mentions]
fecha: ${date}
keywords: [${KEYWORDS.map(k => `"${k}"`).join(', ')}]
---

# 🔍 Brand Monitor - ${date}

## 📊 Resumen Ejecutivo

| Keyword | Menciones Totales | Twitter | Reddit | HackerNews | Bilibili |
|---------|------------------|---------|--------|------------|----------|
`;

  KEYWORDS.forEach(keyword => {
    const kwMentions = byKeyword[keyword];
    const twitterCount = kwMentions.twitter.length;
    const redditCount = kwMentions.reddit.length;
    const hnCount = kwMentions.hackernews.length;
    const bilibiliCount = kwMentions.bilibili.length;
    const total = twitterCount + redditCount + hnCount + bilibiliCount;
    
    markdown += `| ${keyword} | ${total} | ${twitterCount} | ${redditCount} | ${hnCount} | ${bilibiliCount} |\n`;
  });

  markdown += `\n> **Fecha:** ${formattedDate}\n> **Total menciones:** ${mentionsData.length}\n\n---\n\n`;

  // Menciones por keyword
  markdown += `## 📌 Menciones por Keyword\n\n`;

  KEYWORDS.forEach(keyword => {
    const kwMentions = byKeyword[keyword];
    const totalMentions = Object.values(kwMentions).flat().length;
    
    if (totalMentions === 0) {
      markdown += `### ${keyword}\n\n_No se encontraron menciones para esta keyword._\n\n---\n\n`;
      return;
    }

    markdown += `### ${keyword}\n\n`;

    // Twitter
    if (kwMentions.twitter.length > 0) {
      markdown += `#### 🐦 Twitter\n\n`;
      kwMentions.twitter.forEach((m, i) => {
        markdown += `${i + 1}. [${m.title}](${m.url})`;
        if (m.author) markdown += ` por @${m.author}`;
        if (m.score) markdown += ` ⭐ ${m.score}`;
        markdown += '\n';
      });
      markdown += '\n';
    }

    // Reddit
    if (kwMentions.reddit.length > 0) {
      markdown += `#### 🔴 Reddit\n\n`;
      kwMentions.reddit.forEach((m, i) => {
        markdown += `${i + 1}. [${m.title}](${m.url})`;
        if (m.author) markdown += ` por u/${m.author}`;
        if (m.score) markdown += ` ⭐ ${m.score}`;
        if (m.comments) markdown += ` 💬 ${m.comments}`;
        markdown += '\n';
      });
      markdown += '\n';
    }

    // HackerNews
    if (kwMentions.hackernews.length > 0) {
      markdown += `#### 👨‍💻 HackerNews\n\n`;
      kwMentions.hackernews.forEach((m, i) => {
        markdown += `${i + 1}. [${m.title}](${m.url})`;
        if (m.author) markdown += ` por ${m.author}`;
        if (m.score) markdown += ` ⭐ ${m.score}`;
        if (m.comments) markdown += ` 💬 ${m.comments}`;
        markdown += '\n';
      });
      markdown += '\n';
    }

    // Bilibili
    if (kwMentions.bilibili.length > 0) {
      markdown += `#### 📺 Bilibili\n\n`;
      kwMentions.bilibili.forEach((m, i) => {
        markdown += `${i + 1}. [${m.title}](${m.url})`;
        if (m.author) markdown += ` por ${m.author}`;
        if (m.score) markdown += ` ⭐ ${m.score}`;
        markdown += '\n';
      });
      markdown += '\n';
    }

    markdown += `---\n\n`;
  });

  // Acciones
  markdown += `## 📈 Acciones a Tomar

- [ ] Responder a menciones importantes
- [ ] Investigar tendencias detectadas
- [ ] Actualizar estrategia de keywords

---

*Reporte generado con opencli-rs-tools*
`;

  return markdown;
}

/**
 * Ejecuta el Brand Monitor
 */
async function runBrandMonitor() {
  console.log('========================================');
  console.log('  Brand Monitor - opencli-rs-tools');
  console.log(`  ${getTimestamp()}`);
  console.log('========================================\n');

  ensureFolderExists(BRAND_FOLDER);

  const allMentions = [];

  // Buscar menciones de cada keyword en cada plataforma
  for (const keyword of KEYWORDS) {
    console.log(`\n🔍 Buscando menciones de: "${keyword}"`);
    
    for (const platform of PLATFORMS) {
      const mentions = searchMentions(keyword, platform);
      allMentions.push(...mentions);
      
      if (mentions.length > 0) {
        console.log(`  ✅ ${platform.name}: ${mentions.length} menciones encontradas`);
      } else {
        console.log(`  ⚠️ ${platform.name}: Sin menciones`);
      }
    }
  }

  // Guardar JSON backup
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').split('T')[1];
  const jsonPath = path.join(BRAND_FOLDER, `brand-mentions-${getTodayDate()}-${timestamp}.json`);
  saveJsonFile(jsonPath, allMentions);

  // Generar y guardar reporte Markdown
  const reportMarkdown = generateReportMarkdown(allMentions);
  const mdPath = path.join(BRAND_FOLDER, `brand-report-${getTodayDate()}.md`);
  fs.writeFileSync(mdPath, reportMarkdown, 'utf-8');
  console.log(`\n📄 Reporte Markdown: ${mdPath}`);

  // Resumen
  console.log('\n========================================');
  console.log('  Resumen del Brand Monitor');
  console.log('========================================');
  console.log(`  Keywords monitoreadas: ${KEYWORDS.length}`);
  console.log(`  Plataformas: ${PLATFORMS.length}`);
  console.log(`  Total menciones: ${allMentions.length}`);
  console.log(`  JSON: ${jsonPath}`);
  console.log(`  Markdown: ${mdPath}`);
  console.log('========================================\n');

  return allMentions;
}

// Ejecutar si es el script principal
if (require.main === module) {
  runBrandMonitor()
    .then(() => {
      console.log('✅ Brand Monitor completado');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Error en Brand Monitor:', error);
      process.exit(1);
    });
}

module.exports = { runBrandMonitor };
