import React, { forwardRef, CSSProperties, HTMLAttributes } from 'react';

export interface EvoGridProps extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  cols?: number | string;
  rows?: number | string;
  gap?: number | string;
  colGap?: number | string;
  rowGap?: number | string;
  /**
   * When set, overrides `cols` and emits
   * `repeat(auto-fit, minmax(minColWidth, 1fr))` so the grid self-collapses
   * into fewer columns (down to one) as the container narrows — useful for
   * responsive card grids without a manual breakpoint.
   */
  minColWidth?: number | string;
  className?: string;
  style?: CSSProperties;
}

export interface EvoGridItemProps extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  colSpan?: number;
  rowSpan?: number;
  className?: string;
  style?: CSSProperties;
}

const toSize = (v: number | string | undefined) =>
  v === undefined ? undefined : typeof v === 'number' ? `${v}px` : v;

const EvoGridItem = forwardRef<HTMLDivElement, EvoGridItemProps>(
  ({ children, colSpan, rowSpan, className = '', style, ...rest }, ref) => (
    <div
      ref={ref}
      className={className}
      style={{
        gridColumn: colSpan ? `span ${colSpan}` : undefined,
        gridRow: rowSpan ? `span ${rowSpan}` : undefined,
        ...style,
      }}
      {...rest}
    >
      {children}
    </div>
  )
);
EvoGridItem.displayName = 'EvoGridItem';

const EvoGridBase = forwardRef<HTMLDivElement, EvoGridProps>(
  (
    {
      children,
      cols = 3,
      rows,
      gap = '1rem',
      colGap,
      rowGap,
      minColWidth,
      className = '',
      style,
      ...rest
    },
    ref
  ) => (
    <div
      ref={ref}
      className={className}
      style={{
        display: 'grid',
        gridTemplateColumns:
          minColWidth !== undefined
            ? `repeat(auto-fit, minmax(${toSize(minColWidth)}, 1fr))`
            : typeof cols === 'number'
            ? `repeat(${cols}, 1fr)`
            : cols,
        gridTemplateRows: rows
          ? typeof rows === 'number' ? `repeat(${rows}, auto)` : rows
          : undefined,
        gap: toSize(gap),
        columnGap: toSize(colGap),
        rowGap: toSize(rowGap),
        ...style,
      }}
      {...rest}
    >
      {children}
    </div>
  )
);
EvoGridBase.displayName = 'EvoGrid';

type EvoGridComponent = typeof EvoGridBase & { Item: typeof EvoGridItem };

export const EvoGrid = EvoGridBase as EvoGridComponent;
EvoGrid.Item = EvoGridItem;
