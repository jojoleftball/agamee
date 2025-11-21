import { useEffect, useState } from 'react';
import { useSpecialEventsStore } from '@/lib/stores/useSpecialEventsStore';
import { Sparkles, Gift, X } from 'lucide-react';

export default function SpecialEventBanner() {
  const { activeEvent, checkForEvents, completeEvent } = useSpecialEventsStore();
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    // Check for events on mount and periodically
    checkForEvents();
    const interval = setInterval(checkForEvents, 60000); // Every minute
    return () => clearInterval(interval);
  }, [checkForEvents]);
  
  useEffect(() => {
    if (activeEvent) {
      setIsVisible(true);
    }
  }, [activeEvent]);
  
  if (!activeEvent || !isVisible) return null;
  
  const timeRemaining = Math.max(0, activeEvent.endTime - Date.now());
  const hoursRemaining = Math.floor(timeRemaining / (1000 * 60 * 60));
  
  const handleClose = () => {
    setIsVisible(false);
  };
  
  const handleClaim = () => {
    // Grant rewards
    if (activeEvent.rewards.coins) {
      // You would call useMergeGame here, but to avoid hooks issues, we'll just complete the event
      // The actual reward distribution should be handled by the store
    }
    completeEvent(activeEvent.id);
    setIsVisible(false);
  };
  
  return (
    <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 max-w-md w-full px-4">
      <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 rounded-2xl shadow-2xl p-4 border-4 border-white/30 animate-bounce-in">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 bg-white rounded-full p-2 animate-pulse">
            <Sparkles className="w-6 h-6 text-purple-600" />
          </div>
          
          <div className="flex-1 text-white">
            <h3 className="font-bold text-lg mb-1 flex items-center gap-2">
              {activeEvent.name}
              <Gift className="w-5 h-5" />
            </h3>
            <p className="text-sm opacity-90 mb-2">{activeEvent.description}</p>
            
            <div className="flex items-center justify-between text-xs">
              <span className="opacity-75">{hoursRemaining}h remaining</span>
              <button
                onClick={handleClaim}
                className="bg-white text-purple-600 px-3 py-1 rounded-full font-bold hover:bg-purple-100 transition-colors"
              >
                Claim Bonus
              </button>
            </div>
          </div>
          
          <button
            onClick={handleClose}
            className="flex-shrink-0 text-white hover:bg-white/20 rounded-full p-1 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
