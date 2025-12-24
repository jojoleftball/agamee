import { useState } from 'react';
import { useMergeGameStore } from '@/lib/stores/useMergeGameStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Gift, Coins, Gem, Zap } from 'lucide-react';

interface ChestPanelProps {
  onClose: () => void;
}

export default function ChestPanel({ onClose }: ChestPanelProps) {
  const { chests, openChest } = useMergeGameStore();

  const handleOpenChest = (chestId: string) => {
    openChest(chestId);
  };

  const unopenedChests = chests.filter(chest => !chest.opened);

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-4xl max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-800">Chests</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            ×
          </Button>
        </div>

        <div className="p-6">
          {unopenedChests.length === 0 ? (
            <div className="text-center py-8">
              <Gift className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500">No chests available</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {unopenedChests.map((chest) => (
                <Card key={chest.id} className="relative">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Gift className="w-6 h-6" />
                      {chest.type === 'merge' ? 'Merge Chest' : 'Special Chest'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 mb-4">
                      {chest.rewards.coins && (
                        <div className="flex items-center gap-2">
                          <Coins className="w-4 h-4 text-yellow-500" />
                          <span>{chest.rewards.coins} coins</span>
                        </div>
                      )}
                      {chest.rewards.gems && (
                        <div className="flex items-center gap-2">
                          <Gem className="w-4 h-4 text-purple-500" />
                          <span>{chest.rewards.gems} gems</span>
                        </div>
                      )}
                      {chest.rewards.energy && (
                        <div className="flex items-center gap-2">
                          <Zap className="w-4 h-4 text-blue-500" />
                          <span>{chest.rewards.energy} energy</span>
                        </div>
                      )}
                      {chest.rewards.items && chest.rewards.items.length > 0 && (
                        <div className="flex items-center gap-2">
                          <Gift className="w-4 h-4 text-green-500" />
                          <span>{chest.rewards.items.length} items</span>
                        </div>
                      )}
                    </div>
                    <Button
                      onClick={() => handleOpenChest(chest.id)}
                      className="w-full"
                    >
                      Open Chest
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}