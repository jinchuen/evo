# Task 2: Retrofit EvoSelect Menu onto useAnchoredPosition — Report

## Status: DONE

**Commit Hash:** `385a68e`

**Build Result:** ✓ Built in 3.52s (zero TypeScript errors)

---

## Changes Made

### 1. `evo-ui/src/Select/Select.tsx`

**Added imports (lines 2-3):**
- `import ReactDOM from 'react-dom';`
- `import { useAnchoredPosition } from '../hooks/useAnchoredPosition';`

**Added hook call (after line 122, the refs block):**
```tsx
const { floatingRef, floatingStyles, placement } = useAnchoredPosition({
  open,
  anchorRef: triggerRef,
  placement: 'bottom',
  offset: 6,
  matchAnchorWidth: true,
});
```

**Fixed click-outside handler (lines ~169-177):**
- Updated the mousedown event handler to check both `wrapperRef` and `floatingRef`
- Added comment explaining why the menu ref must be checked (portal to `<body>`)
- This prevents the menu from closing prematurely when clicking options

**Portaled the menu (lines ~401-410 and closing ~502-504):**
- Wrapped menu in `ReactDOM.createPortal(..., document.body)`
- Added `ref={floatingRef}` to the menu div
- Added `data-placement={placement}` attribute for CSS selector
- Added `style={floatingStyles}` to apply position:fixed, top, left, width from the hook
- Added check `typeof document !== 'undefined'` for SSR safety

### 2. `evo-ui/src/css/select.module.scss`

**Updated `.menu` block (lines ~267-272):**
- Removed `position: absolute;` `top: calc(100% + 6px);` `left: 0;` `right: 0;`
- Changed `z-index: 100;` to `z-index: 10000;` with comment explaining it sits above modals
- Styles now come from inline `floatingStyles` (position:fixed, top, left, width via hook)

**Added flipped-entrance animation (after `@keyframes menuOpen`, lines ~298-309):**
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

---

## Verification

✓ Build succeeded with zero TypeScript errors  
✓ Both files compiled without warnings  
✓ dist/ artifacts generated (index.es.js, index.cjs.js, index.d.ts, evo-ui.css)  
✓ Only the two specified files staged and committed  
✓ `.superpowers/` and `dist/` were not committed  

---

## How It Works

The `EvoSelect` dropdown now:

1. **Renders in a portal** to `document.body`, removing it from the normal DOM flow
2. **Uses `useAnchoredPosition` hook** to calculate position:fixed placement relative to the trigger button
3. **Flips automatically** when near the viewport bottom (placement: 'top' instead of 'bottom')
4. **Applies viewport-aware animations** via `data-placement` CSS selector:
   - Bottom placement: slides down from top (menuOpen animation)
   - Top placement: slides down from bottom (menuOpenUp animation)
5. **Properly handles clicks** by checking both wrapper and floating menu refs before closing
6. **Sits at z-index 10000** to layer above modals and other overlays

This is the canonical retrofit pattern; two more components (EvoAutocomplete and EvoCommandPalette) will follow the same approach.

---

## No Concerns

All requirements met. Build clean. Changes minimal and focused.
