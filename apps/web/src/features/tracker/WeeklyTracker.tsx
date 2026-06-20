import React, { useState, useEffect, useRef } from 'react';
import type { CarbonProfile } from '@carboncoach/shared';
import { Card, Button, EmptyState } from '../../components/ui';
import { useWeeklyTracker } from './trackerViewModel';

import type {
  WeeklyTrackerState,
  RankedCarbonAction} from '@carboncoach/shared';
import {
  createCarbonWorldState,
} from '@carboncoach/shared';

import { formatWeekId } from './trackerFormatters';
import { WeeklyTrackerProgress } from './WeeklyTrackerProgress';
import { WeeklyTrackerNextAction } from './WeeklyTrackerNextAction';
import { WeeklyTrackerChecklist } from './WeeklyTrackerChecklist';

interface WeeklyTrackerProps {
  profile: CarbonProfile | null;
  onNavigateToOnboarding: () => void;
  onNavigateToWorld?: () => void;
  onNavigateToPrivacy?: () => void;
  trackerState?: WeeklyTrackerState | null;
  weeklyPlanActions?: RankedCarbonAction[];
  toggleAction?: (actionId: string) => void;
  resetTracker?: () => void;
  progress?: { completed: number; total: number; percent: number };
}

export const WeeklyTracker: React.FC<WeeklyTrackerProps> = ({
  profile,
  onNavigateToOnboarding,
  onNavigateToWorld,
  onNavigateToPrivacy,
  trackerState,
  weeklyPlanActions,
  toggleAction,
  resetTracker,
  progress,
}) => {
  const localTracker = useWeeklyTracker(profile);

  const activeTrackerState = trackerState !== undefined ? trackerState : localTracker.trackerState;
  const activeWeeklyPlanActions =
    weeklyPlanActions !== undefined ? weeklyPlanActions : localTracker.weeklyPlanActions;
  const activeToggleAction = toggleAction !== undefined ? toggleAction : localTracker.toggleAction;
  const activeResetTracker = resetTracker !== undefined ? resetTracker : localTracker.resetTracker;
  const activeProgress = progress !== undefined ? progress : localTracker.progress;
  const activePlanSummary = trackerState !== undefined ? '' : localTracker.planSummary;

  const [resetAnnouncement, setResetAnnouncement] = useState('');
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  if (!profile) {
    return (
      <EmptyState
        title="Tracker Inactive"
        description="Set up your profile to view an approximate estimate."
        action={
          <Button variant="primary" onClick={onNavigateToOnboarding}>
            Set up your profile
          </Button>
        }
      />
    );
  }

  const handleReset = () => {
    activeResetTracker();
    setResetAnnouncement('Tracker completion state has been reset for the week.');
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => setResetAnnouncement(''), 3000);
  };

  // Find the first incomplete planned action
  const firstIncompleteAction = activeWeeklyPlanActions.find(
    (action) => !activeTrackerState?.completedActionIds.includes(action.id),
  );

  // Synchronize state with Carbon World engine
  const worldState = createCarbonWorldState({
    completedActions: activeProgress.completed,
    totalActions: activeProgress.total,
  });

  const isAllComplete = activeProgress.percent === 100;
  const ctaText = isAllComplete ? `View ${worldState.title}` : 'See your Carbon World';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)' }}>
      <Card title="This week’s actions">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
          {/* Subheader and Focus Area */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'baseline',
              flexWrap: 'wrap',
              gap: 'var(--spacing-xs)',
            }}
          >
            <span
              style={{
                fontSize: 'var(--font-sm)',
                fontWeight: 600,
                color: 'var(--color-accent)',
              }}
            >
              {formatWeekId(activeTrackerState?.weekId)}
            </span>
            {activePlanSummary && (
              <span style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)' }}>
                Focus: {activePlanSummary}
              </span>
            )}
          </div>

          {/* Progress Section */}
          <WeeklyTrackerProgress
            completed={activeProgress.completed}
            total={activeProgress.total}
            percent={activeProgress.percent}
          />

          {/* Highlighted Next Action or Complete Banner */}
          <WeeklyTrackerNextAction
            firstIncompleteAction={firstIncompleteAction}
            activeToggleAction={activeToggleAction}
            onNavigateToWorld={onNavigateToWorld}
            worldStateTitle={worldState.title}
          />

          {/* Action Checklist Fieldset */}
          <WeeklyTrackerChecklist
            activeWeeklyPlanActions={activeWeeklyPlanActions}
            activeTrackerState={activeTrackerState}
            activeToggleAction={activeToggleAction}
          />

          {/* Action Buttons */}
          {activeWeeklyPlanActions.length > 0 && (
            <div
              style={{
                display: 'flex',
                gap: 'var(--spacing-md)',
                marginTop: 'var(--spacing-xs)',
                flexWrap: 'wrap',
              }}
            >
              <Button variant="secondary" onClick={handleReset} aria-label="Reset tracker progress">
                Reset Progress
              </Button>
              {activeProgress.completed > 0 && !isAllComplete && onNavigateToWorld && (
                <Button onClick={onNavigateToWorld} aria-label={ctaText}>
                  {ctaText}
                </Button>
              )}
            </div>
          )}
        </div>
      </Card>

      {/* Compact Local Data Section */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 'var(--spacing-2xs)',
          padding: 'var(--spacing-md)',
          border: '1px dashed var(--border-glass)',
          borderRadius: 'var(--radius-sm)',
          background: 'rgba(255, 255, 255, 0.01)',
          marginTop: 'var(--spacing-xs)',
          textAlign: 'center',
        }}
      >
        <span style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)' }}>
          Local progress is stored in this browser.
        </span>
        {onNavigateToPrivacy && (
          <button
            onClick={onNavigateToPrivacy}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--color-accent)',
              textDecoration: 'underline',
              cursor: 'pointer',
              padding: '4px var(--spacing-sm)',
              fontSize: 'var(--font-xs)',
              fontWeight: 600,
              fontFamily: 'inherit',
              minHeight: '44px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            aria-label="Manage local data in privacy settings"
          >
            Manage local data
          </button>
        )}
      </div>

      <div aria-live="polite" className="sr-only">
        {resetAnnouncement}
      </div>
    </div>
  );
};
