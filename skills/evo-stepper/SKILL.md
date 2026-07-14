---
name: evo-stepper
description: Use when building a multi-step flow — checkout, onboarding, a wizard, a form with distinct stages — and you need to show which step the user is on and which are done. Covers EvoStepper and its part EvoStepper.Step.
---

# EvoStepper — Evo UI

> Evo UI component skill. Master index: [[evo-ui]].

## Overview

EvoStepper is a semantic, ordered progress indicator for multi-step flows. It renders a real `<ol>`/`<li>` list (not `<div>`s), and every `EvoStepper.Step` derives its own status — `complete` / `current` / `upcoming` — purely from comparing its position to a single `active` index on the parent. You never set per-step booleans; advance the flow by changing one number.

Its one deliberate visual decision serves the goal-gradient effect (people push harder the closer a finish line feels, and a flow should never make the user feel like they're starting from zero): the connector line after a **completed** step fills solid in the success color and eases into place as `active` advances, so progress already made always reads as a visibly "banked" line, not just a numbered dot.

## Import

```tsx
import { EvoStepper } from '@justin_evo/evo-ui';
// One-time stylesheet import (e.g. in your app entry):
// import '@justin_evo/evo-ui/dist/evo-ui.css';
```

`EvoStepper` carries `EvoStepper.Step` as a static property. `EvoStepper.Step` must be rendered as a direct child of `EvoStepper` (it reads shared config — `active`, `orientation`, `severity`, `size`, `onStepClick` — from context, and its own index from a clone-injected prop the parent sets internally).

## When to use

- Checkout flow (cart → shipping → payment → confirm).
- Onboarding / setup wizards.
- Any multi-stage form or process where showing "where am I, what's left" reduces drop-off.
- Composed inside a larger flow component (e.g. a wizard) as the shared progress header.

## When NOT to use

- A single percentage/quantity progress bar with no discrete named stages — use a progress bar primitive instead (not a numbered list of steps).
- Tab-style navigation between independent, non-sequential views — use [[evo-tabs]].
- A breadcrumb trail showing hierarchical location, not sequential progress — use [[evo-breadcrumb]].
- A short numeric/status label — use [[evo-badge]].

## Quick start

```tsx
import { useState } from 'react';
import { EvoStepper } from '@justin_evo/evo-ui';

function Checkout() {
  const [active, setActive] = useState(1);

  return (
    <EvoStepper active={active}>
      <EvoStepper.Step title="Cart" description="Review items" />
      <EvoStepper.Step title="Shipping" description="Delivery address" />
      <EvoStepper.Step title="Payment" description="Card details" />
      <EvoStepper.Step title="Confirm" description="Place order" />
    </EvoStepper>
  );
}
```

## Props

### EvoStepper (`EvoStepperProps`)

Extends `React.HTMLAttributes<HTMLOListElement>` (minus `onClick`, which is not meaningful on the root — use `onStepClick`). Root element: `<ol>`.

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `active` | `number` | — | Yes | 0-based index of the current step. Every child step derives its status by comparing its position to this. |
| `orientation` | `'horizontal' \| 'vertical'` | `'horizontal'` | No | Layout direction. |
| `severity` | `'primary' \| 'success' \| 'info'` | `'primary'` | No | Accent color for the **current** step's marker ring and title only. `complete` steps are always success-colored and `error` steps always danger-colored, regardless of this prop — those colors carry fixed meaning. |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | No | Marker diameter and type scale. |
| `onStepClick` | `(index: number) => void` | — | No | When supplied, every step marker renders as a real, focusable `<button type="button">` that calls this with the step's index on click/Enter/Space. **Omitting this keeps the stepper a pure, non-interactive progress display** — only pass it when jumping between steps is actually allowed by your flow. |
| `children` | `ReactNode` | — | Yes | One `<EvoStepper.Step>` per step. Non-element children are ignored for indexing. |
| `className` | `string` | — | No | Additional CSS class on the root `<ol>`. |
| `...rest` | `HTMLAttributes<HTMLOListElement>` | — | No | All native `<ol>` attributes plus `ref` are forwarded to the root. |

### EvoStepper.Step (`EvoStepperStepProps`)

Extends `React.LiHTMLAttributes<HTMLLIElement>` (minus `title`, which is repurposed as the step label, not the native HTML tooltip attribute). Root element: `<li>`. Must be a direct child of `EvoStepper`.

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `title` | `ReactNode` | — | Yes | Step label. |
| `description` | `ReactNode` | — | No | Optional supporting copy shown under the title. |
| `icon` | `ReactNode` | — | No | Custom marker content. Defaults to the step number, or a checkmark / warning glyph for `complete` / `error` status. |
| `status` | `'complete' \| 'current' \| 'upcoming' \| 'error'` | — (derived) | No | Overrides the status this step would otherwise derive from `active` vs. its own index. The only common use is `status="error"` to flag a failed step regardless of its position — leave unset for the normal progression. |
| `className` | `string` | — | No | Additional CSS class on the `<li>`. |
| `...rest` | `HTMLAttributes<HTMLLIElement>` | — | No | All native `<li>` attributes plus `ref` are forwarded to the rendered `<li>`. |

## Variants & options

### `orientation`

- `horizontal` — steps in a row, connectors run left-to-right. **(default)** Best for wide layouts (checkout header).
- `vertical` — steps stacked top-to-bottom, connectors run down. Best for sidebars or narrow panels.

### `severity` (current step accent only)

- `primary` — default accent. **(default)**
- `success` — use for flows that should feel celebratory/positive end-to-end (e.g. a rewards signup).
- `info` — a calmer, neutral accent for informational flows.

### Step `status` derivation

Each `EvoStepper.Step`'s status is `index < active ? 'complete' : index === active ? 'current' : 'upcoming'`, unless you pass `status` explicitly (most commonly `'error'`).

## Examples

### Clickable steps (navigable flow)

```tsx
import { useState } from 'react';
import { EvoStepper } from '@justin_evo/evo-ui';

function NavigableFlow() {
  const [active, setActive] = useState(0);
  return (
    <EvoStepper active={active} onStepClick={setActive}>
      <EvoStepper.Step title="Cart" />
      <EvoStepper.Step title="Shipping" />
      <EvoStepper.Step title="Payment" />
      <EvoStepper.Step title="Confirm" />
    </EvoStepper>
  );
}
```

### Vertical, in a sidebar

```tsx
import { EvoStepper } from '@justin_evo/evo-ui';

function Sidebar() {
  return (
    <EvoStepper active={1} orientation="vertical">
      <EvoStepper.Step title="Account details" description="Name and email" />
      <EvoStepper.Step title="Verify email" description="Check your inbox" />
      <EvoStepper.Step title="Set up workspace" description="Name your team" />
    </EvoStepper>
  );
}
```

### Flagging a failed step

```tsx
import { EvoStepper } from '@justin_evo/evo-ui';

function UploadFlow() {
  return (
    <EvoStepper active={2}>
      <EvoStepper.Step title="Upload" />
      <EvoStepper.Step title="Validate" status="error" description="File format rejected" />
      <EvoStepper.Step title="Publish" />
    </EvoStepper>
  );
}
```

## Accessibility

- The root is a real `<ol>` and every step a real `<li>` — assistive tech gets native list semantics and per-item position ("1 of 4") without extra ARIA.
- The current step carries `aria-current="step"`.
- A visually-hidden `aria-live="polite"` region announces "Step 2 of 4: Shipping" whenever `active` changes, so screen-reader users following a flow hear progress updates without re-reading the whole list.
- When `onStepClick` is supplied, markers render as real `<button type="button">` elements — keyboard reachable (Tab, activate with Enter/Space), with a visible `:focus-visible` ring and an `aria-label` like "Go to step 2: Shipping". Without `onStepClick`, markers are plain non-focusable `<span>`s, correctly signaling the stepper is display-only.
- Marker glyphs (numbers, check, warning icon) are `aria-hidden="true"` — list numbering plus the visible title text already carry that information, so it is not announced twice.
- Touch targets: clickable markers grow to a 44px hit area under `@media (pointer: coarse)` while staying visually compact on desktop/mouse input.
- All motion (marker color, connector fill transition) respects `prefers-reduced-motion`.

## Gotchas

- `active` is required and 0-based. `active={0}` means step 1 is current, not step 0 being "before the start".
- `EvoStepper.Step` must be a direct child of `EvoStepper` — it reads `active`/`orientation`/`severity`/`size`/`onStepClick` from context and its own position from a prop the parent injects via `cloneElement`. Wrapping a step in another element (e.g. a `<div>` for spacing) breaks both the context lookup pattern's directness and the index injection; use `className`/`style` on the `Step` itself instead.
- `status="error"` is sticky — it does not automatically clear when `active` moves past that step. Manage error/retry state yourself and clear `status` when the step is retried successfully.
- `onStepClick` makes **every** step clickable, including ones ahead of `active`. If your flow shouldn't allow skipping ahead, don't gate this inside `EvoStepper` — call `setActive` conditionally inside your own `onStepClick` handler (e.g. `onStepClick={(i) => i <= active && setActive(i)}`).
- `severity` does not affect `complete` or `error` steps — only the current step's marker/title. This is intentional (section "Variants"), not a bug.
- Theme via `var(--evo-color-*)` tokens — never hard-coded hex — so the stepper stays correct in light and dark mode.
- Import styles once from `@justin_evo/evo-ui/dist/evo-ui.css`. Use named imports from `@justin_evo/evo-ui` only — never deep import paths.

## Related

- [[evo-badge]] — a compact status label, for a single count/state rather than a sequence.
- [[evo-breadcrumb]] — hierarchical location trail, not sequential progress.
- [[evo-tabs]] — switching between independent views rather than advancing through ordered stages.
- [[evo-button]] — pairs naturally as the Back/Next controls driving a stepper's `active` state.
- [[evo-theming]] — the `--evo-color-*` tokens EvoStepper is built on.
