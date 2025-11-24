import { useEffect } from 'react';
import { useGameStore } from '../store/gameStore';
import LoadingScreen from './screens/LoadingScreen';
import DialogueScreen from './screens/DialogueScreen';
import MapScreen from './screens/MapScreen';
import GardenScreen from './screens/GardenScreen';
import MergeBoardScreen from './screens/MergeBoardScreen';

export default function MergeGarden() {
  const currentScreen = useGameStore((state) => state.currentScreen);

  useEffect(() => {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);

    const handleResize = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-emerald-50 overflow-hidden" style={{ height: 'calc(var(--vh, 1vh) * 100)' }}>
      {currentScreen === 'loading' && <LoadingScreen />}
      {currentScreen === 'dialogue' && <DialogueScreen />}
      {currentScreen === 'map' && <MapScreen />}
      {currentScreen === 'garden' && <GardenScreen />}
      {currentScreen === 'merge_board' && <MergeBoardScreen />}
    </div>
  );
}
