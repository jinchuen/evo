import styles from '../css/divider.module.scss';

interface EvoDividerProps {
  orientation?: 'horizontal' | 'vertical';
  label?: string;
  className?: string;
}

export const EvoDivider = ({ orientation = 'horizontal', label, className = '' }: EvoDividerProps) => {
  if (label) {
    return (
      <div className={`${styles.labeled} ${className}`}>
        <div className={styles.line} />
        <span className={styles.labelText}>{label}</span>
        <div className={styles.line} />
      </div>
    );
  }

  return (
    <div
      className={[
        styles.divider,
        orientation === 'vertical' ? styles.vertical : styles.horizontal,
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    />
  );
};
