# Task 5: Retrofit `EvoTooltip` onto `useAnchoredPosition`

You are implementing ONE task on the `feat/viewport-aware-positioning` branch of the Evo
UI library (`D:\evo`). The shared hook `useAnchoredPosition` exists at
`evo-ui/src/hooks/useAnchoredPosition.ts`. This task moves `EvoTooltip` off its CSS-only
fixed-placement onto the hook, so it auto-flips and shifts to stay on-screen and renders in
a portal (never clipped). `placement` becomes the PREFERRED side (non-breaking: still
honored whenever it fits).

**Files:**
- Modify (rewrite): `evo-ui/src/Tooltip/Tooltip.tsx`
- Modify (rewrite): `evo-ui/src/css/tooltip.module.scss`
- Build: `evo-ui`

**Interfaces:**
- Consumes: `useAnchoredPosition`, `AnchorSide` from `../hooks/useAnchoredPosition`.
- Produces: NO public API change. `EvoTooltipProps` (`content`, `children`, `placement`,
  `className`) keeps the same names/types. `placement` default stays `'top'`.

## Step 1: Replace `evo-ui/src/Tooltip/Tooltip.tsx` entirely with EXACTLY this content

```tsx
import React, { useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import styles from '../css/tooltip.module.scss';
import { useAnchoredPosition, type AnchorSide } from '../hooks/useAnchoredPosition';

type TooltipPlacement = AnchorSide;

interface EvoTooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
  /** Preferred side; flips automatically when there is no room. Default 'top'. */
  placement?: TooltipPlacement;
  className?: string;
}

export const EvoTooltip = ({
  content,
  children,
  placement = 'top',
  className = '',
}: EvoTooltipProps) => {
  const [open, setOpen] = useState(false);
  const anchorRef = useRef<HTMLSpanElement>(null);

  const { floatingRef, floatingStyles, arrowStyles, placement: side } = useAnchoredPosition({
    open,
    anchorRef,
    placement,
    offset: 8,
  });

  return (
    <span
      ref={anchorRef}
      className={`${styles.wrapper} ${className}`}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
    >
      {children}
      {open && typeof document !== 'undefined' &&
        ReactDOM.createPortal(
          <div
            ref={floatingRef}
            className={styles.tooltip}
            data-placement={side}
            style={floatingStyles}
            role="tooltip"
          >
            {content}
            <span className={styles.arrow} data-placement={side} style={arrowStyles} />
          </div>,
          document.body,
        )}
    </span>
  );
};
```

## Step 2: Replace `evo-ui/src/css/tooltip.module.scss` entirely with EXACTLY this content

Position now comes from the hook's inline `floatingStyles`; the arrow is keyed off
`data-placement` and the inline `arrowStyles` cross-axis offset. The entrance animation is
disabled under `prefers-reduced-motion`. Tokens only — no hex.

```scss
@use 'base/variables' as *;
@use 'base/color' as *;

@keyframes tooltipFadeIn {
  from { opacity: 0; transform: scale(0.95); }
  to   { opacity: 1; transform: scale(1); }
}

.wrapper {
  position: relative;
  display: inline-flex;
  align-items: center;
}

.tooltip {
  z-index: 10000; // portaled to <body>: sit above EvoModal / CommandPalette (9999)
  padding: 0.375rem 0.625rem;
  background-color: $color-surface-elevated;
  color: $color-text-primary;
  font-size: $text-xs;
  font-family: $font-sans;
  border-radius: $radius-sm;
  white-space: nowrap;
  box-shadow: $shadow-lg;
  border: 1px solid $color-border;
  pointer-events: none;
  animation: tooltipFadeIn 150ms ease;
  line-height: 1.4;
}

@media (prefers-reduced-motion: reduce) {
  .tooltip { animation: none; }
}

.arrow {
  position: absolute;
  width: 0;
  height: 0;
  border: 5px solid transparent;

  .tooltip[data-placement='top'] & {
    top: 100%;
    transform: translateX(-50%);
    border-top-color: $color-surface-elevated;
    border-bottom: none;
  }
  .tooltip[data-placement='bottom'] & {
    bottom: 100%;
    transform: translateX(-50%);
    border-bottom-color: $color-surface-elevated;
    border-top: none;
  }
  .tooltip[data-placement='left'] & {
    left: 100%;
    transform: translateY(-50%);
    border-left-color: $color-surface-elevated;
    border-right: none;
  }
  .tooltip[data-placement='right'] & {
    right: 100%;
    transform: translateY(-50%);
    border-right-color: $color-surface-elevated;
    border-left: none;
  }
}
```

Note: the arrow's cross-axis position comes from inline `arrowStyles` (`left` for
top/bottom placement, `top` for left/right); the `translateX/Y(-50%)` centers it on that
point. The old `&.top` / `&.bottom` positioning classes are gone — positioning is inline now.

## Step 3: Build
`cd D:/evo/evo-ui; npm run build` (PowerShell tool). Expect success, zero TypeScript errors,
no SCSS "undefined variable" errors. If a SCSS variable is undefined, STOP and report
BLOCKED with the name (do not substitute a hex value).

## Step 4: Commit (stage only these two files)
```
git -C D:/evo add evo-ui/src/Tooltip/Tooltip.tsx evo-ui/src/css/tooltip.module.scss
git -C D:/evo commit -m "feat(EvoTooltip): auto-flip via useAnchoredPosition; placement is now preferred side" -m "Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```
Do NOT `git add -A`. Do NOT commit `dist/` or `.superpowers/`.

## Report contract
Write your full report to `D:\evo\.superpowers\sdd\vap-task-5-report.md`. Return ONLY:
status (DONE / DONE_WITH_CONCERNS / BLOCKED / NEEDS_CONTEXT), the commit hash, a one-line
build result, and any concerns.
</content>
