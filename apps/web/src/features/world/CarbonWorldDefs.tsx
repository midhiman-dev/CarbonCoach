import React from 'react';

export const CarbonWorldDefs: React.FC<{
  skyGradient: { stop1: string; stop2: string };
}> = ({ skyGradient }) => {
  return (
    <>
      <defs>
        <linearGradient id="skyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={skyGradient.stop1} />
          <stop offset="100%" stopColor={skyGradient.stop2} />
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
    </>
  );
};
