import { useState } from 'react';
import { ROOMS, Room } from '@/lib/rooms';
import { useMergeGame } from '@/lib/stores/useMergeGame';

export default function RoomProgress() {
  const [showRooms, setShowRooms] = useState(false);
  const { coins, spendCoins, unlockRoom, isRoomUnlocked } = useMergeGame();

  const handleUnlockRoom = (room: Room) => {
    if (spendCoins(room.unlockCost)) {
      unlockRoom(room.id);
      alert(`🎉 ${room.name} unlocked!`);
    } else {
      alert('Not enough coins!');
    }
  };

  const unlockedCount = ROOMS.filter(room => isRoomUnlocked(room.id)).length;
  const totalCount = ROOMS.length;
  const progress = (unlockedCount / totalCount) * 100;

  return (
    <div className="mt-4">
      <button
        onClick={() => setShowRooms(!showRooms)}
        className="w-full bg-gradient-to-r from-purple-400 to-pink-500 text-white font-bold py-3 px-6 rounded-2xl shadow-lg hover:shadow-xl transition-all"
      >
        🏠 Beach House Progress ({unlockedCount}/{totalCount})
      </button>

      <div className="mt-2 bg-white/80 rounded-full h-4 overflow-hidden border-2 border-purple-300">
        <div 
          className="bg-gradient-to-r from-purple-500 to-pink-500 h-full transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      {showRooms && (
        <div className="mt-4 bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-xl border-2 border-purple-300 max-h-96 overflow-y-auto">
          <h3 className="text-lg font-bold text-gray-800 mb-3 text-center">Beach House Rooms</h3>
          
          <div className="space-y-3">
            {ROOMS.map(room => {
              const unlocked = isRoomUnlocked(room.id);
              
              return (
                <div
                  key={room.id}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    unlocked
                      ? 'bg-gradient-to-r from-green-50 to-blue-50 border-green-300'
                      : 'bg-gray-50 border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="text-3xl">{room.emoji}</div>
                      <div>
                        <h4 className="font-bold text-gray-800">
                          {room.name}
                          {unlocked && <span className="ml-2 text-green-500">✓</span>}
                        </h4>
                        <p className="text-xs text-gray-600">{room.description}</p>
                      </div>
                    </div>
                    
                    {!unlocked && (
                      <button
                        onClick={() => handleUnlockRoom(room)}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded-lg shadow transition-all text-sm"
                      >
                        💰 {room.unlockCost}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
