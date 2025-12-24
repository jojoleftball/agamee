import { useState, useEffect } from 'react';
import { Settings, VolumeX, Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAudio } from '@/lib/stores/useAudio';
import { useBoardStore } from '@/lib/stores/useBoardStore';
import { useNotificationStore } from '@/lib/stores/useNotificationStore';
import AdminPanel from './AdminPanel';
import GameHUD from './GameHUD';
import GameViewSwitcher from './GameViewSwitcher';
import GardenPet from './GardenPet';
import NotificationToast from './NotificationToast';
import SpecialEventBanner from './SpecialEventBanner';

interface NewGameScreenProps {
  onBackToMenu: () => void;
  onShowDialogue: () => void;
}

export default function NewGameScreen({ onBackToMenu, onShowDialogue }: NewGameScreenProps) {
  const { isMuted, toggleMute } = useAudio();
  const { initializeBoard } = useBoardStore();
  const { notifications, removeNotification } = useNotificationStore();
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  
  // Initialize board on mount
  useEffect(() => {
    initializeBoard();
  }, [initializeBoard]);

  const handleSettingsClick = () => {
    setShowAdminPanel(true);
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
          className="bg-green-800/90 hover:bg-green-700 text-white shadow-lg"
        >
          {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleSettingsClick}
          className="bg-green-800/90 hover:bg-green-700 text-white shadow-lg"
        >
          <Settings className="w-5 h-5" />
        </Button>
      </div>

      {/* Special Event Banner */}
      <SpecialEventBanner />

      {/* Garden Pet Helper */}
      <GardenPet />

      {/* Notifications */}
      <div className="fixed top-0 right-0 z-50 p-4 space-y-2">
        {notifications.map(notification => (
          <NotificationToast
            key={notification.id}
            notification={notification}
            onClose={() => removeNotification(notification.id)}
          />
        ))}
      </div>

      {/* Admin Panel */}
      {showAdminPanel && <AdminPanel onClose={() => setShowAdminPanel(false)} />}
    </div>
  );
}
