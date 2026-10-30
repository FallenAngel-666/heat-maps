"""
CampusOps - Live Mobile Device Intelligence & Anonymous BLE Detection Module
Bluetooth Scanner Service using Bleak for Windows 11.
Streams phone and BLE packet detections directly to CMD console & web console.
"""

import asyncio
from collections import deque
import hashlib
import logging
import os
import secrets
import sys
import time
from dataclasses import dataclass
from datetime import datetime, timezone
from typing import Dict, List, Optional, Tuple

from bleak import BleakScanner
from bleak.backends.device import BLEDevice
from bleak.backends.scanner import AdvertisementData

# Enable ANSI escape sequence processing on Windows 10/11 CMD / PowerShell
if os.name == 'nt':
    try:
        import ctypes
        kernel32 = ctypes.windll.kernel32
        kernel32.SetConsoleMode(kernel32.GetStdHandle(-11), 7)
    except Exception:
        pass

# Terminal ANSI Color Constants
C_RESET = "\033[0m"
C_BOLD = "\033[1m"
C_DIM = "\033[2m"
C_GREEN = "\033[92m"
C_CYAN = "\033[96m"
C_YELLOW = "\033[93m"
C_RED = "\033[91m"
C_MAGENTA = "\033[95m"
C_BLUE = "\033[94m"
C_WHITE = "\033[97m"

# Standard Bluetooth SIG Public Hardware Vendor IDs (100% Anonymous - zero personal data)
BLE_VENDOR_MAP = {
    0x004C: "Apple Device (iPhone / Watch / iOS)",
    0x0075: "Samsung Galaxy (Mobile / Wearable)",
    0x00E0: "Google Pixel / Android Phone",
    0x038F: "Xiaomi / Redmi Mobile",
    0x0006: "Microsoft (Windows PC / Surface)",
    0x0059: "Nordic Semiconductor BLE Node",
    0x0087: "Garmin Smartwatch / Fitness",
    0x0157: "Anker Soundcore Audio",
    0x000A: "Qualcomm Wireless Audio",
    0x0001: "Nokia Mobile",
    0x02E5: "Espressif IoT Chipset",
    0x08A9: "OnePlus Mobile Device",
    0x00D2: "Dialog Semiconductor",
    0x0499: "Ruptela Telematics"
}

logger = logging.getLogger("campusops.ble")
logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(name)s: %(message)s")


@dataclass
class AnonymousDetection:
    """Anonymous temporary record for a detected BLE device."""
    anon_id: str
    first_seen: float
    last_seen: float
    last_rssi: int
    device_type: str = "Mobile Phone / BLE Device"
    packet_count: int = 1


@dataclass
class SensorZone:
    """Campus spatial sensor zone configuration."""
    zone_id: str
    name: str
    building_id: str
    position_3d: Tuple[float, float, float]
    coverage_radius_meters: float
    is_physical_sensor: bool = False
    device_count: int = 0
    density_status: str = "low"  # low, medium, high, congested


class AnonymousBLEScannerManager:
    """
    Manages real-time BLE scanning on Windows laptop adapter.
    Preserves strict privacy: MAC addresses and personal names are never stored or exposed.
    Identifies phone hardware families via standard Bluetooth SIG vendor codes.
    Streams colorized packet events to the CMD console and maintains an in-memory
    log queue for the website's live console.
    """

    def __init__(self, detection_window_seconds: int = 60):
        self.detection_window: int = detection_window_seconds
        
        # Ephemeral session salt generated on startup; never persisted
        self._session_salt: bytes = secrets.token_bytes(32)
        
        # In-memory anonymous registry: { anon_id: AnonymousDetection }
        self._detections: Dict[str, AnonymousDetection] = {}
        
        # In-memory circular buffer for the web terminal console (last 180 events)
        self._recent_logs: deque = deque(maxlen=180)
        
        # Console print throttle per device to prevent flooding the CMD window
        self._last_console_print: Dict[str, float] = {}
        
        # Scanner runtime state
        self.scanner_status: str = "starting"  # starting, active, offline, error
        self.status_message: str = "Initializing Bluetooth adapter..."
        self.last_scan_time: Optional[float] = None
        self.mode: str = "live"  # 'live' (real adapter) or 'demo' (simulated multi-zone)
        self.total_packets_received: int = 0
        self.error_details: Optional[str] = None
        
        # Bleak scanner reference
        self._bleak_scanner: Optional[BleakScanner] = None
        self._scan_task: Optional[asyncio.Task] = None
        self._cleanup_task: Optional[asyncio.Task] = None
        self._is_running: bool = False
        self._lock = asyncio.Lock()

        # Laptop sensor physical location on the campus map
        self.laptop_sensor_zone = SensorZone(
            zone_id="SENSOR-LAPTOP-01",
            name="Field Command Laptop (Easwari Main Block)",
            building_id="EEC-MAIN-01",
            position_3d=(-6.0, 1.8, 30.0),
            coverage_radius_meters=22.0,
            is_physical_sensor=True
        )

        # Pre-configured campus zones for multi-sensor demonstration
        self._demo_zones: List[SensorZone] = [
            SensorZone("ZONE-MAIN-01", "Easwari Main Academic Wing", "EEC-MAIN-01", (-6.0, 1.8, 30.0), 22.0, True),
            SensorZone("ZONE-LIB-02", "Central Library & Convention", "EEC-LIB-03", (18.0, 1.8, 30.0), 20.0, False),
            SensorZone("ZONE-BMS-03", "BMS Management Block Quad", "SRM-BMS-05", (-48.0, 1.8, 5.0), 24.0, False),
            SensorZone("ZONE-HOST-04", "Boys Hostel-3 Courtyard", "SRM-HOST-06", (50.0, 1.8, -10.0), 25.0, False),
            SensorZone("ZONE-CAFE-05", "Campus Health & Food Court", "SRM-AMENITY-10", (2.0, 1.8, -24.0), 20.0, False),
        ]

    def _anonymize_address(self, raw_address: str) -> str:
        """One-way cryptographic hash of Bluetooth address with memory-only salt."""
        hasher = hashlib.sha256()
        hasher.update(self._session_salt)
        hasher.update(raw_address.encode("utf-8"))
        return f"DEV-{hasher.hexdigest()[:12].upper()}"

    def _identify_device_type(self, advertisement_data: AdvertisementData, rssi: int) -> str:
        """
        Infers device class and vendor anonymously from BLE manufacturer company ID.
        Never reads personal names or identities.
        """
        # Check standard Bluetooth SIG company identifier
        if advertisement_data.manufacturer_data:
            for company_id in advertisement_data.manufacturer_data.keys():
                if company_id in BLE_VENDOR_MAP:
                    return BLE_VENDOR_MAP[company_id]

        # Check anonymous device class from local name hints if generic
        if advertisement_data.local_name:
            ln = advertisement_data.local_name.lower()
            if any(k in ln for k in ("trex", "watch", "band", "fit", "gt")):
                return "Smartwatch / Wearable"
            elif any(k in ln for k in ("buds", "airpods", "headphone", "audio", "speaker")):
                return "Wireless Audio Peripheral"
            elif any(k in ln for k in ("phone", "iphone", "galaxy", "pixel", "redmi")):
                return "Mobile Smartphone"

        # Signal-based inference
        if rssi >= -68:
            return "Nearby Mobile Phone (< 2.5m)"
        elif rssi >= -80:
            return "Mid-Range Mobile Device (2.5m - 8m)"
        elif rssi >= -90:
            return "BLE Peripheral / Wearable (8m - 15m)"
        else:
            return "Boundary RF Signal (> 15m)"

    def _format_distance(self, rssi: int) -> str:
        """Estimates approximate distance from RSSI."""
        if rssi >= -60:
            return "~0.5m - 1.5m (Immediate)"
        elif rssi >= -72:
            return "~1.5m - 3.5m (Nearby)"
        elif rssi >= -84:
            return "~3.5m - 8.0m (Mid-Range)"
        else:
            return "> 8.0m (Far/Boundary)"

    def _detection_callback(self, device: BLEDevice, advertisement_data: AdvertisementData) -> None:
        """
        Callback invoked by Bleak whenever a BLE advertisement is captured.
        Extracts only RSSI and anonymous vendor class.
        Prints real-time colorized logs to CMD and adds to web console buffer.
        """
        now = time.time()
        self.last_scan_time = now
        self.total_packets_received += 1
        
        anon_id = self._anonymize_address(device.address)
        rssi = advertisement_data.rssi if advertisement_data.rssi is not None else -90

        is_new = anon_id not in self._detections
        dev_type = self._identify_device_type(advertisement_data, rssi)
        dist_str = self._format_distance(rssi)
        signal_level = "strong" if rssi >= -70 else "moderate" if rssi >= -85 else "weak"
        time_str = datetime.now().strftime("%H:%M:%S.%f")[:-3]

        if not is_new:
            rec = self._detections[anon_id]
            rec.last_seen = now
            rec.last_rssi = rssi
            rec.device_type = dev_type
            rec.packet_count += 1
            packet_num = rec.packet_count
        else:
            rec = AnonymousDetection(
                anon_id=anon_id,
                first_seen=now,
                last_seen=now,
                last_rssi=rssi,
                device_type=dev_type,
                packet_count=1
            )
            self._detections[anon_id] = rec
            packet_num = 1

        is_phone = ("Phone" in dev_type or "Mobile" in dev_type or "Apple" in dev_type or "Samsung" in dev_type or "Android" in dev_type or rssi >= -70)

        # Add structured log entry for the web console tab
        log_entry = {
            "id": f"log-{int(now * 1000)}-{secrets.token_hex(2)}",
            "timestamp": time_str,
            "type": "discovery" if is_new else "packet",
            "anon_id": anon_id,
            "rssi": rssi,
            "signal_level": signal_level,
            "proximity_est": f"{dev_type} ({dist_str})",
            "packet_count": packet_num,
            "message": f"{'New phone/device detected' if is_new else 'BLE packet received'}: {anon_id} | {dev_type} ({rssi} dBm)"
        }
        self._recent_logs.append(log_entry)

        # Print colorized stream to CMD console
        last_print = self._last_console_print.get(anon_id, 0.0)
        if is_new or (now - last_print > 1.2):
            self._last_console_print[anon_id] = now
            
            # Format RSSI with appropriate color
            if rssi >= -70:
                rssi_str = f"{C_GREEN}{rssi:>3} dBm [STRONG]{C_RESET}"
            elif rssi >= -85:
                rssi_str = f"{C_YELLOW}{rssi:>3} dBm [MEDIUM]{C_RESET}"
            else:
                rssi_str = f"{C_DIM}{rssi:>3} dBm [WEAK]  {C_RESET}"

            if is_new:
                if is_phone:
                    tag = f"{C_GREEN}{C_BOLD}[NEW PHONE DISCOVERED]{C_RESET}"
                else:
                    tag = f"{C_CYAN}{C_BOLD}[NEW BLE DEVICE]     {C_RESET}"
            else:
                tag = f"{C_BLUE}[BLE ADVERTISEMENT]  {C_RESET}"

            active_count = len(self._detections)
            print(
                f"{C_DIM}[{time_str}]{C_RESET} {tag} "
                f"{C_WHITE}{C_BOLD}{anon_id}{C_RESET} | "
                f"RSSI: {rssi_str} | "
                f"{C_MAGENTA}{dev_type:<32}{C_RESET} | "
                f"Dist: {C_WHITE}{dist_str:<18}{C_RESET} | "
                f"Active in 60s: {C_GREEN}{C_BOLD}{active_count}{C_RESET}"
            )

    async def _cleanup_loop(self) -> None:
        """Periodically purges detections that haven't advertised within detection_window (60s)."""
        while self._is_running:
            try:
                await asyncio.sleep(2.0)
                now = time.time()
                cutoff = now - self.detection_window

                async with self._lock:
                    expired = [anon_id for anon_id, record in self._detections.items() if record.last_seen < cutoff]
                    for anon_id in expired:
                        del self._detections[anon_id]
                        if anon_id in self._last_console_print:
                            del self._last_console_print[anon_id]

                    if expired:
                        time_str = datetime.now().strftime("%H:%M:%S.%f")[:-3]
                        active_count = len(self._detections)
                        
                        purge_entry = {
                            "id": f"log-{int(now * 1000)}-{secrets.token_hex(2)}",
                            "timestamp": time_str,
                            "type": "purge",
                            "anon_id": None,
                            "rssi": None,
                            "signal_level": "weak",
                            "proximity_est": "Sliding Window Expiration",
                            "packet_count": len(expired),
                            "message": f"Sliding Window Purge: {len(expired)} inactive phone(s) expired (>60s). Remaining active: {active_count}"
                        }
                        self._recent_logs.append(purge_entry)

                        print(
                            f"{C_DIM}[{time_str}]{C_RESET} "
                            f"{C_RED}{C_BOLD}[SLIDING PURGE 60S]{C_RESET}   "
                            f"Purged {C_RED}-{len(expired)}{C_RESET} inactive BLE device(s) | "
                            f"Current Active: {C_GREEN}{C_BOLD}{active_count}{C_RESET}"
                        )
            except asyncio.CancelledError:
                break
            except Exception as e:
                logger.error("Error in BLE cleanup loop: %s", e)

    async def _scanner_worker(self) -> None:
        """Continuous background scanner loop with automatic error recovery."""
        retry_delay = 3.0
        while self._is_running:
            try:
                print(f"\n{C_CYAN}======================================================================{C_RESET}")
                print(f"{C_GREEN}{C_BOLD}  CAMPUSOPS - LIVE MOBILE DEVICE INTELLIGENCE CONSOLE (Windows 11){C_RESET}")
                print(f"  Hardware: Built-in Bluetooth Low Energy (BLE) Adapter")
                print(f"  Detecting Nearby Smartphones (Apple, Samsung, Google, Xiaomi, BLE)")
                print(f"  Sliding Window: {self.detection_window} seconds | Privacy: Ephemeral SHA-256")
                print(f"{C_CYAN}======================================================================{C_RESET}\n")
                
                logger.info("Initializing BleakScanner on Windows Bluetooth adapter...")
                self.scanner_status = "starting"
                self.status_message = "Activating laptop Bluetooth Low Energy adapter..."
                self.error_details = None

                self._bleak_scanner = BleakScanner(detection_callback=self._detection_callback)
                await self._bleak_scanner.start()

                self.scanner_status = "active"
                self.status_message = "Active - Scanning for BLE advertisements in 60s sliding window"
                logger.info("Bluetooth Low Energy scanner successfully active.")
                print(f"{C_GREEN}[ONLINE]{C_RESET} BleakScanner listening for nearby mobile phones on 2.4 GHz spectrum...\n")

                while self._is_running:
                    await asyncio.sleep(1.0)

            except asyncio.CancelledError:
                break
            except Exception as e:
                logger.error("Bluetooth adapter exception: %s (%s)", type(e).__name__, e)
                self.scanner_status = "offline"
                self.status_message = f"Bluetooth adapter offline: {type(e).__name__}"
                self.error_details = str(e)
                print(f"\n{C_RED}[ERROR] Bluetooth adapter exception: {e}{C_RESET}")
                print(f"{C_YELLOW}Retrying in {retry_delay}s... (Ensure Bluetooth is ON in Windows Settings){C_RESET}\n")
                
                if self._bleak_scanner:
                    try:
                        await self._bleak_scanner.stop()
                    except Exception:
                        pass
                    self._bleak_scanner = None

                await asyncio.sleep(retry_delay)

    async def start(self) -> None:
        """Starts the BLE scanner and cleanup background tasks."""
        async with self._lock:
            if self._is_running:
                return

            self._is_running = True
            self.scanner_status = "starting"
            self.status_message = "Starting scanner service..."
            
            self._scan_task = asyncio.create_task(self._scanner_worker(), name="ble_scanner_worker")
            self._cleanup_task = asyncio.create_task(self._cleanup_loop(), name="ble_cleanup_loop")
            logger.info("AnonymousBLEScannerManager started.")

    async def stop(self) -> None:
        """Stops the BLE scanner and cleans up resources."""
        async with self._lock:
            if not self._is_running:
                return

            self._is_running = False

            if self._cleanup_task:
                self._cleanup_task.cancel()
                try:
                    await self._cleanup_task
                except asyncio.CancelledError:
                    pass
                self._cleanup_task = None

            if self._scan_task:
                self._scan_task.cancel()
                try:
                    await self._scan_task
                except asyncio.CancelledError:
                    pass
                self._scan_task = None

            if self._bleak_scanner:
                try:
                    await self._bleak_scanner.stop()
                except Exception as e:
                    logger.warning("Error stopping bleak scanner: %s", e)
                self._bleak_scanner = None

            self.scanner_status = "offline"
            self.status_message = "Scanner stopped"
            logger.info("AnonymousBLEScannerManager stopped.")

    def set_mode(self, new_mode: str) -> None:
        """Switches between 'live' and 'demo' mode."""
        if new_mode in ("live", "demo"):
            self.mode = new_mode
            logger.info("Switched scanner mode to '%s'", new_mode)

    def _calculate_density_status(self, count: int) -> str:
        """Calculates categorical density status from device count."""
        if count <= 5:
            return "low"
        elif count <= 18:
            return "medium"
        elif count <= 35:
            return "high"
        else:
            return "congested"

    def get_recent_logs(self, limit: int = 50) -> List[dict]:
        """Returns the most recent detection log entries."""
        if self.mode == "demo":
            return self._generate_demo_logs(limit)
        return list(self._recent_logs)[-limit:]

    def _generate_demo_logs(self, limit: int = 35) -> List[dict]:
        """Generates realistic simulated packet logs across the 5 campus zones for Demo Mode."""
        now = time.time()
        import random
        demo_zones = [
            ("ZONE-MAIN-01", "Main Academic Block"),
            ("ZONE-LIB-02", "Central Library"),
            ("ZONE-BMS-03", "BMS Management Quad"),
            ("ZONE-HOST-04", "Hostel-3 Courtyard"),
            ("ZONE-CAFE-05", "Student Pavilion")
        ]
        vendors = [
            "Apple Device (iPhone / Watch / iOS)",
            "Samsung Galaxy (Mobile / Wearable)",
            "Google Pixel / Android Phone",
            "Xiaomi / Redmi Mobile",
            "Smartwatch / Wearable",
            "Wireless Audio Peripheral"
        ]
        
        sim_logs = []
        for i in range(min(limit, 30)):
            t_offset = (limit - i) * 1.5
            t_entry = now - t_offset
            time_str = datetime.fromtimestamp(t_entry).strftime("%H:%M:%S.%f")[:-3]
            zid, zname = random.choice(demo_zones)
            vname = random.choice(vendors)
            anon_id = f"DEV-{secrets.token_hex(6).upper()}"
            rssi = random.randint(-88, -55)
            dist = self._format_distance(rssi)
            signal_level = "strong" if rssi >= -70 else "moderate" if rssi >= -85 else "weak"
            is_new = random.random() < 0.28

            sim_logs.append({
                "id": f"sim-log-{int(t_entry * 1000)}-{i}",
                "timestamp": time_str,
                "type": "discovery" if is_new else "packet",
                "anon_id": anon_id,
                "rssi": rssi,
                "signal_level": signal_level,
                "proximity_est": f"{vname} ({dist}) [{zname}]",
                "packet_count": random.randint(1, 15),
                "message": f"Demo Signal: {anon_id} at {zname} ({rssi} dBm | {vname})"
            })
        return sim_logs

    def get_status_payload(self) -> dict:
        """
        Builds the real-time API response payload for the frontend.
        Ensures strict privacy: only aggregate counts, signal distributions,
        and anonymous log streams.
        """
        now = time.time()
        cutoff = now - self.detection_window

        # Live data from real Bluetooth hardware adapter
        live_active_records = [r for r in self._detections.values() if r.last_seen >= cutoff]
        live_count = len(live_active_records)
        
        # Signal strength histogram
        strong_count = sum(1 for r in live_active_records if r.last_rssi >= -70)
        moderate_count = sum(1 for r in live_active_records if -85 <= r.last_rssi < -70)
        weak_count = sum(1 for r in live_active_records if r.last_rssi < -85)

        avg_rssi = (
            round(sum(r.last_rssi for r in live_active_records) / live_count, 1)
            if live_count > 0
            else -80.0
        )

        # In Demo Mode: simulate realistic student density across multiple campus buildings
        if self.mode == "demo":
            t = now / 4.0
            import math
            demo_main = int(18 + math.sin(t * 0.7) * 7 + math.cos(t * 0.3) * 4)
            demo_lib = int(12 + math.cos(t * 0.5) * 5)
            demo_bms = int(15 + math.sin(t * 0.4) * 6)
            demo_host = int(22 + math.cos(t * 0.6) * 8)
            demo_cafe = int(26 + math.sin(t * 0.8) * 9)

            simulated_zones = [
                {
                    "zone_id": "ZONE-MAIN-01",
                    "name": "Easwari Main Academic Wing (Laptop Sensor)",
                    "building_id": "EEC-MAIN-01",
                    "position_3d": [-6.0, 1.8, 30.0],
                    "coverage_radius": 22.0,
                    "is_physical_sensor": True,
                    "detected_devices": demo_main,
                    "density_status": self._calculate_density_status(demo_main)
                },
                {
                    "zone_id": "ZONE-LIB-02",
                    "name": "Central Library & Convention Hall",
                    "building_id": "EEC-LIB-03",
                    "position_3d": [18.0, 1.8, 30.0],
                    "coverage_radius": 20.0,
                    "is_physical_sensor": False,
                    "detected_devices": demo_lib,
                    "density_status": self._calculate_density_status(demo_lib)
                },
                {
                    "zone_id": "ZONE-BMS-03",
                    "name": "BMS Management Studies Quad",
                    "building_id": "SRM-BMS-05",
                    "position_3d": [-48.0, 1.8, 5.0],
                    "coverage_radius": 24.0,
                    "is_physical_sensor": False,
                    "detected_devices": demo_bms,
                    "density_status": self._calculate_density_status(demo_bms)
                },
                {
                    "zone_id": "ZONE-HOST-04",
                    "name": "SRM Boys Hostel-3 Courtyard",
                    "building_id": "SRM-HOST-06",
                    "position_3d": [50.0, 1.8, -10.0],
                    "coverage_radius": 25.0,
                    "is_physical_sensor": False,
                    "detected_devices": demo_host,
                    "density_status": self._calculate_density_status(demo_host)
                },
                {
                    "zone_id": "ZONE-CAFE-05",
                    "name": "Student Pavilion & Health Center",
                    "building_id": "SRM-AMENITY-10",
                    "position_3d": [2.0, 1.8, -24.0],
                    "coverage_radius": 20.0,
                    "is_physical_sensor": False,
                    "detected_devices": demo_cafe,
                    "density_status": self._calculate_density_status(demo_cafe)
                }
            ]
            total_demo_devices = sum(z["detected_devices"] for z in simulated_zones)

            return {
                "scanner_status": "active",
                "status_message": "Demonstration Mode Active: Multi-zone campus simulation",
                "mode": "demo",
                "detected_devices": total_demo_devices,
                "detection_window": self.detection_window,
                "last_updated": datetime.now(timezone.utc).isoformat(),
                "active_sensors_count": len(simulated_zones),
                "density_status": self._calculate_density_status(total_demo_devices // len(simulated_zones)),
                "primary_sensor": simulated_zones[0],
                "zones": simulated_zones,
                "signals": {
                    "avg_rssi": -74.5,
                    "strong": int(total_demo_devices * 0.25),
                    "moderate": int(total_demo_devices * 0.50),
                    "weak": int(total_demo_devices * 0.25)
                },
                "hardware_diagnostics": {
                    "adapter_ready": self.scanner_status == "active",
                    "real_hardware_count": live_count,
                    "real_adapter_status": self.scanner_status
                },
                "recent_logs": self._generate_demo_logs(35)
            }

        # LIVE MODE: Pure real data directly from laptop Bluetooth adapter
        primary_zone_data = {
            "zone_id": self.laptop_sensor_zone.zone_id,
            "name": self.laptop_sensor_zone.name,
            "building_id": self.laptop_sensor_zone.building_id,
            "position_3d": list(self.laptop_sensor_zone.position_3d),
            "coverage_radius": self.laptop_sensor_zone.coverage_radius_meters,
            "is_physical_sensor": True,
            "detected_devices": live_count,
            "density_status": self._calculate_density_status(live_count)
        }

        iso_timestamp = (
            datetime.fromtimestamp(self.last_scan_time, tz=timezone.utc).isoformat()
            if self.last_scan_time
            else datetime.now(timezone.utc).isoformat()
        )

        return {
            "scanner_status": self.scanner_status,
            "status_message": self.status_message,
            "mode": "live",
            "detected_devices": live_count,
            "detection_window": self.detection_window,
            "last_updated": iso_timestamp,
            "active_sensors_count": 1 if self.scanner_status == "active" else 0,
            "density_status": self._calculate_density_status(live_count),
            "total_packets_received": self.total_packets_received,
            "primary_sensor": primary_zone_data,
            "zones": [primary_zone_data],
            "signals": {
                "avg_rssi": avg_rssi,
                "strong": strong_count,
                "moderate": moderate_count,
                "weak": weak_count
            },
            "hardware_diagnostics": {
                "adapter_ready": self.scanner_status == "active",
                "real_hardware_count": live_count,
                "error_details": self.error_details
            },
            "recent_logs": list(self._recent_logs)[-50:]
        }
