import React from 'react';
import { CoachResponse } from '@carboncoach/shared';
import { Card, StatusBadge } from '../../components/ui';

interface CoachResponseCardProps {
  response: CoachResponse;
}

export const CoachResponseCard: React.FC<CoachResponseCardProps> = ({ response }) => {
  const {
    summary,
    explanation,
    recommendedNextStep,
    weeklyPlan,
    confidenceNote,
    disclaimer,
    source,
  } = response;

  const isFallback = source === 'fallback';

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--spacing-md)',
        marginTop: 'var(--spacing-md)',
        animation: 'fadeIn 0.3s ease-in-out',
      }}
    >
      <Card title="Coach Response">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
          {/* Source badge */}
          <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
            <StatusBadge
              variant={isFallback ? 'moderate' : 'low'}
              label={isFallback ? 'Deterministic Fallback' : 'AI Response'}
            />
          </div>
          {/* Summary / Lead */}
          <div
            style={{
              fontSize: 'var(--font-md)',
              fontWeight: 600,
              color: 'var(--color-accent)',
              borderBottom: '1px solid var(--border-glass)',
              paddingBottom: 'var(--spacing-sm)',
            }}
          >
            {summary}
          </div>

          {/* Explanation */}
          <div>
            <h4
              style={{
                fontSize: 'var(--font-sm)',
                color: 'var(--text-muted)',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                marginBottom: 'var(--spacing-xs)',
              }}
            >
              Analysis & Insights
            </h4>
            <p style={{ margin: 0, lineHeight: 1.6 }}>{explanation}</p>
          </div>

          {/* Recommended Next Step */}
          <div>
            <h4
              style={{
                fontSize: 'var(--font-sm)',
                color: 'var(--text-muted)',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                marginBottom: 'var(--spacing-xs)',
              }}
            >
              Top Priority Action
            </h4>
            <p style={{ margin: 0, lineHeight: 1.6, fontWeight: 500 }}>{recommendedNextStep}</p>
          </div>

          {/* Weekly Plan */}
          {weeklyPlan && weeklyPlan.length > 0 && (
            <div>
              <h4
                style={{
                  fontSize: 'var(--font-sm)',
                  color: 'var(--text-muted)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  marginBottom: 'var(--spacing-xs)',
                }}
              >
                Weekly Action Plan
              </h4>
              <ul style={{ margin: 0, paddingLeft: '1.2rem', lineHeight: 1.6 }}>
                {weeklyPlan.map((action, idx) => (
                  <li key={idx} style={{ marginBottom: 'var(--spacing-xs)' }}>
                    {action}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Confidence Note */}
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.02)',
              borderLeft: '3px solid var(--color-accent)',
              padding: 'var(--spacing-sm)',
              borderRadius: 'var(--radius-xs)',
              fontSize: 'var(--font-xs)',
              color: 'var(--text-secondary)',
            }}
          >
            <strong>Calculation Confidence:</strong> {confidenceNote}
          </div>

          {/* Scientific Disclaimer */}
          <div
            style={{
              fontSize: 'var(--font-xs)',
              color: 'var(--text-muted)',
              borderTop: '1px solid var(--border-glass)',
              paddingTop: 'var(--spacing-sm)',
              fontStyle: 'italic',
            }}
          >
            {disclaimer}
          </div>
        </div>
      </Card>
    </div>
  );
};
