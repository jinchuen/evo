import React, { CSSProperties } from 'react';

interface EvoGridProps {
  children: React.ReactNode;
  cols?: number | string;
  rows?: number | string;
  gap?: number | string;
  colGap?: number | string;
  rowGap?: number | string;
  className?: string;
  style?: CSSProperties;
}

interface EvoGridItemProps {
  children: React.ReactNode;
  colSpan?: number;
  rowSpan?: number;
  className?: string;
  style?: CSSProperties;
}

const toSize = (v: number | string | undefined) =>
  v === undefined ? undefined : typeof v === 'number' ? `${v}px` : v;

const EvoGridItem = ({ children, colSpan, rowSpan, className = '', style }: EvoGridItemProps) => (
  <div
    className={className}
    style={{
      gridColumn: colSpan ? `span ${colSpan}` : undefined,
      gridRow: rowSpan ? `span ${rowSpan}` : undefined,
      ...style,
    }}
  >
    {children}
  </div>
);

export const EvoGrid = ({
  children,
  cols = 3,
  rows,
  gap = '1rem',
  colGap,
  rowGap,
  className = '',
  style,
}: EvoGridProps) => (
  <div
    className={className}
    style={{
      display: 'grid',
      gridTemplateColumns: typeof cols === 'number' ? `repeat(${cols}, 1fr)` : cols,
      gridTemplateRows: rows
        ? typeof rows === 'number' ? `repeat(${rows}, auto)` : rows
        : undefined,
      gap: toSize(gap),
      columnGap: toSize(colGap),
      rowGap: toSize(rowGap),
      ...style,
    }}
  >
    {children}
  </div>
);

EvoGrid.Item = EvoGridItem;
