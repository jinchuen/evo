---
name: evo-wizard
description: Use when building a multi-step, stateful flow that gates advancement per step and ends in a summary — onboarding, checkout, setup wizards, multi-step signup. Covers EvoWizard and its parts Wizard.Progress, Wizard.Step, Wizard.Review, Wizard.Review.Item, Wizard.Actions.
---

# EvoWizard — Evo UI

> Evo UI component skill. Master index: [[evo-ui]].

## Overview

EvoWizard is a stateful multi-step orchestrator. Unlike [[evo-form]], which is purely presentational layout, EvoWizard owns the active step index, gates advancement per step via each step's own `canAdvance` flag, and drives a shared progress display, the visible step content, and the Back/Next/Finish buttons off that single index — controlled or uncontrolled, per Evo's naming convention (`activeStep` / `defaultStep` / `onStepChange`). A wizard *contains* forms (or any content); it is not a variant of Form.

Its one deliberate flourish serves the IKEA effect (people value what they built with their own hands far more than what they were simply handed): `EvoWizard.Review` doesn't print the user's answers as inert text. Every `EvoWizard.Review.Item` row ties its value back to the step it came from with a quiet "Edit" affordance that jumps straight there — the summary reads as "here is what *you* assembled," and stays literally editable at the moment the user feels proudest of it.

## Import

```tsx
import { EvoWizard } from '@justin_evo/evo-ui';
// One-time stylesheet import (e.g. in your app entry):
// import '@justin_evo/evo-ui/dist/evo-ui.css';
```

`EvoWizard` carries `Progress`, `Step`, `Review` (itself carrying `Review.Item`), and `Actions` as static properties. All of them must be rendered as children of `EvoWizard` — they read shared state from context.

## When to use

- Onboarding / account-setup flows with distinct stages that must be completed in order.
- Checkout: cart → shipping → payment → review → confirm.
- Any flow where a step's fields must be valid before the user can continue, and a final review-and-edit screen improves completion.
- A multi-step signup or configuration wizard whose progress you want to reflect in the URL (controlled `activeStep`).

## When NOT to use

- A single-page form with sections, no step gating, no progress indicator — use [[evo-form]] directly.
- A pure progress display with no owned state or step content — use [[evo-stepper]] directly (EvoWizard composes it internally for `EvoWizard.Progress`).
- Independent, non-sequential views the user can freely switch between with no "advancement" concept — use [[evo-tabs]].

## Quick start

```tsx
import { useState } from 'react';
import { EvoWizard, EvoForm, EvoInput } from '@justin_evo/evo-ui';

function SignupWizard() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  return (
    <EvoWizard onComplete={() => console.log('done')}>
      <EvoWizard.Progress />

      <EvoWizard.Step id="account" title="Account" canAdvance={!!name && !!email}>
        <EvoForm>
          <EvoForm.Field label="Full name" required>
            <EvoInput value={name} onChange={(e) => setName(e.target.value)} fullWidth />
          </EvoForm.Field>
          <EvoForm.Field label="Email" required>
            <EvoInput type="email" value={email} onChange={(e) => setEmail(e.target.value)} fullWidth />
          </EvoForm.Field>
        </EvoForm>
      </EvoWizard.Step>

      <EvoWizard.Review title="Review">
        <EvoWizard.Review.Item label="Full name" step="account">{name}</EvoWizard.Review.Item>
        <EvoWizard.Review.Item label="Email" step="account">{email}</EvoWizard.Review.Item>
      </EvoWizard.Review>

      <EvoWizard.Actions finishLabel="Create account" />
    </EvoWizard>
  );
}
```

## Props

### EvoWizard (`EvoWizardProps`)

Extends `React.HTMLAttributes<HTMLDivElement>`. Root element: `<div>`.

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `activeStep` | `number` | — | No | Controlled 0-based active step index. Pair with `onStepChange`. `defaultStep` is ignored while this is set. |
| `defaultStep` | `number` | `0` | No | Initial active step index for uncontrolled use. |
| `onStepChange` | `(index: number) => void` | — | No | Called with the new index on Next, Back, a Progress marker click (non-linear mode), or a Review "Edit" jump. |
| `onComplete` | `() => void` | — | No | Called when Finish is clicked — on the last step when there is no `EvoWizard.Review`, or on the Review step when there is one. |
| `linear` | `boolean` | `true` | No | When `true`, `EvoWizard.Progress` stays a non-clickable display and the gated Next/Finish button in `EvoWizard.Actions` is the only way forward. When `false`, every Progress marker becomes a real clickable button for free navigation in either direction. |
| `children` | `ReactNode` | — | Yes | `EvoWizard.Progress`, one or more `EvoWizard.Step`, an optional `EvoWizard.Review`, and `EvoWizard.Actions`, in that order. |
| `className` | `string` | — | No | Additional CSS class on the root `<div>`. |
| `...rest` | `HTMLAttributes<HTMLDivElement>` | — | No | All native `<div>` attributes plus `ref` are forwarded to the root. |

`EvoWizard` is also exported as `EvoWizard.Root` (`EvoWizardRoot`) for parity with `EvoCard.Root`, though the plain `<EvoWizard>` form is the documented, expected usage.

## Sub-components

### EvoWizard.Step (`EvoWizardStepProps`)

Extends `React.HTMLAttributes<HTMLDivElement>` (minus `title`, repurposed as the step label). Root element: `<div role="group">`. Renders `null` when it is not the active step — inactive steps unmount rather than being visually hidden.

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `id` | `string` | 0-based position | No | Stable identifier. Referenced by `EvoWizard.Review.Item`'s `step` prop to jump back here. |
| `title` | `ReactNode` | — | Yes | Step label, shown as this step's marker title in `EvoWizard.Progress`. |
| `canAdvance` | `boolean` | `true` | No | Gates the Next/Finish button in `EvoWizard.Actions` while this step is active. Wire it to your own validation (e.g. required fields filled in). |
| `children` | `ReactNode` | — | Yes | The step's content — typically an `EvoForm`, but any content is valid; EvoWizard does not know or care what's inside. |

### EvoWizard.Progress (`EvoWizardProgressProps`)

A thin wrapper around [[evo-stepper]] wired to the wizard's own state — you never pass `active` yourself. Root element: `<ol>` (via `EvoStepper`).

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `orientation` | `'horizontal' \| 'vertical'` | `'horizontal'` | No | Forwarded to `EvoStepper`. |
| `severity` | `'primary' \| 'success' \| 'info'` | `'primary'` | No | Accent for the current step's marker/title, forwarded to `EvoStepper`. |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | No | Forwarded to `EvoStepper`. |

### EvoWizard.Review (`EvoWizardReviewProps`)

Renders `null` unless the wizard is currently on the review step (i.e. you've called Next past the last `EvoWizard.Step`). Root element: `<div role="group">`.

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `title` | `ReactNode` | — | No | Heading shown above the review rows. |
| `children` | `ReactNode` | — | Yes | One or more `EvoWizard.Review.Item` rows (or any custom content). |

### EvoWizard.Review.Item (`EvoWizardReviewItemProps`)

A single labelled row inside `EvoWizard.Review`. Root element: `<div>`.

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `label` | `ReactNode` | — | Yes | Row label (e.g. the field or step this value came from). |
| `step` | `string \| number` | — | No | The originating `EvoWizard.Step`'s `id` or its 0-based index. When set, renders an "Edit" button that jumps straight back to that step. Omit for a plain, non-editable row. |
| `editLabel` | `string` | `'Edit'` | No | Text for the edit affordance. |
| `children` | `ReactNode` | — | Yes | The value to display. |

### EvoWizard.Actions (`EvoWizardActionsProps`)

Renders the Back + Next/Finish button pair. Root element: `<div>`.

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `backLabel` | `string` | `'Back'` | No | Label for the back button. Always `variant="ghost" severity="secondary"`; disabled (not hidden) on the first step. |
| `nextLabel` | `string` | `'Next'` | No | Label for the forward button on non-final steps. |
| `finishLabel` | `string` | `'Finish'` | No | Label for the forward button on the final action (last step with no Review, or the Review step itself). The button also switches from `severity="primary"` to `severity="success"` on the final action. Disabled while the active step's `canAdvance` is `false`. |

## Variants & options

### `linear`

- `true` (default) — gated: `EvoWizard.Progress` is a pure display, forward movement only happens through the gated Next/Finish button.
- `false` — free: every marker in `EvoWizard.Progress` is a real, focusable button that jumps to any step in either direction, bypassing `canAdvance` gating for navigation (though the Next/Finish button itself is still gated).

### `severity` (EvoWizard.Progress, current step accent only)

Same three options as [[evo-stepper]]'s `severity`: `primary` (default), `success`, `info`. Complete and error steps keep their own fixed colors regardless.

## Examples

### Controlled active step (e.g. synced to a URL param)

```tsx
import { useState } from 'react';
import { EvoWizard } from '@justin_evo/evo-ui';

function ControlledWizard() {
  const [step, setStep] = useState(0);
  return (
    <EvoWizard activeStep={step} onStepChange={setStep}>
      <EvoWizard.Progress />
      <EvoWizard.Step id="one" title="Details">…</EvoWizard.Step>
      <EvoWizard.Step id="two" title="Confirm">…</EvoWizard.Step>
      <EvoWizard.Actions />
    </EvoWizard>
  );
}
```

### No Review step — last step's button becomes Finish directly

```tsx
import { EvoWizard } from '@justin_evo/evo-ui';

function TwoStepWizard() {
  return (
    <EvoWizard onComplete={() => alert('Complete!')}>
      <EvoWizard.Progress />
      <EvoWizard.Step id="a" title="Step A">Content A</EvoWizard.Step>
      <EvoWizard.Step id="b" title="Step B">Content B</EvoWizard.Step>
      <EvoWizard.Actions finishLabel="Done" />
    </EvoWizard>
  );
}
```

### Free navigation (`linear={false}`)

```tsx
import { EvoWizard } from '@justin_evo/evo-ui';

function EditFlow() {
  return (
    <EvoWizard linear={false}>
      <EvoWizard.Progress />
      <EvoWizard.Step id="one" title="Details">…</EvoWizard.Step>
      <EvoWizard.Step id="two" title="Preview">…</EvoWizard.Step>
      <EvoWizard.Actions />
    </EvoWizard>
  );
}
```

### Vertical progress in a sidebar layout

```tsx
import { EvoWizard } from '@justin_evo/evo-ui';

function SidebarWizard() {
  return (
    <div style={{ display: 'flex', gap: '2rem' }}>
      <EvoWizard style={{ display: 'contents' }}>
        <div style={{ width: 220 }}>
          <EvoWizard.Progress orientation="vertical" />
        </div>
        <div style={{ flex: 1 }}>
          <EvoWizard.Step id="one" title="Details">…</EvoWizard.Step>
          <EvoWizard.Step id="two" title="Confirm">…</EvoWizard.Step>
          <EvoWizard.Actions />
        </div>
      </EvoWizard>
    </div>
  );
}
```

## Accessibility

- Each active step's content renders inside a `role="group"` region (with `aria-label` set to its `title` when the title is plain text); inactive steps unmount entirely rather than being hidden with CSS, so screen readers and Tab order never encounter off-screen step content.
- `EvoWizard.Progress` is `EvoStepper` underneath and inherits its accessibility: a real `<ol>`/`<li>` list, `aria-current="step"` on the current step, and a visually-hidden `aria-live="polite"` region announcing step changes.
- `EvoWizard.Actions`' Back and Next/Finish are real `<button type="button">` elements with a visible `:focus-visible` ring. Back is **disabled**, not hidden, on the first step, so the action row's layout never shifts.
- The Review "Edit" affordance is a real `<button type="button">`; when its `label` is plain text it gets `aria-label="Edit <label>"` for an unambiguous accessible name (multiple rows otherwise all say "Edit").
- All motion — the step content's entrance transition and the Review Edit button's hover/active color transition — respects `prefers-reduced-motion`.

## Gotchas

- `EvoWizard.Progress`, `EvoWizard.Step`, `EvoWizard.Review`, and `EvoWizard.Actions` must be **direct** children of `EvoWizard` (siblings, not nested inside a wrapper `<div>`) — the root scans its immediate children by element type to build step metadata and inject each Step's index. Wrapping them breaks that scan.
- In `linear` (default) mode, `EvoWizard.Progress` never becomes clickable — there is no way to mark an individual `EvoStepper` marker as "not reachable yet" through EvoStepper's own API, so the whole progress bar stays display-only rather than showing a clickable-looking marker that silently no-ops. Set `linear={false}` if you want click-to-jump navigation.
- `canAdvance` only gates the **Next/Finish button**. In non-linear mode a user can still click a Progress marker to jump past an "incomplete" step — `linear={false}` means "fully free navigation," not "free navigation except for gating," by design.
- `EvoWizard.Review` renders `null` until the wizard is actually on the review "step" (one index past the last `EvoWizard.Step`) — it will not appear if you never composed it, and even when composed it won't render early.
- `EvoWizard.Review.Item`'s `step` prop matches against each `EvoWizard.Step`'s `id` (or its 0-based index if you didn't give it one) — a typo'd `step` id silently disables the Edit affordance (the button won't render) rather than throwing.
- While reviewing, `EvoWizard.Progress` shows every real step as `complete` (there's no step index equal to the review "position"), which is intentional — it's the same connector-banking flourish `EvoStepper` already does, just carried one step further. `EvoStepper`'s own live-region text will still name the last real step during review (a known minor limitation, not a bug) since `EvoStepper` clamps its announced position to a real step index.
- `EvoWizard` does not manage form values, validation, or submission — like [[evo-form]], you own your own state and wire `canAdvance` / `onComplete` to it yourself.
- Theme via `var(--evo-color-*)` tokens — never hard-coded hex — so EvoWizard stays correct in light and dark mode.
- Import styles once from `@justin_evo/evo-ui/dist/evo-ui.css`. Use named imports from `@justin_evo/evo-ui` only — never deep import paths.

## Related

- [[evo-stepper]] — the pure progress-display primitive `EvoWizard.Progress` composes.
- [[evo-form]] — the presentational form layout typically placed inside `EvoWizard.Step`.
- [[evo-button]] — powers `EvoWizard.Actions`' Back/Next/Finish buttons.
- [[evo-tabs]] — for independent, non-sequential views with no "advancement" concept.
- [[evo-theming]] — the `--evo-color-*` tokens EvoWizard is built on.
