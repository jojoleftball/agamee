import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface GardenZone {
  id: string;
  name: string;
  unlocked: boolean;
  progress: number;
  required: number;
  cost: number;
}

export interface GameState {
  // Resources
  coins: number;
  gems: number;
  energy: number;
  maxEnergy: number;
  xp: number;
  level: number;
  
  // Garden zones
  zones: GardenZone[];
  currentZone: string;
  
  // Progress tracking
  lastEnergyUpdate: number;
  
  // Actions
  addCoins: (amount: number) => void;
  spendCoins: (amount: number) => boolean;
  addGems: (amount: number) => void;
  addXP: (amount: number) => void;
  addEnergy: (amount: number) => void;
  spendEnergy: (amount: number) => boolean;
  updateEnergy: () => void;
  unlockZone: (zoneId: string) => boolean;
  setCurrentZone: (zoneId: string) => void;
  resetGame: () => void;
}

const initialZones: GardenZone[] = [
  {
    id: 'starter_plot',
    name: 'Starter Garden',
    unlocked: true,
    progress: 0,
    required: 10,
    cost: 0
  },
  {
    id: 'flower_garden',
    name: 'Flower Garden',
    unlocked: false,
    progress: 0,
    required: 25,
    cost: 500
  },
  {
    id: 'vegetable_patch',
    name: 'Vegetable Patch',
    unlocked: false,
    progress: 0,
    required: 40,
    cost: 1500
  },
  {
    id: 'orchard',
    name: 'Orchard',
    unlocked: false,
    progress: 0,
    required: 60,
    cost: 3000
  },
  {
    id: 'pond',
    name: 'Garden Pond',
    unlocked: false,
    progress: 0,
    required: 80,
    cost: 5000
  }
];

const ENERGY_REGEN_INTERVAL = 60000; // 1 energy per minute
const ENERGY_PER_INTERVAL = 1;
const XP_PER_LEVEL = 100;

export const useGardenGame = create<GameState>()(
  persist(
    (set, get) => ({
      coins: 100,
      gems: 10,
      energy: 50,
      maxEnergy: 50,
      xp: 0,
      level: 1,
      zones: initialZones,
      currentZone: 'starter_plot',
      lastEnergyUpdate: Date.now(),
      
      addCoins: (amount) => set((state) => ({ coins: state.coins + amount })),
      
      spendCoins: (amount) => {
        const { coins } = get();
        if (coins >= amount) {
          set({ coins: coins - amount });
          return true;
        }
        return false;
      },
      
      addGems: (amount) => set((state) => ({ gems: state.gems + amount })),
      
      addXP: (amount) => {
        const { xp, level } = get();
        const newXP = xp + amount;
        const xpNeeded = level * XP_PER_LEVEL;
        
        if (newXP >= xpNeeded) {
          set({
            xp: newXP - xpNeeded,
            level: level + 1,
            maxEnergy: 50 + (level * 5)
          });
        } else {
          set({ xp: newXP });
        }
      },
      
      addEnergy: (amount) => 
        set((state) => ({ 
          energy: Math.min(state.energy + amount, state.maxEnergy) 
        })),
      
      spendEnergy: (amount) => {
        const { energy } = get();
        if (energy >= amount) {
          set({ energy: energy - amount });
          return true;
        }
        return false;
      },
      
      updateEnergy: () => {
        const { lastEnergyUpdate, energy, maxEnergy } = get();
        const now = Date.now();
        const timePassed = now - lastEnergyUpdate;
        const intervalsPassed = Math.floor(timePassed / ENERGY_REGEN_INTERVAL);
        
        if (intervalsPassed > 0 && energy < maxEnergy) {
          const newEnergy = Math.min(
            energy + (intervalsPassed * ENERGY_PER_INTERVAL),
            maxEnergy
          );
          set({ energy: newEnergy, lastEnergyUpdate: now });
        }
      },
      
      unlockZone: (zoneId) => {
        const { zones, coins } = get();
        const zone = zones.find(z => z.id === zoneId);
        
        if (!zone || zone.unlocked || coins < zone.cost) {
          return false;
        }
        
        set({
          zones: zones.map(z => 
            z.id === zoneId ? { ...z, unlocked: true } : z
          ),
          coins: coins - zone.cost
        });
        return true;
      },
      
      setCurrentZone: (zoneId) => set({ currentZone: zoneId }),
      
      resetGame: () => set({
        coins: 100,
        gems: 10,
        energy: 50,
        maxEnergy: 50,
        xp: 0,
        level: 1,
        zones: initialZones,
        currentZone: 'starter_plot',
        lastEnergyUpdate: Date.now()
      })
    }),
    {
      name: 'garden-game-storage'
    }
  )
);
