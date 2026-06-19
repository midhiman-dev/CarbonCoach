import React from 'react';

export const CarbonWorldGarden: React.FC = () => {
  return (
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
  );
};
