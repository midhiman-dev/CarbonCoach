# Architecture Summary

CarbonCoach utilizes a unified container architecture optimized for Google Cloud Run. This ensures minimal infrastructure overhead while providing a highly secure boundary around generative AI execution.

## High-Level Request Flow

```mermaid
sequenceDiagram
    participant User
    participant WebApp as React UI (Browser)
    participant API as Express API (Cloud Run)
    participant Engine as @shared Logic
    participant Gemini as Google Gemini

    User->>WebApp: Completes Onboarding
    WebApp->>Engine: calculateFootprint()
    Engine-->>WebApp: Deterministic Numbers

    User->>WebApp: "Explain my footprint"
    WebApp->>API: POST /api/coach

    API->>Engine: minimizeContext() & sanitize()
    API->>Gemini: Strict Prompt + JSON Schema
    Gemini-->>API: LLM Response String

    API->>Engine: numericInventionGuard(response)
    alt LLM response is safe
        API-->>WebApp: Return LLM Coaching
    else LLM response fails validation or timeout
        API->>Engine: generateFallbackCoach()
        API-->>WebApp: Return Deterministic Fallback
    end

    WebApp-->>User: Display Coaching Panel
```

## Security & Deployment Boundaries

- **Single Process / Single Container:** The Cloud Run container serves the static compiled React app natively through Express, removing the need for separate hosting platforms.
- **Server-Side LLM Orchestration:** The browser never possesses the `GEMINI_API_KEY`. The backend constructs prompts securely using bounded contexts.
- **Payload & CORS Enforcement:** The API rejects unverified origins and strictly caps payload sizes at 10kb to prevent abuse or context-flooding.
- **Fail-Fast Environment Validation:** If the application boots without necessary configurations, it crashes gracefully before accepting traffic, simplifying debugging.
