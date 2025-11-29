import { useEffect, useState } from 'react';
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
    </div>
  );
}
