---
name: carboncoach-coach-contracts
description: Use this skill when implementing Task 006 — Coach Contracts, Fallback Composer, and Numeric Guard Contracts for CarbonCoach. This task creates shared assistant contracts, deterministic fallback coach responses, coach validation helpers, and Numeric Invention Guard utilities/tests. It must not implement Gemini, API routes, UI, Daily Choice Lab, tracker, Carbon World, or deployment.
---

---

# Task 006 — Coach Contracts, Fallback Composer, and Numeric Guard Contracts

## Task Purpose

Implement the shared assistant foundation for **CarbonCoach** before Gemini/API integration begins.

This task creates the contracts and deterministic safety utilities that future backend and frontend tasks will reuse.

CarbonCoach’s core rule remains:

```text
Deterministic engines decide.
LLMs explain.
```

The shared assistant layer must ensure that coach workflows are structured, fallback-safe, and protected from unsupported numeric claims before Gemini is introduced in Task 007.

---

# 1. Required Reading Before Coding

Read:

```text
AGENTS.md
implementationplan.md
buildprogresstracker.md
docs/architecture/architecture-overview.md
docs/architecture/llm-safety-design.md
docs/architecture/numeric-invention-guard.md
docs/skills/006-coach-contracts/SKILLS.md
packages/shared/src/types/carbon.ts
packages/shared/src/types/actions.ts
packages/shared/src/types/privacy.ts
packages/shared/src/privacy/minimizeCoachContext.ts
packages/shared/src/carbon/calculator.ts
packages/shared/src/recommendations/recommendationEngine.ts
packages/shared/src/recommendations/weeklyPlan.ts
```

Follow `AGENTS.md` if there is any conflict.

---

# 2. Task Scope

## In Scope

Create shared assistant utilities under `packages/shared`.

Expected files:

```text
packages/shared/src/assistant/coachTypes.ts
packages/shared/src/assistant/coachValidation.ts
packages/shared/src/assistant/fallbackCoach.ts
packages/shared/src/assistant/numericGuard.ts
packages/shared/src/assistant/fallbackCoach.test.ts
packages/shared/src/assistant/numericGuard.test.ts
packages/shared/src/assistant/coachValidation.test.ts
packages/shared/src/assistant/index.ts
packages/shared/src/index.ts
buildprogresstracker.md
```

Implement:

- coach mode types,
- coach request types,
- coach response types,
- footprint coach context contract,
- choice coach context placeholder contract,
- deterministic fallback composer,
- coach response validation helpers,
- Numeric Invention Guard implementation,
- tests for fallback, validation, and numeric guard,
- exports from `@carboncoach/shared`.

## Out of Scope

Do not implement:

- Gemini provider,
- API routes,
- Express coach endpoint,
- prompt builder for real Gemini call,
- frontend coach UI,
- Daily Choice Lab engine,
- tracker,
- Carbon World,
- deployment,
- localStorage adapter.

---

# 3. Coach Contract Requirements

Create:

```text
packages/shared/src/assistant/coachTypes.ts
```

Required modes:

```ts
export type CoachMode = 'footprint_coach' | 'choice_coach';
```

Required response source:

```ts
export type CoachResponseSource = 'gemini' | 'fallback';
```

Required tone type:

```ts
export type CoachTone = 'simple' | 'detailed' | 'encouraging';
```

Recommended request shape:

```ts
export interface BaseCoachRequest {
  mode: CoachMode;
  tone?: CoachTone;
  allowedNumbers: string[];
}

export interface FootprintCoachRequest extends BaseCoachRequest {
  mode: 'footprint_coach';
  context: FootprintCoachContext;
}

export interface ChoiceCoachRequest extends BaseCoachRequest {
  mode: 'choice_coach';
  context: ChoiceCoachContext;
}

export type CoachRequest = FootprintCoachRequest | ChoiceCoachRequest;
```

Recommended response shape:

```ts
export interface CoachResponse {
  mode: CoachMode;
  summary: string;
  explanation: string;
  recommendedNextStep: string;
  weeklyPlan: string[];
  numbersUsed: string[];
  confidenceNote: string;
  disclaimer: string;
  source: CoachResponseSource;
}
```

---

# 4. Footprint Coach Context

Footprint Coach context should reuse minimized data from Task 005.

Recommended shape:

```ts
export interface FootprintCoachContext {
  monthlyTotalKgCO2e: number;
  topCategory: FootprintCategory | null;
  confidence: ConfidenceLevel;
  categories: Array<{
    category: FootprintCategory;
    monthlyKgCO2e: number;
    confidence: ConfidenceLevel;
  }>;
  recommendedActions: Array<{
    id: string;
    title: string;
    category: FootprintCategory;
    impactBand: ImpactBand;
    effort: ActionEffort;
    costEffect: CostEffect;
    estimatedMonthlyReductionKgCO2e?: number;
    reason: string;
  }>;
  assumptionNotes: string[];
  preference: UserPreference;
}
```

Keep this structure compact and free of raw profile fields.

---

# 5. Choice Coach Context Placeholder

Task 011 will create the full Daily Choice Lab engine later. For Task 006, define only a safe placeholder contract so API/UI code can depend on a stable type.

Recommended shape:

```ts
export interface ChoiceCoachContext {
  scenarioId: string;
  scenarioTitle: string;
  options: Array<{
    id: string;
    label: string;
    impactBand: ImpactBand;
    reasons: string[];
  }>;
  recommendedOptionId: string;
  preference: UserPreference;
  assumptionNotes: string[];
}
```

Do not implement the choice engine in this task.

---

# 6. Coach Validation Requirements

Create:

```text
packages/shared/src/assistant/coachValidation.ts
```

Implement lightweight deterministic validation helpers.

Recommended functions:

```ts
export function isCoachMode(value: unknown): value is CoachMode;

export function validateCoachResponse(response: unknown): {
  isValid: boolean;
  errors: string[];
  value?: CoachResponse;
};

export function collectCoachResponseTextFields(response: CoachResponse): string[];
```

Validation should check:

- required fields exist,
- string fields are non-empty,
- arrays are arrays,
- mode is supported,
- source is `gemini` or `fallback`,
- weeklyPlan contains strings,
- numbersUsed contains strings.

Do not add a schema dependency unless clearly necessary. Keep it simple.

---

# 7. Fallback Coach Requirements

Create:

```text
packages/shared/src/assistant/fallbackCoach.ts
```

Recommended function:

```ts
export function createFallbackCoachResponse(request: CoachRequest): CoachResponse;
```

Fallback must support:

```text
footprint_coach
choice_coach
```

## 7.1 Footprint fallback

Should produce:

- friendly summary,
- explanation using deterministic context,
- recommended next step from provided recommended actions,
- short weekly plan from provided actions,
- confidence note,
- disclaimer,
- `source: 'fallback'`.

It may use deterministic numbers from context.

Every number used must be included in `numbersUsed`.

## 7.2 Choice fallback

Should produce:

- friendly choice summary,
- explanation based on supplied option impact bands,
- recommended next step from `recommendedOptionId`,
- short plan or next-step list,
- confidence note,
- disclaimer,
- `source: 'fallback'`.

It should avoid unsupported numeric claims.

## 7.3 Tone

Tone support may be simple:

- `simple`: shorter wording,
- `detailed`: slightly fuller explanation,
- `encouraging`: warmer wording.

Do not over-engineer.

---

# 8. Numeric Invention Guard Requirements

Create:

```text
packages/shared/src/assistant/numericGuard.ts
```

Implement the Numeric Invention Guard described in:

```text
docs/architecture/numeric-invention-guard.md
```

Required types:

```ts
export interface NumericGuardInput {
  allowedNumbers: string[];
  responseTextFields: string[];
}

export interface NumericGuardResult {
  isValid: boolean;
  unsupportedNumbers: string[];
  generatedNumbers: string[];
  allowedNumbers: string[];
}
```

Required functions:

```ts
export function normalizeNumberToken(token: string): string;

export function extractNumberTokens(text: string): string[];

export function validateGeneratedNumbers(input: NumericGuardInput): NumericGuardResult;
```

## 8.1 Required detection

Detect:

```text
whole numbers
decimals
comma-separated numbers
percentages
simple multipliers like 3x
negative numbers
```

## 8.2 Required behavior

- If response has no numbers, pass.
- If all generated numbers are allowed, pass.
- If any generated number is unsupported, fail.
- Normalize common formats consistently.
- Do not convert written words to numbers in P0.

## 8.3 Recommended normalization

For P0:

```text
12 -> 12
12.0 -> 12
1,200 -> 1200
12% -> 12
3x -> 3
-4 -> -4
```

---

# 9. Tests

## 9.1 Fallback tests

Create:

```text
packages/shared/src/assistant/fallbackCoach.test.ts
```

Must test:

```text
creates footprint fallback response
creates choice fallback response
sets source to fallback
uses matching mode
returns non-empty user-facing fields
uses only allowed deterministic numbers
handles no top category
handles no recommended actions
```

## 9.2 Numeric guard tests

Create:

```text
packages/shared/src/assistant/numericGuard.test.ts
```

Must test:

```text
allowed whole number passes
allowed decimal passes
comma-separated number normalization
percentage normalization
multiplier normalization
unsupported whole number fails
unsupported percentage fails
unsupported multiplier fails
no-number response passes
mixed allowed and unsupported numbers fails
empty allowedNumbers with generated number fails
```

## 9.3 Validation tests

Create:

```text
packages/shared/src/assistant/coachValidation.test.ts
```

Must test:

```text
valid coach response passes
missing fields fail
invalid mode fails
invalid source fails
weeklyPlan must be array
numbersUsed must be array
collectCoachResponseTextFields includes all user-facing text
```

---

# 10. Export Requirements

Create:

```text
packages/shared/src/assistant/index.ts
```

Root export:

```ts
export * from './assistant';
```

Also export coach types from root as needed.

Avoid circular dependencies.

---

# 11. Documentation Requirements

Allowed update:

```text
buildprogresstracker.md
```

Do not update README to claim Gemini/API coach exists yet.

Do not modify architecture docs unless needed for correcting a mismatch.

---

# 12. Verification Commands

Run from repo root:

```bash
npm run build
npm run typecheck
npm run test
npm run lint
npm run format:check
```

All must pass before marking Task 006 as review-ready.

---

# 13. Acceptance Criteria

Task 006 is successful when:

```text
Coach request/response contracts exist.
Footprint coach context contract exists.
Choice coach placeholder contract exists.
Fallback coach composer exists.
Fallback supports both coach modes.
Coach response validation helpers exist.
Numeric Invention Guard exists.
Numeric guard tests pass.
Fallback tests pass.
Validation tests pass.
Exports are updated.
Root build/typecheck/test/lint/format checks pass.
No Gemini/API code was implemented.
No UI was implemented.
No Daily Choice Lab engine was implemented.
No deployment was implemented.
buildprogresstracker.md is updated.
```

---

# 14. Human Review Checklist

Verify:

```text
No Gemini provider or API route was added.
No React/UI code was added.
No choice engine was added.
Fallback responses are non-guilt-based.
Fallback responses are deterministic.
Numeric guard rejects unsupported numbers.
Validation helpers are simple and readable.
Tests cover failure paths.
All gates passed.
```

---

# 15. Expected Agent Report Format

Report:

```text
Files changed

What was implemented

What was intentionally not changed

Verification
- npm run build
- npm run typecheck
- npm run test
- npm run lint
- npm run format:check

Risks / follow-ups
```

---

# 16. Commit Recommendation

After review:

```bash
git add .
git commit -m "feat(coach): add assistant contracts and fallback guard"
git push origin main
```

Use `main` only.

---

# 17. Final Instruction

Implement Task 006 only.

Do not begin Task 007 until Task 006 is reviewed and accepted.

The goal is a small, deterministic, tested assistant contract and safety layer that the Cloud Run Gemini service can safely reuse.
