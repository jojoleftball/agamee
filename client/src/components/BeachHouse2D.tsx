import { useState, useEffect, useRef } from 'react';
import { useBeachHouseStore } from '@/lib/stores/useBeachHouseStore';
import { useTaskStore } from '@/lib/stores/useTaskStore';
import { Lock, CheckCircle, Hammer } from 'lucide-react';

interface BeachHouse2DProps {
  onAreaClick?: (areaId: string) => void;
}

interface Position {
  x: number;
  y: number;
}

export default function BeachHouse2D({ onAreaClick }: BeachHouse2DProps) {
  const { areas, initializeAreas } = useBeachHouseStore();
  const unlockedAreaIds = useTaskStore(state => state.unlockedAreaIds);
  const completedTaskIds = useTaskStore(state => state.completedTaskIds);
  const getAreaProgress = useTaskStore(state => state.getAreaProgress);
  const [playerPos, setPlayerPos] = useState<Position>({ x: 50, y: 70 });
  const [targetPos, setTargetPos] = useState<Position | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    initializeAreas();
  }, [initializeAreas]);

  useEffect(() => {
    if (!targetPos) {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
      return;
    }

    const movePlayer = () => {
      setPlayerPos(current => {
        const dx = targetPos.x - current.x;
        const dy = targetPos.y - current.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 0.5) {
          setTargetPos(null);
          return targetPos;
        }

        const speed = 0.08;
        return {
          x: current.x + dx * speed,
          y: current.y + dy * speed
        };
      });
      
      animationRef.current = requestAnimationFrame(movePlayer);
    };

    animationRef.current = requestAnimationFrame(movePlayer);
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [targetPos]);

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    setTargetPos({ x, y });
  };

  const areaPositions = [
    { id: 'entrance', x: 30, y: 65, label: 'Entrance' },
    { id: 'living_room', x: 50, y: 50, label: 'Living Room' },
    { id: 'kitchen', x: 70, y: 65, label: 'Kitchen' },
    { id: 'bedroom', x: 35, y: 35, label: 'Bedroom' },
    { id: 'bathroom', x: 65, y: 35, label: 'Bathroom' },
    { id: 'garden', x: 50, y: 80, label: 'Garden' }
  ];

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-full overflow-hidden bg-gradient-to-b from-sky-400 via-sky-300 to-sand-200 cursor-pointer"
      onClick={handleClick}
    >
      {/* Beach House Background */}
      <div 
        className="absolute inset-0 bg-center bg-contain bg-no-repeat opacity-90"
        style={{
          backgroundImage: "url('/beachhouse-clean.png')",
          backgroundSize: '80%',
          backgroundPosition: 'center 40%'
        }}
      />

      {/* Area Hotspots */}
      {areaPositions.map(pos => {
        const isLocked = !unlockedAreaIds.includes(pos.id);
        const progress = getAreaProgress(pos.id);
        const isComplete = progress === 100;
        
        return (
          <div
            key={pos.id}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
            style={{
              left: `${pos.x}%`,
              top: `${pos.y}%`
            }}
            onClick={(e) => {
              e.stopPropagation();
              if (!isLocked && onAreaClick) {
                onAreaClick(pos.id);
              }
            }}
          >
            {/* Area Marker */}
            <div className={`
              w-16 h-16 rounded-full border-4 shadow-2xl flex items-center justify-center
              transition-all duration-300 group-hover:scale-110
              ${isLocked ? 'bg-gradient-to-br from-gray-400 to-gray-600 border-gray-300' : ''}
              ${!isLocked && !isComplete ? 'bg-gradient-to-br from-orange-400 to-red-500 border-orange-300 animate-pulse' : ''}
              ${isComplete ? 'bg-gradient-to-br from-green-400 to-emerald-500 border-green-300' : ''}
            `}>
              {isLocked && <Lock className="w-8 h-8 text-white" />}
              {!isLocked && !isComplete && <Hammer className="w-8 h-8 text-white" />}
              {isComplete && <CheckCircle className="w-8 h-8 text-white" />}
            </div>

            {/* Area Label */}
            <div className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
              <div className="bg-black/80 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                {pos.label}
              </div>
            </div>
          </div>
        );
      })}

      {/* Player Character */}
      <div
        className="absolute w-12 h-12 transform -translate-x-1/2 -translate-y-1/2 transition-all duration-100 z-10"
        style={{
          left: `${playerPos.x}%`,
          top: `${playerPos.y}%`
        }}
      >
        {/* Character sprite */}
        <div className="relative">
          {/* Shadow */}
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-10 h-3 bg-black/30 rounded-full blur-sm" />
          
          {/* Character body */}
          <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full border-4 border-white shadow-lg flex items-center justify-center">
            <div className="w-6 h-6 bg-white rounded-full" />
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/80 text-white px-6 py-3 rounded-full text-sm font-bold shadow-2xl">
        Tap anywhere to move • Click areas to view tasks
      </div>
    </div>
  );
}
