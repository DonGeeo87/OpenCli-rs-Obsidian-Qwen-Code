@echo off
REM ========================================
REM   Daily Digest - Auto Run
REM   Ejecutar diariamente a las 8:00 AM
REM   GitHub: DonGeeo87/OpenCli-rs-Obsidian-Qwen-Code
REM ========================================

echo ========================================
echo   Daily Digest - opencli-rs-tools
echo   %date% %time%
echo ========================================
echo.

cd C:\Users\ginte\OpenCli-rs-Obsidian-Qwen-Code

REM Ejecutar Daily Digest + Inject
echo Ejecutando Daily Digest e inyectando en Obsidian...
call npm run inject

echo.
echo [%date% %time%] Proceso finalizado!
echo.
