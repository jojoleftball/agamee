import { X, Droplet, Sprout } from 'lucide-react';
import { useGameStore } from '../store/gameStore';
import type { GardenSlot } from '../types/game';

interface PlantCareModalProps {
  slot: GardenSlot;
  onClose: () => void;
}

export default function PlantCareModal({ slot, onClose }: PlantCareModalProps) {
  const waterPlant = useGameStore((state) => state.waterPlant);
  const feedPlant = useGameStore((state) => state.feedPlant);
  const boardItems = useGameStore((state) => state.boardItems);
  const removeBoardItem = useGameStore((state) => state.removeBoardItem);
  const addCoins = useGameStore((state) => state.addCoins);
  const addXP = useGameStore((state) => state.addXP);

  const hasWaterBucket = boardItems.some(item => item.itemType === 'water_bucket');
  const hasSeedBag = boardItems.some(item => item.itemType === 'seed_bag');

  const handleWater = () => {
    if (!hasWaterBucket) return;
    
    const waterBucket = boardItems.find(item => item.itemType === 'water_bucket');
    if (waterBucket) {
      removeBoardItem(waterBucket.id);
      waterPlant(slot.id);
      addCoins(5);
      addXP(2);
      onClose();
    }
  };

  const handleFeed = () => {
    if (!hasSeedBag) return;
    
    const seedBag = boardItems.find(item => item.itemType === 'seed_bag');
    if (seedBag) {
      removeBoardItem(seedBag.id);
      feedPlant(slot.id);
      addCoins(5);
      addXP(2);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 border-4 border-emerald-600">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-2xl font-bold text-emerald-700">Plant Care</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        <div className="mb-6">
          <div className="text-center mb-4">
            <div className="text-6xl mb-2">🌸</div>
            <p className="text-gray-600">Keep your plant healthy!</p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Droplet className="w-5 h-5 text-blue-500" />
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium">Water</span>
                  <span className="text-sm text-gray-600">{Math.floor(slot.waterMeter)}%</span>
                </div>
                <div className="h-2 bg-blue-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-500 transition-all"
                    style={{ width: `${slot.waterMeter}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Sprout className="w-5 h-5 text-amber-500" />
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium">Nutrients</span>
                  <span className="text-sm text-gray-600">{Math.floor(slot.seedMeter)}%</span>
                </div>
                <div className="h-2 bg-amber-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-amber-500 transition-all"
                    style={{ width: `${slot.seedMeter}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <button
            onClick={handleWater}
            disabled={!hasWaterBucket || slot.waterMeter >= 90}
            className={`w-full py-3 rounded-xl font-bold text-white shadow-lg transition-all flex items-center justify-center gap-2 ${
              hasWaterBucket && slot.waterMeter < 90
                ? 'bg-blue-500 hover:bg-blue-600 active:scale-95'
                : 'bg-gray-300 cursor-not-allowed'
            }`}
          >
            <Droplet className="w-5 h-5" />
            {hasWaterBucket ? 'Use Water Bucket' : 'Need Water Bucket'}
          </button>

          <button
            onClick={handleFeed}
            disabled={!hasSeedBag || slot.seedMeter >= 90}
            className={`w-full py-3 rounded-xl font-bold text-white shadow-lg transition-all flex items-center justify-center gap-2 ${
              hasSeedBag && slot.seedMeter < 90
                ? 'bg-amber-500 hover:bg-amber-600 active:scale-95'
                : 'bg-gray-300 cursor-not-allowed'
            }`}
          >
            <Sprout className="w-5 h-5" />
            {hasSeedBag ? 'Use Seed Bag' : 'Need Seed Bag'}
          </button>
        </div>

        <p className="text-center text-sm text-gray-500 mt-4">
          Keeping plants healthy earns bonus XP and coins!
        </p>
      </div>
    </div>
  );
}
