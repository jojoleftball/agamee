import { useState, useRef, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Upload, Trash2, Lock, Unlock, Move, Maximize2, Link2, 
  ZoomIn, ZoomOut, RotateCcw, Image, Layers, X, Check,
  ArrowUp, ArrowDown, Eye, EyeOff
} from 'lucide-react';
import { useAdminStore, MapSprite, MapSpriteConnection, AdminGarden } from '@/lib/stores/useAdminStore';

interface MapSpriteEditorProps {
  garden: AdminGarden;
}

const SNAP_THRESHOLD = 20;
const EDGE_COLORS = {
  top: '#ef4444',
  right: '#22c55e', 
  bottom: '#3b82f6',
  left: '#f59e0b'
};

export default function MapSpriteEditor({ garden }: MapSpriteEditorProps) {
  const { 
    addMapSprite, 
    updateMapSprite, 
    removeMapSprite,
    connectMapSprites,
    disconnectMapSprites 
  } = useAdminStore();

  const [selectedSpriteId, setSelectedSpriteId] = useState<string | null>(null);
  const [dragMode, setDragMode] = useState<'move' | 'resize' | 'connect'>('move');
  const [resizeHandle, setResizeHandle] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [viewport, setViewport] = useState({ x: 100, y: 100, zoom: 1 });
  const [showConnections, setShowConnections] = useState(true);
  const [connectingFrom, setConnectingFrom] = useState<{ spriteId: string; edge: 'top' | 'right' | 'bottom' | 'left' } | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const sprites = garden.mapSprites || [];
  const selectedSprite = sprites.find(s => s.id === selectedSpriteId);

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
            const newSprite: MapSprite = {
              id: `sprite_${Date.now()}`,
              name: file.name.replace(/\.[^/.]+$/, ''),
              imagePath: data.path,
              x: 50,
              y: 50,
              width: img.width,
              height: img.height,
              originalWidth: img.width,
              originalHeight: img.height,
              zIndex: sprites.length,
              isLocked: false,
              connections: []
            };
            addMapSprite(garden.id, newSprite);
            setSelectedSpriteId(newSprite.id);
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

  const handleSpriteMouseDown = (e: React.MouseEvent, sprite: MapSprite) => {
    e.stopPropagation();
    
    if (sprite.isLocked) return;
    
    setSelectedSpriteId(sprite.id);
    
    if (dragMode === 'move') {
      setIsDragging(true);
      const rect = e.currentTarget.getBoundingClientRect();
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
    }
  };

  const handleResizeHandleMouseDown = (e: React.MouseEvent, handle: string) => {
    e.stopPropagation();
    if (selectedSprite?.isLocked) return;
    
    setResizeHandle(handle);
    setIsDragging(true);
    setDragMode('resize');
  };

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging || !selectedSprite) return;

    const containerRect = containerRef.current?.getBoundingClientRect();
    if (!containerRect) return;

    const mouseX = (e.clientX - containerRect.left - viewport.x) / viewport.zoom;
    const mouseY = (e.clientY - containerRect.top - viewport.y) / viewport.zoom;

    if (dragMode === 'move') {
      let newX = mouseX - dragOffset.x / viewport.zoom;
      let newY = mouseY - dragOffset.y / viewport.zoom;

      sprites.forEach(otherSprite => {
        if (otherSprite.id === selectedSprite.id) return;

        const otherRight = otherSprite.x + otherSprite.width;
        const otherBottom = otherSprite.y + otherSprite.height;
        const spriteRight = newX + selectedSprite.width;
        const spriteBottom = newY + selectedSprite.height;

        if (Math.abs(newX - otherRight) < SNAP_THRESHOLD) newX = otherRight;
        if (Math.abs(spriteRight - otherSprite.x) < SNAP_THRESHOLD) newX = otherSprite.x - selectedSprite.width;
        if (Math.abs(newX - otherSprite.x) < SNAP_THRESHOLD) newX = otherSprite.x;
        if (Math.abs(spriteRight - otherRight) < SNAP_THRESHOLD) newX = otherRight - selectedSprite.width;

        if (Math.abs(newY - otherBottom) < SNAP_THRESHOLD) newY = otherBottom;
        if (Math.abs(spriteBottom - otherSprite.y) < SNAP_THRESHOLD) newY = otherSprite.y - selectedSprite.height;
        if (Math.abs(newY - otherSprite.y) < SNAP_THRESHOLD) newY = otherSprite.y;
        if (Math.abs(spriteBottom - otherBottom) < SNAP_THRESHOLD) newY = otherBottom - selectedSprite.height;
      });

      updateMapSprite(garden.id, selectedSprite.id, { x: newX, y: newY });
    } else if (dragMode === 'resize' && resizeHandle) {
      let newWidth = selectedSprite.width;
      let newHeight = selectedSprite.height;
      let newX = selectedSprite.x;
      let newY = selectedSprite.y;

      if (resizeHandle.includes('e')) {
        newWidth = Math.max(50, mouseX - selectedSprite.x);
      }
      if (resizeHandle.includes('w')) {
        const delta = selectedSprite.x - mouseX;
        newWidth = Math.max(50, selectedSprite.width + delta);
        if (newWidth > 50) newX = mouseX;
      }
      if (resizeHandle.includes('s')) {
        newHeight = Math.max(50, mouseY - selectedSprite.y);
      }
      if (resizeHandle.includes('n')) {
        const delta = selectedSprite.y - mouseY;
        newHeight = Math.max(50, selectedSprite.height + delta);
        if (newHeight > 50) newY = mouseY;
      }

      updateMapSprite(garden.id, selectedSprite.id, { 
        width: newWidth, 
        height: newHeight,
        x: newX,
        y: newY 
      });
    }
  }, [isDragging, selectedSprite, dragMode, dragOffset, viewport, sprites, resizeHandle, garden.id, updateMapSprite]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setResizeHandle(null);
    if (dragMode === 'resize') setDragMode('move');
  }, [dragMode]);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    setViewport(prev => ({
      ...prev,
      zoom: Math.max(0.1, Math.min(3, prev.zoom + delta))
    }));
  }, []);

  const handleEdgeClick = (sprite: MapSprite, edge: 'top' | 'right' | 'bottom' | 'left') => {
    if (dragMode !== 'connect') return;

    if (!connectingFrom) {
      setConnectingFrom({ spriteId: sprite.id, edge });
    } else {
      if (connectingFrom.spriteId !== sprite.id) {
        const connection: MapSpriteConnection = {
          edge: connectingFrom.edge,
          targetSpriteId: sprite.id,
          targetEdge: edge
        };
        connectMapSprites(garden.id, connectingFrom.spriteId, connection);

        const reverseEdge = { top: 'bottom', bottom: 'top', left: 'right', right: 'left' }[edge] as 'top' | 'right' | 'bottom' | 'left';
        const reverseConnection: MapSpriteConnection = {
          edge: edge,
          targetSpriteId: connectingFrom.spriteId,
          targetEdge: connectingFrom.edge
        };
        connectMapSprites(garden.id, sprite.id, reverseConnection);
      }
      setConnectingFrom(null);
    }
  };

  const autoConnectSprites = () => {
    sprites.forEach(sprite => {
      sprites.forEach(otherSprite => {
        if (sprite.id === otherSprite.id) return;

        const spriteRight = sprite.x + sprite.width;
        const spriteBottom = sprite.y + sprite.height;
        const otherRight = otherSprite.x + otherSprite.width;
        const otherBottom = otherSprite.y + otherSprite.height;

        const verticalOverlap = 
          (sprite.y < otherBottom && spriteBottom > otherSprite.y);
        const horizontalOverlap = 
          (sprite.x < otherRight && spriteRight > otherSprite.x);

        if (Math.abs(spriteRight - otherSprite.x) < SNAP_THRESHOLD && verticalOverlap) {
          const hasConnection = sprite.connections.some(c => 
            c.targetSpriteId === otherSprite.id && c.edge === 'right'
          );
          if (!hasConnection) {
            connectMapSprites(garden.id, sprite.id, { edge: 'right', targetSpriteId: otherSprite.id, targetEdge: 'left' });
            connectMapSprites(garden.id, otherSprite.id, { edge: 'left', targetSpriteId: sprite.id, targetEdge: 'right' });
          }
        }

        if (Math.abs(spriteBottom - otherSprite.y) < SNAP_THRESHOLD && horizontalOverlap) {
          const hasConnection = sprite.connections.some(c => 
            c.targetSpriteId === otherSprite.id && c.edge === 'bottom'
          );
          if (!hasConnection) {
            connectMapSprites(garden.id, sprite.id, { edge: 'bottom', targetSpriteId: otherSprite.id, targetEdge: 'top' });
            connectMapSprites(garden.id, otherSprite.id, { edge: 'top', targetSpriteId: sprite.id, targetEdge: 'bottom' });
          }
        }
      });
    });
  };

  const handleBringToFront = () => {
    if (!selectedSprite) return;
    const maxZ = Math.max(...sprites.map(s => s.zIndex), 0);
    updateMapSprite(garden.id, selectedSprite.id, { zIndex: maxZ + 1 });
  };

  const handleSendToBack = () => {
    if (!selectedSprite) return;
    const minZ = Math.min(...sprites.map(s => s.zIndex), 0);
    updateMapSprite(garden.id, selectedSprite.id, { zIndex: minZ - 1 });
  };

  const handleResetSize = () => {
    if (!selectedSprite) return;
    updateMapSprite(garden.id, selectedSprite.id, { 
      width: selectedSprite.originalWidth, 
      height: selectedSprite.originalHeight 
    });
  };

  const renderConnectionLines = () => {
    if (!showConnections) return null;

    return sprites.flatMap(sprite =>
      sprite.connections.map((connection, idx) => {
        const targetSprite = sprites.find(s => s.id === connection.targetSpriteId);
        if (!targetSprite) return null;

        const getEdgeCenter = (s: MapSprite, edge: string) => {
          switch (edge) {
            case 'top': return { x: s.x + s.width / 2, y: s.y };
            case 'bottom': return { x: s.x + s.width / 2, y: s.y + s.height };
            case 'left': return { x: s.x, y: s.y + s.height / 2 };
            case 'right': return { x: s.x + s.width, y: s.y + s.height / 2 };
            default: return { x: s.x, y: s.y };
          }
        };

        const from = getEdgeCenter(sprite, connection.edge);
        const to = getEdgeCenter(targetSprite, connection.targetEdge);

        return (
          <line
            key={`${sprite.id}-${connection.targetSpriteId}-${idx}`}
            x1={from.x}
            y1={from.y}
            x2={to.x}
            y2={to.y}
            stroke={EDGE_COLORS[connection.edge]}
            strokeWidth={2 / viewport.zoom}
            strokeDasharray="5,5"
            className="pointer-events-none"
          />
        );
      })
    );
  };

  return (
    <div className="flex flex-col h-full">
      <div className="bg-slate-800 border-b border-slate-700 p-3 flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-1 bg-slate-700 rounded-lg p-1">
          <button
            onClick={() => { setDragMode('move'); setConnectingFrom(null); }}
            className={`p-2 rounded transition-colors ${dragMode === 'move' ? 'bg-amber-500 text-black' : 'text-white hover:bg-slate-600'}`}
            title="Move Mode"
          >
            <Move size={18} />
          </button>
          <button
            onClick={() => { setDragMode('connect'); }}
            className={`p-2 rounded transition-colors ${dragMode === 'connect' ? 'bg-amber-500 text-black' : 'text-white hover:bg-slate-600'}`}
            title="Connect Mode"
          >
            <Link2 size={18} />
          </button>
        </div>

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
          className="flex items-center gap-2 px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors"
        >
          <Upload size={16} />
          {uploadingImage ? 'Uploading...' : 'Add Map Image'}
        </button>

        <button
          onClick={autoConnectSprites}
          className="flex items-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
          title="Auto-connect nearby sprites"
        >
          <Link2 size={16} />
          Auto Connect
        </button>

        <div className="flex items-center gap-2 ml-auto">
          <button
            onClick={() => setShowConnections(!showConnections)}
            className={`p-2 rounded transition-colors ${showConnections ? 'bg-blue-500 text-white' : 'bg-slate-700 text-gray-400 hover:text-white'}`}
            title="Toggle connection lines"
          >
            {showConnections ? <Eye size={18} /> : <EyeOff size={18} />}
          </button>
          <button
            onClick={() => setViewport(prev => ({ ...prev, zoom: Math.max(0.1, prev.zoom - 0.25) }))}
            className="p-2 bg-slate-700 hover:bg-slate-600 text-white rounded"
          >
            <ZoomOut size={18} />
          </button>
          <span className="text-white text-sm w-16 text-center">{Math.round(viewport.zoom * 100)}%</span>
          <button
            onClick={() => setViewport(prev => ({ ...prev, zoom: Math.min(3, prev.zoom + 0.25) }))}
            className="p-2 bg-slate-700 hover:bg-slate-600 text-white rounded"
          >
            <ZoomIn size={18} />
          </button>
          <button
            onClick={() => setViewport({ x: 100, y: 100, zoom: 1 })}
            className="px-3 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded text-sm"
          >
            <RotateCcw size={18} />
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div
          ref={containerRef}
          className="flex-1 overflow-hidden bg-slate-950 relative cursor-crosshair"
          onWheel={handleWheel}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onClick={() => { setSelectedSpriteId(null); setConnectingFrom(null); }}
        >
          <div className="absolute inset-0 opacity-30"
            style={{
              backgroundImage: `
                linear-gradient(to right, #333 1px, transparent 1px),
                linear-gradient(to bottom, #333 1px, transparent 1px)
              `,
              backgroundSize: `${50 * viewport.zoom}px ${50 * viewport.zoom}px`,
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
            {sprites
              .slice()
              .sort((a, b) => a.zIndex - b.zIndex)
              .map(sprite => (
                <div
                  key={sprite.id}
                  className={`absolute cursor-pointer transition-shadow ${
                    selectedSpriteId === sprite.id 
                      ? 'ring-2 ring-amber-400 ring-offset-2 ring-offset-slate-900' 
                      : 'hover:ring-2 hover:ring-white/50'
                  } ${sprite.isLocked ? 'opacity-70' : ''}`}
                  style={{
                    left: sprite.x,
                    top: sprite.y,
                    width: sprite.width,
                    height: sprite.height,
                  }}
                  onMouseDown={(e) => handleSpriteMouseDown(e, sprite)}
                  onClick={(e) => e.stopPropagation()}
                >
                  <img
                    src={sprite.imagePath}
                    alt={sprite.name}
                    className="w-full h-full object-cover pointer-events-none"
                    draggable={false}
                  />

                  {sprite.isLocked && (
                    <div className="absolute top-2 right-2 bg-black/70 p-1 rounded">
                      <Lock size={14} className="text-amber-400" />
                    </div>
                  )}

                  {dragMode === 'connect' && (
                    <>
                      {(['top', 'right', 'bottom', 'left'] as const).map(edge => {
                        const isConnecting = connectingFrom?.spriteId === sprite.id && connectingFrom.edge === edge;
                        const hasConnection = sprite.connections.some(c => c.edge === edge);
                        
                        const positionStyles: Record<string, React.CSSProperties> = {
                          top: { top: -8, left: '50%', transform: 'translateX(-50%)' },
                          right: { right: -8, top: '50%', transform: 'translateY(-50%)' },
                          bottom: { bottom: -8, left: '50%', transform: 'translateX(-50%)' },
                          left: { left: -8, top: '50%', transform: 'translateY(-50%)' }
                        };

                        return (
                          <button
                            key={edge}
                            onClick={(e) => { e.stopPropagation(); handleEdgeClick(sprite, edge); }}
                            className={`absolute w-4 h-4 rounded-full border-2 transition-all ${
                              isConnecting 
                                ? 'bg-amber-400 border-amber-300 scale-125' 
                                : hasConnection 
                                  ? 'bg-green-500 border-green-400' 
                                  : 'bg-slate-600 border-slate-400 hover:bg-amber-400 hover:border-amber-300'
                            }`}
                            style={{ 
                              ...positionStyles[edge],
                              backgroundColor: hasConnection ? EDGE_COLORS[edge] : undefined
                            }}
                            title={`${edge} edge - ${hasConnection ? 'Connected' : 'Click to connect'}`}
                          />
                        );
                      })}
                    </>
                  )}

                  {selectedSpriteId === sprite.id && !sprite.isLocked && dragMode === 'move' && (
                    <>
                      {['nw', 'n', 'ne', 'w', 'e', 'sw', 's', 'se'].map(handle => {
                        const cursorMap: Record<string, string> = {
                          nw: 'nwse-resize', ne: 'nesw-resize',
                          sw: 'nesw-resize', se: 'nwse-resize',
                          n: 'ns-resize', s: 'ns-resize',
                          w: 'ew-resize', e: 'ew-resize'
                        };
                        const positionMap: Record<string, React.CSSProperties> = {
                          nw: { top: -4, left: -4 },
                          n: { top: -4, left: '50%', transform: 'translateX(-50%)' },
                          ne: { top: -4, right: -4 },
                          w: { top: '50%', left: -4, transform: 'translateY(-50%)' },
                          e: { top: '50%', right: -4, transform: 'translateY(-50%)' },
                          sw: { bottom: -4, left: -4 },
                          s: { bottom: -4, left: '50%', transform: 'translateX(-50%)' },
                          se: { bottom: -4, right: -4 }
                        };

                        return (
                          <div
                            key={handle}
                            className="absolute w-3 h-3 bg-amber-400 border border-amber-600 rounded-sm"
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

          {connectingFrom && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-amber-500 text-black px-4 py-2 rounded-lg font-medium z-50">
              Click another edge to connect, or click elsewhere to cancel
            </div>
          )}
        </div>

        {selectedSprite && (
          <div className="w-72 bg-slate-800 border-l border-slate-700 p-4 overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white">Sprite Settings</h3>
              <button
                onClick={() => setSelectedSpriteId(null)}
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
                  value={selectedSprite.name}
                  onChange={(e) => updateMapSprite(garden.id, selectedSprite.id, { name: e.target.value })}
                  className="w-full bg-slate-700 text-white rounded-lg px-3 py-2 border border-slate-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">X</label>
                  <input
                    type="number"
                    value={Math.round(selectedSprite.x)}
                    onChange={(e) => updateMapSprite(garden.id, selectedSprite.id, { x: parseInt(e.target.value) || 0 })}
                    className="w-full bg-slate-700 text-white rounded-lg px-3 py-2 border border-slate-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Y</label>
                  <input
                    type="number"
                    value={Math.round(selectedSprite.y)}
                    onChange={(e) => updateMapSprite(garden.id, selectedSprite.id, { y: parseInt(e.target.value) || 0 })}
                    className="w-full bg-slate-700 text-white rounded-lg px-3 py-2 border border-slate-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Width</label>
                  <input
                    type="number"
                    value={Math.round(selectedSprite.width)}
                    onChange={(e) => updateMapSprite(garden.id, selectedSprite.id, { width: parseInt(e.target.value) || 50 })}
                    className="w-full bg-slate-700 text-white rounded-lg px-3 py-2 border border-slate-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Height</label>
                  <input
                    type="number"
                    value={Math.round(selectedSprite.height)}
                    onChange={(e) => updateMapSprite(garden.id, selectedSprite.id, { height: parseInt(e.target.value) || 50 })}
                    className="w-full bg-slate-700 text-white rounded-lg px-3 py-2 border border-slate-600"
                  />
                </div>
              </div>

              <div className="text-xs text-gray-400">
                Original: {selectedSprite.originalWidth} × {selectedSprite.originalHeight}px
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleResetSize}
                  className="flex-1 flex items-center justify-center gap-2 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-sm"
                >
                  <Maximize2 size={14} />
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
                onClick={() => updateMapSprite(garden.id, selectedSprite.id, { isLocked: !selectedSprite.isLocked })}
                className={`w-full flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedSprite.isLocked 
                    ? 'bg-amber-500 text-black' 
                    : 'bg-slate-700 hover:bg-slate-600 text-white'
                }`}
              >
                {selectedSprite.isLocked ? <Unlock size={14} /> : <Lock size={14} />}
                {selectedSprite.isLocked ? 'Unlock' : 'Lock'}
              </button>

              {selectedSprite.connections.length > 0 && (
                <div className="border-t border-slate-700 pt-4">
                  <h4 className="text-sm font-medium text-gray-300 mb-2">Connections</h4>
                  <div className="space-y-2">
                    {selectedSprite.connections.map((conn, idx) => {
                      const targetSprite = sprites.find(s => s.id === conn.targetSpriteId);
                      return (
                        <div key={idx} className="flex items-center justify-between bg-slate-700/50 rounded px-3 py-2 text-sm">
                          <span className="text-gray-300">
                            <span style={{ color: EDGE_COLORS[conn.edge] }}>{conn.edge}</span>
                            {' → '}
                            {targetSprite?.name || 'Unknown'}
                          </span>
                          <button
                            onClick={() => disconnectMapSprites(garden.id, selectedSprite.id, conn.targetSpriteId)}
                            className="text-red-400 hover:text-red-300"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              <button
                onClick={() => {
                  removeMapSprite(garden.id, selectedSprite.id);
                  setSelectedSpriteId(null);
                }}
                className="w-full flex items-center justify-center gap-2 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium"
              >
                <Trash2 size={14} />
                Delete Sprite
              </button>
            </div>
          </div>
        )}
      </div>

      {sprites.length > 0 && !selectedSprite && (
        <div className="absolute bottom-4 left-4 bg-slate-800/90 backdrop-blur-sm rounded-lg p-3 max-w-xs">
          <h4 className="text-sm font-medium text-white mb-2">Map Sprites ({sprites.length})</h4>
          <div className="flex flex-wrap gap-2">
            {sprites.map(sprite => (
              <button
                key={sprite.id}
                onClick={() => setSelectedSpriteId(sprite.id)}
                className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 px-2 py-1 rounded text-xs text-white"
              >
                <Image size={12} />
                {sprite.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}