
import React from 'react';
import { GenerationSettings, AspectRatio } from '../types';

interface SettingsPanelProps {
  settings: GenerationSettings;
  setSettings: React.Dispatch<React.SetStateAction<GenerationSettings>>;
  disabled: boolean;
}

const aspectRatios: AspectRatio[] = ['1:1', '3:4', '9:16'];
const aspectRatioLabels: Record<AspectRatio, string> = {
  '1:1': 'Square',
  '3:4': 'Portrait',
  '9:16': 'Story'
};

export const SettingsPanel: React.FC<SettingsPanelProps> = ({ settings, setSettings, disabled }) => {
  const handleSettingChange = <K extends keyof GenerationSettings>(key: K, value: GenerationSettings[K]) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-md space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-4">2. Creative Prompt</h2>
        <textarea
          value={settings.prompt}
          onChange={(e) => handleSettingChange('prompt', e.target.value)}
          placeholder="e.g., A clean editorial portrait with soft gold tones"
          className="w-full h-24 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-metallic-gold focus:border-transparent transition"
          disabled={disabled}
        />
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">3. Generation Settings</h2>
        <div className="space-y-4">
          {/* Number of Images */}
          <div className="flex justify-between items-center">
            <label htmlFor="numImages" className="font-medium">Number of images:</label>
            <span className="font-bold text-metallic-gold text-lg">{settings.numImages}</span>
          </div>
          <input
            id="numImages"
            type="range"
            min="1"
            max="6"
            step="1"
            value={settings.numImages}
            onChange={(e) => handleSettingChange('numImages', parseInt(e.target.value, 10))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-metallic-gold"
            disabled={disabled}
          />
          
          {/* Aspect Ratio */}
          <div>
            <label className="font-medium block mb-2">Aspect ratio:</label>
            <div className="grid grid-cols-3 gap-2">
              {aspectRatios.map((ratio) => (
                <button
                  key={ratio}
                  onClick={() => handleSettingChange('aspectRatio', ratio)}
                  className={`py-2 px-3 text-sm font-semibold rounded-lg transition-colors ${settings.aspectRatio === ratio ? 'bg-metallic-gold text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                  disabled={disabled}
                >
                  {aspectRatioLabels[ratio]}
                </button>
              ))}
            </div>
          </div>
          
          {/* Enhance Resolution */}
          <div className="flex items-center">
            <input
              id="enhanceResolution"
              type="checkbox"
              checked={settings.enhanceResolution}
              onChange={(e) => handleSettingChange('enhanceResolution', e.target.checked)}
              className="w-5 h-5 text-metallic-gold bg-gray-100 border-gray-300 rounded focus:ring-metallic-gold focus:ring-2 accent-metallic-gold"
              disabled={disabled}
            />
            <label htmlFor="enhanceResolution" className="ml-3 font-medium text-gray-700">
              Enhance Resolution <span className="text-xs text-gray-500">(NanoBanana)</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};
