import React from 'react';
import styles from '../css/badge.module.scss';

type BadgeSeverity = 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info';
type BadgeVariant = 'solid' | 'outline' | 'subtle';
type BadgeSize = 'sm' | 'md' | 'lg';

interface EvoBadgeProps {
  children: React.ReactNode;
  severity?: BadgeSeverity;
  variant?: BadgeVariant;
  size?: BadgeSize;
  dot?: boolean;
  removable?: boolean;
  onRemove?: () => void;
  className?: string;
}

interface EvoBadgeGroupProps {
  children: React.ReactNode;
  className?: string;
}

const EvoBadgeGroup = ({ children, className = '' }: EvoBadgeGroupProps) => (
  <div className={`${styles.badgeGroup} ${className}`}>{children}</div>
);

export const EvoBadge = ({
  children,
  severity = 'primary',
  variant = 'solid',
  size = 'md',
  dot = false,
  removable = false,
  onRemove,
  className = '',
}: EvoBadgeProps) => (
  <span
    className={[styles.badge, styles[severity], styles[variant], styles[size], className]
      .filter(Boolean)
      .join(' ')}
  >
    {dot && <span className={styles.dot} />}
    {children}
    {removable && (
      <button className={styles.removeBtn} onClick={onRemove} aria-label="Remove">
        ✕
      </button>
    )}
  </span>
);

EvoBadge.Group = EvoBadgeGroup;
