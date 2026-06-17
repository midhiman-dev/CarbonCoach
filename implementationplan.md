# CarbonCoach Implementation Plan

## Purpose

This document defines the high-level task sequence for building CarbonCoach.

It is intentionally compact because it will be read frequently by AI coding agents. Detailed task instructions must live in the corresponding task skill files under:

```text
docs/skills/<task-id>-<task-name>/SKILLS.md
```

Agents must not treat this file as the detailed task brief. For implementation details, validation rules, file expectations, and task boundaries, read the relevant skill file.

---

# Product Summary

**CarbonCoach** is an AI-assisted carbon awareness platform that helps individuals understand, track, and reduce their carbon footprint through everyday decision moments.

Core product rule:

```text
Deterministic engines decide.
LLMs explain.
```

The app uses deterministic TypeScript engines for calculations, rankings, impact bands, tracker values, and Carbon World state. Gemini is used only for bounded coaching workflows through Cloud Run.

---

# P0 Scope

CarbonCoach P0 includes:

1. Carbon Profile Onboarding
2. Footprint Summary
3. Deterministic Carbon Calculator
4. Deterministic Recommendation Engine
5. Footprint Coach using Gemini via Cloud Run
6. Daily Choice Lab
7. Choice Coach using Gemini via Cloud Run
8. Numeric Invention Guard
9. Deterministic Fallback Coach
10. Weekly Action Plan
11. Carbon World using lightweight SVG/CSS
12. Weekly Tracker with local persistence
13. Privacy and Assumptions page
14. Cloud Run deployment
15. README and submission documentation
16. LinkedIn post draft and prompt strategy documentation

---

# Explicit P0 Non-Goals

Do not implement these in P0 unless explicitly approved:

- Real social leaderboard
- User login
- Database persistence
- Three.js or heavy 3D visual world
- Voice assistant
- Real food delivery integration
- Carbon offset marketplace
- Production-grade carbon accounting
- Local LLM hosting
- GPU inference
- Organization/team workflows
- Complex admin panel

---

# Target Repository Shape

```text
CarbonCoach/
  AGENTS.md
  README.md
  implementationplan.md
  buildprogresstracker.md
  package.json
  .gitignore
  .env.example

  apps/
    web/

  services/
    api/

  packages/
    shared/

  docs/
    architecture/
    deployment/
    testing/
    submission/
    skills/
```

---

# Build Phases

## Phase 0 — Project Foundation

| Task | Title                                         | Skill File                                  |
| ---- | --------------------------------------------- | ------------------------------------------- |
| 001  | Repo Foundation, Workspace, and Quality Gates | `docs/skills/001-repo-foundation/SKILLS.md` |

---

## Phase 1 — Shared Domain Foundation

| Task | Title                                                           | Skill File                                        |
| ---- | --------------------------------------------------------------- | ------------------------------------------------- |
| 002  | Shared Carbon Domain Model and Factor Registry                  | `docs/skills/002-carbon-domain/SKILLS.md`         |
| 003  | Deterministic Carbon Footprint Engine                           | `docs/skills/003-carbon-engine/SKILLS.md`         |
| 004  | Recommendation Engine and Weekly Action Ranking                 | `docs/skills/004-recommendation-engine/SKILLS.md` |
| 005  | Privacy, Redaction, and Local Data Safety Utilities             | `docs/skills/005-privacy-layer/SKILLS.md`         |
| 006  | Coach Contracts, Fallback Composer, and Numeric Guard Contracts | `docs/skills/006-coach-contracts/SKILLS.md`       |

---

## Phase 2 — AI Coach Backend

| Task | Title                                                                             | Skill File                                       |
| ---- | --------------------------------------------------------------------------------- | ------------------------------------------------ |
| 007  | Gemini Coach Service with Timeout, Schema Validation, Numeric Guard, and Fallback | `docs/skills/007-gemini-coach-service/SKILLS.md` |

---

## Phase 3 — Core Web Experience

_Note on controlled deviation: Choice Coach UI was pulled forward to complete the Daily Choice Lab coaching loop before tracker/persistence work. Weekly Tracker and Carbon World were shifted to the next tasks._

| Task | Title                                  | Skill File                                                |
| ---- | -------------------------------------- | --------------------------------------------------------- |
| 008  | Accessible UI Foundation and App Shell | `docs/skills/008-ui-foundation/SKILLS.md`                 |
| 009  | Carbon Profile Onboarding Flow         | `docs/skills/009-carbon-profile-onboarding/SKILLS.md`     |
| 010  | Footprint Summary UI                   | `docs/skills/010-footprint-summary-ui/SKILLS.md`          |
| 011  | Recommendation and Weekly Plan UI      | `docs/skills/011-recommendation-weekly-plan-ui/SKILLS.md` |
| 012  | Footprint Coach UI                     | `docs/skills/012-footprint-coach-ui/SKILLS.md`            |
| 013  | Daily Choice Lab Foundation            | `docs/skills/013-daily-choice-lab/SKILLS.md`              |
| 014  | Choice Coach UI                        | `docs/skills/014-choice-coach-ui/SKILLS.md`               |

---

## Phase 4 — Tracker & Visual Progress

| Task | Title                                         | Skill File                                 |
| ---- | --------------------------------------------- | ------------------------------------------ |
| 015  | Weekly Tracker and Local Persistence          | `docs/skills/015-weekly-tracker/SKILLS.md` |
| 016  | Carbon World Engine and Lightweight Visual UI | `docs/skills/016-carbon-world/SKILLS.md`   |

---

## Phase 5 — Trust, Security, and Accessibility

| Task | Title                             | Skill File                                          |
| ---- | --------------------------------- | --------------------------------------------------- |
| 017  | Privacy and Assumptions Page      | `docs/skills/017-privacy-and-assumptions/SKILLS.md` |
| 018  | Final Accessibility / Demo Polish | `docs/skills/018-accessibility-polish/SKILLS.md`    |

---

## Phase 6 — Deployment & Submission

| Task | Title                                  | Skill File                                         |
| ---- | -------------------------------------- | -------------------------------------------------- |
| 019  | Cloud Run Deployment                   | `docs/skills/019-cloud-run-deployment/SKILLS.md`   |
| 020  | README, Submission Docs, LinkedIn Post | `docs/skills/020-readme-submission-docs/SKILLS.md` |

---

# Execution Rules

For every task, the coding agent must:

1. Read `AGENTS.md`
2. Read this `implementationplan.md`
3. Read the relevant task skill file under `docs/skills/`
4. Implement only the assigned task
5. Avoid unrelated file changes
6. Run the required verification commands
7. Update `buildprogresstracker.md`
8. Report results clearly
9. Wait for review before the next task

---

# Standard Verification Commands

The following commands should exist from Task 001 onward:

```bash
npm run build
npm run typecheck
npm run test
npm run lint
npm run format:check
```

Before final submission, also run:

```bash
npm ls
npm audit --omit=dev
```

---

# Branch Strategy

The challenge requires a single branch.

Use:

```text
main
```

Do not create:

```text
develop
feature/*
release/*
```

All verified commits go directly to `main`.

---

# Submission Rule

Only the latest submission counts.

Do not submit speculative or incomplete builds.

Submit only after Task 020 confirms:

```text
Build PASS
Typecheck PASS
Tests PASS
Lint PASS
Format PASS
Accessibility checks PASS
Cloud Run deployment PASS
Gemini coach PASS
Fallback coach PASS
Numeric invention guard PASS
README updated
LinkedIn draft ready
Manual demo checklist complete
No overclaiming found
```

---

# Final Instruction

This file is only the build sequence and navigation index.

For detailed task instructions, always use the relevant `SKILLS.md` file.

Build small. Build clean. Verify continuously.
