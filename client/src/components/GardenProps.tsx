import { useMemo } from 'react';
import * as THREE from 'three';

interface GardenPropsProps {
  zone: string;
}

function Tree({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh castShadow position={[0, 1.5, 0]}>
        <cylinderGeometry args={[0.3, 0.4, 3, 8]} />
        <meshStandardMaterial color="#8B4513" roughness={0.9} />
      </mesh>
      
      <mesh castShadow position={[0, 3.5, 0]}>
        <coneGeometry args={[1.5, 3, 8]} />
        <meshStandardMaterial color="#228B22" roughness={0.7} />
      </mesh>
      <mesh castShadow position={[0, 5.2, 0]}>
        <coneGeometry args={[1.2, 2.5, 8]} />
        <meshStandardMaterial color="#2E8B57" roughness={0.7} />
      </mesh>
    </group>
  );
}

function Fence({ position, rotation }: { position: [number, number, number]; rotation?: [number, number, number] }) {
  return (
    <group position={position} rotation={rotation || [0, 0, 0]}>
      {Array.from({ length: 10 }, (_, i) => (
        <mesh key={i} position={[i * 1 - 4.5, 0.75, 0]} castShadow>
          <boxGeometry args={[0.1, 1.5, 0.1]} />
          <meshStandardMaterial color="#D2691E" />
        </mesh>
      ))}
      <mesh position={[0, 0.5, 0]}>
        <boxGeometry args={[10, 0.1, 0.1]} />
        <meshStandardMaterial color="#D2691E" />
      </mesh>
      <mesh position={[0, 1, 0]}>
        <boxGeometry args={[10, 0.1, 0.1]} />
        <meshStandardMaterial color="#D2691E" />
      </mesh>
    </group>
  );
}

function FlowerBed({ position }: { position: [number, number, number] }) {
  const flowers = useMemo(() => {
    return Array.from({ length: 8 }, (_, i) => ({
      x: (Math.random() - 0.5) * 2,
      z: (Math.random() - 0.5) * 2,
      color: ['#FF69B4', '#FFD700', '#FF4500', '#9370DB'][Math.floor(Math.random() * 4)]
    }));
  }, []);

  return (
    <group position={position}>
      <mesh receiveShadow position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[1.5, 16]} />
        <meshStandardMaterial color="#8B4513" roughness={0.9} />
      </mesh>
      
      {flowers.map((flower, i) => (
        <mesh key={i} position={[flower.x, 0.3, flower.z]} castShadow>
          <sphereGeometry args={[0.15, 8, 8]} />
          <meshStandardMaterial 
            color={flower.color} 
            emissive={flower.color}
            emissiveIntensity={0.3}
          />
        </mesh>
      ))}
    </group>
  );
}

export default function GardenProps({ zone }: GardenPropsProps) {
  return (
    <group>
      <Tree position={[-20, 0, 10]} />
      <Tree position={[20, 0, 8]} />
      <Tree position={[-18, 0, -15]} />
      <Tree position={[18, 0, -12]} />
      
      <Fence position={[-25, 0, 0]} rotation={[0, 0, 0]} />
      <Fence position={[25, 0, 0]} rotation={[0, 0, 0]} />
      <Fence position={[0, 0, -25]} rotation={[0, Math.PI / 2, 0]} />
      
      <FlowerBed position={[-10, 0, 12]} />
      <FlowerBed position={[10, 0, 12]} />
      <FlowerBed position={[-10, 0, -12]} />
      <FlowerBed position={[10, 0, -12]} />
    </group>
  );
}
