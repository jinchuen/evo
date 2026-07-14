import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import styles from '../css/progressring.module.scss';

// ------------------------------------------------------------------------
// Design note (CLAUDE.md §2 research step)
//
// Mantine's `RingProgress` accepts a `sections` array (multiple colored
// arcs summing to 100%) — powerful, but it turns every prop that isn't
// "which section" into a per-section object, which breaks the orthogonal
// `severity` axis the rest of Evo UI relies on. Ark UI models progress as
// a state machine with a shared `value`/`min`/`max` context and a
// `<Progress.Circle>` presentation — cleaner separation, but it's built
// for a *group* of parts (root/track/range/label) where Evo just needs a
// single self-contained element.
//
// Evo's take: one value, one arc, one severity — a dashboard tile, not a
// breakdown chart (use a chart library for multi-segment donuts). The one
// mechanism worth carrying over from EvoProgress (the linear sibling) is
// `minVisible`: a purely *visual* floor on the drawn arc so a ring never
// has to render as a literally hollow, "nothing happened yet" circle —
// the goal-gradient effect (users push harder the closer they perceive
// themselves to a goal) applied to a radial indicator instead of a bar.
// It never touches `aria-valuenow`/`aria-valuetext` or the default center
// label, and — matching EvoProgress exactly — it defaults to `0` (off):
// a real 0% is a legitimate, honest state for plenty of rings on a
// dashboard (a task genuinely not started yet), so the nudge is something
// a consumer opts into per instance (e.g. an onboarding-progress tile),
// not a blanket rewrite of the truth.
// ------------------------------------------------------------------------

type Severity = 'primary' | 'success' | 'warning' | 'danger' | 'info';
type NamedSize = 'sm' | 'md' | 'lg';

const DIAMETERS: Record<NamedSize, number> = { sm: 48, md: 72, lg: 96 };

/**
 * Configuration properties for the EvoProgressRing component.
 *
 * Extends every native `<div>` attribute (aria-*, onClick, …) so consumers
 * don't have to ask for them one by one.
 */
export interface EvoProgressRingProps extends HTMLAttributes<HTMLDivElement> {
  /** Current value. Clamped to `[0, max]`. */
  value: number;

  /** @default 100 */
  max?: number;

  /**
   * Visual-only floor on the rendered arc percentage (0-100) so the ring
   * never reads as completely empty — the same goal-gradient "head start"
   * mechanism as EvoProgress's `minVisible`. Purely cosmetic:
   * `aria-valuenow`/`aria-valuetext` and the default center label always
   * report the true value.
   * @default 0
   */
  minVisible?: number;

  /**
   * Semantic color of the indicator arc.
   * @default 'primary'
   */
  severity?: Severity;

  /**
   * Named size or an explicit diameter in pixels.
   * - `sm` — 48px
   * - `md` — 72px (default)
   * - `lg` — 96px
   * @default 'md'
   */
  size?: NamedSize | number;

  /** Stroke width in pixels. Defaults to a value proportional to the diameter. */
  thickness?: number;

  /**
   * Show the rounded percentage as the default center content when no
   * `children` are provided.
   * @default true
   */
  showValue?: boolean;

  /** Custom center content — a tier icon, "3 of 5", etc. Overrides `showValue`. */
  children?: ReactNode;

  /**
   * Animate the arc transitioning to a new `value`. Always disabled under
   * `prefers-reduced-motion: reduce` regardless of this prop.
   * @default true
   */
  animated?: boolean;
}

function resolveDiameter(size: NamedSize | number | undefined): number {
  if (typeof size === 'number') return size;
  return DIAMETERS[size ?? 'md'];
}

export const EvoProgressRing = forwardRef<HTMLDivElement, EvoProgressRingProps>(
  function EvoProgressRing(
    {
      value,
      max = 100,
      minVisible = 0,
      severity = 'primary',
      size = 'md',
      thickness,
      showValue = true,
      children,
      animated = true,
      className,
      style,
      ...rest
    },
    ref,
  ) {
    const effectiveMax = max > 0 ? max : 100;
    const clampedValue = Math.min(effectiveMax, Math.max(0, value));
    const percentage = (clampedValue / effectiveMax) * 100;
    const visualPercent = minVisible > 0 ? Math.max(percentage, Math.min(100, minVisible)) : percentage;

    const diameter = resolveDiameter(size);
    const resolvedThickness = thickness ?? Math.max(4, Math.round(diameter * 0.09));
    const radius = Math.max(0, (diameter - resolvedThickness) / 2);
    const circumference = 2 * Math.PI * radius;
    const dashOffset = circumference * (1 - visualPercent / 100);
    const center = diameter / 2;

    const roundedPercent = Math.round(percentage);
    const content = children ?? (showValue ? `${roundedPercent}%` : null);

    const rootClasses = [styles.root, className].filter(Boolean).join(' ');
    const indicatorClasses = [styles.indicator, styles[severity], animated ? '' : styles.noAnimate]
      .filter(Boolean)
      .join(' ');

    return (
      <div
        ref={ref}
        role="progressbar"
        aria-valuenow={Math.round(clampedValue)}
        aria-valuemin={0}
        aria-valuemax={effectiveMax}
        aria-valuetext={`${roundedPercent}%`}
        className={rootClasses}
        style={{ width: diameter, height: diameter, ...style }}
        {...rest}
      >
        <svg
          className={styles.svg}
          width={diameter}
          height={diameter}
          viewBox={`0 0 ${diameter} ${diameter}`}
          aria-hidden="true"
        >
          <circle
            className={styles.track}
            cx={center}
            cy={center}
            r={radius}
            strokeWidth={resolvedThickness}
            fill="none"
          />
          <circle
            className={indicatorClasses}
            cx={center}
            cy={center}
            r={radius}
            strokeWidth={resolvedThickness}
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            transform={`rotate(-90 ${center} ${center})`}
          />
        </svg>

        {content != null && (
          <div className={styles.content} style={{ fontSize: Math.max(10, diameter * 0.2) }}>
            {content}
          </div>
        )}
      </div>
    );
  },
);

EvoProgressRing.displayName = 'EvoProgressRing';
