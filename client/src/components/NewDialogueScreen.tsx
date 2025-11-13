import { useState, useEffect, useMemo } from 'react';
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

const DEFAULT_PORTRAITS: Record<string, string> = {
  soly: '/sprites/Picsart_25-11-11_02-25-24-524_1762821030742.png',
  maria: '/sprites/Picsart_25-11-11_02-29-52-444_1762821030715.png',
  baby: '/sprites/Picsart_25-11-11_02-24-51-362_1762821030770.png',
};

export default function NewDialogueScreen({ onComplete }: NewDialogueScreenProps) {
  const rawDialogues = useDialogueStore((state) => state.dialogues);
  const dialogues = useMemo(() => 
    [...rawDialogues].sort((a, b) => a.order - b.order),
    [rawDialogues]
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

  const getPortraitUrl = (talker: string, iconUrl: string) => {
    if (iconUrl && iconUrl.trim() !== '') {
      return iconUrl;
    }
    return DEFAULT_PORTRAITS[talker] || DEFAULT_PORTRAITS.soly;
  };

  return (
    <div className="fixed inset-0 overflow-hidden">
      {/* Background - Beach House Top-Down View (Placeholder) */}
      <div className="absolute inset-0 bg-gradient-to-b from-sky-300 via-sky-200 to-sand-100">
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: 'url(/textures/sand.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        {/* Placeholder Beach House Illustration */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center space-y-4 opacity-20">
            <div className="w-64 h-64 mx-auto relative">
              <div className="absolute inset-0 bg-amber-200 rounded-lg border-4 border-amber-600 transform rotate-45"></div>
              <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 bg-blue-300 rounded-lg"></div>
            </div>
            <p className="text-6xl font-bold text-amber-800">Beach House</p>
            <p className="text-2xl text-gray-600">(Top-Down View Placeholder)</p>
          </div>
        </div>
      </div>

      {/* RPG-Style Dialogue Box */}
      <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 flex items-end justify-center pointer-events-none">
        <div className="w-full max-w-4xl pointer-events-auto">
          {/* Dialogue Container with Character Portrait */}
          <div className="relative bg-gradient-to-b from-amber-50 to-amber-100 rounded-2xl shadow-2xl border-4 border-amber-800 overflow-hidden">
            {/* Decorative Wood Texture Overlay */}
            <div 
              className="absolute inset-0 opacity-10 pointer-events-none"
              style={{
                backgroundImage: 'url(/textures/wood.jpg)',
                backgroundSize: '200px',
              }}
            />

            {/* Character Portrait - Top Left Corner */}
            {currentDialogue.talker === 'both' ? (
              <div className="absolute -top-2 -left-2 flex gap-1 z-10">
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-full border-4 border-amber-800 bg-white shadow-lg overflow-hidden">
                  <img
                    src={getPortraitUrl('soly', DEFAULT_PORTRAITS.soly)}
                    alt="Soly"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-full border-4 border-amber-800 bg-white shadow-lg overflow-hidden">
                  <img
                    src={getPortraitUrl('maria', DEFAULT_PORTRAITS.maria)}
                    alt="Maria"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            ) : (
              <div className="absolute -top-2 -left-2 w-20 h-20 md:w-24 md:h-24 rounded-full border-4 border-amber-800 bg-white shadow-lg overflow-hidden z-10">
                <img
                  src={getPortraitUrl(currentDialogue.talker, currentDialogue.iconUrl)}
                  alt={CHARACTER_NAMES[currentDialogue.talker]}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Dialogue Content */}
            <div className={`relative pt-6 pb-4 px-6 md:px-8 ${currentDialogue.talker === 'both' ? 'pl-36 md:pl-48' : 'pl-24 md:pl-32'}`}>
              {/* Character Name */}
              <div className="mb-2 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-teal-500"></div>
                <h3 className="font-bold text-lg md:text-xl text-amber-900">
                  {CHARACTER_NAMES[currentDialogue.talker]}
                </h3>
              </div>

              {/* Dialogue Text */}
              <p className="text-gray-800 text-base md:text-lg leading-relaxed mb-4 min-h-[3rem]">
                {currentDialogue.content}
              </p>

              {/* Controls */}
              <div className="flex justify-between items-center">
                <span className="text-sm text-amber-700 font-medium">
                  {currentIndex + 1} / {dialogues.length}
                </span>
                <Button
                  onClick={handleNext}
                  className="bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white font-bold shadow-lg border-2 border-teal-700 rounded-full px-6"
                >
                  {isLast || currentDialogue.nextAction === 'end' ? 'Continue' : 'Next'}
                  <ChevronRight className="w-5 h-5 ml-1" />
                </Button>
              </div>
            </div>

            {/* Decorative Corner Elements */}
            <div className="absolute top-0 right-0 w-16 h-16 border-t-4 border-r-4 border-amber-600 rounded-tr-2xl"></div>
            <div className="absolute bottom-0 left-0 w-16 h-16 border-b-4 border-l-4 border-amber-600 rounded-bl-2xl"></div>
          </div>

          {/* Helper Text */}
          <div className="mt-2 text-center">
            <p className="text-xs text-white drop-shadow-lg">
              Click "Next" to continue the story
            </p>
          </div>
        </div>
      </div>

      <style>{`
        .bg-sand-100 {
          background-color: #FCE7C8;
        }
      `}</style>
    </div>
  );
}
