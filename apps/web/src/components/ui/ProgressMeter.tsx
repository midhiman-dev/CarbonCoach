import React from 'react';

export interface ProgressMeterProps {
  value: number;
  max?: number;
  label: string;
  variant?: 'primary' | 'moderate' | 'high';
  className?: string;
}

export const ProgressMeter: React.FC<ProgressMeterProps> = ({
  value,
  max = 100,
  label,
  variant,
  className = '',
}) => {
  const percentage = Math.min(100, Math.max(0, Math.round((value / max) * 100)));
  const fillClass = variant ? `progress-fill-${variant}` : '';

  return (
    <div className={`progress-container ${className}`}>
      <div className="progress-header">
        <span>{label}</span>
        <span aria-hidden="true">{percentage}%</span>
      </div>
      <div
        className="progress-track"
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-label={`${label}, ${percentage} percent complete`}
      >
        <div className={`progress-fill ${fillClass}`} style={{ width: `${percentage}%` }} />
      </div>
    </div>
  );
};
