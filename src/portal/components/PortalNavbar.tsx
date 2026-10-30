import React from 'react';
import { 
  ShieldAlert, 
  Layers, 
  User, 
  Lock, 
  Calendar, 
  AlertTriangle, 
  PhoneCall, 
  Clock, 
  CheckCircle,
  Home,
  FileText,
  LifeBuoy,
  Box
} from 'lucide-react';
import { usePortal } from '../PortalContext';

interface PortalNavbarProps {
  onToggle3D?: () => void;
  show3DButton?: boolean;
}

export const PortalNavbar: React.FC<PortalNavbarProps> = ({ onToggle3D, show3DButton = true }) => {
  const { 
    userRole, 
    setUserRole, 
    studentView, 
    setStudentView, 
    activeEmergencyCount,
    isAdminAuthenticated,
    latestActiveSOS
  } = usePortal();

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 select-none shadow-2xs">
      {/* 1. Active SOS Emergency Notification Banner (Global Priority) */}
      {activeEmergencyCount > 0 && latestActiveSOS && (
        <div className="bg-red-600 text-white px-4 py-2 text-xs font-semibold flex items-center justify-between animate-pulse">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-white animate-ping"></span>
            <span className="font-bold tracking-wide">
              LIVE EMERGENCY ALERT: {latestActiveSOS.id} ({latestActiveSOS.category.toUpperCase()})
            </span>
            <span className="hidden sm:inline">•</span>
            <span className="hidden sm:inline font-normal">{latestActiveSOS.buildingLocation}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-mono bg-red-700 px-2 py-0.5 rounded text-[11px]">
              Status: {latestActiveSOS.status}
            </span>
            {userRole === 'admin' ? (
              <span className="underline font-bold cursor-pointer">Open Base Station</span>
            ) : (
              <button 
                onClick={() => setStudentView('emergency-sos')} 
                className="bg-white text-red-700 px-2.5 py-0.5 rounded text-[11px] font-bold hover:bg-red-50"
              >
                Track Status
              </button>
            )}
          </div>
        </div>
      )}

      {/* 2. Main Header Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        
        {/* Brand & Identity */}
        <div 
          onClick={() => {
            if (userRole === 'student_staff') setStudentView('home');
          }}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-700 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-600/20 group-hover:scale-105 transition-transform">
            <span className="font-bold text-lg tracking-tighter">EEC</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight leading-none">
                SRM Easwari Engineering College
              </h1>
              <span className="hidden md:inline-block text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                Ramapuram
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-1">
              Campus Operations & Emergency Response Portal
            </p>
          </div>
        </div>

        {/* Navigation Pills (Student Portal Only) */}
        {userRole === 'student_staff' && (
          <nav className="hidden lg:flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200/80">
            <button
              onClick={() => setStudentView('home')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                studentView === 'home'
                  ? 'bg-white text-blue-700 shadow-2xs font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <Home className="w-3.5 h-3.5" />
              <span>Portal Home</span>
            </button>

            <button
              onClick={() => setStudentView('auditorium-booking')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                studentView === 'auditorium-booking'
                  ? 'bg-white text-blue-700 shadow-2xs font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Auditoriums</span>
            </button>

            <button
              onClick={() => setStudentView('report-incident')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                studentView === 'report-incident'
                  ? 'bg-white text-blue-700 shadow-2xs font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
              <span>Report Incident</span>
            </button>

            <button
              onClick={() => setStudentView('emergency-sos')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                studentView === 'emergency-sos'
                  ? 'bg-red-600 text-white shadow-2xs'
                  : 'text-red-600 hover:bg-red-50'
              }`}
            >
              <LifeBuoy className="w-3.5 h-3.5 animate-pulse" />
              <span>Emergency SOS</span>
            </button>

            <button
              onClick={() => setStudentView('my-requests')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                studentView === 'my-requests'
                  ? 'bg-white text-blue-700 shadow-2xs font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>My Requests</span>
            </button>
          </nav>
        )}

        {/* Right Controls: Role Switcher & 3D Bridge */}
        <div className="flex items-center gap-2">
          {/* Optional 3D Digital Twin Switcher */}
          {show3DButton && onToggle3D && (
            <button
              onClick={onToggle3D}
              title="Switch to Interactive 3D Digital Twin Model"
              className="hidden sm:flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-xl text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-colors"
            >
              <Box className="w-3.5 h-3.5 text-blue-600" />
              <span>3D Twin View</span>
            </button>
          )}

          {/* Role Switcher: Student vs Admin Base Station */}
          {userRole === 'student_staff' ? (
            <button
              onClick={() => setUserRole('admin')}
              className="flex items-center gap-1.5 text-xs font-bold px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white shadow-xs transition-all active:scale-95"
            >
              <Lock className="w-3.5 h-3.5 text-amber-400" />
              <span>Base Station Login</span>
            </button>
          ) : (
            <button
              onClick={() => setUserRole('student_staff')}
              className="flex items-center gap-1.5 text-xs font-bold px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition-all active:scale-95"
            >
              <User className="w-3.5 h-3.5" />
              <span>Student / Staff Portal</span>
            </button>
          )}
        </div>

      </div>
    </header>
  );
};
