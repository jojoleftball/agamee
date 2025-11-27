import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useSettingsStore } from '@/lib/stores/useSettingsStore';
import LoadingScreen from './LoadingScreen';
import IntroDialogueScreen from './IntroDialogueScreen';
import WorldMapScreen from './WorldMapScreen';
import SettingsModal from './SettingsModal';
import { SettingsFlowerIcon, BackArrowIcon } from '../icons/GardenIcons';

type GamePhase = 'loading' | 'intro' | 'map' | 'playing';

const BACKGROUND_MAP: Record<string, string> = {
  main: '/game-assets/middle-garden-view.jpg',
  basic: '/game-assets/middle-garden-view.jpg',
};

export default function GameFlow() {
  const hasSeenIntro = useSettingsStore((state) => state.hasSeenIntro);
  const [phase, setPhase] = useState<GamePhase>('loading');
  const [currentGarden, setCurrentGarden] = useState('main');
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
    setCurrentGarden(gardenId);
    setPhase('playing');
  };

  const handleBackToMap = () => {
    setPhase('map');
  };

  const backgroundImage = BACKGROUND_MAP[currentGarden] || BACKGROUND_MAP.basic;

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
              <div className="absolute top-4 left-4 z-40">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleBackToMap}
                  className="w-12 h-12 bg-gradient-to-br from-slate-600 to-slate-800 rounded-full flex items-center justify-center shadow-xl border-2 border-slate-500"
                >
                  <BackArrowIcon size={24} color="#fff" />
                </motion.button>
              </div>

              <div className="absolute top-4 right-4 z-40">
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 15 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowSettings(true)}
                  className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center shadow-xl border-2 border-amber-300"
                >
                  <SettingsFlowerIcon size={28} color="#fff" />
                </motion.button>
              </div>
            </div>

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
