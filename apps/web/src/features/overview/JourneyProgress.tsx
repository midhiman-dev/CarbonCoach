import React from 'react';
import { overviewCopy } from './overviewCopy';
import { ActiveSection } from '../../app/routes';

interface JourneyProgressProps {
  hasProfile: boolean;
  hasActions: boolean;
  trackerProgressPercent: number;
  onNavigate: (section: ActiveSection) => void;
}

export const JourneyProgress: React.FC<JourneyProgressProps> = ({
  hasProfile,
  hasActions,
  trackerProgressPercent,
  onNavigate,
}) => {
  const getStepStatus = (id: string): 'complete' | 'current' | 'pending' => {
    switch (id) {
      case 'profile':
        return hasProfile ? 'complete' : 'current';
      case 'footprint':
        if (!hasProfile) return 'pending';
        return hasActions ? 'complete' : 'current';
      case 'recommendations':
        if (!hasProfile) return 'pending';
        return hasActions ? 'complete' : 'current';
      case 'tracker':
        if (!hasActions) return 'pending';
        return trackerProgressPercent === 100 ? 'complete' : 'current';
      case 'carbon-world':
        if (trackerProgressPercent === 0) return 'pending';
        return trackerProgressPercent === 100 ? 'complete' : 'current';
      default:
        return 'pending';
    }
  };

  const getStatusColor = (status: 'complete' | 'current' | 'pending') => {
    if (status === 'complete') return 'var(--color-primary)';
    if (status === 'current') return 'var(--color-accent)';
    return 'var(--text-muted)';
  };

  return (
    <div
      style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border-glass)',
        borderRadius: 'var(--radius-md)',
        padding: 'var(--spacing-lg)',
      }}
    >
      <h3
        style={{
          fontSize: 'var(--font-lg)',
          fontWeight: 700,
          color: 'var(--text-primary)',
          margin: '0 0 var(--spacing-md) 0',
        }}
      >
        {overviewCopy.journey.title}
      </h3>
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 'var(--spacing-xs)',
          flexWrap: 'wrap',
        }}
        role="list"
        aria-label="Progress journey roadmap"
      >
        {overviewCopy.journey.steps.map((step, idx) => {
          const status = getStepStatus(step.id);
          const color = getStatusColor(status);

          return (
            <React.Fragment key={step.id}>
              {idx > 0 && (
                <div
                  style={{
                    flex: 1,
                    height: '2px',
                    backgroundColor: 'rgba(255, 255, 255, 0.08)',
                    minWidth: '20px',
                    maxWidth: '80px',
                  }}
                  className="hide-mobile-block"
                  aria-hidden="true"
                />
              )}
              <button
                onClick={() => onNavigate(step.id as ActiveSection)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  cursor: 'pointer',
                  padding: 'var(--spacing-xs)',
                  outline: 'none',
                  borderRadius: 'var(--radius-xs)',
                  textAlign: 'center',
                }}
                className="journey-step-btn"
                aria-label={`${step.label}: ${step.desc}. Status: ${status}`}
              >
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: 'var(--radius-circle)',
                    backgroundColor: 'rgba(255, 255, 255, 0.04)',
                    border: `2px solid ${color}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    color: color,
                    fontSize: 'var(--font-sm)',
                    marginBottom: 'var(--spacing-xs)',
                    transition: 'all var(--transition-fast)',
                  }}
                >
                  {status === 'complete' ? '✓' : idx + 1}
                </div>
                <span
                  style={{
                    fontSize: 'var(--font-sm)',
                    fontWeight: 600,
                    color: 'var(--text-primary)',
                  }}
                >
                  {step.label.split('. ')[1]}
                </span>
                <span
                  style={{
                    fontSize: 'var(--font-xs)',
                    color: 'var(--text-muted)',
                  }}
                >
                  {step.desc}
                </span>
              </button>
            </React.Fragment>
          );
        })}
      </div>
      <style>{`
        .journey-step-btn:focus-visible {
          outline: var(--focus-ring);
          outline-offset: var(--focus-offset);
        }
        .journey-step-btn:hover div {
          transform: scale(1.1);
        }
      `}</style>
    </div>
  );
};
