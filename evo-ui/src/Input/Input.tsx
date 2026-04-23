import React from 'react';
import styles from '../css/input.module.scss';

interface EvoInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  helperText?: string;
  error?: string;
  size?: 'sm' | 'md' | 'lg';
  leadingAdornment?: React.ReactNode;
  trailingAdornment?: React.ReactNode;
  fullWidth?: boolean;
}

export const EvoInput = ({
  label,
  helperText,
  error,
  size = 'md',
  leadingAdornment,
  trailingAdornment,
  fullWidth = false,
  className = '',
  id,
  ...rest
}: EvoInputProps) => {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className={[styles.field, fullWidth ? styles.fullWidth : '', className].filter(Boolean).join(' ')}>
      {label && (
        <label htmlFor={inputId} className={styles.label}>
          {label}
        </label>
      )}

      <div
        className={[
          styles.inputWrapper,
          styles[size],
          error ? styles.hasError : '',
        ]
          .filter(Boolean)
          .join(' ')}
      >
        {leadingAdornment && <span className={styles.adornment}>{leadingAdornment}</span>}
        <input
          id={inputId}
          className={styles.input}
          aria-invalid={!!error}
          aria-describedby={
            error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined
          }
          {...rest}
        />
        {trailingAdornment && (
          <span className={`${styles.adornment} ${styles.trailingAdornment}`}>
            {trailingAdornment}
          </span>
        )}
      </div>

      {error && (
        <p id={`${inputId}-error`} className={styles.errorText}>
          {error}
        </p>
      )}
      {!error && helperText && (
        <p id={`${inputId}-helper`} className={styles.helperText}>
          {helperText}
        </p>
      )}
    </div>
  );
};
