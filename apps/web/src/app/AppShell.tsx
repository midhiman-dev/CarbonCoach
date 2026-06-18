import React, { useState, useRef, useEffect } from 'react';
import { navigationItems } from './navigation';
import { ActiveSection } from './routes';
import { Container, SectionHeader } from '../components/ui';
import { CarbonProfile, calculateFootprint } from '@carboncoach/shared';
import { ProfileOnboarding } from '../features/profile';
import { FootprintSummary } from '../features/footprint';
import { RecommendationPanel } from '../features/recommendations';
import { DailyChoiceLab } from '../features/choices';
import {
  loadStoredProfile,
  saveStoredProfile,
  WeeklyTracker,
  useWeeklyTracker,
} from '../features/tracker';
import { CarbonWorld } from '../features/world';
import { PrivacyLocalDataPage } from '../features/privacy';
import { AssumptionsPage } from '../features/assumptions';
import { OverviewDashboard } from '../features/overview';

export const AppShell: React.FC = () => {
  const [activeSection, setActiveSection] = useState<ActiveSection>('overview');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [savedProfile, setSavedProfile] = useState<CarbonProfile | null>(() => loadStoredProfile());

  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Manage body scroll locking when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
      closeButtonRef.current?.focus();
    } else {
      document.body.style.overflow = '';
      menuButtonRef.current?.focus();
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  // Handle Escape key to close navigation drawer
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileMenuOpen]);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      setMobileMenuOpen(false);
    }
  };

  const { trackerState, weeklyPlanActions, toggleAction, resetTracker, progress } =
    useWeeklyTracker(savedProfile);

  const estimate = savedProfile ? calculateFootprint(savedProfile) : null;

  const renderContent = () => {
    switch (activeSection) {
      case 'overview':
        return (
          <OverviewDashboard
            savedProfile={savedProfile}
            estimate={estimate}
            weeklyPlanActionsCount={weeklyPlanActions.length}
            trackerProgress={progress}
            onNavigate={(section) => setActiveSection(section)}
          />
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
              onNavigateToFootprint={() => setActiveSection('footprint')}
              onNavigateToPrivacy={() => setActiveSection('privacy')}
            />
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
              onNavigateToRecommendations={() => setActiveSection('recommendations')}
              onNavigateToAssumptions={() => setActiveSection('assumptions')}
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
              onNavigateToTracker={() => setActiveSection('tracker')}
              trackerProgress={progress}
            />
          </div>
        );

      case 'choice-lab':
        return (
          <DailyChoiceLab
            profile={savedProfile}
            onNavigateToProfile={() => setActiveSection('profile')}
          />
        );

      case 'carbon-world':
        return (
          <CarbonWorld
            profile={savedProfile}
            weeklyPlanActions={weeklyPlanActions}
            trackerState={trackerState}
            onNavigateToOnboarding={() => setActiveSection('profile')}
            onNavigateToTracker={() => setActiveSection('tracker')}
            onNavigateToRecommendations={() => setActiveSection('recommendations')}
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
              onNavigateToWorld={() => setActiveSection('carbon-world')}
              onNavigateToPrivacy={() => setActiveSection('privacy')}
              trackerState={trackerState}
              weeklyPlanActions={weeklyPlanActions}
              toggleAction={toggleAction}
              resetTracker={resetTracker}
              progress={progress}
            />
          </div>
        );

      case 'privacy':
        return (
          <PrivacyLocalDataPage
            hasData={savedProfile !== null}
            onClear={() => setSavedProfile(null)}
          />
        );

      case 'assumptions':
        return <AssumptionsPage />;

      default:
        return null;
    }
  };

  const activeItem = navigationItems.find((item) => item.id === activeSection);
  const activeLabel = activeItem ? activeItem.label : '';

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

        {/* Collapsible Mobile Navigation Drawer */}
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
        @media (max-width: 1023px) {
          .hide-mobile-flex { display: none !important; }
          .hide-desktop-flex { display: flex !important; }
          .hide-desktop-block { display: block !important; }
        }
        @media (min-width: 1024px) {
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
