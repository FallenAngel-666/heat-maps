import React, { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { SensorZoneData, ScannerMode } from '../../types';

interface DeviceIntelligence3DProps {
  zones: SensorZoneData[];
  mode: ScannerMode;
  isActive: boolean;
  showLabels?: boolean;
  onSelectZone?: (zone: SensorZoneData) => void;
}

// Single Animated Sensor Marker Node
const SensorZoneNode: React.FC<{
  zone: SensorZoneData;
  mode: ScannerMode;
  showLabels?: boolean;
  onSelect?: () => void;
}> = ({ zone, mode, showLabels = true, onSelect }) => {
  const [posX, posY, posZ] = zone.position_3d;
  const radius = zone.coverage_radius;
  
  // Animation refs
  const ripple1Ref = useRef<THREE.Mesh>(null);
  const ripple2Ref = useRef<THREE.Mesh>(null);
  const ripple3Ref = useRef<THREE.Mesh>(null);
  const beaconLightRef = useRef<THREE.PointLight>(null);
  const sensorHeadRef = useRef<THREE.Mesh>(null);

  // Density colors
  const densityColor = 
    zone.density_status === 'congested' ? '#dc2626' :
    zone.density_status === 'high' ? '#ef4444' :
    zone.density_status === 'medium' ? '#f97316' : '#10b981';

  // Animation frame loop for radar pulsing rings & beacon
  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    // Pulse rings expanding outward
    if (ripple1Ref.current) {
      const s1 = ((t * 0.4) % 1) * radius;
      ripple1Ref.current.scale.set(s1, s1, 1);
      (ripple1Ref.current.material as THREE.MeshBasicMaterial).opacity = Math.max(0, 0.7 - s1 / radius);
    }
    if (ripple2Ref.current) {
      const s2 = (((t * 0.4) + 0.33) % 1) * radius;
      ripple2Ref.current.scale.set(s2, s2, 1);
      (ripple2Ref.current.material as THREE.MeshBasicMaterial).opacity = Math.max(0, 0.7 - s2 / radius);
    }
    if (ripple3Ref.current) {
      const s3 = (((t * 0.4) + 0.66) % 1) * radius;
      ripple3Ref.current.scale.set(s3, s3, 1);
      (ripple3Ref.current.material as THREE.MeshBasicMaterial).opacity = Math.max(0, 0.7 - s3 / radius);
    }

    // Dynamic red beacon light intensity
    if (beaconLightRef.current) {
      beaconLightRef.current.intensity = 1.8 + Math.sin(t * 6) * 1.2;
    }

    // Gentle floating sensor head motion
    if (sensorHeadRef.current) {
      sensorHeadRef.current.position.y = 2.4 + Math.sin(t * 2) * 0.15;
    }
  });

  return (
    <group position={[posX, 0.05, posZ]}>
      {/* 1. Approximate Coverage Area - Translucent Ground Footprint */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[radius, 64]} />
        <meshBasicMaterial 
          color="#ef4444" 
          transparent 
          opacity={0.08} 
          side={THREE.DoubleSide} 
        />
      </mesh>

      {/* Outer Coverage Boundary Perimeter Line */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[radius - 0.25, radius, 64]} />
        <meshBasicMaterial 
          color="#ef4444" 
          transparent 
          opacity={0.45} 
          side={THREE.DoubleSide} 
        />
      </mesh>

      {/* 2. Expanding Radar Concentric Rings */}
      <mesh ref={ripple1Ref} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <ringGeometry args={[0.95, 1.0, 48]} />
        <meshBasicMaterial color="#ef4444" transparent opacity={0.6} side={THREE.DoubleSide} />
      </mesh>
      <mesh ref={ripple2Ref} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <ringGeometry args={[0.95, 1.0, 48]} />
        <meshBasicMaterial color="#ef4444" transparent opacity={0.6} side={THREE.DoubleSide} />
      </mesh>
      <mesh ref={ripple3Ref} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <ringGeometry args={[0.95, 1.0, 48]} />
        <meshBasicMaterial color="#ef4444" transparent opacity={0.6} side={THREE.DoubleSide} />
      </mesh>

      {/* 3. Physical Tripod / Sensor Hub Base */}
      <group position={[0, 0, 0]}>
        {/* Base Hub Plinth */}
        <mesh position={[0, 0.3, 0]} castShadow>
          <cylinderGeometry args={[0.6, 0.8, 0.6, 8]} />
          <meshStandardMaterial color="#0f172a" roughness={0.4} metalness={0.8} />
        </mesh>
        
        {/* Mast Stand */}
        <mesh position={[0, 1.2, 0]} castShadow>
          <cylinderGeometry args={[0.12, 0.15, 1.4, 8]} />
          <meshStandardMaterial color="#334155" metalness={0.6} roughness={0.3} />
        </mesh>

        {/* Omnidirectional RF Antenna */}
        <mesh position={[0, 2.8, 0]} castShadow>
          <cylinderGeometry args={[0.04, 0.04, 1.0, 6]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.9} roughness={0.2} />
        </mesh>

        {/* Floating Scanner Head Unit */}
        <mesh ref={sensorHeadRef} position={[0, 2.4, 0]} castShadow>
          <sphereGeometry args={[0.45, 16, 16]} />
          <meshStandardMaterial
            color="#ef4444"
            emissive="#ef4444"
            emissiveIntensity={1.8}
            roughness={0.2}
          />
        </mesh>

        {/* Red Active Beacon Point Light */}
        <pointLight
          ref={beaconLightRef}
          position={[0, 2.5, 0]}
          color="#ef4444"
          intensity={2.2}
          distance={radius * 1.5}
        />
      </group>

      {/* 4. High-Visibility Floating 3D Billboard HUD (hidden when drawers are open) */}
      {showLabels && (
        <Html
          position={[0, 4.4, 0]}
          center
          distanceFactor={65}
          zIndexRange={[10, 0]}
          className="pointer-events-auto select-none"
        >
          <div 
            onClick={onSelect}
            className="cursor-pointer group flex flex-col items-center transform hover:scale-105 transition-transform"
          >
            {/* Main Sensor Pill */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-950/90 text-white border border-red-500/80 shadow-2xl backdrop-blur-md ring-2 ring-red-500/30">
              {/* Blinking Live Indicator */}
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-80"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
              </span>

              {/* Live Detected BLE Device Counter */}
              <div className="flex items-baseline gap-1 font-mono">
                <span className="text-base font-extrabold text-white tracking-tight">
                  {zone.detected_devices}
                </span>
                <span className="text-[11px] font-semibold text-red-300 uppercase">
                  BLE Devices
                </span>
              </div>

              {/* Density Tag */}
              <span 
                className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full text-white"
                style={{ backgroundColor: densityColor }}
              >
                {zone.density_status}
              </span>
            </div>

            {/* Subtitle / Coverage Badge */}
            <div className="mt-1 flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-slate-900/85 text-[10px] text-slate-300 border border-slate-700/60 shadow-md">
              <span className="text-red-400 font-bold">
                {zone.is_physical_sensor ? '📡 LAPTOP BLE SCANNER' : '📡 ZONE NODE'}
              </span>
              <span className="text-slate-500">•</span>
              <span>~{Math.round(radius)}m Coverage</span>
              {mode === 'demo' && !zone.is_physical_sensor && (
                <>
                  <span className="text-slate-500">•</span>
                  <span className="text-amber-400 font-mono">SIMULATED</span>
                </>
              )}
            </div>
          </div>
        </Html>
      )}
    </group>
  );
};

export const DeviceIntelligence3D: React.FC<DeviceIntelligence3DProps> = ({
  zones,
  mode,
  isActive,
  showLabels = true,
  onSelectZone
}) => {
  if (!isActive || !zones || zones.length === 0) return null;

  return (
    <group>
      {zones.map((zone) => (
        <SensorZoneNode
          key={zone.zone_id}
          zone={zone}
          mode={mode}
          showLabels={showLabels}
          onSelect={() => onSelectZone?.(zone)}
        />
      ))}
    </group>
  );
};
