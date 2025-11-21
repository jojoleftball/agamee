import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface SpecialEvent {
  id: string;
  name: string;
  type: 'rare_plant' | 'seasonal' | 'birthday' | 'bonus';
  active: boolean;
  startTime: number;
  endTime: number;
  rewards: {
    itemType?: string;
    coins?: number;
    gems?: number;
    energy?: number;
    multiplier?: number;
  };
  description: string;
}

interface SpecialEventsState {
  events: SpecialEvent[];
  activeEvent: SpecialEvent | null;
  lastEventCheck: number;
  
  checkForEvents: () => void;
  activateEvent: (eventId: string) => void;
  completeEvent: (eventId: string) => void;
  getActiveEvent: () => SpecialEvent | null;
}

const SPECIAL_EVENTS: SpecialEvent[] = [
  {
    id: 'rare_golden_rose',
    name: 'Golden Rose Bloom',
    type: 'rare_plant',
    active: false,
    startTime: 0,
    endTime: 0,
    rewards: {
      itemType: 'flower_9',
      coins: 1000,
      gems: 50
    },
    description: 'A rare golden rose has appeared in your garden!'
  },
  {
    id: 'spring_festival',
    name: 'Spring Flower Festival',
    type: 'seasonal',
    active: false,
    startTime: 0,
    endTime: 0,
    rewards: {
      multiplier: 2,
      gems: 20
    },
    description: 'All flower merges give double rewards!'
  },
  {
    id: 'harvest_bonus',
    name: 'Bountiful Harvest',
    type: 'seasonal',
    active: false,
    startTime: 0,
    endTime: 0,
    rewards: {
      multiplier: 1.5,
      coins: 500
    },
    description: 'Vegetable items give 50% more coins!'
  },
  {
    id: 'birthday_special',
    name: 'Garden Birthday Party',
    type: 'birthday',
    active: false,
    startTime: 0,
    endTime: 0,
    rewards: {
      coins: 2000,
      gems: 100,
      energy: 100
    },
    description: 'Celebrate with special birthday rewards!'
  },
  {
    id: 'energy_rush',
    name: 'Energy Rush Hour',
    type: 'bonus',
    active: false,
    startTime: 0,
    endTime: 0,
    rewards: {
      energy: 50,
      multiplier: 1.5
    },
    description: 'Energy regenerates 50% faster!'
  }
];

export const useSpecialEventsStore = create<SpecialEventsState>()(
  persist(
    (set, get) => ({
      events: SPECIAL_EVENTS,
      activeEvent: null,
      lastEventCheck: Date.now(),
      
      checkForEvents: () => {
        const now = Date.now();
        const state = get();
        
        // Check every hour for new events
        if (now - state.lastEventCheck < 3600000) {
          return;
        }
        
        // Random chance to trigger an event (10% per check)
        if (Math.random() < 0.1) {
          const availableEvents = SPECIAL_EVENTS.filter(e => !e.active);
          if (availableEvents.length > 0) {
            const randomEvent = availableEvents[Math.floor(Math.random() * availableEvents.length)];
            get().activateEvent(randomEvent.id);
          }
        }
        
        set({ lastEventCheck: now });
      },
      
      activateEvent: (eventId: string) => {
        const event = SPECIAL_EVENTS.find(e => e.id === eventId);
        if (!event) return;
        
        const now = Date.now();
        const duration = 24 * 60 * 60 * 1000; // 24 hours
        
        const activeEvent: SpecialEvent = {
          ...event,
          active: true,
          startTime: now,
          endTime: now + duration
        };
        
        set({ activeEvent });
      },
      
      completeEvent: (eventId: string) => {
        const state = get();
        if (!state.activeEvent) return;
        
        // Grant rewards
        const { useMergeGame } = require('./useMergeGame');
        const gameState = useMergeGame.getState();
        
        if (state.activeEvent.rewards.coins) {
          gameState.addCoins(state.activeEvent.rewards.coins);
        }
        if (state.activeEvent.rewards.gems) {
          gameState.addGems(state.activeEvent.rewards.gems);
        }
        if (state.activeEvent.rewards.energy) {
          gameState.addEnergy(state.activeEvent.rewards.energy);
        }
        
        // Add notification
        const { useNotificationStore } = require('./useNotificationStore');
        useNotificationStore.getState().addNotification({
          message: `Event rewards claimed!`,
          type: 'success'
        });
        
        set({ activeEvent: null });
      },
      
      getActiveEvent: () => {
        const state = get();
        const now = Date.now();
        
        // Check if current event has expired
        if (state.activeEvent && now > state.activeEvent.endTime) {
          set({ activeEvent: null });
          return null;
        }
        
        return state.activeEvent;
      }
    }),
    {
      name: 'special-events-storage'
    }
  )
);
