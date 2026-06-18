import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AssumptionsPage } from './AssumptionsPage';
import { assumptionsCopy } from './assumptionsCopy';

describe('AssumptionsPage Component', () => {
  it('renders title, subtitle, and approximate estimate disclaimer', () => {
    render(<AssumptionsPage />);

    expect(screen.getByText(assumptionsCopy.title)).toBeInTheDocument();
    expect(screen.getByText(assumptionsCopy.subtitle)).toBeInTheDocument();
    expect(screen.getAllByText(/approximate estimates/i)[0]).toBeInTheDocument();
    expect(screen.getByText(/coefficients and general average indices/i)).toBeInTheDocument();
  });

  it('explains what CarbonCoach does not claim', () => {
    render(<AssumptionsPage />);

    expect(screen.getByText(assumptionsCopy.boundaries.title)).toBeInTheDocument();
    expect(screen.getByText(/not a certified carbon accounting tool/i)).toBeInTheDocument();
    expect(screen.getByText(/not treat tracker completion as proof/i)).toBeInTheDocument();
  });

  it('explains details for key sections including AI role and Carbon World', () => {
    render(<AssumptionsPage />);

    // Transport
    expect(screen.getByText('Transport')).toBeInTheDocument();
    expect(screen.getByText(/commuting carbon impact/i)).toBeInTheDocument();

    // AI role
    expect(screen.getByText('AI Coach Role')).toBeInTheDocument();
    expect(
      screen.getByText(/AI reads deterministic values and provides conversational summaries/i),
    ).toBeInTheDocument();

    // Carbon World
    expect(screen.getByText('Carbon World')).toBeInTheDocument();
    expect(screen.getByText(/visual progress landscape/i)).toBeInTheDocument();
  });

  it('avoids forbidden/risky claims and mixed-language issues', () => {
    render(<AssumptionsPage />);

    const htmlContent = document.body.innerHTML;

    // Verify it doesn't contain forbidden terms
    const forbidden = [
      'audited',
      'certified reduction',
      'verified emissions',
      'kg avoided',
      'emissions saved',
      'reduced emissions',
      'saves ₹',
      'saves $',
    ];

    forbidden.forEach((word) => {
      expect(htmlContent.toLowerCase()).not.toContain(word);
    });

    // Verify it doesn't contain accidental mixed-language header or characters
    expect(htmlContent).not.toContain('透明');
  });
});
