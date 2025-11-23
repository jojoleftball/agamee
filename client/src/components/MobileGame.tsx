import { useState, useEffect } from 'react';
import { useMergeGameStore } from '@/lib/stores/useMergeGameStore';
import { GARDEN_BIOMES } from '@/lib/mergeData';
import MergeBoard from './MergeBoard';
import GameHUD from './GameHUD';
import TasksPanel from './TasksPanel';
import ShopModal from './ShopModal';
import BiomeSelector from './BiomeSelector';

const BACKGROUND_MAP: Record<string, string> = {
  basic: '/game-assets/basic_garden_background_vertical.png',
  tropical: '/game-assets/tropical_garden_background_vertical.png',
  zen: '/game-assets/zen_garden_background_vertical.png',
  desert: '/game-assets/desert_garden_background_vertical.png',
  winter: '/game-assets/winter_garden_background_vertical.png'
};

export default function MobileGame() {
  const currentBiome = useMergeGameStore((state) => state.currentBiome);
  const [showTasks, setShowTasks] = useState(false);
  const [showShop, setShowShop] = useState(false);
  const [showBiomes, setShowBiomes] = useState(false);

  const backgroundImage = BACKGROUND_MAP[currentBiome] || BACKGROUND_MAP.basic;

  return (
    <div 
      className="fixed inset-0 w-full h-full overflow-hidden"
      style={{
        height: 'calc(var(--vh, 1vh) * 100)',
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <div className="absolute inset-0 bg-black/10" />
      
      <div className="relative h-full flex flex-col">
        <GameHUD 
          onOpenTasks={() => setShowTasks(true)}
          onOpenShop={() => setShowShop(true)}
          onOpenBiomes={() => setShowBiomes(true)}
        />
        
        <div className="flex-1 overflow-hidden">
          <MergeBoard />
        </div>
      </div>

      {showTasks && <TasksPanel onClose={() => setShowTasks(false)} />}
      {showShop && <ShopModal onClose={() => setShowShop(false)} />}
      {showBiomes && <BiomeSelector onClose={() => setShowBiomes(false)} />}
    </div>
  );
}
