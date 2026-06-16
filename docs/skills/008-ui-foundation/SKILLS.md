---
name: carboncoach-ui-foundation
description: Use this skill when implementing Task 008 — Accessible UI Foundation and App Shell for CarbonCoach. This task converts the approved Stitch visual direction into a real accessible React app shell and reusable UI primitives only. It must not implement onboarding, footprint calculation UI, coach API integration, Daily Choice Lab, Carbon World engine, tracker, privacy page, or deployment.
---

---

# Task 008 — Accessible UI Foundation and App Shell

## Task Purpose

Implement the accessible frontend foundation for **CarbonCoach**.

This task turns the approved Stitch design direction into a real React/Vite app shell, layout system, design tokens, and reusable UI primitives.

Task 008 is **not** a product feature task. It creates the UI foundation that later tasks will use.

The approved visual direction is:

```text
Premium dark CarbonCoach dashboard
Obsidian / deep navy background
Glass-style cards
Clear sidebar/top navigation
Accessible card hierarchy
Scenario-aware dashboard structure
Visible privacy/trust indicator
Impact badges with text labels
Responsive desktop and mobile layout direction
```

The UI must preserve CarbonCoach rules:

```text
Deterministic engines decide.
LLMs explain.
```

Do not show fake product data, fake AI responses, unsupported percentages, unsupported savings, or fake currency values.

---

# 1. Required Reading Before Coding

Read:

```text
AGENTS.md
implementationplan.md
buildprogresstracker.md
docs/architecture/architecture-overview.md
docs/architecture/architecture-diagrams.md
docs/architecture/architecture-decisions.md
docs/architecture/llm-safety-design.md
docs/architecture/numeric-invention-guard.md
docs/skills/008-ui-foundation/SKILLS.md
```

Follow `AGENTS.md` if there is any conflict.

---

# 2. Task Scope

## In Scope

Implement frontend foundation in `apps/web`.

Expected files may include:

```text
apps/web/src/app/AppShell.tsx
apps/web/src/app/navigation.ts
apps/web/src/app/routes.ts
apps/web/src/components/ui/Button.tsx
apps/web/src/components/ui/Card.tsx
apps/web/src/components/ui/Container.tsx
apps/web/src/components/ui/Input.tsx
apps/web/src/components/ui/Select.tsx
apps/web/src/components/ui/StatusBadge.tsx
apps/web/src/components/ui/ProgressMeter.tsx
apps/web/src/components/ui/EmptyState.tsx
apps/web/src/components/ui/SectionHeader.tsx
apps/web/src/components/ui/TrustIndicator.tsx
apps/web/src/components/ui/index.ts
apps/web/src/styles/tokens.css
apps/web/src/styles/global.css
apps/web/src/styles/layout.css
apps/web/src/test/accessibility-smoke.test.tsx
apps/web/src/App.tsx
buildprogresstracker.md
```

Implement:

- app shell layout,
- responsive navigation structure,
- design tokens,
- global CSS baseline,
- reusable UI primitives,
- accessible status badges,
- accessible progress meter,
- placeholder dashboard landing section,
- trust/privacy indicator placeholder,
- skip link,
- keyboard focus styles,
- baseline accessibility smoke tests.

## Out of Scope

Do not implement:

- full onboarding flow,
- real footprint summary UI,
- calls to shared calculator from UI,
- `/api/coach` client,
- Footprint Coach UI integration,
- Choice Coach UI integration,
- Daily Choice Lab,
- Carbon World visual/engine,
- tracker/localStorage,
- privacy page,
- assumptions page,
- Cloud Run deployment,
- Dockerfile.

---

# 3. Stitch Direction Translation Rules

Use the revised Stitch direction as a visual reference, not as literal product implementation.

## Keep

```text
dark premium background
glassmorphism-style cards
left navigation on desktop
compact top/mobile navigation behavior
dashboard-style content grid
trust/privacy indicator
impact status badges with text
large readable headings
clear card hierarchy
mobile responsive stacking
```

## Change / Avoid

Do not include unsupported precise claims such as:

```text
reduce by 15%
reduces emissions by 85%
save $8
+15 kg avoided
```

unless those values are deterministic and implemented in later tasks.

For Task 008, use placeholders that do not imply completed feature behavior.

Allowed placeholder wording:

```text
Feature foundation ready
Estimate will appear after onboarding
Coach response will appear after setup
Scenario comparison will be added in a later task
Local-first privacy model
Approximate estimates and assumptions will be shown
```

---

# 4. App Shell Requirements

Create a real app shell that includes:

```text
skip link
landmark structure
sidebar or header navigation
main content region
responsive layout
footer or small trust note if useful
```

Recommended landmark structure:

```tsx
<a href="#main-content">Skip to content</a>
<header>...</header>
<nav aria-label="Primary navigation">...</nav>
<main id="main-content">...</main>
```

The landing content may show foundation cards for future areas:

```text
Profile Setup
Footprint Summary
AI Coach
Daily Choice Lab
Carbon World
Weekly Tracker
Privacy & Assumptions
```

These should be clearly marked as foundation/coming soon, not implemented features.

---

# 5. Navigation Requirements

Create navigation data in a separate file.

Recommended nav items:

```text
Overview
Profile
Footprint
Choice Lab
Carbon World
Tracker
Privacy
Assumptions
```

In Task 008, navigation does not need real routing. It may use anchor-style placeholders or disabled/foundation states.

Do not introduce routing library unless already present or clearly necessary.

Navigation must be:

- text labelled,
- keyboard reachable,
- visible focus state,
- not icon-only,
- usable on mobile.

---

# 6. UI Primitive Requirements

## 6.1 Button

Create a reusable `Button`.

Requirements:

```text
supports variant
supports type
supports disabled
preserves accessible name
has visible focus
does not use div as button
```

Suggested variants:

```text
primary
secondary
ghost
danger
```

## 6.2 Card

Create a reusable `Card`.

Requirements:

```text
semantic wrapper
supports heading/content
works in responsive grid
does not force inaccessible contrast
```

## 6.3 Input and Select

Create basic accessible form primitives for future tasks.

Requirements:

```text
label required
id linking
error text support
helper text support
disabled support
```

Do not build actual onboarding form yet.

## 6.4 StatusBadge

Create a badge that never relies on color alone.

Examples:

```text
Approximate Estimate
Low Impact Band
Moderate Impact Band
High Impact Band
Local-first
Fallback Ready
```

Badge must include readable text.

## 6.5 ProgressMeter

Create accessible progress meter primitive for later tracker/Carbon World use.

Requirements:

```text
uses semantic progressbar or native progress where practical
has aria label
shows text value
does not rely on color alone
```

## 6.6 TrustIndicator

Create a reusable trust/privacy indicator for future app shell.

Example text:

```text
Local-first · Coach requests are user-triggered · Assumptions visible
```

No claim that Gemini is active unless Task 007 endpoint is called in future UI.

Since Task 007 exists, it is okay to say:

```text
Backend coach endpoint ready
```

but avoid implying UI integration exists.

---

# 7. Styling Requirements

Create design tokens.

Recommended token categories:

```text
colors
spacing
radius
shadow
font sizes
layout widths
focus ring
```

Recommended visual direction:

```text
background: deep navy / obsidian
cards: translucent dark surfaces
accent: green/teal for positive action
warning/high impact: warm text + label, not color only
text: high contrast off-white
muted text: still readable
```

Keep CSS maintainable.

Avoid:

```text
one huge unstructured global CSS dump
inline style sprawl
heavy animation
external UI framework
Tailwind introduction unless explicitly approved
```

---

# 8. Accessibility Requirements

Task 008 must establish accessibility habits.

Must include:

```text
skip link
semantic landmarks
visible focus styles
text-labelled navigation
labelled inputs/selects
buttons with accessible names
non-color-only status badges
responsive/mobile readable layout
no keyboard traps
```

Add accessibility smoke tests where practical.

Recommended test file:

```text
apps/web/src/test/accessibility-smoke.test.tsx
```

Test examples:

```text
renders main landmark
renders app heading
renders primary navigation with accessible label
renders skip link
renders labelled input primitive
renders labelled select primitive
renders status badge text
button is keyboard-focusable by default
```

Do not add axe dependency unless already approved. React Testing Library is enough for Task 008.

---

# 9. Placeholder Content Rules

Task 008 may show placeholder dashboard cards, but must stay truthful.

Good placeholder copy:

```text
Your footprint summary will appear after profile setup.
AI coaching will explain calculated results after the coach flow is connected.
Daily Choice Lab will compare everyday scenarios using impact bands.
Carbon World will show progress once tracking is added.
```

Bad placeholder copy:

```text
You saved 15 kg this week.
Gemini verified your estimate.
Your footprint dropped by 20%.
Metro saves $8.
```

---

# 10. Testing Requirements

Add or update frontend tests.

Minimum required tests:

```text
App renders CarbonCoach shell
Main landmark exists
Primary navigation exists with accessible label
Skip link exists
StatusBadge renders readable text
Input primitive has associated label
Select primitive has associated label
Button renders accessible button
ProgressMeter exposes accessible text/value
```

Do not over-test visual CSS details.

---

# 11. Dependency Guidance

Do not add heavy UI dependencies.

Allowed if already present:

```text
React
React Testing Library
Vitest
jsdom
```

Avoid:

```text
Tailwind
Material UI
Chakra
Radix
Framer Motion
Three.js
chart libraries
icon packs
routing libraries
state libraries
```

If icons are needed, use text/emoji/simple inline SVG sparingly and accessibly.

---

# 12. Build Progress Tracker Update

Update `buildprogresstracker.md` for Task 008:

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

# 13. Verification Commands

Run from repo root:

```bash
npm run build
npm run typecheck
npm run test
npm run lint
npm run format:check
```

All must pass before marking Task 008 as review-ready.

---

# 14. Acceptance Criteria

Task 008 is successful when:

```text
App shell exists.
Approved Stitch direction is reflected in layout and visual language.
Reusable UI primitives exist.
Design tokens exist.
Responsive layout baseline exists.
Navigation is text-labelled and keyboard reachable.
Skip link exists.
Visible focus style exists.
Status badges are non-color-only.
Input/select primitives are labelled.
Accessibility smoke tests exist and pass.
No real product flows were implemented.
No coach API client was added.
No calculator UI was added.
No Daily Choice Lab implementation was added.
No tracker/localStorage was added.
No Carbon World implementation was added.
Root verification gates pass.
buildprogresstracker.md is updated.
```

---

# 15. Human Review Checklist

Verify:

```text
Visual direction matches revised Stitch concept.
No unsupported numeric claims appear.
No fake AI response appears.
No fake savings or currency values appear.
No UI flow was prematurely implemented.
Components are reusable and small.
CSS is organized.
Keyboard/focus basics are present.
Mobile layout is reasonable.
All gates passed.
```

---

# 16. Expected Agent Report Format

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

# 17. Commit Recommendation

After review:

```bash
git add .
git commit -m "feat(ui): add accessible app shell and primitives"
git push origin main
```

Use `main` only.

---

# 18. Final Instruction

Implement Task 008 only.

Do not begin onboarding, footprint summary, Choice Lab, Carbon World, tracker, or privacy page implementation until their respective tasks.

The goal is a clean, accessible, reusable UI foundation that can safely support the real product flows in Tasks 009–014.
