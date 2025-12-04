import { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Upload, Trash2, Lock, Unlock, Move, Maximize2, Link2, 
  ZoomIn, ZoomOut, Home, Image, X, Eye, EyeOff, 
  ArrowUp, ArrowDown, Magnet, Grid3X3, Minimize2,
  ChevronLeft, Save, RotateCcw, Layers, Settings2,
  Target, Crosshair, ScanLine, Ruler, CornerUpRight,
  PanelLeft, PanelRight, Focus, Layout
} from 'lucide-react';
import { useMapEditorStore, MapPiece } from '@/lib/stores/useMapEditorStore';

interface PendingPiece {
  id: string;
  name: string;
  imagePath: string;
  width: number;
  height: number;
  edgeColors: {
    top: string[];
    right: string[];
    bottom: string[];
    left: string[];
  };
  thumbnail: string;
}

interface SnapSuggestion {
  targetPieceId: string;
  targetEdge: 'top' | 'right' | 'bottom' | 'left';
  sourceEdge: 'top' | 'right' | 'bottom' | 'left';
  position: { x: number; y: number };
  matchScore: number;
}

const EDGE_COLORS = {
  top: '#dc2626',
  right: '#16a34a', 
  bottom: '#2563eb',
  left: '#d97706'
};

function analyzeImageEdges(
  img: HTMLImageElement,
  sampleCount: number = 20
): { top: string[]; right: string[]; bottom: string[]; left: string[] } {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) return { top: [], right: [], bottom: [], left: [] };

  canvas.width = img.width;
  canvas.height = img.height;
  ctx.drawImage(img, 0, 0);

  const sampleEdge = (
    startX: number,
    startY: number,
    stepX: number,
    stepY: number,
    count: number
  ): string[] => {
    const colors: string[] = [];
    let x = startX;
    let y = startY;

    for (let i = 0; i < count; i++) {
      const pixelData = ctx.getImageData(Math.floor(x), Math.floor(y), 1, 1).data;
      const color = `rgb(${pixelData[0]},${pixelData[1]},${pixelData[2]})`;
      colors.push(color);
      x += stepX;
      y += stepY;
    }
    return colors;
  };

  const stepX = img.width / sampleCount;
  const stepY = img.height / sampleCount;

  return {
    top: sampleEdge(0, 2, stepX, 0, sampleCount),
    bottom: sampleEdge(0, img.height - 3, stepX, 0, sampleCount),
    left: sampleEdge(2, 0, 0, stepY, sampleCount),
    right: sampleEdge(img.width - 3, 0, 0, stepY, sampleCount),
  };
}

function calculateEdgeMatchScore(colors1: string[], colors2: string[]): number {
  if (colors1.length === 0 || colors2.length === 0) return 0;
  
  let totalDiff = 0;
  const count = Math.min(colors1.length, colors2.length);
  
  for (let i = 0; i < count; i++) {
    const rgb1 = colors1[i].match(/\d+/g)?.map(Number) || [0, 0, 0];
    const rgb2 = colors2[colors2.length - 1 - i].match(/\d+/g)?.map(Number) || [0, 0, 0];
    
    const diff = Math.sqrt(
      Math.pow(rgb1[0] - rgb2[0], 2) +
      Math.pow(rgb1[1] - rgb2[1], 2) +
      Math.pow(rgb1[2] - rgb2[2], 2)
    );
    totalDiff += diff;
  }
  
  const avgDiff = totalDiff / count;
  const maxDiff = Math.sqrt(255 * 255 * 3);
  return Math.max(0, 100 - (avgDiff / maxDiff) * 100);
}

export default function MapBuilder({ onClose }: { onClose: () => void }) {
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
  const [pendingPieces, setPendingPieces] = useState<PendingPiece[]>([]);
  const [selectedPendingId, setSelectedPendingId] = useState<string | null>(null);
  const [snapSuggestions, setSnapSuggestions] = useState<SnapSuggestion[]>([]);
  const [showSidebar, setShowSidebar] = useState(true);
  const [showMinimap, setShowMinimap] = useState(true);
  const [gridEnabled, setGridEnabled] = useState(true);
  const [placingPiece, setPlacingPiece] = useState<PendingPiece | null>(null);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const minimapRef = useRef<HTMLDivElement>(null);

  const selectedPiece = pieces.find(p => p.id === selectedPieceId);
  const selectedPending = pendingPieces.find(p => p.id === selectedPendingId);

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
              const edgeColors = analyzeImageEdges(img);
              
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
                edgeColors,
                thumbnail: canvas.toDataURL(),
              };
              
              setPendingPieces(prev => [...prev, pending]);
              
              if (pieces.length > 0) {
                calculateSnapSuggestions(pending);
              }
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

  const getExistingPieceEdgeColors = useCallback(async (piece: MapPiece): Promise<{ top: string[]; right: string[]; bottom: string[]; left: string[] } | null> => {
    if (piece.edgeColors) {
      return piece.edgeColors;
    }
    
    return new Promise((resolve) => {
      const img = document.createElement('img');
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        const edgeColors = analyzeImageEdges(img);
        updatePiece(piece.id, { edgeColors });
        resolve(edgeColors);
      };
      img.onerror = () => resolve(null);
      img.src = piece.imagePath;
    });
  }, [updatePiece]);

  const calculateSnapSuggestions = useCallback(async (pending: PendingPiece) => {
    const suggestions: SnapSuggestion[] = [];
    
    const edgePairs: Array<{
      source: 'top' | 'right' | 'bottom' | 'left';
      target: 'top' | 'right' | 'bottom' | 'left';
    }> = [
      { source: 'right', target: 'left' },
      { source: 'left', target: 'right' },
      { source: 'bottom', target: 'top' },
      { source: 'top', target: 'bottom' },
    ];
    
    for (const existingPiece of pieces) {
      const existingEdgeColors = await getExistingPieceEdgeColors(existingPiece);
      if (!existingEdgeColors) continue;
      
      for (const { source, target } of edgePairs) {
        const sourceColors = pending.edgeColors[source];
        const targetColors = existingEdgeColors[target];
        
        const matchScore = calculateEdgeMatchScore(sourceColors, targetColors);
        
        let position = { x: 0, y: 0 };
        switch (target) {
          case 'left':
            position = { x: existingPiece.x - pending.width, y: existingPiece.y };
            break;
          case 'right':
            position = { x: existingPiece.x + existingPiece.width, y: existingPiece.y };
            break;
          case 'top':
            position = { x: existingPiece.x, y: existingPiece.y - pending.height };
            break;
          case 'bottom':
            position = { x: existingPiece.x, y: existingPiece.y + existingPiece.height };
            break;
        }
        
        suggestions.push({
          targetPieceId: existingPiece.id,
          targetEdge: target,
          sourceEdge: source,
          position,
          matchScore,
        });
      }
    }
    
    suggestions.sort((a, b) => b.matchScore - a.matchScore);
    setSnapSuggestions(suggestions.slice(0, 8));
  }, [pieces, getExistingPieceEdgeColors]);

  const placePendingPiece = useCallback((pending: PendingPiece, suggestion?: SnapSuggestion) => {
    const bounds = getMapBounds();
    let startX = bounds.width > 0 ? bounds.maxX + 50 : 0;
    let startY = bounds.width > 0 ? bounds.minY : 0;
    
    if (suggestion) {
      startX = suggestion.position.x;
      startY = suggestion.position.y;
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
      edgeColors: pending.edgeColors,
    };
    
    addPiece(newPiece);
    setPendingPieces(prev => prev.filter(p => p.id !== pending.id));
    setSelectedPendingId(null);
    setSnapSuggestions([]);
    setPlacingPiece(null);
    
    setTimeout(() => {
      autoConnectNearbyPieces();
      zoomToFit();
    }, 100);
  }, [addPiece, autoConnectNearbyPieces, getMapBounds, pieces.length, zoomToFit]);

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
    const newZoom = Math.max(0.02, Math.min(5, viewport.zoom * zoomFactor));
    
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
            stroke={EDGE_COLORS[connection.fromEdge as keyof typeof EDGE_COLORS]}
            strokeWidth={3 / viewport.zoom}
            strokeDasharray={`${10 / viewport.zoom},${5 / viewport.zoom}`}
            className="pointer-events-none"
          />
        );
      })
    );
  };

  const bounds = getMapBounds();

  const minimapBounds = useMemo(() => {
    if (bounds.width === 0) return { scale: 1, offsetX: 0, offsetY: 0 };
    const minimapWidth = 180;
    const minimapHeight = 120;
    const padding = 10;
    const scale = Math.min(
      (minimapWidth - padding * 2) / bounds.width,
      (minimapHeight - padding * 2) / bounds.height
    ) * 0.8;
    return {
      scale,
      offsetX: padding - bounds.minX * scale,
      offsetY: padding - bounds.minY * scale,
    };
  }, [bounds]);

  useEffect(() => {
    if (pieces.length > 0) {
      setTimeout(() => zoomToFit(), 100);
    }
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Delete' && selectedPiece && !selectedPiece.isLocked) {
        removePiece(selectedPiece.id);
      }
      if (e.key === 'Escape') {
        selectPiece(null);
        setSelectedPendingId(null);
        setPlacingPiece(null);
      }
      if (e.key === 'f' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        zoomToFit();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedPiece, removePiece, selectPiece, zoomToFit]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-slate-950 z-[200] flex flex-col"
    >
      <div className="h-14 bg-slate-900 border-b border-slate-800 px-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onClose}
            className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg text-sm font-medium transition-colors"
          >
            <ChevronLeft size={18} />
            Exit
          </button>
          <div className="w-px h-6 bg-slate-700" />
          <div className="flex items-center gap-2">
            <Layout className="text-cyan-400" size={22} />
            <h1 className="text-lg font-semibold text-white">World Map Builder</h1>
          </div>
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
            <Upload size={16} />
            {uploadingImage ? 'Processing...' : 'Import Map Piece'}
          </button>

          <div className="w-px h-6 bg-slate-700 mx-1" />

          <button
            onClick={() => setGridEnabled(!gridEnabled)}
            className={`p-2 rounded-lg transition-colors ${
              gridEnabled ? 'bg-slate-700 text-white' : 'bg-transparent text-slate-500 hover:text-white'
            }`}
            title="Toggle Grid"
          >
            <Grid3X3 size={18} />
          </button>

          <button
            onClick={() => setSnapEnabled(!snapEnabled)}
            className={`p-2 rounded-lg transition-colors ${
              snapEnabled ? 'bg-amber-600 text-white' : 'bg-transparent text-slate-500 hover:text-white'
            }`}
            title="Smart Snap"
          >
            <Magnet size={18} />
          </button>
          
          <button
            onClick={() => setShowConnections(!showConnections)}
            className={`p-2 rounded-lg transition-colors ${
              showConnections ? 'bg-blue-600 text-white' : 'bg-transparent text-slate-500 hover:text-white'
            }`}
            title="Show Connections"
          >
            <Link2 size={18} />
          </button>

          <button
            onClick={() => setShowMinimap(!showMinimap)}
            className={`p-2 rounded-lg transition-colors ${
              showMinimap ? 'bg-slate-700 text-white' : 'bg-transparent text-slate-500 hover:text-white'
            }`}
            title="Toggle Minimap"
          >
            <Focus size={18} />
          </button>
          
          <button
            onClick={autoConnectNearbyPieces}
            className="flex items-center gap-2 px-3 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-sm font-medium transition-colors"
            title="Auto-connect nearby pieces"
          >
            <Target size={16} />
            Auto Connect
          </button>
          
          <div className="w-px h-6 bg-slate-700 mx-1" />
          
          <div className="flex items-center gap-1 bg-slate-800 rounded-lg p-1">
            <button
              onClick={() => setViewport({ zoom: Math.max(0.02, viewport.zoom * 0.8) })}
              className="p-1.5 hover:bg-slate-700 text-slate-300 hover:text-white rounded transition-colors"
            >
              <ZoomOut size={16} />
            </button>
            <span className="text-slate-300 text-sm w-12 text-center font-mono">
              {Math.round(viewport.zoom * 100)}%
            </span>
            <button
              onClick={() => setViewport({ zoom: Math.min(5, viewport.zoom * 1.25) })}
              className="p-1.5 hover:bg-slate-700 text-slate-300 hover:text-white rounded transition-colors"
            >
              <ZoomIn size={16} />
            </button>
          </div>
          
          <button
            onClick={zoomToFit}
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg transition-colors"
            title="Fit All (Ctrl+F)"
          >
            <Minimize2 size={18} />
          </button>
          
          <button
            onClick={resetViewport}
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg transition-colors"
            title="Reset View"
          >
            <Home size={18} />
          </button>

          <div className="w-px h-6 bg-slate-700 mx-1" />

          <button
            onClick={() => setShowSidebar(!showSidebar)}
            className={`p-2 rounded-lg transition-colors ${
              showSidebar ? 'bg-slate-700 text-white' : 'bg-transparent text-slate-500 hover:text-white'
            }`}
            title="Toggle Sidebar"
          >
            {showSidebar ? <PanelRight size={18} /> : <PanelLeft size={18} />}
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
            background: '#0c0f14',
          }}
        >
          {gridEnabled && (
            <div 
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundImage: `
                  linear-gradient(to right, rgba(100,116,139,0.08) 1px, transparent 1px),
                  linear-gradient(to bottom, rgba(100,116,139,0.08) 1px, transparent 1px)
                `,
                backgroundSize: `${100 * viewport.zoom}px ${100 * viewport.zoom}px`,
                backgroundPosition: `${viewport.x}px ${viewport.y}px`
              }}
            />
          )}

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
                      ? 'ring-2 ring-cyan-400' 
                      : 'hover:ring-1 hover:ring-white/20'
                  } ${piece.isLocked ? 'opacity-80' : 'cursor-move'}`}
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
                    <div className="absolute top-2 right-2 bg-black/60 p-1 rounded">
                      <Lock size={14} className="text-amber-400" />
                    </div>
                  )}

                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent px-2 py-1">
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
                          nw: { top: -5, left: -5 },
                          n: { top: -5, left: '50%', transform: 'translateX(-50%)' },
                          ne: { top: -5, right: -5 },
                          w: { top: '50%', left: -5, transform: 'translateY(-50%)' },
                          e: { top: '50%', right: -5, transform: 'translateY(-50%)' },
                          sw: { bottom: -5, left: -5 },
                          s: { bottom: -5, left: '50%', transform: 'translateX(-50%)' },
                          se: { bottom: -5, right: -5 }
                        };

                        return (
                          <div
                            key={handle}
                            className="absolute w-3 h-3 bg-cyan-400 border border-cyan-600 rounded-sm"
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
            <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-cyan-600 text-white px-4 py-2 rounded-lg font-medium z-50 shadow-lg text-sm">
              Snapping to adjacent piece
            </div>
          )}

          {showMinimap && pieces.length > 0 && (
            <div 
              ref={minimapRef}
              className="absolute bottom-4 left-4 w-[180px] h-[120px] bg-slate-900/90 border border-slate-700 rounded-lg overflow-hidden"
            >
              <div className="relative w-full h-full">
                {pieces.map(piece => (
                  <div
                    key={piece.id}
                    className={`absolute bg-slate-600 ${selectedPieceId === piece.id ? 'ring-1 ring-cyan-400' : ''}`}
                    style={{
                      left: piece.x * minimapBounds.scale + minimapBounds.offsetX,
                      top: piece.y * minimapBounds.scale + minimapBounds.offsetY,
                      width: Math.max(2, piece.width * minimapBounds.scale),
                      height: Math.max(2, piece.height * minimapBounds.scale),
                    }}
                  />
                ))}
              </div>
            </div>
          )}

          <div className="absolute bottom-4 right-4 bg-slate-900/90 border border-slate-700 rounded-lg p-3 text-sm">
            <div className="text-slate-400 text-xs uppercase tracking-wide mb-2">Map Info</div>
            <div className="space-y-1 text-slate-300">
              <div>Pieces: <span className="text-white font-medium">{pieces.length}</span></div>
              <div>Size: <span className="text-white font-medium">{Math.round(bounds.width)} x {Math.round(bounds.height)}px</span></div>
            </div>
          </div>

          {pieces.length === 0 && pendingPieces.length === 0 && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-500">
              <Image size={64} className="mb-4 opacity-30" />
              <h2 className="text-xl font-medium mb-2 text-slate-400">No Map Pieces Yet</h2>
              <p className="text-sm mb-6 text-slate-500">Import your first map image to get started</p>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 px-6 py-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl font-medium transition-colors"
              >
                <Upload size={20} />
                Import Map Piece
              </button>
            </div>
          )}
        </div>

        <AnimatePresence>
          {showSidebar && (
            <motion.div
              initial={{ x: 320, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 320, opacity: 0 }}
              className="w-80 bg-slate-900 border-l border-slate-800 flex flex-col"
            >
              {pendingPieces.length > 0 && (
                <div className="border-b border-slate-800">
                  <div className="p-3 flex items-center justify-between">
                    <h3 className="text-sm font-medium text-slate-300 uppercase tracking-wide">
                      Pending Pieces ({pendingPieces.length})
                    </h3>
                  </div>
                  <div className="p-3 pt-0 space-y-2 max-h-48 overflow-y-auto">
                    {pendingPieces.map(pending => (
                      <div
                        key={pending.id}
                        onClick={() => {
                          setSelectedPendingId(pending.id);
                          calculateSnapSuggestions(pending);
                        }}
                        className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors ${
                          selectedPendingId === pending.id
                            ? 'bg-cyan-600/20 ring-1 ring-cyan-600'
                            : 'bg-slate-800 hover:bg-slate-700'
                        }`}
                      >
                        <img
                          src={pending.thumbnail}
                          alt={pending.name}
                          className="w-12 h-12 object-cover rounded"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-white truncate">{pending.name}</div>
                          <div className="text-xs text-slate-500">{pending.width} x {pending.height}px</div>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            placePendingPiece(pending);
                          }}
                          className="p-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded transition-colors"
                          title="Place on map"
                        >
                          <CornerUpRight size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedPending && snapSuggestions.length > 0 && (
                <div className="border-b border-slate-800">
                  <div className="p-3">
                    <h3 className="text-sm font-medium text-slate-300 uppercase tracking-wide mb-2">
                      Suggested Placements
                    </h3>
                    <div className="space-y-1">
                      {snapSuggestions.slice(0, 4).map((suggestion, idx) => {
                        const targetPiece = pieces.find(p => p.id === suggestion.targetPieceId);
                        return (
                          <button
                            key={idx}
                            onClick={() => placePendingPiece(selectedPending, suggestion)}
                            className="w-full flex items-center gap-2 p-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-left transition-colors"
                          >
                            <div 
                              className="w-2 h-2 rounded-full"
                              style={{ backgroundColor: EDGE_COLORS[suggestion.sourceEdge] }}
                            />
                            <span className="text-sm text-slate-300 flex-1 truncate">
                              {suggestion.sourceEdge} of {targetPiece?.name}
                            </span>
                            <span className="text-xs text-slate-500">
                              {Math.round(suggestion.matchScore)}%
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {selectedPiece ? (
                <div className="flex-1 overflow-y-auto p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-medium text-slate-300 uppercase tracking-wide">
                      Selected Piece
                    </h3>
                    <button
                      onClick={() => selectPiece(null)}
                      className="text-slate-500 hover:text-white transition-colors"
                    >
                      <X size={18} />
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-medium text-slate-400 mb-1">Name</label>
                      <input
                        type="text"
                        value={selectedPiece.name}
                        onChange={(e) => updatePiece(selectedPiece.id, { name: e.target.value })}
                        className="w-full bg-slate-800 text-white rounded-lg px-3 py-2 text-sm border border-slate-700 focus:border-cyan-600 focus:outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1">X</label>
                        <input
                          type="number"
                          value={Math.round(selectedPiece.x)}
                          onChange={(e) => updatePiece(selectedPiece.id, { x: parseInt(e.target.value) || 0 })}
                          className="w-full bg-slate-800 text-white rounded-lg px-3 py-2 text-sm border border-slate-700 focus:border-cyan-600 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1">Y</label>
                        <input
                          type="number"
                          value={Math.round(selectedPiece.y)}
                          onChange={(e) => updatePiece(selectedPiece.id, { y: parseInt(e.target.value) || 0 })}
                          className="w-full bg-slate-800 text-white rounded-lg px-3 py-2 text-sm border border-slate-700 focus:border-cyan-600 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1">Width</label>
                        <input
                          type="number"
                          value={Math.round(selectedPiece.width)}
                          onChange={(e) => {
                            const newWidth = parseInt(e.target.value) || 100;
                            const scale = newWidth / selectedPiece.originalWidth;
                            updatePiece(selectedPiece.id, { width: newWidth, scale });
                          }}
                          className="w-full bg-slate-800 text-white rounded-lg px-3 py-2 text-sm border border-slate-700 focus:border-cyan-600 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1">Height</label>
                        <input
                          type="number"
                          value={Math.round(selectedPiece.height)}
                          onChange={(e) => {
                            const newHeight = parseInt(e.target.value) || 100;
                            const scale = newHeight / selectedPiece.originalHeight;
                            updatePiece(selectedPiece.id, { height: newHeight, scale });
                          }}
                          className="w-full bg-slate-800 text-white rounded-lg px-3 py-2 text-sm border border-slate-700 focus:border-cyan-600 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-400 mb-1">
                        Scale: {Math.round(selectedPiece.scale * 100)}%
                      </label>
                      <input
                        type="range"
                        min="10"
                        max="300"
                        value={selectedPiece.scale * 100}
                        onChange={(e) => {
                          const newScale = parseInt(e.target.value) / 100;
                          updatePiece(selectedPiece.id, {
                            scale: newScale,
                            width: selectedPiece.originalWidth * newScale,
                            height: selectedPiece.originalHeight * newScale,
                          });
                        }}
                        className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-600"
                      />
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={handleResetSize}
                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-sm transition-colors"
                      >
                        <RotateCcw size={14} />
                        Reset Size
                      </button>
                    </div>

                    <div className="border-t border-slate-800 pt-4">
                      <div className="flex gap-2">
                        <button
                          onClick={handleBringToFront}
                          className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-sm transition-colors"
                        >
                          <ArrowUp size={14} />
                          Front
                        </button>
                        <button
                          onClick={handleSendToBack}
                          className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-sm transition-colors"
                        >
                          <ArrowDown size={14} />
                          Back
                        </button>
                      </div>
                    </div>

                    <div className="border-t border-slate-800 pt-4">
                      <button
                        onClick={() => updatePiece(selectedPiece.id, { isLocked: !selectedPiece.isLocked })}
                        className={`w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                          selectedPiece.isLocked
                            ? 'bg-amber-600/20 text-amber-400 hover:bg-amber-600/30'
                            : 'bg-slate-800 text-white hover:bg-slate-700'
                        }`}
                      >
                        {selectedPiece.isLocked ? <Lock size={14} /> : <Unlock size={14} />}
                        {selectedPiece.isLocked ? 'Unlock Piece' : 'Lock Piece'}
                      </button>
                    </div>

                    <div className="border-t border-slate-800 pt-4">
                      <button
                        onClick={() => {
                          removePiece(selectedPiece.id);
                        }}
                        className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-red-600/20 text-red-400 hover:bg-red-600/30 rounded-lg text-sm transition-colors"
                      >
                        <Trash2 size={14} />
                        Delete Piece
                      </button>
                    </div>

                    {selectedPiece.connections.length > 0 && (
                      <div className="border-t border-slate-800 pt-4">
                        <h4 className="text-xs font-medium text-slate-400 mb-2">Connections</h4>
                        <div className="space-y-1">
                          {selectedPiece.connections.map((conn, idx) => {
                            const target = pieces.find(p => p.id === conn.pieceId);
                            return (
                              <div 
                                key={idx}
                                className="flex items-center gap-2 px-2 py-1.5 bg-slate-800 rounded text-xs text-slate-400"
                              >
                                <div 
                                  className="w-2 h-2 rounded-full"
                                  style={{ backgroundColor: EDGE_COLORS[conn.fromEdge] }}
                                />
                                <span>{conn.fromEdge}</span>
                                <span className="text-slate-600">-</span>
                                <span className="text-white truncate">{target?.name || conn.pieceId}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex items-center justify-center text-slate-500 text-sm p-4 text-center">
                  Select a piece to edit its properties or choose a pending piece to place
                </div>
              )}

              <div className="p-3 border-t border-slate-800 bg-slate-900">
                <div className="grid grid-cols-2 gap-2 text-xs text-slate-500">
                  <div>Scroll: Zoom</div>
                  <div>Drag: Pan</div>
                  <div>Click: Select</div>
                  <div>Del: Remove</div>
                  <div>Shift+Drag: Keep Ratio</div>
                  <div>Esc: Deselect</div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
