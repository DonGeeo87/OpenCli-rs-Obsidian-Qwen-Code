# 🎯 OpenCli-rs Intelligence System

> **Tu sistema de inteligencia de mercado automatizado con opencli-rs**

![Estado](https://img.shields.io/badge/estado-en%20progreso-yellow)
![Fase](https://img.shields.io/badge/fase-2%20completada-green)
![Trends/día](https://img.shields.io/badge/trends-50%2Fd%C3%ADa-blue)
![Menciones/día](https://img.shields.io/badge/menciones-~64%2Fd%C3%ADa-blue)

---

## 🚀 ¿Qué es esto?

Un sistema **completamente automatizado** que usa [opencli-rs](https://github.com/DonGeeo87/opencli-rs) para:

1. **📊 Recopilar tendencias** de 5+ plataformas (HackerNews, Reddit, Bilibili, Dev.to, StackOverflow)
2. **🔍 Monitorear menciones** de keywords específicas en 4 plataformas sociales
3. **📝 Inyectar automáticamente** los trends en tu Daily Note de Obsidian
4. **📈 Generar reportes** automáticos en Markdown y JSON
5. **💾 Hacer backup** diario de tu Vault con Git

**Potenciado por:** opencli-rs v0.1.3 - 55+ plataformas sin API keys

---

## 📊 Estado del Proyecto

### Fases Completadas

| Fase | Nombre | Estado | Fecha |
|------|--------|--------|-------|
| **1** | Daily Trends Digest | ✅ COMPLETADA | 2026-03-30 |
| **2** | Brand/Product Monitor | ✅ COMPLETADA | 2026-03-31 |
| **5a** | Task Scheduler | ✅ COMPLETADA | 2026-03-31 |

### Próximas Fases

| Fase | Nombre | Estado | Estimado |
|------|--------|--------|----------|
| **3** | Integración Notion/Sheets | ⏳ PENDIENTE | 2-3 hrs |
| **5b** | Notificaciones/Alertas | ⏳ PENDIENTE | 2-3 hrs |
| **4** | Dashboard Web | ⏳ PENDIENTE | 4-6 hrs |

📋 **Roadmap completo:** [[ROADMAP|Ver en Obsidian]](99-System/ROADMAP.md)

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

### En el Repositorio
- `99-System/AUTOMATION.md` - Guía completa de automatización y Task Scheduler
- `99-System/ROADMAP.md` - Roadmap detallado del proyecto
- `99-System/INDEX.md` - Centro de documentación

### En Obsidian Vault
- `99-System/INDEX.md` - Documentación completa del proyecto
- `99-System/ROADMAP.md` - Roadmap con métricas y timeline
- `99-System/Sesiones/Sesion-01-2026-03-31.md` - Registro detallado de sesiones

### Enlaces Externos
- [GitHub: opencli-rs](https://github.com/DonGeeo87/opencli-rs) - Herramienta principal
- [GitHub: opencli-rs-skill](https://github.com/DonGeeo87/opencli-rs-skill) - Skill para Qwen Code
- [Obsidian.md](https://obsidian.md/) - Tu vault de conocimiento

---

## 🎉 ¡Listo!

Tu **OpenCli-rs Intelligence System** está **100% funcional**:

✅ **Fase 1:** Daily Trends Digest (50 trends/día)  
✅ **Fase 2:** Brand/Product Monitor (64 menciones/día)  
✅ **Fase 5a:** Task Scheduler (automatización completa)  
✅ **Dashboards:** Obsidian + Dataview  
✅ **Templates:** Templater integration  
✅ **Backup:** Git automático a GitHub  

**Próximos pasos:**
- [ ] Fase 3: Integración Notion/Sheets
- [ ] Fase 5b: Notificaciones Telegram/Email
- [ ] Fase 4: Dashboard Web Next.js

📋 **Ver roadmap completo:** `99-System/ROADMAP.md`

---

*OpenCli-rs Intelligence System*  
*Fase 2 ✅ COMPLETADA | Progreso: 40%*  
*Última actualización: 2026-03-31*
