import { useEffect, useState } from 'react';

interface LoadingScreenProps {
  onLoadComplete: () => void;
}

export default function LoadingScreen({ onLoadComplete }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const [imagesLoaded, setImagesLoaded] = useState(false);

  useEffect(() => {
    const imagesToPreload = [
      '/sprites/IMG_20251111_022306_1762821019727.png',
      '/sprites/Picsart_25-11-11_02-24-51-362_1762821030770.png',
      '/sprites/Picsart_25-11-11_02-25-24-524_1762821030742.png',
      '/sprites/Picsart_25-11-11_02-29-52-444_1762821030715.png'
    ];

    let loadedCount = 0;
    const totalImages = imagesToPreload.length;

    const preloadImage = (src: string) => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
          loadedCount++;
          setProgress(Math.floor((loadedCount / totalImages) * 100));
          resolve(img);
        };
        img.onerror = reject;
        img.src = src;
      });
    };

    Promise.all(imagesToPreload.map(src => preloadImage(src)))
      .then(() => {
        setImagesLoaded(true);
        setTimeout(() => {
          onLoadComplete();
        }, 500);
      })
      .catch(error => {
        console.error('Error loading images:', error);
        setImagesLoaded(true);
        onLoadComplete();
      });
  }, [onLoadComplete]);

  return (
    <div className="fixed inset-0 bg-gradient-to-b from-sky-400 to-sky-200 flex flex-col items-center justify-center overflow-hidden">
      <div className="relative w-full max-w-2xl px-4 mb-32">
        <img
          src="/sprites/IMG_20251111_022306_1762821019727.png"
          alt="Merge Story"
          className="w-full h-auto object-contain animate-fade-in"
          style={{ 
            filter: 'drop-shadow(0 10px 30px rgba(0, 0, 0, 0.2))'
          }}
        />
      </div>
      
      <div className="fixed bottom-8 left-0 right-0 px-8">
        <div className="max-w-2xl mx-auto">
          <div className="relative h-8 bg-gradient-to-r from-yellow-100 to-yellow-50 rounded-full overflow-hidden border-4 border-yellow-600 shadow-lg">
            <div 
              className="h-full bg-gradient-to-r from-yellow-400 via-yellow-500 to-orange-400 transition-all duration-300 ease-out relative"
              style={{ width: `${progress}%` }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/30 to-white/60"></div>
              <div className="absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent via-white/40 to-transparent"></div>
            </div>
            
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-sm font-bold text-yellow-900 drop-shadow-sm z-10">
                {progress}%
              </span>
            </div>
          </div>
          
          <div className="mt-2 flex justify-center gap-1">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-2 h-2 rounded-full bg-yellow-600 animate-wave"
                style={{ animationDelay: `${i * 0.2}s` }}
              ></div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        
        @keyframes wave {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        
        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
        
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
        
        .animate-wave {
          animation: wave 1.4s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
