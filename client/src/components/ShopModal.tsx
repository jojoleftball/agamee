import { useMergeGameStore } from '@/lib/stores/useMergeGameStore';
import { Button } from './ui/button';
import { X, Plus } from 'lucide-react';
import { MERGE_ITEMS, ITEM_CATEGORIES } from '@/lib/mergeData';

interface ShopModalProps {
  onClose: () => void;
}

export default function ShopModal({ onClose }: ShopModalProps) {
  const { coins, gems, spendCoins, spendGems, findEmptySpot, addItem } = useMergeGameStore();

  const shopItems = [
    { id: 'gen_flower_1', cost: 100, currency: 'coins' as const },
    { id: 'gen_tool_1', cost: 120, currency: 'coins' as const },
    { id: 'flower_1', cost: 20, currency: 'coins' as const },
    { id: 'veg_1', cost: 25, currency: 'coins' as const },
    { id: 'tree_1', cost: 40, currency: 'coins' as const },
    { id: 'tool_1', cost: 15, currency: 'coins' as const },
    { id: 'deco_1', cost: 30, currency: 'coins' as const },
    { id: 'gen_flower_2', cost: 5, currency: 'gems' as const },
    { id: 'gen_tool_2', cost: 6, currency: 'gems' as const }
  ];

  const handlePurchase = (itemId: string, cost: number, currency: 'coins' | 'gems') => {
    const emptySpot = findEmptySpot();
    if (!emptySpot) {
      alert('Board is full! Merge some items first.');
      return;
    }

    const canAfford = currency === 'coins' ? spendCoins(cost) : spendGems(cost);
    if (canAfford) {
      addItem(itemId, emptySpot.x, emptySpot.y);
    } else {
      alert(`Not enough ${currency}!`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full max-h-[80vh] overflow-hidden flex flex-col">
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">Garden Shop</h2>
          <Button
            onClick={onClose}
            size="icon"
            className="bg-white/20 hover:bg-white/30 text-white rounded-full"
          >
            <X className="w-6 h-6" />
          </Button>
        </div>

        <div className="p-4 bg-gray-50 border-b">
          <div className="flex gap-4">
            <div className="flex items-center gap-2 bg-yellow-100 px-4 py-2 rounded-xl">
              <div className="w-6 h-6 rounded-full bg-yellow-500 text-white flex items-center justify-center text-xs font-bold">
                C
              </div>
              <span className="font-bold text-gray-800">{coins.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-2 bg-purple-100 px-4 py-2 rounded-xl">
              <div className="w-6 h-6 rounded-full bg-purple-500 text-white flex items-center justify-center text-xs font-bold">
                G
              </div>
              <span className="font-bold text-gray-800">{gems}</span>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-3">
          {shopItems.map((shopItem) => {
            const itemData = MERGE_ITEMS[shopItem.id];
            if (!itemData) return null;

            const canAfford = shopItem.currency === 'coins' 
              ? coins >= shopItem.cost 
              : gems >= shopItem.cost;

            return (
              <div
                key={shopItem.id}
                className={`p-4 rounded-xl border-2 ${
                  canAfford ? 'bg-white border-green-300' : 'bg-gray-100 border-gray-300'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl flex items-center justify-center border-2 border-green-300 flex-shrink-0">
                    <div className="w-10 h-10 rounded-lg bg-green-500 flex items-center justify-center">
                      <span className="text-white font-bold text-xl">{itemData.name.charAt(0)}</span>
                    </div>
                  </div>

                  <div className="flex-1">
                    <h3 className="font-bold text-gray-800">{itemData.name}</h3>
                    <p className="text-sm text-gray-600">{itemData.description}</p>
                    <div className="mt-1 text-xs text-gray-500">Level {itemData.level}</div>
                  </div>

                  <Button
                    onClick={() => handlePurchase(shopItem.id, shopItem.cost, shopItem.currency)}
                    disabled={!canAfford}
                    className={`flex-shrink-0 ${
                      shopItem.currency === 'coins'
                        ? 'bg-yellow-500 hover:bg-yellow-600'
                        : 'bg-purple-500 hover:bg-purple-600'
                    } text-white font-bold py-2 px-4 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    <div className="flex items-center gap-1">
                      <Plus className="w-4 h-4" />
                      <span>{shopItem.cost}</span>
                    </div>
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
