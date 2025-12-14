import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShopStoreIcon, SellCoinIcon, PlantSeedlingIcon, GardenToolIcon, CherryBlossomIcon, TulipIcon, SunflowerIcon, RoseIcon, SproutIcon, GemIcon, GardenFlowerIcon, CloseFlowerIcon } from '../icons/GardenIcons';
import { useMergeGameStore } from '@/lib/stores/useMergeGameStore';
import { MERGE_ITEMS } from '@/lib/mergeData';

interface ShopItem {
  id: string;
  name: string;
  description: string;
  price: number;
  priceType: 'coins' | 'gems';
  category: string;
  itemType: string;
}

const SHOP_ITEMS: ShopItem[] = [
  { id: 'shop-flower-gen', name: 'Flower Garden', description: 'Generates flower seedlings', price: 100, priceType: 'coins', category: 'generator', itemType: 'gen_flower_1' },
  { id: 'shop-tool-gen', name: 'Tool Shed', description: 'Generates garden tools', price: 150, priceType: 'coins', category: 'generator', itemType: 'gen_tool_1' },
  { id: 'shop-flower-seed', name: 'Flower Seeds', description: 'Basic flower seedling', price: 25, priceType: 'coins', category: 'flower', itemType: 'flower_1' },
  { id: 'shop-tool-seed', name: 'Garden Shovel', description: 'Basic garden tool', price: 30, priceType: 'coins', category: 'tool', itemType: 'tool_1' },
  { id: 'shop-tree-seed', name: 'Tree Sapling', description: 'Grow a beautiful tree', price: 50, priceType: 'coins', category: 'tree', itemType: 'tree_1' },
  { id: 'shop-veg-seed', name: 'Veggie Seeds', description: 'Start a vegetable patch', price: 40, priceType: 'coins', category: 'vegetable', itemType: 'vegetable_1' },
  { id: 'shop-energy-pack', name: 'Energy Pack', description: 'Restore 50 energy', price: 5, priceType: 'gems', category: 'boost', itemType: 'energy' },
  { id: 'shop-coin-pack', name: 'Coin Bundle', description: 'Get 500 coins', price: 10, priceType: 'gems', category: 'boost', itemType: 'coins' },
];

interface ShopModalProps {
  onClose: () => void;
}

export default function ShopModal({ onClose }: ShopModalProps) {
  const { coins, gems, addItem, addCoins, addEnergy, spendCoins, spendGems, findEmptySpot } = useMergeGameStore();
  const [selectedItem, setSelectedItem] = useState<ShopItem | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'All', icon: <GardenFlowerIcon size={16} /> },
    { id: 'generator', label: 'Generators', icon: <SunflowerIcon size={16} /> },
    { id: 'flower', label: 'Flowers', icon: <RoseIcon size={16} /> },
    { id: 'tool', label: 'Tools', icon: <GardenToolIcon size={16} /> },
    { id: 'boost', label: 'Boosts', icon: <GemIcon size={16} /> },
  ];

  const filteredItems = activeCategory === 'all' 
    ? SHOP_ITEMS 
    : SHOP_ITEMS.filter(item => item.category === activeCategory);

  const handleBuyItem = (shopItem: ShopItem) => {
    const canAfford = shopItem.priceType === 'coins' 
      ? coins >= shopItem.price 
      : gems >= shopItem.price;

    if (!canAfford) return;

    if (shopItem.itemType === 'energy') {
      if (spendGems(shopItem.price)) {
        addEnergy(50);
      }
      return;
    }

    if (shopItem.itemType === 'coins') {
      if (spendGems(shopItem.price)) {
        addCoins(500);
      }
      return;
    }

    const emptySlot = findEmptySpot();
    if (!emptySlot) return;

    if (shopItem.priceType === 'coins') {
      if (spendCoins(shopItem.price)) {
        addItem(shopItem.itemType, emptySlot.x, emptySlot.y);
      }
    } else {
      if (spendGems(shopItem.price)) {
        addItem(shopItem.itemType, emptySlot.x, emptySlot.y);
      }
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'generator': return <SunflowerIcon size={32} />;
      case 'flower': return <RoseIcon size={32} />;
      case 'tool': return <GardenToolIcon size={32} />;
      case 'tree': return <PlantSeedlingIcon size={32} />;
      case 'vegetable': return <SproutIcon size={32} />;
      case 'boost': return <GemIcon size={32} />;
      default: return <GardenFlowerIcon size={32} />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ scale: 0.9, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 50 }}
        className="bg-gradient-to-b from-amber-50 via-orange-50 to-amber-100 rounded-2xl sm:rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-hidden border-4 border-amber-500 relative"
      >
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-pink-400 via-yellow-400 to-pink-400" />
        
        <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 p-4 flex items-center justify-between relative overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-2 left-4"><CherryBlossomIcon size={24} /></div>
            <div className="absolute top-1 right-16"><TulipIcon size={20} /></div>
            <div className="absolute bottom-1 left-16"><SunflowerIcon size={18} /></div>
            <div className="absolute bottom-2 right-4"><RoseIcon size={24} /></div>
          </div>
          <div className="flex items-center gap-3 relative z-10">
            <div className="w-12 h-12 bg-gradient-to-br from-amber-100 to-amber-200 rounded-xl flex items-center justify-center border-3 border-amber-400 shadow-lg">
              <ShopStoreIcon size={32} />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white drop-shadow-lg">Garden Shop</h2>
              <p className="text-amber-100 text-xs">Seeds, tools & garden supplies</p>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center relative z-10"
          >
            <CloseFlowerIcon size={36} />
          </motion.button>
        </div>

        <div className="flex items-center justify-center gap-3 p-3 bg-gradient-to-r from-amber-100 to-orange-100 border-b-2 border-amber-200">
          <div className="flex items-center gap-1.5 bg-yellow-200 px-4 py-2 rounded-full border-2 border-yellow-400 shadow-md">
            <SellCoinIcon size={22} />
            <span className="font-bold text-amber-800">{coins.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-1.5 bg-purple-200 px-4 py-2 rounded-full border-2 border-purple-400 shadow-md">
            <GemIcon size={22} />
            <span className="font-bold text-purple-800">{gems}</span>
          </div>
        </div>

        <div className="flex gap-2 p-3 overflow-x-auto border-b border-amber-200">
          {categories.map((cat) => (
            <motion.button
              key={cat.id}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                activeCategory === cat.id
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg'
                  : 'bg-white text-gray-600 hover:bg-amber-100 border border-amber-200'
              }`}
            >
              {cat.icon}
              {cat.label}
            </motion.button>
          ))}
        </div>

        <div className="p-3 overflow-y-auto max-h-[40vh]">
          <div className="grid grid-cols-2 gap-3">
            <AnimatePresence>
              {filteredItems.map((item) => {
                const canAfford = item.priceType === 'coins' ? coins >= item.price : gems >= item.price;
                return (
                  <motion.button
                    key={item.id}
                    layout
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    onClick={() => setSelectedItem(item)}
                    className={`p-3 rounded-2xl border-3 transition-all duration-200 relative overflow-hidden group ${
                      selectedItem?.id === item.id
                        ? 'bg-gradient-to-br from-amber-100 to-orange-100 border-amber-500 scale-[1.02] shadow-lg'
                        : canAfford
                        ? 'bg-white border-amber-200 hover:border-amber-400 hover:shadow-md'
                        : 'bg-gray-100 border-gray-200 opacity-60'
                    }`}
                  >
                    <div className="absolute top-1 right-1 opacity-40"><SproutIcon size={12} /></div>
                    <div className="w-14 h-14 mx-auto mb-2 bg-gradient-to-br from-amber-100 via-orange-50 to-amber-100 rounded-xl flex items-center justify-center border-2 border-amber-300 shadow-inner">
                      {getCategoryIcon(item.category)}
                    </div>
                    <div className="text-sm font-bold text-amber-800 truncate">{item.name}</div>
                    <div className="text-[10px] text-amber-600 mb-2 line-clamp-1">{item.description}</div>
                    <div className={`flex items-center justify-center gap-1.5 py-1.5 rounded-full border ${
                      item.priceType === 'coins'
                        ? 'bg-gradient-to-r from-amber-100 to-yellow-100 border-amber-300'
                        : 'bg-gradient-to-r from-purple-100 to-violet-100 border-purple-300'
                    }`}>
                      {item.priceType === 'coins' ? <SellCoinIcon size={18} /> : <GemIcon size={18} />}
                      <span className={`text-sm font-bold ${item.priceType === 'coins' ? 'text-amber-700' : 'text-purple-700'}`}>
                        {item.price}
                      </span>
                    </div>
                  </motion.button>
                );
              })}
            </AnimatePresence>
          </div>
        </div>

        <AnimatePresence>
          {selectedItem && (
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              className="p-4 bg-gradient-to-r from-amber-100 via-orange-50 to-amber-100 border-t-4 border-amber-300"
            >
              <div className="flex items-start gap-3 mb-3">
                <div className="w-16 h-16 bg-gradient-to-br from-amber-100 to-orange-100 rounded-2xl flex items-center justify-center border-3 border-amber-400 shadow-lg flex-shrink-0">
                  {getCategoryIcon(selectedItem.category)}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-amber-800 text-lg flex items-center gap-2">
                    {selectedItem.name}
                    <CherryBlossomIcon size={16} />
                  </h3>
                  <p className="text-sm text-amber-600">{selectedItem.description}</p>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleBuyItem(selectedItem)}
                disabled={selectedItem.priceType === 'coins' ? coins < selectedItem.price : gems < selectedItem.price}
                className={`w-full py-3 rounded-2xl font-bold flex items-center justify-center gap-2 text-lg transition-all duration-200 ${
                  (selectedItem.priceType === 'coins' ? coins >= selectedItem.price : gems >= selectedItem.price)
                    ? 'bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 text-white hover:from-amber-600 hover:via-orange-600 hover:to-amber-600 shadow-lg hover:shadow-xl'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                <CherryBlossomIcon size={18} />
                <span>Buy for</span>
                {selectedItem.priceType === 'coins' ? <SellCoinIcon size={20} /> : <GemIcon size={20} />}
                <span>{selectedItem.price}</span>
                <CherryBlossomIcon size={18} />
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
