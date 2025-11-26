import { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSettingsStore } from '@/lib/stores/useSettingsStore';

interface IntroDialogueScreenProps {
  onComplete: () => void;
}

interface DialogueLine {
  character: 'maria' | 'soly';
  textKey: string;
}

const CHARACTER_SPRITES: Record<string, string> = {
  soly: '/sprites/Picsart_25-11-11_02-25-24-524_1762821030742.png',
  maria: '/sprites/Picsart_25-11-11_02-29-52-444_1762821030715.png',
};

const CHARACTER_NAMES: Record<string, string> = {
  soly: 'Soly',
  maria: 'Maria',
};

const CHARACTER_COLORS: Record<string, { bg: string; border: string; text: string }> = {
  soly: { bg: 'from-amber-100 to-orange-100', border: 'border-amber-400', text: 'text-amber-800' },
  maria: { bg: 'from-pink-100 to-rose-100', border: 'border-pink-400', text: 'text-pink-800' },
};

export default function IntroDialogueScreen({ onComplete }: IntroDialogueScreenProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const t = useSettingsStore((state) => state.t);
  const setHasSeenIntro = useSettingsStore((state) => state.setHasSeenIntro);

  const dialogueLines: DialogueLine[] = useMemo(() => [
    { character: 'maria', textKey: 'intro.maria_line1' },
    { character: 'soly', textKey: 'intro.soly_line1' },
    { character: 'maria', textKey: 'intro.maria_line2' },
    { character: 'soly', textKey: 'intro.soly_line2' },
    { character: 'maria', textKey: 'intro.maria_line3' },
  ], []);

  const currentDialogue = dialogueLines[currentIndex];
  const isLast = currentIndex === dialogueLines.length - 1;

  const handleTap = useCallback(() => {
    if (isLast) {
      setHasSeenIntro(true);
      onComplete();
    } else {
      setCurrentIndex((prev) => prev + 1);
    }
  }, [isLast, onComplete, setHasSeenIntro]);

  const colors = CHARACTER_COLORS[currentDialogue.character];

  return (
    <div 
      className="fixed inset-0 overflow-hidden touch-none"
      onClick={handleTap}
    >
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: 'url(/game-assets/garden-world-map-fog.jpg)',
          filter: 'brightness(0.8) blur(2px)',
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/50" />

      <div className="relative h-full flex flex-col justify-end p-4 pb-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: currentDialogue.character === 'soly' ? 50 : -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-lg mx-auto"
          >
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="relative"
            >
              <motion.img
                src={CHARACTER_SPRITES[currentDialogue.character]}
                alt={CHARACTER_NAMES[currentDialogue.character]}
                className={`absolute -top-32 w-36 h-36 object-contain filter drop-shadow-2xl ${
                  currentDialogue.character === 'soly' ? 'right-4' : 'left-4'
                }`}
                initial={{ scale: 0.8, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                transition={{ type: 'spring', stiffness: 200 }}
              />

              <div className={`bg-gradient-to-br ${colors.bg} rounded-3xl p-6 shadow-2xl ${colors.border} border-4 backdrop-blur-sm`}>
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${
                    currentDialogue.character === 'soly' 
                      ? 'from-amber-400 to-orange-500' 
                      : 'from-pink-400 to-rose-500'
                  }`} />
                  <h3 className={`font-bold text-xl ${colors.text}`}>
                    {CHARACTER_NAMES[currentDialogue.character]}
                  </h3>
                </div>

                <p className="text-gray-700 text-lg leading-relaxed mb-6">
                  {t(currentDialogue.textKey)}
                </p>

                <div className="flex justify-between items-center">
                  <div className="flex gap-1">
                    {dialogueLines.map((_, idx) => (
                      <motion.div
                        key={idx}
                        className={`w-2 h-2 rounded-full transition-colors ${
                          idx <= currentIndex ? 'bg-emerald-500' : 'bg-gray-300'
                        }`}
                        animate={idx === currentIndex ? { scale: [1, 1.3, 1] } : {}}
                        transition={{ duration: 0.5, repeat: Infinity }}
                      />
                    ))}
                  </div>

                  <motion.div
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="text-sm text-gray-500 flex items-center gap-2"
                  >
                    {t('dialogue.tap_continue')}
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M9 18l6-6-6-6" />
                    </svg>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="absolute top-4 right-4 bg-black/30 backdrop-blur-sm rounded-full px-4 py-2">
        <span className="text-white text-sm font-medium">
          {currentIndex + 1} / {dialogueLines.length}
        </span>
      </div>
    </div>
  );
}
