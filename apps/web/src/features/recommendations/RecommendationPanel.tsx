import React from 'react';
import { CarbonProfile, calculateFootprint } from '@carboncoach/shared';
import { recommendActions, createWeeklyActionPlan } from '@carboncoach/shared';
import { Card, EmptyState, StatusBadge } from '../../components/ui';
import { recommendationCopy } from './recommendationCopy';
import { RecommendationCard } from './RecommendationCard';
import { WeeklyPlanPanel } from './WeeklyPlanPanel';
import { FootprintCoachPanel } from '../coach';

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

        {/* AI Coach Panel */}
        <FootprintCoachPanel
          footprint={estimate}
          recommendedActions={recommendations}
          weeklyPlan={weeklyPlan}
          preference={profile.preference}
        />
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
