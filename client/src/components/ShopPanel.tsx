import { useState } from 'react';
import { useGardenGame } from '@/lib/stores/useGardenGame';
import { useMergeStore } from '@/lib/stores/useMergeStore';
import { MERGE_ITEMS, MergeItem } from '@/lib/mergeItems';
import { Button } from './ui/button';
import { X, ShoppingCart } from 'lucide-react';

interface ShopPanelProps {
  onClose: () => void;
}

export default function ShopPanel({ onClose }: ShopPanelProps) {
  const { coins, spendCoins, spendEnergy, energy } = useGardenGame();
  const { addItem, findEmptySpot } = useMergeStore();
  const [selectedCategory, setSelectedCategory] = useState<string>('flower');

  const categories = ['flower', 'vegetable', 'tree', 'tool', 'decoration'];
  
  const shopItems = Object.values(MERGE_ITEMS).filter(
    (item: MergeItem) => item.category === selectedCategory && item.level <= 3
  );

  const handleBuy = (itemType: string, cost: number) => {
    const energyCost = 5;
    
    if (energy < energyCost) {
      alert('Not enough energy!');
      return;
    }
    
    if (coins < cost) {
      alert(`Not enough coins! Need ${cost} coins.`);
      return;
    }
    
    const emptySpot = findEmptySpot();
    if (!emptySpot) {
      alert('No empty spots on the board!');
      return;
    }
    
    if (spendCoins(cost) && spendEnergy(energyCost)) {
      addItem(itemType, emptySpot.x, emptySpot.y, emptySpot.z);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4">
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl sm:rounded-3xl shadow-2xl w-full max-w-4xl max-h-[95vh] sm:max-h-[90vh] overflow-hidden border-2 sm:border-4 border-green-600">
        <div className="bg-gradient-to-r from-green-600 to-emerald-500 px-3 sm:px-6 py-3 sm:py-4 flex items-center justify-between border-b-2 sm:border-b-4 border-green-700">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-12 sm:h-12 bg-white rounded-full flex items-center justify-center shadow-lg">
              <ShoppingCart className="w-4 h-4 sm:w-7 sm:h-7 text-green-600" />
            </div>
            <div>
              <h2 className="text-lg sm:text-2xl font-bold text-white drop-shadow-lg">Garden Shop</h2>
              <p className="text-green-100 text-xs sm:text-sm hidden sm:block">Buy seeds and items for your garden</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 sm:w-10 sm:h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
          </button>
        </div>

        <div className="p-3 sm:p-6 overflow-y-auto max-h-[calc(95vh-80px)] sm:max-h-[calc(90vh-100px)]">
          <div className="flex gap-1.5 sm:gap-2 mb-4 sm:mb-6 flex-wrap">
            {categories.map((cat) => (
              <Button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                variant={selectedCategory === cat ? 'default' : 'outline'}
                size="sm"
                className={`rounded-lg sm:rounded-xl px-3 sm:px-6 py-1.5 sm:py-3 font-bold text-xs sm:text-sm ${
                  selectedCategory === cat
                    ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </Button>
            ))}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4">
            {shopItems.map((item: MergeItem) => (
              <div
                key={item.id}
                className="bg-white rounded-xl sm:rounded-2xl p-2 sm:p-4 shadow-lg border border-green-200 sm:border-2 hover:border-green-400 transition-all hover:shadow-xl"
              >
                <div className="w-full aspect-square bg-gradient-to-br from-green-100 to-emerald-100 rounded-lg sm:rounded-xl mb-2 sm:mb-3 flex items-center justify-center">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center text-white font-bold text-xl sm:text-2xl">{getCategoryIcon(item.category)}</div>
                </div>
                
                <h3 className="font-bold text-gray-800 text-center text-xs sm:text-base mb-0.5 sm:mb-1 truncate">{item.name}</h3>
                <p className="text-[10px] sm:text-xs text-gray-600 text-center mb-1 sm:mb-2">Level {item.level}</p>
                <p className="text-[10px] sm:text-xs text-gray-500 text-center mb-2 sm:mb-3 line-clamp-2 hidden sm:block">{item.description}</p>
                
                <Button
                  onClick={() => handleBuy(item.id, item.coinValue)}
                  size="sm"
                  className="w-full bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white font-bold rounded-lg sm:rounded-xl py-1 sm:py-2 text-xs sm:text-sm"
                >
                  {item.coinValue} Coins
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function getCategoryIcon(category: string): string {
  return category.charAt(0).toUpperCase();
}
