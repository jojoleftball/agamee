import { useEffect, useState } from 'react';

interface SimpleLoadingScreenProps {
  onLoadComplete: () => void;
}

export default function SimpleLoadingScreen({ onLoadComplete }: SimpleLoadingScreenProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => onLoadComplete(), 300);
          return 100;
        }
        return prev + 10;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [onLoadComplete]);

  return (
    <div className="fixed inset-0 bg-gradient-to-b from-green-400 via-emerald-500 to-green-600 flex flex-col items-center justify-center overflow-hidden">
      <div className="text-center mb-12 animate-fade-in">
        <h1 className="text-7xl font-bold text-white mb-4 drop-shadow-2xl">
          Merge Garden
        </h1>
        <p className="text-2xl text-green-100 drop-shadow-lg">
          Restore Your Dream Garden
        </p>
      </div>

      <div className="w-full max-w-md px-8">
        <div className="relative h-12 bg-white/20 rounded-full overflow-hidden border-4 border-white/40 shadow-2xl backdrop-blur-sm">
          <div
            className="h-full bg-gradient-to-r from-yellow-400 via-amber-400 to-orange-400 transition-all duration-300 ease-out relative overflow-hidden"
            style={{ width: `${progress}%` }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/30 to-white/60"></div>
            <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.4),transparent)] animate-shimmer"></div>
          </div>
        </div>

        <div className="text-center mt-4">
          <span className="text-xl font-bold text-white drop-shadow-lg">
            {progress}%
          </span>
        </div>
      </div>

      <div className="absolute bottom-8 text-center">
        <p className="text-white/80 text-sm">
          Planting seeds of fun...
        </p>
      </div>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }

        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }

        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
      `}</style>
    </div>
  );
}
