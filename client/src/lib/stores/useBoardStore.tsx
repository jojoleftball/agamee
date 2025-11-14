import { create } from "zustand";
import { BoardItem, MERGE_ITEMS, canMerge, getMergeResult, generateStarterItems } from "../mergeItems";
import { getLocalStorage, setLocalStorage } from "../utils";

const BOARD_STORAGE_KEY = "merge_story_board";

interface BoardState {
  items: BoardItem[];
  gridSize: { rows: number; cols: number };
  selectedItem: string | null;
  draggedItem: string | null;
  lastGeneratorUse: number;
  
  addItem: (itemType: string, x: number, y: number) => void;
  removeItem: (id: string) => void;
  moveItem: (id: string, x: number, y: number) => void;
  selectItem: (id: string | null) => void;
  setDraggedItem: (id: string | null) => void;
  tryMerge: (item1Id: string, item2Id: string) => boolean;
  generateItem: () => boolean;
  getItemAt: (x: number, y: number) => BoardItem | undefined;
  isPositionOccupied: (x: number, y: number, excludeId?: string) => boolean;
  initializeBoard: () => void;
  clearBoard: () => void;
  saveBoard: () => void;
  loadBoard: () => void;
}

const GENERATOR_COOLDOWN = 30000;

export const useBoardStore = create<BoardState>((set, get) => ({
  items: [],
  gridSize: { rows: 7, cols: 9 },
  selectedItem: null,
  draggedItem: null,
  lastGeneratorUse: 0,
  
  addItem: (itemType, x, y) => {
    const newItem: BoardItem = {
      id: crypto.randomUUID(),
      itemType,
      x,
      y
    };
    set((state) => ({ items: [...state.items, newItem] }));
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
    
    if (!item1 || !item2) return false;
    
    const mergeItem1 = MERGE_ITEMS[item1.itemType];
    const mergeItem2 = MERGE_ITEMS[item2.itemType];
    
    if (canMerge(mergeItem1, mergeItem2)) {
      const result = getMergeResult(item1.itemType);
      if (result) {
        const newItem: BoardItem = {
          id: crypto.randomUUID(),
          itemType: result.id,
          x: item2.x,
          y: item2.y
        };
        
        set((state) => ({
          items: [
            ...state.items.filter(i => i.id !== item1Id && i.id !== item2Id),
            newItem
          ],
          selectedItem: null,
          draggedItem: null
        }));
        
        get().saveBoard();
        return true;
      }
    }
    
    return false;
  },
  
  generateItem: () => {
    const state = get();
    const now = Date.now();
    
    if (now - state.lastGeneratorUse < GENERATOR_COOLDOWN) {
      return false;
    }
    
    const emptyPositions: {x: number; y: number}[] = [];
    for (let y = 0; y < state.gridSize.rows; y++) {
      for (let x = 0; x < state.gridSize.cols; x++) {
        if (!state.isPositionOccupied(x, y)) {
          emptyPositions.push({ x, y });
        }
      }
    }
    
    if (emptyPositions.length === 0) {
      return false;
    }
    
    const randomPos = emptyPositions[Math.floor(Math.random() * emptyPositions.length)];
    
    const tierRoll = Math.random();
    let tier = 1;
    if (tierRoll > 0.9) tier = 3;
    else if (tierRoll > 0.7) tier = 2;
    
    const itemTypes = [
      `cleaning_${tier}`,
      `repair_${tier}`,
      `decor_${tier}`
    ];
    const randomType = itemTypes[Math.floor(Math.random() * itemTypes.length)];
    
    const newItem: BoardItem = {
      id: crypto.randomUUID(),
      itemType: randomType,
      x: randomPos.x,
      y: randomPos.y
    };
    
    set((state) => ({
      items: [...state.items, newItem],
      lastGeneratorUse: now
    }));
    
    get().saveBoard();
    return true;
  },
  
  getItemAt: (x, y) => {
    return get().items.find(item => item.x === x && item.y === y);
  },
  
  isPositionOccupied: (x, y, excludeId) => {
    return get().items.some(
      item => item.x === x && item.y === y && item.id !== excludeId
    );
  },
  
  initializeBoard: () => {
    const savedBoard = getLocalStorage(BOARD_STORAGE_KEY);
    if (savedBoard && savedBoard.items && savedBoard.items.length > 0) {
      set({ items: savedBoard.items });
      console.log("Board loaded from save");
    } else {
      const starterItems = generateStarterItems();
      set({ items: starterItems });
      get().saveBoard();
      console.log("New board initialized");
    }
  },
  
  clearBoard: () => {
    set({ items: [], selectedItem: null, draggedItem: null });
    get().saveBoard();
  },
  
  saveBoard: () => {
    const state = get();
    setLocalStorage(BOARD_STORAGE_KEY, {
      items: state.items
    });
  },
  
  loadBoard: () => {
    const savedBoard = getLocalStorage(BOARD_STORAGE_KEY);
    if (savedBoard && savedBoard.items) {
      set({ items: savedBoard.items });
    }
  }
}));
