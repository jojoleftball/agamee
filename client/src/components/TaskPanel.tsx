import { useState } from 'react';
import { useTaskStore } from '@/lib/stores/useTaskStore';
import { useMergeGame } from '@/lib/stores/useMergeGame';
import { MERGE_ITEMS } from '@/lib/mergeItems';
import { X, Lock, CheckCircle, Circle, Star, ChevronDown, ChevronRight } from 'lucide-react';
import { Button } from './ui/button';

interface TaskPanelProps {
  onClose: () => void;
}

export default function TaskPanel({ onClose }: TaskPanelProps) {
  const { 
    getTaskAreas, 
    getCurrentTasks, 
    currentAreaId, 
    setCurrentArea,
    unlockArea,
    isAreaUnlocked,
    getAreaProgress
  } = useTaskStore();
  
  const { coins } = useMergeGame();
  const [expandedAreaId, setExpandedAreaId] = useState<string | null>(currentAreaId);
  
  const taskAreas = getTaskAreas();
  const currentTasks = getCurrentTasks();

  const handleUnlockArea = (areaId: string, cost: number) => {
    if (coins >= cost) {
      const success = unlockArea(areaId);
      if (success) {
        setCurrentArea(areaId);
        setExpandedAreaId(areaId);
      }
    } else {
      alert(`Need ${cost} coins to unlock this area! You have ${coins} coins.`);
    }
  };

  const toggleArea = (areaId: string) => {
    setExpandedAreaId(expandedAreaId === areaId ? null : areaId);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden border-4 border-amber-600">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-600 to-orange-500 px-6 py-4 flex items-center justify-between border-b-4 border-amber-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg">
              <Star className="w-6 h-6 text-amber-600" fill="currentColor" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white drop-shadow-lg">Beach House Tasks</h2>
              <p className="text-amber-100 text-sm">Complete tasks to renovate your home</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
          >
            <X className="w-6 h-6 text-white" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-120px)] p-6">
          <div className="space-y-4">
            {taskAreas.map((area) => {
              const isUnlocked = area.isUnlocked;
              const isExpanded = expandedAreaId === area.id;
              const progress = getAreaProgress(area.id);
              const isCompleted = area.completedTasks === area.totalTasks;

              return (
                <div 
                  key={area.id} 
                  className={`rounded-2xl border-4 overflow-hidden transition-all ${
                    isCompleted 
                      ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-500'
                      : isUnlocked 
                        ? 'bg-gradient-to-br from-white to-blue-50 border-blue-400'
                        : 'bg-gradient-to-br from-gray-100 to-gray-200 border-gray-400'
                  }`}
                >
                  {/* Area Header */}
                  <button
                    onClick={() => isUnlocked && toggleArea(area.id)}
                    className="w-full p-4 flex items-center justify-between hover:bg-white/30 transition-colors"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <div className={`text-4xl ${!isUnlocked && 'grayscale opacity-50'}`}>
                        {area.emoji}
                      </div>
                      
                      <div className="flex-1 text-left">
                        <div className="flex items-center gap-2">
                          <h3 className="text-xl font-bold text-gray-800">{area.name}</h3>
                          {!isUnlocked && (
                            <Lock className="w-4 h-4 text-gray-500" />
                          )}
                          {isCompleted && (
                            <CheckCircle className="w-5 h-5 text-green-500" fill="currentColor" />
                          )}
                        </div>
                        <p className="text-sm text-gray-600">{area.description}</p>
                        
                        {/* Progress Bar */}
                        <div className="mt-2 flex items-center gap-2">
                          <div className="flex-1 h-2 bg-gray-300 rounded-full overflow-hidden">
                            <div 
                              className={`h-full transition-all duration-500 ${
                                isCompleted 
                                  ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                                  : 'bg-gradient-to-r from-blue-500 to-cyan-500'
                              }`}
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                          <span className="text-xs font-bold text-gray-600">
                            {area.completedTasks}/{area.totalTasks}
                          </span>
                        </div>
                      </div>

                      {isUnlocked ? (
                        isExpanded ? <ChevronDown className="w-5 h-5 text-gray-600" /> : <ChevronRight className="w-5 h-5 text-gray-600" />
                      ) : (
                        <Button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleUnlockArea(area.id, area.unlockCost);
                          }}
                          className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-4 py-2 rounded-xl font-bold shadow-lg"
                        >
                          Unlock ({area.unlockCost} 💰)
                        </Button>
                      )}
                    </div>
                  </button>

                  {/* Tasks List */}
                  {isUnlocked && isExpanded && (
                    <div className="px-4 pb-4 space-y-2">
                      {area.tasks.map((task) => {
                        const requiredItem = MERGE_ITEMS[task.requiredItem];
                        
                        return (
                          <div 
                            key={task.id}
                            className={`p-4 rounded-xl border-2 ${
                              task.completed 
                                ? 'bg-green-50 border-green-300'
                                : 'bg-white border-blue-200'
                            }`}
                          >
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex items-start gap-3 flex-1">
                                {task.completed ? (
                                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" fill="currentColor" />
                                ) : (
                                  <Circle className="w-5 h-5 text-blue-500 mt-0.5" />
                                )}
                                
                                <div className="flex-1">
                                  <h4 className="font-bold text-gray-800">{task.title}</h4>
                                  <p className="text-sm text-gray-600">{task.description}</p>
                                  
                                  {/* Required Item */}
                                  <div className="mt-2 flex items-center gap-2 text-sm">
                                    <span className="text-gray-700">Need:</span>
                                    <div className="px-3 py-1 bg-blue-100 rounded-lg border border-blue-300">
                                      <span className="font-bold text-blue-800">
                                        {task.quantity}x {requiredItem?.name || task.requiredItem}
                                      </span>
                                    </div>
                                  </div>

                                  {/* Rewards */}
                                  <div className="mt-2 flex items-center gap-3 text-xs">
                                    <span className="text-gray-600">Rewards:</span>
                                    <div className="flex items-center gap-2">
                                      <span className="px-2 py-0.5 bg-yellow-100 rounded-lg border border-yellow-300 font-bold text-yellow-700">
                                        💰 {task.rewards.coins}
                                      </span>
                                      <span className="px-2 py-0.5 bg-amber-100 rounded-lg border border-amber-300 font-bold text-amber-700">
                                        ⚡ {task.rewards.xp} XP
                                      </span>
                                      {task.rewards.gems && (
                                        <span className="px-2 py-0.5 bg-purple-100 rounded-lg border border-purple-300 font-bold text-purple-700">
                                          💎 {task.rewards.gems}
                                        </span>
                                      )}
                                    </div>
                                  </div>

                                  {/* Unlock Info */}
                                  {task.unlockAreaId && (
                                    <div className="mt-2 text-xs text-emerald-600 font-bold">
                                      🔓 Unlocks: {taskAreas.find(a => a.id === task.unlockAreaId)?.name}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
