---
name: evo-tabs
description: Use when organizing related content into switchable sections behind clickable tab triggers — tabbed panels, settings sections, "Overview / Usage / API" style navigation within a single view; covers EvoTabs and its EvoTabs.List, EvoTabs.Tab, and EvoTabs.Panel compound parts.
---

# EvoTabs — Evo UI

> Evo UI component skill. Master index: [[evo-ui]].

## Overview

EvoTabs is a composable, context-driven tabs component for splitting related content into switchable sections. You assemble it from compound parts (`EvoTabs.List`, `EvoTabs.Tab`, `EvoTabs.Panel`), and panels are matched to their triggering tab by a shared `id` string. Only the active panel renders; inactive panels are unmounted.

## Import

```tsx
import { EvoTabs } from '@justin_evo/evo-ui';
// One-time, app-wide stylesheet import (include once, e.g. in your root):
// import '@justin_evo/evo-ui/dist/evo-ui.css';
```

## When to use

- Splitting a single view into mutually exclusive sections the user switches between (e.g. Overview / Usage / API).
- Settings or detail screens grouped into labeled panes.
- Any place where only one content panel should be visible at a time and the others are reachable by clicking a label.

## When NOT to use

- Cross-page or app-level navigation — use [[evo-nav]], [[evo-topnav]], or [[evo-breadcrumb]].
- Sequential steps that must be completed in order (wizards/steppers) — tabs imply free, non-linear switching.
- Showing multiple panels at once, or content that should all stay mounted/visible simultaneously.

## Quick start

```tsx
import { EvoTabs } from '@justin_evo/evo-ui';

function Example() {
  return (
    <EvoTabs defaultTab="tab1">
      <EvoTabs.List>
        <EvoTabs.Tab id="tab1">Tab 1</EvoTabs.Tab>
        <EvoTabs.Tab id="tab2">Tab 2</EvoTabs.Tab>
      </EvoTabs.List>
      <EvoTabs.Panel id="tab1">Content 1</EvoTabs.Panel>
      <EvoTabs.Panel id="tab2">Content 2</EvoTabs.Panel>
    </EvoTabs>
  );
}
```

## Props

### EvoTabs (root)

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `children` | `React.ReactNode` | — | Yes | The tabs content: an `EvoTabs.List` plus the `EvoTabs.Panel`s. |
| `defaultTab` | `string` | `''` | No | The `id` of the initially active tab. If omitted (defaults to an empty string), no panel matches and none renders until a tab is clicked. |
| `className` | `string` | `''` | No | Extra class names appended to the root wrapper `<div>`. |

This component is a plain function component. It does **not** use `forwardRef` and does **not** spread `...rest` onto its root, so `ref` and arbitrary native HTML attributes are not forwarded — only `children`, `defaultTab`, and `className` are accepted. The same applies to every sub-component below.

## Sub-components

### EvoTabs.List

Renders a `<div role="tablist">` that groups the tab triggers.

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `children` | `React.ReactNode` | — | Yes | The `EvoTabs.Tab` triggers. |
| `className` | `string` | `''` | No | Extra class names appended to the list `<div>`. |

### EvoTabs.Tab

Renders a `<button role="tab">` trigger. Clicking it makes its `id` the active tab. Must be used inside an `EvoTabs` (throws "Tab components must be used within EvoTabs" otherwise).

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `id` | `string` | — | Yes | Unique tab identifier. Must match the `id` of its corresponding `EvoTabs.Panel`. |
| `children` | `React.ReactNode` | — | Yes | The tab label content. |
| `disabled` | `boolean` | `false` | No | Disables the tab button (sets the native `disabled` attribute and a disabled style). |
| `className` | `string` | `''` | No | Extra class names appended to the tab `<button>`. |

### EvoTabs.Panel

Renders a `<div role="tabpanel">` containing the panel content. Returns `null` (unmounts) when its `id` is not the active tab. Must be used inside an `EvoTabs`.

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `id` | `string` | — | Yes | Must match the `id` of the corresponding `EvoTabs.Tab`; the panel shows only when this tab is active. |
| `children` | `React.ReactNode` | — | Yes | Panel content, shown when its tab is active. |
| `className` | `string` | `''` | No | Extra class names appended to the panel `<div>`. |

## Examples

### Basic tabs

```tsx
import { EvoTabs } from '@justin_evo/evo-ui';

function BasicTabs() {
  return (
    <EvoTabs defaultTab="overview">
      <EvoTabs.List>
        <EvoTabs.Tab id="overview">Overview</EvoTabs.Tab>
        <EvoTabs.Tab id="usage">Usage</EvoTabs.Tab>
        <EvoTabs.Tab id="api">API</EvoTabs.Tab>
      </EvoTabs.List>
      <EvoTabs.Panel id="overview">
        <p style={{ color: 'var(--evo-color-text)' }}>
          Use tabs to organize related content into sections.
        </p>
      </EvoTabs.Panel>
      <EvoTabs.Panel id="usage">Usage details here.</EvoTabs.Panel>
      <EvoTabs.Panel id="api">API reference here.</EvoTabs.Panel>
    </EvoTabs>
  );
}
```

### Disabled tab

```tsx
import { EvoTabs } from '@justin_evo/evo-ui';

function WithDisabledTab() {
  return (
    <EvoTabs defaultTab="a">
      <EvoTabs.List>
        <EvoTabs.Tab id="a">Available</EvoTabs.Tab>
        <EvoTabs.Tab id="b">Also Available</EvoTabs.Tab>
        <EvoTabs.Tab id="c" disabled>Coming Soon</EvoTabs.Tab>
      </EvoTabs.List>
      <EvoTabs.Panel id="a">Panel A content.</EvoTabs.Panel>
      <EvoTabs.Panel id="b">Panel B content.</EvoTabs.Panel>
      <EvoTabs.Panel id="c">Panel C content.</EvoTabs.Panel>
    </EvoTabs>
  );
}
```

### Custom class names on parts

```tsx
import { EvoTabs } from '@justin_evo/evo-ui';

function StyledTabs() {
  return (
    <EvoTabs defaultTab="settings" className="my-tabs">
      <EvoTabs.List className="my-tab-list">
        <EvoTabs.Tab id="settings" className="my-tab">Settings</EvoTabs.Tab>
        <EvoTabs.Tab id="billing" className="my-tab">Billing</EvoTabs.Tab>
      </EvoTabs.List>
      <EvoTabs.Panel id="settings" className="my-panel">
        Settings content.
      </EvoTabs.Panel>
      <EvoTabs.Panel id="billing" className="my-panel">
        Billing content.
      </EvoTabs.Panel>
    </EvoTabs>
  );
}
```

## Accessibility

- **Semantic ARIA roles.** `EvoTabs.List` renders `role="tablist"`, each `EvoTabs.Tab` renders a `<button role="tab">`, and each `EvoTabs.Panel` renders `<div role="tabpanel">`.
- **Selected state.** The active tab button gets `aria-selected={true}`; all others get `aria-selected={false}`.
- **Disabled tabs.** A `disabled` tab sets the native `disabled` attribute on its `<button>`, removing it from the tab/click flow.
- **Native button activation.** Tabs are real `<button>` elements, so they are focusable and activate with mouse click and (because they're buttons) Enter/Space.
- **Note / limitation:** the source does not implement arrow-key roving focus between tabs, `aria-controls`/`aria-labelledby` wiring between tab and panel, or an explicit `tabIndex`/roving `tabindex`. There is no Escape handling. Keyboard users tab to each trigger individually.

## Gotchas

- **IDs must match.** Each `EvoTabs.Tab id` must exactly equal the `EvoTabs.Panel id` you want it to reveal. A mismatch (or a `defaultTab` that matches no panel) means no panel renders.
- **`defaultTab` defaults to `''`.** If you omit `defaultTab` and no tab has the id `''`, no panel is shown until the user clicks a tab. Always set `defaultTab` to a real tab id.
- **Inactive panels unmount.** A non-active `EvoTabs.Panel` returns `null`, so its children are removed from the DOM (state inside them resets on switch). Don't rely on hidden panels keeping mounted state.
- **Must be composed inside `EvoTabs`.** `EvoTabs.Tab` and `EvoTabs.Panel` read context; rendering them outside an `EvoTabs` throws `"Tab components must be used within EvoTabs"`.
- **No ref / no rest spread.** Unlike many Evo components, EvoTabs and its parts do not forward `ref` or arbitrary native attributes — only `className` (and `id` where listed). Don't expect `onClick`, `data-*`, `style`, etc. to pass through to the root.
- **Buttons don't auto-submit.** Tab triggers are native `<button>`s; if you place tabs inside a `<form>`, note this component does not explicitly set `type="button"`, so confirm behavior if used within a form.
- **Theme via tokens, not hex.** Style customizations should use Evo CSS variables (e.g. `var(--evo-color-text)`, `var(--evo-spacing-*)`, `var(--evo-radius-*)`), never hard-coded hex, to preserve light/dark mode.
- **Single CSS import, named import only.** Import the stylesheet `@justin_evo/evo-ui/dist/evo-ui.css` once for the whole app, and import `EvoTabs` by name from `@justin_evo/evo-ui` — never from a deep path.

## Related

- [[evo-nav]]
- [[evo-topnav]]
- [[evo-breadcrumb]]
- [[evo-pagination]]
- [[evo-card]]
- [[evo-divider]]
- [[evo-theming]]
- [[evo-ui]]
