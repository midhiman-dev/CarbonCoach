import React from 'react';
import { navigationItems } from './navigation';
import { ActiveSection } from './routes';

interface MobileNavigationProps {
  activeSection: ActiveSection;
  activeLabel: string;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  setActiveSection: (section: ActiveSection) => void;
  menuButtonRef: React.RefObject<HTMLButtonElement>;
  closeButtonRef: React.RefObject<HTMLButtonElement>;
  handleBackdropClick: (e: React.MouseEvent<HTMLDivElement>) => void;
}

export const MobileNavigation: React.FC<MobileNavigationProps> = ({
  activeSection,
  activeLabel,
  mobileMenuOpen,
  setMobileMenuOpen,
  setActiveSection,
  menuButtonRef,
  closeButtonRef,
  handleBackdropClick,
}) => {
  return (
    <>
      <header
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: 'var(--spacing-md)',
          background: 'var(--bg-deep-navy)',
          borderBottom: '1px solid var(--border-glass)',
        }}
        className="hide-desktop-flex"
      >
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span
            style={{ fontWeight: 800, fontSize: 'var(--font-md)', color: 'var(--color-accent)' }}
          >
            CarbonCoach {activeLabel ? `· ${activeLabel}` : ''}
          </span>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
            Understand your footprint.
          </span>
        </div>
        <button
          ref={menuButtonRef}
          onClick={() => setMobileMenuOpen(true)}
          aria-expanded={mobileMenuOpen}
          aria-label="Open navigation"
          style={{
            background: 'transparent',
            border: '1px solid var(--border-glass)',
            color: 'var(--text-primary)',
            borderRadius: 'var(--radius-xs)',
            padding: 'var(--spacing-xs) var(--spacing-sm)',
            cursor: 'pointer',
            minHeight: '44px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          Menu
        </button>
      </header>

      {mobileMenuOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Navigation drawer"
          onClick={handleBackdropClick}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(15, 23, 42, 0.75)',
            backdropFilter: 'blur(4px)',
            zIndex: 1000,
            display: 'flex',
            justifyContent: 'flex-start',
          }}
          className="hide-desktop-flex"
        >
          <nav
            style={{
              width: 'min(300px, 80vw)',
              background: 'var(--bg-deep-navy)',
              borderRight: '1px solid var(--border-glass)',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              padding: 'var(--spacing-lg) var(--spacing-md)',
              boxShadow: 'var(--shadow-lg)',
            }}
          >
            <div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: 'var(--spacing-xl)',
                }}
              >
                <span
                  style={{
                    fontWeight: 800,
                    fontSize: 'var(--font-xl)',
                    color: 'var(--color-accent)',
                  }}
                >
                  CarbonCoach
                </span>
                <button
                  ref={closeButtonRef}
                  onClick={() => setMobileMenuOpen(false)}
                  aria-label="Close navigation"
                  style={{
                    background: 'transparent',
                    border: '1px solid var(--border-glass)',
                    color: 'var(--text-primary)',
                    borderRadius: 'var(--radius-xs)',
                    padding: 'var(--spacing-xs) var(--spacing-sm)',
                    cursor: 'pointer',
                    minHeight: '44px',
                    minWidth: '44px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  ✕
                </button>
              </div>

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
                      onClick={() => {
                        setActiveSection(item.id as ActiveSection);
                        setMobileMenuOpen(false);
                      }}
                      style={{
                        background: activeSection === item.id ? 'var(--bg-card)' : 'transparent',
                        border: 'none',
                        color:
                          activeSection === item.id
                            ? 'var(--color-accent)'
                            : 'var(--text-secondary)',
                        padding: 'var(--spacing-sm)',
                        width: '100%',
                        textAlign: 'left',
                        borderRadius: 'var(--radius-sm)',
                        cursor: 'pointer',
                        minHeight: '44px',
                      }}
                    >
                      <div style={{ fontWeight: 600 }}>{item.label}</div>
                      <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)' }}>
                        {item.description}
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <footer
              style={{
                borderTop: '1px solid var(--border-glass)',
                paddingTop: 'var(--spacing-md)',
              }}
            >
              <p style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)', margin: 0 }}>
                Local-first sandbox · AI-assisted coach
              </p>
            </footer>
          </nav>
        </div>
      )}
    </>
  );
};
