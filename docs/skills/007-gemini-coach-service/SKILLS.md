---
name: carboncoach-gemini-coach-service
description: Use this skill when implementing Task 007 — Gemini Coach Service with Timeout, Schema Validation, Numeric Guard, and Fallback for CarbonCoach. This task implements the backend /api/coach endpoint using shared coach contracts, deterministic fallback, schema validation, timeout handling, Gemini provider integration, safe logging, and Numeric Invention Guard enforcement. It must not implement UI, Daily Choice Lab engine, tracker, Carbon World, Cloud Run Dockerfile, or deployment.
---

---

# Task 007 — Gemini Coach Service with Timeout, Schema Validation, Numeric Guard, and Fallback

## Task Purpose

Implement the backend AI coach service for **CarbonCoach**.

This task adds the first real LLM integration while preserving the project rule:

```text
Deterministic engines decide.
LLMs explain.
```

The service must call Gemini only from the backend, validate every response, reject unsupported numbers, and return deterministic fallback when Gemini is missing, unavailable, malformed, unsafe, or slow.

---

# 1. Required Reading Before Coding

Read:

```text
AGENTS.md
implementationplan.md
buildprogresstracker.md
docs/architecture/architecture-overview.md
docs/architecture/cloud-run-architecture.md
docs/architecture/llm-safety-design.md
docs/architecture/numeric-invention-guard.md
docs/deployment/cloud-run-free-tier.md
docs/skills/007-gemini-coach-service/SKILLS.md
packages/shared/src/assistant/coachTypes.ts
packages/shared/src/assistant/coachValidation.ts
packages/shared/src/assistant/fallbackCoach.ts
packages/shared/src/assistant/numericGuard.ts
packages/shared/src/privacy/minimizeCoachContext.ts
```

Follow `AGENTS.md` if there is any conflict.

---

# 2. Task Scope

## In Scope

Implement the backend coach service under `services/api`.

Expected files may include:

```text
services/api/src/coach/coachRoutes.ts
services/api/src/coach/coachController.ts
services/api/src/coach/promptBuilder.ts
services/api/src/coach/responseParser.ts
services/api/src/llm/llmProvider.ts
services/api/src/llm/geminiProvider.ts
services/api/src/llm/timeout.ts
services/api/src/middleware/validateCoachRequest.ts
services/api/src/middleware/safeLogging.ts
services/api/src/server.ts
services/api/test/coachRoutes.test.ts
services/api/test/geminiFallback.test.ts
services/api/test/promptBuilder.test.ts
.env.example
buildprogresstracker.md
```

Implement:

- `POST /api/coach`
- shared coach request validation
- safe prompt construction
- Gemini provider boundary
- timeout handling
- response parsing
- coach response validation
- Numeric Invention Guard enforcement
- deterministic fallback on all recoverable failures
- tests for success and failure paths
- safe logging helpers
- environment variable support

## Out of Scope

Do not implement:

- frontend coach UI
- UI API client
- Daily Choice Lab engine
- tracker
- Carbon World
- Cloud Run Dockerfile
- deployment scripts
- database
- authentication
- localStorage adapter

---

# 3. Required Runtime Endpoint

Add:

```text
POST /api/coach
```

Supported modes:

```text
footprint_coach
choice_coach
```

Expected behavior:

```text
Validate request
Build bounded prompt
Call Gemini only if configured
Enforce timeout
Parse response
Validate response schema
Run Numeric Invention Guard
Return safe Gemini response or deterministic fallback
```

Existing `/health` must keep working.

---

# 4. Environment Variables

Use server-side environment variables only.

Expected:

```text
GEMINI_API_KEY=
LLM_PROVIDER=gemini
LLM_TIMEOUT_MS=7000
LLM_DAILY_SOFT_LIMIT=80
```

Update `.env.example` only if needed.

Forbidden:

```text
VITE_GEMINI_API_KEY
```

Do not add any frontend secret.

---

# 5. Provider Boundary

Create a provider interface so the controller does not depend directly on Gemini implementation details.

Recommended shape:

```ts
export interface LlmProvider {
  generateText(prompt: string, options: LlmGenerationOptions): Promise<string>;
}

export interface LlmGenerationOptions {
  timeoutMs: number;
}
```

The Gemini provider should:

- read API key server-side,
- return raw text only to parser/validator,
- avoid logging prompt or response,
- throw controlled provider errors,
- never bypass fallback.

If `GEMINI_API_KEY` is missing, normal coach requests should use fallback, not crash.

---

# 6. Prompt Builder Requirements

Create server-side prompt builders.

Required functions may include:

```ts
export function buildCoachPrompt(request: CoachRequest): string;
export function buildFootprintCoachPrompt(request: FootprintCoachRequest): string;
export function buildChoiceCoachPrompt(request: ChoiceCoachRequest): string;
```

Every prompt must include constraints:

```text
Use only the structured context.
Do not invent numbers.
Do not calculate new carbon totals.
Do not introduce emission factors.
Use only allowed numbers.
If a number is not provided, use qualitative wording or impact bands.
Say estimates are approximate.
Do not shame or guilt the user.
Return valid JSON only.
```

Do not include raw profile, local storage, secrets, debug logs, or unnecessary free text.

---

# 7. Response Parsing and Validation

Create parser logic that accepts raw provider output and returns a validated `CoachResponse`.

Must handle:

```text
plain JSON
JSON inside markdown fences if Gemini returns fenced output
malformed JSON
missing fields
wrong mode
invalid source
empty text fields
```

A Gemini response must not be returned unless:

```text
JSON parse succeeds
CoachResponse validation passes
mode matches request mode
source is normalized to gemini
Numeric Invention Guard passes
```

If any check fails, return deterministic fallback.

---

# 8. Numeric Invention Guard Enforcement

Use the Task 006 shared guard.

Process:

```text
Collect response text fields
Validate generated numbers against request.allowedNumbers
If unsupported numbers exist, reject Gemini response
Return fallback
```

Do not return partial Gemini text.

Do not show technical guard errors to users.

---

# 9. Fallback Requirements

Use shared fallback:

```ts
createFallbackCoachResponse(request);
```

Fallback must be used when:

```text
GEMINI_API_KEY missing
LLM_PROVIDER disabled or unsupported
Gemini timeout
Gemini exception
Gemini malformed response
Coach response validation fails
Numeric Invention Guard fails
Invalid but recoverable provider result
```

Invalid client request should return safe `400`, not fallback.

---

# 10. Request Validation

Validate incoming body before processing.

Reject with safe `400` if:

```text
mode unsupported
context missing
allowedNumbers missing or not array
context shape invalid enough to be unsafe
payload too large
```

Keep validation lightweight and deterministic.

Do not add a schema library unless already approved or clearly justified.

---

# 11. Safe Logging

Allowed logs:

```text
coach mode
request duration
fallback reason category
validation failure category
provider unavailable
numeric guard rejected
```

Forbidden logs:

```text
Gemini API key
full prompt
full raw user context
raw private text
full Gemini response
stack traces in API response
```

Tests do not need to assert logging unless implementation makes it practical.

---

# 12. API Response Behavior

## 12.1 Success

Return `200` with `CoachResponse`.

## 12.2 Fallback

Return `200` with fallback `CoachResponse`.

The `source` must be:

```text
fallback
```

## 12.3 Invalid request

Return `400` with safe error:

```ts
{
  error: {
    code: string;
    message: string;
  }
}
```

Do not expose internal schema details or stack traces.

---

# 13. Testing Requirements

Add API tests.

Required tests:

```text
GET /health still works
POST /api/coach accepts valid footprint request
POST /api/coach accepts valid choice request
missing Gemini key returns fallback
provider timeout returns fallback
provider malformed JSON returns fallback
provider response with unsupported number returns fallback
provider valid response returns source gemini
invalid request returns 400
wrong mode response from provider falls back
response parser handles fenced JSON if implemented
```

Provider mocking is allowed and preferred.

Do not require a real Gemini API key in automated tests.

Tests must not make real network calls.

---

# 14. Dependency Guidance

Allowed if needed:

```text
@google/generative-ai or official Gemini SDK
supertest
```

Keep dependencies minimal.

Do not add:

```text
frontend Gemini SDK
database clients
auth libraries
heavy validation frameworks
analytics SDKs
```

If the SDK import complicates tests, isolate it behind `geminiProvider.ts`.

---

# 15. Verification Commands

Run from repo root:

```bash
npm run build
npm run typecheck
npm run test
npm run lint
npm run format:check
```

All must pass before marking Task 007 as review-ready.

---

# 16. Acceptance Criteria

Task 007 is successful when:

```text
POST /api/coach exists.
Both coach modes are supported.
Gemini is called server-side only.
Missing API key returns fallback.
Timeout returns fallback.
Malformed response returns fallback.
Invalid response schema returns fallback.
Unsupported generated numbers trigger fallback.
Valid Gemini-style response can pass.
Invalid client request returns safe 400.
No real network calls are required in tests.
No frontend code was added.
No UI was implemented.
No deployment config was added.
Root verification gates pass.
buildprogresstracker.md is updated.
```

---

# 17. Human Review Checklist

Verify:

```text
No VITE_GEMINI_API_KEY.
No key in frontend code.
No real Gemini call in automated tests.
Fallback works without GEMINI_API_KEY.
Numeric guard is enforced in controller path.
Prompt forbids invented numbers.
No raw prompt/context logged.
No UI changes.
All gates passed.
```

---

# 18. Expected Agent Report Format

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

# 19. Commit Recommendation

After review:

```bash
git add .
git commit -m "feat(api): add Gemini coach endpoint with fallback"
git push origin main
```

Use `main` only.

---

# 20. Final Instruction

Implement Task 007 only.

Do not begin UI work until Task 007 is reviewed and accepted.

The goal is a safe, tested, backend-only Gemini coach service that future UI screens can call honestly.
