import React from 'react';
import { 
  X, 
  MapPin, 
  AlertTriangle, 
  AlertOctagon, 
  CheckCircle2, 
  HelpCircle, 
  Zap, 
  Thermometer, 
  Wifi, 
  Droplet, 
  Wind, 
  Flame, 
  Building2, 
  Users, 
  Calendar, 
  PhoneCall, 
  ShieldAlert, 
  PlusCircle,
  Check
} from 'lucide-react';
import { Building, Incident, HealthStatus } from '../../types';

interface BuildingDetailDrawerProps {
  building: Building | null;
  onClose: () => void;
  incidents: Incident[];
  onReportIncidentForBuilding: (buildingId: string) => void;
  onResolveIncident: (incidentId: string) => void;
  onFocusBuilding: (buildingId: string) => void;
}

const HEALTH_CONFIG: Record<HealthStatus, { bg: string; text: string; border: string; icon: any; title: string }> = {
  green: {
    bg: 'bg-emerald-50 text-emerald-800',
    text: 'text-emerald-700',
    border: 'border-emerald-200',
    icon: CheckCircle2,
    title: 'Normal Operational Health'
  },
  amber: {
    bg: 'bg-amber-50 text-amber-800',
    text: 'text-amber-700',
    border: 'border-amber-200',
    icon: AlertTriangle,
    title: 'Attention Required'
  },
  red: {
    bg: 'bg-red-50 text-red-800',
    text: 'text-red-700',
    border: 'border-red-200',
    icon: AlertOctagon,
    title: 'Critical Alert Active'
  },
  grey: {
    bg: 'bg-slate-100 text-slate-800',
    text: 'text-slate-600',
    border: 'border-slate-200',
    icon: HelpCircle,
    title: 'Unmonitored / Sensor Offline'
  }
};

export const BuildingDetailDrawer: React.FC<BuildingDetailDrawerProps> = ({
  building,
  onClose,
  incidents,
  onReportIncidentForBuilding,
  onResolveIncident,
  onFocusBuilding
}) => {
  if (!building) return null;

  const healthCfg = HEALTH_CONFIG[building.healthStatus];
  const HealthIcon = healthCfg.icon;
  const buildingIncidents = incidents.filter(
    (inc) => inc.buildingId === building.id && inc.status !== 'resolved'
  );

  const occupancyRate = Math.round((building.currentOccupancy / building.capacity) * 100);

  return (
    <div className="fixed inset-y-0 right-0 w-full sm:w-[440px] bg-white/98 backdrop-blur-xl border-l border-slate-200 shadow-2xl z-50 flex flex-col transition-transform duration-300 select-none">
      {/* Top Header */}
      <div className="p-5 border-b border-slate-200/80 flex items-start justify-between gap-3 bg-slate-50/50">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-sky-100 text-sky-800">
              {building.id}
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs uppercase font-semibold tracking-wider text-slate-500">
              {building.category}
            </span>
          </div>
          <h2 className="text-lg font-bold text-slate-900 leading-tight">
            {building.name}
          </h2>
        </div>

        <button
          onClick={onClose}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/70 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Scrollable Content Body */}
      <div className="flex-1 overflow-y-auto p-5 space-y-6">
        {/* Health Status Banner */}
        <div className={`p-4 rounded-xl border flex items-center justify-between gap-3 ${healthCfg.bg} ${healthCfg.border}`}>
          <div className="flex items-center gap-3">
            <HealthIcon className="w-5 h-5 shrink-0" />
            <div>
              <p className="font-semibold text-xs">{healthCfg.title}</p>
              <p className="text-[11px] opacity-85 mt-0.5">
                {building.healthStatus === 'red'
                  ? 'Urgent emergency or facility breach reported. Action needed.'
                  : building.healthStatus === 'amber'
                  ? 'Telemetry threshold exceeded or open ticket pending review.'
                  : building.healthStatus === 'grey'
                  ? 'Sensors uncalibrated or scheduled civil maintenance in progress.'
                  : 'All structural, electrical, and HVAC subsystems nominal.'}
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2.5">
          <button
            onClick={() => onReportIncidentForBuilding(building.id)}
            className="flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-medium text-xs shadow-xs transition-colors"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Report Incident</span>
          </button>
          <button
            onClick={() => onFocusBuilding(building.id)}
            className="flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-xs transition-colors border border-slate-200"
          >
            <MapPin className="w-4 h-4 text-sky-600" />
            <span>Focus Camera</span>
          </button>
        </div>

        {/* Active Incidents Section */}
        {buildingIncidents.length > 0 && (
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-amber-500" />
                <span>Active Incidents ({buildingIncidents.length})</span>
              </h3>
            </div>

            <div className="space-y-2">
              {buildingIncidents.map((incident) => (
                <div
                  key={incident.id}
                  className={`p-3 rounded-xl border text-xs space-y-2 ${
                    incident.severity === 'critical'
                      ? 'bg-red-50/70 border-red-200 text-red-900'
                      : 'bg-amber-50/70 border-amber-200 text-amber-900'
                  }`}
                >
                  <div className="flex items-center justify-between font-semibold">
                    <span>{incident.title}</span>
                    <span className="font-mono text-[10px] px-1.5 py-0.5 rounded uppercase font-bold bg-white/80">
                      {incident.category}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    {incident.description}
                  </p>
                  <div className="flex items-center justify-between pt-1 border-t border-slate-200/60 text-[10px] text-slate-500">
                    <span>Zone: {incident.floorZone}</span>
                    <button
                      onClick={() => onResolveIncident(incident.id)}
                      className="px-2 py-1 rounded bg-white hover:bg-slate-50 border border-slate-200 font-semibold text-emerald-700 hover:text-emerald-800 transition-colors flex items-center gap-1 shadow-2xs"
                    >
                      <Check className="w-3 h-3 text-emerald-600" />
                      <span>Mark Resolved</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Live Facility Telemetry */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            Live Telemetry & Sensors
          </h3>
          <div className="grid grid-cols-2 gap-2.5">
            {/* Power */}
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
              <div className="flex items-center gap-1.5 text-slate-500 mb-1">
                <Zap className="w-3.5 h-3.5 text-amber-500" />
                <span className="text-[11px]">Power Load</span>
              </div>
              <p className="text-base font-bold font-mono text-slate-800">
                {building.metrics.powerKw} <span className="text-xs font-normal text-slate-500">kW</span>
              </p>
            </div>

            {/* Ambient Temp */}
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
              <div className="flex items-center gap-1.5 text-slate-500 mb-1">
                <Thermometer className="w-3.5 h-3.5 text-rose-500" />
                <span className="text-[11px]">Ambient Temp</span>
              </div>
              <p className="text-base font-bold font-mono text-slate-800">
                {building.metrics.tempCelsius} <span className="text-xs font-normal text-slate-500">°C</span>
              </p>
            </div>

            {/* Wi-Fi Clients */}
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
              <div className="flex items-center gap-1.5 text-slate-500 mb-1">
                <Wifi className="w-3.5 h-3.5 text-sky-500" />
                <span className="text-[11px]">Connected Wi-Fi</span>
              </div>
              <p className="text-base font-bold font-mono text-slate-800">
                {building.metrics.wifiConnections} <span className="text-xs font-normal text-slate-500">devices</span>
              </p>
            </div>

            {/* Fire Safety */}
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
              <div className="flex items-center gap-1.5 text-slate-500 mb-1">
                <Flame className="w-3.5 h-3.5 text-orange-500" />
                <span className="text-[11px]">Fire Readiness</span>
              </div>
              <p className="text-base font-bold font-mono text-slate-800">
                {building.metrics.fireSafetyReadinessPct} <span className="text-xs font-normal text-slate-500">%</span>
              </p>
            </div>

            {/* Air Quality */}
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
              <div className="flex items-center gap-1.5 text-slate-500 mb-1">
                <Wind className="w-3.5 h-3.5 text-emerald-500" />
                <span className="text-[11px]">Air Quality</span>
              </div>
              <p className="text-base font-bold font-mono text-slate-800">
                {building.metrics.airQualityAqi} <span className="text-xs font-normal text-slate-500">AQI</span>
              </p>
            </div>

            {/* Water Pressure */}
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
              <div className="flex items-center gap-1.5 text-slate-500 mb-1">
                <Droplet className="w-3.5 h-3.5 text-cyan-500" />
                <span className="text-[11px]">Water Pressure</span>
              </div>
              <p className="text-base font-bold font-mono text-slate-800">
                {building.metrics.waterPressurePsi} <span className="text-xs font-normal text-slate-500">PSI</span>
              </p>
            </div>
          </div>
        </div>

        {/* Occupancy & Capacity Meter */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-700 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-sky-600" />
              <span>Occupancy Status</span>
            </span>
            <span className="font-mono font-bold text-slate-800">
              {building.currentOccupancy} / {building.capacity} ({occupancyRate}%)
            </span>
          </div>
          <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${
                occupancyRate > 90
                  ? 'bg-rose-500'
                  : occupancyRate > 75
                  ? 'bg-amber-500'
                  : 'bg-emerald-500'
              }`}
              style={{ width: `${Math.min(occupancyRate, 100)}%` }}
            ></div>
          </div>
        </div>

        {/* Departments & Programs */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            Departments & Facilities
          </h3>
          <ul className="space-y-1.5">
            {building.departments.map((dept, idx) => (
              <li
                key={idx}
                className="text-xs text-slate-700 bg-slate-50 p-2 rounded-lg border border-slate-200/60 flex items-center gap-2"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-sky-500 shrink-0"></div>
                <span>{dept}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Physical Structure Specs */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2.5 text-xs">
          <h3 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
            Architectural Specs
          </h3>
          <div className="grid grid-cols-2 gap-y-2 text-slate-600">
            <div>
              <span className="text-slate-400 block text-[10px]">Floors</span>
              <span className="font-semibold text-slate-800">{building.floors} Levels (G + {building.floors - 1})</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">Total Built-up Area</span>
              <span className="font-semibold text-slate-800">{building.areaSqFt.toLocaleString()} sq.ft</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">Commissioned Year</span>
              <span className="font-semibold text-slate-800">{building.builtYear}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">Structure Class</span>
              <span className="font-semibold text-slate-800">RCC Tier-1 Earthquake Resistant</span>
            </div>
          </div>
        </div>

        {/* Emergency Contacts */}
        {building.keyContacts && building.keyContacts.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Building Officers & Facility Contacts
            </h3>
            <div className="space-y-2">
              {building.keyContacts.map((contact, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/70 flex items-center justify-between text-xs"
                >
                  <div>
                    <p className="font-semibold text-slate-800">{contact.name}</p>
                    <p className="text-[11px] text-slate-500">{contact.role}</p>
                  </div>
                  <a
                    href={`tel:${contact.phone}`}
                    className="flex items-center gap-1 text-[11px] font-mono font-medium text-sky-600 hover:underline"
                  >
                    <PhoneCall className="w-3 h-3" />
                    <span>{contact.phone}</span>
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
