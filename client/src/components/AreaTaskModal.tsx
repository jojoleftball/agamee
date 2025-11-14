import { useState } from 'react';
import { BeachHouseArea } from '@/lib/stores/useBeachHouseStore';
import { useBeachHouseStore } from '@/lib/stores/useBeachHouseStore';
import { useMergeGame } from '@/lib/stores/useMergeGame';
import { Button } from '@/components/ui/button';
import { X, Sparkles, Hammer, Wrench, Brush } from 'lucide-react';

interface AreaTaskModalProps {
  area: BeachHouseArea;
  onClose: () => void;
  onStartMerge: () => void;
}

const TASK_ICONS = [Hammer, Brush, Wrench, Sparkles];

export default function AreaTaskModal({ area, onClose, onStartMerge }: AreaTaskModalProps) {
  const { completeTask } = useBeachHouseStore();
  const { addCoins, spendEnergy } = useMergeGame();
  const [animating, setAnimating] = useState(false);

  const handleCompleteTask = () => {
    if (!spendEnergy(10)) {
      alert('Not enough energy! Wait for it to regenerate.');
      return;
    }

    setAnimating(true);
    
    setTimeout(() => {
      completeTask(area.id);
      
      if (area.completedTasks + 1 >= area.cleaningTasks) {
        addCoins(area.rewards.coins);
      }
      
      setAnimating(false);
    }, 1000);
  };

  const remainingTasks = area.cleaningTasks - area.completedTasks;
  const Icon = TASK_ICONS[area.completedTasks % TASK_ICONS.length];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-b from-white to-blue-50 rounded-2xl max-w-md w-full shadow-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1 hover:bg-white/20 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          
          <h2 className="text-2xl font-bold mb-2">{area.name}</h2>
          <p className="text-blue-100 text-sm">
            Clean and repair this area to restore the beach house
          </p>
        </div>

        <div className="p-6">
          <div className="bg-white rounded-xl p-4 mb-4 border-2 border-blue-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-3 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full">
                <Icon className="w-6 h-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <div className="text-sm text-gray-600">Progress</div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-blue-500 to-green-500 transition-all duration-500"
                      style={{ width: `${(area.completedTasks / area.cleaningTasks) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-bold text-gray-800">
                    {area.completedTasks}/{area.cleaningTasks}
                  </span>
                </div>
              </div>
            </div>

            {remainingTasks > 0 && (
              <div className="bg-amber-50 border-2 border-amber-300 rounded-lg p-3">
                <p className="text-sm text-amber-900 font-bold">
                  {remainingTasks} task{remainingTasks > 1 ? 's' : ''} remaining
                </p>
                <p className="text-xs text-amber-700 mt-1">
                  Each task costs 10 energy
                </p>
              </div>
            )}
          </div>

          {remainingTasks === 0 ? (
            <div className="text-center py-6">
              <div className="inline-block p-4 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full mb-3 shadow-lg">
                <Sparkles className="w-12 h-12 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                Area Complete!
              </h3>
              <p className="text-lg text-green-600 font-bold mb-4">
                +{area.rewards.coins} Coins
              </p>
              <Button
                onClick={onClose}
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold px-8 py-3"
              >
                Continue
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              <Button
                onClick={handleCompleteTask}
                disabled={animating}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 py-6 text-lg font-bold shadow-lg"
              >
                {animating ? (
                  <span className="flex items-center justify-center gap-2">
                    <Sparkles className="w-5 h-5 animate-spin" />
                    Working...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <Hammer className="w-5 h-5" />
                    Complete Task (-10 Energy)
                  </span>
                )}
              </Button>

              <Button
                onClick={onStartMerge}
                variant="outline"
                className="w-full border-2 border-purple-400 hover:bg-purple-50 py-4 font-semibold"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Go to Merge Board
              </Button>

              <p className="text-xs text-gray-600 text-center mt-2">
                Merge items to unlock special tools!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
