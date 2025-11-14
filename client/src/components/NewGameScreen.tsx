import { useState } from 'react';
import { Settings, VolumeX, Volume2, Home, Zap, Coins } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAudio } from '@/lib/stores/useAudio';
import { useMergeGame } from '@/lib/stores/useMergeGame';
import { BeachHouseArea } from '@/lib/stores/useBeachHouseStore';
import AdminPanel from './AdminPanel';
import BeachHouseView from './BeachHouseView';
import AreaTaskModal from './AreaTaskModal';

interface NewGameScreenProps {
  onBackToMenu: () => void;
  onShowDialogue: () => void;
}

export default function NewGameScreen({ onBackToMenu, onShowDialogue }: NewGameScreenProps) {
  const { isMuted, toggleMute } = useAudio();
  const { energy, maxEnergy, coins } = useMergeGame();
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [settingsClickCount, setSettingsClickCount] = useState(0);
  const [lastClickTime, setLastClickTime] = useState(0);
  const [selectedArea, setSelectedArea] = useState<BeachHouseArea | null>(null);
  const [showMergeGame, setShowMergeGame] = useState(false);

  const handleSettingsClick = () => {
    const now = Date.now();
    
    if (now - lastClickTime > 1000) {
      setSettingsClickCount(1);
    } else {
      setSettingsClickCount(prev => prev + 1);
    }
    
    setLastClickTime(now);

    if (settingsClickCount >= 2) {
      setShowAdminPanel(true);
      setSettingsClickCount(0);
    }
  };

  const handleAreaClick = (area: BeachHouseArea) => {
    setSelectedArea(area);
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-b from-sky-200 to-blue-100 flex flex-col overflow-hidden">
      <div className="bg-white/90 backdrop-blur-sm shadow-md p-4 flex justify-between items-center z-20">
        <Button
          variant="ghost"
          size="icon"
          onClick={onBackToMenu}
          className="hover:bg-gray-200"
        >
          <Home className="w-5 h-5" />
        </Button>
        
        <h1 className="text-xl font-bold text-gray-800">Beach House Story</h1>
        
        <div className="flex gap-2">
          <div className="flex items-center gap-2 bg-blue-100 px-3 py-1 rounded-full">
            <Zap className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-bold text-blue-800">{energy}/{maxEnergy}</span>
          </div>
          <div className="flex items-center gap-2 bg-yellow-100 px-3 py-1 rounded-full">
            <Coins className="w-4 h-4 text-yellow-600" />
            <span className="text-sm font-bold text-yellow-800">{coins}</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleMute}
            className="hover:bg-gray-200"
          >
            {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleSettingsClick}
            className="hover:bg-gray-200"
          >
            <Settings className="w-5 h-5" />
          </Button>
        </div>
      </div>

      <div className="flex-1 relative overflow-hidden">
        <BeachHouseView onAreaClick={handleAreaClick} />
      </div>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-3 z-30">
        <Button
          onClick={onShowDialogue}
          className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-bold shadow-lg"
        >
          📖 Story
        </Button>
        <Button
          onClick={() => setShowMergeGame(true)}
          className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-bold shadow-lg"
        >
          🎮 Merge Game
        </Button>
      </div>

      {selectedArea && (
        <AreaTaskModal
          area={selectedArea}
          onClose={() => setSelectedArea(null)}
          onStartMerge={() => {
            setSelectedArea(null);
            setShowMergeGame(true);
          }}
        />
      )}

      {showAdminPanel && <AdminPanel onClose={() => setShowAdminPanel(false)} />}
    </div>
  );
}
