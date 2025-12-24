import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Plus, Trash2, ChevronLeft, ChevronRight, Package, 
  Map, Gift, Store, Calendar, Settings, Upload, Download,
  ZoomIn, ZoomOut, Move, Link, Layers, GitBranch
} from 'lucide-react';
import { useAdminStore, AdminMergeItem, AdminMergeChain, AdminGarden, AdminChest, AdminStoreItem, AdminEvent, ChestContent, EventTask } from '@/lib/stores/useAdminStore';
import { ItemCategory } from '@/lib/mergeData';
import SpriteUploader from './SpriteUploader';
import ItemForm from './ItemForm';
import { useEffect } from 'react';

interface GameAdminPanelProps {
  onClose: () => void;
}

type AdminTab = 'items' | 'chains' | 'gardens' | 'chests' | 'store' | 'events';

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
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const { exportConfig, importConfig, resetToDefaults } = useAdminStore();

  useEffect(() => {
    // Load config from server on mount
    const loadConfig = async () => {
      try {
        const response = await fetch('/api/admin-config');
        if (response.ok) {
          const config = await response.json();
          if (Object.keys(config).length > 0) {
            importConfig(config);
          }
        }
      } catch (error) {
        console.error('Failed to load config from server:', error);
      }
    };
    loadConfig();
  }, [importConfig]);

  const saveConfig = async () => {
    setSaveStatus('saving');
    try {
      const config = exportConfig();
      await fetch('/api/admin-config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      });
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch (error) {
      console.error('Failed to save config to server:', error);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 2000);
    }
  };

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
          await saveConfig(); // Save to server after import
        } catch (err) {
          console.error('Failed to parse config file:', err);
        }
      }
    };
    input.click();
  };

  const tabs: { id: AdminTab; label: string; icon: React.ReactNode }[] = [
    { id: 'items', label: 'Items', icon: <Package size={20} /> },
    { id: 'chains', label: 'Chains', icon: <GitBranch size={20} /> },
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
            onClick={saveConfig}
            disabled={saveStatus === 'saving'}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              saveStatus === 'saved'
                ? 'bg-green-700 text-white'
                : saveStatus === 'error'
                ? 'bg-red-700 text-white'
                : saveStatus === 'saving'
                ? 'bg-gray-600 text-gray-300'
                : 'bg-green-600 hover:bg-green-700 text-white'
            }`}
          >
            <Download size={16} />
            {saveStatus === 'saving' ? 'Saving...' : 
             saveStatus === 'saved' ? 'Saved!' : 
             saveStatus === 'error' ? 'Error!' : 
             'Save to Server'}
          </button>
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
          {activeTab === 'chains' && <ChainsManager key="chains" />}
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
  const [activeCategoryTab, setActiveCategoryTab] = useState<ItemCategory>('flower');
  const [showNewItemForm, setShowNewItemForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [newItem, setNewItem] = useState<AdminMergeItem>({
    id: '',
    name: '',
    description: '',
    category: 'flower',
    level: 1,
    maxLevel: 10,
    sprite: '',
    spriteX: 0,
    spriteY: 0,
    spriteW: 128,
    spriteH: 128,
    coinValue: 10,
    xpValue: 5,
    sellPrice: 5,
    gemSellPrice: 1,
    rarity: 'common',
    unlockLevel: 1,
    tags: [],
  });

  const categoryItems = Object.values(items).filter(item => item.category === activeCategoryTab);
  const filteredItems = categoryItems.filter(
    (item) => {
      const matchesSearch = !searchQuery || 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesSearch;
    }
  );

  const handleCreateItem = () => {
    setNewItem({
      id: '',
      name: '',
      description: '',
      category: activeCategoryTab,
      level: 1,
      maxLevel: 10,
      sprite: '',
      spriteX: 0,
      spriteY: 0,
      spriteW: 128,
      spriteH: 128,
      coinValue: 10,
      xpValue: 5,
      sellPrice: 5,
      gemSellPrice: 1,
      rarity: 'common' as const,
      unlockLevel: 1,
      tags: [],
    });
    setShowNewItemForm(true);
  };

  const handleSaveNewItem = () => {
    if (newItem.id && newItem.name) {
      addItem(newItem);
      setShowNewItemForm(false);
      setSelectedItemId(newItem.id);
    }
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
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  const itemsData = Object.values(items);
                  const blob = new Blob([JSON.stringify(itemsData, null, 2)], { type: 'application/json' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = 'items.json';
                  a.click();
                  URL.revokeObjectURL(url);
                }}
                className="flex items-center gap-1 px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium"
              >
                <Download size={16} />
                Export Items
              </button>
              <button
                onClick={() => {
                  const input = document.createElement('input');
                  input.type = 'file';
                  input.accept = '.json';
                  input.onchange = async (e) => {
                    const file = (e.target as HTMLInputElement).files?.[0];
                    if (file) {
                      const text = await file.text();
                      try {
                        const importedItems = JSON.parse(text);
                        importedItems.forEach((item: AdminMergeItem) => {
                          if (item.id && item.name) {
                            addItem(item);
                          }
                        });
                      } catch (err) {
                        console.error('Failed to parse items file:', err);
                      }
                    }
                  };
                  input.click();
                }}
                className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium"
              >
                <Upload size={16} />
                Import Items
              </button>
              <button
                onClick={handleCreateItem}
                className="flex items-center gap-1 px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-black rounded-lg text-sm font-medium"
              >
                <Plus size={16} />
                Add
              </button>
            </div>
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search items..."
            className="w-full bg-slate-700 text-white rounded-lg px-3 py-2 text-sm border border-slate-600 mb-3"
          />
          
          {/* Category Tabs */}
          <div className="flex flex-wrap gap-1 mb-2">
            {ITEM_CATEGORIES.map((cat) => {
              const itemCount = Object.values(items).filter(item => item.category === cat.value).length;
              return (
                <button
                  key={cat.value}
                  onClick={() => setActiveCategoryTab(cat.value)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeCategoryTab === cat.value
                      ? 'bg-amber-500 text-black'
                      : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                  }`}
                >
                  <div className={`w-3 h-3 rounded-full ${cat.color}`}></div>
                  {cat.label}
                  <span className="bg-slate-600 text-xs px-2 py-0.5 rounded-full">
                    {itemCount}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-2">
          {filteredItems.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              No {activeCategoryTab} items yet. Add your first one!
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
              onSave={handleSaveNewItem}
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

function ChainsManager() {
  const { items, mergeChains, addMergeChain, updateMergeChain, removeMergeChain, selectedChainId, setSelectedChainId } = useAdminStore();
  const [showNewChainForm, setShowNewChainForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [newChain, setNewChain] = useState<AdminMergeChain>({
    id: '',
    name: '',
    category: 'flower',
    items: [],
  });

  const filteredChains = mergeChains.filter(
    (chain) => {
      const matchesSearch = !searchQuery || 
        chain.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        chain.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        chain.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSearch;
    }
  );

  const handleCreateChain = () => {
    setNewChain({
      id: '',
      name: '',
      category: 'flower',
      items: [],
    });
    setShowNewChainForm(true);
  };

  const handleSaveNewChain = () => {
    if (newChain.id && newChain.name && newChain.items.length > 0) {
      addMergeChain(newChain);
      setShowNewChainForm(false);
      setSelectedChainId(newChain.id);
    }
  };

  const selectedChain = selectedChainId ? mergeChains.find((c) => c.id === selectedChainId) : null;

  const getItemName = (itemId: string) => {
    const item = items[itemId];
    return item ? item.name : `Unknown Item (${itemId})`;
  };

  const getAvailableItems = (category: ItemCategory) => {
    return Object.values(items).filter(item => item.category === category);
  };

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
            <h2 className="text-lg font-bold text-white">Merge Chains</h2>
            <button
              onClick={handleCreateChain}
              className="flex items-center gap-1 px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-black rounded-lg text-sm font-medium"
            >
              <Plus size={16} />
              Add Chain
            </button>
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search chains..."
            className="w-full bg-slate-700 text-white rounded-lg px-3 py-2 text-sm border border-slate-600 mb-3"
          />
        </div>
        
        <div className="flex-1 overflow-y-auto p-2">
          {filteredChains.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              No merge chains yet. Create your first chain!
            </div>
          ) : (
            <div className="space-y-1">
              {filteredChains.map((chain) => (
                <button
                  key={chain.id}
                  onClick={() => setSelectedChainId(chain.id)}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors ${
                    selectedChainId === chain.id
                      ? 'bg-amber-500/20 border border-amber-500/50'
                      : 'bg-slate-700/50 hover:bg-slate-700 border border-transparent'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    ITEM_CATEGORIES.find((c) => c.value === chain.category)?.color || 'bg-gray-500'
                  }`}>
                    <GitBranch size={20} className="text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-white truncate">{chain.name}</div>
                    <div className="text-xs text-gray-400">{chain.items.length} items · {chain.category}</div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        {showNewChainForm ? (
          <div className="max-w-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Create New Merge Chain</h2>
              <button
                onClick={() => setShowNewChainForm(false)}
                className="text-gray-400 hover:text-white"
              >
                <X size={24} />
              </button>
            </div>
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Chain ID</label>
                  <input
                    type="text"
                    value={newChain.id}
                    onChange={(e) => setNewChain({...newChain, id: e.target.value})}
                    className="w-full bg-slate-700 text-white rounded-lg px-3 py-2 border border-slate-600"
                    placeholder="chain-id"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Chain Name</label>
                  <input
                    type="text"
                    value={newChain.name}
                    onChange={(e) => setNewChain({...newChain, name: e.target.value})}
                    className="w-full bg-slate-700 text-white rounded-lg px-3 py-2 border border-slate-600"
                    placeholder="Chain Name"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
                <select
                  value={newChain.category}
                  onChange={(e) => setNewChain({...newChain, category: e.target.value as ItemCategory})}
                  className="w-full bg-slate-700 text-white rounded-lg px-3 py-2 border border-slate-600"
                >
                  {ITEM_CATEGORIES.map((cat) => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Items in Chain</label>
                <div className="space-y-2">
                  {newChain.items.map((itemId, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <span className="flex-1 bg-slate-700 text-white rounded-lg px-3 py-2 border border-slate-600">
                        {getItemName(itemId)}
                      </span>
                      <button
                        onClick={() => {
                          const newItems = [...newChain.items];
                          newItems.splice(index, 1);
                          setNewChain({...newChain, items: newItems});
                        }}
                        className="p-2 text-red-400 hover:text-red-300"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                  <select
                    onChange={(e) => {
                      if (e.target.value) {
                        setNewChain({
                          ...newChain, 
                          items: [...newChain.items, e.target.value]
                        });
                        e.target.value = '';
                      }
                    }}
                    className="w-full bg-slate-700 text-white rounded-lg px-3 py-2 border border-slate-600"
                  >
                    <option value="">Add item to chain...</option>
                    {getAvailableItems(newChain.category)
                      .filter(item => !newChain.items.includes(item.id))
                      .map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.name} (Level {item.level})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleSaveNewChain}
                  className="flex-1 py-3 bg-amber-500 hover:bg-amber-600 text-black font-bold rounded-xl"
                >
                  Create Chain
                </button>
                <button
                  onClick={() => setShowNewChainForm(false)}
                  className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white font-medium rounded-xl"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        ) : selectedChain ? (
          <div className="max-w-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Edit Chain: {selectedChain.name}</h2>
              <button
                onClick={() => {
                  removeMergeChain(selectedChain.id);
                  setSelectedChainId(null);
                }}
                className="flex items-center gap-2 px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium"
              >
                <Trash2 size={16} />
                Delete Chain
              </button>
            </div>
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Chain ID</label>
                  <input
                    type="text"
                    value={selectedChain.id}
                    disabled
                    className="w-full bg-slate-700 text-white rounded-lg px-3 py-2 border border-slate-600 opacity-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Chain Name</label>
                  <input
                    type="text"
                    value={selectedChain.name}
                    onChange={(e) => updateMergeChain(selectedChain.id, { name: e.target.value })}
                    className="w-full bg-slate-700 text-white rounded-lg px-3 py-2 border border-slate-600"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
                <select
                  value={selectedChain.category}
                  onChange={(e) => updateMergeChain(selectedChain.id, { category: e.target.value as ItemCategory })}
                  className="w-full bg-slate-700 text-white rounded-lg px-3 py-2 border border-slate-600"
                >
                  {ITEM_CATEGORIES.map((cat) => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Items in Chain</label>
                <div className="space-y-2">
                  {selectedChain.items.map((itemId, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <span className="flex-1 bg-slate-700 text-white rounded-lg px-3 py-2 border border-slate-600">
                        {getItemName(itemId)}
                      </span>
                      <button
                        onClick={() => {
                          const newItems = [...selectedChain.items];
                          newItems.splice(index, 1);
                          updateMergeChain(selectedChain.id, { items: newItems });
                        }}
                        className="p-2 text-red-400 hover:text-red-300"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                  <select
                    onChange={(e) => {
                      if (e.target.value) {
                        updateMergeChain(selectedChain.id, {
                          items: [...selectedChain.items, e.target.value]
                        });
                        e.target.value = '';
                      }
                    }}
                    className="w-full bg-slate-700 text-white rounded-lg px-3 py-2 border border-slate-600"
                  >
                    <option value="">Add item to chain...</option>
                    {getAvailableItems(selectedChain.category)
                      .filter(item => !selectedChain.items.includes(item.id))
                      .map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.name} (Level {item.level})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setSelectedChainId(null)}
                  className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white font-medium rounded-xl"
                >
                  Done Editing
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            Select a chain to edit or create a new one
          </div>
        )}
      </div>
    </motion.div>
  );
}

function GardensManager() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex h-full"
    >
      <div className="flex-1 flex items-center justify-center text-gray-500">
        Gardens Manager - Coming Soon
      </div>
    </motion.div>
  );
}

function ChestsManager() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex h-full"
    >
      <div className="flex-1 flex items-center justify-center text-gray-500">
        Chests Manager - Coming Soon
      </div>
    </motion.div>
  );
}

function StoreManager() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex h-full"
    >
      <div className="flex-1 flex items-center justify-center text-gray-500">
        Store Manager - Coming Soon
      </div>
    </motion.div>
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
      <div className="w-80 bg-slate-800 border-r border-slate-700 flex flex-col">
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
          <input
            type="text"
            placeholder="Search events..."
            className="w-full bg-slate-700 text-white rounded-lg px-3 py-2 text-sm border border-slate-600 mb-3"
          />
        </div>
        
        <div className="flex-1 overflow-y-auto p-2">
          {Object.values(events).length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              No events yet. Add your first event!
            </div>
          ) : (
            <div className="space-y-1">
              {Object.values(events).map((event) => (
                <button
                  key={event.id}
                  onClick={() => setSelectedEventId(event.id)}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors ${
                    selectedEventId === event.id
                      ? 'bg-amber-500/20 border border-amber-500/50'
                      : 'bg-slate-700/50 hover:bg-slate-700 border border-transparent'
                  }`}
                >
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-blue-500">
                    <Calendar size={20} className="text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-white truncate">{event.name}</div>
                    <div className="text-xs text-gray-400">{event.type}</div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        {showNewEventForm ? (
          <div className="max-w-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Create New Event</h2>
              <button
                onClick={() => setShowNewEventForm(false)}
                className="text-gray-400 hover:text-white"
              >
                <X size={24} />
              </button>
            </div>
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">ID</label>
                  <input
                    type="text"
                    className="w-full bg-slate-700 text-white rounded-lg px-3 py-2 border border-slate-600"
                    placeholder="event-id"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Name</label>
                  <input
                    type="text"
                    className="w-full bg-slate-700 text-white rounded-lg px-3 py-2 border border-slate-600"
                    placeholder="Event Name"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Type</label>
                <select className="w-full bg-slate-700 text-white rounded-lg px-3 py-2 border border-slate-600">
                  <option value="seasonal">Seasonal</option>
                  <option value="limited">Limited Time</option>
                  <option value="achievement">Achievement</option>
                </select>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  className="flex-1 py-3 bg-amber-500 hover:bg-amber-600 text-black font-bold rounded-xl"
                >
                  Create Event
                </button>
                <button
                  onClick={() => setShowNewEventForm(false)}
                  className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white font-medium rounded-xl"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        ) : selectedEvent ? (
          <div className="max-w-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Edit Event: {selectedEvent.name}</h2>
              <button
                onClick={() => {
                  removeEvent(selectedEvent.id);
                  setSelectedEventId(null);
                }}
                className="flex items-center gap-2 px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium"
              >
                <Trash2 size={16} />
                Delete
              </button>
            </div>
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">ID</label>
                  <input
                    type="text"
                    value={selectedEvent.id}
                    className="w-full bg-slate-700 text-white rounded-lg px-3 py-2 border border-slate-600"
                    disabled
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Name</label>
                  <input
                    type="text"
                    value={selectedEvent.name}
                    className="w-full bg-slate-700 text-white rounded-lg px-3 py-2 border border-slate-600"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Type</label>
                <select
                  value={selectedEvent.type}
                  className="w-full bg-slate-700 text-white rounded-lg px-3 py-2 border border-slate-600"
                >
                  <option value="seasonal">Seasonal</option>
                  <option value="limited">Limited Time</option>
                  <option value="achievement">Achievement</option>
                </select>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  className="flex-1 py-3 bg-amber-500 hover:bg-amber-600 text-black font-bold rounded-xl"
                >
                  Save Changes
                </button>
                <button
                  onClick={() => setSelectedEventId(null)}
                  className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white font-medium rounded-xl"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            Select an event to edit or create a new one
          </div>
        )}
      </div>
    </motion.div>
  );
}
