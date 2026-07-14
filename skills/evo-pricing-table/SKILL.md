---
name: evo-pricing-table
description: Use when building a pricing / plan comparison page — tiers that must read as one comparable set, with a struck-through anchor price, a visually-raised recommended tier, and feature rows that line up across columns. Covers EvoPricingTable and its parts PricingTable.Tier, PricingTable.Price, PricingTable.FeatureList, PricingTable.Feature, PricingTable.Cta.
---

# EvoPricingTable — Evo UI

> Evo UI component skill. Master index: [[evo-ui]].

## Overview

EvoPricingTable is a compose-based pricing-tier comparison table. A price only reads as "a good deal" relative to what sits next to it (the contrast effect) — a hand-rolled `Grid` of `Card`s can't guarantee that, because each card sizes to its own content and nothing lines up across columns. On desktop (≥768px) EvoPricingTable uses CSS Grid `subgrid` to lock every tier's name/price/description/divider row onto the same shared row, and stretches the feature+CTA area so every call-to-action lands on one shared baseline. Below 768px tiers stack to a single column and the alignment math is skipped entirely — there is nothing to align. It composes `EvoBadge` (recommended ribbon) and `EvoButton` (CTA) rather than reimplementing them.

## Import

```tsx
import { EvoPricingTable } from '@justin_evo/evo-ui';
// One-time stylesheet import (e.g. in your app entry):
// import '@justin_evo/evo-ui/dist/evo-ui.css';
```

`EvoPricingTable` is callable directly (`<EvoPricingTable>…</EvoPricingTable>` forwards to Root) and also carries the sub-components as static properties: `EvoPricingTable.Root`, `EvoPricingTable.Tier`, `EvoPricingTable.Price`, `EvoPricingTable.FeatureList`, `EvoPricingTable.Feature`, `EvoPricingTable.Cta`.

## When to use

- A pricing / plans page comparing 2+ tiers side by side.
- Any comparison table where one option should be visually recommended and the group must be scannable as a set (not independent cards).
- Discount or promotional pricing where an original price should be shown struck-through next to the current price.

## When NOT to use

- A single plan's details with no comparison — use [[evo-card]].
- A generic data grid / sortable rows — use [[evo-table]].
- A small inline status or count — use [[evo-badge]].

## Quick start

```tsx
import { EvoPricingTable, EvoButton } from '@justin_evo/evo-ui';

function Plans() {
  return (
    <EvoPricingTable recommended="pro">
      <EvoPricingTable.Tier id="starter" name="Starter" price="$0" period="/mo" description="For side projects.">
        <EvoPricingTable.FeatureList>
          <EvoPricingTable.Feature>3 projects</EvoPricingTable.Feature>
          <EvoPricingTable.Feature included={false}>Priority support</EvoPricingTable.Feature>
        </EvoPricingTable.FeatureList>
        <EvoPricingTable.Cta>
          <EvoButton label="Get started" variant="outline" fullWidth />
        </EvoPricingTable.Cta>
      </EvoPricingTable.Tier>

      <EvoPricingTable.Tier id="pro" name="Pro" price="$29" anchorPrice="$49" period="/mo" description="For growing teams.">
        <EvoPricingTable.FeatureList>
          <EvoPricingTable.Feature>Unlimited projects</EvoPricingTable.Feature>
          <EvoPricingTable.Feature>Priority support</EvoPricingTable.Feature>
        </EvoPricingTable.FeatureList>
        <EvoPricingTable.Cta>
          <EvoButton label="Start free trial" fullWidth />
        </EvoPricingTable.Cta>
      </EvoPricingTable.Tier>

      <EvoPricingTable.Tier id="enterprise" name="Enterprise" price="$99" period="/mo" anchor>
        <EvoPricingTable.FeatureList>
          <EvoPricingTable.Feature>Unlimited projects</EvoPricingTable.Feature>
          <EvoPricingTable.Feature>Dedicated support</EvoPricingTable.Feature>
        </EvoPricingTable.FeatureList>
        <EvoPricingTable.Cta>
          <EvoButton label="Contact sales" variant="outline" fullWidth />
        </EvoPricingTable.Cta>
      </EvoPricingTable.Tier>
    </EvoPricingTable>
  );
}
```

## Props

### EvoPricingTable / EvoPricingTable.Root (`EvoPricingTableProps`)

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `recommended` | `string` | — | No | id of the `Tier` to visually elevate as the recommended pick. |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | No | Padding and type scale applied to every tier. |
| `alignFeatures` | `boolean` | `true` | No | Grid-align name/price/description/feature rows across tiers on desktop (≥768px) via CSS `subgrid`. `false` falls back to independently-sized cards in a responsive grid. |
| `cadence` | `ReactNode` | — | No | Billing-cadence switcher (e.g. a monthly/yearly toggle) rendered centered above the tiers. EvoPricingTable does not own its state — you control it and pass different `price`/`period` per tier yourself. |
| `children` | `ReactNode` | — | Yes | One or more `EvoPricingTable.Tier` elements. |
| `className` | `string` | — | No | Additional CSS class merged onto the root. |

Spreads all remaining native `<div>` attributes plus `ref` and `className` onto the root element (`HTMLAttributes<HTMLDivElement>`).

## Sub-components

### EvoPricingTable.Tier (`EvoPricingTableTierProps`)

One pricing plan / column. Renders a `<div role="group" aria-labelledby="{id}-name">`.

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `id` | `string` | — | Yes | Stable identifier. Match against the root's `recommended` prop. Also used as the DOM `id`. |
| `name` | `ReactNode` | — | Yes | Tier name, e.g. `"Pro"`. |
| `price` | `ReactNode` | — | Yes | Current price, e.g. `"$29"`. |
| `anchorPrice` | `ReactNode` | — | No | Original price rendered struck-through beside `price`, e.g. `"$49"`. Announced to screen readers as "Original price". |
| `anchor` | `boolean` | `false` | No | Marks this as the flagship tier that anchors the comparison — its chrome recedes (flat surface, muted price colour) so the recommended tier pops by contrast. Independent of `anchorPrice`. |
| `recommended` | `boolean` | `false` | No | Visually elevates this tier (raised surface, primary ring, default "Recommended" badge). Equivalent to matching the root's `recommended` id — set either, not both. |
| `badge` | `ReactNode` | — | No | Ribbon content. A `string` is wrapped in `EvoBadge` (`severity="primary" variant="solid" size="sm"`) automatically; any other node is rendered as-is. When omitted and the tier is recommended, defaults to a "Recommended" `EvoBadge`. |
| `description` | `ReactNode` | — | No | One-line summary shown under the name. |
| `period` | `ReactNode` | — | No | Billing period suffix, e.g. `"/mo"`. |
| `children` | `ReactNode` | — | No | Sub-components — typically `FeatureList` then `Cta`. |
| `className` | `string` | — | No | Additional CSS class. |

Spreads remaining native `<div>` attributes plus `ref` and `className` onto the root `<div>`.

### EvoPricingTable.Price (`EvoPricingTablePriceProps`)

Rendered automatically inside `Tier` from its `price`/`anchorPrice`/`period` props. Exported standalone for advanced custom layouts that don't go through `Tier`'s convenience props.

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `value` | `ReactNode` | — | Yes | Current price. |
| `anchor` | `ReactNode` | — | No | Original price, rendered struck-through (`<del>`) with a visually-hidden "Original price" label before it. |
| `period` | `ReactNode` | — | No | Billing period suffix. |
| `className` | `string` | — | No | Additional CSS class. |

### EvoPricingTable.FeatureList (`EvoPricingTableFeatureListProps`)

Renders a real `<ul>`. Container for `Feature` items.

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `className` | `string` | — | No | Additional CSS class. |
| `...rest` | `HTMLAttributes<HTMLUListElement>` | — | No | All native `<ul>` attributes plus `ref` are forwarded. |

### EvoPricingTable.Feature (`EvoPricingTableFeatureProps`)

Renders a real `<li>` with a check/minus icon.

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `included` | `boolean` | `true` | No | Whether the feature is included in this tier. `false` renders a muted row with a minus icon and a visually-hidden "Not included: " label ahead of the text. |
| `children` | `ReactNode` | — | No | Feature description. |
| `className` | `string` | — | No | Additional CSS class. |
| `...rest` | `LiHTMLAttributes<HTMLLIElement>` | — | No | All native `<li>` attributes plus `ref` are forwarded. |

### EvoPricingTable.Cta (`EvoPricingTableCtaProps`)

Bottom action slot — typically an `EvoButton`. Renders a `<div>`. When `alignFeatures` is on, this is what lands on the shared baseline across tiers.

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `className` | `string` | — | No | Additional CSS class. |
| `...rest` | `HTMLAttributes<HTMLDivElement>` | — | No | All native `<div>` attributes plus `ref` are forwarded. |

## Variants & options

### `size` (root)

- `sm` — compact padding, smaller price type.
- `md` — default.
- `lg` — generous padding, larger price type.

### `anchor` vs `recommended` (Tier)

These are independent booleans that can both be `false`, but not usefully both `true` on the same tier:

- `anchor` — this tier exists to make the recommended tier look better by comparison (typically the highest-priced "Enterprise"/flagship tier). Chrome recedes: flat surface, no shadow, muted price colour.
- `recommended` — this tier is the one you want the user to pick. Chrome is raised: elevated surface, `shadow-lg`, a 2px primary-colour ring, and (unless you pass your own `badge`) a default "Recommended" badge.

### `alignFeatures` (root)

- `true` (default) — on desktop (≥768px), tiers are CSS Grid `subgrid` items so name/price/description/divider/feature+CTA rows share a track with every other tier. Below 768px tiers stack to one column regardless.
- `false` — tiers are independently-sized cards in a responsive `auto-fit` grid at every width. Use this when tiers have very different shapes (e.g. one has a large custom illustration) and forced alignment would leave awkward gaps.

## Examples

### Anchor price (discount) + recommended tier

```tsx
import { EvoPricingTable, EvoButton } from '@justin_evo/evo-ui';

function DiscountedPro() {
  return (
    <EvoPricingTable.Tier id="pro" name="Pro" price="$29" anchorPrice="$49" period="/mo" recommended>
      <EvoPricingTable.FeatureList>
        <EvoPricingTable.Feature>Unlimited projects</EvoPricingTable.Feature>
      </EvoPricingTable.FeatureList>
      <EvoPricingTable.Cta>
        <EvoButton label="Start free trial" fullWidth />
      </EvoPricingTable.Cta>
    </EvoPricingTable.Tier>
  );
}
```

### Billing cadence toggle

```tsx
import { useState } from 'react';
import { EvoPricingTable, EvoToggle } from '@justin_evo/evo-ui';

function CadenceExample() {
  const [yearly, setYearly] = useState(false);

  return (
    <EvoPricingTable
      recommended="pro"
      cadence={<EvoToggle checked={yearly} onChange={setYearly} label="Bill yearly" />}
    >
      <EvoPricingTable.Tier
        id="pro"
        name="Pro"
        price={yearly ? '$290' : '$29'}
        period={yearly ? '/yr' : '/mo'}
      >
        …
      </EvoPricingTable.Tier>
    </EvoPricingTable>
  );
}
```

### Opting out of row alignment

```tsx
import { EvoPricingTable } from '@justin_evo/evo-ui';

function LooseCards() {
  return (
    <EvoPricingTable alignFeatures={false}>
      <EvoPricingTable.Tier id="starter" name="Starter" price="$0">…</EvoPricingTable.Tier>
      <EvoPricingTable.Tier id="pro" name="Pro" price="$29">…</EvoPricingTable.Tier>
    </EvoPricingTable>
  );
}
```

## Accessibility

- Each `Tier` renders `role="group"` with `aria-labelledby` pointing at its name element, so assistive tech announces e.g. "Pro, group" before its contents.
- `anchorPrice` is preceded by a visually-hidden "Original price" label so screen reader users don't hear two bare numbers back to back.
- `Feature included={false}` is preceded by a visually-hidden "Not included: " label; the icon itself is `aria-hidden`.
- `FeatureList`/`Feature` render a real `<ul>`/`<li>` list, not styled `<div>`s.
- The row-alignment grid (`alignFeatures`) is a visual-only enhancement — content order and semantics are identical with or without it, and it never engages below 768px.
- All motion (card colour/shadow transitions) respects `prefers-reduced-motion`.
- Theme via `var(--evo-color-*)` tokens only — never hard-coded hex — so tiers stay correct in light and dark mode.

## Gotchas

- `id` is required on every `Tier` and must be unique — it's both the React/DOM id and the value you match against the root's `recommended` prop.
- Setting both the root's `recommended="pro"` *and* `<Tier id="pro" recommended>` is redundant but harmless — either alone is sufficient.
- `anchor` and `recommended` are independent; don't set both `true` on the same tier — the visual "recede vs raise" contrast only works when they're on different tiers.
- The default "Recommended" badge only appears when a tier is recommended **and** `badge` is omitted. Pass `badge={null}` is not needed — just supply your own `badge` string/node to override.
- `alignFeatures`'s `subgrid` alignment only ever engages at ≥768px; don't rely on it for pixel-perfect alignment inside a narrow embedded container below that width — it intentionally falls back to stacked cards.
- `cadence` is a display slot only — EvoPricingTable does not manage billing-period state. Recompute each `Tier`'s `price`/`period` yourself from your own controlled toggle.
- Import styles once from `@justin_evo/evo-ui/dist/evo-ui.css`. Use named imports from `@justin_evo/evo-ui` only — never deep import paths.
- All sub-components forward `ref` and `className` and spread `...rest` to their root element; native attributes pass through.

## Related

- [[evo-card]] — a single plan's details with no side-by-side comparison.
- [[evo-badge]] — powers the "Recommended" ribbon and any custom string `badge`.
- [[evo-button]] — placed in `EvoPricingTable.Cta`.
- [[evo-table]] — generic tabular data comparison, not tier/plan-shaped.
- [[evo-divider]] — separate unrelated sections above/below the table.
- [[evo-theming]] — the `--evo-color-*` tokens tiers are built on.
