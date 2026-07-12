# Task 2: Retrofit `EvoSelect` menu onto `useAnchoredPosition`

You are implementing ONE task on the `feat/viewport-aware-positioning` branch of the Evo
UI library (`D:\evo`). The shared hook `useAnchoredPosition` already exists at
`evo-ui/src/hooks/useAnchoredPosition.ts` (Task 1, done). This task makes `EvoSelect`'s
dropdown menu render in a portal with `position:fixed` and flip upward near the viewport
bottom, using that hook. This is the canonical retrofit that two more components will mirror.

**Files:**
- Modify: `evo-ui/src/Select/Select.tsx`
- Modify: `evo-ui/src/css/select.module.scss` (the `.menu` block, ~lines 267-296)
- Build: `evo-ui` (`npm run build`)

**Hook interface you consume** (already implemented — do not change it):
```ts
const { floatingRef, floatingStyles, placement } = useAnchoredPosition({
  open, anchorRef, placement: 'bottom', offset: 6, matchAnchorWidth: true,
});
// floatingRef: RefObject<HTMLDivElement|null> — attach to the menu <div>
// floatingStyles: CSSProperties — spread onto the menu (position:fixed, top, left, width, visibility)
// placement: 'top' | 'bottom' — the side chosen after flip (use for data-placement)
```

## Step 1: Imports
At the top of `Select.tsx`, after the existing `import React, … from 'react';` line, add:
```tsx
import ReactDOM from 'react-dom';
import { useAnchoredPosition } from '../hooks/useAnchoredPosition';
```

## Step 2: Call the hook
Inside `EvoSelect`, immediately after the refs block (after `const listRef = useRef<HTMLDivElement>(null);`), add:
```tsx
  const { floatingRef, floatingStyles, placement } = useAnchoredPosition({
    open,
    anchorRef: triggerRef,
    placement: 'bottom',
    offset: 6,
    matchAnchorWidth: true,
  });
```

## Step 3: Fix the click-outside handler
The menu will be portaled to `<body>`, so it is no longer a DOM child of the wrapper —
without this change, clicking an option would close the menu before the click registers.
Replace this exact effect body:
```tsx
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (!wrapperRef.current?.contains(e.target as Node)) {
        setOpen(false);
        setQuery('');
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);
```
with:
```tsx
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      const t = e.target as Node;
      // The menu is portaled to <body>, so it is no longer a DOM child of the
      // wrapper — check it explicitly or clicking an option would close first.
      if (!wrapperRef.current?.contains(t) && !floatingRef.current?.contains(t)) {
        setOpen(false);
        setQuery('');
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);
```

## Step 4: Portal the menu + attach ref/styles
Find `{open && (` that opens the `<div className={styles.menu} role="listbox" …>`. Replace this exact opening:
```tsx
        {open && (
          <div
            className={styles.menu}
            role="listbox"
            id={listId}
            aria-labelledby={selectId}
            aria-multiselectable={isMultiple || undefined}
            aria-activedescendant={activeIdx >= 0 ? `${selectId}-opt-${activeIdx}` : undefined}
          >
```
with:
```tsx
        {open && typeof document !== 'undefined' && ReactDOM.createPortal(
          <div
            ref={floatingRef}
            className={styles.menu}
            data-placement={placement}
            style={floatingStyles}
            role="listbox"
            id={listId}
            aria-labelledby={selectId}
            aria-multiselectable={isMultiple || undefined}
            aria-activedescendant={activeIdx >= 0 ? `${selectId}-opt-${activeIdx}` : undefined}
          >
```
Then find the matching close of that block — the `</div>` followed by `)}` that appears
immediately BEFORE the line `{name && !isMultiple && <input type="hidden" …`:
```tsx
          </div>
        )}
```
and replace it with:
```tsx
          </div>,
          document.body,
        )}
```

## Step 5: Update `.menu` SCSS
In `evo-ui/src/css/select.module.scss`, replace the `.menu` opening (currently lines 267-272):
```scss
.menu {
  position: absolute;
  top: calc(100% + 6px);
  left: 0;
  right: 0;
  z-index: 100;
```
with (position now comes from the inline `floatingStyles`; raise the stack above the modal):
```scss
.menu {
  z-index: 10000; // portaled to <body>: sit above EvoModal / CommandPalette (9999)
```
Then, immediately AFTER the existing `@keyframes menuOpen { … }` block (it ends at the
line `}` on/around line 296), add the flipped-entrance variant:
```scss
/* Opened upward (flipped by useAnchoredPosition): grow from the bottom edge. */
.menu[data-placement='top'] {
  transform-origin: bottom center;
  animation-name: menuOpenUp;
}

@keyframes menuOpenUp {
  from { opacity: 0; transform: translateY(6px) scale(0.97); }
  to   { opacity: 1; transform: translateY(0) scale(1); }
}
```
Do NOT change any other part of the `.menu` block (keep the background, border, radius,
overflow, box-shadow, transform-origin, and the default `animation` line intact).

## Step 6: Build
`cd D:/evo/evo-ui; npm run build` (PowerShell tool). Expect success, zero TS errors. Capture the tail as evidence.

## Step 7: Commit (stage only these two files)
```
git -C D:/evo add evo-ui/src/Select/Select.tsx evo-ui/src/css/select.module.scss
git -C D:/evo commit -m "fix(EvoSelect): flip menu upward near viewport bottom via useAnchoredPosition (#10)" -m "Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```
Do NOT `git add -A`. Do NOT commit `dist/` or `.superpowers/`.

## Report contract
Write your full report to `D:\evo\.superpowers\sdd\vap-task-2-report.md` (what changed,
the build result tail, the commit hash, any concerns). Return ONLY: status
(DONE / DONE_WITH_CONCERNS / BLOCKED / NEEDS_CONTEXT), the commit hash, a one-line build
result, and any concerns.
</content>
