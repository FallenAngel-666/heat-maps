import React from 'react';
import { HealthStatus, Building } from '../../types';
import { CheckCircle2, AlertTriangle, AlertOctagon, HelpCircle, Zap, Users, ShieldCheck } from 'lucide-react';

interface HealthMetricsBarProps {
  buildings: Building[];
  selectedFilter: HealthStatus | 'all';
  onSelectFilter: (filter: HealthStatus | 'all') => void;
}

export const HealthMetricsBar: React.FC<HealthMetricsBarProps> = ({
  buildings,
  selectedFilter,
  onSelectFilter
}) => {
  const counts = {
    all: buildings.length,
    green: buildings.filter((b) => b.healthStatus === 'green').length,
    amber: buildings.filter((b) => b.healthStatus === 'amber').length,
    red: buildings.filter((b) => b.healthStatus === 'red').length,
    grey: buildings.filter((b) => b.healthStatus === 'grey').length
  };

  const totalOccupancy = buildings.reduce((acc, b) => acc + b.currentOccupancy, 0);
  const totalPower = buildings.reduce((acc, b) => acc + b.metrics.powerKw, 0).toFixed(1);

  return (
    <div className="bg-white/80 backdrop-blur-md border-b border-slate-200/70 px-4 md:px-6 py-2 flex flex-wrap items-center justify-between gap-3 text-xs select-none">
      {/* RAG Health Status Segmented Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
        <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mr-1">
          Campus Health:
        </span>

        {/* All Buildings */}
        <button
          onClick={() => onSelectFilter('all')}
          className={`px-2.5 py-1 rounded-full font-medium transition-all flex items-center gap-1.5 ${
            selectedFilter === 'all'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          <span>All Buildings</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-700/20 font-mono">
            {counts.all}
          </span>
        </button>

        {/* Green: Normal */}
        <button
          onClick={() => onSelectFilter('green')}
          className={`px-2.5 py-1 rounded-full font-medium transition-all flex items-center gap-1.5 ${
            selectedFilter === 'green'
              ? 'bg-emerald-600 text-white shadow-xs ring-2 ring-emerald-400/40'
              : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200/60'
          }`}
        >
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
          <span>Normal</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-emerald-700/10 font-mono font-bold">
            {counts.green}
          </span>
        </button>

        {/* Amber: Attention Required */}
        <button
          onClick={() => onSelectFilter('amber')}
          className={`px-2.5 py-1 rounded-full font-medium transition-all flex items-center gap-1.5 ${
            selectedFilter === 'amber'
              ? 'bg-amber-600 text-white shadow-xs ring-2 ring-amber-400/40'
              : 'bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200/60'
          }`}
        >
          <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
          <span>Attention</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-amber-700/10 font-mono font-bold">
            {counts.amber}
          </span>
        </button>

        {/* Red: Critical */}
        <button
          onClick={() => onSelectFilter('red')}
          className={`px-2.5 py-1 rounded-full font-medium transition-all flex items-center gap-1.5 ${
            selectedFilter === 'red'
              ? 'bg-red-600 text-white shadow-xs ring-2 ring-red-400/40'
              : 'bg-red-50 text-red-700 hover:bg-red-100 border border-red-200/60'
          }`}
        >
          <AlertOctagon className="w-3.5 h-3.5 text-red-500" />
          <span>Critical</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-red-700/10 font-mono font-bold">
            {counts.red}
          </span>
        </button>

        {/* Grey: No Data */}
        <button
          onClick={() => onSelectFilter('grey')}
          className={`px-2.5 py-1 rounded-full font-medium transition-all flex items-center gap-1.5 ${
            selectedFilter === 'grey'
              ? 'bg-slate-600 text-white shadow-xs ring-2 ring-slate-400/40'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200/80'
          }`}
        >
          <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
          <span>No Data</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-700/10 font-mono">
            {counts.grey}
          </span>
        </button>
      </div>

      {/* Campus Telemetry Snapshot (Occupancy & Power) */}
      <div className="hidden sm:flex items-center gap-4 text-slate-500">
        <div className="flex items-center gap-1.5">
          <Users className="w-3.5 h-3.5 text-sky-600" />
          <span>On-Campus:</span>
          <span className="font-mono font-semibold text-slate-800">
            {totalOccupancy.toLocaleString()}
          </span>
        </div>

        <div className="h-3 w-px bg-slate-200"></div>

        <div className="flex items-center gap-1.5">
          <Zap className="w-3.5 h-3.5 text-amber-500" />
          <span>Total Grid:</span>
          <span className="font-mono font-semibold text-slate-800">
            {totalPower} kW
          </span>
        </div>

        <div className="h-3 w-px bg-slate-200"></div>

        <div className="flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Security Zones:</span>
          <span className="font-mono font-semibold text-slate-800">
            10 / 10 Active
          </span>
        </div>
      </div>
    </div>
  );
};
