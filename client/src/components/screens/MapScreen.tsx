import { useGameStore } from '../../store/gameStore';

const LOCKED_ICON_URL = '/game-assets/locked-area-icon.png';

export default function MapScreen() {
  const setScreen = useGameStore((state) => state.setScreen);
  const unlockedGardens = useGameStore((state) => state.unlockedGardens);

  const handleEnterGarden = () => {
    setScreen('garden');
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-b from-sky-300 to-green-200">
      <div 
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage: 'url(/game-assets/garden_world_map_background.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      <div className="relative h-full flex flex-col items-center justify-center p-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white drop-shadow-lg mb-2">
            Your Gardens
          </h1>
          <p className="text-white/90 text-lg">
            Choose a garden to restore
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl w-full">
          <div className="relative">
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl p-6 border-4 border-green-600">
              <div className="aspect-square bg-gradient-to-br from-green-400 to-green-600 rounded-xl mb-4 flex items-center justify-center overflow-hidden">
                <div 
                  className="w-full h-full opacity-60"
                  style={{
                    backgroundImage: 'url(/game-assets/basic_garden_background_vertical.png)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                />
              </div>
              
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                Main Garden
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                Your first garden to restore
              </p>

              <button
                onClick={handleEnterGarden}
                className="w-full py-4 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold text-lg shadow-lg transition-colors active:scale-95 flex items-center justify-center gap-2"
              >
                <span>ENTER</span>
              </button>
            </div>
          </div>

          {['Tropical Paradise', 'Zen Garden', 'Desert Oasis'].map((gardenName, index) => (
            <div key={index} className="relative">
              <div className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-xl p-6 border-4 border-gray-400 relative overflow-hidden">
                <div className="absolute inset-0 bg-gray-900/40 z-10 flex items-center justify-center">
                  <div className="text-center">
                    <img 
                      src={LOCKED_ICON_URL} 
                      alt="Locked" 
                      className="w-24 h-24 mx-auto mb-2 object-contain"
                    />
                    <p className="text-white/80 text-sm">Level {(index + 1) * 5} required</p>
                  </div>
                </div>
                
                <div className="aspect-square bg-gradient-to-br from-gray-400 to-gray-600 rounded-xl mb-4 opacity-50" />
                
                <h3 className="text-xl font-bold text-gray-600 mb-2">
                  {gardenName}
                </h3>
                <p className="text-gray-500 text-sm">
                  Unlock to explore
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
