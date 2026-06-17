import React, { useState, useEffect } from 'react';
import { ChoiceScenario, UserPreference, CoachTone, CoachResponse } from '@carboncoach/shared';
import { Card, Button, Select } from '../../components/ui';
import { buildChoiceCoachRequest } from './choiceCoachRequestBuilder';
import { requestChoiceCoach } from './coachClient';
import { CoachResponseCard } from './CoachResponseCard';

interface ChoiceCoachPanelProps {
  scenario: ChoiceScenario;
  preference?: UserPreference;
}

export const ChoiceCoachPanel: React.FC<ChoiceCoachPanelProps> = ({
  scenario,
  preference = 'balanced',
}) => {
  const [tone, setTone] = useState<CoachTone>('simple');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [response, setResponse] = useState<CoachResponse | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Clear previous response when selected scenario changes
  useEffect(() => {
    setStatus('idle');
    setResponse(null);
    setErrorMsg(null);
  }, [scenario.id]);

  const handleAskCoach = async () => {
    setStatus('loading');
    setErrorMsg(null);
    setResponse(null);

    try {
      const request = buildChoiceCoachRequest({
        scenario,
        preference,
        tone,
      });

      const res = await requestChoiceCoach(request);
      setResponse(res);
      setStatus('success');
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : 'The Choice Coach could not respond right now. Please try again.';
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
    <Card title="Choice Coach" style={{ height: '100%' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
        <p
          style={{
            margin: 0,
            color: 'var(--text-secondary)',
            fontSize: 'var(--font-sm)',
            lineHeight: 1.5,
          }}
        >
          Ask CarbonCoach to explain this deterministic choice comparison in plain language.
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
              id="choice-coach-tone-select"
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
            aria-label="Ask Choice Coach"
          >
            {status === 'loading' ? 'Thinking...' : 'Ask Choice Coach'}
          </Button>
        </div>

        {/* Live Region for Screen Readers */}
        <div aria-live="polite" style={{ marginTop: 'var(--spacing-sm)' }}>
          {status === 'loading' && (
            <p style={{ margin: 0, color: 'var(--color-accent)', fontWeight: 500 }}>
              Preparing a safe choice explanation...
            </p>
          )}

          {status === 'error' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-xs)' }}>
              <p style={{ margin: 0, color: 'var(--color-danger)', fontWeight: 500 }}>
                {errorMsg || 'The Choice Coach could not respond right now. Please try again.'}
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
          <strong>Numeric Safety Rule:</strong> The coach can only use the scenario options, impact
          bands, and deterministic numbers already provided.
        </div>
      </div>
    </Card>
  );
};
