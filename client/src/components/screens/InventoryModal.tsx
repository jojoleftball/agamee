import { X } from 'lucide-react';
import { StorageBoxIcon, SunflowerIcon, SproutIcon, CherryBlossomIcon, TulipIcon } from '../icons/GardenIcons';
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
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4">
      <div className="bg-gradient-to-b from-green-50 via-emerald-50 to-green-100 rounded-2xl sm:rounded-3xl shadow-2xl w-full max-w-md overflow-hidden border-4 border-green-600 relative">
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-pink-400 via-yellow-300 to-pink-400" />
        
        <div className="bg-gradient-to-r from-green-600 via-emerald-500 to-green-600 p-3 sm:p-4 flex items-center justify-between relative overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-1 left-4"><CherryBlossomIcon size={20} /></div>
            <div className="absolute top-2 right-12"><TulipIcon size={20} /></div>
          </div>
          <div className="flex items-center gap-3 relative z-10">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-orange-100 to-amber-200 rounded-xl flex items-center justify-center border-2 border-orange-400 shadow-lg">
              <StorageBoxIcon size={28} />
            </div>
            <div>
              <h2 className="text-lg sm:text-2xl font-bold text-white drop-shadow-lg">Garden Storage</h2>
              <p className="text-green-100 text-xs sm:text-sm">{storageItems.length}/{maxStorage} items stored</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 sm:w-10 sm:h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-all hover:rotate-90 duration-300 relative z-10"
          >
            <X className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
          </button>
        </div>

        <div className="p-3 sm:p-4">
          <div className="grid grid-cols-5 gap-2 sm:gap-3">
            {Array.from({ length: INVENTORY_SLOTS }).map((_, index) => {
              const item = storageItems[index];
              return (
                <button
                  key={index}
                  onClick={() => item && handleItemClick(item)}
                  className={`aspect-square rounded-xl sm:rounded-2xl border-2 transition-all flex items-center justify-center ${
                    item
                      ? 'bg-gradient-to-br from-green-100 via-emerald-50 to-green-100 border-green-400 hover:scale-105 hover:border-green-500 cursor-pointer shadow-md'
                      : 'bg-green-100/50 border-green-300 border-dashed'
                  }`}
                >
                  {item ? (
                    <div className="w-full h-full p-0.5 sm:p-1">
                      <ItemSprite item={item} size={48} />
                    </div>
                  ) : (
                    <div className="text-green-400"><SproutIcon size={24} /></div>
                  )}
                </button>
              );
            })}
          </div>

          <div className="mt-3 sm:mt-4 p-2 sm:p-3 bg-gradient-to-r from-green-100 via-emerald-100 to-green-100 rounded-xl border border-green-300">
            <p className="text-xs sm:text-sm text-green-700 text-center flex items-center justify-center gap-2">
              <SunflowerIcon size={18} />
              <span>Tap an item to move it back to your garden!</span>
              <SunflowerIcon size={18} />
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}