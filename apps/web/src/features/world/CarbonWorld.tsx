import React from 'react';
import { CarbonProfile, WeeklyTrackerState, RankedCarbonAction } from '@carboncoach/shared';
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
}

export const CarbonWorld: React.FC<CarbonWorldProps> = ({
  profile,
  weeklyPlanActions,
  trackerState,
  onNavigateToOnboarding,
  onNavigateToTracker,
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
        <Card>
          <EmptyState
            title="Profile Onboarding Required"
            description="Set up your profile and start your weekly tracker to grow your Carbon World."
            action={<Button onClick={onNavigateToOnboarding}>Go to Profile Onboarding</Button>}
          />
        </Card>
      ) : !hasTracker || !worldState ? (
        <Card>
          <EmptyState
            title="Weekly Actions Needed"
            description="Your profile is set up! Go to the Weekly Tracker to choose some actions and start growing your Carbon World."
            action={<Button onClick={onNavigateToTracker}>Go to Weekly Tracker</Button>}
          />
        </Card>
      ) : (
        <Card>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr',
              gap: 'var(--spacing-lg)',
            }}
          >
            {/* The Visual Stage Scene */}
            <CarbonWorldScene
              stage={worldState.stage}
              progressPercent={worldState.progressPercent}
            />

            {/* Stage description & action statistics */}
            <CarbonWorldStatus state={worldState} />
          </div>
        </Card>
      )}
    </section>
  );
};
