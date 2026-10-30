import React from 'react';
import * as THREE from 'three';

// Low-poly procedural tree component
const Tree: React.FC<{ position: [number, number, number]; scale?: number }> = ({ position, scale = 1 }) => {
  return (
    <group position={position} scale={[scale, scale, scale]}>
      {/* Trunk */}
      <mesh position={[0, 1.2, 0]} castShadow>
        <cylinderGeometry args={[0.2, 0.35, 2.4, 6]} />
        <meshStandardMaterial color="#78350f" roughness={0.9} />
      </mesh>
      {/* Foliage Canopy (tiered) */}
      <mesh position={[0, 2.8, 0]} castShadow>
        <coneGeometry args={[1.5, 2.2, 7]} />
        <meshStandardMaterial color="#15803d" roughness={0.8} />
      </mesh>
      <mesh position={[0, 4.0, 0]} castShadow>
        <coneGeometry args={[1.1, 1.8, 7]} />
        <meshStandardMaterial color="#16a34a" roughness={0.8} />
      </mesh>
    </group>
  );
};

// University Bus Model for the Bus Depot / Transport Yard
const UniversityBus: React.FC<{ position: [number, number, number]; rotation?: [number, number, number] }> = ({
  position,
  rotation = [0, 0, 0]
}) => {
  return (
    <group position={position} rotation={rotation}>
      {/* Bus Body (Iconic SRM College Yellow) */}
      <mesh position={[0, 1.0, 0]} castShadow>
        <boxGeometry args={[2.5, 1.8, 6.5]} />
        <meshStandardMaterial color="#facc15" roughness={0.3} metalness={0.1} />
      </mesh>
      {/* Windshield & Windows */}
      <mesh position={[0, 1.2, 3.26]}>
        <planeGeometry args={[2.2, 1.0]} />
        <meshStandardMaterial color="#1e293b" roughness={0.1} />
      </mesh>
      {/* Roof */}
      <mesh position={[0, 1.95, 0]}>
        <boxGeometry args={[2.4, 0.1, 6.4]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      {/* Wheels */}
      <mesh position={[-1.3, 0.4, 1.8]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.4, 0.4, 0.2, 12]} />
        <meshStandardMaterial color="#18181b" roughness={0.9} />
      </mesh>
      <mesh position={[1.3, 0.4, 1.8]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.4, 0.4, 0.2, 12]} />
        <meshStandardMaterial color="#18181b" roughness={0.9} />
      </mesh>
      <mesh position={[-1.3, 0.4, -1.8]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.4, 0.4, 0.2, 12]} />
        <meshStandardMaterial color="#18181b" roughness={0.9} />
      </mesh>
      <mesh position={[1.3, 0.4, -1.8]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.4, 0.4, 0.2, 12]} />
        <meshStandardMaterial color="#18181b" roughness={0.9} />
      </mesh>
    </group>
  );
};

export const CampusEnvironment: React.FC = () => {
  return (
    <group>
      {/* 1. Regional Master Terrain Base */}
      <mesh position={[0, -0.1, 0]} receiveShadow>
        <planeGeometry args={[260, 220]} />
        <meshStandardMaterial color="#f1f5f9" roughness={0.9} />
      </mesh>

      {/* 2. Official Campus Ground / Green Lawn Base */}
      <mesh position={[-2, 0.01, 8]} receiveShadow>
        <planeGeometry args={[170, 130]} />
        <meshStandardMaterial color="#ecfdf5" roughness={0.8} />
      </mesh>

      {/* Subtle Holographic Coordinate Grid Overlay */}
      <gridHelper
        args={[170, 34, '#38bdf8', '#94a3b8']}
        position={[-2, 0.025, 8]}
      />

      {/* 3. Bharathi Salai Main Avenue (Southern Boundary Road) */}
      <group position={[0, 0.05, 48]}>
        {/* Asphalt Road */}
        <mesh receiveShadow>
          <planeGeometry args={[240, 14]} />
          <meshStandardMaterial color="#334155" roughness={0.8} />
        </mesh>
        {/* Yellow Central Dividing Stripe */}
        <mesh position={[0, 0.01, 0]}>
          <planeGeometry args={[230, 0.4]} />
          <meshBasicMaterial color="#eab308" />
        </mesh>
        {/* North Sidewalk Curb */}
        <mesh position={[0, 0.15, -7.5]} receiveShadow>
          <boxGeometry args={[240, 0.3, 1.2]} />
          <meshStandardMaterial color="#94a3b8" />
        </mesh>
        {/* South Sidewalk Curb */}
        <mesh position={[0, 0.15, 7.5]} receiveShadow>
          <boxGeometry args={[240, 0.3, 1.2]} />
          <meshStandardMaterial color="#94a3b8" />
        </mesh>
      </group>

      {/* 4. SRM BMS Block Road (Branching North-West) */}
      <group position={[-38, 0.06, 2]}>
        <mesh receiveShadow rotation={[0, 0, 0]}>
          <planeGeometry args={[10, 84]} />
          <meshStandardMaterial color="#475569" roughness={0.8} />
        </mesh>
        {/* White Center Line */}
        <mesh position={[0, 0.01, 0]}>
          <planeGeometry args={[0.3, 80]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
      </group>

      {/* 5. Eastern Access Road (Connecting to Angel Street & Boys Hostel) */}
      <group position={[62, 0.06, 12]}>
        <mesh receiveShadow>
          <planeGeometry args={[8, 70]} />
          <meshStandardMaterial color="#475569" roughness={0.8} />
        </mesh>
      </group>

      {/* 6. Central Campus Promenade / Academic Quad Plaza */}
      <group position={[5, 0.03, 18]}>
        <mesh receiveShadow>
          <planeGeometry args={[50, 16]} />
          <meshStandardMaterial color="#e2e8f0" roughness={0.6} />
        </mesh>
        {/* Geometric Garden Circle in Quadrangle */}
        <mesh position={[0, 0.02, 0]}>
          <ringGeometry args={[2, 6, 32]} />
          <meshStandardMaterial color="#10b981" roughness={0.7} />
        </mesh>
        <mesh position={[0, 0.03, 0]}>
          <circleGeometry args={[2, 32]} />
          <meshStandardMaterial color="#38bdf8" roughness={0.2} metalness={0.8} />
        </mesh>
      </group>

      {/* 7. SRM Main Entrance Archway (Gate 1 on Bharathi Salai) */}
      <group position={[-5, 0, 42]}>
        {/* Left Column */}
        <mesh position={[-7, 3, 0]} castShadow>
          <boxGeometry args={[1.4, 6, 1.4]} />
          <meshStandardMaterial color="#0284c7" />
        </mesh>
        {/* Right Column */}
        <mesh position={[7, 3, 0]} castShadow>
          <boxGeometry args={[1.4, 6, 1.4]} />
          <meshStandardMaterial color="#0284c7" />
        </mesh>
        {/* Overhead Arch */}
        <mesh position={[0, 6.2, 0]} castShadow>
          <boxGeometry args={[16, 1.2, 1.6]} />
          <meshStandardMaterial color="#0369a1" />
        </mesh>
        {/* Guard Security Cabin */}
        <mesh position={[10, 1.5, 0]} castShadow>
          <boxGeometry args={[3.2, 3, 3]} />
          <meshStandardMaterial color="#f8fafc" />
        </mesh>
      </group>

      {/* 8. Campus Boundary Wall & Perimeter Fence */}
      <group>
        {/* South boundary wall (with gate gap) */}
        <mesh position={[-45, 1, 41.5]} castShadow>
          <boxGeometry args={[70, 2, 0.5]} />
          <meshStandardMaterial color="#cbd5e1" />
        </mesh>
        <mesh position={[40, 1, 41.5]} castShadow>
          <boxGeometry args={[70, 2, 0.5]} />
          <meshStandardMaterial color="#cbd5e1" />
        </mesh>
        {/* West boundary wall */}
        <mesh position={[-78, 1, 0]} rotation={[0, Math.PI / 2, 0]} castShadow>
          <boxGeometry args={[90, 2, 0.5]} />
          <meshStandardMaterial color="#cbd5e1" />
        </mesh>
        {/* East boundary wall */}
        <mesh position={[75, 1, 0]} rotation={[0, Math.PI / 2, 0]} castShadow>
          <boxGeometry args={[90, 2, 0.5]} />
          <meshStandardMaterial color="#cbd5e1" />
        </mesh>
        {/* North boundary wall */}
        <mesh position={[0, 1, -48]} castShadow>
          <boxGeometry args={[155, 2, 0.5]} />
          <meshStandardMaterial color="#cbd5e1" />
        </mesh>
      </group>

      {/* 9. Sports Courts (Near Boys Hostel & East Field) */}
      <group position={[40, 0.05, 34]}>
        {/* Outdoor Basketball Court */}
        <mesh receiveShadow>
          <planeGeometry args={[18, 12]} />
          <meshStandardMaterial color="#0284c7" roughness={0.5} />
        </mesh>
        {/* Court inner key */}
        <mesh position={[0, 0.01, 0]}>
          <planeGeometry args={[16, 10]} />
          <meshStandardMaterial color="#10b981" roughness={0.5} />
        </mesh>
      </group>

      {/* 10. Bus Transport Depot & Fleet Stalls (West-North Area) */}
      <group position={[-52, 0.04, -30]}>
        {/* Paved Parking Bay */}
        <mesh receiveShadow>
          <planeGeometry args={[42, 30]} />
          <meshStandardMaterial color="#475569" roughness={0.8} />
        </mesh>
        {/* Yellow College Buses parked in rows */}
        <UniversityBus position={[-14, 0, -8]} rotation={[0, Math.PI / 2, 0]} />
        <UniversityBus position={[-14, 0, 0]} rotation={[0, Math.PI / 2, 0]} />
        <UniversityBus position={[-14, 0, 8]} rotation={[0, Math.PI / 2, 0]} />
        <UniversityBus position={[0, 0, -8]} rotation={[0, Math.PI / 2, 0]} />
        <UniversityBus position={[0, 0, 0]} rotation={[0, Math.PI / 2, 0]} />
        <UniversityBus position={[0, 0, 8]} rotation={[0, Math.PI / 2, 0]} />
      </group>

      {/* 11. Trees & Greenery along roads and perimeter */}
      {/* Bharathi Salai Tree Line */}
      {[-70, -55, -40, -25, 15, 30, 45, 60, 75].map((x, idx) => (
        <Tree key={`tree-south-${idx}`} position={[x, 0, 45]} scale={0.9 + (idx % 3) * 0.15} />
      ))}
      {/* Quadrangle Trees */}
      <Tree position={[-15, 0, 16]} scale={1.1} />
      <Tree position={[24, 0, 18]} scale={1.0} />
      <Tree position={[30, 0, 10]} scale={0.9} />
      <Tree position={[-18, 0, -6]} scale={1.2} />
      <Tree position={[26, 0, -6]} scale={1.1} />
      {/* Western BMS road tree line */}
      {[-10, 5, 20, 35].map((z, idx) => (
        <Tree key={`tree-bms-${idx}`} position={[-44, 0, z]} scale={1.0} />
      ))}
      {/* Eastern Hostel greenery */}
      {[0, 12, 24].map((z, idx) => (
        <Tree key={`tree-hostel-${idx}`} position={[60, 0, z]} scale={1.1} />
      ))}
    </group>
  );
};
