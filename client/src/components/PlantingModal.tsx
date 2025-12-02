import { X } from 'lucide-react';
import { useGameStore } from '../store/gameStore';
import { PLANT_DEFINITIONS } from '../data/plantData';
import type { BoardItem } from '../types/game';

interface PlantingModalProps {
  plant: BoardItem;
  onClose: () => void;
}

export default function PlantingModal({ plant, onClose }: PlantingModalProps) {
  const gardenSlots = useGameStore((state) => state.gardenSlots);
  const plantInGarden = useGameStore((state) => state.plantInGarden);
  const removeBoardItem = useGameStore((state) => state.removeBoardItem);
  const addCoins = useGameStore((state) => state.addCoins);
  const addXP = useGameStore((state) => state.addXP);
  const setScreen = useGameStore((state) => state.setScreen);

  const plantDef = plant.itemType ? PLANT_DEFINITIONS[plant.itemType as keyof typeof PLANT_DEFINITIONS] : null;
  const availableSlots = gardenSlots.filter(slot => !slot.occupied);

  const handlePlant = (slotId: number) => {
    if (!plantDef) return;
    
    plantInGarden(slotId, plant.itemType, plant.rank);
    removeBoardItem(plant.id);
    
    const coinReward = plantDef.coinValue * plant.rank;
    const xpReward = plantDef.xpValue * plant.rank;
    
    addCoins(coinReward);
    addXP(xpReward);
    
    onClose();
    setScreen('garden');
  };

  if (!plantDef || !plant.maxRank || plant.rank < plant.maxRank) {
    onClose();
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 border-4 border-emerald-600">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-2xl font-bold text-emerald-700">Plant in Garden</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        <div className="mb-6">
          <div className="text-center mb-4">
            <div className="w-20 h-20 mb-2 mx-auto bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center text-white font-bold text-2xl">{plantDef.name.charAt(0)}</div>
            <h4 className="text-xl font-bold text-gray-800">{plantDef.name}</h4>
            <p className="text-gray-600">Rank {plant.rank} (Max)</p>
          </div>

          <div className="bg-emerald-50 rounded-lg p-4 mb-4">
            <p className="text-sm text-gray-700 mb-2 font-medium">Rewards:</p>
            <div className="flex items-center justify-around">
              <div className="text-center">
                <div className="text-sm font-bold text-yellow-600">
                  +{plantDef.coinValue * plant.rank} Coins
                </div>
              </div>
              <div className="text-center">
                <div className="text-sm font-bold text-blue-600">
                  +{plantDef.xpValue * plant.rank} XP
                </div>
              </div>
            </div>
          </div>
        </div>

        {availableSlots.length > 0 ? (
          <>
            <p className="text-sm text-gray-600 mb-3 text-center">
              Choose a slot to plant your flower:
            </p>
            <div className="grid grid-cols-4 gap-2 max-h-48 overflow-y-auto">
              {availableSlots.map((slot) => (
                <button
                  key={slot.id}
                  onClick={() => handlePlant(slot.id)}
                  className="aspect-square bg-green-100 hover:bg-green-200 border-2 border-green-400 border-dashed rounded-lg flex items-center justify-center transition-colors active:scale-95"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-green-300 to-emerald-400 rounded-full flex items-center justify-center text-white font-bold text-sm">+</div>
                </button>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-4">
            <p className="text-gray-600 mb-2">No empty slots available!</p>
            <p className="text-sm text-gray-500">Free up space in your garden first.</p>
          </div>
        )}
      </div>
    </div>
  );
}
