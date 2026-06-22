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
  const [railCollapsed, setRailCollapsed] = useState(false)

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

      {/* ── Collapsible groups & icon rail ── */}
      <div className="docs-section">
        <div className="docs-section-title">Collapsible Groups & Icon Rail</div>
        <p className="docs-section-desc">
          Add <code>collapsible</code> to a <code>EvoNav.Group</code> to turn its heading
          into an animated accordion (with an optional <code>count</code> chip). Set{' '}
          <code>collapsed</code> on <code>EvoNav</code> to shrink the whole nav to an
          icon-only rail — labels hide and each row shows a native tooltip from its{' '}
          <code>tooltip</code> prop.
        </p>
        <div className="docs-preview" style={{ alignItems: 'flex-start', gap: '1.5rem' }}>
          <div style={{ width: railCollapsed ? 64 : 220, background: 'var(--docs-code-bg)', borderRadius: 8, padding: '0.5rem 0', transition: 'width 240ms ease' }}>
            <EvoNav collapsed={railCollapsed}>
              <EvoNav.Group label="Main" count={2} collapsible defaultOpen>
                <EvoNav.Item icon={<span>🏠</span>} tooltip="Dashboard" active={active === 'dashboard'} onClick={() => setActive('dashboard')}>Dashboard</EvoNav.Item>
                <EvoNav.Item icon={<span>📊</span>} tooltip="Analytics" active={active === 'analytics'} onClick={() => setActive('analytics')}>Analytics</EvoNav.Item>
              </EvoNav.Group>
              <EvoNav.Group label="Settings" count={2} collapsible defaultOpen>
                <EvoNav.Item icon={<span>👤</span>} tooltip="Profile" active={active === 'profile'} onClick={() => setActive('profile')}>Profile</EvoNav.Item>
                <EvoNav.Item icon={<span>💳</span>} tooltip="Billing" active={active === 'billing'} onClick={() => setActive('billing')}>Billing</EvoNav.Item>
              </EvoNav.Group>
            </EvoNav>
          </div>
          <button
            onClick={() => setRailCollapsed((v) => !v)}
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
            {railCollapsed ? 'Expand' : 'Collapse'} rail
          </button>
        </div>
        <CodeBlock code={`<EvoNav collapsed={collapsed}>
  <EvoNav.Group label="Main" count={2} collapsible defaultOpen>
    <EvoNav.Item icon={<HomeIcon />} tooltip="Dashboard" active>Dashboard</EvoNav.Item>
    <EvoNav.Item icon={<ChartIcon />} tooltip="Analytics">Analytics</EvoNav.Item>
  </EvoNav.Group>
</EvoNav>`} />
      </div>

      {/* ── Nested / multi-level ── */}
      <div className="docs-section">
        <div className="docs-section-title">Nested Multi-level Menu</div>
        <p className="docs-section-desc">
          Nest <code>EvoNav.SubItem</code> elements inside an <code>EvoNav.Item</code> to create
          collapsible sub-menus. Nesting is recursive — a <code>SubItem</code> can contain more
          <code>SubItem</code>s. Use <code>defaultOpen</code> (uncontrolled) or
          <code>open</code> + <code>onOpenChange</code> (controlled) to drive the disclosure state.
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
              <EvoNav.Item icon={<span>👥</span>} defaultOpen>
                Users
                <EvoNav.SubItem
                  active={active === 'all-users'}
                  onClick={() => setActive('all-users')}
                >
                  All Users
                </EvoNav.SubItem>
                <EvoNav.SubItem
                  active={active === 'roles'}
                  onClick={() => setActive('roles')}
                >
                  Roles
                  <EvoNav.SubItem
                    active={active === 'admin'}
                    onClick={() => setActive('admin')}
                  >
                    Admin
                  </EvoNav.SubItem>
                  <EvoNav.SubItem
                    active={active === 'editor'}
                    onClick={() => setActive('editor')}
                  >
                    Editor
                  </EvoNav.SubItem>
                </EvoNav.SubItem>
                <EvoNav.SubItem
                  active={active === 'invites'}
                  onClick={() => setActive('invites')}
                >
                  Invites
                </EvoNav.SubItem>
              </EvoNav.Item>
              <EvoNav.Item icon={<span>⚙️</span>}>
                Settings
                <EvoNav.SubItem active={active === 'general'} onClick={() => setActive('general')}>
                  General
                </EvoNav.SubItem>
                <EvoNav.SubItem active={active === 'security'} onClick={() => setActive('security')}>
                  Security
                </EvoNav.SubItem>
                <EvoNav.SubItem active={active === 'billing-s'} onClick={() => setActive('billing-s')}>
                  Billing
                </EvoNav.SubItem>
              </EvoNav.Item>
            </EvoNav>
          </div>
          <p className="docs-readout">
            Active: <strong>{active}</strong>
          </p>
        </div>
        <CodeBlock code={`<EvoNav.Item icon={<UsersIcon />} defaultOpen>
  Users
  <EvoNav.SubItem onClick={() => setActive('all-users')}>All Users</EvoNav.SubItem>
  <EvoNav.SubItem>
    Roles
    <EvoNav.SubItem onClick={() => setActive('admin')}>Admin</EvoNav.SubItem>
    <EvoNav.SubItem onClick={() => setActive('editor')}>Editor</EvoNav.SubItem>
  </EvoNav.SubItem>
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
        <p className="docs-section-desc">
          Pass any node to <code>icon</code>. Icons inherit the row's colour, so they
          shift across the idle → hover → active states automatically — the active row
          uses a soft tinted pill, no extra markup required.
        </p>
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

      {/* ── Keyboard / a11y ── */}
      <div className="docs-section">
        <div className="docs-section-title">Keyboard & Accessibility</div>
        <p className="docs-section-desc">
          The nav landmark is a <code>&lt;nav role="navigation"&gt;</code> with an{' '}
          <code>aria-label</code>. The active item gets <code>aria-current="page"</code>;
          expandable rows get <code>aria-expanded</code> + <code>aria-controls</code> pointing
          at their nested <code>&lt;ul role="group"&gt;</code>.
        </p>
        <ul className="docs-list">
          <li><strong>↑ / ↓</strong> — move focus to the previous / next focusable row (walks into open subtrees, skips disabled).</li>
          <li><strong>→</strong> — on an expandable row, opens it; if already open, focuses the first child.</li>
          <li><strong>←</strong> — on an open expandable row, collapses it; otherwise focuses the parent row.</li>
          <li><strong>Home / End</strong> — first / last row.</li>
          <li><strong>Enter / Space</strong> — invokes <code>onClick</code> and toggles disclosure on expandable rows.</li>
        </ul>
      </div>

      {/* ── Responsive drawer ── */}
      <div className="docs-section">
        <div className="docs-section-title">Responsive Drawer</div>
        <p className="docs-section-desc">
          Below <code>breakpoint</code> (default 768&nbsp;px), the nav collapses to an off-canvas
          drawer with a built-in hamburger trigger; at or above, it renders inline as a sidebar.
          Drawer state can be controlled with <code>drawerOpen</code> +{' '}
          <code>onDrawerOpenChange</code>, or seeded with <code>defaultDrawerOpen</code>.
          Use <code>hideTrigger</code> if you want to render the trigger somewhere else
          (e.g. inside an <code>EvoTopNav</code>).
        </p>
        <CodeBlock code={`// Default — built-in hamburger below 768px
<EvoNav>
  <EvoNav.Group label="Main">
    <EvoNav.Item active href="/">Dashboard</EvoNav.Item>
  </EvoNav.Group>
</EvoNav>

// Controlled drawer state, trigger lives elsewhere
const [open, setOpen] = useState(false)
<>
  <EvoButton onClick={() => setOpen(true)}>Menu</EvoButton>
  <EvoNav
    hideTrigger
    drawerOpen={open}
    onDrawerOpenChange={setOpen}
  >
    {/* … */}
  </EvoNav>
</>`} />
      </div>

      <EvoDivider />

      {/* ── Props ── */}
      <div className="docs-section">
        <div className="docs-section-title">EvoNav Props</div>
        <PropsTable props={[
          { prop: 'EvoNav — children', type: 'ReactNode', required: true, description: 'EvoNav.Group, EvoNav.Item, EvoNav.QuickAction, or EvoNav.Skeleton elements.' },
          { prop: 'EvoNav — breakpoint', type: 'number', description: 'Viewport width (px) below which the nav becomes a drawer. Default 768.' },
          { prop: 'EvoNav — drawerOpen', type: 'boolean', description: 'Controlled drawer open state (mobile only).' },
          { prop: 'EvoNav — defaultDrawerOpen', type: 'boolean', description: 'Uncontrolled initial drawer state. Default false.' },
          { prop: 'EvoNav — onDrawerOpenChange', type: '(open: boolean) => void', description: 'Called when the drawer opens or closes.' },
          { prop: 'EvoNav — hideTrigger', type: 'boolean', description: 'Hide the built-in hamburger trigger. Pair with drawerOpen / onDrawerOpenChange.' },
          { prop: 'EvoNav — collapsed', type: 'boolean', description: 'Collapse to an icon-only rail: labels hide, icons center, and each row shows a native tooltip from its tooltip prop. Default false.' },
          { prop: 'EvoNav — aria-label', type: 'string', description: 'Accessible label for the <nav> landmark. Default "Main navigation".' },

          { prop: 'EvoNav.Group — label', type: 'string', required: true, description: 'Group heading text. Linked to the nested list via aria-labelledby.' },
          { prop: 'EvoNav.Group — children', type: 'ReactNode', required: true, description: 'EvoNav.Item elements.' },
          { prop: 'EvoNav.Group — collapsible', type: 'boolean', description: 'Render the heading as a disclosure that expands/collapses the group (animated). Default false.' },
          { prop: 'EvoNav.Group — defaultOpen', type: 'boolean', description: 'Uncontrolled initial open state (collapsible only). Default true.' },
          { prop: 'EvoNav.Group — open', type: 'boolean', description: 'Controlled open state (collapsible only).' },
          { prop: 'EvoNav.Group — onOpenChange', type: '(open: boolean) => void', description: 'Called when the group expands or collapses.' },
          { prop: 'EvoNav.Group — count', type: 'number', description: 'Small count chip shown after the label.' },

          { prop: 'EvoNav.Item — children', type: 'ReactNode', required: true, description: 'Row label. Nested EvoNav.SubItem children turn the row into a disclosure.' },
          { prop: 'EvoNav.Item — active', type: 'boolean', description: 'Marks this row as the current page. Sets aria-current="page" and applies the active visual state.' },
          { prop: 'EvoNav.Item — icon', type: 'ReactNode', description: 'Icon rendered before the label.' },
          { prop: 'EvoNav.Item — tooltip', type: 'string', description: 'Tooltip text shown (native title) when the nav is collapsed to a rail.' },
          { prop: 'EvoNav.Item — href', type: 'string', description: 'When set, renders as <a href> instead of <button>.' },
          { prop: 'EvoNav.Item — onClick', type: '(e) => void', description: 'Click / keyboard activate handler (Enter, Space, click).' },
          { prop: 'EvoNav.Item — open', type: 'boolean', description: 'Controlled expand state (only meaningful with SubItem children).' },
          { prop: 'EvoNav.Item — defaultOpen', type: 'boolean', description: 'Uncontrolled initial expand state.' },
          { prop: 'EvoNav.Item — onOpenChange', type: '(open: boolean) => void', description: 'Called when expand state changes.' },
          { prop: 'EvoNav.Item — disabled', type: 'boolean', description: 'Disables the row (no click, no keyboard activation).' },

          { prop: 'EvoNav.SubItem — *', type: '(same as EvoNav.Item)', description: 'Nested row with the same prop shape. Can contain more SubItems for deeper trees.' },

          { prop: 'EvoNav.Skeleton — count', type: 'number', description: 'Number of skeleton rows. Default 4.' },

          { prop: 'EvoNav.QuickAction — label', type: 'string', description: 'Button text. Default "Create New".' },
          { prop: 'EvoNav.QuickAction — icon', type: 'ReactNode', description: 'Custom icon. Defaults to a plus glyph.' },
          { prop: 'EvoNav.QuickAction — ...rest', type: 'ButtonHTMLAttributes', description: 'Every native <button> attribute (onClick, form, name, autoFocus, aria-*, …) passes through.' },
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
