import { forwardRef, type HTMLAttributes } from 'react';
import styles from '../css/divider.module.scss';

export interface EvoDividerProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * Axis the divider runs along.
   * - `horizontal` — full-width rule (default).
   * - `vertical`   — full-height rule; requires a parent with a defined
   *   height or a stretching flex/grid context.
   * @default 'horizontal'
   */
  orientation?: 'horizontal' | 'vertical';
  /** Optional text rendered inline, splitting the divider into two segments. */
  label?: string;
}

/**
 * A thin rule that separates content, optionally interrupted by a label.
 */
export const EvoDivider = forwardRef<HTMLDivElement, EvoDividerProps>(
  ({ orientation = 'horizontal', label, className = '', ...rest }, ref) => {
    if (label) {
      return (
        <div
          ref={ref}
          role="separator"
          aria-label={label}
          className={`${styles.labeled} ${className}`}
          {...rest}
        >
          <div className={styles.line} aria-hidden="true" />
          <span className={styles.labelText}>{label}</span>
          <div className={styles.line} aria-hidden="true" />
        </div>
      );
    }

    return (
      <div
        ref={ref}
        role="separator"
        aria-orientation={orientation === 'vertical' ? 'vertical' : undefined}
        className={[
          styles.divider,
          orientation === 'vertical' ? styles.vertical : styles.horizontal,
          className,
        ]
          .filter(Boolean)
          .join(' ')}
        {...rest}
      />
    );
  }
);

EvoDivider.displayName = 'EvoDivider';
