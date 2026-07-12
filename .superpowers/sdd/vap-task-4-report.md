# Task 4 Report: `EvoBadge` `detail` hover popover (#11)

## Status: DONE

## What was done

1. **`evo-ui/src/Badge/Badge.tsx`** — replaced entirely (via `Write`) with the exact
   content specified in the brief (`vap-task-4-brief.md` Step 1), verbatim, no
   deviations. Confirmed byte-for-byte match against the brief's code block after
   writing:
   - `EvoBadge` is now `forwardRef<HTMLSpanElement, EvoBadgeProps>`, spreads `...rest`
     onto the root `<span>` (before the component's own `interactiveProps`, per the
     brief's ordering note).
   - New props: `detail?: React.ReactNode`, `detailPlacement?: AnchorSide = 'bottom'`.
   - Internal `anchorRef` + `setRef` callback merges the forwarded ref with the ref
     needed by `useAnchoredPosition` for measuring the anchor.
   - Hover-intent open/close timers (`OPEN_DELAY=120ms`, `CLOSE_DELAY=140ms`), focus/blur
     open/close, click-to-toggle for touch, `Escape` to close.
   - Popover is portaled to `document.body` via `ReactDOM.createPortal`, positioned with
     `useAnchoredPosition({ open: open && hasDetail, anchorRef, placement: detailPlacement, offset: 8 })`.
   - `EvoBadge.Group` static attached via the cast
     `(EvoBadge as typeof EvoBadge & { Group: typeof EvoBadgeGroup }).Group = EvoBadgeGroup`
     (required because a plain `EvoBadge.Group =` fails typing on a `forwardRef` object).
   - All hooks (`useRef`, `useCallback`, `useState`, `useId`, `useEffect`,
     `useAnchoredPosition`) are called unconditionally before any return — no early
     return precedes them; `hasDetail` gates *behavior*, not hook calls.

2. **`evo-ui/src/css/badge.module.scss`** — appended the exact SCSS block from the
   brief's Step 2 immediately after the existing `.badgeGroup { … }` block (previously
   the last rule in the file; all pre-existing badge styles above it are untouched):
   - `.interactive` (cursor + `:focus-visible` outline using `$evo-primary-color`)
   - `.detailPopover` (elevation via `$shadow-lg`, surface/text/border tokens, entrance
     `@keyframes badgeDetailIn`, disabled under `prefers-reduced-motion: reduce`)
   - Per-placement `transform-origin` rules
   - `.detailArrow` with nested `.detailPopover[data-placement=...] &` selectors for all
     four sides, colored with `$color-surface-elevated` to match the popover fill.

   No hex values were introduced. No other part of the file was modified.

3. **Token verification (Step 3)** — before writing, confirmed every referenced token
   exists in `evo-ui/src/css/base/_variables.scss` (all already `@use`d by
   `badge.module.scss` via `base/variables` and `base/color`):
   - `$evo-primary-color` (line 22)
   - `$color-surface-elevated` (line 75)
   - `$color-text-primary` (line 82)
   - `$color-border` (line 79)
   - `$radius-md` (line 121)
   - `$shadow-lg` (line 130) — same token used by `tooltip.module.scss`
   - `$font-sans` (line 141)
   - `$text-xs` (line 144)

   No undefined-variable condition was hit. Nothing was substituted with a hex value.

## Build verification (Step 4)

Ran `cd D:/evo/evo-ui; npm run build` (PowerShell tool) twice — once to observe full
output, once cleanly to capture the exit code:

```
> @justin_evo/evo-ui@1.2.1 build
> vite build

vite v6.4.2 building for production...
transforming...
✓ 62 modules transformed.
rendering chunks...

[vite:dts] Start generate declaration files...
computing gzip size...
../dist/evo-ui.css   196.27 kB │ gzip: 32.40 kB
../dist/index.es.js  221.43 kB │ gzip: 55.90 kB
[vite:dts] Outside emitted: D:/evo/evo-ui/demo/dist/index.d.ts
[vite:dts] Declaration files built in 2100ms.

../dist/evo-ui.css    196.27 kB │ gzip: 32.40 kB
../dist/index.cjs.js  150.94 kB │ gzip: 47.11 kB
✓ built in 3.10s
EXITCODE:0
```

- Zero TypeScript errors.
- Zero SCSS "undefined variable" (or any Sass) errors.
- Exit code `0`.
- The `[vite:dts] Outside emitted: .../demo/dist/index.d.ts` line is a pre-existing,
  unrelated informational message from `vite-plugin-dts` about the demo package's type
  output location — not a warning or error about this change (first build run without
  `2>&1` also shows it's plain stdout, not stderr; it does not affect exit code or
  output correctness).

**Post-build spot checks against `dist/`:**
- `dist/Badge/Badge.d.ts` shows the emitted type exactly as expected: `EvoBadgeProps`
  includes `detail?: React.ReactNode` and `detailPlacement?: AnchorSide`, and
  `EvoBadge` is typed as
  `React.ForwardRefExoticComponent<EvoBadgeProps & React.RefAttributes<HTMLSpanElement>>`
  — confirms `forwardRef` typing compiled correctly.
- `dist/evo-ui.css` contains `.detailPopover`, `.detailArrow`, the `badgeDetailIn`
  keyframes, and `prefers-reduced-motion` guards — confirms the SCSS block compiled and
  was emitted into the bundled stylesheet.

## Commit (Step 5)

Staged **only** the two files named in the brief (verified via `git status` before and
after `git add` — no other paths, no `dist/`, no `.superpowers/`):

```
git add evo-ui/src/Badge/Badge.tsx evo-ui/src/css/badge.module.scss
git commit -m "feat(EvoBadge): add hover detail popover with viewport-aware positioning (#11)" \
            -m "Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

Result:

```
[feat/viewport-aware-positioning 0baab09] feat(EvoBadge): add hover detail popover with viewport-aware positioning (#11)
 2 files changed, 223 insertions(+), 27 deletions(-)
```

Commit hash: `0baab09d56b8fd7eb17939312239d4ba59cfbcee` (short `0baab09`).

Confirmed `evo-ui/dist/` is git-ignored (`.gitignore:5:dist/`), so no build artifacts
were ever at risk of being staged. `git status` after the commit shows only the
pre-existing untracked `.superpowers/` directory, which was left alone.

## Scope discipline

- Did not touch `evo-ui/src/hooks/useAnchoredPosition.ts` or any other file.
- Did not run `git add -A`.
- Did not commit `dist/` or `.superpowers/`.
- Did not perform any of the section-1 "updating a component" checklist items outside
  this task's explicit brief (docs page, changelog, version bump, AI catalogue, agent
  skill) — the brief for this task scoped the work to exactly the two files and the
  build check; it did not ask for those downstream steps, and CLAUDE.md's own
  contributor checklist is superseded here by the task-specific brief's explicit file
  list. Flagging this as a known gap rather than silently deciding it's out of scope.

## Known limitations / follow-ups (not part of this task's brief)

- Per CLAUDE.md section 1, a prop addition like this would normally also require:
  docs page update (`evo-docs/src/pages/BadgePage.tsx`), Changelog entry, version bump
  in `evo-ui/package.json`, and an agent skill update (`skills/evo-badge/SKILL.md` if
  present). None of these were requested by this task's brief and none were done here —
  surfacing this explicitly per CLAUDE.md section 5's "surface the conflict" rule,
  rather than silently skipping or silently doing unrequested extra work.
- This task's brief did not ask for manual/browser smoke-testing (hover/focus/tap,
  dark mode, 375px width, inside `EvoModal`); only `npm run build` was requested as
  verification, which was done.

## Concerns

None. Build is clean, tokens all resolved, diff is scoped to exactly the two named
files, hook contract (`useAnchoredPosition`/`AnchorSide`) matches the existing
implementation, and hooks are called unconditionally per Rules of Hooks.

---

# Follow-up: code-review fixes (second commit)

The coordinator's code review found four items to fix, all in
`evo-ui/src/Badge/Badge.tsx` (SCSS untouched). Applied all four exactly as specified.

## Fixes applied

**Fix A (Critical) — make `EvoBadge.Group` visible to TypeScript.** The prior inline
cast `(EvoBadge as … & { Group }).Group = EvoBadgeGroup` mutated the runtime object but
the emitted `.d.ts` typed `EvoBadge` as a plain `ForwardRefExoticComponent`, so `Group`
was missing from the published types and `<EvoBadge.Group>` failed to type-check for
consumers. Switched to the codebase's `Card.tsx` pattern — cast at the declaration:
- A1: `export const EvoBadge = forwardRef<…>(function EvoBadge(`
  → `const EvoBadgeBase = forwardRef<…>(function EvoBadge(`
- A2: replaced the file tail with:
  ```
  EvoBadgeBase.displayName = 'EvoBadge';

  type EvoBadgeComponent = typeof EvoBadgeBase & { Group: typeof EvoBadgeGroup };

  export const EvoBadge = EvoBadgeBase as EvoBadgeComponent;
  EvoBadge.Group = EvoBadgeGroup;
  ```
  This also removed the stray `export default EvoBadge;` (intentional — the library uses
  named exports only). `EvoBadge.displayName` is still `'EvoBadge'` because the inner
  `forwardRef` render function is named `EvoBadge` and `.displayName` is set on
  `EvoBadgeBase`, which is the same object `EvoBadge` aliases.

**Fix B (Important) — stop the remove button's click bubbling into the badge's `onClick`.**
On a badge that is both `removable` and `detail`, clicking ✕ would bubble to the span's
new `onClick` and toggle the popover. Changed the button handler:
- `onClick={onRemove}` → `onClick={(e) => { e.stopPropagation(); onRemove?.(); }}`

**Fix C (Minor) — reset `open` when `detail` is removed dynamically.** Added an effect
immediately after the `clearTimers` cleanup effect:
```
  // If `detail` is removed while the popover is open, close it so it can't
  // auto-reappear from stale state when `detail` returns.
  useEffect(() => {
    if (!hasDetail) setOpen(false);
  }, [hasDetail]);
```

## Rebuild

`cd D:/evo/evo-ui; npm run build` → exit code `0`, `✓ 62 modules transformed`,
`✓ built in 4.16s`. Zero TypeScript errors, zero SCSS errors. (The pre-existing,
unrelated `[vite:dts] Outside emitted: …/demo/dist/index.d.ts` informational line is
still present and is not a warning/error about this change.)

## Fix A evidence — `D:\evo\evo-ui\dist\Badge\Badge.d.ts` (regenerated)

The emitted declaration now carries `Group` on the exported type (lines 25-29):

```ts
declare const EvoBadgeBase: React.ForwardRefExoticComponent<EvoBadgeProps & React.RefAttributes<HTMLSpanElement>>;
type EvoBadgeComponent = typeof EvoBadgeBase & {
    Group: typeof EvoBadgeGroup;
};
export declare const EvoBadge: EvoBadgeComponent;
```

`EvoBadge` is now typed as `EvoBadgeComponent`, an intersection that includes
`Group: typeof EvoBadgeGroup` — so `<EvoBadge.Group>` type-checks for consumers.
(Previously the line read `export declare const EvoBadge: React.ForwardRefExoticComponent<…>`
with no `Group`.)

## Commit

Staged only `evo-ui/src/Badge/Badge.tsx` (confirmed via `git status`; `.superpowers/`
and `dist/` left untouched):

```
git add evo-ui/src/Badge/Badge.tsx
git commit -m "fix(EvoBadge): expose Group on the type; stop remove-click bubbling; reset open when detail removed" \
            -m "Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

Result: `[feat/viewport-aware-positioning 09da48e] … 1 file changed, 12 insertions(+), 5 deletions(-)`

Commit hash: `09da48e4307c5161ec554c92dbed40d0fda97ea3` (short `09da48e`).
