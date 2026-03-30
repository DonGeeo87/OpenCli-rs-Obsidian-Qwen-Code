# 🎯 Centro de Control Obsidian - opencli-rs-tools

> **Tu dashboard automatizado de tendencias y menciones de internet**

---

## 🚀 ¿Qué es esto?

Un sistema completamente automatizado que:
1. **Recopila tendencias** de 5+ plataformas (HackerNews, Reddit, Bilibili, Dev.to, StackOverflow)
2. **Inyecta automáticamente** los trends en tu Daily Note de Obsidian
3. **Monitorea menciones** de keywords específicas en redes sociales
4. **Genera reportes** automáticos en Markdown y JSON
5. **Hace backup** diario de tu Vault con Git

---

## ⚡ Comandos Rápidos

```bash
cd C:\Users\ginte\opencli-rs-tools

# Daily Digest + Inyectar en Obsidian (automático 8:00 AM)
npm run inject

# Brand Monitor (automático 12:00 PM)
npm run monitor

# Solo Daily Digest (sin inyección)
npm run digest
```

---

## 📁 Estructura del Vault

```
C:\DonGeeo87/
├── 00-Inbox/
│   ├── daily-digests/       # Backups de daily digests
│   └── brand-mentions/      # Menciones en JSON
├── 10-Daily/                # Daily Notes con trends
├── 20-Brand/
│   ├── keywords/            # Keywords configuradas
│   └── reports/             # Reportes de menciones
├── 30-Templates/            # Templates para Templater
├── 40-Dashboards/           # Dashboards con Dataview
└── 99-System/               # Scripts y configuración
```

---

## 🤖 Automatización Activa

| Task | Horario | Acción |
|------|---------|--------|
| 📅 **Daily Digest** | 8:00 AM | Recopila trends de 5 plataformas e inyecta en tu Daily Note |
| 🔍 **Brand Monitor** | 12:00 PM | Busca menciones de keywords en 4 plataformas |
| 💾 **Vault Backup** | 6:00 PM | Git commit automático de todos los cambios |

### Verificar Tasks
1. Abre **Task Scheduler** de Windows
2. Busca los tasks:
   - `opencli-rs Daily Digest`
   - `opencli-rs Brand Monitor`
   - `Obsidian Vault Backup`

---

## 📊 Plataformas Monitoreadas

### Daily Digest (5 activas)
| Plataforma | Comando | Estado |
|------------|---------|--------|
| 👨‍💻 HackerNews | `hackernews top` | ✅ |
| 🔴 Reddit | `reddit frontpage` | ✅ |
| 📺 Bilibili | `bilibili hot` | ✅ |
| 📝 Dev.to | `devto top` | ✅ |
| 💬 StackOverflow | `stackoverflow hot` | ✅ |

### Brand Monitor (4 plataformas)
| Plataforma | Búsqueda | Estado |
|------------|----------|--------|
| 🐦 Twitter | `twitter search` | ✅ |
| 🔴 Reddit | `reddit search` | ✅ |
| 👨‍💻 HackerNews | `hackernews search` | ✅ |
| 📺 Bilibili | `bilibili search` | ✅ |

**Keywords monitoreadas:**
- `opencli-rs`
- `Rust CLI`
- `AI tools`

---

## 🎯 Dashboards en Obsidian

### 1. Trends Dashboard
**Ubicación:** `40-Dashboards/trends-dashboard.md`

Muestra:
- Últimos digests diarios
- Trends por plataforma (últimos 7 días)
- Archivo histórico completo

### 2. Brand Mentions Dashboard
**Ubicación:** `40-Dashboards/brand-dashboard.md`

Muestra:
- Resumen de menciones (últimos 7 días)
- Menciones por keyword
- Menciones por plataforma
- Top menciones destacadas

### 3. Main Dashboard (Recomendado)
Crea `40-Dashboards/main-dashboard.md` con:
- Resumen de hoy
- Últimos trends
- Últimas menciones
- Stats de la semana

---

## 🔧 Configuración

### Configurar Plataformas
Edita `C:\Users\ginte\opencli-rs-tools\config.json`:

```json
{
  "platforms": [
    {
      "id": "twitter",
      "enabled": true,    // Cambiar a true para activar
      "command": "twitter trending"
    }
  ]
}
```

### Configurar Keywords
Edita `C:\Users\ginte\opencli-rs-tools\src\brand-monitor.ts`:

```typescript
const KEYWORDS = [
  'opencli-rs',
  'Rust CLI',
  'AI tools',
  'tu-keyword-aqui',  // Agregar más
];
```

### Configurar Obsidian
1. **Settings → Daily Notes**
   - Folder: `10-Daily`
   - Template: `30-Templates/daily-digest-template.md`

2. **Settings → Dataview**
   - Habilitar todas las opciones
   - Default query limit: `20`

3. **Settings → Calendar**
   - Weekly start day: `Monday`

---

## 📈 Flujo de Trabajo Recomendado

### Mañana (8:00 AM)
☕ Abres Obsidian → Tu Daily Note ya tiene los trends del día

### Mediodía (12:00 PM)
🔍 Revisas `40-Dashboards/brand-dashboard.md` para ver menciones nuevas

### Tarde (6:00 PM)
💾 Backup automático se ejecuta solo

### Cuando quieras
📊 Abres cualquier dashboard para analizar tendencias

---

## 🚨 Solución de Problemas

### Los trends no aparecen en mi Daily Note
1. Verifica que Chrome esté abierto (necesario para algunas plataformas)
2. Ejecuta manualmente: `npm run inject`
3. Revisa la consola de errores

### Dataview no muestra datos
1. Verifica que Dataview esté habilitado en Plugins
2. Asegúrate de que el frontmatter tenga los tags correctos
3. Recarga Obsidian: `Ctrl + P` → "Reload app"

### Los tasks no se ejecutan
1. Abre **Task Scheduler**
2. Verifica que los tasks estén **Enabled**
3. Revisa el **LastTaskResult** (debe ser 0)
4. Ejecuta manualmente los `.bat` para debuggear

### opencli-rs da error
1. Verifica que la extensión de Chrome esté cargada
2. Ejecuta: `opencli-rs doctor`
3. Reinstala la extensión si es necesario

---

## 📚 Documentación Adicional

- `AUTOMATION.md` - Guía detallada de automatización
- `99-System/DATAVIEW-SETUP.md` - Configuración de Dataview
- `README.md` - Documentación de opencli-rs-tools

---

## 🎉 ¡Listo!

Tu Centro de Control está **100% automatizado**:

✅ Daily Digest a las 8:00 AM  
✅ Brand Monitor a las 12:00 PM  
✅ Vault Backup a las 6:00 PM  
✅ Dashboards con Dataview  
✅ Templates con Templater  
✅ Calendar integration  

**Solo abre Obsidian y disfruta de tus trends automáticos** 🚀

---

*Centro de Control Obsidian + opencli-rs-tools*  
*Última actualización: 2026-03-30*
