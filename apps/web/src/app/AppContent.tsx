import React from 'react';
import { ActiveSection } from './routes';
import { SectionHeader } from '../components/ui';
import { CarbonProfile, RankedCarbonAction, WeeklyTrackerState } from '@carboncoach/shared';
import { ProfileOnboarding } from '../features/profile';
import { FootprintSummary } from '../features/footprint';
import { RecommendationPanel } from '../features/recommendations';
import { DailyChoiceLab } from '../features/choices';
import { WeeklyTracker } from '../features/tracker';
import { CarbonWorld } from '../features/world';
import { PrivacyLocalDataPage } from '../features/privacy';
import { AssumptionsPage } from '../features/assumptions';
import { OverviewDashboard } from '../features/overview';

interface AppContentProps {
  activeSection: ActiveSection;
  setActiveSection: (section: ActiveSection) => void;
  savedProfile: CarbonProfile | null;
  setSavedProfile: (profile: CarbonProfile | null) => void;
  saveStoredProfile: (profile: CarbonProfile) => void;
  estimate: ReturnType<typeof import('@carboncoach/shared').calculateFootprint> | null;
  weeklyPlanActions: RankedCarbonAction[];
  progress: { completed: number; total: number; percent: number };
  trackerState: WeeklyTrackerState | null;
  toggleAction: (actionId: string) => void;
  resetTracker: () => void;
}

export const AppContent: React.FC<AppContentProps> = ({
  activeSection,
  setActiveSection,
  savedProfile,
  setSavedProfile,
  saveStoredProfile,
  estimate,
  weeklyPlanActions,
  progress,
  trackerState,
  toggleAction,
  resetTracker,
}) => {
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
