---
name: evo-button
description: Use when you need a clickable button to trigger an action, submit or reset a form, or navigate — including primary/secondary/tertiary actions, danger/warning/success/info intents, icon-only buttons, full-width CTAs, and async buttons with a loading spinner. Covers the EvoButton export.
---

# EvoButton — Evo UI

> Evo UI component skill. Master index: [[evo-ui]].

## Overview

EvoButton is the core action trigger of Evo UI: a native `<button>` wrapper whose visual style, semantic color, size, and shape are independent (orthogonal) props that compose freely. It also bundles common button needs — left/right icons, a built-in loading spinner, and a full-width option — while forwarding every native `<button>` attribute, `ref`, and `className` to the underlying element.

## Import

```tsx
import { EvoButton } from '@justin_evo/evo-ui';
// One-time, app-wide stylesheet import (includes theme tokens):
// import '@justin_evo/evo-ui/dist/evo-ui.css';
```

## When to use

- Triggering an action (save, submit, delete, open a dialog).
- Submitting or resetting a `<form>` (set `type="submit"` / `type="reset"`).
- Primary / secondary / tertiary actions via `variant` (`solid` / `outline` / `ghost` / `soft`).
- Communicating intent via `severity` (primary, secondary, danger, warning, success, info).
- Icon + text or icon-only buttons (use `shape="square"` + `aria-label` for icon-only).
- Async actions that need an inline spinner and disabled-while-busy behavior (`loading`).
- Full-width CTAs in dialog footers, mobile layouts, or call-to-action bars (`fullWidth`).

## When NOT to use

- Navigation that should render an anchor `<a>` for SEO/right-click/open-in-new-tab — EvoButton always renders a `<button>`.
- Two-state on/off controls — use [[evo-toggle]] or [[evo-checkbox]] instead.
- A group of mutually exclusive choices — use [[evo-radio]] or [[evo-select]].

## Quick start

```tsx
import { EvoButton } from '@justin_evo/evo-ui';

export function Example() {
  return <EvoButton label="Save changes" onClick={() => console.log('saved')} />;
}
```

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `label` | `string` | — | No | Text shown inside the button. Convenience shorthand for `children`. |
| `children` | `ReactNode` | — | No | Custom content. Takes precedence over `label` when both are provided (`children ?? label`). Inherited from native button props. |
| `variant` | `'solid' \| 'outline' \| 'ghost' \| 'soft'` | `'solid'` | No | Visual style of the button. |
| `severity` | `'primary' \| 'secondary' \| 'danger' \| 'warning' \| 'success' \| 'info'` | `'primary'` | No | Semantic color theme. |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | No | Button size. |
| `shape` | `'default' \| 'rounded' \| 'square'` | `'default'` | No | Border-radius shape, orthogonal to `variant`. `square` gives an equal width/height box for icon-only buttons. |
| `iconLeft` | `ReactNode` | — | No | Icon rendered before the label. `<svg>` children are auto-sized to 1em so they scale with font-size. |
| `iconRight` | `ReactNode` | — | No | Icon rendered after the label. |
| `loading` | `boolean` | `false` | No | When true, replaces icons with a spinner and disables interaction. `aria-busy` is set automatically. |
| `loadingText` | `string` | — | No | Optional text shown next to the spinner while `loading` is true. (Note: while loading, the normal `label`/`children` are hidden and only `loadingText` shows.) |
| `fullWidth` | `boolean` | `false` | No | Stretch to fill the parent's width. |
| `type` | `'button' \| 'submit' \| 'reset'` | `'button'` | No | Maps to the native button `type`. Defaults to `'button'` so a button inside a `<form>` never submits by accident. |
| `disabled` | `boolean` | — | No | Disables the button. Inherited from native button props. The effective disabled state is `disabled || loading`. |
| `className` | `string` | — | No | Appended to the component's own classes on the root `<button>`. |

This interface extends `ButtonHTMLAttributes<HTMLButtonElement>`, so **all native `<button>` attributes** (`form`, `name`, `value`, `autoFocus`, `onClick`, `onMouseEnter`, all `aria-*`, etc.) plus `ref` and `className` are forwarded to the root `<button>` element via `...rest`.

## Variants & options

### `variant`
- `solid` — filled background; use for primary actions (default).
- `outline` — bordered with transparent background; use for secondary actions.
- `ghost` — no border or background until hover; use for tertiary / toolbar actions.
- `soft` — tinted background using the severity's soft token; use on busy surfaces.

### `severity`
- `primary` — main brand action color (default).
- `secondary` — muted / neutral action.
- `danger` — destructive actions (delete, remove).
- `warning` — cautionary actions.
- `success` — confirming / positive actions.
- `info` — informational actions.

Every severity is defined for every variant — they compose freely.

### `size`
- `sm` — small / compact.
- `md` — default.
- `lg` — large; meets the 44px WCAG touch-target guideline.

### `shape`
- `default` — normal border-radius.
- `rounded` — pill / fully rounded edges.
- `square` — equal width/height 1:1 box; use for icon-only buttons.

## Examples

### Variants and severities composed freely

```tsx
import { EvoButton } from '@justin_evo/evo-ui';

export function Actions() {
  return (
    <>
      <EvoButton label="Solid" variant="solid" />
      <EvoButton label="Outline" variant="outline" severity="secondary" />
      <EvoButton label="Ghost" variant="ghost" />
      <EvoButton label="Delete" variant="soft" severity="danger" />
    </>
  );
}
```

### Icons, icon-only, and full width

```tsx
import { EvoButton } from '@justin_evo/evo-ui';

const PlusIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <path d="M12 5v14M5 12h14" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export function IconButtons() {
  return (
    <>
      <EvoButton label="New item" iconLeft={<PlusIcon />} />
      {/* Icon-only: shape="square" + aria-label for accessibility */}
      <EvoButton shape="square" aria-label="Add" iconLeft={<PlusIcon />} />
      <EvoButton label="Continue" fullWidth iconRight={<PlusIcon />} />
    </>
  );
}
```

### Async loading button

```tsx
import { useState } from 'react';
import { EvoButton } from '@justin_evo/evo-ui';

export function SaveButton() {
  const [loading, setLoading] = useState(false);
  return (
    <EvoButton
      label="Save changes"
      loading={loading}
      loadingText="Saving…"
      severity="success"
      onClick={async () => {
        setLoading(true);
        await new Promise((r) => setTimeout(r, 1500));
        setLoading(false);
      }}
    />
  );
}
```

### Form submit / reset (type is explicit, never auto-submits by default)

```tsx
import { EvoButton } from '@justin_evo/evo-ui';

export function FormFooter() {
  return (
    <form onSubmit={(e) => e.preventDefault()}>
      {/* defaults to type="button" — will NOT submit */}
      <EvoButton label="Cancel" variant="ghost" />
      <EvoButton label="Submit form" type="submit" severity="success" />
      <EvoButton label="Reset form" type="reset" variant="outline" severity="secondary" />
    </form>
  );
}
```

## Accessibility

- Renders a native `<button>` element, so it is keyboard-focusable and activates on Enter and Space by default.
- `type` defaults to `"button"`, preventing accidental form submission when placed inside a `<form>`.
- When `loading` is true, the button sets `aria-busy="true"` and becomes disabled (`disabled || loading`), so it cannot be clicked, focused via pointer, or submitted while busy. When not loading, `aria-busy` is omitted.
- The loading spinner span is marked `aria-hidden="true"` so it is not announced.
- For icon-only buttons (no visible text/`label`/`children`), provide an accessible name via `aria-label` (forwarded through `...rest`). The docs use `shape="square"` with `aria-label` for this pattern.
- Disabled buttons cannot be clicked, focused via pointer, or submitted.
- All native `aria-*` attributes pass through to the root `<button>`.

## Gotchas

- `type` defaults to `"button"`, so EvoButton never auto-submits a form. Set `type="submit"` explicitly when you want submission.
- `loading` both shows a spinner and disables the button (effective disabled = `disabled || loading`); you cannot click it while loading.
- While `loading` is true, the normal `label`/`children` are hidden — only `loadingText` is shown next to the spinner, and `iconLeft`/`iconRight` are not rendered. Pass `loadingText` to keep the button readable while busy.
- `children` wins over `label` when both are passed (`children ?? label`).
- Icon-only buttons need an `aria-label` for an accessible name; the empty-content state automatically gets an icon-only layout class.
- Theme via `var(--evo-color-*)`, `var(--evo-spacing-*)`, `var(--evo-radius-*)` tokens (and `severity`/`variant`) — never hard-code hex colors, which break light/dark mode.
- Use `size="lg"` (or rely on the `min-height` sizing) to keep ≥44px touch targets on mobile.
- Import the stylesheet `@justin_evo/evo-ui/dist/evo-ui.css` exactly once for the whole app, or the button will be unstyled.
- Import only from `@justin_evo/evo-ui` (named import) — never from a deep path.

## Related

- [[evo-form]]
- [[evo-input]]
- [[evo-toggle]]
- [[evo-modal]]
- [[evo-theming]]
- [[evo-ui]]
