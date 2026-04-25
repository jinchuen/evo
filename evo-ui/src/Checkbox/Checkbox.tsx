import React from 'react';
import styles from '../css/checkbox.module.scss';

interface EvoCheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  helperText?: string;
  indeterminate?: boolean;
}

interface EvoCheckboxGroupProps {
  children: React.ReactNode;
  label?: string;
  className?: string;
}

const EvoCheckboxGroup = ({ children, label, className = '' }: EvoCheckboxGroupProps) => (
  <fieldset className={`${styles.group} ${className}`}>
    {label && <legend className={styles.groupLabel}>{label}</legend>}
    {children}
  </fieldset>
);

export const EvoCheckbox = ({
  label,
  helperText,
  indeterminate = false,
  className = '',
  disabled,
  id,
  ...rest
}: EvoCheckboxProps) => {
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (inputRef.current) inputRef.current.indeterminate = indeterminate;
  }, [indeterminate]);

  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className={[styles.checkbox, disabled ? styles.disabled : '', className].filter(Boolean).join(' ')}>
      <input
        type="checkbox"
        id={inputId}
        ref={inputRef}
        disabled={disabled}
        className={styles.input}
        {...rest}
      />
      <label htmlFor={inputId} className={styles.label}>
        <span className={styles.checkmark} />
        <span className={styles.labelText}>{label}</span>
      </label>
      {helperText && <p className={styles.helperText}>{helperText}</p>}
    </div>
  );
};

EvoCheckbox.Group = EvoCheckboxGroup;
