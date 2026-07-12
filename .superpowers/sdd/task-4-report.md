# Task 4 Report — EvoTopNav.Search sub-component

## Status
DONE

## Commit
SHA `2eeca0e` — "feat(TopNav): add EvoTopNav.Search quick-search trigger part"

## What changed

### `evo-ui/src/TopNav/TopNav.tsx`
- **Step 1**: Added `EvoTopNavSearchProps` interface (exported) immediately after `EvoTopNavToggleProps`, extending `Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'children'>` with `placeholder`, `shortcut`, `shortcutHint`, and `className`.
- **Step 2**: Added `SearchGlyph` inline SVG component after `ChevronIcon`. Added `EvoTopNavSearch` forwardRef component after `EvoTopNavToggle`. Implements: manual `setRef` for dual-ref forwarding, platform-aware `autoHint` resolved after mount (SSR-safe), opt-in global hotkey listener with cleanup, `type="button"`, three child spans (icon / text / kbd).
- **Step 3**: Added `Search: typeof EvoTopNavSearch` to the compound type cast object, `EvoTopNavSearch.displayName = 'EvoTopNav.Search'`, and `EvoTopNav.Search = EvoTopNavSearch`.

### `evo-ui/src/css/topnav.module.scss`
- **Step 4**: Added `.topNavSearch`, `.topNavSearchIcon`, `.topNavSearchText`, `.topNavSearchKbd` rules after `.topNavActions`, all using SCSS tokens (no raw hex). Added mobile icon-only collapse block inside `@media (max-width: 767px)` — collapses to `2.75rem × 2.75rem` (44px touch target), hides text and kbd badge.

## Build
Command: `cd D:/evo/evo-ui; npm run build`

Output tail:
```
✓ 61 modules transformed.
[vite:dts] Declaration files built in 2817ms.
../dist/evo-ui.css    193.79 kB │ gzip: 32.06 kB
../dist/index.cjs.js  146.28 kB │ gzip: 45.64 kB
✓ built in 4.07s
```

No TS errors, no SCSS errors. The `[vite:dts] Outside emitted` message is an informational notice from vite-plugin-dts about the demo/dist path, not an error.

## dist/index.d.ts check
`dist/index.d.ts` re-exports via `export * from './TopNav/TopNav'`.
`dist/TopNav/TopNav.d.ts` line 46: `export interface EvoTopNavSearchProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'children'> { ... }`
`dist/TopNav/TopNav.d.ts` line 82: `declare const EvoTopNavSearch: React.ForwardRefExoticComponent<EvoTopNavSearchProps & React.RefAttributes<HTMLButtonElement>>;`
**PASS** — `EvoTopNavSearchProps` is accessible via `dist/index.d.ts`.

## Files changed
- `evo-ui/src/TopNav/TopNav.tsx` (+147 lines)
- `evo-ui/src/css/topnav.module.scss` (+13 lines in media block, +53 lines main styles)
- Total: 2 files, 160 insertions, 0 deletions

## Self-review
- [x] `EvoTopNav.Search` attached on the compound type and at runtime
- [x] `Search: typeof EvoTopNavSearch` in the type cast object
- [x] `displayName = 'EvoTopNav.Search'` set
- [x] Ref-forwarding via `setRef` handles both function refs and object refs
- [x] Global hotkey listener added only when `shortcut` is truthy; cleaned up via returned function from `useEffect`
- [x] `autoHint` resolved after mount via `useEffect` (SSR hydration safe); skipped when `shortcutHint` is explicitly provided
- [x] `type="button"` present on the button element
- [x] Only two files staged/changed; `.superpowers/` and `dist/` untouched
- [x] Build clean (no TS/SCSS errors)
- [x] No raw hex colors — all tokens: `$text-sm`, `$text-xs`, `$color-text-muted`, `$color-text-secondary`, `$color-surface`, `$color-surface-sunken`, `$color-surface-hover`, `$color-border`, `$radius-sm`, `$transition-fast`, `$evo-primary-focus`
- [x] Mobile touch target: `2.75rem × 2.75rem` = 44px, satisfies WCAG

## Concerns
None. The `[vite:dts] Outside emitted: demo/dist/index.d.ts` message was present before this task (pre-existing vite-plugin-dts behavior for the demo sub-project) and is not an error — the actual `dist/TopNav/TopNav.d.ts` is correctly emitted and the type is exported.

## Fix pass (review finding: type override)

**What was fixed:** In `EvoTopNavSearch` component's `<button>`, the `type="button"` attribute was positioned before `{...rest}`. This allowed a consumer to override `type` via rest props, creating a form-submit footgun. Reordered the attributes so `type="button"` comes **after** `{...rest}`, making it un-overridable.

**Edit applied:**
```tsx
// Before:
<button
  ref={setRef}
  type="button"               // ← overridable by {...rest}
  className={cn(...)}
  onClick={onClick}
  {...rest}
>

// After:
<button
  ref={setRef}
  className={cn(...)}
  onClick={onClick}
  {...rest}
  type="button"               // ← now un-overridable
>
```

**Build command:** `cd D:/evo/evo-ui; npm run build`

**Build output tail:**
```
[vite:dts] Declaration files built in 2701ms.
../dist/evo-ui.css    193.79 kB │ gzip: 32.06 kB
../dist/index.cjs.js  146.28 kB │ gzip: 45.64 kB
✓ built in 3.83s
```

**Commit:** SHA `51443b8` — "fix(TopNav): make EvoTopNav.Search type=button un-overridable by rest props"
