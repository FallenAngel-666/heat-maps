# CampusOps — Project Context & Operating Guide

This workspace contains **CampusOps (CampusPulse OS)**, an Intelligent Campus Operations Platform developed for hackathon demonstration with real-time Bluetooth Low Energy (BLE) mobile device intelligence.

## Technical Architecture
- **Location**: `C:\Users\Sripriyan\.gemini\antigravity\scratch\campuspulse-os`
- **Frontend**: Vite + React 18 + React Three Fiber + Three.js + Tailwind CSS (Port 3000)
- **Backend**: Python 3.13 + Bleak + FastAPI + Uvicorn (Port 8000)
- **Hardware Integration**: Built-in Windows 11 Bluetooth adapter via WinRT BLE APIs

## Key Subsystems
1. **Live Mobile Device Intelligence**:
   - `backend/ble_scanner.py`: Asynchronous scanner using `BleakScanner`.
   - `backend/main.py`: FastAPI server serving `/api/device-intelligence/status`.
   - Ephemeral session-salted SHA-256 one-way hashing (`DEV-XXXXXXXXXXXX`). Zero raw MAC addresses or device names stored or exposed.
   - Sliding 60-second inactivity window auto-purging expired records every second.
   - 3D animated sensor node with expanding red concentric radar rings (`ringGeometry`) and coverage dome (~22m radius) at Easwari Main Academic Block (`[-6, 1.8, 30]`).
   - Dark-themed security drawer with the mandatory "Anonymous Device Density Intelligence" information panel.
   - Dual-mode operation: `Live BLE Scanner` vs `Hackathon Demo` (5 simulated campus zones).
2. **Operations Twin & Campus Management**:
   - 10 verified campus structures for SRM Easwari Engineering College (Ramapuram, Chennai).
   - RAG health monitoring (Green/Amber/Red/Grey), incident reporting & resolution, live building telemetry, and camera presets.

## Launch Commands
- Launch both: `start-all.bat`
- Backend only: `start-backend.bat` or `cd backend && python main.py`
- Frontend only: `start-frontend.bat` or `npm run dev`
- Standalone single-file HTML view: `standalone-3d-view.html` or `campuspulse-3d.html`
- End-to-end verification test: `python backend/test_e2e_module.py`
