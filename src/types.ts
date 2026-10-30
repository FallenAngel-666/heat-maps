export type HealthStatus = 'green' | 'amber' | 'red' | 'grey';

export type BuildingCategory = 
  | 'academic' 
  | 'management' 
  | 'hostel' 
  | 'library' 
  | 'sports' 
  | 'administrative' 
  | 'utility';

export interface BuildingWing {
  id: string;
  name: string;
  offset: [number, number, number];
  size: [number, number, number];
  roofType?: 'flat' | 'sloped' | 'terrace';
}

export interface BuildingTelemetry {
  powerKw: number;
  tempCelsius: number;
  wifiConnections: number;
  waterPressurePsi: number;
  airQualityAqi: number;
  fireSafetyReadinessPct: number;
}

export interface Building {
  id: string;
  name: string;
  shortName: string;
  code: string;
  category: BuildingCategory;
  position: [number, number, number]; // [x, y, z] in 3D space
  rotation: [number, number, number]; // [rx, ry, rz]
  dimensions: [number, number, number]; // [width, height, depth]
  floors: number;
  builtYear: number;
  areaSqFt: number;
  capacity: number;
  currentOccupancy: number;
  departments: string[];
  healthStatus: HealthStatus;
  metrics: BuildingTelemetry;
  primaryColor?: string;
  accentColor?: string;
  description: string;
  modelUrl?: string;
  wings?: BuildingWing[];
  keyContacts?: { role: string; name: string; phone: string }[];
}

export interface Incident {
  id: string;
  buildingId: string;
  buildingName: string;
  floorZone: string;
  title: string;
  description: string;
  severity: 'critical' | 'attention' | 'normal';
  category: 'Electrical' | 'Fire/Safety' | 'Water/Plumbing' | 'Network/IT' | 'HVAC' | 'Structural';
  reportedAt: string;
  reportedBy: string;
  status: 'active' | 'investigating' | 'resolved';
}

export interface EventLog {
  id: string;
  timestamp: string;
  buildingId: string;
  buildingName: string;
  message: string;
  type: 'incident' | 'status_change' | 'system' | 'patrol';
  severity: HealthStatus;
}

export type CameraPreset = 
  | 'overview' 
  | 'front'
  | 'back'
  | 'left'
  | 'right'
  | 'top-down'
  | 'angled-3d'
  | 'north'
  | 'south'
  | 'east'
  | 'west'
  | 'south-gate' 
  | 'easwari-academic' 
  | 'bms-block' 
  | 'hostels' 
  | 'bus-bay';

// --- CORE MODULE NAVIGATION ---
export type ActiveModuleId = 
  | 'none'
  | 'health-map'
  | 'incident-engine'
  | 'digital-twin'
  | 'lifeline-sos'
  | 'command-center'
  | 'mobile-signals';

export interface Technician {
  id: string;
  name: string;
  trade: 'Electrical' | 'HVAC' | 'Plumbing' | 'Network' | 'Fire/Safety';
  status: 'available' | 'dispatched' | 'off-duty';
  phone: string;
  assignedIncidentId?: string;
  etaMins?: number;
}

export interface InventoryItem {
  id: string;
  name: string;
  category: string;
  inStock: number;
  minRequired: number;
  unit: string;
  location: string;
  status: 'nominal' | 'low' | 'critical';
}

export interface WorkOrder {
  id: string;
  incidentId: string;
  buildingId: string;
  buildingName: string;
  technicianId: string;
  technicianName: string;
  partUsed?: string;
  status: 'assigned' | 'in-progress' | 'completed';
  createdAt: string;
  priority: 'high' | 'medium' | 'low';
}

export interface SimulationParams {
  crowdCount: number;
  staffOnDuty: number;
  openGates: number;
  incidentDurationMins: number;
}

export interface SimulationResults {
  congestionRiskPct: number;
  evacuationTimeMins: number;
  bottlenecks: string[];
  recommendation: string;
}

export interface SOSAlert {
  id: string;
  category: 'Medical' | 'Security' | 'Fire' | 'Structural';
  buildingId: string;
  buildingName: string;
  locationDetails: string;
  isLocationSharingEnabled: boolean;
  status: 'transmitting' | 'acknowledged' | 'dispatched';
  timestamp: string;
  dispatchedUnit?: string;
}

// --- LIVE DEVICE INTELLIGENCE TYPES ---
export type DensityStatus = 'low' | 'medium' | 'high' | 'congested';
export type ScannerStatus = 'active' | 'starting' | 'offline' | 'error';
export type ScannerMode = 'live' | 'demo';

export interface SensorZoneData {
  zone_id: string;
  name: string;
  building_id: string;
  position_3d: [number, number, number];
  coverage_radius: number;
  is_physical_sensor: boolean;
  detected_devices: number;
  density_status: DensityStatus;
}

export interface DeviceSignals {
  avg_rssi: number;
  strong: number;
  moderate: number;
  weak: number;
}

export interface DeviceIntelligencePayload {
  scanner_status: ScannerStatus;
  status_message?: string;
  mode: ScannerMode;
  detected_devices: number;
  detection_window: number;
  last_updated: string;
  active_sensors_count: number;
  density_status: DensityStatus;
  total_packets_received?: number;
  primary_sensor: SensorZoneData;
  zones: SensorZoneData[];
  signals: DeviceSignals;
  hardware_diagnostics?: {
    adapter_ready: boolean;
    real_hardware_count?: number;
    error_details?: string | null;
  };
}

