---
name: carboncoach-recommendation-engine
description: Use this skill when implementing Task 004 — Recommendation Engine and Weekly Action Ranking for CarbonCoach. This task implements deterministic action catalog, action scoring, preference-aware ranking, and weekly action plan generation using the Task 002 domain model and Task 003 footprint estimate. It must not implement UI, LLM coach contracts, Gemini, Daily Choice Lab, tracker, or deployment.
---

---

# Task 004 — Recommendation Engine and Weekly Action Ranking

## Task Purpose

Implement the deterministic recommendation engine for **CarbonCoach**.

This task converts a calculated `FootprintEstimate` and user preference into a ranked set of practical carbon-reduction actions and a simple weekly action plan.

CarbonCoach’s core rule remains:

```text
Deterministic engines decide.
LLMs explain.
```

The recommendation engine is the source of truth for which actions are suggested, how they are ranked, and what estimated impact bands or deterministic reduction values are attached.

The LLM must never invent recommendations or action impact values.

---

# 1. Required Reading Before Coding

Before making changes, read:

```text
AGENTS.md
implementationplan.md
buildprogresstracker.md
docs/architecture/architecture-overview.md
docs/architecture/llm-safety-design.md
docs/architecture/numeric-invention-guard.md
docs/skills/004-recommendation-engine/SKILLS.md
packages/shared/src/types/carbon.ts
packages/shared/src/carbon/calculator.ts
packages/shared/src/carbon/categoryCalculators.ts
packages/shared/src/carbon/factorRegistry.ts
packages/shared/src/carbon/assumptions.ts
```

If there is a conflict, follow `AGENTS.md`.

---

# 2. Task Scope

## In Scope

Implement deterministic recommendation logic under `packages/shared`.

Create or update files such as:

```text
packages/shared/src/types/actions.ts
packages/shared/src/recommendations/actionCatalog.ts
packages/shared/src/recommendations/recommendationEngine.ts
packages/shared/src/recommendations/weeklyPlan.ts
packages/shared/src/recommendations/recommendationEngine.test.ts
packages/shared/src/recommendations/index.ts
packages/shared/src/index.ts
buildprogresstracker.md
```

The engine must support:

- action catalog,
- action metadata,
- category relevance,
- impact band,
- effort level,
- cost effect,
- estimated monthly reduction where deterministic,
- preference-aware scoring,
- stable ranking,
- weekly plan generation,
- no duplicate recommendations.

## Out of Scope

Do **not** implement:

- UI components,
- onboarding UI,
- footprint summary UI,
- Daily Choice Lab engine,
- Choice Coach,
- Footprint Coach,
- LLM coach contracts,
- Gemini integration,
- Numeric Invention Guard implementation,
- privacy/redaction utilities,
- tracker state,
- Carbon World,
- Cloud Run deployment.

---

# 3. Design Rules

## 3.1 Deterministic recommendation rule

Same input must always produce the same ranked recommendations.

Allowed:

```text
FootprintEstimate
CarbonProfile preference
topCategory
category estimates
action catalog metadata
pure scoring functions
```

Not allowed:

```text
LLM calls
network calls
randomness
date/time-dependent scoring
external API calls
hidden dynamic rules
```

## 3.2 Recommendations must be practical

Actions should feel small and realistic.

Good examples:

```text
Replace two short cab rides per week with metro or bus
Choose one plant-forward meal swap this week
Reduce one delivery by combining orders
Track home energy for one week before changing appliances
Avoid one non-essential short-haul flight when a train is practical
```

Avoid vague actions:

```text
Save the planet
Be sustainable
Reduce everything
Offset your footprint
```

## 3.3 Non-guilt language

Recommendation titles and reasons must be neutral and encouraging.

Avoid:

```text
Stop being wasteful
Your diet is bad
You are polluting too much
```

Prefer:

```text
Try one lower-impact meal swap this week
Combine deliveries when practical
Use metro or bus for two short trips
```

---

# 4. Required Types

Create action-related types.

Recommended file:

```text
packages/shared/src/types/actions.ts
```

Recommended types:

```ts
import type { FootprintCategory, ImpactBand } from './carbon';

export type ActionEffort = 'low' | 'medium' | 'high';

export type CostEffect = 'savesMoney' | 'neutral' | 'mayCostMore';

export type ActionPreference = 'balanced' | 'saveMoney' | 'lowEffort' | 'highestImpact';

export interface CarbonAction {
  id: string;
  title: string;
  category: FootprintCategory;
  impactBand: ImpactBand;
  effort: ActionEffort;
  costEffect: CostEffect;
  estimatedMonthlyReductionKgCO2e?: number;
  reason: string;
  assumptionNote: string;
}

export interface RankedCarbonAction extends CarbonAction {
  score: number;
  fitReasons: string[];
}

export interface WeeklyActionPlan {
  actions: RankedCarbonAction[];
  summary: string;
  assumptionNotes: string[];
}
```

If Task 002 already defines equivalent names, reuse them rather than duplicating.

---

# 5. Action Catalog Requirements

Create a deterministic action catalog.

Recommended file:

```text
packages/shared/src/recommendations/actionCatalog.ts
```

The catalog must include at least two actions for each P0 category:

```text
transport
food
homeEnergy
shopping
flights
```

## 5.1 Transport actions

Examples:

```text
transport.replace_short_car_trips
transport.use_public_transport_twice
transport.walk_cycle_short_trip
```

## 5.2 Food actions

Examples:

```text
food.plant_forward_meal_swap
food.reduce_meat_heavy_meal_once
food.plan_low_impact_weekday_lunch
```

## 5.3 Home energy actions

Examples:

```text
home_energy.track_weekly_usage
home_energy.reduce_ac_runtime
home_energy.switch_off_standby_loads
```

## 5.4 Shopping/delivery actions

Examples:

```text
shopping.combine_deliveries
shopping.repair_or_reuse_one_item
shopping.pause_non_essential_purchase
```

## 5.5 Flights actions

Examples:

```text
flights.consider_train_for_short_trip
flights.combine_travel_purpose
flights.plan_lower_frequency_air_travel
```

## 5.6 Catalog metadata rules

Every action must include:

```text
id
title
category
impactBand
effort
costEffect
reason
assumptionNote
```

Optional:

```text
estimatedMonthlyReductionKgCO2e
```

Use deterministic reduction values only when the estimate is intentionally documented and conservative.

If unsure, use impact bands instead of numeric values.

Do not overclaim exact savings.

---

# 6. Recommendation Engine Requirements

Create a pure scoring engine.

Recommended file:

```text
packages/shared/src/recommendations/recommendationEngine.ts
```

Recommended main function:

```ts
export function recommendActions(input: {
  footprint: FootprintEstimate;
  preference: ActionPreference;
  limit?: number;
}): RankedCarbonAction[];
```

If the existing `CarbonProfile` already has a compatible preference field, support it or map it safely.

## 6.1 Scoring inputs

Scoring should consider:

```text
category relevance
top contributor match
category footprint magnitude
impact band
effort
cost effect
user preference
```

## 6.2 Recommended scoring behavior

Use simple deterministic weights.

Example scoring idea:

```text
base score = 0
+ top category match bonus
+ category footprint magnitude bonus
+ impact band score
+ preference bonus
- effort penalty if preference is lowEffort
+ cost savings bonus if preference is saveMoney
+ high impact bonus if preference is highestImpact
```

The exact numbers can be simple. Keep them readable and tested.

## 6.3 Preference behavior

Preference modes should influence ranking:

### Balanced

Balances impact, effort, and cost.

### Save Money

Prioritizes actions where `costEffect = savesMoney`.

### Low Effort

Prioritizes `effort = low`.

### Highest Impact

Prioritizes `impactBand = high` or numeric reduction where available.

## 6.4 Stable ranking

If two actions have the same score, ordering must be deterministic.

Recommended tie-breakers:

```text
score descending
top category action first
impact band descending
effort ascending
action id ascending
```

---

# 7. Weekly Plan Requirements

Create a weekly plan generator.

Recommended file:

```text
packages/shared/src/recommendations/weeklyPlan.ts
```

Recommended function:

```ts
export function createWeeklyActionPlan(input: {
  footprint: FootprintEstimate;
  preference: ActionPreference;
  maxActions?: number;
}): WeeklyActionPlan;
```

## 7.1 Weekly plan size

Default:

```text
3 actions
```

Do not overwhelm the user.

## 7.2 Weekly plan summary

Summary should be deterministic and short.

Example:

```text
This week, start with transport-focused actions because transport is your top estimated contributor.
```

If no top contributor:

```text
This week, start with low-effort actions to build a simple tracking habit.
```

## 7.3 Weekly plan assumption notes

Include notes from selected actions and general estimate limitations.

Do not duplicate notes excessively.

---

# 8. Numeric Safety Rules

The recommendation engine may include numeric reduction values only when:

- they are defined in the deterministic action catalog,
- they are conservative,
- they are clearly marked as estimated,
- they are included in action metadata,
- they can later be added to LLM allowed numbers.

Do not compute speculative savings in this task unless the logic is deterministic and documented.

If unsure, prefer `impactBand`.

---

# 9. Exports

Update exports so future tasks can import recommendation functions from `@carboncoach/shared`.

Recommended:

```ts
// packages/shared/src/recommendations/index.ts
export * from './actionCatalog';
export * from './recommendationEngine';
export * from './weeklyPlan';

// packages/shared/src/index.ts
export * from './recommendations';
export * from './types/actions';
```

Avoid circular dependencies.

---

# 10. Test Requirements

Add comprehensive tests for recommendation behavior.

Recommended test file:

```text
packages/shared/src/recommendations/recommendationEngine.test.ts
```

Required tests:

```text
returns recommendations for a typical footprint
prioritizes top contributor category
supports balanced preference
supports saveMoney preference
supports lowEffort preference
supports highestImpact preference
does not return duplicate actions
respects limit
returns deterministic ordering
creates weekly plan with default 3 actions
weekly plan includes assumption notes
handles all-zero footprint gracefully
```

Additional useful tests:

```text
transport-heavy profile produces transport-first recommendation
food-heavy profile produces food-first recommendation
high flight footprint surfaces flight action
tie-breaking is stable
estimated reduction values are non-negative
```

---

# 11. Integration With Existing Calculator

Use the `FootprintEstimate` returned by Task 003.

Do not modify calculator behavior unless a type issue requires a small export fix.

If a test needs a footprint, create test fixtures.

Recommended helper in test file:

```ts
const createFootprint = (topCategory: FootprintCategory): FootprintEstimate => ({
  monthlyTotalKgCO2e: ...,
  categories: [...],
  topCategory,
  assumptionNotes: [...],
  confidence: 'medium',
});
```

Do not rely on brittle exact calculator values unless the test is specifically about integration.

---

# 12. Documentation Requirements

This task should not create broad documentation changes.

Allowed updates:

```text
buildprogresstracker.md
packages/shared exports
small comments if needed
```

Do not update README to claim UI or coach features exist.

Do not update submission docs.

---

# 13. Verification Commands

Run from repo root:

```bash
npm run build
npm run typecheck
npm run test
npm run lint
npm run format:check
```

All must pass before marking Task 004 as review-ready.

---

# 14. Acceptance Criteria

Task 004 is successful when:

```text
Action types exist.
Action catalog exists.
At least two actions exist for each P0 category.
Recommendation engine exists.
Preference-aware scoring exists.
Top contributor influences ranking.
No duplicate actions are returned.
Limit is respected.
Weekly plan generator exists.
Weekly plan defaults to a small number of actions.
Assumption notes are included.
Tests cover ranking, preferences, and weekly plan behavior.
Root build/typecheck/test/lint/format checks pass.
No UI is implemented.
No LLM/Gemini/API integration is implemented.
No Daily Choice Lab is implemented.
buildprogresstracker.md is updated.
```

---

# 15. Sad Path / Failure Guidance

## 15.1 Exact scoring complexity

Do not over-engineer scoring.

Keep weights simple and readable.

The goal is deterministic, credible ranking, not perfect carbon science.

## 15.2 Too many numeric estimates

If numeric reductions feel speculative, remove them and use impact bands.

Impact bands are acceptable and often safer.

## 15.3 Calculator creep

Do not change footprint calculation logic unless a type/export problem requires it.

## 15.4 UI creep

Do not add action cards or React components in this task.

## 15.5 LLM creep

Do not create coach prompts or Gemini response contracts in this task.

That belongs to later tasks.

---

# 16. Human Review Checklist

After Antigravity completes Task 004, verify:

```text
No UI was added.
No API/Gemini code was added.
Action catalog is practical and non-guilt-based.
Actions cover all P0 categories.
Scoring is deterministic and readable.
Preference modes clearly affect ranking.
Weekly plan is short and realistic.
Tests cover edge cases.
All verification commands passed.
buildprogresstracker.md was updated.
```

---

# 17. Expected Agent Report Format

At the end of the task, report:

```text
Files changed
- path
- path

What was implemented
- concise summary

What was intentionally not changed
- no UI
- no Daily Choice Lab
- no Gemini/API integration
- no deployment

Verification
- npm run build: pass/fail/not run
- npm run typecheck: pass/fail/not run
- npm run test: pass/fail/not run
- npm run lint: pass/fail/not run
- npm run format:check: pass/fail/not run

Risks / follow-ups
- only real risks
```

---

# 18. Commit Recommendation

After human review, commit with:

```bash
git add .
git commit -m "feat(recommendations): add action ranking engine"
git push origin main
```

Use `main` only. Do not create a feature branch.

---

# 19. Final Instruction

Implement Task 004 only.

Do not begin Task 005 until Task 004 is reviewed and accepted.

The goal is a clean, tested, deterministic recommendation engine that later UI and coach workflows can safely trust.
