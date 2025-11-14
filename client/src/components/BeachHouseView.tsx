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

  const backgroundImage = progress > 50 ? cleanHouseImage : dirtyHouseImage;

  return (
    <div className="relative w-full h-full">
      <div 
        className="absolute inset-0 bg-cover bg-center transition-all duration-1000"
        style={{ 
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'cover'
        }}
      >
        <div 
          className="absolute inset-0 transition-opacity duration-1000"
          style={{ 
            backgroundImage: `url(${cleanHouseImage})`,
            backgroundSize: 'cover',
            opacity: progress / 100
          }}
        />
      </div>

      <div className="relative w-full h-full">
        {areas.map((area) => (
          <AreaMarker
            key={area.id}
            area={area}
            onClick={() => handleAreaClick(area)}
          />
        ))}
      </div>

      <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-sm rounded-full px-6 py-3 shadow-lg">
        <div className="flex items-center gap-3">
          <Sparkles className="w-5 h-5 text-yellow-500" />
          <div>
            <div className="text-xs text-gray-600">Beach House Progress</div>
            <div className="flex items-center gap-2">
              <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-blue-500 to-green-500 transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className="text-sm font-bold text-gray-800">{progress}%</span>
            </div>
          </div>
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

function AreaMarker({ area, onClick }: { area: BeachHouseArea; onClick: () => void }) {
  const getIcon = () => {
    switch (area.state) {
      case 'locked':
        return <Lock className="w-4 h-4" />;
      case 'dirty':
        return <Hammer className="w-4 h-4" />;
      case 'clean':
        return <CheckCircle className="w-4 h-4" />;
      default:
        return <Sparkles className="w-4 h-4" />;
    }
  };

  const getColor = () => {
    switch (area.state) {
      case 'locked':
        return 'bg-gray-500';
      case 'dirty':
        return 'bg-orange-500 animate-pulse';
      case 'clean':
        return 'bg-green-500';
      default:
        return 'bg-blue-500';
    }
  };

  const progress = area.state === 'dirty' 
    ? (area.completedTasks / area.cleaningTasks) * 100 
    : area.state === 'clean' ? 100 : 0;

  return (
    <button
      onClick={onClick}
      className="absolute transform -translate-x-1/2 -translate-y-1/2 group"
      style={{ 
        left: `${area.position.x}%`, 
        top: `${area.position.y}%` 
      }}
    >
      <div className={`${getColor()} text-white rounded-full p-3 shadow-lg hover:scale-110 transition-transform relative`}>
        {getIcon()}
        
        {area.state === 'dirty' && progress > 0 && (
          <div className="absolute -top-1 -right-1 w-6 h-6 bg-white rounded-full flex items-center justify-center border-2 border-orange-500">
            <span className="text-xs font-bold text-orange-500">{area.completedTasks}</span>
          </div>
        )}
      </div>
      
      <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
        <div className="bg-black/80 text-white text-xs px-3 py-1 rounded-lg">
          {area.name}
          {area.state === 'dirty' && (
            <div className="text-yellow-300">{area.completedTasks}/{area.cleaningTasks}</div>
          )}
        </div>
      </div>
    </button>
  );
}
