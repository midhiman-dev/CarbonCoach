import React, { useState } from 'react';
import { navigationItems } from './navigation';
import { ActiveSection } from './routes';
import {
  Card,
  Container,
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
  useWeeklyTracker,
} from '../features/tracker';
import { CarbonWorld } from '../features/world';

export const AppShell: React.FC = () => {
  const [activeSection, setActiveSection] = useState<ActiveSection>('overview');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [savedProfile, setSavedProfile] = useState<CarbonProfile | null>(() => loadStoredProfile());
  const { trackerState, weeklyPlanActions, toggleAction, resetTracker, progress } =
    useWeeklyTracker(savedProfile);

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
                      <StatusBadge variant="high" label="Calculated from profile" />
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
                      <p>
                        Custom weekly plan actions are ready. Visit the Weekly Tracker to track your
                        actions.
                      </p>
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
              <Card title="Daily Choice Lab">
                <p style={{ marginBottom: 'var(--spacing-md)' }}>
                  Compare everyday scenarios using deterministic impact bands and receive
                  AI-assisted coaching on lower-impact options.
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
                  <StatusBadge variant="low" label="Daily Choice Lab Ready" />
                  <button
                    onClick={() => setActiveSection('choice-lab')}
                    className="btn btn-primary"
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

              <Card title="Carbon World Status">
                <p style={{ marginBottom: 'var(--spacing-md)' }}>
                  Your personal visual world grows based on your weekly action progress. Complete
                  actions to clear the sky and plant trees!
                </p>
                {savedProfile && trackerState && weeklyPlanActions.length > 0 ? (
                  <>
                    <ProgressMeter
                      value={progress.percent}
                      max={100}
                      label="Weekly action progress"
                    />
                    <p
                      style={{
                        fontSize: 'var(--font-size-xs)',
                        color: 'var(--color-text-secondary)',
                        marginTop: 'var(--spacing-sm)',
                        fontWeight: 600,
                      }}
                    >
                      Current stage:{' '}
                      {progress.percent === 0
                        ? 'Seed'
                        : progress.percent <= 33
                          ? 'Sprout'
                          : progress.percent <= 66
                            ? 'Garden'
                            : 'Grove'}{' '}
                      ({progress.completed} of {progress.total} actions)
                    </p>
                  </>
                ) : (
                  <>
                    <ProgressMeter value={0} max={100} label="Weekly action progress" />
                    <p
                      style={{
                        fontSize: 'var(--font-size-xs)',
                        color: 'var(--color-text-secondary)',
                        marginTop: 'var(--spacing-sm)',
                      }}
                    >
                      Set up your profile and start your weekly tracker to grow your Carbon World.
                    </p>
                  </>
                )}
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
          <CarbonWorld
            profile={savedProfile}
            weeklyPlanActions={weeklyPlanActions}
            trackerState={trackerState}
            onNavigateToOnboarding={() => setActiveSection('profile')}
            onNavigateToTracker={() => setActiveSection('tracker')}
          />
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
              trackerState={trackerState}
              weeklyPlanActions={weeklyPlanActions}
              toggleAction={toggleAction}
              resetTracker={resetTracker}
              progress={progress}
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
              title="Privacy & Local Data"
              subtitle="How your carbon lifestyle data is managed"
            />
            <Card title="Local-First Data Isolation">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
                <p style={{ margin: 0 }}>
                  CarbonCoach is built with a local-first design. Your profile preferences and
                  weekly tracker progress stay strictly in this browser.
                </p>
                <p style={{ margin: 0 }}>
                  No login, database, or cloud-hosted user profile is used. You remain completely
                  anonymous.
                </p>
                <p style={{ margin: 0 }}>
                  When you explicitly trigger a Coach request, minimized, anonymous calculation or
                  scenario context is sent to our backend to fetch AI coaching responses. Raw
                  profile details and full tracker history are never sent as local data dumps.
                </p>
                <p style={{ margin: 0 }}>
                  You retain complete control of your data. Local data can be cleared at any time
                  from this device using the controls on the Profile page.
                </p>
                <div style={{ display: 'flex', gap: 'var(--spacing-xs)', flexWrap: 'wrap' }}>
                  <StatusBadge variant="info" label="Local Data Stored" />
                  <StatusBadge variant="info" label="No Account Required" />
                </div>
              </div>
            </Card>
          </div>
        );

      case 'assumptions':
        return (
          <div>
            <SectionHeader
              title="Estimates & Assumptions"
              subtitle="How our calculations map to carbon coefficients"
            />
            <Card title="Transparency: Estimates & Assumptions">
              <p style={{ margin: 0 }}>
                CarbonCoach uses deterministic TypeScript logic and simplified demo emission factors
                to estimate lifestyle footprint patterns. Results are approximate and intended for
                awareness, not formal reporting.
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
