import React from 'react';
import { navigationItems } from './navigation';
import { ActiveSection } from './routes';

interface DesktopNavigationProps {
  activeSection: ActiveSection;
  setActiveSection: (section: ActiveSection) => void;
}

export const DesktopNavigation: React.FC<DesktopNavigationProps> = ({
  activeSection,
  setActiveSection,
}) => {
  return (
    <aside
      style={{
        width: '300px',
        background: 'var(--bg-deep-navy)',
        borderRight: '1px solid var(--border-glass)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: 'var(--spacing-lg)',
      }}
      className="hide-mobile-flex"
    >
      <div>
        <div style={{ marginBottom: 'var(--spacing-xl)' }}>
          <h1 style={{ fontSize: 'var(--font-2xl)', color: 'var(--color-accent)' }}>CarbonCoach</h1>
          <p style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)' }}>
            Understand your footprint. Make better everyday choices.
          </p>
        </div>

        <nav aria-label="Desktop primary navigation">
          <ul
            style={{
              listStyle: 'none',
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--spacing-sm)',
              padding: 0,
              margin: 0,
            }}
          >
            {navigationItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => setActiveSection(item.id as ActiveSection)}
                  style={{
                    background: activeSection === item.id ? 'var(--bg-card)' : 'transparent',
                    border: 'none',
                    color:
                      activeSection === item.id ? 'var(--color-accent)' : 'var(--text-secondary)',
                    padding: 'var(--spacing-sm)',
                    width: '100%',
                    textAlign: 'left',
                    borderRadius: 'var(--radius-sm)',
                    cursor: 'pointer',
                    transition: 'background var(--transition-fast)',
                  }}
                  className={activeSection === item.id ? '' : 'nav-button-hover'}
                >
                  <div style={{ fontWeight: 600 }}>{item.label}</div>
                  <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)' }}>
                    {item.description}
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <footer
        style={{
          marginTop: 'var(--spacing-xl)',
          borderTop: '1px solid var(--border-glass)',
          paddingTop: 'var(--spacing-md)',
        }}
      >
        <p style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)' }}>
          Local-first sandbox · AI-assisted coach
        </p>
      </footer>
    </aside>
  );
};
