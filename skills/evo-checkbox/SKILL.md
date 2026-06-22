---
name: evo-checkbox
description: Use when you need a checkbox with a label, helper text, an indeterminate (dash) "select all" state, disabled state, or a grouped fieldset of related checkboxes in a form. Covers EvoCheckbox and the EvoCheckbox.Group compound part.
---

# EvoCheckbox — Evo UI

> Evo UI component skill. Master index: [[evo-ui]].

## Overview

EvoCheckbox is a styled wrapper around a native `<input type="checkbox">` that adds an optional label, helper text, and a true indeterminate state, while passing every native input attribute straight through to the underlying element. It pairs with `EvoCheckbox.Group`, a semantic `<fieldset>`/`<legend>` wrapper for grouping related checkboxes.

## Import

```tsx
import { EvoCheckbox } from '@justin_evo/evo-ui';
// One-time stylesheet import (e.g. in your app entry):
// import '@justin_evo/evo-ui/dist/evo-ui.css';
```

## When to use

- A single boolean opt-in/opt-out control (terms agreement, newsletter, toggling a setting).
- A "select all" control that needs a third, indeterminate (dash) state when only some children are checked.
- A set of independent multi-select options that should be grouped under a shared legend (use `EvoCheckbox.Group`).
- You want a checkbox that accepts all native input attributes (`checked`, `defaultChecked`, `onChange`, `name`, `value`, `required`, etc.).

## When NOT to use

- A single on/off setting that reads better as a switch — use [[evo-toggle]].
- Mutually exclusive choices where only one option may be selected — use [[evo-radio]].
- A free-text or numeric field — use [[evo-input]].
- Choosing one value from a long list — use [[evo-select]].

## Quick start

```tsx
import { useState } from 'react';
import { EvoCheckbox } from '@justin_evo/evo-ui';

function Example() {
  const [checked, setChecked] = useState(false);

  return (
    <EvoCheckbox
      label="Controlled checkbox"
      checked={checked}
      onChange={(e) => setChecked(e.target.checked)}
    />
  );
}
```

## Props

EvoCheckbox extends `Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'>`.

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `label` | `string` | — | No | Text label rendered next to the checkbox. Also used to derive the input `id` when `id` is not supplied (lowercased, spaces replaced with hyphens). |
| `helperText` | `string` | — | No | Helper text displayed below the checkbox. Only rendered when provided. |
| `indeterminate` | `boolean` | `false` | No | Shows the indeterminate (dash) state. Set imperatively on the underlying input via a ref effect, so it survives re-renders. |
| `className` | `string` | `''` | No | Additional CSS class appended to the root `<div>` wrapper. |
| `disabled` | `boolean` | — | No | Disables the input and applies the disabled styling to the wrapper. |
| `id` | `string` | — | No | The input `id`, also wired to the `<label htmlFor>`. Falls back to a slug derived from `label` when omitted. |

All other native `<input>` attributes (`checked`, `defaultChecked`, `onChange`, `name`, `value`, `required`, `aria-*`, etc.) are spread via `...rest` onto the underlying `<input type="checkbox">`. The `type` attribute is omitted from the props type and is always `"checkbox"` internally — you cannot override it. Note: `className` is applied to the root `<div>` wrapper, and there is no `ref` forwarding to the input (the component manages its own internal ref for the indeterminate state).

## Sub-components

### EvoCheckbox.Group

A semantic `<fieldset>` wrapper that groups related checkboxes under an optional `<legend>`.

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `children` | `React.ReactNode` | — | Yes | The grouped content, typically `EvoCheckbox` elements. |
| `label` | `string` | — | No | Group legend text, rendered in a `<legend>`. Only rendered when provided. |
| `className` | `string` | `''` | No | Additional CSS class appended to the `<fieldset>` root. |

```tsx
<EvoCheckbox.Group label="Preferred contact">
  <EvoCheckbox label="Email" defaultChecked />
  <EvoCheckbox label="Phone" />
  <EvoCheckbox label="SMS" />
</EvoCheckbox.Group>
```

## Examples

### Uncontrolled and controlled

```tsx
import { useState } from 'react';
import { EvoCheckbox } from '@justin_evo/evo-ui';

function Basic() {
  const [checked, setChecked] = useState(false);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--evo-spacing-sm)' }}>
      <EvoCheckbox label="Uncontrolled checkbox" />
      <EvoCheckbox
        label="Controlled checkbox"
        checked={checked}
        onChange={(e) => setChecked(e.target.checked)}
      />
    </div>
  );
}
```

### Indeterminate "select all"

```tsx
import { useState } from 'react';
import { EvoCheckbox } from '@justin_evo/evo-ui';

function SelectAll() {
  const [items, setItems] = useState({ a: true, b: false, c: true });

  const allChecked = Object.values(items).every(Boolean);
  const someChecked = Object.values(items).some(Boolean) && !allChecked;

  const toggleAll = () => {
    const next = !allChecked;
    setItems({ a: next, b: next, c: next });
  };

  return (
    <div>
      <EvoCheckbox
        label="Select all"
        checked={allChecked}
        indeterminate={someChecked}
        onChange={toggleAll}
      />
      <div style={{ paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
        {(['a', 'b', 'c'] as const).map((key) => (
          <EvoCheckbox
            key={key}
            label={`Option ${key.toUpperCase()}`}
            checked={items[key]}
            onChange={(e) => setItems((p) => ({ ...p, [key]: e.target.checked }))}
          />
        ))}
      </div>
    </div>
  );
}
```

### Helper text, disabled, and grouped

```tsx
import { EvoCheckbox } from '@justin_evo/evo-ui';

function Variations() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--evo-spacing-md)' }}>
      <EvoCheckbox label="I agree to the terms" helperText="Required to continue." />
      <EvoCheckbox label="Disabled unchecked" disabled />
      <EvoCheckbox label="Disabled checked" disabled checked />

      <EvoCheckbox.Group label="Preferred contact">
        <EvoCheckbox label="Email" defaultChecked />
        <EvoCheckbox label="Phone" />
        <EvoCheckbox label="SMS" />
      </EvoCheckbox.Group>
    </div>
  );
}
```

## Accessibility

- Renders a real, focusable native `<input type="checkbox">`, so all built-in checkbox keyboard behavior applies: Tab to focus, Space to toggle. No custom key handlers are added or needed.
- The `<label>` is associated with the input via `htmlFor={inputId}`, so clicking the label text or checkmark toggles the input and screen readers announce the label.
- `inputId` is `id` when provided, otherwise a slug derived from `label` (lowercased, spaces → hyphens). If you render multiple checkboxes that share the same `label` and omit `id`, you will get duplicate `id`s — pass an explicit unique `id` in that case so the `htmlFor` association stays correct.
- The indeterminate state is set imperatively on the DOM node (`input.indeterminate = true`) via a ref effect — this is the only correct way to express the third visual state, since `indeterminate` is not a reflected HTML attribute.
- `EvoCheckbox.Group` uses a semantic `<fieldset>` with an optional `<legend>`, the standard accessible pattern for grouping related form controls.
- `disabled` is forwarded to the native input, which removes it from the tab order and exposes the disabled state to assistive tech.

## Gotchas

- The `type` prop is omitted from the props type and forced to `"checkbox"` internally — you cannot and should not pass `type`.
- `className` is applied to the root `<div>` wrapper, not the input. The component does not forward a `ref` to the input; it uses its own internal ref to drive the indeterminate state, so passing `ref` will not reach the input element.
- `indeterminate` is purely visual. It does not change the `checked` value — a checkbox can be `indeterminate` while `checked` is `false`. Manage `checked` and `indeterminate` as separate pieces of state (see the "select all" example).
- Auto-derived `id`: if you omit `id`, the input `id` comes from the `label`. Duplicate labels without explicit `id`s produce duplicate DOM ids — pass a unique `id` to avoid broken label associations.
- Theme via CSS variables (`var(--evo-color-*)`, `var(--evo-spacing-*)`, `var(--evo-radius-*)`); never hard-code hex colors, which breaks dark mode.
- Touch targets are designed to stay >=44px on mobile — do not shrink the control below that.
- Import the stylesheet `@justin_evo/evo-ui/dist/evo-ui.css` exactly once in your app; without it the component is unstyled.
- Use named imports from `@justin_evo/evo-ui` only — never import from deep/internal paths.

## Related

- [[evo-radio]] — single-select alternative for mutually exclusive choices.
- [[evo-toggle]] — switch-style on/off control.
- [[evo-input]] — text and numeric form fields.
- [[evo-select]] — choose from a list of options.
- [[evo-form]] — compose checkboxes with labels and validation in a form.
- [[evo-theming]] — the CSS variable tokens used for theming.
- [[evo-ui]] — master index of all Evo UI components.
