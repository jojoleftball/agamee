import { useEffect, useState } from "react";
import "@fontsource/inter";
import { useMergeGame } from "./lib/stores/useMergeGame";
import { useDialogueStore } from "./lib/stores/useDialogueStore";
import LoadingScreen from "./components/LoadingScreen";
import NewGameScreen from "./components/NewGameScreen";
import NewDialogueScreen from "./components/NewDialogueScreen";

type AppPhase = 'loading' | 'game' | 'dialogue';

function App() {
  const { loadGame, updateEnergy } = useMergeGame();
  const { loadDialogues } = useDialogueStore();
  const [phase, setPhase] = useState<AppPhase>('loading');

  useEffect(() => {
    loadGame();
    loadDialogues();
  }, [loadGame, loadDialogues]);
  
  useEffect(() => {
    const energyTimer = setInterval(() => {
      updateEnergy();
    }, 5000);
    return () => clearInterval(energyTimer);
  }, [updateEnergy]);

  const handleLoadComplete = () => {
    setPhase('dialogue');
  };

  const handleDialogueComplete = () => {
    setPhase('game');
  };

  const handleShowDialogue = () => {
    setPhase('dialogue');
  };

  const handleBackToMenu = () => {
    setPhase('dialogue');
  };

  return (
    <div className="w-full h-full fixed inset-0 overflow-hidden">
      {phase === 'loading' && <LoadingScreen onLoadComplete={handleLoadComplete} />}
      {phase === 'game' && (
        <NewGameScreen
          onBackToMenu={handleBackToMenu}
          onShowDialogue={handleShowDialogue}
        />
      )}
      {phase === 'dialogue' && <NewDialogueScreen onComplete={handleDialogueComplete} />}
    </div>
  );
}

export default App;
