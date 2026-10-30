import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { ContactShadows, Sky } from '@react-three/drei';
import { Building, CameraPreset, SensorZoneData, ScannerMode } from '../../types';
import { Building3D } from './Building3D';
import { CampusEnvironment } from './CampusEnvironment';
import { CameraController } from './CameraController';
import { DeviceIntelligence3D } from './DeviceIntelligence3D';

interface CampusSceneProps {
  buildings: Building[];
  selectedBuildingId: string | null;
  hoveredBuildingId: string | null;
  onSelectBuilding: (id: string | null) => void;
  onHoverBuilding: (id: string | null) => void;
  showLabels: boolean;
  cameraPreset: CameraPreset;
  autoRotate: boolean;
  // Device Intelligence Visuals
  isDeviceIntelligenceActive?: boolean;
  deviceIntelligenceZones?: SensorZoneData[];
  deviceIntelligenceMode?: ScannerMode;
  onSelectZone?: (zone: SensorZoneData) => void;
}

export const CampusScene: React.FC<CampusSceneProps> = ({
  buildings,
  selectedBuildingId,
  hoveredBuildingId,
  onSelectBuilding,
  onHoverBuilding,
  showLabels,
  cameraPreset,
  autoRotate,
  isDeviceIntelligenceActive = false,
  deviceIntelligenceZones = [],
  deviceIntelligenceMode = 'live',
  onSelectZone
}) => {
  const selectedBuilding = buildings.find((b) => b.id === selectedBuildingId) || null;

  return (
    <div className="w-full h-full relative cursor-grab active:cursor-grabbing bg-slate-100 select-none">
      <Canvas
        shadows
        camera={{ position: [0, 95, 105], fov: 42, near: 0.5, far: 500 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: false, preserveDrawingBuffer: true }}
        onPointerMissed={() => onSelectBuilding(null)}
      >
        <color attach="background" args={['#e2e8f0']} />
        <fog attach="fog" args={['#e2e8f0', 120, 260]} />

        {/* Ambient & Natural Sun Lighting */}
        <ambientLight intensity={0.75} />
        <hemisphereLight args={['#ffffff', '#cbd5e1', 0.6]} />
        <directionalLight
          position={[60, 90, 50]}
          intensity={1.2}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-camera-far={250}
          shadow-camera-left={-90}
          shadow-camera-right={90}
          shadow-camera-top={90}
          shadow-camera-bottom={-90}
          shadow-bias={-0.0005}
        />
        {/* Soft fill light from opposite angle */}
        <directionalLight position={[-60, 40, -50]} intensity={0.4} color="#bae6fd" />

        {/* Clear daytime sky simulation */}
        <Sky
          distance={450000}
          sunPosition={[60, 90, 50]}
          inclination={0.49}
          azimuth={0.25}
          turbidity={6}
          rayleigh={0.4}
        />

        <Suspense fallback={null}>
          {/* Ground environment, roads, archway, buses, sports turf, trees */}
          <CampusEnvironment />

          {/* Live Mobile Device Intelligence & Anonymous BLE Radar */}
          <DeviceIntelligence3D
            zones={deviceIntelligenceZones}
            mode={deviceIntelligenceMode}
            isActive={isDeviceIntelligenceActive}
            onSelectZone={onSelectZone}
          />

          {/* Contact Shadows on the ground */}
          <ContactShadows
            position={[0, 0.02, 0]}
            opacity={0.45}
            scale={180}
            blur={1.8}
            far={20}
            resolution={1024}
            color="#334155"
          />

          {/* Verified Campus Buildings */}
          {buildings.map((building) => (
            <Building3D
              key={building.id}
              building={building}
              isSelected={selectedBuildingId === building.id}
              isHovered={hoveredBuildingId === building.id}
              onSelect={(id) => onSelectBuilding(id)}
              onHover={(id) => onHoverBuilding(id)}
              showLabels={showLabels}
            />
          ))}

          {/* Interactive Orbit Camera Controller */}
          <CameraController
            selectedBuilding={selectedBuilding}
            cameraPreset={cameraPreset}
            autoRotate={autoRotate}
          />
        </Suspense>
      </Canvas>
    </div>
  );
};
