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

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)' }}>
      <SectionHeader title={title} subtitle={subtitle} />

      <Card title="Our Commitment to Privacy">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
          <p style={{ margin: 0 }}>{intro}</p>
          <ul
            style={{
              margin: 0,
              paddingLeft: 'var(--spacing-md)',
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--spacing-xs)',
            }}
          >
            {principles.map((principle, idx) => (
              <li key={idx} style={{ color: 'var(--text-secondary)' }}>
                {principle}
              </li>
            ))}
          </ul>
        </div>
      </Card>

      <Card title={noAccountSection.title}>
        <p style={{ margin: 0, color: 'var(--text-secondary)' }}>{noAccountSection.description}</p>
      </Card>

      <Card title="Local Data Policy">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
          <p style={{ margin: 0, color: 'var(--text-secondary)' }}>
            The table below describes every category of data handled by CarbonCoach, where it
            resides, and why it is required.
          </p>
          <LocalDataPolicyTable />
        </div>
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
