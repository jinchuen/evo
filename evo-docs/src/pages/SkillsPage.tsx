import { useMemo } from 'react'
import { EvoBadge } from '@justin_evo/evo-ui'
import { CodeBlock } from '../components/CodeBlock'

/**
 * Catalogue of every component / foundation page available in the docs.
 *
 * Used to build the fallback prompt below (for AI tools that can't install the
 * skills plugin). It deliberately lists only component names + doc URLs — never
 * inlined prop tables — so the model fetches the live page on demand instead of
 * hallucinating from memorised fragments.
 *
 * When you add a new component, append it here AND make sure its docs page
 * exists at the matching path (and ship its skill under /skills in the repo).
 */
const CATALOGUE: { group: string; items: { name: string; path: string }[] }[] = [
  {
    group: 'Foundations',
    items: [
      { name: 'Theming',   path: '/theming'   },
      { name: 'Utilities', path: '/utilities' },
    ],
  },
  {
    group: 'Forms',
    items: [
      { name: 'EvoButton',       path: '/components/button'       },
      { name: 'EvoInput',        path: '/components/input'        },
      { name: 'EvoAutoComplete', path: '/components/autocomplete' },
      { name: 'EvoCheckbox',     path: '/components/checkbox'     },
      { name: 'EvoRadio',        path: '/components/radio'        },
      { name: 'EvoSelect',       path: '/components/select'       },
      { name: 'EvoTreeSelect',   path: '/components/tree-select'  },
      { name: 'EvoToggle',       path: '/components/toggle'       },
      { name: 'EvoForm',         path: '/components/form'         },
    ],
  },
  {
    group: 'Rich Text',
    items: [
      { name: 'EvoRichTextArea',         path: '/components/rich-text-area'        },
      { name: '↳ Tools & Customization', path: '/components/rich-text-area/tools'  },
      { name: '↳ Image Upload',          path: '/components/rich-text-area/images' },
      { name: '↳ API Reference',         path: '/components/rich-text-area/api'    },
    ],
  },
  {
    group: 'Layout',
    items: [
      { name: 'EvoStack',     path: '/components/stack'     },
      { name: 'EvoGrid',      path: '/components/grid'      },
      { name: 'EvoContainer', path: '/components/container' },
      { name: 'EvoDivider',   path: '/components/divider'   },
    ],
  },
  {
    group: 'Navigation',
    items: [
      { name: 'EvoNav',        path: '/components/nav'        },
      { name: 'EvoTopNav',     path: '/components/topnav'     },
      { name: 'EvoBreadcrumb', path: '/components/breadcrumb' },
      { name: 'EvoTabs',       path: '/components/tabs'       },
      { name: 'EvoPagination', path: '/components/pagination' },
      { name: 'EvoCommandPalette', path: '/components/command-palette' },
    ],
  },
  {
    group: 'Data Display',
    items: [
      { name: 'EvoCard',     path: '/components/card'     },
      { name: 'EvoTable',    path: '/components/table'    },
      { name: 'EvoBadge',    path: '/components/badge'    },
      { name: 'EvoSkeleton', path: '/components/skeleton' },
    ],
  },
  {
    group: 'Feedback',
    items: [
      { name: 'EvoAlert',   path: '/components/alert'   },
      { name: 'EvoModal',   path: '/components/modal'   },
      { name: 'EvoTooltip', path: '/components/tooltip' },
      { name: 'EvoNotification', path: '/components/notification' },
    ],
  },
  {
    group: 'Media',
    items: [
      { name: 'EvoImageCropper',    path: '/components/image-cropper'     },
      { name: '↳ API Reference',    path: '/components/image-cropper/api' },
    ],
  },
]

const INSTALL = `# 1. Add this repo as a plugin marketplace (the marketplace is named "evo")
/plugin marketplace add jinchuen/evo

# 2. Install the plugin (the plugin is named "evo-ui")
/plugin install evo-ui@evo`

const MANUAL = `# Use the skills with any skills-aware agent without installing the plugin:
# clone the repo, then copy the skills into your agent's skills directory.
git clone https://github.com/jinchuen/evo
cp -r evo/skills/* ~/.claude/skills/     # or your tool's equivalent skills dir`

function buildPrompt(origin: string): string {
  const url = (path: string) => `${origin}${path}`
  const catalogueLines = CATALOGUE.flatMap((g) => [
    ``,
    `## ${g.group}`,
    ...g.items.map((it) => `- ${it.name} → ${url(it.path)}`),
  ]).join('\n')

  return `You are helping a developer build a React app using the Evo UI component library
(\`@justin_evo/evo-ui\`). Follow these rules strictly.

# Setup (always do this first in a fresh project)
1. Install: \`npm install @justin_evo/evo-ui\`
2. Import the stylesheet ONCE in the app entry:
   \`import '@justin_evo/evo-ui/dist/evo-ui.css'\`
3. Wrap the app in \`<EvoThemeProvider defaultTheme="system">\` for light/dark theming.
4. Wrap the app in \`<EvoNotification.Provider>\` and mount \`<EvoNotification.Toaster />\`
   once. Call toasts/notifications from anywhere via the \`evoNotify\` singleton
   (no hook required) — e.g. \`evoNotify.toast.success('Saved')\`,
   \`evoNotify.push({ title, description })\`.

# Naming and imports
- Every component is named \`Evo<Name>\` (e.g. \`EvoButton\`, \`EvoInput\`).
- Import named exports from \`@justin_evo/evo-ui\` — never from a deep path.

# Component catalogue (this is the ONLY list of components that exists)
Each entry below is a docs URL. **Before generating code that uses a component,
fetch the URL beside its name and only use props/variants the page explicitly
documents.** Do not invent props, variants, or sub-components.
${catalogueLines}

# Workflow for every request
1. Pick the smallest set of components from the catalogue above that solves the task.
2. For each component you plan to use, fetch its docs URL. Read the props table and
   at least one usage example before generating code.
3. Prefer composing Evo UI primitives (\`EvoStack\`, \`EvoGrid\`, \`EvoCard\`, etc.) over
   hand-rolling layout with raw CSS.
4. Use theme tokens (e.g. \`var(--evo-color-primary)\`) instead of hard-coded hex values.
5. If something the user wants is NOT in the catalogue, say so plainly and either
   suggest the closest Evo UI component or fall back to a plain HTML element. Never
   invent an \`Evo*\` component that isn't listed above.

# What you must never do
- Never dump prop names you "remember" without confirming on the docs page.
- Never import from \`@justin_evo/evo-ui/...\` deep paths.
- Never silently drop accessibility props (\`aria-*\`, \`label\`) the docs page shows.

Now answer the user's request, following the rules above.`
}

export default function SkillsPage() {
  // Build the fallback prompt with whatever origin this docs site is served from,
  // so a user who copies it gets URLs that actually resolve for them.
  const prompt = useMemo(() => {
    const origin =
      typeof window !== 'undefined' && window.location?.origin
        ? window.location.origin
        : 'https://elevora-ui-document-3fb80.web.app'
    return buildPrompt(origin)
  }, [])

  return (
    <div>
      <div className="docs-page-header">
        <div className="docs-page-tag">For AI</div>
        <h1 className="docs-page-title">Skills</h1>
        <p className="docs-page-desc">
          Evo UI ships an <strong>agent-skills plugin</strong> so AI coding tools build with{' '}
          <strong>real, documented props</strong> instead of hallucinating. Install it once and
          your agent learns every component on demand — no giant prompt to paste, nothing to keep
          up to date by hand.
        </p>
      </div>

      <div className="docs-section">
        <div className="docs-section-title">
          What you get
          <EvoBadge severity="success" variant="subtle">30 skills + catalogue</EvoBadge>
        </div>
        <p className="docs-section-desc">
          The plugin bundles one exhaustive skill per component plus a master catalogue that
          indexes them all. Each component skill is a complete, accurate reference an agent can act
          on directly:
        </p>
        <ul className="docs-list">
          <li>Full props table with exact defaults, every variant, and all sub-components.</li>
          <li>Copy-paste examples, accessibility notes, and common gotchas.</li>
          <li>
            A master <code>evo-ui</code> skill with install/theming setup and a “which component
            do I need?” index.
          </li>
          <li>Installs as a Claude Code plugin, or drops into any skills-aware agent.</li>
        </ul>
      </div>

      <div className="docs-section">
        <div className="docs-section-title">
          Install in Claude Code
          <EvoBadge severity="info" variant="subtle">recommended</EvoBadge>
        </div>
        <p className="docs-section-desc">
          The repository doubles as a single-plugin marketplace. Add it, then install — the skills
          load on demand the moment your request needs a component.
        </p>
        <CodeBlock lang="bash" code={INSTALL} />
        <p className="docs-section-desc">
          The marketplace is named <code>evo</code> and the plugin is named <code>evo-ui</code>,
          which is why the install target is <code>evo-ui@evo</code>. After installing, just ask
          for what you want — e.g.{' '}
          <em>“Build a settings page with a profile form and an avatar cropper”</em> — and the
          agent reads <code>evo-form</code>, <code>evo-input</code>, and{' '}
          <code>evo-image-cropper</code> before writing a line of code.
        </p>
      </div>

      <div className="docs-section">
        <div className="docs-section-title">Use it with any other agent</div>
        <p className="docs-section-desc">
          The skills are plain Markdown, so Cursor, Codex, Windsurf, and others can use them too.
          Copy the <code>skills/</code> folder into your agent's skills directory (for Claude Code
          that's <code>.claude/skills/</code> in a project, or{' '}
          <code>~/.claude/skills/</code> globally):
        </p>
        <CodeBlock lang="bash" code={MANUAL} />
        <p className="docs-section-desc">
          Browse the skills on{' '}
          <a href="https://github.com/jinchuen/evo/tree/main/skills" target="_blank" rel="noreferrer">
            GitHub
          </a>
          . If your tool can't load skills at all, paste the prompt below instead.
        </p>
      </div>

      <div className="docs-section">
        <div className="docs-section-title">No plugin support? Paste this prompt</div>
        <p className="docs-section-desc">
          For any chat-based model without skills or plugins, this prompt teaches it the same
          discipline: install correctly, look up each component on its docs page, and never invent
          a prop it can't see. The catalogue is generated from this docs site, so the URLs always
          resolve.
        </p>
        <CodeBlock lang="markdown" code={prompt} />
        <p className="docs-section-desc">
          Paste it as the <code>system</code> message (or first message) in your AI tool, then ask
          for what you actually want. The model fetches each component's docs page before generating
          code, so the output uses real props instead of made-up ones.
        </p>
      </div>
    </div>
  )
}
