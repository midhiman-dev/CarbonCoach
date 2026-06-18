import React, { useState } from 'react';
import {
  FootprintEstimate,
  RankedCarbonAction,
  UserPreference,
  CoachTone,
  WeeklyActionPlan,
  CoachResponse,
} from '@carboncoach/shared';
import { Card, Button, Select } from '../../components/ui';
import { buildFootprintCoachRequest } from './coachRequestBuilder';
import { requestFootprintCoach } from './coachClient';
import { CoachResponseCard } from './CoachResponseCard';

interface FootprintCoachPanelProps {
  footprint: FootprintEstimate | null;
  recommendedActions: RankedCarbonAction[];
  weeklyPlan?: WeeklyActionPlan;
  preference?: UserPreference;
}

export const FootprintCoachPanel: React.FC<FootprintCoachPanelProps> = ({
  footprint,
  recommendedActions,
  weeklyPlan,
  preference = 'balanced',
}) => {
  const [tone, setTone] = useState<CoachTone>('simple');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [response, setResponse] = useState<CoachResponse | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showSafetyInfo, setShowSafetyInfo] = useState(false);

  if (!footprint) {
    return (
      <Card title="Footprint Coach">
        <p style={{ margin: 0, color: 'var(--text-secondary)' }}>
          Please configure your lifestyle profile first to enable the Footprint Coach.
        </p>
      </Card>
    );
  }

  const handleAskCoach = async () => {
    setStatus('loading');
    setErrorMsg(null);
    setResponse(null);

    try {
      const request = buildFootprintCoachRequest({
        footprint,
        recommendedActions,
        weeklyPlan,
        preference,
        tone,
      });

      const res = await requestFootprintCoach(request);
      setResponse(res);
      setStatus('success');
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : 'The coach could not respond right now. Please try again.';
      setErrorMsg(message);
      setStatus('error');
    }
  };

  const toneOptions = [
    { value: 'simple', label: 'Simple' },
    { value: 'detailed', label: 'Detailed' },
    { value: 'encouraging', label: 'Encouraging' },
  ];

  return (
    <Card title="Footprint Coach" style={{ height: '100%' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
        <p
          style={{
            margin: 0,
            color: 'var(--text-secondary)',
            fontSize: 'var(--font-sm)',
            lineHeight: 1.5,
          }}
        >
          Ask CarbonCoach to explain your calculated footprint and deterministic recommendations in
          plain language.
        </p>

        <div
          style={{
            display: 'flex',
            gap: 'var(--spacing-md)',
            alignItems: 'flex-end',
            flexWrap: 'wrap',
          }}
        >
          <div style={{ flex: 1, minWidth: '150px' }}>
            <Select
              label="Select Tone"
              id="coach-tone-select"
              options={toneOptions}
              value={tone}
              onChange={(e) => setTone(e.target.value as CoachTone)}
              disabled={status === 'loading'}
            />
          </div>
          <Button
            onClick={handleAskCoach}
            disabled={status === 'loading'}
            style={{ height: '42px' }}
            aria-label="Ask Footprint Coach"
          >
            {status === 'loading' ? 'Thinking...' : 'Ask Footprint Coach'}
          </Button>
        </div>

        {/* Live Region for Screen Readers */}
        <div aria-live="polite" style={{ marginTop: 'var(--spacing-sm)' }}>
          {status === 'loading' && (
            <p style={{ margin: 0, color: 'var(--color-accent)', fontWeight: 500 }}>
              Preparing a safe explanation...
            </p>
          )}

          {status === 'error' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-xs)' }}>
              <p style={{ margin: 0, color: 'var(--color-danger)', fontWeight: 500 }}>
                {errorMsg || 'The coach could not respond right now. Please try again.'}
              </p>
              <Button
                variant="ghost"
                onClick={handleAskCoach}
                style={{
                  alignSelf: 'flex-start',
                  fontSize: 'var(--font-sm)',
                  padding: 'var(--spacing-xs) var(--spacing-sm)',
                }}
              >
                Retry Request
              </Button>
            </div>
          )}
        </div>

        {status === 'success' && response && <CoachResponseCard response={response} />}

        <div
          style={{
            fontSize: 'var(--font-xs)',
            color: 'var(--text-muted)',
            borderTop: '1px solid var(--border-glass)',
            paddingTop: 'var(--spacing-sm)',
            marginTop: 'var(--spacing-xs)',
          }}
        >
          <button
            onClick={() => setShowSafetyInfo(!showSafetyInfo)}
            aria-expanded={showSafetyInfo}
            style={{
              background: 'transparent',
              border: 'none',
              padding: 0,
              fontSize: 'var(--font-xs)',
              cursor: 'pointer',
              color: 'var(--color-accent)',
              textDecoration: 'underline',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 'var(--spacing-3xs)',
              minHeight: '24px',
            }}
          >
            How coach numbers are kept safe {showSafetyInfo ? '▴' : '▾'}
          </button>
          {showSafetyInfo && (
            <p style={{ margin: 'var(--spacing-xs) 0 0 0', lineHeight: 1.4 }}>
              <strong>Numeric Safety Rule:</strong> The coach can only use calculated numbers
              already shown in your estimate.
            </p>
          )}
        </div>
      </div>
    </Card>
  );
};
