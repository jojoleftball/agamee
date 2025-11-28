import { useEffect, useState } from 'react';
import { useMergeGame } from '@/lib/stores/useMergeGame';
import { useBoardStore } from '@/lib/stores/useBoardStore';
import { useAudio } from '@/lib/stores/useAudio';
import MergeBoard from './MergeBoard';
import RoomProgress from './RoomProgress';
import { MERGE_ITEMS } from '@/lib/mergeItems';
import { Dialogue } from '@/lib/dialogues';

const STARTER_ITEMS = ['seed', 'wood', 'stone', 'hammer'];

function getCategoryEmoji(category: string): string {
  const emojis: Record<string, string> = {
    flower: '🌸',
    vegetable: '🥕',
    tree: '🌳',
    tool: '🔨',
    decoration: '✨',
    water: '💧',
    animal: '🐰',
    generator: '⚙️',
    chest: '🎁',
    currency: '💰',
    special: '⭐',
    blocked: '🚫'
  };
  return emojis[category] || '📦';
}

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
      <div className="bg-white/90 backdrop-blur-sm shadow-md p-2 sm:p-3 flex justify-between items-center z-20">
        <button
          onClick={() => setPhase('menu')}
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-1.5 px-3 sm:py-2 sm:px-4 rounded-lg transition-colors text-xs sm:text-sm"
        >
          ← Menu
        </button>
        
        <div className="flex gap-1.5 sm:gap-2">
          <div className="bg-blue-500 text-white px-2 py-1.5 sm:px-3 sm:py-2 rounded-lg font-bold shadow text-xs sm:text-sm">
            ⚡ {energy}/{maxEnergy}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-hidden flex flex-col">
        <div className="flex-1 min-h-0 p-1 sm:p-2">
          <MergeBoard />
        </div>
        
        <div className="py-2 sm:py-4 text-center flex gap-1.5 sm:gap-2 justify-center flex-wrap px-2 shrink-0">
          <button
            onClick={() => setShowShop(!showShop)}
            className="bg-gradient-to-r from-green-400 to-blue-500 text-white font-bold py-2 px-4 sm:py-3 sm:px-6 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all text-xs sm:text-base"
          >
            {showShop ? '✕ Close Shop' : '🛒 Shop (5 ⚡ per item)'}
          </button>
          
          <button
            onClick={toggleMute}
            className="bg-gradient-to-r from-gray-400 to-gray-500 text-white font-bold py-2 px-3 sm:py-3 sm:px-4 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all text-xs sm:text-base"
          >
            {isMuted ? '🔇' : '🔊'}
          </button>
        </div>
        
        <div className="px-2 shrink-0 pb-2">
          <RoomProgress />
        </div>
      </div>

      {showShop && (
        <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl sm:rounded-t-3xl shadow-2xl p-2 sm:p-4 z-30 border-t-2 sm:border-t-4 border-blue-300 max-h-[40vh] sm:max-h-64 overflow-y-auto">
          <h3 className="text-sm sm:text-lg font-bold text-gray-800 mb-2 sm:mb-3 text-center">Buy Items (5 ⚡ each)</h3>
          <div className="grid grid-cols-4 gap-1.5 sm:gap-2">
            {STARTER_ITEMS.map(itemType => {
              const item = MERGE_ITEMS[itemType];
              return (
                <button
                  key={itemType}
                  onClick={() => handleBuyItem(itemType)}
                  className="bg-gradient-to-br from-white to-blue-50 rounded-lg sm:rounded-xl p-2 sm:p-3 border border-blue-200 sm:border-2 hover:border-blue-400 transition-all shadow-md hover:shadow-lg active:scale-95"
                >
                  <div className="text-xl sm:text-3xl mb-0.5 sm:mb-1">{getCategoryEmoji(item.category)}</div>
                  <div className="text-[10px] sm:text-xs font-bold text-gray-700 truncate">{item.name}</div>
                  <div className="text-[10px] sm:text-xs text-gray-500">Lv.{item.level}</div>
                </button>
              );
            })}
          </div>
          <p className="text-[10px] sm:text-xs text-gray-500 text-center mt-2 sm:mt-3">
            Merge 2 identical items to create a higher level item!
          </p>
        </div>
      )}
    </div>
  );
}
