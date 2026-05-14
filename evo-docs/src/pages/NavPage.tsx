import { useState } from 'react'
import { EvoNav, EvoDivider, EvoCommandPalette } from '@justin_evo/evo-ui'
import type { CommandPaletteItem } from '@justin_evo/evo-ui'
import { CodeBlock } from '../components/CodeBlock'
import { PropsTable } from '../components/PropsTable'

const commandItems: CommandPaletteItem[] = [
  { label: 'Dashboard', group: 'Navigate', icon: <span>🏠</span>, onSelect: () => {} },
  { label: 'Analytics', group: 'Navigate', icon: <span>📊</span>, onSelect: () => {} },
  { label: 'Users', group: 'Navigate', icon: <span>👥</span>, onSelect: () => {} },
  { label: 'Settings', group: 'Navigate', icon: <span>⚙️</span>, onSelect: () => {} },
  { label: 'Create User', group: 'Actions', icon: <span>➕</span>, description: 'Add a new team member', onSelect: () => {} },
  { label: 'Export CSV', group: 'Actions', icon: <span>📄</span>, description: 'Download data as CSV', onSelect: () => {} },
  { label: 'Toggle Theme', group: 'Preferences', icon: <span>🌙</span>, onSelect: () => {} },
]

export default function NavPage() {
  const [active, setActive] = useState('dashboard')
  const [paletteOpen, setPaletteOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  return (
    <div>
      <EvoCommandPalette items={commandItems} />

      <div className="docs-page-header">
        <div className="docs-page-tag">Component</div>
        <h1 className="docs-page-title">EvoNav</h1>
        <p className="docs-page-desc">
          A vertical navigation menu with multi-level nesting, active state indicators,
          skeleton loading, quick action, and a cross-platform command palette (
          <kbd style={{ background: 'var(--docs-code-bg)', padding: '0.1rem 0.4rem', borderRadius: 4, fontSize: '0.8rem' }}>Ctrl+K</kbd>
          {' / '}
          <kbd style={{ background: 'var(--docs-code-bg)', padding: '0.1rem 0.4rem', borderRadius: 4, fontSize: '0.8rem' }}>⌘K</kbd>
          ).
        </p>
        <div className="docs-import-line">
          import {'{ '}<span>EvoNav, EvoCommandPalette</span>{' }'} from '@justin_evo/evo-ui'
        </div>
      </div>

      {/* ── Grouped navigation ── */}
      <div className="docs-section">
        <div className="docs-section-title">Grouped Navigation</div>
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
              </EvoNav.Group>
              <EvoNav.Group label="Settings">
                <EvoNav.Item active={active === 'profile'} onClick={() => setActive('profile')}>
                  Profile
                </EvoNav.Item>
                <EvoNav.Item active={active === 'billing'} onClick={() => setActive('billing')}>
                  Billing
                </EvoNav.Item>
              </EvoNav.Group>
            </EvoNav>
          </div>
          <p className="docs-readout">
            Active: <strong>{active}</strong>
          </p>
        </div>
        <CodeBlock code={`<EvoNav>
  <EvoNav.Group label="Main">
    <EvoNav.Item active={active === 'dashboard'} onClick={() => setActive('dashboard')}>
      Dashboard
    </EvoNav.Item>
  </EvoNav.Group>
</EvoNav>`} />
      </div>

      {/* ── Nested / multi-level ── */}
      <div className="docs-section">
        <div className="docs-section-title">Nested Multi-level Menu</div>
        <p className="docs-section-desc">
          Pass an <code>items</code> array to any <code>EvoNav.Item</code> to create collapsible sub-menus.
          Nesting is recursive — sub-items can have their own <code>items</code>.
        </p>
        <div className="docs-preview" style={{ alignItems: 'flex-start' }}>
          <div style={{ width: 240, background: 'var(--docs-code-bg)', borderRadius: 8, padding: '0.5rem 0' }}>
            <EvoNav>
              <EvoNav.Item
                icon={<span>🏠</span>}
                active={active === 'home'}
                onClick={() => setActive('home')}
              >
                Home
              </EvoNav.Item>
              <EvoNav.Item
                icon={<span>👥</span>}
                active={active === 'users'}
                onClick={() => setActive('users')}
                items={[
                  {
                    label: 'All Users',
                    active: active === 'all-users',
                    onClick: () => setActive('all-users'),
                  },
                  {
                    label: 'Roles',
                    active: active === 'roles',
                    onClick: () => setActive('roles'),
                    items: [
                      { label: 'Admin', active: active === 'admin', onClick: () => setActive('admin') },
                      { label: 'Editor', active: active === 'editor', onClick: () => setActive('editor') },
                    ],
                  },
                  {
                    label: 'Invites',
                    active: active === 'invites',
                    onClick: () => setActive('invites'),
                  },
                ]}
              >
                Users
              </EvoNav.Item>
              <EvoNav.Item
                icon={<span>⚙️</span>}
                active={active === 'settings'}
                onClick={() => setActive('settings')}
                items={[
                  { label: 'General', active: active === 'general', onClick: () => setActive('general') },
                  { label: 'Security', active: active === 'security', onClick: () => setActive('security') },
                  { label: 'Billing', active: active === 'billing-s', onClick: () => setActive('billing-s') },
                ]}
              >
                Settings
              </EvoNav.Item>
            </EvoNav>
          </div>
          <p className="docs-readout">
            Active: <strong>{active}</strong>
          </p>
        </div>
        <CodeBlock code={`<EvoNav.Item
  icon={<UsersIcon />}
  items={[
    { label: 'All Users', onClick: () => setActive('all-users') },
    {
      label: 'Roles',
      items: [
        { label: 'Admin', onClick: () => setActive('admin') },
        { label: 'Editor', onClick: () => setActive('editor') },
      ],
    },
  ]}
>
  Users
</EvoNav.Item>`} />
      </div>

      {/* ── Quick Action Button ── */}
      <div className="docs-section">
        <div className="docs-section-title">Quick Action Button</div>
        <p className="docs-section-desc">
          <code>EvoNav.QuickAction</code> renders a persistent "Create New" button that stays
          visible in the sidebar so users can add data from any page.
        </p>
        <div className="docs-preview" style={{ alignItems: 'flex-start' }}>
          <div style={{ width: 220, background: 'var(--docs-code-bg)', borderRadius: 8, padding: '0.5rem 0' }}>
            <EvoNav>
              <EvoNav.QuickAction label="Create New" onClick={() => alert('Create New clicked')} />
              <EvoNav.Group label="Main">
                <EvoNav.Item active>Dashboard</EvoNav.Item>
                <EvoNav.Item>Analytics</EvoNav.Item>
              </EvoNav.Group>
            </EvoNav>
          </div>
        </div>
        <CodeBlock code={`<EvoNav>
  <EvoNav.QuickAction label="Create New" onClick={openCreateModal} />
  <EvoNav.Group label="Main">
    <EvoNav.Item active>Dashboard</EvoNav.Item>
  </EvoNav.Group>
</EvoNav>`} />
      </div>

      {/* ── Skeleton Loading ── */}
      <div className="docs-section">
        <div className="docs-section-title">Skeleton Loading</div>
        <p className="docs-section-desc">
          Show <code>EvoNav.Skeleton</code> while user/route data is loading. The <code>count</code> prop
          controls how many placeholder rows appear.
        </p>
        <div className="docs-preview" style={{ alignItems: 'flex-start', gap: '1.5rem' }}>
          <div style={{ width: 220, background: 'var(--docs-code-bg)', borderRadius: 8, padding: '0.5rem 0' }}>
            <EvoNav>
              <EvoNav.Skeleton count={5} />
            </EvoNav>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <button
              onClick={() => { setLoading(true); setTimeout(() => setLoading(false), 2000); }}
              style={{
                padding: '0.375rem 0.875rem',
                background: 'color-mix(in srgb, var(--docs-accent) 12%, transparent)',
                border: '1px solid color-mix(in srgb, var(--docs-accent) 30%, transparent)',
                borderRadius: 6,
                color: 'var(--docs-accent)',
                cursor: 'pointer',
                fontSize: '0.82rem',
                fontWeight: 500,
              }}
            >
              Simulate load (2s)
            </button>
            <div style={{ width: 220, background: 'var(--docs-code-bg)', borderRadius: 8, padding: '0.5rem 0' }}>
              <EvoNav>
                {loading ? (
                  <EvoNav.Skeleton count={4} />
                ) : (
                  <EvoNav.Group label="Main">
                    <EvoNav.Item active>Dashboard</EvoNav.Item>
                    <EvoNav.Item>Analytics</EvoNav.Item>
                    <EvoNav.Item>Reports</EvoNav.Item>
                    <EvoNav.Item>Settings</EvoNav.Item>
                  </EvoNav.Group>
                )}
              </EvoNav>
            </div>
          </div>
        </div>
        <CodeBlock code={`const { data, isLoading } = useNavItems()

<EvoNav>
  {isLoading ? (
    <EvoNav.Skeleton count={5} />
  ) : (
    <EvoNav.Group label="Main">
      {data.map(item => <EvoNav.Item key={item.id}>{item.label}</EvoNav.Item>)}
    </EvoNav.Group>
  )}
</EvoNav>`} />
      </div>

      {/* ── Command Palette ── */}
      <div className="docs-section">
        <div className="docs-section-title">Command Palette</div>
        <p className="docs-section-desc">
          <code>EvoCommandPalette</code> opens a global search overlay.{' '}
          It listens to <strong>Ctrl+K</strong> on Windows/Linux and <strong>⌘K</strong> on macOS automatically.
          Items are grouped, filterable, and navigable by keyboard.
        </p>
        <div className="docs-preview">
          <button
            onClick={() => setPaletteOpen(true)}
            style={{
              padding: '0.5rem 1rem',
              background: 'var(--docs-code-bg)',
              border: '1px solid var(--docs-border)',
              borderRadius: 8,
              color: 'var(--docs-text-muted)',
              cursor: 'pointer',
              fontSize: '0.875rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
            }}
          >
            <span>🔍</span>
            <span>Search commands…</span>
            <span style={{
              display: 'flex', gap: '0.25rem', marginLeft: 'auto',
            }}>
              <kbd style={{ background: 'var(--docs-card-hover)', border: '1px solid var(--docs-border)', borderRadius: 4, padding: '0.1rem 0.375rem', fontSize: '0.75rem' }}>
                ⌘/Ctrl
              </kbd>
              <kbd style={{ background: 'var(--docs-card-hover)', border: '1px solid var(--docs-border)', borderRadius: 4, padding: '0.1rem 0.375rem', fontSize: '0.75rem' }}>
                K
              </kbd>
            </span>
          </button>
          <EvoCommandPalette
            items={commandItems}
            open={paletteOpen}
            onClose={() => setPaletteOpen(false)}
          />
        </div>
        <CodeBlock code={`import { EvoCommandPalette } from '@justin_evo/evo-ui'
import type { CommandPaletteItem } from '@justin_evo/evo-ui'

const items: CommandPaletteItem[] = [
  { label: 'Dashboard',   group: 'Navigate', icon: <HomeIcon />,   onSelect: () => navigate('/') },
  { label: 'Analytics',   group: 'Navigate', icon: <ChartIcon />,  onSelect: () => navigate('/analytics') },
  { label: 'Create User', group: 'Actions',  icon: <PlusIcon />,   description: 'Add a new member', onSelect: openModal },
]

// Self-contained — Ctrl+K / ⌘K wires up automatically
<EvoCommandPalette items={items} />

// Or controlled externally
<EvoCommandPalette items={items} open={open} onClose={() => setOpen(false)} />`} />
      </div>

      {/* ── With Icons ── */}
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

      {/* ── Props ── */}
      <div className="docs-section">
        <div className="docs-section-title">EvoNav Props</div>
        <PropsTable props={[
          { prop: 'EvoNav.Item — children', type: 'ReactNode', required: true, description: 'Item label.' },
          { prop: 'EvoNav.Item — active', type: 'boolean', description: 'Highlights item with accent indicator.' },
          { prop: 'EvoNav.Item — icon', type: 'ReactNode', description: 'Icon rendered before the label.' },
          { prop: 'EvoNav.Item — onClick', type: '() => void', description: 'Click handler. Also toggles sub-menu when items is set.' },
          { prop: 'EvoNav.Item — items', type: 'NavSubItem[]', description: 'Sub-items for nested collapse/expand menus.' },
          { prop: 'EvoNav.Group — label', type: 'string', required: true, description: 'Group heading text.' },
          { prop: 'EvoNav.Group — children', type: 'ReactNode', required: true, description: 'EvoNav.Item elements.' },
          { prop: 'EvoNav.Skeleton — count', type: 'number', description: 'Number of skeleton rows (default 4).' },
          { prop: 'EvoNav.QuickAction — label', type: 'string', description: 'Button text (default "Create New").' },
          { prop: 'EvoNav.QuickAction — onClick', type: '() => void', description: 'Click handler.' },
        ]} />
      </div>

      <div className="docs-section">
        <div className="docs-section-title">EvoCommandPalette Props</div>
        <PropsTable props={[
          { prop: 'items', type: 'CommandPaletteItem[]', required: true, description: 'List of searchable commands.' },
          { prop: 'placeholder', type: 'string', description: 'Input placeholder text.' },
          { prop: 'open', type: 'boolean', description: 'Controlled open state. Omit for self-contained Ctrl+K / ⌘K behavior.' },
          { prop: 'onClose', type: '() => void', description: 'Called when the palette closes.' },
        ]} />
        <div style={{ marginTop: '1rem' }}>
          <div className="docs-section-title" style={{ fontSize: '0.85rem' }}>CommandPaletteItem</div>
          <PropsTable props={[
            { prop: 'label', type: 'string', required: true, description: 'Display name, used for search filtering.' },
            { prop: 'group', type: 'string', description: 'Group heading. Items without a group fall under "Actions".' },
            { prop: 'icon', type: 'ReactNode', description: 'Icon shown beside the label.' },
            { prop: 'description', type: 'string', description: 'Secondary text shown to the right.' },
            { prop: 'shortcut', type: 'string[]', description: 'Key badges rendered on the right (e.g. ["⌘", "D"]).' },
            { prop: 'onSelect', type: '() => void', required: true, description: 'Called when the item is activated.' },
          ]} />
        </div>
      </div>
    </div>
  )
}
