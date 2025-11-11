import { useEffect } from "react";
import "@fontsource/inter";
import { useMergeGame } from "./lib/stores/useMergeGame";
import LoadingScreen from "./components/LoadingScreen";
import MenuScreen from "./components/MenuScreen";
import GameScreen from "./components/GameScreen";

function App() {
  const { phase, setPhase, loadGame } = useMergeGame();

  useEffect(() => {
    loadGame();
  }, [loadGame]);

  const handleLoadComplete = () => {
    setPhase('menu');
  };

  return (
    <div className="w-full h-full fixed inset-0 overflow-hidden">
      {phase === 'loading' && <LoadingScreen onLoadComplete={handleLoadComplete} />}
      {phase === 'menu' && <MenuScreen />}
      {phase === 'playing' && <GameScreen />}
    </div>
  );
}

export default App;
