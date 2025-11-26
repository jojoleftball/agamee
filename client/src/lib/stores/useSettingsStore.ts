import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Language, translations, Translations } from '../i18n/translations';

interface AccountConnection {
  type: 'google' | 'apple' | 'email';
  connected: boolean;
  email?: string;
}

interface SettingsState {
  language: Language;
  soundVolume: number;
  musicVolume: number;
  soundMuted: boolean;
  musicMuted: boolean;
  hasSeenIntro: boolean;
  connectedAccounts: AccountConnection[];
  appVersion: string;
  
  setLanguage: (lang: Language) => void;
  setSoundVolume: (volume: number) => void;
  setMusicVolume: (volume: number) => void;
  toggleSoundMute: () => void;
  toggleMusicMute: () => void;
  setHasSeenIntro: (seen: boolean) => void;
  connectAccount: (type: 'google' | 'apple' | 'email', email?: string) => void;
  disconnectAccount: (type: 'google' | 'apple' | 'email') => void;
  getTranslations: () => Translations;
  t: (key: string) => string;
}

const STORAGE_KEY = 'merge-garden-settings';
const APP_VERSION = '1.0.0';

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set, get) => ({
      language: 'en',
      soundVolume: 80,
      musicVolume: 60,
      soundMuted: false,
      musicMuted: false,
      hasSeenIntro: false,
      connectedAccounts: [
        { type: 'google', connected: false },
        { type: 'apple', connected: false },
        { type: 'email', connected: false },
      ],
      appVersion: APP_VERSION,

      setLanguage: (lang) => set({ language: lang }),
      
      setSoundVolume: (volume) => set({ soundVolume: Math.max(0, Math.min(100, volume)) }),
      
      setMusicVolume: (volume) => set({ musicVolume: Math.max(0, Math.min(100, volume)) }),
      
      toggleSoundMute: () => set((state) => ({ soundMuted: !state.soundMuted })),
      
      toggleMusicMute: () => set((state) => ({ musicMuted: !state.musicMuted })),
      
      setHasSeenIntro: (seen) => set({ hasSeenIntro: seen }),
      
      connectAccount: (type, email) => set((state) => ({
        connectedAccounts: state.connectedAccounts.map((acc) =>
          acc.type === type ? { ...acc, connected: true, email } : acc
        ),
      })),
      
      disconnectAccount: (type) => set((state) => ({
        connectedAccounts: state.connectedAccounts.map((acc) =>
          acc.type === type ? { ...acc, connected: false, email: undefined } : acc
        ),
      })),

      getTranslations: () => {
        const { language } = get();
        return translations[language];
      },

      t: (key: string) => {
        const { language } = get();
        const keys = key.split('.');
        let result: unknown = translations[language];
        
        for (const k of keys) {
          if (result && typeof result === 'object' && k in result) {
            result = (result as Record<string, unknown>)[k];
          } else {
            return key;
          }
        }
        
        return typeof result === 'string' ? result : key;
      },
    }),
    {
      name: STORAGE_KEY,
      partialize: (state) => ({
        language: state.language,
        soundVolume: state.soundVolume,
        musicVolume: state.musicVolume,
        soundMuted: state.soundMuted,
        musicMuted: state.musicMuted,
        hasSeenIntro: state.hasSeenIntro,
        connectedAccounts: state.connectedAccounts,
      }),
    }
  )
);
