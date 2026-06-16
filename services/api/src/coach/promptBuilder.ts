import type { CoachRequest, FootprintCoachRequest, ChoiceCoachRequest } from '@carboncoach/shared';

const CORE_CONSTRAINTS = `
You are the CarbonCoach AI assistant. Your role is to EXPLAIN calculations and COACH the user on behavioral changes.
You are strictly bounded by the following security and safety rules:
1. USE ONLY the numbers provided in the structured context. Do not invent, extrapolate, or estimate any numbers that are not explicitly present in the input context.
2. DO NOT calculate any new numeric carbon totals, and do not introduce any new emission factors.
3. If a specific number is not present in the allowed numbers list, use qualitative wording, generic trends, or impact bands (e.g. high/medium/low impact).
4. Clearly state that all carbon footprint estimates are approximate.
5. Use a supportive, friendly, and non-judgmental tone. Do not shame, blame, or guilt the user about their choices.
6. You must return a valid JSON object matching the requested schema. Do not output any markdown text or conversational preamble outside of the JSON.
`;

export function buildFootprintCoachPrompt(request: FootprintCoachRequest): string {
  const { context, tone, allowedNumbers } = request;

  return `
${CORE_CONSTRAINTS}

The user's preferred tone is: "${tone || 'simple'}".
Allowed numbers (do not use any numbers not in this list): ${JSON.stringify(allowedNumbers)}

Structured Footprint Context:
- Monthly Total Footprint (kg CO2e): ${context.monthlyTotalKgCO2e}
- Top Contributor Category: ${context.topCategory || 'None'}
- Confidence Level: ${context.confidence}
- Category Breakdown:
${context.categories.map((c) => `  * ${c.category}: ${c.monthlyKgCO2e} kg CO2e (Confidence: ${c.confidence})`).join('\n')}
- Recommended Actions:
${context.recommendedActions.map((a) => `  * Action: "${a.title}" (ID: ${a.id}, Category: ${a.category}, Impact Band: ${a.impactBand}, Effort: ${a.effort}, Cost Effect: ${a.costEffect}, Reason: ${a.reason}${a.estimatedMonthlyReductionKgCO2e !== undefined ? `, Estimated Reduction: ${a.estimatedMonthlyReductionKgCO2e} kg CO2e` : ''})`).join('\n')}
- Assumption Notes:
${context.assumptionNotes.map((note) => `  * ${note}`).join('\n')}
- Preference Profile: ${context.preference}

Output Schema:
You must output a single JSON object with the following keys. All values must be strings or arrays of strings:
- "mode": Must be exactly "footprint_coach".
- "summary": A concise summary of the footprint (must be friendly and non-judgmental).
- "explanation": Explain why the top contributor is what it is, and detail the breakdown.
- "recommendedNextStep": Suggest the best next action based on the recommended actions.
- "weeklyPlan": An array of 1 to 3 action steps (strings) based on the recommended actions.
- "numbersUsed": An array of all numbers as strings that you explicitly mentioned in your summary, explanation, or recommendedNextStep. Every number in this array MUST exist in the Allowed Numbers list.
- "confidenceNote": A note explaining the confidence in this calculation.
- "disclaimer": A disclaimer explaining that these estimates are approximate and based on standard assumptions.
- "source": Must be exactly "gemini".

JSON Output:
`;
}

export function buildChoiceCoachPrompt(request: ChoiceCoachRequest): string {
  const { context, tone, allowedNumbers } = request;

  return `
${CORE_CONSTRAINTS}

The user's preferred tone is: "${tone || 'simple'}".
Allowed numbers (do not use any numbers not in this list): ${JSON.stringify(allowedNumbers)}

Structured Choice Scenario Context:
- Scenario Title: "${context.scenarioTitle}"
- Scenario ID: "${context.scenarioId}"
- Option Details:
${context.options.map((o) => `  * Option ID: "${o.id}", Label: "${o.label}", Impact Band: "${o.impactBand}", Reasons: ${JSON.stringify(o.reasons)}`).join('\n')}
- Recommended Option ID: "${context.recommendedOptionId}"
- User Preference Mode: "${context.preference}"
- Assumption Notes:
${context.assumptionNotes.map((note) => `  * ${note}`).join('\n')}

Output Schema:
You must output a single JSON object with the following keys. All values must be strings or arrays of strings:
- "mode": Must be exactly "choice_coach".
- "summary": Summarize the decision scenario and which choice is recommended.
- "explanation": Explain why the recommended option has a lower impact compared to other options.
- "recommendedNextStep": Suggest a practical next action when the user encounters this scenario.
- "weeklyPlan": An array of 1 to 3 action steps (strings) representing low-impact practices.
- "numbersUsed": An array of all numbers as strings that you explicitly mentioned. Every number in this array MUST exist in the Allowed Numbers list. Since choice scenarios generally use impact bands instead of precise calculations, this array will likely be empty.
- "confidenceNote": A note explaining the confidence/relevance of this choice coaching.
- "disclaimer": A disclaimer explaining that impact bands are directional and approximate.
- "source": Must be exactly "gemini".

JSON Output:
`;
}

export function buildCoachPrompt(request: CoachRequest): string {
  if (request.mode === 'footprint_coach') {
    return buildFootprintCoachPrompt(request);
  } else if (request.mode === 'choice_coach') {
    return buildChoiceCoachPrompt(request);
  } else {
    throw new Error(`Unsupported coach mode: ${(request as unknown as { mode: string }).mode}`);
  }
}
