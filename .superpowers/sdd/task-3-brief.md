# Task 3: EvoTopNav — entrance, scroll behavior, progress (root props)

**Files:**
- Modify: `evo-ui/src/TopNav/TopNav.tsx` (props interface; new `useScrollState` hook; root render)
- Modify: `evo-ui/src/css/topnav.module.scss` (keyframes, stagger, scroll states, progress, reduced-motion)
- Build: `evo-ui` (`npm run build`)

**Interfaces:**
- Consumes: existing `usePrefersReducedMotion`, `cn`, `styles`, root `forwardRef` signature, and the React hooks already imported (`useState`, `useEffect`, `useRef`).
- Produces (later tasks rely on these): `EvoTopNavProps` gains `entrance?: 'none' | 'rise' | 'fade'`, `sticky?: boolean`, `scrollBehavior?: 'none' | 'elevate' | 'shrink' | 'hide'`, `showProgress?: boolean`. Root `<nav>` emits `data-entrance`, `data-scroll`, `data-scrolled`, `data-hidden`, and `style` var `--evo-topnav-progress`; CSS classes `styles.topNavSticky`, `styles.topNavProgress`.

Read `evo-ui/src/TopNav/TopNav.tsx` and `evo-ui/src/css/topnav.module.scss` first. Locate rules/blocks by name (line numbers below are approximate from a clean tree).

## Step 1: Extend `EvoTopNavProps`

In the `EvoTopNavProps` interface, add these four members after the existing `collapseBelow` member:

```tsx
  /** Staggered mount animation for the bar's contents. @default 'none' */
  entrance?: 'none' | 'rise' | 'fade';
  /** Pin the bar with position: sticky; top: 0. @default false */
  sticky?: boolean;
  /** On-scroll treatment of a sticky bar. @default 'none' */
  scrollBehavior?: 'none' | 'elevate' | 'shrink' | 'hide';
  /** Render a thin scroll-progress accent line along the bottom edge. @default false */
  showProgress?: boolean;
```

## Step 2: Add the `useScrollState` hook

Add this hook right after the `usePrefersReducedMotion` definition (the `const usePrefersReducedMotion = () => useMediaQuery('(prefers-reduced-motion: reduce)');` line, ~line 160):

```tsx
function useScrollState(
  enabled: boolean,
  behavior: 'none' | 'elevate' | 'shrink' | 'hide',
  wantProgress: boolean,
) {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [progress, setProgress] = useState(0);
  const lastY = useRef(0);

  useEffect(() => {
    if (typeof window === 'undefined' || !enabled) {
      setScrolled(false);
      setHidden(false);
      setProgress(0);
      return;
    }
    let raf = 0;
    const read = () => {
      raf = 0;
      const doc = document.documentElement;
      const y = window.scrollY || doc.scrollTop || 0;
      setScrolled(y > 8);
      setHidden(behavior === 'hide' ? y > lastY.current && y > 64 : false);
      if (wantProgress) {
        const max = doc.scrollHeight - doc.clientHeight || 1;
        setProgress(Math.min(1, Math.max(0, y / max)));
      }
      lastY.current = y;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(read);
    };
    read();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [enabled, behavior, wantProgress]);

  return { scrolled, hidden, progress };
}
```

## Step 3: Wire the props into the root component

In the `EvoTopNav` root `forwardRef` component, update the destructured parameter list to add the four new props AND pull `style` out of rest. The current destructure is:

```tsx
    {
      children,
      open,
      defaultOpen = false,
      onOpenChange,
      collapseBelow = 768,
      className,
      ...rest
    },
```

Replace it with:

```tsx
    {
      children,
      open,
      defaultOpen = false,
      onOpenChange,
      collapseBelow = 768,
      entrance = 'none',
      sticky = false,
      scrollBehavior = 'none',
      showProgress = false,
      className,
      style,
      ...rest
    },
```

Then, immediately after the line `const reducedMotion = usePrefersReducedMotion();`, add:

```tsx
    const scrollEnabled = scrollBehavior !== 'none' || showProgress;
    const { scrolled, hidden, progress } = useScrollState(scrollEnabled, scrollBehavior, showProgress);
    const animateEntrance = entrance !== 'none' && !reducedMotion;
    const mergedStyle: React.CSSProperties = showProgress
      ? ({ ...style, ['--evo-topnav-progress' as string]: progress } as React.CSSProperties)
      : (style as React.CSSProperties);
```

Then update the rendered `<nav>`. The current `<nav>` opening + body is:

```tsx
        <nav
          ref={ref}
          className={cn(
            styles.topNav,
            drawerActive && styles.topNavDrawerOpen,
            reducedMotion && styles.topNavReducedMotion,
            className,
          )}
          data-collapsed={isCollapsed || undefined}
          data-drawer-open={drawerActive || undefined}
          {...rest}
        >
          <div className={styles.topNavInner}>{children}</div>
          {drawerActive && (
            <div
              className={styles.topNavBackdrop}
              onClick={() => setDrawerOpen(false)}
              aria-hidden="true"
            />
          )}
        </nav>
```

Replace it with:

```tsx
        <nav
          ref={ref}
          className={cn(
            styles.topNav,
            sticky && styles.topNavSticky,
            drawerActive && styles.topNavDrawerOpen,
            reducedMotion && styles.topNavReducedMotion,
            className,
          )}
          style={mergedStyle}
          data-collapsed={isCollapsed || undefined}
          data-drawer-open={drawerActive || undefined}
          data-entrance={animateEntrance ? entrance : undefined}
          data-scroll={scrollBehavior !== 'none' ? scrollBehavior : undefined}
          data-scrolled={scrolled || undefined}
          data-hidden={hidden || undefined}
          {...rest}
        >
          <div className={styles.topNavInner}>{children}</div>
          {showProgress && (
            <span className={styles.topNavProgress} aria-hidden="true" />
          )}
          {drawerActive && (
            <div
              className={styles.topNavBackdrop}
              onClick={() => setDrawerOpen(false)}
              aria-hidden="true"
            />
          )}
        </nav>
```

## Step 4: Add entrance keyframes + scroll/progress rules to the SCSS

In `evo-ui/src/css/topnav.module.scss`, after the existing `@keyframes topNavDropdownFadeIn { ... }` block (~line 21), add:

```scss
@keyframes topNavRise {
  from { opacity: 0; transform: translateY(0.5rem); }
  to   { opacity: 1; transform: translateY(0); }
}

@keyframes topNavFade {
  from { opacity: 0; }
  to   { opacity: 1; }
}
```

Then, near the END of the file but BEFORE the `// Reduced motion` section (the `.topNavReducedMotion { ... }` rule, ~line 378), add this block:

```scss
// ---------------------------------------------------------------------------
// Entrance animation (opt-in via `entrance` prop → data-entrance attribute)
// ---------------------------------------------------------------------------

.topNav[data-entrance='rise'] .topNavBrand,
.topNav[data-entrance='rise'] .topNavMenu > li,
.topNav[data-entrance='rise'] .topNavSearch,
.topNav[data-entrance='rise'] .topNavActions {
  animation: topNavRise 440ms cubic-bezier(0.22, 1, 0.36, 1) both;
}

.topNav[data-entrance='fade'] .topNavBrand,
.topNav[data-entrance='fade'] .topNavMenu > li,
.topNav[data-entrance='fade'] .topNavSearch,
.topNav[data-entrance='fade'] .topNavActions {
  animation: topNavFade 440ms ease both;
}

// Shared left-to-right stagger (applies to both variants).
.topNav[data-entrance] .topNavBrand { animation-delay: 40ms; }
.topNav[data-entrance] .topNavMenu > li:nth-child(1) { animation-delay: 110ms; }
.topNav[data-entrance] .topNavMenu > li:nth-child(2) { animation-delay: 160ms; }
.topNav[data-entrance] .topNavMenu > li:nth-child(3) { animation-delay: 210ms; }
.topNav[data-entrance] .topNavMenu > li:nth-child(4) { animation-delay: 260ms; }
.topNav[data-entrance] .topNavMenu > li:nth-child(n + 5) { animation-delay: 300ms; }
.topNav[data-entrance] .topNavSearch { animation-delay: 320ms; }
.topNav[data-entrance] .topNavActions { animation-delay: 360ms; }

// ---------------------------------------------------------------------------
// Sticky + scroll-aware behavior (opt-in via `sticky` / `scrollBehavior`)
// ---------------------------------------------------------------------------

.topNavSticky {
  position: sticky;
  top: 0;
  z-index: 30;
}

.topNav[data-scroll] {
  transition:
    background-color $transition-fast,
    box-shadow $transition-fast,
    transform 220ms ease;

  .topNavInner { transition: min-height $transition-fast; }
}

.topNav[data-scrolled] {
  background-color: color-mix(in srgb, $color-surface 85%, transparent);
  -webkit-backdrop-filter: blur(10px);
  backdrop-filter: blur(10px);
  box-shadow: $shadow-md;
}

.topNav[data-scroll='shrink'][data-scrolled] .topNavInner {
  min-height: 2.75rem;
}

.topNav[data-scroll='hide'] { will-change: transform; }
.topNav[data-scroll='hide'][data-hidden] { transform: translateY(-100%); }

// ---------------------------------------------------------------------------
// Scroll-progress line (opt-in via `showProgress`)
// ---------------------------------------------------------------------------

.topNavProgress {
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 2px;
  background: $evo-primary-color;
  transform: scaleX(var(--evo-topnav-progress, 0));
  transform-origin: left center;
  pointer-events: none;
  z-index: 31;
}
```

## Step 5: Extend the reduced-motion guards

In `topnav.module.scss`, INSIDE the existing `.topNavReducedMotion { ... }` rule block, add these declarations (alongside the existing ones):

```scss
  .topNavBrand,
  .topNavMenu > li,
  .topNavSearch,
  .topNavActions {
    animation: none !important;
  }

  &[data-scroll='hide'][data-hidden] { transition: none; }
  .topNavProgress { transition: none; }
```

And INSIDE the existing `@media (prefers-reduced-motion: reduce) { ... }` block (the one near the end that already lists `.topNavMenuDrawer, .topNavDropdownContentOpen, .topNavBackdrop { animation: none; }`), add:

```scss
  .topNav[data-entrance] .topNavBrand,
  .topNav[data-entrance] .topNavMenu > li,
  .topNav[data-entrance] .topNavSearch,
  .topNav[data-entrance] .topNavActions {
    animation: none !important;
  }
```

(`.topNavSearch` referenced here is added in Task 4; an unmatched selector is harmless CSS.)

## Step 6: Rebuild the library

Run (PowerShell tool): `cd D:/evo/evo-ui; npm run build`
Expected: build + dts succeed, no TS/SCSS errors. Capture the output tail as evidence.

## Step 7: Sanity (no behavior change at defaults)
The new props default to off, so existing TopNav rendering is unchanged. No browser smoke needed for this task (deferred to Task 5's demos). Just confirm the build is clean.

## Step 8: Commit

```
git -C D:/evo add evo-ui/src/TopNav/TopNav.tsx evo-ui/src/css/topnav.module.scss
git -C D:/evo commit -m "feat(TopNav): add entrance, sticky, scrollBehavior and showProgress props" -m "Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```
(Stage only those two files. Never `git add -A`. Do not commit `.superpowers/` or `dist/`.)

## Notes / constraints
- Tokens only — use `$color-surface`, `$shadow-md`, `$evo-primary-color`, `$transition-fast` (all already defined in `css/base/_variables.scss`). No raw hex. Do NOT edit token files.
- Zero new runtime deps. Non-breaking (all new props optional, default off).
- `style` must be merged (incoming consumer `style` + the progress var) — that's what `mergedStyle` does; don't drop consumer style.
