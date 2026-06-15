# CarbonCoach Architecture Diagrams

## Document Purpose

This document contains architecture diagrams for CarbonCoach.

The diagrams are written in Mermaid so they can render directly in GitHub Markdown.

---

# 1. High-Level System Architecture

```mermaid
flowchart LR
    User[User] --> Web[React/Vite Web App]

    Web --> Shared[packages/shared<br/>Deterministic Domain Logic]
    Web --> LocalStorage[(Local Storage)]

    Web --> API[Cloud Run API<br/>services/api]

    API --> Shared
    API --> Gemini[Gemini API]

    Shared --> Carbon[Carbon Calculator]
    Shared --> Reco[Recommendation Engine]
    Shared --> Choices[Choice Impact Engine]
    Shared --> World[Carbon World Engine]
    Shared --> Guard[Numeric Invention Guard]
    Shared --> Fallback[Fallback Coach]

    API --> Guard
    API --> Fallback

    Web --> UI[Accessible UI<br/>Onboarding · Summary · Choice Lab · Tracker · Carbon World]
```

---

# 2. Repository Architecture

```mermaid
flowchart TD
    Repo[CarbonCoach Repository]

    Repo --> Root[Root Files<br/>AGENTS.md<br/>README.md<br/>implementationplan.md<br/>buildprogresstracker.md]

    Repo --> Apps[apps]
    Repo --> Services[services]
    Repo --> Packages[packages]
    Repo --> Docs[docs]

    Apps --> Web[apps/web<br/>React + Vite UI]

    Services --> API[services/api<br/>Cloud Run Node API]

    Packages --> Shared[packages/shared<br/>Domain Logic]

    Docs --> Arch[architecture]
    Docs --> Deploy[deployment]
    Docs --> Test[testing]
    Docs --> Submit[submission]
    Docs --> Skills[skills]
```

---

# 3. Runtime Request Flow

```mermaid
sequenceDiagram
    participant User
    participant Web as React Web App
    participant Shared as Shared Domain Logic
    participant API as Cloud Run /api/coach
    participant Gemini as Gemini API
    participant Guard as Numeric Guard
    participant Fallback as Fallback Coach

    User->>Web: Complete onboarding
    Web->>Shared: Calculate footprint
    Shared-->>Web: Footprint summary + actions
    Web-->>User: Show summary

    User->>Web: Click "Explain my footprint"
    Web->>API: POST /api/coach footprint_coach
    API->>API: Validate request
    API->>Gemini: Send structured context
    Gemini-->>API: Coach response
    API->>Guard: Validate numbers
    alt Valid response
        API-->>Web: Gemini coach response
    else Invalid or failed response
        API->>Fallback: Compose deterministic fallback
        Fallback-->>API: Fallback response
        API-->>Web: Fallback coach response
    end
    Web-->>User: Show coach result
```

---

# 4. Footprint Coach Flow

```mermaid
flowchart TD
    Profile[User Profile] --> Validate[Validate Profile]
    Validate --> Calculator[Carbon Calculator]
    Calculator --> Summary[Footprint Summary]
    Summary --> Reco[Recommendation Engine]
    Reco --> CoachRequest[Structured Footprint Coach Request]
    CoachRequest --> API[Cloud Run /api/coach]
    API --> Gemini[Gemini Footprint Coach]
    Gemini --> Schema[Schema Validation]
    Schema --> NumberGuard[Numeric Invention Guard]
    NumberGuard --> Decision{Valid?}
    Decision -- Yes --> CoachResponse[Gemini Coach Response]
    Decision -- No --> Fallback[Deterministic Fallback Coach]
    CoachResponse --> UI[Coach Panel]
    Fallback --> UI
```

---

# 5. Choice Coach Flow

```mermaid
flowchart TD
    Scenario[Choice Scenario] --> ChoiceEngine[Choice Impact Engine]
    ChoiceEngine --> Options[Impact Bands + Reasons]
    Options --> Reco[Choice Recommendation]
    Reco --> ChoiceUI[Daily Choice Lab UI]
    ChoiceUI --> UserAction[User clicks Coach me]
    UserAction --> Request[Structured Choice Coach Request]
    Request --> API[Cloud Run /api/coach]
    API --> Gemini[Gemini Choice Coach]
    Gemini --> Schema[Schema Validation]
    Schema --> Guard[Numeric Invention Guard]
    Guard --> Valid{Valid?}
    Valid -- Yes --> Response[Choice Coach Response]
    Valid -- No --> Fallback[Choice Fallback Response]
    Response --> CoachPanel[Choice Coach Panel]
    Fallback --> CoachPanel
```

---

# 6. Deterministic Engine Boundaries

```mermaid
flowchart TB
    subgraph Deterministic["Deterministic Shared Logic"]
        Factors[Emission Factor Registry]
        Calculator[Carbon Calculator]
        Reco[Recommendation Engine]
        Choices[Choice Impact Engine]
        World[Carbon World Engine]
        Tracker[Weekly Progress Logic]
        Guard[Numeric Guard]
        Fallback[Fallback Coach]
    end

    subgraph LLM["LLM Layer"]
        Gemini[Gemini Explanation]
    end

    Factors --> Calculator
    Calculator --> Reco
    Choices --> Reco
    Tracker --> World
    Guard --> Fallback

    Calculator -. structured context .-> Gemini
    Choices -. structured context .-> Gemini
    Reco -. ranked actions .-> Gemini

    Gemini -. explanation only .-> Guard
```

---

# 7. Cloud Run Deployment Architecture

```mermaid
flowchart TD
    Browser[Browser] --> CloudRun[Cloud Run Service]

    CloudRun --> Static[Static Frontend Assets]
    CloudRun --> Health[GET /health]
    CloudRun --> Coach[POST /api/coach]

    Coach --> Validate[Request Validation]
    Validate --> Prompt[Prompt Builder]
    Prompt --> Gemini[Gemini API]
    Gemini --> Parse[Parse Response]
    Parse --> Guard[Numeric Invention Guard]
    Guard --> Valid{Valid?}

    Valid -- Yes --> ReturnLLM[Return Gemini Response]
    Valid -- No --> ReturnFallback[Return Fallback Response]

    Coach --> Timeout{Timeout/Error?}
    Timeout -- Yes --> ReturnFallback

    CloudRun -. server-side env .-> Secret[GEMINI_API_KEY]
```

---

# 8. Local-First Data Flow

```mermaid
flowchart LR
    Web[React Web App] --> Profile[Profile State]
    Web --> Tracker[Tracker State]
    Web --> Cache[Coach Response Cache]

    Profile --> Local[(Local Storage)]
    Tracker --> Local
    Cache --> Local

    Profile --> Shared[Shared Calculator]
    Tracker --> Shared

    Shared --> UI[Summary / Tracker / Carbon World]

    Web --> Clear[Clear My Data]
    Clear --> Local
```

---

# 9. Carbon World Flow

```mermaid
flowchart TD
    Actions[Weekly Actions] --> Completed[Completed Action Count]
    Completed --> Avoided[Deterministic Avoided Impact]
    Avoided --> WorldEngine[Carbon World State Engine]
    WorldEngine --> State[World State]
    State --> Visual[SVG/CSS Visual]
    State --> Text[Accessible Text Summary]
    Visual --> UI[Carbon World Screen]
    Text --> UI
```

---

# 10. Scoring Alignment Diagram

```mermaid
flowchart TD
    CarbonCoach[CarbonCoach Architecture]

    CarbonCoach --> CQ[Code Quality]
    CarbonCoach --> SEC[Security]
    CarbonCoach --> EFF[Efficiency]
    CarbonCoach --> TEST[Testing]
    CarbonCoach --> A11Y[Accessibility]
    CarbonCoach --> ALIGN[Problem Alignment]

    CQ --> CQ1[Monorepo boundaries]
    CQ --> CQ2[Shared deterministic logic]
    CQ --> CQ3[Small UI components]

    SEC --> SEC1[Server-side Gemini key]
    SEC --> SEC2[Numeric guard]
    SEC --> SEC3[Local-first data]

    EFF --> EFF1[Cloud Run min instances 0]
    EFF --> EFF2[User-triggered LLM]
    EFF --> EFF3[No heavy graphics]

    TEST --> TEST1[Calculator tests]
    TEST --> TEST2[LLM fallback tests]
    TEST --> TEST3[A11Y smoke tests]

    A11Y --> A11Y1[Labels and keyboard]
    A11Y --> A11Y2[Non-color-only states]
    A11Y --> A11Y3[Carbon World text equivalent]

    ALIGN --> ALIGN1[Footprint Coach]
    ALIGN --> ALIGN2[Daily Choice Lab]
    ALIGN --> ALIGN3[Carbon World]
```
