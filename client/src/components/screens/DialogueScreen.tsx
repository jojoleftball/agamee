import { useState } from 'react';
import { useGameStore } from '../../store/gameStore';
import { ChevronRight } from 'lucide-react';

export default function DialogueScreen() {
  const activeDialogues = useGameStore((state) => state.activeDialogues);
  const setScreen = useGameStore((state) => state.setScreen);
  const [currentIndex, setCurrentIndex] = useState(0);

  const currentDialogue = activeDialogues[currentIndex];
  const isLast = currentIndex === activeDialogues.length - 1;

  const handleNext = () => {
    if (isLast) {
      setScreen('map');
    } else {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handleSkip = () => {
    setScreen('map');
  };

  if (!currentDialogue) {
    setScreen('map');
    return null;
  }

  return (
    <div className="fixed inset-0 bg-gradient-to-b from-green-300 via-green-200 to-green-100">
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: 'url(/textures/grass.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      <button
        onClick={handleSkip}
        className="absolute top-4 right-4 z-20 px-4 py-2 bg-white/80 hover:bg-white rounded-lg text-sm font-medium text-gray-700 shadow-md transition-colors"
      >
        Skip
      </button>

      <div className="absolute bottom-0 left-0 right-0 p-4 pb-safe">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-6 border-4 border-green-600">
            <div className="flex items-start gap-4 mb-4">
              <div className="flex-shrink-0">
                <img 
                  src={currentDialogue.portrait} 
                  alt={currentDialogue.character}
                  className="w-16 h-16 rounded-full object-cover border-4 border-green-500 shadow-lg"
                />
              </div>
              
              <div className="flex-1">
                <div className="font-bold text-lg text-green-700 mb-2 capitalize">
                  {currentDialogue.character}
                </div>
                <p className="text-gray-800 text-base leading-relaxed">
                  {currentDialogue.text}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between mt-4 pt-4 border-t border-green-200">
              <div className="flex gap-1">
                {activeDialogues.map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      index === currentIndex ? 'bg-green-600' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>

              <button
                onClick={handleNext}
                className="flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium shadow-lg transition-colors active:scale-95"
              >
                {isLast ? 'Continue' : 'Next'}
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
