import React from 'react';
import type { CarbonWorldStage } from '@carboncoach/shared';

interface CarbonWorldSceneProps {
  stage: CarbonWorldStage;
  progressPercent: number;
}

export const CarbonWorldScene: React.FC<CarbonWorldSceneProps> = ({ stage, progressPercent }) => {
  // Determine accessible text description based on stage and progress
  const getAccessibilityLabel = () => {
    switch (stage) {
      case 'seed':
        return `Carbon World: Seed stage. Your action garden is quiet and ready to grow. Progress is 0 percent.`;
      case 'sprout':
        return `Carbon World: Sprout stage. A tiny sprout has broken through the soil. Progress is ${progressPercent} percent.`;
      case 'garden':
        return `Carbon World: Garden stage. Plants are growing and the sky is bright. Progress is ${progressPercent} percent.`;
      case 'grove':
        return `Carbon World: Grove stage. Multiple trees are flourishing under a clear sky. Progress is ${progressPercent} percent.`;
      default:
        return 'Carbon World Scene';
    }
  };

  // Stage-based SVG sky gradients and details
  const getSkyGradient = () => {
    switch (stage) {
      case 'seed':
        return {
          stop1: '#1e293b', // Slate-800
          stop2: '#0f172a', // Slate-900
        };
      case 'sprout':
        return {
          stop1: '#334155', // Slate-700
          stop2: '#1e293b', // Slate-800
        };
      case 'garden':
        return {
          stop1: '#0284c7', // Sky-600
          stop2: '#0f172a', // Slate-900
        };
      case 'grove':
        return {
          stop1: '#0d9488', // Teal-600
          stop2: '#0f172a', // Slate-900
        };
      default:
        return {
          stop1: '#1e293b',
          stop2: '#0f172a',
        };
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
        margin: '0 auto var(--spacing-lg) auto',
        borderRadius: 'var(--border-radius-lg)',
        overflow: 'hidden',
        border: '1px solid var(--color-border)',
        boxShadow: 'var(--shadow-sm)',
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
        <defs>
          <linearGradient id="skyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={gradient.stop1} />
            <stop offset="100%" stopColor={gradient.stop2} />
          </linearGradient>
          <linearGradient id="soilGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#451a03" />
            <stop offset="100%" stopColor="#1c0c02" />
          </linearGradient>
        </defs>

        {/* Sky Background */}
        <rect width="400" height="300" fill="url(#skyGrad)" />

        {/* Dynamic Sun/Moon or Star/Glow depending on progress/stage */}
        {stage === 'seed' && (
          <circle
            cx="200"
            cy="90"
            r="4"
            fill="#fbbf24"
            opacity="0.6"
            style={{ filter: 'blur(1px)' }}
          />
        )}
        {stage === 'sprout' && <circle cx="300" cy="80" r="15" fill="#fef08a" opacity="0.15" />}
        {stage === 'garden' && (
          <>
            <circle cx="300" cy="80" r="25" fill="#fef08a" opacity="0.2" />
            <circle cx="300" cy="80" r="15" fill="#fef08a" opacity="0.4" />
          </>
        )}
        {stage === 'grove' && (
          <>
            <circle cx="300" cy="80" r="35" fill="#38bdf8" opacity="0.1" />
            <circle cx="300" cy="80" r="20" fill="#fef08a" opacity="0.5" />
          </>
        )}

        {/* Soil/Ground (static base) */}
        <path d="M 0,220 Q 200,190 400,220 L 400,300 L 0,300 Z" fill="url(#soilGrad)" />
        <path
          d="M 0,225 Q 200,205 400,225"
          stroke="#78350f"
          strokeWidth="2"
          fill="none"
          opacity="0.5"
        />

        {/* SEED STAGE: A small soil mound and seed icon */}
        {stage === 'seed' && (
          <g>
            {/* Tiny soil mound */}
            <path d="M 180,210 Q 200,195 220,210 Z" fill="#78350f" />
            {/* Small glowing seed */}
            <ellipse
              cx="200"
              cy="204"
              rx="5"
              ry="3"
              fill="#ca8a04"
              transform="rotate(-15 200 204)"
            />
            <ellipse
              cx="200"
              cy="204"
              rx="2"
              ry="1"
              fill="#fef08a"
              transform="rotate(-15 200 204)"
            />
          </g>
        )}

        {/* SPROUT STAGE: Small stem and leaves */}
        {stage === 'sprout' && (
          <g>
            {/* Small soil mound */}
            <path d="M 175,208 Q 200,192 225,208 Z" fill="#78350f" />
            {/* Main stem */}
            <path
              d="M 200,205 Q 195,175 200,160"
              stroke="#4ade80"
              strokeWidth="4"
              strokeLinecap="round"
              fill="none"
            />
            {/* Left Leaf */}
            <path d="M 197,175 Q 180,165 190,162 Q 197,167 197,175 Z" fill="#22c55e" />
            {/* Right Leaf */}
            <path d="M 200,168 Q 215,155 210,152 Q 202,158 200,168 Z" fill="#22c55e" />
          </g>
        )}

        {/* GARDEN STAGE: Multiple plants, flowers growing */}
        {stage === 'garden' && (
          <g>
            {/* Left Plant */}
            <path
              d="M 150,210 Q 140,160 145,145"
              stroke="#4ade80"
              strokeWidth="4"
              strokeLinecap="round"
              fill="none"
            />
            <path d="M 143,170 Q 125,160 135,155 Q 142,162 143,170 Z" fill="#22c55e" />
            <path d="M 144,155 Q 160,145 155,142 Q 147,148 144,155 Z" fill="#22c55e" />

            {/* Center Flower */}
            <path d="M 200,205 L 200,135" stroke="#22c55e" strokeWidth="4" strokeLinecap="round" />
            <path d="M 200,170 Q 185,165 192,160 Q 199,165 200,170 Z" fill="#15803d" />
            <path d="M 200,155 Q 215,150 208,145 Q 201,150 200,155 Z" fill="#15803d" />
            {/* Flower Petals */}
            <circle cx="200" cy="130" r="10" fill="#f43f5e" />
            <circle cx="190" cy="130" r="7" fill="#f43f5e" />
            <circle cx="210" cy="130" r="7" fill="#f43f5e" />
            <circle cx="200" cy="120" r="7" fill="#f43f5e" />
            <circle cx="200" cy="140" r="7" fill="#f43f5e" />
            <circle cx="200" cy="130" r="5" fill="#facc15" />

            {/* Right Grass/Sprout */}
            <path
              d="M 250,212 Q 260,180 265,170"
              stroke="#4ade80"
              strokeWidth="3"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M 252,212 Q 242,185 240,178"
              stroke="#4ade80"
              strokeWidth="2.5"
              strokeLinecap="round"
              fill="none"
            />
          </g>
        )}

        {/* GROVE STAGE: Lush trees and plants */}
        {stage === 'grove' && (
          <g>
            {/* Ground Greens */}
            <path d="M 120,215 Q 200,195 280,215 Z" fill="#15803d" opacity="0.3" />

            {/* Small Left Tree */}
            <path d="M 130,215 L 130,150" stroke="#78350f" strokeWidth="6" strokeLinecap="round" />
            {/* Foliage */}
            <circle cx="130" cy="140" r="25" fill="#16a34a" />
            <circle cx="115" cy="135" r="18" fill="#15803d" />
            <circle cx="145" cy="135" r="18" fill="#15803d" />
            <circle cx="130" cy="120" r="20" fill="#22c55e" />

            {/* Main Center Tree */}
            <path d="M 200,210 L 200,110" stroke="#78350f" strokeWidth="10" strokeLinecap="round" />
            <path
              d="M 200,160 Q 180,140 170,135"
              stroke="#78350f"
              strokeWidth="6"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M 200,140 Q 220,125 235,120"
              stroke="#78350f"
              strokeWidth="5"
              strokeLinecap="round"
              fill="none"
            />
            {/* Foliage */}
            <circle cx="200" cy="100" r="40" fill="#16a34a" />
            <circle cx="170" cy="115" r="30" fill="#15803d" />
            <circle cx="230" cy="115" r="30" fill="#15803d" />
            <circle cx="200" cy="75" r="35" fill="#22c55e" />
            <circle cx="185" cy="90" r="25" fill="#4ade80" opacity="0.8" />

            {/* Right Bush */}
            <path d="M 270,212 L 270,180" stroke="#78350f" strokeWidth="4" />
            <circle cx="270" cy="175" r="18" fill="#16a34a" />
            <circle cx="258" cy="175" r="12" fill="#15803d" />
            <circle cx="282" cy="175" r="12" fill="#15803d" />
          </g>
        )}
      </svg>
    </div>
  );
};
