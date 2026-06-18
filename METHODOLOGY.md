# Methodology

Methodology version: MVP v1  
Last reviewed: June 2026

This document details the calculations, assumptions, and principles behind CarbonCoach.

## Purpose & Positioning

CarbonCoach is an **educational and awareness-building platform**. It is designed to help individuals understand relative impacts, identify primary contributors to their footprint, and build sustainable habits.

**It is not a formal carbon accounting platform.** All estimates and impact bands are directional and represent approximate values rather than exact measurements.

## Core Calculators & Determinism

### Deterministic Calculation Engine

All numeric values, category breakdowns, and impact classifications are calculated using a deterministic, rule-based TypeScript engine located in the shared package.

- **AI Explains, It Does Not Calculate:** Gemini is used only to explain deterministic outputs. Coach prompts prohibit new calculations, and response validation plus Numeric Guard reject unsupported generated numbers before they are shown.
- **Demonstration Emission Factors:** These factors are simplified demonstration assumptions intended to represent broad lifestyle patterns rather than location-specific measurements.
- **Approximate Estimates:** All calculations are presented with clear "approximate estimate" badges to reinforce that they are not precise scientific measurements.

### Daily Choice Lab Impact Bands

Everyday choices in the Daily Choice Lab are compared using simplified impact bands (e.g., Low, Moderate, High impact) rather than precise, single-value emissions. These bands reflect relative differences based on standard travel, food, and delivery averages.

## Weekly Action Tracker & Carbon World

### Weekly Tracker Limitations

- **No Verified Reductions:** Completing an action on the tracker is a self-reported behavior. Tracker completion is not proof of carbon reduction.
- **Progress Tracking Only:** The tracker calculates completion rates (e.g., _2 of 3 actions complete_) to build habit awareness. It does not output "emissions saved" or "kg avoided" figures.

### Carbon World Metaphor

The Carbon World is a purely symbolic, lightweight visual representation (using SVG and CSS) of the user's weekly tracker progress.

- **Visual progress stages:** The visual scene changes across deterministic progress stages based on weekly action-completion thresholds.
- **Carbon World visualizes action progress only:** It does not represent actual, verified carbon offsets or carbon offset planting.

## Factor Traceability

CarbonCoach keeps its demonstration factors and assumption metadata in the shared codebase. The in-app Estimates & Assumptions page exposes the calculation boundaries and relevant coefficients for transparency.

The current registry is designed for demonstration and awareness. It should not be treated as an official emissions-factor database or used for regulatory, financial, or assurance purposes.

## Methodological Boundaries & Non-Claims

CarbonCoach explicitly does **not** claim:

- Certified carbon footprints or offsets.
- Guaranteed financial or carbon savings.
- Official inventory reports complying with GHG Protocol or ISO standards.
- Comprehensive lifecycle analysis (LCA) for everyday items.
- Scientific exactness; all data represent approximate estimates.
