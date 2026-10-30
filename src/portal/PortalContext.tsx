import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { 
  UserRole, 
  PortalView, 
  AdminView, 
  Auditorium, 
  AuditoriumBooking, 
  IncidentReport, 
  EmergencyAlert, 
  PortalNotification,
  BookingStatus,
  IncidentStatus,
  SOSStatus,
  SOSCategory,
  GPSCoords
} from './types';
import { 
  AUDITORIUMS_DATA, 
  INITIAL_BOOKINGS, 
  INITIAL_INCIDENTS, 
  INITIAL_EMERGENCY_ALERTS 
} from './portalData';

interface PortalContextType {
  // Navigation & Role
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  studentView: PortalView;
  setStudentView: (view: PortalView) => void;
  adminView: AdminView;
  setAdminView: (view: AdminView) => void;
  isAdminAuthenticated: boolean;
  loginAdmin: (passcode: string) => boolean;
  logoutAdmin: () => void;

  // Data
  auditoriums: Auditorium[];
  bookings: AuditoriumBooking[];
  incidents: IncidentReport[];
  emergencyAlerts: EmergencyAlert[];
  notifications: PortalNotification[];
  dismissNotification: (id: string) => void;

  // Auditorium Actions
  checkBookingConflict: (auditoriumId: string, date: string, startTime: string, endTime: string, excludeBookingId?: string) => { hasConflict: boolean; conflictingEvent?: string };
  submitBooking: (booking: Omit<AuditoriumBooking, 'id' | 'status' | 'submittedAt'>) => { success: boolean; message: string; bookingId?: string };
  updateBookingStatus: (id: string, status: BookingStatus, remarks?: string) => void;

  // Incident Actions
  submitIncident: (incident: Omit<IncidentReport, 'id' | 'status' | 'priority' | 'submittedAt'>) => { success: boolean; incidentId: string };
  updateIncidentStatus: (id: string, status: IncidentStatus, assignedTo?: string, notes?: string) => void;

  // Emergency SOS Actions
  triggerEmergencySOS: (category: SOSCategory, description: string, coords: GPSCoords | null, location: string, user: string, phone: string) => EmergencyAlert;
  acknowledgeSOS: (id: string) => void;
  assignSOSTeam: (id: string, team: string) => void;
  dispatchSOSTeam: (id: string) => void;
  resolveSOS: (id: string) => void;
  activeEmergencyCount: number;
  latestActiveSOS: EmergencyAlert | null;

  // Reports
  exportReportCSV: (type: 'bookings' | 'incidents' | 'sos' | 'monthly') => void;
}

const PortalContext = createContext<PortalContextType | undefined>(undefined);

const STORAGE_KEYS = {
  BOOKINGS: 'easwari_portal_bookings_v2',
  INCIDENTS: 'easwari_portal_incidents_v2',
  SOS: 'easwari_portal_sos_v2',
  NOTIFICATIONS: 'easwari_portal_notifications_v2',
  ROLE: 'easwari_portal_role_v2',
  AUTH: 'easwari_portal_admin_auth_v2'
};

export const PortalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Role & Views
  const [userRole, setUserRoleState] = useState<UserRole>(() => {
    return (localStorage.getItem(STORAGE_KEYS.ROLE) as UserRole) || 'student_staff';
  });
  const [studentView, setStudentView] = useState<PortalView>('home');
  const [adminView, setAdminView] = useState<AdminView>('overview');
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem(STORAGE_KEYS.AUTH) === 'true';
  });

  const setUserRole = (role: UserRole) => {
    setUserRoleState(role);
    localStorage.setItem(STORAGE_KEYS.ROLE, role);
    if (role === 'admin' && !isAdminAuthenticated) {
      // Prompt or show login
    }
  };

  const loginAdmin = (passcode: string): boolean => {
    // Default passcodes: "admin", "admin123", or empty quick bypass
    if (passcode.toLowerCase() === 'admin' || passcode === 'admin123' || passcode === 'easwari') {
      setIsAdminAuthenticated(true);
      localStorage.setItem(STORAGE_KEYS.AUTH, 'true');
      return true;
    }
    return false;
  };

  const logoutAdmin = () => {
    setIsAdminAuthenticated(false);
    localStorage.removeItem(STORAGE_KEYS.AUTH);
    setUserRole('student_staff');
    setStudentView('home');
  };

  // Persistent Collections
  const [auditoriums] = useState<Auditorium[]>(AUDITORIUMS_DATA);

  const [bookings, setBookings] = useState<AuditoriumBooking[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.BOOKINGS);
      return saved ? JSON.parse(saved) : INITIAL_BOOKINGS;
    } catch {
      return INITIAL_BOOKINGS;
    }
  });

  const [incidents, setIncidents] = useState<IncidentReport[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.INCIDENTS);
      return saved ? JSON.parse(saved) : INITIAL_INCIDENTS;
    } catch {
      return INITIAL_INCIDENTS;
    }
  });

  const [emergencyAlerts, setEmergencyAlerts] = useState<EmergencyAlert[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SOS);
      return saved ? JSON.parse(saved) : INITIAL_EMERGENCY_ALERTS;
    } catch {
      return INITIAL_EMERGENCY_ALERTS;
    }
  });

  const [notifications, setNotifications] = useState<PortalNotification[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings));
  }, [bookings]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.INCIDENTS, JSON.stringify(incidents));
  }, [incidents]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SOS, JSON.stringify(emergencyAlerts));
  }, [emergencyAlerts]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
  }, [notifications]);

  const dismissNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const addNotification = (title: string, message: string, type: PortalNotification['type'], relatedId?: string) => {
    const newNotif: PortalNotification = {
      id: `NOTIF-${Date.now()}`,
      title,
      message,
      type,
      timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }),
      isRead: false,
      relatedId
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  // 1. Conflict Prevention Logic
  const checkBookingConflict = useCallback((
    auditoriumId: string, 
    date: string, 
    startTime: string, 
    endTime: string, 
    excludeBookingId?: string
  ) => {
    const existing = bookings.filter(b => 
      b.auditoriumId === auditoriumId && 
      b.bookingDate === date && 
      b.status !== 'REJECTED' && 
      b.status !== 'CANCELLED' &&
      b.id !== excludeBookingId
    );

    for (const b of existing) {
      // Check time overlap: (StartA < EndB) and (EndA > StartB)
      if (startTime < b.endTime && endTime > b.startTime) {
        return {
          hasConflict: true,
          conflictingEvent: `Conflict with "${b.eventName}" (${b.startTime} - ${b.endTime}, Status: ${b.status})`
        };
      }
    }

    return { hasConflict: false };
  }, [bookings]);

  // Submit Booking
  const submitBooking = useCallback((bookingData: Omit<AuditoriumBooking, 'id' | 'status' | 'submittedAt'>) => {
    // 1. Availability validation
    const conflict = checkBookingConflict(
      bookingData.auditoriumId, 
      bookingData.bookingDate, 
      bookingData.startTime, 
      bookingData.endTime
    );

    if (conflict.hasConflict) {
      return { 
        success: false, 
        message: `This auditorium is already reserved for the selected timeslot. ${conflict.conflictingEvent}` 
      };
    }

    const newId = `BKG-2026-${Math.floor(100 + Math.random() * 900)}`;
    const newBooking: AuditoriumBooking = {
      ...bookingData,
      id: newId,
      status: 'PENDING',
      submittedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) + ' ' + new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    };

    setBookings(prev => [newBooking, ...prev]);
    addNotification('Booking Submitted', `Your reservation request (${newId}) for ${bookingData.auditoriumName} is under review.`, 'booking', newId);

    return { success: true, message: 'Reservation request successfully submitted!', bookingId: newId };
  }, [checkBookingConflict]);

  // Update Booking Status
  const updateBookingStatus = useCallback((id: string, status: BookingStatus, remarks?: string) => {
    setBookings(prev => prev.map(b => {
      if (b.id === id) {
        return {
          ...b,
          status,
          adminRemarks: remarks || b.adminRemarks,
          reviewedBy: 'Campus Facility Director',
          reviewedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) + ' ' + new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
        };
      }
      return b;
    }));

    const target = bookings.find(b => b.id === id);
    if (target) {
      const msg = status === 'APPROVED' 
        ? `Booking ${id} for ${target.auditoriumName} has been APPROVED.`
        : status === 'REJECTED'
        ? `Booking ${id} was REJECTED: ${remarks || 'No remarks provided.'}`
        : `Booking ${id} status updated to ${status}.`;
      addNotification(`Booking ${status}`, msg, 'booking', id);
    }
  }, [bookings]);

  // Submit Incident
  const submitIncident = useCallback((incidentData: Omit<IncidentReport, 'id' | 'status' | 'priority' | 'submittedAt'>) => {
    const newId = `INC-2026-${Math.floor(100 + Math.random() * 900)}`;
    
    // Automatically determine priority based on category
    let priority: IncidentReport['priority'] = 'MEDIUM';
    if (incidentData.category === 'Fire Hazards' || incidentData.category === 'Medical Emergencies') {
      priority = 'CRITICAL';
    } else if (incidentData.category === 'Electrical Issues' || incidentData.category === 'Security Issues') {
      priority = 'HIGH';
    } else if (incidentData.category === 'Infrastructure Damage') {
      priority = 'LOW';
    }

    const newIncident: IncidentReport = {
      ...incidentData,
      id: newId,
      status: 'RECEIVED',
      priority,
      submittedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) + ' ' + new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    };

    setIncidents(prev => [newIncident, ...prev]);
    addNotification('Incident Report Logged', `Incident ticket ${newId} received at Base Station. Response team queued.`, 'incident', newId);

    return { success: true, incidentId: newId };
  }, []);

  // Update Incident Status
  const updateIncidentStatus = useCallback((id: string, status: IncidentStatus, assignedTo?: string, notes?: string) => {
    setIncidents(prev => prev.map(inc => {
      if (inc.id === id) {
        return {
          ...inc,
          status,
          assignedTo: assignedTo || inc.assignedTo,
          resolutionNotes: notes || inc.resolutionNotes,
          resolvedAt: status === 'RESOLVED' || status === 'CLOSED' ? new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : inc.resolvedAt
        };
      }
      return inc;
    }));

    addNotification('Incident Progress', `Incident ${id} updated to ${status}.`, 'incident', id);
  }, []);

  // Emergency SOS Actions
  const triggerEmergencySOS = useCallback((
    category: SOSCategory,
    description: string,
    coords: GPSCoords | null,
    location: string,
    user: string,
    phone: string
  ): EmergencyAlert => {
    const newId = `SOS-2026-${Math.floor(100 + Math.random() * 900)}`;
    const newAlert: EmergencyAlert = {
      id: newId,
      category,
      description: description || `Urgent ${category} triggered at ${location}`,
      gpsCoordinates: coords,
      buildingLocation: location,
      userIdentifier: user || 'Anonymous Campus Member',
      contactPhone: phone || '+91 94440 00000',
      timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      status: 'SOS SENT',
      isMeshRelay: true
    };

    setEmergencyAlerts(prev => [newAlert, ...prev]);
    addNotification('EMERGENCY SOS BROADCAST', `Immediate ${category} alert transmitted to Base Station (ID: ${newId}).`, 'sos', newId);

    // Simulated immediate backend server acknowledgement after 1.2 seconds
    setTimeout(() => {
      setEmergencyAlerts(prev => prev.map(a => {
        if (a.id === newId && a.status === 'SOS SENT') {
          return {
            ...a,
            status: 'RECEIVED BY BASE STATION',
            acknowledgedAt: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
          };
        }
        return a;
      }));
    }, 1200);

    return newAlert;
  }, []);

  const acknowledgeSOS = useCallback((id: string) => {
    setEmergencyAlerts(prev => prev.map(a => {
      if (a.id === id) {
        return {
          ...a,
          status: 'RECEIVED BY BASE STATION',
          acknowledgedAt: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
        };
      }
      return a;
    }));
    addNotification('SOS Acknowledged', `Base Station has acknowledged Emergency Alert ${id}.`, 'sos', id);
  }, []);

  const assignSOSTeam = useCallback((id: string, team: string) => {
    setEmergencyAlerts(prev => prev.map(a => {
      if (a.id === id) {
        return {
          ...a,
          status: 'RESPONSE TEAM ASSIGNED',
          responseTeamAssigned: team
        };
      }
      return a;
    }));
    addNotification('Response Team Assigned', `${team} assigned to SOS ${id}.`, 'sos', id);
  }, []);

  const dispatchSOSTeam = useCallback((id: string) => {
    setEmergencyAlerts(prev => prev.map(a => {
      if (a.id === id) {
        return {
          ...a,
          status: 'HELP IS ON THE WAY',
          dispatchedAt: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
        };
      }
      return a;
    }));
    addNotification('Response Dispatched', `Emergency Team is en route for SOS ${id}. Help is on the way!`, 'sos', id);
  }, []);

  const resolveSOS = useCallback((id: string) => {
    setEmergencyAlerts(prev => prev.map(a => {
      if (a.id === id) {
        return {
          ...a,
          status: 'EMERGENCY RESOLVED',
          resolvedAt: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
        };
      }
      return a;
    }));
    addNotification('Emergency Resolved', `SOS incident ${id} marked RESOLVED by Command Station.`, 'sos', id);
  }, []);

  // Active Emergency Count
  const activeEmergencyCount = useMemo(() => {
    return emergencyAlerts.filter(a => a.status !== 'EMERGENCY RESOLVED').length;
  }, [emergencyAlerts]);

  const latestActiveSOS = useMemo(() => {
    const active = emergencyAlerts.filter(a => a.status !== 'EMERGENCY RESOLVED');
    return active.length > 0 ? active[0] : null;
  }, [emergencyAlerts]);

  // Export CSV Reports
  const exportReportCSV = useCallback((type: 'bookings' | 'incidents' | 'sos' | 'monthly') => {
    let csvContent = '';
    let filename = '';

    if (type === 'bookings') {
      filename = `Easwari_Auditorium_Bookings_${new Date().toISOString().slice(0, 10)}.csv`;
      csvContent = 'Booking ID,Auditorium,Applicant Name,Reg No / Emp ID,Department,Event Name,Date,Start Time,End Time,Participants,Contact Phone,Status,Submitted At,Admin Remarks\n';
      bookings.forEach(b => {
        csvContent += `"${b.id}","${b.auditoriumName}","${b.applicantName}","${b.registerNumber}","${b.department}","${b.eventName}","${b.bookingDate}","${b.startTime}","${b.endTime}","${b.participantsCount}","${b.contactNumber}","${b.status}","${b.submittedAt}","${b.adminRemarks || ''}"\n`;
      });
    } else if (type === 'incidents') {
      filename = `Easwari_Campus_Incidents_${new Date().toISOString().slice(0, 10)}.csv`;
      csvContent = 'Incident ID,Category,Title,Location,Floor/Room,Priority,Status,Submitted At,Assigned To,Reporter Phone,Resolution Notes\n';
      incidents.forEach(inc => {
        csvContent += `"${inc.id}","${inc.category}","${inc.title}","${inc.campusLocation}","${inc.floorRoom}","${inc.priority}","${inc.status}","${inc.submittedAt}","${inc.assignedTo || 'Unassigned'}","${inc.isAnonymous ? 'Anonymous' : inc.contactInfo}","${inc.resolutionNotes || ''}"\n`;
      });
    } else if (type === 'sos') {
      filename = `Easwari_Emergency_SOS_Log_${new Date().toISOString().slice(0, 10)}.csv`;
      csvContent = 'Alert ID,Category,Building Location,Coordinates,Caller Identity,Phone,Status,Timestamp,Acknowledged At,Assigned Team,Dispatched At,Resolved At\n';
      emergencyAlerts.forEach(sos => {
        const coordsStr = sos.gpsCoordinates ? `${sos.gpsCoordinates.latitude.toFixed(5)}, ${sos.gpsCoordinates.longitude.toFixed(5)}` : 'Location Not Available';
        csvContent += `"${sos.id}","${sos.category}","${sos.buildingLocation}","${coordsStr}","${sos.userIdentifier}","${sos.contactPhone}","${sos.status}","${sos.timestamp}","${sos.acknowledgedAt || ''}","${sos.responseTeamAssigned || ''}","${sos.dispatchedAt || ''}","${sos.resolvedAt || ''}"\n`;
      });
    } else if (type === 'monthly') {
      filename = `Easwari_Monthly_Operations_Summary_${new Date().toISOString().slice(0, 7)}.csv`;
      csvContent = 'SRM Easwari Engineering College — Campus Operations Monthly Summary Report\n';
      csvContent += `Report Generated,${new Date().toLocaleString()}\n\n`;
      csvContent += `Metric,Value\n`;
      csvContent += `Total Auditorium Reservations,${bookings.length}\n`;
      csvContent += `Approved Reservations,${bookings.filter(b => b.status === 'APPROVED').length}\n`;
      csvContent += `Pending Reservations,${bookings.filter(b => b.status === 'PENDING').length}\n`;
      csvContent += `Total Campus Incidents,${incidents.length}\n`;
      csvContent += `Resolved Incidents,${incidents.filter(i => i.status === 'RESOLVED' || i.status === 'CLOSED').length}\n`;
      csvContent += `Total Emergency SOS Triggers,${emergencyAlerts.length}\n`;
      csvContent += `Active Unresolved SOS,${emergencyAlerts.filter(s => s.status !== 'EMERGENCY RESOLVED').length}\n`;
    }

    // Trigger browser download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [bookings, incidents, emergencyAlerts]);

  return (
    <PortalContext.Provider
      value={{
        userRole,
        setUserRole,
        studentView,
        setStudentView,
        adminView,
        setAdminView,
        isAdminAuthenticated,
        loginAdmin,
        logoutAdmin,
        auditoriums,
        bookings,
        incidents,
        emergencyAlerts,
        notifications,
        dismissNotification,
        checkBookingConflict,
        submitBooking,
        updateBookingStatus,
        submitIncident,
        updateIncidentStatus,
        triggerEmergencySOS,
        acknowledgeSOS,
        assignSOSTeam,
        dispatchSOSTeam,
        resolveSOS,
        activeEmergencyCount,
        latestActiveSOS,
        exportReportCSV
      }}
    >
      {children}
    </PortalContext.Provider>
  );
};

export const usePortal = () => {
  const context = useContext(PortalContext);
  if (!context) {
    throw new Error('usePortal must be used within a PortalProvider');
  }
  return context;
};
