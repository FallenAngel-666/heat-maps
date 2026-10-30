@echo off
title CampusOps - Live Mobile Bluetooth Detection Console
cd /d "%~dp0"
echo ====================================================================
echo   CAMPUSOPS - LIVE MOBILE DEVICE INTELLIGENCE & DETECTION CONSOLE
echo   Hardware: Windows 11 Built-in Bluetooth Low Energy (BLE) Adapter
echo   Engine:   Bleak Continuous Asynchronous RF Packet Sniffer
echo   Privacy:  Ephemeral Session Salted SHA-256 (Zero Personal Data Logged)
echo ====================================================================
echo.
echo Checking Python environment...
set PYTHON_CMD=python
if exist "C:\Users\Sripriyan\python.exe" (
    set "PYTHON_CMD=C:\Users\Sripriyan\python.exe"
)

echo Starting Live BLE Sniffer Server on http://127.0.0.1:8000 ...
echo You will see live Bluetooth signals and nearby phone packets below:
echo.
cd backend
"%PYTHON_CMD%" main.py
pause
