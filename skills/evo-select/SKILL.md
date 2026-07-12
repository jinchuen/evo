---
name: evo-select
description: Use when you need a custom dropdown / select control for a form — single or multi-select, with searchable options, clearable values, rich options (icon + description), disabled options, max-selection caps, select-all, chips or count summaries, sizes, and error/helper text. Covers EvoSelect.
---

# EvoSelect — Evo UI

> Evo UI component skill. Master index: [[evo-ui]].

## Overview

EvoSelect is a fully custom, accessible dropdown that replaces the native `<select>`. It is keyboard-navigable and screen-reader friendly, supports both single and multi-select via a discriminated union on the `multiple` prop, and renders rich options (icon + description), in-menu search, clearable values, max-selection caps, and select-all controls. Theming flows through Evo CSS variables and it works in light and dark mode.

## Import

```tsx
import { EvoSelect } from '@justin_evo/evo-ui';
import type { SelectOption, EvoSelectProps } from '@justin_evo/evo-ui';
// One-time global stylesheet import (in your app entry):
// import '@justin_evo/evo-ui/dist/evo-ui.css';
```

## When to use

- You need a dropdown to pick one value (or several) from a known list of options.
- You want searchable / filterable options inside the menu.
- Options need icons, secondary descriptions, or individually disabled rows.
- You need multi-select with chips, a count summary, a cap, or a "Select all".
- You want a clearable value and inline label / helper / error text.

## When NOT to use

- You need free-text entry with suggestions that creates new values — use [[evo-autocomplete]].
- You are picking from a hierarchical tree of options — use [[evo-tree-select]].
- A simple binary on/off — use [[evo-toggle]] or [[evo-checkbox]].
- A small fixed set of mutually exclusive choices shown inline — use [[evo-radio]].

## Quick start

```tsx
import { useState } from 'react';
import { EvoSelect } from '@justin_evo/evo-ui';

const options = [
  { value: 'us', label: 'United States' },
  { value: 'uk', label: 'United Kingdom' },
  { value: 'ca', label: 'Canada' },
];

function CountryField() {
  const [country, setCountry] = useState('');
  return (
    <EvoSelect
      label="Country"
      options={options}
      placeholder="Select a country"
      value={country}
      onChange={setCountry}
      helperText="Used for billing region"
    />
  );
}
```

## Props

EvoSelect is a discriminated union: `EvoSelectProps = EvoSelectSingleProps | EvoSelectMultipleProps`. Both share a common base. Pass `multiple` (boolean) to switch modes; this changes the types of `value`, `defaultValue`, and `onChange`.

### Common props (all modes)

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `options` | `SelectOption[]` | — | Yes | Array of options. Each is `{ value, label, description?, icon?, disabled? }`. |
| `label` | `string` | — | No | Label rendered above the select, wired to the trigger via `htmlFor`. |
| `placeholder` | `string` | `'Select an option'` | No | Shown in the trigger when nothing is selected. |
| `helperText` | `string` | — | No | Helper text below the select (hidden when `error` is set). |
| `error` | `string` | — | No | Error message below the select; replaces `helperText` and sets `aria-invalid`. |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | No | Control size. |
| `fullWidth` | `boolean` | `false` | No | Stretch the field to the container width. |
| `disabled` | `boolean` | `false` | No | Disable the control. |
| `searchable` | `boolean` | `false` | No | Show a search input at the top of the menu that filters options by label (case-insensitive). |
| `clearable` | `boolean` | `false` | No | Show a clear button in the trigger when a value is selected. |
| `id` | `string` | auto (`evo-select-{useId}`) | No | Custom id for the trigger button. Auto-generated if omitted. |
| `name` | `string` | — | No | Renders hidden input(s) for native HTML form submission (one per selected value in multi mode). |
| `className` | `string` | `''` | No | Extra class on the outer field wrapper `<div>`. |

### Single-select props (`EvoSelectSingleProps`, when `multiple` is `false` or omitted)

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `multiple` | `false` | — | No | Selects single mode (the default). |
| `value` | `string` | — | No | Controlled selected value. |
| `defaultValue` | `string` | `''` | No | Initial uncontrolled value. |
| `onChange` | `(value: string) => void` | — | No | Called with the newly selected value string. |

### Multi-select props (`EvoSelectMultipleProps`, when `multiple` is `true`)

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `multiple` | `true` | — | Yes | Selects multi-select mode. |
| `value` | `string[]` | — | No | Controlled array of selected values. |
| `defaultValue` | `string[]` | `[]` | No | Initial uncontrolled array of values. |
| `onChange` | `(value: string[]) => void` | — | No | Called with the new array of selected values. |
| `multipleDisplay` | `'chips' \| 'count'` | `'chips'` | No | How the trigger displays selected items. |
| `maxSelections` | `number` | — | No | Maximum number of options that can be selected at once. |
| `showSelectAll` | `boolean` | `false` | No | Show Select-all / Clear-all buttons at the top of the menu. |

The outer wrapper is a `<div>` and only `className` is forwarded to it (alongside `label`, `id`, `name`). EvoSelect does **not** forward a `ref` or arbitrary `...rest` native attributes — its props interface is a closed set, not an extension of `HTMLAttributes`. The trigger is a `<button type="button" role="combobox">`.

### SelectOption shape

| Field | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `value` | `string` | — | Yes | Unique value submitted/emitted for this option. |
| `label` | `string` | — | Yes | Visible label; also what `searchable` filters against. |
| `description` | `string` | — | No | Secondary line shown under the label in the menu. |
| `icon` | `React.ReactNode` | — | No | Leading icon shown in the option row and in the trigger when selected. |
| `disabled` | `boolean` | — | No | Marks the option non-selectable. |

## Variants & options

- **`size`**
  - `sm` — compact height.
  - `md` — default height.
  - `lg` — large height.
- **`multipleDisplay`** (multi-select only)
  - `chips` — each selected option renders as a removable chip in the trigger (default).
  - `count` — trigger shows the first selected label plus a `+N more` hint, keeping a fixed height.

## Examples

### Multi-select with chips and search

```tsx
import { useState } from 'react';
import { EvoSelect } from '@justin_evo/evo-ui';

const countries = [
  { value: 'us', label: 'United States', icon: <span>🇺🇸</span> },
  { value: 'uk', label: 'United Kingdom', icon: <span>🇬🇧</span> },
  { value: 'jp', label: 'Japan', icon: <span>🇯🇵</span> },
];

function Countries() {
  const [values, setValues] = useState<string[]>(['us', 'jp']);
  return (
    <EvoSelect
      multiple
      label="Countries"
      options={countries}
      placeholder="Pick one or more"
      value={values}
      onChange={setValues}
      searchable
      helperText={`Selected: ${values.length || 'none'}`}
    />
  );
}
```

### Capped multi-select with Select-all and a count summary

```tsx
import { useState } from 'react';
import { EvoSelect } from '@justin_evo/evo-ui';

function CappedPicker({ options }: { options: { value: string; label: string }[] }) {
  const [values, setValues] = useState<string[]>([]);
  return (
    <EvoSelect
      multiple
      multipleDisplay="count"
      showSelectAll
      maxSelections={3}
      label="Pick up to 3"
      options={options}
      value={values}
      onChange={setValues}
      searchable
      helperText="Maximum of three selections."
    />
  );
}
```

### Rich options with descriptions, a disabled option, and an error

```tsx
import { useState } from 'react';
import { EvoSelect } from '@justin_evo/evo-ui';

const roleOptions = [
  { value: 'admin', label: 'Admin', description: 'Full access to all settings' },
  { value: 'editor', label: 'Editor', description: 'Can create and edit content' },
  { value: 'viewer', label: 'Viewer', description: 'Read-only access' },
  { value: 'guest', label: 'Guest', description: 'Limited preview only', disabled: true },
];

function RoleField() {
  const [role, setRole] = useState('');
  return (
    <EvoSelect
      label="Role"
      options={roleOptions}
      placeholder="Choose a role"
      value={role}
      onChange={setRole}
      clearable
      error={!role ? 'Please select a role to continue.' : undefined}
    />
  );
}
```

### Sizes, full width, and disabled

```tsx
import { EvoSelect } from '@justin_evo/evo-ui';

<EvoSelect size="sm" options={options} placeholder="Small" />
<EvoSelect size="md" options={options} placeholder="Medium (default)" />
<EvoSelect size="lg" options={options} placeholder="Large" />
<EvoSelect fullWidth label="Country" options={options} placeholder="Select a country" />
<EvoSelect label="Country" options={options} placeholder="Select a country" disabled />
```

## Accessibility

- The trigger is a `<button type="button">` with `role="combobox"`, `aria-haspopup="listbox"`, `aria-expanded` (bound to open state), `aria-controls` pointing at the listbox id, `aria-invalid` (true when `error` is set), and `aria-multiselectable` (true in multi mode).
- The menu is a `<div role="listbox">` with `aria-labelledby` (the trigger id), `aria-multiselectable` in multi mode, and `aria-activedescendant` pointing at the active option's id.
- Each option is a `<div role="option">` with `aria-selected` and `aria-disabled`; the active option is tracked for keyboard navigation and auto-scrolled into view.
- `label` is a real `<label htmlFor={id}>` wired to the trigger.
- Keyboard interactions:
  - **Enter / Space / ArrowDown / ArrowUp** (when closed) — open the menu.
  - **ArrowDown / ArrowUp** (when open) — move the active option, skipping disabled rows.
  - **Home / End** — jump to the first / last selectable option.
  - **Enter** (when open) — select/toggle the active option. In single mode this also closes the menu and returns focus to the trigger; in multi mode the menu stays open.
  - **Escape** — close the menu and return focus to the trigger.
  - **Tab** — close the menu and move focus onward.
- Clicking outside the component (mousedown) closes the menu and resets the search query.
- When `searchable`, the search input auto-focuses ~30ms after opening; arrow/enter navigation works while typing.
- Chip remove buttons and the clear button are `role="button"` with `tabIndex={-1}` and descriptive `aria-label`s (`Remove {label}`, `Clear selection`); they call `preventDefault` on mousedown so they don't steal focus.

## Gotchas

- **`multiple` changes the value contract.** With `multiple`, `value`/`defaultValue` are `string[]` and `onChange` receives `string[]`. Without it they are `string`. Mixing them (e.g. passing a string to a `multiple` select) is a type error.
- **Controlled vs uncontrolled.** Passing `value` makes it controlled — you must update it via `onChange` or selection won't stick. Omit `value` (optionally set `defaultValue`) for uncontrolled use. Uncontrolled default is `''` (single) or `[]` (multi).
- **`maxSelections` only applies in multi mode.** Once the cap is reached, unselected options become non-selectable (greyed) until one is removed; the trigger and keyboard both respect this. Already-selected options can still be deselected.
- **`multipleDisplay`, `maxSelections`, `showSelectAll` are multi-only.** They are ignored unless `multiple` is `true`.
- **`searchable` filters by `label` only**, case-insensitively — not by `value` or `description`. An empty filtered list shows a "No results" row.
- **The trigger never auto-submits.** It is `type="button"`, so it is safe inside a `<form>`.
- **Form submission via `name`.** Setting `name` renders hidden `<input>`(s) so the value posts with native form submit — one hidden input per selected value in multi mode.
- **Theme via tokens, not hex.** Style through `var(--evo-color-*)`, `var(--evo-spacing-*)`, `var(--evo-radius-*)`; never hard-code colors (it breaks dark mode).
- **One CSS import, named imports only.** Import `@justin_evo/evo-ui/dist/evo-ui.css` once at the app root and import `EvoSelect` from `@justin_evo/evo-ui` — never from a deep path.
- **No ref / rest passthrough.** Unlike most Evo inputs, EvoSelect's props are a closed set; only `className`, `id`, `name`, and `label` reach the DOM. Do not expect arbitrary native attributes or a forwarded `ref`.
- The dropdown menu is viewport-aware: it renders in a portal and flips upward when the trigger is near the bottom of the screen, so it is never clipped by `overflow: hidden` / scroll containers (including inside an EvoModal). Automatic; no props.

## Related

- [[evo-autocomplete]] — free-text input with filtered suggestions.
- [[evo-tree-select]] — selecting from a hierarchical tree.
- [[evo-checkbox]] — multi-choice when options are shown inline.
- [[evo-radio]] — single choice shown inline.
- [[evo-input]] — plain text input field.
- [[evo-form]] — composing fields, labels, and validation.
- [[evo-theming]] — theme tokens and light/dark mode.
- [[evo-ui]] — master component index.
