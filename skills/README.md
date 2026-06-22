# Evo UI — Agent Skills

One exhaustive [Agent Skill](https://agentskills.io) per Evo UI component, plus a master
catalogue. They teach AI coding agents (and humans) how to use `@justin_evo/evo-ui` with
**real, documented props** — no hallucinated APIs.

## Start here

- **[`evo-ui/SKILL.md`](./evo-ui/SKILL.md)** — the master catalogue. Install/theming
  setup, the conventions every component follows, and an index of all 30 component skills
  organized by category.

Each `evo-<component>/SKILL.md` contains: an overview, import line, when (and when not) to
use it, a full props table with exact defaults, sub-components, every variant, copy-paste
examples, accessibility notes, and common gotchas.

## Install as a Claude Code plugin

```bash
/plugin marketplace add jinchuen/evo   # marketplace name: evo
/plugin install evo-ui@evo             # plugin name: evo-ui
```

Or copy this folder into your project's `.claude/skills/` (or `~/.claude/skills/`) to use
it with any skills-aware agent. See the repo [`README.md`](../README.md#build-with-ai--the-evo-ui-skills-plugin)
for full instructions.

## Catalogue

| Category | Skills |
| --- | --- |
| Foundations | `evo-theming` |
| Layout | `evo-stack`, `evo-grid`, `evo-container`, `evo-divider` |
| Navigation | `evo-topnav`, `evo-nav`, `evo-breadcrumb`, `evo-tabs`, `evo-pagination`, `evo-command-palette` |
| Forms & Inputs | `evo-button`, `evo-input`, `evo-autocomplete`, `evo-select`, `evo-tree-select`, `evo-checkbox`, `evo-radio`, `evo-toggle`, `evo-form`, `evo-rich-text-area` |
| Data Display | `evo-card`, `evo-table`, `evo-badge`, `evo-skeleton` |
| Feedback & Overlays | `evo-alert`, `evo-modal`, `evo-tooltip`, `evo-notification` |
| Media | `evo-image-cropper` |

> Keep skills in sync with the library: when you add or change a component in `evo-ui/`,
> update its `skills/<name>/SKILL.md` (and the master catalogue) in the same PR.
