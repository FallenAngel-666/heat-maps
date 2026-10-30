import { Building, Incident, EventLog, Technician, InventoryItem, WorkOrder } from '../types';

export const INITIAL_BUILDINGS: Building[] = [
  {
    id: 'EEC-MAIN-01',
    name: 'Easwari Main Academic & Admin Block',
    shortName: 'Main Academic Block',
    code: 'EEC-01',
    category: 'academic',
    position: [-6, 0, 30],
    rotation: [0, 0, 0],
    dimensions: [30, 12, 16],
    floors: 5,
    builtYear: 1996,
    areaSqFt: 145000,
    capacity: 2200,
    currentOccupancy: 1840,
    departments: [
      'Computer Science & Engineering (CSE)',
      'Information Technology (IT)',
      'Artificial Intelligence & Data Science (AI&DS)',
      'Electronics & Communication (ECE)',
      'Principal & Dean Executive Suites'
    ],
    healthStatus: 'green',
    metrics: {
      powerKw: 142.5,
      tempCelsius: 24.2,
      wifiConnections: 860,
      waterPressurePsi: 58,
      airQualityAqi: 48,
      fireSafetyReadinessPct: 98
    },
    primaryColor: '#ffffff',
    accentColor: '#0284c7',
    description: 'Flagship academic and administrative block facing Bharathi Salai. Houses Principal and Dean executive offices, smart lecture theaters, CSE/IT centers, and central server nodes.',
    wings: [
      { id: 'w1', name: 'West Computing Wing', offset: [-11, 0, 0], size: [8, 12, 15] },
      { id: 'w2', name: 'Central Admin Portico', offset: [0, 0, 2], size: [10, 13, 16] },
      { id: 'w3', name: 'East Electronics Wing', offset: [11, 0, 0], size: [8, 12, 15] }
    ],
    keyContacts: [
      { role: 'Principal', name: 'Dr. K. Kathiravan', phone: '+91 44 4392 3041' },
      { role: 'Chief Facility Officer', name: 'Mr. R. Sundaram', phone: '+91 94440 18293' }
    ]
  },
  {
    id: 'EEC-MECH-02',
    name: 'Easwari Mechanical & Civil Labs Complex',
    shortName: 'Mech & Civil Labs',
    code: 'EEC-02',
    category: 'academic',
    position: [-26, 0, 20],
    rotation: [0, 0.05, 0],
    dimensions: [18, 9, 20],
    floors: 3,
    builtYear: 1999,
    areaSqFt: 62000,
    capacity: 750,
    currentOccupancy: 490,
    departments: [
      'Mechanical Engineering Workshops',
      'Civil Engineering & Heavy Structures Lab',
      'Advanced Robotics & Mechatronics COE',
      'Strength of Materials Workshop'
    ],
    healthStatus: 'green',
    metrics: {
      powerKw: 98.4,
      tempCelsius: 25.8,
      wifiConnections: 240,
      waterPressurePsi: 52,
      airQualityAqi: 52,
      fireSafetyReadinessPct: 96
    },
    primaryColor: '#f8fafc',
    accentColor: '#0369a1',
    description: 'Houses heavy testing laboratories, robotics research incubators, CNC machining cells, and strength of materials workshops for Easwari engineering students.',
    wings: [
      { id: 'w1', name: 'Machine Workshop Hall', offset: [0, -2, -4], size: [16, 6, 10] },
      { id: 'w2', name: 'Robotics Center', offset: [0, 1, 4], size: [16, 8, 8] }
    ],
    keyContacts: [
      { role: 'Lab Superintendent', name: 'Dr. M. Senthil', phone: '+91 98402 44109' }
    ]
  },
  {
    id: 'EEC-LIB-03',
    name: 'Easwari Central Library & Convention Hall',
    shortName: 'Central Library',
    code: 'EEC-03',
    category: 'library',
    position: [18, 0, 30],
    rotation: [0, -0.02, 0],
    dimensions: [20, 11, 15],
    floors: 4,
    builtYear: 2004,
    areaSqFt: 54000,
    capacity: 1100,
    currentOccupancy: 620,
    departments: [
      'Centralized Digital Knowledge Repository',
      'IEEE & ScienceDirect Electronic Access Center',
      'Dr. T.R. Paarivendhar Auditorium (800 Seater)',
      'Research & Patent Incubation Cell'
    ],
    healthStatus: 'amber',
    metrics: {
      powerKw: 76.2,
      tempCelsius: 26.5,
      wifiConnections: 480,
      waterPressurePsi: 54,
      airQualityAqi: 58,
      fireSafetyReadinessPct: 94
    },
    primaryColor: '#ffffff',
    accentColor: '#0ea5e9',
    description: 'Premier air-conditioned library housing over 75,000 volumes, international journal databases, media resource center, and convention auditorium.',
    wings: [
      { id: 'w1', name: 'Stack Rooms & Reading Lounges', offset: [-4, 0, 0], size: [10, 11, 14] },
      { id: 'w2', name: 'Main Auditorium Tier', offset: [5, 1, 0], size: [9, 12, 14] }
    ],
    keyContacts: [
      { role: 'Chief Librarian', name: 'Dr. P. Nirmala', phone: '+91 44 4392 3110' }
    ]
  },
  {
    id: 'EEC-PG-04',
    name: 'Easwari PG & Technology Research Center',
    shortName: 'PG & Tech Block',
    code: 'EEC-04',
    category: 'academic',
    position: [22, 0, -18],
    rotation: [0, 0, 0],
    dimensions: [20, 10, 16],
    floors: 4,
    builtYear: 2015,
    areaSqFt: 48000,
    capacity: 800,
    currentOccupancy: 410,
    departments: [
      'M.E. Structural Engineering',
      'M.E. Computer Science & Engineering',
      'AI & Cloud Computing Center of Excellence',
      'Corporate Relations & Placement Cell'
    ],
    healthStatus: 'grey',
    metrics: {
      powerKw: 42.1,
      tempCelsius: 24.8,
      wifiConnections: 190,
      waterPressurePsi: 48,
      airQualityAqi: 51,
      fireSafetyReadinessPct: 92
    },
    primaryColor: '#e2e8f0',
    accentColor: '#64748b',
    description: 'Center for Post-Graduate research, industry-sponsored laboratories, corporate placement interviews, and innovation sandbox. Telemetry sensors currently undergoing scheduled calibration.',
    keyContacts: [
      { role: 'Placement Director', name: 'Dr. T. Murugan', phone: '+91 44 4392 3150' }
    ]
  },
  {
    id: 'EEC-SPORT-05',
    name: 'Easwari Sports Arena & Outdoor Pavilion',
    shortName: 'Sports Complex',
    code: 'EEC-05',
    category: 'sports',
    position: [42, 0, 32],
    rotation: [0, 0, 0],
    dimensions: [22, 6, 16],
    floors: 2,
    builtYear: 2012,
    areaSqFt: 42000,
    capacity: 500,
    currentOccupancy: 180,
    departments: [
      'Department of Physical Education',
      'Indoor Badminton & Table Tennis Complex',
      'Student Gymnasium & Fitness Pavilion'
    ],
    healthStatus: 'green',
    metrics: {
      powerKw: 34.0,
      tempCelsius: 26.0,
      wifiConnections: 120,
      waterPressurePsi: 56,
      airQualityAqi: 47,
      fireSafetyReadinessPct: 99
    },
    primaryColor: '#f8fafc',
    accentColor: '#10b981',
    description: 'Multi-sport training pavilion with synthetic courts, floodlighting, and physical fitness facilities for Easwari Engineering College students.',
    keyContacts: [
      { role: 'Physical Director', name: 'Dr. K. Manoharan', phone: '+91 94443 21908' }
    ]
  },
  {
    id: 'EEC-GATE-06',
    name: 'Easwari Main Entrance Gate & Security Station',
    shortName: 'Gate 1 (Bharathi Salai)',
    code: 'EEC-06',
    category: 'utility',
    position: [-5, 0, 42],
    rotation: [0, 0, 0],
    dimensions: [16, 6, 3],
    floors: 1,
    builtYear: 1996,
    areaSqFt: 4500,
    capacity: 40,
    currentOccupancy: 15,
    departments: [
      'Campus Security & Visitor Access Control',
      'Emergency Transit Command'
    ],
    healthStatus: 'green',
    metrics: {
      powerKw: 12.0,
      tempCelsius: 27.2,
      wifiConnections: 35,
      waterPressurePsi: 60,
      airQualityAqi: 50,
      fireSafetyReadinessPct: 100
    },
    primaryColor: '#0284c7',
    accentColor: '#0369a1',
    description: 'Main campus security checkpoint and grand architectural gate on Bharathi Salai.',
    keyContacts: [
      { role: 'Security Supervisor', name: 'Mr. G. Ravikumar', phone: '+91 98408 55432' }
    ]
  }
];

export const INITIAL_INCIDENTS: Incident[] = [
  {
    id: 'INC-2026-081',
    buildingId: 'EEC-LIB-03',
    buildingName: 'Easwari Central Library & Convention Hall',
    floorZone: 'Floor 3 - West HVAC Plant',
    title: 'HVAC Chiller Motor Vibration Alert',
    description: 'Thermal sensor telemetry detected abnormal vibration and heat buildup in condenser loop #2. Maintenance team dispatched to inspect lubrication and bearings.',
    severity: 'attention',
    category: 'HVAC',
    reportedAt: '12 mins ago',
    reportedBy: 'IoT Building Management System',
    status: 'investigating'
  }
];

export const INITIAL_EVENTS: EventLog[] = [
  {
    id: 'EVT-101',
    timestamp: '15:18:02',
    buildingId: 'EEC-LIB-03',
    buildingName: 'Easwari Central Library',
    message: 'HVAC Chiller Motor telemetry warning flagged (Ambient temp 26.5°C).',
    type: 'incident',
    severity: 'amber'
  },
  {
    id: 'EVT-102',
    timestamp: '14:55:10',
    buildingId: 'EEC-MAIN-01',
    buildingName: 'Easwari Main Academic Block',
    message: 'Campus main electrical feeder switched to grid optimal tier. Nominal load 142.5 kW.',
    type: 'system',
    severity: 'green'
  },
  {
    id: 'EVT-103',
    timestamp: '14:20:45',
    buildingId: 'EEC-PG-04',
    buildingName: 'Easwari PG & Tech Center',
    message: 'IoT Gateway calibration mode initiated. Telemetry status set to unmonitored (Grey).',
    type: 'status_change',
    severity: 'grey'
  }
];

export const INITIAL_TECHNICIANS: Technician[] = [
  {
    id: 'TECH-01',
    name: 'Er. Rajesh Kumar',
    trade: 'Electrical',
    status: 'available',
    phone: '+91 98401 23091'
  },
  {
    id: 'TECH-02',
    name: 'Er. Senthil Nathan',
    trade: 'HVAC',
    status: 'dispatched',
    phone: '+91 94442 88102',
    assignedIncidentId: 'INC-2026-081',
    etaMins: 8
  },
  {
    id: 'TECH-03',
    name: 'Er. K. Murugan',
    trade: 'Plumbing',
    status: 'available',
    phone: '+91 97890 41235'
  },
  {
    id: 'TECH-04',
    name: 'Er. Deepa Krishnan',
    trade: 'Network',
    status: 'available',
    phone: '+91 98414 77203'
  },
  {
    id: 'TECH-05',
    name: 'Er. Vijay Anand',
    trade: 'Fire/Safety',
    status: 'available',
    phone: '+91 99403 66190'
  }
];

export const INITIAL_INVENTORY: InventoryItem[] = [
  {
    id: 'PART-01',
    name: '500kVA Transformer HT Fuses',
    category: 'Electrical',
    inStock: 14,
    minRequired: 4,
    unit: 'Units',
    location: 'Substation Stores A-12',
    status: 'nominal'
  },
  {
    id: 'PART-02',
    name: 'Industrial Chiller Expansion Valve (Danfoss)',
    category: 'HVAC',
    inStock: 2,
    minRequired: 3,
    unit: 'Units',
    location: 'Mech Yard Bay B',
    status: 'low'
  },
  {
    id: 'PART-03',
    name: 'Cat6A Shielded Backbone Cable (305m)',
    category: 'Network',
    inStock: 8,
    minRequired: 2,
    unit: 'Spools',
    location: 'IT Server Depot C-04',
    status: 'nominal'
  },
  {
    id: 'PART-04',
    name: 'Addressable Optical Smoke Detector Heads',
    category: 'Fire/Safety',
    inStock: 24,
    minRequired: 10,
    unit: 'Units',
    location: 'Fire Command Locker',
    status: 'nominal'
  },
  {
    id: 'PART-05',
    name: '3-Phase Main Contactor Relays (63A)',
    category: 'Electrical',
    inStock: 5,
    minRequired: 2,
    unit: 'Units',
    location: 'Electrical Yard Bay 1',
    status: 'nominal'
  }
];

export const INITIAL_WORK_ORDERS: WorkOrder[] = [
  {
    id: 'WO-2026-042',
    incidentId: 'INC-2026-081',
    buildingId: 'EEC-LIB-03',
    buildingName: 'Easwari Central Library & Convention Hall',
    technicianId: 'TECH-02',
    technicianName: 'Er. Senthil Nathan',
    partUsed: 'Industrial Chiller Expansion Valve (Danfoss)',
    status: 'in-progress',
    createdAt: '15:19:00',
    priority: 'high'
  }
];

// Verified GPS Boundary Coordinates for SRM Easwari Engineering College (WGS84)
export const EASWARI_CAMPUS_BOUNDARY = [
  { lat: 13.03265, lng: 80.17835 }, // South-West Corner (Bharathi Salai Gate)
  { lat: 13.03272, lng: 80.18085 }, // South-East Corner (Sports Arena corner)
  { lat: 13.03415, lng: 80.18115 }, // North-East Corner (Hostel boundary)
  { lat: 13.03430, lng: 80.17860 }, // North-West Corner (Tech block perimeter)
  { lat: 13.03340, lng: 80.17830 }  // West Corner (BMS Block Road)
];
