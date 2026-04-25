import { useNavigate } from 'react-router-dom'
import { EvoButton, EvoStack, EvoBadge } from '@justin_evo/evo-ui'
import { CodeBlock } from '../components/CodeBlock'

const components = [
  { name: 'Button', path: '/components/button', cat: 'Forms' },
  { name: 'Input', path: '/components/input', cat: 'Forms' },
  { name: 'Checkbox', path: '/components/checkbox', cat: 'Forms' },
  { name: 'Radio', path: '/components/radio', cat: 'Forms' },
  { name: 'Select', path: '/components/select', cat: 'Forms' },
  { name: 'Toggle', path: '/components/toggle', cat: 'Forms' },
  { name: 'Form', path: '/components/form', cat: 'Forms' },
  { name: 'Stack', path: '/components/stack', cat: 'Layout' },
  { name: 'Grid', path: '/components/grid', cat: 'Layout' },
  { name: 'Container', path: '/components/container', cat: 'Layout' },
  { name: 'Divider', path: '/components/divider', cat: 'Layout' },
  { name: 'Nav', path: '/components/nav', cat: 'Navigation' },
  { name: 'Breadcrumb', path: '/components/breadcrumb', cat: 'Navigation' },
  { name: 'Tabs', path: '/components/tabs', cat: 'Navigation' },
  { name: 'Pagination', path: '/components/pagination', cat: 'Navigation' },
  { name: 'Card', path: '/components/card', cat: 'Data Display' },
  { name: 'Table', path: '/components/table', cat: 'Data Display' },
  { name: 'Badge', path: '/components/badge', cat: 'Data Display' },
  { name: 'Skeleton', path: '/components/skeleton', cat: 'Data Display' },
  { name: 'Alert', path: '/components/alert', cat: 'Feedback' },
  { name: 'Modal', path: '/components/modal', cat: 'Feedback' },
  { name: 'Tooltip', path: '/components/tooltip', cat: 'Feedback' },
  { name: 'Toast', path: '/components/toast', cat: 'Feedback' },
]

export default function HomePage() {
  const navigate = useNavigate()

  return (
    <div>
      <div className="docs-home-hero">
        <h1>Evo UI Docs</h1>
        <p>
          A high-performance React component library. Browse the components below to explore
          usage examples, variants, and prop references.
        </p>
        <EvoStack direction="row" gap="0.75rem">
          <EvoButton label="Browse Components" onClick={() => navigate('/components/button')} />
          <EvoButton label="View on GitHub" variant="outline" severity="secondary" />
        </EvoStack>
      </div>

      <div className="docs-section">
        <div className="docs-section-title">Installation</div>
        <CodeBlock lang="bash" code={`npm install @justin_evo/evo-ui`} />
        <CodeBlock lang="tsx" code={`// Import CSS once in your app entry
import '@justin_evo/evo-ui/dist/evo-ui.css'

// Import components
import { EvoButton, EvoCard, EvoInput } from '@justin_evo/evo-ui'`} />
      </div>

      <div className="docs-section">
        <div className="docs-section-title">
          Components
          <EvoBadge severity="info" variant="subtle">{components.length} total</EvoBadge>
        </div>
        <div className="docs-component-grid">
          {components.map((c) => (
            <div
              key={c.path}
              className="docs-component-card"
              onClick={() => navigate(c.path)}
            >
              <div className="docs-component-card-name">{c.name}</div>
              <div className="docs-component-card-cat">{c.cat}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
