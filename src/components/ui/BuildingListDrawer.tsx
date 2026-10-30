import React, { useState } from 'react';
import { 
  X, 
  Search, 
  Building2, 
  CheckCircle2, 
  AlertTriangle, 
  AlertOctagon, 
  HelpCircle,
  ArrowRight,
  Filter
} from 'lucide-react';
import { Building, HealthStatus } from '../../types';

interface BuildingListDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  buildings: Building[];
  selectedBuildingId: string | null;
  onSelectBuilding: (buildingId: string) => void;
}

const STATUS_ICONS: Record<HealthStatus, any> = {
  green: CheckCircle2,
  amber: AlertTriangle,
  red: AlertOctagon,
  grey: HelpCircle
};

const STATUS_COLORS: Record<HealthStatus, { badge: string; text: string }> = {
  green: { badge: 'bg-emerald-100 text-emerald-800', text: 'text-emerald-600' },
  amber: { badge: 'bg-amber-100 text-amber-800', text: 'text-amber-600' },
  red: { badge: 'bg-red-100 text-red-800', text: 'text-red-600' },
  grey: { badge: 'bg-slate-100 text-slate-700', text: 'text-slate-500' }
};

export const BuildingListDrawer: React.FC<BuildingListDrawerProps> = ({
  isOpen,
  onClose,
  buildings,
  selectedBuildingId,
  onSelectBuilding
}) => {
  if (!isOpen) return null;

  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const filteredBuildings = buildings.filter((b) => {
    const matchesSearch =
      b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.departments.some((d) => d.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = categoryFilter === 'all' || b.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="fixed inset-y-0 left-0 w-full sm:w-[420px] bg-white/98 backdrop-blur-xl border-r border-slate-200 shadow-2xl z-40 flex flex-col transition-transform duration-300 select-none">
      {/* Drawer Header */}
      <div className="p-5 border-b border-slate-200/80 flex items-center justify-between bg-slate-50/60">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900 leading-none">
              Campus Building Directory
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              SRM Easwari Engineering College ({buildings.length} verified zones)
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

      {/* Search and Filters */}
      <div className="p-4 border-b border-slate-200/80 space-y-3 bg-slate-50/40">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by building, department, code..."
            className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500 shadow-2xs"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-[11px]">
          {['all', 'academic', 'management', 'hostel', 'library', 'sports', 'utility'].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-2.5 py-1 rounded-lg capitalize whitespace-nowrap transition-colors ${
                categoryFilter === cat
                  ? 'bg-slate-900 text-white font-semibold'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Building List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
        {filteredBuildings.length === 0 ? (
          <div className="text-center py-12 text-slate-400 text-xs">
            <Building2 className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>No buildings match your filter criteria.</p>
          </div>
        ) : (
          filteredBuildings.map((building) => {
            const StatusIcon = STATUS_ICONS[building.healthStatus];
            const statusStyle = STATUS_COLORS[building.healthStatus];
            const isSelected = selectedBuildingId === building.id;

            return (
              <div
                key={building.id}
                onClick={() => onSelectBuilding(building.id)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 text-xs ${
                  isSelected
                    ? 'bg-sky-50/80 border-sky-400 ring-2 ring-sky-300/40 shadow-xs'
                    : 'bg-white hover:bg-slate-50 border-slate-200/90 hover:border-slate-300'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`mt-0.5 ${statusStyle.text}`}>
                    <StatusIcon className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-[10px] font-bold px-1.5 py-0.2 rounded bg-slate-100 text-slate-700">
                        {building.id}
                      </span>
                      <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-semibold capitalize ${statusStyle.badge}`}>
                        {building.healthStatus}
                      </span>
                    </div>
                    <h4 className="font-bold text-slate-900 leading-snug">
                      {building.name}
                    </h4>
                    <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">
                      {building.departments[0]}
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-[11px] font-mono text-slate-500 block">
                    {building.currentOccupancy} Occ.
                  </span>
                  <span className="text-[10px] text-sky-600 font-medium hover:underline inline-flex items-center gap-0.5 mt-1">
                    <span>View 3D</span>
                    <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
