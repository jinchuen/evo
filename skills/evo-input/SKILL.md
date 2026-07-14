---
name: evo-input
description: Use when you need a styled text input with an optional label, helper text, error/validation message, leading or trailing adornments (icons, prefixes, suffixes), one of three sizes, full-width stretching, or any native input behavior (type, placeholder, onChange, disabled, value). Covers EvoInput.
---

# EvoInput — Evo UI

> Evo UI component skill. Master index: [[evo-ui]].

## Overview

EvoInput is a styled single-line text input that wraps a native `<input>` with an optional label, helper text, error message, and leading/trailing adornments. It composes accessibility wiring (label association, `aria-invalid`, `aria-describedby`) for you while passing through every native input attribute, so it behaves like a regular input with consistent Evo theming.

## Import

```tsx
import { EvoInput } from '@justin_evo/evo-ui';
// Import the stylesheet once, at your app root: import '@justin_evo/evo-ui/dist/evo-ui.css';
```

## When to use

- Collecting a single line of text: usernames, emails, passwords, search terms, amounts, etc.
- You want a label, helper text, or an error/validation message rendered and wired up automatically.
- You need a prefix/suffix or icon inside the field (e.g. a search icon, `$` prefix, `USD` suffix).
- You need consistent `sm` / `md` / `lg` sizing and optional full-width layout.

## When NOT to use

- Multi-line / rich text input → use [[evo-rich-text-area]].
- Choosing from a list of options → use [[evo-select]], [[evo-autocomplete]], or [[evo-tree-select]].
- Boolean or multi-choice toggles → use [[evo-checkbox]], [[evo-radio]], or [[evo-toggle]].
- Orchestrating multiple fields with shared layout/validation → wrap fields with [[evo-form]].

## Quick start

```tsx
import { EvoInput } from '@justin_evo/evo-ui';

function Example() {
  return <EvoInput label="Username" placeholder="Enter username" />;
}
```

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `label` | `string` | — | No | Label displayed above the input. When set (and no explicit `id` is given), it also generates the input's `id` from the lowercased, hyphenated label text and is associated to the input via `htmlFor`. |
| `helperText` | `string` | — | No | Helper text rendered below the input. Hidden when `error` is present. |
| `error` | `string` | — | No | Error message rendered (in error styling) below the input. When set, marks the input `aria-invalid` and replaces any `helperText`. |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | No | Input size. |
| `leadingAdornment` | `React.ReactNode` | — | No | Element rendered before the input text (e.g. an icon or `$` prefix). |
| `trailingAdornment` | `React.ReactNode` | — | No | Element rendered after the input text (e.g. a unit suffix). |
| `fullWidth` | `boolean` | `false` | No | Stretches the field to fill its container's width. |
| `className` | `string` | `''` | No | Additional class names appended to the root wrapper `<div>`. |
| `id` | `string` | — | No | Explicit input id. When omitted, falls back to the auto-generated id derived from `label`. Used to link the input to its helper/error text. |
| `ref` | `React.Ref<HTMLInputElement>` | — | No | Forwarded to the native `<input>` element (via `forwardRef`). Use for `react-hook-form`'s `register()`, programmatic `.focus()`/`.select()`, or any DOM measurement. |

EvoInputProps extends `Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>` — so all native input attributes (`placeholder`, `type`, `value`, `defaultValue`, `onChange`, `disabled`, `required`, `name`, `autoComplete`, etc.) plus `className` are forwarded. Native attributes via `...rest` are applied to the inner `<input>` element; `className` is applied to the root wrapper `<div>`. Note: `size` is overridden to Evo's `'sm' | 'md' | 'lg'` union and does not pass through to the native `size` attribute. `EvoInput` is defined with `forwardRef<HTMLInputElement, EvoInputProps>` and has `displayName = 'EvoInput'`.

## Variants & options

`size` — controls the input's dimensions:

- `sm` — small input.
- `md` — medium input (default).
- `lg` — large input.

## Examples

### Helper text and error message

```tsx
import { EvoInput } from '@justin_evo/evo-ui';

function Fields() {
  return (
    <>
      <EvoInput
        label="Email"
        type="email"
        placeholder="you@example.com"
        helperText="We'll never share your email."
      />
      <EvoInput
        label="Password"
        type="password"
        placeholder="••••••••"
        error="Password must be at least 8 characters."
      />
    </>
  );
}
```

### Sizes

```tsx
import { EvoInput } from '@justin_evo/evo-ui';

function Sizes() {
  return (
    <>
      <EvoInput size="sm" placeholder="Small input" />
      <EvoInput size="md" placeholder="Medium input" />
      <EvoInput size="lg" placeholder="Large input" />
    </>
  );
}
```

### Adornments (leading icon, prefix and suffix)

```tsx
import { EvoInput } from '@justin_evo/evo-ui';

function Adornments() {
  return (
    <>
      <EvoInput
        label="Search"
        placeholder="Search..."
        leadingAdornment={<span style={{ fontSize: '0.9rem' }}>🔍</span>}
      />
      <EvoInput
        label="Amount"
        placeholder="0.00"
        leadingAdornment={<span style={{ color: 'var(--evo-color-text-muted)', fontWeight: 600 }}>$</span>}
        trailingAdornment={<span style={{ color: 'var(--evo-color-text-muted)', fontSize: '0.8rem' }}>USD</span>}
      />
    </>
  );
}
```

### Controlled input + full width

```tsx
import { useState } from 'react';
import { EvoInput } from '@justin_evo/evo-ui';

function Controlled() {
  const [value, setValue] = useState('');
  return (
    <EvoInput
      label="Full width input"
      placeholder="Stretches to container width"
      value={value}
      onChange={(e) => setValue(e.target.value)}
      fullWidth
    />
  );
}
```

## Accessibility

- The `<label>` is associated with the input via `htmlFor`/`id`. The `id` is taken from the `id` prop, or auto-derived from `label` (lowercased, whitespace replaced with hyphens). If you render multiple inputs with identical labels and no explicit `id`, supply a unique `id` to each to avoid duplicate ids.
- `aria-invalid` is set to `true` whenever `error` is present, otherwise `false`.
- `aria-describedby` points to the error message element (`{id}-error`) when `error` is set, otherwise to the helper text element (`{id}-helper`) when `helperText` is set, otherwise it is omitted.
- The error message renders in a `<p id="{id}-error">` and the helper text in a `<p id="{id}-helper">`; only one of the two is shown at a time (error takes precedence).
- The underlying element is a native `<input>`, so it is keyboard-focusable and supports all native input semantics; no custom keyboard handlers are added.
- The wrapper shows a visible focus ring (`:focus-within` border + box-shadow) whenever the input is focused, and darkens its border on hover for a clearer affordance.
- Every size (`sm`/`md`/`lg`) meets the 44px minimum touch target on coarse-pointer (touch) devices via a `@media (pointer: coarse)` bump, per WCAG target-size guidance.

## Gotchas

- `error` overrides `helperText`: when `error` is set, the helper text is not rendered.
- The input's `id` may be auto-generated from `label`. For unique/stable wiring (e.g. repeated labels, or programmatic focus), pass an explicit `id`.
- `size` is the Evo size union (`'sm' | 'md' | 'lg'`), not the native HTML `size` attribute — it is intentionally omitted from the native attributes and will not set the input's character width.
- `className` is applied to the root wrapper `<div>`, not the inner `<input>`. Other native attributes in `...rest` go to the `<input>`.
- `EvoInput` forwards `ref` to the native `<input>` — pass it directly to `react-hook-form`'s `register()` or a `useRef<HTMLInputElement>` for `.focus()`/`.select()`.
- Theme via Evo CSS variable tokens (`var(--evo-color-*)`, `var(--evo-spacing-*)`, `var(--evo-radius-*)`) — never hard-code hex colors, which break light/dark mode.
- Import the stylesheet `@justin_evo/evo-ui/dist/evo-ui.css` exactly once at your app root, or the input will render unstyled.
- Use named imports from `@justin_evo/evo-ui` only — do not import from deep internal paths.

## Related

- [[evo-form]] — group and lay out multiple inputs with shared structure.
- [[evo-select]] — choose from a fixed list of options.
- [[evo-autocomplete]] — text input with suggestion dropdown.
- [[evo-checkbox]] — boolean and multi-choice inputs.
- [[evo-rich-text-area]] — multi-line and rich text editing.
- [[evo-theming]] — CSS variable tokens that style this component.
- [[evo-ui]] — master component index.
