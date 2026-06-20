import React from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import type { ActiveSection } from '../../app/routes';

interface NextBestActionCardProps {
  hasProfile: boolean;
  hasActions: boolean;
  trackerProgressPercent: number;
  onNavigate: (section: ActiveSection) => void;
}

export const NextBestActionCard: React.FC<NextBestActionCardProps> = ({
  hasProfile,
  hasActions,
  trackerProgressPercent,
  onNavigate,
}) => {
  const getActionDetails = () => {
    if (!hasProfile) {
      return {
        title: 'Step 1: Build Your Carbon Profile',
        description: 'Complete onboarding in minutes to understand your lifestyle carbon drivers.',
        cta: 'Set up your profile',
        section: 'profile' as ActiveSection,
      };
    }
    if (!hasActions) {
      return {
        title: 'Step 2: Custom Action Plan Ready',
        description:
          'Review your personalized recommendations and select actions for your weekly plan.',
        cta: 'Explore recommended actions',
        section: 'recommendations' as ActiveSection,
      };
    }
    if (trackerProgressPercent < 100) {
      return {
        title: 'Step 3: Track Weekly Actions',
        description: `You have completed ${Math.round(trackerProgressPercent)}% of this week's actions. Log your progress!`,
        cta: 'Continue weekly tracker',
        section: 'tracker' as ActiveSection,
      };
    }
    return {
      title: 'Journey Complete for the Week!',
      description:
        'You completed all your weekly actions. Visit Carbon World to check the thriving grove.',
      cta: 'View Thriving Grove',
      section: 'carbon-world' as ActiveSection,
    };
  };

  const action = getActionDetails();

  return (
    <Card>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 'var(--spacing-lg)',
          flexWrap: 'wrap',
          padding: 'var(--spacing-sm)',
        }}
      >
        <div style={{ flex: 1 }}>
          <span
            style={{
              fontSize: 'var(--font-xs)',
              fontWeight: 800,
              textTransform: 'uppercase',
              color: 'var(--color-accent)',
              letterSpacing: '0.05em',
            }}
          >
            Next Best Action
          </span>
          <h4
            style={{
              fontSize: 'var(--font-lg)',
              fontWeight: 700,
              color: 'var(--text-primary)',
              margin: 'var(--spacing-2xs) 0 var(--spacing-xs) 0',
            }}
          >
            {action.title}
          </h4>
          <p style={{ fontSize: 'var(--font-sm)', color: 'var(--text-secondary)', margin: 0 }}>
            {action.description}
          </p>
        </div>
        <Button onClick={() => onNavigate(action.section)}>{action.cta}</Button>
      </div>
    </Card>
  );
};
