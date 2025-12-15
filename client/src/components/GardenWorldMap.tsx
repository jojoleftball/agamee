import { useMergeGameStore } from '@/lib/stores/useMergeGameStore';
import { GARDEN_BIOMES } from '@/lib/mergeData';
import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, MapPin, Sparkles, X, Coins } from 'lucide-react';
import { GardenButton, GardenCard, Badge } from './ui/GardenUI';
import { GARDENS, GARDEN_COLORS } from '@/lib/gardenTheme';

interface GardenWorldMapProps {
  onGardenSelect: (gardenId: string) => void;
  onClose: () => void;
}

function FogOverlay({ color, isLocked }: { color: string; isLocked: boolean }) {
  if (!isLocked) return null;
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="absolute inset-0 rounded-full"
      style={{
        background: `radial-gradient(circle, ${color} 0%, rgba(0,0,0,0.6) 100%)`,
        backdropFilter: 'blur(4px)',
      }}
    />
  );
}

function GardenNode({ 
  garden, 
  biome,
  isUnlocked, 
  isCurrent, 
  isSelected,
  index,
  onClick 
}: { 
  garden: typeof GARDENS[0];
  biome: typeof GARDEN_BIOMES[0] | undefined;
  isUnlocked: boolean;
  isCurrent: boolean;
  isSelected: boolean;
  index: number;
  onClick: () => void;
}) {
  const gardenEmojis: Record<string, string> = {
    basic: '🌻',
    tropical: '🌴',
    zen: '🎋',
    desert: '🌵',
    winter: '❄️',
  };

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: index * 0.1, type: 'spring', stiffness: 200 }}
      className="absolute transform -translate-x-1/2 -translate-y-1/2"
      style={{
        left: garden.position.x,
        top: garden.position.y,
      }}
    >
      <motion.button
        onClick={onClick}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className={`relative w-28 h-28 sm:w-32 sm:h-32 rounded-full transition-all duration-300 cursor-pointer overflow-hidden ${
          isSelected
            ? 'ring-4 ring-amber-400 ring-offset-2 ring-offset-transparent'
            : isCurrent
            ? 'ring-4 ring-emerald-400'
            : ''
        }`}
        style={{
          background: isUnlocked 
            ? `linear-gradient(135deg, ${GARDEN_COLORS.primary[100]}, ${GARDEN_COLORS.primary[300]})`
            : 'linear-gradient(135deg, #374151, #1f2937)',
          border: isUnlocked 
            ? `4px solid ${GARDEN_COLORS.primary[500]}` 
            : '4px solid #4b5563',
          boxShadow: isUnlocked
            ? '0 8px 32px rgba(34, 197, 94, 0.4)'
            : '0 8px 32px rgba(0, 0, 0, 0.4)',
        }}
      >
        <FogOverlay color={garden.fogColor} isLocked={!isUnlocked} />
        
        {isUnlocked ? (
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute inset-0 flex items-center justify-center text-5xl"
          >
            {gardenEmojis[garden.id] || '🌸'}
          </motion.div>
        ) : (
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: index * 0.1 + 0.3 }}
            className="absolute inset-0 flex items-center justify-center z-10"
          >
            <div className="w-14 h-14 rounded-full bg-gray-800/80 flex items-center justify-center border-2 border-gray-600">
              <Lock size={28} className="text-gray-400" />
            </div>
          </motion.div>
        )}

        {isCurrent && isUnlocked && (
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1, y: [0, -3, 0] }}
            transition={{ y: { repeat: Infinity, duration: 1.5 } }}
            className="absolute -top-2 -right-2 z-20"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center border-2 border-white shadow-lg">
              <MapPin size={16} className="text-white" />
            </div>
          </motion.div>
        )}
      </motion.button>

      <motion.div 
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: index * 0.1 + 0.2 }}
        className="mt-2 text-center"
      >
        <GardenCard className="px-3 py-2 !rounded-xl" noPadding>
          <p className="font-bold text-sm text-emerald-800">{garden.name}</p>
          {!isUnlocked && biome && (
            <div className="flex items-center justify-center gap-1 mt-1">
              <Badge variant="warning">
                Lvl {biome.unlockLevel}
              </Badge>
            </div>
          )}
        </GardenCard>
      </motion.div>
    </motion.div>
  );
}

export default function GardenWorldMap({ onGardenSelect, onClose }: GardenWorldMapProps) {
  const { currentBiome, unlockedBiomes, level, coins, unlockBiome } = useMergeGameStore();
  const [selectedGarden, setSelectedGarden] = useState<string | null>(null);

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
      }
    }
  };

  const selectedBiome = selectedGarden ? GARDEN_BIOMES.find(b => b.id === selectedGarden) : null;
  const selectedGardenData = selectedGarden ? GARDENS.find(g => g.id === selectedGarden) : null;
  const isSelectedUnlocked = selectedGarden ? unlockedBiomes.includes(selectedGarden) : false;
  const canUnlock = selectedBiome 
    ? level >= selectedBiome.unlockLevel && coins >= selectedBiome.unlockCoins 
    : false;

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
      
      <div className="absolute inset-0 bg-gradient-to-b from-emerald-900/20 via-transparent to-emerald-900/40" />
      
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="absolute top-4 left-4 right-20 z-10"
      >
        <GardenCard className="!py-2 !px-4 inline-flex items-center gap-2">
          <span className="text-2xl">🗺️</span>
          <div>
            <h1 className="font-bold text-emerald-800">Garden World</h1>
            <p className="text-xs text-emerald-600">Explore and unlock new gardens</p>
          </div>
        </GardenCard>
      </motion.div>
      
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1, rotate: 90 }}
        whileTap={{ scale: 0.9 }}
        onClick={onClose}
        className="absolute top-4 right-4 z-10 w-12 h-12 bg-gradient-to-br from-red-400 to-red-600 hover:from-red-500 hover:to-red-700 rounded-full shadow-lg flex items-center justify-center border-2 border-red-300"
      >
        <X size={24} className="text-white" />
      </motion.button>

      <div className="relative w-full h-full">
        {GARDENS.map((garden, index) => {
          const biome = GARDEN_BIOMES.find(b => b.id === garden.id);
          const isUnlocked = unlockedBiomes.includes(garden.id);
          const isCurrent = currentBiome === garden.id;
          const isSelected = selectedGarden === garden.id;

          return (
            <GardenNode
              key={garden.id}
              garden={garden}
              biome={biome}
              isUnlocked={isUnlocked}
              isCurrent={isCurrent}
              isSelected={isSelected}
              index={index}
              onClick={() => handleGardenClick(garden.id)}
            />
          );
        })}
      </div>

      <AnimatePresence>
        {selectedGarden && selectedGardenData && (
          <motion.div 
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 25 }}
            className="absolute bottom-4 left-4 right-4 sm:left-1/2 sm:-translate-x-1/2 sm:max-w-md"
          >
            <GardenCard className="relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-pink-400 via-amber-300 to-pink-400" />
              
              <div className="flex items-start gap-3 mb-3">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-100 to-emerald-200 flex items-center justify-center text-3xl border-2 border-emerald-300 shadow-inner">
                  {selectedGardenData.id === 'basic' && '🌻'}
                  {selectedGardenData.id === 'tropical' && '🌴'}
                  {selectedGardenData.id === 'zen' && '🎋'}
                  {selectedGardenData.id === 'desert' && '🌵'}
                  {selectedGardenData.id === 'winter' && '❄️'}
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-emerald-800 flex items-center gap-2">
                    {selectedGardenData.name}
                    {isSelectedUnlocked && <Sparkles size={18} className="text-amber-500" />}
                  </h2>
                  <p className="text-sm text-emerald-600 mt-1">
                    {selectedGardenData.description}
                  </p>
                </div>
              </div>
              
              {isSelectedUnlocked ? (
                <GardenButton
                  variant="primary"
                  size="lg"
                  onClick={handleEnterGarden}
                  icon={<MapPin size={20} />}
                  className="w-full"
                >
                  Enter Garden
                </GardenButton>
              ) : (
                <>
                  <div className="mb-4 p-3 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-xl border-2 border-amber-200">
                    <div className="flex items-center gap-2 mb-2">
                      <Lock size={16} className="text-amber-600" />
                      <span className="font-bold text-amber-800">Requirements</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant={level >= (selectedBiome?.unlockLevel || 0) ? 'success' : 'error'}>
                        Level {selectedBiome?.unlockLevel}
                      </Badge>
                      <Badge variant={coins >= (selectedBiome?.unlockCoins || 0) ? 'success' : 'error'}>
                        <Coins size={12} className="mr-1" />
                        {selectedBiome?.unlockCoins} coins
                      </Badge>
                    </div>
                    <p className="text-xs text-amber-600 mt-2">
                      You: Level {level} | {coins} coins
                    </p>
                  </div>
                  <GardenButton
                    variant={canUnlock ? 'gold' : 'secondary'}
                    size="lg"
                    onClick={handleUnlockGarden}
                    disabled={!canUnlock}
                    icon={<Lock size={20} />}
                    className="w-full"
                  >
                    {canUnlock ? `Unlock for ${selectedBiome?.unlockCoins} coins` : 'Requirements not met'}
                  </GardenButton>
                </>
              )}
            </GardenCard>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
