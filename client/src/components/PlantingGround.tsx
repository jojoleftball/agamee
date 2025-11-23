import { useState } from 'react';
import { useMergeGameStore } from '@/lib/stores/useMergeGameStore';
import { MERGE_ITEMS } from '@/lib/mergeData';
import { Droplet, Sprout, Sparkles } from 'lucide-react';

interface PlantSlot {
  id: string;
  x: number;
  y: number;
  plantedItem: string | null;
  waterLevel: number;
  growthStage: number;
  lastWatered: number;
}

export default function PlantingGround() {
  const { items, removeItem, addCoins, addXP } = useMergeGameStore();
  const [plantSlots, setPlantSlots] = useState<PlantSlot[]>([
    { id: '1', x: 0, y: 0, plantedItem: null, waterLevel: 0, growthStage: 0, lastWatered: 0 },
    { id: '2', x: 1, y: 0, plantedItem: null, waterLevel: 0, growthStage: 0, lastWatered: 0 },
    { id: '3', x: 2, y: 0, plantedItem: null, waterLevel: 0, growthStage: 0, lastWatered: 0 },
    { id: '4', x: 0, y: 1, plantedItem: null, waterLevel: 0, growthStage: 0, lastWatered: 0 },
    { id: '5', x: 1, y: 1, plantedItem: null, waterLevel: 0, growthStage: 0, lastWatered: 0 },
    { id: '6', x: 2, y: 1, plantedItem: null, waterLevel: 0, growthStage: 0, lastWatered: 0 },
  ]);

  const handleWater = (slotId: string) => {
    setPlantSlots(prevSlots => 
      prevSlots.map(slot => {
        if (slot.id === slotId && slot.plantedItem && slot.waterLevel < 100) {
          const newWaterLevel = Math.min(100, slot.waterLevel + 25);
          return {
            ...slot,
            waterLevel: newWaterLevel,
            lastWatered: Date.now(),
            growthStage: newWaterLevel >= 100 ? 100 : slot.growthStage
          };
        }
        return slot;
      })
    );
  };

  const harvestPlant = (slotId: string) => {
    const slot = plantSlots.find(s => s.id === slotId);
    if (slot && slot.plantedItem && slot.growthStage >= 100) {
      const item = items.find(i => i.id === slot.plantedItem);
      if (item) {
        const itemData = MERGE_ITEMS[item.itemType];
        if (itemData) {
          addCoins(itemData.coinValue * 2);
          addXP(itemData.xpValue * 2);
          removeItem(slot.plantedItem);
        }
      }
      
      setPlantSlots(prevSlots =>
        prevSlots.map(s => 
          s.id === slotId 
            ? { ...s, plantedItem: null, waterLevel: 0, growthStage: 0 }
            : s
        )
      );
    }
  };

  return (
    <div className="w-full h-full flex items-center justify-center p-4">
      <div 
        className="relative rounded-3xl shadow-2xl border-4 border-amber-800 overflow-hidden"
        style={{
          width: '90%',
          maxWidth: '600px',
          aspectRatio: '3/2',
          backgroundImage: 'url(/game-assets/planting_ground_ui_sprite.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-xl shadow-lg border-2 border-green-600">
          <div className="flex items-center gap-2">
            <Sprout className="w-5 h-5 text-green-600" />
            <span className="font-bold text-green-800">Planting Ground</span>
          </div>
          <p className="text-xs text-gray-600 mt-1">Water plants to grow them</p>
        </div>

        <div className="absolute inset-0 grid grid-cols-3 grid-rows-2 gap-4 p-16">
          {plantSlots.map((slot) => {
            const item = slot.plantedItem ? items.find(i => i.id === slot.plantedItem) : null;
            const itemData = item ? MERGE_ITEMS[item.itemType] : null;
            
            return (
              <div
                key={slot.id}
                className={`relative bg-amber-900/40 backdrop-blur-sm rounded-2xl border-4 ${
                  slot.plantedItem ? 'border-green-500' : 'border-amber-700 border-dashed'
                } flex flex-col items-center justify-center p-2 transition-all`}
              >
                {slot.plantedItem && itemData ? (
                  <>
                    <div className="flex-1 flex items-center justify-center">
                      <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center shadow-lg">
                        <span className="text-white font-bold text-xl">{itemData.name.charAt(0)}</span>
                      </div>
                    </div>
                    
                    <div className="w-full mt-2">
                      <div className="h-2 bg-blue-900/60 rounded-full overflow-hidden border border-blue-800">
                        <div 
                          className="h-full bg-gradient-to-r from-blue-400 to-cyan-400 transition-all duration-300"
                          style={{ width: `${slot.waterLevel}%` }}
                        />
                      </div>
                    </div>

                    <button
                      onClick={() => handleWater(slot.id)}
                      disabled={slot.waterLevel >= 100}
                      className="mt-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white p-2 rounded-lg transition-all active:scale-95 disabled:cursor-not-allowed"
                    >
                      <Droplet className="w-4 h-4" />
                    </button>

                    {slot.growthStage >= 100 && (
                      <button
                        onClick={() => harvestPlant(slot.id)}
                        className="absolute -top-2 -right-2 bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg transition-all active:scale-95 flex items-center gap-1"
                      >
                        <Sparkles className="w-3 h-3" />
                        Harvest
                      </button>
                    )}
                  </>
                ) : (
                  <div className="text-center opacity-70">
                    <Sprout className="w-8 h-8 text-amber-700 mx-auto mb-1" />
                    <p className="text-xs text-amber-800 font-medium">Empty</p>
                    <p className="text-xs text-amber-600 mt-1">Coming soon</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
