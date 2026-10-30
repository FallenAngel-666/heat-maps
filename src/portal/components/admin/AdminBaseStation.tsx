import React, { useState } from 'react';
import { usePortal } from '../../PortalContext';
import { AdminOverview } from './AdminOverview';
import { AdminBookingsView } from './AdminBookingsView';
import { AdminIncidentsView } from './AdminIncidentsView';
import { AdminLiveSOSView } from './AdminLiveSOSView';
import { AdminReportsView } from './AdminReportsView';

export const AdminBaseStation: React.FC = () => {
  const { 
    isAdminAuthenticated, 
    loginAdmin, 
    logoutAdmin, 
    adminView, 
    setAdminView,
    activeEmergencyCount,
    setUserRole,
    setStudentView
  } = usePortal();

  const [email, setEmail] = useState('admin@srmeaswari.ac.in');
  const [password, setPassword] = useState('admin123');
  const [loginError, setLoginError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const success = loginAdmin(password);
    if (!success) {
      setLoginError('Invalid administrator credentials. Try "admin123" or click Quick Access.');
    } else {
      setLoginError('');
    }
  };

  const handleQuickDemoLogin = () => {
    loginAdmin('admin123');
  };

  // 1. If not authenticated, render secure login card
  if (!isAdminAuthenticated) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full bg-white rounded-3xl border border-slate-200 shadow-xl p-8 space-y-6">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 bg-slate-900 text-white rounded-2xl flex items-center justify-center mx-auto text-2xl font-bold shadow-md">
              🏢
            </div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Base Station Terminal</h2>
            <p className="text-xs text-slate-500">
              Campus Operations & Incident Command Center<br />
              <strong className="text-slate-700">SRM Easwari Engineering College</strong>
            </p>
          </div>

          {loginError && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-medium text-center">
              {loginError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Admin Email / Officer ID
              </label>
              <input
                type="text"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Security Passcode
              </label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs shadow-md transition"
            >
              Sign In to Command Terminal →
            </button>
          </form>

          {/* Quick Access Demo Button */}
          <div className="pt-2 border-t border-slate-100 text-center space-y-3">
            <button
              type="button"
              onClick={handleQuickDemoLogin}
              className="w-full py-2.5 px-4 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold rounded-xl text-xs border border-blue-200 transition"
            >
              ⚡ 1-Click Administrator Demo Access
            </button>

            <button
              type="button"
              onClick={() => {
                setUserRole('student_staff');
                setStudentView('home');
              }}
              className="text-xs text-slate-500 hover:text-slate-800 underline block mx-auto"
            >
              Return to Student / Staff Portal
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 2. Authenticated Admin Base Station Dashboard
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Top Base Station Command Subheader */}
      <div className="bg-slate-900 text-white rounded-2xl p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center font-bold text-lg">
            🏢
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-sm tracking-wide">CAMPUS OPERATIONS BASE STATION</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500 text-slate-950 uppercase">
                SECURE ACCESS
              </span>
            </div>
            <div className="text-xs text-slate-400">
              Logged in as <span className="text-slate-200 font-medium">{email}</span> (Facility & Safety Command)
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <button
            onClick={() => {
              setUserRole('student_staff');
              setStudentView('home');
            }}
            className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium rounded-xl border border-slate-700 transition"
          >
            ← View Student Portal
          </button>
          <button
            onClick={logoutAdmin}
            className="px-3.5 py-1.5 bg-rose-950/60 hover:bg-rose-900 text-rose-300 font-semibold rounded-xl border border-rose-800/40 transition"
          >
            Sign Out
          </button>
        </div>
      </div>

      {/* Navigation Tabs Bar */}
      <div className="flex items-center gap-1 sm:gap-2 p-1.5 bg-white border border-slate-200 rounded-2xl shadow-sm overflow-x-auto">
        {[
          { id: 'overview', label: 'Overview', icon: '📊' },
          { id: 'bookings', label: 'Auditorium Bookings', icon: '🏛️' },
          { id: 'incidents', label: 'Incident Management', icon: '🛠️' },
          { 
            id: 'emergency-sos', 
            label: 'LIVE SOS MONITORING', 
            icon: '🚨',
            badge: activeEmergencyCount > 0 ? activeEmergencyCount : undefined 
          },
          { id: 'reports', label: 'Records & Reports', icon: '📁' }
        ].map(tab => {
          const isActive = adminView === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setAdminView(tab.id as any)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap ${
                isActive
                  ? tab.id === 'emergency-sos'
                    ? 'bg-rose-600 text-white shadow-md'
                    : 'bg-slate-900 text-white shadow-md'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
              {tab.badge !== undefined && (
                <span className="w-5 h-5 rounded-full bg-white text-rose-600 text-[10px] font-black flex items-center justify-center animate-pulse">
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Main Admin Section View Area */}
      <div className="mt-4">
        {adminView === 'overview' && <AdminOverview />}
        {adminView === 'bookings' && <AdminBookingsView />}
        {adminView === 'incidents' && <AdminIncidentsView />}
        {adminView === 'emergency-sos' && <AdminLiveSOSView />}
        {adminView === 'reports' && <AdminReportsView />}
      </div>
    </div>
  );
};
