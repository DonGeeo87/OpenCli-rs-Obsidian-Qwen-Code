/**
 * Limpiar datos de tiendas - Extrae nombres reales de los websites
 */

const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'data', 'joyerias-es.json');
const stores = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

console.log(`\n📦 Limpiando ${stores.length} tiendas...\n`);

const cleaned = stores.map(store => {
  // Si el nombre es "Contacto" o similar, usar el dominio
  if (['Contacto', 'Contactanos', 'Contáctanos', 'Contact us', 'Contacte con nosotros', 'Contactar con nosotros', 'Atención al cliente', 'CONTACTO', 'Contactarnos'].includes(store.name)) {
    // Extraer dominio del website
    const domain = store.website 
      ? store.website.replace(/^https?:\/\//, '')
        .replace(/\/.*$/, '')
        .replace(/^www\./, '')
        .split('.')[0]
      : 'Tienda';
    
    // Capitalizar
    const niceName = domain.charAt(0).toUpperCase() + domain.slice(1);
    
    console.log(`  🔄 "${store.name}" → "${niceName}"`);
    
    return {
      ...store,
      name: niceName,
      originalName: store.name
    };
  }
  
  return store;
});

// Guardar limpio
fs.writeFileSync(filePath, JSON.stringify(cleaned, null, 2), 'utf-8');

console.log(`\n✅ Tiendas limpiadas: ${cleaned.length}`);
console.log('\n💾 Datos guardados en joyerias-es.json\n');

// Mostrar algunas tiendas limpias
console.log('📋 Ejemplos de tiendas limpias:');
cleaned.slice(0, 10).forEach(store => {
  console.log(`  - ${store.name} (${store.website})`);
});
