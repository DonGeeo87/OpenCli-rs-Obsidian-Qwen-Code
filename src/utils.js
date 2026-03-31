/**
 * Utilidades para opencli-rs-obsidian-tools
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Ruta a opencli-rs
const OPENCLI_PATH = process.env.OPENCLI_PATH || 'C:\\Users\\ginte\\.local\\bin\\opencli-rs.exe';

/**
 * Ejecuta un comando de opencli-rs y retorna el resultado
 */
function runOpenCli(command, args = []) {
  try {
    // Agregar formato JSON por defecto
    const jsonArgs = [...args, '-f', 'json'];
    const fullCommand = `"${OPENCLI_PATH}" ${command} ${jsonArgs.join(' ')}`;
    console.log(`Ejecutando: ${fullCommand}`);
    const output = execSync(fullCommand, { 
      encoding: 'utf-8',
      maxBuffer: 10 * 1024 * 1024 // 10MB buffer
    });
    return JSON.parse(output);
  } catch (error) {
    console.error(`Error ejecutando opencli-rs ${command}:`, error.message);
    return null;
  }
}

/**
 * Obtiene la fecha actual en formato YYYY-MM-DD
 */
function getTodayDate() {
  return new Date().toISOString().split('T')[0];
}

/**
 * Obtiene el timestamp actual en formato ISO
 */
function getTimestamp() {
  return new Date().toISOString();
}

/**
 * Crea una carpeta si no existe
 */
function ensureFolderExists(folderPath) {
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
    console.log(`Carpeta creada: ${folderPath}`);
  }
}

/**
 * Guarda datos JSON en un archivo
 */
function saveJsonFile(filePath, data) {
  ensureFolderExists(path.dirname(filePath));
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
  console.log(`Archivo guardado: ${filePath}`);
}

/**
 * Lee un archivo JSON
 */
function readJsonFile(filePath) {
  if (!fs.existsSync(filePath)) {
    return null;
  }
  const content = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(content);
}

/**
 * Formatea un trend para mostrar en Markdown
 */
function formatTrendMarkdown(item, platform, index) {
  const icons = {
    hackernews: '👨‍💻',
    reddit: '🔴',
    bilibili: '📺',
    devto: '📝',
    stackoverflow: '💬',
    twitter: '🐦'
  };
  
  const icon = icons[platform] || '📌';
  const title = item.title || 'Sin título';
  const url = item.url ? `[${title}](${item.url})` : title;
  const score = item.score ? ` ⭐ ${item.score}` : '';
  const author = item.author ? ` por @${item.author}` : '';
  
  return `${index + 1}. ${icon} ${url}${score}${author}`;
}

module.exports = {
  runOpenCli,
  getTodayDate,
  getTimestamp,
  ensureFolderExists,
  saveJsonFile,
  readJsonFile,
  formatTrendMarkdown
};
