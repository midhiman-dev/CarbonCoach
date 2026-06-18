import React from 'react';
import { Card, SectionHeader } from '../../components/ui';
import { LocalDataPolicyTable } from './LocalDataPolicyTable';
import { CoachDataFlowPanel } from './CoachDataFlowPanel';
import { LocalDataControls } from '../tracker';
import { privacyCopy } from './privacyCopy';

interface PrivacyLocalDataPageProps {
  hasData: boolean;
  onClear: () => void;
}

export const PrivacyLocalDataPage: React.FC<PrivacyLocalDataPageProps> = ({ hasData, onClear }) => {
  const { title, subtitle, intro, principles, noAccountSection, clearDataSection } = privacyCopy;
  const [isPolicyExpanded, setIsPolicyExpanded] = React.useState(false);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)' }}>
      <SectionHeader title={title} subtitle={subtitle} />

      <Card title="Our Commitment to Privacy">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
          <p style={{ margin: 0, fontWeight: 600 }}>{intro}</p>
          <ul
            style={{
              margin: 0,
              paddingLeft: 'var(--spacing-md)',
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--spacing-xs)',
            }}
          >
            {principles.map((principle, idx) => {
              const parts = principle.split(': ');
              return (
                <li key={idx} style={{ color: 'var(--text-secondary)' }}>
                  {parts.length > 1 ? (
                    <>
                      <strong style={{ color: 'var(--text-primary)' }}>{parts[0]}:</strong>{' '}
                      {parts.slice(1).join(': ')}
                    </>
                  ) : (
                    principle
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </Card>

      <Card title={noAccountSection.title}>
        <p style={{ margin: 0, color: 'var(--text-secondary)' }}>{noAccountSection.description}</p>
      </Card>

      <Card title="Local Data Policy">
        <details
          onToggle={(e) => setIsPolicyExpanded((e.target as HTMLDetailsElement).open)}
          style={{
            background: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid var(--border-glass)',
            borderRadius: 'var(--radius-sm)',
            padding: 'var(--spacing-sm)',
            cursor: 'pointer',
          }}
        >
          <summary
            style={{
              fontWeight: 600,
              color: 'var(--color-accent)',
              outline: 'none',
              padding: 'var(--spacing-xs) 0',
            }}
          >
            {isPolicyExpanded ? 'Hide detailed policy table' : 'View detailed policy table'}
          </summary>
          {isPolicyExpanded && (
            <div style={{ marginTop: 'var(--spacing-sm)' }}>
              <p style={{ margin: '0 0 var(--spacing-sm) 0', color: 'var(--text-secondary)' }}>
                The table below describes every category of data handled by CarbonCoach, where it
                resides, and why it is required.
              </p>
              <LocalDataPolicyTable />
            </div>
          )}
        </details>
      </Card>

      <CoachDataFlowPanel />

      <div>
        <h3 style={{ fontSize: 'var(--font-lg)', marginBottom: 'var(--spacing-sm)' }}>
          {clearDataSection.title}
        </h3>
        <p
          style={{
            margin: '0 0 var(--spacing-md) 0',
            color: 'var(--text-secondary)',
            fontSize: 'var(--font-sm)',
          }}
        >
          {clearDataSection.description}
        </p>
        <LocalDataControls hasData={hasData} onClear={onClear} />
      </div>
    </div>
  );
};
