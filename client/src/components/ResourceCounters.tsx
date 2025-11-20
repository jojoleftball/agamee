import { useMergeGame } from '@/lib/stores/useMergeGame';
import { Coins, Gem, Zap } from 'lucide-react';

export default function ResourceCounters() {
  const { coins, gems, energy, maxEnergy } = useMergeGame();

  const Counter = ({ 
    icon: Icon, 
    value, 
    gradientFrom, 
    gradientTo,
    max 
  }: { 
    icon: any; 
    value: number; 
    gradientFrom: string; 
    gradientTo: string;
    max?: number;
  }) => (
    <div className={`
      flex items-center gap-2 px-4 py-2.5 rounded-full 
      bg-gradient-to-r ${gradientFrom} ${gradientTo}
      shadow-lg border-2 border-white/50
      min-w-[110px]
    `}>
      <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md">
        <Icon className="w-5 h-5" style={{ color: 'currentColor' }} />
      </div>
      <div className="flex-1 text-white font-bold text-lg drop-shadow-md">
        {value.toLocaleString()}
        {max !== undefined && <span className="text-sm opacity-90">/{max}</span>}
      </div>
    </div>
  );

  return (
    <div className="fixed top-4 right-4 flex flex-col gap-3 z-50">
      <Counter 
        icon={Coins}
        value={coins}
        gradientFrom="from-yellow-400"
        gradientTo="to-amber-600"
      />
      
      <Counter 
        icon={Gem}
        value={gems}
        gradientFrom="from-purple-400"
        gradientTo="to-pink-600"
      />
      
      <Counter 
        icon={Zap}
        value={energy}
        max={maxEnergy}
        gradientFrom="from-cyan-400"
        gradientTo="to-blue-600"
      />
    </div>
  );
}
