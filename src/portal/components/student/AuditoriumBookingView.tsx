import React, { useState } from 'react';
import { usePortal } from '../../PortalContext';
import { Auditorium } from '../../types';

export const AuditoriumBookingView: React.FC = () => {
  const { auditoriums, checkBookingConflict, submitBooking, setStudentView } = usePortal();

  // Form State
  const [selectedAuditoriumId, setSelectedAuditoriumId] = useState<string>(auditoriums[0]?.id || '');
  const [applicantName, setApplicantName] = useState('');
  const [registerNumber, setRegisterNumber] = useState('');
  const [department, setDepartment] = useState('Computer Science & Engineering');
  const [eventName, setEventName] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [participantsCount, setParticipantsCount] = useState<number>(100);
  
  // Default to tomorrow's date
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split('T')[0];
  const [bookingDate, setBookingDate] = useState<string>(tomorrowStr);
  const [startTime, setStartTime] = useState<string>('09:30');
  const [endTime, setEndTime] = useState<string>('12:30');
  const [contactNumber, setContactNumber] = useState('');

  // UI status
  const [submissionResult, setSubmissionResult] = useState<{
    success: boolean;
    message: string;
    bookingId?: string;
  } | null>(null);

  const selectedAuditorium = auditoriums.find(a => a.id === selectedAuditoriumId) || auditoriums[0];

  // Live conflict evaluation
  const conflictCheck = checkBookingConflict(selectedAuditoriumId, bookingDate, startTime, endTime);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!applicantName.trim() || !registerNumber.trim() || !eventName.trim() || !contactNumber.trim()) {
      alert('Please fill out all mandatory fields.');
      return;
    }

    if (startTime >= endTime) {
      alert('Ending time must be later than starting time.');
      return;
    }

    const result = submitBooking({
      auditoriumId: selectedAuditorium.id,
      auditoriumName: selectedAuditorium.name,
      applicantName,
      registerNumber,
      department,
      eventName,
      eventDescription,
      participantsCount,
      bookingDate,
      startTime,
      endTime,
      contactNumber
    });

    setSubmissionResult(result);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Breadcrumb & Navigation */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-200">
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <button 
            onClick={() => setStudentView('home')}
            className="hover:text-blue-600 transition flex items-center gap-1 font-medium"
          >
            ← Back to Home
          </button>
          <span>/</span>
          <span className="text-slate-900 font-semibold">Auditorium Booking</span>
        </div>
        <button
          onClick={() => setStudentView('my-requests')}
          className="text-xs font-semibold px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg transition"
        >
          View My Bookings →
        </button>
      </div>

      {/* Confirmation Modal */}
      {submissionResult && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 text-center animate-in fade-in zoom-in duration-150">
            {submissionResult.success ? (
              <>
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-1">Booking Request Submitted!</h3>
                <p className="text-sm text-slate-600 mb-4">{submissionResult.message}</p>
                <div className="bg-slate-50 rounded-xl p-4 mb-6 border border-slate-200 text-left">
                  <div className="text-xs text-slate-400 font-medium">RESERVATION REFERENCE</div>
                  <div className="text-lg font-mono font-bold text-blue-600">{submissionResult.bookingId}</div>
                  <div className="mt-2 text-xs text-slate-600">
                    <span className="font-semibold">Auditorium:</span> {selectedAuditorium.name}
                  </div>
                  <div className="text-xs text-slate-600">
                    <span className="font-semibold">Date & Time:</span> {bookingDate} ({startTime} - {endTime})
                  </div>
                  <div className="mt-2 inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-100 text-amber-800">
                    Status: PENDING BASE STATION APPROVAL
                  </div>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setSubmissionResult(null);
                      setStudentView('my-requests');
                    }}
                    className="flex-1 py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition"
                  >
                    Track in My Requests
                  </button>
                  <button
                    onClick={() => setSubmissionResult(null)}
                    className="py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-medium transition"
                  >
                    Done
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-1">Slot Unavailable</h3>
                <p className="text-sm text-slate-600 mb-6">{submissionResult.message}</p>
                <button
                  onClick={() => setSubmissionResult(null)}
                  className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-sm font-semibold transition"
                >
                  Adjust Time / Date
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Auditorium & Facility Reservation</h1>
        <p className="text-sm text-slate-600 mt-1">
          Select an auditorium, check real-time schedule availability, and submit your reservation request directly to the Campus Administration Base Station.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Auditorium Selector & Details (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Select Campus Facility (4 Available)
            </label>
            <div className="space-y-3">
              {auditoriums.map(aud => {
                const isSelected = aud.id === selectedAuditoriumId;
                return (
                  <div
                    key={aud.id}
                    onClick={() => setSelectedAuditoriumId(aud.id)}
                    className={`cursor-pointer rounded-xl p-4 border transition-all ${
                      isSelected 
                        ? 'border-blue-600 bg-blue-50/40 ring-2 ring-blue-500/20 shadow-sm' 
                        : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-semibold text-slate-900 text-sm">{aud.name}</h4>
                        <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
                          <span>📍 {aud.location}</span>
                          <span>•</span>
                          <span className="font-medium text-blue-600">👥 {aud.capacity} Seats</span>
                        </div>
                      </div>
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${isSelected ? 'border-blue-600 bg-blue-600 text-white' : 'border-slate-300'}`}>
                        {isSelected && <span className="text-[10px] font-bold">✓</span>}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Selected Auditorium Card Detail */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="h-44 relative overflow-hidden bg-slate-100">
              <img 
                src={selectedAuditorium.image} 
                alt={selectedAuditorium.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-4">
                <div className="text-white">
                  <div className="text-xs font-semibold text-blue-300 uppercase tracking-wider">Facility Spotlight</div>
                  <h3 className="text-base font-bold">{selectedAuditorium.name}</h3>
                </div>
              </div>
            </div>

            <div className="p-4 space-y-3">
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  <div className="text-slate-400 font-medium">CAPACITY</div>
                  <div className="font-bold text-slate-800 text-sm mt-0.5">{selectedAuditorium.capacity} Guests</div>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  <div className="text-slate-400 font-medium">OPERATIONAL DAYS</div>
                  <div className="font-bold text-slate-800 text-sm mt-0.5">{selectedAuditorium.availableDays}</div>
                </div>
              </div>

              <div>
                <div className="text-xs font-semibold text-slate-700 mb-1.5">Equipped Facilities:</div>
                <div className="flex flex-wrap gap-1.5">
                  {selectedAuditorium.facilities.map((fac, i) => (
                    <span 
                      key={i}
                      className="px-2.5 py-1 bg-slate-100 text-slate-700 text-[11px] font-medium rounded-md border border-slate-200"
                    >
                      ✓ {fac}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 text-xs text-slate-500">
                <span className="font-medium text-slate-700">Facility Manager:</span> {selectedAuditorium.contactPerson}
              </div>
            </div>
          </div>
        </div>

        {/* Right: Booking Form (7 cols) */}
        <div className="lg:col-span-7">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 mb-4 pb-3 border-b border-slate-100 flex items-center justify-between">
              <span>Reservation Application</span>
              <span className="text-xs font-normal text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md">
                SRM Easwari Base Station
              </span>
            </h2>

            {/* Live Availability Status Banner */}
            <div className={`p-4 rounded-xl border mb-6 flex items-start gap-3 transition-colors ${
              conflictCheck.hasConflict 
                ? 'bg-rose-50 border-rose-200 text-rose-900' 
                : 'bg-emerald-50 border-emerald-200 text-emerald-900'
            }`}>
              <div className="text-xl">
                {conflictCheck.hasConflict ? '⚠️' : '✅'}
              </div>
              <div className="flex-1 text-xs">
                <div className="font-bold text-sm">
                  {conflictCheck.hasConflict ? 'Slot Conflict Detected' : 'Auditorium Available'}
                </div>
                <p className="mt-0.5 opacity-90">
                  {conflictCheck.hasConflict 
                    ? conflictCheck.conflictingEvent 
                    : `No conflicting reservations for ${selectedAuditorium.shortName} on ${bookingDate} between ${startTime} and ${endTime}.`}
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Event Details */}
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Event Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. National Hackathon Inauguration / Annual Guest Lecture"
                    value={eventName}
                    onChange={e => setEventName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Event Description & Purpose
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Brief description of event agenda, audio-visual requirements, or dignitary presence..."
                    value={eventDescription}
                    onChange={e => setEventDescription(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
                  />
                </div>
              </div>

              {/* Date & Time Slot (Critical Check) */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-50/70 p-3.5 rounded-xl border border-slate-200">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Booking Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={bookingDate}
                    onChange={e => setBookingDate(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Start Time *
                  </label>
                  <input
                    type="time"
                    required
                    value={startTime}
                    onChange={e => setStartTime(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    End Time *
                  </label>
                  <input
                    type="time"
                    required
                    value={endTime}
                    onChange={e => setEndTime(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>

              {/* Applicant Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Applicant Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dr. K. Ramanathan / S. Priya"
                    value={applicantName}
                    onChange={e => setApplicantName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Reg No. / Employee ID *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. EMP4482 / 310621104088"
                    value={registerNumber}
                    onChange={e => setRegisterNumber(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-1">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Department *
                  </label>
                  <select
                    value={department}
                    onChange={e => setDepartment(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option>Computer Science & Engineering</option>
                    <option>Information Technology</option>
                    <option>Electronics & Communication</option>
                    <option>Mechanical Engineering</option>
                    <option>Civil Engineering</option>
                    <option>Artificial Intelligence & Data Science</option>
                    <option>Biomedical Engineering</option>
                    <option>Management Studies (MBA)</option>
                    <option>Campus Student Affairs</option>
                  </select>
                </div>

                <div className="sm:col-span-1">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Expected Attendees
                  </label>
                  <input
                    type="number"
                    min={10}
                    max={selectedAuditorium.capacity}
                    value={participantsCount}
                    onChange={e => setParticipantsCount(parseInt(e.target.value) || 0)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
                  />
                </div>

                <div className="sm:col-span-1">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Contact Phone *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98400 12345"
                    value={contactNumber}
                    onChange={e => setContactNumber(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={conflictCheck.hasConflict}
                  className={`w-full py-3 px-6 rounded-xl font-bold text-sm text-white shadow-md transition-all flex items-center justify-center gap-2 ${
                    conflictCheck.hasConflict
                      ? 'bg-slate-300 cursor-not-allowed opacity-70'
                      : 'bg-blue-600 hover:bg-blue-700 active:scale-[0.99] shadow-blue-500/20'
                  }`}
                >
                  <span>Submit Booking Request</span>
                  <span>→</span>
                </button>
                {conflictCheck.hasConflict && (
                  <p className="text-center text-xs text-rose-600 mt-2 font-medium">
                    Please resolve timeslot conflict before submitting.
                  </p>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
