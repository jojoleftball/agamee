import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type AreaState = 'locked' | 'dirty' | 'cleaning' | 'clean';

export interface BeachHouseArea {
  id: string;
  name: string;
  state: AreaState;
  unlockCost: number;
  cleaningTasks: number;
  completedTasks: number;
  position: { x: number; y: number };
  rewards: {
    coins: number;
    xp: number;
  };
}

interface BeachHouseState {
  areas: BeachHouseArea[];
  totalProgress: number;
  
  initializeAreas: () => void;
  unlockArea: (areaId: string) => boolean;
  completeTask: (areaId: string) => void;
  getArea: (areaId: string) => BeachHouseArea | undefined;
  getProgress: () => number;
}

const DEFAULT_AREAS: BeachHouseArea[] = [
  {
    id: 'flower_bed',
    name: 'Flower Bed',
    state: 'dirty',
    unlockCost: 0,
    cleaningTasks: 3,
    completedTasks: 0,
    position: { x: 30, y: 65 },
    rewards: { coins: 50, xp: 10 }
  },
  {
    id: 'vegetable_patch',
    name: 'Vegetable Patch',
    state: 'locked',
    unlockCost: 100,
    cleaningTasks: 5,
    completedTasks: 0,
    position: { x: 70, y: 65 },
    rewards: { coins: 150, xp: 30 }
  },
  {
    id: 'pond_area',
    name: 'Pond Area',
    state: 'locked',
    unlockCost: 250,
    cleaningTasks: 6,
    completedTasks: 0,
    position: { x: 50, y: 80 },
    rewards: { coins: 250, xp: 50 }
  },
  {
    id: 'tree_grove',
    name: 'Tree Grove',
    state: 'locked',
    unlockCost: 400,
    cleaningTasks: 7,
    completedTasks: 0,
    position: { x: 35, y: 35 },
    rewards: { coins: 400, xp: 80 }
  },
  {
    id: 'greenhouse',
    name: 'Greenhouse',
    state: 'locked',
    unlockCost: 600,
    cleaningTasks: 8,
    completedTasks: 0,
    position: { x: 65, y: 35 },
    rewards: { coins: 600, xp: 120 }
  },
  {
    id: 'zen_garden',
    name: 'Zen Garden',
    state: 'locked',
    unlockCost: 900,
    cleaningTasks: 10,
    completedTasks: 0,
    position: { x: 50, y: 50 },
    rewards: { coins: 900, xp: 180 }
  },
  {
    id: 'animal_sanctuary',
    name: 'Animal Sanctuary',
    state: 'locked',
    unlockCost: 1200,
    cleaningTasks: 12,
    completedTasks: 0,
    position: { x: 20, y: 50 },
    rewards: { coins: 1200, xp: 240 }
  },
  {
    id: 'rose_garden',
    name: 'Rose Garden',
    state: 'locked',
    unlockCost: 1500,
    cleaningTasks: 15,
    completedTasks: 0,
    position: { x: 80, y: 50 },
    rewards: { coins: 1500, xp: 300 }
  }
];

export const useBeachHouseStore = create<BeachHouseState>()(
  persist(
    (set, get) => ({
      areas: [],
      totalProgress: 0,

      initializeAreas: () => {
        const state = get();
        if (state.areas.length === 0) {
          // Initialize with first area unlocked
          const initialAreas = DEFAULT_AREAS.map((area, index) => ({
            ...area,
            state: index === 0 ? 'dirty' as AreaState : area.state
          }));
          set({ areas: initialAreas });
        }
      },

      unlockArea: (areaId: string) => {
        const area = get().areas.find(a => a.id === areaId);
        if (!area || area.state !== 'locked') return false;

        set((state) => ({
          areas: state.areas.map(a =>
            a.id === areaId ? { ...a, state: 'dirty' as AreaState } : a
          )
        }));
        return true;
      },

      completeTask: (areaId: string) => {
        set((state) => {
          const updatedAreas = state.areas.map(area => {
            if (area.id === areaId && area.state === 'dirty') {
              const newCompletedTasks = area.completedTasks + 1;
              const newState = newCompletedTasks >= area.cleaningTasks ? 'clean' : 'dirty';
              
              return {
                ...area,
                completedTasks: newCompletedTasks,
                state: newState as AreaState
              };
            }
            return area;
          });

          const totalTasks = updatedAreas.reduce((sum, a) => sum + a.cleaningTasks, 0);
          const completedTasks = updatedAreas.reduce((sum, a) => sum + a.completedTasks, 0);
          const totalProgress = Math.floor((completedTasks / totalTasks) * 100);

          return {
            areas: updatedAreas,
            totalProgress
          };
        });
      },

      getArea: (areaId: string) => {
        return get().areas.find(a => a.id === areaId);
      },

      getProgress: () => {
        const { areas } = get();
        const totalTasks = areas.reduce((sum, a) => sum + a.cleaningTasks, 0);
        const completedTasks = areas.reduce((sum, a) => sum + a.completedTasks, 0);
        return Math.floor((completedTasks / totalTasks) * 100);
      }
    }),
    {
      name: 'beach-house-storage'
    }
  )
);
