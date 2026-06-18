import type { CarbonWorldStage, CarbonWorldState } from './worldTypes';

export function getCarbonWorldStage(progressPercent: number): CarbonWorldStage {
  const clamped = Math.max(0, Math.min(100, progressPercent));
  if (clamped === 0) {
    return 'seed';
  } else if (clamped <= 35) {
    return 'sprout';
  } else if (clamped <= 70) {
    return 'garden';
  } else {
    return 'grove';
  }
}

export function createCarbonWorldState(input: {
  completedActions: number;
  totalActions: number;
}): CarbonWorldState {
  const { completedActions, totalActions } = input;

  let progressPercent = 0;
  if (totalActions > 0) {
    // Clamp completedActions to [0, totalActions]
    const clampedCompleted = Math.max(0, Math.min(totalActions, completedActions));
    progressPercent = Math.round((clampedCompleted / totalActions) * 100);
  }

  const stage = getCarbonWorldStage(progressPercent);

  let title = 'Seed / Hazy Patch';
  let description = 'Your action garden is just getting started.';
  let encouragement = 'Start tracking your actions to see your Carbon World grow.';

  switch (stage) {
    case 'sprout':
      title = 'Sprouting Patch';
      description = 'A few low-impact actions are beginning to take root.';
      encouragement = 'Keep going at your own pace. Every choice counts!';
      break;
    case 'garden':
      title = 'Growing Grove';
      description = 'Your action garden is growing steadily.';
      encouragement = "You're making great progress this week. Nice work!";
      break;
    case 'grove':
      title = 'Thriving Grove';
      description = 'Your weekly actions have helped your Carbon World thrive.';
      encouragement = 'Fantastic effort! You have completed all of your weekly actions.';
      break;
  }

  return {
    stage,
    completedActions: totalActions > 0 ? Math.max(0, Math.min(totalActions, completedActions)) : 0,
    totalActions: totalActions > 0 ? totalActions : 0,
    progressPercent,
    title,
    description,
    encouragement,
  };
}
