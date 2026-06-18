import React from 'react';
import { Card } from '../../components/ui';
import { privacyCopy } from './privacyCopy';

export const CoachDataFlowPanel: React.FC = () => {
  const { coachFlowSection } = privacyCopy;

  return (
    <Card title={coachFlowSection.title}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
        <p style={{ margin: 0, color: 'var(--text-secondary)' }}>{coachFlowSection.description}</p>

        <ol
          style={{
            margin: 'var(--spacing-sm) 0',
            paddingLeft: 'var(--spacing-md)',
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--spacing-md)',
          }}
        >
          {coachFlowSection.steps.map((step, idx) => (
            <li key={idx} style={{ color: 'var(--color-accent)', fontWeight: 600 }}>
              <div style={{ color: 'var(--text-primary)', fontWeight: 600, display: 'inline' }}>
                {step.title}:{' '}
              </div>
              <div style={{ color: 'var(--text-secondary)', fontWeight: 400, display: 'inline' }}>
                {step.text}
              </div>
            </li>
          ))}
        </ol>

        <div
          style={{
            background: 'rgba(255, 255, 255, 0.02)',
            padding: 'var(--spacing-md)',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border-glass)',
          }}
        >
          <h4
            style={{
              margin: '0 0 var(--spacing-sm) 0',
              fontSize: 'var(--font-sm)',
              fontWeight: 700,
              color: 'var(--text-primary)',
            }}
          >
            What is NEVER sent to the AI Coach:
          </h4>
          <ul
            style={{
              margin: 0,
              paddingLeft: 'var(--spacing-md)',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: 'var(--spacing-sm)',
            }}
          >
            {coachFlowSection.notSentList.map((item, idx) => (
              <li key={idx} style={{ color: '#f44336', fontSize: 'var(--font-sm)' }}>
                <span style={{ color: 'var(--text-secondary)' }}>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Card>
  );
};
