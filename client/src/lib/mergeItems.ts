export interface MergeItem {
  id: string;
  name: string;
  level: number;
  category: 'cleaning' | 'repair' | 'decor';
  spriteSheet: string;
  spriteIndex: number;
  mergesInto?: string;
  description: string;
  coinValue: number;
}

export const MERGE_ITEMS: Record<string, MergeItem> = {
  'cleaning_1': {
    id: 'cleaning_1',
    name: 'Dirty Rag',
    level: 1,
    category: 'cleaning',
    spriteSheet: '/items-cleaning.png',
    spriteIndex: 0,
    mergesInto: 'cleaning_2',
    description: 'A dirty cleaning rag',
    coinValue: 5
  },
  'cleaning_2': {
    id: 'cleaning_2',
    name: 'Cleaning Cloth',
    level: 2,
    category: 'cleaning',
    spriteSheet: '/items-cleaning.png',
    spriteIndex: 1,
    mergesInto: 'cleaning_3',
    description: 'Clean cloth for wiping',
    coinValue: 15
  },
  'cleaning_3': {
    id: 'cleaning_3',
    name: 'Spray Bottle',
    level: 3,
    category: 'cleaning',
    spriteSheet: '/items-cleaning.png',
    spriteIndex: 2,
    mergesInto: 'cleaning_4',
    description: 'Spray bottle with cleaner',
    coinValue: 50
  },
  'cleaning_4': {
    id: 'cleaning_4',
    name: 'Mop',
    level: 4,
    category: 'cleaning',
    spriteSheet: '/items-cleaning.png',
    spriteIndex: 3,
    mergesInto: 'cleaning_5',
    description: 'Professional mop',
    coinValue: 150
  },
  'cleaning_5': {
    id: 'cleaning_5',
    name: 'Cleaning Kit',
    level: 5,
    category: 'cleaning',
    spriteSheet: '/items-cleaning.png',
    spriteIndex: 4,
    description: 'Complete cleaning kit',
    coinValue: 500
  },
  
  'repair_1': {
    id: 'repair_1',
    name: 'Nail',
    level: 1,
    category: 'repair',
    spriteSheet: '/items-repair.png',
    spriteIndex: 0,
    mergesInto: 'repair_2',
    description: 'Small nail',
    coinValue: 8
  },
  'repair_2': {
    id: 'repair_2',
    name: 'Small Hammer',
    level: 2,
    category: 'repair',
    spriteSheet: '/items-repair.png',
    spriteIndex: 1,
    mergesInto: 'repair_3',
    description: 'Basic hammer',
    coinValue: 25
  },
  'repair_3': {
    id: 'repair_3',
    name: 'Wrench',
    level: 3,
    category: 'repair',
    spriteSheet: '/items-repair.png',
    spriteIndex: 2,
    mergesInto: 'repair_4',
    description: 'Adjustable wrench',
    coinValue: 80
  },
  'repair_4': {
    id: 'repair_4',
    name: 'Toolbox',
    level: 4,
    category: 'repair',
    spriteSheet: '/items-repair.png',
    spriteIndex: 3,
    mergesInto: 'repair_5',
    description: 'Complete toolbox',
    coinValue: 250
  },
  'repair_5': {
    id: 'repair_5',
    name: 'Workshop Tools',
    level: 5,
    category: 'repair',
    spriteSheet: '/items-repair.png',
    spriteIndex: 4,
    description: 'Professional workshop tools',
    coinValue: 800
  },
  
  'decor_1': {
    id: 'decor_1',
    name: 'Flower Seed',
    level: 1,
    category: 'decor',
    spriteSheet: '/items-decor.png',
    spriteIndex: 0,
    mergesInto: 'decor_2',
    description: 'Tiny flower seed',
    coinValue: 10
  },
  'decor_2': {
    id: 'decor_2',
    name: 'Small Plant',
    level: 2,
    category: 'decor',
    spriteSheet: '/items-decor.png',
    spriteIndex: 1,
    mergesInto: 'decor_3',
    description: 'Small potted plant',
    coinValue: 30
  },
  'decor_3': {
    id: 'decor_3',
    name: 'Potted Flower',
    level: 3,
    category: 'decor',
    spriteSheet: '/items-decor.png',
    spriteIndex: 2,
    mergesInto: 'decor_4',
    description: 'Beautiful potted flower',
    coinValue: 100
  },
  'decor_4': {
    id: 'decor_4',
    name: 'Flower Arrangement',
    level: 4,
    category: 'decor',
    spriteSheet: '/items-decor.png',
    spriteIndex: 3,
    mergesInto: 'decor_5',
    description: 'Lovely flower arrangement',
    coinValue: 300
  },
  'decor_5': {
    id: 'decor_5',
    name: 'Garden Centerpiece',
    level: 5,
    category: 'decor',
    spriteSheet: '/items-decor.png',
    spriteIndex: 4,
    description: 'Stunning garden centerpiece',
    coinValue: 1000
  }
};

export interface BoardItem {
  id: string;
  itemType: string;
  x: number;
  y: number;
}

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
    { id: crypto.randomUUID(), itemType: 'cleaning_1', x: 0, y: 0 },
    { id: crypto.randomUUID(), itemType: 'cleaning_1', x: 1, y: 0 },
    { id: crypto.randomUUID(), itemType: 'repair_1', x: 2, y: 0 },
    { id: crypto.randomUUID(), itemType: 'repair_1', x: 3, y: 0 },
    { id: crypto.randomUUID(), itemType: 'decor_1', x: 0, y: 1 }
  ];
}
