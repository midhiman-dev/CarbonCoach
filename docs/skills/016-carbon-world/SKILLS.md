---
name: carboncoach-carbon-world
description: Use this skill when implementing Task 016 — Carbon World Engine and Lightweight Visual UI for CarbonCoach. This task implements a deterministic progress/world-state engine and accessible lightweight SVG/CSS visual UI based on local tracker progress. It must not implement Three.js, heavy animation, backend storage, coach calls, privacy page, assumptions page, deployment, or fake impact claims.
---

---

# Task 016 — Carbon World Engine and Lightweight Visual UI

## Task Purpose

Implement **Carbon World**, a lightweight visual progress experience for CarbonCoach.

Carbon World should turn weekly action progress into a simple, motivating visual state using deterministic local tracker data.

The purpose is not to simulate climate science. It is to make progress feel visible and encouraging.

The rule remains:

```text
Deterministic engines decide.
LLMs explain.
Local tracker progress drives Carbon World visuals.
```

Task 016 must not claim verified carbon reduction, avoided emissions, or real-world environmental impact. It should visualize action progress only.

---

# 1. Required Reading Before Coding

Read:

```text
AGENTS.md
implementationplan.md
buildprogresstracker.md
docs/architecture/architecture-overview.md
docs/architecture/architecture-decisions.md
docs/skills/016-carbon-world/SKILLS.md
packages/shared/src/tracker/trackerTypes.ts
packages/shared/src/tracker/trackerLogic.ts
apps/web/src/features/tracker
apps/web/src/features/recommendations
apps/web/src/app/AppShell.tsx
apps/web/src/components/ui
apps/web/src/styles
```

Follow `AGENTS.md` if there is any conflict.

---

# 2. Task Scope

## In Scope

Implement Carbon World deterministic engine and lightweight UI.

Expected shared files may include:

```text
packages/shared/src/world/worldTypes.ts
packages/shared/src/world/worldEngine.ts
packages/shared/src/world/worldEngine.test.ts
packages/shared/src/world/index.ts
packages/shared/src/index.ts
```

Expected web files may include:

```text
apps/web/src/features/world/CarbonWorld.tsx
apps/web/src/features/world/CarbonWorldScene.tsx
apps/web/src/features/world/CarbonWorldStatus.tsx
apps/web/src/features/world/worldViewModel.ts
apps/web/src/features/world/worldCopy.ts
apps/web/src/features/world/CarbonWorld.test.tsx
apps/web/src/features/world/worldViewModel.test.ts
apps/web/src/features/world/index.ts
apps/web/src/app/AppShell.tsx
apps/web/src/app/navigation.ts
apps/web/src/app/routes.ts
buildprogresstracker.md
```

Implement:

- deterministic world-state engine,
- lightweight visual scene using SVG/CSS/HTML,
- tracker-progress-based state,
- accessible world status text,
- no-profile/no-tracker empty state,
- tests,
- AppShell integration,
- tracker update.

## Out of Scope

Do not implement:

- Three.js,
- Canvas/WebGL,
- heavy animation,
- physics simulation,
- climate simulation,
- backend calls,
- coach calls,
- localStorage changes beyond reading existing tracker/profile state through AppShell/state,
- privacy page,
- assumptions page,
- deployment,
- fake impact claims.

---

# 3. Carbon World Concept

Carbon World should be a simple visual metaphor.

Recommended world states:

```text
seed
sprout
garden
grove
```

or:

```text
quiet
warming-up
growing
thriving
```

The state should be based on tracker completion progress, not carbon reduction.

Example mapping:

```text
0% complete: Seed state
1–33% complete: Sprout state
34–66% complete: Garden state
67–100% complete: Grove state
```

This is allowed because it is completion progress, not emissions reduction.

---

# 4. Shared World Types

Create:

```text
packages/shared/src/world/worldTypes.ts
```

Recommended types:

```ts
export type CarbonWorldStage = 'seed' | 'sprout' | 'garden' | 'grove';

export interface CarbonWorldState {
  stage: CarbonWorldStage;
  completedActions: number;
  totalActions: number;
  progressPercent: number;
  title: string;
  description: string;
  encouragement: string;
}
```

Keep types simple.

---

# 5. Shared World Engine

Create:

```text
packages/shared/src/world/worldEngine.ts
```

Recommended functions:

```ts
export function getCarbonWorldStage(progressPercent: number): CarbonWorldStage;

export function createCarbonWorldState(input: {
  completedActions: number;
  totalActions: number;
}): CarbonWorldState;
```

Rules:

```text
progress is action completion progress only
clamp percent between 0 and 100
handle totalActions = 0 safely
do not use random values
do not calculate emissions
do not claim avoided carbon
```

Allowed wording:

```text
Your action garden is starting to grow.
You completed 2 of 5 weekly actions.
Keep going at your own pace.
```

Forbidden wording:

```text
You saved 15 kg CO2e.
You reduced your emissions by 20%.
You avoided emissions this week.
Your actions cooled the planet.
```

---

# 6. Visual UI Requirements

Create:

```text
apps/web/src/features/world/CarbonWorld.tsx
```

The UI should include:

```text
section title
short explanation
world visual
current stage label
progress meter
completed action count
encouragement text
local-first note
empty state before tracker/profile setup
```

Recommended title:

```text
Carbon World
```

Recommended description:

```text
A lightweight visual reflection of your weekly action progress. It is not a carbon accounting result.
```

Empty state:

```text
Set up your profile and start your weekly tracker to grow your Carbon World.
```

---

# 7. Lightweight Scene Requirements

Create:

```text
apps/web/src/features/world/CarbonWorldScene.tsx
```

Use:

```text
SVG
CSS gradients
simple HTML/CSS shapes
```

Do not use:

```text
Three.js
Canvas
WebGL
large animation libraries
remote images
heavy assets
```

The scene should vary by stage.

Examples:

```text
seed: small seed/soil shape
sprout: small sprout
garden: plants and soft sky
grove: fuller trees/greenery
```

The visual must have an accessible text alternative.

Recommended:

```tsx
<div
  role="img"
  aria-label="Carbon World stage: Sprout. Your weekly action progress is starting to grow."
>
  ...
</div>
```

---

# 8. Status and Copy Requirements

Create:

```text
apps/web/src/features/world/CarbonWorldStatus.tsx
```

Display:

```text
stage label
completed actions / total actions
progress percentage
encouragement
disclaimer
```

Allowed progress label:

```text
Weekly action progress: 3 of 5 actions complete
```

Forbidden labels:

```text
Avoided impact progress
Emissions saved
Carbon reduced
```

---

# 9. Data Flow Requirements

Use tracker progress from Task 015.

Recommended flow:

```text
Profile exists
Weekly plan actions exist
Tracker state exists
calculateTrackerProgress(...)
createCarbonWorldState(...)
render world UI
```

The Carbon World should not manage persistence directly.

It may receive props from `AppShell` or tracker view model.

Do not read/write localStorage directly in Carbon World unless absolutely necessary. Prefer using existing tracker/AppShell state.

---

# 10. AppShell Integration

Update the Carbon World section to render the real Carbon World UI.

Expected behavior:

```text
No profile/tracker actions: show empty state
Profile and tracker actions available: show world state
Tracker completion changes: world state updates
```

Keep the tracker itself in the Tracker section.

Do not duplicate persistence logic.

---

# 11. Accessibility Requirements

Must include:

```text
semantic section headings
accessible empty state
visual scene has text alternative
progress meter has readable label
stage is shown as text
no color-only meaning
keyboard reachable controls if any
reduced-motion friendly styling
```

Carbon World may be mostly read-only.

Do not create focus traps or hidden interactive elements.

---

# 12. Testing Requirements

Add shared and UI tests.

Minimum shared engine tests:

```text
0% maps to seed
low progress maps to sprout
mid progress maps to garden
high/full progress maps to grove
clamps negative progress to 0
clamps above 100 to 100
handles totalActions = 0 safely
does not mutate input
```

Minimum UI tests:

```text
renders Carbon World title
renders empty state when no tracker actions exist
renders stage label when actions exist
renders completed actions count
renders progress meter text
updates stage when progress changes
renders accessible scene label
does not render avoided/saved emissions claims
does not call /api/coach
does not use localStorage directly in world feature
```

Use React Testing Library.

Do not make network calls.

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
Task 015 tracker logic
```

Avoid:

```text
Three.js
Canvas libraries
animation libraries
chart libraries
state libraries
AI SDKs
localStorage helpers inside world feature
```

---

# 14. Build Progress Tracker Update

Update `buildprogresstracker.md` for Task 016:

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

All must pass before marking Task 016 as review-ready.

---

# 16. Acceptance Criteria

Task 016 is successful when:

```text
Shared Carbon World engine exists.
Carbon World UI exists.
World stage is based on weekly tracker completion progress.
Visual UI is lightweight SVG/CSS/HTML.
Accessible text alternative exists.
Progress text is shown.
Empty state exists.
No Three.js/Canvas/WebGL is added.
No backend or coach calls are added.
No localStorage logic is added inside world feature.
No fake carbon savings/avoidance claims appear.
Tests pass.
Root verification gates pass.
buildprogresstracker.md is updated.
```

---

# 17. Human Review Checklist

Verify:

```text
No Three.js.
No heavy animation dependency.
No /api/coach reference in world feature.
No localStorage/sessionStorage in world feature.
No “saved kg”, “avoided emissions”, “reduced emissions” claims.
World state is completion-progress based only.
Scene is accessible.
All gates passed.
```

Useful grep checks:

```bash
grep -R "three\|canvas\|webgl\|framer\|lottie" package.json apps/web/src/features/world packages/shared/src/world
grep -R "/api/coach\|localStorage\|sessionStorage" apps/web/src/features/world packages/shared/src/world
grep -R "saved [0-9]\|avoided\|save ₹\|save \$\|reduced emissions\|kg avoided\|emissions saved" apps/web/src/features/world packages/shared/src/world apps/web/src/app
```

Expected:

```text
No heavy visual libraries.
No coach/storage references in world feature.
No fake impact/savings claims.
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
git commit -m "feat(world): add carbon world progress UI"
git push origin main
```

Use `main` only.

---

# 20. Final Instruction

Implement Task 016 only.

Do not begin privacy page, assumptions page, deployment, README, or submission documentation work.

The goal is a lightweight, accessible Carbon World that visualizes weekly action completion progress without claiming measured carbon impact.
