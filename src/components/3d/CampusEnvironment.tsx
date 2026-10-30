import React from 'react';
import * as THREE from 'three';

// 1. Realistic Broadleaf Shade Tree (Volumetric organic clustered canopies)
const RealisticShadeTree: React.FC<{
  position: [number, number, number];
  scale?: number;
  rotation?: number;
}> = ({ position, scale = 1, rotation = 0 }) => {
  return (
    <group position={position} scale={[scale, scale, scale]} rotation={[0, rotation, 0]}>
      {/* Root flare & Plinth */}
      <mesh position={[0, 0.15, 0]} castShadow>
        <cylinderGeometry args={[0.35, 0.55, 0.3, 8]} />
        <meshStandardMaterial color="#452a1a" roughness={0.9} />
      </mesh>
      {/* Tapered natural bark trunk */}
      <mesh position={[0, 1.4, 0]} castShadow>
        <cylinderGeometry args={[0.22, 0.35, 2.4, 8]} />
        <meshStandardMaterial color="#533522" roughness={0.9} />
      </mesh>

      {/* Primary canopy sphere (Lower lush green) */}
      <mesh position={[0, 3.0, 0]} castShadow>
        <sphereGeometry args={[1.6, 10, 8]} />
        <meshStandardMaterial color="#166534" roughness={0.8} />
      </mesh>
      {/* Secondary canopy sphere (Mid vibrant green offset) */}
      <mesh position={[0.4, 3.7, 0.3]} castShadow>
        <sphereGeometry args={[1.3, 10, 8]} />
        <meshStandardMaterial color="#15803d" roughness={0.78} />
      </mesh>
      {/* Third canopy sphere (Opposite side) */}
      <mesh position={[-0.45, 3.6, -0.3]} castShadow>
        <sphereGeometry args={[1.25, 10, 8]} />
        <meshStandardMaterial color="#16a34a" roughness={0.82} />
      </mesh>
      {/* Crown top dome */}
      <mesh position={[0, 4.4, 0]} castShadow>
        <sphereGeometry args={[1.0, 8, 8]} />
        <meshStandardMaterial color="#22c55e" roughness={0.8} />
      </mesh>
    </group>
  );
};

// 2. Realistic Royal Palm Tree (Iconic South Indian university campus palm)
const RoyalPalmTree: React.FC<{
  position: [number, number, number];
  scale?: number;
}> = ({ position, scale = 1 }) => {
  return (
    <group position={position} scale={[scale, scale, scale]}>
      {/* Slender ringed trunk */}
      <mesh position={[0, 3.0, 0]} castShadow>
        <cylinderGeometry args={[0.18, 0.32, 6.0, 8]} />
        <meshStandardMaterial color="#78716c" roughness={0.85} />
      </mesh>
      {/* Upper green palm sheath */}
      <mesh position={[0, 6.1, 0]} castShadow>
        <cylinderGeometry args={[0.22, 0.2, 0.8, 8]} />
        <meshStandardMaterial color="#15803d" roughness={0.7} />
      </mesh>

      {/* Radiating Curved Palm Fronds */}
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, idx) => {
        const rad = (angle * Math.PI) / 180;
        return (
          <group key={idx} position={[0, 6.4, 0]} rotation={[0.4, rad, 0]}>
            <mesh position={[0, 0.8, 1.2]} rotation={[0.5, 0, 0]} castShadow>
              <boxGeometry args={[0.45, 0.05, 2.4]} />
              <meshStandardMaterial color="#16a34a" roughness={0.65} side={THREE.DoubleSide} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
};

// 3. Modern Campus LED Streetlight Post
const CampusLEDStreetlight: React.FC<{
  position: [number, number, number];
  rotationY?: number;
}> = ({ position, rotationY = 0 }) => {
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      {/* Heavy Steel Base Flange */}
      <mesh position={[0, 0.2, 0]}>
        <cylinderGeometry args={[0.25, 0.3, 0.4, 8]} />
        <meshStandardMaterial color="#1e293b" metalness={0.7} roughness={0.3} />
      </mesh>
      {/* Slender Architectural Pole */}
      <mesh position={[0, 3.2, 0]}>
        <cylinderGeometry args={[0.08, 0.12, 6.0, 8]} />
        <meshStandardMaterial color="#334155" metalness={0.8} roughness={0.25} />
      </mesh>
      {/* Horizontal Cantilever Arm */}
      <mesh position={[0.7, 6.2, 0]} rotation={[0, 0, -Math.PI / 2]}>
        <cylinderGeometry args={[0.06, 0.06, 1.4, 8]} />
        <meshStandardMaterial color="#334155" metalness={0.8} roughness={0.25} />
      </mesh>
      {/* LED Fixture Head */}
      <mesh position={[1.4, 6.15, 0]}>
        <boxGeometry args={[0.55, 0.12, 0.28]} />
        <meshStandardMaterial color="#0f172a" metalness={0.9} roughness={0.2} />
      </mesh>
      {/* Luminaire Lens with Warm White Emissive Glow */}
      <mesh position={[1.4, 6.08, 0]}>
        <planeGeometry args={[0.48, 0.22]} />
        <meshStandardMaterial
          color="#fef08a"
          emissive="#fef08a"
          emissiveIntensity={2.5}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
};

// 4. University Park Bench (Teak Wood & Cast Iron)
const CampusBench: React.FC<{
  position: [number, number, number];
  rotationY?: number;
}> = ({ position, rotationY = 0 }) => {
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      {/* Wood Seat Plank */}
      <mesh position={[0, 0.45, 0]} castShadow>
        <boxGeometry args={[1.8, 0.08, 0.55]} />
        <meshStandardMaterial color="#b45309" roughness={0.6} />
      </mesh>
      {/* Wood Backrest Plank */}
      <mesh position={[0, 0.85, -0.24]} rotation={[0.15, 0, 0]} castShadow>
        <boxGeometry args={[1.8, 0.35, 0.06]} />
        <meshStandardMaterial color="#b45309" roughness={0.6} />
      </mesh>
      {/* Black Cast Iron Legs */}
      <mesh position={[-0.75, 0.25, 0]}>
        <boxGeometry args={[0.08, 0.5, 0.5]} />
        <meshStandardMaterial color="#0f172a" roughness={0.5} metalness={0.8} />
      </mesh>
      <mesh position={[0.75, 0.25, 0]}>
        <boxGeometry args={[0.08, 0.5, 0.5]} />
        <meshStandardMaterial color="#0f172a" roughness={0.5} metalness={0.8} />
      </mesh>
    </group>
  );
};

// 5. High-Definition Pedestrian Zebra Crossing
const ZebraCrossing: React.FC<{
  position: [number, number, number];
  width: number;
  length: number;
  stripes?: number;
  rotationY?: number;
}> = ({ position, width, length, stripes = 7, rotationY = 0 }) => {
  const stripeWidth = width / (stripes * 2 - 1);
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      {Array.from({ length: stripes }).map((_, i) => {
        const xOffset = -width / 2 + (i * 2 + 0.5) * stripeWidth;
        return (
          <mesh key={i} position={[xOffset, 0.02, 0]}>
            <planeGeometry args={[stripeWidth * 0.9, length]} />
            <meshStandardMaterial color="#ffffff" roughness={0.4} />
          </mesh>
        );
      })}
    </group>
  );
};

// 6. University Bus Model (SRM Yellow & Navy Transit)
const UniversityBus: React.FC<{
  position: [number, number, number];
  rotation?: [number, number, number];
}> = ({ position, rotation = [0, 0, 0] }) => {
  return (
    <group position={position} rotation={rotation}>
      {/* Main Body (Iconic SRM College Yellow) */}
      <mesh position={[0, 1.1, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.5, 1.9, 7.2]} />
        <meshStandardMaterial color="#facc15" roughness={0.25} metalness={0.15} />
      </mesh>
      {/* Lower Navy Blue Transit Stripe */}
      <mesh position={[0, 0.45, 0]}>
        <boxGeometry args={[2.52, 0.4, 7.22]} />
        <meshStandardMaterial color="#1e3a8a" roughness={0.3} metalness={0.2} />
      </mesh>
      {/* Front Windshield */}
      <mesh position={[0, 1.4, 3.62]} rotation={[-0.1, 0, 0]}>
        <planeGeometry args={[2.3, 1.2]} />
        <meshStandardMaterial color="#0f172a" roughness={0.1} metalness={0.9} />
      </mesh>
      {/* Front Headlights */}
      <mesh position={[-0.8, 0.6, 3.63]}>
        <planeGeometry args={[0.3, 0.2]} />
        <meshStandardMaterial color="#fef08a" emissive="#fef08a" emissiveIntensity={1.2} />
      </mesh>
      <mesh position={[0.8, 0.6, 3.63]}>
        <planeGeometry args={[0.3, 0.2]} />
        <meshStandardMaterial color="#fef08a" emissive="#fef08a" emissiveIntensity={1.2} />
      </mesh>
      {/* Side Tinted Passenger Windows */}
      <mesh position={[1.27, 1.4, 0]}>
        <boxGeometry args={[0.02, 0.9, 5.8]} />
        <meshStandardMaterial color="#0f172a" roughness={0.15} metalness={0.85} />
      </mesh>
      <mesh position={[-1.27, 1.4, 0]}>
        <boxGeometry args={[0.02, 0.9, 5.8]} />
        <meshStandardMaterial color="#0f172a" roughness={0.15} metalness={0.85} />
      </mesh>
      {/* White Roof Shell & Air Conditioners */}
      <mesh position={[0, 2.1, 0]} castShadow>
        <boxGeometry args={[2.45, 0.12, 7.1]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.3} />
      </mesh>
      <mesh position={[0, 2.25, 0.5]} castShadow>
        <boxGeometry args={[1.4, 0.25, 2.2]} />
        <meshStandardMaterial color="#e2e8f0" roughness={0.4} />
      </mesh>
      {/* Rubber Tires & Hubcaps */}
      {[-1.3, 1.3].map((sideX, sIdx) => (
        <React.Fragment key={sIdx}>
          <mesh position={[sideX, 0.45, 2.1]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.45, 0.45, 0.24, 16]} />
            <meshStandardMaterial color="#18181b" roughness={0.9} />
          </mesh>
          <mesh position={[sideX, 0.45, -2.1]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.45, 0.45, 0.24, 16]} />
            <meshStandardMaterial color="#18181b" roughness={0.9} />
          </mesh>
        </React.Fragment>
      ))}
    </group>
  );
};

// 7. Campus Security Patrol Electric Car
const SecurityPatrolCar: React.FC<{
  position: [number, number, number];
  rotationY?: number;
}> = ({ position, rotationY = 0 }) => {
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      {/* Car Lower Chassis */}
      <mesh position={[0, 0.5, 0]} castShadow>
        <boxGeometry args={[1.8, 0.6, 3.8]} />
        <meshStandardMaterial color="#ffffff" roughness={0.3} metalness={0.2} />
      </mesh>
      {/* Security Blue Accent Line */}
      <mesh position={[0, 0.45, 0]}>
        <boxGeometry args={[1.82, 0.15, 3.82]} />
        <meshStandardMaterial color="#0284c7" />
      </mesh>
      {/* Cabin Glass Greenhouse */}
      <mesh position={[0, 1.05, -0.2]} castShadow>
        <boxGeometry args={[1.5, 0.6, 2.0]} />
        <meshStandardMaterial color="#0f172a" roughness={0.1} metalness={0.9} />
      </mesh>
      {/* Roof Lightbar (Red/Blue Flashing Hazard) */}
      <mesh position={[0, 1.42, -0.2]}>
        <boxGeometry args={[0.9, 0.1, 0.25]} />
        <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={1.8} />
      </mesh>
      {/* Wheels */}
      {[-0.95, 0.95].map((wx, wi) => (
        <React.Fragment key={wi}>
          <mesh position={[wx, 0.3, 1.1]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.3, 0.3, 0.18, 14]} />
            <meshStandardMaterial color="#18181b" roughness={0.8} />
          </mesh>
          <mesh position={[wx, 0.3, -1.1]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.3, 0.3, 0.18, 14]} />
            <meshStandardMaterial color="#18181b" roughness={0.8} />
          </mesh>
        </React.Fragment>
      ))}
    </group>
  );
};

// 8. 3D Basketball Hoop Stanchion
const BasketballHoop: React.FC<{
  position: [number, number, number];
  rotationY?: number;
}> = ({ position, rotationY = 0 }) => {
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      {/* Heavy Ground Anchor Base */}
      <mesh position={[0, 0.2, 0]}>
        <boxGeometry args={[0.6, 0.4, 0.6]} />
        <meshStandardMaterial color="#334155" />
      </mesh>
      {/* Gooseneck Angled Post */}
      <mesh position={[0, 2.0, 0]}>
        <cylinderGeometry args={[0.07, 0.08, 4.0, 8]} />
        <meshStandardMaterial color="#0284c7" metalness={0.7} roughness={0.3} />
      </mesh>
      <mesh position={[0, 3.8, 0.4]} rotation={[0.4, 0, 0]}>
        <cylinderGeometry args={[0.07, 0.07, 1.0, 8]} />
        <meshStandardMaterial color="#0284c7" metalness={0.7} roughness={0.3} />
      </mesh>
      {/* Clear Acrylic Backboard */}
      <mesh position={[0, 3.8, 0.85]}>
        <boxGeometry args={[1.8, 1.1, 0.04]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.1} metalness={0.8} transparent opacity={0.85} />
      </mesh>
      {/* Orange Breakaway Rim & Net */}
      <mesh position={[0, 3.45, 1.15]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.3, 0.03, 8, 16]} />
        <meshStandardMaterial color="#ea580c" roughness={0.4} />
      </mesh>
    </group>
  );
};

export const CampusEnvironment: React.FC = () => {
  return (
    <group>
      {/* -------------------------------------------------------------
          1. TERRAIN & GROUND PLANE
      ------------------------------------------------------------- */}
      {/* Outer Regional Master Terrain */}
      <mesh position={[0, -0.15, 0]} receiveShadow>
        <planeGeometry args={[280, 240]} />
        <meshStandardMaterial color="#e2e8f0" roughness={0.9} />
      </mesh>

      {/* Official SRM Easwari Campus Lawns (Rich manicured grass) */}
      <mesh position={[-2, 0.01, 8]} receiveShadow>
        <planeGeometry args={[175, 135]} />
        <meshStandardMaterial color="#f0fdf4" roughness={0.85} />
      </mesh>

      {/* Subtle Coordinate Grid Guide */}
      <gridHelper
        args={[175, 35, '#38bdf8', '#cbd5e1']}
        position={[-2, 0.02, 8]}
      />

      {/* -------------------------------------------------------------
          2. BHARATHI SALAI MAIN AVENUE (Southern Boundary Highway)
      ------------------------------------------------------------- */}
      <group position={[0, 0.05, 48]}>
        {/* Dark Asphalt Highway */}
        <mesh receiveShadow>
          <planeGeometry args={[250, 15]} />
          <meshStandardMaterial color="#1e293b" roughness={0.75} />
        </mesh>

        {/* Solid Yellow Highway Center Divider */}
        <mesh position={[0, 0.015, 0]}>
          <planeGeometry args={[246, 0.4]} />
          <meshBasicMaterial color="#eab308" />
        </mesh>

        {/* White Solid Outer Edge Lines */}
        <mesh position={[0, 0.015, -6.6]}>
          <planeGeometry args={[246, 0.25]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
        <mesh position={[0, 0.015, 6.6]}>
          <planeGeometry args={[246, 0.25]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>

        {/* North Elevated Sidewalk with Granite Curb */}
        <mesh position={[0, 0.18, -8.2]} receiveShadow>
          <boxGeometry args={[250, 0.35, 1.6]} />
          <meshStandardMaterial color="#94a3b8" roughness={0.7} />
        </mesh>
        {/* South Sidewalk */}
        <mesh position={[0, 0.18, 8.2]} receiveShadow>
          <boxGeometry args={[250, 0.35, 1.6]} />
          <meshStandardMaterial color="#94a3b8" roughness={0.7} />
        </mesh>

        {/* Pedestrian Zebra Crosswalk at Main Entrance Gate 1 */}
        <ZebraCrossing position={[-5, 0.02, 0]} width={9} length={13.5} stripes={9} />

        {/* Avenue LED Streetlights along Bharathi Salai */}
        {[-85, -55, -25, 15, 45, 75].map((lx, lIdx) => (
          <CampusLEDStreetlight
            key={`light-bs-${lIdx}`}
            position={[lx, 0.3, -8.2]}
            rotationY={0}
          />
        ))}
      </group>

      {/* -------------------------------------------------------------
          3. INTERNAL CAMPUS ROADS & ARTERIES
      ------------------------------------------------------------- */}
      {/* SRM BMS Block Western Road (Heading North toward Labs & Depot) */}
      <group position={[-38, 0.06, 2]}>
        <mesh receiveShadow>
          <planeGeometry args={[11, 86]} />
          <meshStandardMaterial color="#334155" roughness={0.8} />
        </mesh>
        {/* White Dashed Lane Center Stripes */}
        {Array.from({ length: 14 }).map((_, di) => (
          <mesh key={di} position={[0, 0.015, -40 + di * 6]}>
            <planeGeometry args={[0.3, 3.2]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
        ))}
        {/* Pedestrian Crosswalk near Mech Labs Junction */}
        <ZebraCrossing position={[0, 0.02, 14]} width={9} length={7} stripes={6} rotationY={Math.PI / 2} />

        {/* Streetlights along BMS Road */}
        {[-30, -5, 20].map((lz, li) => (
          <CampusLEDStreetlight
            key={`light-bms-${li}`}
            position={[-6.2, 0, lz]}
            rotationY={Math.PI / 2}
          />
        ))}
      </group>

      {/* Eastern Campus Drive (Towards Sports Arena & Hostels) */}
      <group position={[62, 0.06, 12]}>
        <mesh receiveShadow>
          <planeGeometry args={[9, 72]} />
          <meshStandardMaterial color="#334155" roughness={0.8} />
        </mesh>
        {/* White Center Dashes */}
        {Array.from({ length: 11 }).map((_, di) => (
          <mesh key={di} position={[0, 0.015, -30 + di * 6]}>
            <planeGeometry args={[0.25, 3.0]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
        ))}
      </group>

      {/* -------------------------------------------------------------
          4. CENTRAL ACADEMIC QUADRANGLE & ORNAMENTAL FOUNTAIN
      ------------------------------------------------------------- */}
      <group position={[5, 0.03, 16]}>
        {/* Wide Granite Promenade Plaza */}
        <mesh receiveShadow>
          <planeGeometry args={[54, 20]} />
          <meshStandardMaterial color="#f1f5f9" roughness={0.55} />
        </mesh>
        {/* Decorative Paver Inlay Border */}
        <mesh position={[0, 0.01, 0]}>
          <planeGeometry args={[52, 18]} />
          <meshStandardMaterial color="#e2e8f0" roughness={0.6} />
        </mesh>

        {/* Multi-Tier Reflective Water Fountain Pool */}
        <group position={[0, 0.1, 0]}>
          {/* Outer Raised Granite Coping Basin */}
          <mesh position={[0, 0.25, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[5.2, 5.5, 0.5, 32]} />
            <meshStandardMaterial color="#475569" roughness={0.4} />
          </mesh>
          {/* Inner Pool Water Coping Ring */}
          <mesh position={[0, 0.35, 0]}>
            <ringGeometry args={[4.2, 5.2, 32]} />
            <meshStandardMaterial color="#64748b" roughness={0.3} />
          </mesh>
          {/* Shimmering Aqua Water Surface */}
          <mesh position={[0, 0.42, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[4.2, 32]} />
            <meshStandardMaterial
              color="#0284c7"
              roughness={0.08}
              metalness={0.85}
              transparent
              opacity={0.82}
            />
          </mesh>
          {/* Central Fountain Tier Pedestal */}
          <mesh position={[0, 0.9, 0]} castShadow>
            <cylinderGeometry args={[1.1, 1.4, 0.9, 16]} />
            <meshStandardMaterial color="#cbd5e1" roughness={0.4} />
          </mesh>
          {/* Water Spout Nozzle */}
          <mesh position={[0, 1.6, 0]}>
            <cylinderGeometry args={[0.08, 0.12, 0.6, 12]} />
            <meshStandardMaterial color="#94a3b8" metalness={0.9} roughness={0.1} />
          </mesh>
          {/* Fountain Cascade Water Shimmer */}
          <mesh position={[0, 2.0, 0]}>
            <coneGeometry args={[0.4, 0.9, 12]} />
            <meshStandardMaterial color="#bae6fd" transparent opacity={0.6} />
          </mesh>
        </group>

        {/* Campus Park Benches around the Promenade */}
        <CampusBench position={[-14, 0, 6.5]} rotationY={0} />
        <CampusBench position={[14, 0, 6.5]} rotationY={0} />
        <CampusBench position={[-14, 0, -6.5]} rotationY={Math.PI} />
        <CampusBench position={[14, 0, -6.5]} rotationY={Math.PI} />
      </group>

      {/* -------------------------------------------------------------
          5. UNIVERSITY ENTRANCE GATE 1 (BHARATHI SALAI)
      ------------------------------------------------------------- */}
      <group position={[-5, 0, 42]}>
        {/* Left Monumental Column */}
        <mesh position={[-7.5, 3.2, 0]} castShadow>
          <boxGeometry args={[1.6, 6.4, 1.6]} />
          <meshStandardMaterial color="#0284c7" roughness={0.3} metalness={0.2} />
        </mesh>
        {/* Right Monumental Column */}
        <mesh position={[7.5, 3.2, 0]} castShadow>
          <boxGeometry args={[1.6, 6.4, 1.6]} />
          <meshStandardMaterial color="#0284c7" roughness={0.3} metalness={0.2} />
        </mesh>
        {/* Grand Overhead Arch with Easwari Brand Blue */}
        <mesh position={[0, 6.6, 0]} castShadow>
          <boxGeometry args={[17, 1.4, 2.0]} />
          <meshStandardMaterial color="#0369a1" roughness={0.3} metalness={0.25} />
        </mesh>
        {/* University Signboard Plaque */}
        <mesh position={[0, 6.6, 1.05]}>
          <planeGeometry args={[13, 0.8]} />
          <meshStandardMaterial color="#ffffff" roughness={0.2} />
        </mesh>

        {/* Security Guard Booth */}
        <group position={[11.5, 1.6, 0]}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[3.6, 3.2, 3.2]} />
            <meshStandardMaterial color="#ffffff" roughness={0.3} />
          </mesh>
          {/* Booth Overhanging Roof */}
          <mesh position={[0, 1.7, 0]} castShadow>
            <boxGeometry args={[4.2, 0.2, 3.8]} />
            <meshStandardMaterial color="#0284c7" />
          </mesh>
          {/* Observation Glass Window */}
          <mesh position={[-1.81, 0.2, 0]}>
            <planeGeometry args={[2.0, 1.4]} />
            <meshStandardMaterial color="#0f172a" roughness={0.1} metalness={0.9} />
          </mesh>
        </group>

        {/* Boom Barrier Vehicle Gate Arm */}
        <group position={[-1.5, 0.9, 0]}>
          {/* Motor Housing */}
          <mesh castShadow>
            <boxGeometry args={[0.4, 1.0, 0.4]} />
            <meshStandardMaterial color="#f97316" />
          </mesh>
          {/* Striped Red/White Arm */}
          <mesh position={[3.0, 0.4, 0]} rotation={[0, 0, 0.05]}>
            <cylinderGeometry args={[0.04, 0.04, 6.0, 8]} />
            <meshStandardMaterial color="#ef4444" />
          </mesh>
        </group>
      </group>

      {/* -------------------------------------------------------------
          6. PERIMETER BOUNDARY WALLS & GATES
      ------------------------------------------------------------- */}
      <group>
        {/* South Wall (West wing) */}
        <mesh position={[-46, 1.2, 41.5]} castShadow>
          <boxGeometry args={[68, 2.4, 0.5]} />
          <meshStandardMaterial color="#cbd5e1" roughness={0.7} />
        </mesh>
        {/* South Wall (East wing) */}
        <mesh position={[41, 1.2, 41.5]} castShadow>
          <boxGeometry args={[68, 2.4, 0.5]} />
          <meshStandardMaterial color="#cbd5e1" roughness={0.7} />
        </mesh>
        {/* West Wall along Ramapuram boundary */}
        <mesh position={[-80, 1.2, 0]} rotation={[0, Math.PI / 2, 0]} castShadow>
          <boxGeometry args={[96, 2.4, 0.5]} />
          <meshStandardMaterial color="#cbd5e1" roughness={0.7} />
        </mesh>
        {/* East Wall along Hostel boundary */}
        <mesh position={[77, 1.2, 0]} rotation={[0, Math.PI / 2, 0]} castShadow>
          <boxGeometry args={[96, 2.4, 0.5]} />
          <meshStandardMaterial color="#cbd5e1" roughness={0.7} />
        </mesh>
        {/* North Wall */}
        <mesh position={[0, 1.2, -50]} castShadow>
          <boxGeometry args={[162, 2.4, 0.5]} />
          <meshStandardMaterial color="#cbd5e1" roughness={0.7} />
        </mesh>
      </group>

      {/* -------------------------------------------------------------
          7. SPORTS COMPLEX REALISTIC OUTDOOR BASKETBALL COURT
      ------------------------------------------------------------- */}
      <group position={[42, 0.05, 34]}>
        {/* Regulation Court Paved Foundation Plinth */}
        <mesh receiveShadow position={[0, 0.05, 0]}>
          <boxGeometry args={[22, 0.1, 14]} />
          <meshStandardMaterial color="#94a3b8" roughness={0.7} />
        </mesh>
        {/* Navy Blue Outer Court */}
        <mesh position={[0, 0.11, 0]}>
          <planeGeometry args={[20, 12]} />
          <meshStandardMaterial color="#0284c7" roughness={0.5} />
        </mesh>
        {/* Emerald Green Key & Inner Surface */}
        <mesh position={[0, 0.115, 0]}>
          <planeGeometry args={[17, 9.6]} />
          <meshStandardMaterial color="#10b981" roughness={0.5} />
        </mesh>
        {/* White Center Circle */}
        <mesh position={[0, 0.12, 0]}>
          <ringGeometry args={[1.5, 1.6, 32]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
        {/* East & West Basketball Hoop Stanchions */}
        <BasketballHoop position={[-9.2, 0.1, 0]} rotationY={Math.PI / 2} />
        <BasketballHoop position={[9.2, 0.1, 0]} rotationY={-Math.PI / 2} />
      </group>

      {/* -------------------------------------------------------------
          8. TRANSPORT DEPOT & VEHICLE FLEET STALLS
      ------------------------------------------------------------- */}
      <group position={[-52, 0.04, -30]}>
        {/* Paved Bus Bay Apron */}
        <mesh receiveShadow>
          <planeGeometry args={[44, 32]} />
          <meshStandardMaterial color="#334155" roughness={0.8} />
        </mesh>

        {/* Painted White Parking Stall Lines */}
        {[-18, -9, 0, 9, 18].map((px, pi) => (
          <mesh key={pi} position={[px, 0.015, 0]}>
            <planeGeometry args={[0.2, 26]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
        ))}

        {/* Parked SRM Yellow University Buses */}
        <UniversityBus position={[-13.5, 0, -8]} rotation={[0, Math.PI / 2, 0]} />
        <UniversityBus position={[-13.5, 0, 2]} rotation={[0, Math.PI / 2, 0]} />
        <UniversityBus position={[-13.5, 0, 12]} rotation={[0, Math.PI / 2, 0]} />
        <UniversityBus position={[4.5, 0, -8]} rotation={[0, Math.PI / 2, 0]} />
        <UniversityBus position={[4.5, 0, 2]} rotation={[0, Math.PI / 2, 0]} />

        {/* Campus Electric Security Patrol Cars */}
        <SecurityPatrolCar position={[13.5, 0, -8]} rotationY={Math.PI / 2} />
        <SecurityPatrolCar position={[13.5, 0, 2]} rotationY={Math.PI / 2} />
      </group>

      {/* -------------------------------------------------------------
          9. REALISTIC BOTANICAL TREES & ROYAL PALMS
      ------------------------------------------------------------- */}
      {/* Bharathi Salai Royal Palms along Boulevard */}
      {[-72, -58, -42, -26, 12, 28, 44, 60, 74].map((px, idx) => (
        <RoyalPalmTree
          key={`palm-bs-${idx}`}
          position={[px, 0, 43.5]}
          scale={0.95 + (idx % 3) * 0.1}
        />
      ))}

      {/* Academic Quadrangle Shade Trees */}
      <RealisticShadeTree position={[-18, 0, 16]} scale={1.2} rotation={0.4} />
      <RealisticShadeTree position={[28, 0, 18]} scale={1.15} rotation={1.2} />
      <RealisticShadeTree position={[32, 0, 10]} scale={1.05} rotation={2.1} />
      <RealisticShadeTree position={[-19, 0, -8]} scale={1.25} rotation={0.8} />
      <RealisticShadeTree position={[27, 0, -8]} scale={1.1} rotation={1.5} />

      {/* Western BMS Road Shaded Avenue Trees */}
      {[-16, 2, 18, 32].map((pz, idx) => (
        <RealisticShadeTree
          key={`tree-bms-${idx}`}
          position={[-45, 0, pz]}
          scale={1.1 + (idx % 2) * 0.15}
          rotation={idx * 0.7}
        />
      ))}

      {/* Eastern Hostel & Sports Complex Boundary Trees */}
      {[-2, 12, 24, 38].map((pz, idx) => (
        <RealisticShadeTree
          key={`tree-hostel-${idx}`}
          position={[64, 0, pz]}
          scale={1.15 + (idx % 2) * 0.1}
          rotation={idx * 0.9}
        />
      ))}
    </group>
  );
};
