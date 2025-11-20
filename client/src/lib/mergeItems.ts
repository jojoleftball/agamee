// Comprehensive Merge Mansion-style item system for Beach House game

export type ItemCategory = 
  | 'tool' // Beach cleaning & repair tools
  | 'furniture' // Beach house furniture
  | 'plant' // Garden plants and decorations
  | 'beach' // Beach-specific items
  | 'generator' // Producers that generate items
  | 'chest' // Reward chests
  | 'currency' // Coins, gems, piggy banks
  | 'special' // Special items
  | 'blocked'; // Blocked tiles

export interface MergeItem {
  id: string;
  name: string;
  level: number;
  category: ItemCategory;
  spriteSheet: string;
  spriteIndex: number;
  mergesInto?: string;
  description: string;
  coinValue: number;
  xpValue: number;
  
  // Generator properties
  isGenerator?: boolean;
  generates?: string[]; // Item IDs it can generate
  generationTime?: number; // Milliseconds
  maxCharges?: number; // How many items it can hold
  energyCost?: number; // Energy cost to tap
  
  // Chest properties
  isChest?: boolean;
  chestRewards?: {
    coins?: number;
    gems?: number;
    energy?: number;
    items?: string[]; // Random items it can give
  };
  
  // Blocked tile properties
  isBlocked?: boolean;
  blockedUntilMerge?: boolean; // Requires merging to unlock
}

export interface BoardItem {
  id: string;
  itemType: string;
  x: number;
  y: number;
  charges?: number; // For generators
  lastGenerated?: number; // Timestamp for generators
  isBlocked?: boolean; // For blocked tiles
}

// ============ TOOL CHAIN (Beach Cleaning & Repair) ============
// Based on Merge Mansion's tool barrel chain
const toolChain: Record<string, MergeItem> = {
  'tool_1': {
    id: 'tool_1',
    name: 'Beach Shovel',
    level: 1,
    category: 'tool',
    spriteSheet: '/items-repair.png',
    spriteIndex: 0,
    mergesInto: 'tool_2',
    description: 'A small shovel for digging in sand',
    coinValue: 5,
    xpValue: 2
  },
  'tool_2': {
    id: 'tool_2',
    name: 'Sand Rake',
    level: 2,
    category: 'tool',
    spriteSheet: '/items-repair.png',
    spriteIndex: 1,
    mergesInto: 'tool_3',
    description: 'For raking and smoothing sand',
    coinValue: 15,
    xpValue: 5
  },
  'tool_3': {
    id: 'tool_3',
    name: 'Beach Broom',
    level: 3,
    category: 'tool',
    spriteSheet: '/items-repair.png',
    spriteIndex: 2,
    mergesInto: 'tool_4',
    description: 'Sweeps away debris',
    coinValue: 40,
    xpValue: 10
  },
  'tool_4': {
    id: 'tool_4',
    name: 'Cleaning Brush Set',
    level: 4,
    category: 'tool',
    spriteSheet: '/items-repair.png',
    spriteIndex: 3,
    mergesInto: 'tool_5',
    description: 'Various brushes for cleaning',
    coinValue: 100,
    xpValue: 20
  },
  'tool_5': {
    id: 'tool_5',
    name: 'Power Washer',
    level: 5,
    category: 'tool',
    spriteSheet: '/items-repair.png',
    spriteIndex: 4,
    mergesInto: 'tool_6',
    description: 'Blasts away grime',
    coinValue: 250,
    xpValue: 40
  },
  'tool_6': {
    id: 'tool_6',
    name: 'Beach Tool Kit',
    level: 6,
    category: 'tool',
    spriteSheet: '/items-repair.png',
    spriteIndex: 0,
    mergesInto: 'tool_7',
    description: 'Complete set of beach tools',
    coinValue: 600,
    xpValue: 80
  },
  'tool_7': {
    id: 'tool_7',
    name: 'Professional Cleaning Gear',
    level: 7,
    category: 'tool',
    spriteSheet: '/items-repair.png',
    spriteIndex: 1,
    mergesInto: 'tool_8',
    description: 'Top-grade cleaning equipment',
    coinValue: 1500,
    xpValue: 150
  },
  'tool_8': {
    id: 'tool_8',
    name: 'Industrial Beach Cleaner',
    level: 8,
    category: 'tool',
    spriteSheet: '/items-repair.png',
    spriteIndex: 2,
    description: 'Ultimate cleaning power',
    coinValue: 3500,
    xpValue: 300
  }
};

// ============ PLANT CHAIN (Garden & Beach Flora) ============
const plantChain: Record<string, MergeItem> = {
  'plant_1': {
    id: 'plant_1',
    name: 'Seed Packet',
    level: 1,
    category: 'plant',
    spriteSheet: '/items-decor.png',
    spriteIndex: 0,
    mergesInto: 'plant_2',
    description: 'Contains mystery seeds',
    coinValue: 8,
    xpValue: 3
  },
  'plant_2': {
    id: 'plant_2',
    name: 'Sprout',
    level: 2,
    category: 'plant',
    spriteSheet: '/items-decor.png',
    spriteIndex: 1,
    mergesInto: 'plant_3',
    description: 'A tiny green shoot',
    coinValue: 20,
    xpValue: 6
  },
  'plant_3': {
    id: 'plant_3',
    name: 'Small Palm',
    level: 3,
    category: 'plant',
    spriteSheet: '/items-decor.png',
    spriteIndex: 2,
    mergesInto: 'plant_4',
    description: 'Baby palm tree',
    coinValue: 50,
    xpValue: 12
  },
  'plant_4': {
    id: 'plant_4',
    name: 'Beach Flowers',
    level: 4,
    category: 'plant',
    spriteSheet: '/items-decor.png',
    spriteIndex: 3,
    mergesInto: 'plant_5',
    description: 'Colorful tropical flowers',
    coinValue: 120,
    xpValue: 25
  },
  'plant_5': {
    id: 'plant_5',
    name: 'Tropical Bush',
    level: 5,
    category: 'plant',
    spriteSheet: '/items-decor.png',
    spriteIndex: 4,
    mergesInto: 'plant_6',
    description: 'Lush tropical vegetation',
    coinValue: 300,
    xpValue: 50
  },
  'plant_6': {
    id: 'plant_6',
    name: 'Palm Tree',
    level: 6,
    category: 'plant',
    spriteSheet: '/items-decor.png',
    spriteIndex: 0,
    mergesInto: 'plant_7',
    description: 'Full-grown palm tree',
    coinValue: 750,
    xpValue: 100
  },
  'plant_7': {
    id: 'plant_7',
    name: 'Tropical Garden',
    level: 7,
    category: 'plant',
    spriteSheet: '/items-decor.png',
    spriteIndex: 1,
    mergesInto: 'plant_8',
    description: 'Beautiful garden arrangement',
    coinValue: 1800,
    xpValue: 200
  },
  'plant_8': {
    id: 'plant_8',
    name: 'Paradise Garden',
    level: 8,
    category: 'plant',
    spriteSheet: '/items-decor.png',
    spriteIndex: 2,
    mergesInto: 'plant_9',
    description: 'Stunning tropical paradise',
    coinValue: 4200,
    xpValue: 400
  },
  'plant_9': {
    id: 'plant_9',
    name: 'Golden Palm',
    level: 9,
    category: 'plant',
    spriteSheet: '/items-decor.png',
    spriteIndex: 3,
    description: 'Legendary golden palm tree',
    coinValue: 10000,
    xpValue: 800
  }
};

// ============ FURNITURE CHAIN (Beach House Furniture) ============
const furnitureChain: Record<string, MergeItem> = {
  'furniture_1': {
    id: 'furniture_1',
    name: 'Wood Plank',
    level: 1,
    category: 'furniture',
    spriteSheet: '/items-cleaning.png',
    spriteIndex: 0,
    mergesInto: 'furniture_2',
    description: 'Basic building material',
    coinValue: 10,
    xpValue: 4
  },
  'furniture_2': {
    id: 'furniture_2',
    name: 'Wooden Stool',
    level: 2,
    category: 'furniture',
    spriteSheet: '/items-cleaning.png',
    spriteIndex: 1,
    mergesInto: 'furniture_3',
    description: 'Simple seating',
    coinValue: 25,
    xpValue: 8
  },
  'furniture_3': {
    id: 'furniture_3',
    name: 'Beach Chair',
    level: 3,
    category: 'furniture',
    spriteSheet: '/items-cleaning.png',
    spriteIndex: 2,
    mergesInto: 'furniture_4',
    description: 'Comfortable beach chair',
    coinValue: 60,
    xpValue: 15
  },
  'furniture_4': {
    id: 'furniture_4',
    name: 'Lounge Set',
    level: 4,
    category: 'furniture',
    spriteSheet: '/items-cleaning.png',
    spriteIndex: 3,
    mergesInto: 'furniture_5',
    description: 'Matching chairs and table',
    coinValue: 150,
    xpValue: 30
  },
  'furniture_5': {
    id: 'furniture_5',
    name: 'Beach Cabana',
    level: 5,
    category: 'furniture',
    spriteSheet: '/items-cleaning.png',
    spriteIndex: 4,
    mergesInto: 'furniture_6',
    description: 'Shaded beach retreat',
    coinValue: 400,
    xpValue: 60
  },
  'furniture_6': {
    id: 'furniture_6',
    name: 'Patio Furniture Set',
    level: 6,
    category: 'furniture',
    spriteSheet: '/items-cleaning.png',
    spriteIndex: 0,
    mergesInto: 'furniture_7',
    description: 'Complete outdoor set',
    coinValue: 1000,
    xpValue: 120
  },
  'furniture_7': {
    id: 'furniture_7',
    name: 'Luxury Deck',
    level: 7,
    category: 'furniture',
    spriteSheet: '/items-cleaning.png',
    spriteIndex: 1,
    mergesInto: 'furniture_8',
    description: 'Premium deck furniture',
    coinValue: 2500,
    xpValue: 240
  },
  'furniture_8': {
    id: 'furniture_8',
    name: 'Beach House Suite',
    level: 8,
    category: 'furniture',
    spriteSheet: '/items-cleaning.png',
    spriteIndex: 2,
    description: 'Complete luxury furniture',
    coinValue: 6000,
    xpValue: 480
  }
};

// ============ GENERATOR CHAIN (Producers) ============
// These generate base items when tapped
const generatorChain: Record<string, MergeItem> = {
  'gen_toolbox_1': {
    id: 'gen_toolbox_1',
    name: 'Tool Crate',
    level: 1,
    category: 'generator',
    spriteSheet: '/items-repair.png',
    spriteIndex: 4,
    mergesInto: 'gen_toolbox_2',
    description: 'Generates beach tools',
    coinValue: 50,
    xpValue: 20,
    isGenerator: true,
    generates: ['tool_1', 'tool_2'],
    generationTime: 60000, // 1 minute
    maxCharges: 3,
    energyCost: 5
  },
  'gen_toolbox_2': {
    id: 'gen_toolbox_2',
    name: 'Tool Barrel',
    level: 2,
    category: 'generator',
    spriteSheet: '/items-repair.png',
    spriteIndex: 3,
    mergesInto: 'gen_toolbox_3',
    description: 'Generates better tools faster',
    coinValue: 150,
    xpValue: 40,
    isGenerator: true,
    generates: ['tool_1', 'tool_2', 'tool_3'],
    generationTime: 45000, // 45 seconds
    maxCharges: 4,
    energyCost: 5
  },
  'gen_toolbox_3': {
    id: 'gen_toolbox_3',
    name: 'Workshop',
    level: 3,
    category: 'generator',
    spriteSheet: '/items-repair.png',
    spriteIndex: 2,
    description: 'Premium tool generator',
    coinValue: 500,
    xpValue: 80,
    isGenerator: true,
    generates: ['tool_2', 'tool_3', 'tool_4'],
    generationTime: 30000, // 30 seconds
    maxCharges: 5,
    energyCost: 5
  },
  'gen_plantpot_1': {
    id: 'gen_plantpot_1',
    name: 'Seed Bag',
    level: 1,
    category: 'generator',
    spriteSheet: '/items-decor.png',
    spriteIndex: 4,
    mergesInto: 'gen_plantpot_2',
    description: 'Generates seeds and plants',
    coinValue: 40,
    xpValue: 15,
    isGenerator: true,
    generates: ['plant_1', 'plant_2'],
    generationTime: 50000,
    maxCharges: 3,
    energyCost: 5
  },
  'gen_plantpot_2': {
    id: 'gen_plantpot_2',
    name: 'Flower Pot',
    level: 2,
    category: 'generator',
    spriteSheet: '/items-decor.png',
    spriteIndex: 3,
    mergesInto: 'gen_plantpot_3',
    description: 'Grows plants faster',
    coinValue: 120,
    xpValue: 30,
    isGenerator: true,
    generates: ['plant_1', 'plant_2', 'plant_3'],
    generationTime: 40000,
    maxCharges: 4,
    energyCost: 5
  },
  'gen_plantpot_3': {
    id: 'gen_plantpot_3',
    name: 'Garden Box',
    level: 3,
    category: 'generator',
    spriteSheet: '/items-decor.png',
    spriteIndex: 2,
    description: 'Premium plant generator',
    coinValue: 400,
    xpValue: 60,
    isGenerator: true,
    generates: ['plant_2', 'plant_3', 'plant_4'],
    generationTime: 30000,
    maxCharges: 5,
    energyCost: 5
  },
  'gen_material_1': {
    id: 'gen_material_1',
    name: 'Scrap Pile',
    level: 1,
    category: 'generator',
    spriteSheet: '/items-cleaning.png',
    spriteIndex: 4,
    mergesInto: 'gen_material_2',
    description: 'Generates building materials',
    coinValue: 45,
    xpValue: 18,
    isGenerator: true,
    generates: ['furniture_1', 'furniture_2'],
    generationTime: 55000,
    maxCharges: 3,
    energyCost: 5
  },
  'gen_material_2': {
    id: 'gen_material_2',
    name: 'Material Crate',
    level: 2,
    category: 'generator',
    spriteSheet: '/items-cleaning.png',
    spriteIndex: 3,
    description: 'Better material source',
    coinValue: 135,
    xpValue: 36,
    isGenerator: true,
    generates: ['furniture_1', 'furniture_2', 'furniture_3'],
    generationTime: 40000,
    maxCharges: 4,
    energyCost: 5
  }
};

// ============ CHEST CHAIN ============
const chestChain: Record<string, MergeItem> = {
  'chest_bronze': {
    id: 'chest_bronze',
    name: 'Bronze Chest',
    level: 1,
    category: 'chest',
    spriteSheet: '/ui-sprites.png',
    spriteIndex: 2,
    mergesInto: 'chest_silver',
    description: 'Contains small rewards',
    coinValue: 0,
    xpValue: 10,
    isChest: true,
    chestRewards: {
      coins: 50,
      energy: 10,
      items: ['tool_1', 'plant_1', 'furniture_1']
    }
  },
  'chest_silver': {
    id: 'chest_silver',
    name: 'Silver Chest',
    level: 2,
    category: 'chest',
    spriteSheet: '/ui-sprites.png',
    spriteIndex: 1,
    mergesInto: 'chest_gold',
    description: 'Contains good rewards',
    coinValue: 0,
    xpValue: 25,
    isChest: true,
    chestRewards: {
      coins: 150,
      gems: 5,
      energy: 25,
      items: ['tool_2', 'plant_2', 'furniture_2']
    }
  },
  'chest_gold': {
    id: 'chest_gold',
    name: 'Gold Chest',
    level: 3,
    category: 'chest',
    spriteSheet: '/ui-sprites.png',
    spriteIndex: 0,
    description: 'Contains great rewards',
    coinValue: 0,
    xpValue: 50,
    isChest: true,
    chestRewards: {
      coins: 500,
      gems: 20,
      energy: 50,
      items: ['tool_3', 'plant_3', 'furniture_3', 'gen_toolbox_1']
    }
  }
};

// ============ CURRENCY ITEMS ============
const currencyChain: Record<string, MergeItem> = {
  'coin_small': {
    id: 'coin_small',
    name: 'Small Coins',
    level: 1,
    category: 'currency',
    spriteSheet: '/ui-sprites.png',
    spriteIndex: 3,
    mergesInto: 'coin_medium',
    description: '10 coins',
    coinValue: 10,
    xpValue: 2
  },
  'coin_medium': {
    id: 'coin_medium',
    name: 'Coin Stack',
    level: 2,
    category: 'currency',
    spriteSheet: '/ui-sprites.png',
    spriteIndex: 3,
    mergesInto: 'coin_large',
    description: '30 coins',
    coinValue: 30,
    xpValue: 5
  },
  'coin_large': {
    id: 'coin_large',
    name: 'Coin Pile',
    level: 3,
    category: 'currency',
    spriteSheet: '/ui-sprites.png',
    spriteIndex: 3,
    description: '100 coins',
    coinValue: 100,
    xpValue: 10
  },
  'piggy_1': {
    id: 'piggy_1',
    name: 'Piggy Bank L1',
    level: 1,
    category: 'currency',
    spriteSheet: '/ui-sprites.png',
    spriteIndex: 2,
    mergesInto: 'piggy_2',
    description: 'Generates coins and gems',
    coinValue: 0,
    xpValue: 20,
    isGenerator: true,
    generates: ['coin_small'],
    generationTime: 120000,
    maxCharges: 14,
    energyCost: 3
  },
  'piggy_2': {
    id: 'piggy_2',
    name: 'Piggy Bank L2',
    level: 2,
    category: 'currency',
    spriteSheet: '/ui-sprites.png',
    spriteIndex: 1,
    mergesInto: 'piggy_3',
    description: 'Better coin generator',
    coinValue: 0,
    xpValue: 40,
    isGenerator: true,
    generates: ['coin_small', 'coin_medium'],
    generationTime: 100000,
    maxCharges: 20,
    energyCost: 3
  },
  'piggy_3': {
    id: 'piggy_3',
    name: 'Golden Piggy Bank',
    level: 3,
    category: 'currency',
    spriteSheet: '/ui-sprites.png',
    spriteIndex: 0,
    description: 'Premium currency source',
    coinValue: 0,
    xpValue: 100,
    isGenerator: true,
    generates: ['coin_medium', 'coin_large'],
    generationTime: 80000,
    maxCharges: 57, // Merge Mansion optimal strategy
    energyCost: 3
  }
};

// ============ BLOCKED TILES ============
const blockedItems: Record<string, MergeItem> = {
  'blocked_dirt': {
    id: 'blocked_dirt',
    name: 'Dirt Pile',
    level: 1,
    category: 'blocked',
    spriteSheet: '/items-cleaning.png',
    spriteIndex: 0,
    mergesInto: 'blocked_rock',
    description: 'Blocks the tile',
    coinValue: 5,
    xpValue: 5,
    isBlocked: true,
    blockedUntilMerge: true
  },
  'blocked_rock': {
    id: 'blocked_rock',
    name: 'Rock',
    level: 2,
    category: 'blocked',
    spriteSheet: '/items-repair.png',
    spriteIndex: 0,
    description: 'Heavy rock blocking space',
    coinValue: 15,
    xpValue: 10,
    isBlocked: true,
    blockedUntilMerge: true
  }
};

// ============ COMBINE ALL ITEMS ============
export const MERGE_ITEMS: Record<string, MergeItem> = {
  ...toolChain,
  ...plantChain,
  ...furnitureChain,
  ...generatorChain,
  ...chestChain,
  ...currencyChain,
  ...blockedItems
};

// ============ HELPER FUNCTIONS ============

export function canMerge(item1: MergeItem, item2: MergeItem): boolean {
  return item1.id === item2.id && item1.mergesInto !== undefined;
}

export function getMergeResult(itemId: string): MergeItem | null {
  const item = MERGE_ITEMS[itemId];
  if (item && item.mergesInto) {
    return MERGE_ITEMS[item.mergesInto];
  }
  return null;
}

export function generateStarterItems(): BoardItem[] {
  return [
    { id: crypto.randomUUID(), itemType: 'gen_toolbox_1', x: 0, y: 0, charges: 3 },
    { id: crypto.randomUUID(), itemType: 'gen_plantpot_1', x: 1, y: 0, charges: 3 },
    { id: crypto.randomUUID(), itemType: 'tool_1', x: 2, y: 0 },
    { id: crypto.randomUUID(), itemType: 'tool_1', x: 3, y: 0 },
    { id: crypto.randomUUID(), itemType: 'plant_1', x: 4, y: 0 },
    { id: crypto.randomUUID(), itemType: 'plant_1', x: 5, y: 0 },
    { id: crypto.randomUUID(), itemType: 'chest_bronze', x: 0, y: 1 },
    { id: crypto.randomUUID(), itemType: 'piggy_1', x: 1, y: 1, charges: 14 },
    // Some blocked tiles for friction
    { id: crypto.randomUUID(), itemType: 'blocked_dirt', x: 6, y: 2, isBlocked: true },
    { id: crypto.randomUUID(), itemType: 'blocked_dirt', x: 7, y: 2, isBlocked: true },
    { id: crypto.randomUUID(), itemType: 'blocked_dirt', x: 8, y: 3, isBlocked: true }
  ];
}

// Get items by category
export function getItemsByCategory(category: ItemCategory): MergeItem[] {
  return Object.values(MERGE_ITEMS).filter(item => item.category === category);
}

// Get all generator items
export function getAllGenerators(): MergeItem[] {
  return Object.values(MERGE_ITEMS).filter(item => item.isGenerator);
}

// Get all chest items
export function getAllChests(): MergeItem[] {
  return Object.values(MERGE_ITEMS).filter(item => item.isChest);
}

// Get item chain (all items in the same merge chain)
export function getItemChain(itemId: string): MergeItem[] {
  const chain: MergeItem[] = [];
  const item = MERGE_ITEMS[itemId];
  if (!item) return chain;
  
  // Find the first item in chain
  let current = item;
  const visited = new Set<string>();
  
  // Go backwards to find start
  while (current) {
    if (visited.has(current.id)) break;
    visited.add(current.id);
    
    const previous = Object.values(MERGE_ITEMS).find(i => i.mergesInto === current.id);
    if (previous) {
      current = previous;
    } else {
      break;
    }
  }
  
  // Now go forward from start
  chain.push(current);
  while (current.mergesInto) {
    current = MERGE_ITEMS[current.mergesInto];
    if (current) {
      chain.push(current);
    } else {
      break;
    }
  }
  
  return chain;
}

// Check if item can be sold (for sell/undo strategy)
export function canSellItem(itemId: string): boolean {
  const item = MERGE_ITEMS[itemId];
  return item && item.coinValue > 0 && !item.isGenerator;
}

// Get sell value
export function getSellValue(itemId: string): number {
  const item = MERGE_ITEMS[itemId];
  return item ? Math.floor(item.coinValue * 0.5) : 0; // 50% return
}
