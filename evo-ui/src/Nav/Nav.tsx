import React from 'react';
import styles from '../css/nav.module.scss';

interface EvoNavItemProps {
  children: React.ReactNode;
  active?: boolean;
  icon?: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

interface EvoNavGroupProps {
  label: string;
  children: React.ReactNode;
}

interface EvoNavProps {
  children: React.ReactNode;
  className?: string;
}

const EvoNavItem = ({ children, active = false, icon, onClick, className = '' }: EvoNavItemProps) => (
  <li>
    <button
      className={[styles.navItem, active ? styles.active : '', className].filter(Boolean).join(' ')}
      onClick={onClick}
    >
      {icon && <span className={styles.navIcon}>{icon}</span>}
      <span>{children}</span>
    </button>
  </li>
);

const EvoNavGroup = ({ label, children }: EvoNavGroupProps) => (
  <li className={styles.navGroup}>
    <span className={styles.navGroupLabel}>{label}</span>
    <ul className={styles.navList}>{children}</ul>
  </li>
);

export const EvoNav = ({ children, className = '' }: EvoNavProps) => (
  <nav className={`${styles.nav} ${className}`}>
    <ul className={styles.navList}>{children}</ul>
  </nav>
);

EvoNav.Item = EvoNavItem;
EvoNav.Group = EvoNavGroup;
