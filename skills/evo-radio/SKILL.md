---
name: evo-radio
description: Use when building a single-choice form control — a set of mutually exclusive options where exactly one can be selected (plan pickers, size/quantity choices, settings toggles between named values), rendered as a labeled radio button group. Covers EvoRadio and its compound part EvoRadio.Group.
---

# EvoRadio — Evo UI

> Evo UI component skill. Master index: [[evo-ui]].

## Overview

EvoRadio is a radio button group for single-selection. The individual `EvoRadio` items share selection state through a React context supplied by `EvoRadio.Group`, so each item knows whether it is checked and how to report a change without prop drilling.

## Import

```tsx
import { EvoRadio } from '@justin_evo/evo-ui';
// One-time, app-wide stylesheet import (include once at your app root):
// import '@justin_evo/evo-ui/dist/evo-ui.css';
```

## When to use

- Picking exactly one option from a small, visible set (plans, sizes, shipping methods).
- You want all options shown at once (unlike a select dropdown).
- You need a labeled group with a legend describing the choice.

## When NOT to use

- Multiple independent on/off choices → use [[evo-checkbox]].
- A single boolean on/off → use [[evo-toggle]] or [[evo-checkbox]].
- Many options or limited space where a dropdown is better → use [[evo-select]].
- Free-text or value entry → use [[evo-input]].

## Quick start

```tsx
import { useState } from 'react';
import { EvoRadio } from '@justin_evo/evo-ui';

function PlanPicker() {
  const [plan, setPlan] = useState('starter');

  return (
    <EvoRadio.Group name="plan" label="Choose a plan" value={plan} onChange={setPlan}>
      <EvoRadio value="starter" label="Starter — Free forever" />
      <EvoRadio value="pro" label="Pro — $9/month" />
      <EvoRadio value="enterprise" label="Enterprise — Custom pricing" />
    </EvoRadio.Group>
  );
}
```

## Props

### EvoRadio (the option item)

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `value` | `string` | — | Yes | Value of this radio option. The item is checked when it matches the group's `value`. |
| `label` | `string` | — | Yes | Label text displayed next to the radio. |
| `disabled` | `boolean` | `false` | No | Disables this radio option (non-interactive, dimmed). |
| `className` | `string` | `''` | No | Additional CSS class applied to the item's root `<div>`. |

`EvoRadio` renders a `<div>` wrapper containing a native `<input type="radio">` and a `<label>`. It does NOT forward `ref` or spread arbitrary `...rest` native attributes — only the listed props are accepted. `className` is the only pass-through, and it is concatenated onto the root `<div>`.

## Sub-components

### EvoRadio.Group (the required container)

Provides the radio group context. Render your `EvoRadio` items as `children` inside it. Without a surrounding `EvoRadio.Group`, an `EvoRadio` is never checked and its selection change is a no-op (see Gotchas).

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `children` | `React.ReactNode` | — | Yes | The `EvoRadio` items belonging to this group. |
| `name` | `string` | — | Yes | HTML `name` attribute shared by every radio in the group; also used to build each input's `id`. |
| `value` | `string` | — | Yes | The currently selected value. The matching `EvoRadio` renders as checked. |
| `onChange` | `(value: string) => void` | — | Yes | Called with the newly selected option's `value` when the selection changes. |
| `label` | `string` | — | No | Group legend label; rendered as a `<legend>` when provided. |
| `className` | `string` | `''` | No | Additional CSS class applied to the group's root `<fieldset>`. |

`EvoRadio.Group` renders a `<fieldset>` (with an optional `<legend>` when `label` is set). It does NOT forward `ref` or spread arbitrary `...rest` native attributes — only the listed props are accepted.

## Examples

### Basic group with a legend

```tsx
import { useState } from 'react';
import { EvoRadio } from '@justin_evo/evo-ui';

function Example() {
  const [plan, setPlan] = useState('starter');

  return (
    <EvoRadio.Group name="plan" label="Choose a plan" value={plan} onChange={setPlan}>
      <EvoRadio value="starter" label="Starter — Free forever" />
      <EvoRadio value="pro" label="Pro — $9/month" />
      <EvoRadio value="enterprise" label="Enterprise — Custom pricing" />
    </EvoRadio.Group>
  );
}
```

### With a disabled option

```tsx
import { useState } from 'react';
import { EvoRadio } from '@justin_evo/evo-ui';

function SizePicker() {
  const [size, setSize] = useState('md');

  return (
    <EvoRadio.Group name="size" label="Size" value={size} onChange={setSize}>
      <EvoRadio value="sm" label="Small" />
      <EvoRadio value="md" label="Medium" />
      <EvoRadio value="lg" label="Large" />
      <EvoRadio value="xl" label="Extra Large (unavailable)" disabled />
    </EvoRadio.Group>
  );
}
```

### No legend, with a custom class on the group

```tsx
import { useState } from 'react';
import { EvoRadio } from '@justin_evo/evo-ui';

function Shipping() {
  const [method, setMethod] = useState('standard');

  return (
    <EvoRadio.Group
      name="shipping"
      value={method}
      onChange={setMethod}
      className="my-shipping-group"
    >
      <EvoRadio value="standard" label="Standard (5–7 days)" />
      <EvoRadio value="express" label="Express (1–2 days)" />
    </EvoRadio.Group>
  );
}
```

## Accessibility

- The group renders a semantic `<fieldset>`; when `label` is provided it renders a `<legend>`, which is the accessible name for the whole group.
- Each option renders a native `<input type="radio">` paired with a `<label htmlFor={id}>`, so clicking the label text toggles the input and screen readers announce the option text. The `id` is derived as `` `${name}-${value}` `` (or `radio-${value}` when no group context is present).
- All radios in a group share the same `name`, giving native browser radio-group semantics: arrow-key navigation between options, single-selection enforcement, and Tab focus entering/leaving the group are handled by the browser. No custom key handlers are added.
- `disabled` sets the native `disabled` attribute, removing the option from the tab order and selection.
- Theme tokens drive the visuals so focus rings and the selected mark remain visible in both light and dark mode; touch targets meet the >=44px mobile requirement via the component's CSS.

## Gotchas

- `EvoRadio` MUST be rendered inside an `EvoRadio.Group`. Outside the group there is no context, so `checked` is always `false` and clicking does nothing (the change handler is a no-op). The standalone `EvoRadioGroup` component is not exported on its own — use it only as `EvoRadio.Group`.
- This is a controlled component: pass both `value` and `onChange` to `EvoRadio.Group` and store the selection in your own state. There is no internal/uncontrolled mode.
- `onChange` receives the selected option's `value` string directly — not a DOM event. Call your state setter with it (e.g. `onChange={setPlan}`).
- Neither `EvoRadio` nor `EvoRadio.Group` forwards `ref` or spreads extra native attributes; only the documented props (including `className`) are honored. Do not expect to pass arbitrary `<input>`/`<fieldset>` attributes through.
- `value` and `label` on `EvoRadio` are both required strings — every option needs a unique `value` within the group and a human-readable `label`.
- Theme via `var(--evo-color-*)` tokens; never hard-code hex colors, which would break dark mode.
- Single CSS import: include `@justin_evo/evo-ui/dist/evo-ui.css` once at your app root. Use named imports from `@justin_evo/evo-ui` only — no deep import paths.

## Related

- [[evo-checkbox]]
- [[evo-toggle]]
- [[evo-select]]
- [[evo-input]]
- [[evo-form]]
- [[evo-theming]]
- [[evo-ui]]
