import { useState, useRef, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ZoomIn, ZoomOut, Minimize2, ChevronLeft, Focus } from 'lucide-react';
import { useMapEditorStore } from '@/lib/stores/useMapEditorStore';

interface WorldMapViewerProps {
  onSelectLocation?: (pieceId: string) => void;
  onClose?: () => void;
  showControls?: boolean;
}

export default function WorldMapViewer({ onSelectLocation, onClose, showControls = true }: WorldMapViewerProps) {
  const { pieces, getMapBounds } = useMapEditorStore();
  
  const [viewport, setViewport] = useState({ x: 0, y: 0, zoom: 0.3 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [hoveredPiece, setHoveredPiece] = useState<string | null>(null);
  const [touchStartDistance, setTouchStartDistance] = useState<number | null>(null);
  const [touchStartZoom, setTouchStartZoom] = useState(1);
  const [lastTouchCenter, setLastTouchCenter] = useState<{ x: number; y: number } | null>(null);
  
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    zoomToFit();
  }, [pieces]);

  const zoomToFit = () => {
    const bounds = getMapBounds();
    if (bounds.width === 0 || bounds.height === 0) return;
    
    const padding = 60;
    const viewportWidth = (containerRef.current?.clientWidth || window.innerWidth) - padding * 2;
    const viewportHeight = (containerRef.current?.clientHeight || window.innerHeight) - padding * 2;
    
    const scaleX = viewportWidth / bounds.width;
    const scaleY = viewportHeight / bounds.height;
    const zoom = Math.min(scaleX, scaleY, 1);
    
    const centerX = bounds.minX + bounds.width / 2;
    const centerY = bounds.minY + bounds.height / 2;
    
    const containerWidth = containerRef.current?.clientWidth || window.innerWidth;
    const containerHeight = containerRef.current?.clientHeight || window.innerHeight;
    
    setViewport({
      x: containerWidth / 2 - centerX * zoom,
      y: containerHeight / 2 - centerY * zoom,
      zoom,
    });
  };

  const getEventPosition = (e: React.MouseEvent | React.TouchEvent) => {
    if ('touches' in e && e.touches.length > 0) {
      return { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
    if ('clientX' in e) {
      return { x: e.clientX, y: e.clientY };
    }
    return { x: 0, y: 0 };
  };

  const getTouchDistance = (touches: React.TouchList) => {
    if (touches.length < 2) return null;
    const dx = touches[0].clientX - touches[1].clientX;
    const dy = touches[0].clientY - touches[1].clientY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  const getTouchCenter = (touches: React.TouchList) => {
    if (touches.length < 2) return null;
    return {
      x: (touches[0].clientX + touches[1].clientX) / 2,
      y: (touches[0].clientY + touches[1].clientY) / 2,
    };
  };

  const handleStart = (e: React.MouseEvent | React.TouchEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest('.map-piece')) return;

    if ('touches' in e && e.touches.length === 2) {
      const distance = getTouchDistance(e.touches);
      const center = getTouchCenter(e.touches);
      setTouchStartDistance(distance);
      setTouchStartZoom(viewport.zoom);
      setLastTouchCenter(center);
      return;
    }

    setIsPanning(true);
    const pos = getEventPosition(e);
    setPanStart({ x: pos.x - viewport.x, y: pos.y - viewport.y });
  };

  const handleMove = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if ('touches' in e && e.touches.length === 2) {
      e.preventDefault();
      const distance = getTouchDistance(e.touches);
      const center = getTouchCenter(e.touches);
      
      if (distance && touchStartDistance && center && lastTouchCenter) {
        const scale = distance / touchStartDistance;
        const newZoom = Math.max(0.1, Math.min(2, touchStartZoom * scale));
        
        const dx = center.x - lastTouchCenter.x;
        const dy = center.y - lastTouchCenter.y;
        
        setViewport(prev => ({
          x: prev.x + dx,
          y: prev.y + dy,
          zoom: newZoom
        }));
        setLastTouchCenter(center);
      }
      return;
    }

    if (isPanning) {
      const pos = getEventPosition(e);
      setViewport(prev => ({
        ...prev,
        x: pos.x - panStart.x,
        y: pos.y - panStart.y,
      }));
    }
  }, [isPanning, panStart, touchStartDistance, touchStartZoom, lastTouchCenter]);

  const handleEnd = () => {
    setIsPanning(false);
    setTouchStartDistance(null);
    setLastTouchCenter(null);
  };

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    
    const containerRect = containerRef.current?.getBoundingClientRect();
    if (!containerRect) return;

    const mouseX = e.clientX - containerRect.left;
    const mouseY = e.clientY - containerRect.top;
    
    const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;
    const newZoom = Math.max(0.05, Math.min(2, viewport.zoom * zoomFactor));
    
    const worldX = (mouseX - viewport.x) / viewport.zoom;
    const worldY = (mouseY - viewport.y) / viewport.zoom;
    
    const newX = mouseX - worldX * newZoom;
    const newY = mouseY - worldY * newZoom;
    
    setViewport({ x: newX, y: newY, zoom: newZoom });
  }, [viewport]);

  const handlePieceClick = (pieceId: string) => {
    if (onSelectLocation) {
      onSelectLocation(pieceId);
    }
  };

  const handleZoom = (direction: 'in' | 'out') => {
    const containerRect = containerRef.current?.getBoundingClientRect();
    if (!containerRect) return;
    
    const centerX = containerRect.width / 2;
    const centerY = containerRect.height / 2;
    
    const zoomFactor = direction === 'in' ? 1.3 : 0.7;
    const newZoom = Math.max(0.05, Math.min(2, viewport.zoom * zoomFactor));
    
    const worldX = (centerX - viewport.x) / viewport.zoom;
    const worldY = (centerY - viewport.y) / viewport.zoom;
    
    const newX = centerX - worldX * newZoom;
    const newY = centerY - worldY * newZoom;
    
    setViewport({ x: newX, y: newY, zoom: newZoom });
  };

  return (
    <div className="relative w-full h-full overflow-hidden touch-none">
      <div
        ref={containerRef}
        className="w-full h-full cursor-grab active:cursor-grabbing map-viewer-bg"
        onWheel={handleWheel}
        onMouseDown={handleStart}
        onMouseMove={handleMove}
        onMouseUp={handleEnd}
        onMouseLeave={handleEnd}
        onTouchStart={handleStart}
        onTouchMove={handleMove}
        onTouchEnd={handleEnd}
        style={{
          background: `radial-gradient(ellipse at center, #1e3a5f 0%, #0f172a 70%, #000 100%)`,
        }}
      >
        <div
          className="absolute"
          style={{
            transform: `translate(${viewport.x}px, ${viewport.y}px) scale(${viewport.zoom})`,
            transformOrigin: '0 0'
          }}
        >
          {pieces
            .slice()
            .sort((a, b) => a.zIndex - b.zIndex)
            .map(piece => (
              <motion.div
                key={piece.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`absolute cursor-pointer transition-all duration-200 map-piece ${
                  hoveredPiece === piece.id 
                    ? 'ring-4 ring-emerald-400 shadow-2xl' 
                    : ''
                }`}
                style={{
                  left: piece.x,
                  top: piece.y,
                  width: piece.width,
                  height: piece.height,
                  filter: hoveredPiece === piece.id ? 'brightness(1.1)' : 'brightness(1)',
                }}
                onMouseEnter={() => setHoveredPiece(piece.id)}
                onMouseLeave={() => setHoveredPiece(null)}
                onClick={() => handlePieceClick(piece.id)}
                onTouchEnd={(e) => {
                  e.stopPropagation();
                  handlePieceClick(piece.id);
                }}
              >
                <img
                  src={piece.imagePath}
                  alt={piece.name}
                  className="w-full h-full object-cover pointer-events-none"
                  draggable={false}
                />
                
                {hoveredPiece === piece.id && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-black/90 text-white px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap"
                  >
                    {piece.name}
                  </motion.div>
                )}
              </motion.div>
            ))}
        </div>

        {pieces.length === 0 && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-500">
            <p className="text-lg">No map pieces available</p>
            <p className="text-sm mt-2">Open the Map Builder to add pieces</p>
          </div>
        )}
      </div>

      {showControls && (
        <>
          {onClose && (
            <button
              onClick={onClose}
              className="absolute top-4 left-4 flex items-center gap-2 px-4 py-2 bg-black/50 hover:bg-black/70 backdrop-blur-sm text-white rounded-xl font-medium transition-colors"
            >
              <ChevronLeft size={20} />
              Back
            </button>
          )}

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-black/60 backdrop-blur-sm rounded-2xl p-2">
            <button
              onClick={() => handleZoom('out')}
              className="w-12 h-12 flex items-center justify-center hover:bg-white/10 text-white rounded-xl transition-colors"
            >
              <ZoomOut size={22} />
            </button>
            <div className="text-white text-sm w-14 text-center font-medium">
              {Math.round(viewport.zoom * 100)}%
            </div>
            <button
              onClick={() => handleZoom('in')}
              className="w-12 h-12 flex items-center justify-center hover:bg-white/10 text-white rounded-xl transition-colors"
            >
              <ZoomIn size={22} />
            </button>
            <div className="w-px h-8 bg-white/20" />
            <button
              onClick={zoomToFit}
              className="w-12 h-12 flex items-center justify-center hover:bg-white/10 text-white rounded-xl transition-colors"
              title="Fit all"
            >
              <Focus size={22} />
            </button>
          </div>
        </>
      )}
    </div>
  );
}
