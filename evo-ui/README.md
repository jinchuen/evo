# Evo UI

**A high-performance, enterprise-grade React UI component library.**

Evo UI ships 30+ accessible, themeable React components — with built-in light &
dark mode, full TypeScript types, `forwardRef` + native attribute pass-through,
and **zero runtime dependencies**.

- 📚 **Documentation:** https://elevora-ui-document-3fb80.web.app
- 💻 **GitHub:** https://github.com/jinchuen/evo
- 📦 **npm:** https://www.npmjs.com/package/@justin_evo/evo-ui

## Installation

```bash
npm install @justin_evo/evo-ui
```

`react` and `react-dom` (>= 17) are peer dependencies. Evo UI itself has no
runtime dependencies.

## Quick start

```jsx
// Import the stylesheet once in your app entry (includes the light/dark theme tokens)
import '@justin_evo/evo-ui/dist/evo-ui.css'

import { EvoThemeProvider, EvoButton } from '@justin_evo/evo-ui'

export default function App() {
  return (
    <EvoThemeProvider defaultTheme="system">
      <EvoButton variant="solid" severity="primary">Hello Evo</EvoButton>
    </EvoThemeProvider>
  )
}
```

## Why Evo UI

- 🌗 **Light & dark mode** out of the box — CSS-variable theming, no runtime cost.
- 📱 **Mobile-ready** — ≥ 44px touch targets, responsive down to 375px.
- 🔡 **Fully typed** — ships `.d.ts`; every component forwards `ref` and native attributes.
- 🧩 **Composable, orthogonal APIs** — e.g. `<Form.Field><Form.Label /></Form.Field>`.
- 🪶 **Zero runtime dependencies.**

## Components

Full props, variants, and live examples for every component live in the
[documentation](https://elevora-ui-document-3fb80.web.app).

| Category               | Components                                                                                                  |
| ---------------------- | ---------------------------------------------------------------------------------------------------------- |
| **Theming**            | `EvoThemeProvider`, `EvoThemeToggle`                                                                        |
| **Layout & structure** | `EvoStack`, `EvoGrid`, `EvoDivider`, `EvoContainer`, `EvoCard`                                              |
| **Navigation**         | `EvoTabs`, `EvoBreadcrumb`, `EvoNav`, `EvoTopNav`, `EvoPagination`, `EvoCommandPalette`                     |
| **Forms & inputs**     | `EvoInput`, `EvoRichTextArea`, `EvoSelect`, `EvoTreeSelect`, `EvoAutoComplete`, `EvoCheckbox`, `EvoRadio`, `EvoToggle`, `EvoForm` |
| **Feedback & overlays**| `EvoModal`, `EvoNotification`, `EvoTooltip`, `EvoAlert`                                                     |
| **Data display**       | `EvoBadge`, `EvoSkeleton`, `EvoTable`                                                                       |
| **General**            | `EvoButton`                                                                                                 |
| **Media**              | `EvoImageCropper`                                                                                           |

## Documentation

Browse the full component catalogue, prop tables, and copy-paste examples at
**https://elevora-ui-document-3fb80.web.app**.

## License

MIT © Justin Khor
