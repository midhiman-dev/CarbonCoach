import React from 'react';
import { StatusBadge } from '../../components/ui';
import type { FootprintCategory } from '@carboncoach/shared';
import {
  formatKgCO2e,
  formatCategoryLabel,
  getCategoryDescription,
  getCategoryImpactBand,
} from './footprintViewModel';
import { CATEGORY_ICONS } from './footprintConstants';

interface CategoryData {
  category: FootprintCategory;
  monthlyKgCO2e: number;
}

interface FootprintCategoryBreakdownProps {
  categories: CategoryData[];
  monthlyTotalKgCO2e: number;
  topCategory?: FootprintCategory | null;
}

export const FootprintCategoryBreakdown: React.FC<FootprintCategoryBreakdownProps> = ({
  categories,
  monthlyTotalKgCO2e,
  topCategory,
}) => {
  const sortedCategories = [...categories].sort((a, b) => b.monthlyKgCO2e - a.monthlyKgCO2e);

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
            monthlyTotalKgCO2e > 0 ? Math.round((cat.monthlyKgCO2e / monthlyTotalKgCO2e) * 100) : 0;
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
                    impactBand === 'high' ? 'high' : impactBand === 'moderate' ? 'moderate' : 'low'
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
  );
};
