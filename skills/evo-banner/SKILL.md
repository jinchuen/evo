---
name: evo-banner
description: Use when building a value-first callout — a promo, upsell, trial offer, or product-tip strip that should feel like a gift, not an interruption. Pairs an icon, headline, body copy, a CTA, and an optional reassurance note. Covers EvoBanner.
---

# EvoBanner — Evo UI

> Evo UI component skill. Master index: [[evo-ui]].

## Overview

EvoBanner is the "give before you ask" primitive (reciprocity: offer real value before requesting anything back). It renders a calm `role="region"` landmark — never `role="alert"` — with a *tone* (not a severity), an icon badge, a title, body copy, a CTA slot, and an optional reassurance `note` ("No card required") anchored directly under the CTA. All color comes from semantic theme tokens, so dark mode is automatic.

## Import

```tsx
import { EvoBanner } from '@justin_evo/evo-ui';
// One-time stylesheet import (e.g. in your app entry):
// import '@justin_evo/evo-ui/dist/evo-ui.css';
```

## When to use

- A trial/upgrade offer, promo, or upsell strip above or inside page content.
- A product-tip or "what's new" callout with a single follow-up action.
- A referral / incentive banner that pairs an ask with a reassurance line.
- Anywhere you want to *offer* something calmly, without interrupting the user's flow.

## When NOT to use

- A status message about the result of an action (saved, failed, warning) — use [[evo-alert]] (`role="alert"`, severity-coded).
- A transient, auto-dismissing system notification or toast — use [[evo-notification]].
- A generic content surface / tile with no promotional intent — use [[evo-card]].
- A tiny inline status label or count — use [[evo-badge]].

## Quick start

```tsx
import { EvoBanner, EvoButton } from '@justin_evo/evo-ui';

function TrialBanner() {
  return (
    <EvoBanner
      icon={<GiftIcon />}
      title="Try the Pro plan free for 14 days"
      action={<EvoButton label="Start free trial" />}
      note="No card required"
    >
      Unlock unlimited projects, priority support, and advanced analytics —
      cancel anytime.
    </EvoBanner>
  );
}
```

## Props (`EvoBannerProps`)

Extends `React.HTMLAttributes<HTMLElement>` — every native attribute (`id`, `style`, `data-*`, `aria-*`, …) passes through, and `ref` forwards to the underlying `<section>`.

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `tone` | `'brand' \| 'neutral' \| 'accent'` | `'brand'` | No | Semantic color theme. Orthogonal to `align`. |
| `title` | `ReactNode` | — | No | Bold lead-in shown above the body copy. |
| `icon` | `ReactNode` | — | No | Decorative glyph rendered in a circular badge. Marked `aria-hidden="true"` automatically — do not put meaningful-only content here. |
| `children` | `ReactNode` | — | Yes | Body copy — the value being offered. |
| `action` | `ReactNode` | — | No | Primary CTA (typically an `EvoButton`). Wrapped in a slot with a guaranteed ≥44px tap target regardless of the CTA's own rendered size. |
| `note` | `ReactNode` | — | No | Small reassurance copy anchored directly under the CTA, e.g. `"No card required"`. This is the component's reciprocity signal — prefer it over folding the same text into `children`. |
| `dismissible` | `boolean` | `false` | No | Shows a ghost dismiss control (top-right, invisible until hover/focus). |
| `onDismiss` | `() => void` | — | No | Called after the exit animation completes (or immediately, under `prefers-reduced-motion: reduce`) and the banner has unmounted. |
| `align` | `'start' \| 'center'` | `'start'` | No | `start` rows icon/content/action for dense contexts. `center` stacks and centers everything for a full-width hero placement. |
| `...rest` | `HTMLAttributes<HTMLElement>` | — | No | All native attributes forwarded to the root `<section>`. Includes `aria-label`, which overrides the auto-derived accessible name. |

## Variants & options

### `tone`

- `brand` — the primary value pitch; uses `--evo-color-primary`. **(default)**
- `neutral` — low-emphasis product tips that shouldn't pull focus; uses border/surface tokens, no color accent.
- `accent` — a secondary highlight (e.g. a feature announcement) that shouldn't compete with `brand`; uses `--evo-color-info`.

### `align`

- `start` — icon, content, and action row together, wrapping on narrow viewports. **(default)**
- `center` — stacked and centered; use for full-width hero/promo placements.

## Examples

### Tones

```tsx
import { EvoBanner } from '@justin_evo/evo-ui';

function Tones() {
  return (
    <>
      <EvoBanner tone="brand" title="Brand">The default tone.</EvoBanner>
      <EvoBanner tone="neutral" title="Neutral">A low-emphasis tip.</EvoBanner>
      <EvoBanner tone="accent" title="Accent">A secondary highlight.</EvoBanner>
    </>
  );
}
```

### Centered hero banner with a reassurance note

```tsx
import { EvoBanner, EvoButton } from '@justin_evo/evo-ui';

function ReferralBanner() {
  return (
    <EvoBanner
      align="center"
      tone="accent"
      title="Refer a friend, get a month free"
      action={<EvoButton label="Get your link" severity="info" />}
      note="Rewards apply automatically"
    >
      Both of you get a free month once they subscribe.
    </EvoBanner>
  );
}
```

### Dismissible product tip

```tsx
import { EvoBanner } from '@justin_evo/evo-ui';

function ShortcutTip() {
  return (
    <EvoBanner
      tone="neutral"
      title="New: keyboard shortcuts"
      dismissible
      onDismiss={() => console.log('dismissed')}
    >
      Press "?" anywhere in the app to see the full shortcut list.
    </EvoBanner>
  );
}
```

## Accessibility

- Renders `<section role="region">` — a passive landmark, not `role="alert"`. It does not interrupt screen reader users the way a status alert does.
- The region's accessible name resolves in this order: explicit `aria-label` prop → `title` (only when `title` is a plain string) → the fallback string `"Banner"`. If `title` is a non-string `ReactNode`, pass `aria-label` explicitly.
- The `action` slot guarantees a ≥44px tap target (WCAG 2.5.5) by giving the wrapper `min-height: 2.75rem`, independent of the CTA's own visual size.
- The dismiss button has `aria-label="Dismiss banner"`, a visible `:focus-visible` outline, and grows its hit area to 44px under `(pointer: coarse)` without inflating its visual size on desktop.
- `icon` is rendered inside `aria-hidden="true"` — never put the only copy of meaningful information in the icon slot.
- The exit animation is skipped under `prefers-reduced-motion: reduce`: the banner unmounts on the next tick (no fade/translate), and `onDismiss` still fires after that tick.

## Gotchas

- `EvoBanner` is not `EvoAlert`. Don't reach for it to show a save-succeeded / validation-error / warning message — those are `role="alert"` and severity-coded; use [[evo-alert]] instead. `tone` here is aesthetic emphasis, not status.
- `note` and `children` are different slots with different intent: put the value pitch in `children`, and put the friction-reducing reassurance line ("No card required", "Cancel anytime") in `note` so it renders anchored under the CTA rather than blended into body copy.
- Dismissing is asynchronous: `onDismiss` fires *after* the exit animation (or immediately under reduced motion), not on click. Don't rely on it firing synchronously inside the click handler.
- `dismissible` with no `onDismiss` is valid — the banner still removes itself from the DOM; you just won't be notified.
- `icon` is always wrapped in `aria-hidden="true"`; it cannot be made an accessible landmark for meaningful icon-only content.
- Theme via `var(--evo-color-*)` tokens only — never hard-coded hex — so the banner stays correct in light and dark mode.
- Import styles once from `@justin_evo/evo-ui/dist/evo-ui.css`. Use named imports from `@justin_evo/evo-ui` only — never deep import paths.
- `EvoBanner` forwards `ref` (typed `HTMLElement`), `className`, and `...rest` to the root `<section>`; native attributes pass through.

## Related

- [[evo-alert]] — status messages (success/error/warning/info), `role="alert"`, not for promos.
- [[evo-card]] — a generic content surface with no promotional/CTA-first intent.
- [[evo-notification]] — transient, auto-dismissing toasts and an inbox panel.
- [[evo-button]] — the typical component passed into `action`.
- [[evo-badge]] — small inline status labels, not a full callout.
- [[evo-theming]] — the `--evo-color-*` tokens the banner's tones are built on.
