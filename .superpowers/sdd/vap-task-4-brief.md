# Task 4: `EvoBadge` `detail` hover popover (#11)

You are implementing ONE task on the `feat/viewport-aware-positioning` branch of the Evo
UI library (`D:\evo`). The shared hook `useAnchoredPosition` exists at
`evo-ui/src/hooks/useAnchoredPosition.ts`. This task adds an optional `detail` popover to
`EvoBadge`, revealed on hover / focus / tap, positioned by that hook (flips both axes,
escapes overflow clipping). It also gives `EvoBadge` `forwardRef` + `...rest` passthrough.

The visual design is already finalized below (elevation via the `$shadow-lg` token,
reduced-motion-guarded entrance, token-only colors). **Transcribe the code EXACTLY** — do
not redesign; the taste decisions are baked in.

**Files:**
- Modify (rewrite): `evo-ui/src/Badge/Badge.tsx`
- Modify (append): `evo-ui/src/css/badge.module.scss`
- Build: `evo-ui`

**Interfaces:**
- Consumes: `useAnchoredPosition`, `AnchorSide` from `../hooks/useAnchoredPosition`.
- Produces (public, additive, non-breaking): `EvoBadgeProps.detail?: React.ReactNode`,
  `EvoBadgeProps.detailPlacement?: AnchorSide` (default `'bottom'`). `EvoBadge` is now
  `forwardRef<HTMLSpanElement>` and spreads `...rest` onto the root `<span>`.
  `EvoBadge.Group` usage is unchanged for consumers.

## Step 1: Replace `evo-ui/src/Badge/Badge.tsx` entirely with EXACTLY this content

```tsx
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
```

Notes (do not deviate):
- The `(EvoBadge as … & { Group })` cast attaches the static sub-component to the
  `forwardRef` object — a plain `EvoBadge.Group =` fails typing on a forwardRef component.
- `{...rest} {...interactiveProps}` order matters: the component's own popover handlers
  win over any caller-supplied handler when `detail` is set.
- All hooks are called unconditionally (no early return before them) — required by the
  Rules of Hooks. Behavior is gated on `hasDetail`, not by skipping hooks.

## Step 2: Append popover styles to `evo-ui/src/css/badge.module.scss`
Add this block AFTER the existing `.badgeGroup { … }` block at the end of the file. Uses
only tokens (no hex); `$shadow-lg` matches EvoTooltip's elevation; entrance motion is
disabled under `prefers-reduced-motion`.

```scss
/* ===================================================================
 * detail popover (hover / focus / tap) — positioned by useAnchoredPosition
 * =================================================================== */
.interactive {
  cursor: default;

  &:focus-visible {
    outline: 2px solid $evo-primary-color;
    outline-offset: 2px;
  }
}

.detailPopover {
  z-index: 10000; // portaled to <body>: sit above EvoModal / CommandPalette (9999)
  max-width: 18rem;
  padding: 0.625rem 0.75rem;
  background: $color-surface-elevated;
  color: $color-text-primary;
  border: 1px solid $color-border;
  border-radius: $radius-md;
  box-shadow: $shadow-lg;
  font-family: $font-sans;
  font-size: $text-xs;
  font-weight: 400;
  line-height: 1.5;
  white-space: normal;
  animation: badgeDetailIn 160ms cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes badgeDetailIn {
  from { opacity: 0; transform: translateY(-4px) scale(0.98); }
  to   { opacity: 1; transform: translateY(0) scale(1); }
}

@media (prefers-reduced-motion: reduce) {
  .detailPopover { animation: none; }
}

.detailPopover[data-placement='top']    { transform-origin: bottom center; }
.detailPopover[data-placement='bottom'] { transform-origin: top center; }
.detailPopover[data-placement='left']   { transform-origin: center right; }
.detailPopover[data-placement='right']  { transform-origin: center left; }

.detailArrow {
  position: absolute;
  width: 0;
  height: 0;
  border: 6px solid transparent;

  .detailPopover[data-placement='bottom'] & {
    bottom: 100%;
    transform: translateX(-50%);
    border-bottom-color: $color-surface-elevated;
    border-top: none;
  }
  .detailPopover[data-placement='top'] & {
    top: 100%;
    transform: translateX(-50%);
    border-top-color: $color-surface-elevated;
    border-bottom: none;
  }
  .detailPopover[data-placement='right'] & {
    right: 100%;
    transform: translateY(-50%);
    border-right-color: $color-surface-elevated;
    border-left: none;
  }
  .detailPopover[data-placement='left'] & {
    left: 100%;
    transform: translateY(-50%);
    border-left-color: $color-surface-elevated;
    border-right: none;
  }
}
```
Note: `arrowStyles` supplies the cross-axis offset inline (`left` for top/bottom, `top`
for left/right); the `translateX/Y(-50%)` centers the arrow on that offset. Arrow color is
`$color-surface-elevated` so it matches the popover fill in both light and dark themes.

## Step 3: Verify tokens resolve
The SCSS references `$evo-primary-color`, `$color-surface-elevated`, `$color-text-primary`,
`$color-border`, `$radius-md`, `$shadow-lg`, `$font-sans`, `$text-xs`. The file already
`@use`s `base/variables` and `base/color` (see its top) — these are the same tokens the
existing badge styles use, plus `$shadow-lg` (used by `tooltip.module.scss`) and
`$font-sans`/`$text-xs` (used across the library). If the build reports an undefined
variable, STOP and report BLOCKED with the exact variable name — do not substitute a hex value.

## Step 4: Build
`cd D:/evo/evo-ui; npm run build` (PowerShell tool). Expect success, zero TypeScript errors,
no SCSS "undefined variable" errors. Capture the tail as evidence.

## Step 5: Commit (stage only these two files)
```
git -C D:/evo add evo-ui/src/Badge/Badge.tsx evo-ui/src/css/badge.module.scss
git -C D:/evo commit -m "feat(EvoBadge): add hover detail popover with viewport-aware positioning (#11)" -m "Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```
Do NOT `git add -A`. Do NOT commit `dist/` or `.superpowers/`.

## Report contract
Write your full report to `D:\evo\.superpowers\sdd\vap-task-4-report.md`. Return ONLY:
status (DONE / DONE_WITH_CONCERNS / BLOCKED / NEEDS_CONTEXT), the commit hash, a one-line
build result, and any concerns.
</content>
