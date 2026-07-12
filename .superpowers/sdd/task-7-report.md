# Task 7 Report — Sync contracts: skill, changelog, version

## Status
DONE

## Commit
- SHA: d6f0fe5
- Subject: `chore: bump to 1.2.0; sync TopNav skill + changelog`
- Branch: `feat/topnav-1.2.0-and-fixes`

---

## Files changed (3)

### 1. `skills/evo-topnav/SKILL.md`
- **Root props table**: Added 4 rows after `collapseBelow` and before `className`:
  `entrance`, `sticky`, `scrollBehavior`, `showProgress` — with escaped pipes (`\|`) in union types.
- **New sub-component section `EvoTopNav.Search`**: Inserted after `### EvoTopNav.Toggle` and before `### EvoTopNav.Dropdown`. Contains description, 5-column props table (`placeholder`, `shortcut`, `shortcutHint`, `onClick`, `className`), and the extends note.
- **Examples section**: Appended `### Animated, sticky header with quick search` example with full TSX code block.
- **Gotchas section**: Appended 3 new bullets covering `entrance`/`prefers-reduced-motion`, `scrollBehavior`/`showProgress` + `sticky` pairing + rAF listener, and `EvoTopNav.Search` presentational-only + `shortcut` global keydown warning.

### 2. `evo-docs/src/pages/ChangelogPage.tsx`
- Prepended a new `1.2.0` entry object at the top of the `RELEASES` array (before the existing `1.1.0` entry).
- Entry shape matches existing objects: `version`, `date`, `summary`, `sections` array.
- `sections` contains two objects: `kind: 'Added'` (3 items) and `kind: 'Fixed'` (2 items).
- No `migration` field (no `Breaking` section).
- `kind` values `'Added'` and `'Fixed'` are valid `ChangeKind` members — confirmed by tsc passing.

### 3. `evo-ui/package.json`
- Bumped `"version"` from `"1.1.0"` to `"1.2.0"`. No other changes.

---

## Build

Command: `cd D:/evo/evo-docs; npm run build`

Output tail:
```
> evo-docs@0.0.0 build
> tsc -b && vite build

vite v8.0.10 building client environment for production...
✓ 71 modules transformed.
dist/index.html                   0.47 kB │ gzip:   0.30 kB
dist/assets/index-Cz5HgccF.css  210.73 kB │ gzip:  35.41 kB
dist/assets/index-B-0Jw-tX.js   762.72 kB │ gzip: 199.27 kB
✓ built in 313ms
```

Result: PASS. `tsc -b` produced no type errors. Vite built cleanly in 313ms. The chunk-size advisory (`> 500 kB`) is a pre-existing warning unrelated to this task.

---

## Self-review checklist

- [x] Skill table pipe escaping: all union-type cells use `\|` (e.g. `'none' \| 'rise' \| 'fade'`).
- [x] Search section placed correctly: after `### EvoTopNav.Toggle`, before `### EvoTopNav.Dropdown`.
- [x] Changelog entry is well-typed: `kind: 'Added'` and `kind: 'Fixed'` — both valid `ChangeKind` values. No `migration` field (no `Breaking`). Confirmed by passing tsc.
- [x] Changelog entry is prepended: it is first in the `RELEASES` array, above `1.1.0`.
- [x] Version bumped: `1.1.0` → `1.2.0` in `evo-ui/package.json`.
- [x] Only the three files committed: `git status --short` before commit showed exactly `M  evo-docs/src/pages/ChangelogPage.tsx`, `M  evo-ui/package.json`, `M  skills/evo-topnav/SKILL.md`, with `.superpowers/` untracked and not staged.
- [x] Build clean: tsc + vite both pass.
- [x] No component code changed.

---

## Concerns
None.
