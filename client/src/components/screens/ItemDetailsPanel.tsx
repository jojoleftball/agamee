import { X } from 'lucide-react';
import { SellCoinIcon } from '../icons/GardenIcons';
import { useGameStore } from '../../store/gameStore';
import ItemSprite from '../ItemSprite';
import type { BoardItem } from '../../types/game';

interface ItemDetailsPanelProps {
  item: BoardItem;
  onClose: () => void;
}

const ITEM_INFO: Record<string, { name: string; description: string; sellPrice: number }> = {
  rose: {
    name: 'Rose',
    description: 'A beautiful rose flower that brings elegance to any garden.',
    sellPrice: 10,
  },
  tulip: {
    name: 'Tulip',
    description: 'Colorful tulip that blooms in spring with vibrant petals.',
    sellPrice: 12,
  },
  sunflower: {
    name: 'Sunflower',
    description: 'A tall, cheerful flower that follows the sun.',
    sellPrice: 15,
  },
  daisy: {
    name: 'Daisy',
    description: 'Simple yet charming white petals with a golden center.',
    sellPrice: 8,
  },
  water_bucket: {
    name: 'Water Bucket',
    description: 'Essential tool for keeping your plants hydrated and healthy.',
    sellPrice: 5,
  },
  seed_bag: {
    name: 'Seed Bag',
    description: 'Contains nutritious plant food for faster growth.',
    sellPrice: 5,
  },
  gen_rose: {
    name: 'Rose Generator',
    description: 'A magical pot that produces rose seeds over time.',
    sellPrice: 25,
  },
};

const RANK_NAMES = ['', 'Seedling', 'Sprout', 'Budding', 'Blooming', 'Radiant'];

export default function ItemDetailsPanel({ item, onClose }: ItemDetailsPanelProps) {
  const removeBoardItem = useGameStore((state) => state.removeBoardItem);
  const addCoins = useGameStore((state) => state.addCoins);

  const info = ITEM_INFO[item.itemType] || {
    name: item.itemType,
    description: 'A mysterious item from the garden.',
    sellPrice: 5,
  };

  const sellPrice = info.sellPrice * item.rank;
  const rankName = RANK_NAMES[item.rank] || `Rank ${item.rank}`;

  const handleSell = () => {
    addCoins(sellPrice);
    removeBoardItem(item.id);
    onClose();
  };

  return (
    <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-sm">
      <div className="bg-gradient-to-b from-emerald-50 to-green-50 rounded-2xl shadow-2xl border-4 border-emerald-600 overflow-hidden">
        <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 p-3 flex items-center justify-between">
          <h3 className="text-lg font-bold text-white drop-shadow">Item Details</h3>
          <button
            onClick={onClose}
            className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        <div className="p-4">
          <div className="flex items-start gap-4">
            <div className="w-20 h-20 bg-gradient-to-br from-green-100 to-green-200 rounded-xl flex items-center justify-center border-2 border-green-300 flex-shrink-0">
              <ItemSprite item={item} size={60} />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-bold text-gray-800 text-lg">{info.name}</h4>
              <div className="flex items-center gap-2 mt-1">
                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full">
                  {rankName}
                </span>
                <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-xs font-bold rounded-full">
                  Rank {item.rank}{item.maxRank ? `/${item.maxRank}` : ''}
                </span>
              </div>
              <p className="text-sm text-gray-600 mt-2 line-clamp-2">{info.description}</p>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t-2 border-emerald-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Sell Price:</span>
              <div className="flex items-center gap-1 bg-yellow-100 px-3 py-1 rounded-full">
                <SellCoinIcon size={18} />
                <span className="font-bold text-yellow-700">{sellPrice}</span>
              </div>
            </div>
            <button
              onClick={handleSell}
              className="px-6 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-bold hover:from-red-600 hover:to-red-700 active:scale-95 transition-all shadow-lg"
            >
              Sell
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}