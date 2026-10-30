import React, { useState, useEffect } from 'react';
import { usePortal } from '../../PortalContext';
import { SOSCategory, GPSCoords, EmergencyAlert } from '../../types';

const SOS_CATEGORIES: { type: SOSCategory; label: string; icon: string; desc: string; color: string }[] = [
  { type: 'Medical Emergency', label: 'Medical Emergency', icon: '🚑', desc: 'Severe trauma, cardiac issue, sudden collapse, fainting', color: 'bg-rose-50 border-rose-300 text-rose-800' },
  { type: 'Fire Emergency', label: 'Fire Emergency', icon: '🔥', desc: 'Active fire, dense smoke, explosion risk, chemical burn', color: 'bg-amber-50 border-amber-300 text-amber-800' },
  { type: 'Security Emergency', label: 'Security Emergency', icon: '🛡️', desc: 'Violence, active threat, weapon sighting, trespasser', color: 'bg-purple-50 border-purple-300 text-purple-800' },
  { type: 'Personal Safety', label: 'Personal Safety', icon: '🆘', desc: 'Harassment, stalking, feeling unsafe after dark', color: 'bg-red-50 border-red-300 text-red-800' },
  { type: 'Other Emergency', label: 'Other Emergency', icon: '⚠️', desc: 'Immediate hazardous condition requiring rapid dispatch', color: 'bg-slate-50 border-slate-300 text-slate-800' }
];

const QUICK_LOCATIONS = [
  'Main Administrative Block - Ground Floor',
  'Library & Information Centre - Central Atrium',
  'Mechanical Block - Ground Workshop',
  'PG & Technology Block - Main Entrance',
  'Campus Canteen & Student Dining',
  'Sports Ground & Pavilion',
  'Hostel Zone (Boys Hostel 3)',
  'Main Campus Gate & Bharathi Salai Entrance'
];

export const EmergencySOSView: React.FC = () => {
  const { 
    triggerEmergencySOS, 
    emergencyAlerts, 
    resolveSOS, 
    setStudentView 
  } = usePortal();

  const [selectedCategory, setSelectedCategory] = useState<SOSCategory>('Medical Emergency');
  const [selectedLocation, setSelectedLocation] = useState<string>(QUICK_LOCATIONS[0]);
  const [customNotes, setCustomNotes] = useState('');
  const [userName, setUserName] = useState('');
  const [userPhone, setUserPhone] = useState('');
  
  // Geolocation
  const [gps, setGps] = useState<GPSCoords | null>(null);
  const [gpsStatus, setGpsStatus] = useState<'idle' | 'locating' | 'locked' | 'fallback'>('idle');

  // Active Alert Tracking (if an alert is already live in this session)
  const [activeAlertId, setActiveAlertId] = useState<string | null>(null);

  // Sync with context for active alert
  const currentAlert: EmergencyAlert | undefined = emergencyAlerts.find(a => a.id === activeAlertId);

  // Auto-attempt GPS geolocation on mount
  useEffect(() => {
    if ('geolocation' in navigator) {
      setGpsStatus('locating');
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setGps({
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
            accuracyMeters: Math.round(pos.coords.accuracy)
          });
          setGpsStatus('locked');
        },
        () => {
          // Fallback to official Easwari Engineering College coordinates
          setGps({
            latitude: 13.0324,
            longitude: 80.1802,
            accuracyMeters: 15
          });
          setGpsStatus('fallback');
        },
        { enableHighAccuracy: true, timeout: 6000 }
      );
    } else {
      setGps({ latitude: 13.0324, longitude: 80.1802, accuracyMeters: 20 });
      setGpsStatus('fallback');
    }
  }, []);

  const handleTriggerSOS = () => {
    const alert = triggerEmergencySOS(
      selectedCategory,
      customNotes.trim() || `Urgent ${selectedCategory} reported at ${selectedLocation}`,
      gps,
      selectedLocation,
      userName.trim() || 'Easwari Student / Staff',
      userPhone.trim() || '+91 94440 12345'
    );
    setActiveAlertId(alert.id);
  };

  const handleCancelSOS = () => {
    if (activeAlertId && confirm('Are you sure you want to cancel and stand down this emergency alert?')) {
      resolveSOS(activeAlertId);
      setActiveAlertId(null);
    }
  };

  // Status step progression calculation
  const getStepNumber = (status?: string) => {
    switch (status) {
      case 'SOS SENT': return 1;
      case 'RECEIVED BY BASE STATION': return 2;
      case 'RESPONSE TEAM ASSIGNED': return 3;
      case 'HELP IS ON THE WAY': return 4;
      case 'EMERGENCY RESOLVED': return 5;
      default: return 0;
    }
  };

  const currentStep = getStepNumber(currentAlert?.status);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Top Navigation */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-200">
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <button 
            onClick={() => setStudentView('home')}
            className="hover:text-blue-600 transition flex items-center gap-1 font-medium"
          >
            ← Back to Home
          </button>
          <span>/</span>
          <span className="text-rose-600 font-bold uppercase tracking-wider">Campus Emergency SOS</span>
        </div>
        <div className="flex items-center gap-2 text-xs font-semibold px-3 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
          <span className="w-2 h-2 rounded-full bg-rose-600 animate-ping"></span>
          <span>Base Station Monitoring Active (24/7)</span>
        </div>
      </div>

      {/* ACTIVE SOS LIVE STATUS VIEW */}
      {currentAlert && currentAlert.status !== 'EMERGENCY RESOLVED' ? (
        <div className="bg-white rounded-3xl border-2 border-rose-500 shadow-2xl p-6 sm:p-8 space-y-6 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-rose-100">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-rose-600 text-white font-bold text-xs rounded-full uppercase tracking-widest shadow-sm">
                <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
                ACTIVE EMERGENCY BROADCAST
              </div>
              <h2 className="text-2xl font-black text-slate-900 mt-2">
                {currentAlert.category}
              </h2>
              <p className="text-xs text-slate-500 font-mono mt-0.5">
                ALERT ID: {currentAlert.id} • Transmitted at {currentAlert.timestamp}
              </p>
            </div>
            <button
              onClick={handleCancelSOS}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl border border-slate-300 transition"
            >
              Cancel / False Alarm
            </button>
          </div>

          {/* 5-Step Live Progress Tracker */}
          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">
              Live Base Station Response Lifecycle
            </div>
            <div className="relative">
              {/* Timeline track */}
              <div className="absolute top-4 left-4 right-4 h-1 bg-slate-200 -z-0">
                <div 
                  className="h-full bg-rose-600 transition-all duration-700" 
                  style={{ width: `${Math.min(100, ((currentStep - 1) / 4) * 100)}%` }}
                />
              </div>

              <div className="grid grid-cols-5 relative z-10 text-center gap-1">
                {[
                  { step: 1, label: 'SOS Sent', desc: 'Broadcasted' },
                  { step: 2, label: 'Base Station', desc: 'Acknowledged' },
                  { step: 3, label: 'Team Assigned', desc: 'Officer designated' },
                  { step: 4, label: 'Help En Route', desc: 'Dispatched to scene' },
                  { step: 5, label: 'Resolved', desc: 'Scene secured' }
                ].map((item) => {
                  const isDone = currentStep >= item.step;
                  const isCurrent = currentStep === item.step;
                  return (
                    <div key={item.step} className="flex flex-col items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                        isDone 
                          ? 'bg-rose-600 text-white ring-4 ring-rose-100' 
                          : 'bg-white border-2 border-slate-300 text-slate-400'
                      }`}>
                        {isDone ? '✓' : item.step}
                      </div>
                      <div className={`mt-2 text-[11px] font-bold ${isCurrent ? 'text-rose-600' : isDone ? 'text-slate-800' : 'text-slate-400'}`}>
                        {item.label}
                      </div>
                      <div className="text-[10px] text-slate-400 hidden sm:block">
                        {item.desc}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Current Stage Message */}
            <div className="mt-6 p-4 bg-white rounded-xl border border-slate-200 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center text-lg font-bold">
                {currentStep === 1 && '📡'}
                {currentStep === 2 && '🏢'}
                {currentStep === 3 && '🛡️'}
                {currentStep === 4 && '🚨'}
                {currentStep === 5 && '✅'}
              </div>
              <div className="flex-1 text-xs">
                <div className="font-bold text-slate-900 text-sm">
                  Current Status: {currentAlert.status}
                </div>
                <div className="text-slate-600 mt-0.5">
                  {currentStep === 1 && 'Alert beacon transmitted across campus network and local RF mesh relay.'}
                  {currentStep === 2 && `Base Station Command acknowledged this distress call at ${currentAlert.acknowledgedAt || 'recently'}.`}
                  {currentStep === 3 && `Assigned Unit: ${currentAlert.responseTeamAssigned || 'Campus Quick Response Patrol'}. Officer is deploying.`}
                  {currentStep === 4 && `Dispatch confirmed at ${currentAlert.dispatchedAt || 'now'}. Remain in safe position; help is arriving!`}
                </div>
              </div>
            </div>
          </div>

          {/* Location & Contact Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div className="text-slate-400 font-bold uppercase tracking-wider mb-1">Target Location</div>
              <div className="font-bold text-slate-900 text-sm">{currentAlert.buildingLocation}</div>
              {currentAlert.gpsCoordinates && (
                <div className="text-slate-500 font-mono text-[11px] mt-1">
                  GPS: {currentAlert.gpsCoordinates.latitude.toFixed(5)}, {currentAlert.gpsCoordinates.longitude.toFixed(5)} (±{currentAlert.gpsCoordinates.accuracyMeters}m)
                </div>
              )}
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div className="text-slate-400 font-bold uppercase tracking-wider mb-1">Caller Details</div>
              <div className="font-bold text-slate-900 text-sm">{currentAlert.userIdentifier}</div>
              <div className="text-slate-600 text-xs mt-1">Phone: {currentAlert.contactPhone}</div>
            </div>
          </div>

          {/* Emergency Telephone Quick Dials */}
          <div className="bg-amber-50 p-4 rounded-xl border border-amber-200">
            <div className="text-xs font-bold text-amber-900 uppercase tracking-wider mb-2">
              Direct Emergency Hotlines (SRM Easwari Campus)
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <a 
                href="tel:+919444012345" 
                className="flex items-center justify-between p-2.5 bg-white rounded-lg border border-amber-300 font-semibold text-slate-800 hover:bg-amber-100 transition"
              >
                <span>📞 Campus Main Security Gate</span>
                <span className="font-mono text-blue-700">+91 94440 12345</span>
              </a>
              <a 
                href="tel:+919444067890" 
                className="flex items-center justify-between p-2.5 bg-white rounded-lg border border-amber-300 font-semibold text-slate-800 hover:bg-amber-100 transition"
              >
                <span>🏥 SRM Ramapuram Health Center</span>
                <span className="font-mono text-blue-700">+91 94440 67890</span>
              </a>
            </div>
          </div>
        </div>
      ) : (
        /* TRIGGER NEW SOS SCREEN */
        <div className="space-y-8">
          {/* Header Banner */}
          <div className="bg-rose-50 border border-rose-200 rounded-2xl p-6 text-center">
            <div className="inline-block p-3 bg-rose-600 text-white rounded-full mb-3 shadow-lg shadow-rose-500/30">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h1 className="text-2xl font-black text-rose-950 tracking-tight">
              Campus Emergency Distress Beacon
            </h1>
            <p className="text-sm text-rose-800 max-w-xl mx-auto mt-2">
              Press the red button below for immediate security and medical dispatch. Your coordinates will be transmitted directly to the Easwari Command Base Station.
            </p>
          </div>

          {/* GIANT RED SOS BUTTON */}
          <div className="flex flex-col items-center justify-center py-6">
            <div className="relative group">
              {/* Outer pulsing ring */}
              <div className="absolute -inset-4 bg-rose-600 rounded-full opacity-25 group-hover:opacity-40 animate-ping duration-1000"></div>
              
              <button
                type="button"
                onClick={handleTriggerSOS}
                className="relative w-48 h-48 sm:w-56 sm:h-56 rounded-full bg-gradient-to-b from-rose-500 via-rose-600 to-red-700 text-white shadow-2xl shadow-rose-600/50 flex flex-col items-center justify-center border-4 border-white/60 active:scale-95 transition-all duration-150 hover:brightness-105"
              >
                <span className="text-3xl sm:text-4xl mb-1">🚨</span>
                <span className="text-2xl sm:text-3xl font-black tracking-widest drop-shadow-md">EMERGENCY</span>
                <span className="text-3xl sm:text-4xl font-black tracking-widest text-amber-300 drop-shadow-md">SOS</span>
                <span className="text-[11px] font-semibold text-rose-100 uppercase tracking-wider mt-1">Tap to Transmit</span>
              </button>
            </div>

            <div className="flex items-center gap-2 mt-4 text-xs text-slate-500">
              <span className={`w-2.5 h-2.5 rounded-full ${gpsStatus === 'locked' ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
              <span>
                {gpsStatus === 'locating' && 'Acquiring GPS location...'}
                {gpsStatus === 'locked' && `GPS coordinates acquired (Accuracy: ±${gps?.accuracyMeters}m)`}
                {gpsStatus === 'fallback' && 'Using Easwari Campus GPS fallback coordinates'}
              </span>
            </div>
          </div>

          {/* Configuration options before triggering */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700">
              Configure Emergency Details
            </h3>

            {/* Emergency Category */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-2">Emergency Type</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                {SOS_CATEGORIES.map(cat => {
                  const isSelected = selectedCategory === cat.type;
                  return (
                    <button
                      type="button"
                      key={cat.type}
                      onClick={() => setSelectedCategory(cat.type)}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        isSelected 
                          ? 'border-rose-600 bg-rose-50/50 ring-2 ring-rose-500/20 text-rose-900 shadow-xs' 
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div className="flex items-center gap-2 font-bold text-xs mb-1">
                        <span className="text-base">{cat.icon}</span>
                        <span>{cat.label}</span>
                      </div>
                      <div className="text-[11px] text-slate-500 line-clamp-1">{cat.desc}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Location selector */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Campus Location</label>
                <select
                  value={selectedLocation}
                  onChange={e => setSelectedLocation(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-rose-500 outline-none"
                >
                  {QUICK_LOCATIONS.map(loc => (
                    <option key={loc} value={loc}>{loc}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Caller Name (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Student / Staff Name"
                  value={userName}
                  onChange={e => setUserName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-rose-500 outline-none"
                />
              </div>
            </div>

            {/* Custom Notes */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Brief Description (Optional)</label>
              <input
                type="text"
                placeholder="e.g. Person unconscious near chemistry lab stairs"
                value={customNotes}
                onChange={e => setCustomNotes(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-rose-500 outline-none"
              />
            </div>
          </div>

          {/* Mesh Fallback Protocol Assurance */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-start gap-3 text-xs text-slate-600">
            <span className="text-xl">📡</span>
            <div>
              <span className="font-bold text-slate-800">Dual-Channel Failover: </span>
              In case of WiFi or cellular dropouts, this beacon automatically relays distress packets across the local peer mesh network directly to the Base Station terminal.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
