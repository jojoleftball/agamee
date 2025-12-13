import { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  Upload, Trash2, Lock, Unlock, Move, 
  ZoomIn, ZoomOut, Image, X, 
  ChevronLeft, Save, Layers, Focus
} from 'lucide-react';
import { useMapEditorStore, MapPiece } from '@/lib/stores/useMapEditorStore';

interface PendingPiece {
  id: string;
  name: string;
  imagePath: string;
  width: number;
  height: number;
  thumbnail: string;
}

export default function MapBuilder({ onClose }: { onClose: () => void }) {
  const {
    pieces,
    selectedPieceId,
    viewport,
    addPiece,
    updatePiece,
    removePiece,
    selectPiece,
    setViewport,
    zoomToFit,
    getMapBounds,
  } = useMapEditorStore();

  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [isResizing, setIsResizing] = useState(false);
  const [resizeHandle, setResizeHandle] = useState<string | null>(null);
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const [uploadingImage, setUploadingImage] = useState(false);
  const [pendingPieces, setPendingPieces] = useState<PendingPiece[]>([]);
  const [touchStartDistance, setTouchStartDistance] = useState<number | null>(null);
  const [touchStartZoom, setTouchStartZoom] = useState(1);
  const [lastTouchCenter, setLastTouchCenter] = useState<{ x: number; y: number } | null>(null);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const selectedPiece = pieces.find(p => p.id === selectedPieceId);

  const defaultMaps = useMemo(() => [
    { name: 'World Map Overview', path: '/game-assets/world-map-overview.jpg' },
    { name: 'Garden World Map', path: '/game-assets/garden_world_map_background.png' },
    { name: 'Garden World Map Fog', path: '/game-assets/garden-world-map-fog.jpg' },
    { name: 'Middle Garden View', path: '/game-assets/middle-garden-view.jpg' },
    { name: 'Basic Garden', path: '/game-assets/basic_garden_background_vertical.png' },
    { name: 'Tropical Garden', path: '/game-assets/tropical_garden_background_vertical.png' },
    { name: 'Zen Garden', path: '/game-assets/zen_garden_background_vertical.png' },
    { name: 'Desert Garden', path: '/game-assets/desert_garden_background_vertical.png' },
    { name: 'Winter Garden', path: '/game-assets/winter_garden_background_vertical.png' },
  ], []);

  useEffect(() => {
    if (pieces.length === 0) {
      const loadDefaultMaps = async () => {
        let xOffset = 0;
        
        for (let i = 0; i < defaultMaps.length; i++) {
          const map = defaultMaps[i];
          
          const img = document.createElement('img');
          img.src = map.path;
          
          await new Promise<void>((resolve) => {
            img.onload = () => {
              const newPiece: MapPiece = {
                id: `default_${i}_${Date.now()}`,
                name: map.name,
                imagePath: map.path,
                x: xOffset,
                y: 0,
                width: img.width,
                height: img.height,
                originalWidth: img.width,
                originalHeight: img.height,
                scale: 1,
                zIndex: i,
                isLocked: false,
                connections: [],
              };
              
              addPiece(newPiece);
              xOffset += img.width + 50;
              resolve();
            };
            
            img.onerror = () => {
              console.warn(`Failed to load image: ${map.path}`);
              resolve();
            };
          });
        }
        
        setTimeout(() => zoomToFit(0.3), 200);
      };
      
      loadDefaultMaps();
    } else {
      setTimeout(() => zoomToFit(0.6), 100);
    }
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingImage(true);

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      await processImageFile(file);
    }

    setUploadingImage(false);

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const processImageFile = async (file: File): Promise<void> => {
    return new Promise((resolve) => {
      const img = document.createElement('img');
      const reader = new FileReader();

      reader.onload = async (event) => {
        img.onload = async () => {
          const formData = new FormData();
          formData.append('sprite', file);

          try {
            const response = await fetch('/api/upload', {
              method: 'POST',
              body: formData,
            });

            const data = await response.json();
            if (data.success) {
              const canvas = document.createElement('canvas');
              const ctx = canvas.getContext('2d');
              const thumbSize = 80;
              const scale = Math.min(thumbSize / img.width, thumbSize / img.height);
              canvas.width = img.width * scale;
              canvas.height = img.height * scale;
              ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
              
              const pending: PendingPiece = {
                id: `pending_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                name: file.name.replace(/\.[^/.]+$/, ''),
                imagePath: data.path,
                width: img.width,
                height: img.height,
                thumbnail: canvas.toDataURL(),
              };
              
              setPendingPieces(prev => [...prev, pending]);
            }
          } catch (err) {
            console.error('Upload error:', err);
          }
          resolve();
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    });
  };

  const placePendingPiece = useCallback((pending: PendingPiece) => {
    const bounds = getMapBounds();
    let startX = 0;
    let startY = 0;
    
    if (bounds.width > 0) {
      startX = bounds.maxX + 100;
      startY = bounds.minY;
    }

    const newPiece: MapPiece = {
      id: `piece_${Date.now()}`,
      name: pending.name,
      imagePath: pending.imagePath,
      x: startX,
      y: startY,
      width: pending.width,
      height: pending.height,
      originalWidth: pending.width,
      originalHeight: pending.height,
      scale: 1,
      zIndex: pieces.length,
      isLocked: false,
      connections: [],
    };
    
    addPiece(newPiece);
    setPendingPieces(prev => prev.filter(p => p.id !== pending.id));
    selectPiece(newPiece.id);
    
    setTimeout(() => zoomToFit(0.6), 100);
  }, [addPiece, getMapBounds, pieces.length, selectPiece, zoomToFit]);

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

  const handlePieceStart = (e: React.MouseEvent | React.TouchEvent, piece: MapPiece) => {
    e.stopPropagation();
    if (piece.isLocked) return;
    
    selectPiece(piece.id);
    setIsDragging(true);
    
    const pos = getEventPosition(e);
    const containerRect = containerRef.current?.getBoundingClientRect();
    if (containerRect) {
      const worldX = (pos.x - containerRect.left - viewport.x) / viewport.zoom;
      const worldY = (pos.y - containerRect.top - viewport.y) / viewport.zoom;
      setDragOffset({
        x: worldX - piece.x,
        y: worldY - piece.y
      });
    }
  };

  const handleResizeStart = (e: React.MouseEvent | React.TouchEvent, handle: string) => {
    e.stopPropagation();
    if (selectedPiece?.isLocked) return;
    
    setIsResizing(true);
    setResizeHandle(handle);
    
    const pos = getEventPosition(e);
    setResizeStart({
      x: pos.x,
      y: pos.y,
      width: selectedPiece?.width || 0,
      height: selectedPiece?.height || 0,
    });
  };

  const handleCanvasStart = (e: React.MouseEvent | React.TouchEvent) => {
    const target = e.target as HTMLElement;
    if (target === containerRef.current || target.classList.contains('canvas-background')) {
      if ('touches' in e && e.touches.length === 2) {
        const distance = getTouchDistance(e.touches);
        const center = getTouchCenter(e.touches);
        setTouchStartDistance(distance);
        setTouchStartZoom(viewport.zoom);
        setLastTouchCenter(center);
        return;
      }
      
      selectPiece(null);
      setIsPanning(true);
      const pos = getEventPosition(e);
      setPanStart({ x: pos.x - viewport.x, y: pos.y - viewport.y });
    }
  };

  const handleMove = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    const pos = getEventPosition(e);
    const containerRect = containerRef.current?.getBoundingClientRect();
    if (!containerRect) return;

    if ('touches' in e && e.touches.length === 2) {
      e.preventDefault();
      const distance = getTouchDistance(e.touches);
      const center = getTouchCenter(e.touches);
      
      if (distance && touchStartDistance && center && lastTouchCenter) {
        const scale = distance / touchStartDistance;
        const newZoom = Math.max(0.1, Math.min(3, touchStartZoom * scale));
        
        const dx = center.x - lastTouchCenter.x;
        const dy = center.y - lastTouchCenter.y;
        
        setViewport({
          x: viewport.x + dx,
          y: viewport.y + dy,
          zoom: newZoom
        });
        setLastTouchCenter(center);
      }
      return;
    }

    if (isDragging && selectedPiece) {
      const worldX = (pos.x - containerRect.left - viewport.x) / viewport.zoom;
      const worldY = (pos.y - containerRect.top - viewport.y) / viewport.zoom;
      
      updatePiece(selectedPiece.id, {
        x: worldX - dragOffset.x,
        y: worldY - dragOffset.y
      });
    } else if (isResizing && selectedPiece && resizeHandle) {
      const dx = (pos.x - resizeStart.x) / viewport.zoom;
      const dy = (pos.y - resizeStart.y) / viewport.zoom;
      
      let newWidth = resizeStart.width;
      let newHeight = resizeStart.height;
      let newX = selectedPiece.x;
      let newY = selectedPiece.y;
      
      if (resizeHandle.includes('e')) newWidth = Math.max(50, resizeStart.width + dx);
      if (resizeHandle.includes('w')) {
        newWidth = Math.max(50, resizeStart.width - dx);
        newX = selectedPiece.x + (resizeStart.width - newWidth);
      }
      if (resizeHandle.includes('s')) newHeight = Math.max(50, resizeStart.height + dy);
      if (resizeHandle.includes('n')) {
        newHeight = Math.max(50, resizeStart.height - dy);
        newY = selectedPiece.y + (resizeStart.height - newHeight);
      }
      
      updatePiece(selectedPiece.id, { 
        width: newWidth, 
        height: newHeight,
        x: newX,
        y: newY,
        scale: newWidth / selectedPiece.originalWidth 
      });
    } else if (isPanning) {
      setViewport({
        ...viewport,
        x: pos.x - panStart.x,
        y: pos.y - panStart.y
      });
    }
  }, [isDragging, isResizing, isPanning, selectedPiece, viewport, dragOffset, resizeHandle, resizeStart, panStart, touchStartDistance, touchStartZoom, lastTouchCenter, updatePiece, setViewport]);

  const handleEnd = () => {
    setIsDragging(false);
    setIsResizing(false);
    setIsPanning(false);
    setResizeHandle(null);
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
    const newZoom = Math.max(0.1, Math.min(3, viewport.zoom * zoomFactor));
    
    const worldX = (mouseX - viewport.x) / viewport.zoom;
    const worldY = (mouseY - viewport.y) / viewport.zoom;
    
    const newX = mouseX - worldX * newZoom;
    const newY = mouseY - worldY * newZoom;
    
    setViewport({ x: newX, y: newY, zoom: newZoom });
  }, [viewport, setViewport]);

  const handleZoom = (direction: 'in' | 'out') => {
    const containerRect = containerRef.current?.getBoundingClientRect();
    if (!containerRect) return;
    
    const centerX = containerRect.width / 2;
    const centerY = containerRect.height / 2;
    
    const zoomFactor = direction === 'in' ? 1.3 : 0.7;
    const newZoom = Math.max(0.1, Math.min(3, viewport.zoom * zoomFactor));
    
    const worldX = (centerX - viewport.x) / viewport.zoom;
    const worldY = (centerY - viewport.y) / viewport.zoom;
    
    const newX = centerX - worldX * newZoom;
    const newY = centerY - worldY * newZoom;
    
    setViewport({ x: newX, y: newY, zoom: newZoom });
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Delete' && selectedPiece && !selectedPiece.isLocked) {
        removePiece(selectedPiece.id);
      }
      if (e.key === 'Escape') {
        selectPiece(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedPiece, removePiece, selectPiece]);

  const bounds = getMapBounds();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-slate-900 z-[200] flex flex-col touch-none"
    >
      <div className="h-14 bg-slate-800 border-b border-slate-700 px-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="flex items-center gap-2 px-3 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-sm font-medium transition-colors"
          >
            <ChevronLeft size={18} />
            Back
          </button>
          <div className="w-px h-6 bg-slate-600" />
          <h1 className="text-lg font-semibold text-white">World Map Builder</h1>
        </div>

        <div className="flex items-center gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileUpload}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploadingImage}
            className="flex items-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
          >
            <Upload size={18} />
            {uploadingImage ? 'Uploading...' : 'Add Map Piece'}
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {pendingPieces.length > 0 && (
          <div className="w-48 bg-slate-800 border-r border-slate-700 p-3 overflow-y-auto shrink-0">
            <h3 className="text-sm font-medium text-slate-300 mb-3">New Pieces</h3>
            <div className="space-y-2">
              {pendingPieces.map(pending => (
                <div
                  key={pending.id}
                  className="bg-slate-700 rounded-lg p-2 cursor-pointer hover:bg-slate-600 transition-colors"
                  onClick={() => placePendingPiece(pending)}
                >
                  <img
                    src={pending.thumbnail}
                    alt={pending.name}
                    className="w-full h-20 object-contain bg-slate-900 rounded mb-2"
                  />
                  <p className="text-xs text-white truncate">{pending.name}</p>
                  <p className="text-xs text-slate-400">{pending.width} x {pending.height}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex-1 relative overflow-hidden bg-slate-950">
          <div
            ref={containerRef}
            className="absolute inset-0 canvas-background cursor-grab active:cursor-grabbing"
            style={{
              backgroundImage: `
                radial-gradient(circle at 1px 1px, rgba(100, 116, 139, 0.3) 1px, transparent 0)
              `,
              backgroundSize: `${30 * viewport.zoom}px ${30 * viewport.zoom}px`,
              backgroundPosition: `${viewport.x}px ${viewport.y}px`,
            }}
            onMouseDown={handleCanvasStart}
            onMouseMove={handleMove}
            onMouseUp={handleEnd}
            onMouseLeave={handleEnd}
            onTouchStart={handleCanvasStart}
            onTouchMove={handleMove}
            onTouchEnd={handleEnd}
            onWheel={handleWheel}
          >
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none"
              style={{ overflow: 'visible' }}
            >
              <g transform={`translate(${viewport.x}, ${viewport.y}) scale(${viewport.zoom})`}>
                {pieces
                  .slice()
                  .sort((a, b) => a.zIndex - b.zIndex)
                  .map(piece => (
                    <g key={piece.id}>
                      <foreignObject
                        x={piece.x}
                        y={piece.y}
                        width={piece.width}
                        height={piece.height}
                        style={{ overflow: 'visible', pointerEvents: 'auto' }}
                      >
                        <div
                          className={`w-full h-full relative ${
                            selectedPieceId === piece.id
                              ? 'ring-4 ring-cyan-400'
                              : ''
                          } ${piece.isLocked ? 'opacity-80' : ''}`}
                          onMouseDown={(e) => handlePieceStart(e, piece)}
                          onTouchStart={(e) => handlePieceStart(e, piece)}
                        >
                          <img
                            src={piece.imagePath}
                            alt={piece.name}
                            className="w-full h-full object-fill select-none"
                            draggable={false}
                          />
                          
                          {piece.isLocked && (
                            <div className="absolute top-2 right-2 bg-black/50 p-1 rounded">
                              <Lock size={16} className="text-white" />
                            </div>
                          )}
                        </div>
                      </foreignObject>
                      
                      {selectedPieceId === piece.id && !piece.isLocked && (
                        <>
                          {['nw', 'ne', 'sw', 'se'].map(handle => {
                            const x = handle.includes('w') ? piece.x - 12 : piece.x + piece.width - 12;
                            const y = handle.includes('n') ? piece.y - 12 : piece.y + piece.height - 12;
                            return (
                              <foreignObject
                                key={handle}
                                x={x}
                                y={y}
                                width={24}
                                height={24}
                                style={{ overflow: 'visible', pointerEvents: 'auto' }}
                              >
                                <div
                                  className="w-full h-full bg-cyan-500 rounded-full cursor-pointer hover:bg-cyan-400 border-2 border-white shadow-lg"
                                  onMouseDown={(e) => handleResizeStart(e, handle)}
                                  onTouchStart={(e) => handleResizeStart(e, handle)}
                                />
                              </foreignObject>
                            );
                          })}
                        </>
                      )}
                    </g>
                  ))}
              </g>
            </svg>
          </div>

          <div className="absolute bottom-4 left-4 flex gap-2">
            <button
              onClick={() => handleZoom('out')}
              className="w-12 h-12 bg-slate-800 hover:bg-slate-700 text-white rounded-xl flex items-center justify-center shadow-lg transition-colors"
            >
              <ZoomOut size={22} />
            </button>
            <button
              onClick={() => handleZoom('in')}
              className="w-12 h-12 bg-slate-800 hover:bg-slate-700 text-white rounded-xl flex items-center justify-center shadow-lg transition-colors"
            >
              <ZoomIn size={22} />
            </button>
            <button
              onClick={() => zoomToFit(0.6)}
              className="w-12 h-12 bg-slate-800 hover:bg-slate-700 text-white rounded-xl flex items-center justify-center shadow-lg transition-colors"
            >
              <Focus size={22} />
            </button>
          </div>

          <div className="absolute bottom-4 right-4 bg-slate-800/90 text-slate-300 px-3 py-1.5 rounded-lg text-sm">
            {Math.round(viewport.zoom * 100)}% | {pieces.length} pieces
          </div>
        </div>

        {selectedPiece && (
          <div className="w-64 bg-slate-800 border-l border-slate-700 p-4 shrink-0">
            <h3 className="text-sm font-medium text-slate-300 mb-4">Selected Piece</h3>
            
            <div className="space-y-4">
              <div>
                <img
                  src={selectedPiece.imagePath}
                  alt={selectedPiece.name}
                  className="w-full h-32 object-contain bg-slate-900 rounded-lg"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400">Name</label>
                <input
                  type="text"
                  value={selectedPiece.name}
                  onChange={(e) => updatePiece(selectedPiece.id, { name: e.target.value })}
                  className="w-full bg-slate-700 text-white text-sm px-3 py-2 rounded-lg mt-1"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs text-slate-400">Width</label>
                  <p className="text-white text-sm">{Math.round(selectedPiece.width)}px</p>
                </div>
                <div>
                  <label className="text-xs text-slate-400">Height</label>
                  <p className="text-white text-sm">{Math.round(selectedPiece.height)}px</p>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => updatePiece(selectedPiece.id, { isLocked: !selectedPiece.isLocked })}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedPiece.isLocked
                      ? 'bg-amber-600 hover:bg-amber-500 text-white'
                      : 'bg-slate-700 hover:bg-slate-600 text-slate-300'
                  }`}
                >
                  {selectedPiece.isLocked ? <Lock size={16} /> : <Unlock size={16} />}
                  {selectedPiece.isLocked ? 'Locked' : 'Lock'}
                </button>
                <button
                  onClick={() => {
                    updatePiece(selectedPiece.id, {
                      width: selectedPiece.originalWidth,
                      height: selectedPiece.originalHeight,
                      scale: 1
                    });
                  }}
                  className="flex-1 flex items-center justify-center gap-2 py-2 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg text-sm font-medium transition-colors"
                >
                  Reset Size
                </button>
              </div>

              <button
                onClick={() => {
                  removePiece(selectedPiece.id);
                  selectPiece(null);
                }}
                className="w-full flex items-center justify-center gap-2 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg text-sm font-medium transition-colors"
              >
                <Trash2 size={16} />
                Delete
              </button>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
