import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSettingsStore, HUDPositions } from '@/lib/stores/useSettingsStore';
import { Language, languageNames } from '@/lib/i18n/translations';
import { Settings2, RotateCcw } from 'lucide-react';
import AdminPanel from './AdminPanel';
import {
  CloseFlowerIcon,
  SoundWaveIcon,
  MusicNoteIcon,
  VolumeHighIcon,
  VolumeMutedIcon,
  GoogleIcon,
  AppleIcon,
  EmailIcon,
  LanguageGlobeIcon,
  VersionLeafIcon,
  CheckmarkIcon,
  BackArrowIcon,
  AdminLayoutIcon,
} from '../icons/GardenIcons';

interface SettingsModalProps {
  onClose: () => void;
}

type SettingsView = 'main' | 'language' | 'account' | 'admin';

export default function SettingsModal({ onClose }: SettingsModalProps) {
  const [currentView, setCurrentView] = useState<SettingsView>('main');
  const {
    language,
    soundVolume,
    musicVolume,
    soundMuted,
    musicMuted,
    connectedAccounts,
    appVersion,
    hudPositions,
    setLanguage,
    setSoundVolume,
    setMusicVolume,
    toggleSoundMute,
    toggleMusicMute,
    setHUDPosition,
    resetHUDPositions,
    t,
  } = useSettingsStore();

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      if (currentView !== 'main') {
        setCurrentView('main');
      } else {
        onClose();
      }
    }
  };

  const renderMainView = () => (
    <motion.div
      key="main"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="space-y-4"
    >
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg">
        <div className="flex items-center gap-3 mb-4">
          <SoundWaveIcon size={28} color="#16a34a" />
          <span className="font-bold text-gray-800">{t('settings.sound')}</span>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={toggleSoundMute}
            className={`ml-auto w-10 h-10 rounded-full flex items-center justify-center ${
              soundMuted ? 'bg-red-100' : 'bg-green-100'
            }`}
          >
            {soundMuted ? (
              <VolumeMutedIcon size={24} color="#dc2626" />
            ) : (
              <VolumeHighIcon size={24} color="#16a34a" />
            )}
          </motion.button>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600 w-8">{soundMuted ? 0 : soundVolume}</span>
          <input
            type="range"
            min="0"
            max="100"
            value={soundMuted ? 0 : soundVolume}
            onChange={(e) => setSoundVolume(parseInt(e.target.value))}
            disabled={soundMuted}
            className="flex-1 h-3 bg-gray-200 rounded-full appearance-none cursor-pointer accent-emerald-500 disabled:opacity-50"
          />
          <span className="text-sm text-gray-600">100</span>
        </div>
      </div>

      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg">
        <div className="flex items-center gap-3 mb-4">
          <MusicNoteIcon size={28} color="#8b5cf6" />
          <span className="font-bold text-gray-800">{t('settings.music')}</span>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={toggleMusicMute}
            className={`ml-auto w-10 h-10 rounded-full flex items-center justify-center ${
              musicMuted ? 'bg-red-100' : 'bg-purple-100'
            }`}
          >
            {musicMuted ? (
              <VolumeMutedIcon size={24} color="#dc2626" />
            ) : (
              <VolumeHighIcon size={24} color="#8b5cf6" />
            )}
          </motion.button>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600 w-8">{musicMuted ? 0 : musicVolume}</span>
          <input
            type="range"
            min="0"
            max="100"
            value={musicMuted ? 0 : musicVolume}
            onChange={(e) => setMusicVolume(parseInt(e.target.value))}
            disabled={musicMuted}
            className="flex-1 h-3 bg-gray-200 rounded-full appearance-none cursor-pointer accent-purple-500 disabled:opacity-50"
          />
          <span className="text-sm text-gray-600">100</span>
        </div>
      </div>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setCurrentView('account')}
        className="w-full bg-gradient-to-r from-blue-400 to-cyan-500 rounded-2xl p-4 shadow-lg flex items-center gap-4"
      >
        <div className="w-12 h-12 bg-white/30 rounded-full flex items-center justify-center">
          <EmailIcon size={28} color="#fff" />
        </div>
        <div className="text-left">
          <span className="font-bold text-white block">{t('settings.connect_account')}</span>
          <span className="text-blue-100 text-sm">
            {connectedAccounts.some((a) => a.connected)
              ? t('settings.connected')
              : t('settings.not_connected')}
          </span>
        </div>
        <svg className="ml-auto" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
          <path d="M9 18l6-6-6-6" />
        </svg>
      </motion.button>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setCurrentView('language')}
        className="w-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-2xl p-4 shadow-lg flex items-center gap-4"
      >
        <div className="w-12 h-12 bg-white/30 rounded-full flex items-center justify-center">
          <LanguageGlobeIcon size={28} color="#fff" />
        </div>
        <div className="text-left">
          <span className="font-bold text-white block">{t('settings.language')}</span>
          <span className="text-amber-100 text-sm">{languageNames[language]}</span>
        </div>
        <svg className="ml-auto" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
          <path d="M9 18l6-6-6-6" />
        </svg>
      </motion.button>

      <div className="bg-gradient-to-r from-emerald-100 to-green-100 rounded-2xl p-4 shadow-lg flex items-center gap-4">
        <VersionLeafIcon size={32} />
        <div>
          <span className="font-bold text-gray-800 block">{t('settings.version')}</span>
          <span className="text-emerald-600 font-mono">{appVersion}</span>
        </div>
      </div>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setCurrentView('admin')}
        className="w-full bg-gradient-to-r from-slate-600 to-gray-700 rounded-2xl p-4 shadow-lg flex items-center gap-4"
      >
        <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
          <AdminLayoutIcon size={28} color="#fff" />
        </div>
        <div className="text-left">
          <span className="font-bold text-white block">Admin</span>
          <span className="text-gray-300 text-sm">Manage HUD positions</span>
        </div>
        <svg className="ml-auto" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
          <path d="M9 18l6-6-6-6" />
        </svg>
      </motion.button>
    </motion.div>
  );

  const renderLanguageView = () => (
    <motion.div
      key="language"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-3"
    >
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={() => setCurrentView('main')}
        className="flex items-center gap-2 text-gray-600 mb-4"
      >
        <BackArrowIcon size={32} />
        <span className="font-medium">{t('common.back')}</span>
      </motion.button>

      <h3 className="text-lg font-bold text-gray-800 mb-4">{t('settings.select_language')}</h3>

      {(Object.keys(languageNames) as Language[]).map((lang) => (
        <motion.button
          key={lang}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            setLanguage(lang);
            setCurrentView('main');
          }}
          className={`w-full rounded-2xl p-4 shadow-lg flex items-center gap-4 transition-all ${
            language === lang
              ? 'bg-gradient-to-r from-emerald-400 to-green-500 text-white'
              : 'bg-white/80 text-gray-800 hover:bg-white'
          }`}
        >
          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xl font-bold ${
            language === lang ? 'bg-white/30' : 'bg-gray-100'
          }`}>
            {lang.toUpperCase()}
          </div>
          <span className="font-bold">{languageNames[lang]}</span>
          {language === lang && (
            <div className="ml-auto">
              <CheckmarkIcon size={28} />
            </div>
          )}
        </motion.button>
      ))}
    </motion.div>
  );

  const renderAccountView = () => (
    <motion.div
      key="account"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-3"
    >
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={() => setCurrentView('main')}
        className="flex items-center gap-2 text-gray-600 mb-4"
      >
        <BackArrowIcon size={32} />
        <span className="font-medium">{t('common.back')}</span>
      </motion.button>

      <h3 className="text-lg font-bold text-gray-800 mb-4">{t('settings.connect_account')}</h3>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full bg-white rounded-2xl p-4 shadow-lg flex items-center gap-4 border-2 border-gray-200 hover:border-red-300"
      >
        <GoogleIcon size={40} />
        <div className="text-left">
          <span className="font-bold text-gray-800 block">{t('settings.google')}</span>
          <span className="text-gray-500 text-sm">
            {connectedAccounts.find((a) => a.type === 'google')?.connected
              ? t('settings.connected')
              : t('settings.not_connected')}
          </span>
        </div>
        {connectedAccounts.find((a) => a.type === 'google')?.connected && (
          <CheckmarkIcon size={28} className="ml-auto" />
        )}
      </motion.button>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full bg-black rounded-2xl p-4 shadow-lg flex items-center gap-4"
      >
        <div className="w-10 h-10 flex items-center justify-center">
          <AppleIcon size={36} color="#fff" />
        </div>
        <div className="text-left">
          <span className="font-bold text-white block">{t('settings.apple')}</span>
          <span className="text-gray-400 text-sm">
            {connectedAccounts.find((a) => a.type === 'apple')?.connected
              ? t('settings.connected')
              : t('settings.not_connected')}
          </span>
        </div>
        {connectedAccounts.find((a) => a.type === 'apple')?.connected && (
          <CheckmarkIcon size={28} className="ml-auto" />
        )}
      </motion.button>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 rounded-2xl p-4 shadow-lg flex items-center gap-4"
      >
        <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
          <EmailIcon size={28} color="#fff" />
        </div>
        <div className="text-left">
          <span className="font-bold text-white block">{t('settings.email')}</span>
          <span className="text-purple-200 text-sm">
            {connectedAccounts.find((a) => a.type === 'email')?.connected
              ? connectedAccounts.find((a) => a.type === 'email')?.email
              : t('settings.not_connected')}
          </span>
        </div>
        {connectedAccounts.find((a) => a.type === 'email')?.connected && (
          <CheckmarkIcon size={28} className="ml-auto" />
        )}
      </motion.button>

      <p className="text-center text-gray-500 text-sm mt-4 px-4">
        Connect your account to save progress and sync across devices
      </p>
    </motion.div>
  );

  const hudElements: { key: keyof HUDPositions; label: string; color: string }[] = [
    { key: 'levelCircle', label: 'Level', color: 'from-amber-400 to-yellow-500' },
    { key: 'coinsBar', label: 'Coins', color: 'from-yellow-400 to-amber-600' },
    { key: 'gemsBar', label: 'Gems', color: 'from-emerald-400 to-green-600' },
  ];

  const renderAdminView = () => (
    <motion.div
      key="admin"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-3"
    >
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={() => setCurrentView('main')}
        className="flex items-center gap-2 text-gray-600 mb-4"
      >
        <BackArrowIcon size={32} />
        <span className="font-medium">{t('common.back')}</span>
      </motion.button>

      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-800">HUD Positions</h3>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={resetHUDPositions}
          className="flex items-center gap-1 px-3 py-1.5 bg-red-100 text-red-600 rounded-lg text-sm font-medium"
        >
          <RotateCcw size={16} />
          Reset All
        </motion.button>
      </div>

      <p className="text-gray-500 text-sm mb-4">
        Adjust the position and appearance of your game HUD elements
      </p>

      {hudElements.map(({ key, label, color }) => (
        <div key={key} className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-lg">
          <div className={`flex items-center gap-3 mb-3 px-3 py-2 rounded-xl bg-gradient-to-r ${color}`}>
            <span className="font-bold text-white text-sm">{label}</span>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-500 block mb-1">X Position</label>
              <input
                type="range"
                min="-50"
                max="50"
                value={hudPositions[key].x}
                onChange={(e) => setHUDPosition(key, { x: parseInt(e.target.value) })}
                className="w-full h-2 bg-gray-200 rounded-full appearance-none cursor-pointer accent-blue-500"
              />
              <span className="text-xs text-gray-600">{hudPositions[key].x}px</span>
            </div>
            <div>
              <label className="text-xs text-gray-500 block mb-1">Y Position</label>
              <input
                type="range"
                min="-50"
                max="50"
                value={hudPositions[key].y}
                onChange={(e) => setHUDPosition(key, { y: parseInt(e.target.value) })}
                className="w-full h-2 bg-gray-200 rounded-full appearance-none cursor-pointer accent-blue-500"
              />
              <span className="text-xs text-gray-600">{hudPositions[key].y}px</span>
            </div>
            <div>
              <label className="text-xs text-gray-500 block mb-1">Text X Offset</label>
              <input
                type="range"
                min="-30"
                max="30"
                value={hudPositions[key].textOffsetX}
                onChange={(e) => setHUDPosition(key, { textOffsetX: parseInt(e.target.value) })}
                className="w-full h-2 bg-gray-200 rounded-full appearance-none cursor-pointer accent-purple-500"
              />
              <span className="text-xs text-gray-600">{hudPositions[key].textOffsetX}px</span>
            </div>
            <div>
              <label className="text-xs text-gray-500 block mb-1">Text Y Offset</label>
              <input
                type="range"
                min="-30"
                max="30"
                value={hudPositions[key].textOffsetY}
                onChange={(e) => setHUDPosition(key, { textOffsetY: parseInt(e.target.value) })}
                className="w-full h-2 bg-gray-200 rounded-full appearance-none cursor-pointer accent-purple-500"
              />
              <span className="text-xs text-gray-600">{hudPositions[key].textOffsetY}px</span>
            </div>
            <div>
              <label className="text-xs text-gray-500 block mb-1">Scale</label>
              <input
                type="range"
                min="50"
                max="150"
                value={hudPositions[key].scale * 100}
                onChange={(e) => setHUDPosition(key, { scale: parseInt(e.target.value) / 100 })}
                className="w-full h-2 bg-gray-200 rounded-full appearance-none cursor-pointer accent-green-500"
              />
              <span className="text-xs text-gray-600">{Math.round(hudPositions[key].scale * 100)}%</span>
            </div>
            <div>
              <label className="text-xs text-gray-500 block mb-1">Font Size</label>
              <input
                type="range"
                min="8"
                max="28"
                value={hudPositions[key].fontSize}
                onChange={(e) => setHUDPosition(key, { fontSize: parseInt(e.target.value) })}
                className="w-full h-2 bg-gray-200 rounded-full appearance-none cursor-pointer accent-orange-500"
              />
              <span className="text-xs text-gray-600">{hudPositions[key].fontSize}px</span>
            </div>
          </div>
        </div>
      ))}
    </motion.div>
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={handleBackdropClick}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
    >
      <motion.div
        initial={{ scale: 0.9, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 50 }}
        className="w-full max-w-md bg-gradient-to-b from-green-100 via-emerald-50 to-white rounded-3xl shadow-2xl overflow-hidden"
      >
        <div className="bg-gradient-to-r from-emerald-500 to-green-600 p-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white drop-shadow-lg">
            {t('settings.title')}
          </h2>
          <motion.button
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center"
          >
            <CloseFlowerIcon size={36} />
          </motion.button>
        </div>

        <div className="p-4 max-h-[70vh] overflow-y-auto">
          <AnimatePresence mode="wait">
            {currentView === 'main' && renderMainView()}
            {currentView === 'language' && renderLanguageView()}
            {currentView === 'account' && renderAccountView()}
            {currentView === 'admin' && renderAdminView()}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
}
