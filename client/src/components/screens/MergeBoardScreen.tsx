import { useState, useRef } from 'react';
import { useGameStore } from '../../store/gameStore';
import { soundManager } from '../../lib/sounds';
import { 
  GardenHomeIcon, 
  ShopStoreIcon, 
  StorageBoxIcon, 
  TaskListIcon,
  CherryBlossomIcon,
  TulipIcon,
  SunflowerIcon,
  RoseIcon,
  SproutIcon
} from '../icons/GardenIcons';
import ItemSprite from '../ItemSprite';
import PlantingModal from '../PlantingModal';
import ShopModal from './ShopModal';
import InventoryModal from './InventoryModal';
import TasksModal from './TasksModal';
import ItemDetailsPanel from './ItemDetailsPanel';
import type { BoardItem } from '../../types/game';

const GRID_COLS = 6;
const GRID_ROWS = 5;
const CELL_SIZE = 70;
const GAP = 6;

interface MergeBoardScreenProps {
  onBack?: () => void;
}

export default function MergeBoardScreen({ onBack }: MergeBoardScreenProps) {
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
  const [selectedItem, setSelectedItem] = useState<BoardItem | null>(null);
  const [showShop, setShowShop] = useState(false);
  const [showInventory, setShowInventory] = useState(false);
  const [showTasks, setShowTasks] = useState(false);
  const boardRef = useRef<HTMLDivElement>(null);

  const handleBackToGarden = () => {
    if (onBack) {
      onBack();
    } else {
      setScreen('garden');
    }
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
      
      soundManager.playMerge();
      
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
    soundManager.playClick();
    setDraggedItem(item);
    setSelectedItem(null);
    
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

  const handleItemClick = (item: BoardItem) => {
    if (item.category === 'generator') {
      handleGeneratorClick(item);
    } else if (item.category === 'plant' && item.maxRank && item.rank >= item.maxRank) {
      setPlantingItem(item);
    } else {
      setSelectedItem(item);
    }
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
    <div 
      className="fixed inset-0"
      style={{
        backgroundImage: 'url(/game-assets/basic_garden_background_vertical.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-emerald-900/30 to-emerald-800/50" />
      
      <div className="absolute inset-0 flex flex-col">

        <div className="flex-1 flex items-center justify-center p-2 md:p-4 overflow-auto relative">
          {selectedItem && (
            <ItemDetailsPanel 
              item={selectedItem} 
              onClose={() => setSelectedItem(null)} 
            />
          )}
          
          <div className="bg-gradient-to-b from-green-50/95 via-emerald-50/95 to-green-100/95 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-2xl p-2 sm:p-4 border-4 border-green-500 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-pink-400 via-yellow-300 to-pink-400" />
            <div className="absolute -top-1 left-4 opacity-60"><CherryBlossomIcon size={20} /></div>
            <div className="absolute -top-1 right-4 opacity-60"><TulipIcon size={20} /></div>
            
            <div className="flex items-center justify-center mb-2 sm:mb-3">
              <div className="flex items-center gap-2 bg-gradient-to-r from-green-600 via-emerald-500 to-green-600 px-3 sm:px-5 py-1.5 sm:py-2 rounded-full shadow-lg border-2 border-green-400">
                <SunflowerIcon size={20} />
                <span className="text-white font-bold text-xs sm:text-sm drop-shadow">Garden Merge</span>
                <SunflowerIcon size={20} />
              </div>
            </div>

            <div
              ref={boardRef}
              className="relative rounded-xl sm:rounded-2xl p-1.5 sm:p-2 select-none"
              style={{
                width: GRID_COLS * (CELL_SIZE + GAP) + GAP,
                height: GRID_ROWS * (CELL_SIZE + GAP) + GAP,
                touchAction: 'none',
                background: 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 50%, #a7f3d0 100%)',
                boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.08), 0 4px 12px rgba(0,0,0,0.1)',
                border: '3px solid #86efac',
              }}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
            >
              {Array.from({ length: GRID_ROWS }).map((_, rowIndex) =>
                Array.from({ length: GRID_COLS }).map((_, colIndex) => (
                  <div
                    key={`cell-${rowIndex}-${colIndex}`}
                    className="absolute bg-white/70 border-2 border-green-300/60 rounded-lg sm:rounded-xl"
                    style={{
                      left: colIndex * (CELL_SIZE + GAP) + GAP,
                      top: rowIndex * (CELL_SIZE + GAP) + GAP,
                      width: CELL_SIZE,
                      height: CELL_SIZE,
                      boxShadow: 'inset 0 1px 3px rgba(34,197,94,0.1)',
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
                    style={{
                      ...style,
                      width: CELL_SIZE,
                      height: CELL_SIZE,
                    }}
                    onPointerDown={(e) => handlePointerDown(e, item)}
                    onClick={() => handleItemClick(item)}
                  >
                    <ItemSprite item={item} size={CELL_SIZE} />
                    {isGenerator && item.charges !== undefined && (
                      <div className="absolute -bottom-1 -right-1 bg-gradient-to-r from-amber-400 to-yellow-400 text-amber-900 text-[10px] sm:text-xs font-bold px-1.5 py-0.5 rounded-full border-2 border-amber-500 shadow">
                        {item.charges}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="mt-2 sm:mt-3 text-center text-[10px] sm:text-xs text-green-700 bg-gradient-to-r from-green-100 via-emerald-100 to-green-100 py-1.5 sm:py-2 px-3 sm:px-4 rounded-full border border-green-300 flex items-center justify-center gap-1 sm:gap-2">
              <SproutIcon size={16} />
              <span>Drag 3 matching items to merge!</span>
              <SproutIcon size={16} />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-t from-green-800/95 via-emerald-700/90 to-green-600/80 backdrop-blur-sm p-3 sm:p-4 shadow-lg border-t-4 border-green-900/50 relative overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-1 left-8"><CherryBlossomIcon size={20} /></div>
            <div className="absolute top-2 right-16"><TulipIcon size={20} /></div>
            <div className="absolute bottom-1 left-1/4"><SunflowerIcon size={18} /></div>
            <div className="absolute bottom-2 right-8"><RoseIcon size={18} /></div>
          </div>
          
          <div className="flex items-end justify-around max-w-lg mx-auto relative z-10">
            <button 
              onClick={handleBackToGarden}
              className="flex flex-col items-center gap-1 px-2 sm:px-3 py-1 hover:bg-green-600/50 rounded-xl transition-all active:scale-95"
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-green-100 to-emerald-200 rounded-xl flex items-center justify-center border-2 border-green-400 shadow-lg">
                <GardenHomeIcon size={28} />
              </div>
              <span className="text-[10px] sm:text-xs font-medium text-white">Garden</span>
            </button>

            <button 
              onClick={() => setShowShop(true)}
              className="flex flex-col items-center gap-1 px-3 sm:px-4 py-1 hover:bg-green-600/50 rounded-xl transition-all active:scale-95 -mt-4 sm:-mt-6"
            >
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-amber-200 via-yellow-200 to-amber-300 rounded-2xl flex items-center justify-center border-4 border-amber-500 shadow-2xl relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-amber-400/30 to-transparent" />
                <ShopStoreIcon size={40} className="relative z-10" />
                <div className="absolute -top-1 -right-1 w-5 h-5 sm:w-6 sm:h-6 bg-pink-500 rounded-full flex items-center justify-center border-2 border-pink-300 animate-pulse">
                  <CherryBlossomIcon size={14} />
                </div>
              </div>
              <span className="text-xs sm:text-sm font-bold text-white bg-green-600/80 px-2 py-0.5 rounded-full">Shop</span>
            </button>

            <button 
              onClick={() => setShowInventory(true)}
              className="flex flex-col items-center gap-1 px-2 sm:px-3 py-1 hover:bg-green-600/50 rounded-xl transition-all active:scale-95 relative"
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-orange-100 to-amber-200 rounded-xl flex items-center justify-center border-2 border-orange-400 shadow-lg">
                <StorageBoxIcon size={28} />
              </div>
              <span className="text-[10px] sm:text-xs font-medium text-white">Storage</span>
              {storageItems.length > 0 && (
                <div className="absolute -top-1 right-0 bg-pink-500 text-white text-[10px] font-bold w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center border border-pink-300">
                  {storageItems.length}
                </div>
              )}
            </button>

            <button 
              onClick={() => setShowTasks(true)}
              className="flex flex-col items-center gap-1 px-2 sm:px-3 py-1 hover:bg-green-600/50 rounded-xl transition-all active:scale-95"
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-yellow-100 to-amber-200 rounded-xl flex items-center justify-center border-2 border-yellow-400 shadow-lg">
                <TaskListIcon size={28} />
              </div>
              <span className="text-[10px] sm:text-xs font-medium text-white">Tasks</span>
            </button>
          </div>
        </div>
      </div>
      
      {plantingItem && (
        <PlantingModal
          plant={plantingItem}
          onClose={() => setPlantingItem(null)}
        />
      )}

      {showShop && (
        <ShopModal onClose={() => setShowShop(false)} />
      )}

      {showInventory && (
        <InventoryModal onClose={() => setShowInventory(false)} />
      )}

      {showTasks && (
        <TasksModal onClose={() => setShowTasks(false)} />
      )}
    </div>
  );
}