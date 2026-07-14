import {
  forwardRef,
  useEffect,
  useRef,
  useState,
  type HTMLAttributes,
  type ReactNode,
} from 'react';
import styles from '../css/banner.module.scss';

// ============================================================
// EvoBanner
// ------------------------------------------------------------
// Design notes (see CLAUDE.md §2 research stanza):
//   • Compared against Radix's Callout primitive and Stripe/Vercel-style
//     announcement bars before writing this. Callout gets the semantics
//     right (a landmark, not an interruption) but has no first-class CTA
//     or reassurance-note slot — the whole point of a reciprocity banner
//     (UX doc principle 3: give value before asking).
//   • EvoAlert is the wrong primitive to reuse for this: it's
//     `role="alert"` (an assertive interruption) and status-severity
//     coded (success/error/warning/info). A value/promo banner is calm,
//     not urgent — it needs `role="region"` (a passive landmark) and a
//     *tone* (brand/neutral/accent), never a *severity*.
//   • The one distinctive, restrained decision: the reassurance `note`
//     ("No card required") is anchored directly under the CTA rather
//     than floated as extra body copy — pairing the ask with the
//     "no catch" signal is what makes reciprocity actually land instead
//     of reading as another promo. Everything else stays quiet: a single
//     tone-coloured edge (not a loud gradient wash), and the dismiss
//     control is a true ghost button — invisible until hover/focus, per
//     the UX doc's icon/button restraint rule — so it never competes
//     with the CTA for attention.
// ============================================================

export type EvoBannerTone = 'brand' | 'neutral' | 'accent';
export type EvoBannerAlign = 'start' | 'center';

export interface EvoBannerProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  /**
   * Semantic color theme. Orthogonal to layout (`align`).
   * @default 'brand'
   */
  tone?: EvoBannerTone;
  /** Bold lead-in shown above the body copy. */
  title?: ReactNode;
  /** Decorative glyph rendered in a circular badge. Marked `aria-hidden`. */
  icon?: ReactNode;
  /** Body copy — the value being offered. */
  children: ReactNode;
  /** Primary CTA. Rendered inside a slot with a guaranteed ≥44px tap target. */
  action?: ReactNode;
  /** Small reassurance copy anchored under the CTA, e.g. "No card required". */
  note?: ReactNode;
  /** Shows a ghost dismiss control. @default false */
  dismissible?: boolean;
  /** Called after the (motion-respecting) exit animation completes. */
  onDismiss?: () => void;
  /**
   * `start` — icon/content/action in a row (default, dense contexts).
   * `center` — stacked and centered (hero / full-width promo contexts).
   * @default 'start'
   */
  align?: EvoBannerAlign;
}

function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(mql.matches);
    update();
    mql.addEventListener?.('change', update);
    return () => mql.removeEventListener?.('change', update);
  }, []);
  return reduced;
}

// How long the exit animation runs before the node actually unmounts.
// Kept in one place so the JS timeout and the CSS keyframe never drift.
const EXIT_MS = 200;

export const EvoBanner = forwardRef<HTMLElement, EvoBannerProps>(function EvoBanner(
  {
    tone = 'brand',
    title,
    icon,
    children,
    action,
    note,
    dismissible = false,
    onDismiss,
    align = 'start',
    className,
    'aria-label': ariaLabel,
    ...rest
  },
  ref,
) {
  const [exiting, setExiting] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const reducedMotion = usePrefersReducedMotion();
  const timeoutRef = useRef<number | null>(null);

  useEffect(
    () => () => {
      if (timeoutRef.current != null) window.clearTimeout(timeoutRef.current);
    },
    [],
  );

  if (dismissed) return null;

  const handleDismiss = () => {
    if (exiting) return;
    setExiting(true);
    timeoutRef.current = window.setTimeout(
      () => {
        setDismissed(true);
        onDismiss?.();
      },
      reducedMotion ? 0 : EXIT_MS,
    );
  };

  const classes = [
    styles.banner,
    styles[tone],
    styles[`align-${align}`],
    dismissible ? styles.hasDismiss : '',
    exiting ? styles.exiting : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const resolvedLabel = ariaLabel ?? (typeof title === 'string' ? title : 'Banner');

  return (
    <section ref={ref} role="region" aria-label={resolvedLabel} className={classes} {...rest}>
      {icon && (
        <span className={styles.icon} aria-hidden="true">
          {icon}
        </span>
      )}

      <div className={styles.content}>
        {title && <p className={styles.title}>{title}</p>}
        <div className={styles.body}>{children}</div>
      </div>

      {(action || note) && (
        <div className={styles.actions}>
          {action && <div className={styles.action}>{action}</div>}
          {note && <span className={styles.note}>{note}</span>}
        </div>
      )}

      {dismissible && (
        <button
          type="button"
          className={styles.dismiss}
          onClick={handleDismiss}
          aria-label="Dismiss banner"
        >
          <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
            <path
              d="M3 3l10 10M13 3L3 13"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              fill="none"
            />
          </svg>
        </button>
      )}
    </section>
  );
});
EvoBanner.displayName = 'EvoBanner';
