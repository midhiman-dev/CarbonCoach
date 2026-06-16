---

name: carboncoach-privacy-layer
description: Use this skill when implementing Task 005 — Privacy, Redaction, and Local Data Safety Utilities for CarbonCoach. This task creates shared privacy utilities for redaction, coach-context minimization, local data policy metadata, and tests. It must not implement UI, Gemini, coach contracts, API endpoints, tracker, or deployment.
----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

# Task 005 — Privacy, Redaction, and Local Data Safety Utilities

## Task Purpose

Implement the shared privacy foundation for **CarbonCoach** before LLM coach contracts and Gemini integration are added.

This task ensures that future coach workflows can send only minimized, structured, privacy-safe context to the backend and LLM.

CarbonCoach is local-first for P0. User lifestyle data should remain local unless a user explicitly triggers a coach request, and even then only minimized structured context should be sent.

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
docs/skills/005-privacy-layer/SKILLS.md
packages/shared/src/types/carbon.ts
packages/shared/src/types/actions.ts
packages/shared/src/carbon/calculator.ts
packages/shared/src/recommendations/recommendationEngine.ts
packages/shared/src/recommendations/weeklyPlan.ts
```

Follow `AGENTS.md` if there is any conflict.

---

# 2. Task Scope

## In Scope

Create shared privacy utilities under `packages/shared`.

Expected files:

```text
packages/shared/src/types/privacy.ts
packages/shared/src/privacy/redaction.ts
packages/shared/src/privacy/minimizeCoachContext.ts
packages/shared/src/privacy/localDataPolicy.ts
packages/shared/src/privacy/redaction.test.ts
packages/shared/src/privacy/minimizeCoachContext.test.ts
packages/shared/src/privacy/index.ts
packages/shared/src/index.ts
buildprogresstracker.md
```

Implement:

* lightweight redaction utilities,
* coach context minimization helpers,
* privacy-safe local data policy metadata,
* tests for redaction and minimization,
* exports from `@carboncoach/shared`.

## Out of Scope

Do not implement:

* UI privacy page,
* clear-data UI,
* browser localStorage adapter,
* tracker persistence,
* coach request/response contracts,
* Gemini integration,
* API routes,
* Numeric Invention Guard implementation,
* Daily Choice Lab,
* Carbon World,
* deployment.

---

# 3. Privacy Design Requirements

## 3.1 Local-first rule

P0 data model:

```text
Profile and tracker data stay in browser local storage.
No login.
No database.
No cloud profile storage.
Coach calls are user-triggered only.
```

This task should define policy metadata and utilities, not browser UI or persistence.

## 3.2 Data minimization rule

Future LLM requests must receive only the context needed for coaching.

Allowed for future coach context:

```text
calculated footprint summary
category breakdown
top contributor
assumption notes
confidence level
ranked recommended actions
weekly plan
user preference
allowed deterministic numbers
```

Avoid sending:

```text
raw full local storage state
raw full onboarding history
unnecessary profile fields
free-text notes
exact address
phone number
email address
income
employer
sensitive identity data
API keys
debug logs
```

---

# 4. Required Types

Create:

```text
packages/shared/src/types/privacy.ts
```

Recommended types:

```ts
export type RedactionKind =
  | 'email'
  | 'phone'
  | 'possibleAddress'
  | 'sensitiveToken';

export interface RedactionMatch {
  kind: RedactionKind;
  token: string;
  replacement: string;
}

export interface RedactionResult {
  text: string;
  matches: RedactionMatch[];
}

export interface LocalDataPolicyItem {
  key: string;
  label: string;
  storage: 'browserLocalStorage' | 'notStored' | 'serverTransient';
  purpose: string;
  userVisible: boolean;
  clearable: boolean;
}

export interface CoachContextPrivacySummary {
  includedFields: string[];
  excludedFields: string[];
  notes: string[];
}
```

Adjust names if needed, but keep contracts simple and explicit.

---

# 5. Redaction Utility Requirements

Create:

```text
packages/shared/src/privacy/redaction.ts
```

Implement functions such as:

```ts
export function redactSensitiveText(input: string): RedactionResult;

export function hasPotentialSensitiveText(input: string): boolean;
```

## 5.1 Redaction coverage

Detect and redact:

```text
email-like values
phone-like values
possible API-key-like tokens
simple exact-address-like patterns where practical
```

Use simple deterministic regex. Do not over-engineer NLP.

Suggested replacements:

```text
[redacted-email]
[redacted-phone]
[redacted-sensitive-token]
[redacted-address]
```

## 5.2 Important constraints

* Redaction must be deterministic.
* Redaction must not throw on empty strings.
* Redaction must preserve readable surrounding text.
* Avoid false confidence. This is a basic safeguard, not a complete privacy scanner.
* Do not introduce third-party dependencies for this task.

---

# 6. Coach Context Minimization Requirements

Create:

```text
packages/shared/src/privacy/minimizeCoachContext.ts
```

This task does not create final coach contracts. It creates minimized context helpers that later Task 006/007 can reuse.

Recommended functions:

```ts
export function summarizeFootprintContextForCoach(input: {
  footprint: FootprintEstimate;
  recommendedActions: RankedCarbonAction[];
  weeklyPlan?: WeeklyActionPlan;
  preference: UserPreference;
}): {
  summary: unknown;
  allowedNumbers: string[];
  privacy: CoachContextPrivacySummary;
};

export function extractAllowedNumbersFromFootprintContext(input: {
  footprint: FootprintEstimate;
  recommendedActions: RankedCarbonAction[];
  weeklyPlan?: WeeklyActionPlan;
}): string[];
```

Use stronger concrete types where practical rather than `unknown`.

## 6.1 Minimized context should include

For footprint coaching:

```text
monthly total
category values
top category
confidence
assumption notes
recommended action titles
impact bands
estimatedMonthlyReductionKgCO2e where present
weekly plan action titles where present
preference
```

## 6.2 Minimized context should exclude

```text
raw CarbonProfile
raw local storage dump
raw browser state
debug fields
unnecessary text
```

## 6.3 Allowed numbers

Allowed numbers must include deterministic numeric values that future LLM responses may mention:

```text
monthly total
category monthly values
estimated action reductions
```

Normalize to string values consistently.

Do not include arbitrary user-entered raw values unless they are part of deterministic output.

---

# 7. Local Data Policy Metadata Requirements

Create:

```text
packages/shared/src/privacy/localDataPolicy.ts
```

Define metadata for future UI/docs.

Recommended export:

```ts
export const localDataPolicyItems: LocalDataPolicyItem[] = [
  ...
];

export const privacyPrinciples: string[] = [
  ...
];
```

Policy items should cover:

```text
carbon profile
footprint estimate
weekly tracker
coach response cache if later implemented
Gemini API key
raw coach prompt
```

Be truthful:

* Gemini API key is server-side only.
* raw prompts should not be stored.
* profile is local-first.
* coach requests are transient server-side.

---

# 8. Export Requirements

Create:

```text
packages/shared/src/privacy/index.ts
```

Export privacy modules from root:

```ts
export * from './privacy';
export * from './types/privacy';
```

Avoid circular dependencies.

---

# 9. Test Requirements

Add tests for redaction and minimization.

## 9.1 Redaction tests

Recommended file:

```text
packages/shared/src/privacy/redaction.test.ts
```

Must test:

```text
redacts email addresses
redacts phone-like values
redacts possible sensitive tokens
returns unchanged safe text
handles empty string
reports matches
hasPotentialSensitiveText works
```

## 9.2 Minimization tests

Recommended file:

```text
packages/shared/src/privacy/minimizeCoachContext.test.ts
```

Must test:

```text
summary includes footprint total
summary includes category values
summary includes top category
summary includes recommended action titles
allowedNumbers includes deterministic footprint values
allowedNumbers includes deterministic action reduction values when present
summary excludes raw profile fields
privacy summary includes included/excluded fields
no duplicate allowed numbers
```

Use fixtures rather than relying on brittle full calculator values unless useful.

---

# 10. Documentation Requirements

Allowed docs update:

```text
buildprogresstracker.md
```

Do not update README to claim privacy UI exists yet.

Do not implement or document completed privacy page. That belongs to Task 015.

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

All must pass before marking Task 005 as review-ready.

---

# 12. Acceptance Criteria

Task 005 is successful when:

```text
Privacy types exist.
Redaction utilities exist.
Redaction tests pass.
Coach context minimization helper exists.
Allowed-number extraction for minimized footprint context exists.
Local data policy metadata exists.
Root exports are updated.
Root build/typecheck/test/lint/format checks pass.
No UI was implemented.
No Gemini/API code was implemented.
No coach response contract was implemented.
No tracker/localStorage adapter was implemented.
buildprogresstracker.md is updated.
```

---

# 13. Human Review Checklist

After Task 005, verify:

```text
No UI added.
No API/Gemini added.
No third-party privacy dependency added.
Redaction is deterministic and simple.
Context minimization does not expose raw profile.
Allowed numbers come from deterministic outputs.
Policy metadata is truthful and not overclaiming.
Tests cover safe and unsafe text.
All gates passed.
```

---

# 14. Expected Agent Report Format

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

# 15. Commit Recommendation

After review:

```bash
git add .
git commit -m "feat(privacy): add redaction and context minimization"
git push origin main
```

Use `main` only.

---

# 16. Final Instruction

Implement Task 005 only.

Do not begin Task 006 until Task 005 is reviewed and accepted.

The goal is a small, deterministic, tested privacy layer that future coach and API tasks can safely reuse.
