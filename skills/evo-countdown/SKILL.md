---
name: evo-countdown
description: Use when needing an inline, self-ticking "time remaining" display for a deadline, trial expiration, limited-time offer, or countdown timer — e.g. "3 days left" or "04:59" — including one that must escalate visually as it nears zero and notify when it expires. Covers the EvoCountdown export.
---

# EvoCountdown — Evo UI

> Evo UI component skill. Master index: [[evo-ui]].

## Overview

EvoCountdown is a self-ticking, chrome-less inline `<span>` that counts down to a `deadline`. It renders human-readable text ("3 days left" / "04:59") by default, or hands you the live remaining milliseconds via a render-prop `children` for full control. Its one opinionated behavior: it renders in `--evo-color-warning` for its entire visible life and escalates to `--evo-color-danger` once the remaining time crosses `dangerThreshold` — a loss-aversion cue that the deadline itself is felt, not just read. `dangerThreshold` defaults to a smart, self-scaling value (10% of the initial remaining duration) so this escalation works out of the box on any deadline length.

It ticks itself (no polling needed from the consumer), throttles its own update frequency to the display grain in use, and pauses entirely while the browser tab is hidden.

## Import

```tsx
import { EvoCountdown } from '@justin_evo/evo-ui';
// One-time stylesheet import (e.g. in your app entry):
// import '@justin_evo/evo-ui/dist/evo-ui.css';
```

## When to use

- Trial / access expiration: "Your trial ends in 3 days."
- Limited-time offers / flash sales counting down to a close time.
- Deadlines in a form, task, or workflow ("Submit within 04:59").
- Any place you want urgency to *escalate* automatically as a deadline nears, without manually swapping severities.

## When NOT to use

- An elapsed-time / stopwatch display (counting up, not down) — build that separately; EvoCountdown only counts down to a fixed `deadline`.
- A full-page or modal "session about to expire" dialog with its own actions — compose EvoCountdown *inside* [[evo-modal]] or [[evo-alert]] rather than reinventing the countdown text.
- A clickable/interactive control — EvoCountdown is a passive `role="timer"` status text with no focus state; wrap it in [[evo-button]] or another interactive element if you need a click target.

## Quick start

```tsx
import { EvoCountdown } from '@justin_evo/evo-ui';

function TrialBanner() {
  const deadline = Date.now() + 3 * 24 * 60 * 60 * 1000; // 3 days from now
  return <EvoCountdown deadline={deadline} />;
}
```

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `deadline` | `number \| Date` | — | Yes | Target instant — an epoch-ms timestamp or a `Date`. |
| `format` | `'days' \| 'clock' \| 'auto'` | `'auto'` | No | `'days'` ticks once a minute ("3 days left"). `'clock'` ticks once a second ("04:59" / "1:04:59"). `'auto'` resolves to `'days'` while ≥24h remain and switches to `'clock'` inside the final day. |
| `dangerThreshold` | `number` | smart default | No | Remaining ms at which the color escalates from warning to danger. Defaults to 10% of the *initial* remaining duration captured at mount, clamped to 30s–24h. |
| `onExpire` | `() => void` | — | No | Called exactly once, on the tick the deadline is reached or passed. |
| `children` | `(remainingMs: number) => React.ReactNode` | — | No | Render prop for full control over displayed content. Receives the live remaining ms (never negative). Omit to use the built-in formatting. |
| `className` | `string` | — | No | Appended to the root `<span>`'s classes. |

This interface extends `HTMLAttributes<HTMLSpanElement>` (minus `children`, which is repurposed as the render prop above), so all native `<span>` attributes (`id`, `title`, `data-*`, `aria-*`, `onClick`, …) plus `ref` are forwarded to the root `<span>` via `...rest`.

## Variants & options

### `format`
- `'days'` — always shows "N day(s) left" (or "Expired"). Ticks once a minute; never shows seconds.
- `'clock'` — always shows `H:MM:SS` (or `MM:SS` under an hour, or "Expired"). Ticks once a second.
- `'auto'` (default) — picks `'days'` while ≥24h remain and switches to `'clock'` once inside the final day, so a month-long trial doesn't re-render every second for no reason.

### `dangerThreshold`
- Governs only the warning→danger color escalation, not the display format.
- Smart default: `clamp(30_000, initialRemainingMs * 0.1, 86_400_000)` — captured once at mount from the deadline you passed in, so a 30-day countdown turns urgent with ~3 days left and a 10-minute one turns urgent with ~1 minute left.
- Pass an explicit number (ms) to override, e.g. `dangerThreshold={5 * 60_000}` to force urgency inside the last 5 minutes regardless of the total duration.

## Examples

### Format grains

```tsx
import { EvoCountdown } from '@justin_evo/evo-ui';

function Formats({ deadline }: { deadline: number }) {
  return (
    <>
      <EvoCountdown deadline={deadline} format="days" />
      <EvoCountdown deadline={deadline} format="clock" />
      <EvoCountdown deadline={deadline} format="auto" /> {/* default */}
    </>
  );
}
```

### Custom danger threshold and expiration callback

```tsx
import { useState } from 'react';
import { EvoCountdown } from '@justin_evo/evo-ui';

function FlashSale({ endsAt }: { endsAt: number }) {
  const [ended, setEnded] = useState(false);
  return (
    <>
      <EvoCountdown
        deadline={endsAt}
        dangerThreshold={5 * 60_000} // force danger inside the last 5 minutes
        onExpire={() => setEnded(true)}
      />
      {ended && <p>Sale ended.</p>}
    </>
  );
}
```

### Custom rendering with the `children` render prop

```tsx
import { EvoCountdown } from '@justin_evo/evo-ui';

function SecondsOnly({ deadline }: { deadline: number }) {
  return (
    <EvoCountdown deadline={deadline}>
      {(remainingMs) => <span>⏳ {Math.ceil(remainingMs / 1000)}s to go</span>}
    </EvoCountdown>
  );
}
```

### Composing inside EvoAlert

```tsx
import { EvoAlert, EvoCountdown } from '@justin_evo/evo-ui';

function TrialWarning({ resetsAt }: { resetsAt: number }) {
  return (
    <EvoAlert type="warning" title="Your trial is ending">
      Upgrade before it ends — access resets in <EvoCountdown deadline={resetsAt} />.
    </EvoAlert>
  );
}
```

EvoCountdown renders no border or background of its own, so it drops into alert/notification/badge copy without fighting the host's box.

## Accessibility

- Renders `role="timer"` with `aria-live="off"` — a running per-second or per-minute tick is not announced on every change, so screen reader users aren't interrupted by a live clock.
- `aria-label` always carries the full, accurate remaining duration (e.g. "2 days, 4 hours remaining") independent of the visible text, including when a custom `children` render is used.
- Digits use `font-variant-numeric: tabular-nums` so the layout doesn't shift width as numbers tick down.
- The tick interval never runs faster than once a second (no sub-second ticking, ever) and pauses entirely while the browser tab is hidden, resuming with an immediate recompute (not a stale leftover tick) when it becomes visible again.
- The one-shot pulse fired when the color escalates to danger is removed entirely under `prefers-reduced-motion: reduce`; the color change alone still carries the state change.
- The component holds no focus and has no default interaction — it's passive status text. Compose it inside an interactive/announcing context ([[evo-alert]], [[evo-notification]], [[evo-badge]]'s `detail`) when the countdown itself needs to be prominent or actionable.

## Gotchas

- `dangerThreshold`'s smart default is captured **once**, from the remaining time at mount — if you mutate `deadline` to push it much further out after mount, the danger window does not recompute from the new duration. Pass `dangerThreshold` explicitly if `deadline` can change significantly after mount.
- `format="days"` never shows "0 days left" while time remains — it rounds up (`Math.ceil`), so the last few hours of a `'days'`-formatted countdown still read "1 day left". Use `'auto'` (default) or `'clock'` if you want second-level precision near zero.
- `onExpire` fires exactly once per mount, even if `deadline` is already in the past on first render.
- `children`, when provided, replaces the built-in text entirely — `aria-label` is unaffected and still reports the real remaining duration, so don't duplicate an accessible-name workaround yourself.
- The default `warning`→`danger` colors use the base `--evo-color-warning` / `--evo-color-danger` tokens (not their `-fg` variants, which are tuned for text on a solid colored background) — do not restyle with `-fg` tokens or you'll get low-contrast text against the page surface, especially in dark mode.
- Import the CSS once globally (`@justin_evo/evo-ui/dist/evo-ui.css`); without it the countdown is unstyled (no color escalation, no tabular-nums).
- Named import only from `@justin_evo/evo-ui` — never a deep/internal path.

## Related

- [[evo-alert]]
- [[evo-badge]]
- [[evo-notification]]
- [[evo-theming]]
- [[evo-ui]]
