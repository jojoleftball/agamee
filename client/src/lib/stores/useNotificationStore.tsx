import { create } from 'zustand';

export interface Notification {
  id: string;
  type: 'reward' | 'unlock' | 'merge' | 'hint' | 'level_up';
  title: string;
  message: string;
  coins?: number;
  gems?: number;
  energy?: number;
  xp?: number;
}

interface NotificationState {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id'>) => void;
  removeNotification: (id: string) => void;
  clearAll: () => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: [],
  
  addNotification: (notification) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString() + Math.random().toString(36)
    };
    
    set((state) => ({
      notifications: [...state.notifications, newNotification]
    }));
  },
  
  removeNotification: (id) => {
    set((state) => ({
      notifications: state.notifications.filter(n => n.id !== id)
    }));
  },
  
  clearAll: () => {
    set({ notifications: [] });
  }
}));
