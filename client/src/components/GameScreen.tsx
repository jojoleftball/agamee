import { useEffect, useState } from 'react';
import { useMergeGame } from '@/lib/stores/useMergeGame';
import { useBoardStore } from '@/lib/stores/useBoardStore';
import { useAudio } from '@/lib/stores/useAudio';
import MergeBoard from './MergeBoard';
import RoomProgress from './RoomProgress';
import { MERGE_ITEMS } from '@/lib/mergeItems';
import { Dialogue } from '@/lib/dialogues';

const STARTER_ITEMS = ['seed', 'wood', 'stone', 'hammer'];

interface GameScreenProps {
  onShowDialogue: (dialogues: Dialogue[]) => void;
}

export default function GameScreen({ onShowDialogue }: GameScreenProps) {
  const { energy, maxEnergy, coins, setPhase, spendEnergy } = useMergeGame();
  const { items, addItem, initializeBoard, gridSize } = useBoardStore();
  const { isMuted, toggleMute } = useAudio();
  const [showShop, setShowShop] = useState(false);

  useEffect(() => {
    if (items.length === 0) {
      initializeBoard();
    }
  }, []);

  const handleBuyItem = (itemType: string) => {
    const item = MERGE_ITEMS[itemType];
    if (!item) return;
    
    if (!spendEnergy(5)) {
      alert('Not enough energy!');
      return;
    }
    
    for (let y = 0; y < gridSize.rows; y++) {
      for (let x = 0; x < gridSize.cols; x++) {
        if (!items.some(i => i.x === x && i.y === y)) {
          addItem(itemType, x, y);
          setShowShop(false);
          return;
        }
      }
    }
    
    alert('Board is full! Merge some items first.');
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-b from-sky-200 to-blue-100 flex flex-col overflow-hidden">
      <div className="bg-white/90 backdrop-blur-sm shadow-md p-3 flex justify-between items-center z-20">
        <button
          onClick={() => setPhase('menu')}
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-lg transition-colors text-sm"
        >
          ← Menu
        </button>
        
        <div className="flex gap-2">
          <div className="bg-blue-500 text-white px-3 py-2 rounded-lg font-bold shadow text-sm">
            ⚡ {energy}/{maxEnergy}
          </div>
          <div className="bg-yellow-500 text-white px-3 py-2 rounded-lg font-bold shadow text-sm">
            💰 {coins}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pb-20">
        <div className="p-2">
          <MergeBoard />
          
          <div className="mt-4 text-center flex gap-2 justify-center flex-wrap px-2">
            <button
              onClick={() => setShowShop(!showShop)}
              className="bg-gradient-to-r from-green-400 to-blue-500 text-white font-bold py-3 px-6 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
            >
              {showShop ? '✕ Close Shop' : '🛒 Shop (5 ⚡ per item)'}
            </button>
            
            <button
              onClick={toggleMute}
              className="bg-gradient-to-r from-gray-400 to-gray-500 text-white font-bold py-3 px-4 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
            >
              {isMuted ? '🔇' : '🔊'}
            </button>
          </div>
          
          <div className="px-2">
            <RoomProgress />
          </div>
        </div>
      </div>

      {showShop && (
        <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl p-4 z-30 border-t-4 border-blue-300 max-h-64 overflow-y-auto">
          <h3 className="text-lg font-bold text-gray-800 mb-3 text-center">Buy Items (5 ⚡ each)</h3>
          <div className="grid grid-cols-4 gap-2">
            {STARTER_ITEMS.map(itemType => {
              const item = MERGE_ITEMS[itemType];
              return (
                <button
                  key={itemType}
                  onClick={() => handleBuyItem(itemType)}
                  className="bg-gradient-to-br from-white to-blue-50 rounded-xl p-3 border-2 border-blue-200 hover:border-blue-400 transition-all shadow-md hover:shadow-lg active:scale-95"
                >
                  <div className="text-3xl mb-1">{item.emoji}</div>
                  <div className="text-xs font-bold text-gray-700">{item.name}</div>
                  <div className="text-xs text-gray-500">Lv.{item.level}</div>
                </button>
              );
            })}
          </div>
          <p className="text-xs text-gray-500 text-center mt-3">
            Merge 2 identical items to create a higher level item!
          </p>
        </div>
      )}
    </div>
  );
}
