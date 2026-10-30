import React from 'react';
import { Radio, ChevronRight, Activity, ShieldAlert, Cpu } from 'lucide-react';
import { DeviceIntelligencePayload } from '../../types';

interface DeviceIntelligenceMapToggleProps {
  isEnabled: boolean;
  onToggle: () => void;
  onOpenDashboard: () => void;
  data: DeviceIntelligencePayload;
  isBackendConnected: boolean;
}

export const DeviceIntelligenceMapToggle: React.FC<DeviceIntelligenceMapToggleProps> = ({
  isEnabled,
  onToggle,
  onOpenDashboard,
  data,
  isBackendConnected
}) => {
  const isLive = data.mode === 'live';
  const isActive = data.scanner_status === 'active' && isBackendConnected;
  const count = data.detected_devices;

  return (
    <div className="absolute top-4 left-4 z-30 flex flex-col gap-2 select-none pointer-events-auto">
      {/* Main Map Integration Card */}
      <div className={`p-2.5 rounded-2xl backdrop-blur-md border shadow-xl transition-all duration-300 flex items-center gap-3 ${
        isEnabled
          ? 'bg-slate-950/92 border-red-500/70 text-white ring-2 ring-red-500/20'
          : 'bg-white/90 border-slate-200/90 text-slate-800'
      }`}>
        {/* Radar Icon / Indicator */}
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
          isEnabled
            ? 'bg-red-500/20 text-red-400 border border-red-500/40'
            : 'bg-slate-100 text-slate-500 border border-slate-200'
        }`}>
          <Radio className={`w-5 h-5 ${isEnabled && isActive ? 'animate-pulse text-red-500' : ''}`} />
        </div>

        {/* Title & Live Status */}
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold tracking-tight">
              Live Device Intelligence
            </span>
            {isEnabled && (
              <span className={`text-[9px] font-mono font-bold uppercase px-1.5 py-0.2 rounded-full border ${
                isActive
                  ? 'bg-emerald-950/80 text-emerald-400 border-emerald-700/60'
                  : 'bg-amber-950/80 text-amber-400 border-amber-700/60'
              }`}>
                {isActive ? 'ACTIVE' : 'STARTING'}
              </span>
            )}
          </div>

          <div className="text-[11px] flex items-center gap-1.5 mt-0.5">
            {isEnabled ? (
              <>
                <span className="text-red-400 font-mono font-extrabold text-xs">
                  {count} BLE {count === 1 ? 'Device' : 'Devices'}
                </span>
                <span className="text-slate-500">•</span>
                <span className={`capitalize font-semibold text-[10px] px-1.5 py-0.2 rounded ${
                  data.density_status === 'congested' ? 'bg-red-900/60 text-red-300' :
                  data.density_status === 'high' ? 'bg-red-900/40 text-red-300' :
                  data.density_status === 'medium' ? 'bg-amber-900/40 text-amber-300' :
                  'bg-emerald-900/40 text-emerald-300'
                }`}>
                  {data.density_status} Density
                </span>
              </>
            ) : (
              <span className="text-slate-400">Anonymous BLE Scanner (Disabled)</span>
            )}
          </div>
        </div>

        {/* ON / OFF Switch */}
        <div className="flex items-center gap-2 pl-1 border-l border-slate-200/40 dark:border-slate-800">
          <button
            onClick={onToggle}
            role="switch"
            aria-checked={isEnabled}
            title={isEnabled ? 'Turn OFF Live Device Intelligence' : 'Turn ON Live Device Intelligence'}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
              isEnabled ? 'bg-red-600' : 'bg-slate-300 hover:bg-slate-400'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-md transition-transform ${
                isEnabled ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        {/* Open Details Dashboard Arrow */}
        {isEnabled && (
          <button
            onClick={onOpenDashboard}
            title="Open Anonymous Device Density Intelligence Panel"
            className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/60 transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Mode Badge Sub-strip when Enabled */}
      {isEnabled && (
        <div className="flex items-center gap-2 px-3 py-1 rounded-xl bg-slate-950/80 backdrop-blur-md border border-slate-800 text-[10px] shadow-md w-fit">
          <span className="flex items-center gap-1 text-slate-300 font-semibold">
            {isLive ? (
              <>
                <Cpu className="w-3 h-3 text-red-400" />
                <span>Laptop BLE Adapter</span>
              </>
            ) : (
              <>
                <Activity className="w-3 h-3 text-amber-400" />
                <span>Hackathon Demo (5 Zones)</span>
              </>
            )}
          </span>
          <span className="text-slate-600">•</span>
          <button
            onClick={onOpenDashboard}
            className="text-sky-400 hover:text-sky-300 underline font-medium"
          >
            Density Intelligence Panel →
          </button>
        </div>
      )}
    </div>
  );
};
