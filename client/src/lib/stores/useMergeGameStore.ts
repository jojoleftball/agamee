import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { MERGE_ITEMS, BoardItem, GARDEN_BIOMES } from '../mergeData';
import { soundManager } from '../sounds';
import { useSettingsStore } from './useSettingsStore';

interface GameTask {
  id: string;
  title: string;
  description: string;
  requiredItems: { itemType: string; count: number }[];
  rewards: {
    coins?: number;
    gems?: number;
    energy?: number;
    xp?: number;
  };
  completed: boolean;
  biomeId: string;
}

interface MergeGameState {
  // Resources
  energy: number;
  maxEnergy: number;
  coins: number;
  gems: number;
  xp: number;
  level: number;
  
  // Board state
  items: BoardItem[];
  inventory: BoardItem[];
  maxInventorySize: number;
  gridSize: { rows: number; cols: number };
  
  // Selection and drag
  selectedItem: string | null;
  draggedItem: string | null;
  
  // Biomes
  currentBiome: string;
  unlockedBiomes: string[];
  
  // Tasks
  tasks: GameTask[];
  
  // Energy regeneration
  lastEnergyUpdate: number;
  energyRegenRate: number;
  
  // Actions - Resources
  addEnergy: (amount: number) => void;
  spendEnergy: (amount: number) => boolean;
  addCoins: (amount: number) => void;
  spendCoins: (amount: number) => boolean;
  addGems: (amount: number) => void;
  spendGems: (amount: number) => boolean;
  addXP: (amount: number) => void;
  updateEnergy: () => void;
  refillEnergyWithGems: () => boolean;
  
  // Actions - Board
  addItem: (itemType: string, x: number, y: number) => void;
  removeItem: (id: string) => void;
  moveItem: (id: string, x: number, y: number) => boolean;
  selectItem: (id: string | null) => void;
  setDraggedItem: (id: string | null) => void;
  tryMerge: (item1Id: string, item2Id: string) => boolean;
  tapGenerator: (itemId: string) => boolean;
  
  // Actions - Inventory
  moveToInventory: (itemId: string) => boolean;
  moveFromInventory: (itemId: string, x: number, y: number) => boolean;
  
  // Actions - Biomes
  switchBiome: (biomeId: string) => void;
  unlockBiome: (biomeId: string) => boolean;
  
  // Actions - Tasks
  checkTaskCompletion: (taskId: string) => boolean;
  completeTask: (taskId: string) => void;
  
  // Utilities
  getItemAt: (x: number, y: number) => BoardItem | undefined;
  findEmptySpot: () => { x: number; y: number } | null;
  initializeGame: () => void;
  sellItem: (itemId: string) => void;
}

export const useMergeGameStore = create<MergeGameState>()(
  persist(
    (set, get) => ({
      // Initial state
      energy: 100,
      maxEnergy: 100,
      coins: 500,
      gems: 20,
      xp: 0,
      level: 1,
      
      items: [],
      inventory: [],
      maxInventorySize: 10,
      gridSize: { rows: 8, cols: 5 },
      
      selectedItem: null,
      draggedItem: null,
      
      currentBiome: 'basic',
      unlockedBiomes: ['basic'],
      
      tasks: [
        {
          id: 'task_1',
          title: 'First Merge',
          description: 'Merge two flower seedlings',
          requiredItems: [{ itemType: 'flower_2', count: 1 }],
          rewards: { coins: 50, xp: 20, energy: 10 },
          completed: false,
          biomeId: 'basic'
        },
        {
          id: 'task_2',
          title: 'Tool Up',
          description: 'Create a Garden Spade',
          requiredItems: [{ itemType: 'tool_2', count: 1 }],
          rewards: { coins: 75, xp: 30, energy: 15 },
          completed: false,
          biomeId: 'basic'
        },
        {
          id: 'task_3',
          title: 'Growing Garden',
          description: 'Merge flowers to level 3',
          requiredItems: [{ itemType: 'flower_3', count: 2 }],
          rewards: { coins: 150, xp: 60, gems: 5 },
          completed: false,
          biomeId: 'basic'
        },
        {
          id: 'task_4',
          title: 'Plant a Tree',
          description: 'Get a Young Tree',
          requiredItems: [{ itemType: 'tree_3', count: 1 }],
          rewards: { coins: 200, xp: 80, energy: 20 },
          completed: false,
          biomeId: 'basic'
        },
        {
          id: 'task_5',
          title: 'Garden Master',
          description: 'Reach level 5',
          requiredItems: [],
          rewards: { coins: 500, gems: 15, energy: 30 },
          completed: false,
          biomeId: 'basic'
        }
      ],
      
      lastEnergyUpdate: Date.now(),
      energyRegenRate: 1,
      
      // Resource actions
      addEnergy: (amount) => set((state) => ({
        energy: Math.min(state.energy + amount, state.maxEnergy)
      })),
      
      spendEnergy: (amount) => {
        const state = get();
        if (state.energy >= amount) {
          set({ energy: state.energy - amount });
          return true;
        }
        return false;
      },
      
      addCoins: (amount) => set((state) => ({ coins: state.coins + amount })),
      
      spendCoins: (amount) => {
        const state = get();
        if (state.coins >= amount) {
          set({ coins: state.coins - amount });
          return true;
        }
        return false;
      },
      
      addGems: (amount) => set((state) => ({ gems: state.gems + amount })),
      
      spendGems: (amount) => {
        const state = get();
        if (state.gems >= amount) {
          set({ gems: state.gems - amount });
          return true;
        }
        return false;
      },
      
      addXP: (amount) => set((state) => {
        const newXP = state.xp + amount;
        const xpForNextLevel = state.level * 100;
        
        if (newXP >= xpForNextLevel) {
          const newLevel = state.level + 1;
          return {
            xp: newXP - xpForNextLevel,
            level: newLevel,
            maxEnergy: 100 + (newLevel - 1) * 10
          };
        }
        
        return { xp: newXP };
      }),
      
      updateEnergy: () => {
        const state = get();
        const now = Date.now();
        const timePassed = now - state.lastEnergyUpdate;
        const minutesPassed = timePassed / 60000;
        const energyToAdd = Math.floor(minutesPassed * state.energyRegenRate);
        
        if (energyToAdd > 0 && state.energy < state.maxEnergy) {
          set({
            energy: Math.min(state.energy + energyToAdd, state.maxEnergy),
            lastEnergyUpdate: now
          });
        }
      },
      
      refillEnergyWithGems: () => {
        const state = get();
        const gemCost = 10;
        
        if (state.spendGems(gemCost)) {
          set({ energy: state.maxEnergy });
          return true;
        }
        return false;
      },
      
      // Board actions
      addItem: (itemType, x, y) => {
        const itemData = MERGE_ITEMS[itemType];
        if (!itemData) return;
        
        set((state) => ({
          items: [
            ...state.items,
            {
              id: `item_${Date.now()}_${Math.random()}`,
              itemType,
              x,
              y,
              charges: itemData.isGenerator ? itemData.maxCharges : undefined,
              lastGenerated: itemData.isGenerator ? Date.now() : undefined
            }
          ]
        }));
      },
      
      removeItem: (id) => set((state) => ({
        items: state.items.filter((item) => item.id !== id),
        inventory: state.inventory.filter((item) => item.id !== id)
      })),
      
      moveItem: (id, x, y) => {
        const state = get();
        const existingItem = state.getItemAt(x, y);
        
        if (existingItem && existingItem.id !== id) {
          return false;
        }
        
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id ? { ...item, x, y } : item
          )
        }));
        
        return true;
      },
      
      selectItem: (id) => set({ selectedItem: id }),
      
      setDraggedItem: (id) => set({ draggedItem: id }),
      
      tryMerge: (item1Id, item2Id) => {
        const state = get();
        const item1 = state.items.find((i) => i.id === item1Id);
        const item2 = state.items.find((i) => i.id === item2Id);
        
        if (!item1 || !item2) return false;
        if (item1.itemType !== item2.itemType) return false;
        
        const itemData = MERGE_ITEMS[item1.itemType];
        if (!itemData.mergesInto) return false;
        
        const mergedItemData = MERGE_ITEMS[itemData.mergesInto];
        if (!mergedItemData) return false;
        
        const targetX = item2.x;
        const targetY = item2.y;
        
        const nearbyOthers = state.items.filter(item => {
          if (item.id === item1Id || item.id === item2Id) return false;
          if (item.itemType !== item1.itemType) return false;
          const dx = Math.abs(item.x - targetX);
          const dy = Math.abs(item.y - targetY);
          return dx <= 1 && dy <= 1;
        }).sort((a, b) => {
          const distA = Math.abs(a.x - targetX) + Math.abs(a.y - targetY);
          const distB = Math.abs(b.x - targetX) + Math.abs(b.y - targetY);
          return distA - distB;
        });
        
        const idsToRemove = [item1Id, item2Id];
        if (nearbyOthers.length >= 1) {
          idsToRemove.push(nearbyOthers[0].id);
        }
        
        const newItems = state.items.filter(item => !idsToRemove.includes(item.id));
        newItems.push({
          id: `item_${Date.now()}_${Math.random()}`,
          itemType: itemData.mergesInto,
          x: targetX,
          y: targetY
        });
        
        set({ items: newItems });
        get().addCoins(mergedItemData.coinValue);
        get().addXP(mergedItemData.xpValue);
        soundManager.playMerge();
        
        return true;
      },
      
      tapGenerator: (itemId) => {
        const state = get();
        const item = state.items.find((i) => i.id === itemId);
        
        if (!item) return false;
        
        const itemData = MERGE_ITEMS[item.itemType];
        if (!itemData.isGenerator) return false;
        
        if (!item.charges || item.charges <= 0) return false;
        
        const energyCost = itemData.energyCost || 0;
        if (!state.spendEnergy(energyCost)) return false;
        
        const emptySpot = state.findEmptySpot();
        if (!emptySpot) return false;
        
        const generatedItems = itemData.generates || [];
        if (generatedItems.length === 0) return false;
        
        const randomItem = generatedItems[Math.floor(Math.random() * generatedItems.length)];
        
        set((state) => ({
          items: state.items.map((i) =>
            i.id === itemId
              ? { ...i, charges: (i.charges || 0) - 1, lastGenerated: Date.now() }
              : i
          )
        }));
        
        get().addItem(randomItem, emptySpot.x, emptySpot.y);
        soundManager.playClick();
        
        return true;
      },
      
      // Inventory actions
      moveToInventory: (itemId) => {
        const state = get();
        if (state.inventory.length >= state.maxInventorySize) return false;
        
        const item = state.items.find((i) => i.id === itemId);
        if (!item) return false;
        
        set((state) => ({
          items: state.items.filter((i) => i.id !== itemId),
          inventory: [...state.inventory, item]
        }));
        
        return true;
      },
      
      moveFromInventory: (itemId, x, y) => {
        const state = get();
        const item = state.inventory.find((i) => i.id === itemId);
        
        if (!item) return false;
        
        const existingItem = state.getItemAt(x, y);
        if (existingItem) return false;
        
        set((state) => ({
          inventory: state.inventory.filter((i) => i.id !== itemId),
          items: [...state.items, { ...item, x, y }]
        }));
        
        return true;
      },
      
      // Biome actions
      switchBiome: (biomeId) => {
        const state = get();
        if (state.unlockedBiomes.includes(biomeId)) {
          set({ currentBiome: biomeId });
        }
      },
      
      unlockBiome: (biomeId) => {
        const state = get();
        const biome = GARDEN_BIOMES.find((b) => b.id === biomeId);
        
        if (!biome) return false;
        if (state.unlockedBiomes.includes(biomeId)) return false;
        
        if (state.level < biome.unlockLevel) return false;
        if (!state.spendCoins(biome.unlockCoins)) return false;
        
        set((state) => ({
          unlockedBiomes: [...state.unlockedBiomes, biomeId]
        }));
        
        return true;
      },
      
      // Task actions
      checkTaskCompletion: (taskId) => {
        const state = get();
        const task = state.tasks.find((t) => t.id === taskId);
        
        if (!task || task.completed) return false;
        
        if (taskId === 'task_5') {
          return state.level >= 5;
        }
        
        for (const req of task.requiredItems) {
          const count = state.items.filter((item) => item.itemType === req.itemType).length;
          if (count < req.count) return false;
        }
        
        return true;
      },
      
      completeTask: (taskId) => {
        const state = get();
        const task = state.tasks.find((t) => t.id === taskId);
        
        if (!task || task.completed) return;
        if (!state.checkTaskCompletion(taskId)) return;
        
        for (const req of task.requiredItems) {
          for (let i = 0; i < req.count; i++) {
            const item = state.items.find((item) => item.itemType === req.itemType);
            if (item) {
              get().removeItem(item.id);
            }
          }
        }
        
        if (task.rewards.coins) get().addCoins(task.rewards.coins);
        if (task.rewards.gems) get().addGems(task.rewards.gems);
        if (task.rewards.energy) get().addEnergy(task.rewards.energy);
        if (task.rewards.xp) get().addXP(task.rewards.xp);
        
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === taskId ? { ...t, completed: true } : t
          )
        }));
        
        soundManager.playSuccess();
      },
      
      // Utilities
      getItemAt: (x, y) => {
        const state = get();
        return state.items.find((item) => item.x === x && item.y === y);
      },
      
      findEmptySpot: () => {
        const state = get();
        const { boardSettings } = useSettingsStore.getState();
        for (let y = 0; y < boardSettings.rows; y++) {
          for (let x = 0; x < boardSettings.cols; x++) {
            if (!state.getItemAt(x, y)) {
              return { x, y };
            }
          }
        }
        return null;
      },
      
      initializeGame: () => {
        const state = get();
        
        if (!state.lastEnergyUpdate) {
          set({ lastEnergyUpdate: Date.now() });
        }
        
        if (state.items.length > 0) return;
        
        get().addItem('gen_flower_1', 1, 0);
        get().addItem('gen_tool_1', 3, 0);
        get().addItem('flower_1', 0, 1);
        get().addItem('flower_1', 1, 1);
        get().addItem('flower_1', 2, 1);
        get().addItem('tool_1', 3, 1);
        get().addItem('tool_1', 4, 1);
        get().addItem('tool_1', 0, 2);
        get().addItem('blocked_dirt_1', 2, 2);
        get().addItem('blocked_dirt_1', 3, 2);
        get().addItem('blocked_rock_1', 0, 3);
        get().addItem('blocked_weeds_1', 4, 3);
      },
      
      sellItem: (itemId) => {
        const state = get();
        const item = [...state.items, ...state.inventory].find((i) => i.id === itemId);
        
        if (!item) return;
        
        const itemData = MERGE_ITEMS[item.itemType];
        const sellValue = Math.floor(itemData.coinValue * 0.5);
        
        get().removeItem(itemId);
        get().addCoins(sellValue);
      }
    }),
    {
      name: 'merge-garden-storage',
      partialize: (state) => ({
        energy: state.energy,
        maxEnergy: state.maxEnergy,
        coins: state.coins,
        gems: state.gems,
        xp: state.xp,
        level: state.level,
        items: state.items,
        inventory: state.inventory,
        currentBiome: state.currentBiome,
        unlockedBiomes: state.unlockedBiomes,
        tasks: state.tasks,
        lastEnergyUpdate: state.lastEnergyUpdate
      })
    }
  )
);
