import type {
  CoachRequest,
  CoachResponse,
  FootprintCoachContext,
  ChoiceCoachContext,
} from './coachTypes';

export function createFallbackCoachResponse(request: CoachRequest): CoachResponse {
  const tone = request.tone || 'simple';
  const numbersUsedSet = new Set<string>();

  if (request.mode === 'footprint_coach') {
    const ctx = request.context as FootprintCoachContext;
    const total = ctx.monthlyTotalKgCO2e;
    numbersUsedSet.add(total.toString());

    // Category totals
    ctx.categories.forEach((cat) => {
      numbersUsedSet.add(cat.monthlyKgCO2e.toString());
    });

    let summary = '';
    let explanation = '';
    let recommendedNextStep = '';
    const weeklyPlan: string[] = [];

    const topCategoryLabel = ctx.topCategory ? ctx.topCategory : 'your daily activities';

    if (tone === 'encouraging') {
      summary = `Great job taking the first step to understand your footprint! Your estimated carbon footprint is ${total} kg CO2e per month.`;
      explanation = `Currently, ${topCategoryLabel} is your largest contributor. Small, consistent changes in this area can make a positive difference over time.`;
    } else if (tone === 'detailed') {
      summary = `Based on your lifestyle profile, your monthly carbon footprint is estimated to be ${total} kg CO2e.`;

      const breakdown = ctx.categories
        .map((cat) => `${cat.category}: ${cat.monthlyKgCO2e} kg CO2e`)
        .join(', ');
      explanation = `Your top contributor is ${topCategoryLabel}. The breakdown across your categories is: ${breakdown || 'no data available'}.`;
    } else {
      // simple (default)
      summary = `Your estimated monthly carbon footprint is ${total} kg CO2e.`;
      explanation = `Your top carbon contributor is ${topCategoryLabel}. Focusing on this category will offer the best opportunity for reduction.`;
    }

    // Recommended next step
    if (ctx.recommendedActions && ctx.recommendedActions.length > 0) {
      const bestAction = ctx.recommendedActions[0];
      recommendedNextStep = `We suggest starting with this action: "${bestAction.title}". It has a ${bestAction.impactBand} impact level and is well-aligned with your preferences.`;
      if (bestAction.estimatedMonthlyReductionKgCO2e !== undefined) {
        numbersUsedSet.add(bestAction.estimatedMonthlyReductionKgCO2e.toString());
      }

      ctx.recommendedActions.slice(0, 3).forEach((action) => {
        weeklyPlan.push(`Action: ${action.title} (${action.impactBand} impact)`);
        if (action.estimatedMonthlyReductionKgCO2e !== undefined) {
          numbersUsedSet.add(action.estimatedMonthlyReductionKgCO2e.toString());
        }
      });
    } else {
      recommendedNextStep =
        'Review your daily choices to identify small, low-effort adjustments you can make.';
      weeklyPlan.push('Try to walk or cycle instead of driving for short trips.');
      weeklyPlan.push('Consolidate online deliveries to reduce shipping trips.');
    }

    const confidenceNote = `Our confidence in this footprint calculation is ${ctx.confidence}, based on your provided inputs and average regional emission factors.`;
    const disclaimer =
      'Please note that these calculations are approximate and directional. They rely on standard assumptions rather than direct scientific measurements of your personal emissions.';

    return {
      mode: 'footprint_coach',
      summary,
      explanation,
      recommendedNextStep,
      weeklyPlan,
      numbersUsed: Array.from(numbersUsedSet),
      confidenceNote,
      disclaimer,
      source: 'fallback',
    };
  } else {
    // choice_coach
    const ctx = request.context as ChoiceCoachContext;
    const recommendedOption = ctx.options.find((o) => o.id === ctx.recommendedOptionId);
    const recommendedLabel = recommendedOption ? recommendedOption.label : 'the recommended option';

    let summary = '';
    let explanation = '';
    let recommendedNextStep = '';
    const weeklyPlan: string[] = [];

    if (tone === 'encouraging') {
      summary = `Let's look at the options for "${ctx.scenarioTitle}". Every small action counts, and choosing "${recommendedLabel}" is a supportive, positive choice.`;
      explanation = `Selecting "${recommendedLabel}" is a practical way to keep your impact lower while matching your day-to-day needs.`;
    } else if (tone === 'detailed') {
      summary = `Comparing choices for "${ctx.scenarioTitle}" under your preferred style.`;
      const choicesDesc = ctx.options
        .map((o) => `"${o.label}" (${o.impactBand} impact)`)
        .join(', ');
      explanation = `The available choices are: ${choicesDesc}. Selecting "${recommendedLabel}" is recommended because it is the lower-impact option in this scenario.`;
    } else {
      // simple
      summary = `For "${ctx.scenarioTitle}", choosing "${recommendedLabel}" is recommended.`;
      explanation = `This choice aligns with a lower carbon impact band compared to other alternatives.`;
    }

    recommendedNextStep = `Consider selecting "${recommendedLabel}" the next time you face this decision.`;
    weeklyPlan.push(`Practice choosing "${recommendedLabel}" when possible.`);
    weeklyPlan.push('Notice other daily decisions where similar low-impact choices are available.');

    const confidenceNote = 'This advice is based on typical carbon impact bands for these options.';
    const disclaimer =
      'Impact comparisons are directional bands based on average scenarios, not absolute real-time measurements.';

    return {
      mode: 'choice_coach',
      summary,
      explanation,
      recommendedNextStep,
      weeklyPlan,
      numbersUsed: [],
      confidenceNote,
      disclaimer,
      source: 'fallback',
    };
  }
}
