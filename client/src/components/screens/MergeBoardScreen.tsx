import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { useGameStore } from '../../store/gameStore';
import { soundManager } from '../../lib/sounds';
import ItemSprite from '../ItemSprite';
import PlantingModal from '../PlantingModal';
import ShopModal from './ShopModal';
import InventoryModal from './InventoryModal';
import TasksModal from './TasksModal';
import ItemDetailsPanel from './ItemDetailsPanel';
import type { BoardItem } from '../../types/game';

const GRID_COLS = 8;
const GRID_ROWS = 8;

interface DraggableIcon {
  id: string;
  type: 'store' | 'inventory' | 'back' | 'tasks';
  x: number;
  y: number;
  size: number;
  sprite: string;
}

const DEFAULT_ICONS: DraggableIcon[] = [
  { id: 'back', type: 'back', x: 20, y: 40, size: 60, sprite: '/game-assets/icon_back.png' },
  { id: 'tasks', type: 'tasks', x: 20, y: 120, size: 60, sprite: '/game-assets/icon_tasks.png' },
  { id: 'store', type: 'store', x: -80, y: 40, size: 60, sprite: '/game-assets/icon_store.png' },
  { id: 'inventory', type: 'inventory', x: -80, y: 120, size: 60, sprite: '/game-assets/icon_inventory.png' },
];

interface MergeBoardScreenProps {
  onBack?: () => void;
}

export default function MergeBoardScreen({ onBack }: MergeBoardScreenProps) {
  const setScreen = useGameStore((state) => state.setScreen);
  const boardItems = useGameStore((state) => state.boardItems);
  const storageItems = useGameStore((state) => state.storageItems);
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
  
  const [icons, setIcons] = useState<DraggableIcon[]>(() => {
    const saved = localStorage.getItem('mergeBoard_iconPositions');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return DEFAULT_ICONS;
      }
    }
    return DEFAULT_ICONS;
  });
  const [draggedIcon, setDraggedIcon] = useState<string | null>(null);
  const [resizingIcon, setResizingIcon] = useState<string | null>(null);
  const [iconDragOffset, setIconDragOffset] = useState({ x: 0, y: 0 });
  const [editMode, setEditMode] = useState(false);
  
  const boardRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [boardSize, setBoardSize] = useState({ width: 300, height: 300 });
  const [cellSize, setCellSize] = useState(35);

  useEffect(() => {
    localStorage.setItem('mergeBoard_iconPositions', JSON.stringify(icons));
  }, [icons]);

  const calculateBoardSize = useCallback(() => {
    if (!containerRef.current) return;
    
    const containerWidth = containerRef.current.clientWidth;
    const containerHeight = containerRef.current.clientHeight;
    
    const maxBoardSize = Math.min(containerWidth * 0.9, containerHeight * 0.75, 500);
    setBoardSize({ width: maxBoardSize, height: maxBoardSize });
    
    const borderPercent = 0.12;
    const innerSize = maxBoardSize * (1 - borderPercent * 2);
    const newCellSize = innerSize / GRID_COLS;
    setCellSize(newCellSize);
  }, []);

  useEffect(() => {
    calculateBoardSize();
    window.addEventListener('resize', calculateBoardSize);
    return () => window.removeEventListener('resize', calculateBoardSize);
  }, [calculateBoardSize]);

  const gridOffset = useMemo(() => {
    const borderPercent = 0.12;
    return {
      x: boardSize.width * borderPercent,
      y: boardSize.height * borderPercent
    };
  }, [boardSize]);

  const getCellPosition = useCallback((gridX: number, gridY: number) => {
    return {
      left: gridOffset.x + gridX * cellSize,
      top: gridOffset.y + gridY * cellSize
    };
  }, [gridOffset, cellSize]);

  const screenToGrid = useCallback((screenX: number, screenY: number) => {
    if (!boardRef.current) return null;
    
    const rect = boardRef.current.getBoundingClientRect();
    const relX = screenX - rect.left - gridOffset.x;
    const relY = screenY - rect.top - gridOffset.y;
    
    const gridX = Math.floor(relX / cellSize);
    const gridY = Math.floor(relY / cellSize);
    
    if (gridX >= 0 && gridX < GRID_COLS && gridY >= 0 && gridY < GRID_ROWS) {
      return { x: gridX, y: gridY };
    }
    return null;
  }, [gridOffset, cellSize]);

  const handleBackToGarden = () => {
    if (onBack) {
      onBack();
    } else {
      setScreen('garden');
    }
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

    if (allMatching.length >= 3) {
      if (draggedItem.maxRank && draggedItem.rank >= draggedItem.maxRank) {
        return false;
      }

      const itemsToMerge = allMatching.slice(0, 3);
      
      itemsToMerge.forEach(item => {
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
    if (!boardRef.current) return;
    
    if (draggedItem) {
      const rect = boardRef.current.getBoundingClientRect();
      setDragPosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!draggedItem || !boardRef.current) {
      setDraggedItem(null);
      return;
    }

    const gridPos = screenToGrid(e.clientX, e.clientY);

    if (gridPos) {
      const occupied = boardItems.find(
        item => item.x === gridPos.x && item.y === gridPos.y && item.id !== draggedItem.id
      );

      if (!occupied || (occupied.itemType === draggedItem.itemType && occupied.rank === draggedItem.rank)) {
        const merged = tryMerge(gridPos.x, gridPos.y, draggedItem);
        
        if (!merged) {
          if (!occupied) {
            moveBoardItem(draggedItem.id, gridPos.x, gridPos.y);
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

  const handleIconPointerDown = (e: React.PointerEvent, iconId: string) => {
    if (!editMode) return;
    
    e.stopPropagation();
    const icon = icons.find(i => i.id === iconId);
    if (!icon) return;
    
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    setIconDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
    setDraggedIcon(iconId);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handleIconPointerMove = (e: React.PointerEvent) => {
    if (!draggedIcon || !containerRef.current) return;
    
    const containerRect = containerRef.current.getBoundingClientRect();
    const newX = e.clientX - containerRect.left - iconDragOffset.x;
    const newY = e.clientY - containerRect.top - iconDragOffset.y;
    
    setIcons(prev => prev.map(icon => 
      icon.id === draggedIcon 
        ? { ...icon, x: newX, y: newY }
        : icon
    ));
  };

  const handleIconPointerUp = () => {
    setDraggedIcon(null);
  };

  const handleIconClick = (iconType: string) => {
    if (editMode) return;
    
    soundManager.playClick();
    switch (iconType) {
      case 'back':
        handleBackToGarden();
        break;
      case 'store':
        setShowShop(true);
        break;
      case 'inventory':
        setShowInventory(true);
        break;
      case 'tasks':
        setShowTasks(true);
        break;
    }
  };

  const handleIconResize = (iconId: string, delta: number) => {
    setIcons(prev => prev.map(icon => 
      icon.id === iconId 
        ? { ...icon, size: Math.max(40, Math.min(100, icon.size + delta)) }
        : icon
    ));
  };

  const resetIconPositions = () => {
    setIcons(DEFAULT_ICONS);
  };

  const getDragStyle = (item: BoardItem) => {
    if (draggedItem?.id === item.id && boardRef.current) {
      return {
        left: dragPosition.x - cellSize / 2,
        top: dragPosition.y - cellSize / 2,
        zIndex: 100,
        opacity: 0.9,
        transform: 'scale(1.1)',
      };
    }
    const pos = getCellPosition(item.x, item.y);
    return {
      left: pos.left,
      top: pos.top,
      zIndex: 10,
    };
  };

  const getIconPosition = (icon: DraggableIcon) => {
    if (!containerRef.current) return { left: icon.x, top: icon.y };
    
    const containerWidth = containerRef.current.clientWidth;
    
    if (icon.x < 0) {
      return { left: containerWidth + icon.x, top: icon.y };
    }
    return { left: icon.x, top: icon.y };
  };

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 overflow-hidden"
      style={{
        backgroundImage: 'url(/game-assets/basic_garden_background_vertical.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
      onPointerMove={(e) => {
        if (draggedIcon) handleIconPointerMove(e);
      }}
      onPointerUp={() => {
        if (draggedIcon) handleIconPointerUp();
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-emerald-900/20 to-emerald-800/40" />
      
      <div className="absolute top-2 right-2 z-50">
        <button
          onClick={() => setEditMode(!editMode)}
          className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
            editMode 
              ? 'bg-amber-500 text-white shadow-lg' 
              : 'bg-white/80 text-gray-700 hover:bg-white'
          }`}
        >
          {editMode ? 'Done Editing' : 'Edit Layout'}
        </button>
        {editMode && (
          <button
            onClick={resetIconPositions}
            className="ml-2 px-3 py-1.5 rounded-full text-xs font-medium bg-red-500 text-white"
          >
            Reset
          </button>
        )}
      </div>
      
      {icons.map(icon => {
        const pos = getIconPosition(icon);
        return (
          <div
            key={icon.id}
            className={`absolute z-40 transition-transform ${
              editMode ? 'cursor-move ring-2 ring-amber-400 ring-offset-2 animate-pulse' : 'cursor-pointer hover:scale-110'
            } ${draggedIcon === icon.id ? 'scale-110 shadow-2xl' : ''}`}
            style={{
              left: pos.left,
              top: pos.top,
              width: icon.size,
              height: icon.size,
            }}
            onPointerDown={(e) => handleIconPointerDown(e, icon.id)}
            onClick={() => handleIconClick(icon.type)}
          >
            <img 
              src={icon.sprite} 
              alt={icon.type}
              className="w-full h-full object-contain drop-shadow-lg"
              draggable={false}
            />
            {editMode && (
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                <button
                  onClick={(e) => { e.stopPropagation(); handleIconResize(icon.id, -10); }}
                  className="w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center"
                >
                  -
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); handleIconResize(icon.id, 10); }}
                  className="w-5 h-5 bg-green-500 text-white rounded-full text-xs flex items-center justify-center"
                >
                  +
                </button>
              </div>
            )}
          </div>
        );
      })}

      <div className="absolute inset-0 flex items-center justify-center">
        {selectedItem && (
          <ItemDetailsPanel 
            item={selectedItem} 
            onClose={() => setSelectedItem(null)} 
          />
        )}
        
        <div
          ref={boardRef}
          className="relative touch-none select-none"
          style={{
            width: boardSize.width,
            height: boardSize.height,
            backgroundImage: 'url(/game-assets/merge_board_sprite.png)',
            backgroundSize: 'contain',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
        >
          {Array.from({ length: GRID_ROWS }).map((_, rowIndex) =>
            Array.from({ length: GRID_COLS }).map((_, colIndex) => {
              const pos = getCellPosition(colIndex, rowIndex);
              return (
                <div
                  key={`cell-${rowIndex}-${colIndex}`}
                  className="absolute pointer-events-none"
                  style={{
                    left: pos.left,
                    top: pos.top,
                    width: cellSize - 2,
                    height: cellSize - 2,
                    border: '1px solid rgba(139, 69, 19, 0.2)',
                    borderRadius: 4,
                  }}
                />
              );
            })
          )}

          {boardItems.map((item) => {
            const style = getDragStyle(item);
            const isGenerator = item.category === 'generator';
            const itemSize = cellSize - 4;
            
            return (
              <div
                key={item.id}
                className={`absolute transition-all ${
                  isGenerator ? 'cursor-pointer hover:scale-110' : 'cursor-grab active:cursor-grabbing'
                } ${draggedItem?.id === item.id ? 'scale-110' : ''}`}
                style={{
                  ...style,
                  width: itemSize,
                  height: itemSize,
                  marginLeft: 2,
                  marginTop: 2,
                }}
                onPointerDown={(e) => handlePointerDown(e, item)}
                onClick={() => handleItemClick(item)}
              >
                <ItemSprite item={item} size={itemSize} />
                {isGenerator && item.charges !== undefined && (
                  <div className="absolute -bottom-1 -right-1 bg-gradient-to-r from-amber-400 to-yellow-400 text-amber-900 text-[8px] font-bold px-1 py-0.5 rounded-full border border-amber-500 shadow">
                    {item.charges}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-amber-900/90 backdrop-blur-sm px-4 py-2 rounded-full border-2 border-amber-600">
        <span className="text-amber-100 text-xs font-medium">
          Drag 3 matching items to merge!
        </span>
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
