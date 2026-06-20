import type { FootprintEstimate, UserPreference } from '../types/carbon';
import type { RankedCarbonAction } from '../types/actions';
import { getActionCatalog } from './actionCatalog';

export function recommendActions(input: {
  footprint: FootprintEstimate;
  preference: UserPreference;
  limit?: number;
}): RankedCarbonAction[] {
  const { footprint, preference, limit } = input;
  const catalog = getActionCatalog();

  const rankedActions: RankedCarbonAction[] = catalog.map((action) => {
    let score = 0;
    const fitReasons: string[] = [];

    // Category match
    if (footprint.topCategory && action.category === footprint.topCategory) {
      score += 10;
      fitReasons.push('Targets your top contributor category');
    }

    const categoryFootprint = footprint.categories.find((c) => c.category === action.category);
    if (categoryFootprint && categoryFootprint.monthlyKgCO2e > 50) {
      score += 5; // Bonus for categories that are non-trivial
    }

    // Impact band base score
    if (action.impactBand === 'high') {
      score += 8;
    } else if (action.impactBand === 'medium') {
      score += 5;
    } else {
      score += 2;
    }

    // Preference
    if (preference === 'saveMoney') {
      if (action.costEffect === 'savesMoney') {
        score += 15;
        fitReasons.push('Saves money');
      } else if (action.costEffect === 'mayCostMore') {
        score -= 5;
      }
    } else if (preference === 'lowEffort') {
      if (action.effort === 'low') {
        score += 15;
        fitReasons.push('Low effort');
      } else if (action.effort === 'high') {
        score -= 10;
      }
    } else if (preference === 'highestImpact') {
      if (action.impactBand === 'high') {
        score += 15;
        fitReasons.push('High impact');
      } else if (
        action.estimatedMonthlyReductionKgCO2e &&
        action.estimatedMonthlyReductionKgCO2e > 20
      ) {
        score += 10;
        fitReasons.push('Significant measurable reduction');
      }
    } else {
      // balanced
      if (action.effort === 'low' || action.effort === 'medium') {
        score += 5;
      }
      if (action.costEffect === 'savesMoney') {
        score += 5;
      }
    }

    return {
      ...action,
      score,
      fitReasons,
    };
  });

  // Sort: score desc, top category first, impact desc, effort asc, id asc
  rankedActions.sort((a, b) => {
    if (a.score !== b.score) {
      return b.score - a.score;
    }
    const aIsTop = footprint.topCategory && a.category === footprint.topCategory;
    const bIsTop = footprint.topCategory && b.category === footprint.topCategory;
    if (aIsTop && !bIsTop) return -1;
    if (!aIsTop && bIsTop) return 1;

    const impactWeight = { high: 3, medium: 2, low: 1 };
    if (impactWeight[a.impactBand] !== impactWeight[b.impactBand]) {
      return impactWeight[b.impactBand] - impactWeight[a.impactBand];
    }

    const effortWeight = { low: 1, medium: 2, high: 3 };
    if (effortWeight[a.effort] !== effortWeight[b.effort]) {
      return effortWeight[a.effort] - effortWeight[b.effort]; // Ascending effort
    }

    return a.id.localeCompare(b.id);
  });

  if (limit && limit > 0) {
    return rankedActions.slice(0, limit);
  }

  return rankedActions;
}
