import React from 'react';
import { overviewCopy } from './overviewCopy';

export const TrustStrip: React.FC = () => {
  const badges = [
    { text: overviewCopy.trustStrip.localFirst, icon: '🔒' },
    { text: overviewCopy.trustStrip.deterministic, icon: '📊' },
    { text: overviewCopy.trustStrip.numericGuarded, icon: '🛡️' },
    { text: overviewCopy.trustStrip.noAccount, icon: '✨' },
  ];

  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 'var(--spacing-md)',
        alignItems: 'center',
        justifyContent: 'flex-start',
        padding: 'var(--spacing-sm) 0',
      }}
      aria-label="Product guarantees"
    >
      {badges.map((badge, index) => (
        <div
          key={index}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--spacing-xs)',
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid var(--border-glass)',
            borderRadius: 'var(--radius-xl)',
            padding: 'var(--spacing-xs) var(--spacing-md)',
            fontSize: 'var(--font-xs)',
            fontWeight: 600,
            color: 'var(--text-secondary)',
          }}
        >
          <span aria-hidden="true">{badge.icon}</span>
          <span>{badge.text}</span>
        </div>
      ))}
    </div>
  );
};
