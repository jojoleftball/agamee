import { useState, useRef, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ZoomIn, ZoomOut, Home, Minimize2, ChevronLeft } from 'lucide-react';
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

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.target === containerRef.current || (e.target as HTMLElement).classList.contains('map-viewer-bg')) {
      setIsPanning(true);
      setPanStart({ x: e.clientX - viewport.x, y: e.clientY - viewport.y });
    }
  };

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isPanning) {
      setViewport(prev => ({
        ...prev,
        x: e.clientX - panStart.x,
        y: e.clientY - panStart.y,
      }));
    }
  }, [isPanning, panStart]);

  const handleMouseUp = () => {
    setIsPanning(false);
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

  return (
    <div className="relative w-full h-full overflow-hidden">
      <div
        ref={containerRef}
        className="w-full h-full cursor-grab active:cursor-grabbing map-viewer-bg"
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
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
                className={`absolute cursor-pointer transition-all duration-200 ${
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
            <p className="text-sm mt-2">Open the Map Editor to add pieces</p>
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

          <div className="absolute bottom-4 right-4 flex items-center gap-2 bg-black/50 backdrop-blur-sm rounded-xl p-2">
            <button
              onClick={() => setViewport(prev => ({ ...prev, zoom: Math.max(0.05, prev.zoom * 0.8) }))}
              className="p-2 hover:bg-white/10 text-white rounded-lg"
            >
              <ZoomOut size={20} />
            </button>
            <span className="text-white text-sm w-14 text-center font-mono">
              {Math.round(viewport.zoom * 100)}%
            </span>
            <button
              onClick={() => setViewport(prev => ({ ...prev, zoom: Math.min(2, prev.zoom * 1.25) }))}
              className="p-2 hover:bg-white/10 text-white rounded-lg"
            >
              <ZoomIn size={20} />
            </button>
            <div className="w-px h-6 bg-white/20" />
            <button
              onClick={zoomToFit}
              className="p-2 hover:bg-white/10 text-white rounded-lg"
              title="Fit all"
            >
              <Minimize2 size={20} />
            </button>
            <button
              onClick={() => setViewport({ x: 0, y: 0, zoom: 0.3 })}
              className="p-2 hover:bg-white/10 text-white rounded-lg"
              title="Reset"
            >
              <Home size={20} />
            </button>
          </div>
        </>
      )}
    </div>
  );
}
