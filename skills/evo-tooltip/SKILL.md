---
name: evo-tooltip
description: Use when needing a floating hover/focus label, an explanatory hint on an icon button, a keyboard-shortcut popover, or a small contextual bubble positioned top/bottom/left/right around a trigger element. Covers the EvoTooltip component.
---

# EvoTooltip — Evo UI

> Evo UI component skill. Master index: [[evo-ui]].

## Overview

EvoTooltip is a floating label that appears on hover or focus of its wrapped trigger element. It shows any ReactNode as content, supports four placement directions, and manages its own open/close state internally — you only supply the content and the child trigger.

## Import

```tsx
import { EvoTooltip } from '@justin_evo/evo-ui'
// One-time, app-wide stylesheet import (include once at your app root):
// import '@justin_evo/evo-ui/dist/evo-ui.css'
```

## When to use

- Adding a short explanatory hint to a button, icon, or other control.
- Surfacing supplementary information (a label, a keyboard shortcut, a definition) only on hover/focus.
- Positioning a small bubble relative to a trigger (top, bottom, left, or right).
- Showing rich inline content (badges, formatted text) in a transient floating label.

## When NOT to use

- For persistent, dismissible, or actionable messages — use [[evo-alert]] or [[evo-notification]] instead.
- For content that must be reachable by tapping on touch devices (tooltips show on hover/focus, which is unreliable on touch) — prefer an inline label or a [[evo-modal]].
- For large or interactive content (forms, menus) — use [[evo-modal]] or [[evo-card]].
- For controlled open/close behavior — EvoTooltip manages its own visibility and exposes no `open` prop.

## Quick start

```tsx
import { EvoTooltip, EvoButton } from '@justin_evo/evo-ui'

function Example() {
  return (
    <EvoTooltip content="Save your changes" placement="top">
      <EvoButton label="Save" />
    </EvoTooltip>
  )
}
```

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `content` | `React.ReactNode` | — | Yes | The tooltip content. Accepts any ReactNode (string, element, fragment). |
| `children` | `React.ReactNode` | — | Yes | The element that triggers the tooltip on hover/focus. |
| `placement` | `'top' \| 'bottom' \| 'left' \| 'right'` | `'top'` | No | Preferred tooltip position relative to the trigger. |
| `className` | `string` | `''` | No | Additional CSS class appended to the wrapper `<span>`. |

The props interface does NOT extend a native element attribute type. EvoTooltip renders a wrapper `<span>` and accepts only the four props above — it does not forward `...rest` or `ref`, and `className` is applied to the wrapper span (not the tooltip bubble at the DOM level; it is concatenated onto the wrapper's class list).

## Variants & options

`placement` — preferred position of the tooltip bubble relative to the trigger:

- `top` — bubble appears above the trigger (default).
- `bottom` — bubble appears below the trigger.
- `left` — bubble appears to the left of the trigger.
- `right` — bubble appears to the right of the trigger.

## Examples

### Four placements

```tsx
import { EvoTooltip, EvoButton } from '@justin_evo/evo-ui'

function Placements() {
  return (
    <>
      <EvoTooltip content="Tooltip on top" placement="top">
        <EvoButton label="Top" variant="outline" />
      </EvoTooltip>
      <EvoTooltip content="Tooltip on bottom" placement="bottom">
        <EvoButton label="Bottom" variant="outline" />
      </EvoTooltip>
      <EvoTooltip content="Tooltip on left" placement="left">
        <EvoButton label="Left" variant="outline" />
      </EvoTooltip>
      <EvoTooltip content="Tooltip on right" placement="right">
        <EvoButton label="Right" variant="outline" />
      </EvoTooltip>
    </>
  )
}
```

### Rich ReactNode content

```tsx
import { EvoTooltip, EvoButton, EvoBadge } from '@justin_evo/evo-ui'

function ShortcutTooltip() {
  return (
    <EvoTooltip
      content={
        <div style={{ padding: '0.25rem 0' }}>
          <strong>Keyboard shortcut</strong>
          <div style={{ marginTop: '0.25rem', display: 'flex', gap: '0.25rem' }}>
            <EvoBadge size="sm" variant="outline" severity="secondary">Ctrl</EvoBadge>
            <EvoBadge size="sm" variant="outline" severity="secondary">S</EvoBadge>
          </div>
        </div>
      }
      placement="top"
    >
      <EvoButton label="Save" variant="outline" />
    </EvoTooltip>
  )
}
```

### Hint on a focusable trigger with a custom class

```tsx
import { EvoTooltip, EvoButton } from '@justin_evo/evo-ui'

function HelpHint() {
  return (
    <EvoTooltip
      content="Opens settings in a new panel"
      placement="bottom"
      className="my-tooltip-wrapper"
    >
      <EvoButton label="Settings" />
    </EvoTooltip>
  )
}
```

## Accessibility

- The tooltip bubble renders with `role="tooltip"`, so assistive technology announces it as a tooltip when visible.
- Visibility is driven by both pointer and keyboard events on the wrapper: `onMouseEnter` / `onFocus` show the tooltip, and `onMouseLeave` / `onBlur` hide it. This means a keyboard user who tabs focus onto the trigger sees the tooltip, and it disappears on blur.
- The trigger element you pass as `children` must itself be focusable (e.g. a button or link) for the focus/blur behavior to work — wrapping non-focusable content will only respond to hover.
- There is no Escape-to-dismiss handler and no `aria-describedby` wiring between trigger and tooltip; the relationship is conveyed only by the `role="tooltip"` element appearing adjacent to the focused trigger.
- Note: hover/focus-only tooltips are not reliably reachable on touch devices — provide an alternative for critical information.

## Gotchas

- EvoTooltip is uncontrolled: there is no `open` prop. Visibility is managed internally via hover/focus state — you cannot force it open or closed.
- The component does NOT forward `ref` or spread `...rest` onto its root. Only `content`, `children`, `placement`, and `className` are accepted; other HTML attributes are ignored.
- `className` is appended to the outer wrapper `<span>`, not the tooltip bubble element. To style the bubble itself, target the rendered tooltip via your own CSS or theme tokens.
- The trigger must be keyboard-focusable for the focus/blur path to work; passing inert content makes the tooltip hover-only.
- Hover-only behavior is unreliable on touch screens — do not put information that must be readable on mobile exclusively inside a tooltip.
- Theme via `var(--evo-color-*)`, `var(--evo-spacing-*)`, and `var(--evo-radius-*)` tokens — never hard-coded hex — so the tooltip works in both light and dark mode.
- Import the stylesheet `@justin_evo/evo-ui/dist/evo-ui.css` once at your app root, or the tooltip will be unstyled.
- Use named imports from `@justin_evo/evo-ui` only — never deep import paths.

## Related

- [[evo-button]]
- [[evo-badge]]
- [[evo-modal]]
- [[evo-alert]]
- [[evo-notification]]
- [[evo-theming]]
- [[evo-ui]]
