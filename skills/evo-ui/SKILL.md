---
name: evo-ui
description: Use when building any web UI with the Evo UI React component library (@justin_evo/evo-ui) — to discover which Evo component fits a need, get install/theming/provider setup right, or browse the full component catalogue. Start here, then open the specific component skill (evo-button, evo-modal, evo-table, …) before writing code.
---

# Evo UI — Master Catalogue

> The entry point for building with Evo UI. Open this first, pick the component you
> need from the catalogue below, then read that component's own skill before coding.

## What is Evo UI

Evo UI (`@justin_evo/evo-ui`) is a high-performance, enterprise-grade React component
library: **38 components** across 9 categories, fully typed, with light/dark theming
driven by CSS variables, `forwardRef` + native attribute pass-through on every
component, and **zero runtime dependencies** (React 17+ is a peer dependency).

**Golden rule:** every component is named `Evo<Name>` and is imported by name from
`@justin_evo/evo-ui`. Never deep-import, and never invent a prop, variant, or
sub-component that the component's skill doesn't list.

## Setup (do this once per app)

```tsx
// 1. Install:  npm install @justin_evo/evo-ui   (peer deps: react, react-dom >= 17)

// 2. Import the stylesheet ONCE in your app entry. It ships the theme tokens too.
import '@justin_evo/evo-ui/dist/evo-ui.css'

import { EvoThemeProvider, EvoNotification } from '@justin_evo/evo-ui'

export default function App() {
  return (
    // 3. Wrap the app for light/dark/system theming.
    <EvoThemeProvider defaultTheme="system">
      {/* 4. (Optional) Enable toasts + notification center anywhere via evoNotify. */}
      <EvoNotification.Provider>
        <YourApp />
        <EvoNotification.Toaster />
      </EvoNotification.Provider>
    </EvoThemeProvider>
  )
}
```

See [[evo-theming]] for theme control and [[evo-notification]] for the `evoNotify`
singleton (`evoNotify.toast.success('Saved')`, callable from outside React).

## Conventions every component follows

- **Naming is consistent.** Variants are always `variant`; sizes are always
  `'sm' | 'md' | 'lg'`; open/close state is always `open`; value changes are
  `onChange`, derived state is `onXxxChange`.
- **Props are orthogonal.** `variant` × `severity` × `size` × `shape` compose freely —
  there is never a bundled `variant="rounded-danger"`.
- **Composition over configuration.** Compound parts (`<EvoCard.Header>`,
  `<EvoForm.Field>`, `<EvoTabs.Tab>`) over giant config-object props.
- **Native attributes pass through.** Every component forwards `ref`, `className`, and
  `...rest` to its root element.
- **Buttons never auto-submit** — `type` defaults to `'button'`.
- **Theme via tokens, never hex.** Use `var(--evo-color-*)`, `var(--evo-spacing-*)`,
  `var(--evo-radius-*)`. Hard-coded hex breaks dark mode.
- **Mobile-ready.** Interactive targets are ≥44px; layouts work down to 375px.

## How to use these skills

1. Find the need in the **catalogue** below and note the skill name.
2. Open that skill (e.g. `evo-button`) — it has the full props table, every variant,
   sub-components, accessibility notes, copy-paste examples, and gotchas.
3. Generate code using **only** the props/variants that skill documents.
4. Prefer composing Evo primitives ([[evo-stack]], [[evo-grid]], [[evo-card]]) over
   hand-rolled CSS layout.

## Component catalogue

### Foundations
| Skill | Exports | Use it for |
| --- | --- | --- |
| [[evo-theming]] | `EvoThemeProvider`, `useEvoTheme`, `EvoThemeToggle`, `getEvoThemeScript` | App-wide light/dark/system theming, a dark-mode toggle, persisted choice, and SSR flash prevention. |

### Layout
| Skill | Exports | Use it for |
| --- | --- | --- |
| [[evo-stack]] | `EvoStack` | One-dimensional flex row/column with consistent gap, alignment, and wrapping. |
| [[evo-grid]] | `EvoGrid`, `EvoGrid.Item` | Two-dimensional column/row grids with per-cell column/row spanning. |
| [[evo-container]] | `EvoContainer` | Centering and constraining page/section content to a readable max-width. |
| [[evo-divider]] | `EvoDivider` | A horizontal/vertical separator, optionally with a centered label. |

### Navigation
| Skill | Exports | Use it for |
| --- | --- | --- |
| [[evo-topnav]] | `EvoTopNav` (+ `.Brand/.Menu/.Item/.Actions/.Toggle/.Dropdown/.DropdownItem`) | A responsive site header: logo, links, dropdowns, actions, mobile hamburger drawer. |
| [[evo-nav]] | `EvoNav` (+ `.Group/.Item/.SubItem/.Skeleton/.QuickAction`) | A vertical sidebar / app nav with grouped, nested, active items and an icon rail. |
| [[evo-breadcrumb]] | `EvoBreadcrumb`, `EvoBreadcrumb.Item` | Showing the user's location in a nested page hierarchy with linked ancestors. |
| [[evo-tabs]] | `EvoTabs` (+ `.List/.Tab/.Panel`) | Switching between mutually exclusive tabbed content panels in one view. |
| [[evo-pagination]] | `EvoPagination` | Paginating lists, tables, or search results with prev/next and ellipsis. |
| [[evo-command-palette]] | `EvoCommandPalette` | A Cmd/Ctrl+K launcher with fuzzy search, grouped items, and shortcut hints. |

### Progress & Flow
| Skill | Exports | Use it for |
| --- | --- | --- |
| [[evo-progress]] | `EvoProgress` | Determinate/indeterminate progress bars (uploads, completion, storage meters); `minVisible` gives a goal-gradient head start without lying to assistive tech. |
| [[evo-progress-ring]] | `EvoProgressRing` | Compact radial/circular progress for dashboard tiles, tier badges, and card summaries, with a center content slot. |
| [[evo-stepper]] | `EvoStepper`, `EvoStepper.Step` | Multi-step flow progress (checkout, onboarding): current step highlighted, completed steps banked solid. |
| [[evo-wizard]] | `EvoWizard` (+ `.Progress/.Step/.Review/.Review.Item/.Actions`) | Stateful multi-step flows with gated advancement and a review payoff — onboarding, checkout, setup wizards. |

### Forms & Inputs
| Skill | Exports | Use it for |
| --- | --- | --- |
| [[evo-button]] | `EvoButton` | Triggering actions, form submit/reset, icon-only buttons, async loading buttons. |
| [[evo-input]] | `EvoInput` | Single-line text entry with label, helper/error text, and adornments. |
| [[evo-autocomplete]] | `EvoAutoComplete` | A typeahead / search-as-you-type field filtering a long or remote list. |
| [[evo-select]] | `EvoSelect` | Picking one or many values from a list with search, chips, and rich options. |
| [[evo-tree-select]] | `EvoTreeSelect` | Picking from nested/hierarchical data with cascade checkboxes and lazy loading. |
| [[evo-checkbox]] | `EvoCheckbox`, `EvoCheckbox.Group` | Boolean opt-ins, indeterminate "select all", grouped multi-select. |
| [[evo-radio]] | `EvoRadio`, `EvoRadio.Group` | Single choice from a small set of visible, mutually exclusive options. |
| [[evo-toggle]] | `EvoToggle` | Switching a single boolean setting on/off (dark mode, feature flags). |
| [[evo-form]] | `EvoForm` (+ `.Header/.Section/.Row/.Field/.Actions/.Repeater`) | Form layouts (login, settings, profiles) with shared label/error/required metadata; `.Repeater` for repeatable "add another" field groups. |
| [[evo-rich-text-area]] | `EvoRichTextArea` | In-app WYSIWYG rich text authoring with a configurable toolbar and image upload. |

### Data Display
| Skill | Exports | Use it for |
| --- | --- | --- |
| [[evo-card]] | `EvoCard` (+ `.Root/.Header/.Title/.Description/.Body/.Footer/.Media`) | Grouping title/media/body/actions into one surface, or a clickable tile. |
| [[evo-table]] | `EvoTable` | Sortable, structured row/column data with density, sticky header, mobile stacking. |
| [[evo-badge]] | `EvoBadge`, `EvoBadge.Group` | Status labels, count chips, category tags, dot indicators, removable filter tags. |
| [[evo-skeleton]] | `EvoSkeleton` (+ `.Text/.Circle`) | Loading placeholders that reserve layout space while content fetches. |
| [[evo-pricing-table]] | `EvoPricingTable` (+ `.Root/.Tier/.Price/.FeatureList/.Feature/.Cta`) | Tier/plan comparison with a struck-through anchor price, a raised recommended tier, and row-aligned features (price anchoring). |
| [[evo-countdown]] | `EvoCountdown` | Self-ticking "time remaining" text for deadlines/trials/offers; warning→danger escalation, days/clock/auto grain. |

### Feedback & Overlays
| Skill | Exports | Use it for |
| --- | --- | --- |
| [[evo-alert]] | `EvoAlert` | Inline success/error/warning/info banners and dismissible callouts; `urgency` for loss-aversion emphasis. |
| [[evo-banner]] | `EvoBanner` | Value-first promo/upsell/trial callout with a CTA + reassurance note — a calm `role="region"` landmark, not a status alert. |
| [[evo-modal]] | `EvoModal` (+ `.Header/.Body/.Footer`) | Modal dialogs, confirmations, and overlay panels (Escape + backdrop close). |
| [[evo-tooltip]] | `EvoTooltip` | A transient hover/focus hint positioned around a trigger. |
| [[evo-notification]] | `EvoNotification` (+ `.Provider/.Toaster/.Bell/.Panel`), `evoNotify`, `useEvoInbox` | Toasts and a persistent notification center, driven by the `evoNotify` singleton. |

### Media
| Skill | Exports | Use it for |
| --- | --- | --- |
| [[evo-image-cropper]] | `EvoImageCropper` | Cropping/zooming/rotating/masking an image before upload (avatars, banners). |

## Choosing the right component

- **Text in / text out** → [[evo-input]]; if it filters a list as you type → [[evo-autocomplete]].
- **One value from a list** → [[evo-select]] (or [[evo-radio]] for a few visible options).
- **Many values from a list** → [[evo-select]] (multiple) or [[evo-checkbox]] group.
- **Hierarchical data** → [[evo-tree-select]].
- **Yes/no** → [[evo-toggle]] (switch) or [[evo-checkbox]] (form opt-in).
- **A surface** → [[evo-card]]; **a transient message** → [[evo-alert]]; **a blocking dialog** → [[evo-modal]]; **a fleeting toast** → [[evo-notification]].
- **App chrome** → [[evo-topnav]] (top bar) and/or [[evo-nav]] (sidebar).
- **Layout** → [[evo-stack]] (1D), [[evo-grid]] (2D), [[evo-container]] (page width).
- **Progress / "don't start at 0%"** → [[evo-progress]] (bar) or [[evo-progress-ring]] (radial); **staged tasks** → [[evo-stepper]]; **a full stateful multi-step flow** → [[evo-wizard]].
- **Plans / pricing comparison** → [[evo-pricing-table]]; **a value-first promo before you ask for signup** → [[evo-banner]]; **a deadline / "time left" cue** → [[evo-countdown]] (or `urgency` on [[evo-alert]] / [[evo-notification]]).

## Global rules (apply to every component)

- Import named exports from `@justin_evo/evo-ui` only — never a deep path.
- Use only props/variants/sub-components the component's skill documents. If something
  isn't listed, it does not exist — don't invent it; fall back to a plain element and say so.
- Theme with `var(--evo-color-*)` tokens, never hard-coded hex.
- Keep accessibility props the examples show (`aria-label` on icon-only buttons, `alt` on images, labels on inputs).
- Import the stylesheet exactly once for the whole app.
