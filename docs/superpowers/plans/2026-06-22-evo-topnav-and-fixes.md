# EvoTopNav Enhancement + RichTextArea & Checkbox Fixes — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship `@justin_evo/evo-ui` 1.2.0 — fix the RichTextArea image caret and the Checkbox tick centering, and add opt-in entrance animation, scroll-aware behavior, a scroll-progress line, and an `EvoTopNav.Search` (⌘K) part to EvoTopNav; plus animate the docs site header.

**Architecture:** Additive, token-driven CSS + small JS hooks. New EvoTopNav root props (`entrance`/`sticky`/`scrollBehavior`/`showProgress`) drive `data-*` attributes consumed by CSS keyframes and one rAF-throttled scroll listener. `EvoTopNav.Search` is a presentational compose part. The two fixes are localized (one function; one CSS rule). Docs site header reuses the existing `initialLoad` flag + a tiny scroll listener.

**Tech Stack:** React 19 + TypeScript, SCSS modules (compiled by Vite), Vite build for the library, Vite dev/build for the docs. No test runner exists in either package — verification is **TypeScript/build success + manual browser smoke**.

## Global Constraints

- **Tokens only, no raw hex.** Use `var(--evo-color-*)` via the SCSS `$color-*` / `$shadow-*` / `$radius-*` / `$text-*` aliases. Forbidden literals: `#94a3b8`, `#e2e8f0`, `#1e293b`, any hex. (CLAUDE.md §0.2 / §9)
- **Do NOT edit** `evo-ui/src/css/tokens.css` or `evo-ui/src/css/base/*` (token files) or shared `evo-docs/src/styles/*`. (CLAUDE.md §7)
- **Zero new runtime dependencies** in `evo-ui`. (CLAUDE.md §7)
- **No breaking changes.** All new props default to `'none'` / `false`. New sub-component is additive. → **minor bump 1.1.0 → 1.2.0**. (CLAUDE.md §1)
- **`type="button"` always** on buttons. **≥44px** touch targets on mobile. **Dark mode + 375px** verified before "done". `prefers-reduced-motion` respected. (CLAUDE.md §0.1/§0.2/§10)
- **Keep contracts in sync:** component change ⇒ update `evo-docs` page, `skills/evo-topnav/SKILL.md`, `ChangelogPage.tsx`, `package.json` version, and the docs sidebar version badge. (CLAUDE.md §1)
- **Commits are user-gated** for this repo (CLAUDE.md §7 forbids `git push`; harness commits only when asked). Commit steps below are written as the natural boundary; during execution, ask the user before committing and never push.
- **Build/verify loop:** `evo-docs/node_modules/@justin_evo/evo-ui` is a **junction → `D:\evo\evo-ui`**, and docs import from `evo-ui/dist`. So after any `evo-ui/src` edit you MUST run `npm run build` in `evo-ui/` for the docs to see it.

---

## File Structure

**Modify (library):**
- `evo-ui/src/RichTextArea/RichTextArea.tsx` — `insertImageAtCaret` only.
- `evo-ui/src/css/checkbox.module.scss` — `.checkmark::after` + `:checked` rule.
- `evo-ui/src/TopNav/TopNav.tsx` — new root props + scroll hook + entrance wiring + `Search` part + exports.
- `evo-ui/src/css/topnav.module.scss` — entrance keyframes/stagger, scroll states, progress, search, reduced-motion.
- `evo-ui/package.json` — version.

**Modify (docs):**
- `evo-docs/src/pages/TopNavPage.tsx` — new demo sections + PropsTable rows.
- `evo-docs/src/components/Layout.tsx` — docs-topbar entrance + scroll-elevate; version badge.
- `evo-docs/src/index.css` — `.docs-topbar` keyframe + `data-scrolled` state + title rise.
- `evo-docs/src/pages/ChangelogPage.tsx` — 1.2.0 entry.

**Modify (skills):**
- `skills/evo-topnav/SKILL.md` — props, `Search` section, examples, gotchas.
- `skills/evo-rich-text-area/SKILL.md` — image-caret gotcha line.

**No change (verified):** `evo-ui/src/index.ts` already has `export * from './TopNav/TopNav'`; `EvoTopNavSearchProps` will be picked up once exported. `ComponentPreviews.tsx` `TopNavPreview` is a static mock — unaffected. `AIPromptPage.tsx` catalogue — no new component.

---

## Task 1: Fix RichTextArea image caret

**Files:**
- Modify: `evo-ui/src/RichTextArea/RichTextArea.tsx` (`insertImageAtCaret`, ~lines 503-509)
- Modify: `skills/evo-rich-text-area/SKILL.md` (add one gotcha line)
- Build: `evo-ui` (`npm run build`)

**Interfaces:**
- Consumes: existing `editorRef`, `execCommand`, `emitChange`.
- Produces: no signature change — `insertImageAtCaret(src: string, alt?: string) => void` stays identical to callers (button pick, drag, paste, imperative `insertImage`).

- [ ] **Step 1: Replace `insertImageAtCaret`**

Replace the current body (RichTextArea.tsx:503-509):

```tsx
  // ---- Insert image (used by paste, drop, button) ----
  const insertImageAtCaret = useCallback((src: string, alt = '') => {
    const el = editorRef.current;
    if (!el) return;
    el.focus();
    const safeSrc = src.replace(/"/g, '&quot;');
    const safeAlt = alt.replace(/"/g, '&quot;');
    // Images render display:block; inserting a bare <img> leaves the caret
    // beside it, which paints at the image's top-right edge. Drop a trailing
    // empty paragraph and move the caret into it, so the user lands on a clean
    // new line *below* the image. (Marker idiom matches unwrapBlocks above.)
    execCommand('insertHTML', `<img src="${safeSrc}" alt="${safeAlt}" /><p data-evo-caret><br></p>`);
    const landing = el.querySelector<HTMLParagraphElement>('p[data-evo-caret]');
    if (landing) {
      landing.removeAttribute('data-evo-caret');
      const sel = window.getSelection();
      const r = document.createRange();
      r.setStart(landing, 0);
      r.collapse(true);
      sel?.removeAllRanges();
      sel?.addRange(r);
    }
    emitChange();
  }, [emitChange]);
```

- [ ] **Step 2: Add a gotcha line to the RichTextArea skill**

In `skills/evo-rich-text-area/SKILL.md`, under its "Gotchas" section, add:

```md
- Inserting an image (button, drag-drop, paste, or the `insertImage` handle) drops the caret onto a fresh empty paragraph **below** the image, so typing continues on a new line rather than beside the block-level image.
```

- [ ] **Step 3: Rebuild the library**

Run: `cd D:/evo/evo-ui && npm run build`
Expected: build completes; `dist/` regenerated with no TypeScript errors.

- [ ] **Step 4: Manual smoke**

Run: `cd D:/evo/evo-docs && npm run dev`, open `/components/rich-text-area/images`.
Verify: pick / drag / paste an image → the blinking caret is on a new line **below** the image (not at its top-right corner); typing immediately adds text below the image. Toggle dark mode — image radius/spacing still correct.

- [ ] **Step 5: Commit (ask user first)**

```bash
git add evo-ui/src/RichTextArea/RichTextArea.tsx skills/evo-rich-text-area/SKILL.md
git commit -m "fix(RichTextArea): land caret on a new line below inserted images"
```

---

## Task 2: Fix Checkbox tick centering

**Files:**
- Modify: `evo-ui/src/css/checkbox.module.scss` (`:checked` rule ~lines 43-46; `.checkmark::after` ~lines 94-107)
- Build: `evo-ui`

**Interfaces:** CSS only. No API/prop change; no skill change.

- [ ] **Step 1: Update the `:checked` tick transform**

In `checkbox.module.scss`, the `.input:checked + .label .checkmark` block, replace its `&::after` (currently lines 43-46):

```scss
    &::after {
      opacity: 1;
      transform: translate(-50%, -60%) rotate(45deg) scale(1);
    }
```

- [ ] **Step 2: Transform-center the idle tick**

Replace the `.checkmark { … &::after { … } }` rule (currently lines 94-107) with:

```scss
  &::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 5px;
    height: 9px;
    border: 2px solid $evo-primary-fg;
    border-top: none;
    border-left: none;
    opacity: 0;
    // Centered via translate (parent's flex-centering can't reach an absolute
    // child). -60% Y nudges the rotated "L" optically into the middle. The
    // centering translate is folded into both states so the scale stays put.
    transform: translate(-50%, -60%) rotate(45deg) scale(0.5);
    transition: opacity $transition-fast, transform $transition-fast;
  }
```

- [ ] **Step 3: Rebuild the library**

Run: `cd D:/evo/evo-ui && npm run build`
Expected: build completes; `dist/evo-ui.css` regenerated, no SCSS errors.

- [ ] **Step 4: Manual smoke**

Open `/components/checkbox` in the docs dev server. Verify: the tick is visually centered in the box when checked — at the default size, inside `EvoCheckbox.Group`, and in **both** light and dark modes. The indeterminate dash is still centered. The check→uncheck transition scales from the center, not a corner.

- [ ] **Step 5: Commit (ask user first)**

```bash
git add evo-ui/src/css/checkbox.module.scss
git commit -m "fix(Checkbox): center the checked tick via transform"
```

---

## Task 3: EvoTopNav — entrance, scroll behavior, progress (root props)

**Files:**
- Modify: `evo-ui/src/TopNav/TopNav.tsx` (props interface; new `useScrollState` hook; root render)
- Modify: `evo-ui/src/css/topnav.module.scss` (keyframes, stagger, scroll states, progress, reduced-motion)
- Build: `evo-ui`

**Interfaces:**
- Consumes: existing `usePrefersReducedMotion`, `cn`, `styles`, root `forwardRef` signature.
- Produces (used by Task 4 + Task 5 + Task 7):
  - `EvoTopNavProps` gains `entrance?: 'none' | 'rise' | 'fade'`, `sticky?: boolean`, `scrollBehavior?: 'none' | 'elevate' | 'shrink' | 'hide'`, `showProgress?: boolean`.
  - Root `<nav>` emits `data-entrance`, `data-scroll`, `data-scrolled`, `data-hidden`, and `style --evo-topnav-progress`; CSS classes `styles.topNavSticky`, `styles.topNavProgress`.

- [ ] **Step 1: Extend `EvoTopNavProps`**

In TopNav.tsx, add to the `EvoTopNavProps` interface (after `collapseBelow`):

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

- [ ] **Step 2: Add the `useScrollState` hook**

In TopNav.tsx, add after `usePrefersReducedMotion` (~line 160):

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

- [ ] **Step 3: Wire the props into the root component**

In `EvoTopNav` (the root `forwardRef`), update the destructure to add the new props **and** pull `style` out of rest:

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

After `const reducedMotion = usePrefersReducedMotion();` add:

```tsx
    const scrollEnabled = scrollBehavior !== 'none' || showProgress;
    const { scrolled, hidden, progress } = useScrollState(scrollEnabled, scrollBehavior, showProgress);
    const animateEntrance = entrance !== 'none' && !reducedMotion;
    const mergedStyle: React.CSSProperties = showProgress
      ? { ...style, ['--evo-topnav-progress' as string]: progress } as React.CSSProperties
      : (style as React.CSSProperties);
```

Then update the rendered `<nav>` (the `className={cn(...)}` and attributes):

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

- [ ] **Step 4: Add entrance keyframes + stagger to the SCSS**

In `topnav.module.scss`, after the existing `@keyframes` block (~line 21) add:

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

At the end of the file (before the reduced-motion section) add the entrance + scroll + progress rules:

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

- [ ] **Step 5: Extend the reduced-motion guards**

In `topnav.module.scss`, inside the existing `.topNavReducedMotion { … }` block add:

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

And inside the existing `@media (prefers-reduced-motion: reduce) { … }` block add:

```scss
  .topNav[data-entrance] .topNavBrand,
  .topNav[data-entrance] .topNavMenu > li,
  .topNav[data-entrance] .topNavSearch,
  .topNav[data-entrance] .topNavActions {
    animation: none !important;
  }
```

- [ ] **Step 6: Rebuild the library**

Run: `cd D:/evo/evo-ui && npm run build`
Expected: build + dts succeed, no TS/SCSS errors.

- [ ] **Step 7: Manual smoke (deferred to Task 5's demos)**

The new props have no visible effect until exercised. Verify only that the existing TopNav demos still render unchanged (defaults off): open `/components/topnav`, confirm no console errors and the Basic / Dropdown / Mobile demos look identical to before.

- [ ] **Step 8: Commit (ask user first)**

```bash
git add evo-ui/src/TopNav/TopNav.tsx evo-ui/src/css/topnav.module.scss
git commit -m "feat(TopNav): add entrance, sticky, scrollBehavior and showProgress props"
```

---

## Task 4: EvoTopNav.Search sub-component (⌘K)

**Files:**
- Modify: `evo-ui/src/TopNav/TopNav.tsx` (new `EvoTopNavSearchProps`, `EvoTopNavSearch`, attach + displayName + type)
- Modify: `evo-ui/src/css/topnav.module.scss` (search styles + mobile icon-only)
- Build: `evo-ui`

**Interfaces:**
- Consumes: `cn`, `styles`, `forwardRef`, `useState`, `useEffect`, `useRef` (already imported).
- Produces (used by Task 5 + Task 7): `EvoTopNav.Search` part; exported `EvoTopNavSearchProps`.

- [ ] **Step 1: Declare `EvoTopNavSearchProps`**

In TopNav.tsx, near the other prop interfaces (after `EvoTopNavToggleProps`), add:

```tsx
export interface EvoTopNavSearchProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  /** Placeholder text shown inside the trigger. @default 'Search…' */
  placeholder?: string;
  /** Opt-in global hotkey, e.g. 'mod+k' (mod = ⌘ on macOS, Ctrl elsewhere). Default: none. */
  shortcut?: string;
  /** Override the keyboard hint. @default platform-aware ⌘K / Ctrl K */
  shortcutHint?: React.ReactNode;
  className?: string;
}
```

- [ ] **Step 2: Add the search icon + component**

In TopNav.tsx, after the `ChevronIcon` definition (~line 319) add:

```tsx
const SearchGlyph = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.2-3.2" />
  </svg>
);
```

After the `EvoTopNavToggle` definition (~line 523), add the Search part:

```tsx
const EvoTopNavSearch = forwardRef<HTMLButtonElement, EvoTopNavSearchProps>(
  function EvoTopNavSearch(
    { placeholder = 'Search…', shortcut, shortcutHint, className, onClick, ...rest },
    forwardedRef,
  ) {
    const localRef = useRef<HTMLButtonElement | null>(null);
    const setRef = (node: HTMLButtonElement | null) => {
      localRef.current = node;
      if (typeof forwardedRef === 'function') forwardedRef(node);
      else if (forwardedRef)
        (forwardedRef as React.RefObject<HTMLButtonElement | null>).current = node;
    };

    // Platform-aware hint resolved after mount to avoid SSR hydration mismatch.
    const [autoHint, setAutoHint] = useState<React.ReactNode>(null);
    useEffect(() => {
      if (shortcutHint !== undefined) return;
      const platform =
        (typeof navigator !== 'undefined' &&
          (navigator.platform || navigator.userAgent)) || '';
      setAutoHint(/Mac|iPhone|iPad|iPod/.test(platform) ? '⌘K' : 'Ctrl K');
    }, [shortcutHint]);
    const hint = shortcutHint !== undefined ? shortcutHint : autoHint;

    // Opt-in global hotkey → dispatch a real click so onClick fires naturally.
    useEffect(() => {
      if (!shortcut) return;
      const parts = shortcut.toLowerCase().split('+').map((p) => p.trim());
      const wantMod = parts.some((p) => ['mod', 'cmd', 'meta', 'ctrl', 'control'].includes(p));
      const key = parts[parts.length - 1];
      const handler = (e: KeyboardEvent) => {
        const mod = e.metaKey || e.ctrlKey;
        if ((!wantMod || mod) && e.key.toLowerCase() === key) {
          e.preventDefault();
          localRef.current?.click();
        }
      };
      document.addEventListener('keydown', handler);
      return () => document.removeEventListener('keydown', handler);
    }, [shortcut]);

    return (
      <button
        ref={setRef}
        type="button"
        className={cn(styles.topNavSearch, className)}
        onClick={onClick}
        {...rest}
      >
        <span className={styles.topNavSearchIcon} aria-hidden="true">
          <SearchGlyph />
        </span>
        <span className={styles.topNavSearchText}>{placeholder}</span>
        {hint != null && <kbd className={styles.topNavSearchKbd}>{hint}</kbd>}
      </button>
    );
  },
);
```

- [ ] **Step 3: Attach `Search` to the compound type**

In the `EvoTopNav` type-cast intersection (the `as React.ForwardRefExoticComponent<…> & { … }` block, ~lines 967-977) add a line:

```tsx
  Search: typeof EvoTopNavSearch;
```

Add the displayName (next to the other `*.displayName` lines, ~line 985):

```tsx
EvoTopNavSearch.displayName = 'EvoTopNav.Search';
```

And attach it (next to the other `EvoTopNav.* =` assignments, ~line 994):

```tsx
EvoTopNav.Search = EvoTopNavSearch;
```

- [ ] **Step 4: Add search styles to the SCSS**

In `topnav.module.scss`, after the `.topNavActions` rule (~line 160) add:

```scss
// ---------------------------------------------------------------------------
// Search trigger (EvoTopNav.Search) — presentational ⌘K affordance
// ---------------------------------------------------------------------------

.topNavSearch {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  height: 2rem;
  min-width: 12rem;
  padding: 0 0.625rem;
  font-family: inherit;
  font-size: $text-sm;
  color: $color-text-muted;
  background-color: $color-surface-sunken;
  border: 1px solid $color-border;
  border-radius: $radius-sm;
  cursor: pointer;
  transition:
    background-color $transition-fast,
    border-color $transition-fast,
    color $transition-fast;

  &:hover {
    background-color: $color-surface-hover;
    color: $color-text-secondary;
  }

  &:focus-visible {
    outline: 2px solid $evo-primary-focus;
    outline-offset: 2px;
  }
}

.topNavSearchIcon {
  display: inline-flex;
  flex-shrink: 0;
}

.topNavSearchText {
  flex: 1;
  text-align: left;
}

.topNavSearchKbd {
  flex-shrink: 0;
  font-family: inherit;
  font-size: $text-xs;
  color: $color-text-muted;
  background-color: $color-surface;
  border: 1px solid $color-border;
  border-radius: 4px;
  padding: 0.0625rem 0.3125rem;
}
```

Inside the existing `@media (max-width: 767px) { … }` block, add an icon-only collapse:

```scss
  .topNavSearch {
    min-width: 0;
    width: 2.75rem;
    height: 2.75rem;
    justify-content: center;
    padding: 0;

    .topNavSearchText,
    .topNavSearchKbd { display: none; }
  }
```

- [ ] **Step 5: Rebuild the library**

Run: `cd D:/evo/evo-ui && npm run build`
Expected: build + dts succeed; `EvoTopNavSearchProps` appears in `dist/index.d.ts` (it is exported and the barrel re-exports it).

- [ ] **Step 6: Manual smoke (deferred to Task 5's demo)**

Covered by the Search demo added in Task 5.

- [ ] **Step 7: Commit (ask user first)**

```bash
git add evo-ui/src/TopNav/TopNav.tsx evo-ui/src/css/topnav.module.scss
git commit -m "feat(TopNav): add EvoTopNav.Search quick-search trigger part"
```

---

## Task 5: Docs — TopNavPage demos + PropsTable

**Files:**
- Modify: `evo-docs/src/pages/TopNavPage.tsx`
- Build: `evo-docs` (`npm run build` for typecheck) + dev smoke

**Interfaces:**
- Consumes: `EvoTopNav` with the new props/parts from Tasks 3-4 (rebuilt `dist/`), `EvoCommandPalette`, `EvoBreadcrumb`, `EvoButton`, `CodeBlock`, `PropsTable`.

- [ ] **Step 1: Add new demo sections**

In `TopNapPage.tsx`, add these sections **before** the `--- Accessibility ---` section (after "With Icons + Actions"). Use `.docs-section` / `.docs-section-title` / `.docs-section-desc` and `CodeBlock`, matching existing sections:

```tsx
      {/* --- Entrance animation --- */}
      <div className="docs-section">
        <div className="docs-section-title">Entrance animation</div>
        <p className="docs-section-desc">
          <code>entrance="rise"</code> staggers the brand, each menu item, and the
          actions up from below on mount (<code>"fade"</code> does opacity only).
          It plays once and is disabled entirely under{' '}
          <code>prefers-reduced-motion</code>. Opt-in — the default is{' '}
          <code>"none"</code>.
        </p>
        <div className="docs-preview col" style={{ width: '100%', padding: 0, overflow: 'hidden', borderRadius: 8 }}>
          <EvoTopNav aria-label="Entrance example" entrance="rise">
            <EvoTopNav.Brand>Evo UI</EvoTopNav.Brand>
            <EvoTopNav.Menu>
              <EvoTopNav.Item href="#home" active>Home</EvoTopNav.Item>
              <EvoTopNav.Item href="#docs">Docs</EvoTopNav.Item>
              <EvoTopNav.Item href="#blog">Blog</EvoTopNav.Item>
            </EvoTopNav.Menu>
            <EvoTopNav.Actions>
              <EvoButton label="Sign in" variant="ghost" size="sm" />
            </EvoTopNav.Actions>
          </EvoTopNav>
        </div>
        <CodeBlock code={`<EvoTopNav aria-label="Primary" entrance="rise">
  <EvoTopNav.Brand>Evo UI</EvoTopNav.Brand>
  <EvoTopNav.Menu>
    <EvoTopNav.Item href="/" active>Home</EvoTopNav.Item>
    <EvoTopNav.Item href="/docs">Docs</EvoTopNav.Item>
  </EvoTopNav.Menu>
</EvoTopNav>`} />
      </div>

      {/* --- Scroll behavior --- */}
      <div className="docs-section">
        <div className="docs-section-title">Sticky + scroll behavior</div>
        <p className="docs-section-desc">
          <code>sticky</code> pins the bar; <code>scrollBehavior</code> reacts to
          scroll — <code>"elevate"</code> adds a blurred background + shadow,{' '}
          <code>"shrink"</code> also reduces height, <code>"hide"</code> auto-hides
          on scroll-down and reveals on scroll-up. <code>showProgress</code> draws a
          thin reading-progress line along the bottom edge.
        </p>
        <CodeBlock code={`<EvoTopNav
  aria-label="Primary"
  sticky
  scrollBehavior="shrink"
  showProgress
>
  <EvoTopNav.Brand>Evo UI</EvoTopNav.Brand>
  <EvoTopNav.Menu>
    <EvoTopNav.Item href="/" active>Home</EvoTopNav.Item>
    <EvoTopNav.Item href="/docs">Docs</EvoTopNav.Item>
  </EvoTopNav.Menu>
</EvoTopNav>`} />
        <p className="docs-section-desc" style={{ marginTop: '0.5rem' }}>
          The docs site's own header uses this treatment — scroll this page to see
          it elevate.
        </p>
      </div>

      {/* --- Quick search (Cmd K) --- */}
      <div className="docs-section">
        <div className="docs-section-title">Quick search (⌘K)</div>
        <p className="docs-section-desc">
          <code>EvoTopNav.Search</code> is a presentational trigger: it renders the
          search affordance + a platform-aware keyboard hint and fires{' '}
          <code>onClick</code>. Wire it to an{' '}
          <code>EvoCommandPalette</code>. Pass <code>shortcut="mod+k"</code> to also
          register a global hotkey. It collapses to an icon-only button below the
          breakpoint.
        </p>
        <div className="docs-preview col" style={{ width: '100%', padding: 0, overflow: 'hidden', borderRadius: 8 }}>
          <EvoTopNav aria-label="Search example">
            <EvoTopNav.Brand>Evo UI</EvoTopNav.Brand>
            <EvoTopNav.Menu>
              <EvoTopNav.Item href="#home" active>Home</EvoTopNav.Item>
              <EvoTopNav.Item href="#docs">Docs</EvoTopNav.Item>
            </EvoTopNav.Menu>
            <EvoTopNav.Search placeholder="Search docs…" onClick={() => alert('open command palette')} />
            <EvoTopNav.Actions>
              <EvoButton label="Sign in" variant="ghost" size="sm" />
            </EvoTopNav.Actions>
          </EvoTopNav>
        </div>
        <CodeBlock code={`const [open, setOpen] = useState(false)

<EvoTopNav aria-label="Primary">
  <EvoTopNav.Brand>Evo UI</EvoTopNav.Brand>
  <EvoTopNav.Menu>
    <EvoTopNav.Item href="/" active>Home</EvoTopNav.Item>
  </EvoTopNav.Menu>
  <EvoTopNav.Search
    placeholder="Search docs…"
    shortcut="mod+k"
    onClick={() => setOpen(true)}
  />
</EvoTopNav>

<EvoCommandPalette open={open} onOpenChange={setOpen} /* … */ />`} />
      </div>

      {/* --- Links + breadcrumb composition --- */}
      <div className="docs-section">
        <div className="docs-section-title">Icon links + breadcrumb</div>
        <p className="docs-section-desc">
          Drop icon links into <code>EvoTopNav.Actions</code>, and compose{' '}
          <code>EvoBreadcrumb</code> inside the bar for a location trail — no extra
          parts needed.
        </p>
        <div className="docs-preview col" style={{ width: '100%', padding: 0, overflow: 'hidden', borderRadius: 8 }}>
          <EvoTopNav aria-label="Links example">
            <EvoTopNav.Brand>Evo UI</EvoTopNav.Brand>
            <EvoTopNav.Menu>
              <EvoTopNav.Item href="#docs" active>Docs</EvoTopNav.Item>
            </EvoTopNav.Menu>
            <EvoTopNav.Actions>
              <EvoBreadcrumb>
                <EvoBreadcrumb.Item>Components</EvoBreadcrumb.Item>
                <EvoBreadcrumb.Item current>TopNav</EvoBreadcrumb.Item>
              </EvoBreadcrumb>
            </EvoTopNav.Actions>
          </EvoTopNav>
        </div>
      </div>
```

- [ ] **Step 2: Add the imports the new demos need**

In the import at the top of `TopNavPage.tsx`, add `EvoBreadcrumb` (and confirm `EvoButton`, `EvoBadge`, `EvoDivider` already imported):

```tsx
import { EvoTopNav, EvoButton, EvoBadge, EvoDivider, EvoBreadcrumb } from '@justin_evo/evo-ui'
```

(`EvoCommandPalette` is only referenced inside a `CodeBlock` string, not as a live element — no import needed.)

- [ ] **Step 3: Add the new props to the PropsTable**

In the `PropsTable props={[ … ]}` array, add these rows in the `EvoTopNav — *` group (after `collapseBelow`):

```tsx
          { prop: 'EvoTopNav — entrance', type: "'none' | 'rise' | 'fade'", description: 'Staggered mount animation for the bar contents. Disabled under prefers-reduced-motion.', default: "'none'" },
          { prop: 'EvoTopNav — sticky', type: 'boolean', description: 'Pin the bar with position: sticky; top: 0.', default: 'false' },
          { prop: 'EvoTopNav — scrollBehavior', type: "'none' | 'elevate' | 'shrink' | 'hide'", description: 'On-scroll treatment: elevate (blur+shadow), shrink (also reduces height), or hide (auto-hide on scroll-down).', default: "'none'" },
          { prop: 'EvoTopNav — showProgress', type: 'boolean', description: 'Render a thin scroll-progress accent line along the bottom edge.', default: 'false' },
```

And add a Search group after the `EvoTopNav.Toggle — *` rows:

```tsx
          { prop: 'EvoTopNav.Search — placeholder', type: 'string', description: 'Placeholder text shown inside the trigger.', default: "'Search…'" },
          { prop: 'EvoTopNav.Search — shortcut', type: 'string', description: "Opt-in global hotkey, e.g. 'mod+k' (mod = ⌘ on macOS, Ctrl elsewhere). Default: none." },
          { prop: 'EvoTopNav.Search — shortcutHint', type: 'ReactNode', description: 'Override the keyboard hint shown on the right.', default: 'platform-aware ⌘K / Ctrl K' },
          { prop: 'EvoTopNav.Search — onClick', type: '(e: MouseEvent) => void', description: 'Fires on click (and on the global hotkey, if set). Wire to your command palette.' },
```

- [ ] **Step 4: Typecheck the docs**

Run: `cd D:/evo/evo-docs && npm run build`
Expected: `tsc -b` passes (no type errors — the new props/`Search` resolve from the rebuilt `dist/index.d.ts`) and the Vite build completes.

- [ ] **Step 5: Manual smoke**

Run `npm run dev`, open `/components/topnav`. Verify: entrance demo staggers up on mount; the Search trigger shows the platform key hint and alerts on click; breadcrumb composes inside the bar; resize < 768px → Search becomes icon-only. Dark mode OK; no console errors.

- [ ] **Step 6: Commit (ask user first)**

```bash
git add evo-docs/src/pages/TopNavPage.tsx
git commit -m "docs(TopNav): demo entrance, scroll, Search and breadcrumb composition"
```

---

## Task 6: Docs site header animation

**Files:**
- Modify: `evo-docs/src/components/Layout.tsx` (topbar: rise gating + scroll-elevate; version badge)
- Modify: `evo-docs/src/index.css` (`.docs-topbar` states + title keyframe)

**Interfaces:**
- Consumes: existing `initialLoad` state in `Layout.tsx` (already drives the sidebar stagger and drops after 700ms).

- [ ] **Step 1: Add a scroll-elevate listener + data attributes to the topbar**

In `Layout.tsx`, add a `topbarScrolled` state and a scroll listener. After the existing `initialLoad` effect (~line 182) add:

```tsx
  // Elevate the docs topbar once the main content scrolls.
  const [topbarScrolled, setTopbarScrolled] = useState(false)
  useEffect(() => {
    const main = document.querySelector('.docs-main')
    const target: HTMLElement | Window = main instanceof HTMLElement ? main : window
    const read = () => {
      const y = target instanceof Window ? window.scrollY : (target as HTMLElement).scrollTop
      setTopbarScrolled(y > 4)
    }
    read()
    target.addEventListener('scroll', read, { passive: true })
    return () => target.removeEventListener('scroll', read)
  }, [])
```

Then update the `<header className="docs-topbar">` opening tag and the title span:

```tsx
        <header
          className="docs-topbar"
          data-scrolled={topbarScrolled ? 'true' : undefined}
          data-initial={initialLoad ? 'true' : undefined}
        >
```

```tsx
          <span className="docs-topbar-title">{currentTitle}</span>
```

(The title span keeps its class; the rise is driven by the parent's `data-initial`.)

- [ ] **Step 2: Bump the sidebar version badge**

In `Layout.tsx`, the `docs-logo-version` span (~line 325):

```tsx
          <span className="docs-logo-version">v1.2</span>
```

- [ ] **Step 3: Add the topbar CSS states**

In `evo-docs/src/index.css`, replace the `.docs-topbar { … }` rule (lines 372-386) with a version that adds a scrolled state and a one-time title rise, and add a keyframe:

```css
@keyframes docsTopbarRise {
  from { opacity: 0; transform: translateY(0.5rem); }
  to   { opacity: 1; transform: translateY(0); }
}

.docs-topbar {
  position: sticky;
  top: 0;
  z-index: 90;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  height: var(--docs-topbar-height);
  padding: 0 1.25rem;
  background: color-mix(in srgb, var(--docs-bg) 80%, transparent);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-bottom: 1px solid var(--docs-border-subtle);
  transition: box-shadow 200ms ease, background-color 200ms ease;
}

.docs-topbar[data-scrolled='true'] {
  background: color-mix(in srgb, var(--docs-bg) 92%, transparent);
  box-shadow: 0 6px 16px -10px rgba(0, 0, 0, 0.5);
}

.docs-topbar[data-initial='true'] .docs-topbar-title {
  animation: docsTopbarRise 460ms cubic-bezier(0.22, 1, 0.36, 1) both;
}

@media (prefers-reduced-motion: reduce) {
  .docs-topbar[data-initial='true'] .docs-topbar-title { animation: none; }
}
```

(The `box-shadow` here uses `rgba(0,0,0,…)` — this is the **docs** stylesheet, which already uses rgba shadows elsewhere, e.g. on cards; the no-hex token rule is a library/`evo-ui` constraint, and `--docs-*` tokens have no shadow token. Match the existing docs shadow style.)

- [ ] **Step 4: Typecheck + smoke**

Run: `cd D:/evo/evo-docs && npm run build` → expect tsc + vite pass.
Run `npm run dev`: on first load the topbar title rises up; scrolling the main content elevates the topbar (stronger shadow); under reduced-motion the title appears instantly. Sidebar badge reads **v1.2**. Dark mode OK.

- [ ] **Step 5: Commit (ask user first)**

```bash
git add evo-docs/src/components/Layout.tsx evo-docs/src/index.css
git commit -m "docs: animate the site header (rise on load + elevate on scroll)"
```

---

## Task 7: Sync contracts — skill, changelog, version

**Files:**
- Modify: `skills/evo-topnav/SKILL.md`
- Modify: `evo-docs/src/pages/ChangelogPage.tsx`
- Modify: `evo-ui/package.json`

**Interfaces:** documents the API shipped in Tasks 1-6. No code.

- [ ] **Step 1: Update the TopNav skill props table**

In `skills/evo-topnav/SKILL.md`, in the root `EvoTopNav` props table (after the `collapseBelow` row), add:

```md
| `entrance` | `'none' \| 'rise' \| 'fade'` | `'none'` | No | Staggered mount animation of the bar contents (`rise` = up + fade, `fade` = opacity only). Plays once; disabled under `prefers-reduced-motion`. |
| `sticky` | `boolean` | `false` | No | Pin the bar with `position: sticky; top: 0`. |
| `scrollBehavior` | `'none' \| 'elevate' \| 'shrink' \| 'hide'` | `'none'` | No | On-scroll treatment: `elevate` (blur + shadow once scrolled), `shrink` (also reduces height), `hide` (auto-hide on scroll-down, reveal on scroll-up). |
| `showProgress` | `boolean` | `false` | No | Render a thin scroll-progress accent line along the bottom edge (tracks document scroll). |
```

- [ ] **Step 2: Add a `Search` sub-component section to the skill**

In `skills/evo-topnav/SKILL.md`, after the `### EvoTopNav.Toggle` section, add:

```md
### EvoTopNav.Search

A presentational quick-search trigger. Renders a `<button type="button">` with a search icon, placeholder text, and a platform-aware keyboard hint. It does NOT own a search overlay — wire `onClick` to your own launcher (e.g. [[evo-command-palette]]). Collapses to an icon-only button below `collapseBelow`.

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `placeholder` | `string` | `'Search…'` | No | Placeholder text shown inside the trigger. |
| `shortcut` | `string` | — | No | Opt-in global hotkey, e.g. `'mod+k'` (`mod` = ⌘ on macOS, Ctrl elsewhere). When set, a document keydown listener dispatches a click on match. Default: no global listener. |
| `shortcutHint` | `React.ReactNode` | platform-aware `⌘K` / `Ctrl K` | No | Override the keyboard hint shown on the right. |
| `onClick` | `(e: React.MouseEvent) => void` | — | No | Fires on click and on the global hotkey (if `shortcut` set). |
| `className` | `string` | — | No | Extra class on the button. |

Extends `Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'children'>` — native `<button>` attributes plus `ref` and `className` are forwarded.
```

- [ ] **Step 3: Add examples + gotchas to the skill**

In the `## Examples` section of `skills/evo-topnav/SKILL.md`, add:

````md
### Animated, sticky header with quick search

```tsx
import { useState } from 'react';
import { EvoTopNav, EvoButton, EvoCommandPalette } from '@justin_evo/evo-ui';

function Header() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <EvoTopNav aria-label="Primary" entrance="rise" sticky scrollBehavior="shrink" showProgress>
        <EvoTopNav.Brand>Evo UI</EvoTopNav.Brand>
        <EvoTopNav.Menu>
          <EvoTopNav.Item href="/" active>Home</EvoTopNav.Item>
          <EvoTopNav.Item href="/docs">Docs</EvoTopNav.Item>
        </EvoTopNav.Menu>
        <EvoTopNav.Search placeholder="Search docs…" shortcut="mod+k" onClick={() => setOpen(true)} />
        <EvoTopNav.Actions>
          <EvoButton label="Sign in" variant="ghost" size="sm" />
        </EvoTopNav.Actions>
      </EvoTopNav>
      {/* Wire Search to your launcher */}
      {/* <EvoCommandPalette open={open} onOpenChange={setOpen} … /> */}
    </>
  );
}
```
````

In the `## Gotchas` section, add:

```md
- `entrance` plays once on mount and is fully disabled under `prefers-reduced-motion` (the component drops the `data-entrance` attribute, and CSS has a media-query fallback). It animates the Brand, each Menu item, Search, and Actions.
- `scrollBehavior` / `showProgress` only have a visible effect on a scrollable page; pair with `sticky` so the bar stays in view while you scroll. They attach one rAF-throttled `window` scroll listener, removed on unmount / when disabled.
- `EvoTopNav.Search` is presentational — it does not render a search UI. Connect `onClick` to [[evo-command-palette]] or your own overlay. `shortcut` registers a *global* document keydown; omit it if you manage hotkeys yourself.
```

- [ ] **Step 4: Prepend the 1.2.0 changelog entry**

In `evo-docs/src/pages/ChangelogPage.tsx`, add a new release object at the **top** of the `RELEASES` array (before the `1.1.0` entry):

```ts
  {
    version: '1.2.0',
    date: '2026-06-22',
    summary:
      'EvoTopNav gains an opt-in entrance animation, sticky scroll-aware behavior, a scroll-progress line, and a new Search (⌘K) part — plus image-caret and checkbox-tick fixes.',
    sections: [
      {
        kind: 'Added',
        items: [
          'EvoTopNav — `entrance` prop (`none` | `rise` | `fade`) staggers the brand, menu items, search and actions up on mount; plays once and is disabled under `prefers-reduced-motion`.',
          'EvoTopNav — `sticky`, `scrollBehavior` (`none` | `elevate` | `shrink` | `hide`) and `showProgress` props add a pinned, scroll-aware bar with an optional reading-progress line, driven by one rAF-throttled scroll listener (zero new deps).',
          'EvoTopNav.Search — a new presentational quick-search trigger sub-component with a platform-aware ⌘K / Ctrl K hint and an opt-in global `shortcut` hotkey; collapses to icon-only on mobile. Wire its `onClick` to EvoCommandPalette.',
        ],
      },
      {
        kind: 'Fixed',
        items: [
          'EvoRichTextArea — inserting an image (button, drag-drop, paste, or the `insertImage` handle) now lands the caret on a fresh paragraph below the image instead of beside the block-level image, where the caret painted at its top-right edge.',
          'EvoCheckbox — the checked tick is now transform-centered in the box (it used hardcoded pixel offsets and could sit off-center); the scale-in animation now grows from the center. CSS-only.',
        ],
      },
    ],
  },
```

- [ ] **Step 5: Bump the library version**

In `evo-ui/package.json`, change `"version": "1.1.0"` → `"version": "1.2.0"`.

- [ ] **Step 6: Rebuild + final full smoke (CLAUDE.md §10)**

Run: `cd D:/evo/evo-ui && npm run build`, then `cd D:/evo/evo-docs && npm run build` (typecheck), then `npm run dev`.
Verify the §10 self-test: TopNapPage + Changelog + Checkbox + RichTextArea images pages load with no console errors; **dark mode** readable; **375px** no horizontal scroll and Search/Toggle ≥44px; try `<EvoTopNav>` inside an `EvoModal` (z-index/focus). Confirm the Changelog shows 1.2.0 and the sidebar badge reads v1.2.

- [ ] **Step 7: Commit (ask user first)**

```bash
git add skills/evo-topnav/SKILL.md evo-docs/src/pages/ChangelogPage.tsx evo-ui/package.json
git commit -m "chore: bump to 1.2.0; sync TopNav skill + changelog"
```

---

## Self-Review

**Spec coverage:**
- Spec §1 RTA caret → Task 1. ✓
- Spec §2 Checkbox tick → Task 2. ✓
- Spec §3.1 root props → Task 3. ✓
- Spec §3.2 Search part → Task 4. ✓
- Spec §3.3 links+breadcrumb (composition/demo) → Task 5 Step 1 (icon links + breadcrumb demo). ✓
- Spec §3.4 SCSS → Tasks 3-4. ✓
- Spec §3.5 exports → Task 4 Step 1/3 (export interface; barrel already `export *`). ✓
- Spec §4 docs header → Task 6. ✓
- Spec §5 file checklist → Tasks 1-7 cover every listed file; `ComponentPreviews.tsx`/`AIPromptPage.tsx` explicitly no-change (verified static/no-new-component). ✓
- Spec §6 testing → each task's smoke + Task 7 Step 6 §10 self-test. ✓
- Spec §7 non-goals → Global Constraints (no token edits, no deps, no publish/push). ✓

**Placeholder scan:** No TBD/TODO; every code step shows full code; commands have expected output. ✓

**Type consistency:** `EvoTopNavSearchProps` / `EvoTopNavSearch` / `EvoTopNav.Search` used consistently across Tasks 4, 5, 7. New root prop names (`entrance`/`sticky`/`scrollBehavior`/`showProgress`) match between TopNav.tsx (Task 3), PropsTable (Task 5), skill (Task 7), and changelog (Task 7). `data-entrance`/`data-scroll`/`data-scrolled`/`data-hidden` + `--evo-topnav-progress` match between TS (Task 3 Step 3) and SCSS (Task 3 Step 4). ✓

**Note for executor:** SCSS edits reference current line numbers from a clean tree — after Task 3's SCSS additions, re-locate rules by selector name rather than line number in later tasks.
