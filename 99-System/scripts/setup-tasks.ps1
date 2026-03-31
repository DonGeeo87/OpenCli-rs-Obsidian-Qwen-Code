# ========================================
#   Setup Task Scheduler - opencli-rs-tools
#   Ejecutar como Administrador
#   GitHub: DonGeeo87/OpenCli-rs-Obsidian-Qwen-Code
# ========================================

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Setup Task Scheduler" -ForegroundColor Cyan
Write-Host "  opencli-rs-tools" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$PROJECT_PATH = "C:\Users\ginte\OpenCli-rs-Obsidian-Qwen-Code"
$SCRIPTS_PATH = "$PROJECT_PATH\99-System\scripts"

# Verificar si se ejecuta como administrador
$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
if (-not $isAdmin) {
    Write-Host "ERROR: Debes ejecutar este script como Administrador" -ForegroundColor Red
    Write-Host "Click derecho en PowerShell → Run as Administrator" -ForegroundColor Yellow
    pause
    exit 1
}

Write-Host "✅ Ejecutando como Administrador" -ForegroundColor Green
Write-Host ""

# ========================================
# Task 1: Daily Digest (8:00 AM)
# ========================================
Write-Host "📅 Configurando Daily Digest (8:00 AM)..." -ForegroundColor Cyan

$taskName = "opencli-rs Daily Digest"
$taskAction = New-ScheduledTaskAction -Execute "cmd.exe" -Argument "/c `"$SCRIPTS_PATH\daily-digest.bat`"" -WorkingDirectory $PROJECT_PATH
$taskTrigger = New-ScheduledTaskTrigger -Daily -At 8:00AM
$taskSettings = New-ScheduledTaskSettingsSet `
    -AllowStartIfOnBatteries `
    -DontStopIfGoingOnBatteries `
    -RunOnlyIfNetworkAvailable `
    -StartWhenAvailable `
    -ExecutionTimeLimit (New-TimeSpan -Hours 1)

# Eliminar task si ya existe
Unregister-ScheduledTask -TaskName $taskName -Confirm:$false -ErrorAction SilentlyContinue

# Registrar task
Register-ScheduledTask `
    -TaskName $taskName `
    -Action $taskAction `
    -Trigger $taskTrigger `
    -Settings $taskSettings `
    -Description "Daily Digest automático - Recopila trends e inyecta en Obsidian a las 8:00 AM" `
    -ErrorAction Stop

Write-Host "  ✅ Daily Digest configurado" -ForegroundColor Green
Write-Host ""

# ========================================
# Task 2: Brand Monitor (12:00 PM)
# ========================================
Write-Host "🔍 Configurando Brand Monitor (12:00 PM)..." -ForegroundColor Cyan

$taskName = "opencli-rs Brand Monitor"
$taskAction = New-ScheduledTaskAction -Execute "cmd.exe" -Argument "/c `"$SCRIPTS_PATH\brand-monitor.bat`"" -WorkingDirectory $PROJECT_PATH
$taskTrigger = New-ScheduledTaskTrigger -Daily -At 12:00PM
$taskSettings = New-ScheduledTaskSettingsSet `
    -AllowStartIfOnBatteries `
    -DontStopIfGoingOnBatteries `
    -RunOnlyIfNetworkAvailable `
    -StartWhenAvailable `
    -ExecutionTimeLimit (New-TimeSpan -Hours 1)

# Eliminar task si ya existe
Unregister-ScheduledTask -TaskName $taskName -Confirm:$false -ErrorAction SilentlyContinue

# Registrar task
Register-ScheduledTask `
    -TaskName $taskName `
    -Action $taskAction `
    -Trigger $taskTrigger `
    -Settings $taskSettings `
    -Description "Brand Monitor automático - Busca menciones de keywords a las 12:00 PM" `
    -ErrorAction Stop

Write-Host "  ✅ Brand Monitor configurado" -ForegroundColor Green
Write-Host ""

# ========================================
# Task 3: Vault Backup (6:00 PM)
# ========================================
Write-Host "💾 Configurando Vault Backup (6:00 PM)..." -ForegroundColor Cyan

$taskName = "Obsidian Vault Backup"
$taskAction = New-ScheduledTaskAction -Execute "cmd.exe" -Argument "/c `"$PROJECT_PATH\99-System\scripts\auto-backup.bat`"" -WorkingDirectory "C:\DonGeeo87"
$taskTrigger = New-ScheduledTaskTrigger -Daily -At 6:00PM
$taskSettings = New-ScheduledTaskSettingsSet `
    -AllowStartIfOnBatteries `
    -DontStopIfGoingOnBatteries `
    -RunOnlyIfNetworkAvailable `
    -StartWhenAvailable `
    -ExecutionTimeLimit (New-TimeSpan -Hours 2)

# Eliminar task si ya existe
Unregister-ScheduledTask -TaskName $taskName -Confirm:$false -ErrorAction SilentlyContinue

# Registrar task
Register-ScheduledTask `
    -TaskName $taskName `
    -Action $taskAction `
    -Trigger $taskTrigger `
    -Settings $taskSettings `
    -Description "Vault Backup automático - Git commit y push a GitHub a las 6:00 PM" `
    -ErrorAction Stop

Write-Host "  ✅ Vault Backup configurado" -ForegroundColor Green
Write-Host ""

# ========================================
# Resumen
# ========================================
Write-Host "========================================" -ForegroundColor Green
Write-Host "  ✅ ¡Configuración completada!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Tasks creados:" -ForegroundColor Cyan
Write-Host "  📅 opencli-rs Daily Digest (8:00 AM)"
Write-Host "  🔍 opencli-rs Brand Monitor (12:00 PM)"
Write-Host "  💾 Obsidian Vault Backup (6:00 PM)"
Write-Host ""
Write-Host "Para verificar:" -ForegroundColor Yellow
Write-Host "  1. Abre Task Scheduler"
Write-Host "  2. Busca los tasks en 'Task Scheduler Library'"
Write-Host "  3. Revisa el estado en la pestaña 'History'"
Write-Host ""
Write-Host "Para ejecutar manualmente:" -ForegroundColor Yellow
Write-Host "  cd $PROJECT_PATH"
Write-Host "  npm run inject    # Daily Digest"
Write-Host "  npm run monitor   # Brand Monitor"
Write-Host ""

pause
