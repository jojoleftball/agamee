import { motion, HTMLMotionProps } from 'framer-motion';
import { ReactNode, forwardRef } from 'react';
import { X, Coins, Zap, Gem } from 'lucide-react';

interface GardenButtonProps extends Omit<HTMLMotionProps<"button">, 'children'> {
  variant?: 'primary' | 'secondary' | 'gold' | 'danger' | 'glass';
  size?: 'sm' | 'md' | 'lg';
  children: ReactNode;
  icon?: ReactNode;
  disabled?: boolean;
}

export const GardenButton = forwardRef<HTMLButtonElement, GardenButtonProps>(
  ({ variant = 'primary', size = 'md', children, icon, disabled, className = '', ...props }, ref) => {
    const variants = {
      primary: 'bg-gradient-to-b from-emerald-400 via-emerald-500 to-emerald-600 border-emerald-300 text-white shadow-[0_4px_0_0_#15803d,0_6px_20px_rgba(34,197,94,0.4)]',
      secondary: 'bg-gradient-to-b from-slate-100 via-slate-200 to-slate-300 border-slate-200 text-slate-700 shadow-[0_4px_0_0_#94a3b8,0_6px_20px_rgba(0,0,0,0.1)]',
      gold: 'bg-gradient-to-b from-amber-300 via-amber-400 to-amber-500 border-amber-200 text-amber-900 shadow-[0_4px_0_0_#b45309,0_6px_20px_rgba(251,191,36,0.4)]',
      danger: 'bg-gradient-to-b from-red-400 via-red-500 to-red-600 border-red-300 text-white shadow-[0_4px_0_0_#b91c1c,0_6px_20px_rgba(239,68,68,0.4)]',
      glass: 'bg-white/20 backdrop-blur-md border-white/40 text-white shadow-[0_4px_20px_rgba(0,0,0,0.1)]',
    };

    const sizes = {
      sm: 'px-4 py-2 text-sm rounded-xl',
      md: 'px-6 py-3 text-base rounded-2xl',
      lg: 'px-8 py-4 text-lg rounded-2xl',
    };

    return (
      <motion.button
        ref={ref}
        whileHover={disabled ? {} : { scale: 1.02, y: -2 }}
        whileTap={disabled ? {} : { scale: 0.98, y: 2 }}
        className={`
          font-bold border-2 transition-all duration-200 flex items-center justify-center gap-2
          ${variants[variant]} ${sizes[size]}
          ${disabled ? 'opacity-50 cursor-not-allowed saturate-50' : 'cursor-pointer'}
          ${className}
        `}
        disabled={disabled}
        {...props}
      >
        {icon}
        {children}
      </motion.button>
    );
  }
);
GardenButton.displayName = 'GardenButton';

interface GardenCardProps {
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'highlighted' | 'dark';
  noPadding?: boolean;
}

export function GardenCard({ children, className = '', variant = 'default', noPadding = false }: GardenCardProps) {
  const variants = {
    default: 'bg-gradient-to-b from-white via-emerald-50/50 to-emerald-100/50 border-emerald-300',
    highlighted: 'bg-gradient-to-b from-amber-50 via-amber-100/50 to-amber-200/50 border-amber-400',
    dark: 'bg-gradient-to-b from-slate-800 via-slate-850 to-slate-900 border-slate-600 text-white',
  };

  return (
    <div
      className={`
        rounded-3xl border-2 shadow-[0_8px_32px_rgba(0,0,0,0.12)]
        ${variants[variant]}
        ${noPadding ? '' : 'p-4 sm:p-6'}
        ${className}
      `}
    >
      {children}
    </div>
  );
}

interface GardenModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'full';
}

export function GardenModal({ isOpen, onClose, title, children, size = 'md' }: GardenModalProps) {
  if (!isOpen) return null;

  const sizes = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    full: 'max-w-2xl',
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className={`relative w-full ${sizes[size]} max-h-[90vh] overflow-hidden`}
      >
        <GardenCard className="relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-pink-400 via-yellow-300 via-50% to-pink-400" />
          
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl sm:text-2xl font-bold text-emerald-800 flex items-center gap-2">
              <span className="text-2xl">🌸</span>
              {title}
            </h2>
            <motion.button
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-gradient-to-b from-red-400 to-red-500 flex items-center justify-center text-white shadow-lg border-2 border-red-300"
            >
              <X size={20} />
            </motion.button>
          </div>
          
          <div className="overflow-y-auto max-h-[calc(90vh-120px)]">
            {children}
          </div>
        </GardenCard>
      </motion.div>
    </motion.div>
  );
}

interface ResourceDisplayProps {
  coins: number;
  gems: number;
  energy: number;
  maxEnergy: number;
  compact?: boolean;
}

export function ResourceDisplay({ coins, gems, energy, maxEnergy, compact = false }: ResourceDisplayProps) {
  const energyPercent = (energy / maxEnergy) * 100;

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1 bg-amber-100 px-2 py-1 rounded-full border border-amber-300">
          <Coins size={14} className="text-amber-500" />
          <span className="text-xs font-bold text-amber-700">{coins.toLocaleString()}</span>
        </div>
        <div className="flex items-center gap-1 bg-purple-100 px-2 py-1 rounded-full border border-purple-300">
          <Gem size={14} className="text-purple-500" />
          <span className="text-xs font-bold text-purple-700">{gems}</span>
        </div>
        <div className="flex items-center gap-1 bg-cyan-100 px-2 py-1 rounded-full border border-cyan-300">
          <Zap size={14} className="text-cyan-500" />
          <span className="text-xs font-bold text-cyan-700">{energy}/{maxEnergy}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-2">
      <motion.div 
        whileHover={{ scale: 1.05 }}
        className="flex items-center gap-2 bg-gradient-to-r from-amber-100 to-amber-50 px-4 py-2 rounded-2xl border-2 border-amber-300 shadow-md"
      >
        <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center shadow-inner">
          <Coins size={18} className="text-white" />
        </div>
        <div>
          <div className="text-xs text-amber-600 font-medium">Coins</div>
          <div className="text-lg font-bold text-amber-800">{coins.toLocaleString()}</div>
        </div>
      </motion.div>

      <motion.div 
        whileHover={{ scale: 1.05 }}
        className="flex items-center gap-2 bg-gradient-to-r from-purple-100 to-purple-50 px-4 py-2 rounded-2xl border-2 border-purple-300 shadow-md"
      >
        <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center shadow-inner">
          <Gem size={18} className="text-white" />
        </div>
        <div>
          <div className="text-xs text-purple-600 font-medium">Gems</div>
          <div className="text-lg font-bold text-purple-800">{gems}</div>
        </div>
      </motion.div>

      <motion.div 
        whileHover={{ scale: 1.05 }}
        className="flex items-center gap-2 bg-gradient-to-r from-cyan-100 to-cyan-50 px-4 py-2 rounded-2xl border-2 border-cyan-300 shadow-md min-w-[140px]"
      >
        <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-cyan-600 rounded-full flex items-center justify-center shadow-inner">
          <Zap size={18} className="text-white" />
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <span className="text-xs text-cyan-600 font-medium">Energy</span>
            <span className="text-xs font-bold text-cyan-800">{energy}/{maxEnergy}</span>
          </div>
          <div className="h-2 bg-cyan-200 rounded-full overflow-hidden mt-1">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${energyPercent}%` }}
              className="h-full bg-gradient-to-r from-cyan-400 to-cyan-500 rounded-full"
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
}

interface TabButtonProps {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
  icon?: ReactNode;
}

export function TabButton({ active, onClick, children, icon }: TabButtonProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`
        px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2
        ${active 
          ? 'bg-gradient-to-b from-emerald-400 to-emerald-600 text-white shadow-lg border-2 border-emerald-300' 
          : 'bg-white/80 text-emerald-700 hover:bg-emerald-100 border-2 border-emerald-200'
        }
      `}
    >
      {icon}
      {children}
    </motion.button>
  );
}

interface ProgressBarProps {
  value: number;
  max: number;
  color?: 'green' | 'blue' | 'gold' | 'pink';
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function ProgressBar({ value, max, color = 'green', showLabel = true, size = 'md' }: ProgressBarProps) {
  const percent = Math.min(100, (value / max) * 100);
  
  const colors = {
    green: 'from-emerald-400 to-emerald-600',
    blue: 'from-cyan-400 to-cyan-600',
    gold: 'from-amber-400 to-amber-600',
    pink: 'from-pink-400 to-pink-600',
  };

  const bgColors = {
    green: 'bg-emerald-200',
    blue: 'bg-cyan-200',
    gold: 'bg-amber-200',
    pink: 'bg-pink-200',
  };

  const sizes = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4',
  };

  return (
    <div className="w-full">
      <div className={`${bgColors[color]} rounded-full overflow-hidden ${sizes[size]} shadow-inner`}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className={`h-full bg-gradient-to-r ${colors[color]} rounded-full`}
        />
      </div>
      {showLabel && (
        <div className="text-xs font-medium text-gray-600 mt-1 text-right">
          {value} / {max}
        </div>
      )}
    </div>
  );
}

interface BadgeProps {
  children: ReactNode;
  variant?: 'success' | 'warning' | 'error' | 'info';
}

export function Badge({ children, variant = 'info' }: BadgeProps) {
  const variants = {
    success: 'bg-emerald-100 text-emerald-700 border-emerald-300',
    warning: 'bg-amber-100 text-amber-700 border-amber-300',
    error: 'bg-red-100 text-red-700 border-red-300',
    info: 'bg-cyan-100 text-cyan-700 border-cyan-300',
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${variants[variant]}`}>
      {children}
    </span>
  );
}
