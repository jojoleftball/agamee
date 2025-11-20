import { useState, useEffect } from 'react';
import { Settings, VolumeX, Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAudio } from '@/lib/stores/useAudio';
import { useBoardStore } from '@/lib/stores/useBoardStore';
import AdminPanel from './AdminPanel';
import GameHUD from './GameHUD';
import GameViewSwitcher from './GameViewSwitcher';

interface NewGameScreenProps {
  onBackToMenu: () => void;
  onShowDialogue: () => void;
}

export default function NewGameScreen({ onBackToMenu, onShowDialogue }: NewGameScreenProps) {
  const { isMuted, toggleMute } = useAudio();
  const { initializeBoard } = useBoardStore();
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [settingsClickCount, setSettingsClickCount] = useState(0);
  const [lastClickTime, setLastClickTime] = useState(0);
  
  // Initialize board on mount
  useEffect(() => {
    initializeBoard();
  }, [initializeBoard]);

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

  return (
    <div className="fixed inset-0 flex flex-col overflow-hidden">
      {/* Game HUD */}
      <GameHUD 
        onMenuClick={onBackToMenu}
      />

      {/* Main Game Area with View Switcher */}
      <div className="flex-1 relative">
        <GameViewSwitcher />
      </div>

      {/* Control Buttons */}
      <div className="absolute top-24 right-4 flex flex-col gap-2 z-40">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleMute}
          className="bg-amber-800/90 hover:bg-amber-700 text-white shadow-lg"
        >
          {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleSettingsClick}
          className="bg-amber-800/90 hover:bg-amber-700 text-white shadow-lg"
        >
          <Settings className="w-5 h-5" />
        </Button>
      </div>

      {/* Admin Panel */}
      {showAdminPanel && <AdminPanel onClose={() => setShowAdminPanel(false)} />}
    </div>
  );
}
