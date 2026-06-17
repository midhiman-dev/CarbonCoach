import React from 'react';
import { RankedCarbonAction } from '@carboncoach/shared';
import { Card, StatusBadge } from '../../components/ui';
import {
  formatActionCategory,
  formatImpactBand,
  formatEffort,
  formatCostEffect,
  formatReductionKgCO2e,
} from './recommendationViewModel';

export interface RecommendationCardProps {
  action: RankedCarbonAction;
  rank?: number;
}

export const RecommendationCard: React.FC<RecommendationCardProps> = ({ action, rank }) => {
  const reductionText = formatReductionKgCO2e(action.estimatedMonthlyReductionKgCO2e);

  // Map Impact Band to Badge Variant
  const impactVariant =
    action.impactBand === 'high' ? 'high' : action.impactBand === 'medium' ? 'moderate' : 'low';

  // Map Effort to Badge Variant
  const effortVariant =
    action.effort === 'high' ? 'high' : action.effort === 'medium' ? 'moderate' : 'low';

  // Map Cost Effect to Badge Variant
  const costVariant =
    action.costEffect === 'mayCostMore'
      ? 'moderate'
      : action.costEffect === 'savesMoney'
        ? 'low'
        : 'info';

  return (
    <Card
      title={rank ? `${rank}. ${action.title}` : action.title}
      style={{ marginBottom: 'var(--spacing-md)' }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-xs)' }}>
          <StatusBadge variant="info" label={formatActionCategory(action.category)} />
          <StatusBadge variant={impactVariant} label={formatImpactBand(action.impactBand)} />
          <StatusBadge variant={effortVariant} label={formatEffort(action.effort)} />
          <StatusBadge variant={costVariant} label={formatCostEffect(action.costEffect)} />
        </div>

        <p style={{ margin: 0, color: 'var(--text-primary)' }}>{action.reason}</p>

        {reductionText && (
          <p
            style={{
              margin: 0,
              fontWeight: 600,
              color: 'var(--color-primary)',
              fontSize: 'var(--font-sm)',
            }}
          >
            {reductionText}
          </p>
        )}

        {action.fitReasons && action.fitReasons.length > 0 && (
          <div style={{ marginTop: 'var(--spacing-2xs)' }}>
            <span
              style={{
                fontSize: 'var(--font-xs)',
                fontWeight: 600,
                color: 'var(--text-muted)',
                display: 'block',
                marginBottom: 'var(--spacing-3xs)',
              }}
            >
              Why this fits you:
            </span>
            <ul
              style={{
                margin: 0,
                paddingLeft: 'var(--spacing-md)',
                fontSize: 'var(--font-xs)',
                color: 'var(--text-secondary)',
              }}
            >
              {action.fitReasons.map((reason, idx) => (
                <li key={idx}>{reason}</li>
              ))}
            </ul>
          </div>
        )}

        <div
          style={{
            fontSize: 'var(--font-xs)',
            color: 'var(--text-muted)',
            borderTop: '1px solid var(--border-glass)',
            paddingTop: 'var(--spacing-xs)',
            marginTop: 'var(--spacing-xs)',
          }}
        >
          <strong>Assumption:</strong> {action.assumptionNote}
        </div>
      </div>
    </Card>
  );
};
