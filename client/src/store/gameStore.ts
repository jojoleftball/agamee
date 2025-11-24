import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { GameScreen, GameResources, BoardItem, GardenSlot, Task, Dialogue } from '../types/game';

interface GameState {
  currentScreen: GameScreen;
  showTutorial: boolean;
  tutorialStep: number;
  
  resources: GameResources;
  
  boardItems: BoardItem[];
  storageItems: BoardItem[];
  maxStorage: number;
  
  gardenSlots: GardenSlot[];
  
  tasks: Task[];
  activeDialogues: Dialogue[];
  
  unlockedGardens: string[];
  currentGarden: string;
  
  setScreen: (screen: GameScreen) => void;
  updateResources: (updates: Partial<GameResources>) => void;
  addCoins: (amount: number) => void;
  addXP: (amount: number) => void;
  useEnergy: (amount: number) => boolean;
  
  addBoardItem: (item: BoardItem) => void;
  removeBoardItem: (id: string) => void;
  updateBoardItem: (id: string, updates: Partial<BoardItem>) => void;
  moveBoardItem: (id: string, x: number, y: number) => void;
  
  addToStorage: (item: BoardItem) => boolean;
  removeFromStorage: (id: string) => void;
  
  plantInGarden: (slotId: number, plantType: string, plantRank: number) => void;
  waterPlant: (slotId: number) => void;
  feedPlant: (slotId: number) => void;
  updateGardenSlots: () => void;
  
  completeTask: (taskId: string) => void;
  
  initializeGame: () => void;
}

const INITIAL_GARDEN_SLOTS: GardenSlot[] = Array.from({ length: 12 }, (_, i) => ({
  id: i,
  occupied: false,
  waterMeter: 100,
  seedMeter: 100,
}));

const INITIAL_DIALOGUES: Dialogue[] = [
  {
    id: 'd1',
    character: 'soly',
    text: "This place... it used to be beautiful. We can fix it.",
    portrait: '/sprites/Picsart_25-11-11_02-25-24-524_1762821030742.png'
  },
  {
    id: 'd2',
    character: 'maria',
    text: "I can already see roses and lanterns. Let's make it ours.",
    portrait: '/sprites/Picsart_25-11-11_02-29-52-444_1762821030715.png'
  },
  {
    id: 'd3',
    character: 'soly',
    text: "We'll start small. Clean the main garden, then expand.",
    portrait: '/sprites/Picsart_25-11-11_02-25-24-524_1762821030742.png'
  },
  {
    id: 'd4',
    character: 'maria',
    text: "I'll pick the flowers. You handle the tools.",
    portrait: '/sprites/Picsart_25-11-11_02-29-52-444_1762821030715.png'
  },
];

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      currentScreen: 'loading',
      showTutorial: true,
      tutorialStep: 0,
      
      resources: {
        coins: 100,
        energy: 100,
        maxEnergy: 100,
        gems: 10,
        xp: 0,
        level: 1,
      },
      
      boardItems: [],
      storageItems: [],
      maxStorage: 10,
      
      gardenSlots: INITIAL_GARDEN_SLOTS,
      
      tasks: [],
      activeDialogues: INITIAL_DIALOGUES,
      
      unlockedGardens: ['main'],
      currentGarden: 'main',
      
      setScreen: (screen) => set({ currentScreen: screen }),
      
      updateResources: (updates) => 
        set((state) => ({
          resources: { ...state.resources, ...updates }
        })),
      
      addCoins: (amount) => 
        set((state) => ({
          resources: { ...state.resources, coins: state.resources.coins + amount }
        })),
      
      addXP: (amount) => 
        set((state) => {
          const newXP = state.resources.xp + amount;
          const newLevel = Math.floor(newXP / 100) + 1;
          return {
            resources: { 
              ...state.resources, 
              xp: newXP,
              level: newLevel 
            }
          };
        }),
      
      useEnergy: (amount) => {
        const { resources } = get();
        if (resources.energy >= amount) {
          set((state) => ({
            resources: { 
              ...state.resources, 
              energy: state.resources.energy - amount 
            }
          }));
          return true;
        }
        return false;
      },
      
      addBoardItem: (item) => 
        set((state) => ({
          boardItems: [...state.boardItems, item]
        })),
      
      removeBoardItem: (id) => 
        set((state) => ({
          boardItems: state.boardItems.filter(item => item.id !== id)
        })),
      
      updateBoardItem: (id, updates) => 
        set((state) => ({
          boardItems: state.boardItems.map(item => 
            item.id === id ? { ...item, ...updates } : item
          )
        })),
      
      moveBoardItem: (id, x, y) => 
        set((state) => ({
          boardItems: state.boardItems.map(item => 
            item.id === id ? { ...item, x, y } : item
          )
        })),
      
      addToStorage: (item) => {
        const { storageItems, maxStorage } = get();
        if (storageItems.length < maxStorage) {
          set((state) => ({
            storageItems: [...state.storageItems, item]
          }));
          return true;
        }
        return false;
      },
      
      removeFromStorage: (id) => 
        set((state) => ({
          storageItems: state.storageItems.filter(item => item.id !== id)
        })),
      
      plantInGarden: (slotId, plantType, plantRank) => 
        set((state) => ({
          gardenSlots: state.gardenSlots.map(slot => 
            slot.id === slotId 
              ? { 
                  ...slot, 
                  occupied: true, 
                  plantType: plantType as any,
                  plantRank,
                  waterMeter: 100,
                  seedMeter: 100,
                  lastWatered: Date.now(),
                  lastFed: Date.now()
                }
              : slot
          )
        })),
      
      waterPlant: (slotId) => 
        set((state) => ({
          gardenSlots: state.gardenSlots.map(slot => 
            slot.id === slotId 
              ? { ...slot, waterMeter: 100, lastWatered: Date.now() }
              : slot
          )
        })),
      
      feedPlant: (slotId) => 
        set((state) => ({
          gardenSlots: state.gardenSlots.map(slot => 
            slot.id === slotId 
              ? { ...slot, seedMeter: 100, lastFed: Date.now() }
              : slot
          )
        })),
      
      updateGardenSlots: () => {
        const now = Date.now();
        const DECAY_RATE = 0.001;
        
        set((state) => ({
          gardenSlots: state.gardenSlots.map(slot => {
            if (!slot.occupied) return slot;
            
            const waterDecay = slot.lastWatered 
              ? (now - slot.lastWatered) * DECAY_RATE 
              : 0;
            const seedDecay = slot.lastFed 
              ? (now - slot.lastFed) * DECAY_RATE 
              : 0;
            
            const newWaterMeter = Math.max(0, slot.waterMeter - waterDecay);
            const newSeedMeter = Math.max(0, slot.seedMeter - seedDecay);
            
            if (newWaterMeter === 0 || newSeedMeter === 0) {
              return {
                ...slot,
                occupied: false,
                plantType: undefined,
                plantRank: undefined,
                waterMeter: 100,
                seedMeter: 100,
              };
            }
            
            return {
              ...slot,
              waterMeter: newWaterMeter,
              seedMeter: newSeedMeter,
            };
          })
        }));
      },
      
      completeTask: (taskId) => 
        set((state) => ({
          tasks: state.tasks.map(task => 
            task.id === taskId ? { ...task, completed: true } : task
          )
        })),
      
      initializeGame: () => {
        const starterItems: BoardItem[] = [
          {
            id: 'starter-1',
            category: 'plant',
            itemType: 'rose',
            rank: 1,
            maxRank: 5,
            x: 1,
            y: 1,
          },
          {
            id: 'starter-2',
            category: 'plant',
            itemType: 'rose',
            rank: 1,
            maxRank: 5,
            x: 2,
            y: 1,
          },
          {
            id: 'starter-3',
            category: 'plant',
            itemType: 'rose',
            rank: 1,
            maxRank: 5,
            x: 3,
            y: 1,
          },
        ];
        
        set({ boardItems: starterItems });
      },
    }),
    {
      name: 'merge-garden-storage',
    }
  )
);
