---
name: carboncoach-cloud-run-deployment
description: Use this skill when implementing Task 019 — Cloud Run Deployment for CarbonCoach. This task deploys the already-built CarbonCoach MVP to Google Cloud Run using the repository’s existing deployment docs and architecture. It must not add new product features, change calculator logic, change coach behavior, add auth/database/analytics, or start README/submission documentation work.
---

---

# Task 019 — Cloud Run Deployment

## Task Purpose

Deploy CarbonCoach to Google Cloud Run as a public demo-ready web application.

This task takes the completed local MVP and makes it available through a stable deployed URL for final challenge submission.

Deployment must preserve the product principles:

```text
Deterministic engines decide.
LLMs explain.
Gemini key remains server-side.
Local profile and tracker data stay in the browser.
Coach requests are user-triggered.
```

---

# 1. Required Reading Before Coding

Read first:

```text
AGENTS.md
implementationplan.md
buildprogresstracker.md

docs/architecture/architecture-overview.md
docs/architecture/cloud-run-architecture.md
docs/architecture/llm-safety-design.md
docs/architecture/numeric-invention-guard.md
docs/deployment/cloud-run-free-tier.md

SECURITY.md
METHODOLOGY.md

services/api/src/**
services/api/.env.example
apps/web/vite.config.ts
apps/web/package.json
services/api/package.json
package.json
Dockerfile*
.dockerignore
.gitignore
```

Also inspect any deployment-related files already present in the repository.

Follow the repository’s current deployment docs and `AGENTS.md` if there is any conflict.

---

# 2. Task Scope

## In Scope

Implement or verify:

```text
Cloud Run deployment readiness
Docker/container build path
Production build configuration
Backend serving API and web app correctly
Gemini server-side secret configuration
Public demo URL
Health endpoint verification
Coach endpoint verification
Final deployed smoke test
Deployment docs alignment
buildprogresstracker.md update
```

## Out of Scope

Do not implement:

```text
new product features
new UI redesign
new calculator logic
new recommendation logic
new coach prompt behavior unless deployment breaks existing behavior
authentication
database
analytics
user accounts
Cloud SQL
Firebase
object storage
CI/CD pipeline unless docs already require it
Task 020 README/submission docs
LinkedIn post
```

This task is deployment only.

---

# 3. Target Deployment Shape

Preferred deployment target:

```text
Google Cloud Run
Single public demo service
Containerized deployment
No backend database
No user login
Server-side Gemini API key
```

The final public service should serve:

```text
Frontend web app
API health endpoint
Coach endpoint
```

Use the architecture already documented in the repo.

If the repository currently separates frontend and API services, preserve the documented deployment architecture. If the repository already supports a single combined service, use that.

Do not redesign architecture unless deployment cannot work otherwise.

---

# 4. Environment Variables and Secrets

Required runtime variables:

```text
GEMINI_API_KEY
GEMINI_MODEL=gemini-2.5-flash-lite
NODE_ENV=production
```

Rules:

```text
GEMINI_API_KEY must be configured server-side only.
GEMINI_API_KEY must not be committed.
GEMINI_API_KEY must not appear in frontend bundle.
GEMINI_API_KEY must not be exposed as VITE_GEMINI_API_KEY.
GEMINI_MODEL should default to gemini-2.5-flash-lite if not explicitly set.
```

Preferred production secret handling:

```text
Use Google Cloud Secret Manager or Cloud Run secret/environment configuration.
Do not place secrets in Dockerfile.
Do not place secrets in source.
Do not place secrets in build args.
Do not print secrets in logs.
```

Safe diagnostics may show:

```text
providerConfigured: true
configuredModel: gemini-2.5-flash-lite
coachMode: gemini
```

Diagnostics must never show:

```text
full API key
partial API key
raw prompts
raw minimized context
raw Gemini response
```

---

# 5. Production Build Requirements

Before deployment, ensure local production build passes:

```bash
npm run build
npm run typecheck
npm run test
npm run lint
npm run format:check
```

Verify package workspaces build correctly.

If a Dockerfile exists, use it.

If no Dockerfile exists but deployment docs describe one, implement the minimal Dockerfile required by those docs.

Container requirements:

```text
Uses production dependencies only where practical.
Builds web app and API consistently.
Exposes the expected Cloud Run port.
Reads PORT from environment.
Does not require dev server in production.
Does not require Vite dev proxy in production.
Does not copy .env secrets into image.
Keeps final image reasonably small.
```

Cloud Run requires the service to listen on the runtime `PORT`.

---

# 6. API and Frontend Routing Requirements

Production deployment must support:

```text
GET /
GET /health
POST /api/coach
Frontend client-side navigation
Refresh on app pages if applicable
```

If the backend serves the frontend build, configure static serving and fallback routing safely.

If frontend and backend are deployed separately, ensure the frontend API base URL points to the deployed API correctly and does not rely on the local Vite proxy.

Do not leave production code dependent on:

```text
localhost
Vite dev server
dev proxy only
hardcoded local API URL
```

---

# 7. Gemini Coach Deployment Verification

After deployment, verify both user-triggered coach flows:

```text
Footprint Coach
Choice Coach
```

Expected successful behavior:

```text
Coach request happens only after user clicks a coach button.
Backend uses gemini-2.5-flash-lite.
Response returns source/mode as gemini when provider succeeds.
Numeric Guard passes before response is displayed.
No unsupported numeric claims are shown.
No raw profile/localStorage dump is sent.
No API key appears in browser network traffic.
```

Fallback behavior is acceptable only for genuine provider failure and must not be confused with successful Gemini output.

Do not deploy with persistent coach failure unless documented as a blocker.

---

# 8. Cloud Run Deployment Steps

Follow the repository’s deployment documentation. Use these as a guide, not as a replacement for repo docs.

Typical manual flow:

```bash
gcloud config set project <PROJECT_ID>
gcloud auth login
gcloud services enable run.googleapis.com artifactregistry.googleapis.com cloudbuild.googleapis.com secretmanager.googleapis.com
```

Build and deploy according to the repo’s chosen approach.

Possible approaches:

```text
gcloud run deploy --source .
or
docker build + Artifact Registry + gcloud run deploy --image
or
Cloud Build if already documented
```

Use the simplest path that matches the existing repo docs and works reliably.

Recommended Cloud Run settings:

```text
Region: choose one consistent region, preferably close to expected users if practical
Allow unauthenticated: yes, because this is a public demo
Min instances: 0, to stay cost-conscious
Concurrency: default unless repo docs specify otherwise
Memory/CPU: modest defaults unless build/runtime requires more
Timeout: sufficient for coach calls, but not excessive
```

Do not add paid infrastructure beyond what is required for Cloud Run and Gemini usage.

---

# 9. Security Checks Before Deployment

Run:

```bash
grep -R "VITE_GEMINI_API_KEY\|VITE_GOOGLE_API_KEY\|GoogleGenerativeAI\|GoogleGenAI" apps/web/src

grep -R "GEMINI_API_KEY=.*[A-Za-z0-9_-]" . --exclude-dir=node_modules --exclude-dir=.git --exclude="*.example"

git status
git diff --check
```

Expected:

```text
No frontend Gemini key.
No frontend Gemini SDK.
No real API key in repo.
No whitespace errors.
```

Also verify `.env` files are ignored.

---

# 10. Deployment Smoke Test

After deployment, run a manual smoke test against the public URL.

Required checks:

```text
1. Public URL opens.
2. Overview renders.
3. Profile setup works.
4. Footprint summary calculates.
5. Recommendations render.
6. Weekly Tracker stores progress locally.
7. Carbon World updates from tracker progress.
8. Privacy & Local Data renders.
9. Estimates & Assumptions renders.
10. Daily Choice Lab renders localized scenarios.
11. Footprint Coach returns Gemini response.
12. Choice Coach returns Gemini response.
13. Refresh does not break the app.
14. Browser DevTools shows no API key.
15. No obvious console errors.
```

Use a clean browser profile or Incognito window so external widgets/extensions do not appear in final screenshots.

---

# 11. Health Endpoint Smoke

Verify:

```text
GET <DEPLOYED_URL>/health
```

Expected safe response should confirm:

```text
service healthy
providerConfigured true/false
configuredModel gemini-2.5-flash-lite
```

If `providerConfigured` is false in deployment, fix Cloud Run secret/environment configuration before final approval.

Do not expose secret values.

---

# 12. Copy and Claim Safety

Deployment must not reintroduce unsafe claims.

Run:

```bash
grep -R "emissions saved\|kg avoided\|avoided emissions\|reduced emissions\|verified impact\|verified reduction\|certified footprint\|guaranteed savings\|carbon offset\|trees planted\|fully secure\|zero risk\|enterprise-grade" apps/web/src SECURITY.md METHODOLOGY.md
```

If terms appear only in negative “does not claim” sections or tests asserting absence, report clearly.

User-facing deployment should preserve safe wording:

```text
approximate estimate
weekly action progress
progress visual only
lower-impact choice
deterministic estimate
optional AI explanation
```

---

# 13. Documentation Updates

Update only deployment-relevant docs.

Allowed:

```text
docs/deployment/cloud-run-free-tier.md
docs/architecture/cloud-run-architecture.md, only if deployment reality differs from documented architecture
buildprogresstracker.md
```

Do not start Task 020 final README/submission docs yet.

Add:

```text
Deployed URL
Cloud Run service name
Region
Deployment method used
Runtime environment variables configured, without secret values
Smoke test result
Known deployment limitations
```

Do not include API keys or secret values.

---

# 14. Build Progress Tracker Update

Update `buildprogresstracker.md`:

```text
Task 019 — Cloud Run Deployment
Status: Review Ready
Owner/Agent: Antigravity
Deployment target: Google Cloud Run
Service URL: <deployed-url>
Region: <region>
Model: gemini-2.5-flash-lite
Verification:
- build
- typecheck
- test
- lint
- format
- public URL smoke
- health endpoint
- Footprint Coach Gemini smoke
- Choice Coach Gemini smoke
```

Do not mark Task 019 complete until human review accepts the deployed app.

---

# 15. Testing Requirements

Automated tests should still pass:

```bash
npm run build
npm run typecheck
npm run test
npm run lint
npm run format:check
```

If deployment-specific scripts are added, include minimal tests or documented manual verification.

Do not require a real Gemini API key for automated tests.

Mock Gemini in tests as currently implemented.

---

# 16. Acceptance Criteria

Task 019 is successful when:

```text
Production build passes.
Container/deployment path works.
Cloud Run public URL is live.
Health endpoint works.
Gemini key is configured server-side only.
Footprint Coach works with Gemini 2.5 Flash-Lite on deployed URL.
Choice Coach works with Gemini 2.5 Flash-Lite on deployed URL.
No API key appears in browser network traffic.
Profile, Footprint, Recommendations, Tracker, Carbon World, Privacy, and Assumptions smoke successfully.
No unsafe copy or unsupported claims appear.
Deployment docs are updated.
buildprogresstracker.md is updated.
```

---

# 17. Human Review Checklist

Reviewer should verify:

```text
Open deployed URL in clean browser.
Set up profile.
Calculate footprint.
Generate recommendations.
Use Footprint Coach.
Use Choice Coach.
Complete tracker actions.
View all Carbon World stages if practical.
Open Privacy & Local Data.
Open Estimates & Assumptions.
Check browser DevTools for no exposed key.
Check /health for safe provider status.
Confirm final URL is submission-ready.
```

---

# 18. Expected Agent Report Format

Report:

```text
Files changed

Deployment approach used

Cloud Run details
- service name
- region
- deployed URL
- public access setting
- runtime env vars configured, without secret values

Verification
- build
- typecheck
- test
- lint
- format
- Docker/build result
- Cloud Run deploy result
- health endpoint result
- deployed app smoke result
- Footprint Coach Gemini smoke
- Choice Coach Gemini smoke

Security checks
- no frontend key
- no secret in repo
- Gemini server-side only

Known limitations / follow-ups
```

---

# 19. Commit Recommendation

After human review:

```bash
git add .
git commit -m "chore(deploy): add Cloud Run deployment readiness"
git push origin main
```

If deployment-only configuration and documentation changes are small, this commit message is acceptable.

If substantial production-serving code is added, use:

```bash
git commit -m "feat(deploy): prepare CarbonCoach for Cloud Run"
```

---

# 20. Final Instruction

Implement Task 019 only.

Do not begin README finalization, challenge submission docs, LinkedIn post, or final packaging.

The goal is a live, secure, demo-ready Cloud Run URL for CarbonCoach with Gemini 2.5 Flash-Lite coach flows working end to end.
