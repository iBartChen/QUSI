import React, { useState, useCallback, useRef, useEffect } from 'react';
import { CanvasStage } from './components/CanvasStage';
import { EffectLayer } from './components/EffectLayer';
import { MangaButton } from './components/MangaButton';
import { SFX_TEXTS, COLORS, EffectItem } from './constants';

const App: React.FC = () => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [effects, setEffects] = useState<EffectItem[]>([]);
  const [shakeIntensity, setShakeIntensity] = useState(0);
  const [showSpeedLines, setShowSpeedLines] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Clear effects that have finished animating
  useEffect(() => {
    if (effects.length > 0) {
      const timer = setTimeout(() => {
        setEffects(prev => prev.slice(1));
      }, 1000); // Remove oldest effect after 1s
      return () => clearTimeout(timer);
    }
  }, [effects]);

  // Handle Screen Shake decay
  useEffect(() => {
    if (shakeIntensity > 0) {
      const timer = requestAnimationFrame(() => {
        setShakeIntensity(prev => Math.max(0, prev - 1));
      });
      return () => cancelAnimationFrame(timer);
    } else {
      setShowSpeedLines(false);
    }
  }, [shakeIntensity]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImageSrc(e.target?.result as string);
        setEffects([]); // Clear old effects
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAttack = useCallback((x: number, y: number) => {
    // 1. Add Screen Shake
    setShakeIntensity(20); // Reset shake to high
    setShowSpeedLines(true);

    // 2. Add Visual FX Text
    const sfx = SFX_TEXTS[Math.floor(Math.random() * SFX_TEXTS.length)];
    const color = COLORS[Math.floor(Math.random() * COLORS.length)];
    const rotation = (Math.random() - 0.5) * 60; // Random rotation -30 to 30
    const scale = 0.8 + Math.random() * 1.2;

    const newEffect: EffectItem = {
      id: Date.now(),
      x,
      y,
      text: sfx,
      color,
      rotation,
      scale
    };

    setEffects(prev => [...prev, newEffect]);
  }, []);

  const handleDownload = () => {
    const canvas = document.querySelector('canvas');
    if (canvas) {
      const link = document.createElement('a');
      link.download = 'qusi-result.png';
      link.href = canvas.toDataURL();
      link.click();
    }
  };

  // Calculate dynamic transform for the shake effect
  const shakeTransform = shakeIntensity > 0 
    ? `translate(${Math.random() * shakeIntensity - shakeIntensity/2}px, ${Math.random() * shakeIntensity - shakeIntensity/2}px) rotate(${Math.random() * 2 - 1}deg)`
    : 'none';

  return (
    <div className="min-h-screen w-full relative overflow-x-hidden flex flex-col font-sans">
      
      {/* Background Pattern Layer (Separated to avoid opacity inheritance issues) */}
      <div className="absolute inset-0 bg-manga-dots pointer-events-none z-0" />

      {/* Header - "Breaking the Grid" */}
      <header className="relative z-40 pt-10 text-center pointer-events-none select-none">
        <h1 className="text-[12rem] leading-[0.7] font-black tracking-tighter text-black transform -rotate-3 mix-blend-multiply drop-shadow-[5px_5px_0px_#fff]">
          QUSI
        </h1>
      </header>

      {/* Main Stage - Negative margin to allow title overlap */}
      <main className="flex-1 flex flex-col items-center justify-start p-4 pt-0 relative z-10 -mt-10">
        
        {/* Shaking Container */}
        <div 
          className="relative max-w-full z-10 mt-12"
          style={{ transform: shakeTransform, transition: 'transform 0.05s linear' }}
        >
          {imageSrc ? (
            <div className="relative border-4 border-black shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] bg-white">
              <CanvasStage 
                imageSrc={imageSrc} 
                onAttack={handleAttack}
                shakeTrigger={shakeIntensity} 
              />
              <EffectLayer effects={effects} showSpeedLines={showSpeedLines} />
            </div>
          ) : (
            <div className="bg-white border-4 border-black p-10 shadow-[12px_12px_0px_0px_#000] text-center max-w-md transform rotate-1">
              <div className="text-8xl mb-4 animate-bounce">📸</div>
              <h2 className="text-4xl font-black mb-4 uppercase italic">Upload Victim</h2>
              <p className="text-xl mb-8 font-bold text-gray-800">
                Choose a face to destroy.
              </p>
              <MangaButton 
                label="Select Photo" 
                onClick={() => fileInputRef.current?.click()} 
                className="text-2xl py-4 px-8"
              />
            </div>
          )}
        </div>

      </main>

      {/* Controls */}
      <footer className="p-6 pb-12 flex justify-center gap-4 z-50 relative pointer-events-auto">
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          accept="image/*" 
          className="hidden" 
        />
        
        {imageSrc && (
          <div className="flex flex-wrap justify-center gap-4 bg-white/90 p-4 border-4 border-black shadow-lg rounded-sm transform -rotate-1">
             <MangaButton 
              label="New Victim" 
              variant="secondary"
              onClick={() => fileInputRef.current?.click()} 
            />
             <MangaButton 
              label="Save Image" 
              variant="primary"
              onClick={handleDownload} 
            />
            <MangaButton 
              label="Reset" 
              variant="danger"
              onClick={() => setImageSrc(prev => prev ? prev + '?' + Date.now() : null)} 
            />
          </div>
        )}
      </footer>
    </div>
  );
};

export default App;