import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { MERGE_ITEMS } from '../mergeItems';

export interface MergeItem {
  id: string;
  itemType: string;
  x: number;
  y: number;
  z: number;
  isAnimating?: boolean;
}

export interface MergeStore {
  items: MergeItem[];
  selectedItem: string | null;
  draggedItem: string | null;
  gridSize: { rows: number; cols: number };
  initialized: boolean;
  
  // Item management
  addItem: (itemType: string, x: number, y: number, z: number) => void;
  removeItem: (id: string) => void;
  moveItem: (id: string, x: number, y: number, z: number) => void;
  selectItem: (id: string | null) => void;
  setDraggedItem: (id: string | null) => void;
  
  // Merge logic
  tryMerge: (item1Id: string, item2Id: string, item3Id?: string) => {
    success: boolean;
    resultType?: string;
    position?: { x: number; y: number; z: number };
  };
  
  // Helper functions
  getItemAt: (x: number, y: number) => MergeItem | undefined;
  isPositionOccupied: (x: number, y: number, excludeId?: string) => boolean;
  findEmptySpot: () => { x: number; y: number; z: number } | null;
  clearBoard: () => void;
  setAnimating: (id: string, animating: boolean) => void;
}

let itemIdCounter = 0;

export const useMergeStore = create<MergeStore>()(
  persist(
    (set, get) => ({
      items: [],
      selectedItem: null,
      draggedItem: null,
      gridSize: { rows: 6, cols: 6 },
      initialized: false,
      
      addItem: (itemType, x, y, z) => {
        const { isPositionOccupied } = get();
        if (isPositionOccupied(x, y)) {
          console.warn(`Cannot add item: position (${x}, ${y}) is occupied`);
          return;
        }
        const newItem: MergeItem = {
          id: `item_${itemIdCounter++}_${Date.now()}`,
          itemType,
          x,
          y,
          z,
          isAnimating: false
        };
        set((state) => ({ items: [...state.items, newItem], initialized: true }));
      },
      
      removeItem: (id) => 
        set((state) => ({ 
          items: state.items.filter(item => item.id !== id) 
        })),
      
      moveItem: (id, x, y, z) => {
        const { items, isPositionOccupied } = get();
        if (isPositionOccupied(x, y, id)) {
          return;
        }
        set({
          items: items.map(item =>
            item.id === id ? { ...item, x, y, z } : item
          )
        });
      },
      
      selectItem: (id) => set({ selectedItem: id }),
      
      setDraggedItem: (id) => set({ draggedItem: id }),
      
      tryMerge: (item1Id, item2Id, item3Id) => {
        const { items, removeItem, addItem } = get();
        const item1 = items.find(i => i.id === item1Id);
        const item2 = items.find(i => i.id === item2Id);
        const item3 = item3Id ? items.find(i => i.id === item3Id) : undefined;
        
        if (!item1 || !item2) {
          return { success: false };
        }
        
        const itemsToMerge = item3 ? [item1, item2, item3] : [item1, item2];
        const allSameType = itemsToMerge.every(item => item?.itemType === item1.itemType);
        
        if (!allSameType) {
          return { success: false };
        }
        
        const itemData = MERGE_ITEMS[item1.itemType];
        if (!itemData || !itemData.mergesInto) {
          console.log('Cannot merge: no merge target defined');
          return { success: false };
        }
        
        const resultType = itemData.mergesInto;
        const resultItemData = MERGE_ITEMS[resultType];
        
        if (!resultItemData) {
          console.error(`Merge target ${resultType} not found in MERGE_ITEMS`);
          return { success: false };
        }
        
        const position = { x: item1.x, y: item1.y, z: item1.z };
        
        itemsToMerge.forEach(item => {
          if (item) removeItem(item.id);
        });
        
        addItem(resultType, position.x, position.y, position.z);
        
        return { success: true, resultType, position };
      },
      
      getItemAt: (x, y) => {
        const { items } = get();
        return items.find(item => item.x === x && item.y === y);
      },
      
      isPositionOccupied: (x, y, excludeId) => {
        const { items } = get();
        return items.some(item => 
          item.x === x && item.y === y && item.id !== excludeId
        );
      },
      
      findEmptySpot: () => {
        const { gridSize, isPositionOccupied } = get();
        for (let y = 0; y < gridSize.rows; y++) {
          for (let x = 0; x < gridSize.cols; x++) {
            if (!isPositionOccupied(x, y)) {
              return { x, y, z: 0 };
            }
          }
        }
        return null;
      },
      
      clearBoard: () => set({ items: [], selectedItem: null, draggedItem: null }),
      
      setAnimating: (id, animating) =>
        set((state) => ({
          items: state.items.map(item =>
            item.id === id ? { ...item, isAnimating: animating } : item
          )
        }))
    }),
    {
      name: 'merge-storage'
    }
  )
);
