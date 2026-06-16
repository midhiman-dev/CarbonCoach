import React from 'react';
import { CarbonProfile, calculateFootprint } from '@carboncoach/shared';
import { Card, EmptyState, StatusBadge, ProgressMeter, Button } from '../../components/ui';
import {
  formatKgCO2e,
  formatCategoryLabel,
  formatConfidenceLabel,
  getCategoryDescription,
  getCategoryImpactBand,
} from './footprintViewModel';

export interface FootprintSummaryProps {
  profile: CarbonProfile | null;
  onNavigateToProfile?: () => void;
}

export const FootprintSummary: React.FC<FootprintSummaryProps> = ({
  profile,
  onNavigateToProfile,
}) => {
  if (!profile) {
    return (
      <EmptyState
        title="Set up your carbon profile first"
        description="To see an approximate footprint summary, please complete the profile onboarding form."
        action={
          onNavigateToProfile ? (
            <Button onClick={onNavigateToProfile} variant="primary">
              Configure Profile
            </Button>
          ) : undefined
        }
      />
    );
  }

  // Calculate footprint deterministically
  const estimate = calculateFootprint(profile);
  const { monthlyTotalKgCO2e, categories, topCategory, confidence, assumptionNotes } = estimate;

  // Map overall confidence to the appropriate status badge variant
  const confidenceVariantMap: Record<typeof confidence, 'low' | 'moderate' | 'high'> = {
    low: 'high', // high alert/concern
    medium: 'moderate', // moderate warning
    high: 'low', // low alert/green/good
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)' }}>
      {/* Overview Cards Grid */}
      <div className="grid-responsive">
        {/* Total Footprint Summary Card */}
        <Card title="Monthly Total Carbon Footprint">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
            <div
              style={{
                fontSize: 'var(--font-3xl)',
                fontWeight: 800,
                color: 'var(--color-accent)',
                margin: 'var(--spacing-xs) 0',
              }}
              aria-live="polite"
            >
              {formatKgCO2e(monthlyTotalKgCO2e)}
            </div>
            <div style={{ display: 'flex', gap: 'var(--spacing-xs)', flexWrap: 'wrap' }}>
              <StatusBadge variant="info" label="Approximate Estimate" />
              <StatusBadge
                variant={confidenceVariantMap[confidence]}
                label={formatConfidenceLabel(confidence)}
              />
            </div>
            <p
              style={{
                fontSize: 'var(--font-sm)',
                color: 'var(--text-secondary)',
                marginTop: 'var(--spacing-xs)',
                lineHeight: 1.5,
              }}
            >
              This estimate is based on your profile inputs and CarbonCoach demo assumptions. It is
              designed for awareness and better everyday choices, not formal carbon accounting.
            </p>
          </div>
        </Card>

        {/* Top Contributor Card */}
        <Card title="Top Contributor Analysis">
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--spacing-sm)',
              height: '100%',
              justifyContent: 'space-between',
            }}
          >
            {topCategory ? (
              <>
                <div>
                  <div
                    style={{
                      display: 'flex',
                      gap: 'var(--spacing-xs)',
                      alignItems: 'center',
                      marginBottom: 'var(--spacing-xs)',
                    }}
                  >
                    <StatusBadge variant="high" label="Top Contributor" />
                    <strong style={{ color: 'var(--text-primary)', fontSize: 'var(--font-md)' }}>
                      {formatCategoryLabel(topCategory)}
                    </strong>
                  </div>
                  <p
                    style={{
                      fontSize: 'var(--font-sm)',
                      color: 'var(--text-secondary)',
                      lineHeight: 1.5,
                    }}
                  >
                    This category has the largest share in your current estimate. Focusing reduction
                    efforts here could yield the highest relative impact.
                  </p>
                </div>
                <div
                  style={{
                    background: 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid var(--border-glass)',
                    padding: 'var(--spacing-sm)',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: 'var(--font-sm)',
                    color: 'var(--color-accent)',
                    fontWeight: 600,
                  }}
                >
                  Category Total:{' '}
                  {formatKgCO2e(
                    categories.find((c) => c.category === topCategory)?.monthlyKgCO2e || 0,
                  )}
                </div>
              </>
            ) : (
              <p style={{ fontSize: 'var(--font-sm)', color: 'var(--text-muted)' }}>
                No significant carbon footprint contributors found. Complete or update your profile
                inputs.
              </p>
            )}
          </div>
        </Card>
      </div>

      {/* Category Breakdown list */}
      <Card title="Category Breakdown">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
          <p style={{ fontSize: 'var(--font-sm)', color: 'var(--text-secondary)' }}>
            Each lifestyle category contribution to your total monthly carbon footprint:
          </p>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--spacing-lg)',
              marginTop: 'var(--spacing-xs)',
            }}
            role="list"
            aria-label="Category breakdown list"
          >
            {categories.map((cat) => {
              const impactBand = getCategoryImpactBand(cat.category, cat.monthlyKgCO2e);
              const isTop = cat.category === topCategory;

              // Map local impact band to StatusBadge variant
              const badgeVariantMap: Record<typeof impactBand, 'low' | 'moderate' | 'high'> = {
                low: 'low',
                moderate: 'moderate',
                high: 'high',
              };

              return (
                <div
                  key={cat.category}
                  role="listitem"
                  style={{
                    padding: 'var(--spacing-md)',
                    background: 'rgba(255, 255, 255, 0.01)',
                    border: '1px solid var(--border-glass)',
                    borderRadius: 'var(--radius-sm)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 'var(--spacing-sm)',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      gap: 'var(--spacing-xs)',
                    }}
                  >
                    <div
                      style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}
                    >
                      <span
                        style={{
                          fontWeight: 700,
                          color: 'var(--text-primary)',
                          fontSize: 'var(--font-md)',
                        }}
                      >
                        {formatCategoryLabel(cat.category)}
                      </span>
                      {isTop && <StatusBadge variant="high" label="Top Contributor" />}
                    </div>

                    <div style={{ display: 'flex', gap: 'var(--spacing-xs)', flexWrap: 'wrap' }}>
                      <StatusBadge
                        variant={badgeVariantMap[impactBand]}
                        label={`${impactBand} impact`}
                      />
                      <StatusBadge
                        variant={confidenceVariantMap[cat.confidence]}
                        label={formatConfidenceLabel(cat.confidence)}
                      />
                    </div>
                  </div>

                  <p style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)', margin: 0 }}>
                    {getCategoryDescription(cat.category)}
                  </p>

                  <div style={{ marginTop: 'var(--spacing-xs)' }}>
                    <ProgressMeter
                      value={cat.monthlyKgCO2e}
                      max={Math.max(monthlyTotalKgCO2e, 1)}
                      label={`Contribution: ${formatKgCO2e(cat.monthlyKgCO2e)}`}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Card>

      {/* Assumptions & Confidence Details Section */}
      <Card title="Calculated Science Assumptions">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
          <p style={{ fontSize: 'var(--font-sm)', color: 'var(--text-secondary)', margin: 0 }}>
            CarbonCoach values transparency. Here are the assumptions and scientific references
            utilized to determine your footprint:
          </p>

          <ul
            style={{
              paddingLeft: 'var(--spacing-lg)',
              margin: 0,
              fontSize: 'var(--font-sm)',
              color: 'var(--text-muted)',
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--spacing-xs)',
              lineHeight: 1.5,
            }}
          >
            {assumptionNotes.length > 0 ? (
              assumptionNotes.map((note, idx) => <li key={idx}>{note}</li>)
            ) : (
              <li>This result uses CarbonCoach’s current demo assumptions.</li>
            )}
          </ul>
        </div>
      </Card>

      {/* Action Plan Placeholder */}
      <Card title="Personalized Action Coaching">
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--spacing-sm)',
            padding: 'var(--spacing-sm)',
            border: '1px dashed var(--border-glass)',
            borderRadius: 'var(--radius-sm)',
            alignItems: 'center',
            textAlign: 'center',
          }}
        >
          <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
            AI Coach & Recommendations Coming Soon
          </div>
          <p
            style={{
              fontSize: 'var(--font-xs)',
              color: 'var(--text-muted)',
              maxWidth: '480px',
              margin: 0,
            }}
          >
            Your calculated footprint is ready. The next tasks will enable personalized coaching
            summaries, action plans, and everyday lifestyle decisions using the Choice Lab.
          </p>
        </div>
      </Card>
    </div>
  );
};
