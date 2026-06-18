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
        return {
          stop1: '#1e293b', // Muted dark slate
          stop2: '#0f172a', // Deep dark navy
        };
      case 'sprout':
        return {
          stop1: '#334155', // Slate-gray
          stop2: '#1e293b', // Dark slate
        };
      case 'garden':
        return {
          stop1: '#38bdf8', // Bright sky blue
          stop2: '#0284c7', // Sky blue
        };
      case 'grove':
        return {
          stop1: '#fef08a', // Gold horizon glow
          stop2: '#0284c7', // Crisp sunny sky blue
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
        <defs>
          <linearGradient id="skyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={gradient.stop1} />
            <stop offset="100%" stopColor={gradient.stop2} />
          </linearGradient>
          <linearGradient id="soilGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#451a03" />
            <stop offset="100%" stopColor="#1a0a02" />
          </linearGradient>
          <linearGradient id="leafGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#4ade80" />
            <stop offset="100%" stopColor="#15803d" />
          </linearGradient>
          <linearGradient id="matureLeafGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#22c55e" />
            <stop offset="100%" stopColor="#166534" />
          </linearGradient>
          <linearGradient id="sunGlow" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#fef08a" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#facc15" stopOpacity="0.0" />
          </linearGradient>
        </defs>

        <style>{`
          @keyframes drift {
            0% { transform: translateX(0px); }
            50% { transform: translateX(8px); }
            100% { transform: translateX(0px); }
          }
          @keyframes sway {
            0% { transform: rotate(0deg); }
            50% { transform: rotate(1deg); }
            100% { transform: rotate(0deg); }
          }
          @keyframes float {
            0% { transform: translateY(0px) scale(1); opacity: 0.5; }
            50% { transform: translateY(-4px) scale(1.1); opacity: 0.8; }
            100% { transform: translateY(0px) scale(1); opacity: 0.5; }
          }
          @keyframes pulse {
            0% { transform: scale(1); opacity: 0.8; }
            50% { transform: scale(1.02); opacity: 1; }
            100% { transform: scale(1); opacity: 0.8; }
          }
          .cloud-anim {
            animation: drift 25s ease-in-out infinite;
          }
          .tree-anim {
            animation: sway 6s ease-in-out infinite;
            transform-origin: bottom center;
          }
          .sun-anim {
            animation: pulse 12s ease-in-out infinite;
            transform-origin: center;
          }
          .firefly-anim {
            animation: float 4s ease-in-out infinite;
          }
          @media (prefers-reduced-motion: reduce) {
            .cloud-anim, .tree-anim, .sun-anim, .firefly-anim {
              animation: none !important;
            }
          }
        `}</style>

        {/* Sky Background */}
        <rect width="400" height="300" fill="url(#skyGrad)" />

        {/* Clouds / Atmospheric Layer */}
        {stage !== 'seed' && (
          <g className="cloud-anim" opacity="0.3">
            <path d="M 50,80 Q 70,60 90,80 Q 110,60 130,80 L 130,100 L 50,100 Z" fill="#ffffff" />
            <path d="M 270,60 Q 290,40 310,60 Q 330,40 350,60 L 350,85 L 270,85 Z" fill="#ffffff" />
          </g>
        )}

        {/* Haze overlay for Seed */}
        {stage === 'seed' && <rect width="400" height="300" fill="#475569" opacity="0.5" />}
        {/* Lighter haze overlay for Sprouting Patch */}
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
            <line
              x1="300"
              y1="80"
              x2="210"
              y2="170"
              stroke="#fef08a"
              strokeWidth="2.5"
              opacity="0.3"
              strokeDasharray="6,6"
            />
            <line
              x1="300"
              y1="80"
              x2="140"
              y2="130"
              stroke="#fef08a"
              strokeWidth="2"
              opacity="0.2"
              strokeDasharray="6,6"
            />
            <line
              x1="300"
              y1="80"
              x2="280"
              y2="210"
              stroke="#fef08a"
              strokeWidth="2.5"
              opacity="0.25"
              strokeDasharray="6,6"
            />
            <circle cx="300" cy="80" r="50" fill="#fef08a" opacity="0.15" />
            <circle cx="300" cy="80" r="30" fill="#fef08a" opacity="0.5" />
          </g>
        )}

        {/* Birds Layer (Stage 3 Thriving Grove only) */}
        {stage === 'grove' && (
          <g opacity="0.7">
            <path
              d="M 60,55 Q 70,45 80,55 Q 90,45 100,55"
              stroke="#0369a1"
              strokeWidth="2"
              fill="none"
            />
            <path
              d="M 230,40 Q 238,32 246,40 Q 254,32 262,40"
              stroke="#0369a1"
              strokeWidth="1.5"
              fill="none"
            />
            <path
              d="M 95,75 Q 101,69 107,75 Q 113,69 119,75"
              stroke="#0369a1"
              strokeWidth="1.5"
              fill="none"
            />
          </g>
        )}

        {/* Ground Hill layers */}
        <path d="M -20,230 Q 180,190 420,230 L 420,300 L -20,300 Z" fill="url(#soilGrad)" />

        {/* Ground Grass layers (representing vegetative depth) */}
        {stage !== 'seed' && (
          <>
            {/* Background grass mound */}
            <path
              d="M -10,225 Q 190,195 410,225 L 410,300 L -10,300 Z"
              fill="#14532d"
              opacity="0.4"
            />
            {/* Midground grass mound */}
            <path
              d="M -5,220 Q 200,200 405,220 L 405,300 L -5,300 Z"
              fill="#166534"
              opacity="0.7"
            />
          </>
        )}

        {/* Ground details */}
        <path
          d="M -10,225 Q 200,205 410,225"
          stroke="#78350f"
          strokeWidth="2.5"
          fill="none"
          opacity="0.4"
        />

        {/* SEED STAGE: Sparse earth & glowing seedling */}
        {stage === 'seed' && (
          <g>
            {/* Soil mound */}
            <path d="M 175,212 Q 200,197 225,212 Z" fill="#78350f" />
            {/* Tiny seed */}
            <ellipse
              cx="200"
              cy="206"
              rx="6"
              ry="3.5"
              fill="#d97706"
              transform="rotate(-20 200 206)"
            />
            <ellipse
              cx="200"
              cy="206"
              rx="2.5"
              ry="1.5"
              fill="#fef08a"
              transform="rotate(-20 200 206)"
            />
          </g>
        )}

        {/* SPROUT STAGE: Early green sprouts */}
        {stage === 'sprout' && (
          <g className="tree-anim">
            {/* Soil mound */}
            <path d="M 170,210 Q 200,192 230,210 Z" fill="#78350f" />
            {/* Sprout Stem */}
            <path
              d="M 200,208 Q 195,175 200,158"
              stroke="#4ade80"
              strokeWidth="4.5"
              strokeLinecap="round"
              fill="none"
            />
            {/* Early leaves */}
            <path d="M 197,175 Q 178,162 188,158 Q 196,165 197,175 Z" fill="#22c55e" />
            <path d="M 200,167 Q 218,152 212,148 Q 203,155 200,167 Z" fill="#22c55e" />
            {/* Secondary sprout */}
            <path
              d="M 215,208 Q 225,188 220,180"
              stroke="#4ade80"
              strokeWidth="3"
              strokeLinecap="round"
              fill="none"
            />
          </g>
        )}

        {/* GARDEN STAGE: Growing Grove (Growing but incomplete) */}
        {stage === 'garden' && (
          <g className="tree-anim">
            {/* Left growing shrub */}
            <path
              d="M 140,215 Q 130,170 135,155"
              stroke="#78350f"
              strokeWidth="4"
              strokeLinecap="round"
              fill="none"
            />
            <circle cx="135" cy="148" r="16" fill="url(#leafGrad)" />
            <circle cx="123" cy="148" r="12" fill="#15803d" />
            <circle cx="147" cy="148" r="12" fill="#166534" />

            {/* Right growing shrub */}
            <path
              d="M 260,218 Q 270,180 265,165"
              stroke="#78350f"
              strokeWidth="3.5"
              strokeLinecap="round"
              fill="none"
            />
            <circle cx="265" cy="158" r="14" fill="url(#leafGrad)" />
            <circle cx="275" cy="158" r="10" fill="#15803d" />

            {/* Center growing tree */}
            <path
              d="M 200,210 L 200,135"
              stroke="#78350f"
              strokeWidth="6.5"
              strokeLinecap="round"
            />
            {/* Foliage blocks */}
            <circle cx="200" cy="125" r="28" fill="url(#leafGrad)" />
            <circle cx="182" cy="128" r="20" fill="#15803d" />
            <circle cx="218" cy="128" r="20" fill="#15803d" />
            <circle cx="200" cy="108" r="20" fill="#22c55e" />

            {/* Foreground small pink flowers */}
            <g transform="translate(0, 0)">
              <circle cx="165" cy="215" r="5" fill="#ec4899" />
              <circle cx="161" cy="215" r="3.5" fill="#f43f5e" />
              <circle cx="169" cy="215" r="3.5" fill="#f43f5e" />
              <circle cx="165" cy="211" r="3.5" fill="#f43f5e" />
              <circle cx="165" cy="219" r="3.5" fill="#f43f5e" />
              <circle cx="165" cy="215" r="2" fill="#facc15" />
            </g>
            <g transform="translate(60, 4)">
              <circle cx="165" cy="215" r="5" fill="#ec4899" />
              <circle cx="161" cy="215" r="3.5" fill="#f43f5e" />
              <circle cx="169" cy="215" r="3.5" fill="#f43f5e" />
              <circle cx="165" cy="211" r="3.5" fill="#f43f5e" />
              <circle cx="165" cy="219" r="3.5" fill="#f43f5e" />
              <circle cx="165" cy="215" r="2" fill="#facc15" />
            </g>
          </g>
        )}

        {/* GROVE STAGE: Thriving Grove (Lush completion reward) */}
        {stage === 'grove' && (
          <g>
            {/* Small Left Tree */}
            <g className="tree-anim" style={{ animationDelay: '-1s' }}>
              <path
                d="M 125,215 L 125,145"
                stroke="#78350f"
                strokeWidth="6.5"
                strokeLinecap="round"
              />
              <circle cx="125" cy="132" r="25" fill="url(#matureLeafGrad)" />
              <circle cx="110" cy="130" r="18" fill="#14532d" />
              <circle cx="140" cy="130" r="18" fill="#14532d" />
              <circle cx="125" cy="115" r="20" fill="#22c55e" />
            </g>

            {/* Small Right Tree */}
            <g className="tree-anim" style={{ animationDelay: '-2s' }}>
              <path
                d="M 285,218 L 285,160"
                stroke="#78350f"
                strokeWidth="5.5"
                strokeLinecap="round"
              />
              <circle cx="285" cy="150" r="22" fill="url(#matureLeafGrad)" />
              <circle cx="272" cy="148" r="16" fill="#14532d" />
              <circle cx="298" cy="148" r="16" fill="#14532d" />
            </g>

            {/* Main Center Mature Tree */}
            <g className="tree-anim">
              <path
                d="M 200,210 L 200,105"
                stroke="#78350f"
                strokeWidth="10"
                strokeLinecap="round"
              />
              <path
                d="M 200,155 Q 175,135 165,128"
                stroke="#78350f"
                strokeWidth="6.5"
                strokeLinecap="round"
                fill="none"
              />
              <path
                d="M 200,135 Q 225,118 240,112"
                stroke="#78350f"
                strokeWidth="5.5"
                strokeLinecap="round"
                fill="none"
              />
              {/* Layered Lush Foliage (Canopy Depth) */}
              <circle cx="200" cy="95" r="42" fill="url(#matureLeafGrad)" />
              <circle cx="165" cy="112" r="32" fill="#14532d" />
              <circle cx="235" cy="112" r="32" fill="#14532d" />
              <circle cx="200" cy="65" r="36" fill="#22c55e" />
              <circle cx="185" cy="85" r="26" fill="#4ade80" opacity="0.85" />
              <circle cx="218" cy="85" r="26" fill="#4ade80" opacity="0.85" />

              {/* Red fruit/blossoms */}
              <circle cx="178" cy="90" r="3.5" fill="#f43f5e" />
              <circle cx="222" cy="82" r="3.5" fill="#f43f5e" />
              <circle cx="198" cy="62" r="3.5" fill="#f43f5e" />
              <circle cx="225" cy="110" r="3.5" fill="#f43f5e" />
              <circle cx="182" cy="112" r="3.5" fill="#f43f5e" />
              <circle cx="158" cy="105" r="3.5" fill="#f43f5e" />
            </g>

            {/* Glowing Firefly Accents */}
            <g opacity="0.9">
              <circle
                cx="160"
                cy="140"
                r="3.5"
                fill="#fbbf24"
                className="firefly-anim"
                style={{ animationDelay: '0s' }}
              />
              <circle
                cx="230"
                cy="150"
                r="2.5"
                fill="#fbbf24"
                className="firefly-anim"
                style={{ animationDelay: '1.2s' }}
              />
              <circle
                cx="190"
                cy="110"
                r="3"
                fill="#fbbf24"
                className="firefly-anim"
                style={{ animationDelay: '2.5s' }}
              />
              <circle
                cx="260"
                cy="125"
                r="3.5"
                fill="#fbbf24"
                className="firefly-anim"
                style={{ animationDelay: '0.8s' }}
              />
            </g>

            {/* Rich Foreground Flower Beds */}
            <g transform="translate(10, 4)">
              <circle cx="145" cy="216" r="6" fill="#ec4899" />
              <circle cx="140" cy="216" r="4" fill="#ec4899" />
              <circle cx="150" cy="216" r="4" fill="#ec4899" />
              <circle cx="145" cy="211" r="4" fill="#ec4899" />
              <circle cx="145" cy="221" r="4" fill="#ec4899" />
              <circle cx="145" cy="216" r="2" fill="#fbbf24" />
            </g>
            <g transform="translate(95, 8)">
              <circle cx="145" cy="216" r="6" fill="#ec4899" />
              <circle cx="140" cy="216" r="4" fill="#ec4899" />
              <circle cx="150" cy="216" r="4" fill="#ec4899" />
              <circle cx="145" cy="211" r="4" fill="#ec4899" />
              <circle cx="145" cy="221" r="4" fill="#ec4899" />
              <circle cx="145" cy="216" r="2" fill="#fbbf24" />
            </g>
            <g transform="translate(50, 6)">
              <circle cx="180" cy="220" r="6" fill="#a855f7" />
              <circle cx="175" cy="220" r="4" fill="#a855f7" />
              <circle cx="185" cy="220" r="4" fill="#a855f7" />
              <circle cx="180" cy="215" r="4" fill="#a855f7" />
              <circle cx="180" cy="225" r="4" fill="#a855f7" />
              <circle cx="180" cy="220" r="2" fill="#fbbf24" />
            </g>
          </g>
        )}
      </svg>
    </div>
  );
};
