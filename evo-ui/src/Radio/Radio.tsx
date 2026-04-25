import React, { createContext, useContext } from 'react';
import styles from '../css/radio.module.scss';

interface RadioGroupContextType {
  name: string;
  value: string;
  onChange: (value: string) => void;
}

const RadioGroupContext = createContext<RadioGroupContextType | null>(null);

interface EvoRadioGroupProps {
  children: React.ReactNode;
  name: string;
  value: string;
  onChange: (value: string) => void;
  label?: string;
  className?: string;
}

interface EvoRadioProps {
  value: string;
  label: string;
  disabled?: boolean;
  className?: string;
}

const EvoRadioGroup = ({
  children,
  name,
  value,
  onChange,
  label,
  className = '',
}: EvoRadioGroupProps) => (
  <RadioGroupContext.Provider value={{ name, value, onChange }}>
    <fieldset className={`${styles.group} ${className}`}>
      {label && <legend className={styles.groupLabel}>{label}</legend>}
      {children}
    </fieldset>
  </RadioGroupContext.Provider>
);

export const EvoRadio = ({ value, label, disabled = false, className = '' }: EvoRadioProps) => {
  const ctx = useContext(RadioGroupContext);
  const isChecked = ctx ? ctx.value === value : false;
  const inputId = `${ctx?.name ?? 'radio'}-${value}`;

  return (
    <div className={[styles.radio, disabled ? styles.disabled : '', className].filter(Boolean).join(' ')}>
      <input
        type="radio"
        id={inputId}
        name={ctx?.name}
        value={value}
        checked={isChecked}
        disabled={disabled}
        className={styles.input}
        onChange={() => ctx?.onChange(value)}
      />
      <label htmlFor={inputId} className={styles.label}>
        <span className={styles.radiomark} />
        <span className={styles.labelText}>{label}</span>
      </label>
    </div>
  );
};

EvoRadio.Group = EvoRadioGroup;
