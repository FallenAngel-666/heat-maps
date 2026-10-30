import React from 'react';
import { 
  RotateCw, 
  RotateCcw, 
  Compass, 
  ZoomIn, 
  ZoomOut, 
  Tag, 
  Eye, 
  MapPin, 
  Maximize2,
  Navigation,
  Box,
  Layers
} from 'lucide-react';
import { CameraPreset } from '../../types';

interface ViewControlsProps {
  cameraPreset: CameraPreset;
  onSelectPreset: (preset: CameraPreset) => void;
  autoRotate: boolean;
  onToggleAutoRotate: () => void;
  showLabels: boolean;
  onToggleLabels: () => void;
  onResetCamera: () => void;
}

export const ViewControls: React.FC<ViewControlsProps> = ({
  cameraPreset,
  onSelectPreset,
  autoRotate,
  onToggleAutoRotate,
  showLabels,
  onToggleLabels,
  onResetCamera
}) => {
  return (
    <div className="absolute bottom-6 right-6 z-30 flex flex-col items-end gap-2.5 select-none pointer-events-auto">
      
      {/* 1. Perspectives & Angles Floating Bar */}
      <div className="bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-2xl p-1.5 shadow-lg flex items-center gap-1">
        {/* Quick View Angle Chips */}
        <button
          onClick={() => onSelectPreset('front')}
          className={`px-2 py-1 rounded-lg text-[11px] font-semibold transition-all ${
            cameraPreset === 'front'
              ? 'bg-sky-600 text-white shadow-2xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
          title="Front View (South towards North)"
        >
          Front
        </button>

        <button
          onClick={() => onSelectPreset('back')}
          className={`px-2 py-1 rounded-lg text-[11px] font-semibold transition-all ${
            cameraPreset === 'back'
              ? 'bg-sky-600 text-white shadow-2xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
          title="Back View (North towards South)"
        >
          Back
        </button>

        <button
          onClick={() => onSelectPreset('left')}
          className={`px-2 py-1 rounded-lg text-[11px] font-semibold transition-all ${
            cameraPreset === 'left'
              ? 'bg-sky-600 text-white shadow-2xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
          title="Left View (West towards East)"
        >
          Left
        </button>

        <button
          onClick={() => onSelectPreset('right')}
          className={`px-2 py-1 rounded-lg text-[11px] font-semibold transition-all ${
            cameraPreset === 'right'
              ? 'bg-sky-600 text-white shadow-2xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
          title="Right View (East towards West)"
        >
          Right
        </button>

        <div className="w-px h-4 bg-slate-200"></div>

        <button
          onClick={() => onSelectPreset('angled-3d')}
          className={`px-2 py-1 rounded-lg text-[11px] font-semibold transition-all flex items-center gap-1 ${
            cameraPreset === 'angled-3d'
              ? 'bg-sky-600 text-white shadow-2xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
          title="Angled 3D Isometric View (45°)"
        >
          <Box className="w-3 h-3" />
          <span>3D 45°</span>
        </button>

        <button
          onClick={() => onSelectPreset('top-down')}
          className={`px-2 py-1 rounded-lg text-[11px] font-semibold transition-all flex items-center gap-1 ${
            cameraPreset === 'top-down'
              ? 'bg-sky-600 text-white shadow-2xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
          title="Top-Down Satellite / Blueprint Nadir View (90°)"
        >
          <Layers className="w-3 h-3" />
          <span>Top-Down</span>
        </button>
      </div>

      {/* 2. Preset Camera Selector Dropdown */}
      <div className="bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-2xl p-1.5 shadow-lg flex items-center gap-1">
        <select
          value={cameraPreset}
          onChange={(e) => onSelectPreset(e.target.value as CameraPreset)}
          className="bg-transparent text-xs font-semibold text-slate-800 py-1.5 px-3 rounded-xl hover:bg-slate-100 cursor-pointer focus:outline-none transition-colors border-0"
        >
          <option value="overview">🌐 Full Campus Overview</option>
          <option value="front">🏛️ Front View (Bharathi Salai)</option>
          <option value="back">🔬 Rear View (North Tech Perimeter)</option>
          <option value="left">🧭 West Wing (BMS Road Access)</option>
          <option value="right">🏀 East Wing (Sports Arena & Hostels)</option>
          <option value="angled-3d">📐 Angled 3D Isometric (45°)</option>
          <option value="top-down">🗺️ Top-Down Master Plan (90°)</option>
          <option value="south-gate">🚪 South Gate 1 Checkpoint</option>
          <option value="easwari-academic">🎓 Easwari Main Academic Block</option>
          <option value="bms-block">🏢 Easwari Mech & Civil Labs</option>
          <option value="hostels">📚 Easwari Central Library</option>
          <option value="bus-bay">🚌 College Bus Transport Depot</option>
        </select>
      </div>

      {/* 3. Floating Action Tool Strip */}
      <div className="bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-2xl p-1.5 shadow-lg flex items-center gap-1.5">
        {/* Reset Camera Button */}
        <button
          onClick={onResetCamera}
          title="Reset Camera to Default Overview"
          className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 active:scale-95 transition-all flex items-center justify-center group relative"
        >
          <RotateCcw className="w-4 h-4 text-sky-600 group-hover:rotate-[-45deg] transition-transform" />
          <span className="sr-only">Reset Camera</span>
        </button>

        <div className="w-px h-5 bg-slate-200"></div>

        {/* 360° Auto-Rotate Toggle */}
        <button
          onClick={onToggleAutoRotate}
          title="Toggle 360° Orbit Auto-Rotate Tour"
          className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
            autoRotate
              ? 'bg-sky-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <RotateCw className={`w-3.5 h-3.5 ${autoRotate ? 'animate-spin' : ''}`} />
          <span className="hidden sm:inline">360° Tour</span>
        </button>

        <div className="w-px h-5 bg-slate-200"></div>

        {/* Labels Toggle */}
        <button
          onClick={onToggleLabels}
          title="Toggle 3D Building Floating Labels"
          className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
            showLabels
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Tag className="w-3.5 h-3.5 text-sky-400" />
          <span className="hidden sm:inline">Labels</span>
        </button>
      </div>

      {/* 4. Campus Compass & Cardinal Orientation Buttons */}
      <div className="bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-2xl p-1.5 shadow-md flex items-center gap-1">
        <div className="w-6 h-6 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center">
          <Navigation className="w-3.5 h-3.5 text-red-500 fill-red-500 transform -rotate-45" />
        </div>

        <button
          onClick={() => onSelectPreset('north')}
          className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
          title="Orient Camera North"
        >
          N
        </button>
        <button
          onClick={() => onSelectPreset('south')}
          className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
          title="Orient Camera South"
        >
          S
        </button>
        <button
          onClick={() => onSelectPreset('east')}
          className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
          title="Orient Camera East"
        >
          E
        </button>
        <button
          onClick={() => onSelectPreset('west')}
          className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
          title="Orient Camera West"
        >
          W
        </button>
      </div>

    </div>
  );
};
