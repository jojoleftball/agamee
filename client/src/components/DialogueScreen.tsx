import { useState } from 'react';
import { Dialogue } from '@/lib/dialogues';

interface DialogueScreenProps {
  dialogues: Dialogue[];
  onComplete: () => void;
}

const CHARACTER_SPRITES: Record<string, string> = {
  soly: '/sprites/Picsart_25-11-11_02-25-24-524_1762821030742.png',
  maria: '/sprites/Picsart_25-11-11_02-29-52-444_1762821030715.png',
  baby: '/sprites/Picsart_25-11-11_02-24-51-362_1762821030770.png'
};

const CHARACTER_NAMES: Record<string, string> = {
  soly: 'Soly',
  maria: 'Maria',
  baby: 'Baby',
  both: 'Together'
};

export default function DialogueScreen({ dialogues, onComplete }: DialogueScreenProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const currentDialogue = dialogues[currentIndex];
  const isLast = currentIndex === dialogues.length - 1;

  const handleNext = () => {
    if (isLast) {
      onComplete();
    } else {
      setCurrentIndex(currentIndex + 1);
    }
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-b from-sky-300 to-sky-100 flex flex-col items-center justify-end p-4 z-50">
      <div className="w-full max-w-md relative">
        {currentDialogue.character === 'both' ? (
          <div className="absolute -top-20 left-4 flex gap-2 z-20">
            <img
              src={CHARACTER_SPRITES.soly}
              alt="Soly"
              className="w-24 h-24 object-contain filter drop-shadow-xl"
            />
            <img
              src={CHARACTER_SPRITES.maria}
              alt="Maria"
              className="w-24 h-24 object-contain filter drop-shadow-xl"
            />
          </div>
        ) : (
          <img
            src={CHARACTER_SPRITES[currentDialogue.character]}
            alt={CHARACTER_NAMES[currentDialogue.character]}
            className="absolute -top-24 left-4 w-28 h-28 object-contain filter drop-shadow-xl z-20"
          />
        )}

        <div className="w-full bg-white/95 backdrop-blur-sm rounded-3xl p-6 shadow-2xl border-4 border-blue-300">
        <div className="mb-3 flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-gradient-to-r from-pink-400 to-purple-500"></div>
          <h3 className="font-bold text-lg text-gray-800">
            {CHARACTER_NAMES[currentDialogue.character]}
          </h3>
        </div>

        <p className="text-gray-700 text-base leading-relaxed mb-4">
          {currentDialogue.text}
        </p>

          <div className="flex justify-between items-center">
            <div className="text-xs text-gray-500">
              {currentIndex + 1} / {dialogues.length}
            </div>
            
            <button
              onClick={handleNext}
              className="bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold py-3 px-6 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
            >
              {isLast ? 'Continue ✨' : 'Next →'}
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        
        .animate-bounce-slow {
          animation: bounce-slow 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
