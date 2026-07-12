# Task 6: Docs, skills, changelog, version bump, rebuild

You are implementing the FINAL task on the `feat/viewport-aware-positioning` branch of the
Evo UI library (`D:\evo`). All component code is done (Tasks 1-5). This task registers the
changes everywhere per CLAUDE.md §1: docs pages, agent skills, the changelog, and the
version bump. Read each target file first and match its existing structure; insert the
exact content below.

**Context — what shipped in this branch:**
- New internal hook `useAnchoredPosition` (viewport-aware flip/clamp, portal + fixed).
- `EvoSelect` / `EvoAutoComplete` / `EvoTreeSelect` menus now portal + flip near the
  viewport bottom (fixes #10 clipping). No new props.
- `EvoBadge` gained `detail?: React.ReactNode` + `detailPlacement?: 'top'|'bottom'|'left'|'right'`
  (default `'bottom'`) — a hover/focus/tap popover. EvoBadge now also forwards `ref` and
  spreads `...rest`.
- `EvoTooltip` auto-flips; `placement` is now the *preferred* side (non-breaking).

**Files:**
- Modify: `evo-docs/src/pages/BadgePage.tsx`, `SelectPage.tsx`, `AutoCompletePage.tsx`, `TreeSelectPage.tsx`, `TooltipPage.tsx`
- Modify (if it renders a Badge preview): `evo-docs/src/components/ComponentPreviews.tsx`
- Modify: `skills/evo-badge/SKILL.md`, `skills/evo-select/SKILL.md`, `skills/evo-autocomplete/SKILL.md`, `skills/evo-tree-select/SKILL.md`, `skills/evo-tooltip/SKILL.md`
- Modify: `evo-docs/src/pages/ChangelogPage.tsx`
- Modify: `evo-ui/package.json`
- Build: `evo-ui`

**Docs style rules (CLAUDE.md §1):** use `.docs-section-desc` for paragraph text and the
existing `PropsTable` / `CodeBlock` components. NEVER inline `style={{ color: ... }}` and
NEVER hard-code hex (`#94a3b8` etc.). Use `<code>` for inline code.

---

## Step 1: BadgePage.tsx — add the two props to the PropsTable
In `evo-docs/src/pages/BadgePage.tsx`, in the `<PropsTable props={[...]}>`, add these two
entries after the `onRemove` row and before the `className` row:
```tsx
          { prop: 'detail', type: 'ReactNode', description: 'Rich content revealed in a popover on hover / focus / tap. Descriptive (non-interactive).' },
          { prop: 'detailPlacement', type: "'top' | 'bottom' | 'left' | 'right'", default: "'bottom'", description: 'Preferred popover side; flips automatically when there is no room.' },
```

## Step 2: BadgePage.tsx — add a live example section
Add this `docs-section` immediately BEFORE the `<EvoDivider />` near the end of the page.
(The page already imports `EvoBadge` and `CodeBlock`.)
```tsx
      <div className="docs-section">
        <div className="docs-section-title">Detail popover</div>
        <p className="docs-section-desc">
          Pass <code>detail</code> to reveal extra status context on hover, keyboard focus,
          or tap. The popover uses viewport-aware positioning — it flips and shifts to stay
          on-screen and escapes <code>overflow: hidden</code> containers. It is a
          hover/focus-first disclosure (on touch it taps to toggle); because the badge stays
          label-sized, use it for supplementary detail, not as a primary touch control.
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

## Step 3: Behavior-note sections on the four component pages
Add ONE `docs-section` near the top of each page (right after the `docs-page-header` block),
matching the page's existing structure.

For `SelectPage.tsx`, `AutoCompletePage.tsx`, and `TreeSelectPage.tsx` (identical text):
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
For `TooltipPage.tsx`:
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

## Step 4: ComponentPreviews.tsx
Read `evo-docs/src/components/ComponentPreviews.tsx`. If it renders a Badge preview, the
base badge is visually unchanged, so no edit is required — just confirm it still compiles.
If it does NOT reference Badge in a way this change affects, make NO edit and note
"no change needed" in your report. (Drop this file from the commit if unchanged.)

## Step 5: evo-badge SKILL.md (`skills/evo-badge/SKILL.md`)
(a) In the Props table, add after the `onRemove` row and before the `className` row:
```md
| `detail` | `React.ReactNode` | — | No | Rich content revealed in a popover on hover / focus / tap. Descriptive (non-interactive). |
| `detailPlacement` | `'top' \| 'bottom' \| 'left' \| 'right'` | `'bottom'` | No | Preferred popover side; flips automatically when there is no room. |
```
(b) The skill currently claims EvoBadge does NOT forward ref/rest — this is now FALSE.
Find the note that begins "Note: EvoBadge does NOT extend a native element attribute type
and does NOT forward `ref` or spread `...rest`. …" (a paragraph right under the Props table)
and REPLACE that whole paragraph with:
```md
Note: EvoBadge forwards `ref` to the root `<span>` and spreads standard HTML attributes (`...rest`, e.g. `id`, `title`, `data-*`, `onClick`) onto it. When `detail` is set, the badge manages its own hover/focus/tap/keydown handlers and `tabIndex`, and clicking the built-in remove button does not toggle the popover.
```
(c) In the `## Gotchas` list, REPLACE the bullet that starts "No `ref` / `...rest`
forwarding: …" with these three bullets:
```md
- With `detail`, the badge is a focusable disclosure trigger (`tabIndex=0`, `aria-describedby` → popover) and toggles on tap for touch; it opens on hover/focus and closes on blur/`Escape`. The popover is portaled to `<body>` and flips/shifts to stay on-screen.
- `detail` is intended for descriptive, non-interactive content. Do not put focusable controls (links/buttons) inside it — the popover uses `role="tooltip"`, which is not a focus container.
- A `detail` badge stays label-sized (below the 44px touch-target guideline). It is a hover/focus-first supplementary disclosure, not a primary touch control — don't hide critical touch-only actions/info behind it.
```

## Step 6: The other four skills — add one gotcha bullet each
In each `## Gotchas` section. For `skills/evo-select/SKILL.md`, `skills/evo-autocomplete/SKILL.md`,
`skills/evo-tree-select/SKILL.md`:
```md
- The dropdown menu is viewport-aware: it renders in a portal and flips upward when the trigger is near the bottom of the screen, so it is never clipped by `overflow: hidden` / scroll containers (including inside an EvoModal). Automatic; no props.
```
For `skills/evo-tooltip/SKILL.md`:
```md
- `placement` is the *preferred* side. The tooltip auto-flips to the opposite side and shifts to stay on-screen when the preferred side lacks room; it renders in a portal so it is never clipped.
```

## Step 7: Changelog (`evo-docs/src/pages/ChangelogPage.tsx`)
Prepend a new entry to the top of the `RELEASES` array (immediately before the `1.2.0` entry):
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

## Step 8: Version bump
In `evo-ui/package.json`, change `"version": "1.2.1"` to `"version": "1.3.0"`.

## Step 9: Rebuild
`cd D:/evo/evo-ui; npm run build` (PowerShell tool). Expect success. (Do NOT bump
`evo-docs`'s dependency range, do NOT `npm publish`, do NOT deploy — all gated.)

## Step 10: Commit
Stage exactly the files you changed (drop `ComponentPreviews.tsx` if you made no edit):
```
git -C D:/evo add evo-docs/src/pages/BadgePage.tsx evo-docs/src/pages/SelectPage.tsx evo-docs/src/pages/AutoCompletePage.tsx evo-docs/src/pages/TreeSelectPage.tsx evo-docs/src/pages/TooltipPage.tsx skills/evo-badge/SKILL.md skills/evo-select/SKILL.md skills/evo-autocomplete/SKILL.md skills/evo-tree-select/SKILL.md skills/evo-tooltip/SKILL.md evo-docs/src/pages/ChangelogPage.tsx evo-ui/package.json
git -C D:/evo commit -m "docs(evo-ui): document viewport-aware positioning + EvoBadge detail; bump 1.3.0" -m "Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```
Do NOT `git add -A`. Do NOT commit `dist/` or `.superpowers/`.

## Report contract
Write your full report to `D:\evo\.superpowers\sdd\vap-task-6-report.md` (list every file
changed, the build result tail, the commit hash, and note whether ComponentPreviews was
touched). Return ONLY: status (DONE / DONE_WITH_CONCERNS / BLOCKED / NEEDS_CONTEXT), the
commit hash, a one-line build result, and any concerns.
</content>
