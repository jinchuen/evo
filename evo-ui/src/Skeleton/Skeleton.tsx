import { forwardRef, type HTMLAttributes } from 'react';
import styles from '../css/skeleton.module.scss';

interface EvoSkeletonBaseProps {
  animated?: boolean;
}

export interface EvoSkeletonProps
  extends EvoSkeletonBaseProps,
    Omit<HTMLAttributes<HTMLDivElement>, 'style'> {
  width?: number | string;
  height?: number | string;
  borderRadius?: number | string;
}

export interface EvoSkeletonTextProps
  extends EvoSkeletonBaseProps,
    Omit<HTMLAttributes<HTMLDivElement>, 'style'> {
  lines?: number;
}

export interface EvoSkeletonCircleProps
  extends EvoSkeletonBaseProps,
    Omit<HTMLAttributes<HTMLDivElement>, 'style'> {
  size?: number | string;
}

const toSize = (v: number | string) => (typeof v === 'number' ? `${v}px` : v);

function cx(...parts: Array<string | undefined | false | null>) {
  return parts.filter(Boolean).join(' ');
}

const EvoSkeletonText = forwardRef<HTMLDivElement, EvoSkeletonTextProps>(
  function EvoSkeletonText({ lines = 3, className, animated = true, ...rest }, ref) {
    return (
      <div ref={ref} role="status" className={cx(styles.textGroup, className)} {...rest}>
        <span className={styles.srOnly}>Loading…</span>
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            aria-hidden="true"
            className={cx(styles.skeleton, styles.textLine, animated && styles.animated)}
            style={{
              width: i === lines - 1 ? '65%' : '100%',
            }}
          />
        ))}
      </div>
    );
  },
);
EvoSkeletonText.displayName = 'EvoSkeletonText';

const EvoSkeletonCircle = forwardRef<HTMLDivElement, EvoSkeletonCircleProps>(
  function EvoSkeletonCircle(
    { size = 40, className, animated = true, 'aria-hidden': ariaHidden = 'true', ...rest },
    ref,
  ) {
    return (
      <div
        ref={ref}
        aria-hidden={ariaHidden}
        className={cx(styles.skeleton, styles.circle, animated && styles.animated, className)}
        style={{
          width: toSize(size),
          height: toSize(size),
        }}
        {...rest}
      />
    );
  },
);
EvoSkeletonCircle.displayName = 'EvoSkeletonCircle';

const EvoSkeletonRoot = forwardRef<HTMLDivElement, EvoSkeletonProps>(
  function EvoSkeletonRoot(
    {
      width = '100%',
      height = '1rem',
      borderRadius,
      className,
      animated = true,
      'aria-hidden': ariaHidden = 'true',
      ...rest
    },
    ref,
  ) {
    return (
      <div
        ref={ref}
        aria-hidden={ariaHidden}
        className={cx(styles.skeleton, styles.rect, animated && styles.animated, className)}
        style={{
          width: toSize(width),
          height: toSize(height),
          borderRadius: borderRadius != null ? toSize(borderRadius) : undefined,
        }}
        {...rest}
      />
    );
  },
);
EvoSkeletonRoot.displayName = 'EvoSkeleton';

type EvoSkeletonComponent = typeof EvoSkeletonRoot & {
  Text: typeof EvoSkeletonText;
  Circle: typeof EvoSkeletonCircle;
};

export const EvoSkeleton = EvoSkeletonRoot as EvoSkeletonComponent;
EvoSkeleton.Text = EvoSkeletonText;
EvoSkeleton.Circle = EvoSkeletonCircle;
