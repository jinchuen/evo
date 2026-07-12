---
name: evo-badge
description: Use when needing a small inline status label, count chip, category tag, or metadata pill — including colored severity badges, dot status indicators, and removable filter/keyword tags grouped together. Covers EvoBadge and its EvoBadge.Group sub-component.
---

# EvoBadge — Evo UI

> Evo UI component skill. Master index: [[evo-ui]].

## Overview

EvoBadge is a compact inline label for status, categories, or metadata. It composes orthogonal axes — `severity` (color theme), `variant` (visual style), and `size` — and can show an optional leading dot indicator or a remove button for tag-style use. A static `EvoBadge.Group` sub-component lays out multiple badges together.

## Import

```tsx
import { EvoBadge } from '@justin_evo/evo-ui';
// One-time stylesheet import (e.g. in your app entry):
// import '@justin_evo/evo-ui/dist/evo-ui.css';
```

## When to use

- Showing status (Active / Offline / Pending) with a color cue.
- Labeling categories, counts, or metadata next to a title or list item.
- Rendering removable tags / chips (keywords, filters, selected items).
- Pairing a small dot indicator with a short text label.

## When NOT to use

- For a full notification or message banner — use [[evo-alert]].
- For a clickable action — use [[evo-button]]; a badge is not an interactive control (only its remove button is).
- For transient app-level toasts/notifications — use [[evo-notification]].

## Quick start

```tsx
import { EvoBadge } from '@justin_evo/evo-ui';

function StatusLabel() {
  return <EvoBadge severity="success">Active</EvoBadge>;
}
```

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `children` | `React.ReactNode` | — | Yes | Badge content. |
| `severity` | `'primary' \| 'secondary' \| 'success' \| 'warning' \| 'danger' \| 'info'` | `'primary'` | No | Color theme. |
| `variant` | `'solid' \| 'outline' \| 'subtle'` | `'solid'` | No | Visual style. |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | No | Badge size. |
| `dot` | `boolean` | `false` | No | Render a dot indicator before the content. |
| `removable` | `boolean` | `false` | No | Show a remove (✕) button. |
| `onRemove` | `() => void` | — | No | Called when the remove button is clicked. |
| `detail` | `React.ReactNode` | — | No | Rich content revealed in a popover on hover / focus / tap. Descriptive (non-interactive). |
| `detailPlacement` | `'top' \| 'bottom' \| 'left' \| 'right'` | `'bottom'` | No | Preferred popover side; flips automatically when there is no room. |
| `className` | `string` | `''` | No | Additional CSS class appended to the root `<span>`. |

Note: EvoBadge forwards `ref` to the root `<span>` and spreads standard HTML attributes (`...rest`, e.g. `id`, `title`, `data-*`, `onClick`) onto it. When `detail` is set, the badge manages its own hover/focus/tap/keydown handlers and `tabIndex`, and clicking the built-in remove button does not toggle the popover.

## Sub-components

### `EvoBadge.Group`

A presentational wrapper `<div>` that lays out multiple badges together (e.g. a row of removable tags).

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `children` | `React.ReactNode` | — | Yes | The badges to group. |
| `className` | `string` | `''` | No | Additional CSS class appended to the group `<div>`. |

## Variants & options

### `severity`
- `primary` — default brand/primary color theme.
- `secondary` — muted/neutral secondary theme.
- `success` — positive/confirmed state (e.g. Active).
- `warning` — caution state.
- `danger` — error/negative state (e.g. Offline).
- `info` — informational/neutral-blue theme.

### `variant`
- `solid` — filled background (default).
- `outline` — transparent background with a colored border.
- `subtle` — soft tinted background, low emphasis.

### `size`
- `sm` — small.
- `md` — medium (default).
- `lg` — large.

## Examples

### Severities

```tsx
import { EvoBadge } from '@justin_evo/evo-ui';

function Severities() {
  return (
    <>
      <EvoBadge severity="primary">primary</EvoBadge>
      <EvoBadge severity="secondary">secondary</EvoBadge>
      <EvoBadge severity="success">success</EvoBadge>
      <EvoBadge severity="warning">warning</EvoBadge>
      <EvoBadge severity="danger">danger</EvoBadge>
      <EvoBadge severity="info">info</EvoBadge>
    </>
  );
}
```

### Variants, sizes, and dot indicator

```tsx
import { EvoBadge } from '@justin_evo/evo-ui';

function Mixed() {
  return (
    <>
      <EvoBadge variant="solid" severity="success">solid</EvoBadge>
      <EvoBadge variant="outline" severity="success">outline</EvoBadge>
      <EvoBadge variant="subtle" severity="success">subtle</EvoBadge>

      <EvoBadge size="sm">Small</EvoBadge>
      <EvoBadge size="md">Medium</EvoBadge>
      <EvoBadge size="lg">Large</EvoBadge>

      <EvoBadge severity="success" dot>Active</EvoBadge>
      <EvoBadge severity="danger" dot>Offline</EvoBadge>
    </>
  );
}
```

### Removable tags with EvoBadge.Group

```tsx
import { useState } from 'react';
import { EvoBadge } from '@justin_evo/evo-ui';

function Tags() {
  const [tags, setTags] = useState(['React', 'TypeScript', 'Vite']);

  return (
    <EvoBadge.Group>
      {tags.map((tag) => (
        <EvoBadge
          key={tag}
          severity="secondary"
          variant="outline"
          removable
          onRemove={() => setTags((t) => t.filter((x) => x !== tag))}
        >
          {tag}
        </EvoBadge>
      ))}
    </EvoBadge.Group>
  );
}
```

## Accessibility

- EvoBadge is presentational and renders a `<span>`. It carries no `role` and is not focusable on its own.
- When `removable` is true, the remove control renders as a native `<button>` with `aria-label="Remove"`, making it keyboard-focusable and operable (Enter/Space) and announced to screen readers. Clicking or activating it fires `onRemove`.
- Because the badge body is a non-interactive `<span>`, do not rely on it for click actions; provide accessible interactive controls (like the built-in remove button, or a separate [[evo-button]]) instead.
- Convey meaning with text, not color alone — `severity` only changes the color theme.

## Gotchas

- With `detail`, the badge is a focusable disclosure trigger (`tabIndex=0`, `aria-describedby` → popover) and toggles on tap for touch; it opens on hover/focus and closes on blur/`Escape`. The popover is portaled to `<body>` and flips/shifts to stay on-screen.
- `detail` is intended for descriptive, non-interactive content. Do not put focusable controls (links/buttons) inside it — the popover uses `role="tooltip"`, which is not a focus container.
- A `detail` badge stays label-sized (below the 44px touch-target guideline). It is a hover/focus-first supplementary disclosure, not a primary touch control — don't hide critical touch-only actions/info behind it.
- `onRemove` only fires when `removable` is true (the remove button is only rendered in that case). Setting `onRemove` without `removable` does nothing.
- Removing a tag is your responsibility: the component just calls `onRemove`; you must update your own state to actually drop the badge (see the tags example).
- `dot` renders a leading indicator element, not a standalone dot — it appears before `children`, so still provide a label.
- Theme via `var(--evo-color-*)`, `var(--evo-spacing-*)`, and `var(--evo-radius-*)` tokens; never hard-code hex colors (breaks light/dark mode).
- Import the CSS once globally (`@justin_evo/evo-ui/dist/evo-ui.css`); without it badges are unstyled.
- Named imports only from `@justin_evo/evo-ui` — never import from deep/internal paths.
- `EvoBadge.Group` is a static property on `EvoBadge` (use `<EvoBadge.Group>`); it is not a separate named export.

## Related

- [[evo-alert]]
- [[evo-button]]
- [[evo-notification]]
- [[evo-theming]]
- [[evo-ui]]
