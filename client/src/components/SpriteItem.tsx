import { MergeItem, MERGE_ITEMS } from '@/lib/mergeItems';

interface SpriteItemProps {
  itemType: string;
  size?: number;
  onClick?: () => void;
  draggable?: boolean;
  className?: string;
}

export default function SpriteItem({ itemType, size = 64, onClick, draggable = false, className = '' }: SpriteItemProps) {
  const item: MergeItem = MERGE_ITEMS[itemType];
  
  if (!item) {
    return (
      <div 
        className={`bg-gray-300 rounded-lg ${className}`}
        style={{ width: size, height: size }}
      />
    );
  }

  const spriteWidth = size * 5;
  const spriteX = -(item.spriteIndex * size);

  return (
    <div
      className={`relative cursor-pointer ${className}`}
      style={{ width: size, height: size }}
      onClick={onClick}
      draggable={draggable}
    >
      <div
        className="absolute inset-0 bg-no-repeat"
        style={{
          backgroundImage: `url(${item.spriteSheet})`,
          backgroundSize: `${spriteWidth}px ${size}px`,
          backgroundPosition: `${spriteX}px 0px`,
          imageRendering: 'crisp-edges'
        }}
      />
      <div className="absolute bottom-0 right-0 bg-black/60 text-white text-xs px-1 rounded-tl">
        Lv.{item.level}
      </div>
    </div>
  );
}
