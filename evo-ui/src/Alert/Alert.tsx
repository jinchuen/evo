import React, { useState } from 'react';
import styles from '../css/alert.module.scss';

type AlertType = 'success' | 'error' | 'warning' | 'info';

interface EvoAlertProps {
  type?: AlertType;
  title?: string;
  children: React.ReactNode;
  dismissible?: boolean;
  className?: string;
}

const icons: Record<AlertType, string> = {
  success: '✓', error: '✕', warning: '⚠', info: 'i',
};

export const EvoAlert = ({
  type = 'info',
  title,
  children,
  dismissible = false,
  className = '',
}: EvoAlertProps) => {
  const [dismissed, setDismissed] = useState(false);
  if (dismissed) return null;

  return (
    <div
      className={[styles.alert, styles[type], className].filter(Boolean).join(' ')}
      role="alert"
    >
      <span className={styles.alertIcon}>{icons[type]}</span>
      <div className={styles.alertContent}>
        {title && <p className={styles.alertTitle}>{title}</p>}
        <div className={styles.alertDescription}>{children}</div>
      </div>
      {dismissible && (
        <button
          className={styles.dismissBtn}
          onClick={() => setDismissed(true)}
          aria-label="Dismiss alert"
        >
          ✕
        </button>
      )}
    </div>
  );
};
