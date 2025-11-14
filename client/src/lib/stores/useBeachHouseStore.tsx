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
    id: 'gate',
    name: 'Front Gate',
    state: 'dirty',
    unlockCost: 0,
    cleaningTasks: 3,
    completedTasks: 0,
    position: { x: 50, y: 85 },
    rewards: { coins: 50, xp: 10 }
  },
  {
    id: 'garden',
    name: 'Garden',
    state: 'locked',
    unlockCost: 100,
    cleaningTasks: 5,
    completedTasks: 0,
    position: { x: 30, y: 60 },
    rewards: { coins: 100, xp: 20 }
  },
  {
    id: 'deck',
    name: 'Beach Deck',
    state: 'locked',
    unlockCost: 150,
    cleaningTasks: 4,
    completedTasks: 0,
    position: { x: 70, y: 60 },
    rewards: { coins: 150, xp: 30 }
  },
  {
    id: 'livingroom',
    name: 'Living Room',
    state: 'locked',
    unlockCost: 200,
    cleaningTasks: 6,
    completedTasks: 0,
    position: { x: 50, y: 40 },
    rewards: { coins: 200, xp: 40 }
  },
  {
    id: 'kitchen',
    name: 'Kitchen',
    state: 'locked',
    unlockCost: 250,
    cleaningTasks: 7,
    completedTasks: 0,
    position: { x: 30, y: 30 },
    rewards: { coins: 250, xp: 50 }
  },
  {
    id: 'bedroom',
    name: 'Bedroom',
    state: 'locked',
    unlockCost: 300,
    cleaningTasks: 5,
    completedTasks: 0,
    position: { x: 70, y: 30 },
    rewards: { coins: 300, xp: 60 }
  },
  {
    id: 'beach',
    name: 'Beach Area',
    state: 'locked',
    unlockCost: 350,
    cleaningTasks: 8,
    completedTasks: 0,
    position: { x: 50, y: 15 },
    rewards: { coins: 400, xp: 80 }
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
          set({ areas: DEFAULT_AREAS });
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
