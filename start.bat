@echo off
REM ========================================
REM   Inicio Rápido - opencli-rs-tools
REM   Menu de opciones para ejecutar manualmente
REM ========================================

:MENU
cls
echo ========================================
echo   opencli-rs-tools - Inicio Rápido
echo   Centro de Control Obsidian
echo ========================================
echo.
echo   Elige una opcion:
echo.
echo   1. Ejecutar Daily Digest (Inject)
echo   2. Ejecutar Brand Monitor
echo   3. Ejecutar Solo Digest (sin inyeccion)
echo   4. Ejecutar Vault Backup
echo   5. Verificar opencli-rs
echo   6. Salir
echo.
echo ========================================
echo.

set /p opcion="Ingresa tu opcion (1-6): "

if "%opcion%"=="1" goto DAILY_DIGEST
if "%opcion%"=="2" goto BRAND_MONITOR
if "%opcion%"=="3" goto SOLO_DIGEST
if "%opcion%"=="4" goto VAULT_BACKUP
if "%opcion%"=="5" goto VERIFICAR
if "%opcion%"=="6" goto SALIR
echo Opcion invalida!
pause
goto MENU

:DAILY_DIGEST
echo.
echo ========================================
echo   Ejecutando Daily Digest + Inject
echo ========================================
echo.
cd C:\Users\ginte\OpenCli-rs-Obsidian-Qwen-Code
call npm run inject
echo.
pause
goto MENU

:BRAND_MONITOR
echo.
echo ========================================
echo   Ejecutando Brand Monitor
echo ========================================
echo.
cd C:\Users\ginte\OpenCli-rs-Obsidian-Qwen-Code
call npm run monitor
echo.
pause
goto MENU

:SOLO_DIGEST
echo.
echo ========================================
echo   Ejecutando Solo Digest
echo ========================================
echo.
cd C:\Users\ginte\OpenCli-rs-Obsidian-Qwen-Code
call npm run digest
echo.
pause
goto MENU

:VAULT_BACKUP
echo.
echo ========================================
echo   Ejecutando Vault Backup
echo ========================================
echo.
cd C:\DonGeeo87
call C:\Users\ginte\OpenCli-rs-Obsidian-Qwen-Code\99-System\scripts\auto-backup.bat
echo.
pause
goto MENU

:VERIFICAR
echo.
echo ========================================
echo   Verificando opencli-rs
echo ========================================
echo.
opencli-rs doctor
echo.
pause
goto MENU

:SALIR
echo.
echo ¡Hasta luego!
echo.
exit /b
