import { X, MessageSquare, Package, Map, Plus, Edit, Trash2, Save, Upload, Download } from 'lucide-react';
import { useState } from 'react';
import { useDialogueStore } from '../lib/stores/useDialogueStore';
import { useAdminStore } from '../lib/stores/useAdminStore';
import { ItemCategory } from '../lib/mergeData';

interface AdminPanelProps {
  isOpen?: boolean;
  onClose?: () => void;
}

type TabType = 'dialogues' | 'items' | 'sprites';

export default function AdminPanel({ isOpen = true, onClose }: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState<TabType>('dialogues');
  const [showItemForm, setShowItemForm] = useState(false);
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [itemForm, setItemForm] = useState({
    id: '',
    name: '',
    description: '',
    category: 'flower' as ItemCategory,
    level: 1,
    maxLevel: 1,
    sprite: '',
    spriteX: 0,
    spriteY: 0,
    spriteW: 32,
    spriteH: 32,
    mergesInto: '',
    coinValue: 0,
    xpValue: 0,
    sellPrice: 0,
    isGenerator: false,
    generates: [] as string[],
    generationTime: 0,
    maxCharges: 0,
    energyCost: 0,
    isChest: false,
    chestRewards: {
      coins: 0,
      gems: 0,
      energy: 0,
      items: [] as string[]
    },
    isBlocked: false
  });

  const { dialogues, addDialogue, updateDialogue, deleteDialogue } = useDialogueStore();
  
  // Temporarily disable admin store to avoid issues
  const items: Record<string, any> = {};
  const mergeChains = [];
  const gardens = [];
  const allMapSprites: any[] = [];

  // Dummy functions for now
  const removeItem = (id: string) => {
    console.log('removeItem', id);
  };
  const exportConfig = () => {
    return {};
  };
  const importConfig = (config: any) => {
    console.log('importConfig', config);
  };
  const resetToDefaults = () => {
    console.log('resetToDefaults');
  };

  // Item management functions
  const handleAddItem = () => {
    setEditingItem(null);
    setItemForm({
      id: '',
      name: '',
      description: '',
      category: 'flower' as ItemCategory,
      level: 1,
      maxLevel: 1,
      sprite: '',
      spriteX: 0,
      spriteY: 0,
      spriteW: 32,
      spriteH: 32,
      mergesInto: '',
      coinValue: 0,
      xpValue: 0,
      sellPrice: 0,
      isGenerator: false,
      generates: [],
      generationTime: 0,
      maxCharges: 0,
      energyCost: 0,
      isChest: false,
      chestRewards: {
        coins: 0,
        gems: 0,
        energy: 0,
        items: []
      },
      isBlocked: false
    });
    setShowItemForm(true);
  };

  const handleEditItem = (itemId: string) => {
    const item = items[itemId];
    if (item) {
      setEditingItem(itemId);
      setItemForm({
        id: item.id,
        name: item.name,
        description: item.description,
        category: item.category,
        level: item.level,
        maxLevel: item.maxLevel,
        sprite: item.sprite,
        spriteX: item.spriteX,
        spriteY: item.spriteY,
        spriteW: item.spriteW,
        spriteH: item.spriteH,
        mergesInto: item.mergesInto || '',
        coinValue: item.coinValue,
        xpValue: item.xpValue,
        sellPrice: item.sellPrice,
        isGenerator: item.isGenerator || false,
        generates: item.generates || [],
        generationTime: item.generationTime || 0,
        maxCharges: item.maxCharges || 0,
        energyCost: item.energyCost || 0,
        isChest: item.isChest || false,
        chestRewards: {
          coins: item.chestRewards?.coins || 0,
          gems: item.chestRewards?.gems || 0,
          energy: item.chestRewards?.energy || 0,
          items: item.chestRewards?.items || []
        },
        isBlocked: item.isBlocked || false
      });
      setShowItemForm(true);
    }
  };

  const handleSaveItem = () => {
    if (!itemForm.id || !itemForm.name) {
      alert('ID and Name are required!');
      return;
    }

    const itemData = {
      ...itemForm,
      generates: itemForm.generates.filter(g => g.trim() !== ''),
      chestRewards: {
        ...itemForm.chestRewards,
        items: itemForm.chestRewards.items.filter(i => i.trim() !== '')
      }
    };

    if (editingItem) {
      // updateItem(editingItem, itemData);
      console.log('Would update item:', itemData);
    } else {
      // addItem(itemData);
      console.log('Would add item:', itemData);
    }

    setShowItemForm(false);
    setEditingItem(null);
  };

  const handleDeleteItem = (itemId: string) => {
    if (confirm('Are you sure you want to delete this item?')) {
      removeItem(itemId);
    }
  };

  const handleImportExport = (action: 'import' | 'export') => {
    if (action === 'export') {
      const config = exportConfig();
      const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'game-config.json';
      a.click();
      URL.revokeObjectURL(url);
    } else {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.json';
      input.onchange = (e) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (e) => {
            try {
              const config = JSON.parse(e.target?.result as string);
              importConfig(config);
              alert('Configuration imported successfully!');
            } catch (error) {
              alert('Invalid configuration file!');
            }
          };
          reader.readAsText(file);
        }
      };
      input.click();
    }
  };

  if (!isOpen) return null;

  const tabs = [
    { id: 'dialogues' as TabType, label: 'Dialogues', icon: MessageSquare, count: dialogues.length },
    { id: 'items' as TabType, label: 'Items', icon: Package, count: Object.keys(items).length },
    { id: 'sprites' as TabType, label: 'Sprites', icon: Map, count: allMapSprites.length },
  ];

  const isModal = !!onClose;

  const containerClasses = isModal 
    ? "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1000]"
    : "min-h-screen bg-gray-100 p-4";

  const panelClasses = isModal
    ? "bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden flex flex-col"
    : "bg-white rounded-lg p-6 max-w-6xl mx-auto shadow-lg";

  return (
    <div className={containerClasses}>
      <div className={panelClasses}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Admin Panel</h2>
          {isModal && (
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X size={24} />
            </button>
          )}
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <tab.icon size={16} />
              {tab.label}
              <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs">
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h3 className="text-lg font-semibold text-blue-800 mb-3">Quick Actions</h3>
          <div className="flex flex-wrap gap-2">
            <button 
              onClick={() => {
                if (confirm('Reset all game data to defaults? This cannot be undone!')) {
                  resetToDefaults();
                  alert('Game data reset to defaults!');
                }
              }}
              className="bg-red-500 text-white px-3 py-2 rounded text-sm hover:bg-red-600"
            >
              Reset to Defaults
            </button>
            <button 
              onClick={() => handleImportExport('export')}
              className="bg-green-500 text-white px-3 py-2 rounded text-sm hover:bg-green-600"
            >
              Export Config
            </button>
            <button 
              onClick={() => handleImportExport('import')}
              className="bg-purple-500 text-white px-3 py-2 rounded text-sm hover:bg-purple-600"
            >
              Import Config
            </button>
          </div>
        </div>

        {/* Development Helpers */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Development Helpers</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-gray-700 mb-2">Game Testing</h4>
              <div className="space-y-2">
                <button 
                  onClick={() => {
                    // Add test items to board
                    alert('Test items added to board! (Feature coming soon)');
                  }}
                  className="w-full bg-indigo-500 text-white px-3 py-2 rounded text-sm hover:bg-indigo-600"
                >
                  Add Test Items to Board
                </button>
                <button 
                  onClick={() => {
                    // Unlock all gardens
                    alert('All gardens unlocked! (Feature coming soon)');
                  }}
                  className="w-full bg-teal-500 text-white px-3 py-2 rounded text-sm hover:bg-teal-600"
                >
                  Unlock All Gardens
                </button>
              </div>
            </div>
            <div>
              <h4 className="font-medium text-gray-700 mb-2">Debug Info</h4>
              <div className="space-y-2 text-sm">
                <div className="bg-white p-2 rounded border">
                  <strong>Items:</strong> {Object.keys(items).length} total
                </div>
                <div className="bg-white p-2 rounded border">
                  <strong>Dialogues:</strong> {dialogues.length} conversations
                </div>
                <div className="bg-white p-2 rounded border">
                  <strong>Gardens:</strong> {gardens.length} areas
                </div>
                <div className="bg-white p-2 rounded border">
                  <strong>Sprites:</strong> {allMapSprites.length} graphics
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto">
          {activeTab === 'dialogues' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Dialogue Management</h3>
                <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                  Add Dialogue
                </button>
              </div>
              <div className="space-y-2">
                {dialogues.map((dialogue) => (
                  <div key={dialogue.id} className="border rounded p-3">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="font-medium capitalize">{dialogue.talker}</div>
                        <div className="text-sm text-gray-600 mt-1">{dialogue.content}</div>
                      </div>
                      <div className="flex gap-2">
                        <button className="text-blue-500 hover:text-blue-700">Edit</button>
                        <button className="text-red-500 hover:text-red-700">Delete</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'items' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Item Management</h3>
                <div className="flex gap-2">
                  <button onClick={() => handleImportExport('import')} className="bg-green-500 text-white px-3 py-2 rounded hover:bg-green-600 flex items-center gap-1">
                    <Upload size={16} />
                    Import
                  </button>
                  <button onClick={() => handleImportExport('export')} className="bg-purple-500 text-white px-3 py-2 rounded hover:bg-purple-600 flex items-center gap-1">
                    <Download size={16} />
                    Export
                  </button>
                  <button onClick={handleAddItem} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center gap-1">
                    <Plus size={16} />
                    Add Item
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                {Object.values(items).map((item) => (
                  <div key={item.id} className="border rounded p-3 hover:bg-gray-50">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="font-medium">{item.name}</div>
                        <div className="text-sm text-gray-600">
                          Level {item.level} • {item.category} • 
                          {item.sellPrice > 0 && ` Sell: ${item.sellPrice} coins`}
                          {item.chestRewards?.gems && item.chestRewards.gems > 0 && ` • ${item.chestRewards.gems} gems`}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => handleEditItem(item.id)} className="text-blue-500 hover:text-blue-700 p-1">
                          <Edit size={16} />
                        </button>
                        <button onClick={() => handleDeleteItem(item.id)} className="text-red-500 hover:text-red-700 p-1">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'sprites' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Map Sprite Management</h3>
                <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                  Add Sprite
                </button>
              </div>
              <div className="space-y-2">
                {allMapSprites.map((sprite) => (
                  <div key={`${sprite.gardenId}-${sprite.id}`} className="border rounded p-3">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="font-medium">{sprite.name}</div>
                        <div className="text-sm text-gray-600">{sprite.imagePath} • Garden: {sprite.gardenName}</div>
                      </div>
                      <div className="flex gap-2">
                        <button className="text-blue-500 hover:text-blue-700">Edit</button>
                        <button className="text-red-500 hover:text-red-700">Delete</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Item Form Modal */}
      {showItemForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[110]">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">{editingItem ? 'Edit Item' : 'Add New Item'}</h2>
              <button onClick={() => setShowItemForm(false)} className="text-gray-500 hover:text-gray-700">
                <X size={24} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ID *</label>
                <input
                  type="text"
                  value={itemForm.id}
                  onChange={(e) => setItemForm({...itemForm, id: e.target.value})}
                  className="w-full p-2 border rounded"
                  placeholder="unique_item_id"
                  disabled={!!editingItem}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                <input
                  type="text"
                  value={itemForm.name}
                  onChange={(e) => setItemForm({...itemForm, name: e.target.value})}
                  className="w-full p-2 border rounded"
                  placeholder="Item Name"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={itemForm.description}
                  onChange={(e) => setItemForm({...itemForm, description: e.target.value})}
                  className="w-full p-2 border rounded"
                  rows={2}
                  placeholder="Item description"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  value={itemForm.category}
                  onChange={(e) => setItemForm({...itemForm, category: e.target.value as ItemCategory})}
                  className="w-full p-2 border rounded"
                >
                  <option value="flower">Flower</option>
                  <option value="vegetable">Vegetable</option>
                  <option value="tree">Tree</option>
                  <option value="tool">Tool</option>
                  <option value="decoration">Decoration</option>
                  <option value="water">Water</option>
                  <option value="animal">Animal</option>
                  <option value="generator">Generator</option>
                  <option value="chest">Chest</option>
                  <option value="currency">Currency</option>
                  <option value="special">Special</option>
                  <option value="blocked">Blocked</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Level</label>
                <input
                  type="number"
                  value={itemForm.level}
                  onChange={(e) => setItemForm({...itemForm, level: parseInt(e.target.value) || 1})}
                  className="w-full p-2 border rounded"
                  min="1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sell Price (Coins)</label>
                <input
                  type="number"
                  value={itemForm.sellPrice}
                  onChange={(e) => setItemForm({...itemForm, sellPrice: parseInt(e.target.value) || 0})}
                  className="w-full p-2 border rounded"
                  min="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Chest Gems Reward</label>
                <input
                  type="number"
                  value={itemForm.chestRewards.gems}
                  onChange={(e) => setItemForm({
                    ...itemForm, 
                    chestRewards: {...itemForm.chestRewards, gems: parseInt(e.target.value) || 0}
                  })}
                  className="w-full p-2 border rounded"
                  min="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Coin Value</label>
                <input
                  type="number"
                  value={itemForm.coinValue}
                  onChange={(e) => setItemForm({...itemForm, coinValue: parseInt(e.target.value) || 0})}
                  className="w-full p-2 border rounded"
                  min="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">XP Value</label>
                <input
                  type="number"
                  value={itemForm.xpValue}
                  onChange={(e) => setItemForm({...itemForm, xpValue: parseInt(e.target.value) || 0})}
                  className="w-full p-2 border rounded"
                  min="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sprite Path</label>
                <input
                  type="text"
                  value={itemForm.sprite}
                  onChange={(e) => setItemForm({...itemForm, sprite: e.target.value})}
                  className="w-full p-2 border rounded"
                  placeholder="/sprites/item.png"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Merges Into</label>
                <input
                  type="text"
                  value={itemForm.mergesInto}
                  onChange={(e) => setItemForm({...itemForm, mergesInto: e.target.value})}
                  className="w-full p-2 border rounded"
                  placeholder="next_item_id"
                />
              </div>

              <div className="md:col-span-2 flex gap-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={itemForm.isGenerator}
                    onChange={(e) => setItemForm({...itemForm, isGenerator: e.target.checked})}
                    className="mr-2"
                  />
                  Is Generator
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={itemForm.isChest}
                    onChange={(e) => setItemForm({...itemForm, isChest: e.target.checked})}
                    className="mr-2"
                  />
                  Is Chest
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={itemForm.isBlocked}
                    onChange={(e) => setItemForm({...itemForm, isBlocked: e.target.checked})}
                    className="mr-2"
                  />
                  Is Blocked
                </label>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button 
                onClick={() => setShowItemForm(false)}
                className="px-4 py-2 text-gray-600 border rounded hover:bg-gray-100"
              >
                Cancel
              </button>
              <button 
                onClick={handleSaveItem}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center gap-2"
              >
                <Save size={16} />
                {editingItem ? 'Update Item' : 'Create Item'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}