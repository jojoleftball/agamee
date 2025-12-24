import { useState } from 'react';
import { useMergeGameStore } from '@/lib/stores/useMergeGameStore';
import MergeBoard from './MergeBoard';
import GameHUD from './GameHUD';
import TasksPanel from './TasksPanel';
import ShopModal from './ShopModal';
import ChestPanel from './ChestPanel';
import GardenWorldMap from './GardenWorldMap';
import PlantingGround from './PlantingGround';
import { Map, Grid3x3, Sprout } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const BACKGROUND_MAP: Record<string, string> = {
  basic: '/game-assets/middle-garden-view.jpg',
  tropical: '/game-assets/tropical_garden_background_vertical.png',
  zen: '/game-assets/zen_garden_background_vertical.png',
  desert: '/game-assets/desert_garden_background_vertical.png',
  winter: '/game-assets/winter_garden_background_vertical.png'
};

type GameView = 'merge' | 'planting' | 'map';

export default function MobileGame() {
  const { currentBiome, switchBiome } = useMergeGameStore();
  const [showTasks, setShowTasks] = useState(false);
  const [showShop, setShowShop] = useState(false);
  const [showChests, setShowChests] = useState(false);
  const [currentView, setCurrentView] = useState<GameView>('merge');

  const backgroundImage = BACKGROUND_MAP[currentBiome] || BACKGROUND_MAP.basic;

  const handleGardenSelect = (gardenId: string) => {
    switchBiome(gardenId);
    setCurrentView('merge');
  };

  const handleOpenMap = () => {
    setCurrentView('map');
  };

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
        bottom: 0
      }}
    >
      <AnimatePresence mode="wait">
        {currentView === 'map' ? (
          <GardenWorldMap 
            key="map"
            onGardenSelect={handleGardenSelect}
            onClose={() => setCurrentView('merge')}
          />
        ) : (
          <motion.div
            key="game"
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
                backgroundRepeat: 'no-repeat'
              }}
            >
              <div className="absolute inset-0 bg-black/10" />
            </motion.div>
            
            <div className="relative h-full flex flex-col">
              <GameHUD 
                onOpenTasks={() => setShowTasks(true)}
                onOpenShop={() => setShowShop(true)}
                onOpenBiomes={handleOpenMap}
                onOpenChests={() => setShowChests(true)}
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
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleOpenMap}
                  className="px-6 py-3 rounded-2xl font-bold text-white shadow-lg transition-all flex items-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
                >
                  <Map className="w-5 h-5" />
                  Map
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
              {showChests && (
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChestPanel onClose={() => setShowChests(false)} />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
