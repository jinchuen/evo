import { EvoTabs, EvoDivider } from '@justin_evo/evo-ui'
import { CodeBlock } from '../components/CodeBlock'
import { PropsTable } from '../components/PropsTable'

export default function TabsPage() {
  return (
    <div>
      <div className="docs-page-header">
        <div className="docs-page-tag">Component</div>
        <h1 className="docs-page-title">EvoTabs</h1>
        <p className="docs-page-desc">
          A composable tabs component. Uses context-based state. Tab panels are matched to
          tabs by id. Semantic HTML with ARIA roles.
        </p>
        <div className="docs-import-line">
          import {'{ '}<span>EvoTabs</span>{' }'} from '@justin_evo/evo-ui'
        </div>
      </div>

      <div className="docs-section">
        <div className="docs-section-title">Basic</div>
        <div className="docs-preview col" style={{ width: '100%' }}>
          <EvoTabs defaultTab="overview">
            <EvoTabs.List>
              <EvoTabs.Tab id="overview">Overview</EvoTabs.Tab>
              <EvoTabs.Tab id="usage">Usage</EvoTabs.Tab>
              <EvoTabs.Tab id="api">API</EvoTabs.Tab>
            </EvoTabs.List>
            <EvoTabs.Panel id="overview">
              <p style={{ color: 'var(--docs-text-muted)', margin: '1rem 0 0' }}>
                This is the overview panel. Use tabs to organize related content into sections.
              </p>
            </EvoTabs.Panel>
            <EvoTabs.Panel id="usage">
              <CodeBlock code={`import { EvoTabs } from '@justin_evo/evo-ui'

<EvoTabs defaultTab="tab1">
  <EvoTabs.List>
    <EvoTabs.Tab id="tab1">Tab 1</EvoTabs.Tab>
    <EvoTabs.Tab id="tab2">Tab 2</EvoTabs.Tab>
  </EvoTabs.List>
  <EvoTabs.Panel id="tab1">Content 1</EvoTabs.Panel>
  <EvoTabs.Panel id="tab2">Content 2</EvoTabs.Panel>
</EvoTabs>`} />
            </EvoTabs.Panel>
            <EvoTabs.Panel id="api">
              <p style={{ color: 'var(--docs-text-muted)', margin: '1rem 0 0' }}>
                See the props table below for a full API reference.
              </p>
            </EvoTabs.Panel>
          </EvoTabs>
        </div>
        <CodeBlock code={`<EvoTabs defaultTab="overview">
  <EvoTabs.List>
    <EvoTabs.Tab id="overview">Overview</EvoTabs.Tab>
    <EvoTabs.Tab id="usage">Usage</EvoTabs.Tab>
    <EvoTabs.Tab id="api">API</EvoTabs.Tab>
  </EvoTabs.List>
  <EvoTabs.Panel id="overview">...</EvoTabs.Panel>
  <EvoTabs.Panel id="usage">...</EvoTabs.Panel>
  <EvoTabs.Panel id="api">...</EvoTabs.Panel>
</EvoTabs>`} />
      </div>

      <div className="docs-section">
        <div className="docs-section-title">With Disabled Tab</div>
        <div className="docs-preview col" style={{ width: '100%' }}>
          <EvoTabs defaultTab="a">
            <EvoTabs.List>
              <EvoTabs.Tab id="a">Available</EvoTabs.Tab>
              <EvoTabs.Tab id="b">Also Available</EvoTabs.Tab>
              <EvoTabs.Tab id="c" disabled>Coming Soon</EvoTabs.Tab>
            </EvoTabs.List>
            <EvoTabs.Panel id="a">
              <p style={{ color: 'var(--docs-text-muted)', marginTop: '1rem' }}>Panel A content.</p>
            </EvoTabs.Panel>
            <EvoTabs.Panel id="b">
              <p style={{ color: 'var(--docs-text-muted)', marginTop: '1rem' }}>Panel B content.</p>
            </EvoTabs.Panel>
            <EvoTabs.Panel id="c">
              <p style={{ color: 'var(--docs-text-muted)', marginTop: '1rem' }}>Panel C content.</p>
            </EvoTabs.Panel>
          </EvoTabs>
        </div>
        <CodeBlock code={`<EvoTabs.Tab id="c" disabled>Coming Soon</EvoTabs.Tab>`} />
      </div>

      <EvoDivider />

      <div className="docs-section">
        <div className="docs-section-title">Props</div>
        <PropsTable props={[
          { prop: 'EvoTabs — defaultTab', type: 'string', description: 'ID of the initially active tab.' },
          { prop: 'EvoTabs.Tab — id', type: 'string', required: true, description: 'Unique tab identifier. Must match its EvoTabs.Panel id.' },
          { prop: 'EvoTabs.Tab — children', type: 'ReactNode', required: true, description: 'Tab label content.' },
          { prop: 'EvoTabs.Tab — disabled', type: 'boolean', description: 'Disables the tab.' },
          { prop: 'EvoTabs.Panel — id', type: 'string', required: true, description: 'Must match the corresponding EvoTabs.Tab id.' },
          { prop: 'EvoTabs.Panel — children', type: 'ReactNode', required: true, description: 'Panel content shown when its tab is active.' },
        ]} />
      </div>
    </div>
  )
}
