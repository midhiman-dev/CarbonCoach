---
name: carboncoach-profile-onboarding
description: Use this skill when implementing Task 009 — Carbon Profile Onboarding Flow for CarbonCoach. This task implements the first real user-input flow using the existing UI primitives and shared carbon domain types. It must not implement footprint results UI, coach API calls, Daily Choice Lab, Carbon World, weekly tracker persistence, privacy page, deployment, or fake AI content.
---

---

# Task 009 — Carbon Profile Onboarding Flow

## Task Purpose

Implement the first real user-facing flow for **CarbonCoach**: a safe, accessible, local-in-memory Carbon Profile Onboarding form.

This task collects the minimal lifestyle inputs needed for the deterministic carbon calculator in later tasks.

The onboarding flow must remain:

```text
privacy-light
non-judgmental
accessible
mobile friendly
safe for demo use
free of identity collection
```

Do not ask for name, email, phone, exact address, income, employer, or any personally identifying data.

---

# 1. Required Reading Before Coding

Read:

```text
AGENTS.md
implementationplan.md
buildprogresstracker.md
docs/architecture/architecture-overview.md
docs/architecture/architecture-decisions.md
docs/skills/009-carbon-profile-onboarding/SKILLS.md
packages/shared/src/types/carbon.ts
packages/shared/src/carbon/calculator.ts
apps/web/src/app/AppShell.tsx
apps/web/src/components/ui
apps/web/src/styles
```

Follow `AGENTS.md` if there is any conflict.

---

# 2. Task Scope

## In Scope

Implement onboarding UI under `apps/web`.

Expected files may include:

```text
apps/web/src/features/profile/ProfileOnboarding.tsx
apps/web/src/features/profile/profileFormModel.ts
apps/web/src/features/profile/profileValidation.ts
apps/web/src/features/profile/profileDefaults.ts
apps/web/src/features/profile/profileCopy.ts
apps/web/src/features/profile/ProfileOnboarding.test.tsx
apps/web/src/features/profile/profileValidation.test.ts
apps/web/src/features/profile/index.ts
apps/web/src/app/AppShell.tsx
apps/web/src/app/navigation.ts
buildprogresstracker.md
```

Implement:

- carbon profile form,
- lightweight validation,
- safe defaults,
- accessible labels/helper text/errors,
- local component state only,
- profile preview/summary after submission,
- clear/reset button,
- truthful placeholder for next step,
- tests.

## Out of Scope

Do not implement:

- persistent localStorage saving,
- weekly tracker,
- footprint results screen,
- charting,
- coach API client,
- AI coach UI,
- Daily Choice Lab,
- Carbon World,
- privacy page,
- assumptions page,
- deployment,
- authentication,
- database.

---

# 3. Data Collection Rules

Use the existing shared `CarbonProfile` type as the target shape.

Collect only broad lifestyle inputs required by the calculator.

Recommended sections:

```text
Transport
Food
Home Energy
Shopping
Flights
Preference
```

Do not collect identity details.

Forbidden fields:

```text
name
email
phone
exact address
GPS location
income
employer
religion
health data
political affiliation
free-text biography
```

City/country may be avoided for P0 unless already required by existing types. Prefer assumption-based demo copy instead.

---

# 4. Recommended Form Fields

Use fields that map cleanly to existing `CarbonProfile`.

The exact field names must match the current shared type.

Suggested user-facing fields:

## Transport

```text
Primary commute mode
Approximate weekly commute distance
Car usage frequency or weekly car km
Public transport usage
```

## Food

```text
Diet pattern
Food waste awareness / weekly waste estimate if supported by type
```

## Home Energy

```text
Household size
Approximate monthly electricity usage or simple usage band
Renewable electricity option if supported
```

## Shopping

```text
Shopping frequency / monthly purchases band
Second-hand or repair preference if supported
```

## Flights

```text
Short flights per year
Long flights per year
```

## Preference

```text
Priority: lowest effort, lowest cost, highest impact, balanced
```

Keep questions simple. This is an awareness product, not a carbon audit.

---

# 5. UX Requirements

The onboarding flow should feel like the revised Stitch direction but should remain practical.

Required UX:

```text
clear title
short explanation
sectioned form
progress or section indicator if simple
helper text explaining approximate inputs
inline validation errors
submit button
reset/clear button
post-submit profile summary
next-step placeholder
```

Recommended title:

```text
Set up your carbon profile
```

Recommended helper copy:

```text
Use approximate values. CarbonCoach is designed for awareness and better everyday choices, not formal carbon accounting.
```

After valid submission, show a profile summary such as:

```text
Profile ready. Your approximate footprint summary will be calculated in the next step.
```

Do not show footprint totals yet.

---

# 6. Accessibility Requirements

Must include:

```text
semantic form
fieldset/legend where useful
labelled inputs/selects
helper text connected with aria-describedby
inline errors connected with aria-describedby or aria-invalid
keyboard reachable controls
visible focus states from Task 008
no color-only errors
screen-reader-friendly success message
```

Avoid custom controls unless they preserve native accessibility.

---

# 7. Validation Requirements

Create lightweight deterministic validation.

Validation should check:

```text
required select fields
numeric fields are numbers
numeric fields are not negative
reasonable upper bounds to prevent accidental absurd inputs
flight counts are whole numbers
household size is at least 1 where applicable
```

Do not over-block users. Prefer helpful messages.

Example safe errors:

```text
Enter 0 or a positive number.
Use a whole number for flight counts.
Choose one option.
This value looks unusually high. Please check it.
```

---

# 8. State Management Rules

Use simple React state only.

Allowed:

```text
useState
small reducer if helpful
```

Do not add:

```text
Redux
Zustand
React Query
localStorage persistence
URL persistence
server persistence
```

Task 009 can keep submitted profile in memory inside the app shell or feature component.

Persistence is a later task.

---

# 9. Integration With App Shell

Update the app shell/navigation so the Profile section shows the onboarding flow.

Keep other sections as truthful placeholders.

Do not turn placeholders into real feature screens yet.

Recommended wording for other sections:

```text
Footprint summary will appear after calculator UI is connected.
AI coach will be connected after calculated results are available.
Daily Choice Lab will be added in a later task.
Carbon World will be added in a later task.
Weekly Tracker will be added in a later task.
```

---

# 10. Styling Requirements

Use Task 008 tokens and primitives.

Do not introduce a new styling system.

The form should follow the premium dark/glass direction:

```text
glass card sections
clear spacing
readable muted text
responsive single-column on mobile
two-column where useful on desktop
```

Do not use fake dashboard stats.

---

# 11. Testing Requirements

Add tests for onboarding and validation.

Minimum tests:

```text
renders onboarding title
renders required sections
inputs/selects have accessible labels
invalid submit shows validation errors
negative numeric input is rejected
flight count requires whole number
valid submit shows profile-ready summary
reset clears form or restores defaults
does not render footprint total
does not call /api/coach
```

Validation unit tests should cover:

```text
valid profile passes
missing required fields fail
negative numbers fail
unusually high numbers fail where bounds exist
flight decimals fail
household size below 1 fails where applicable
```

---

# 12. Dependency Guidance

Do not add new dependencies unless absolutely necessary.

Use existing:

```text
React
Vitest
React Testing Library
shared carbon types
Task 008 UI primitives
```

Avoid:

```text
form libraries
schema libraries
routing libraries
state libraries
date libraries
chart libraries
AI SDKs
```

---

# 13. Build Progress Tracker Update

Update `buildprogresstracker.md` for Task 009:

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

All must pass before marking Task 009 as review-ready.

---

# 15. Acceptance Criteria

Task 009 is successful when:

```text
Profile onboarding flow exists.
It uses the Task 008 app shell and UI primitives.
It maps to the existing shared CarbonProfile type.
It collects only broad lifestyle inputs.
It avoids identity and sensitive data collection.
It validates required and numeric fields.
It shows accessible inline errors.
It shows a profile-ready summary after valid submit.
It does not calculate or display footprint totals.
It does not call the coach API.
It does not persist to localStorage.
It does not implement Daily Choice Lab.
It does not implement Carbon World.
It does not implement tracker.
Tests pass.
Root verification gates pass.
buildprogresstracker.md is updated.
```

---

# 16. Human Review Checklist

Verify:

```text
No identity fields were added.
No exact address/location collection was added.
No footprint total appears.
No fake AI content appears.
No coach API call exists.
No localStorage usage exists.
No premature feature screen exists.
Form is keyboard usable.
Labels and errors are accessible.
Mobile layout is reasonable.
All gates passed.
```

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
git commit -m "feat(profile): add carbon profile onboarding"
git push origin main
```

Use `main` only.

---

# 19. Final Instruction

Implement Task 009 only.

Do not begin footprint summary, coach UI, Daily Choice Lab, Carbon World, tracker, privacy page, or deployment work.

The goal is a safe, accessible, broad-input onboarding flow that prepares a valid CarbonProfile for later deterministic calculation.
