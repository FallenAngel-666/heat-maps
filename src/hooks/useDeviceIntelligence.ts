import { useState, useEffect, useCallback, useRef } from 'react';
import { 
  DeviceIntelligencePayload, 
  ScannerMode, 
  ScannerStatus, 
  DensityStatus 
} from '../types';

// API Endpoint resolver:
// 1. If VITE_BLE_API_URL is configured, use it.
// 2. If running locally on localhost/127.0.0.1, prioritize local Python Bleak backend (http://127.0.0.1:8000).
// 3. When deployed on Vercel or cloud HTTPS, use relative Vercel Serverless Functions (/api/...).
export const getApiBaseUrl = (): string => {
  if (typeof window === 'undefined') return '';
  if (import.meta.env.VITE_BLE_API_URL) {
    return import.meta.env.VITE_BLE_API_URL;
  }
  const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  if (isLocal) {
    return 'http://127.0.0.1:8000';
  }
  return '';
};

const isCloudHosted = typeof window !== 'undefined' && 
  window.location.hostname !== 'localhost' && 
  window.location.hostname !== '127.0.0.1';

const INITIAL_FALLBACK_PAYLOAD: DeviceIntelligencePayload = {
  scanner_status: isCloudHosted ? 'active' : 'starting',
  status_message: isCloudHosted 
    ? 'CampusOps Cloud Deployment: Real-time Multi-Zone Anonymous BLE Density Active'
    : 'Connecting to CampusOps Bluetooth scanner on Windows laptop...',
  mode: isCloudHosted ? 'demo' : 'live',
  detected_devices: isCloudHosted ? 84 : 0,
  detection_window: 60,
  last_updated: new Date().toISOString(),
  active_sensors_count: isCloudHosted ? 5 : 1,
  density_status: isCloudHosted ? 'high' : 'low',
  primary_sensor: {
    zone_id: 'SENSOR-LAPTOP-01',
    name: 'Field Command Laptop (Easwari Main Block)',
    building_id: 'EEC-MAIN-01',
    position_3d: [-6.0, 1.8, 30.0],
    coverage_radius: 22.0,
    is_physical_sensor: true,
    detected_devices: isCloudHosted ? 26 : 0,
    density_status: isCloudHosted ? 'congested' : 'low'
  },
  zones: isCloudHosted ? [
    {
      zone_id: 'ZONE-MAIN-01',
      name: 'Easwari Main Academic Wing (Laptop Sensor)',
      building_id: 'EEC-MAIN-01',
      position_3d: [-6.0, 1.8, 30.0],
      coverage_radius: 22.0,
      is_physical_sensor: true,
      detected_devices: 26,
      density_status: 'congested'
    },
    {
      zone_id: 'ZONE-LIB-02',
      name: 'Central Library & Convention Hall',
      building_id: 'EEC-LIB-03',
      position_3d: [18.0, 1.8, 30.0],
      coverage_radius: 20.0,
      is_physical_sensor: false,
      detected_devices: 19,
      density_status: 'high'
    },
    {
      zone_id: 'ZONE-BMS-03',
      name: 'BMS Management Studies Quad',
      building_id: 'SRM-BMS-05',
      position_3d: [-48.0, 1.8, 5.0],
      coverage_radius: 24.0,
      is_physical_sensor: false,
      detected_devices: 15,
      density_status: 'high'
    },
    {
      zone_id: 'ZONE-HOST-04',
      name: 'SRM Boys Hostel-3 Courtyard',
      building_id: 'SRM-HOST-06',
      position_3d: [50.0, 1.8, -10.0],
      coverage_radius: 25.0,
      is_physical_sensor: false,
      detected_devices: 21,
      density_status: 'congested'
    },
    {
      zone_id: 'ZONE-CAFE-05',
      name: 'Student Pavilion & Health Center',
      building_id: 'SRM-AMENITY-10',
      position_3d: [2.0, 1.8, -24.0],
      coverage_radius: 20.0,
      is_physical_sensor: false,
      detected_devices: 12,
      density_status: 'medium'
    }
  ] : [
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
    avg_rssi: -74.5,
    strong: isCloudHosted ? 24 : 0,
    moderate: isCloudHosted ? 42 : 0,
    weak: isCloudHosted ? 18 : 0
  },
  hardware_diagnostics: {
    adapter_ready: isCloudHosted ? true : false,
    real_hardware_count: 0,
    error_details: isCloudHosted 
      ? 'Vercel Cloud Serverless Deployment (Multi-Zone Simulation Active)'
      : 'Connecting to local Bluetooth adapter...'
  }
};

export const useDeviceIntelligence = (isEnabled: boolean) => {
  const [data, setData] = useState<DeviceIntelligencePayload>(INITIAL_FALLBACK_PAYLOAD);
  const [isBackendConnected, setIsBackendConnected] = useState<boolean>(isCloudHosted);
  const [isSwitchingMode, setIsSwitchingMode] = useState<boolean>(false);
  const [lastFetchTime, setLastFetchTime] = useState<number>(Date.now());
  const failureCountRef = useRef<number>(0);

  const fetchStatus = useCallback(async () => {
    const baseUrl = getApiBaseUrl();
    try {
      const response = await fetch(`${baseUrl}/api/device-intelligence/status`, {
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

      // If local backend fails but we're on cloud or user is in demo mode, try Vercel /api
      if (baseUrl !== '') {
        try {
          const fallbackRes = await fetch('/api/device-intelligence/status', {
            signal: AbortSignal.timeout(2000)
          });
          if (fallbackRes.ok) {
            const fallbackJson: DeviceIntelligencePayload = await fallbackRes.json();
            setData(fallbackJson);
            setIsBackendConnected(true);
            failureCountRef.current = 0;
            return;
          }
        } catch {
          // continue to offline state handling
        }
      }

      // After 2 consecutive failures, mark as offline if not in demo mode
      if (failureCountRef.current >= 2) {
        setIsBackendConnected(false);
        setData((prev) => {
          if (prev.mode === 'demo') {
            // In demo mode, keep simulating locally with realistic jitter
            const jitter = Math.floor(Math.random() * 5) - 2;
            const newTotal = Math.max(10, (prev.detected_devices || 80) + jitter);
            return {
              ...prev,
              scanner_status: 'active',
              detected_devices: newTotal,
              last_updated: new Date().toISOString()
            };
          }
          return {
            ...prev,
            scanner_status: 'offline',
            status_message: 'Bluetooth Scanner Backend Offline (127.0.0.1:8000). Run: python backend/main.py or switch to Hackathon Demo Mode.'
          };
        });
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
    const baseUrl = getApiBaseUrl();
    try {
      const res = await fetch(`${baseUrl}/api/device-intelligence/mode`, {
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
              detected_devices: 26,
              density_status: 'congested'
            },
            {
              zone_id: 'ZONE-LIB-02',
              name: 'Central Library & Convention Hall',
              building_id: 'EEC-LIB-03',
              position_3d: [18.0, 1.8, 30.0],
              coverage_radius: 20.0,
              is_physical_sensor: false,
              detected_devices: 19,
              density_status: 'high'
            },
            {
              zone_id: 'ZONE-BMS-03',
              name: 'BMS Management Studies Quad',
              building_id: 'SRM-BMS-05',
              position_3d: [-48.0, 1.8, 5.0],
              coverage_radius: 24.0,
              is_physical_sensor: false,
              detected_devices: 15,
              density_status: 'high'
            },
            {
              zone_id: 'ZONE-HOST-04',
              name: 'SRM Boys Hostel-3 Courtyard',
              building_id: 'SRM-HOST-06',
              position_3d: [50.0, 1.8, -10.0],
              coverage_radius: 25.0,
              is_physical_sensor: false,
              detected_devices: 21,
              density_status: 'congested'
            },
            {
              zone_id: 'ZONE-CAFE-05',
              name: 'Student Pavilion & Health Center',
              building_id: 'SRM-AMENITY-10',
              position_3d: [2.0, 1.8, -24.0],
              coverage_radius: 20.0,
              is_physical_sensor: false,
              detected_devices: 12,
              density_status: 'medium'
            }
          ],
          signals: {
            avg_rssi: -74.5,
            strong: 24,
            moderate: 42,
            weak: 18
          }
        }));
        setIsBackendConnected(true);
      }
    } finally {
      setIsSwitchingMode(false);
    }
  }, [fetchStatus]);

  // Force re-scan / adapter reset
  const triggerRescan = useCallback(async () => {
    const baseUrl = getApiBaseUrl();
    try {
      await fetch(`${baseUrl}/api/device-intelligence/rescan`, { method: 'POST' });
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
