import { useMergeGame } from '@/lib/stores/useMergeGame';
import { getDialoguesForChapter } from '@/lib/dialogues';
import { Dialogue } from '@/lib/dialogues';

interface MenuScreenProps {
  onShowDialogue: (dialogues: Dialogue[]) => void;
}

export default function MenuScreen({ onShowDialogue }: MenuScreenProps) {
  const { setPhase, energy, maxEnergy, coins, currentChapter } = useMergeGame();

  const handleStoryMode = () => {
    const dialogues = getDialoguesForChapter(currentChapter);
    if (dialogues.length > 0) {
      onShowDialogue(dialogues[0].dialogues);
    } else {
      setPhase('playing');
    }
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-b from-sky-400 to-sky-200 flex flex-col items-center justify-center overflow-hidden">
      <div className="relative w-full max-w-md px-4 flex flex-col items-center">
        <div className="mb-8">
          <img
            src="/sprites/IMG_20251111_022306_1762821019727.png"
            alt="Merge Story"
            className="w-full h-auto object-contain"
            style={{ 
              maxHeight: '50vh',
              filter: 'drop-shadow(0 10px 30px rgba(0, 0, 0, 0.2))'
            }}
          />
        </div>

        <div className="w-full space-y-4">
          <button
            onClick={handleStoryMode}
            className="w-full bg-gradient-to-r from-yellow-400 via-yellow-500 to-orange-400 text-white font-bold py-4 px-8 rounded-full text-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 border-4 border-yellow-600"
          >
            Continue Story
          </button>

          <button
            onClick={() => setPhase('playing')}
            className="w-full bg-gradient-to-r from-blue-400 to-blue-500 text-white font-bold py-3 px-8 rounded-full text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 border-4 border-blue-600"
          >
            Free Play
          </button>

          <div className="flex gap-4 justify-center">
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl px-6 py-3 shadow-lg border-2 border-blue-300">
              <div className="text-sm text-gray-600 font-medium">Energy</div>
              <div className="text-2xl font-bold text-blue-600">{energy}/{maxEnergy}</div>
            </div>

            <div className="bg-white/90 backdrop-blur-sm rounded-2xl px-6 py-3 shadow-lg border-2 border-yellow-300">
              <div className="text-sm text-gray-600 font-medium">Coins</div>
              <div className="text-2xl font-bold text-yellow-600">{coins}</div>
            </div>
          </div>

          <div className="text-center mt-6">
            <p className="text-white text-sm font-medium drop-shadow-md">
              Chapter {currentChapter} • A special game made with love
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
