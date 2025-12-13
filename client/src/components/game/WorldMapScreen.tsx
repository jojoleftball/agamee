import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSettingsStore } from '@/lib/stores/useSettingsStore';
import { useMapEditorStore } from '@/lib/stores/useMapEditorStore';
import { SettingsFlowerIcon, FogCloudIcon } from '../icons/GardenIcons';
import { Edit3, Map as MapIcon } from 'lucide-react';
import SettingsModal from './SettingsModal';
import { WorldMapViewer } from '../MapEditor';
import { MapBuilder } from '../MapBuilder';

const LOCKED_SPRITE_URL = '/sprites/locked-icon.png';

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
  const [showMapBuilder, setShowMapBuilder] = useState(false);
  const [useExpandedMap, setUseExpandedMap] = useState(false);
  const t = useSettingsStore((state) => state.t);
  const { pieces } = useMapEditorStore();

  const hasMapPieces = pieces.length > 0;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'm' || e.key === 'M') {
        if (!showSettings && !showMapBuilder) {
          setShowMapBuilder(true);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showSettings, showMapBuilder]);

  const handleGardenClick = (zone: GardenZone) => {
    if (zone.unlocked) {
      onEnterGarden(zone.id);
    }
  };

  const handleMapPieceClick = (pieceId: string) => {
    const piece = pieces.find(p => p.id === pieceId);
    if (piece) {
      onEnterGarden(piece.id);
    }
  };

  return (
    <div className="fixed inset-0 overflow-hidden touch-none">
      {useExpandedMap && hasMapPieces ? (
        <WorldMapViewer 
          onSelectLocation={handleMapPieceClick}
          onClose={() => setUseExpandedMap(false)}
        />
      ) : (
        <>
          <motion.div
            initial={{ scale: 1.1, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: 'url(/game-assets/garden-world-map-fog.jpg)',
            }}
          />

          {GARDEN_ZONES.map((zone, index) => (
            <motion.div
              key={zone.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 + 0.3 }}
              className={`absolute ${zone.unlocked ? 'cursor-pointer' : 'cursor-not-allowed'}`}
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
                whileHover={zone.unlocked ? { scale: 1.08 } : {}}
                whileTap={zone.unlocked ? { scale: 0.95 } : {}}
                className={`absolute inset-0 rounded-2xl transition-all ${
                  zone.unlocked
                    ? 'border-4 border-transparent hover:border-emerald-400 hover:shadow-[0_0_40px_rgba(52,211,153,0.5)]'
                    : 'border-transparent'
                }`}
              >
                {!zone.unlocked && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <img 
                      src={LOCKED_SPRITE_URL} 
                      alt="Locked" 
                      className="w-20 h-20 object-contain drop-shadow-lg"
                    />
                  </div>
                )}
              </motion.div>
            </motion.div>
          ))}
        </>
      )}

      <div className="absolute top-4 right-4 flex items-center gap-3 z-20">
          {hasMapPieces && (
            <motion.button
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setUseExpandedMap(!useExpandedMap)}
              className={`w-14 h-14 rounded-full flex items-center justify-center shadow-xl border-4 transition-colors ${
                useExpandedMap 
                  ? 'bg-gradient-to-br from-emerald-400 to-emerald-600 border-emerald-300'
                  : 'bg-gradient-to-br from-blue-400 to-blue-600 border-blue-300'
              }`}
              title={useExpandedMap ? 'Show Zone View' : 'Show Full Map'}
            >
              <MapIcon size={28} color="#fff" />
            </motion.button>
          )}
          
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowMapBuilder(true)}
            className="w-14 h-14 bg-gradient-to-br from-cyan-500 to-cyan-700 rounded-full flex items-center justify-center shadow-xl border-4 border-cyan-400"
            title="World Map Builder (M)"
          >
            <Edit3 size={28} color="#fff" />
          </motion.button>
          
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

      <AnimatePresence>
        {showSettings && (
          <SettingsModal onClose={() => setShowSettings(false)} />
        )}
        {showMapBuilder && (
          <MapBuilder onClose={() => setShowMapBuilder(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}
