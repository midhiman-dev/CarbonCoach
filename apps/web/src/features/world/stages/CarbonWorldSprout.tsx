import React from 'react';

export const CarbonWorldSprout: React.FC = () => {
  return (
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
  );
};
