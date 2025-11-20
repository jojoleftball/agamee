import { useState, useEffect } from 'react';
import { Settings, VolumeX, Volume2, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAudio } from '@/lib/stores/useAudio';
import { useMergeGame } from '@/lib/stores/useMergeGame';
import { useBoardStore } from '@/lib/stores/useBoardStore';
import { useTaskStore } from '@/lib/stores/useTaskStore';
import AdminPanel from './AdminPanel';
import MergeBoard from './MergeBoard';
import GameHUD from './GameHUD';
import TaskPanel from './TaskPanel';

interface NewGameScreenProps {
  onBackToMenu: () => void;
  onShowDialogue: () => void;
}

export default function NewGameScreen({ onBackToMenu, onShowDialogue }: NewGameScreenProps) {
  const { isMuted, toggleMute } = useAudio();
  const { initializeBoard } = useBoardStore();
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [showTaskPanel, setShowTaskPanel] = useState(false);
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
    <div className="fixed inset-0 bg-gradient-to-b from-sky-100 to-blue-200 flex flex-col overflow-hidden">
      {/* Enhanced HUD */}
      <GameHUD 
        onMenuClick={onBackToMenu}
        onTasksClick={() => setShowTaskPanel(true)}
      />

      {/* Main Game Area */}
      <div className="flex-1 flex flex-col items-center justify-start pt-48 overflow-auto">
        <MergeBoard />
      </div>

      {/* Control Buttons */}
      <div className="absolute top-52 right-4 flex flex-col gap-2 z-40">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setShowTaskPanel(true)}
          className="bg-pink-600/90 hover:bg-pink-700 text-white shadow-lg"
          title="Tasks"
        >
          <List className="w-5 h-5" />
        </Button>
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

      {/* Task Panel */}
      {showTaskPanel && (
        <TaskPanel onClose={() => setShowTaskPanel(false)} />
      )}

      {/* Admin Panel */}
      {showAdminPanel && <AdminPanel onClose={() => setShowAdminPanel(false)} />}
    </div>
  );
}
