import { useState } from 'react';
import { useMergeGameStore } from '@/lib/stores/useMergeGameStore';
import MergeBoard from './MergeBoard';
import GameHUD from './GameHUD';
import TasksPanel from './TasksPanel';
import ShopModal from './ShopModal';
import GardenWorldMap from './GardenWorldMap';
import PlantingGround from './PlantingGround';
import { Map, Grid3x3, Sprout } from 'lucide-react';

const BACKGROUND_MAP: Record<string, string> = {
  basic: '/game-assets/basic_garden_background_vertical.png',
  tropical: '/game-assets/tropical_garden_background_vertical.png',
  zen: '/game-assets/zen_garden_background_vertical.png',
  desert: '/game-assets/desert_garden_background_vertical.png',
  winter: '/game-assets/winter_garden_background_vertical.png'
};

type GameView = 'merge' | 'planting' | 'map';

export default function MobileGame() {
  const { currentBiome, switchBiome } = useMergeGameStore();
  const [showTasks, setShowTasks] = useState(false);
  const [showShop, setShowShop] = useState(false);
  const [currentView, setCurrentView] = useState<GameView>('merge');

  const backgroundImage = BACKGROUND_MAP[currentBiome] || BACKGROUND_MAP.basic;

  const handleGardenSelect = (gardenId: string) => {
    switchBiome(gardenId);
    setCurrentView('merge');
  };

  const handleOpenMap = () => {
    setCurrentView('map');
  };

  return (
    <div 
      className="fixed inset-0 w-full h-full overflow-hidden touch-none"
      style={{
        height: 'calc(var(--vh, 1vh) * 100)',
        width: '100vw',
        maxWidth: '100vw',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
      }}
    >
      {currentView === 'map' ? (
        <GardenWorldMap 
          onGardenSelect={handleGardenSelect}
          onClose={() => setCurrentView('merge')}
        />
      ) : (
        <>
          <div 
            className="absolute inset-0 w-full h-full"
            style={{
              backgroundImage: `url(${backgroundImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat'
            }}
          >
            <div className="absolute inset-0 bg-black/10" />
          </div>
          
          <div className="relative h-full flex flex-col">
            <GameHUD 
              onOpenTasks={() => setShowTasks(true)}
              onOpenShop={() => setShowShop(true)}
              onOpenBiomes={handleOpenMap}
            />
            
            <div className="flex-1 overflow-hidden relative">
              {currentView === 'merge' ? (
                <MergeBoard />
              ) : (
                <PlantingGround />
              )}
            </div>

            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 pointer-events-auto z-40">
              <button
                onClick={() => setCurrentView('merge')}
                className={`px-6 py-3 rounded-2xl font-bold text-white shadow-lg transition-all active:scale-95 flex items-center gap-2 ${
                  currentView === 'merge'
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 scale-105'
                    : 'bg-gray-700/90 hover:bg-gray-600/90'
                }`}
              >
                <Grid3x3 className="w-5 h-5" />
                Merge
              </button>
              <button
                onClick={() => setCurrentView('planting')}
                className={`px-6 py-3 rounded-2xl font-bold text-white shadow-lg transition-all active:scale-95 flex items-center gap-2 ${
                  currentView === 'planting'
                    ? 'bg-gradient-to-r from-green-600 to-emerald-600 scale-105'
                    : 'bg-gray-700/90 hover:bg-gray-600/90'
                }`}
              >
                <Sprout className="w-5 h-5" />
                Plant
              </button>
              <button
                onClick={handleOpenMap}
                className="px-6 py-3 rounded-2xl font-bold text-white shadow-lg transition-all active:scale-95 flex items-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
              >
                <Map className="w-5 h-5" />
                Map
              </button>
            </div>
          </div>

          {showTasks && <TasksPanel onClose={() => setShowTasks(false)} />}
          {showShop && <ShopModal onClose={() => setShowShop(false)} />}
        </>
      )}
    </div>
  );
}
