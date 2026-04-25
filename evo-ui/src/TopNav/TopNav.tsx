import React from 'react';
import styles from '../css/topnav.module.scss';

interface EvoTopNavProps {
  children: React.ReactNode;
  className?: string;
}

interface EvoTopNavBrandProps {
  children: React.ReactNode;
  className?: string;
}

interface EvoTopNavItemProps {
  children: React.ReactNode;
  active?: boolean;
  icon?: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

interface EvoTopNavActionsProps {
  children: React.ReactNode;
  className?: string;
}

const EvoTopNavBrand = ({ children, className = '' }: EvoTopNavBrandProps) => (
  <div className={`${styles.topNavBrand} ${className}`}>{children}</div>
);

const EvoTopNavItem = ({ children, active = false, icon, onClick, className = '' }: EvoTopNavItemProps) => (
  <li>
    <button
      className={[styles.topNavItem, active ? styles.active : '', className].filter(Boolean).join(' ')}
      onClick={onClick}
    >
      {icon && <span className={styles.topNavIcon}>{icon}</span>}
      <span>{children}</span>
    </button>
  </li>
);

const EvoTopNavActions = ({ children, className = '' }: EvoTopNavActionsProps) => (
  <div className={`${styles.topNavActions} ${className}`}>{children}</div>
);

export const EvoTopNav = ({ children, className = '' }: EvoTopNavProps) => (
  <nav className={`${styles.topNav} ${className}`}>
    <div className={styles.topNavInner}>
      {children}
    </div>
  </nav>
);

EvoTopNav.Brand = EvoTopNavBrand;
EvoTopNav.Menu = ({ children }: { children: React.ReactNode }) => (
  <ul className={styles.topNavMenu}>{children}</ul>
);
EvoTopNav.Item = EvoTopNavItem;
EvoTopNav.Actions = EvoTopNavActions;
