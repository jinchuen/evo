---
name: evo-progress-ring
description: Use when you need a compact radial/circular progress indicator for dashboard tiles, tier badges, card summaries, or profile completion widgets — anywhere a full-width linear progress bar doesn't fit. Covers the EvoProgressRing export.
---

# EvoProgressRing — Evo UI

> Evo UI component skill. Master index: [[evo-ui]].

## Overview

EvoProgressRing is a self-contained circular progress indicator: two stacked SVG circles (a neutral track + a colored indicator arc) with a customizable center content slot. It reports a real `value`/`max` via ARIA. Its `minVisible` prop carries over the same purely-visual "goal-gradient floor" mechanism as the linear `EvoProgress`, letting a specific instance opt into never reading as a hollow, "nothing happened yet" circle at 0% — without ever touching the accessible value.

## Import

```tsx
import { EvoProgressRing } from '@justin_evo/evo-ui';
// One-time, app-wide stylesheet import (includes theme tokens):
// import '@justin_evo/evo-ui/dist/evo-ui.css';
```

## When to use

- Dashboard tiles and stat cards ("72% of quota used").
- Membership/tier progress badges with a custom icon in the center.
- Compact "X of N" counters (steps completed, items reviewed).
- Anywhere circular/radial space (a card corner, a badge) rules out a full-width bar.

## When NOT to use

- A full-width, linear progress indicator for page loads or multi-step forms — use `EvoProgress` (the linear counterpart) instead.
- Multiple stacked/segmented arcs summing to 100% (a breakdown donut chart) — this is a single-value indicator, not a charting primitive. Use a charting library for that.
- An indeterminate "loading, duration unknown" spinner — EvoProgressRing always expects a known `value`.

## Quick start

```tsx
import { EvoProgressRing } from '@justin_evo/evo-ui';

export function QuotaTile() {
  return <EvoProgressRing value={72} severity="primary" size="lg" />;
}
```

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `value` | `number` | — | Yes | Current value. Clamped to `[0, max]`. |
| `max` | `number` | `100` | No | The value that represents 100%. |
| `minVisible` | `number` | `0` | No | Visual-only floor on the rendered arc percentage (0-100), applied even when the true percentage is 0. Off by default — a real 0% renders as a literal, honest empty ring unless set explicitly. Never affects `aria-valuenow`/`aria-valuetext` or the default center label — only the drawn arc. |
| `severity` | `'primary' \| 'success' \| 'warning' \| 'danger' \| 'info'` | `'primary'` | No | Semantic color of the indicator arc. The track stays neutral in every severity. |
| `size` | `'sm' \| 'md' \| 'lg' \| number` | `'md'` | No | Named diameter (`sm`=48px, `md`=72px, `lg`=96px) or an explicit diameter in pixels. |
| `thickness` | `number` | proportional to diameter | No | Stroke width in pixels. Auto-derived as `max(4, round(diameter * 0.09))` when omitted. |
| `showValue` | `boolean` | `true` | No | Show the rounded percentage as the default center content when no `children` are provided. |
| `children` | `ReactNode` | — | No | Custom center content (tier icon, "3 of 5", …). Overrides `showValue`. `<svg>` children auto-size to `1em`, matching the `EvoButton` icon convention. |
| `animated` | `boolean` | `true` | No | Animate the arc transitioning to a new `value`. Always disabled under `prefers-reduced-motion: reduce` regardless of this prop. |
| `className` | `string` | — | No | Appended to the component's own classes on the root `<div>`. |

This interface extends `HTMLAttributes<HTMLDivElement>`, so all native `<div>` attributes (`aria-*`, `onClick`, `id`, etc.) plus `ref` and `className` are forwarded to the root `<div>` via `...rest`.

## Variants & options

### `severity`
- `primary` — default, main brand color.
- `success` — completion, healthy state.
- `warning` — cautionary (e.g. quota nearing limit).
- `danger` — critical/overdue.
- `info` — neutral informational metric.

The track circle is always neutral (`--evo-color-surface-sunken`) regardless of severity — only the indicator arc carries the color.

### `size`
- `sm` — 48px diameter.
- `md` — 72px diameter (default).
- `lg` — 96px diameter.
- Any `number` — explicit diameter in pixels, for arbitrary dashboard layouts.

### `minVisible` (the goal-gradient floor)
- Default `0`: off. A ring at `value={0}` renders as a literal, fully empty ring — matches `EvoProgress`'s default.
- Set explicitly (e.g. `4`) to guarantee a small visible sliver of arc even at `value={0}`, for the specific tiles where a felt head-start matters (onboarding, first-run widgets).
- Applies at any low percentage, not just exactly 0 (e.g. a true 1% would render as at least `minVisible` once set).
- Purely visual. `aria-valuenow`, `aria-valuetext`, and the default percentage label always report the real, unmodified value — only the drawn arc is nudged.

## Examples

### Basic usage

```tsx
import { EvoProgressRing } from '@justin_evo/evo-ui';

export function Rings() {
  return (
    <>
      <EvoProgressRing value={72} />
      <EvoProgressRing value={3} max={5} />
    </>
  );
}
```

### Custom center content (tier icon)

```tsx
import { EvoProgressRing } from '@justin_evo/evo-ui';

const StarIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2l2.9 6.6 7.1.6-5.4 4.7 1.7 7-6.3-3.9L5.7 21l1.7-7L2 9.2l7.1-.6L12 2z" />
  </svg>
);

export function TierBadge({ progress }: { progress: number }) {
  return (
    <EvoProgressRing value={progress} severity="warning" size="lg">
      <StarIcon />
    </EvoProgressRing>
  );
}
```

### Live-updating value with animation

```tsx
import { useState } from 'react';
import { EvoProgressRing, EvoButton } from '@justin_evo/evo-ui';

export function Uploader() {
  const [value, setValue] = useState(0);
  return (
    <>
      <EvoProgressRing value={value} severity="primary" size="lg" />
      <EvoButton label="+10" onClick={() => setValue((v) => Math.min(100, v + 10))} />
    </>
  );
}
```

## Accessibility

- Renders `role="progressbar"` with `aria-valuenow`, `aria-valuemin={0}`, `aria-valuemax`, and `aria-valuetext` (a `"NN%"` string) — screen readers always get the true, unmodified value regardless of `minVisible` or custom center content.
- The inner `<svg>` is `aria-hidden="true"`; the accessible name/value comes entirely from the root's ARIA attributes.
- Passive status display: holds no focus, has no keyboard interaction, matching the native `progressbar` role's expected (non-interactive) behavior.
- The arc's transition is removed entirely under `prefers-reduced-motion: reduce`, independent of the `animated` prop — the ring still jumps straight to the correct value, no motion.
- Center-label digits use `font-variant-numeric: tabular-nums` so the label's width doesn't shift as the percentage changes.

## Gotchas

- `minVisible` is a **visual-only** floor — never assume the drawn arc equals the true percentage at low values; always read `aria-valuenow`/`aria-valuetext` (or your own `value` prop) for the real number, not the pixels.
- `showValue` is ignored once `children` is provided — `children` always wins.
- `size` as a bare `number` is a diameter in pixels, not a `'sm'|'md'|'lg'` keyword — don't pass `size={2}` expecting a named-size-like scale.
- `thickness` is independent of `size`; a very large `thickness` relative to a small `size` will shrink the visible radius toward zero.
- Theme via `var(--evo-color-*)` tokens (and `severity`) — never hard-code hex colors, which break light/dark mode.
- Import the stylesheet `@justin_evo/evo-ui/dist/evo-ui.css` exactly once for the whole app, or the ring will be unstyled.
- Import only from `@justin_evo/evo-ui` (named import) — never from a deep path.

## Related

- [[evo-badge]]
- [[evo-countdown]]
- [[evo-button]]
- [[evo-theming]]
- [[evo-ui]]
