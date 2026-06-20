
import React from 'react';
import { CameraIcon } from './icons/CameraIcon';

interface ImageGalleryProps {
  images: string[];
}

export const ImageGallery: React.FC<ImageGalleryProps> = ({ images }) => {
  if (images.length === 0) {
    return (
      <div className="w-full h-full min-h-[400px] flex flex-col items-center justify-center bg-white rounded-2xl shadow-md p-8 text-center">
        <CameraIcon className="w-20 h-20 text-gray-300 mb-4" />
        <h3 className="text-xl font-semibold text-gray-600">Your AI Twins Will Appear Here</h3>
        <p className="text-gray-400 mt-2">Upload a photo and provide a prompt to get started.</p>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-wrap justify-center gap-6">
      {images.map((base64, index) => {
        const imageUrl = `data:image/jpeg;base64,${base64}`;
        const downloadFileName = `RADD-AI-Twin-${index + 1}.png`;

        return (
          <div
            key={index}
            className="flex flex-col items-center bg-white rounded-2xl shadow-md overflow-hidden p-3 transition-all duration-300 hover:shadow-lg animate-fade-in w-full max-w-[320px]"
          >
            <img
              src={imageUrl}
              alt={`AI Twin ${index + 1}`}
              className="w-full h-auto rounded-xl object-cover mb-3"
            />
            <a
              href={imageUrl}
              download={downloadFileName}
              className="bg-metallic-gold text-white text-sm px-4 py-2 rounded-full shadow-md hover:opacity-90 transition duration-200"
            >
              Download AI Twin
            </a>
          </div>
        );
      })}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in {
          animation: fadeIn 0.5s ease-in-out forwards;
        }
      `}</style>
    </div>
  );
};
