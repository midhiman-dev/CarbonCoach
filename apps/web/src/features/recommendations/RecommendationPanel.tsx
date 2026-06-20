import React, { useState } from 'react';
import type { CarbonProfile} from '@carboncoach/shared';
import { calculateFootprint } from '@carboncoach/shared';
import { recommendActions, createWeeklyActionPlan } from '@carboncoach/shared';
import { Card, EmptyState, StatusBadge, Button } from '../../components/ui';
import { recommendationCopy } from './recommendationCopy';
import { RecommendationCard } from './RecommendationCard';
import { WeeklyPlanPanel } from './WeeklyPlanPanel';
import { FootprintCoachPanel } from '../coach';
import { formatActionCategory } from './recommendationViewModel';

export interface RecommendationPanelProps {
  profile: CarbonProfile | null;
  onNavigateToProfile: () => void;
  onNavigateToTracker?: () => void;
  trackerProgress?: {
    completed: number;
    total: number;
    percent: number;
  };
}

export const RecommendationPanel: React.FC<RecommendationPanelProps> = ({
  profile,
  onNavigateToProfile,
  onNavigateToTracker,
  trackerProgress = { completed: 0, total: 0, percent: 0 },
}) => {
  if (!profile) {
    return (
      <EmptyState
        title={recommendationCopy.emptyState.title}
        description={recommendationCopy.emptyState.description}
        action={
          <Button onClick={onNavigateToProfile} variant="primary">
            {recommendationCopy.emptyState.buttonText}
          </Button>
        }
      />
    );
  }

  const [showAll, setShowAll] = useState(false);

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

  const topContributorLabel = estimate?.topCategory
    ? `Top focus: ${formatActionCategory(estimate.topCategory)}`
    : '';

  const displayedRecommendations = showAll ? recommendations : recommendations.slice(0, 3);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)' }}>
      {/* Explanation and Preference info */}
      <Card>
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 'var(--spacing-sm)',
          }}
        >
          <p style={{ margin: 0, fontSize: 'var(--font-sm)', color: 'var(--text-secondary)' }}>
            Personalized from your profile and selected priority.
          </p>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--spacing-xs)',
              flexWrap: 'wrap',
            }}
          >
            <StatusBadge variant="info" label={preferenceLabel} />
            {topContributorLabel && <StatusBadge variant="moderate" label={topContributorLabel} />}
          </div>
        </div>
      </Card>

      <div className="grid-responsive" style={{ alignItems: 'start' }}>
        {/* Weekly Plan Panel */}
        <WeeklyPlanPanel
          plan={weeklyPlan}
          onNavigateToTracker={onNavigateToTracker}
          hasTrackerProgress={trackerProgress.completed > 0}
        />

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
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            margin: 'var(--spacing-lg) 0 var(--spacing-sm) 0',
          }}
        >
          <h3
            style={{
              fontSize: 'var(--font-xl)',
              color: 'var(--text-primary)',
              margin: 0,
            }}
          >
            {recommendationCopy.title}
          </h3>
          <span style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)' }}>
            Showing {displayedRecommendations.length} of {recommendations.length}
          </span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
          {displayedRecommendations.map((action, index) => (
            <RecommendationCard key={action.id} action={action} rank={index + 1} />
          ))}
        </div>
        {recommendations.length > 3 && (
          <button
            onClick={() => setShowAll(!showAll)}
            className="btn btn-secondary"
            style={{
              marginTop: 'var(--spacing-md)',
              width: '100%',
              display: 'block',
              cursor: 'pointer',
            }}
          >
            {showAll ? 'Show fewer actions' : 'Show all deterministic actions'}
          </button>
        )}
      </div>
    </div>
  );
};
