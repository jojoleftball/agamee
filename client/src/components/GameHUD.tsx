import { useMergeGame } from '@/lib/stores/useMergeGame';

interface GameHUDProps {
  onMenuClick?: () => void;
}

export default function GameHUD({ onMenuClick }: GameHUDProps) {
  const { energy, maxEnergy, coins } = useMergeGame();
  const energyPercent = (energy / maxEnergy) * 100;

  return (
    <div className="absolute top-0 left-0 right-0 z-50 pointer-events-none">
      <div className="relative h-16 bg-gradient-to-b from-amber-900/90 via-amber-800/80 to-transparent">
        <div className="flex items-center justify-between h-full px-4">
          <div className="flex items-center gap-3 pointer-events-auto">
            <div className="flex items-center gap-2 bg-gradient-to-r from-yellow-600 to-yellow-500 px-4 py-2 rounded-full shadow-lg border-2 border-yellow-400">
              <div className="w-6 h-6 rounded-full bg-yellow-300 flex items-center justify-center text-sm font-bold shadow-inner">
                $
              </div>
              <span className="text-white font-bold text-lg drop-shadow-md">{coins}</span>
            </div>
            
            <div className="bg-gradient-to-r from-blue-600 to-blue-500 px-4 py-2 rounded-full shadow-lg border-2 border-blue-400 min-w-[140px]">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-blue-300 flex items-center justify-center shadow-inner">
                  <svg className="w-4 h-4 text-blue-700" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1h4v1a2 2 0 11-4 0zM12 14c.015-.34.208-.646.477-.859a4 4 0 10-4.954 0c.27.213.462.519.477.859h4z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-1">
                    <div className="flex-1 h-2 bg-blue-900/50 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-cyan-400 to-blue-300 transition-all duration-300"
                        style={{ width: `${energyPercent}%` }}
                      />
                    </div>
                    <span className="text-white font-bold text-xs drop-shadow-md">{energy}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {onMenuClick && (
            <button
              onClick={onMenuClick}
              className="pointer-events-auto bg-gradient-to-r from-red-600 to-red-500 px-4 py-2 rounded-full shadow-lg border-2 border-red-400 text-white font-bold hover:scale-105 transition-transform"
            >
              Menu
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
