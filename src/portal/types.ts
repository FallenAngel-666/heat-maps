export type UserRole = 'student_staff' | 'admin';

export type PortalView = 
  | 'home'
  | 'auditorium-booking'
  | 'report-incident'
  | 'emergency-sos'
  | 'my-requests';

export type AdminView = 
  | 'overview'
  | 'bookings'
  | 'incidents'
  | 'emergency-sos'
  | 'reports';

export interface Auditorium {
  id: string;
  name: string;
  shortName: string;
  location: string;
  capacity: number;
  image: string;
  facilities: string[];
  contactPerson: string;
  availableDays: string;
}

export type BookingStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED';

export interface AuditoriumBooking {
  id: string;
  auditoriumId: string;
  auditoriumName: string;
  applicantName: string;
  registerNumber: string;
  department: string;
  eventName: string;
  eventDescription: string;
  participantsCount: number;
  bookingDate: string; // YYYY-MM-DD
  startTime: string; // HH:MM
  endTime: string; // HH:MM
  contactNumber: string;
  status: BookingStatus;
  submittedAt: string;
  adminRemarks?: string;
  reviewedBy?: string;
  reviewedAt?: string;
}

export type IncidentCategory = 
  | 'Electrical Issues'
  | 'Fire Hazards'
  | 'Water Leakage'
  | 'Infrastructure Damage'
  | 'Medical Emergencies'
  | 'Security Issues'
  | 'Harassment / Safety Concerns'
  | 'Equipment Malfunction'
  | 'Other';

export type IncidentStatus = 
  | 'RECEIVED'
  | 'UNDER REVIEW'
  | 'ASSIGNED'
  | 'IN PROGRESS'
  | 'RESOLVED'
  | 'CLOSED';

export type IncidentPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface IncidentReport {
  id: string;
  category: IncidentCategory;
  title: string;
  description: string;
  campusLocation: string;
  floorRoom: string;
  photoUrl?: string;
  contactInfo: string;
  isAnonymous: boolean;
  status: IncidentStatus;
  priority: IncidentPriority;
  submittedAt: string;
  assignedTo?: string;
  resolutionNotes?: string;
  resolvedAt?: string;
}

export type SOSCategory = 
  | 'Medical Emergency'
  | 'Fire Emergency'
  | 'Security Emergency'
  | 'Personal Safety'
  | 'Other Emergency';

export type SOSStatus = 
  | 'SOS SENT'
  | 'RECEIVED BY BASE STATION'
  | 'RESPONSE TEAM ASSIGNED'
  | 'HELP IS ON THE WAY'
  | 'EMERGENCY RESOLVED';

export interface GPSCoords {
  latitude: number;
  longitude: number;
  accuracyMeters: number;
}

export interface EmergencyAlert {
  id: string;
  category: SOSCategory;
  description?: string;
  gpsCoordinates: GPSCoords | null;
  buildingLocation: string;
  userIdentifier: string;
  contactPhone: string;
  timestamp: string;
  status: SOSStatus;
  acknowledgedAt?: string;
  responseTeamAssigned?: string;
  dispatchedAt?: string;
  resolvedAt?: string;
  isMeshRelay?: boolean;
}

export interface PortalNotification {
  id: string;
  title: string;
  message: string;
  type: 'booking' | 'incident' | 'sos' | 'system';
  timestamp: string;
  isRead: boolean;
  relatedId?: string;
}
