import React, { useState } from 'react';
import { navigationItems } from './navigation';
import { ActiveSection } from './routes';
import {
  Card,
  Container,
  EmptyState,
  SectionHeader,
  TrustIndicator,
  StatusBadge,
  ProgressMeter,
} from '../components/ui';

export const AppShell: React.FC = () => {
  const [activeSection, setActiveSection] = useState<ActiveSection>('overview');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const renderContent = () => {
    switch (activeSection) {
      case 'overview':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)' }}>
            <SectionHeader title="Overview" subtitle="Welcome to your CarbonCoach dashboard" />

            <div style={{ marginBottom: 'var(--spacing-md)' }}>
              <TrustIndicator />
            </div>

            <div className="grid-responsive">
              <Card title="Carbon Profile Status">
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
                  <p>Estimate will appear after onboarding.</p>
                  <StatusBadge variant="low" label="Not Configured" />
                </div>
              </Card>

              <Card title="Top Contributor">
                <p>Top category impact band analysis will be calculated after onboarding.</p>
              </Card>

              <Card title="Active Week Action Plan">
                <p>A customized weekly plan will be generated based on your profile.</p>
              </Card>
            </div>

            <div className="grid-two-cols" style={{ marginTop: 'var(--spacing-md)' }}>
              <Card title="Daily Choice Lab Preview">
                <p style={{ marginBottom: 'var(--spacing-md)' }}>
                  Compare transit, meal, and shipping decisions using clear impact bands and get
                  Gemini Choice Coach tips.
                </p>
                <EmptyState
                  title="Scenario Comparisons Coming Soon"
                  description="Choice scenario lab will be connected in a later task."
                />
              </Card>

              <Card title="Carbon World Status">
                <p style={{ marginBottom: 'var(--spacing-md)' }}>
                  Your personal visual world adapts to completed actions.
                </p>
                <ProgressMeter value={0} max={100} label="Weekly avoided impact goal progress" />
                <p
                  style={{
                    fontSize: 'var(--font-xs)',
                    color: 'var(--text-muted)',
                    marginTop: 'var(--spacing-sm)',
                  }}
                >
                  Carbon World is currently clear and ready for tracker actions.
                </p>
              </Card>
            </div>
          </div>
        );

      case 'profile':
        return (
          <div>
            <SectionHeader
              title="Carbon Profile"
              subtitle="Configure your lifestyle inputs for estimation"
            />
            <Card title="Lifestyle Profile Configuration">
              <EmptyState
                title="Profile Setup Form Coming Soon"
                description="Onboarding flows to configure commute, food, and energy will be added in Task 009."
              />
            </Card>
          </div>
        );

      case 'footprint':
        return (
          <div>
            <SectionHeader
              title="Footprint Summary & AI Coach"
              subtitle="Review breakdowns and receive personalized coaching explanations"
            />
            <div className="grid-two-cols">
              <Card title="Calculated Footprint">
                <EmptyState
                  title="Breakdown Coming Soon"
                  description="Calculated category carbon totals will load here after onboarding."
                />
              </Card>
              <Card title="Footprint Coach">
                <EmptyState
                  title="Gemini Footprint Explanation Coming Soon"
                  description="Detailed AI coaching responses will appear here after the API client integration."
                />
              </Card>
            </div>
          </div>
        );

      case 'choice-lab':
        return (
          <div>
            <SectionHeader
              title="Daily Choice Lab"
              subtitle="Evaluate scenarios and receive immediate nudges"
            />
            <Card title="Scenario Sandbox">
              <EmptyState
                title="Interactive Lab Coming Soon"
                description="Compare everyday choices (like train vs taxi, or vegetarian meal vs chicken) using deterministic impact calculations."
              />
            </Card>
          </div>
        );

      case 'carbon-world':
        return (
          <div>
            <SectionHeader
              title="Carbon World"
              subtitle="Visual display of your environment based on habits"
            />
            <Card title="World Simulation Canvas">
              <EmptyState
                title="Simulation Canvas Coming Soon"
                description="A lightweight SVG/CSS environment reflecting your actions will be built in Task 013."
              />
            </Card>
          </div>
        );

      case 'tracker':
        return (
          <div>
            <SectionHeader
              title="Weekly Tracker"
              subtitle="Log your completed low-impact actions"
            />
            <Card title="Habit Logging Panel">
              <EmptyState
                title="Interactive Logger Coming Soon"
                description="Select weekly tasks and log avoided impact with local storage persistence."
              />
            </Card>
          </div>
        );

      case 'privacy':
        return (
          <div>
            <SectionHeader
              title="Privacy Policy"
              subtitle="How your carbon lifestyle data is managed"
            />
            <Card title="Local-First Isolation Policy">
              <p style={{ marginBottom: 'var(--spacing-md)' }}>
                CarbonCoach utilizes a local-first design. All lifestyle configurations, tracker
                entries, and calculation results remain strictly isolated within your browser's
                local sandbox storage.
              </p>
              <StatusBadge variant="info" label="Local-first active" />
            </Card>
          </div>
        );

      case 'assumptions':
        return (
          <div>
            <SectionHeader
              title="透明 Estimates & Assumptions"
              subtitle="How our calculations map to carbon coefficients"
            />
            <Card title="Transparent Science Reference">
              <p>
                Carbon totals are approximations derived from transparent, standard emission
                factors. Avoided-emission calculations rely on audited TypeScript logic mapped to
                domestic averages.
              </p>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <>
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>

      <div className="app-container">
        {/* Mobile Header Navigation */}
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
              style={{ fontWeight: 800, fontSize: 'var(--font-lg)', color: 'var(--color-accent)' }}
            >
              CarbonCoach
            </span>
            <span style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)' }}>
              Understand your footprint.
            </span>
          </div>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-expanded={mobileMenuOpen}
            aria-label="Toggle navigation menu"
            style={{
              background: 'transparent',
              border: '1px solid var(--border-glass)',
              color: 'var(--text-primary)',
              borderRadius: 'var(--radius-xs)',
              padding: 'var(--spacing-xs) var(--spacing-sm)',
              cursor: 'pointer',
            }}
          >
            Menu
          </button>
        </header>

        {/* Collapsible Mobile Menu */}
        {mobileMenuOpen && (
          <nav
            aria-label="Mobile navigation"
            style={{
              background: 'var(--bg-deep-navy)',
              borderBottom: '1px solid var(--border-glass)',
              padding: 'var(--spacing-md)',
            }}
            className="hide-desktop-block"
          >
            <ul
              style={{
                listStyle: 'none',
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--spacing-sm)',
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
                        activeSection === item.id ? 'var(--color-accent)' : 'var(--text-secondary)',
                      padding: 'var(--spacing-xs) var(--spacing-sm)',
                      width: '100%',
                      textAlign: 'left',
                      borderRadius: 'var(--radius-xs)',
                      cursor: 'pointer',
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
          </nav>
        )}

        {/* Desktop Sidebar Navigation */}
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
              <h1 style={{ fontSize: 'var(--font-2xl)', color: 'var(--color-accent)' }}>
                CarbonCoach
              </h1>
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
                          activeSection === item.id
                            ? 'var(--color-accent)'
                            : 'var(--text-secondary)',
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

        {/* Main Workspace content */}
        <main id="main-content" className="main-content">
          <Container>{renderContent()}</Container>
        </main>
      </div>

      <style>{`
        @media (max-width: 767px) {
          .hide-mobile-flex { display: none !important; }
          .hide-desktop-flex { display: flex !important; }
          .hide-desktop-block { display: block !important; }
        }
        @media (min-width: 768px) {
          .hide-mobile-flex { display: flex !important; }
          .hide-desktop-flex { display: none !important; }
          .hide-desktop-block { display: none !important; }
          .nav-button-hover:hover {
            background-color: rgba(255, 255, 255, 0.03) !important;
          }
        }
      `}</style>
    </>
  );
};
