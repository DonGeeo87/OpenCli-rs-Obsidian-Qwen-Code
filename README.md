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

## 📋 Requisitos

- ✅ **opencli-rs** instalado y configurado (daemon corriendo + extensión Chrome/Edge)
- ✅ **Node.js** v16+ instalado
- ✅ **Obsidian** con vault en `C:\DonGeeo87`
- ✅ Plugins de Obsidian: Dataview, Templater, Calendar

---

## ⚡ Comandos Rápidos

```bash
cd C:\Users\ginte\OpenCli-rs-Obsidian-Qwen-Code

# Instalar dependencias (primera vez)
npm install

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

### Configurar Plataformas y Keywords
Edita `config.json` en la raíz del proyecto:

```json
{
  "vaultPath": "C:\\DonGeeo87",
  "keywords": [
    "opencli-rs",
    "Rust CLI",
    "AI tools",
    "tu-keyword-aqui"
  ],
  "platforms": {
    "dailyDigest": [
      { "id": "hackernews", "command": "hackernews top", "enabled": true, "limit": 10 }
    ],
    "brandMonitor": [
      { "id": "twitter", "command": "twitter search", "enabled": true }
    ]
  }
}
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
1. Verifica que opencli-rs daemon esté corriendo: `opencli-rs doctor`
2. Ejecuta manualmente: `npm run inject`
3. Revisa la consola para errores específicos

### Dataview no muestra datos
1. Verifica que Dataview esté habilitado en Plugins
2. Recarga Obsidian: `Ctrl + P` → "Reload app"
3. Asegúrate de que el frontmatter tenga los tags correctos

### Los tasks no se ejecutan
1. Abre **Task Scheduler**
2. Verifica que los tasks estén **Enabled**
3. Revisa el **History** tab para errores
4. Ejecuta manualmente los `.bat` para debuggear

### opencli-rs da error
1. Verifica que la extensión de Chrome esté cargada
2. Ejecuta: `opencli-rs doctor`
3. Reinicia el daemon si es necesario

---

## 📚 Documentación Adicional

- `99-System/AUTOMATION.md` - Guía completa de automatización y Task Scheduler
- `99-System/DATAVIEW-SETUP.md` - Configuración de Dataview
- [GitHub Repo](https://github.com/DonGeeo87/OpenCli-rs-Obsidian-Qwen-Code)

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
