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
  isAnyDrawerOpen?: boolean;
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
  showLabels,
  isAnyDrawerOpen = false
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const beaconRef = useRef<THREE.PointLight>(null);
  const pulseMeshRef = useRef<THREE.Mesh>(null);

  const [width, height, depth] = building.dimensions;
  const statusColorInfo = STATUS_COLORS[building.healthStatus];

  // Base building colors with realistic architectural tones
  const buildingColor = useMemo(() => {
    if (building.healthStatus === 'red') return '#fee2e2'; // Soft alert tint
    if (building.healthStatus === 'amber') return '#fef3c7'; // Soft caution tint
    if (building.healthStatus === 'grey') return '#e2e8f0'; // Neutral slate
    return building.primaryColor || '#f8fafc'; // Architectural off-white
  }, [building.healthStatus, building.primaryColor]);

  const facadeAccentColor = useMemo(() => {
    if (building.healthStatus === 'red') return '#ef4444';
    if (building.healthStatus === 'amber') return '#f59e0b';
    return building.accentColor || '#0369a1';
  }, [building.healthStatus, building.accentColor]);

  const roofColor = useMemo(() => {
    if (building.healthStatus === 'red') return '#dc2626';
    if (building.healthStatus === 'amber') return '#d97706';
    if (building.healthStatus === 'grey') return '#64748b';
    return '#334155'; // Dark architectural roofing membrane
  }, [building.healthStatus]);

  // Dynamic animation for alerts (pulsing red or amber)
  useFrame((state) => {
    if (building.healthStatus === 'red' && beaconRef.current) {
      const t = state.clock.getElapsedTime();
      beaconRef.current.intensity = 2.0 + Math.sin(t * 8) * 1.5;
      if (pulseMeshRef.current) {
        pulseMeshRef.current.scale.setScalar(1 + (Math.sin(t * 4) + 1) * 0.015);
      }
    } else if (building.healthStatus === 'amber' && beaconRef.current) {
      const t = state.clock.getElapsedTime();
      beaconRef.current.intensity = 1.0 + Math.sin(t * 3) * 0.5;
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
          {/* 1. Base Paved Pedestrian Apron & Concrete Plinth */}
          <group position={[0, 0, 0]}>
            {/* Wide Pedestrian Plaza Apron */}
            <mesh position={[0, 0.05, 0]} receiveShadow>
              <boxGeometry args={[width + 3.2, 0.1, depth + 3.2]} />
              <meshStandardMaterial color="#e2e8f0" roughness={0.7} />
            </mesh>
            {/* Foundation Plinth */}
            <mesh position={[0, 0.25, 0]} castShadow receiveShadow>
              <boxGeometry args={[width + 1.2, 0.4, depth + 1.2]} />
              <meshStandardMaterial color="#94a3b8" roughness={0.8} />
            </mesh>

            {/* Manicured Landscaping Hedges around foundation */}
            <mesh position={[0, 0.4, depth / 2 + 1.2]} castShadow>
              <boxGeometry args={[width * 0.85, 0.5, 0.4]} />
              <meshStandardMaterial color="#15803d" roughness={0.9} />
            </mesh>
            <mesh position={[0, 0.4, -depth / 2 - 1.2]} castShadow>
              <boxGeometry args={[width * 0.85, 0.5, 0.4]} />
              <meshStandardMaterial color="#15803d" roughness={0.9} />
            </mesh>
          </group>

          {/* 2. Main Structural Facade Body */}
          <mesh
            ref={pulseMeshRef}
            position={[0, height / 2 + 0.45, 0]}
            castShadow
            receiveShadow
          >
            <boxGeometry args={[width, height, depth]} />
            <meshStandardMaterial
              color={buildingColor}
              roughness={0.4}
              metalness={0.08}
              emissive={
                isSelected
                  ? '#0284c7'
                  : building.healthStatus === 'red'
                  ? '#7f1d1d'
                  : building.healthStatus === 'amber'
                  ? '#78350f'
                  : '#000000'
              }
              emissiveIntensity={isSelected ? 0.4 : building.healthStatus === 'red' ? 0.35 : 0.1}
            />
          </mesh>

          {/* 3. Architectural Corner Accent Columns */}
          <group position={[0, height / 2 + 0.45, 0]}>
            {/* Front Left */}
            <mesh position={[-width / 2 + 0.3, 0, depth / 2 + 0.05]} castShadow>
              <boxGeometry args={[0.6, height + 0.1, 0.4]} />
              <meshStandardMaterial color={facadeAccentColor} roughness={0.3} metalness={0.2} />
            </mesh>
            {/* Front Right */}
            <mesh position={[width / 2 - 0.3, 0, depth / 2 + 0.05]} castShadow>
              <boxGeometry args={[0.6, height + 0.1, 0.4]} />
              <meshStandardMaterial color={facadeAccentColor} roughness={0.3} metalness={0.2} />
            </mesh>
            {/* Center Header Brand Stripe */}
            <mesh position={[0, height / 2 - 0.5, depth / 2 + 0.06]}>
              <boxGeometry args={[width * 0.6, 0.8, 0.1]} />
              <meshStandardMaterial color={facadeAccentColor} roughness={0.3} metalness={0.2} />
            </mesh>
          </group>

          {/* 4. Realistic Reflective Glass Window Bands & Mullions */}
          {Array.from({ length: Math.min(building.floors, 7) }).map((_, i) => {
            const floorY = (height / (building.floors + 1)) * (i + 1);
            return (
              <group key={i} position={[0, floorY + 0.45, 0]}>
                {/* Front Reflective Curtain Glass */}
                <mesh position={[0, 0, depth / 2 + 0.06]}>
                  <boxGeometry args={[width * 0.90, 0.75, 0.05]} />
                  <meshStandardMaterial
                    color="#0f172a"
                    roughness={0.12}
                    metalness={0.88}
                    transparent
                    opacity={0.85}
                  />
                </mesh>
                {/* Front Window Aluminum Mullions (Division lines) */}
                {[-0.3, 0, 0.3].map((mX, mIdx) => (
                  <mesh key={mIdx} position={[width * mX, 0, depth / 2 + 0.09]}>
                    <boxGeometry args={[0.08, 0.76, 0.02]} />
                    <meshStandardMaterial color="#475569" metalness={0.7} roughness={0.3} />
                  </mesh>
                ))}

                {/* Back Window Band */}
                <mesh position={[0, 0, -depth / 2 - 0.06]}>
                  <boxGeometry args={[width * 0.90, 0.75, 0.05]} />
                  <meshStandardMaterial
                    color="#0f172a"
                    roughness={0.12}
                    metalness={0.88}
                    transparent
                    opacity={0.85}
                  />
                </mesh>

                {/* Side Window Bands */}
                <mesh position={[width / 2 + 0.06, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
                  <boxGeometry args={[depth * 0.86, 0.75, 0.05]} />
                  <meshStandardMaterial
                    color="#0f172a"
                    roughness={0.12}
                    metalness={0.88}
                    transparent
                    opacity={0.85}
                  />
                </mesh>
                <mesh position={[-width / 2 - 0.06, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
                  <boxGeometry args={[depth * 0.86, 0.75, 0.05]} />
                  <meshStandardMaterial
                    color="#0f172a"
                    roughness={0.12}
                    metalness={0.88}
                    transparent
                    opacity={0.85}
                  />
                </mesh>
              </group>
            );
          })}

          {/* 5. Distinct Building Wings if configured */}
          {building.wings && building.wings.map((wing) => {
            const [ww, wh, wd] = wing.size;
            const [ox, oy, oz] = wing.offset;
            return (
              <group key={wing.id} position={[ox, wh / 2 + 0.45 + oy, oz]}>
                <mesh castShadow receiveShadow>
                  <boxGeometry args={[ww, wh, wd]} />
                  <meshStandardMaterial color={buildingColor} roughness={0.4} metalness={0.08} />
                </mesh>
                {/* Wing roof slab */}
                <mesh position={[0, wh / 2 + 0.15, 0]} castShadow>
                  <boxGeometry args={[ww + 0.3, 0.3, wd + 0.3]} />
                  <meshStandardMaterial color={roofColor} />
                </mesh>
              </group>
            );
          })}
        </>
      )}

      {/* 6. Realistic Rooftop Terrace, HVAC Chillers & Solar Panels */}
      <group position={[0, height + 0.45, 0]}>
        {/* Roof slab */}
        <mesh position={[0, 0.2, 0]} receiveShadow castShadow>
          <boxGeometry args={[width + 0.4, 0.4, depth + 0.4]} />
          <meshStandardMaterial color={roofColor} roughness={0.5} />
        </mesh>

        {/* Parapet Perimeter Coping */}
        <mesh position={[0, 0.5, depth / 2 + 0.1]}>
          <boxGeometry args={[width + 0.4, 0.4, 0.2]} />
          <meshStandardMaterial color="#64748b" roughness={0.4} />
        </mesh>
        <mesh position={[0, 0.5, -depth / 2 - 0.1]}>
          <boxGeometry args={[width + 0.4, 0.4, 0.2]} />
          <meshStandardMaterial color="#64748b" roughness={0.4} />
        </mesh>
        <mesh position={[width / 2 + 0.1, 0.5, 0]} rotation={[0, Math.PI / 2, 0]}>
          <boxGeometry args={[depth + 0.4, 0.4, 0.2]} />
          <meshStandardMaterial color="#64748b" roughness={0.4} />
        </mesh>
        <mesh position={[-width / 2 - 0.1, 0.5, 0]} rotation={[0, Math.PI / 2, 0]}>
          <boxGeometry args={[depth + 0.4, 0.4, 0.2]} />
          <meshStandardMaterial color="#64748b" roughness={0.4} />
        </mesh>

        {/* Realistic HVAC Chiller Unit with Cooling Fan Grilles */}
        <group position={[-width * 0.22, 0.9, -depth * 0.2]}>
          <mesh castShadow>
            <boxGeometry args={[width * 0.25, 1.1, depth * 0.25]} />
            <meshStandardMaterial color="#94a3b8" metalness={0.6} roughness={0.3} />
          </mesh>
          {/* Fan discharge grille on top */}
          <mesh position={[0, 0.56, 0]}>
            <cylinderGeometry args={[0.5, 0.5, 0.05, 16]} />
            <meshStandardMaterial color="#1e293b" metalness={0.8} roughness={0.2} />
          </mesh>
        </group>

        {/* Elevator Penthouse */}
        <group position={[width * 0.25, 1.0, depth * 0.15]}>
          <mesh castShadow>
            <boxGeometry args={[width * 0.2, 1.4, depth * 0.2]} />
            <meshStandardMaterial color="#cbd5e1" roughness={0.4} />
          </mesh>
          <mesh position={[0, 0.72, 0]}>
            <boxGeometry args={[width * 0.22, 0.1, depth * 0.22]} />
            <meshStandardMaterial color="#475569" />
          </mesh>
        </group>

        {/* Photovoltaic Solar Panels for Academic Buildings */}
        {width > 20 && (
          <group position={[0, 0.5, 0]}>
            {[-width * 0.2, 0, width * 0.2].map((spX, spIdx) => (
              <mesh key={spIdx} position={[spX, 0.1, 0]} rotation={[-0.2, 0, 0]} castShadow>
                <boxGeometry args={[width * 0.15, 0.05, depth * 0.28]} />
                <meshStandardMaterial color="#1e3a8a" metalness={0.85} roughness={0.15} />
              </mesh>
            ))}
          </group>
        )}

        {/* Communication Antenna Mast with Red Beacon */}
        <mesh position={[0, 1.8, 0]} castShadow>
          <cylinderGeometry args={[0.04, 0.06, 2.6, 6]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.9} roughness={0.2} />
        </mesh>
        {/* Status Light Beacon */}
        <mesh position={[0, 3.1, 0]}>
          <sphereGeometry args={[0.35, 16, 16]} />
          <meshStandardMaterial
            color={statusColorInfo.hex}
            emissive={statusColorInfo.hex}
            emissiveIntensity={building.healthStatus === 'red' ? 3.0 : 1.5}
          />
        </mesh>

        {(building.healthStatus === 'red' || building.healthStatus === 'amber') && (
          <pointLight
            ref={beaconRef}
            position={[0, 3.2, 0]}
            color={statusColorInfo.hex}
            intensity={2}
            distance={20}
          />
        )}
      </group>

      {/* 7. Modern Entrance Canopy with Stainless Steel Tension Supports */}
      <group position={[0, 1.5, depth / 2 + 1.2]}>
        {/* Translucent Glass Canopy Roof */}
        <mesh position={[0, 0.2, 0]} castShadow>
          <boxGeometry args={[width * 0.35, 0.15, 2.6]} />
          <meshStandardMaterial color="#0284c7" roughness={0.1} metalness={0.8} transparent opacity={0.85} />
        </mesh>
        {/* Canopy Aluminum Trim */}
        <mesh position={[0, 0.2, 1.3]}>
          <boxGeometry args={[width * 0.36, 0.18, 0.08]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.8} roughness={0.2} />
        </mesh>
        {/* Stainless Steel Support Pillars */}
        <mesh position={[-width * 0.15, -0.65, 1.0]} castShadow>
          <cylinderGeometry args={[0.15, 0.15, 1.7, 12]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.7} roughness={0.3} />
        </mesh>
        <mesh position={[width * 0.15, -0.65, 1.0]} castShadow>
          <cylinderGeometry args={[0.15, 0.15, 1.7, 12]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.7} roughness={0.3} />
        </mesh>

        {/* Automatic Sliding Glass Entrance Doors */}
        <mesh position={[0, -0.4, -1.1]}>
          <planeGeometry args={[width * 0.22, 2.0]} />
          <meshStandardMaterial color="#0f172a" roughness={0.15} metalness={0.8} />
        </mesh>
      </group>

      {/* 8. Selection Highlight Halo Ring */}
      {isSelected && (
        <mesh position={[0, 0.08, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[Math.max(width, depth) * 0.65, Math.max(width, depth) * 0.74, 48]} />
          <meshBasicMaterial color="#0284c7" side={THREE.DoubleSide} transparent opacity={0.85} />
        </mesh>
      )}

      {/* 9. Readability-Optimized 3D Billboard Label
          CRITICAL FIX:
          - Position lowered to [0, height + 1.6, 0] so it neatly sits above roof coping
            without projecting into top navigation bars or option menus.
          - zIndexRange set strictly to [5, 0] so labels NEVER float above top headers (z-50), 
            health metric bars (z-40), toggle switches (z-30), or side drawers (z-50)!
          - occlude={true} enables automatic raycast occlusion so labels hide behind 
            intervening geometry rather than floating in front of other options!
          - Auto-hides when right drawer is open for buildings in the right half of campus!
      */}
      {showLabels && (!isAnyDrawerOpen || building.position[0] < 12) && (
        <Html
          position={[0, height + 1.6, 0]}
          center
          distanceFactor={52}
          zIndexRange={[5, 0]}
          occlude
          className="pointer-events-none select-none transition-all duration-200"
        >
          <div
            className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full shadow-xs border backdrop-blur-md transition-all ${
              isSelected
                ? 'bg-slate-950/95 text-white border-sky-400 ring-2 ring-sky-400/50 scale-105 shadow-md'
                : isHovered
                ? 'bg-white/95 text-slate-800 border-sky-300 scale-105 shadow-md'
                : 'bg-white/85 text-slate-700 border-slate-200/80 hover:bg-white'
            }`}
          >
            {/* Status dot */}
            <span className="relative flex h-1.5 w-1.5">
              {building.healthStatus === 'red' && (
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              )}
              {building.healthStatus === 'amber' && (
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              )}
              <span className={`relative inline-flex rounded-full h-1.5 w-1.5 ${statusColorInfo.labelBg}`}></span>
            </span>

            {/* Building Name */}
            <span className="text-[11px] font-semibold whitespace-nowrap tracking-tight">
              {building.shortName}
            </span>

            {/* Code pill */}
            <span
              className={`text-[9px] font-mono px-1 py-0.2 rounded font-bold ${
                isSelected ? 'bg-slate-800 text-sky-300' : 'bg-slate-100 text-slate-600'
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
