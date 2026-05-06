import React, { useState } from 'react';
import styles from '../css/nav.module.scss';

export interface NavSubItem {
  label: string;
  active?: boolean;
  icon?: React.ReactNode;
  onClick?: () => void;
  items?: NavSubItem[];
}

interface EvoNavItemProps {
  children: React.ReactNode;
  active?: boolean;
  icon?: React.ReactNode;
  onClick?: () => void;
  className?: string;
  items?: NavSubItem[];
}

interface EvoNavGroupProps {
  label: string;
  children: React.ReactNode;
}

interface EvoNavProps {
  children: React.ReactNode;
  className?: string;
}

interface EvoNavSkeletonProps {
  count?: number;
}

interface EvoNavQuickActionProps {
  label?: string;
  onClick?: () => void;
}

const ChevronIcon = ({ open }: { open: boolean }) => (
  <svg
    viewBox="0 0 16 16"
    fill="none"
    width="12"
    height="12"
    className={[styles.chevron, open ? styles.chevronOpen : ''].filter(Boolean).join(' ')}
  >
    <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const PlusIcon = () => (
  <svg viewBox="0 0 16 16" fill="none" width="14" height="14">
    <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const SubNavItem = ({ item, depth }: { item: NavSubItem; depth: number }) => {
  const [open, setOpen] = useState(false);
  const hasChildren = !!(item.items && item.items.length > 0);

  const handleClick = () => {
    if (hasChildren) setOpen(o => !o);
    item.onClick?.();
  };

  return (
    <li>
      <button
        className={[styles.navItem, item.active ? styles.active : ''].filter(Boolean).join(' ')}
        style={{ paddingLeft: `${0.75 + depth * 0.875}rem` }}
        onClick={handleClick}
      >
        {item.icon && <span className={styles.navIcon}>{item.icon}</span>}
        <span className={styles.navItemLabel}>{item.label}</span>
        {hasChildren && <ChevronIcon open={open} />}
      </button>
      {hasChildren && open && (
        <ul className={styles.navSubList}>
          {item.items!.map((child, i) => (
            <SubNavItem key={i} item={child} depth={depth + 1} />
          ))}
        </ul>
      )}
    </li>
  );
};

const EvoNavItem = ({ children, active = false, icon, onClick, className = '', items }: EvoNavItemProps) => {
  const [open, setOpen] = useState(false);
  const hasChildren = !!(items && items.length > 0);

  const handleClick = () => {
    if (hasChildren) setOpen(o => !o);
    onClick?.();
  };

  return (
    <li>
      <button
        className={[styles.navItem, active ? styles.active : '', className].filter(Boolean).join(' ')}
        onClick={handleClick}
      >
        {icon && <span className={styles.navIcon}>{icon}</span>}
        <span className={styles.navItemLabel}>{children}</span>
        {hasChildren && <ChevronIcon open={open} />}
      </button>
      {hasChildren && open && (
        <ul className={styles.navSubList}>
          {items!.map((child, i) => (
            <SubNavItem key={i} item={child} depth={1} />
          ))}
        </ul>
      )}
    </li>
  );
};

const EvoNavGroup = ({ label, children }: EvoNavGroupProps) => (
  <li className={styles.navGroup}>
    <span className={styles.navGroupLabel}>{label}</span>
    <ul className={styles.navList}>{children}</ul>
  </li>
);

const EvoNavSkeleton = ({ count = 4 }: EvoNavSkeletonProps) => (
  <>
    {Array.from({ length: count }).map((_, i) => (
      <li key={i} className={styles.navSkeletonItem}>
        <span className={styles.navSkeletonIcon} />
        <span className={styles.navSkeletonText} style={{ width: `${45 + (i % 4) * 12}%` }} />
      </li>
    ))}
  </>
);

const EvoNavQuickAction = ({ label = 'Create New', onClick }: EvoNavQuickActionProps) => (
  <li>
    <button className={styles.navQuickAction} onClick={onClick}>
      <PlusIcon />
      <span>{label}</span>
    </button>
  </li>
);

export const EvoNav = ({ children, className = '' }: EvoNavProps) => (
  <nav className={`${styles.nav} ${className}`}>
    <ul className={styles.navList}>{children}</ul>
  </nav>
);

EvoNav.Item = EvoNavItem;
EvoNav.Group = EvoNavGroup;
EvoNav.Skeleton = EvoNavSkeleton;
EvoNav.QuickAction = EvoNavQuickAction;
