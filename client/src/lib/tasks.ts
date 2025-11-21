// Task system - drives progression through item requests for Merge Garden

export interface Task {
  id: string;
  title: string;
  description: string;
  areaId: string;
  requiredItem: string;
  quantity: number;
  completed: boolean;
  rewards: {
    coins: number;
    xp: number;
    gems?: number;
  };
  order: number;
  unlockAreaId?: string;
}

export interface TaskArea {
  id: string;
  name: string;
  emoji: string;
  description: string;
  unlockCost: number;
  isUnlocked: boolean;
  tasks: Task[];
  completedTasks: number;
  totalTasks: number;
}

// ============ FLOWER BED TASKS ============
const flowerBedTasks: Task[] = [
  {
    id: 'flower_bed_1',
    title: 'Clear the Weeds',
    description: 'Remove weeds from the flower bed',
    areaId: 'flower_bed',
    requiredItem: 'tool_2',
    quantity: 1,
    completed: false,
    rewards: { coins: 25, xp: 10 },
    order: 1
  },
  {
    id: 'flower_bed_2',
    title: 'Plant Daisies',
    description: 'Add some beautiful daisies',
    areaId: 'flower_bed',
    requiredItem: 'flower_3',
    quantity: 2,
    completed: false,
    rewards: { coins: 50, xp: 20 },
    order: 2
  },
  {
    id: 'flower_bed_3',
    title: 'Add Tulips',
    description: 'Make the bed colorful with tulips',
    areaId: 'flower_bed',
    requiredItem: 'flower_4',
    quantity: 2,
    completed: false,
    rewards: { coins: 75, xp: 30, gems: 5 },
    order: 3,
    unlockAreaId: 'vegetable_patch'
  }
];

// ============ VEGETABLE PATCH TASKS ============
const vegetablePatchTasks: Task[] = [
  {
    id: 'veg_patch_1',
    title: 'Prepare the Soil',
    description: 'Get the soil ready for planting',
    areaId: 'vegetable_patch',
    requiredItem: 'tool_3',
    quantity: 1,
    completed: false,
    rewards: { coins: 80, xp: 35 },
    order: 1
  },
  {
    id: 'veg_patch_2',
    title: 'Plant Carrots',
    description: 'Grow some carrots',
    areaId: 'vegetable_patch',
    requiredItem: 'veg_3',
    quantity: 2,
    completed: false,
    rewards: { coins: 120, xp: 50 },
    order: 2
  },
  {
    id: 'veg_patch_3',
    title: 'Harvest Tomatoes',
    description: 'Grow and harvest tomatoes',
    areaId: 'vegetable_patch',
    requiredItem: 'veg_4',
    quantity: 2,
    completed: false,
    rewards: { coins: 150, xp: 60, gems: 10 },
    order: 3,
    unlockAreaId: 'pond_area'
  }
];

// ============ POND AREA TASKS ============
const pondAreaTasks: Task[] = [
  {
    id: 'pond_1',
    title: 'Clean the Pond',
    description: 'Remove debris from the water',
    areaId: 'pond_area',
    requiredItem: 'tool_4',
    quantity: 2,
    completed: false,
    rewards: { coins: 200, xp: 75 },
    order: 1
  },
  {
    id: 'pond_2',
    title: 'Add Water Plants',
    description: 'Beautify the pond area',
    areaId: 'pond_area',
    requiredItem: 'flower_5',
    quantity: 3,
    completed: false,
    rewards: { coins: 250, xp: 100, gems: 15 },
    order: 2,
    unlockAreaId: 'tree_grove'
  }
];

// ============ TREE GROVE TASKS ============
const treeGroveTasks: Task[] = [
  {
    id: 'tree_grove_1',
    title: 'Plant Young Trees',
    description: 'Start your tree grove',
    areaId: 'tree_grove',
    requiredItem: 'tree_2',
    quantity: 3,
    completed: false,
    rewards: { coins: 300, xp: 120 },
    order: 1
  },
  {
    id: 'tree_grove_2',
    title: 'Grow Oak Trees',
    description: 'Cultivate strong trees',
    areaId: 'tree_grove',
    requiredItem: 'tree_3',
    quantity: 2,
    completed: false,
    rewards: { coins: 400, xp: 150, gems: 20 },
    order: 2,
    unlockAreaId: 'greenhouse'
  }
];

// ============ ALL TASK AREAS ============
export const TASK_AREAS: TaskArea[] = [
  {
    id: 'flower_bed',
    name: 'Flower Bed',
    emoji: '🌸',
    description: 'Create a beautiful flower garden',
    unlockCost: 0,
    isUnlocked: true,
    tasks: flowerBedTasks,
    completedTasks: 0,
    totalTasks: flowerBedTasks.length
  },
  {
    id: 'vegetable_patch',
    name: 'Vegetable Patch',
    emoji: '🥕',
    description: 'Grow fresh vegetables',
    unlockCost: 100,
    isUnlocked: false,
    tasks: vegetablePatchTasks,
    completedTasks: 0,
    totalTasks: vegetablePatchTasks.length
  },
  {
    id: 'pond_area',
    name: 'Pond Area',
    emoji: '🌊',
    description: 'Create a peaceful water feature',
    unlockCost: 250,
    isUnlocked: false,
    tasks: pondAreaTasks,
    completedTasks: 0,
    totalTasks: pondAreaTasks.length
  },
  {
    id: 'tree_grove',
    name: 'Tree Grove',
    emoji: '🌳',
    description: 'Grow a magnificent tree grove',
    unlockCost: 400,
    isUnlocked: false,
    tasks: treeGroveTasks,
    completedTasks: 0,
    totalTasks: treeGroveTasks.length
  },
  {
    id: 'greenhouse',
    name: 'Greenhouse',
    emoji: '🏡',
    description: 'Build an amazing greenhouse',
    unlockCost: 600,
    isUnlocked: false,
    tasks: [],
    completedTasks: 0,
    totalTasks: 0
  },
  {
    id: 'zen_garden',
    name: 'Zen Garden',
    emoji: '☯️',
    description: 'Create a peaceful meditation space',
    unlockCost: 900,
    isUnlocked: false,
    tasks: [],
    completedTasks: 0,
    totalTasks: 0
  },
  {
    id: 'animal_sanctuary',
    name: 'Animal Sanctuary',
    emoji: '🦋',
    description: 'Welcome garden animals',
    unlockCost: 1200,
    isUnlocked: false,
    tasks: [],
    completedTasks: 0,
    totalTasks: 0
  },
  {
    id: 'rose_garden',
    name: 'Rose Garden',
    emoji: '🌹',
    description: 'Cultivate beautiful roses',
    unlockCost: 1500,
    isUnlocked: false,
    tasks: [],
    completedTasks: 0,
    totalTasks: 0
  }
];

// Helper to get next uncompleted task in an area
export function getNextTask(areaId: string, completedTaskIds: string[]): Task | null {
  const area = TASK_AREAS.find(a => a.id === areaId);
  if (!area) return null;
  
  const uncompletedTasks = area.tasks.filter(t => !completedTaskIds.includes(t.id));
  if (uncompletedTasks.length === 0) return null;
  
  return uncompletedTasks.sort((a, b) => a.order - b.order)[0];
}

// Helper to check if area is fully completed
export function isAreaCompleted(areaId: string, completedTaskIds: string[]): boolean {
  const area = TASK_AREAS.find(a => a.id === areaId);
  if (!area) return false;
  
  return area.tasks.every(t => completedTaskIds.includes(t.id));
}

// Get overall progress percentage
export function getOverallProgress(completedTaskIds: string[]): number {
  const totalTasks = TASK_AREAS.reduce((sum, area) => sum + area.totalTasks, 0);
  const completed = completedTaskIds.length;
  return totalTasks > 0 ? Math.floor((completed / totalTasks) * 100) : 0;
}

// Get area that should unlock after completing a task
export function getUnlockAreaId(taskId: string): string | undefined {
  for (const area of TASK_AREAS) {
    const task = area.tasks.find(t => t.id === taskId);
    if (task?.unlockAreaId) {
      return task.unlockAreaId;
    }
  }
  return undefined;
}
