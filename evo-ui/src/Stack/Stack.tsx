import { forwardRef, type HTMLAttributes, type CSSProperties, type ReactNode } from 'react';

// `process.env.NODE_ENV` is statically replaced by every major bundler
// (Vite / webpack / Rollup / Next), so the dev-only gap warning below is stripped
// from production builds. Declared loosely so this zero-dep library still
// typechecks without @types/node.
declare const process: { env: { NODE_ENV?: string } } | undefined;

type Direction = 'row' | 'column';
type Align = 'start' | 'center' | 'end' | 'stretch' | 'baseline';
type Justify = 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';

export interface EvoStackProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  direction?: Direction;
  /**
   * Gap between items. A `number` is treated as raw pixels (e.g. `16` →
   * `16px`); a `string` is used as-is as any CSS length (e.g. `'0.75rem'`).
   * @default '1rem'
   */
  gap?: number | string;
  align?: Align;
  justify?: Justify;
  wrap?: boolean;
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

export const EvoStack = forwardRef<HTMLDivElement, EvoStackProps>(
  (
    {
      children,
      direction = 'column',
      gap = '1rem',
      align = 'stretch',
      justify = 'start',
      wrap = false,
      className = '',
      style,
      ...rest
    },
    ref
  ) => {
    if (typeof process !== 'undefined' && process.env.NODE_ENV !== 'production' && typeof gap === 'number' && gap % 4 !== 0) {
      // eslint-disable-next-line no-console
      console.warn(
        `[EvoStack] gap={${gap}} is not a multiple of 4px. Evo UI's spacing scale is a 4pt ` +
          `grid — prefer a rem multiple of 4 (e.g. gap="1rem") or one of the .gap-{n} utility ` +
          `classes so spacing stays consistent across the app.`
      );
    }

    return (
      <div
        ref={ref}
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
        {...rest}
      >
        {children}
      </div>
    );
  }
);

EvoStack.displayName = 'EvoStack';
