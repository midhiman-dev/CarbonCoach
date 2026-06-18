import React from 'react';
import { OverviewHero } from './OverviewHero';
import { TrustStrip } from './TrustStrip';
import { JourneyProgress } from './JourneyProgress';
import { NextBestActionCard } from './NextBestActionCard';
import { Card } from '../../components/ui/Card';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { ActiveSection } from '../../app/routes';

import { CarbonProfile, FootprintEstimate } from '@carboncoach/shared';
import { formatCategoryLabel } from '../footprint';
import { CarbonWorldScene } from '../world/CarbonWorldScene';

interface OverviewDashboardProps {
  savedProfile: CarbonProfile | null;
  estimate: FootprintEstimate | null;
  weeklyPlanActionsCount: number;
  trackerProgress: {
    completed: number;
    total: number;
    percent: number;
  };
  onNavigate: (section: ActiveSection) => void;
}

export const OverviewDashboard: React.FC<OverviewDashboardProps> = ({
  savedProfile,
  estimate,
  weeklyPlanActionsCount,
  trackerProgress,
  onNavigate,
}) => {
  const hasProfile = savedProfile !== null;
  const hasActions = weeklyPlanActionsCount > 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)' }}>
      {/* Hero Header */}
      <OverviewHero />

      {/* Trust Strip */}
      <TrustStrip />

      {/* Next Best Action Card */}
      <NextBestActionCard
        hasProfile={hasProfile}
        hasActions={hasActions}
        trackerProgressPercent={trackerProgress.percent}
        onNavigate={onNavigate}
      />

      {/* Journey Stepper */}
      <JourneyProgress
        hasProfile={hasProfile}
        hasActions={hasActions}
        trackerProgressPercent={trackerProgress.percent}
        onNavigate={onNavigate}
      />

      {/* Key Status Cards Grid */}
      <div className="grid-responsive">
        <Card title="Carbon Profile">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
            <p style={{ margin: 0, fontSize: 'var(--font-sm)', color: 'var(--text-secondary)' }}>
              {hasProfile
                ? 'Your personal profile is complete.'
                : 'Configure lifestyle details to get started.'}
            </p>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: 'var(--spacing-xs)',
              }}
            >
              <StatusBadge
                variant={hasProfile ? 'low' : 'moderate'}
                label={hasProfile ? 'Configured' : 'Not Configured'}
              />
              <button
                onClick={() => onNavigate('profile')}
                className="btn btn-secondary"
                style={{
                  fontSize: 'var(--font-xs)',
                  padding: 'var(--spacing-2xs) var(--spacing-xs)',
                }}
              >
                {hasProfile ? 'Edit Profile' : 'Configure'}
              </button>
            </div>
          </div>
        </Card>

        <Card title="Top Contributor">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
            <p style={{ margin: 0, fontSize: 'var(--font-sm)', color: 'var(--text-secondary)' }}>
              {estimate && estimate.topCategory
                ? `Largest source: ${formatCategoryLabel(estimate.topCategory)}`
                : 'Awaiting profile onboarding.'}
            </p>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: 'var(--spacing-xs)',
              }}
            >
              <StatusBadge
                variant={estimate ? 'high' : 'info'}
                label={estimate ? 'Calculated' : 'Awaiting Profile'}
              />
              {estimate && (
                <button
                  onClick={() => onNavigate('footprint')}
                  className="btn btn-secondary"
                  style={{
                    fontSize: 'var(--font-xs)',
                    padding: 'var(--spacing-2xs) var(--spacing-xs)',
                  }}
                >
                  View Footprint
                </button>
              )}
            </div>
          </div>
        </Card>

        <Card title="Weekly Action Plan">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
            <p style={{ margin: 0, fontSize: 'var(--font-sm)', color: 'var(--text-secondary)' }}>
              {hasActions
                ? `Plan includes ${weeklyPlanActionsCount} actions.`
                : 'Plan will generate based on priority.'}
            </p>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: 'var(--spacing-xs)',
              }}
            >
              <StatusBadge
                variant={hasActions ? 'low' : 'info'}
                label={hasActions ? 'Active' : 'Awaiting Profile'}
              />
              {hasActions && (
                <button
                  onClick={() => onNavigate('recommendations')}
                  className="btn btn-secondary"
                  style={{
                    fontSize: 'var(--font-xs)',
                    padding: 'var(--spacing-2xs) var(--spacing-xs)',
                  }}
                >
                  Edit Plan
                </button>
              )}
            </div>
          </div>
        </Card>
      </div>

      {/* Large Grid: Daily Choice Lab & Carbon World */}
      <div className="grid-two-cols" style={{ marginTop: 'var(--spacing-sm)' }}>
        <Card title="Daily Choice Lab">
          <p
            style={{
              marginBottom: 'var(--spacing-md)',
              fontSize: 'var(--font-sm)',
              color: 'var(--text-secondary)',
            }}
          >
            Compare everyday scenarios using deterministic impact bands and get coach inputs.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
            <StatusBadge variant="low" label="Daily Choice Lab Ready" />
            <button
              onClick={() => onNavigate('choice-lab')}
              className="btn btn-secondary"
              style={{
                alignSelf: 'start',
                marginTop: 'var(--spacing-xs)',
                cursor: 'pointer',
              }}
            >
              Go to Daily Choice Lab
            </button>
          </div>
        </Card>

        <Card title="Carbon World Preview">
          <p
            style={{
              marginBottom: 'var(--spacing-md)',
              fontSize: 'var(--font-sm)',
              color: 'var(--text-secondary)',
            }}
          >
            {hasProfile && hasActions && trackerProgress.completed === 0
              ? 'Complete an action to begin growing your Carbon World.'
              : 'Your Carbon World grows with weekly action progress.'}
          </p>
          {hasActions ? (
            <>
              <div
                style={{
                  maxHeight: '140px',
                  overflow: 'hidden',
                  borderRadius: 'var(--radius-sm)',
                  marginBottom: 'var(--spacing-sm)',
                  display: 'flex',
                  alignItems: 'center',
                  border: '1px solid var(--border-glass)',
                }}
              >
                <div style={{ width: '100%', transform: 'scale(0.9)', transformOrigin: 'center' }}>
                  <CarbonWorldScene
                    stage={
                      trackerProgress.percent === 0
                        ? 'seed'
                        : trackerProgress.percent <= 35
                          ? 'sprout'
                          : trackerProgress.percent <= 70
                            ? 'garden'
                            : 'grove'
                    }
                    progressPercent={trackerProgress.percent}
                  />
                </div>
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: 'var(--spacing-xs)',
                }}
              >
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span
                    style={{
                      fontSize: 'var(--font-xs)',
                      color: 'var(--text-primary)',
                      fontWeight: 700,
                    }}
                  >
                    {trackerProgress.percent === 0
                      ? 'Seed / Hazy Patch'
                      : trackerProgress.percent <= 35
                        ? 'Sprouting Patch'
                        : trackerProgress.percent <= 70
                          ? 'Growing Grove'
                          : 'Thriving Grove'}
                  </span>
                  <span
                    style={{
                      fontSize: '0.75rem',
                      color: 'var(--text-muted)',
                    }}
                  >
                    {trackerProgress.completed} of {trackerProgress.total} actions complete
                  </span>
                </div>
                <button
                  onClick={() => onNavigate('carbon-world')}
                  className="btn btn-secondary"
                  style={{
                    fontSize: 'var(--font-xs)',
                    padding: 'var(--spacing-2xs) var(--spacing-sm)',
                    minHeight: '44px',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  View Carbon World
                </button>
              </div>
            </>
          ) : (
            <>
              <p
                style={{
                  fontSize: 'var(--font-xs)',
                  color: 'var(--text-muted)',
                  margin: 0,
                }}
              >
                {!hasProfile
                  ? 'Set up your profile to view your Carbon World.'
                  : 'Create a weekly action plan to start tracking progress.'}
              </p>
            </>
          )}
        </Card>
      </div>
    </div>
  );
};
