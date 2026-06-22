---
name: evo-skeleton
description: Use when content is loading and you need placeholder loaders / shimmer skeletons to reserve layout space and prevent content jumps — loading states for text blocks, avatars, cards, lists, profile rows, and image/media boxes; covers EvoSkeleton plus EvoSkeleton.Text and EvoSkeleton.Circle.
---

# EvoSkeleton — Evo UI

> Evo UI component skill. Master index: [[evo-ui]].

## Overview

EvoSkeleton renders placeholder loaders that occupy the space of content that has not yet loaded, optionally with a shimmer animation. It ships a base rectangle plus two compound shapes — a multi-line text block (`EvoSkeleton.Text`) and a circle for avatars (`EvoSkeleton.Circle`) — so you can mirror your real layout while data is fetching.

## Import

```tsx
import { EvoSkeleton } from '@justin_evo/evo-ui';
// One-time, app-wide stylesheet import (e.g. in your entry file):
// import '@justin_evo/evo-ui/dist/evo-ui.css';
```

## When to use

- Showing a loading placeholder for content that will arrive shortly (async fetch, lazy-loaded data).
- Reserving exact layout space so the page does not jump when content appears.
- Building skeleton screens for lists, cards, profile rows, tables, or media boxes.
- Mimicking avatars (use `EvoSkeleton.Circle`) and paragraph text (use `EvoSkeleton.Text`).

## When NOT to use

- For determinate progress (use a progress bar instead — this is indeterminate placeholder UI).
- For a brief spinner-style "working" indicator where layout space is not reserved.
- For empty states or error states (skeletons imply "loading now", not "no data" / "failed").
- When the real content is already available — render the content, not a placeholder.

## Quick start

```tsx
import { EvoSkeleton } from '@justin_evo/evo-ui';

function LoadingRow() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      <EvoSkeleton width="100%" height={16} />
      <EvoSkeleton width="70%" height={16} />
      <EvoSkeleton width={200} height={80} borderRadius={8} />
    </div>
  );
}
```

## Props

### EvoSkeleton (base rectangle)

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `width` | `number \| string` | `'100%'` | No | Width of the skeleton. A `number` is treated as pixels; a `string` is used verbatim (e.g. `'70%'`, `'12rem'`). |
| `height` | `number \| string` | `'1rem'` | No | Height of the skeleton. A `number` is treated as pixels; a `string` is used verbatim. |
| `borderRadius` | `number \| string` | `'6px'` | No | Corner radius. A `number` is treated as pixels; a `string` is used verbatim. |
| `className` | `string` | `''` | No | Extra class name(s) appended to the skeleton element's class list. |
| `animated` | `boolean` | `true` | No | Enables the shimmer animation. Set `false` for a static placeholder. |

Note: `EvoSkeleton` does NOT forward `ref` or spread arbitrary native attributes — only the props above are accepted. `className` is merged onto the root `<div>`, but other HTML attributes (`id`, `style`, `data-*`, `aria-*`, event handlers) are not passed through.

## Sub-components

### EvoSkeleton.Text

Renders a stacked group of `lines` skeleton bars to mimic a paragraph. Every line is full width except the last, which is rendered at `65%` width to suggest a final short line. Each bar has a fixed height of `0.875rem` and a `4px` border radius (these are not configurable via props).

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `lines` | `number` | `3` | No | Number of text lines (bars) to render. |
| `className` | `string` | `''` | No | Extra class name(s) appended to the wrapping group element. |
| `animated` | `boolean` | `true` | No | Enables the shimmer animation on every line. |

### EvoSkeleton.Circle

Renders a single circular skeleton, ideal for avatars. Width and height are both set to `size` and the border radius is fixed at `50%`.

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `size` | `number \| string` | `40` | No | Diameter of the circle. A `number` is treated as pixels; a `string` is used verbatim. |
| `className` | `string` | `''` | No | Extra class name(s) appended to the circle element. |
| `animated` | `boolean` | `true` | No | Enables the shimmer animation. |

## Variants & options

EvoSkeleton has no union-typed `variant` / `severity` / `size` / `shape` props. The "variants" are the three exported shapes, selected by which element you render:

- `EvoSkeleton` — a base rectangle/bar; fully sized via `width`, `height`, and `borderRadius`. Use for headings, buttons, images, and arbitrary blocks.
- `EvoSkeleton.Text` — a multi-line paragraph block; sized by `lines`, with the last line shortened to 65%.
- `EvoSkeleton.Circle` — a circle; sized by `size`. Use for avatars and round icons.

The only boolean option is `animated` (default `true`), available on all three.

## Examples

### Basic shapes

```tsx
import { EvoSkeleton } from '@justin_evo/evo-ui';

function BasicShapes() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      <EvoSkeleton width="100%" height={16} />
      <EvoSkeleton width="70%" height={16} />
      <EvoSkeleton width={200} height={80} borderRadius={8} />
    </div>
  );
}
```

### Text block and circle

```tsx
import { EvoSkeleton } from '@justin_evo/evo-ui';

function TextAndAvatar() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <EvoSkeleton.Text lines={4} />
      <div style={{ display: 'flex', gap: '0.75rem' }}>
        <EvoSkeleton.Circle size={40} />
        <EvoSkeleton.Circle size={56} />
        <EvoSkeleton.Circle size={72} />
      </div>
    </div>
  );
}
```

### Profile card pattern (avatar + text), then swap in real content

```tsx
import { useEffect, useState } from 'react';
import { EvoSkeleton } from '@justin_evo/evo-ui';

function ProfileCard() {
  const [user, setUser] = useState<{ name: string; bio: string } | null>(null);

  useEffect(() => {
    fetchUser().then(setUser);
  }, []);

  if (!user) {
    return (
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', maxWidth: 360 }}>
        <EvoSkeleton.Circle size={48} />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.4rem', paddingTop: '0.2rem' }}>
          <EvoSkeleton width="60%" height={14} />
          <EvoSkeleton width="90%" height={12} />
          <EvoSkeleton width="40%" height={12} />
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 360 }}>
      <strong style={{ color: 'var(--evo-color-text)' }}>{user.name}</strong>
      <p style={{ color: 'var(--evo-color-text-muted)' }}>{user.bio}</p>
    </div>
  );
}
```

### Static (non-animated) placeholder

```tsx
import { EvoSkeleton } from '@justin_evo/evo-ui';

function StaticPlaceholders() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      <EvoSkeleton width="100%" height={16} animated={false} />
      <EvoSkeleton.Text lines={3} animated={false} />
      <EvoSkeleton.Circle size={40} animated={false} />
    </div>
  );
}
```

## Accessibility

- EvoSkeleton is purely presentational. It renders a plain `<div>` (`EvoSkeleton.Text` renders a wrapping `<div>` containing one `<div>` per line) with no `role`, no `aria-*` attributes, no `tabIndex`, and no keyboard handlers.
- There is no focus management or keyboard interaction — skeletons are not interactive.
- Because it carries no semantics, announce loading state at the container/region level if needed: place the skeleton inside an element with `aria-busy="true"` (and optionally `aria-live="polite"`) on your own wrapper while data loads, then swap in the real content when ready. EvoSkeleton itself does not set these — its props do not forward `aria-*`/`role` to the root, so set them on a wrapper you control.

## Gotchas

- No native attribute passthrough: only `width`/`height`/`borderRadius`/`className`/`animated` (base), `lines`/`className`/`animated` (Text), and `size`/`className`/`animated` (Circle) are read. `id`, `style`, `data-*`, `aria-*`, event handlers, and `ref` are NOT forwarded to the root element. Wrap the skeleton in your own element if you need those.
- `number` means pixels: passing `height={16}` yields `16px`; passing a string like `'1rem'` or `'70%'` is used as-is. The default `height` is the string `'1rem'`, the default `borderRadius` is the string `'6px'`, and the default `width` is the string `'100%'`.
- `EvoSkeleton.Text` lines are fixed-shape: each line is `0.875rem` tall with a `4px` radius, and the final line is `65%` wide. These are not configurable — for custom-sized rows compose base `EvoSkeleton` bars yourself.
- `EvoSkeleton.Circle` ignores `borderRadius` — it is always a perfect circle (`50%`); `size` drives both width and height.
- `animated` defaults to `true`; pass `animated={false}` everywhere you want a static placeholder. There is no global "animations off" prop — it is per-instance.
- Theme via tokens: any surrounding real content should use `var(--evo-color-*)` tokens (e.g. `var(--evo-color-text)`), never hard-coded hex, so light and dark mode both work.
- Single CSS import: import `@justin_evo/evo-ui/dist/evo-ui.css` once for the whole app; the skeleton styles (including the shimmer keyframes) come from there.
- Named import only: `import { EvoSkeleton } from '@justin_evo/evo-ui'`. Access the compound parts as `EvoSkeleton.Text` and `EvoSkeleton.Circle` — never import from deep paths.

## Related

- [[evo-card]] — skeletons commonly fill card loading states.
- [[evo-table]] — use skeleton rows while table data loads.
- [[evo-image-cropper]] — pair with a circle/box skeleton for image placeholders.
- [[evo-theming]] — CSS variable tokens that drive surrounding content colors.
- [[evo-ui]] — master index of all Evo UI component skills.
