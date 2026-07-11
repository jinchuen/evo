# Viewport-Aware Positioning — Design Spec

**Date:** 2026-07-11
**Author:** Claude (Opus 4.8) with jinchuen
**Issues:** #10 (bug — dropdowns don't flip near viewport bottom) + #11 (enhancement — EvoBadge hover detail popover)
**Branch:** `feat/viewport-aware-positioning`

---

## 1. Goal

Both issues are the **same missing primitive** surfacing twice: none of Evo's
floating layers do viewport collision detection. Build **one shared, zero-dependency
positioning hook** and consume it everywhere a layer floats:

- **#10 (bug):** `EvoSelect` / `EvoAutoComplete` / `EvoTreeSelect` menus hardcode
  `top: calc(100% + 6px)` and clip when the trigger sits low in the viewport.
- **#11 (feature):** `EvoBadge` gains an optional `detail` popover revealed on
  hover/focus, positioned with the same hook (flips **both** axes since a badge can
  sit anywhere).
- **Retrofit:** `EvoTooltip` — the third hand-rolled copy of the broken pattern —
  moves onto the hook too, killing the class of bug for good.

Ships as **`@justin_evo/evo-ui@1.3.0`** (minor: additive hook + additive Badge prop +
non-breaking flip behavior).

---

## 2. Global constraints (from CLAUDE.md — bind every task)

- **Zero runtime deps** (§7, §13.1). No `@floating-ui/*`. Hook is hand-rolled on
  `getBoundingClientRect`. *(User decision 2026-07-11.)*
- **Tokens only** (§0.2). All SCSS uses `--evo-*` / existing SCSS vars. **No raw hex**
  (`#94a3b8` / `#e2e8f0` / `#1e293b` forbidden — break dark mode).
- **Do NOT edit** `evo-ui/src/css/tokens.css` (§7). New z-index / sizing values live in
  the component `.module.scss` files.
- **Dark mode + 375px mobile + ≥44px touch targets** verified before done (§0.2, §1).
- **`forwardRef` + `...rest` passthrough** on any component we (re)touch (§0.1, §2).
- **Docs are the contract** (§0.3). Every touched component updates its docs page,
  its `skills/evo-*/SKILL.md`, the Changelog, and the version — or the change is
  incomplete.
- **SSR-safe.** Guard `window`/`document`; isomorphic layout effect (mirror the
  existing `evoLocalRecents` `typeof window` guard).
- **No unit-test runner exists** (confirmed in prior SDD run). Verification =
  `cd evo-ui && npm run build` (tsc + SCSS compile) green, plus the manual browser
  smoke test in §1 of CLAUDE.md (human step).

---

## 3. Architecture — `useAnchoredPosition` (internal hook)

**New file:** `evo-ui/src/hooks/useAnchoredPosition.ts`.
**Internal only** — NOT exported from `src/index.ts`. It is a shared utility *within*
the library (what the issues asked for), not new public API — so it needs no docs page
and no AI-catalogue entry, and adds zero public surface to maintain.

### 3.1 Contract

```ts
export type AnchorSide = 'top' | 'bottom' | 'left' | 'right';

export interface UseAnchoredPositionOptions {
  open: boolean;                               // measure only while true
  anchorRef: React.RefObject<HTMLElement | null>;
  placement?: AnchorSide;                      // PREFERRED side; default 'bottom'
  offset?: number;                             // gap anchor↔floating (px); default 6
  viewportPadding?: number;                    // min gap to viewport edge (px); default 8
  matchAnchorWidth?: boolean;                  // floating width := anchor width; default false
}

export interface AnchoredPosition {
  floatingRef: React.RefObject<HTMLDivElement | null>; // attach to floating element
  floatingStyles: React.CSSProperties;         // spread onto floating element
  arrowStyles: React.CSSProperties;            // cross-axis offset for an optional arrow
  placement: AnchorSide;                       // side chosen AFTER flip
  ready: boolean;                              // false until first measure (anti-flash)
}

export function useAnchoredPosition(o: UseAnchoredPositionOptions): AnchoredPosition;
```

### 3.2 Behavior

1. **Portal + `position: fixed`.** Callers render the floating element through
   `createPortal(…, document.body)` and spread `floatingStyles`
   (`{ position:'fixed', top, left }`). `fixed` + portal escapes every
   `overflow:hidden` / scroll-clip ancestor — the core of both issues.
2. **Main-axis flip.** If the preferred side lacks room for the measured floating size
   **and** the opposite side has more, flip to the opposite side. Otherwise keep the
   preferred side (or the roomier one if neither fits).
3. **Cross-axis clamp (shift).** Align the floating element's leading edge to the
   anchor, then clamp within `[viewportPadding, viewport − size − viewportPadding]` so
   it never leaves the screen (handles badges near the left/right edge).
4. **Arrow offset.** `arrowStyles` positions an optional arrow at the anchor's center,
   clamped to stay within the floating box (used by Tooltip; ignored by menus).
5. **Reposition while open.** `scroll` (capture — catches nested scrollers) + `resize`
   listeners, rAF-throttled, attached only while `open`, removed on close/unmount.
6. **Anti-flash.** `ready:false` until the first measurement; `floatingStyles.visibility`
   is `'hidden'` until then. Measured in an SSR-safe isomorphic layout effect (runs
   before paint on the client).

### 3.3 Reference implementation (worked out in full; plan will finalize)

```tsx
import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';

const useIsoLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

export type AnchorSide = 'top' | 'bottom' | 'left' | 'right';
const isVertical = (s: AnchorSide) => s === 'top' || s === 'bottom';

export function useAnchoredPosition({
  open, anchorRef, placement = 'bottom',
  offset = 6, viewportPadding = 8, matchAnchorWidth = false,
}: UseAnchoredPositionOptions): AnchoredPosition {
  const floatingRef = useRef<HTMLDivElement | null>(null);
  const [s, setS] = useState({ top: 0, left: 0, width: undefined as number | undefined,
    arrow: 0, placement, ready: false });

  const compute = useCallback(() => {
    const anchor = anchorRef.current, floating = floatingRef.current;
    if (!anchor || !floating) return;
    const a = anchor.getBoundingClientRect();
    const f = floating.getBoundingClientRect();
    const vw = window.innerWidth, vh = window.innerHeight, pad = viewportPadding;

    let side = placement;
    if (isVertical(placement)) {
      const below = vh - a.bottom - offset, above = a.top - offset;
      if (placement === 'bottom' && f.height > below && above > below) side = 'top';
      if (placement === 'top' && f.height > above && below > above) side = 'bottom';
    } else {
      const right = vw - a.right - offset, left = a.left - offset;
      if (placement === 'right' && f.width > right && left > right) side = 'left';
      if (placement === 'left' && f.width > left && right > left) side = 'right';
    }

    let top = 0, left = 0;
    if (side === 'bottom') top = a.bottom + offset;
    else if (side === 'top') top = a.top - f.height - offset;
    else if (side === 'right') left = a.right + offset;
    else left = a.left - f.width - offset;

    if (isVertical(side)) {
      left = Math.min(Math.max(a.left, pad), Math.max(pad, vw - f.width - pad));
    } else {
      top = Math.min(Math.max(a.top, pad), Math.max(pad, vh - f.height - pad));
    }

    const arrow = isVertical(side)
      ? Math.min(Math.max(a.left + a.width / 2 - left, 12), f.width - 12)
      : Math.min(Math.max(a.top + a.height / 2 - top, 12), f.height - 12);

    setS({ top: Math.round(top), left: Math.round(left),
      width: matchAnchorWidth ? Math.round(a.width) : undefined,
      arrow: Math.round(arrow), placement: side, ready: true });
  }, [anchorRef, placement, offset, viewportPadding, matchAnchorWidth]);

  useIsoLayoutEffect(() => {
    if (!open) { setS(p => (p.ready ? { ...p, ready: false } : p)); return; }
    compute();
    let raf = 0;
    const onMove = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(compute); };
    window.addEventListener('scroll', onMove, true);
    window.addEventListener('resize', onMove);
    return () => { cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onMove, true);
      window.removeEventListener('resize', onMove); };
  }, [open, compute]);

  return {
    floatingRef,
    floatingStyles: { position: 'fixed', top: s.top, left: s.left,
      ...(s.width !== undefined ? { width: s.width } : null),
      visibility: s.ready ? undefined : 'hidden' },
    arrowStyles: isVertical(s.placement) ? { left: s.arrow } : { top: s.arrow },
    placement: s.placement, ready: s.ready,
  };
}
```

*(`visibility:hidden` — not `display:none` — is deliberate: hidden elements still
report layout via `getBoundingClientRect`, so we can measure before revealing.)*

---

## 4. Component changes

### 4.1 #10 — Select / AutoComplete / TreeSelect (identical transform)

For each of the three, the menu `<div className={styles.menu}>` becomes:

```tsx
const { floatingRef, floatingStyles, placement } = useAnchoredPosition({
  open, anchorRef: triggerRef, placement: 'bottom', offset: 6, matchAnchorWidth: true,
});
// …
{open && createPortal(
  <div ref={floatingRef} className={styles.menu} data-placement={placement}
       style={floatingStyles} /* …existing role/aria… */>
    {/* …unchanged menu contents… */}
  </div>,
  document.body,
)}
```

- **Anchor refs:** Select/TreeSelect → existing `triggerRef` (the `<button>`).
  AutoComplete → add a `ref` to the `styles.inputWrapper` div (the visible field).
- **Click-outside fix (critical).** The menu is no longer a DOM child of `wrapperRef`,
  so `wrapperRef.current?.contains(target)` would fire on every option click and close
  the menu before it registers. Change each handler to:
  `if (!wrapperRef.current?.contains(t) && !floatingRef.current?.contains(t)) close()`.
- **SCSS (`select` / `autocomplete` / `treeselect` `.module.scss`).** Remove
  `position:absolute; top/left/right` from `.menu` (position now comes from inline
  `floatingStyles`). Keep all visual styles (bg, border, radius, shadow, `menuOpen`
  animation). Add `.menu[data-placement='top']` to invert `transform-origin` /
  entrance `translateY` for the flipped case. Raise `z-index` **above the modal layer**
  (exact value read from `modal.module.scss` in the plan) so a Select opened inside an
  `EvoModal` renders above it.
- `matchAnchorWidth: true` reproduces the old full-width menu (wrapper width == trigger
  width today).

### 4.2 #11 — EvoBadge `detail` popover

**Public API (additive, non-breaking):**

```ts
interface EvoBadgeProps {
  // …existing…
  /** Optional rich content revealed in a popover on hover/focus/tap. */
  detail?: React.ReactNode;
  /** Preferred popover side; flips when there's no room. Default 'bottom'. */
  detailPlacement?: 'top' | 'bottom' | 'left' | 'right';
}
```

- **No `detail`** → renders exactly as today (bare styled `<span>`), fully backward
  compatible. `EvoBadge` also gains `forwardRef` + `...rest` passthrough (closes a
  pre-existing §0.1 gap; non-breaking — refs simply start working).
- **With `detail`:** the badge becomes an anchor with `tabIndex={0}`,
  `aria-describedby` → popover id, `aria-expanded`. Popover rendered via portal + the
  hook (`placement: detailPlacement`), so it flips both axes and escapes
  `overflow:hidden` cards.
- **Interaction model:**
  - Hover-intent: **open** after ~120 ms of hover, **close** after ~140 ms — prevents
    flicker when the pointer sweeps a row of badges.
  - Pointer-bridge: `onMouseEnter` on the **popover** cancels the pending close, so
    moving from badge → popover keeps it open despite the `offset` gap.
  - Keyboard: `focus` opens immediately, `blur` closes, `Escape` closes and returns
    focus to the badge.
  - Touch: `onClick` toggles (no hover on touch devices).
- **ARIA:** popover `role="tooltip"` + `aria-describedby` link. `detail` is intended
  for descriptive (non-interactive) content — documented as a gotcha.
- **Visual design (frontend-skills).** The popover surface (elevation, motion, spacing
  rhythm, dark-mode parity, ≥44px touch target on the tap toggle) is designed under the
  **`design-taste-frontend`** skill at implementation time, within the token rules
  above. Intent: a compact elevated panel (`--evo-color` surface + border + soft
  shadow), 160 ms ease entrance, arrow via `arrowStyles`.

### 4.3 EvoTooltip retrofit

- Replace CSS-only placement with the hook. `placement` prop becomes the **preferred**
  side (non-breaking: still honored whenever it fits; only flips when it wouldn't).
- Portal + `fixed`; arrow positioned via `arrowStyles` so it keeps pointing at the
  anchor even after a cross-axis clamp.
- Internal `visible` state renamed to `open` for cross-component consistency (§0.1;
  internal only, no API change).

---

## 5. Accessibility

- **Menus (#10):** behavior unchanged (still `role="listbox"`/`tree`,
  `aria-activedescendant`, full keyboard nav). Portaling does not alter the a11y tree
  semantics; `aria-controls` still links trigger → menu by id.
- **Badge (#11):** `Escape` closes + restores focus; focus opens (keyboard parity with
  hover); `aria-describedby` associates the detail; tap toggle for touch.
- **Tooltip:** unchanged semantics; gains resilience (never renders off-screen).

---

## 6. Breaking changes & risk

**Breaking changes:** none. (Version = **minor**, 1.3.0.)

**Risks (mitigated by the SDD per-task review loop + final whole-branch review):**

| Risk | Mitigation |
| --- | --- |
| Portaled menu + click-outside closes before an option registers | Explicit fix: check `wrapperRef` **or** `floatingRef` in every handler (§4.1). |
| Portaled menu renders under an `EvoModal` | Set the floating `z-index` above the modal layer; smoke-test a Select inside a Modal. |
| Position flash on first open | `ready`/`visibility:hidden` gate + isomorphic layout effect. |
| Menu doesn't follow the anchor on scroll (now `fixed`) | `scroll`(capture)+`resize` rAF-throttled reposition while open. |
| SSR crash on `document`/`window` | Portal + measurement guarded; isomorphic layout effect. |

---

## 7. Deliverables checklist (CLAUDE.md §1 per touched component)

- Hook: `evo-ui/src/hooks/useAnchoredPosition.ts` (+ internal barrel note; NOT public).
- Components: `Select.tsx`, `AutoComplete.tsx`, `TreeSelect.tsx`, `Badge.tsx`,
  `Tooltip.tsx` (+ their `.module.scss`).
- Docs pages: `SelectPage`, `AutoCompletePage`/`AutocompletePage`, `TreeSelectPage`,
  `BadgePage`, `TooltipPage` — add the `detail` prop row + a flip/behavior note +
  live example.
- Overview preview: `ComponentPreviews.tsx` (Badge shape change).
- Skills: `evo-badge`, `evo-select`, `evo-autocomplete`, `evo-tree-select`,
  `evo-tooltip` `SKILL.md`.
- Changelog: one `1.3.0` entry (`Added` Badge `detail` + positioning; `Fixed` #10
  clipping; `Changed` Tooltip flip).
- Version: `evo-ui/package.json` `1.2.1 → 1.3.0`; rebuild `dist/`.
- AI catalogue (`AIPromptPage.tsx`): no new *component* → no change (hook is internal).
- `evo-docs` dependency range stays `^1.2.1` (satisfies 1.3.0); local docs read the
  junction → local `dist` after rebuild. No publish (gated by §7 / user).

---

## 8. Task breakdown (for the implementation plan)

1. **Hook** — `useAnchoredPosition` + isomorphic layout effect (no consumers yet).
2. **Select** — retrofit to portal + hook + click-outside fix + SCSS (canonical).
3. **AutoComplete + TreeSelect** — mirror the Select retrofit.
4. **Badge** — `detail` popover: forwardRef, hover-intent, keyboard, touch, portal, SCSS
   (visual design under `design-taste-frontend`).
5. **Tooltip** — retrofit onto the hook (flip + arrow).
6. **Docs + skills + changelog + version bump + rebuild** — register everything.

Each task ends with `npm run build` green; final whole-branch review; then
`finishing-a-development-branch` (PR/merge gated on user — §7).

---

## 9. Out of scope (follow-ups)

- Exposing `useAnchoredPosition` as public API (+ its own docs page).
- Retrofitting `TopNav` / `CommandPalette` onto the hook.
- Publishing 1.3.0 to npm / deploying docs (both gated, §7 / §13).
</content>
</invoke>
