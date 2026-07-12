# Task 2 Report: Fix Checkbox Tick Centering

## Status
**DONE**

## Commit
- **SHA:** `079dc60`
- **Message:** `fix(Checkbox): center the checked tick via transform`

## Changes Made

### File: `evo-ui/src/css/checkbox.module.scss`

**Change 1: `:checked` state (lines 43-45)**
- Replaced: `transform: rotate(45deg) scale(1);`
- With: `transform: translate(-50%, -60%) rotate(45deg) scale(1);`
- Effect: Applies the same centering transform logic used by the indeterminate dash to the checked tick.

**Change 2: Idle `.checkmark::after` rule (lines 94-107)**
- Replaced hardcoded pixel offsets (`top: 0px; left: 3px;`) with centered positioning (`top: 50%; left: 50%;`)
- Updated height from `8px` to `9px` (per spec)
- Applied centering transform: `transform: translate(-50%, -60%) rotate(45deg) scale(0.5);`
- Added explanatory comment about the optical adjustment (-60% Y nudge)

Both rules now use `translate(-50%, -60%)` to reliably center the checkmark tick, mirroring the indeterminate dash implementation.

## Build Verification

**Command:** `cd D:/evo/evo-ui; npm run build`

**Output tail:**
```
✓ 61 modules transformed.
...
evo-ui.css    189.49 kB │ gzip: 31.50 kB
index.es.js   210.17 kB │ gzip: 53.06 kB
index.cjs.js  143.42 kB │ gzip: 44.79 kB
✓ built in 4.53s
```

**Result:** Build succeeded with zero SCSS/TS errors. All output files regenerated.

## Self-Review Checklist

- [x] Only two `::after` rules modified (`:checked` block and `.checkmark` idle state)
- [x] `&:indeterminate` block left untouched (verified in source)
- [x] No other rules modified
- [x] Using existing tokens only (`$evo-primary-fg`, `$transition-fast`)
- [x] No new dependencies added
- [x] CSS-only change (no API/prop change)
- [x] Build clean with no errors
- [x] Exact rules match brief specification
- [x] Height change (8px → 9px) applied per spec
- [x] Centering comment included for clarity

## Concerns
None. The change is straightforward, spec-compliant, and verified by successful build.
