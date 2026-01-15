import React from 'react';
import { EffectItem } from '../constants';

interface EffectLayerProps {
  effects: EffectItem[];
  showSpeedLines: boolean;
}

export const EffectLayer: React.FC<EffectLayerProps> = ({ effects, showSpeedLines }) => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
      {/* Speed Lines Overlay */}
      {showSpeedLines && (
        <div className="absolute inset-0 animate-speed-lines opacity-50">
           <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <radialGradient id="speedGrad" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                <stop offset="0%" stopColor="transparent" />
                <stop offset="60%" stopColor="transparent" />
                <stop offset="100%" stopColor="black" />
              </radialGradient>
            </defs>
            <rect width="100%" height="100%" fill="url(#speedGrad)" style={{ mixBlendMode: 'overlay' }} />
            {/* Hard coded radial lines simulation */}
            {Array.from({ length: 40 }).map((_, i) => (
              <line 
                key={i}
                x1="50%" 
                y1="50%" 
                x2={`${50 + 100 * Math.cos(i * 0.15)}%`} 
                y2={`${50 + 100 * Math.sin(i * 0.15)}%`} 
                stroke="black" 
                strokeWidth={Math.random() * 4} 
                strokeDasharray={`${Math.random() * 100} ${Math.random() * 200}`}
                opacity="0.6"
              />
            ))}
           </svg>
        </div>
      )}

      {/* Text Effects */}
      {effects.map((effect) => (
        <div
          key={effect.id}
          className="absolute manga-pop"
          style={{
            left: effect.x,
            top: effect.y,
            transform: `translate(-50%, -50%) rotate(${effect.rotation}deg) scale(${effect.scale})`,
            color: effect.color,
            textShadow: '3px 3px 0px #000, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000',
            fontSize: '3rem',
            fontWeight: 900,
            whiteSpace: 'nowrap',
            zIndex: 30
          }}
        >
          {effect.text}
        </div>
      ))}
    </div>
  );
};