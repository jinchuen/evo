---
name: evo-alert
description: Use when you need an inline contextual feedback banner — success/error/warning/info messages, form validation summaries, status notices, or a dismissible callout with an automatic icon and optional title. Covers the EvoAlert component.
---

# EvoAlert — Evo UI

> Evo UI component skill. Master index: [[evo-ui]].

## Overview

EvoAlert is an inline, statically-positioned feedback banner that surfaces a contextual message with an automatic semantic icon. Its core principle is "semantic type drives presentation": a single `type` prop selects both the icon and the color treatment, and the alert can optionally render a bold title and a self-dismissing close button.

## Import

```tsx
import { EvoAlert } from '@justin_evo/evo-ui'
// Import the stylesheet once, at your app entry point:
// import '@justin_evo/evo-ui/dist/evo-ui.css'
```

## When to use

- Inline contextual feedback rendered in the page flow (e.g. above a form, inside a card).
- Communicating success, error, warning, or informational status.
- A short notice the user can dismiss with a close button.
- Pairing a bold title with a longer descriptive body message.

## When NOT to use

- Transient, auto-dismissing pop-up notifications that stack in a corner — use [[evo-notification]] instead.
- Blocking or modal interactions that demand a response — use [[evo-modal]].
- A small inline status label or count — use [[evo-badge]].

## Quick start

```tsx
import { EvoAlert } from '@justin_evo/evo-ui'

function Example() {
  return (
    <EvoAlert type="success" title="Saved">
      Your changes have been saved successfully.
    </EvoAlert>
  )
}
```

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `children` | `React.ReactNode` | — | Yes | Alert body message rendered in the description area. |
| `type` | `'success' \| 'error' \| 'warning' \| 'info'` | `'info'` | No | Semantic type. Determines the automatic icon and color treatment. |
| `title` | `string` | — | No | Bold title rendered above the body message. When omitted, only the body is shown. |
| `dismissible` | `boolean` | `false` | No | When `true`, shows a dismiss (✕) button that hides the alert when clicked. |
| `urgency` | `boolean` | `false` | No | Escalates the severity treatment: filled soft background, heavier 3px left accent, and a bolder title. Orthogonal to `type` — any of the four types can be urgent or not. A loss-aversion cue for messages with a real deadline or cost, not a new color. |
| `className` | `string` | `''` | No | Additional CSS class appended to the root element's class list. |

Note: `EvoAlertProps` extends `React.HTMLAttributes<HTMLDivElement>` (omitting `title` and `children`, which are redeclared above with Evo-specific meaning). `ref` is forwarded to the root `<div>` (`forwardRef<HTMLDivElement, EvoAlertProps>`), and any other native attributes / `...rest` (`id`, `data-*`, `style`, `onClick`, `aria-*`, etc.) are spread onto the root element too.

## Variants & options

`type` (selects icon + color):

- `info` — Informational/neutral message. Icon: `i`. (default)
- `success` — Positive confirmation. Icon: `✓`.
- `error` — Failure or destructive condition. Icon: `✕`.
- `warning` — Caution or non-blocking risk. Icon: `⚠`.

## Examples

### All four semantic types

```tsx
<EvoAlert type="info">This is an informational message.</EvoAlert>
<EvoAlert type="success">Your changes have been saved successfully.</EvoAlert>
<EvoAlert type="warning">Your session will expire in 5 minutes.</EvoAlert>
<EvoAlert type="error">Failed to connect to the server. Please try again.</EvoAlert>
```

### With a bold title

```tsx
<EvoAlert type="success" title="Payment received">
  Your invoice has been paid. A receipt has been sent to your email.
</EvoAlert>

<EvoAlert type="error" title="Authentication failed">
  Invalid credentials. Please check your email and password and try again.
</EvoAlert>
```

### Dismissible alerts

```tsx
<EvoAlert type="info" title="New features available" dismissible>
  We've shipped new components. Check out the changelog for details.
</EvoAlert>

<EvoAlert type="warning" dismissible>
  You have unsaved changes. Don't forget to save before leaving.
</EvoAlert>
```

### Urgent alerts (loss aversion), composed with EvoCountdown

```tsx
import { EvoAlert } from '@justin_evo/evo-ui'
import { EvoCountdown } from '@justin_evo/evo-ui' // once registered in the barrel

<EvoAlert type="warning" title="Discount expires soon" urgency>
  Your 20% renewal discount expires in{' '}
  <EvoCountdown deadline={Date.now() + 47 * 60 * 60 * 1000} />. Renew now to keep it.
</EvoAlert>

<EvoAlert type="error" title="Trial ending" urgency dismissible>
  Your workspace will be downgraded and your data archived in{' '}
  <EvoCountdown deadline={Date.now() + 6 * 60 * 1000} format="clock" />.
</EvoAlert>
```

Reserve `urgency` for alerts backed by a real deadline or real cost of inaction — pairing it with [[evo-countdown]] makes that cost concrete instead of just louder.

### Custom class while keeping theme tokens

```tsx
// Style overrides should reference Evo theme tokens, e.g. in your CSS:
// .promo-alert { border-color: var(--evo-color-primary); }
<EvoAlert type="info" title="Heads up" className="promo-alert">
  This banner uses an extra class but inherits Evo's themed colors.
</EvoAlert>
```

## Accessibility

- The root element is a `<div>` with `role="alert"`, so assistive technology announces the message when it is rendered (an `alert` is a live region with assertive politeness).
- When `dismissible` is `true`, the close button renders an `aria-label="Dismiss alert"` so its purpose is announced even though its visible label is only the `✕` glyph.
- Dismissing is internal state: clicking the dismiss button sets internal `dismissed` state and the component returns `null` (unmounts its content). There is no `onClose`/`onDismiss` callback and no `open` prop — once dismissed by the user it stays dismissed for that mounted instance.
- The dismiss button is a native `<button type="button">` and is keyboard-focusable; activating it with Enter/Space hides the alert. There is no Escape-key handler.
- The dismiss button has a visible `:focus-visible` ring (2px, offset 2px, uses the info focus token) and a distinct `:active` state — keyboard users can always see where focus is (WCAG 2.4.7).
- The dismiss button's hit area is >=44px in both dimensions (via `min-width`/`min-height`, visually pulled back with negative margin so the glyph itself stays small) — meets the 44px minimum touch target on mobile.
- Per-severity icon foreground colors use `--evo-color-{success,danger,warning,info}-fg` tokens (not a fixed white), so the `warning` icon (dark text on amber) keeps sufficient contrast in both light and dark mode.

## Gotchas

- Dismiss state is internal and one-way. There is no `open` prop and no dismiss callback — the component manages a local `dismissed` flag and renders `null` once closed. To re-show it, remount it (e.g. change its React `key`) or control conditional rendering from the parent.
- `type` is the variant prop here (not the library-wide `variant` naming). The only allowed values are `'success' | 'error' | 'warning' | 'info'`; any other string is invalid.
- Ref and native attributes are both forwarded. `ref` forwards to the root `<div>`, and `EvoAlertProps` extends `React.HTMLAttributes<HTMLDivElement>` so `...rest` (`id`, `data-*`, `style`, `onClick`, `aria-*`, etc.) is spread onto the root element too. Passed-in attributes are spread after the built-in ones, so e.g. a caller-supplied `role` overrides the default `role="alert"`.
- `urgency` is additive, not a replacement for `type`. It only intensifies the existing severity color (soft fill + heavier left accent + bolder title) — it never introduces a new color, so reserve it for messages with a genuine deadline or cost; overusing it defeats the loss-aversion signal.
- Theme via tokens, not hex. The alert colors come from Evo CSS variables (`--evo-color-*`); when adding a custom class, style with `var(--evo-color-*)` rather than hard-coded hex values so light/dark mode stays correct.
- Single CSS import. Import `@justin_evo/evo-ui/dist/evo-ui.css` exactly once at your app entry; without it the alert is unstyled.
- Named imports only. Import `{ EvoAlert }` from `@justin_evo/evo-ui` — never from a deep/internal path.
- `children` is required. The component always renders a description area, so an alert with no body is invalid.

## Related

- [[evo-notification]] — transient, auto-dismissing toast notifications that stack in a corner.
- [[evo-modal]] — blocking overlay dialogs for interactions that require a response.
- [[evo-badge]] — compact inline status labels and counts.
- [[evo-countdown]] — live countdown timer; compose it inside an urgent alert to make the cost of inaction concrete.
- [[evo-theming]] — the CSS variable tokens (`--evo-color-*`) that drive alert colors.
- [[evo-ui]] — master index of all Evo UI components.
