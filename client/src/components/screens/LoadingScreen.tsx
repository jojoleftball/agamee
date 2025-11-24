import { useEffect, useState } from 'react';
import { useGameStore } from '../../store/gameStore';

export default function LoadingScreen() {
  const [progress, setProgress] = useState(0);
  const setScreen = useGameStore((state) => state.setScreen);
  const initializeGame = useGameStore((state) => state.initializeGame);

  useEffect(() => {
    const duration = 2000;
    const startTime = Date.now();

    const updateProgress = () => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min((elapsed / duration) * 100, 100);
      
      setProgress(newProgress);

      if (newProgress < 100) {
        requestAnimationFrame(updateProgress);
      } else {
        setTimeout(() => {
          initializeGame();
          setScreen('dialogue');
        }, 500);
      }
    };

    requestAnimationFrame(updateProgress);
  }, [setScreen, initializeGame]);

  return (
    <div className="fixed inset-0 bg-gradient-to-b from-green-400 via-emerald-500 to-green-600 flex flex-col items-center justify-center p-4">
      <div className="text-center mb-8">
        <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg">
          Merge Garden
        </h1>
        <p className="text-lg text-white/90">
          Growing your adventure...
        </p>
      </div>

      <div className="mb-8 animate-spin-slow">
        <div className="w-20 h-20 text-white">
          <svg viewBox="0 0 100 100" fill="currentColor">
            <path d="M50 10 L60 30 L80 30 L65 45 L70 65 L50 52 L30 65 L35 45 L20 30 L40 30 Z" />
            <circle cx="50" cy="30" r="8" fill="#FFF" />
          </svg>
        </div>
      </div>

      <div className="w-full max-w-md px-4">
        <div className="relative h-6 bg-white/20 rounded-full overflow-hidden backdrop-blur-sm border-2 border-white/30">
          <div 
            className="h-full bg-gradient-to-r from-yellow-300 via-yellow-400 to-yellow-500 transition-all duration-300 ease-out relative"
            style={{ width: `${progress}%` }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/30 to-white/60" />
            <div className="absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent via-white/40 to-transparent" />
          </div>
        </div>
        <p className="text-center text-white mt-2 text-sm">
          {Math.floor(progress)}%
        </p>
      </div>
    </div>
  );
}
