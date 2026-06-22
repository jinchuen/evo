# Design: EvoTopNav enhancement + RichTextArea & Checkbox fixes

**Date:** 2026-06-22
**Status:** Awaiting user review
**Target release:** `@justin_evo/evo-ui` 1.1.0 → **1.2.0** (minor — additive only, zero breaking changes)

## Summary

Three pieces of work, shipped together as one release:

1. **Fix** — RichTextArea: after inserting/uploading an image the text caret lands
   beside the (block-level) image and paints at its top-right corner. The caret
   should land on a clean new line *below* the image.
2. **Fix** — Checkbox: the checked "tick" is positioned with hardcoded pixel
   offsets and is not reliably centered in the box.
3. **Feature** — EvoTopNav gains opt-in entrance animation, scroll-aware
   behavior, a scroll-progress line, and a new `EvoTopNav.Search` (⌘K) part.
   The docs site's own top bar also adopts the entrance + scroll-elevate
   treatment so the effect is visible on every page load.

Guiding constraints (CLAUDE.md): CSS-variable tokens only (no raw hex), dark mode
+ 375 px verified, ≥44 px touch targets, zero new runtime deps, no token-file
edits, keep docs + skill + changelog + version in sync.

---

## 1. RichTextArea — image caret fix

**Where:** `evo-ui/src/RichTextArea/RichTextArea.tsx`, `insertImageAtCaret` (~line 504).
Images are styled `display: block` (`richtextarea.module.scss:198-204`), but the
insert path runs `execCommand('insertHTML', '<img …/>')` with nothing after it, so
the collapsed caret sits immediately after the inline image box and the browser
paints the text caret at the image's top-right edge.

**Behavior change:** inserting an image also drops a fresh empty paragraph after it
and moves the caret into that paragraph — so the user is on a new line below the
image and can keep typing.

**Approach** (matches the existing `data-evo-caret` marker idiom already used in
`unwrapBlocks`):

```ts
const insertImageAtCaret = useCallback((src: string, alt = '') => {
  const el = editorRef.current;
  if (!el) return;
  el.focus();
  const safeSrc = src.replace(/"/g, '&quot;');
  const safeAlt = alt.replace(/"/g, '&quot;');
  // Trailing paragraph gives the caret a landing line *below* the block image,
  // instead of leaving it beside the image (which paints at the top-right edge).
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

**Notes / edge cases:**
- `insertImageAtCaret` is the single choke point for button-pick, drag-drop, paste,
  and the imperative `insertImage` handle — fixing it here fixes all entry points.
- If the browser collapses the empty `<p><br></p>`, the caret still resolves to the
  end of inserted content; the `<br>` keeps it caret-able (same trick as
  `fragmentToBlocks`).
- No public API change. Changelog `Fixed`; add a one-line gotcha to the
  `evo-rich-text-area` skill ("inserting an image lands the caret on a new line
  below it").

---

## 2. Checkbox — tick centering fix

**Where:** `evo-ui/src/css/checkbox.module.scss`.
The `.checkmark::after` checkmark uses hardcoded `top: 0px; left: 3px`
(lines 94-107) and the `:checked` rule animates `transform: rotate(45deg) scale(1)`
(lines 43-46). Because the tick is `position: absolute`, the parent's flex
centering doesn't apply, so the hardcoded offsets are fragile — the indeterminate
dash (lines 49-65) already centers correctly via `top/left: 50%` + translate.

**Fix:** transform-center the checkmark like the indeterminate dash, with a small
optical upward nudge (the rotated "L" sits visually low), and fold the centering
translate into both the idle and checked transforms so the scale animation stays
put:

```scss
// .input:checked + .label .checkmark::after
&::after {
  opacity: 1;
  transform: translate(-50%, -60%) rotate(45deg) scale(1);
}

// .checkmark::after (idle)
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
  transform: translate(-50%, -60%) rotate(45deg) scale(0.5);
  transition: opacity $transition-fast, transform $transition-fast;
}
```

Pure CSS, no API change. Verify centering at default size and inside a group, light
+ dark. Changelog `Fixed`; no skill change (skills document props, not pixels).

---

## 3. EvoTopNav enhancement (additive)

### 3.1 New root props (all default off — existing render unchanged)

```ts
export interface EvoTopNavProps extends Omit<React.HTMLAttributes<HTMLElement>, 'onChange'> {
  // ...all existing props unchanged...
  /** Staggered mount animation. @default 'none' */
  entrance?: 'none' | 'rise' | 'fade';
  /** position: sticky; top: 0. @default false */
  sticky?: boolean;
  /** On-scroll treatment. @default 'none' */
  scrollBehavior?: 'none' | 'elevate' | 'shrink' | 'hide';
  /** Thin scroll-progress accent line along the bottom edge. @default false */
  showProgress?: boolean;
}
```

- **`entrance`** — `'rise'`: Brand, each Menu item, Search, and Actions fade in while
  translating up a few px, staggered by `nth-child` animation-delay (the "pop up from
  down to up" effect). `'fade'`: opacity only. Plays once on mount. Disabled entirely
  under `prefers-reduced-motion` (reuse the existing `usePrefersReducedMotion`).
  Implemented with a `data-entrance` attribute on the root + CSS keyframes — no JS
  animation loop.
- **`scrollBehavior`** — `'elevate'`: translucent blurred background + shadow once the
  page is scrolled past a small threshold; `'shrink'`: also reduces bar height/padding;
  `'hide'`: auto-hide on scroll-down, reveal on scroll-up. Driven by one rAF-throttled
  scroll listener that sets `data-scrolled` / `data-hidden` on the root. Only attaches
  when `scrollBehavior !== 'none' || showProgress`.
- **`showProgress`** — sets `--evo-topnav-progress` (0→1) on the root; a CSS element
  scales by that var. Works with or without `sticky`.
- **`sticky`** — `position: sticky; top: 0` with an appropriate `z-index`.

### 3.2 New sub-component: `EvoTopNav.Search` (⌘K quick search)

Presentational trigger button — does NOT own a search overlay. Consumers wire its
`onClick` to `EvoCommandPalette` (see [[evo-command-palette]]).

```ts
export interface EvoTopNavSearchProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  /** Placeholder text shown in the trigger. @default 'Search…' */
  placeholder?: string;
  /** Opt-in global hotkey, e.g. 'mod+k'. Default: no global listener. */
  shortcut?: string;
  /** Override the kbd hint. @default platform-aware ⌘K / Ctrl K */
  shortcutHint?: React.ReactNode;
  className?: string;
}
```

- Renders `<button type="button">` with a search icon + placeholder + a `<kbd>` hint.
- Placed as a direct child of `<EvoTopNav>` (like Brand/Actions) or inside Actions.
- Platform hint resolved in an effect (avoids SSR hydration mismatch): mac → `⌘K`,
  else `Ctrl K`.
- `shortcut="mod+k"` registers a document keydown that calls `onClick` and
  `preventDefault()`s; cleaned up on unmount. Off by default — no surprise listeners.
- Collapses to icon-only below `collapseBelow` (placeholder + kbd hidden).
- Attached as `EvoTopNav.Search`; `EvoTopNavSearchProps` exported.

### 3.3 Links + breadcrumb — composition, not new parts

No new component (would duplicate existing semantics — CLAUDE.md §5). Instead:
- Document/demo GitHub + npm **icon links** in `EvoTopNav.Actions`.
- Document/demo composing `EvoBreadcrumb` inside the nav for a location trail.

### 3.4 SCSS (`evo-ui/src/css/topnav.module.scss`)

- `@keyframes topNavRise` (translateY(0.5rem)+opacity 0 → 0) and `topNavFade`.
- `.topNav[data-entrance="rise"] .topNavInner > *` and `… .topNavMenu > li`: run the
  keyframe with `nth-child`-based `animation-delay` stagger; `fill-mode: both`.
- `.topNavSticky { position: sticky; top: 0; z-index: 30; }`.
- `&[data-scrolled]`: translucent `color-mix` background + `backdrop-filter: blur()` +
  `box-shadow`; shrink variant reduces `min-height`/padding with a transition.
- `&[data-hidden]`: `transform: translateY(-100%)` with transition.
- Progress line: dedicated `.topNavProgress` element, `transform: scaleX(var(--evo-topnav-progress))`.
- `.topNavSearch` + `.topNavSearchKbd` styles, token-driven.
- Extend the existing reduced-motion block to neutralize entrance, hide-transform,
  and progress transitions.

### 3.5 Barrel / exports

`EvoTopNav` is already exported from `evo-ui/src/index.ts` via `export *`. `Search` is a
static property on `EvoTopNav` (no new top-level export); ensure `EvoTopNavSearchProps`
is exported alongside the other TopNav prop types.

---

## 4. Docs site header (`evo-docs`)

Per user decision, the docs site's own top bar (`.docs-topbar` in `Layout.tsx`,
styled in evo-docs CSS) adopts:
- **Rise entrance** on the page title on first load (one-time; reduced-motion safe).
  Reuse the existing `initialLoad` flag already present in `Layout.tsx` (it currently
  drives the sidebar stagger) so the title animation is gated the same way.
- **Scroll-elevate**: a small scroll listener adds a `data-scrolled` class to the
  topbar for a blur/shadow once the main content scrolls.

This is docs-only (no library impact). Locate the `.docs-topbar` rules (App.css /
index.css) and add the keyframe + states there using the docs `--docs-*` tokens.

---

## 5. File checklist (CLAUDE.md §1)

**Library (`evo-ui/`):**
- [ ] `src/TopNav/TopNav.tsx` — new root props, scroll hook, entrance wiring, `Search` part.
- [ ] `src/css/topnav.module.scss` — entrance keyframes/stagger, scroll states, progress, search, reduced-motion.
- [ ] `src/RichTextArea/RichTextArea.tsx` — `insertImageAtCaret` trailing paragraph + caret.
- [ ] `src/css/checkbox.module.scss` — transform-center the tick.
- [ ] `src/index.ts` — verify barrel picks up TopNav + export `EvoTopNavSearchProps`.
- [ ] Rebuild `dist/` (docs consume the built package — confirm link mode first).
- [ ] `package.json` — 1.1.0 → 1.2.0.

**Docs (`evo-docs/`):**
- [ ] `src/pages/TopNavPage.tsx` — new sections (entrance, scroll, search, breadcrumb/links) + PropsTable rows.
- [ ] `src/components/ComponentPreviews.tsx` — update TopNav tile only if its visible shape changes (likely no change; entrance is opt-in).
- [ ] `src/pages/ChangelogPage.tsx` — prepend 1.2.0 entry (`Added` TopNav features; `Fixed` RTA caret + checkbox tick).
- [ ] `src/components/Layout.tsx` — docs-topbar entrance + scroll-elevate; version badge `v1.1` → `v1.2`.
- [ ] docs topbar CSS (App.css / index.css) — `.docs-topbar` keyframe + `data-scrolled` state.

**Skills:**
- [ ] `skills/evo-topnav/SKILL.md` — new root props in the props table, new `Search`
      sub-component section, examples (entrance / scroll / search), gotchas.
- [ ] `skills/evo-rich-text-area/SKILL.md` — one-line gotcha about image caret landing.
- [ ] `skills/evo-ui/SKILL.md` — verify the TopNav catalogue row is still accurate (no new component, so likely no change).

**AI catalogue:** `evo-docs/src/pages/AIPromptPage.tsx` — no change (no new component).

---

## 6. Testing / smoke (CLAUDE.md §1 step + §10)

- `cd evo-docs && npm run dev`; verify TopNavPage loads with no console errors and
  each new demo renders.
- Entrance: title/items rise once on load; nothing re-triggers on re-render; under
  `prefers-reduced-motion: reduce` everything appears instantly.
- Scroll: elevate/shrink/hide behave; progress line tracks scroll; sticky pins.
- Search: hint shows platform-correct key; `shortcut="mod+k"` opens; icon-only < breakpoint.
- RTA: upload/drag/paste an image → caret is on a new line below it, not top-right;
  typing continues below.
- Checkbox: tick centered at default size, in a group, and in both themes.
- Toggle **dark mode** and **375 px**; check touch targets ≥44 px; try TopNav inside
  an `EvoModal` for z-index/focus issues.

## 7. Non-goals / out of scope

- No rewrite of the existing drawer / dropdown / polymorphic-item machinery.
- No new runtime dependencies; no edits to `tokens.css` or shared `evo-docs/src/styles`.
- No `npm publish` / deploy / `git push` (CLAUDE.md §7 / §13 — user-gated).
- `EvoTopNav.Search` does not implement a search overlay; it triggers the consumer's.

## 8. Open questions

None outstanding. Entrance default = `'none'` (opt-in); docs header animation = yes;
both confirmed with the user 2026-06-22.
