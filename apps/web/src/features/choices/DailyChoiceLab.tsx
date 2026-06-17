import React, { useState } from 'react';
import { Card, SectionHeader, EmptyState } from '../../components/ui';
import { getChoiceScenarios, compareChoiceScenario, CarbonProfile } from '@carboncoach/shared';
import { ChoiceScenarioSelector } from './ChoiceScenarioSelector';
import { ChoiceComparisonPanel } from './ChoiceComparisonPanel';
import { choiceCopy } from './choiceCopy';
import { formatCategoryLabel } from './choiceViewModel';

interface DailyChoiceLabProps {
  profile: CarbonProfile | null;
}

export const DailyChoiceLab: React.FC<DailyChoiceLabProps> = ({ profile }) => {
  const scenarios = getChoiceScenarios();
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>(scenarios[0]?.id || '');

  if (scenarios.length === 0) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)' }}>
        <SectionHeader title={choiceCopy.title} subtitle={choiceCopy.description} />
        <EmptyState title={choiceCopy.emptyStateTitle} description={choiceCopy.emptyStateText} />
      </div>
    );
  }

  const selectedScenario = scenarios.find((s) => s.id === selectedScenarioId) || scenarios[0];
  const comparison = compareChoiceScenario(selectedScenario.id, profile?.preference);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)' }}>
      <SectionHeader title={choiceCopy.title} subtitle={choiceCopy.description} />

      <div
        className="grid-responsive"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: 'var(--spacing-md)',
        }}
      >
        <Card title="Select Scenario">
          <ChoiceScenarioSelector
            scenarios={scenarios}
            selectedScenarioId={selectedScenarioId}
            onScenarioChange={setSelectedScenarioId}
          />
          <div style={{ marginTop: 'var(--spacing-md)' }}>
            <span
              style={{
                fontSize: 'var(--font-xs)',
                fontWeight: 600,
                textTransform: 'uppercase',
                color: 'var(--color-accent)',
                display: 'inline-block',
                marginBottom: 'var(--spacing-xxs)',
              }}
            >
              Category: {formatCategoryLabel(selectedScenario.category)}
            </span>
            <p style={{ margin: 0, fontSize: 'var(--font-sm)', color: 'var(--text-secondary)' }}>
              {selectedScenario.description}
            </p>
          </div>
        </Card>

        {/* Choice Coach Placeholder Card */}
        <Card title={choiceCopy.placeholderCoachTitle}>
          <p style={{ margin: 0, fontSize: 'var(--font-sm)', color: 'var(--text-secondary)' }}>
            {choiceCopy.placeholderCoachText}
          </p>
          <div
            style={{
              marginTop: 'var(--spacing-md)',
              padding: 'var(--spacing-sm)',
              borderRadius: 'var(--radius-sm)',
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1px dashed var(--border-glass)',
              fontSize: 'var(--font-xs)',
              color: 'var(--text-muted)',
            }}
          >
            <strong>Note:</strong> Safe boundaries are active. The choice coach endpoint is not
            called during this foundational stage.
          </div>
        </Card>
      </div>

      <div style={{ marginTop: 'var(--spacing-md)' }}>
        <h3
          style={{ fontSize: 'var(--font-lg)', fontWeight: 700, marginBottom: 'var(--spacing-sm)' }}
        >
          {choiceCopy.comparisonTitle}
        </h3>
        <ChoiceComparisonPanel
          options={selectedScenario.options}
          recommendedOptionId={selectedScenario.recommendedOptionId}
        />
      </div>

      <div
        className="grid-responsive"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: 'var(--spacing-md)',
        }}
      >
        <Card title="Deterministic Recommendation">
          <p style={{ margin: 0, fontSize: 'var(--font-sm)', lineHeight: '1.6' }}>
            {comparison.explanation}
          </p>
        </Card>

        <Card title={choiceCopy.assumptionTitle}>
          <p
            style={{
              margin: 0,
              fontSize: 'var(--font-sm)',
              color: 'var(--text-secondary)',
              lineHeight: '1.6',
            }}
          >
            {selectedScenario.assumptionNote}
          </p>
        </Card>
      </div>
    </div>
  );
};
export default DailyChoiceLab;
