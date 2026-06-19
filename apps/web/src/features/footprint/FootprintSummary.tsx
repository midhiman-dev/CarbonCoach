import React from 'react';
import { CarbonProfile, calculateFootprint } from '@carboncoach/shared';
import { EmptyState, Button } from '../../components/ui';
import { formatCategoryLabel } from './footprintViewModel';

import { FootprintHero } from './FootprintHero';
import { FootprintTopContributor } from './FootprintTopContributor';
import { FootprintCategoryBreakdown } from './FootprintCategoryBreakdown';
import { FootprintMethodology } from './FootprintMethodology';

export interface FootprintSummaryProps {
  profile: CarbonProfile | null;
  onNavigateToProfile?: () => void;
  onNavigateToRecommendations?: () => void;
  onNavigateToAssumptions?: () => void;
}

export const FootprintSummary: React.FC<FootprintSummaryProps> = ({
  profile,
  onNavigateToProfile,
  onNavigateToRecommendations,
  onNavigateToAssumptions,
}) => {
  if (!profile) {
    return (
      <EmptyState
        title="Profile Not Set Up"
        description="Set up your profile to view an approximate estimate."
        action={
          onNavigateToProfile ? (
            <Button onClick={onNavigateToProfile} variant="primary">
              Set up your profile
            </Button>
          ) : undefined
        }
      />
    );
  }

  // ── Deterministic calculation ──────────────────────────────────────────────
  const estimate = calculateFootprint(profile);
  const { monthlyTotalKgCO2e, categories, topCategory } = estimate;

  const topCategoryData = categories.find((c) => c.category === topCategory);
  const topShare =
    monthlyTotalKgCO2e > 0 && topCategoryData
      ? Math.round((topCategoryData.monthlyKgCO2e / monthlyTotalKgCO2e) * 100)
      : 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-xl)' }}>
      {/* ── 1. Hero Summary Card ─────────────────────────────────────────── */}
      <FootprintHero monthlyTotalKgCO2e={monthlyTotalKgCO2e} topCategory={topCategory} />

      {/* ── 2. Top Contributor Insight Card ──────────────────────────────── */}
      {topCategory && topCategoryData && (
        <FootprintTopContributor topCategory={topCategory} topShare={topShare} />
      )}

      {/* ── 3. Visual Category Breakdown ─────────────────────────────────── */}
      <FootprintCategoryBreakdown
        categories={categories}
        monthlyTotalKgCO2e={monthlyTotalKgCO2e}
        topCategory={topCategory}
      />

      {/* ── 4. Primary CTA ───────────────────────────────────────────────── */}
      <section
        aria-label="Next step"
        style={{
          background: 'rgba(0,245,212,0.05)',
          border: '1px solid rgba(0,245,212,0.18)',
          borderRadius: 'var(--radius-md)',
          padding: 'var(--spacing-lg)',
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--spacing-sm)',
          alignItems: 'flex-start',
        }}
      >
        <p
          style={{
            fontSize: 'var(--font-xs)',
            color: 'var(--text-muted)',
            margin: 0,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            fontWeight: 600,
          }}
        >
          Focus area
        </p>
        <p
          style={{
            fontSize: 'var(--font-md)',
            fontWeight: 600,
            color: 'var(--text-primary)',
            margin: 0,
          }}
        >
          {topCategory
            ? `See actions for ${formatCategoryLabel(topCategory)}`
            : 'Explore recommended actions'}
        </p>
        <p
          style={{
            fontSize: 'var(--font-sm)',
            color: 'var(--text-secondary)',
            margin: 0,
            lineHeight: 1.5,
          }}
        >
          Your weekly plan is personalised from your profile and priority.
        </p>
        {onNavigateToRecommendations && (
          <Button
            onClick={onNavigateToRecommendations}
            variant="primary"
            style={{ marginTop: 'var(--spacing-xs)', minWidth: '220px' }}
          >
            {topCategory
              ? `See actions for ${formatCategoryLabel(topCategory)}`
              : 'Explore recommended actions'}
          </Button>
        )}
      </section>

      {/* ── 5. Progressive Disclosure: How this estimate works ───────────── */}
      <FootprintMethodology onNavigateToAssumptions={onNavigateToAssumptions} />
    </div>
  );
};

