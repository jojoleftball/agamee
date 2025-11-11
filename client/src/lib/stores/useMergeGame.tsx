import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { getLocalStorage, setLocalStorage } from "../utils";

export type GamePhase = "loading" | "menu" | "playing" | "dialogue";

interface MergeGameState {
  phase: GamePhase;
  energy: number;
  maxEnergy: number;
  coins: number;
  currentChapter: number;
  lastEnergyUpdate: number;
  unlockedRooms: string[];
  
  setPhase: (phase: GamePhase) => void;
  spendEnergy: (amount: number) => boolean;
  addEnergy: (amount: number) => void;
  addCoins: (amount: number) => void;
  spendCoins: (amount: number) => boolean;
  nextChapter: () => void;
  unlockRoom: (roomId: string) => void;
  isRoomUnlocked: (roomId: string) => boolean;
  updateEnergy: () => void;
  saveGame: () => void;
  loadGame: () => void;
}

const STORAGE_KEY = "merge_story_save";
const ENERGY_REGEN_RATE = 60000;
const ENERGY_REGEN_AMOUNT = 1;

export const useMergeGame = create<MergeGameState>()(
  subscribeWithSelector((set, get) => ({
    phase: "loading",
    energy: 50,
    maxEnergy: 50,
    coins: 100,
    currentChapter: 1,
    lastEnergyUpdate: Date.now(),
    unlockedRooms: ['living_room'],
    
    setPhase: (phase) => {
      console.log(`Game phase changed to: ${phase}`);
      set({ phase });
    },
    
    spendEnergy: (amount) => {
      const { energy } = get();
      if (energy >= amount) {
        set({ energy: energy - amount });
        get().saveGame();
        return true;
      }
      return false;
    },
    
    addEnergy: (amount) => {
      const { energy, maxEnergy } = get();
      set({ energy: Math.min(energy + amount, maxEnergy) });
      get().saveGame();
    },
    
    addCoins: (amount) => {
      set((state) => ({ coins: state.coins + amount }));
      get().saveGame();
    },
    
    spendCoins: (amount) => {
      const { coins } = get();
      if (coins >= amount) {
        set({ coins: coins - amount });
        get().saveGame();
        return true;
      }
      return false;
    },
    
    nextChapter: () => {
      set((state) => ({ currentChapter: state.currentChapter + 1 }));
      get().saveGame();
    },
    
    unlockRoom: (roomId) => {
      set((state) => {
        if (!state.unlockedRooms.includes(roomId)) {
          return { unlockedRooms: [...state.unlockedRooms, roomId] };
        }
        return {};
      });
      get().saveGame();
    },
    
    isRoomUnlocked: (roomId) => {
      return get().unlockedRooms.includes(roomId);
    },
    
    updateEnergy: () => {
      const state = get();
      const now = Date.now();
      const timePassed = now - state.lastEnergyUpdate;
      const energyToAdd = Math.floor(timePassed / ENERGY_REGEN_RATE) * ENERGY_REGEN_AMOUNT;
      
      if (energyToAdd > 0 && state.energy < state.maxEnergy) {
        const newEnergy = Math.min(state.energy + energyToAdd, state.maxEnergy);
        set({ 
          energy: newEnergy,
          lastEnergyUpdate: now
        });
        get().saveGame();
      }
    },
    
    saveGame: () => {
      const state = get();
      const saveData = {
        energy: state.energy,
        maxEnergy: state.maxEnergy,
        coins: state.coins,
        currentChapter: state.currentChapter,
        lastEnergyUpdate: state.lastEnergyUpdate,
        unlockedRooms: state.unlockedRooms,
      };
      setLocalStorage(STORAGE_KEY, saveData);
    },
    
    loadGame: () => {
      const saveData = getLocalStorage(STORAGE_KEY);
      if (saveData) {
        const now = Date.now();
        const timePassed = now - (saveData.lastEnergyUpdate || now);
        const energyToAdd = Math.floor(timePassed / ENERGY_REGEN_RATE) * ENERGY_REGEN_AMOUNT;
        const restoredEnergy = Math.min(
          (saveData.energy || 50) + energyToAdd,
          saveData.maxEnergy || 50
        );
        
        set({
          energy: restoredEnergy,
          maxEnergy: saveData.maxEnergy || 50,
          coins: saveData.coins || 100,
          currentChapter: saveData.currentChapter || 1,
          lastEnergyUpdate: now,
          unlockedRooms: saveData.unlockedRooms || ['living_room'],
        });
        console.log("Game loaded with energy regeneration:", { restoredEnergy, energyToAdd });
      } else {
        console.log("No save data found, starting new game");
      }
    },
  }))
);

if (typeof window !== 'undefined') {
  setInterval(() => {
    useMergeGame.getState().updateEnergy();
  }, ENERGY_REGEN_RATE);
}
