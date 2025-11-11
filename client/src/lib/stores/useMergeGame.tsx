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
  
  setPhase: (phase: GamePhase) => void;
  spendEnergy: (amount: number) => boolean;
  addEnergy: (amount: number) => void;
  addCoins: (amount: number) => void;
  spendCoins: (amount: number) => boolean;
  nextChapter: () => void;
  saveGame: () => void;
  loadGame: () => void;
}

const STORAGE_KEY = "merge_story_save";

export const useMergeGame = create<MergeGameState>()(
  subscribeWithSelector((set, get) => ({
    phase: "loading",
    energy: 50,
    maxEnergy: 50,
    coins: 100,
    currentChapter: 1,
    
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
    
    saveGame: () => {
      const state = get();
      const saveData = {
        energy: state.energy,
        maxEnergy: state.maxEnergy,
        coins: state.coins,
        currentChapter: state.currentChapter,
      };
      setLocalStorage(STORAGE_KEY, saveData);
      console.log("Game saved:", saveData);
    },
    
    loadGame: () => {
      const saveData = getLocalStorage(STORAGE_KEY);
      if (saveData) {
        set({
          energy: saveData.energy || 50,
          maxEnergy: saveData.maxEnergy || 50,
          coins: saveData.coins || 100,
          currentChapter: saveData.currentChapter || 1,
        });
        console.log("Game loaded:", saveData);
      } else {
        console.log("No save data found, starting new game");
      }
    },
  }))
);
