import { useState } from 'react';
import { X } from 'lucide-react';
import { ShopStoreIcon, SellCoinIcon, PlantSeedlingIcon, GardenToolIcon, CherryBlossomIcon, TulipIcon, SunflowerIcon, RoseIcon, SproutIcon } from '../icons/GardenIcons';
import { useGameStore } from '../../store/gameStore';

interface ShopItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  itemType: string;
  rank: number;
  maxRank: number;
}

const SHOP_ITEMS: ShopItem[] = [
  {
    id: 'shop-rose-seeds',
    name: 'Rose Seeds',
    description: 'Plant these to grow beautiful roses',
    price: 50,
    category: 'plant',
    itemType: 'rose',
    rank: 1,
    maxRank: 5,
  },
  {
    id: 'shop-tulip-seeds',
    name: 'Tulip Seeds',
    description: 'Colorful tulip seeds for your garden',
    price: 75,
    category: 'plant',
    itemType: 'tulip',
    rank: 1,
    maxRank: 5,
  },
  {
    id: 'shop-water-bucket',
    name: 'Water Bucket',
    description: 'Keep your plants hydrated',
    price: 30,
    category: 'tool',
    itemType: 'water_bucket',
    rank: 1,
    maxRank: 3,
  },
  {
    id: 'shop-seed-bag',
    name: 'Seed Bag',
    description: 'Feed your plants to help them grow',
    price: 40,
    category: 'tool',
    itemType: 'seed_bag',
    rank: 1,
    maxRank: 3,
  },
];

interface ShopModalProps {
  onClose: () => void;
}

export default function ShopModal({ onClose }: ShopModalProps) {
  const resources = useGameStore((state) => state.resources);
  const addBoardItem = useGameStore((state) => state.addBoardItem);
  const addCoins = useGameStore((state) => state.addCoins);
  const boardItems = useGameStore((state) => state.boardItems);
  const [selectedItem, setSelectedItem] = useState<ShopItem | null>(null);

  const GRID_COLS = 6;
  const GRID_ROWS = 5;

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

  const handleBuyItem = (shopItem: ShopItem) => {
    if (resources.coins < shopItem.price) {
      return;
    }

    const emptySlot = findEmptySlot();
    if (!emptySlot) {
      return;
    }

    addCoins(-shopItem.price);
    addBoardItem({
      id: `bought-${Date.now()}-${Math.random()}`,
      category: shopItem.category as any,
      itemType: shopItem.itemType,
      rank: shopItem.rank,
      maxRank: shopItem.maxRank,
      x: emptySlot.x,
      y: emptySlot.y,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4">
      <div className="bg-gradient-to-b from-green-50 via-emerald-50 to-green-100 rounded-2xl sm:rounded-3xl shadow-2xl w-full max-w-2xl max-h-[95vh] sm:max-h-[90vh] overflow-hidden border-4 border-green-600 relative">
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-pink-400 via-yellow-400 to-pink-400" />
        <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-green-500 via-emerald-400 to-green-500" />
        
        <div className="bg-gradient-to-r from-green-600 via-emerald-500 to-green-600 p-4 sm:p-6 flex items-center justify-between relative overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-2 left-4"><CherryBlossomIcon size={28} /></div>
            <div className="absolute top-1 right-12"><TulipIcon size={24} /></div>
            <div className="absolute bottom-1 left-16"><SunflowerIcon size={20} /></div>
            <div className="absolute bottom-2 right-4"><RoseIcon size={28} /></div>
          </div>
          <div className="flex items-center gap-3 relative z-10">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-amber-100 to-amber-200 rounded-full flex items-center justify-center border-4 border-amber-400 shadow-lg">
              <ShopStoreIcon size={36} />
            </div>
            <div>
              <h2 className="text-xl sm:text-3xl font-bold text-white drop-shadow-lg">Garden Shop</h2>
              <p className="text-green-100 text-xs sm:text-sm">Seeds, tools & garden supplies</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-all hover:rotate-90 duration-300 relative z-10"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </button>
        </div>

        <div className="p-3 sm:p-4 overflow-y-auto max-h-[calc(95vh-180px)] sm:max-h-[calc(90vh-200px)]">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
            {SHOP_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => setSelectedItem(item)}
                className={`p-3 sm:p-5 rounded-2xl border-3 transition-all duration-200 relative overflow-hidden group ${
                  selectedItem?.id === item.id
                    ? 'bg-gradient-to-br from-green-100 to-emerald-100 border-green-500 scale-[1.02] shadow-lg'
                    : 'bg-white border-green-200 hover:border-green-400 hover:shadow-md'
                }`}
              >
                <div className="absolute top-1 right-1 opacity-60"><SproutIcon size={14} /></div>
                <div className="w-14 h-14 sm:w-20 sm:h-20 mx-auto mb-2 sm:mb-3 bg-gradient-to-br from-green-100 via-emerald-50 to-green-100 rounded-xl sm:rounded-2xl flex items-center justify-center border-2 border-green-300 shadow-inner">
                  {item.category === 'plant' ? <PlantSeedlingIcon size={40} /> : <GardenToolIcon size={40} />}
                </div>
                <div className="text-sm sm:text-base font-bold text-green-800 truncate">{item.name}</div>
                <div className="text-xs text-green-600 mb-2 line-clamp-1 hidden sm:block">{item.description}</div>
                <div className="flex items-center justify-center gap-1.5 bg-gradient-to-r from-amber-100 to-yellow-100 py-1.5 sm:py-2 rounded-full border border-amber-300">
                  <SellCoinIcon size={20} />
                  <span className="text-sm sm:text-base font-bold text-amber-700">{item.price}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {selectedItem && (
          <div className="p-3 sm:p-5 bg-gradient-to-r from-green-100 via-emerald-50 to-green-100 border-t-4 border-green-300">
            <div className="flex items-start gap-3 sm:gap-4">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl flex items-center justify-center border-3 border-green-400 shadow-lg flex-shrink-0">
                {selectedItem.category === 'plant' ? <PlantSeedlingIcon size={48} /> : <GardenToolIcon size={48} />}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-green-800 text-base sm:text-lg flex items-center gap-2">
                  {selectedItem.name} <CherryBlossomIcon size={18} />
                </h3>
                <p className="text-xs sm:text-sm text-green-600">{selectedItem.description}</p>
              </div>
            </div>
            <button
              onClick={() => handleBuyItem(selectedItem)}
              disabled={resources.coins < selectedItem.price}
              className={`w-full mt-3 sm:mt-4 py-3 sm:py-4 rounded-2xl font-bold flex items-center justify-center gap-2 text-base sm:text-lg transition-all duration-200 ${
                resources.coins >= selectedItem.price
                  ? 'bg-gradient-to-r from-green-500 via-emerald-500 to-green-500 text-white hover:from-green-600 hover:via-emerald-600 hover:to-green-600 active:scale-[0.98] shadow-lg hover:shadow-xl'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              <CherryBlossomIcon size={20} />
              <span>Buy for</span>
              <SellCoinIcon size={22} />
              <span>{selectedItem.price}</span>
              <CherryBlossomIcon size={20} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}