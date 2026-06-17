import React, { useState } from 'react';
import { CarbonProfile } from '@carboncoach/shared';
import { Card, ProgressMeter, Button } from '../../components/ui';
import { useWeeklyTracker } from './trackerViewModel';
import { formatActionCategory } from '../recommendations/recommendationViewModel';

import { WeeklyTrackerState, RankedCarbonAction } from '@carboncoach/shared';

interface WeeklyTrackerProps {
  profile: CarbonProfile | null;
  onNavigateToOnboarding: () => void;
  trackerState?: WeeklyTrackerState | null;
  weeklyPlanActions?: RankedCarbonAction[];
  toggleAction?: (actionId: string) => void;
  resetTracker?: () => void;
  progress?: { completed: number; total: number; percent: number };
}

export const WeeklyTracker: React.FC<WeeklyTrackerProps> = ({
  profile,
  onNavigateToOnboarding,
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

  if (!profile) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
        <Card title="Tracker Inactive">
          <div style={{ textAlign: 'center', padding: 'var(--spacing-xl) 0' }}>
            <p style={{ margin: '0 0 var(--spacing-lg)', color: 'var(--text-secondary)' }}>
              Set up your profile first to create a weekly action tracker.
            </p>
            <Button variant="secondary" onClick={onNavigateToOnboarding}>
              Go to Profile Onboarding
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  const handleReset = () => {
    activeResetTracker();
    setResetAnnouncement('Tracker completion state has been reset for the week.');
    setTimeout(() => setResetAnnouncement(''), 3000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)' }}>
      <Card title={`Current Week: ${activeTrackerState?.weekId || ''}`}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
          <div>
            <p style={{ margin: '0 0 var(--spacing-xs)', color: 'var(--text-secondary)' }}>
              Track a few suggested actions for this week. Progress is stored only in this browser.
            </p>
            {activePlanSummary && (
              <p
                style={{
                  margin: 0,
                  fontSize: 'var(--font-sm)',
                  fontWeight: 600,
                  color: 'var(--color-accent)',
                }}
              >
                Focus: {activePlanSummary}
              </p>
            )}
          </div>

          <div
            style={{
              padding: 'var(--spacing-md)',
              border: '1px solid var(--border-glass)',
              borderRadius: 'var(--radius-sm)',
              background: 'var(--bg-deep-navy)',
            }}
          >
            <ProgressMeter
              value={activeProgress.percent}
              max={100}
              label="Weekly action checklist completion"
            />
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: 'var(--font-xs)',
                color: 'var(--text-muted)',
                marginTop: 'var(--spacing-xs)',
              }}
            >
              <span>
                {activeProgress.completed} of {activeProgress.total} actions completed
              </span>
              <span>{activeProgress.percent}% Completed</span>
            </div>
            {activeProgress.percent === 100 && (
              <p
                style={{
                  margin: 'var(--spacing-xs) 0 0',
                  color: '#4caf50',
                  fontWeight: 600,
                  fontSize: 'var(--font-sm)',
                }}
              >
                Nice progress. Keep going at your own pace.
              </p>
            )}
          </div>

          <fieldset style={{ border: 'none', padding: 0, margin: 0 }}>
            <legend
              className="sr-only"
              style={{
                position: 'absolute',
                width: '1px',
                height: '1px',
                padding: 0,
                margin: '-1px',
                overflow: 'hidden',
                clip: 'rect(0, 0, 0, 0)',
                border: 0,
              }}
            >
              Weekly Checklist Actions
            </legend>
            <ul
              style={{
                listStyle: 'none',
                padding: 0,
                margin: 0,
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--spacing-sm)',
              }}
            >
              {activeWeeklyPlanActions.map((action) => {
                const isCompleted =
                  activeTrackerState?.completedActionIds.includes(action.id) || false;
                return (
                  <li
                    key={action.id}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: 'var(--spacing-md)',
                      padding: 'var(--spacing-sm)',
                      background: 'rgba(255, 255, 255, 0.02)',
                      borderRadius: 'var(--radius-xs)',
                      border: '1px solid var(--border-glass)',
                    }}
                  >
                    <input
                      type="checkbox"
                      id={`action-check-${action.id}`}
                      checked={isCompleted}
                      onChange={() => activeToggleAction(action.id)}
                      style={{
                        marginTop: '4px',
                        cursor: 'pointer',
                        width: '18px',
                        height: '18px',
                      }}
                    />
                    <label
                      htmlFor={`action-check-${action.id}`}
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        cursor: 'pointer',
                        flex: 1,
                      }}
                    >
                      <span
                        style={{
                          fontWeight: 600,
                          textDecoration: isCompleted ? 'line-through' : 'none',
                          color: isCompleted ? 'var(--text-muted)' : 'var(--text-primary)',
                        }}
                      >
                        {action.title}
                      </span>
                      <span
                        style={{
                          fontSize: 'var(--font-xs)',
                          color: 'var(--text-secondary)',
                          marginTop: '2px',
                        }}
                      >
                        {action.reason}
                      </span>
                      <div
                        style={{
                          display: 'flex',
                          gap: 'var(--spacing-sm)',
                          marginTop: 'var(--spacing-xs)',
                        }}
                      >
                        <span
                          style={{
                            fontSize: '10px',
                            padding: '2px 6px',
                            background: 'rgba(255, 255, 255, 0.05)',
                            borderRadius: '4px',
                            color: 'var(--text-muted)',
                          }}
                        >
                          {formatActionCategory(action.category)}
                        </span>
                        <span
                          style={{
                            fontSize: '10px',
                            padding: '2px 6px',
                            background: 'rgba(255, 255, 255, 0.05)',
                            borderRadius: '4px',
                            color: 'var(--text-muted)',
                          }}
                        >
                          Impact: {action.impactBand.toUpperCase()}
                        </span>
                      </div>
                    </label>
                  </li>
                );
              })}
            </ul>
          </fieldset>

          {activeWeeklyPlanActions.length > 0 && (
            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-start',
                marginTop: 'var(--spacing-xs)',
              }}
            >
              <Button variant="secondary" onClick={handleReset} aria-label="Reset tracker progress">
                Reset Progress
              </Button>
            </div>
          )}
        </div>
      </Card>

      <div
        aria-live="polite"
        className="sr-only"
        style={{
          position: 'absolute',
          width: '1px',
          height: '1px',
          padding: 0,
          margin: '-1px',
          overflow: 'hidden',
          clip: 'rect(0, 0, 0, 0)',
          border: 0,
        }}
      >
        {resetAnnouncement}
      </div>
    </div>
  );
};
