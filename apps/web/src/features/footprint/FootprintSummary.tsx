import React, { useState } from 'react';
import { CarbonProfile, calculateFootprint } from '@carboncoach/shared';
import { EmptyState, StatusBadge, Button } from '../../components/ui';
import {
  formatKgCO2e,
  formatCategoryLabel,
  getCategoryDescription,
  getCategoryImpactBand,
} from './footprintViewModel';

// ─── Category icon map ───────────────────────────────────────────────────────

const CATEGORY_ICONS: Record<string, string> = {
  food: '🍽️',
  transport: '🚌',
  homeEnergy: '🏠',
  shopping: '🛍️',
  flights: '✈️',
};

// ─── Types ───────────────────────────────────────────────────────────────────

export interface FootprintSummaryProps {
  profile: CarbonProfile | null;
  onNavigateToProfile?: () => void;
  onNavigateToRecommendations?: () => void;
  onNavigateToAssumptions?: () => void;
}

// ─── Component ───────────────────────────────────────────────────────────────

export const FootprintSummary: React.FC<FootprintSummaryProps> = ({
  profile,
  onNavigateToProfile,
  onNavigateToRecommendations,
  onNavigateToAssumptions,
}) => {
  const [methodologyOpen, setMethodologyOpen] = useState(false);

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

  // Sort categories by value descending for breakdown display
  const sortedCategories = [...categories].sort((a, b) => b.monthlyKgCO2e - a.monthlyKgCO2e);

  const topCategoryData = categories.find((c) => c.category === topCategory);
  const topShare =
    monthlyTotalKgCO2e > 0 && topCategoryData
      ? Math.round((topCategoryData.monthlyKgCO2e / monthlyTotalKgCO2e) * 100)
      : 0;

  // Build accessible text summary for screen readers
  const accessibleBreakdownSummary = [
    'Approximate footprint breakdown:',
    ...sortedCategories.map(
      (c, i) =>
        `${i + 1}. ${formatCategoryLabel(c.category)}: ${formatKgCO2e(c.monthlyKgCO2e)}, ${Math.round(
          (c.monthlyKgCO2e / Math.max(monthlyTotalKgCO2e, 1)) * 100,
        )}% share of estimate`,
    ),
  ].join(' ');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-xl)' }}>
      {/* ── 1. Hero Summary Card ─────────────────────────────────────────── */}
      <section
        aria-label="Footprint snapshot"
        style={{
          background: 'linear-gradient(135deg, rgba(0,245,212,0.08) 0%, rgba(14,20,36,0) 60%)',
          border: '1px solid rgba(0,245,212,0.2)',
          borderRadius: 'var(--radius-lg)',
          padding: 'var(--spacing-xl)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* subtle glow ring */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: '-40px',
            right: '-40px',
            width: '180px',
            height: '180px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(0,245,212,0.15) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />

        <p
          style={{
            fontSize: 'var(--font-sm)',
            color: 'var(--text-muted)',
            margin: '0 0 var(--spacing-xs)',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            fontWeight: 600,
          }}
        >
          Your footprint snapshot
        </p>

        <div
          style={{
            display: 'flex',
            alignItems: 'flex-end',
            gap: 'var(--spacing-sm)',
            flexWrap: 'wrap',
          }}
        >
          <span
            style={{
              fontSize: 'var(--font-4xl)',
              fontWeight: 800,
              color: 'var(--color-accent)',
              lineHeight: 1,
            }}
            aria-live="polite"
            data-testid="footprint-total"
          >
            {formatKgCO2e(monthlyTotalKgCO2e)}
          </span>
          <span
            style={{
              fontSize: 'var(--font-md)',
              color: 'var(--text-secondary)',
              paddingBottom: '4px',
            }}
          >
            / month
          </span>
        </div>

        <div
          style={{
            display: 'flex',
            gap: 'var(--spacing-xs)',
            flexWrap: 'wrap',
            marginTop: 'var(--spacing-sm)',
          }}
        >
          <StatusBadge variant="info" label="Approximate estimate" />
          <StatusBadge variant="info" label="Awareness only" />
        </div>

        {topCategory && (
          <p
            style={{
              fontSize: 'var(--font-sm)',
              color: 'var(--text-secondary)',
              marginTop: 'var(--spacing-sm)',
              marginBottom: 0,
            }}
          >
            Top contributor:{' '}
            <strong style={{ color: 'var(--text-primary)' }}>
              {CATEGORY_ICONS[topCategory]} {formatCategoryLabel(topCategory)}
            </strong>
          </p>
        )}
      </section>

      {/* ── 2. Top Contributor Insight Card ──────────────────────────────── */}
      {topCategory && topCategoryData && (
        <section
          aria-label="Top contributor insight"
          style={{
            background: 'rgba(248,113,113,0.06)',
            border: '1px solid rgba(248,113,113,0.25)',
            borderRadius: 'var(--radius-md)',
            padding: 'var(--spacing-lg)',
            display: 'flex',
            gap: 'var(--spacing-md)',
            alignItems: 'flex-start',
            flexWrap: 'wrap',
          }}
        >
          <div
            aria-hidden="true"
            style={{
              fontSize: '2.5rem',
              lineHeight: 1,
              flexShrink: 0,
            }}
          >
            {CATEGORY_ICONS[topCategory]}
          </div>
          <div style={{ flex: 1, minWidth: '200px' }}>
            <p
              style={{
                fontSize: 'var(--font-xs)',
                color: 'var(--text-muted)',
                margin: '0 0 var(--spacing-2xs)',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                fontWeight: 600,
              }}
            >
              Your biggest contributor
            </p>
            <div
              style={{
                display: 'flex',
                alignItems: 'baseline',
                gap: 'var(--spacing-xs)',
                flexWrap: 'wrap',
              }}
            >
              <span
                style={{
                  fontSize: 'var(--font-2xl)',
                  fontWeight: 700,
                  color: 'var(--text-primary)',
                }}
                data-testid="top-contributor-name"
              >
                {formatCategoryLabel(topCategory)}
              </span>
              <span
                style={{ fontSize: 'var(--font-sm)', color: 'var(--text-secondary)' }}
                data-testid="top-contributor-share"
              >
                {topShare}% of your approximate estimate
              </span>
            </div>
            <p
              style={{
                fontSize: 'var(--font-sm)',
                color: 'var(--text-muted)',
                margin: 'var(--spacing-xs) 0 0',
                lineHeight: 1.5,
              }}
            >
              This is a practical place to start with small everyday choices.
            </p>
          </div>
        </section>
      )}

      {/* ── 3. Visual Category Breakdown ─────────────────────────────────── */}
      <section aria-label="Category breakdown">
        <h2
          style={{
            fontSize: 'var(--font-md)',
            fontWeight: 700,
            color: 'var(--text-primary)',
            margin: '0 0 var(--spacing-md)',
          }}
        >
          Category breakdown
        </h2>

        {/* Accessible text summary for screen readers */}
        <p className="sr-only">{accessibleBreakdownSummary}</p>

        <div
          role="list"
          aria-label="Category breakdown list"
          style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}
        >
          {sortedCategories.map((cat) => {
            const share =
              monthlyTotalKgCO2e > 0
                ? Math.round((cat.monthlyKgCO2e / monthlyTotalKgCO2e) * 100)
                : 0;
            const barPercent =
              monthlyTotalKgCO2e > 0 ? (cat.monthlyKgCO2e / monthlyTotalKgCO2e) * 100 : 0;
            const impactBand = getCategoryImpactBand(cat.category, cat.monthlyKgCO2e);
            const isTop = cat.category === topCategory;

            const barColorMap: Record<typeof impactBand, string> = {
              high: 'var(--color-danger)',
              moderate: 'var(--color-warning)',
              low: 'var(--color-primary)',
            };

            return (
              <div
                key={cat.category}
                role="listitem"
                style={{
                  background: 'var(--bg-card)',
                  border: `1px solid ${isTop ? 'rgba(248,113,113,0.3)' : 'var(--border-glass)'}`,
                  borderRadius: 'var(--radius-sm)',
                  padding: 'var(--spacing-sm) var(--spacing-md)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 'var(--spacing-xs)',
                }}
              >
                {/* Row: icon + name + value + badge */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--spacing-sm)',
                    flexWrap: 'wrap',
                  }}
                >
                  <span aria-hidden="true" style={{ fontSize: '1.25rem' }}>
                    {CATEGORY_ICONS[cat.category]}
                  </span>
                  <span
                    style={{
                      fontWeight: 600,
                      color: 'var(--text-primary)',
                      fontSize: 'var(--font-md)',
                      flex: 1,
                      minWidth: '100px',
                    }}
                  >
                    {formatCategoryLabel(cat.category)}
                  </span>
                  <span
                    style={{
                      fontWeight: 700,
                      color: 'var(--text-primary)',
                      fontSize: 'var(--font-md)',
                      whiteSpace: 'nowrap',
                    }}
                    aria-label={`${formatCategoryLabel(cat.category)}: ${formatKgCO2e(cat.monthlyKgCO2e)}`}
                  >
                    {formatKgCO2e(cat.monthlyKgCO2e)}
                  </span>
                  <span
                    style={{
                      fontSize: 'var(--font-xs)',
                      color: 'var(--text-muted)',
                      whiteSpace: 'nowrap',
                    }}
                    data-testid={`category-share-${cat.category}`}
                  >
                    {share}% share of estimate
                  </span>
                  {isTop && <StatusBadge variant="high" label="Top" />}
                  <StatusBadge
                    variant={
                      impactBand === 'high'
                        ? 'high'
                        : impactBand === 'moderate'
                          ? 'moderate'
                          : 'low'
                    }
                    label={`${impactBand} impact`}
                  />
                </div>

                {/* Contribution bar */}
                <div
                  role="presentation"
                  aria-hidden="true"
                  style={{
                    height: '6px',
                    borderRadius: '3px',
                    background: 'rgba(255,255,255,0.06)',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      height: '100%',
                      width: `${barPercent}%`,
                      background: barColorMap[impactBand],
                      borderRadius: '3px',
                      transition: 'width 0.6s ease',
                    }}
                  />
                </div>

                {/* Description */}
                <p
                  style={{
                    fontSize: 'var(--font-xs)',
                    color: 'var(--text-muted)',
                    margin: 0,
                    lineHeight: 1.4,
                  }}
                >
                  {getCategoryDescription(cat.category)}
                </p>
              </div>
            );
          })}
        </div>
      </section>

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
      <section
        aria-label="Methodology disclosure"
        style={{
          border: '1px solid var(--border-glass)',
          borderRadius: 'var(--radius-md)',
          overflow: 'hidden',
        }}
      >
        <button
          onClick={() => setMethodologyOpen((prev) => !prev)}
          aria-expanded={methodologyOpen}
          aria-controls="methodology-detail"
          style={{
            width: '100%',
            background: 'var(--bg-card)',
            border: 'none',
            padding: 'var(--spacing-md) var(--spacing-lg)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            cursor: 'pointer',
            color: 'var(--text-secondary)',
            fontSize: 'var(--font-sm)',
            fontWeight: 600,
            textAlign: 'left',
            gap: 'var(--spacing-sm)',
          }}
        >
          <span>How this estimate works</span>
          <span
            aria-hidden="true"
            style={{
              transform: methodologyOpen ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform var(--transition-fast)',
              fontSize: 'var(--font-xs)',
              color: 'var(--text-muted)',
            }}
          >
            ▾
          </span>
        </button>

        <div
          id="methodology-detail"
          role="region"
          aria-label="Estimate methodology details"
          hidden={!methodologyOpen}
          style={{
            padding: 'var(--spacing-md) var(--spacing-lg)',
            background: 'rgba(255,255,255,0.01)',
            borderTop: '1px solid var(--border-glass)',
          }}
        >
          <p
            style={{
              fontSize: 'var(--font-sm)',
              color: 'var(--text-secondary)',
              margin: '0 0 var(--spacing-sm)',
              lineHeight: 1.6,
            }}
          >
            CarbonCoach uses deterministic TypeScript logic and simplified demo assumptions to
            estimate broad lifestyle patterns. Results are approximate and designed for awareness —
            not formal carbon accounting.
          </p>
          {onNavigateToAssumptions ? (
            <button
              onClick={onNavigateToAssumptions}
              style={{
                background: 'none',
                border: 'none',
                padding: 0,
                color: 'var(--color-accent)',
                fontSize: 'var(--font-sm)',
                cursor: 'pointer',
                textDecoration: 'underline',
                textUnderlineOffset: '3px',
              }}
            >
              View estimates and assumptions →
            </button>
          ) : (
            <p
              style={{
                fontSize: 'var(--font-xs)',
                color: 'var(--text-muted)',
                margin: 0,
              }}
            >
              See the Estimates &amp; Assumptions page for full methodology details.
            </p>
          )}
        </div>
      </section>
    </div>
  );
};
