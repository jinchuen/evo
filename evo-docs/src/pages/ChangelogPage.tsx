import { EvoBadge, EvoStack } from '@justin_evo/evo-ui'

// Evo UI is still pre-release — nothing has shipped to consumers yet, so every
// change rolls up into a single in-progress v1.0.0 entry under a "Created"
// section. Once the library actually publishes its first release, switch this
// type back to the four-kind format ('Added' | 'Changed' | 'Fixed' | 'Breaking')
// and start a new dated entry per version. See INFO.md §3 for the post-launch
// format.
type ChangeKind = 'Created' | 'Added' | 'Changed' | 'Fixed' | 'Breaking'

type ReleaseSection = { kind: ChangeKind; items: string[] }

type Release = {
  version: string
  date: string
  summary?: string
  sections: ReleaseSection[]
  migration?: string
}

const SEVERITY: Record<ChangeKind, 'success' | 'info' | 'warning' | 'danger'> = {
  Created:  'success',
  Added:    'success',
  Changed:  'info',
  Fixed:    'warning',
  Breaking: 'danger',
}

const RELEASES: Release[] = [
  {
    version: '1.0.0',
    date: '2026-05-25',
    summary:
      'Evo UI is in active pre-release development. Everything built so far is rolled up here. Once we publish, this entry will be finalised and a new release will start above it.',
    sections: [
      {
        kind: 'Added',
        items: [
          'EvoSelect — multi-select support via a new `multiple` prop. Switches `value` / `defaultValue` / `onChange` from `string` to `string[]` through a discriminated union, so TypeScript catches the shape mismatch at compile time. The menu now keeps an inline checkbox in front of each option (only in multi mode — single mode keeps the right-aligned ✓), and stays open after each click so picking several feels natural (matches Notion/Linear/GitHub). Two trigger displays: `multipleDisplay="chips"` (default) renders each selection as a removable pill with its own ✕, while `multipleDisplay="count"` shows the first label plus a `+N more` hint for dense layouts. `maxSelections` caps the picks and greys out remaining options once the limit is hit; `showSelectAll` adds Select-all / Clear-all buttons (plus a `N / max` counter when `maxSelections` is set) at the top of the menu. Existing single-select usages are unchanged. `clearable` now empties to `[]` in multi mode. When `name` is set, the component emits one hidden `<input>` per selected value for HTML form submission. `aria-multiselectable` is wired on both the trigger combobox and the listbox.',
          'EvoAutoComplete — a new editable combobox with list autocomplete, built on the WAI-ARIA combobox pattern (DOM focus stays on the `<input role="combobox">`; the active option is tracked with `aria-activedescendant`; full ↑/↓/Home/End/Enter/Esc/Tab keyboard model). Independent controlled `value` and `inputValue` make async fetching a clean fit — drive `options` yourself from `onInputChange`, pass `filter={false}` so results render verbatim, toggle `loading`, and throttle with `debounce`. Also supports rich options (icon + description), matched-substring highlighting, `minChars`, `maxResults` row capping, `renderOption`, sizes, error/disabled/fullWidth, and a clearable input. Ships two capabilities no surveyed library (MUI, react-select, Downshift, Mantine, Ant Design, Headless UI, Ark UI, Chakra, react-autosuggest, GOV.UK accessible-autocomplete) provides out of the box: (1) `smartRecovery` — when a query returns zero results, the nearest option is computed by Levenshtein edit distance and offered as a one-click "did you mean…?" correction instead of a dead-end empty state; (2) `recents` — built-in recent-selection memory surfaced on empty focus, through a pluggable `RecentsStorage` adapter (in-memory by default; the exported, SSR-safe `evoLocalRecents(key)` persists to localStorage). Zero new runtime dependencies — edit-distance, debounce, and storage are all hand-rolled. Token-driven styles (`var(--evo-*)`), so light/dark and 44px touch targets work automatically.',
          'EvoNotification — fixed the toast stack rendering upside-down. Stacked toasts now grow *from* the anchored edge: at a top-* anchor the newest toast sits flush at the top with older cards receding downward behind it, and at a bottom-* anchor the newest sits at the bottom receding upward — previously the newest, foremost card landed at the far end of the stack regardless of anchor (e.g. at the default `top-right` it appeared at the bottom with faded cards peeking above it). Two reversed pieces caused it: the per-anchor `flex-direction` was swapped (top anchors used the natural `column`, bottom anchors `column-reverse`) and the depth offset in `ToastRow` leaned older cards toward the anchored edge instead of away from it. The offset direction now also reads the toaster\'s effective anchor, so toasts created without a per-toast `anchor` (inheriting `Provider`\'s `defaultAnchor`) stack the correct way too. CSS/layout-only fix — no public API change.',
          'EvoRichTextArea — pressing Enter inside a code block or blockquote (`code` / `quote` tools) now exits to a fresh plain paragraph instead of extending the `<pre>`/`<blockquote>`. Previously a new line stayed inside the same element, so it inherited the block styling and toggling that line off cleared the whole block at once. `Shift+Enter` still inserts a soft line break for intentionally multi-line code or multi-paragraph quotes.',
          'EvoRichTextArea — block-format tools (`h1`, `h2`, `h3`, `quote`, `code`, `paragraph`) now toggle off correctly. They were built on `document.execCommand("formatBlock", …)`, which can apply a block but cannot remove one — Blink nests a `<p>` *inside* the `<blockquote>`/`<pre>` rather than unwrapping it, so the toolbar button flipped to inactive yet the wrapper element (and its CSS) stayed. Clicking an active block tool (or `paragraph`) now unwraps the `<blockquote>`/`<pre>`/heading around the caret directly in the DOM and restores a plain paragraph, preserving the caret with a marker node. Active-state detection is DOM-based too, so the toolbar highlight always matches what a click will do.',
          'EvoNotification — a unified, global notification system covering both transient toasts and a persistent notification center. Module-level singleton (`evoNotify`) lets any file call `evoNotify.toast.success(...)`, `evoNotify.toast.promise(p, msgs)`, or `evoNotify.push({ title, description, ... })` without a hook or React context — works from event handlers, async functions, even outside the React tree (e.g. WebSocket `onmessage`). Five sub-components compose: `EvoNotification.Provider` (mount once at the app root), `EvoNotification.Toaster` (renders portaled toasts), `EvoNotification.Bell` (drop anywhere; reads unread count from the global store), `EvoNotification.Panel` (the dropdown list), `EvoNotification.Item` (single row). Six anchors (`top-left` / `top-center` / `top-right` / `bottom-left` / `bottom-center` / `bottom-right`), per-toast anchor override, configurable `maxVisible` with overflow folded into a "+N more" pill, hand-rolled enter/exit animations with full `prefers-reduced-motion` support. Accessibility model borrowed from Radix Toast — errors use `aria-live="assertive"`, everything else `polite`; timers pause on hover, on focus, and on window blur (configurable). Notification Center supports read/unread state, "mark all read", relative timestamps that auto-tick, avatar or severity icon, per-item click handler + action button, and three slot states (empty / loading / error). Toast and Inbox share one store, so a single call can `{ toast: true, inbox: true }` both flash and accumulate. External-data mode (`<EvoNotification.Provider inboxItems={...} onInboxChange={...}>`) lets consumers hand their own store to the Provider. Zero new dependencies — animation, portal, id generation, timer queue, FLIP-style stacking all hand-rolled.',
          'Removed legacy EvoToast (`EvoToastProvider` / `useToast`) — replaced by EvoNotification. Migration: `<EvoToastProvider>` → `<EvoNotification.Provider>` + `<EvoNotification.Toaster />`; `const { toast } = useToast(); toast(msg, "success")` → `import { evoNotify } from "@justin_evo/evo-ui"; evoNotify.toast.success(msg)`.',
          'EvoTopNav redesign — replaced the flat horizontal-only layout with a compose-based API (`EvoTopNav.Brand` / `Menu` / `Item` / `Actions`, plus new `Toggle` / `Dropdown` / `DropdownItem` sub-components). `Item` is now polymorphic (`href` → `<a>`, `onClick` → `<button>`, or `asChild` to clone a router `<Link>`). New mobile drawer with controlled (`open` / `onOpenChange`) and uncontrolled (`defaultOpen`) state, body scroll lock, focus trap, Esc-to-close, and focus restoration. `Dropdown` opens on hover (fine-pointer devices only) and click, with full `↓` / `↑` / `Home` / `End` / `Esc` keyboard navigation. `active` now sets `aria-current="page"` automatically; the root forwards `aria-label`; the toggle wires `aria-expanded` + `aria-controls`. Drawer reuses the EvoModal backdrop and animation tokens — no new design tokens added. `Item.onClick` signature widened from `() => void` to `(e: React.MouseEvent) => void` (existing call sites continue to work). Without a registered `Toggle`, the menu degrades to horizontal scroll on narrow screens instead of disappearing.',
          'EvoNav redesign — replaced the `items: NavSubItem[]` prop with a unified compose-based API (`EvoNav` / `EvoNav.Group` / `EvoNav.Item` / `EvoNav.SubItem` / `EvoNav.Skeleton` / `EvoNav.QuickAction`); nesting is now always children, recursively (Items contain SubItems, SubItems can contain more SubItems). Disclosure state is controlled (`open` + `onOpenChange`) or uncontrolled (`defaultOpen`). New `href` prop renders rows as `<a>` instead of `<button>` so right-click / middle-click / drag work natively. Full keyboard model: ↑/↓ move focus, →/← expand/collapse, Home/End jump, Enter/Space activate. ARIA wired correctly — `<nav role="navigation">` landmark, `aria-current="page"` on active rows, `aria-expanded` + `aria-controls` on disclosure rows, nested `<ul role="group" aria-labelledby>`. Responsive: below `breakpoint` (default 768 px) the nav collapses to an off-canvas drawer with a built-in hamburger trigger, body-scroll lock, Escape-to-close, and reduced-motion support; `hideTrigger` + `drawerOpen` / `onDrawerOpenChange` lift the trigger out for top-bar integration. All visuals reuse existing tokens — no new colours, no hard-coded hex, dark mode works automatically. Removed the public `NavSubItem` type and the `items` prop on `EvoNav.Item`.',
          'EvoCard redesign — replaced the old themed variants (normal / playable / glass / neon / holo / pulse / tilt) with a compose-based API (`EvoCard.Root` / `Header` / `Title` / `Description` / `Body` / `Footer` / `Media`) and three structural variants (`elevated` / `outlined` / `ghost`). New `orientation` axis (`vertical` / `horizontal` / `responsive`) stacks media + content under 768 px and splits side-by-side above it. New `interactive` prop renders the root as a real `<button>` or `<a>` (via `href`), with focus ring, 44 px minimum touch target, and `prefers-reduced-motion` support. `EvoCard.Title` takes `as` (`h2`–`h6`) for correct document outline. All colour and shadow comes from semantic theme tokens — dark mode works automatically. Removed the per-card `color` prop and the `EvoCard.Front` / `EvoCard.Back` flip slots.',
          'EvoButton redesign — added `iconLeft` / `iconRight` slots, a built-in `loading` state with `loadingText` and a CSS-only spinner, `fullWidth`, an orthogonal `shape` prop (`default` | `rounded` | `square`), a `soft` variant, ref forwarding, and pass-through of every native `<button>` attribute (form, name, autoFocus, aria-*, onMouseEnter, …).',
          'EvoButton now defaults `type` to `"button"` so dropping it inside a `<form>` no longer accidentally submits.',
          'EvoButton sizes use `min-height` (lg = 44px WCAG touch target) and `rem`-based padding, so buttons stay tappable and proportional on mobile without bespoke media queries.',
          '`shape="rounded"` replaces the previous `variant="rounded"` so radius is now orthogonal to the visual variant (rounded + ghost, rounded + danger, etc. all compose).',
          'Forms: EvoButton, EvoInput, EvoCheckbox, EvoRadio, EvoSelect, EvoTreeSelect, EvoToggle, EvoForm.',
          'EvoRichTextArea with pluggable toolbar, paste/drop/file image upload, and a typed imperative ref.',
          'Layout: EvoStack, EvoGrid, EvoContainer, EvoDivider.',
          'Navigation: EvoNav, EvoTopNav, EvoBreadcrumb, EvoTabs, EvoPagination, EvoCommandPalette.',
          'Data Display: EvoCard, EvoTable, EvoBadge, EvoSkeleton.',
          'Feedback: EvoAlert, EvoModal, EvoTooltip, EvoNotification.',
          'Media: EvoImageCropper with circular / aspect-ratio crops and Blob / DataURL / Canvas export.',
          'Theming: light + dark CSS-variable tokens, EvoThemeProvider, EvoThemeToggle.',
          'Utilities: spacing, flex, grid, typography, and color helpers (see /utilities).',
          'Docs site at evo-docs: 28 component pages, Theming, Utilities, Changelog, and a Build-with-AI prompt.',
          'Shared docs CSS utilities — .docs-section-desc, .docs-list, .docs-next-steps, .docs-readout, .docs-kbd-list, .docs-util-label — so every page reads from the same theme tokens (no hard-coded slate hex anywhere).',
          'Sidebar follows "one row = one component"; sub-pages (Tools, Image Upload, API references) live under their parent and are reached via in-page Next Steps + a back pill at the top of every sub-page.',
        ],
      },
    ],
  },
]

export default function ChangelogPage() {
  return (
    <div>
      <div className="docs-page-header">
        <div className="docs-page-tag">Releases</div>
        <h1 className="docs-page-title">Changelog</h1>
        <p className="docs-page-desc">
          Tracks every change to <strong>@justin_evo/evo-ui</strong>. Evo UI is still
          in active pre-release development, so everything currently rolls up under
          a single in-progress v1.0.0 entry with a <strong>Created</strong> label.
        </p>
      </div>

      <div className="docs-section">
        <div className="docs-section-title">Release format</div>
        <p className="docs-page-desc">
          <strong>Right now (pre-launch):</strong> append every new piece of work to the{' '}
          <code>Created</code> section of the v1.0.0 entry — no new release blocks yet.
        </p>
        <EvoStack direction="row" gap="0.5rem" wrap>
          <EvoBadge severity="success" variant="subtle">Created</EvoBadge>
        </EvoStack>
        <p className="docs-page-desc" style={{ marginTop: '1.25rem' }}>
          <strong>After v1.0.0 publishes:</strong> finalise the entry, then prepend new
          versions above it using these four kinds. <code>Breaking</code> entries must
          also fill in <code>migration</code> with a short upgrade guide.
        </p>
        <EvoStack direction="row" gap="0.5rem" wrap>
          <EvoBadge severity="success" variant="subtle">Added</EvoBadge>
          <EvoBadge severity="info"    variant="subtle">Changed</EvoBadge>
          <EvoBadge severity="warning" variant="subtle">Fixed</EvoBadge>
          <EvoBadge severity="danger"  variant="subtle">Breaking</EvoBadge>
        </EvoStack>
      </div>

      <div className="docs-changelog">
        {RELEASES.map((release) => (
          <article key={release.version} className="docs-changelog-entry">
            <header className="docs-changelog-head">
              <h2 className="docs-changelog-version">v{release.version}</h2>
              <span className="docs-changelog-date">{release.date}</span>
            </header>
            {release.summary && (
              <p className="docs-changelog-summary">{release.summary}</p>
            )}
            {release.sections.map((section) => (
              <div key={section.kind} className="docs-changelog-section">
                <EvoBadge severity={SEVERITY[section.kind]} variant="subtle">
                  {section.kind}
                </EvoBadge>
                <ul className="docs-changelog-list">
                  {section.items.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
            {release.migration && (
              <div className="docs-changelog-migration">
                <strong>Migration:</strong> {release.migration}
              </div>
            )}
          </article>
        ))}
      </div>
    </div>
  )
}
