import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface EdgeColorData {
  top: string[];
  right: string[];
  bottom: string[];
  left: string[];
}

export interface EdgeSignature {
  edge: 'top' | 'right' | 'bottom' | 'left';
  colorSamples: string[];
  averageColor: string;
}

export interface MapPieceConnection {
  pieceId: string;
  fromEdge: 'top' | 'right' | 'bottom' | 'left';
  toEdge: 'top' | 'right' | 'bottom' | 'left';
}

export interface MapPiece {
  id: string;
  name: string;
  imagePath: string;
  x: number;
  y: number;
  width: number;
  height: number;
  originalWidth: number;
  originalHeight: number;
  scale: number;
  zIndex: number;
  isLocked: boolean;
  connections: MapPieceConnection[];
  edgeSignatures?: EdgeSignature[];
  edgeColors?: EdgeColorData;
}

interface MapEditorViewport {
  x: number;
  y: number;
  zoom: number;
}

interface MapEditorState {
  pieces: MapPiece[];
  selectedPieceId: string | null;
  viewport: MapEditorViewport;
  isEditorOpen: boolean;
  showConnections: boolean;
  snapEnabled: boolean;
  snapThreshold: number;

  addPiece: (piece: MapPiece) => void;
  updatePiece: (id: string, updates: Partial<MapPiece>) => void;
  removePiece: (id: string) => void;
  selectPiece: (id: string | null) => void;
  
  setViewport: (viewport: Partial<MapEditorViewport>) => void;
  resetViewport: () => void;
  zoomToFit: () => void;
  
  setEditorOpen: (open: boolean) => void;
  setShowConnections: (show: boolean) => void;
  setSnapEnabled: (enabled: boolean) => void;
  
  connectPieces: (pieceId: string, connection: MapPieceConnection) => void;
  disconnectPieces: (pieceId: string, targetPieceId: string) => void;
  autoConnectNearbyPieces: () => void;
  
  getMapBounds: () => { minX: number; minY: number; maxX: number; maxY: number; width: number; height: number };
  findSnapPosition: (pieceId: string, dragX: number, dragY: number) => { x: number; y: number; snappedTo: { pieceId: string; edge: string } | null };
}

const SNAP_THRESHOLD = 30;

export const useMapEditorStore = create<MapEditorState>()(
  persist(
    (set, get) => ({
      pieces: [],
      selectedPieceId: null,
      viewport: { x: 0, y: 0, zoom: 0.5 },
      isEditorOpen: false,
      showConnections: true,
      snapEnabled: true,
      snapThreshold: SNAP_THRESHOLD,

      addPiece: (piece) => set((state) => ({
        pieces: [...state.pieces, piece],
        selectedPieceId: piece.id,
      })),

      updatePiece: (id, updates) => set((state) => ({
        pieces: state.pieces.map((piece) =>
          piece.id === id ? { ...piece, ...updates } : piece
        ),
      })),

      removePiece: (id) => set((state) => ({
        pieces: state.pieces.filter((piece) => piece.id !== id).map(piece => ({
          ...piece,
          connections: piece.connections.filter(c => c.pieceId !== id)
        })),
        selectedPieceId: state.selectedPieceId === id ? null : state.selectedPieceId,
      })),

      selectPiece: (id) => set({ selectedPieceId: id }),

      setViewport: (viewport) => set((state) => ({
        viewport: { ...state.viewport, ...viewport },
      })),

      resetViewport: () => set({
        viewport: { x: 0, y: 0, zoom: 0.5 },
      }),

      zoomToFit: () => {
        const bounds = get().getMapBounds();
        if (bounds.width === 0 || bounds.height === 0) return;
        
        const padding = 100;
        const viewportWidth = window.innerWidth - padding * 2;
        const viewportHeight = window.innerHeight - padding * 2;
        
        const scaleX = viewportWidth / bounds.width;
        const scaleY = viewportHeight / bounds.height;
        const zoom = Math.min(scaleX, scaleY, 1);
        
        const centerX = bounds.minX + bounds.width / 2;
        const centerY = bounds.minY + bounds.height / 2;
        
        set({
          viewport: {
            x: window.innerWidth / 2 - centerX * zoom,
            y: window.innerHeight / 2 - centerY * zoom,
            zoom,
          },
        });
      },

      setEditorOpen: (open) => set({ isEditorOpen: open }),
      setShowConnections: (show) => set({ showConnections: show }),
      setSnapEnabled: (enabled) => set({ snapEnabled: enabled }),

      connectPieces: (pieceId, connection) => set((state) => ({
        pieces: state.pieces.map((piece) =>
          piece.id === pieceId
            ? { 
                ...piece, 
                connections: [
                  ...piece.connections.filter(c => c.pieceId !== connection.pieceId),
                  connection
                ]
              }
            : piece
        ),
      })),

      disconnectPieces: (pieceId, targetPieceId) => set((state) => ({
        pieces: state.pieces.map((piece) =>
          piece.id === pieceId || piece.id === targetPieceId
            ? {
                ...piece,
                connections: piece.connections.filter(c => 
                  c.pieceId !== targetPieceId && c.pieceId !== pieceId
                ),
              }
            : piece
        ),
      })),

      autoConnectNearbyPieces: () => {
        const { pieces, snapThreshold, connectPieces } = get();
        
        pieces.forEach(piece => {
          pieces.forEach(other => {
            if (piece.id === other.id) return;
            
            const pieceRight = piece.x + piece.width;
            const pieceBottom = piece.y + piece.height;
            const otherRight = other.x + other.width;
            const otherBottom = other.y + other.height;
            
            const verticalOverlap = piece.y < otherBottom && pieceBottom > other.y;
            const horizontalOverlap = piece.x < otherRight && pieceRight > other.x;
            
            if (Math.abs(pieceRight - other.x) < snapThreshold && verticalOverlap) {
              const hasConnection = piece.connections.some(c => 
                c.pieceId === other.id && c.fromEdge === 'right'
              );
              if (!hasConnection) {
                connectPieces(piece.id, { pieceId: other.id, fromEdge: 'right', toEdge: 'left' });
                connectPieces(other.id, { pieceId: piece.id, fromEdge: 'left', toEdge: 'right' });
              }
            }
            
            if (Math.abs(pieceBottom - other.y) < snapThreshold && horizontalOverlap) {
              const hasConnection = piece.connections.some(c => 
                c.pieceId === other.id && c.fromEdge === 'bottom'
              );
              if (!hasConnection) {
                connectPieces(piece.id, { pieceId: other.id, fromEdge: 'bottom', toEdge: 'top' });
                connectPieces(other.id, { pieceId: piece.id, fromEdge: 'top', toEdge: 'bottom' });
              }
            }
          });
        });
      },

      getMapBounds: () => {
        const { pieces } = get();
        if (pieces.length === 0) {
          return { minX: 0, minY: 0, maxX: 0, maxY: 0, width: 0, height: 0 };
        }
        
        let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
        
        pieces.forEach(piece => {
          minX = Math.min(minX, piece.x);
          minY = Math.min(minY, piece.y);
          maxX = Math.max(maxX, piece.x + piece.width);
          maxY = Math.max(maxY, piece.y + piece.height);
        });
        
        return {
          minX,
          minY,
          maxX,
          maxY,
          width: maxX - minX,
          height: maxY - minY,
        };
      },

      findSnapPosition: (pieceId, dragX, dragY) => {
        const { pieces, snapThreshold, snapEnabled } = get();
        if (!snapEnabled) return { x: dragX, y: dragY, snappedTo: null };
        
        const piece = pieces.find(p => p.id === pieceId);
        if (!piece) return { x: dragX, y: dragY, snappedTo: null };
        
        let snapX = dragX;
        let snapY = dragY;
        let snappedTo: { pieceId: string; edge: string } | null = null;
        let minDistance = snapThreshold;
        
        pieces.forEach(other => {
          if (other.id === pieceId) return;
          
          const pieceRight = dragX + piece.width;
          const pieceBottom = dragY + piece.height;
          const otherRight = other.x + other.width;
          const otherBottom = other.y + other.height;
          
          const verticalOverlap = dragY < otherBottom + snapThreshold && pieceBottom > other.y - snapThreshold;
          const horizontalOverlap = dragX < otherRight + snapThreshold && pieceRight > other.x - snapThreshold;
          
          if (verticalOverlap) {
            const distRight = Math.abs(pieceRight - other.x);
            if (distRight < minDistance) {
              minDistance = distRight;
              snapX = other.x - piece.width;
              snappedTo = { pieceId: other.id, edge: 'right-to-left' };
            }
            
            const distLeft = Math.abs(dragX - otherRight);
            if (distLeft < minDistance) {
              minDistance = distLeft;
              snapX = otherRight;
              snappedTo = { pieceId: other.id, edge: 'left-to-right' };
            }
          }
          
          if (horizontalOverlap) {
            const distBottom = Math.abs(pieceBottom - other.y);
            if (distBottom < minDistance) {
              minDistance = distBottom;
              snapY = other.y - piece.height;
              snappedTo = { pieceId: other.id, edge: 'bottom-to-top' };
            }
            
            const distTop = Math.abs(dragY - otherBottom);
            if (distTop < minDistance) {
              minDistance = distTop;
              snapY = otherBottom;
              snappedTo = { pieceId: other.id, edge: 'top-to-bottom' };
            }
          }
          
          if (verticalOverlap && snappedTo?.edge.includes('right') || snappedTo?.edge.includes('left')) {
            const topDist = Math.abs(dragY - other.y);
            const bottomDist = Math.abs(pieceBottom - otherBottom);
            if (topDist < snapThreshold) snapY = other.y;
            else if (bottomDist < snapThreshold) snapY = otherBottom - piece.height;
          }
          
          if (horizontalOverlap && snappedTo?.edge.includes('top') || snappedTo?.edge.includes('bottom')) {
            const leftDist = Math.abs(dragX - other.x);
            const rightDist = Math.abs(pieceRight - otherRight);
            if (leftDist < snapThreshold) snapX = other.x;
            else if (rightDist < snapThreshold) snapX = otherRight - piece.width;
          }
        });
        
        return { x: snapX, y: snapY, snappedTo };
      },
    }),
    {
      name: 'map-editor-storage',
      partialize: (state) => ({
        pieces: state.pieces,
        showConnections: state.showConnections,
        snapEnabled: state.snapEnabled,
      }),
    }
  )
);
