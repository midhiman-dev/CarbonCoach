import React from 'react';
import { StatusBadge } from '../../components/ui';
import { FootprintCategory } from '@carboncoach/shared';
import { formatKgCO2e, formatCategoryLabel } from './footprintViewModel';
import { CATEGORY_ICONS } from './footprintConstants';

interface FootprintHeroProps {
  monthlyTotalKgCO2e: number;
  topCategory?: FootprintCategory | null;
}

export const FootprintHero: React.FC<FootprintHeroProps> = ({
  monthlyTotalKgCO2e,
  topCategory,
}) => {
  return (
    <section
      aria-label="Footprint snapshot"
      style={{
        background: 'linear-gradient(135deg, rgba(0,245,212,0.08) 0%, rgba(14,20,36,0) 60%)',
        border: '1px solid rgba(0,245,212,0.2)',
        borderRadius: 'var(--radius-lg)',
        padding: 'var(--spacing-xl)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* subtle glow ring */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: '-40px',
          right: '-40px',
          width: '180px',
          height: '180px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0,245,212,0.15) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      <p
        style={{
          fontSize: 'var(--font-sm)',
          color: 'var(--text-muted)',
          margin: '0 0 var(--spacing-xs)',
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          fontWeight: 600,
        }}
      >
        Your footprint snapshot
      </p>

      <div
        style={{
          display: 'flex',
          alignItems: 'flex-end',
          gap: 'var(--spacing-sm)',
          flexWrap: 'wrap',
        }}
      >
        <span
          style={{
            fontSize: 'var(--font-4xl)',
            fontWeight: 800,
            color: 'var(--color-accent)',
            lineHeight: 1,
          }}
          aria-live="polite"
          data-testid="footprint-total"
        >
          {formatKgCO2e(monthlyTotalKgCO2e)}
        </span>
        <span
          style={{
            fontSize: 'var(--font-md)',
            color: 'var(--text-secondary)',
            paddingBottom: '4px',
          }}
        >
          / month
        </span>
      </div>

      <div
        style={{
          display: 'flex',
          gap: 'var(--spacing-xs)',
          flexWrap: 'wrap',
          marginTop: 'var(--spacing-sm)',
        }}
      >
        <StatusBadge variant="info" label="Approximate estimate" />
        <StatusBadge variant="info" label="Awareness only" />
      </div>

      {topCategory && (
        <p
          style={{
            fontSize: 'var(--font-sm)',
            color: 'var(--text-secondary)',
            marginTop: 'var(--spacing-sm)',
            marginBottom: 0,
          }}
        >
          Top contributor:{' '}
          <strong style={{ color: 'var(--text-primary)' }}>
            {CATEGORY_ICONS[topCategory]} {formatCategoryLabel(topCategory)}
          </strong>
        </p>
      )}
    </section>
  );
};
