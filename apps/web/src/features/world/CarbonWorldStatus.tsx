import React from 'react';
import type { CarbonWorldState } from '@carboncoach/shared';
import { ProgressMeter } from '../../components/ui/ProgressMeter';

interface CarbonWorldStatusProps {
  state: CarbonWorldState;
}

export const CarbonWorldStatus: React.FC<CarbonWorldStatusProps> = ({ state }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
      <div>
        <h3
          style={{
            fontSize: 'var(--font-size-xl)',
            fontWeight: 'var(--font-weight-bold)',
            margin: '0 0 var(--spacing-xs) 0',
            color: 'var(--color-text-primary)',
          }}
        >
          {state.title}
        </h3>
        <p
          style={{
            margin: 0,
            color: 'var(--color-text-secondary)',
            fontSize: 'var(--font-size-md)',
          }}
        >
          {state.description}
        </p>
      </div>

      <div style={{ margin: 'var(--spacing-xs) 0' }}>
        <ProgressMeter
          value={state.completedActions}
          max={state.totalActions}
          label="Weekly action progress"
        />
        <div
          style={{
            marginTop: 'var(--spacing-xs)',
            fontSize: 'var(--font-size-sm)',
            color: 'var(--color-text-secondary)',
            fontWeight: 'var(--font-weight-medium)',
          }}
        >
          Progress: {state.completedActions} of {state.totalActions} actions complete
        </div>
      </div>

      <div
        style={{
          padding: 'var(--spacing-md)',
          backgroundColor: 'var(--color-surface-hover)',
          borderRadius: 'var(--border-radius-md)',
          borderLeft: '4px solid var(--color-primary-medium)',
          fontSize: 'var(--font-size-md)',
          fontStyle: 'italic',
          color: 'var(--color-text-primary)',
        }}
      >
        "{state.encouragement}"
      </div>

      <div
        style={{
          marginTop: 'var(--spacing-sm)',
          paddingTop: 'var(--spacing-sm)',
          borderTop: '1px solid var(--color-border)',
          fontSize: 'var(--font-size-xs)',
          color: 'var(--color-text-secondary)',
        }}
      >
        <strong>Note:</strong> Carbon World is a motivational metaphor visualizing your action
        completion progress. It does not measure actual carbon reductions or exact science.
      </div>
    </div>
  );
};
