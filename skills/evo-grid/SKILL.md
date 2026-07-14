---
name: evo-grid
description: Use when building a two-dimensional CSS Grid layout, arranging cards or cells into columns and rows, controlling column/row gaps, or making items span multiple columns/rows; covers EvoGrid and its EvoGrid.Item compound part.
---

# EvoGrid — Evo UI

> Evo UI component skill. Master index: [[evo-ui]].

## Overview

EvoGrid is a thin, declarative wrapper over CSS Grid: it renders a `<div>` with `display: grid` and maps simple props (`cols`, `rows`, `gap`, `minColWidth`) onto the corresponding grid style properties. Its companion compound part `EvoGrid.Item` handles per-cell column and row spanning, so layout intent stays in props instead of raw inline styles. Both `EvoGrid` and `EvoGrid.Item` forward `ref` to their root `<div>` and spread `...rest` native attributes.

## Import

```tsx
import { EvoGrid } from '@justin_evo/evo-ui';
// One-time, app-wide stylesheet import (e.g. in your root entry file):
// import '@justin_evo/evo-ui/dist/evo-ui.css';
```

## When to use

- You need a two-dimensional layout (columns AND rows), not just a single axis.
- You want a fixed number of equal-width columns (e.g. a 3- or 4-column card grid).
- You need a custom column/row template (e.g. `"1fr 2fr 1fr"`).
- Individual cells need to span multiple columns or rows.

## When NOT to use

- You only need one-dimensional flow (a row or a column of items) — reach for a stack/flex layout ([[evo-stack]]) instead.
- You need page-width constraint / centering with horizontal padding — use [[evo-container]].
- You need a data grid with sorting, headers, and rows of records — use [[evo-table]].

## Quick start

```tsx
import { EvoGrid } from '@justin_evo/evo-ui';

function Gallery() {
  return (
    <EvoGrid cols={3} gap="0.75rem">
      <EvoGrid.Item><div>Cell 1</div></EvoGrid.Item>
      <EvoGrid.Item><div>Cell 2</div></EvoGrid.Item>
      <EvoGrid.Item><div>Cell 3</div></EvoGrid.Item>
    </EvoGrid>
  );
}
```

## Props

### EvoGrid

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `children` | `React.ReactNode` | — | Yes | Grid children (typically `EvoGrid.Item` elements). |
| `cols` | `number \| string` | `3` | No | Number of equal columns (a `number` becomes `repeat(n, 1fr)`), or a raw CSS `grid-template-columns` value when a `string`. |
| `rows` | `number \| string` | `undefined` | No | Number of rows (a `number` becomes `repeat(n, auto)`), or a raw CSS `grid-template-rows` value when a `string`. When omitted, no `grid-template-rows` is set. |
| `gap` | `number \| string` | `'1rem'` | No | Gap between cells. A `number` is treated as pixels (e.g. `16` → `16px`); a `string` is passed through as-is (e.g. `"0.75rem"`). Maps to CSS `gap`. |
| `colGap` | `number \| string` | `undefined` | No | Column-gap override. A `number` becomes pixels; a `string` passes through. Maps to CSS `column-gap` and overrides the column axis of `gap`. |
| `rowGap` | `number \| string` | `undefined` | No | Row-gap override. A `number` becomes pixels; a `string` passes through. Maps to CSS `row-gap` and overrides the row axis of `gap`. |
| `minColWidth` | `number \| string` | `undefined` | No | When set, overrides `cols` and emits `gridTemplateColumns: repeat(auto-fit, minmax(minColWidth, 1fr))`. A `number` becomes pixels; a `string` passes through (e.g. `"10rem"`). Lets the grid self-collapse to fewer columns (down to one) as its container narrows, without a manual breakpoint. |
| `className` | `string` | `''` | No | Additional CSS class applied to the root `<div>`. |
| `style` | `CSSProperties` | `undefined` | No | Inline styles merged onto (and able to override) the generated grid styles, since `...style` is spread last. |
| `ref` | `React.Ref<HTMLDivElement>` | `undefined` | No | Forwarded to the root `<div>` via `forwardRef`. |
| `...rest` | `React.HTMLAttributes<HTMLDivElement>` | — | No | `EvoGridProps` extends `HTMLAttributes<HTMLDivElement>`; any other native attribute (`id`, `data-*`, `onClick`, `aria-*`, etc.) is spread onto the root `<div>`. |

### EvoGrid.Item

See the [Sub-components](#sub-components) section below.

## Sub-components

### `EvoGrid.Item`

A cell wrapper that renders a `<div>` and translates `colSpan` / `rowSpan` into `grid-column: span N` / `grid-row: span N`.

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `children` | `React.ReactNode` | — | Yes | Item content. |
| `colSpan` | `number` | `undefined` | No | Number of columns this item spans. Sets `gridColumn: span <colSpan>`. When omitted, the item occupies a single column. |
| `rowSpan` | `number` | `undefined` | No | Number of rows this item spans. Sets `gridRow: span <rowSpan>`. When omitted, the item occupies a single row. |
| `className` | `string` | `''` | No | Additional CSS class applied to the item's root `<div>`. |
| `style` | `CSSProperties` | `undefined` | No | Inline styles merged onto (and able to override) the generated span styles, since `...style` is spread last. |
| `ref` | `React.Ref<HTMLDivElement>` | `undefined` | No | Forwarded to the item's root `<div>` via `forwardRef`. |
| `...rest` | `React.HTMLAttributes<HTMLDivElement>` | — | No | `EvoGridItemProps` extends `HTMLAttributes<HTMLDivElement>`; any other native attribute is spread onto the root `<div>`. |

## Variants & options

EvoGrid has no enumerated `variant` / `severity` / `size` / `shape` union props. Its configuration is purely dimensional via `cols`, `rows`, `gap`, `colGap`, and `rowGap`. Two value forms are accepted on the dimensional props:

- **`number` for `cols`** — produces `repeat(n, 1fr)` (n equal-fraction columns).
- **`string` for `cols`** — used verbatim as `grid-template-columns` (e.g. `"1fr 2fr 1fr"`, `"200px auto"`).
- **`number` for `rows`** — produces `repeat(n, auto)` (n auto-height rows).
- **`string` for `rows`** — used verbatim as `grid-template-rows`.
- **`number` for `gap` / `colGap` / `rowGap`** — converted to pixels (e.g. `16` → `"16px"`).
- **`string` for `gap` / `colGap` / `rowGap`** — passed through unchanged (e.g. `"0.75rem"`, `"1rem 2rem"`).
- **`minColWidth` (number or string)** — when set, replaces the entire `cols` calculation with `repeat(auto-fit, minmax(minColWidth, 1fr))`, so the browser fits as many columns of at least that width as the container allows and collapses down to one column on narrow viewports (e.g. 375px) with no explicit breakpoint.

## Examples

### 3-column grid

```tsx
import { EvoGrid } from '@justin_evo/evo-ui';

<EvoGrid cols={3} gap="0.75rem">
  {Array.from({ length: 6 }, (_, i) => (
    <EvoGrid.Item key={i}>
      <div style={{ padding: '1rem', color: 'var(--evo-color-primary)' }}>
        Cell {i + 1}
      </div>
    </EvoGrid.Item>
  ))}
</EvoGrid>
```

### Column spanning

```tsx
import { EvoGrid } from '@justin_evo/evo-ui';

<EvoGrid cols={4} gap="0.75rem">
  <EvoGrid.Item colSpan={2}><div>Span 2</div></EvoGrid.Item>
  <EvoGrid.Item><div>Col 3</div></EvoGrid.Item>
  <EvoGrid.Item><div>Col 4</div></EvoGrid.Item>
  <EvoGrid.Item><div>Col 1</div></EvoGrid.Item>
  <EvoGrid.Item colSpan={3}><div>Span 3</div></EvoGrid.Item>
</EvoGrid>
```

### Custom template with separate column/row gaps

```tsx
import { EvoGrid } from '@justin_evo/evo-ui';

<EvoGrid cols="1fr 2fr 1fr" colGap="2rem" rowGap="1rem">
  <EvoGrid.Item><div>1fr</div></EvoGrid.Item>
  <EvoGrid.Item><div>2fr</div></EvoGrid.Item>
  <EvoGrid.Item><div>1fr</div></EvoGrid.Item>
</EvoGrid>
```

### Row spanning with explicit rows

```tsx
import { EvoGrid } from '@justin_evo/evo-ui';

<EvoGrid cols={3} rows={2} gap={16}>
  <EvoGrid.Item rowSpan={2}><div>Tall (spans 2 rows)</div></EvoGrid.Item>
  <EvoGrid.Item><div>A</div></EvoGrid.Item>
  <EvoGrid.Item><div>B</div></EvoGrid.Item>
  <EvoGrid.Item><div>C</div></EvoGrid.Item>
  <EvoGrid.Item><div>D</div></EvoGrid.Item>
</EvoGrid>
```

### Self-collapsing grid (minColWidth)

```tsx
import { EvoGrid } from '@justin_evo/evo-ui';

<EvoGrid minColWidth="10rem" gap="0.75rem">
  {items.map((item) => (
    <EvoGrid.Item key={item.id}><div>{item.label}</div></EvoGrid.Item>
  ))}
</EvoGrid>
```

## Accessibility

EvoGrid is purely presentational. It renders a plain `<div>` with `display: grid` (and `EvoGrid.Item` renders a plain `<div>`); neither applies any `role`, `aria-*` attribute, `tabIndex`, keyboard handler, or focus management by default. There is no implicit ARIA grid semantics — it is a CSS Grid layout primitive, not a `role="grid"` widget. Provide your own semantic structure and ARIA inside the cells when the content requires it (e.g. headings, lists, links, or interactive controls). Because `EvoGridProps` and `EvoGridItemProps` both extend `HTMLAttributes` and spread `...rest` onto their root `<div>`, you can attach `role`, `aria-*`, or any other native attribute directly via props (e.g. `<EvoGrid role="list">` / `<EvoGrid.Item role="listitem">`) when your content needs explicit semantics — no wrapper element required.

## Gotchas

- **`number` gaps/cols mean pixels, strings are raw CSS.** `gap={16}` becomes `16px`; `gap="1rem"` stays `1rem`. Similarly `cols={3}` → `repeat(3, 1fr)` but `cols="3"` (a string) would be passed verbatim as an invalid `grid-template-columns` value. Pass a number for column counts.
- **`minColWidth` overrides `cols`.** If both are set, `minColWidth` wins and `cols` is ignored — pass only one of them per grid.
- **`style` wins over generated styles.** Because the component spreads `...style` after the computed grid properties, any matching key in `style` (e.g. `gap`, `gridTemplateColumns`) overrides the prop-driven value.
- **`colGap` / `rowGap` override `gap` per axis.** Setting `colGap` and/or `rowGap` emits `column-gap` / `row-gap`, which take precedence over the corresponding axis of the shorthand `gap`.
- **`rows` is optional and unset by default.** Omitting `rows` leaves `grid-template-rows` undefined so rows size implicitly; only set it when you need explicit row tracks.
- **Theme via tokens, not hex.** Style cell content with `var(--evo-color-*)`, `var(--evo-spacing-*)`, and `var(--evo-radius-*)` rather than hard-coded hex, so light and dark mode both work.
- **Single CSS import, named imports only.** Import the stylesheet once (`@justin_evo/evo-ui/dist/evo-ui.css`) and import `EvoGrid` by name from `@justin_evo/evo-ui` — never from a deep path. `EvoGrid.Item` is accessed off the `EvoGrid` export.

## Related

- [[evo-stack]] — one-dimensional flex layout for rows/columns of items.
- [[evo-container]] — page-width constraint, centering, and padding.
- [[evo-divider]] — horizontal/vertical separators between layout regions.
- [[evo-card]] — common content block to place inside grid cells.
- [[evo-theming]] — the CSS variable tokens used to style grid content.
