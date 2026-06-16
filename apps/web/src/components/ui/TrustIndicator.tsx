import React from 'react';

export const TrustIndicator: React.FC = () => {
  return (
    <div className="trust-indicator" role="status" aria-live="polite">
      <span className="trust-indicator-dot" aria-hidden="true" />
      <span>Local-first · Coach requests user-triggered · Backend coach ready</span>
    </div>
  );
};
