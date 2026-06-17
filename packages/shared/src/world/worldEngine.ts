import type { CarbonWorldStage, CarbonWorldState } from './worldTypes';

export function getCarbonWorldStage(progressPercent: number): CarbonWorldStage {
  const clamped = Math.max(0, Math.min(100, progressPercent));
  if (clamped === 0) {
    return 'seed';
  } else if (clamped <= 33) {
    return 'sprout';
  } else if (clamped <= 66) {
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

  let title = 'Seed of Action';
  let description = 'Your action garden is ready to grow.';
  let encouragement = 'Start tracking your actions to see your Carbon World grow.';

  switch (stage) {
    case 'sprout':
      title = 'Sprouting Choices';
      description = 'Your action garden is starting to grow.';
      encouragement = 'Keep going at your own pace. Every choice counts!';
      break;
    case 'garden':
      title = 'Growing Habits';
      description = 'Your action garden is looking green and vibrant.';
      encouragement = "You're making great progress this week. Nice work!";
      break;
    case 'grove':
      title = 'Thriving Grove';
      description = 'Your action garden has grown into a flourishing grove.';
      encouragement = "Fantastic effort! You've completed most of your weekly actions.";
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
