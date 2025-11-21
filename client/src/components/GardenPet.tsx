import { useState, useEffect } from 'react';
import { useMergeGame } from '@/lib/stores/useMergeGame';
import { useBoardStore } from '@/lib/stores/useBoardStore';

const PET_MESSAGES = [
  "Great job merging! 🌺",
  "Your garden is looking beautiful! 🌸",
  "Keep planting those flowers! 🌻",
  "Don't forget to water your plants! 💧",
  "You're doing amazing! 🌼",
  "What a lovely garden! 🌷",
  "The flowers are blooming! 🌹",
  "Time to grow something new! 🌱",
  "Your garden makes me happy! ✨",
  "Let's make this the best garden ever! 🦋"
];

const HINTS = [
  "Tap generators to create new items!",
  "Merge 3 or more items to upgrade them!",
  "Open chests for rewards!",
  "Sell items you don't need for coins!",
  "Check the Garden Map to unlock new areas!",
  "Complete tasks to earn rewards!",
  "Generators recharge when merged!",
  "Higher level items give more coins!"
];

export default function GardenPet() {
  const [message, setMessage] = useState("");
  const [showMessage, setShowMessage] = useState(false);
  const [petPosition, setPetPosition] = useState({ x: 20, y: 80 });
  const [petAnimation, setPetAnimation] = useState<'idle' | 'bounce' | 'happy'>('idle');
  const { level, coins } = useMergeGame();
  const { items } = useBoardStore();
  
  // Show random messages periodically
  useEffect(() => {
    const messageInterval = setInterval(() => {
      const randomMessage = PET_MESSAGES[Math.floor(Math.random() * PET_MESSAGES.length)];
      setMessage(randomMessage);
      setShowMessage(true);
      setPetAnimation('happy');
      
      setTimeout(() => {
        setShowMessage(false);
        setPetAnimation('idle');
      }, 3000);
    }, 30000); // Every 30 seconds
    
    return () => clearInterval(messageInterval);
  }, []);
  
  // Show hints for new players
  useEffect(() => {
    if (level <= 3 && items.length < 10) {
      const hintTimer = setTimeout(() => {
        const randomHint = HINTS[Math.floor(Math.random() * HINTS.length)];
        setMessage(randomHint);
        setShowMessage(true);
        setPetAnimation('bounce');
        
        setTimeout(() => {
          setShowMessage(false);
          setPetAnimation('idle');
        }, 5000);
      }, 10000);
      
      return () => clearTimeout(hintTimer);
    }
  }, [level, items.length]);
  
  // Celebrate milestones
  useEffect(() => {
    if (coins > 0 && coins % 500 === 0) {
      setMessage(`Wow! ${coins} coins! You're doing great! 🎉`);
      setShowMessage(true);
      setPetAnimation('happy');
      
      setTimeout(() => {
        setShowMessage(false);
        setPetAnimation('idle');
      }, 4000);
    }
  }, [coins]);

  const handlePetClick = () => {
    const randomHint = HINTS[Math.floor(Math.random() * HINTS.length)];
    setMessage(randomHint);
    setShowMessage(true);
    setPetAnimation('bounce');
    
    setTimeout(() => {
      setShowMessage(false);
      setPetAnimation('idle');
    }, 4000);
  };

  return (
    <div className="fixed bottom-20 right-6 z-40 pointer-events-none">
      {/* Speech Bubble */}
      {showMessage && (
        <div className="absolute bottom-full mb-2 right-0 max-w-xs pointer-events-none animate-bounce-in">
          <div className="bg-white rounded-2xl shadow-2xl p-3 border-4 border-green-400 relative">
            <p className="text-sm font-bold text-gray-800">{message}</p>
            {/* Arrow */}
            <div className="absolute -bottom-2 right-4 w-4 h-4 bg-white border-b-4 border-r-4 border-green-400 transform rotate-45"></div>
          </div>
        </div>
      )}
      
      {/* Pet Character */}
      <div
        onClick={handlePetClick}
        className={`
          w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 
          rounded-full border-4 border-white shadow-2xl
          flex items-center justify-center cursor-pointer pointer-events-auto
          hover:scale-110 transition-transform
          ${petAnimation === 'bounce' ? 'animate-bounce' : ''}
          ${petAnimation === 'happy' ? 'animate-pulse' : ''}
        `}
      >
        {/* Simple Pet Face */}
        <div className="text-center">
          <div className="text-3xl mb-1">🦋</div>
        </div>
      </div>
      
      {/* Pet Shadow */}
      <div className="w-16 h-3 bg-black/20 rounded-full mx-auto mt-1 blur-sm"></div>
      
      <style>{`
        @keyframes bounce-in {
          0% {
            opacity: 0;
            transform: translateY(10px) scale(0.8);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        
        .animate-bounce-in {
          animation: bounce-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
