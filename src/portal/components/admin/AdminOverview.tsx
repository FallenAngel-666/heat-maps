import React, { useState } from 'react';
import { usePortal } from '../../PortalContext';

export const AdminOverview: React.FC = () => {
  const { 
    bookings, 
    incidents, 
    emergencyAlerts, 
    setAdminView,
    activeEmergencyCount,
    updateBookingStatus
  } = usePortal();

  // Metrics
  const pendingBookings = bookings.filter(b => b.status === 'PENDING');
  const approvedBookings = bookings.filter(b => b.status === 'APPROVED');
  const openIncidents = incidents.filter(i => i.status !== 'RESOLVED' && i.status !== 'CLOSED');
  const resolvedIncidents = incidents.filter(i => i.status === 'RESOLVED' || i.status === 'CLOSED');

  return (
    <div className="space-y-6">
      {/* Active Emergency Banner if any */}
      {activeEmergencyCount > 0 && (
        <div className="bg-gradient-to-r from-red-600 to-rose-700 text-white rounded-2xl p-5 shadow-lg shadow-red-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-pulse">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🚨</span>
            <div>
              <div className="text-xs font-mono font-extrabold tracking-widest uppercase text-red-200">
                CRITICAL ALERT PRIORITY
              </div>
              <h3 className="text-lg font-bold">
                {activeEmergencyCount} Active Campus SOS Alert{activeEmergencyCount > 1 ? 's' : ''} Requiring Dispatch
              </h3>
            </div>
          </div>
          <button
            onClick={() => setAdminView('emergency-sos')}
            className="px-5 py-2.5 bg-white text-red-700 font-bold rounded-xl text-xs hover:bg-red-50 shadow-md transition"
          >
            Open Live SOS Board →
          </button>
        </div>
      )}

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {/* Card 1 */}
        <div 
          onClick={() => setAdminView('bookings')}
          className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-amber-400 hover:shadow-md transition cursor-pointer"
        >
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-2">
            <span>Pending Bookings</span>
            <span className="text-amber-500">⏳</span>
          </div>
          <div className="text-3xl font-extrabold text-slate-900">{pendingBookings.length}</div>
          <div className="text-[11px] text-amber-600 font-medium mt-1">Requires approval</div>
        </div>

        {/* Card 2 */}
        <div 
          onClick={() => setAdminView('bookings')}
          className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-emerald-400 hover:shadow-md transition cursor-pointer"
        >
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-2">
            <span>Approved Bookings</span>
            <span className="text-emerald-500">✓</span>
          </div>
          <div className="text-3xl font-extrabold text-slate-900">{approvedBookings.length}</div>
          <div className="text-[11px] text-emerald-600 font-medium mt-1">Confirmed slots</div>
        </div>

        {/* Card 3 */}
        <div 
          onClick={() => setAdminView('incidents')}
          className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-blue-400 hover:shadow-md transition cursor-pointer"
        >
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-2">
            <span>Open Incidents</span>
            <span className="text-blue-500">🛠️</span>
          </div>
          <div className="text-3xl font-extrabold text-slate-900">{openIncidents.length}</div>
          <div className="text-[11px] text-blue-600 font-medium mt-1">Active repair tickets</div>
        </div>

        {/* Card 4 */}
        <div 
          onClick={() => setAdminView('emergency-sos')}
          className={`p-5 rounded-2xl border transition cursor-pointer ${
            activeEmergencyCount > 0 
              ? 'bg-rose-50 border-rose-400 text-rose-900' 
              : 'bg-white border-slate-200 hover:border-rose-400'
          }`}
        >
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-2">
            <span>Active SOS Alerts</span>
            <span className="text-rose-500">🚨</span>
          </div>
          <div className="text-3xl font-extrabold text-rose-600">{activeEmergencyCount}</div>
          <div className="text-[11px] text-rose-600 font-medium mt-1">
            {activeEmergencyCount > 0 ? 'Urgent attention' : 'All quiet'}
          </div>
        </div>

        {/* Card 5 */}
        <div 
          onClick={() => setAdminView('incidents')}
          className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-slate-300 hover:shadow-md transition cursor-pointer"
        >
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-2">
            <span>Resolved Incidents</span>
            <span className="text-emerald-500">🏁</span>
          </div>
          <div className="text-3xl font-extrabold text-slate-900">{resolvedIncidents.length}</div>
          <div className="text-[11px] text-slate-500 font-medium mt-1">Completed tickets</div>
        </div>
      </div>

      {/* Two Columns: Action Queue & System Status */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Pending Bookings Quick Queue (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Pending Auditorium Approvals</h3>
              <p className="text-xs text-slate-500">Review pending reservation requests submitted by faculty and student leads</p>
            </div>
            <button
              onClick={() => setAdminView('bookings')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-800"
            >
              View All ({pendingBookings.length}) →
            </button>
          </div>

          {pendingBookings.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-xs">
              All auditorium reservation requests have been processed.
            </div>
          ) : (
            <div className="space-y-3">
              {pendingBookings.slice(0, 3).map(b => (
                <div key={b.id} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[11px] font-bold text-slate-600 bg-white px-2 py-0.5 rounded border border-slate-200">{b.id}</span>
                      <span className="font-bold text-slate-900 text-sm">{b.eventName}</span>
                    </div>
                    <div className="text-xs text-slate-500 mt-1">
                      <span>{b.auditoriumName}</span> • <span>{b.bookingDate} ({b.startTime} - {b.endTime})</span>
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      By {b.applicantName} ({b.department})
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateBookingStatus(b.id, 'APPROVED', 'Approved by Base Station Director')}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-lg transition"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => updateBookingStatus(b.id, 'REJECTED', 'Schedule conflict / Maintenance window')}
                      className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-semibold text-xs rounded-lg border border-rose-200 transition"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Base Station Status & Operational Telemetry (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3">
            <h3 className="font-bold text-slate-900 text-sm pb-2 border-b border-slate-100 flex items-center justify-between">
              <span>Campus Station Telemetry</span>
              <span className="flex items-center gap-1.5 text-xs text-emerald-600 font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                ONLINE
              </span>
            </h3>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg">
                <span className="text-slate-500">Emergency RF Mesh Relay:</span>
                <span className="font-bold text-emerald-700">12 / 12 Nodes Active</span>
              </div>
              <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg">
                <span className="text-slate-500">Security Patrol On Duty:</span>
                <span className="font-bold text-slate-800">Squad Alpha (Gate 1 & Mech)</span>
              </div>
              <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg">
                <span className="text-slate-500">Facility Maintenance Unit:</span>
                <span className="font-bold text-slate-800">On Call (Ext 3042)</span>
              </div>
              <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg">
                <span className="text-slate-500">Campus Clinic First Aid:</span>
                <span className="font-bold text-emerald-700">Doctor on Duty</span>
              </div>
            </div>
          </div>

          {/* Quick Reports Export shortcut */}
          <div className="bg-blue-50/70 rounded-2xl border border-blue-200 p-5 space-y-2">
            <div className="font-bold text-blue-950 text-sm">Download Operations Records</div>
            <p className="text-xs text-blue-800/80">
              Export verified CSV datasets of bookings, safety tickets, and emergency logs.
            </p>
            <button
              onClick={() => setAdminView('reports')}
              className="mt-2 w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-xs transition"
            >
              Open Reports Generator →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
