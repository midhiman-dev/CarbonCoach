import React from 'react';
import { ProgressMeter } from '../../components/ui';

interface WeeklyTrackerProgressProps {
  completed: number;
  total: number;
  percent: number;
}

export const WeeklyTrackerProgress: React.FC<WeeklyTrackerProgressProps> = ({
  completed,
  total,
  percent,
}) => {
  const isAllComplete = percent === 100;

  return (
    <div
      style={{
        padding: 'var(--spacing-md)',
        border: '1px solid var(--border-glass)',
        borderRadius: 'var(--radius-sm)',
        background: 'var(--bg-deep-navy)',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--spacing-xs)',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
        <span
          style={{
            fontSize: 'var(--font-xs)',
            color: 'var(--text-muted)',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}
        >
          Weekly action progress
        </span>
        <span
          style={{
            fontSize: 'var(--font-lg)',
            fontWeight: 700,
            color: 'var(--text-primary)',
          }}
        >
          {completed} of {total} complete
        </span>
      </div>

      <ProgressMeter
        value={percent}
        max={100}
        label={`Weekly action progress: ${completed} of ${total} planned actions complete.`}
      />

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '2px',
          marginTop: 'var(--spacing-2xs)',
        }}
      >
        <p
          style={{
            margin: 0,
            color: isAllComplete ? 'var(--color-primary)' : 'var(--text-primary)',
            fontWeight: 600,
            fontSize: 'var(--font-sm)',
          }}
        >
          {isAllComplete
            ? 'Weekly plan complete'
            : completed > 0
              ? 'Action completed'
              : 'Your next action is ready.'}
        </p>
        <p style={{ margin: 0, fontSize: 'var(--font-xs)', color: 'var(--text-secondary)' }}>
          {isAllComplete
            ? 'Your Carbon World is ready to explore.'
            : completed > 0
              ? 'Nice work — your weekly progress has moved forward.'
              : 'Get started by checking off your first action below.'}
        </p>
        <p
          style={{
            margin: '4px 0 0 0',
            fontSize: 'var(--font-xs)',
            color: 'var(--text-muted)',
          }}
        >
          Your Carbon World reflects weekly action progress.
        </p>
      </div>
    </div>
  );
};
