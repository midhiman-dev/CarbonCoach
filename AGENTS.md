# Repository Instructions for AI Agents

## Project Name

**CarbonCoach**

## Product Positioning

CarbonCoach is an **AI-assisted carbon awareness platform** that helps individuals understand, track, and reduce their carbon footprint through everyday decision moments.

The product is not just a calculator or dashboard. It is designed to create **awareness, behavior change, and practical action** through:

- personalized footprint explanation,
- everyday choice coaching,
- simple weekly action plans,
- lightweight emotional progress feedback,
- local-first tracking,
- transparent assumptions,
- and safe, bounded LLM assistance.

## Core Product Promise

> Understand your footprint. Make better everyday choices.

## Challenge Context

This repository is being built for **Prompt Wars Virtual — Challenge 3: Carbon Footprint Awareness Platform**.

The challenge expects a deployed functional web application that helps individuals:

- understand their carbon footprint,
- track carbon-impacting habits,
- reduce impact through simple actions,
- receive personalized insights,
- experience awareness beyond a static calculator,
- and interact with a smart, dynamic assistant.

The scoring dimensions are:

1. Code Quality — structure, readability, maintainability
2. Security — safe and responsible implementation
3. Efficiency — optimal use of resources
4. Testing — validation of functionality
5. Accessibility — inclusive and usable design
6. Alignment with the problem statement

This repository must be built to score strongly from Day 0. Do not treat code quality, testing, security, efficiency, accessibility, or documentation as late-stage cleanup.

---

# 1. Non-Negotiable Product Rules

## 1.1 Awareness-first rule

CarbonCoach must be built as an **awareness and behavior-change product**, not merely a footprint calculator.

Every major feature should help the user answer at least one of these questions:

- What part of my lifestyle contributes most?
- What does this mean in simple language?
- What choice can I make differently today?
- What is a realistic next step for this week?
- Am I making progress over time?

## 1.2 Deterministic engines decide, LLMs explain

This is the most important technical and product rule.

```text
Deterministic engines calculate and rank.
LLMs explain and coach.
```

The LLM must never be the source of truth for:

- emission factors,
- footprint totals,
- category breakdowns,
- impact bands,
- avoided-emission values,
- weekly progress values,
- tracker state,
- Carbon World state,
- or numeric reduction estimates.

All numeric and decision-critical values must come from tested TypeScript domain logic.

## 1.3 Required LLM workflows

LLM inference is mandatory in the product workflow, but bounded.

CarbonCoach must include exactly these two first-class LLM-assisted workflows:

### Footprint Coach

Explains a user's calculated footprint and recommended actions.

The Footprint Coach may:

- summarize the footprint,
- explain the top contributor,
- simplify results,
- recommend where to start,
- adapt tone to user preference,
- and produce an encouraging weekly plan.

The Footprint Coach must not invent or calculate numbers.

### Choice Coach

Explains everyday decision moments inside the Daily Choice Lab.

The Choice Coach may:

- compare options,
- explain why one choice has lower impact,
- provide a non-guilt nudge,
- adapt to user priorities such as low effort or saving money,
- and suggest a realistic alternative.

The Choice Coach must not invent or calculate numbers.

## 1.4 Numeric invention guard is mandatory

All LLM responses must pass:

1. schema validation,
2. numeric invention validation,
3. safety/tone validation where practical,
4. fallback activation on failure.

If an LLM response includes unsupported numbers, reject it and use the deterministic fallback response.

## 1.5 Fallback Coach is mandatory

The deployed app must remain functional if:

- `GEMINI_API_KEY` is missing,
- Gemini quota is exhausted,
- Gemini request times out,
- Gemini returns malformed content,
- Gemini returns unsupported numbers,
- Cloud Run receives invalid input,
- or the network fails.

The fallback response must be generated from deterministic local/shared logic.

## 1.6 No guilt, shame, or moralizing

CarbonCoach should encourage behavior change without blaming the user.

Avoid language such as:

- “You are harming the planet.”
- “Your choices are bad.”
- “You must stop doing this.”

Prefer:

- “A lower-impact option is available.”
- “This is a practical place to start.”
- “Small changes can add up over time.”
- “Here is an easier option for this week.”

## 1.7 Approximation and assumptions must be visible

Carbon footprint estimates are approximate.

The app must clearly show:

- that estimates are not exact,
- what assumptions were used,
- which emission factors are demo factors or documented references,
- confidence levels where relevant,
- and when values are impact bands instead of precise calculations.

---

# 2. P0 Product Scope

The following features are in scope for the first complete challenge build.

## 2.1 Carbon Profile Onboarding

Collect a lightweight lifestyle profile.

Expected areas:

- commute mode,
- weekly commute distance,
- diet pattern,
- home energy estimate,
- shopping/delivery frequency,
- flights per year,
- household size where relevant,
- and preference mode.

Preference modes should include:

- Balanced
- Save Money
- Low Effort
- Highest Impact

Do not collect unnecessary personal data.

## 2.2 Footprint Summary

Show estimated footprint across categories such as:

- Transport
- Food
- Home Energy
- Shopping
- Flights

The summary must show:

- estimated monthly total,
- category breakdown,
- top contributor,
- confidence/assumption notes,
- and a clear “approximate estimate” message.

## 2.3 Footprint Coach

LLM-assisted explanation of the calculated footprint.

Must use structured calculated context only.

Must support deterministic fallback.

## 2.4 Daily Choice Lab

This is a P0 feature and a core differentiator.

It must present everyday decision scenarios such as:

- cab vs metro,
- chicken meal delivery vs nearby vegetarian meal,
- separate delivery vs combined delivery,
- short flight vs train,
- buy new vs repair/reuse.

Each scenario should show:

- options,
- impact bands,
- reason labels,
- user-preference alignment,
- and a suggested better choice.

## 2.5 Choice Coach

LLM-assisted explanation for Daily Choice Lab decisions.

Must use structured choice data only.

Must support deterministic fallback.

## 2.6 Weekly Action Plan

Generate a simple weekly action plan from:

- footprint result,
- user preference,
- recommended actions,
- and choice behavior.

Actions should be realistic and small.

## 2.7 Carbon World

A lightweight emotional progress view.

Use SVG/CSS, not Three.js for P0.

Carbon World should visually reflect progress through:

- sky clarity,
- trees,
- haze,
- city/earth elements,
- or similar lightweight visual states.

Accessibility requirement:

Every visual state must have a text equivalent.

## 2.8 Weekly Tracker

Allow users to track selected weekly actions.

Must support:

- local persistence,
- action completion,
- estimated avoided impact from deterministic values,
- and clear-data behavior.

## 2.9 Privacy and Assumptions Page

Must explain:

- what is stored,
- where it is stored,
- what is sent to the LLM,
- what is not sent,
- how estimates are calculated,
- and how users can clear their data.

## 2.10 Cloud Run Deployment

The application must be deployable as a functional web app.

Primary deployment target:

```text
Google Cloud Run
```

Cloud Run should serve:

- React/Vite frontend,
- `/api/coach`,
- `/health`.

## 2.11 Submission Documentation

The repository must include challenge submission documentation for:

- prompt strategy,
- tools used,
- solution architecture,
- how AI-assisted development was used,
- how the LLM is bounded,
- and the LinkedIn post draft.

---

# 3. Explicit Non-Goals for P0

Do not implement the following unless explicitly approved later.

## 3.1 No real social leaderboard in P0

Social accountability is valuable but not P0.

A real leaderboard introduces:

- identity,
- privacy,
- persistence,
- moderation,
- fairness,
- and backend complexity.

If shown, it must be clearly marked as demo/sample data.

## 3.2 No Three.js in P0

Do not use Three.js for the first build.

Reason:

- bundle size,
- accessibility complexity,
- performance risk,
- testing complexity,
- unnecessary implementation overhead.

Use lightweight SVG/CSS for Carbon World.

## 3.3 No login in P0

Do not require authentication for the main user journey.

Local-first is preferred.

## 3.4 No database in P0 unless explicitly approved

The first version should work with:

- local storage,
- deterministic shared logic,
- Cloud Run backend only for coach orchestration.

## 3.5 No local LLM hosting

Do not deploy:

- Ollama,
- local model inference,
- GPU inference,
- or self-hosted LLM runtime.

Use Gemini API through Cloud Run.

## 3.6 No frontend API keys

Never expose Gemini or any LLM API key in frontend code.

Do not use:

```text
VITE_GEMINI_API_KEY
```

## 3.7 No scientific overclaiming

Do not claim exact carbon accounting.

Use language such as:

- estimated,
- approximate,
- directional,
- based on documented assumptions,
- impact band.

---

# 4. Repository Architecture

## 4.1 Target repository shape

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

Task 001 should create the actual application and package structure.

## 4.2 Responsibility boundaries

### apps/web

UI only.

Allowed responsibilities:

- rendering screens,
- user interaction,
- local persistence adapter,
- calling `/api/coach`,
- showing fallback results,
- accessibility behavior,
- routing/navigation if used.

Not allowed:

- emission calculation logic,
- recommendation ranking logic,
- prompt construction,
- Gemini SDK usage,
- API key handling,
- hidden business rules.

### packages/shared

Core deterministic product logic.

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

This package owns:

- domain types,
- emission factor registry,
- footprint calculator,
- choice impact engine,
- recommendation engine,
- deterministic fallback coach composer,
- numeric guard utilities,
- privacy/redaction utilities,
- validation contracts,
- Carbon World state engine.

### services/api

Cloud Run backend.

Expected responsibilities:

- serve frontend static build,
- expose `/api/coach`,
- expose `/health`,
- validate requests,
- build safe prompts,
- call Gemini server-side,
- enforce timeout,
- validate response schema,
- run numeric invention guard,
- return fallback response when needed.

Not allowed:

- local model hosting,
- GPU inference,
- storing raw private data,
- logging raw personal user input,
- exposing secrets,
- performing carbon calculations independently from shared package.

### docs

Source-of-truth project documentation.

Expected areas:

```text
docs/architecture/
docs/deployment/
docs/testing/
docs/submission/
docs/skills/
```

Docs must stay aligned with actual behavior.

Do not document features that are not implemented.

---

# 5. Approved Tech Stack

## 5.1 Frontend

- React
- TypeScript
- Vite
- CSS Modules or scoped CSS
- Lightweight SVG/CSS visuals
- No heavy chart library unless explicitly justified
- No Three.js in P0

## 5.2 Backend

- Node.js
- TypeScript
- Express or Fastify
- Cloud Run deployment
- Gemini API server-side call
- production build should run compiled JavaScript, not `tsx`

## 5.3 Shared logic

- TypeScript
- Strict types
- Vitest for unit tests

## 5.4 Testing

- Vitest
- React Testing Library
- Accessibility smoke testing where practical
- No reliance only on snapshots

## 5.5 Quality tooling

- ESLint
- Prettier
- TypeScript strict mode
- npm scripts for build/typecheck/test/lint/format

## 5.6 Deployment

- Google Cloud Run
- Dockerfile
- `.dockerignore`
- `.env.example`
- server-side environment variables

---

# 6. Build and Verification Commands

These commands must exist as early as Task 001 or as soon as package scaffolding supports them.

```bash
npm run build
npm run typecheck
npm run test
npm run lint
npm run format:check
```

Before any task is marked complete, run the relevant subset. Before any submission, run all.

Recommended additional checks before submission:

```bash
npm ls
npm audit --omit=dev
```

If a command is not yet available because Task 001 has not created it, the agent must clearly say so and must not pretend it was run.

---

# 7. Code Quality Rules

## 7.1 General code style

- Prefer readable, boring, maintainable code.
- Use explicit names.
- Keep functions small.
- Keep files focused.
- Avoid speculative abstractions.
- Remove dead code.
- Avoid commented-out blocks.
- Avoid hidden side effects.
- Do not mix UI rendering and business rules.

## 7.2 TypeScript rules

- Use strict typing.
- Avoid `any`.
- Prefer domain-specific types over generic blobs.
- Validate external/API boundaries.
- Use discriminated unions for coach modes and choice scenarios where helpful.
- Export named modules; avoid default exports unless framework conventions require them.

## 7.3 React rules

- Functional components only.
- Keep page components ideally under 200 lines.
- Keep reusable UI components ideally under 120 lines.
- Move calculation and decision logic to shared package.
- Keep components accessible by default.
- Avoid prop drilling if it becomes confusing, but do not introduce heavy state libraries prematurely.

## 7.4 CSS rules

- Avoid one giant global CSS file.
- Prefer scoped component styles or a small design-token file.
- No decorative complexity that hurts readability.
- Maintain visible focus states.
- Do not rely on color alone.

## 7.5 Dependency rules

- Add dependencies only when clearly necessary.
- Do not add heavy charting or animation libraries for simple visuals.
- Do not add backend dependencies to frontend.
- Remove unused dependencies before submission.
- Avoid dependency sprawl.

---

# 8. LLM Architecture Rules

## 8.1 LLM provider

Use Gemini API through the backend service.

The frontend must call:

```text
POST /api/coach
```

The frontend must never call Gemini directly.

## 8.2 Coach modes

The coach endpoint must support:

```text
footprint_coach
choice_coach
```

The mode must be explicit in the request payload.

## 8.3 Structured context only

The LLM receives minimized structured context.

Allowed context may include:

- calculated category totals,
- top contributor,
- confidence,
- assumptions,
- ranked recommended actions,
- choice scenario options,
- impact bands,
- user preference,
- selected tone mode.

Do not send:

- raw full profile history,
- unnecessary personal details,
- exact address,
- income,
- health details,
- raw analytics logs,
- large chat history.

## 8.4 Prompt constraints

All LLM prompts must include:

```text
Do not invent numbers.
Use only numbers provided in the structured context.
If a number is not present, use an impact band or qualitative explanation.
Say estimates are approximate.
Use a friendly, non-judgmental tone.
Do not shame the user.
Do not claim scientific precision.
```

## 8.5 Timeout

LLM calls must have a timeout.

Recommended default:

```text
7000 ms
```

If timeout occurs, use deterministic fallback.

## 8.6 Response schema

LLM response must be parsed into a strict response shape.

Recommended shape:

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

## 8.7 Numeric invention validation

After parsing the LLM response:

1. extract all numeric values from the response,
2. compare against allowed numbers derived from the request context,
3. reject response if unsupported numbers are found,
4. return fallback response.

## 8.8 Fallback response

Fallback must be generated from deterministic shared logic.

Fallback should still feel helpful and polished.

Fallback should not say “error” unless necessary.

Preferred UI wording:

```text
The AI coach is temporarily unavailable, so CarbonCoach is showing a rule-based explanation from your calculated results.
```

---

# 9. Security Rules

## 9.1 Secrets

Never commit secrets.

Do not expose Gemini keys to the frontend.

Use server-side environment variables only:

```text
GEMINI_API_KEY=
LLM_PROVIDER=gemini
LLM_TIMEOUT_MS=7000
LLM_DAILY_SOFT_LIMIT=80
```

## 9.2 Input validation

Validate:

- onboarding profile,
- choice scenario input,
- coach request payload,
- LLM response payload,
- local persistence state.

Reject invalid payloads safely.

## 9.3 Privacy

Local-first by default.

Do not require login in P0.

Do not collect unnecessary personal data.

Do not log raw user free-text.

Do not send raw lifestyle notes to LLM if summarized/structured context is enough.

Provide “Clear my data” control.

## 9.4 Logging

Backend logs may include:

- request mode,
- success/failure,
- timeout/fallback,
- validation failure reason class.

Backend logs must not include:

- full user profile,
- raw free-text,
- API key,
- full prompt,
- full LLM response if it contains user data.

## 9.5 Abuse and cost safety

Use basic safeguards:

- timeout,
- small payloads,
- optional in-memory soft request limit,
- no automatic LLM calls on page load,
- cache repeated coach responses locally.

---

# 10. Efficiency Rules

## 10.1 Runtime efficiency

The app shell must render without waiting for Gemini.

Do not block initial page load on LLM response.

LLM calls must be user-triggered.

Good triggers:

- “Explain my footprint”
- “Coach me on this choice”
- “Create my plan”

Bad triggers:

- every page load,
- every form field change,
- every tracker checkbox,
- every render.

## 10.2 Bundle efficiency

Avoid:

- large chart libraries,
- 3D libraries,
- animation frameworks,
- unnecessary SDKs in frontend.

Use:

- CSS,
- SVG,
- simple bars/cards,
- lazy loading if useful.

## 10.3 Cloud Run efficiency

Cloud Run must use:

```text
min instances = 0
```

Do not use:

- GPU,
- always-on workers,
- local model hosting,
- background loops.

Use a small Docker image and production build.

## 10.4 LLM efficiency

Reduce LLM usage by:

- local caching,
- small prompt context,
- short responses,
- timeout fallback,
- deterministic fallback for repeated/common explanations.

---

# 11. Testing Rules

Testing is mandatory.

## 11.1 Required unit test areas

The following must have meaningful tests:

- carbon calculator,
- emission factor handling,
- recommendation ranking,
- choice impact engine,
- Carbon World state engine,
- deterministic fallback composer,
- numeric invention guard,
- privacy/redaction utilities,
- validation schemas.

## 11.2 Required LLM/API tests

The coach service must test:

- valid Footprint Coach request,
- valid Choice Coach request,
- missing API key fallback,
- timeout fallback,
- malformed LLM output fallback,
- unsupported number fallback,
- invalid request rejection.

## 11.3 Required UI tests

Important flows should have rendering/interaction tests:

- onboarding,
- footprint summary,
- Daily Choice Lab,
- coach panel,
- weekly tracker,
- privacy/clear-data flow.

## 11.4 Accessibility tests

At minimum, validate:

- form labels,
- accessible button names,
- visible focus states where practical,
- `aria-live` for coach loading/error states,
- non-color-only badges,
- keyboard-reachable primary actions.

## 11.5 Manual test checklist

If automated testing is not practical for a UI detail, add it to:

```text
docs/testing/demo-checklist.md
```

Do not mark a task complete without either automated tests or documented manual verification.

---

# 12. Accessibility Rules

Accessibility is a scoring category and must be built from the start.

## 12.1 General accessibility

- All inputs must have labels.
- Buttons must have meaningful names.
- Icon-only actions must have accessible labels.
- Interactive elements must be keyboard usable.
- Focus state must be visible.
- Text must be readable on mobile.
- Touch targets should be comfortable.
- Do not rely on color alone.

## 12.2 Status and badges

Impact badges must include text and visual cues.

Good:

```text
High impact · Transport · Estimated
```

Bad:

```text
Red badge only
```

## 12.3 Carbon World accessibility

Carbon World must include a text summary.

Example:

```text
Your Carbon World is improving this week because you completed three lower-impact actions.
```

The visual must not be the only way to understand progress.

## 12.4 LLM response accessibility

Coach loading and fallback states should use appropriate accessible messaging.

Use `aria-live="polite"` for coach result updates where practical.

---

# 13. Documentation Rules

Documentation is part of delivery.

## 13.1 README must include

- product overview,
- challenge alignment,
- core features,
- AI/LLM usage,
- deterministic calculation rule,
- numeric invention guard,
- privacy model,
- security model,
- accessibility approach,
- testing commands,
- deployment instructions,
- assumptions and limitations,
- deployed URL placeholder.

## 13.2 Architecture docs must include

- high-level architecture,
- LLM safety design,
- numeric invention guard,
- Cloud Run architecture,
- deployment/free-tier assumptions.

## 13.3 Submission docs must include

- LinkedIn post draft,
- prompt strategy,
- tools used,
- solution architecture,
- how prompts evolved,
- how AI assisted implementation,
- how the app addresses problem statement.

## 13.4 No overclaiming

Docs must match actual implementation.

Do not claim:

- real integrations that are not implemented,
- exact carbon science,
- production-grade carbon accounting,
- real social leaderboard,
- real database persistence,
- real user accounts,
- advanced gamification,
- if not actually built.

---

# 14. Deployment Rules

## 14.1 Primary target

Use Google Cloud Run.

## 14.2 Required endpoints

Cloud Run service should expose:

```text
GET /
POST /api/coach
GET /health
```

## 14.3 Required Cloud Run settings

Recommended settings:

```text
min instances: 0
max instances: 1 or 2
memory: 512 MiB
CPU: 1
request timeout: 10-15 seconds
LLM timeout: 6-8 seconds
```

## 14.4 Docker rules

Use production build.

Do not run TypeScript directly in production via `tsx`.

Use `.dockerignore`.

Keep image small.

## 14.5 Deployment verification

Before submission, verify:

- public app URL loads,
- hard refresh works,
- `/health` works,
- `/api/coach` works with Gemini if key is configured,
- `/api/coach` falls back safely if Gemini fails,
- no frontend bundle exposes API key,
- README deployment instructions match reality.

---

# 15. Submission Rules

## 15.1 Latest submission counts

Only the latest submission counts toward final leaderboard score.

Do not use submissions casually as diagnostics.

Submit only when the release gate passes.

## 15.2 Mandatory submission assets

The challenge requires:

- public GitHub repository,
- deployed functional web app link,
- LinkedIn post explaining prompt strategy, tools used, and architecture.

All three must be ready.

## 15.3 Submission readiness gate

Do not submit unless:

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

## 15.4 Manual review readiness

Manual reviewers may compare:

- repository claims,
- deployed app behavior,
- LinkedIn post,
- architecture docs,
- and actual functionality.

If there is mismatch, scoring risk increases.

---

# 16. Task Execution Rules for AI Agents

## 16.1 Always read before coding

Before implementing any task, read:

1. `AGENTS.md`
2. `implementationplan.md`
3. `buildprogresstracker.md`
4. relevant `docs/skills/<task>/SKILLS.md`
5. relevant architecture docs

## 16.2 One task at a time

Implement only the assigned task.

Do not combine unrelated tasks.

Do not build future features early unless explicitly asked.

## 16.3 Do not modify unrelated files

If a task requires touching unrelated files, explain why before making the change.

## 16.4 Keep repo runnable

At the end of each task, the repo should remain runnable or clearly explain why not.

## 16.5 Report format

After each task, report:

```text
Files changed
What was implemented
What was intentionally not changed
Verification commands run
Verification result
Risks/follow-ups
```

## 16.6 Commit strategy

Use small commits.

Recommended commit format:

```text
docs: initialize challenge guardrails
chore: scaffold workspace and quality gates
feat(carbon): add footprint calculator
test(carbon): cover calculator edge cases
feat(coach): add Gemini coach fallback guard
```

---

# 17. Agent Role Guide

## 17.1 Architect Agent

Use for:

- architecture changes,
- task slicing,
- dependency decisions,
- cross-package boundaries,
- scoring-risk analysis.

Must protect:

- deterministic vs LLM separation,
- Cloud Run free-tier architecture,
- code quality,
- product alignment.

## 17.2 Frontend Agent

Use for:

- React screens,
- UI primitives,
- accessibility behavior,
- Carbon World UI,
- Daily Choice Lab UI.

Must not:

- calculate emissions in components,
- construct LLM prompts,
- expose secrets,
- rely on color-only status.

## 17.3 Shared Domain Agent

Use for:

- carbon calculator,
- choice engine,
- recommendation engine,
- world engine,
- validation,
- privacy utilities,
- numeric guard.

Must prioritize tests.

## 17.4 Backend/Cloud Agent

Use for:

- Cloud Run service,
- `/api/coach`,
- Gemini provider,
- fallback behavior,
- Dockerfile,
- deployment docs.

Must not:

- expose secrets,
- run local LLM,
- log private data.

## 17.5 QA & Review Agent

Use after every task.

Must check:

- task scope,
- scoring criteria,
- tests,
- accessibility,
- security,
- docs truthfulness,
- regression risk.

## 17.6 Documentation Agent

Use for:

- README,
- architecture docs,
- deployment docs,
- submission docs,
- LinkedIn draft,
- prompt strategy.

Must not overclaim.

---

# 18. Known High-Risk Areas

Agents must pay special attention to these risk areas.

## 18.1 Code Quality risk

Risk:

- large components,
- mixed business/UI logic,
- scattered prompt strings,
- duplicate helper functions,
- unused dependencies.

Mitigation:

- shared package owns logic,
- services/api owns LLM orchestration,
- apps/web owns UI only,
- lint and format from Day 0.

## 18.2 Security risk

Risk:

- exposed API key,
- raw personal data sent to LLM,
- unsafe logging,
- no fallback.

Mitigation:

- Cloud Run backend only,
- structured context,
- redaction,
- validation,
- fallback.

## 18.3 Efficiency risk

Risk:

- LLM called too often,
- heavy libraries,
- Cloud Run always-on costs,
- blocking startup.

Mitigation:

- user-triggered LLM,
- local cache,
- SVG/CSS visuals,
- min instances 0.

## 18.4 Testing risk

Risk:

- only happy-path tests,
- no LLM failure tests,
- no numeric guard tests,
- no accessibility tests.

Mitigation:

- failure-path testing required,
- test all core engines,
- test fallback,
- manual demo checklist.

## 18.5 Accessibility risk

Risk:

- color-only impact indicators,
- unlabeled forms,
- inaccessible Carbon World,
- keyboard traps.

Mitigation:

- shared accessible UI primitives,
- labels and ARIA,
- text equivalents,
- non-color-only states.

---

# 19. Final Source-of-Truth Statement

This `AGENTS.md` is the root instruction file for CarbonCoach.

If there is a conflict, follow this order:

1. explicit user instruction in the current task,
2. `AGENTS.md`,
3. active task skill file under `docs/skills/`,
4. `implementationplan.md`,
5. architecture docs,
6. existing code conventions.

The goal is not to build the largest app.

The goal is to build the most credible, usable, secure, efficient, accessible, tested, and challenge-aligned CarbonCoach application within the time and free-tier constraints.

Build small. Build clean. Verify continuously. Do not repair quality at the end.
