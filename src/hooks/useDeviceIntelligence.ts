import { useState, useEffect, useCallback, useRef } from 'react';
import { 
  DeviceIntelligencePayload, 
  ScannerMode, 
  ScannerStatus, 
  DensityStatus 
} from '../types';

const API_BASE_URL = 'http://127.0.0.1:8000';

const INITIAL_FALLBACK_PAYLOAD: DeviceIntelligencePayload = {
  scanner_status: 'offline',
  status_message: 'Connecting to CampusOps Bluetooth scanner on Windows laptop...',
  mode: 'live',
  detected_devices: 0,
  detection_window: 60,
  last_updated: new Date().toISOString(),
  active_sensors_count: 0,
  density_status: 'low',
  primary_sensor: {
    zone_id: 'SENSOR-LAPTOP-01',
    name: 'Field Command Laptop (Easwari Main Block)',
    building_id: 'EEC-MAIN-01',
    position_3d: [-6.0, 1.8, 30.0],
    coverage_radius: 22.0,
    is_physical_sensor: true,
    detected_devices: 0,
    density_status: 'low'
  },
  zones: [
    {
      zone_id: 'SENSOR-LAPTOP-01',
      name: 'Field Command Laptop (Easwari Main Block)',
      building_id: 'EEC-MAIN-01',
      position_3d: [-6.0, 1.8, 30.0],
      coverage_radius: 22.0,
      is_physical_sensor: true,
      detected_devices: 0,
      density_status: 'low'
    }
  ],
  signals: {
    avg_rssi: -80,
    strong: 0,
    moderate: 0,
    weak: 0
  },
  hardware_diagnostics: {
    adapter_ready: false,
    real_hardware_count: 0,
    error_details: 'Backend service offline. Start: python backend/main.py'
  }
};

export const useDeviceIntelligence = (isEnabled: boolean) => {
  const [data, setData] = useState<DeviceIntelligencePayload>(INITIAL_FALLBACK_PAYLOAD);
  const [isBackendConnected, setIsBackendConnected] = useState<boolean>(false);
  const [isSwitchingMode, setIsSwitchingMode] = useState<boolean>(false);
  const [lastFetchTime, setLastFetchTime] = useState<number>(Date.now());
  const failureCountRef = useRef<number>(0);

  const fetchStatus = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/device-intelligence/status`, {
        signal: AbortSignal.timeout(2800)
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const json: DeviceIntelligencePayload = await response.json();
      setData(json);
      setIsBackendConnected(true);
      setLastFetchTime(Date.now());
      failureCountRef.current = 0;
    } catch (err: any) {
      failureCountRef.current += 1;
      // After 2 consecutive failures, mark as offline
      if (failureCountRef.current >= 2) {
        setIsBackendConnected(false);
        setData((prev) => ({
          ...prev,
          scanner_status: 'offline',
          status_message: 'Bluetooth Scanner Backend Offline (127.0.0.1:8000). Run: python backend/main.py'
        }));
      }
    }
  }, []);

  // Poll every 3 seconds when toggle is enabled
  useEffect(() => {
    if (!isEnabled) return;

    fetchStatus();
    const interval = setInterval(fetchStatus, 3000);
    return () => clearInterval(interval);
  }, [isEnabled, fetchStatus]);

  // Switch between 'live' (laptop BLE hardware) and 'demo' (multi-zone simulation)
  const setScannerMode = useCallback(async (newMode: ScannerMode) => {
    setIsSwitchingMode(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/device-intelligence/mode`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode: newMode })
      });
      if (res.ok) {
        await fetchStatus();
      }
    } catch (e) {
      console.warn('Could not switch mode on backend, setting client fallback:', e);
      // Fallback for seamless presentation if backend is ever disconnected
      if (newMode === 'demo') {
        setData(prev => ({
          ...prev,
          mode: 'demo',
          scanner_status: 'active',
          detected_devices: 88,
          active_sensors_count: 5,
          density_status: 'high',
          zones: [
            {
              zone_id: 'ZONE-MAIN-01',
              name: 'Easwari Main Academic Wing (Laptop Sensor)',
              building_id: 'EEC-MAIN-01',
              position_3d: [-6.0, 1.8, 30.0],
              coverage_radius: 22.0,
              is_physical_sensor: true,
              detected_devices: 24,
              density_status: 'high'
            },
            {
              zone_id: 'ZONE-LIB-02',
              name: 'Central Library & Convention Hall',
              building_id: 'EEC-LIB-03',
              position_3d: [18.0, 1.8, 30.0],
              coverage_radius: 20.0,
              is_physical_sensor: false,
              detected_devices: 18,
              density_status: 'medium'
            },
            {
              zone_id: 'ZONE-BMS-03',
              name: 'BMS Management Studies Quad',
              building_id: 'SRM-BMS-05',
              position_3d: [-48.0, 1.8, 5.0],
              coverage_radius: 24.0,
              is_physical_sensor: false,
              detected_devices: 15,
              density_status: 'medium'
            },
            {
              zone_id: 'ZONE-HOST-04',
              name: 'SRM Boys Hostel-3 Courtyard',
              building_id: 'SRM-HOST-06',
              position_3d: [50.0, 1.8, -10.0],
              coverage_radius: 25.0,
              is_physical_sensor: false,
              detected_devices: 20,
              density_status: 'high'
            },
            {
              zone_id: 'ZONE-CAFE-05',
              name: 'Student Pavilion & Health Center',
              building_id: 'SRM-AMENITY-10',
              position_3d: [2.0, 1.8, -24.0],
              coverage_radius: 20.0,
              is_physical_sensor: false,
              detected_devices: 11,
              density_status: 'medium'
            }
          ],
          signals: {
            avg_rssi: -74.5,
            strong: 22,
            moderate: 44,
            weak: 22
          }
        }));
      }
    } finally {
      setIsSwitchingMode(false);
    }
  }, [fetchStatus]);

  // Force re-scan / adapter reset
  const triggerRescan = useCallback(async () => {
    try {
      await fetch(`${API_BASE_URL}/api/device-intelligence/rescan`, { method: 'POST' });
      await fetchStatus();
    } catch (e) {
      console.warn('Could not trigger rescan:', e);
    }
  }, [fetchStatus]);

  return {
    data,
    isBackendConnected,
    isSwitchingMode,
    lastFetchTime,
    setScannerMode,
    triggerRescan,
    refreshNow: fetchStatus
  };
};
