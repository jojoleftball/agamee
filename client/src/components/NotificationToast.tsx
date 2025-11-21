import { useEffect, useState } from 'react';
import { X, Sparkles, Coins, Zap, Gift, Star } from 'lucide-react';

export interface Notification {
  id: string;
  type: 'reward' | 'unlock' | 'merge' | 'hint' | 'level_up';
  title: string;
  message: string;
  coins?: number;
  gems?: number;
  energy?: number;
  xp?: number;
}

interface NotificationToastProps {
  notification: Notification;
  onClose: () => void;
}

export default function NotificationToast({ notification, onClose }: NotificationToastProps) {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    setTimeout(() => setIsVisible(true), 10);
    
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300);
    }, 4000);
    
    return () => clearTimeout(timer);
  }, [onClose]);

  const getIcon = () => {
    switch (notification.type) {
      case 'reward':
        return <Gift className="w-6 h-6 text-yellow-500" />;
      case 'unlock':
        return <Sparkles className="w-6 h-6 text-purple-500" />;
      case 'merge':
        return <Star className="w-6 h-6 text-pink-500" />;
      case 'level_up':
        return <Zap className="w-6 h-6 text-orange-500" />;
      default:
        return <Sparkles className="w-6 h-6 text-blue-500" />;
    }
  };

  const getBgColor = () => {
    switch (notification.type) {
      case 'reward':
        return 'from-yellow-500 to-orange-500';
      case 'unlock':
        return 'from-purple-500 to-pink-500';
      case 'merge':
        return 'from-pink-500 to-rose-500';
      case 'level_up':
        return 'from-orange-500 to-red-500';
      default:
        return 'from-blue-500 to-cyan-500';
    }
  };

  return (
    <div
      className={`
        fixed top-20 right-4 z-50 max-w-sm w-full
        transform transition-all duration-300 ease-out
        ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
      `}
    >
      <div className={`
        bg-gradient-to-r ${getBgColor()}
        rounded-2xl shadow-2xl p-4 border-4 border-white/30
      `}>
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 bg-white rounded-full p-2">
            {getIcon()}
          </div>
          
          <div className="flex-1 text-white">
            <h3 className="font-bold text-lg mb-1">{notification.title}</h3>
            <p className="text-sm opacity-90">{notification.message}</p>
            
            {/* Rewards Display */}
            {(notification.coins || notification.gems || notification.energy || notification.xp) && (
              <div className="flex gap-3 mt-2 text-xs font-bold">
                {notification.coins && (
                  <div className="flex items-center gap-1">
                    <Coins className="w-4 h-4" />
                    +{notification.coins}
                  </div>
                )}
                {notification.gems && (
                  <div className="flex items-center gap-1">
                    <Sparkles className="w-4 h-4" />
                    +{notification.gems}
                  </div>
                )}
                {notification.energy && (
                  <div className="flex items-center gap-1">
                    <Zap className="w-4 h-4" />
                    +{notification.energy}
                  </div>
                )}
                {notification.xp && (
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4" />
                    +{notification.xp} XP
                  </div>
                )}
              </div>
            )}
          </div>
          
          <button
            onClick={() => {
              setIsVisible(false);
              setTimeout(onClose, 300);
            }}
            className="flex-shrink-0 text-white hover:bg-white/20 rounded-full p-1 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
