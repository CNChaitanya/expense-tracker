import React, { useRef } from 'react';
import { Camera } from 'lucide-react';

interface ReceiptUploaderProps {
  onUpload: (base64: string) => void;
  currentImage?: string;
}

export const ReceiptUploader: React.FC<ReceiptUploaderProps> = ({ onUpload, currentImage }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onUpload(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex items-center gap-4">
      <input
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        ref={fileInputRef}
        onChange={handleFileChange}
      />
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        className={`p-4 rounded-xl transition-all ${currentImage ? 'bg-accent text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-500 hover:text-accent'}`}
      >
        <Camera size={24} />
      </button>
      {currentImage && (
        <div className="text-xs text-green-500 font-medium animate-pulse">
          Receipt Attached
        </div>
      )}
    </div>
  );
};
