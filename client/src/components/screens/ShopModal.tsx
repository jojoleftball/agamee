import { useState } from 'react';
import { X } from 'lucide-react';
import { ShopBagIcon, SellCoinIcon, PlantSeedlingIcon, GardenToolIcon } from '../icons/GardenIcons';
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
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-b from-amber-50 to-amber-100 rounded-3xl shadow-2xl w-full max-w-md max-h-[80vh] overflow-hidden border-4 border-amber-600">
        <div className="bg-gradient-to-r from-amber-500 to-amber-600 p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ShopBagIcon size={32} />
            <h2 className="text-2xl font-bold text-white drop-shadow">Garden Shop</h2>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
          >
            <X className="w-6 h-6 text-white" />
          </button>
        </div>

        <div className="p-4 flex items-center justify-between bg-amber-200/50">
          <span className="text-amber-800 font-medium">Your Coins:</span>
          <div className="flex items-center gap-2 bg-yellow-400 px-4 py-2 rounded-full border-2 border-yellow-500">
            <SellCoinIcon size={24} />
            <span className="font-bold text-yellow-900">{resources.coins}</span>
          </div>
        </div>

        <div className="p-4 overflow-y-auto max-h-[50vh]">
          <div className="grid grid-cols-2 gap-3">
            {SHOP_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => setSelectedItem(item)}
                className={`p-4 rounded-xl border-2 transition-all ${
                  selectedItem?.id === item.id
                    ? 'bg-amber-200 border-amber-500 scale-105'
                    : 'bg-white border-amber-300 hover:border-amber-400'
                }`}
              >
                <div className="w-12 h-12 mx-auto mb-2 bg-gradient-to-br from-green-100 to-green-200 rounded-lg flex items-center justify-center border-2 border-green-300">
                  {item.category === 'plant' ? (
                    <PlantSeedlingIcon size={28} />
                  ) : (
                    <GardenToolIcon size={28} />
                  )}
                </div>
                <div className="text-sm font-bold text-gray-800 truncate">{item.name}</div>
                <div className="flex items-center justify-center gap-1 mt-1">
                  <SellCoinIcon size={16} />
                  <span className="text-sm font-bold text-amber-700">{item.price}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {selectedItem && (
          <div className="p-4 bg-amber-200/50 border-t-2 border-amber-300">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-green-200 rounded-xl flex items-center justify-center border-2 border-green-300">
                {selectedItem.category === 'plant' ? (
                  <PlantSeedlingIcon size={36} />
                ) : (
                  <GardenToolIcon size={36} />
                )}
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-800">{selectedItem.name}</h3>
                <p className="text-sm text-gray-600">{selectedItem.description}</p>
              </div>
            </div>
            <button
              onClick={() => handleBuyItem(selectedItem)}
              disabled={resources.coins < selectedItem.price}
              className={`w-full mt-4 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
                resources.coins >= selectedItem.price
                  ? 'bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 active:scale-95'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              <span>Buy for</span>
              <SellCoinIcon size={20} />
              <span>{selectedItem.price}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}