# Task 3 Report: EvoTopNav entrance, sticky, scrollBehavior, showProgress

## What changed

### `evo-ui/src/TopNav/TopNav.tsx`

1. **Step 1 — Props interface**: Added four optional props after `collapseBelow`:
   - `entrance?: 'none' | 'rise' | 'fade'`
   - `sticky?: boolean`
   - `scrollBehavior?: 'none' | 'elevate' | 'shrink' | 'hide'`
   - `showProgress?: boolean`

2. **Step 2 — `useScrollState` hook**: Added rAF-throttled scroll hook after `usePrefersReducedMotion`. Tracks `scrolled`, `hidden`, and `progress` state; passive scroll/resize listeners; short-circuits when disabled.

3. **Step 3 — Root component wiring**:
   - Updated destructure to pull out the four new props (defaulting to off) plus `style` from rest.
   - Added `scrollEnabled`, `scrolled`/`hidden`/`progress` from `useScrollState`, `animateEntrance`, and `mergedStyle` (merges incoming consumer `style` with `--evo-topnav-progress` CSS var when `showProgress` is true).
   - Updated `<nav>` to conditionally add `styles.topNavSticky`, `style={mergedStyle}`, and four `data-*` attributes (`data-entrance`, `data-scroll`, `data-scrolled`, `data-hidden`).
   - Added `{showProgress && <span className={styles.topNavProgress} aria-hidden="true" />}` inside `<nav>`.

### `evo-ui/src/css/topnav.module.scss`

4. **Step 4a — New keyframes**: Added `@keyframes topNavRise` and `@keyframes topNavFade` after `topNavDropdownFadeIn`.

5. **Step 4b — New CSS rules** (inserted before the `// Reduced motion` section):
   - Entrance animation selectors for `data-entrance='rise'` and `data-entrance='fade'`.
   - Left-to-right stagger delays for brand / menu items / search / actions.
   - `.topNavSticky` (position sticky, z-index 30).
   - `[data-scroll]` transition rule.
   - `[data-scrolled]` backdrop-blur + shadow rule (uses `$color-surface`, `$shadow-md`).
   - `[data-scroll='shrink'][data-scrolled]` min-height shrink.
   - `[data-scroll='hide']` will-change + `[data-hidden]` translateY(-100%).
   - `.topNavProgress` absolute bar using `$evo-primary-color`, scaled by `--evo-topnav-progress`.

6. **Step 5 — Reduced-motion guards**:
   - Inside `.topNavReducedMotion`: added `animation: none !important` for brand/menu/search/actions; `transition: none` for hide and progress.
   - Inside `@media (prefers-reduced-motion: reduce)`: added `animation: none !important` for `[data-entrance]` children.

## Build command and output tail

```
cd D:/evo/evo-ui; npm run build
```

```
✓ 61 modules transformed.
../dist/evo-ui.css   192.55 kB │ gzip: 31.93 kB
../dist/index.es.js  211.80 kB │ gzip: 53.55 kB
[vite:dts] Declaration files built in 2858ms.
../dist/evo-ui.css    192.55 kB │ gzip: 31.93 kB
../dist/index.cjs.js  144.63 kB │ gzip: 45.20 kB
✓ built in 4.04s
```

No TypeScript or SCSS errors. The `[vite:dts] Outside emitted: demo/dist/index.d.ts` warning is pre-existing (not introduced by this task).

## Files changed

- `evo-ui/src/TopNav/TopNav.tsx` — +~89 lines (hook + prop wiring)
- `evo-ui/src/css/topnav.module.scss` — +~90 lines (keyframes + new rules)

## Commit

```
8d98deb feat(TopNav): add entrance, sticky, scrollBehavior and showProgress props
```

Staged: only the two files above. `git add -A` was NOT used. `.superpowers/` and `dist/` were not staged.

## Self-review checklist

- [x] Defaults keep existing render unchanged — all four props default to off; the `<nav>` is byte-for-byte identical when no new prop is set (no extra class, no extra data-* attrs, no extra child nodes, `style` is `undefined` which spreads cleanly).
- [x] `style` is merged, not dropped — `mergedStyle` spreads incoming `style` before injecting the CSS var; when `showProgress` is false the raw `style` is passed through unchanged.
- [x] `data-*` attributes only set when active — all use `|| undefined` or conditional ternary so they are absent when the feature is off.
- [x] Only the two target files changed — confirmed by commit diff (2 files).
- [x] Build clean — no TS/SCSS errors.
- [x] No raw hex — all color/shadow/transition values use SCSS tokens (`$color-surface`, `$shadow-md`, `$evo-primary-color`, `$transition-fast`).
- [x] Zero new runtime dependencies — no imports added.

## Concerns

None. The pre-existing `[vite:dts] Outside emitted: demo/dist/index.d.ts` warning appeared before this task and is unrelated to the changes made here.

## Fix pass (review findings)

### Fix 1: color-mix fallback for scrolled bar

**File:** `evo-ui/src/css/topnav.module.scss` line 431

Added a solid token fallback line immediately before the `color-mix()` declaration in the `.topNav[data-scrolled]` rule:

```scss
.topNav[data-scrolled] {
  background-color: $color-surface; // fallback for browsers without color-mix()
  background-color: color-mix(in srgb, $color-surface 85%, transparent);
```

This ensures older browsers that do not support `color-mix()` still display a scrolled state with the correct background token.

### Fix 2: reset lastY on disable

**File:** `evo-ui/src/TopNav/TopNav.tsx` line 181–185

Added `lastY.current = 0;` in the `useScrollState` hook's early-return branch when the hook is disabled or running server-side:

```tsx
    if (typeof window === 'undefined' || !enabled) {
      setScrolled(false);
      setHidden(false);
      setProgress(0);
      lastY.current = 0;
      return;
    }
```

This prevents stale scroll position from triggering incorrect hide/show transitions when the hook is re-enabled.

### Build verification

```
cd D:/evo/evo-ui; npm run build
```

Output tail:
```
✓ 61 modules transformed.
../dist/evo-ui.css   192.60 kB │ gzip: 31.93 kB
../dist/index.es.js  211.81 kB │ gzip: 53.57 kB
[vite:dts] Declaration files built in 2728ms.
../dist/evo-ui.css   192.60 kB │ gzip: 31.93 kB
../dist/index.cjs.js 144.65 kB │ gzip: 45.20 kB
✓ built in 3.93s
```

**No TypeScript or SCSS errors.** Pre-existing warning: `[vite:dts] Outside emitted: demo/dist/index.d.ts` (unrelated).

### Commit

```
f9d2145 fix(TopNav): color-mix fallback for scrolled bar; reset scroll baseline on disable
```

Staged: exactly the two files specified (`TopNav.tsx` and `topnav.module.scss`). No `git add -A` used.
