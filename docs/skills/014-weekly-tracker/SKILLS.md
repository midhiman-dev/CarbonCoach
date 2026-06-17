---
name: carboncoach-choice-coach-ui
description: Use this skill when implementing Task 014 — Choice Coach UI for CarbonCoach. This task connects the deterministic Daily Choice Lab scenario context to the backend /api/coach endpoint and renders safe AI/fallback Choice Coach responses. It must not implement Carbon World, tracker/localStorage, privacy page, assumptions page, deployment, or fake AI content.
---

---

# Task 014 — Choice Coach UI

## Task Purpose

Implement the **Choice Coach UI** for CarbonCoach.

This task connects the deterministic Daily Choice Lab foundation from Task 013 to the backend coach endpoint:

```text
POST /api/coach
```

The Choice Coach explains an already-determined scenario comparison in plain language.

The rule remains:

```text
Deterministic engines decide.
LLMs explain.
```

Task 014 must not invent numbers, percentages, currency savings, emission savings, or unsupported claims. It must send only deterministic scenario context to the backend and render only validated `CoachResponse` output returned by the API.

---

# 1. Required Reading Before Coding

Read:

```text
AGENTS.md
implementationplan.md
buildprogresstracker.md
docs/architecture/architecture-overview.md
docs/architecture/architecture-decisions.md
docs/architecture/llm-safety-design.md
docs/architecture/numeric-invention-guard.md
docs/skills/014-choice-coach-ui/SKILLS.md
packages/shared/src/assistant/coachTypes.ts
packages/shared/src/assistant/coachValidation.ts
packages/shared/src/choices/choiceTypes.ts
packages/shared/src/choices/choiceScenarios.ts
packages/shared/src/choices/choiceEngine.ts
apps/web/src/features/choices
apps/web/src/features/coach
apps/web/src/app/AppShell.tsx
apps/web/src/components/ui
```

Follow `AGENTS.md` if there is any conflict.

---

# 2. Task Scope

## In Scope

Implement Choice Coach UI under `apps/web`.

Expected files may include:

```text
apps/web/src/features/coach/ChoiceCoachPanel.tsx
apps/web/src/features/coach/choiceCoachRequestBuilder.ts
apps/web/src/features/coach/choiceCoachClient.ts
apps/web/src/features/coach/ChoiceCoachPanel.test.tsx
apps/web/src/features/coach/choiceCoachRequestBuilder.test.ts
apps/web/src/features/coach/choiceCoachClient.test.ts
apps/web/src/features/coach/index.ts
apps/web/src/features/choices/DailyChoiceLab.tsx
apps/web/src/features/choices/ChoiceComparisonPanel.tsx
buildprogresstracker.md
```

Reuse existing coach rendering where possible:

```text
CoachResponseCard.tsx
coachClient.ts if suitable
coachViewModel.ts if suitable
coachCopy.ts if suitable
```

Implement:

- Choice Coach panel,
- explicit user-triggered Choice Coach request,
- `/api/coach` client path for `choice_coach`,
- request builder using deterministic Daily Choice Lab context,
- loading/error/success states,
- safe response rendering,
- integration into Daily Choice Lab,
- tests,
- tracker update.

## Out of Scope

Do not implement:

- Carbon World,
- tracker/localStorage,
- choice history persistence,
- privacy page,
- assumptions page,
- deployment,
- new backend endpoints,
- new Gemini backend logic unless a small compatibility fix is required,
- frontend Gemini SDK,
- fake coach response text.

---

# 3. Required Data Flow

Use deterministic Choice Lab state.

Recommended flow:

```text
DailyChoiceLab loads deterministic scenarios from shared engine
User selects scenario
compareChoiceScenario(...) returns deterministic comparison
ChoiceCoachPanel receives ChoiceComparisonResult
User clicks "Ask Choice Coach"
Build ChoiceCoachRequest
POST /api/coach
Render CoachResponse
```

The coach must be **user-triggered only**.

Do not auto-call `/api/coach` on scenario load or scenario change.

---

# 4. Request Builder Requirements

Create:

```text
apps/web/src/features/coach/choiceCoachRequestBuilder.ts
```

Build a `ChoiceCoachRequest` using shared contracts.

Required behavior:

```text
mode: choice_coach
context: deterministic ChoiceCoachContext
allowedNumbers: deterministic allowed number strings
tone: selected or default tone
```

The request context must include only:

```text
scenario id
scenario title
options
impact bands
option reasons
recommended option id
selected preference if available
assumption notes
allowedNumbers
```

Allowed numbers:

```text
If scenario options include deterministic estimatedKgCO2e, include those values.
If scenario options are qualitative only, allowedNumbers can be an empty array.
```

Forbidden request content:

```text
raw CarbonProfile
localStorage dump
browser state
debug logs
secrets
identity data
free-text private data
```

---

# 5. Client Requirements

Prefer reusing the existing coach client from Task 012 if it can safely support both modes.

Acceptable approaches:

```text
Option A: Generalize coachClient.ts to requestCoach(request: CoachRequest)
Option B: Add requestChoiceCoach(request: ChoiceCoachRequest)
```

Requirements:

```text
POST to /api/coach
Content-Type: application/json
safe error handling
no API keys in frontend
no Gemini SDK in frontend
no retries in P0
fetch mocked in tests
```

If API call fails, show a safe message and allow retry.

Do not create a frontend fallback composer. Backend owns fallback behavior.

---

# 6. UI Requirements

Create:

```text
apps/web/src/features/coach/ChoiceCoachPanel.tsx
```

The panel should include:

```text
section title
short explanation
tone selector if simple
Ask Choice Coach button
loading state
safe error state
coach response card
source badge through CoachResponseCard
numeric safety note
```

Recommended title:

```text
Choice Coach
```

Recommended description:

```text
Ask CarbonCoach to explain this deterministic choice comparison in plain language.
```

Recommended safety note:

```text
The coach can only use the scenario options, impact bands, and deterministic numbers already provided.
```

Do not show coach content before the user clicks the button.

---

# 7. Response Rendering Requirements

Reuse:

```text
apps/web/src/features/coach/CoachResponseCard.tsx
```

Render the backend `CoachResponse` fields:

```text
summary
explanation
recommendedNextStep
weeklyPlan
confidenceNote
disclaimer
source
numbersUsed
```

Use readable headings and existing source badges:

```text
AI Response
Deterministic Fallback
```

If `source === 'fallback'`, use non-alarming wording.

Do not expose raw prompts, raw provider errors, stack traces, or internal guard errors.

---

# 8. Daily Choice Lab Integration

Update Daily Choice Lab to include the Choice Coach panel below the deterministic comparison.

Required behavior:

```text
If no scenario exists, show empty state.
If scenario exists, enable user-triggered Choice Coach.
If scenario changes, previous coach response should be cleared or clearly tied to the old scenario.
```

Preferred behavior:

```text
Clear previous coach response when selected scenario changes.
```

Do not add a separate route unless already necessary.

---

# 9. Tone Selector

Allowed tones:

```text
simple
detailed
encouraging
```

Default:

```text
simple
```

Use the accessible `Select` primitive.

---

# 10. Safety and Truthfulness Rules

Do not include unsupported content such as:

```text
This option saves 85%.
This saves ₹120.
You avoided 10 kg.
Gemini verified this scenario.
```

Allowed wording:

```text
The coach explains deterministic scenario comparisons.
This comparison uses impact bands and assumptions from the Daily Choice Lab.
Responses may use fallback if the AI service is unavailable.
```

Do not display raw prompts.

Do not display raw API errors.

Do not display stack traces.

---

# 11. Loading and Error States

Required states:

```text
idle
loading
success
error
```

Loading copy:

```text
Preparing a safe choice explanation...
```

Error copy:

```text
The Choice Coach could not respond right now. Please try again.
```

If backend returns fallback with HTTP 200, that is a success state, not an error.

---

# 12. Accessibility Requirements

Must include:

```text
button with accessible name
tone select with label
loading state announced politely
error message accessible
response headings structured
weekly plan rendered as list
source badge includes readable text
keyboard reachable controls
no color-only meaning
```

Use `aria-live="polite"` where practical.

---

# 13. Testing Requirements

Add tests for request builder, client, and UI.

Minimum request builder tests:

```text
builds choice_coach request
includes selected scenario id/title
includes scenario options
includes recommendedOptionId
includes assumption notes
preserves selected tone
uses empty allowedNumbers for qualitative-only scenario
includes deterministic scenario numbers when present
does not include raw CarbonProfile
```

Minimum client tests:

```text
posts to /api/coach
sends JSON body
returns parsed CoachResponse
throws safe error on non-200 response
does not require API key in frontend
```

Minimum UI tests:

```text
renders Choice Coach panel in Daily Choice Lab
does not call /api/coach on initial render
does not call /api/coach when scenario changes
clicking button calls /api/coach
renders loading state
renders coach response fields
renders fallback source badge when source is fallback
renders AI response source badge when source is gemini
renders safe error on failed request
clears or updates response when scenario changes
does not render fake AI content before click
does not use localStorage
```

Use fetch mocking.

Do not make real network calls.

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
Task 012 coach response components/client patterns
```

Avoid:

```text
frontend Gemini SDK
AI SDKs in frontend
state libraries
routing libraries
analytics
localStorage helpers
chart libraries
animation libraries
```

---

# 15. Build Progress Tracker Update

Update `buildprogresstracker.md` for Task 014:

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

All must pass before marking Task 014 as review-ready.

---

# 17. Acceptance Criteria

Task 014 is successful when:

```text
Choice Coach UI exists.
Choice Coach request is user-triggered only.
It builds ChoiceCoachRequest from deterministic Choice Lab context.
It includes allowedNumbers only when deterministic scenario numbers exist.
It does not send raw CarbonProfile.
It calls /api/coach from frontend client.
It renders CoachResponse safely.
It supports loading, success, and error states.
It distinguishes gemini and fallback source.
It clears or ties response correctly when scenario changes.
It does not include frontend Gemini SDK or API key.
It does not implement Carbon World.
It does not implement tracker/localStorage.
It does not show fake AI content.
Tests pass.
Root verification gates pass.
buildprogresstracker.md is updated.
```

---

# 18. Human Review Checklist

Verify:

```text
No frontend Gemini SDK.
No VITE_GEMINI_API_KEY.
No raw profile in choice coach request builder.
No auto-call on render.
No coach call before user action.
No coach call on scenario change.
No fake coach response before click.
No localStorage/sessionStorage.
No Carbon World.
No tracker/history persistence.
No stack traces or raw errors in UI.
All gates passed.
```

Useful grep checks:

```bash
grep -R "VITE_GEMINI_API_KEY\|GoogleGenerativeAI\|@google/generative-ai" apps/web/src
grep -R "localStorage\|sessionStorage" apps/web/src/features/coach apps/web/src/features/choices apps/web/src/app
grep -R "/api/coach" apps/web/src/features/coach apps/web/src/features/choices apps/web/src/app
grep -R "save ₹\|save \$\|%\|saved\|avoided\|Gemini verified" apps/web/src/features/coach apps/web/src/features/choices apps/web/src/app
```

Expected:

```text
/api/coach should appear only in the web coach client/tests.
No frontend Gemini SDK.
No frontend API key.
No localStorage/sessionStorage.
No unsupported percentages/currency/savings claims.
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
git commit -m "feat(coach): add choice coach UI"
git push origin main
```

Use `main` only.

---

# 21. Final Instruction

Implement Task 014 only.

Do not begin Carbon World, tracker, privacy page, assumptions page, or deployment work.

The goal is a safe, user-triggered Choice Coach UI that consumes deterministic Daily Choice Lab context and renders validated AI/fallback explanations without inventing numbers.
