# Task 7: Sync contracts — skill, changelog, version

**Files:**
- Modify: `skills/evo-topnav/SKILL.md`
- Modify: `evo-docs/src/pages/ChangelogPage.tsx`
- Modify: `evo-ui/package.json`
- Build/typecheck: `evo-docs` (`npm run build`) — the changelog is a typed TS array.

**Interfaces:** documents the API shipped in Tasks 1-6. No component code changes.

Read `skills/evo-topnav/SKILL.md`, `evo-docs/src/pages/ChangelogPage.tsx`, and `evo-ui/package.json` first.

## Step 1: Update the TopNav skill — root props table

In `skills/evo-topnav/SKILL.md`, in the root `EvoTopNav` props table (the markdown table under "## Props" — its last row is `className`), add these four rows AFTER the `collapseBelow` row:

```md
| `entrance` | `'none' \| 'rise' \| 'fade'` | `'none'` | No | Staggered mount animation of the bar contents (`rise` = up + fade, `fade` = opacity only). Plays once; disabled under `prefers-reduced-motion`. |
| `sticky` | `boolean` | `false` | No | Pin the bar with `position: sticky; top: 0`. |
| `scrollBehavior` | `'none' \| 'elevate' \| 'shrink' \| 'hide'` | `'none'` | No | On-scroll treatment: `elevate` (blur + shadow once scrolled), `shrink` (also reduces height), `hide` (auto-hide on scroll-down, reveal on scroll-up). |
| `showProgress` | `boolean` | `false` | No | Render a thin scroll-progress accent line along the bottom edge (tracks document scroll). |
```

## Step 2: Add a `Search` sub-component section to the skill

In `skills/evo-topnav/SKILL.md`, AFTER the `### EvoTopNav.Toggle` section (and before `### EvoTopNav.Dropdown`), add:

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

## Step 3: Add an example + gotchas to the skill

In the `## Examples` section of `skills/evo-topnav/SKILL.md`, add this example (after the existing examples):

~~~md
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
~~~

In the `## Gotchas` section of `skills/evo-topnav/SKILL.md`, add these three bullets:

```md
- `entrance` plays once on mount and is fully disabled under `prefers-reduced-motion` (the component drops the `data-entrance` attribute, and CSS has a media-query fallback). It animates the Brand, each Menu item, Search, and Actions.
- `scrollBehavior` / `showProgress` only have a visible effect on a scrollable page; pair with `sticky` so the bar stays in view while you scroll. They attach one rAF-throttled `window` scroll listener, removed on unmount / when disabled.
- `EvoTopNav.Search` is presentational — it does not render a search UI. Connect `onClick` to [[evo-command-palette]] or your own overlay. `shortcut` registers a *global* document keydown; omit it if you manage hotkeys yourself.
```

## Step 4: Prepend the 1.2.0 changelog entry

In `evo-docs/src/pages/ChangelogPage.tsx`, add a new release object at the TOP of the `RELEASES` array (it currently starts with `{ version: '1.1.0', ... }` — insert before it). Match the existing object shape exactly:

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

(If the `RELEASES` array elements use a specific indentation, match it. The `kind` values must be exactly `'Added'` and `'Fixed'` — these are valid `ChangeKind` values. No `Breaking` section, so no `migration` field is needed.)

## Step 5: Bump the library version

In `evo-ui/package.json`, change:
```json
  "version": "1.1.0",
```
to:
```json
  "version": "1.2.0",
```

## Step 6: Typecheck / build the docs

Run (PowerShell tool): `cd D:/evo/evo-docs; npm run build`
Expected: `tsc -b` + vite pass (the new `RELEASES` entry is well-typed). Capture the output tail.

## Step 7: Commit

```
git -C D:/evo add skills/evo-topnav/SKILL.md evo-docs/src/pages/ChangelogPage.tsx evo-ui/package.json
git -C D:/evo commit -m "chore: bump to 1.2.0; sync TopNav skill + changelog" -m "Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```
(Stage only those three files. Never `git add -A`. Do not commit `.superpowers/` or `dist/`.)

## Notes / constraints
- This task documents what Tasks 1-6 shipped; do not change any component code.
- Markdown table pipes inside inline code (e.g. `'none' \| 'rise'`) must be escaped as `\|` so the table renders — the rows above already escape them.
- The changelog `kind` must be one of `'Added' | 'Changed' | 'Fixed' | 'Breaking'` (the file defines this `ChangeKind` type). We use `Added` + `Fixed` only.
