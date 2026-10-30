import { Auditorium, AuditoriumBooking, IncidentReport, EmergencyAlert } from './types';

export const AUDITORIUMS_DATA: Auditorium[] = [
  {
    id: 'aud-01',
    name: 'Dr. T.R. Paarivendhar Convention Auditorium',
    shortName: 'Main Auditorium',
    location: 'Central Library Block, Ground & 1st Floor',
    capacity: 800,
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80',
    facilities: [
      'Centralized Air Conditioning',
      'Dual Laser Projectors & Motorized Screens',
      'Digital Acoustic Soundproofing & Line-Array Audio',
      'Motorized Stage Lighting & Curtains',
      'VIP Green Rooms (2) & Dignitary Lounge',
      'Dedicated Diesel Generator Backup'
    ],
    contactPerson: 'Dr. P. Nirmala (Hall Superintendent)',
    availableDays: 'Monday - Saturday (08:30 AM - 07:30 PM)'
  },
  {
    id: 'aud-02',
    name: 'Mechanical & Civil Seminar Hall',
    shortName: 'Mech Seminar Hall',
    location: 'Mechanical Engineering Complex, Level 2',
    capacity: 250,
    image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=80',
    facilities: [
      'Split Air Conditioning',
      'Smart Digital Podium with Touch Control',
      'HD Video Conferencing & Live Streaming Kit',
      'Tiered Executive Theater Seating',
      'Wireless Handheld & Collar Microphones'
    ],
    contactPerson: 'Dr. M. Senthil (Lab Superintendent)',
    availableDays: 'Monday - Saturday (09:00 AM - 05:00 PM)'
  },
  {
    id: 'aud-03',
    name: 'PG & Technology Innovation Auditorium',
    shortName: 'Innovation Hall',
    location: 'PG & Technology Center, Level 3',
    capacity: 180,
    image: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=1200&q=80',
    facilities: [
      'Acoustic Ceiling & Wall Treatments',
      'High-Speed Gigabit LAN & Wi-Fi 6',
      '85-inch Interactive 4K Touch Display',
      'Dolby Surround Sound System',
      'Recording & Podcast Equipment'
    ],
    contactPerson: 'Dr. T. Murugan (Placement & PG Director)',
    availableDays: 'Monday - Saturday (08:30 AM - 06:00 PM)'
  },
  {
    id: 'aud-04',
    name: 'CSE Smart Conference Hall',
    shortName: 'CSE Conference Hall',
    location: 'Easwari Main Academic Block, Level 1',
    capacity: 120,
    image: 'https://images.unsplash.com/photo-1431540015161-0bf868a2d407?auto=format&fit=crop&w=1200&q=80',
    facilities: [
      'Executive Round-Table Layout',
      'Polycom Telepresence Video Conferencing',
      'Individual Delegate Microphone Units',
      'Motorized Projector Screen',
      'Quiet HVAC System'
    ],
    contactPerson: 'Prof. S. Karthik (CSE Department Coordinator)',
    availableDays: 'Monday - Saturday (09:00 AM - 05:00 PM)'
  }
];

export const INITIAL_BOOKINGS: AuditoriumBooking[] = [
  {
    id: 'BKG-2026-101',
    auditoriumId: 'aud-01',
    auditoriumName: 'Dr. T.R. Paarivendhar Convention Auditorium',
    applicantName: 'Dr. K. Kathiravan',
    registerNumber: 'EMP-1042',
    department: 'Computer Science & Engineering',
    eventName: 'International Conference on Generative AI & Autonomous Systems',
    eventDescription: 'Two-day IEEE international conference featuring keynote speakers from IIT Madras and Google DeepMind.',
    participantsCount: 650,
    bookingDate: '2026-11-05',
    startTime: '09:00',
    endTime: '17:00',
    contactNumber: '+91 98401 44210',
    status: 'APPROVED',
    submittedAt: '2026-10-28 10:15 AM',
    reviewedBy: 'Campus Facility Director',
    reviewedAt: '2026-10-28 02:30 PM',
    adminRemarks: 'Approved with full AV technician crew assigned and backup generator standby.'
  },
  {
    id: 'BKG-2026-102',
    auditoriumId: 'aud-02',
    auditoriumName: 'Mechanical & Civil Seminar Hall',
    applicantName: 'Vigneshwaran S',
    registerNumber: 'RA2111003010452',
    department: 'Mechanical Engineering',
    eventName: 'SAE Collegiate Chapter EV Powertrain Workshop',
    eventDescription: 'Technical workshop on battery pack design, cell balancing, and BLDC motor testing for students.',
    participantsCount: 160,
    bookingDate: '2026-11-08',
    startTime: '10:00',
    endTime: '13:30',
    contactNumber: '+91 97890 55123',
    status: 'PENDING',
    submittedAt: '2026-10-30 11:20 AM'
  },
  {
    id: 'BKG-2026-103',
    auditoriumId: 'aud-03',
    auditoriumName: 'PG & Technology Innovation Auditorium',
    applicantName: 'Divya M',
    registerNumber: 'RA2111008010219',
    department: 'Information Technology',
    eventName: 'Campus Hackathon Final Round Project Demos',
    eventDescription: '24-hour hackathon project pitching and jury evaluation session with industry executives.',
    participantsCount: 120,
    bookingDate: '2026-11-02',
    startTime: '14:00',
    endTime: '18:00',
    contactNumber: '+91 94442 88910',
    status: 'APPROVED',
    submittedAt: '2026-10-29 09:40 AM',
    reviewedBy: 'Dean of Student Affairs',
    reviewedAt: '2026-10-29 04:10 PM',
    adminRemarks: 'Approved. Wi-Fi credentials for external mentors arranged.'
  }
];

export const INITIAL_INCIDENTS: IncidentReport[] = [
  {
    id: 'INC-2026-081',
    category: 'Electrical Issues',
    title: 'Phase-B Voltage Drop & Motor Vibration in Chiller Loop',
    description: 'Chiller plant motor #2 in the central library is experiencing abnormal vibration and phase imbalance.',
    campusLocation: 'Easwari Central Library & Convention Hall',
    floorRoom: 'Basement Mechanical Plant Room B-04',
    contactInfo: '+91 98401 23091',
    isAnonymous: false,
    status: 'IN PROGRESS',
    priority: 'HIGH',
    submittedAt: '2026-10-30 02:15 PM',
    assignedTo: 'Er. Rajesh Kumar (Senior Electrical Engineer)',
    resolutionNotes: 'Danfoss expansion valve inspected. Replacement contactor relay scheduled.'
  },
  {
    id: 'INC-2026-082',
    category: 'Water Leakage',
    title: 'Ceiling Pipe Leakage near First Floor Restroom',
    description: 'Fresh water supply pipe elbow has minor dripping causing floor slickness.',
    campusLocation: 'Easwari Main Academic Block',
    floorRoom: 'Floor 1 - Near ECE Staff Lounge',
    contactInfo: '+91 97890 41235',
    isAnonymous: true,
    status: 'ASSIGNED',
    priority: 'MEDIUM',
    submittedAt: '2026-10-30 01:40 PM',
    assignedTo: 'Er. K. Murugan (Hydraulic & Plumbing Lead)'
  },
  {
    id: 'INC-2026-080',
    category: 'Infrastructure Damage',
    title: 'Staircase Handrail Loose on 3rd Floor East Wing',
    description: 'Welded joint on the stainless steel safety handrail is loose and wobbles under weight.',
    campusLocation: 'Easwari Mechanical & Civil Labs',
    floorRoom: 'Floor 3 - East Stairwell',
    contactInfo: 'RA2111002010098',
    isAnonymous: false,
    status: 'RESOLVED',
    priority: 'LOW',
    submittedAt: '2026-10-29 11:10 AM',
    assignedTo: 'Civil Maintenance Workshop',
    resolutionNotes: 'Welded and reinforced with heavy-duty brackets. Safety verified.',
    resolvedAt: '2026-10-29 04:30 PM'
  }
];

export const INITIAL_EMERGENCY_ALERTS: EmergencyAlert[] = [
  {
    id: 'SOS-2026-001',
    category: 'Medical Emergency',
    description: 'Student collapsed during athletic sprint practice with acute heat exhaustion and dehydration.',
    gpsCoordinates: {
      latitude: 13.0336,
      longitude: 80.1807,
      accuracyMeters: 2.1
    },
    buildingLocation: 'Easwari Sports Arena & Outdoor Pavilion',
    userIdentifier: 'RA2111001010344 (Rahul Sharma)',
    contactPhone: '+91 94443 21908',
    timestamp: '2026-10-30 03:10 PM',
    status: 'EMERGENCY RESOLVED',
    acknowledgedAt: '2026-10-30 03:10:45 PM',
    responseTeamAssigned: 'Campus Medical Response Van #1 (Dr. Sundari & Paramedics)',
    dispatchedAt: '2026-10-30 03:11:10 PM',
    resolvedAt: '2026-10-30 03:45 PM',
    isMeshRelay: true
  }
];

export const CAMPUS_BUILDINGS_LIST = [
  'Easwari Main Academic & Admin Block (EEC-01)',
  'Easwari Mechanical & Civil Labs Complex (EEC-02)',
  'Easwari Central Library & Convention Hall (EEC-03)',
  'Easwari PG & Technology Center (EEC-04)',
  'Easwari Sports Arena & Outdoor Pavilion (EEC-05)',
  'Main Entrance Gate 1 (Bharathi Salai)',
  'Campus Cafeteria & Food Court',
  'Transport Depot & Bus Bay'
];
