import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id: string;
  error?: string;
  helperText?: string;
  required?: boolean;
}

export const Input: React.FC<InputProps> = ({
  label,
  id,
  error,
  helperText,
  required,
  className = '',
  disabled,
  ...props
}) => {
  const errorId = error ? `${id}-error` : undefined;
  const helperId = helperText ? `${id}-helper` : undefined;
  const describedBy = [errorId, helperId].filter(Boolean).join(' ') || undefined;

  return (
    <div className={`form-group ${className}`}>
      <label htmlFor={id} className={`form-label ${required ? 'form-label-required' : ''}`}>
        {label}
      </label>
      <input
        id={id}
        className="form-input"
        disabled={disabled}
        required={required}
        aria-invalid={!!error}
        aria-describedby={describedBy}
        {...props}
      />
      {error && (
        <span id={errorId} className="form-error-text" role="alert">
          {error}
        </span>
      )}
      {helperText && !error && (
        <span id={helperId} className="form-helper-text">
          {helperText}
        </span>
      )}
    </div>
  );
};
