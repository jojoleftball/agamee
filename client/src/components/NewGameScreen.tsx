import { useState } from 'react';
import { Settings, VolumeX, Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAudio } from '@/lib/stores/useAudio';
import { useMergeGame } from '@/lib/stores/useMergeGame';
import { BeachHouseArea } from '@/lib/stores/useBeachHouseStore';
import AdminPanel from './AdminPanel';
import BeachHouseView from './BeachHouseView';
import AreaTaskModal from './AreaTaskModal';
import MergeBoard from './MergeBoard';
import GameHUD from './GameHUD';

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
    <div className="fixed inset-0 bg-gradient-to-b from-amber-900 via-amber-700 to-amber-600 flex flex-col overflow-hidden">
      <GameHUD onMenuClick={onBackToMenu} />

      {showMergeGame ? (
        <div className="flex-1 flex flex-col pt-16 overflow-auto bg-gradient-to-b from-sky-100 to-blue-200">
          <MergeBoard />
          
          <div className="absolute top-20 right-4 flex flex-col gap-2 z-40">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMute}
              className="bg-amber-800/80 hover:bg-amber-700 text-white"
            >
              {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleSettingsClick}
              className="bg-amber-800/80 hover:bg-amber-700 text-white"
            >
              <Settings className="w-5 h-5" />
            </Button>
          </div>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-3 z-30">
            <Button
              onClick={() => setShowMergeGame(false)}
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold shadow-lg px-6"
            >
              View House
            </Button>
            <Button
              onClick={onShowDialogue}
              className="bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white font-bold shadow-lg px-6"
            >
              Story
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex-1 relative overflow-hidden pt-16">
          <BeachHouseView onAreaClick={handleAreaClick} />
          
          <div className="absolute top-20 right-4 flex flex-col gap-2 z-40">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMute}
              className="bg-amber-800/80 hover:bg-amber-700 text-white"
            >
              {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleSettingsClick}
              className="bg-amber-800/80 hover:bg-amber-700 text-white"
            >
              <Settings className="w-5 h-5" />
            </Button>
          </div>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-3 z-30">
            <Button
              onClick={() => setShowMergeGame(true)}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold shadow-lg px-6"
            >
              Merge Game
            </Button>
            <Button
              onClick={onShowDialogue}
              className="bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white font-bold shadow-lg px-6"
            >
              Story
            </Button>
          </div>
        </div>
      )}

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
