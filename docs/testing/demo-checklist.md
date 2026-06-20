# Manual Demo Verification Checklist

This checklist guides manual validation of the CarbonCoach application to ensure all features function as expected under both normal and fallback conditions.

## Verification Steps

### 1. App Deployment & Initial Load

- [ ] **Access Page:** Visit the root URL of the deployment (or `http://localhost:5173` locally).
- [ ] **Page Assets:** Confirm the application shell renders successfully with custom typography, clean dark mode styles, and responsive layouts.
- [ ] **Data Check:** Verify that no console errors are present on the initial load.

### 2. Onboarding Flow

- [ ] **Lifestyle Selection:** Complete the onboarding form by filling out:
  - Commute mode & weekly distance
  - Diet pattern
  - Home energy estimate
  - Shopping frequency
  - Flights per year
  - Preference mode (e.g., Save Money, Low Effort, Highest Impact, Balanced)
- [ ] **Form Validation:** Verify that validation handles invalid inputs gracefully and prevents moving forward with empty values.
- [ ] **Navigation:** Complete the onboarding flow and verify redirection to the Footprint Dashboard.

### 3. Carbon Calculator Dashboard

- [ ] **Total Footprint:** Verify the calculated total footprint is displayed prominently as an approximate estimate.
- [ ] **Category Breakdown:** Verify the breakdown of emissions across Transport, Food, Home Energy, Shopping, and Flights is displayed.
- [ ] **Visual Elements:** Confirm that category contributors are visually distinguished and assumptions/confidence notes are clearly visible.

### 4. Footprint & Choice Coach (AI & Fallback)

- [ ] **Request Trigger:** Click the "Explain my footprint" button to trigger the coach request.
- [ ] **API Call Verification:** Confirm the backend receives a `POST /api/coach` request with the appropriate request payload.
- [ ] **Gemini Success Response:** Verify that if the API key is active, Gemini returns a non-judgmental, structured response conforming to the schema.
- [ ] **Numeric Invention Guard:** Confirm that no numbers outside of the structured context are displayed.
- [ ] **Graceful Fallback:** Test by disabling or omitting the `GEMINI_API_KEY` (or forcing a timeout). Verify the app shows the polished, deterministic rule-based fallback advice with a disclaimer.

### 5. Daily Choice Lab

- [ ] **Scenarios:** Open the Daily Choice Lab and verify the list of decision scenarios (e.g., cab vs metro, meat vs vegetarian meal).
- [ ] **Context & Bands:** Verify each option displays estimated impact bands and reason labels instead of claiming exact numbers.
- [ ] **Preference Alignment:** Confirm the interface highlights how choices align with the preference selected during onboarding (e.g., "Save Money").
- [ ] **Choice Coach:** Verify that selecting an option and asking for advice triggers the Choice Coach (or its fallback).

### 6. Weekly Action Tracker

- [ ] **Action Plan:** Verify that a weekly plan with small, realistic actions is generated.
- [ ] **Action Toggle:** Check off an action in the checklist and confirm the dashboard calculates avoided emissions.
- [ ] **State Persistence:** Hard refresh the browser and verify the checked actions and avoided impact persist (stored in LocalStorage).
- [ ] **Clear Data:** Click "Clear my data" in the Privacy section and confirm all onboarding and tracker states are reset.

### 7. Carbon World Progress View

- [ ] **Visual State:** Observe the SVG/CSS visual state reflecting current weekly progress (e.g., changes in sky clarity, tree counts, or visual haze).
- [ ] **Text Alternative:** Confirm a clear text equivalent describing Carbon World's current status is visible for screen readers.

### 8. Accessibility Smoke Tests

- [ ] **Keyboard Navigation:** TAB through the onboarding form and main dashboard. Confirm all interactive elements are reachable.
- [ ] **Focus Ring:** Ensure a visible focus indicator outlines the active element.
- [ ] **Interactive Labels:** Verify form inputs have connected `<label>` elements or accessible descriptions.
- [ ] **Screen Reader Support:** Confirm the presence of `aria-live="polite"` on the coach loading and response areas.

### 9. API & Infrastructure Health

- [ ] **Health Endpoint:** Navigate to `/health` on the backend service. Verify it returns a `200 OK` status and confirms backend readiness.
- [ ] **API Payload Safety:** Verify the Express server handles malformed payloads safely without crashing the service.
