import React from 'react';
import { WeeklyActionPlan } from '@carboncoach/shared';
import { Card, StatusBadge } from '../../components/ui';
import { recommendationCopy } from './recommendationCopy';
import { formatActionCategory, formatImpactBand } from './recommendationViewModel';

export interface WeeklyPlanPanelProps {
  plan: WeeklyActionPlan;
}

export const WeeklyPlanPanel: React.FC<WeeklyPlanPanelProps> = ({ plan }) => {
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
            <h5
              style={{
                fontSize: 'var(--font-xs)',
                fontWeight: 600,
                color: 'var(--text-muted)',
                margin: '0 0 var(--spacing-xs) 0',
              }}
            >
              Plan Assumptions
            </h5>
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
          </div>
        )}
      </div>
    </Card>
  );
};
