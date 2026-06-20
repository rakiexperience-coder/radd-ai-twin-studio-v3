
import React, { useState } from 'react';

interface LicenseGateProps {
  onVerified: (key: string) => void;
}

export const LicenseGate: React.FC<LicenseGateProps> = ({ onVerified }) => {
  const [input, setInput] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() === 'RADDVIP') {
      onVerified(input.trim());
    } else {
      setError('Invalid Password. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-ivory p-6">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-10 text-center border border-metallic-gold/20">
        <h1 className="text-3xl font-serif font-bold text-metallic-gold mb-4">
          RADD AI Twin Studio
        </h1>
        <p className="text-neutral-600 mb-8 font-medium">
          Enter your RADD VIP password to access the studio.
        </p>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <input
              type="text"
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                setError('');
              }}
              placeholder="Enter Password"
              className="w-full px-4 py-4 rounded-xl border border-neutral-300 focus:ring-2 focus:ring-metallic-gold focus:border-transparent outline-none text-center font-bold tracking-widest transition-all"
            />
            {error && <p className="text-red-500 text-sm mt-2 font-semibold">{error}</p>}
          </div>
          
          <button
            type="submit"
            className="w-full bg-metallic-gold text-white font-bold py-4 rounded-xl hover:opacity-90 transition-opacity shadow-lg shadow-metallic-gold/20"
          >
            Verify Password
          </button>
        </form>
        
        <p className="mt-10 text-xs text-neutral-400">
          Need access? Contact Raki AI Digital DEN.
        </p>
      </div>
    </div>
  );
};
