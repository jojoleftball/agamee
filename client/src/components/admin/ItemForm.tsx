import { X } from 'lucide-react';
import { AdminMergeItem } from '@/lib/stores/useAdminStore';
import { ItemCategory } from '@/lib/mergeData';
import SpriteUploader from './SpriteUploader';

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

interface ItemFormProps {
  item: AdminMergeItem;
  onChange: (item: AdminMergeItem | ((prevItem: AdminMergeItem) => AdminMergeItem)) => void;
  onSave: () => void;
  onCancel: () => void;
  isNew: boolean;
}

export default function ItemForm({ item, onChange, onSave, onCancel, isNew }: ItemFormProps) {
  const handleChange = (field: keyof AdminMergeItem, value: any) => {
    onChange((prevItem) => ({ ...prevItem, [field]: value }));
  };

  const handleTagAdd = (tag: string) => {
    if (tag) {
      onChange((prevItem) => {
        if (!prevItem.tags?.includes(tag)) {
          return { ...prevItem, tags: [...(prevItem.tags || []), tag] };
        }
        return prevItem;
      });
    }
  };

  const handleTagRemove = (tag: string) => {
    onChange((prevItem) => ({
      ...prevItem,
      tags: prevItem.tags?.filter(t => t !== tag) || []
    }));
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">ID</label>
          <input
            type="text"
            value={item.id}
            onChange={(e) => handleChange('id', e.target.value)}
            className="w-full bg-slate-700 text-white rounded-lg px-3 py-2 border border-slate-600"
            placeholder="unique-item-id"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Name</label>
          <input
            type="text"
            value={item.name}
            onChange={(e) => handleChange('name', e.target.value)}
            className="w-full bg-slate-700 text-white rounded-lg px-3 py-2 border border-slate-600"
            placeholder="Item Name"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
        <textarea
          value={item.description || ''}
          onChange={(e) => handleChange('description', e.target.value)}
          className="w-full bg-slate-700 text-white rounded-lg px-3 py-2 border border-slate-600 h-20"
          placeholder="Item description..."
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
          <select
            value={item.category}
            onChange={(e) => handleChange('category', e.target.value as ItemCategory)}
            className="w-full bg-slate-700 text-white rounded-lg px-3 py-2 border border-slate-600"
          >
            {ITEM_CATEGORIES.map(cat => (
              <option key={cat.value} value={cat.value}>{cat.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Rarity</label>
          <select
            value={item.rarity}
            onChange={(e) => handleChange('rarity', e.target.value as 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary')}
            className="w-full bg-slate-700 text-white rounded-lg px-3 py-2 border border-slate-600"
          >
            <option value="common">Common</option>
            <option value="uncommon">Uncommon</option>
            <option value="rare">Rare</option>
            <option value="epic">Epic</option>
            <option value="legendary">Legendary</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Level</label>
          <input
            type="number"
            value={item.level}
            onChange={(e) => handleChange('level', parseInt(e.target.value) || 1)}
            className="w-full bg-slate-700 text-white rounded-lg px-3 py-2 border border-slate-600"
            min="1"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Max Level</label>
          <input
            type="number"
            value={item.maxLevel}
            onChange={(e) => handleChange('maxLevel', parseInt(e.target.value) || 1)}
            className="w-full bg-slate-700 text-white rounded-lg px-3 py-2 border border-slate-600"
            min="1"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Unlock Level</label>
          <input
            type="number"
            value={item.unlockLevel}
            onChange={(e) => handleChange('unlockLevel', parseInt(e.target.value) || 1)}
            className="w-full bg-slate-700 text-white rounded-lg px-3 py-2 border border-slate-600"
            min="1"
          />
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Coin Value</label>
          <input
            type="number"
            value={item.coinValue}
            onChange={(e) => handleChange('coinValue', parseInt(e.target.value) || 0)}
            className="w-full bg-slate-700 text-white rounded-lg px-3 py-2 border border-slate-600"
            min="0"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">XP Value</label>
          <input
            type="number"
            value={item.xpValue}
            onChange={(e) => handleChange('xpValue', parseInt(e.target.value) || 0)}
            className="w-full bg-slate-700 text-white rounded-lg px-3 py-2 border border-slate-600"
            min="0"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Sell Price</label>
          <input
            type="number"
            value={item.sellPrice}
            onChange={(e) => handleChange('sellPrice', parseInt(e.target.value) || 0)}
            className="w-full bg-slate-700 text-white rounded-lg px-3 py-2 border border-slate-600"
            min="0"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Gem Sell Price</label>
          <input
            type="number"
            value={item.gemSellPrice}
            onChange={(e) => handleChange('gemSellPrice', parseInt(e.target.value) || 0)}
            className="w-full bg-slate-700 text-white rounded-lg px-3 py-2 border border-slate-600"
            min="0"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Sprite</label>
        <div className="flex gap-2">
          <input
            type="text"
            value={item.sprite}
            onChange={(e) => handleChange('sprite', e.target.value)}
            className="flex-1 bg-slate-700 text-white rounded-lg px-3 py-2 border border-slate-600"
            placeholder="sprite-filename.png"
          />
          <SpriteUploader
            currentSprite={item.sprite}
            onSpriteChange={(spritePath) => handleChange('sprite', spritePath)}
            label=""
          />
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Sprite X</label>
          <input
            type="number"
            value={item.spriteX}
            onChange={(e) => handleChange('spriteX', parseInt(e.target.value) || 0)}
            className="w-full bg-slate-700 text-white rounded-lg px-3 py-2 border border-slate-600"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Sprite Y</label>
          <input
            type="number"
            value={item.spriteY}
            onChange={(e) => handleChange('spriteY', parseInt(e.target.value) || 0)}
            className="w-full bg-slate-700 text-white rounded-lg px-3 py-2 border border-slate-600"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Sprite W</label>
          <input
            type="number"
            value={item.spriteW}
            onChange={(e) => handleChange('spriteW', parseInt(e.target.value) || 128)}
            className="w-full bg-slate-700 text-white rounded-lg px-3 py-2 border border-slate-600"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Sprite H</label>
          <input
            type="number"
            value={item.spriteH}
            onChange={(e) => handleChange('spriteH', parseInt(e.target.value) || 128)}
            className="w-full bg-slate-700 text-white rounded-lg px-3 py-2 border border-slate-600"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Tags</label>
        <div className="flex flex-wrap gap-2 mb-2">
          {item.tags?.map(tag => (
            <span key={tag} className="bg-amber-500/20 text-amber-300 px-2 py-1 rounded-lg text-sm flex items-center gap-1">
              {tag}
              <button onClick={() => handleTagRemove(tag)} className="text-amber-300 hover:text-amber-100">
                <X size={12} />
              </button>
            </span>
          ))}
        </div>
        <input
          type="text"
          placeholder="Add tag..."
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              handleTagAdd((e.target as HTMLInputElement).value);
              (e.target as HTMLInputElement).value = '';
            }
          }}
          className="w-full bg-slate-700 text-white rounded-lg px-3 py-2 border border-slate-600"
        />
      </div>

      <div className="flex gap-3 pt-4">
        <button
          onClick={onSave}
          disabled={!item.id || !item.name}
          className="flex-1 py-3 bg-amber-500 hover:bg-amber-600 disabled:bg-gray-600 text-black font-bold rounded-xl disabled:cursor-not-allowed"
        >
          {isNew ? 'Create Item' : 'Save Changes'}
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