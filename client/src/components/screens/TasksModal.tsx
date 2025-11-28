import { X, Check } from 'lucide-react';
import { TaskListIcon, SellCoinIcon, GemIcon, StarXPIcon, SproutIcon, CherryBlossomIcon, TulipIcon, SunflowerIcon } from '../icons/GardenIcons';
import { useGameStore } from '../../store/gameStore';
import type { Task } from '../../types/game';

interface TasksModalProps {
  onClose: () => void;
}

const SAMPLE_TASKS: Task[] = [
  {
    id: 'task-1',
    title: 'Grow a Rose',
    description: 'Merge roses until you reach rank 3',
    goalItemType: 'rose',
    goalRank: 3,
    goalCount: 1,
    currentCount: 0,
    rewards: { coins: 100, xp: 50 },
    completed: false,
  },
  {
    id: 'task-2',
    title: 'Collect Water Tools',
    description: 'Merge water buckets to rank 2',
    goalItemType: 'water_bucket',
    goalRank: 2,
    goalCount: 1,
    currentCount: 0,
    rewards: { coins: 75, xp: 30 },
    completed: false,
  },
  {
    id: 'task-3',
    title: 'Expand Your Garden',
    description: 'Plant 3 flowers in your garden',
    goalItemType: 'any_plant',
    goalRank: 1,
    goalCount: 3,
    currentCount: 0,
    rewards: { coins: 150, gems: 5, xp: 100 },
    completed: false,
  },
];

export default function TasksModal({ onClose }: TasksModalProps) {
  const tasks = useGameStore((state) => state.tasks);
  const completeTask = useGameStore((state) => state.completeTask);

  const displayTasks = tasks.length > 0 ? tasks : SAMPLE_TASKS;

  const handleClaimReward = (task: Task) => {
    if (task.completed || task.currentCount < task.goalCount) return;
    completeTask(task.id);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4">
      <div className="bg-gradient-to-b from-green-50 via-emerald-50 to-green-100 rounded-2xl sm:rounded-3xl shadow-2xl w-full max-w-md max-h-[90vh] sm:max-h-[80vh] overflow-hidden border-4 border-green-600 relative">
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-pink-400 via-yellow-300 to-pink-400" />
        
        <div className="bg-gradient-to-r from-green-600 via-emerald-500 to-green-600 p-3 sm:p-4 flex items-center justify-between relative overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-1 left-4"><CherryBlossomIcon size={20} /></div>
            <div className="absolute top-2 right-12"><TulipIcon size={20} /></div>
          </div>
          <div className="flex items-center gap-3 relative z-10">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-yellow-100 to-amber-200 rounded-xl flex items-center justify-center border-2 border-yellow-400 shadow-lg">
              <TaskListIcon size={28} />
            </div>
            <h2 className="text-lg sm:text-2xl font-bold text-white drop-shadow-lg">Garden Tasks</h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 sm:w-10 sm:h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-all hover:rotate-90 duration-300 relative z-10"
          >
            <X className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
          </button>
        </div>

        <div className="p-3 sm:p-4 overflow-y-auto max-h-[calc(90vh-80px)] sm:max-h-[60vh]">
          <div className="space-y-2 sm:space-y-3">
            {displayTasks.map((task) => (
              <div
                key={task.id}
                className={`p-3 sm:p-4 rounded-xl sm:rounded-2xl border-2 transition-all ${
                  task.completed
                    ? 'bg-gradient-to-br from-green-100 to-emerald-100 border-green-400'
                    : 'bg-white border-green-200'
                }`}
              >
                <div className="flex items-start gap-2 sm:gap-3">
                  <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                    task.completed
                      ? 'bg-gradient-to-br from-green-500 to-emerald-500 shadow-md'
                      : 'bg-gradient-to-br from-green-100 to-emerald-100 border-2 border-green-300'
                  }`}>
                    {task.completed ? (
                      <Check className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                    ) : (
                      <span className="text-green-600 font-bold text-xs sm:text-sm">
                        {task.currentCount}/{task.goalCount}
                      </span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className={`font-bold text-sm sm:text-base flex items-center gap-1 ${task.completed ? 'text-green-700' : 'text-green-800'}`}>
                      <SproutIcon size={16} />
                      <span className="truncate">{task.title}</span>
                    </h3>
                    <p className="text-xs sm:text-sm text-green-600 mt-0.5 sm:mt-1">{task.description}</p>
                    
                    <div className="flex items-center gap-1.5 sm:gap-2 mt-2 flex-wrap">
                      <span className="text-[10px] sm:text-xs text-green-500">Rewards:</span>
                      {task.rewards.coins && (
                        <div className="flex items-center gap-0.5 bg-gradient-to-r from-amber-100 to-yellow-100 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full border border-amber-300">
                          <SellCoinIcon size={14} />
                          <span className="text-[10px] sm:text-xs font-bold text-amber-700">{task.rewards.coins}</span>
                        </div>
                      )}
                      {task.rewards.gems && (
                        <div className="flex items-center gap-0.5 bg-gradient-to-r from-purple-100 to-pink-100 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full border border-purple-300">
                          <GemIcon size={14} />
                          <span className="text-[10px] sm:text-xs font-bold text-purple-700">{task.rewards.gems}</span>
                        </div>
                      )}
                      {task.rewards.xp && (
                        <div className="flex items-center gap-0.5 bg-gradient-to-r from-blue-100 to-cyan-100 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full border border-blue-300">
                          <StarXPIcon size={14} />
                          <span className="text-[10px] sm:text-xs font-bold text-blue-700">{task.rewards.xp}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {!task.completed && (
                  <div className="mt-2 sm:mt-3">
                    <div className="w-full h-1.5 sm:h-2 bg-green-100 rounded-full overflow-hidden border border-green-200">
                      <div
                        className="h-full bg-gradient-to-r from-green-400 via-emerald-400 to-green-500 transition-all"
                        style={{ width: `${(task.currentCount / task.goalCount) * 100}%` }}
                      />
                    </div>
                  </div>
                )}

                {task.currentCount >= task.goalCount && !task.completed && (
                  <button
                    onClick={() => handleClaimReward(task)}
                    className="w-full mt-2 sm:mt-3 py-2 sm:py-3 bg-gradient-to-r from-green-500 via-emerald-500 to-green-500 text-white rounded-xl font-bold text-sm sm:text-base hover:from-green-600 hover:via-emerald-600 hover:to-green-600 active:scale-[0.98] transition-all shadow-lg flex items-center justify-center gap-2"
                  >
                    <CherryBlossomIcon size={18} />
                    <span>Claim Reward</span>
                    <CherryBlossomIcon size={18} />
                  </button>
                )}
              </div>
            ))}
          </div>

          {displayTasks.length === 0 && (
            <div className="text-center py-6 sm:py-8">
              <div className="mb-3 sm:mb-4 flex justify-center"><SunflowerIcon size={64} /></div>
              <p className="text-green-600 text-sm sm:text-base">No garden tasks available yet</p>
              <p className="text-green-500 text-xs sm:text-sm mt-1">Check back soon for new tasks!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}