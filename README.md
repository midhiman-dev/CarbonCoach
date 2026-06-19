# CarbonCoach

**Understand your footprint. Make better everyday choices.**

CarbonCoach is an AI-assisted carbon awareness platform that helps individuals understand, track, and reduce their carbon footprint through everyday decision moments. By combining deterministic calculation with smart, bounded AI coaching, CarbonCoach goes beyond simple calculators to provide actionable, habit-building insights.

[**Live App Deployment**]([PLACEHOLDER_LIVE_URL])

---

## Challenge Alignment

Built for the **Prompt Wars Virtual Challenge**, this project directly tackles the challenge by providing:

- **Awareness:** Personalized footprint breakdowns and clear explanations.
- **Choice Coaching:** Comparing everyday options (e.g., cab vs. metro) without guilt or moralizing.
- **Action Tracking:** Building habits through realistic weekly plans.
- **Carbon World:** Translating abstract footprint metrics into a lightweight, engaging visual progression of a personal environment.

---

## Architecture Overview

CarbonCoach is built as a modular monorepo optimized for Google Cloud Run:

- **`apps/web`**: A React/Vite frontend focused purely on rendering UI, managing local persistence, and accessibility.
- **`services/api`**: An Express server handling Gemini orchestration, environment validation, prompt building, payload security, and serving the static frontend.
- **`packages/shared`**: The deterministic heart of the app containing domain types, calculators, recommendation engines, the Numeric Invention Guard, and privacy utilities.

---

## AI Safety Strategy

CarbonCoach strictly separates math from language:

- **Deterministic logic calculates.** The math behind emission factors, impact bands, and tracker progression is handled purely by tested TypeScript code.
- **Gemini explains.** The AI acts as a bounded coach to summarize data, simplify insights, and motivate the user.
- **Numeric Invention Guard.** To ensure factual integrity, the API runs a custom post-processing guard over LLM responses. If the AI invents numbers not present in the structured context, the guard rejects the response and triggers a safe fallback.
- **Privacy Minimization.** Only strictly necessary, summarized context is sent to the LLM. Raw user profile inputs are stripped beforehand.

---

## Google Services Usage

- **Google Cloud Run:** Hosts the unified production Docker container, leveraging scaled-to-zero capabilities for cost-efficiency and quick cold starts.
- **Google Generative AI (Gemini):** Provides the conversational intelligence for the `Footprint Coach` and `Choice Coach` via the `@google/generative-ai` Node SDK.

---

## Quality & Testing Evidence

CarbonCoach takes software quality seriously to ensure deterministic behavior and reliable AI coaching.

- **286 automated tests** using Vitest and React Testing Library.
- **~94.79% statement coverage** overall (with `packages/shared` hitting ~96-100%).
- **Testing Categories:**
  - _Calculator:_ Tested against known factors and zero/extreme edge cases.
  - _Recommendations:_ Ranking logic and duplicate prevention.
  - _Numeric Guard:_ Fails on unsupported units, conflicting texts, and invented savings.
  - _Privacy & Storage:_ Resilient against malformed local storage and version mismatches.
  - _API Contracts:_ Rejects oversized payloads and missing context variables.
  - _Accessibility:_ Validates skip links, ARIA labels, and text equivalents for screen readers.
  - _Regression:_ End-to-end deterministic progression testing (Calculator -> Plan -> Carbon World).

---

## Security Evidence

- **Strict CORS Allowlist:** Configurable origin checks in production.
- **Security Headers:** Strict `X-Content-Type-Options`, `X-Frame-Options`, `Content-Security-Policy`, and `Permissions-Policy`.
- **Payload Limits:** Strict 10kb JSON limits.
- **Safe Error Handling:** Malformed JSON handled silently without leaking stack traces.
- **Environment Validation:** Fail-fast configuration checks on startup.
- **Container Hardening:** Non-root execution (`expressjs` user) and multi-stage builds.
- **No Secrets:** `.env` safely excluded via `.dockerignore` and `.gitignore`.

---

## Accessibility Evidence

Designed inclusively from day zero:

- **Navigation:** Keyboard-friendly routing, prominent skip-to-content links, and semantic ARIA landmarks (`main`, `navigation`).
- **Forms:** Accessible labeling on all onboarding inputs and selects.
- **Carbon World:** Dynamic screen-reader-only labels explaining visual state changes (e.g., differentiating between a "growing grove" and a "thriving grove").
- **Contrast & State:** No reliance on color alone for interactive elements or impact badges.

---

## Quality Gates

To verify the project locally, the following scripts ensure high standards:

```bash
npm run lint
npm run typecheck
npm test
npm run test:coverage
npm run build
npm run docker:build
```

---

## Deployment & Documentation

For complete evaluation context, refer to the [Submission Docs](./docs/submission) directory:

- [Final Score Evidence](./docs/submission/final-score-evidence.md)
- [Prompt Strategy](./docs/submission/prompt-strategy.md)
- [Architecture Summary](./docs/submission/architecture-summary.md)
- [Cloud Run Deployment](./docs/deployment/cloud-run.md)
