import { useState } from 'react';
import { Grid3x3, Map, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import MergeBoard from './MergeBoard';
import BeachHouseExplorer from './BeachHouseExplorer';
import TaskPanel from './TaskPanel';
import { useBeachHouseStore } from '@/lib/stores/useBeachHouseStore';
import { useTaskStore } from '@/lib/stores/useTaskStore';

type GameView = 'merge' | 'explore';

export default function GameViewSwitcher() {
  const [currentView, setCurrentView] = useState<GameView>('merge');
  const [showTaskPanel, setShowTaskPanel] = useState(false);
  const { setCurrentArea } = useTaskStore();

  const handleAreaClick = (areaId: string) => {
    console.log('Area clicked:', areaId);
    setCurrentArea(areaId);
    setShowTaskPanel(true);
  };

  return (
    <div className="relative w-full h-full">
      {/* View Content */}
      <div className="absolute inset-0">
        {currentView === 'merge' ? (
          <div className="w-full h-full bg-gradient-to-b from-amber-50 to-orange-50 flex items-center justify-center overflow-auto">
            <MergeBoard />
          </div>
        ) : (
          <BeachHouseExplorer onAreaClick={handleAreaClick} />
        )}
      </div>

      {/* View Switcher Buttons */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 bg-white/95 backdrop-blur-sm rounded-2xl p-2 shadow-2xl border-4 border-amber-600">
        <Button
          onClick={() => setCurrentView('merge')}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${
            currentView === 'merge'
              ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg scale-105'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          <Grid3x3 className="w-5 h-5" />
          Merge Board
        </Button>
        
        <Button
          onClick={() => setCurrentView('explore')}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${
            currentView === 'explore'
              ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg scale-105'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          <Map className="w-5 h-5" />
          Beach House
        </Button>
      </div>

      {/* Tasks Button */}
      <div className="absolute top-4 right-4">
        <Button
          onClick={() => setShowTaskPanel(true)}
          className="flex items-center gap-2 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white px-6 py-3 rounded-xl font-bold shadow-2xl"
        >
          <List className="w-5 h-5" />
          Tasks
        </Button>
      </div>

      {/* Task Panel */}
      {showTaskPanel && (
        <TaskPanel 
          onClose={() => setShowTaskPanel(false)} 
        />
      )}
    </div>
  );
}
