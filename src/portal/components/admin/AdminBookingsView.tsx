import React, { useState } from 'react';
import { usePortal } from '../../PortalContext';
import { AuditoriumBooking, BookingStatus } from '../../types';

export const AdminBookingsView: React.FC = () => {
  const { bookings, updateBookingStatus, auditoriums } = usePortal();

  const [statusFilter, setStatusFilter] = useState<'ALL' | BookingStatus>('ALL');
  const [auditoriumFilter, setAuditoriumFilter] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  // Rejection Modal State
  const [rejectingBooking, setRejectingBooking] = useState<AuditoriumBooking | null>(null);
  const [rejectionReason, setRejectionReason] = useState('Official institutional schedule conflict or hall maintenance.');

  // Detail Modal State
  const [inspectBooking, setInspectBooking] = useState<AuditoriumBooking | null>(null);

  // Filtered List
  const filtered = bookings.filter(b => {
    const matchStatus = statusFilter === 'ALL' || b.status === statusFilter;
    const matchAud = auditoriumFilter === 'ALL' || b.auditoriumId === auditoriumFilter;
    const matchSearch = 
      b.eventName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.applicantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.department.toLowerCase().includes(searchTerm.toLowerCase());
    return matchStatus && matchAud && matchSearch;
  });

  const handleApprove = (id: string) => {
    updateBookingStatus(id, 'APPROVED', 'Approved by Base Station Facility Controller.');
  };

  const handleConfirmReject = () => {
    if (!rejectingBooking) return;
    updateBookingStatus(rejectingBooking.id, 'REJECTED', rejectionReason);
    setRejectingBooking(null);
  };

  const handleCancelBooking = (id: string) => {
    if (confirm('Cancel this approved reservation? The time slot will become available again.')) {
      updateBookingStatus(id, 'CANCELLED', 'Reservation revoked by Campus Administration.');
    }
  };

  const getStatusBadge = (status: BookingStatus) => {
    switch (status) {
      case 'APPROVED':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">APPROVED</span>;
      case 'REJECTED':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-800">REJECTED</span>;
      case 'CANCELLED':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-800">CANCELLED</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 animate-pulse">PENDING REVIEW</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Auditorium Reservations Management</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Approve, reject with reasons, and monitor facility schedules across all 4 Easwari Auditoriums.
          </p>
        </div>
        <div className="text-xs font-semibold text-slate-600 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-2xs">
          Total Bookings: {bookings.length} ({bookings.filter(b => b.status === 'PENDING').length} Pending)
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {/* Status Tabs */}
          {(['ALL', 'PENDING', 'APPROVED', 'REJECTED', 'CANCELLED'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setStatusFilter(tab)}
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
          {/* Auditorium Selector */}
          <select
            value={auditoriumFilter}
            onChange={e => setAuditoriumFilter(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium outline-none"
          >
            <option value="ALL">All Auditoriums</option>
            {auditoriums.map(a => (
              <option key={a.id} value={a.id}>{a.shortName}</option>
            ))}
          </select>

          {/* Search box */}
          <input
            type="text"
            placeholder="Search event, applicant..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none w-44 sm:w-56"
          />
        </div>
      </div>

      {/* Rejection Modal */}
      {rejectingBooking && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in duration-150">
            <h3 className="text-lg font-bold text-slate-900 mb-1">Reject Reservation</h3>
            <p className="text-xs text-slate-500 mb-4">
              Specify the institutional justification for rejecting booking <span className="font-mono font-bold text-slate-700">{rejectingBooking.id}</span>.
            </p>

            <div className="mb-4">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Mandatory Rejection Reason *
              </label>
              <textarea
                rows={3}
                value={rejectionReason}
                onChange={e => setRejectionReason(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-rose-500 outline-none"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleConfirmReject}
                className="flex-1 py-2.5 px-4 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition"
              >
                Confirm Rejection
              </button>
              <button
                onClick={() => setRejectingBooking(null)}
                className="py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-medium transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Detail Inspection Modal */}
      {inspectBooking && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in duration-150 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold bg-slate-100 px-2 py-1 rounded text-slate-700">{inspectBooking.id}</span>
                <h3 className="text-base font-bold text-slate-900">{inspectBooking.eventName}</h3>
              </div>
              <div>{getStatusBadge(inspectBooking.status)}</div>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded-xl">
                <div>
                  <span className="text-slate-400 font-medium">Auditorium:</span>
                  <div className="font-bold text-slate-800">{inspectBooking.auditoriumName}</div>
                </div>
                <div>
                  <span className="text-slate-400 font-medium">Date & Schedule:</span>
                  <div className="font-bold text-slate-800">{inspectBooking.bookingDate} ({inspectBooking.startTime} - {inspectBooking.endTime})</div>
                </div>
              </div>

              <div>
                <span className="text-slate-400 font-medium">Applicant Details:</span>
                <div className="text-slate-800 font-semibold">{inspectBooking.applicantName} ({inspectBooking.registerNumber})</div>
                <div className="text-slate-600">{inspectBooking.department} • Contact: {inspectBooking.contactNumber}</div>
              </div>

              {inspectBooking.eventDescription && (
                <div>
                  <span className="text-slate-400 font-medium">Event Description:</span>
                  <p className="text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-200 mt-1">{inspectBooking.eventDescription}</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3 text-[11px] text-slate-500 pt-2 border-t border-slate-100">
                <div>Submitted: {inspectBooking.submittedAt}</div>
                <div>Expected Attendance: {inspectBooking.participantsCount}</div>
              </div>

              {inspectBooking.adminRemarks && (
                <div className="p-3 bg-blue-50 text-blue-900 rounded-lg text-xs">
                  <span className="font-bold">Remarks: </span> {inspectBooking.adminRemarks}
                </div>
              )}
            </div>

            <div className="flex justify-end pt-3">
              <button
                onClick={() => setInspectBooking(null)}
                className="py-2 px-5 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bookings Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-xs">
            No auditorium reservations match the selected filters.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-4">Booking ID & Event</th>
                  <th className="py-3 px-4">Auditorium</th>
                  <th className="py-3 px-4">Date & Time</th>
                  <th className="py-3 px-4">Applicant & Dept</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map(b => (
                  <tr key={b.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded text-[11px]">{b.id}</span>
                        <span className="font-bold text-slate-900">{b.eventName}</span>
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        {b.participantsCount} participants
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-medium text-slate-800">
                      {b.auditoriumName}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-800">{b.bookingDate}</div>
                      <div className="text-[11px] text-slate-500">{b.startTime} - {b.endTime}</div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-800">{b.applicantName}</div>
                      <div className="text-[11px] text-slate-500">{b.department}</div>
                    </td>

                    <td className="py-3.5 px-4">
                      {getStatusBadge(b.status)}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setInspectBooking(b)}
                          className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-md text-[11px] transition"
                        >
                          Details
                        </button>

                        {b.status === 'PENDING' && (
                          <>
                            <button
                              onClick={() => handleApprove(b.id)}
                              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-md text-[11px] transition"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => setRejectingBooking(b)}
                              className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 font-semibold rounded-md border border-rose-200 text-[11px] transition"
                            >
                              Reject
                            </button>
                          </>
                        )}

                        {b.status === 'APPROVED' && (
                          <button
                            onClick={() => handleCancelBooking(b.id)}
                            className="px-2 py-1 text-rose-600 hover:text-rose-800 text-[11px] font-semibold"
                          >
                            Revoke
                          </button>
                        )}
                      </div>
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
