import React, { useState } from 'react';
import { Card, SectionHeader, EmptyState, Button } from '../../components/ui';
import type { CarbonProfile } from '@carboncoach/shared';
import { getChoiceScenarios, compareChoiceScenario } from '@carboncoach/shared';
import { ChoiceScenarioSelector } from './ChoiceScenarioSelector';
import { ChoiceComparisonPanel } from './ChoiceComparisonPanel';
import { choiceCopy } from './choiceCopy';
import { formatCategoryLabel } from './choiceViewModel';
import { ChoiceCoachPanel } from '../coach';

interface DailyChoiceLabProps {
  profile: CarbonProfile | null;
  onNavigateToProfile?: () => void;
}

export const DailyChoiceLab: React.FC<DailyChoiceLabProps> = ({ profile, onNavigateToProfile }) => {
  const scenarios = getChoiceScenarios();
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>(scenarios[0]?.id || '');

  if (!profile) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)' }}>
        <SectionHeader title={choiceCopy.title} subtitle={choiceCopy.description} />
        <EmptyState
          title="Profile Onboarding Required"
          description="Set up your profile to compare choices with your coaching preference."
          action={
            onNavigateToProfile ? (
              <Button onClick={onNavigateToProfile} variant="primary">
                Set up your profile
              </Button>
            ) : undefined
          }
        />
      </div>
    );
  }

  if (scenarios.length === 0) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)' }}>
        <SectionHeader title={choiceCopy.title} subtitle={choiceCopy.description} />
        <EmptyState title={choiceCopy.emptyStateTitle} description={choiceCopy.emptyStateText} />
      </div>
    );
  }

  const selectedScenario = scenarios.find((s) => s.id === selectedScenarioId) || scenarios[0];
  const comparison = compareChoiceScenario(selectedScenario.id, profile.preference);

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

        {/* Interactive Choice Coach Panel */}
        <ChoiceCoachPanel scenario={selectedScenario} preference={profile?.preference} />
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
