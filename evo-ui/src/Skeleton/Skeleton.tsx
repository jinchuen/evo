import styles from '../css/skeleton.module.scss';

interface EvoSkeletonProps {
  width?: number | string;
  height?: number | string;
  borderRadius?: number | string;
  className?: string;
  animated?: boolean;
}

interface EvoSkeletonTextProps {
  lines?: number;
  className?: string;
  animated?: boolean;
}

interface EvoSkeletonCircleProps {
  size?: number | string;
  className?: string;
  animated?: boolean;
}

const toSize = (v: number | string) => (typeof v === 'number' ? `${v}px` : v);

const EvoSkeletonText = ({ lines = 3, className = '', animated = true }: EvoSkeletonTextProps) => (
  <div className={`${styles.textGroup} ${className}`}>
    {Array.from({ length: lines }).map((_, i) => (
      <div
        key={i}
        className={[styles.skeleton, animated ? styles.animated : ''].filter(Boolean).join(' ')}
        style={{
          width: i === lines - 1 ? '65%' : '100%',
          height: '0.875rem',
          borderRadius: '4px',
        }}
      />
    ))}
  </div>
);

const EvoSkeletonCircle = ({ size = 40, className = '', animated = true }: EvoSkeletonCircleProps) => (
  <div
    className={[styles.skeleton, animated ? styles.animated : '', className].filter(Boolean).join(' ')}
    style={{
      width: toSize(size),
      height: toSize(size),
      borderRadius: '50%',
    }}
  />
);

export const EvoSkeleton = ({
  width = '100%',
  height = '1rem',
  borderRadius = '6px',
  className = '',
  animated = true,
}: EvoSkeletonProps) => (
  <div
    className={[styles.skeleton, animated ? styles.animated : '', className].filter(Boolean).join(' ')}
    style={{
      width: toSize(width),
      height: toSize(height),
      borderRadius: toSize(borderRadius),
    }}
  />
);

EvoSkeleton.Text = EvoSkeletonText;
EvoSkeleton.Circle = EvoSkeletonCircle;
