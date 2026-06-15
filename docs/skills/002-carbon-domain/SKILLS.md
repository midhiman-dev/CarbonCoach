---
name: carboncoach-carbon-domain
description: Use this skill when implementing Task 002 — Shared Carbon Domain Model and Factor Registry for CarbonCoach. This task creates the shared carbon domain types, emission factor registry, assumptions metadata, and baseline registry integrity tests. It must not implement the full calculator engine or UI.
---

---

# Task 002 — Shared Carbon Domain Model and Factor Registry

## Task Purpose

Create the shared carbon domain model and emission factor registry for **CarbonCoach**.

This task establishes the deterministic data foundation used by later carbon calculations, recommendations, assumptions display, LLM coach context, and documentation.

CarbonCoach’s core rule remains:

```text
Deterministic engines decide.
LLMs explain.
```

This task does **not** implement the carbon calculator. It creates the type system and registry that the calculator will use in Task 003.

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
docs/skills/002-carbon-domain/SKILLS.md
```

If there is any conflict, follow `AGENTS.md`.

---

# 2. Task Scope

## In Scope

Implement shared domain foundations under `packages/shared`.

Create or update:

```text
packages/shared/src/types/carbon.ts
packages/shared/src/carbon/factorTypes.ts
packages/shared/src/carbon/factorRegistry.ts
packages/shared/src/carbon/assumptions.ts
packages/shared/src/carbon/index.ts
packages/shared/src/index.ts
packages/shared/src/carbon/factorRegistry.test.ts
```

Add deterministic domain contracts for:

- carbon profile inputs,
- footprint categories,
- factor units,
- factor confidence,
- emission factor metadata,
- assumption notes,
- impact bands,
- footprint estimate shape,
- category estimate shape.

Add an initial emission factor registry with transparent assumptions.

Add tests that verify registry integrity.

Update `buildprogresstracker.md` for Task 002.

## Out of Scope

Do **not** implement:

- full footprint calculation,
- category calculators,
- recommendation ranking,
- weekly action plan logic,
- Daily Choice Lab,
- Choice Coach,
- Footprint Coach,
- Gemini integration,
- UI components,
- Cloud Run deployment,
- persistence,
- database,
- authentication.

---

# 3. Domain Design Requirements

## 3.1 Footprint Categories

Define the core footprint categories as a strict union or equivalent type.

Required P0 categories:

```text
transport
food
homeEnergy
shopping
flights
```

Use user-facing labels separately from internal IDs.

Recommended type:

```ts
export type FootprintCategory = 'transport' | 'food' | 'homeEnergy' | 'shopping' | 'flights';
```

## 3.2 Impact Bands

Define impact bands for directional estimates.

Required bands:

```text
low
medium
high
```

Recommended type:

```ts
export type ImpactBand = 'low' | 'medium' | 'high';
```

## 3.3 Confidence Levels

Define confidence levels for factor and estimate transparency.

Recommended:

```ts
export type ConfidenceLevel = 'low' | 'medium' | 'high';
```

Most P0 demo estimates will likely be `medium` or `low`, unless a factor is well documented.

## 3.4 Factor Units

Define explicit unit types.

Examples:

```text
kgCO2e_per_km
kgCO2e_per_kwh
kgCO2e_per_meal
kgCO2e_per_delivery
kgCO2e_per_flight
kgCO2e_per_month
```

Use a strict union if practical.

## 3.5 Emission Factor Contract

Each emission factor must include enough metadata to be explainable.

Recommended interface:

```ts
export interface EmissionFactor {
  id: string;
  category: FootprintCategory;
  label: string;
  value: number;
  unit: EmissionFactorUnit;
  confidence: ConfidenceLevel;
  sourceType: 'demo_assumption' | 'documented_reference';
  sourceLabel: string;
  version: string;
  assumptionNote: string;
}
```

For P0, it is acceptable to use demo assumptions if clearly labelled.

## 3.6 Carbon Profile Contract

Define a lightweight profile shape for later calculator use.

Recommended fields:

```ts
export type CommuteMode =
  | 'car'
  | 'twoWheeler'
  | 'bus'
  | 'metro'
  | 'walkCycle'
  | 'workFromHome'
  | 'mixed';

export type DietPattern = 'mostlyVegetarian' | 'mixed' | 'meatHeavy' | 'vegan';

export type UserPreference = 'balanced' | 'saveMoney' | 'lowEffort' | 'highestImpact';

export interface CarbonProfile {
  commuteMode: CommuteMode;
  weeklyCommuteKm: number;
  dietPattern: DietPattern;
  monthlyHomeEnergyKwh?: number;
  shoppingFrequency: 'low' | 'medium' | 'high';
  deliveriesPerWeek: number;
  flightsPerYear: number;
  householdSize?: number;
  preference: UserPreference;
}
```

Adjust names if needed, but keep the model simple and privacy-safe.

## 3.7 Estimate Contracts

Define output types for future calculation tasks.

Recommended:

```ts
export interface CategoryFootprintEstimate {
  category: FootprintCategory;
  monthlyKgCO2e: number;
  confidence: ConfidenceLevel;
  factorIds: string[];
  assumptionNotes: string[];
}

export interface FootprintEstimate {
  monthlyTotalKgCO2e: number;
  categories: CategoryFootprintEstimate[];
  topCategory: FootprintCategory | null;
  assumptionNotes: string[];
  confidence: ConfidenceLevel;
}
```

Task 002 only defines these types. Task 003 will calculate them.

---

# 4. Factor Registry Requirements

## 4.1 Registry Contents

Create an initial registry covering at least:

### Transport

Suggested factor IDs:

```text
transport.car.km
transport.two_wheeler.km
transport.bus.km
transport.metro.km
```

### Food

Suggested factor IDs:

```text
food.vegetarian.meal
food.mixed.meal
food.meat_heavy.meal
food.vegan.meal
```

### Home Energy

Suggested factor ID:

```text
home_energy.electricity.kwh
```

### Shopping / Delivery

Suggested factor IDs:

```text
shopping.delivery.single
shopping.goods.low
shopping.goods.medium
shopping.goods.high
```

### Flights

Suggested factor IDs:

```text
flights.short_haul.one_way
flights.medium_haul.one_way
```

These are starter IDs. Implementation may adjust naming, but IDs must be stable and readable.

## 4.2 Factor Values

Use reasonable starter/demo values and mark them clearly as assumptions.

Important:

- Do not overclaim scientific precision.
- Do not pretend demo factors are official.
- Use rounded values.
- Keep the values easy to inspect and test.
- Add assumption notes.

Example:

```ts
{
  id: 'transport.car.km',
  category: 'transport',
  label: 'Car travel',
  value: 0.18,
  unit: 'kgCO2e_per_km',
  confidence: 'medium',
  sourceType: 'demo_assumption',
  sourceLabel: 'CarbonCoach demo factor registry',
  version: '2026-06-p0',
  assumptionNote: 'Directional demo estimate for petrol/diesel car travel. Actual emissions vary by vehicle, occupancy, fuel, and traffic.'
}
```

## 4.3 Registry Helpers

Add helper functions such as:

```ts
getEmissionFactors(): EmissionFactor[]
getFactorsByCategory(category: FootprintCategory): EmissionFactor[]
getFactorById(id: string): EmissionFactor | undefined
getRequiredFactorById(id: string): EmissionFactor
```

`getRequiredFactorById` should throw a clear error if missing, or you may choose a Result-style approach if consistent with the repo.

Keep helpers pure and deterministic.

## 4.4 Registry Integrity Rules

The registry must satisfy:

- no duplicate factor IDs,
- every factor has a valid category,
- every factor has a positive numeric value,
- every factor has a unit,
- every factor has a confidence level,
- every factor has an assumption note,
- every P0 category has at least one factor.

---

# 5. Assumption Metadata Requirements

Create assumption metadata that can later be displayed in UI and docs.

Recommended file:

```text
packages/shared/src/carbon/assumptions.ts
```

It should expose:

```ts
export const carbonEstimateDisclaimer = '...';

export const categoryAssumptionNotes = {
  transport: '...',
  food: '...',
  homeEnergy: '...',
  shopping: '...',
  flights: '...',
} satisfies Record<FootprintCategory, string>;
```

Guidance:

- Use plain language.
- Say estimates are approximate.
- Mention values vary by geography, provider, lifestyle, and source.
- Do not claim exact carbon accounting.

---

# 6. Export Requirements

Update package exports so future tasks can import from `@carboncoach/shared`.

Recommended:

```ts
// packages/shared/src/carbon/index.ts
export * from './factorTypes';
export * from './factorRegistry';
export * from './assumptions';

// packages/shared/src/types/index.ts if created
export * from './carbon';

// packages/shared/src/index.ts
export * from './carbon';
export * from './types/carbon';
```

Keep exports clear. Avoid circular dependencies.

---

# 7. Test Requirements

Add tests for factor registry integrity.

Recommended test file:

```text
packages/shared/src/carbon/factorRegistry.test.ts
```

Tests must verify:

```text
registry is not empty
all factors have unique IDs
all factors have positive values
all factors have assumption notes
all P0 categories have at least one factor
getFactorsByCategory returns only matching category factors
getFactorById returns expected factor
getRequiredFactorById throws for missing factor
```

If exact factor IDs differ, adjust tests to match implementation.

---

# 8. Documentation Requirements

This task usually does not need large docs changes, but if docs are touched:

- keep them truthful,
- say factors are starter/demo assumptions unless source-backed,
- do not add detailed calculation claims,
- do not claim the calculator exists yet unless Task 003 is done.

Update `buildprogresstracker.md` for Task 002.

---

# 9. Verification Commands

After implementation, run from the repo root:

```bash
npm run build
npm run typecheck
npm run test
npm run lint
npm run format:check
```

If any command fails, fix within Task 002 scope and rerun.

Do not mark Task 002 complete unless all required gates pass.

---

# 10. Acceptance Criteria

Task 002 is successful when:

```text
Carbon domain types exist.
P0 footprint categories are defined.
Impact bands are defined.
Confidence levels are defined.
Emission factor type is defined.
Carbon profile type is defined.
Footprint estimate output types are defined.
Initial factor registry exists.
Registry helpers exist.
Assumption metadata exists.
Registry integrity tests pass.
Root build/typecheck/test/lint/format checks pass.
No calculator engine is implemented.
No UI is implemented.
No Gemini/API integration is implemented.
buildprogresstracker.md is updated.
```

---

# 11. Sad Path / Failure Guidance

## 11.1 Factor value uncertainty

If unsure about exact carbon values, use conservative rounded demo assumptions and clearly label them as demo assumptions.

Do not search the web unless explicitly asked. This task does not require current real factor research.

## 11.2 Type over-engineering

Do not build a complex carbon science model in Task 002.

Keep contracts simple and extensible.

## 11.3 Calculator creep

Do not add functions like:

```text
calculateFootprint
calculateTransportFootprint
calculateFoodFootprint
```

Those belong to Task 003.

## 11.4 UI creep

Do not create assumption pages or display components in this task.

Those come later.

---

# 12. Human Review Checklist

After Antigravity completes Task 002, verify:

```text
No product feature UI was added.
No calculator logic was added.
Types are readable and strict.
Factor registry is transparent.
Assumption notes are clear.
Tests cover registry integrity.
No overclaiming in comments/docs.
All verification commands passed.
buildprogresstracker.md was updated.
```

---

# 13. Expected Agent Report Format

At the end of the task, report:

```text
Files changed
- path
- path

What was implemented
- concise summary

What was intentionally not changed
- no calculator engine
- no UI
- no Gemini integration
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

# 14. Commit Recommendation

After human review, commit with:

```bash
git add .
git commit -m "feat(carbon): add domain model and factor registry"
git push origin main
```

Use `main` only. Do not create a feature branch.

---

# 15. Final Instruction

Implement Task 002 only.

Do not begin Task 003 until Task 002 is reviewed and accepted.

The goal of this task is to create a clean, tested, transparent carbon domain foundation that future deterministic engines can safely use.
