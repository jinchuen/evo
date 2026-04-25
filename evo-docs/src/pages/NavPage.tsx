import { useState } from 'react'
import { EvoNav, EvoDivider } from '@justin_evo/evo-ui'
import { CodeBlock } from '../components/CodeBlock'
import { PropsTable } from '../components/PropsTable'

export default function NavPage() {
  const [active, setActive] = useState('dashboard')

  return (
    <div>
      <div className="docs-page-header">
        <div className="docs-page-tag">Component</div>
        <h1 className="docs-page-title">EvoNav</h1>
        <p className="docs-page-desc">
          A vertical navigation menu with grouped sections, active states, and icon support.
          Renders semantic HTML using nav, ul, and li elements.
        </p>
        <div className="docs-import-line">
          import {'{ '}<span>EvoNav</span>{' }'} from '@justin_evo/evo-ui'
        </div>
      </div>

      <div className="docs-section">
        <div className="docs-section-title">With Groups</div>
        <div className="docs-preview" style={{ alignItems: 'flex-start' }}>
          <div style={{ width: 220, background: 'var(--docs-code-bg)', borderRadius: 8, padding: '0.5rem 0' }}>
            <EvoNav>
              <EvoNav.Group label="Main">
                <EvoNav.Item active={active === 'dashboard'} onClick={() => setActive('dashboard')}>
                  Dashboard
                </EvoNav.Item>
                <EvoNav.Item active={active === 'analytics'} onClick={() => setActive('analytics')}>
                  Analytics
                </EvoNav.Item>
                <EvoNav.Item active={active === 'reports'} onClick={() => setActive('reports')}>
                  Reports
                </EvoNav.Item>
              </EvoNav.Group>
              <EvoNav.Group label="Settings">
                <EvoNav.Item active={active === 'profile'} onClick={() => setActive('profile')}>
                  Profile
                </EvoNav.Item>
                <EvoNav.Item active={active === 'billing'} onClick={() => setActive('billing')}>
                  Billing
                </EvoNav.Item>
                <EvoNav.Item active={active === 'security'} onClick={() => setActive('security')}>
                  Security
                </EvoNav.Item>
              </EvoNav.Group>
            </EvoNav>
          </div>
          <p style={{ fontSize: '0.82rem', color: '#64748b', margin: 0 }}>
            Active: <strong style={{ color: '#e2e8f0' }}>{active}</strong>
          </p>
        </div>
        <CodeBlock code={`const [active, setActive] = useState('dashboard')

<EvoNav>
  <EvoNav.Group label="Main">
    <EvoNav.Item
      active={active === 'dashboard'}
      onClick={() => setActive('dashboard')}
    >
      Dashboard
    </EvoNav.Item>
    <EvoNav.Item
      active={active === 'analytics'}
      onClick={() => setActive('analytics')}
    >
      Analytics
    </EvoNav.Item>
  </EvoNav.Group>
  <EvoNav.Group label="Settings">
    <EvoNav.Item
      active={active === 'profile'}
      onClick={() => setActive('profile')}
    >
      Profile
    </EvoNav.Item>
  </EvoNav.Group>
</EvoNav>`} />
      </div>

      <div className="docs-section">
        <div className="docs-section-title">With Icons</div>
        <div className="docs-preview">
          <div style={{ width: 220, background: 'var(--docs-code-bg)', borderRadius: 8, padding: '0.5rem 0' }}>
            <EvoNav>
              <EvoNav.Item icon={<span>🏠</span>} active>Home</EvoNav.Item>
              <EvoNav.Item icon={<span>📊</span>}>Analytics</EvoNav.Item>
              <EvoNav.Item icon={<span>⚙️</span>}>Settings</EvoNav.Item>
            </EvoNav>
          </div>
        </div>
        <CodeBlock code={`<EvoNav>
  <EvoNav.Item icon={<HomeIcon />} active>Home</EvoNav.Item>
  <EvoNav.Item icon={<ChartIcon />}>Analytics</EvoNav.Item>
  <EvoNav.Item icon={<SettingsIcon />}>Settings</EvoNav.Item>
</EvoNav>`} />
      </div>

      <EvoDivider />

      <div className="docs-section">
        <div className="docs-section-title">Props</div>
        <PropsTable props={[
          { prop: 'EvoNav.Item — children', type: 'ReactNode', required: true, description: 'Item label.' },
          { prop: 'EvoNav.Item — active', type: 'boolean', description: 'Highlights the item as active.' },
          { prop: 'EvoNav.Item — icon', type: 'ReactNode', description: 'Icon rendered before the label.' },
          { prop: 'EvoNav.Item — onClick', type: '() => void', description: 'Click handler.' },
          { prop: 'EvoNav.Group — label', type: 'string', required: true, description: 'Group heading text.' },
          { prop: 'EvoNav.Group — children', type: 'ReactNode', required: true, description: 'EvoNav.Item elements.' },
        ]} />
      </div>
    </div>
  )
}
