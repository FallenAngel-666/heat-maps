@echo off
title CampusOps - Live BLE Scanner Backend (Port 8000)
cd /d "%~dp0"
echo ====================================================================
echo  CampusOps - Live Mobile Device Intelligence Backend (FastAPI + Bleak)
echo  Hardware: Windows 11 Laptop Bluetooth Low Energy Adapter
echo ====================================================================
echo.
echo Checking Python environment...
set PYTHON_CMD=python
if exist "C:\Users\Sripriyan\python.exe" (
    set "PYTHON_CMD=C:\Users\Sripriyan\python.exe"
)

echo Starting FastAPI server at http://127.0.0.1:8000 ...
cd backend
"%PYTHON_CMD%" main.py
pause
