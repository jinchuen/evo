---
name: evo-theming
description: Use when an app needs light/dark/system color modes, a theme provider at the root, a persisted user theme choice, a sun/moon dark-mode toggle button, SSR flash-of-wrong-theme prevention, or programmatic read/set of the current theme — covers EvoThemeProvider, useEvoTheme, getEvoThemeScript, and EvoThemeToggle.
---

# EvoThemeProvider — Evo UI

> Evo UI component skill. Master index: [[evo-ui]].

## Overview

EvoThemeProvider is the Foundations primitive that drives Evo UI's light/dark/system theming. It resolves the selected mode (including following the OS preference for `'system'`), writes a single `data-theme` attribute to the document root, and persists the choice to `localStorage` — every component re-themes instantly through CSS custom properties with no re-render. The `useEvoTheme` hook reads/updates the theme, `EvoThemeToggle` is a drop-in sun/moon switch, and `getEvoThemeScript` prevents the first-paint flash in SSR.

## Import

```tsx
import {
  EvoThemeProvider,
  useEvoTheme,
  getEvoThemeScript,
  EvoThemeToggle,
} from '@justin_evo/evo-ui';
import type { EvoTheme, EvoResolvedTheme, EvoThemeContextValue } from '@justin_evo/evo-ui';
// One-time, anywhere in your app entry:
import '@justin_evo/evo-ui/dist/evo-ui.css';
```

## When to use

- Your app needs built-in light and dark modes that flip every Evo component at once.
- You want to follow the user's OS `prefers-color-scheme` preference automatically (`'system'`).
- You want the user's theme choice persisted across reloads via `localStorage`.
- You need a ready-made, accessible dark-mode toggle button (`EvoThemeToggle`).
- You need to read or programmatically set the current theme anywhere in the tree (`useEvoTheme`).
- You render server-side / static HTML and want to avoid the white flash before React hydrates (`getEvoThemeScript`).

## When NOT to use

- You manage `data-theme` entirely yourself and never need React state or persistence — you can set the attribute manually (e.g. `<html data-theme="dark">`) and components still respond; the provider is optional.
- You need per-component color variants (use the component's own `variant` / `severity` props instead of theming).
- You want to restyle a single component — override the relevant `--evo-color-*` token in your CSS rather than touching the provider.

## Quick start

```tsx
import { EvoThemeProvider, EvoThemeToggle } from '@justin_evo/evo-ui';
import '@justin_evo/evo-ui/dist/evo-ui.css';
import { createRoot } from 'react-dom/client';

createRoot(document.getElementById('root')!).render(
  <EvoThemeProvider defaultTheme="system">
    <header>
      <EvoThemeToggle />
    </header>
    <App />
  </EvoThemeProvider>
);
```

## Props

### EvoThemeProvider

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `children` | `ReactNode` | — | Yes | Subtree to provide the theme to. |
| `defaultTheme` | `EvoTheme` (`'light' \| 'dark' \| 'system'`) | `'system'` | No | Initial theme used before any persisted value is read. |
| `storageKey` | `string \| null` | `'evo-ui-theme'` | No | localStorage key used to persist the user's choice across reloads. Pass `null` to disable persistence entirely. |
| `attribute` | `'data-theme' \| 'class'` | `'data-theme'` | No | HTML attribute written to the document root. Most apps want `'data-theme'`; pass `'class'` to instead toggle `light` / `dark` as className (useful if sharing tokens with Tailwind). With `'class'`, `data-theme` is also still set so the CSS variables resolve. |
| `enableTransitions` | `boolean` | `true` | No | Animate color transitions when the theme flips. Automatically disabled for users with `prefers-reduced-motion`, and skipped on the first apply so the page doesn't fade in from the wrong colors. |
| `target` | `HTMLElement` | `document.documentElement` | No | Element to apply the theme attribute to. Useful for scoping the theme to part of the page. |

EvoThemeProvider does not forward `ref`, `className`, or `...rest` — it renders only a React context provider (no DOM element of its own).

## Sub-components

### `useEvoTheme()` — hook

Reads and updates the Evo theme. Must be called from a descendant of `<EvoThemeProvider>`. If called outside a provider it returns a graceful no-op fallback: `theme` / `resolvedTheme` reflect whatever `data-theme` is currently on `document.documentElement` (defaulting to `'light'`), `setTheme` logs a one-time console warning and does nothing, and `toggleTheme` is a no-op.

Returns an `EvoThemeContextValue`:

| Member | Type | Description |
| --- | --- | --- |
| `theme` | `EvoTheme` (`'light' \| 'dark' \| 'system'`) | The user-selected mode (may be `'system'`). |
| `resolvedTheme` | `EvoResolvedTheme` (`'light' \| 'dark'`) | The mode actually painted right now, after resolving `'system'` against the OS preference. Never `'system'`. |
| `setTheme` | `(theme: EvoTheme) => void` | Switch to a specific mode; persists to `localStorage` if `storageKey` is enabled. |
| `toggleTheme` | `() => void` | Flip between light and dark (treats `'system'` as its current resolved value). |

### `getEvoThemeScript(storageKey?)` — function

Returns an inline JavaScript string that applies the persisted theme before React hydrates, preventing the dark-mode white-flash on first paint. Drop it into your `<head>` (or a Next.js `<Script strategy="beforeInteractive">`).

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `storageKey` | `string` | `'evo-ui-theme'` | The localStorage key to read the saved theme from. Must match the provider's `storageKey`. |

Returns: `string` — a self-executing script that reads the stored value (or `'system'`), resolves it against `prefers-color-scheme`, and sets `data-theme` on `document.documentElement`. Failures are swallowed in a `try/catch`.

### `EvoThemeToggle` — component

A drop-in button that flips between light and dark mode. Must sit inside an `<EvoThemeProvider>`. The sun/moon icon and animation reflect the resolved theme automatically.

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | No | Visual size of the toggle. |
| `ariaLabel` | `string` | `'Toggle color theme'` | No | Accessible label for screen readers. |
| `className` | `string` | — | No | Extra className merged with the built-in styles. |
| `disabled` | `boolean` | `false` | No | Disables interaction and dims the control (native `disabled`, no `pointer-events: none`, so the `not-allowed` cursor still shows). |

`EvoThemeToggle` forwards a `ref` to the underlying `<button>` and spreads any other native
`ButtonHTMLAttributes` (`onClick`, `id`, `data-*`, `aria-*`, …) onto it. If you pass `onClick`,
it runs before the built-in `toggleTheme()` call; call `event.preventDefault()` in your handler
to suppress the theme flip.

## Variants & options

`EvoTheme` (the `defaultTheme` prop and `theme` value):

- `'light'` — force light mode regardless of OS preference.
- `'dark'` — force dark mode regardless of OS preference.
- `'system'` — follow the user's OS-level `prefers-color-scheme` preference, updating live when it changes.

`EvoResolvedTheme` (the `resolvedTheme` value — what is actually painted):

- `'light'` — light mode is applied.
- `'dark'` — dark mode is applied.

`attribute` prop:

- `'data-theme'` — write `data-theme="light|dark"` to the target (recommended).
- `'class'` — toggle `light` / `dark` classNames on the target (also still sets `data-theme`).

`EvoThemeToggle` `size`:

- `'sm'` — small toggle.
- `'md'` — medium toggle (default).
- `'lg'` — large toggle.

## Examples

### Wrap the app and persist under a custom key

```tsx
import { EvoThemeProvider } from '@justin_evo/evo-ui';
import '@justin_evo/evo-ui/dist/evo-ui.css';

export function Root() {
  return (
    <EvoThemeProvider defaultTheme="dark" storageKey="my-app-theme">
      <App />
    </EvoThemeProvider>
  );
}
```

### Build a custom toggle with the hook

```tsx
import { useEvoTheme } from '@justin_evo/evo-ui';

function MyToggle() {
  const { theme, resolvedTheme, setTheme, toggleTheme } = useEvoTheme();

  return (
    <div style={{ display: 'flex', gap: '0.5rem', color: 'var(--evo-color-text)' }}>
      <button type="button" onClick={toggleTheme}>
        {resolvedTheme === 'dark' ? '☀️ Light' : '🌙 Dark'}
      </button>
      <button type="button" onClick={() => setTheme('system')}>
        System {theme === 'system' ? '✓' : ''}
      </button>
    </div>
  );
}
```

### Three sizes of the built-in toggle

```tsx
import { EvoThemeToggle } from '@justin_evo/evo-ui';

function Toolbar() {
  return (
    <>
      <EvoThemeToggle size="sm" />
      <EvoThemeToggle size="md" ariaLabel="Switch theme" />
      <EvoThemeToggle size="lg" />
    </>
  );
}
```

### Prevent the SSR flash of wrong theme

```tsx
import { getEvoThemeScript } from '@justin_evo/evo-ui';

// e.g. inside a Next.js _document or any HTML <head> template.
// Pass the same storageKey you gave EvoThemeProvider if you customised it.
<script dangerouslySetInnerHTML={{ __html: getEvoThemeScript() }} />
```

### Override theme tokens in your own CSS

```css
/* Change the brand color in both modes — never hard-code hex in components. */
:root {
  --evo-color-primary:       var(--brand, #ff6b6b);
  --evo-color-primary-hover: #e8484b;
  --evo-color-primary-fg:    #ffffff;
}

/* Tweak only dark-mode surfaces. */
[data-theme='dark'] {
  --evo-color-bg:      #0a0a0a;
  --evo-color-surface: #141414;
}
```

## Accessibility

- `EvoThemeToggle` renders a real `<button type="button">` (never auto-submits a form) with `role="switch"`.
- It exposes `aria-checked={resolvedTheme === 'dark'}` so screen readers announce on/off state, and `aria-label` (default `'Toggle color theme'`, overridable via `ariaLabel`).
- It sets `data-theme-state={resolvedTheme}` on the button for CSS-driven icon/animation state.
- The decorative sun and moon SVGs are marked `aria-hidden="true"`.
- Theme transition animations respect `prefers-reduced-motion` (auto-disabled) and are also skipped on first paint to avoid fading in from the wrong colors.
- When on `'system'`, the provider listens to `matchMedia('(prefers-color-scheme: dark)')` and updates live as the OS preference changes.
- Ensure the toggle meets the ≥44px mobile touch-target requirement — the `sm`/`md`/`lg` visual track sizes stay compact, but a `@media (pointer: coarse)` rule bumps the hit area to `2.75rem` (44px) square on touch devices.
- The knob slide and icon rotate/fade are skipped under `prefers-reduced-motion: reduce`.

## Gotchas

- `useEvoTheme` and `EvoThemeToggle` must be rendered inside `<EvoThemeProvider>`. Outside it, `useEvoTheme` returns a no-op fallback (read-only `resolvedTheme` from the DOM) and `setTheme` logs a console warning instead of changing anything.
- `resolvedTheme` is never `'system'` — it is always `'light'` or `'dark'`. Use `theme` to read the user's raw selection.
- `getEvoThemeScript()` must be given the **same** `storageKey` as the provider, or it will read the wrong key and the flash will reappear. Both default to `'evo-ui-theme'`.
- `EvoThemeProvider` renders no DOM element — do not pass `className`, `style`, or `ref` to it; they are ignored.
- `EvoThemeToggle` forwards a `ref` and spreads native `<button>` attributes (`...rest`) onto the root element, in addition to `size`, `ariaLabel`, `className`, and `disabled`.
- Changing `defaultTheme` after a value is already persisted in `localStorage` has no effect — the stored choice wins. Pass `storageKey={null}` to disable persistence, or clear the key.
- Theme your UI through `var(--evo-color-*)` tokens (e.g. `var(--evo-color-primary)`, `var(--evo-color-bg)`), never hard-coded hex — hard-coded colors break dark mode.
- Import the stylesheet `@justin_evo/evo-ui/dist/evo-ui.css` exactly once; it ships the tokens that make theming work.
- Use named imports from `@justin_evo/evo-ui` only — no deep import paths.
- With `attribute="class"`, the provider toggles `light`/`dark` classNames but still also sets `data-theme` so the Evo CSS variables resolve.

## Related

- [[evo-button]]
- [[evo-badge]]
- [[evo-toggle]]
- [[evo-card]]
- [[evo-ui]]
