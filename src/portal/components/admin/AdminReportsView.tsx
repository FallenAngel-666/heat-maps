import React from 'react';
import { usePortal } from '../../PortalContext';

export const AdminReportsView: React.FC = () => {
  const { exportReportCSV, bookings, incidents, emergencyAlerts } = usePortal();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="pb-4 border-b border-slate-200">
        <h2 className="text-xl font-bold text-slate-900">Institutional Records & Export Reports</h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Generate, preview, and download compliance-grade CSV reports for campus administration and audit logs.
        </p>
      </div>

      {/* 4 Report Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Report 1: Auditorium Bookings */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:border-blue-400 transition space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-2xl">
              🏛️
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Auditorium Bookings Report</h3>
              <p className="text-xs text-slate-500">Includes all reservation requests, applicant details, approvals & rejections.</p>
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-600 space-y-1">
            <div className="flex justify-between">
              <span>Total Logged Records:</span>
              <span className="font-bold text-slate-900">{bookings.length} entries</span>
            </div>
            <div className="flex justify-between">
              <span>Approved Events:</span>
              <span className="font-semibold text-emerald-700">{bookings.filter(b => b.status === 'APPROVED').length}</span>
            </div>
            <div className="flex justify-between">
              <span>Format:</span>
              <span className="font-mono text-slate-500">CSV (.csv)</span>
            </div>
          </div>

          <button
            onClick={() => exportReportCSV('bookings')}
            className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-xs"
          >
            <span>⬇ Download Auditorium Bookings CSV</span>
          </button>
        </div>

        {/* Report 2: Campus Incidents */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:border-amber-400 transition space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center text-2xl">
              🛠️
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Campus Incident & Hazard Report</h3>
              <p className="text-xs text-slate-500">Complete maintenance tickets, priority levels, technician assignments, and resolutions.</p>
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-600 space-y-1">
            <div className="flex justify-between">
              <span>Total Reported Incidents:</span>
              <span className="font-bold text-slate-900">{incidents.length} tickets</span>
            </div>
            <div className="flex justify-between">
              <span>Resolved Issues:</span>
              <span className="font-semibold text-emerald-700">{incidents.filter(i => i.status === 'RESOLVED' || i.status === 'CLOSED').length}</span>
            </div>
            <div className="flex justify-between">
              <span>Format:</span>
              <span className="font-mono text-slate-500">CSV (.csv)</span>
            </div>
          </div>

          <button
            onClick={() => exportReportCSV('incidents')}
            className="w-full py-2.5 px-4 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-xs"
          >
            <span>⬇ Download Incidents & Maintenance CSV</span>
          </button>
        </div>

        {/* Report 3: Emergency SOS Log */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:border-rose-400 transition space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center text-2xl">
              🚨
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Emergency SOS Dispatch Log</h3>
              <p className="text-xs text-slate-500">Audit trail of distress beacons, caller GPS coordinates, dispatch timing, and resolutions.</p>
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-600 space-y-1">
            <div className="flex justify-between">
              <span>Total SOS Transmissions:</span>
              <span className="font-bold text-slate-900">{emergencyAlerts.length} beacons</span>
            </div>
            <div className="flex justify-between">
              <span>Avg Response Time:</span>
              <span className="font-semibold text-emerald-700">&lt; 3.5 minutes</span>
            </div>
            <div className="flex justify-between">
              <span>Format:</span>
              <span className="font-mono text-slate-500">CSV (.csv)</span>
            </div>
          </div>

          <button
            onClick={() => exportReportCSV('sos')}
            className="w-full py-2.5 px-4 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-xs"
          >
            <span>⬇ Download Emergency SOS Dispatch Log CSV</span>
          </button>
        </div>

        {/* Report 4: Monthly Campus Operations Summary */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:border-indigo-400 transition space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-2xl">
              📊
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Monthly Campus Operations Summary</h3>
              <p className="text-xs text-slate-500">High-level executive metrics for facility uptime, emergency response, and building health.</p>
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-600 space-y-1">
            <div className="flex justify-between">
              <span>Reporting Period:</span>
              <span className="font-bold text-slate-900">Current Academic Term</span>
            </div>
            <div className="flex justify-between">
              <span>Campus Facility Reliability:</span>
              <span className="font-semibold text-emerald-700">99.4%</span>
            </div>
            <div className="flex justify-between">
              <span>Format:</span>
              <span className="font-mono text-slate-500">CSV (.csv)</span>
            </div>
          </div>

          <button
            onClick={() => exportReportCSV('monthly')}
            className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-xs"
          >
            <span>⬇ Download Monthly Summary CSV</span>
          </button>
        </div>
      </div>
    </div>
  );
};
