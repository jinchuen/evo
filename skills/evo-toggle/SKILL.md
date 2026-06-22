---
name: evo-toggle
description: Use when you need a switch/toggle control for a single boolean setting (on/off, enabled/disabled, dark mode, notifications, feature flags) with an optional inline label and sm/md/lg sizing; covers the EvoToggle component.
---

# EvoToggle — Evo UI

> Evo UI component skill. Master index: [[evo-ui]].

## Overview

EvoToggle is a fully controlled switch for boolean settings. It renders a sliding track-and-thumb switch backed by a real checkbox input with `role="switch"`, and supports an optional inline label and three sizes.

## Import

```tsx
import { EvoToggle } from '@justin_evo/evo-ui';
// One-time, anywhere in your app entry:
// import '@justin_evo/evo-ui/dist/evo-ui.css';
```

## When to use

- A single on/off setting (dark mode, email notifications, two-factor auth, feature flags).
- Settings panels where the change applies immediately (no form submission needed).
- When you want an immediately-visible, sliding switch instead of a checkbox.

## When NOT to use

- Selecting one of several mutually exclusive options — use [[evo-radio]] or [[evo-select]].
- A boolean inside a larger form where a check-style affordance fits better — use [[evo-checkbox]].
- A clickable action that performs work rather than holding state — use [[evo-button]].

## Quick start

```tsx
import { useState } from 'react';
import { EvoToggle } from '@justin_evo/evo-ui';

function Example() {
  const [on, setOn] = useState(false);
  return <EvoToggle checked={on} onChange={setOn} label="Enable feature" />;
}
```

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `checked` | `boolean` | — | Yes | Current toggle state (on/off). The component is fully controlled. |
| `onChange` | `(checked: boolean) => void` | — | Yes | Called with the new boolean state when the toggle changes. |
| `label` | `string` | — | No | Optional label text displayed next to the toggle. Rendered only when provided. |
| `disabled` | `boolean` | `false` | No | Disables the toggle and applies the disabled styling. |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | No | Toggle size. |
| `className` | `string` | `''` | No | Additional CSS class appended to the root `<label>` element. |

This component does NOT extend a native element attribute type and does NOT forward `ref` or `...rest`. Only the props listed above are supported; `className` is the single native-style escape hatch, and it is merged onto the root `<label>`. Do not expect arbitrary HTML attributes or a ref to reach the underlying input.

## Variants & options

`size` — controls the switch dimensions (track, thumb size, and thumb travel distance):

- `sm` — small switch.
- `md` — medium switch (default).
- `lg` — large switch.

## Examples

Basic controlled toggle with a state-driven label:

```tsx
import { useState } from 'react';
import { EvoToggle } from '@justin_evo/evo-ui';

function BasicToggle() {
  const [on, setOn] = useState(false);
  return (
    <EvoToggle
      checked={on}
      onChange={setOn}
      label={on ? 'Enabled' : 'Disabled'}
    />
  );
}
```

All three sizes:

```tsx
import { EvoToggle } from '@justin_evo/evo-ui';

function Sizes() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--evo-spacing-2)' }}>
      <EvoToggle checked={true} onChange={() => {}} label="Small" size="sm" />
      <EvoToggle checked={true} onChange={() => {}} label="Medium" size="md" />
      <EvoToggle checked={true} onChange={() => {}} label="Large" size="lg" />
    </div>
  );
}
```

Settings panel with a disabled (locked) option:

```tsx
import { useState } from 'react';
import { EvoToggle } from '@justin_evo/evo-ui';

function Settings() {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--evo-spacing-3)' }}>
      <EvoToggle checked={notifications} onChange={setNotifications} label="Email notifications" />
      <EvoToggle checked={darkMode} onChange={setDarkMode} label="Dark mode" />
      <EvoToggle checked={false} onChange={() => {}} label="Two-factor auth (locked)" disabled />
    </div>
  );
}
```

## Accessibility

- The root element is a `<label>` that wraps the input, so clicking the label (and its text) toggles the switch.
- The underlying control is a real `<input type="checkbox">` with `role="switch"`, giving assistive tech the correct switch semantics and on/off announcement via the native `checked` state.
- Because it is a native checkbox input, it is keyboard-reachable by Tab and toggled with Space by default; focus and the disabled state are handled by the browser.
- When `disabled` is set, the input receives the native `disabled` attribute and the wrapper gets the disabled styling, preventing interaction.
- The visible track/thumb are decorative `<span>` elements; the accessible state comes entirely from the hidden checkbox input.

## Gotchas

- Fully controlled only: you must supply both `checked` and `onChange`. There is no uncontrolled/`defaultChecked` mode — without `onChange` updating state, the toggle will not move.
- The change handler receives a boolean (`(checked: boolean) => void`), not a DOM event. Pass it directly to a `useState` setter (e.g. `onChange={setOn}`).
- State prop is `checked` (boolean), not `open` — `open` is reserved for overlay components in Evo UI.
- No ref or `...rest` pass-through: arbitrary native attributes (e.g. `id`, `name`, `data-*`, `aria-label`) and refs are not forwarded. Only `className` reaches the DOM, on the root `<label>`.
- Sizes are always `'sm' | 'md' | 'lg'`; any other value is not valid.
- Theme via CSS variables (`var(--evo-color-*)`, `var(--evo-spacing-*)`, `var(--evo-radius-*)`); never hard-code hex colors, which break dark mode.
- Import the stylesheet `@justin_evo/evo-ui/dist/evo-ui.css` exactly once in your app, or the switch will render unstyled.
- Use named imports from `@justin_evo/evo-ui` only — never deep import paths.

## Related

- [[evo-checkbox]]
- [[evo-radio]]
- [[evo-select]]
- [[evo-form]]
- [[evo-theming]]
- [[evo-ui]]
