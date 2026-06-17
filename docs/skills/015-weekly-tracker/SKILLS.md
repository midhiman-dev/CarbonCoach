---

name: carboncoach-weekly-tracker
description: Use this skill when implementing Task 015 — Weekly Tracker and Local Persistence for CarbonCoach. This task implements local-first browser persistence for profile/tracker state and an accessible weekly action tracker UI. It must not implement Carbon World, privacy page, assumptions page, deployment, backend storage, authentication, database, analytics, or fake impact claims.
------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

# Task 015 — Weekly Tracker and Local Persistence

## Task Purpose

Implement the **Weekly Tracker and Local Persistence** layer for CarbonCoach.

This task allows users to keep lightweight progress locally in their browser without login, backend storage, or database.

The goal is to make CarbonCoach feel useful across sessions while preserving the product’s local-first privacy promise.

The rule remains:

```text
Deterministic engines decide.
LLMs explain.
Local data stays local unless the user explicitly triggers a coach request.
```

Task 015 must not create backend persistence, user accounts, analytics, or cloud storage.

---

# 1. Required Reading Before Coding

Read:

```text
AGENTS.md
implementationplan.md
buildprogresstracker.md
docs/architecture/architecture-overview.md
docs/architecture/architecture-decisions.md
docs/skills/015-weekly-tracker/SKILLS.md
packages/shared/src/types/carbon.ts
packages/shared/src/types/actions.ts
packages/shared/src/privacy/localDataPolicy.ts
packages/shared/src/recommendations/recommendationEngine.ts
packages/shared/src/recommendations/weeklyPlan.ts
apps/web/src/features/profile
apps/web/src/features/footprint
apps/web/src/features/recommendations
apps/web/src/features/coach
apps/web/src/features/choices
apps/web/src/app/AppShell.tsx
apps/web/src/components/ui
```

Follow `AGENTS.md` if there is any conflict.

---

# 2. Task Scope

## In Scope

Implement local-first tracker and persistence under `apps/web`, with shared types if useful.

Expected files may include:

```text
packages/shared/src/tracker/trackerTypes.ts
packages/shared/src/tracker/trackerLogic.ts
packages/shared/src/tracker/trackerLogic.test.ts
packages/shared/src/tracker/index.ts
packages/shared/src/index.ts

apps/web/src/features/tracker/WeeklyTracker.tsx
apps/web/src/features/tracker/TrackerActionItem.tsx
apps/web/src/features/tracker/LocalDataControls.tsx
apps/web/src/features/tracker/trackerStorage.ts
apps/web/src/features/tracker/trackerViewModel.ts
apps/web/src/features/tracker/trackerCopy.ts
apps/web/src/features/tracker/WeeklyTracker.test.tsx
apps/web/src/features/tracker/trackerStorage.test.ts
apps/web/src/features/tracker/trackerViewModel.test.ts
apps/web/src/features/tracker/index.ts

apps/web/src/app/AppShell.tsx
apps/web/src/app/navigation.ts
apps/web/src/app/routes.ts
buildprogresstracker.md
```

Implement:

* weekly tracker UI,
* action completion state,
* local browser persistence,
* saved profile restoration if appropriate,
* clear local data control,
* local data status/trust messaging,
* safe progress summary,
* tests.

## Out of Scope

Do not implement:

* backend persistence,
* database,
* authentication/login,
* analytics,
* cloud sync,
* Carbon World,
* privacy page,
* assumptions page,
* deployment,
* AI-generated tracker claims,
* automatic coach requests,
* exact avoided-emissions totals unless derived deterministically and already available.

---

# 3. Local Persistence Rules

Use browser `localStorage` only.

Allowed local data:

```text
submitted CarbonProfile
weekly tracker completion state
selected tracker week id
small UI preferences if needed
```

Do not store:

```text
coach raw prompts
coach raw responses unless explicitly justified
Gemini/API data
API keys
raw private free text
debug logs
browser dumps
identity fields
```

Use a single namespaced storage key or a small set of clearly named keys.

Recommended key prefix:

```text
carboncoach:
```

Examples:

```text
carboncoach:profile
carboncoach:weekly-tracker
```

---

# 4. Storage Utility Requirements

Create:

```text
apps/web/src/features/tracker/trackerStorage.ts
```

Recommended functions:

```ts
export function loadStoredProfile(): CarbonProfile | null;

export function saveStoredProfile(profile: CarbonProfile): void;

export function clearStoredProfile(): void;

export function loadTrackerState(): WeeklyTrackerState | null;

export function saveTrackerState(state: WeeklyTrackerState): void;

export function clearTrackerState(): void;

export function clearAllLocalCarbonCoachData(): void;
```

Requirements:

```text
handle unavailable localStorage safely
handle malformed JSON safely
handle version mismatch safely
never throw during app render
return null or safe defaults on failure
```

Add a simple storage version field for tracker state.

Do not add a persistence library.

---

# 5. Shared Tracker Types and Logic

Create shared tracker logic if useful.

Recommended shared types:

```ts
export interface WeeklyTrackerAction {
  id: string;
  title: string;
  category: string;
  impactBand: string;
  sourceActionId?: string;
}

export interface WeeklyTrackerState {
  version: 1;
  weekId: string;
  completedActionIds: string[];
  updatedAtIso: string;
}
```

Recommended shared/helper functions:

```ts
export function createCurrentWeekId(date?: Date): string;

export function createInitialWeeklyTrackerState(
  weekId?: string,
): WeeklyTrackerState;

export function toggleTrackedAction(
  state: WeeklyTrackerState,
  actionId: string,
): WeeklyTrackerState;

export function isActionCompleted(
  state: WeeklyTrackerState,
  actionId: string,
): boolean;

export function calculateTrackerProgress(
  state: WeeklyTrackerState,
  actionIds: string[],
): {
  completed: number;
  total: number;
  percent: number;
};
```

Progress percent is allowed because it is UI completion percentage, not carbon impact reduction.

---

# 6. Weekly Tracker UI Requirements

Create:

```text
apps/web/src/features/tracker/WeeklyTracker.tsx
```

The UI should include:

```text
section title
short explanation
current week label
action checklist from deterministic weekly plan
completion progress
clear/reset tracker control
local-first data note
empty state before profile setup
```

Recommended title:

```text
Weekly Tracker
```

Recommended description:

```text
Track a few suggested actions for this week. Progress is stored only in this browser.
```

Empty state:

```text
Set up your profile first to create a weekly action tracker.
```

Do not show fake carbon savings.

---

# 7. Tracker Action Source

Use deterministic recommendations/weekly plan generated from the current profile.

Recommended flow:

```text
Profile exists
calculateFootprint(profile)
rankRecommendedActions(...)
createWeeklyPlan(...)
map weekly plan actions into tracker items
render checklist
```

Do not create a separate action catalog in the UI.

Do not use random actions.

Do not call the coach API.

---

# 8. Completion and Progress Rules

Allowed:

```text
3 of 5 actions completed
60% complete
Weekly progress
```

Forbidden unless deterministically available:

```text
You saved 15 kg
You reduced emissions by 20%
You avoided 10 kg this week
You saved ₹500
```

If showing encouragement, keep it qualitative:

```text
Nice progress. Keep going at your own pace.
```

---

# 9. AppShell Integration

Update AppShell to:

```text
load stored profile on initial render if present
save submitted profile locally
render tracker section using stored/in-memory profile
support clear local data control
```

Do not auto-call coach endpoint after restoring profile.

If clear local data is clicked:

```text
clear stored profile
clear tracker state
reset relevant in-memory app state
show safe confirmation message
```

Keep behavior simple and predictable.

---

# 10. Local Data Controls

Create:

```text
apps/web/src/features/tracker/LocalDataControls.tsx
```

It should include:

```text
local data status
clear local data button
short explanation
confirmation before clearing if simple
```

Recommended copy:

```text
Your profile and tracker progress are stored only in this browser. Clearing local data removes them from this device.
```

Use accessible button and status messaging.

Do not build the full privacy page yet.

---

# 11. Accessibility Requirements

Must include:

```text
semantic section headings
accessible empty state
checkboxes with labels
progress text and accessible progress meter
clear data button with accessible name
confirmation/status message announced politely
keyboard reachable controls
no color-only progress
```

Use native checkbox inputs.

Use Task 008 `ProgressMeter` if suitable.

---

# 12. Testing Requirements

Add shared, storage, and UI tests.

Minimum shared logic tests:

```text
creates stable week id
creates initial tracker state
toggles action completion on
toggles action completion off
calculates progress
handles empty action list
does not mutate original state
```

Minimum storage tests:

```text
saves and loads profile
saves and loads tracker state
returns null for missing data
returns null for malformed JSON
handles unavailable localStorage
clears profile
clears tracker state
clears all local CarbonCoach data
```

Minimum UI tests:

```text
renders empty state when no profile exists
renders tracker when profile exists
renders weekly action checkboxes
checking an action updates progress
tracker state is saved locally
restores stored profile/tracker state
clear local data removes stored data
does not call /api/coach
does not render fake carbon savings
does not require backend
```

Use localStorage mocks/spies from the test environment.

Do not make real network calls.

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
state libraries
routing libraries
analytics
database clients
cloud sync libraries
chart libraries
AI SDKs
```

---

# 14. Build Progress Tracker Update

Update `buildprogresstracker.md` for Task 015:

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

All must pass before marking Task 015 as review-ready.

---

# 16. Acceptance Criteria

Task 015 is successful when:

```text
Weekly Tracker UI exists.
Tracker uses deterministic weekly plan actions.
Tracker completion state works.
Tracker progress is displayed accessibly.
Profile can be saved/restored locally.
Tracker state can be saved/restored locally.
Clear local data control exists.
Storage handles malformed/unavailable localStorage safely.
No backend persistence is added.
No auth/database is added.
No /api/coach call is made by tracker.
No Carbon World is implemented.
No privacy page is implemented.
No fake carbon savings claims appear.
Tests pass.
Root verification gates pass.
buildprogresstracker.md is updated.
```

---

# 17. Human Review Checklist

Verify:

```text
No backend storage.
No database/auth.
No analytics.
No /api/coach reference in tracker.
No fake kg avoided/savings claims.
No unsupported percentages except tracker completion percent.
No localStorage keys outside carboncoach namespace.
Clear local data works.
Malformed storage does not crash the app.
Profile restoration does not auto-call coach.
All gates passed.
```

Useful grep checks:

```bash
grep -R "/api/coach\|GoogleGenerativeAI\|VITE_GEMINI_API_KEY" apps/web/src/features/tracker apps/web/src/app
grep -R "saved [0-9]\|avoided\|save ₹\|save \$\|reduced emissions\|kg avoided" apps/web/src/features/tracker apps/web/src/app
grep -R "localStorage" apps/web/src/features/tracker apps/web/src/app
```

Expected:

```text
No coach/Gemini/API key hits.
No fake impact/savings claims.
localStorage appears only in tracker storage utilities/tests or controlled AppShell integration.
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
git commit -m "feat(tracker): add weekly tracker and local persistence"
git push origin main
```

Use `main` only.

---

# 20. Final Instruction

Implement Task 015 only.

Do not begin Carbon World, privacy page, assumptions page, deployment, README, or submission documentation work.

The goal is a local-first weekly tracker that stores only broad profile and tracker progress in the user’s browser.
