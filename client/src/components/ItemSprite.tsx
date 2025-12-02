import { PLANT_DEFINITIONS } from '../data/plantData';
import { TOOL_DEFINITIONS } from '../data/plantData';
import type { BoardItem } from '../types/game';

interface ItemSpriteProps {
  item: BoardItem;
  size?: number;
  showRank?: boolean;
}

export default function ItemSprite({ item, size = 80, showRank = true }: ItemSpriteProps) {
  const getItemDisplay = () => {
    if (item.category === 'plant') {
      const plant = PLANT_DEFINITIONS[item.itemType as keyof typeof PLANT_DEFINITIONS];
      if (plant) {
        return {
          icon: plant.name.charAt(0).toUpperCase(),
          color: plant.color,
          name: plant.name,
        };
      }
    }
    
    if (item.category === 'tool') {
      const tool = TOOL_DEFINITIONS[item.itemType];
      if (tool) {
        return {
          icon: tool.name.charAt(0).toUpperCase(),
          color: tool.color,
          name: tool.name,
        };
      }
    }
    
    if (item.category === 'generator') {
      return {
        icon: 'G',
        color: '#8b5cf6',
        name: 'Generator',
      };
    }
    
    return {
      icon: '?',
      color: '#6b7280',
      name: 'Unknown',
    };
  };

  const display = getItemDisplay();
  const rankScale = 1 + (item.rank - 1) * 0.1;

  return (
    <div 
      className="relative flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      <div 
        className="absolute inset-0 rounded-lg shadow-lg transition-transform hover:scale-105"
        style={{
          background: `linear-gradient(135deg, ${display.color}dd, ${display.color}88)`,
          border: `3px solid ${display.color}`,
        }}
      />
      
      <div 
        className="relative z-10 text-center text-white font-bold"
        style={{ fontSize: `${size * 0.4 * rankScale}px` }}
      >
        {display.icon}
      </div>
      
      {showRank && (
        <div 
          className="absolute bottom-1 right-1 px-2 py-0.5 rounded-full text-xs font-bold text-white shadow-md z-20"
          style={{ backgroundColor: display.color }}
        >
          R{item.rank}
        </div>
      )}
      
      {item.category === 'generator' && item.charges !== undefined && (
        <div className="absolute top-1 left-1 px-1.5 py-0.5 bg-white/90 rounded-full text-xs font-bold text-gray-700 shadow-md z-20">
          {item.charges}
        </div>
      )}
    </div>
  );
}
