import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface MergeParticlesProps {
  position: [number, number, number];
  color?: string;
  onComplete?: () => void;
}

export default function MergeParticles({ position, color = '#FFD700', onComplete }: MergeParticlesProps) {
  const particlesRef = useRef<THREE.Points>(null);
  const timeRef = useRef(0);
  const velocitiesRef = useRef<number[]>([]);
  
  const particleCount = 20;
  const duration = 1.5;
  
  if (velocitiesRef.current.length === 0) {
    for (let i = 0; i < particleCount; i++) {
      velocitiesRef.current.push(
        (Math.random() - 0.5) * 4,
        Math.random() * 3 + 2,
        (Math.random() - 0.5) * 4
      );
    }
  }
  
  const positions = new Float32Array(particleCount * 3);
  for (let i = 0; i < particleCount * 3; i++) {
    positions[i] = 0;
  }
  
  useFrame((state, delta) => {
    if (!particlesRef.current) return;
    
    timeRef.current += delta;
    
    if (timeRef.current >= duration) {
      if (onComplete) onComplete();
      return;
    }
    
    const geometry = particlesRef.current.geometry;
    const positions = geometry.attributes.position.array as Float32Array;
    
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      positions[i3] = velocitiesRef.current[i3] * timeRef.current;
      positions[i3 + 1] = velocitiesRef.current[i3 + 1] * timeRef.current - 0.5 * 9.8 * timeRef.current * timeRef.current;
      positions[i3 + 2] = velocitiesRef.current[i3 + 2] * timeRef.current;
    }
    
    geometry.attributes.position.needsUpdate = true;
    
    const opacity = Math.max(0, 1 - timeRef.current / duration);
    const material = particlesRef.current.material as THREE.PointsMaterial;
    material.opacity = opacity;
  });
  
  return (
    <points ref={particlesRef} position={position}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.15}
        color={color}
        transparent
        opacity={1}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
