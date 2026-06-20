import React from 'react';
import type { RankedCarbonAction } from '@carboncoach/shared';
import { Button } from '../../components/ui';
import { formatActionCategory } from '../recommendations/recommendationViewModel';

interface WeeklyTrackerNextActionProps {
  firstIncompleteAction: RankedCarbonAction | undefined;
  activeToggleAction: (actionId: string) => void;
  onNavigateToWorld?: () => void;
  worldStateTitle: string;
}

export const WeeklyTrackerNextAction: React.FC<WeeklyTrackerNextActionProps> = ({
  firstIncompleteAction,
  activeToggleAction,
  onNavigateToWorld,
  worldStateTitle,
}) => {
  return (
    <div
      style={{
        padding: 'var(--spacing-md)',
        border: '1px solid var(--color-accent)',
        borderRadius: 'var(--radius-sm)',
        background: 'var(--color-accent-bg)',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--spacing-sm)',
      }}
    >
      {firstIncompleteAction ? (
        <>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <span
              style={{
                fontSize: 'var(--font-xs)',
                fontWeight: 800,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                color: 'var(--color-accent)',
              }}
            >
              Next action
            </span>
          </div>
          <div>
            <h4
              style={{
                margin: '0 0 var(--spacing-2xs)',
                fontSize: 'var(--font-md)',
                fontWeight: 700,
                color: 'var(--text-primary)',
              }}
            >
              {firstIncompleteAction.title}
            </h4>
            <div
              style={{
                display: 'flex',
                gap: 'var(--spacing-xs)',
                alignItems: 'center',
                marginBottom: 'var(--spacing-xs)',
                flexWrap: 'wrap',
              }}
            >
              <span
                style={{
                  fontSize: '10px',
                  padding: '2px 6px',
                  background: 'rgba(255, 255, 255, 0.08)',
                  borderRadius: '4px',
                  color: 'var(--text-secondary)',
                }}
              >
                {formatActionCategory(firstIncompleteAction.category)}
              </span>
              <span style={{ color: 'var(--text-muted)', fontSize: '10px' }}>·</span>
              <span
                style={{
                  fontSize: '10px',
                  padding: '2px 6px',
                  background: 'rgba(255, 255, 255, 0.08)',
                  borderRadius: '4px',
                  color: 'var(--text-secondary)',
                }}
              >
                {firstIncompleteAction.effort.charAt(0).toUpperCase() +
                  firstIncompleteAction.effort.slice(1)}{' '}
                effort
              </span>
            </div>
            <p
              style={{
                margin: 0,
                fontSize: 'var(--font-xs)',
                color: 'var(--text-secondary)',
                lineHeight: 1.4,
              }}
            >
              {firstIncompleteAction.reason}
            </p>
          </div>
          <div style={{ marginTop: 'var(--spacing-2xs)' }}>
            <Button
              onClick={() => activeToggleAction(firstIncompleteAction.id)}
              aria-label={`Mark "${firstIncompleteAction.title}" as complete`}
            >
              Complete next action
            </Button>
          </div>
        </>
      ) : (
        <>
          <div>
            <h4
              style={{
                margin: '0 0 var(--spacing-2xs)',
                fontSize: 'var(--font-md)',
                fontWeight: 700,
                color: 'var(--text-primary)',
              }}
            >
              This week is complete
            </h4>
            <p
              style={{
                margin: 0,
                fontSize: 'var(--font-xs)',
                color: 'var(--text-secondary)',
              }}
            >
              Your Carbon World is ready to explore.
            </p>
          </div>
          {onNavigateToWorld && (
            <div style={{ marginTop: 'var(--spacing-2xs)' }}>
              <Button onClick={onNavigateToWorld} aria-label={`View ${worldStateTitle}`}>
                View {worldStateTitle}
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};
