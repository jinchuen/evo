# Viewport-Aware Positioning — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development
> to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** One zero-dependency `useAnchoredPosition` hook (portal + `position:fixed` +
flip + clamp), consumed by Select/AutoComplete/TreeSelect (fixes #10 clipping), by a new
`EvoBadge` `detail` popover (#11), and by a retrofitted `EvoTooltip`.

**Architecture:** A hand-rolled React hook measures anchor + floating rects with
`getBoundingClientRect`, flips to the roomier side on the main axis, clamps on the cross
axis, and repositions on scroll/resize. Floating elements render through
`ReactDOM.createPortal(…, document.body)` with `position:fixed`, escaping every
`overflow:hidden`/scroll-clip ancestor. Spec:
`docs/superpowers/specs/2026-07-11-viewport-aware-positioning-design.md`.

**Tech Stack:** React 17+ (peer), TypeScript, SCSS modules, `react-dom` `createPortal`.
Zero new runtime deps.

## Global Constraints (bind every task)

- **Zero runtime deps** — no `@floating-ui/*`; hand-rolled only (CLAUDE.md §7, §13.1).
- **Tokens only, no raw hex** — `--evo-*` / existing SCSS vars; never `#94a3b8`/`#e2e8f0`/`#1e293b` (§0.2).
- **Do NOT edit** `evo-ui/src/css/tokens.css` (§7). New z-index literals live in component `.module.scss`.
- **Portaled floating layers use `z-index: 10000`** — above `EvoModal`/`CommandPalette` (9999).
- **SSR-safe** — guard `typeof document/window !== 'undefined'`; isomorphic layout effect.
- **`forwardRef` + `...rest`** on any component touched (§0.1, §2). `displayName` set.
- **Verification = `cd evo-ui && npm run build`** green (tsc + SCSS). No unit-test runner exists.
  Manual browser smoke (dark mode + 375px + inside EvoModal) is a human step, run at the end.
- **Commit** only the files each task names. Never `git add -A`. Never stage `.superpowers/` or `dist/`.
  Commit trailer: `Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>`.
- Use the **PowerShell tool** for git/npm (Bash tool lacks git/coreutils on PATH).

---

## Task 1: `useAnchoredPosition` hook

**Files:**
- Create: `evo-ui/src/hooks/useAnchoredPosition.ts`
- Build: `evo-ui` (`npm run build`)

**Interfaces:**
- Consumes: nothing (leaf utility).
- Produces (later tasks import from `../hooks/useAnchoredPosition`):
  - `useAnchoredPosition<T extends HTMLElement = HTMLElement>(opts) => AnchoredPosition`
  - `type AnchorSide = 'top' | 'bottom' | 'left' | 'right'`
  - `interface UseAnchoredPositionOptions<T>` — `{ open: boolean; anchorRef: React.RefObject<T | null>; placement?: AnchorSide; offset?: number; viewportPadding?: number; matchAnchorWidth?: boolean }`
  - `interface AnchoredPosition` — `{ floatingRef: React.RefObject<HTMLDivElement | null>; floatingStyles: React.CSSProperties; arrowStyles: React.CSSProperties; placement: AnchorSide; ready: boolean }`
- NOT exported from `src/index.ts` (internal only).

- [ ] **Step 1: Create the hook file** with EXACTLY this content:

```tsx
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import type { CSSProperties, RefObject } from 'react';

/**
 * Shared viewport-aware positioning for Evo's floating layers (menus, popovers,
 * tooltips). Zero-dependency by policy (CLAUDE.md §7) — a hand-rolled subset of
 * Floating UI's flip()/shift(): measure the anchor + floating element, flip to the
 * roomier side on the main axis, clamp on the cross axis, reposition on scroll/resize.
 *
 * Callers render the floating element through `createPortal(…, document.body)` with
 * `position: fixed` (via `floatingStyles`) so it escapes `overflow:hidden`/scroll-clip
 * ancestors — the root cause shared by issues #10 and #11.
 */

// SSR-safe: useLayoutEffect warns on the server; fall back to useEffect there.
const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect;

export type AnchorSide = 'top' | 'bottom' | 'left' | 'right';

export interface UseAnchoredPositionOptions<T extends HTMLElement = HTMLElement> {
  /** Measure/position only while true. */
  open: boolean;
  /** The element the floating layer is anchored to. */
  anchorRef: RefObject<T | null>;
  /** Preferred side; flips to the opposite side when it lacks room. Default 'bottom'. */
  placement?: AnchorSide;
  /** Gap between anchor and floating element, px. Default 6. */
  offset?: number;
  /** Minimum gap kept from the viewport edge, px. Default 8. */
  viewportPadding?: number;
  /** Set the floating element's width to the anchor's width. Default false. */
  matchAnchorWidth?: boolean;
}

export interface AnchoredPosition {
  /** Attach to the floating element (always a <div>). */
  floatingRef: RefObject<HTMLDivElement | null>;
  /** Spread onto the floating element: position/top/left/(width)/visibility. */
  floatingStyles: CSSProperties;
  /** Cross-axis offset for an optional arrow (ignored by callers without one). */
  arrowStyles: CSSProperties;
  /** The side chosen after collision detection. */
  placement: AnchorSide;
  /** False until the first measurement completes (used to avoid a position flash). */
  ready: boolean;
}

const isVertical = (s: AnchorSide) => s === 'top' || s === 'bottom';

const ARROW_INSET = 12; // keep the arrow this far from the floating element's corners

export function useAnchoredPosition<T extends HTMLElement = HTMLElement>({
  open,
  anchorRef,
  placement = 'bottom',
  offset = 6,
  viewportPadding = 8,
  matchAnchorWidth = false,
}: UseAnchoredPositionOptions<T>): AnchoredPosition {
  const floatingRef = useRef<HTMLDivElement | null>(null);
  const [pos, setPos] = useState<{
    top: number;
    left: number;
    width: number | undefined;
    arrow: number;
    placement: AnchorSide;
    ready: boolean;
  }>({ top: 0, left: 0, width: undefined, arrow: 0, placement, ready: false });

  const compute = useCallback(() => {
    const anchor = anchorRef.current;
    const floating = floatingRef.current;
    if (!anchor || !floating) return;

    const a = anchor.getBoundingClientRect();
    const f = floating.getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const pad = viewportPadding;

    // --- main-axis flip: keep the preferred side unless the opposite has more room ---
    let side = placement;
    if (isVertical(placement)) {
      const below = vh - a.bottom - offset;
      const above = a.top - offset;
      if (placement === 'bottom' && f.height > below && above > below) side = 'top';
      if (placement === 'top' && f.height > above && below > above) side = 'bottom';
    } else {
      const right = vw - a.right - offset;
      const left = a.left - offset;
      if (placement === 'right' && f.width > right && left > right) side = 'left';
      if (placement === 'left' && f.width > left && right > left) side = 'right';
    }

    // --- main-axis coordinate ---
    let top = 0;
    let left = 0;
    if (side === 'bottom') top = a.bottom + offset;
    else if (side === 'top') top = a.top - f.height - offset;
    else if (side === 'right') left = a.right + offset;
    else left = a.left - f.width - offset;

    // --- cross-axis: align leading edges, then clamp inside the viewport ---
    if (isVertical(side)) {
      left = Math.min(Math.max(a.left, pad), Math.max(pad, vw - f.width - pad));
    } else {
      top = Math.min(Math.max(a.top, pad), Math.max(pad, vh - f.height - pad));
    }

    // --- arrow: point at the anchor's center, clamped within the floating box ---
    const arrow = isVertical(side)
      ? Math.min(Math.max(a.left + a.width / 2 - left, ARROW_INSET), f.width - ARROW_INSET)
      : Math.min(Math.max(a.top + a.height / 2 - top, ARROW_INSET), f.height - ARROW_INSET);

    setPos({
      top: Math.round(top),
      left: Math.round(left),
      width: matchAnchorWidth ? Math.round(a.width) : undefined,
      arrow: Math.round(arrow),
      placement: side,
      ready: true,
    });
  }, [anchorRef, placement, offset, viewportPadding, matchAnchorWidth]);

  useIsomorphicLayoutEffect(() => {
    if (!open) {
      setPos((p) => (p.ready ? { ...p, ready: false } : p));
      return;
    }
    compute();

    let raf = 0;
    const onMove = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(compute);
    };
    // capture:true so nested scroll containers (not just window) trigger a reposition.
    window.addEventListener('scroll', onMove, true);
    window.addEventListener('resize', onMove);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onMove, true);
      window.removeEventListener('resize', onMove);
    };
  }, [open, compute]);

  const floatingStyles: CSSProperties = {
    position: 'fixed',
    top: pos.top,
    left: pos.left,
    ...(pos.width !== undefined ? { width: pos.width } : null),
    // Measure before revealing: hidden elements still report layout via
    // getBoundingClientRect (display:none would not), so this avoids a flash at 0,0.
    visibility: pos.ready ? undefined : 'hidden',
  };

  const arrowStyles: CSSProperties = isVertical(pos.placement)
    ? { left: pos.arrow }
    : { top: pos.arrow };

  return { floatingRef, floatingStyles, arrowStyles, placement: pos.placement, ready: pos.ready };
}
```

- [ ] **Step 2: Build.** Run (PowerShell): `cd D:/evo/evo-ui; npm run build`
  Expected: build succeeds; `dist/index.d.ts` includes `useAnchoredPosition`. Capture the tail as evidence.

- [ ] **Step 3: Commit.**

```
git -C D:/evo add evo-ui/src/hooks/useAnchoredPosition.ts
git -C D:/evo commit -m "feat(evo-ui): add zero-dep useAnchoredPosition hook" -m "Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```
(Do NOT commit `dist/` — it is git-ignored; the build just verifies types.)

---

## Task 2: Retrofit `EvoSelect` menu onto the hook (canonical)

**Files:**
- Modify: `evo-ui/src/Select/Select.tsx`
- Modify: `evo-ui/src/css/select.module.scss:267-296` (the `.menu` block + keyframe)
- Build: `evo-ui`

**Interfaces:**
- Consumes: `useAnchoredPosition` from `../hooks/useAnchoredPosition` (Task 1).
- Produces: the canonical portal+hook menu pattern that Task 3 mirrors for AutoComplete/TreeSelect.

- [ ] **Step 1: Import `ReactDOM` + the hook.** At the top of `Select.tsx`, after the
  existing `import React, … from 'react';` line, add:

```tsx
import ReactDOM from 'react-dom';
import { useAnchoredPosition } from '../hooks/useAnchoredPosition';
```

- [ ] **Step 2: Call the hook.** Inside `EvoSelect`, immediately after the refs block
  (after `const listRef = useRef<HTMLDivElement>(null);`), add:

```tsx
  const { floatingRef, floatingStyles, placement } = useAnchoredPosition({
    open,
    anchorRef: triggerRef,
    placement: 'bottom',
    offset: 6,
    matchAnchorWidth: true,
  });
```

- [ ] **Step 3: Fix the click-outside handler** so the portaled menu doesn't count as
  "outside". Replace the existing effect body:

```tsx
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (!wrapperRef.current?.contains(e.target as Node)) {
        setOpen(false);
        setQuery('');
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);
```

with:

```tsx
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      const t = e.target as Node;
      // The menu is portaled to <body>, so it is no longer a DOM child of the
      // wrapper — check it explicitly or clicking an option would close first.
      if (!wrapperRef.current?.contains(t) && !floatingRef.current?.contains(t)) {
        setOpen(false);
        setQuery('');
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);
```

- [ ] **Step 4: Portal the menu + attach the ref/styles.** Find `{open && (` that opens
  the `<div className={styles.menu} role="listbox" …>`. Change the wrapper so it renders
  through a portal and receives the hook's ref/styles. Replace the opening:

```tsx
        {open && (
          <div
            className={styles.menu}
            role="listbox"
            id={listId}
            aria-labelledby={selectId}
            aria-multiselectable={isMultiple || undefined}
            aria-activedescendant={activeIdx >= 0 ? `${selectId}-opt-${activeIdx}` : undefined}
          >
```

with:

```tsx
        {open && typeof document !== 'undefined' && ReactDOM.createPortal(
          <div
            ref={floatingRef}
            className={styles.menu}
            data-placement={placement}
            style={floatingStyles}
            role="listbox"
            id={listId}
            aria-labelledby={selectId}
            aria-multiselectable={isMultiple || undefined}
            aria-activedescendant={activeIdx >= 0 ? `${selectId}-opt-${activeIdx}` : undefined}
          >
```

  Then find the matching close of that block:

```tsx
          </div>
        )}
```

  (the one immediately before `{name && !isMultiple && <input type="hidden" …`) and replace it with:

```tsx
          </div>,
          document.body,
        )}
```

- [ ] **Step 5: Update `.menu` SCSS.** In `evo-ui/src/css/select.module.scss`, replace the
  `.menu` opening (lines 267-272):

```scss
.menu {
  position: absolute;
  top: calc(100% + 6px);
  left: 0;
  right: 0;
  z-index: 100;
```

with (position now comes from the hook's inline `floatingStyles`; raise the stack above
the modal; the leading edge/width come from `matchAnchorWidth`):

```scss
.menu {
  z-index: 10000; // portaled to <body>: sit above EvoModal / CommandPalette (9999)
```

  Then, immediately AFTER the existing `@keyframes menuOpen { … }` block (ends at line 296),
  add the flipped-entrance variant:

```scss
/* Opened upward (flipped by useAnchoredPosition): grow from the bottom edge. */
.menu[data-placement='top'] {
  transform-origin: bottom center;
  animation-name: menuOpenUp;
}

@keyframes menuOpenUp {
  from { opacity: 0; transform: translateY(6px) scale(0.97); }
  to   { opacity: 1; transform: translateY(0) scale(1); }
}
```

- [ ] **Step 6: Build.** `cd D:/evo/evo-ui; npm run build` — expect success, no TS errors.

- [ ] **Step 7: Commit.**

```
git -C D:/evo add evo-ui/src/Select/Select.tsx evo-ui/src/css/select.module.scss
git -C D:/evo commit -m "fix(EvoSelect): flip menu upward near viewport bottom via useAnchoredPosition (#10)" -m "Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 3: Retrofit `EvoAutoComplete` + `EvoTreeSelect` (mirror Task 2)

Apply the **same** portal + hook + click-outside + SCSS transform as Task 2 to both
components. They share Select's menu pattern exactly; the only differences are the anchor
element and the keyframe names, called out below.

**Files:**
- Modify: `evo-ui/src/AutoComplete/AutoComplete.tsx`
- Modify: `evo-ui/src/css/autocomplete.module.scss:193-198` (+ keyframe)
- Modify: `evo-ui/src/TreeSelect/TreeSelect.tsx`
- Modify: `evo-ui/src/css/treeselect.module.scss:243-248` (+ keyframe)
- Build: `evo-ui`

**Interfaces:**
- Consumes: `useAnchoredPosition` (Task 1); the pattern established in Task 2.

### 3A — AutoComplete

- [ ] **Step 1: Imports.** Add after the existing `import … from 'react';`:

```tsx
import ReactDOM from 'react-dom';
import { useAnchoredPosition } from '../hooks/useAnchoredPosition';
```

- [ ] **Step 2: Anchor ref.** AutoComplete has no single trigger element — anchor to the
  visible input box (`styles.inputWrapper`). After the existing refs
  (`const debounceRef = …`), add:

```tsx
    const anchorRef = useRef<HTMLDivElement>(null);
```

  Then put that ref on the input-wrapper div. Change:

```tsx
          <div
            className={[
              styles.inputWrapper,
              sizeClass,
              open ? styles.open : '',
              error ? styles.hasError : '',
            ]
              .filter(Boolean)
              .join(' ')}
          >
```

  to add `ref={anchorRef}` as the first prop:

```tsx
          <div
            ref={anchorRef}
            className={[
              styles.inputWrapper,
              sizeClass,
              open ? styles.open : '',
              error ? styles.hasError : '',
            ]
              .filter(Boolean)
              .join(' ')}
          >
```

- [ ] **Step 3: Call the hook.** After the `anchorRef` line from Step 2, add:

```tsx
    const { floatingRef, floatingStyles, placement } = useAnchoredPosition({
      open,
      anchorRef,
      placement: 'bottom',
      offset: 6,
      matchAnchorWidth: true,
    });
```

- [ ] **Step 4: Click-outside.** Replace the handler condition. Change:

```tsx
      const handler = (e: MouseEvent) => {
        if (!wrapperRef.current?.contains(e.target as Node)) closeMenu();
      };
```

  to:

```tsx
      const handler = (e: MouseEvent) => {
        const t = e.target as Node;
        if (!wrapperRef.current?.contains(t) && !floatingRef.current?.contains(t)) closeMenu();
      };
```

- [ ] **Step 5: Portal the menu.** Change the menu open:

```tsx
          {open && (
            <div
              className={styles.menu}
              role="listbox"
              id={listId}
              aria-label={label ?? 'Suggestions'}
            >
```

  to:

```tsx
          {open && typeof document !== 'undefined' && ReactDOM.createPortal(
            <div
              ref={floatingRef}
              className={styles.menu}
              data-placement={placement}
              style={floatingStyles}
              role="listbox"
              id={listId}
              aria-label={label ?? 'Suggestions'}
            >
```

  And its matching close (the `</div>` + `)}` immediately before
  `{name && <input type="hidden" …`) from:

```tsx
            </div>
          )}
```

  to:

```tsx
            </div>,
            document.body,
          )}
```

- [ ] **Step 6: SCSS.** In `autocomplete.module.scss`, replace lines 193-198:

```scss
.menu {
  position: absolute;
  top: calc(100% + 6px);
  left: 0;
  right: 0;
  z-index: 100;
```

  with:

```scss
.menu {
  z-index: 10000; // portaled to <body>: sit above EvoModal / CommandPalette (9999)
```

  Then after the existing `@keyframes evoAcMenuOpen { … }` block, add:

```scss
.menu[data-placement='top'] {
  transform-origin: bottom center;
  animation-name: evoAcMenuOpenUp;
}

@keyframes evoAcMenuOpenUp {
  from { opacity: 0; transform: translateY(6px) scale(0.97); }
  to   { opacity: 1; transform: translateY(0) scale(1); }
}
```

### 3B — TreeSelect

- [ ] **Step 7: Imports.** Add after `import … from 'react';`:

```tsx
import ReactDOM from 'react-dom';
import { useAnchoredPosition } from '../hooks/useAnchoredPosition';
```

- [ ] **Step 8: Call the hook.** After `const listRef = useRef<HTMLDivElement>(null);`, add:

```tsx
  const { floatingRef, floatingStyles, placement } = useAnchoredPosition({
    open,
    anchorRef: triggerRef,
    placement: 'bottom',
    offset: 6,
    matchAnchorWidth: true,
  });
```

- [ ] **Step 9: Click-outside.** Replace:

```tsx
    const handler = (e: MouseEvent) => {
      if (!wrapperRef.current?.contains(e.target as Node)) {
        setOpen(false);
        setQuery('');
      }
    };
```

  with:

```tsx
    const handler = (e: MouseEvent) => {
      const t = e.target as Node;
      if (!wrapperRef.current?.contains(t) && !floatingRef.current?.contains(t)) {
        setOpen(false);
        setQuery('');
      }
    };
```

- [ ] **Step 10: Portal the menu.** Change:

```tsx
        {open && (
          <div className={styles.menu}>
```

  to:

```tsx
        {open && typeof document !== 'undefined' && ReactDOM.createPortal(
          <div
            ref={floatingRef}
            className={styles.menu}
            data-placement={placement}
            style={floatingStyles}
          >
```

  And its matching close (the `</div>` + `)}` immediately before
  `{name && <input type="hidden" …`) from:

```tsx
          </div>
        )}
```

  to:

```tsx
          </div>,
          document.body,
        )}
```

- [ ] **Step 11: SCSS.** In `treeselect.module.scss`, replace lines 243-248:

```scss
.menu {
  position: absolute;
  top: calc(100% + 6px);
  left: 0;
  right: 0;
  z-index: 100;
```

  with:

```scss
.menu {
  z-index: 10000; // portaled to <body>: sit above EvoModal / CommandPalette (9999)
```

  Then after the existing `@keyframes menuOpen { … }` block, add:

```scss
.menu[data-placement='top'] {
  transform-origin: bottom center;
  animation-name: menuOpenUp;
}

@keyframes menuOpenUp {
  from { opacity: 0; transform: translateY(6px) scale(0.97); }
  to   { opacity: 1; transform: translateY(0) scale(1); }
}
```

- [ ] **Step 12: Build.** `cd D:/evo/evo-ui; npm run build` — expect success.

- [ ] **Step 13: Commit.**

```
git -C D:/evo add evo-ui/src/AutoComplete/AutoComplete.tsx evo-ui/src/css/autocomplete.module.scss evo-ui/src/TreeSelect/TreeSelect.tsx evo-ui/src/css/treeselect.module.scss
git -C D:/evo commit -m "fix(EvoAutoComplete,EvoTreeSelect): flip menu upward near viewport bottom (#10)" -m "Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 4: `EvoBadge` `detail` hover popover (#11)

**Files:**
- Modify: `evo-ui/src/Badge/Badge.tsx` (rewrite with forwardRef + optional popover)
- Modify: `evo-ui/src/css/badge.module.scss` (append popover styles)
- Build: `evo-ui`

**Interfaces:**
- Consumes: `useAnchoredPosition`, `AnchorSide` (Task 1).
- Produces (public, additive): `EvoBadgeProps.detail?: React.ReactNode`,
  `EvoBadgeProps.detailPlacement?: AnchorSide` (default `'bottom'`). `EvoBadge` now
  `forwardRef<HTMLSpanElement>` and spreads `...rest` onto the root `<span>`.

**Design note (frontend-skills):** before finalizing the popover SCSS in Step 2, invoke
the `design-taste-frontend` skill and apply its guidance to the popover surface
(elevation, motion, spacing rhythm, dark-mode parity) — but stay strictly within the
token rules (no hex; use `--evo-*` / existing SCSS vars). The values below are a correct,
token-based baseline to refine, not a ceiling.

- [ ] **Step 1: Rewrite `Badge.tsx`** with EXACTLY this content:

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

  Note: the `(EvoBadge as … & { Group })` cast attaches the static sub-component to the
  `forwardRef` object (a plain `EvoBadge.Group =` assignment fails typing on a forwardRef
  exotic component). `EvoBadge.Group` usage is unchanged for consumers.

- [ ] **Step 2: Append popover SCSS** to `evo-ui/src/css/badge.module.scss` (after the
  existing `.badgeGroup` block). Refine under `design-taste-frontend`, tokens only:

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
  box-shadow:
    0 16px 32px -12px rgb(0 0 0 / 0.35),
    0 6px 12px -4px rgb(0 0 0 / 0.18);
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

  Note: `arrowStyles` supplies the cross-axis offset inline (`left` for top/bottom,
  `top` for left/right); the `transform: translateX/Y(-50%)` above centers the arrow on
  that offset. The arrow border color uses `$color-surface-elevated` so it matches the
  popover fill in both themes (token-driven — no hex).

- [ ] **Step 3: Build.** `cd D:/evo/evo-ui; npm run build` — expect success.

- [ ] **Step 4: Commit.**

```
git -C D:/evo add evo-ui/src/Badge/Badge.tsx evo-ui/src/css/badge.module.scss
git -C D:/evo commit -m "feat(EvoBadge): add hover detail popover with viewport-aware positioning (#11)" -m "Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 5: Retrofit `EvoTooltip` onto the hook

**Files:**
- Modify: `evo-ui/src/Tooltip/Tooltip.tsx` (rewrite)
- Modify: `evo-ui/src/css/tooltip.module.scss` (rewrite positioning + arrow)
- Build: `evo-ui`

**Interfaces:**
- Consumes: `useAnchoredPosition`, `AnchorSide` (Task 1).
- Produces: no public API change. `placement` is now the *preferred* side (flips when it
  won't fit). Public prop names/types unchanged.

**Design note (frontend-skills):** invoke `design-taste-frontend` and keep the tooltip's
visual language (compact, elevated, 150ms ease) intact while moving positioning to the hook.

- [ ] **Step 1: Rewrite `Tooltip.tsx`** with EXACTLY this content:

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

- [ ] **Step 2: Rewrite `tooltip.module.scss`** with EXACTLY this content (positioning
  moves to inline `floatingStyles`; arrow keyed off `data-placement` + inline `arrowStyles`):

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

  Note: the arrow's cross-axis position comes from inline `arrowStyles`
  (`left`/`top`); `translateX/Y(-50%)` centers it on that point.

- [ ] **Step 3: Build.** `cd D:/evo/evo-ui; npm run build` — expect success.

- [ ] **Step 4: Commit.**

```
git -C D:/evo add evo-ui/src/Tooltip/Tooltip.tsx evo-ui/src/css/tooltip.module.scss
git -C D:/evo commit -m "feat(EvoTooltip): auto-flip via useAnchoredPosition; placement is now preferred side" -m "Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 6: Docs, skills, changelog, version bump, rebuild

Register everything per CLAUDE.md §1. Read each target file first and match its existing
structure; insert the exact content below.

**Files:**
- Modify: `evo-docs/src/pages/BadgePage.tsx`
- Modify: `evo-docs/src/pages/SelectPage.tsx`, `AutoCompletePage.tsx`, `TreeSelectPage.tsx`, `TooltipPage.tsx`
- Modify: `evo-docs/src/components/ComponentPreviews.tsx` (Badge preview, if it renders one)
- Modify: `skills/evo-badge/SKILL.md`, `skills/evo-select/SKILL.md`, `skills/evo-autocomplete/SKILL.md`, `skills/evo-tree-select/SKILL.md`, `skills/evo-tooltip/SKILL.md`
- Modify: `evo-docs/src/pages/ChangelogPage.tsx`
- Modify: `evo-ui/package.json` (version bump)
- Build: `evo-ui`

- [ ] **Step 1: BadgePage — add the two props to the PropsTable** (`evo-docs/src/pages/BadgePage.tsx`),
  after the `removable`/`onRemove` rows and before `className`:

```tsx
          { prop: 'detail', type: 'ReactNode', description: 'Rich content revealed in a popover on hover / focus / tap. Descriptive (non-interactive).' },
          { prop: 'detailPlacement', type: "'top' | 'bottom' | 'left' | 'right'", default: "'bottom'", description: 'Preferred popover side; flips automatically when there is no room.' },
```

- [ ] **Step 2: BadgePage — add a live example section** before the `<EvoDivider />`.
  Add `EvoStack` to the import from `@justin_evo/evo-ui` if not present, then:

```tsx
      <div className="docs-section">
        <div className="docs-section-title">Detail popover</div>
        <p className="docs-section-desc">
          Pass <code>detail</code> to reveal extra status context on hover, keyboard focus,
          or tap. The popover uses viewport-aware positioning — it flips and shifts to stay
          on-screen, and escapes <code>overflow: hidden</code> containers.
        </p>
        <div className="docs-preview">
          <EvoBadge severity="success" dot detail="Deployed 2 min ago · commit a1b2c3d">
            Live
          </EvoBadge>
          <EvoBadge severity="warning" dot detail="3 checks pending · retry in 30s">
            Pending
          </EvoBadge>
          <EvoBadge severity="danger" dot detail="Build failed: 2 tests · view logs">
            Failed
          </EvoBadge>
        </div>
        <CodeBlock code={`<EvoBadge severity="success" dot detail="Deployed 2 min ago · commit a1b2c3d">
  Live
</EvoBadge>`} />
      </div>
```

- [ ] **Step 3: SelectPage / AutoCompletePage / TreeSelectPage / TooltipPage — behavior note.**
  In each, add one `docs-section` (place near the top, after the header) documenting the new
  behavior. Use `.docs-section-desc` (never inline styles / hex). For the three selects:

```tsx
      <div className="docs-section">
        <div className="docs-section-title">Viewport-aware menu</div>
        <p className="docs-section-desc">
          The dropdown measures available space when it opens and flips upward when the
          trigger sits near the bottom of the viewport. It renders in a portal, so it is
          never clipped by <code>overflow: hidden</code> or scroll containers — including
          inside an <code>EvoModal</code>. Fully automatic; no configuration.
        </p>
      </div>
```

  For TooltipPage, add:

```tsx
      <div className="docs-section">
        <div className="docs-section-title">Auto-flip</div>
        <p className="docs-section-desc">
          <code>placement</code> is the <em>preferred</em> side. If there isn't room there,
          the tooltip flips to the opposite side and shifts to stay fully on-screen, so it
          never renders off the edge or clipped by a scroll container.
        </p>
      </div>
```

- [ ] **Step 4: ComponentPreviews.** Read `evo-docs/src/components/ComponentPreviews.tsx`.
  If it renders a Badge preview, leave the visible shape as-is (the base badge is
  unchanged). No change required unless the Badge preview errors; if so, ensure it still
  compiles. (Document "no change needed" in the report if the file has no Badge-shape dependency.)

- [ ] **Step 5: evo-badge SKILL.md.** In `skills/evo-badge/SKILL.md`:
  - Add two rows to the Props table (after `onRemove`, before `className`):

```md
| `detail` | `React.ReactNode` | — | No | Rich content revealed in a popover on hover / focus / tap. Descriptive (non-interactive). |
| `detailPlacement` | `'top' \| 'bottom' \| 'left' \| 'right'` | `'bottom'` | No | Preferred popover side; flips automatically when there is no room. |
```

  - **Correct the ref note (lines ~58 and ~171).** EvoBadge now forwards `ref` and spreads
    `...rest`. Replace the line 58 note with:

```md
Note: EvoBadge forwards `ref` to the root `<span>` and spreads standard HTML attributes (`...rest`, e.g. `id`, `title`, `data-*`, `onClick`) onto it. When `detail` is set, the badge manages its own hover/focus/tap/keydown handlers and `tabIndex`.
```

  - Replace the line ~171 gotcha ("No `ref` / `...rest` forwarding…") with:

```md
- With `detail`, the badge is a focusable disclosure trigger (`tabIndex=0`, `aria-describedby` → popover) and toggles on tap for touch; it opens on hover/focus and closes on blur/`Escape`. The popover is portaled to `<body>` and flips/shifts to stay on-screen.
```

  - Add a gotcha bullet:

```md
- `detail` is intended for descriptive, non-interactive content. Do not put focusable controls (links/buttons) inside it — the popover uses `role="tooltip"`, which is not a focus container.
```

- [ ] **Step 6: evo-select / evo-autocomplete / evo-tree-select / evo-tooltip SKILL.md.**
  Add one gotcha bullet to each (in their `## Gotchas` section). For the three selects:

```md
- The dropdown menu is viewport-aware: it renders in a portal and flips upward when the trigger is near the bottom of the screen, so it is never clipped by `overflow: hidden` / scroll containers (including inside an EvoModal). Automatic; no props.
```

  For evo-tooltip:

```md
- `placement` is the *preferred* side. The tooltip auto-flips to the opposite side and shifts to stay on-screen when the preferred side lacks room; it renders in a portal so it is never clipped.
```

- [ ] **Step 7: Changelog.** In `evo-docs/src/pages/ChangelogPage.tsx`, prepend to the
  `RELEASES` array (before the `1.2.0` entry):

```ts
  {
    version: '1.3.0',
    date: '2026-07-12',
    summary:
      'Viewport-aware positioning across every floating layer: dropdowns flip near the screen edge, EvoBadge gains a hover detail popover, and EvoTooltip auto-flips — all on one shared zero-dependency hook.',
    sections: [
      {
        kind: 'Added',
        items: [
          'EvoBadge — new `detail` prop renders a rich popover on hover / focus / tap (with `detailPlacement` to set the preferred side). It uses viewport-aware positioning: flips and shifts to stay on-screen and escapes `overflow: hidden` / scroll containers. EvoBadge now also forwards `ref` and spreads standard HTML attributes.',
        ],
      },
      {
        kind: 'Fixed',
        items: [
          'EvoSelect, EvoAutoComplete, EvoTreeSelect — the dropdown menu no longer clips or overflows when the trigger sits near the bottom of the viewport. It now measures available space, flips upward when needed, and renders in a portal so it is never clipped by `overflow: hidden` / scroll containers (including inside an EvoModal). (#10)',
        ],
      },
      {
        kind: 'Changed',
        items: [
          'EvoTooltip — `placement` is now the *preferred* side: the tooltip auto-flips to the opposite side and shifts to stay fully on-screen when the preferred side lacks room, and renders in a portal so it is never clipped. Existing `placement` values keep working unchanged when they fit.',
        ],
      },
    ],
  },
```

- [ ] **Step 8: Version bump.** In `evo-ui/package.json`, change `"version": "1.2.1"` to
  `"version": "1.3.0"`.

- [ ] **Step 9: Rebuild.** `cd D:/evo/evo-ui; npm run build` — expect success. The docs app
  reads the local `dist/` via its junction, so this makes the new Badge prop available to
  the docs build. (Do NOT bump `evo-docs`'s `^1.2.1` range — it already satisfies 1.3.0 —
  and do NOT publish or deploy; both are gated by §7/§13.)

- [ ] **Step 10: Commit.**

```
git -C D:/evo add evo-docs/src/pages/BadgePage.tsx evo-docs/src/pages/SelectPage.tsx evo-docs/src/pages/AutoCompletePage.tsx evo-docs/src/pages/TreeSelectPage.tsx evo-docs/src/pages/TooltipPage.tsx evo-docs/src/components/ComponentPreviews.tsx skills/evo-badge/SKILL.md skills/evo-select/SKILL.md skills/evo-autocomplete/SKILL.md skills/evo-tree-select/SKILL.md skills/evo-tooltip/SKILL.md evo-docs/src/pages/ChangelogPage.tsx evo-ui/package.json
git -C D:/evo commit -m "docs(evo-ui): document viewport-aware positioning; EvoBadge detail; bump 1.3.0" -m "Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

(If `ComponentPreviews.tsx` needs no change, drop it from the `git add` list.)

---

## Final steps (controller, after all tasks)

- Dispatch the whole-branch code review (`superpowers:requesting-code-review`) on the most
  capable model; fix Critical/Important with one fix subagent.
- Then STOP and hand to the user for **`finishing-a-development-branch`** — PR/merge/publish
  are gated by CLAUDE.md §7. Provide the manual smoke-test checklist (dark mode, 375px,
  Select-inside-Modal, badge near each viewport edge, keyboard/Escape).

## Self-review notes (spec coverage)

- #10 clipping → Tasks 2, 3 (+ hook). #11 badge detail → Task 4 (+ hook). Tooltip retrofit
  → Task 5. Shared hook → Task 1. Docs/skills/changelog/version → Task 6. All spec §7
  deliverables mapped.
- Type consistency: `useAnchoredPosition` is generic on the anchor element type `T`, so
  `triggerRef` (`HTMLButtonElement`), the AutoComplete input-wrapper (`HTMLDivElement`) and
  the Badge/Tooltip anchors (`HTMLSpanElement`) all type-check without casts. `floatingRef`
  is `HTMLDivElement` and every floating element is a `<div>`.
- Known trade-off (surface to user at the end, not blocking): a `detail` badge is a
  label-sized tap target (< 44px), below CLAUDE.md §0.2's touch-target guidance — acceptable
  because the popover is a supplementary disclosure (hover/focus primary), documented as
  such. Do not force 44px (it would break badge sizing).
```
