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
import { CarbonProfile, calculateFootprint } from '@carboncoach/shared';
import { ProfileOnboarding } from '../features/profile';
import { FootprintSummary, formatCategoryLabel } from '../features/footprint';
import { RecommendationPanel } from '../features/recommendations';
import { DailyChoiceLab } from '../features/choices';
import {
  loadStoredProfile,
  saveStoredProfile,
  clearAllLocalCarbonCoachData,
  WeeklyTracker,
  LocalDataControls,
} from '../features/tracker';

export const AppShell: React.FC = () => {
  const [activeSection, setActiveSection] = useState<ActiveSection>('overview');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [savedProfile, setSavedProfile] = useState<CarbonProfile | null>(() => loadStoredProfile());

  const estimate = savedProfile ? calculateFootprint(savedProfile) : null;

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
                  {savedProfile ? (
                    <>
                      <p>
                        Your profile is configured. You can view or edit details in the Profile tab.
                      </p>
                      <StatusBadge variant="low" label="Configured" />
                    </>
                  ) : (
                    <>
                      <p>Estimate will appear after onboarding.</p>
                      <StatusBadge variant="moderate" label="Not Configured" />
                    </>
                  )}
                </div>
              </Card>

              <Card title="Top Contributor">
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
                  {estimate && estimate.topCategory ? (
                    <>
                      <p>
                        Largest source: <strong>{formatCategoryLabel(estimate.topCategory)}</strong>
                      </p>
                      <StatusBadge variant="high" label="Analysis Ready" />
                    </>
                  ) : (
                    <>
                      <p>Top category impact band analysis will be calculated after onboarding.</p>
                      <StatusBadge variant="info" label="Awaiting Profile" />
                    </>
                  )}
                </div>
              </Card>

              <Card title="Active Week Action Plan">
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
                  {savedProfile ? (
                    <>
                      <p>Custom weekly plan actions are available in the actions tracker.</p>
                      <StatusBadge variant="low" label="Plan Generated" />
                    </>
                  ) : (
                    <>
                      <p>A customized weekly plan will be generated based on your profile.</p>
                      <StatusBadge variant="info" label="Awaiting Profile" />
                    </>
                  )}
                </div>
              </Card>
            </div>

            <div className="grid-two-cols" style={{ marginTop: 'var(--spacing-md)' }}>
              <Card title="Daily Choice Lab Preview">
                <p style={{ marginBottom: 'var(--spacing-md)' }}>
                  Compare transit, meal, and shipping decisions using clear impact bands and get
                  Scenario-based choice guidance will be added in a later task.
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
                <ProgressMeter value={0} max={100} label="Weekly action progress" />
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
            <ProfileOnboarding
              savedProfile={savedProfile}
              onSaveProfile={(profile) => {
                saveStoredProfile(profile);
                setSavedProfile(profile);
              }}
              onClearProfile={() => {
                clearAllLocalCarbonCoachData();
                setSavedProfile(null);
              }}
            />
            {savedProfile && (
              <div style={{ marginTop: 'var(--spacing-md)' }}>
                <LocalDataControls hasData={true} onClear={() => setSavedProfile(null)} />
              </div>
            )}
          </div>
        );

      case 'footprint':
        return (
          <div>
            <SectionHeader
              title="Footprint Summary"
              subtitle="Review breakdowns derived from your lifestyle profile inputs"
            />
            <FootprintSummary
              profile={savedProfile}
              onNavigateToProfile={() => setActiveSection('profile')}
            />
          </div>
        );

      case 'recommendations':
        return (
          <div>
            <SectionHeader
              title="Recommendations & Action Plan"
              subtitle="Practical, deterministic steps to reduce your daily carbon footprint"
            />
            <RecommendationPanel
              profile={savedProfile}
              onNavigateToProfile={() => setActiveSection('profile')}
            />
          </div>
        );

      case 'choice-lab':
        return <DailyChoiceLab profile={savedProfile} />;

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
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)' }}>
            <SectionHeader
              title="Weekly Tracker"
              subtitle="Log your completed low-impact actions"
            />
            <WeeklyTracker
              profile={savedProfile}
              onNavigateToOnboarding={() => setActiveSection('profile')}
            />
            <LocalDataControls
              hasData={savedProfile !== null}
              onClear={() => setSavedProfile(null)}
            />
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
