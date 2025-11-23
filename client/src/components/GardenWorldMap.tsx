import { useMergeGameStore } from '@/lib/stores/useMergeGameStore';
import { GARDEN_BIOMES } from '@/lib/mergeData';
import { Lock, Check } from 'lucide-react';
import { useState } from 'react';

interface GardenWorldMapProps {
  onGardenSelect: (gardenId: string) => void;
  onClose: () => void;
}

export default function GardenWorldMap({ onGardenSelect, onClose }: GardenWorldMapProps) {
  const { currentBiome, unlockedBiomes, level, coins } = useMergeGameStore();
  const [selectedGarden, setSelectedGarden] = useState<string | null>(null);

  const gardenPositions = [
    { id: 'basic', x: '50%', y: '20%', icon: 0 },
    { id: 'tropical', x: '25%', y: '40%', icon: 1 },
    { id: 'zen', x: '70%', y: '45%', icon: 2 },
    { id: 'desert', x: '40%', y: '65%', icon: 3 },
    { id: 'winter', x: '60%', y: '80%', icon: 4 }
  ];

  const handleGardenClick = (gardenId: string) => {
    const isUnlocked = unlockedBiomes.includes(gardenId);
    if (isUnlocked) {
      setSelectedGarden(gardenId);
    }
  };

  const handleEnterGarden = () => {
    if (selectedGarden) {
      onGardenSelect(selectedGarden);
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 w-full h-full"
      style={{
        height: 'calc(var(--vh, 1vh) * 100)',
        backgroundImage: 'url(/game-assets/garden_world_map_background.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <div className="absolute inset-0 bg-black/20" />
      
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 w-12 h-12 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-lg flex items-center justify-center font-bold text-xl transition-transform active:scale-95"
      >
        X
      </button>

      <div className="absolute top-4 left-4 z-10 bg-white/95 backdrop-blur-sm px-6 py-3 rounded-2xl shadow-xl border-4 border-green-600">
        <h1 className="text-2xl font-bold text-green-800 drop-shadow-md">Garden World</h1>
        <p className="text-sm text-green-700">Touch a garden to select it</p>
      </div>

      <div className="relative w-full h-full">
        {gardenPositions.map((pos) => {
          const biome = GARDEN_BIOMES.find(b => b.id === pos.id);
          if (!biome) return null;

          const isUnlocked = unlockedBiomes.includes(biome.id);
          const isCurrent = currentBiome === biome.id;
          const isSelected = selectedGarden === biome.id;
          const canUnlock = level >= biome.unlockLevel && coins >= biome.unlockCoins;

          return (
            <div
              key={biome.id}
              className="absolute transform -translate-x-1/2 -translate-y-1/2"
              style={{
                left: pos.x,
                top: pos.y
              }}
            >
              <button
                onClick={() => handleGardenClick(biome.id)}
                disabled={!isUnlocked}
                className={`relative w-28 h-28 rounded-full transition-all duration-300 ${
                  isUnlocked
                    ? 'cursor-pointer hover:scale-110 active:scale-95'
                    : 'cursor-not-allowed opacity-60'
                } ${
                  isSelected
                    ? 'ring-8 ring-yellow-400 scale-110'
                    : isCurrent
                    ? 'ring-4 ring-green-400'
                    : ''
                }`}
                style={{
                  backgroundImage: 'url(/game-assets/garden_selection_icons_sprite_sheet.png)',
                  backgroundSize: '500% 100%',
                  backgroundPosition: `${pos.icon * 25}% 0%`,
                  backgroundRepeat: 'no-repeat',
                  filter: isUnlocked ? 'none' : 'grayscale(100%) brightness(0.6)'
                }}
              >
                {!isUnlocked && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full">
                    <Lock className="w-10 h-10 text-white" />
                  </div>
                )}
                {isCurrent && isUnlocked && (
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center border-2 border-white shadow-lg">
                    <Check className="w-5 h-5 text-white" />
                  </div>
                )}
              </button>

              <div className="mt-2 text-center bg-white/95 backdrop-blur-sm px-3 py-2 rounded-xl shadow-lg border-2 border-green-500">
                <p className="font-bold text-sm text-green-800">{biome.name}</p>
                {!isUnlocked && (
                  <p className="text-xs text-red-600 font-medium">
                    Lvl {biome.unlockLevel} | {biome.unlockCoins} coins
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {selectedGarden && (
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 w-full max-w-md px-4">
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl border-4 border-green-600 p-6">
            <h2 className="text-2xl font-bold text-green-800 mb-2">
              {GARDEN_BIOMES.find(b => b.id === selectedGarden)?.name}
            </h2>
            <p className="text-gray-700 mb-4">
              {GARDEN_BIOMES.find(b => b.id === selectedGarden)?.description}
            </p>
            <button
              onClick={handleEnterGarden}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold text-lg py-4 rounded-2xl shadow-lg transition-transform active:scale-95"
            >
              Enter Garden
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
