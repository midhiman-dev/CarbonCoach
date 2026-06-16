import React, { useState, useEffect } from 'react';
import { CarbonProfile } from '@carboncoach/shared';
import { Card, Input, Select, Button } from '../../components/ui';
import { defaultProfile } from './profileDefaults';
import { validateProfile, ProfileErrors } from './profileValidation';
import { profileCopy } from './profileCopy';

interface ProfileOnboardingProps {
  savedProfile: CarbonProfile | null;
  onSaveProfile: (profile: CarbonProfile) => void;
  onClearProfile: () => void;
}

export const ProfileOnboarding: React.FC<ProfileOnboardingProps> = ({
  savedProfile,
  onSaveProfile,
  onClearProfile,
}) => {
  const [formData, setFormData] = useState<Partial<CarbonProfile>>(
    () => savedProfile || { ...defaultProfile },
  );
  const [errors, setErrors] = useState<ProfileErrors>({});
  const [isSubmitted, setIsSubmitted] = useState<boolean>(!!savedProfile);

  // Sync state if savedProfile changes
  useEffect(() => {
    if (savedProfile) {
      setFormData(savedProfile);
      setIsSubmitted(true);
    } else {
      setFormData({ ...defaultProfile });
      setIsSubmitted(false);
    }
    setErrors({});
  }, [savedProfile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    let parsedValue: string | number = value;

    if (type === 'number') {
      parsedValue = value === '' ? '' : Number(value);
    }

    setFormData((prev) => ({
      ...prev,
      [name]: parsedValue,
    }));

    // Clear error for field on change
    if (errors[name as keyof ProfileErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validateProfile(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      // Focus the first error element if possible
      const firstErrorKey = Object.keys(validationErrors)[0];
      const errorElement = document.getElementById(firstErrorKey);
      if (errorElement) {
        errorElement.focus();
      }
      return;
    }

    onSaveProfile(formData as CarbonProfile);
    setIsSubmitted(true);
  };

  const handleReset = () => {
    setFormData({ ...defaultProfile });
    setErrors({});
  };

  const handleClear = () => {
    onClearProfile();
    setFormData({ ...defaultProfile });
    setErrors({});
    setIsSubmitted(false);
  };

  const handleEdit = () => {
    setIsSubmitted(false);
  };

  if (isSubmitted && savedProfile) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
        <Card title={profileCopy.success.title} className="success-card">
          <div
            style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}
            role="region"
            aria-label="Profile summary"
          >
            <p style={{ color: 'var(--color-accent)', fontWeight: 'bold' }} aria-live="polite">
              {profileCopy.success.summary}
            </p>

            <div
              style={{
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid var(--border-glass)',
                padding: 'var(--spacing-md)',
                borderRadius: 'var(--radius-sm)',
              }}
            >
              <h3 style={{ marginBottom: 'var(--spacing-sm)', fontSize: 'var(--font-md)' }}>
                Your Lifestyle Profile Details:
              </h3>
              <ul
                style={{
                  listStyle: 'none',
                  padding: 0,
                  margin: 0,
                  display: 'grid',
                  gap: 'var(--spacing-xs)',
                }}
              >
                <li>
                  <strong>Commute:</strong>{' '}
                  {profileCopy.options.commuteMode.find((o) => o.value === savedProfile.commuteMode)
                    ?.label || savedProfile.commuteMode}{' '}
                  ({savedProfile.weeklyCommuteKm} km/week)
                </li>
                <li>
                  <strong>Diet:</strong>{' '}
                  {profileCopy.options.dietPattern.find((o) => o.value === savedProfile.dietPattern)
                    ?.label || savedProfile.dietPattern}
                </li>
                <li>
                  <strong>Home Energy:</strong>{' '}
                  {savedProfile.monthlyHomeEnergyKwh
                    ? `${savedProfile.monthlyHomeEnergyKwh} kWh/month`
                    : 'Not specified'}{' '}
                  (
                  {savedProfile.householdSize ? `${savedProfile.householdSize} people` : '1 person'}
                  )
                </li>
                <li>
                  <strong>Shopping & Deliveries:</strong>{' '}
                  {profileCopy.options.shoppingFrequency.find(
                    (o) => o.value === savedProfile.shoppingFrequency,
                  )?.label || savedProfile.shoppingFrequency}{' '}
                  ({savedProfile.deliveriesPerWeek} deliveries/week)
                </li>
                <li>
                  <strong>Flights:</strong> {savedProfile.flightsPerYear} flights/year
                </li>
                <li>
                  <strong>Coaching Priority:</strong>{' '}
                  {profileCopy.options.preference.find((o) => o.value === savedProfile.preference)
                    ?.label || savedProfile.preference}
                </li>
              </ul>
            </div>

            <p
              style={{
                fontStyle: 'italic',
                fontSize: 'var(--font-sm)',
                color: 'var(--text-muted)',
              }}
            >
              {profileCopy.success.placeholderNextStep}
            </p>

            <div style={{ display: 'flex', gap: 'var(--spacing-sm)', flexWrap: 'wrap' }}>
              <Button onClick={handleEdit} variant="primary">
                {profileCopy.buttons.edit}
              </Button>
              <Button onClick={handleClear} variant="danger">
                Clear Profile Data
              </Button>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
      <Card title={profileCopy.title}>
        <p style={{ color: 'var(--text-muted)', marginBottom: 'var(--spacing-md)' }}>
          {profileCopy.description}
        </p>

        <form onSubmit={handleSubmit} noValidate>
          {/* Transport Section */}
          <fieldset style={{ border: 'none', padding: 0, margin: `0 0 var(--spacing-lg) 0` }}>
            <legend
              style={{
                fontSize: 'var(--font-lg)',
                fontWeight: 'bold',
                marginBottom: 'var(--spacing-md)',
                borderBottom: '1px solid var(--border-glass)',
                width: '100%',
                paddingBottom: 'var(--spacing-xs)',
                color: 'var(--text-primary)',
              }}
            >
              {profileCopy.sections.transport.title}
            </legend>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
              <Select
                id="commuteMode"
                name="commuteMode"
                label={profileCopy.sections.transport.commuteModeLabel}
                helperText={profileCopy.sections.transport.commuteModeHelper}
                value={formData.commuteMode || ''}
                onChange={handleChange}
                options={[
                  { value: '', label: 'Select commute mode...' },
                  ...profileCopy.options.commuteMode,
                ]}
                error={errors.commuteMode}
                required
              />
              <Input
                id="weeklyCommuteKm"
                name="weeklyCommuteKm"
                type="number"
                label={profileCopy.sections.transport.weeklyCommuteKmLabel}
                helperText={profileCopy.sections.transport.weeklyCommuteKmHelper}
                value={formData.weeklyCommuteKm === undefined ? '' : formData.weeklyCommuteKm}
                onChange={handleChange}
                error={errors.weeklyCommuteKm}
                min="0"
                required
              />
            </div>
          </fieldset>

          {/* Food Section */}
          <fieldset style={{ border: 'none', padding: 0, margin: `0 0 var(--spacing-lg) 0` }}>
            <legend
              style={{
                fontSize: 'var(--font-lg)',
                fontWeight: 'bold',
                marginBottom: 'var(--spacing-md)',
                borderBottom: '1px solid var(--border-glass)',
                width: '100%',
                paddingBottom: 'var(--spacing-xs)',
                color: 'var(--text-primary)',
              }}
            >
              {profileCopy.sections.food.title}
            </legend>
            <Select
              id="dietPattern"
              name="dietPattern"
              label={profileCopy.sections.food.dietPatternLabel}
              helperText={profileCopy.sections.food.dietPatternHelper}
              value={formData.dietPattern || ''}
              onChange={handleChange}
              options={[
                { value: '', label: 'Select diet pattern...' },
                ...profileCopy.options.dietPattern,
              ]}
              error={errors.dietPattern}
              required
            />
          </fieldset>

          {/* Home Energy Section */}
          <fieldset style={{ border: 'none', padding: 0, margin: `0 0 var(--spacing-lg) 0` }}>
            <legend
              style={{
                fontSize: 'var(--font-lg)',
                fontWeight: 'bold',
                marginBottom: 'var(--spacing-md)',
                borderBottom: '1px solid var(--border-glass)',
                width: '100%',
                paddingBottom: 'var(--spacing-xs)',
                color: 'var(--text-primary)',
              }}
            >
              {profileCopy.sections.homeEnergy.title}
            </legend>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
              <Input
                id="monthlyHomeEnergyKwh"
                name="monthlyHomeEnergyKwh"
                type="number"
                label={profileCopy.sections.homeEnergy.monthlyHomeEnergyKwhLabel}
                helperText={profileCopy.sections.homeEnergy.monthlyHomeEnergyKwhHelper}
                value={
                  formData.monthlyHomeEnergyKwh === undefined ? '' : formData.monthlyHomeEnergyKwh
                }
                onChange={handleChange}
                error={errors.monthlyHomeEnergyKwh}
                min="0"
              />
              <Input
                id="householdSize"
                name="householdSize"
                type="number"
                label={profileCopy.sections.homeEnergy.householdSizeLabel}
                helperText={profileCopy.sections.homeEnergy.householdSizeHelper}
                value={formData.householdSize === undefined ? '' : formData.householdSize}
                onChange={handleChange}
                error={errors.householdSize}
                min="1"
              />
            </div>
          </fieldset>

          {/* Shopping & Deliveries Section */}
          <fieldset style={{ border: 'none', padding: 0, margin: `0 0 var(--spacing-lg) 0` }}>
            <legend
              style={{
                fontSize: 'var(--font-lg)',
                fontWeight: 'bold',
                marginBottom: 'var(--spacing-md)',
                borderBottom: '1px solid var(--border-glass)',
                width: '100%',
                paddingBottom: 'var(--spacing-xs)',
                color: 'var(--text-primary)',
              }}
            >
              {profileCopy.sections.shopping.title}
            </legend>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
              <Select
                id="shoppingFrequency"
                name="shoppingFrequency"
                label={profileCopy.sections.shopping.shoppingFrequencyLabel}
                helperText={profileCopy.sections.shopping.shoppingFrequencyHelper}
                value={formData.shoppingFrequency || ''}
                onChange={handleChange}
                options={[
                  { value: '', label: 'Select shopping frequency...' },
                  ...profileCopy.options.shoppingFrequency,
                ]}
                error={errors.shoppingFrequency}
                required
              />
              <Input
                id="deliveriesPerWeek"
                name="deliveriesPerWeek"
                type="number"
                label={profileCopy.sections.shopping.deliveriesPerWeekLabel}
                helperText={profileCopy.sections.shopping.deliveriesPerWeekHelper}
                value={formData.deliveriesPerWeek === undefined ? '' : formData.deliveriesPerWeek}
                onChange={handleChange}
                error={errors.deliveriesPerWeek}
                min="0"
                required
              />
            </div>
          </fieldset>

          {/* Flights Section */}
          <fieldset style={{ border: 'none', padding: 0, margin: `0 0 var(--spacing-lg) 0` }}>
            <legend
              style={{
                fontSize: 'var(--font-lg)',
                fontWeight: 'bold',
                marginBottom: 'var(--spacing-md)',
                borderBottom: '1px solid var(--border-glass)',
                width: '100%',
                paddingBottom: 'var(--spacing-xs)',
                color: 'var(--text-primary)',
              }}
            >
              {profileCopy.sections.flights.title}
            </legend>
            <Input
              id="flightsPerYear"
              name="flightsPerYear"
              type="number"
              label={profileCopy.sections.flights.flightsPerYearLabel}
              helperText={profileCopy.sections.flights.flightsPerYearHelper}
              value={formData.flightsPerYear === undefined ? '' : formData.flightsPerYear}
              onChange={handleChange}
              error={errors.flightsPerYear}
              min="0"
              required
            />
          </fieldset>

          {/* Coaching Preference Section */}
          <fieldset style={{ border: 'none', padding: 0, margin: `0 0 var(--spacing-lg) 0` }}>
            <legend
              style={{
                fontSize: 'var(--font-lg)',
                fontWeight: 'bold',
                marginBottom: 'var(--spacing-md)',
                borderBottom: '1px solid var(--border-glass)',
                width: '100%',
                paddingBottom: 'var(--spacing-xs)',
                color: 'var(--text-primary)',
              }}
            >
              {profileCopy.sections.preference.title}
            </legend>
            <Select
              id="preference"
              name="preference"
              label={profileCopy.sections.preference.priorityLabel}
              helperText={profileCopy.sections.preference.priorityHelper}
              value={formData.preference || ''}
              onChange={handleChange}
              options={[
                { value: '', label: 'Select priority...' },
                ...profileCopy.options.preference,
              ]}
              error={errors.preference}
              required
            />
          </fieldset>

          {/* Form Actions */}
          <div
            style={{
              display: 'flex',
              gap: 'var(--spacing-sm)',
              marginTop: 'var(--spacing-xl)',
              flexWrap: 'wrap',
            }}
          >
            <Button type="submit" variant="primary">
              {profileCopy.buttons.submit}
            </Button>
            <Button type="button" variant="secondary" onClick={handleReset}>
              {profileCopy.buttons.reset}
            </Button>
            {savedProfile && (
              <Button type="button" variant="danger" onClick={handleClear}>
                Clear Data
              </Button>
            )}
          </div>
        </form>
      </Card>
    </div>
  );
};
