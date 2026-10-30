import React from 'react';
import { 
  ShieldAlert, 
  PlusCircle, 
  ListFilter, 
  RotateCw, 
  Activity, 
  MapPin, 
  Layers,
  Sparkles,
  Radio,
  Menu
} from 'lucide-react';
import { HealthStatus } from '../../types';

interface HeaderProps {
  campusHealthScore: number;
  overallStatus: HealthStatus;
  activeIncidentsCount: number;
  onOpenReportModal: () => void;
  onToggleEventStream: () => void;
  isEventStreamOpen: boolean;
  onToggleBuildingList: () => void;
  isBuildingListOpen: boolean;
  onResetCamera: () => void;
  onTriggerQuickDemo: () => void;
  onOpenNavigation?: () => void;
  // Device Intelligence Props
  isDeviceIntelligenceEnabled?: boolean;
  detectedDevicesCount?: number;
  onOpenDeviceIntelligenceDrawer?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  campusHealthScore,
  overallStatus,
  activeIncidentsCount,
  onOpenReportModal,
  onToggleEventStream,
  isEventStreamOpen,
  onToggleBuildingList,
  isBuildingListOpen,
  onResetCamera,
  onTriggerQuickDemo,
  onOpenNavigation,
  isDeviceIntelligenceEnabled = false,
  detectedDevicesCount = 0,
  onOpenDeviceIntelligenceDrawer
}) => {
  return (
    <header className="h-16 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-3 md:px-6 flex items-center justify-between relative z-50 shadow-xs select-none">
      {/* Brand & Campus Title with 3-Line Hamburger Menu */}
      <div className="flex items-center gap-2 md:gap-3">
        {onOpenNavigation && (
          <button
            onClick={onOpenNavigation}
            title="Open CampusPulse Operations Menu (5 Core Modules + Mobile Signals)"
            className="p-2 rounded-xl text-slate-700 hover:text-slate-900 hover:bg-slate-100 active:scale-95 transition-all border border-slate-200/80 shadow-2xs group"
          >
            <Menu className="w-5 h-5 text-slate-700 group-hover:text-sky-600 transition-colors" />
            <span className="sr-only">Open Menu</span>
          </button>
        )}

        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 to-cyan-500 flex items-center justify-center text-white shadow-md shadow-sky-500/20">
          <Activity className="w-5 h-5 animate-pulse" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-base md:text-lg font-bold text-slate-900 tracking-tight leading-none">
              CampusPulse OS
            </h1>
            <span className="text-[10px] uppercase font-mono font-bold tracking-wider px-2 py-0.5 rounded-full bg-sky-50 text-sky-700 border border-sky-200/60 hidden sm:inline-block">
              3D Digital Twin
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
            <MapPin className="w-3.5 h-3.5 text-sky-600" />
            <span className="font-medium">SRM Easwari Engineering College</span>
            <span className="text-slate-300">•</span>
            <span className="text-slate-400 hidden sm:inline">Ramapuram, Chennai</span>
          </div>
        </div>
      </div>

      {/* Center Operational Health Badge */}
      <div className="hidden lg:flex items-center gap-4 bg-slate-50 border border-slate-200/90 rounded-full py-1.5 px-4 shadow-2xs">
        <div className="flex items-center gap-2">
          <span className="relative flex h-3 w-3">
            {overallStatus === 'red' && (
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            )}
            {overallStatus === 'amber' && (
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
            )}
            <span
              className={`relative inline-flex rounded-full h-3 w-3 ${
                overallStatus === 'red'
                  ? 'bg-red-500'
                  : overallStatus === 'amber'
                  ? 'bg-amber-500'
                  : 'bg-emerald-500'
              }`}
            ></span>
          </span>
          <span className="text-xs font-semibold text-slate-700">
            System Status: {overallStatus === 'red' ? 'Critical Attention' : overallStatus === 'amber' ? 'Caution Flagged' : 'All Nominal'}
          </span>
        </div>

        <div className="h-4 w-px bg-slate-200"></div>

        <div className="flex items-center gap-1.5">
          <span className="text-xs text-slate-500">Health Index:</span>
          <span className="text-xs font-mono font-bold text-slate-800">
            {campusHealthScore}%
          </span>
        </div>

        <div className="h-4 w-px bg-slate-200"></div>

        <div className="flex items-center gap-1.5">
          <span className="text-xs text-slate-500">Active Incidents:</span>
          <span
            className={`text-xs font-mono font-bold px-1.5 py-0.2 rounded-full ${
              activeIncidentsCount > 0 ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'
            }`}
          >
            {activeIncidentsCount}
          </span>
        </div>
      </div>

      {/* Action Controls */}
      <div className="flex items-center gap-2">
        {/* Live Device Intelligence Button */}
        {onOpenDeviceIntelligenceDrawer && (
          <button
            onClick={onOpenDeviceIntelligenceDrawer}
            title="Live Mobile Device Intelligence & BLE Scanner"
            className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg border transition-all ${
              isDeviceIntelligenceEnabled
                ? 'bg-slate-950 text-white border-red-500 shadow-md ring-2 ring-red-500/20'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <Radio className={`w-3.5 h-3.5 ${isDeviceIntelligenceEnabled ? 'text-red-500 animate-pulse' : 'text-slate-500'}`} />
            <span className="hidden md:inline">Device Intelligence</span>
            {isDeviceIntelligenceEnabled && (
              <span className="font-mono text-[10px] px-1.5 py-0.2 rounded-full bg-red-600 text-white font-bold">
                {detectedDevicesCount}
              </span>
            )}
          </button>
        )}

        {/* Quick Demo Simulation Trigger */}
        <button
          onClick={onTriggerQuickDemo}
          title="Simulate Incident Lifecycle in 3D"
          className="hidden md:flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100 transition-colors"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          <span>Simulate Incident</span>
        </button>

        {/* Directory Toggle */}
        <button
          onClick={onToggleBuildingList}
          className={`flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-lg border transition-colors ${
            isBuildingListOpen
              ? 'bg-slate-900 text-white border-slate-900'
              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Layers className="w-3.5 h-3.5 text-slate-500" />
          <span className="hidden sm:inline">Directory</span>
        </button>

        {/* Event Stream & Incident Log */}
        <button
          onClick={onToggleEventStream}
          className={`flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-lg border transition-colors relative ${
            isEventStreamOpen
              ? 'bg-slate-900 text-white border-slate-900'
              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
          }`}
        >
          <ShieldAlert className="w-3.5 h-3.5 text-slate-500" />
          <span className="hidden sm:inline">Incidents</span>
          {activeIncidentsCount > 0 && (
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
          )}
        </button>

        {/* Primary Report Incident Button */}
        <button
          onClick={onOpenReportModal}
          className="flex items-center gap-1.5 text-xs font-semibold px-3.5 py-2 rounded-lg bg-sky-600 hover:bg-sky-700 text-white shadow-xs transition-all active:scale-95"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          <span>Report Incident</span>
        </button>
      </div>
    </header>
  );
};
