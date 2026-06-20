
import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="text-center w-full mt-4 mb-8">
      <h1 className="text-4xl font-serif font-semibold text-metallic-gold">
        RADD AI Twin Studio v1.0
      </h1>
      <p className="mt-2 text-sm sm:text-base font-medium tracking-wide text-neutral-600">
        Create eye-catching, brand-aligned AI twin images from a single photo.
      </p>
    </header>
  );
};
