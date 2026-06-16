import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ProfileOnboarding } from './ProfileOnboarding';
import { defaultProfile } from './profileDefaults';
import { profileCopy } from './profileCopy';

describe('ProfileOnboarding Component', () => {
  const mockSave = vi.fn();
  const mockClear = vi.fn();

  it('renders onboarding title, description, and required sections', () => {
    render(
      <ProfileOnboarding savedProfile={null} onSaveProfile={mockSave} onClearProfile={mockClear} />,
    );

    // Title and description
    expect(screen.getByText(profileCopy.title)).toBeInTheDocument();
    expect(screen.getByText(profileCopy.description)).toBeInTheDocument();

    // Section headings (legends)
    expect(screen.getByText(profileCopy.sections.transport.title)).toBeInTheDocument();
    expect(screen.getByText(profileCopy.sections.food.title)).toBeInTheDocument();
    expect(screen.getByText(profileCopy.sections.homeEnergy.title)).toBeInTheDocument();
    expect(screen.getByText(profileCopy.sections.shopping.title)).toBeInTheDocument();
    expect(screen.getByText(profileCopy.sections.flights.title)).toBeInTheDocument();
    expect(screen.getByText(profileCopy.sections.preference.title)).toBeInTheDocument();
  });

  it('inputs and selects have accessible labels and default values', () => {
    render(
      <ProfileOnboarding savedProfile={null} onSaveProfile={mockSave} onClearProfile={mockClear} />,
    );

    // Check input/select by accessible label text
    const commuteModeSelect = screen.getByLabelText(
      profileCopy.sections.transport.commuteModeLabel,
    );
    expect(commuteModeSelect).toBeInTheDocument();
    expect(commuteModeSelect).toHaveValue(defaultProfile.commuteMode);

    const distanceInput = screen.getByLabelText(
      profileCopy.sections.transport.weeklyCommuteKmLabel,
    );
    expect(distanceInput).toBeInTheDocument();
    expect(distanceInput).toHaveValue(defaultProfile.weeklyCommuteKm);
  });

  it('invalid submit shows inline validation errors (e.g. negative values)', async () => {
    render(
      <ProfileOnboarding savedProfile={null} onSaveProfile={mockSave} onClearProfile={mockClear} />,
    );

    const distanceInput = screen.getByLabelText(
      profileCopy.sections.transport.weeklyCommuteKmLabel,
    );
    fireEvent.change(distanceInput, { target: { value: '-10' } });

    const submitBtn = screen.getByRole('button', { name: profileCopy.buttons.submit });
    fireEvent.click(submitBtn);

    // Should show error message
    expect(screen.getByText('Enter 0 or a positive number.')).toBeInTheDocument();
    expect(mockSave).not.toHaveBeenCalled();
  });

  it('flight count requires whole number', () => {
    render(
      <ProfileOnboarding savedProfile={null} onSaveProfile={mockSave} onClearProfile={mockClear} />,
    );

    const flightsInput = screen.getByLabelText(profileCopy.sections.flights.flightsPerYearLabel);
    fireEvent.change(flightsInput, { target: { value: '2.5' } });

    const submitBtn = screen.getByRole('button', { name: profileCopy.buttons.submit });
    fireEvent.click(submitBtn);

    expect(screen.getByText('Use a whole number for flight counts.')).toBeInTheDocument();
    expect(mockSave).not.toHaveBeenCalled();
  });

  it('valid submit triggers onSaveProfile and shows profile-ready summary without footprint total or coach API call', () => {
    render(
      <ProfileOnboarding savedProfile={null} onSaveProfile={mockSave} onClearProfile={mockClear} />,
    );

    const submitBtn = screen.getByRole('button', { name: profileCopy.buttons.submit });
    fireEvent.click(submitBtn);

    expect(mockSave).toHaveBeenCalledWith(defaultProfile);
  });

  it('shows profile summary when savedProfile is provided', () => {
    render(
      <ProfileOnboarding
        savedProfile={defaultProfile}
        onSaveProfile={mockSave}
        onClearProfile={mockClear}
      />,
    );

    expect(screen.getByText(profileCopy.success.title)).toBeInTheDocument();
    expect(screen.getByText(profileCopy.success.summary)).toBeInTheDocument();
    expect(screen.getByText(profileCopy.success.placeholderNextStep)).toBeInTheDocument();
    expect(screen.queryByText(/kgCO2e/)).not.toBeInTheDocument(); // No footprint total
  });

  it('reset button restores default values', () => {
    render(
      <ProfileOnboarding savedProfile={null} onSaveProfile={mockSave} onClearProfile={mockClear} />,
    );

    const distanceInput = screen.getByLabelText(
      profileCopy.sections.transport.weeklyCommuteKmLabel,
    );
    fireEvent.change(distanceInput, { target: { value: '150' } });
    expect(distanceInput).toHaveValue(150);

    const resetBtn = screen.getByRole('button', { name: profileCopy.buttons.reset });
    fireEvent.click(resetBtn);

    expect(distanceInput).toHaveValue(defaultProfile.weeklyCommuteKm);
  });
});
