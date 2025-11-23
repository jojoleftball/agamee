import { useMergeGameStore } from '@/lib/stores/useMergeGameStore';
import { useAudio } from '@/lib/stores/useAudio';
import { Volume2, VolumeX, RefreshCw, Zap } from 'lucide-react';
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
      <div className="relative pb-2">
        <div className="flex items-start justify-between px-2 py-2 gap-2">
          <div className="flex flex-col gap-2 pointer-events-auto flex-1">
            <div 
              className="relative h-14 flex items-center px-4"
              style={{
                backgroundImage: 'url(/game-assets/garden_coin_counter_banner.png)',
                backgroundSize: 'contain',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'left center',
                minWidth: '160px',
                maxWidth: '200px'
              }}
            >
              <span className="text-amber-900 font-bold text-base drop-shadow-[0_2px_2px_rgba(255,255,255,0.8)] ml-8">
                {coins.toLocaleString()}
              </span>
            </div>

            <div 
              className="relative h-14 flex items-center px-4"
              style={{
                backgroundImage: 'url(/game-assets/garden_gem_counter_banner.png)',
                backgroundSize: 'contain',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'left center',
                minWidth: '160px',
                maxWidth: '200px'
              }}
            >
              <span className="text-purple-900 font-bold text-base drop-shadow-[0_2px_2px_rgba(255,255,255,0.8)] ml-8">
                {gems}
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-2 items-end pointer-events-auto">
            <div className="bg-emerald-600 px-4 py-2 rounded-full shadow-lg border-2 border-emerald-400">
              <span className="text-white font-bold text-sm drop-shadow-md">Level {level}</span>
            </div>
            
            <Button
              onClick={toggleMute}
              size="icon"
              className="bg-white/90 hover:bg-white shadow-lg rounded-xl w-10 h-10"
            >
              {isMuted ? (
                <VolumeX className="w-5 h-5 text-gray-700" />
              ) : (
                <Volume2 className="w-5 h-5 text-gray-700" />
              )}
            </Button>
          </div>
        </div>

        <div className="px-2 flex flex-col gap-2 mt-1">
          <div 
            className="relative h-12 flex items-center px-6 pointer-events-auto"
            style={{
              backgroundImage: 'url(/game-assets/garden_energy_bar_frame.png)',
              backgroundSize: '100% 100%',
              backgroundRepeat: 'no-repeat'
            }}
          >
            <button
              onClick={handleEnergyRefill}
              className="absolute left-2 w-8 h-8 rounded-full bg-blue-400/80 flex items-center justify-center shadow-md hover:bg-blue-300 transition-colors border-2 border-blue-600"
              title="Refill energy (20 gems)"
            >
              <RefreshCw className="w-4 h-4 text-white" />
            </button>
            
            <div className="flex-1 ml-8">
              <div className="flex items-center justify-between mb-1">
                <span className="text-white text-xs font-bold drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">Energy</span>
                <span className="text-white font-bold text-xs drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">{energy}/{maxEnergy}</span>
              </div>
              <div className="h-2.5 bg-blue-900/60 rounded-full overflow-hidden border border-blue-800">
                <div 
                  className="h-full bg-gradient-to-r from-cyan-400 to-blue-400 transition-all duration-300 shadow-inner"
                  style={{ width: `${energyPercent}%` }}
                />
              </div>
            </div>
          </div>

          <div 
            className="relative h-12 flex items-center px-6 pointer-events-auto"
            style={{
              backgroundImage: 'url(/game-assets/garden_xp_bar_frame.png)',
              backgroundSize: '100% 100%',
              backgroundRepeat: 'no-repeat'
            }}
          >
            <div className="absolute left-2 w-8 h-8 rounded-full bg-amber-400/80 flex items-center justify-center shadow-md border-2 border-amber-600">
              <Zap className="w-4 h-4 text-white" />
            </div>
            
            <div className="flex-1 ml-8">
              <div className="flex items-center justify-between mb-1">
                <span className="text-white text-xs font-bold drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">XP</span>
                <span className="text-white font-bold text-xs drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">{Math.floor(xpPercent)}%</span>
              </div>
              <div className="h-2.5 bg-amber-900/60 rounded-full overflow-hidden border border-amber-800">
                <div 
                  className="h-full bg-gradient-to-r from-yellow-400 to-amber-400 transition-all duration-300 shadow-inner"
                  style={{ width: `${xpPercent}%` }}
                />
              </div>
            </div>
          </div>

          <div className="flex gap-2 pointer-events-auto">
            <button
              onClick={onOpenTasks}
              className="flex-1 relative h-12 flex items-center justify-center font-bold text-white text-sm drop-shadow-md transition-transform active:scale-95"
              style={{
                backgroundImage: 'url(/game-assets/garden_ui_buttons_sprite_sheet.png)',
                backgroundSize: '300% 100%',
                backgroundPosition: '0% 0%',
                backgroundRepeat: 'no-repeat'
              }}
            >
              Tasks
            </button>
            <button
              onClick={onOpenShop}
              className="flex-1 relative h-12 flex items-center justify-center font-bold text-white text-sm drop-shadow-md transition-transform active:scale-95"
              style={{
                backgroundImage: 'url(/game-assets/garden_ui_buttons_sprite_sheet.png)',
                backgroundSize: '300% 100%',
                backgroundPosition: '50% 0%',
                backgroundRepeat: 'no-repeat'
              }}
            >
              Shop
            </button>
            <button
              onClick={onOpenBiomes}
              className="flex-1 relative h-12 flex items-center justify-center font-bold text-white text-sm drop-shadow-md transition-transform active:scale-95"
              style={{
                backgroundImage: 'url(/game-assets/garden_ui_buttons_sprite_sheet.png)',
                backgroundSize: '300% 100%',
                backgroundPosition: '100% 0%',
                backgroundRepeat: 'no-repeat'
              }}
            >
              Map
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
