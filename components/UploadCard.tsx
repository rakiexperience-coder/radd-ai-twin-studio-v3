
import React, { useRef } from 'react';
import { UploadIcon } from './icons/UploadIcon';

interface UploadCardProps {
  referencePreview: string | null;
  onFileChange: (file: File | null) => void;
  disabled: boolean;
}

export const UploadCard: React.FC<UploadCardProps> = ({ referencePreview, onFileChange, disabled }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCardClick = () => {
    if (!disabled) {
      fileInputRef.current?.click();
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    onFileChange(file);
  };
  
  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleCardClick();
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-md">
      <h2 className="text-xl font-semibold mb-4">1. Upload Reference Photo</h2>
      <div
        role="button"
        tabIndex={disabled ? -1 : 0}
        onClick={handleCardClick}
        onKeyDown={handleKeyDown}
        className={`relative aspect-square w-full bg-ivory rounded-lg border-2 border-dashed border-metallic-gold flex flex-col items-center justify-center text-center p-4 transition-all duration-300 ${!disabled ? 'cursor-pointer hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-metallic-gold' : 'cursor-not-allowed opacity-70'}`}
        aria-label="Upload reference photo"
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          accept="image/png, image/jpeg, image/webp"
          className="hidden"
          disabled={disabled}
        />
        {referencePreview ? (
          <img src={referencePreview} alt="Reference Preview" className="absolute inset-0 w-full h-full object-cover rounded-lg" />
        ) : (
          <>
            <UploadIcon className="w-12 h-12 text-metallic-gold mb-2" />
            <p className="font-semibold text-metallic-gold">Click to upload</p>
            <p className="text-xs text-gray-500 mt-1">PNG, JPG, WEBP up to 10MB</p>
          </>
        )}
      </div>
    </div>
  );
};
