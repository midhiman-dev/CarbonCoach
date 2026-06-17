import React from 'react';
import { Card, StatusBadge } from '../../components/ui';
import type { ChoiceOption } from '@carboncoach/shared';
import { formatImpactBandLabel } from './choiceViewModel';
import { choiceCopy } from './choiceCopy';

interface ChoiceOptionCardProps {
  option: ChoiceOption;
  isRecommended: boolean;
}

export const ChoiceOptionCard: React.FC<ChoiceOptionCardProps> = ({ option, isRecommended }) => {
  // Map impactBand to StatusBadge variant
  const getBadgeVariant = (impact: ChoiceOption['impactBand']) => {
    switch (impact) {
      case 'low':
        return 'low';
      case 'medium':
        return 'moderate';
      case 'high':
        return 'high';
      default:
        return 'info';
    }
  };

  return (
    <Card
      className={`choice-option-card ${isRecommended ? 'recommended-highlight' : ''}`}
      style={{
        border: isRecommended ? '2px solid var(--color-accent)' : '1px solid var(--border-glass)',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          gap: 'var(--spacing-xs)',
          marginBottom: 'var(--spacing-sm)',
        }}
      >
        <h4 style={{ margin: 0, fontSize: 'var(--font-md)', fontWeight: 700 }}>{option.label}</h4>
        <div style={{ display: 'flex', gap: 'var(--spacing-xs)', flexWrap: 'wrap' }}>
          {isRecommended && (
            <StatusBadge variant="info" label={choiceCopy.recommendedOptionLabel} />
          )}
          <StatusBadge
            variant={getBadgeVariant(option.impactBand)}
            label={formatImpactBandLabel(option.impactBand)}
          />
        </div>
      </div>

      <p
        style={{
          fontSize: 'var(--font-sm)',
          color: 'var(--text-secondary)',
          marginBottom: 'var(--spacing-md)',
        }}
      >
        {option.description}
      </p>

      {option.reasons && option.reasons.length > 0 && (
        <div
          style={{
            marginTop: 'auto',
            borderTop: '1px solid var(--border-glass)',
            paddingTop: 'var(--spacing-sm)',
          }}
        >
          <h5
            style={{
              margin: '0 0 var(--spacing-xs) 0',
              fontSize: 'var(--font-xs)',
              fontWeight: 600,
              textTransform: 'uppercase',
              color: 'var(--text-muted)',
            }}
          >
            {choiceCopy.reasonsTitle}
          </h5>
          <ul
            style={{
              margin: 0,
              paddingLeft: 'var(--spacing-md)',
              fontSize: 'var(--font-xs)',
              color: 'var(--text-muted)',
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--spacing-xxs)',
            }}
          >
            {option.reasons.map((reason, idx) => (
              <li key={idx}>{reason}</li>
            ))}
          </ul>
        </div>
      )}
    </Card>
  );
};
