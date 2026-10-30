@echo off
title CampusOps Live BLE Sniffer (PowerShell Launcher)
cd /d "%~dp0"
powershell.exe -NoExit -ExecutionPolicy Bypass -File "%~dp0Live-Ble-Scanner.ps1"
