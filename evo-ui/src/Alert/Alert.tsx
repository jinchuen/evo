import React, { forwardRef, useState } from 'react';
import styles from '../css/alert.module.scss';

type AlertType = 'success' | 'error' | 'warning' | 'info';

export interface EvoAlertProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title' | 'children'> {
  type?: AlertType;
  title?: string;
  children: React.ReactNode;
  dismissible?: boolean;
  className?: string;
  /**
   * Escalates `warning` / `error` (and `info`, for composability) into a
   * higher-urgency treatment: a filled soft background, a heavier 3px
   * left severity accent, and a heavier title weight — a loss-aversion cue
   * that the message needs immediate attention. Orthogonal to `type`, so
   * any type can be urgent or not.
   * @default false
   */
  urgency?: boolean;
}

const icons: Record<AlertType, string> = {
  success: '✓', error: '✕', warning: '⚠', info: 'i',
};

export const EvoAlert = forwardRef<HTMLDivElement, EvoAlertProps>(function EvoAlert(
  {
    type = 'info',
    title,
    children,
    dismissible = false,
    className = '',
    urgency = false,
    ...rest
  },
  ref,
) {
  const [dismissed, setDismissed] = useState(false);
  if (dismissed) return null;

  return (
    <div
      ref={ref}
      className={[
        styles.alert,
        styles[type],
        urgency ? styles.urgent : '',
        className,
      ].filter(Boolean).join(' ')}
      role="alert"
      {...rest}
    >
      <span className={styles.alertIcon}>{icons[type]}</span>
      <div className={styles.alertContent}>
        {title && <p className={styles.alertTitle}>{title}</p>}
        <div className={styles.alertDescription}>{children}</div>
      </div>
      {dismissible && (
        <button
          type="button"
          className={styles.dismissBtn}
          onClick={() => setDismissed(true)}
          aria-label="Dismiss alert"
        >
          ✕
        </button>
      )}
    </div>
  );
});

EvoAlert.displayName = 'EvoAlert';
