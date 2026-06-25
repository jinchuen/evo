# Evo UI

A high-performance, enterprise-grade React UI component library — published as
[`@justin_evo/evo-ui`](https://www.npmjs.com/package/@justin_evo/evo-ui).

- 📚 **Documentation:** https://docs.elevora.com.my
- 💻 **GitHub:** https://github.com/jinchuen/evo
- 📦 **npm:** https://www.npmjs.com/package/@justin_evo/evo-ui

## Install

```bash
npm install @justin_evo/evo-ui
```

`react` and `react-dom` (>= 17) are **peer dependencies**, so your app provides
React. Evo UI itself has **zero runtime dependencies**.

## Quick start

```jsx
import '@justin_evo/evo-ui/dist/evo-ui.css'   // styles + light/dark theme tokens — import once
import { EvoThemeProvider, EvoButton } from '@justin_evo/evo-ui'

export default function App() {
  return (
    <EvoThemeProvider defaultTheme="system">
      <EvoButton variant="solid" severity="primary">Hello Evo</EvoButton>
    </EvoThemeProvider>
  )
}
```

Browse every component, full prop tables, and live examples in the
**[documentation site](https://docs.elevora.com.my)**.

## Build with AI — the Evo UI skills plugin

Evo UI ships an **agent-skills plugin** so AI coding tools generate Evo UI code with
_real_ props instead of hallucinating. It contains **one exhaustive skill per component**
(props, every variant, sub-components, accessibility, and copy-paste examples) plus a
master catalogue — all under [`skills/`](./skills) — and is installable as a Claude Code
plugin.

### Install in Claude Code

```bash
# 1. Add this repo as a plugin marketplace (the marketplace is named "evo")
/plugin marketplace add jinchuen/evo

# 2. Install the plugin (named "evo-ui")
/plugin install evo-ui@evo
```

The skills then load on demand. Ask for what you want — e.g. _"Build a settings page with
a profile form and an avatar cropper"_ — and the agent reads `evo-form`, `evo-input`,
`evo-image-cropper`, etc. before writing code. Start from the **`evo-ui`** master skill,
which indexes every component and the install/theming setup.

### Use it with any other agent (Cursor, Codex, Windsurf, …)

The skills are plain Markdown, so you don't need Claude Code to benefit:

- **Copy** the [`skills/`](./skills) folder into your project's `.claude/skills/` (or
  `~/.claude/skills/` to use it everywhere), or into your tool's equivalent skills directory.
- **Or point your agent at the docs.** The docs site's **/ai** page publishes a
  ready-to-paste prompt listing every component and its documentation URL.

### What's inside

```text
skills/
  evo-ui/SKILL.md          ← master catalogue — start here
  evo-button/SKILL.md
  evo-modal/SKILL.md
  evo-table/SKILL.md
  …                        ← one skill per component (30 component skills + the master)
.claude-plugin/
  plugin.json              ← plugin manifest   (plugin name:      evo-ui)
  marketplace.json         ← marketplace manifest (marketplace name: evo)
```

> **Keep it in sync:** when you add or change a component in `evo-ui/`, update its skill
> in `skills/<name>/SKILL.md` (and add a row to `skills/evo-ui/SKILL.md`) in the same PR —
> just like the docs page. A stale skill makes agents hallucinate, the exact problem this
> plugin exists to prevent.

## Features

- 🌗 Light & dark mode out of the box (CSS-variable theming, no runtime cost)
- 📱 Mobile-ready: ≥ 44px touch targets, responsive down to 375px
- 🔡 Fully typed — ships `.d.ts`, `forwardRef` + native attribute pass-through
- 🧩 Composable, orthogonal APIs (e.g. `<Form.Field><Form.Label /></Form.Field>`)

## Repository layout

This is a monorepo with two packages:

| Folder            | What it is                                                                          |
| ----------------- | ----------------------------------------------------------------------------------- |
| `evo-ui/`         | The published library (`@justin_evo/evo-ui`). Source lives in `src/`.                |
| `evo-docs/`       | The documentation site (Vite + React), deployed to Railway.                          |
| `skills/`         | Agent skills — one exhaustive guide per component + a master catalogue (see below).  |
| `.claude-plugin/` | Plugin + marketplace manifests that make `skills/` installable as a Claude Code plugin. |

## Local development

```bash
# Build the library first (the docs link to it locally)
cd evo-ui && npm install && npm run build

# Then run the docs site
cd ../evo-docs && npm install && npm run dev
```

## Contributing

Read **[`CLAUDE.md`](./CLAUDE.md)** first — it is the source of truth for the
component checklist, theming rules, the changelog format, and the
publish / deployment workflow (**section 13**).

## License

MIT © Justin Khor
