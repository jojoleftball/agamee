import { useEffect, useState } from 'react';
import '@fontsource/inter';
import { useGardenGame } from './lib/stores/useGardenGame';
import { useMergeStore } from './lib/stores/useMergeStore';
import SimpleLoadingScreen from './components/SimpleLoadingScreen';
import GardenScene from './components/GardenScene';
import GameUI from './components/GameUI';

type AppPhase = 'loading' | 'game';

function App() {
  const { addItem, initialized } = useMergeStore();
  const [phase, setPhase] = useState<AppPhase>('loading');

  useEffect(() => {
    if (phase === 'game' && !initialized) {
      addItem('flower_1', 0, 0, 0);
      addItem('flower_1', 1, 0, 0);
      addItem('flower_1', 2, 0, 0);
      addItem('veg_1', 0, 1, 0);
      addItem('veg_1', 1, 1, 0);
    }
  }, [phase, initialized, addItem]);

  const handleLoadComplete = () => {
    setPhase('game');
  };

  return (
    <div className="w-full h-full fixed inset-0 overflow-hidden bg-gradient-to-b from-sky-300 to-sky-100">
      {phase === 'loading' && <SimpleLoadingScreen onLoadComplete={handleLoadComplete} />}
      {phase === 'game' && (
        <>
          <GardenScene />
          <GameUI />
        </>
      )}
    </div>
  );
}

export default App;
