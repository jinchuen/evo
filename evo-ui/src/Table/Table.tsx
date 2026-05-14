'use client';

import React, { useMemo, useState } from 'react';
import styles from '../css/table.module.scss';

export type TableSize = 'sm' | 'md' | 'lg';
export type TableAlign = 'left' | 'center' | 'right';
export type TableSortDirection = 'asc' | 'desc';
export type TableResponsive = 'scroll' | 'stack';

export interface TableSortState {
  key: string;
  direction: TableSortDirection;
}

export interface TableColumn<T> {
  /** Key in the data object. Supports dot notation for nested paths ('role.name'). */
  key: string;
  /** Display label or node for the column header. */
  header: React.ReactNode;
  /** Optional fixed width, e.g. '120px' or '10%'. */
  width?: string;
  /** Cell alignment. Defaults to 'left'. */
  align?: TableAlign;
  /** Enable click-to-sort on this column. */
  sortable?: boolean;
  /** Custom comparator. Falls back to a numeric-aware string compare. */
  sortFn?: (a: T, b: T, direction: TableSortDirection) => number;
  /** Custom cell renderer. Defaults to string coercion. */
  render?: (value: unknown, row: T, rowIndex: number) => React.ReactNode;
  /** Extra class for cells in this column. */
  cellClassName?: string;
  /** Extra class for the header cell. */
  headerClassName?: string;
}

export interface EvoTableProps<T extends Record<string, unknown>> {
  /** Column definitions. */
  columns: TableColumn<T>[];
  /** Row data array. */
  data: T[];
  /** Density variant — controls cell padding and font size. Default 'md'. */
  size?: TableSize;
  /** Alternating row backgrounds. */
  striped?: boolean;
  /** Highlight rows on hover. Default true. */
  hoverable?: boolean;
  /** Add vertical dividers between columns. Default false. */
  bordered?: boolean;
  /** Keep the header pinned while the body scrolls. */
  stickyHeader?: boolean;
  /** Show skeleton rows in place of data. */
  loading?: boolean;
  /** Skeleton row count when loading. Default 5. */
  loadingRows?: number;
  /** Stable key for each row. Pass a property name or a getter. */
  rowKey?: keyof T | ((row: T, index: number) => React.Key);
  /** Custom empty-state slot. Takes priority over `emptyText`. */
  emptyState?: React.ReactNode;
  /** Plain-text fallback when data is empty. */
  emptyText?: string;
  /** Fires on single row click. */
  onRowClick?: (row: T, index: number) => void;
  /** Fires on row double-click. */
  onRowDoubleClick?: (row: T, index: number) => void;
  /** Add custom classes to specific rows. */
  getRowClassName?: (row: T, index: number) => string | undefined;
  /**
   * Small-viewport behaviour.
   * - `scroll` (default): horizontal scroll with a thin scrollbar.
   * - `stack`: under ~640px each row becomes a labelled card.
   */
  responsive?: TableResponsive;
  /** Optional caption rendered above the table. */
  caption?: React.ReactNode;
  /** Controlled sort state. Pair with `onSortChange`. */
  sort?: TableSortState | null;
  /** Sort change callback. */
  onSortChange?: (next: TableSortState | null) => void;
  /** Initial sort for uncontrolled mode. */
  defaultSort?: TableSortState;
  className?: string;
}

function getNestedValue(obj: unknown, path: string): unknown {
  return path.split('.').reduce<unknown>((acc, key) => {
    if (acc !== null && acc !== undefined && typeof acc === 'object') {
      return (acc as Record<string, unknown>)[key];
    }
    return undefined;
  }, obj);
}

function defaultCompare(a: unknown, b: unknown): number {
  if (a == null && b == null) return 0;
  if (a == null) return -1;
  if (b == null) return 1;
  if (typeof a === 'number' && typeof b === 'number') return a - b;
  return String(a).localeCompare(String(b), undefined, { numeric: true, sensitivity: 'base' });
}

function resolveRowKey<T>(
  row: T,
  index: number,
  rowKey?: keyof T | ((row: T, i: number) => React.Key),
): React.Key {
  if (typeof rowKey === 'function') return rowKey(row, index);
  if (rowKey && row && typeof row === 'object') {
    const value = (row as Record<string, unknown>)[rowKey as string];
    if (typeof value === 'string' || typeof value === 'number') return value;
  }
  return index;
}

const SortIcon = ({ direction }: { direction?: TableSortDirection }) => (
  <svg
    className={styles.sortIcon}
    width="8"
    height="12"
    viewBox="0 0 8 12"
    aria-hidden="true"
    focusable="false"
  >
    <path
      d="M4 0 L8 4 H0 Z"
      fill="currentColor"
      opacity={direction === 'asc' ? 1 : 0.3}
    />
    <path
      d="M4 12 L0 8 H8 Z"
      fill="currentColor"
      opacity={direction === 'desc' ? 1 : 0.3}
    />
  </svg>
);

export const EvoTable = <T extends Record<string, unknown>>({
  columns,
  data,
  size = 'md',
  striped = false,
  hoverable = true,
  bordered = false,
  stickyHeader = false,
  loading = false,
  loadingRows = 5,
  rowKey,
  emptyState,
  emptyText = 'No data available.',
  onRowClick,
  onRowDoubleClick,
  getRowClassName,
  responsive = 'scroll',
  caption,
  sort,
  onSortChange,
  defaultSort,
  className,
}: EvoTableProps<T>) => {
  const isControlled = sort !== undefined;
  const [internalSort, setInternalSort] = useState<TableSortState | null>(defaultSort ?? null);
  const activeSort = isControlled ? sort : internalSort;

  const handleSort = (key: string) => {
    let next: TableSortState | null;
    if (!activeSort || activeSort.key !== key) {
      next = { key, direction: 'asc' };
    } else if (activeSort.direction === 'asc') {
      next = { key, direction: 'desc' };
    } else {
      next = null;
    }
    if (!isControlled) setInternalSort(next);
    onSortChange?.(next);
  };

  const sortedData = useMemo(() => {
    if (!activeSort) return data;
    const col = columns.find((c) => c.key === activeSort.key);
    if (!col) return data;
    const direction = activeSort.direction;
    const next = [...data];
    if (col.sortFn) {
      next.sort((a, b) => col.sortFn!(a, b, direction));
    } else {
      next.sort((a, b) => {
        const av = getNestedValue(a, col.key);
        const bv = getNestedValue(b, col.key);
        const cmp = defaultCompare(av, bv);
        return direction === 'asc' ? cmp : -cmp;
      });
    }
    return next;
  }, [data, columns, activeSort]);

  const isClickable = Boolean(onRowClick || onRowDoubleClick);

  const wrapperClass = [
    styles.wrapper,
    styles[`size-${size}`],
    striped && styles.striped,
    hoverable && styles.hoverable,
    bordered && styles.bordered,
    stickyHeader && styles.stickyHeader,
    responsive === 'stack' && styles.responsiveStack,
    isClickable && styles.clickable,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const renderHeader = (col: TableColumn<T>) => {
    const align = col.align ?? 'left';
    const isSorted = activeSort?.key === col.key;
    const direction = isSorted ? activeSort!.direction : undefined;
    const ariaSort: React.AriaAttributes['aria-sort'] = isSorted
      ? direction === 'asc'
        ? 'ascending'
        : 'descending'
      : col.sortable
        ? 'none'
        : undefined;

    const thClass = [styles.th, styles[`align-${align}`], col.headerClassName]
      .filter(Boolean)
      .join(' ');

    return (
      <th
        key={col.key}
        scope="col"
        className={thClass}
        style={col.width ? { width: col.width } : undefined}
        aria-sort={ariaSort}
      >
        {col.sortable ? (
          <button
            type="button"
            className={[styles.sortBtn, isSorted ? styles.sortActive : '']
              .filter(Boolean)
              .join(' ')}
            onClick={() => handleSort(col.key)}
          >
            <span>{col.header}</span>
            <SortIcon direction={direction} />
          </button>
        ) : (
          col.header
        )}
      </th>
    );
  };

  const renderBody = () => {
    if (loading) {
      return Array.from({ length: Math.max(1, loadingRows) }).map((_, i) => (
        <tr key={`evo-skeleton-${i}`} className={styles.tr}>
          {columns.map((col) => (
            <td
              key={col.key}
              className={[styles.td, styles[`align-${col.align ?? 'left'}`]]
                .filter(Boolean)
                .join(' ')}
              data-label={typeof col.header === 'string' ? col.header : col.key}
            >
              <span className={styles.skeleton} />
            </td>
          ))}
        </tr>
      ));
    }

    if (sortedData.length === 0) {
      return (
        <tr className={styles.emptyRow}>
          <td colSpan={columns.length} className={styles.empty}>
            {emptyState ?? <span className={styles.emptyText}>{emptyText}</span>}
          </td>
        </tr>
      );
    }

    return sortedData.map((row, rowIndex) => {
      const trClass = [styles.tr, getRowClassName?.(row, rowIndex)]
        .filter(Boolean)
        .join(' ');

      return (
        <tr
          key={resolveRowKey(row, rowIndex, rowKey)}
          className={trClass}
          onClick={onRowClick ? () => onRowClick(row, rowIndex) : undefined}
          onDoubleClick={
            onRowDoubleClick ? () => onRowDoubleClick(row, rowIndex) : undefined
          }
        >
          {columns.map((col) => {
            const value = getNestedValue(row, col.key);
            const align = col.align ?? 'left';
            const tdClass = [styles.td, styles[`align-${align}`], col.cellClassName]
              .filter(Boolean)
              .join(' ');
            return (
              <td
                key={col.key}
                className={tdClass}
                data-label={typeof col.header === 'string' ? col.header : col.key}
              >
                {col.render
                  ? col.render(value, row, rowIndex)
                  : value == null
                    ? ''
                    : String(value)}
              </td>
            );
          })}
        </tr>
      );
    });
  };

  return (
    <div className={wrapperClass}>
      <div className={styles.scroll}>
        <table className={styles.table}>
          {caption && <caption className={styles.caption}>{caption}</caption>}
          <thead className={styles.thead}>
            <tr>{columns.map(renderHeader)}</tr>
          </thead>
          <tbody className={styles.tbody}>{renderBody()}</tbody>
        </table>
      </div>
    </div>
  );
};
