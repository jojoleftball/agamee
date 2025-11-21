import { useState, useEffect } from 'react';
import { useGardenGame } from '@/lib/stores/useGardenGame';
import { useMergeStore } from '@/lib/stores/useMergeStore';
import { useAudio } from '@/lib/stores/useAudio';
import { MERGE_ITEMS } from '@/lib/mergeItems';
import { Button } from './ui/button';
import { Settings, Volume2, VolumeX, Plus, Sparkles, Map } from 'lucide-react';
import ShopPanel from './ShopPanel';
import ZonesPanel from './ZonesPanel';

export default function GameUI() {
  const {
    coins,
    gems,
    energy,
    maxEnergy,
    xp,
    level,
    currentZone,
    updateEnergy
  } = useGardenGame();
  
  const { items } = useMergeStore();
  const { isMuted, toggleMute } = useAudio();
  
  const [showShop, setShowShop] = useState(false);
  const [showZones, setShowZones] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      updateEnergy();
    }, 5000);
    return () => clearInterval(interval);
  }, [updateEnergy]);

  const xpForNextLevel = level * 100;
  const xpProgress = (xp / xpForNextLevel) * 100;

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-50 pointer-events-none">
        <div className="max-w-screen-xl mx-auto p-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex flex-col gap-2 pointer-events-auto">
              <div className="bg-gradient-to-r from-amber-500 to-yellow-500 rounded-2xl shadow-lg px-4 py-2 flex items-center gap-2 border-2 border-amber-600">
                <span className="text-2xl">💰</span>
                <span className="font-bold text-white text-lg min-w-[60px]">{coins}</span>
              </div>
              
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl shadow-lg px-4 py-2 flex items-center gap-2 border-2 border-purple-600">
                <span className="text-2xl">💎</span>
                <span className="font-bold text-white text-lg min-w-[60px]">{gems}</span>
              </div>
              
              <div className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl shadow-lg px-4 py-3 border-2 border-blue-600">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-2xl">⚡</span>
                  <span className="font-bold text-white text-lg">{energy}/{maxEnergy}</span>
                </div>
                <div className="w-full bg-blue-900/50 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-cyan-400 to-blue-400 h-full transition-all duration-300"
                    style={{ width: `${(energy / maxEnergy) * 100}%` }}
                  />
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl shadow-lg px-4 py-3 border-2 border-green-600">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-2xl">⭐</span>
                  <span className="font-bold text-white text-lg">Level {level}</span>
                </div>
                <div className="w-full bg-green-900/50 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-yellow-400 to-green-400 h-full transition-all duration-300"
                    style={{ width: `${xpProgress}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2 pointer-events-auto">
              <Button
                variant="default"
                size="lg"
                onClick={toggleMute}
                className="bg-white/90 hover:bg-white text-gray-800 shadow-lg rounded-xl w-14 h-14"
              >
                {isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
              </Button>
              
              <Button
                variant="default"
                size="lg"
                onClick={() => {}}
                className="bg-white/90 hover:bg-white text-gray-800 shadow-lg rounded-xl w-14 h-14"
              >
                <Settings className="w-6 h-6" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-50 pointer-events-none">
        <div className="max-w-screen-xl mx-auto p-4">
          <div className="flex items-center justify-center gap-3 pointer-events-auto">
            <Button
              variant="default"
              size="lg"
              onClick={() => setShowShop(true)}
              className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold shadow-lg rounded-2xl px-6 py-6 text-lg border-2 border-green-600"
            >
              <Plus className="w-6 h-6 mr-2" />
              Shop
            </Button>
            
            <Button
              variant="default"
              size="lg"
              onClick={() => setShowZones(true)}
              className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-bold shadow-lg rounded-2xl px-6 py-6 text-lg border-2 border-blue-600"
            >
              <Map className="w-6 h-6 mr-2" />
              Zones
            </Button>
            
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl shadow-lg px-6 py-3 border-2 border-purple-600">
              <div className="text-white text-center">
                <div className="text-xs font-medium opacity-90">Items</div>
                <div className="text-2xl font-bold">{items.length}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showShop && <ShopPanel onClose={() => setShowShop(false)} />}
      {showZones && <ZonesPanel onClose={() => setShowZones(false)} />}
    </>
  );
}
