---
name: carboncoach-privacy-and-assumptions
description: Use this skill when implementing Task 017 — Privacy and Assumptions Page for CarbonCoach. This task implements the in-app Privacy & Local Data and Estimates & Assumptions pages using existing privacy metadata, local data policy, calculator assumptions, and safety design. It must not implement deployment, README/submission docs, SECURITY.md, METHODOLOGY.md, new calculator logic, new storage keys, backend persistence, authentication, or fake impact claims.
---

---

# Task 017 — Privacy and Assumptions Page

## Task Purpose

Implement the in-app **Privacy & Local Data** and **Estimates & Assumptions** pages for CarbonCoach.

This task makes CarbonCoach’s trust model visible to users and judges:

```text
Local-first profile and tracker
User-triggered coach requests
Minimized context sent to backend
Approximate deterministic estimates
Transparent assumptions
No formal carbon accounting claims
```

The rule remains:

```text
Deterministic engines decide.
LLMs explain.
Local data stays local unless the user explicitly triggers a coach request.
```

Task 017 must not add new product logic. It is an in-app trust/transparency page implementation task.

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
docs/skills/017-privacy-and-assumptions/SKILLS.md
packages/shared/src/privacy/localDataPolicy.ts
packages/shared/src/privacy/minimizeCoachContext.ts
packages/shared/src/privacy/redaction.ts
packages/shared/src/carbon/assumptions.ts
packages/shared/src/carbon/factorRegistry.ts
packages/shared/src/recommendations/actionCatalog.ts
apps/web/src/features/tracker/LocalDataControls.tsx
apps/web/src/app/AppShell.tsx
apps/web/src/app/navigation.ts
apps/web/src/components/ui
```

Follow `AGENTS.md` if there is any conflict.

---

# 2. Task Scope

## In Scope

Implement real in-app privacy and assumptions content under `apps/web`.

Expected files may include:

```text
apps/web/src/features/privacy/PrivacyLocalDataPage.tsx
apps/web/src/features/privacy/LocalDataPolicyTable.tsx
apps/web/src/features/privacy/CoachDataFlowPanel.tsx
apps/web/src/features/privacy/ClearLocalDataPanel.tsx
apps/web/src/features/privacy/privacyCopy.ts
apps/web/src/features/privacy/PrivacyLocalDataPage.test.tsx
apps/web/src/features/privacy/index.ts

apps/web/src/features/assumptions/AssumptionsPage.tsx
apps/web/src/features/assumptions/AssumptionCategorySection.tsx
apps/web/src/features/assumptions/MethodologyBoundaries.tsx
apps/web/src/features/assumptions/assumptionsCopy.ts
apps/web/src/features/assumptions/AssumptionsPage.test.tsx
apps/web/src/features/assumptions/index.ts

apps/web/src/app/AppShell.tsx
apps/web/src/app/navigation.ts
apps/web/src/app/routes.ts
buildprogresstracker.md
```

Implement:

- Privacy & Local Data page,
- Estimates & Assumptions page,
- local data policy display,
- coach data-flow explanation,
- clear local data integration/reuse,
- methodology boundaries,
- calculation assumption categories,
- “what CarbonCoach does not claim” section,
- accessibility tests,
- tracker update.

## Out of Scope

Do not implement:

- deployment,
- README/submission docs,
- root `SECURITY.md`,
- root `METHODOLOGY.md`,
- new calculator logic,
- new emission factors,
- backend persistence,
- authentication/login,
- database,
- analytics,
- new storage keys,
- new coach endpoints,
- new AI behavior,
- source citation overhaul unless existing assumption metadata already supports it.

Root `SECURITY.md` and `METHODOLOGY.md` belong to Task 018.

---

# 3. Privacy Page Requirements

Create:

```text
apps/web/src/features/privacy/PrivacyLocalDataPage.tsx
```

Page title:

```text
Privacy & Local Data
```

Subtitle:

```text
How CarbonCoach handles your profile, tracker progress, and optional coach requests.
```

The page must explain:

```text
No account is required.
No backend user profile is created.
No database stores your profile.
Your profile and tracker progress are stored in this browser on this device.
You can clear local data from this device.
Coach requests are user-triggered only.
When you click a Coach button, minimized deterministic context is sent to the backend.
Raw localStorage dumps are not sent.
Gemini API keys are never exposed to the frontend.
```

Avoid legalistic overclaiming.

Do not call it a full legal privacy policy.

---

# 4. Local Data Policy Table

Use existing shared metadata from:

```text
packages/shared/src/privacy/localDataPolicy.ts
```

Create:

```text
apps/web/src/features/privacy/LocalDataPolicyTable.tsx
```

Display local policy items in a readable table or card list.

Recommended fields:

```text
Data item
Where it is stored
Purpose
User visible
Clearable
```

Must be understandable to non-technical users.

Example display wording:

```text
Browser local storage
Not stored
Server transient during user-triggered coach request
```

Do not expose raw internal key names as the primary user-facing label unless useful in a technical detail row.

---

# 5. Coach Data Flow Panel

Create:

```text
apps/web/src/features/privacy/CoachDataFlowPanel.tsx
```

Explain the coach flow clearly:

```text
1. You set up a profile locally.
2. CarbonCoach calculates estimates deterministically.
3. You click a Coach button.
4. CarbonCoach sends a minimized context to the backend.
5. The backend asks Gemini or returns deterministic fallback.
6. Numeric Guard checks that the response does not introduce unsupported numbers.
7. The response is shown in the app.
```

Also show what is **not** sent:

```text
No raw localStorage dump
No browser history
No API keys
No hidden identity fields
No raw private notes
```

Keep the wording truthful.

Do not say “nothing is ever sent” because coach requests do send minimized context.

---

# 6. Clear Local Data Panel

Reuse existing local data clearing logic from Task 015.

Create or reuse:

```text
apps/web/src/features/privacy/ClearLocalDataPanel.tsx
```

Requirements:

```text
Show current local data status if available.
Offer clear local data action.
Explain that clearing removes profile and tracker progress from this browser.
Do not clear backend data because no backend profile exists.
Announce confirmation/status accessibly.
```

Avoid duplicating storage logic if existing `LocalDataControls` can be reused.

---

# 7. Assumptions Page Requirements

Create:

```text
apps/web/src/features/assumptions/AssumptionsPage.tsx
```

Page title:

```text
Estimates & Assumptions
```

Subtitle:

```text
How CarbonCoach produces approximate estimates and deterministic recommendations.
```

The page must explain:

```text
CarbonCoach is an awareness tool, not formal carbon accounting.
Estimates are approximate.
Calculations use deterministic TypeScript logic.
Recommendations come from a deterministic action catalog.
AI explains results; it does not calculate them.
Daily Choice Lab uses deterministic scenarios and impact bands.
Carbon World visualizes action completion progress, not measured carbon reduction.
Tracker completion is not proof of emissions reduction.
```

Do not use:

```text
audited
verified reduction
exact science
official footprint
certified
guaranteed savings
```

---

# 8. Assumption Category Sections

Create:

```text
apps/web/src/features/assumptions/AssumptionCategorySection.tsx
```

Recommended sections:

```text
Transport
Food
Home Energy
Shopping & Deliveries
Flights
Recommendations
Daily Choice Lab
AI Coach
Weekly Tracker
Carbon World
```

Each section should include:

```text
What is estimated
What assumptions are used
What is not claimed
```

Keep copy concise but useful.

Example:

```text
Transport estimates use simplified commute-mode and distance inputs. They do not account for exact traffic, vehicle model, passenger load, fuel quality, or route conditions.
```

---

# 9. Methodology Boundaries

Create:

```text
apps/web/src/features/assumptions/MethodologyBoundaries.tsx
```

Include a section titled:

```text
What CarbonCoach does not claim
```

Must include:

```text
It is not a certified carbon accounting tool.
It does not verify real-world emissions reductions.
It does not replace official inventories or audits.
It does not guarantee cost savings.
It does not use AI to invent calculations.
It does not treat tracker completion as proof of carbon reduction.
```

This is important for trust and challenge credibility.

---

# 10. AppShell Integration

Update Privacy and Assumptions routes/sections to render the real pages.

Required:

```text
Privacy nav item should open Privacy & Local Data page.
Assumptions nav item should open Estimates & Assumptions page.
Existing placeholder cards should be removed.
Clear local data behavior should remain consistent with Tracker/Profile controls.
```

Keep other feature screens unchanged.

---

# 11. Accessibility Requirements

Must include:

```text
semantic page headings
section headings
readable lists/tables/cards
table headers if table is used
buttons with accessible names
status messages with aria-live where appropriate
no color-only meaning
keyboard reachable controls
responsive layout
```

Privacy and assumptions pages should be easy to scan.

---

# 12. Copy Safety Requirements

Search and avoid risky wording.

Do not use:

```text
audited
verified reduction
verified emissions
exact
guaranteed
official
certified
kg avoided
emissions saved
reduced emissions
saves ₹
saves $
```

Allowed wording:

```text
approximate estimate
deterministic logic
simplified demo assumptions
may support lower-impact choices
completion progress
user-triggered coach request
minimized context
server transient
local-first
```

---

# 13. Testing Requirements

Add tests for privacy and assumptions pages.

Minimum privacy tests:

```text
renders Privacy & Local Data title
explains local browser storage
explains no account/no backend profile
explains user-triggered coach requests
explains minimized context sent to backend
lists what is not sent
renders local data policy items
renders clear local data control
does not claim nothing is ever sent
does not expose API keys
```

Minimum assumptions tests:

```text
renders Estimates & Assumptions title
explains approximate estimates
explains deterministic calculator
explains AI does not calculate
explains Carbon World is progress metaphor only
explains tracker completion is not proof of carbon reduction
renders what CarbonCoach does not claim
does not use risky words like audited/certified/guaranteed
does not include accidental mixed-language heading
```

Integration tests may verify nav renders the real pages.

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
Task 015 local data controls
```

Avoid:

```text
markdown renderers
table libraries
analytics
privacy SDKs
state libraries
routing libraries
AI SDKs
```

---

# 15. Build Progress Tracker Update

Update `buildprogresstracker.md` for Task 017:

```text
Status: Review Ready
Owner/Agent: Antigravity
Build/Typecheck/Tests/Lint/Format: Pass if passed
Files changed
Summary
Verification commands
Risks/follow-ups
```

Also preserve the committed smoke polish patch entry:

```text
a29c1d9 docs/ui: polish smoke-test copy before privacy page
```

Do not mark Task 017 complete until human review accepts it.

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

Run copy safety checks:

```bash
grep -R "透明\|audited\|certified\|guaranteed\|verified reduction\|verified emissions\|kg avoided\|emissions saved\|reduced emissions\|save ₹\|save \$" apps/web/src/features/privacy apps/web/src/features/assumptions apps/web/src/app

grep -R "nothing is ever sent\|never sent to backend" apps/web/src/features/privacy apps/web/src/features/assumptions

grep -R "VITE_GEMINI_API_KEY\|GoogleGenerativeAI\|@google/generative-ai" apps/web/src
```

Expected:

```text
No risky overclaiming copy.
No accidental mixed-language heading.
No claim that nothing is ever sent.
No frontend Gemini SDK or frontend API key.
```

---

# 17. Acceptance Criteria

Task 017 is successful when:

```text
Privacy & Local Data page exists.
Estimates & Assumptions page exists.
Local data policy is displayed.
Coach data flow is explained accurately.
Clear local data control is available or reused.
Approximate estimate boundaries are explained.
Methodology boundaries are explained.
Carbon World and tracker limitations are explained.
AI role is explained as explanatory, not calculating.
No new product logic is added.
No new storage keys are added.
No backend persistence/auth/database is added.
No deployment docs are added.
No root SECURITY.md or METHODOLOGY.md is added yet.
Tests pass.
Root verification gates pass.
buildprogresstracker.md is updated.
```

---

# 18. Human Review Checklist

Verify:

```text
Privacy page does not say nothing is ever sent.
Privacy page explains minimized coach context.
Assumptions page avoids audited/certified/guaranteed language.
No accidental mixed-language heading remains.
No fake carbon reduction claims.
Clear local data explanation is accurate.
Pages are readable and useful for judges.
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
- copy safety grep checks

Risks / follow-ups
```

---

# 20. Commit Recommendation

After review:

```bash
git add .
git commit -m "feat(trust): add privacy and assumptions pages"
git push origin main
```

Use `main` only.

---

# 21. Final Instruction

Implement Task 017 only.

Do not begin Task 018 demo polish, root SECURITY.md, root METHODOLOGY.md, deployment, README, or submission documentation work.

The goal is to make CarbonCoach’s local-first privacy model and approximate deterministic methodology transparent inside the app.
