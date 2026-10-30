import React, { useState } from 'react';
import { 
  X, 
  ShieldAlert, 
  CheckCircle2, 
  AlertTriangle, 
  AlertOctagon, 
  Sparkles, 
  Filter, 
  Clock, 
  ArrowRight,
  RotateCcw,
  Check
} from 'lucide-react';
import { Incident, EventLog, Building } from '../../types';

interface IncidentLogDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  incidents: Incident[];
  events: EventLog[];
  buildings: Building[];
  onResolveIncident: (incidentId: string) => void;
  onSelectBuilding: (buildingId: string) => void;
  onTriggerSimulation: (type: 'fire' | 'power' | 'network' | 'reset') => void;
}

export const IncidentLogDrawer: React.FC<IncidentLogDrawerProps> = ({
  isOpen,
  onClose,
  incidents,
  events,
  buildings,
  onResolveIncident,
  onSelectBuilding,
  onTriggerSimulation
}) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<'active' | 'resolved' | 'stream'>('active');

  const activeIncidents = incidents.filter((i) => i.status !== 'resolved');
  const resolvedIncidents = incidents.filter((i) => i.status === 'resolved');

  return (
    <div className="fixed inset-y-0 right-0 w-full sm:w-[460px] bg-white/98 backdrop-blur-xl border-l border-slate-200 shadow-2xl z-50 flex flex-col transition-transform duration-300 select-none">
      {/* Header */}
      <div className="p-5 border-b border-slate-200/80 flex items-center justify-between bg-slate-50/60">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900 leading-none">
              Operational Stream & Incidents
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              CampusPulse OS real-time telemetry and dispatch log
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/70 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Quick Simulation Scenarios Bar */}
      <div className="p-4 bg-slate-50 border-b border-slate-200/70 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Interactive 3D Demo Simulators</span>
          </span>
        </div>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <button
            onClick={() => onTriggerSimulation('fire')}
            className="p-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-800 border border-red-200 text-left font-medium transition-colors"
          >
            🔥 Fire Alarm (Turn Red)
          </button>
          <button
            onClick={() => onTriggerSimulation('power')}
            className="p-2 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 text-left font-medium transition-colors"
          >
            ⚡ Power Fluctuation (Amber)
          </button>
          <button
            onClick={() => onTriggerSimulation('network')}
            className="p-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-800 border border-red-200 text-left font-medium transition-colors"
          >
            🌐 Optical Fiber Cut (Red)
          </button>
          <button
            onClick={() => onTriggerSimulation('reset')}
            className="p-2 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-left font-medium transition-colors"
          >
            ✅ Restore All Nominal (Green)
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-5 pt-3 border-b border-slate-200/80 flex items-center gap-4 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('active')}
          className={`pb-2.5 transition-colors border-b-2 flex items-center gap-1.5 ${
            activeTab === 'active'
              ? 'border-sky-600 text-sky-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <span>Active Tickets</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-red-100 text-red-700 font-mono">
            {activeIncidents.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('stream')}
          className={`pb-2.5 transition-colors border-b-2 flex items-center gap-1.5 ${
            activeTab === 'stream'
              ? 'border-sky-600 text-sky-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <span>Live Audit Stream</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-100 text-slate-600 font-mono">
            {events.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('resolved')}
          className={`pb-2.5 transition-colors border-b-2 flex items-center gap-1.5 ${
            activeTab === 'resolved'
              ? 'border-sky-600 text-sky-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <span>Resolved</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-emerald-100 text-emerald-700 font-mono">
            {resolvedIncidents.length}
          </span>
        </button>
      </div>

      {/* Tab Content List */}
      <div className="flex-1 overflow-y-auto p-5 space-y-3">
        {activeTab === 'active' && (
          <>
            {activeIncidents.length === 0 ? (
              <div className="text-center py-12 text-slate-400 text-xs">
                <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2 opacity-60" />
                <p className="font-semibold text-slate-700">All Systems Nominal</p>
                <p className="text-slate-500 mt-1">No active incidents reported across campus buildings.</p>
              </div>
            ) : (
              activeIncidents.map((incident) => (
                <div
                  key={incident.id}
                  className={`p-4 rounded-xl border text-xs space-y-2.5 transition-all ${
                    incident.severity === 'critical'
                      ? 'bg-red-50/80 border-red-200'
                      : 'bg-amber-50/80 border-amber-200'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className={`font-mono text-[10px] uppercase font-bold px-1.5 py-0.5 rounded ${
                            incident.severity === 'critical'
                              ? 'bg-red-600 text-white'
                              : 'bg-amber-500 text-white'
                          }`}
                        >
                          {incident.severity}
                        </span>
                        <span className="font-mono text-[10px] text-slate-500">
                          {incident.id}
                        </span>
                      </div>
                      <h4 className="font-bold text-slate-900 text-sm">
                        {incident.title}
                      </h4>
                    </div>

                    <button
                      onClick={() => onSelectBuilding(incident.buildingId)}
                      title="Focus on 3D building"
                      className="text-sky-600 hover:text-sky-800 p-1 rounded-lg hover:bg-sky-50 transition-colors"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>

                  <p className="text-slate-600 leading-relaxed text-[11px]">
                    {incident.description}
                  </p>

                  <div className="pt-2 border-t border-slate-200/70 flex items-center justify-between text-[11px] text-slate-500">
                    <div>
                      <span className="font-medium text-slate-700">{incident.buildingName}</span>
                      <span className="block text-[10px] text-slate-400">{incident.floorZone}</span>
                    </div>

                    <button
                      onClick={() => onResolveIncident(incident.id)}
                      className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition-colors flex items-center gap-1 shadow-xs"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Resolve</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </>
        )}

        {activeTab === 'stream' && (
          <div className="space-y-2">
            {events.map((evt) => (
              <div
                key={evt.id}
                className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 text-xs flex items-start gap-2.5"
              >
                <div className="mt-0.5">
                  {evt.severity === 'red' ? (
                    <AlertOctagon className="w-4 h-4 text-red-500" />
                  ) : evt.severity === 'amber' ? (
                    <AlertTriangle className="w-4 h-4 text-amber-500" />
                  ) : evt.severity === 'grey' ? (
                    <Clock className="w-4 h-4 text-slate-400" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono mb-0.5">
                    <span className="font-medium text-slate-700">{evt.buildingName}</span>
                    <span>{evt.timestamp}</span>
                  </div>
                  <p className="text-slate-700 text-[11px] leading-relaxed">
                    {evt.message}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'resolved' && (
          <>
            {resolvedIncidents.length === 0 ? (
              <div className="text-center py-12 text-slate-400 text-xs">
                <Clock className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p>No recently resolved incidents logged today.</p>
              </div>
            ) : (
              resolvedIncidents.map((incident) => (
                <div
                  key={incident.id}
                  className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 text-xs space-y-1.5 opacity-80"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-800">{incident.title}</span>
                    <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
                      Resolved
                    </span>
                  </div>
                  <p className="text-slate-500 text-[11px]">{incident.description}</p>
                  <p className="text-[10px] text-slate-400">{incident.buildingName} • {incident.floorZone}</p>
                </div>
              ))
            )}
          </>
        )}
      </div>
    </div>
  );
};
