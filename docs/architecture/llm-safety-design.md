# CarbonCoach LLM Safety Design

## Document Purpose

This document defines the LLM safety architecture for **CarbonCoach**.

CarbonCoach uses Gemini to provide AI-assisted coaching, but all carbon calculations, impact estimates, recommendation rankings, and progress values are produced by deterministic TypeScript engines.

This document explains:

- why LLM safety matters,
- where LLM inference is allowed,
- where it is not allowed,
- what data can be sent to the LLM,
- how prompts must be constructed,
- how responses must be validated,
- how invented numbers are prevented,
- how fallback behavior works,
- how privacy is protected,
- and how the implementation should be tested.

This file must be read together with:

```text
AGENTS.md
implementationplan.md
docs/architecture/architecture-overview.md
docs/architecture/numeric-invention-guard.md
docs/architecture/cloud-run-architecture.md
docs/deployment/cloud-run-free-tier.md
docs/testing/demo-checklist.md
```

---

# 1. Core LLM Safety Principle

The most important safety principle is:

```text
Deterministic engines decide.
LLMs explain.
```

CarbonCoach uses deterministic TypeScript engines for:

- emission factors,
- carbon footprint calculations,
- category totals,
- top contributor detection,
- action recommendation ranking,
- choice impact bands,
- weekly action plan logic,
- tracker values,
- estimated avoided impact,
- Carbon World state,
- and numeric validation.

The LLM is used only for:

- natural-language explanation,
- simplification,
- coaching tone,
- friendly nudges,
- non-guilt motivation,
- and user-friendly summaries.

The LLM must never become the source of truth for carbon values.

---

# 2. Approved LLM Workflows

CarbonCoach has exactly two approved LLM-assisted workflows for P0.

## 2.1 Footprint Coach

The Footprint Coach explains the user’s calculated footprint.

It may:

- summarize the estimated footprint,
- explain the top contributor,
- describe why a category is high or low,
- suggest where to start,
- adapt to user preference,
- create a short weekly plan,
- and use encouraging, plain-language coaching.

It must not:

- calculate the footprint,
- introduce new emission factors,
- invent new totals,
- invent new reduction estimates,
- contradict deterministic recommendations,
- claim scientific precision,
- or shame the user.

## 2.2 Choice Coach

The Choice Coach explains an everyday decision inside the Daily Choice Lab.

It may:

- compare choice options,
- explain why one option has a lower impact band,
- give a practical nudge,
- adapt to user preference,
- explain trade-offs between effort, cost, and impact,
- and suggest a realistic lower-impact alternative.

It must not:

- invent carbon savings,
- invent distances, calories, emissions, prices, or time values,
- override deterministic impact bands,
- shame the user,
- or recommend unsafe/unrealistic behavior.

---

# 3. Explicitly Disallowed LLM Uses

The LLM must not be used for these P0 responsibilities:

```text
Calculating emission factors
Calculating footprint totals
Calculating category breakdowns
Calculating avoided-emission values
Ranking action fit scores
Assigning impact bands
Updating tracker progress
Generating Carbon World state
Creating hidden product rules
Making scientific claims
Making climate/legal/medical claims
Processing raw sensitive personal data
```

If a future feature appears to need LLM reasoning for one of these areas, it must be reviewed as an architecture change before implementation.

---

# 4. LLM System Boundary

The frontend must never call Gemini directly.

Approved boundary:

```text
apps/web
  ↓
POST /api/coach
  ↓
services/api
  ↓
Gemini API
```

The backend owns:

- API key access,
- request validation,
- prompt construction,
- Gemini call,
- timeout handling,
- response parsing,
- schema validation,
- Numeric Invention Guard,
- fallback activation,
- and safe logging.

The frontend owns:

- rendering the coach request button,
- sending structured coach payloads,
- showing loading state,
- displaying safe coach response,
- displaying fallback state,
- and never exposing provider secrets.

---

# 5. Coach Request Modes

The `/api/coach` endpoint must support explicit modes.

```ts
type CoachMode = 'footprint_coach' | 'choice_coach';
```

No implicit mode detection is allowed in P0.

The request must clearly state whether the user is asking for a Footprint Coach or Choice Coach response.

---

# 6. Shared Coach Response Contract

The exact implementation may evolve, but the coach response must remain structured.

Recommended contract:

```ts
type CoachMode = 'footprint_coach' | 'choice_coach';

type CoachResponseSource = 'gemini' | 'fallback';

interface CoachResponse {
  mode: CoachMode;
  summary: string;
  explanation: string;
  recommendedNextStep: string;
  weeklyPlan: string[];
  numbersUsed: string[];
  confidenceNote: string;
  disclaimer: string;
  source: CoachResponseSource;
}
```

The response must not be displayed to the user until it passes validation.

---

# 7. Allowed Context for LLM

The LLM may receive only minimized structured context.

## 7.1 Footprint Coach Allowed Context

Allowed:

```text
Estimated monthly total
Category breakdown values
Top contributor
Confidence level
Assumption notes
Ranked recommended actions
User preference mode
Allowed numbers list
Tone preference if implemented
```

Example:

```json
{
  "mode": "footprint_coach",
  "footprintSummary": {
    "monthlyTotalKgCO2e": 216,
    "topCategory": "transport",
    "categoryBreakdown": [
      { "category": "transport", "monthlyKgCO2e": 82 },
      { "category": "food", "monthlyKgCO2e": 64 },
      { "category": "homeEnergy", "monthlyKgCO2e": 48 }
    ],
    "confidence": "medium",
    "assumptions": ["Home energy is estimated because exact kWh was not provided."]
  },
  "recommendedActions": [
    {
      "title": "Replace 2 short cab rides per week with metro",
      "impactBand": "medium",
      "estimatedMonthlyReductionKg": 12,
      "effort": "moderate",
      "costEffect": "saves_money"
    }
  ],
  "userPreference": "save_money",
  "allowedNumbers": ["216", "82", "64", "48", "2", "12"]
}
```

## 7.2 Choice Coach Allowed Context

Allowed:

```text
Choice scenario name
Choice options
Impact bands
Deterministic reasons
Recommended option
User preference mode
Allowed numbers list
Tone preference if implemented
```

Example:

```json
{
  "mode": "choice_coach",
  "scenario": "food_delivery",
  "options": [
    {
      "label": "Chicken biryani delivery",
      "impactBand": "high",
      "reasons": ["meat-heavy meal", "delivery distance"]
    },
    {
      "label": "Nearby vegetarian meal",
      "impactBand": "low",
      "reasons": ["plant-forward", "shorter delivery distance"]
    }
  ],
  "recommendedOption": "Nearby vegetarian meal",
  "userPreference": "low_effort",
  "allowedNumbers": []
}
```

---

# 8. Disallowed Context for LLM

Do not send:

```text
Raw full local storage state
Raw full onboarding history
Exact address
Phone number
Email
Income
Employer
Precise location
Health conditions
Unnecessary family details
Long free-text lifestyle notes
Full tracker history when a summary is enough
API keys
Internal debug logs
Hidden scoring notes
```

If a field is not needed to produce a safe coach response, do not send it.

---

# 9. Prompt Construction Rules

Prompts must be constructed server-side in `services/api`.

Every prompt must include these rules:

```text
You are CarbonCoach, a friendly carbon awareness coach.

Use only the structured context provided.
Do not invent numbers.
Do not calculate new carbon totals.
Do not introduce emission factors.
If a number is not provided, use qualitative wording or impact bands.
Say estimates are approximate.
Do not claim scientific precision.
Do not shame or guilt the user.
Do not use political or moralizing language.
Do not ask for sensitive personal data.
Return only valid JSON matching the required response schema.
```

## 9.1 Footprint Coach Prompt Requirements

The prompt must tell Gemini:

- explain the calculated footprint,
- identify the provided top contributor,
- reference only provided category values,
- recommend only from provided recommended actions,
- include a confidence/assumption note,
- keep the tone helpful and realistic.

## 9.2 Choice Coach Prompt Requirements

The prompt must tell Gemini:

- explain the provided choice options,
- respect provided impact bands,
- explain why the recommended option is better,
- use only provided reasons,
- avoid invented savings,
- avoid guilt language,
- suggest a realistic next step.

---

# 10. Response Validation Pipeline

All LLM responses must pass the same safety pipeline.

```text
Gemini raw response
  ↓
Parse JSON
  ↓
Schema validation
  ↓
Required field validation
  ↓
Numeric Invention Guard
  ↓
Safety/tone checks where practical
  ↓
Return response
```

If any stage fails, return deterministic fallback.

---

# 11. Schema Validation Rules

A Gemini response is invalid if:

- it is not valid JSON,
- required fields are missing,
- fields are the wrong type,
- `mode` does not match request mode,
- `weeklyPlan` is not an array,
- `source` is not allowed,
- text fields are empty,
- text fields are excessively long,
- or output includes unsupported structure.

Recommended behavior:

```text
Invalid schema -> fallback response
```

Do not try to display partial unsafe LLM output.

---

# 12. Numeric Invention Guard

The Numeric Invention Guard is mandatory.

It must detect unsupported numbers in the LLM output.

## 12.1 Allowed Numbers

Allowed numbers come from deterministic context.

Examples:

```text
216
82
64
48
12
2
```

## 12.2 Generated Numbers

Generated response text is scanned for numeric values.

If the LLM says:

```text
You can save 40 kg this week.
```

but `40` is not in the allowed numbers list, the response must be rejected.

## 12.3 Number Validation Result

If all generated numbers are in allowed numbers:

```text
Accept response
```

If unsupported numbers appear:

```text
Reject response
Return fallback
```

Detailed design lives in:

```text
docs/architecture/numeric-invention-guard.md
```

---

# 13. Fallback Coach Design

Fallback is part of the core safety architecture, not an afterthought.

Fallback must exist for both modes:

```text
footprint_coach
choice_coach
```

Fallback is used when:

- Gemini key is missing,
- Gemini provider fails,
- Gemini times out,
- Gemini returns malformed output,
- schema validation fails,
- Numeric Invention Guard fails,
- or backend request handling encounters a safe recoverable failure.

## 13.1 Fallback Response Requirements

Fallback response must be:

- helpful,
- friendly,
- non-guilt-based,
- based only on deterministic context,
- clear that values are approximate,
- and marked as `source: "fallback"`.

## 13.2 Fallback UI Copy

The UI may display a small note:

```text
The AI coach is temporarily unavailable, so CarbonCoach is showing a rule-based explanation from your calculated results.
```

Avoid alarming language unless a real user action is needed.

---

# 14. Timeout Design

LLM calls must have a timeout.

Recommended default:

```text
7000 ms
```

If timeout occurs:

```text
Return fallback response
Log fallback reason category: timeout
```

Do not leave the user waiting indefinitely.

Do not retry repeatedly in the same request.

---

# 15. Rate and Cost Safety

To keep Cloud Run and Gemini usage free-tier friendly:

- LLM calls must be user-triggered.
- Do not call LLM on page load.
- Do not call LLM on every form change.
- Do not call LLM on every tracker update.
- Keep prompts short.
- Use local response caching where practical.
- Use fallback when provider is unavailable.
- Optional soft daily limit may be used.

Suggested env var:

```text
LLM_DAILY_SOFT_LIMIT=80
```

The soft limit is not a security boundary, but it shows responsible cost control.

---

# 16. Privacy Design

## 16.1 Local-first default

CarbonCoach does not require login in P0.

User profile and tracker data stay in browser local storage.

## 16.2 Data minimization

Before calling `/api/coach`, the frontend should send only the structured context needed.

The backend should also validate/minimize before building prompts.

## 16.3 Redaction

If free-text fields are introduced later, redact likely:

- emails,
- phone numbers,
- exact addresses,
- and sensitive identifiers.

In P0, avoid free-text fields where possible.

## 16.4 Logging privacy

Backend logs must not include:

```text
full profile
raw prompt
API key
raw private text
full Gemini response with user data
```

Allowed logs:

```text
request mode
duration
fallback reason category
validation failure category
provider availability
```

---

# 17. Security Design

## 17.1 Secrets

Gemini API key must be available only to the backend.

Allowed env var:

```text
GEMINI_API_KEY
```

Forbidden frontend env var:

```text
VITE_GEMINI_API_KEY
```

## 17.2 Safe Errors

API errors must not expose:

- stack traces,
- provider internals,
- API key status details,
- raw prompt,
- raw LLM response,
- internal validation schema.

Return safe error messages.

For normal Gemini failure, prefer fallback rather than error.

## 17.3 Request Validation

Reject invalid `/api/coach` requests with HTTP 400.

Invalid examples:

- unsupported mode,
- missing context,
- invalid category names,
- invalid action list,
- oversized payload,
- malformed allowed numbers list.

---

# 18. UX Safety Rules

## 18.1 No guilt language

Avoid:

```text
You are responsible for high emissions.
You must stop doing this.
This is bad.
```

Prefer:

```text
This is a practical place to start.
A lower-impact option is available.
Small changes can add up over time.
```

## 18.2 No precision overclaiming

Avoid:

```text
This will reduce your footprint by exactly 12.7%.
```

Prefer:

```text
Based on the app's estimate, this may reduce your monthly footprint by about 12 kg CO2e.
```

Only use numeric values supplied in deterministic context.

## 18.3 No shame-based ranking

Do not label users as:

- bad,
- dirty,
- irresponsible,
- high-emission person.

Use neutral category language:

- transport is your top contributor,
- food is a moderate contributor,
- this action is lower effort,
- this option has a lower impact band.

---

# 19. Testing Requirements

## 19.1 Shared Package Tests

Test:

- fallback coach for footprint mode,
- fallback coach for choice mode,
- numeric guard allowed numbers,
- numeric guard unsupported numbers,
- numeric guard no-number responses,
- privacy minimization,
- redaction utilities.

## 19.2 API Tests

Test:

- valid Footprint Coach request,
- valid Choice Coach request,
- missing Gemini key fallback,
- Gemini timeout fallback,
- Gemini malformed JSON fallback,
- Gemini unsupported number fallback,
- invalid request returns 400,
- safe error response.

## 19.3 UI Tests

Test:

- coach button is user-triggered,
- loading state appears,
- fallback response displays,
- coach result displays,
- no coach request on initial page render if practical.

## 19.4 Manual Tests

Add to `docs/testing/demo-checklist.md`:

- Footprint Coach with Gemini configured,
- Footprint Coach fallback without key,
- Choice Coach with Gemini configured,
- Choice Coach fallback without key,
- numeric invention guard rejection scenario if test harness supports it.

---

# 20. Failure Modes and Expected Behavior

## 20.1 Missing Gemini API key

Expected:

```text
Return fallback response.
Do not crash.
Do not expose missing-key details to user.
```

## 20.2 Gemini timeout

Expected:

```text
Return fallback response.
Log timeout category only.
```

## 20.3 Gemini malformed output

Expected:

```text
Reject output.
Return fallback response.
```

## 20.4 Gemini invents unsupported number

Expected:

```text
Numeric guard rejects output.
Return fallback response.
```

## 20.5 Invalid request payload

Expected:

```text
Return safe 400 response.
Do not call Gemini.
```

## 20.6 Network failure from frontend

Expected:

```text
Show fallback or retry-friendly error state.
Do not lose user profile or tracker state.
```

---

# 21. Implementation Locations

Recommended files:

```text
packages/shared/src/assistant/coachTypes.ts
packages/shared/src/assistant/fallbackCoach.ts
packages/shared/src/assistant/numericGuard.ts
packages/shared/src/assistant/coachValidation.ts
packages/shared/src/privacy/minimizeCoachContext.ts

services/api/src/coach/coachRoutes.ts
services/api/src/coach/coachController.ts
services/api/src/coach/promptBuilder.ts
services/api/src/coach/responseParser.ts
services/api/src/llm/llmProvider.ts
services/api/src/llm/geminiProvider.ts
services/api/src/llm/timeout.ts
services/api/src/middleware/validateRequest.ts
services/api/src/middleware/safeLogging.ts

apps/web/src/lib/coachClient.ts
apps/web/src/features/footprint/FootprintCoachPanel.tsx
apps/web/src/features/choice-lab/ChoiceCoachPanel.tsx
```

---

# 22. Acceptance Criteria

The LLM safety design is implemented successfully when:

```text
Footprint Coach works with Gemini.
Choice Coach works with Gemini.
Both coach modes work without Gemini using fallback.
Gemini key is server-side only.
No frontend Gemini key exists.
LLM output is schema-validated.
Unsupported generated numbers are rejected.
Fallback response is useful and user-facing.
No raw sensitive data is logged.
LLM calls are user-triggered.
Tests cover success and failure paths.
README explains LLM role truthfully.
```

---

# 23. Submission Readiness Checklist

Before final submission, verify:

```text
Gemini provider path works.
Fallback path works.
Numeric guard works.
Timeout fallback works.
Malformed response fallback works.
Coach UI clearly handles fallback.
README explains deterministic calculations.
README explains LLM only explains.
Privacy page explains what is sent to Gemini.
No unsupported claims in LinkedIn draft.
No API key in frontend bundle.
```

---

# 24. Final LLM Safety Statement

CarbonCoach uses Gemini to make carbon awareness more understandable and human, but it does not rely on Gemini for truth-critical calculations.

All numeric carbon values are produced by deterministic engines, all LLM output is validated, invented numbers are rejected, and fallback responses keep the deployed app functional even when the LLM is unavailable.

This design makes CarbonCoach genuinely AI-assisted while remaining safe, testable, privacy-conscious, and review-ready.
