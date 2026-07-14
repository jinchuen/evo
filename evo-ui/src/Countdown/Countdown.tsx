import {
  forwardRef,
  useEffect,
  useMemo,
  useRef,
  useState,
  type HTMLAttributes,
  type ReactNode,
} from 'react';
import styles from '../css/countdown.module.scss';

// ------------------------------------------------------------------------
// Design note (CLAUDE.md §2 research step)
//
// There is no direct Radix/Ark primitive for a countdown — timing widgets
// sit outside their scope. The closest prior art is community packages like
// `react-countdown`, which expose a render-prop over a `{days,hours,...}`
// breakdown and let the consumer format everything by hand. That is
// maximally flexible but pushes the *meaning* (is this urgent yet?) back
// onto every consumer, and it typically ticks every second regardless of
// how far away the deadline is — needless re-renders and needless motion
// for a countdown that reads "12 days left".
//
// Evo's take: ship a sensible formatted default ("3 days left" / "04:59")
// AND a render prop for full control (`children`), and own the one thing a
// generic countdown can't: an opinionated, *default* semantic-color escalation
// (warning → danger) that mirrors loss aversion — the number's presence
// alone should communicate urgency, not just its digits. To keep that
// escalation usable without per-instance tuning, `dangerThreshold` defaults
// to a smart, self-scaling value (see below) instead of a fixed constant —
// the same "reduce decisions with smart defaults" principle the rest of Evo
// UI follows for its form inputs.
// ------------------------------------------------------------------------

type CountdownFormat = 'days' | 'clock' | 'auto';

const DAY_MS = 24 * 60 * 60 * 1000;
const MIN_DANGER_THRESHOLD_MS = 30 * 1000; // never flip so early it's meaningless
const MAX_DANGER_THRESHOLD_MS = DAY_MS; // never flip so late the whole countdown was already loud

export interface EvoCountdownProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'children'> {
  /** Target instant. Accepts an epoch-ms timestamp or a `Date`. */
  deadline: number | Date;
  /**
   * Display grain.
   * - `days`  — "3 days left". Ticks once a minute.
   * - `clock` — "04:59" / "1:04:59". Ticks once a second.
   * - `auto`  — `days` while ≥ 24h remain, switches to `clock` inside the
   *   final day so distant deadlines don't tick per-second for no reason.
   * @default 'auto'
   */
  format?: CountdownFormat;
  /**
   * Remaining milliseconds at which the countdown's color escalates from its
   * default `--evo-color-warning` tint to `--evo-color-danger`.
   *
   * When omitted, it is derived automatically as 10% of the *initial*
   * remaining duration at mount (clamped to 30s–24h) — a smart default so a
   * 30-day countdown turns urgent with 3 days left and a 10-minute one turns
   * urgent with 1 minute left, without per-instance tuning.
   */
  dangerThreshold?: number;
  /** Called exactly once, on the tick the deadline is reached or passed. */
  onExpire?: () => void;
  /**
   * Render prop for full control over the displayed content. Receives the
   * live remaining milliseconds (never negative). Omit to use the built-in
   * "3 days left" / "04:59" formatting.
   */
  children?: (remainingMs: number) => ReactNode;
}

function toEpoch(deadline: number | Date): number {
  return typeof deadline === 'number' ? deadline : deadline.getTime();
}

function pad2(n: number): string {
  return n < 10 ? `0${n}` : `${n}`;
}

function resolveFormat(format: CountdownFormat, remainingMs: number): 'days' | 'clock' {
  if (format !== 'auto') return format;
  return remainingMs >= DAY_MS ? 'days' : 'clock';
}

function formatDays(remainingMs: number): string {
  const days = Math.max(1, Math.ceil(remainingMs / DAY_MS));
  return `${days} day${days === 1 ? '' : 's'} left`;
}

function formatClock(remainingMs: number): string {
  const totalSeconds = Math.ceil(remainingMs / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return hours > 0
    ? `${hours}:${pad2(minutes)}:${pad2(seconds)}`
    : `${minutes}:${pad2(seconds)}`;
}

function formatRemaining(resolved: 'days' | 'clock', remainingMs: number): string {
  if (remainingMs <= 0) return 'Expired';
  return resolved === 'days' ? formatDays(remainingMs) : formatClock(remainingMs);
}

// Full-sentence remaining duration, independent of `resolvedFormat` and of any
// custom `children` render — assistive tech always gets an accurate, readable
// duration via `aria-label` regardless of what's visually displayed.
function formatAriaLabel(remainingMs: number): string {
  if (remainingMs <= 0) return 'Expired';
  const totalMinutes = Math.ceil(remainingMs / 60000);
  const days = Math.floor(totalMinutes / 1440);
  const hours = Math.floor((totalMinutes % 1440) / 60);
  const minutes = totalMinutes % 60;
  const parts: string[] = [];
  if (days > 0) parts.push(`${days} day${days === 1 ? '' : 's'}`);
  if (hours > 0) parts.push(`${hours} hour${hours === 1 ? '' : 's'}`);
  if (days === 0 && minutes > 0) parts.push(`${minutes} minute${minutes === 1 ? '' : 's'}`);
  if (parts.length === 0) parts.push('less than a minute');
  return `${parts.join(', ')} remaining`;
}

export const EvoCountdown = forwardRef<HTMLSpanElement, EvoCountdownProps>(function EvoCountdown(
  { deadline, format = 'auto', dangerThreshold, onExpire, children, className, ...rest },
  ref,
) {
  const deadlineMs = useMemo(() => toEpoch(deadline), [deadline]);

  // Captured once per mounted deadline — the basis for the smart default below.
  const initialRemainingRef = useRef<number | null>(null);
  if (initialRemainingRef.current == null) {
    initialRemainingRef.current = Math.max(0, deadlineMs - Date.now());
  }

  const resolvedDangerThreshold = useMemo(() => {
    if (dangerThreshold != null) return dangerThreshold;
    const tenPercent = (initialRemainingRef.current ?? 0) * 0.1;
    return Math.min(MAX_DANGER_THRESHOLD_MS, Math.max(MIN_DANGER_THRESHOLD_MS, tenPercent));
  }, [dangerThreshold]);

  const [now, setNow] = useState(() => Date.now());
  const expiredFiredRef = useRef(false);
  const wasDangerRef = useRef(false);
  const [justFlipped, setJustFlipped] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // Reactively track prefers-reduced-motion so the tick interval below can
  // drop to a coarse cadence — no sub-second digit ticking under reduced
  // motion, matching the same media-query pattern used in Notification/
  // ProgressRing. SSR-safe: no-ops when `window` doesn't exist.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mq.addEventListener?.('change', onChange);
    return () => mq.removeEventListener?.('change', onChange);
  }, []);

  const remainingMs = Math.max(0, deadlineMs - now);
  const resolvedFormat = resolveFormat(format, remainingMs);
  const isDanger = remainingMs <= resolvedDangerThreshold;
  const isExpired = remainingMs <= 0;

  // Tick loop. Interval granularity matches the resolved format (1s for
  // `clock`, 60s for `days`) — except under `prefers-reduced-motion: reduce`,
  // where it's forced to a coarse 60s cadence regardless of format so digits
  // never visibly tick every second. `aria-label` and `onExpire` are derived
  // from `remainingMs`/`isExpired` independently of this interval, so they
  // stay accurate and still fire exactly once even at the coarser cadence.
  // Fully paused while the tab is hidden; resumes with an immediate
  // recompute (not a stale leftover tick) when it becomes visible again.
  useEffect(() => {
    if (isExpired || typeof window === 'undefined') return;
    const intervalMs = !prefersReducedMotion && resolvedFormat === 'clock' ? 1000 : 60_000;
    let id: ReturnType<typeof setInterval> | null = null;

    const tick = () => setNow(Date.now());
    const start = () => {
      if (id != null) return;
      if (typeof document !== 'undefined' && document.hidden) return;
      id = setInterval(tick, intervalMs);
    };
    const stop = () => {
      if (id != null) {
        clearInterval(id);
        id = null;
      }
    };
    const handleVisibility = () => {
      if (typeof document === 'undefined') return;
      if (document.hidden) {
        stop();
      } else {
        tick();
        start();
      }
    };

    start();
    if (typeof document !== 'undefined') {
      document.addEventListener('visibilitychange', handleVisibility);
    }

    return () => {
      stop();
      if (typeof document !== 'undefined') {
        document.removeEventListener('visibilitychange', handleVisibility);
      }
    };
  }, [resolvedFormat, isExpired, prefersReducedMotion]);

  useEffect(() => {
    if (isExpired && !expiredFiredRef.current) {
      expiredFiredRef.current = true;
      onExpire?.();
    }
  }, [isExpired, onExpire]);

  // One-shot micro-interaction (CLAUDE.md §0.2 "every animation wrapped in
  // prefers-reduced-motion") the instant severity crosses into danger — a
  // confirmation nudge, not decoration. Disabled entirely under reduced
  // motion in CSS, leaving the color change alone to carry the message.
  useEffect(() => {
    const wasDanger = wasDangerRef.current;
    wasDangerRef.current = isDanger;
    if (isDanger && !wasDanger) {
      setJustFlipped(true);
      const t = setTimeout(() => setJustFlipped(false), 500);
      return () => clearTimeout(t);
    }
  }, [isDanger]);

  const classes = [
    styles.countdown,
    isDanger ? styles.danger : '',
    isExpired ? styles.expired : '',
    justFlipped ? styles.flip : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const content = children ? children(remainingMs) : formatRemaining(resolvedFormat, remainingMs);

  return (
    <span
      ref={ref}
      role="timer"
      aria-live="off"
      aria-label={formatAriaLabel(remainingMs)}
      className={classes}
      {...rest}
    >
      {content}
    </span>
  );
});

EvoCountdown.displayName = 'EvoCountdown';
