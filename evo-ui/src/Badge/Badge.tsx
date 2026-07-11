import React, { forwardRef, useCallback, useEffect, useId, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import styles from '../css/badge.module.scss';
import { useAnchoredPosition, type AnchorSide } from '../hooks/useAnchoredPosition';

type BadgeSeverity = 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info';
type BadgeVariant = 'solid' | 'outline' | 'subtle';
type BadgeSize = 'sm' | 'md' | 'lg';

export interface EvoBadgeProps
  extends Omit<React.HTMLAttributes<HTMLSpanElement>, 'children'> {
  children: React.ReactNode;
  severity?: BadgeSeverity;
  variant?: BadgeVariant;
  size?: BadgeSize;
  dot?: boolean;
  removable?: boolean;
  onRemove?: () => void;
  /** Rich content revealed in a popover on hover / focus / tap. Descriptive, non-interactive. */
  detail?: React.ReactNode;
  /** Preferred popover side; flips when there is no room. Default 'bottom'. */
  detailPlacement?: AnchorSide;
  className?: string;
}

interface EvoBadgeGroupProps {
  children: React.ReactNode;
  className?: string;
}

const EvoBadgeGroup = ({ children, className = '' }: EvoBadgeGroupProps) => (
  <div className={`${styles.badgeGroup} ${className}`}>{children}</div>
);

const OPEN_DELAY = 120;
const CLOSE_DELAY = 140;

export const EvoBadge = forwardRef<HTMLSpanElement, EvoBadgeProps>(function EvoBadge(
  {
    children,
    severity = 'primary',
    variant = 'solid',
    size = 'md',
    dot = false,
    removable = false,
    onRemove,
    detail,
    detailPlacement = 'bottom',
    className = '',
    ...rest
  },
  ref,
) {
  const hasDetail = detail != null;

  // Merge the forwarded ref with our internal anchor ref (needed for positioning).
  const anchorRef = useRef<HTMLSpanElement | null>(null);
  const setRef = useCallback(
    (node: HTMLSpanElement | null) => {
      anchorRef.current = node;
      if (typeof ref === 'function') ref(node);
      else if (ref) (ref as React.MutableRefObject<HTMLSpanElement | null>).current = node;
    },
    [ref],
  );

  const [open, setOpen] = useState(false);
  const popoverId = useId();
  const openTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimers = useCallback(() => {
    if (openTimer.current) { clearTimeout(openTimer.current); openTimer.current = null; }
    if (closeTimer.current) { clearTimeout(closeTimer.current); closeTimer.current = null; }
  }, []);

  // Hover-intent: small open/close delays prevent flicker across a row of badges, and
  // the close delay bridges the gap from the badge onto the popover.
  const scheduleOpen = useCallback(() => {
    if (closeTimer.current) { clearTimeout(closeTimer.current); closeTimer.current = null; }
    if (open || openTimer.current) return;
    openTimer.current = setTimeout(() => { setOpen(true); openTimer.current = null; }, OPEN_DELAY);
  }, [open]);

  const scheduleClose = useCallback(() => {
    if (openTimer.current) { clearTimeout(openTimer.current); openTimer.current = null; }
    if (!open || closeTimer.current) return;
    closeTimer.current = setTimeout(() => { setOpen(false); closeTimer.current = null; }, CLOSE_DELAY);
  }, [open]);

  const cancelClose = useCallback(() => {
    if (closeTimer.current) { clearTimeout(closeTimer.current); closeTimer.current = null; }
  }, []);

  useEffect(() => clearTimers, [clearTimers]);

  const { floatingRef, floatingStyles, arrowStyles, placement } = useAnchoredPosition({
    open: open && hasDetail,
    anchorRef,
    placement: detailPlacement,
    offset: 8,
  });

  const badgeClass = [
    styles.badge,
    styles[severity],
    styles[variant],
    styles[size],
    hasDetail ? styles.interactive : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  // Typed as HTMLAttributes so both branches JSX-spread cleanly (a `null` fallback
  // is not a valid spread type). Empty object when there is no detail popover.
  const interactiveProps: React.HTMLAttributes<HTMLSpanElement> = hasDetail
    ? {
        tabIndex: 0,
        'aria-describedby': open ? popoverId : undefined,
        onMouseEnter: scheduleOpen,
        onMouseLeave: scheduleClose,
        onFocus: () => { clearTimers(); setOpen(true); },
        onBlur: () => { clearTimers(); setOpen(false); },
        onClick: () => { clearTimers(); setOpen((o) => !o); }, // touch / tap toggle
        onKeyDown: (e) => {
          if (e.key === 'Escape' && open) { clearTimers(); setOpen(false); }
        },
      }
    : {};

  return (
    <>
      <span ref={setRef} className={badgeClass} {...rest} {...interactiveProps}>
        {dot && <span className={styles.dot} />}
        {children}
        {removable && (
          <button
            type="button"
            className={styles.removeBtn}
            onClick={onRemove}
            aria-label="Remove"
          >
            ✕
          </button>
        )}
      </span>

      {hasDetail && open && typeof document !== 'undefined' &&
        ReactDOM.createPortal(
          <div
            ref={floatingRef}
            id={popoverId}
            role="tooltip"
            className={styles.detailPopover}
            data-placement={placement}
            style={floatingStyles}
            onMouseEnter={cancelClose}
            onMouseLeave={scheduleClose}
          >
            {detail}
            <span className={styles.detailArrow} data-placement={placement} style={arrowStyles} />
          </div>,
          document.body,
        )}
    </>
  );
});

EvoBadge.displayName = 'EvoBadge';

(EvoBadge as typeof EvoBadge & { Group: typeof EvoBadgeGroup }).Group = EvoBadgeGroup;

export default EvoBadge;
