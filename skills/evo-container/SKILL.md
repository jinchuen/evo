---
name: evo-container
description: Use when you need a centered, max-width page or section wrapper to constrain content width and keep layouts readable on wide screens — choosing between sm/md/lg/xl/full widths or a full-bleed container. Covers EvoContainer.
---

# EvoContainer — Evo UI

> Evo UI component skill. Master index: [[evo-ui]].

## Overview

EvoContainer is a presentational layout wrapper that constrains its children to a predefined max-width and centers them horizontally, giving every page a consistent, readable content column. Its core principle is preset widths over arbitrary pixel values: you pick a named `size` rather than hand-tuning a `max-width`.

## Import

```tsx
import { EvoContainer } from '@justin_evo/evo-ui';
// One-time global stylesheet import (e.g. in your app entry):
// import '@justin_evo/evo-ui/dist/evo-ui.css';
```

## When to use

- Wrapping the main content of a page so it does not stretch edge-to-edge on wide monitors.
- Giving multiple sections/pages a shared, consistent content width.
- Centering a content column horizontally within the viewport.
- Picking a deliberate reading width (narrow article vs. wide dashboard).

## When NOT to use

- For row/column flex layouts of items — use [[evo-stack]].
- For 2D column/row grids — use [[evo-grid]].
- For visual separation between content blocks — use [[evo-divider]].
- When you need the element to forward a `ref`, native HTML attributes, or arbitrary `...rest` props to the DOM node — EvoContainer only accepts the props below (see Gotchas).

## Quick start

```tsx
import { EvoContainer } from '@justin_evo/evo-ui';

export function Page() {
  return (
    <EvoContainer size="lg">
      <h1>Welcome</h1>
      <p>This content is constrained to a centered, readable column.</p>
    </EvoContainer>
  );
}
```

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `children` | `React.ReactNode` | — | Yes | Container content rendered inside the wrapper. |
| `size` | `'sm' \| 'md' \| 'lg' \| 'xl' \| 'full'` | `'lg'` | No | Max-width preset for the content column. |
| `centered` | `boolean` | `true` | No | Centers the container horizontally within its parent. |
| `className` | `string` | `''` | No | Additional CSS class appended to the root element. |

EvoContainer renders a single `<div>` as its root. It accepts only the four props above; it does **not** forward a `ref`, spread `...rest`, or accept arbitrary native HTML attributes. Only `className` is merged onto the root element.

## Variants & options

### `size`
- `sm` — smallest max-width preset; narrow reading column.
- `md` — medium max-width preset.
- `lg` — large max-width preset (default).
- `xl` — extra-large max-width preset; wide layouts/dashboards.
- `full` — full-width; the container spans the available width with no max-width constraint.

### `centered`
- `true` — horizontally centers the container (default).
- `false` — leaves the container aligned to its parent's normal flow (not centered).

## Examples

### Default large, centered container

```tsx
import { EvoContainer } from '@justin_evo/evo-ui';

export function Article() {
  return (
    <EvoContainer>
      <h1>Article title</h1>
      <p>Defaults to size="lg" and centered.</p>
    </EvoContainer>
  );
}
```

### Narrow column for focused reading

```tsx
import { EvoContainer } from '@justin_evo/evo-ui';

export function NarrowForm() {
  return (
    <EvoContainer size="sm">
      <h2>Sign in</h2>
      <p>A narrow, centered column keeps short forms comfortable to read.</p>
    </EvoContainer>
  );
}
```

### Full-bleed, non-centered section

```tsx
import { EvoContainer } from '@justin_evo/evo-ui';

export function HeroSection() {
  return (
    <EvoContainer size="full" centered={false}>
      <div
        style={{
          background: 'var(--evo-color-primary)',
          color: 'var(--evo-color-on-primary)',
          padding: 'var(--evo-spacing-lg)',
          borderRadius: 'var(--evo-radius-md)',
        }}
      >
        Full-width hero content with no max-width cap.
      </div>
    </EvoContainer>
  );
}
```

### Every size, stacked

```tsx
import { EvoContainer } from '@justin_evo/evo-ui';

export function SizeShowcase() {
  return (
    <>
      <EvoContainer size="sm">sm container</EvoContainer>
      <EvoContainer size="md">md container</EvoContainer>
      <EvoContainer size="lg">lg container</EvoContainer>
      <EvoContainer size="xl">xl container</EvoContainer>
      <EvoContainer size="full">full container</EvoContainer>
    </>
  );
}
```

## Accessibility

EvoContainer is purely presentational. It renders a plain `<div>` with no `role`, `aria-*`, `tabIndex`, focus management, or keyboard handlers — it is a layout-only wrapper and conveys no semantics of its own. Place semantic landmark elements (`<main>`, `<section>`, `<header>`, etc.) and headings inside it as needed; the container does not change the accessibility tree.

## Gotchas

- `children` is required — EvoContainer always renders a wrapper `<div>` around its content.
- Not a `forwardRef` component: you cannot attach a `ref` to it, and it does **not** spread `...rest`/native HTML attributes (`id`, `onClick`, `data-*`, `style`, etc.) onto the root. Only `children`, `size`, `centered`, and `className` have any effect. If you need DOM attributes or a ref, wrap your own element inside the container.
- The default `size` is `'lg'`, and the default `centered` is `true` — omit those props to get a wide, centered column.
- `size` includes `'xl'` and `'full'` in addition to the usual `'sm' | 'md' | 'lg'`. `full` removes the max-width constraint entirely.
- Theme via `var(--evo-color-*)`, `var(--evo-spacing-*)`, and `var(--evo-radius-*)` tokens for any inner styling — never hard-code hex values, which breaks dark mode.
- Import styles once globally via `@justin_evo/evo-ui/dist/evo-ui.css`; without it the preset widths and centering will not apply.
- Use named imports from `@justin_evo/evo-ui` only — never deep import paths.

## Related

- [[evo-stack]]
- [[evo-grid]]
- [[evo-divider]]
- [[evo-card]]
- [[evo-theming]]
- [[evo-ui]]
