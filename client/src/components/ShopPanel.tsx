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
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden border-4 border-green-600">
        <div className="bg-gradient-to-r from-green-600 to-emerald-500 px-6 py-4 flex items-center justify-between border-b-4 border-green-700">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg">
              <ShoppingCart className="w-7 h-7 text-green-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white drop-shadow-lg">Garden Shop</h2>
              <p className="text-green-100 text-sm">Buy seeds and items for your garden</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
          >
            <X className="w-6 h-6 text-white" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-100px)]">
          <div className="flex gap-2 mb-6 flex-wrap">
            {categories.map((cat) => (
              <Button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                variant={selectedCategory === cat ? 'default' : 'outline'}
                className={`rounded-xl px-6 py-3 font-bold ${
                  selectedCategory === cat
                    ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </Button>
            ))}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {shopItems.map((item: MergeItem) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl p-4 shadow-lg border-2 border-green-200 hover:border-green-400 transition-all hover:shadow-xl"
              >
                <div className="w-full aspect-square bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl mb-3 flex items-center justify-center text-5xl">
                  {getCategoryEmoji(item.category)}
                </div>
                
                <h3 className="font-bold text-gray-800 text-center mb-1">{item.name}</h3>
                <p className="text-xs text-gray-600 text-center mb-2">Level {item.level}</p>
                <p className="text-xs text-gray-500 text-center mb-3">{item.description}</p>
                
                <Button
                  onClick={() => handleBuy(item.id, item.coinValue)}
                  className="w-full bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white font-bold rounded-xl py-2"
                >
                  💰 {item.coinValue}
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function getCategoryEmoji(category: string): string {
  const emojis: Record<string, string> = {
    flower: '🌸',
    vegetable: '🥕',
    tree: '🌳',
    tool: '🔨',
    decoration: '✨',
    water: '💧',
    animal: '🐰',
    generator: '⚙️',
    chest: '🎁',
    currency: '💰',
    special: '⭐',
    blocked: '🚫'
  };
  return emojis[category] || '📦';
}
