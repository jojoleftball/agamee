import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { TASK_AREAS, Task, TaskArea, getNextTask, isAreaCompleted, getUnlockAreaId } from '../tasks';
import { useMergeGame } from './useMergeGame';
import { useBoardStore } from './useBoardStore';

interface TaskState {
  completedTaskIds: string[];
  unlockedAreaIds: string[];
  currentAreaId: string;
  
  // Task operations
  completeTask: (taskId: string) => { success: boolean; rewards?: Task['rewards']; unlockedArea?: string };
  canCompleteTask: (taskId: string) => boolean;
  submitItem: (taskId: string, itemId: string) => boolean;
  
  // Area operations
  unlockArea: (areaId: string) => boolean;
  isAreaUnlocked: (areaId: string) => boolean;
  setCurrentArea: (areaId: string) => void;
  
  // Query operations
  getTaskAreas: () => TaskArea[];
  getCurrentTasks: () => Task[];
  getNextTaskForArea: (areaId: string) => Task | null;
  getProgress: () => number;
  getAreaProgress: (areaId: string) => number;
}

export const useTaskStore = create<TaskState>()(
  persist(
    (set, get) => ({
      completedTaskIds: [],
      unlockedAreaIds: ['flower_bed'], // Start with flower bed unlocked
      currentAreaId: 'flower_bed',
      
      completeTask: (taskId) => {
        const state = get();
        
        // Check if already completed
        if (state.completedTaskIds.includes(taskId)) {
          return { success: false };
        }
        
        // Find the task
        let foundTask: Task | null = null;
        for (const area of TASK_AREAS) {
          const task = area.tasks.find(t => t.id === taskId);
          if (task) {
            foundTask = task;
            break;
          }
        }
        
        if (!foundTask) {
          return { success: false };
        }
        
        // Mark as completed
        set((state) => ({
          completedTaskIds: [...state.completedTaskIds, taskId]
        }));
        
        // Give rewards
        useMergeGame.getState().addCoins(foundTask.rewards.coins);
        useMergeGame.getState().addXP(foundTask.rewards.xp);
        if (foundTask.rewards.gems) {
          useMergeGame.getState().addGems(foundTask.rewards.gems);
        }
        
        // Check if this unlocks a new area
        const unlockAreaId = getUnlockAreaId(taskId);
        if (unlockAreaId && !state.unlockedAreaIds.includes(unlockAreaId)) {
          set((state) => ({
            unlockedAreaIds: [...state.unlockedAreaIds, unlockAreaId]
          }));
          
          // Also unlock in BeachHouseStore
          const { useBeachHouseStore } = require('./useBeachHouseStore');
          useBeachHouseStore.getState().unlockArea(unlockAreaId);
          
          return {
            success: true,
            rewards: foundTask.rewards,
            unlockedArea: unlockAreaId
          };
        }
        
        return {
          success: true,
          rewards: foundTask.rewards
        };
      },
      
      canCompleteTask: (taskId) => {
        const state = get();
        return !state.completedTaskIds.includes(taskId);
      },
      
      submitItem: (taskId, itemId) => {
        const state = get();
        
        // Find the task
        let foundTask: Task | null = null;
        for (const area of TASK_AREAS) {
          const task = area.tasks.find(t => t.id === taskId);
          if (task) {
            foundTask = task;
            break;
          }
        }
        
        if (!foundTask || state.completedTaskIds.includes(taskId)) {
          return false;
        }
        
        // Check if item is on board
        const boardStore = useBoardStore.getState();
        const item = boardStore.items.find(i => i.id === itemId);
        
        if (!item) return false;
        
        // Check if item type matches task requirement
        if (item.itemType !== foundTask.requiredItem) {
          return false;
        }
        
        // Remove item from board
        boardStore.removeItem(itemId);
        
        // Check if we've submitted enough items for this task
        // (This is simplified - in full version would track partial progress)
        // For now, we'll track by checking quantity
        
        // Complete the task
        state.completeTask(taskId);
        
        return true;
      },
      
      unlockArea: (areaId) => {
        const state = get();
        
        if (state.unlockedAreaIds.includes(areaId)) {
          return false;
        }
        
        // Find the area and check unlock cost
        const area = TASK_AREAS.find(a => a.id === areaId);
        if (!area) return false;
        
        // Spend coins to unlock
        if (!useMergeGame.getState().spendCoins(area.unlockCost)) {
          return false;
        }
        
        set((state) => ({
          unlockedAreaIds: [...state.unlockedAreaIds, areaId]
        }));
        
        return true;
      },
      
      isAreaUnlocked: (areaId) => {
        return get().unlockedAreaIds.includes(areaId);
      },
      
      setCurrentArea: (areaId) => {
        set({ currentAreaId: areaId });
      },
      
      getTaskAreas: () => {
        const state = get();
        return TASK_AREAS.map(area => ({
          ...area,
          isUnlocked: state.unlockedAreaIds.includes(area.id),
          completedTasks: area.tasks.filter(t => state.completedTaskIds.includes(t.id)).length,
          tasks: area.tasks.map(t => ({
            ...t,
            completed: state.completedTaskIds.includes(t.id)
          }))
        }));
      },
      
      getCurrentTasks: () => {
        const state = get();
        const area = TASK_AREAS.find(a => a.id === state.currentAreaId);
        if (!area) return [];
        
        return area.tasks.map(t => ({
          ...t,
          completed: state.completedTaskIds.includes(t.id)
        }));
      },
      
      getNextTaskForArea: (areaId) => {
        const state = get();
        return getNextTask(areaId, state.completedTaskIds);
      },
      
      getProgress: () => {
        const state = get();
        const totalTasks = TASK_AREAS.reduce((sum, area) => sum + area.totalTasks, 0);
        return Math.floor((state.completedTaskIds.length / totalTasks) * 100);
      },
      
      getAreaProgress: (areaId) => {
        const state = get();
        const area = TASK_AREAS.find(a => a.id === areaId);
        if (!area) return 0;
        
        const completed = area.tasks.filter(t => state.completedTaskIds.includes(t.id)).length;
        return Math.floor((completed / area.totalTasks) * 100);
      }
    }),
    {
      name: 'task-storage'
    }
  )
);
