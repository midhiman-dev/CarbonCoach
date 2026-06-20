import React from 'react';
import type { CarbonProfile } from '@carboncoach/shared';
import { Card, Input, Select, Button } from '../../components/ui';
import type { ProfileErrors } from './profileValidation';
import { profileCopy } from './profileCopy';

interface ProfileFormProps {
  formData: Partial<CarbonProfile>;
  errors: ProfileErrors;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  onReset: () => void;
  savedProfile: CarbonProfile | null;
  onNavigateToPrivacy?: () => void;
}

const FormSection: React.FC<{ title: string; children: React.ReactNode }> = ({
  title,
  children,
}) => (
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
      {title}
    </legend>
    {children}
  </fieldset>
);

export const ProfileForm: React.FC<ProfileFormProps> = ({
  formData,
  errors,
  onChange,
  onSubmit,
  onReset,
  savedProfile,
  onNavigateToPrivacy,
}) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
      <Card title={profileCopy.title}>
        <p style={{ color: 'var(--text-muted)', marginBottom: 'var(--spacing-md)' }}>
          {profileCopy.description}
        </p>

        <form onSubmit={onSubmit} noValidate>
          {/* Transport Section */}
          <FormSection title={profileCopy.sections.transport.title}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
              <Select
                id="commuteMode"
                name="commuteMode"
                label={profileCopy.sections.transport.commuteModeLabel}
                helperText={profileCopy.sections.transport.commuteModeHelper}
                value={formData.commuteMode || ''}
                onChange={onChange}
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
                onChange={onChange}
                error={errors.weeklyCommuteKm}
                min="0"
                required
              />
            </div>
          </FormSection>

          {/* Food Section */}
          <FormSection title={profileCopy.sections.food.title}>
            <Select
              id="dietPattern"
              name="dietPattern"
              label={profileCopy.sections.food.dietPatternLabel}
              helperText={profileCopy.sections.food.dietPatternHelper}
              value={formData.dietPattern || ''}
              onChange={onChange}
              options={[
                { value: '', label: 'Select diet pattern...' },
                ...profileCopy.options.dietPattern,
              ]}
              error={errors.dietPattern}
              required
            />
          </FormSection>

          {/* Home Energy Section */}
          <FormSection title={profileCopy.sections.homeEnergy.title}>
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
                onChange={onChange}
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
                onChange={onChange}
                error={errors.householdSize}
                min="1"
              />
            </div>
          </FormSection>

          {/* Shopping & Deliveries Section */}
          <FormSection title={profileCopy.sections.shopping.title}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
              <Select
                id="shoppingFrequency"
                name="shoppingFrequency"
                label={profileCopy.sections.shopping.shoppingFrequencyLabel}
                helperText={profileCopy.sections.shopping.shoppingFrequencyHelper}
                value={formData.shoppingFrequency || ''}
                onChange={onChange}
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
                onChange={onChange}
                error={errors.deliveriesPerWeek}
                min="0"
                required
              />
            </div>
          </FormSection>

          {/* Flights Section */}
          <FormSection title={profileCopy.sections.flights.title}>
            <Input
              id="flightsPerYear"
              name="flightsPerYear"
              type="number"
              label={profileCopy.sections.flights.flightsPerYearLabel}
              helperText={profileCopy.sections.flights.flightsPerYearHelper}
              value={formData.flightsPerYear === undefined ? '' : formData.flightsPerYear}
              onChange={onChange}
              error={errors.flightsPerYear}
              min="0"
              required
            />
          </FormSection>

          {/* Coaching Preference Section */}
          <FormSection title={profileCopy.sections.preference.title}>
            <Select
              id="preference"
              name="preference"
              label={profileCopy.sections.preference.priorityLabel}
              helperText={profileCopy.sections.preference.priorityHelper}
              value={formData.preference || ''}
              onChange={onChange}
              options={[
                { value: '', label: 'Select priority...' },
                ...profileCopy.options.preference,
              ]}
              error={errors.preference}
              required
            />
          </FormSection>

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
            <Button type="button" variant="secondary" onClick={onReset}>
              {profileCopy.buttons.reset}
            </Button>
          </div>
          {savedProfile && onNavigateToPrivacy && (
            <div
              style={{
                marginTop: 'var(--spacing-md)',
                fontSize: 'var(--font-xs)',
                color: 'var(--text-muted)',
              }}
            >
              Stored locally in this browser ·{' '}
              <button
                type="button"
                onClick={onNavigateToPrivacy}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--color-accent)',
                  textDecoration: 'underline',
                  cursor: 'pointer',
                  fontSize: 'var(--font-xs)',
                  fontFamily: 'inherit',
                  display: 'inline',
                  padding: 0,
                }}
                aria-label="Manage local data in privacy settings"
              >
                Manage local data
              </button>
            </div>
          )}
        </form>
      </Card>
    </div>
  );
};
