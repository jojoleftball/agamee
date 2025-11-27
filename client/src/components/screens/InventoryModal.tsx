import { X } from 'lucide-react';
import { InventoryChestIcon } from '../icons/GardenIcons';
import { useGameStore } from '../../store/gameStore';
import ItemSprite from '../ItemSprite';
import type { BoardItem } from '../../types/game';

interface InventoryModalProps {
  onClose: () => void;
  onSelectItem?: (item: BoardItem) => void;
}

export default function InventoryModal({ onClose, onSelectItem }: InventoryModalProps) {
  const storageItems = useGameStore((state) => state.storageItems);
  const removeFromStorage = useGameStore((state) => state.removeFromStorage);
  const addBoardItem = useGameStore((state) => state.addBoardItem);
  const boardItems = useGameStore((state) => state.boardItems);
  const maxStorage = useGameStore((state) => state.maxStorage);

  const GRID_COLS = 6;
  const GRID_ROWS = 5;
  const INVENTORY_SLOTS = 10;

  const findEmptySlot = () => {
    for (let y = 0; y < GRID_ROWS; y++) {
      for (let x = 0; x < GRID_COLS; x++) {
        const occupied = boardItems.some(item => item.x === x && item.y === y);
        if (!occupied) {
          return { x, y };
        }
      }
    }
    return null;
  };

  const handleItemClick = (item: BoardItem) => {
    const emptySlot = findEmptySlot();
    if (!emptySlot) {
      console.log('No empty slots on board');
      return;
    }

    removeFromStorage(item.id);
    addBoardItem({
      ...item,
      id: `restored-${Date.now()}-${Math.random()}`,
      x: emptySlot.x,
      y: emptySlot.y,
    });

    if (onSelectItem) {
      onSelectItem(item);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-b from-amber-100 to-orange-100 rounded-3xl shadow-2xl w-full max-w-md overflow-hidden border-4 border-amber-700">
        <div className="bg-gradient-to-r from-amber-600 to-amber-700 p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <InventoryChestIcon size={32} />
            <div>
              <h2 className="text-2xl font-bold text-white drop-shadow">Inventory</h2>
              <p className="text-amber-200 text-sm">{storageItems.length}/{maxStorage} items</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
          >
            <X className="w-6 h-6 text-white" />
          </button>
        </div>

        <div className="p-4">
          <div className="grid grid-cols-5 gap-2">
            {Array.from({ length: INVENTORY_SLOTS }).map((_, index) => {
              const item = storageItems[index];
              return (
                <button
                  key={index}
                  onClick={() => item && handleItemClick(item)}
                  className={`aspect-square rounded-xl border-2 transition-all flex items-center justify-center ${
                    item
                      ? 'bg-gradient-to-br from-green-100 to-green-200 border-green-400 hover:scale-105 hover:border-green-500 cursor-pointer'
                      : 'bg-amber-200/50 border-amber-300 border-dashed'
                  }`}
                >
                  {item ? (
                    <div className="w-full h-full p-1">
                      <ItemSprite item={item} size={48} />
                    </div>
                  ) : (
                    <div className="text-amber-400 text-2xl">+</div>
                  )}
                </button>
              );
            })}
          </div>

          <div className="mt-4 p-3 bg-amber-200/50 rounded-xl">
            <p className="text-sm text-amber-800 text-center">
              Tap an item to move it back to the merge board
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}