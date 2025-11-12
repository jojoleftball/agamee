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
    talker: 'soly',
    content: 'Hey Maria! Can you believe it? We finally found our dream beach house!',
    iconUrl: '/sprites/Picsart_25-11-11_02-25-24-524_1762821030742.png',
    nextAction: 'continue',
    order: 1
  },
  {
    id: '2',
    talker: 'maria',
    content: 'I know, Soly! It\'s perfect! Though... it needs a lot of work, doesn\'t it?',
    iconUrl: '/sprites/Picsart_25-11-11_02-29-52-444_1762821030715.png',
    nextAction: 'continue',
    order: 2
  },
  {
    id: '3',
    talker: 'soly',
    content: 'That\'s what makes it exciting! We can make it exactly how we want it. Plus, our little one will grow up here!',
    iconUrl: '/sprites/Picsart_25-11-11_02-25-24-524_1762821030742.png',
    nextAction: 'continue',
    order: 3
  },
  {
    id: '4',
    talker: 'maria',
    content: 'You\'re right! Let\'s start by cleaning up and gathering some materials. I have a feeling this is going to be an amazing adventure!',
    iconUrl: '/sprites/Picsart_25-11-11_02-29-52-444_1762821030715.png',
    nextAction: 'end',
    order: 4
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
