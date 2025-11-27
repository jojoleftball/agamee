import { motion } from 'framer-motion';

interface GardenHUDProps {
  level: number;
  coins: number;
  gems: number;
}

export default function GardenHUD({ level, coins, gems }: GardenHUDProps) {
  return (
    <div className="absolute top-3 left-3 flex items-start gap-1 z-30">
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1, type: 'spring', stiffness: 300 }}
        className="relative flex-shrink-0"
        style={{ width: 52, height: 52 }}
      >
        <img
          src="/sprites/hud/level-circle.png"
          alt="Level"
          className="w-full h-full object-contain"
          draggable={false}
        />
        <div 
          className="absolute inset-0 flex items-center justify-center"
          style={{ paddingBottom: 2 }}
        >
          <span 
            className="font-bold text-amber-900 drop-shadow-sm"
            style={{ 
              fontSize: level >= 100 ? 14 : level >= 10 ? 18 : 22,
              textShadow: '0 1px 0 rgba(255,255,255,0.5)',
              fontFamily: 'system-ui, -apple-system, sans-serif',
              letterSpacing: '-0.5px',
            }}
          >
            {level}
          </span>
        </div>
      </motion.div>

      <motion.div
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.2, type: 'spring', stiffness: 300 }}
        className="relative flex-shrink-0"
        style={{ width: 110, height: 36, marginTop: 8, marginLeft: -8 }}
      >
        <img
          src="/sprites/hud/coins-bar.png"
          alt="Coins"
          className="w-full h-full object-contain"
          draggable={false}
        />
        <div 
          className="absolute flex items-center justify-center"
          style={{ 
            top: '50%',
            left: '50%',
            transform: 'translate(-25%, -50%)',
            width: '55%',
          }}
        >
          <span 
            className="font-bold text-amber-800"
            style={{ 
              fontSize: coins >= 10000 ? 11 : coins >= 1000 ? 13 : 14,
              textShadow: '0 1px 0 rgba(255,255,255,0.6)',
              fontFamily: 'system-ui, -apple-system, sans-serif',
              letterSpacing: '-0.3px',
            }}
          >
            {coins.toLocaleString()}
          </span>
        </div>
      </motion.div>

      <motion.div
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.3, type: 'spring', stiffness: 300 }}
        className="relative flex-shrink-0"
        style={{ width: 110, height: 36, marginTop: 8, marginLeft: -8 }}
      >
        <img
          src="/sprites/hud/gems-bar.png"
          alt="Gems"
          className="w-full h-full object-contain"
          draggable={false}
        />
        <div 
          className="absolute flex items-center justify-center"
          style={{ 
            top: '50%',
            left: '50%',
            transform: 'translate(-20%, -50%)',
            width: '50%',
          }}
        >
          <span 
            className="font-bold text-emerald-800"
            style={{ 
              fontSize: gems >= 10000 ? 11 : gems >= 1000 ? 13 : 14,
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
  );
}
