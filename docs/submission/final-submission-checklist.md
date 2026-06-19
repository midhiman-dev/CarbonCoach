# Final Submission Checklist

Before submitting the Prompt Wars Virtual Challenge form, verify the following checklist to ensure maximum scoring potential.

## 1. Pre-Submission Verification

- [ ] **Live App URL Works:** Ensure the Cloud Run deployment link is active.
- [ ] **GitHub Repo Public:** Repository visibility is set to public.
- [ ] **README Updated:** The README is not just a setup note, but clearly outlines the product, architecture, safety strategy, and testing evidence.
- [ ] **LinkedIn Post Published:** Draft from `linkedin-post-draft.md` is posted and URL is copied for submission.
- [ ] **Health Endpoint Works:** Navigate to `/health` on the live URL to ensure it returns 200 OK.

## 2. Core Flows Verification

- [ ] **Calculator Flow:** Onboarding completes without crashing.
- [ ] **Coach Flow:** Clicking "Explain my footprint" returns a valid Gemini response (or deterministic fallback if keys are omitted).
- [ ] **Tracker Flow:** Weekly actions can be checked off, and progress updates locally.
- [ ] **Carbon World Flow:** Completing actions visibly changes the environment state.
- [ ] **Accessibility Smoke Check:** Navigate the app using only the `Tab` and `Enter` keys. Ensure the screen reader text updates for Carbon World.

## 3. Engineering & Security Verification

- [ ] **Verification Commands Pass:** `npm run lint`, `npm run typecheck`, `npm run test:coverage`, and `npm run build` are entirely green.
- [ ] **No Secrets Committed:** Double-check that `.env` is absent from GitHub.
- [ ] **`.env.example` Present:** Ensure instructions exist for evaluators to run locally.
- [ ] **Docker Build Verified:** `npm run docker:build` executes a clean multi-stage build locally (if Docker is installed).
- [ ] **No Unsupported Claims:** The documentation correctly identifies that real social accounts and databases are _not_ used in this P0 submission.

## 4. Final Polish

- [ ] **Remove Placeholders:** Replace `[PLACEHOLDER_LIVE_URL]` and `[PLACEHOLDER_GITHUB_REPO_LINK]` in `README.md` and `linkedin-post-draft.md` before finalizing.
