// Complete Merge Garden item system with proper sprite references

export type ItemCategory = 
  | 'flower'
  | 'vegetable'
  | 'tree'
  | 'tool'
  | 'decoration'
  | 'generator'
  | 'chest'
  | 'currency'
  | 'blocked';

export interface MergeItem {
  id: string;
  name: string;
  level: number;
  category: ItemCategory;
  sprite: string;
  spriteX: number;
  spriteY: number;
  spriteW: number;
  spriteH: number;
  mergesInto?: string;
  description: string;
  coinValue: number;
  xpValue: number;
  
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
  };
  
  isBlocked?: boolean;
  blockedUntilMerge?: boolean;
}

export interface BoardItem {
  id: string;
  itemType: string;
  x: number;
  y: number;
  charges?: number;
  lastGenerated?: number;
  isBlocked?: boolean;
}

export interface GardenBiome {
  id: string;
  name: string;
  background: string;
  unlockLevel: number;
  unlockCoins: number;
  description: string;
}

export const GARDEN_BIOMES: GardenBiome[] = [
  {
    id: 'basic',
    name: 'Starter Garden',
    background: 'basic',
    unlockLevel: 1,
    unlockCoins: 0,
    description: 'Your first garden to restore'
  },
  {
    id: 'tropical',
    name: 'Tropical Paradise',
    background: 'tropical',
    unlockLevel: 5,
    unlockCoins: 1000,
    description: 'A lush tropical garden'
  },
  {
    id: 'zen',
    name: 'Zen Garden',
    background: 'zen',
    unlockLevel: 10,
    unlockCoins: 3000,
    description: 'Peaceful Japanese garden'
  },
  {
    id: 'desert',
    name: 'Desert Oasis',
    background: 'desert',
    unlockLevel: 15,
    unlockCoins: 7000,
    description: 'A beautiful desert garden'
  },
  {
    id: 'winter',
    name: 'Winter Wonderland',
    background: 'winter',
    unlockLevel: 20,
    unlockCoins: 15000,
    description: 'Magical winter garden'
  }
];

const SPRITE_SIZE = 128;

const flowerItems: Record<string, MergeItem> = {
  flower_1: {
    id: 'flower_1',
    name: 'Seedling',
    level: 1,
    category: 'flower',
    sprite: 'flowers',
    spriteX: 0,
    spriteY: 0,
    spriteW: SPRITE_SIZE,
    spriteH: SPRITE_SIZE,
    mergesInto: 'flower_2',
    description: 'Tiny flower seed',
    coinValue: 5,
    xpValue: 2
  },
  flower_2: {
    id: 'flower_2',
    name: 'Sprout',
    level: 2,
    category: 'flower',
    sprite: 'flowers',
    spriteX: SPRITE_SIZE,
    spriteY: 0,
    spriteW: SPRITE_SIZE,
    spriteH: SPRITE_SIZE,
    mergesInto: 'flower_3',
    description: 'Growing sprout',
    coinValue: 12,
    xpValue: 4
  },
  flower_3: {
    id: 'flower_3',
    name: 'Daisy',
    level: 3,
    category: 'flower',
    sprite: 'flowers',
    spriteX: SPRITE_SIZE * 2,
    spriteY: 0,
    spriteW: SPRITE_SIZE,
    spriteH: SPRITE_SIZE,
    mergesInto: 'flower_4',
    description: 'Simple daisy',
    coinValue: 30,
    xpValue: 8
  },
  flower_4: {
    id: 'flower_4',
    name: 'Tulip',
    level: 4,
    category: 'flower',
    sprite: 'flowers',
    spriteX: SPRITE_SIZE * 3,
    spriteY: 0,
    spriteW: SPRITE_SIZE,
    spriteH: SPRITE_SIZE,
    mergesInto: 'flower_5',
    description: 'Colorful tulip',
    coinValue: 70,
    xpValue: 15
  },
  flower_5: {
    id: 'flower_5',
    name: 'Rose',
    level: 5,
    category: 'flower',
    sprite: 'flowers',
    spriteX: SPRITE_SIZE * 4,
    spriteY: 0,
    spriteW: SPRITE_SIZE,
    spriteH: SPRITE_SIZE,
    mergesInto: 'flower_6',
    description: 'Beautiful rose',
    coinValue: 150,
    xpValue: 30
  },
  flower_6: {
    id: 'flower_6',
    name: 'Sunflower',
    level: 6,
    category: 'flower',
    sprite: 'flowers',
    spriteX: SPRITE_SIZE * 5,
    spriteY: 0,
    spriteW: SPRITE_SIZE,
    spriteH: SPRITE_SIZE,
    mergesInto: 'flower_7',
    description: 'Bright sunflower',
    coinValue: 300,
    xpValue: 60
  },
  flower_7: {
    id: 'flower_7',
    name: 'Lily',
    level: 7,
    category: 'flower',
    sprite: 'flowers',
    spriteX: SPRITE_SIZE * 6,
    spriteY: 0,
    spriteW: SPRITE_SIZE,
    spriteH: SPRITE_SIZE,
    mergesInto: 'flower_8',
    description: 'Elegant lily',
    coinValue: 600,
    xpValue: 120
  },
  flower_8: {
    id: 'flower_8',
    name: 'Orchid',
    level: 8,
    category: 'flower',
    sprite: 'flowers',
    spriteX: SPRITE_SIZE * 7,
    spriteY: 0,
    spriteW: SPRITE_SIZE,
    spriteH: SPRITE_SIZE,
    mergesInto: 'flower_9',
    description: 'Exotic orchid',
    coinValue: 1200,
    xpValue: 240
  },
  flower_9: {
    id: 'flower_9',
    name: 'Rainbow Blossom',
    level: 9,
    category: 'flower',
    sprite: 'flowers',
    spriteX: SPRITE_SIZE * 8,
    spriteY: 0,
    spriteW: SPRITE_SIZE,
    spriteH: SPRITE_SIZE,
    mergesInto: 'flower_10',
    description: 'Magical flower',
    coinValue: 2500,
    xpValue: 500
  },
  flower_10: {
    id: 'flower_10',
    name: 'Divine Blossom',
    level: 10,
    category: 'flower',
    sprite: 'flowers',
    spriteX: SPRITE_SIZE * 9,
    spriteY: 0,
    spriteW: SPRITE_SIZE,
    spriteH: SPRITE_SIZE,
    description: 'Golden divine flower',
    coinValue: 5000,
    xpValue: 1000
  }
};

const vegetableItems: Record<string, MergeItem> = {
  veg_1: {
    id: 'veg_1',
    name: 'Seeds',
    level: 1,
    category: 'vegetable',
    sprite: 'vegetables',
    spriteX: 0,
    spriteY: 0,
    spriteW: SPRITE_SIZE,
    spriteH: SPRITE_SIZE,
    mergesInto: 'veg_2',
    description: 'Vegetable seeds',
    coinValue: 8,
    xpValue: 3
  },
  veg_2: {
    id: 'veg_2',
    name: 'Sprout',
    level: 2,
    category: 'vegetable',
    sprite: 'vegetables',
    spriteX: SPRITE_SIZE,
    spriteY: 0,
    spriteW: SPRITE_SIZE,
    spriteH: SPRITE_SIZE,
    mergesInto: 'veg_3',
    description: 'Small sprout',
    coinValue: 18,
    xpValue: 6
  },
  veg_3: {
    id: 'veg_3',
    name: 'Carrot',
    level: 3,
    category: 'vegetable',
    sprite: 'vegetables',
    spriteX: SPRITE_SIZE * 2,
    spriteY: 0,
    spriteW: SPRITE_SIZE,
    spriteH: SPRITE_SIZE,
    mergesInto: 'veg_4',
    description: 'Fresh carrot',
    coinValue: 40,
    xpValue: 12
  },
  veg_4: {
    id: 'veg_4',
    name: 'Tomato',
    level: 4,
    category: 'vegetable',
    sprite: 'vegetables',
    spriteX: SPRITE_SIZE * 3,
    spriteY: 0,
    spriteW: SPRITE_SIZE,
    spriteH: SPRITE_SIZE,
    mergesInto: 'veg_5',
    description: 'Juicy tomato',
    coinValue: 90,
    xpValue: 20
  },
  veg_5: {
    id: 'veg_5',
    name: 'Pumpkin',
    level: 5,
    category: 'vegetable',
    sprite: 'vegetables',
    spriteX: SPRITE_SIZE * 4,
    spriteY: 0,
    spriteW: SPRITE_SIZE,
    spriteH: SPRITE_SIZE,
    mergesInto: 'veg_6',
    description: 'Large pumpkin',
    coinValue: 200,
    xpValue: 40
  },
  veg_6: {
    id: 'veg_6',
    name: 'Watermelon',
    level: 6,
    category: 'vegetable',
    sprite: 'vegetables',
    spriteX: SPRITE_SIZE * 5,
    spriteY: 0,
    spriteW: SPRITE_SIZE,
    spriteH: SPRITE_SIZE,
    mergesInto: 'veg_7',
    description: 'Sweet watermelon',
    coinValue: 400,
    xpValue: 80
  },
  veg_7: {
    id: 'veg_7',
    name: 'Giant Cabbage',
    level: 7,
    category: 'vegetable',
    sprite: 'vegetables',
    spriteX: SPRITE_SIZE * 6,
    spriteY: 0,
    spriteW: SPRITE_SIZE,
    spriteH: SPRITE_SIZE,
    mergesInto: 'veg_8',
    description: 'Huge cabbage',
    coinValue: 800,
    xpValue: 160
  },
  veg_8: {
    id: 'veg_8',
    name: 'Golden Corn',
    level: 8,
    category: 'vegetable',
    sprite: 'vegetables',
    spriteX: SPRITE_SIZE * 7,
    spriteY: 0,
    spriteW: SPRITE_SIZE,
    spriteH: SPRITE_SIZE,
    mergesInto: 'veg_9',
    description: 'Shimmering corn',
    coinValue: 1600,
    xpValue: 320
  },
  veg_9: {
    id: 'veg_9',
    name: 'Rare Vegetable',
    level: 9,
    category: 'vegetable',
    sprite: 'vegetables',
    spriteX: SPRITE_SIZE * 8,
    spriteY: 0,
    spriteW: SPRITE_SIZE,
    spriteH: SPRITE_SIZE,
    mergesInto: 'veg_10',
    description: 'Exotic produce',
    coinValue: 3200,
    xpValue: 640
  },
  veg_10: {
    id: 'veg_10',
    name: 'Legendary Harvest',
    level: 10,
    category: 'vegetable',
    sprite: 'vegetables',
    spriteX: SPRITE_SIZE * 9,
    spriteY: 0,
    spriteW: SPRITE_SIZE,
    spriteH: SPRITE_SIZE,
    description: 'Ultimate vegetable',
    coinValue: 6500,
    xpValue: 1300
  }
};

const treeItems: Record<string, MergeItem> = {
  tree_1: {
    id: 'tree_1',
    name: 'Sapling',
    level: 1,
    category: 'tree',
    sprite: 'trees',
    spriteX: 0,
    spriteY: 0,
    spriteW: SPRITE_SIZE,
    spriteH: SPRITE_SIZE,
    mergesInto: 'tree_2',
    description: 'Tiny sapling',
    coinValue: 15,
    xpValue: 5
  },
  tree_2: {
    id: 'tree_2',
    name: 'Small Bush',
    level: 2,
    category: 'tree',
    sprite: 'trees',
    spriteX: SPRITE_SIZE,
    spriteY: 0,
    spriteW: SPRITE_SIZE,
    spriteH: SPRITE_SIZE,
    mergesInto: 'tree_3',
    description: 'Growing shrub',
    coinValue: 35,
    xpValue: 10
  },
  tree_3: {
    id: 'tree_3',
    name: 'Young Tree',
    level: 3,
    category: 'tree',
    sprite: 'trees',
    spriteX: SPRITE_SIZE * 2,
    spriteY: 0,
    spriteW: SPRITE_SIZE,
    spriteH: SPRITE_SIZE,
    mergesInto: 'tree_4',
    description: 'Young oak tree',
    coinValue: 80,
    xpValue: 20
  },
  tree_4: {
    id: 'tree_4',
    name: 'Mature Tree',
    level: 4,
    category: 'tree',
    sprite: 'trees',
    spriteX: SPRITE_SIZE * 3,
    spriteY: 0,
    spriteW: SPRITE_SIZE,
    spriteH: SPRITE_SIZE,
    mergesInto: 'tree_5',
    description: 'Strong tree',
    coinValue: 180,
    xpValue: 40
  },
  tree_5: {
    id: 'tree_5',
    name: 'Fruit Tree',
    level: 5,
    category: 'tree',
    sprite: 'trees',
    spriteX: SPRITE_SIZE * 4,
    spriteY: 0,
    spriteW: SPRITE_SIZE,
    spriteH: SPRITE_SIZE,
    mergesInto: 'tree_6',
    description: 'Bearing fruit',
    coinValue: 400,
    xpValue: 80
  },
  tree_6: {
    id: 'tree_6',
    name: 'Flowering Tree',
    level: 6,
    category: 'tree',
    sprite: 'trees',
    spriteX: SPRITE_SIZE * 5,
    spriteY: 0,
    spriteW: SPRITE_SIZE,
    spriteH: SPRITE_SIZE,
    mergesInto: 'tree_7',
    description: 'Beautiful blooms',
    coinValue: 900,
    xpValue: 180
  },
  tree_7: {
    id: 'tree_7',
    name: 'Ancient Tree',
    level: 7,
    category: 'tree',
    sprite: 'trees',
    spriteX: SPRITE_SIZE * 6,
    spriteY: 0,
    spriteW: SPRITE_SIZE,
    spriteH: SPRITE_SIZE,
    mergesInto: 'tree_8',
    description: 'Very old tree',
    coinValue: 2000,
    xpValue: 400
  },
  tree_8: {
    id: 'tree_8',
    name: 'Magical Tree',
    level: 8,
    category: 'tree',
    sprite: 'trees',
    spriteX: SPRITE_SIZE * 7,
    spriteY: 0,
    spriteW: SPRITE_SIZE,
    spriteH: SPRITE_SIZE,
    mergesInto: 'tree_9',
    description: 'Enchanted tree',
    coinValue: 4500,
    xpValue: 800
  },
  tree_9: {
    id: 'tree_9',
    name: 'World Tree',
    level: 9,
    category: 'tree',
    sprite: 'trees',
    spriteX: SPRITE_SIZE * 8,
    spriteY: 0,
    spriteW: SPRITE_SIZE,
    spriteH: SPRITE_SIZE,
    mergesInto: 'tree_10',
    description: 'Legendary tree',
    coinValue: 10000,
    xpValue: 1600
  },
  tree_10: {
    id: 'tree_10',
    name: 'Divine Tree',
    level: 10,
    category: 'tree',
    sprite: 'trees',
    spriteX: SPRITE_SIZE * 9,
    spriteY: 0,
    spriteW: SPRITE_SIZE,
    spriteH: SPRITE_SIZE,
    description: 'Ultimate tree',
    coinValue: 20000,
    xpValue: 3200
  }
};

const toolItems: Record<string, MergeItem> = {
  tool_1: {
    id: 'tool_1',
    name: 'Rusty Trowel',
    level: 1,
    category: 'tool',
    sprite: 'tools',
    spriteX: 0,
    spriteY: 0,
    spriteW: SPRITE_SIZE,
    spriteH: SPRITE_SIZE,
    mergesInto: 'tool_2',
    description: 'Basic tool',
    coinValue: 6,
    xpValue: 3
  },
  tool_2: {
    id: 'tool_2',
    name: 'Trowel',
    level: 2,
    category: 'tool',
    sprite: 'tools',
    spriteX: SPRITE_SIZE,
    spriteY: 0,
    spriteW: SPRITE_SIZE,
    spriteH: SPRITE_SIZE,
    mergesInto: 'tool_3',
    description: 'Better trowel',
    coinValue: 14,
    xpValue: 6
  },
  tool_3: {
    id: 'tool_3',
    name: 'Garden Rake',
    level: 3,
    category: 'tool',
    sprite: 'tools',
    spriteX: SPRITE_SIZE * 2,
    spriteY: 0,
    spriteW: SPRITE_SIZE,
    spriteH: SPRITE_SIZE,
    mergesInto: 'tool_4',
    description: 'For smoothing soil',
    coinValue: 32,
    xpValue: 12
  },
  tool_4: {
    id: 'tool_4',
    name: 'Watering Can',
    level: 4,
    category: 'tool',
    sprite: 'tools',
    spriteX: SPRITE_SIZE * 3,
    spriteY: 0,
    spriteW: SPRITE_SIZE,
    spriteH: SPRITE_SIZE,
    mergesInto: 'tool_5',
    description: 'Waters plants',
    coinValue: 75,
    xpValue: 25
  },
  tool_5: {
    id: 'tool_5',
    name: 'Pruning Shears',
    level: 5,
    category: 'tool',
    sprite: 'tools',
    spriteX: SPRITE_SIZE * 4,
    spriteY: 0,
    spriteW: SPRITE_SIZE,
    spriteH: SPRITE_SIZE,
    mergesInto: 'tool_6',
    description: 'Trims plants',
    coinValue: 170,
    xpValue: 50
  },
  tool_6: {
    id: 'tool_6',
    name: 'Silver Hoe',
    level: 6,
    category: 'tool',
    sprite: 'tools',
    spriteX: SPRITE_SIZE * 5,
    spriteY: 0,
    spriteW: SPRITE_SIZE,
    spriteH: SPRITE_SIZE,
    mergesInto: 'tool_7',
    description: 'Breaks up soil',
    coinValue: 380,
    xpValue: 100
  },
  tool_7: {
    id: 'tool_7',
    name: 'Wheelbarrow',
    level: 7,
    category: 'tool',
    sprite: 'tools',
    spriteX: SPRITE_SIZE * 6,
    spriteY: 0,
    spriteW: SPRITE_SIZE,
    spriteH: SPRITE_SIZE,
    mergesInto: 'tool_8',
    description: 'Carries loads',
    coinValue: 850,
    xpValue: 200
  },
  tool_8: {
    id: 'tool_8',
    name: 'Golden Tool Kit',
    level: 8,
    category: 'tool',
    sprite: 'tools',
    spriteX: SPRITE_SIZE * 7,
    spriteY: 0,
    spriteW: SPRITE_SIZE,
    spriteH: SPRITE_SIZE,
    mergesInto: 'tool_9',
    description: 'Quality tools',
    coinValue: 1900,
    xpValue: 400
  },
  tool_9: {
    id: 'tool_9',
    name: 'Enchanted Tools',
    level: 9,
    category: 'tool',
    sprite: 'tools',
    spriteX: SPRITE_SIZE * 8,
    spriteY: 0,
    spriteW: SPRITE_SIZE,
    spriteH: SPRITE_SIZE,
    mergesInto: 'tool_10',
    description: 'Magical tools',
    coinValue: 4200,
    xpValue: 800
  },
  tool_10: {
    id: 'tool_10',
    name: 'Divine Tool Set',
    level: 10,
    category: 'tool',
    sprite: 'tools',
    spriteX: SPRITE_SIZE * 9,
    spriteY: 0,
    spriteW: SPRITE_SIZE,
    spriteH: SPRITE_SIZE,
    description: 'Perfect tools',
    coinValue: 9000,
    xpValue: 1600
  }
};

const decorationItems: Record<string, MergeItem> = {
  deco_1: {
    id: 'deco_1',
    name: 'Small Stone',
    level: 1,
    category: 'decoration',
    sprite: 'decorations',
    spriteX: 0,
    spriteY: 0,
    spriteW: SPRITE_SIZE,
    spriteH: SPRITE_SIZE,
    mergesInto: 'deco_2',
    description: 'Simple stone',
    coinValue: 10,
    xpValue: 4
  },
  deco_2: {
    id: 'deco_2',
    name: 'Stone Path',
    level: 2,
    category: 'decoration',
    sprite: 'decorations',
    spriteX: SPRITE_SIZE,
    spriteY: 0,
    spriteW: SPRITE_SIZE,
    spriteH: SPRITE_SIZE,
    mergesInto: 'deco_3',
    description: 'Garden path',
    coinValue: 25,
    xpValue: 8
  },
  deco_3: {
    id: 'deco_3',
    name: 'Planter',
    level: 3,
    category: 'decoration',
    sprite: 'decorations',
    spriteX: SPRITE_SIZE * 2,
    spriteY: 0,
    spriteW: SPRITE_SIZE,
    spriteH: SPRITE_SIZE,
    mergesInto: 'deco_4',
    description: 'Decorative pot',
    coinValue: 60,
    xpValue: 16
  },
  deco_4: {
    id: 'deco_4',
    name: 'Lamp Post',
    level: 4,
    category: 'decoration',
    sprite: 'decorations',
    spriteX: SPRITE_SIZE * 3,
    spriteY: 0,
    spriteW: SPRITE_SIZE,
    spriteH: SPRITE_SIZE,
    mergesInto: 'deco_5',
    description: 'Lights the way',
    coinValue: 140,
    xpValue: 32
  },
  deco_5: {
    id: 'deco_5',
    name: 'Garden Bench',
    level: 5,
    category: 'decoration',
    sprite: 'decorations',
    spriteX: SPRITE_SIZE * 4,
    spriteY: 0,
    spriteW: SPRITE_SIZE,
    spriteH: SPRITE_SIZE,
    mergesInto: 'deco_6',
    description: 'Place to rest',
    coinValue: 320,
    xpValue: 64
  },
  deco_6: {
    id: 'deco_6',
    name: 'Stone Fountain',
    level: 6,
    category: 'decoration',
    sprite: 'decorations',
    spriteX: SPRITE_SIZE * 5,
    spriteY: 0,
    spriteW: SPRITE_SIZE,
    spriteH: SPRITE_SIZE,
    mergesInto: 'deco_7',
    description: 'Water feature',
    coinValue: 750,
    xpValue: 128
  },
  deco_7: {
    id: 'deco_7',
    name: 'Bird Bath',
    level: 7,
    category: 'decoration',
    sprite: 'decorations',
    spriteX: SPRITE_SIZE * 6,
    spriteY: 0,
    spriteW: SPRITE_SIZE,
    spriteH: SPRITE_SIZE,
    mergesInto: 'deco_8',
    description: 'For the birds',
    coinValue: 1700,
    xpValue: 256
  },
  deco_8: {
    id: 'deco_8',
    name: 'Statue',
    level: 8,
    category: 'decoration',
    sprite: 'decorations',
    spriteX: SPRITE_SIZE * 7,
    spriteY: 0,
    spriteW: SPRITE_SIZE,
    spriteH: SPRITE_SIZE,
    mergesInto: 'deco_9',
    description: 'Garden statue',
    coinValue: 3800,
    xpValue: 512
  },
  deco_9: {
    id: 'deco_9',
    name: 'Golden Fountain',
    level: 9,
    category: 'decoration',
    sprite: 'decorations',
    spriteX: SPRITE_SIZE * 8,
    spriteY: 0,
    spriteW: SPRITE_SIZE,
    spriteH: SPRITE_SIZE,
    mergesInto: 'deco_10',
    description: 'Ornate fountain',
    coinValue: 8500,
    xpValue: 1024
  },
  deco_10: {
    id: 'deco_10',
    name: 'Magical Gazebo',
    level: 10,
    category: 'decoration',
    sprite: 'decorations',
    spriteX: SPRITE_SIZE * 9,
    spriteY: 0,
    spriteW: SPRITE_SIZE,
    spriteH: SPRITE_SIZE,
    description: 'Grand structure',
    coinValue: 18000,
    xpValue: 2048
  }
};

const generatorItems: Record<string, MergeItem> = {
  gen_flower_1: {
    id: 'gen_flower_1',
    name: 'Small Pot',
    level: 1,
    category: 'generator',
    sprite: 'generators',
    spriteX: 0,
    spriteY: 0,
    spriteW: SPRITE_SIZE,
    spriteH: SPRITE_SIZE,
    mergesInto: 'gen_flower_2',
    description: 'Generates flowers',
    coinValue: 50,
    xpValue: 20,
    isGenerator: true,
    generates: ['flower_1', 'flower_2'],
    generationTime: 60000,
    maxCharges: 3,
    energyCost: 5
  },
  gen_flower_2: {
    id: 'gen_flower_2',
    name: 'Flower Pot',
    level: 2,
    category: 'generator',
    sprite: 'generators',
    spriteX: SPRITE_SIZE,
    spriteY: 0,
    spriteW: SPRITE_SIZE,
    spriteH: SPRITE_SIZE,
    mergesInto: 'gen_flower_3',
    description: 'Better flower source',
    coinValue: 150,
    xpValue: 40,
    isGenerator: true,
    generates: ['flower_1', 'flower_2', 'flower_3'],
    generationTime: 50000,
    maxCharges: 4,
    energyCost: 5
  },
  gen_flower_3: {
    id: 'gen_flower_3',
    name: 'Planter Box',
    level: 3,
    category: 'generator',
    sprite: 'generators',
    spriteX: SPRITE_SIZE * 2,
    spriteY: 0,
    spriteW: SPRITE_SIZE,
    spriteH: SPRITE_SIZE,
    mergesInto: 'gen_flower_4',
    description: 'Great flower source',
    coinValue: 450,
    xpValue: 80,
    isGenerator: true,
    generates: ['flower_2', 'flower_3', 'flower_4'],
    generationTime: 40000,
    maxCharges: 5,
    energyCost: 5
  },
  gen_flower_4: {
    id: 'gen_flower_4',
    name: 'Greenhouse',
    level: 4,
    category: 'generator',
    sprite: 'generators',
    spriteX: SPRITE_SIZE * 3,
    spriteY: 0,
    spriteW: SPRITE_SIZE,
    spriteH: SPRITE_SIZE,
    mergesInto: 'gen_flower_5',
    description: 'Premium flower source',
    coinValue: 1350,
    xpValue: 160,
    isGenerator: true,
    generates: ['flower_3', 'flower_4', 'flower_5'],
    generationTime: 30000,
    maxCharges: 6,
    energyCost: 5
  },
  gen_flower_5: {
    id: 'gen_flower_5',
    name: 'Magic Garden',
    level: 5,
    category: 'generator',
    sprite: 'generators',
    spriteX: SPRITE_SIZE * 4,
    spriteY: 0,
    spriteW: SPRITE_SIZE,
    spriteH: SPRITE_SIZE,
    description: 'Ultimate flower source',
    coinValue: 4000,
    xpValue: 320,
    isGenerator: true,
    generates: ['flower_4', 'flower_5', 'flower_6'],
    generationTime: 20000,
    maxCharges: 8,
    energyCost: 5
  },
  gen_tool_1: {
    id: 'gen_tool_1',
    name: 'Tool Box',
    level: 1,
    category: 'generator',
    sprite: 'generators',
    spriteX: SPRITE_SIZE * 5,
    spriteY: 0,
    spriteW: SPRITE_SIZE,
    spriteH: SPRITE_SIZE,
    mergesInto: 'gen_tool_2',
    description: 'Generates tools',
    coinValue: 60,
    xpValue: 22,
    isGenerator: true,
    generates: ['tool_1', 'tool_2'],
    generationTime: 70000,
    maxCharges: 3,
    energyCost: 5
  },
  gen_tool_2: {
    id: 'gen_tool_2',
    name: 'Tool Chest',
    level: 2,
    category: 'generator',
    sprite: 'generators',
    spriteX: SPRITE_SIZE * 6,
    spriteY: 0,
    spriteW: SPRITE_SIZE,
    spriteH: SPRITE_SIZE,
    mergesInto: 'gen_tool_3',
    description: 'Better tool source',
    coinValue: 180,
    xpValue: 44,
    isGenerator: true,
    generates: ['tool_1', 'tool_2', 'tool_3'],
    generationTime: 60000,
    maxCharges: 4,
    energyCost: 5
  },
  gen_tool_3: {
    id: 'gen_tool_3',
    name: 'Tool Shed',
    level: 3,
    category: 'generator',
    sprite: 'generators',
    spriteX: SPRITE_SIZE * 7,
    spriteY: 0,
    spriteW: SPRITE_SIZE,
    spriteH: SPRITE_SIZE,
    mergesInto: 'gen_tool_4',
    description: 'Great tool source',
    coinValue: 540,
    xpValue: 88,
    isGenerator: true,
    generates: ['tool_2', 'tool_3', 'tool_4'],
    generationTime: 50000,
    maxCharges: 5,
    energyCost: 5
  },
  gen_tool_4: {
    id: 'gen_tool_4',
    name: 'Workshop',
    level: 4,
    category: 'generator',
    sprite: 'generators',
    spriteX: SPRITE_SIZE * 8,
    spriteY: 0,
    spriteW: SPRITE_SIZE,
    spriteH: SPRITE_SIZE,
    mergesInto: 'gen_tool_5',
    description: 'Premium tool source',
    coinValue: 1620,
    xpValue: 176,
    isGenerator: true,
    generates: ['tool_3', 'tool_4', 'tool_5'],
    generationTime: 40000,
    maxCharges: 6,
    energyCost: 5
  },
  gen_tool_5: {
    id: 'gen_tool_5',
    name: 'Magic Forge',
    level: 5,
    category: 'generator',
    sprite: 'generators',
    spriteX: SPRITE_SIZE * 9,
    spriteY: 0,
    spriteW: SPRITE_SIZE,
    spriteH: SPRITE_SIZE,
    description: 'Ultimate tool source',
    coinValue: 4860,
    xpValue: 352,
    isGenerator: true,
    generates: ['tool_4', 'tool_5', 'tool_6'],
    generationTime: 30000,
    maxCharges: 8,
    energyCost: 5
  }
};

const blockedItems: Record<string, MergeItem> = {
  blocked_dirt_1: {
    id: 'blocked_dirt_1',
    name: 'Small Dirt Pile',
    level: 1,
    category: 'blocked',
    sprite: 'blocked',
    spriteX: 0,
    spriteY: 0,
    spriteW: SPRITE_SIZE,
    spriteH: SPRITE_SIZE,
    mergesInto: 'blocked_dirt_2',
    description: 'Blocks a tile',
    coinValue: 0,
    xpValue: 1,
    isBlocked: true,
    blockedUntilMerge: true
  },
  blocked_dirt_2: {
    id: 'blocked_dirt_2',
    name: 'Dirt Pile',
    level: 2,
    category: 'blocked',
    sprite: 'blocked',
    spriteX: SPRITE_SIZE,
    spriteY: 0,
    spriteW: SPRITE_SIZE,
    spriteH: SPRITE_SIZE,
    mergesInto: 'blocked_dirt_3',
    description: 'Blocks a tile',
    coinValue: 0,
    xpValue: 2,
    isBlocked: true,
    blockedUntilMerge: true
  },
  blocked_dirt_3: {
    id: 'blocked_dirt_3',
    name: 'Large Dirt Pile',
    level: 3,
    category: 'blocked',
    sprite: 'blocked',
    spriteX: SPRITE_SIZE * 2,
    spriteY: 0,
    spriteW: SPRITE_SIZE,
    spriteH: SPRITE_SIZE,
    description: 'Clears when merged',
    coinValue: 5,
    xpValue: 5,
    isBlocked: true
  },
  blocked_rock_1: {
    id: 'blocked_rock_1',
    name: 'Small Rock',
    level: 1,
    category: 'blocked',
    sprite: 'blocked',
    spriteX: SPRITE_SIZE * 3,
    spriteY: 0,
    spriteW: SPRITE_SIZE,
    spriteH: SPRITE_SIZE,
    mergesInto: 'blocked_rock_2',
    description: 'Blocks a tile',
    coinValue: 0,
    xpValue: 1,
    isBlocked: true,
    blockedUntilMerge: true
  },
  blocked_rock_2: {
    id: 'blocked_rock_2',
    name: 'Rock',
    level: 2,
    category: 'blocked',
    sprite: 'blocked',
    spriteX: SPRITE_SIZE * 4,
    spriteY: 0,
    spriteW: SPRITE_SIZE,
    spriteH: SPRITE_SIZE,
    mergesInto: 'blocked_rock_3',
    description: 'Blocks a tile',
    coinValue: 0,
    xpValue: 2,
    isBlocked: true,
    blockedUntilMerge: true
  },
  blocked_rock_3: {
    id: 'blocked_rock_3',
    name: 'Boulder',
    level: 3,
    category: 'blocked',
    sprite: 'blocked',
    spriteX: SPRITE_SIZE * 5,
    spriteY: 0,
    spriteW: SPRITE_SIZE,
    spriteH: SPRITE_SIZE,
    description: 'Clears when merged',
    coinValue: 8,
    xpValue: 5,
    isBlocked: true
  },
  blocked_weeds_1: {
    id: 'blocked_weeds_1',
    name: 'Weeds',
    level: 1,
    category: 'blocked',
    sprite: 'blocked',
    spriteX: SPRITE_SIZE * 6,
    spriteY: 0,
    spriteW: SPRITE_SIZE,
    spriteH: SPRITE_SIZE,
    mergesInto: 'blocked_weeds_2',
    description: 'Blocks a tile',
    coinValue: 0,
    xpValue: 1,
    isBlocked: true,
    blockedUntilMerge: true
  },
  blocked_weeds_2: {
    id: 'blocked_weeds_2',
    name: 'Overgrown Weeds',
    level: 2,
    category: 'blocked',
    sprite: 'blocked',
    spriteX: SPRITE_SIZE * 7,
    spriteY: 0,
    spriteW: SPRITE_SIZE,
    spriteH: SPRITE_SIZE,
    description: 'Clears when merged',
    coinValue: 3,
    xpValue: 3,
    isBlocked: true
  }
};

export const MERGE_ITEMS: Record<string, MergeItem> = {
  ...flowerItems,
  ...vegetableItems,
  ...treeItems,
  ...toolItems,
  ...decorationItems,
  ...generatorItems,
  ...blockedItems
};

export const ITEM_CATEGORIES: Record<ItemCategory, string[]> = {
  flower: Object.keys(flowerItems),
  vegetable: Object.keys(vegetableItems),
  tree: Object.keys(treeItems),
  tool: Object.keys(toolItems),
  decoration: Object.keys(decorationItems),
  generator: Object.keys(generatorItems),
  chest: [],
  currency: [],
  blocked: Object.keys(blockedItems)
};
