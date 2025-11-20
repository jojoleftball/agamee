import { useState, useRef } from 'react';
import { useBoardStore } from '@/lib/stores/useBoardStore';
import { MERGE_ITEMS } from '@/lib/mergeItems';
import { useMergeGame } from '@/lib/stores/useMergeGame';
import { useAudio } from '@/lib/stores/useAudio';
import SpriteItem from './SpriteItem';
import { Sparkles, Trash2, Undo2, Info } from 'lucide-react';

interface DragState {
  itemId: string;
  startX: number;
  startY: number;
  offsetX: number;
  offsetY: number;
}

export default function MergeBoard() {
  const { 
    items, 
    inventory,
    moveItem, 
    tryMerge, 
    getItemAt, 
    isPositionOccupied, 
    gridSize,
    tapGenerator,
    canTapGenerator,
    openChest,
    moveToInventory,
    moveFromInventory,
    isInventoryFull,
    sellItem,
    undoSell,
    lastSold
  } = useBoardStore();
  
  const { energy } = useMergeGame();
  const { playSuccess, playHit } = useAudio();
  const [dragState, setDragState] = useState<DragState | null>(null);
  const [dragPosition, setDragPosition] = useState<{ x: number; y: number } | null>(null);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [showInventory, setShowInventory] = useState(true);
  const [mergeEffect, setMergeEffect] = useState<{ x: number; y: number } | null>(null);
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

  const handleItemClick = (itemId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const item = items.find(i => i.id === itemId);
    if (!item) return;
    
    const itemData = MERGE_ITEMS[item.itemType];
    
    // Handle generator tap
    if (itemData?.isGenerator) {
      if (canTapGenerator(itemId)) {
        const result = tapGenerator(itemId);
        if (result.success) {
          playSuccess();
          console.log(`Generated: ${result.generatedItem}`);
        } else {
          playHit();
        }
      } else {
        const charges = item.charges || 0;
        if (charges <= 0) {
          alert('Generator is empty! Merge it with another to recharge.');
        } else {
          alert(`Not enough energy! Need 5 energy. You have ${energy}.`);
        }
      }
      return;
    }
    
    // Handle chest opening
    if (itemData?.isChest) {
      const rewards = openChest(itemId);
      if (rewards) {
        playSuccess();
        alert(`🎁 Chest opened!\n💰 ${rewards.coins} coins\n💎 ${rewards.gems} gems\n⚡ ${rewards.energy} energy\n📦 ${rewards.items.length} items`);
      }
      return;
    }
    
    // Select item for info
    setSelectedItemId(selectedItemId === itemId ? null : itemId);
  };

  const handleDragStart = (e: React.TouchEvent | React.MouseEvent, itemId: string) => {
    e.preventDefault();
    
    const item = items.find(i => i.id === itemId);
    if (!item || item.isBlocked) return;
    
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
    setSelectedItemId(null);
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
        // Try to merge
        const result = tryMerge(dragState.itemId, targetItem.id);
        
        if (result.success) {
          // Show merge effect
          const cellPos = getCellPosition(gridPos.x, gridPos.y);
          setMergeEffect(cellPos);
          setTimeout(() => setMergeEffect(null), 500);
          
          playSuccess();
          console.log(`Merge success! +${result.xpGained} XP, +${result.coinsGained} coins`);
        } else {
          playHit();
          moveItem(dragState.itemId, dragState.startX, dragState.startY);
        }
      } else if (!isPositionOccupied(gridPos.x, gridPos.y, dragState.itemId)) {
        moveItem(dragState.itemId, gridPos.x, gridPos.y);
      } else {
        moveItem(dragState.itemId, dragState.startX, dragState.startY);
      }
    } else {
      // Check if dragging to inventory
      const rect = boardRef.current?.getBoundingClientRect();
      if (rect && clientY > rect.bottom + 10) {
        if (!isInventoryFull()) {
          moveToInventory(dragState.itemId);
          playSuccess();
        } else {
          alert('Inventory is full!');
          moveItem(dragState.itemId, dragState.startX, dragState.startY);
        }
      } else {
        moveItem(dragState.itemId, dragState.startX, dragState.startY);
      }
    }
    
    setDragState(null);
    setDragPosition(null);
  };

  const handleInventoryItemClick = (itemId: string) => {
    // Find empty spot on board
    for (let y = 0; y < gridSize.rows; y++) {
      for (let x = 0; x < gridSize.cols; x++) {
        if (!isPositionOccupied(x, y)) {
          moveFromInventory(itemId, x, y);
          playSuccess();
          return;
        }
      }
    }
    alert('Board is full! Clear some space first.');
  };

  const handleSellItem = (itemId: string) => {
    const coinsGained = sellItem(itemId);
    if (coinsGained > 0) {
      playSuccess();
      console.log(`Sold item for ${coinsGained} coins`);
    }
  };

  const handleUndoSell = () => {
    if (undoSell()) {
      playSuccess();
      console.log('Sell undone');
    }
  };

  const selectedItem = selectedItemId ? items.find(i => i.id === selectedItemId) : null;
  const selectedItemData = selectedItem ? MERGE_ITEMS[selectedItem.itemType] : null;

  return (
    <div className="relative flex flex-col items-center justify-center p-4 gap-4">
      {/* Board */}
      <div
        ref={boardRef}
        className="relative bg-gradient-to-br from-amber-100 to-orange-100 rounded-2xl shadow-2xl border-4 border-amber-600"
        style={{
          width: gridSize.cols * (CELL_SIZE + GAP) + GAP,
          height: gridSize.rows * (CELL_SIZE + GAP) + GAP
        }}
        onMouseMove={handleDragMove}
        onMouseUp={handleDragEnd}
        onTouchMove={handleDragMove}
        onTouchEnd={handleDragEnd}
      >
        {/* Grid lines */}
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: gridSize.rows }).map((_, y) =>
            Array.from({ length: gridSize.cols }).map((_, x) => (
              <div
                key={`${x}-${y}`}
                className="absolute bg-white/30 rounded-lg border border-amber-300/50"
                style={{
                  left: x * (CELL_SIZE + GAP) + GAP,
                  top: y * (CELL_SIZE + GAP) + GAP,
                  width: CELL_SIZE,
                  height: CELL_SIZE
                }}
              />
            ))
          )}
        </div>

        {/* Items */}
        {items.filter(item => item.id !== dragState?.itemId).map((item) => {
          const itemData = MERGE_ITEMS[item.itemType];
          const cellPos = getCellPosition(item.x, item.y);
          const isSelected = selectedItemId === item.id;
          const isGenerator = itemData?.isGenerator;
          const isChest = itemData?.isChest;
          const isBlocked = item.isBlocked;
          
          return (
            <div
              key={item.id}
              className={`absolute cursor-pointer transition-all ${
                isSelected ? 'ring-4 ring-blue-500 scale-110' : ''
              } ${isBlocked ? 'opacity-70' : ''}`}
              style={{
                left: cellPos.x,
                top: cellPos.y,
                width: CELL_SIZE,
                height: CELL_SIZE,
                zIndex: isSelected ? 100 : dragState ? 1 : 10
              }}
              onMouseDown={(e) => !isBlocked && handleDragStart(e, item.id)}
              onTouchStart={(e) => !isBlocked && handleDragStart(e, item.id)}
              onClick={(e) => handleItemClick(item.id, e)}
            >
              <div className="relative w-full h-full">
                <SpriteItem 
                  itemType={item.itemType}
                  size={CELL_SIZE}
                />
                
                {/* Generator charges indicator */}
                {isGenerator && item.charges !== undefined && (
                  <div className="absolute top-0 right-0 bg-blue-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-lg">
                    {item.charges}
                  </div>
                )}
                
                {/* Blocked indicator */}
                {isBlocked && (
                  <div className="absolute inset-0 bg-black/40 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">🔒</span>
                  </div>
                )}
                
                {/* Chest glow */}
                {isChest && (
                  <div className="absolute inset-0 bg-yellow-400/20 rounded-lg animate-pulse" />
                )}
              </div>
            </div>
          );
        })}

        {/* Dragging item */}
        {dragState && dragPosition && (
          <div
            className="absolute pointer-events-none scale-110 opacity-90"
            style={{
              left: dragPosition.x,
              top: dragPosition.y,
              width: CELL_SIZE,
              height: CELL_SIZE,
              zIndex: 1000
            }}
          >
            <SpriteItem 
              itemType={items.find(i => i.id === dragState.itemId)?.itemType || 'tool_1'}
              size={CELL_SIZE}
            />
          </div>
        )}

        {/* Merge effect */}
        {mergeEffect && (
          <div
            className="absolute pointer-events-none animate-ping"
            style={{
              left: mergeEffect.x,
              top: mergeEffect.y,
              width: CELL_SIZE,
              height: CELL_SIZE,
              zIndex: 500
            }}
          >
            <Sparkles className="w-full h-full text-yellow-400" fill="currentColor" />
          </div>
        )}
      </div>

      {/* Inventory */}
      <div className="w-full max-w-3xl">
        <button
          onClick={() => setShowInventory(!showInventory)}
          className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-2 rounded-t-xl font-bold shadow-lg flex items-center justify-between"
        >
          <span>📦 Inventory ({inventory.length}/10)</span>
          <span>{showInventory ? '▼' : '▲'}</span>
        </button>
        
        {showInventory && (
          <div className="bg-gradient-to-br from-indigo-100 to-purple-100 rounded-b-xl border-4 border-indigo-600 p-4">
            <div className="flex flex-wrap gap-2">
              {inventory.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleInventoryItemClick(item.id)}
                  className="relative cursor-pointer hover:scale-110 transition-transform"
                >
                  <SpriteItem itemType={item.itemType} size={60} />
                  {MERGE_ITEMS[item.itemType]?.isGenerator && item.charges !== undefined && (
                    <div className="absolute top-0 right-0 bg-blue-600 text-white text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center">
                      {item.charges}
                    </div>
                  )}
                </div>
              ))}
              {inventory.length === 0 && (
                <div className="w-full text-center text-gray-500 py-4">
                  Drag items here to store them
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Item Info Panel */}
      {selectedItemData && (
        <div className="fixed bottom-4 right-4 bg-white rounded-2xl shadow-2xl border-4 border-blue-500 p-4 max-w-sm z-50">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="font-bold text-lg">{selectedItemData.name}</h3>
              <p className="text-sm text-gray-600">Level {selectedItemData.level}</p>
            </div>
            <button onClick={() => setSelectedItemId(null)} className="text-gray-400 hover:text-gray-600">
              ✕
            </button>
          </div>
          
          <p className="text-sm text-gray-700 mb-2">{selectedItemData.description}</p>
          
          <div className="flex gap-2 text-xs mb-2">
            <span className="px-2 py-1 bg-yellow-100 rounded font-bold">💰 {selectedItemData.coinValue}</span>
            <span className="px-2 py-1 bg-blue-100 rounded font-bold">⚡ {selectedItemData.xpValue} XP</span>
          </div>
          
          {selectedItemData.isGenerator && selectedItem && (
            <div className="text-xs text-blue-700 mb-2">
              🔋 Charges: {selectedItem.charges || 0}/{selectedItemData.maxCharges}
              <br />
              ⚡ Cost: {selectedItemData.energyCost} energy
            </div>
          )}
          
          {selectedItemData.mergesInto && (
            <div className="text-xs text-green-700">
              ⬆️ Merges into: {MERGE_ITEMS[selectedItemData.mergesInto]?.name}
            </div>
          )}
          
          <div className="flex gap-2 mt-3">
            <button
              onClick={() => selectedItem && handleSellItem(selectedItem.id)}
              className="flex-1 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm font-bold flex items-center justify-center gap-1"
            >
              <Trash2 className="w-3 h-3" />
              Sell
            </button>
          </div>
        </div>
      )}

      {/* Undo Sell Button */}
      {lastSold && (
        <button
          onClick={handleUndoSell}
          className="fixed bottom-4 left-4 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-xl font-bold shadow-lg flex items-center gap-2 z-50"
        >
          <Undo2 className="w-4 h-4" />
          Undo Sell
        </button>
      )}
    </div>
  );
}
