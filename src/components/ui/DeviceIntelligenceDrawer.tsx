import React, { useState, useEffect } from 'react';
import { 
  Radio, 
  X, 
  ShieldCheck, 
  AlertTriangle, 
  RefreshCw, 
  Cpu, 
  MapPin, 
  Wifi, 
  Info, 
  Sliders, 
  CheckCircle2, 
  AlertOctagon,
  Activity,
  Flame,
  ArrowRight,
  Terminal,
  Smartphone
} from 'lucide-react';
import { 
  DeviceIntelligencePayload, 
  ScannerMode, 
  SensorZoneData 
} from '../../types';
import { BleTerminalConsole } from './BleTerminalConsole';

interface DeviceIntelligenceDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  data: DeviceIntelligencePayload;
  isBackendConnected: boolean;
  isSwitchingMode: boolean;
  onSetMode: (mode: ScannerMode) => void;
  onTriggerRescan: () => void;
  onFocusZone?: (zone: SensorZoneData) => void;
  initialTab?: 'telemetry' | 'console';
}

export const DeviceIntelligenceDrawer: React.FC<DeviceIntelligenceDrawerProps> = ({
  isOpen,
  onClose,
  data,
  isBackendConnected,
  isSwitchingMode,
  onSetMode,
  onTriggerRescan,
  onFocusZone,
  initialTab = 'telemetry'
}) => {
  const [activeTab, setActiveTab] = useState<'telemetry' | 'console'>('telemetry');

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab, isOpen]);

  if (!isOpen) return null;

  const isLive = data.mode === 'live';
  const isActive = data.scanner_status === 'active' && isBackendConnected;
  const isStarting = data.scanner_status === 'starting';

  // Format last updated time
  const formatTime = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
    } catch {
      return 'Just now';
    }
  };

  return (
    <div className="fixed inset-y-0 right-0 w-full sm:w-[500px] bg-slate-950 text-slate-100 z-50 shadow-2xl border-l border-slate-800 flex flex-col font-sans select-none animate-in slide-in-from-right duration-300">
      {/* 1. Header with Dark Theme & Live Radar Badge */}
      <div className="p-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-500 shadow-inner">
            <Radio className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-white tracking-tight">
                Live Device Intelligence
              </h2>
              <span className={`text-[10px] font-mono uppercase font-bold px-2 py-0.5 rounded-full border ${
                isActive 
                  ? 'bg-emerald-950 text-emerald-400 border-emerald-800' 
                  : isStarting
                  ? 'bg-amber-950 text-amber-400 border-amber-800'
                  : 'bg-red-950 text-red-400 border-red-800'
              }`}>
                {isActive ? 'SCANNER ACTIVE' : isStarting ? 'STARTING' : 'OFFLINE'}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Real-time Anonymous Bluetooth Low Energy Detection
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* 2. Mode Toggle: Live BLE Hardware vs Demo Mode */}
      <div className="px-4 py-2.5 bg-slate-900/60 border-b border-slate-800/80">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <Sliders className="w-3.5 h-3.5 text-sky-400" />
            Operational Mode:
          </span>
          <span className="text-[11px] text-slate-400">
            {isSwitchingMode ? 'Updating mode...' : isLive ? 'Using Laptop BLE Adapter' : 'Multi-Zone Simulation'}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 p-1 bg-slate-950 rounded-xl border border-slate-800">
          {/* Live Scanner Button */}
          <button
            onClick={() => onSetMode('live')}
            disabled={isSwitchingMode}
            className={`py-2 px-3 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-2 ${
              isLive
                ? 'bg-red-600 text-white shadow-md shadow-red-900/40 ring-1 ring-red-400/50'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${isLive ? 'bg-white animate-ping' : 'bg-slate-600'}`}></span>
            <span>Live BLE Scanner</span>
          </button>

          {/* Hackathon Demo Mode Button */}
          <button
            onClick={() => onSetMode('demo')}
            disabled={isSwitchingMode}
            className={`py-2 px-3 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-2 ${
              !isLive
                ? 'bg-amber-600 text-white shadow-md shadow-amber-900/40 ring-1 ring-amber-400/50'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Hackathon Demo</span>
          </button>
        </div>

        {/* Clear Notice Banner for Hackathon Evaluation */}
        <div className={`mt-2 px-3 py-1.5 rounded-lg text-[11px] border flex items-center gap-2 ${
          isLive 
            ? 'bg-red-950/40 text-red-300 border-red-800/60'
            : 'bg-amber-950/40 text-amber-300 border-amber-800/60'
        }`}>
          <Info className="w-4 h-4 shrink-0" />
          <span>
            {isLive
              ? 'ACTIVE HARDWARE: Receiving raw signals from laptop Bluetooth adapter.'
              : 'DEMONSTRATION: Simulated multi-sensor network showing future campus deployment.'}
          </span>
        </div>
      </div>

      {/* 3. Tab Switcher: Telemetry Dashboard vs Live Terminal Console */}
      <div className="flex border-b border-slate-800 bg-slate-900/80 px-4">
        <button
          onClick={() => setActiveTab('telemetry')}
          className={`py-2 px-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 ${
            activeTab === 'telemetry'
              ? 'border-red-500 text-white'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Activity className="w-3.5 h-3.5 text-red-400" />
          <span>Telemetry & Density</span>
        </button>

        <button
          onClick={() => setActiveTab('console')}
          className={`py-2 px-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 relative ${
            activeTab === 'console'
              ? 'border-sky-500 text-white'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Terminal className="w-3.5 h-3.5 text-sky-400" />
          <span>Live Console Stream</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
        </button>
      </div>

      {/* 4. Tab Body Content */}
      {activeTab === 'console' ? (
        <div className="flex-1 overflow-hidden flex flex-col">
          <BleTerminalConsole
            logs={data.recent_logs || []}
            scannerStatus={data.scanner_status}
            mode={data.mode}
            isBackendConnected={isBackendConnected}
            totalDevices={data.detected_devices}
          />
        </div>
      ) : (
        /* Telemetry & Density Tab Content */
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Backend Connection Warning if Offline */}
          {!isBackendConnected && (
            <div className="p-3 bg-red-950/60 border border-red-800/80 rounded-xl text-xs space-y-1.5">
              <div className="flex items-center gap-2 text-red-400 font-bold">
                <AlertOctagon className="w-4 h-4 shrink-0" />
                <span>Bluetooth Scanner Backend Offline</span>
              </div>
              <p className="text-slate-300 leading-relaxed text-[11px]">
                The Python backend is not running at <code className="text-red-300 bg-red-900/30 px-1 py-0.5 rounded">http://127.0.0.1:8000</code>.
              </p>
              <div className="text-[11px] text-slate-400 bg-slate-900 p-2 rounded-lg font-mono flex items-center justify-between">
                <span>launch-live-ble-console.bat</span>
                <span className="text-slate-500 text-[10px]">(or start-backend.bat)</span>
              </div>
            </div>
          )}

          {/* PRIMARY KPI STATISTICS GRID */}
          <div className="grid grid-cols-2 gap-3">
            {/* Total Detectable Devices */}
            <div className="p-3.5 bg-slate-900 border border-slate-800 rounded-xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-16 h-16 bg-red-500/10 rounded-full blur-xl group-hover:bg-red-500/20 transition-all"></div>
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Total Detectable Devices
              </div>
              <div className="mt-1 flex items-baseline gap-1.5">
                <span className="text-3xl font-mono font-extrabold text-white tracking-tight">
                  {data.detected_devices}
                </span>
                <span className="text-xs text-red-400 font-medium">BLE Nodes</span>
              </div>
              <div className="mt-1 flex items-center gap-1 text-[11px] text-slate-500">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
                <span>In RF sensor range</span>
              </div>
            </div>

            {/* Detected in Last 60s Window */}
            <div className="p-3.5 bg-slate-900 border border-slate-800 rounded-xl">
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                60s Sliding Window
              </div>
              <div className="mt-1 flex items-baseline gap-1.5">
                <span className="text-3xl font-mono font-extrabold text-sky-400 tracking-tight">
                  {data.detected_devices}
                </span>
                <span className="text-xs text-slate-400">devices</span>
              </div>
              <div className="mt-1 text-[11px] text-slate-500">
                Expired after 60s inactivity
              </div>
            </div>

            {/* Active Sensors */}
            <div className="p-3.5 bg-slate-900 border border-slate-800 rounded-xl">
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Active Sensors
              </div>
              <div className="mt-1 flex items-baseline gap-1.5">
                <span className="text-2xl font-mono font-bold text-white">
                  {data.active_sensors_count}
                </span>
                <span className="text-xs text-slate-400">
                  {data.active_sensors_count === 1 ? 'Station' : 'Zones'}
                </span>
              </div>
              <div className="mt-1 text-[11px] text-slate-400 truncate">
                {isLive ? 'Laptop Built-in BLE' : '5 Campus Mesh Nodes'}
              </div>
            </div>

            {/* Scanner Status */}
            <div className="p-3.5 bg-slate-900 border border-slate-800 rounded-xl">
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Scanner Status
              </div>
              <div className="mt-1 flex items-center gap-2">
                <span className={`w-3 h-3 rounded-full ${
                  isActive ? 'bg-emerald-500 shadow-sm shadow-emerald-500' : 'bg-red-500'
                }`}></span>
                <span className="text-base font-bold text-white uppercase tracking-tight">
                  {data.scanner_status}
                </span>
              </div>
              <div className="mt-1 text-[11px] text-slate-400">
                Updated: {formatTime(data.last_updated)}
              </div>
            </div>
          </div>

          {/* Dedicated Info Panel: Anonymous Device Density Intelligence */}
          <div className="p-4 bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-xl shadow-inner space-y-2.5">
            <div className="flex items-center gap-2 text-white font-bold text-xs uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Anonymous Device Density Intelligence</span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/80">
              "Identifies detectable Bluetooth Low Energy devices within sensor range and estimates local device density. It does not identify individuals or confirm active mobile phone usage."
            </p>

            <div className="grid grid-cols-2 gap-2 pt-1 text-[11px] text-slate-400">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>Zero MAC address logging</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>1-Way cryptographic salt</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>Auto-purge after 60s</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>Compliant with privacy norms</span>
              </div>
            </div>
          </div>

          {/* Signal Strength & RF Telemetry Breakdown */}
          <div className="p-3.5 bg-slate-900 border border-slate-800 rounded-xl space-y-2.5">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
              <span className="flex items-center gap-1.5">
                <Wifi className="w-3.5 h-3.5 text-sky-400" />
                BLE Signal Distribution (RSSI)
              </span>
              <span className="font-mono text-slate-400 text-[11px]">
                Avg: {data.signals?.avg_rssi ?? -80} dBm
              </span>
            </div>

            <div className="space-y-1.5">
              {/* Strong */}
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-emerald-400 flex items-center gap-1">
                  <Smartphone className="w-3 h-3" />
                  Strong (&gt; -70 dBm / Nearby Phones)
                </span>
                <span className="font-mono font-bold text-white">{data.signals?.strong ?? 0}</span>
              </div>
              {/* Moderate */}
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-amber-400">Moderate (-70 to -85 dBm / Mid-range)</span>
                <span className="font-mono font-bold text-white">{data.signals?.moderate ?? 0}</span>
              </div>
              {/* Weak */}
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-400">Weak (&lt; -85 dBm / Boundary)</span>
                <span className="font-mono font-bold text-white">{data.signals?.weak ?? 0}</span>
              </div>
            </div>
          </div>

          {/* Active Sensor Zones List */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-300 px-1">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-red-400" />
                Active Detection Zones ({data.zones?.length ?? 1})
              </span>
              <span className="text-[11px] text-slate-500">Click to focus in 3D</span>
            </div>

            <div className="space-y-2">
              {(data.zones || [data.primary_sensor]).map((zone) => (
                <div
                  key={zone.zone_id}
                  onClick={() => onFocusZone?.(zone)}
                  className="p-3 bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-red-500/50 rounded-xl cursor-pointer transition-all group flex items-center justify-between"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                      <span className="text-xs font-bold text-white group-hover:text-red-400 transition-colors">
                        {zone.name}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      Building: <span className="text-slate-300 font-mono">{zone.building_id}</span> ? ~{Math.round(zone.coverage_radius)}m Radius
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-base font-mono font-extrabold text-white">
                      {zone.detected_devices}
                    </div>
                    <span className={`text-[9px] uppercase font-bold px-1.5 py-0.5 rounded ${
                      zone.density_status === 'congested' ? 'bg-red-950 text-red-400 border border-red-800' :
                      zone.density_status === 'high' ? 'bg-red-900/50 text-red-300' :
                      zone.density_status === 'medium' ? 'bg-amber-950 text-amber-400' :
                      'bg-emerald-950 text-emerald-400'
                    }`}>
                      {zone.density_status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Diagnostics & Adapter Re-scan Action */}
          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
            <div className="text-[11px] text-slate-500">
              Adapter: {isLive ? 'Windows 11 BLE Subsystem' : 'Simulation Engine'}
            </div>
            <button
              onClick={onTriggerRescan}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-xs font-medium text-slate-300 border border-slate-700/80 transition-colors active:scale-95"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Rescan Adapter</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
