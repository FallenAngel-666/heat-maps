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

## 🚀 How to Run Locally

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
