---
name: evo-form
description: Use when building a form layout — login/signup forms, settings pages, multi-section profile or account forms, or wrapping non-Evo controls with consistent label/description/error/required metadata; covers EvoForm and its slots EvoForm.Header, EvoForm.Section, EvoForm.Row, EvoForm.Field, EvoForm.Actions, plus the useFormContext hook.
---

# EvoForm — Evo UI

> Evo UI component skill. Master index: [[evo-ui]].

## Overview

EvoForm is a lightweight, composable form layout system. The root renders a real `<form>` and shares a `disabled` / `size` / `layout` context with its children, while a small set of slot components (Header, Section, Row, Field, Actions) assemble everything from a single login form to a multi-section settings page.

## Import

```tsx
import { EvoForm, useFormContext } from '@justin_evo/evo-ui';
// One-time global stylesheet import (e.g. in your app entry):
// import '@justin_evo/evo-ui/dist/evo-ui.css';
```

## When to use

- Laying out a form with consistent spacing, headers, sections, and a footer action row.
- Grouping fields into titled sections (stacked or split two-column layout).
- Placing fields side-by-side that wrap on small screens (EvoForm.Row).
- Decorating non-Evo controls (date pickers, file uploaders, custom widgets) with a label, helper description, error message, or required asterisk via EvoForm.Field.
- Disabling or sizing an entire form's controls at once via context.

## When NOT to use

- You only need a single bare input with its own built-in label — use [[evo-input]] directly; EvoForm.Field is optional.
- You need form state management, validation engine, or submit orchestration — EvoForm is layout only; wire `onSubmit` and validation yourself.
- You need a non-form layout grid — use [[evo-grid]] or [[evo-stack]].

## Quick start

```tsx
import { EvoForm, EvoInput, EvoButton } from '@justin_evo/evo-ui';

function SignInForm() {
  return (
    <EvoForm maxWidth={420} onSubmit={(e) => e.preventDefault()}>
      <EvoForm.Field>
        <EvoInput label="Email" type="email" fullWidth />
      </EvoForm.Field>
      <EvoForm.Field>
        <EvoInput label="Password" type="password" fullWidth />
      </EvoForm.Field>
      <EvoForm.Actions align="between" divider={false}>
        <EvoButton variant="ghost" label="Forgot password?" />
        <EvoButton label="Sign in" />
      </EvoForm.Actions>
    </EvoForm>
  );
}
```

## Props

Root component `EvoForm`:

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `children` | `React.ReactNode` | — | Yes | Form content — typically EvoForm.Header, EvoForm.Section, EvoForm.Row, EvoForm.Field, and EvoForm.Actions. |
| `disabled` | `boolean` | `false` | No | Disables all child form inputs via context (read by Evo controls and `useFormContext`). |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | No | Density / spacing preset shared via context. |
| `layout` | `'vertical' \| 'horizontal'` | `'vertical'` | No | Layout hint passed via context for child controls. |
| `maxWidth` | `number \| string` | `undefined` | No | Caps the form width. Convenient shorthand applied to the root `<form>` style; merges with any `style` you pass. |
| `className` | `string` | `''` | No | Additional CSS class for the root `<form>`. |
| `style` | `React.CSSProperties` | `undefined` | No | Inline styles for the root `<form>`; merged after `maxWidth` when both are set. |

`EvoFormProps` extends `React.FormHTMLAttributes<HTMLFormElement>`, so all native `<form>` attributes (`onSubmit`, `action`, `method`, `noValidate`, `id`, `name`, event handlers, etc.) plus `className` are forwarded to the root `<form>` element via `...rest`.

## Sub-components

### EvoForm.Header

Renders a `<header>` with an optional badge, title (`<h2>`), description (`<p>`), and extra children.

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `title` | `React.ReactNode` | `undefined` | No | Heading shown at the top of the form (rendered as `<h2>`). |
| `description` | `React.ReactNode` | `undefined` | No | Subtitle shown below the title (rendered as `<p>`). |
| `badge` | `React.ReactNode` | `undefined` | No | Small label above the title (e.g. "Account", "Step 2 of 4"). |
| `children` | `React.ReactNode` | `undefined` | No | Extra content rendered after the description. |
| `className` | `string` | `''` | No | Additional CSS class for the `<header>`. |

### EvoForm.Section

Renders a `<section>` that groups fields under an optional heading (`<h3>`) and description.

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `title` | `React.ReactNode` | `undefined` | No | Section heading (rendered as `<h3>`). |
| `description` | `React.ReactNode` | `undefined` | No | Supporting copy under the section title. |
| `variant` | `'stacked' \| 'split'` | `'stacked'` | No | `'split'` places the title/description in a dedicated left column on wide screens; stacks vertically on mobile. |
| `children` | `React.ReactNode` | — | Yes | Fields and rows belonging to this section. |
| `className` | `string` | `''` | No | Additional CSS class for the `<section>`. |

### EvoForm.Row

Renders a `<div>` that places fields side-by-side and wraps on small screens.

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `gap` | `'sm' \| 'md' \| 'lg'` | `'md'` | No | Horizontal spacing between fields. |
| `align` | `'start' \| 'center' \| 'end'` | `'start'` | No | Vertical alignment of children. |
| `children` | `React.ReactNode` | — | Yes | Fields placed side-by-side; wraps on small screens. |
| `className` | `string` | `''` | No | Additional CSS class for the row `<div>`. |

### EvoForm.Field

A layout wrapper for a single control. With no `label` / `description` / `error`, it renders a bare wrapper `<div>` around its children. When any of those are provided, it renders a `<label>`, the control, and either an error or description line.

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `label` | `React.ReactNode` | `undefined` | No | Optional label rendered above the control (as `<label htmlFor=...>`). Use when wrapping non-Evo widgets. |
| `description` | `React.ReactNode` | `undefined` | No | Helper text shown below the control when there is no error. |
| `error` | `React.ReactNode` | `undefined` | No | Error message shown below the control. Takes precedence over `description`. |
| `required` | `boolean` | `undefined` | No | Adds an asterisk (`*`, `aria-hidden`) next to the label. |
| `htmlFor` | `string` | auto-generated | No | Sets the label `for` attribute. Auto-generated via React `useId` (`evo-field-<id>`) when omitted. |
| `children` | `React.ReactNode` | — | Yes | The form control(s) being wrapped. |
| `className` | `string` | `''` | No | Additional CSS class for the field `<div>`. |

### EvoForm.Actions

Renders a `<div>` footer row for action buttons (typically Cancel / Submit).

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `align` | `'left' \| 'right' \| 'center' \| 'between'` | `'right'` | No | Horizontal alignment of the action buttons. |
| `divider` | `boolean` | `true` | No | Renders a subtle top border above the actions row. |
| `children` | `React.ReactNode` | — | Yes | Typically EvoButton elements (Cancel / Submit). |
| `className` | `string` | `''` | No | Additional CSS class for the actions `<div>`. |

### useFormContext()

Hook that reads the current form context from any child component. Returns `{ disabled?: boolean; size?: 'sm' | 'md' | 'lg'; layout?: 'vertical' | 'horizontal' }`. Useful when building custom controls that need to respect the form's `disabled` or `size` state. Returns an empty object (`{}`) when called outside an EvoForm.

```tsx
import { useFormContext } from '@justin_evo/evo-ui';

const MyCustomField = () => {
  const { disabled, size } = useFormContext();
  return <button type="button" disabled={disabled} data-size={size}>…</button>;
};
```

## Variants & options

`EvoForm` — `size`:
- `sm` — compact density / spacing.
- `md` — default density / spacing.
- `lg` — roomy density / spacing.

`EvoForm` — `layout`:
- `vertical` — default; layout hint shared via context.
- `horizontal` — alternate layout hint shared via context.

`EvoForm.Section` — `variant`:
- `stacked` — default; title/description stacked above the fields.
- `split` — title/description in a dedicated left column on wide screens, stacked on mobile.

`EvoForm.Row` — `gap`:
- `sm` — small horizontal spacing between fields.
- `md` — default horizontal spacing.
- `lg` — large horizontal spacing.

`EvoForm.Row` — `align`:
- `start` — default; align children to the top.
- `center` — vertically center children.
- `end` — align children to the bottom.

`EvoForm.Actions` — `align`:
- `left` — buttons grouped to the left.
- `right` — default; buttons grouped to the right.
- `center` — buttons centered.
- `between` — buttons pushed to opposite ends (space-between).

## Examples

### Complete multi-section form

```tsx
import {
  EvoForm, EvoInput, EvoSelect, EvoCheckbox, EvoButton,
} from '@justin_evo/evo-ui';

function ProfileSettings({ loading, handleSubmit, roles }) {
  return (
    <EvoForm disabled={loading} maxWidth={640} onSubmit={handleSubmit}>
      <EvoForm.Header
        badge="Account"
        title="Profile settings"
        description="Update your personal information."
      />

      <EvoForm.Section title="Personal" description="Your name and contact info.">
        <EvoForm.Row>
          <EvoForm.Field><EvoInput label="First name" fullWidth /></EvoForm.Field>
          <EvoForm.Field><EvoInput label="Last name" fullWidth /></EvoForm.Field>
        </EvoForm.Row>
        <EvoForm.Field>
          <EvoInput label="Email" type="email" fullWidth />
        </EvoForm.Field>
      </EvoForm.Section>

      <EvoForm.Section title="Workspace">
        <EvoForm.Field>
          <EvoSelect label="Role" options={roles} fullWidth />
        </EvoForm.Field>
        <EvoForm.Field>
          <EvoCheckbox label="Subscribe to product updates" />
        </EvoForm.Field>
      </EvoForm.Section>

      <EvoForm.Actions>
        <EvoButton variant="ghost" label="Cancel" />
        <EvoButton label="Save changes" />
      </EvoForm.Actions>
    </EvoForm>
  );
}
```

### Split-section layout

```tsx
import { EvoForm, EvoCheckbox } from '@justin_evo/evo-ui';

<EvoForm onSubmit={(e) => e.preventDefault()}>
  <EvoForm.Section
    variant="split"
    title="Notifications"
    description="Choose what we email you about. You can change these anytime."
  >
    <EvoForm.Field><EvoCheckbox label="Weekly product digest" defaultChecked /></EvoForm.Field>
    <EvoForm.Field><EvoCheckbox label="Security alerts" defaultChecked /></EvoForm.Field>
    <EvoForm.Field><EvoCheckbox label="Marketing announcements" /></EvoForm.Field>
  </EvoForm.Section>
</EvoForm>
```

### Field metadata on a non-Evo control (label / description / error / required)

```tsx
import { EvoForm, EvoInput } from '@justin_evo/evo-ui';

<>
  <EvoForm.Field
    label="API key"
    description="Generated automatically. Rotate it from the security tab."
    required
  >
    <code style={{ color: 'var(--evo-color-text)' }}>
      sk_live_••••••••••••••••a93f
    </code>
  </EvoForm.Field>

  <EvoForm.Field label="Webhook URL" error="URL must use HTTPS." required>
    <EvoInput placeholder="https://example.com/webhook" fullWidth />
  </EvoForm.Field>
</>
```

### Actions alignment

```tsx
import { EvoForm, EvoButton } from '@justin_evo/evo-ui';

<EvoForm onSubmit={(e) => e.preventDefault()}>
  <EvoForm.Actions align="between" divider={false}>
    <EvoButton variant="ghost" label="Cancel" />
    <EvoButton label="Confirm" />
  </EvoForm.Actions>
</EvoForm>
// align also accepts "left", "right" (default), and "center".
```

## Accessibility

- Root renders a semantic `<form>` element; native attributes like `onSubmit`, `noValidate`, `action`, and `method` pass straight through.
- `EvoForm.Header` renders semantic landmark/heading structure: a `<header>` containing `<h2>` (title) and `<p>` (description).
- `EvoForm.Section` renders a `<section>` with an `<h3>` title for document outline structure.
- `EvoForm.Field` renders a real `<label>` with an `htmlFor` that is auto-generated (`evo-field-<id>` via React `useId`) when not supplied, so labels associate with controls. Pass a matching `htmlFor`/control `id` when wrapping a custom control to wire the association explicitly.
- When `required`, the asterisk span is marked `aria-hidden="true"` so screen readers do not announce a bare "asterisk"; convey requiredness on the control itself (e.g. the input's `required`/`aria-required`).
- When an `error` is present, the field message renders with `role="alert"` so assistive technology announces it; the field wrapper also gets an error state class.
- The component does not implement custom keyboard handling or focus management — tab order and key behavior come from the native form controls you place inside it.

## Gotchas

- EvoForm is layout + context only. It does NOT manage values, validation, or submission — wire your own `onSubmit` handler (and call `e.preventDefault()` to stop a full-page navigation).
- `disabled` on the root only propagates through React context. Evo controls and components reading `useFormContext` honor it; a plain `<input>` you drop in will NOT be disabled automatically — read `useFormContext` yourself or set `disabled` on it.
- Buttons placed in `EvoForm.Actions` default `type="button"` (Evo convention) and will not submit the form by accident. To make a button submit, set `type="submit"` explicitly.
- `EvoForm.Field` is a bare wrapper unless you pass `label`, `description`, or `error` — passing only `required` without a `label` renders no asterisk (the asterisk lives inside the label).
- `error` takes precedence over `description`: when both are set, only the error line is shown.
- `maxWidth` is merged into the root `style`; if you also pass `style`, your `style` keys win for any overlapping property (object spread order is `{ maxWidth, ...style }`).
- Theme via CSS variables (`var(--evo-color-*)`, `var(--evo-spacing-*)`, `var(--evo-radius-*)`); never hard-code hex colors — they break dark mode.
- Import the stylesheet `@justin_evo/evo-ui/dist/evo-ui.css` exactly once globally; use named imports from `@justin_evo/evo-ui` (no deep paths).
- Interactive controls inside a form should keep ≥44px touch targets on mobile; rely on Evo control sizing rather than shrinking them with custom CSS.

## Related

- [[evo-input]]
- [[evo-select]]
- [[evo-checkbox]]
- [[evo-radio]]
- [[evo-toggle]]
- [[evo-button]]
- [[evo-divider]]
- [[evo-theming]]
