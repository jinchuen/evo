# Task 2: Fix Checkbox tick centering

**Files:**
- Modify: `evo-ui/src/css/checkbox.module.scss`
- Build: `evo-ui` (`npm run build`)

**Interfaces:** CSS only. No API/prop change; no skill change.

## Background (read the file first)
In `evo-ui/src/css/checkbox.module.scss`:
- The `.input` rule has a `&:checked + .label .checkmark { ... &::after { opacity: 1; transform: rotate(45deg) scale(1); } }` block (currently ~lines 39-47). The `::after` inside the `:checked` block currently reads:
  ```scss
      &::after {
        opacity: 1;
        transform: rotate(45deg) scale(1);
      }
  ```
- The `.checkmark` rule has its own `&::after { ... }` (the idle tick, currently ~lines 94-107) using hardcoded `top: 0px; left: 3px;`.

The tick is `position: absolute`, so the parent's flex-centering can't reach it; the hardcoded offsets leave it off-center. The indeterminate dash (in the `&:indeterminate` block) already centers correctly via `top/left: 50%` + translate. We mirror that for the checkmark.

## Step 1: Update the `:checked` tick transform

In the `.input` rule's `&:checked + .label .checkmark` block, replace its `&::after` rule with EXACTLY:

```scss
    &::after {
      opacity: 1;
      transform: translate(-50%, -60%) rotate(45deg) scale(1);
    }
```

## Step 2: Transform-center the idle tick

In the `.checkmark` rule, replace its `&::after { ... }` rule (the idle tick with `top: 0px; left: 3px;`) with EXACTLY:

```scss
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
    // Centered via translate (parent's flex-centering can't reach an absolute
    // child). -60% Y nudges the rotated "L" optically into the middle. The
    // centering translate is folded into both states so the scale stays put.
    transform: translate(-50%, -60%) rotate(45deg) scale(0.5);
    transition: opacity $transition-fast, transform $transition-fast;
  }
```

Do NOT change the `&:indeterminate` block or any other rule. Only the two `::after` rules above change.

## Step 3: Rebuild the library

Run (PowerShell tool): `cd D:/evo/evo-ui; npm run build`
Expected: build completes; `dist/evo-ui.css` regenerated, no SCSS errors. Capture the tail of the output as evidence.

## Step 4: Commit

```
git -C D:/evo add evo-ui/src/css/checkbox.module.scss
git -C D:/evo commit -m "fix(Checkbox): center the checked tick via transform" -m "Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```
(Stage only this one file. Never `git add -A`. Do not commit `.superpowers/` or `dist/`.)
