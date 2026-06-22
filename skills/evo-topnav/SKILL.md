---
name: evo-topnav
description: Use when building a site header / top navigation bar with a brand/logo, horizontal nav links, hover-or-click dropdown sub-menus, right-aligned action buttons, and a mobile hamburger drawer that collapses below a breakpoint — covers EvoTopNav and its Brand, Menu, Item, Actions, Toggle, Dropdown, and DropdownItem parts.
---

# EvoTopNav — Evo UI

> Evo UI component skill. Master index: [[evo-ui]].

## Overview

EvoTopNav is a compose-based top navigation bar that renders horizontally on desktop and collapses into a focus-trapped mobile drawer below a configurable breakpoint. It is built from small composable sub-components (Brand, Menu, Item, Actions, Toggle, Dropdown, DropdownItem), keeps the header itself a thin layout primitive, and offers polymorphic items (link / button / `asChild`) plus hover- or click-driven dropdowns — all with zero runtime dependencies.

## Import

```tsx
import { EvoTopNav } from '@justin_evo/evo-ui';
// One-time global stylesheet import (theme tokens + styles):
// import '@justin_evo/evo-ui/dist/evo-ui.css';
```

## When to use

- Building a primary site header / app top bar with a logo, nav links, and actions.
- You need nav links that can render as `<a>`, `<button>`, or a cloned router `<Link>` from one API.
- You need grouped sub-navigation via hover/click dropdown menus.
- You need a responsive header that turns into an accessible mobile drawer (focus trap, scroll lock, Esc-to-close) below a breakpoint.

## When NOT to use

- For a vertical sidebar / side navigation — use [[evo-nav]].
- For a hierarchical location trail — use [[evo-breadcrumb]].
- For switching between in-page views/panels — use [[evo-tabs]].
- For a searchable command launcher overlay — use [[evo-command-palette]].

## Quick start

```tsx
import { EvoTopNav, EvoButton } from '@justin_evo/evo-ui';

function Header() {
  return (
    <EvoTopNav aria-label="Primary">
      <EvoTopNav.Brand>Evo UI</EvoTopNav.Brand>
      <EvoTopNav.Menu>
        <EvoTopNav.Item href="/" active>Home</EvoTopNav.Item>
        <EvoTopNav.Item href="/docs">Docs</EvoTopNav.Item>
        <EvoTopNav.Item href="/blog">Blog</EvoTopNav.Item>
      </EvoTopNav.Menu>
      <EvoTopNav.Actions>
        <EvoButton label="Sign in" variant="ghost" size="sm" />
      </EvoTopNav.Actions>
      <EvoTopNav.Toggle />
    </EvoTopNav>
  );
}
```

## Props

Props for the root `EvoTopNav` component:

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `children` | `React.ReactNode` | — | Yes | Compose Brand, Menu, Item, Actions, Toggle, Dropdown, and DropdownItem sub-components. |
| `open` | `boolean` | — | No | Controlled open state of the mobile drawer. Pair with `onOpenChange`. |
| `defaultOpen` | `boolean` | `false` | No | Uncontrolled initial open state of the drawer. |
| `onOpenChange` | `(open: boolean) => void` | — | No | Fires when the drawer opens or closes. |
| `collapseBelow` | `number` | `768` | No | Width in px below which Menu collapses into the drawer. |
| `className` | `string` | — | No | Extra class applied to the root `<nav>` element. |

`EvoTopNavProps` extends `Omit<React.HTMLAttributes<HTMLElement>, 'onChange'>`, so all native `<nav>` attributes (e.g. `aria-label`, `id`, `style`, `data-*`) plus `ref` and `className` are forwarded to the root `<nav>` element. Always set `aria-label` when the page has more than one `<nav>`.

## Sub-components

### EvoTopNav.Brand

Logo / brand-name slot, rendered on the left. Renders a `<div>`.

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `children` | `React.ReactNode` | — | Yes | Logo or brand name. |
| `className` | `string` | — | No | Extra class on the wrapper. |

Extends `React.HTMLAttributes<HTMLDivElement>` — all native `<div>` attributes plus `ref` and `className` are forwarded to the root `<div>`.

### EvoTopNav.Menu

The nav list. Renders a `<ul>` and must be rendered inside `<EvoTopNav>`. Collapses into the drawer (when a Toggle is present and below `collapseBelow`) or degrades to a horizontal scroll list (when collapsed with no Toggle).

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `children` | `React.ReactNode` | — | Yes | EvoTopNav.Item / EvoTopNav.Dropdown elements. |
| `className` | `string` | — | No | Extra class on the `<ul>`. |

Extends `React.HTMLAttributes<HTMLUListElement>` — all native `<ul>` attributes plus `ref` and `className` are forwarded. Must be rendered inside `<EvoTopNav>` (throws otherwise).

### EvoTopNav.Item

A polymorphic nav item rendered inside a `<li>`. Picks its element by props: `asChild` clones its single child, otherwise `href` renders an `<a>`, otherwise a `<button type="button">`.

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `children` | `React.ReactNode` | — | Yes | Item label, or (with `asChild`) the single element to clone. |
| `active` | `boolean` | — | No | Marks the item as current page (sets `aria-current="page"` and `data-active`). |
| `icon` | `React.ReactNode` | — | No | Icon rendered before the label (wrapped `aria-hidden`). |
| `href` | `string` | — | No | Renders the item as `<a href={...}>`. |
| `target` | `'_self' \| '_blank' \| '_parent' \| '_top'` | — | No | Anchor target; only meaningful with `href`. |
| `rel` | `string` | — | No | Anchor rel. Defaults to `"noopener noreferrer"` when `target="_blank"`. |
| `onClick` | `(e: React.MouseEvent) => void` | — | No | Click handler. With `href`, runs alongside the default navigation. Auto-closes the drawer on activation unless `e.preventDefault()` is called. |
| `asChild` | `boolean` | — | No | Clones the single child and merges our props (className, onClick, aria-current). Use for a router `<Link>`. |
| `className` | `string` | — | No | Extra class on the rendered element. |

Note: `EvoTopNavItemProps` does NOT extend a native element attribute type — only the props above are accepted.

### EvoTopNav.Actions

Right-aligned slot for buttons, badges, avatars. Renders a `<div>`.

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `children` | `React.ReactNode` | — | Yes | Right-aligned content (buttons, badges, avatars). |
| `className` | `string` | — | No | Extra class on the wrapper. |

Extends `React.HTMLAttributes<HTMLDivElement>` — all native `<div>` attributes plus `ref` and `className` are forwarded.

### EvoTopNav.Toggle

The hamburger button that opens/closes the drawer. Renders a `<button type="button">` and must be rendered inside `<EvoTopNav>`. Its presence is what opts the Menu into drawer behaviour when collapsed; without it the Menu degrades to a horizontal scroll list. It auto-wires `aria-expanded`, `aria-controls` (pointing at the Menu id), and a default `aria-label`.

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `icon` | `React.ReactNode` | hamburger / X icon | No | Custom toggle icon. Defaults to the built-in hamburger that becomes an X when open. |
| `aria-label` | `string` | `"Open menu"` / `"Close menu"` | No | Accessible name; defaults based on open state. |
| `className` | `string` | — | No | Extra class on the button. |

Extends `Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'aria-expanded' \| 'aria-controls'>` — all native `<button>` attributes (except the two managed ARIA attributes) plus `ref` and `className` are forwarded. Must be rendered inside `<EvoTopNav>` (throws otherwise). `onClick` runs before the toggle action and can cancel it via `e.preventDefault()`.

### EvoTopNav.Dropdown

A nav item that opens a floating panel of DropdownItems. Renders a `<li>` containing a trigger `<button type="button">` and a `<ul role="menu">`. Opens on hover (fine-pointer devices only, when `hoverable`) and on click.

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `label` | `React.ReactNode` | — | Yes | Trigger label. |
| `icon` | `React.ReactNode` | — | No | Icon shown before the trigger label. |
| `active` | `boolean` | — | No | Marks the dropdown as the current section (sets `aria-current="page"`). |
| `hoverable` | `boolean` | `true` | No | Open on hover on fine-pointer devices (disabled in the drawer and on coarse pointers). |
| `open` | `boolean` | — | No | Controlled open state of the panel. |
| `defaultOpen` | `boolean` | `false` | No | Uncontrolled initial open state. |
| `onOpenChange` | `(open: boolean) => void` | — | No | Open/close callback. |
| `children` | `React.ReactNode` | — | Yes | EvoTopNav.DropdownItem elements. |
| `className` | `string` | — | No | Extra class on the `<li>`. |

Note: `EvoTopNavDropdownProps` does NOT extend a native element attribute type — only the props above are accepted. Implemented as a function component (no forwarded ref).

### EvoTopNav.DropdownItem

An item inside a Dropdown panel, rendered inside a `<li>`. Polymorphic like Item: `asChild` clones its child, otherwise `href` renders an `<a>`, otherwise a `<button type="button">`. Each rendered element carries `role="menuitem"`.

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `children` | `React.ReactNode` | — | Yes | Item label, or (with `asChild`) the element to clone. |
| `icon` | `React.ReactNode` | — | No | Icon rendered before the label. |
| `active` | `boolean` | — | No | Marks the item as current page (sets `aria-current="page"`). |
| `href` | `string` | — | No | Renders as `<a href={...}>`. |
| `target` | `'_self' \| '_blank' \| '_parent' \| '_top'` | — | No | Anchor target; only meaningful with `href`. |
| `rel` | `string` | — | No | Anchor rel. Defaults to `"noopener noreferrer"` when `target="_blank"`. |
| `onClick` | `(e: React.MouseEvent) => void` | — | No | Click handler. On activation, closes the dropdown (and the drawer if inside one) unless `e.preventDefault()` is called. |
| `asChild` | `boolean` | — | No | Clones the single child (use for a router `<Link>`). |
| `className` | `string` | — | No | Extra class on the rendered element. |

Note: `EvoTopNavDropdownItemProps` does NOT extend a native element attribute type — only the props above are accepted.

## Variants & options

EvoTopNav has no `variant` / `severity` / `size` / `shape` props. Its configurable axes are:

- `EvoTopNav.Item.target` / `EvoTopNav.DropdownItem.target` — anchor target, one of:
  - `'_self'` — open in the same browsing context (default browser behavior).
  - `'_blank'` — open in a new tab/window (auto-sets `rel="noopener noreferrer"`).
  - `'_parent'` — open in the parent browsing context.
  - `'_top'` — open in the topmost browsing context.

Polymorphic element selection for Item / DropdownItem (no prop value — driven by which props are present):

- `asChild` present → clones the single child element and merges props (use for router `<Link>`).
- `href` present (no `asChild`) → renders an `<a>`.
- neither → renders a `<button type="button">`.

## Examples

### Polymorphic items (link, button, router Link)

```tsx
import { EvoTopNav } from '@justin_evo/evo-ui';
import { Link, useLocation } from 'react-router-dom';

function Nav({ signOut }: { signOut: () => void }) {
  const { pathname } = useLocation();
  return (
    <EvoTopNav aria-label="Primary">
      <EvoTopNav.Brand>Evo UI</EvoTopNav.Brand>
      <EvoTopNav.Menu>
        {/* renders <a> */}
        <EvoTopNav.Item href="/docs" active={pathname === '/docs'}>Docs</EvoTopNav.Item>
        {/* renders <button type="button"> */}
        <EvoTopNav.Item onClick={signOut}>Sign out</EvoTopNav.Item>
        {/* external link auto-gets rel="noopener noreferrer" */}
        <EvoTopNav.Item href="https://example.com" target="_blank">External</EvoTopNav.Item>
        {/* clones the router Link */}
        <EvoTopNav.Item asChild active={pathname === '/blog'}>
          <Link to="/blog">Blog</Link>
        </EvoTopNav.Item>
      </EvoTopNav.Menu>
    </EvoTopNav>
  );
}
```

### Dropdown sub-menu with icons

```tsx
import { EvoTopNav, EvoButton } from '@justin_evo/evo-ui';

function NavWithDropdown() {
  return (
    <EvoTopNav aria-label="Primary">
      <EvoTopNav.Brand>
        <span style={{ marginRight: '0.375rem' }}>⚡</span>
        Evo UI
      </EvoTopNav.Brand>
      <EvoTopNav.Menu>
        <EvoTopNav.Item href="/" active>Home</EvoTopNav.Item>
        <EvoTopNav.Dropdown label="Products" hoverable>
          <EvoTopNav.DropdownItem href="/analytics">Analytics</EvoTopNav.DropdownItem>
          <EvoTopNav.DropdownItem href="/search">Search</EvoTopNav.DropdownItem>
          <EvoTopNav.DropdownItem onClick={() => console.log('sign out')}>
            Sign out
          </EvoTopNav.DropdownItem>
        </EvoTopNav.Dropdown>
        <EvoTopNav.Item href="/pricing">Pricing</EvoTopNav.Item>
      </EvoTopNav.Menu>
      <EvoTopNav.Actions>
        <EvoButton label="Sign in" variant="ghost" size="sm" />
      </EvoTopNav.Actions>
    </EvoTopNav>
  );
}
```

### Controlled mobile drawer (close on route change)

```tsx
import { useEffect, useState } from 'react';
import { EvoTopNav, EvoButton } from '@justin_evo/evo-ui';
import { useLocation } from 'react-router-dom';

function ResponsiveHeader() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  // Close the drawer whenever the route changes.
  useEffect(() => setOpen(false), [pathname]);

  return (
    <EvoTopNav
      aria-label="Primary"
      open={open}
      onOpenChange={setOpen}
      collapseBelow={768}
    >
      <EvoTopNav.Brand>Evo UI</EvoTopNav.Brand>
      <EvoTopNav.Menu>
        <EvoTopNav.Item href="/" active={pathname === '/'}>Home</EvoTopNav.Item>
        <EvoTopNav.Item href="/docs">Docs</EvoTopNav.Item>
        <EvoTopNav.Dropdown label="Products">
          <EvoTopNav.DropdownItem href="/analytics">Analytics</EvoTopNav.DropdownItem>
          <EvoTopNav.DropdownItem href="/search">Search</EvoTopNav.DropdownItem>
        </EvoTopNav.Dropdown>
      </EvoTopNav.Menu>
      <EvoTopNav.Actions>
        <EvoButton label="Sign in" variant="ghost" size="sm" />
      </EvoTopNav.Actions>
      {/* Required to opt into the drawer; without it the Menu becomes a scroll list */}
      <EvoTopNav.Toggle />
    </EvoTopNav>
  );
}
```

## Accessibility

- The root renders as a semantic `<nav>` and forwards `aria-label`. Always set `aria-label` when the page has more than one `<nav>`.
- `active` on Item / Dropdown / DropdownItem sets `aria-current="page"`, keeping the visual highlight and the screen-reader signal in sync. Item also sets a `data-active` attribute.
- `EvoTopNav.Toggle` auto-wires `aria-expanded` (drawer open state) and `aria-controls` (the Menu's generated id), and gives itself a ≥44px touch target. Its default `aria-label` is "Open menu" / "Close menu".
- `EvoTopNav.Dropdown` trigger exposes `aria-haspopup="menu"`, `aria-expanded`, `aria-controls`, and (when `active`) `aria-current="page"`. The panel is a `<ul role="menu">` whose items carry `role="menuitem"`; when closed the panel is `aria-hidden`.
- Dropdown keyboard support: on the trigger, ArrowDown / Enter / Space open and focus the first item; ArrowUp opens and focuses the last item. Inside the panel, ArrowDown / ArrowUp cycle items, Home / End jump to first / last, Tab leaves and closes the panel, Escape closes and returns focus to the trigger. Clicking outside also closes desktop dropdowns.
- While the drawer is open: focus is trapped inside the Menu (wrapping Tab / Shift+Tab), the body is scroll-locked, Escape closes it, a backdrop click closes it, and focus is restored to the toggle on close. The Menu is `aria-hidden` while the drawer is closed.
- Hover-to-open is disabled automatically on coarse pointers (`(hover: hover) and (pointer: fine)` gates it), so touch devices use click-only. All animations respect `prefers-reduced-motion`.

## Gotchas

- The mobile drawer requires `EvoTopNav.Toggle`. Without a Toggle, below `collapseBelow` the Menu does NOT hide — it degrades to a horizontal scroll list (never hidden silently).
- Open/close state of the drawer uses `open` (controlled) + `onOpenChange`, or `defaultOpen` (uncontrolled). There is no `visible` / `show` prop. Same pattern on `EvoTopNav.Dropdown`.
- `collapseBelow` defaults to `768`; the menu collapses at widths strictly below that value.
- Item, DropdownItem, Toggle, and Dropdown triggers are buttons that default `type="button"` — they never accidentally submit a surrounding `<form>`.
- `Menu`, `Toggle`, `Dropdown`, and `DropdownItem` must be rendered inside `<EvoTopNav>`; `Menu` and `Toggle` throw a descriptive error if used outside it.
- `asChild` requires exactly one child element (it uses `React.Children.only`); your props (className, onClick, aria-current) are merged onto that child.
- Item / DropdownItem with `target="_blank"` auto-apply `rel="noopener noreferrer"` unless you pass your own `rel`.
- `EvoTopNavItemProps`, `EvoTopNavDropdownProps`, and `EvoTopNavDropdownItemProps` do NOT extend native attribute types — passing arbitrary DOM attributes (e.g. `id`, `data-*`) to those parts is not part of the typed API; spreadable native attributes are only available on the root, Brand, Menu, Actions, and Toggle.
- Theme via `var(--evo-color-*)` / `var(--evo-spacing-*)` / `var(--evo-radius-*)` tokens; never hard-code hex colors (breaks dark mode).
- Import the stylesheet `@justin_evo/evo-ui/dist/evo-ui.css` exactly once globally. Use named imports from `@justin_evo/evo-ui` only — never deep paths.

## Related

- [[evo-nav]] — vertical sidebar navigation.
- [[evo-breadcrumb]] — hierarchical location trail.
- [[evo-tabs]] — switch between in-page views.
- [[evo-command-palette]] — searchable command launcher.
- [[evo-button]] — buttons for the Actions slot.
- [[evo-badge]] — status badges for the Actions slot.
- [[evo-theming]] — theme tokens and light/dark mode.
