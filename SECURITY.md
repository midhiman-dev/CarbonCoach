# Security Model

This document outlines the security architecture, data handling practices, and security boundaries of the CarbonCoach prototype.

## Prototype Scope

CarbonCoach is designed as a client-side, local-first awareness tool. It does not handle commercial-scale transactions, corporate accounting, or sensitive personally identifiable information (PII).

## Data Storage & Boundaries

### Local-First Storage

- **No Accounts or Logins:** The application does not support user accounts, passwords, or authentication profiles.
- **Local Browser Storage:** All lifestyle choices, profile inputs, and tracker history are saved exclusively in your browser's local storage (`localStorage`). No user database is maintained on the backend.
- **Data Control:** Users have full control over their data. Clicking "Clear my data" immediately purges all stored state from the local browser storage.

### Server-Side API Communication

The backend API (`/api/coach`) is called only when the user explicitly triggers an AI coaching feature (e.g., requesting a footprint summary explanation or choice comparison).

- **Minimal Structured Context:** The request payload sent to the backend is stripped of personal data. Only high-level calculated totals (e.g., category monthly carbon estimates) and preference flags are transmitted. No detailed history or raw lifestyle text is uploaded.
- **Server-Side API Key Protection:** The Gemini API key is stored and accessed strictly server-side using server-side runtime environment variables. No frontend code has access to the API key, and `VITE_GEMINI_API_KEY` is not used.
- **No Logging of Raw Data:** The application is designed not to log full prompts, minimized request contexts, or raw coach responses. Operational logs are limited to request mode, outcome category, duration, timeout status, and guard-validation status.

## AI Safety & Numeric Guard

- **Structured request and response validation:** Every coach request and response is checked using structured validation before it is processed or displayed.
- **Numeric Invention Guard:** The backend validates LLM responses to ensure they do not invent any unsupported metrics or figures. If an invalid number is detected, the backend discards the model response and returns a deterministic rule-based fallback response.
- **Timeout & Fallback Resilience:** All LLM calls are bounded by a strict timeout (7 seconds). If the model fails, times out, or returns a malformed response, the client displays a deterministic rule-based fallback response.

## Security Limitations

- **Local Physical Access:** Since data is stored in the browser's local storage, anyone with physical or administrative access to the user's device and browser can view the saved profile.
- **Prototype Scope:** CarbonCoach is an awareness application and does not provide official compliance, verification, or certified security assurances.

## Reporting Issues

If you discover a potential vulnerability or configuration issue, please open a non-sensitive repository issue or contact the repository owner through the GitHub profile. Do not include secrets, API keys, or personal data in public issues.
