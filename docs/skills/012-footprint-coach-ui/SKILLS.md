---
name: carboncoach-footprint-coach-ui
description: Use this skill when implementing Task 012 — Footprint Coach UI for CarbonCoach. This task connects the calculated footprint summary and deterministic recommendations to the backend /api/coach endpoint and renders safe AI/fallback coach responses. It must not implement Daily Choice Lab, Choice Coach UI, Carbon World, tracker/localStorage, privacy page, assumptions page, deployment, or fake AI content.
---

---

# Task 012 — Footprint Coach UI

## Task Purpose

Implement the **Footprint Coach UI** for CarbonCoach.

This task connects the existing frontend state to the already-implemented backend coach endpoint:

```text
POST /api/coach
```

The Footprint Coach must explain the deterministic footprint estimate and deterministic recommendations in friendly language.

The rule remains:

```text
Deterministic engines decide.
LLMs explain.
```

The UI must not invent footprint numbers, reductions, percentages, savings, or unsupported claims. It must send only minimized, deterministic context to the backend and render only validated `CoachResponse` output returned by the API.

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
docs/skills/012-footprint-coach-ui/SKILLS.md
packages/shared/src/assistant/coachTypes.ts
packages/shared/src/assistant/coachValidation.ts
packages/shared/src/privacy/minimizeCoachContext.ts
packages/shared/src/carbon/calculator.ts
packages/shared/src/recommendations/recommendationEngine.ts
packages/shared/src/recommendations/weeklyPlan.ts
apps/web/src/features/profile
apps/web/src/features/footprint
apps/web/src/features/recommendations
apps/web/src/app/AppShell.tsx
apps/web/src/components/ui
```

Follow `AGENTS.md` if there is any conflict.

---

# 2. Task Scope

## In Scope

Implement the Footprint Coach UI under `apps/web`.

Expected files may include:

```text
apps/web/src/features/coach/FootprintCoachPanel.tsx
apps/web/src/features/coach/CoachResponseCard.tsx
apps/web/src/features/coach/coachClient.ts
apps/web/src/features/coach/coachRequestBuilder.ts
apps/web/src/features/coach/coachCopy.ts
apps/web/src/features/coach/coachViewModel.ts
apps/web/src/features/coach/FootprintCoachPanel.test.tsx
apps/web/src/features/coach/coachRequestBuilder.test.ts
apps/web/src/features/coach/coachClient.test.ts
apps/web/src/features/coach/index.ts
apps/web/src/app/AppShell.tsx
buildprogresstracker.md
```

Implement:

- Footprint Coach panel,
- explicit user-triggered coach request,
- `/api/coach` client for `footprint_coach`,
- request builder using minimized deterministic context,
- allowed numbers extraction,
- loading/error/fallback states,
- response rendering,
- tests,
- app shell integration.

## Out of Scope

Do not implement:

- Choice Coach UI,
- Daily Choice Lab,
- Carbon World,
- weekly tracker persistence,
- localStorage,
- privacy page,
- assumptions page,
- deployment,
- new backend endpoints,
- Gemini SDK in frontend,
- fake coach response text.

---

# 3. Required Data Flow

Use the already-built in-memory flow.

Recommended flow:

```text
ProfileOnboarding submits CarbonProfile
AppShell stores CarbonProfile in component state
calculateFootprint(profile)
rankRecommendedActions(...)
createWeeklyPlan(...)
build footprint coach request using minimized context
user clicks "Ask Footprint Coach"
POST /api/coach
render returned CoachResponse
```

The coach must be **user-triggered only**.

Do not auto-call `/api/coach` on page load or profile submit.

---

# 4. Request Builder Requirements

Create:

```text
apps/web/src/features/coach/coachRequestBuilder.ts
```

Build a `FootprintCoachRequest` using shared contracts.

Required behavior:

```text
mode: footprint_coach
context: minimized footprint coach context
allowedNumbers: deterministic allowed number strings
tone: selected or default tone
```

Use existing shared utilities where possible:

```text
summarizeFootprintContextForCoach
extractAllowedNumbersFromFootprintContext
```

The request must include only:

```text
calculated footprint total
category breakdown
top contributor
confidence
assumption notes
deterministic recommended actions
weekly plan action titles/details if already available
selected user preference
allowedNumbers
```

Forbidden request content:

```text
raw CarbonProfile
identity fields
localStorage dump
full browser state
debug logs
secrets
free-text private data
```

---

# 5. Coach Client Requirements

Create:

```text
apps/web/src/features/coach/coachClient.ts
```

Recommended function:

```ts
export async function requestFootprintCoach(request: FootprintCoachRequest): Promise<CoachResponse>;
```

Requirements:

```text
POST to /api/coach
Content-Type: application/json
safe error handling
no API keys in frontend
no Gemini SDK in frontend
no retries in P0
timeout optional but useful
```

If API call fails, the UI should show a safe message and allow retry.

Do not create a frontend fallback composer. Backend already owns fallback logic.

---

# 6. UI Requirements

Create:

```text
apps/web/src/features/coach/FootprintCoachPanel.tsx
```

The panel should include:

```text
section title
short explanation
tone selector if simple
Ask Footprint Coach button
loading state
safe error state
coach response card
source badge: AI response or Deterministic fallback
numeric safety note
```

Recommended title:

```text
Footprint Coach
```

Recommended description:

```text
Ask CarbonCoach to explain your calculated footprint and deterministic recommendations in plain language.
```

Recommended safety note:

```text
The coach can only use calculated numbers already shown in your estimate.
```

Do not show coach content before the user clicks the button.

---

# 7. Response Rendering Requirements

Create:

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

Use readable headings.

Use `StatusBadge` for source:

```text
AI Response
Deterministic Fallback
```

If `source === 'fallback'`, use clear but non-alarming wording:

```text
Fallback response · safe deterministic explanation
```

Do not expose internal technical errors or provider failures in the user-facing card.

---

# 8. AppShell Integration

Update the app shell so the coach panel appears in the appropriate place.

Preferred placement:

```text
Recommendations section, below deterministic recommendations
```

or:

```text
Footprint section, below footprint summary
```

Keep it clearly separated from deterministic results.

Required behavior:

```text
If no profile exists, show empty state.
If no footprint/recommendations exist, show empty state.
If profile exists, enable user-triggered coach request.
```

Do not add a separate Choice Coach tab yet.

---

# 9. Tone Selector

Optional but recommended.

Allowed tones from shared type:

```text
simple
detailed
encouraging
```

Default:

```text
simple
```

The tone selector must use the accessible `Select` primitive from Task 008.

---

# 10. Safety and Truthfulness Rules

Do not include unsupported content such as:

```text
You reduced your footprint by 15%.
This will save ₹500.
Gemini verified your estimate.
You avoided 20 kg this week.
```

Allowed wording:

```text
The coach explains calculated estimates and deterministic recommendations.
Numbers are restricted to values already present in your estimate.
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
Preparing a safe explanation...
```

Error copy:

```text
The coach could not respond right now. Please try again.
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

Use `aria-live="polite"` for loading/success/error status where practical.

---

# 13. Testing Requirements

Add tests for request builder, client, and UI.

Minimum request builder tests:

```text
builds footprint_coach request
includes allowedNumbers
uses minimized context
does not include raw CarbonProfile-only fields
preserves selected tone
includes deterministic recommendation titles
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
renders empty state when no profile exists
does not call /api/coach on initial render
clicking button calls /api/coach when profile exists
renders loading state
renders coach response fields
renders fallback source badge when source is fallback
renders AI response source badge when source is gemini
renders safe error on failed request
does not render fake AI content before click
does not use localStorage
```

Use fetch mocking.

Do not make real network calls.

---

# 14. Dependency Guidance

Do not add new dependencies unless absolutely necessary.

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
frontend Gemini SDK
AI SDKs in frontend
state libraries
routing libraries
analytics
localStorage helpers
chart libraries
```

---

# 15. Build Progress Tracker Update

Update `buildprogresstracker.md` for Task 012:

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

All must pass before marking Task 012 as review-ready.

---

# 17. Acceptance Criteria

Task 012 is successful when:

```text
Footprint Coach UI exists.
Coach request is user-triggered only.
It builds FootprintCoachRequest from minimized deterministic context.
It includes allowedNumbers.
It does not send raw CarbonProfile.
It calls /api/coach from frontend client.
It renders CoachResponse safely.
It supports loading, success, and error states.
It distinguishes gemini and fallback source.
It does not include frontend Gemini SDK or API key.
It does not implement Choice Coach UI.
It does not implement Daily Choice Lab.
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
No raw profile in request builder.
No auto-call on render.
No coach call before user action.
No fake coach response before click.
No localStorage.
No Choice Coach UI.
No Daily Choice Lab.
No Carbon World.
No stack traces or raw errors in UI.
All gates passed.
```

Useful grep checks:

```bash
grep -R "VITE_GEMINI_API_KEY\|GoogleGenerativeAI\|@google/generative-ai" apps/web/src
grep -R "localStorage\|sessionStorage" apps/web/src/features/coach apps/web/src/app
grep -R "/api/coach" apps/web/src/features/coach apps/web/src/app
```

Only the web coach client should reference `/api/coach`.

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
git commit -m "feat(coach): add footprint coach UI"
git push origin main
```

Use `main` only.

---

# 21. Final Instruction

Implement Task 012 only.

Do not begin Choice Coach, Daily Choice Lab, Carbon World, tracker, privacy page, assumptions page, or deployment work.

The goal is a safe, user-triggered Footprint Coach UI that consumes the backend coach service and renders validated AI/fallback explanations without inventing numbers.
