"""
CampusOps - Live Mobile Device Intelligence & Detection Module
FastAPI Backend Server
"""

import os
from contextlib import asynccontextmanager
from typing import Literal

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from ble_scanner import AnonymousBLEScannerManager

# Initialize the global BLE scanner manager
ble_manager = AnonymousBLEScannerManager(detection_window_seconds=60)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Lifecycle manager: Start scanner on startup, stop on shutdown."""
    print("[CampusOps Backend] Starting Anonymous BLE Scanner service...")
    await ble_manager.start()
    yield
    print("[CampusOps Backend] Shutting down BLE Scanner service...")
    await ble_manager.stop()


app = FastAPI(
    title="CampusOps - Device Intelligence API",
    description="Anonymous Bluetooth Low Energy mobile device detection module for CampusOps campus security map.",
    version="1.0.0",
    lifespan=lifespan
)

# Enable CORS for local Vite development frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "*"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class ModeRequest(BaseModel):
    mode: Literal["live", "demo"]


@app.get("/")
async def root():
    return {
        "service": "CampusOps Live Device Intelligence Module",
        "status": "online",
        "api_docs": "/docs",
        "endpoints": {
            "status": "/api/device-intelligence/status",
            "zones": "/api/device-intelligence/zones",
            "set_mode": "/api/device-intelligence/mode"
        }
    }


@app.get("/api/device-intelligence/status")
async def get_device_intelligence_status():
    """
    Primary API endpoint required by CampusOps frontend:
    Returns scanner status, detected devices in 60s sliding window, sensor zone telemetry,
    and density estimation.
    """
    return ble_manager.get_status_payload()


@app.get("/api/device-intelligence/zones")
async def get_sensor_zones():
    """Returns the list of campus coverage zones and their active device densities."""
    payload = ble_manager.get_status_payload()
    return {
        "mode": payload["mode"],
        "active_sensors_count": payload["active_sensors_count"],
        "zones": payload["zones"]
    }


@app.post("/api/device-intelligence/mode")
async def set_scanner_mode(body: ModeRequest):
    """Toggle between 'live' (laptop hardware BLE) and 'demo' (multi-zone simulation)."""
    ble_manager.set_mode(body.mode)
    return {
        "success": True,
        "active_mode": ble_manager.mode,
        "message": f"CampusOps scanner mode switched to '{ble_manager.mode}'."
    }


@app.post("/api/device-intelligence/rescan")
async def trigger_rescan():
    """Forces adapter reconnection / scanner refresh."""
    await ble_manager.stop()
    await ble_manager.start()
    return {
        "success": True,
        "status": ble_manager.scanner_status,
        "message": "Scanner reset and re-initialized."
    }


@app.get("/api/device-intelligence/health")
async def get_health():
    """Health check endpoint."""
    return {
        "status": "healthy",
        "scanner_status": ble_manager.scanner_status,
        "mode": ble_manager.mode,
        "adapter_packets_total": ble_manager.total_packets_received
    }


if __name__ == "__main__":
    import uvicorn
    # Bind to 127.0.0.1:8000
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=False)
