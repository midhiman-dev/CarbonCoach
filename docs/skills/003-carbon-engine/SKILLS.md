---
name: carboncoach-carbon-engine
description: Use this skill when implementing Task 003 — Deterministic Carbon Footprint Engine for CarbonCoach. This task implements the deterministic carbon calculator using the Task 002 domain model and factor registry. It must calculate category estimates, total monthly footprint, top contributor, confidence, and assumption notes with tests. It must not implement recommendations, UI, Gemini, or coach logic.
---

---

# Task 003 — Deterministic Carbon Footprint Engine

## Task Purpose

Implement the deterministic carbon footprint engine for **CarbonCoach**.

This task converts a validated `CarbonProfile` into a transparent `FootprintEstimate` using the emission factor registry created in Task 002.

CarbonCoach’s core rule remains:

```text
Deterministic engines decide.
LLMs explain.
```

This calculator is the source of truth for numeric footprint estimates. Gemini must never calculate or override these values.

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
docs/skills/003-carbon-engine/SKILLS.md
packages/shared/src/types/carbon.ts
packages/shared/src/carbon/factorTypes.ts
packages/shared/src/carbon/factorRegistry.ts
packages/shared/src/carbon/assumptions.ts
```

If there is a conflict, follow `AGENTS.md`.

---

# 2. Task Scope

## In Scope

Implement deterministic footprint calculation under `packages/shared`.

Create or update files such as:

```text
packages/shared/src/carbon/calculator.ts
packages/shared/src/carbon/categoryCalculators.ts
packages/shared/src/carbon/footprintSummary.ts
packages/shared/src/carbon/calculator.test.ts
packages/shared/src/carbon/index.ts
packages/shared/src/index.ts
```

The calculator must produce:

- monthly transport estimate,
- monthly food estimate,
- monthly home energy estimate,
- monthly shopping/delivery estimate,
- monthly flights estimate,
- monthly total estimate,
- top contributor,
- category-level assumption notes,
- overall assumption notes,
- confidence level.

## Out of Scope

Do **not** implement:

- recommendation engine,
- weekly action plan generation,
- privacy/redaction utilities,
- LLM coach contracts,
- Gemini integration,
- Numeric Invention Guard implementation,
- Daily Choice Lab,
- UI components,
- tracker,
- Carbon World,
- Cloud Run deployment.

---

# 3. Source-of-Truth Rules

The calculator must use only deterministic logic and Task 002 factor registry data.

Allowed:

```text
getRequiredFactorById(...)
getFactorById(...)
categoryAssumptionNotes
carbonEstimateDisclaimer
CarbonProfile
FootprintEstimate
CategoryFootprintEstimate
```

Not allowed:

```text
LLM calls
network calls
randomness
current date-based behavior
external API calls
hardcoded hidden factors outside the registry
```

If a new factor is needed, add it to the registry with metadata and tests.

---

# 4. Calculation Requirements

## 4.1 Output shape

The main calculator should return the `FootprintEstimate` type created in Task 002, or a compatible refined type if Task 002 naming differs.

Expected fields:

```ts
interface FootprintEstimate {
  monthlyTotalKgCO2e: number;
  categories: CategoryFootprintEstimate[];
  topCategory: FootprintCategory | null;
  assumptionNotes: string[];
  confidence: ConfidenceLevel;
}
```

Category estimates should include:

```ts
interface CategoryFootprintEstimate {
  category: FootprintCategory;
  monthlyKgCO2e: number;
  confidence: ConfidenceLevel;
  factorIds: string[];
  assumptionNotes: string[];
}
```

## 4.2 Main function

Recommended exported function:

```ts
export function calculateFootprint(profile: CarbonProfile): FootprintEstimate;
```

The function must be pure and deterministic.

Same input must always produce same output.

---

# 5. Category Calculation Rules

## 5.1 Transport

Input fields likely used:

```text
commuteMode
weeklyCommuteKm
```

Expected behavior:

- normalize negative or invalid distance to `0`,
- convert weekly commute distance to monthly estimate,
- use appropriate transport factor by commute mode,
- return `0` if commute mode is `walkCycle` or `workFromHome`,
- handle `mixed` with a documented blended assumption.

Recommended monthly conversion:

```text
monthly commute km = weeklyCommuteKm * 4
```

Keep the conversion simple and documented as an assumption.

Example:

```text
weeklyCommuteKm = 50
monthly = 200
factor = 0.18 kgCO2e/km
transport = 36 kgCO2e/month
```

## 5.2 Food

Input fields likely used:

```text
dietPattern
```

Expected behavior:

- use meal/day or monthly diet pattern assumptions,
- calculate an approximate monthly food footprint,
- use clearly documented assumptions.

Simple P0 approach:

```text
estimated meals per month = 90
monthly food estimate = diet meal factor * 90
```

If 90 meals is used, document it as a demo assumption.

## 5.3 Home Energy

Input fields likely used:

```text
monthlyHomeEnergyKwh
householdSize
```

Expected behavior:

- if `monthlyHomeEnergyKwh` is provided and positive, use it,
- if missing, use a conservative documented default assumption,
- if household size is provided, avoid complex allocation unless already represented in the profile model,
- normalize negative kWh to `0`,
- add assumption note when a default is used.

Recommended P0 default:

```text
default monthly home energy = 120 kWh
```

Only use this if the assumption is documented in code.

## 5.4 Shopping / Delivery

Input fields likely used:

```text
shoppingFrequency
deliveriesPerWeek
```

Expected behavior:

- estimate shopping baseline by frequency,
- add delivery impact based on weekly deliveries,
- convert weekly deliveries to monthly deliveries using `* 4`,
- normalize negative deliveries to `0`.

Shopping frequency may map to starter factors:

```text
low -> shopping.goods.low
medium -> shopping.goods.medium
high -> shopping.goods.high
```

## 5.5 Flights

Input fields likely used:

```text
flightsPerYear
```

Expected behavior:

- normalize negative flight count to `0`,
- convert yearly flights to monthly average,
- use starter flight factor,
- add assumption note that flight estimates vary significantly by route and occupancy.

Recommended P0 approach:

```text
monthly flight estimate = (flightsPerYear * shortHaulFactor) / 12
```

Use the available registry factor. If medium-haul exists but no route detail exists, use short-haul or blended assumption and document it.

---

# 6. Normalization and Safety Rules

The calculator must be resilient to imperfect input.

## 6.1 Numeric normalization

Use helpers where practical:

```ts
function nonNegativeNumber(value: number | undefined, fallback = 0): number;
```

Rules:

- negative values become `0`,
- `undefined` becomes fallback,
- `NaN` becomes fallback,
- `Infinity` becomes fallback.

## 6.2 Rounding

Use consistent rounding for display-ready output.

Recommended:

```text
round kgCO2e values to 1 decimal place or nearest whole number
```

Pick one strategy and test it.

For P0, nearest whole number is acceptable and simpler.

If rounding happens, ensure totals match rounded category values, or document the strategy.

Recommended simple strategy:

```text
Round each category to nearest whole kgCO2e.
Total equals sum of rounded category values.
```

## 6.3 Confidence calculation

Overall confidence can be derived from category confidence values.

Simple P0 strategy:

```text
If any category is low -> overall low
Else if any category is medium -> overall medium
Else high
```

Or use a clear equivalent strategy.

## 6.4 Top contributor

Top contributor is the category with the largest monthly estimate.

Rules:

- if all categories are `0`, topCategory should be `null`,
- ties may return the first highest category in fixed order,
- order should be deterministic.

Recommended fixed order:

```text
transport, food, homeEnergy, shopping, flights
```

---

# 7. Assumption Notes

The output must include assumption notes.

Category notes should include:

- factor assumptions,
- fallback/default assumptions,
- conversion assumptions.

Overall notes should include:

- general estimate disclaimer,
- category assumption notes,
- default value notes where used.

Do not overclaim precision.

Preferred wording:

```text
This is a directional estimate for awareness, not a certified carbon accounting result.
```

---

# 8. Exports

Update exports so later tasks can import calculator functions from `@carboncoach/shared`.

Recommended:

```ts
// packages/shared/src/carbon/index.ts
export * from './calculator';
export * from './categoryCalculators';
export * from './footprintSummary';

// packages/shared/src/index.ts
export * from './carbon';
export * from './types/carbon';
```

Avoid circular dependencies.

---

# 9. Test Requirements

Add comprehensive tests for the carbon engine.

Recommended test file:

```text
packages/shared/src/carbon/calculator.test.ts
```

Required tests:

```text
calculates a typical mixed lifestyle profile
handles zero commute
handles work from home commute
handles walk/cycle commute
uses default home energy when kWh is missing
normalizes negative values
handles high flight usage
calculates deterministic top contributor
returns null top contributor when all categories are zero
includes assumption notes
returns stable result for same input
```

Additional useful tests:

```text
mixed commute uses documented blended factor
shopping frequency changes estimate
deliveries increase shopping estimate
overall confidence is derived predictably
total equals sum of categories
```

---

# 10. Documentation Requirements

This task should not create large docs updates.

Allowed updates:

- `buildprogresstracker.md`
- small assumption note updates if required by calculation logic
- exports/index updates

Do not update README to claim full product functionality yet.

If comments are added in code, keep them concise and useful.

---

# 11. Verification Commands

Run from repo root:

```bash
npm run build
npm run typecheck
npm run test
npm run lint
npm run format:check
```

All must pass before marking Task 003 as review-ready.

---

# 12. Acceptance Criteria

Task 003 is successful when:

```text
calculateFootprint(profile) exists.
Category calculators exist or equivalent focused functions exist.
Transport estimate works.
Food estimate works.
Home energy estimate works.
Shopping/delivery estimate works.
Flights estimate works.
Monthly total is deterministic.
Top contributor is deterministic.
Invalid/negative inputs are safely normalized.
Default assumptions are included when used.
Assumption notes are returned.
Overall confidence is returned.
Calculator tests cover normal and edge cases.
Root build/typecheck/test/lint/format checks pass.
No recommendation engine is implemented.
No UI is implemented.
No Gemini/API integration is implemented.
buildprogresstracker.md is updated.
```

---

# 13. Sad Path / Failure Guidance

## 13.1 Missing factor

If a required factor is missing, fail loudly in tests and implementation using `getRequiredFactorById`.

Do not silently use `0` for missing registry factors.

## 13.2 Unknown profile values

If TypeScript types are strict, unknown values should not occur. Do not add loose runtime handling unless necessary.

## 13.3 Rounding mismatch

If total does not match category sum due to rounding, simplify the strategy.

Recommended:

```text
Round category values first.
Total = sum of rounded categories.
```

## 13.4 Calculator creep into recommendations

Do not rank actions in this task.

A calculator may identify top category only. Action recommendation belongs to Task 004.

## 13.5 Overclaiming

Do not call the result “accurate,” “official,” or “certified.”

Use:

```text
estimated
approximate
directional
demo assumption
```

---

# 14. Human Review Checklist

After Antigravity completes Task 003, verify:

```text
Calculator is pure and deterministic.
All factors come from registry.
No LLM/API/UI code was added.
Negative inputs are handled.
Top category logic is deterministic.
Assumptions are visible in output.
Tests cover edge cases.
All verification commands passed.
buildprogresstracker.md was updated.
```

---

# 15. Expected Agent Report Format

At the end of the task, report:

```text
Files changed
- path
- path

What was implemented
- concise summary

What was intentionally not changed
- no recommendation engine
- no UI
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

# 16. Commit Recommendation

After human review, commit with:

```bash
git add .
git commit -m "feat(carbon): implement deterministic footprint engine"
git push origin main
```

Use `main` only. Do not create a feature branch.

---

# 17. Final Instruction

Implement Task 003 only.

Do not begin Task 004 until Task 003 is reviewed and accepted.

The goal is a clean, tested, deterministic footprint engine that later UI and LLM coach features can safely trust.
