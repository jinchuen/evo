---
name: evo-nav
description: Use when building a vertical sidebar navigation with grouped sections, multi-level nested rows, active-page highlighting, collapsible groups, an icon-only rail, skeleton loading, a persistent quick-action button, and a responsive off-canvas drawer on mobile; covers EvoNav and its EvoNav.Group, EvoNav.Item, EvoNav.SubItem, EvoNav.Skeleton, and EvoNav.QuickAction parts.
---

# EvoNav — Evo UI

> Evo UI component skill. Master index: [[evo-ui]].

## Overview

EvoNav is a compose-based vertical sidebar navigation: nesting is always expressed through children (never an `items` array), rows render as `<a href>` when given an `href` and as `<button type="button">` otherwise, and disclosure state follows the Evo controlled/uncontrolled (`open`/`defaultOpen` + `onOpenChange`) convention. Below a configurable breakpoint it collapses to an off-canvas drawer with a built-in hamburger trigger; it can also shrink to an icon-only rail.

## Import

```tsx
import { EvoNav } from '@justin_evo/evo-ui';
// One-time stylesheet import (e.g. in your app entry):
// import '@justin_evo/evo-ui/dist/evo-ui.css';
```

## When to use

- You need a persistent vertical sidebar / app navigation.
- You want grouped sections (with optional collapsible accordions and count chips).
- You need multi-level nested menus (recursively nestable sub-items).
- You want an active-page indicator that also forwards `aria-current="page"`.
- You need a responsive sidebar that becomes an off-canvas drawer on small viewports.
- You want skeleton placeholders while nav data loads, or a "Create New" quick-action button.

## When NOT to use

- For a horizontal top bar — use [[evo-topnav]].
- For breadcrumb trails — use [[evo-breadcrumb]].
- For switching content panels in place — use [[evo-tabs]].
- For a global command search overlay — use [[evo-command-palette]] (the docs pair EvoNav with `EvoCommandPalette`, but it is a separate component).

## Quick start

```tsx
import { EvoNav } from '@justin_evo/evo-ui';

function Sidebar() {
  return (
    <EvoNav>
      <EvoNav.Group label="Main">
        <EvoNav.Item active href="/">Dashboard</EvoNav.Item>
        <EvoNav.Item href="/analytics">Analytics</EvoNav.Item>
      </EvoNav.Group>
    </EvoNav>
  );
}
```

## Props

### EvoNav (root)

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `children` | `ReactNode` | — | Yes | EvoNav.Group, EvoNav.Item, EvoNav.QuickAction, or EvoNav.Skeleton elements. |
| `breakpoint` | `number` | `768` | No | Below this viewport width (px), the nav collapses to a drawer. |
| `drawerOpen` | `boolean` | — | No | Controlled drawer open state (mobile only). |
| `defaultDrawerOpen` | `boolean` | `false` | No | Uncontrolled initial drawer state. |
| `onDrawerOpenChange` | `(open: boolean) => void` | — | No | Called when the drawer opens or closes. |
| `hideTrigger` | `boolean` | `false` | No | Hide the built-in hamburger trigger (use when wiring a trigger yourself). |
| `collapsed` | `boolean` | `false` | No | Collapse to an icon-only rail: labels hide, icons center, and each row shows a native tooltip from its `tooltip` prop. |
| `aria-label` | `string` | `'Main navigation'` | No | Accessible label for the `<nav>` landmark. |

EvoNavProps extends `Omit<HTMLAttributes<HTMLElement>, 'children'>`. All remaining native `<nav>` attributes, plus `ref` and `className`, are forwarded to the root `<nav>` element. (`ref` targets the `HTMLElement` nav landmark.)

## Sub-components

EvoNav is a compound component. Access the parts as `EvoNav.Group`, `EvoNav.Item`, `EvoNav.SubItem`, `EvoNav.Skeleton`, and `EvoNav.QuickAction`. Each is also a named export: `EvoNavGroup`, `EvoNavItem`, `EvoNavSubItem`, `EvoNavSkeleton`, `EvoNavQuickAction`.

### EvoNav.Group (EvoNavGroup)

A labelled section heading wrapping a list of items. Renders an `<li>` (forwards `ref` to `HTMLLIElement`).

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `label` | `string` | — | Yes | Group heading text. Linked to the nested list via `aria-labelledby`. |
| `children` | `ReactNode` | — | Yes | EvoNav.Item elements. |
| `className` | `string` | — | No | Additional class on the group `<li>`. |
| `collapsible` | `boolean` | `false` | No | Render the heading as a disclosure that expands/collapses the group. |
| `defaultOpen` | `boolean` | `true` | No | Uncontrolled initial open state (collapsible only). |
| `open` | `boolean` | — | No | Controlled open state (collapsible only). |
| `onOpenChange` | `(open: boolean) => void` | — | No | Called when the group expands or collapses. |
| `count` | `number` | — | No | Small count chip shown after the label. |

Notes: When `collapsible` is false (or when the root is `collapsed` to a rail) the heading renders as a static `role="heading" aria-level={3}` element and the list is always shown. In icon-rail mode (`collapsed`) the group is always treated as open.

### EvoNav.Item (EvoNavItem) and EvoNav.SubItem (EvoNavSubItem)

A navigation row. Both share the same prop shape; `SubItem` is the nested tier. A row renders as `<a href>` when `href` is set (and not disabled), otherwise as `<button type="button">`. Nesting `EvoNav.SubItem` children inside a row turns it into a disclosure. Each renders an `<li>` (forwards `ref` to `HTMLLIElement`).

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `children` | `ReactNode` | — | Yes | Row label content. Nested `EvoNav.SubItem` children become the disclosure's sub-rows; all other children form the label. |
| `icon` | `ReactNode` | — | No | Icon rendered before the label. |
| `active` | `boolean` | `false` | No | Marks this row as the current page (sets `aria-current="page"` and applies the active visual state). |
| `href` | `string` | — | No | Render as `<a href>` instead of `<button>`. |
| `onClick` | `(event: ReactMouseEvent \| ReactKeyboardEvent) => void` | — | No | Click / keyboard-activate handler (Enter, Space, click). |
| `tooltip` | `string` | — | No | Tooltip text shown via native `title` when the nav is collapsed to a rail. |
| `open` | `boolean` | — | No | Controlled expand state (only meaningful when the row has SubItem children). |
| `defaultOpen` | `boolean` | `false` | No | Uncontrolled initial expand state. |
| `onOpenChange` | `(open: boolean) => void` | — | No | Called when the row's expand state changes. |
| `disabled` | `boolean` | `false` | No | Disables the row (no click, no keyboard activation; excluded from arrow-key focus traversal). |
| `className` | `string` | — | No | Additional class on the row element. |

Notes: `SubItem` rows can themselves contain more `SubItem`s for deeper trees. When an expandable row has no `href`, primary activation toggles its disclosure. On mobile, activating a row that has an `href` and no sub-items closes the drawer.

### EvoNav.Skeleton (EvoNavSkeleton)

Renders placeholder rows while nav data loads. Outputs a fragment of `aria-hidden` `<li>` placeholders (no `ref`).

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `count` | `number` | `4` | No | Number of skeleton rows to render. |

### EvoNav.QuickAction (EvoNavQuickAction)

A persistent action button (defaults to a "Create New" row with a plus glyph) that stays visible in the sidebar. Renders an `<li>` wrapping a `<button type="button">` (forwards `ref` to the `HTMLButtonElement`).

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `label` | `string` | `'Create New'` | No | Button text. |
| `icon` | `ReactNode` | plus glyph | No | Custom icon. Defaults to a built-in plus icon when omitted. |
| `type` | `'button' \| 'submit' \| 'reset'` | `'button'` | No | Native button type (defaults to `'button'` so it never auto-submits). |
| `className` | `string` | — | No | Additional class on the button. |

EvoNavQuickActionProps extends `ButtonHTMLAttributes<HTMLButtonElement>`. Every native `<button>` attribute (`onClick`, `form`, `name`, `autoFocus`, `aria-*`, …) plus `ref` and `className` is forwarded to the button.

## Variants & options

EvoNav has no `variant`/`severity`/`size`/`shape` axes. Its discrete display modes are driven by boolean/numeric props:

- **Default sidebar** — at or above `breakpoint`, renders inline as a vertical sidebar.
- **Drawer (mobile)** — below `breakpoint` (default 768px), collapses to an off-canvas drawer with a built-in hamburger trigger and backdrop.
- **Icon rail (`collapsed`)** — labels hide, icons center, and each row surfaces its `tooltip` as a native `title`; collapsible groups become static and forced-open.
- **Group: static** (`collapsible={false}`, default) — heading renders as `role="heading" aria-level={3}`, list always visible.
- **Group: collapsible** (`collapsible`) — heading becomes a disclosure button with chevron; `defaultOpen` defaults to `true`.

## Examples

### Grouped navigation with active state

```tsx
import { useState } from 'react';
import { EvoNav } from '@justin_evo/evo-ui';

function GroupedNav() {
  const [active, setActive] = useState('dashboard');
  return (
    <EvoNav>
      <EvoNav.Group label="Main">
        <EvoNav.Item active={active === 'dashboard'} onClick={() => setActive('dashboard')}>
          Dashboard
        </EvoNav.Item>
        <EvoNav.Item active={active === 'analytics'} onClick={() => setActive('analytics')}>
          Analytics
        </EvoNav.Item>
      </EvoNav.Group>
      <EvoNav.Group label="Settings" count={2} collapsible defaultOpen>
        <EvoNav.Item active={active === 'profile'} onClick={() => setActive('profile')}>
          Profile
        </EvoNav.Item>
        <EvoNav.Item active={active === 'billing'} onClick={() => setActive('billing')}>
          Billing
        </EvoNav.Item>
      </EvoNav.Group>
    </EvoNav>
  );
}
```

### Nested multi-level menu with icons

```tsx
import { EvoNav } from '@justin_evo/evo-ui';

function NestedNav() {
  return (
    <EvoNav>
      <EvoNav.Item icon={<HomeIcon />} active>Home</EvoNav.Item>
      <EvoNav.Item icon={<UsersIcon />} defaultOpen>
        Users
        <EvoNav.SubItem href="/users">All Users</EvoNav.SubItem>
        <EvoNav.SubItem>
          Roles
          <EvoNav.SubItem href="/users/roles/admin">Admin</EvoNav.SubItem>
          <EvoNav.SubItem href="/users/roles/editor">Editor</EvoNav.SubItem>
        </EvoNav.SubItem>
        <EvoNav.SubItem href="/users/invites">Invites</EvoNav.SubItem>
      </EvoNav.Item>
    </EvoNav>
  );
}
```

### Icon rail, quick action, and skeleton loading

```tsx
import { EvoNav } from '@justin_evo/evo-ui';

function RailNav({ isLoading, collapsed }: { isLoading: boolean; collapsed: boolean }) {
  return (
    <EvoNav collapsed={collapsed}>
      <EvoNav.QuickAction label="Create New" onClick={openCreateModal} />
      {isLoading ? (
        <EvoNav.Skeleton count={5} />
      ) : (
        <EvoNav.Group label="Main" count={2} collapsible defaultOpen>
          <EvoNav.Item icon={<HomeIcon />} tooltip="Dashboard" active>Dashboard</EvoNav.Item>
          <EvoNav.Item icon={<ChartIcon />} tooltip="Analytics">Analytics</EvoNav.Item>
        </EvoNav.Group>
      )}
    </EvoNav>
  );
}
```

### Controlled responsive drawer (trigger lifted out)

```tsx
import { useState } from 'react';
import { EvoNav, EvoButton } from '@justin_evo/evo-ui';

function ControlledDrawerNav() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <EvoButton onClick={() => setOpen(true)}>Menu</EvoButton>
      <EvoNav hideTrigger drawerOpen={open} onDrawerOpenChange={setOpen}>
        <EvoNav.Group label="Main">
          <EvoNav.Item active href="/">Dashboard</EvoNav.Item>
        </EvoNav.Group>
      </EvoNav>
    </>
  );
}
```

## Accessibility

- The root renders `<nav role="navigation">` with an `aria-label` (default `'Main navigation'`). On mobile, when the drawer is closed the nav gets `aria-hidden`.
- Active rows forward `aria-current="page"`.
- Expandable rows forward `aria-expanded` and `aria-controls` pointing at their nested `<ul role="group">`, which is `aria-labelledby` the row id and `hidden` when closed.
- Collapsible groups: interactive headings are `<button>` with `aria-expanded` + `aria-controls`; static headings use `role="heading" aria-level={3}`; group lists are `<ul role="group">` linked via `aria-labelledby`.
- Disabled rows get `aria-disabled`, `tabIndex={-1}`, and are skipped in arrow-key traversal.
- The built-in hamburger trigger has `aria-expanded`, `aria-controls` (the nav id), and an `aria-label` that toggles between "Open navigation" / "Close navigation".
- Keyboard model is a disclosure tree (every row is in natural tab order):
  - **Down / Up** — move focus to next / previous focusable row (walks into open subtrees, skips disabled).
  - **Right** — on an expandable row, open it; if already open, focus its first child.
  - **Left** — on an open expandable row, collapse it; otherwise focus the parent row.
  - **Home / End** — focus first / last row.
  - **Enter / Space** — invokes `onClick` and toggles disclosure on expandable rows (Space is always captured to prevent page scroll; on `<a>` rows Enter passes through natively).
  - **Escape** (mobile, drawer open) — closes the drawer.

## Gotchas

- Rows and the QuickAction are real `<button type="button">` elements (or `<a>` when `href` is set) — they never auto-submit a surrounding form.
- A row only becomes a disclosure if it has `EvoNav.SubItem` children; `open`/`defaultOpen`/`onOpenChange` are no-ops otherwise.
- `EvoNav.SubItem` is detected by its `displayName` (`'EvoNavSubItem'`) — only direct `EvoNav.SubItem` elements (not arbitrary wrappers) are split out as sub-rows; everything else is treated as label content.
- In icon-rail mode (`collapsed`) collapsible groups are forced open and render static headings; the `tooltip` prop is what surfaces the row label as a native `title`, so set it per item for rail usability.
- When `defaultDrawerOpen`/`drawerOpen` is unused, the drawer only exists below `breakpoint`; resizing back above the breakpoint auto-closes the drawer. The drawer also locks body scroll while open.
- `EvoNav.Skeleton` rows are `aria-hidden`; do not rely on them for real content.
- Theme via `var(--evo-color-*)`, `var(--evo-spacing-*)`, `var(--evo-radius-*)` tokens — never hard-coded hex (breaks light/dark mode). Touch targets stay >=44px on mobile.
- Import the CSS once (`@justin_evo/evo-ui/dist/evo-ui.css`) and use named imports from `@justin_evo/evo-ui` only — no deep paths.

## Related

- [[evo-topnav]]
- [[evo-breadcrumb]]
- [[evo-tabs]]
- [[evo-command-palette]]
- [[evo-pagination]]
- [[evo-theming]]
- [[evo-ui]]
