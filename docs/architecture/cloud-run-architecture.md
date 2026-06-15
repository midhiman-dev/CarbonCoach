# CarbonCoach Cloud Run Architecture

## Document Purpose

This document defines the Google Cloud Run deployment architecture for **CarbonCoach**.

It explains:

- why Cloud Run is used,
- what runs on Cloud Run,
- how the React frontend and API are served,
- how Gemini is called safely,
- how the app stays free-tier friendly,
- required endpoints,
- environment variables,
- security rules,
- efficiency rules,
- testing expectations,
- and deployment verification steps.

This document must be read together with:

- `AGENTS.md`
- `implementationplan.md`
- `docs/architecture/architecture-overview.md`
- `docs/architecture/llm-safety-design.md`
- `docs/architecture/numeric-invention-guard.md`
- `docs/deployment/cloud-run-free-tier.md`
- `docs/testing/demo-checklist.md`

---

# 1. Cloud Run Role in CarbonCoach

CarbonCoach uses **Google Cloud Run** as the primary deployment target for the challenge submission.

Cloud Run hosts one deployable web/API service that provides:

```text
GET  /            -> React/Vite frontend
POST /api/coach   -> Footprint Coach and Choice Coach API
GET  /health      -> deployment health check
```

The Cloud Run service is intentionally lightweight.

It does **not** host a local LLM.

It does **not** use GPU.

It does **not** require a database for P0.

It does **not** run always-on background workers.

---

# 2. Why Cloud Run Is Used

Cloud Run is selected because CarbonCoach needs:

1. a public deployed web app link for challenge submission,
2. a safe backend boundary for Gemini API calls,
3. server-side API key protection,
4. request-based scaling,
5. simple container-based deployment,
6. a credible AI-assisted architecture,
7. and free-tier-friendly operation for low challenge/demo traffic.

Cloud Run also strengthens manual review credibility because reviewers can access a single deployed URL that serves both the frontend and the backend coach endpoint.

---

# 3. High-Level Deployment Shape

```text
Browser
  ↓
Cloud Run Service
  ├── Static React/Vite frontend
  ├── GET /health
  └── POST /api/coach
          ↓
      Gemini API
          ↓
      Schema Validation
          ↓
      Numeric Invention Guard
          ↓
      Gemini Coach Response or Fallback Coach Response
```

---

# 4. Runtime Components

## 4.1 React/Vite Frontend

The frontend is built from:

```text
apps/web
```

At deployment time, the built frontend assets are served by the Cloud Run API service.

The frontend owns:

- onboarding UI,
- footprint summary UI,
- Daily Choice Lab UI,
- coach panels,
- Carbon World UI,
- weekly tracker UI,
- privacy and assumptions pages,
- local persistence,
- and calling `/api/coach`.

The frontend must never call Gemini directly.

The frontend must never contain the Gemini API key.

---

## 4.2 Cloud Run API Service

The backend is built from:

```text
services/api
```

The API service owns:

- serving the React static build,
- `/health`,
- `/api/coach`,
- coach request validation,
- safe prompt construction,
- Gemini provider integration,
- timeout handling,
- response schema validation,
- Numeric Invention Guard,
- fallback response generation,
- and safe logging.

The API service must stay small and focused.

---

## 4.3 Shared Package

Shared deterministic logic comes from:

```text
packages/shared
```

Cloud Run API may import shared contracts and utilities such as:

- coach request types,
- coach response types,
- fallback coach composer,
- numeric invention guard,
- validation helpers,
- privacy/context minimization helpers.

The Cloud Run API must not duplicate carbon calculation rules that belong in `packages/shared`.

---

# 5. Request Flow: Footprint Coach

```text
User clicks "Explain my footprint"
  ↓
Web app prepares structured footprint coach payload
  ↓
POST /api/coach
  ↓
Cloud Run validates request
  ↓
Prompt builder creates bounded Gemini prompt
  ↓
Gemini API called server-side
  ↓
Response parsed into CoachResponse schema
  ↓
Numeric Invention Guard checks numbers
  ↓
Valid Gemini response returned
  OR
  deterministic fallback returned
```

The Footprint Coach explains calculated footprint results. It does not calculate them.

---

# 6. Request Flow: Choice Coach

```text
User opens Daily Choice Lab
  ↓
Choice engine evaluates options deterministically
  ↓
User clicks "Coach me on this choice"
  ↓
Web app sends structured choice coach payload
  ↓
POST /api/coach
  ↓
Cloud Run validates request
  ↓
Prompt builder creates bounded Gemini prompt
  ↓
Gemini API called server-side
  ↓
Response parsed and validated
  ↓
Numeric Invention Guard checks for unsupported numbers
  ↓
Valid Gemini response returned
  OR
  deterministic fallback returned
```

The Choice Coach explains everyday decision options. It does not invent new impact numbers.

---

# 7. Required Endpoints

## 7.1 `GET /`

Serves the built React application.

Expected behavior:

- returns frontend app shell,
- supports hard refresh,
- supports client-side routing fallback if routing is used.

## 7.2 `GET /health`

Returns a lightweight health response.

Example response:

```json
{
  "status": "ok",
  "service": "carboncoach-api",
  "version": "1.0.0"
}
```

This endpoint must not expose secrets, environment details, or provider keys.

## 7.3 `POST /api/coach`

Handles both LLM coaching workflows.

Supported modes:

```text
footprint_coach
choice_coach
```

Expected behavior:

- validates request,
- calls Gemini when configured and available,
- applies timeout,
- validates schema,
- runs Numeric Invention Guard,
- returns Gemini response if safe,
- returns fallback response if unsafe or unavailable.

---

# 8. API Contract Overview

## 8.1 Coach Request

The exact shared contract should live in:

```text
packages/shared/src/assistant/coachTypes.ts
```

Recommended high-level shape:

```ts
type CoachMode = 'footprint_coach' | 'choice_coach';

interface CoachRequest {
  mode: CoachMode;
  context: FootprintCoachContext | ChoiceCoachContext;
  userPreference?: 'balanced' | 'save_money' | 'low_effort' | 'highest_impact';
  tone?: 'simple' | 'detailed' | 'encouraging';
  allowedNumbers: string[];
}
```

## 8.2 Coach Response

Recommended high-level shape:

```ts
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

## 8.3 Error Response

For invalid requests:

```ts
interface ApiErrorResponse {
  error: {
    code: string;
    message: string;
  };
}
```

Error messages must be safe and user-friendly. Do not expose stack traces or secret-related configuration details.

---

# 9. Gemini Integration Boundary

Gemini is called only inside:

```text
services/api
```

Recommended module structure:

```text
services/api/src/
  coach/
    coachRoutes.ts
    coachController.ts
    promptBuilder.ts
    responseParser.ts

  llm/
    llmProvider.ts
    geminiProvider.ts
    timeout.ts

  middleware/
    validateRequest.ts
    safeLogging.ts

  server.ts
```

## 9.1 Provider Interface

Use an interface so fallback and future provider changes remain clean.

```ts
interface LlmProvider {
  generateCoachResponse(prompt: string, options: LlmOptions): Promise<string>;
}
```

## 9.2 Gemini Provider

The Gemini provider must:

- read API key from server environment,
- not expose key to frontend,
- use a short timeout,
- return raw provider response only to parser/validator,
- never bypass fallback handling.

## 9.3 Missing Key Behavior

If `GEMINI_API_KEY` is not configured:

- do not crash the app,
- do not return 500 for normal coach requests,
- use deterministic fallback,
- mark response source as `fallback`.

---

# 10. Prompt Construction Rules

All prompts must be constructed server-side.

Prompts must include the following constraints:

```text
Do not invent numbers.
Use only numbers provided in the structured context.
If a number is not present, use qualitative language or impact bands.
Say estimates are approximate.
Use friendly, non-judgmental language.
Do not shame the user.
Do not claim scientific precision.
Return output in the required JSON shape only.
```

The prompt must provide only minimized structured context.

Do not include:

- raw full profile history,
- unnecessary free text,
- exact address,
- income,
- employer,
- sensitive identity data,
- raw local storage dump,
- full tracker history unless summarized.

---

# 11. Numeric Invention Guard

Every Gemini response must pass the Numeric Invention Guard before being returned.

The guard should:

1. read allowed numbers from the request context,
2. extract numeric tokens from Gemini output,
3. compare generated numbers against allowed numbers,
4. reject unsupported numbers,
5. return fallback if validation fails.

Example:

```text
Allowed numbers:
216, 82, 64, 48, 12, 2

Generated response:
"Try this and you can save 40 kg this month."

Result:
Reject response unless 40 was supplied in context.
```

The guard lives in:

```text
packages/shared/src/assistant/numericGuard.ts
```

or an equivalent shared module.

---

# 12. Fallback Architecture

Fallback is mandatory.

Fallback should be used when:

- Gemini API key is missing,
- Gemini times out,
- Gemini quota fails,
- Gemini returns malformed output,
- response schema validation fails,
- numeric invention guard fails,
- request context is valid but provider is unavailable.

Fallback should be generated using:

```text
packages/shared/src/assistant/fallbackCoach.ts
```

Fallback responses must be:

- useful,
- friendly,
- non-guilt-based,
- based only on deterministic context,
- marked as `source: "fallback"`.

The UI may show:

```text
The AI coach is temporarily unavailable, so CarbonCoach is showing a rule-based explanation from your calculated results.
```

---

# 13. Environment Variables

Use server-side environment variables.

Recommended:

```text
GEMINI_API_KEY=
LLM_PROVIDER=gemini
LLM_TIMEOUT_MS=7000
LLM_DAILY_SOFT_LIMIT=80
NODE_ENV=production
PORT=8080
```

Do not use:

```text
VITE_GEMINI_API_KEY
```

Any `VITE_` variable may be included in the frontend bundle and is not safe for secrets.

`.env.example` must include placeholder names only, never real secrets.

---

# 14. Cloud Run Configuration

Recommended Cloud Run settings for the challenge build:

```text
min instances: 0
max instances: 1 or 2
memory: 512 MiB
CPU: 1
request timeout: 10–15 seconds
LLM timeout: 6–8 seconds
concurrency: default or modest setting
ingress: public HTTPS
authentication: allow unauthenticated for public challenge demo
```

## 14.1 Why min instances must be 0

CarbonCoach is a challenge/demo application. It should not keep idle instances running.

`min instances = 0` supports free-tier-friendly usage.

## 14.2 Why max instances should be low

Manual review and challenge traffic should be small.

Low max instances reduce accidental cost exposure.

## 14.3 Why memory should stay modest

The service does not run a local model or heavy compute.

A small Node service should be enough.

---

# 15. Docker Architecture

## 15.1 Dockerfile expectations

The Dockerfile should:

- install dependencies,
- build workspaces,
- build React frontend,
- build API TypeScript,
- copy frontend build into API public/static folder,
- run compiled JavaScript,
- expose port 8080.

The production command should not use:

```text
tsx
vite dev
nodemon
npm run dev
```

Use compiled output such as:

```text
node dist/server.js
```

## 15.2 `.dockerignore`

Must exclude:

```text
node_modules
.git
dist
coverage
.env
.env.*
*.log
```

Do not exclude required source files needed for Docker build.

## 15.3 Image size rule

Keep the container small.

Do not install unnecessary OS packages.

Do not include large assets, screenshots, videos, or design exports.

---

# 16. Static Frontend Serving

The Cloud Run API service should serve the built frontend.

Recommended flow:

```text
apps/web build output
  ↓
services/api/public
  ↓
Express/Fastify static middleware
  ↓
GET /
```

If client-side routing is used, unknown non-API routes should return `index.html`.

API routes must remain distinct:

```text
/api/*
/health
```

---

# 17. Security Rules

## 17.1 Secrets

- No secrets in repo.
- No secrets in frontend bundle.
- No API key in logs.
- No API key in health output.
- No `.env` committed.

## 17.2 Request validation

`POST /api/coach` must validate:

- mode,
- context shape,
- allowed numbers,
- payload size,
- required fields.

Invalid input should return a safe 400 response.

## 17.3 Safe logging

Allowed logs:

```text
coach mode
request duration
fallback reason category
validation failure category
provider unavailable
```

Forbidden logs:

```text
full user profile
full prompt
API key
raw private text
full Gemini response if it contains user context
```

## 17.4 Public access

The deployed app should allow unauthenticated access for challenge review.

Do not implement auth in P0.

---

# 18. Efficiency Rules

## 18.1 LLM calls must be user-triggered

Good:

```text
User clicks "Explain my footprint"
User clicks "Coach me on this choice"
```

Bad:

```text
Call LLM on page load
Call LLM after every form field change
Call LLM on every render
Call LLM when tracker checkbox changes
```

## 18.2 Use timeout and fallback

Do not let users wait indefinitely.

Recommended LLM timeout:

```text
7000 ms
```

## 18.3 Keep payload small

Send only the structured context needed for coaching.

## 18.4 Cache when practical

The frontend may cache coach responses by:

```text
mode + profileHash + topCategory + selectedChoiceId + preference
```

Caching is useful but must not become complex.

---

# 19. Testing Requirements

## 19.1 API tests

Cloud Run/API tests must cover:

- `/health` returns OK,
- valid footprint coach request,
- valid choice coach request,
- missing Gemini key fallback,
- timeout fallback,
- malformed Gemini output fallback,
- unsupported number fallback,
- invalid request returns 400,
- safe error response.

## 19.2 Deployment tests

Before submission, verify:

- Docker build succeeds,
- local container starts,
- `/health` works,
- frontend loads,
- `/api/coach` works,
- fallback works without Gemini key,
- Gemini works when key is configured,
- no key appears in frontend source.

## 19.3 Manual review tests

Manual reviewer should be able to:

- open deployed app,
- complete onboarding,
- view footprint summary,
- ask Footprint Coach,
- use Daily Choice Lab,
- ask Choice Coach,
- see fallback if Gemini unavailable,
- view privacy and assumptions,
- see tracker and Carbon World.

---

# 20. Deployment Verification Checklist

Before marking deployment complete, update `buildprogresstracker.md`.

Required checks:

```text
Docker build succeeds
Local container runs
GET /health works
Frontend served from container
POST /api/coach works
Missing Gemini key fallback works
Gemini key is not exposed in frontend
Cloud Run service deployed
Cloud Run min instances documented as 0
Public URL recorded
Hard refresh works
README updated with deployment instructions
```

---

# 21. Recommended Deployment Commands

Actual commands may vary by local setup and Google Cloud project configuration.

Example build and deploy flow:

```bash
gcloud config set project <PROJECT_ID>

gcloud run deploy carboncoach \
  --source . \
  --region asia-south1 \
  --allow-unauthenticated \
  --min-instances 0 \
  --max-instances 1 \
  --memory 512Mi \
  --cpu 1 \
  --timeout 15
```

Set Gemini key as a Cloud Run environment variable or secret-backed variable.

Do not commit the key.

---

# 22. Failure Modes and Safe Behavior

## 22.1 Gemini missing

Behavior:

- return fallback response,
- do not crash,
- source = fallback.

## 22.2 Gemini timeout

Behavior:

- return fallback response,
- optionally log timeout category,
- do not expose provider stack trace.

## 22.3 Gemini returns unsupported number

Behavior:

- reject Gemini response,
- return fallback response,
- log numeric guard rejection category.

## 22.4 Invalid user request

Behavior:

- return 400,
- safe error message,
- no stack trace.

## 22.5 Frontend route refresh

Behavior:

- serve `index.html` for client routes,
- do not break on hard refresh.

---

# 23. Manual Review Notes

Manual reviewers should see a stable web app.

The deployment should not require:

- login,
- payment,
- installing anything,
- enabling browser flags,
- using private APIs,
- API key entry by reviewer.

The app must demonstrate AI-assisted behavior, but also remain functional when Gemini is unavailable.

This is why fallback behavior is part of architecture, not an error workaround.

---

# 24. Final Cloud Run Architecture Statement

CarbonCoach uses Cloud Run as a lightweight serverless web/API host.

The deployed service serves the React app and exposes a bounded Gemini coaching endpoint.

The system keeps all carbon calculations deterministic, protects secrets server-side, validates LLM output, rejects invented numbers, falls back safely, scales to zero, and stays within free-tier-friendly constraints for challenge review traffic.
