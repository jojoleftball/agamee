import { useState, useRef, useEffect, useCallback } from 'react';
import { useMergeGameStore } from '@/lib/stores/useMergeGameStore';
import { useSettingsStore } from '@/lib/stores/useSettingsStore';
import { MERGE_ITEMS } from '@/lib/mergeData';
import MergeBoardItem from './MergeBoardItem';
import MergeAnimation from './MergeAnimation';
import { motion, AnimatePresence } from 'framer-motion';

interface MergeAnimationData {
  id: string;
  x: number;
  y: number;
}

export default function MergeBoard() {
  const { items, selectedItem, selectItem, tryMerge, moveItem, tapGenerator } = useMergeGameStore();
  const { boardSettings } = useSettingsStore();
  const gridSize = boardSettings;
  const [animations, setAnimations] = useState<MergeAnimationData[]>([]);
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [dragPosition, setDragPosition] = useState({ x: 0, y: 0 });
  const [mergeableItems, setMergeableItems] = useState<Set<string>>(new Set());
  const [cellSize, setCellSize] = useState(70);
  const boardRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const GAP = 4;

  const calculateCellSize = useCallback(() => {
    if (!containerRef.current) return;
    
    const containerWidth = containerRef.current.clientWidth;
    const containerHeight = containerRef.current.clientHeight;
    
    const padding = 32;
    const availableWidth = containerWidth - padding;
    const availableHeight = containerHeight - padding;
    
    const maxCellWidth = Math.floor((availableWidth - (gridSize.cols - 1) * GAP) / gridSize.cols);
    const maxCellHeight = Math.floor((availableHeight - (gridSize.rows - 1) * GAP) / gridSize.rows);
    
    const newCellSize = Math.min(maxCellWidth, maxCellHeight, 90);
    const minCellSize = 40;
    
    setCellSize(Math.max(minCellSize, newCellSize));
  }, [gridSize.cols, gridSize.rows]);

  useEffect(() => {
    calculateCellSize();
    
    const handleResize = () => {
      calculateCellSize();
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [calculateCellSize]);

  useEffect(() => {
    if (!draggedId) {
      setMergeableItems(new Set());
      return;
    }
    
    const draggedItem = items.find(i => i.id === draggedId);
    if (!draggedItem) return;
    
    const matching = items.filter(item => 
      item.id !== draggedId && 
      item.itemType === draggedItem.itemType &&
      MERGE_ITEMS[item.itemType]?.mergesInto
    );
    
    setMergeableItems(new Set(matching.map(i => i.id)));
  }, [draggedId, items]);

  const getCellPosition = (x: number, y: number) => {
    return {
      left: x * (cellSize + GAP),
      top: y * (cellSize + GAP)
    };
  };

  const screenToGrid = (screenX: number, screenY: number) => {
    if (!boardRef.current) return null;
    
    const rect = boardRef.current.getBoundingClientRect();
    const relX = screenX - rect.left;
    const relY = screenY - rect.top;
    
    const gridX = Math.floor(relX / (cellSize + GAP));
    const gridY = Math.floor(relY / (cellSize + GAP));
    
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
          const animId = `anim_${Date.now()}_${Math.random()}`;
          setAnimations(prev => [...prev, {
            id: animId,
            x: pos.left + cellSize / 2,
            y: pos.top + cellSize / 2
          }]);
          
          setTimeout(() => {
            setAnimations(anims => anims.filter(a => a.id !== animId));
          }, 1200);
        }
      } else if (!targetItem) {
        moveItem(draggedId, gridPos.x, gridPos.y);
        
        setTimeout(() => {
          const currentItems = useMergeGameStore.getState().items;
          const movedItem = currentItems.find(i => i.id === draggedId);
          if (movedItem && movedItem.x === gridPos.x && movedItem.y === gridPos.y) {
            const nearbyMatching = currentItems.filter(item => {
              if (item.id === draggedId || item.itemType !== movedItem.itemType) return false;
              const dx = Math.abs(item.x - gridPos.x);
              const dy = Math.abs(item.y - gridPos.y);
              return dx <= 1 && dy <= 1;
            });
            
            if (nearbyMatching.length >= 1) {
              const success = tryMerge(nearbyMatching[0].id, draggedId);
              if (success) {
                const pos = getCellPosition(gridPos.x, gridPos.y);
                const animId = `anim_${Date.now()}_${Math.random()}`;
                setAnimations(prev => [...prev, {
                  id: animId,
                  x: pos.left + cellSize / 2,
                  y: pos.top + cellSize / 2
                }]);
                
                setTimeout(() => {
                  setAnimations(anims => anims.filter(a => a.id !== animId));
                }, 1200);
              }
            }
          }
        }, 150);
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
    <div ref={containerRef} className="w-full h-full flex items-center justify-center p-2 sm:p-4">
      <motion.div
        ref={boardRef}
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="relative bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-2xl p-2 sm:p-4 touch-none"
        style={{
          width: gridSize.cols * (cellSize + GAP) + 16,
          height: gridSize.rows * (cellSize + GAP) + 16
        }}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        {Array.from({ length: gridSize.rows }).map((_, y) =>
          Array.from({ length: gridSize.cols }).map((_, x) => {
            const pos = getCellPosition(x, y);
            return (
              <motion.div
                key={`cell_${x}_${y}`}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: (y * gridSize.cols + x) * 0.01 }}
                className="absolute bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg sm:rounded-xl border border-gray-300 sm:border-2"
                style={{
                  left: pos.left,
                  top: pos.top,
                  width: cellSize,
                  height: cellSize
                }}
              />
            );
          })
        )}
        
        {items.map((item) => {
          const pos = getCellPosition(item.x, item.y);
          const isDragging = draggedId === item.id;
          const isMergeable = mergeableItems.has(item.id);
          
          return (
            <div key={item.id} className="absolute" style={{ left: pos.left, top: pos.top, width: cellSize, height: cellSize }}>
              {isMergeable && (
                <motion.div
                  animate={{ 
                    scale: [1, 1.2, 1],
                    opacity: [0.5, 1, 0.5]
                  }}
                  transition={{ 
                    duration: 1, 
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="absolute inset-0 bg-green-400 rounded-lg sm:rounded-xl -m-1"
                  style={{ filter: 'blur(6px)' }}
                />
              )}
              <MergeBoardItem
                item={item}
                position={isDragging ? dragPosition : { x: pos.left, y: pos.top }}
                size={cellSize}
                isDragging={isDragging}
                dragOffset={dragOffset}
                onPointerDown={(e) => handleItemPointerDown(e, item.id)}
                onTap={() => handleItemTap(item.id)}
              />
            </div>
          );
        })}
        
        <AnimatePresence>
          {animations.map((anim) => (
            <MergeAnimation key={anim.id} x={anim.x} y={anim.y} />
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
