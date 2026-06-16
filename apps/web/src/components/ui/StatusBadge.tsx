import React from 'react';

export type BadgeVariant = 'low' | 'moderate' | 'high' | 'info';

export interface StatusBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant: BadgeVariant;
  label: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  variant,
  label,
  className = '',
  ...props
}) => {
  const variantClass = `badge-${variant}`;
  return (
    <span className={`badge ${variantClass} ${className}`} {...props}>
      <span className="sr-only">{variant} impact: </span>
      {label}
    </span>
  );
};
