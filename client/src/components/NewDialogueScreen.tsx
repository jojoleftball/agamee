import { useState, useEffect } from 'react';
import { useDialogueStore } from '@/lib/stores/useDialogueStore';
import { ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface NewDialogueScreenProps {
  onComplete: () => void;
}

const CHARACTER_NAMES: Record<string, string> = {
  soly: 'Soly',
  maria: 'Maria',
  baby: 'Baby',
  both: 'Together'
};

export default function NewDialogueScreen({ onComplete }: NewDialogueScreenProps) {
  const dialogues = useDialogueStore((state) => 
    [...state.dialogues].sort((a, b) => a.order - b.order)
  );
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    setCurrentIndex(0);
  }, [dialogues.length]);

  if (dialogues.length === 0) {
    return (
      <div className="fixed inset-0 bg-gradient-to-b from-sky-300 to-sky-100 flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-xl text-gray-700 mb-4">No dialogues available</p>
          <Button onClick={onComplete}>Continue</Button>
        </div>
      </div>
    );
  }

  const currentDialogue = dialogues[currentIndex];
  const isLast = currentIndex === dialogues.length - 1;

  const handleNext = () => {
    if (isLast || currentDialogue.nextAction === 'end') {
      onComplete();
    } else {
      setCurrentIndex(currentIndex + 1);
    }
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-b from-sky-300 to-sky-100 flex flex-col items-center justify-end p-4 z-50">
      <div className="mb-8 flex justify-center items-end gap-4">
        {currentDialogue.talker === 'both' ? (
          <>
            <img
              src={dialogues.find(d => d.talker === 'soly')?.iconUrl || '/sprites/Picsart_25-11-11_02-25-24-524_1762821030742.png'}
              alt="Soly"
              className="w-32 h-32 object-contain animate-bounce-slow filter drop-shadow-xl"
            />
            <img
              src={dialogues.find(d => d.talker === 'maria')?.iconUrl || '/sprites/Picsart_25-11-11_02-29-52-444_1762821030715.png'}
              alt="Maria"
              className="w-32 h-32 object-contain animate-bounce-slow filter drop-shadow-xl"
              style={{ animationDelay: '0.2s' }}
            />
          </>
        ) : (
          <img
            src={currentDialogue.iconUrl}
            alt={CHARACTER_NAMES[currentDialogue.talker]}
            className="w-40 h-40 object-contain animate-bounce-slow filter drop-shadow-xl"
          />
        )}
      </div>

      <div className="w-full max-w-md bg-white/95 backdrop-blur-sm rounded-3xl p-6 shadow-2xl border-4 border-blue-300">
        <div className="mb-3 flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-gradient-to-r from-pink-400 to-purple-500"></div>
          <h3 className="font-bold text-lg text-gray-800">
            {CHARACTER_NAMES[currentDialogue.talker]}
          </h3>
        </div>

        <p className="text-gray-700 text-base leading-relaxed mb-4">
          {currentDialogue.content}
        </p>

        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">
            {currentIndex + 1} / {dialogues.length}
          </span>
          <Button
            onClick={handleNext}
            className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
          >
            {isLast || currentDialogue.nextAction === 'end' ? 'Finish' : 'Next'}
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>

      <style>{`
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        
        .animate-bounce-slow {
          animation: bounce-slow 1.4s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
