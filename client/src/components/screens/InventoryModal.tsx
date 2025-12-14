import { motion, AnimatePresence } from 'framer-motion';
import { StorageBoxIcon, SunflowerIcon, SproutIcon, CherryBlossomIcon, TulipIcon, CloseFlowerIcon, GardenFlowerIcon } from '../icons/GardenIcons';
import { useMergeGameStore } from '@/lib/stores/useMergeGameStore';
import { MERGE_ITEMS } from '@/lib/mergeData';

interface InventoryModalProps {
  onClose: () => void;
}

export default function InventoryModal({ onClose }: InventoryModalProps) {
  const { inventory, maxInventorySize, moveFromInventory, findEmptySpot } = useMergeGameStore();

  const handleItemClick = (itemId: string) => {
    const spot = findEmptySpot();
    if (!spot) {
      console.log('No empty slots on board');
      return;
    }

    moveFromInventory(itemId, spot.x, spot.y);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ scale: 0.9, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 50 }}
        className="bg-gradient-to-b from-amber-50 via-orange-50 to-amber-100 rounded-2xl sm:rounded-3xl shadow-2xl w-full max-w-md overflow-hidden border-4 border-amber-600 relative"
      >
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-pink-400 via-yellow-300 to-pink-400" />
        
        <div className="bg-gradient-to-r from-amber-600 via-orange-500 to-amber-600 p-4 flex items-center justify-between relative overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-1 left-4"><CherryBlossomIcon size={20} /></div>
            <div className="absolute top-2 right-12"><TulipIcon size={18} /></div>
            <div className="absolute bottom-1 right-4"><SunflowerIcon size={16} /></div>
          </div>
          <div className="flex items-center gap-3 relative z-10">
            <div className="w-11 h-11 bg-gradient-to-br from-orange-100 to-amber-200 rounded-xl flex items-center justify-center border-2 border-orange-400 shadow-lg">
              <StorageBoxIcon size={26} />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-white drop-shadow-lg">Garden Storage</h2>
              <p className="text-orange-100 text-xs">{inventory.length}/{maxInventorySize} items stored</p>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center relative z-10"
          >
            <CloseFlowerIcon size={36} />
          </motion.button>
        </div>

        <div className="p-4">
          <div className="grid grid-cols-5 gap-3">
            <AnimatePresence>
              {Array.from({ length: maxInventorySize }).map((_, index) => {
                const item = inventory[index];
                const itemData = item ? MERGE_ITEMS[item.itemType] : null;
                
                return (
                  <motion.button
                    key={index}
                    layout
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    whileHover={item ? { scale: 1.08 } : undefined}
                    whileTap={item ? { scale: 0.95 } : undefined}
                    onClick={() => item && handleItemClick(item.id)}
                    className={`aspect-square rounded-xl border-2 transition-all flex flex-col items-center justify-center ${
                      item
                        ? 'bg-gradient-to-br from-amber-100 via-orange-50 to-amber-100 border-amber-400 hover:border-amber-500 cursor-pointer shadow-md hover:shadow-lg'
                        : 'bg-amber-100/50 border-amber-300 border-dashed'
                    }`}
                  >
                    {item ? (
                      <div className="w-full h-full p-1 flex flex-col items-center justify-center">
                        <div className="w-8 h-8 bg-gradient-to-br from-green-100 to-emerald-100 rounded-lg flex items-center justify-center mb-0.5">
                          <GardenFlowerIcon size={20} />
                        </div>
                        <span className="text-[8px] font-medium text-amber-800 truncate w-full text-center px-0.5">
                          {itemData?.name || 'Item'}
                        </span>
                      </div>
                    ) : (
                      <div className="text-amber-400">
                        <SproutIcon size={20} />
                      </div>
                    )}
                  </motion.button>
                );
              })}
            </AnimatePresence>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-4 p-3 bg-gradient-to-r from-amber-100 via-orange-100 to-amber-100 rounded-xl border-2 border-amber-300"
          >
            <p className="text-sm text-amber-700 text-center flex items-center justify-center gap-2">
              <SunflowerIcon size={18} />
              <span>Tap an item to move it to your garden!</span>
              <SunflowerIcon size={18} />
            </p>
          </motion.div>

          {inventory.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-4 text-center"
            >
              <div className="w-16 h-16 mx-auto mb-2 bg-gradient-to-br from-amber-100 to-orange-100 rounded-full flex items-center justify-center border-2 border-amber-300">
                <StorageBoxIcon size={32} />
              </div>
              <p className="text-amber-600 font-medium">Your storage is empty</p>
              <p className="text-amber-500 text-sm">Long-press items on the board to store them</p>
            </motion.div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
