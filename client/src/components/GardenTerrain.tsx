import { useTexture } from '@react-three/drei';
import * as THREE from 'three';

export default function GardenTerrain() {
  const grassTexture = useTexture('/textures/grass.png');
  
  grassTexture.wrapS = grassTexture.wrapT = THREE.RepeatWrapping;
  grassTexture.repeat.set(20, 20);

  return (
    <group>
      <mesh 
        receiveShadow 
        rotation={[-Math.PI / 2, 0, 0]} 
        position={[0, -0.1, 0]}
      >
        <planeGeometry args={[80, 80]} />
        <meshStandardMaterial 
          map={grassTexture}
          color="#4CAF50"
          roughness={0.9}
        />
      </mesh>
      
      <mesh position={[0, -0.15, 0]}>
        <boxGeometry args={[80, 0.1, 80]} />
        <meshStandardMaterial color="#8B4513" />
      </mesh>
    </group>
  );
}
