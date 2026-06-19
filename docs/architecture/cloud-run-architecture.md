# Cloud Run Architecture

CarbonCoach is designed as a single container application optimized for Google Cloud Run. This architecture balances simplicity, cold-start performance, and security.

## Architecture Diagram (Logical Flow)

```text
[ Browser / Client ]
      |
      | (HTTPS)
      v
[ Google Cloud Run (carboncoach-service) ]
      |
      +-- Express Static Server (React/Vite Web App)
      |
      +-- Express API Router (/api/*)
            |
            +-- Environment Validation & Security Middlewares (CORS, CSP)
            |
            +-- Payload validation (10kb limit)
            |
            +-- Shared deterministic logic (@carboncoach/shared)
            |
            +-- Google Generative AI (Gemini) SDK -> [External Google APIs]
```

## Security Boundaries & Hardening

1. **Static Files & Routing:**
   The `apps/web/dist` output is served as static files. Non-API requests fall back to `index.html` to allow React Router to handle client-side routing. This removes the need for a separate CDN or bucket in P0/P3, reducing infrastructure complexity.
2. **API & Environment Validation:**
   The backend API validates configuration (e.g. `GEMINI_API_KEY`) at startup to "fail-fast" and prevent runtime exceptions deep in the system.
3. **Security Headers:**
   `X-Content-Type-Options`, `X-Frame-Options`, and `Content-Security-Policy` are manually applied to all requests to harden the browser context against XSS and clickjacking.
4. **CORS Hardening:**
   A strict CORS middleware verifies the `Origin` header against an allowlist environment variable (`ALLOWED_ORIGINS`). This is especially critical since Cloud Run exposes a public endpoint.
5. **Payload Limits & Error Handling:**
   JSON parsing is strictly limited to 10kb. A global error handler catches malformed JSON and throws standard `400 Bad Request` messages without leaking stack traces.
6. **Docker Hardening:**
   The production image uses a multi-stage build, omitting devDependencies and running the Express server as a non-root user (`expressjs`).

## Interaction with LLMs
All LLM integration is server-side. The client never sees the Gemini API key. The backend constructs strict prompts using data supplied by the `@carboncoach/shared` packages, makes the API call to Google, runs the `Numeric Invention Guard`, and only passes safe, validated JSON back to the client. If any step fails (timeout, missing key, validation failure), the backend falls back to deterministic rule-based responses.
