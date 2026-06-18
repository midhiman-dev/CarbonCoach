import React from 'react';
import { SectionHeader, Card } from '../../components/ui';
import { AssumptionCategorySection } from './AssumptionCategorySection';
import { MethodologyBoundaries } from './MethodologyBoundaries';
import { assumptionsCopy } from './assumptionsCopy';

export const AssumptionsPage: React.FC = () => {
  const { title, subtitle, intro, disclaimer } = assumptionsCopy;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)' }}>
      <SectionHeader title={title} subtitle={subtitle} />

      <Card title="Approximate Nature of Calculations">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
          <p style={{ margin: 0 }}>{intro}</p>
          <p
            style={{
              margin: 0,
              color: 'var(--text-secondary)',
              fontSize: 'var(--font-sm)',
              borderLeft: '3px solid var(--color-accent)',
              paddingLeft: 'var(--spacing-md)',
            }}
          >
            {disclaimer}
          </p>
        </div>
      </Card>

      <MethodologyBoundaries />

      <div>
        <h3 style={{ fontSize: 'var(--font-lg)', marginBottom: 'var(--spacing-sm)' }}>
          Detailed Estimation Methodology
        </h3>
        <p
          style={{
            margin: '0 0 var(--spacing-md) 0',
            color: 'var(--text-secondary)',
            fontSize: 'var(--font-sm)',
          }}
        >
          Below is a breakdown of how calculations, tracker actions, and AI coaching are structured
          for each lifestyle domain.
        </p>
        <AssumptionCategorySection />
      </div>
    </div>
  );
};
