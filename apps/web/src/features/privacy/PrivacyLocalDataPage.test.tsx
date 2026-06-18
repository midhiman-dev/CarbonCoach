import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PrivacyLocalDataPage } from './PrivacyLocalDataPage';
import { privacyCopy } from './privacyCopy';

describe('PrivacyLocalDataPage Component', () => {
  const mockClear = vi.fn();

  it('renders title, subtitle, and key privacy committed principles', () => {
    render(<PrivacyLocalDataPage hasData={true} onClear={mockClear} />);

    expect(screen.getByText(privacyCopy.title)).toBeInTheDocument();
    expect(screen.getByText(privacyCopy.subtitle)).toBeInTheDocument();
    expect(screen.getAllByText(/local-first/i)[0]).toBeInTheDocument();
    expect(screen.getByText(/data minimization/i)).toBeInTheDocument();
  });

  it('explains no accounts, no databases, and local browser storage usage', () => {
    render(<PrivacyLocalDataPage hasData={true} onClear={mockClear} />);

    expect(screen.getByText(privacyCopy.noAccountSection.title)).toBeInTheDocument();
    expect(screen.getByText(/do not require you to sign up/i)).toBeInTheDocument();
    expect(screen.getByText(/no backend database/i)).toBeInTheDocument();
    expect(screen.getByText(/locally inside this browser/i)).toBeInTheDocument();
  });

  it('explains user-triggered coach requests and minimized context sent to backend', () => {
    render(<PrivacyLocalDataPage hasData={true} onClear={mockClear} />);

    expect(screen.getByText(/How the AI Coach Accesses Data/i)).toBeInTheDocument();
    expect(screen.getByText(/User-Triggered Only/i)).toBeInTheDocument();
    expect(screen.getByText(/Minimized Context/i)).toBeInTheDocument();
    expect(screen.getByText(/Transient Processing/i)).toBeInTheDocument();
  });

  it('lists what is never sent to the AI coach', () => {
    render(<PrivacyLocalDataPage hasData={true} onClear={mockClear} />);

    expect(screen.getByText(/What is NEVER sent to the AI Coach:/i)).toBeInTheDocument();
    expect(screen.getByText(/Raw localStorage dumps/i)).toBeInTheDocument();
    expect(screen.getByText(/Browser cookies or history/i)).toBeInTheDocument();
    expect(screen.getByText(/API keys or sensitive tokens/i)).toBeInTheDocument();
  });

  it('renders local data policy items and their storage locations', () => {
    render(<PrivacyLocalDataPage hasData={true} onClear={mockClear} />);

    expect(screen.getByText('Lifestyle Profile')).toBeInTheDocument();
    expect(screen.getByText('Weekly Tracker')).toBeInTheDocument();
    expect(screen.getByText('AI Coach Request')).toBeInTheDocument();
    expect(screen.getAllByText('Browser Local Storage (Device)')[0]).toBeInTheDocument();
  });

  it('renders clear local data control panel', () => {
    render(<PrivacyLocalDataPage hasData={true} onClear={mockClear} />);

    expect(screen.getByText(privacyCopy.clearDataSection.title)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /clear all local data/i })).toBeInTheDocument();
  });

  it('does not claim nothing is ever sent and does not expose API keys', () => {
    render(<PrivacyLocalDataPage hasData={true} onClear={mockClear} />);

    const htmlContent = document.body.innerHTML;
    // Verify it doesn't say "nothing is ever sent" or "never sent to backend" (which is false/risky)
    expect(htmlContent).not.toContain('nothing is ever sent');
    expect(htmlContent).not.toContain('never sent to backend');

    // Verify it doesn't expose any API keys
    expect(htmlContent).not.toContain('VITE_GEMINI_API_KEY');
    expect(htmlContent).not.toContain('GoogleGenerativeAI');
  });
});
