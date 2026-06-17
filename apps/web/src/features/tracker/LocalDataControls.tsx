import React, { useState } from 'react';
import { Card, Button, StatusBadge } from '../../components/ui';
import { clearAllLocalCarbonCoachData } from './trackerStorage';

interface LocalDataControlsProps {
  hasData: boolean;
  onClear: () => void;
}

export const LocalDataControls: React.FC<LocalDataControlsProps> = ({ hasData, onClear }) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const [announcement, setAnnouncement] = useState('');

  const handleClear = () => {
    clearAllLocalCarbonCoachData();
    onClear();
    setShowConfirm(false);
    setAnnouncement('Local CarbonCoach data has been successfully cleared.');
  };

  return (
    <Card title="Manage Local Data">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
        <p style={{ margin: 0, fontSize: 'var(--font-sm)', color: 'var(--text-secondary)' }}>
          Your profile and tracker progress are stored only in this browser. Clearing local data
          removes them from this device.
        </p>

        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)' }}>
          <span style={{ fontSize: 'var(--font-xs)', fontWeight: 600, color: 'var(--text-muted)' }}>
            STATUS:
          </span>
          {hasData ? (
            <StatusBadge variant="low" label="Active Profile Stored Locally" />
          ) : (
            <StatusBadge variant="info" label="No Local Data Saved" />
          )}
        </div>

        {hasData && (
          <div style={{ marginTop: 'var(--spacing-xs)' }}>
            {!showConfirm ? (
              <Button
                variant="secondary"
                onClick={() => setShowConfirm(true)}
                aria-label="Clear all local data"
              >
                Clear Local Data
              </Button>
            ) : (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 'var(--spacing-sm)',
                  padding: 'var(--spacing-sm)',
                  border: '1px solid var(--border-glass)',
                  borderRadius: 'var(--radius-sm)',
                  background: 'rgba(255, 0, 0, 0.05)',
                }}
              >
                <p
                  style={{
                    margin: 0,
                    fontSize: 'var(--font-xs)',
                    color: 'var(--text-primary)',
                    fontWeight: 600,
                  }}
                >
                  Are you absolutely sure? This will delete your carbon profile, weekly tracker
                  history, and reset your session.
                </p>
                <div style={{ display: 'flex', gap: 'var(--spacing-sm)' }}>
                  <Button
                    variant="danger"
                    onClick={() => handleClear()}
                    style={{ borderColor: 'red', color: 'red' }}
                  >
                    Yes, Clear Everything
                  </Button>
                  <Button variant="secondary" onClick={() => setShowConfirm(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}

        <div
          aria-live="polite"
          className="sr-only"
          style={{
            position: 'absolute',
            width: '1px',
            height: '1px',
            padding: 0,
            margin: '-1px',
            overflow: 'hidden',
            clip: 'rect(0, 0, 0, 0)',
            border: 0,
          }}
        >
          {announcement}
        </div>
      </div>
    </Card>
  );
};
