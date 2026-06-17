---
name: carboncoach-daily-choice-lab
description: Use this skill when implementing Task 013 — Daily Choice Lab Foundation for CarbonCoach. This task implements deterministic everyday scenario comparison logic and accessible UI for the Daily Choice Lab. It must not implement Choice Coach API calls/UI, Carbon World, tracker/localStorage, privacy page, assumptions page, deployment, or fake AI content.
---

---

# Task 013 — Daily Choice Lab Foundation

## Task Purpose

Implement the deterministic **Daily Choice Lab** foundation for CarbonCoach.

This task creates everyday scenario comparisons such as commute choices, meal choices, shopping choices, and home energy choices using deterministic scenario data and impact bands.

The Daily Choice Lab helps users understand:

```text
Small everyday choices can have different carbon impact patterns.
```

The rule remains:

```text
Deterministic engines decide.
LLMs explain.
```

Task 013 must not call the coach API. Choice Coach integration will come later after the deterministic Choice Lab exists.

---

# 1. Required Reading Before Coding

Read:

```text
AGENTS.md
implementationplan.md
buildprogresstracker.md
docs/architecture/architecture-overview.md
docs/architecture/architecture-decisions.md
docs/skills/013-daily-choice-lab/SKILLS.md
packages/shared/src/types/carbon.ts
packages/shared/src/types/actions.ts
packages/shared/src/assistant/coachTypes.ts
apps/web/src/features/profile
apps/web/src/features/footprint
apps/web/src/features/recommendations
apps/web/src/features/coach
apps/web/src/app/AppShell.tsx
apps/web/src/components/ui
```

Follow `AGENTS.md` if there is any conflict.

---

# 2. Task Scope

## In Scope

Implement deterministic Daily Choice Lab logic and UI.

Expected shared files may include:

```text
packages/shared/src/choices/choiceTypes.ts
packages/shared/src/choices/choiceScenarios.ts
packages/shared/src/choices/choiceEngine.ts
packages/shared/src/choices/choiceEngine.test.ts
packages/shared/src/choices/index.ts
packages/shared/src/index.ts
```

Expected web files may include:

```text
apps/web/src/features/choices/DailyChoiceLab.tsx
apps/web/src/features/choices/ChoiceScenarioSelector.tsx
apps/web/src/features/choices/ChoiceOptionCard.tsx
apps/web/src/features/choices/ChoiceComparisonPanel.tsx
apps/web/src/features/choices/choiceViewModel.ts
apps/web/src/features/choices/choiceCopy.ts
apps/web/src/features/choices/DailyChoiceLab.test.tsx
apps/web/src/features/choices/choiceViewModel.test.ts
apps/web/src/features/choices/index.ts
apps/web/src/app/AppShell.tsx
apps/web/src/app/navigation.ts
apps/web/src/app/routes.ts
buildprogresstracker.md
```

Implement:

- deterministic choice scenario catalog,
- scenario selection,
- option comparison,
- recommended/lower-impact option based on deterministic metadata,
- impact band display,
- assumption/reasoning text,
- accessible UI,
- tests.

## Out of Scope

Do not implement:

- Choice Coach API call,
- Choice Coach response rendering,
- `/api/coach` calls from Choice Lab,
- Footprint Coach changes unless integration needs a small import fix,
- Carbon World,
- tracker/localStorage,
- persistent choice history,
- privacy page,
- assumptions page,
- deployment,
- fake AI content.

---

# 3. Deterministic Scenario Requirements

Create a small deterministic scenario catalog in shared code.

Recommended P0 scenarios:

```text
Commute choice
Meal choice
Shopping choice
Home energy choice
```

Each scenario should include:

```text
scenario id
title
category
short description
assumption note
2 to 3 options
recommended option id
```

Each option should include:

```text
option id
label
description
impact band
reasons
```

Optional if already supported by shared domain:

```text
estimatedKgCO2e
```

Only include exact numeric estimates if they are deterministic, documented in scenario assumptions, and tested.

For P0, qualitative impact bands are enough.

---

# 4. Shared Types

Create:

```text
packages/shared/src/choices/choiceTypes.ts
```

Recommended types:

```ts
import type { FootprintCategory, ImpactBand } from '../types/carbon';
import type { UserPreference } from '../types/actions';

export interface ChoiceOption {
  id: string;
  label: string;
  description: string;
  impactBand: ImpactBand;
  reasons: string[];
  estimatedKgCO2e?: number;
}

export interface ChoiceScenario {
  id: string;
  title: string;
  category: FootprintCategory;
  description: string;
  assumptionNote: string;
  options: ChoiceOption[];
  recommendedOptionId: string;
}

export interface ChoiceComparisonResult {
  scenario: ChoiceScenario;
  recommendedOption: ChoiceOption;
  options: ChoiceOption[];
  preference?: UserPreference;
  explanation: string;
}
```

Use existing category/impact types where available.

---

# 5. Shared Engine Requirements

Create:

```text
packages/shared/src/choices/choiceEngine.ts
```

Recommended functions:

```ts
export function getChoiceScenarios(): ChoiceScenario[];

export function getChoiceScenarioById(id: string): ChoiceScenario | undefined;

export function compareChoiceScenario(
  scenarioId: string,
  preference?: UserPreference,
): ChoiceComparisonResult;
```

Requirements:

```text
use scenario catalog only
return deterministic result
throw or return safe error for unknown scenario
do not call AI
do not use profile-specific private fields
do not persist anything
do not create random results
```

The engine should explain the recommended option using scenario metadata only.

---

# 6. Scenario Catalog Rules

Create:

```text
packages/shared/src/choices/choiceScenarios.ts
```

Keep scenarios simple and safe.

Good example:

```text
Scenario: Short city commute
Option A: Metro or bus
Impact: Low
Reason: Shared transit spreads impact across many riders.
Option B: Private cab
Impact: High
Reason: Private trips usually carry fewer people per vehicle.
```

Avoid unsupported claims:

```text
Metro saves 85%.
You save ₹120.
This avoids 10 kg.
```

unless those numbers are deterministic and explicitly included/tested.

Preferred P0 approach: use impact bands and qualitative reasons only.

---

# 7. UI Requirements

Create:

```text
apps/web/src/features/choices/DailyChoiceLab.tsx
```

The UI should include:

```text
section title
short explanation
scenario selector
selected scenario description
option cards
deterministic recommended/lower-impact option
assumption note
placeholder for future Choice Coach
```

Recommended title:

```text
Daily Choice Lab
```

Recommended description:

```text
Compare everyday choices using deterministic impact bands and plain-language assumptions.
```

Recommended future placeholder:

```text
Choice Coach will explain this scenario in a later task.
```

Do not show AI-generated text.

Do not call `/api/coach`.

---

# 8. Choice Option Card Requirements

Each option card should show:

```text
option label
option description
impact band as readable text
reasons list
recommended/lower-impact badge where applicable
```

Use existing UI primitives:

```text
Card
StatusBadge
Button
Select
SectionHeader
EmptyState
```

Impact badges must not rely on color alone.

---

# 9. AppShell Integration

Update the Choice Lab section so it renders the real Daily Choice Lab.

If navigation already contains Choice Lab, reuse it.

If route constants need adjustment, keep them minimal.

Do not add Choice Coach route yet.

---

# 10. Accessibility Requirements

Must include:

```text
labelled scenario selector
semantic section headings
option cards with readable headings
impact badges with text
recommended option text label
reasons as lists
assumption note readable by screen readers
keyboard reachable controls
no color-only meaning
```

Avoid custom select implementations.

---

# 11. Testing Requirements

Add shared and UI tests.

Minimum shared engine tests:

```text
returns scenario catalog
finds scenario by id
compares valid scenario
returns deterministic recommended option
handles unknown scenario safely
does not mutate scenario catalog
does not require AI/profile/backend
```

Minimum UI tests:

```text
renders Daily Choice Lab title
renders scenario selector
renders options for default scenario
changing scenario updates options
renders recommended/lower-impact badge
renders impact band text
renders assumption note
renders future Choice Coach placeholder
does not call /api/coach
does not use localStorage
does not render unsupported percentages/currency/savings claims
```

View model tests should cover:

```text
formats category label
formats impact band label
returns recommended option label safely
handles missing scenario option safely if helper exists
```

---

# 12. Dependency Guidance

Do not add new dependencies.

Use existing:

```text
React
Vitest
React Testing Library
@carboncoach/shared
Task 008 UI primitives
```

Avoid:

```text
AI SDKs in frontend
routing libraries
state libraries
chart libraries
localStorage helpers
drag/drop libraries
animation libraries
```

---

# 13. Build Progress Tracker Update

Update `buildprogresstracker.md` for Task 013:

```text
Status: Review Ready
Owner/Agent: Antigravity
Build/Typecheck/Tests/Lint/Format: Pass if passed
Files changed
Summary
Verification commands
Risks/follow-ups
```

Do not mark `Complete` until human review accepts it.

---

# 14. Verification Commands

Run from repo root:

```bash
npm run build
npm run typecheck
npm run test
npm run lint
npm run format:check
```

All must pass before marking Task 013 as review-ready.

---

# 15. Acceptance Criteria

Task 013 is successful when:

```text
Shared choice scenario catalog exists.
Shared deterministic choice engine exists.
Daily Choice Lab UI exists.
Scenario selector works.
Selected scenario renders deterministic options.
Recommended/lower-impact option is displayed.
Impact bands are text-labelled.
Assumption notes are visible.
Choice Coach is only a truthful placeholder.
No /api/coach call is made.
No localStorage is used.
No tracker/history is implemented.
No Carbon World is implemented.
No fake AI content appears.
No unsupported percentages/currency/savings claims appear.
Tests pass.
Root verification gates pass.
buildprogresstracker.md is updated.
```

---

# 16. Human Review Checklist

Verify:

```text
No Choice Coach API call.
No /api/coach reference in choices feature.
No localStorage/sessionStorage.
No fake AI content.
No exact percentages or currency claims.
No randomization.
No profile-sensitive data in shared choices.
Scenario data is deterministic and lightweight.
All impact labels have readable text.
All gates passed.
```

Useful grep checks:

```bash
grep -R "/api/coach\|localStorage\|sessionStorage\|Gemini\|AI says\|save ₹\|save \$\|%\|saved\|avoided" packages/shared/src/choices apps/web/src/features/choices apps/web/src/app
```

Expected: no unsafe hits except truthful placeholder wording if reviewed.

---

# 17. Expected Agent Report Format

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

# 18. Commit Recommendation

After review:

```bash
git add .
git commit -m "feat(choices): add deterministic daily choice lab"
git push origin main
```

Use `main` only.

---

# 19. Final Instruction

Implement Task 013 only.

Do not begin Choice Coach UI, Carbon World, tracker, privacy page, assumptions page, or deployment work.

The goal is a deterministic, accessible Daily Choice Lab that gives Choice Coach a safe foundation in a later task.
