"""
CampusOps - Live Mobile Device Intelligence & Anonymous BLE Detection Module
Bluetooth Scanner Service using Bleak for Windows 11.
"""

import asyncio
import hashlib
import logging
import os
import secrets
import time
from dataclasses import dataclass, field
from datetime import datetime, timezone
from typing import Dict, List, Optional, Tuple

from bleak import BleakScanner
from bleak.backends.device import BLEDevice
from bleak.backends.scanner import AdvertisementData

logger = logging.getLogger("campusops.ble")
logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(name)s: %(message)s")


@dataclass
class AnonymousDetection:
    """Anonymous temporary record for a detected BLE device."""
    anon_id: str
    first_seen: float
    last_seen: float
    last_rssi: int
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
    Preserves strict privacy: MAC addresses and device names are never stored or exposed.
    """

    def __init__(self, detection_window_seconds: int = 60):
        self.detection_window: int = detection_window_seconds
        
        # Ephemeral session salt generated on startup; never persisted
        self._session_salt: bytes = secrets.token_bytes(32)
        
        # In-memory anonymous registry: { anon_id: AnonymousDetection }
        self._detections: Dict[str, AnonymousDetection] = {}
        
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
        # Returns a truncated 16-hex-character anonymous identifier
        return f"DEV-{hasher.hexdigest()[:12].upper()}"

    def _detection_callback(self, device: BLEDevice, advertisement_data: AdvertisementData) -> None:
        """
        Callback invoked by Bleak whenever a BLE advertisement is captured.
        Extracts only RSSI and updates anonymous timestamp record.
        """
        now = time.time()
        self.last_scan_time = now
        self.total_packets_received += 1
        
        # Compute anonymous ID without storing raw MAC or device name
        anon_id = self._anonymize_address(device.address)
        rssi = advertisement_data.rssi if advertisement_data.rssi is not None else -90

        if anon_id in self._detections:
            rec = self._detections[anon_id]
            rec.last_seen = now
            rec.last_rssi = rssi
            rec.packet_count += 1
        else:
            self._detections[anon_id] = AnonymousDetection(
                anon_id=anon_id,
                first_seen=now,
                last_seen=now,
                last_rssi=rssi,
                packet_count=1
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

                    if expired:
                        logger.debug("Purged %d expired BLE detection(s)", len(expired))
            except asyncio.CancelledError:
                break
            except Exception as e:
                logger.error("Error in BLE cleanup loop: %s", e)

    async def _scanner_worker(self) -> None:
        """Continuous background scanner loop with automatic error recovery."""
        retry_delay = 3.0
        while self._is_running:
            try:
                logger.info("Initializing BleakScanner on Windows Bluetooth adapter...")
                self.scanner_status = "starting"
                self.status_message = "Activating laptop Bluetooth Low Energy adapter..."
                self.error_details = None

                self._bleak_scanner = BleakScanner(detection_callback=self._detection_callback)
                await self._bleak_scanner.start()

                self.scanner_status = "active"
                self.status_message = "Active - Scanning for BLE advertisements in 60s sliding window"
                logger.info("Bluetooth Low Energy scanner successfully active.")

                # Keep scanner running while self._is_running is True
                while self._is_running:
                    await asyncio.sleep(1.0)

            except asyncio.CancelledError:
                break
            except Exception as e:
                logger.error("Bluetooth adapter exception: %s (%s)", type(e).__name__, e)
                self.scanner_status = "offline"
                self.status_message = f"Bluetooth adapter offline: {type(e).__name__}"
                self.error_details = str(e)
                
                # Close previous scanner if still open
                if self._bleak_scanner:
                    try:
                        await self._bleak_scanner.stop()
                    except Exception:
                        pass
                    self._bleak_scanner = None

                # Wait before retry attempt if still supposed to run
                if self._is_running:
                    logger.info("Retrying Bluetooth scanner startup in %ds...", retry_delay)
                    await asyncio.sleep(retry_delay)
                    retry_delay = min(retry_delay * 1.5, 15.0)

    async def start(self) -> None:
        """Starts the BLE scanner manager."""
        if self._is_running:
            return

        self._is_running = True
        self._cleanup_task = asyncio.create_task(self._cleanup_loop())
        self._scan_task = asyncio.create_task(self._scanner_worker())
        logger.info("AnonymousBLEScannerManager started.")

    async def stop(self) -> None:
        """Stops the BLE scanner gracefully."""
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

    def get_status_payload(self) -> dict:
        """
        Builds the real-time API response payload for the frontend.
        Ensures strict privacy: only aggregate counts and signal distributions.
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
            # Dynamic time-varying simulation for hackathon demo
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
                }
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
            }
        }
