/**
 * Email Generator - Genera emails personalizados para ExportaRadar
 * 
 * Uso: node src/email-generator.js [archivo-joyerias.json] [pais]
 * Ejemplo: node src/email-generator.js joyerias-es.json Spain
 */

const fs = require('fs');
const path = require('path');
const templates = require('./email-templates');

// Configuración del emprendimiento
const EMPRENDIMIENTO = {
  nombreContacto: '[TU NOMBRE]', // Reemplazar con nombre real
  nombreEmprendimiento: '[NOMBRE EMPRENDIMIENTO]', // Reemplazar
  email: 'guerrerobritocarlos@gmail.com',
  whatsapp: '[+569XXXXXXXX]', // Reemplazar
  website: '[TU WEBSITE O INSTAGRAM]', // Reemplazar
  anosExperiencia: 30,
  productos: ['collares', 'anillos', 'pendientes', 'decoración']
};

/**
 * Genera email personalizado para una joyería
 */
function generateEmail(joyeria, customConfig = {}) {
  const config = { ...EMPRENDIMIENTO, ...customConfig };
  
  // Obtener plantilla por país
  const template = getTemplateByCountry(joyeria.country);
  
  if (!template) {
    console.log(`⚠️ No hay plantilla para: ${joyeria.country}`);
    return null;
  }
  
  // Reemplazar variables en el template
  let subject = template.subject;
  let body = template.body;
  
  // Reemplazos comunes
  const replacements = {
    '[TU NOMBRE]': config.nombreContacto,
    '[TU_EMPRENDIMIENTO]': config.nombreEmprendimiento,
    '[TU_WEBSITE_O_INSTAGRAM]': config.website,
    '[TU_NUMERO]': config.whatsapp,
    '[NOMBRE_TIENDA]': joyeria.name || 'su tienda'
  };
  
  // Aplicar reemplazos
  for (const [key, value] of Object.entries(replacements)) {
    subject = subject.replace(new RegExp(key, 'g'), value);
    body = body.replace(new RegExp(key, 'g'), value);
  }
  
  return {
    to: joyeria.email,
    toName: joyeria.name,
    subject: subject,
    body: body,
    country: joyeria.country,
    language: getLanguageCode(joyeria.country),
    tone: template.tone,
    notes: template.notes
  };
}

/**
 * Obtiene plantilla por nombre de país
 */
function getTemplateByCountry(countryName) {
  const countryMap = {
    'España': 'es',
    'Alemania': 'de',
    'Francia': 'fr',
    'Italia': 'it',
    'Reino Unido': 'gb',
    'Países Bajos': 'nl',
    'Bélgica': 'be',
    'Portugal': 'pt'
  };
  
  const langCode = countryMap[countryName];
  if (langCode && templates[langCode]) {
    return templates[langCode];
  }
  
  // Fallback a inglés si no hay plantilla
  console.log(`  Usando plantilla en inglés para ${countryName}`);
  return templates.gb;
}

/**
 * Obtiene código de idioma por país
 */
function getLanguageCode(countryName) {
  const langMap = {
    'España': 'es',
    'Alemania': 'de',
    'Francia': 'fr',
    'Italia': 'it',
    'Reino Unido': 'en',
    'Países Bajos': 'nl',
    'Bélgica': 'fr',
    'Portugal': 'pt'
  };
  
  return langMap[countryName] || 'en';
}

/**
 * Genera emails para múltiples joyerías
 */
function generateBulkEmails(joyerias, customConfig = {}) {
  console.log('\n========================================');
  console.log('  Generación de Emails Personalizados');
  console.log('========================================\n');
  
  const emails = [];
  const porPais = {};
  
  for (const joyeria of joyerias) {
    const email = generateEmail(joyeria, customConfig);
    
    if (email) {
      emails.push(email);
      
      // Contar por país
      porPais[joyeria.country] = (porPais[joyeria.country] || 0) + 1;
    }
  }
  
  // Resumen
  console.log(`✅ ${emails.length} emails generados\n`);
  console.log('📊 Por país:');
  for (const [pais, cantidad] of Object.entries(porPais)) {
    console.log(`  ${pais}: ${cantidad}`);
  }
  console.log('\n========================================\n');
  
  return emails;
}

/**
 * Guarda emails generados en archivo
 */
function saveEmails(emails, filename = null) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').split('T')[0];
  const outputPath = path.join(__dirname, '..', 'data', `emails-${filename || timestamp}.json`);
  
  // Crear carpeta data si no existe
  const dataDir = path.join(__dirname, '..', 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  
  fs.writeFileSync(outputPath, JSON.stringify(emails, null, 2), 'utf-8');
  console.log(`💾 Emails guardados en: ${outputPath}`);
  
  return outputPath;
}

/**
 * Genera archivo HTML para vista previa de emails
 */
function generatePreviewHTML(emails, outputPath = null) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').split('T')[0];
  const htmlPath = outputPath || path.join(__dirname, '..', 'data', `preview-emails-${timestamp}.html`);
  
  let html = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Vista Previa de Emails - ExportaRadar</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; background: #f5f5f5; }
    .card { background: white; border-radius: 8px; padding: 20px; margin-bottom: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
    .flag { font-size: 24px; margin-right: 8px; }
    .subject { font-size: 18px; font-weight: bold; color: #333; margin-bottom: 10px; }
    .meta { color: #666; font-size: 14px; margin-bottom: 15px; }
    .email-body { background: #fafafa; padding: 15px; border-radius: 4px; white-space: pre-wrap; font-size: 14px; line-height: 1.6; }
    .copy-btn { background: #667eea; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer; font-size: 14px; margin-top: 10px; }
    .copy-btn:hover { background: #5568d3; }
    .stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 10px; margin-bottom: 20px; }
    .stat-card { background: white; padding: 15px; border-radius: 8px; text-align: center; }
    .stat-number { font-size: 24px; font-weight: bold; color: #667eea; }
    .stat-label { font-size: 12px; color: #666; }
  </style>
</head>
<body>
  <div class="header">
    <h1>🌍 ExportaRadar - Vista Previa de Emails</h1>
    <p>Emails personalizados para cada país</p>
  </div>
  
  <div class="stats">
    <div class="stat-card">
      <div class="stat-number">${emails.length}</div>
      <div class="stat-label">Emails</div>
    </div>
    <div class="stat-card">
      <div class="stat-number">${new Set(emails.map(e => e.country)).size}</div>
      <div class="stat-label">Países</div>
    </div>
    <div class="stat-card">
      <div class="stat-number">${new Set(emails.map(e => e.language)).size}</div>
      <div class="stat-label">Idiomas</div>
    </div>
  </div>
  
  ${emails.map((email, index) => `
    <div class="card">
      <div class="subject">
        <span class="flag">${getFlagEmoji(email.country)}</span>
        ${email.toName || 'Joyería'} - ${email.country}
      </div>
      <div class="meta">
        <strong>Para:</strong> ${email.to || 'No disponible'} | 
        <strong>Idioma:</strong> ${email.language.toUpperCase()} |
        <strong>Tono:</strong> ${email.tone}
      </div>
      <div style="background: #f0f0f0; padding: 10px; border-radius: 4px; margin-bottom: 10px;">
        <strong>Asunto:</strong> ${email.subject}
      </div>
      <div class="email-body">${escapeHtml(email.body)}</div>
      <button class="copy-btn" onclick="copyEmail(${index})">📋 Copiar Email</button>
    </div>
  `).join('')}
  
  <script>
    const emails = ${JSON.stringify(emails)};
    
    function copyEmail(index) {
      const email = emails[index];
      const text = email.subject + '\\n\\n' + email.body;
      navigator.clipboard.writeText(text).then(() => {
        alert('✅ Email copiado al portapapeles');
      });
    }
  </script>
</body>
</html>`;
  
  fs.writeFileSync(htmlPath, html, 'utf-8');
  console.log(`🌐 Vista previa HTML: ${htmlPath}`);
  
  return htmlPath;
}

/**
 * Obtiene emoji de bandera por país
 */
function getFlagEmoji(countryName) {
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

/**
 * Escapa HTML para seguridad
 */
function escapeHtml(text) {
  const div = { innerHTML: text };
  return div.innerHTML
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Carga joyerías desde archivo JSON
 */
function loadJewelryStores(filename) {
  const filePath = path.join(__dirname, '..', 'data', filename);
  
  if (!fs.existsSync(filePath)) {
    console.error(`❌ Archivo no encontrado: ${filePath}`);
    return null;
  }
  
  const content = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(content);
}

// Main
async function main() {
  const args = process.argv.slice(2);
  const filename = args[0];
  
  if (!filename) {
    console.log('ExportaRadar - Generador de Emails');
    console.log('\nUso: node src/email-generator.js [archivo-joyerias.json]');
    console.log('\nEjemplos:');
    console.log('  node src/email-generator.js joyerias-es.json');
    console.log('  node src/email-generator.js europa-2026-03-31.json');
    console.log('\nArchivos disponibles en src/data/:');
    
    const dataDir = path.join(__dirname, '..', 'data');
    if (fs.existsSync(dataDir)) {
      const files = fs.readdirSync(dataDir).filter(f => f.endsWith('.json') && f.includes('joyeria'));
      files.forEach(f => console.log(`  - ${f}`));
    }
    return;
  }
  
  // Cargar joyerías
  const joyerias = loadJewelryStores(filename);
  if (!joyerias || joyerias.length === 0) {
    console.error('❌ No se encontraron joyerías en el archivo');
    return;
  }
  
  console.log(`\n📦 Cargadas ${joyerias.length} joyerías desde ${filename}`);
  
  // Configurar datos del emprendimiento (aquí Giorgio puede editar)
  const customConfig = {
    nombreContacto: 'Carlos Guerrero', // TODO: Reemplazar
    nombreEmprendimiento: 'VitroArte Chile', // TODO: Reemplazar
    whatsapp: '+56912345678', // TODO: Reemplazar
    website: 'https://instagram.com/tu_emprendimiento' // TODO: Reemplazar
  };
  
  // Generar emails
  const emails = generateBulkEmails(joyerias, customConfig);
  
  // Guardar emails
  const outputFilename = filename.replace('joyerias', 'emails').replace('.json', '');
  saveEmails(emails, outputFilename);
  
  // Generar vista previa HTML
  generatePreviewHTML(emails);
  
  console.log('\n✅ ¡Emails listos para revisar!');
  console.log('\n📝 Próximos pasos:');
  console.log('  1. Abre el archivo HTML de vista previa');
  console.log('  2. Revisa que los emails estén correctos');
  console.log('  3. Copia y pega en tu email client');
  console.log('  4. ¡Envía!');
}

// Exportar
module.exports = {
  generateEmail,
  generateBulkEmails,
  saveEmails,
  generatePreviewHTML,
  loadJewelryStores,
  EMPRENDIMIENTO
};

// Ejecutar si es el script principal
if (require.main === module) {
  main().catch(console.error);
}
