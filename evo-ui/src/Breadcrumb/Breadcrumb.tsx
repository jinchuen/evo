import React from 'react';
import styles from '../css/breadcrumb.module.scss';

interface EvoBreadcrumbItemProps {
  children: React.ReactNode;
  href?: string;
  current?: boolean;
}

interface EvoBreadcrumbProps {
  children: React.ReactNode;
  separator?: React.ReactNode;
  className?: string;
}

const EvoBreadcrumbItem = ({ children, href, current = false }: EvoBreadcrumbItemProps) => (
  <li className={styles.item}>
    {href && !current ? (
      <a href={href} className={styles.link}>
        {children}
      </a>
    ) : (
      <span
        className={[styles.text, current ? styles.current : ''].filter(Boolean).join(' ')}
        aria-current={current ? 'page' : undefined}
      >
        {children}
      </span>
    )}
  </li>
);

export const EvoBreadcrumb = ({ children, separator = '/', className = '' }: EvoBreadcrumbProps) => {
  const items = React.Children.toArray(children);
  return (
    <nav aria-label="breadcrumb" className={className}>
      <ol className={styles.breadcrumb}>
        {items.map((item, i) => (
          <React.Fragment key={i}>
            {item}
            {i < items.length - 1 && (
              <li className={styles.separator} aria-hidden="true">
                {separator}
              </li>
            )}
          </React.Fragment>
        ))}
      </ol>
    </nav>
  );
};

EvoBreadcrumb.Item = EvoBreadcrumbItem;
