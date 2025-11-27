import { X, Check } from 'lucide-react';
import { TaskScrollIcon, SellCoinIcon, GemIcon, StarXPIcon } from '../icons/GardenIcons';
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
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-b from-yellow-50 to-amber-50 rounded-3xl shadow-2xl w-full max-w-md max-h-[80vh] overflow-hidden border-4 border-yellow-600">
        <div className="bg-gradient-to-r from-yellow-500 to-amber-500 p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <TaskScrollIcon size={32} />
            <h2 className="text-2xl font-bold text-white drop-shadow">Garden Tasks</h2>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
          >
            <X className="w-6 h-6 text-white" />
          </button>
        </div>

        <div className="p-4 overflow-y-auto max-h-[60vh]">
          <div className="space-y-3">
            {displayTasks.map((task) => (
              <div
                key={task.id}
                className={`p-4 rounded-xl border-2 transition-all ${
                  task.completed
                    ? 'bg-green-50 border-green-300'
                    : 'bg-white border-yellow-300'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    task.completed
                      ? 'bg-green-500'
                      : 'bg-yellow-100 border-2 border-yellow-300'
                  }`}>
                    {task.completed ? (
                      <Check className="w-5 h-5 text-white" />
                    ) : (
                      <span className="text-yellow-600 font-bold">
                        {task.currentCount}/{task.goalCount}
                      </span>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className={`font-bold ${task.completed ? 'text-green-700' : 'text-gray-800'}`}>
                      {task.title}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                    
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs text-gray-500">Rewards:</span>
                      {task.rewards.coins && (
                        <div className="flex items-center gap-1 bg-yellow-100 px-2 py-1 rounded-full">
                          <SellCoinIcon size={14} />
                          <span className="text-xs font-bold text-yellow-700">{task.rewards.coins}</span>
                        </div>
                      )}
                      {task.rewards.gems && (
                        <div className="flex items-center gap-1 bg-purple-100 px-2 py-1 rounded-full">
                          <GemIcon size={12} />
                          <span className="text-xs font-bold text-purple-700">{task.rewards.gems}</span>
                        </div>
                      )}
                      {task.rewards.xp && (
                        <div className="flex items-center gap-1 bg-blue-100 px-2 py-1 rounded-full">
                          <StarXPIcon size={12} />
                          <span className="text-xs font-bold text-blue-700">{task.rewards.xp} XP</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {!task.completed && (
                  <div className="mt-3">
                    <div className="w-full h-2 bg-yellow-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-yellow-400 to-amber-500 transition-all"
                        style={{ width: `${(task.currentCount / task.goalCount) * 100}%` }}
                      />
                    </div>
                  </div>
                )}

                {task.currentCount >= task.goalCount && !task.completed && (
                  <button
                    onClick={() => handleClaimReward(task)}
                    className="w-full mt-3 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg font-bold hover:from-green-600 hover:to-green-700 active:scale-95 transition-all"
                  >
                    Claim Reward
                  </button>
                )}
              </div>
            ))}
          </div>

          {displayTasks.length === 0 && (
            <div className="text-center py-8">
              <TaskScrollIcon size={64} className="mx-auto opacity-50" />
              <p className="text-gray-500 mt-4">No tasks available yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}