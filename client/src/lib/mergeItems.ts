export interface MergeItem {
  id: string;
  name: string;
  level: number;
  emoji: string;
  category: 'flower' | 'furniture' | 'tool' | 'decoration';
  mergesInto?: string;
  description: string;
  coinValue: number;
}

export const MERGE_ITEMS: Record<string, MergeItem> = {
  'seed': {
    id: 'seed',
    name: 'Seed',
    level: 1,
    emoji: '🌱',
    category: 'flower',
    mergesInto: 'sprout',
    description: 'A tiny seed full of potential',
    coinValue: 5
  },
  'sprout': {
    id: 'sprout',
    name: 'Sprout',
    level: 2,
    emoji: '🌿',
    category: 'flower',
    mergesInto: 'flower',
    description: 'A small green sprout',
    coinValue: 15
  },
  'flower': {
    id: 'flower',
    name: 'Flower',
    level: 3,
    emoji: '🌸',
    category: 'flower',
    mergesInto: 'bouquet',
    description: 'A beautiful pink flower',
    coinValue: 50
  },
  'bouquet': {
    id: 'bouquet',
    name: 'Bouquet',
    level: 4,
    emoji: '💐',
    category: 'flower',
    mergesInto: 'garden',
    description: 'A lovely flower bouquet',
    coinValue: 150
  },
  'garden': {
    id: 'garden',
    name: 'Garden',
    level: 5,
    emoji: '🌻',
    category: 'flower',
    description: 'A flourishing garden',
    coinValue: 500
  },
  
  'wood': {
    id: 'wood',
    name: 'Wood',
    level: 1,
    emoji: '🪵',
    category: 'furniture',
    mergesInto: 'plank',
    description: 'Raw wood log',
    coinValue: 10
  },
  'plank': {
    id: 'plank',
    name: 'Plank',
    level: 2,
    emoji: '🪚',
    category: 'furniture',
    mergesInto: 'chair',
    description: 'Wooden plank',
    coinValue: 30
  },
  'chair': {
    id: 'chair',
    name: 'Chair',
    level: 3,
    emoji: '🪑',
    category: 'furniture',
    mergesInto: 'table',
    description: 'Comfortable wooden chair',
    coinValue: 100
  },
  'table': {
    id: 'table',
    name: 'Table',
    level: 4,
    emoji: '🛋️',
    category: 'furniture',
    mergesInto: 'furniture_set',
    description: 'Beautiful dining table',
    coinValue: 300
  },
  'furniture_set': {
    id: 'furniture_set',
    name: 'Furniture Set',
    level: 5,
    emoji: '🏡',
    category: 'furniture',
    description: 'Complete furniture set',
    coinValue: 1000
  },
  
  'stone': {
    id: 'stone',
    name: 'Stone',
    level: 1,
    emoji: '🪨',
    category: 'decoration',
    mergesInto: 'brick',
    description: 'A smooth stone',
    coinValue: 8
  },
  'brick': {
    id: 'brick',
    name: 'Brick',
    level: 2,
    emoji: '🧱',
    category: 'decoration',
    mergesInto: 'wall',
    description: 'Clay brick',
    coinValue: 25
  },
  'wall': {
    id: 'wall',
    name: 'Wall',
    level: 3,
    emoji: '🏠',
    category: 'decoration',
    mergesInto: 'room',
    description: 'Sturdy wall section',
    coinValue: 80
  },
  'room': {
    id: 'room',
    name: 'Room',
    level: 4,
    emoji: '🏘️',
    category: 'decoration',
    description: 'A cozy room',
    coinValue: 250
  },
  
  'hammer': {
    id: 'hammer',
    name: 'Hammer',
    level: 1,
    emoji: '🔨',
    category: 'tool',
    mergesInto: 'toolbox',
    description: 'Basic hammer',
    coinValue: 12
  },
  'toolbox': {
    id: 'toolbox',
    name: 'Toolbox',
    level: 2,
    emoji: '🧰',
    category: 'tool',
    mergesInto: 'workshop',
    description: 'Complete toolbox',
    coinValue: 40
  },
  'workshop': {
    id: 'workshop',
    name: 'Workshop',
    level: 3,
    emoji: '⚒️',
    category: 'tool',
    description: 'Fully equipped workshop',
    coinValue: 120
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
    { id: crypto.randomUUID(), itemType: 'seed', x: 0, y: 0 },
    { id: crypto.randomUUID(), itemType: 'seed', x: 1, y: 0 },
    { id: crypto.randomUUID(), itemType: 'wood', x: 2, y: 0 },
    { id: crypto.randomUUID(), itemType: 'stone', x: 0, y: 1 },
    { id: crypto.randomUUID(), itemType: 'hammer', x: 1, y: 1 }
  ];
}
