export type GameScreen = 
  | 'loading'
  | 'dialogue'
  | 'map'
  | 'garden'
  | 'merge_board';

export type PlantType = 
  | 'rose'
  | 'tulip'
  | 'sunflower'
  | 'daisy'
  | 'violet'
  | 'lily'
  | 'orchid'
  | 'marigold'
  | 'poppy'
  | 'peony';

export type ItemCategory =
  | 'plant'
  | 'tool'
  | 'generator'
  | 'chest';

export interface PlantItem {
  id: string;
  type: PlantType;
  rank: number;
  maxRank: number;
  name: string;
  sprite: string;
}

export interface ToolItem {
  id: string;
  type: 'water_bucket' | 'seed_bag';
  rank: number;
  maxRank: number;
  name: string;
  sprite: string;
}

export interface BoardItem {
  id: string;
  category: ItemCategory;
  itemType: string;
  rank: number;
  maxRank?: number;
  x: number;
  y: number;
  charges?: number;
  lastGenerated?: number;
}

export interface GardenSlot {
  id: number;
  occupied: boolean;
  plantId?: string;
  plantType?: PlantType;
  plantRank?: number;
  waterMeter: number;
  seedMeter: number;
  lastWatered?: number;
  lastFed?: number;
}

export interface GameResources {
  coins: number;
  energy: number;
  maxEnergy: number;
  gems: number;
  xp: number;
  level: number;
}

export interface Dialogue {
  id: string;
  character: 'maria' | 'soly';
  text: string;
  portrait: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  goalItemType: string;
  goalRank: number;
  goalCount: number;
  currentCount: number;
  rewards: {
    coins?: number;
    gems?: number;
    energy?: number;
    xp?: number;
  };
  completed: boolean;
}

export interface MergeResult {
  success: boolean;
  newItem?: BoardItem;
  consumedItems?: BoardItem[];
  position?: { x: number; y: number };
}
