import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useSettingsStore } from '@/lib/stores/useSettingsStore';
import { Language, languageNames } from '@/lib/i18n/translations';
import { RotateCcw, Grid, Shield } from 'lucide-react';
import { 
  SettingsFlowerIcon, 
  SoundWaveIcon, 
  VolumeMutedIcon, 
  VolumeHighIcon, 
  EmailIcon, 
  LanguageGlobeIcon, 
  VersionLeafIcon, 
  BackArrowIcon, 
  CheckmarkIcon, 
  GoogleIcon, 
  AppleIcon, 
  CloseFlowerIcon,
  MergeBoardIcon 
} from '../icons/GardenIcons';

interface SettingsModalProps {
  onClose: () => void;
}

type SettingsTab = 'general' | 'board' | 'admin';
type SettingsView = 'main' | 'language' | 'account';

export default function SettingsModal({ onClose }: SettingsModalProps) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<SettingsTab>('general');
  const [currentView, setCurrentView] = useState<SettingsView>('main');
  const {
    language,
    soundVolume,
    soundMuted,
    connectedAccounts,
    appVersion,
    boardSettings,
    setLanguage,
    setSoundVolume,
    toggleSoundMute,
    setBoardSettings,
    resetBoardSettings,
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

  const tabs: { id: SettingsTab; label: string; icon: React.ReactNode }[] = [
    { id: 'general', label: 'General', icon: <SettingsFlowerIcon size={20} /> },
    { id: 'board', label: 'Board', icon: <MergeBoardIcon size={20} /> },
    { id: 'admin', label: 'Admin', icon: <Shield size={20} /> },
  ];

  const renderGeneralTab = () => (
    <motion.div
      key="general"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-4"
    >
      <AnimatePresence mode="wait">
        {currentView === 'main' && (
          <motion.div key="main-view" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg border-2 border-green-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-green-100 to-emerald-200 rounded-xl flex items-center justify-center">
                  <SoundWaveIcon size={24} color="#16a34a" />
                </div>
                <span className="font-bold text-gray-800">{t('settings.sound')}</span>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={toggleSoundMute}
                  className={`ml-auto w-10 h-10 rounded-full flex items-center justify-center ${
                    soundMuted ? 'bg-red-100' : 'bg-green-100'
                  }`}
                >
                  {soundMuted ? <VolumeMutedIcon size={24} color="#dc2626" /> : <VolumeHighIcon size={24} color="#16a34a" />}
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

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setCurrentView('account')}
              className="w-full bg-gradient-to-r from-blue-400 to-cyan-500 rounded-2xl p-4 shadow-lg flex items-center gap-4 border-2 border-blue-300"
            >
              <div className="w-12 h-12 bg-white/30 rounded-full flex items-center justify-center">
                <EmailIcon size={28} color="#fff" />
              </div>
              <div className="text-left">
                <span className="font-bold text-white block">{t('settings.connect_account')}</span>
                <span className="text-blue-100 text-sm">
                  {connectedAccounts.some((a) => a.connected) ? t('settings.connected') : t('settings.not_connected')}
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
              className="w-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-2xl p-4 shadow-lg flex items-center gap-4 border-2 border-amber-300"
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

            <div className="bg-gradient-to-r from-emerald-100 to-green-100 rounded-2xl p-4 shadow-lg flex items-center gap-4 border-2 border-green-300">
              <VersionLeafIcon size={32} />
              <div>
                <span className="font-bold text-gray-800 block">{t('settings.version')}</span>
                <span className="text-emerald-600 font-mono">{appVersion}</span>
              </div>
            </div>
          </motion.div>
        )}

        {currentView === 'language' && (
          <motion.div key="language-view" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-3">
            <motion.button whileTap={{ scale: 0.95 }} onClick={() => setCurrentView('main')} className="flex items-center gap-2 text-gray-600 mb-4">
              <BackArrowIcon size={32} />
              <span className="font-medium">{t('common.back')}</span>
            </motion.button>
            <h3 className="text-lg font-bold text-gray-800 mb-4">{t('settings.select_language')}</h3>
            {(Object.keys(languageNames) as Language[]).map((lang) => (
              <motion.button
                key={lang}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => { setLanguage(lang); setCurrentView('main'); }}
                className={`w-full rounded-2xl p-4 shadow-lg flex items-center gap-4 transition-all border-2 ${
                  language === lang ? 'bg-gradient-to-r from-emerald-400 to-green-500 text-white border-green-400' : 'bg-white/80 text-gray-800 hover:bg-white border-green-200'
                }`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xl font-bold ${language === lang ? 'bg-white/30' : 'bg-gray-100'}`}>
                  {lang.toUpperCase()}
                </div>
                <span className="font-bold">{languageNames[lang]}</span>
                {language === lang && <div className="ml-auto"><CheckmarkIcon size={28} /></div>}
              </motion.button>
            ))}
          </motion.div>
        )}

        {currentView === 'account' && (
          <motion.div key="account-view" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-3">
            <motion.button whileTap={{ scale: 0.95 }} onClick={() => setCurrentView('main')} className="flex items-center gap-2 text-gray-600 mb-4">
              <BackArrowIcon size={32} />
              <span className="font-medium">{t('common.back')}</span>
            </motion.button>
            <h3 className="text-lg font-bold text-gray-800 mb-4">{t('settings.connect_account')}</h3>
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full bg-white rounded-2xl p-4 shadow-lg flex items-center gap-4 border-2 border-gray-200 hover:border-red-300">
              <GoogleIcon size={40} />
              <div className="text-left">
                <span className="font-bold text-gray-800 block">{t('settings.google')}</span>
                <span className="text-gray-500 text-sm">{connectedAccounts.find((a) => a.type === 'google')?.connected ? t('settings.connected') : t('settings.not_connected')}</span>
              </div>
              {connectedAccounts.find((a) => a.type === 'google')?.connected && <CheckmarkIcon size={28} className="ml-auto" />}
            </motion.button>
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full bg-black rounded-2xl p-4 shadow-lg flex items-center gap-4">
              <div className="w-10 h-10 flex items-center justify-center"><AppleIcon size={36} color="#fff" /></div>
              <div className="text-left">
                <span className="font-bold text-white block">{t('settings.apple')}</span>
                <span className="text-gray-400 text-sm">{connectedAccounts.find((a) => a.type === 'apple')?.connected ? t('settings.connected') : t('settings.not_connected')}</span>
              </div>
            </motion.button>
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 rounded-2xl p-4 shadow-lg flex items-center gap-4">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center"><EmailIcon size={28} color="#fff" /></div>
              <div className="text-left">
                <span className="font-bold text-white block">{t('settings.email')}</span>
                <span className="text-purple-200 text-sm">{connectedAccounts.find((a) => a.type === 'email')?.email || t('settings.not_connected')}</span>
              </div>
            </motion.button>
            <p className="text-center text-gray-500 text-sm mt-4 px-4">Connect your account to save progress and sync across devices</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );

  const renderBoardTab = () => (
    <motion.div
      key="board"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-4"
    >
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
          <Grid size={20} className="text-green-600" />
          Board Size
        </h3>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={resetBoardSettings}
          className="flex items-center gap-1 px-3 py-1.5 bg-red-100 text-red-600 rounded-lg text-sm font-medium border border-red-200"
        >
          <RotateCcw size={14} />
          Reset
        </motion.button>
      </div>

      <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-5 shadow-lg border-2 border-green-200">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="text-sm font-medium text-gray-600 mb-2 block">Rows</label>
            <div className="flex items-center gap-3">
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setBoardSettings({ rows: Math.max(4, boardSettings.rows - 1) })}
                className="w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-500 text-white rounded-xl font-bold text-xl shadow-md"
              >
                -
              </motion.button>
              <div className="flex-1 text-center">
                <span className="text-3xl font-bold text-green-700">{boardSettings.rows}</span>
              </div>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setBoardSettings({ rows: Math.min(12, boardSettings.rows + 1) })}
                className="w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-500 text-white rounded-xl font-bold text-xl shadow-md"
              >
                +
              </motion.button>
            </div>
            <input
              type="range"
              min="4"
              max="12"
              value={boardSettings.rows}
              onChange={(e) => setBoardSettings({ rows: parseInt(e.target.value) })}
              className="w-full mt-3 h-2 bg-gray-200 rounded-full appearance-none cursor-pointer accent-green-500"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-600 mb-2 block">Columns</label>
            <div className="flex items-center gap-3">
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setBoardSettings({ cols: Math.max(3, boardSettings.cols - 1) })}
                className="w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-500 text-white rounded-xl font-bold text-xl shadow-md"
              >
                -
              </motion.button>
              <div className="flex-1 text-center">
                <span className="text-3xl font-bold text-green-700">{boardSettings.cols}</span>
              </div>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setBoardSettings({ cols: Math.min(8, boardSettings.cols + 1) })}
                className="w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-500 text-white rounded-xl font-bold text-xl shadow-md"
              >
                +
              </motion.button>
            </div>
            <input
              type="range"
              min="3"
              max="8"
              value={boardSettings.cols}
              onChange={(e) => setBoardSettings({ cols: parseInt(e.target.value) })}
              className="w-full mt-3 h-2 bg-gray-200 rounded-full appearance-none cursor-pointer accent-green-500"
            />
          </div>
        </div>

        <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
          <div className="flex items-center justify-center gap-2">
            <MergeBoardIcon size={24} />
            <span className="text-green-700 font-medium">
              Grid: {boardSettings.rows} x {boardSettings.cols} = {boardSettings.rows * boardSettings.cols} cells
            </span>
          </div>
        </div>
      </div>

      <p className="text-center text-gray-500 text-sm">Changes are saved automatically</p>
    </motion.div>
  );

  const renderAdminTab = () => (
    <motion.div
      key="admin"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-4"
    >
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border-2 border-red-200">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center mx-auto">
            <Shield size={32} color="#dc2626" />
          </div>
          <h3 className="text-xl font-bold text-gray-800">Admin Panel</h3>
          <p className="text-gray-600">Access advanced game management tools</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              navigate('/admin');
              onClose(); // Close settings modal when opening admin panel
            }}
            className="bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all"
          >
            Open Admin Panel
          </motion.button>
        </div>
      </div>
    </motion.div>
  );

  return (
    <>
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
          className="w-full max-w-md bg-gradient-to-b from-green-100 via-emerald-50 to-white rounded-3xl shadow-2xl overflow-hidden border-4 border-green-400"
        >
          <div className="bg-gradient-to-r from-emerald-500 via-green-500 to-emerald-500 p-4 flex items-center justify-between relative overflow-hidden">
            <div className="absolute inset-0 opacity-20">
            </div>
            <h2 className="text-2xl font-bold text-white drop-shadow-lg flex items-center gap-2 relative z-10">
              <SettingsFlowerIcon size={28} color="#fff" />
              {t('settings.title')}
            </h2>
            <motion.button
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="w-10 h-10 flex items-center justify-center relative z-10"
            >
              <CloseFlowerIcon size={36} />
            </motion.button>
          </div>

          <div className="flex border-b border-green-200 bg-gradient-to-r from-green-50 to-emerald-50">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id); setCurrentView('main'); }}
                className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-3 text-sm font-medium transition-all ${
                  activeTab === tab.id
                    ? 'text-green-700 border-b-3 border-green-500 bg-white/50'
                    : 'text-gray-500 hover:text-green-600 hover:bg-white/30'
                }`}
              >
                {tab.icon}
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>

          <div className="p-4 max-h-[60vh] overflow-y-auto">
            <AnimatePresence mode="wait">
              {activeTab === 'general' && renderGeneralTab()}
              {activeTab === 'board' && renderBoardTab()}
              {activeTab === 'admin' && renderAdminTab()}
            </AnimatePresence>
          </div>
        </motion.div>
      </motion.div>
    </>
  );
}
