---
name: evo-stack
description: Use when arranging elements in a vertical or horizontal flex row/column with a consistent gap, alignment, and justification — stacking form fields, button rows, card content, toolbars, or any one-dimensional layout; covers the EvoStack layout primitive.
---

# EvoStack — Evo UI

> Evo UI component skill. Master index: [[evo-ui]].

## Overview

EvoStack is a thin flexbox layout primitive that lays its children out in a single row or column with a configurable gap, cross-axis alignment, main-axis justification, and optional wrapping. It is purely presentational: it renders one `<div>` with `display: flex` and translates its props into flex CSS so you do not have to hand-write flex declarations.

## Import

```tsx
import { EvoStack } from '@justin_evo/evo-ui';
// One-time global stylesheet import (e.g. in your app entry):
// import '@justin_evo/evo-ui/dist/evo-ui.css';
```

## When to use

- Stacking elements vertically (a column of form fields, list items, or sections).
- Laying out elements horizontally (a button row, a toolbar, an inline group).
- You want consistent spacing between siblings via a single `gap` prop instead of per-child margins.
- You need quick control over `align-items` / `justify-content` without writing a flex container by hand.
- You want a group that can wrap to multiple lines (`wrap`).

## When NOT to use

- You need a two-dimensional layout with rows and columns — use [[evo-grid]] instead.
- You need page-level max-width / horizontal centering / padding — use [[evo-container]].
- You need a visual separator line between items — use [[evo-divider]] (EvoStack only controls spacing, not separators).
- You need ref forwarding or arbitrary native DOM attributes/event handlers on the root — EvoStack only accepts the documented props (see Gotchas).

## Quick start

```tsx
import { EvoStack } from '@justin_evo/evo-ui';

function Example() {
  return (
    <EvoStack gap="0.75rem">
      <div>Item 1</div>
      <div>Item 2</div>
      <div>Item 3</div>
    </EvoStack>
  );
}
```

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `children` | `React.ReactNode` | — | Yes | The elements to stack. |
| `direction` | `'row' \| 'column'` | `'column'` | No | Flex direction (main axis). `'column'` stacks vertically, `'row'` stacks horizontally. |
| `gap` | `number \| string` | `'1rem'` | No | Gap between items. A `number` is treated as pixels (e.g. `16` → `16px`); a `string` is used as-is as any CSS length (e.g. `'0.75rem'`, `'2%'`). |
| `align` | `'start' \| 'center' \| 'end' \| 'stretch' \| 'baseline'` | `'stretch'` | No | Cross-axis alignment, mapped to `align-items`. |
| `justify` | `'start' \| 'center' \| 'end' \| 'between' \| 'around' \| 'evenly'` | `'start'` | No | Main-axis distribution, mapped to `justify-content`. |
| `wrap` | `boolean` | `false` | No | When `true` sets `flex-wrap: wrap`; otherwise `flex-wrap: nowrap`. |
| `className` | `string` | `''` | No | Additional CSS class applied to the root `<div>`. |
| `style` | `CSSProperties` | — | No | Inline styles merged onto the root `<div>` (spread after the computed flex styles, so it can override them). |

EvoStack renders a single `<div>`. It applies only `className` and `style` to that element — it does **not** forward `ref` and does **not** spread other native `...rest` attributes (see Gotchas).

## Variants & options

### `direction`
- `column` — (default) stacks children top-to-bottom (`flex-direction: column`).
- `row` — stacks children left-to-right (`flex-direction: row`).

### `align` (maps to `align-items`)
- `start` — align children to the cross-axis start (`flex-start`).
- `center` — center children on the cross axis (`center`).
- `end` — align children to the cross-axis end (`flex-end`).
- `stretch` — (default) stretch children to fill the cross axis (`stretch`).
- `baseline` — align children on their text baseline (`baseline`).

### `justify` (maps to `justify-content`)
- `start` — (default) pack children at the main-axis start (`flex-start`).
- `center` — center children on the main axis (`center`).
- `end` — pack children at the main-axis end (`flex-end`).
- `between` — equal space between children, none at the ends (`space-between`).
- `around` — equal space around each child (`space-around`).
- `evenly` — equal space between and at the ends (`space-evenly`).

### `wrap`
- `false` — (default) children stay on one line (`flex-wrap: nowrap`).
- `true` — children wrap onto multiple lines (`flex-wrap: wrap`).

## Examples

### Vertical column with custom gap

```tsx
import { EvoStack } from '@justin_evo/evo-ui';

function FieldColumn() {
  return (
    <EvoStack direction="column" gap="0.75rem">
      <div>Item 1</div>
      <div>Item 2</div>
      <div>Item 3</div>
    </EvoStack>
  );
}
```

### Horizontal button row, right-aligned

```tsx
import { EvoStack, EvoButton } from '@justin_evo/evo-ui';

function FormActions() {
  return (
    <EvoStack direction="row" justify="end" align="center" gap="0.5rem">
      <EvoButton variant="ghost">Cancel</EvoButton>
      <EvoButton variant="solid">Save</EvoButton>
    </EvoStack>
  );
}
```

### Spread-apart toolbar with numeric (pixel) gap

```tsx
import { EvoStack } from '@justin_evo/evo-ui';

function Toolbar() {
  return (
    <EvoStack
      direction="row"
      justify="between"
      align="center"
      gap={16}
      style={{
        width: '100%',
        padding: '0.5rem',
        background: 'var(--evo-color-surface)',
        borderRadius: 'var(--evo-radius-md)',
      }}
    >
      <div>Left</div>
      <div>Center</div>
      <div>Right</div>
    </EvoStack>
  );
}
```

### Wrapping tag/chip row

```tsx
import { EvoStack, EvoBadge } from '@justin_evo/evo-ui';

function Tags({ tags }: { tags: string[] }) {
  return (
    <EvoStack direction="row" wrap gap="0.5rem" align="center">
      {tags.map((tag) => (
        <EvoBadge key={tag}>{tag}</EvoBadge>
      ))}
    </EvoStack>
  );
}
```

## Accessibility

EvoStack is a purely presentational layout primitive. It renders a plain `<div>` and adds no `role`, `aria-*`, `tabIndex`, focus management, or keyboard handlers of its own — visual layout has no inherent semantics. Make the content inside it accessible (use semantic elements, headings, labels, and roles on the children as appropriate). Because EvoStack only reorders/spaces children visually via flexbox, keep the DOM order meaningful so screen-reader and tab order remain logical; avoid relying on flex reordering to convey meaning.

## Gotchas

- **No ref forwarding / no `...rest` passthrough.** Unlike most Evo components, EvoStack only applies `className` and `style` to its root `<div>`. It does **not** accept a `ref`, and arbitrary native attributes/event handlers (e.g. `id`, `onClick`, `data-*`, `aria-*`) are **not** spread onto the root. If you need those, wrap EvoStack in your own element or apply them to a child.
- **`gap` numbers are pixels.** A numeric `gap` (e.g. `gap={16}`) is converted to `"16px"`. Pass a string to use any other unit (`gap="1rem"`, `gap="2%"`). The default is `'1rem'`.
- **`style` overrides computed flex styles.** Your `style` object is spread *after* the computed flex declarations, so keys like `display`, `flexDirection`, `gap`, `alignItems`, `justifyContent`, or `flexWrap` in `style` will override the corresponding props. Prefer the dedicated props; reserve `style` for additional CSS.
- **Default `align` is `stretch`.** Children stretch to fill the cross axis by default. In a `row`, that means children stretch to equal height; in a `column`, children stretch to full width. Set `align="start"` (or another value) if you do not want this.
- **Default `direction` is `column`.** Omitting `direction` stacks vertically, not horizontally. Set `direction="row"` for an inline group.
- **Theme via tokens.** When styling children or the stack via `style`, use Evo CSS variables like `var(--evo-color-surface)`, `var(--evo-spacing-*)`, and `var(--evo-radius-md)` rather than hard-coded hex values, so light/dark mode keep working.
- **Single CSS import, named imports only.** Import the stylesheet `@justin_evo/evo-ui/dist/evo-ui.css` once globally, and import `EvoStack` by name from `@justin_evo/evo-ui` — never from a deep internal path.

## Related

- [[evo-grid]]
- [[evo-container]]
- [[evo-divider]]
- [[evo-ui]]
