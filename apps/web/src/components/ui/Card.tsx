import React, { useId } from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
}

export const Card: React.FC<CardProps> = ({ title, children, className = '', ...props }) => {
  const headingId = useId();
  return (
    <section
      className={`card ${className}`}
      aria-labelledby={title ? headingId : undefined}
      {...props}
    >
      {title && (
        <div className="card-header">
          <h3 id={headingId} className="card-title">
            {title}
          </h3>
        </div>
      )}
      <div className="card-content">{children}</div>
    </section>
  );
};
