import { forwardRef, Children, Fragment, type HTMLAttributes, type LiHTMLAttributes, type ReactNode } from 'react';
import styles from '../css/breadcrumb.module.scss';

function cx(...parts: Array<string | undefined | false | null>) {
  return parts.filter(Boolean).join(' ');
}

export interface EvoBreadcrumbItemProps extends Omit<LiHTMLAttributes<HTMLLIElement>, 'children'> {
  children: ReactNode;
  href?: string;
  current?: boolean;
}

export interface EvoBreadcrumbProps extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
  children: ReactNode;
  separator?: ReactNode;
}

const EvoBreadcrumbItem = forwardRef<HTMLLIElement, EvoBreadcrumbItemProps>(
  function EvoBreadcrumbItem({ children, href, current = false, className, ...rest }, ref) {
    return (
      <li ref={ref} className={cx(styles.item, className)} {...rest}>
        {href && !current ? (
          <a href={href} className={styles.link}>
            {children}
          </a>
        ) : (
          <span
            className={cx(styles.text, current && styles.current)}
            aria-current={current ? 'page' : undefined}
          >
            {children}
          </span>
        )}
      </li>
    );
  },
);
EvoBreadcrumbItem.displayName = 'EvoBreadcrumbItem';

const EvoBreadcrumbBase = forwardRef<HTMLElement, EvoBreadcrumbProps>(
  function EvoBreadcrumb({ children, separator = '/', className, ...rest }, ref) {
    const items = Children.toArray(children);
    return (
      <nav ref={ref} aria-label="breadcrumb" className={className} {...rest}>
        <ol className={styles.breadcrumb}>
          {items.map((item, i) => (
            <Fragment key={i}>
              {item}
              {i < items.length - 1 && (
                <li className={styles.separator} aria-hidden="true">
                  {separator}
                </li>
              )}
            </Fragment>
          ))}
        </ol>
      </nav>
    );
  },
);
EvoBreadcrumbBase.displayName = 'EvoBreadcrumb';

type EvoBreadcrumbComponent = typeof EvoBreadcrumbBase & {
  Item: typeof EvoBreadcrumbItem;
};

export const EvoBreadcrumb = EvoBreadcrumbBase as EvoBreadcrumbComponent;
EvoBreadcrumb.Item = EvoBreadcrumbItem;
