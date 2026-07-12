# Task 3: Retrofit `EvoAutoComplete` + `EvoTreeSelect` onto `useAnchoredPosition`

You are implementing ONE task on the `feat/viewport-aware-positioning` branch of the Evo
UI library (`D:\evo`). The shared hook `useAnchoredPosition` exists at
`evo-ui/src/hooks/useAnchoredPosition.ts`. `EvoSelect` was already retrofitted the same way
(Task 2) — you are applying the IDENTICAL portal + hook + click-outside + SCSS transform to
`EvoAutoComplete` and `EvoTreeSelect`, which share Select's menu pattern.

**Files:**
- Modify: `evo-ui/src/AutoComplete/AutoComplete.tsx`
- Modify: `evo-ui/src/css/autocomplete.module.scss` (`.menu` block ~lines 193-211 + keyframe)
- Modify: `evo-ui/src/TreeSelect/TreeSelect.tsx`
- Modify: `evo-ui/src/css/treeselect.module.scss` (`.menu` block ~lines 243-261 + keyframe)
- Build: `evo-ui`

**Hook interface you consume** (do not change it):
```ts
const { floatingRef, floatingStyles, placement } = useAnchoredPosition({
  open, anchorRef, placement: 'bottom', offset: 6, matchAnchorWidth: true,
});
```

---

## PART A — AutoComplete (`evo-ui/src/AutoComplete/AutoComplete.tsx`)

### A1. Imports — after the existing `import … from 'react';`:
```tsx
import ReactDOM from 'react-dom';
import { useAnchoredPosition } from '../hooks/useAnchoredPosition';
```

### A2. Anchor ref — AutoComplete has no single trigger element, so anchor to the visible
input box (`styles.inputWrapper`). After the existing refs (after
`const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);`), add:
```tsx
    const anchorRef = useRef<HTMLDivElement>(null);
```
Then put `ref={anchorRef}` on the input-wrapper div. Change:
```tsx
          <div
            className={[
              styles.inputWrapper,
              sizeClass,
              open ? styles.open : '',
              error ? styles.hasError : '',
            ]
              .filter(Boolean)
              .join(' ')}
          >
```
to (add `ref={anchorRef}` as the first prop):
```tsx
          <div
            ref={anchorRef}
            className={[
              styles.inputWrapper,
              sizeClass,
              open ? styles.open : '',
              error ? styles.hasError : '',
            ]
              .filter(Boolean)
              .join(' ')}
          >
```

### A3. Call the hook — immediately after the `anchorRef` line from A2:
```tsx
    const { floatingRef, floatingStyles, placement } = useAnchoredPosition({
      open,
      anchorRef,
      placement: 'bottom',
      offset: 6,
      matchAnchorWidth: true,
    });
```

### A4. Click-outside — replace:
```tsx
      const handler = (e: MouseEvent) => {
        if (!wrapperRef.current?.contains(e.target as Node)) closeMenu();
      };
```
with:
```tsx
      const handler = (e: MouseEvent) => {
        const t = e.target as Node;
        if (!wrapperRef.current?.contains(t) && !floatingRef.current?.contains(t)) closeMenu();
      };
```

### A5. Portal the menu — change:
```tsx
          {open && (
            <div
              className={styles.menu}
              role="listbox"
              id={listId}
              aria-label={label ?? 'Suggestions'}
            >
```
to:
```tsx
          {open && typeof document !== 'undefined' && ReactDOM.createPortal(
            <div
              ref={floatingRef}
              className={styles.menu}
              data-placement={placement}
              style={floatingStyles}
              role="listbox"
              id={listId}
              aria-label={label ?? 'Suggestions'}
            >
```
And its matching close — the `</div>` + `)}` immediately BEFORE
`{name && <input type="hidden" name={name} value={value ?? ''} />}` — change:
```tsx
            </div>
          )}
```
to:
```tsx
            </div>,
            document.body,
          )}
```

### A6. SCSS — in `autocomplete.module.scss`, replace the `.menu` opening (lines 193-198):
```scss
.menu {
  position: absolute;
  top: calc(100% + 6px);
  left: 0;
  right: 0;
  z-index: 100;
```
with:
```scss
.menu {
  z-index: 10000; // portaled to <body>: sit above EvoModal / CommandPalette (9999)
```
Then AFTER the existing `@keyframes evoAcMenuOpen { … }` block, add:
```scss
.menu[data-placement='top'] {
  transform-origin: bottom center;
  animation-name: evoAcMenuOpenUp;
}

@keyframes evoAcMenuOpenUp {
  from { opacity: 0; transform: translateY(6px) scale(0.97); }
  to   { opacity: 1; transform: translateY(0) scale(1); }
}
```

---

## PART B — TreeSelect (`evo-ui/src/TreeSelect/TreeSelect.tsx`)

### B1. Imports — after `import … from 'react';`:
```tsx
import ReactDOM from 'react-dom';
import { useAnchoredPosition } from '../hooks/useAnchoredPosition';
```

### B2. Call the hook — after `const listRef = useRef<HTMLDivElement>(null);`:
```tsx
  const { floatingRef, floatingStyles, placement } = useAnchoredPosition({
    open,
    anchorRef: triggerRef,
    placement: 'bottom',
    offset: 6,
    matchAnchorWidth: true,
  });
```

### B3. Click-outside — replace:
```tsx
    const handler = (e: MouseEvent) => {
      if (!wrapperRef.current?.contains(e.target as Node)) {
        setOpen(false);
        setQuery('');
      }
    };
```
with:
```tsx
    const handler = (e: MouseEvent) => {
      const t = e.target as Node;
      if (!wrapperRef.current?.contains(t) && !floatingRef.current?.contains(t)) {
        setOpen(false);
        setQuery('');
      }
    };
```

### B4. Portal the menu — change:
```tsx
        {open && (
          <div className={styles.menu}>
```
to:
```tsx
        {open && typeof document !== 'undefined' && ReactDOM.createPortal(
          <div
            ref={floatingRef}
            className={styles.menu}
            data-placement={placement}
            style={floatingStyles}
          >
```
And its matching close — the `</div>` + `)}` immediately BEFORE
`{name && <input type="hidden" name={name} value={hiddenInputValue} />}` — change:
```tsx
          </div>
        )}
```
to:
```tsx
          </div>,
          document.body,
        )}
```

### B5. SCSS — in `treeselect.module.scss`, replace the `.menu` opening (lines 243-248):
```scss
.menu {
  position: absolute;
  top: calc(100% + 6px);
  left: 0;
  right: 0;
  z-index: 100;
```
with:
```scss
.menu {
  z-index: 10000; // portaled to <body>: sit above EvoModal / CommandPalette (9999)
```
Then AFTER the existing `@keyframes menuOpen { … }` block, add:
```scss
.menu[data-placement='top'] {
  transform-origin: bottom center;
  animation-name: menuOpenUp;
}

@keyframes menuOpenUp {
  from { opacity: 0; transform: translateY(6px) scale(0.97); }
  to   { opacity: 1; transform: translateY(0) scale(1); }
}
```

---

## Step C: Build
`cd D:/evo/evo-ui; npm run build` (PowerShell tool). Expect success, zero TS errors.

## Step D: Commit (stage only these four files)
```
git -C D:/evo add evo-ui/src/AutoComplete/AutoComplete.tsx evo-ui/src/css/autocomplete.module.scss evo-ui/src/TreeSelect/TreeSelect.tsx evo-ui/src/css/treeselect.module.scss
git -C D:/evo commit -m "fix(EvoAutoComplete,EvoTreeSelect): flip menu upward near viewport bottom (#10)" -m "Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```
Do NOT `git add -A`. Do NOT commit `dist/` or `.superpowers/`.

## Report contract
Write your full report to `D:\evo\.superpowers\sdd\vap-task-3-report.md`. Return ONLY:
status (DONE / DONE_WITH_CONCERNS / BLOCKED / NEEDS_CONTEXT), the commit hash, a one-line
build result, and any concerns.
</content>
