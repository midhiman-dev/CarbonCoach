# CarbonCoach Architecture Decision Records

## Document Purpose

This document records key architecture decisions for CarbonCoach.

Each decision is written as an ADR-style entry with:

- status,
- context,
- decision,
- rationale,
- consequences.

---

# ADR-001 — Use an Awareness-First Product Architecture

## Status

Accepted

## Context

The challenge is not asking for only a carbon calculator or dashboard. The explainer emphasized that the goal is awareness, behavior change, and personalized insights.

## Decision

CarbonCoach will be built as an **AI-assisted carbon awareness platform**, not a static calculator.

Core awareness features:

- Footprint Coach,
- Daily Choice Lab,
- Choice Coach,
- Weekly Action Plan,
- Carbon World,
- Weekly Tracker.

## Rationale

This aligns more strongly with the challenge statement and SME guidance.

## Consequences

- Daily Choice Lab is P0.
- Carbon World is P0.
- Static dashboard-only implementation is not acceptable.
- Product copy must emphasize behavior change, not scientific accounting.

---

# ADR-002 — Deterministic Engines Decide, LLMs Explain

## Status

Accepted

## Context

Carbon footprint calculations require consistency and testability. LLMs may hallucinate numbers if allowed to calculate.

## Decision

All calculations, impact bands, rankings, tracker progress, and world state will be deterministic TypeScript logic in `packages/shared`.

LLM inference will only explain and coach.

## Rationale

This improves:

- trust,
- testability,
- security,
- code quality,
- manual review credibility.

## Consequences

- Gemini cannot generate emission totals.
- Prompt must say not to invent numbers.
- Numeric Invention Guard is mandatory.
- Fallback Coach is mandatory.

---

# ADR-003 — Use Gemini Through Cloud Run Backend

## Status

Accepted

## Context

The app must be genuinely AI-assisted, but API keys must not be exposed to the frontend. Deployment should fit free-tier constraints.

## Decision

Use Gemini API through a Cloud Run backend endpoint:

```text
POST /api/coach
```

The frontend never calls Gemini directly.

## Rationale

This protects the API key and gives a credible backend/AI architecture.

## Consequences

- `services/api` owns Gemini provider code.
- `GEMINI_API_KEY` is server-side only.
- No `VITE_GEMINI_API_KEY`.
- Cloud Run deployment is part of P0.

---

# ADR-004 — Use Google Cloud Run as Primary Deployment Target

## Status

Accepted

## Context

The challenge requires a deployed functional web application. Cloud Run supports web/API deployment and can fit free-tier usage if configured carefully.

## Decision

Deploy CarbonCoach as a Cloud Run service that serves:

- React frontend,
- `/api/coach`,
- `/health`.

## Rationale

Cloud Run provides:

- public app deployment,
- backend API,
- server-side secrets,
- Gemini integration,
- scale-to-zero behavior.

## Consequences

- Dockerfile is required.
- Production build must run compiled JavaScript.
- Min instances must be 0.
- No local LLM hosting or GPU.
- Cloud Run free-tier guidance must be documented.

---

# ADR-005 — No Database or Login in P0

## Status

Accepted

## Context

CarbonCoach can provide a complete challenge-ready flow without user accounts or cloud persistence. Adding auth/database increases security, privacy, testing, and deployment complexity.

## Decision

Use local-first storage for P0.

Do not implement login or database persistence in P0.

## Rationale

This improves:

- privacy,
- speed,
- free-tier safety,
- implementation focus,
- testability.

## Consequences

- User profile and tracker data live locally.
- Clear-data control is required.
- Future sync can be documented as P1/P2.

---

# ADR-006 — Make Daily Choice Lab a P0 Feature

## Status

Accepted

## Context

The challenge explainer suggested contextual nudges at real decision points, such as food delivery choices before ordering.

## Decision

Daily Choice Lab is a P0 feature.

It will include everyday choice scenarios such as:

- cab vs metro,
- food delivery options,
- combined vs separate deliveries,
- short flight vs train,
- repair vs buy new.

## Rationale

This is the strongest way to show awareness and behavior-change alignment.

## Consequences

- Choice engine is required.
- Choice Coach is required.
- Choice Lab UI is required.
- Tests for choice scenarios are required.

---

# ADR-007 — Use Lightweight SVG/CSS Carbon World Instead of Three.js

## Status

Accepted

## Context

The SME suggested gamified visual worlds, but Three.js can increase complexity, bundle size, and accessibility risk.

## Decision

Implement Carbon World using lightweight SVG/CSS for P0.

Do not use Three.js in P0.

## Rationale

This preserves emotional visual feedback while protecting:

- efficiency,
- accessibility,
- code quality,
- testability.

## Consequences

- Carbon World must have text equivalents.
- No heavy 3D library.
- Visual state comes from deterministic world engine.

---

# ADR-008 — Numeric Invention Guard Is Mandatory

## Status

Accepted

## Context

LLMs may introduce unsupported numbers even when instructed not to.

## Decision

All LLM responses must pass Numeric Invention Guard before being returned to the frontend.

## Rationale

This protects trust and prevents hallucinated footprint claims.

## Consequences

- Allowed numbers must be derived from structured context.
- LLM output must be parsed.
- Unsupported numbers trigger fallback.
- Tests must cover allowed and unsupported numbers.

---

# ADR-009 — Fallback Coach Is Mandatory

## Status

Accepted

## Context

Gemini may fail, timeout, return malformed output, or exceed quota. The deployed app must remain functional for manual review.

## Decision

Every coach workflow must support deterministic fallback.

## Rationale

This improves reliability, efficiency, and review readiness.

## Consequences

- Fallback composer lives in `packages/shared`.
- Backend uses fallback when LLM fails.
- UI must clearly show fallback state.
- Tests must cover fallback paths.

---

# ADR-010 — No Automatic LLM Calls on Page Load

## Status

Accepted

## Context

Automatic LLM calls increase cost, latency, and failure risk.

## Decision

LLM calls must be user-triggered only.

Allowed triggers:

- Explain my footprint,
- Coach me on this choice,
- Create my plan if implemented through coach.

## Rationale

This supports free-tier usage and improves performance.

## Consequences

- App shell must render without Gemini.
- Footprint summary works without LLM.
- Choice Lab works without LLM.
- Coach panels can lazy-load responses.

---

# ADR-011 — Store Only Local P0 User Data

## Status

Accepted

## Context

The app needs to remember profile and tracker progress but does not need cloud sync for P0.

## Decision

Use browser local storage for P0 state.

## Rationale

This keeps the build simple and privacy-friendly.

## Consequences

- Local persistence adapter required.
- Clear-data control required.
- Privacy page must explain local storage.
- No backend user data store.

---

# ADR-012 — Avoid Heavy Charting Libraries in P0

## Status

Accepted

## Context

The footprint summary needs simple breakdown visuals, but heavy charting libraries may hurt bundle size and code quality.

## Decision

Use lightweight CSS/SVG bars and cards for P0.

## Rationale

This supports efficiency and accessibility.

## Consequences

- No heavy chart dependency unless explicitly approved.
- Charts must have text labels.
- Category breakdown must not be color-only.

---

# ADR-013 — Single Branch Development

## Status

Accepted

## Context

Challenge rules require one branch.

## Decision

Use `main` only.

## Rationale

Avoid submission disqualification risk.

## Consequences

- No feature branches.
- Commit small verified changes directly to `main`.
- Avoid unfinished committed work.

---

# ADR-014 — Documentation Must Match Actual Behavior

## Status

Accepted

## Context

Manual reviewers may compare repository claims, LinkedIn post, deployed app, and actual behavior.

## Decision

Documentation must not overclaim features.

## Rationale

Avoid manual review penalty or disqualification risk.

## Consequences

- README must be updated as features are implemented.
- LinkedIn draft must be truthful.
- P1/P2 features must be clearly labelled as future enhancements.
- Do not claim production-grade carbon accounting.

---

# ADR-015 — Use Local-First Privacy Model

## Status

Accepted

## Context

CarbonCoach collects lifestyle-related data. Even if not highly sensitive, privacy matters.

## Decision

Use local-first data handling and send only minimized structured context to the LLM.

## Rationale

This improves security and user trust.

## Consequences

- Redaction and minimization utilities are required.
- Privacy page must explain what is sent to Gemini.
- Raw profile logs must be avoided.
- Clear-data control required.

---

# ADR-016 — Use Strict Quality Gates From Task 001

## Status

Accepted

## Context

Previous Prompt Wars learning showed code quality is difficult to improve late.

## Decision

Add build, typecheck, test, lint, and format checks from Task 001.

## Rationale

This makes code quality a Day 0 concern.

## Consequences

- Task 001 must set up scripts.
- Every task must report verification.
- No task should be marked complete without verification.

---

# ADR-017 — Keep P0 Feature Set Small but Complete

## Status

Accepted

## Context

The challenge has time and submission limits. Overbuilding risks lower code quality and incomplete manual review flows.

## Decision

P0 focuses on:

- onboarding,
- footprint summary,
- Footprint Coach,
- Daily Choice Lab,
- Choice Coach,
- weekly actions,
- Carbon World,
- tracker,
- privacy/assumptions,
- Cloud Run deployment,
- submission docs.

## Rationale

This is enough to demonstrate a complete AI-assisted awareness platform without unnecessary complexity.

## Consequences

- Social leaderboard deferred.
- Login deferred.
- Database deferred.
- Voice deferred.
- Advanced gamification deferred.

---

# ADR-018 — Use Prompt Strategy Documentation as Submission Evidence

## Status

Accepted

## Context

The challenge requires a LinkedIn post explaining prompt strategy, tools used, and architecture.

## Decision

Maintain submission docs under:

```text
docs/submission/
```

## Rationale

This ensures the final LinkedIn post is grounded in actual project evolution.

## Consequences

- `prompt-strategy.md` required.
- `tools-and-architecture.md` required.
- `linkedin-post-draft.md` required.
- Docs must be updated before submission.

---

# ADR-019 — Use Cloud Run Health Endpoint for Reviewability

## Status

Accepted

## Context

Manual reviewers may need to verify that the deployed backend is functioning.

## Decision

Expose:

```text
GET /health
```

## Rationale

A health endpoint improves operational credibility.

## Consequences

- API service must implement `/health`.
- Deployment checklist must verify it.
- README may mention it in run/deployment instructions.

---

# ADR-020 — Treat Carbon Factors as Documented Assumptions

## Status

Accepted

## Context

The app is not a production carbon accounting engine. Factor precision varies by region and source.

## Decision

Emission factors are treated as documented assumptions or demo factors unless source-backed later.

## Rationale

This avoids scientific overclaiming.

## Consequences

- Assumptions page required.
- Factor registry must include confidence/notes.
- UI should show approximate wording.
- README must explain limitation.
