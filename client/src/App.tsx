import '@fontsource/inter';
import { useEffect } from 'react';
import GameFlow from './components/game/GameFlow';
import { useMergeGameStore } from './lib/stores/useMergeGameStore';

function App() {
  const { initializeGame, updateEnergy } = useMergeGameStore();
  
  useEffect(() => {
    initializeGame();
    
    const energyInterval = setInterval(() => {
      updateEnergy();
    }, 60000);
    
    return () => clearInterval(energyInterval);
  }, [initializeGame, updateEnergy]);
  
  return <GameFlow />;
}

export default App;
