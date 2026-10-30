import React, { useState } from 'react';
import { usePortal } from '../../PortalContext';
import { BookingStatus, IncidentStatus, SOSStatus } from '../../types';

export const MyRequestsView: React.FC = () => {
  const { bookings, incidents, emergencyAlerts, setStudentView } = usePortal();
  const [activeTab, setActiveTab] = useState<'bookings' | 'incidents' | 'sos'>('bookings');
  const [searchTerm, setSearchTerm] = useState('');

  // Status Badge Helpers
  const getBookingBadge = (status: BookingStatus) => {
    switch (status) {
      case 'APPROVED':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">APPROVED</span>;
      case 'REJECTED':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-800">REJECTED</span>;
      case 'CANCELLED':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-800">CANCELLED</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800">PENDING APPROVAL</span>;
    }
  };

  const getIncidentBadge = (status: IncidentStatus) => {
    switch (status) {
      case 'RESOLVED':
      case 'CLOSED':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">{status}</span>;
      case 'IN PROGRESS':
      case 'ASSIGNED':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800">{status}</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800">{status}</span>;
    }
  };

  const getSOSBadge = (status: SOSStatus) => {
    switch (status) {
      case 'EMERGENCY RESOLVED':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">RESOLVED</span>;
      case 'HELP IS ON THE WAY':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-100 text-indigo-800 animate-pulse">HELP EN ROUTE</span>;
      case 'RESPONSE TEAM ASSIGNED':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800">TEAM ASSIGNED</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-800">ACTIVE ALERT</span>;
    }
  };

  // Filtered lists
  const filteredBookings = bookings.filter(b => 
    b.eventName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.auditoriumName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredIncidents = incidents.filter(i => 
    i.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    i.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    i.campusLocation.toLowerCase().includes(searchTerm.toLowerCase()) ||
    i.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredSOS = emergencyAlerts.filter(s => 
    s.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.buildingLocation.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Top Header */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-200">
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <button 
            onClick={() => setStudentView('home')}
            className="hover:text-blue-600 transition flex items-center gap-1 font-medium"
          >
            ← Back to Home
          </button>
          <span>/</span>
          <span className="text-slate-900 font-semibold">My Requests & Incident Tracking</span>
        </div>
        <div className="text-xs text-slate-500 font-medium">
          Real-time updates from Campus Administration Base Station
        </div>
      </div>

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">My Campus Activity & Status Tracking</h1>
        <p className="text-sm text-slate-600 mt-1">
          Monitor your auditorium bookings, track maintenance and safety incident resolution, and check emergency response records.
        </p>
      </div>

      {/* Tabs & Search Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        {/* Primary Tabs */}
        <div className="flex items-center p-1 bg-slate-100 rounded-xl">
          <button
            onClick={() => setActiveTab('bookings')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'bookings'
                ? 'bg-white text-blue-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>🏛️ Auditorium Bookings</span>
            <span className="px-1.5 py-0.5 rounded-full bg-slate-200 text-slate-700 text-[10px]">
              {bookings.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('incidents')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'incidents'
                ? 'bg-white text-blue-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>🛠️ Incident Reports</span>
            <span className="px-1.5 py-0.5 rounded-full bg-slate-200 text-slate-700 text-[10px]">
              {incidents.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('sos')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'sos'
                ? 'bg-white text-rose-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>🚨 SOS History</span>
            <span className="px-1.5 py-0.5 rounded-full bg-rose-100 text-rose-700 text-[10px]">
              {emergencyAlerts.length}
            </span>
          </button>
        </div>

        {/* Search input */}
        <div className="relative w-full sm:w-64">
          <input
            type="text"
            placeholder="Search by ID, keyword..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-8 pr-3 py-2 bg-white border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 outline-none"
          />
          <span className="absolute left-2.5 top-2.5 text-slate-400 text-xs">🔍</span>
        </div>
      </div>

      {/* TAB 1: AUDITORIUM BOOKINGS */}
      {activeTab === 'bookings' && (
        <div className="space-y-4">
          {filteredBookings.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
              <div className="text-3xl mb-2">🏛️</div>
              <h3 className="text-sm font-bold text-slate-800">No Auditorium Bookings Found</h3>
              <p className="text-xs text-slate-500 mt-1 mb-4">You have not submitted any reservations matching your criteria.</p>
              <button
                onClick={() => setStudentView('auditorium-booking')}
                className="px-4 py-2 bg-blue-600 text-white font-semibold text-xs rounded-xl hover:bg-blue-700 transition"
              >
                Book an Auditorium Now
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {filteredBookings.map(b => (
                <div key={b.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:border-slate-300 transition space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs font-bold px-2 py-1 bg-slate-100 text-slate-700 rounded-lg">
                        {b.id}
                      </span>
                      <h3 className="font-bold text-slate-900 text-base">{b.eventName}</h3>
                    </div>
                    <div>{getBookingBadge(b.status)}</div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    <div>
                      <div className="text-slate-400 font-medium">AUDITORIUM</div>
                      <div className="font-semibold text-slate-800 mt-0.5">{b.auditoriumName}</div>
                    </div>
                    <div>
                      <div className="text-slate-400 font-medium">DATE & TIME</div>
                      <div className="font-semibold text-slate-800 mt-0.5">
                        {b.bookingDate} ({b.startTime} - {b.endTime})
                      </div>
                    </div>
                    <div>
                      <div className="text-slate-400 font-medium">APPLICANT & DEPT</div>
                      <div className="font-semibold text-slate-800 mt-0.5">{b.applicantName} ({b.department})</div>
                    </div>
                    <div>
                      <div className="text-slate-400 font-medium">SUBMITTED ON</div>
                      <div className="font-semibold text-slate-800 mt-0.5">{b.submittedAt}</div>
                    </div>
                  </div>

                  {/* Admin Remarks Section */}
                  {b.adminRemarks && (
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700 flex items-start gap-2">
                      <span className="text-blue-600 font-bold">Base Station Remark:</span>
                      <span>{b.adminRemarks}</span>
                      {b.reviewedBy && <span className="text-slate-400 italic">({b.reviewedBy} at {b.reviewedAt})</span>}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: INCIDENT REPORTS */}
      {activeTab === 'incidents' && (
        <div className="space-y-4">
          {filteredIncidents.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
              <div className="text-3xl mb-2">🛠️</div>
              <h3 className="text-sm font-bold text-slate-800">No Incident Reports Logged</h3>
              <p className="text-xs text-slate-500 mt-1 mb-4">No campus issues or maintenance tickets on record.</p>
              <button
                onClick={() => setStudentView('report-incident')}
                className="px-4 py-2 bg-blue-600 text-white font-semibold text-xs rounded-xl hover:bg-blue-700 transition"
              >
                Report an Issue
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {filteredIncidents.map(inc => (
                <div key={inc.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:border-slate-300 transition space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs font-bold px-2 py-1 bg-slate-100 text-slate-700 rounded-lg">
                        {inc.id}
                      </span>
                      <h3 className="font-bold text-slate-900 text-base">{inc.title}</h3>
                      <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-slate-600">
                        {inc.category}
                      </span>
                    </div>
                    <div>{getIncidentBadge(inc.status)}</div>
                  </div>

                  <p className="text-xs text-slate-600">{inc.description}</p>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-slate-50/70 p-3 rounded-xl border border-slate-100">
                    <div>
                      <div className="text-slate-400 font-medium">LOCATION</div>
                      <div className="font-semibold text-slate-800 mt-0.5">{inc.campusLocation}</div>
                      <div className="text-[11px] text-slate-500">{inc.floorRoom}</div>
                    </div>
                    <div>
                      <div className="text-slate-400 font-medium">PRIORITY LEVEL</div>
                      <div className="font-semibold text-slate-800 mt-0.5">
                        <span className={`inline-block w-2 h-2 rounded-full mr-1 ${
                          inc.priority === 'CRITICAL' ? 'bg-rose-500' :
                          inc.priority === 'HIGH' ? 'bg-amber-500' : 'bg-blue-500'
                        }`} />
                        {inc.priority}
                      </div>
                    </div>
                    <div>
                      <div className="text-slate-400 font-medium">ASSIGNED TECHNICIAN</div>
                      <div className="font-semibold text-blue-700 mt-0.5">
                        {inc.assignedTo || 'Pending Assignment'}
                      </div>
                    </div>
                    <div>
                      <div className="text-slate-400 font-medium">SUBMISSION TIME</div>
                      <div className="font-semibold text-slate-800 mt-0.5">{inc.submittedAt}</div>
                    </div>
                  </div>

                  {inc.resolutionNotes && (
                    <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-900">
                      <span className="font-bold">Base Station Resolution Notes: </span>
                      {inc.resolutionNotes}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: SOS HISTORY */}
      {activeTab === 'sos' && (
        <div className="space-y-4">
          {filteredSOS.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
              <div className="text-3xl mb-2">🚨</div>
              <h3 className="text-sm font-bold text-slate-800">No SOS Alerts Recorded</h3>
              <p className="text-xs text-slate-500 mt-1">No emergency broadcasts have been logged.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {filteredSOS.map(sos => (
                <div key={sos.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs font-bold px-2 py-1 bg-rose-100 text-rose-800 rounded-lg">
                        {sos.id}
                      </span>
                      <h3 className="font-bold text-slate-900 text-base">{sos.category}</h3>
                    </div>
                    <div>{getSOSBadge(sos.status)}</div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    <div>
                      <div className="text-slate-400 font-medium">LOCATION</div>
                      <div className="font-semibold text-slate-800 mt-0.5">{sos.buildingLocation}</div>
                    </div>
                    <div>
                      <div className="text-slate-400 font-medium">CALLER</div>
                      <div className="font-semibold text-slate-800 mt-0.5">{sos.userIdentifier}</div>
                      <div className="text-[11px] text-slate-500">{sos.contactPhone}</div>
                    </div>
                    <div>
                      <div className="text-slate-400 font-medium">ASSIGNED RESPONSE TEAM</div>
                      <div className="font-semibold text-blue-700 mt-0.5">
                        {sos.responseTeamAssigned || 'Command Center Monitoring'}
                      </div>
                    </div>
                    <div>
                      <div className="text-slate-400 font-medium">ALERT TIMESTAMP</div>
                      <div className="font-semibold text-slate-800 mt-0.5">{sos.timestamp}</div>
                    </div>
                  </div>

                  {sos.dispatchedAt && (
                    <div className="text-xs text-indigo-700 bg-indigo-50 p-2.5 rounded-lg border border-indigo-200">
                      🚨 Response unit deployed at {sos.dispatchedAt}.
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
