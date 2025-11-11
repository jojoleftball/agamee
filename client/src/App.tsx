import { useEffect, useState } from "react";
import "@fontsource/inter";
import { useMergeGame } from "./lib/stores/useMergeGame";
import LoadingScreen from "./components/LoadingScreen";
import MenuScreen from "./components/MenuScreen";
import GameScreen from "./components/GameScreen";
import DialogueScreen from "./components/DialogueScreen";
import { Dialogue } from "./lib/dialogues";

function App() {
  const { phase, setPhase, loadGame, nextChapter } = useMergeGame();
  const [currentDialogues, setCurrentDialogues] = useState<Dialogue[] | null>(null);
  const [shouldAdvanceChapter, setShouldAdvanceChapter] = useState(false);

  useEffect(() => {
    loadGame();
  }, [loadGame]);

  const handleLoadComplete = () => {
    setPhase('menu');
  };

  const handleShowDialogue = (dialogues: Dialogue[], advanceChapter: boolean = false) => {
    setCurrentDialogues(dialogues);
    setShouldAdvanceChapter(advanceChapter);
    setPhase('dialogue');
  };

  const handleDialogueComplete = () => {
    if (shouldAdvanceChapter) {
      nextChapter();
    }
    setCurrentDialogues(null);
    setShouldAdvanceChapter(false);
    setPhase('playing');
  };

  return (
    <div className="w-full h-full fixed inset-0 overflow-hidden">
      {phase === 'loading' && <LoadingScreen onLoadComplete={handleLoadComplete} />}
      {phase === 'menu' && <MenuScreen onShowDialogue={(d) => handleShowDialogue(d, true)} />}
      {phase === 'playing' && <GameScreen onShowDialogue={(d) => handleShowDialogue(d, false)} />}
      {phase === 'dialogue' && currentDialogues && (
        <DialogueScreen dialogues={currentDialogues} onComplete={handleDialogueComplete} />
      )}
    </div>
  );
}

export default App;
