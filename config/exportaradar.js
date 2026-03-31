/**
 * Configuración de ExportaRadar
 * 
 * Instrucciones:
 * 1. Edita los valores abajo con los datos reales de tu emprendimiento
 * 2. Guarda este archivo
 * 3. ¡Listo! Los emails usarán esta información
 */

module.exports = {
  // ==================== DATOS DE TU EMPRENDIMIENTO ====================
  
  // Tu nombre o el de la persona que contacta
  nombreContacto: 'Carlos Guerrero',
  
  // Nombre del emprendimiento (ej: "VitroArte Chile")
  nombreEmprendimiento: 'Tu Emprendimiento Aquí',
  
  // Email donde quieres recibir las respuestas
  email: 'guerrerobritocarlos@gmail.com',
  
  // WhatsApp con código de país (ej: +569 para Chile)
  whatsapp: '+569XXXXXXXX',
  
  // Website o Instagram de tu emprendimiento
  website: 'https://instagram.com/tu_emprendimiento',
  
  // Años de experiencia (opcional, se usa en el email)
  anosExperiencia: 30,
  
  // Lista de productos que hacen (opcional)
  productos: [
    'collares',
    'anillos',
    'pendientes',
    'decoración',
    'piezas únicas'
  ],
  
  // ==================== CONFIGURACIÓN DE BÚSQUEDA ====================
  
  // Países donde buscar (puedes activar/desactivar)
  paises: {
    espana: true,        // 🇪🇸
    alemania: true,      // 🇩🇪
    francia: true,       // 🇫🇷
    italia: true,        // 🇮🇹
    reinoUnido: true,    // 🇬🇧
    paisesBajos: false,  // 🇳🇱
    belgica: false,      // 🇧🇪
    portugal: false      // 🇵🇹
  },
  
  // Cuántas joyerías buscar por país (20-50 está bien)
  joyeriasPorPais: 20,
  
  // ==================== CONFIGURACIÓN DE EMAILS ====================
  
  // ¿Quieres revisar los emails antes de enviar? (RECOMENDADO: true)
  revisarAntesDeEnviar: true,
  
  // ¿Cuántos emails enviar por día? (10-20 está bien para empezar)
  emailsPorDia: 15,
  
  // ==================== NOTION (OPCIONAL) ====================
  
  // Si usas Notion, pon tu API key aquí (si no, déjalo vacío)
  notionApiKey: '',
  
  // IDs de las databases en Notion (si las usas)
  notionDatabaseId: ''
};

// ==================== NOTAS ====================
// 
// Consejos:
// - Sé específico con el nombre de tu emprendimiento
// - Usa un email que revises todos los días
// - Agrega tu Instagram si tienes (ayuda a que confíen)
// - No necesitas llenar todo, solo lo que tengas
//
// ¿Dudas? Habla con Giorgio
// ====================
