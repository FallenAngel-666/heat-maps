import React, { useState } from 'react';
import { usePortal } from '../../PortalContext';
import { IncidentCategory } from '../../types';

const CATEGORIES: { label: IncidentCategory; icon: string; desc: string }[] = [
  { label: 'Electrical Issues', icon: '⚡', desc: 'Short circuits, power outage, sparks, exposed wiring' },
  { label: 'Fire Hazards', icon: '🔥', desc: 'Smoke, smell of burning, blocked fire exits, faulty alarms' },
  { label: 'Water Leakage', icon: '💧', desc: 'Pipe bursts, flooding, restroom leakage, roof seepage' },
  { label: 'Infrastructure Damage', icon: '🏗️', desc: 'Broken doors/windows, floor cracks, ceiling damage' },
  { label: 'Medical Emergencies', icon: '🚑', desc: 'Injuries, fainting, sudden illness requiring first aid' },
  { label: 'Security Issues', icon: '🛡️', desc: 'Trespassing, theft, unauthorized entry, suspicious activity' },
  { label: 'Harassment / Safety Concerns', icon: '⚠️', desc: 'Ragging, intimidation, stalking, unsafe corridors' },
  { label: 'Equipment Malfunction', icon: '⚙️', desc: 'Lab machinery, AC breakdown, elevator stuck, projector failure' },
  { label: 'Other', icon: '📌', desc: 'Any other general campus operational hazard or concern' }
];

const LOCATIONS = [
  'Main Administrative Block',
  'Library & Information Centre',
  'Mechanical & Civil Engineering Block',
  'PG & Technology Innovation Block',
  'Science & Humanities (Old Block)',
  'Central Computer Center (Main L2)',
  'Main College Canteen & Food Court',
  'Sports Complex & Ground',
  'SRM Ramapuram Boys Hostel 3',
  'Girls Hostel Campus Block',
  'Campus Parking & Entrance Gates',
  'Other / Outdoor Pathway'
];

export const IncidentReportView: React.FC = () => {
  const { submitIncident, setStudentView } = usePortal();

  const [category, setCategory] = useState<IncidentCategory>('Electrical Issues');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [campusLocation, setCampusLocation] = useState(LOCATIONS[0]);
  const [floorRoom, setFloorRoom] = useState('');
  const [contactInfo, setContactInfo] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const [createdTicketId, setCreatedTicketId] = useState<string | null>(null);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Please choose an image under 5MB.');
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      alert('Please fill out the incident title and description.');
      return;
    }

    if (!isAnonymous && !contactInfo.trim()) {
      alert('Please provide contact details or select anonymous reporting.');
      return;
    }

    const res = submitIncident({
      category,
      title,
      description,
      campusLocation,
      floorRoom: floorRoom.trim() || 'Ground Level / Main Hall',
      photoUrl: photoPreview || undefined,
      contactInfo: isAnonymous ? 'Confidential / Anonymous' : contactInfo,
      isAnonymous
    });

    setCreatedTicketId(res.incidentId);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-200">
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <button 
            onClick={() => setStudentView('home')}
            className="hover:text-blue-600 transition flex items-center gap-1 font-medium"
          >
            ← Back to Home
          </button>
          <span>/</span>
          <span className="text-slate-900 font-semibold">Report an Incident</span>
        </div>
        <button
          onClick={() => setStudentView('my-requests')}
          className="text-xs font-semibold px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg transition"
        >
          Track Past Incidents →
        </button>
      </div>

      {/* Success Modal */}
      {createdTicketId && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 text-center animate-in fade-in zoom-in duration-150">
            <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-1">Incident Report Transmitted</h3>
            <p className="text-xs text-slate-600 mb-4">
              Your report has been logged at the Campus Operations Base Station. A technician or safety officer is being assigned.
            </p>
            <div className="bg-slate-50 rounded-xl p-4 mb-6 border border-slate-200 text-left">
              <div className="text-xs text-slate-400 font-medium">TRACKING TICKET ID</div>
              <div className="text-lg font-mono font-bold text-blue-600">{createdTicketId}</div>
              <div className="mt-2 text-xs text-slate-600">
                <span className="font-semibold">Category:</span> {category}
              </div>
              <div className="text-xs text-slate-600">
                <span className="font-semibold">Location:</span> {campusLocation} ({floorRoom || 'Ground'})
              </div>
              <div className="mt-2 inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-semibold bg-blue-100 text-blue-800">
                Status: RECEIVED AT BASE STATION
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setCreatedTicketId(null);
                  setStudentView('my-requests');
                }}
                className="flex-1 py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition"
              >
                Track in My Requests
              </button>
              <button
                onClick={() => {
                  setCreatedTicketId(null);
                  setTitle('');
                  setDescription('');
                  setFloorRoom('');
                  setPhotoPreview(null);
                }}
                className="py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-medium transition"
              >
                File Another
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Report a Campus Incident</h1>
        <p className="text-sm text-slate-600 mt-1">
          Help maintain a safe and functional campus. Reports are routed to the central maintenance and security desk for rapid resolution.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
        {/* Category Grid */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
            1. Select Incident Category *
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {CATEGORIES.map(cat => {
              const isSelected = category === cat.label;
              return (
                <button
                  type="button"
                  key={cat.label}
                  onClick={() => setCategory(cat.label)}
                  className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'border-blue-600 bg-blue-50/50 ring-2 ring-blue-500/20 text-blue-900 shadow-sm'
                      : 'border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50/60 text-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-1">
                    <span className="text-lg">{cat.icon}</span>
                    {isSelected && <span className="text-xs font-bold text-blue-600">● Selected</span>}
                  </div>
                  <div className="text-xs font-bold">{cat.label}</div>
                  <div className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">{cat.desc}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Location Details */}
        <div className="pt-4 border-t border-slate-100">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
            2. Location on Campus *
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-slate-500 font-medium mb-1">Building / Zone</label>
              <select
                value={campusLocation}
                onChange={e => setCampusLocation(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none"
              >
                {LOCATIONS.map(loc => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs text-slate-500 font-medium mb-1">Floor / Room / Landmark</label>
              <input
                type="text"
                placeholder="e.g. 3rd Floor, Lab 304 or Near East Staircase"
                value={floorRoom}
                onChange={e => setFloorRoom(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>
        </div>

        {/* Title & Description */}
        <div className="pt-4 border-t border-slate-100 space-y-4">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
            3. Incident Details *
          </label>
          <div>
            <label className="block text-xs text-slate-500 font-medium mb-1">Subject / Summary</label>
            <input
              type="text"
              required
              placeholder="e.g. Broken ceiling tile with exposed high-voltage wiring"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-xs text-slate-500 font-medium mb-1">Detailed Description</label>
            <textarea
              required
              rows={3}
              placeholder="Provide exact details of what occurred, hazards present, or if anyone is in immediate risk..."
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
        </div>

        {/* Photograph Upload */}
        <div className="pt-4 border-t border-slate-100">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
            4. Attach Photograph (Optional)
          </label>
          <div className="flex items-center gap-4">
            <label className="cursor-pointer px-4 py-2 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 transition flex items-center gap-2">
              <span>📷 Select Photo</span>
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
              />
            </label>
            {photoPreview && (
              <div className="relative group">
                <img 
                  src={photoPreview} 
                  alt="Incident Preview" 
                  className="w-16 h-16 object-cover rounded-lg border border-slate-300 shadow-xs" 
                />
                <button
                  type="button"
                  onClick={() => setPhotoPreview(null)}
                  className="absolute -top-2 -right-2 w-5 h-5 bg-rose-500 text-white rounded-full flex items-center justify-center text-xs"
                >
                  ×
                </button>
              </div>
            )}
            <span className="text-xs text-slate-500">
              {photoPreview ? 'Photo attached' : 'Upload an image showing the issue (JPG, PNG up to 5MB)'}
            </span>
          </div>
        </div>

        {/* Reporter Identity & Anonymous Toggle */}
        <div className="pt-4 border-t border-slate-100 space-y-3">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
            5. Reporter Contact & Privacy
          </label>
          <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl border border-slate-200">
            <input
              type="checkbox"
              id="anonymousCheckbox"
              checked={isAnonymous}
              onChange={e => setIsAnonymous(e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
            />
            <label htmlFor="anonymousCheckbox" className="text-xs text-slate-700 font-medium cursor-pointer">
              Submit Anonymously (Your name and ID will not be shared with facility officers)
            </label>
          </div>

          {!isAnonymous && (
            <div>
              <label className="block text-xs text-slate-500 font-medium mb-1">
                Your Contact Phone or College Email *
              </label>
              <input
                type="text"
                placeholder="e.g. +91 98401 22334 or student@srmeaswari.ac.in"
                value={contactInfo}
                onChange={e => setContactInfo(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          )}
        </div>

        {/* Submit */}
        <div className="pt-4">
          <button
            type="submit"
            className="w-full py-3.5 px-6 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md shadow-blue-500/20 text-sm transition-all active:scale-[0.99] flex items-center justify-center gap-2"
          >
            <span>Transmit Incident Report to Base Station</span>
            <span>→</span>
          </button>
          <p className="text-center text-xs text-slate-500 mt-2">
            For life-threatening or fire emergencies, please use the <strong className="text-rose-600">Emergency SOS</strong> module directly.
          </p>
        </div>
      </form>
    </div>
  );
};
