import { useState } from 'react'
import { EvoTopNav, EvoButton, EvoBadge, EvoDivider } from '@justin_evo/evo-ui'
import { CodeBlock } from '../components/CodeBlock'
import { PropsTable } from '../components/PropsTable'

export default function TopNavPage() {
  const [active, setActive] = useState('home')

  return (
    <div>
      <div className="docs-page-header">
        <div className="docs-page-tag">Component</div>
        <h1 className="docs-page-title">EvoTopNav</h1>
        <p className="docs-page-desc">
          A horizontal top navigation bar with a brand slot, menu items, and an actions slot.
          Supports active states and icon support — mirrors the EvoNav API in a horizontal layout.
        </p>
        <div className="docs-import-line">
          import {'{ '}<span>EvoTopNav</span>{' }'} from '@justin_evo/evo-ui'
        </div>
      </div>

      <div className="docs-section">
        <div className="docs-section-title">Basic</div>
        <div className="docs-preview col" style={{ width: '100%', padding: 0, overflow: 'hidden', borderRadius: 8 }}>
          <EvoTopNav>
            <EvoTopNav.Brand>Evo UI</EvoTopNav.Brand>
            <EvoTopNav.Menu>
              <EvoTopNav.Item active={active === 'home'} onClick={() => setActive('home')}>Home</EvoTopNav.Item>
              <EvoTopNav.Item active={active === 'docs'} onClick={() => setActive('docs')}>Docs</EvoTopNav.Item>
              <EvoTopNav.Item active={active === 'blog'} onClick={() => setActive('blog')}>Blog</EvoTopNav.Item>
            </EvoTopNav.Menu>
          </EvoTopNav>
        </div>
        <CodeBlock code={`const [active, setActive] = useState('home')

<EvoTopNav>
  <EvoTopNav.Brand>Evo UI</EvoTopNav.Brand>
  <EvoTopNav.Menu>
    <EvoTopNav.Item active={active === 'home'} onClick={() => setActive('home')}>
      Home
    </EvoTopNav.Item>
    <EvoTopNav.Item active={active === 'docs'} onClick={() => setActive('docs')}>
      Docs
    </EvoTopNav.Item>
    <EvoTopNav.Item active={active === 'blog'} onClick={() => setActive('blog')}>
      Blog
    </EvoTopNav.Item>
  </EvoTopNav.Menu>
</EvoTopNav>`} />
      </div>

      <div className="docs-section">
        <div className="docs-section-title">With Actions Slot</div>
        <div className="docs-preview col" style={{ width: '100%', padding: 0, overflow: 'hidden', borderRadius: 8 }}>
          <EvoTopNav>
            <EvoTopNav.Brand>Evo UI</EvoTopNav.Brand>
            <EvoTopNav.Menu>
              <EvoTopNav.Item active>Home</EvoTopNav.Item>
              <EvoTopNav.Item>Components</EvoTopNav.Item>
              <EvoTopNav.Item>Changelog</EvoTopNav.Item>
            </EvoTopNav.Menu>
            <EvoTopNav.Actions>
              <EvoButton label="Sign in" variant="ghost" size="sm" />
              <EvoButton label="Get started" size="sm" />
            </EvoTopNav.Actions>
          </EvoTopNav>
        </div>
        <CodeBlock code={`<EvoTopNav>
  <EvoTopNav.Brand>Evo UI</EvoTopNav.Brand>
  <EvoTopNav.Menu>
    <EvoTopNav.Item active>Home</EvoTopNav.Item>
    <EvoTopNav.Item>Components</EvoTopNav.Item>
    <EvoTopNav.Item>Changelog</EvoTopNav.Item>
  </EvoTopNav.Menu>
  <EvoTopNav.Actions>
    <EvoButton label="Sign in" variant="ghost" size="sm" />
    <EvoButton label="Get started" size="sm" />
  </EvoTopNav.Actions>
</EvoTopNav>`} />
      </div>

      <div className="docs-section">
        <div className="docs-section-title">With Icons</div>
        <div className="docs-preview col" style={{ width: '100%', padding: 0, overflow: 'hidden', borderRadius: 8 }}>
          <EvoTopNav>
            <EvoTopNav.Brand>
              <span style={{ fontSize: '1.25rem', marginRight: '0.375rem' }}>⚡</span>
              Evo UI
            </EvoTopNav.Brand>
            <EvoTopNav.Menu>
              <EvoTopNav.Item icon={<span>🏠</span>} active>Home</EvoTopNav.Item>
              <EvoTopNav.Item icon={<span>📦</span>}>Components</EvoTopNav.Item>
              <EvoTopNav.Item icon={<span>📄</span>}>Docs</EvoTopNav.Item>
            </EvoTopNav.Menu>
            <EvoTopNav.Actions>
              <EvoBadge severity="success">v1.0</EvoBadge>
            </EvoTopNav.Actions>
          </EvoTopNav>
        </div>
        <CodeBlock code={`<EvoTopNav>
  <EvoTopNav.Brand>
    <HomeIcon />
    Evo UI
  </EvoTopNav.Brand>
  <EvoTopNav.Menu>
    <EvoTopNav.Item icon={<HomeIcon />} active>Home</EvoTopNav.Item>
    <EvoTopNav.Item icon={<BoxIcon />}>Components</EvoTopNav.Item>
    <EvoTopNav.Item icon={<FileIcon />}>Docs</EvoTopNav.Item>
  </EvoTopNav.Menu>
  <EvoTopNav.Actions>
    <EvoButton variant="ghost" size="sm">Sign in</EvoButton>
  </EvoTopNav.Actions>
</EvoTopNav>`} />
      </div>

      <EvoDivider />

      <div className="docs-section">
        <div className="docs-section-title">Props</div>
        <PropsTable props={[
          { prop: 'EvoTopNav — children', type: 'ReactNode', required: true, description: 'Accepts Brand, Menu, and Actions sub-components.' },
          { prop: 'EvoTopNav — className', type: 'string', description: 'Extra class applied to the nav element.' },
          { prop: 'EvoTopNav.Brand — children', type: 'ReactNode', required: true, description: 'Logo or brand name displayed on the left.' },
          { prop: 'EvoTopNav.Menu — children', type: 'ReactNode', required: true, description: 'EvoTopNav.Item elements in a horizontal list.' },
          { prop: 'EvoTopNav.Item — children', type: 'ReactNode', required: true, description: 'Item label.' },
          { prop: 'EvoTopNav.Item — active', type: 'boolean', description: 'Highlights the item as the current page.' },
          { prop: 'EvoTopNav.Item — icon', type: 'ReactNode', description: 'Icon rendered before the label.' },
          { prop: 'EvoTopNav.Item — onClick', type: '() => void', description: 'Click handler.' },
          { prop: 'EvoTopNav.Item — className', type: 'string', description: 'Extra class applied to the button.' },
          { prop: 'EvoTopNav.Actions — children', type: 'ReactNode', required: true, description: 'Right-aligned slot for buttons, badges, or avatars.' },
          { prop: 'EvoTopNav.Actions — className', type: 'string', description: 'Extra class applied to the actions container.' },
        ]} />
      </div>
    </div>
  )
}
