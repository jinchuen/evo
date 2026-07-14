---
name: evo-notification
description: Use when an app needs toast notifications (success/error/warning/info, promise, progress, coalesced), a global notification center (bell + unread badge + panel/inbox), or imperative notify-from-anywhere feedback outside the React tree — covers EvoNotification (.Provider, .Toaster, .Bell, .Panel, .Item) and the evoNotify singleton.
---

# EvoNotification — Evo UI

> Evo UI component skill. Master index: [[evo-ui]].

## Overview

EvoNotification is a unified, global notification system that pairs transient toasts with a persistent notification center (bell + panel/inbox). Its core principle is a module-level singleton (`evoNotify`) callable from any file — event handlers, async functions, even a WebSocket `onmessage` outside the React tree — with no hook or React context required.

## Import

```tsx
import { EvoNotification, evoNotify } from '@justin_evo/evo-ui';
// Also available as named exports: EvoNotificationProvider, EvoNotificationToaster,
// EvoNotificationBell, EvoNotificationPanel, EvoNotificationItem, useEvoInbox,
// and the types EvoToastOptions, EvoInboxItem, EvoInboxItemInput, EvoNotificationAnchor,
// EvoNotificationSeverity, EvoToastProgressHandle, EvoPromiseMessages.
// One-time stylesheet import (typically at your app root):
// import '@justin_evo/evo-ui/dist/evo-ui.css';
```

## When to use

- Transient feedback after an action: saved, copied, failed, queued.
- A promise-driven toast that walks itself through loading → success / error.
- A determinate progress toast for uploads/exports/batch jobs.
- Coalescing repeated events (autosave, bulk actions) into one counted card.
- A notification center: a bell with an unread badge plus a dropdown panel/inbox.
- Firing notifications from outside React (sockets, SSE, plain async code).

## When NOT to use

- In-page, declarative, persistent banners (e.g. "Your trial ends in 3 days") — use [[evo-alert]] instead, the persistent counterpart to this transient + accumulated system.
- Blocking confirmation dialogs — use [[evo-modal]].
- Inline contextual hover hints — use [[evo-tooltip]].

## Quick start

```tsx
import { EvoNotification, evoNotify } from '@justin_evo/evo-ui';

export default function App() {
  return (
    <EvoNotification.Provider defaultAnchor="top-right" maxVisible={3}>
      <button type="button" onClick={() => evoNotify.toast.success('Saved successfully')}>
        Save
      </button>
      <EvoNotification.Toaster />
    </EvoNotification.Provider>
  );
}
```

## Props

EvoNotification is a namespace object, not a single rendered component. Its members are `EvoNotification.Provider`, `EvoNotification.Toaster`, `EvoNotification.Bell`, `EvoNotification.Panel`, and `EvoNotification.Item`. The primary entry points called out by this skill are the `Provider`, the `Toaster`, and the `evoNotify` singleton. All members and the singleton are documented in **Sub-components** below.

There is no single "main component" prop table; see each sub-component's table.

## Sub-components

### `EvoNotification.Provider` (`EvoNotificationProvider`)

Wraps your app at the root, pushes config into the global store, and (optionally) binds an externally-owned inbox list. Renders only its children (a fragment); it has no DOM root of its own.

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `children` | `ReactNode` | — | Yes | Your app tree. |
| `defaultAnchor` | `EvoNotificationAnchor` | `'top-right'` | No | Where toasts appear when no per-toast anchor is set. |
| `maxVisible` | `number` | `3` | No | Max toasts visible per anchor. Extras fold into a "+N more" pill. |
| `defaultDuration` | `number` | `4000` | No | Default auto-dismiss time in ms. |
| `pauseOnFocusLoss` | `boolean` | `true` | No | Pause auto-dismiss timers when the window loses focus. |
| `persistErrors` | `boolean` | `false` | No | When true, `error` toasts stay until dismissed instead of auto-closing. A per-toast `duration` or `persistent` still overrides this. |
| `inboxItems` | `EvoInboxItem[]` | — | No | External-data mode: parent owns the list (Provider becomes read-only for the inbox). |
| `onInboxChange` | `(items: EvoInboxItem[]) => void` | — | No | Receives every inbox mutation when externally controlled. |

### `EvoNotification.Toaster` (`EvoNotificationToaster`)

Renders the toast stack into a portal on `document.body`. Mount exactly one, typically inside the Provider. A second mounted Toaster renders nothing and logs a console warning.

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `anchor` | `EvoNotificationAnchor` | falls back to Provider `defaultAnchor` | No | Default anchor for toasts handled by this Toaster (per-toast `anchor` overrides it). |
| `className` | `string` | — | No | Extra CSS class on the portal root. |

### `EvoNotification.Bell` (`EvoNotificationBell`)

A bell button with an unread badge that reads the global inbox; clicking it opens a popover Panel by default. Forwards `ref` to the underlying `<button>`.

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `variant` | `'solid' \| 'ghost'` | `'ghost'` | No | Visual style. |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | No | Touch-target sizing; `md` = 44px (WCAG). |
| `hideZero` | `boolean` | `true` | No | Hide the badge when the unread count is 0. |
| `maxBadgeCount` | `number` | `99` | No | Counts above this render as `"{max}+"`. |
| `panelPlacement` | `'bottom-end' \| 'bottom-start' \| 'bottom' \| 'top-end' \| 'top-start'` | `'bottom-end'` | No | Where the popover opens. |
| `renderPanel` | `'popover' \| 'none'` | `'popover'` | No | `'none'` lets you render the Panel inline yourself. |
| `panelTitle` | `ReactNode` | `'Notifications'` (via Panel) | No | Heading text inside the popover. |
| `panelEmptyState` | `ReactNode` | — | No | Override the default empty state in the popover. |

Extends `Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'>`: all native button attributes plus `ref` and `className` are forwarded to the root `<button>`. `onClick` runs before the popover toggles.

### `EvoNotification.Panel` (`EvoNotificationPanel`)

The notification-center list surface: header, mark-all-read, close, plus loading/error/empty/list states. Renders a `role="dialog"`. Forwards `ref` to the root `<div>`.

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `open` | `boolean` | `true` | No | Controls visibility when used standalone; returns `null` when false. |
| `onClose` | `() => void` | — | No | Renders the close button when provided. |
| `title` | `ReactNode` | `'Notifications'` | No | Heading text. |
| `emptyState` | `ReactNode` | — | No | Override the default empty UI. |
| `loading` | `boolean` | `false` | No | Show a loading state. |
| `error` | `ReactNode` | — | No | Show an error state. |
| `showMarkAllRead` | `boolean` | `true` | No | Show the "Mark all read" affordance when unread > 0. |
| `maxHeight` | `number \| string` | `480` | No | Body scroll cap (a `number` is treated as px). |

Extends `Omit<HTMLAttributes<HTMLDivElement>, 'title'>`: all native div attributes plus `ref`, `className`, and `style` are forwarded to the root element.

### `EvoNotification.Item` (`EvoNotificationItem`)

Renders a single inbox record (icon/avatar, title, description, relative timestamp, optional action, dismiss button, unread dot). Forwards `ref` to the root `<div>`.

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `item` | `EvoInboxItem` | — | Yes | The record to render. |
| `onClick` | `(item: EvoInboxItem) => void` | — | No | Overrides the item-level `onClick`. Clicking auto-marks the item read. |

Extends `Omit<HTMLAttributes<HTMLDivElement>, 'onClick'>`: all native div attributes plus `ref` and `className` are forwarded to the root element. When an `onClick` (prop or on the item) is present the row becomes `role="button"`, `tabIndex={0}`, and Enter/Space-activatable; otherwise it is `role="group"`.

### `evoNotify` singleton — `evoNotify.toast(...)`

`evoNotify.toast` is callable directly and carries methods. Each returns the toast `id` (a string) unless noted.

| Method | Signature | Description |
| --- | --- | --- |
| `toast(message, options?)` | `(ReactNode, EvoToastOptions?) => string` | Show a toast. Returns the id. |
| `toast.success(message, options?)` | `(ReactNode, EvoToastOptions?) => string` | Severity shortcut (`severity: 'success'`). |
| `toast.error(message, options?)` | `(ReactNode, EvoToastOptions?) => string` | Severity shortcut (`severity: 'error'`). |
| `toast.warning(message, options?)` | `(ReactNode, EvoToastOptions?) => string` | Severity shortcut (`severity: 'warning'`). |
| `toast.info(message, options?)` | `(ReactNode, EvoToastOptions?) => string` | Severity shortcut (`severity: 'info'`). |
| `toast.loading(message, options?)` | `(ReactNode, EvoToastOptions?) => string` | Persistent, not auto-dismissible, not user-dismissible toast. Pair with `update()`. |
| `toast.promise(p, msgs)` | `<T>(Promise<T> \| (() => Promise<T>), EvoPromiseMessages<T>) => string` | One toast walks loading → success/error. |
| `toast.progress(message, options?)` | `(ReactNode, EvoToastOptions?) => EvoToastProgressHandle` | Determinate progress toast; returns a handle (see below). |
| `toast.update(id, options)` | `(string, EvoToastOptions) => void` | Update an existing toast in place (resets its countdown). |
| `toast.dismiss(id?)` | `(string?) => void` | Dismiss one toast, or all active toasts if `id` is omitted. |

### `evoNotify` singleton — `push` + `inbox.*` + `dismissAll`

| Method | Signature | Description |
| --- | --- | --- |
| `push(item)` | `(EvoInboxItemInput) => string` | Add to the notification center. Returns the id. |
| `inbox.markRead(id)` | `(string) => void` | Mark a single item read. |
| `inbox.markUnread(id)` | `(string) => void` | Mark a single item unread. |
| `inbox.markAllRead()` | `() => void` | Mark all items read. |
| `inbox.remove(id)` | `(string) => void` | Remove one item. |
| `inbox.clear()` | `() => void` | Remove all items. |
| `inbox.setItems(items)` | `(EvoInboxItem[]) => void` | Replace the full list (used in external-data mode). |
| `inbox.getState()` | `() => { items: EvoInboxItem[]; unread: number }` | Read the current state snapshot. |
| `inbox.subscribe(fn)` | `((s: { items: EvoInboxItem[]; unread: number }) => void) => () => void` | Subscribe to inbox changes; returns an unsubscribe fn. |
| `dismissAll()` | `() => void` | Dismiss every visible toast (does not touch the inbox). |

### `EvoToastOptions` (passed to toast methods, `push.toast`, etc.)

| Field | Type | Default | Description |
| --- | --- | --- | --- |
| `id` | `string` | — | Pass to update/refresh an existing toast instead of creating a new one. |
| `title` | `ReactNode` | — | Primary line (bold). Falls back to the `message` argument. |
| `description` | `ReactNode` | — | Secondary line (muted). |
| `severity` | `EvoNotificationSeverity` | `'info'` | Icon + colour + aria-live mapping. |
| `icon` | `ReactNode` | — | Overrides the default severity icon. |
| `duration` | `number` | Provider `defaultDuration` (`4000`) | Auto-dismiss in ms. Use `Infinity` or `persistent: true` to disable. |
| `persistent` | `boolean` | `false` | Disable auto-dismiss (duration becomes `Infinity`). |
| `anchor` | `EvoNotificationAnchor` | Provider/Toaster default | Per-toast position override. |
| `action` | `EvoNotificationAction` (`{ label: string; onClick: (e: React.MouseEvent) => void }`) | — | Inline action button; dismisses the toast on click. |
| `dismissible` | `boolean` | `true` | Show the close button. |
| `onDismiss` | `(id: string) => void` | — | Fires when the user dismisses (or on `dismissAll`). |
| `onAutoClose` | `(id: string) => void` | — | Fires when the auto-dismiss timer expires. |
| `className` | `string` | — | Additional CSS class on the toast root. |
| `inbox` | `boolean \| Partial<EvoInboxItemInput>` | — | Also push a copy into the notification center. |
| `groupKey` | `string` | — | Coalescing key. Repeated toasts sharing a key fold into one card with a count badge. Ignored when `id` is also set. |
| `progress` | `number` | — | Determinate progress, 0–1. Renders a progress bar; out-of-range values are clamped. Usually driven via `toast.progress()`. |
| `urgency` | `boolean` | `false` | Loss-aversion emphasis — thickens the toast's left severity bar so its presence alone reads as heightened stakes, independent of copy. |
| `deadline` | `number \| Date` | — | Renders a live [[evo-countdown]] plus a draining 1→0 time bar (reuses the progress-bar track). Ignored when an explicit `progress` is also set. |

### `EvoToastProgressHandle` (returned by `evoNotify.toast.progress()`)

| Member | Type | Description |
| --- | --- | --- |
| `id` | `readonly string` | The underlying toast id (usable with `toast.dismiss`). |
| `setProgress(value)` | `(value: number) => void` | Set the bar fill, 0–1 (out-of-range clamped). |
| `update(options)` | `(options: EvoToastOptions) => void` | Patch any toast option (title, description, severity, …). |
| `done(options?)` | `(options?: EvoToastOptions) => void` | Resolve as success: bar fills to 100%, then the toast auto-dismisses. |
| `fail(options?)` | `(options?: EvoToastOptions) => void` | Resolve as error: the toast becomes dismissible and auto-dismisses. |
| `dismiss()` | `() => void` | Dismiss the toast immediately. |

### `EvoPromiseMessages<T>` (passed to `evoNotify.toast.promise`)

| Field | Type | Description |
| --- | --- | --- |
| `loading` | `ReactNode \| EvoToastOptions` | Shown while the promise is pending. |
| `success` | `ReactNode \| ((value: T) => ReactNode \| EvoToastOptions)` | Shown when the promise resolves. |
| `error` | `ReactNode \| ((err: unknown) => ReactNode \| EvoToastOptions)` | Shown when the promise rejects. |

### `EvoInboxItemInput` (passed to `evoNotify.push`)

| Field | Type | Default | Description |
| --- | --- | --- | --- |
| `id` | `string` | auto-generated | Stable id; re-pushing the same id updates the item in place. |
| `title` | `ReactNode` | — (required) | Primary line. |
| `description` | `ReactNode` | — | Secondary line. |
| `severity` | `EvoNotificationSeverity` | `'info'` | Icon + colour mapping. |
| `icon` | `ReactNode` | — | Overrides the severity icon. |
| `avatarUrl` | `string` | — | Avatar image; replaces the severity glyph when set. |
| `timestamp` | `number \| Date` | `Date.now()` | Used for the relative time label. |
| `read` | `boolean` | `false` | Initial read state. |
| `action` | `EvoNotificationAction` | — | Inline action button. |
| `onClick` | `(item: EvoInboxItem) => void` | — | Row click handler; clicking auto-marks read. |
| `meta` | `Record<string, unknown>` | — | Arbitrary metadata you carry on the item. |
| `toast` | `boolean \| Partial<EvoToastOptions>` | — | Also flash a toast right now when pushing. |
| `urgency` | `boolean` | `false` | Loss-aversion emphasis — see `EvoToastOptions.urgency`. |
| `deadline` | `number \| Date` | — | Renders a live [[evo-countdown]] next to the item's timestamp — see `EvoToastOptions.deadline`. |

### `EvoInboxItem` (the resolved record, e.g. from `inbox.getState()` / `useEvoInbox`)

Resolved shape: `{ id: string; title: ReactNode; description?: ReactNode; severity: EvoNotificationSeverity; icon?: ReactNode; avatarUrl?: string; timestamp: number; read: boolean; action?: EvoNotificationAction; onClick?: (item: EvoInboxItem) => void; meta?: Record<string, unknown>; urgency?: boolean; deadline?: number }`. `deadline` is normalized to epoch-ms at push time even if you passed a `Date`.

### `useEvoInbox()` hook

Convenience hook returning the live inbox snapshot `{ items: EvoInboxItem[]; unread: number }` (backed by `useSyncExternalStore`).

## Variants & options

**`EvoNotificationSeverity`** — `severity` on toasts and inbox items (default `'info'`):
- `success` — success/confirmation (✓ glyph).
- `error` — failure; announced assertively and (with `persistErrors`) kept until dismissed (✕ glyph).
- `warning` — caution (! glyph).
- `info` — neutral information (i glyph). Default.

**`EvoNotificationAnchor`** — `anchor` / `defaultAnchor` (default `'top-right'`): `top-left`, `top-center`, `top-right`, `bottom-left`, `bottom-center`, `bottom-right`. Toasts group per anchor; older cards stack behind the newest and lean away from the anchored edge. On screens ≤375px, anchors collapse to a full-width edge.

**Bell `variant`** (default `'ghost'`): `solid` (filled), `ghost` (transparent).

**Bell / standard `size`** (default `'md'`): `sm`, `md` (44px, WCAG), `lg`.

**Bell `panelPlacement`** (default `'bottom-end'`): `bottom-end`, `bottom-start`, `bottom`, `top-end`, `top-start`.

**Bell `renderPanel`** (default `'popover'`): `popover` (opens the built-in popover Panel), `none` (render a `Panel` inline yourself).

## Examples

Setup once at the app root, then call `evoNotify` from anywhere:

```tsx
import { EvoNotification, evoNotify } from '@justin_evo/evo-ui';

export default function App() {
  return (
    <EvoNotification.Provider defaultAnchor="top-right" maxVisible={3} persistErrors>
      <YourApp />
      <EvoNotification.Toaster />
    </EvoNotification.Provider>
  );
}

// Anywhere — including outside React:
evoNotify.toast('Build queued');
evoNotify.toast.success('Saved successfully', { description: 'Your changes are live.' });
evoNotify.toast.error('Save failed', { description: 'Network timed out — try again.' });
```

Promise and progress toasts:

```tsx
// Promise: one toast walks loading -> success/error.
evoNotify.toast.promise(api.saveInvoice(), {
  loading: 'Uploading invoice…',
  success: (r) => `Uploaded ${r.name}`,
  error: (e) => `Upload failed: ${String(e)}`,
});

// Progress: drive a determinate bar yourself, then resolve.
const p = evoNotify.toast.progress('Uploading backup.zip…', { description: '0%' });
p.setProgress(0.4);
p.update({ description: '40%' });
p.done({ title: 'Upload complete', description: 'backup.zip · 24 MB' });
// or: p.fail({ title: 'Upload failed' });
```

Action, persistent, coalescing, and per-toast anchor:

```tsx
// Action button (dismisses the toast on click).
evoNotify.toast('Message archived', {
  description: 'Hidden from your inbox.',
  action: { label: 'Undo', onClick: () => evoNotify.toast.success('Restored') },
});

// Persistent (no auto-dismiss).
evoNotify.toast.warning('Unsaved changes', { persistent: true });

// Coalescing — spam this and one card counts up "Document saved ×7".
evoNotify.toast.success('Document saved', { groupKey: 'doc-save' });

// Per-toast position override.
evoNotify.toast.info('Pinned bottom-center', { anchor: 'bottom-center' });

evoNotify.dismissAll();
```

Notification center (Bell + Panel + push), styled with theme tokens:

```tsx
import { EvoNotification, evoNotify } from '@justin_evo/evo-ui';

function Header() {
  return (
    <div style={{ borderBottom: '1px solid var(--evo-color-border)' }}>
      <EvoNotification.Bell variant="solid" size="md" panelPlacement="bottom-end" />
    </div>
  );
}

// Add an item (and optionally flash a toast at the same time):
evoNotify.push({
  title: 'Alice mentioned you',
  description: 'Can you take a look at the new design?',
  severity: 'info',
  toast: true,
});

evoNotify.inbox.markAllRead();
```

Urgency and deadlines (loss-aversion emphasis composing [[evo-countdown]]):

```tsx
// Thickened left severity bar — no deadline, just heightened emphasis.
evoNotify.toast.warning('Payment method expiring', { urgency: true });

// Deadline: live EvoCountdown + a draining 1→0 time bar under the copy.
evoNotify.toast.error('Session expiring', {
  description: 'Save your work before it ends.',
  urgency: true,
  deadline: Date.now() + 2 * 60 * 1000, // number | Date
  persistent: true,
});

// Same fields work on inbox items — the countdown renders next to the timestamp.
evoNotify.push({
  title: 'Renew subscription',
  severity: 'warning',
  urgency: true,
  deadline: new Date('2026-08-01'),
});
```

External-data mode (you own the list) and a standalone Panel:

```tsx
<EvoNotification.Provider
  inboxItems={items}
  onInboxChange={(next) => dispatch(setNotifications(next))}
>
  <App />
  <EvoNotification.Toaster />
</EvoNotification.Provider>

// Render the Panel yourself instead of the Bell's popover:
<EvoNotification.Bell renderPanel="none" />
<EvoNotification.Panel open onClose={() => setOpen(false)} maxHeight={520} />
```

## Accessibility

- **Live regions:** the Toaster keeps a single persistent visually-hidden pair of live regions in the portal — `aria-live="assertive"` for `error` toasts and `aria-live="polite"` (both `aria-atomic="true"`) for everything else — and announces newly-arrived toasts through them. Coalesced updates reuse an already-seen id, so they are not re-announced. Title and description (plain text) are both announced.
- **Toast roles:** a toast with extractable plain text is `role="group"` with an `aria-label` (announced via the live region). A JSX-only toast with no extractable text falls back to in-place `role="alert"` (error) or `role="status"` (others). The two paths are mutually exclusive.
- **Timers pause** on hover, on focus within the anchor group, and (when `pauseOnFocusLoss`) when the window blurs. They reset when a toast is re-pushed or updated.
- **Escape:** dismisses the most recent live toast in the hovered/focused anchor group; Escape also closes the Bell popover.
- **Bell button:** `aria-label` reflects the unread count ("Notifications, N unread"); when the popover is enabled it sets `aria-haspopup="dialog"`, `aria-expanded`, and `aria-controls` pointing at the panel id. Default size is 44×44px (WCAG 2.5.5). Clicking outside or Escape closes it.
- **Panel:** rendered as `role="dialog"` with an `aria-label` from the title; includes a "Mark all read" button (when unread > 0) and an optional close button (`aria-label="Close notifications"`).
- **Item rows:** interactive rows are `role="button"`, `tabIndex={0}`, and respond to Enter/Space; non-interactive rows are `role="group"`. Close/dismiss/action buttons are keyboard-reachable with a visible focus ring.
- **Progress bar:** `role="progressbar"` with `aria-valuemin={0}`, `aria-valuemax={1}`, and `aria-valuenow`.
- **Reduced motion:** respects `prefers-reduced-motion: reduce` automatically — enter/exit animation is skipped. The `deadline` time bar's continuous drain is disabled under reduced motion (rendered as a static full bar) and the count-change pop on `EvoNotification.Bell`'s badge / the toast's repeat-count badge is skipped, matching [[evo-countdown]]'s own no-sub-second-tick behaviour.
- **`deadline`:** the rendered `EvoCountdown` carries its own `role="timer"` and accurate `aria-label` (see [[evo-countdown]]); the accompanying draining time bar is `aria-hidden="true"` — it's a redundant visual, not a second source of truth.

## Gotchas

- **Mount exactly one `<EvoNotification.Toaster />`.** A second mounted Toaster renders nothing and logs a console warning; only the first owns the render slot. Toasts will not appear at all if no Toaster is mounted.
- **`evoNotify` works without the Provider for firing toasts** (it is a module singleton), but you must render a `Toaster` to see them, and the Provider is what sets `defaultAnchor` / `maxVisible` / `defaultDuration` / `pauseOnFocusLoss` / `persistErrors` and binds external inbox data.
- **`persistErrors` is overridable per toast.** A toast-level `duration` or `persistent` still wins, so an explicit `duration` on an error toast re-enables auto-dismiss.
- **`loading` toasts are persistent and not user-dismissible** (`persistent: true`, `dismissible: false`); resolve them with `toast.update(id, …)`, or use `toast.promise` / `toast.progress` which manage this for you.
- **`groupKey` is ignored when `id` is also supplied** — id matching takes priority. Re-pushing an existing `id` refreshes the toast and restarts its timer (and revives it if mid-exit).
- **`progress` is clamped to 0–1**; non-numbers/NaN fall back to 0.
- **`deadline` and `progress` don't combine** — when both are set on a toast, the explicit `progress` bar wins and the deadline's auto-driven time bar is skipped (the `EvoCountdown` text still renders).
- **Buttons default to `type="button"`** (close, action, mark-all-read, dismiss) — they never accidentally submit a surrounding form.
- **Theme via `var(--evo-color-*)` / `--evo-spacing-*` / `--evo-radius-*` tokens**, never hard-coded hex — hard-coded colours break dark mode.
- **Single CSS import:** import `@justin_evo/evo-ui/dist/evo-ui.css` once at the app root.
- **Named imports only** from `@justin_evo/evo-ui` — never deep paths.

## Related

- [[evo-alert]] — persistent, declarative in-page banners (the counterpart to transient toasts).
- [[evo-modal]] — blocking dialogs.
- [[evo-tooltip]] — inline contextual hints.
- [[evo-badge]] — standalone count/status badges (as used on the Bell).
- [[evo-countdown]] — the standalone countdown primitive composed by `urgency`/`deadline`.
- [[evo-button]] — the standard button primitive.
- [[evo-theming]] — theme tokens and light/dark mode.
- [[evo-ui]] — master index of all Evo UI components.
