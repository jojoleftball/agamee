import { useMergeGameStore } from '@/lib/stores/useMergeGameStore';
import { MERGE_ITEMS } from '@/lib/mergeData';
import { BoardItem } from '@/lib/mergeData';
import { Zap } from 'lucide-react';

const SPRITE_MAP: Record<string, string> = {
  flowers: '/game-assets/flower_merge_progression_sprites.png',
  vegetables: '/game-assets/vegetable_merge_progression_sprites.png',
  trees: '/game-assets/tree_merge_progression_sprites.png',
  tools: '/game-assets/garden_tool_merge_sprites.png',
  decorations: '/game-assets/garden_decoration_merge_sprites.png',
  generators: '/game-assets/generator_producer_items_sprites.png',
  blocked: '/game-assets/blocked_tiles_obstacle_sprites.png'
};

interface MergeBoardItemProps {
  item: BoardItem;
  position: { x: number; y: number };
  size: number;
  isDragging: boolean;
  dragOffset: { x: number; y: number };
  onPointerDown: (e: React.PointerEvent) => void;
  onTap: () => void;
}

export default function MergeBoardItem({
  item,
  position,
  size,
  isDragging,
  dragOffset,
  onPointerDown,
  onTap
}: MergeBoardItemProps) {
  const itemData = MERGE_ITEMS[item.itemType];
  
  if (!itemData) return null;

  const spriteImage = SPRITE_MAP[itemData.sprite];
  const isGenerator = itemData.isGenerator;
  const hasCharges = isGenerator && item.charges && item.charges > 0;

  const style: React.CSSProperties = isDragging
    ? {
        left: position.x - dragOffset.x,
        top: position.y - dragOffset.y,
        width: size,
        height: size,
        zIndex: 1000,
        transform: 'scale(1.1)',
        transition: 'none'
      }
    : {
        left: position.x,
        top: position.y,
        width: size,
        height: size,
        transition: 'left 0.2s ease-out, top 0.2s ease-out'
      };

  return (
    <div
      className={`absolute cursor-grab active:cursor-grabbing touch-none select-none ${
        isDragging ? 'opacity-90 shadow-2xl' : 'shadow-lg'
      } ${isGenerator ? 'ring-2 ring-purple-400' : ''}`}
      style={style}
      onPointerDown={onPointerDown}
      onClick={() => !isDragging && onTap()}
    >
      <div className="relative w-full h-full bg-white rounded-xl overflow-hidden border-2 border-gray-300">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url(${spriteImage})`,
            backgroundPosition: `-${itemData.spriteX}px -${itemData.spriteY}px`,
            backgroundSize: `auto ${size}px`,
            backgroundRepeat: 'no-repeat',
            imageRendering: 'crisp-edges'
          }}
        />
        
        {isGenerator && (
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-purple-900/90 to-transparent p-1">
            <div className="flex items-center justify-center gap-1">
              <Zap className="w-3 h-3 text-yellow-300 fill-yellow-300" />
              <span className="text-white text-xs font-bold">{item.charges || 0}</span>
            </div>
          </div>
        )}
        
        <div className="absolute top-0 right-0 bg-blue-500 text-white text-xs font-bold px-1 rounded-bl">
          {itemData.level}
        </div>

        {itemData.isBlocked && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <div className="text-white text-xs font-bold">Blocked</div>
          </div>
        )}
      </div>
    </div>
  );
}
