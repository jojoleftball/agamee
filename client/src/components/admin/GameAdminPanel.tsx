import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Plus, Trash2, ChevronLeft, ChevronRight, Package, 
  Map, Gift, Store, Calendar, Settings, Upload, Download,
  ZoomIn, ZoomOut, Move, Link, Layers, Image, Edit2
} from 'lucide-react';
import { useAdminStore, AdminMergeItem, AdminGarden, AdminChest, AdminStoreItem, AdminEvent } from '@/lib/stores/useAdminStore';
import { ItemCategory } from '@/lib/mergeData';

interface GameAdminPanelProps {
  onClose: () => void;
}

type AdminTab = 'items' | 'gardens' | 'chests' | 'store' | 'events';

const ITEM_CATEGORIES: { value: ItemCategory; label: string; color: string }[] = [
  { value: 'flower', label: 'Flower', color: 'bg-pink-500' },
  { value: 'vegetable', label: 'Vegetable', color: 'bg-green-500' },
  { value: 'tree', label: 'Tree', color: 'bg-emerald-600' },
  { value: 'tool', label: 'Tool', color: 'bg-amber-500' },
  { value: 'decoration', label: 'Decoration', color: 'bg-purple-500' },
  { value: 'generator', label: 'Generator', color: 'bg-blue-500' },
  { value: 'chest', label: 'Chest', color: 'bg-yellow-600' },
  { value: 'currency', label: 'Currency', color: 'bg-yellow-400' },
  { value: 'blocked', label: 'Blocked', color: 'bg-gray-500' },
];

export default function GameAdminPanel({ onClose }: GameAdminPanelProps) {
  const [activeTab, setActiveTab] = useState<AdminTab>('items');
  const { exportConfig, importConfig, resetToDefaults } = useAdminStore();

  const handleExport = () => {
    const config = exportConfig();
    const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'game-config.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const text = await file.text();
        try {
          const config = JSON.parse(text);
          importConfig(config);
        } catch (err) {
          console.error('Failed to parse config file:', err);
        }
      }
    };
    input.click();
  };

  const tabs: { id: AdminTab; label: string; icon: React.ReactNode }[] = [
    { id: 'items', label: 'Items', icon: <Package size={20} /> },
    { id: 'gardens', label: 'Gardens', icon: <Map size={20} /> },
    { id: 'chests', label: 'Chests', icon: <Gift size={20} /> },
    { id: 'store', label: 'Store', icon: <Store size={20} /> },
    { id: 'events', label: 'Events', icon: <Calendar size={20} /> },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex flex-col"
    >
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 px-4 py-3 flex items-center justify-between border-b border-slate-700">
        <div className="flex items-center gap-3">
          <Settings className="text-amber-400" size={24} />
          <h1 className="text-xl font-bold text-white">Game Admin Panel</h1>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleImport}
            className="flex items-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
          >
            <Upload size={16} />
            Import
          </button>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors"
          >
            <Download size={16} />
            Export
          </button>
          <button
            onClick={resetToDefaults}
            className="flex items-center gap-2 px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors"
          >
            <Trash2 size={16} />
            Reset
          </button>
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center text-white hover:bg-white/10 rounded-lg transition-colors"
          >
            <X size={24} />
          </button>
        </div>
      </div>

      <div className="flex border-b border-slate-700 bg-slate-800">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-6 py-3 font-medium transition-colors ${
              activeTab === tab.id
                ? 'text-amber-400 border-b-2 border-amber-400 bg-slate-700/50'
                : 'text-gray-400 hover:text-white hover:bg-slate-700/30'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-hidden bg-slate-900">
        <AnimatePresence mode="wait">
          {activeTab === 'items' && <ItemsManager key="items" />}
          {activeTab === 'gardens' && <GardensManager key="gardens" />}
          {activeTab === 'chests' && <ChestsManager key="chests" />}
          {activeTab === 'store' && <StoreManager key="store" />}
          {activeTab === 'events' && <EventsManager key="events" />}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

function ItemsManager() {
  const { items, addItem, updateItem, removeItem, selectedItemId, setSelectedItemId } = useAdminStore();
  const [showNewItemForm, setShowNewItemForm] = useState(false);
  const [newItem, setNewItem] = useState<Partial<AdminMergeItem>>({
    category: 'flower',
    level: 1,
    maxLevel: 10,
    coinValue: 10,
    xpValue: 5,
    sellPrice: 5,
    spriteX: 0,
    spriteY: 0,
    spriteW: 128,
    spriteH: 128,
  });
  const [filterCategory, setFilterCategory] = useState<ItemCategory | 'all'>('all');

  const filteredItems = Object.values(items).filter(
    (item) => filterCategory === 'all' || item.category === filterCategory
  );

  const handleCreateItem = () => {
    if (!newItem.id || !newItem.name) return;
    addItem({
      id: newItem.id,
      name: newItem.name,
      description: newItem.description || '',
      category: newItem.category || 'flower',
      level: newItem.level || 1,
      maxLevel: newItem.maxLevel || 10,
      sprite: newItem.sprite || '',
      spriteX: newItem.spriteX || 0,
      spriteY: newItem.spriteY || 0,
      spriteW: newItem.spriteW || 128,
      spriteH: newItem.spriteH || 128,
      coinValue: newItem.coinValue || 0,
      xpValue: newItem.xpValue || 0,
      sellPrice: newItem.sellPrice || 0,
      mergesInto: newItem.mergesInto,
      isGenerator: newItem.isGenerator,
      generates: newItem.generates,
      generationTime: newItem.generationTime,
      maxCharges: newItem.maxCharges,
      energyCost: newItem.energyCost,
      isChest: newItem.isChest,
      chestRewards: newItem.chestRewards,
      isBlocked: newItem.isBlocked,
    });
    setNewItem({
      category: 'flower',
      level: 1,
      maxLevel: 10,
      coinValue: 10,
      xpValue: 5,
      sellPrice: 5,
      spriteX: 0,
      spriteY: 0,
      spriteW: 128,
      spriteH: 128,
    });
    setShowNewItemForm(false);
  };

  const selectedItem = selectedItemId ? items[selectedItemId] : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex h-full"
    >
      <div className="w-80 bg-slate-800 border-r border-slate-700 flex flex-col">
        <div className="p-4 border-b border-slate-700">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold text-white">Items</h2>
            <button
              onClick={() => setShowNewItemForm(true)}
              className="flex items-center gap-1 px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-black rounded-lg text-sm font-medium"
            >
              <Plus size={16} />
              Add
            </button>
          </div>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value as ItemCategory | 'all')}
            className="w-full bg-slate-700 text-white rounded-lg px-3 py-2 text-sm border border-slate-600"
          >
            <option value="all">All Categories</option>
            {ITEM_CATEGORIES.map((cat) => (
              <option key={cat.value} value={cat.value}>{cat.label}</option>
            ))}
          </select>
        </div>
        
        <div className="flex-1 overflow-y-auto p-2">
          {filteredItems.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              No items yet. Add your first item!
            </div>
          ) : (
            <div className="space-y-1">
              {filteredItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setSelectedItemId(item.id)}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors ${
                    selectedItemId === item.id
                      ? 'bg-amber-500/20 border border-amber-500/50'
                      : 'bg-slate-700/50 hover:bg-slate-700 border border-transparent'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    ITEM_CATEGORIES.find((c) => c.value === item.category)?.color || 'bg-gray-500'
                  }`}>
                    <Package size={20} className="text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-white truncate">{item.name}</div>
                    <div className="text-xs text-gray-400">Lvl {item.level} · {item.category}</div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        {showNewItemForm ? (
          <div className="max-w-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Create New Item</h2>
              <button
                onClick={() => setShowNewItemForm(false)}
                className="text-gray-400 hover:text-white"
              >
                <X size={24} />
              </button>
            </div>
            <ItemForm
              item={newItem}
              onChange={setNewItem}
              onSave={handleCreateItem}
              onCancel={() => setShowNewItemForm(false)}
              isNew
            />
          </div>
        ) : selectedItem ? (
          <div className="max-w-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Edit Item: {selectedItem.name}</h2>
              <button
                onClick={() => {
                  removeItem(selectedItem.id);
                  setSelectedItemId(null);
                }}
                className="flex items-center gap-2 px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium"
              >
                <Trash2 size={16} />
                Delete
              </button>
            </div>
            <ItemForm
              item={selectedItem}
              onChange={(updates) => updateItem(selectedItem.id, updates)}
              onSave={() => {}}
              onCancel={() => setSelectedItemId(null)}
              isNew={false}
            />
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            Select an item to edit or create a new one
          </div>
        )}
      </div>
    </motion.div>
  );
}

interface ItemFormProps {
  item: Partial<AdminMergeItem>;
  onChange: (updates: Partial<AdminMergeItem>) => void;
  onSave: () => void;
  onCancel: () => void;
  isNew: boolean;
}

function ItemForm({ item, onChange, onSave, onCancel, isNew }: ItemFormProps) {
  const isGenerator = item.category === 'generator' || item.isGenerator;
  const isChest = item.category === 'chest' || item.isChest;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Item ID</label>
          <input
            type="text"
            value={item.id || ''}
            onChange={(e) => onChange({ id: e.target.value })}
            disabled={!isNew}
            className="w-full bg-slate-700 text-white rounded-lg px-3 py-2 border border-slate-600 disabled:opacity-50"
            placeholder="unique_item_id"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Name</label>
          <input
            type="text"
            value={item.name || ''}
            onChange={(e) => onChange({ name: e.target.value })}
            className="w-full bg-slate-700 text-white rounded-lg px-3 py-2 border border-slate-600"
            placeholder="Item Name"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
        <textarea
          value={item.description || ''}
          onChange={(e) => onChange({ description: e.target.value })}
          className="w-full bg-slate-700 text-white rounded-lg px-3 py-2 border border-slate-600 h-20 resize-none"
          placeholder="Item description..."
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Category</label>
          <select
            value={item.category || 'flower'}
            onChange={(e) => onChange({ category: e.target.value as ItemCategory })}
            className="w-full bg-slate-700 text-white rounded-lg px-3 py-2 border border-slate-600"
          >
            {ITEM_CATEGORIES.map((cat) => (
              <option key={cat.value} value={cat.value}>{cat.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Level</label>
          <input
            type="number"
            value={item.level || 1}
            onChange={(e) => onChange({ level: parseInt(e.target.value) })}
            className="w-full bg-slate-700 text-white rounded-lg px-3 py-2 border border-slate-600"
            min="1"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Max Level</label>
          <input
            type="number"
            value={item.maxLevel || 10}
            onChange={(e) => onChange({ maxLevel: parseInt(e.target.value) })}
            className="w-full bg-slate-700 text-white rounded-lg px-3 py-2 border border-slate-600"
            min="1"
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Coin Value</label>
          <input
            type="number"
            value={item.coinValue || 0}
            onChange={(e) => onChange({ coinValue: parseInt(e.target.value) })}
            className="w-full bg-slate-700 text-white rounded-lg px-3 py-2 border border-slate-600"
            min="0"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">XP Value</label>
          <input
            type="number"
            value={item.xpValue || 0}
            onChange={(e) => onChange({ xpValue: parseInt(e.target.value) })}
            className="w-full bg-slate-700 text-white rounded-lg px-3 py-2 border border-slate-600"
            min="0"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Sell Price</label>
          <input
            type="number"
            value={item.sellPrice || 0}
            onChange={(e) => onChange({ sellPrice: parseInt(e.target.value) })}
            className="w-full bg-slate-700 text-white rounded-lg px-3 py-2 border border-slate-600"
            min="0"
          />
        </div>
      </div>

      <div className="border-t border-slate-700 pt-4">
        <h3 className="text-lg font-medium text-white mb-3">Sprite Settings</h3>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Sprite Path</label>
          <input
            type="text"
            value={item.sprite || ''}
            onChange={(e) => onChange({ sprite: e.target.value })}
            className="w-full bg-slate-700 text-white rounded-lg px-3 py-2 border border-slate-600"
            placeholder="/game-assets/sprite.png"
          />
        </div>
        <div className="grid grid-cols-4 gap-4 mt-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Sprite X</label>
            <input
              type="number"
              value={item.spriteX || 0}
              onChange={(e) => onChange({ spriteX: parseInt(e.target.value) })}
              className="w-full bg-slate-700 text-white rounded-lg px-3 py-2 border border-slate-600"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Sprite Y</label>
            <input
              type="number"
              value={item.spriteY || 0}
              onChange={(e) => onChange({ spriteY: parseInt(e.target.value) })}
              className="w-full bg-slate-700 text-white rounded-lg px-3 py-2 border border-slate-600"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Width</label>
            <input
              type="number"
              value={item.spriteW || 128}
              onChange={(e) => onChange({ spriteW: parseInt(e.target.value) })}
              className="w-full bg-slate-700 text-white rounded-lg px-3 py-2 border border-slate-600"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Height</label>
            <input
              type="number"
              value={item.spriteH || 128}
              onChange={(e) => onChange({ spriteH: parseInt(e.target.value) })}
              className="w-full bg-slate-700 text-white rounded-lg px-3 py-2 border border-slate-600"
            />
          </div>
        </div>
      </div>

      <div className="border-t border-slate-700 pt-4">
        <h3 className="text-lg font-medium text-white mb-3">Merge Settings</h3>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Merges Into (Item ID)</label>
          <input
            type="text"
            value={item.mergesInto || ''}
            onChange={(e) => onChange({ mergesInto: e.target.value || undefined })}
            className="w-full bg-slate-700 text-white rounded-lg px-3 py-2 border border-slate-600"
            placeholder="next_item_id"
          />
        </div>
      </div>

      {isGenerator && (
        <div className="border-t border-slate-700 pt-4">
          <h3 className="text-lg font-medium text-white mb-3">Generator Settings</h3>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Generation Time (ms)</label>
              <input
                type="number"
                value={item.generationTime || 60000}
                onChange={(e) => onChange({ generationTime: parseInt(e.target.value) })}
                className="w-full bg-slate-700 text-white rounded-lg px-3 py-2 border border-slate-600"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Max Charges</label>
              <input
                type="number"
                value={item.maxCharges || 3}
                onChange={(e) => onChange({ maxCharges: parseInt(e.target.value) })}
                className="w-full bg-slate-700 text-white rounded-lg px-3 py-2 border border-slate-600"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Energy Cost</label>
              <input
                type="number"
                value={item.energyCost || 5}
                onChange={(e) => onChange({ energyCost: parseInt(e.target.value) })}
                className="w-full bg-slate-700 text-white rounded-lg px-3 py-2 border border-slate-600"
              />
            </div>
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-300 mb-1">Generates (comma-separated IDs)</label>
            <input
              type="text"
              value={item.generates?.join(', ') || ''}
              onChange={(e) => onChange({ generates: e.target.value.split(',').map((s) => s.trim()).filter(Boolean) })}
              className="w-full bg-slate-700 text-white rounded-lg px-3 py-2 border border-slate-600"
              placeholder="item_1, item_2, item_3"
            />
          </div>
        </div>
      )}

      {isChest && (
        <div className="border-t border-slate-700 pt-4">
          <h3 className="text-lg font-medium text-white mb-3">Chest Contents</h3>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Coins Reward</label>
              <input
                type="number"
                value={item.chestRewards?.coins || 0}
                onChange={(e) => onChange({ chestRewards: { ...item.chestRewards, coins: parseInt(e.target.value) } })}
                className="w-full bg-slate-700 text-white rounded-lg px-3 py-2 border border-slate-600"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Gems Reward</label>
              <input
                type="number"
                value={item.chestRewards?.gems || 0}
                onChange={(e) => onChange({ chestRewards: { ...item.chestRewards, gems: parseInt(e.target.value) } })}
                className="w-full bg-slate-700 text-white rounded-lg px-3 py-2 border border-slate-600"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Energy Reward</label>
              <input
                type="number"
                value={item.chestRewards?.energy || 0}
                onChange={(e) => onChange({ chestRewards: { ...item.chestRewards, energy: parseInt(e.target.value) } })}
                className="w-full bg-slate-700 text-white rounded-lg px-3 py-2 border border-slate-600"
              />
            </div>
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-300 mb-1">Item Rewards (comma-separated IDs)</label>
            <input
              type="text"
              value={item.chestRewards?.items?.join(', ') || ''}
              onChange={(e) => onChange({ chestRewards: { ...item.chestRewards, items: e.target.value.split(',').map((s) => s.trim()).filter(Boolean) } })}
              className="w-full bg-slate-700 text-white rounded-lg px-3 py-2 border border-slate-600"
              placeholder="item_1, item_2, item_3"
            />
          </div>
        </div>
      )}

      {isNew && (
        <div className="flex gap-3 pt-4">
          <button
            onClick={onSave}
            className="flex-1 py-3 bg-amber-500 hover:bg-amber-600 text-black font-bold rounded-xl"
          >
            Create Item
          </button>
          <button
            onClick={onCancel}
            className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white font-medium rounded-xl"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}

function GardensManager() {
  const { gardens, addGarden, updateGarden, removeGarden, selectedGardenId, setSelectedGardenId, mapViewport, setMapViewport } = useAdminStore();
  const [showNewGardenForm, setShowNewGardenForm] = useState(false);
  const [dragMode, setDragMode] = useState<'pan' | 'select' | 'connect'>('pan');
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const selectedGarden = selectedGardenId ? gardens.find((g) => g.id === selectedGardenId) : null;

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    const newZoom = Math.max(0.25, Math.min(3, mapViewport.zoom + delta));
    setMapViewport({ zoom: newZoom });
  }, [mapViewport.zoom, setMapViewport]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (dragMode === 'pan') {
      setIsDragging(true);
      setDragStart({ x: e.clientX - mapViewport.x, y: e.clientY - mapViewport.y });
    }
  }, [dragMode, mapViewport]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isDragging && dragMode === 'pan') {
      setMapViewport({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  }, [isDragging, dragMode, dragStart, setMapViewport]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 1 && dragMode === 'pan') {
      setIsDragging(true);
      setDragStart({ x: e.touches[0].clientX - mapViewport.x, y: e.touches[0].clientY - mapViewport.y });
    }
  }, [dragMode, mapViewport]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      e.preventDefault();
    } else if (isDragging && e.touches.length === 1 && dragMode === 'pan') {
      setMapViewport({
        x: e.touches[0].clientX - dragStart.x,
        y: e.touches[0].clientY - dragStart.y,
      });
    }
  }, [isDragging, dragMode, dragStart, setMapViewport]);

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex h-full"
    >
      <div className="w-72 bg-slate-800 border-r border-slate-700 flex flex-col">
        <div className="p-4 border-b border-slate-700">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold text-white">Gardens</h2>
            <button
              onClick={() => setShowNewGardenForm(true)}
              className="flex items-center gap-1 px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-black rounded-lg text-sm font-medium"
            >
              <Plus size={16} />
              Add
            </button>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-2">
          {gardens.map((garden) => (
            <button
              key={garden.id}
              onClick={() => setSelectedGardenId(garden.id)}
              className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors mb-1 ${
                selectedGardenId === garden.id
                  ? 'bg-amber-500/20 border border-amber-500/50'
                  : 'bg-slate-700/50 hover:bg-slate-700 border border-transparent'
              }`}
            >
              <div className="w-10 h-10 rounded-lg bg-green-600 flex items-center justify-center">
                <Map size={20} className="text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-white truncate">{garden.name}</div>
                <div className="text-xs text-gray-400">{garden.zones.length} zones</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="bg-slate-800 border-b border-slate-700 p-3 flex items-center gap-3">
          <div className="flex items-center gap-1 bg-slate-700 rounded-lg p-1">
            <button
              onClick={() => setDragMode('pan')}
              className={`p-2 rounded ${dragMode === 'pan' ? 'bg-amber-500 text-black' : 'text-white hover:bg-slate-600'}`}
            >
              <Move size={18} />
            </button>
            <button
              onClick={() => setDragMode('select')}
              className={`p-2 rounded ${dragMode === 'select' ? 'bg-amber-500 text-black' : 'text-white hover:bg-slate-600'}`}
            >
              <Layers size={18} />
            </button>
            <button
              onClick={() => setDragMode('connect')}
              className={`p-2 rounded ${dragMode === 'connect' ? 'bg-amber-500 text-black' : 'text-white hover:bg-slate-600'}`}
            >
              <Link size={18} />
            </button>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setMapViewport({ zoom: Math.max(0.25, mapViewport.zoom - 0.25) })}
              className="p-2 bg-slate-700 hover:bg-slate-600 text-white rounded"
            >
              <ZoomOut size={18} />
            </button>
            <span className="text-white text-sm w-16 text-center">{Math.round(mapViewport.zoom * 100)}%</span>
            <button
              onClick={() => setMapViewport({ zoom: Math.min(3, mapViewport.zoom + 0.25) })}
              className="p-2 bg-slate-700 hover:bg-slate-600 text-white rounded"
            >
              <ZoomIn size={18} />
            </button>
          </div>
          <button
            onClick={() => setMapViewport({ x: 0, y: 0, zoom: 1 })}
            className="px-3 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded text-sm"
          >
            Reset View
          </button>
        </div>

        <div
          ref={containerRef}
          className="flex-1 overflow-hidden bg-slate-900 relative cursor-grab active:cursor-grabbing"
          onWheel={handleWheel}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div
            className="absolute"
            style={{
              transform: `translate(${mapViewport.x}px, ${mapViewport.y}px) scale(${mapViewport.zoom})`,
              transformOrigin: '0 0',
            }}
          >
            {selectedGarden ? (
              <div className="relative">
                <div
                  className="bg-green-900/30 border-2 border-dashed border-green-500/50 rounded-lg"
                  style={{
                    width: selectedGarden.gridSize.cols * 60,
                    height: selectedGarden.gridSize.rows * 60,
                  }}
                >
                  <div className="grid" style={{ gridTemplateColumns: `repeat(${selectedGarden.gridSize.cols}, 60px)` }}>
                    {Array.from({ length: selectedGarden.gridSize.rows * selectedGarden.gridSize.cols }).map((_, i) => (
                      <div
                        key={i}
                        className="w-[60px] h-[60px] border border-green-700/30 hover:bg-green-500/20 transition-colors"
                      />
                    ))}
                  </div>
                </div>
                {selectedGarden.zones.map((zone) => (
                  <div
                    key={zone.id}
                    className="absolute bg-amber-500/30 border-2 border-amber-500 rounded-lg cursor-pointer hover:bg-amber-500/50 transition-colors flex items-center justify-center"
                    style={{
                      left: zone.x * 60,
                      top: zone.y * 60,
                      width: zone.width * 60,
                      height: zone.height * 60,
                    }}
                  >
                    <span className="text-white font-medium text-sm">{zone.name}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center h-[400px] text-gray-500">
                Select a garden to edit
              </div>
            )}
          </div>
        </div>
      </div>

      {selectedGarden && (
        <div className="w-80 bg-slate-800 border-l border-slate-700 p-4 overflow-y-auto">
          <h3 className="text-lg font-bold text-white mb-4">Garden Settings</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Name</label>
              <input
                type="text"
                value={selectedGarden.name}
                onChange={(e) => updateGarden(selectedGarden.id, { name: e.target.value })}
                className="w-full bg-slate-700 text-white rounded-lg px-3 py-2 border border-slate-600"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
              <textarea
                value={selectedGarden.description}
                onChange={(e) => updateGarden(selectedGarden.id, { description: e.target.value })}
                className="w-full bg-slate-700 text-white rounded-lg px-3 py-2 border border-slate-600 h-20 resize-none"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Grid Cols</label>
                <input
                  type="number"
                  value={selectedGarden.gridSize.cols}
                  onChange={(e) => updateGarden(selectedGarden.id, { gridSize: { ...selectedGarden.gridSize, cols: parseInt(e.target.value) } })}
                  className="w-full bg-slate-700 text-white rounded-lg px-3 py-2 border border-slate-600"
                  min="1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Grid Rows</label>
                <input
                  type="number"
                  value={selectedGarden.gridSize.rows}
                  onChange={(e) => updateGarden(selectedGarden.id, { gridSize: { ...selectedGarden.gridSize, rows: parseInt(e.target.value) } })}
                  className="w-full bg-slate-700 text-white rounded-lg px-3 py-2 border border-slate-600"
                  min="1"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Unlock Level</label>
                <input
                  type="number"
                  value={selectedGarden.unlockLevel}
                  onChange={(e) => updateGarden(selectedGarden.id, { unlockLevel: parseInt(e.target.value) })}
                  className="w-full bg-slate-700 text-white rounded-lg px-3 py-2 border border-slate-600"
                  min="1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Unlock Cost</label>
                <input
                  type="number"
                  value={selectedGarden.unlockCoins}
                  onChange={(e) => updateGarden(selectedGarden.id, { unlockCoins: parseInt(e.target.value) })}
                  className="w-full bg-slate-700 text-white rounded-lg px-3 py-2 border border-slate-600"
                  min="0"
                />
              </div>
            </div>
            <button
              onClick={() => {
                removeGarden(selectedGarden.id);
                setSelectedGardenId(null);
              }}
              className="w-full py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium flex items-center justify-center gap-2"
            >
              <Trash2 size={16} />
              Delete Garden
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
}

function ChestsManager() {
  const { chests, addChest, updateChest, removeChest, selectedChestId, setSelectedChestId } = useAdminStore();
  const [showNewChestForm, setShowNewChestForm] = useState(false);

  const selectedChest = selectedChestId ? chests.find((c) => c.id === selectedChestId) : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex h-full"
    >
      <div className="w-72 bg-slate-800 border-r border-slate-700 flex flex-col">
        <div className="p-4 border-b border-slate-700">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold text-white">Chests</h2>
            <button
              onClick={() => setShowNewChestForm(true)}
              className="flex items-center gap-1 px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-black rounded-lg text-sm font-medium"
            >
              <Plus size={16} />
              Add
            </button>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-2">
          {chests.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              No chests yet. Add your first chest!
            </div>
          ) : (
            chests.map((chest) => (
              <button
                key={chest.id}
                onClick={() => setSelectedChestId(chest.id)}
                className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors mb-1 ${
                  selectedChestId === chest.id
                    ? 'bg-amber-500/20 border border-amber-500/50'
                    : 'bg-slate-700/50 hover:bg-slate-700 border border-transparent'
                }`}
              >
                <div className="w-10 h-10 rounded-lg bg-yellow-600 flex items-center justify-center">
                  <Gift size={20} className="text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-white truncate">{chest.name}</div>
                  <div className="text-xs text-gray-400">{chest.contents.length} items</div>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        {showNewChestForm || selectedChest ? (
          <ChestForm
            chest={selectedChest || undefined}
            onSave={(chest) => {
              if (selectedChest) {
                updateChest(selectedChest.id, chest);
              } else {
                addChest(chest as AdminChest);
                setShowNewChestForm(false);
              }
            }}
            onCancel={() => {
              setShowNewChestForm(false);
              setSelectedChestId(null);
            }}
            onDelete={selectedChest ? () => {
              removeChest(selectedChest.id);
              setSelectedChestId(null);
            } : undefined}
            isNew={showNewChestForm}
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            Select a chest to edit or create a new one
          </div>
        )}
      </div>
    </motion.div>
  );
}

interface ChestFormProps {
  chest?: AdminChest;
  onSave: (chest: Partial<AdminChest>) => void;
  onCancel: () => void;
  onDelete?: () => void;
  isNew: boolean;
}

function ChestForm({ chest, onSave, onCancel, onDelete, isNew }: ChestFormProps) {
  const [formData, setFormData] = useState<Partial<AdminChest>>(chest || {
    id: '',
    name: '',
    description: '',
    sprite: '',
    spriteX: 0,
    spriteY: 0,
    spriteW: 128,
    spriteH: 128,
    cost: 100,
    costType: 'coins',
    contents: [],
  });

  const updateField = (updates: Partial<AdminChest>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  };

  const addContent = () => {
    updateField({
      contents: [...(formData.contents || []), { itemId: '', minAmount: 1, maxAmount: 1, dropRate: 100 }],
    });
  };

  const updateContent = (index: number, updates: Partial<ChestContent>) => {
    const newContents = [...(formData.contents || [])];
    newContents[index] = { ...newContents[index], ...updates };
    updateField({ contents: newContents });
  };

  const removeContent = (index: number) => {
    updateField({
      contents: (formData.contents || []).filter((_, i) => i !== index),
    });
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">{isNew ? 'Create New Chest' : `Edit: ${chest?.name}`}</h2>
        {onDelete && (
          <button
            onClick={onDelete}
            className="flex items-center gap-2 px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium"
          >
            <Trash2 size={16} />
            Delete
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Chest ID</label>
          <input
            type="text"
            value={formData.id || ''}
            onChange={(e) => updateField({ id: e.target.value })}
            disabled={!isNew}
            className="w-full bg-slate-700 text-white rounded-lg px-3 py-2 border border-slate-600 disabled:opacity-50"
            placeholder="unique_chest_id"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Name</label>
          <input
            type="text"
            value={formData.name || ''}
            onChange={(e) => updateField({ name: e.target.value })}
            className="w-full bg-slate-700 text-white rounded-lg px-3 py-2 border border-slate-600"
            placeholder="Chest Name"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
        <textarea
          value={formData.description || ''}
          onChange={(e) => updateField({ description: e.target.value })}
          className="w-full bg-slate-700 text-white rounded-lg px-3 py-2 border border-slate-600 h-20 resize-none"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Cost</label>
          <input
            type="number"
            value={formData.cost || 0}
            onChange={(e) => updateField({ cost: parseInt(e.target.value) })}
            className="w-full bg-slate-700 text-white rounded-lg px-3 py-2 border border-slate-600"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Cost Type</label>
          <select
            value={formData.costType || 'coins'}
            onChange={(e) => updateField({ costType: e.target.value as 'coins' | 'gems' })}
            className="w-full bg-slate-700 text-white rounded-lg px-3 py-2 border border-slate-600"
          >
            <option value="coins">Coins</option>
            <option value="gems">Gems</option>
          </select>
        </div>
      </div>

      <div className="border-t border-slate-700 pt-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-medium text-white">Contents</h3>
          <button
            onClick={addContent}
            className="flex items-center gap-1 px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium"
          >
            <Plus size={16} />
            Add Item
          </button>
        </div>
        <div className="space-y-3">
          {(formData.contents || []).map((content, index) => (
            <div key={index} className="bg-slate-700/50 p-3 rounded-lg">
              <div className="grid grid-cols-4 gap-3">
                <div className="col-span-2">
                  <label className="block text-xs text-gray-400 mb-1">Item ID</label>
                  <input
                    type="text"
                    value={content.itemId}
                    onChange={(e) => updateContent(index, { itemId: e.target.value })}
                    className="w-full bg-slate-600 text-white rounded px-2 py-1.5 border border-slate-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Min Amt</label>
                  <input
                    type="number"
                    value={content.minAmount}
                    onChange={(e) => updateContent(index, { minAmount: parseInt(e.target.value) })}
                    className="w-full bg-slate-600 text-white rounded px-2 py-1.5 border border-slate-500 text-sm"
                    min="1"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Max Amt</label>
                  <input
                    type="number"
                    value={content.maxAmount}
                    onChange={(e) => updateContent(index, { maxAmount: parseInt(e.target.value) })}
                    className="w-full bg-slate-600 text-white rounded px-2 py-1.5 border border-slate-500 text-sm"
                    min="1"
                  />
                </div>
              </div>
              <div className="flex items-center gap-3 mt-2">
                <div className="flex-1">
                  <label className="block text-xs text-gray-400 mb-1">Drop Rate (%)</label>
                  <input
                    type="number"
                    value={content.dropRate}
                    onChange={(e) => updateContent(index, { dropRate: parseInt(e.target.value) })}
                    className="w-full bg-slate-600 text-white rounded px-2 py-1.5 border border-slate-500 text-sm"
                    min="0"
                    max="100"
                  />
                </div>
                <button
                  onClick={() => removeContent(index)}
                  className="mt-4 p-2 text-red-400 hover:text-red-300"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-3 pt-4">
        <button
          onClick={() => onSave(formData)}
          className="flex-1 py-3 bg-amber-500 hover:bg-amber-600 text-black font-bold rounded-xl"
        >
          {isNew ? 'Create Chest' : 'Save Changes'}
        </button>
        <button
          onClick={onCancel}
          className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white font-medium rounded-xl"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

function StoreManager() {
  const { storeItems, addStoreItem, updateStoreItem, removeStoreItem } = useAdminStore();
  const [showNewItemForm, setShowNewItemForm] = useState(false);
  const [selectedStoreItemId, setSelectedStoreItemId] = useState<string | null>(null);

  const selectedStoreItem = selectedStoreItemId ? storeItems.find((i) => i.id === selectedStoreItemId) : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex h-full"
    >
      <div className="w-72 bg-slate-800 border-r border-slate-700 flex flex-col">
        <div className="p-4 border-b border-slate-700">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold text-white">Store Items</h2>
            <button
              onClick={() => setShowNewItemForm(true)}
              className="flex items-center gap-1 px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-black rounded-lg text-sm font-medium"
            >
              <Plus size={16} />
              Add
            </button>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-2">
          {storeItems.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              No store items yet
            </div>
          ) : (
            storeItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setSelectedStoreItemId(item.id)}
                className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors mb-1 ${
                  selectedStoreItemId === item.id
                    ? 'bg-amber-500/20 border border-amber-500/50'
                    : 'bg-slate-700/50 hover:bg-slate-700 border border-transparent'
                }`}
              >
                <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center">
                  <Store size={20} className="text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-white truncate">{item.name}</div>
                  <div className="text-xs text-gray-400">{item.price} {item.priceType}</div>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        {showNewItemForm || selectedStoreItem ? (
          <StoreItemForm
            item={selectedStoreItem || undefined}
            onSave={(item) => {
              if (selectedStoreItem) {
                updateStoreItem(selectedStoreItem.id, item);
              } else {
                addStoreItem(item as AdminStoreItem);
                setShowNewItemForm(false);
              }
            }}
            onCancel={() => {
              setShowNewItemForm(false);
              setSelectedStoreItemId(null);
            }}
            onDelete={selectedStoreItem ? () => {
              removeStoreItem(selectedStoreItem.id);
              setSelectedStoreItemId(null);
            } : undefined}
            isNew={showNewItemForm}
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            Select a store item to edit or create a new one
          </div>
        )}
      </div>
    </motion.div>
  );
}

interface StoreItemFormProps {
  item?: AdminStoreItem;
  onSave: (item: Partial<AdminStoreItem>) => void;
  onCancel: () => void;
  onDelete?: () => void;
  isNew: boolean;
}

function StoreItemForm({ item, onSave, onCancel, onDelete, isNew }: StoreItemFormProps) {
  const [formData, setFormData] = useState<Partial<AdminStoreItem>>(item || {
    id: '',
    name: '',
    description: '',
    itemId: '',
    price: 100,
    priceType: 'coins',
    category: 'items',
    isLimited: false,
  });

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">{isNew ? 'Add Store Item' : `Edit: ${item?.name}`}</h2>
        {onDelete && (
          <button onClick={onDelete} className="flex items-center gap-2 px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium">
            <Trash2 size={16} />
            Delete
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Store Item ID</label>
          <input
            type="text"
            value={formData.id || ''}
            onChange={(e) => setFormData({ ...formData, id: e.target.value })}
            disabled={!isNew}
            className="w-full bg-slate-700 text-white rounded-lg px-3 py-2 border border-slate-600 disabled:opacity-50"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Name</label>
          <input
            type="text"
            value={formData.name || ''}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full bg-slate-700 text-white rounded-lg px-3 py-2 border border-slate-600"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
        <textarea
          value={formData.description || ''}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="w-full bg-slate-700 text-white rounded-lg px-3 py-2 border border-slate-600 h-20 resize-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">Game Item ID</label>
        <input
          type="text"
          value={formData.itemId || ''}
          onChange={(e) => setFormData({ ...formData, itemId: e.target.value })}
          className="w-full bg-slate-700 text-white rounded-lg px-3 py-2 border border-slate-600"
          placeholder="flower_1, gen_flower_1, etc."
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Price</label>
          <input
            type="number"
            value={formData.price || 0}
            onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) })}
            className="w-full bg-slate-700 text-white rounded-lg px-3 py-2 border border-slate-600"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Price Type</label>
          <select
            value={formData.priceType || 'coins'}
            onChange={(e) => setFormData({ ...formData, priceType: e.target.value as 'coins' | 'gems' })}
            className="w-full bg-slate-700 text-white rounded-lg px-3 py-2 border border-slate-600"
          >
            <option value="coins">Coins</option>
            <option value="gems">Gems</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Category</label>
          <input
            type="text"
            value={formData.category || ''}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="w-full bg-slate-700 text-white rounded-lg px-3 py-2 border border-slate-600"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          checked={formData.isLimited || false}
          onChange={(e) => setFormData({ ...formData, isLimited: e.target.checked })}
          className="w-5 h-5 rounded"
        />
        <label className="text-gray-300">Limited Quantity</label>
        {formData.isLimited && (
          <input
            type="number"
            value={formData.limitCount || 1}
            onChange={(e) => setFormData({ ...formData, limitCount: parseInt(e.target.value) })}
            className="w-24 bg-slate-700 text-white rounded-lg px-3 py-2 border border-slate-600"
            min="1"
          />
        )}
      </div>

      <div className="flex gap-3 pt-4">
        <button
          onClick={() => onSave(formData)}
          className="flex-1 py-3 bg-amber-500 hover:bg-amber-600 text-black font-bold rounded-xl"
        >
          {isNew ? 'Add to Store' : 'Save Changes'}
        </button>
        <button
          onClick={onCancel}
          className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white font-medium rounded-xl"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

function EventsManager() {
  const { events, addEvent, updateEvent, removeEvent, selectedEventId, setSelectedEventId } = useAdminStore();
  const [showNewEventForm, setShowNewEventForm] = useState(false);

  const selectedEvent = selectedEventId ? events.find((e) => e.id === selectedEventId) : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex h-full"
    >
      <div className="w-72 bg-slate-800 border-r border-slate-700 flex flex-col">
        <div className="p-4 border-b border-slate-700">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold text-white">Events</h2>
            <button
              onClick={() => setShowNewEventForm(true)}
              className="flex items-center gap-1 px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-black rounded-lg text-sm font-medium"
            >
              <Plus size={16} />
              Add
            </button>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-2">
          {events.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              No events yet
            </div>
          ) : (
            events.map((event) => (
              <button
                key={event.id}
                onClick={() => setSelectedEventId(event.id)}
                className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors mb-1 ${
                  selectedEventId === event.id
                    ? 'bg-amber-500/20 border border-amber-500/50'
                    : 'bg-slate-700/50 hover:bg-slate-700 border border-transparent'
                }`}
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${event.isActive ? 'bg-green-600' : 'bg-gray-600'}`}>
                  <Calendar size={20} className="text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-white truncate">{event.name}</div>
                  <div className="text-xs text-gray-400">{event.isActive ? 'Active' : 'Inactive'}</div>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        {showNewEventForm || selectedEvent ? (
          <EventForm
            event={selectedEvent || undefined}
            onSave={(event) => {
              if (selectedEvent) {
                updateEvent(selectedEvent.id, event);
              } else {
                addEvent(event as AdminEvent);
                setShowNewEventForm(false);
              }
            }}
            onCancel={() => {
              setShowNewEventForm(false);
              setSelectedEventId(null);
            }}
            onDelete={selectedEvent ? () => {
              removeEvent(selectedEvent.id);
              setSelectedEventId(null);
            } : undefined}
            isNew={showNewEventForm}
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            Select an event to edit or create a new one
          </div>
        )}
      </div>
    </motion.div>
  );
}

interface EventFormProps {
  event?: AdminEvent;
  onSave: (event: Partial<AdminEvent>) => void;
  onCancel: () => void;
  onDelete?: () => void;
  isNew: boolean;
}

function EventForm({ event, onSave, onCancel, onDelete, isNew }: EventFormProps) {
  const [formData, setFormData] = useState<Partial<AdminEvent>>(event || {
    id: '',
    name: '',
    description: '',
    startDate: '',
    endDate: '',
    isActive: false,
    rewards: [],
    tasks: [],
    bannerColor: '#f59e0b',
  });

  const addTask = () => {
    setFormData({
      ...formData,
      tasks: [...(formData.tasks || []), { id: `task_${Date.now()}`, title: '', description: '', requiredItem: '', quantity: 1, points: 10 }],
    });
  };

  const updateTask = (index: number, updates: Partial<EventTask>) => {
    const newTasks = [...(formData.tasks || [])];
    newTasks[index] = { ...newTasks[index], ...updates };
    setFormData({ ...formData, tasks: newTasks });
  };

  const removeTask = (index: number) => {
    setFormData({
      ...formData,
      tasks: (formData.tasks || []).filter((_, i) => i !== index),
    });
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">{isNew ? 'Create New Event' : `Edit: ${event?.name}`}</h2>
        {onDelete && (
          <button onClick={onDelete} className="flex items-center gap-2 px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium">
            <Trash2 size={16} />
            Delete
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Event ID</label>
          <input
            type="text"
            value={formData.id || ''}
            onChange={(e) => setFormData({ ...formData, id: e.target.value })}
            disabled={!isNew}
            className="w-full bg-slate-700 text-white rounded-lg px-3 py-2 border border-slate-600 disabled:opacity-50"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Name</label>
          <input
            type="text"
            value={formData.name || ''}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full bg-slate-700 text-white rounded-lg px-3 py-2 border border-slate-600"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
        <textarea
          value={formData.description || ''}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="w-full bg-slate-700 text-white rounded-lg px-3 py-2 border border-slate-600 h-20 resize-none"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Start Date</label>
          <input
            type="datetime-local"
            value={formData.startDate || ''}
            onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
            className="w-full bg-slate-700 text-white rounded-lg px-3 py-2 border border-slate-600"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">End Date</label>
          <input
            type="datetime-local"
            value={formData.endDate || ''}
            onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
            className="w-full bg-slate-700 text-white rounded-lg px-3 py-2 border border-slate-600"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={formData.isActive || false}
            onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
            className="w-5 h-5 rounded"
          />
          <label className="text-gray-300">Active</label>
        </div>
        <div className="flex items-center gap-3">
          <label className="text-gray-300">Banner Color:</label>
          <input
            type="color"
            value={formData.bannerColor || '#f59e0b'}
            onChange={(e) => setFormData({ ...formData, bannerColor: e.target.value })}
            className="w-10 h-10 rounded cursor-pointer"
          />
        </div>
      </div>

      <div className="border-t border-slate-700 pt-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-medium text-white">Event Tasks</h3>
          <button
            onClick={addTask}
            className="flex items-center gap-1 px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium"
          >
            <Plus size={16} />
            Add Task
          </button>
        </div>
        <div className="space-y-3">
          {(formData.tasks || []).map((task, index) => (
            <div key={index} className="bg-slate-700/50 p-3 rounded-lg">
              <div className="grid grid-cols-2 gap-3 mb-2">
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Title</label>
                  <input
                    type="text"
                    value={task.title}
                    onChange={(e) => updateTask(index, { title: e.target.value })}
                    className="w-full bg-slate-600 text-white rounded px-2 py-1.5 border border-slate-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Required Item</label>
                  <input
                    type="text"
                    value={task.requiredItem}
                    onChange={(e) => updateTask(index, { requiredItem: e.target.value })}
                    className="w-full bg-slate-600 text-white rounded px-2 py-1.5 border border-slate-500 text-sm"
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Quantity</label>
                  <input
                    type="number"
                    value={task.quantity}
                    onChange={(e) => updateTask(index, { quantity: parseInt(e.target.value) })}
                    className="w-full bg-slate-600 text-white rounded px-2 py-1.5 border border-slate-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Points</label>
                  <input
                    type="number"
                    value={task.points}
                    onChange={(e) => updateTask(index, { points: parseInt(e.target.value) })}
                    className="w-full bg-slate-600 text-white rounded px-2 py-1.5 border border-slate-500 text-sm"
                  />
                </div>
                <div className="flex items-end">
                  <button
                    onClick={() => removeTask(index)}
                    className="p-2 text-red-400 hover:text-red-300"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-3 pt-4">
        <button
          onClick={() => onSave(formData)}
          className="flex-1 py-3 bg-amber-500 hover:bg-amber-600 text-black font-bold rounded-xl"
        >
          {isNew ? 'Create Event' : 'Save Changes'}
        </button>
        <button
          onClick={onCancel}
          className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white font-medium rounded-xl"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
