import { useEffect, useState } from 'react';

interface MergeAnimationProps {
  x: number;
  y: number;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  rotation: number;
  color: string;
}

export default function MergeAnimation({ x, y }: MergeAnimationProps) {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [showSuccess, setShowSuccess] = useState(true);

  useEffect(() => {
    const colors = ['#FFD700', '#FFA500', '#FF69B4', '#90EE90', '#87CEEB'];
    const newParticles = Array.from({ length: 20 }, (_, i) => {
      const angle = (i / 20) * Math.PI * 2;
      const speed = 3 + Math.random() * 4;
      return {
        id: i,
        x: 0,
        y: 0,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 8 + Math.random() * 8,
        rotation: Math.random() * 360,
        color: colors[Math.floor(Math.random() * colors.length)]
      };
    });
    
    setParticles(newParticles);

    const successTimer = setTimeout(() => {
      setShowSuccess(false);
    }, 600);

    return () => clearTimeout(successTimer);
  }, []);

  return (
    <div className="absolute pointer-events-none" style={{ left: x, top: y, zIndex: 2000 }}>
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute rounded-full"
          style={{
            left: 0,
            top: 0,
            width: particle.size,
            height: particle.size,
            backgroundColor: particle.color,
            boxShadow: `0 0 ${particle.size}px ${particle.color}`,
            transform: 'translate(-50%, -50%)',
            animation: `mergeParticle 1.2s ease-out forwards`,
            animationDelay: `${particle.id * 0.02}s`,
            '--vx': `${particle.vx * 20}px`,
            '--vy': `${particle.vy * 20}px`,
            '--rotation': `${particle.rotation}deg`
          } as React.CSSProperties}
        />
      ))}
      
      {showSuccess && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div 
            className="relative"
            style={{
              animation: 'mergeSuccess 0.6s ease-out forwards'
            }}
          >
            <div className="absolute inset-0 bg-yellow-400 rounded-full blur-xl opacity-60" style={{ width: 80, height: 80, transform: 'translate(-50%, -50%)' }} />
            <svg className="w-16 h-16 text-yellow-300 drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)]" fill="currentColor" viewBox="0 0 20 20" style={{ filter: 'drop-shadow(0 0 20px rgba(255, 215, 0, 0.8))' }}>
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </div>
        </div>
      )}

      <div 
        className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        style={{
          animation: 'mergeGlow 1s ease-out forwards'
        }}
      >
        <div className="w-24 h-24 rounded-full bg-gradient-to-r from-yellow-400 via-orange-400 to-pink-400 opacity-40 blur-2xl" />
      </div>

      <style>{`
        @keyframes mergeParticle {
          0% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1) rotate(0deg);
          }
          50% {
            opacity: 0.8;
          }
          100% {
            opacity: 0;
            transform: translate(calc(-50% + var(--vx)), calc(-50% + var(--vy))) scale(0.2) rotate(var(--rotation));
          }
        }

        @keyframes mergeSuccess {
          0% {
            opacity: 0;
            transform: scale(0.3);
          }
          50% {
            opacity: 1;
            transform: scale(1.3);
          }
          100% {
            opacity: 0;
            transform: scale(1.5);
          }
        }

        @keyframes mergeGlow {
          0% {
            opacity: 0.6;
            transform: translate(-50%, -50%) scale(0.5);
          }
          100% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(2.5);
          }
        }
      `}</style>
    </div>
  );
}
