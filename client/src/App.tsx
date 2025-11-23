import { useEffect, useState } from 'react';
import '@fontsource/inter';
import { useMergeGameStore } from './lib/stores/useMergeGameStore';
import { soundManager } from './lib/sounds';
import MobileGame from './components/MobileGame';
import LoadingScreen from './components/LoadingScreen';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const initializeGame = useMergeGameStore((state) => state.initializeGame);
  const updateEnergy = useMergeGameStore((state) => state.updateEnergy);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      initializeGame();
    }, 1500);

    return () => clearTimeout(timer);
  }, [initializeGame]);

  useEffect(() => {
    const interval = setInterval(() => {
      updateEnergy();
    }, 30000);

    return () => clearInterval(interval);
  }, [updateEnergy]);

  useEffect(() => {
    const handleResize = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-gradient-to-b from-green-400 via-emerald-500 to-green-600 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl font-bold text-white mb-4 animate-bounce">
            Merge Garden
          </div>
          <div className="text-xl text-white/90">
            Loading your garden...
          </div>
          <div className="mt-8 flex justify-center gap-2">
            <div className="w-3 h-3 bg-white rounded-full animate-pulse" style={{ animationDelay: '0ms' }} />
            <div className="w-3 h-3 bg-white rounded-full animate-pulse" style={{ animationDelay: '150ms' }} />
            <div className="w-3 h-3 bg-white rounded-full animate-pulse" style={{ animationDelay: '300ms' }} />
          </div>
        </div>
      </div>
    );
  }

  return <MobileGame />;
}

export default App;
