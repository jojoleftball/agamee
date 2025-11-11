import { useMergeGame } from '@/lib/stores/useMergeGame';

export default function GameScreen() {
  const { energy, maxEnergy, coins, setPhase } = useMergeGame();

  return (
    <div className="fixed inset-0 bg-gradient-to-b from-green-100 to-blue-100 flex flex-col">
      <div className="bg-white/90 backdrop-blur-sm shadow-md p-4 flex justify-between items-center">
        <button
          onClick={() => setPhase('menu')}
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-lg transition-colors"
        >
          ← Menu
        </button>
        
        <div className="flex gap-4">
          <div className="bg-blue-500 text-white px-4 py-2 rounded-lg font-bold shadow">
            ⚡ {energy}/{maxEnergy}
          </div>
          <div className="bg-yellow-500 text-white px-4 py-2 rounded-lg font-bold shadow">
            💰 {coins}
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-4">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl max-w-md w-full">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
            Game Area
          </h2>
          <p className="text-gray-600 text-center mb-6">
            Merge game mechanics will be added here in the next phase.
          </p>
          
          <div className="flex flex-col gap-3">
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-xl border-2 border-blue-200">
              <p className="text-sm text-gray-700">
                ✨ This is where you'll merge items to decorate your beach house
              </p>
            </div>
            
            <div className="bg-gradient-to-r from-green-50 to-yellow-50 p-4 rounded-xl border-2 border-green-200">
              <p className="text-sm text-gray-700">
                🏠 Complete tasks to unlock new rooms and decorations
              </p>
            </div>
            
            <div className="bg-gradient-to-r from-pink-50 to-red-50 p-4 rounded-xl border-2 border-pink-200">
              <p className="text-sm text-gray-700">
                💕 Discover story moments with Soly, Maria, and your baby
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
