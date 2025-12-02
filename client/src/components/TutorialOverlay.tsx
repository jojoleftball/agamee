import { useGameStore } from '../store/gameStore';

export default function TutorialOverlay() {
  const showTutorial = useGameStore((state) => state.showTutorial);
  const tutorialStep = useGameStore((state) => state.tutorialStep);

  if (!showTutorial) return null;

  const tutorialMessages: Record<number, { title: string; message: string; position: string }> = {
    0: {
      title: 'Start Playing!',
      message: 'Tap "Open Merge Board" to start creating beautiful flowers!',
      position: 'bottom-24',
    },
    1: {
      title: 'Merge 3 Items',
      message: 'Drag 3 identical items together to create a higher rank item!',
      position: 'top-24',
    },
    2: {
      title: 'Final Rank Plants',
      message: 'When a plant reaches its maximum rank, you can plant it in your garden!',
      position: 'top-24',
    },
    3: {
      title: 'Plant Care',
      message: 'Keep your plants healthy with Water Buckets and Seed Bags!',
      position: 'top-24',
    },
  };

  const current = tutorialMessages[tutorialStep];
  if (!current) return null;

  return (
    <div className={`fixed left-0 right-0 ${current.position} z-50 px-4 pointer-events-none`}>
      <div className="max-w-md mx-auto bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-6 border-4 border-yellow-400 pointer-events-auto animate-bounce">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-full flex items-center justify-center text-white font-bold text-xl">!</div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-800 mb-2">
              {current.title}
            </h3>
            <p className="text-gray-700">
              {current.message}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
