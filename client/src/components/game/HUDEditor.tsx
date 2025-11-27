import { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, RotateCcw, Move, Type } from 'lucide-react';
import { useSettingsStore, HUDPositions } from '@/lib/stores/useSettingsStore';

interface DragState {
  element: keyof HUDPositions | null;
  type: 'position' | 'text' | 'resize' | null;
  startX: number;
  startY: number;
  startValue: { x: number; y: number; scale?: number };
}

interface HUDEditorProps {
  isOpen: boolean;
  onClose: () => void;
  level?: number;
  coins?: number;
  gems?: number;
}

export default function HUDEditor({ isOpen, onClose, level = 5, coins = 1250, gems = 45 }: HUDEditorProps) {
  const { hudPositions, setHUDPosition, resetHUDPositions } = useSettingsStore();
  const [selectedElement, setSelectedElement] = useState<keyof HUDPositions | null>(null);
  const [dragState, setDragState] = useState<DragState>({ element: null, type: null, startX: 0, startY: 0, startValue: { x: 0, y: 0 } });
  const [editingText, setEditingText] = useState(false);
  const [levelText, setLevelText] = useState(String(level));
  const [coinsText, setCoinsText] = useState(String(coins));
  const [gemsText, setGemsText] = useState(String(gems));
  const containerRef = useRef<HTMLDivElement>(null);

  const levelPos = hudPositions.levelCircle;
  const coinsPos = hudPositions.coinsBar;
  const gemsPos = hudPositions.gemsBar;

  const startDrag = useCallback((
    e: React.PointerEvent | React.TouchEvent,
    element: keyof HUDPositions,
    type: 'position' | 'text' | 'resize'
  ) => {
    e.stopPropagation();
    e.preventDefault();
    
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    
    const pos = hudPositions[element];
    let startValue: { x: number; y: number; scale?: number };
    
    if (type === 'position') {
      startValue = { x: pos.x, y: pos.y };
    } else if (type === 'text') {
      startValue = { x: pos.textOffsetX, y: pos.textOffsetY };
    } else {
      startValue = { x: clientX, y: clientY, scale: pos.scale };
    }

    setSelectedElement(element);
    setDragState({
      element,
      type,
      startX: clientX,
      startY: clientY,
      startValue
    });
  }, [hudPositions]);

  const handleMove = useCallback((clientX: number, clientY: number) => {
    if (!dragState.element || !dragState.type) return;

    const deltaX = clientX - dragState.startX;
    const deltaY = clientY - dragState.startY;

    if (dragState.type === 'position') {
      setHUDPosition(dragState.element, {
        x: Math.round(dragState.startValue.x + deltaX),
        y: Math.round(dragState.startValue.y + deltaY)
      });
    } else if (dragState.type === 'text') {
      setHUDPosition(dragState.element, {
        textOffsetX: Math.round(dragState.startValue.x + deltaX),
        textOffsetY: Math.round(dragState.startValue.y + deltaY)
      });
    } else if (dragState.type === 'resize') {
      const diagonalDelta = (deltaX + deltaY) / 2;
      const sensitivity = 100;
      const scaleChange = diagonalDelta / sensitivity;
      const newScale = Math.max(0.3, Math.min(5, (dragState.startValue.scale || 1) + scaleChange));
      setHUDPosition(dragState.element, { scale: newScale });
    }
  }, [dragState, setHUDPosition]);

  const endDrag = useCallback(() => {
    setDragState({ element: null, type: null, startX: 0, startY: 0, startValue: { x: 0, y: 0 } });
  }, []);

  useEffect(() => {
    if (!dragState.element) return;

    const handlePointerMove = (e: PointerEvent) => {
      handleMove(e.clientX, e.clientY);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        handleMove(e.touches[0].clientX, e.touches[0].clientY);
      }
    };

    const handleEnd = () => {
      endDrag();
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('pointerup', handleEnd);
    window.addEventListener('touchend', handleEnd);
    window.addEventListener('pointercancel', handleEnd);
    window.addEventListener('touchcancel', handleEnd);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('pointerup', handleEnd);
      window.removeEventListener('touchend', handleEnd);
      window.removeEventListener('pointercancel', handleEnd);
      window.removeEventListener('touchcancel', handleEnd);
    };
  }, [dragState.element, handleMove, endDrag]);

  const handleBackgroundClick = () => {
    if (!dragState.element) {
      setSelectedElement(null);
      setEditingText(false);
    }
  };

  useEffect(() => {
    if (!isOpen) {
      setSelectedElement(null);
      setEditingText(false);
      endDrag();
    }
  }, [isOpen, endDrag]);

  const renderElement = (
    key: keyof HUDPositions,
    imageSrc: string,
    baseWidth: number,
    baseHeight: number,
    pos: typeof levelPos,
    displayValue: string | number,
    textValue: string,
    setTextValue: (val: string) => void,
    textColor: string,
    baseTop: number,
    baseLeft: number
  ) => {
    const isSelected = selectedElement === key;
    const isDragging = dragState.element === key;
    const isTextEditing = editingText && isSelected;
    const width = baseWidth * pos.scale;
    const height = baseHeight * pos.scale;

    return (
      <div
        key={key}
        className="absolute touch-none"
        style={{
          top: baseTop,
          left: baseLeft,
          transform: `translate(${pos.x}px, ${pos.y}px)`,
          zIndex: isSelected ? 10 : 1,
        }}
      >
        <div
          className={`relative transition-shadow ${isSelected ? 'ring-2 ring-blue-500 ring-offset-2 rounded-lg shadow-xl' : ''} ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
          style={{ width, height }}
          onPointerDown={(e) => {
            if (!isTextEditing) {
              setSelectedElement(key);
              setEditingText(false);
              startDrag(e, key, 'position');
            }
          }}
          onTouchStart={(e) => {
            if (!isTextEditing) {
              setSelectedElement(key);
              setEditingText(false);
              startDrag(e, key, 'position');
            }
          }}
        >
          <img
            src={imageSrc}
            alt={key}
            className="w-full h-full object-contain pointer-events-none select-none"
            draggable={false}
          />
          
          <div
            className={`absolute inset-0 flex items-center justify-center ${isTextEditing ? 'ring-2 ring-purple-500 ring-offset-1 rounded' : ''}`}
            style={{
              paddingLeft: key !== 'levelCircle' ? '25%' : 0,
              transform: `translate(${pos.textOffsetX}px, ${pos.textOffsetY}px)`,
            }}
            onPointerDown={(e) => {
              if (isTextEditing) {
                e.stopPropagation();
                startDrag(e, key, 'text');
              }
            }}
            onTouchStart={(e) => {
              if (isTextEditing) {
                e.stopPropagation();
                startDrag(e, key, 'text');
              }
            }}
          >
            {isTextEditing ? (
              <input
                type="text"
                value={textValue}
                onChange={(e) => setTextValue(e.target.value)}
                onPointerDown={(e) => e.stopPropagation()}
                onTouchStart={(e) => e.stopPropagation()}
                className="w-full text-center font-bold bg-purple-100 border-2 border-purple-500 rounded px-1"
                style={{
                  fontSize: pos.fontSize,
                  color: textColor.includes('amber') ? '#92400e' : '#047857',
                }}
                autoFocus
              />
            ) : (
              <span
                className={`font-bold ${textColor} pointer-events-none select-none`}
                style={{
                  fontSize: pos.fontSize,
                  textShadow: '0 1px 0 rgba(255,255,255,0.6)',
                  fontFamily: 'system-ui, -apple-system, sans-serif',
                }}
              >
                {displayValue}
              </span>
            )}
          </div>

          {isSelected && (
            <>
              <div
                className="absolute -bottom-3 -right-3 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center cursor-se-resize shadow-lg border-2 border-white touch-none"
                onPointerDown={(e) => {
                  e.stopPropagation();
                  startDrag(e, key, 'resize');
                }}
                onTouchStart={(e) => {
                  e.stopPropagation();
                  startDrag(e, key, 'resize');
                }}
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M12 2L2 12M12 6L6 12M12 10L10 12" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>

              <div className="absolute -top-10 left-1/2 -translate-x-1/2 flex gap-1 bg-white rounded-full px-2 py-1.5 shadow-lg whitespace-nowrap">
                <div className="flex items-center gap-1 text-xs text-blue-600 font-medium">
                  <Move size={14} />
                  <span>Drag</span>
                </div>
                <div className="w-px bg-gray-300" />
                <button 
                  className={`flex items-center gap-1 text-xs font-medium px-1 rounded ${editingText ? 'bg-purple-100 text-purple-600' : 'text-gray-500'}`}
                  onPointerDown={(e) => {
                    e.stopPropagation();
                    setEditingText(!editingText);
                  }}
                >
                  <Type size={14} />
                  <span>Text</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm touch-none"
        onClick={handleBackgroundClick}
      >
        <div className="absolute top-4 left-0 right-0 flex justify-center pointer-events-none">
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="bg-white/95 backdrop-blur-sm rounded-2xl px-4 py-2 shadow-lg"
          >
            <p className="text-sm font-medium text-gray-700 text-center">
              Tap to select, drag to move
            </p>
            <p className="text-xs text-gray-500 text-center mt-0.5">
              {editingText ? 'Text mode: drag text separately' : 'Use corner handle to resize'}
            </p>
          </motion.div>
        </div>

        <div 
          ref={containerRef}
          className="absolute top-20 left-4 right-4 bottom-24"
        >
          <div className="relative w-full h-full">
            <div className="absolute top-3 left-3">
              {renderElement(
                'levelCircle',
                '/sprites/hud/level-circle.png',
                52,
                52,
                levelPos,
                levelText,
                levelText,
                setLevelText,
                'text-amber-900',
                0,
                0
              )}
              {renderElement(
                'coinsBar',
                '/sprites/hud/coins-bar.png',
                110,
                36,
                coinsPos,
                coinsText,
                coinsText,
                setCoinsText,
                'text-amber-800',
                8,
                44
              )}
              {renderElement(
                'gemsBar',
                '/sprites/hud/gems-bar.png',
                110,
                36,
                gemsPos,
                gemsText,
                gemsText,
                setGemsText,
                'text-emerald-800',
                8,
                146
              )}
            </div>
          </div>
        </div>

        <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-3 px-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={(e) => {
              e.stopPropagation();
              resetHUDPositions();
              setSelectedElement(null);
            }}
            className="flex items-center gap-2 px-5 py-3 bg-white/95 backdrop-blur-sm rounded-xl shadow-lg text-gray-700 font-medium"
          >
            <RotateCcw size={20} />
            Reset
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="flex items-center gap-2 px-6 py-3 bg-green-500 rounded-xl shadow-lg text-white font-bold"
          >
            <Check size={20} />
            Done
          </motion.button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
