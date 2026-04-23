import React, { CSSProperties } from 'react';

type Direction = 'row' | 'column';
type Align = 'start' | 'center' | 'end' | 'stretch' | 'baseline';
type Justify = 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';

interface EvoStackProps {
  children: React.ReactNode;
  direction?: Direction;
  gap?: number | string;
  align?: Align;
  justify?: Justify;
  wrap?: boolean;
  className?: string;
  style?: CSSProperties;
}

const alignMap: Record<Align, string> = {
  start: 'flex-start', center: 'center', end: 'flex-end',
  stretch: 'stretch', baseline: 'baseline',
};

const justifyMap: Record<Justify, string> = {
  start: 'flex-start', center: 'center', end: 'flex-end',
  between: 'space-between', around: 'space-around', evenly: 'space-evenly',
};

export const EvoStack = ({
  children,
  direction = 'column',
  gap = '1rem',
  align = 'stretch',
  justify = 'start',
  wrap = false,
  className = '',
  style,
}: EvoStackProps) => (
  <div
    className={className}
    style={{
      display: 'flex',
      flexDirection: direction,
      gap: typeof gap === 'number' ? `${gap}px` : gap,
      alignItems: alignMap[align],
      justifyContent: justifyMap[justify],
      flexWrap: wrap ? 'wrap' : 'nowrap',
      ...style,
    }}
  >
    {children}
  </div>
);
