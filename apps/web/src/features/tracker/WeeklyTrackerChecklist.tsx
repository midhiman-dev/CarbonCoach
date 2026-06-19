import React from 'react';
import { RankedCarbonAction, WeeklyTrackerState } from '@carboncoach/shared';
import { formatActionCategory } from '../recommendations/recommendationViewModel';

interface WeeklyTrackerChecklistProps {
  activeWeeklyPlanActions: RankedCarbonAction[];
  activeTrackerState: WeeklyTrackerState | null | undefined;
  activeToggleAction: (actionId: string) => void;
}

export const WeeklyTrackerChecklist: React.FC<WeeklyTrackerChecklistProps> = ({
  activeWeeklyPlanActions,
  activeTrackerState,
  activeToggleAction,
}) => {
  return (
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
          const isCompleted = activeTrackerState?.completedActionIds.includes(action.id) || false;
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
  );
};
