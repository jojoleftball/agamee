import { useState } from 'react';
import { Settings, VolumeX, Volume2, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAudio } from '@/lib/stores/useAudio';
import AdminPanel from './AdminPanel';

interface NewGameScreenProps {
  onBackToMenu: () => void;
  onShowDialogue: () => void;
}

export default function NewGameScreen({ onBackToMenu, onShowDialogue }: NewGameScreenProps) {
  const { isMuted, toggleMute } = useAudio();
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [settingsClickCount, setSettingsClickCount] = useState(0);
  const [lastClickTime, setLastClickTime] = useState(0);

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

      <div className="flex-1 overflow-y-auto flex items-center justify-center p-4">
        <div className="text-center space-y-6 max-w-md">
          <img
            src="/sprites/IMG_20251111_022306_1762821019727.png"
            alt="Beach House"
            className="w-full h-auto object-contain"
            style={{ 
              maxHeight: '40vh',
              filter: 'drop-shadow(0 10px 30px rgba(0, 0, 0, 0.2))'
            }}
          />
          
          <h2 className="text-2xl font-bold text-gray-800">
            Your Dream Beach House Awaits
          </h2>
          
          <p className="text-gray-600 leading-relaxed">
            Join Soly and Maria as they transform this beach house into their perfect home. 
            Discover their story, complete tasks, and bring their dreams to life!
          </p>

          <div className="space-y-3">
            <Button
              onClick={onShowDialogue}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-bold py-4 rounded-lg shadow-lg"
            >
              Continue Story
            </Button>
            
            <div className="text-sm text-gray-500">
              Tip: Tap the <Settings className="w-4 h-4 inline" /> button 3 times to access admin panel
            </div>
          </div>
        </div>
      </div>

      {showAdminPanel && <AdminPanel onClose={() => setShowAdminPanel(false)} />}
    </div>
  );
}
