import React from 'react';
import type { CarbonProfile } from '@carboncoach/shared';
import { Card, Button } from '../../components/ui';
import { profileCopy } from './profileCopy';

interface ProfileSuccessViewProps {
  savedProfile: CarbonProfile;
  onEdit: () => void;
  onNavigateToFootprint?: () => void;
  onNavigateToPrivacy?: () => void;
}

export const ProfileSuccessView: React.FC<ProfileSuccessViewProps> = ({
  savedProfile,
  onEdit,
  onNavigateToFootprint,
  onNavigateToPrivacy,
}) => {
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
                ({savedProfile.householdSize ? `${savedProfile.householdSize} people` : '1 person'})
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
            <Button onClick={onEdit} variant="secondary">
              {profileCopy.buttons.edit}
            </Button>
            {onNavigateToFootprint && (
              <Button onClick={onNavigateToFootprint} variant="primary">
                View footprint summary
              </Button>
            )}
          </div>
          {onNavigateToPrivacy && (
            <div
              style={{
                marginTop: 'var(--spacing-sm)',
                textAlign: 'center',
                fontSize: 'var(--font-xs)',
                color: 'var(--text-muted)',
              }}
            >
              Stored locally in this browser ·{' '}
              <button
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
        </div>
      </Card>
    </div>
  );
};
