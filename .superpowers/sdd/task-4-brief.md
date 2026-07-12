# Task 4: EvoTopNav.Search sub-component (⌘K)

**Files:**
- Modify: `evo-ui/src/TopNav/TopNav.tsx` (new `EvoTopNavSearchProps`, `EvoTopNavSearch`, attach + displayName + type)
- Modify: `evo-ui/src/css/topnav.module.scss` (search styles + mobile icon-only)
- Build: `evo-ui` (`npm run build`)

**Interfaces:**
- Consumes: `cn`, `styles`, `forwardRef`, `useState`, `useEffect`, `useRef` (already imported at the top of TopNav.tsx).
- Produces (Tasks 5 + 7 rely on these): `EvoTopNav.Search` part; exported `EvoTopNavSearchProps`.

Read `evo-ui/src/TopNav/TopNav.tsx` and `evo-ui/src/css/topnav.module.scss` first. Locate anchors by name.

## Step 1: Declare `EvoTopNavSearchProps`

Near the other prop interfaces (right AFTER the `EvoTopNavToggleProps` interface), add:

```tsx
export interface EvoTopNavSearchProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  /** Placeholder text shown inside the trigger. @default 'Search…' */
  placeholder?: string;
  /** Opt-in global hotkey, e.g. 'mod+k' (mod = ⌘ on macOS, Ctrl elsewhere). Default: none. */
  shortcut?: string;
  /** Override the kbd hint. @default platform-aware ⌘K / Ctrl K */
  shortcutHint?: React.ReactNode;
  className?: string;
}
```

## Step 2: Add the search glyph + the Search component

After the `ChevronIcon` definition (the `const ChevronIcon = ...` block, ~line 319), add the glyph:

```tsx
const SearchGlyph = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.2-3.2" />
  </svg>
);
```

After the `EvoTopNavToggle` component definition (the `const EvoTopNavToggle = forwardRef(...)` block ends ~line 523), add the Search component:

```tsx
const EvoTopNavSearch = forwardRef<HTMLButtonElement, EvoTopNavSearchProps>(
  function EvoTopNavSearch(
    { placeholder = 'Search…', shortcut, shortcutHint, className, onClick, ...rest },
    forwardedRef,
  ) {
    const localRef = useRef<HTMLButtonElement | null>(null);
    const setRef = (node: HTMLButtonElement | null) => {
      localRef.current = node;
      if (typeof forwardedRef === 'function') forwardedRef(node);
      else if (forwardedRef)
        (forwardedRef as React.RefObject<HTMLButtonElement | null>).current = node;
    };

    // Platform-aware hint resolved after mount to avoid SSR hydration mismatch.
    const [autoHint, setAutoHint] = useState<React.ReactNode>(null);
    useEffect(() => {
      if (shortcutHint !== undefined) return;
      const platform =
        (typeof navigator !== 'undefined' &&
          (navigator.platform || navigator.userAgent)) || '';
      setAutoHint(/Mac|iPhone|iPad|iPod/.test(platform) ? '⌘K' : 'Ctrl K');
    }, [shortcutHint]);
    const hint = shortcutHint !== undefined ? shortcutHint : autoHint;

    // Opt-in global hotkey → dispatch a real click so onClick fires naturally.
    useEffect(() => {
      if (!shortcut) return;
      const parts = shortcut.toLowerCase().split('+').map((p) => p.trim());
      const wantMod = parts.some((p) => ['mod', 'cmd', 'meta', 'ctrl', 'control'].includes(p));
      const key = parts[parts.length - 1];
      const handler = (e: KeyboardEvent) => {
        const mod = e.metaKey || e.ctrlKey;
        if ((!wantMod || mod) && e.key.toLowerCase() === key) {
          e.preventDefault();
          localRef.current?.click();
        }
      };
      document.addEventListener('keydown', handler);
      return () => document.removeEventListener('keydown', handler);
    }, [shortcut]);

    return (
      <button
        ref={setRef}
        type="button"
        className={cn(styles.topNavSearch, className)}
        onClick={onClick}
        {...rest}
      >
        <span className={styles.topNavSearchIcon} aria-hidden="true">
          <SearchGlyph />
        </span>
        <span className={styles.topNavSearchText}>{placeholder}</span>
        {hint != null && <kbd className={styles.topNavSearchKbd}>{hint}</kbd>}
      </button>
    );
  },
);
```

## Step 3: Attach `Search` to the compound type

The `EvoTopNav` is exported with a type cast that lists the sub-components. Find the block:

```tsx
) as React.ForwardRefExoticComponent<
  EvoTopNavProps & React.RefAttributes<HTMLElement>
> & {
  Brand: typeof EvoTopNavBrand;
  Menu: typeof EvoTopNavMenu;
  Item: typeof EvoTopNavItem;
  Actions: typeof EvoTopNavActions;
  Toggle: typeof EvoTopNavToggle;
  Dropdown: typeof EvoTopNavDropdown;
  DropdownItem: typeof EvoTopNavDropdownItem;
};
```

Add a line inside that object type (e.g. after `Toggle`):

```tsx
  Search: typeof EvoTopNavSearch;
```

Next to the other `*.displayName = ...` lines (e.g. after `EvoTopNavToggle.displayName = 'EvoTopNav.Toggle';`), add:

```tsx
EvoTopNavSearch.displayName = 'EvoTopNav.Search';
```

Next to the other `EvoTopNav.* = ...` assignments (e.g. after `EvoTopNav.Toggle = EvoTopNavToggle;`), add:

```tsx
EvoTopNav.Search = EvoTopNavSearch;
```

## Step 4: Add search styles to the SCSS

In `evo-ui/src/css/topnav.module.scss`, after the `.topNavActions { ... }` rule (~line 160), add:

```scss
// ---------------------------------------------------------------------------
// Search trigger (EvoTopNav.Search) — presentational ⌘K affordance
// ---------------------------------------------------------------------------

.topNavSearch {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  height: 2rem;
  min-width: 12rem;
  padding: 0 0.625rem;
  font-family: inherit;
  font-size: $text-sm;
  color: $color-text-muted;
  background-color: $color-surface-sunken;
  border: 1px solid $color-border;
  border-radius: $radius-sm;
  cursor: pointer;
  transition:
    background-color $transition-fast,
    border-color $transition-fast,
    color $transition-fast;

  &:hover {
    background-color: $color-surface-hover;
    color: $color-text-secondary;
  }

  &:focus-visible {
    outline: 2px solid $evo-primary-focus;
    outline-offset: 2px;
  }
}

.topNavSearchIcon {
  display: inline-flex;
  flex-shrink: 0;
}

.topNavSearchText {
  flex: 1;
  text-align: left;
}

.topNavSearchKbd {
  flex-shrink: 0;
  font-family: inherit;
  font-size: $text-xs;
  color: $color-text-muted;
  background-color: $color-surface;
  border: 1px solid $color-border;
  border-radius: 4px;
  padding: 0.0625rem 0.3125rem;
}
```

Then, INSIDE the existing `@media (max-width: 767px) { ... }` block (the mobile drawer block), add this icon-only collapse rule:

```scss
  .topNavSearch {
    min-width: 0;
    width: 2.75rem;
    height: 2.75rem;
    justify-content: center;
    padding: 0;

    .topNavSearchText,
    .topNavSearchKbd { display: none; }
  }
```

## Step 5: Rebuild the library

Run (PowerShell tool): `cd D:/evo/evo-ui; npm run build`
Expected: build + dts succeed, no TS/SCSS errors. `EvoTopNavSearchProps` should appear in `dist/index.d.ts` (it's exported and the barrel `export *`s TopNav). Capture the output tail.

## Step 6: Commit

```
git -C D:/evo add evo-ui/src/TopNav/TopNav.tsx evo-ui/src/css/topnav.module.scss
git -C D:/evo commit -m "feat(TopNav): add EvoTopNav.Search quick-search trigger part" -m "Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```
(Stage only those two files. Never `git add -A`. Do not commit `.superpowers/` or `dist/`.)

## Notes / constraints
- Tokens only — `$text-sm`, `$text-xs`, `$color-text-muted`, `$color-text-secondary`, `$color-surface`, `$color-surface-sunken`, `$color-surface-hover`, `$color-border`, `$radius-sm`, `$transition-fast`, `$evo-primary-focus` are all defined and used elsewhere in this file/library. No raw hex (the `border-radius: 4px` and `outline` px values are sizes, not colors — fine, and match existing patterns). Do NOT edit token files.
- `type="button"` on the search button (set). Zero new deps. Non-breaking (purely additive part).
- The button must reach a ≥44px touch target on mobile — the icon-only collapse uses `2.75rem` (44px) width/height to satisfy this.
