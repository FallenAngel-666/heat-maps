import React, { useState, useMemo, useCallback } from 'react';
import { 
  Building, 
  Incident, 
  EventLog, 
  HealthStatus, 
  CameraPreset,
  Technician,
  InventoryItem,
  WorkOrder,
  ActiveModuleId
} from './types';
import { 
  INITIAL_BUILDINGS, 
  INITIAL_INCIDENTS, 
  INITIAL_EVENTS,
  INITIAL_TECHNICIANS,
  INITIAL_INVENTORY,
  INITIAL_WORK_ORDERS
} from './data/campusData';
import { CampusScene } from './components/3d/CampusScene';
import { Header } from './components/ui/Header';
import { HealthMetricsBar } from './components/ui/HealthMetricsBar';
import { ViewControls } from './components/ui/ViewControls';
import { BuildingDetailDrawer } from './components/ui/BuildingDetailDrawer';
import { IncidentModal } from './components/ui/IncidentModal';
import { IncidentLogDrawer } from './components/ui/IncidentLogDrawer';
import { BuildingListDrawer } from './components/ui/BuildingListDrawer';
import { DeviceIntelligenceDrawer } from './components/ui/DeviceIntelligenceDrawer';
import { DeviceIntelligenceMapToggle } from './components/ui/DeviceIntelligenceMapToggle';
import { HamburgerNavigation } from './components/ui/HamburgerNavigation';
import { useDeviceIntelligence } from './hooks/useDeviceIntelligence';

export const App: React.FC = () => {
  // 1. Campus Data State
  const [buildings, setBuildings] = useState<Building[]>(INITIAL_BUILDINGS);
  const [incidents, setIncidents] = useState<Incident[]>(INITIAL_INCIDENTS);
  const [events, setEvents] = useState<EventLog[]>(INITIAL_EVENTS);

  // 2. Interactive Selection State
  const [selectedBuildingId, setSelectedBuildingId] = useState<string | null>(null);
  const [hoveredBuildingId, setHoveredBuildingId] = useState<string | null>(null);
  const [healthFilter, setHealthFilter] = useState<HealthStatus | 'all'>('all');

  // 3. 3D Camera Controls State
  const [cameraPreset, setCameraPreset] = useState<CameraPreset>('overview');
  const [autoRotate, setAutoRotate] = useState<boolean>(false);
  const [showLabels, setShowLabels] = useState<boolean>(true);

  // 4. Drawers & Modals Visibility
  const [isReportModalOpen, setIsReportModalOpen] = useState<boolean>(false);
  const [isEventStreamOpen, setIsEventStreamOpen] = useState<boolean>(false);
  const [isBuildingListOpen, setIsBuildingListOpen] = useState<boolean>(false);
  const [modalTargetBuildingId, setModalTargetBuildingId] = useState<string | null>(null);

  // 4b. HAMBURGER NAVIGATION DRAWER & 5 CORE MODULES STATE
  const [isNavDrawerOpen, setIsNavDrawerOpen] = useState<boolean>(false);
  const [activeNavModule, setActiveNavModule] = useState<ActiveModuleId>('health-map');
  const [technicians, setTechnicians] = useState<Technician[]>(INITIAL_TECHNICIANS);
  const [inventory, setInventory] = useState<InventoryItem[]>(INITIAL_INVENTORY);
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>(INITIAL_WORK_ORDERS);

  // 5. LIVE DEVICE INTELLIGENCE STATE (Anonymous Bluetooth Device Detection)
  const [isDeviceIntelligenceEnabled, setIsDeviceIntelligenceEnabled] = useState<boolean>(true);
  const [isDeviceIntelligenceDrawerOpen, setIsDeviceIntelligenceDrawerOpen] = useState<boolean>(false);

  // Real-time BLE Device Intelligence Hook (polls 127.0.0.1:8000 every 3s)
  const {
    data: deviceData,
    isBackendConnected,
    isSwitchingMode,
    setScannerMode,
    triggerRescan
  } = useDeviceIntelligence(isDeviceIntelligenceEnabled);

  // Derived Campus Metrics
  const activeIncidents = useMemo(
    () => incidents.filter((i) => i.status !== 'resolved'),
    [incidents]
  );

  const overallCampusStatus = useMemo<HealthStatus>(() => {
    if (buildings.some((b) => b.healthStatus === 'red')) return 'red';
    if (buildings.some((b) => b.healthStatus === 'amber')) return 'amber';
    return 'green';
  }, [buildings]);

  const campusHealthScore = useMemo(() => {
    const total = buildings.length;
    const green = buildings.filter((b) => b.healthStatus === 'green').length;
    const amber = buildings.filter((b) => b.healthStatus === 'amber').length;
    const grey = buildings.filter((b) => b.healthStatus === 'grey').length;
    // Green = 1.0, Amber = 0.5, Grey = 0.8
    const score = Math.round(((green * 1.0 + amber * 0.5 + grey * 0.8) / total) * 100);
    return score;
  }, [buildings]);

  // Selected Building Object
  const selectedBuilding = useMemo(
    () => buildings.find((b) => b.id === selectedBuildingId) || null,
    [buildings, selectedBuildingId]
  );

  // Filtered Buildings for Display in 3D
  const displayBuildings = useMemo(() => {
    if (healthFilter === 'all') return buildings;
    return buildings.map((b) => ({
      ...b,
      // If outside filter, keep building visible but with neutral primary tone
      healthStatus: b.healthStatus === healthFilter ? b.healthStatus : 'grey'
    }));
  }, [buildings, healthFilter]);

  // Handle Building Selection
  const handleSelectBuilding = useCallback((buildingId: string | null) => {
    setSelectedBuildingId(buildingId);
    if (buildingId) {
      setAutoRotate(false);
    }
  }, []);

  // Handle Reporting a New Incident
  const handleSubmitIncident = useCallback(
    (incidentData: {
      buildingId: string;
      floorZone: string;
      title: string;
      description: string;
      severity: 'critical' | 'attention' | 'normal';
      category: 'Electrical' | 'Fire/Safety' | 'Water/Plumbing' | 'Network/IT' | 'HVAC' | 'Structural';
      reportedBy: string;
    }) => {
      const targetBldg = buildings.find((b) => b.id === incidentData.buildingId);
      const buildingName = targetBldg ? targetBldg.name : 'Campus Building';

      const newIncidentId = `INC-${Date.now().toString().slice(-4)}`;
      const newIncident: Incident = {
        id: newIncidentId,
        buildingId: incidentData.buildingId,
        buildingName,
        floorZone: incidentData.floorZone,
        title: incidentData.title,
        description: incidentData.description,
        severity: incidentData.severity,
        category: incidentData.category,
        reportedAt: 'Just now',
        reportedBy: incidentData.reportedBy,
        status: 'active'
      };

      // Determine new building health status based on incident severity
      const newStatus: HealthStatus =
        incidentData.severity === 'critical'
          ? 'red'
          : incidentData.severity === 'attention'
          ? 'amber'
          : 'green';

      // 1. AUTOMATIC 3D TWIN COLOR SYNCHRONIZATION
      setBuildings((prev) =>
        prev.map((b) => {
          if (b.id === incidentData.buildingId) {
            return {
              ...b,
              healthStatus: newStatus
            };
          }
          return b;
        })
      );

      // 2. Append incident
      setIncidents((prev) => [newIncident, ...prev]);

      // 3. Append to operational event log stream
      const timeStr = new Date().toLocaleTimeString('en-US', {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });

      const newLog: EventLog = {
        id: `EVT-${Date.now().toString().slice(-4)}`,
        timestamp: timeStr,
        buildingId: incidentData.buildingId,
        buildingName,
        message: `[${incidentData.severity.toUpperCase()}] ${incidentData.title} in ${incidentData.floorZone}. Reported by ${incidentData.reportedBy}.`,
        type: 'incident',
        severity: newStatus
      };

      setEvents((prev) => [newLog, ...prev]);

      // 4. Focus 3D camera onto the affected building to show the live color update!
      setSelectedBuildingId(incidentData.buildingId);
    },
    [buildings]
  );

  // Handle Resolving an Incident
  const handleResolveIncident = useCallback(
    (incidentId: string) => {
      const targetInc = incidents.find((i) => i.id === incidentId);
      if (!targetInc) return;

      const buildingId = targetInc.buildingId;

      // Update incident status to resolved
      setIncidents((prev) =>
        prev.map((i) => (i.id === incidentId ? { ...i, status: 'resolved' as const } : i))
      );

      // Re-evaluate remaining incidents for that building
      const remainingIncidents = incidents.filter(
        (i) => i.buildingId === buildingId && i.id !== incidentId && i.status !== 'resolved'
      );

      let nextStatus: HealthStatus = 'green';
      if (remainingIncidents.some((i) => i.severity === 'critical')) {
        nextStatus = 'red';
      } else if (remainingIncidents.some((i) => i.severity === 'attention')) {
        nextStatus = 'amber';
      }

      // Update building color back to resolved health
      setBuildings((prev) =>
        prev.map((b) => (b.id === buildingId ? { ...b, healthStatus: nextStatus } : b))
      );

      // Log event
      const timeStr = new Date().toLocaleTimeString('en-US', {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });

      setEvents((prev) => [
        {
          id: `EVT-${Date.now().toString().slice(-4)}`,
          timestamp: timeStr,
          buildingId,
          buildingName: targetInc.buildingName,
          message: `Incident ${incidentId} resolved: "${targetInc.title}". Building health restored.`,
          type: 'status_change',
          severity: nextStatus
        },
        ...prev
      ]);
    },
    [incidents]
  );

  // Trigger Pre-configured Simulation Scenarios
  const handleTriggerSimulation = useCallback(
    (type: 'fire' | 'power' | 'network' | 'reset') => {
      if (type === 'fire') {
        handleSubmitIncident({
          buildingId: 'EEC-MAIN-01',
          floorZone: 'Floor 3 - Server Room & CSE Labs',
          title: 'Optical Heat & Smoke Alarm Triggered',
          description: 'Emergency HVAC damper isolated. Fire suppression pre-action protocol activated in server room.',
          severity: 'critical',
          category: 'Fire/Safety',
          reportedBy: 'Automated Fire Sensor System'
        });
      } else if (type === 'power') {
        handleSubmitIncident({
          buildingId: 'SRM-BMS-05',
          floorZone: 'Ground Floor - Main Inverter Yard',
          title: '3-Phase Line Voltage Fluctuation Detected',
          description: 'Grid power surge recorded. Backup UPS online. Electrical engineering dispatched.',
          severity: 'attention',
          category: 'Electrical',
          reportedBy: 'Power Grid Telemetry'
        });
      } else if (type === 'network') {
        handleSubmitIncident({
          buildingId: 'EEC-LIB-03',
          floorZone: 'Basement - Optical Distribution Frame',
          title: 'Core 10Gbps Backbone Link Offline',
          description: 'Optical fiber line attenuation warning. Secondary redundant link engaged.',
          severity: 'critical',
          category: 'Network/IT',
          reportedBy: 'IT Infrastructure Monitor'
        });
      } else if (type === 'reset') {
        // Restore all buildings to nominal green
        setBuildings((prev) =>
          prev.map((b) => ({
            ...b,
            healthStatus: b.id === 'EEC-PG-07' ? 'grey' : 'green'
          }))
        );
        setIncidents((prev) => prev.map((i) => ({ ...i, status: 'resolved' as const })));
        setEvents((prev) => [
          {
            id: `EVT-${Date.now().toString().slice(-4)}`,
            timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }),
            buildingId: 'CAMPUS-ALL',
            buildingName: 'All Buildings',
            message: 'All campus systems restored to nominal status by CampusPulse OS Command.',
            type: 'system',
            severity: 'green'
          },
          ...prev
        ]);
      }
    },
    [handleSubmitIncident]
  );

  // Technician & Work Order Handlers
  const handleUpdateTechnicianStatus = useCallback((techId: string, status: Technician['status']) => {
    setTechnicians((prev) =>
      prev.map((t) => (t.id === techId ? { ...t, status } : t))
    );
  }, []);

  const handleCreateWorkOrder = useCallback((wo: Partial<WorkOrder>) => {
    const newWo: WorkOrder = {
      id: `WO-${Date.now().toString().slice(-4)}`,
      incidentId: wo.incidentId || 'INC-MANUAL',
      buildingId: wo.buildingId || 'EEC-MAIN-01',
      buildingName: wo.buildingName || 'Easwari Main Academic Block',
      technicianId: wo.technicianId || 'TECH-01',
      technicianName: wo.technicianName || 'Er. Rajesh Kumar',
      partUsed: wo.partUsed,
      status: 'in-progress',
      createdAt: new Date().toLocaleTimeString('en-US', { hour12: false }),
      priority: wo.priority || 'medium'
    };
    setWorkOrders((prev) => [newWo, ...prev]);
  }, []);

  return (
    <div className="flex flex-col h-screen w-screen bg-slate-50 overflow-hidden font-sans select-none">
      {/* 1. Light Enterprise Header */}
      <Header
        campusHealthScore={campusHealthScore}
        overallStatus={overallCampusStatus}
        activeIncidentsCount={activeIncidents.length}
        onOpenReportModal={() => {
          setModalTargetBuildingId(null);
          setIsReportModalOpen(true);
        }}
        onToggleEventStream={() => setIsEventStreamOpen((prev) => !prev)}
        isEventStreamOpen={isEventStreamOpen}
        onToggleBuildingList={() => setIsBuildingListOpen((prev) => !prev)}
        isBuildingListOpen={isBuildingListOpen}
        onOpenNavigation={() => setIsNavDrawerOpen(true)}
        onResetCamera={() => {
          setSelectedBuildingId(null);
          setCameraPreset('overview');
        }}
        onTriggerQuickDemo={() => handleTriggerSimulation('fire')}
        isDeviceIntelligenceEnabled={isDeviceIntelligenceEnabled}
        detectedDevicesCount={deviceData.detected_devices}
        onOpenDeviceIntelligenceDrawer={() => setIsDeviceIntelligenceDrawerOpen(true)}
      />

      {/* 2. Campus Health Filter & Metric Bar */}
      <HealthMetricsBar
        buildings={buildings}
        selectedFilter={healthFilter}
        onSelectFilter={setHealthFilter}
      />

      {/* 3. Main 3D Canvas Area */}
      <main className="flex-1 relative w-full h-full overflow-hidden">
        {/* Live Device Intelligence Campus Map Toggle (Top-Left) */}
        <DeviceIntelligenceMapToggle
          isEnabled={isDeviceIntelligenceEnabled}
          onToggle={() => setIsDeviceIntelligenceEnabled((prev) => !prev)}
          onOpenDashboard={() => setIsDeviceIntelligenceDrawerOpen(true)}
          data={deviceData}
          isBackendConnected={isBackendConnected}
        />

        <CampusScene
          buildings={displayBuildings}
          selectedBuildingId={selectedBuildingId}
          hoveredBuildingId={hoveredBuildingId}
          onSelectBuilding={handleSelectBuilding}
          onHoverBuilding={setHoveredBuildingId}
          showLabels={showLabels}
          cameraPreset={cameraPreset}
          autoRotate={autoRotate}
          isDeviceIntelligenceActive={isDeviceIntelligenceEnabled}
          deviceIntelligenceZones={deviceData.zones}
          deviceIntelligenceMode={deviceData.mode}
          onSelectZone={(zone) => {
            setIsDeviceIntelligenceDrawerOpen(true);
          }}
        />

        {/* 4. Viewing Controls & Camera Presets Toolbar */}
        <ViewControls
          cameraPreset={cameraPreset}
          onSelectPreset={(preset) => {
            setSelectedBuildingId(null);
            setCameraPreset(preset);
          }}
          autoRotate={autoRotate}
          onToggleAutoRotate={() => setAutoRotate((prev) => !prev)}
          showLabels={showLabels}
          onToggleLabels={() => setShowLabels((prev) => !prev)}
          onResetCamera={() => {
            setSelectedBuildingId(null);
            setCameraPreset('overview');
          }}
        />

        {/* 5. Building Detail Drawer (Facility Intelligence) */}
        <BuildingDetailDrawer
          building={selectedBuilding}
          onClose={() => setSelectedBuildingId(null)}
          incidents={incidents}
          onReportIncidentForBuilding={(bldgId) => {
            setModalTargetBuildingId(bldgId);
            setIsReportModalOpen(true);
          }}
          onResolveIncident={handleResolveIncident}
          onFocusBuilding={(bldgId) => handleSelectBuilding(bldgId)}
        />

        {/* 6. Operational Stream & Incident Log Drawer */}
        <IncidentLogDrawer
          isOpen={isEventStreamOpen}
          onClose={() => setIsEventStreamOpen(false)}
          incidents={incidents}
          events={events}
          buildings={buildings}
          onResolveIncident={handleResolveIncident}
          onSelectBuilding={(bldgId) => {
            handleSelectBuilding(bldgId);
            setIsEventStreamOpen(false);
          }}
          onTriggerSimulation={handleTriggerSimulation}
        />

        {/* 7. Building Directory Drawer */}
        <BuildingListDrawer
          isOpen={isBuildingListOpen}
          onClose={() => setIsBuildingListOpen(false)}
          buildings={buildings}
          selectedBuildingId={selectedBuildingId}
          onSelectBuilding={(bldgId) => {
            handleSelectBuilding(bldgId);
            setIsBuildingListOpen(false);
          }}
        />

        {/* 8. Live Device Intelligence Drawer (Dark Themed Anonymous Density Dashboard) */}
        <DeviceIntelligenceDrawer
          isOpen={isDeviceIntelligenceDrawerOpen}
          onClose={() => setIsDeviceIntelligenceDrawerOpen(false)}
          data={deviceData}
          isBackendConnected={isBackendConnected}
          isSwitchingMode={isSwitchingMode}
          onSetMode={setScannerMode}
          onTriggerRescan={triggerRescan}
          onFocusZone={(zone) => {
            handleSelectBuilding(zone.building_id);
          }}
        />

        {/* 9. Incident Reporting Modal */}
        <IncidentModal
          isOpen={isReportModalOpen}
          onClose={() => setIsReportModalOpen(false)}
          buildings={buildings}
          initialBuildingId={modalTargetBuildingId}
          onSubmitIncident={handleSubmitIncident}
        />

        {/* 10. Hamburger Navigation Drawer (5 Core Modules + Mobile Signals) */}
        <HamburgerNavigation
          isOpen={isNavDrawerOpen}
          onClose={() => setIsNavDrawerOpen(false)}
          activeModule={activeNavModule}
          onSelectModule={(mod) => setActiveNavModule(mod)}
          buildings={buildings}
          selectedBuildingId={selectedBuildingId}
          onSelectBuilding={(id) => {
            handleSelectBuilding(id);
            if (id) setIsNavDrawerOpen(false);
          }}
          incidents={incidents}
          onResolveIncident={handleResolveIncident}
          onOpenReportModal={() => {
            setIsNavDrawerOpen(false);
            setModalTargetBuildingId(null);
            setIsReportModalOpen(true);
          }}
          technicians={technicians}
          onUpdateTechnicianStatus={handleUpdateTechnicianStatus}
          inventory={inventory}
          workOrders={workOrders}
          onCreateWorkOrder={handleCreateWorkOrder}
          onOpenMobileSignals={() => {
            setIsNavDrawerOpen(false);
            setIsDeviceIntelligenceDrawerOpen(true);
          }}
          onTriggerSimulation={handleTriggerSimulation}
          campusHealthScore={campusHealthScore}
        />
      </main>
    </div>
  );
};

export default App;
