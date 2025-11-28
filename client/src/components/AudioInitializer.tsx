import { useEffect, useState } from 'react';
import { VolumeHighIcon, VolumeMutedIcon } from './icons/GardenIcons';
import { soundManager } from '../lib/sounds';

interface AudioInitializerProps {
  children: React.ReactNode;
}

export default function AudioInitializer({ children }: AudioInitializerProps) {
  const [audioStarted, setAudioStarted] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    const handleFirstInteraction = () => {
      if (!audioStarted) {
        soundManager.playBackground();
        setAudioStarted(true);
      }
    };

    document.addEventListener('click', handleFirstInteraction, { once: true });
    document.addEventListener('touchstart', handleFirstInteraction, { once: true });

    return () => {
      document.removeEventListener('click', handleFirstInteraction);
      document.removeEventListener('touchstart', handleFirstInteraction);
    };
  }, [audioStarted]);

  const handleToggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newMuted = soundManager.toggleMute();
    setIsMuted(newMuted);
  };

  return (
    <div className="relative h-full w-full">
      {children}
      <button
        onClick={handleToggleMute}
        className="fixed bottom-4 right-4 z-[100] w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-lg border-2 border-green-300 hover:scale-105 active:scale-95 transition-all"
        aria-label={isMuted ? 'Unmute' : 'Mute'}
      >
        {isMuted ? (
          <VolumeMutedIcon size={26} color="#fff" />
        ) : (
          <VolumeHighIcon size={26} color="#fff" />
        )}
      </button>
    </div>
  );
}
