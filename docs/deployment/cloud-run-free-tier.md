# CarbonCoach Cloud Run Free-Tier Deployment Guide

## Document Purpose

This guide explains how to deploy **CarbonCoach** to Google Cloud Run in a free-tier-conscious way.

CarbonCoach uses Cloud Run to host:

```text id="9uua1d"
GET  /            -> React/Vite web application
POST /api/coach   -> Gemini-backed Footprint Coach and Choice Coach
GET  /health      -> service health endpoint
```

The goal is to provide a publicly accessible challenge submission link while keeping runtime, build, storage, and LLM usage small and controlled.

This document must be read together with:

```text id="7r3apa"
AGENTS.md
implementationplan.md
buildprogresstracker.md
docs/architecture/cloud-run-architecture.md
docs/architecture/llm-safety-design.md
docs/architecture/numeric-invention-guard.md
docs/testing/demo-checklist.md
```

---

# 1. Deployment Decision

## Selected Deployment Platform

```text id="dy1isl"
Google Cloud Run
```

## Deployment Model

CarbonCoach will deploy as a single Cloud Run service that serves both:

1. the built React/Vite frontend,
2. the `/api/coach` backend endpoint.

## Why Cloud Run

Cloud Run is selected because it provides:

- a public HTTPS web app URL,
- server-side Gemini API key protection,
- a lightweight backend for coach orchestration,
- request-based execution,
- scale-to-zero behavior,
- and a credible AI-assisted architecture for manual review.

Cloud Run has a monthly free tier for request-based billing. Google’s pricing page currently describes free monthly allocations for CPU and memory usage, and Google’s Cloud Run pricing documentation should be treated as the source of truth because exact allowances and regional terms may change.

---

# 2. Free-Tier Strategy

CarbonCoach must stay free-tier friendly by design.

## 2.1 What makes the app lightweight

CarbonCoach P0 does not use:

```text id="xxgybf"
Database
Login
GPU
Local LLM
Background workers
Heavy chart libraries
Three.js
Always-on instances
Large media assets
```

CarbonCoach P0 uses:

```text id="jjkmay"
React/Vite static frontend
Small Node.js API
Gemini API call only on explicit user action
Local-first browser storage
Deterministic fallback
SVG/CSS Carbon World
Cloud Run min instances = 0
```

## 2.2 Free-tier assumptions

Cloud Run pricing and free-tier details can change. At the time of writing, Cloud Run documentation shows free monthly allocations for request-based billing and describes CPU/memory/request-based pricing. Always verify the current Cloud Run pricing page before final deployment.

Because this is a challenge/demo application, expected traffic should be very low:

- a few developer checks,
- a few manual reviewer visits,
- limited Gemini coach requests,
- no production user load.

This makes Cloud Run suitable if configured carefully.

---

# 3. Cost and Billing Risk Controls

## 3.1 Required Cloud Run settings

Use these settings unless there is a documented reason to change them:

```text id="ho6fhk"
min instances: 0
max instances: 1
memory: 512Mi
CPU: 1
request timeout: 15s
LLM timeout: 7s
allow unauthenticated: yes
```

## 3.2 Why `min instances = 0`

Cloud Run can scale down when idle. Keeping minimum instances at `0` prevents idle service cost and fits the challenge/demo usage pattern.

Cloud Run supports minimum instances for cases where cold starts need to be reduced, but CarbonCoach should not use always-on warm instances in P0 because cost control is more important than eliminating occasional cold start.

## 3.3 Why `max instances = 1`

For the challenge, a single instance is enough.

This reduces accidental cost exposure if a public URL receives unexpected traffic.

If manual review experiences concurrency issues, max instances can be increased to `2`, but this should be deliberate.

## 3.4 Why no local LLM

Do not deploy:

```text id="2508sn"
Ollama
Local model inference
GPU inference
Self-hosted LLM
```

The Cloud Run service should be a small web/API wrapper around Gemini, not an inference host.

## 3.5 Why no automatic LLM calls

LLM calls must be user-triggered.

Allowed:

```text id="6nfqyo"
User clicks "Explain my footprint"
User clicks "Coach me on this choice"
```

Not allowed:

```text id="9ldmbz"
Calling Gemini on page load
Calling Gemini after every form change
Calling Gemini after every tracker update
Calling Gemini automatically for every screen
```

---

# 4. Required Runtime Endpoints

## 4.1 `GET /`

Serves the React application.

Expected:

- returns the web app,
- supports hard refresh,
- serves client-side route fallback if used.

## 4.2 `GET /health`

Returns safe service health metadata.

Recommended response:

```json id="i4e2x2"
{
  "status": "ok",
  "service": "carboncoach",
  "runtime": "cloud-run"
}
```

Do not expose:

- Gemini key,
- environment variables,
- internal stack traces,
- project IDs,
- prompt templates,
- provider response data.

## 4.3 `POST /api/coach`

Handles both coach modes:

```text id="c5m7ih"
footprint_coach
choice_coach
```

Required behavior:

- validate request,
- call Gemini if configured,
- enforce timeout,
- validate response schema,
- run Numeric Invention Guard,
- return safe Gemini response or deterministic fallback.

---

# 5. Recommended Repository Deployment Shape

```text id="btenip"
CarbonCoach/
  apps/
    web/
      dist/                 # generated by build

  services/
    api/
      src/
      dist/                 # generated by build
      public/               # receives frontend build
      Dockerfile
      .dockerignore

  packages/
    shared/
```

Recommended production flow:

```text id="uq7dwi"
Build shared package
Build web app
Build API service
Copy web dist into API public folder
Build Docker image
Run API compiled JavaScript
```

Production runtime should run:

```text id="96luyq"
node dist/server.js
```

Do not run:

```text id="sw8wwz"
vite dev
tsx
nodemon
npm run dev
```

---

# 6. Environment Variables

## 6.1 Required / recommended variables

```text id="zxt7g8"
NODE_ENV=production
PORT=8080
GEMINI_API_KEY=<server-side only>
LLM_PROVIDER=gemini
LLM_TIMEOUT_MS=7000
LLM_DAILY_SOFT_LIMIT=80
```

## 6.2 Forbidden frontend secret variable

Do not use:

```text id="x16311"
VITE_GEMINI_API_KEY
```

Any variable prefixed with `VITE_` can be bundled into the frontend and is not safe for secrets.

## 6.3 `.env.example`

The repo may include `.env.example` with placeholders only:

```text id="fq5nlu"
NODE_ENV=development
PORT=8080
GEMINI_API_KEY=replace-with-server-side-key
LLM_PROVIDER=gemini
LLM_TIMEOUT_MS=7000
LLM_DAILY_SOFT_LIMIT=80
```

Never commit `.env` or real secrets.

---

# 7. Dockerfile Guidance

## 7.1 Dockerfile goals

The Dockerfile should:

- install dependencies,
- build workspaces,
- build React frontend,
- build TypeScript API,
- copy frontend build into API public folder,
- run compiled API code,
- expose port `8080`.

## 7.2 Recommended Docker behavior

Use a multi-stage build where practical.

Expected final container:

- small,
- production-only runtime dependencies,
- no source maps if not needed,
- no test files,
- no `.env`,
- no node_modules from development stage unless required.

## 7.3 `.dockerignore`

Recommended `.dockerignore`:

```text id="6l16q3"
.git
.github
node_modules
**/node_modules
dist
**/dist
coverage
**/coverage
.env
.env.*
*.log
.DS_Store
docs/submission/*.png
docs/submission/*.mp4
```

Adjust if any ignored path is actually needed by Docker build.

---

# 8. Cloud Run Deployment Commands

The exact deployment flow may vary depending on project setup. The following is the recommended starting point.

## 8.1 Set project

```bash id="o1kiwx"
gcloud config set project <PROJECT_ID>
```

## 8.2 Select region

Recommended for India-based development/review:

```text id="f7y9qx"
asia-south1
```

Alternative:

```text id="5q578d"
us-central1
```

Before final deployment, verify current free-tier/pricing regional details on official Google Cloud pricing documentation.

## 8.3 Deploy from source

```bash id="kxlv4d"
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

The `gcloud run deploy` command supports deploying from source; when using source deployment, Cloud Run builds from the local source or archive.

## 8.4 Set environment variables

Use Cloud Run environment variables or Secret Manager-backed variables.

Example:

```bash id="3laqbt"
gcloud run services update carboncoach \
  --region asia-south1 \
  --set-env-vars LLM_PROVIDER=gemini,LLM_TIMEOUT_MS=7000,LLM_DAILY_SOFT_LIMIT=80
```

For `GEMINI_API_KEY`, prefer a secure secret-backed value if possible.

Do not put the real key in a committed file.

---

# 9. Gemini API Free-Tier Safety

Gemini pricing/free-tier availability can change and may depend on model, region, and account status.

Free-tier safety rules:

```text id="vcs77e"
Use one lightweight Gemini model.
Keep prompts small.
Do not send large history.
Do not call Gemini automatically.
Use fallback when key/quota fails.
Cache repeat coach responses locally.
Set LLM timeout.
Set optional soft daily request limit.
```

The deployed app must remain usable even if Gemini is unavailable.

---

# 10. Local Deployment Test Before Cloud Run

Before deploying, run the full local verification.

```bash id="vbunwj"
npm install
npm run build
npm run typecheck
npm run test
npm run lint
npm run format:check
```

If Docker is available locally:

```bash id="z6lghr"
docker build -t carboncoach .
docker run --rm -p 8080:8080 \
  -e NODE_ENV=production \
  -e PORT=8080 \
  -e LLM_TIMEOUT_MS=7000 \
  carboncoach
```

Then check:

```text id="z5xx4e"
http://localhost:8080/
http://localhost:8080/health
```

Test `/api/coach` through the UI or with a safe sample payload.

---

# 11. Deployment Verification Checklist

Update `buildprogresstracker.md` after deployment.

## 11.1 Build checks

| Check                         | Result |
| ----------------------------- | ------ |
| `npm run build` passes        | Pass   |
| `npm run typecheck` passes    | Pass   |
| `npm run test` passes         | Pass   |
| `npm run lint` passes         | Pass   |
| `npm run format:check` passes | Pass   |

## 11.2 Local container checks

| Check                               | Result |
| ----------------------------------- | ------ |
| Docker build succeeds               | Skip   |
| Container starts locally            | Skip   |
| `/health` works locally             | Skip   |
| Frontend loads locally              | Skip   |
| `/api/coach` fallback works locally | Skip   |

## 11.3 Cloud Run checks

| Check                            | Result |
| -------------------------------- | ------ |
| Cloud Run service deployed       | Pass   |
| Public HTTPS URL generated       | Pass   |
| App loads from public URL        | Pass   |
| Hard refresh works               | Pass   |
| `/health` works                  | Pass   |
| Footprint Coach works            | Pass   |
| Choice Coach works               | Pass   |
| Fallback works                   | Pass   |
| No API key exposed in frontend   | Pass   |
| Min instances is 0               | Pass   |
| Max instances is 1 or documented | Pass   |

---

# 12. How to Verify No API Key Is Exposed

## 12.1 Code search

Search repository:

```bash id="t4hjxu"
grep -R "GEMINI_API_KEY" .
grep -R "VITE_GEMINI" .
```

Expected:

- `GEMINI_API_KEY` appears only in backend/server docs or `.env.example`.
- `VITE_GEMINI_API_KEY` should not appear except as a forbidden example in docs.

## 12.2 Browser check

Open deployed app.

Use browser dev tools.

Search loaded JS files for:

```text id="ceeqg6"
GEMINI
AIza
apiKey
```

No real key should be visible.

---

# 13. How to Verify Fallback Behavior

Fallback must work even if Gemini is unavailable.

Recommended test:

1. deploy or run service without `GEMINI_API_KEY`,
2. open app,
3. complete onboarding,
4. click Footprint Coach,
5. verify response appears with `source: fallback` behavior,
6. use Daily Choice Lab,
7. click Choice Coach,
8. verify fallback response appears.

The app must not fail with a blank panel or raw error.

---

# 14. How to Verify Gemini Behavior

With `GEMINI_API_KEY` configured:

1. open deployed app,
2. complete onboarding,
3. click Footprint Coach,
4. verify Gemini-generated coach response appears,
5. use Daily Choice Lab,
6. click Choice Coach,
7. verify Gemini-generated choice explanation appears,
8. check that no invented numbers appear,
9. verify fallback still works in test mode or by forcing provider error if supported.

---

# 15. How to Verify Numeric Guard in Deployment

If the implementation includes a test/mock provider mode, force a response with an unsupported number.

Example unsafe response:

```text id="i2i9bn"
You can save 40 kg CO2e this month.
```

If `40` is not in `allowedNumbers`, the service must return fallback.

If no test mode exists, rely on automated tests and document the test results in `buildprogresstracker.md`.

---

# 16. Cloud Run Free-Tier Risk Notes

Cloud Run cost depends on:

- request count,
- CPU allocation,
- memory allocation,
- request duration,
- min instances,
- network egress,
- build/artifact storage,
- and related services.

Cloud Run pricing documentation describes request-based billing and free-tier allocations, but these values can vary over time and should be verified before final submission.

Separate services such as Cloud Build and Artifact Registry may also have their own billing/free-tier constraints. Keep builds and images small.

---

# 17. Cost-Safe Operating Rules

Keep these locked:

```text id="k1ptjq"
No GPU.
No local LLM.
No always-on worker.
No min instances above 0.
No database for P0.
No automatic LLM calls.
No heavy assets.
No large Docker image.
No unnecessary redeploy loops.
```

If any of these are changed, update:

```text id="ez5c3m"
AGENTS.md
docs/architecture/cloud-run-architecture.md
docs/deployment/cloud-run-free-tier.md
buildprogresstracker.md
```

---

# 18. Troubleshooting

## 18.1 App loads but coach fails

Check:

- `GEMINI_API_KEY` configured?
- `/api/coach` route reachable?
- request payload valid?
- fallback path working?
- Cloud Run logs show timeout or provider issue?

Expected behavior:

- fallback should appear, not blank UI.

## 18.2 `/health` fails

Check:

- service started on correct `PORT`,
- Cloud Run passes `PORT`,
- server binds to `0.0.0.0`,
- Docker command runs compiled server.

## 18.3 Hard refresh fails

Check:

- static fallback to `index.html`,
- client-side routing configuration,
- API routes excluded from SPA fallback.

## 18.4 Deployment exceeds expected cost risk

Check:

- min instances is 0,
- max instances is low,
- no background process,
- no automatic LLM calls,
- image size,
- repeated build/deploy attempts,
- Artifact Registry old images.

---

# 19. README Deployment Section Requirements

The README must include:

- Cloud Run deployment target,
- required environment variables,
- run commands,
- deployment commands,
- fallback behavior,
- free-tier assumptions,
- limitations,
- and deployed URL placeholder.

The README must not claim that deployment is free under all conditions. Use wording like:

```text id="4y5as1"
The deployment is designed to be free-tier friendly for challenge/demo traffic, but actual billing depends on Google Cloud usage, region, and current pricing terms.
```

---

# 20. Final Submission Deployment Gate

Do not submit unless:

```text id="2qzblf"
Public Cloud Run URL works.
Frontend loads.
Hard refresh works.
Onboarding works.
Footprint Coach works.
Choice Coach works.
Fallback works.
Numeric Guard verified.
Privacy page visible.
Assumptions page visible.
README updated with deployment details.
LinkedIn draft includes deployed URL.
No secrets exposed.
```

---

# 21. Final Guidance

Cloud Run is a good deployment choice for CarbonCoach if it remains a small serverless web/API service.

The goal is not to maximize cloud complexity.

The goal is to provide a stable, reviewable, AI-assisted web application that:

- protects the Gemini key,
- uses LLM inference responsibly,
- stays free-tier friendly,
- scales to zero,
- and remains functional through deterministic fallback.

Build small. Deploy carefully. Verify before submission.
