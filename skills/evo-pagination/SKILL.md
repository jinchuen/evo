---
name: evo-pagination
description: Use when you need page navigation for paginated lists, tables, search results, or large datasets — rendering numbered page buttons with prev/next controls and smart ellipsis truncation for high page counts. Covers EvoPagination.
---

# EvoPagination — Evo UI

> Evo UI component skill. Master index: [[evo-ui]].

## Overview

EvoPagination is a fully controlled page-navigation component that renders numbered page buttons with previous/next controls. Its core design principle is smart truncation: it collapses long page lists into an ellipsis around the current page so even thousands of pages stay compact, and it always renders inside a semantic `<nav>` for accessibility.

## Import

```tsx
import { EvoPagination } from '@justin_evo/evo-ui';
// One-time, app-wide stylesheet import (include once at your app root):
// import '@justin_evo/evo-ui/dist/evo-ui.css';
```

## When to use

- Navigating through paginated lists, tables, or search results.
- Large datasets where rendering every page button is impractical (ellipsis kicks in automatically).
- You already track the current page in state and want a controlled navigator.

## When NOT to use

- Infinite scroll or "load more" patterns — this component is for discrete page jumps.
- A single short list that fits on one page (with `total <= pageSize` it renders only one page button).
- Tab-like section switching — use [[evo-tabs]] instead.

## Quick start

```tsx
import { useState } from 'react';
import { EvoPagination } from '@justin_evo/evo-ui';

function ResultsFooter() {
  const [page, setPage] = useState(1);
  return (
    <EvoPagination total={50} page={page} pageSize={10} onChange={setPage} />
  );
}
```

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `total` | `number` | — | Yes | Total number of items across all pages. Combined with `pageSize` to compute the page count (`Math.max(1, Math.ceil(total / pageSize))`). |
| `page` | `number` | — | Yes | The current page, 1-indexed. This is a controlled value — the component never tracks page internally. |
| `pageSize` | `number` | `10` | No | Items per page. Used to derive how many pages exist. |
| `siblingCount` | `number` | `1` | No | Number of page buttons shown on each side of the current page when the list is truncated. |
| `onChange` | `(page: number) => void` | — | Yes | Called with the next page number when a page, previous, or next button is clicked. You must update your own state in response. |
| `className` | `string` | `''` | No | Additional CSS class appended to the root `<nav>` element. |

Note: `EvoPagination` is a plain function component. It does **not** forward a `ref` and does **not** spread arbitrary native attributes (`...rest`) onto the root — only `className` is accepted and merged onto the `<nav>`. Do not rely on passing other DOM props through.

## Variants & options

EvoPagination has no `variant` / `severity` / `size` / `shape` style axes — it is a single visual form. Its behavior is tuned entirely through the numeric props above:

- `pageSize` — controls how many items map to one page, and therefore the total page count.
- `siblingCount` — controls how many page buttons flank the active page once truncation engages. `1` shows one neighbor each side; `2` shows two; etc.

## Examples

### Basic pagination

```tsx
import { useState } from 'react';
import { EvoPagination } from '@justin_evo/evo-ui';

function Basic() {
  const [page, setPage] = useState(1);
  return (
    <>
      <EvoPagination total={50} page={page} pageSize={10} onChange={setPage} />
      <p>Page {page} of 5</p>
    </>
  );
}
```

### Large dataset with automatic ellipsis

When the page count exceeds 7, the component truncates the middle with `…` and keeps the first page, last page, and the siblings around the current page.

```tsx
import { useState } from 'react';
import { EvoPagination } from '@justin_evo/evo-ui';

function LargeDataset() {
  const [page, setPage] = useState(5);
  // 500 items / 10 per page = 50 pages, rendered as 1 … 4 5 6 … 50
  return (
    <EvoPagination total={500} page={page} pageSize={10} onChange={setPage} />
  );
}
```

### Wider context with more siblings

```tsx
import { useState } from 'react';
import { EvoPagination } from '@justin_evo/evo-ui';

function MoreSiblings() {
  const [page, setPage] = useState(1);
  return (
    <EvoPagination
      total={200}
      page={page}
      pageSize={10}
      siblingCount={2}
      onChange={setPage}
    />
  );
}
```

### Driving a data fetch from page changes

```tsx
import { useState, useEffect } from 'react';
import { EvoPagination } from '@justin_evo/evo-ui';

function UserTable() {
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const pageSize = 25;

  useEffect(() => {
    fetch(`/api/users?page=${page}&pageSize=${pageSize}`)
      .then((r) => r.json())
      .then((data) => setTotal(data.totalCount));
  }, [page]);

  return (
    <EvoPagination
      total={total}
      page={page}
      pageSize={pageSize}
      onChange={setPage}
    />
  );
}
```

## Accessibility

- The root element is a semantic `<nav aria-label="Pagination">`, exposing the control as a navigation landmark.
- Previous and next controls are `<button>` elements with `aria-label="Previous page"` and `aria-label="Next page"`.
- Each numbered page is a `<button>` with `aria-label={`Page ${p}`}` for screen-reader clarity.
- The active page button carries `aria-current="page"`; all other page buttons omit `aria-current` (it is `undefined`).
- The previous button is `disabled` when `page <= 1`; the next button is `disabled` when `page >= totalPages`. Disabled buttons are not focusable or clickable.
- All controls are native buttons, so they are keyboard-reachable via Tab and activate with Enter/Space by default. There is no custom Arrow-key roving logic.
- Ellipsis markers render as non-interactive `<span>…</span>` (no button, not focusable).

## Gotchas

- It is fully **controlled**: the component holds no internal page state. If you do not update `page` in your `onChange` handler, the UI will not move.
- `page` is **1-indexed**. Passing `0` or a value above the computed page count produces out-of-range navigation; clamp in your own state if needed.
- Ellipsis truncation only engages when the total page count is greater than 7. With 7 or fewer pages every page button is shown.
- The page count is derived as `Math.max(1, Math.ceil(total / pageSize))`, so it always renders at least one page button even when `total` is `0`.
- The buttons are native `<button>` elements and (per Evo convention) do not auto-submit a surrounding `<form>`; they only call `onChange`.
- Only `className` is forwarded to the root — there is no `ref` forwarding and no `...rest` passthrough, unlike most Evo components. Do not attach other DOM props directly.
- Style it through Evo theme tokens (`var(--evo-color-*)`, `var(--evo-radius-*)`, `var(--evo-spacing-*)`) — never hard-coded hex — so it stays correct in light and dark mode.
- Import the stylesheet `@justin_evo/evo-ui/dist/evo-ui.css` exactly once at your app root, and use named imports from `@justin_evo/evo-ui` only (no deep paths).

## Related

- [[evo-table]]
- [[evo-tabs]]
- [[evo-nav]]
- [[evo-breadcrumb]]
- [[evo-button]]
- [[evo-theming]]
- [[evo-ui]]
