import { useReplitAuth } from '../hooks/useReplitAuth';
import { SproutIcon, CherryBlossomIcon, GardenerIcon, GardenGateEnterIcon } from './icons/GardenIcons';

interface LoginButtonProps {
  variant?: 'compact' | 'full';
  className?: string;
}

export default function LoginButton({ variant = 'compact', className = '' }: LoginButtonProps) {
  const { user, isLoading, login, isAuthenticated } = useReplitAuth();

  if (isLoading) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <div className="w-8 h-8 bg-green-200 rounded-full animate-pulse" />
        {variant === 'full' && (
          <div className="h-4 w-20 bg-green-200 rounded animate-pulse" />
        )}
      </div>
    );
  }

  if (isAuthenticated && user) {
    return (
      <div 
        className={`flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full px-3 py-1.5 border-2 border-green-300 shadow-lg ${className}`}
      >
        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-green-100 to-emerald-200 flex items-center justify-center border border-green-400 overflow-hidden">
          {user.profileImage ? (
            <img 
              src={user.profileImage} 
              alt={user.name} 
              className="w-full h-full object-cover"
            />
          ) : (
            <GardenerIcon size={20} />
          )}
        </div>
        {variant === 'full' && (
          <span className="text-white font-medium text-sm truncate max-w-[100px]">
            {user.name}
          </span>
        )}
        <CherryBlossomIcon size={14} />
      </div>
    );
  }

  return (
    <button
      onClick={login}
      className={`flex items-center gap-2 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full px-3 py-1.5 border-2 border-amber-300 shadow-lg hover:from-amber-500 hover:to-orange-600 active:scale-95 transition-all ${className}`}
    >
      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-amber-100 to-yellow-200 flex items-center justify-center border border-amber-400">
        <GardenGateEnterIcon size={18} />
      </div>
      {variant === 'full' && (
        <span className="text-white font-bold text-sm">Login</span>
      )}
      <SproutIcon size={14} />
    </button>
  );
}
