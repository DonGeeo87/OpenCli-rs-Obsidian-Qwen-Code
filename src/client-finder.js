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
  { name: 'España', code: 'ES', keywords: ['tienda recuerdos', 'artesanías', 'regalos', 'decoración hogar'] },
  { name: 'Alemania', code: 'DE', keywords: ['souvenir shop', 'handmade crafts', 'gifts store', 'home decor'] },
  { name: 'Francia', code: 'FR', keywords: ['souvenirs', 'artisanat', 'cadeaux', 'décoration'] },
  { name: 'Italia', code: 'IT', keywords: ['souvenir', 'artigianato', 'regali', 'decorazione'] },
  { name: 'Reino Unido', code: 'GB', keywords: ['gift shop', 'handmade crafts', 'souvenirs', 'home gifts'] },
  { name: 'Países Bajos', code: 'NL', keywords: ['souvenir', 'handgemaakt', 'cadeaus', 'huisdecoratie'] },
  { name: 'Bélgica', code: 'BE', keywords: ['souvenirs', 'cadeaux', 'geschenken', 'ambachtelijk'] },
  { name: 'Portugal', code: 'PT', keywords: ['lembranças', 'artesanato', 'presentes', 'decoração'] }
];

// Keywords específicas para vitrofusión (más amplias)
const FUSION_KEYWORDS = [
  'glass art',
  'art glass',
  'decorative glass',
  'glass gifts',
  'glass souvenirs',
  'vidrio artístico',
  'arte en vidrio'
];

/**
 * Busca tiendas (recuerdos, artesanías, regalos) en un país específico
 */
async function searchStores(country, limit = 20) {
  console.log(`\n🔍 Buscando tiendas en ${country.name}...`);
  
  const results = [];
  const searchLimit = Math.ceil(limit / 4);
  
  // Búsqueda en Google para encontrar websites de tiendas
  for (const keyword of [...country.keywords, ...FUSION_KEYWORDS].slice(0, 4)) {
    console.log(`  Buscando: "${keyword}"...`);
    
    try {
      // opencli-rs google search --limit 10 --format json "keyword"
      const searchQuery = `"${keyword} ${country.name} contact email"`;
      const searchResults = runOpenCli('google', ['search', '--limit', String(searchLimit), searchQuery]);
      
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
    const results = await searchStores(country, perCountry);
    allResults.push(...results);
    console.log(`  ✅ ${country.name}: ${results.length} tiendas encontradas\n`);
  }
  
  // Guardar resultados
  saveResults(allResults, `tiendas-europa-${new Date().toISOString().split('T')[0]}`);
  
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
    
    console.log(`\n🔍 Buscando tiendas en ${country.name}...`);
    const results = await searchStores(country, limitArg);
    saveResults(results, country.code.toLowerCase());
    
  } else {
    // Búsqueda en todos los países (top 5 para empezar)
    const topCountries = EUROPE_COUNTRIES.slice(0, 5); // España, Alemania, Francia, Italia, UK
    await searchMultipleCountries(topCountries, limitArg);
  }
}

// Exportar
module.exports = {
  searchStores,
  searchMultipleCountries,
  EUROPE_COUNTRIES,
  saveResults
};

// Ejecutar si es el script principal
if (require.main === module) {
  main().catch(console.error);
}
