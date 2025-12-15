import { useMergeGame } from '@/lib/stores/useMergeGame';
import { getDialoguesForChapter } from '@/lib/dialogues';
import { Dialogue } from '@/lib/dialogues';
import { motion } from 'framer-motion';
import { GardenButton, ResourceDisplay, GardenCard } from './ui/GardenUI';
import { Play, Sparkles, BookOpen, Settings, Volume2 } from 'lucide-react';
import { useState, useEffect, useMemo } from 'react';

interface MenuScreenProps {
  onShowDialogue: (dialogues: Dialogue[]) => void;
}

interface FloatingElement {
  id: number;
  x: number;
  y: number;
  delay: number;
  duration: number;
  size: number;
  type: 'flower' | 'leaf' | 'butterfly';
}

function FloatingDecorations() {
  const elements = useMemo<FloatingElement[]>(() => {
    return Array.from({ length: 15 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 5,
      duration: 15 + Math.random() * 10,
      size: 16 + Math.random() * 24,
      type: ['flower', 'leaf', 'butterfly'][Math.floor(Math.random() * 3)] as FloatingElement['type'],
    }));
  }, []);

  const getEmoji = (type: FloatingElement['type']) => {
    switch (type) {
      case 'flower': return '🌸';
      case 'leaf': return '🍃';
      case 'butterfly': return '🦋';
    }
  };

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {elements.map((el) => (
        <motion.div
          key={el.id}
          className="absolute"
          style={{
            left: `${el.x}%`,
            top: `${el.y}%`,
            fontSize: el.size,
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, 15, -15, 0],
            rotate: [0, 10, -10, 0],
            opacity: [0.6, 1, 0.6],
          }}
          transition={{
            duration: el.duration,
            delay: el.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          {getEmoji(el.type)}
        </motion.div>
      ))}
    </div>
  );
}

function SunAnimation() {
  return (
    <motion.div
      className="absolute -top-10 -right-10 w-40 h-40"
      animate={{ rotate: 360 }}
      transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
    >
      <div className="w-full h-full rounded-full bg-gradient-to-br from-yellow-300 via-amber-400 to-orange-400 shadow-[0_0_60px_rgba(251,191,36,0.6)]" />
      {Array.from({ length: 12 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute top-1/2 left-1/2 w-2 h-16 bg-gradient-to-t from-yellow-400 to-transparent origin-bottom"
          style={{
            transform: `translate(-50%, -100%) rotate(${i * 30}deg)`,
          }}
          animate={{ opacity: [0.3, 0.8, 0.3] }}
          transition={{ duration: 2, delay: i * 0.1, repeat: Infinity }}
        />
      ))}
    </motion.div>
  );
}

export default function MenuScreen({ onShowDialogue }: MenuScreenProps) {
  const { setPhase, energy, maxEnergy, coins, gems, currentChapter, level } = useMergeGame();
  const [showSettings, setShowSettings] = useState(false);

  const handleStoryMode = () => {
    const dialogues = getDialoguesForChapter(currentChapter);
    if (dialogues.length > 0) {
      onShowDialogue(dialogues[0].dialogues);
    } else {
      setPhase('playing');
    }
  };

  return (
    <div 
      className="fixed inset-0 flex flex-col items-center justify-between overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, #86efac 0%, #4ade80 30%, #22c55e 70%, #16a34a 100%)',
      }}
    >
      <FloatingDecorations />
      <SunAnimation />
      
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-emerald-800/30 to-transparent" />
      
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" className="w-full h-24 fill-emerald-800/20">
          <path d="M0,64 C480,120 960,0 1440,64 L1440,120 L0,120 Z" />
        </svg>
      </div>

      <div className="w-full px-4 pt-4 z-10">
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <ResourceDisplay 
            coins={coins} 
            gems={gems || 0} 
            energy={energy} 
            maxEnergy={maxEnergy} 
            compact 
          />
        </motion.div>
      </div>

      <div className="relative w-full max-w-sm px-4 flex flex-col items-center z-10">
        <motion.div 
          className="mb-6"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200 }}
        >
          <div className="relative">
            <motion.div
              animate={{ 
                boxShadow: [
                  '0 0 20px rgba(251, 191, 36, 0.3)',
                  '0 0 40px rgba(251, 191, 36, 0.5)',
                  '0 0 20px rgba(251, 191, 36, 0.3)',
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className="rounded-3xl overflow-hidden"
            >
              <img
                src="/sprites/IMG_20251111_022306_1762821019727.png"
                alt="Garden Story"
                className="w-full h-auto object-contain"
                style={{ 
                  maxHeight: '35vh',
                  filter: 'drop-shadow(0 10px 30px rgba(0, 0, 0, 0.3))'
                }}
              />
            </motion.div>
            
            <motion.div
              className="absolute -top-4 -left-4 text-4xl"
              animate={{ rotate: [-10, 10, -10], y: [0, -5, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              🌻
            </motion.div>
            <motion.div
              className="absolute -top-4 -right-4 text-4xl"
              animate={{ rotate: [10, -10, 10], y: [0, -5, 0] }}
              transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
            >
              🌷
            </motion.div>
          </div>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mb-6"
        >
          <GardenCard className="text-center py-3 px-6">
            <div className="flex items-center justify-center gap-3">
              <div className="text-2xl">🌱</div>
              <div>
                <p className="text-sm text-emerald-600 font-medium">Level {level}</p>
                <p className="text-lg font-bold text-emerald-800">Chapter {currentChapter}</p>
              </div>
              <div className="text-2xl">🌱</div>
            </div>
          </GardenCard>
        </motion.div>
      </div>

      <div className="w-full max-w-sm px-4 pb-8 z-10">
        <div className="space-y-3">
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <GardenButton
              variant="gold"
              size="lg"
              onClick={handleStoryMode}
              icon={<BookOpen size={24} />}
              className="w-full"
            >
              Continue Story
            </GardenButton>
          </motion.div>

          <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <GardenButton
              variant="primary"
              size="lg"
              onClick={() => setPhase('playing')}
              icon={<Play size={24} />}
              className="w-full"
            >
              Free Play
            </GardenButton>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex gap-3 justify-center pt-2"
          >
            <GardenButton
              variant="glass"
              size="md"
              onClick={() => setShowSettings(!showSettings)}
              icon={<Settings size={20} />}
            >
              Settings
            </GardenButton>
            <GardenButton
              variant="glass"
              size="md"
              icon={<Volume2 size={20} />}
            >
              Sound
            </GardenButton>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center mt-6"
        >
          <p className="text-white/90 text-sm font-medium drop-shadow-md flex items-center justify-center gap-2">
            <Sparkles size={14} />
            A special garden made with love
            <Sparkles size={14} />
          </p>
        </motion.div>
      </div>
    </div>
  );
}
