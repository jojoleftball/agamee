import { useGardenGame } from '@/lib/stores/useGardenGame';
import { Button } from './ui/button';
import { X, Lock, CheckCircle, Map } from 'lucide-react';

interface ZonesPanelProps {
  onClose: () => void;
}

export default function ZonesPanel({ onClose }: ZonesPanelProps) {
  const { zones, currentZone, unlockZone, setCurrentZone, coins } = useGardenGame();

  const handleUnlock = (zoneId: string, cost: number) => {
    if (coins < cost) {
      alert(`Need ${cost} coins to unlock this zone!`);
      return;
    }
    
    if (unlockZone(zoneId)) {
      setCurrentZone(zoneId);
    }
  };

  const handleSelectZone = (zoneId: string) => {
    setCurrentZone(zoneId);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden border-4 border-blue-600">
        <div className="bg-gradient-to-r from-blue-600 to-cyan-500 px-6 py-4 flex items-center justify-between border-b-4 border-blue-700">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg">
              <Map className="w-7 h-7 text-blue-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white drop-shadow-lg">Garden Zones</h2>
              <p className="text-blue-100 text-sm">Unlock and explore new areas</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
          >
            <X className="w-6 h-6 text-white" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-100px)]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {zones.map((zone) => (
              <div
                key={zone.id}
                className={`bg-white rounded-2xl p-6 shadow-lg border-2 transition-all ${
                  currentZone === zone.id
                    ? 'border-blue-500 ring-4 ring-blue-200'
                    : zone.unlocked
                    ? 'border-green-300 hover:border-green-400'
                    : 'border-gray-300 opacity-75'
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-bold text-xl text-gray-800 mb-1">{zone.name}</h3>
                    <p className="text-sm text-gray-600">
                      {zone.unlocked ? 'Unlocked' : `Cost: ${zone.cost} coins`}
                    </p>
                  </div>
                  
                  {zone.unlocked ? (
                    <CheckCircle className="w-8 h-8 text-green-500" />
                  ) : (
                    <Lock className="w-8 h-8 text-gray-400" />
                  )}
                </div>

                {zone.unlocked && (
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Progress</span>
                      <span className="font-bold text-gray-800">{zone.progress}/{zone.required}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-green-500 to-emerald-500 h-full transition-all duration-300"
                        style={{ width: `${(zone.progress / zone.required) * 100}%` }}
                      />
                    </div>
                  </div>
                )}

                {zone.unlocked ? (
                  <Button
                    onClick={() => handleSelectZone(zone.id)}
                    className={`w-full rounded-xl py-3 font-bold ${
                      currentZone === zone.id
                        ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                    }`}
                  >
                    {currentZone === zone.id ? 'Current Zone' : 'Go to Zone'}
                  </Button>
                ) : (
                  <Button
                    onClick={() => handleUnlock(zone.id, zone.cost)}
                    disabled={coins < zone.cost}
                    className="w-full bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white font-bold rounded-xl py-3 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Lock className="w-5 h-5 mr-2" />
                    Unlock for {zone.cost} Coins
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
