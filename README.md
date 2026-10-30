# CampusPulse OS — 3D Interactive Campus Visualization
### SRM Easwari Engineering College, Ramapuram, Chennai

A mission-critical 3D Digital Twin and Operational Intelligence operating system for **SRM Easwari Engineering College (Ramapuram, Chennai)**, built with **React Three Fiber**, **Three.js**, and **React**.

---

## 🏛️ Verified Campus Reference Layout

The 3D environment is structured according to the official campus reference maps and satellite layout (Bharathi Salai frontage, SRM BMS Block Road, Angel Street, and surrounding boundaries):

| Building ID | Building Name | Short Code | Category | Verified Ground Position |
|:---|:---|:---|:---|:---|
| `EEC-MAIN-01` | **Easwari Main Academic & Admin Block** | `EEC-01` | Academic | South Gate Frontage (Bharathi Salai) |
| `EEC-MECH-02` | **Easwari Mechanical & Civil Labs Complex** | `EEC-02` | Academic | West Wing / BMS Road Junction |
| `EEC-LIB-03` | **Easwari Central Library & Convention Hall** | `EEC-03` | Library | South-East Frontage (Bharathi Salai) |
| `SIST-ACAD-04` | **SRM IST Central Academic Tower** | `SIST-01` | Academic | North-Central Quadrangle |
| `SRM-BMS-05` | **SRM Ramapuram - Management Studies (BMS Block)** | `BMS-01` | Management | Western Quadrant (SRM BMS Block Rd) |
| `SRM-HOST-06` | **SRM Boys Hostel-3 Complex** | `HOST-03` | Hostel | Eastern Residential Wing (Angel St) |
| `EEC-PG-07` | **Easwari PG & Technology Center** | `EEC-04` | Academic | North-East Innovation Wing |
| `SRM-DEPOT-08` | **SRM Transport Depot & Bus Fleet Yard** | `TRANS-01` | Utility | North-West Transport Complex |
| `SRM-SPORTS-09` | **Campus Sports Arena & Outdoor Courts** | `SPORT-01` | Sports | East Amenity Ground (Next to Hostel 3) |
| `SRM-AMENITY-10` | **Campus Health Center & Student Pavilion** | `AMEN-01` | Utility | Central Plaza |

---

## 🌟 The Five CampusPulse OS Features

### 1. Interactive 3D Digital Twin & Spatial Visualizer
- **360-Degree Rotation & Orbit**: Full 360° orbital freedom with damping and smooth inertial motion.
- **Viewing Controls**:
  - `Reset Camera`: Quick button to re-center on the master campus overview.
  - `360° Tour Auto-Rotate`: One-click presentation turntable mode.
  - `Camera Presets`: One-click focus on Campus Overview, South Gate, Easwari Academic Wing, BMS Block, Boys Hostel, Bus Bay, or Top-Down Master Plan.
  - `North Compass`: Live orientation heading indicator.
- **Readable Floating Billboard Labels**: Screen-space auto-scaling badges (`@react-three/drei` `Html`) showing building short names, codes, and health dots.

### 2. Campus Health Integration (RAG + Grey Model)
Every structure is dynamically color-coded based on active telemetry and incident status:
- 🟢 **Green (Normal)**: Optimal operations, nominal power load, zero critical alerts.
- 🟡 **Amber (Attention Required)**: Subsystem threshold flagged (e.g. HVAC chiller vibration, network latency, high load).
- 🔴 **Red (Critical)**: Active emergency, fire/smoke alarm, electrical outage, or structural breach with pulsating emergency beacon in 3D.
- ⚪ **Grey (No Data)**: Unmonitored, sensor offline, or under scheduled civil maintenance.
- **Campus Health Score**: Aggregated campus reliability metric (e.g., 94% Nominal).
- **Health Filter Pills**: One-click status filtering in the top bar.

### 3. Live Incident Reporting & Automatic 3D Color Synchronization
- **Instant 3D Reactivity**: When an incident is reported via the "Report Incident" modal, the selected building's 3D model, rooftop beacon, and status badges **update color automatically in real time**.
- **Camera Auto-Focus**: Camera smoothly animates to the affected building to show the alert state in 3D.
- **Incident Resolution**: When an incident is marked resolved, the building automatically reverts back to Green (Normal).

### 4. Building Directory & Facility Intelligence
- **Clickable Buildings**: Clicking any building opens a slide-over panel with:
  - Official Building ID, Code, and Department allocation.
  - Architectural specs: Total floors, gross built-up area (sq. ft), year built, and capacity.
  - Real-time occupancy meter and progress bar.
  - **Live IoT Telemetry**: Power load (kW), Ambient Temp (°C), Wi-Fi connections, Fire safety readiness (%), Air Quality (AQI), and Water Pressure (PSI).
  - Active incident list with direct resolution action.
  - Facility contacts & emergency phone numbers.

### 5. Operational Analytics & Alert Stream
- Real-time audit log of campus events, sensor alerts, and security dispatches.
- Filterable by Active Tickets, Live Audit Stream, and Resolved incidents.
- **One-Click 3D Demo Simulators**:
  - 🔥 Fire Alarm (Turns Easwari Main Block Red in 3D)
  - ⚡ Power Grid Surge (Turns BMS Block Amber in 3D)
  - 🌐 Fiber Cut (Turns Library Block Red in 3D)
  - ✅ Nominal Reset (Restores all buildings to Green)

---

## 🛠️ GLTF / GLB Model Replacement Pipeline

The system is architected to transition from placeholder models to detailed photogrammetry or CAD GLTF/GLB models:
1. Place your `.glb` or `.gltf` model in `public/models/` (e.g., `public/models/EEC-MAIN-01.glb`).
2. Add the `modelUrl` property to the building entry in `src/data/campusData.ts`:
   ```ts
   {
     id: 'EEC-MAIN-01',
     name: 'Easwari Main Academic & Admin Block',
     modelUrl: '/models/EEC-MAIN-01.glb',
     ...
   }
   ```
3. `Building3D.tsx` automatically detects `modelUrl`, renders the GLTF model via `GLTFBuildingWrapper`, and dynamically tints the model materials to match the building's current health status (Green / Amber / Red / Grey).

---

## 📡 Live Mobile Device Intelligence & Anonymous BLE Detection Module

An integrated IoT detection subsystem that turns the host Windows laptop into an **active campus security sensor node**, capturing nearby Bluetooth Low Energy (BLE) advertisements from smartphones, wearables, and devices without invading personal privacy.

### Key Capabilities:
- **Real Windows Bluetooth Hardware Scanner**: Powered by Python and the `bleak` library via native Windows 11 WinRT Bluetooth APIs.
- **Strict Anonymity & Privacy Compliance**:
  - Raw MAC addresses and personal device names are **never transmitted to the frontend** or stored on disk.
  - Generates ephemeral SHA-256 session-salted one-way hashes (`DEV-XXXXXXXXXXXX`).
  - **Sliding 60-Second Window**: Inactive detections automatically expire and are purged every second.
- **3D Spatial Campus Visualization**:
  - **Live Sensor Marker**: Represents the host laptop station on the 3D map at the Easwari Main Academic Block (`[-6, 1.8, 30]`).
  - **Animated Concentric Pulsing Radar Rings**: Dynamic Three.js expanding waves (`ringGeometry`) indicating active RF capture.
  - **Approximate Coverage Perimeter**: Semi-transparent red coverage dome (~22m radius).
  - **Live Density Status Indicators**: Categorizes local RF density into `Low`, `Medium`, `High`, and `Congested`.
- **Hackathon Demonstration Mode**:
  - One-click toggle between **Live BLE Hardware Scanner** and **Multi-Zone Campus Demo**.
  - Demo mode simulates a campus-wide multi-sensor deployment across 5 distinct zones (Main Academic Block, Central Library, BMS Management Studies, Boys Hostel 3, and Student Health & Food Court).
  - Clearly separated so judges never confuse simulated metrics with actual hardware scanner results.

---

## 🚀 Running the Project (Windows 11)

### Quick One-Click Launch:
Double-click `start-all.bat` in the project root to automatically launch the backend, frontend, and open your browser!

Or launch manually in two terminal tabs:

### 1. Start the Bluetooth Scanner Backend (FastAPI + Bleak)
```powershell
cd C:\Users\Sripriyan\.gemini\antigravity\scratch\campuspulse-os\backend

# Install dependencies (already installed)
pip install -r requirements.txt

# Run the FastAPI server
python main.py
```
*Backend runs on `http://127.0.0.1:8000` (`GET /api/device-intelligence/status`).*

### 2. Start the Frontend (Vite + React Three Fiber)
```powershell
cd C:\Users\Sripriyan\.gemini\antigravity\scratch\campuspulse-os

# Start the Vite development server
npm run dev
```
*Frontend runs on `http://localhost:5173`.*

---

## 📱 Testing With Your Phone

1. **Verify Windows Bluetooth**:
   - Press `Win + A` or open Windows Settings to ensure Bluetooth is toggled **ON**.
2. **Make Phone Detectable**:
   - On Android: Open **Settings → Bluetooth** (keeping this screen open makes the phone advertise in discoverable BLE mode).
   - On iPhone: Open **Settings → Bluetooth** (keeping the Bluetooth settings screen active broadcasts BLE discovery packets).
3. **Watch the Counter**:
   - Within 3–5 seconds, watch the **Total Detectable Devices** count on the CampusOps map increment!
   - Turn Bluetooth OFF on your phone: within 60 seconds, the sliding window automatically purges the device, decreasing the count.

---

## 🛠️ Verification & Troubleshooting

Run the automated test suite to verify the Bluetooth adapter and API integrity:
```powershell
python backend/test_e2e_module.py
```

- **"Bluetooth adapter offline" error**:
  - Open Windows Action Center (`Win + A`) and ensure Bluetooth is turned on.
  - If another application has locked the adapter, click **"Rescan Adapter"** in the Device Intelligence panel.
- **Port 8000 conflict**:
  - Change the port in `backend/main.py` if another local service is using port 8000.

#   h e a t - m a p s  
 #   h e a t - m a p s  
 