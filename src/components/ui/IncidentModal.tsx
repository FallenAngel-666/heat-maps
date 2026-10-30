import React, { useState } from 'react';
import { 
  X, 
  AlertTriangle, 
  AlertOctagon, 
  CheckCircle2, 
  ShieldAlert, 
  Building2, 
  Layers, 
  FileText, 
  User, 
  Send 
} from 'lucide-react';
import { Building, HealthStatus } from '../../types';

interface IncidentModalProps {
  isOpen: boolean;
  onClose: () => void;
  buildings: Building[];
  initialBuildingId: string | null;
  onSubmitIncident: (incidentData: {
    buildingId: string;
    floorZone: string;
    title: string;
    description: string;
    severity: 'critical' | 'attention' | 'normal';
    category: 'Electrical' | 'Fire/Safety' | 'Water/Plumbing' | 'Network/IT' | 'HVAC' | 'Structural';
    reportedBy: string;
  }) => void;
}

export const IncidentModal: React.FC<IncidentModalProps> = ({
  isOpen,
  onClose,
  buildings,
  initialBuildingId,
  onSubmitIncident
}) => {
  if (!isOpen) return null;

  const [buildingId, setBuildingId] = useState<string>(
    initialBuildingId || buildings[0]?.id || ''
  );
  const [floorZone, setFloorZone] = useState('Floor 2 - Central Wing');
  const [severity, setSeverity] = useState<'critical' | 'attention' | 'normal'>('critical');
  const [category, setCategory] = useState<'Electrical' | 'Fire/Safety' | 'Water/Plumbing' | 'Network/IT' | 'HVAC' | 'Structural'>('Electrical');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [reportedBy, setReportedBy] = useState('Campus Security Officer');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSubmitIncident({
      buildingId,
      floorZone,
      title,
      description: description || `Reported ${severity} severity ${category} incident in ${floorZone}. Emergency protocols active.`,
      severity,
      category,
      reportedBy
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 select-none">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-200/80 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-red-100 text-red-600 flex items-center justify-center">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">
                Report Campus Incident
              </h3>
              <p className="text-xs text-slate-500">
                Trigger real-time 3D twin color synchronization & team alert
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          {/* Target Building Selector */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-sky-600" />
              <span>Target Building</span>
            </label>
            <select
              value={buildingId}
              onChange={(e) => setBuildingId(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              {buildings.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name} ({b.id})
                </option>
              ))}
            </select>
          </div>

          {/* Floor & Category */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-sky-600" />
                <span>Floor / Zone</span>
              </label>
              <input
                type="text"
                value={floorZone}
                onChange={(e) => setFloorZone(e.target.value)}
                placeholder="e.g. Floor 3, Lab 302"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500"
              >
                <option value="Electrical">Electrical</option>
                <option value="Fire/Safety">Fire / Safety</option>
                <option value="HVAC">HVAC / Cooling</option>
                <option value="Water/Plumbing">Water / Plumbing</option>
                <option value="Network/IT">Network / IT Infrastructure</option>
                <option value="Structural">Structural / Civil</option>
              </select>
            </div>
          </div>

          {/* Severity Selector (Updates 3D building color) */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1.5">
              Severity Level (Automatically updates 3D model color)
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              {/* Critical - Red */}
              <button
                type="button"
                onClick={() => setSeverity('critical')}
                className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all ${
                  severity === 'critical'
                    ? 'bg-red-500 text-white border-red-600 ring-2 ring-red-400/50 shadow-md'
                    : 'bg-red-50 text-red-800 border-red-200 hover:bg-red-100'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-xs">Critical</span>
                  <AlertOctagon className="w-4 h-4" />
                </div>
                <span className="text-[10px] opacity-90 font-medium">Turns 3D to Red</span>
              </button>

              {/* Attention - Amber */}
              <button
                type="button"
                onClick={() => setSeverity('attention')}
                className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all ${
                  severity === 'attention'
                    ? 'bg-amber-500 text-white border-amber-600 ring-2 ring-amber-400/50 shadow-md'
                    : 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-xs">Attention</span>
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <span className="text-[10px] opacity-90 font-medium">Turns 3D to Amber</span>
              </button>

              {/* Normal - Green */}
              <button
                type="button"
                onClick={() => setSeverity('normal')}
                className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all ${
                  severity === 'normal'
                    ? 'bg-emerald-600 text-white border-emerald-700 ring-2 ring-emerald-400/50 shadow-md'
                    : 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-xs">Normal / Info</span>
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <span className="text-[10px] opacity-90 font-medium">Turns 3D to Green</span>
              </button>
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-sky-600" />
              <span>Incident Headline</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Main Substation Voltage Spike Detected"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Description & Emergency Notes
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              placeholder="Specify situation details, equipment involved, and preliminary safety actions taken..."
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>

          {/* Reported By */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-sky-600" />
              <span>Reported By</span>
            </label>
            <input
              type="text"
              value={reportedBy}
              onChange={(e) => setReportedBy(e.target.value)}
              placeholder="e.g. Senior Electrician / Security Supervisor"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500"
              required
            />
          </div>

          {/* Form Actions */}
          <div className="pt-2 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-semibold flex items-center gap-1.5 shadow-sm active:scale-95 transition-all"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Broadcast & Update 3D Twin</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
