// Task system - drives progression through item requests (Merge Mansion style)

export interface Task {
  id: string;
  title: string;
  description: string;
  areaId: string; // Which beach house area this belongs to
  requiredItem: string; // Item type ID needed
  quantity: number; // How many needed
  completed: boolean;
  rewards: {
    coins: number;
    xp: number;
    gems?: number;
  };
  order: number; // Order within area
  unlockAreaId?: string; // Completing this unlocks a new area
}

export interface TaskArea {
  id: string;
  name: string;
  emoji: string;
  description: string;
  unlockCost: number; // Coins to unlock this area
  isUnlocked: boolean;
  tasks: Task[];
  completedTasks: number;
  totalTasks: number;
}

// ============ ENTRANCE AREA TASKS ============
const entranceTasks: Task[] = [
  {
    id: 'entrance_1',
    title: 'Clean the Front Door',
    description: 'Remove sand and debris from entrance',
    areaId: 'entrance',
    requiredItem: 'tool_2', // Sand Rake
    quantity: 1,
    completed: false,
    rewards: { coins: 25, xp: 10 },
    order: 1
  },
  {
    id: 'entrance_2',
    title: 'Clear the Pathway',
    description: 'Clean the path to the house',
    areaId: 'entrance',
    requiredItem: 'tool_3', // Beach Broom
    quantity: 2,
    completed: false,
    rewards: { coins: 50, xp: 20 },
    order: 2
  },
  {
    id: 'entrance_3',
    title: 'Place Welcome Mat',
    description: 'Add a nice doormat',
    areaId: 'entrance',
    requiredItem: 'furniture_2', // Wooden Stool (as mat)
    quantity: 1,
    completed: false,
    rewards: { coins: 75, xp: 30 },
    order: 3
  },
  {
    id: 'entrance_4',
    title: 'Plant Flowers',
    description: 'Make the entrance welcoming',
    areaId: 'entrance',
    requiredItem: 'plant_3', // Small Palm
    quantity: 2,
    completed: false,
    rewards: { coins: 100, xp: 40, gems: 5 },
    order: 4,
    unlockAreaId: 'living_room'
  }
];

// ============ LIVING ROOM AREA TASKS ============
const livingRoomTasks: Task[] = [
  {
    id: 'living_1',
    title: 'Deep Clean the Floor',
    description: 'Scrub the living room floor',
    areaId: 'living_room',
    requiredItem: 'tool_4', // Cleaning Brush Set
    quantity: 2,
    completed: false,
    rewards: { coins: 80, xp: 35 },
    order: 1
  },
  {
    id: 'living_2',
    title: 'Fix the Windows',
    description: 'Clean and repair windows',
    areaId: 'living_room',
    requiredItem: 'tool_5', // Power Washer
    quantity: 1,
    completed: false,
    rewards: { coins: 120, xp: 50 },
    order: 2
  },
  {
    id: 'living_3',
    title: 'Add Seating',
    description: 'Place comfortable furniture',
    areaId: 'living_room',
    requiredItem: 'furniture_3', // Beach Chair
    quantity: 3,
    completed: false,
    rewards: { coins: 150, xp: 60 },
    order: 3
  },
  {
    id: 'living_4',
    title: 'Decorate with Plants',
    description: 'Add tropical plants',
    areaId: 'living_room',
    requiredItem: 'plant_4', // Beach Flowers
    quantity: 2,
    completed: false,
    rewards: { coins: 200, xp: 80 },
    order: 4
  },
  {
    id: 'living_5',
    title: 'Install Luxury Furniture',
    description: 'Complete the living room',
    areaId: 'living_room',
    requiredItem: 'furniture_4', // Lounge Set
    quantity: 2,
    completed: false,
    rewards: { coins: 300, xp: 120, gems: 10 },
    order: 5,
    unlockAreaId: 'kitchen'
  }
];

// ============ KITCHEN AREA TASKS ============
const kitchenTasks: Task[] = [
  {
    id: 'kitchen_1',
    title: 'Clean the Counters',
    description: 'Scrub all surfaces',
    areaId: 'kitchen',
    requiredItem: 'tool_5', // Power Washer
    quantity: 2,
    completed: false,
    rewards: { coins: 120, xp: 55 },
    order: 1
  },
  {
    id: 'kitchen_2',
    title: 'Install Cabinets',
    description: 'Add storage space',
    areaId: 'kitchen',
    requiredItem: 'furniture_5', // Beach Cabana (as cabinets)
    quantity: 2,
    completed: false,
    rewards: { coins: 250, xp: 100 },
    order: 2
  },
  {
    id: 'kitchen_3',
    title: 'Add Herb Garden',
    description: 'Fresh herbs for cooking',
    areaId: 'kitchen',
    requiredItem: 'plant_5', // Tropical Bush
    quantity: 3,
    completed: false,
    rewards: { coins: 300, xp: 120 },
    order: 3
  },
  {
    id: 'kitchen_4',
    title: 'Professional Setup',
    description: 'Complete kitchen renovation',
    areaId: 'kitchen',
    requiredItem: 'tool_6', // Beach Tool Kit
    quantity: 1,
    completed: false,
    rewards: { coins: 400, xp: 160, gems: 15 },
    order: 4,
    unlockAreaId: 'bedroom'
  }
];

// ============ BEDROOM AREA TASKS ============
const bedroomTasks: Task[] = [
  {
    id: 'bedroom_1',
    title: 'Clean and Air Out',
    description: 'Fresh air and clean space',
    areaId: 'bedroom',
    requiredItem: 'tool_6', // Beach Tool Kit
    quantity: 2,
    completed: false,
    rewards: { coins: 200, xp: 90 },
    order: 1
  },
  {
    id: 'bedroom_2',
    title: 'Install Bedroom Set',
    description: 'Comfortable sleeping area',
    areaId: 'bedroom',
    requiredItem: 'furniture_6', // Patio Furniture Set
    quantity: 2,
    completed: false,
    rewards: { coins: 350, xp: 140 },
    order: 2
  },
  {
    id: 'bedroom_3',
    title: 'Add Tropical Ambiance',
    description: 'Beautiful plants for atmosphere',
    areaId: 'bedroom',
    requiredItem: 'plant_6', // Palm Tree
    quantity: 2,
    completed: false,
    rewards: { coins: 400, xp: 180 },
    order: 3
  },
  {
    id: 'bedroom_4',
    title: 'Luxury Touches',
    description: 'Premium bedroom setup',
    areaId: 'bedroom',
    requiredItem: 'furniture_7', // Luxury Deck
    quantity: 1,
    completed: false,
    rewards: { coins: 600, xp: 240, gems: 20 },
    order: 4,
    unlockAreaId: 'nursery'
  }
];

// ============ NURSERY (BABY'S ROOM) TASKS ============
const nurseryTasks: Task[] = [
  {
    id: 'nursery_1',
    title: 'Deep Clean for Baby',
    description: 'Make it perfectly clean',
    areaId: 'nursery',
    requiredItem: 'tool_7', // Professional Cleaning Gear
    quantity: 3,
    completed: false,
    rewards: { coins: 300, xp: 150 },
    order: 1
  },
  {
    id: 'nursery_2',
    title: 'Safe Furniture',
    description: 'Baby-safe furniture setup',
    areaId: 'nursery',
    requiredItem: 'furniture_7', // Luxury Deck
    quantity: 2,
    completed: false,
    rewards: { coins: 500, xp: 200 },
    order: 2
  },
  {
    id: 'nursery_3',
    title: 'Calming Plants',
    description: 'Peaceful green environment',
    areaId: 'nursery',
    requiredItem: 'plant_7', // Tropical Garden
    quantity: 2,
    completed: false,
    rewards: { coins: 600, xp: 250 },
    order: 3
  },
  {
    id: 'nursery_4',
    title: 'Perfect for Baby',
    description: 'Complete the nursery',
    areaId: 'nursery',
    requiredItem: 'furniture_8', // Beach House Suite
    quantity: 1,
    completed: false,
    rewards: { coins: 800, xp: 320, gems: 25 },
    order: 4,
    unlockAreaId: 'garden'
  }
];

// ============ GARDEN AREA TASKS ============
const gardenTasks: Task[] = [
  {
    id: 'garden_1',
    title: 'Clear the Garden',
    description: 'Remove overgrowth',
    areaId: 'garden',
    requiredItem: 'tool_7', // Professional Cleaning Gear
    quantity: 2,
    completed: false,
    rewards: { coins: 350, xp: 180 },
    order: 1
  },
  {
    id: 'garden_2',
    title: 'Plant Foundation',
    description: 'Start the garden',
    areaId: 'garden',
    requiredItem: 'plant_7', // Tropical Garden
    quantity: 3,
    completed: false,
    rewards: { coins: 500, xp: 220 },
    order: 2
  },
  {
    id: 'garden_3',
    title: 'Garden Furniture',
    description: 'Places to relax',
    areaId: 'garden',
    requiredItem: 'furniture_8', // Beach House Suite
    quantity: 2,
    completed: false,
    rewards: { coins: 700, xp: 280 },
    order: 3
  },
  {
    id: 'garden_4',
    title: 'Paradise Garden',
    description: 'Create the ultimate garden',
    areaId: 'garden',
    requiredItem: 'plant_8', // Paradise Garden
    quantity: 2,
    completed: false,
    rewards: { coins: 1000, xp: 400 },
    order: 4
  },
  {
    id: 'garden_5',
    title: 'Legendary Touch',
    description: 'The final masterpiece',
    areaId: 'garden',
    requiredItem: 'plant_9', // Golden Palm
    quantity: 1,
    completed: false,
    rewards: { coins: 2000, xp: 800, gems: 50 },
    order: 5,
    unlockAreaId: 'beach'
  }
];

// ============ BEACH AREA TASKS (Final Area) ============
const beachTasks: Task[] = [
  {
    id: 'beach_1',
    title: 'Ultimate Cleaning',
    description: 'Pristine beach area',
    areaId: 'beach',
    requiredItem: 'tool_8', // Industrial Beach Cleaner
    quantity: 3,
    completed: false,
    rewards: { coins: 800, xp: 400 },
    order: 1
  },
  {
    id: 'beach_2',
    title: 'Luxury Beach Setup',
    description: 'Premium beach furniture',
    areaId: 'beach',
    requiredItem: 'furniture_8', // Beach House Suite
    quantity: 3,
    completed: false,
    rewards: { coins: 1200, xp: 500 },
    order: 2
  },
  {
    id: 'beach_3',
    title: 'Paradise Landscaping',
    description: 'Beautiful beach gardens',
    areaId: 'beach',
    requiredItem: 'plant_8', // Paradise Garden
    quantity: 3,
    completed: false,
    rewards: { coins: 1500, xp: 600 },
    order: 3
  },
  {
    id: 'beach_4',
    title: 'The Perfect Beach House',
    description: 'Complete your dream home',
    areaId: 'beach',
    requiredItem: 'plant_9', // Golden Palm
    quantity: 3,
    completed: false,
    rewards: { coins: 5000, xp: 2000, gems: 100 },
    order: 4
  }
];

// ============ ALL TASK AREAS ============
export const TASK_AREAS: TaskArea[] = [
  {
    id: 'entrance',
    name: 'Entrance',
    emoji: '🚪',
    description: 'Clean up the entrance to your beach house',
    unlockCost: 0, // Free - starting area
    isUnlocked: true,
    tasks: entranceTasks,
    completedTasks: 0,
    totalTasks: entranceTasks.length
  },
  {
    id: 'living_room',
    name: 'Living Room',
    emoji: '🛋️',
    description: 'Make the living room cozy and welcoming',
    unlockCost: 150,
    isUnlocked: false,
    tasks: livingRoomTasks,
    completedTasks: 0,
    totalTasks: livingRoomTasks.length
  },
  {
    id: 'kitchen',
    name: 'Kitchen',
    emoji: '🍳',
    description: 'Create a perfect family kitchen',
    unlockCost: 400,
    isUnlocked: false,
    tasks: kitchenTasks,
    completedTasks: 0,
    totalTasks: kitchenTasks.length
  },
  {
    id: 'bedroom',
    name: 'Bedroom',
    emoji: '🛏️',
    description: 'A peaceful place to rest',
    unlockCost: 800,
    isUnlocked: false,
    tasks: bedroomTasks,
    completedTasks: 0,
    totalTasks: bedroomTasks.length
  },
  {
    id: 'nursery',
    name: "Baby's Room",
    emoji: '👶',
    description: 'A sweet room for your little one',
    unlockCost: 1500,
    isUnlocked: false,
    tasks: nurseryTasks,
    completedTasks: 0,
    totalTasks: nurseryTasks.length
  },
  {
    id: 'garden',
    name: 'Garden',
    emoji: '🌺',
    description: 'A tropical paradise garden',
    unlockCost: 2500,
    isUnlocked: false,
    tasks: gardenTasks,
    completedTasks: 0,
    totalTasks: gardenTasks.length
  },
  {
    id: 'beach',
    name: 'Private Beach',
    emoji: '🏖️',
    description: 'Your own piece of paradise',
    unlockCost: 5000,
    isUnlocked: false,
    tasks: beachTasks,
    completedTasks: 0,
    totalTasks: beachTasks.length
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
  return Math.floor((completed / totalTasks) * 100);
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
