import { useMergeGameStore } from '@/lib/stores/useMergeGameStore';
import { GARDEN_BIOMES } from '@/lib/mergeData';
import { Button } from './ui/button';
import { X, Lock, Check } from 'lucide-react';

interface BiomeSelectorProps {
  onClose: () => void;
}

export default function BiomeSelector({ onClose }: BiomeSelectorProps) {
  const { currentBiome, unlockedBiomes, level, coins, switchBiome, unlockBiome } = useMergeGameStore();

  const handleBiomeSelect = (biomeId: string) => {
    if (unlockedBiomes.includes(biomeId)) {
      switchBiome(biomeId);
      onClose();
    }
  };

  const handleBiomeUnlock = (biomeId: string) => {
    const success = unlockBiome(biomeId);
    if (!success) {
      const biome = GARDEN_BIOMES.find(b => b.id === biomeId);
      if (biome) {
        if (level < biome.unlockLevel) {
          alert(`Reach level ${biome.unlockLevel} to unlock this garden!`);
        } else if (coins < biome.unlockCoins) {
          alert(`Need ${biome.unlockCoins} coins to unlock this garden!`);
        }
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full max-h-[80vh] overflow-hidden flex flex-col">
        <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">Gardens</h2>
          <Button
            onClick={onClose}
            size="icon"
            className="bg-white/20 hover:bg-white/30 text-white rounded-full"
          >
            <X className="w-6 h-6" />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {GARDEN_BIOMES.map((biome) => {
            const isUnlocked = unlockedBiomes.includes(biome.id);
            const isCurrent = currentBiome === biome.id;
            const canUnlock = level >= biome.unlockLevel && coins >= biome.unlockCoins;

            return (
              <div
                key={biome.id}
                className={`p-4 rounded-xl border-2 ${
                  isCurrent
                    ? 'bg-green-50 border-green-500 ring-2 ring-green-300'
                    : isUnlocked
                    ? 'bg-white border-green-300'
                    : 'bg-gray-100 border-gray-300'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-lg text-gray-800">{biome.name}</h3>
                  {isCurrent && <Check className="w-6 h-6 text-green-500" />}
                  {!isUnlocked && <Lock className="w-6 h-6 text-gray-400" />}
                </div>

                <p className="text-sm text-gray-600 mb-3">{biome.description}</p>

                <div className="flex flex-wrap gap-2 mb-3">
                  <div className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full font-semibold">
                    Level {biome.unlockLevel}
                  </div>
                  {biome.unlockCoins > 0 && (
                    <div className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full font-semibold">
                      {biome.unlockCoins} Coins
                    </div>
                  )}
                </div>

                {isUnlocked ? (
                  !isCurrent && (
                    <Button
                      onClick={() => handleBiomeSelect(biome.id)}
                      className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-3 rounded-xl"
                    >
                      Switch to Garden
                    </Button>
                  )
                ) : (
                  <Button
                    onClick={() => handleBiomeUnlock(biome.id)}
                    disabled={!canUnlock}
                    className={`w-full ${
                      canUnlock
                        ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700'
                        : 'bg-gray-400'
                    } text-white font-bold py-3 rounded-xl disabled:cursor-not-allowed`}
                  >
                    {canUnlock ? 'Unlock Garden' : 'Locked'}
                  </Button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
