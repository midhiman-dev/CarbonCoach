import React, { useState, useRef, useEffect } from 'react';
import { navigationItems } from './navigation';
import { ActiveSection } from './routes';
import { Container } from '../components/ui';
import { CarbonProfile, calculateFootprint } from '@carboncoach/shared';
import {
  loadStoredProfile,
  saveStoredProfile,
  useWeeklyTracker,
} from '../features/tracker';
import { MobileNavigation } from './MobileNavigation';
import { DesktopNavigation } from './DesktopNavigation';
import { AppContent } from './AppContent';

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

  const activeItem = navigationItems.find((item) => item.id === activeSection);
  const activeLabel = activeItem ? activeItem.label : '';

  return (
    <>
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>

      <div className="app-container">
        <MobileNavigation
          activeSection={activeSection}
          activeLabel={activeLabel}
          mobileMenuOpen={mobileMenuOpen}
          setMobileMenuOpen={setMobileMenuOpen}
          setActiveSection={setActiveSection}
          menuButtonRef={menuButtonRef}
          closeButtonRef={closeButtonRef}
          handleBackdropClick={handleBackdropClick}
        />

        <DesktopNavigation
          activeSection={activeSection}
          setActiveSection={setActiveSection}
        />

        {/* Main Workspace content */}
        <main id="main-content" className="main-content">
          <Container>
            <AppContent
              activeSection={activeSection}
              setActiveSection={setActiveSection}
              savedProfile={savedProfile}
              setSavedProfile={setSavedProfile}
              saveStoredProfile={saveStoredProfile}
              estimate={estimate}
              weeklyPlanActions={weeklyPlanActions}
              progress={progress}
              trackerState={trackerState}
              toggleAction={toggleAction}
              resetTracker={resetTracker}
            />
          </Container>
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

