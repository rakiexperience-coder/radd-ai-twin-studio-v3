
import React, { useState, useCallback, useEffect } from 'react';
import { Header } from './components/Header';
import { UploadCard } from './components/UploadCard';
import { SettingsPanel } from './components/SettingsPanel';
import { ImageGallery } from './components/ImageGallery';
import { Footer } from './components/Footer';
import { Spinner } from './components/Spinner';
import { ErrorAlert } from './components/ErrorAlert';
import { LicenseGate } from './components/LicenseGate';
import { generateImages } from './services/geminiService';
import { GenerationSettings } from './types';
import { fileToBase64 } from './utils/file';

const initialSettings: GenerationSettings = {
  prompt: 'A clean editorial portrait with soft gold tones',
  numImages: 1,
  aspectRatio: '1:1',
  enhanceResolution: false,
};

const App: React.FC = () => {
  const [license, setLicense] = useState<string | null>(localStorage.getItem('radd_license'));
  
  const [settings, setSettings] = useState<GenerationSettings>(initialSettings);
  const [referenceFile, setReferenceFile] = useState<File | null>(null);
  const [referencePreview, setReferencePreview] = useState<string | null>(null);
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<string[]>([]);

  const handleResetAccess = useCallback(() => {
    localStorage.removeItem('radd_license');
    setLicense(null);
    setGeneratedImages([]);
    setHistory([]);
    setError(null);
  }, []);

  const handleLicenseVerified = (key: string) => {
    localStorage.setItem('radd_license', key);
    setLicense(key);
  };


  const handleFileChange = useCallback((file: File | null) => {
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setError('File size cannot exceed 10MB.');
        setReferenceFile(null);
        setReferencePreview(null);
        return;
      }
      setError(null);
      setReferenceFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setReferencePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setReferenceFile(null);
      setReferencePreview(null);
    }
  }, []);
  
  const handleStartOver = useCallback(() => {
    setSettings(initialSettings);
    setReferenceFile(null);
    setReferencePreview(null);
    setGeneratedImages([]);
    setHistory([]);
    setError(null);
  }, []);

  const handleGenerate = useCallback(async () => {
    if (!referenceFile) {
      setError('Please upload a reference photo first.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setGeneratedImages([]);

    try {
      const base64Image = await fileToBase64(referenceFile);
      const mimeType = referenceFile.type;
      
      let creativePrompt = settings.prompt;
      if (settings.enhanceResolution) {
        creativePrompt += ' Hyperrealistic, 8k, detailed, professional photography, ultra-realistic details.';
      }
      
      setLoadingMessage(`Generating ${settings.numImages} AI twin(s)... This may take a moment.`);
      
      const images = await generateImages(
        base64Image,
        mimeType,
        creativePrompt,
        settings.numImages,
        settings.aspectRatio,
      );

      setGeneratedImages(images);
      setHistory(prevHistory => [...images, ...prevHistory]);

    } catch (err: any) {
      console.error(err);
      let detailedMessage = err.message || 'Please try again.';
      if (detailedMessage.includes('IMAGE_OTHER') || detailedMessage.includes('blocked')) {
        detailedMessage = "The AI's safety system blocked this request. Try a different reference photo or a safer prompt.";
      }
      setError(`Generation failed. ${detailedMessage}`);
    } finally {
      setIsLoading(false);
      setLoadingMessage('');
    }
  }, [referenceFile, settings]);

  if (license !== 'RADDVIP') {
    return <LicenseGate onVerified={handleLicenseVerified} />;
  }


  return (
    <div className="min-h-screen flex flex-col items-center p-4 sm:p-6 lg:p-8 bg-ivory">
      <Header />
      
      <div className="w-full max-w-7xl flex justify-end mb-4">
        <button 
          onClick={handleResetAccess}
          className="text-xs font-bold text-metallic-gold hover:underline uppercase tracking-widest"
        >
          Reset Access / API Key
        </button>
      </div>

      <main className="w-full max-w-7xl flex-grow flex flex-col items-center">
        
        <div className="w-full flex flex-col lg:flex-row justify-center items-start gap-10">
          
          <div className="w-full lg:w-1/2 xl:w-5/12 flex flex-col gap-8 sticky top-8">
            <section className="flex flex-col justify-center text-left w-full">
              <h2
                className="text-xl font-semibold mb-3 text-metallic-gold"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Build Your Digital AI Twin
              </h2>
              <p className="text-sm text-neutral-700 leading-relaxed mb-3">
                Create your own <strong>AI Twin</strong> — a consistent, brand-aligned version of you that’s ready for every
                platform, campaign, or visual story.
              </p>
              <ul className="text-sm text-neutral-700 space-y-1 mb-4">
                <li>💫 <strong>Upload:</strong> A clear photo of your face.</li>
                <li>🎨 <strong>Prompt:</strong> Describe your vision — editorial, business, or lifestyle.</li>
                <li>⚡ <strong>Generate:</strong> Gemini brings your twin to life.</li>
              </ul>
            </section>
            
            <UploadCard 
                referencePreview={referencePreview}
                onFileChange={handleFileChange}
                disabled={isLoading}
            />
            <SettingsPanel 
                settings={settings} 
                setSettings={setSettings} 
                disabled={isLoading}
            />
            <div className="flex flex-col gap-4">
                <button
                  onClick={handleGenerate}
                  disabled={isLoading || !referenceFile}
                  className="w-full bg-metallic-gold text-white font-bold py-4 px-6 rounded-2xl hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed text-lg"
                >
                  {isLoading ? 'Generating...' : 'Generate AI Twin'}
                </button>
                <button
                  onClick={handleStartOver}
                  disabled={isLoading}
                  className="w-full bg-transparent border-2 border-metallic-gold text-metallic-gold font-bold py-4 px-6 rounded-2xl hover:bg-metallic-gold hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-lg"
                >
                  Start Over
                </button>
            </div>
            {error && <ErrorAlert message={error} />}
          </div>

          <div className="w-full lg:w-1/2 xl:w-7/12">
            {isLoading ? (
              <Spinner message={loadingMessage} />
            ) : generatedImages.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                {generatedImages.map((base64, index) => {
                  const imageUrl = `data:image/jpeg;base64,${base64}`;
                  const downloadFileName = `RADD-AI-Twin-${index + 1}.png`;
                  return (
                    <div
                      key={index}
                      className="flex flex-col items-center bg-white rounded-2xl shadow-md overflow-hidden p-3 transition-all duration-300 hover:shadow-lg animate-fade-in"
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
              </div>
            ) : (
              <ImageGallery images={[]} />
            )}
          </div>
        </div>
        
        {history.length > 0 && (
          <section className="mt-16 w-full text-left">
            <h3
              className="text-2xl font-semibold mb-4 text-metallic-gold"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Generation History
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {history.map((item, index) => {
                const imageUrl = `data:image/jpeg;base64,${item}`;
                const downloadFileName = `RADD-AI-Twin-History-${history.length - index}.jpg`;
                return (
                  <div
                    key={index}
                    className="relative group rounded-xl overflow-hidden shadow-sm border border-neutral-200/80 hover:shadow-lg transition-all duration-300 aspect-square"
                  >
                    <img
                      src={imageUrl}
                      alt={`AI Twin History ${history.length - index}`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex justify-center items-center transition-opacity duration-300">
                      <button
                        onClick={() => {
                          const link = document.createElement('a');
                          link.href = imageUrl;
                          link.download = downloadFileName;
                          document.body.appendChild(link);
                          link.click();
                          document.body.removeChild(link);
                        }}
                        className="text-white text-sm bg-metallic-gold px-4 py-2 rounded-full shadow-lg hover:opacity-90 transition-opacity"
                      >
                        Download
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}
      </main>
      <Footer />
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

export default App;

