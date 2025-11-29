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

interface GridSettings {
  offsetX: number;
  offsetY: number;
  cellWidth: number;
  cellHeight: number;
  showOutlines: boolean;
}

const DEFAULT_ICONS: DraggableIcon[] = [
  { id: 'back', type: 'back', x: 20, y: 40, size: 60, sprite: '/game-assets/icon_back.png' },
  { id: 'tasks', type: 'tasks', x: 20, y: 120, size: 60, sprite: '/game-assets/icon_tasks.png' },
  { id: 'store', type: 'store', x: -80, y: 40, size: 60, sprite: '/game-assets/icon_store.png' },
  { id: 'inventory', type: 'inventory', x: -80, y: 120, size: 60, sprite: '/game-assets/icon_inventory.png' },
];

const DEFAULT_GRID_SETTINGS: GridSettings = {
  offsetX: 12,
  offsetY: 12,
  cellWidth: 76,
  cellHeight: 76,
  showOutlines: true,
};

interface MergeBoardScreenProps {
  onBack?: () => void;
}

export default function MergeBoardScreen({ onBack }: MergeBoardScreenProps) {
  const setScreen = useGameStore((state) => state.setScreen);
  const boardItems = useGameStore((state) => state.boardItems);
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
  
  const [gridSettings, setGridSettings] = useState<GridSettings>(() => {
    const saved = localStorage.getItem('mergeBoard_gridSettings');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return DEFAULT_GRID_SETTINGS;
      }
    }
    return DEFAULT_GRID_SETTINGS;
  });
  
  const [draggedIcon, setDraggedIcon] = useState<string | null>(null);
  const [iconDragOffset, setIconDragOffset] = useState({ x: 0, y: 0 });
  const [editMode, setEditMode] = useState(false);
  const [draggingGrid, setDraggingGrid] = useState(false);
  const [gridDragStart, setGridDragStart] = useState({ x: 0, y: 0, offsetX: 0, offsetY: 0 });
  
  const boardRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [boardSize, setBoardSize] = useState({ width: 300, height: 300 });

  useEffect(() => {
    localStorage.setItem('mergeBoard_iconPositions', JSON.stringify(icons));
  }, [icons]);

  useEffect(() => {
    localStorage.setItem('mergeBoard_gridSettings', JSON.stringify(gridSettings));
  }, [gridSettings]);

  const calculateBoardSize = useCallback(() => {
    if (!containerRef.current) return;
    
    const containerWidth = containerRef.current.clientWidth;
    const containerHeight = containerRef.current.clientHeight;
    
    const maxBoardSize = Math.min(containerWidth * 0.9, containerHeight * 0.75, 500);
    setBoardSize({ width: maxBoardSize, height: maxBoardSize });
  }, []);

  useEffect(() => {
    calculateBoardSize();
    window.addEventListener('resize', calculateBoardSize);
    return () => window.removeEventListener('resize', calculateBoardSize);
  }, [calculateBoardSize]);

  const scaleFactor = useMemo(() => boardSize.width / 500, [boardSize.width]);

  const scaledGrid = useMemo(() => ({
    offsetX: gridSettings.offsetX * scaleFactor,
    offsetY: gridSettings.offsetY * scaleFactor,
    cellWidth: gridSettings.cellWidth * scaleFactor,
    cellHeight: gridSettings.cellHeight * scaleFactor,
  }), [gridSettings, scaleFactor]);

  const getCellPosition = useCallback((gridX: number, gridY: number) => {
    return {
      left: scaledGrid.offsetX + gridX * scaledGrid.cellWidth,
      top: scaledGrid.offsetY + gridY * scaledGrid.cellHeight
    };
  }, [scaledGrid]);

  const screenToGrid = useCallback((screenX: number, screenY: number) => {
    if (!boardRef.current) return null;
    
    const rect = boardRef.current.getBoundingClientRect();
    const relX = screenX - rect.left - scaledGrid.offsetX;
    const relY = screenY - rect.top - scaledGrid.offsetY;
    
    const gridX = Math.floor(relX / scaledGrid.cellWidth);
    const gridY = Math.floor(relY / scaledGrid.cellHeight);
    
    if (gridX >= 0 && gridX < GRID_COLS && gridY >= 0 && gridY < GRID_ROWS) {
      return { x: gridX, y: gridY };
    }
    return null;
  }, [scaledGrid]);

  const handleBackToGarden = () => {
    if (onBack) {
      onBack();
    } else {
      setScreen('garden');
    }
  };

  const tryMerge = (targetX: number, targetY: number, draggedItem: BoardItem) => {
    const targetItem = boardItems.find(
      item =>
        item.id !== draggedItem.id &&
        item.itemType === draggedItem.itemType &&
        item.rank === draggedItem.rank &&
        item.category === draggedItem.category &&
        item.x === targetX &&
        item.y === targetY
    );

    if (targetItem) {
      if (draggedItem.maxRank && draggedItem.rank >= draggedItem.maxRank) {
        return false;
      }

      removeBoardItem(draggedItem.id);
      removeBoardItem(targetItem.id);

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

  const resetAll = () => {
    setIcons(DEFAULT_ICONS);
    setGridSettings(DEFAULT_GRID_SETTINGS);
  };

  const handleGridDragStart = (e: React.PointerEvent) => {
    if (!editMode) return;
    e.stopPropagation();
    setDraggingGrid(true);
    setGridDragStart({
      x: e.clientX,
      y: e.clientY,
      offsetX: gridSettings.offsetX,
      offsetY: gridSettings.offsetY
    });
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handleGridDragMove = (e: React.PointerEvent) => {
    if (!draggingGrid) return;
    
    const deltaX = (e.clientX - gridDragStart.x) / scaleFactor;
    const deltaY = (e.clientY - gridDragStart.y) / scaleFactor;
    
    setGridSettings(prev => ({
      ...prev,
      offsetX: gridDragStart.offsetX + deltaX,
      offsetY: gridDragStart.offsetY + deltaY
    }));
  };

  const handleGridDragEnd = () => {
    setDraggingGrid(false);
  };

  const adjustGridCellSize = (delta: number) => {
    setGridSettings(prev => ({
      ...prev,
      cellWidth: Math.max(30, Math.min(100, prev.cellWidth + delta)),
      cellHeight: Math.max(30, Math.min(100, prev.cellHeight + delta))
    }));
  };

  const getDragStyle = (item: BoardItem) => {
    if (draggedItem?.id === item.id && boardRef.current) {
      return {
        left: dragPosition.x - scaledGrid.cellWidth / 2,
        top: dragPosition.y - scaledGrid.cellHeight / 2,
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
        if (draggingGrid) handleGridDragMove(e);
      }}
      onPointerUp={() => {
        if (draggedIcon) handleIconPointerUp();
        if (draggingGrid) handleGridDragEnd();
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-emerald-900/20 to-emerald-800/40" />
      
      <div className="absolute top-2 right-2 z-50 flex flex-col items-end gap-2">
        <div className="flex gap-2">
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
              onClick={resetAll}
              className="px-3 py-1.5 rounded-full text-xs font-medium bg-red-500 text-white"
            >
              Reset
            </button>
          )}
        </div>
        
        {editMode && (
          <div className="bg-white/90 backdrop-blur-sm rounded-lg p-2 shadow-lg">
            <div className="text-[10px] font-medium text-gray-700 mb-1">Grid Size</div>
            <div className="flex gap-1">
              <button
                onClick={() => adjustGridCellSize(-2)}
                className="w-6 h-6 bg-red-500 text-white rounded text-xs flex items-center justify-center"
              >
                -
              </button>
              <span className="text-[10px] text-gray-600 flex items-center px-1">
                {Math.round(gridSettings.cellWidth)}
              </span>
              <button
                onClick={() => adjustGridCellSize(2)}
                className="w-6 h-6 bg-green-500 text-white rounded text-xs flex items-center justify-center"
              >
                +
              </button>
            </div>
            <div className="text-[8px] text-gray-500 mt-1 text-center">
              Drag grid to move
            </div>
          </div>
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
              const isFirstCell = rowIndex === 0 && colIndex === 0;
              return (
                <div
                  key={`cell-${rowIndex}-${colIndex}`}
                  className={`absolute ${editMode && isFirstCell ? 'cursor-move' : 'pointer-events-none'}`}
                  style={{
                    left: pos.left,
                    top: pos.top,
                    width: scaledGrid.cellWidth - 2,
                    height: scaledGrid.cellHeight - 2,
                    border: gridSettings.showOutlines 
                      ? (editMode 
                          ? '2px solid rgba(251, 191, 36, 0.8)' 
                          : '1px solid rgba(139, 69, 19, 0.3)')
                      : 'none',
                    borderRadius: 4,
                    backgroundColor: editMode ? 'rgba(251, 191, 36, 0.1)' : 'transparent',
                  }}
                  onPointerDown={editMode && isFirstCell ? handleGridDragStart : undefined}
                />
              );
            })
          )}

          {boardItems.map((item) => {
            const style = getDragStyle(item);
            const isGenerator = item.category === 'generator';
            const itemSize = Math.min(scaledGrid.cellWidth, scaledGrid.cellHeight) - 4;
            
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
                  marginLeft: (scaledGrid.cellWidth - itemSize) / 2,
                  marginTop: (scaledGrid.cellHeight - itemSize) / 2,
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
