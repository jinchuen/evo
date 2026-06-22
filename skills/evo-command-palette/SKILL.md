---
name: evo-command-palette
description: Use when you need a keyboard-driven command launcher / command-K menu — a Cmd+K / Ctrl+K overlay with fuzzy search over actions, grouped items, per-item shortcut hints, and arrow-key navigation (like VS Code, Linear, or browser command bars). Covers EvoCommandPalette and the CommandPaletteItem type.
---

# EvoCommandPalette — Evo UI

> Evo UI component skill. Master index: [[evo-ui]].

## Overview

EvoCommandPalette is a keyboard-driven command launcher: a centered overlay that opens with Cmd+K (Mac) / Ctrl+K (Windows/Linux), fuzzy-filters a flat list of actions as you type, groups them under headings, and runs the selected action's callback. Its core design principle is "find the thing, then do it" as a single keyboard-first intent — it renders nothing in the DOM until invoked.

## Import

```tsx
import { EvoCommandPalette, type CommandPaletteItem } from '@justin_evo/evo-ui';
// One-time, anywhere in your app entry: import '@justin_evo/evo-ui/dist/evo-ui.css';
```

## When to use

- Power-user shortcuts — let users jump anywhere in the app without leaving the keyboard.
- Long action menus — bigger than a context menu but smaller than a full settings page.
- Search + execute — when "find the thing, then do it" is a single user intent (browsers, IDEs, Linear).

## When NOT to use

- A simple click-triggered dropdown of a few options — use a menu or [[evo-select]] instead.
- A form field with suggestions as you type — use [[evo-autocomplete]].
- A blocking confirmation or content overlay — use [[evo-modal]].
- Wiring real global hotkeys per action — `shortcut` is display-only; you must register actual key handlers yourself.

## Quick start

```tsx
import { EvoCommandPalette, type CommandPaletteItem } from '@justin_evo/evo-ui';

const items: CommandPaletteItem[] = [
  { label: 'New file', group: 'File', shortcut: ['⌘', 'N'], onSelect: () => createFile() },
  { label: 'Save',     group: 'File', shortcut: ['⌘', 'S'], onSelect: () => save() },
  { label: 'Toggle theme', group: 'View', onSelect: () => toggleTheme() },
];

// Drop it anywhere — Ctrl+K / ⌘K toggles it open automatically (uncontrolled).
<EvoCommandPalette items={items} />
```

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `items` | `CommandPaletteItem[]` | — | Yes | The actions to display. Re-render with a new array to change them on the fly. |
| `placeholder` | `string` | `'Search commands…'` | No | Search input placeholder text. |
| `open` | `boolean` | `undefined` | No | Controlled open state. Omit for uncontrolled mode (Ctrl+K / ⌘K toggles it internally). When provided, the component is controlled and Ctrl+K no longer toggles it — you must drive `open` yourself. |
| `onClose` | `() => void` | `undefined` | No | Called when the user dismisses the palette (Escape, overlay click, or item selection). |

Note: `EvoCommandPalette` is a function component that does NOT forward `ref`, `className`, or `...rest`. Its public API is exactly the four props above; the root overlay/palette markup and classNames are managed internally.

## Sub-components

EvoCommandPalette has no compound sub-components. Its items are configured through the exported `CommandPaletteItem` object type, passed via the `items` prop.

### CommandPaletteItem

A plain object describing one selectable action. Exported as a named type alongside the component.

| Field | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `label` | `string` | — | Yes | Primary text for the result. The fuzzy search indexes this. |
| `description` | `string` | `undefined` | No | Secondary line shown below the label. Also indexed by the fuzzy search. |
| `group` | `string` | `'Actions'` (when omitted) | No | Heading the item is bucketed under. Items without a `group` fall into the `'Actions'` bucket. Group text is also searched. |
| `icon` | `React.ReactNode` | `undefined` | No | Optional icon rendered before the label. |
| `shortcut` | `string[]` | `undefined` | No | Keys displayed on the right as `<kbd>` badges (e.g. `['⌘','K']`). Display-only — wire the actual hotkey yourself. |
| `onSelect` | `() => void` | — | Yes | Called when the item is activated by click or Enter. The palette closes immediately after. |

## Variants & options

EvoCommandPalette has no union-typed style props (no `variant` / `severity` / `size` / `shape`). It has one behavioral mode toggle determined by the `open` prop:

- Uncontrolled (recommended) — omit `open`. The component owns its open state; Ctrl+K / ⌘K toggles it, Escape / overlay click / selection closes it. `onClose` still fires on dismissal.
- Controlled — pass `open={boolean}`. You own the state and must toggle it (e.g. from a button). In this mode Ctrl+K / ⌘K does NOT toggle the palette; only Escape, overlay click, and selection call `onClose` so you can set `open` to false.

## Examples

### 1. Uncontrolled with groups and shortcuts

```tsx
import { EvoCommandPalette, type CommandPaletteItem } from '@justin_evo/evo-ui';

function AppPalette() {
  const items: CommandPaletteItem[] = [
    { label: 'New file', description: 'Create a blank document', group: 'File', shortcut: ['⌘', 'N'], onSelect: () => createFile() },
    { label: 'Open recent…', description: 'Pick from the last 10 files', group: 'File', onSelect: () => openRecent() },
    { label: 'Save', group: 'File', shortcut: ['⌘', 'S'], onSelect: () => save() },
    { label: 'Toggle theme', description: 'Switch between light and dark', group: 'View', onSelect: () => toggleTheme() },
    { label: 'Go to settings', group: 'Navigation', shortcut: ['⌘', ','], onSelect: () => goToSettings() },
  ];

  // Press Ctrl+K / ⌘K anywhere on the page to open it.
  return <EvoCommandPalette items={items} />;
}
```

### 2. Controlled, opened from a custom trigger button

```tsx
import { useState } from 'react';
import { EvoCommandPalette, EvoButton, type CommandPaletteItem } from '@justin_evo/evo-ui';

function ControlledPalette() {
  const [open, setOpen] = useState(false);

  const items: CommandPaletteItem[] = [
    { label: 'Profile', group: 'Account', onSelect: () => goProfile() },
    { label: 'Sign out', group: 'Account', onSelect: () => signOut() },
  ];

  return (
    <>
      <EvoButton label="Open palette" onClick={() => setOpen(true)} />
      <EvoCommandPalette
        items={items}
        open={open}
        onClose={() => setOpen(false)}
        placeholder="Search commands…"
      />
    </>
  );
}
```

### 3. Items with icons and a custom placeholder

```tsx
import { EvoCommandPalette, type CommandPaletteItem } from '@justin_evo/evo-ui';

const items: CommandPaletteItem[] = [
  {
    label: 'Search docs',
    description: 'Find anything in the knowledge base',
    group: 'Help',
    icon: <span aria-hidden style={{ color: 'var(--evo-color-primary)' }}>?</span>,
    onSelect: () => openDocsSearch(),
  },
  {
    label: 'Invite teammate',
    group: 'Team',
    icon: <span aria-hidden>＋</span>,
    onSelect: () => openInvite(),
  },
];

<EvoCommandPalette items={items} placeholder="Type a command or search…" />
```

## Accessibility

- Overlay root renders with `role="dialog"` and `aria-modal="true"`.
- The search `<input>` carries `aria-label="Command search"`.
- Focus management: when the palette opens it clears the query, resets the active item to the first result, and focuses the search input automatically (after a ~30ms mount delay).
- Keyboard interactions:
  - Ctrl+K / ⌘K (Cmd) — toggles the palette open/closed in uncontrolled mode (a global `document` keydown listener; `preventDefault` is called). In controlled mode this listener does not toggle `open`.
  - Escape — closes the palette when open (global listener).
  - ArrowDown / ArrowUp — move the active result (clamped to the list bounds); the active row is scrolled into view with `block: 'nearest'`.
  - Enter — runs the active item's `onSelect`, then closes.
  - Typing — fuzzy-filters items by `label`, `description`, or `group` (case-insensitive substring match).
- Mouse: hovering a result sets it active (`onMouseEnter`); clicking a result runs its `onSelect` and closes; clicking the dimmed overlay (outside the palette) closes it.
- Results are real `<button>` elements; group headings and footer hints render `<kbd>` badges for key labels. An empty filtered list shows a "No results" message.

## Gotchas

- `shortcut` is display-only. It renders key badges next to the item but does NOT register a global hotkey — you must wire real key handlers in your own app code if you want those combos to work outside the palette.
- Controlled mode disables Ctrl+K / ⌘K toggling. Once you pass `open`, the built-in Ctrl+K toggle stops opening the palette; provide your own trigger (button or hotkey) that sets `open`.
- The component renders `null` when closed — nothing is in the DOM until it is open, so don't rely on querying its markup ahead of time.
- Items without a `group` are bucketed under the literal heading `'Actions'`.
- `onClose` fires on every dismissal path (Escape, overlay click, AND item selection), so it is called even when the user successfully picks an action — keep its handler idempotent.
- It does not forward `ref` / `className` / `...rest`; you cannot style or target the root via those. Theme it through Evo CSS variables (`var(--evo-color-*)`, `var(--evo-spacing-*)`, `var(--evo-radius-*)`) — never hard-coded hex.
- The Ctrl+K and Escape listeners are attached to `document`, so they are global while the component is mounted; mounting multiple palettes will register multiple listeners.
- Single CSS import: include `@justin_evo/evo-ui/dist/evo-ui.css` once. Use named imports from `@justin_evo/evo-ui` only — never deep paths.

## Related

- [[evo-modal]] — for blocking dialogs and content overlays (this is a command launcher, not a generic modal).
- [[evo-autocomplete]] — for an inline search-as-you-type input field.
- [[evo-select]] — for picking one value from a constrained list.
- [[evo-button]] — common trigger for controlled mode.
- [[evo-nav]] — broader app navigation patterns.
- [[evo-theming]] — CSS variable tokens used to theme the palette.
- [[evo-ui]] — master component index.
