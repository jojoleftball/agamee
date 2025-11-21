import { useEffect, useState } from 'react';
import '@fontsource/inter';
import { useGardenGame } from './lib/stores/useGardenGame';
import { useMergeStore, validateMergeChains } from './lib/stores/useMergeStore';
import SimpleLoadingScreen from './components/SimpleLoadingScreen';
import GardenScene from './components/GardenScene';
import GameUI from './components/GameUI';
import { soundManager } from './lib/sounds';

type AppPhase = 'loading' | 'game';

function App() {
  const { addItem, initialized } = useMergeStore();
  const [phase, setPhase] = useState<AppPhase>('loading');

  useEffect(() => {
    validateMergeChains();
  }, []);

  useEffect(() => {
    const { items } = useMergeStore.getState();
    if (phase === 'game' && items.length === 0) {
      addItem('flower_1', 0, 0, 0);
      addItem('flower_1', 1, 0, 0);
      addItem('flower_1', 2, 0, 0);
      addItem('veg_1', 0, 1, 0);
      addItem('veg_1', 1, 1, 0);
    }
  }, [phase, addItem]);

  const handleLoadComplete = () => {
    setPhase('game');
    setTimeout(() => {
      soundManager.playBackground();
    }, 500);
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
