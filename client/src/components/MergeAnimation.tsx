import { useEffect, useState } from 'react';

interface MergeAnimationProps {
  x: number;
  y: number;
}

export default function MergeAnimation({ x, y }: MergeAnimationProps) {
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; vx: number; vy: number }>>([]);

  useEffect(() => {
    const newParticles = Array.from({ length: 12 }, (_, i) => ({
      id: i,
      x: 0,
      y: 0,
      vx: (Math.random() - 0.5) * 10,
      vy: (Math.random() - 0.5) * 10 - 5
    }));
    
    setParticles(newParticles);
  }, []);

  return (
    <div className="absolute pointer-events-none" style={{ left: x, top: y, zIndex: 2000 }}>
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute w-4 h-4 rounded-full bg-yellow-400 animate-particle"
          style={{
            left: particle.x,
            top: particle.y,
            transform: 'translate(-50%, -50%)',
            animation: `particleFade 1s ease-out forwards`,
            animationDelay: `${particle.id * 0.05}s`
          }}
        />
      ))}
      
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-4xl font-bold text-yellow-400 animate-bounce">
          +
        </div>
      </div>

      <style>{`
        @keyframes particleFade {
          0% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
          }
          100% {
            opacity: 0;
            transform: translate(calc(-50% + ${Math.random() * 100 - 50}px), calc(-50% - 100px)) scale(0);
          }
        }
      `}</style>
    </div>
  );
}
