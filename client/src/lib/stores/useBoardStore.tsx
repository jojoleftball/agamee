import { create } from "zustand";
import { BoardItem, MERGE_ITEMS, canMerge, getMergeResult, generateStarterItems } from "../mergeItems";
import { getLocalStorage, setLocalStorage } from "../utils";
import { useMergeGame } from "./useMergeGame";

const BOARD_STORAGE_KEY = "merge_story_board";
const INVENTORY_STORAGE_KEY = "merge_story_inventory";

interface BoardState {
  items: BoardItem[];
  inventory: BoardItem[]; // Storage area (max 10 items)
  maxInventorySize: number;
  gridSize: { rows: number; cols: number };
  selectedItem: string | null;
  draggedItem: string | null;
  lastGeneratorUse: number;
  discoveredItems: Set<string>; // Track which items player has seen
  
  // Board operations
  addItem: (itemType: string, x: number, y: number) => void;
  removeItem: (id: string) => void;
  moveItem: (id: string, x: number, y: number) => void;
  selectItem: (id: string | null) => void;
  setDraggedItem: (id: string | null) => void;
  tryMerge: (item1Id: string, item2Id: string) => { success: boolean; xpGained?: number; coinsGained?: number };
  
  // Generator operations
  tapGenerator: (itemId: string) => { success: boolean; generatedItem?: string };
  canTapGenerator: (itemId: string) => boolean;
  
  // Chest operations
  openChest: (itemId: string) => { coins: number; gems: number; energy: number; items: string[] } | null;
  
  // Inventory operations
  moveToInventory: (itemId: string) => boolean;
  moveFromInventory: (itemId: string, x: number, y: number) => boolean;
  isInventoryFull: () => boolean;
  
  // Blocked tile operations
  isBlocked: (x: number, y: number) => boolean;
  unblockTile: (itemId: string) => void;
  
  // Sell/Undo operations
  sellItem: (itemId: string) => number; // Returns coins gained
  lastSold: BoardItem | null;
  undoSell: () => boolean;
  
  // Helper functions
  findEmptySpot: () => { x: number; y: number } | null;
  getItemAt: (x: number, y: number) => BoardItem | undefined;
  isPositionOccupied: (x: number, y: number, excludeId?: string) => boolean;
  discoverItem: (itemType: string) => void;
  hasDiscovered: (itemType: string) => boolean;
  
  // Board management
  initializeBoard: () => void;
  clearBoard: () => void;
  saveBoard: () => void;
  loadBoard: () => void;
}

const GENERATOR_COOLDOWN = 30000;

export const useBoardStore = create<BoardState>((set, get) => ({
  items: [],
  inventory: [],
  maxInventorySize: 10,
  gridSize: { rows: 7, cols: 9 },
  selectedItem: null,
  draggedItem: null,
  lastGeneratorUse: 0,
  discoveredItems: new Set<string>(),
  lastSold: null,
  
  addItem: (itemType, x, y) => {
    const newItem: BoardItem = {
      id: crypto.randomUUID(),
      itemType,
      x,
      y,
      charges: MERGE_ITEMS[itemType]?.maxCharges || undefined,
      isBlocked: MERGE_ITEMS[itemType]?.isBlocked || false
    };
    set((state) => ({ items: [...state.items, newItem] }));
    get().discoverItem(itemType);
    get().saveBoard();
  },
  
  removeItem: (id) => {
    set((state) => ({
      items: state.items.filter(item => item.id !== id)
    }));
    get().saveBoard();
  },
  
  moveItem: (id, x, y) => {
    set((state) => ({
      items: state.items.map(item =>
        item.id === id ? { ...item, x, y } : item
      )
    }));
    get().saveBoard();
  },
  
  selectItem: (id) => {
    set({ selectedItem: id });
  },
  
  setDraggedItem: (id) => {
    set({ draggedItem: id });
  },
  
  tryMerge: (item1Id, item2Id) => {
    const state = get();
    const item1 = state.items.find(i => i.id === item1Id);
    const item2 = state.items.find(i => i.id === item2Id);
    
    if (!item1 || !item2) return { success: false };
    
    // Can't merge blocked items
    if (item1.isBlocked || item2.isBlocked) return { success: false };
    
    const mergeItem1 = MERGE_ITEMS[item1.itemType];
    const mergeItem2 = MERGE_ITEMS[item2.itemType];
    
    if (canMerge(mergeItem1, mergeItem2)) {
      const result = getMergeResult(item1.itemType);
      if (result) {
        const newItem: BoardItem = {
          id: crypto.randomUUID(),
          itemType: result.id,
          x: item2.x,
          y: item2.y,
          charges: result.maxCharges || undefined,
          isBlocked: false
        };
        
        set((state) => ({
          items: [
            ...state.items.filter(i => i.id !== item1Id && i.id !== item2Id),
            newItem
          ],
          selectedItem: null,
          draggedItem: null
        }));
        
        get().discoverItem(result.id);
        
        // Award XP and coins
        const xpGained = result.xpValue;
        const coinsGained = Math.floor(result.coinValue * 0.1); // 10% of item value
        
        useMergeGame.getState().addXP(xpGained);
        useMergeGame.getState().addCoins(coinsGained);
        
        get().saveBoard();
        return { success: true, xpGained, coinsGained };
      }
    }
    
    return { success: false };
  },
  
  tapGenerator: (itemId) => {
    const state = get();
    const item = state.items.find(i => i.id === itemId) || state.inventory.find(i => i.id === itemId);
    if (!item) return { success: false };
    
    const itemData = MERGE_ITEMS[item.itemType];
    if (!itemData?.isGenerator) return { success: false };
    
    // Check if generator has charges
    if (item.charges === undefined || item.charges <= 0) return { success: false };
    
    // Check energy cost
    const energyCost = itemData.energyCost || 5;
    if (!useMergeGame.getState().spendEnergy(energyCost)) {
      return { success: false };
    }
    
    // Check cooldown
    const now = Date.now();
    const cooldown = itemData.generationTime || 60000;
    if (item.lastGenerated && (now - item.lastGenerated) < cooldown) {
      return { success: false };
    }
    
    // Generate random item from pool
    const generatePool = itemData.generates || [];
    if (generatePool.length === 0) return { success: false };
    
    const randomItemType = generatePool[Math.floor(Math.random() * generatePool.length)];
    
    // Find empty spot
    const emptySpot = get().findEmptySpot();
    if (!emptySpot) return { success: false };
    
    // Create the item
    get().addItem(randomItemType, emptySpot.x, emptySpot.y);
    
    // Update generator
    const updatedItem = { ...item, charges: item.charges - 1, lastGenerated: now };
    
    set((state) => ({
      items: state.items.map(i => i.id === itemId ? updatedItem : i),
      inventory: state.inventory.map(i => i.id === itemId ? updatedItem : i)
    }));
    
    get().saveBoard();
    return { success: true, generatedItem: randomItemType };
  },
  
  canTapGenerator: (itemId) => {
    const state = get();
    const item = state.items.find(i => i.id === itemId) || state.inventory.find(i => i.id === itemId);
    if (!item) return false;
    
    const itemData = MERGE_ITEMS[item.itemType];
    if (!itemData?.isGenerator) return false;
    
    if (item.charges === undefined || item.charges <= 0) return false;
    
    const now = Date.now();
    const cooldown = itemData.generationTime || 60000;
    if (item.lastGenerated && (now - item.lastGenerated) < cooldown) {
      return false;
    }
    
    return true;
  },
  
  openChest: (itemId) => {
    const state = get();
    const item = state.items.find(i => i.id === itemId);
    if (!item) return null;
    
    const itemData = MERGE_ITEMS[item.itemType];
    if (!itemData?.isChest || !itemData.chestRewards) return null;
    
    const rewards = itemData.chestRewards;
    
    // Give rewards
    if (rewards.coins) useMergeGame.getState().addCoins(rewards.coins);
    if (rewards.gems) useMergeGame.getState().addGems(rewards.gems);
    if (rewards.energy) useMergeGame.getState().addEnergy(rewards.energy);
    
    // Add random items to board
    const itemsGiven: string[] = [];
    if (rewards.items && rewards.items.length > 0) {
      const numItems = Math.min(3, rewards.items.length);
      for (let i = 0; i < numItems; i++) {
        const randomItem = rewards.items[Math.floor(Math.random() * rewards.items.length)];
        const emptySpot = get().findEmptySpot();
        if (emptySpot) {
          get().addItem(randomItem, emptySpot.x, emptySpot.y);
          itemsGiven.push(randomItem);
        }
      }
    }
    
    // Remove chest
    get().removeItem(itemId);
    
    return {
      coins: rewards.coins || 0,
      gems: rewards.gems || 0,
      energy: rewards.energy || 0,
      items: itemsGiven
    };
  },
  
  moveToInventory: (itemId) => {
    const state = get();
    if (state.inventory.length >= state.maxInventorySize) return false;
    
    const item = state.items.find(i => i.id === itemId);
    if (!item || item.isBlocked) return false;
    
    set((state) => ({
      items: state.items.filter(i => i.id !== itemId),
      inventory: [...state.inventory, { ...item, x: -1, y: -1 }]
    }));
    
    get().saveBoard();
    return true;
  },
  
  moveFromInventory: (itemId, x, y) => {
    const state = get();
    const item = state.inventory.find(i => i.id === itemId);
    if (!item) return false;
    
    if (get().isPositionOccupied(x, y)) return false;
    
    set((state) => ({
      inventory: state.inventory.filter(i => i.id !== itemId),
      items: [...state.items, { ...item, x, y }]
    }));
    
    get().saveBoard();
    return true;
  },
  
  isInventoryFull: () => {
    return get().inventory.length >= get().maxInventorySize;
  },
  
  isBlocked: (x, y) => {
    const item = get().getItemAt(x, y);
    return item?.isBlocked || false;
  },
  
  unblockTile: (itemId) => {
    set((state) => ({
      items: state.items.map(item =>
        item.id === itemId ? { ...item, isBlocked: false } : item
      )
    }));
    get().saveBoard();
  },
  
  sellItem: (itemId) => {
    const state = get();
    const item = state.items.find(i => i.id === itemId);
    if (!item) return 0;
    
    const itemData = MERGE_ITEMS[item.itemType];
    const sellValue = Math.floor(itemData.coinValue * 0.5);
    
    // Store for undo
    set({ lastSold: item });
    
    // Remove and give coins
    get().removeItem(itemId);
    useMergeGame.getState().addCoins(sellValue);
    
    return sellValue;
  },
  
  undoSell: () => {
    const state = get();
    if (!state.lastSold) return false;
    
    const itemData = MERGE_ITEMS[state.lastSold.itemType];
    const sellValue = Math.floor(itemData.coinValue * 0.5);
    
    // Return the item
    set((state) => ({
      items: [...state.items, state.lastSold!],
      lastSold: null
    }));
    
    // Deduct coins
    useMergeGame.getState().spendCoins(sellValue);
    
    get().saveBoard();
    return true;
  },
  
  findEmptySpot: () => {
    const state = get();
    for (let y = 0; y < state.gridSize.rows; y++) {
      for (let x = 0; x < state.gridSize.cols; x++) {
        if (!state.isPositionOccupied(x, y) && !get().isBlocked(x, y)) {
          return { x, y };
        }
      }
    }
    return null;
  },
  
  getItemAt: (x, y) => {
    return get().items.find(item => item.x === x && item.y === y);
  },
  
  isPositionOccupied: (x, y, excludeId) => {
    return get().items.some(
      item => item.x === x && item.y === y && item.id !== excludeId
    );
  },
  
  discoverItem: (itemType) => {
    set((state) => {
      const newDiscovered = new Set(state.discoveredItems);
      newDiscovered.add(itemType);
      return { discoveredItems: newDiscovered };
    });
  },
  
  hasDiscovered: (itemType) => {
    return get().discoveredItems.has(itemType);
  },
  
  initializeBoard: () => {
    const savedBoard = getLocalStorage(BOARD_STORAGE_KEY);
    const savedInventory = getLocalStorage(INVENTORY_STORAGE_KEY);
    
    if (savedBoard && savedBoard.items && savedBoard.items.length > 0) {
      set({ 
        items: savedBoard.items,
        discoveredItems: new Set(savedBoard.discoveredItems || [])
      });
      console.log("Board loaded from save");
    } else {
      const starterItems = generateStarterItems();
      const discovered = new Set<string>();
      starterItems.forEach(item => discovered.add(item.itemType));
      
      set({ 
        items: starterItems,
        discoveredItems: discovered
      });
      get().saveBoard();
      console.log("New board initialized");
    }
    
    if (savedInventory && savedInventory.inventory) {
      set({ inventory: savedInventory.inventory });
    }
  },
  
  clearBoard: () => {
    set({ 
      items: [], 
      inventory: [],
      selectedItem: null, 
      draggedItem: null,
      discoveredItems: new Set(),
      lastSold: null
    });
    get().saveBoard();
  },
  
  saveBoard: () => {
    const state = get();
    setLocalStorage(BOARD_STORAGE_KEY, {
      items: state.items,
      discoveredItems: Array.from(state.discoveredItems)
    });
    setLocalStorage(INVENTORY_STORAGE_KEY, {
      inventory: state.inventory
    });
  },
  
  loadBoard: () => {
    const savedBoard = getLocalStorage(BOARD_STORAGE_KEY);
    const savedInventory = getLocalStorage(INVENTORY_STORAGE_KEY);
    
    if (savedBoard && savedBoard.items) {
      set({ 
        items: savedBoard.items,
        discoveredItems: new Set(savedBoard.discoveredItems || [])
      });
    }
    
    if (savedInventory && savedInventory.inventory) {
      set({ inventory: savedInventory.inventory });
    }
  }
}));
