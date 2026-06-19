import React, { useState } from 'react';

interface FootprintMethodologyProps {
  onNavigateToAssumptions?: () => void;
}

export const FootprintMethodology: React.FC<FootprintMethodologyProps> = ({
  onNavigateToAssumptions,
}) => {
  const [methodologyOpen, setMethodologyOpen] = useState(false);

  return (
    <section
      aria-label="Methodology disclosure"
      style={{
        border: '1px solid var(--border-glass)',
        borderRadius: 'var(--radius-md)',
        overflow: 'hidden',
      }}
    >
      <button
        onClick={() => setMethodologyOpen((prev) => !prev)}
        aria-expanded={methodologyOpen}
        aria-controls="methodology-detail"
        style={{
          width: '100%',
          background: 'var(--bg-card)',
          border: 'none',
          padding: 'var(--spacing-md) var(--spacing-lg)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          cursor: 'pointer',
          color: 'var(--text-secondary)',
          fontSize: 'var(--font-sm)',
          fontWeight: 600,
          textAlign: 'left',
          gap: 'var(--spacing-sm)',
        }}
      >
        <span>How this estimate works</span>
        <span
          aria-hidden="true"
          style={{
            transform: methodologyOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform var(--transition-fast)',
            fontSize: 'var(--font-xs)',
            color: 'var(--text-muted)',
          }}
        >
          ▾
        </span>
      </button>

      <div
        id="methodology-detail"
        role="region"
        aria-label="Estimate methodology details"
        hidden={!methodologyOpen}
        style={{
          padding: 'var(--spacing-md) var(--spacing-lg)',
          background: 'rgba(255,255,255,0.01)',
          borderTop: '1px solid var(--border-glass)',
        }}
      >
        <p
          style={{
            fontSize: 'var(--font-sm)',
            color: 'var(--text-secondary)',
            margin: '0 0 var(--spacing-sm)',
            lineHeight: 1.6,
          }}
        >
          CarbonCoach uses deterministic TypeScript logic and simplified demo assumptions to
          estimate broad lifestyle patterns. Results are approximate and designed for awareness —
          not formal carbon accounting.
        </p>
        {onNavigateToAssumptions ? (
          <button
            onClick={onNavigateToAssumptions}
            style={{
              background: 'none',
              border: 'none',
              padding: 0,
              color: 'var(--color-accent)',
              fontSize: 'var(--font-sm)',
              cursor: 'pointer',
              textDecoration: 'underline',
              textUnderlineOffset: '3px',
            }}
          >
            View estimates and assumptions →
          </button>
        ) : (
          <p
            style={{
              fontSize: 'var(--font-xs)',
              color: 'var(--text-muted)',
              margin: 0,
            }}
          >
            See the Estimates &amp; Assumptions page for full methodology details.
          </p>
        )}
      </div>
    </section>
  );
};
