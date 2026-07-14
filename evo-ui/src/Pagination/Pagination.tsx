import { forwardRef, type HTMLAttributes } from 'react';
import styles from '../css/pagination.module.scss';

export interface EvoPaginationProps extends Omit<HTMLAttributes<HTMLElement>, 'onChange'> {
  total: number;
  page: number;
  pageSize?: number;
  siblingCount?: number;
  onChange: (page: number) => void;
  className?: string;
}

const range = (start: number, end: number) =>
  Array.from({ length: end - start + 1 }, (_, i) => start + i);

export const EvoPagination = forwardRef<HTMLElement, EvoPaginationProps>(
  (
    {
      total,
      page,
      pageSize = 10,
      siblingCount = 1,
      onChange,
      className = '',
      ...rest
    },
    ref
  ) => {
    const totalPages = Math.max(1, Math.ceil(total / pageSize));

    const getPages = (): (number | '...')[] => {
      if (totalPages <= 7) return range(1, totalPages);
      const left = Math.max(2, page - siblingCount);
      const right = Math.min(totalPages - 1, page + siblingCount);
      const pages: (number | '...')[] = [1];
      if (left > 2) pages.push('...');
      pages.push(...range(left, right));
      if (right < totalPages - 1) pages.push('...');
      if (totalPages > 1) pages.push(totalPages);
      return pages;
    };

    return (
      <nav
        ref={ref}
        className={`${styles.pagination} ${className}`}
        aria-label="Pagination"
        {...rest}
      >
        <button
          type="button"
          className={`${styles.pageBtn} ${styles.navBtn}`}
          disabled={page <= 1}
          onClick={() => onChange(page - 1)}
          aria-label="Previous page"
        >
          ‹
        </button>

        {getPages().map((p, i) =>
          p === '...' ? (
            <span key={`ellipsis-${i}`} className={styles.ellipsis}>
              …
            </span>
          ) : (
            <button
              type="button"
              key={p}
              className={[styles.pageBtn, p === page ? styles.activePage : ''].filter(Boolean).join(' ')}
              onClick={() => onChange(p)}
              aria-label={`Page ${p}`}
              aria-current={p === page ? 'page' : undefined}
            >
              {p}
            </button>
          )
        )}

        <button
          type="button"
          className={`${styles.pageBtn} ${styles.navBtn}`}
          disabled={page >= totalPages}
          onClick={() => onChange(page + 1)}
          aria-label="Next page"
        >
          ›
        </button>
      </nav>
    );
  }
);

EvoPagination.displayName = 'EvoPagination';
