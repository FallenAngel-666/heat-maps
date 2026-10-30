import React from 'react';
import { 
  Calendar, 
  AlertTriangle, 
  LifeBuoy, 
  FileText, 
  ArrowRight, 
  Clock, 
  ShieldCheck, 
  PhoneCall, 
  MapPin,
  CheckCircle2,
  Users
} from 'lucide-react';
import { usePortal } from '../../PortalContext';

export const StudentHome: React.FC = () => {
  const { setStudentView, activeEmergencyCount, bookings, incidents } = usePortal();

  const pendingBookingsCount = bookings.filter(b => b.status === 'PENDING').length;
  const activeIncidentsCount = incidents.filter(i => i.status !== 'RESOLVED' && i.status !== 'CLOSED').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8 select-none">
      
      {/* 1. Welcoming Hero Banner with Official College Mission */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-3xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden">
        {/* Subtle background graphics */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 pointer-events-none">
          <svg className="w-full h-full" viewBox="0 0 200 200" fill="currentColor">
            <path d="M40 0h120c22.1 0 40 17.9 40 40v120c0 22.1-17.9 40-40 40H40c-22.1 0-40-17.9-40-40V40C0 17.9 17.9 0 40 0z"/>
          </svg>
        </div>

        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-semibold">
            <ShieldCheck className="w-4 h-4 text-blue-400" />
            <span>Official SRM Easwari Campus Operations Platform</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
            How can we assist you today?
          </h2>

          <p className="text-sm sm:text-base text-blue-100/90 leading-relaxed">
            Reserve auditoriums for campus events, report facilities issues, broadcast immediate emergency SOS alerts, or track your submitted requests.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-blue-200">
            <div className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-blue-400" />
              <span>Bharathi Salai, Ramapuram, Chennai</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-emerald-400" />
              <span>Base Station 24/7 Monitoring</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. THE 4 PRIMARY SERVICE CARDS (Clean, Uncluttered, 5-Second Comprehension) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">

        {/* CARD 1: Auditorium Booking */}
        <div 
          onClick={() => setStudentView('auditorium-booking')}
          className="bg-white rounded-2xl p-6 border border-slate-200/90 hover:border-blue-500 hover:shadow-xl transition-all duration-200 cursor-pointer group flex flex-col justify-between"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 group-hover:scale-105 group-hover:bg-blue-600 group-hover:text-white transition-all">
                <Calendar className="w-7 h-7" />
              </div>
              <span className="text-xs font-mono font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
                4 Auditoriums
              </span>
            </div>

            <div>
              <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                Auditorium Booking
              </h3>
              <p className="text-sm text-slate-500 mt-1.5 leading-relaxed">
                Reserve campus convention halls, seminar venues, and smart conference rooms. Check real-time date availability and prevent scheduling conflicts.
              </p>
            </div>

            <div className="pt-2 flex flex-wrap gap-2 text-xs">
              <span className="px-2.5 py-1 rounded-lg bg-slate-50 text-slate-600 border border-slate-200 font-medium">
                🏛️ Paarivendhar (800 seats)
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-slate-50 text-slate-600 border border-slate-200 font-medium">
                ⚙️ Mech Seminar (250 seats)
              </span>
            </div>
          </div>

          <div className="pt-6 flex items-center justify-between text-sm font-bold text-blue-600">
            <span>Book a Venue</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
          </div>
        </div>

        {/* CARD 2: Report an Incident */}
        <div 
          onClick={() => setStudentView('report-incident')}
          className="bg-white rounded-2xl p-6 border border-slate-200/90 hover:border-amber-500 hover:shadow-xl transition-all duration-200 cursor-pointer group flex flex-col justify-between"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 group-hover:scale-105 group-hover:bg-amber-600 group-hover:text-white transition-all">
                <AlertTriangle className="w-7 h-7" />
              </div>
              <span className="text-xs font-mono font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
                24/7 Dispatch
              </span>
            </div>

            <div>
              <h3 className="text-xl font-bold text-slate-900 group-hover:text-amber-600 transition-colors">
                Report an Incident
              </h3>
              <p className="text-sm text-slate-500 mt-1.5 leading-relaxed">
                Report electrical faults, plumbing leaks, structural damage, classroom IT malfunctions, or safety concerns across any Easwari building.
              </p>
            </div>

            <div className="pt-2 flex flex-wrap gap-2 text-xs">
              <span className="px-2.5 py-1 rounded-lg bg-slate-50 text-slate-600 border border-slate-200 font-medium">
                ⚡ Electrical
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-slate-50 text-slate-600 border border-slate-200 font-medium">
                💧 Plumbing
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-slate-50 text-slate-600 border border-slate-200 font-medium">
                🛡️ Safety / Anonymous
              </span>
            </div>
          </div>

          <div className="pt-6 flex items-center justify-between text-sm font-bold text-amber-600">
            <span>Submit Maintenance Ticket</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
          </div>
        </div>

        {/* CARD 3: Emergency SOS (Prominent Red High-Priority Card) */}
        <div 
          onClick={() => setStudentView('emergency-sos')}
          className="bg-gradient-to-br from-red-50 to-rose-100/70 rounded-2xl p-6 border-2 border-red-400 hover:border-red-600 hover:shadow-2xl hover:shadow-red-500/20 transition-all duration-200 cursor-pointer group flex flex-col justify-between"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-14 h-14 rounded-2xl bg-red-600 flex items-center justify-center text-white shadow-lg shadow-red-600/30 group-hover:scale-110 transition-transform">
                <LifeBuoy className="w-8 h-8 animate-pulse" />
              </div>
              <span className="text-xs font-mono font-extrabold text-red-700 bg-red-100 border border-red-300 px-3 py-1 rounded-full uppercase tracking-wider">
                Immediate Response
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-2xl font-extrabold text-red-950">
                  Emergency SOS
                </h3>
                <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-ping"></span>
              </div>
              <p className="text-sm text-red-900/90 mt-1.5 leading-relaxed font-medium">
                Direct distress signal to the campus base station. Instantly transmits your live GPS coordinates for medical, security, fire, or acute safety emergencies.
              </p>
            </div>

            <div className="pt-2 flex flex-wrap gap-2 text-xs">
              <span className="px-2.5 py-1 rounded-lg bg-white text-red-700 font-bold border border-red-200 shadow-2xs">
                🚑 Medical First-Aid
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-white text-red-700 font-bold border border-red-200 shadow-2xs">
                👮 Security Quick Reaction
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-white text-red-700 font-bold border border-red-200 shadow-2xs">
                📍 Auto GPS Capture
              </span>
            </div>
          </div>

          <div className="pt-6 flex items-center justify-between text-base font-extrabold text-red-700">
            <span>TRIGGER EMERGENCY DISTRESS</span>
            <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
          </div>
        </div>

        {/* CARD 4: My Requests */}
        <div 
          onClick={() => setStudentView('my-requests')}
          className="bg-white rounded-2xl p-6 border border-slate-200/90 hover:border-indigo-500 hover:shadow-xl transition-all duration-200 cursor-pointer group flex flex-col justify-between"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 group-hover:scale-105 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                <FileText className="w-7 h-7" />
              </div>
              <span className="text-xs font-mono font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
                Track Progress
              </span>
            </div>

            <div>
              <h3 className="text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                My Requests & History
              </h3>
              <p className="text-sm text-slate-500 mt-1.5 leading-relaxed">
                Check the approval status of your auditorium bookings, view maintenance updates on reported incidents, and inspect past SOS transmissions.
              </p>
            </div>

            <div className="pt-2 flex items-center gap-3 text-xs">
              <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg">
                <span className="font-semibold text-slate-700">Bookings:</span>
                <span className="font-bold text-blue-600 font-mono">{bookings.length}</span>
              </div>
              <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg">
                <span className="font-semibold text-slate-700">Incidents:</span>
                <span className="font-bold text-amber-600 font-mono">{incidents.length}</span>
              </div>
            </div>
          </div>

          <div className="pt-6 flex items-center justify-between text-sm font-bold text-indigo-600">
            <span>View All My Submissions</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
          </div>
        </div>

      </div>

      {/* 3. Official Emergency Contacts & Base Station Telemetry Footer Bar */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
            <PhoneCall className="w-4 h-4 text-slate-600" />
          </div>
          <div>
            <span className="font-bold text-slate-900 block">Emergency Base Station Helplines</span>
            <span className="text-slate-500">Security Control: 044-4392 3041 • Clinic: +91 94443 21908</span>
          </div>
        </div>

        <div className="flex items-center gap-4 text-slate-600">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span className="font-medium">Base Station Status: Online</span>
          </div>
          <div className="h-3 w-px bg-slate-200"></div>
          <div>
            <span className="text-slate-400">Response Unit: </span>
            <span className="font-semibold text-slate-800">Quick-Reaction Squad On Duty</span>
          </div>
        </div>
      </div>

    </div>
  );
};
