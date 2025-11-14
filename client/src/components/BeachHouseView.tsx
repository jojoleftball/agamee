import { useEffect, useState } from 'react';
import { useBeachHouseStore, BeachHouseArea } from '@/lib/stores/useBeachHouseStore';
import { useMergeGame } from '@/lib/stores/useMergeGame';
import { Lock, Sparkles, CheckCircle, Hammer } from 'lucide-react';
import { Button } from '@/components/ui/button';

const dirtyHouseImage = '/beachhouse-dirty.png';
const cleanHouseImage = '/beachhouse-clean.png';

interface BeachHouseViewProps {
  onAreaClick?: (area: BeachHouseArea) => void;
}

export default function BeachHouseView({ onAreaClick }: BeachHouseViewProps) {
  const { areas, initializeAreas, unlockArea, getProgress } = useBeachHouseStore();
  const { coins, spendCoins, addCoins } = useMergeGame();
  const [selectedArea, setSelectedArea] = useState<BeachHouseArea | null>(null);
  const [showUnlockModal, setShowUnlockModal] = useState(false);
  const progress = getProgress();

  useEffect(() => {
    initializeAreas();
  }, [initializeAreas]);

  const handleAreaClick = (area: BeachHouseArea) => {
    setSelectedArea(area);
    
    if (area.state === 'locked') {
      setShowUnlockModal(true);
    } else if (area.state === 'dirty') {
      onAreaClick?.(area);
    }
  };

  const handleUnlock = () => {
    if (!selectedArea) return;
    
    if (spendCoins(selectedArea.unlockCost)) {
      unlockArea(selectedArea.id);
      setShowUnlockModal(false);
      setSelectedArea(null);
    } else {
      alert('Not enough coins!');
    }
  };

  return (
    <div className="relative w-full h-full overflow-y-auto bg-gradient-to-b from-sand-100 via-sand-50 to-sky-100 p-4">
      <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-3 gap-4 py-4">
        {areas.map((area) => (
          <RoomCard
            key={area.id}
            area={area}
            onClick={() => handleAreaClick(area)}
          />
        ))}
      </div>

      <div className="absolute top-4 left-4 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-xl px-4 py-2 shadow-lg border-2 border-amber-400">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4" />
          <div className="text-sm font-bold">Progress: {progress}%</div>
        </div>
      </div>

      {showUnlockModal && selectedArea && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-sm mx-4 shadow-2xl">
            <div className="text-center mb-4">
              <div className="inline-block p-4 bg-blue-100 rounded-full mb-3">
                <Lock className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                Unlock {selectedArea.name}?
              </h3>
              <p className="text-gray-600 text-sm">
                This area requires cleaning and repairs. Unlock it to start working!
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">Cost to unlock:</span>
                <span className="font-bold text-lg text-yellow-600">💰 {selectedArea.unlockCost}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Tasks to complete:</span>
                <span className="font-bold text-gray-800">{selectedArea.cleaningTasks}</span>
              </div>
              <div className="flex justify-between items-center mt-2">
                <span className="text-sm text-gray-600">Rewards:</span>
                <span className="font-bold text-green-600">+{selectedArea.rewards.coins} coins</span>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  setShowUnlockModal(false);
                  setSelectedArea(null);
                }}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleUnlock}
                className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                disabled={coins < selectedArea.unlockCost}
              >
                Unlock
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function RoomCard({ area, onClick }: { area: BeachHouseArea; onClick: () => void }) {
  const getIcon = () => {
    switch (area.state) {
      case 'locked':
        return <Lock className="w-8 h-8" />;
      case 'dirty':
        return <Hammer className="w-8 h-8" />;
      case 'clean':
        return <CheckCircle className="w-8 h-8" />;
      default:
        return <Sparkles className="w-8 h-8" />;
    }
  };

  const getBgColor = () => {
    switch (area.state) {
      case 'locked':
        return 'from-gray-400 to-gray-600';
      case 'dirty':
        return 'from-orange-500 to-red-600';
      case 'clean':
        return 'from-green-500 to-emerald-600';
      default:
        return 'from-blue-500 to-purple-600';
    }
  };

  const progress = area.state === 'dirty' 
    ? (area.completedTasks / area.cleaningTasks) * 100 
    : area.state === 'clean' ? 100 : 0;

  return (
    <button
      onClick={onClick}
      className={`relative bg-gradient-to-br ${getBgColor()} rounded-2xl p-4 shadow-xl hover:scale-105 transition-all border-4 ${
        area.state === 'clean' ? 'border-yellow-400' : 'border-white/30'
      } min-h-[160px] flex flex-col`}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="bg-white/20 backdrop-blur-sm rounded-full p-2 text-white">
          {getIcon()}
        </div>
        
        {area.state === 'locked' && (
          <div className="bg-amber-500 text-white text-xs font-bold px-2 py-1 rounded-full">
            {area.unlockCost} coins
          </div>
        )}
        
        {area.state === 'clean' && (
          <Sparkles className="w-5 h-5 text-yellow-300 animate-pulse" />
        )}
      </div>

      <h3 className="text-white font-bold text-lg mb-2">{area.name}</h3>
      
      {area.state === 'dirty' && (
        <div className="mt-auto">
          <div className="flex justify-between text-xs text-white/80 mb-1">
            <span>Tasks</span>
            <span>{area.completedTasks}/{area.cleaningTasks}</span>
          </div>
          <div className="w-full h-2 bg-white/30 rounded-full overflow-hidden">
            <div 
              className="h-full bg-white transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}
      
      {area.state === 'locked' && (
        <div className="mt-auto text-white/80 text-xs">
          Tap to unlock
        </div>
      )}
      
      {area.state === 'clean' && (
        <div className="mt-auto text-yellow-200 text-xs font-bold">
          ✓ Complete!
        </div>
      )}
    </button>
  );
}
