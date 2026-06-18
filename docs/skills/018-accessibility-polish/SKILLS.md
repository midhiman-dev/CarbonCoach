---
name: carboncoach-final-ux-demo-polish-trust-docs
description: Use this skill when implementing Task 018 — Final UX/Demo Polish + Trust Documentation for CarbonCoach. This task makes the app more visual, less text-heavy, more Gen Z / millennial friendly, and more demo-ready while adding root SECURITY.md and METHODOLOGY.md. It must not add new core product logic, deployment, backend persistence, auth, database, new AI behavior, or unsupported carbon impact claims.
---

---

# Task 018 — Final UX/Demo Polish + Trust Documentation

## Task Purpose

Improve CarbonCoach’s final product feel before deployment.

This task should make CarbonCoach more:

```text
visual
scannable
modern
trustworthy
demo-ready
Gen Z / millennial friendly
```

The current product is functional but text-heavy. Task 018 should reduce visible text on primary user-facing surfaces and use stronger visual hierarchy, icons, stage cards, compact CTAs, progress visuals, and trust badges to communicate quickly.

This is a UX/demo polish and trust documentation task.

The rule remains:

```text
Deterministic engines decide.
LLMs explain.
Local data stays local unless the user explicitly triggers a coach request.
Visuals should motivate, not overclaim.
```

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
docs/skills/018-accessibility-polish/SKILLS.md
apps/web/src/app/AppShell.tsx
apps/web/src/app/navigation.ts
apps/web/src/components/ui
apps/web/src/features/profile
apps/web/src/features/footprint
apps/web/src/features/recommendations
apps/web/src/features/coach
apps/web/src/features/choices
apps/web/src/features/tracker
apps/web/src/features/world
apps/web/src/features/privacy
apps/web/src/features/assumptions
packages/shared/src
```

Follow `AGENTS.md` if there is any conflict.

---

# 2. Task Scope

## In Scope

Expected files may include:

```text
SECURITY.md
METHODOLOGY.md

apps/web/src/features/overview/OverviewDashboard.tsx
apps/web/src/features/overview/JourneyProgress.tsx
apps/web/src/features/overview/TrustStrip.tsx
apps/web/src/features/overview/NextBestActionCard.tsx
apps/web/src/features/overview/OverviewHero.tsx
apps/web/src/features/overview/overviewCopy.ts
apps/web/src/features/overview/OverviewDashboard.test.tsx
apps/web/src/features/overview/index.ts

apps/web/src/features/world/CarbonWorld.tsx
apps/web/src/features/world/CarbonWorldScene.tsx
apps/web/src/features/recommendations/RecommendationPanel.tsx
apps/web/src/features/recommendations/RecommendationCard.tsx
apps/web/src/features/profile/ProfileOnboarding.tsx
apps/web/src/features/footprint/FootprintSummary.tsx
apps/web/src/features/tracker/WeeklyTracker.tsx
apps/web/src/app/AppShell.tsx
apps/web/src/app/navigation.ts
apps/web/src/styles/*.css

buildprogresstracker.md
implementationplan.md if needed only for brief Task 018 status/notes
```

Implement:

- visual-first Overview dashboard,
- stronger hero and trust proposition,
- guided journey path,
- next-step CTA cards,
- more prominent Carbon World placement,
- reduced recommendation density,
- tighter user-facing copy,
- better icon/badge usage,
- root `SECURITY.md`,
- root `METHODOLOGY.md`,
- tests for key polish behavior,
- tracker update.

## Out of Scope

Do not implement:

- new calculator logic,
- new recommendation ranking logic,
- new tracker logic,
- new coach behavior,
- new backend endpoints,
- deployment,
- auth/login,
- database,
- analytics,
- receipt scanning,
- OCR,
- regional benchmark datasets,
- gamified currency,
- animal companion system,
- unsupported savings/impact claims.

---

# 3. UX Direction

Move CarbonCoach from:

```text
text-heavy engineering dashboard
```

toward:

```text
visual-first trustworthy climate companion
```

Do not copy another product’s design. Keep CarbonCoach’s identity:

```text
local-first
deterministic
safe AI
calm but premium
carbon awareness over carbon guilt
```

The UI should feel:

```text
modern
clean
high-contrast
card-based
quick to scan
mobile-friendly
motivational
not preachy
```

---

# 4. Copy Reduction Rules

Primary user-facing screens should use less text.

Apply these rules:

```text
One clear heading per card.
One short sentence max for most card descriptions.
Prefer badges, icons, progress, and compact labels.
Move longer explanations to Privacy & Local Data or Estimates & Assumptions.
Avoid repeated disclaimers on every card.
Use tooltip-like helper copy sparingly if existing patterns support it.
```

Examples:

Replace:

```text
These actions are selected from CarbonCoach’s deterministic action catalog based on your profile, estimated footprint, and selected priority.
```

With:

```text
Personalized from your profile and priority.
```

Replace:

```text
This estimate is based on your profile inputs and CarbonCoach demo assumptions. It is designed for awareness and better everyday choices, not formal carbon accounting.
```

With:

```text
Approximate estimate · awareness only
```

Keep detailed methodology on Task 017 pages.

---

# 5. Visual Icon Guidance

Use simple inline SVGs, emoji, or existing lightweight icon patterns.

Allowed:

```text
small inline SVG icons
emoji if visually consistent
CSS shapes
badges
progress rings using CSS/SVG
simple visual stepper
```

Avoid:

```text
large icon libraries
remote images
heavy animation packages
new chart libraries
Three.js
Canvas/WebGL
```

Icons must have accessible labels or be marked decorative as appropriate.

Do not rely on icons alone.

---

# 6. Overview Dashboard Upgrade

Create or refactor:

```text
apps/web/src/features/overview/OverviewDashboard.tsx
```

The Overview should become the app’s main story screen.

Recommended structure:

```text
Hero
Trust strip
Journey progress
Key status cards
Carbon World preview
Next best action
```

## 6.1 Hero

Recommended hero copy:

```text
Understand your footprint.
Choose better every week.
```

Subcopy:

```text
Approximate estimates, deterministic action plans, and optional AI explanations — with local-first privacy.
```

Use strong visual layout, not large paragraphs.

## 6.2 Trust Strip

Use compact trust badges:

```text
Local-first
Deterministic estimates
Numeric-guarded coach
No account needed
```

Each badge should have text and optional icon.

## 6.3 Journey Progress

Show the CarbonCoach journey visually:

```text
Profile → Footprint → Actions → Tracker → Carbon World
```

Each step should show:

```text
Complete
Current
Next
Pending
```

Use visual states and concise labels.

## 6.4 Key Status Cards

Use compact cards:

```text
Profile
Footprint
Weekly Plan
Tracker
Choice Lab
Carbon World
```

Each card should have:

```text
icon
short status
primary CTA if relevant
```

Example:

```text
Profile
Configured
View profile
```

## 6.5 Next Best Action

Add a prominent CTA card based on current state:

```text
No profile -> Set up profile
Profile exists, no tracker actions -> Start weekly tracker
Tracker active -> Complete next action
All actions complete -> View Carbon World
```

Do not implement complex business logic. Keep it simple and deterministic.

---

# 7. Carbon World Prominence

Carbon World should feel like the emotional anchor of the product.

Improve:

```text
Overview preview card
Carbon World page layout
stage visual scale
stage labels
progress presentation
```

Recommended Overview copy:

```text
Your Carbon World grows from weekly action progress.
```

Recommended page copy:

```text
A visual reflection of action progress — not a carbon accounting result.
```

Make the visual richer while staying lightweight.

Allowed enhancements:

```text
larger SVG scene
stage-specific background gradients
more plants/trees per stage
subtle CSS transitions respecting reduced motion
stage badge
```

Do not add fake environmental impact claims.

---

# 8. Recommendation Density Reduction

The Recommendations page currently feels too long.

Change it to be more demo-friendly:

```text
Show suggested weekly plan first.
Show top 3 recommended actions by default.
Collapse or hide the rest behind “Show more actions.”
```

Rules:

```text
Do not change shared ranking logic.
Do not remove recommendations from data.
Only change presentation density.
```

Use a CTA:

```text
Show all deterministic actions
```

Avoid long repeated assumption text on every card. Use a compact “Why this fits” area.

---

# 9. Next-Step CTAs Across Screens

Add clear next-step CTAs:

## Profile

After profile saved:

```text
View footprint summary
```

## Footprint

After estimate exists:

```text
See recommended actions
```

## Recommendations

After weekly plan exists:

```text
Start weekly tracker
```

## Tracker

After actions tracked:

```text
View Carbon World
```

## Carbon World

Show:

```text
Complete more weekly actions
```

or:

```text
Review next suggested action
```

Use existing navigation/state handling. Do not add a routing library.

---

# 10. Surface-Specific Polish

## Profile

Reduce text density in saved summary.

Prefer compact chips:

```text
Commute
Diet
Home energy
Shopping
Flights
Priority
```

## Footprint

Make the total and top contributor visually stronger.

Use:

```text
large total
compact category cards
clear “approximate” badge
```

Move long assumptions away from the main surface if already covered in Assumptions page. Keep a short link/CTA:

```text
View assumptions
```

## Recommendations

Compact the cards.

Use:

```text
action title
impact/effort/cost badges
one-sentence reason
```

Avoid repeated long assumption paragraphs.

## Daily Choice Lab

Keep scenario comparison visual.

Make recommended option more visually obvious, but not color-only.

## Tracker

Make progress more visual.

Use completion progress only:

```text
2 of 3 actions complete
```

Do not use “avoided impact,” “emissions saved,” or “kg avoided.”

## Privacy / Assumptions

These can remain more text-oriented, but improve scannability with:

```text
icons
section cards
short labels
tables/cards
```

Do not remove critical trust explanations.

---

# 11. Trust Documentation

Create root:

```text
SECURITY.md
METHODOLOGY.md
```

Do not make these overly long. They should be clear and credible for judges.

---

# 12. SECURITY.md Requirements

Root `SECURITY.md` should include:

```text
Prototype scope
No account or login
No backend user database
Local-first browser storage
What is stored locally
What is sent to backend on coach request
Gemini API key is server-side only
No VITE_GEMINI_API_KEY
Numeric Guard and fallback behavior
No raw prompt/context logging policy
Clear local data control
Security limitations
Reporting issues
```

Must avoid overclaiming.

Do not say:

```text
enterprise-grade security
fully secure
zero risk
audited
certified
```

Recommended heading:

```text
# Security Model
```

---

# 13. METHODOLOGY.md Requirements

Root `METHODOLOGY.md` should include:

```text
CarbonCoach is an awareness tool
Not formal carbon accounting
Deterministic calculator
Factor registry / simplified assumptions
Recommendation engine
Daily Choice Lab methodology
AI coach role
Numeric Invention Guard
Weekly Tracker limitations
Carbon World metaphor
What CarbonCoach does not claim
```

Must explicitly say:

```text
AI explains; it does not calculate.
Tracker completion is not proof of carbon reduction.
Carbon World visualizes action progress only.
```

Do not use:

```text
certified
audited
verified reductions
guaranteed savings
official inventory
```

Recommended heading:

```text
# Methodology
```

---

# 14. Accessibility Requirements

Polish must not reduce accessibility.

Maintain or improve:

```text
semantic headings
keyboard navigation
focus states
button labels
color contrast
screen reader labels for icons
text labels for badges
responsive layout
reduced motion safety
```

If using icons:

```text
decorative icons should use aria-hidden
meaningful icons need accessible labels or adjacent text
```

---

# 15. Testing Requirements

Update or add tests where affected.

Minimum tests:

```text
Overview renders hero message
Overview renders trust badges
Overview renders journey steps
Overview renders next best action
Recommendations initially show a reduced number of actions
Show more actions reveals additional actions
Carbon World preview/status appears on Overview
No fake carbon savings/avoidance claims appear
Privacy/assumptions pages still render
No coach calls happen from Overview
No localStorage logic added outside existing tracker storage
```

Docs do not need automated tests unless existing tooling supports it.

---

# 16. Copy Safety Requirements

Run copy grep checks.

Forbidden/risky user-facing terms:

```text
kg avoided
emissions saved
reduced emissions
verified reduction
guaranteed
certified
audited
save ₹
save $
enterprise-grade
fully secure
zero risk
```

Allowed in “does not claim” context only if clearly negated:

```text
not formal carbon accounting
not proof of carbon reduction
does not guarantee savings
```

Prefer avoiding risky terms entirely in main UI.

---

# 17. Build Progress Tracker Update

Update `buildprogresstracker.md` for Task 018:

```text
Status: Review Ready
Owner/Agent: Antigravity
Build/Typecheck/Tests/Lint/Format: Pass if passed
Files changed
Summary
Verification commands
Risks/follow-ups
```

Mention:

```text
UX/demo polish
visual-first overview
recommendation density reduction
Carbon World prominence
SECURITY.md
METHODOLOGY.md
```

Do not mark complete until human review accepts it.

---

# 18. Verification Commands

Run from repo root:

```bash
npm run build
npm run typecheck
npm run test
npm run lint
npm run format:check
```

Run grep checks:

```bash
grep -R "kg avoided\|emissions saved\|reduced emissions\|verified reduction\|guaranteed\|audited\|enterprise-grade\|fully secure\|zero risk\|save ₹\|save \$" apps/web/src SECURITY.md METHODOLOGY.md

grep -R "VITE_GEMINI_API_KEY\|GoogleGenerativeAI\|@google/generative-ai" apps/web/src

grep -R "/api/coach" apps/web/src/features/overview apps/web/src/features/world apps/web/src/features/tracker
```

Expected:

```text
No unsafe impact/security overclaims.
No frontend Gemini SDK or frontend API key.
No coach calls from Overview, World, or Tracker.
```

If risky terms appear only in clear “does not claim” statements, report them explicitly for human review.

---

# 19. Acceptance Criteria

Task 018 is successful when:

```text
Overview feels like a guided product journey.
Primary user-facing surfaces are less text-heavy.
Trust proposition is visible and compact.
Carbon World is visually more prominent.
Recommendation page is less dense.
Next-step CTAs exist across major flows.
SECURITY.md exists.
METHODOLOGY.md exists.
No new core product logic is added.
No deployment files are added.
No backend persistence/auth/database is added.
No fake impact claims appear.
No security overclaims appear.
Tests pass.
Root verification gates pass.
buildprogresstracker.md is updated.
```

---

# 20. Human Review Checklist

Verify:

```text
Is the first impression stronger?
Can a judge understand the app in 30 seconds?
Are primary screens more visual and less text-heavy?
Is the next action obvious?
Does Carbon World feel more emotionally engaging?
Are recommendations easier to scan?
Are SECURITY.md and METHODOLOGY.md credible?
No unsupported carbon claims.
No security overclaims.
All gates passed.
```

---

# 21. Expected Agent Report Format

Report:

```text
Files changed

What was implemented

UX/UI improvements

Trust documentation added

What was intentionally not changed

Verification
- npm run build
- npm run typecheck
- npm run test
- npm run lint
- npm run format:check
- copy/security grep checks

Risks / follow-ups
```

---

# 22. Commit Recommendation

After review:

```bash
git add .
git commit -m "feat(ui): polish demo experience and trust docs"
git push origin main
```

Use `main` only.

---

# 23. Final Instruction

Implement Task 018 only.

Do not begin Cloud Run deployment, README finalization, LinkedIn submission docs, or new product features.

The goal is to make CarbonCoach feel visually compelling, quick to understand, trustworthy, and submission-ready.
