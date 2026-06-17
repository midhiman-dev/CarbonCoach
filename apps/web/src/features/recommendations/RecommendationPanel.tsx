import React from 'react';
import { CarbonProfile, calculateFootprint } from '@carboncoach/shared';
import { recommendActions, createWeeklyActionPlan } from '@carboncoach/shared';
import { Card, EmptyState, StatusBadge } from '../../components/ui';
import { recommendationCopy } from './recommendationCopy';
import { RecommendationCard } from './RecommendationCard';
import { WeeklyPlanPanel } from './WeeklyPlanPanel';

export interface RecommendationPanelProps {
  profile: CarbonProfile | null;
  onNavigateToProfile: () => void;
}

export const RecommendationPanel: React.FC<RecommendationPanelProps> = ({
  profile,
  onNavigateToProfile,
}) => {
  if (!profile) {
    return (
      <EmptyState
        title={recommendationCopy.emptyState.title}
        description={recommendationCopy.emptyState.description}
        action={
          <button onClick={onNavigateToProfile} className="btn btn-primary">
            {recommendationCopy.emptyState.buttonText}
          </button>
        }
      />
    );
  }

  const estimate = calculateFootprint(profile);
  const recommendations = recommendActions({
    footprint: estimate,
    preference: profile.preference,
  });

  const weeklyPlan = createWeeklyActionPlan({
    footprint: estimate,
    preference: profile.preference,
  });

  // Map preference value to readable label
  const preferenceLabel =
    recommendationCopy.priorityLabels[profile.preference] || `Priority: ${profile.preference}`;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)' }}>
      {/* Explanation and Preference info */}
      <Card>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
          <p style={{ margin: 0, fontSize: 'var(--font-md)', color: 'var(--text-primary)' }}>
            {recommendationCopy.description}
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
            <StatusBadge variant="info" label={preferenceLabel} />
          </div>
        </div>
      </Card>

      <div className="grid-responsive" style={{ alignItems: 'start' }}>
        {/* Weekly Plan Panel */}
        <WeeklyPlanPanel plan={weeklyPlan} />

        {/* AI Coach Placeholder */}
        <Card title="AI Insights Coach" style={{ height: '100%' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
            <p style={{ margin: 0, color: 'var(--text-secondary)' }}>
              {recommendationCopy.placeholders.aiCoach}
            </p>
            <EmptyState
              title="AI Coach Offline"
              description="Gemini integration is disabled in this step. Visual coach interface will be added in a later task."
            />
          </div>
        </Card>
      </div>

      {/* Ranked Action Recommendations */}
      <div>
        <h3
          style={{
            fontSize: 'var(--font-xl)',
            color: 'var(--text-primary)',
            margin: 'var(--spacing-lg) 0 var(--spacing-sm) 0',
          }}
        >
          {recommendationCopy.title}
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
          {recommendations.map((action, index) => (
            <RecommendationCard key={action.id} action={action} rank={index + 1} />
          ))}
        </div>
      </div>
    </div>
  );
};
