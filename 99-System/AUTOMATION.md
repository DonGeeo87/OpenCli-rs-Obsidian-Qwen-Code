# 🤖 Guía de Automatización

> Configura la automatización completa del Centro de Control Obsidian

---

## 📋 Requisitos Previos

1. **opencli-rs instalado y configurado**
   - Daemon corriendo en puerto 19825
   - Extensión de Chrome/Edge cargada
   - Verificar: `opencli-rs doctor`

2. **Node.js instalado** (v16 o superior)
   - Verificar: `node --version`

3. **Obsidian instalado**
   - Vault ubicado en `C:\DonGeeo87`

4. **Plugins de Obsidian instalados:**
   - Dataview
   - Templater
   - Calendar

---

## ⚙️ Instalación

### 1. Instalar dependencias

```bash
cd C:\Users\ginte\OpenCli-rs-Obsidian-Qwen-Code
npm install
```

### 2. Verificar configuración

Edita `config.json` si necesitas:
- Cambiar la ruta del vault
- Modificar plataformas monitoreadas
- Agregar/quitar keywords

---

## 📅 Configurar Task Scheduler

### Opción A: Usando PowerShell (Recomendado)

Ejecuta este script **como Administrador**:

```powershell
# Daily Digest - 8:00 AM
$action = New-ScheduledTaskAction -Execute "cmd.exe" -Argument "/c C:\Users\ginte\OpenCli-rs-Obsidian-Qwen-Code\99-System\scripts\daily-digest.bat"
$trigger = New-ScheduledTaskTrigger -Daily -At 8:00AM
$settings = New-ScheduledTaskSettingsSet -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries -RunOnlyIfNetworkAvailable
Register-ScheduledTask -TaskName "opencli-rs Daily Digest" -Action $action -Trigger $trigger -Settings $settings -Description "Daily Digest automático a las 8:00 AM"

# Brand Monitor - 12:00 PM
$action = New-ScheduledTaskAction -Execute "cmd.exe" -Argument "/c C:\Users\ginte\OpenCli-rs-Obsidian-Qwen-Code\99-System\scripts\brand-monitor.bat"
$trigger = New-ScheduledTaskTrigger -Daily -At 12:00PM
$settings = New-ScheduledTaskSettingsSet -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries -RunOnlyIfNetworkAvailable
Register-ScheduledTask -TaskName "opencli-rs Brand Monitor" -Action $action -Trigger $trigger -Settings $settings -Description "Brand Monitor automático a las 12:00 PM"

# Vault Backup - 6:00 PM
$action = New-ScheduledTaskAction -Execute "cmd.exe" -Argument "/c C:\Users\ginte\OpenCli-rs-Obsidian-Qwen-Code\99-System\scripts\auto-backup.bat"
$trigger = New-ScheduledTaskTrigger -Daily -At 6:00PM
$settings = New-ScheduledTaskSettingsSet -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries -RunOnlyIfNetworkAvailable
Register-ScheduledTask -TaskName "Obsidian Vault Backup" -Action $action -Trigger $trigger -Settings $settings -Description "Backup automático del Vault a las 6:00 PM"
```

### Opción B: Manualmente (GUI)

1. Abre **Task Scheduler** (Busca en Inicio)
2. Click en **Create Basic Task** (panel derecho)
3. Configura cada task:

#### Task 1: Daily Digest
- **Nombre:** `opencli-rs Daily Digest`
- **Trigger:** Daily at 8:00 AM
- **Action:** Start a program
- **Program:** `cmd.exe`
- **Arguments:** `/c C:\Users\ginte\OpenCli-rs-Obsidian-Qwen-Code\99-System\scripts\daily-digest.bat`
- **Start in:** `C:\Users\ginte\OpenCli-rs-Obsidian-Qwen-Code`

#### Task 2: Brand Monitor
- **Nombre:** `opencli-rs Brand Monitor`
- **Trigger:** Daily at 12:00 PM
- **Action:** Start a program
- **Program:** `cmd.exe`
- **Arguments:** `/c C:\Users\ginte\OpenCli-rs-Obsidian-Qwen-Code\99-System\scripts\brand-monitor.bat`
- **Start in:** `C:\Users\ginte\OpenCli-rs-Obsidian-Qwen-Code`

#### Task 3: Vault Backup
- **Nombre:** `Obsidian Vault Backup`
- **Trigger:** Daily at 6:00 PM
- **Action:** Start a program
- **Program:** `cmd.exe`
- **Arguments:** `/c C:\Users\ginte\OpenCli-rs-Obsidian-Qwen-Code\99-System\scripts\auto-backup.bat`
- **Start in:** `C:\DonGeeo87`

---

## ✅ Verificar Tasks

### Desde Task Scheduler:
1. Abre **Task Scheduler**
2. Busca en **Task Scheduler Library**
3. Deberías ver:
   - `opencli-rs Daily Digest`
   - `opencli-rs Brand Monitor`
   - `Obsidian Vault Backup`

### Ver estado con PowerShell:
```powershell
Get-ScheduledTask -TaskName "opencli-rs*"
```

### Ver historial de ejecución:
1. Click derecho en el task → **Properties**
2. Pestaña **History**
3. Revisa últimos runs

---

## 🧪 Ejecución Manual

### Daily Digest + Inject (8:00 AM)
```bash
cd C:\Users\ginte\OpenCli-rs-Obsidian-Qwen-Code
npm run inject
```

### Brand Monitor (12:00 PM)
```bash
cd C:\Users\ginte\OpenCli-rs-Obsidian-Qwen-Code
npm run monitor
```

### Solo Daily Digest (sin inyección)
```bash
cd C:\Users\ginte\OpenCli-rs-Obsidian-Qwen-Code
npm run digest
```

### Vault Backup (6:00 PM)
```bash
npm run backup
# O directamente:
99-System\scripts\auto-backup.bat
```

---

## 🔧 Configuración de Obsidian

### 1. Daily Notes
**Settings → Daily Notes**
- **Folder:** `10-Daily`
- **Template:** `30-Templates/daily-digest-template.md`
- **Format:** `YYYY-MM-DD`

### 2. Dataview
**Settings → Community Plugins → Dataview**
- ✅ Enable JavaScript Queries
- ✅ Enable Inline Queries
- **Default Query Limit:** `20`

### 3. Templater
**Settings → Community Plugins → Templater**
- **Template folder:** `30-Templates`
- ✅ Enable auto-templating

### 4. Calendar
**Settings → Community Plugins → Calendar**
- **Weekly start day:** `Monday`
- **Date format:** `YYYY-MM-DD`

---

## 📊 Flujo de Trabajo Automatizado

### Mañana (8:00 AM) ☀️
1. **Task Scheduler** ejecuta `daily-digest.bat`
2. Script recopila trends de 5 plataformas
3. Inyecta automáticamente en Daily Note
4. Guarda backup JSON en `00-Inbox/daily-digests/`

**Resultado:** Abres Obsidian y tu Daily Note ya tiene los trends

### Mediodía (12:00 PM) 🌞
1. **Task Scheduler** ejecuta `brand-monitor.bat`
2. Script busca menciones de keywords en 4 plataformas
3. Genera reporte Markdown y JSON
4. Guarda en `00-Inbox/brand-mentions/`

**Resultado:** Revisas `40-Dashboards/brand-dashboard.md` para ver menciones

### Tarde (6:00 PM) 🌆
1. **Task Scheduler** ejecuta `auto-backup.bat`
2. Script hace git add/commit de todos los cambios
3. Hace push a GitHub

**Resultado:** Vault respaldeado automáticamente en GitHub

---

## 🚨 Solución de Problemas

### Task no se ejecuta

1. **Verificar estado:**
   ```powershell
   Get-ScheduledTask -TaskName "opencli-rs Daily Digest" | Select-Object State, LastRunResult
   ```
   - `State` debe ser `Ready`
   - `LastRunResult` debe ser `0`

2. **Ejecutar manualmente:**
   ```bash
   npm run inject
   ```

3. **Revisar logs:**
   - Task Scheduler → History tab
   - Ver errores específicos

### opencli-rs da error

1. **Verificar daemon:**
   ```bash
   opencli-rs doctor
   ```

2. **Reiniciar daemon:**
   ```bash
   # Detener
   taskkill /F /IM opencli-rs.exe
   # Iniciar
   opencli-rs daemon start
   ```

3. **Verificar extensión:**
   - Chrome/Edge: `edge://extensions/`
   - Extensión debe estar **Enabled**

### Trends no aparecen en Daily Note

1. **Verificar formato de Daily Note:**
   - Debe tener `## 🔥 Trends del Día`
   - Debe tener `## ✅ Tareas del Día`

2. **Ejecutar manualmente:**
   ```bash
   npm run inject
   ```

3. **Revisar consola** para errores específicos

### Dataview no muestra datos

1. **Recargar Obsidian:**
   - `Ctrl + P` → "Reload app"

2. **Verificar Dataview habilitado:**
   - Settings → Community Plugins → Dataview ✅

3. **Revisar queries:**
   - Asegurar que paths son correctos
   - Verificar frontmatter tiene tags correctos

---

## 📝 Personalización

### Agregar nueva plataforma

Edita `config.json`:

```json
{
  "platforms": {
    "dailyDigest": [
      {
        "id": "nueva-plataforma",
        "name": "Nueva Plataforma",
        "command": "platform command",
        "enabled": true,
        "limit": 10
      }
    ]
  }
}
```

### Agregar nueva keyword

Edita `config.json`:

```json
{
  "keywords": [
    "opencli-rs",
    "Rust CLI",
    "AI tools",
    "tu-nueva-keyword"
  ]
}
```

### Cambiar horarios

Edita los tasks en Task Scheduler:
- Click derecho → **Properties**
- Pestaña **Triggers** → **Edit**
- Cambiar hora

---

## 🎯 Métricas y Monitoreo

### Ver logs de ejecución

```powershell
# Daily Digest logs
Get-ScheduledTaskInfo -TaskName "opencli-rs Daily Digest"

# Brand Monitor logs
Get-ScheduledTaskInfo -TaskName "opencli-rs Brand Monitor"

# Backup logs
Get-ScheduledTaskInfo -TaskName "Obsidian Vault Backup"
```

### Dashboard de actividad

Abre `40-Dashboards/main-dashboard.md` en Obsidian para ver:
- Últimas ejecuciones
- Total trends por día
- Total menciones por keyword
- Stats semanales

---

## 🔗 Recursos Adicionales

- [README.md](../README.md) - Documentación principal
- [DATAVIEW-SETUP.md](./DATATVIEW-SETUP.md) - Configuración de Dataview
- [GitHub Repo](https://github.com/DonGeeo87/OpenCli-rs-Obsidian-Qwen-Code)

---

*Guía de Automatización - opencli-rs-tools*
*Última actualización: 2026-03-30*
