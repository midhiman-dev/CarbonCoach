import React from 'react';
import { Select } from '../../components/ui';
import type { ChoiceScenario } from '@carboncoach/shared';
import { choiceCopy } from './choiceCopy';

interface ChoiceScenarioSelectorProps {
  scenarios: ChoiceScenario[];
  selectedScenarioId: string;
  onScenarioChange: (id: string) => void;
}

export const ChoiceScenarioSelector: React.FC<ChoiceScenarioSelectorProps> = ({
  scenarios,
  selectedScenarioId,
  onScenarioChange,
}) => {
  const options = scenarios.map((scenario) => ({
    value: scenario.id,
    label: scenario.title,
  }));

  return (
    <div style={{ marginBottom: 'var(--spacing-md)' }}>
      <Select
        id="choice-scenario-select"
        label={choiceCopy.selectLabel}
        options={options}
        value={selectedScenarioId}
        onChange={(e) => onScenarioChange(e.target.value)}
      />
    </div>
  );
};
