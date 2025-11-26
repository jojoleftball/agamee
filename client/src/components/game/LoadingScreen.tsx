import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useSettingsStore } from '@/lib/stores/useSettingsStore';
import { GardenFlowerIcon } from '../icons/GardenIcons';

interface LoadingScreenProps {
  onLoadComplete: () => void;
}

interface FloatingFlower {
  id: number;
  startX: number;
  startRotate: number;
  scale: number;
  endRotate: number;
  duration: number;
  delay: number;
  size: number;
  hue: number;
}

export default function LoadingScreen({ onLoadComplete }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const t = useSettingsStore((state) => state.t);

  const floatingFlowers = useMemo<FloatingFlower[]>(() => {
    const screenWidth = typeof window !== 'undefined' ? window.innerWidth : 400;
    return Array.from({ length: 12 }, (_, i) => ({
      id: i,
      startX: Math.random() * screenWidth,
      startRotate: Math.random() * 360,
      scale: 0.5 + Math.random() * 0.5,
      endRotate: 360 + Math.random() * 360,
      duration: 8 + Math.random() * 4,
      delay: Math.random() * 5,
      size: 32 + Math.random() * 24,
      hue: 340 + Math.random() * 40,
    }));
  }, []);

  useEffect(() => {
    const imagesToPreload = [
      '/sprites/Picsart_25-11-11_02-25-24-524_1762821030742.png',
      '/sprites/Picsart_25-11-11_02-29-52-444_1762821030715.png',
      '/game-assets/garden-world-map-fog.jpg',
      '/game-assets/middle-garden-view.jpg',
    ];

    let loadedCount = 0;
    const totalImages = imagesToPreload.length;
    const minLoadTime = 2000;
    const startTime = Date.now();

    const preloadImage = (src: string) => {
      return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
          loadedCount++;
          const naturalProgress = Math.floor((loadedCount / totalImages) * 100);
          setProgress(naturalProgress);
          resolve(img);
        };
        img.onerror = () => {
          loadedCount++;
          setProgress(Math.floor((loadedCount / totalImages) * 100));
          resolve(null);
        };
        img.src = src;
      });
    };

    Promise.all(imagesToPreload.map((src) => preloadImage(src))).then(() => {
      const elapsed = Date.now() - startTime;
      const remainingTime = Math.max(0, minLoadTime - elapsed);
      
      setTimeout(() => {
        setProgress(100);
        setTimeout(onLoadComplete, 500);
      }, remainingTime);
    });
  }, [onLoadComplete]);

  const screenHeight = useMemo(() => 
    typeof window !== 'undefined' ? window.innerHeight : 800, 
  []);

  return (
    <div className="fixed inset-0 bg-gradient-to-b from-emerald-500 via-green-500 to-emerald-600 flex flex-col items-center justify-center overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {floatingFlowers.map((flower) => (
          <motion.div
            key={flower.id}
            className="absolute"
            initial={{ 
              x: flower.startX,
              y: screenHeight + 50,
              rotate: flower.startRotate,
              scale: flower.scale
            }}
            animate={{ 
              y: -100,
              rotate: flower.endRotate,
            }}
            transition={{
              duration: flower.duration,
              repeat: Infinity,
              delay: flower.delay,
              ease: 'linear'
            }}
          >
            <GardenFlowerIcon size={flower.size} color={`hsl(${flower.hue}, 80%, 70%)`} />
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ scale: 0.8, opacity: 0, y: -30 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="text-center mb-16 z-10"
      >
        <div className="relative inline-block">
          <h1 className="text-6xl font-bold text-white drop-shadow-2xl tracking-wide">
            {t('loading.title')}
          </h1>
          <motion.div
            className="absolute -top-4 -right-6"
            animate={{ rotate: [0, 15, -15, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <GardenFlowerIcon size={48} />
          </motion.div>
        </div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-xl text-green-100 mt-4 drop-shadow-lg"
        >
          {t('loading.subtitle')}
        </motion.p>
      </motion.div>

      <motion.div
        initial={{ scaleX: 0, opacity: 0 }}
        animate={{ scaleX: 1, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="w-full max-w-md px-8 z-10"
      >
        <div className="relative h-10 bg-white/20 rounded-full overflow-hidden border-4 border-white/40 shadow-2xl backdrop-blur-sm">
          <motion.div
            className="h-full bg-gradient-to-r from-amber-400 via-yellow-400 to-orange-400 relative overflow-hidden"
            style={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/30 to-white/50" />
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent"
              animate={{ x: ['-100%', '200%'] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          </motion.div>
          
          <motion.div
            className="absolute top-1/2 transform -translate-y-1/2"
            style={{ left: `${Math.max(progress - 3, 0)}%` }}
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 0.5, repeat: Infinity }}
          >
            <GardenFlowerIcon size={28} />
          </motion.div>
        </div>

        <div className="text-center mt-4">
          <span className="text-xl font-bold text-white drop-shadow-lg">
            {progress}%
          </span>
        </div>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-8 text-white/80 text-sm z-10"
      >
        {t('loading.tip')}
      </motion.p>

      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-emerald-800/50 to-transparent pointer-events-none" />
      
      <svg className="absolute bottom-0 left-0 right-0 w-full h-20" viewBox="0 0 1200 100" preserveAspectRatio="none">
        <path d="M0,100 Q150,40 300,70 T600,50 T900,70 T1200,40 L1200,100 Z" fill="rgba(22, 163, 74, 0.5)" />
        <path d="M0,100 Q100,60 200,80 T500,60 T800,75 T1200,55 L1200,100 Z" fill="rgba(21, 128, 61, 0.7)" />
      </svg>
    </div>
  );
}
