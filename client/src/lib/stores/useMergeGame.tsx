import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { getLocalStorage, setLocalStorage } from "../utils";

export type GamePhase = "loading" | "menu" | "playing" | "dialogue";

interface MergeGameState {
  phase: GamePhase;
  energy: number;
  maxEnergy: number;
  coins: number;
  gems: number; // Premium currency
  xp: number;
  level: number;
  currentChapter: number;
  lastEnergyUpdate: number;
  unlockedRooms: string[];
  
  setPhase: (phase: GamePhase) => void;
  
  // Energy management
  spendEnergy: (amount: number) => boolean;
  addEnergy: (amount: number) => void;
  refillEnergy: () => void; // Costs gems
  
  // Currency management
  addCoins: (amount: number) => void;
  spendCoins: (amount: number) => boolean;
  addGems: (amount: number) => void;
  spendGems: (amount: number) => boolean;
  
  // XP and leveling
  addXP: (amount: number) => void;
  getXPForNextLevel: () => number;
  getXPProgress: () => number;
  
  // Progression
  nextChapter: () => void;
  unlockRoom: (roomId: string) => void;
  isRoomUnlocked: (roomId: string) => boolean;
  
  // Time management
  updateEnergy: () => void;
  saveGame: () => void;
  loadGame: () => void;
}

const STORAGE_KEY = "merge_story_save";
const ENERGY_REGEN_RATE = 60000; // 1 minute = 1 energy (Merge Mansion style)
const ENERGY_REGEN_AMOUNT = 1;
const ENERGY_REFILL_GEM_COST = 20; // Cost to fully refill energy

// XP formula: level * 100 + (level - 1) * 50
function getXPForLevel(level: number): number {
  return level * 100 + (level - 1) * 50;
}

export const useMergeGame = create<MergeGameState>()(
  subscribeWithSelector((set, get) => ({
    phase: "loading",
    energy: 100,
    maxEnergy: 100,
    coins: 200,
    gems: 50, // Start with some gems
    xp: 0,
    level: 1,
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
      console.log(`Not enough energy! Need ${amount}, have ${energy}`);
      return false;
    },
    
    addEnergy: (amount) => {
      const { energy, maxEnergy } = get();
      const newEnergy = Math.min(energy + amount, maxEnergy);
      set({ energy: newEnergy });
      get().saveGame();
      console.log(`Added ${amount} energy. Now: ${newEnergy}/${maxEnergy}`);
    },
    
    refillEnergy: (): boolean => {
      const { maxEnergy, gems } = get();
      if (gems >= ENERGY_REFILL_GEM_COST) {
        set({ 
          energy: maxEnergy,
          gems: gems - ENERGY_REFILL_GEM_COST 
        });
        get().saveGame();
        console.log(`Energy refilled for ${ENERGY_REFILL_GEM_COST} gems`);
        return true;
      }
      console.log(`Not enough gems to refill energy! Need ${ENERGY_REFILL_GEM_COST}, have ${gems}`);
      return false;
    },
    
    addCoins: (amount) => {
      set((state) => ({ coins: state.coins + amount }));
      get().saveGame();
      console.log(`Added ${amount} coins`);
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
    
    addGems: (amount) => {
      set((state) => ({ gems: state.gems + amount }));
      get().saveGame();
      console.log(`Added ${amount} gems`);
    },
    
    spendGems: (amount) => {
      const { gems } = get();
      if (gems >= amount) {
        set({ gems: gems - amount });
        get().saveGame();
        return true;
      }
      return false;
    },
    
    addXP: (amount) => {
      const state = get();
      let newXP = state.xp + amount;
      let newLevel = state.level;
      let leveledUp = false;
      
      // Check for level up
      while (newXP >= getXPForLevel(newLevel)) {
        newXP -= getXPForLevel(newLevel);
        newLevel++;
        leveledUp = true;
      }
      
      if (leveledUp) {
        // Rewards for leveling up
        const gemsReward = newLevel * 5; // 5 gems per level
        const coinsReward = newLevel * 100; // 100 coins per level
        const energyReward = 50; // 50 energy per level
        
        set((state) => ({ 
          xp: newXP,
          level: newLevel,
          gems: state.gems + gemsReward,
          coins: state.coins + coinsReward,
          energy: Math.min(state.energy + energyReward, state.maxEnergy),
          maxEnergy: state.maxEnergy + 5 // Increase max energy by 5 each level
        }));
        
        console.log(`LEVEL UP! Now level ${newLevel}! Rewards: ${gemsReward} gems, ${coinsReward} coins, ${energyReward} energy`);
      } else {
        set({ xp: newXP });
      }
      
      get().saveGame();
    },
    
    getXPForNextLevel: () => {
      return getXPForLevel(get().level);
    },
    
    getXPProgress: () => {
      const { xp, level } = get();
      const xpNeeded = getXPForLevel(level);
      return (xp / xpNeeded) * 100;
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
        gems: state.gems,
        xp: state.xp,
        level: state.level,
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
          (saveData.energy || 100) + energyToAdd,
          saveData.maxEnergy || 100
        );
        
        set({
          energy: restoredEnergy,
          maxEnergy: saveData.maxEnergy || 100,
          coins: saveData.coins || 200,
          gems: saveData.gems || 50,
          xp: saveData.xp || 0,
          level: saveData.level || 1,
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
