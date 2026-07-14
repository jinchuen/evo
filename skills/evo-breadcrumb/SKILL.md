---
name: evo-breadcrumb
description: Use when building a breadcrumb trail showing the user's location in an app or site hierarchy — a row of navigational links ending in the current page, with linked ancestors and a separator between segments; covers EvoBreadcrumb and its EvoBreadcrumb.Item sub-component.
---

# EvoBreadcrumb — Evo UI

> Evo UI component skill. Master index: [[evo-ui]].

## Overview

EvoBreadcrumb renders a trail of navigational links that show where the user is within an app or site hierarchy. It is a semantic, composition-based component: you list `EvoBreadcrumb.Item` children (linked ancestors plus the current page), and the parent automatically inserts separators between them inside an accessible `<nav>` / `<ol>` structure.

## Import

```tsx
import { EvoBreadcrumb } from '@justin_evo/evo-ui';
// Import the stylesheet once at your app entry point:
// import '@justin_evo/evo-ui/dist/evo-ui.css';
```

## When to use

- Showing the user's current location within a nested hierarchy (e.g. Home › Components › Breadcrumb).
- Giving quick navigation back to ancestor pages.
- Pairing with a page header or top of a detail/settings view.

## When NOT to use

- Primary site or app navigation between top-level sections — use [[evo-nav]] or [[evo-topnav]].
- Switching between sibling views of equal weight — use [[evo-tabs]].
- Paging through a list of results — use [[evo-pagination]].
- A single-level page with no hierarchy to express.

## Quick start

```tsx
import { EvoBreadcrumb } from '@justin_evo/evo-ui';

function Example() {
  return (
    <EvoBreadcrumb>
      <EvoBreadcrumb.Item href="/">Home</EvoBreadcrumb.Item>
      <EvoBreadcrumb.Item href="/components">Components</EvoBreadcrumb.Item>
      <EvoBreadcrumb.Item current>Breadcrumb</EvoBreadcrumb.Item>
    </EvoBreadcrumb>
  );
}
```

## Props

### EvoBreadcrumb

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `children` | `React.ReactNode` | — | Yes | The `EvoBreadcrumb.Item` elements that make up the trail. |
| `separator` | `React.ReactNode` | `'/'` | No | Node rendered between each item. Can be a string or any React node. |
| `className` | `string` | — | No | Additional CSS class merged onto the root `<nav>` element. |
| `ref` | `Ref<HTMLElement>` | — | No | Forwarded to the root `<nav>` element. |
| `...rest` | `HTMLAttributes<HTMLElement>` | — | No | Any other native `<nav>` attribute is spread onto the root element. |

`EvoBreadcrumb` is wrapped in `forwardRef` and spreads `...rest` (plus merges `className`) onto the root `<nav>`, matching every other Evo UI component.

## Sub-components

### EvoBreadcrumb.Item

A single segment of the breadcrumb trail. Rendered as a list item (`<li>`). When `href` is provided and `current` is not set, it renders an anchor (`<a>`); otherwise it renders a `<span>`.

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `children` | `React.ReactNode` | — | Yes | The item label / content. |
| `href` | `string` | — | No | Link target. Rendered as an `<a href>` only when `current` is not `true`; when `current` is `true` the `href` is ignored and a non-link `<span>` is rendered. |
| `current` | `boolean` | `false` | No | Marks this item as the current page. Renders a `<span>` with `aria-current="page"` instead of a link, even if `href` is supplied. |
| `className` | `string` | — | No | Additional CSS class merged onto the `<li>`. |
| `ref` | `Ref<HTMLLIElement>` | — | No | Forwarded to the `<li>` element. |
| `...rest` | `LiHTMLAttributes<HTMLLIElement>` | — | No | Any other native `<li>` attribute is spread onto the item. |

`EvoBreadcrumb.Item` is wrapped in `forwardRef` and spreads `...rest` (plus merges `className`) onto the `<li>`, matching every other Evo UI component.

## Variants & options

This component has no `variant` / `severity` / `size` / `shape` props. Its only configurable axes are:

- `separator` (on `EvoBreadcrumb`) — any React node; defaults to `'/'`. Common alternatives: `'›'`, `'→'`, `'•'`, or a styled element.
- `current` (on `EvoBreadcrumb.Item`) — `boolean`; the last item is conventionally marked `current`.

## Examples

### Basic trail with linked ancestors

```tsx
import { EvoBreadcrumb } from '@justin_evo/evo-ui';

function BasicBreadcrumb() {
  return (
    <EvoBreadcrumb>
      <EvoBreadcrumb.Item href="/">Home</EvoBreadcrumb.Item>
      <EvoBreadcrumb.Item href="/settings">Settings</EvoBreadcrumb.Item>
      <EvoBreadcrumb.Item current>Profile</EvoBreadcrumb.Item>
    </EvoBreadcrumb>
  );
}
```

### Custom string separators

```tsx
import { EvoBreadcrumb } from '@justin_evo/evo-ui';

function ChevronBreadcrumb() {
  return (
    <EvoBreadcrumb separator="›">
      <EvoBreadcrumb.Item href="/docs">Docs</EvoBreadcrumb.Item>
      <EvoBreadcrumb.Item href="/docs/api">API</EvoBreadcrumb.Item>
      <EvoBreadcrumb.Item current>EvoButton</EvoBreadcrumb.Item>
    </EvoBreadcrumb>
  );
}
```

### Custom node separator (themed)

```tsx
import { EvoBreadcrumb } from '@justin_evo/evo-ui';

function DotSeparatorBreadcrumb() {
  return (
    <EvoBreadcrumb
      separator={<span style={{ color: 'var(--evo-color-text-muted)' }}>•</span>}
    >
      <EvoBreadcrumb.Item href="/blog">Blog</EvoBreadcrumb.Item>
      <EvoBreadcrumb.Item href="/blog/2024">2024</EvoBreadcrumb.Item>
      <EvoBreadcrumb.Item current>Article Title</EvoBreadcrumb.Item>
    </EvoBreadcrumb>
  );
}
```

## Accessibility

- The root element is a semantic `<nav>` with `aria-label="breadcrumb"`, exposing the trail as a navigation landmark to assistive technology.
- Items are rendered inside an ordered list (`<ol>`), each item as an `<li>`, conveying their sequential order.
- The item marked `current` renders a `<span>` (not a link) carrying `aria-current="page"`, so screen readers announce it as the current location and it is not focusable as a link.
- Separators are rendered as `<li>` elements with `aria-hidden="true"`, so the decorative separator is skipped by assistive technology.
- Linked items (`href` provided and not `current`) render real `<a href>` anchors and are keyboard-focusable / activatable like any link.

## Gotchas

- Setting `current` on an item overrides its `href`: even if you pass `href`, a `current` item renders as a non-link `<span>` (with `aria-current="page"`), never an anchor.
- An item with neither `href` nor `current` also renders as a plain `<span>` (no link).
- Separators are inserted automatically between items by the parent — do not add your own separator nodes between `EvoBreadcrumb.Item` children.
- Theme via Evo CSS variables (e.g. `var(--evo-color-text-muted)`) rather than hard-coded hex, so the breadcrumb stays correct in light and dark mode.
- Import the stylesheet once: `@justin_evo/evo-ui/dist/evo-ui.css`. Use named imports from `@justin_evo/evo-ui` only — never deep import paths.

## Related

- [[evo-nav]]
- [[evo-topnav]]
- [[evo-tabs]]
- [[evo-pagination]]
- [[evo-divider]]
- [[evo-theming]]
- [[evo-ui]]
