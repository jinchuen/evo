---
name: evo-modal
description: Use when needing a modal dialog, popup, confirmation prompt, or overlay panel rendered in a portal that closes on Escape or backdrop click and locks body scroll while open — covers EvoModal plus its compound parts EvoModal.Header, EvoModal.Body, and EvoModal.Footer.
---

# EvoModal — Evo UI

> Evo UI component skill. Master index: [[evo-ui]].

## Overview

EvoModal is an accessible dialog rendered through a React portal into `document.body`. It closes on the Escape key or a backdrop click, locks page scroll while open, and is composed from the compound parts `EvoModal.Header`, `EvoModal.Body`, and `EvoModal.Footer` rather than configured through prop arrays.

## Import

```tsx
import { EvoModal } from '@justin_evo/evo-ui';
// One-time, anywhere in your app entry:
// import '@justin_evo/evo-ui/dist/evo-ui.css';
```

## When to use

- Confirmation prompts (delete, discard, proceed) that require a deliberate response.
- Focused tasks shown over the current page: short forms, detail views, settings panels.
- Any overlay that should trap attention, dim the background, and stop page scroll.
- Fullscreen takeovers on small screens via `size="fullscreen"`.

## When NOT to use

- Brief, non-blocking status messages — use a toast/notification ([[evo-notification]]) instead.
- Inline contextual hints on hover/focus — use [[evo-tooltip]].
- Persistent page-level messaging that should not block interaction — use [[evo-alert]].
- Large multi-step flows better served by a dedicated route/page.

## Quick start

```tsx
import { useState } from 'react';
import { EvoModal, EvoButton, EvoStack } from '@justin_evo/evo-ui';

function Example() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <EvoButton label="Open Modal" onClick={() => setOpen(true)} />

      <EvoModal open={open} onClose={() => setOpen(false)}>
        <EvoModal.Header onClose={() => setOpen(false)}>
          Confirm Action
        </EvoModal.Header>
        <EvoModal.Body>
          <p>Are you sure you want to proceed? This action cannot be undone.</p>
        </EvoModal.Body>
        <EvoModal.Footer>
          <EvoStack direction="row" gap="0.75rem" justify="end">
            <EvoButton label="Cancel" variant="outline" severity="secondary" onClick={() => setOpen(false)} />
            <EvoButton label="Confirm" severity="danger" onClick={() => setOpen(false)} />
          </EvoStack>
        </EvoModal.Footer>
      </EvoModal>
    </>
  );
}
```

## Props

`EvoModal` (the main component):

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `open` | `boolean` | — | Yes | Controls modal visibility. When `false` the component renders nothing. |
| `onClose` | `() => void` | — | Yes | Called when the user presses Escape or clicks the backdrop. You are responsible for setting `open` to `false`. |
| `children` | `React.ReactNode` | — | Yes | Modal content, typically `EvoModal.Header` / `EvoModal.Body` / `EvoModal.Footer`. |
| `size` | `'sm' \| 'md' \| 'lg' \| 'fullscreen'` | `'md'` | No | Controls the dialog width (or fullscreen takeover). |
| `className` | `string` | `''` | No | Additional CSS class merged onto the dialog element. |

Note: EvoModal does **not** spread arbitrary native attributes or forward `ref`. Only `className` is merged (onto the inner dialog element); there is no `...rest` passthrough. The dialog is rendered into `document.body` via `ReactDOM.createPortal`.

## Sub-components

### `EvoModal.Header`

Renders the header row. If `onClose` is supplied, a close button (✕) with `aria-label="Close modal"` is shown on the right.

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `children` | `React.ReactNode` | — | Yes | Header content (typically the modal title). |
| `onClose` | `() => void` | — | No | If provided, renders a close button in the header that calls this handler on click. |

### `EvoModal.Body`

Renders the scrollable body region.

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `children` | `React.ReactNode` | — | Yes | Body content. |

### `EvoModal.Footer`

Renders the footer region, typically for action buttons.

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `children` | `React.ReactNode` | — | Yes | Footer content (typically action buttons). |

## Variants & options

`size` — controls dialog width:

- `sm` — small dialog width.
- `md` — medium dialog width (default).
- `lg` — large dialog width.
- `fullscreen` — full-viewport takeover.

## Examples

### Confirmation dialog with danger action

```tsx
import { useState } from 'react';
import { EvoModal, EvoButton, EvoStack } from '@justin_evo/evo-ui';

function DeleteConfirm() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <EvoButton label="Delete" severity="danger" onClick={() => setOpen(true)} />

      <EvoModal open={open} onClose={() => setOpen(false)}>
        <EvoModal.Header onClose={() => setOpen(false)}>Delete item?</EvoModal.Header>
        <EvoModal.Body>
          <p style={{ color: 'var(--evo-color-text-muted)', margin: 0 }}>
            This permanently removes the item. This action cannot be undone.
          </p>
        </EvoModal.Body>
        <EvoModal.Footer>
          <EvoStack direction="row" gap="0.75rem" justify="end">
            <EvoButton label="Cancel" variant="outline" severity="secondary" onClick={() => setOpen(false)} />
            <EvoButton label="Delete" severity="danger" onClick={() => setOpen(false)} />
          </EvoStack>
        </EvoModal.Footer>
      </EvoModal>
    </>
  );
}
```

### Sizes (sm, lg, fullscreen)

```tsx
import { useState } from 'react';
import { EvoModal, EvoButton } from '@justin_evo/evo-ui';

function SizedModal() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <EvoButton label="Open Fullscreen" size="sm" onClick={() => setOpen(true)} />

      <EvoModal open={open} onClose={() => setOpen(false)} size="fullscreen">
        <EvoModal.Header onClose={() => setOpen(false)}>Fullscreen Modal</EvoModal.Header>
        <EvoModal.Body>
          <p style={{ margin: 0 }}>This modal uses size="fullscreen".</p>
        </EvoModal.Body>
        <EvoModal.Footer>
          <EvoButton label="Close" onClick={() => setOpen(false)} />
        </EvoModal.Footer>
      </EvoModal>
    </>
  );
}
```

### Header without a close button

Omit `onClose` on `EvoModal.Header` to render a title-only header (no ✕ button). The modal can still be dismissed via Escape or backdrop click.

```tsx
import { useState } from 'react';
import { EvoModal, EvoButton } from '@justin_evo/evo-ui';

function TitleOnlyHeader() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <EvoButton label="Open" onClick={() => setOpen(true)} />

      <EvoModal open={open} onClose={() => setOpen(false)} size="sm">
        <EvoModal.Header>Notice</EvoModal.Header>
        <EvoModal.Body>
          <p style={{ margin: 0 }}>Press Escape or click outside to dismiss.</p>
        </EvoModal.Body>
        <EvoModal.Footer>
          <EvoButton label="Got it" onClick={() => setOpen(false)} />
        </EvoModal.Footer>
      </EvoModal>
    </>
  );
}
```

## Accessibility

- The dialog element carries `role="dialog"` and `aria-modal="true"`.
- The header close button (rendered only when `EvoModal.Header` receives `onClose`) has `aria-label="Close modal"`.
- **Escape** key triggers `onClose` while the modal is open (a `keydown` listener is attached to `document` only while open).
- **Backdrop click** triggers `onClose` — clicking the overlay (but not the dialog itself) closes the modal.
- **Scroll lock:** while open, `document.body.style.overflow` is set to `hidden` and restored on close/unmount.
- The dialog is rendered in a portal at `document.body`, so it escapes parent stacking/overflow contexts.
- Note: the source does not implement an explicit focus trap or auto-focus; provide focusable controls (e.g. action buttons) inside the modal and verify keyboard reachability for your use case.

## Gotchas

- **`open` is the only state prop.** Per Evo conventions, visibility is always `open` (never `visible`/`show`). When `open` is `false`, EvoModal returns `null` and renders nothing.
- **You must close it yourself.** `onClose` is just a callback fired on Escape/backdrop click — it does not change `open`. Set your state to `false` inside the handler.
- **The header ✕ button only appears if you pass `onClose` to `EvoModal.Header`.** It is separate from the modal's own `onClose`; wire it to the same close handler.
- **`size="fullscreen"` exists** in addition to `sm | md | lg` — this component supports four sizes, not the usual three.
- **No `...rest` / `ref` passthrough.** Unlike many Evo components, EvoModal does not forward arbitrary native attributes or a `ref`; only `className` is merged onto the dialog.
- **Body scroll is locked while open.** If you mount multiple modals, the body overflow is restored on the last unmount/close — be mindful when stacking.
- **Theme with tokens.** Style overrides should use `var(--evo-color-*)`, `var(--evo-spacing-*)`, `var(--evo-radius-*)` — never hard-coded hex, which breaks dark mode.
- **Single CSS import, named imports only.** Import `@justin_evo/evo-ui/dist/evo-ui.css` once at your app entry, and import `EvoModal` from `@justin_evo/evo-ui` — never from a deep path.
- **Action buttons default to `type="button"`** ([[evo-button]]), so footer buttons inside a `<form>` won't accidentally submit it.

## Related

- [[evo-button]] — action buttons for the header/footer.
- [[evo-stack]] — lay out footer action buttons in a row.
- [[evo-alert]] — non-blocking inline messaging.
- [[evo-notification]] — transient toast messages.
- [[evo-tooltip]] — lightweight contextual hints.
- [[evo-theming]] — CSS variable tokens and light/dark mode.
- [[evo-ui]] — master component index.
