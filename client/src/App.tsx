import '@fontsource/inter';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import GameFlow from './components/game/GameFlow';
import GameAdminPanel from './components/admin/GameAdminPanel';
import { useMergeGameStore } from './lib/stores/useMergeGameStore';

function AdminPage() {
  const navigate = useNavigate();
  return <GameAdminPanel onClose={() => navigate('/')} />;
}

function App() {
  const { initializeGame, updateEnergy } = useMergeGameStore();
  
  useEffect(() => {
    initializeGame();
    
    const energyInterval = setInterval(() => {
      updateEnergy();
    }, 60000);
    
    return () => clearInterval(energyInterval);
  }, [initializeGame, updateEnergy]);
  
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<GameFlow />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
