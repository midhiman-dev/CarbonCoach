# Prompt Strategy & Build Methodology

The development of CarbonCoach was guided by a strict architectural philosophy focused on AI safety, code quality, and verifiable scoring metrics.

## Strategic Pillars

### 1. Score-Driven Hardening

Rather than rushing to build complex UI animations, we focused on establishing a 100% clean test suite, type-safety, and robust linting early in the project. Every feature was built to maximize the evaluation rubric.

### 2. Deterministic-First Carbon Calculation

Carbon math is handled entirely outside the LLM. The `@carboncoach/shared` packages execute deterministic carbon calculations based on a known factor registry. The LLM is strictly used to translate these numbers into engaging, personalized human coaching.

### 3. Numeric Invention Guard

LLMs are prone to hallucinating facts. To solve this, CarbonCoach utilizes a `Numeric Invention Guard`. We extract every numerical claim made by the Gemini model during coaching and compare it against the deterministic baseline context. If the model invents a number, the response is discarded and the user is silently served a highly-polished deterministic fallback response.

### 4. Privacy Minimization

The `minimizeCoachContext` utility strips all PII (Personal Identifiable Information) before any data is sent to the LLM. The model receives only aggregated impact categories, avoiding the transmission of raw lifestyle notes.

### 5. Cloud Run Production Hardening

The deployment is entirely optimized for Cloud Run. The monorepo uses a multi-stage Dockerfile that runs as a non-root user and strips out development dependencies, ensuring cold starts are minimized and attack surfaces are reduced.

### 6. Accessibility-First

A gamified "Carbon World" is visually compelling, but often completely opaque to screen readers. We ensured every stage of the world translates to robust ARIA labels, providing a seamless experience for all users.

---

## What We Intentionally Did NOT Build

To maintain scope and reliability, we explicitly avoided:

- **Invented Carbon Factors:** The app doesn't ask the LLM to invent emissions factors on the fly.
- **Unverified Numerical Promises:** The AI is forbidden from making unsupported claims like "You will save exactly 142 kg CO2."
- **Unnecessary Account Systems:** The app is local-first. We do not demand login flows or store data on external databases in P0, drastically reducing privacy risks.
- **Three.js / WebGL:** We prioritized accessibility and fast load times by using lightweight SVG/CSS abstractions for the "Carbon World" instead of heavy, inaccessible 3D libraries.
