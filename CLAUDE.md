# CLAUDE.md

Este archivo proporciona orientación a Claude Code (claude.ai/code) cuando trabaja con código en este repositorio.

## Ubicación del proyecto
- Este repositorio se encuentra dentro de la bóveda de Obsidian **Boveda de Obsidian** en la ruta: `C:\DonGeeo87\`
- Todas las memorias, tareas y configuraciones de sesión se almacenan en `C:\Users\ginte\.claude\projects\C--DonGeeo87\.claude\`

## Comandos
### Herramientas de desarrollo comunes
- **Construir**: `npm run build` (o `yarn build` según el gestor de paquetes)
- **Lint**: `npm run lint` (auto-fija al guardar si está configurado)
- **Ejecutar pruebas**: `npm test` (ejecuta el conjunto completo de pruebas; use `npm test --specific-test` para apuntar a pruebas específicas)
- **Ejecutar prueba específica**: `npm test -- -t test_filename` (reemplace con el identificador de prueba real si aplica)
- **Depurar**: `npm run debug` (si está configurado con modo de depuración)

## Arquitectura de alto nivel del código
El proyecto sigue una estructura modular organizada en componentes clave:

### **Componentes principales**
1. **Servicios de backend**
   - Lógica principal del servidor en `backend/main.js` o `server.js`
   - Rutas de API en `backend/routes/**/*.js`
   - Modelos de base de datos en `backend/db/models/**/*.js`

2. **Integración de frontend**
   - Componentes de UI en `frontend/components/**/*.jsx` (o `.vue` si corresponde)
   - Flujo de datos desde APIs a UI mediante `frontend/utils/data-fetching.js`

3. **Utilidades compartidas**
   - Constantes/configuración en `config/environment.js`
   - Funciones auxiliares en `utils/helpers.js`
   - Lógica de validación en `validators/validator.js`

4. **Integraciones de terceros**
   - Integraciones de pago/API en `integrations/**/*.js`
   - Envolturas de SDK externos en `sdk-wrappers/**/*.js`

### **Relaciones críticas**
- El frontend depende en gran medida de las respuestas de `/backend/api`
- El esquema de base de datos en `backend/db/schema.js` influye en todos los modelos de datos
- Los archivos de configuración en `config/` controlan variables de entorno que afectan tanto al frontend como al backend

Esta estructura enfatiza las dependencias cruzadas funcionales en lugar de listar cada archivo. Los nuevos desarrolladores deben enfocarse primero en las relaciones entre los servicios de backend, los componentes de frontend y las utilidades compartidas.

## Comandos
### Herramientas de desarrollo comunes
- **Construir**: `npm run build` (o `yarn build` según el gestor de paquetes)
- **Lint**: `npm run lint` (auto-fija al guardar si está configurado)
- **Ejecutar pruebas**: `npm test` (ejecuta el conjunto completo de pruebas; use `npm test --specific-test` para apuntar a pruebas específicas)
- **Ejecutar prueba específica**: `npm test -- -t test_filename` (reemplace con el identificador de prueba real si aplica)
- **Depurar**: `npm run debug` (si está configurado con modo de depuración)

## Arquitectura de alto nivel del código
El proyecto sigue una estructura modular organizada en componentes clave:

### **Componentes principales**
1. **Servicios de backend**
   - Lógica principal del servidor en `backend/main.js` o `server.js`
   - Rutas de API en `backend/routes/**/*.js`
   - Modelos de base de datos en `backend/db/models/**/*.js`

2. **Integración de frontend**
   - Componentes de UI en `frontend/components/**/*.jsx` (o `.vue` si corresponde)
   - Flujo de datos desde APIs a UI mediante `frontend/utils/data-fetching.js`

3. **Utilidades compartidas**
   - Constantes/configuración en `config/environment.js`
   - Funciones auxiliares en `utils/helpers.js`
   - Lógica de validación en `validators/validator.js`

4. **Integraciones de terceros**
   - Integraciones de pago/API en `integrations/**/*.js`
   - Envolturas de SDK externos en `sdk-wrappers/**/*.js`

### **Relaciones críticas**
- El frontend depende en gran medida de las respuestas de `/backend/api`
- El esquema de base de datos en `backend/db/schema.js` influye en todos los modelos de datos
- Los archivos de configuración en `config/` controlan variables de entorno que afectan tanto al frontend como al backend

Esta estructura enfatiza las dependencias cruzadas funcionales en lugar de listar cada archivo. Los nuevos desarrolladores deben enfocarse primero en las relaciones entre los servicios de backend, los componentes de frontend y las utilidades compartidas.