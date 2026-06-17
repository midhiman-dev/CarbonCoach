---
name: carboncoach-recommendation-weekly-plan-ui
description: Use this skill when implementing Task 011 — Recommendation and Weekly Plan UI for CarbonCoach. This task connects the in-memory profile and deterministic footprint estimate to the shared recommendation engine and weekly plan generator, then renders accessible action recommendations. It must not implement coach API/client/UI, Daily Choice Lab, Carbon World, tracker/localStorage, privacy page, assumptions page, deployment, or fake AI content.
---

---

# Task 011 — Recommendation and Weekly Plan UI

## Task Purpose

Implement the deterministic **Recommendation and Weekly Plan UI** for CarbonCoach.

This task uses the existing in-memory `CarbonProfile`, the deterministic footprint estimate from Task 010, and the shared recommendation engine from Task 004 to display practical, non-judgmental actions.

The core rule remains:

```text
Deterministic engines decide.
LLMs explain.
```

Task 011 must show recommendations and weekly plan actions only from the shared deterministic recommendation engine. Do not invent savings, percentages, AI advice, currency values, or unsupported claims.

---

# 1. Required Reading Before Coding

Read:

```text
AGENTS.md
implementationplan.md
buildprogresstracker.md
docs/architecture/architecture-overview.md
docs/architecture/architecture-decisions.md
docs/skills/011-recommendation-weekly-plan-ui/SKILLS.md
packages/shared/src/types/carbon.ts
packages/shared/src/types/actions.ts
packages/shared/src/carbon/calculator.ts
packages/shared/src/recommendations/actionCatalog.ts
packages/shared/src/recommendations/recommendationEngine.ts
packages/shared/src/recommendations/weeklyPlan.ts
apps/web/src/features/profile
apps/web/src/features/footprint
apps/web/src/app/AppShell.tsx
apps/web/src/components/ui
apps/web/src/styles
```

Follow `AGENTS.md` if there is any conflict.

---

# 2. Task Scope

## In Scope

Implement deterministic recommendations UI under `apps/web`.

Expected files may include:

```text
apps/web/src/features/recommendations/RecommendationPanel.tsx
apps/web/src/features/recommendations/RecommendationCard.tsx
apps/web/src/features/recommendations/WeeklyPlanPanel.tsx
apps/web/src/features/recommendations/recommendationViewModel.ts
apps/web/src/features/recommendations/recommendationCopy.ts
apps/web/src/features/recommendations/RecommendationPanel.test.tsx
apps/web/src/features/recommendations/recommendationViewModel.test.ts
apps/web/src/features/recommendations/index.ts
apps/web/src/app/AppShell.tsx
buildprogresstracker.md
```

Implement:

- deterministic recommendation panel,
- ranked action cards,
- weekly action plan panel,
- no-profile empty state,
- no-estimate empty state if needed,
- preference-aware recommendation display,
- impact/effort/cost labels,
- assumption/estimate disclaimer,
- tests.

## Out of Scope

Do not implement:

- coach API client,
- AI coach UI,
- Gemini response rendering,
- Daily Choice Lab,
- Carbon World,
- tracker/localStorage persistence,
- action completion tracking,
- privacy page,
- assumptions page,
- chart library,
- deployment,
- database,
- authentication.

---

# 3. Data Flow Requirements

Use in-memory state only.

Recommended flow:

```text
ProfileOnboarding submits CarbonProfile
AppShell stores CarbonProfile in component state
FootprintSummary calculates FootprintEstimate
RecommendationPanel receives CarbonProfile and/or FootprintEstimate
RecommendationPanel calls shared deterministic recommendation engine
WeeklyPlanPanel calls shared deterministic weekly plan generator
Render actions and plan
```

Do not persist anything.

Do not call `/api/coach`.

Do not read from localStorage.

---

# 4. Deterministic Engine Integration Rules

Use the shared recommendation engine only.

Use existing shared functions from:

```text
packages/shared/src/recommendations/recommendationEngine.ts
packages/shared/src/recommendations/weeklyPlan.ts
packages/shared/src/recommendations/actionCatalog.ts
```

Do not duplicate ranking logic in UI.

Do not create new recommendation scoring in UI.

Do not hard-code product actions in UI unless they already come from shared catalog.

The UI may format and group actions, but the decisions must come from shared deterministic utilities.

---

# 5. UI Requirements

The recommendation section should include:

```text
section title
short explanation
ranked recommended action cards
weekly plan panel
preference indicator
empty state before profile setup
clear deterministic disclaimer
```

Recommended title:

```text
Recommended actions
```

Recommended description:

```text
These actions are selected from CarbonCoach’s deterministic action catalog based on your profile, estimated footprint, and selected priority.
```

Recommended empty state:

```text
Set up your profile first to see recommended actions.
```

Do not show fake recommendations before profile setup.

---

# 6. Recommendation Card Requirements

Each recommendation card should show fields that exist in shared action/recommendation output.

Recommended fields:

```text
action title
category
impact band
effort
cost effect
reason
estimated monthly reduction if provided by shared engine
rank/order if useful
```

Use `StatusBadge` for:

```text
High Impact Band
Moderate Impact Band
Low Impact Band
Low Effort
Medium Effort
High Effort
Low Cost
May Cost More
No Cost / Saves Cost if supported by shared type
```

Badges must have readable text and not rely on color alone.

If estimated reduction exists, render it as approximate and deterministic:

```text
Estimated reduction: 12 kg CO2e / month
```

Only render this value if it is present in shared deterministic output.

Do not invent reductions.

---

# 7. Weekly Plan Requirements

Render a simple weekly plan from the shared weekly plan generator.

Recommended content:

```text
week title
3 to 5 actions if available
plain-language next steps
impact/effort/cost badges if available
```

Use safe wording:

```text
Suggested weekly plan
```

and:

```text
This is a lightweight action plan based on deterministic recommendations. Adjust it to your real routine.
```

Do not implement completion tracking yet.

Do not add checkboxes that save progress. If checkboxes are shown visually, they must be disabled or clearly non-persistent, but preferably avoid them until tracker task.

---

# 8. Preference-Aware Display

Show the user’s selected priority from the profile.

Examples:

```text
Priority: Balanced
Priority: Lowest effort
Priority: Lowest cost
Priority: Highest impact
```

The UI must not re-rank independently. It should display the ranked order returned by the shared engine.

---

# 9. AppShell Integration

Update AppShell so the Recommendations section shows the real deterministic recommendation UI.

If the current navigation does not have a separate Recommendations section, either:

```text
add a Recommendations nav item
```

or place the panel in the Footprint section below the summary, as long as it remains clearly separated.

Preferred navigation item:

```text
Recommendations
```

Keep other sections as truthful placeholders.

Do not connect AI Coach yet.

---

# 10. Placeholder Content Rules

Allowed placeholder copy:

```text
AI Coach will explain these deterministic recommendations in a later task.
Daily Choice Lab will be added in a later task.
Tracker completion will be added in a later task.
```

Forbidden placeholder copy:

```text
Gemini recommends this action.
You saved 15 kg this week.
Your emissions will drop by 20%.
This will save ₹500.
```

---

# 11. Accessibility Requirements

Must include:

```text
semantic section headings
accessible empty state
cards with readable headings
ordered/list structure for ranked actions
badges with text labels
no color-only meaning
weekly plan as a readable list
keyboard reachable controls
```

Avoid inaccessible custom charts or drag/drop.

---

# 12. Formatting Rules

Create a view model/helper file for display formatting only.

Recommended helpers:

```ts
formatActionCategory(...)
formatImpactBand(...)
formatEffort(...)
formatCostEffect(...)
formatReductionKgCO2e(...)
```

Formatting helpers must not introduce new scoring, new reductions, or new carbon logic.

---

# 13. Testing Requirements

Add tests for recommendations UI and helpers.

Minimum UI tests:

```text
renders empty state when no profile exists
renders recommendations when profile exists
renders weekly plan when profile exists
renders user preference label
renders impact/effort/cost badges as text
renders deterministic reduction only when present
does not render AI coach response
does not call /api/coach
does not use localStorage
does not render fake savings/currency/percentage claims
```

Minimum helper tests:

```text
formats category label
formats impact band
formats effort
formats cost effect
formats reduction value
handles missing reduction safely
preserves shared engine order
```

---

# 14. Dependency Guidance

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
chart libraries
routing libraries
state libraries
AI SDKs in frontend
form libraries
analytics
localStorage helpers
drag/drop libraries
```

---

# 15. Build Progress Tracker Update

Update `buildprogresstracker.md` for Task 011:

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

# 16. Verification Commands

Run from repo root:

```bash
npm run build
npm run typecheck
npm run test
npm run lint
npm run format:check
```

All must pass before marking Task 011 as review-ready.

---

# 17. Acceptance Criteria

Task 011 is successful when:

```text
Recommendation UI exists.
It uses the submitted in-memory CarbonProfile.
It uses the shared deterministic recommendation engine.
It uses the shared deterministic weekly plan generator.
It renders ranked action cards.
It renders a suggested weekly plan.
It shows preference-aware context.
It shows impact/effort/cost labels as readable text.
It renders deterministic estimated reductions only if present.
It has an empty state when no profile exists.
It does not hard-code recommendation logic in UI.
It does not call the coach API.
It does not implement AI coach UI.
It does not implement Daily Choice Lab.
It does not implement Carbon World.
It does not implement tracker/localStorage.
It does not add chart libraries.
Tests pass.
Root verification gates pass.
buildprogresstracker.md is updated.
```

---

# 18. Human Review Checklist

Verify:

```text
No fake recommendation claims.
No unsupported percentages.
No currency/savings claims.
No coach API call.
No localStorage.
No duplicated recommendation ranking logic.
No new action catalog in UI.
No AI/Gemini content in UI except truthful placeholder.
No completion tracker.
Result appears only after profile submit.
All gates passed.
```

---

# 19. Expected Agent Report Format

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

# 20. Commit Recommendation

After review:

```bash
git add .
git commit -m "feat(recommendations): add deterministic action plan UI"
git push origin main
```

Use `main` only.

---

# 21. Final Instruction

Implement Task 011 only.

Do not begin AI coach UI, Daily Choice Lab, Carbon World, tracker, privacy page, assumptions page, or deployment work.

The goal is a truthful, accessible recommendation and weekly plan UI powered only by the deterministic shared recommendation engine.
