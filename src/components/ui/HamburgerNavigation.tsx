import React, { useState, useEffect } from 'react';
import { 
  X, 
  MapPin, 
  ShieldAlert, 
  Radio, 
  Wrench, 
  Sliders, 
  PhoneCall, 
  LayoutDashboard, 
  Layers, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Users, 
  Package, 
  Sparkles, 
  Activity, 
  Send, 
  Flame, 
  Zap, 
  Wifi, 
  ArrowRight,
  Shield,
  LifeBuoy
} from 'lucide-react';
import { 
  Building, 
  Incident, 
  EventLog, 
  HealthStatus, 
  Technician, 
  InventoryItem, 
  WorkOrder, 
  ActiveModuleId,
  SimulationParams,
  SOSAlert 
} from '../../types';

interface HamburgerNavigationProps {
  isOpen: boolean;
  onClose: () => void;
  activeModule: ActiveModuleId;
  onSelectModule: (module: ActiveModuleId) => void;
  buildings: Building[];
  selectedBuildingId: string | null;
  onSelectBuilding: (id: string | null) => void;
  incidents: Incident[];
  onResolveIncident: (incidentId: string) => void;
  onOpenReportModal: () => void;
  technicians: Technician[];
  onUpdateTechnicianStatus: (techId: string, status: Technician['status']) => void;
  inventory: InventoryItem[];
  workOrders: WorkOrder[];
  onCreateWorkOrder: (wo: Partial<WorkOrder>) => void;
  onOpenMobileSignals: () => void;
  onTriggerSimulation: (type: 'fire' | 'power' | 'network' | 'reset') => void;
  campusHealthScore: number;
}

export const HamburgerNavigation: React.FC<HamburgerNavigationProps> = ({
  isOpen,
  onClose,
  activeModule,
  onSelectModule,
  buildings,
  selectedBuildingId,
  onSelectBuilding,
  incidents,
  onResolveIncident,
  onOpenReportModal,
  technicians,
  onUpdateTechnicianStatus,
  inventory,
  workOrders,
  onCreateWorkOrder,
  onOpenMobileSignals,
  onTriggerSimulation,
  campusHealthScore
}) => {
  // Navigation active tab inside the drawer
  const [currentTab, setCurrentTab] = useState<ActiveModuleId>('health-map');

  // Unified Incident Engine sub-tab
  const [incidentEngineTab, setIncidentEngineTab] = useState<'technicians' | 'inventory' | 'work-orders'>('technicians');

  // Digital Twin Simulator state
  const [simParams, setSimParams] = useState<SimulationParams>({
    crowdCount: 1850,
    staffOnDuty: 22,
    openGates: 2,
    incidentDurationMins: 45
  });

  // Lifeline Mesh SOS state
  const [sosCategory, setSosCategory] = useState<'Medical' | 'Security' | 'Fire' | 'Structural'>('Medical');
  const [sosLocationSharing, setSosLocationSharing] = useState<boolean>(true);
  const [sosAlerts, setSosAlerts] = useState<SOSAlert[]>([
    {
      id: 'SOS-001',
      category: 'Medical',
      buildingId: 'EEC-MAIN-01',
      buildingName: 'Easwari Main Academic Block',
      locationDetails: 'Ground Floor Health Clinic Reception',
      isLocationSharingEnabled: true,
      status: 'acknowledged',
      timestamp: '15:10:04',
      dispatchedUnit: 'Campus First Responder Van #1'
    }
  ]);
  const [isSosTransmitting, setIsSosTransmitting] = useState<boolean>(false);

  // Sync prop activeModule to currentTab if provided
  useEffect(() => {
    if (activeModule !== 'none') {
      setCurrentTab(activeModule);
    }
  }, [activeModule]);

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Calculate live simulation metrics
  const simCongestionRisk = Math.min(
    95,
    Math.round(
      (simParams.crowdCount / (simParams.staffOnDuty * 80 + simParams.openGates * 600)) * 60 +
      (simParams.incidentDurationMins > 60 ? 20 : 5)
    )
  );

  const simEvacuationTime = (
    (simParams.crowdCount / (simParams.openGates * 220)) * 1.8 +
    (simParams.staffOnDuty < 15 ? 3.5 : 1.2)
  ).toFixed(1);

  // Handle triggering SOS Alert
  const handleTriggerSOS = () => {
    setIsSosTransmitting(true);
    setTimeout(() => {
      const newSos: SOSAlert = {
        id: `SOS-${Date.now().toString().slice(-3)}`,
        category: sosCategory,
        buildingId: selectedBuildingId || 'EEC-MAIN-01',
        buildingName: buildings.find((b) => b.id === selectedBuildingId)?.name || 'Easwari Main Academic Block',
        locationDetails: 'Near Central Quadrangle / Portico',
        isLocationSharingEnabled: sosLocationSharing,
        status: 'transmitting',
        timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }),
        dispatchedUnit: 'Dispatched Easwari Emergency Patrol Unit'
      };
      setSosAlerts((prev) => [newSos, ...prev]);
      setIsSosTransmitting(false);
    }, 800);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex pointer-events-auto select-none">
      {/* Backdrop overlay */}
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity duration-300"
      />

      {/* Slide-in Left Drawer Panel */}
      <aside className="relative w-full max-w-xl md:max-w-2xl bg-white h-full shadow-2xl flex flex-col border-r border-slate-200 z-10 animate-in slide-in-from-left duration-300">
        
        {/* Drawer Header */}
        <div className="h-16 px-6 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-sky-500/20 border border-sky-400/40 flex items-center justify-center text-sky-400">
              <Activity className="w-4 h-4 animate-pulse" />
            </div>
            <div>
              <h2 className="text-sm font-bold tracking-tight text-white flex items-center gap-2">
                CampusPulse OS
                <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-sky-500/20 text-sky-300 border border-sky-400/30">
                  Operations Suite
                </span>
              </h2>
              <p className="text-[11px] text-slate-400">SRM Easwari Engineering College</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Close Menu (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 6 Module Navigation Strip */}
        <div className="bg-slate-50 border-b border-slate-200 px-4 py-2 flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0">
          <button
            onClick={() => {
              setCurrentTab('health-map');
              onSelectModule('health-map');
            }}
            className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg whitespace-nowrap transition-all ${
              currentTab === 'health-map'
                ? 'bg-sky-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>1. Health Map</span>
          </button>

          <button
            onClick={() => {
              setCurrentTab('incident-engine');
              onSelectModule('incident-engine');
            }}
            className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg whitespace-nowrap transition-all ${
              currentTab === 'incident-engine'
                ? 'bg-sky-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <Wrench className="w-3.5 h-3.5" />
            <span>2. Incident Engine</span>
          </button>

          <button
            onClick={() => {
              setCurrentTab('digital-twin');
              onSelectModule('digital-twin');
            }}
            className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg whitespace-nowrap transition-all ${
              currentTab === 'digital-twin'
                ? 'bg-sky-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>3. Digital Twin</span>
          </button>

          <button
            onClick={() => {
              setCurrentTab('lifeline-sos');
              onSelectModule('lifeline-sos');
            }}
            className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg whitespace-nowrap transition-all ${
              currentTab === 'lifeline-sos'
                ? 'bg-red-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <LifeBuoy className="w-3.5 h-3.5" />
            <span>4. Lifeline SOS</span>
          </button>

          <button
            onClick={() => {
              setCurrentTab('command-center');
              onSelectModule('command-center');
            }}
            className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg whitespace-nowrap transition-all ${
              currentTab === 'command-center'
                ? 'bg-sky-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>5. Command Center</span>
          </button>

          <button
            onClick={() => {
              onClose();
              onOpenMobileSignals();
            }}
            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg whitespace-nowrap text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200 transition-all"
            title="Open CampusOps BLE Device Intelligence"
          >
            <Radio className="w-3.5 h-3.5 text-purple-600 animate-pulse" />
            <span>6. Mobile Signals</span>
          </button>
        </div>

        {/* Dynamic Module Content Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">

          {/* ======================================================== */}
          {/* MODULE 1: CAMPUS HEALTH MAP                              */}
          {/* ======================================================== */}
          {currentTab === 'health-map' && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Campus Facility Health Directory</h3>
                  <p className="text-xs text-slate-500">Live operational telemetry & health states across SRM Easwari buildings</p>
                </div>
                <div className="flex items-center gap-1 text-xs font-mono font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                  <span>Index:</span>
                  <span className={campusHealthScore < 70 ? 'text-amber-600' : 'text-emerald-600'}>
                    {campusHealthScore}%
                  </span>
                </div>
              </div>

              {/* Verified Buildings Cards */}
              <div className="grid grid-cols-1 gap-3">
                {buildings.map((bldg) => {
                  const isSelected = selectedBuildingId === bldg.id;
                  const statusBadge =
                    bldg.healthStatus === 'red'
                      ? 'bg-red-100 text-red-800 border-red-200'
                      : bldg.healthStatus === 'amber'
                      ? 'bg-amber-100 text-amber-800 border-amber-200'
                      : bldg.healthStatus === 'grey'
                      ? 'bg-slate-100 text-slate-700 border-slate-200'
                      : 'bg-emerald-100 text-emerald-800 border-emerald-200';

                  return (
                    <div
                      key={bldg.id}
                      onClick={() => onSelectBuilding(bldg.id)}
                      className={`p-4 rounded-xl border transition-all cursor-pointer ${
                        isSelected
                          ? 'border-sky-500 bg-sky-50/50 shadow-md ring-1 ring-sky-500/20'
                          : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-xs'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono font-bold text-sky-700 bg-sky-100/70 px-1.5 py-0.5 rounded">
                              {bldg.code}
                            </span>
                            <h4 className="text-sm font-bold text-slate-900">{bldg.name}</h4>
                          </div>
                          <p className="text-xs text-slate-500 mt-1 line-clamp-1">{bldg.description}</p>
                        </div>
                        <span className={`text-[11px] font-semibold uppercase px-2 py-0.5 rounded-full border ${statusBadge}`}>
                          {bldg.healthStatus === 'red' ? 'Critical' : bldg.healthStatus === 'amber' ? 'Attention' : bldg.healthStatus === 'grey' ? 'No Data' : 'Normal'}
                        </span>
                      </div>

                      {/* Telemetry quick metrics */}
                      <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-slate-100 text-[11px]">
                        <div>
                          <span className="text-slate-400 block">Power Load</span>
                          <span className="font-mono font-semibold text-slate-700">{bldg.metrics.powerKw} kW</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block">Ambient Temp</span>
                          <span className="font-mono font-semibold text-slate-700">{bldg.metrics.tempCelsius} °C</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block">WiFi Density</span>
                          <span className="font-mono font-semibold text-slate-700">{bldg.metrics.wifiConnections} clients</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* MODULE 2: UNIFIED INCIDENT ENGINE                        */}
          {/* ======================================================== */}
          {currentTab === 'incident-engine' && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Unified Incident Engine</h3>
                  <p className="text-xs text-slate-500">Technician dispatch, critical inventory, and work order tracking</p>
                </div>
                <button
                  onClick={onOpenReportModal}
                  className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-700 text-white shadow-xs transition-colors"
                >
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Report Incident</span>
                </button>
              </div>

              {/* Sub-Tabs */}
              <div className="flex border-b border-slate-200">
                <button
                  onClick={() => setIncidentEngineTab('technicians')}
                  className={`pb-2.5 px-3 text-xs font-semibold border-b-2 transition-all ${
                    incidentEngineTab === 'technicians'
                      ? 'border-sky-600 text-sky-600'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Technician Roster ({technicians.length})
                </button>
                <button
                  onClick={() => setIncidentEngineTab('inventory')}
                  className={`pb-2.5 px-3 text-xs font-semibold border-b-2 transition-all ${
                    incidentEngineTab === 'inventory'
                      ? 'border-sky-600 text-sky-600'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Spare-Parts Inventory ({inventory.length})
                </button>
                <button
                  onClick={() => setIncidentEngineTab('work-orders')}
                  className={`pb-2.5 px-3 text-xs font-semibold border-b-2 transition-all ${
                    incidentEngineTab === 'work-orders'
                      ? 'border-sky-600 text-sky-600'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Active Work Orders ({workOrders.length})
                </button>
              </div>

              {/* Sub-Tab 1: Technicians */}
              {incidentEngineTab === 'technicians' && (
                <div className="space-y-3">
                  {technicians.map((tech) => (
                    <div
                      key={tech.id}
                      className="p-3.5 rounded-xl border border-slate-200 bg-white flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-slate-700 text-xs">
                          {tech.name.split(' ').slice(-1)[0][0]}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-slate-900">{tech.name}</span>
                            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-semibold">
                              {tech.trade}
                            </span>
                          </div>
                          <span className="text-xs text-slate-500 block">{tech.phone}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full ${
                            tech.status === 'available'
                              ? 'bg-emerald-100 text-emerald-800'
                              : tech.status === 'dispatched'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {tech.status}
                        </span>

                        {tech.status === 'available' ? (
                          <button
                            onClick={() => onUpdateTechnicianStatus(tech.id, 'dispatched')}
                            className="text-xs font-semibold px-2.5 py-1 rounded bg-sky-50 text-sky-700 hover:bg-sky-100 transition-colors border border-sky-200"
                          >
                            Dispatch
                          </button>
                        ) : (
                          <button
                            onClick={() => onUpdateTechnicianStatus(tech.id, 'available')}
                            className="text-xs font-semibold px-2.5 py-1 rounded bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors border border-slate-300"
                          >
                            Recall
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Sub-Tab 2: Inventory */}
              {incidentEngineTab === 'inventory' && (
                <div className="space-y-3">
                  {inventory.map((item) => (
                    <div
                      key={item.id}
                      className="p-3.5 rounded-xl border border-slate-200 bg-white flex items-center justify-between"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-slate-900">{item.name}</span>
                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                            {item.category}
                          </span>
                        </div>
                        <span className="text-xs text-slate-500">Storage: {item.location}</span>
                      </div>

                      <div className="text-right">
                        <div className="text-sm font-mono font-bold text-slate-900">
                          {item.inStock} {item.unit}
                        </div>
                        <span
                          className={`text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded ${
                            item.status === 'nominal'
                              ? 'bg-emerald-50 text-emerald-700'
                              : 'bg-red-50 text-red-700'
                          }`}
                        >
                          Min: {item.minRequired}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Sub-Tab 3: Work Orders */}
              {incidentEngineTab === 'work-orders' && (
                <div className="space-y-3">
                  {workOrders.map((wo) => (
                    <div
                      key={wo.id}
                      className="p-3.5 rounded-xl border border-slate-200 bg-white space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono font-bold text-sky-700">{wo.id}</span>
                        <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                          {wo.status}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-900">{wo.buildingName}</h4>
                      <p className="text-xs text-slate-600">
                        Technician: <span className="font-semibold">{wo.technicianName}</span>
                      </p>
                      {wo.partUsed && (
                        <p className="text-xs text-slate-500">
                          Part Allocated: <span className="font-mono">{wo.partUsed}</span>
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ======================================================== */}
          {/* MODULE 3: DIGITAL TWIN SIMULATOR                         */}
          {/* ======================================================== */}
          {currentTab === 'digital-twin' && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div>
                <h3 className="text-base font-bold text-slate-900">Digital Twin Crisis & Crowd Simulator</h3>
                <p className="text-xs text-slate-500">Simulate crowd spikes, gate bottlenecks, and emergency evacuation drills</p>
              </div>

              {/* Interactive Simulation Sliders */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-4">
                <div>
                  <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                    <span>Expected Campus Crowd</span>
                    <span className="font-mono text-sky-700">{simParams.crowdCount} students/faculty</span>
                  </div>
                  <input
                    type="range"
                    min="500"
                    max="5000"
                    step="50"
                    value={simParams.crowdCount}
                    onChange={(e) => setSimParams({ ...simParams, crowdCount: parseInt(e.target.value) })}
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-sky-600"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                    <span>Active Facility & Security Staff</span>
                    <span className="font-mono text-sky-700">{simParams.staffOnDuty} personnel</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="50"
                    step="1"
                    value={simParams.staffOnDuty}
                    onChange={(e) => setSimParams({ ...simParams, staffOnDuty: parseInt(e.target.value) })}
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-sky-600"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                    <span>Open Access Gates</span>
                    <span className="font-mono text-sky-700">{simParams.openGates} gates</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="3"
                    step="1"
                    value={simParams.openGates}
                    onChange={(e) => setSimParams({ ...simParams, openGates: parseInt(e.target.value) })}
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-sky-600"
                  />
                </div>
              </div>

              {/* Predictive Output Cards */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 bg-white border border-slate-200 rounded-xl">
                  <span className="text-xs text-slate-500 block">Congestion Risk</span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className={`text-2xl font-bold font-mono ${simCongestionRisk > 60 ? 'text-red-600' : 'text-emerald-600'}`}>
                      {simCongestionRisk}%
                    </span>
                    <span className="text-xs text-slate-400">capacity</span>
                  </div>
                </div>

                <div className="p-3.5 bg-white border border-slate-200 rounded-xl">
                  <span className="text-xs text-slate-500 block">Estimated Evacuation</span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-2xl font-bold font-mono text-sky-600">
                      {simEvacuationTime}
                    </span>
                    <span className="text-xs text-slate-400">mins</span>
                  </div>
                </div>
              </div>

              {/* One-Click Scenario Triggers */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Execute Simulation Scenario</span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => onTriggerSimulation('fire')}
                    className="p-3 rounded-lg border border-red-200 bg-red-50 hover:bg-red-100 text-red-900 text-left transition-colors flex items-center gap-2"
                  >
                    <Flame className="w-4 h-4 text-red-600 shrink-0" />
                    <div>
                      <span className="text-xs font-bold block">Fire Drill Alert</span>
                      <span className="text-[10px] text-red-700">Main Block 3rd Floor</span>
                    </div>
                  </button>

                  <button
                    onClick={() => onTriggerSimulation('power')}
                    className="p-3 rounded-lg border border-amber-200 bg-amber-50 hover:bg-amber-100 text-amber-900 text-left transition-colors flex items-center gap-2"
                  >
                    <Zap className="w-4 h-4 text-amber-600 shrink-0" />
                    <div>
                      <span className="text-xs font-bold block">Power Grid Fluctuation</span>
                      <span className="text-[10px] text-amber-700">Main Substation Yard</span>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* MODULE 4: LIFELINE MESH SOS                              */}
          {/* ======================================================== */}
          {currentTab === 'lifeline-sos' && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div>
                <h3 className="text-base font-bold text-slate-900">Lifeline Mesh Emergency SOS</h3>
                <p className="text-xs text-slate-500">Autonomous peer-to-peer campus emergency dispatch & beaconing</p>
              </div>

              {/* SOS Broadcast Card */}
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl space-y-4">
                <div>
                  <span className="text-xs font-bold text-red-900 block mb-2">Emergency Category</span>
                  <div className="grid grid-cols-2 gap-2">
                    {(['Medical', 'Security', 'Fire', 'Structural'] as const).map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setSosCategory(cat)}
                        className={`py-2 px-3 rounded-lg text-xs font-bold transition-all border ${
                          sosCategory === cat
                            ? 'bg-red-600 text-white border-red-700 shadow-xs'
                            : 'bg-white text-slate-700 border-red-200 hover:bg-red-100/50'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Location Sharing Toggle */}
                <div className="flex items-center justify-between pt-2 border-t border-red-200/60">
                  <span className="text-xs font-medium text-slate-800">Share Precise Campus Coordinates</span>
                  <button
                    onClick={() => setSosLocationSharing(!sosLocationSharing)}
                    className={`w-10 h-6 flex items-center rounded-full p-1 transition-colors ${
                      sosLocationSharing ? 'bg-red-600' : 'bg-slate-300'
                    }`}
                  >
                    <div
                      className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                        sosLocationSharing ? 'translate-x-4' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                {/* Big Broadcast SOS Button */}
                <button
                  onClick={handleTriggerSOS}
                  disabled={isSosTransmitting}
                  className="w-full py-3 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm shadow-md transition-all active:scale-98 flex items-center justify-center gap-2"
                >
                  <AlertTriangle className={`w-4 h-4 ${isSosTransmitting ? 'animate-spin' : ''}`} />
                  <span>{isSosTransmitting ? 'Transmitting via Mesh...' : 'BROADCAST SOS DISPATCH'}</span>
                </button>
              </div>

              {/* Active SOS Alerts Log */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Active SOS Dispatches</span>
                {sosAlerts.map((sos) => (
                  <div key={sos.id} className="p-3 bg-white border border-slate-200 rounded-xl space-y-1">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-red-600 font-mono">{sos.id} • {sos.category}</span>
                      <span className="text-slate-400 font-mono">{sos.timestamp}</span>
                    </div>
                    <p className="text-xs font-semibold text-slate-800">{sos.buildingName}</p>
                    <p className="text-xs text-slate-500">{sos.locationDetails}</p>
                    {sos.dispatchedUnit && (
                      <div className="text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded mt-1 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>{sos.dispatchedUnit}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* MODULE 5: COMMAND CENTER                                 */}
          {/* ======================================================== */}
          {currentTab === 'command-center' && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div>
                <h3 className="text-base font-bold text-slate-900">Executive Command Center</h3>
                <p className="text-xs text-slate-500">Holistic campus performance, real-time safety indices & AI triage</p>
              </div>

              {/* Campus Health Summary Grid */}
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-center">
                  <span className="text-[11px] text-slate-500">System Health</span>
                  <div className="text-xl font-bold font-mono text-emerald-600 mt-0.5">{campusHealthScore}%</div>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-center">
                  <span className="text-[11px] text-slate-500">Uptime</span>
                  <div className="text-xl font-bold font-mono text-slate-800 mt-0.5">99.8%</div>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-center">
                  <span className="text-[11px] text-slate-500">Active Incidents</span>
                  <div className="text-xl font-bold font-mono text-amber-600 mt-0.5">{incidents.length}</div>
                </div>
              </div>

              {/* Automated AI Recommendations */}
              <div className="p-4 bg-sky-50 border border-sky-200 rounded-xl space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-sky-900">
                  <Sparkles className="w-4 h-4 text-sky-600" />
                  <span>Autonomous Facility Recommendations</span>
                </div>
                <ul className="text-xs text-slate-700 space-y-1.5 list-disc pl-4">
                  <li>Pre-cool Easwari Central Library convention auditorium ahead of afternoon research colloquium.</li>
                  <li>Schedule preventive lubrication on Mechanical Workshop air compressor unit #4.</li>
                  <li>Restock Danfoss chiller expansion valves in Substation Stores (Current stock: 2).</li>
                </ul>
              </div>

              {/* RAG Status Breakdown across verified campus */}
              <div className="p-4 bg-white border border-slate-200 rounded-xl space-y-3">
                <span className="text-xs font-bold text-slate-800">Easwari Engineering College Facilities RAG</span>
                <div className="space-y-2">
                  {buildings.map((b) => (
                    <div key={b.id} className="flex items-center justify-between text-xs">
                      <span className="text-slate-700 font-medium">{b.shortName}</span>
                      <span
                        className={`font-mono font-bold px-2 py-0.5 rounded text-[10px] uppercase ${
                          b.healthStatus === 'red'
                            ? 'bg-red-100 text-red-700'
                            : b.healthStatus === 'amber'
                            ? 'bg-amber-100 text-amber-700'
                            : b.healthStatus === 'grey'
                            ? 'bg-slate-100 text-slate-600'
                            : 'bg-emerald-100 text-emerald-700'
                        }`}
                      >
                        {b.healthStatus}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Drawer Footer with Quick Satellite View Switcher shortcut */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 shrink-0">
          <span>SRM Easwari Engineering College • Bharathi Salai</span>
          <button
            onClick={() => onTriggerSimulation('reset')}
            className="text-sky-600 hover:text-sky-800 font-semibold"
          >
            Reset All Nominals
          </button>
        </div>

      </aside>
    </div>
  );
};
