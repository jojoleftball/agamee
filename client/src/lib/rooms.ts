export interface Room {
  id: string;
  name: string;
  emoji: string;
  description: string;
  unlockCost: number;
  chapter: number;
  isUnlocked: boolean;
}

export const ROOMS: Room[] = [
  {
    id: 'living_room',
    name: 'Living Room',
    emoji: '🛋️',
    description: 'A cozy space for the family to relax together',
    unlockCost: 500,
    chapter: 1,
    isUnlocked: true
  },
  {
    id: 'garden',
    name: 'Garden',
    emoji: '🌻',
    description: 'A beautiful outdoor space with flowers and plants',
    unlockCost: 1000,
    chapter: 2,
    isUnlocked: false
  },
  {
    id: 'kitchen',
    name: 'Kitchen',
    emoji: '🍳',
    description: 'Where delicious family meals are made',
    unlockCost: 1500,
    chapter: 3,
    isUnlocked: false
  },
  {
    id: 'nursery',
    name: 'Baby\'s Room',
    emoji: '👶',
    description: 'A sweet room for your little one',
    unlockCost: 2000,
    chapter: 3,
    isUnlocked: false
  },
  {
    id: 'bedroom',
    name: 'Bedroom',
    emoji: '🛏️',
    description: 'A peaceful place to rest and dream',
    unlockCost: 2500,
    chapter: 4,
    isUnlocked: false
  },
  {
    id: 'beach',
    name: 'Beach Area',
    emoji: '🏖️',
    description: 'Your private beach paradise',
    unlockCost: 3000,
    chapter: 5,
    isUnlocked: false
  }
];
