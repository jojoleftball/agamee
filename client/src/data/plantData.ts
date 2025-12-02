import type { PlantType } from '../types/game';

export interface PlantDefinition {
  type: PlantType;
  name: string;
  maxRank: number;
  emoji: string;
  color: string;
  coinValue: number;
  xpValue: number;
}

export const PLANT_DEFINITIONS: Record<PlantType, PlantDefinition> = {
  rose: {
    type: 'rose',
    name: 'Rose',
    maxRank: 5,
    emoji: '',
    color: '#ef4444',
    coinValue: 10,
    xpValue: 5,
  },
  tulip: {
    type: 'tulip',
    name: 'Tulip',
    maxRank: 5,
    emoji: '',
    color: '#ec4899',
    coinValue: 12,
    xpValue: 6,
  },
  sunflower: {
    type: 'sunflower',
    name: 'Sunflower',
    maxRank: 5,
    emoji: '',
    color: '#f59e0b',
    coinValue: 15,
    xpValue: 8,
  },
  daisy: {
    type: 'daisy',
    name: 'Daisy',
    maxRank: 4,
    emoji: '',
    color: '#fbbf24',
    coinValue: 8,
    xpValue: 4,
  },
  violet: {
    type: 'violet',
    name: 'Violet',
    maxRank: 4,
    emoji: '',
    color: '#8b5cf6',
    coinValue: 10,
    xpValue: 5,
  },
  lily: {
    type: 'lily',
    name: 'Lily',
    maxRank: 5,
    emoji: '',
    color: '#ec4899',
    coinValue: 18,
    xpValue: 10,
  },
  orchid: {
    type: 'orchid',
    name: 'Orchid',
    maxRank: 5,
    emoji: '',
    color: '#db2777',
    coinValue: 20,
    xpValue: 12,
  },
  marigold: {
    type: 'marigold',
    name: 'Marigold',
    maxRank: 4,
    emoji: '',
    color: '#f97316',
    coinValue: 14,
    xpValue: 7,
  },
  poppy: {
    type: 'poppy',
    name: 'Poppy',
    maxRank: 4,
    emoji: '',
    color: '#f43f5e',
    coinValue: 16,
    xpValue: 9,
  },
  peony: {
    type: 'peony',
    name: 'Peony',
    maxRank: 5,
    emoji: '',
    color: '#f472b6',
    coinValue: 22,
    xpValue: 11,
  },
};

export interface ToolDefinition {
  type: 'water_bucket' | 'seed_bag';
  name: string;
  maxRank: number;
  emoji: string;
  color: string;
}

export const TOOL_DEFINITIONS: Record<string, ToolDefinition> = {
  water_bucket: {
    type: 'water_bucket',
    name: 'Water Bucket',
    maxRank: 3,
    emoji: '',
    color: '#3b82f6',
  },
  seed_bag: {
    type: 'seed_bag',
    name: 'Seed Bag',
    maxRank: 3,
    emoji: '',
    color: '#84cc16',
  },
};

export interface GeneratorDefinition {
  id: string;
  name: string;
  emoji: string;
  generates: string[];
  cooldown: number;
  maxCharges: number;
  energyCost: number;
}

export const GENERATOR_DEFINITIONS: GeneratorDefinition[] = [
  {
    id: 'gen_rose',
    name: 'Rose Generator',
    emoji: '',
    generates: ['rose'],
    cooldown: 30000,
    maxCharges: 3,
    energyCost: 5,
  },
  {
    id: 'gen_tool',
    name: 'Tool Box',
    emoji: '',
    generates: ['water_bucket', 'seed_bag'],
    cooldown: 60000,
    maxCharges: 2,
    energyCost: 10,
  },
];
