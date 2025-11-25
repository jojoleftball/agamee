import { useState, useRef } from 'react';
import { useGameStore } from '../../store/gameStore';
import { ChevronLeft, Package, ShoppingBag, ListTodo } from 'lucide-react';
import ItemSprite from '../ItemSprite';
import PlantingModal from '../PlantingModal';
import TutorialOverlay from '../TutorialOverlay';
import type { BoardItem } from '../../types/game';

const GRID_COLS = 6;
const GRID_ROWS = 5;
const CELL_SIZE = 80;
const GAP = 8;

export default function MergeBoardScreen() {
  const setScreen = useGameStore((state) => state.setScreen);
  const boardItems = useGameStore((state) => state.boardItems);
  const storageItems = useGameStore((state) => state.storageItems);
  const resources = useGameStore((state) => state.resources);
  const removeBoardItem = useGameStore((state) => state.removeBoardItem);
  const addBoardItem = useGameStore((state) => state.addBoardItem);
  const moveBoardItem = useGameStore((state) => state.moveBoardItem);
  const addCoins = useGameStore((state) => state.addCoins);
  const addXP = useGameStore((state) => state.addXP);
  const updateBoardItem = useGameStore((state) => state.updateBoardItem);

  const [draggedItem, setDraggedItem] = useState<BoardItem | null>(null);
  const [dragPosition, setDragPosition] = useState({ x: 0, y: 0 });
  const [plantingItem, setPlantingItem] = useState<BoardItem | null>(null);
  const boardRef = useRef<HTMLDivElement>(null);

  const handleBackToGarden = () => {
    setScreen('garden');
  };

  const findAdjacentMatching = (centerX: number, centerY: number, itemType: string, rank: number, category: string): BoardItem[] => {
    const matching: BoardItem[] = [];
    
    for (const item of boardItems) {
      if (item.itemType !== itemType || item.rank !== rank || item.category !== category) continue;
      
      const dx = Math.abs(item.x - centerX);
      const dy = Math.abs(item.y - centerY);
      
      if (dx <= 1 && dy <= 1 && (dx + dy) > 0) {
        matching.push(item);
      }
    }
    
    return matching;
  };

  const tryMerge = (targetX: number, targetY: number, draggedItem: BoardItem) => {
    const allMatching = boardItems.filter(
      item => 
        item.itemType === draggedItem.itemType &&
        item.rank === draggedItem.rank &&
        item.category === draggedItem.category &&
        Math.abs(item.x - targetX) <= 1 &&
        Math.abs(item.y - targetY) <= 1
    );

    console.log(`Found ${allMatching.length} matching items near (${targetX}, ${targetY})`);

    if (allMatching.length >= 3) {
      if (draggedItem.maxRank && draggedItem.rank >= draggedItem.maxRank) {
        console.log('Item already at max rank, cannot merge');
        return false;
      }

      console.log('MERGING 3 items!');
      const itemsToMerge = allMatching.slice(0, 3);
      
      itemsToMerge.forEach(item => {
        console.log('Removing item:', item.id);
        removeBoardItem(item.id);
      });

      const newItem: BoardItem = {
        id: `merged-${Date.now()}-${Math.random()}`,
        category: draggedItem.category,
        itemType: draggedItem.itemType,
        rank: draggedItem.rank + 1,
        maxRank: draggedItem.maxRank,
        x: targetX,
        y: targetY,
      };

      console.log('Adding new merged item:', newItem);
      addBoardItem(newItem);
      
      const coinReward = 10 * draggedItem.rank;
      const xpReward = 5 * draggedItem.rank;
      addCoins(coinReward);
      addXP(xpReward);
      
      return true;
    }
    
    return false;
  };

  const handlePointerDown = (e: React.PointerEvent, item: BoardItem) => {
    if (item.category === 'generator') return;
    
    e.stopPropagation();
    setDraggedItem(item);
    
    if (boardRef.current) {
      const rect = boardRef.current.getBoundingClientRect();
      setDragPosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!draggedItem || !boardRef.current) return;
    
    const rect = boardRef.current.getBoundingClientRect();
    setDragPosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!draggedItem || !boardRef.current) {
      setDraggedItem(null);
      return;
    }

    const rect = boardRef.current.getBoundingClientRect();
    const relX = e.clientX - rect.left;
    const relY = e.clientY - rect.top;

    const gridX = Math.round(relX / (CELL_SIZE + GAP));
    const gridY = Math.round(relY / (CELL_SIZE + GAP));

    console.log(`Dropped at grid (${gridX}, ${gridY})`);

    if (gridX >= 0 && gridX < GRID_COLS && gridY >= 0 && gridY < GRID_ROWS) {
      const occupied = boardItems.find(
        item => item.x === gridX && item.y === gridY && item.id !== draggedItem.id
      );

      if (!occupied || (occupied.itemType === draggedItem.itemType && occupied.rank === draggedItem.rank)) {
        const merged = tryMerge(gridX, gridY, draggedItem);
        
        if (!merged) {
          if (!occupied) {
            moveBoardItem(draggedItem.id, gridX, gridY);
          }
        }
      }
    }

    setDraggedItem(null);
  };

  const handleGeneratorClick = (item: BoardItem) => {
    if (item.category !== 'generator') return;
    if (!item.charges || item.charges <= 0) return;
    
    const now = Date.now();
    if (item.lastGenerated && (now - item.lastGenerated) < 10000) {
      console.log('Generator on cooldown');
      return;
    }
    
    const emptySlots: { x: number; y: number }[] = [];
    for (let y = 0; y < GRID_ROWS; y++) {
      for (let x = 0; x < GRID_COLS; x++) {
        const occupied = boardItems.some(i => i.x === x && i.y === y);
        if (!occupied) {
          emptySlots.push({ x, y });
        }
      }
    }
    
    if (emptySlots.length === 0) {
      console.log('No empty slots for generator');
      return;
    }
    
    const randomSlot = emptySlots[Math.floor(Math.random() * emptySlots.length)];
    
    const newItem: BoardItem = {
      id: `gen-${Date.now()}-${Math.random()}`,
      category: 'plant',
      itemType: 'rose',
      rank: 1,
      maxRank: 5,
      x: randomSlot.x,
      y: randomSlot.y,
    };
    
    addBoardItem(newItem);
    updateBoardItem(item.id, {
      charges: (item.charges || 0) - 1,
      lastGenerated: now,
    });
    
    console.log('Generator created new item');
  };

  const getDragStyle = (item: BoardItem) => {
    if (draggedItem?.id === item.id && boardRef.current) {
      return {
        left: dragPosition.x - CELL_SIZE / 2,
        top: dragPosition.y - CELL_SIZE / 2,
        zIndex: 100,
        opacity: 0.8,
      };
    }
    return {
      left: item.x * (CELL_SIZE + GAP) + GAP,
      top: item.y * (CELL_SIZE + GAP) + GAP,
      zIndex: 10,
    };
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm">
      <div className="absolute inset-0 flex flex-col">
        <div className="bg-gradient-to-b from-emerald-600 to-emerald-700 p-4 shadow-lg">
          <div className="flex items-center justify-between max-w-6xl mx-auto">
            <button
              onClick={handleBackToGarden}
              className="flex items-center gap-2 px-4 py-2 bg-white/90 hover:bg-white rounded-lg shadow-lg transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
              <span className="font-medium">Back</span>
            </button>

            <div className="flex items-center gap-2 md:gap-4">
              <div className="bg-yellow-500 px-2 md:px-4 py-2 rounded-lg shadow-lg flex items-center gap-1 md:gap-2 border-2 border-yellow-600">
                <span className="text-xl md:text-2xl">💰</span>
                <span className="font-bold text-white text-sm md:text-base">{resources.coins}</span>
              </div>
              <div className="bg-blue-500 px-2 md:px-4 py-2 rounded-lg shadow-lg flex items-center gap-1 md:gap-2 border-2 border-blue-600">
                <span className="text-xl md:text-2xl">⚡</span>
                <span className="font-bold text-white text-sm md:text-base">{resources.energy}/{resources.maxEnergy}</span>
              </div>
              <div className="bg-purple-500 px-2 md:px-4 py-2 rounded-lg shadow-lg flex items-center gap-1 md:gap-2 border-2 border-purple-600">
                <span className="text-xl md:text-2xl">💎</span>
                <span className="font-bold text-white text-sm md:text-base">{resources.gems}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center p-2 md:p-4 overflow-auto">
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-4 md:p-6 border-4 border-emerald-600">
            <h2 className="text-xl md:text-2xl font-bold text-center text-emerald-700 mb-3 md:mb-4">
              Merge Board
            </h2>

            <div
              ref={boardRef}
              className="relative bg-emerald-50 rounded-xl p-2 md:p-4 border-2 border-emerald-300 select-none"
              style={{
                width: GRID_COLS * (CELL_SIZE + GAP) + GAP,
                height: GRID_ROWS * (CELL_SIZE + GAP) + GAP,
                touchAction: 'none',
              }}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
            >
              {Array.from({ length: GRID_ROWS }).map((_, rowIndex) =>
                Array.from({ length: GRID_COLS }).map((_, colIndex) => (
                  <div
                    key={`cell-${rowIndex}-${colIndex}`}
                    className="absolute bg-white/50 border-2 border-emerald-200 rounded-lg"
                    style={{
                      left: colIndex * (CELL_SIZE + GAP) + GAP,
                      top: rowIndex * (CELL_SIZE + GAP) + GAP,
                      width: CELL_SIZE,
                      height: CELL_SIZE,
                    }}
                  />
                ))
              )}

              {boardItems.map((item) => {
                const style = getDragStyle(item);
                const isGenerator = item.category === 'generator';
                
                return (
                  <div
                    key={item.id}
                    className={`absolute transition-all ${
                      isGenerator ? 'cursor-pointer hover:scale-110' : 'cursor-grab active:cursor-grabbing'
                    } ${draggedItem?.id === item.id ? 'scale-110' : ''}`}
                    style={style}
                    onPointerDown={(e) => handlePointerDown(e, item)}
                    onClick={() => {
                      if (isGenerator) {
                        handleGeneratorClick(item);
                      } else if (item.category === 'plant' && item.maxRank && item.rank >= item.maxRank) {
                        setPlantingItem(item);
                      }
                    }}
                  >
                    <ItemSprite item={item} size={CELL_SIZE} />
                  </div>
                );
              })}
            </div>

            <div className="mt-3 md:mt-4 text-center text-xs md:text-sm text-gray-600">
              Drag 3 identical items together to merge! Tap generators to create items.
            </div>
          </div>
        </div>

        <div className="bg-white border-t-4 border-emerald-600 p-3 md:p-4 shadow-lg">
          <div className="flex items-center justify-around max-w-md mx-auto">
            <button className="flex flex-col items-center gap-1 px-2 md:px-4 py-2 hover:bg-emerald-50 rounded-lg transition-colors">
              <Package className="w-5 md:w-6 h-5 md:h-6 text-emerald-600" />
              <span className="text-xs font-medium text-gray-700">
                Storage ({storageItems.length}/10)
              </span>
            </button>

            <button className="flex flex-col items-center gap-1 px-2 md:px-4 py-2 hover:bg-emerald-50 rounded-lg transition-colors">
              <ShoppingBag className="w-5 md:w-6 h-5 md:h-6 text-emerald-600" />
              <span className="text-xs font-medium text-gray-700">Store</span>
            </button>

            <button className="flex flex-col items-center gap-1 px-2 md:px-4 py-2 hover:bg-emerald-50 rounded-lg transition-colors">
              <ListTodo className="w-5 md:w-6 h-5 md:h-6 text-emerald-600" />
              <span className="text-xs font-medium text-gray-700">Tasks</span>
            </button>
          </div>
        </div>
      </div>
      
      <TutorialOverlay />
      
      {plantingItem && (
        <PlantingModal
          plant={plantingItem}
          onClose={() => setPlantingItem(null)}
        />
      )}
    </div>
  );
}
