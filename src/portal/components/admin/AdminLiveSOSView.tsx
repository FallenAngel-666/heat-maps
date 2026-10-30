import React, { useState } from 'react';
import { usePortal } from '../../PortalContext';
import { EmergencyAlert, SOSStatus } from '../../types';

export const AdminLiveSOSView: React.FC = () => {
  const { 
    emergencyAlerts, 
    acknowledgeSOS, 
    assignSOSTeam, 
    dispatchSOSTeam, 
    resolveSOS, 
    activeEmergencyCount 
  } = usePortal();

  const [soundEnabled, setSoundEnabled] = useState(false);
  const [assignTeamModalAlert, setAssignTeamModalAlert] = useState<EmergencyAlert | null>(null);
  const [selectedTeam, setSelectedTeam] = useState('Campus Quick Reaction Squad Alpha');

  // Trigger web audio beep if sound enabled
  const playAlertBeep = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(880, audioCtx.currentTime); // A5
      gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.4);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.4);
    } catch {
      // Audio not permitted without interaction
    }
  };

  const handleToggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    if (next) {
      playAlertBeep();
    }
  };

  const getStatusBadge = (status: SOSStatus) => {
    switch (status) {
      case 'EMERGENCY RESOLVED':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">RESOLVED</span>;
      case 'HELP IS ON THE WAY':
        return <span className="px-2.5 py-1 rounded-full text-xs font-extrabold bg-indigo-600 text-white animate-pulse">DISPATCH EN ROUTE</span>;
      case 'RESPONSE TEAM ASSIGNED':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-blue-600 text-white">TEAM ASSIGNED</span>;
      case 'RECEIVED BY BASE STATION':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500 text-white">ACKNOWLEDGED</span>;
      default:
        return <span className="px-2.5 py-1 rounded-full text-xs font-black bg-rose-600 text-white animate-ping">CRITICAL NEW BEACON</span>;
    }
  };

  const handleConfirmTeamAssignment = () => {
    if (!assignTeamModalAlert) return;
    assignSOSTeam(assignTeamModalAlert.id, selectedTeam);
    setAssignTeamModalAlert(null);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-rose-600 animate-ping"></span>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">LIVE EMERGENCY SOS MONITORING STATION</h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time distress beacon dispatch, GPS telemetry, and emergency response management.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Audio Alarm Toggle */}
          <button
            onClick={handleToggleSound}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-2 border ${
              soundEnabled
                ? 'bg-rose-100 border-rose-300 text-rose-800'
                : 'bg-white border-slate-300 text-slate-600 hover:bg-slate-50'
            }`}
          >
            <span>{soundEnabled ? '🔊 Alarm Sound ON' : '🔇 Alarm Sound Muted'}</span>
          </button>

          <div className="text-xs font-bold text-rose-600 bg-rose-50 px-3.5 py-1.5 rounded-xl border border-rose-200">
            Active Alerts: {activeEmergencyCount}
          </div>
        </div>
      </div>

      {/* Team Assignment Modal */}
      {assignTeamModalAlert && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in duration-150">
            <h3 className="text-base font-bold text-slate-900 mb-1">Assign Emergency Response Team</h3>
            <p className="text-xs text-slate-500 mb-4">
              Select designated squad to deploy to {assignTeamModalAlert.buildingLocation} for alert <span className="font-mono font-bold">{assignTeamModalAlert.id}</span>.
            </p>

            <div className="space-y-3 mb-5">
              {[
                'Campus Quick Reaction Squad Alpha (Gate 1)',
                'SRM Emergency Medical Response Unit 1',
                'Fire Safety & Evacuation Squad',
                'Campus Women Safety & Escort Squad',
                'Duty Night Security Patrol Team B'
              ].map(team => (
                <div
                  key={team}
                  onClick={() => setSelectedTeam(team)}
                  className={`p-3 rounded-xl border text-xs font-medium cursor-pointer transition ${
                    selectedTeam === team
                      ? 'border-blue-600 bg-blue-50 text-blue-900 font-bold'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  🛡️ {team}
                </div>
              ))}
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleConfirmTeamAssignment}
                className="flex-1 py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition"
              >
                Confirm Squad Assignment
              </button>
              <button
                onClick={() => setAssignTeamModalAlert(null)}
                className="py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-medium transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EMERGENCY ALERTS STREAM */}
      <div className="space-y-4">
        {emergencyAlerts.map(alert => {
          const isActive = alert.status !== 'EMERGENCY RESOLVED';
          const mapsUrl = alert.gpsCoordinates
            ? `https://www.google.com/maps?q=${alert.gpsCoordinates.latitude},${alert.gpsCoordinates.longitude}`
            : `https://www.google.com/maps/search/?api=1&query=SRM+Easwari+Engineering+College+Chennai`;

          return (
            <div 
              key={alert.id}
              className={`rounded-2xl border p-6 transition-all duration-200 ${
                isActive
                  ? 'bg-white border-2 border-rose-500 shadow-xl shadow-rose-500/10'
                  : 'bg-white/80 border-slate-200 shadow-2xs opacity-85'
              }`}
            >
              {/* Alert Header Row */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${isActive ? 'bg-rose-100 text-rose-700 animate-pulse' : 'bg-slate-100 text-slate-600'}`}>
                    {alert.category.includes('Medical') && '🚑'}
                    {alert.category.includes('Fire') && '🔥'}
                    {alert.category.includes('Security') && '🛡️'}
                    {alert.category.includes('Safety') && '🆘'}
                    {alert.category.includes('Other') && '⚠️'}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold bg-slate-100 px-2 py-0.5 rounded text-slate-700">{alert.id}</span>
                      <h3 className="text-base font-black text-slate-900">{alert.category}</h3>
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      Transmitted at <span className="font-mono font-semibold text-slate-700">{alert.timestamp}</span> • Channel: 
                      <span className="text-emerald-700 font-bold ml-1">
                        {alert.isMeshRelay ? 'Mesh Relay + Campus Wi-Fi' : 'Direct Cellular'}
                      </span>
                    </div>
                  </div>
                </div>

                <div>{getStatusBadge(alert.status)}</div>
              </div>

              {/* Middle Grid: Telemetry, GPS, Caller */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-4 text-xs">
                {/* Location Box */}
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                  <div className="text-slate-400 font-bold uppercase tracking-wider mb-1">Building Location</div>
                  <div className="font-bold text-slate-900 text-sm">{alert.buildingLocation}</div>
                  {alert.gpsCoordinates && (
                    <div className="mt-1 font-mono text-[11px] text-slate-500">
                      {alert.gpsCoordinates.latitude.toFixed(5)}, {alert.gpsCoordinates.longitude.toFixed(5)}
                    </div>
                  )}
                  <a
                    href={mapsUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 font-bold mt-2 text-[11px]"
                  >
                    <span>📍 Open in Google Maps</span>
                    <span>↗</span>
                  </a>
                </div>

                {/* Caller Identity */}
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                  <div className="text-slate-400 font-bold uppercase tracking-wider mb-1">Distress Caller</div>
                  <div className="font-bold text-slate-900 text-sm">{alert.userIdentifier}</div>
                  <div className="mt-1 text-slate-600">Contact: {alert.contactPhone}</div>
                  <a
                    href={`tel:${alert.contactPhone}`}
                    className="inline-flex items-center gap-1 text-emerald-700 hover:text-emerald-900 font-bold mt-2 text-[11px]"
                  >
                    <span>📞 Call Distress Number</span>
                  </a>
                </div>

                {/* Assigned Response Squad */}
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                  <div className="text-slate-400 font-bold uppercase tracking-wider mb-1">Response Deployment</div>
                  <div className="font-bold text-blue-700 text-sm">
                    {alert.responseTeamAssigned || 'No squad designated yet'}
                  </div>
                  {alert.dispatchedAt ? (
                    <div className="mt-1 text-xs text-indigo-700 font-semibold">
                      En route since {alert.dispatchedAt}
                    </div>
                  ) : (
                    <div className="mt-1 text-[11px] text-slate-400">
                      Awaiting squad dispatch trigger
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons Row */}
              <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                <div className="text-xs text-slate-500">
                  {alert.acknowledgedAt && <span>Acknowledged: {alert.acknowledgedAt} • </span>}
                  {alert.resolvedAt && <span className="text-emerald-700 font-semibold">Resolved at: {alert.resolvedAt}</span>}
                </div>

                {isActive && (
                  <div className="flex flex-wrap items-center gap-2">
                    {/* Action 1: Acknowledge */}
                    {alert.status === 'SOS SENT' && (
                      <button
                        onClick={() => acknowledgeSOS(alert.id)}
                        className="px-3.5 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow-xs transition"
                      >
                        1. Acknowledge SOS
                      </button>
                    )}

                    {/* Action 2: Assign Squad */}
                    <button
                      onClick={() => setAssignTeamModalAlert(alert)}
                      className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition"
                    >
                      2. Assign Response Team
                    </button>

                    {/* Action 3: Dispatch */}
                    <button
                      onClick={() => dispatchSOSTeam(alert.id)}
                      className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition"
                    >
                      3. Dispatch Response Unit 🚨
                    </button>

                    {/* Action 4: Resolve */}
                    <button
                      onClick={() => resolveSOS(alert.id)}
                      className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition"
                    >
                      4. Mark Emergency Resolved ✓
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
