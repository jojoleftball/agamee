import { useMemo } from 'react';
import * as THREE from 'three';

interface GardenHouseProps {
  position: [number, number, number];
}

export default function GardenHouse({ position }: GardenHouseProps) {
  const houseColor = useMemo(() => new THREE.Color('#FFF8DC'), []);
  const roofColor = useMemo(() => new THREE.Color('#8B4513'), []);
  const doorColor = useMemo(() => new THREE.Color('#654321'), []);
  const windowColor = useMemo(() => new THREE.Color('#87CEEB'), []);

  return (
    <group position={position}>
      <mesh castShadow receiveShadow position={[0, 3, 0]}>
        <boxGeometry args={[8, 6, 6]} />
        <meshStandardMaterial color={houseColor} roughness={0.7} />
      </mesh>
      
      <mesh castShadow position={[0, 6.5, 0]} rotation={[0, 0, Math.PI / 2]}>
        <coneGeometry args={[5.7, 3, 4]} />
        <meshStandardMaterial color={roofColor} roughness={0.8} />
      </mesh>
      
      <mesh position={[0, 1.5, 3.01]}>
        <boxGeometry args={[1.5, 3, 0.2]} />
        <meshStandardMaterial color={doorColor} />
      </mesh>
      
      <mesh position={[-2.5, 3.5, 3.01]}>
        <boxGeometry args={[1.2, 1.2, 0.15]} />
        <meshStandardMaterial color={windowColor} emissive={windowColor} emissiveIntensity={0.2} />
      </mesh>
      
      <mesh position={[2.5, 3.5, 3.01]}>
        <boxGeometry args={[1.2, 1.2, 0.15]} />
        <meshStandardMaterial color={windowColor} emissive={windowColor} emissiveIntensity={0.2} />
      </mesh>
      
      <mesh position={[0, 0.3, 5]} castShadow>
        <boxGeometry args={[3, 0.6, 2]} />
        <meshStandardMaterial color="#A0522D" />
      </mesh>
    </group>
  );
}
