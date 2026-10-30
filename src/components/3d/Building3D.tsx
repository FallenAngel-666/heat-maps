import React, { useRef, useState, useMemo, Suspense } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { Building, HealthStatus } from '../../types';
import { GLTFBuildingWrapper } from './GLTFBuildingWrapper';

interface Building3DProps {
  building: Building;
  isSelected: boolean;
  isHovered: boolean;
  onSelect: (id: string) => void;
  onHover: (id: string | null) => void;
  showLabels: boolean;
  simplifiedView?: boolean;
}

// Health color mapping
const STATUS_COLORS: Record<HealthStatus, { hex: string; emissive: string; labelBg: string; text: string; glow: string }> = {
  green: {
    hex: '#10b981', // Emerald Normal
    emissive: '#047857',
    labelBg: 'bg-emerald-500',
    glow: '#34d399',
    text: 'Normal'
  },
  amber: {
    hex: '#f59e0b', // Amber Attention
    emissive: '#b45309',
    labelBg: 'bg-amber-500',
    glow: '#fbbf24',
    text: 'Attention'
  },
  red: {
    hex: '#ef4444', // Red Critical
    emissive: '#b91c1c',
    labelBg: 'bg-red-500',
    glow: '#f87171',
    text: 'Critical'
  },
  grey: {
    hex: '#94a3b8', // Grey No Data
    emissive: '#475569',
    labelBg: 'bg-slate-500',
    glow: '#cbd5e1',
    text: 'No Data'
  }
};

export const Building3D: React.FC<Building3DProps> = ({
  building,
  isSelected,
  isHovered,
  onSelect,
  onHover,
  showLabels
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const beaconRef = useRef<THREE.PointLight>(null);
  const pulseMeshRef = useRef<THREE.Mesh>(null);

  const [width, height, depth] = building.dimensions;
  const statusColorInfo = STATUS_COLORS[building.healthStatus];

  // Base building colors
  const buildingColor = useMemo(() => {
    if (building.healthStatus === 'red') return '#fecaca'; // soft reddish tint for critical
    if (building.healthStatus === 'amber') return '#fef3c7'; // soft amber tint
    if (building.healthStatus === 'grey') return '#e2e8f0'; // neutral slate
    return building.primaryColor || '#ffffff';
  }, [building.healthStatus, building.primaryColor]);

  const roofColor = useMemo(() => {
    if (building.healthStatus === 'red') return '#ef4444';
    if (building.healthStatus === 'amber') return '#f59e0b';
    if (building.healthStatus === 'grey') return '#64748b';
    return '#334155'; // Dark slate architectural roof
  }, [building.healthStatus]);

  // Holographic edge outline geometry
  const bodyEdges = useMemo(() => {
    const box = new THREE.BoxGeometry(width, height, depth);
    return new THREE.EdgesGeometry(box);
  }, [width, height, depth]);

  const roofEdges = useMemo(() => {
    const box = new THREE.BoxGeometry(width + 0.4, 0.4, depth + 0.4);
    return new THREE.EdgesGeometry(box);
  }, [width, depth]);

  // Dynamic animation for alerts (pulsing red or amber)
  useFrame((state) => {
    if (building.healthStatus === 'red' && beaconRef.current) {
      const t = state.clock.getElapsedTime();
      beaconRef.current.intensity = 1.5 + Math.sin(t * 8) * 1.5;
      if (pulseMeshRef.current) {
        pulseMeshRef.current.scale.setScalar(1 + (Math.sin(t * 4) + 1) * 0.04);
      }
    } else if (building.healthStatus === 'amber' && beaconRef.current) {
      const t = state.clock.getElapsedTime();
      beaconRef.current.intensity = 0.8 + Math.sin(t * 3) * 0.4;
    }
  });

  return (
    <group
      ref={groupRef}
      position={[building.position[0], building.position[1], building.position[2]]}
      rotation={[building.rotation[0], building.rotation[1], building.rotation[2]]}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(building.id);
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        onHover(building.id);
      }}
      onPointerOut={(e) => {
        e.stopPropagation();
        onHover(null);
      }}
    >
      {/* Custom GLTF Model or Architectural Holographic Mesh */}
      {building.modelUrl ? (
        <Suspense fallback={null}>
          <GLTFBuildingWrapper
            modelUrl={building.modelUrl}
            healthStatus={building.healthStatus}
            isSelected={isSelected}
            scale={[width / 10, height / 10, depth / 10]}
          />
        </Suspense>
      ) : (
        <>
          {/* 1. Base Ground Plinth / Concrete Foundation */}
          <mesh position={[0, 0.25, 0]} castShadow receiveShadow>
            <boxGeometry args={[width + 1.6, 0.5, depth + 1.6]} />
            <meshStandardMaterial color="#cbd5e1" roughness={0.7} />
          </mesh>

          {/* 2. Main Structural Body with Finished 360° Geometry */}
          <mesh
            ref={pulseMeshRef}
            position={[0, height / 2 + 0.5, 0]}
            castShadow
            receiveShadow
          >
            <boxGeometry args={[width, height, depth]} />
            <meshStandardMaterial
              color={buildingColor}
              roughness={0.35}
              metalness={0.12}
              emissive={
                isSelected
                  ? '#0284c7'
                  : building.healthStatus === 'red'
                  ? '#991b1b'
                  : building.healthStatus === 'amber'
                  ? '#92400e'
                  : '#0f172a'
              }
              emissiveIntensity={isSelected ? 0.35 : building.healthStatus === 'red' ? 0.3 : 0.08}
            />
          </mesh>

          {/* 3. Subtle Holographic Edge Wireframe Outlines (All 360° Sides) */}
          <lineSegments
            geometry={bodyEdges}
            position={[0, height / 2 + 0.5, 0]}
          >
            <lineBasicMaterial
              color={
                isSelected
                  ? '#38bdf8'
                  : isHovered
                  ? '#7dd3fc'
                  : building.healthStatus === 'red'
                  ? '#f87171'
                  : building.healthStatus === 'amber'
                  ? '#fbbf24'
                  : '#0284c7'
              }
              linewidth={isSelected ? 2 : 1}
              transparent
              opacity={isSelected ? 0.95 : isHovered ? 0.8 : 0.45}
            />
          </lineSegments>

          {/* 4. Complete 4-Sided Window Bands & Architectural Detailing */}
          {Array.from({ length: Math.min(building.floors, 7) }).map((_, i) => {
            const floorY = (height / (building.floors + 1)) * (i + 1);
            return (
              <group key={i} position={[0, floorY + 0.5, 0]}>
                {/* Front facade glass band (South) */}
                <mesh position={[0, 0, depth / 2 + 0.05]}>
                  <boxGeometry args={[width * 0.92, 0.75, 0.06]} />
                  <meshStandardMaterial
                    color="#38bdf8"
                    roughness={0.1}
                    metalness={0.85}
                    opacity={0.88}
                    transparent
                    emissive="#0284c7"
                    emissiveIntensity={0.15}
                  />
                </mesh>

                {/* Back facade glass band (North - finished 360° back view) */}
                <mesh position={[0, 0, -depth / 2 - 0.05]}>
                  <boxGeometry args={[width * 0.92, 0.75, 0.06]} />
                  <meshStandardMaterial
                    color="#38bdf8"
                    roughness={0.1}
                    metalness={0.85}
                    opacity={0.88}
                    transparent
                    emissive="#0284c7"
                    emissiveIntensity={0.15}
                  />
                </mesh>

                {/* Left side glass band (West) */}
                <mesh position={[width / 2 + 0.05, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
                  <boxGeometry args={[depth * 0.88, 0.75, 0.06]} />
                  <meshStandardMaterial
                    color="#38bdf8"
                    roughness={0.1}
                    metalness={0.85}
                    opacity={0.88}
                    transparent
                    emissive="#0284c7"
                    emissiveIntensity={0.15}
                  />
                </mesh>

                {/* Right side glass band (East) */}
                <mesh position={[-width / 2 - 0.05, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
                  <boxGeometry args={[depth * 0.88, 0.75, 0.06]} />
                  <meshStandardMaterial
                    color="#38bdf8"
                    roughness={0.1}
                    metalness={0.85}
                    opacity={0.88}
                    transparent
                    emissive="#0284c7"
                    emissiveIntensity={0.15}
                  />
                </mesh>
              </group>
            );
          })}

          {/* 5. Render Distinct Building Wings if configured */}
          {building.wings && building.wings.map((wing) => {
            const [ww, wh, wd] = wing.size;
            const [ox, oy, oz] = wing.offset;
            return (
              <group key={wing.id} position={[ox, wh / 2 + 0.5 + oy, oz]}>
                <mesh castShadow receiveShadow>
                  <boxGeometry args={[ww, wh, wd]} />
                  <meshStandardMaterial
                    color={buildingColor}
                    roughness={0.4}
                    metalness={0.1}
                  />
                </mesh>
                {/* Wing roof slab */}
                <mesh position={[0, wh / 2 + 0.15, 0]} castShadow>
                  <boxGeometry args={[ww + 0.2, 0.3, wd + 0.2]} />
                  <meshStandardMaterial color={roofColor} />
                </mesh>
              </group>
            );
          })}

          {/* 6. Rear Service / Staircase Tower (Ensures realistic backside) */}
          <group position={[width * 0.25, height / 2 + 0.5, -depth / 2 - 0.7]}>
            <mesh castShadow receiveShadow>
              <boxGeometry args={[width * 0.2, height * 1.05, 1.4]} />
              <meshStandardMaterial color="#64748b" roughness={0.6} />
            </mesh>
            {/* Rear access double door */}
            <mesh position={[0, -height / 2 + 1.0, -0.72]}>
              <boxGeometry args={[1.6, 2.0, 0.05]} />
              <meshStandardMaterial color="#1e293b" />
            </mesh>
          </group>
        </>
      )}

      {/* 7. Roof Terrace, Utilities & Holographic Parapet */}
      <group position={[0, height + 0.5, 0]}>
        {/* Roof slab */}
        <mesh position={[0, 0.2, 0]} receiveShadow castShadow>
          <boxGeometry args={[width + 0.4, 0.4, depth + 0.4]} />
          <meshStandardMaterial color={roofColor} roughness={0.5} />
        </mesh>

        {/* Roof Holographic Edges */}
        <lineSegments geometry={roofEdges} position={[0, 0.2, 0]}>
          <lineBasicMaterial color="#38bdf8" linewidth={1} transparent opacity={0.5} />
        </lineSegments>

        {/* Rooftop Parapet Perimeter */}
        <mesh position={[0, 0.5, depth / 2 + 0.1]}>
          <boxGeometry args={[width + 0.4, 0.4, 0.2]} />
          <meshStandardMaterial color="#64748b" />
        </mesh>
        <mesh position={[0, 0.5, -depth / 2 - 0.1]}>
          <boxGeometry args={[width + 0.4, 0.4, 0.2]} />
          <meshStandardMaterial color="#64748b" />
        </mesh>
        <mesh position={[width / 2 + 0.1, 0.5, 0]} rotation={[0, Math.PI / 2, 0]}>
          <boxGeometry args={[depth + 0.4, 0.4, 0.2]} />
          <meshStandardMaterial color="#64748b" />
        </mesh>
        <mesh position={[-width / 2 - 0.1, 0.5, 0]} rotation={[0, Math.PI / 2, 0]}>
          <boxGeometry args={[depth + 0.4, 0.4, 0.2]} />
          <meshStandardMaterial color="#64748b" />
        </mesh>

        {/* Rooftop Utilities: HVAC Chillers, Cooling Towers & Elevator Penthouse */}
        <mesh position={[-width * 0.2, 0.9, -depth * 0.2]} castShadow>
          <boxGeometry args={[width * 0.25, 1.2, depth * 0.25]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.4} roughness={0.4} />
        </mesh>
        <mesh position={[width * 0.25, 0.7, depth * 0.15]} castShadow>
          <boxGeometry args={[width * 0.2, 0.8, depth * 0.2]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.5} roughness={0.3} />
        </mesh>

        {/* Status Indicator Light / Beacon */}
        <mesh position={[0, 1.2, 0]}>
          <sphereGeometry args={[0.55, 16, 16]} />
          <meshStandardMaterial
            color={statusColorInfo.hex}
            emissive={statusColorInfo.hex}
            emissiveIntensity={building.healthStatus === 'red' ? 2.5 : 1.2}
          />
        </mesh>

        {(building.healthStatus === 'red' || building.healthStatus === 'amber') && (
          <pointLight
            ref={beaconRef}
            position={[0, 2, 0]}
            color={statusColorInfo.hex}
            intensity={2}
            distance={15}
          />
        )}
      </group>

      {/* 8. Front Entrance Portico with Support Pillars */}
      <group position={[0, 1.5, depth / 2 + 1.2]}>
        <mesh position={[0, 0.2, 0]} castShadow>
          <boxGeometry args={[width * 0.35, 0.3, 2.4]} />
          <meshStandardMaterial color="#0284c7" roughness={0.3} />
        </mesh>
        {/* Support pillars */}
        <mesh position={[-width * 0.14, -0.7, 0.9]} castShadow>
          <cylinderGeometry args={[0.2, 0.2, 1.8]} />
          <meshStandardMaterial color="#e2e8f0" />
        </mesh>
        <mesh position={[width * 0.14, -0.7, 0.9]} castShadow>
          <cylinderGeometry args={[0.2, 0.2, 1.8]} />
          <meshStandardMaterial color="#e2e8f0" />
        </mesh>
        {/* Entrance Portal / Double Doors */}
        <mesh position={[0, -0.3, -1.15]}>
          <planeGeometry args={[width * 0.25, 2.2]} />
          <meshStandardMaterial color="#0f172a" roughness={0.2} metalness={0.7} />
        </mesh>
      </group>

      {/* 9. Selection Highlight Halo ring around building */}
      {isSelected && (
        <mesh position={[0, 0.08, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[Math.max(width, depth) * 0.65, Math.max(width, depth) * 0.74, 48]} />
          <meshBasicMaterial color="#38bdf8" side={THREE.DoubleSide} transparent opacity={0.85} />
        </mesh>
      )}

      {/* 10. Readability-Optimized 3D Billboard Label */}
      {showLabels && (
        <Html
          position={[0, height + 3.4, 0]}
          center
          distanceFactor={60}
          zIndexRange={[10, 0]}
          className="pointer-events-none select-none transition-transform duration-200"
        >
          <div
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full shadow-lg border backdrop-blur-md transition-all ${
              isSelected
                ? 'bg-slate-900/90 text-white border-sky-400 ring-2 ring-sky-400/50 scale-110'
                : isHovered
                ? 'bg-white/95 text-slate-800 border-sky-300 scale-105'
                : 'bg-white/90 text-slate-800 border-slate-200'
            }`}
          >
            {/* Status dot */}
            <span className="relative flex h-2.5 w-2.5">
              {building.healthStatus === 'red' && (
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              )}
              {building.healthStatus === 'amber' && (
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              )}
              <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${statusColorInfo.labelBg}`}></span>
            </span>

            {/* Building Name */}
            <span className="text-xs font-semibold whitespace-nowrap tracking-tight">
              {building.shortName}
            </span>

            {/* Code pill */}
            <span
              className={`text-[10px] font-mono px-1 py-0.5 rounded ${
                isSelected ? 'bg-slate-800 text-sky-300' : 'bg-slate-100 text-slate-500'
              }`}
            >
              {building.code}
            </span>
          </div>
        </Html>
      )}
    </group>
  );
};
