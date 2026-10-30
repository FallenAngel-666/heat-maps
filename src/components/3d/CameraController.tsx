import React, { useRef, useEffect } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { Building, CameraPreset } from '../../types';

interface CameraControllerProps {
  selectedBuilding: Building | null;
  cameraPreset: CameraPreset;
  autoRotate: boolean;
  onControlsReady?: (controls: any) => void;
}

const PRESET_CONFIGS: Record<CameraPreset, { pos: [number, number, number]; target: [number, number, number] }> = {
  overview: {
    pos: [0, 95, 105],
    target: [0, 0, 10]
  },
  front: {
    pos: [0, 24, 75],
    target: [0, 6, 20]
  },
  back: {
    pos: [0, 24, -35],
    target: [0, 6, 20]
  },
  left: {
    pos: [-65, 24, 20],
    target: [0, 6, 20]
  },
  right: {
    pos: [65, 24, 20],
    target: [0, 6, 20]
  },
  'top-down': {
    pos: [0, 140, 15],
    target: [0, 0, 15]
  },
  'angled-3d': {
    pos: [55, 65, 75],
    target: [0, 0, 15]
  },
  north: {
    pos: [0, 35, -50],
    target: [0, 5, 15]
  },
  south: {
    pos: [0, 35, 80],
    target: [0, 5, 15]
  },
  east: {
    pos: [75, 35, 15],
    target: [0, 5, 15]
  },
  west: {
    pos: [-75, 35, 15],
    target: [0, 5, 15]
  },
  'south-gate': {
    pos: [0, 32, 80],
    target: [-5, 6, 30]
  },
  'easwari-academic': {
    pos: [-6, 36, 62],
    target: [-6, 6, 30]
  },
  'bms-block': {
    pos: [-52, 38, 38],
    target: [-52, 6, 4]
  },
  hostels: {
    pos: [46, 42, 42],
    target: [46, 8, 6]
  },
  'bus-bay': {
    pos: [-45, 35, 0],
    target: [-45, 3, -30]
  }
};

export const CameraController: React.FC<CameraControllerProps> = ({
  selectedBuilding,
  cameraPreset,
  autoRotate
}) => {
  const { camera } = useThree();
  const controlsRef = useRef<any>(null);

  const targetCameraPos = useRef(new THREE.Vector3(...PRESET_CONFIGS.overview.pos));
  const targetLookAt = useRef(new THREE.Vector3(...PRESET_CONFIGS.overview.target));
  const isTransitioning = useRef(false);

  // When selected building changes, update target
  useEffect(() => {
    if (selectedBuilding) {
      const [bx, by, bz] = selectedBuilding.position;
      targetLookAt.current.set(bx, by + 4, bz);
      targetCameraPos.current.set(bx + 18, by + 28, bz + 32);
      isTransitioning.current = true;
    } else {
      // Revert to current preset
      const config = PRESET_CONFIGS[cameraPreset] || PRESET_CONFIGS.overview;
      targetLookAt.current.set(...config.target);
      targetCameraPos.current.set(...config.pos);
      isTransitioning.current = true;
    }
  }, [selectedBuilding, cameraPreset]);

  // Smooth lerp during camera transitions
  useFrame(() => {
    if (isTransitioning.current && controlsRef.current) {
      camera.position.lerp(targetCameraPos.current, 0.08);
      controlsRef.current.target.lerp(targetLookAt.current, 0.08);
      controlsRef.current.update();

      if (
        camera.position.distanceTo(targetCameraPos.current) < 0.2 &&
        controlsRef.current.target.distanceTo(targetLookAt.current) < 0.2
      ) {
        isTransitioning.current = false;
      }
    }
  });

  return (
    <OrbitControls
      ref={controlsRef}
      makeDefault
      autoRotate={autoRotate}
      autoRotateSpeed={0.8}
      enableDamping
      dampingFactor={0.05}
      maxPolarAngle={Math.PI / 2.05} // don't go below ground
      minDistance={15}
      maxDistance={220}
      target={PRESET_CONFIGS.overview.target}
    />
  );
};
