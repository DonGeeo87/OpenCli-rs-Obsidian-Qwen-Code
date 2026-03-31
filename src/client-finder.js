/**
 * Client Finder - Busca joyerías y tiendas de accesorios en Europa
 * 
 * Uso: node src/client-finder.js [país] [cantidad]
 * Ejemplo: node src/client-finder.js Spain 20
 */

const { runOpenCli } = require('./utils');
const fs = require('fs');
const path = require('path');

// Países objetivo en Europa
const EUROPE_COUNTRIES = [
  { name: 'España', code: 'ES', keywords: ['tienda de joyas', 'joyería artesanal', 'bisutería artística'] },
  { name: 'Alemania', code: 'DE', keywords: ['jewelry store', 'handmade jewelry', 'kunstschmuck'] },
  { name: 'Francia', code: 'FR', keywords: ['bijouterie', 'jewelry store', 'bijoux faits main'] },
  { name: 'Italia', code: 'IT', keywords: ['gioielleria', 'gioielli artigianali', 'jewelry store'] },
  { name: 'Reino Unido', code: 'GB', keywords: ['jewelry store', 'handmade jewelry', 'artisan jewelry'] },
  { name: 'Países Bajos', code: 'NL', keywords: ['sieraden winkel', 'jewelry store', 'handgemaakte sieraden'] },
  { name: 'Bélgica', code: 'BE', keywords: ['bijouterie', 'jewelry store', 'sieraden'] },
  { name: 'Portugal', code: 'PT', keywords: ['joalharia', 'jewelry store', 'joias artesanais'] }
];

// Keywords específicas para vitrofusión
const FUSION_KEYWORDS = [
  'fused glass jewelry',
  'kiln formed glass',
  'glass art jewelry',
  'vitrofusion',
  'vidrio fusionado',
  'glass jewelry store'
];

/**
 * Busca joyerías en un país específico
 */
async function searchJewelryStores(country, limit = 20) {
  console.log(`\n🔍 Buscando joyerías en ${country.name}...`);
  
  const results = [];
  
  // Búsqueda en Google para encontrar websites de joyerías
  for (const keyword of [...country.keywords, ...FUSION_KEYWORDS].slice(0, 3)) {
    console.log(`  Buscando: "${keyword}"...`);
    
    try {
      const searchResults = runOpenCli('google', ['search', `${keyword} ${country.name} contact email`, '-n', String(Math.ceil(limit / 3))]);
      
      if (searchResults && Array.isArray(searchResults)) {
        for (const result of searchResults) {
          if (result.title && result.url) {
            results.push({
              name: extractBusinessName(result.title),
              country: country.name,
              countryCode: country.code,
              website: result.url,
              email: extractEmail(result.snippet || ''),
              source: 'google',
              keyword: keyword
            });
          }
        }
      }
    } catch (error) {
      console.log(`  ⚠️ Error en búsqueda: ${error.message}`);
    }
  }
  
  // Búsqueda en Instagram para joyerías
  console.log(`  Buscando en Instagram...`);
  try {
    const instagramResults = runOpenCli('instagram', ['search', `jewelry store ${country.name}`, '-n', String(Math.ceil(limit / 2))]);
    
    if (instagramResults && Array.isArray(instagramResults)) {
      for (const result of instagramResults.slice(0, Math.ceil(limit / 2))) {
        results.push({
          name: result.username || result.name || 'Joyería',
          country: country.name,
          countryCode: country.code,
          instagram: result.url || `https://instagram.com/${result.username}`,
          email: extractEmail(result.bio || ''),
          source: 'instagram'
        });
      }
    }
  } catch (error) {
    console.log(`  ⚠️ Instagram no disponible: ${error.message}`);
  }
  
  // Remover duplicados y limitar
  const uniqueResults = removeDuplicates(results);
  return uniqueResults.slice(0, limit);
}

/**
 * Extrae nombre de negocio de un título
 */
function extractBusinessName(title) {
  // Limpieza básica
  const clean = title
    .replace(/[-|»•].*$/, '') // Remover todo después de - | » •
    .replace(/^(tienda|shop|store|joyería|jewelry).*/i, '') // Remover prefijos
    .trim();
  
  return clean || title.split(' ').slice(0, 3).join(' ');
}

/**
 * Extrae email de un texto
 */
function extractEmail(text) {
  const emailRegex = /[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}/g;
  const matches = text.match(emailRegex);
  return matches ? matches[0] : null;
}

/**
 * Remueve resultados duplicados
 */
function removeDuplicates(results) {
  const seen = new Set();
  return results.filter(item => {
    const key = (item.website || item.instagram || item.name).toLowerCase();
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
}

/**
 * Guarda resultados en JSON
 */
function saveResults(results, filename = null) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').split('T')[0];
  const outputPath = path.join(__dirname, '..', 'data', `joyerias-${filename || timestamp}.json`);
  
  // Crear carpeta data si no existe
  const dataDir = path.join(__dirname, '..', 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  
  fs.writeFileSync(outputPath, JSON.stringify(results, null, 2), 'utf-8');
  console.log(`\n💾 Resultados guardados en: ${outputPath}`);
  console.log(`📊 Total: ${results.length} joyerías encontradas`);
  
  return outputPath;
}

/**
 * Búsqueda masiva en múltiples países
 */
async function searchMultipleCountries(countries, totalLimit = 100) {
  console.log('========================================');
  console.log('  ExportaRadar - Búsqueda de Joyerías');
  console.log('========================================\n');
  
  const allResults = [];
  const perCountry = Math.ceil(totalLimit / countries.length);
  
  for (const country of countries) {
    const results = await searchJewelryStores(country, perCountry);
    allResults.push(...results);
    console.log(`  ✅ ${country.name}: ${results.length} joyerías encontradas\n`);
  }
  
  // Guardar resultados
  saveResults(allResults, `europa-${new Date().toISOString().split('T')[0]}`);
  
  // Resumen por país
  console.log('\n========================================');
  console.log('  Resumen por País');
  console.log('========================================');
  
  const byCountry = {};
  for (const result of allResults) {
    byCountry[result.country] = (byCountry[result.country] || 0) + 1;
  }
  
  for (const [country, count] of Object.entries(byCountry)) {
    const flag = getCountryFlag(country);
    console.log(`  ${flag} ${country}: ${count} joyerías`);
  }
  
  console.log(`\n  Total: ${allResults.length} joyerías`);
  console.log('========================================\n');
  
  return allResults;
}

/**
 * Obtiene emoji de bandera por país
 */
function getCountryFlag(countryName) {
  const flags = {
    'España': '🇪🇸',
    'Alemania': '🇩🇪',
    'Francia': '🇫🇷',
    'Italia': '🇮🇹',
    'Reino Unido': '🇬🇧',
    'Países Bajos': '🇳🇱',
    'Bélgica': '🇧🇪',
    'Portugal': '🇵🇹'
  };
  return flags[countryName] || '🌍';
}

// Main
async function main() {
  const args = process.argv.slice(2);
  const countryArg = args[0];
  const limitArg = parseInt(args[1]) || 20;
  
  if (countryArg && countryArg !== 'all') {
    // Búsqueda en un país específico
    const country = EUROPE_COUNTRIES.find(c => 
      c.name.toLowerCase() === countryArg.toLowerCase() || 
      c.code.toLowerCase() === countryArg.toLowerCase()
    );
    
    if (!country) {
      console.error(`❌ País no encontrado: ${countryArg}`);
      console.log('Países disponibles:', EUROPE_COUNTRIES.map(c => c.name).join(', '));
      return;
    }
    
    console.log(`\n🔍 Buscando joyerías en ${country.name}...`);
    const results = await searchJewelryStores(country, limitArg);
    saveResults(results, country.code.toLowerCase());
    
  } else {
    // Búsqueda en todos los países (top 5 para empezar)
    const topCountries = EUROPE_COUNTRIES.slice(0, 5); // España, Alemania, Francia, Italia, UK
    await searchMultipleCountries(topCountries, limitArg);
  }
}

// Exportar
module.exports = {
  searchJewelryStores,
  searchMultipleCountries,
  EUROPE_COUNTRIES,
  saveResults
};

// Ejecutar si es el script principal
if (require.main === module) {
  main().catch(console.error);
}
