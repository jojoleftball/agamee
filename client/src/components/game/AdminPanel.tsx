import { useState } from 'react';
import { motion } from 'framer-motion';
import { useSettingsStore, HUDPositions } from '@/lib/stores/useSettingsStore';
import { ChevronLeft, ChevronRight, ChevronUp, ChevronDown, RotateCcw, Minus, Plus } from 'lucide-react';

type ElementKey = keyof HUDPositions;

interface ControlButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  size?: 'sm' | 'md';
}

function ControlButton({ onClick, children, size = 'md' }: ControlButtonProps) {
  const sizeClass = size === 'sm' ? 'w-8 h-8' : 'w-10 h-10';
  return (
    <button
      onClick={onClick}
      className={`${sizeClass} bg-white/90 rounded-lg flex items-center justify-center shadow-md active:scale-95 transition-transform border border-gray-200`}
    >
      {children}
    </button>
  );
}

interface ElementEditorProps {
  elementKey: ElementKey;
  label: string;
  previewSrc: string;
  value: number;
}

function ElementEditor({ elementKey, label, previewSrc, value }: ElementEditorProps) {
  const { hudPositions, setHUDPosition } = useSettingsStore();
  const pos = hudPositions[elementKey];

  const adjustPosition = (axis: 'x' | 'y', delta: number) => {
    setHUDPosition(elementKey, { [axis]: pos[axis] + delta });
  };

  const adjustTextOffset = (axis: 'textOffsetX' | 'textOffsetY', delta: number) => {
    setHUDPosition(elementKey, { [axis]: pos[axis] + delta });
  };

  const adjustFontSize = (delta: number) => {
    setHUDPosition(elementKey, { fontSize: Math.max(8, Math.min(32, pos.fontSize + delta)) });
  };

  const adjustScale = (delta: number) => {
    setHUDPosition(elementKey, { scale: Math.max(0.5, Math.min(2, pos.scale + delta)) });
  };

  return (
    <div className="bg-white/95 rounded-xl p-3 shadow-lg border border-gray-200">
      <div className="flex items-center gap-3 mb-3">
        <div 
          className="relative flex-shrink-0"
          style={{ 
            width: elementKey === 'levelCircle' ? 40 : 70, 
            height: elementKey === 'levelCircle' ? 40 : 28,
          }}
        >
          <img src={previewSrc} alt={label} className="w-full h-full object-contain" />
          <div 
            className="absolute inset-0 flex items-center justify-center font-bold text-amber-800"
            style={{ 
              fontSize: pos.fontSize * 0.6,
              transform: `translate(${pos.textOffsetX * 0.5}px, ${pos.textOffsetY * 0.5}px)`,
            }}
          >
            {value}
          </div>
        </div>
        <span className="font-semibold text-gray-800 text-sm">{label}</span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <span className="text-xs text-gray-500 font-medium">Position</span>
          <div className="flex items-center justify-center gap-1">
            <ControlButton onClick={() => adjustPosition('x', -2)} size="sm">
              <ChevronLeft className="w-4 h-4 text-gray-700" />
            </ControlButton>
            <div className="flex flex-col gap-1">
              <ControlButton onClick={() => adjustPosition('y', -2)} size="sm">
                <ChevronUp className="w-4 h-4 text-gray-700" />
              </ControlButton>
              <ControlButton onClick={() => adjustPosition('y', 2)} size="sm">
                <ChevronDown className="w-4 h-4 text-gray-700" />
              </ControlButton>
            </div>
            <ControlButton onClick={() => adjustPosition('x', 2)} size="sm">
              <ChevronRight className="w-4 h-4 text-gray-700" />
            </ControlButton>
          </div>
          <div className="text-xs text-center text-gray-400">
            x:{pos.x} y:{pos.y}
          </div>
        </div>

        <div className="space-y-1">
          <span className="text-xs text-gray-500 font-medium">Text Position</span>
          <div className="flex items-center justify-center gap-1">
            <ControlButton onClick={() => adjustTextOffset('textOffsetX', -1)} size="sm">
              <ChevronLeft className="w-4 h-4 text-blue-600" />
            </ControlButton>
            <div className="flex flex-col gap-1">
              <ControlButton onClick={() => adjustTextOffset('textOffsetY', -1)} size="sm">
                <ChevronUp className="w-4 h-4 text-blue-600" />
              </ControlButton>
              <ControlButton onClick={() => adjustTextOffset('textOffsetY', 1)} size="sm">
                <ChevronDown className="w-4 h-4 text-blue-600" />
              </ControlButton>
            </div>
            <ControlButton onClick={() => adjustTextOffset('textOffsetX', 1)} size="sm">
              <ChevronRight className="w-4 h-4 text-blue-600" />
            </ControlButton>
          </div>
          <div className="text-xs text-center text-gray-400">
            x:{pos.textOffsetX} y:{pos.textOffsetY}
          </div>
        </div>
      </div>

      <div className="flex gap-3 mt-3">
        <div className="flex-1 space-y-1">
          <span className="text-xs text-gray-500 font-medium">Font Size</span>
          <div className="flex items-center justify-center gap-2">
            <ControlButton onClick={() => adjustFontSize(-1)} size="sm">
              <Minus className="w-3 h-3 text-gray-700" />
            </ControlButton>
            <span className="text-sm font-mono w-8 text-center">{pos.fontSize}</span>
            <ControlButton onClick={() => adjustFontSize(1)} size="sm">
              <Plus className="w-3 h-3 text-gray-700" />
            </ControlButton>
          </div>
        </div>

        <div className="flex-1 space-y-1">
          <span className="text-xs text-gray-500 font-medium">Scale</span>
          <div className="flex items-center justify-center gap-2">
            <ControlButton onClick={() => adjustScale(-0.1)} size="sm">
              <Minus className="w-3 h-3 text-gray-700" />
            </ControlButton>
            <span className="text-sm font-mono w-10 text-center">{pos.scale.toFixed(1)}</span>
            <ControlButton onClick={() => adjustScale(0.1)} size="sm">
              <Plus className="w-3 h-3 text-gray-700" />
            </ControlButton>
          </div>
        </div>
      </div>
    </div>
  );
}

interface AdminPanelProps {
  onBack: () => void;
}

export default function AdminPanel({ onBack }: AdminPanelProps) {
  const { hudPositions, resetHUDPositions } = useSettingsStore();
  const [activeTab, setActiveTab] = useState<'hud' | 'text'>('hud');

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-gradient-to-b from-amber-50 to-orange-50 rounded-2xl w-full max-w-md max-h-[90vh] overflow-hidden shadow-2xl flex flex-col"
      >
        <div className="bg-gradient-to-r from-amber-600 to-orange-600 p-4 flex items-center gap-3">
          <button
            onClick={onBack}
            className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center"
          >
            <ChevronLeft className="w-6 h-6 text-white" />
          </button>
          <h2 className="text-xl font-bold text-white">Admin Panel</h2>
        </div>

        <div className="flex border-b border-amber-200">
          <button
            onClick={() => setActiveTab('hud')}
            className={`flex-1 py-3 text-sm font-semibold transition-colors ${
              activeTab === 'hud' 
                ? 'text-amber-700 border-b-2 border-amber-600 bg-amber-100/50' 
                : 'text-gray-500'
            }`}
          >
            HUD Elements
          </button>
          <button
            onClick={() => setActiveTab('text')}
            className={`flex-1 py-3 text-sm font-semibold transition-colors ${
              activeTab === 'text' 
                ? 'text-amber-700 border-b-2 border-amber-600 bg-amber-100/50' 
                : 'text-gray-500'
            }`}
          >
            Preview
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {activeTab === 'hud' && (
            <div className="space-y-4">
              <ElementEditor
                elementKey="levelCircle"
                label="Level Circle"
                previewSrc="/sprites/hud/level-circle.png"
                value={1}
              />
              <ElementEditor
                elementKey="coinsBar"
                label="Coins Bar"
                previewSrc="/sprites/hud/coins-bar.png"
                value={800}
              />
              <ElementEditor
                elementKey="gemsBar"
                label="Gems Bar"
                previewSrc="/sprites/hud/gems-bar.png"
                value={50}
              />
            </div>
          )}

          {activeTab === 'text' && (
            <div className="space-y-4">
              <div 
                className="relative bg-gradient-to-b from-green-600 to-green-800 rounded-xl p-4 min-h-[200px]"
                style={{ backgroundImage: 'url(/game-assets/middle-garden-view.jpg)', backgroundSize: 'cover' }}
              >
                <div className="absolute inset-0 bg-black/20 rounded-xl" />
                <div className="relative flex items-start gap-1">
                  <div
                    className="relative flex-shrink-0"
                    style={{
                      width: 52 * hudPositions.levelCircle.scale,
                      height: 52 * hudPositions.levelCircle.scale,
                      transform: `translate(${hudPositions.levelCircle.x}px, ${hudPositions.levelCircle.y}px)`,
                    }}
                  >
                    <img
                      src="/sprites/hud/level-circle.png"
                      alt="Level"
                      className="w-full h-full object-contain"
                    />
                    <div
                      className="absolute inset-0 flex items-center justify-center font-bold text-amber-900"
                      style={{
                        fontSize: hudPositions.levelCircle.fontSize,
                        transform: `translate(${hudPositions.levelCircle.textOffsetX}px, ${hudPositions.levelCircle.textOffsetY}px)`,
                      }}
                    >
                      1
                    </div>
                  </div>

                  <div
                    className="relative flex-shrink-0"
                    style={{
                      width: 110 * hudPositions.coinsBar.scale,
                      height: 36 * hudPositions.coinsBar.scale,
                      marginTop: 8,
                      marginLeft: -8,
                      transform: `translate(${hudPositions.coinsBar.x}px, ${hudPositions.coinsBar.y}px)`,
                    }}
                  >
                    <img
                      src="/sprites/hud/coins-bar.png"
                      alt="Coins"
                      className="w-full h-full object-contain"
                    />
                    <div
                      className="absolute inset-0 flex items-center justify-center font-bold text-amber-800"
                      style={{
                        fontSize: hudPositions.coinsBar.fontSize,
                        paddingLeft: '35%',
                        transform: `translate(${hudPositions.coinsBar.textOffsetX}px, ${hudPositions.coinsBar.textOffsetY}px)`,
                      }}
                    >
                      800
                    </div>
                  </div>

                  <div
                    className="relative flex-shrink-0"
                    style={{
                      width: 110 * hudPositions.gemsBar.scale,
                      height: 36 * hudPositions.gemsBar.scale,
                      marginTop: 8,
                      marginLeft: -8,
                      transform: `translate(${hudPositions.gemsBar.x}px, ${hudPositions.gemsBar.y}px)`,
                    }}
                  >
                    <img
                      src="/sprites/hud/gems-bar.png"
                      alt="Gems"
                      className="w-full h-full object-contain"
                    />
                    <div
                      className="absolute inset-0 flex items-center justify-center font-bold text-emerald-800"
                      style={{
                        fontSize: hudPositions.gemsBar.fontSize,
                        paddingLeft: '35%',
                        transform: `translate(${hudPositions.gemsBar.textOffsetX}px, ${hudPositions.gemsBar.textOffsetY}px)`,
                      }}
                    >
                      50
                    </div>
                  </div>
                </div>
              </div>
              <p className="text-sm text-gray-600 text-center">
                Live preview of HUD with your settings
              </p>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-amber-200 bg-amber-50/50">
          <button
            onClick={resetHUDPositions}
            className="w-full py-3 bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold rounded-xl flex items-center justify-center gap-2 active:scale-98 transition-transform shadow-md"
          >
            <RotateCcw className="w-5 h-5" />
            Reset All to Default
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
