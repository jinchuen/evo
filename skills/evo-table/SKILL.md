---
name: evo-table
description: Use when displaying tabular/row-column data, building a sortable data table, user/admin list, or grid of records that needs density variants, sticky header, loading skeletons, empty states, dot-notation nested fields, custom cell renderers, controlled or uncontrolled sorting, or mobile stacking — covers EvoTable (with TableColumn, TableSortState, and the TableSize/TableAlign/TableSortDirection/TableResponsive types).
---

# EvoTable — Evo UI

> Evo UI component skill. Master index: [[evo-ui]].

## Overview

EvoTable is a lightweight, fully-typed generic data table driven by a `columns` definition and a `data` array. It composes orthogonal behaviours — sortable columns, density sizes, striped/bordered/hoverable styling, sticky headers, loading skeletons, custom empty states, and mobile responsiveness — while theming follows the active light/dark mode through CSS variables.

## Import

```tsx
import { EvoTable } from '@justin_evo/evo-ui';
// Also exported (types): TableColumn, TableSortState, TableSize, TableAlign,
//   TableSortDirection, TableResponsive
// One-time stylesheet import (e.g. in your app entry):
// import '@justin_evo/evo-ui/dist/evo-ui.css';
```

## When to use

- Rendering rows of structured records (users, orders, transactions) in columns.
- You need click-to-sort headers, either controlled or uncontrolled.
- You want density control (`sm` / `md` / `lg`) to fit compact or comfortable layouts.
- You need a sticky header during vertical scroll, striped rows, or column borders.
- You need loading skeleton rows while fetching, or a custom empty state.
- You need nested-field access via dot notation (`'role.name'`) or custom cell rendering.
- You need rows to collapse into labelled cards on small viewports (`responsive="stack"`).

## When NOT to use

- For a simple list of items with no columns — use a `<ul>`/[[evo-card]] layout instead.
- For arbitrary CSS-grid layouts of components — use [[evo-grid]].
- For pagination controls — EvoTable does not paginate; pair it with [[evo-pagination]].
- For row selection checkboxes, inline editing, virtualization, or column resizing — not built in.

## Quick start

```tsx
import { EvoTable } from '@justin_evo/evo-ui';

interface User extends Record<string, unknown> {
  id: number;
  name: string;
  email: string;
}

const columns = [
  { key: 'id', header: '#', width: '64px', align: 'right' as const },
  { key: 'name', header: 'Name', sortable: true },
  { key: 'email', header: 'Email' },
];

const data: User[] = [
  { id: 1, name: 'Alice Johnson', email: 'alice@example.com' },
  { id: 2, name: 'Bob Smith', email: 'bob@example.com' },
];

export function Example() {
  return <EvoTable columns={columns} data={data} rowKey="id" />;
}
```

## Props

`EvoTable<T extends Record<string, unknown>>` props:

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `columns` | `TableColumn<T>[]` | — | Yes | Column definitions (see Sub-components). |
| `data` | `T[]` | — | Yes | Row data array. |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | No | Density variant — controls cell padding and font size. |
| `striped` | `boolean` | `false` | No | Alternating row backgrounds. |
| `hoverable` | `boolean` | `true` | No | Highlight rows on hover. |
| `bordered` | `boolean` | `false` | No | Add vertical dividers between columns. |
| `stickyHeader` | `boolean` | `false` | No | Keep the header pinned while the body scrolls. |
| `loading` | `boolean` | `false` | No | Show skeleton rows in place of data. |
| `loadingRows` | `number` | `5` | No | Skeleton row count when loading (clamped to a minimum of 1). |
| `rowKey` | `keyof T \| ((row: T, index: number) => React.Key)` | — | No | Stable React key for each row. Pass a property name or a getter. Falls back to the row index when omitted or unresolvable. |
| `emptyState` | `React.ReactNode` | — | No | Custom empty-state slot. Takes priority over `emptyText`. |
| `emptyText` | `string` | `'No data available.'` | No | Plain-text fallback when data is empty. |
| `onRowClick` | `(row: T, index: number) => void` | — | No | Fires on single row click. Presence makes rows show a clickable affordance. |
| `onRowDoubleClick` | `(row: T, index: number) => void` | — | No | Fires on row double-click. Presence makes rows show a clickable affordance. |
| `getRowClassName` | `(row: T, index: number) => string \| undefined` | — | No | Add custom classes to specific rows. |
| `responsive` | `'scroll' \| 'stack'` | `'scroll'` | No | Small-viewport behaviour. `scroll` = horizontal scroll; `stack` = rows become labelled cards under ~640px. |
| `caption` | `React.ReactNode` | — | No | Optional caption rendered above the table (as a `<caption>` element). |
| `sort` | `TableSortState \| null` | — | No | Controlled sort state. Providing this prop (even `null`) puts the table in controlled sort mode; pair with `onSortChange`. |
| `onSortChange` | `(next: TableSortState \| null) => void` | — | No | Sort change callback. Fires in both controlled and uncontrolled modes. |
| `defaultSort` | `TableSortState` | — | No | Initial sort for uncontrolled mode. |
| `highlightColumn` | `string` | — | No | Tint a single column (matched by `TableColumn.key`) with a subtle primary wash on its `th`/`td` plus a top accent bar on the header — e.g. to anchor a recommended plan/tier column in a comparison table. `undefined` (default) leaves every column styled identically. |
| `className` | `string` | — | No | Additional CSS class applied to the wrapper `<div>`. |

Notes:
- `EvoTable` is a generic function component, **not** a `forwardRef` component. It does **not** accept a `ref` and does **not** spread `...rest` native attributes — only `className` is forwarded, onto the outermost wrapper `<div>`. To pass arbitrary attributes, wrap the table in your own element.
- "Controlled sort mode" is determined by `sort !== undefined`. Passing `sort={null}` is controlled (empty sort); omitting `sort` entirely is uncontrolled.

## Sub-components

EvoTable is configured through plain object types rather than JSX compound components. Document each item passed to `columns` and the sort state shape.

### `TableColumn<T>` (each entry in the `columns` array)

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `key` | `string` | — | Yes | Key in the data object. Supports dot notation for nested paths (`'role.name'`). Also used as the column's React key and `data-label`/`aria-sort` identity. |
| `header` | `React.ReactNode` | — | Yes | Display label or node for the column header. |
| `width` | `string` | — | No | Optional fixed width, e.g. `'120px'` or `'10%'` (applied as inline `width` on the `<th>`). |
| `align` | `'left' \| 'center' \| 'right'` | `'left'` | No | Cell (and header) alignment. |
| `sortable` | `boolean` | `false` | No | Enable click-to-sort on this column (renders a header button + sort icon). |
| `sortFn` | `(a: T, b: T, direction: TableSortDirection) => number` | — | No | Custom comparator. Falls back to a numeric-aware string compare. Note: it receives the **full rows** `a` and `b` (not the cell values) plus the active `direction`. |
| `render` | `(value: unknown, row: T, rowIndex: number) => React.ReactNode` | — | No | Custom cell renderer. Defaults to string coercion (`null`/`undefined` → empty string, otherwise `String(value)`). |
| `cellClassName` | `string` | — | No | Extra class for cells in this column. |
| `headerClassName` | `string` | — | No | Extra class for the header cell. |

### `TableSortState` (shape of `sort` / `defaultSort` / `onSortChange` argument)

| Field | Type | Description |
| --- | --- | --- |
| `key` | `string` | The `key` of the column being sorted. |
| `direction` | `'asc' \| 'desc'` | Sort direction. |

When sorting is active and the user clicks a sortable header, direction cycles **ascending → descending → unsorted (`null`)**.

## Variants & options

`size` (`TableSize`):
- `sm` — compact density: smaller cell padding and font size.
- `md` — default density.
- `lg` — comfortable density: larger cell padding and font size.

`align` (`TableAlign`, per column):
- `left` — left-aligned cells (default).
- `center` — centered cells.
- `right` — right-aligned cells (use for numeric columns).

`responsive` (`TableResponsive`):
- `scroll` — default; on small viewports the table scrolls horizontally with a thin scrollbar.
- `stack` — under ~640px each row collapses into a labelled card (labels come from the column `header` when it is a string, otherwise from `key`).

`direction` (`TableSortDirection`, within sort state):
- `asc` — ascending.
- `desc` — descending.

## Examples

### Sortable columns with nested fields and a custom cell renderer

```tsx
import { EvoTable, EvoBadge } from '@justin_evo/evo-ui';

interface User extends Record<string, unknown> {
  id: number;
  name: string;
  email: string;
  role: { name: string };
  status: 'active' | 'inactive' | 'pending';
  visits: number;
}

const statusMap = { active: 'success', inactive: 'secondary', pending: 'warning' } as const;

const columns = [
  { key: 'id', header: '#', width: '64px', align: 'right' as const },
  { key: 'name', header: 'Name', sortable: true },
  { key: 'email', header: 'Email' },
  { key: 'role.name', header: 'Role', sortable: true }, // dot-notation nested path
  { key: 'visits', header: 'Visits', align: 'right' as const, sortable: true },
  {
    key: 'status',
    header: 'Status',
    render: (val: unknown) => (
      <EvoBadge severity={statusMap[val as User['status']]} variant="subtle" size="sm" dot>
        {val as string}
      </EvoBadge>
    ),
  },
];

export function UsersTable({ data }: { data: User[] }) {
  return (
    <EvoTable
      columns={columns}
      data={data}
      rowKey="id"
      onRowDoubleClick={(row) => console.log('opened', row)}
    />
  );
}
```

### Striped, sticky header, with a loading state and skeleton rows

```tsx
import { useState } from 'react';
import { EvoTable } from '@justin_evo/evo-ui';

export function ScrollableTable({ columns, data }: { columns: any[]; data: any[] }) {
  const [loading, setLoading] = useState(false);
  return (
    <EvoTable
      columns={columns}
      data={data}
      rowKey="id"
      striped
      stickyHeader
      hoverable
      loading={loading}
      loadingRows={8}
      caption="Team members"
    />
  );
}
```

### Custom empty state, density, and mobile stacking

```tsx
import { EvoTable, EvoButton } from '@justin_evo/evo-ui';

export function EmptyableTable({ columns, data }: { columns: any[]; data: any[] }) {
  return (
    <EvoTable
      columns={columns}
      data={data}
      rowKey="id"
      size="sm"
      responsive="stack"
      emptyState={
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--evo-color-text)' }}>
            No users yet
          </div>
          <div style={{ fontSize: '0.875rem', opacity: 0.7 }}>
            Invite teammates to see them appear here.
          </div>
          <EvoButton label="Invite user" size="sm" severity="primary" />
        </div>
      }
    />
  );
}
```

### Controlled sorting

```tsx
import { useState } from 'react';
import { EvoTable, type TableSortState } from '@justin_evo/evo-ui';

export function ControlledSortTable({ columns, data }: { columns: any[]; data: any[] }) {
  const [sort, setSort] = useState<TableSortState | null>({ key: 'name', direction: 'asc' });
  return (
    <EvoTable
      columns={columns}
      data={data}
      rowKey="id"
      sort={sort}            // presence of `sort` => controlled mode
      onSortChange={setSort} // cycles asc -> desc -> null
    />
  );
}
```

### Keyboard-operable clickable rows with a highlighted column

```tsx
import { EvoTable } from '@justin_evo/evo-ui';

export function OpenableTable({ columns, data }: { columns: any[]; data: any[] }) {
  return (
    <EvoTable
      columns={columns}
      data={data}
      rowKey="id"
      onRowClick={(row) => openDetail(row)}   // rows become Tab + Enter/Space operable
      highlightColumn="visits"                 // tints that column's th/td
    />
  );
}
```

## Accessibility

- Renders semantic table markup: a `<table>` with `<caption>` (when `caption` is set), `<thead>`/`<tbody>`, header `<th scope="col">`, and body `<td>` cells.
- Sortable headers expose `aria-sort` on the `<th>`: `"ascending"` or `"descending"` when active, `"none"` when the column is sortable but not the active sort, and the attribute is omitted for non-sortable columns.
- Sortable headers render a native `<button type="button">` (keyboard-focusable and Enter/Space activatable) wrapping the header label and a decorative sort icon. The SVG sort icon is marked `aria-hidden="true"` and `focusable="false"`.
- Each body cell carries a `data-label` attribute (the column `header` when it is a string, otherwise the `key`) which drives the `responsive="stack"` mobile card labels.
- **Clickable rows are keyboard-operable.** When `onRowClick` is provided, each `<tr>` gets `tabIndex={0}`, `role="button"`, and an `onKeyDown` handler that fires `onRowClick` on <kbd>Enter</kbd> or <kbd>Space</kbd> (with `preventDefault` to stop the page from scrolling on Space). A visible `:focus-visible` outline (`$evo-primary-focus`, inset) marks the focused row. `onRowDoubleClick` alone does **not** add this — double-click has no reliable keyboard equivalent, so pair it with `onRowClick` (or a `render`-based control) if double-click is the primary action.

## Gotchas

- **Not a `forwardRef` component and no `...rest` passthrough.** Only `className` is forwarded (to the wrapper `<div>`). You cannot attach a `ref` or arbitrary HTML attributes to EvoTable itself — wrap it if you need them.
- **`T` must extend `Record<string, unknown>`.** Your row type needs an index signature (e.g. `interface User extends Record<string, unknown> { ... }`), or TypeScript will reject the `data`/`columns` generics.
- **Controlled vs uncontrolled sort is decided by `sort !== undefined`.** Passing `sort={null}` makes the table controlled with no active sort; omit `sort` for uncontrolled and use `defaultSort` instead.
- **Sort cycles to `null`.** Clicking a sorted header a third time clears the sort (back to original `data` order) — handle `null` in your `onSortChange`.
- **`sortFn` receives full rows, not cell values.** Its signature is `(a: T, b: T, direction)`; it must return the final comparison and account for `direction` itself (the table does not negate a custom `sortFn`).
- **Dot notation is read-only path access.** `key: 'role.name'` reads `row.role.name`; missing intermediate objects resolve to `undefined` (rendered as an empty string by the default renderer).
- **`rowKey` falls back to the array index** when omitted or when the resolved value isn't a string/number — pass a stable `rowKey` to avoid remount bugs on reorder.
- **`loadingRows` is clamped to a minimum of 1**; values below 1 still render one skeleton row.
- **`highlightColumn` matches by `TableColumn.key`, not header text or index.** A typo'd key silently highlights nothing (no warning).
- **No built-in pagination/selection/virtualization.** Slice your `data` yourself and pair with [[evo-pagination]] for large datasets.
- **Theme with tokens, not hex.** Custom content in `render`/`emptyState` should use `var(--evo-color-*)` tokens so light/dark mode and contrast stay correct; never hard-code hex.
- **Single CSS import, named imports only.** Import `@justin_evo/evo-ui/dist/evo-ui.css` once at app root, and import `EvoTable` from `@justin_evo/evo-ui` (never a deep path).

## Related

- [[evo-pagination]] — page through large datasets that EvoTable does not paginate itself.
- [[evo-badge]] — common cell `render` output for statuses/tags.
- [[evo-skeleton]] — the loading-placeholder primitive that mirrors EvoTable's skeleton rows.
- [[evo-card]] — alternative layout for non-tabular record lists.
- [[evo-grid]] — CSS-grid layout for arbitrary component arrangements.
- [[evo-theming]] — the `--evo-color-*` / `--evo-spacing-*` / `--evo-radius-*` tokens that style the table.
- [[evo-ui]] — master index of all Evo UI component skills.
