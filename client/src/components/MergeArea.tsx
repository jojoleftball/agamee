import { useRef, useState } from 'react';
import { useFrame, ThreeEvent } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import { useMergeStore } from '@/lib/stores/useMergeStore';
import MergeItem3D from './MergeItem3D';

interface MergeAreaProps {
  position: [number, number, number];
  zone: string;
}

export default function MergeArea({ position, zone }: MergeAreaProps) {
  const { items, gridSize, selectedItem, moveItem, tryMerge, selectItem } = useMergeStore();
  const [hoveredCell, setHoveredCell] = useState<{x: number; y: number} | null>(null);
  const groupRef = useRef<THREE.Group>(null);
  
  const cellSize = 2;
  const gap = 0.3;
  const totalWidth = gridSize.cols * cellSize + (gridSize.cols - 1) * gap;
  const totalHeight = gridSize.rows * cellSize + (gridSize.rows - 1) * gap;
  
  const offsetX = -totalWidth / 2 + cellSize / 2;
  const offsetZ = -totalHeight / 2 + cellSize / 2;

  const handleCellClick = (x: number, y: number, event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation();
    
    const clickedItem = items.find(item => item.x === x && item.y === y);
    if (clickedItem) {
      if (selectedItem === clickedItem.id) {
        selectItem(null);
      } else {
        selectItem(clickedItem.id);
      }
    } else if (selectedItem) {
      const itemToMove = items.find(item => item.id === selectedItem);
      if (itemToMove) {
        moveItem(selectedItem, x, y, 0);
        selectItem(null);
      }
    }
  };

  const handleItemClick = (itemId: string, event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation();
    
    const clickedItem = items.find(i => i.id === itemId);
    if (!clickedItem) return;

    if (selectedItem && selectedItem !== itemId) {
      const selectedItemData = items.find(i => i.id === selectedItem);
      if (selectedItemData && selectedItemData.itemType === clickedItem.itemType) {
        const result = tryMerge(selectedItem, itemId);
        if (result.success) {
          console.log('Merge successful!', result);
          selectItem(null);
          return;
        }
      }
    }
    
    if (selectedItem === itemId) {
      selectItem(null);
    } else {
      selectItem(itemId);
    }
  };

  const getCellPosition = (x: number, y: number): [number, number, number] => {
    return [
      position[0] + offsetX + x * (cellSize + gap),
      position[1],
      position[2] + offsetZ + y * (cellSize + gap)
    ];
  };

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.0002;
    }
  });

  return (
    <group ref={groupRef} position={position}>
      {Array.from({ length: gridSize.rows }, (_, y) =>
        Array.from({ length: gridSize.cols }, (_, x) => {
          const isHovered = hoveredCell?.x === x && hoveredCell?.y === y;
          const cellPos = getCellPosition(x, y);
          
          return (
            <mesh
              key={`cell-${x}-${y}`}
              position={[cellPos[0] - position[0], 0, cellPos[2] - position[2]]}
              rotation={[-Math.PI / 2, 0, 0]}
              onPointerEnter={(e) => {
                e.stopPropagation();
                setHoveredCell({ x, y });
              }}
              onPointerLeave={() => setHoveredCell(null)}
              onClick={(e) => handleCellClick(x, y, e)}
            >
              <planeGeometry args={[cellSize - 0.1, cellSize - 0.1]} />
              <meshStandardMaterial
                color={isHovered ? '#90EE90' : '#DEB887'}
                transparent
                opacity={0.6}
                roughness={0.8}
              />
            </mesh>
          );
        })
      )}
      
      {items.map((item) => {
        const itemPos = getCellPosition(item.x, item.y);
        return (
          <MergeItem3D
            key={item.id}
            item={item}
            position={[itemPos[0] - position[0], 0.5, itemPos[2] - position[2]]}
            selected={selectedItem === item.id}
            onClick={(e) => handleItemClick(item.id, e)}
          />
        );
      })}
      
      <Text
        position={[0, 0.01, totalHeight / 2 + 1.5]}
        rotation={[-Math.PI / 2, 0, 0]}
        fontSize={0.5}
        color="#2E7D32"
        anchorX="center"
        anchorY="middle"
        font="/fonts/inter.json"
      >
        {zone.replace('_', ' ').toUpperCase()}
      </Text>
    </group>
  );
}
