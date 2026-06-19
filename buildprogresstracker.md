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

_Note on controlled deviation: Choice Coach UI was pulled forward to complete the Daily Choice Lab coaching loop before tracker/persistence work. Weekly Tracker and Carbon World were shifted to the next tasks._

| Task  | Title                                                                             | Status       | Owner/Agent | Scoring Focus         | Build | Typecheck | Tests | Lint | Format  | Human Review | Commit  |
| ----- | --------------------------------------------------------------------------------- | ------------ | ----------- | --------------------- | ----- | --------- | ----- | ---- | ------- | ------------ | ------- |
| 001   | Repo Foundation, Workspace, and Quality Gates                                     | Complete     | Antigravity | CQ, TEST, EFF         | Pass  | Pass      | Pass  | Pass | Pass    | Accepted     | Pending |
| 002   | Shared Carbon Domain Model and Factor Registry                                    | Complete     | Antigravity | CQ, TEST, ALIGN       | Pass  | Pass      | Pass  | Pass | Pass    | Accepted     | Pending |
| 003   | Deterministic Carbon Footprint Engine                                             | Complete     | Antigravity | CQ, TEST, ALIGN       | Pass  | Pass      | Pass  | Pass | Pass    | Accepted     | Pending |
| 004   | Recommendation Engine and Weekly Action Ranking                                   | Complete     | Antigravity | CQ, TEST, ALIGN       | Pass  | Pass      | Pass  | Pass | Pass    | Accepted     | Pending |
| 005   | Privacy, Redaction, and Local Data Safety Utilities                               | Complete     | Antigravity | SEC, TEST, CQ         | Pass  | Pass      | Pass  | Pass | Pass    | Accepted     | Pending |
| 006   | Coach Contracts, Fallback Composer, and Numeric Guard Contracts                   | Review Ready | Antigravity | SEC, TEST, CQ         | Pass  | Pass      | Pass  | Pass | Pass    | Pending      | Pending |
| 007   | Gemini Coach Service with Timeout, Schema Validation, Numeric Guard, and Fallback | Review Ready | Antigravity | SEC, EFF, TEST, ALIGN | Pass  | Pass      | Pass  | Pass | Pass    | Pending      | Pending |
| 008   | Accessible UI Foundation and App Shell                                            | Review Ready | Antigravity | CQ, A11Y, EFF         | Pass  | Pass      | Pass  | Pass | Pass    | Pending      | Pending |
| 009   | Carbon Profile Onboarding Flow                                                    | Review Ready | Antigravity | A11Y, CQ, ALIGN       | Pass  | Pass      | Pass  | Pass | Pass    | Pending      | Pending |
| 010   | Footprint Summary UI                                                              | Review Ready | Antigravity | ALIGN, A11Y, CQ       | Pass  | Pass      | Pass  | Pass | Pass    | Pending      | Pending |
| 011   | Recommendation and Weekly Plan UI                                                 | Review Ready | Antigravity | ALIGN, TEST, CQ       | Pass  | Pass      | Pass  | Pass | Pass    | Pending      | Pending |
| 012   | Footprint Coach UI                                                                | Review Ready | Antigravity | ALIGN, A11Y, SEC, EFF | Pass  | Pass      | Pass  | Pass | Pass    | Pending      | Pending |
| 013   | Daily Choice Lab Foundation                                                       | Review Ready | Antigravity | ALIGN, A11Y, EFF      | Pass  | Pass      | Pass  | Pass | Pass    | Pending      | Pending |
| 014   | Choice Coach UI                                                                   | Review Ready | Antigravity | ALIGN, TEST, SEC      | Pass  | Pass      | Pass  | Pass | Pass    | Pending      | Pending |
| 015   | Weekly Tracker and Local Persistence                                              | Review Ready | Antigravity | ALIGN, CQ, TEST       | Pass  | Pass      | Pass  | Pass | Pass    | Pending      | Pending |
| 016   | Carbon World Engine and Lightweight Visual UI                                     | Review Ready | Antigravity | ALIGN, A11Y, EFF      | Pass  | Pass      | Pass  | Pass | Pass    | Pending      | Pending |
| Patch | Pre-Task 017 Smoke Polish Patch                                                   | Review Ready | Antigravity | CQ, ALIGN             | Pass  | Pass      | Pass  | Pass | Pass    | Pending      | Pending |
| 017   | Privacy and Assumptions Page                                                      | Review Ready | Antigravity | SEC, ALIGN, CQ        | Pass  | Pass      | Pass  | Pass | Pass    | Pending      | Pending |
| 018   | Final Accessibility / Demo Polish                                                 | Review Ready | Antigravity | A11Y, CQ, TEST        | Pass  | Pass      | Pass  | Pass | Pass    | Pending      | Pending |
| 019   | Cloud Run Deployment                                                              | Review Ready | Antigravity | EFF, SEC, CQ          | Pass  | Pass      | Pass  | Pass | Pass    | Pending      | Pending |
| 020   | README, Submission Docs, LinkedIn Post                                            | Not Started  | TBD         | ALIGN, CQ             | N/A   | N/A       | N/A   | N/A  | Not Run | Not Run      | Pending |

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
| Commit Hash               | 80028ff438d0f4b295b4af12ad77e6d616961904                                                                                                                                                                                                                                                      |
| Files Changed             | packages/shared/src/types/carbon.ts, packages/shared/src/carbon/factorTypes.ts, packages/shared/src/carbon/assumptions.ts, packages/shared/src/carbon/factorRegistry.ts, packages/shared/src/carbon/index.ts, packages/shared/src/index.ts, packages/shared/src/carbon/factorRegistry.test.ts |
| Summary                   | Implemented the carbon domain types, factor registry types, assumption metadata, transparent factor registry, helpers, and integrity tests.                                                                                                                                                   |
| Verification Commands Run | npm run build, npm run typecheck, npm run test, npm run lint, npm run format:check                                                                                                                                                                                                            |
| Verification Result       | Pass                                                                                                                                                                                                                                                                                          |
| Human Review Result       | Accepted                                                                                                                                                                                                                                                                                      |
| Risks / Follow-ups        | None. Baseline registry holds demo assumptions clearly marked as directional.                                                                                                                                                                                                                 |

---

## Task 003 — Deterministic Carbon Footprint Engine

| Field                     | Value                                                                                                                                                                           |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Status                    | Review Ready                                                                                                                                                                    |
| Started At                | 2026-06-15                                                                                                                                                                      |
| Completed At              | 2026-06-15                                                                                                                                                                      |
| Agent / Tool              | Antigravity                                                                                                                                                                     |
| Commit Hash               | Pending                                                                                                                                                                         |
| Files Changed             | packages/shared/src/carbon/categoryCalculators.ts, packages/shared/src/carbon/calculator.ts, packages/shared/src/carbon/calculator.test.ts, packages/shared/src/carbon/index.ts |
| Summary                   | Implemented deterministic footprint calculation with category-specific logic, normalization handling, top contributor derivation, confidence levels, and full test suite.       |
| Verification Commands Run | npm run build, npm run typecheck, npm run test, npm run lint, npm run format:check                                                                                              |
| Verification Result       | Pass                                                                                                                                                                            |
| Human Review Result       | Accepted                                                                                                                                                                        |
| Risks / Follow-ups        | No recommendation engine added, calculation logic only handles existing profile values. Strict numeric fallback bounds logic is documented.                                     |

---

## Task 004 — Recommendation Engine and Weekly Action Ranking

| Field                     | Value                                                                                                      |
| ------------------------- | ---------------------------------------------------------------------------------------------------------- |
| Status                    | Review Ready                                                                                               |
| Started At                | 2026-06-15                                                                                                 |
| Completed At              | 2026-06-15                                                                                                 |
| Agent / Tool              | Antigravity                                                                                                |
| Commit Hash               | Pending                                                                                                    |
| Files Changed             | packages/shared/src/types/actions.ts, packages/shared/src/recommendations/\*, packages/shared/src/index.ts |
| Summary                   | Implemented deterministic action catalog, preference-aware recommendation scoring, and weekly action plan. |
| Verification Commands Run | npm run build, npm run typecheck, npm run test, npm run lint, npm run format:check                         |
| Verification Result       | Pass                                                                                                       |
| Human Review Result       | Pending                                                                                                    |
| Risks / Follow-ups        | None. Numeric values only included if documented; heavily rely on impactBand otherwise.                    |

---

## Task 005 — Privacy, Redaction, and Local Data Safety Utilities

| Field                     | Value                                                                                                                                                                                                                                                     |
| ------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Status                    | Review Ready                                                                                                                                                                                                                                              |
| Started At                | 2026-06-15                                                                                                                                                                                                                                                |
| Completed At              | 2026-06-15                                                                                                                                                                                                                                                |
| Agent / Tool              | Antigravity                                                                                                                                                                                                                                               |
| Commit Hash               | Pending                                                                                                                                                                                                                                                   |
| Files Changed             | packages/shared/src/types/privacy.ts, packages/shared/src/privacy/redaction.ts, packages/shared/src/privacy/minimizeCoachContext.ts, packages/shared/src/privacy/localDataPolicy.ts, packages/shared/src/privacy/\*.test.ts, packages/shared/src/index.ts |
| Summary                   | Implemented privacy layer utilities: lightweight regex redaction, coach context minimization helpers, and local data policy metadata.                                                                                                                     |
| Verification Commands Run | npm run build, npm run typecheck, npm run test, npm run lint, npm run format:check                                                                                                                                                                        |
| Verification Result       | Pass                                                                                                                                                                                                                                                      |
| Human Review Result       | Pending                                                                                                                                                                                                                                                   |
| Risks / Follow-ups        | Context minimization uses strings for numbers to strictly adhere to deterministic values guard. Basic regexes are used for redaction as lightweight fallback.                                                                                             |

---

## Task 006 — Coach Contracts, Fallback Composer, and Numeric Guard Contracts

| Field                     | Value                                                                                                                                                                                                                                                                                                                                                                                                                              |
| ------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Status                    | Review Ready                                                                                                                                                                                                                                                                                                                                                                                                                       |
| Started At                | 2026-06-16                                                                                                                                                                                                                                                                                                                                                                                                                         |
| Completed At              | 2026-06-16                                                                                                                                                                                                                                                                                                                                                                                                                         |
| Agent / Tool              | Antigravity                                                                                                                                                                                                                                                                                                                                                                                                                        |
| Commit Hash               | Pending                                                                                                                                                                                                                                                                                                                                                                                                                            |
| Files Changed             | packages/shared/src/assistant/coachTypes.ts, packages/shared/src/assistant/coachValidation.ts, packages/shared/src/assistant/fallbackCoach.ts, packages/shared/src/assistant/numericGuard.ts, packages/shared/src/assistant/fallbackCoach.test.ts, packages/shared/src/assistant/numericGuard.test.ts, packages/shared/src/assistant/coachValidation.test.ts, packages/shared/src/assistant/index.ts, packages/shared/src/index.ts |
| Summary                   | Implemented assistant coach types, lightweight response validation, deterministic fallback composer, and the Numeric Invention Guard with a comprehensive Vitest test suite.                                                                                                                                                                                                                                                       |
| Verification Commands Run | npm run build, npm run typecheck, npm run test, npm run lint, npm run format:check                                                                                                                                                                                                                                                                                                                                                 |
| Verification Result       | Pass                                                                                                                                                                                                                                                                                                                                                                                                                               |
| Human Review Result       | Pending                                                                                                                                                                                                                                                                                                                                                                                                                            |
| Risks / Follow-ups        | None. Bounded constraints and numeric guards are fully verified with unit tests.                                                                                                                                                                                                                                                                                                                                                   |

---

## Task 007 — Gemini Coach Service with Timeout, Schema Validation, Numeric Guard, and Fallback

| Field                     | Value                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| ------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Status                    | Review Ready                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| Started At                | 2026-06-16                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| Completed At              | 2026-06-16                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| Agent / Tool              | Antigravity                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| Commit Hash               | Pending                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| Files Changed             | services/api/package.json, services/api/src/server.ts, services/api/src/middleware/validateCoachRequest.ts, services/api/src/middleware/safeLogging.ts, services/api/src/llm/timeout.ts, services/api/src/llm/llmProvider.ts, services/api/src/llm/geminiProvider.ts, services/api/src/coach/promptBuilder.ts, services/api/src/coach/responseParser.ts, services/api/src/coach/coachController.ts, services/api/src/coach/coachRoutes.ts, services/api/test/\* |
| Summary                   | Implemented the backend Gemini coach service endpoints, request validator middleware, safe logging helpers, timeout utility, LLM provider boundary, prompts with constraints, response parser, controller coordinating numeric guard, and vitest unit/integration suite.                                                                                                                                                                                        |
| Verification Commands Run | npm run build, npm run typecheck, npm run test, npm run lint, npm run format:check                                                                                                                                                                                                                                                                                                                                                                              |
| Verification Result       | Pass                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| Human Review Result       | Pending                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| Risks / Follow-ups        | None. Tests verify that error and validation boundaries trigger deterministic fallbacks correctly.                                                                                                                                                                                                                                                                                                                                                              |

### LLM Safety Evidence

| Check                                | Result | Notes                                                     |
| ------------------------------------ | ------ | --------------------------------------------------------- |
| Gemini key is server-side only       | Pass   | Retrieved only in GeminiProvider backend                  |
| Missing key fallback works           | Pass   | Tested in unit tests, returns fallback composer response  |
| Timeout fallback works               | Pass   | Tested via withTimeout wrapper unit tests                 |
| Malformed response fallback works    | Pass   | Parser throws on bad JSON, returning fallback             |
| Unsupported number response rejected | Pass   | Numeric Invention Guard validates output and falls back   |
| Raw prompt not logged                | Pass   | Prompts and context are excluded from safe logging helper |
| Raw profile not logged               | Pass   | Input context minimization limits fields sent to provider |

---

## Task 008 — Accessible UI Foundation and App Shell

| Field                     | Value                                                                                                                                                                                                                                                                              |
| ------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Status                    | Review Ready                                                                                                                                                                                                                                                                       |
| Started At                | 2026-06-16                                                                                                                                                                                                                                                                         |
| Completed At              | 2026-06-16                                                                                                                                                                                                                                                                         |
| Agent / Tool              | Antigravity                                                                                                                                                                                                                                                                        |
| Commit Hash               | Pending                                                                                                                                                                                                                                                                            |
| Files Changed             | apps/web/src/styles/tokens.css, apps/web/src/styles/global.css, apps/web/src/styles/layout.css, apps/web/src/styles/components.css, apps/web/src/app/navigation.ts, apps/web/src/app/routes.ts, apps/web/src/components/ui/\*, apps/web/src/app/AppShell.tsx, apps/web/src/App.tsx |
| Summary                   | Implemented global design tokens, styling baseline, reusable accessible UI primitives, skip links, semantic landmarks, responsive navigation structure, and placeholders matching local-first policies.                                                                            |
| Verification Commands Run | npm run build, npm run typecheck, npm run test, npm run lint, npm run format:check                                                                                                                                                                                                 |
| Verification Result       | Pass                                                                                                                                                                                                                                                                               |
| Human Review Result       | Pending                                                                                                                                                                                                                                                                            |
| Risks / Follow-ups        | None. Form controls and layouts are strictly structural and ready to receive real state implementations.                                                                                                                                                                           |

---

## Task 009 — Carbon Profile Onboarding Flow

| Field                     | Value                                                                                                                                             |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| Status                    | Review Ready                                                                                                                                      |
| Started At                | 2026-06-16                                                                                                                                        |
| Completed At              | 2026-06-16                                                                                                                                        |
| Agent / Tool              | Antigravity                                                                                                                                       |
| Commit Hash               | Pending                                                                                                                                           |
| Files Changed             | apps/web/src/features/profile/\*, apps/web/src/app/AppShell.tsx                                                                                   |
| Summary                   | Implemented the accessible, keyboard-navigable profile onboarding flow with form validation and dynamic summary states, integrated into AppShell. |
| Verification Commands Run | npm run build, npm run typecheck, npm run test, npm run lint, npm run format:check                                                                |
| Verification Result       | Pass                                                                                                                                              |
| Human Review Result       | Pending                                                                                                                                           |
| Risks / Follow-ups        | In-memory state only. Persistence in localStorage to be added in Task 014.                                                                        |

---

## Task 010 — Footprint Summary and Action Plan UI

| Field                     | Value                                                                                                                                                                                                                          |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Status                    | Review Ready                                                                                                                                                                                                                   |
| Started At                | 2026-06-16                                                                                                                                                                                                                     |
| Completed At              | 2026-06-16                                                                                                                                                                                                                     |
| Agent / Tool              | Antigravity                                                                                                                                                                                                                    |
| Commit Hash               | Pending                                                                                                                                                                                                                        |
| Files Changed             | apps/web/src/features/footprint/footprintViewModel.ts, apps/web/src/features/footprint/FootprintSummary.tsx, apps/web/src/features/footprint/index.ts, apps/web/src/features/footprint/_.test._, apps/web/src/app/AppShell.tsx |
| Summary                   | Connected in-memory profile to shared deterministic calculator. Implemented approximate footprint summary UI, category breakdowns with impact/confidence badges, top contributor card, and scientific assumptions.             |
| Verification Commands Run | npm run build, npm run typecheck, npm run test, npm run lint, npm run format:check                                                                                                                                             |
| Verification Result       | Pass                                                                                                                                                                                                                           |
| Human Review Result       | Pending                                                                                                                                                                                                                        |
| Risks / Follow-ups        | Local-first in-memory profile only. AI coaching and weekly action recommendation details will be integrated in subsequent tasks.                                                                                               |

---

## Task 011 — Recommendation and Weekly Plan UI

| Field                     | Value                                                                                                                                                                                                                             |
| ------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Status                    | Review Ready                                                                                                                                                                                                                      |
| Started At                | 2026-06-17                                                                                                                                                                                                                        |
| Completed At              | 2026-06-17                                                                                                                                                                                                                        |
| Agent / Tool              | Antigravity                                                                                                                                                                                                                       |
| Commit Hash               | Pending                                                                                                                                                                                                                           |
| Files Changed             | apps/web/src/app/routes.ts, apps/web/src/app/navigation.ts, apps/web/src/app/AppShell.tsx, apps/web/src/features/recommendations/\*                                                                                               |
| Summary                   | Connected in-memory profile to shared deterministic recommendation engine and weekly plan generator. Rendered action cards, suggested weekly plan checklists, priority badge, disclaimers, empty states, and comprehensive tests. |
| Verification Commands Run | npm run build, npm run typecheck, npm run test, npm run lint, npm run format:check                                                                                                                                                |
| Verification Result       | Pass                                                                                                                                                                                                                              |
| Human Review Result       | Pending                                                                                                                                                                                                                           |
| Risks / Follow-ups        | None. No coach API integration, choice labs, or state persistence yet. Runs fully client-side on deterministic shared calculations.                                                                                               |

---

## Task 012 — Footprint Coach UI

| Field                     | Value                                                                                                                                                                                                                                      |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Status                    | Review Ready                                                                                                                                                                                                                               |
| Started At                | 2026-06-17                                                                                                                                                                                                                                 |
| Completed At              | 2026-06-17                                                                                                                                                                                                                                 |
| Agent / Tool              | Antigravity                                                                                                                                                                                                                                |
| Commit Hash               | Pending                                                                                                                                                                                                                                    |
| Files Changed             | apps/web/src/features/coach/\*, apps/web/src/features/recommendations/RecommendationPanel.tsx, apps/web/src/features/recommendations/RecommendationPanel.test.tsx                                                                          |
| Summary                   | Connected calculated footprint summary and recommendations to `/api/coach` endpoint, rendering safe AI responses and handling loading, error, and fallback states. Used select primitive for tone and structured markup for screen reader. |
| Verification Commands Run | npm run build, npm run typecheck, npm run test, npm run lint, npm run format:check                                                                                                                                                         |
| Verification Result       | Pass                                                                                                                                                                                                                                       |
| Human Review Result       | Pending                                                                                                                                                                                                                                    |
| Risks / Follow-ups        | None. Daily Choice Lab, Choice Coach UI, and Carbon World are not implemented as they are deferred to later tasks.                                                                                                                         |

### Footprint Coach Evidence

| Check                                   | Result | Notes                                                        |
| --------------------------------------- | ------ | ------------------------------------------------------------ |
| Footprint Coach is user-triggered only  | Pass   | Only requested when user clicks 'Ask Footprint Coach' button |
| Footprint Coach fallback works          | Pass   | Handled transparently by backend fallback composer           |
| Footprint Coach does not invent numbers | Pass   | Uses allowedNumbers guard derived from footprint context     |
| Footprint context is minimized          | Pass   | No raw onboarding profile sent; only aggregates/titles       |
| UI shows fallback state clearly         | Pass   | Distinct badge and styling for Deterministic Fallback status |

---

## Task 013 — Daily Choice Lab Foundation

| Field                     | Value                                                                                                                                                                      |
| ------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Status                    | Review Ready                                                                                                                                                               |
| Started At                | 2026-06-17                                                                                                                                                                 |
| Completed At              | 2026-06-17                                                                                                                                                                 |
| Agent / Tool              | Antigravity                                                                                                                                                                |
| Commit Hash               | Pending                                                                                                                                                                    |
| Files Changed             | packages/shared/src/choices/_, packages/shared/src/index.ts, apps/web/src/features/choices/_, apps/web/src/app/AppShell.tsx                                                |
| Summary                   | Implemented deterministic everyday choice scenario comparison logic, catalog, dropdown selector, layout grid, disclaimers, formatters, and unit/UI integration test suite. |
| Verification Commands Run | npm run build, npm run typecheck, npm run test, npm run lint, npm run format:check                                                                                         |
| Verification Result       | Pass                                                                                                                                                                       |
| Human Review Result       | Pending                                                                                                                                                                    |
| Risks / Follow-ups        | None. Choice Coach, Carbon World, and local persistence are not implemented in this task.                                                                                  |

### Daily Choice Lab Evidence

| Check                                    | Result | Notes                                                       |
| ---------------------------------------- | ------ | ----------------------------------------------------------- |
| Scenario selector is keyboard accessible | Pass   | Standard Select component with explicit aria labels and ids |
| Options are compared side-by-side        | Pass   | Displayed in a clear responsive comparison panel grid       |
| No Choice Coach API calls                | Pass   | Feature uses deterministic explanations; /api/coach not hit |
| No localStorage is used                  | Pass   | Verified in UI unit tests                                   |

---

## Task 014 — Choice Coach UI

| Field                     | Value                                                                                                                                                                                                                                                                                                                                                                                 |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Status                    | Review Ready                                                                                                                                                                                                                                                                                                                                                                          |
| Started At                | 2026-06-17                                                                                                                                                                                                                                                                                                                                                                            |
| Completed At              | 2026-06-17                                                                                                                                                                                                                                                                                                                                                                            |
| Agent / Tool              | Antigravity                                                                                                                                                                                                                                                                                                                                                                           |
| Commit Hash               | Pending                                                                                                                                                                                                                                                                                                                                                                               |
| Files Changed             | apps/web/src/features/coach/ChoiceCoachPanel.tsx, apps/web/src/features/coach/choiceCoachRequestBuilder.ts, apps/web/src/features/coach/coachClient.ts, apps/web/src/features/choices/DailyChoiceLab.tsx, apps/web/src/features/coach/ChoiceCoachPanel.test.tsx, apps/web/src/features/coach/choiceCoachRequestBuilder.test.ts, apps/web/src/features/choices/DailyChoiceLab.test.tsx |
| Summary                   | Implemented interactive Choice Coach UI, payload request builder extracting scenario context & allowed numbers, backend client function, tests, and Daily Choice Lab integration.                                                                                                                                                                                                     |
| Verification Commands Run | npm run build, npm run typecheck, npm run test, npm run lint, npm run format:check                                                                                                                                                                                                                                                                                                    |
| Verification Result       | Pass                                                                                                                                                                                                                                                                                                                                                                                  |
| Human Review Result       | Pending                                                                                                                                                                                                                                                                                                                                                                               |
| Risks / Follow-ups        | None. Local persistence and Carbon World elements are excluded per task scope.                                                                                                                                                                                                                                                                                                        |

### Choice Coach UI Evidence

| Check                                  | Result | Notes                                                      |
| -------------------------------------- | ------ | ---------------------------------------------------------- |
| Choice Coach is user-triggered only    | Pass   | Only requested when user clicks 'Ask Choice Coach' button  |
| Choice Coach fallback works            | Pass   | Handled transparently by backend fallback composer         |
| Choice Coach does not invent numbers   | Pass   | Uses allowedNumbers guard derived from choice context      |
| Choice context is minimized            | Pass   | No raw onboarding profile or local storage data is sent    |
| UI shows fallback/AI state clearly     | Pass   | Uses existing CoachResponseCard status badges              |
| Response is cleared on scenario change | Pass   | useEffect hook resets panel state when scenario ID changes |

---

## Task 015 — Weekly Tracker and Local Persistence

| Field                     | Value                                                                                                                                                                                                                                                                                                    |
| ------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Status                    | Review Ready                                                                                                                                                                                                                                                                                             |
| Started At                | 2026-06-17                                                                                                                                                                                                                                                                                               |
| Completed At              | 2026-06-17                                                                                                                                                                                                                                                                                               |
| Agent / Tool              | Antigravity                                                                                                                                                                                                                                                                                              |
| Commit Hash               | Pending                                                                                                                                                                                                                                                                                                  |
| Files Changed             | packages/shared/src/tracker/_, packages/shared/src/index.ts, apps/web/src/features/tracker/_, apps/web/src/app/AppShell.tsx                                                                                                                                                                              |
| Summary                   | Implemented local-first browser persistence for profile and checklist progress state, an accessible WeeklyTracker UI checklist mapping to the deterministic weekly plan, and a LocalDataControls dashboard. Added thorough unit/UI test coverage for state transitions, storage boundaries, and UI flow. |
| Verification Commands Run | npm run build, npm run typecheck, npm run test, npm run lint, npm run format:check                                                                                                                                                                                                                       |
| Verification Result       | Pass                                                                                                                                                                                                                                                                                                     |
| Human Review Result       | Pending                                                                                                                                                                                                                                                                                                  |
| Risks / Follow-ups        | None. Carbon World engine and Privacy page are out of scope and will be implemented in subsequent tasks.                                                                                                                                                                                                 |

### Weekly Tracker Evidence

| Check                             | Result | Notes                                                                                  |
| --------------------------------- | ------ | -------------------------------------------------------------------------------------- |
| Local persistence implemented     | Pass   | Handled via try-catch wrapped window.localStorage utilities in trackerStorage.ts       |
| Action completion tracking works  | Pass   | Custom React hook useWeeklyTracker manages check states deterministically in memory    |
| Avoided impact calculations works | Pass   | Progress is calculated dynamically based on action array size and checklist checks     |
| Clear data functionality works    | Pass   | LocalDataControls component safely deletes namespace carboncoach keys and resets state |

---

## Task 016 — Carbon World Engine and Lightweight Visual UI

| Field                     | Value                                                                                                                                                                           |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Status                    | Review Ready                                                                                                                                                                    |
| Started At                | 2026-06-17                                                                                                                                                                      |
| Completed At              | 2026-06-17                                                                                                                                                                      |
| Agent / Tool              | Antigravity                                                                                                                                                                     |
| Commit Hash               | Pending                                                                                                                                                                         |
| Files Changed             | packages/shared/src/world/_, packages/shared/src/index.ts, apps/web/src/features/world/_, apps/web/src/app/AppShell.tsx, apps/web/src/features/tracker/WeeklyTracker.tsx        |
| Summary                   | Implemented shared Carbon World stage/state engine, SVG-based stages visual component (CarbonWorldScene), status panel (CarbonWorldStatus), view model, tests, and integration. |
| Verification Commands Run | npm run build, npm run typecheck, npm run test, npm run lint, npm run format:check                                                                                              |
| Verification Result       | Pass                                                                                                                                                                            |
| Human Review Result       | Pending                                                                                                                                                                         |
| Risks / Follow-ups        | None. Privacy and Assumptions pages are not implemented in this task.                                                                                                           |

### Carbon World Evidence

| Check                                     | Result | Notes                                                                                 |
| ----------------------------------------- | ------ | ------------------------------------------------------------------------------------- |
| Visual representation of footprint        | Pass   | SVG-based stages (seed, sprout, garden, grove) render progress meter/checklist states |
| Text equivalent accessibility description | Pass   | aria-label on SVG wrapper is set to dynamic text descriptive of current stage         |
| SVG/CSS design states render              | Pass   | Verified in RTL tests rendering correct classes and stage texts                       |

---

## Pre-Task 017 Smoke Polish Patch

| Field                     | Value                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| ------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Status                    | Review Ready                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| Started At                | 2026-06-17                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| Completed At              | 2026-06-17                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| Agent / Tool              | Antigravity                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| Commit Hash               | Pending                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| Files Changed             | apps/web/src/app/AppShell.tsx, apps/web/src/app/navigation.ts, apps/web/src/features/profile/profileCopy.ts, apps/web/src/features/footprint/FootprintSummary.tsx, apps/web/src/features/footprint/FootprintSummary.test.tsx, apps/web/src/features/choices/choiceCopy.ts, apps/web/src/features/recommendations/recommendationCopy.ts, apps/web/src/features/recommendations/recommendationViewModel.ts, packages/shared/src/choices/choiceScenarios.ts, packages/shared/src/recommendations/actionCatalog.ts, implementationplan.md, buildprogresstracker.md |
| Summary                   | Cleaned up stale "coming soon" placeholders for implemented features, adjusted overstrong user-facing claims, aligned privacy and assumptions definitions to local-first sandbox, corrected mixed-language headings, and updated documentation.                                                                                                                                                                                                                                                                                                                |
| Verification Commands Run | npm run build, npm run typecheck, npm run test, npm run lint, npm run format:check                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| Verification Result       | Pass                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| Human Review Result       | Pending                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| Risks / Follow-ups        | None. This is a content/copy polish and consistency patch only. Feature logic remains untouched.                                                                                                                                                                                                                                                                                                                                                                                                                                                               |

---

## Task 017 — Privacy and Assumptions Page

| Field                     | Value                                                                                                                                                                                                                                                        |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Status                    | Review Ready                                                                                                                                                                                                                                                 |
| Started At                | 2026-06-18                                                                                                                                                                                                                                                   |
| Completed At              | 2026-06-18                                                                                                                                                                                                                                                   |
| Agent / Tool              | Antigravity                                                                                                                                                                                                                                                  |
| Commit Hash               | Pending                                                                                                                                                                                                                                                      |
| Files Changed             | apps/web/src/features/privacy/_, apps/web/src/features/assumptions/_, apps/web/src/app/AppShell.tsx                                                                                                                                                          |
| Summary                   | Implemented real in-app Privacy & Local Data and Estimates & Assumptions pages, local data policy items table, coach data-flow step panel, methodology boundaries, cleared local data controls integration, and thorough accessibility and compliance tests. |
| Verification Commands Run | npm run build, npm run typecheck, npm run test, npm run lint, npm run format:check                                                                                                                                                                           |
| Verification Result       | Pass                                                                                                                                                                                                                                                         |
| Human Review Result       | Pending                                                                                                                                                                                                                                                      |
| Risks / Follow-ups        | None. README changes and submission docs are deferred to Task 020.                                                                                                                                                                                           |

### Trust Documentation Evidence

| Check                                     | Result  | Notes                                                                               |
| ----------------------------------------- | ------- | ----------------------------------------------------------------------------------- |
| Privacy page implemented                  | Pass    | Real page with intro, commits, no-account note, and policy table is rendered        |
| Assumptions page implemented              | Pass    | Real page with disclaimer, categories section, and factors table is rendered        |
| Clear data control works                  | Pass    | Reuses LocalDataControls component and hooks it to clear profile state successfully |
| README explains LLM usage                 | Not Run | Deferred to Task 020 (Scope boundaries)                                             |
| README explains deterministic calculation | Not Run | Deferred to Task 020 (Scope boundaries)                                             |
| README explains numeric guard             | Not Run | Deferred to Task 020 (Scope boundaries)                                             |
| README avoids scientific overclaiming     | Not Run | Deferred to Task 020 (Scope boundaries)                                             |

## Task 018 — Final Accessibility / Demo Polish

| Field                     | Value                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Status                    | Review Ready                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| Started At                | 2026-06-18                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| Completed At              | 2026-06-18                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| Agent / Tool              | Antigravity                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| Commit Hash               | Pending                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| Files Changed             | SECURITY.md, METHODOLOGY.md, apps/web/src/app/navigation.ts, apps/web/src/app/AppShell.tsx, apps/web/src/features/overview/_, apps/web/src/features/recommendations/_, apps/web/src/features/world/_, apps/web/src/features/tracker/_, apps/web/src/features/profile/_, apps/web/src/features/footprint/_, apps/web/src/features/choices/\*                                                                                                                  |
| Summary                   | Created SECURITY.md and METHODOLOGY.md trust docs. Replaced Overview dashboard with a guided journey stepper dashboard, visual trust/privacy strip, Next Best Action card, and Carbon World preview. Standardized all primary CTAs, empty states, and terminology across surfaces to enforce the core journey. Audited floating elements (verified browser-external). Passed build, typecheck, lint, format, and all 247 tests (143 web, 14 api, 90 shared). |
| Verification Commands Run | npm run build, npm run typecheck, npm run test, npm run lint, npm run format:check                                                                                                                                                                                                                                                                                                                                                                           |
| Verification Result       | Pass                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| Human Review Result       | Pending                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| Risks / Follow-ups        | None. Dynamic journey flows and access requirements are fully consistent and validated.                                                                                                                                                                                                                                                                                                                                                                      |

### Accessibility Evidence

| Check                                     | Result      | Notes                                                                |
| ----------------------------------------- | ----------- | -------------------------------------------------------------------- |
| Keyboard onboarding works                 | Manual Pass | Standard form field navigation is fully sequential and keyboard-safe |
| Keyboard Choice Lab works                 | Manual Pass | Scenario cards and options are focused and reachable                 |
| Buttons have accessible names             | Pass        | Clear text labels and aria-label updates applied                     |
| Inputs have labels                        | Pass        | Every onboarding field is explicitly connected to a label            |
| Coach loading/result states are announced | Pass        | Using aria-live polite announcements on panel updates                |
| Impact states are non-color-only          | Pass        | Non-color badge categories and text indicators always present        |
| Carbon World has text equivalent          | Pass        | Textual progress state element rendered directly beneath visual      |
| Mobile layout checked                     | Manual Pass | Responsive design fits mobile viewports via media queries            |

---

## Task 019 — Cloud Run Deployment

| Field                     | Value                                                                                                                                                                                                                                                                                                                        |
| ------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Status                    | Review Ready                                                                                                                                                                                                                                                                                                                 |
| Started At                | 2026-06-19                                                                                                                                                                                                                                                                                                                   |
| Completed At              | 2026-06-19                                                                                                                                                                                                                                                                                                                   |
| Agent / Tool              | Antigravity                                                                                                                                                                                                                                                                                                                  |
| Commit Hash               | Pending                                                                                                                                                                                                                                                                                                                      |
| Files Changed             | services/api/src/middleware/security.ts, services/api/src/server.ts, docs/deployment/cloud-run-free-tier.md, buildprogresstracker.md                                                                                                                                                                                         |
| Summary                   | Configured GCP project gen-lang-client-0021446342, enabled APIs, set up billing, and deployed CarbonCoach as a unified service. Scoped CORS middleware to `/api` and `/health` routes and allowed same-origin requests dynamically based on Host header, fixing static assets loading. Verified coaches and other MVP flows. |
| Verification Commands Run | npm run build, npm run typecheck, npm run test, npm run lint, npm run format:check, browser subagent smoke test                                                                                                                                                                                                              |
| Verification Result       | Pass                                                                                                                                                                                                                                                                                                                         |
| Human Review Result       | Pending                                                                                                                                                                                                                                                                                                                      |
| Risks / Follow-ups        | GEMINI_API_KEY is currently a placeholder on Cloud Run (replace-with-real-key). Both coaches fall back gracefully and safely to deterministic responses. Real key can be updated in the Google Cloud Console.                                                                                                                |

### Deployment Evidence

| Check                                   | Result | Notes                                                                    |
| --------------------------------------- | ------ | ------------------------------------------------------------------------ |
| Docker build succeeds                   | Skip   | Local Docker daemon was not running; built remotely via Cloud Build      |
| Local container runs                    | Skip   | Built and deployed remotely                                              |
| `/health` works                         | Pass   | Returns status ok and providerConfigured: true                           |
| Frontend served from API container      | Pass   | Built Vite assets are fully served at the root `/` and static `/assets/` |
| `/api/coach` works                      | Pass   | Handled successfully via backend endpoints                               |
| Missing Gemini key fallback works       | Pass   | Deterministic fallback coach returns non-judgmental explanations         |
| Gemini key not exposed in frontend      | Pass   | Verified no key exists in code or client network bundles                 |
| Cloud Run min instances documented as 0 | Pass   | Min instances set to 0 to support serverless scale-to-zero               |
| Public URL recorded                     | Pass   | URL is live and verified                                                 |

### Deployment URL

```text
https://carboncoach-192872123770.asia-south1.run.app
```

---

## Task 020 — README, Submission Docs, LinkedIn Post

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

| Gate                                    | Status      | Notes                                         |
| --------------------------------------- | ----------- | --------------------------------------------- |
| `npm run build`                         | Pass        | Verified locally and on Cloud Build           |
| `npm run typecheck`                     | Pass        | Verified locally and on Cloud Build           |
| `npm run test`                          | Pass        | Verified locally                              |
| `npm run lint`                          | Pass        | Verified locally                              |
| `npm run format:check`                  | Pass        | Verified locally                              |
| `npm ls` reviewed                       | Not Run     | To be run in Task 020                         |
| `npm audit --omit=dev` reviewed         | Not Run     | To be run in Task 020                         |
| Cloud Run deployment works              | Pass        | Deployed to gen-lang-client-0021446342        |
| Public app URL recorded                 | Pass        | Deployed URL is active                        |
| `/health` works                         | Pass        | Returns status ok                             |
| Footprint Coach works                   | Pass        | Graceful fallback validated on live URL       |
| Footprint Coach fallback works          | Pass        | Verified fallback composer output on live URL |
| Choice Coach works                      | Pass        | Graceful fallback validated on live URL       |
| Choice Coach fallback works             | Pass        | Verified fallback composer output on live URL |
| Numeric invention guard verified        | Pass        | Fully covered by backend and shared tests     |
| Onboarding manual flow passed           | Manual Pass | Checked via browser subagent                  |
| Footprint summary manual flow passed    | Manual Pass | Checked via browser subagent                  |
| Daily Choice Lab manual flow passed     | Manual Pass | Checked via browser subagent                  |
| Carbon World manual flow passed         | Manual Pass | Checked via browser subagent                  |
| Weekly Tracker manual flow passed       | Manual Pass | Checked via browser subagent                  |
| Privacy / clear-data manual flow passed | Manual Pass | Checked via browser subagent                  |
| Accessibility checklist passed          | Manual Pass | Verified semantic markup and focus styles     |
| README matches implementation           | Not Run     |                                               |
| LinkedIn post draft ready               | Not Run     |                                               |
| Prompt strategy doc ready               | Not Run     |                                               |
| Tools and architecture doc ready        | Not Run     |                                               |
| No unsupported claims found             | Not Run     |                                               |
| Repository size under challenge limit   | Not Run     |                                               |

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

| Date       | Change                                                                      | Commit  | Notes                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| ---------- | --------------------------------------------------------------------------- | ------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 2026-06-19 | Live Gemini Coach Activation Patch                                          | Pending | Status: Review Ready. <br>Model: gemini-2.5-flash-lite <br>Coverage: Footprint Coach and Choice Coach <br>Live verification: pending real key configuration / passed if completed                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| 2026-06-18 | Task 018 Final Acceptance Micro-Patch                                       | Pending | Status: Review Ready. Scope: <br>- Profile local-data consolidation <br>- Privacy policy progressive disclosure <br>- Assumptions wording alignment <br>- Transit scenario factual consistency                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| 2026-06-18 | Fix 10 of 10 — Cross-Surface Journey Consistency                            | Pending | Status: Review Ready. Enforced core journey CTA flows (Profile -> Footprint -> Recommendations -> Tracker -> Carbon World). Standardized primary/secondary button styling and CTAs across pages. Refactored empty states for choices and tracker components to show consistent explanations and buttons. Updated navigation names and Copy definitions. Resolved prototype/overlay artifact audit (verified floating black/white element is external to code). Passed build, typecheck, lint, formatting, and all 247 tests.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| 2026-06-18 | Task 018 Completed & Trust Refined                                          | Pending | Accessibility, demo polish, and refined SECURITY.md / METHODOLOGY.md                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| 2026-06-18 | Daily Choice Lab India Localized                                            | Pending | Localized lunch, transport, AC, and delivery options for Indian context                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| 2026-06-18 | Fix 3 of 10 — Mobile Responsiveness and Navigation Collapse                 | Pending | Status: Review Ready. Desktop sidebar hides at breakpoint < 1024px. Built collapsible mobile navigation overlay dialog with backdrop click dismiss, Escape key dismiss, active nav state indicator, and body-scroll locking. Manually checked viewport sizes 375px, 390px, 430px, 768px, 1024px, 1440px across all routes. No horizontal overflow-x. Focus is captured on open and restored to menu button on close.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| 2026-06-18 | Fix 4 of 10 — Recommendation Density Reduction and Progressive Disclosure   | Pending | Status: Review Ready. Default visible action count capped at top 3, with total count (Showing 3 of X) displayed. Added collapsible disclosures for Plan Assumptions ('How this plan is selected'), fitReasons ('Why this action?'), and detailed assumptions ('View assumptions'). Added toggle for 'Show all deterministic actions' and 'Show fewer actions'. Safety rule description collapsed behind link. Desktop side-by-side grid preserved, mobile vertically stacked. Verified all tests pass.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| 2026-06-18 | Fix 5 of 10 — Carbon World Visual Enrichment and Reward Polish              | Pending | Status: Review Ready. Rich multi-layer SVG scene added to CarbonWorldScene.tsx: stage-specific sky gradients (hazy grey → warm sunrise → blue day → vibrant sky), layered ground hills, three distinct tree models (sapling/young/full), CSS keyframe bird animations, firefly particles for the final grove stage, and cloud drift. CarbonWorld.tsx updated to responsive grid layout (side-by-side desktop, stacked mobile). OverviewDashboard.tsx updated with live CarbonWorldScene preview card. CarbonWorld.test.tsx and OverviewDashboard.test.tsx updated. Unused ProgressMeter import removed. Gates: Build PASS, Typecheck PASS, Tests 231/231 PASS (web 127, api 14, shared 90).                                                                                                                                                                                                                                                                                                                    |
| 2026-06-18 | Fix 6 of 10 — Footprint Summary Visual Simplification and Insight Hierarchy | Pending | Status: Review Ready. Redesigned FootprintSummary.tsx with clear insight hierarchy: (1) hero snapshot card with large total, approximate-estimate trust badges, and top contributor inline; (2) prominent top-contributor insight card with icon, percentage share, and non-judgmental copy; (3) stacked horizontal contribution bars per category with icon, value, "% share of estimate" label, impact-band badge, and colored bar; (4) actionable focus-area CTA wired to Recommendations; (5) progressive disclosure "How this estimate works" panel (collapsed by default, aria-expanded, keyboard accessible) with link to Estimates & Assumptions page. New onNavigateToAssumptions prop added and wired in AppShell. FootprintSummary.test.tsx rewritten with 12 tests covering all required scenarios. .prettierignore added to apps/web to exclude dist/. Safety grep: no unsafe claims. Gates: Build PASS, Typecheck PASS, Lint PASS, Format PASS, Tests 240/240 PASS (web 136, api 14, shared 90). |
| 2026-06-18 | Fix 7 of 10 — India-Relevant Choice Lab Scenario Polish                     | Pending | Status: Review Ready. Scenarios localized: updated transport, home cooling/AC, online delivery options. Display-label changes: refined choices to use "Solo car trip", "Metro or urban rail, where available", "AC at 24°C with ceiling fan", and consolidated delivery terminologies. Choice Coach consistency check: verified display labels passed as context. Mobile review: verified text-wrapping and cards display correctly on mobile sizes. Tests and verification results: updated DailyChoiceLab tests to check new display labels. Verification gates: build, typecheck, lint, test, format all PASS.                                                                                                                                                                                                                                                                                                                                                                                              |
| 2026-06-18 | Fix 8 of 10 — Weekly Tracker Humanization and Action-First Progress Polish  | Pending | Status: Review Ready. Date-label treatment: humanized ISO date into e.g. "Week of 15 Jun 2026". Next-action behavior: highlighted first incomplete action in a dedicated visual container with a "Mark complete" button, replaced with a complete state CTA when finished. Progress visual approach: made completion progress the primary anchor, showing count (e.g. 2 of 3 complete) and a progress bar with aria-live updates. All-complete Carbon World CTA: displays a dynamic CTA e.g. "View Thriving Grove" using the actual stage name. Local-data control treatment: reduced prominence of data controls, linking compactly to the Privacy & Local Data page. Mobile review: stacked layouts, full-width actions, badges wrapped cleanly. Tests and verification results: updated tests for human dates, next action toggling, all-complete stage label CTA, data controls, and claims safety; Gates build, typecheck, lint, test, format all PASS.                                                   |

---

# Final Notes

This tracker must remain truthful.

Do not mark any task complete unless:

- the implementation exists,
- relevant verification has run,
- failures are documented,
- and human review has accepted the result.

CarbonCoach should be built as a high-scoring product from the beginning, not repaired at the end.
