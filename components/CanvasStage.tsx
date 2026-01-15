import React, { useRef, useEffect, useState, useCallback } from 'react';
import { MAX_CANVAS_WIDTH, MAX_CANVAS_HEIGHT } from '../constants';
import { applyPunch } from '../services/imageProcessing';

interface CanvasStageProps {
  imageSrc: string | null;
  onAttack: (x: number, y: number) => void;
  shakeTrigger: number; // Increment to trigger canvas internal shake
}

export const CanvasStage: React.FC<CanvasStageProps> = ({ imageSrc, onAttack, shakeTrigger }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [originalImageData, setOriginalImageData] = useState<ImageData | null>(null);
  const [currentImageData, setCurrentImageData] = useState<ImageData | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Initialize Canvas when imageSrc changes
  useEffect(() => {
    if (!imageSrc || !canvasRef.current) return;

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = imageSrc;
    img.onload = () => {
      const canvas = canvasRef.current!;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (!ctx) return;

      // Scale down if too big to maintain performance
      let width = img.width;
      let height = img.height;
      
      if (width > MAX_CANVAS_WIDTH || height > MAX_CANVAS_HEIGHT) {
        const ratio = Math.min(MAX_CANVAS_WIDTH / width, MAX_CANVAS_HEIGHT / height);
        width = Math.floor(width * ratio);
        height = Math.floor(height * ratio);
      }

      canvas.width = width;
      canvas.height = height;

      ctx.drawImage(img, 0, 0, width, height);
      const imgData = ctx.getImageData(0, 0, width, height);
      
      setOriginalImageData(imgData);
      setCurrentImageData(imgData);
    };
  }, [imageSrc]);

  // Handle Click / Attack
  const handleCanvasClick = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current || !currentImageData) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    
    // Calculate scale factor (CSS size vs Actual Pixel size)
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    // --- APPLY DEFORMATION ---
    // Intensity > 0 pushes out (bloat), Intensity < 0 pulls in (pinch/dent)
    // Adjusted values for much smaller, localized damage (Accumulative fun!)
    const punchRadius = 15 + Math.random() * 20; // Smaller radius (was 30+25)
    const punchIntensity = 0.15; // Much gentler intensity (was 0.35)
    
    const newImageData = applyPunch(currentImageData, x, y, punchRadius, punchIntensity);
    
    ctx.putImageData(newImageData, 0, 0);
    setCurrentImageData(newImageData); // Update state to keep damage persistent

    // Notify parent for FX
    // We pass screen coordinates back for the HTML overlay
    onAttack(e.clientX - rect.left, e.clientY - rect.top);

  }, [currentImageData, onAttack]);

  return (
    <div 
      ref={containerRef}
      className="relative border-4 border-black bg-white shadow-lg overflow-hidden cursor-crosshair select-none"
      style={{
        maxWidth: '100%',
        maxHeight: '70vh',
        width: 'fit-content',
        margin: '0 auto',
      }}
    >
      <canvas
        ref={canvasRef}
        onClick={handleCanvasClick}
        className="block max-w-full h-auto"
      />
      
      {/* Visual helper for 'No Image' */}
      {!imageSrc && (
        <div className="flex flex-col items-center justify-center w-[300px] h-[300px] bg-gray-100">
           <span className="text-2xl font-bold text-gray-400">NO TARGET</span>
        </div>
      )}
    </div>
  );
};