# Task 6 Report: Docs site header animation

## Status
DONE_WITH_CONCERNS (see Concerns section)

## Commit
- SHA: `94c799e`
- Subject: `docs: animate the site header (rise on load + elevate on scroll)`

## Build
`tsc -b && vite build` — passed with no TypeScript errors. Pre-existing chunk-size warning (761 kB JS bundle > 500 kB threshold); not caused by this task.

## Files changed
- `evo-docs/src/components/Layout.tsx` — added `topbarScrolled` state + scroll listener, updated `<header>` data attributes, bumped version badge v1.1 → v1.2
- `evo-docs/src/index.css` — added `@keyframes docsTopbarRise`, replaced `.docs-topbar` rule with transition + scrolled/initial states + reduced-motion media query

## Which scroll container was targeted

**`window`** — not `.docs-main`.

`.docs-main` has no `overflow-y` set in `index.css` (the only `overflow-y: auto` in the file is on `.docs-sidebar-nav`, the sidebar navigation list). The `.docs-layout` shell is a flex container with `min-height: 100vh`; `.docs-main` is a flex child that grows to fill height but does not create a scroll context. The window scrolls the main content.

Implementation: used `getComputedStyle(main).overflowY` to detect at runtime whether `.docs-main` is a scroll container — if `/(auto|scroll)/` matches, attach to the element; otherwise fall back to `window`. Since `.docs-main` has computed `overflowY: visible`, the listener always attaches to `window` in the current layout. This makes the code self-documenting and forward-compatible if the layout ever makes `.docs-main` scroll.

## What was changed

### Layout.tsx
1. **`topbarScrolled` state** declared right after the `initialLoad` timer effect.
2. **Scroll listener effect** runs `getComputedStyle` on `.docs-main` to determine the real scroll container; attaches a passive `scroll` listener; cleans up on unmount.
3. **`<header>` data attributes**: `data-scrolled={topbarScrolled ? 'true' : undefined}` and `data-initial={initialLoad ? 'true' : undefined}`.
4. **Version badge** bumped from `v1.1` to `v1.2`.

### index.css
1. `@keyframes docsTopbarRise` added above `.docs-topbar`.
2. `.docs-topbar` rule: added `transition: box-shadow 200ms ease, background-color 200ms ease`.
3. `.docs-topbar[data-scrolled='true']` — denser background + drop shadow.
4. `.docs-topbar[data-initial='true'] .docs-topbar-title` — plays the rise animation once.
5. `@media (prefers-reduced-motion: reduce)` — disables the rise animation.
6. Sibling rules `.docs-topbar-title`, `.docs-topbar-actions`, `.docs-mobile-menu-btn` etc. are all intact and unchanged.

## Self-review checklist
- [x] Scroll listener targets `window` (real scroll container confirmed via `getComputedStyle`)
- [x] Listener cleaned up via `return () => target.removeEventListener('scroll', read)`
- [x] Title rise gated by `data-initial` which mirrors `initialLoad` (set to `false` after 700ms timer)
- [x] Reduced-motion: `@media (prefers-reduced-motion: reduce)` disables the animation
- [x] Only `.docs-topbar` rule replaced — `.docs-topbar-title`, `.docs-topbar-actions`, `.docs-mobile-menu-btn` etc. follow unchanged
- [x] Version badge updated from v1.1 to v1.2
- [x] Only two files staged and committed (`evo-docs/src/components/Layout.tsx`, `evo-docs/src/index.css`)
- [x] TypeScript clean — `tsc -b` passed with zero errors
- [x] No hex color literals introduced — `rgba(0,0,0,0.5)` is allowed (docs already use rgba shadows)
- [x] `.superpowers/` not committed

## Concerns

**Scroll elevation may not fire during initial page render**: `data-initial='true'` is set while `initialLoad` is `true` (first 700ms). If the page is scrolled *and* `data-initial='true'` simultaneously, the title animation plays while the box-shadow is also active — this is a brief cosmetic edge case (only reachable if someone deep-links to a scrolled position). Not a functional issue.

**`getComputedStyle` approach deviation from brief**: The brief uses `main instanceof HTMLElement ? main : window`. This would attach the listener to `.docs-main` (which is an HTMLElement), and scroll events would never fire on it since it doesn't scroll. The implementation uses `getComputedStyle` to detect the real scroll container and correctly uses `window`. This deviation from the brief's literal code is intentional and functionally correct.
