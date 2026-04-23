import styles from '../css/toggle.module.scss';

type ToggleSize = 'sm' | 'md' | 'lg';

interface EvoToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
  size?: ToggleSize;
  className?: string;
}

const thumbSize: Record<ToggleSize, string> = { sm: '0.75rem', md: '1rem', lg: '1.25rem' };
const thumbOffset: Record<ToggleSize, string> = { sm: '0.75rem', md: '1rem', lg: '1.25rem' };

export const EvoToggle = ({
  checked,
  onChange,
  label,
  disabled = false,
  size = 'md',
  className = '',
}: EvoToggleProps) => (
  <label
    className={[styles.toggleWrapper, disabled ? styles.disabled : '', className].filter(Boolean).join(' ')}
  >
    <input
      type="checkbox"
      role="switch"
      className={styles.hiddenInput}
      checked={checked}
      disabled={disabled}
      onChange={(e) => onChange(e.target.checked)}
    />
    <span className={[styles.track, styles[size], checked ? styles.on : ''].filter(Boolean).join(' ')}>
      <span
        className={styles.thumb}
        style={{
          width: thumbSize[size],
          height: thumbSize[size],
          transform: checked ? `translateX(${thumbOffset[size]})` : 'translateX(0)',
        }}
      />
    </span>
    {label && <span className={styles.label}>{label}</span>}
  </label>
);
