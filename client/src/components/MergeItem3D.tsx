import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import { MergeItem } from '@/lib/stores/useMergeStore';
import { MERGE_ITEMS } from '@/lib/mergeItems';

interface MergeItem3DProps {
  item: MergeItem;
  position: [number, number, number];
  selected?: boolean;
  onClick?: (event: any) => void;
}

export default function MergeItem3D({ item, position, selected = false, onClick }: MergeItem3DProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  
  const itemData = MERGE_ITEMS[item.itemType];
  const color = getCategoryColor(itemData?.category || 'flower');
  
  useFrame((state) => {
    if (meshRef.current) {
      if (item.isAnimating || selected) {
        meshRef.current.rotation.y += 0.05;
        const bounce = Math.sin(state.clock.elapsedTime * 5) * 0.15;
        meshRef.current.position.y = position[1] + 0.5 + bounce;
      } else {
        meshRef.current.rotation.y += hovered ? 0.02 : 0.005;
        meshRef.current.position.y = position[1];
      }
      
      const targetScale = (hovered || selected) ? 1.2 : 1;
      meshRef.current.scale.lerp(
        new THREE.Vector3(targetScale, targetScale, targetScale),
        0.1
      );
    }
  });

  return (
    <group position={position}>
      <mesh
        ref={meshRef}
        castShadow
        onPointerEnter={(e) => {
          e.stopPropagation();
          setHovered(true);
          document.body.style.cursor = 'pointer';
        }}
        onPointerLeave={() => {
          setHovered(false);
          document.body.style.cursor = 'default';
        }}
        onClick={(e) => {
          e.stopPropagation();
          if (onClick) onClick(e);
        }}
      >
        <boxGeometry args={[0.8, 0.8, 0.8]} />
        <meshStandardMaterial
          color={color}
          emissive={selected ? '#FFFFFF' : color}
          emissiveIntensity={selected ? 0.5 : (hovered ? 0.3 : 0.1)}
          roughness={0.4}
          metalness={0.2}
        />
      </mesh>
      
      {itemData && (
        <Text
          position={[0, 1.2, 0]}
          fontSize={0.25}
          color="#FFFFFF"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.05}
          outlineColor="#000000"
          font="/fonts/inter.json"
        >
          {itemData.name}
        </Text>
      )}
      
      <mesh position={[0, -0.42, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.5, 16]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.3} />
      </mesh>
    </group>
  );
}

function getCategoryColor(category: string): string {
  const colors: Record<string, string> = {
    flower: '#FF69B4',
    vegetable: '#90EE90',
    tree: '#228B22',
    tool: '#A0522D',
    decoration: '#FFD700',
    water: '#4169E1',
    animal: '#DEB887',
    generator: '#9370DB',
    chest: '#FFD700',
    currency: '#FFA500',
    special: '#FF1493',
    blocked: '#808080'
  };
  return colors[category] || '#CCCCCC';
}
