---
name: carboncoach-footprint-summary-ui
description: Use this skill when implementing Task 010 — Footprint Summary UI for CarbonCoach. This task connects the in-memory CarbonProfile from Task 009 to the deterministic calculator and renders an accessible approximate footprint summary. It must not implement coach API calls, Daily Choice Lab, Carbon World, tracker/localStorage, privacy page, deployment, or fake AI content.
---

---

# Task 010 — Footprint Summary UI

## Task Purpose

Implement the deterministic **Footprint Summary UI** for CarbonCoach.

This task is the first place where the user’s in-memory profile from Task 009 is passed into the shared deterministic calculator and shown as an approximate monthly footprint summary.

The rule remains:

```text
Deterministic engines decide.
LLMs explain.
```

Task 010 must show calculated values only from the shared calculator. Do not invent numbers, percentages, savings, AI claims, or comparison benchmarks.

---

# 1. Required Reading Before Coding

Read:

```text
AGENTS.md
implementationplan.md
buildprogresstracker.md
docs/architecture/architecture-overview.md
docs/architecture/architecture-decisions.md
docs/skills/010-footprint-summary-ui/SKILLS.md
packages/shared/src/types/carbon.ts
packages/shared/src/carbon/calculator.ts
packages/shared/src/carbon/categoryCalculators.ts
packages/shared/src/carbon/assumptions.ts
apps/web/src/features/profile
apps/web/src/app/AppShell.tsx
apps/web/src/components/ui
apps/web/src/styles
```

Follow `AGENTS.md` if there is any conflict.

---

# 2. Task Scope

## In Scope

Implement the footprint summary UI under `apps/web`.

Expected files may include:

```text
apps/web/src/features/footprint/FootprintSummary.tsx
apps/web/src/features/footprint/FootprintCategoryCard.tsx
apps/web/src/features/footprint/FootprintBreakdownList.tsx
apps/web/src/features/footprint/AssumptionNotes.tsx
apps/web/src/features/footprint/footprintViewModel.ts
apps/web/src/features/footprint/footprintCopy.ts
apps/web/src/features/footprint/FootprintSummary.test.tsx
apps/web/src/features/footprint/footprintViewModel.test.ts
apps/web/src/features/footprint/index.ts
apps/web/src/app/AppShell.tsx
buildprogresstracker.md
```

Implement:

- calculator integration using submitted in-memory profile,
- approximate monthly total display,
- category breakdown,
- top contributor display,
- confidence/assumption notes,
- no-profile empty state,
- accessible summary cards,
- tests.

## Out of Scope

Do not implement:

- AI coach UI,
- `/api/coach` client,
- Gemini call from frontend,
- recommendation engine UI,
- weekly plan UI,
- Daily Choice Lab,
- Carbon World,
- tracker/localStorage,
- privacy page,
- assumptions page,
- chart library,
- deployment.

---

# 3. Data Flow Requirements

Use the in-memory profile from Task 009.

Recommended flow:

```text
ProfileOnboarding submits CarbonProfile
AppShell stores submitted CarbonProfile in component state
FootprintSummary receives CarbonProfile | null
If profile exists, call calculateFootprint(profile)
Render FootprintEstimate
If profile missing, show empty state
```

Do not persist the profile.

Do not read from localStorage.

Do not call the backend.

---

# 4. Calculator Integration Rules

Use the shared deterministic calculator only.

Required:

```text
calculateFootprint(profile)
```

Do not duplicate calculator logic in the UI.

Do not create new emission factors in the UI.

Do not hard-code result numbers.

Do not add new carbon math in components.

If display formatting is needed, create a view model/formatting helper that only formats calculator output.

---

# 5. UI Requirements

The Footprint Summary section should include:

```text
summary title
approximate estimate badge
monthly total kg CO2e
category breakdown
top contributor
confidence indicator
assumption notes
next-step placeholder for recommendations/coach
```

Recommended title:

```text
Your approximate footprint summary
```

Recommended explanatory copy:

```text
This estimate is based on your profile inputs and CarbonCoach demo assumptions. It is designed for awareness and better everyday choices, not formal carbon accounting.
```

If no profile exists:

```text
Set up your carbon profile first to see an approximate footprint summary.
```

Do not show fake values when no profile exists.

---

# 6. Category Breakdown Requirements

Render all calculator categories available from the estimate.

Each category card/list row should show:

```text
category name
monthly kg CO2e value
impact band if available
confidence if available
brief plain-English label
```

Use existing `StatusBadge` for:

```text
Approximate Estimate
Top Contributor
Low Impact Band
Moderate Impact Band
High Impact Band
Confidence
```

Do not rely on color only.

---

# 7. Top Contributor Requirements

If calculator output includes a top contributor, render it clearly.

Recommended wording:

```text
Top contributor: Transport
```

Do not shame the user.

Avoid wording like:

```text
Your worst category
You are causing the most emissions through...
```

Use neutral wording:

```text
This category has the largest share in your current estimate.
```

---

# 8. Assumptions and Confidence Requirements

Show assumption notes from calculator output.

Required:

```text
visible assumptions section
confidence label
approximate estimate language
```

If assumption notes are empty, show safe fallback copy:

```text
This result uses CarbonCoach’s current demo assumptions.
```

Do not implement the full assumptions page yet.

---

# 9. Formatting Rules

Use simple formatting helpers.

Recommended:

```ts
formatKgCO2e(value: number): string
formatCategoryLabel(category: FootprintCategory): string
formatConfidenceLabel(confidence: ConfidenceLevel): string
```

Formatting can round to a sensible display format, but must not change underlying calculated data.

Avoid excessive decimal precision.

Recommended display:

```text
420 kg CO2e / month
42.5 kg CO2e / month
```

Do not display “tons” unless already supported and tested.

---

# 10. AppShell Integration

Update the Footprint section to render the real `FootprintSummary`.

Dashboard overview may show a truthful status card:

```text
Footprint Summary: Ready after profile setup
```

or, after profile submission:

```text
Footprint Summary: Estimate available
```

Do not duplicate the full summary on the overview unless simple and truthful.

Keep other sections as placeholders.

---

# 11. Accessibility Requirements

Must include:

```text
semantic section headings
accessible empty state
cards with readable headings
badges with text labels
no color-only category meaning
summary total announced as text
assumption notes in readable list
keyboard reachable controls
```

Do not implement inaccessible custom charts.

---

# 12. Testing Requirements

Add tests for footprint summary and view model/helpers.

Minimum tests:

```text
renders empty state when no profile exists
renders calculated monthly total when profile exists
renders category breakdown
renders top contributor if present
renders assumption notes
renders approximate estimate text
does not render AI coach content
does not call /api/coach
does not use localStorage
does not render fake savings or percentages
```

View model/helper tests should cover:

```text
formats kg CO2e values
formats category labels
handles missing top contributor safely
preserves calculator values
```

---

# 13. Dependency Guidance

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
```

If a visual breakdown is needed, use accessible cards/lists or simple CSS progress bars from the existing `ProgressMeter`.

---

# 14. Build Progress Tracker Update

Update `buildprogresstracker.md` for Task 010:

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

# 15. Verification Commands

Run from repo root:

```bash
npm run build
npm run typecheck
npm run test
npm run lint
npm run format:check
```

All must pass before marking Task 010 as review-ready.

---

# 16. Acceptance Criteria

Task 010 is successful when:

```text
Footprint Summary UI exists.
It uses the submitted in-memory CarbonProfile from Task 009.
It calls the shared deterministic calculateFootprint function.
It renders approximate monthly total from calculator output.
It renders category breakdown from calculator output.
It renders top contributor when available.
It renders confidence/assumption notes.
It has an empty state when no profile exists.
It does not hard-code fake footprint values.
It does not call the coach API.
It does not implement recommendations UI.
It does not implement Daily Choice Lab.
It does not implement Carbon World.
It does not implement tracker/localStorage.
It does not add chart libraries.
Tests pass.
Root verification gates pass.
buildprogresstracker.md is updated.
```

---

# 17. Human Review Checklist

Verify:

```text
No fake numeric claims.
No unsupported percentages.
No currency/savings claims.
No coach API call.
No localStorage.
No duplicated carbon calculation logic.
No new emission factors in UI.
No AI/Gemini content in UI.
Empty state appears before profile setup.
Result appears only after profile submit.
All gates passed.
```

---

# 18. Expected Agent Report Format

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

# 19. Commit Recommendation

After review:

```bash
git add .
git commit -m "feat(footprint): add deterministic summary UI"
git push origin main
```

Use `main` only.

---

# 20. Final Instruction

Implement Task 010 only.

Do not begin coach UI, recommendation UI, Daily Choice Lab, Carbon World, tracker, privacy page, assumptions page, or deployment work.

The goal is a truthful, accessible footprint summary powered only by the deterministic shared calculator.
