import React from 'react';
import styles from '../css/select.module.scss';

interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface EvoSelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  label?: string;
  options: SelectOption[];
  placeholder?: string;
  helperText?: string;
  error?: string;
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

export const EvoSelect = ({
  label,
  options,
  placeholder,
  helperText,
  error,
  size = 'md',
  fullWidth = false,
  className = '',
  id,
  ...rest
}: EvoSelectProps) => {
  const selectId = id ?? label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className={[styles.field, fullWidth ? styles.fullWidth : '', className].filter(Boolean).join(' ')}>
      {label && (
        <label htmlFor={selectId} className={styles.label}>
          {label}
        </label>
      )}

      <div
        className={[
          styles.selectWrapper,
          styles[size],
          error ? styles.hasError : '',
        ]
          .filter(Boolean)
          .join(' ')}
      >
        <select id={selectId} className={styles.select} aria-invalid={!!error} {...rest}>
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} disabled={opt.disabled}>
              {opt.label}
            </option>
          ))}
        </select>
        <span className={styles.chevron}>▾</span>
      </div>

      {error && <p className={styles.errorText}>{error}</p>}
      {!error && helperText && <p className={styles.helperText}>{helperText}</p>}
    </div>
  );
};
