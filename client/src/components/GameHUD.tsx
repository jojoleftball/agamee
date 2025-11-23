import { useMergeGameStore } from '@/lib/stores/useMergeGameStore';
import { useAudio } from '@/lib/stores/useAudio';
import { Menu, ShoppingBag, ListTodo, Map, Volume2, VolumeX, Zap, RefreshCw } from 'lucide-react';
import { Button } from './ui/button';

interface GameHUDProps {
  onOpenTasks: () => void;
  onOpenShop: () => void;
  onOpenBiomes: () => void;
}

export default function GameHUD({ onOpenTasks, onOpenShop, onOpenBiomes }: GameHUDProps) {
  const { energy, maxEnergy, coins, gems, level, xp, refillEnergyWithGems } = useMergeGameStore();
  const { isMuted, toggleMute } = useAudio();
  
  const energyPercent = (energy / maxEnergy) * 100;
  const xpForNextLevel = level * 100;
  const xpPercent = (xp / xpForNextLevel) * 100;

  const handleEnergyRefill = () => {
    if (energy < maxEnergy) {
      const success = refillEnergyWithGems();
      if (!success) {
        alert('Not enough gems! Need 10 gems to refill energy.');
      }
    }
  };

  return (
    <div className="absolute top-0 left-0 right-0 z-50 pointer-events-none">
      <div className="relative bg-gradient-to-b from-amber-900/95 via-amber-800/90 to-transparent pb-4">
        {/* Top Row - Resources */}
        <div className="flex items-center justify-between px-4 py-2">
          {/* Left Side - Currencies */}
          <div className="flex items-center gap-2 pointer-events-auto">
            {/* Coins */}
            <div className="flex items-center gap-2 bg-gradient-to-r from-yellow-600 to-yellow-500 px-3 py-1.5 rounded-full shadow-lg border-2 border-yellow-400">
              <div className="w-5 h-5 rounded-full bg-yellow-300 flex items-center justify-center text-xs font-bold shadow-inner">
                $
              </div>
              <span className="text-white font-bold text-sm drop-shadow-md">{coins}</span>
            </div>
            
            {/* Gems */}
            <div className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-purple-500 px-3 py-1.5 rounded-full shadow-lg border-2 border-purple-400">
              <div className="w-5 h-5 rounded-full bg-purple-300 flex items-center justify-center shadow-inner">
                <svg className="w-3 h-3 text-purple-700" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 2L2 7l8 5 8-5-8-5zM2 13l8 5 8-5M2 17l8 5 8-5" />
                </svg>
              </div>
              <span className="text-white font-bold text-sm drop-shadow-md">{gems}</span>
            </div>
          </div>

          {/* Right Side - Level & Menu */}
          <div className="flex items-center gap-2 pointer-events-auto">
            {/* Level */}
            <div className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-emerald-500 px-3 py-1.5 rounded-full shadow-lg border-2 border-emerald-400">
              <span className="text-white font-bold text-xs drop-shadow-md">LVL</span>
              <span className="text-white font-bold text-sm drop-shadow-md">{level}</span>
            </div>
            
            <Button
              onClick={toggleMute}
              size="icon"
              className="bg-white/90 hover:bg-white shadow-lg rounded-xl w-8 h-8"
            >
              {isMuted ? (
                <VolumeX className="w-4 h-4 text-gray-700" />
              ) : (
                <Volume2 className="w-4 h-4 text-gray-700" />
              )}
            </Button>
          </div>
        </div>

        {/* Second Row - Energy and XP */}
        <div className="px-4 flex flex-col gap-1.5">
          {/* Energy Bar */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-500 px-3 py-2 rounded-full shadow-lg border-2 border-blue-400 pointer-events-auto">
            <div className="flex items-center gap-2">
              <button
                onClick={handleEnergyRefill}
                className="w-6 h-6 rounded-full bg-blue-300 flex items-center justify-center shadow-inner hover:bg-blue-200 transition-colors"
                title="Refill energy (20 gems)"
              >
                <RefreshCw className="w-3.5 h-3.5 text-blue-700" />
              </button>
              
              <div className="flex-1">
                <div className="flex items-center justify-between mb-0.5">
                  <span className="text-white text-xs font-bold drop-shadow-md">Energy</span>
                  <span className="text-white font-bold text-xs drop-shadow-md">{energy}/{maxEnergy}</span>
                </div>
                <div className="h-2 bg-blue-900/50 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-cyan-400 to-blue-300 transition-all duration-300"
                    style={{ width: `${energyPercent}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* XP Bar */}
          <div className="bg-gradient-to-r from-amber-600 to-amber-500 px-3 py-2 rounded-full shadow-lg border-2 border-amber-400 pointer-events-auto">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-amber-300 flex items-center justify-center shadow-inner">
                <Zap className="w-3.5 h-3.5 text-amber-700" />
              </div>
              
              <div className="flex-1">
                <div className="flex items-center justify-between mb-0.5">
                  <span className="text-white text-xs font-bold drop-shadow-md">Experience</span>
                  <span className="text-white font-bold text-xs drop-shadow-md">{Math.floor(xpPercent)}%</span>
                </div>
                <div className="h-2 bg-amber-900/50 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-yellow-400 to-amber-300 transition-all duration-300"
                    style={{ width: `${xpPercent}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-2 mt-2 pointer-events-auto">
            <Button
              onClick={onOpenTasks}
              className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold py-3 rounded-xl shadow-lg"
            >
              <ListTodo className="w-4 h-4 mr-1" />
              Tasks
            </Button>
            <Button
              onClick={onOpenShop}
              className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-3 rounded-xl shadow-lg"
            >
              <ShoppingBag className="w-4 h-4 mr-1" />
              Shop
            </Button>
            <Button
              onClick={onOpenBiomes}
              className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-3 rounded-xl shadow-lg"
            >
              <Map className="w-4 h-4 mr-1" />
              Gardens
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
