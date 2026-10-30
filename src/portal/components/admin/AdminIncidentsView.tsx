import React, { useState } from 'react';
import { usePortal } from '../../PortalContext';
import { IncidentReport, IncidentStatus, IncidentPriority } from '../../types';

const TECHNICIANS = [
  'K. Murugan (Senior Campus Electrician)',
  'R. Balaji (Plumbing & Sanitation Lead)',
  'S. Senthil (Civil & Infrastructure)',
  'P. Kumar (Campus Security Desk)',
  'Dr. K. Malathi (SRM Medical Clinic)',
  'M. Ramesh (Audio-Visual & Smart Labs)',
  'General Maintenance Team 2'
];

export const AdminIncidentsView: React.FC = () => {
  const { incidents, updateIncidentStatus } = usePortal();

  const [statusFilter, setStatusFilter] = useState<'ALL' | IncidentStatus>('ALL');
  const [priorityFilter, setPriorityFilter] = useState<'ALL' | IncidentPriority>('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  // Manage Selected Incident Modal / Drawer
  const [selectedIncident, setSelectedIncident] = useState<IncidentReport | null>(null);
  const [assignee, setAssignee] = useState(TECHNICIANS[0]);
  const [resolutionNote, setResolutionNote] = useState('');
  const [newStatus, setNewStatus] = useState<IncidentStatus>('IN PROGRESS');
  const [previewPhoto, setPreviewPhoto] = useState<string | null>(null);

  const filtered = incidents.filter(inc => {
    const matchStatus = statusFilter === 'ALL' || inc.status === statusFilter;
    const matchPriority = priorityFilter === 'ALL' || inc.priority === priorityFilter;
    const matchSearch = 
      inc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inc.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inc.campusLocation.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inc.id.toLowerCase().includes(searchTerm.toLowerCase());
    return matchStatus && matchPriority && matchSearch;
  });

  const handleOpenManage = (inc: IncidentReport) => {
    setSelectedIncident(inc);
    setAssignee(inc.assignedTo || TECHNICIANS[0]);
    setResolutionNote(inc.resolutionNotes || '');
    setNewStatus(inc.status === 'RECEIVED' ? 'UNDER REVIEW' : inc.status);
  };

  const handleSaveUpdate = () => {
    if (!selectedIncident) return;
    updateIncidentStatus(selectedIncident.id, newStatus, assignee, resolutionNote);
    setSelectedIncident(null);
  };

  const getPriorityBadge = (priority: IncidentPriority) => {
    switch (priority) {
      case 'CRITICAL':
        return <span className="px-2 py-0.5 rounded text-[11px] font-extrabold bg-rose-600 text-white animate-pulse">CRITICAL</span>;
      case 'HIGH':
        return <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-500 text-white">HIGH</span>;
      case 'MEDIUM':
        return <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-blue-100 text-blue-800">MEDIUM</span>;
      case 'LOW':
        return <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-700">LOW</span>;
    }
  };

  const getStatusBadge = (status: IncidentStatus) => {
    switch (status) {
      case 'RESOLVED':
      case 'CLOSED':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">{status}</span>;
      case 'IN PROGRESS':
      case 'ASSIGNED':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800">{status}</span>;
      case 'UNDER REVIEW':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-100 text-purple-800">{status}</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800">RECEIVED</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Campus Incident & Maintenance Queue</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Triage reported hazards, assign campus technicians, and manage resolution lifecycles.
          </p>
        </div>
        <div className="text-xs font-semibold text-slate-600 bg-white px-3 py-1.5 rounded-xl border border-slate-200">
          Open Tickets: {incidents.filter(i => i.status !== 'RESOLVED' && i.status !== 'CLOSED').length}
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {(['ALL', 'RECEIVED', 'UNDER REVIEW', 'ASSIGNED', 'IN PROGRESS', 'RESOLVED'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setStatusFilter(tab as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                statusFilter === tab
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          {/* Priority filter */}
          <select
            value={priorityFilter}
            onChange={e => setPriorityFilter(e.target.value as any)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium outline-none"
          >
            <option value="ALL">All Priorities</option>
            <option value="CRITICAL">Critical</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
          </select>

          {/* Search box */}
          <input
            type="text"
            placeholder="Search tickets..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none w-44"
          />
        </div>
      </div>

      {/* Photo Preview Modal */}
      {previewPhoto && (
        <div 
          onClick={() => setPreviewPhoto(null)} 
          className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 cursor-pointer"
        >
          <div className="max-w-2xl max-h-[85vh] bg-white rounded-2xl p-2 shadow-2xl overflow-hidden">
            <img src={previewPhoto} alt="Incident Full" className="w-full h-auto max-h-[80vh] object-contain rounded-xl" />
            <div className="text-center text-xs text-slate-500 py-1">Click anywhere to close</div>
          </div>
        </div>
      )}

      {/* Manage / Assign Modal */}
      {selectedIncident && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in duration-150 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="font-mono text-xs font-bold bg-slate-100 px-2 py-0.5 rounded text-slate-700">{selectedIncident.id}</span>
                <h3 className="text-base font-bold text-slate-900 mt-1">{selectedIncident.title}</h3>
              </div>
              <div>{getPriorityBadge(selectedIncident.priority)}</div>
            </div>

            <div className="space-y-3 text-xs">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <div className="text-slate-400 font-medium">DESCRIPTION</div>
                <p className="text-slate-700 mt-0.5">{selectedIncident.description}</p>
                <div className="mt-2 text-slate-500">
                  <span className="font-semibold">Location:</span> {selectedIncident.campusLocation} ({selectedIncident.floorRoom})
                </div>
                <div className="text-slate-500">
                  <span className="font-semibold">Reporter:</span> {selectedIncident.isAnonymous ? 'Confidential / Anonymous' : selectedIncident.contactInfo}
                </div>
              </div>

              {selectedIncident.photoUrl && (
                <div className="flex items-center gap-3 p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                  <img 
                    src={selectedIncident.photoUrl} 
                    alt="Thumbnail" 
                    className="w-12 h-12 object-cover rounded-lg cursor-pointer border hover:opacity-80"
                    onClick={() => setPreviewPhoto(selectedIncident.photoUrl || null)}
                  />
                  <div className="text-xs">
                    <span className="font-semibold text-slate-800">Attached Photograph</span>
                    <button 
                      type="button"
                      onClick={() => setPreviewPhoto(selectedIncident.photoUrl || null)}
                      className="block text-blue-600 font-medium hover:underline text-[11px]"
                    >
                      Click to view full image
                    </button>
                  </div>
                </div>
              )}

              {/* Assignment Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Assign Campus Staff / Technician *
                </label>
                <select
                  value={assignee}
                  onChange={e => setAssignee(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {TECHNICIANS.map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              {/* Status Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Update Lifecycle Status *
                </label>
                <select
                  value={newStatus}
                  onChange={e => setNewStatus(e.target.value as IncidentStatus)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="RECEIVED">RECEIVED</option>
                  <option value="UNDER REVIEW">UNDER REVIEW</option>
                  <option value="ASSIGNED">ASSIGNED</option>
                  <option value="IN PROGRESS">IN PROGRESS</option>
                  <option value="RESOLVED">RESOLVED</option>
                  <option value="CLOSED">CLOSED</option>
                </select>
              </div>

              {/* Resolution Notes */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Resolution / Progress Notes
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Electrician Murugan repaired the short-circuited junction box. Replaced breaker and sealed wire harness."
                  value={resolutionNote}
                  onChange={e => setResolutionNote(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-3">
              <button
                onClick={handleSaveUpdate}
                className="flex-1 py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition"
              >
                Save Ticket Update
              </button>
              <button
                onClick={() => setSelectedIncident(null)}
                className="py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-medium transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Incidents Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-xs">
            No incident reports found matching current filters.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-4">Ticket ID & Title</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Campus Location</th>
                  <th className="py-3 px-4">Priority</th>
                  <th className="py-3 px-4">Assigned Personnel</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map(inc => (
                  <tr key={inc.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded text-[11px]">{inc.id}</span>
                        <span className="font-bold text-slate-900">{inc.title}</span>
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        Submitted: {inc.submittedAt}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-medium text-slate-700">
                      {inc.category}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-800">{inc.campusLocation}</div>
                      <div className="text-[11px] text-slate-500">{inc.floorRoom}</div>
                    </td>

                    <td className="py-3.5 px-4">
                      {getPriorityBadge(inc.priority)}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-medium text-slate-800">
                        {inc.assignedTo || <span className="text-slate-400 italic">Unassigned</span>}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      {getStatusBadge(inc.status)}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => handleOpenManage(inc)}
                        className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold rounded-lg text-[11px] transition"
                      >
                        Triage & Assign →
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
