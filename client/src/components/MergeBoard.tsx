import { useState, useRef } from 'react';
import { useMergeGameStore } from '@/lib/stores/useMergeGameStore';
import { MERGE_ITEMS } from '@/lib/mergeData';
import MergeBoardItem from './MergeBoardItem';
import MergeAnimation from './MergeAnimation';

interface MergeAnimationData {
  id: string;
  x: number;
  y: number;
}

export default function MergeBoard() {
  const { items, gridSize, selectedItem, selectItem, tryMerge, moveItem, tapGenerator } = useMergeGameStore();
  const [animations, setAnimations] = useState<MergeAnimationData[]>([]);
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [dragPosition, setDragPosition] = useState({ x: 0, y: 0 });
  const boardRef = useRef<HTMLDivElement>(null);

  const CELL_SIZE = 70;
  const GAP = 4;

  const getCellPosition = (x: number, y: number) => {
    return {
      left: x * (CELL_SIZE + GAP),
      top: y * (CELL_SIZE + GAP)
    };
  };

  const screenToGrid = (screenX: number, screenY: number) => {
    if (!boardRef.current) return null;
    
    const rect = boardRef.current.getBoundingClientRect();
    const relX = screenX - rect.left;
    const relY = screenY - rect.top;
    
    const gridX = Math.floor(relX / (CELL_SIZE + GAP));
    const gridY = Math.floor(relY / (CELL_SIZE + GAP));
    
    if (gridX >= 0 && gridX < gridSize.cols && gridY >= 0 && gridY < gridSize.rows) {
      return { x: gridX, y: gridY };
    }
    
    return null;
  };

  const handleItemPointerDown = (e: React.PointerEvent, itemId: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    const item = items.find(i => i.id === itemId);
    if (!item) return;
    
    const itemData = MERGE_ITEMS[item.itemType];
    if (itemData?.isGenerator) {
      return;
    }
    
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const offsetY = e.clientY - rect.top;
    
    setDraggedId(itemId);
    setDragOffset({ x: offsetX, y: offsetY });
    setDragPosition({ x: e.clientX, y: e.clientY });
    selectItem(itemId);
    
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!draggedId) return;
    
    setDragPosition({ x: e.clientX, y: e.clientY });
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!draggedId) return;
    
    const gridPos = screenToGrid(e.clientX, e.clientY);
    const draggedItem = items.find(i => i.id === draggedId);
    
    if (gridPos && draggedItem) {
      const targetItem = items.find(i => i.x === gridPos.x && i.y === gridPos.y && i.id !== draggedId);
      
      if (targetItem && draggedItem.itemType === targetItem.itemType) {
        const success = tryMerge(draggedId, targetItem.id);
        
        if (success) {
          const pos = getCellPosition(gridPos.x, gridPos.y);
          setAnimations([...animations, {
            id: `anim_${Date.now()}`,
            x: pos.left + CELL_SIZE / 2,
            y: pos.top + CELL_SIZE / 2
          }]);
          
          setTimeout(() => {
            setAnimations(anims => anims.filter(a => a.id !== `anim_${Date.now()}`));
          }, 1000);
        }
      } else if (!targetItem) {
        moveItem(draggedId, gridPos.x, gridPos.y);
      }
    }
    
    setDraggedId(null);
    selectItem(null);
  };

  const handleItemTap = (itemId: string) => {
    const item = items.find(i => i.id === itemId);
    if (!item) return;
    
    const itemData = MERGE_ITEMS[item.itemType];
    if (itemData?.isGenerator) {
      tapGenerator(itemId);
    }
  };

  return (
    <div className="w-full h-full flex items-center justify-center p-4">
      <div
        ref={boardRef}
        className="relative bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-4 touch-none"
        style={{
          width: gridSize.cols * (CELL_SIZE + GAP) + 8,
          height: gridSize.rows * (CELL_SIZE + GAP) + 8
        }}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        {Array.from({ length: gridSize.rows }).map((_, y) =>
          Array.from({ length: gridSize.cols }).map((_, x) => {
            const pos = getCellPosition(x, y);
            return (
              <div
                key={`cell_${x}_${y}`}
                className="absolute bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl border-2 border-gray-300"
                style={{
                  left: pos.left,
                  top: pos.top,
                  width: CELL_SIZE,
                  height: CELL_SIZE
                }}
              />
            );
          })
        )}
        
        {items.map((item) => {
          const pos = getCellPosition(item.x, item.y);
          const isDragging = draggedId === item.id;
          
          return (
            <MergeBoardItem
              key={item.id}
              item={item}
              position={isDragging ? dragPosition : { x: pos.left, y: pos.top }}
              size={CELL_SIZE}
              isDragging={isDragging}
              dragOffset={dragOffset}
              onPointerDown={(e) => handleItemPointerDown(e, item.id)}
              onTap={() => handleItemTap(item.id)}
            />
          );
        })}
        
        {animations.map((anim) => (
          <MergeAnimation key={anim.id} x={anim.x} y={anim.y} />
        ))}
      </div>
    </div>
  );
}
