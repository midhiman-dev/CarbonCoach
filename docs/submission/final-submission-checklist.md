# Final Submission Checklist

Before submitting the Prompt Wars Virtual Challenge form, verify the following checklist to ensure maximum scoring potential.

## 1. Pre-Submission Verification

- [x] **Live App URL Works:** Ensure the Cloud Run deployment link is active.
- [x] **GitHub Repo Public:** Repository visibility is set to public.
- [x] **README Updated:** The README is not just a setup note, but clearly outlines the product, architecture, safety strategy, and testing evidence.
- [x] **LinkedIn Post Published:** Draft from `linkedin-post-draft.md` is posted and URL is copied for submission.
- [x] **Health Endpoint Works:** Navigate to `/health` on the live URL to ensure it returns 200 OK.

## 2. Core Flows Verification

- [x] **Calculator Flow:** Onboarding completes without crashing.
- [x] **Coach Flow:** Clicking "Explain my footprint" returns a valid Gemini response (or deterministic fallback if keys are omitted).
- [x] **Tracker Flow:** Weekly actions can be checked off, and progress updates locally.
- [x] **Carbon World Flow:** Completing actions visibly changes the environment state.
- [x] **Accessibility Smoke Check:** Navigate the app using only the `Tab` and `Enter` keys. Ensure the screen reader text updates for Carbon World.

## 3. Engineering & Security Verification

- [x] **Verification Commands Pass:** `npm run lint`, `npm run typecheck`, `npm run test:coverage`, and `npm run build` are entirely green.
- [x] **No Secrets Committed:** Double-check that `.env` is absent from GitHub.
- [x] **`.env.example` Present:** Ensure instructions exist for evaluators to run locally.
- [x] **Docker Build Verified:** `npm run docker:build` executes a clean multi-stage build locally (if Docker is installed).
- [x] **No Unsupported Claims:** The documentation correctly identifies that real social accounts and databases are _not_ used in this P0 submission.

## 4. Final Polish

- [x] **Remove Placeholders:** Replace live URL and GitHub repo links in `README.md` and `linkedin-post-draft.md` before finalizing.

## Final Verification Values

Final commit:
Deployed URL: https://carboncoach-192872123770.asia-south1.run.app/
Submission time:
Reviewer:
