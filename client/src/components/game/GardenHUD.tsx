import { motion } from 'framer-motion';
import { useSettingsStore } from '@/lib/stores/useSettingsStore';

interface GardenHUDProps {
  level: number;
  coins: number;
  gems: number;
}

export default function GardenHUD({ level, coins, gems }: GardenHUDProps) {
  const { hudPositions } = useSettingsStore();
  const levelPos = hudPositions.levelCircle;
  const coinsPos = hudPositions.coinsBar;
  const gemsPos = hudPositions.gemsBar;

  return (
    <div className="absolute top-3 left-3 z-30">
      <div 
        className="relative"
        style={{ 
          transform: `translate(${levelPos.x}px, ${levelPos.y}px)`,
        }}
      >
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1, type: 'spring', stiffness: 300 }}
          className="relative"
          style={{ 
            width: 52 * levelPos.scale, 
            height: 52 * levelPos.scale,
          }}
        >
          <img
            src="/sprites/hud/level-circle.png"
            alt="Level"
            className="w-full h-full object-contain"
            draggable={false}
          />
          <div 
            className="absolute inset-0 flex items-center justify-center"
            style={{ 
              transform: `translate(${levelPos.textOffsetX}px, ${levelPos.textOffsetY}px)`,
            }}
          >
            <span 
              className="font-bold text-amber-900 drop-shadow-sm"
              style={{ 
                fontSize: levelPos.fontSize || (level >= 100 ? 14 : level >= 10 ? 18 : 22),
                textShadow: '0 1px 0 rgba(255,255,255,0.5)',
                fontFamily: 'system-ui, -apple-system, sans-serif',
                letterSpacing: '-0.5px',
              }}
            >
              {level}
            </span>
          </div>
        </motion.div>
      </div>

      <div 
        className="absolute"
        style={{ 
          top: 8,
          left: 44,
          transform: `translate(${coinsPos.x}px, ${coinsPos.y}px)`,
        }}
      >
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 300 }}
          className="relative"
          style={{ 
            width: 110 * coinsPos.scale, 
            height: 36 * coinsPos.scale, 
          }}
        >
          <img
            src="/sprites/hud/coins-bar.png"
            alt="Coins"
            className="w-full h-full object-contain"
            draggable={false}
          />
          <div 
            className="absolute inset-0 flex items-center justify-center"
            style={{ 
              paddingLeft: '25%',
              transform: `translate(${coinsPos.textOffsetX}px, ${coinsPos.textOffsetY}px)`,
            }}
          >
            <span 
              className="font-bold text-amber-800"
              style={{ 
                fontSize: coinsPos.fontSize || (coins >= 10000 ? 11 : coins >= 1000 ? 13 : 14),
                textShadow: '0 1px 0 rgba(255,255,255,0.6)',
                fontFamily: 'system-ui, -apple-system, sans-serif',
                letterSpacing: '-0.3px',
              }}
            >
              {coins.toLocaleString()}
            </span>
          </div>
        </motion.div>
      </div>

      <div 
        className="absolute"
        style={{ 
          top: 8,
          left: 146,
          transform: `translate(${gemsPos.x}px, ${gemsPos.y}px)`,
        }}
      >
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.3, type: 'spring', stiffness: 300 }}
          className="relative"
          style={{ 
            width: 110 * gemsPos.scale, 
            height: 36 * gemsPos.scale, 
          }}
        >
          <img
            src="/sprites/hud/gems-bar.png"
            alt="Gems"
            className="w-full h-full object-contain"
            draggable={false}
          />
          <div 
            className="absolute inset-0 flex items-center justify-center"
            style={{ 
              paddingLeft: '25%',
              transform: `translate(${gemsPos.textOffsetX}px, ${gemsPos.textOffsetY}px)`,
            }}
          >
            <span 
              className="font-bold text-emerald-800"
              style={{ 
                fontSize: gemsPos.fontSize || (gems >= 10000 ? 11 : gems >= 1000 ? 13 : 14),
                textShadow: '0 1px 0 rgba(255,255,255,0.6)',
                fontFamily: 'system-ui, -apple-system, sans-serif',
                letterSpacing: '-0.3px',
              }}
            >
              {gems.toLocaleString()}
            </span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
