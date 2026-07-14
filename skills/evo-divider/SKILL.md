---
name: evo-divider
description: Use when separating sections of a layout with a horizontal or vertical rule, splitting stacked content, drawing a vertical separator between inline items, or showing a centered "OR"/section label between blocks; covers EvoDivider.
---

# EvoDivider — Evo UI

> Evo UI component skill. Master index: [[evo-ui]].

## Overview

EvoDivider is a lightweight visual separator that draws a horizontal or vertical rule between regions of a layout. Its core principle is to be purely presentational: it renders a themed line and, optionally, a centered text label that interrupts a horizontal rule.

## Import

```tsx
import { EvoDivider } from '@justin_evo/evo-ui'
// One-time, app-wide stylesheet import (include once, e.g. in your root):
// import '@justin_evo/evo-ui/dist/evo-ui.css'
```

## When to use

- Separating two stacked content blocks with a horizontal line.
- Placing a vertical separator between inline items (e.g. links in a row, "Left | Center | Right").
- Adding a centered label such as `OR`, `Section Two`, or `Continue` between blocks of content.
- Visually breaking up a long form or page into sections without adding semantic structure.

## When NOT to use

- You need a semantic landmark or grouping — use proper headings/sections instead; EvoDivider renders plain `<div>`s, not `<hr>` or `<section>`.
- You need a labeled vertical divider — the label is only rendered for the horizontal (label-present) layout; `orientation` is ignored when `label` is set.
- You want spacing/padding around the divider — apply margins via the parent layout or `className`; EvoDivider does not expose spacing props.

## Quick start

```tsx
import { EvoDivider } from '@justin_evo/evo-ui'

function Example() {
  return (
    <div>
      <p>Content above</p>
      <EvoDivider />
      <p>Content below</p>
    </div>
  )
}
```

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `orientation` | `'horizontal' \| 'vertical'` | `'horizontal'` | No | Direction of the divider line. Ignored when `label` is provided (the labeled layout is always horizontal). |
| `label` | `string` | `undefined` | No | Optional text centered within the divider. When set, the component renders the labeled (horizontal) layout with a line on each side of the text; `orientation` has no effect. |
| `className` | `string` | `''` | No | Additional CSS class appended to the root element's class list. |
| `...rest` | `React.HTMLAttributes<HTMLDivElement>` | — | No | All other native `div` attributes (`id`, `style`, `aria-*`, `data-*`, event handlers, …) are spread onto the root element. |

`EvoDividerProps` extends `React.HTMLAttributes<HTMLDivElement>`, and the component forwards a `ref` to its root `<div>` via `forwardRef` (`displayName: 'EvoDivider'`).

## Variants & options

`orientation` — direction of the (unlabeled) divider:

- `horizontal` — a full-width horizontal rule (the default). Use between vertically stacked content.
- `vertical` — a vertical rule. Use between inline/horizontally arranged items; place it inside a flex row with a defined height so it has room to draw.

## Examples

### Horizontal divider between stacked content

```tsx
import { EvoDivider } from '@justin_evo/evo-ui'

function Stacked() {
  return (
    <div>
      <p>Content above</p>
      <EvoDivider />
      <p>Content below</p>
    </div>
  )
}
```

### Labeled dividers

```tsx
import { EvoDivider } from '@justin_evo/evo-ui'

function Labeled() {
  return (
    <div>
      <EvoDivider label="OR" />
      <EvoDivider label="Section Two" />
      <EvoDivider label="Continue" />
    </div>
  )
}
```

### Vertical dividers between inline items

```tsx
import { EvoDivider } from '@justin_evo/evo-ui'

function Inline() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', height: 80 }}>
      <span>Left</span>
      <EvoDivider orientation="vertical" />
      <span>Center</span>
      <EvoDivider orientation="vertical" />
      <span>Right</span>
    </div>
  )
}
```

### Custom styling via className

```tsx
import { EvoDivider } from '@justin_evo/evo-ui'

// In your CSS, theme via Evo tokens — never hard-coded hex:
// .my-divider { margin-block: var(--evo-spacing-lg); }

function Spaced() {
  return (
    <section>
      <h2>Account</h2>
      <EvoDivider className="my-divider" />
      <h2>Billing</h2>
    </section>
  )
}
```

## Accessibility

- The root element carries `role="separator"`, so EvoDivider is announced to assistive technology as a separator.
- For the unlabeled variant, `aria-orientation="vertical"` is set automatically when `orientation="vertical"`; horizontal is the ARIA default so no attribute is added in that case.
- For the labeled variant, the outer `role="separator"` container gets `aria-label` from the `label` prop, and the two decorative line `<div>`s are marked `aria-hidden="true"` so only the label text is exposed to screen readers.
- The line and label colors are driven by Evo CSS variables, so the divider remains visible in both light and dark mode without any consumer configuration.
- Not focusable and has no keyboard interactions — a divider is not an interactive control.

## Gotchas

- `label` overrides `orientation`: if you pass `label`, the component always renders the horizontal labeled layout; `orientation="vertical"` is silently ignored. There is no labeled vertical divider.
- Vertical needs height: a `vertical` divider draws nothing useful unless its parent gives it height (e.g. a flex row with `align-items: center` and a set `height`). The `.vertical` style now has a `min-height: 1rem` floor so it stays visible even outside a stretching flex/grid parent, but a taller explicit height still looks better inline.
- Theme with tokens, not hex: when styling via `className`, use `var(--evo-color-*)`, `var(--evo-spacing-*)`, and `var(--evo-radius-*)`; never hard-code hex values (they break dark mode).
- Single CSS import: the divider's line/label styles come from `@justin_evo/evo-ui/dist/evo-ui.css`. Import that stylesheet once, app-wide, or the divider will render unstyled.
- Named imports only: import `EvoDivider` from `@justin_evo/evo-ui` — never from a deep/internal path.

## Related

- [[evo-stack]]
- [[evo-grid]]
- [[evo-container]]
- [[evo-theming]]
- [[evo-ui]]
