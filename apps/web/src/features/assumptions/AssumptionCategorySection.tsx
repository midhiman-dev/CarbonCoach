import React, { useState } from 'react';
import { assumptionsCopy } from './assumptionsCopy';
import type { FootprintCategory } from '@carboncoach/shared';
import { getFactorsByCategory } from '@carboncoach/shared';

export const AssumptionCategorySection: React.FC = () => {
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  const getCategoryFromId = (id: string): FootprintCategory | null => {
    if (['transport', 'food', 'homeEnergy', 'shopping', 'flights'].includes(id)) {
      return id as FootprintCategory;
    }
    return null;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
      {assumptionsCopy.sections.map((section) => {
        const categoryKey = getCategoryFromId(section.id);
        const factors = categoryKey ? getFactorsByCategory(categoryKey) : [];
        const isExpanded = expandedCategory === section.id;

        return (
          <details
            key={section.id}
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-glass)',
              borderRadius: 'var(--radius-sm)',
              padding: 'var(--spacing-md)',
              cursor: 'pointer',
            }}
          >
            <summary
              style={{
                fontSize: 'var(--font-md)',
                fontWeight: 700,
                color: 'var(--text-primary)',
                outline: 'none',
              }}
            >
              {section.title}
            </summary>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--spacing-sm)',
                marginTop: 'var(--spacing-md)',
              }}
            >
              <div>
                <strong style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)' }}>
                  WHAT IS ESTIMATED:
                </strong>
                <p style={{ margin: '2px 0 var(--spacing-sm) 0' }}>{section.estimated}</p>
              </div>

              <div>
                <strong style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)' }}>
                  ASSUMPTIONS USED:
                </strong>
                <p style={{ margin: '2px 0 var(--spacing-sm) 0', color: 'var(--text-secondary)' }}>
                  {section.assumptions}
                </p>
              </div>

              <div>
                <strong style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)' }}>
                  WHAT IS NOT CLAIMED:
                </strong>
                <p
                  style={{
                    margin: '2px 0 var(--spacing-sm) 0',
                    color: 'var(--text-secondary)',
                    fontStyle: 'italic',
                  }}
                >
                  {section.notClaimed}
                </p>
              </div>

              {factors.length > 0 && (
                <div style={{ marginTop: 'var(--spacing-xs)' }}>
                  <button
                    onClick={() => setExpandedCategory(isExpanded ? null : section.id)}
                    aria-expanded={isExpanded}
                    style={{
                      background: 'transparent',
                      border: '1px solid var(--border-glass)',
                      color: 'var(--color-accent)',
                      padding: 'var(--spacing-xs) var(--spacing-sm)',
                      borderRadius: 'var(--radius-xs)',
                      cursor: 'pointer',
                      fontSize: 'var(--font-xs)',
                      fontWeight: 600,
                    }}
                  >
                    {isExpanded ? 'Hide Emission Coefficients' : 'View Emission Coefficients'}
                  </button>

                  {isExpanded && (
                    <div
                      style={{
                        marginTop: 'var(--spacing-sm)',
                        padding: 'var(--spacing-sm)',
                        background: 'rgba(255, 255, 255, 0.02)',
                        borderRadius: 'var(--radius-xs)',
                        border: '1px solid var(--border-glass)',
                        overflowX: 'auto',
                      }}
                    >
                      <table
                        style={{
                          width: '100%',
                          borderCollapse: 'collapse',
                          fontSize: 'var(--font-xs)',
                          textAlign: 'left',
                        }}
                      >
                        <thead>
                          <tr style={{ borderBottom: '1px solid var(--border-glass)' }}>
                            <th style={{ padding: 'var(--spacing-xs)', fontWeight: 700 }}>Label</th>
                            <th style={{ padding: 'var(--spacing-xs)', fontWeight: 700 }}>Value</th>
                            <th style={{ padding: 'var(--spacing-xs)', fontWeight: 700 }}>Unit</th>
                            <th style={{ padding: 'var(--spacing-xs)', fontWeight: 700 }}>
                              Source
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {factors.map((factor) => (
                            <tr
                              key={factor.id}
                              style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}
                            >
                              <td style={{ padding: 'var(--spacing-xs)', fontWeight: 600 }}>
                                {factor.label}
                              </td>
                              <td style={{ padding: 'var(--spacing-xs)' }}>{factor.value}</td>
                              <td
                                style={{ padding: 'var(--spacing-xs)', color: 'var(--text-muted)' }}
                              >
                                {factor.unit}
                              </td>
                              <td
                                style={{
                                  padding: 'var(--spacing-xs)',
                                  color: 'var(--text-secondary)',
                                }}
                              >
                                {factor.sourceLabel} (v{factor.version})
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}
            </div>
          </details>
        );
      })}
    </div>
  );
};
