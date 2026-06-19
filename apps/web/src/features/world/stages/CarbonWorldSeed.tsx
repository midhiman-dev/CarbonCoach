import React from 'react';

export const CarbonWorldSeed: React.FC = () => {
  return (
    <g>
      {/* Soil mound */}
      <path d="M 175,212 Q 200,197 225,212 Z" fill="#78350f" />
      {/* Tiny seed */}
      <ellipse cx="200" cy="206" rx="6" ry="3.5" fill="#d97706" transform="rotate(-20 200 206)" />
      <ellipse cx="200" cy="206" rx="2.5" ry="1.5" fill="#fef08a" transform="rotate(-20 200 206)" />
    </g>
  );
};
