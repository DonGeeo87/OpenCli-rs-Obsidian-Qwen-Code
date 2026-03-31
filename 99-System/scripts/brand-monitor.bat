@echo off
REM ========================================
REM   Brand Monitor - Auto Run
REM   Ejecutar diariamente a las 12:00 PM
REM   GitHub: DonGeeo87/OpenCli-rs-Obsidian-Qwen-Code
REM ========================================

echo ========================================
echo   Brand Monitor - opencli-rs-tools
echo   %date% %time%
echo ========================================
echo.

cd C:\Users\ginte\OpenCli-rs-Obsidian-Qwen-Code

REM Ejecutar Brand Monitor
echo Ejecutando Brand Monitor...
call npm run monitor

echo.
echo [%date% %time%] Proceso finalizado!
echo.
