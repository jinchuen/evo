---
name: evo-progress
description: Use when you need to show completion of a task with a known duration (uploads, multi-step wizards, storage/quota meters) or an unknown one (connecting, syncing) — a determinate or indeterminate progress bar with severity coloring, an optional label/value readout, and a `minVisible` head-start floor so a 0% bar never reads as empty. Covers the EvoProgress export.
---

# EvoProgress — Evo UI

> Evo UI component skill. Master index: [[evo-ui]].

## Overview

EvoProgress is a `role="progressbar"` status indicator with a single controlled `value` (no internal state — the consumer owns the number, same model as Radix's Progress). Its one differentiator is `minVisible`: a purely *visual* floor on the rendered fill percentage, so `value={0}` still shows a sliver of progress instead of a flat empty bar. This exists to serve the goal-gradient effect — motivation to finish rises the closer someone perceives themselves to be to the goal, and a literal 0% fill undercuts that from the first render. `minVisible` never touches `aria-valuenow`; screen readers always hear the true value.

## Import

```tsx
import { EvoProgress } from '@justin_evo/evo-ui';
// One-time, app-wide stylesheet import (includes theme tokens):
// import '@justin_evo/evo-ui/dist/evo-ui.css';
```

## When to use

- Known-duration work: file uploads/downloads, multi-step form completion, onboarding checklists, storage/quota meters.
- Unknown-duration work: connecting, syncing, "working on it" states — set `indeterminate`.
- Anywhere the goal-gradient effect matters: give a task a visible head start with `minVisible` instead of starting the user at a discouraging 0%.

## When NOT to use

- A single button's own busy state — use [[evo-button]]'s `loading` prop instead of embedding an EvoProgress inside a button.
- Placeholder content while data loads (skeleton screens) — use [[evo-skeleton]].
- A numbered sequence of steps a user navigates between (not a continuous fill) — use [[evo-stepper]].
- A countdown to a fixed point in time — use [[evo-countdown]].

## Quick start

```tsx
import { EvoProgress } from '@justin_evo/evo-ui';

export function UploadStatus() {
  return <EvoProgress value={42} label="Uploading…" showValue />;
}
```

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `value` | `number` | `0` | No | Current value, in the same units as `max`. Clamped to `[0, max]` before rendering and before being reported via `aria-valuenow`. |
| `max` | `number` | `100` | No | Upper bound of `value`. |
| `minVisible` | `number` | `0` | No | Visual-only floor (0-100) on the rendered fill percentage. `visualPct = max(truePct, minVisible)`. Never affects `aria-valuenow` — assistive tech always hears the real value. |
| `severity` | `'primary' \| 'success' \| 'warning' \| 'danger' \| 'info'` | `'primary'` | No | Semantic color of the fill. Note: no `'secondary'` (unlike EvoButton) — progress fills are always a meaningful color, never neutral. |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | No | Track height only (6px / 8px / 12px). |
| `indeterminate` | `boolean` | `false` | No | Unknown-duration mode: the fill becomes a fixed-width (40%) indicator that continuously slides, with a soft glow in the active `severity`'s `-soft` token. `aria-valuenow` is omitted while true (per WAI-ARIA), not set to a placeholder number. |
| `showValue` | `boolean` | `false` | No | Renders the formatted value next to `label`. Silently ignored while `indeterminate` (there's no meaningful number to show). |
| `valueFormat` | `(value: number, max: number) => string` | percentage, e.g. `"42%"` | No | Formats the text shown when `showValue` is true. Receives the clamped true `value`, never the `minVisible`-floored one. |
| `label` | `ReactNode` | — | No | Optional caption rendered above the track. Its rendered `<span>` is wired up via `aria-labelledby`, so it doubles as the accessible name. |
| `animated` | `boolean` | `true` | No | Animates width changes and the indeterminate sweep. Forced off under `prefers-reduced-motion` regardless of this prop. |
| `className` | `string` | — | No | Appended to the component's own classes on the root element. |
| `id` | `string` | — | No | Forwarded to the root; also used to derive the label's id (`${id}-label`) when `label` is set. |

This interface extends `HTMLAttributes<HTMLDivElement>` (minus `children`, which isn't accepted — content is built from `label`/`showValue`), so all native div attributes (`aria-*`, `data-*`, `style`, …) plus `ref` and `className` are forwarded to the root `<div>`, which is the element carrying `role="progressbar"`.

## Variants & options

### `severity`
- `primary` — default, general-purpose progress.
- `success` — completed or safely-progressing operations (e.g. flip to this at 100%).
- `warning` — progress that needs attention (approaching a quota).
- `danger` — risky operations in flight (rollback, destructive batch job).
- `info` — informational/background progress.

Every severity works with `indeterminate` too — the sliding indicator and its glow both use the active severity's tokens, so a `danger`-severity indeterminate bar stays visually distinct from a `primary` one.

### `size`
- `sm` — 6px track height, compact contexts (inline rows, tables).
- `md` — 8px, default.
- `lg` — 12px, standalone/hero progress displays.

### `indeterminate`
Use when duration is unknown. Do not fake a `value` to get a similar look — set `indeterminate` so assistive tech correctly omits `aria-valuenow` instead of announcing a number that isn't real.

## Examples

### The goal-gradient head start

```tsx
import { EvoProgress } from '@justin_evo/evo-ui';

// Without minVisible, this renders a completely flat, empty-looking bar.
// With it, the same value={0} state shows a small sliver of momentum —
// purely visual; a screen reader still hears "0 out of 100".
export function ProfileSetup() {
  return (
    <EvoProgress
      value={0}
      minVisible={8}
      label="Profile setup"
      showValue
    />
  );
}
```

### Live-updating upload with a severity flip at completion

```tsx
import { useEffect, useState } from 'react';
import { EvoProgress } from '@justin_evo/evo-ui';

export function UploadProgress() {
  const [value, setValue] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setValue((v) => Math.min(100, v + 7));
    }, 400);
    return () => clearInterval(id);
  }, []);

  return (
    <EvoProgress
      value={value}
      minVisible={6}
      label="Uploading design-assets.zip"
      showValue
      severity={value >= 100 ? 'success' : 'primary'}
    />
  );
}
```

### Indeterminate + custom value format

```tsx
import { EvoProgress } from '@justin_evo/evo-ui';

export function Meters() {
  return (
    <>
      <EvoProgress indeterminate severity="danger" label="Rolling back…" />

      <EvoProgress
        value={640}
        max={1000}
        label="Downloaded"
        showValue
        valueFormat={(v, max) => `${v} / ${max} MB`}
      />
    </>
  );
}
```

## Accessibility

- Root carries `role="progressbar"`, `aria-valuemin={0}`, `aria-valuemax` (= `max`), and `aria-valuenow` (= the clamped **true** `value` — never the `minVisible`-floored visual number).
- While `indeterminate`, `aria-valuenow` is omitted entirely rather than set to a placeholder, matching WAI-ARIA APG guidance for progressbars with an unknown value.
- When `label` is set, its rendered `<span>` is wired up via `aria-labelledby`, giving the bar an accessible name automatically. Without `label`, pass your own `aria-label` through `...rest`.
- Purely a status indicator — no focusable/interactive elements, so there is no keyboard interaction model.
- The indeterminate sweep and all width transitions are disabled under `prefers-reduced-motion: reduce` (the indeterminate bar becomes a static, reduced-opacity fill instead of stopping mid-animation).

## Gotchas

- `minVisible` is **visual only**. Don't use it to "round up" a value for correctness anywhere else in your UI — read the real `value` prop (or your own state) for that; `minVisible` never changes what EvoProgress reports to assistive tech.
- `showValue` is silently ignored while `indeterminate` — there's no meaningful number to format. Don't rely on `valueFormat` running in that state.
- No `'secondary'` severity (unlike EvoButton) — a progress fill is always a meaningful color signal, so pick from `primary` / `success` / `warning` / `danger` / `info`.
- `value` and `minVisible` are both clamped internally (`value` to `[0, max]`, `minVisible` to `[0, 100]`) — passing an out-of-range number won't overflow the bar or break `aria-valuenow`.
- This component does not accept `children` — build the visible content via `label` and `showValue`/`valueFormat`, not by nesting arbitrary JSX inside it.
- Theme via `var(--evo-color-*)` tokens (and `severity`) — never hard-code hex colors, which break light/dark mode.
- Import the stylesheet `@justin_evo/evo-ui/dist/evo-ui.css` exactly once for the whole app, or the bar will be unstyled.
- Import only from `@justin_evo/evo-ui` (named import) — never from a deep path.

## Related

- [[evo-button]] (busy/loading state on a single control)
- [[evo-skeleton]] (placeholder content while data loads)
- [[evo-stepper]] (discrete step sequences)
- [[evo-countdown]] (time-based countdowns)
- [[evo-theming]]
- [[evo-ui]]
