---
name: carboncoach-repo-foundation
description: Use this skill when implementing Task 001 — Repo Foundation, Workspace, and Quality Gates for CarbonCoach. This task creates the monorepo structure, npm workspaces, TypeScript/Vite/Node foundations, quality gates, minimal app/API/shared packages, and baseline verification commands before any product feature work begins.
---

---

# Task 001 — Repo Foundation, Workspace, and Quality Gates

## Task Purpose

Create the production-grade repository foundation for **CarbonCoach** before any product feature implementation begins.

This task exists to prevent the previous challenge pattern where code quality, linting, testing, formatting, and architecture separation were repaired late. CarbonCoach must start with clean structure, strong quality gates, and clear package boundaries from Day 0.

Task 001 must create the foundation only. It must not implement product features.

---

# 1. Required Reading Before Coding

Before making changes, read these files:

```text
AGENTS.md
implementationplan.md
buildprogresstracker.md
docs/architecture/architecture-overview.md
docs/architecture/cloud-run-architecture.md
docs/architecture/llm-safety-design.md
docs/architecture/numeric-invention-guard.md
docs/deployment/cloud-run-free-tier.md
```

Do not proceed if `AGENTS.md` is missing or contradicts this task. If there is a conflict, follow `AGENTS.md`.

---

# 2. Task Scope

## In Scope

Create the initial monorepo/workspace foundation:

```text
CarbonCoach/
  package.json
  package-lock.json
  tsconfig.base.json
  eslint.config.js
  .prettierrc
  .gitignore
  .env.example

  apps/
    web/

  services/
    api/

  packages/
    shared/
```

Set up:

- npm workspaces,
- React + TypeScript + Vite web app,
- Node.js + TypeScript API service,
- shared TypeScript package,
- baseline tests,
- linting,
- formatting,
- typechecking,
- root verification scripts,
- minimal `/health` endpoint,
- minimal app shell,
- minimal shared export,
- baseline README update if needed,
- build tracker update.

## Out of Scope

Do not implement:

- onboarding,
- carbon calculator,
- factor registry,
- recommendation engine,
- privacy utilities,
- Gemini integration,
- LLM coach API,
- Numeric Invention Guard,
- Daily Choice Lab,
- Carbon World,
- tracker,
- Cloud Run Dockerfile,
- actual deployment,
- database,
- authentication,
- analytics,
- social leaderboard,
- Three.js,
- local LLM,
- any product UI beyond a minimal placeholder app shell.

---

# 3. Target Workspace Structure

Create this structure:

```text
apps/
  web/
    package.json
    tsconfig.json
    vite.config.ts
    index.html
    src/
      main.tsx
      App.tsx
      app/
      components/
      features/
      hooks/
      lib/
      styles/
      test/

services/
  api/
    package.json
    tsconfig.json
    src/
      server.ts
    test/

packages/
  shared/
    package.json
    tsconfig.json
    src/
      index.ts
    test/
```

The exact test folder naming may vary, but each workspace should have a clear place for tests.

---

# 4. Root Package Requirements

## 4.1 Root `package.json`

Set up npm workspaces.

Recommended workspace entries:

```json
{
  "workspaces": ["apps/*", "services/*", "packages/*"]
}
```

Root scripts must include:

```json
{
  "scripts": {
    "build": "npm run build --workspaces",
    "typecheck": "npm run typecheck --workspaces",
    "test": "npm run test --workspaces",
    "lint": "npm run lint --workspaces",
    "format": "prettier --write .",
    "format:check": "prettier --check ."
  }
}
```

If a script requires workspace-specific support, add the corresponding script to each workspace.

## 4.2 Root package metadata

Recommended root metadata:

```json
{
  "name": "carboncoach",
  "private": true,
  "version": "0.1.0",
  "description": "AI-assisted carbon awareness platform for understanding, tracking, and reducing personal carbon footprint through everyday decision coaching."
}
```

Keep the repo private flag in `package.json` as `true` to prevent accidental npm publishing. This does not affect GitHub public repository visibility.

---

# 5. TypeScript Requirements

## 5.1 Root `tsconfig.base.json`

Create a shared strict TypeScript config.

Minimum expectations:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "useDefineForClassFields": true,
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "skipLibCheck": true
  }
}
```

Workspace configs may extend this file and adjust module settings where needed.

## 5.2 Strict typing rule

Do not use `any` in foundation code unless there is a clear reason. There should be no need for `any` in Task 001.

---

# 6. ESLint Requirements

Create a root `eslint.config.js`.

Use modern ESLint flat config if practical.

The config should support:

- TypeScript,
- React for `apps/web`,
- Node/API code for `services/api`,
- tests.

Recommended dependencies may include:

```text
eslint
typescript-eslint
eslint-plugin-react-hooks
eslint-plugin-react-refresh
globals
```

Keep config simple and maintainable. Do not over-engineer.

Minimum lint expectations:

- no unused variables,
- TypeScript-aware linting,
- React hooks rules for web app,
- no obvious unsafe patterns.

---

# 7. Prettier Requirements

Create `.prettierrc`.

Recommended:

```json
{
  "singleQuote": true,
  "semi": true,
  "trailingComma": "all",
  "printWidth": 100
}
```

Create `.prettierignore` if needed.

Recommended ignored paths:

```text
node_modules
dist
coverage
package-lock.json
```

Do not ignore source files.

---

# 8. Git Ignore Requirements

Create or update `.gitignore`.

Must ignore:

```text
node_modules/
dist/
coverage/
.env
.env.*
!.env.example
.DS_Store
*.log
.vite/
```

Do not ignore:

```text
AGENTS.md
implementationplan.md
buildprogresstracker.md
docs/
.env.example
```

---

# 9. Environment Example Requirements

Create `.env.example`.

Include placeholders only:

```text
NODE_ENV=development
PORT=8080

# Server-side only. Never expose this through Vite frontend variables.
GEMINI_API_KEY=replace-with-server-side-key
LLM_PROVIDER=gemini
LLM_TIMEOUT_MS=7000
LLM_DAILY_SOFT_LIMIT=80
```

Do not create `.env`.

Do not include a real key.

Do not use `VITE_GEMINI_API_KEY`.

---

# 10. Web App Foundation — `apps/web`

## 10.1 Tech

Use:

- React
- TypeScript
- Vite
- Vitest
- React Testing Library if practical

## 10.2 Minimal UI

Create a minimal app shell that renders:

```text
CarbonCoach
Understand your footprint. Make better everyday choices.
```

This is only a placeholder. Do not build product screens in Task 001.

## 10.3 Web app scripts

`apps/web/package.json` should include:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "typecheck": "tsc --noEmit",
    "test": "vitest run",
    "lint": "eslint .",
    "format:check": "prettier --check ."
  }
}
```

Adjust `tsc -b` depending on actual TypeScript config.

## 10.4 Minimal test

Add at least one smoke test that confirms the app renders the product name or tagline.

Example test intent:

```text
renders CarbonCoach heading
```

## 10.5 Accessibility baseline

The placeholder app should already use semantic HTML:

- `main`,
- `h1`,
- readable text.

Do not add inaccessible placeholder controls.

---

# 11. API Foundation — `services/api`

## 11.1 Tech

Use:

- Node.js
- TypeScript
- Express or Fastify

Recommended: Express for simplicity unless the repo already chooses Fastify.

## 11.2 Minimal endpoint

Create:

```text
GET /health
```

Recommended response:

```json
{
  "status": "ok",
  "service": "carboncoach-api"
}
```

No secrets or environment details should be exposed.

## 11.3 API scripts

`services/api/package.json` should include:

```json
{
  "scripts": {
    "build": "tsc",
    "typecheck": "tsc --noEmit",
    "test": "vitest run",
    "lint": "eslint .",
    "format:check": "prettier --check ."
  }
}
```

Do not use `tsx` for production runtime. Dev scripts may be added later if useful, but production should eventually run compiled JavaScript.

## 11.4 Minimal test

Add a health endpoint test if practical.

If HTTP test dependencies are considered too much for Task 001, at least add a simple unit test for exported app creation or health response helper. Keep dependencies minimal.

## 11.5 Port behavior

API should read:

```text
PORT
```

Default locally:

```text
8080
```

Bind to `0.0.0.0` where applicable for container readiness, but full Docker support is not required in this task.

---

# 12. Shared Package Foundation — `packages/shared`

## 12.1 Purpose

This package will later contain deterministic domain logic.

Task 001 should only create the package foundation.

## 12.2 Minimal export

Create a minimal shared export such as:

```ts
export const carbonCoachProductName = 'CarbonCoach';
```

or a simple type:

```ts
export type ProductName = 'CarbonCoach';
```

Do not implement carbon domain logic yet.

## 12.3 Shared package scripts

`packages/shared/package.json` should include:

```json
{
  "scripts": {
    "build": "tsc",
    "typecheck": "tsc --noEmit",
    "test": "vitest run",
    "lint": "eslint .",
    "format:check": "prettier --check ."
  }
}
```

## 12.4 Minimal test

Add at least one minimal test validating the placeholder export.

This confirms the shared package test setup works.

---

# 13. Dependency Guidance

## 13.1 Allowed dependencies for Task 001

Reasonable dependencies:

```text
typescript
vite
react
react-dom
@vitejs/plugin-react
vitest
@testing-library/react
@testing-library/jest-dom
jsdom
eslint
prettier
typescript-eslint
eslint-plugin-react-hooks
eslint-plugin-react-refresh
express
@types/express
```

Use only what is necessary.

## 13.2 Avoid in Task 001

Do not add:

```text
@google/generative-ai
@google/genai
firebase
three
chart.js
recharts
tailwind
zod
axios
database clients
auth libraries
analytics SDKs
```

These may be introduced later only when needed by a specific task.

For request validation in later tasks, schema libraries can be discussed then. Do not add them in Task 001 unless there is an explicit decision.

---

# 14. README Handling

If `README.md` exists, update only minimally.

Recommended Task 001 README sections:

```text
# CarbonCoach
AI-assisted carbon awareness platform.

## Current Status
Foundation setup in progress.

## Scripts
npm run build
npm run typecheck
npm run test
npm run lint
npm run format:check
```

Do not claim product features that are not implemented yet.

---

# 15. Build Progress Tracker Update

At the end of Task 001, update `buildprogresstracker.md`.

Update:

- Task 001 status,
- files changed,
- verification commands,
- verification result,
- risks/follow-ups,
- commit hash if already committed.

Do not mark Task 001 as `Complete` unless verification has passed and human review accepts it.

Use `Review Ready` if implementation is done but review is pending.

---

# 16. Required Verification

After implementation, run:

```bash
npm install
npm run build
npm run typecheck
npm run test
npm run lint
npm run format:check
```

If any command fails:

1. fix the issue if within Task 001 scope,
2. rerun the command,
3. report remaining failures honestly.

Do not claim a command passed if it did not run.

---

# 17. Acceptance Criteria

Task 001 is successful when:

```text
npm workspaces are configured.
apps/web exists and builds.
services/api exists and builds.
packages/shared exists and builds.
Root build/typecheck/test/lint/format scripts exist.
TypeScript strict mode is configured.
ESLint is configured.
Prettier is configured.
.env.example exists without secrets.
.gitignore protects secrets and build artifacts.
Minimal web app renders CarbonCoach.
Minimal API health endpoint exists.
Minimal shared export exists.
Baseline tests pass.
No product features were implemented.
No Gemini integration was added.
No heavy dependencies were added.
buildprogresstracker.md is updated.
```

---

# 18. Failure and Sad Path Guidance

## 18.1 npm workspace script issues

If `npm run build --workspaces` fails because one workspace lacks the script, add the missing script rather than bypassing the workspace.

## 18.2 ESLint config issues

If modern flat config causes excessive setup friction, simplify the ESLint config. The goal is a working lint gate, not a perfect enterprise lint setup.

## 18.3 Test environment issues

If React tests need `jsdom`, configure Vitest for the web workspace.

Do not remove tests to make the command pass.

## 18.4 TypeScript project reference complexity

Do not over-engineer project references in Task 001. A clean workspace-level `tsconfig` setup is enough.

## 18.5 Dependency conflicts

Prefer fewer dependencies.

Do not add libraries to work around basic TypeScript or lint setup unless necessary.

---

# 19. Human Review Checklist

After Antigravity completes Task 001, the human reviewer should check:

```text
Repo structure looks clean.
No product feature was prematurely implemented.
No secrets exist.
No VITE_GEMINI_API_KEY exists.
All quality scripts are present.
Verification output is credible.
Dependencies are minimal.
README does not overclaim.
buildprogresstracker.md was updated.
```

---

# 20. Expected Agent Report Format

At the end of the task, report:

```text
Files changed
- path
- path

What was implemented
- concise summary

What was intentionally not changed
- no product features
- no Gemini integration
- no calculator/recommendation logic
- no deployment

Verification
- npm install: pass/fail/not run
- npm run build: pass/fail/not run
- npm run typecheck: pass/fail/not run
- npm run test: pass/fail/not run
- npm run lint: pass/fail/not run
- npm run format:check: pass/fail/not run

Risks / follow-ups
- only real risks
```

---

# 21. Commit Recommendation

After review, commit with:

```bash
git add .
git commit -m "chore: scaffold CarbonCoach workspace and quality gates"
git push origin main
```

Use `main` only. Do not create a feature branch.

---

# 22. Final Instruction

Implement Task 001 only.

Do not begin Task 002 until Task 001 is reviewed and accepted.

Build the foundation cleanly. Every later task depends on this.
