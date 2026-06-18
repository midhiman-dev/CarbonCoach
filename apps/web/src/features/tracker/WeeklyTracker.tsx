import React, { useState } from 'react';
import { CarbonProfile } from '@carboncoach/shared';
import { Card, ProgressMeter, Button, EmptyState } from '../../components/ui';
import { useWeeklyTracker } from './trackerViewModel';
import { formatActionCategory } from '../recommendations/recommendationViewModel';

import {
  WeeklyTrackerState,
  RankedCarbonAction,
  createCarbonWorldState,
} from '@carboncoach/shared';

function formatWeekId(weekId?: string): string {
  if (!weekId) return '';
  const parts = weekId.split('-');
  if (parts.length !== 3) return weekId;
  const year = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1;
  const day = parseInt(parts[2], 10);
  const date = new Date(year, month, day);

  try {
    const dayStr = date.getDate();
    const monthNames = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];
    const monthStr = monthNames[date.getMonth()];
    const yearStr = date.getFullYear();
    return `Week of ${dayStr} ${monthStr} ${yearStr}`;
  } catch {
    return `Week of ${weekId}`;
  }
}

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
    setTimeout(() => setResetAnnouncement(''), 3000);
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
          <div
            style={{
              padding: 'var(--spacing-md)',
              border: '1px solid var(--border-glass)',
              borderRadius: 'var(--radius-sm)',
              background: 'var(--bg-deep-navy)',
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--spacing-xs)',
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <span
                style={{
                  fontSize: 'var(--font-xs)',
                  color: 'var(--text-muted)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}
              >
                Weekly action progress
              </span>
              <span
                style={{
                  fontSize: 'var(--font-lg)',
                  fontWeight: 700,
                  color: 'var(--text-primary)',
                }}
              >
                {activeProgress.completed} of {activeProgress.total} complete
              </span>
            </div>

            <ProgressMeter
              value={activeProgress.percent}
              max={100}
              label={`Weekly action progress: ${activeProgress.completed} of ${activeProgress.total} planned actions complete.`}
            />

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '2px',
                marginTop: 'var(--spacing-2xs)',
              }}
            >
              <p
                style={{
                  margin: 0,
                  color: isAllComplete ? 'var(--color-primary)' : 'var(--text-primary)',
                  fontWeight: 600,
                  fontSize: 'var(--font-sm)',
                }}
              >
                {isAllComplete
                  ? 'Weekly plan complete'
                  : activeProgress.completed > 0
                    ? 'Action completed'
                    : 'Your next action is ready.'}
              </p>
              <p style={{ margin: 0, fontSize: 'var(--font-xs)', color: 'var(--text-secondary)' }}>
                {isAllComplete
                  ? 'Your Carbon World is ready to explore.'
                  : activeProgress.completed > 0
                    ? 'Nice work — your weekly progress has moved forward.'
                    : 'Get started by checking off your first action below.'}
              </p>
              <p
                style={{
                  margin: '4px 0 0 0',
                  fontSize: 'var(--font-xs)',
                  color: 'var(--text-muted)',
                }}
              >
                Your Carbon World reflects weekly action progress.
              </p>
            </div>
          </div>

          {/* Highlighted Next Action or Complete Banner */}
          <div
            style={{
              padding: 'var(--spacing-md)',
              border: '1px solid var(--color-accent)',
              borderRadius: 'var(--radius-sm)',
              background: 'var(--color-accent-bg)',
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--spacing-sm)',
            }}
          >
            {firstIncompleteAction ? (
              <>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <span
                    style={{
                      fontSize: 'var(--font-xs)',
                      fontWeight: 800,
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      color: 'var(--color-accent)',
                    }}
                  >
                    Next action
                  </span>
                </div>
                <div>
                  <h4
                    style={{
                      margin: '0 0 var(--spacing-2xs)',
                      fontSize: 'var(--font-md)',
                      fontWeight: 700,
                      color: 'var(--text-primary)',
                    }}
                  >
                    {firstIncompleteAction.title}
                  </h4>
                  <div
                    style={{
                      display: 'flex',
                      gap: 'var(--spacing-xs)',
                      alignItems: 'center',
                      marginBottom: 'var(--spacing-xs)',
                      flexWrap: 'wrap',
                    }}
                  >
                    <span
                      style={{
                        fontSize: '10px',
                        padding: '2px 6px',
                        background: 'rgba(255, 255, 255, 0.08)',
                        borderRadius: '4px',
                        color: 'var(--text-secondary)',
                      }}
                    >
                      {formatActionCategory(firstIncompleteAction.category)}
                    </span>
                    <span style={{ color: 'var(--text-muted)', fontSize: '10px' }}>·</span>
                    <span
                      style={{
                        fontSize: '10px',
                        padding: '2px 6px',
                        background: 'rgba(255, 255, 255, 0.08)',
                        borderRadius: '4px',
                        color: 'var(--text-secondary)',
                      }}
                    >
                      {firstIncompleteAction.effort.charAt(0).toUpperCase() +
                        firstIncompleteAction.effort.slice(1)}{' '}
                      effort
                    </span>
                  </div>
                  <p
                    style={{
                      margin: 0,
                      fontSize: 'var(--font-xs)',
                      color: 'var(--text-secondary)',
                      lineHeight: 1.4,
                    }}
                  >
                    {firstIncompleteAction.reason}
                  </p>
                </div>
                <div style={{ marginTop: 'var(--spacing-2xs)' }}>
                  <Button
                    onClick={() => activeToggleAction(firstIncompleteAction.id)}
                    aria-label={`Mark "${firstIncompleteAction.title}" as complete`}
                  >
                    Complete next action
                  </Button>
                </div>
              </>
            ) : (
              <>
                <div>
                  <h4
                    style={{
                      margin: '0 0 var(--spacing-2xs)',
                      fontSize: 'var(--font-md)',
                      fontWeight: 700,
                      color: 'var(--text-primary)',
                    }}
                  >
                    This week is complete
                  </h4>
                  <p
                    style={{
                      margin: 0,
                      fontSize: 'var(--font-xs)',
                      color: 'var(--text-secondary)',
                    }}
                  >
                    Your Carbon World is ready to explore.
                  </p>
                </div>
                {onNavigateToWorld && (
                  <div style={{ marginTop: 'var(--spacing-2xs)' }}>
                    <Button onClick={onNavigateToWorld} aria-label={`View ${worldState.title}`}>
                      View {worldState.title}
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Action Checklist Fieldset */}
          <fieldset style={{ border: 'none', padding: 0, margin: 0 }}>
            <legend className="sr-only">Weekly Checklist Actions</legend>
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
                      background: 'var(--bg-card)',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--border-glass)',
                      opacity: isCompleted ? 0.7 : 1,
                      transition: 'opacity var(--transition-fast)',
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
                        width: '20px',
                        height: '20px',
                        minWidth: '20px',
                        minHeight: '20px',
                      }}
                      aria-label={`Mark "${action.title}" as ${
                        isCompleted ? 'incomplete' : 'complete'
                      }`}
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
                      <div
                        style={{
                          display: 'flex',
                          gap: 'var(--spacing-xs)',
                          alignItems: 'center',
                          marginTop: 'var(--spacing-2xs)',
                          marginBottom: 'var(--spacing-2xs)',
                          flexWrap: 'wrap',
                        }}
                      >
                        <span
                          style={{
                            fontSize: '10px',
                            padding: '2px 6px',
                            background: 'rgba(255, 255, 255, 0.05)',
                            borderRadius: '4px',
                            color: 'var(--text-secondary)',
                          }}
                        >
                          {formatActionCategory(action.category)}
                        </span>
                        <span style={{ color: 'var(--text-muted)', fontSize: '10px' }}>·</span>
                        <span
                          style={{
                            fontSize: '10px',
                            padding: '2px 6px',
                            background: 'rgba(255, 255, 255, 0.05)',
                            borderRadius: '4px',
                            color: 'var(--text-secondary)',
                          }}
                        >
                          {action.effort.charAt(0).toUpperCase() + action.effort.slice(1)} effort
                        </span>
                      </div>
                      <span
                        style={{
                          fontSize: 'var(--font-xs)',
                          color: 'var(--text-muted)',
                          lineHeight: 1.4,
                        }}
                      >
                        {action.reason}
                      </span>
                    </label>
                  </li>
                );
              })}
            </ul>
          </fieldset>

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
