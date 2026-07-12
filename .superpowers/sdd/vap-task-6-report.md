# Task 6 Report — Docs, skills, changelog, version bump, rebuild

Branch: `feat/viewport-aware-positioning`
Commit: `2f47f6da4b34fdbc2818ca49384da690f56cbec1` (short `2f47f6d`)

## Status: DONE

## Files changed (12, all staged and committed)

1. **`evo-docs/src/pages/BadgePage.tsx`**
   - Added `detail` and `detailPlacement` rows to the `PropsTable`, inserted after `onRemove` and before `className`.
   - Added a new "Detail popover" `docs-section` (description paragraph in `.docs-section-desc`, a live 3-badge preview, and a `CodeBlock` example) immediately before the existing `<EvoDivider />` that precedes the Props section.

2. **`evo-docs/src/pages/SelectPage.tsx`**
   - Added a "Viewport-aware menu" `docs-section` immediately after the `docs-page-header` block and before the "Basic" section.

3. **`evo-docs/src/pages/AutoCompletePage.tsx`**
   - Added the same "Viewport-aware menu" `docs-section` immediately after the `docs-page-header` block and before the "Why EvoAutoComplete" section.

4. **`evo-docs/src/pages/TreeSelectPage.tsx`**
   - Added the same "Viewport-aware menu" `docs-section` immediately after the `docs-page-header` block and before the "Basic (single-select)" section.

5. **`evo-docs/src/pages/TooltipPage.tsx`**
   - Added an "Auto-flip" `docs-section` immediately after the `docs-page-header` block and before the "Placements" section.

6. **`skills/evo-badge/SKILL.md`**
   - (a) Added `detail` / `detailPlacement` rows to the Props table (after `onRemove`, before `className`).
   - (b) Replaced the paragraph beginning "Note: EvoBadge does NOT extend a native element attribute type…" with the new paragraph documenting that EvoBadge now forwards `ref` and spreads `...rest`, plus `detail`'s own event handling.
   - (c) Replaced the Gotchas bullet "No `ref` / `...rest` forwarding: …" with three new bullets covering the `detail` focus/disclosure model, its non-interactive-content restriction, and the touch-target caveat.

7. **`skills/evo-select/SKILL.md`** — Added one new Gotchas bullet (portal + auto-flip near viewport bottom, no props needed), appended after the existing "No ref / rest passthrough" bullet.

8. **`skills/evo-autocomplete/SKILL.md`** — Added the same new Gotchas bullet, appended after the "Single CSS import, named imports only" bullet.

9. **`skills/evo-tree-select/SKILL.md`** — Added the same new Gotchas bullet, appended after the "Single, app-wide CSS import" bullet.

10. **`skills/evo-tooltip/SKILL.md`** — Added a tooltip-specific Gotchas bullet (auto-flip / shift / portal), appended after the "Use named imports…" bullet.

11. **`evo-docs/src/pages/ChangelogPage.tsx`** — Prepended a new `1.3.0` release entry (dated 2026-07-12) to the top of the `RELEASES` array, immediately before the `1.2.0` entry, with `Added` (EvoBadge `detail`), `Fixed` (#10 dropdown clipping), and `Changed` (EvoTooltip preferred-side auto-flip) sections.

12. **`evo-ui/package.json`** — Version bumped `"1.2.1"` → `"1.3.0"`.

## ComponentPreviews.tsx — NOT touched

Read `evo-docs/src/components/ComponentPreviews.tsx` in full. It contains:
- `BadgePreview` — renders three static `<EvoBadge severity=... variant="subtle">` instances with no `detail` prop. The base badge's visual appearance is unchanged by this branch, so no edit needed.
- `TooltipPreview` — a fully hand-rolled static mock (absolutely-positioned `<span>` styled to look like a tooltip bubble) that does not import or render the real `EvoTooltip` component at all, so the auto-flip behavior change doesn't apply to it.

Per the brief's Step 4 guidance, this file was left unmodified and was **not staged**.

## Build verification

```
cd D:/evo/evo-ui; npm run build
```

Result: **success, zero errors.**

```
> @justin_evo/evo-ui@1.3.0 build
> vite build

vite v6.4.2 building for production...
transforming...
✓ 62 modules transformed.
rendering chunks...

[vite:dts] Start generate declaration files...
computing gzip size...
../dist/evo-ui.css   195.93 kB │ gzip: 32.31 kB
../dist/index.es.js  221.82 kB │ gzip: 55.94 kB
[vite:dts] Outside emitted: D:/evo/evo-ui/demo/dist/index.d.ts
[vite:dts] Declaration files built in 2850ms.

../dist/evo-ui.css    195.93 kB │ gzip: 32.31 kB
../dist/index.cjs.js  151.08 kB │ gzip: 47.09 kB
✓ built in 4.05s
```

The build banner confirms version `1.3.0` and `dist/` was regenerated (not committed — no dist changes appear in `git status`, confirming it's gitignored).

## Commit

Staged exactly the 12 files listed above via explicit paths (no `git add -A`). `dist/` was never staged (gitignored, doesn't appear in `git status` at all) and `.superpowers/` remains untracked/uncommitted.

```
commit 2f47f6da4b34fdbc2818ca49384da690f56cbec1
Author: jinchuen <khorjinchuen2006@gmail.com>
docs(evo-ui): document viewport-aware positioning + EvoBadge detail; bump 1.3.0

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>

 evo-docs/src/pages/AutoCompletePage.tsx | 10 ++++++++++
 evo-docs/src/pages/BadgePage.tsx        | 27 +++++++++++++++++++++++++++
 evo-docs/src/pages/ChangelogPage.tsx    | 26 ++++++++++++++++++++++++++
 evo-docs/src/pages/SelectPage.tsx       | 10 ++++++++++
 evo-docs/src/pages/TooltipPage.tsx      |  9 +++++++++
 evo-docs/src/pages/TreeSelectPage.tsx   | 10 ++++++++++
 evo-ui/package.json                     |  2 +-
 skills/evo-autocomplete/SKILL.md        |  1 +
 skills/evo-badge/SKILL.md               |  8 ++++++--
 skills/evo-select/SKILL.md              |  1 +
 skills/evo-tooltip/SKILL.md             |  1 +
 skills/evo-tree-select/SKILL.md         |  1 +
 12 files changed, 103 insertions(+), 3 deletions(-)
```

## Not done / explicitly out of scope (per brief and CLAUDE.md §7 gates)

- Did not bump `evo-docs`'s `@justin_evo/evo-ui` dependency range.
- Did not run `npm publish`.
- Did not deploy to Railway.
- Did not manually smoke-test the docs site in a browser (`cd evo-docs && npm run dev`) — only the `evo-ui` package build was verified per the brief's Step 9 instruction. This is a reasonable manual follow-up per CLAUDE.md §1's smoke-test checklist (dark mode, 375px width, inside EvoModal) but was not requested as part of this task's steps.

## Concerns

None. All 15 targeted edits landed exactly as specified in the brief, verified via `git diff` against the exact insertion points before staging, and the package build is clean.
