import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSettingsStore } from '@/lib/stores/useSettingsStore';
import { SettingsFlowerIcon, LockIcon, PlayButtonIcon, FogCloudIcon } from '../icons/GardenIcons';
import SettingsModal from './SettingsModal';

interface WorldMapScreenProps {
  onEnterGarden: (gardenId: string) => void;
}

interface GardenZone {
  id: string;
  nameKey: string;
  position: { top: string; left: string };
  size: { width: string; height: string };
  unlocked: boolean;
  fogIntensity: number;
}

const GARDEN_ZONES: GardenZone[] = [
  {
    id: 'main',
    nameKey: 'map.main_garden',
    position: { top: '35%', left: '35%' },
    size: { width: '30%', height: '30%' },
    unlocked: true,
    fogIntensity: 0,
  },
  {
    id: 'zen',
    nameKey: 'map.zen_garden',
    position: { top: '5%', left: '5%' },
    size: { width: '22%', height: '25%' },
    unlocked: false,
    fogIntensity: 0.8,
  },
  {
    id: 'tropical',
    nameKey: 'map.tropical_garden',
    position: { top: '5%', left: '73%' },
    size: { width: '22%', height: '25%' },
    unlocked: false,
    fogIntensity: 0.85,
  },
  {
    id: 'desert',
    nameKey: 'map.desert_garden',
    position: { top: '70%', left: '5%' },
    size: { width: '22%', height: '25%' },
    unlocked: false,
    fogIntensity: 0.9,
  },
  {
    id: 'winter',
    nameKey: 'map.winter_garden',
    position: { top: '70%', left: '73%' },
    size: { width: '22%', height: '25%' },
    unlocked: false,
    fogIntensity: 0.85,
  },
];

export default function WorldMapScreen({ onEnterGarden }: WorldMapScreenProps) {
  const [showSettings, setShowSettings] = useState(false);
  const [selectedGarden, setSelectedGarden] = useState<string | null>(null);
  const t = useSettingsStore((state) => state.t);

  const handleGardenClick = (zone: GardenZone) => {
    if (zone.unlocked) {
      setSelectedGarden(zone.id);
    }
  };

  const handleEnter = () => {
    if (selectedGarden) {
      onEnterGarden(selectedGarden);
    }
  };

  return (
    <div className="fixed inset-0 overflow-hidden touch-none">
      <motion.div
        initial={{ scale: 1.1, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: 'url(/game-assets/garden-world-map-fog.jpg)',
        }}
      />

      <div className="absolute top-4 left-4 right-4 flex justify-between items-start z-20">
        <motion.h1
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-2xl font-bold text-white drop-shadow-2xl bg-black/30 backdrop-blur-sm rounded-2xl px-6 py-3"
        >
          {t('map.title')}
        </motion.h1>

        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.1, rotate: 15 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setShowSettings(true)}
          className="w-14 h-14 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center shadow-xl border-4 border-amber-300"
        >
          <SettingsFlowerIcon size={32} color="#fff" />
        </motion.button>
      </div>

      {GARDEN_ZONES.map((zone, index) => (
        <motion.div
          key={zone.id}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.1 + 0.3 }}
          className="absolute cursor-pointer"
          style={{
            top: zone.position.top,
            left: zone.position.left,
            width: zone.size.width,
            height: zone.size.height,
          }}
          onClick={() => handleGardenClick(zone)}
        >
          {!zone.unlocked && zone.fogIntensity > 0 && (
            <motion.div
              className="absolute inset-0 pointer-events-none"
              animate={{
                opacity: [zone.fogIntensity - 0.1, zone.fogIntensity, zone.fogIntensity - 0.1],
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <div 
                className="absolute inset-0 bg-gradient-radial from-white/60 via-gray-200/70 to-white/50 rounded-xl"
                style={{
                  filter: 'blur(8px)',
                }}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  animate={{ 
                    x: [0, 10, -10, 0],
                    y: [0, -5, 5, 0],
                  }}
                  transition={{ duration: 8, repeat: Infinity }}
                >
                  <FogCloudIcon size={80} color="#e5e7eb" />
                </motion.div>
              </div>
            </motion.div>
          )}

          <motion.div
            whileHover={zone.unlocked ? { scale: 1.05 } : {}}
            whileTap={zone.unlocked ? { scale: 0.98 } : {}}
            className={`absolute inset-0 rounded-2xl border-4 transition-all ${
              selectedGarden === zone.id
                ? 'border-yellow-400 shadow-[0_0_30px_rgba(250,204,21,0.6)]'
                : zone.unlocked
                ? 'border-transparent hover:border-white/50'
                : 'border-transparent'
            }`}
          >
            {!zone.unlocked && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-black/50 backdrop-blur-sm rounded-full p-4">
                  <LockIcon size={40} color="#9ca3af" />
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      ))}

      <AnimatePresence>
        {selectedGarden && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="absolute bottom-8 left-4 right-4 z-20"
          >
            <div className="bg-gradient-to-r from-emerald-500 to-green-600 rounded-3xl p-6 shadow-2xl border-4 border-emerald-300">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-white drop-shadow-lg">
                    {t(`map.${selectedGarden}_garden`)}
                  </h2>
                  <p className="text-emerald-100 mt-1">
                    {t('common.enter')} {t('common.play')}
                  </p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleEnter}
                  className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-full flex items-center justify-center shadow-xl border-4 border-yellow-300"
                >
                  <PlayButtonIcon size={40} color="#fff" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showSettings && (
          <SettingsModal onClose={() => setShowSettings(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}
