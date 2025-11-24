import { useState, useRef } from 'react';
import { useGameStore } from '../../store/gameStore';
import { ChevronLeft, Package, ShoppingBag, ListTodo } from 'lucide-react';
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

  const [draggedItem, setDraggedItem] = useState<BoardItem | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const boardRef = useRef<HTMLDivElement>(null);

  const handleBackToGarden = () => {
    setScreen('garden');
  };

  const handlePointerDown = (e: React.PointerEvent, item: BoardItem) => {
    e.preventDefault();
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
    setDraggedItem(item);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!draggedItem || !boardRef.current) return;
    e.preventDefault();
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!draggedItem || !boardRef.current) {
      setDraggedItem(null);
      return;
    }

    const rect = boardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - dragOffset.x;
    const y = e.clientY - rect.top - dragOffset.y;

    const gridX = Math.floor(x / (CELL_SIZE + GAP));
    const gridY = Math.floor(y / (CELL_SIZE + GAP));

    if (gridX >= 0 && gridX < GRID_COLS && gridY >= 0 && gridY < GRID_ROWS) {
      const targetItem = boardItems.find(
        (item) => item.x === gridX && item.y === gridY && item.id !== draggedItem.id
      );

      if (targetItem && 
          targetItem.itemType === draggedItem.itemType && 
          targetItem.rank === draggedItem.rank) {
        const matchingItems = boardItems.filter(
          (item) => 
            item.itemType === draggedItem.itemType && 
            item.rank === draggedItem.rank &&
            Math.abs(item.x - gridX) <= 1 &&
            Math.abs(item.y - gridY) <= 1
        );

        if (matchingItems.length >= 3) {
          matchingItems.slice(0, 3).forEach((item) => removeBoardItem(item.id));
          
          const newItem: BoardItem = {
            id: `merged-${Date.now()}`,
            category: draggedItem.category,
            itemType: draggedItem.itemType,
            rank: draggedItem.rank + 1,
            maxRank: draggedItem.maxRank,
            x: gridX,
            y: gridY,
          };

          addBoardItem(newItem);
          addCoins(10);
          addXP(5);
        } else {
          moveBoardItem(draggedItem.id, gridX, gridY);
        }
      } else if (!targetItem) {
        moveBoardItem(draggedItem.id, gridX, gridY);
      }
    }

    setDraggedItem(null);
  };

  const getItemSprite = (item: BoardItem) => {
    return `🌹`;
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

            <div className="flex items-center gap-4">
              <div className="bg-yellow-500 px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 border-2 border-yellow-600">
                <span className="text-2xl">💰</span>
                <span className="font-bold text-white">{resources.coins}</span>
              </div>
              <div className="bg-blue-500 px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 border-2 border-blue-600">
                <span className="text-2xl">⚡</span>
                <span className="font-bold text-white">{resources.energy}/{resources.maxEnergy}</span>
              </div>
              <div className="bg-purple-500 px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 border-2 border-purple-600">
                <span className="text-2xl">💎</span>
                <span className="font-bold text-white">{resources.gems}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center p-4 overflow-auto">
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-6 border-4 border-emerald-600 max-w-3xl">
            <h2 className="text-2xl font-bold text-center text-emerald-700 mb-4">
              Merge Board
            </h2>

            <div
              ref={boardRef}
              className="relative bg-emerald-50 rounded-xl p-4 border-2 border-emerald-300 select-none"
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

              {boardItems.map((item) => (
                <div
                  key={item.id}
                  className={`absolute bg-gradient-to-br from-green-400 to-green-600 rounded-lg shadow-lg border-3 border-white flex items-center justify-center cursor-grab active:cursor-grabbing transition-transform ${
                    draggedItem?.id === item.id ? 'scale-110 z-50' : 'hover:scale-105'
                  }`}
                  style={{
                    left: item.x * (CELL_SIZE + GAP) + GAP,
                    top: item.y * (CELL_SIZE + GAP) + GAP,
                    width: CELL_SIZE,
                    height: CELL_SIZE,
                  }}
                  onPointerDown={(e) => handlePointerDown(e, item)}
                >
                  <div className="text-center">
                    <div className="text-4xl mb-1">{getItemSprite(item)}</div>
                    <div className="text-xs font-bold text-white bg-black/30 rounded px-2 py-0.5">
                      R{item.rank}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 text-center text-sm text-gray-600">
              Drag 3 identical items together to merge them!
            </div>
          </div>
        </div>

        <div className="bg-white border-t-4 border-emerald-600 p-4 shadow-lg">
          <div className="flex items-center justify-around max-w-md mx-auto">
            <button className="flex flex-col items-center gap-1 px-4 py-2 hover:bg-emerald-50 rounded-lg transition-colors">
              <Package className="w-6 h-6 text-emerald-600" />
              <span className="text-xs font-medium text-gray-700">
                Storage ({storageItems.length}/10)
              </span>
            </button>

            <button className="flex flex-col items-center gap-1 px-4 py-2 hover:bg-emerald-50 rounded-lg transition-colors">
              <ShoppingBag className="w-6 h-6 text-emerald-600" />
              <span className="text-xs font-medium text-gray-700">Store</span>
            </button>

            <button className="flex flex-col items-center gap-1 px-4 py-2 hover:bg-emerald-50 rounded-lg transition-colors">
              <ListTodo className="w-6 h-6 text-emerald-600" />
              <span className="text-xs font-medium text-gray-700">Tasks</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
