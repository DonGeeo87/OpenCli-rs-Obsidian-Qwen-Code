@echo off
REM ========================================
REM   Obsidian Vault Backup - Auto Run
REM   Ejecutar diariamente a las 6:00 PM
REM   GitHub: DonGeeo87/OpenCli-rs-Obsidian-Qwen-Code
REM ========================================

echo ========================================
echo   Obsidian Vault Backup + GitHub Sync
echo   %date% %time%
echo ========================================
echo.

cd C:\DonGeeo87

REM Verificar si hay git repo
if not exist ".git" (
    echo ERROR: Repositorio Git no inicializado
    echo Ejecuta: git init
    pause
    exit /b 1
)

REM Verificar conexion a internet
ping -n 1 github.com > nul 2>&1
if errorlevel 1 (
    echo ADVERTENCIA: Sin conexion a internet. Solo backup local.
    echo.
)

REM Agregar todos los cambios
echo Agregando cambios...
git add -A

REM Verificar si hay cambios para commitear
git diff --cached --quiet
if %errorlevel% equ 0 (
    echo Sin cambios nuevos. Todo actualizado.
) else (
    REM Crear commit con fecha
    echo Creando commit...
    git commit -m "Auto-backup: %date% %time%"
    
    REM Push a GitHub
    echo.
    echo Subiendo a GitHub...
    git push origin main
    
    if errorlevel 1 (
        echo.
        echo ADVERTENCIA: Error al hacer push. Verifica credenciales.
        echo Para configurar token: git config --global credential.helper store
    ) else (
        echo.
        echo ✅ Backup completado y subido a GitHub!
        echo 🔗 https://github.com/DonGeeo87/OpenCli-rs-Obsidian-Qwen-Code
    )
)

echo.
echo [%date% %time%] Proceso finalizado!
echo.
