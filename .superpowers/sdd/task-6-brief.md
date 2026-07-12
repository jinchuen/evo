# Task 6: Docs site header animation

**Files:**
- Modify: `evo-docs/src/components/Layout.tsx` (topbar: scroll-elevate state + data attributes; version badge)
- Modify: `evo-docs/src/index.css` (`.docs-topbar` states + title rise keyframe)
- Build/typecheck: `evo-docs` (`npm run build`)

**Interfaces:**
- Consumes the existing `initialLoad` state in `Layout.tsx` (it already flips to false ~700ms after mount and drives the sidebar entrance stagger). We reuse it to gate the topbar title's one-time rise.

Read `evo-docs/src/components/Layout.tsx` and `evo-docs/src/index.css` (the `.docs-topbar` rules, ~lines 372-400) first.

## Step 1: Add a scroll-elevate listener + state in Layout.tsx

In `Layout.tsx`, find the existing effect that turns off `initialLoad`:
```tsx
  useEffect(() => {
    const t = window.setTimeout(() => setInitialLoad(false), 700)
    return () => window.clearTimeout(t)
  }, [])
```
Immediately AFTER that effect, add a `topbarScrolled` state + scroll listener. (Place the `useState` with the other state declarations near the top of the component if you prefer, but it's fine to declare it right before this effect — keep it inside the component body, above the `return`.) Add:

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

IMPORTANT: confirm which element actually scrolls. Open `evo-docs/src/index.css` and check whether `.docs-main` (or `.docs-main-inner`) is the scroll container (e.g. has `overflow-y: auto` / `height: 100vh`), or whether the whole window scrolls. If a different element is the scroller (e.g. `.docs-main-inner`), point the `querySelector` at that element instead. The listener above already handles both the element-scroll and window-scroll cases; just make sure the `querySelector` targets the real scroll container. Report which one you used.

## Step 2: Add data attributes to the `<header>` and keep the title span

Find the topbar header:
```tsx
        <header className="docs-topbar">
```
Replace with:
```tsx
        <header
          className="docs-topbar"
          data-scrolled={topbarScrolled ? 'true' : undefined}
          data-initial={initialLoad ? 'true' : undefined}
        >
```
Leave the `<span className="docs-topbar-title">{currentTitle}</span>` exactly as-is (its rise is driven by the parent's `data-initial`).

## Step 3: Bump the sidebar version badge

Find:
```tsx
          <span className="docs-logo-version">v1.1</span>
```
Replace with:
```tsx
          <span className="docs-logo-version">v1.2</span>
```

## Step 4: Add the topbar CSS states + keyframe in index.css

In `evo-docs/src/index.css`, REPLACE the existing `.docs-topbar { ... }` rule (currently ~lines 372-386, the block that sets `position: sticky; ... border-bottom: ...`) with the block below, which adds a `transition` plus the scrolled state and the one-time title rise, and defines a keyframe. (Keep `--docs-topbar-height`, `--docs-bg`, `--docs-border-subtle` token usage intact.)

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

Note on the `box-shadow` `rgba(0,0,0,0.5)`: this is the DOCS stylesheet, which already uses rgba() shadows elsewhere (e.g. on cards). The "no raw hex" rule is a library (`evo-ui`) constraint; `--docs-*` tokens have no shadow token, so matching the existing docs rgba-shadow style is correct here. Do NOT introduce hex *color* literals.

Do NOT remove or duplicate the existing `.docs-topbar-title`, `.docs-topbar-actions`, etc. rules that follow — only the `.docs-topbar` rule itself is replaced, and the keyframe is added above it.

## Step 5: Typecheck + build

Run (PowerShell tool): `cd D:/evo/evo-docs; npm run build`
Expected: `tsc -b` + vite build pass, no errors. Capture the output tail.

## Step 6: Commit

```
git -C D:/evo add evo-docs/src/components/Layout.tsx evo-docs/src/index.css
git -C D:/evo commit -m "docs: animate the site header (rise on load + elevate on scroll)" -m "Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```
(Stage only those two files. Never `git add -A`. Do not commit `.superpowers/` or `dist/`.)

## Notes / constraints
- Docs-only change; the library is untouched.
- Reduced-motion: the title rise is disabled under `prefers-reduced-motion` (CSS media query). The scroll-elevate is a state change (shadow/bg), not motion, but its `transition` is brief — acceptable; if you want, the media query could also zero the transition, but it's not required.
- Keep using `--docs-*` / `color-mix` exactly as the existing `.docs-topbar` already does (it already uses `color-mix(in srgb, var(--docs-bg) 80%, transparent)` and `backdrop-filter`).
