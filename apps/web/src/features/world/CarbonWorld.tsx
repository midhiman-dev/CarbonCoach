import React from 'react';
import type { CarbonProfile, WeeklyTrackerState, RankedCarbonAction } from '@carboncoach/shared';
import { useCarbonWorld } from './worldViewModel';
import { CarbonWorldScene } from './CarbonWorldScene';
import { CarbonWorldStatus } from './CarbonWorldStatus';
import { Card } from '../../components/ui/Card';
import { EmptyState } from '../../components/ui/EmptyState';
import { Button } from '../../components/ui/Button';

interface CarbonWorldProps {
  profile: CarbonProfile | null;
  weeklyPlanActions: RankedCarbonAction[];
  trackerState: WeeklyTrackerState | null;
  onNavigateToOnboarding: () => void;
  onNavigateToTracker: () => void;
  onNavigateToRecommendations?: () => void;
}

export const CarbonWorld: React.FC<CarbonWorldProps> = ({
  profile,
  weeklyPlanActions,
  trackerState,
  onNavigateToOnboarding,
  onNavigateToTracker,
  onNavigateToRecommendations,
}) => {
  const { worldState, hasProfile, hasTracker } = useCarbonWorld({
    profile,
    weeklyPlanActions,
    trackerState,
  });

  return (
    <section
      aria-labelledby="carbon-world-title"
      style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}
    >
      <div style={{ marginBottom: 'var(--spacing-md)' }}>
        <h2
          id="carbon-world-title"
          style={{
            fontSize: 'var(--font-size-2xl)',
            fontWeight: 'var(--font-weight-bold)',
            color: 'var(--color-text-primary)',
            margin: '0 0 var(--spacing-xs) 0',
          }}
        >
          Carbon World
        </h2>
        <p
          style={{
            margin: 0,
            color: 'var(--color-text-secondary)',
            fontSize: 'var(--font-size-md)',
          }}
        >
          A lightweight visual reflection of your weekly action progress. It is not a carbon
          accounting result.
        </p>
      </div>

      {!hasProfile ? (
        <EmptyState
          title="Profile Onboarding Required"
          description="Set up your profile to view your Carbon World."
          action={
            <Button onClick={onNavigateToOnboarding} variant="primary">
              Set up your profile
            </Button>
          }
        />
      ) : !hasTracker || !worldState ? (
        <EmptyState
          title="Weekly Actions Needed"
          description="Create a weekly action plan to start tracking progress."
          action={
            <Button onClick={onNavigateToTracker} variant="primary">
              Start weekly tracker
            </Button>
          }
        />
      ) : (
        <Card>
          <div
            className="carbon-world-grid"
            style={{
              display: 'grid',
              gap: 'var(--spacing-lg)',
            }}
          >
            {/* The Visual Stage Scene */}
            <CarbonWorldScene
              stage={worldState.stage}
              progressPercent={worldState.progressPercent}
            />

            {/* Stage description & action statistics */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                height: '100%',
              }}
            >
              <CarbonWorldStatus state={worldState} />

              <div
                style={{
                  display: 'flex',
                  gap: 'var(--spacing-sm)',
                  marginTop: 'var(--spacing-md)',
                }}
              >
                {(() => {
                  const isComplete = worldState.progressPercent === 100;
                  const buttonText = isComplete
                    ? 'Review recommended actions'
                    : 'Return to weekly tracker';
                  const handleButtonClick =
                    isComplete && onNavigateToRecommendations
                      ? onNavigateToRecommendations
                      : onNavigateToTracker;
                  return (
                    <Button onClick={handleButtonClick} variant="primary">
                      {buttonText}
                    </Button>
                  );
                })()}
              </div>
            </div>
          </div>
        </Card>
      )}

      <style>{`
        @media (min-width: 1024px) {
          .carbon-world-grid {
            grid-template-columns: 1.2fr 1fr;
            align-items: center;
          }
        }
        @media (max-width: 1023px) {
          .carbon-world-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </section>
  );
};
