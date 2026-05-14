import { useMemo } from 'react'
import { EvoBadge } from '@justin_evo/evo-ui'
import { CodeBlock } from '../components/CodeBlock'

/**
 * Catalogue of every component / foundation page available in the docs.
 *
 * IMPORTANT — this is the ONLY place where component names appear in the AI
 * prompt. We deliberately do NOT inline prop tables, variants, or code
 * examples. The prompt instructs the AI to fetch each component's doc page
 * on demand instead. Adding a full API dump here would:
 *   • blow up the user's prompt budget,
 *   • go stale the moment we ship a new prop,
 *   • encourage the AI to hallucinate from memorised fragments.
 *
 * When you add a new component, append it here AND make sure its docs page
 * exists at the matching path.
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
      { name: 'EvoButton',     path: '/components/button'      },
      { name: 'EvoInput',      path: '/components/input'       },
      { name: 'EvoCheckbox',   path: '/components/checkbox'    },
      { name: 'EvoRadio',      path: '/components/radio'       },
      { name: 'EvoSelect',     path: '/components/select'      },
      { name: 'EvoTreeSelect', path: '/components/tree-select' },
      { name: 'EvoToggle',     path: '/components/toggle'      },
      { name: 'EvoForm',       path: '/components/form'        },
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
      { name: 'EvoToast',   path: '/components/toast'   },
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
4. Wrap anything that may show toasts in \`<EvoToastProvider>\`.

# Naming and imports
- Every component is named \`Evo<Name>\` (e.g. \`EvoButton\`, \`EvoInput\`).
- Import named exports from \`@justin_evo/evo-ui\` — never from a deep path.
- The Theme + utility CSS classes (\`docs-...\` are NOT public — those belong to
  the docs site). For utility classes consumers can use, see the Utilities page.

# Component catalogue (this is the ONLY list of components that exists)
Each entry below is a docs URL. **Before generating code that uses a component,
fetch the URL beside its name and only use props/variants the page explicitly
documents.** Do not invent props, variants, or sub-components.
${catalogueLines}

# Workflow for every request
1. Read the user's request and pick the smallest set of components from the
   catalogue above that solves it.
2. For each component you plan to use, fetch its docs URL. Read the props
   table and at least one usage example before generating code.
3. Prefer composing Evo UI primitives (\`EvoStack\`, \`EvoGrid\`, \`EvoCard\`,
   etc.) over hand-rolling layout with raw CSS.
4. Use theme tokens (e.g. \`var(--evo-color-primary)\`) instead of hard-coded
   hex values so the app stays themeable.
5. If something the user wants is NOT in the catalogue, say so plainly and
   either suggest the closest Evo UI component or fall back to a plain HTML
   element. Never invent an \`Evo*\` component that isn't listed above.

# What you must never do
- Never dump prop names you "remember" without confirming on the docs page.
- Never import from \`@justin_evo/evo-ui/...\` deep paths.
- Never edit the library's CSS variables globally — override them inside a
  scope (e.g. on a wrapper div) when the user wants per-section theming.
- Never silently drop accessibility props (\`aria-*\`, \`label\`) the docs page
  shows in its examples.

Now answer the user's request, following the rules above.`
}

export default function AIPromptPage() {
  // Build the prompt with whatever origin this docs site is served from, so a
  // user who copies it gets URLs that actually resolve for them.
  const prompt = useMemo(() => {
    const origin =
      typeof window !== 'undefined' && window.location?.origin
        ? window.location.origin
        : 'https://your-evo-ui-docs.example'
    return buildPrompt(origin)
  }, [])

  return (
    <div>
      <div className="docs-page-header">
        <div className="docs-page-tag">For AI</div>
        <h1 className="docs-page-title">Build with AI</h1>
        <p className="docs-page-desc">
          Paste the prompt below into ChatGPT, Claude, Cursor, or any coding agent before asking
          it to build with Evo UI. It teaches the model how to install, where to look up each
          component, and — most importantly — <strong>not</strong> to invent props it doesn't see
          in the docs.
        </p>
      </div>

      <div className="docs-section">
        <div className="docs-section-title">
          Why a prompt instead of stuffing the whole API in?
          <EvoBadge severity="info" variant="subtle">design note</EvoBadge>
        </div>
        <p className="docs-page-desc">
          Pasting every prop table for 30+ components into a model wastes tokens and goes stale
          the moment we ship a new prop. Instead, this prompt lists <strong>names + doc URLs</strong>{' '}
          only, and tells the model to fetch the relevant page on demand. The catalogue here is
          generated from a single list, so when a new component lands in the docs sidebar, it
          shows up here automatically.
        </p>
      </div>

      <div className="docs-section">
        <div className="docs-section-title">The prompt</div>
        <CodeBlock lang="markdown" code={prompt} />
      </div>

      <div className="docs-section">
        <div className="docs-section-title">How to use it</div>
        <ol style={{ paddingLeft: '1.2rem', color: 'var(--docs-text-muted)', lineHeight: 1.7 }}>
          <li>Copy the prompt above (the URLs are already set to this docs site).</li>
          <li>
            Paste it as the <code>system</code> message (or first message) in your AI tool.
          </li>
          <li>
            Ask for what you actually want: <em>"Build a settings page with a profile form,
            avatar upload, and a danger zone."</em>
          </li>
          <li>
            The AI will fetch each component's docs page before generating code, so the output
            uses real props instead of made-up ones.
          </li>
        </ol>
      </div>
    </div>
  )
}
