import { useState, useRef } from 'react';
import { useBoardStore } from '@/lib/stores/useBoardStore';
import { MERGE_ITEMS } from '@/lib/mergeItems';
import { useMergeGame } from '@/lib/stores/useMergeGame';
import { useAudio } from '@/lib/stores/useAudio';
import SpriteItem from './SpriteItem';

interface DragState {
  itemId: string;
  startX: number;
  startY: number;
  offsetX: number;
  offsetY: number;
}

export default function MergeBoard() {
  const { items, moveItem, tryMerge, getItemAt, isPositionOccupied, gridSize } = useBoardStore();
  const { spendEnergy, addCoins } = useMergeGame();
  const { playSuccess, playHit } = useAudio();
  const [dragState, setDragState] = useState<DragState | null>(null);
  const [dragPosition, setDragPosition] = useState<{ x: number; y: number } | null>(null);
  const boardRef = useRef<HTMLDivElement>(null);

  const CELL_SIZE = 70;
  const GAP = 8;

  const getCellPosition = (gridX: number, gridY: number) => {
    return {
      x: gridX * (CELL_SIZE + GAP),
      y: gridY * (CELL_SIZE + GAP)
    };
  };

  const getGridPosition = (clientX: number, clientY: number) => {
    if (!boardRef.current) return null;
    
    const rect = boardRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    
    const gridX = Math.floor(x / (CELL_SIZE + GAP));
    const gridY = Math.floor(y / (CELL_SIZE + GAP));
    
    if (gridX >= 0 && gridX < gridSize.cols && gridY >= 0 && gridY < gridSize.rows) {
      return { x: gridX, y: gridY };
    }
    
    return null;
  };

  const handleDragStart = (e: React.TouchEvent | React.MouseEvent, itemId: string) => {
    e.preventDefault();
    
    const item = items.find(i => i.id === itemId);
    if (!item) return;
    
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    
    const cellPos = getCellPosition(item.x, item.y);
    
    setDragState({
      itemId,
      startX: item.x,
      startY: item.y,
      offsetX: clientX - (boardRef.current?.getBoundingClientRect().left || 0) - cellPos.x,
      offsetY: clientY - (boardRef.current?.getBoundingClientRect().top || 0) - cellPos.y
    });
    
    setDragPosition({ x: cellPos.x, y: cellPos.y });
  };

  const handleDragMove = (e: React.TouchEvent | React.MouseEvent) => {
    if (!dragState || !boardRef.current) return;
    
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    
    const rect = boardRef.current.getBoundingClientRect();
    const x = clientX - rect.left - dragState.offsetX;
    const y = clientY - rect.top - dragState.offsetY;
    
    setDragPosition({ x, y });
  };

  const handleDragEnd = (e: React.TouchEvent | React.MouseEvent) => {
    if (!dragState) return;
    
    const clientX = 'changedTouches' in e ? e.changedTouches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY = 'changedTouches' in e ? e.changedTouches[0].clientY : (e as React.MouseEvent).clientY;
    
    const gridPos = getGridPosition(clientX, clientY);
    
    if (gridPos) {
      const targetItem = getItemAt(gridPos.x, gridPos.y);
      
      if (targetItem && targetItem.id !== dragState.itemId) {
        const merged = tryMerge(dragState.itemId, targetItem.id);
        
        if (merged) {
          const item = items.find(i => i.id === dragState.itemId);
          if (item) {
            const mergeItem = MERGE_ITEMS[item.itemType];
            addCoins(mergeItem.coinValue);
            playSuccess();
          }
        } else {
          playHit();
        }
      } else if (!isPositionOccupied(gridPos.x, gridPos.y, dragState.itemId)) {
        moveItem(dragState.itemId, gridPos.x, gridPos.y);
      } else {
        moveItem(dragState.itemId, dragState.startX, dragState.startY);
      }
    } else {
      moveItem(dragState.itemId, dragState.startX, dragState.startY);
    }
    
    setDragState(null);
    setDragPosition(null);
  };

  return (
    <div className="relative flex items-center justify-center p-4">
      <div
        ref={boardRef}
        className="relative bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-4 shadow-xl border-4 border-amber-200"
        style={{
          width: gridSize.cols * (CELL_SIZE + GAP) + GAP,
          height: gridSize.rows * (CELL_SIZE + GAP) + GAP,
          touchAction: 'none'
        }}
        onMouseMove={handleDragMove}
        onMouseUp={handleDragEnd}
        onMouseLeave={handleDragEnd}
        onTouchMove={handleDragMove}
        onTouchEnd={handleDragEnd}
      >
        {Array.from({ length: gridSize.rows }).map((_, row) =>
          Array.from({ length: gridSize.cols }).map((_, col) => {
            const pos = getCellPosition(col, row);
            return (
              <div
                key={`cell-${row}-${col}`}
                className="absolute bg-white/40 rounded-lg border-2 border-dashed border-amber-300"
                style={{
                  left: pos.x,
                  top: pos.y,
                  width: CELL_SIZE,
                  height: CELL_SIZE
                }}
              />
            );
          })
        )}
        
        {items.map((item) => {
          const isDragging = dragState?.itemId === item.id;
          const pos = isDragging && dragPosition 
            ? dragPosition 
            : getCellPosition(item.x, item.y);
          
          const mergeItem = MERGE_ITEMS[item.itemType];
          
          return (
            <div
              key={item.id}
              className={`absolute cursor-grab active:cursor-grabbing transition-all ${
                isDragging ? 'z-50 scale-110' : 'z-10'
              }`}
              style={{
                left: pos.x,
                top: pos.y,
                width: CELL_SIZE,
                height: CELL_SIZE,
                transition: isDragging ? 'none' : 'all 0.2s ease-out'
              }}
              onMouseDown={(e) => handleDragStart(e, item.id)}
              onTouchStart={(e) => handleDragStart(e, item.id)}
            >
              <div className={`w-full h-full bg-gradient-to-br from-white to-blue-50 rounded-xl shadow-lg border-3 border-blue-200 overflow-hidden ${
                isDragging ? 'shadow-2xl' : ''
              }`}>
                <SpriteItem itemType={item.itemType} size={CELL_SIZE} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
