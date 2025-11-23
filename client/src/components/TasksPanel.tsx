import { useMergeGameStore } from '@/lib/stores/useMergeGameStore';
import { Button } from './ui/button';
import { X, Check, Circle } from 'lucide-react';
import { MERGE_ITEMS } from '@/lib/mergeData';

interface TasksPanelProps {
  onClose: () => void;
}

export default function TasksPanel({ onClose }: TasksPanelProps) {
  const { tasks, checkTaskCompletion, completeTask } = useMergeGameStore();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full max-h-[80vh] overflow-hidden flex flex-col">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">Garden Tasks</h2>
          <Button
            onClick={onClose}
            size="icon"
            className="bg-white/20 hover:bg-white/30 text-white rounded-full"
          >
            <X className="w-6 h-6" />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {tasks.map((task) => {
            const canComplete = checkTaskCompletion(task.id);
            const isCompleted = task.completed;

            return (
              <div
                key={task.id}
                className={`p-4 rounded-xl border-2 ${
                  isCompleted
                    ? 'bg-green-50 border-green-300'
                    : canComplete
                    ? 'bg-yellow-50 border-yellow-300'
                    : 'bg-gray-50 border-gray-200'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-gray-800">{task.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                  </div>
                  {isCompleted ? (
                    <Check className="w-6 h-6 text-green-500 flex-shrink-0 ml-2" />
                  ) : (
                    <Circle className="w-6 h-6 text-gray-400 flex-shrink-0 ml-2" />
                  )}
                </div>

                {task.requiredItems.length > 0 && (
                  <div className="mt-3 space-y-1">
                    {task.requiredItems.map((req) => {
                      const itemData = MERGE_ITEMS[req.itemType];
                      return (
                        <div key={req.itemType} className="text-sm text-gray-700">
                          {itemData?.name} x{req.count}
                        </div>
                      );
                    })}
                  </div>
                )}

                <div className="mt-3 flex flex-wrap gap-2">
                  {task.rewards.coins && (
                    <div className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full font-semibold">
                      +{task.rewards.coins} Coins
                    </div>
                  )}
                  {task.rewards.gems && (
                    <div className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full font-semibold">
                      +{task.rewards.gems} Gems
                    </div>
                  )}
                  {task.rewards.energy && (
                    <div className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full font-semibold">
                      +{task.rewards.energy} Energy
                    </div>
                  )}
                  {task.rewards.xp && (
                    <div className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full font-semibold">
                      +{task.rewards.xp} XP
                    </div>
                  )}
                </div>

                {canComplete && !isCompleted && (
                  <Button
                    onClick={() => completeTask(task.id)}
                    className="w-full mt-4 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-3 rounded-xl"
                  >
                    Complete Task
                  </Button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
