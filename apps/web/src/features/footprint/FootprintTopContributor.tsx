import React from 'react';
import { FootprintCategory } from '@carboncoach/shared';
import { formatCategoryLabel } from './footprintViewModel';
import { CATEGORY_ICONS } from './footprintConstants';

interface FootprintTopContributorProps {
  topCategory: FootprintCategory;
  topShare: number;
}

export const FootprintTopContributor: React.FC<FootprintTopContributorProps> = ({
  topCategory,
  topShare,
}) => {
  return (
    <section
      aria-label="Top contributor insight"
      style={{
        background: 'rgba(248,113,113,0.06)',
        border: '1px solid rgba(248,113,113,0.25)',
        borderRadius: 'var(--radius-md)',
        padding: 'var(--spacing-lg)',
        display: 'flex',
        gap: 'var(--spacing-md)',
        alignItems: 'flex-start',
        flexWrap: 'wrap',
      }}
    >
      <div
        aria-hidden="true"
        style={{
          fontSize: '2.5rem',
          lineHeight: 1,
          flexShrink: 0,
        }}
      >
        {CATEGORY_ICONS[topCategory]}
      </div>
      <div style={{ flex: 1, minWidth: '200px' }}>
        <p
          style={{
            fontSize: 'var(--font-xs)',
            color: 'var(--text-muted)',
            margin: '0 0 var(--spacing-2xs)',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            fontWeight: 600,
          }}
        >
          Your biggest contributor
        </p>
        <div
          style={{
            display: 'flex',
            alignItems: 'baseline',
            gap: 'var(--spacing-xs)',
            flexWrap: 'wrap',
          }}
        >
          <span
            style={{
              fontSize: 'var(--font-2xl)',
              fontWeight: 700,
              color: 'var(--text-primary)',
            }}
            data-testid="top-contributor-name"
          >
            {formatCategoryLabel(topCategory)}
          </span>
          <span
            style={{ fontSize: 'var(--font-sm)', color: 'var(--text-secondary)' }}
            data-testid="top-contributor-share"
          >
            {topShare}% of your approximate estimate
          </span>
        </div>
        <p
          style={{
            fontSize: 'var(--font-sm)',
            color: 'var(--text-muted)',
            margin: 'var(--spacing-xs) 0 0',
            lineHeight: 1.5,
          }}
        >
          This is a practical place to start with small everyday choices.
        </p>
      </div>
    </section>
  );
};
