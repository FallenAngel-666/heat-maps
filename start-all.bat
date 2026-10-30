@echo off
title Launch CampusOps Complete Platform
cd /d "%~dp0"
echo ====================================================================
echo  Launching CampusOps Platform + Live BLE Intelligence Scanner
echo ====================================================================
echo.
echo [1/3] Starting Backend (FastAPI + Bleak) on http://127.0.0.1:8000 ...
start "CampusOps Backend" cmd /k "start-backend.bat"

echo [2/3] Starting Frontend (Vite) on http://localhost:5173 ...
start "CampusOps Frontend" cmd /k "start-frontend.bat"

echo [3/3] Waiting 4 seconds for servers to initialize...
timeout /t 4 /nobreak >nul

echo Opening CampusOps in default browser...
start http://localhost:5173
echo.
echo CampusOps is running! Keep the backend and frontend command windows open.
echo Press any key to exit this launcher window.
pause >nul
