import React, { useState } from 'react';
import type { WeeklyActionPlan } from '@carboncoach/shared';
import { Card, StatusBadge, Button } from '../../components/ui';
import { recommendationCopy } from './recommendationCopy';
import { formatActionCategory, formatImpactBand } from './recommendationViewModel';

export interface WeeklyPlanPanelProps {
  plan: WeeklyActionPlan;
  onNavigateToTracker?: () => void;
  hasTrackerProgress?: boolean;
}

export const WeeklyPlanPanel: React.FC<WeeklyPlanPanelProps> = ({
  plan,
  onNavigateToTracker,
  hasTrackerProgress = false,
}) => {
  const [showAssumptions, setShowAssumptions] = useState(false);

  return (
    <Card title={recommendationCopy.planTitle}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
        <p style={{ margin: 0, fontWeight: 500, color: 'var(--text-primary)' }}>{plan.summary}</p>

        <p style={{ margin: 0, fontSize: 'var(--font-sm)', color: 'var(--text-muted)' }}>
          {recommendationCopy.disclaimer}
        </p>

        <div style={{ marginTop: 'var(--spacing-xs)' }}>
          <h4
            style={{
              fontSize: 'var(--font-md)',
              color: 'var(--text-primary)',
              margin: '0 0 var(--spacing-sm) 0',
            }}
          >
            Weekly Action Checklist
          </h4>
          <ol
            style={{
              margin: 0,
              paddingLeft: 'var(--spacing-md)',
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--spacing-md)',
            }}
          >
            {plan.actions.map((action) => {
              const impactVariant =
                action.impactBand === 'high'
                  ? 'high'
                  : action.impactBand === 'medium'
                    ? 'moderate'
                    : 'low';

              return (
                <li key={action.id} style={{ color: 'var(--text-primary)' }}>
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 'var(--spacing-2xs)',
                    }}
                  >
                    <span style={{ fontWeight: 600 }}>{action.title}</span>
                    <div style={{ display: 'flex', gap: 'var(--spacing-xs)', flexWrap: 'wrap' }}>
                      <StatusBadge variant="info" label={formatActionCategory(action.category)} />
                      <StatusBadge
                        variant={impactVariant}
                        label={formatImpactBand(action.impactBand)}
                      />
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>

        {plan.assumptionNotes && plan.assumptionNotes.length > 0 && (
          <div
            style={{
              marginTop: 'var(--spacing-md)',
              paddingTop: 'var(--spacing-md)',
              borderTop: '1px solid var(--border-glass)',
            }}
          >
            <button
              onClick={() => setShowAssumptions(!showAssumptions)}
              aria-expanded={showAssumptions}
              style={{
                background: 'transparent',
                border: '1px solid var(--border-glass)',
                padding: 'var(--spacing-xs) var(--spacing-sm)',
                fontSize: 'var(--font-xs)',
                cursor: 'pointer',
                borderRadius: 'var(--radius-xs)',
                color: 'var(--text-secondary)',
                minHeight: '44px',
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--spacing-2xs)',
                width: '100%',
                justifyContent: 'center',
                marginBottom: showAssumptions ? 'var(--spacing-sm)' : 0,
              }}
            >
              How this plan is selected {showAssumptions ? '▴' : '▾'}
            </button>
            {showAssumptions && (
              <ul
                style={{
                  margin: 0,
                  paddingLeft: 'var(--spacing-md)',
                  fontSize: 'var(--font-xs)',
                  color: 'var(--text-muted)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 'var(--spacing-3xs)',
                }}
              >
                {plan.assumptionNotes.map((note, idx) => (
                  <li key={idx}>{note}</li>
                ))}
              </ul>
            )}
          </div>
        )}

        {onNavigateToTracker && (
          <Button
            onClick={onNavigateToTracker}
            variant="primary"
            style={{ marginTop: 'var(--spacing-md)', width: '100%', cursor: 'pointer' }}
          >
            {hasTrackerProgress ? 'View weekly tracker' : 'Start weekly tracker'}
          </Button>
        )}
      </div>
    </Card>
  );
};
