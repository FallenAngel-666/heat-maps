import React, { useEffect, useMemo } from 'react';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { HealthStatus } from '../../types';

interface GLTFBuildingWrapperProps {
  modelUrl: string;
  healthStatus: HealthStatus;
  isSelected: boolean;
  scale?: [number, number, number];
}

export const GLTFBuildingWrapper: React.FC<GLTFBuildingWrapperProps> = ({
  modelUrl,
  healthStatus,
  isSelected,
  scale = [1, 1, 1]
}) => {
  const { scene } = useGLTF(modelUrl);
  const clonedScene = useMemo(() => scene.clone(), [scene]);

  useEffect(() => {
    const statusColor =
      healthStatus === 'red'
        ? new THREE.Color('#ef4444')
        : healthStatus === 'amber'
        ? new THREE.Color('#f59e0b')
        : healthStatus === 'grey'
        ? new THREE.Color('#94a3b8')
        : null;

    clonedScene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        if (mesh.material) {
          if (Array.isArray(mesh.material)) {
            mesh.material.forEach((mat) => {
              if (statusColor && 'color' in mat) (mat as any).color = statusColor;
            });
          } else {
            if (statusColor && 'color' in mesh.material) (mesh.material as any).color = statusColor;
          }
        }
      }
    });
  }, [clonedScene, healthStatus, isSelected]);

  return <primitive object={clonedScene} scale={scale} />;
};
