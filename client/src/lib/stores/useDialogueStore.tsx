import { create } from "zustand";

export interface AdminDialogue {
  id: string;
  talker: 'soly' | 'maria' | 'baby' | 'both';
  content: string;
  iconUrl: string;
  nextAction: 'continue' | 'end' | 'custom';
  customAction?: string;
  order: number;
}

interface DialogueState {
  dialogues: AdminDialogue[];
  addDialogue: (dialogue: Omit<AdminDialogue, 'id'>) => void;
  updateDialogue: (id: string, dialogue: Partial<AdminDialogue>) => void;
  deleteDialogue: (id: string) => void;
  reorderDialogues: (dialogues: AdminDialogue[]) => void;
  getDialoguesByOrder: () => AdminDialogue[];
  loadDialogues: () => void;
  saveDialogues: () => void;
}

const STORAGE_KEY = "merge_story_admin_dialogues";

const defaultDialogues: AdminDialogue[] = [
  {
    id: '1',
    talker: 'maria',
    content: 'Oh wow... look at this old garden! It must have been beautiful once.',
    iconUrl: '/sprites/Picsart_25-11-11_02-29-52-444_1762821030715.png',
    nextAction: 'continue',
    order: 1
  },
  {
    id: '2',
    talker: 'soly',
    content: 'I can see the potential! With some love and care, we can restore it to its former glory!',
    iconUrl: '/sprites/Picsart_25-11-11_02-25-24-524_1762821030742.png',
    nextAction: 'continue',
    order: 2
  },
  {
    id: '3',
    talker: 'maria',
    content: 'The garden house is still standing, at least. It\'ll be the perfect place to live while we work on the garden!',
    iconUrl: '/sprites/Picsart_25-11-11_02-29-52-444_1762821030715.png',
    nextAction: 'continue',
    order: 3
  },
  {
    id: '4',
    talker: 'soly',
    content: 'Let\'s start by planting some seeds and clearing the weeds. Every beautiful garden starts with a single flower!',
    iconUrl: '/sprites/Picsart_25-11-11_02-25-24-524_1762821030742.png',
    nextAction: 'continue',
    order: 4
  },
  {
    id: '5',
    talker: 'maria',
    content: 'I found some old gardening tools in the shed! Let\'s get to work and create something magical together!',
    iconUrl: '/sprites/Picsart_25-11-11_02-29-52-444_1762821030715.png',
    nextAction: 'end',
    order: 5
  }
];

export const useDialogueStore = create<DialogueState>((set, get) => ({
  dialogues: defaultDialogues,

  addDialogue: (dialogue) => {
    const newDialogue: AdminDialogue = {
      ...dialogue,
      id: Date.now().toString(),
    };
    set((state) => ({
      dialogues: [...state.dialogues, newDialogue],
    }));
    get().saveDialogues();
  },

  updateDialogue: (id, updates) => {
    set((state) => ({
      dialogues: state.dialogues.map((d) =>
        d.id === id ? { ...d, ...updates } : d
      ),
    }));
    get().saveDialogues();
  },

  deleteDialogue: (id) => {
    set((state) => ({
      dialogues: state.dialogues.filter((d) => d.id !== id),
    }));
    get().saveDialogues();
  },

  reorderDialogues: (dialogues) => {
    set({ dialogues });
    get().saveDialogues();
  },

  getDialoguesByOrder: () => {
    return [...get().dialogues].sort((a, b) => a.order - b.order);
  },

  saveDialogues: () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(get().dialogues));
    } catch (error) {
      console.error("Failed to save dialogues:", error);
    }
  },

  loadDialogues: () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        set({ dialogues: parsed });
      }
    } catch (error) {
      console.error("Failed to load dialogues:", error);
    }
  },
}));
