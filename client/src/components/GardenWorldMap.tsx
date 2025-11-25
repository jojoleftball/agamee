import { useMergeGameStore } from '@/lib/stores/useMergeGameStore';
import { GARDEN_BIOMES } from '@/lib/mergeData';
import { Lock, Check } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface GardenWorldMapProps {
  onGardenSelect: (gardenId: string) => void;
  onClose: () => void;
}

export default function GardenWorldMap({ onGardenSelect, onClose }: GardenWorldMapProps) {
  const { currentBiome, unlockedBiomes, level, coins, unlockBiome } = useMergeGameStore();
  const [selectedGarden, setSelectedGarden] = useState<string | null>(null);

  const gardenPositions = [
    { id: 'tropical', x: '15%', y: '15%', icon: 1 },
    { id: 'basic', x: '50%', y: '50%', icon: 0 },
    { id: 'zen', x: '85%', y: '15%', icon: 2 },
    { id: 'desert', x: '15%', y: '85%', icon: 3 },
    { id: 'winter', x: '85%', y: '85%', icon: 4 }
  ];

  const handleGardenClick = (gardenId: string) => {
    setSelectedGarden(gardenId);
  };

  const handleEnterGarden = () => {
    if (selectedGarden) {
      onGardenSelect(selectedGarden);
      onClose();
    }
  };

  const handleUnlockGarden = () => {
    if (selectedGarden) {
      const success = unlockBiome(selectedGarden);
      if (success) {
        onGardenSelect(selectedGarden);
        onClose();
      } else {
        const biome = GARDEN_BIOMES.find(b => b.id === selectedGarden);
        if (biome) {
          if (level < biome.unlockLevel) {
            alert(`Reach level ${biome.unlockLevel} to unlock this garden!`);
          } else if (coins < biome.unlockCoins) {
            alert(`Need ${biome.unlockCoins} coins to unlock this garden!`);
          }
        }
      }
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-50 w-full h-full"
      style={{
        height: 'calc(var(--vh, 1vh) * 100)'
      }}
    >
      <div 
        className="absolute inset-0"
        style={{
          backgroundImage: 'url(/game-assets/world-map-overview.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      />
      
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={onClose}
        className="absolute top-4 right-4 z-10 w-12 h-12 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-lg flex items-center justify-center font-bold text-xl"
      >
        X
      </motion.button>

      <motion.div 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="absolute top-4 left-4 z-10 bg-white/95 backdrop-blur-sm px-6 py-3 rounded-2xl shadow-xl border-4 border-green-600"
      >
        <h1 className="text-2xl font-bold text-green-800 drop-shadow-md">Garden World</h1>
        <p className="text-sm text-green-700">Touch a garden to select it</p>
      </motion.div>

      <div className="relative w-full h-full">
        {gardenPositions.map((pos, index) => {
          const biome = GARDEN_BIOMES.find(b => b.id === pos.id);
          if (!biome) return null;

          const isUnlocked = unlockedBiomes.includes(biome.id);
          const isCurrent = currentBiome === biome.id;
          const isSelected = selectedGarden === biome.id;
          const canUnlock = level >= biome.unlockLevel && coins >= biome.unlockCoins;

          return (
            <motion.div
              key={biome.id}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: index * 0.1, type: 'spring', stiffness: 200 }}
              className="absolute transform -translate-x-1/2 -translate-y-1/2"
              style={{
                left: pos.x,
                top: pos.y
              }}
            >
              <motion.button
                onClick={() => handleGardenClick(biome.id)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className={`relative w-32 h-32 rounded-full transition-all duration-300 cursor-pointer ${
                  isSelected
                    ? 'ring-8 ring-yellow-400'
                    : isCurrent
                    ? 'ring-4 ring-green-400'
                    : ''
                }`}
                style={{
                  background: isUnlocked ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.5)',
                  backdropFilter: 'blur(10px)',
                  border: isUnlocked ? '4px solid rgba(34,197,94,0.8)' : '4px solid rgba(156,163,175,0.8)'
                }}
              >
                {!isUnlocked && (
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: index * 0.1 + 0.3 }}
                    className="absolute inset-0 flex items-center justify-center rounded-full"
                  >
                    <Lock className="w-12 h-12 text-white drop-shadow-lg" />
                  </motion.div>
                )}
                {isCurrent && isUnlocked && (
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1, rotate: [0, 10, -10, 0] }}
                    transition={{ delay: index * 0.1 + 0.3, rotate: { repeat: Infinity, duration: 2 } }}
                    className="absolute -top-2 -right-2 w-10 h-10 bg-green-500 rounded-full flex items-center justify-center border-2 border-white shadow-lg"
                  >
                    <Check className="w-6 h-6 text-white" />
                  </motion.div>
                )}
                {isUnlocked && (
                  <motion.div
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    <div className="w-16 h-16 rounded-full bg-green-400/30 backdrop-blur-sm border-2 border-green-600 flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-green-600" />
                    </div>
                  </motion.div>
                )}
              </motion.button>

              <motion.div 
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.1 + 0.2 }}
                className="mt-2 text-center bg-white/95 backdrop-blur-sm px-3 py-2 rounded-xl shadow-lg border-2 border-green-500"
              >
                <p className="font-bold text-sm text-green-800">{biome.name}</p>
                {!isUnlocked && (
                  <p className="text-xs text-red-600 font-medium">
                    Lvl {biome.unlockLevel} | {biome.unlockCoins} coins
                  </p>
                )}
              </motion.div>
            </motion.div>
          );
        })}
      </div>

      <AnimatePresence>
        {selectedGarden && (() => {
          const selectedBiome = GARDEN_BIOMES.find(b => b.id === selectedGarden);
          const isUnlocked = unlockedBiomes.includes(selectedGarden);
          const canUnlock = level >= (selectedBiome?.unlockLevel || 0) && coins >= (selectedBiome?.unlockCoins || 0);
          
          return (
            <motion.div 
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 200, damping: 25 }}
              className="absolute bottom-8 left-1/2 transform -translate-x-1/2 w-full max-w-md px-4"
            >
              <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl border-4 border-green-600 p-6">
                <h2 className="text-2xl font-bold text-green-800 mb-2">
                  {selectedBiome?.name}
                </h2>
                <p className="text-gray-700 mb-4">
                  {selectedBiome?.description}
                </p>
                
                {isUnlocked ? (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleEnterGarden}
                    className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold text-lg py-4 rounded-2xl shadow-lg"
                  >
                    Enter Garden
                  </motion.button>
                ) : (
                  <>
                    <motion.div 
                      initial={{ scale: 0.9 }}
                      animate={{ scale: 1 }}
                      className="mb-4 p-3 bg-yellow-50 rounded-lg border-2 border-yellow-300"
                    >
                      <p className="text-sm font-bold text-yellow-800 mb-1">Requirements:</p>
                      <p className="text-sm text-yellow-700">
                        Level {selectedBiome?.unlockLevel} | {selectedBiome?.unlockCoins} coins
                      </p>
                      <p className="text-xs text-yellow-600 mt-1">
                        Your level: {level} | Your coins: {coins}
                      </p>
                    </motion.div>
                    <motion.button
                      whileHover={canUnlock ? { scale: 1.05 } : {}}
                      whileTap={canUnlock ? { scale: 0.95 } : {}}
                      onClick={handleUnlockGarden}
                      disabled={!canUnlock}
                      className={`w-full font-bold text-lg py-4 rounded-2xl shadow-lg ${
                        canUnlock
                          ? 'bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-600 hover:to-amber-700 text-white'
                          : 'bg-gray-400 text-gray-600 cursor-not-allowed'
                      }`}
                    >
                      {canUnlock ? `Unlock for ${selectedBiome?.unlockCoins} coins` : 'Requirements not met'}
                    </motion.button>
                  </>
                )}
              </div>
            </motion.div>
          );
        })()}
      </AnimatePresence>
    </motion.div>
  );
}
