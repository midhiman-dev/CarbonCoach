import React from 'react';
import type { ChoiceOption } from '@carboncoach/shared';
import { ChoiceOptionCard } from './ChoiceOptionCard';

interface ChoiceComparisonPanelProps {
  options: ChoiceOption[];
  recommendedOptionId: string;
}

export const ChoiceComparisonPanel: React.FC<ChoiceComparisonPanelProps> = ({
  options,
  recommendedOptionId,
}) => {
  return (
    <div
      className="grid-responsive"
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: 'var(--spacing-md)',
        marginBottom: 'var(--spacing-lg)',
      }}
    >
      {options.map((option) => (
        <ChoiceOptionCard
          key={option.id}
          option={option}
          isRecommended={option.id === recommendedOptionId}
        />
      ))}
    </div>
  );
};
