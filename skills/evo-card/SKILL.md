---
name: evo-card
description: Use when building a content surface, panel, tile, or clickable summary card — grouping a title, description, media, body, and footer into one container, optionally interactive (a real button or link). Covers EvoCard and its parts Card.Root, Card.Header, Card.Title, Card.Description, Card.Body, Card.Footer, Card.Media.
---

# EvoCard — Evo UI

> Evo UI component skill. Master index: [[evo-ui]].

## Overview

EvoCard is a compose-based card primitive (Radix-style) whose surface is built from small slot sub-components rather than configured through prop arrays. It exposes three structural variants (elevated / outlined / ghost), responsive media layout, and first-class interactivity: when a card needs to be clickable it renders a real `<button type="button">` or `<a href>`, never a `<div onClick>`, so keyboard and screen-reader users are treated as first-class. All color comes from semantic theme tokens, so dark mode is automatic.

## Import

```tsx
import { EvoCard } from '@justin_evo/evo-ui';
// One-time stylesheet import (e.g. in your app entry):
// import '@justin_evo/evo-ui/dist/evo-ui.css';
```

`EvoCard` is callable directly (`<EvoCard>…</EvoCard>` forwards to Root) and also carries the sub-components as static properties: `EvoCard.Root`, `EvoCard.Header`, `EvoCard.Title`, `EvoCard.Description`, `EvoCard.Body`, `EvoCard.Footer`, `EvoCard.Media`.

## When to use

- Grouping related content (title, description, media, body, actions) into one bordered or elevated surface.
- Tiles in a grid or list — product cards, summary cards, dashboard panels.
- A whole card that should be clickable (navigates or triggers an action) and must stay accessible.
- Cards with a cover image or custom media region, including layouts that change between mobile and tablet.

## When NOT to use

- A single short status label or count — use [[evo-badge]].
- An inline contextual message or warning banner — use [[evo-alert]].
- A focus-trapping overlay / dialog — use [[evo-modal]].
- Pure spacing/layout of arbitrary children with no surface — use [[evo-stack]], [[evo-grid]], or [[evo-container]].
- Tabular rows of data — use [[evo-table]].

## Quick start

```tsx
import { EvoCard, EvoButton } from '@justin_evo/evo-ui';

function ProjectCard() {
  return (
    <EvoCard.Root variant="elevated" style={{ width: 320 }}>
      <EvoCard.Header>
        <EvoCard.Title as="h3">Project Aurora</EvoCard.Title>
        <EvoCard.Description>Q2 release candidate</EvoCard.Description>
      </EvoCard.Header>
      <EvoCard.Body>
        <p style={{ margin: 0, color: 'var(--evo-color-text-secondary)' }}>
          Aurora extends the platform with batch sync and offline queueing.
        </p>
      </EvoCard.Body>
      <EvoCard.Footer>
        <EvoButton label="View details" size="sm" />
      </EvoCard.Footer>
    </EvoCard.Root>
  );
}
```

## Props

### EvoCard / EvoCard.Root (`EvoCardRootProps`)

The root is a discriminated union: it is a static `<div>` by default, a `<button>` when `interactive` is `true`, or an `<a>` when `interactive` is `true` **and** `href` is set.

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `variant` | `'elevated' \| 'outlined' \| 'ghost'` | `'elevated'` | No | Visual emphasis of the card surface. |
| `orientation` | `'vertical' \| 'horizontal' \| 'responsive'` | `'vertical'` | No | Layout direction. `responsive` stacks vertically below 768px and switches to a side-by-side grid at/above 768px. |
| `interactive` | `boolean` | `false` | No | When `true`, renders the root as a real `<button type="button">` (or `<a>` when `href` is set) instead of a `<div>`. When omitted/`false`, the root is a static `<div>` and `href` is not allowed. |
| `href` | `string` | — | No | Only valid together with `interactive`. When provided, the root renders as an `<a href>`. Not allowed in the static or button forms. |
| `type` | `'button' \| 'submit' \| 'reset'` | `'button'` | No | Only valid in the interactive button form (no `href`). Forwarded to the `<button>` element. Defaults to `'button'` so the card never auto-submits a form. |
| `children` | `ReactNode` | — | Yes | The card content — typically the sub-components (Header, Title, Description, Body, Footer, Media). |
| `className` | `string` | — | No | Additional CSS class merged onto the root. |

The root spreads all remaining native attributes plus `ref` and `className` to the rendered root element, which varies by form: a `<div>` (`HTMLAttributes<HTMLDivElement>`) in the static case, a `<button>` (`ButtonHTMLAttributes<HTMLButtonElement>`, e.g. `onClick`, `disabled`) in the interactive button case, or an `<a>` (`AnchorHTMLAttributes<HTMLAnchorElement>`, e.g. `target`, `rel`) in the interactive anchor case. `ref` is typed as `HTMLElement` because the underlying element depends on the form.

## Sub-components

### EvoCard.Header (`EvoCardHeaderProps`)

Layout wrapper for the title and description. Renders a `<div>`.

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `className` | `string` | — | No | Additional CSS class merged onto the `<div>`. |
| `...rest` | `HTMLAttributes<HTMLDivElement>` | — | No | All native `<div>` attributes plus `ref` are forwarded to the root `<div>`. |

### EvoCard.Title (`EvoCardTitleProps`)

The card heading. Renders the heading element chosen by `as`.

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `as` | `'h2' \| 'h3' \| 'h4' \| 'h5' \| 'h6'` | `'h3'` | No | Semantic heading level. Only changes the rendered tag — visual size is fixed by the stylesheet, so the document outline stays correct without affecting layout. |
| `children` | `ReactNode` | — | Yes | Title text or nodes. |
| `className` | `string` | — | No | Additional CSS class merged onto the heading. |
| `...rest` | `HTMLAttributes<HTMLHeadingElement>` | — | No | All native heading attributes plus `ref` are forwarded to the rendered element. |

### EvoCard.Description (`EvoCardDescriptionProps`)

Secondary supporting text under the title. Renders a `<p>`.

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `className` | `string` | — | No | Additional CSS class merged onto the `<p>`. |
| `...rest` | `HTMLAttributes<HTMLParagraphElement>` | — | No | All native `<p>` attributes plus `ref` are forwarded to the root `<p>`. |

### EvoCard.Body (`EvoCardBodyProps`)

The main content region. Renders a `<div>`.

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `className` | `string` | — | No | Additional CSS class merged onto the `<div>`. |
| `...rest` | `HTMLAttributes<HTMLDivElement>` | — | No | All native `<div>` attributes plus `ref` are forwarded to the root `<div>`. |

### EvoCard.Footer (`EvoCardFooterProps`)

The actions / supplementary footer region (e.g. buttons). Renders a `<div>`.

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `className` | `string` | — | No | Additional CSS class merged onto the `<div>`. |
| `...rest` | `HTMLAttributes<HTMLDivElement>` | — | No | All native `<div>` attributes plus `ref` are forwarded to the root `<div>`. |

### EvoCard.Media (`EvoCardMediaProps`)

A media region for cover images or custom media. Renders a `<div>` wrapper. When `src` is set it renders an `<img>` inside; otherwise it renders `children`.

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `src` | `string` | — | No | Convenience: when set, renders an `<img src>` inside the wrapper. Omit and pass `children` for custom media. |
| `alt` | `string` | — | No | Alt text for the rendered `<img>`. Required (for accessibility) when `src` is set; use `alt=""` to mark the image decorative. If omitted while `src` is set, it falls back to `''`. |
| `aspectRatio` | `number \| string` | — | No | CSS `aspect-ratio` applied to the wrapper when no explicit dimensions are given. e.g. `16 / 9` or `'4/3'`. |
| `children` | `ReactNode` | — | No | Custom media content rendered when `src` is omitted. |
| `className` | `string` | — | No | Additional CSS class merged onto the wrapper `<div>`. |
| `style` | `CSSProperties` | — | No | Inline styles on the wrapper; merged after the `aspectRatio` style so your own `aspectRatio` (if any) wins is not overwritten — `aspectRatio` from the prop is applied first, then `style` is spread on top. |
| `...rest` | `HTMLAttributes<HTMLDivElement>` | — | No | All native `<div>` attributes plus `ref` are forwarded to the wrapper `<div>`. |

## Variants & options

### `variant` (root)

- `elevated` — raised surface with shadow; for hero / floating content. **(default)**
- `outlined` — bordered, flat surface; for grouped lists of cards.
- `ghost` — low-emphasis container with minimal chrome that still provides structure.

### `orientation` (root)

- `vertical` — slots stack top-to-bottom. **(default)**
- `horizontal` — slots lay out side by side.
- `responsive` — stacks vertically below 768px, switches to a side-by-side grid at/above 768px (media takes ~40% of the row, content fills the rest).

### `as` (EvoCard.Title)

- `h2`, `h3`, `h4`, `h5`, `h6` — pick the semantic heading level to keep the document outline correct. Visual size is constant regardless of level. Default is `h3`.

## Examples

### Variants

```tsx
import { EvoCard, EvoBadge } from '@justin_evo/evo-ui';

function Variants() {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
      {(['elevated', 'outlined', 'ghost'] as const).map((v) => (
        <EvoCard.Root key={v} variant={v} style={{ width: 240 }}>
          <EvoCard.Header>
            <EvoCard.Title as="h3">{v}</EvoCard.Title>
            <EvoCard.Description>A short summary of what this card is about.</EvoCard.Description>
          </EvoCard.Header>
          <EvoCard.Body>
            <EvoBadge severity="info" variant="subtle" size="sm">{v}</EvoBadge>
          </EvoCard.Body>
        </EvoCard.Root>
      ))}
    </div>
  );
}
```

### Media with responsive orientation

```tsx
import { EvoCard } from '@justin_evo/evo-ui';

function MediaCard() {
  return (
    <EvoCard.Root variant="outlined" orientation="responsive" style={{ maxWidth: 560 }}>
      <EvoCard.Media src="/cover.jpg" alt="" aspectRatio={16 / 9} />
      <EvoCard.Header>
        <EvoCard.Title as="h3">Responsive card</EvoCard.Title>
        <EvoCard.Description>Stacks on mobile, splits on tablet and up.</EvoCard.Description>
      </EvoCard.Header>
      <EvoCard.Body>
        <p style={{ margin: 0, color: 'var(--evo-color-text-secondary)' }}>
          Media takes 40% of the row in horizontal mode; content fills the rest.
        </p>
      </EvoCard.Body>
    </EvoCard.Root>
  );
}
```

Custom (non-`<img>`) media via `children` plus `aspectRatio`:

```tsx
import { EvoCard } from '@justin_evo/evo-ui';

function GradientMediaCard() {
  return (
    <EvoCard.Root variant="outlined" orientation="responsive" style={{ maxWidth: 560 }}>
      <EvoCard.Media
        aspectRatio={16 / 9}
        style={{
          background:
            'linear-gradient(135deg, var(--evo-color-primary-soft), var(--evo-color-surface-sunken))',
        }}
      />
      <EvoCard.Header>
        <EvoCard.Title as="h3">Custom media</EvoCard.Title>
      </EvoCard.Header>
    </EvoCard.Root>
  );
}
```

### Interactive cards (button and anchor)

```tsx
import { EvoCard } from '@justin_evo/evo-ui';

function InteractiveCards() {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
      {/* Renders a real <button type="button"> */}
      <EvoCard.Root
        variant="elevated"
        interactive
        onClick={() => alert('Card clicked')}
        style={{ width: 240 }}
      >
        <EvoCard.Header>
          <EvoCard.Title as="h3">Button card</EvoCard.Title>
          <EvoCard.Description>Renders as a native button.</EvoCard.Description>
        </EvoCard.Header>
      </EvoCard.Root>

      {/* Renders a real <a href> */}
      <EvoCard.Root
        variant="outlined"
        interactive
        href="https://example.com"
        target="_blank"
        rel="noreferrer"
        style={{ width: 240 }}
      >
        <EvoCard.Header>
          <EvoCard.Title as="h3">Anchor card</EvoCard.Title>
          <EvoCard.Description>Renders as an anchor link.</EvoCard.Description>
        </EvoCard.Header>
      </EvoCard.Root>
    </div>
  );
}
```

### Heading levels for correct outline

```tsx
import { EvoCard } from '@justin_evo/evo-ui';

function Headings() {
  return (
    <>
      <EvoCard.Title as="h2">Page-level card</EvoCard.Title>
      <EvoCard.Title as="h4">Card inside a section</EvoCard.Title>
    </>
  );
}
```

## Accessibility

- Interactive cards render as native `<button>` or `<a>` (never `<div onClick>`), so they are keyboard-reachable, focusable, and announce the correct role to assistive technology. The button form defaults `type="button"` so it never accidentally submits a surrounding form.
- Focus is shown via `:focus-visible` with a 2px outline in the theme's primary focus color.
- Interactive cards guarantee a >=44px minimum touch target (WCAG 2.5.5).
- `EvoCard.Title`'s `as` prop lets you choose `h2`–`h6` to keep the document heading outline correct; the level changes only the rendered tag, not the visual size.
- `EvoCard.Media` should pass `alt` when `src` is set. Use `alt=""` for purely decorative imagery (this is also the fallback when `alt` is omitted).
- All motion (hover lift, press) respects `prefers-reduced-motion`.
- Non-interactive (static) cards render a plain `<div>` and are purely presentational — they carry no implicit role, so wrap meaningful content in semantic elements (the `Title` heading does this for you).

## Gotchas

- `href` is only valid alongside `interactive`. The static `<div>` and button forms type `href` as `never` — passing `href` without `interactive` is a type error and won't switch the element.
- `interactive` must be exactly `true` (not just truthy at runtime in spirit — the component checks `interactive === true`). Without it the root is a static `<div>` with no click/keyboard semantics.
- The button form defaults `type="button"`; do not set `type="submit"` unless you intend the card to submit a form.
- `type` is only meaningful on the interactive button form. In the anchor form (`href` set) it is not a valid prop.
- The interactive button form disables via the native `disabled` attribute. The anchor form has no native disabled state — pass `aria-disabled="true"` and the component itself guards the click (calls `preventDefault`) so the link doesn't navigate; your own `onClick` still fires normally when not disabled. Both forms show `cursor: not-allowed` (never `pointer-events: none`, which would silently swallow the cursor feedback).
- For an accessible image, pass `alt` whenever you pass `src`. Omitting `alt` silently falls back to `alt=""` (decorative), which is wrong for informative images.
- `EvoCard.Media`'s `aspectRatio` only applies "when no explicit dimensions are given"; if you set width/height (or your own `style.aspectRatio`) those take effect — your `style` is spread after the prop-derived `aspectRatio`.
- `responsive` orientation swaps layout at the 768px breakpoint; test at mobile widths to verify the stack/split behavior.
- Theme via `var(--evo-color-*)`, `var(--evo-spacing-*)`, `var(--evo-radius-*)` tokens — never hard-coded hex — so cards stay correct in light and dark mode.
- Import styles once from `@justin_evo/evo-ui/dist/evo-ui.css`. Use named imports from `@justin_evo/evo-ui` only — never deep import paths.
- All sub-components forward `ref` and `className` and spread `...rest` to their root element; native attributes pass through.

## Related

- [[evo-badge]] — small status labels often placed inside a card body.
- [[evo-button]] — actions placed in `EvoCard.Footer`.
- [[evo-image-cropper]] — produce images to feed into `EvoCard.Media`.
- [[evo-grid]] — lay out collections of cards in a responsive grid.
- [[evo-stack]] — stack cards or their internal content vertically.
- [[evo-divider]] — separate sections within or between cards.
- [[evo-theming]] — the `--evo-color-*` / `--evo-radius-*` tokens cards are built on.
