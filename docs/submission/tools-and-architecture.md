# Tools and Architecture

CarbonCoach is designed with a modern, decoupled monorepo architecture that enforces a clean separation of concerns, guarantees local-first reliability, and wraps AI services in deterministic guardrails.

## Technology Stack & Architecture

### 1. Frontend Component (`apps/web`)

- **Framework:** React with TypeScript, scaffolded using **Vite** for fast, optimized builds.
- **Styling:** Custom Vanilla CSS for UI/UX elements, styling tokens, responsive layouts, and fluid transitions.
- **Responsibility:** User interface rendering, interactive state management, local storage persistence, and dispatching requests to `/api/coach`.
- **Zero Direct LLM Access:** The frontend never communicates directly with Gemini or handles API keys.

### 2. Backend Service (`services/api`)

- **Framework:** Node.js with TypeScript and **Express**.
- **Responsibility:** Exposing `/api/coach` (for AI orchestration) and `/health` (for deployment checking).
- **LLM Boundary:** Safely handles credentials (`GEMINI_API_KEY`), builds prompt contexts, enforces timeouts (default 7000ms), and runs the **Numeric Invention Guard** to reject malformed or invented values.
- **Static Assets:** Serves the compiled frontend build natively to minimize Cloud Run overhead.

### 3. Shared Library (`packages/shared`)

- **Responsibility:** The single source of truth for deterministic business rules.
- **Components:**
  - **Carbon Calculator & Emission Registry:** Pure, testable TypeScript formulas for calculating footprints.
  - **Choice Engine:** Deterministic options, impact bands, and recommendations.
  - **Fallback Composer:** Generates high-quality, local rule-based coaching when Gemini is offline or fails validation.
  - **Invention Guard:** Validates LLM responses against allowed request numbers.

### 4. Generative AI Orchestration

- **Model:** Google Gemini (via `@google/genai` or `@google/generative-ai` SDK).
- **Interaction Mode:** Bounded. The backend service formats queries using strict JSON schemas and feeds the LLM minimized, structured context only.
- **Fallback Safeguard:** If the API key is missing, a query times out, or the LLM invents incorrect values, the system gracefully falls back to deterministic rule-based advice.

### 5. Deployment Containerization (`Cloud Run & Docker`)

- **Target:** **Google Cloud Run** for serverless, auto-scaling deployment.
- **Configuration:** Multistage `Dockerfile` compiling all monorepo workspaces and producing a lightweight, secure production image running Node.js.
- **Instance Settings:** Configured for `min instances = 0` to control costs, with a low memory footprint (512 MiB).

---

## Tooling & Infrastructure

### 1. Quality & Format Tooling

- **TypeScript:** Strict type-checking configured across all packages and workspaces to ensure code safety.
- **ESLint:** Enforces code quality, style uniformity, and catches common patterns.
- **Prettier:** Code formatter for consistent style.

### 2. Testing Framework

- **Vitest:** Lightweight and ultra-fast runner used for unit testing shared package logic, API route execution, and frontend rendering behaviors.
- **React Testing Library:** Used to simulate user interaction, onboarding flows, and accessibility verification.
- **Coverage Verification:** Tracked locally using vitest coverage providers to maintain high code path confidence.

### 3. Accessibility & Security Tooling

- **A11y Checks:** Semantic HTML5 design structure, strict focus management, color-contrast checks, and `aria-live` polite regions for dynamic AI results.
- **Security Scans:** Secret detection prevention (via `.gitignore` and `.dockerignore`) and environment validation gates.
