import React from 'react';

export const CarbonWorldGrove: React.FC = () => {
  return (
    <g>
      {/* Small Left Tree */}
      <g className="tree-anim" style={{ animationDelay: '-1s' }}>
        <path d="M 125,215 L 125,145" stroke="#78350f" strokeWidth="6.5" strokeLinecap="round" />
        <circle cx="125" cy="132" r="25" fill="url(#matureLeafGrad)" />
        <circle cx="110" cy="130" r="18" fill="#14532d" />
        <circle cx="140" cy="130" r="18" fill="#14532d" />
        <circle cx="125" cy="115" r="20" fill="#22c55e" />
      </g>

      {/* Small Right Tree */}
      <g className="tree-anim" style={{ animationDelay: '-2s' }}>
        <path d="M 285,218 L 285,160" stroke="#78350f" strokeWidth="5.5" strokeLinecap="round" />
        <circle cx="285" cy="150" r="22" fill="url(#matureLeafGrad)" />
        <circle cx="272" cy="148" r="16" fill="#14532d" />
        <circle cx="298" cy="148" r="16" fill="#14532d" />
      </g>

      {/* Main Center Mature Tree */}
      <g className="tree-anim">
        <path d="M 200,210 L 200,105" stroke="#78350f" strokeWidth="10" strokeLinecap="round" />
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
  );
};
