import { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Upload, Trash2, Lock, Unlock, Move, Maximize2, Link2, 
  ZoomIn, ZoomOut, Home, Image, X, Eye, EyeOff, 
  ArrowUp, ArrowDown, Magnet, Grid3X3, Minimize2,
  ChevronLeft, Save, RotateCcw
} from 'lucide-react';
import { useMapEditorStore, MapPiece } from '@/lib/stores/useMapEditorStore';

interface MapEditorPageProps {
  onClose: () => void;
}

const EDGE_COLORS = {
  top: '#ef4444',
  right: '#22c55e', 
  bottom: '#3b82f6',
  left: '#f59e0b'
};

export default function MapEditorPage({ onClose }: MapEditorPageProps) {
  const {
    pieces,
    selectedPieceId,
    viewport,
    showConnections,
    snapEnabled,
    addPiece,
    updatePiece,
    removePiece,
    selectPiece,
    setViewport,
    resetViewport,
    zoomToFit,
    setShowConnections,
    setSnapEnabled,
    autoConnectNearbyPieces,
    findSnapPosition,
    getMapBounds,
  } = useMapEditorStore();

  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [isResizing, setIsResizing] = useState(false);
  const [resizeHandle, setResizeHandle] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [snapIndicator, setSnapIndicator] = useState<{ pieceId: string; edge: string } | null>(null);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const selectedPiece = pieces.find(p => p.id === selectedPieceId);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);

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
            const bounds = getMapBounds();
            const startX = bounds.width > 0 ? bounds.maxX + 50 : 0;
            const startY = bounds.width > 0 ? bounds.minY : 0;

            const newPiece: MapPiece = {
              id: `piece_${Date.now()}`,
              name: file.name.replace(/\.[^/.]+$/, ''),
              imagePath: data.path,
              x: startX,
              y: startY,
              width: img.width,
              height: img.height,
              originalWidth: img.width,
              originalHeight: img.height,
              scale: 1,
              zIndex: pieces.length,
              isLocked: false,
              connections: []
            };
            addPiece(newPiece);
            
            setTimeout(() => {
              autoConnectNearbyPieces();
            }, 100);
          }
        } catch (err) {
          console.error('Upload error:', err);
        } finally {
          setUploadingImage(false);
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handlePieceMouseDown = (e: React.MouseEvent, piece: MapPiece) => {
    e.stopPropagation();
    if (piece.isLocked) return;
    
    selectPiece(piece.id);
    setIsDragging(true);
    
    const containerRect = containerRef.current?.getBoundingClientRect();
    if (containerRect) {
      const worldX = (e.clientX - containerRect.left - viewport.x) / viewport.zoom;
      const worldY = (e.clientY - containerRect.top - viewport.y) / viewport.zoom;
      setDragOffset({
        x: worldX - piece.x,
        y: worldY - piece.y
      });
    }
  };

  const handleResizeHandleMouseDown = (e: React.MouseEvent, handle: string) => {
    e.stopPropagation();
    if (selectedPiece?.isLocked) return;
    
    setIsResizing(true);
    setResizeHandle(handle);
  };

  const handleCanvasMouseDown = (e: React.MouseEvent) => {
    if (e.target === containerRef.current || (e.target as HTMLElement).classList.contains('canvas-background')) {
      selectPiece(null);
      setIsPanning(true);
      setPanStart({ x: e.clientX - viewport.x, y: e.clientY - viewport.y });
    }
  };

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const containerRect = containerRef.current?.getBoundingClientRect();
    if (!containerRect) return;

    if (isPanning) {
      setViewport({
        x: e.clientX - panStart.x,
        y: e.clientY - panStart.y,
      });
      return;
    }

    if (isDragging && selectedPiece) {
      const worldX = (e.clientX - containerRect.left - viewport.x) / viewport.zoom;
      const worldY = (e.clientY - containerRect.top - viewport.y) / viewport.zoom;
      
      const targetX = worldX - dragOffset.x;
      const targetY = worldY - dragOffset.y;
      
      const { x: snapX, y: snapY, snappedTo } = findSnapPosition(selectedPiece.id, targetX, targetY);
      setSnapIndicator(snappedTo);
      
      updatePiece(selectedPiece.id, { x: snapX, y: snapY });
    }

    if (isResizing && selectedPiece && resizeHandle) {
      const worldX = (e.clientX - containerRect.left - viewport.x) / viewport.zoom;
      const worldY = (e.clientY - containerRect.top - viewport.y) / viewport.zoom;
      
      let newWidth = selectedPiece.width;
      let newHeight = selectedPiece.height;
      let newX = selectedPiece.x;
      let newY = selectedPiece.y;

      const aspectRatio = selectedPiece.originalWidth / selectedPiece.originalHeight;

      if (resizeHandle.includes('e')) {
        newWidth = Math.max(100, worldX - selectedPiece.x);
        if (e.shiftKey) newHeight = newWidth / aspectRatio;
      }
      if (resizeHandle.includes('w')) {
        const delta = selectedPiece.x - worldX;
        newWidth = Math.max(100, selectedPiece.width + delta);
        if (newWidth > 100) newX = worldX;
        if (e.shiftKey) newHeight = newWidth / aspectRatio;
      }
      if (resizeHandle.includes('s')) {
        newHeight = Math.max(100, worldY - selectedPiece.y);
        if (e.shiftKey) newWidth = newHeight * aspectRatio;
      }
      if (resizeHandle.includes('n')) {
        const delta = selectedPiece.y - worldY;
        newHeight = Math.max(100, selectedPiece.height + delta);
        if (newHeight > 100) newY = worldY;
        if (e.shiftKey) newWidth = newHeight * aspectRatio;
      }

      const newScale = newWidth / selectedPiece.originalWidth;
      updatePiece(selectedPiece.id, { 
        width: newWidth, 
        height: newHeight,
        x: newX,
        y: newY,
        scale: newScale
      });
    }
  }, [isPanning, isDragging, isResizing, selectedPiece, viewport, dragOffset, resizeHandle, panStart, findSnapPosition, updatePiece, setViewport]);

  const handleMouseUp = useCallback(() => {
    if (isDragging) {
      autoConnectNearbyPieces();
    }
    setIsDragging(false);
    setIsPanning(false);
    setIsResizing(false);
    setResizeHandle(null);
    setSnapIndicator(null);
  }, [isDragging, autoConnectNearbyPieces]);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    
    const containerRect = containerRef.current?.getBoundingClientRect();
    if (!containerRect) return;

    const mouseX = e.clientX - containerRect.left;
    const mouseY = e.clientY - containerRect.top;
    
    const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;
    const newZoom = Math.max(0.05, Math.min(3, viewport.zoom * zoomFactor));
    
    const worldX = (mouseX - viewport.x) / viewport.zoom;
    const worldY = (mouseY - viewport.y) / viewport.zoom;
    
    const newX = mouseX - worldX * newZoom;
    const newY = mouseY - worldY * newZoom;
    
    setViewport({ x: newX, y: newY, zoom: newZoom });
  }, [viewport, setViewport]);

  const handleBringToFront = () => {
    if (!selectedPiece) return;
    const maxZ = Math.max(...pieces.map(p => p.zIndex), 0);
    updatePiece(selectedPiece.id, { zIndex: maxZ + 1 });
  };

  const handleSendToBack = () => {
    if (!selectedPiece) return;
    const minZ = Math.min(...pieces.map(p => p.zIndex), 0);
    updatePiece(selectedPiece.id, { zIndex: minZ - 1 });
  };

  const handleResetSize = () => {
    if (!selectedPiece) return;
    updatePiece(selectedPiece.id, { 
      width: selectedPiece.originalWidth, 
      height: selectedPiece.originalHeight,
      scale: 1
    });
  };

  const renderConnectionLines = () => {
    if (!showConnections) return null;

    return pieces.flatMap(piece =>
      piece.connections.map((connection, idx) => {
        const targetPiece = pieces.find(p => p.id === connection.pieceId);
        if (!targetPiece) return null;

        const getEdgeCenter = (p: MapPiece, edge: string) => {
          switch (edge) {
            case 'top': return { x: p.x + p.width / 2, y: p.y };
            case 'bottom': return { x: p.x + p.width / 2, y: p.y + p.height };
            case 'left': return { x: p.x, y: p.y + p.height / 2 };
            case 'right': return { x: p.x + p.width, y: p.y + p.height / 2 };
            default: return { x: p.x, y: p.y };
          }
        };

        const from = getEdgeCenter(piece, connection.fromEdge);
        const to = getEdgeCenter(targetPiece, connection.toEdge);

        return (
          <line
            key={`${piece.id}-${connection.pieceId}-${idx}`}
            x1={from.x}
            y1={from.y}
            x2={to.x}
            y2={to.y}
            stroke={EDGE_COLORS[connection.fromEdge]}
            strokeWidth={3 / viewport.zoom}
            strokeDasharray={`${10 / viewport.zoom},${5 / viewport.zoom}`}
            className="pointer-events-none"
          />
        );
      })
    );
  };

  const bounds = getMapBounds();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-slate-950 z-[200] flex flex-col"
    >
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 px-4 py-3 flex items-center justify-between border-b border-slate-700">
        <div className="flex items-center gap-4">
          <button
            onClick={onClose}
            className="flex items-center gap-2 px-3 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-sm font-medium transition-colors"
          >
            <ChevronLeft size={18} />
            Back
          </button>
          <div className="flex items-center gap-2">
            <Grid3X3 className="text-emerald-400" size={24} />
            <h1 className="text-xl font-bold text-white">World Map Editor</h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploadingImage}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-medium transition-colors"
          >
            <Upload size={18} />
            {uploadingImage ? 'Uploading...' : 'Add Map Piece'}
          </button>
          
          <div className="h-6 w-px bg-slate-600" />
          
          <button
            onClick={() => setSnapEnabled(!snapEnabled)}
            className={`p-2 rounded-lg transition-colors ${
              snapEnabled ? 'bg-amber-500 text-black' : 'bg-slate-700 text-gray-400 hover:text-white'
            }`}
            title="Smart Snap"
          >
            <Magnet size={18} />
          </button>
          
          <button
            onClick={() => setShowConnections(!showConnections)}
            className={`p-2 rounded-lg transition-colors ${
              showConnections ? 'bg-blue-500 text-white' : 'bg-slate-700 text-gray-400 hover:text-white'
            }`}
            title="Show Connections"
          >
            {showConnections ? <Eye size={18} /> : <EyeOff size={18} />}
          </button>
          
          <button
            onClick={autoConnectNearbyPieces}
            className="flex items-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
            title="Auto-connect nearby pieces"
          >
            <Link2 size={18} />
            Auto Connect
          </button>
          
          <div className="h-6 w-px bg-slate-600" />
          
          <div className="flex items-center gap-2 bg-slate-800 rounded-lg p-1">
            <button
              onClick={() => setViewport({ zoom: Math.max(0.05, viewport.zoom * 0.8) })}
              className="p-2 hover:bg-slate-700 text-white rounded"
            >
              <ZoomOut size={18} />
            </button>
            <span className="text-white text-sm w-14 text-center font-mono">
              {Math.round(viewport.zoom * 100)}%
            </span>
            <button
              onClick={() => setViewport({ zoom: Math.min(3, viewport.zoom * 1.25) })}
              className="p-2 hover:bg-slate-700 text-white rounded"
            >
              <ZoomIn size={18} />
            </button>
          </div>
          
          <button
            onClick={zoomToFit}
            className="p-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg"
            title="Zoom to fit all"
          >
            <Minimize2 size={18} />
          </button>
          
          <button
            onClick={resetViewport}
            className="p-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg"
            title="Reset View"
          >
            <Home size={18} />
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div
          ref={containerRef}
          className="flex-1 overflow-hidden relative cursor-grab active:cursor-grabbing canvas-background"
          onWheel={handleWheel}
          onMouseDown={handleCanvasMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          style={{
            background: `
              radial-gradient(circle at 50% 50%, #1e293b 0%, #0f172a 100%)
            `,
          }}
        >
          <div 
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: `
                linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px)
              `,
              backgroundSize: `${100 * viewport.zoom}px ${100 * viewport.zoom}px`,
              backgroundPosition: `${viewport.x}px ${viewport.y}px`
            }}
          />

          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            style={{
              transform: `translate(${viewport.x}px, ${viewport.y}px) scale(${viewport.zoom})`,
              transformOrigin: '0 0'
            }}
          >
            {renderConnectionLines()}
          </svg>

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
                <div
                  key={piece.id}
                  className={`absolute transition-shadow ${
                    selectedPieceId === piece.id 
                      ? 'ring-4 ring-emerald-400 ring-offset-4 ring-offset-slate-900' 
                      : 'hover:ring-2 hover:ring-white/30'
                  } ${piece.isLocked ? 'opacity-70' : 'cursor-move'}`}
                  style={{
                    left: piece.x,
                    top: piece.y,
                    width: piece.width,
                    height: piece.height,
                  }}
                  onMouseDown={(e) => handlePieceMouseDown(e, piece)}
                >
                  <img
                    src={piece.imagePath}
                    alt={piece.name}
                    className="w-full h-full object-cover pointer-events-none"
                    draggable={false}
                  />

                  {piece.isLocked && (
                    <div className="absolute top-2 right-2 bg-black/70 p-1.5 rounded">
                      <Lock size={16} className="text-amber-400" />
                    </div>
                  )}

                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent px-2 py-1">
                    <span className="text-white text-xs font-medium truncate block">
                      {piece.name}
                    </span>
                  </div>

                  {selectedPieceId === piece.id && !piece.isLocked && (
                    <>
                      {['nw', 'n', 'ne', 'w', 'e', 'sw', 's', 'se'].map(handle => {
                        const cursorMap: Record<string, string> = {
                          nw: 'nwse-resize', ne: 'nesw-resize',
                          sw: 'nesw-resize', se: 'nwse-resize',
                          n: 'ns-resize', s: 'ns-resize',
                          w: 'ew-resize', e: 'ew-resize'
                        };
                        const positionMap: Record<string, React.CSSProperties> = {
                          nw: { top: -6, left: -6 },
                          n: { top: -6, left: '50%', transform: 'translateX(-50%)' },
                          ne: { top: -6, right: -6 },
                          w: { top: '50%', left: -6, transform: 'translateY(-50%)' },
                          e: { top: '50%', right: -6, transform: 'translateY(-50%)' },
                          sw: { bottom: -6, left: -6 },
                          s: { bottom: -6, left: '50%', transform: 'translateX(-50%)' },
                          se: { bottom: -6, right: -6 }
                        };

                        return (
                          <div
                            key={handle}
                            className="absolute w-4 h-4 bg-emerald-400 border-2 border-emerald-600 rounded-sm shadow-lg"
                            style={{ ...positionMap[handle], cursor: cursorMap[handle] }}
                            onMouseDown={(e) => handleResizeHandleMouseDown(e, handle)}
                          />
                        );
                      })}
                    </>
                  )}
                </div>
              ))}
          </div>

          {snapIndicator && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-emerald-500 text-black px-4 py-2 rounded-lg font-medium z-50 shadow-lg">
              Snapping to edge
            </div>
          )}

          <div className="absolute bottom-4 left-4 bg-slate-800/90 backdrop-blur-sm rounded-xl p-4 text-white text-sm space-y-2">
            <div className="font-medium text-emerald-400">Map Info</div>
            <div>Pieces: {pieces.length}</div>
            <div>Size: {Math.round(bounds.width)} × {Math.round(bounds.height)}px</div>
            <div>Zoom: {Math.round(viewport.zoom * 100)}%</div>
          </div>

          {pieces.length === 0 && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400">
              <Image size={64} className="mb-4 opacity-50" />
              <h2 className="text-xl font-medium mb-2">No Map Pieces Yet</h2>
              <p className="text-sm mb-4">Upload your first map image to get started</p>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-medium transition-colors"
              >
                <Upload size={20} />
                Add Map Piece
              </button>
            </div>
          )}
        </div>

        <AnimatePresence>
          {selectedPiece && (
            <motion.div
              initial={{ x: 320, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 320, opacity: 0 }}
              className="w-80 bg-slate-800 border-l border-slate-700 p-4 overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-white">Piece Settings</h3>
                <button
                  onClick={() => selectPiece(null)}
                  className="text-gray-400 hover:text-white"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Name</label>
                  <input
                    type="text"
                    value={selectedPiece.name}
                    onChange={(e) => updatePiece(selectedPiece.id, { name: e.target.value })}
                    className="w-full bg-slate-700 text-white rounded-lg px-3 py-2 border border-slate-600"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">X</label>
                    <input
                      type="number"
                      value={Math.round(selectedPiece.x)}
                      onChange={(e) => updatePiece(selectedPiece.id, { x: parseInt(e.target.value) || 0 })}
                      className="w-full bg-slate-700 text-white rounded-lg px-3 py-2 border border-slate-600"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Y</label>
                    <input
                      type="number"
                      value={Math.round(selectedPiece.y)}
                      onChange={(e) => updatePiece(selectedPiece.id, { y: parseInt(e.target.value) || 0 })}
                      className="w-full bg-slate-700 text-white rounded-lg px-3 py-2 border border-slate-600"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Width</label>
                    <input
                      type="number"
                      value={Math.round(selectedPiece.width)}
                      onChange={(e) => {
                        const newWidth = parseInt(e.target.value) || 100;
                        updatePiece(selectedPiece.id, { 
                          width: newWidth,
                          scale: newWidth / selectedPiece.originalWidth 
                        });
                      }}
                      className="w-full bg-slate-700 text-white rounded-lg px-3 py-2 border border-slate-600"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Height</label>
                    <input
                      type="number"
                      value={Math.round(selectedPiece.height)}
                      onChange={(e) => {
                        const newHeight = parseInt(e.target.value) || 100;
                        updatePiece(selectedPiece.id, { 
                          height: newHeight,
                          scale: newHeight / selectedPiece.originalHeight 
                        });
                      }}
                      className="w-full bg-slate-700 text-white rounded-lg px-3 py-2 border border-slate-600"
                    />
                  </div>
                </div>

                <div className="bg-slate-700/50 rounded-lg p-3 text-sm text-gray-400">
                  <div>Original: {selectedPiece.originalWidth} × {selectedPiece.originalHeight}px</div>
                  <div>Scale: {Math.round(selectedPiece.scale * 100)}%</div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={handleResetSize}
                    className="flex-1 flex items-center justify-center gap-2 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-sm"
                  >
                    <RotateCcw size={14} />
                    Reset Size
                  </button>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={handleBringToFront}
                    className="flex-1 flex items-center justify-center gap-2 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-sm"
                  >
                    <ArrowUp size={14} />
                    Front
                  </button>
                  <button
                    onClick={handleSendToBack}
                    className="flex-1 flex items-center justify-center gap-2 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-sm"
                  >
                    <ArrowDown size={14} />
                    Back
                  </button>
                </div>

                <button
                  onClick={() => updatePiece(selectedPiece.id, { isLocked: !selectedPiece.isLocked })}
                  className={`w-full flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedPiece.isLocked 
                      ? 'bg-amber-500 text-black' 
                      : 'bg-slate-700 hover:bg-slate-600 text-white'
                  }`}
                >
                  {selectedPiece.isLocked ? <Unlock size={14} /> : <Lock size={14} />}
                  {selectedPiece.isLocked ? 'Unlock' : 'Lock'}
                </button>

                {selectedPiece.connections.length > 0 && (
                  <div className="border-t border-slate-700 pt-4">
                    <h4 className="text-sm font-medium text-gray-300 mb-2">
                      Connections ({selectedPiece.connections.length})
                    </h4>
                    <div className="space-y-2 max-h-32 overflow-y-auto">
                      {selectedPiece.connections.map((conn, idx) => {
                        const targetPiece = pieces.find(p => p.id === conn.pieceId);
                        return (
                          <div key={idx} className="flex items-center justify-between bg-slate-700/50 rounded px-3 py-2 text-xs">
                            <span className="text-gray-300">
                              <span style={{ color: EDGE_COLORS[conn.fromEdge] }} className="font-medium">
                                {conn.fromEdge}
                              </span>
                              {' → '}
                              {targetPiece?.name || 'Unknown'}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                <button
                  onClick={() => {
                    removePiece(selectedPiece.id);
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium"
                >
                  <Trash2 size={14} />
                  Delete Piece
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
