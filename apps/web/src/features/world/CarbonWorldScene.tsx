import React from 'react';
import type { CarbonWorldStage } from '@carboncoach/shared';
import { CarbonWorldDefs } from './CarbonWorldDefs';
import { CarbonWorldSeed } from './stages/CarbonWorldSeed';
import { CarbonWorldSprout } from './stages/CarbonWorldSprout';
import { CarbonWorldGarden } from './stages/CarbonWorldGarden';
import { CarbonWorldGrove } from './stages/CarbonWorldGrove';

interface CarbonWorldSceneProps {
  stage: CarbonWorldStage;
  progressPercent: number;
}

export const CarbonWorldScene: React.FC<CarbonWorldSceneProps> = ({ stage, progressPercent }) => {
  // Determine accessible text description based on stage and progress
  const getAccessibilityLabel = () => {
    switch (stage) {
      case 'seed':
        return `Carbon World stage: Seed / Hazy Patch. The landscape is sparse and covered in haze under a dark sky, representing the starting point of your weekly progress.`;
      case 'sprout':
        return `Carbon World stage: Sprouting Patch. A small green sprout is growing from the soil under a soft sky with light haze. Progress is ${progressPercent} percent.`;
      case 'garden':
        return `Carbon World stage: Growing Grove. Young trees and growing greenery are thriving under a clear blue sky, showing steady weekly progress. Progress is ${progressPercent} percent.`;
      case 'grove':
        return `Carbon World stage: Thriving Grove. A mature central tree with blossoms, flying birds, and warm sunlight rays represent complete weekly progress. Progress is 100 percent.`;
      default:
        return 'Carbon World Scene';
    }
  };

  // Stage-based SVG sky gradients and details
  const getSkyGradient = () => {
    switch (stage) {
      case 'seed':
        return { stop1: '#1e293b', stop2: '#0f172a' };
      case 'sprout':
        return { stop1: '#334155', stop2: '#1e293b' };
      case 'garden':
        return { stop1: '#38bdf8', stop2: '#0284c7' };
      case 'grove':
        return { stop1: '#fef08a', stop2: '#0284c7' };
      default:
        return { stop1: '#1e293b', stop2: '#0f172a' };
    }
  };

  const gradient = getSkyGradient();

  return (
    <div
      role="img"
      aria-label={getAccessibilityLabel()}
      style={{
        width: '100%',
        maxWidth: '500px',
        margin: '0 auto',
        borderRadius: 'var(--radius-md)',
        overflow: 'hidden',
        border: '1px solid var(--border-glass)',
        boxShadow: 'var(--shadow-md)',
        backgroundColor: '#0f172a',
      }}
    >
      <svg
        viewBox="0 0 400 300"
        style={{
          display: 'block',
          width: '100%',
          height: 'auto',
        }}
      >
        <CarbonWorldDefs skyGradient={gradient} />

        {/* Sky Background */}
        <rect width="400" height="300" fill="url(#skyGrad)" />

        {/* Clouds / Atmospheric Layer */}
        {stage !== 'seed' && (
          <g className="cloud-anim" opacity="0.3">
            <path d="M 50,80 Q 70,60 90,80 Q 110,60 130,80 L 130,100 L 50,100 Z" fill="#ffffff" />
            <path d="M 270,60 Q 290,40 310,60 Q 330,40 350,60 L 350,85 L 270,85 Z" fill="#ffffff" />
          </g>
        )}

        {/* Haze overlays */}
        {stage === 'seed' && <rect width="400" height="300" fill="#475569" opacity="0.5" />}
        {stage === 'sprout' && <rect width="400" height="300" fill="#64748b" opacity="0.25" />}

        {/* Dynamic Sun/Moon/Glow */}
        {stage === 'sprout' && (
          <circle cx="300" cy="80" r="14" fill="#fef08a" opacity="0.25" className="sun-anim" />
        )}
        {stage === 'garden' && (
          <g className="sun-anim">
            <circle cx="300" cy="80" r="30" fill="#fef08a" opacity="0.15" />
            <circle cx="300" cy="80" r="18" fill="#fef08a" opacity="0.4" />
          </g>
        )}
        {stage === 'grove' && (
          <g className="sun-anim">
            {/* Sun Rays */}
            <line x1="300" y1="80" x2="210" y2="170" stroke="#fef08a" strokeWidth="2.5" opacity="0.3" strokeDasharray="6,6" />
            <line x1="300" y1="80" x2="140" y2="130" stroke="#fef08a" strokeWidth="2" opacity="0.2" strokeDasharray="6,6" />
            <line x1="300" y1="80" x2="280" y2="210" stroke="#fef08a" strokeWidth="2.5" opacity="0.25" strokeDasharray="6,6" />
            <circle cx="300" cy="80" r="50" fill="#fef08a" opacity="0.15" />
            <circle cx="300" cy="80" r="30" fill="#fef08a" opacity="0.5" />
          </g>
        )}

        {/* Birds Layer (Stage 3 Thriving Grove only) */}
        {stage === 'grove' && (
          <g opacity="0.7">
            <path d="M 60,55 Q 70,45 80,55 Q 90,45 100,55" stroke="#0369a1" strokeWidth="2" fill="none" />
            <path d="M 230,40 Q 238,32 246,40 Q 254,32 262,40" stroke="#0369a1" strokeWidth="1.5" fill="none" />
            <path d="M 95,75 Q 101,69 107,75 Q 113,69 119,75" stroke="#0369a1" strokeWidth="1.5" fill="none" />
          </g>
        )}

        {/* Ground Hill layers */}
        <path d="M -20,230 Q 180,190 420,230 L 420,300 L -20,300 Z" fill="url(#soilGrad)" />

        {/* Ground Grass layers (representing vegetative depth) */}
        {stage !== 'seed' && (
          <>
            <path d="M -10,225 Q 190,195 410,225 L 410,300 L -10,300 Z" fill="#14532d" opacity="0.4" />
            <path d="M -5,220 Q 200,200 405,220 L 405,300 L -5,300 Z" fill="#166534" opacity="0.7" />
          </>
        )}

        {/* Ground details */}
        <path d="M -10,225 Q 200,205 410,225" stroke="#78350f" strokeWidth="2.5" fill="none" opacity="0.4" />

        {stage === 'seed' && <CarbonWorldSeed />}
        {stage === 'sprout' && <CarbonWorldSprout />}
        {stage === 'garden' && <CarbonWorldGarden />}
        {stage === 'grove' && <CarbonWorldGrove />}
      </svg>
    </div>
  );
};
