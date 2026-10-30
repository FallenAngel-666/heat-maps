# CampusPulse OS — Central Base System & 3D Holographic Digital Twin
### SRM Easwari Engineering College, Ramapuram, Chennai

A mission-critical 3D Digital Twin, Satellite Focus Explorer, and Central Base Operations Suite for **SRM Easwari Engineering College (Ramapuram, Chennai)**, built with **React Three Fiber**, **Three.js**, and **React + TypeScript + Vite**.

---

## 🏛️ Verified Campus Reference Layout

The 3D environment is structured according to the official campus reference maps, satellite imagery, and municipal building footprints along Bharathi Salai:

| Building ID | Building Name | Short Code | Category | Verified Ground Position |
|:---|:---|:---|:---|:---|
| `EEC-MAIN-01` | **Easwari Main Academic & Admin Block** | `EEC-01` | Academic | South Gate Frontage (Bharathi Salai) |
| `EEC-MECH-02` | **Easwari Mechanical & Civil Labs Complex** | `EEC-02` | Academic | West Wing / BMS Road Junction |
| `EEC-LIB-03` | **Easwari Central Library & Convention Hall** | `EEC-03` | Library | South-East Frontage (Bharathi Salai) |
| `EEC-PG-04` | **Easwari PG & Technology Center** | `EEC-04` | Academic | North-East Innovation Wing |
| `EEC-SPORT-05` | **Easwari Sports Arena & Outdoor Pavilion** | `EEC-05` | Sports | East Amenity Ground (Next to Hostel 3) |
| `EEC-GATE-06` | **Main Entrance Gate & Security Station** | `EEC-06` | Utility | Bharathi Salai Main Security Checkpoint |

---

## 🌟 Core Features

### 1. Operational 3D — Holographic Digital Twin
- **Finished 360° Architecture**: Detailed facades across all 4 sides (Front, Back, Left, Right), window bands, entrance porticos, rooftop chiller plants, and parapets.
- **Holographic Edge Illumination**: Subtle cyan/sky-blue wireframe accents (`#38bdf8` / `#0284c7`), coordinate ground grid, and status-synchronized beacons.
- **Complete Camera Perspectives & Cardinal Controls**:
  - `Front View` (South-to-North from Bharathi Salai)
  - `Back View` (North-to-South from PG & Tech Block)
  - `Left View` (West-to-East along BMS Road)
  - `Right View` (East-to-West from Sports Pavilion)
  - `Top-Down (90° Nadir)` master blueprint view
  - `Angled 3D (45° Isometric)` operational view
  - `N, S, E, W` cardinal orientation snaps
  - `360° Turntable Tour` auto-rotation
  - `Reset Camera` & individual building focus

### 2. Satellite View — Focused Strictly on Easwari Campus
- Centered on verified coordinates: `13.0335° N, 80.1795° E`.
- **Residential Area Dimming Mask**: Semi-transparent dark neutral polygon mask (`#0f172a` at 68% opacity) over surrounding residential areas with an illuminated `#38bdf8` cyan perimeter outline.
- **Cesium Photorealistic 3D Tiles**: Google Maps Platform Map Tiles API integration with attribution compliance.

### 3. Left Hamburger Operations Suite (5 Core Modules + Mobile Signals)
1. **Campus Health Map**: Building directory with RAG status pills (Green/Amber/Red/Grey), live power load (kW), ambient temperature, and WiFi density.
2. **Unified Incident Engine**: Technician roster with dispatch actions, critical spare-parts inventory with low-stock alerts, and active work orders.
3. **Digital Twin Simulator**: Dynamic crowd (500–5,000), staff (5–50), and open gate sliders; computes Congestion Risk % and Evacuation Clearance Time; includes 1-click fire/power drill triggers.
4. **Lifeline Mesh Emergency SOS**: Distress categories, opt-in GPS/BLE coordinate sharing, mesh node health, and broadcast dispatch.
5. **Command Center**: Executive dashboard displaying 92% Reliability Index, 99.8% Telemetry Uptime, active incident triage, and automated AI mitigation notes.
6. **Mobile Signals**: Built-in CampusOps BLE Intelligence scanner showing anonymous Bluetooth device counts, RSSI distribution, and density zones.

### 4. Companion Student & Staff Portal
Integrates seamlessly with the standalone **Campus Operations & Emergency Response Portal** (`campus-portal`) for student auditorium bookings, maintenance reports, distress beacons, and administrative ticket approval.

---

## 📡 Live Device Intelligence – Anonymous Bluetooth Detection Module

CampusOps features a production-ready **Anonymous Bluetooth Low Energy (BLE) Device Detection & Density Intelligence Module**. It transforms a standard Windows 11 laptop into an edge IoT security telemetry sensor to monitor physical crowd density without infringing on individual privacy.

### 🛡️ Privacy & Compliance Architecture
- **Zero Identity Exposure**: Personal device names and raw Bluetooth MAC addresses are never stored, logged, or exposed across any API or frontend view.
- **One-Way Ephemeral Hashing**: Devices are anonymized using session-salted SHA-256 (`DEV-<12-HEX>`) where the 32-byte salt exists exclusively in RAM and is discarded on shutdown.
- **60-Second Sliding Expiration Window**: BLE advertisements are maintained in an ephemeral sliding memory registry and automatically purged after 60 seconds of inactivity.
- **Non-Invasive**: Passively listens to standard BLE advertising beacons; does not initiate pairing, connection, or service interrogation.

### 🌐 API Endpoints (`http://127.0.0.1:8000`)
| Method | Endpoint | Description |
|:---|:---|:---|
| `GET` | `/api/device-intelligence/status` | Returns scanner status, live device count in 60s window, density rating, primary sensor, and zone list. |
| `GET` | `/api/device-intelligence/zones` | Returns coverage zone metadata and density breakdowns. |
| `POST` | `/api/device-intelligence/mode` | Toggles between `live` (laptop BLE hardware) and `demo` (multi-zone simulation). Payload: `{"mode": "live"}` or `{"mode": "demo"}`. |
| `POST` | `/api/device-intelligence/rescan` | Restarts the Windows BLE adapter scanner and flushes state. |
| `GET` | `/api/device-intelligence/health` | Health check endpoint returning adapter packets and status. |

---

## 🚀 Quick Start Guide (Windows 11)

### 1-Click Launch (Recommended)
Double-click `start-all.bat` in the project root. This automatically:
1. Starts the FastAPI + Bleak Bluetooth scanner on `http://127.0.0.1:8000`
2. Starts the Vite frontend on `http://localhost:5173`
3. Opens the browser to the CampusOps 3D Command Dashboard

### Manual Startup

#### Step 1: Start Backend Scanner
```powershell
cd campuspulse-os/backend
# Install dependencies if not already installed:
python -m pip install -r requirements.txt
# Run FastAPI server
python main.py
```

#### Step 2: Start Frontend Application
```powershell
cd campuspulse-os
npm install
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🧪 Testing with Your Own Smartphone
1. Ensure **Bluetooth is turned ON** on your Windows 11 laptop.
2. On your smartphone (iPhone or Android):
   - Open **Settings** > **Bluetooth** (leaving the screen open makes the phone broadcast discoverable BLE advertisement beacons).
   - Alternatively, open any app that broadcasts BLE (such as an Apple Watch pairing session, Fitness tracker app, or "nRF Connect for Mobile").
3. In the CampusOps dashboard, observe the **Live Device Intelligence** indicator in the top-left corner:
   - Toggle **Live Device Intelligence: ON**.
   - Within 3–5 seconds, the detected device counter will reflect nearby active BLE beacons.
   - Click the arrow button to open the **Anonymous Device Density Intelligence** side drawer for full telemetry and signal strength (RSSI) distribution.

---

## 🎪 Hackathon Demo Mode
For presentation to judges:
1. Open the **Live Device Intelligence** drawer.
2. In the **Operational Mode** section, click **Hackathon Demo**.
3. The map instantly visualizes a multi-sensor deployment across 5 key campus buildings:
   - Easwari Main Academic Wing
   - Central Library & Convention Hall
   - BMS Management Studies Quad
   - SRM Boys Hostel-3 Courtyard
   - Student Pavilion & Food Court
4. Click any zone in the list to automatically fly the 3D camera to that facility.

---

## 🛠️ Verification Test Suite
Run the comprehensive automated test suite:
```powershell
python backend/test_e2e_module.py
```
This tests:
1. Real Windows BLE adapter initialization & packet capture
2. Privacy audit (ensures 0 raw MAC addresses exist in payloads)
3. Sliding 60-second expiration and record purging
4. Live vs Demo mode isolation
5. Clean adapter shutdown and release

---

## 📦 How to Run Locally

```bash
# Navigate to project folder
cd campuspulse-os

# Install dependencies
npm install

# Start development server
npm run dev

# Create optimized production build
npm run build
```

---

## ☁️ Deploy to Vercel

### Method 1: Push via GitHub (Recommended)
1. Create a new GitHub repository (e.g. `campuspulse-os`).
2. Run in this directory:
   ```bash
   git add .
   git commit -m "Update CampusPulse OS Central Base System"
   git remote add origin https://github.com/<YOUR_GITHUB_USERNAME>/campuspulse-os.git
   git push -u origin main
   ```
3. Go to [vercel.com/new](https://vercel.com/new), select your repo, and click **Deploy**. Vercel will auto-detect Vite and settings from `vercel.json`.

### Method 2: Deploy directly with Vercel CLI
```bash
npx vercel --prod
```
"# trinetra-os" 
