# CarbonCoach Build Progress Tracker

## Purpose

This document tracks the implementation progress, verification status, and scoring readiness of the CarbonCoach build.

It must be updated after every task.

This tracker is not a task specification. Detailed task instructions live in:

```text
docs/skills/<task-id>-<task-name>/SKILLS.md
```

This tracker records:

- task status,
- implementation outcome,
- verification commands,
- scoring criteria coverage,
- blockers,
- risks,
- submission readiness,
- and final release evidence.

---

# Status Legend

Use these exact status values.

| Status       | Meaning                                                        |
| ------------ | -------------------------------------------------------------- |
| Not Started  | Task has not begun                                             |
| In Progress  | Task is currently being implemented                            |
| Blocked      | Task cannot proceed due to dependency or issue                 |
| Needs Fix    | Task was implemented but verification or review found problems |
| Review Ready | Task implementation is complete and waiting for human review   |
| Complete     | Task is verified and accepted                                  |
| Deferred     | Task was intentionally moved out of scope                      |

---

# Verification Legend

Use these values in verification columns.

| Value       | Meaning                         |
| ----------- | ------------------------------- |
| N/A         | Not applicable to this task     |
| Not Run     | Applicable but not executed yet |
| Pass        | Executed and passed             |
| Fail        | Executed and failed             |
| Partial     | Some checks passed, but not all |
| Manual Pass | Manually checked and passed     |
| Manual Fail | Manually checked and failed     |

---

# Scoring Categories

Every task should support one or more scoring areas.

| Code  | Scoring Area                |
| ----- | --------------------------- |
| CQ    | Code Quality                |
| SEC   | Security                    |
| EFF   | Efficiency                  |
| TEST  | Testing                     |
| A11Y  | Accessibility               |
| ALIGN | Problem Statement Alignment |

---

# Current Build Snapshot

| Field                      | Value                                 |
| -------------------------- | ------------------------------------- |
| Project                    | CarbonCoach                           |
| Challenge                  | Prompt Wars Virtual — Challenge 3     |
| Product Type               | AI-assisted carbon awareness platform |
| Primary Branch             | main                                  |
| Deployment Target          | Google Cloud Run                      |
| LLM Provider               | Gemini via Cloud Run backend          |
| Frontend                   | React + TypeScript + Vite             |
| Backend                    | Node.js + TypeScript API              |
| Shared Logic               | TypeScript package                    |
| Storage                    | Local-first                           |
| Database                   | None for P0                           |
| Auth                       | None for P0                           |
| Local LLM                  | Not allowed                           |
| Three.js                   | Not allowed for P0                    |
| Latest Submission Counts   | Yes                                   |
| Current Submission Attempt | Not submitted                         |
| Current Release State      | Foundation / Pre-Task 001             |

---

# Global Verification Commands

These commands should exist from Task 001 onward.

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

# Master Task Tracker

| Task | Title                                                                             | Status       | Owner/Agent | Scoring Focus                   | Build   | Typecheck | Tests   | Lint    | Format  | Human Review | Commit  |
| ---- | --------------------------------------------------------------------------------- | ------------ | ----------- | ------------------------------- | ------- | --------- | ------- | ------- | ------- | ------------ | ------- |
| 001  | Repo Foundation, Workspace, and Quality Gates                                     | Complete     | Antigravity | CQ, TEST, EFF                   | Pass    | Pass      | Pass    | Pass    | Pass    | Accepted     | Pending |
| 002  | Shared Carbon Domain Model and Factor Registry                                    | Complete     | Antigravity | CQ, TEST, ALIGN                 | Pass    | Pass      | Pass    | Pass    | Pass    | Accepted     | Pending |
| 003  | Deterministic Carbon Footprint Engine                                             | Complete     | Antigravity | CQ, TEST, ALIGN                 | Pass    | Pass      | Pass    | Pass    | Pass    | Accepted     | Pending |
| 004  | Recommendation Engine and Weekly Action Ranking                                   | Not Started  | TBD         | CQ, TEST, ALIGN                 | Not Run | Not Run   | Not Run | Not Run | Not Run | Not Run      | Pending |
| 005  | Privacy, Redaction, and Local Data Safety Utilities                               | Not Started  | TBD         | SEC, TEST, CQ                   | Not Run | Not Run   | Not Run | Not Run | Not Run | Not Run      | Pending |
| 006  | Coach Contracts, Fallback Composer, and Numeric Guard Contracts                   | Not Started  | TBD         | SEC, TEST, CQ                   | Not Run | Not Run   | Not Run | Not Run | Not Run | Not Run      | Pending |
| 007  | Gemini Coach Service with Timeout, Schema Validation, Numeric Guard, and Fallback | Not Started  | TBD         | SEC, EFF, TEST, ALIGN           | Not Run | Not Run   | Not Run | Not Run | Not Run | Not Run      | Pending |
| 008  | Accessible UI Foundation and App Shell                                            | Not Started  | TBD         | CQ, A11Y, EFF                   | Not Run | Not Run   | Not Run | Not Run | Not Run | Not Run      | Pending |
| 009  | Carbon Profile Onboarding Flow                                                    | Not Started  | TBD         | A11Y, CQ, ALIGN                 | Not Run | Not Run   | Not Run | Not Run | Not Run | Not Run      | Pending |
| 010  | Footprint Summary and Action Plan UI                                              | Not Started  | TBD         | ALIGN, A11Y, CQ                 | Not Run | Not Run   | Not Run | Not Run | Not Run | Not Run      | Pending |
| 011  | Daily Choice Lab Engine and Tests                                                 | Not Started  | TBD         | ALIGN, TEST, CQ                 | Not Run | Not Run   | Not Run | Not Run | Not Run | Not Run      | Pending |
| 012  | Daily Choice Lab UI and Choice Coach Integration                                  | Not Started  | TBD         | ALIGN, A11Y, SEC, EFF           | Not Run | Not Run   | Not Run | Not Run | Not Run | Not Run      | Pending |
| 013  | Carbon World Engine and Lightweight Visual UI                                     | Not Started  | TBD         | ALIGN, A11Y, EFF                | Not Run | Not Run   | Not Run | Not Run | Not Run | Not Run      | Pending |
| 014  | Weekly Tracker and Local Persistence                                              | Not Started  | TBD         | ALIGN, TEST, SEC                | Not Run | Not Run   | Not Run | Not Run | Not Run | Not Run      | Pending |
| 015  | Security, Privacy, Assumptions, and Documentation Pass                            | Not Started  | TBD         | SEC, ALIGN, CQ                  | Not Run | Not Run   | Not Run | Not Run | Not Run | Not Run      | Pending |
| 016  | Accessibility and Responsive Hardening                                            | Not Started  | TBD         | A11Y, CQ, TEST                  | Not Run | Not Run   | Not Run | Not Run | Not Run | Not Run      | Pending |
| 017  | Cloud Run Deployment and Free-Tier Readiness                                      | Not Started  | TBD         | EFF, SEC, CQ                    | Not Run | Not Run   | Not Run | Not Run | Not Run | Not Run      | Pending |
| 018  | LinkedIn Submission Docs, Prompt Strategy, and Architecture Evidence              | Not Started  | TBD         | ALIGN, CQ                       | N/A     | N/A       | N/A     | N/A     | Not Run | Not Run      | Pending |
| 019  | Final Verification, Release Candidate, and Submission Gate                        | Not Started  | TBD         | CQ, SEC, EFF, TEST, A11Y, ALIGN | Not Run | Not Run   | Not Run | Not Run | Not Run | Not Run      | Pending |

---

# Task Outcome Log

Update this section after every completed task.

## Task 001 — Repo Foundation, Workspace, and Quality Gates

| Field                     | Value                                                                                                                                     |
| ------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| Status                    | Completed                                                                                                                                 |
| Started At                | 2026-06-15                                                                                                                                |
| Completed At              | 2026-06-15                                                                                                                                |
| Agent / Tool              | Antigravity                                                                                                                               |
| Commit Hash               | 57857aa7938da565618a4f7af394a700765c05b4                                                                                                  |
| Files Changed             | package.json, tsconfig.base.json, eslint.config.js, .prettierrc, .gitignore, .env.example, apps/web/_, packages/shared/_, services/api/\* |
| Summary                   | Created monorepo foundation with workspaces for web, api, and shared packages. Set up quality gates.                                      |
| Verification Commands Run | npm install, build, typecheck, test, lint, format:check                                                                                   |
| Verification Result       | Pass                                                                                                                                      |
| Human Review Result       | Accepted                                                                                                                                  |
| Risks / Follow-ups        | ESLint modern flat config required type: module in root package.json and newer plugin versions.                                           |

---

## Task 002 — Shared Carbon Domain Model and Factor Registry

| Field                     | Value                                                                                                                                                                                                                                                                                         |
| ------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Status                    | Review Ready                                                                                                                                                                                                                                                                                  |
| Started At                | 2026-06-15                                                                                                                                                                                                                                                                                    |
| Completed At              | 2026-06-15                                                                                                                                                                                                                                                                                    |
| Agent / Tool              | Antigravity                                                                                                                                                                                                                                                                                   |
| Commit Hash               | 80028ff438d0f4b295b4af12ad77e6d616961904                                                                                                                                                                                                                                                                                      |
| Files Changed             | packages/shared/src/types/carbon.ts, packages/shared/src/carbon/factorTypes.ts, packages/shared/src/carbon/assumptions.ts, packages/shared/src/carbon/factorRegistry.ts, packages/shared/src/carbon/index.ts, packages/shared/src/index.ts, packages/shared/src/carbon/factorRegistry.test.ts |
| Summary                   | Implemented the carbon domain types, factor registry types, assumption metadata, transparent factor registry, helpers, and integrity tests.                                                                                                                                                   |
| Verification Commands Run | npm run build, npm run typecheck, npm run test, npm run lint, npm run format:check                                                                                                                                                                                                            |
| Verification Result       | Pass                                                                                                                                                                                                                                                                                          |
| Human Review Result       | Accepted                                                                                                                                                                                                                                                                                      |
| Risks / Follow-ups        | None. Baseline registry holds demo assumptions clearly marked as directional.                                                                                                                                                                                                                 |

---

## Task 003 — Deterministic Carbon Footprint Engine

| Field                     | Value                                                                                                                                                                                             |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Status                    | Review Ready                                                                                                                                                                                      |
| Started At                | 2026-06-15                                                                                                                                                                                        |
| Completed At              | 2026-06-15                                                                                                                                                                                        |
| Agent / Tool              | Antigravity                                                                                                                                                                                       |
| Commit Hash               | Pending                                                                                                                                                                                           |
| Files Changed             | packages/shared/src/carbon/categoryCalculators.ts, packages/shared/src/carbon/calculator.ts, packages/shared/src/carbon/calculator.test.ts, packages/shared/src/carbon/index.ts |
| Summary                   | Implemented deterministic footprint calculation with category-specific logic, normalization handling, top contributor derivation, confidence levels, and full test suite.                         |
| Verification Commands Run | npm run build, npm run typecheck, npm run test, npm run lint, npm run format:check                                                                                                                |
| Verification Result       | Pass                                                                                                                                                                                              |
| Human Review Result       | Accepted                                                                                                                                                                                           |
| Risks / Follow-ups        | No recommendation engine added, calculation logic only handles existing profile values. Strict numeric fallback bounds logic is documented.                                                       |

---

## Task 004 — Recommendation Engine and Weekly Action Ranking

| Field                     | Value       |
| ------------------------- | ----------- |
| Status                    | Not Started |
| Started At                |             |
| Completed At              |             |
| Agent / Tool              |             |
| Commit Hash               |             |
| Files Changed             |             |
| Summary                   |             |
| Verification Commands Run |             |
| Verification Result       |             |
| Human Review Result       |             |
| Risks / Follow-ups        |             |

---

## Task 005 — Privacy, Redaction, and Local Data Safety Utilities

| Field                     | Value       |
| ------------------------- | ----------- |
| Status                    | Not Started |
| Started At                |             |
| Completed At              |             |
| Agent / Tool              |             |
| Commit Hash               |             |
| Files Changed             |             |
| Summary                   |             |
| Verification Commands Run |             |
| Verification Result       |             |
| Human Review Result       |             |
| Risks / Follow-ups        |             |

---

## Task 006 — Coach Contracts, Fallback Composer, and Numeric Guard Contracts

| Field                     | Value       |
| ------------------------- | ----------- |
| Status                    | Not Started |
| Started At                |             |
| Completed At              |             |
| Agent / Tool              |             |
| Commit Hash               |             |
| Files Changed             |             |
| Summary                   |             |
| Verification Commands Run |             |
| Verification Result       |             |
| Human Review Result       |             |
| Risks / Follow-ups        |             |

---

## Task 007 — Gemini Coach Service with Timeout, Schema Validation, Numeric Guard, and Fallback

| Field                     | Value       |
| ------------------------- | ----------- |
| Status                    | Not Started |
| Started At                |             |
| Completed At              |             |
| Agent / Tool              |             |
| Commit Hash               |             |
| Files Changed             |             |
| Summary                   |             |
| Verification Commands Run |             |
| Verification Result       |             |
| Human Review Result       |             |
| Risks / Follow-ups        |             |

### LLM Safety Evidence

| Check                                | Result  | Notes |
| ------------------------------------ | ------- | ----- |
| Gemini key is server-side only       | Not Run |       |
| Missing key fallback works           | Not Run |       |
| Timeout fallback works               | Not Run |       |
| Malformed response fallback works    | Not Run |       |
| Unsupported number response rejected | Not Run |       |
| Raw prompt not logged                | Not Run |       |
| Raw profile not logged               | Not Run |       |

---

## Task 008 — Accessible UI Foundation and App Shell

| Field                     | Value       |
| ------------------------- | ----------- |
| Status                    | Not Started |
| Started At                |             |
| Completed At              |             |
| Agent / Tool              |             |
| Commit Hash               |             |
| Files Changed             |             |
| Summary                   |             |
| Verification Commands Run |             |
| Verification Result       |             |
| Human Review Result       |             |
| Risks / Follow-ups        |             |

---

## Task 009 — Carbon Profile Onboarding Flow

| Field                     | Value       |
| ------------------------- | ----------- |
| Status                    | Not Started |
| Started At                |             |
| Completed At              |             |
| Agent / Tool              |             |
| Commit Hash               |             |
| Files Changed             |             |
| Summary                   |             |
| Verification Commands Run |             |
| Verification Result       |             |
| Human Review Result       |             |
| Risks / Follow-ups        |             |

---

## Task 010 — Footprint Summary and Action Plan UI

| Field                     | Value       |
| ------------------------- | ----------- |
| Status                    | Not Started |
| Started At                |             |
| Completed At              |             |
| Agent / Tool              |             |
| Commit Hash               |             |
| Files Changed             |             |
| Summary                   |             |
| Verification Commands Run |             |
| Verification Result       |             |
| Human Review Result       |             |
| Risks / Follow-ups        |             |

---

## Task 011 — Daily Choice Lab Engine and Tests

| Field                     | Value       |
| ------------------------- | ----------- |
| Status                    | Not Started |
| Started At                |             |
| Completed At              |             |
| Agent / Tool              |             |
| Commit Hash               |             |
| Files Changed             |             |
| Summary                   |             |
| Verification Commands Run |             |
| Verification Result       |             |
| Human Review Result       |             |
| Risks / Follow-ups        |             |

---

## Task 012 — Daily Choice Lab UI and Choice Coach Integration

| Field                     | Value       |
| ------------------------- | ----------- |
| Status                    | Not Started |
| Started At                |             |
| Completed At              |             |
| Agent / Tool              |             |
| Commit Hash               |             |
| Files Changed             |             |
| Summary                   |             |
| Verification Commands Run |             |
| Verification Result       |             |
| Human Review Result       |             |
| Risks / Follow-ups        |             |

### Choice Coach Evidence

| Check                                | Result  | Notes |
| ------------------------------------ | ------- | ----- |
| Choice Coach is user-triggered only  | Not Run |       |
| Choice Coach fallback works          | Not Run |       |
| Choice Coach does not invent numbers | Not Run |       |
| Choice context is minimized          | Not Run |       |
| UI shows fallback state clearly      | Not Run |       |

---

## Task 013 — Carbon World Engine and Lightweight Visual UI

| Field                     | Value       |
| ------------------------- | ----------- |
| Status                    | Not Started |
| Started At                |             |
| Completed At              |             |
| Agent / Tool              |             |
| Commit Hash               |             |
| Files Changed             |             |
| Summary                   |             |
| Verification Commands Run |             |
| Verification Result       |             |
| Human Review Result       |             |
| Risks / Follow-ups        |             |

### Carbon World Accessibility Evidence

| Check                                    | Result  | Notes |
| ---------------------------------------- | ------- | ----- |
| Text equivalent exists                   | Not Run |       |
| Visual is not color-only                 | Not Run |       |
| No Three.js or heavy visual library used | Not Run |       |
| Mobile layout works                      | Not Run |       |

---

## Task 014 — Weekly Tracker and Local Persistence

| Field                     | Value       |
| ------------------------- | ----------- |
| Status                    | Not Started |
| Started At                |             |
| Completed At              |             |
| Agent / Tool              |             |
| Commit Hash               |             |
| Files Changed             |             |
| Summary                   |             |
| Verification Commands Run |             |
| Verification Result       |             |
| Human Review Result       |             |
| Risks / Follow-ups        |             |

---

## Task 015 — Security, Privacy, Assumptions, and Documentation Pass

| Field                     | Value       |
| ------------------------- | ----------- |
| Status                    | Not Started |
| Started At                |             |
| Completed At              |             |
| Agent / Tool              |             |
| Commit Hash               |             |
| Files Changed             |             |
| Summary                   |             |
| Verification Commands Run |             |
| Verification Result       |             |
| Human Review Result       |             |
| Risks / Follow-ups        |             |

### Trust Documentation Evidence

| Check                                     | Result  | Notes |
| ----------------------------------------- | ------- | ----- |
| Privacy page implemented                  | Not Run |       |
| Assumptions page implemented              | Not Run |       |
| Clear data works                          | Not Run |       |
| README explains LLM usage                 | Not Run |       |
| README explains deterministic calculation | Not Run |       |
| README explains numeric guard             | Not Run |       |
| README avoids scientific overclaiming     | Not Run |       |

---

## Task 016 — Accessibility and Responsive Hardening

| Field                     | Value       |
| ------------------------- | ----------- |
| Status                    | Not Started |
| Started At                |             |
| Completed At              |             |
| Agent / Tool              |             |
| Commit Hash               |             |
| Files Changed             |             |
| Summary                   |             |
| Verification Commands Run |             |
| Verification Result       |             |
| Human Review Result       |             |
| Risks / Follow-ups        |             |

### Accessibility Evidence

| Check                                     | Result  | Notes |
| ----------------------------------------- | ------- | ----- |
| Keyboard onboarding works                 | Not Run |       |
| Keyboard Choice Lab works                 | Not Run |       |
| Buttons have accessible names             | Not Run |       |
| Inputs have labels                        | Not Run |       |
| Coach loading/result states are announced | Not Run |       |
| Impact states are non-color-only          | Not Run |       |
| Carbon World has text equivalent          | Not Run |       |
| Mobile layout checked                     | Not Run |       |

---

## Task 017 — Cloud Run Deployment and Free-Tier Readiness

| Field                     | Value       |
| ------------------------- | ----------- |
| Status                    | Not Started |
| Started At                |             |
| Completed At              |             |
| Agent / Tool              |             |
| Commit Hash               |             |
| Files Changed             |             |
| Summary                   |             |
| Verification Commands Run |             |
| Verification Result       |             |
| Human Review Result       |             |
| Risks / Follow-ups        |             |

### Deployment Evidence

| Check                                   | Result  | Notes |
| --------------------------------------- | ------- | ----- |
| Docker build succeeds                   | Not Run |       |
| Local container runs                    | Not Run |       |
| `/health` works                         | Not Run |       |
| Frontend served from API container      | Not Run |       |
| `/api/coach` works                      | Not Run |       |
| Missing Gemini key fallback works       | Not Run |       |
| Gemini key not exposed in frontend      | Not Run |       |
| Cloud Run min instances documented as 0 | Not Run |       |
| Public URL recorded                     | Not Run |       |

### Deployment URL

```text
Pending
```

---

## Task 018 — LinkedIn Submission Docs, Prompt Strategy, and Architecture Evidence

| Field                     | Value       |
| ------------------------- | ----------- |
| Status                    | Not Started |
| Started At                |             |
| Completed At              |             |
| Agent / Tool              |             |
| Commit Hash               |             |
| Files Changed             |             |
| Summary                   |             |
| Verification Commands Run |             |
| Verification Result       |             |
| Human Review Result       |             |
| Risks / Follow-ups        |             |

### Submission Documentation Evidence

| Check                             | Result  | Notes |
| --------------------------------- | ------- | ----- |
| LinkedIn draft created            | Not Run |       |
| Prompt strategy documented        | Not Run |       |
| Tools and architecture documented | Not Run |       |
| GenAI usage documented            | Not Run |       |
| Cloud Run rationale documented    | Not Run |       |
| Gemini safety documented          | Not Run |       |
| No unsupported claims             | Not Run |       |

---

## Task 019 — Final Verification, Release Candidate, and Submission Gate

| Field                     | Value       |
| ------------------------- | ----------- |
| Status                    | Not Started |
| Started At                |             |
| Completed At              |             |
| Agent / Tool              |             |
| Commit Hash               |             |
| Files Changed             |             |
| Summary                   |             |
| Verification Commands Run |             |
| Verification Result       |             |
| Human Review Result       |             |
| Risks / Follow-ups        |             |

---

# Scoring Readiness Tracker

## Code Quality

| Check                              | Status  | Notes |
| ---------------------------------- | ------- | ----- |
| Workspace structure clean          | Not Run |       |
| UI/business logic separated        | Not Run |       |
| Shared domain logic centralized    | Not Run |       |
| Backend LLM orchestration isolated | Not Run |       |
| No large monolithic components     | Not Run |       |
| No large global CSS dump           | Not Run |       |
| No unused dependencies             | Not Run |       |
| Lint passes                        | Not Run |       |
| Format check passes                | Not Run |       |
| Typecheck passes                   | Not Run |       |

## Security

| Check                          | Status  | Notes |
| ------------------------------ | ------- | ----- |
| No secrets committed           | Not Run |       |
| Gemini key server-side only    | Not Run |       |
| No `VITE_GEMINI_API_KEY`       | Not Run |       |
| Input validation exists        | Not Run |       |
| LLM response validation exists | Not Run |       |
| Numeric invention guard exists | Not Run |       |
| Fallback coach exists          | Not Run |       |
| Raw profile not logged         | Not Run |       |
| Privacy page exists            | Not Run |       |
| Clear-data control exists      | Not Run |       |

## Efficiency

| Check                                        | Status  | Notes |
| -------------------------------------------- | ------- | ----- |
| App shell does not wait for LLM              | Not Run |       |
| LLM calls are user-triggered                 | Not Run |       |
| Coach response caching exists if implemented | Not Run |       |
| No heavy chart library                       | Not Run |       |
| No Three.js                                  | Not Run |       |
| Cloud Run min instances 0 documented         | Not Run |       |
| Production build used                        | Not Run |       |
| Docker image kept small                      | Not Run |       |
| No local LLM hosting                         | Not Run |       |

## Testing

| Check                         | Status  | Notes |
| ----------------------------- | ------- | ----- |
| Carbon engine tests           | Not Run |       |
| Recommendation engine tests   | Not Run |       |
| Privacy/redaction tests       | Not Run |       |
| Fallback coach tests          | Not Run |       |
| Numeric guard tests           | Not Run |       |
| Gemini failure/fallback tests | Not Run |       |
| Choice engine tests           | Not Run |       |
| Carbon World tests            | Not Run |       |
| Tracker tests                 | Not Run |       |
| Accessibility smoke tests     | Not Run |       |
| Final `npm run test` passes   | Not Run |       |

## Accessibility

| Check                        | Status  | Notes |
| ---------------------------- | ------- | ----- |
| Inputs labelled              | Not Run |       |
| Buttons accessible           | Not Run |       |
| Keyboard navigation checked  | Not Run |       |
| Visible focus states         | Not Run |       |
| Non-color-only statuses      | Not Run |       |
| Carbon World text equivalent | Not Run |       |
| Coach state announced        | Not Run |       |
| Mobile layout checked        | Not Run |       |

## Problem Statement Alignment

| Check                              | Status  | Notes |
| ---------------------------------- | ------- | ----- |
| Product is awareness-first         | Not Run |       |
| Not just a calculator/dashboard    | Not Run |       |
| Footprint Coach implemented        | Not Run |       |
| Choice Coach implemented           | Not Run |       |
| Daily Choice Lab implemented       | Not Run |       |
| Weekly action tracking implemented | Not Run |       |
| Carbon World feedback implemented  | Not Run |       |
| Personalized insights visible      | Not Run |       |
| Simple actions visible             | Not Run |       |
| LinkedIn prompt strategy ready     | Not Run |       |

---

# Final Release Gate

Do not submit unless every required item below is `Pass` or `Manual Pass`.

| Gate                                    | Status  | Notes |
| --------------------------------------- | ------- | ----- |
| `npm run build`                         | Not Run |       |
| `npm run typecheck`                     | Not Run |       |
| `npm run test`                          | Not Run |       |
| `npm run lint`                          | Not Run |       |
| `npm run format:check`                  | Not Run |       |
| `npm ls` reviewed                       | Not Run |       |
| `npm audit --omit=dev` reviewed         | Not Run |       |
| Cloud Run deployment works              | Not Run |       |
| Public app URL recorded                 | Not Run |       |
| `/health` works                         | Not Run |       |
| Footprint Coach works                   | Not Run |       |
| Footprint Coach fallback works          | Not Run |       |
| Choice Coach works                      | Not Run |       |
| Choice Coach fallback works             | Not Run |       |
| Numeric invention guard verified        | Not Run |       |
| Onboarding manual flow passed           | Not Run |       |
| Footprint summary manual flow passed    | Not Run |       |
| Daily Choice Lab manual flow passed     | Not Run |       |
| Carbon World manual flow passed         | Not Run |       |
| Weekly Tracker manual flow passed       | Not Run |       |
| Privacy / clear-data manual flow passed | Not Run |       |
| Accessibility checklist passed          | Not Run |       |
| README matches implementation           | Not Run |       |
| LinkedIn post draft ready               | Not Run |       |
| Prompt strategy doc ready               | Not Run |       |
| Tools and architecture doc ready        | Not Run |       |
| No unsupported claims found             | Not Run |       |
| Repository size under challenge limit   | Not Run |       |

---

# Submission Attempt Log

Only the latest submission counts.

Do not submit speculative or incomplete builds.

## Attempt 1

| Field        | Value |
| ------------ | ----- |
| Submitted?   | No    |
| Submitted At |       |
| Git Commit   |       |
| Deployed URL |       |
| GitHub URL   |       |
| LinkedIn URL |       |
| Score        |       |
| Notes        |       |

## Attempt 2

| Field        | Value |
| ------------ | ----- |
| Submitted?   | No    |
| Submitted At |       |
| Git Commit   |       |
| Deployed URL |       |
| GitHub URL   |       |
| LinkedIn URL |       |
| Score        |       |
| Notes        |       |

## Attempt 3

| Field        | Value |
| ------------ | ----- |
| Submitted?   | No    |
| Submitted At |       |
| Git Commit   |       |
| Deployed URL |       |
| GitHub URL   |       |
| LinkedIn URL |       |
| Score        |       |
| Notes        |       |

---

# Change Log

Track meaningful project progress updates here.

| Date       | Change                                 | Commit  | Notes        |
| ---------- | -------------------------------------- | ------- | ------------ |
| 2026-06-15 | Initial build progress tracker created | Pending | Pre-Task 001 |

---

# Final Notes

This tracker must remain truthful.

Do not mark any task complete unless:

- the implementation exists,
- relevant verification has run,
- failures are documented,
- and human review has accepted the result.

CarbonCoach should be built as a high-scoring product from the beginning, not repaired at the end.
