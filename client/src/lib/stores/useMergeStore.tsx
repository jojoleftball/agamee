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
  isMerging?: boolean;
  mergeTargetPos?: [number, number, number];
}

export interface MergeStore {
  items: MergeItem[];
  selectedItem: string | null;
  draggedItem: string | null;
  gridSize: { rows: number; cols: number };
  initialized: boolean;
  mergeParticles: Array<{ id: string; position: [number, number, number]; color: string }>;
  
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

const cleanupDuplicates = (items: MergeItem[]): MergeItem[] => {
  const seen = new Map<string, MergeItem>();
  return items.filter(item => {
    const key = `${item.x},${item.y}`;
    if (seen.has(key)) {
      console.warn(`Removing duplicate item at (${item.x}, ${item.y})`);
      return false;
    }
    seen.set(key, item);
    return true;
  });
};

export const useMergeStore = create<MergeStore>()(
  persist(
    (set, get) => ({
      items: [],
      selectedItem: null,
      draggedItem: null,
      gridSize: { rows: 6, cols: 6 },
      initialized: false,
      mergeParticles: [],
      
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
        
        set((state) => ({
          items: state.items.map(item => 
            itemsToMerge.some(m => m?.id === item.id)
              ? { ...item, isMerging: true, mergeTargetPos: [position.x, position.y, position.z] }
              : item
          )
        }));
        
        setTimeout(() => {
          const { items, mergeParticles, removeItem, addItem } = get();
          
          itemsToMerge.forEach(item => {
            if (item) removeItem(item.id);
          });
          
          addItem(resultType, position.x, position.y, position.z);
          
          const particleId = `particle_${Date.now()}`;
          set({
            mergeParticles: [
              ...mergeParticles,
              { id: particleId, position: [position.x, position.y + 0.5, position.z], color: '#FFD700' }
            ]
          });
          
          setTimeout(() => {
            set((state) => ({
              mergeParticles: state.mergeParticles.filter(p => p.id !== particleId)
            }));
          }, 1500);
        }, 500);
        
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
      
      clearBoard: () => set({ items: [], selectedItem: null, draggedItem: null, initialized: false }),
      
      setAnimating: (id, animating) =>
        set((state) => ({
          items: state.items.map(item =>
            item.id === id ? { ...item, isAnimating: animating } : item
          )
        }))
    }),
    {
      name: 'merge-storage',
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.items = cleanupDuplicates(state.items);
          console.log('Store rehydrated, cleaned up duplicates');
        }
      }
    }
  )
);

export function validateMergeChains() {
  const errors: string[] = [];
  Object.entries(MERGE_ITEMS).forEach(([key, item]) => {
    if (item.mergesInto && !MERGE_ITEMS[item.mergesInto]) {
      errors.push(`${key} mergesInto '${item.mergesInto}' which doesn't exist`);
    }
  });
  if (errors.length > 0) {
    console.error('MERGE_ITEMS validation errors:', errors);
  } else {
    console.log('MERGE_ITEMS validation passed');
  }
  return errors;
}
