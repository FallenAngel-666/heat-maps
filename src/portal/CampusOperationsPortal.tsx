import React from 'react';
import { usePortal } from './PortalContext';
import { PortalNavbar } from './components/PortalNavbar';
import { StudentHome } from './components/student/StudentHome';
import { AuditoriumBookingView } from './components/student/AuditoriumBookingView';
import { IncidentReportView } from './components/student/IncidentReportView';
import { EmergencySOSView } from './components/student/EmergencySOSView';
import { MyRequestsView } from './components/student/MyRequestsView';
import { AdminBaseStation } from './components/admin/AdminBaseStation';

interface CampusOperationsPortalProps {
  onToggle3DView?: () => void;
}

export const CampusOperationsPortal: React.FC<CampusOperationsPortalProps> = ({ onToggle3DView }) => {
  const { userRole, studentView } = usePortal();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800 antialiased">
      {/* Top Navigation & Role Bar */}
      <PortalNavbar onToggle3D={onToggle3DView} />

      {/* Main Body */}
      <main className="flex-1 pb-16">
        {userRole === 'admin' ? (
          <AdminBaseStation />
        ) : (
          <>
            {studentView === 'home' && <StudentHome />}
            {studentView === 'auditorium-booking' && <AuditoriumBookingView />}
            {studentView === 'report-incident' && <IncidentReportView />}
            {studentView === 'emergency-sos' && <EmergencySOSView />}
            {studentView === 'my-requests' && <MyRequestsView />}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 px-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800">SRM Easwari Engineering College</span>
            <span>•</span>
            <span>Ramapuram Campus, Chennai - 600089</span>
          </div>
          <div className="text-slate-400">
            Autonomous Institution • Affiliated to Anna University • Approved by AICTE
          </div>
        </div>
      </footer>
    </div>
  );
};
