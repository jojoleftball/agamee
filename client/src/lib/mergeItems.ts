// Comprehensive Merge Garden item system with flowers, vegetables, trees, tools, and animals

export type ItemCategory = 
  | 'flower' // Garden flowers
  | 'vegetable' // Vegetables and crops
  | 'tree' // Trees and bushes
  | 'tool' // Gardening tools
  | 'decoration' // Garden decorations
  | 'water' // Water features
  | 'animal' // Garden animals and pets
  | 'generator' // Item producers
  | 'chest' // Reward chests
  | 'currency' // Coins, gems
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
  generates?: string[];
  generationTime?: number;
  maxCharges?: number;
  energyCost?: number;
  
  // Chest properties
  isChest?: boolean;
  chestRewards?: {
    coins?: number;
    gems?: number;
    energy?: number;
    items?: string[];
  };
  
  // Blocked tile properties
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

// ============ FLOWER CHAIN ============
const flowerChain: Record<string, MergeItem> = {
  'flower_1': {
    id: 'flower_1',
    name: 'Seed Packet',
    level: 1,
    category: 'flower',
    spriteSheet: '/items-decor.png',
    spriteIndex: 0,
    mergesInto: 'flower_2',
    description: 'Contains flower seeds',
    coinValue: 5,
    xpValue: 2
  },
  'flower_2': {
    id: 'flower_2',
    name: 'Sprout',
    level: 2,
    category: 'flower',
    spriteSheet: '/items-decor.png',
    spriteIndex: 1,
    mergesInto: 'flower_3',
    description: 'A tiny green sprout',
    coinValue: 12,
    xpValue: 4
  },
  'flower_3': {
    id: 'flower_3',
    name: 'Daisy',
    level: 3,
    category: 'flower',
    spriteSheet: '/items-decor.png',
    spriteIndex: 2,
    mergesInto: 'flower_4',
    description: 'Simple white daisy',
    coinValue: 30,
    xpValue: 8
  },
  'flower_4': {
    id: 'flower_4',
    name: 'Tulip',
    level: 4,
    category: 'flower',
    spriteSheet: '/items-decor.png',
    spriteIndex: 3,
    mergesInto: 'flower_5',
    description: 'Colorful tulip',
    coinValue: 70,
    xpValue: 15
  },
  'flower_5': {
    id: 'flower_5',
    name: 'Rose',
    level: 5,
    category: 'flower',
    spriteSheet: '/items-decor.png',
    spriteIndex: 4,
    mergesInto: 'flower_6',
    description: 'Beautiful red rose',
    coinValue: 150,
    xpValue: 30
  },
  'flower_6': {
    id: 'flower_6',
    name: 'Sunflower',
    level: 6,
    category: 'flower',
    spriteSheet: '/items-decor.png',
    spriteIndex: 0,
    mergesInto: 'flower_7',
    description: 'Bright yellow sunflower',
    coinValue: 300,
    xpValue: 60
  },
  'flower_7': {
    id: 'flower_7',
    name: 'Lily',
    level: 7,
    category: 'flower',
    spriteSheet: '/items-decor.png',
    spriteIndex: 1,
    mergesInto: 'flower_8',
    description: 'Elegant white lily',
    coinValue: 600,
    xpValue: 120
  },
  'flower_8': {
    id: 'flower_8',
    name: 'Orchid',
    level: 8,
    category: 'flower',
    spriteSheet: '/items-decor.png',
    spriteIndex: 2,
    mergesInto: 'flower_9',
    description: 'Exotic purple orchid',
    coinValue: 1200,
    xpValue: 240
  },
  'flower_9': {
    id: 'flower_9',
    name: 'Rainbow Blossom',
    level: 9,
    category: 'flower',
    spriteSheet: '/items-decor.png',
    spriteIndex: 3,
    description: 'Magical multicolor flower',
    coinValue: 2500,
    xpValue: 500
  }
};

// ============ VEGETABLE CHAIN ============
const vegetableChain: Record<string, MergeItem> = {
  'veg_1': {
    id: 'veg_1',
    name: 'Lettuce Seed',
    level: 1,
    category: 'vegetable',
    spriteSheet: '/items-cleaning.png',
    spriteIndex: 0,
    mergesInto: 'veg_2',
    description: 'Tiny vegetable seed',
    coinValue: 8,
    xpValue: 3
  },
  'veg_2': {
    id: 'veg_2',
    name: 'Lettuce',
    level: 2,
    category: 'vegetable',
    spriteSheet: '/items-cleaning.png',
    spriteIndex: 1,
    mergesInto: 'veg_3',
    description: 'Fresh green lettuce',
    coinValue: 18,
    xpValue: 6
  },
  'veg_3': {
    id: 'veg_3',
    name: 'Carrot',
    level: 3,
    category: 'vegetable',
    spriteSheet: '/items-cleaning.png',
    spriteIndex: 2,
    mergesInto: 'veg_4',
    description: 'Crunchy orange carrot',
    coinValue: 40,
    xpValue: 12
  },
  'veg_4': {
    id: 'veg_4',
    name: 'Tomato',
    level: 4,
    category: 'vegetable',
    spriteSheet: '/items-cleaning.png',
    spriteIndex: 3,
    mergesInto: 'veg_5',
    description: 'Juicy red tomato',
    coinValue: 90,
    xpValue: 20
  },
  'veg_5': {
    id: 'veg_5',
    name: 'Pumpkin',
    level: 5,
    category: 'vegetable',
    spriteSheet: '/items-cleaning.png',
    spriteIndex: 4,
    mergesInto: 'veg_6',
    description: 'Large orange pumpkin',
    coinValue: 200,
    xpValue: 40
  },
  'veg_6': {
    id: 'veg_6',
    name: 'Watermelon',
    level: 6,
    category: 'vegetable',
    spriteSheet: '/items-cleaning.png',
    spriteIndex: 0,
    mergesInto: 'veg_7',
    description: 'Sweet watermelon',
    coinValue: 400,
    xpValue: 80
  },
  'veg_7': {
    id: 'veg_7',
    name: 'Giant Cabbage',
    level: 7,
    category: 'vegetable',
    spriteSheet: '/items-cleaning.png',
    spriteIndex: 1,
    mergesInto: 'veg_8',
    description: 'Enormous cabbage',
    coinValue: 800,
    xpValue: 160
  },
  'veg_8': {
    id: 'veg_8',
    name: 'Golden Corn',
    level: 8,
    category: 'vegetable',
    spriteSheet: '/items-cleaning.png',
    spriteIndex: 2,
    description: 'Shimmering golden corn',
    coinValue: 1600,
    xpValue: 320
  }
};

// ============ TREE CHAIN ============
const treeChain: Record<string, MergeItem> = {
  'tree_1': {
    id: 'tree_1',
    name: 'Sapling',
    level: 1,
    category: 'tree',
    spriteSheet: '/items-decor.png',
    spriteIndex: 0,
    mergesInto: 'tree_2',
    description: 'Tiny tree sapling',
    coinValue: 15,
    xpValue: 5
  },
  'tree_2': {
    id: 'tree_2',
    name: 'Young Tree',
    level: 2,
    category: 'tree',
    spriteSheet: '/items-decor.png',
    spriteIndex: 1,
    mergesInto: 'tree_3',
    description: 'Growing tree',
    coinValue: 35,
    xpValue: 10
  },
  'tree_3': {
    id: 'tree_3',
    name: 'Oak Tree',
    level: 3,
    category: 'tree',
    spriteSheet: '/items-decor.png',
    spriteIndex: 2,
    mergesInto: 'tree_4',
    description: 'Strong oak tree',
    coinValue: 80,
    xpValue: 20
  },
  'tree_4': {
    id: 'tree_4',
    name: 'Fruit Tree',
    level: 4,
    category: 'tree',
    spriteSheet: '/items-decor.png',
    spriteIndex: 3,
    mergesInto: 'tree_5',
    description: 'Tree with fruits',
    coinValue: 180,
    xpValue: 40
  },
  'tree_5': {
    id: 'tree_5',
    name: 'Cherry Blossom',
    level: 5,
    category: 'tree',
    spriteSheet: '/items-decor.png',
    spriteIndex: 4,
    mergesInto: 'tree_6',
    description: 'Pink flowering tree',
    coinValue: 400,
    xpValue: 80
  },
  'tree_6': {
    id: 'tree_6',
    name: 'Willow Tree',
    level: 6,
    category: 'tree',
    spriteSheet: '/items-decor.png',
    spriteIndex: 0,
    mergesInto: 'tree_7',
    description: 'Graceful willow',
    coinValue: 900,
    xpValue: 180
  },
  'tree_7': {
    id: 'tree_7',
    name: 'Ancient Tree',
    level: 7,
    category: 'tree',
    spriteSheet: '/items-decor.png',
    spriteIndex: 1,
    description: 'Majestic old tree',
    coinValue: 2000,
    xpValue: 400
  }
};

// ============ TOOL CHAIN ============
const toolChain: Record<string, MergeItem> = {
  'tool_1': {
    id: 'tool_1',
    name: 'Small Trowel',
    level: 1,
    category: 'tool',
    spriteSheet: '/items-repair.png',
    spriteIndex: 0,
    mergesInto: 'tool_2',
    description: 'Basic digging tool',
    coinValue: 6,
    xpValue: 3
  },
  'tool_2': {
    id: 'tool_2',
    name: 'Garden Spade',
    level: 2,
    category: 'tool',
    spriteSheet: '/items-repair.png',
    spriteIndex: 1,
    mergesInto: 'tool_3',
    description: 'Better digging tool',
    coinValue: 14,
    xpValue: 6
  },
  'tool_3': {
    id: 'tool_3',
    name: 'Rake',
    level: 3,
    category: 'tool',
    spriteSheet: '/items-repair.png',
    spriteIndex: 2,
    mergesInto: 'tool_4',
    description: 'For smoothing soil',
    coinValue: 32,
    xpValue: 12
  },
  'tool_4': {
    id: 'tool_4',
    name: 'Watering Can',
    level: 4,
    category: 'tool',
    spriteSheet: '/items-repair.png',
    spriteIndex: 3,
    mergesInto: 'tool_5',
    description: 'Waters plants',
    coinValue: 75,
    xpValue: 25
  },
  'tool_5': {
    id: 'tool_5',
    name: 'Pruning Shears',
    level: 5,
    category: 'tool',
    spriteSheet: '/items-repair.png',
    spriteIndex: 4,
    mergesInto: 'tool_6',
    description: 'Trims plants neatly',
    coinValue: 170,
    xpValue: 50
  },
  'tool_6': {
    id: 'tool_6',
    name: 'Garden Hoe',
    level: 6,
    category: 'tool',
    spriteSheet: '/items-repair.png',
    spriteIndex: 0,
    mergesInto: 'tool_7',
    description: 'Breaks up soil',
    coinValue: 380,
    xpValue: 100
  },
  'tool_7': {
    id: 'tool_7',
    name: 'Wheelbarrow',
    level: 7,
    category: 'tool',
    spriteSheet: '/items-repair.png',
    spriteIndex: 1,
    mergesInto: 'tool_8',
    description: 'Carries heavy loads',
    coinValue: 850,
    xpValue: 200
  },
  'tool_8': {
    id: 'tool_8',
    name: 'Garden Tool Set',
    level: 8,
    category: 'tool',
    spriteSheet: '/items-repair.png',
    spriteIndex: 2,
    description: 'Complete tool collection',
    coinValue: 1900,
    xpValue: 400
  }
};

// ============ DECORATION CHAIN ============
const decorationChain: Record<string, MergeItem> = {
  'deco_1': {
    id: 'deco_1',
    name: 'Stone',
    level: 1,
    category: 'decoration',
    spriteSheet: '/items-repair.png',
    spriteIndex: 0,
    mergesInto: 'deco_2',
    description: 'Simple garden stone',
    coinValue: 10,
    xpValue: 4
  },
  'deco_2': {
    id: 'deco_2',
    name: 'Garden Path',
    level: 2,
    category: 'decoration',
    spriteSheet: '/items-repair.png',
    spriteIndex: 1,
    mergesInto: 'deco_3',
    description: 'Stone pathway',
    coinValue: 25,
    xpValue: 8
  },
  'deco_3': {
    id: 'deco_3',
    name: 'Flower Pot',
    level: 3,
    category: 'decoration',
    spriteSheet: '/items-decor.png',
    spriteIndex: 3,
    mergesInto: 'deco_4',
    description: 'Decorative pot',
    coinValue: 60,
    xpValue: 16
  },
  'deco_4': {
    id: 'deco_4',
    name: 'Garden Lamp',
    level: 4,
    category: 'decoration',
    spriteSheet: '/ui-sprites.png',
    spriteIndex: 0,
    mergesInto: 'deco_5',
    description: 'Lights the path',
    coinValue: 140,
    xpValue: 32
  },
  'deco_5': {
    id: 'deco_5',
    name: 'Bench',
    level: 5,
    category: 'decoration',
    spriteSheet: '/items-cleaning.png',
    spriteIndex: 2,
    mergesInto: 'deco_6',
    description: 'Relaxing garden bench',
    coinValue: 320,
    xpValue: 64
  },
  'deco_6': {
    id: 'deco_6',
    name: 'Fountain',
    level: 6,
    category: 'decoration',
    spriteSheet: '/items-decor.png',
    spriteIndex: 4,
    mergesInto: 'deco_7',
    description: 'Beautiful water fountain',
    coinValue: 750,
    xpValue: 128
  },
  'deco_7': {
    id: 'deco_7',
    name: 'Gazebo',
    level: 7,
    category: 'decoration',
    spriteSheet: '/items-cleaning.png',
    spriteIndex: 4,
    description: 'Elegant garden structure',
    coinValue: 1700,
    xpValue: 256
  }
};

// ============ ANIMAL CHAIN ============
const animalChain: Record<string, MergeItem> = {
  'animal_1': {
    id: 'animal_1',
    name: 'Butterfly',
    level: 1,
    category: 'animal',
    spriteSheet: '/items-decor.png',
    spriteIndex: 0,
    mergesInto: 'animal_2',
    description: 'Colorful butterfly',
    coinValue: 12,
    xpValue: 5
  },
  'animal_2': {
    id: 'animal_2',
    name: 'Ladybug',
    level: 2,
    category: 'animal',
    spriteSheet: '/items-decor.png',
    spriteIndex: 1,
    mergesInto: 'animal_3',
    description: 'Lucky ladybug',
    coinValue: 28,
    xpValue: 10
  },
  'animal_3': {
    id: 'animal_3',
    name: 'Bird',
    level: 3,
    category: 'animal',
    spriteSheet: '/items-decor.png',
    spriteIndex: 2,
    mergesInto: 'animal_4',
    description: 'Singing bird',
    coinValue: 65,
    xpValue: 20
  },
  'animal_4': {
    id: 'animal_4',
    name: 'Rabbit',
    level: 4,
    category: 'animal',
    spriteSheet: '/items-decor.png',
    spriteIndex: 3,
    mergesInto: 'animal_5',
    description: 'Cute garden rabbit',
    coinValue: 150,
    xpValue: 40
  },
  'animal_5': {
    id: 'animal_5',
    name: 'Cat',
    level: 5,
    category: 'animal',
    spriteSheet: '/items-decor.png',
    spriteIndex: 4,
    mergesInto: 'animal_6',
    description: 'Playful garden cat',
    coinValue: 350,
    xpValue: 80
  },
  'animal_6': {
    id: 'animal_6',
    name: 'Dog',
    level: 6,
    category: 'animal',
    spriteSheet: '/items-decor.png',
    spriteIndex: 0,
    mergesInto: 'animal_7',
    description: 'Loyal garden dog',
    coinValue: 800,
    xpValue: 160
  },
  'animal_7': {
    id: 'animal_7',
    name: 'Deer',
    level: 7,
    category: 'animal',
    spriteSheet: '/items-decor.png',
    spriteIndex: 1,
    description: 'Majestic deer',
    coinValue: 1800,
    xpValue: 320
  }
};

// ============ GENERATOR CHAIN ============
const generatorChain: Record<string, MergeItem> = {
  'gen_flower_1': {
    id: 'gen_flower_1',
    name: 'Seed Bag',
    level: 1,
    category: 'generator',
    spriteSheet: '/items-decor.png',
    spriteIndex: 4,
    mergesInto: 'gen_flower_2',
    description: 'Generates flower seeds',
    coinValue: 40,
    xpValue: 15,
    isGenerator: true,
    generates: ['flower_1', 'flower_2'],
    generationTime: 50000,
    maxCharges: 3,
    energyCost: 5
  },
  'gen_flower_2': {
    id: 'gen_flower_2',
    name: 'Planter Box',
    level: 2,
    category: 'generator',
    spriteSheet: '/items-decor.png',
    spriteIndex: 3,
    mergesInto: 'gen_flower_3',
    description: 'Grows flowers faster',
    coinValue: 120,
    xpValue: 30,
    isGenerator: true,
    generates: ['flower_1', 'flower_2', 'flower_3'],
    generationTime: 40000,
    maxCharges: 4,
    energyCost: 5
  },
  'gen_flower_3': {
    id: 'gen_flower_3',
    name: 'Greenhouse',
    level: 3,
    category: 'generator',
    spriteSheet: '/items-decor.png',
    spriteIndex: 2,
    description: 'Premium flower generator',
    coinValue: 400,
    xpValue: 60,
    isGenerator: true,
    generates: ['flower_2', 'flower_3', 'flower_4'],
    generationTime: 30000,
    maxCharges: 5,
    energyCost: 5
  },
  'gen_veg_1': {
    id: 'gen_veg_1',
    name: 'Compost Bin',
    level: 1,
    category: 'generator',
    spriteSheet: '/items-cleaning.png',
    spriteIndex: 4,
    mergesInto: 'gen_veg_2',
    description: 'Generates vegetable seeds',
    coinValue: 50,
    xpValue: 18,
    isGenerator: true,
    generates: ['veg_1', 'veg_2'],
    generationTime: 55000,
    maxCharges: 3,
    energyCost: 5
  },
  'gen_veg_2': {
    id: 'gen_veg_2',
    name: 'Garden Bed',
    level: 2,
    category: 'generator',
    spriteSheet: '/items-cleaning.png',
    spriteIndex: 3,
    mergesInto: 'gen_veg_3',
    description: 'Grows vegetables faster',
    coinValue: 150,
    xpValue: 36,
    isGenerator: true,
    generates: ['veg_1', 'veg_2', 'veg_3'],
    generationTime: 45000,
    maxCharges: 4,
    energyCost: 5
  },
  'gen_veg_3': {
    id: 'gen_veg_3',
    name: 'Vegetable Farm',
    level: 3,
    category: 'generator',
    spriteSheet: '/items-cleaning.png',
    spriteIndex: 2,
    description: 'Premium vegetable source',
    coinValue: 500,
    xpValue: 72,
    isGenerator: true,
    generates: ['veg_2', 'veg_3', 'veg_4'],
    generationTime: 35000,
    maxCharges: 5,
    energyCost: 5
  },
  'gen_tool_1': {
    id: 'gen_tool_1',
    name: 'Tool Shed',
    level: 1,
    category: 'generator',
    spriteSheet: '/items-repair.png',
    spriteIndex: 4,
    mergesInto: 'gen_tool_2',
    description: 'Generates garden tools',
    coinValue: 45,
    xpValue: 16,
    isGenerator: true,
    generates: ['tool_1', 'tool_2'],
    generationTime: 60000,
    maxCharges: 3,
    energyCost: 5
  },
  'gen_tool_2': {
    id: 'gen_tool_2',
    name: 'Workshop',
    level: 2,
    category: 'generator',
    spriteSheet: '/items-repair.png',
    spriteIndex: 3,
    description: 'Better tool source',
    coinValue: 135,
    xpValue: 32,
    isGenerator: true,
    generates: ['tool_1', 'tool_2', 'tool_3'],
    generationTime: 45000,
    maxCharges: 4,
    energyCost: 5
  }
};

// ============ CHEST CHAIN ============
const chestChain: Record<string, MergeItem> = {
  'chest_bronze': {
    id: 'chest_bronze',
    name: 'Wooden Crate',
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
      items: ['flower_1', 'veg_1', 'tool_1']
    }
  },
  'chest_silver': {
    id: 'chest_silver',
    name: 'Garden Chest',
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
      items: ['flower_2', 'veg_2', 'tool_2', 'tree_1']
    }
  },
  'chest_gold': {
    id: 'chest_gold',
    name: 'Treasure Chest',
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
      items: ['flower_3', 'veg_3', 'tool_3', 'gen_flower_1', 'animal_1']
    }
  }
};

// ============ CURRENCY ITEMS ============
const currencyChain: Record<string, MergeItem> = {
  'coin_small': {
    id: 'coin_small',
    name: 'Coins',
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
    name: 'Coin Bag',
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
    name: 'Coin Sack',
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
    name: 'Money Box L1',
    level: 1,
    category: 'currency',
    spriteSheet: '/ui-sprites.png',
    spriteIndex: 2,
    mergesInto: 'piggy_2',
    description: 'Generates coins',
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
    name: 'Money Box L2',
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
    name: 'Golden Money Box',
    level: 3,
    category: 'currency',
    spriteSheet: '/ui-sprites.png',
    spriteIndex: 0,
    description: 'Premium coin source',
    coinValue: 0,
    xpValue: 100,
    isGenerator: true,
    generates: ['coin_medium', 'coin_large'],
    generationTime: 80000,
    maxCharges: 57,
    energyCost: 3
  }
};

// ============ BLOCKED TILES ============
const blockedItems: Record<string, MergeItem> = {
  'blocked_weed': {
    id: 'blocked_weed',
    name: 'Weeds',
    level: 1,
    category: 'blocked',
    spriteSheet: '/items-cleaning.png',
    spriteIndex: 0,
    mergesInto: 'blocked_rock',
    description: 'Overgrown weeds',
    coinValue: 5,
    xpValue: 5,
    isBlocked: true,
    blockedUntilMerge: true
  },
  'blocked_rock': {
    id: 'blocked_rock',
    name: 'Boulder',
    level: 2,
    category: 'blocked',
    spriteSheet: '/items-repair.png',
    spriteIndex: 0,
    description: 'Heavy rock blocking garden',
    coinValue: 15,
    xpValue: 10,
    isBlocked: true,
    blockedUntilMerge: true
  }
};

// ============ COMBINE ALL ITEMS ============
export const MERGE_ITEMS: Record<string, MergeItem> = {
  ...flowerChain,
  ...vegetableChain,
  ...treeChain,
  ...toolChain,
  ...decorationChain,
  ...animalChain,
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
    { id: crypto.randomUUID(), itemType: 'gen_flower_1', x: 0, y: 0, charges: 3 },
    { id: crypto.randomUUID(), itemType: 'gen_veg_1', x: 1, y: 0, charges: 3 },
    { id: crypto.randomUUID(), itemType: 'gen_tool_1', x: 2, y: 0, charges: 3 },
    { id: crypto.randomUUID(), itemType: 'flower_1', x: 3, y: 0 },
    { id: crypto.randomUUID(), itemType: 'flower_1', x: 4, y: 0 },
    { id: crypto.randomUUID(), itemType: 'veg_1', x: 5, y: 0 },
    { id: crypto.randomUUID(), itemType: 'chest_bronze', x: 0, y: 1 },
    { id: crypto.randomUUID(), itemType: 'piggy_1', x: 1, y: 1, charges: 14 },
    { id: crypto.randomUUID(), itemType: 'tree_1', x: 2, y: 1 },
    { id: crypto.randomUUID(), itemType: 'blocked_weed', x: 6, y: 2, isBlocked: true },
    { id: crypto.randomUUID(), itemType: 'blocked_weed', x: 7, y: 2, isBlocked: true },
    { id: crypto.randomUUID(), itemType: 'blocked_weed', x: 8, y: 3, isBlocked: true }
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

// Get item chain
export function getItemChain(itemId: string): MergeItem[] {
  const chain: MergeItem[] = [];
  const item = MERGE_ITEMS[itemId];
  if (!item) return chain;
  
  let current = item;
  const visited = new Set<string>();
  
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

// Check if item can be sold
export function canSellItem(itemId: string): boolean {
  const item = MERGE_ITEMS[itemId];
  return item && item.coinValue > 0 && !item.isGenerator;
}

// Get sell value
export function getSellValue(itemId: string): number {
  const item = MERGE_ITEMS[itemId];
  return item ? Math.floor(item.coinValue * 0.5) : 0;
}
