import { useState, useRef } from 'react';
import { Upload, X, Image, Loader2, Check } from 'lucide-react';

interface SpriteUploaderProps {
  currentSprite?: string;
  onSpriteChange: (spritePath: string) => void;
  label?: string;
  autoResize?: boolean;
  targetSize?: { width: number; height: number };
}

interface UploadedImage {
  filename: string;
  path: string;
}

export default function SpriteUploader({ 
  currentSprite, 
  onSpriteChange, 
  label = 'Sprite Image',
  autoResize = true,
  targetSize = { width: 128, height: 128 }
}: SpriteUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [showGallery, setShowGallery] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchUploadedImages = async () => {
    try {
      const response = await fetch('/api/uploads');
      const data = await response.json();
      setUploadedImages(data.images || []);
    } catch (err) {
      console.error('Failed to fetch images:', err);
    }
  };

  const resizeImage = (file: File, targetWidth: number, targetHeight: number): Promise<Blob> => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;
      const img = new window.Image();

      img.onload = () => {
        // Calculate dimensions to maintain aspect ratio
        const aspectRatio = img.width / img.height;
        let newWidth = targetWidth;
        let newHeight = targetHeight;

        if (aspectRatio > 1) {
          // Image is wider than tall
          newHeight = targetWidth / aspectRatio;
        } else {
          // Image is taller than wide
          newWidth = targetHeight * aspectRatio;
        }

        // Center the image
        const x = (targetWidth - newWidth) / 2;
        const y = (targetHeight - newHeight) / 2;

        canvas.width = targetWidth;
        canvas.height = targetHeight;

        // Fill with transparent background
        ctx.clearRect(0, 0, targetWidth, targetHeight);

        // Draw the resized image
        ctx.drawImage(img, x, y, newWidth, newHeight);

        canvas.toBlob((blob) => {
          resolve(blob!);
        }, file.type, 0.9);
      };

      img.src = URL.createObjectURL(file);
    });
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setError(null);

    try {
      let processedFile = file;

      if (autoResize) {
        const resizedBlob = await resizeImage(file, targetSize.width, targetSize.height);
        processedFile = new File([resizedBlob], file.name, { type: file.type });
      }

      const formData = new FormData();
      formData.append('sprite', processedFile);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      if (data.success) {
        onSpriteChange(data.path);
        fetchUploadedImages();
      } else {
        setError(data.error || 'Upload failed');
      }
    } catch (err) {
      setError('Failed to upload image');
      console.error('Upload error:', err);
    } finally {
      setIsUploading(false);
    }
  };

  const openGallery = () => {
    fetchUploadedImages();
    setShowGallery(true);
  };

  const selectImage = (path: string) => {
    onSpriteChange(path);
    setShowGallery(false);
  };

  const deleteImage = async (filename: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await fetch(`/api/uploads/${filename}`, { method: 'DELETE' });
      fetchUploadedImages();
      if (currentSprite?.includes(filename)) {
        onSpriteChange('');
      }
    } catch (err) {
      console.error('Failed to delete image:', err);
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-300">{label}</label>
      
      <div className="flex items-center gap-3">
        <div className="w-24 h-24 bg-slate-700 rounded-lg border-2 border-dashed border-slate-500 flex items-center justify-center overflow-hidden">
          {currentSprite ? (
            <img 
              src={currentSprite} 
              alt="Sprite preview" 
              className="w-full h-full object-contain"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          ) : (
            <Image size={32} className="text-slate-500" />
          )}
        </div>

        <div className="flex flex-col gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleUpload}
            className="hidden"
          />
          
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="flex items-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white rounded-lg text-sm font-medium transition-colors"
          >
            {isUploading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload size={16} />
                Upload New
              </>
            )}
          </button>

          <button
            onClick={openGallery}
            className="flex items-center gap-2 px-3 py-2 bg-slate-600 hover:bg-slate-500 text-white rounded-lg text-sm font-medium transition-colors"
          >
            <Image size={16} />
            Browse Gallery
          </button>

          {currentSprite && (
            <button
              onClick={() => onSpriteChange('')}
              className="flex items-center gap-2 px-3 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-lg text-sm font-medium transition-colors"
            >
              <X size={16} />
              Remove
            </button>
          )}
        </div>
      </div>

      {error && (
        <p className="text-red-400 text-sm">{error}</p>
      )}

      <input
        type="text"
        value={currentSprite || ''}
        onChange={(e) => onSpriteChange(e.target.value)}
        placeholder="Or enter path manually (e.g., /uploads/image.png)"
        className="w-full bg-slate-700 text-white rounded-lg px-3 py-2 border border-slate-600 text-sm"
      />

      {showGallery && (
        <div className="fixed inset-0 bg-black/80 z-[150] flex items-center justify-center p-4">
          <div className="bg-slate-800 rounded-xl max-w-3xl w-full max-h-[80vh] flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-slate-700">
              <h3 className="text-lg font-bold text-white">Sprite Gallery</h3>
              <button
                onClick={() => setShowGallery(false)}
                className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white hover:bg-slate-700 rounded-lg"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              {uploadedImages.length === 0 ? (
                <div className="text-center text-gray-400 py-12">
                  <Image size={48} className="mx-auto mb-4 opacity-50" />
                  <p>No uploaded images yet</p>
                  <p className="text-sm mt-2">Upload images using the button above</p>
                </div>
              ) : (
                <div className="grid grid-cols-4 gap-4">
                  {uploadedImages.map((image) => (
                    <div
                      key={image.filename}
                      onClick={() => selectImage(image.path)}
                      className={`relative group cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
                        currentSprite === image.path
                          ? 'border-amber-400 ring-2 ring-amber-400/30'
                          : 'border-slate-600 hover:border-slate-400'
                      }`}
                    >
                      <img
                        src={image.path}
                        alt={image.filename}
                        className="w-full aspect-square object-cover"
                      />
                      {currentSprite === image.path && (
                        <div className="absolute top-2 right-2 w-6 h-6 bg-amber-400 rounded-full flex items-center justify-center">
                          <Check size={14} className="text-slate-900" />
                        </div>
                      )}
                      <button
                        onClick={(e) => deleteImage(image.filename, e)}
                        className="absolute top-2 left-2 w-6 h-6 bg-red-600 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X size={14} className="text-white" />
                      </button>
                      <div className="absolute bottom-0 left-0 right-0 bg-black/70 px-2 py-1 text-xs text-gray-300 truncate opacity-0 group-hover:opacity-100 transition-opacity">
                        {image.filename}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
