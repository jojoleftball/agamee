import { useState, useEffect } from 'react';
import { useGameStore } from '../../store/gameStore';
import { Droplet, Sprout, ChevronLeft } from 'lucide-react';
import PlantCareModal from '../PlantCareModal';
import TutorialOverlay from '../TutorialOverlay';
import { PLANT_DEFINITIONS } from '../../data/plantData';
import { MergeBoardIcon } from '../icons/GardenIcons';
import type { GardenSlot } from '../../types/game';

export default function GardenScreen() {
  const setScreen = useGameStore((state) => state.setScreen);
  const gardenSlots = useGameStore((state) => state.gardenSlots);
  const resources = useGameStore((state) => state.resources);
  const updateGardenSlots = useGameStore((state) => state.updateGardenSlots);
  const [selectedSlot, setSelectedSlot] = useState<GardenSlot | null>(null);
  
  useEffect(() => {
    const interval = setInterval(() => {
      updateGardenSlots();
    }, 5000);
    
    return () => clearInterval(interval);
  }, [updateGardenSlots]);

  const handleOpenMergeBoard = () => {
    setScreen('merge_board');
  };

  const handleBackToMap = () => {
    setScreen('map');
  };
  
  const handleSlotClick = (slot: GardenSlot) => {
    if (slot.occupied) {
      setSelectedSlot(slot);
    }
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-b from-sky-200 to-green-200">
      <div 
        className="absolute inset-0 opacity-50"
        style={{
          backgroundImage: 'url(/game-assets/basic_garden_background_vertical.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      <div className="absolute top-0 left-0 right-0 p-4 z-10 bg-gradient-to-b from-black/20 to-transparent">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <button
            onClick={handleBackToMap}
            className="flex items-center gap-2 px-4 py-2 bg-white/90 hover:bg-white rounded-lg shadow-lg transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            <span className="font-medium">Map</span>
          </button>

          <div className="flex items-center gap-4">
            <div className="bg-yellow-500 px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 border-2 border-yellow-600">
              <span className="text-2xl">💰</span>
              <span className="font-bold text-white">{resources.coins}</span>
            </div>
            <div className="bg-blue-500 px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 border-2 border-blue-600">
              <span className="text-2xl">⚡</span>
              <span className="font-bold text-white">{resources.energy}/{resources.maxEnergy}</span>
            </div>
            <div className="bg-purple-500 px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 border-2 border-purple-600">
              <span className="text-2xl">💎</span>
              <span className="font-bold text-white">{resources.gems}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="relative h-full flex flex-col items-center justify-center p-4 pt-24">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white drop-shadow-lg mb-2">
            Main Garden
          </h2>
          <p className="text-white/90">
            Plant flowers to beautify your garden
          </p>
        </div>

        <div className="grid grid-cols-3 md:grid-cols-4 gap-4 max-w-3xl mb-8">
          {gardenSlots.map((slot) => {
            const plantDef = slot.plantType ? PLANT_DEFINITIONS[slot.plantType] : null;
            return (
              <button
                key={slot.id}
                onClick={() => handleSlotClick(slot)}
                className={`aspect-square rounded-xl border-4 shadow-lg transition-all ${
                  slot.occupied
                    ? 'bg-green-500 border-green-700 hover:scale-105 cursor-pointer'
                    : 'bg-white/80 border-green-400 border-dashed animate-pulse'
                }`}
              >
                {slot.occupied && plantDef ? (
                  <div className="w-full h-full p-2 flex flex-col items-center justify-center">
                    <div className="text-3xl mb-2">{plantDef.emoji}</div>
                    <div className="flex gap-1 w-full">
                      <div className="flex-1 bg-blue-300 rounded-full h-1">
                        <div 
                          className="bg-blue-600 h-full rounded-full"
                          style={{ width: `${slot.waterMeter}%` }}
                        />
                      </div>
                      <div className="flex-1 bg-amber-300 rounded-full h-1">
                        <div 
                          className="bg-amber-600 h-full rounded-full"
                          style={{ width: `${slot.seedMeter}%` }}
                        />
                      </div>
                    </div>
                    {slot.waterMeter < 30 && (
                      <Droplet className="w-4 h-4 text-blue-600 mt-1 animate-bounce" />
                    )}
                    {slot.seedMeter < 30 && (
                      <Sprout className="w-4 h-4 text-amber-600 mt-1 animate-bounce" />
                    )}
                  </div>
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-4xl text-green-400">✨</div>
                  </div>
                )}
              </button>
            );
          })}
        </div>

      </div>

      <button
        onClick={handleOpenMergeBoard}
        className="absolute bottom-6 right-6 w-16 h-16 bg-gradient-to-br from-emerald-400 to-emerald-600 hover:from-emerald-500 hover:to-emerald-700 rounded-2xl shadow-2xl transition-all active:scale-95 border-4 border-emerald-700 flex items-center justify-center z-20"
        title="Open Merge Board"
      >
        <MergeBoardIcon size={36} />
      </button>

      <TutorialOverlay />
      
      {selectedSlot && (
        <PlantCareModal 
          slot={selectedSlot} 
          onClose={() => setSelectedSlot(null)} 
        />
      )}
    </div>
  );
}
