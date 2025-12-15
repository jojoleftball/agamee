export const GARDEN_COLORS = {
  primary: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#22c55e',
    600: '#16a34a',
    700: '#15803d',
    800: '#166534',
    900: '#14532d',
  },
  accent: {
    gold: '#fbbf24',
    goldDark: '#d97706',
    pink: '#f472b6',
    pinkDark: '#db2777',
    purple: '#a78bfa',
    sky: '#38bdf8',
  },
  ui: {
    cardBg: 'rgba(255, 255, 255, 0.95)',
    cardBorder: '#86efac',
    overlay: 'rgba(0, 0, 0, 0.5)',
    glass: 'rgba(255, 255, 255, 0.2)',
  }
};

export const GARDEN_GRADIENTS = {
  greenButton: 'linear-gradient(135deg, #22c55e 0%, #16a34a 50%, #15803d 100%)',
  goldButton: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 50%, #d97706 100%)',
  pinkButton: 'linear-gradient(135deg, #f472b6 0%, #ec4899 50%, #db2777 100%)',
  purpleButton: 'linear-gradient(135deg, #a78bfa 0%, #8b5cf6 50%, #7c3aed 100%)',
  skyButton: 'linear-gradient(135deg, #38bdf8 0%, #0ea5e9 50%, #0284c7 100%)',
  cardHeader: 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)',
  menuBg: 'linear-gradient(180deg, #86efac 0%, #4ade80 30%, #22c55e 70%, #16a34a 100%)',
  sunset: 'linear-gradient(180deg, #fef3c7 0%, #fde68a 20%, #fcd34d 50%, #f59e0b 100%)',
};

export const GARDEN_SHADOWS = {
  button: '0 4px 14px rgba(34, 197, 94, 0.4), inset 0 2px 0 rgba(255, 255, 255, 0.3)',
  card: '0 8px 32px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.08)',
  glow: '0 0 20px rgba(34, 197, 94, 0.6)',
  goldGlow: '0 0 20px rgba(251, 191, 36, 0.6)',
};

export interface GardenInfo {
  id: string;
  name: string;
  description: string;
  backgroundImage: string;
  thumbnailImage: string;
  unlockLevel: number;
  unlockCoins: number;
  position: { x: string; y: string };
  fogColor: string;
}

export const GARDENS: GardenInfo[] = [
  {
    id: 'basic',
    name: 'Sunny Meadow',
    description: 'A peaceful meadow bathed in warm sunlight. Perfect for beginners to start their gardening journey.',
    backgroundImage: '/game-assets/middle-garden-view.jpg',
    thumbnailImage: '/game-assets/basic_garden_background_vertical.png',
    unlockLevel: 1,
    unlockCoins: 0,
    position: { x: '50%', y: '50%' },
    fogColor: 'transparent',
  },
  {
    id: 'tropical',
    name: 'Tropical Paradise',
    description: 'An exotic garden with palm trees and colorful flowers. Feel the island breeze!',
    backgroundImage: '/game-assets/tropical_garden_background_vertical.png',
    thumbnailImage: '/game-assets/tropical_garden_background_vertical.png',
    unlockLevel: 5,
    unlockCoins: 500,
    position: { x: '80%', y: '25%' },
    fogColor: 'rgba(46, 204, 113, 0.6)',
  },
  {
    id: 'zen',
    name: 'Zen Sanctuary',
    description: 'A tranquil Japanese garden with bamboo and koi ponds. Find your inner peace.',
    backgroundImage: '/game-assets/zen_garden_background_vertical.png',
    thumbnailImage: '/game-assets/zen_garden_background_vertical.png',
    unlockLevel: 8,
    unlockCoins: 1000,
    position: { x: '20%', y: '25%' },
    fogColor: 'rgba(156, 163, 175, 0.7)',
  },
  {
    id: 'desert',
    name: 'Desert Oasis',
    description: 'A hidden oasis in the golden sands. Discover rare succulents and desert blooms.',
    backgroundImage: '/game-assets/desert_garden_background_vertical.png',
    thumbnailImage: '/game-assets/desert_garden_background_vertical.png',
    unlockLevel: 12,
    unlockCoins: 2000,
    position: { x: '20%', y: '75%' },
    fogColor: 'rgba(251, 191, 36, 0.5)',
  },
  {
    id: 'winter',
    name: 'Winter Wonderland',
    description: 'A magical snowy garden with evergreens and ice crystals. Embrace the cold beauty.',
    backgroundImage: '/game-assets/winter_garden_background_vertical.png',
    thumbnailImage: '/game-assets/winter_garden_background_vertical.png',
    unlockLevel: 15,
    unlockCoins: 3000,
    position: { x: '80%', y: '75%' },
    fogColor: 'rgba(186, 230, 253, 0.7)',
  },
];

export interface DecorationItem {
  id: string;
  name: string;
  category: 'trees' | 'flowers' | 'structures' | 'paths' | 'decorations';
  sprite: string;
  width: number;
  height: number;
  cost: number;
  unlockLevel: number;
}

export const DECORATION_ITEMS: DecorationItem[] = [
  { id: 'oak_tree', name: 'Oak Tree', category: 'trees', sprite: '/sprites/tree_oak.png', width: 2, height: 2, cost: 100, unlockLevel: 1 },
  { id: 'pine_tree', name: 'Pine Tree', category: 'trees', sprite: '/sprites/tree_pine.png', width: 2, height: 2, cost: 150, unlockLevel: 3 },
  { id: 'cherry_tree', name: 'Cherry Blossom', category: 'trees', sprite: '/sprites/tree_cherry.png', width: 2, height: 2, cost: 300, unlockLevel: 5 },
  { id: 'flower_red', name: 'Red Roses', category: 'flowers', sprite: '/sprites/flower_red.png', width: 1, height: 1, cost: 50, unlockLevel: 1 },
  { id: 'flower_blue', name: 'Blue Tulips', category: 'flowers', sprite: '/sprites/flower_blue.png', width: 1, height: 1, cost: 50, unlockLevel: 2 },
  { id: 'flower_yellow', name: 'Sunflowers', category: 'flowers', sprite: '/sprites/flower_yellow.png', width: 1, height: 1, cost: 75, unlockLevel: 4 },
  { id: 'fence_wood', name: 'Wooden Fence', category: 'structures', sprite: '/sprites/fence_wood.png', width: 1, height: 1, cost: 25, unlockLevel: 1 },
  { id: 'fence_white', name: 'White Picket', category: 'structures', sprite: '/sprites/fence_white.png', width: 1, height: 1, cost: 40, unlockLevel: 3 },
  { id: 'bench', name: 'Garden Bench', category: 'decorations', sprite: '/sprites/bench.png', width: 2, height: 1, cost: 200, unlockLevel: 5 },
  { id: 'fountain', name: 'Fountain', category: 'decorations', sprite: '/sprites/fountain.png', width: 2, height: 2, cost: 500, unlockLevel: 8 },
  { id: 'path_stone', name: 'Stone Path', category: 'paths', sprite: '/sprites/path_stone.png', width: 1, height: 1, cost: 15, unlockLevel: 1 },
  { id: 'path_brick', name: 'Brick Path', category: 'paths', sprite: '/sprites/path_brick.png', width: 1, height: 1, cost: 25, unlockLevel: 4 },
];

export interface ChestType {
  id: string;
  name: string;
  sprite: string;
  openTime: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  rewards: {
    coins: { min: number; max: number };
    gems: { min: number; max: number };
    energy: { min: number; max: number };
  };
}

export const CHEST_TYPES: ChestType[] = [
  {
    id: 'wooden',
    name: 'Wooden Chest',
    sprite: '/sprites/chest_wooden.png',
    openTime: 30,
    rarity: 'common',
    rewards: { coins: { min: 10, max: 50 }, gems: { min: 0, max: 2 }, energy: { min: 5, max: 10 } },
  },
  {
    id: 'silver',
    name: 'Silver Chest',
    sprite: '/sprites/chest_silver.png',
    openTime: 180,
    rarity: 'rare',
    rewards: { coins: { min: 50, max: 150 }, gems: { min: 2, max: 5 }, energy: { min: 10, max: 25 } },
  },
  {
    id: 'golden',
    name: 'Golden Chest',
    sprite: '/sprites/chest_golden.png',
    openTime: 600,
    rarity: 'epic',
    rewards: { coins: { min: 150, max: 400 }, gems: { min: 5, max: 15 }, energy: { min: 25, max: 50 } },
  },
  {
    id: 'diamond',
    name: 'Diamond Chest',
    sprite: '/sprites/chest_diamond.png',
    openTime: 1800,
    rarity: 'legendary',
    rewards: { coins: { min: 400, max: 1000 }, gems: { min: 15, max: 50 }, energy: { min: 50, max: 100 } },
  },
];
