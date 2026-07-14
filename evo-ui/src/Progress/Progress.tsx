import { forwardRef, useId, type HTMLAttributes, type ReactNode } from 'react';
import styles from '../css/progress.module.scss';

// ============================================================
// EvoProgress
// ------------------------------------------------------------
// Reviewed Radix Progress (state-machine simplicity: a single
// controlled `value` + `max`, no internal state, no imperative
// API) and Mantine Progress (severity/size prop surface) before
// building this.
//
// What we kept: Radix's "consumer owns the number" model — no
// internal ticking state, `value` is fully controlled.
// What we changed: both of those (and most progress bars in the
// wild) render a literal 0% fill when `value` is 0. The UX doc's
// goal-gradient principle (§ "永远不要让用户从 0% 出发") says a bar
// with zero visible fill reads as "nothing has happened yet" and
// saps the motivation the fill exists to create. `minVisible` is a
// purely *visual* floor on the rendered width — it never touches
// `aria-valuenow`, so a screen reader still hears the true value
// while sighted users always see a bar with some momentum.
// ============================================================

type EvoProgressSeverity = 'primary' | 'success' | 'warning' | 'danger' | 'info';
type EvoProgressSize = 'sm' | 'md' | 'lg';

export interface EvoProgressProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** Current value, in the same units as `max`. Clamped to `[0, max]`. Optional
   *  (defaults to 0) and ignored while `indeterminate`. @default 0 */
  value?: number;
  /** Upper bound of `value`. @default 100 */
  max?: number;
  /**
   * Visual-only floor on the rendered fill percentage (0-100) so the bar
   * never reads as completely empty — the goal-gradient "head start".
   * Purely cosmetic: `aria-valuenow` always reports the true `value`.
   * @default 0
   */
  minVisible?: number;
  /** Semantic color of the fill. @default 'primary' */
  severity?: EvoProgressSeverity;
  /** Track height / overall scale. @default 'md' */
  size?: EvoProgressSize;
  /**
   * Unknown-duration mode: a continuously sliding indicator instead of a
   * fixed-width fill. `aria-valuenow` is omitted while true, per WAI-ARIA.
   * @default false
   */
  indeterminate?: boolean;
  /** Renders the formatted value next to `label`. Ignored while `indeterminate`. */
  showValue?: boolean;
  /**
   * Formats the value shown when `showValue` is true.
   * @default (value, max) => `${Math.round((value / max) * 100)}%`
   */
  valueFormat?: (value: number, max: number) => string;
  /** Optional caption rendered above the track. Also becomes the a11y name via `aria-labelledby`. */
  label?: ReactNode;
  /** Animate width changes and the indeterminate sweep. Disabled automatically under `prefers-reduced-motion`. @default true */
  animated?: boolean;
}

const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n));

const defaultValueFormat = (value: number, max: number) =>
  `${Math.round(max > 0 ? clamp((value / max) * 100, 0, 100) : 0)}%`;

export const EvoProgress = forwardRef<HTMLDivElement, EvoProgressProps>(function EvoProgress(
  {
    value = 0,
    max = 100,
    minVisible = 0,
    severity = 'primary',
    size = 'md',
    indeterminate = false,
    showValue = false,
    valueFormat = defaultValueFormat,
    label,
    animated = true,
    className,
    id,
    ...rest
  },
  ref,
) {
  const reactId = useId();
  const labelId = label != null ? `${id ?? reactId}-label` : undefined;

  const clampedValue = clamp(value, 0, max);
  const truePct = max > 0 ? (clampedValue / max) * 100 : 0;
  const visualPct = clamp(Math.max(truePct, clamp(minVisible, 0, 100)), 0, 100);

  const rootClasses = [styles.root, styles[size], className].filter(Boolean).join(' ');
  const fillClasses = [
    styles.fill,
    styles[severity],
    indeterminate ? styles.indeterminate : '',
    !animated ? styles.noAnimation : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div
      ref={ref}
      id={id}
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuenow={indeterminate ? undefined : clampedValue}
      aria-labelledby={labelId}
      className={rootClasses}
      {...rest}
    >
      {(label != null || showValue) && (
        <div className={styles.header}>
          {label != null && (
            <span id={labelId} className={styles.label}>
              {label}
            </span>
          )}
          {showValue && !indeterminate && (
            <span className={styles.value}>{valueFormat(clampedValue, max)}</span>
          )}
        </div>
      )}
      <div className={styles.track}>
        <div
          className={fillClasses}
          style={indeterminate ? undefined : { width: `${visualPct}%` }}
        />
      </div>
    </div>
  );
});

EvoProgress.displayName = 'EvoProgress';
