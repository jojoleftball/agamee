import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useSettingsStore } from '@/lib/stores/useSettingsStore';
import { useMergeGameStore } from '@/lib/stores/useMergeGameStore';
import LoadingScreen from './LoadingScreen';
import IntroDialogueScreen from './IntroDialogueScreen';
import WorldMapScreen from './WorldMapScreen';
import MergeBoard from '../MergeBoard';
import GameHUD from '../GameHUD';
import PlantingGround from '../PlantingGround';
import TasksPanel from '../TasksPanel';
import ShopModal from '../ShopModal';
import SettingsModal from './SettingsModal';
import { SettingsFlowerIcon, MapPinIcon, BackArrowIcon } from '../icons/GardenIcons';
import { Grid3x3, Sprout } from 'lucide-react';

type GamePhase = 'loading' | 'intro' | 'map' | 'playing';
type GameView = 'merge' | 'planting';

const BACKGROUND_MAP: Record<string, string> = {
  main: '/game-assets/middle-garden-view.jpg',
  basic: '/game-assets/middle-garden-view.jpg',
  tropical: '/game-assets/tropical_garden_background_vertical.png',
  zen: '/game-assets/zen_garden_background_vertical.png',
  desert: '/game-assets/desert_garden_background_vertical.png',
  winter: '/game-assets/winter_garden_background_vertical.png',
};

export default function GameFlow() {
  const hasSeenIntro = useSettingsStore((state) => state.hasSeenIntro);
  const t = useSettingsStore((state) => state.t);
  const { currentBiome, switchBiome } = useMergeGameStore();
  
  const [phase, setPhase] = useState<GamePhase>('loading');
  const [currentView, setCurrentView] = useState<GameView>('merge');
  const [showTasks, setShowTasks] = useState(false);
  const [showShop, setShowShop] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const handleLoadComplete = () => {
    if (hasSeenIntro) {
      setPhase('map');
    } else {
      setPhase('intro');
    }
  };

  const handleIntroComplete = () => {
    setPhase('map');
  };

  const handleEnterGarden = (gardenId: string) => {
    switchBiome(gardenId === 'main' ? 'basic' : gardenId);
    setPhase('playing');
  };

  const handleBackToMap = () => {
    setPhase('map');
  };

  const backgroundImage = BACKGROUND_MAP[currentBiome] || BACKGROUND_MAP.basic;

  return (
    <div 
      className="fixed inset-0 w-full h-full overflow-hidden touch-none"
      style={{
        height: 'calc(var(--vh, 1vh) * 100)',
        width: '100vw',
        maxWidth: '100vw',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
      }}
    >
      <AnimatePresence mode="wait">
        {phase === 'loading' && (
          <motion.div
            key="loading"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0"
          >
            <LoadingScreen onLoadComplete={handleLoadComplete} />
          </motion.div>
        )}

        {phase === 'intro' && (
          <motion.div
            key="intro"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0"
          >
            <IntroDialogueScreen onComplete={handleIntroComplete} />
          </motion.div>
        )}

        {phase === 'map' && (
          <motion.div
            key="map"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0"
          >
            <WorldMapScreen onEnterGarden={handleEnterGarden} />
          </motion.div>
        )}

        {phase === 'playing' && (
          <motion.div
            key="playing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0"
          >
            <motion.div
              key={backgroundImage}
              initial={{ scale: 1.1, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0 w-full h-full"
              style={{
                backgroundImage: `url(${backgroundImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
              }}
            >
              <div className="absolute inset-0 bg-black/10" />
            </motion.div>

            <div className="relative h-full flex flex-col">
              <GameHUD
                onOpenTasks={() => setShowTasks(true)}
                onOpenShop={() => setShowShop(true)}
                onOpenBiomes={handleBackToMap}
              />

              <div className="flex-1 overflow-hidden relative">
                <AnimatePresence mode="wait">
                  {currentView === 'merge' ? (
                    <motion.div
                      key="merge"
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      exit={{ x: 20, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="absolute inset-0"
                    >
                      <MergeBoard />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="planting"
                      initial={{ x: 20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      exit={{ x: -20, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="absolute inset-0"
                    >
                      <PlantingGround />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="absolute top-4 right-4 flex gap-2 z-40">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleBackToMap}
                  className="w-12 h-12 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-full flex items-center justify-center shadow-xl border-3 border-blue-300"
                >
                  <MapPinIcon size={28} color="#fff" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 15 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowSettings(true)}
                  className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center shadow-xl border-3 border-amber-300"
                >
                  <SettingsFlowerIcon size={28} color="#fff" />
                </motion.button>
              </div>

              <motion.div
                initial={{ y: 100 }}
                animate={{ y: 0 }}
                transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
                className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 pointer-events-auto z-40"
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setCurrentView('merge')}
                  className={`px-6 py-3 rounded-2xl font-bold text-white shadow-lg transition-all flex items-center gap-2 ${
                    currentView === 'merge'
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 scale-105'
                      : 'bg-gray-700/90 hover:bg-gray-600/90'
                  }`}
                >
                  <Grid3x3 className="w-5 h-5" />
                  Merge
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setCurrentView('planting')}
                  className={`px-6 py-3 rounded-2xl font-bold text-white shadow-lg transition-all flex items-center gap-2 ${
                    currentView === 'planting'
                      ? 'bg-gradient-to-r from-green-600 to-emerald-600 scale-105'
                      : 'bg-gray-700/90 hover:bg-gray-600/90'
                  }`}
                >
                  <Sprout className="w-5 h-5" />
                  Plant
                </motion.button>
              </motion.div>
            </div>

            <AnimatePresence>
              {showTasks && (
                <motion.div
                  initial={{ x: '100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: '100%' }}
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                >
                  <TasksPanel onClose={() => setShowTasks(false)} />
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {showShop && (
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ShopModal onClose={() => setShowShop(false)} />
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {showSettings && (
                <SettingsModal onClose={() => setShowSettings(false)} />
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
