import type { WeeklyTrackerState } from './trackerTypes';

export function createCurrentWeekId(date?: Date): string {
  const d = date ? new Date(date.getTime()) : new Date();
  // Find Monday of this week
  const day = d.getDay();
  // If Sunday (0), go back 6 days. If Mon (1), diff = 0. Otherwise go back (day - 1) days.
  const diff = day === 0 ? -6 : 1 - day;

  const monday = new Date(d.getTime());
  monday.setDate(d.getDate() + diff);

  const yyyy = monday.getFullYear();
  const mm = String(monday.getMonth() + 1).padStart(2, '0');
  const dd = String(monday.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

export function createInitialWeeklyTrackerState(weekId?: string): WeeklyTrackerState {
  return {
    version: 1,
    weekId: weekId || createCurrentWeekId(),
    completedActionIds: [],
    updatedAtIso: new Date().toISOString(),
  };
}

export function toggleTrackedAction(
  state: WeeklyTrackerState,
  actionId: string,
): WeeklyTrackerState {
  const isCompleted = state.completedActionIds.includes(actionId);
  const completedActionIds = isCompleted
    ? state.completedActionIds.filter((id) => id !== actionId)
    : [...state.completedActionIds, actionId];
  return {
    ...state,
    completedActionIds,
    updatedAtIso: new Date().toISOString(),
  };
}

export function isActionCompleted(state: WeeklyTrackerState, actionId: string): boolean {
  return state.completedActionIds.includes(actionId);
}

export function calculateTrackerProgress(
  state: WeeklyTrackerState,
  actionIds: string[],
): {
  completed: number;
  total: number;
  percent: number;
} {
  const total = actionIds.length;
  if (total === 0) {
    return { completed: 0, total: 0, percent: 0 };
  }
  const completed = actionIds.filter((id) => state.completedActionIds.includes(id)).length;
  const percent = Math.round((completed / total) * 100);
  return { completed, total, percent };
}
