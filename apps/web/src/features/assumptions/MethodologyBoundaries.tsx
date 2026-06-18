import React from 'react';
import { Card } from '../../components/ui';
import { assumptionsCopy } from './assumptionsCopy';

export const MethodologyBoundaries: React.FC = () => {
  const { boundaries } = assumptionsCopy;

  return (
    <Card title={boundaries.title}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
        <p style={{ margin: 0, color: 'var(--text-secondary)' }}>
          To ensure scientific integrity and prevent misleading representations, please note the
          following limitations of this platform:
        </p>

        <ul
          style={{
            margin: 0,
            paddingLeft: 'var(--spacing-md)',
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--spacing-sm)',
          }}
        >
          {boundaries.points.map((point, idx) => (
            <li key={idx} style={{ color: 'var(--text-primary)', fontSize: 'var(--font-sm)' }}>
              {point}
            </li>
          ))}
        </ul>
      </div>
    </Card>
  );
};
