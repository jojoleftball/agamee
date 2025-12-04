import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ItemCategory } from '../mergeData';

export interface AdminMergeItem {
  id: string;
  name: string;
  description: string;
  category: ItemCategory;
  level: number;
  maxLevel: number;
  sprite: string;
  spriteX: number;
  spriteY: number;
  spriteW: number;
  spriteH: number;
  mergesInto?: string;
  coinValue: number;
  xpValue: number;
  sellPrice: number;
  isGenerator?: boolean;
  generates?: string[];
  generationTime?: number;
  maxCharges?: number;
  energyCost?: number;
  isChest?: boolean;
  chestRewards?: {
    coins?: number;
    gems?: number;
    energy?: number;
    items?: string[];
    dropRates?: Record<string, number>;
  };
  isBlocked?: boolean;
}

export interface AdminMergeChain {
  id: string;
  name: string;
  category: ItemCategory;
  items: string[];
}

export interface MapSprite {
  id: string;
  name: string;
  imagePath: string;
  x: number;
  y: number;
  width: number;
  height: number;
  originalWidth: number;
  originalHeight: number;
  zIndex: number;
  isLocked: boolean;
  connections: MapSpriteConnection[];
}

export interface MapSpriteConnection {
  edge: 'top' | 'right' | 'bottom' | 'left';
  targetSpriteId: string;
  targetEdge: 'top' | 'right' | 'bottom' | 'left';
}

export interface AdminGarden {
  id: string;
  name: string;
  description: string;
  background: string;
  unlockLevel: number;
  unlockCoins: number;
  gridSize: { rows: number; cols: number };
  zones: AdminGardenZone[];
  connections: GardenConnection[];
  mapSprites: MapSprite[];
  isUnlocked: boolean;
}

export interface AdminGardenZone {
  id: string;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  sprite?: string;
  isUnlocked: boolean;
  unlockCost: number;
}

export interface GardenConnection {
  fromZoneId: string;
  toZoneId: string;
}

export interface AdminChest {
  id: string;
  name: string;
  description: string;
  sprite: string;
  spriteX: number;
  spriteY: number;
  spriteW: number;
  spriteH: number;
  cost: number;
  costType: 'coins' | 'gems';
  contents: ChestContent[];
}

export interface ChestContent {
  itemId: string;
  minAmount: number;
  maxAmount: number;
  dropRate: number;
}

export interface AdminStoreItem {
  id: string;
  name: string;
  description: string;
  itemId: string;
  price: number;
  priceType: 'coins' | 'gems';
  category: string;
  isLimited: boolean;
  limitCount?: number;
  sprite?: string;
}

export interface AdminEvent {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  rewards: EventReward[];
  tasks: EventTask[];
  sprite?: string;
  bannerColor: string;
}

export interface EventReward {
  id: string;
  itemId: string;
  amount: number;
  requiredPoints: number;
}

export interface EventTask {
  id: string;
  title: string;
  description: string;
  requiredItem: string;
  quantity: number;
  points: number;
}

interface AdminState {
  items: Record<string, AdminMergeItem>;
  mergeChains: AdminMergeChain[];
  gardens: AdminGarden[];
  chests: AdminChest[];
  storeItems: AdminStoreItem[];
  events: AdminEvent[];
  
  selectedItemId: string | null;
  selectedGardenId: string | null;
  selectedChestId: string | null;
  selectedEventId: string | null;
  
  mapViewport: {
    x: number;
    y: number;
    zoom: number;
  };
  
  addItem: (item: AdminMergeItem) => void;
  updateItem: (id: string, updates: Partial<AdminMergeItem>) => void;
  removeItem: (id: string) => void;
  
  addMergeChain: (chain: AdminMergeChain) => void;
  updateMergeChain: (id: string, updates: Partial<AdminMergeChain>) => void;
  removeMergeChain: (id: string) => void;
  
  addGarden: (garden: AdminGarden) => void;
  updateGarden: (id: string, updates: Partial<AdminGarden>) => void;
  removeGarden: (id: string) => void;
  addGardenZone: (gardenId: string, zone: AdminGardenZone) => void;
  updateGardenZone: (gardenId: string, zoneId: string, updates: Partial<AdminGardenZone>) => void;
  removeGardenZone: (gardenId: string, zoneId: string) => void;
  addGardenConnection: (gardenId: string, connection: GardenConnection) => void;
  removeGardenConnection: (gardenId: string, fromZoneId: string, toZoneId: string) => void;
  
  addMapSprite: (gardenId: string, sprite: MapSprite) => void;
  updateMapSprite: (gardenId: string, spriteId: string, updates: Partial<MapSprite>) => void;
  removeMapSprite: (gardenId: string, spriteId: string) => void;
  connectMapSprites: (gardenId: string, spriteId: string, connection: MapSpriteConnection) => void;
  disconnectMapSprites: (gardenId: string, spriteId: string, targetSpriteId: string) => void;
  
  addChest: (chest: AdminChest) => void;
  updateChest: (id: string, updates: Partial<AdminChest>) => void;
  removeChest: (id: string) => void;
  
  addStoreItem: (item: AdminStoreItem) => void;
  updateStoreItem: (id: string, updates: Partial<AdminStoreItem>) => void;
  removeStoreItem: (id: string) => void;
  
  addEvent: (event: AdminEvent) => void;
  updateEvent: (id: string, updates: Partial<AdminEvent>) => void;
  removeEvent: (id: string) => void;
  
  setSelectedItemId: (id: string | null) => void;
  setSelectedGardenId: (id: string | null) => void;
  setSelectedChestId: (id: string | null) => void;
  setSelectedEventId: (id: string | null) => void;
  
  setMapViewport: (viewport: { x?: number; y?: number; zoom?: number }) => void;
  
  importConfig: (config: Partial<AdminState>) => void;
  exportConfig: () => object;
  resetToDefaults: () => void;
}

const getDefaultState = () => ({
  items: {},
  mergeChains: [],
  gardens: [
    {
      id: 'main_garden',
      name: 'Main Garden',
      description: 'Your starting garden',
      background: 'basic',
      unlockLevel: 1,
      unlockCoins: 0,
      gridSize: { rows: 10, cols: 8 },
      zones: [],
      connections: [],
      mapSprites: [],
      isUnlocked: true,
    },
  ],
  chests: [],
  storeItems: [],
  events: [],
  selectedItemId: null,
  selectedGardenId: null,
  selectedChestId: null,
  selectedEventId: null,
  mapViewport: { x: 0, y: 0, zoom: 1 },
});

export const useAdminStore = create<AdminState>()(
  persist(
    (set, get) => ({
      ...getDefaultState(),

      addItem: (item) => set((state) => ({
        items: { ...state.items, [item.id]: item },
      })),

      updateItem: (id, updates) => set((state) => ({
        items: {
          ...state.items,
          [id]: { ...state.items[id], ...updates },
        },
      })),

      removeItem: (id) => set((state) => {
        const newItems = { ...state.items };
        delete newItems[id];
        return { items: newItems };
      }),

      addMergeChain: (chain) => set((state) => ({
        mergeChains: [...state.mergeChains, chain],
      })),

      updateMergeChain: (id, updates) => set((state) => ({
        mergeChains: state.mergeChains.map((chain) =>
          chain.id === id ? { ...chain, ...updates } : chain
        ),
      })),

      removeMergeChain: (id) => set((state) => ({
        mergeChains: state.mergeChains.filter((chain) => chain.id !== id),
      })),

      addGarden: (garden) => set((state) => ({
        gardens: [...state.gardens, garden],
      })),

      updateGarden: (id, updates) => set((state) => ({
        gardens: state.gardens.map((garden) =>
          garden.id === id ? { ...garden, ...updates } : garden
        ),
      })),

      removeGarden: (id) => set((state) => ({
        gardens: state.gardens.filter((garden) => garden.id !== id),
      })),

      addGardenZone: (gardenId, zone) => set((state) => ({
        gardens: state.gardens.map((garden) =>
          garden.id === gardenId
            ? { ...garden, zones: [...garden.zones, zone] }
            : garden
        ),
      })),

      updateGardenZone: (gardenId, zoneId, updates) => set((state) => ({
        gardens: state.gardens.map((garden) =>
          garden.id === gardenId
            ? {
                ...garden,
                zones: garden.zones.map((zone) =>
                  zone.id === zoneId ? { ...zone, ...updates } : zone
                ),
              }
            : garden
        ),
      })),

      removeGardenZone: (gardenId, zoneId) => set((state) => ({
        gardens: state.gardens.map((garden) =>
          garden.id === gardenId
            ? {
                ...garden,
                zones: garden.zones.filter((zone) => zone.id !== zoneId),
              }
            : garden
        ),
      })),

      addGardenConnection: (gardenId, connection) => set((state) => ({
        gardens: state.gardens.map((garden) =>
          garden.id === gardenId
            ? { ...garden, connections: [...garden.connections, connection] }
            : garden
        ),
      })),

      removeGardenConnection: (gardenId, fromZoneId, toZoneId) => set((state) => ({
        gardens: state.gardens.map((garden) =>
          garden.id === gardenId
            ? {
                ...garden,
                connections: garden.connections.filter(
                  (c) => !(c.fromZoneId === fromZoneId && c.toZoneId === toZoneId)
                ),
              }
            : garden
        ),
      })),

      addMapSprite: (gardenId, sprite) => set((state) => ({
        gardens: state.gardens.map((garden) =>
          garden.id === gardenId
            ? { ...garden, mapSprites: [...(garden.mapSprites || []), sprite] }
            : garden
        ),
      })),

      updateMapSprite: (gardenId, spriteId, updates) => set((state) => ({
        gardens: state.gardens.map((garden) =>
          garden.id === gardenId
            ? {
                ...garden,
                mapSprites: (garden.mapSprites || []).map((sprite) =>
                  sprite.id === spriteId ? { ...sprite, ...updates } : sprite
                ),
              }
            : garden
        ),
      })),

      removeMapSprite: (gardenId, spriteId) => set((state) => ({
        gardens: state.gardens.map((garden) =>
          garden.id === gardenId
            ? {
                ...garden,
                mapSprites: (garden.mapSprites || []).filter((sprite) => sprite.id !== spriteId),
              }
            : garden
        ),
      })),

      connectMapSprites: (gardenId, spriteId, connection) => set((state) => ({
        gardens: state.gardens.map((garden) =>
          garden.id === gardenId
            ? {
                ...garden,
                mapSprites: (garden.mapSprites || []).map((sprite) =>
                  sprite.id === spriteId
                    ? { ...sprite, connections: [...sprite.connections, connection] }
                    : sprite
                ),
              }
            : garden
        ),
      })),

      disconnectMapSprites: (gardenId, spriteId, targetSpriteId) => set((state) => ({
        gardens: state.gardens.map((garden) =>
          garden.id === gardenId
            ? {
                ...garden,
                mapSprites: (garden.mapSprites || []).map((sprite) =>
                  sprite.id === spriteId
                    ? {
                        ...sprite,
                        connections: sprite.connections.filter(
                          (c) => c.targetSpriteId !== targetSpriteId
                        ),
                      }
                    : sprite
                ),
              }
            : garden
        ),
      })),

      addChest: (chest) => set((state) => ({
        chests: [...state.chests, chest],
      })),

      updateChest: (id, updates) => set((state) => ({
        chests: state.chests.map((chest) =>
          chest.id === id ? { ...chest, ...updates } : chest
        ),
      })),

      removeChest: (id) => set((state) => ({
        chests: state.chests.filter((chest) => chest.id !== id),
      })),

      addStoreItem: (item) => set((state) => ({
        storeItems: [...state.storeItems, item],
      })),

      updateStoreItem: (id, updates) => set((state) => ({
        storeItems: state.storeItems.map((item) =>
          item.id === id ? { ...item, ...updates } : item
        ),
      })),

      removeStoreItem: (id) => set((state) => ({
        storeItems: state.storeItems.filter((item) => item.id !== id),
      })),

      addEvent: (event) => set((state) => ({
        events: [...state.events, event],
      })),

      updateEvent: (id, updates) => set((state) => ({
        events: state.events.map((event) =>
          event.id === id ? { ...event, ...updates } : event
        ),
      })),

      removeEvent: (id) => set((state) => ({
        events: state.events.filter((event) => event.id !== id),
      })),

      setSelectedItemId: (id) => set({ selectedItemId: id }),
      setSelectedGardenId: (id) => set({ selectedGardenId: id }),
      setSelectedChestId: (id) => set({ selectedChestId: id }),
      setSelectedEventId: (id) => set({ selectedEventId: id }),

      setMapViewport: (viewport) => set((state) => ({
        mapViewport: { ...state.mapViewport, ...viewport },
      })),

      importConfig: (config) => set((state) => ({
        ...state,
        ...config,
      })),

      exportConfig: () => {
        const state = get();
        return {
          items: state.items,
          mergeChains: state.mergeChains,
          gardens: state.gardens,
          chests: state.chests,
          storeItems: state.storeItems,
          events: state.events,
        };
      },

      resetToDefaults: () => set(getDefaultState()),
    }),
    {
      name: 'merge-garden-admin-storage',
      partialize: (state) => ({
        items: state.items,
        mergeChains: state.mergeChains,
        gardens: state.gardens,
        chests: state.chests,
        storeItems: state.storeItems,
        events: state.events,
      }),
    }
  )
);
