import { useMergeGameStore } from '@/lib/stores/useMergeGameStore';
import { useAudio } from '@/lib/stores/useAudio';
import { Volume2, VolumeX, RefreshCw } from 'lucide-react';
import { Button } from './ui/button';

interface GameHUDProps {
  onOpenTasks: () => void;
  onOpenShop: () => void;
  onOpenBiomes: () => void;
}

export default function GameHUD({ onOpenTasks, onOpenShop, onOpenBiomes }: GameHUDProps) {
  const { energy, maxEnergy, level, refillEnergyWithGems } = useMergeGameStore();
  const { isMuted, toggleMute } = useAudio();
  
  const energyPercent = (energy / maxEnergy) * 100;

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
        <div className="flex items-start justify-between px-2 sm:px-4 py-2 gap-2">
          <div className="flex flex-col gap-2 pointer-events-auto flex-1">
            <div className="bg-emerald-600 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full shadow-lg border-2 border-emerald-400 w-fit">
              <span className="text-white font-bold text-xs sm:text-sm drop-shadow-md">Level {level}</span>
            </div>
          </div>

          <div className="flex flex-col gap-2 items-end pointer-events-auto">
            <Button
              onClick={toggleMute}
              size="icon"
              className="bg-white/90 hover:bg-white shadow-lg rounded-xl w-8 h-8 sm:w-10 sm:h-10"
            >
              {isMuted ? (
                <VolumeX className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700" />
              ) : (
                <Volume2 className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700" />
              )}
            </Button>
          </div>
        </div>

        <div className="px-2 sm:px-4 flex flex-col gap-2 mt-1">
          <div 
            className="relative h-10 sm:h-12 flex items-center px-4 sm:px-6 pointer-events-auto"
            style={{
              backgroundImage: 'url(/game-assets/garden_energy_bar_frame.png)',
              backgroundSize: '100% 100%',
              backgroundRepeat: 'no-repeat'
            }}
          >
            <button
              onClick={handleEnergyRefill}
              className="absolute left-1.5 sm:left-2 w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-blue-400/80 flex items-center justify-center shadow-md hover:bg-blue-300 transition-colors border-2 border-blue-600"
              title="Refill energy (20 gems)"
            >
              <RefreshCw className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
            </button>
            
            <div className="flex-1 ml-6 sm:ml-8">
              <div className="flex items-center justify-between mb-0.5 sm:mb-1">
                <span className="text-white text-[10px] sm:text-xs font-bold drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">Energy</span>
                <span className="text-white font-bold text-[10px] sm:text-xs drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">{energy}/{maxEnergy}</span>
              </div>
              <div className="h-2 sm:h-2.5 bg-blue-900/60 rounded-full overflow-hidden border border-blue-800">
                <div 
                  className="h-full bg-gradient-to-r from-cyan-400 to-blue-400 transition-all duration-300 shadow-inner"
                  style={{ width: `${energyPercent}%` }}
                />
              </div>
            </div>
          </div>

          <div className="flex gap-1.5 sm:gap-2 pointer-events-auto">
            <button
              onClick={onOpenTasks}
              className="flex-1 relative h-10 sm:h-12 flex items-center justify-center font-bold text-white text-xs sm:text-sm drop-shadow-md transition-transform active:scale-95"
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
              className="flex-1 relative h-10 sm:h-12 flex items-center justify-center font-bold text-white text-xs sm:text-sm drop-shadow-md transition-transform active:scale-95"
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
              className="flex-1 relative h-10 sm:h-12 flex items-center justify-center font-bold text-white text-xs sm:text-sm drop-shadow-md transition-transform active:scale-95"
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
