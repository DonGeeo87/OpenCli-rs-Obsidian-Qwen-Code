# 🔧 Configuración de Notion Integration

> Guía paso a paso para configurar la integración con Notion

---

## 📋 Paso 1: Obtener API Key de Notion

1. Ve a [Notion Integrations](https://www.notion.so/my-integrations)
2. Crea una nueva integración o usa una existente
3. Copia el **Internal Integration Token**

4. Crea un archivo `.env` en la raíz del proyecto:
   ```bash
   NOTION_API_KEY=ntn_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   ```

---

## 📋 Paso 2: Crear Página en Notion

1. Abre [Notion](https://www.notion.so/)
2. Crea una **nueva página** (ej: "OpenCli-rs Dashboard")
3. Copia el **page_id** de la URL

**¿Cómo obtener el page_id?**

La URL de una página en Notion se ve así:
```
https://www.notion.so/your-workspace/abc123xyz456?pvs=4
                                 ^^^^^^^^^^^^^^^^
                                 Este es el page_id
```

---

## 📋 Paso 3: Compartir Página con la Integración

1. En tu página de Notion, click en **⋯** (tres puntos) arriba a la derecha
2. Click en **Connect to**
3. Busca y selecciona tu integración
4. Click en **Confirm**

---

## 📋 Paso 4: Crear Databases Automáticamente

Ejecuta el script de setup con tu page_id:

```bash
cd C:\Users\ginte\OpenCli-rs-Obsidian-Qwen-Code

# Reemplaza PAGE_ID con tu page_id real
node src/notion-sync.js create-databases PAGE_ID
```

Esto creará automáticamente:
- ✅ Database de **Trends** (📊 OpenCli-rs Trends)
- ✅ Database de **Menciones** (🔍 Brand Mentions)

Los IDs de las databases se guardarán en `config/notion.json`.

---

## 📋 Paso 5: Verificar Conexión

```bash
npm run notion:setup
```

Deberías ver:
```
✅ Conectado a Notion como: Tu Nombre
```

---

## 📋 Paso 6: Sincronizar Datos

### Sincronizar Trends
```bash
npm run notion:sync-trends
```

### Sincronizar Menciones
```bash
npm run notion:sync-mentions
```

### Sincronizar Todo
```bash
npm run notion:sync-all
```

---

## 🔄 Sincronización Automática

Los scripts batch ya están configurados para sincronizar automáticamente:

**Daily Digest (8:00 AM):**
```batch
npm run inject
npm run notion:sync-trends
```

**Brand Monitor (12:00 PM):**
```batch
npm run monitor
npm run notion:sync-mentions
```

---

## 🚨 Solución de Problemas

### Error: "Could not find database"
**Solución:** Verifica los database_ids en `config/notion.json`

### Error: "API key is invalid"
**Solución:** Verifica tu `.env` con la API key correcta

### Error: "Parent page not found"
**Solución:** Comparte la página con tu integración en Notion

---

*Guía de Configuración de Notion*  
*Fase 3: Integración Notion - ✅ COMPLETADA*
