import React from 'react';
import { overviewCopy } from './overviewCopy';

export const OverviewHero: React.FC = () => {
  return (
    <div
      style={{
        padding: 'var(--spacing-xl)',
        background: 'linear-gradient(135deg, rgba(0, 245, 212, 0.08) 0%, rgba(14, 20, 36, 0) 100%)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-glass)',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--spacing-xs)',
      }}
    >
      <h2
        style={{
          fontSize: 'var(--font-3xl)',
          fontWeight: 800,
          color: 'var(--text-primary)',
          margin: 0,
          lineHeight: 1.2,
        }}
      >
        {overviewCopy.heroTitle}{' '}
        <span style={{ color: 'var(--color-accent)' }}>{overviewCopy.heroSubtitle}</span>
      </h2>
      <p
        style={{
          fontSize: 'var(--font-md)',
          color: 'var(--text-secondary)',
          margin: 0,
          maxWidth: '640px',
          lineHeight: 1.5,
        }}
      >
        {overviewCopy.heroDescription}
      </p>
    </div>
  );
};
