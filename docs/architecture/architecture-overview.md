# CarbonCoach Architecture Overview

## Document Purpose

This document defines the solution architecture for **CarbonCoach**, an AI-assisted carbon awareness platform built for Prompt Wars Virtual — Challenge 3.

It explains:

- the product architecture,
- runtime components,
- deterministic calculation model,
- LLM coaching architecture,
- Cloud Run deployment model,
- data and privacy boundaries,
- security controls,
- efficiency choices,
- testing strategy,
- and accessibility architecture.

This document is a high-level source of truth. Detailed task instructions live in:

```text
docs/skills/<task-id>-<task-name>/SKILLS.md
```

---

# 1. Product Context

## Product Name

**CarbonCoach**

## Product Type

AI-assisted carbon awareness web application.

## Product Promise

> Understand your footprint. Make better everyday choices.

## Challenge Context

CarbonCoach is being built for **Prompt Wars Virtual — Challenge 3: Carbon Footprint Awareness Platform**.

The application must help individuals:

- understand their carbon footprint,
- track carbon-impacting habits,
- reduce footprint through simple actions,
- receive personalized insights,
- and build awareness around everyday decisions.

The product is intentionally designed to go beyond a static footprint calculator. It combines deterministic carbon logic, everyday decision coaching, LLM-assisted explanation, local tracking, and lightweight emotional feedback.

---

# 2. Architecture Goals

The architecture is designed around the challenge scoring dimensions.

## 2.1 Code Quality

- Clear separation between UI, shared domain logic, and backend LLM orchestration.
- No carbon calculation logic in React components.
- No Gemini logic in frontend code.
- Strong TypeScript contracts.
- Focused modules and small components.
- Quality gates from Task 001.

## 2.2 Security

- Gemini API key remains server-side only.
- No `VITE_GEMINI_API_KEY`.
- Local-first storage.
- No login or database in P0.
- Minimal structured context sent to LLM.
- Numeric invention guard protects against hallucinated numbers.
- Fallback coach handles LLM failure safely.

## 2.3 Efficiency

- App shell loads without waiting for LLM.
- LLM calls are user-triggered.
- Cloud Run uses request-based scaling with min instances set to 0.
- No GPU, local LLM, Ollama, or always-on workers.
- No heavy visual libraries for P0.
- Carbon World uses lightweight SVG/CSS.

## 2.4 Testing

- Deterministic engines are unit tested.
- LLM failure paths are tested.
- Numeric invention guard is tested.
- Fallback behavior is tested.
- UI and accessibility smoke tests are included.

## 2.5 Accessibility

- UI components are accessible by default.
- Carbon World has text equivalents.
- Impact bands are not color-only.
- Form fields are labelled.
- Coach loading/result states are announced where practical.
- Keyboard and mobile usability are explicitly checked.

## 2.6 Problem Alignment

- Daily Choice Lab creates awareness at decision points.
- Footprint Coach explains personal impact.
- Choice Coach explains lower-impact alternatives.
- Weekly Tracker turns awareness into action.
- Carbon World provides emotional progress feedback.

---

# 3. Core Architecture Rule

The most important architecture principle is:

```text
Deterministic engines decide.
LLMs explain.
```

## 3.1 Deterministic engines own

- carbon factors,
- footprint calculations,
- category breakdowns,
- impact bands,
- recommendation ranking,
- weekly action plan logic,
- tracker progress,
- avoided-impact estimates,
- Carbon World state,
- numeric safety validation.

## 3.2 LLM owns

- explanation wording,
- simplification,
- coaching tone,
- motivation,
- non-guilt nudges,
- personalized summaries,
- follow-up style guidance.

## 3.3 LLM must not own

- emission factors,
- footprint totals,
- carbon reduction numbers,
- impact band decisions,
- progress values,
- source-of-truth recommendations.

---

# 4. High-Level Runtime Architecture

CarbonCoach uses a lightweight monorepo architecture.

```text
CarbonCoach/
  apps/web        -> React/Vite frontend
  packages/shared -> deterministic domain logic
  services/api    -> Cloud Run backend and Gemini orchestration
  docs            -> architecture, deployment, testing, submission docs
```

## 4.1 Runtime flow

```text
User
  ↓
React Web App
  ↓
Shared deterministic engines
  ↓
Footprint Summary / Choice Lab / Tracker / Carbon World
  ↓
User-triggered coach request
  ↓
Cloud Run /api/coach
  ↓
Gemini provider
  ↓
Schema validation + Numeric Invention Guard
  ↓
Coach response or deterministic fallback
  ↓
React Web App
```

---

# 5. Logical Components

## 5.1 React Web App — `apps/web`

The frontend owns user experience only.

Responsibilities:

- onboarding flow,
- footprint summary UI,
- Daily Choice Lab UI,
- coach response panels,
- weekly tracker,
- Carbon World visual,
- privacy and assumptions screens,
- local persistence adapter,
- accessible UI primitives,
- API client for `/api/coach`.

The frontend must not:

- call Gemini directly,
- store or expose API keys,
- calculate emissions inside components,
- construct LLM prompts,
- own server-side validation,
- contain hidden business logic that belongs in `packages/shared`.

---

## 5.2 Shared Domain Package — `packages/shared`

The shared package is the deterministic brain of CarbonCoach.

Expected modules:

```text
packages/shared/src/carbon/
packages/shared/src/choices/
packages/shared/src/recommendations/
packages/shared/src/world/
packages/shared/src/assistant/
packages/shared/src/privacy/
packages/shared/src/validation/
packages/shared/src/types/
```

Responsibilities:

- carbon domain types,
- emission factor registry,
- carbon calculator,
- footprint summary derivation,
- recommendation engine,
- weekly plan generation,
- Daily Choice Lab scenario logic,
- choice impact engine,
- Carbon World state engine,
- deterministic fallback coach composer,
- numeric invention guard,
- redaction and context minimization utilities,
- shared validation types.

This package must remain UI-agnostic and backend-agnostic.

---

## 5.3 Cloud Run API — `services/api`

The backend hosts the deployed API and production web server.

Responsibilities:

- serve frontend static build,
- expose `/health`,
- expose `/api/coach`,
- validate coach requests,
- minimize and sanitize request context,
- build safe Gemini prompts,
- call Gemini server-side,
- enforce timeout,
- parse and validate Gemini output,
- run Numeric Invention Guard,
- return fallback response on failure.

The backend must not:

- expose secrets,
- log raw user profiles,
- log raw full prompts,
- run local LLMs,
- use GPU inference,
- store P0 user data,
- perform duplicate business logic that belongs in `packages/shared`.

---

# 6. Primary Product Flows

## 6.1 Onboarding Flow

```text
User enters lifestyle profile
  ↓
Profile validation
  ↓
Local persistence
  ↓
Footprint calculation enabled
```

Inputs:

- commute mode,
- weekly commute distance,
- diet pattern,
- home energy estimate,
- shopping/delivery frequency,
- flights per year,
- household size,
- user preference.

Privacy rule:

Only lightweight structured fields are collected. No exact address, income, employer, or sensitive identity data is required.

---

## 6.2 Footprint Summary Flow

```text
Saved profile
  ↓
Carbon calculator
  ↓
Category estimates
  ↓
Top contributor
  ↓
Recommendation engine
  ↓
Footprint summary UI
```

The footprint summary must show:

- estimated monthly total,
- category breakdown,
- top contributor,
- assumptions,
- confidence,
- approximate-estimate note.

---

## 6.3 Footprint Coach Flow

```text
User clicks "Explain my footprint"
  ↓
Frontend prepares coach request
  ↓
Request sent to /api/coach
  ↓
Cloud Run validates payload
  ↓
Gemini receives structured context
  ↓
Response validated
  ↓
Numeric guard checks unsupported numbers
  ↓
Gemini response returned or fallback used
```

The LLM may explain numbers but must not create new ones.

---

## 6.4 Daily Choice Lab Flow

```text
User opens Daily Choice Lab
  ↓
Scenario selected
  ↓
Choice impact engine evaluates options
  ↓
Recommended option shown
  ↓
User asks Choice Coach for explanation
```

Example scenarios:

- cab vs metro,
- chicken meal delivery vs nearby vegetarian meal,
- separate delivery vs combined delivery,
- short flight vs train,
- buy new vs repair/reuse.

---

## 6.5 Choice Coach Flow

```text
Choice scenario + deterministic option evaluation
  ↓
User-triggered coach request
  ↓
Cloud Run /api/coach
  ↓
Gemini explains the decision
  ↓
Schema validation + numeric guard
  ↓
Coach explanation or fallback
```

The Choice Coach must use friendly, non-guilt language.

---

## 6.6 Weekly Tracker Flow

```text
Recommended actions
  ↓
User selects weekly actions
  ↓
User marks actions complete
  ↓
Local tracker state updates
  ↓
Progress summary updates
  ↓
Carbon World state updates
```

All tracker values are deterministic and local-first.

---

## 6.7 Carbon World Flow

```text
Weekly tracker state
  ↓
World state engine
  ↓
Visual world state
  ↓
Accessible text equivalent
```

Carbon World may show:

- clearer sky,
- more trees,
- lower haze,
- improved landscape.

It must not rely on color alone.

---

# 7. LLM Safety Architecture

## 7.1 Coach endpoint

Single endpoint:

```text
POST /api/coach
```

Supported modes:

```text
footprint_coach
choice_coach
```

## 7.2 Prompt construction

Prompt must include:

```text
Do not invent numbers.
Use only numbers provided in the structured context.
If a number is not present, use qualitative language or impact bands.
Say estimates are approximate.
Use friendly, non-judgmental language.
Do not shame the user.
Do not claim scientific precision.
```

## 7.3 Response schema

Recommended shared schema:

```ts
type CoachMode = 'footprint_coach' | 'choice_coach';

interface CoachResponse {
  mode: CoachMode;
  summary: string;
  explanation: string;
  recommendedNextStep: string;
  weeklyPlan: string[];
  numbersUsed: string[];
  confidenceNote: string;
  disclaimer: string;
  source: 'gemini' | 'fallback';
}
```

## 7.4 Numeric Invention Guard

After receiving LLM output:

1. extract allowed numbers from request context,
2. extract numbers from LLM output,
3. compare output numbers against allowed numbers,
4. reject unsupported numbers,
5. return deterministic fallback if invalid.

## 7.5 Fallback activation

Fallback is activated when:

- API key missing,
- Gemini timeout,
- Gemini quota failure,
- malformed output,
- schema validation failure,
- unsupported number detected,
- provider exception,
- invalid safety/tone issue detected where practical.

---

# 8. Data and Storage Architecture

## 8.1 P0 storage model

CarbonCoach is local-first.

Stored locally:

- user profile,
- selected weekly actions,
- tracker completion,
- local coach response cache if implemented.

Not stored in P0:

- account identity,
- cloud profile,
- raw chat history,
- database records.

## 8.2 Privacy design

The app should provide:

- visible privacy explanation,
- clear-data control,
- assumptions page,
- explanation of what is sent to Gemini,
- explanation of what stays local.

## 8.3 LLM payload minimization

Coach requests should send only:

- calculated footprint summary,
- selected preference,
- recommended actions,
- selected choice scenario,
- choice options and impact bands,
- allowed numbers list,
- tone mode if implemented.

Do not send raw unnecessary profile history.

---

# 9. Deployment Architecture

## 9.1 Target platform

Google Cloud Run.

## 9.2 Deployment shape

Cloud Run hosts one service that serves:

```text
GET /
POST /api/coach
GET /health
```

The API service should serve the built frontend static files and expose the backend endpoint.

## 9.3 Recommended Cloud Run settings

```text
min instances: 0
max instances: 1 or 2
memory: 512 MiB
CPU: 1
request timeout: 10-15 seconds
LLM timeout: 6-8 seconds
```

## 9.4 Free-tier safeguards

Do not use:

- GPU,
- local LLM inference,
- always-on workers,
- background loops,
- high-memory container,
- automatic LLM calls on page load.

Use:

- user-triggered coach calls,
- local response cache,
- short prompt payloads,
- deterministic fallback,
- small production container.

---

# 10. Security Architecture

## 10.1 Secrets

Gemini key must be server-side only.

Allowed:

```text
GEMINI_API_KEY=
LLM_PROVIDER=gemini
LLM_TIMEOUT_MS=7000
LLM_DAILY_SOFT_LIMIT=80
```

Not allowed:

```text
VITE_GEMINI_API_KEY
```

## 10.2 API validation

Validate all incoming `/api/coach` requests.

Reject:

- unsupported modes,
- malformed context,
- oversized payloads,
- missing required fields,
- invalid numeric fields.

## 10.3 Logging safety

Allowed logs:

- request mode,
- success/failure,
- fallback reason category,
- validation failure category,
- duration.

Forbidden logs:

- raw profile,
- full prompt,
- API key,
- full LLM response containing user context,
- raw free-text.

---

# 11. Efficiency Architecture

Efficiency choices:

- React app renders without LLM dependency.
- Deterministic calculations happen client-side through shared package.
- LLM only runs when user explicitly asks for coaching.
- Carbon World uses SVG/CSS.
- No Three.js in P0.
- No large chart library for P0.
- Cloud Run scales to zero.
- API has short timeout and fallback.
- Production server runs compiled JavaScript.

---

# 12. Testing Architecture

## 12.1 Shared package tests

Required coverage:

- carbon factor registry,
- carbon calculator,
- recommendation ranking,
- choice impact engine,
- Carbon World state engine,
- fallback coach,
- numeric invention guard,
- privacy redaction.

## 12.2 API tests

Required coverage:

- valid Footprint Coach request,
- valid Choice Coach request,
- missing key fallback,
- timeout fallback,
- malformed Gemini response fallback,
- unsupported number fallback,
- invalid request rejection.

## 12.3 Web tests

Required coverage:

- onboarding render and validation,
- footprint summary rendering,
- Daily Choice Lab rendering,
- coach panel fallback state,
- weekly tracker persistence,
- clear-data behavior,
- accessibility smoke checks.

---

# 13. Accessibility Architecture

Accessibility is built through:

- reusable UI primitives,
- labelled form controls,
- visible focus states,
- keyboard-reachable actions,
- non-color-only statuses,
- text equivalent for Carbon World,
- accessible coach loading/result messages,
- responsive mobile-first layout.

Carbon World must always include a text equivalent.

Daily Choice Lab impact bands must include text labels.

---

# 14. Observability and Manual Review Readiness

P0 observability is lightweight.

The deployed app should make it easy for reviewers to verify:

- app loads,
- onboarding works,
- footprint estimate works,
- Footprint Coach works,
- fallback works,
- Choice Lab works,
- Choice Coach works,
- Carbon World updates,
- tracker persists,
- assumptions are visible,
- privacy is visible.

Backend should expose:

```text
GET /health
```

---

# 15. Architecture Constraints

The following constraints are locked for P0:

- No database.
- No login.
- No real leaderboard.
- No local LLM hosting.
- No GPU.
- No Three.js.
- No direct Gemini calls from frontend.
- No exact scientific carbon claims.
- No automatic LLM calls on page load.
- No hidden API keys in frontend bundle.

---

# 16. Future Expansion Options

Potential post-P0 features:

- social/group challenges,
- optional account sync,
- richer carbon factor source integration,
- food delivery integration prototype,
- real organization/team leaderboard,
- multilingual coach,
- voice interface,
- richer visual world,
- analytics,
- reminder notifications.

These are not part of P0 and must not distract from challenge-scoped delivery.

---

# 17. Final Architecture Statement

CarbonCoach is architected as:

```text
React/Vite web app
+ deterministic TypeScript domain engines
+ Cloud Run Gemini coaching API
+ numeric invention guard
+ deterministic fallback
+ local-first tracker
+ lightweight Carbon World
```

This architecture is intentionally small, safe, efficient, testable, accessible, and aligned with the challenge emphasis on carbon footprint awareness through personalized insights and simple actions.
