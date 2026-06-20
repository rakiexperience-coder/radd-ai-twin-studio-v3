
import React from 'react';

interface SpinnerProps {
  message: string;
}

export const Spinner: React.FC<SpinnerProps> = ({ message }) => {
  return (
    <div 
      className="w-full h-full min-h-[400px] flex flex-col items-center justify-center bg-white rounded-2xl shadow-md p-8 text-center"
      role="status"
      aria-live="polite"
    >
      <div className="w-16 h-16 border-4 border-t-4 border-gray-200 border-t-metallic-gold rounded-full animate-spin"></div>
      <p className="mt-6 text-lg font-medium text-gray-600">{message}</p>
    </div>
  );
};
