import { useState } from 'react'
import { EvoTopNav, EvoButton, EvoBadge, EvoDivider } from '@justin_evo/evo-ui'
import { CodeBlock } from '../components/CodeBlock'
import { PropsTable } from '../components/PropsTable'

export default function TopNavPage() {
  const [active, setActive] = useState('home')
  const [controlledOpen, setControlledOpen] = useState(false)

  return (
    <div>
      <div className="docs-page-header">
        <div className="docs-page-tag">Component</div>
        <h1 className="docs-page-title">EvoTopNav</h1>
        <p className="docs-page-desc">
          A compose-based top navigation bar. Renders horizontally on desktop and
          collapses into a drawer below the <code>collapseBelow</code> breakpoint.
          Polymorphic items (link / button / asChild), hover- or click-driven
          dropdowns, full keyboard support, and an opt-in mobile drawer with focus
          trap + body scroll lock.
        </p>
        <div className="docs-import-line">
          import {'{ '}<span>EvoTopNav</span>{' }'} from '@justin_evo/evo-ui'
        </div>
      </div>

      {/* --- Basic --- */}
      <div className="docs-section">
        <div className="docs-section-title">Basic</div>
        <p className="docs-section-desc">
          Compose <code>.Brand</code>, <code>.Menu</code>, <code>.Item</code>, and{' '}
          <code>.Actions</code>. <code>active</code> automatically sets{' '}
          <code>aria-current="page"</code>, so screen readers and CSS{' '}
          <code>[aria-current]</code> selectors both work.
        </p>
        <div className="docs-preview col" style={{ width: '100%', padding: 0, overflow: 'hidden', borderRadius: 8 }}>
          <EvoTopNav aria-label="Primary">
            <EvoTopNav.Brand>Evo UI</EvoTopNav.Brand>
            <EvoTopNav.Menu>
              <EvoTopNav.Item active={active === 'home'} onClick={() => setActive('home')}>Home</EvoTopNav.Item>
              <EvoTopNav.Item active={active === 'docs'} onClick={() => setActive('docs')}>Docs</EvoTopNav.Item>
              <EvoTopNav.Item active={active === 'blog'} onClick={() => setActive('blog')}>Blog</EvoTopNav.Item>
            </EvoTopNav.Menu>
          </EvoTopNav>
        </div>
        <CodeBlock code={`<EvoTopNav aria-label="Primary">
  <EvoTopNav.Brand>Evo UI</EvoTopNav.Brand>
  <EvoTopNav.Menu>
    <EvoTopNav.Item active onClick={...}>Home</EvoTopNav.Item>
    <EvoTopNav.Item onClick={...}>Docs</EvoTopNav.Item>
    <EvoTopNav.Item onClick={...}>Blog</EvoTopNav.Item>
  </EvoTopNav.Menu>
</EvoTopNav>`} />
      </div>

      {/* --- Polymorphic Item --- */}
      <div className="docs-section">
        <div className="docs-section-title">Polymorphic Item</div>
        <p className="docs-section-desc">
          An <code>EvoTopNav.Item</code> picks its element by props:
        </p>
        <ul className="docs-list">
          <li><code>href</code> → renders an <code>&lt;a&gt;</code>.</li>
          <li><code>onClick</code> alone → renders a <code>&lt;button type="button"&gt;</code>.</li>
          <li><code>asChild</code> → clones the single child (use this for router <code>&lt;Link&gt;</code>).</li>
        </ul>
        <div className="docs-preview col" style={{ width: '100%', padding: 0, overflow: 'hidden', borderRadius: 8 }}>
          <EvoTopNav aria-label="Polymorphic example">
            <EvoTopNav.Brand>Evo UI</EvoTopNav.Brand>
            <EvoTopNav.Menu>
              <EvoTopNav.Item href="#home" active>Home (link)</EvoTopNav.Item>
              <EvoTopNav.Item onClick={() => alert('button')}>Action (button)</EvoTopNav.Item>
              <EvoTopNav.Item href="https://example.com" target="_blank">External</EvoTopNav.Item>
            </EvoTopNav.Menu>
          </EvoTopNav>
        </div>
        <CodeBlock code={`// 1. As <a>
<EvoTopNav.Item href="/docs">Docs</EvoTopNav.Item>

// 2. As <button> (no href)
<EvoTopNav.Item onClick={signOut}>Sign out</EvoTopNav.Item>

// 3. As a router Link (clones the child via asChild)
<EvoTopNav.Item asChild active={pathname === '/docs'}>
  <Link to="/docs">Docs</Link>
</EvoTopNav.Item>`} />
      </div>

      {/* --- Dropdown --- */}
      <div className="docs-section">
        <div className="docs-section-title">Dropdown</div>
        <p className="docs-section-desc">
          <code>EvoTopNav.Dropdown</code> renders a trigger plus a floating panel
          of <code>EvoTopNav.DropdownItem</code>s. Opens on hover (fine-pointer
          devices only) and on click; <kbd>↓</kbd>/<kbd>↑</kbd> cycle items,{' '}
          <kbd>Esc</kbd> closes and returns focus to the trigger.
        </p>
        <div className="docs-preview col" style={{ width: '100%', padding: 0, overflow: 'visible', borderRadius: 8 }}>
          <EvoTopNav aria-label="Dropdown example">
            <EvoTopNav.Brand>Evo UI</EvoTopNav.Brand>
            <EvoTopNav.Menu>
              <EvoTopNav.Item href="#home">Home</EvoTopNav.Item>
              <EvoTopNav.Dropdown label="Products">
                <EvoTopNav.DropdownItem href="#analytics">Analytics</EvoTopNav.DropdownItem>
                <EvoTopNav.DropdownItem href="#search">Search</EvoTopNav.DropdownItem>
                <EvoTopNav.DropdownItem href="#auth">Auth</EvoTopNav.DropdownItem>
              </EvoTopNav.Dropdown>
              <EvoTopNav.Item href="#pricing">Pricing</EvoTopNav.Item>
            </EvoTopNav.Menu>
            <EvoTopNav.Actions>
              <EvoButton label="Sign in" variant="ghost" size="sm" />
            </EvoTopNav.Actions>
          </EvoTopNav>
        </div>
        <CodeBlock code={`<EvoTopNav.Menu>
  <EvoTopNav.Dropdown label="Products" hoverable>
    <EvoTopNav.DropdownItem href="/analytics">Analytics</EvoTopNav.DropdownItem>
    <EvoTopNav.DropdownItem href="/search">Search</EvoTopNav.DropdownItem>
    <EvoTopNav.DropdownItem onClick={signOut}>Sign out</EvoTopNav.DropdownItem>
  </EvoTopNav.Dropdown>
</EvoTopNav.Menu>`} />
      </div>

      {/* --- Mobile drawer --- */}
      <div className="docs-section">
        <div className="docs-section-title">Mobile drawer (≤ 768px)</div>
        <p className="docs-section-desc">
          Add <code>EvoTopNav.Toggle</code> to opt into the drawer. Below the{' '}
          <code>collapseBelow</code> breakpoint (default 768&nbsp;px), the menu
          slides in from the right with a focus trap, body scroll lock, and{' '}
          <kbd>Esc</kbd>-to-close. Without a Toggle, the menu degrades to a
          horizontal scroll list — never hidden silently.
        </p>
        <p className="docs-section-desc">
          The drawer state is uncontrolled by default (<code>defaultOpen</code>).
          Pair <code>open</code> with <code>onOpenChange</code> to control it from
          the outside — useful for closing the drawer on route changes:
        </p>
        <div className="docs-preview col" style={{ width: '100%', padding: 0, overflow: 'visible', borderRadius: 8 }}>
          <EvoTopNav
            aria-label="Mobile example"
            open={controlledOpen}
            onOpenChange={setControlledOpen}
          >
            <EvoTopNav.Brand>Evo UI</EvoTopNav.Brand>
            <EvoTopNav.Menu>
              <EvoTopNav.Item href="#home" active>Home</EvoTopNav.Item>
              <EvoTopNav.Item href="#docs">Docs</EvoTopNav.Item>
              <EvoTopNav.Dropdown label="Products">
                <EvoTopNav.DropdownItem href="#a">Analytics</EvoTopNav.DropdownItem>
                <EvoTopNav.DropdownItem href="#s">Search</EvoTopNav.DropdownItem>
              </EvoTopNav.Dropdown>
            </EvoTopNav.Menu>
            <EvoTopNav.Actions>
              <EvoBadge severity="info">v1</EvoBadge>
            </EvoTopNav.Actions>
            <EvoTopNav.Toggle />
          </EvoTopNav>
        </div>
        <p className="docs-section-desc" style={{ marginTop: '0.75rem' }}>
          Resize the viewport below 768&nbsp;px to see the hamburger appear. The
          drawer slides in from the right and traps focus until it closes.
        </p>
        <CodeBlock code={`const [open, setOpen] = useState(false)

<EvoTopNav aria-label="Primary" open={open} onOpenChange={setOpen}>
  <EvoTopNav.Brand>Evo UI</EvoTopNav.Brand>
  <EvoTopNav.Menu>
    <EvoTopNav.Item href="/" active>Home</EvoTopNav.Item>
    <EvoTopNav.Item href="/docs">Docs</EvoTopNav.Item>
    <EvoTopNav.Dropdown label="Products">
      <EvoTopNav.DropdownItem href="/analytics">Analytics</EvoTopNav.DropdownItem>
      <EvoTopNav.DropdownItem href="/search">Search</EvoTopNav.DropdownItem>
    </EvoTopNav.Dropdown>
  </EvoTopNav.Menu>
  <EvoTopNav.Actions>
    <EvoButton label="Sign in" variant="ghost" size="sm" />
  </EvoTopNav.Actions>
  <EvoTopNav.Toggle />
</EvoTopNav>`} />
      </div>

      {/* --- With Icons --- */}
      <div className="docs-section">
        <div className="docs-section-title">With Icons + Actions</div>
        <div className="docs-preview col" style={{ width: '100%', padding: 0, overflow: 'hidden', borderRadius: 8 }}>
          <EvoTopNav aria-label="Icons example">
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
              <EvoButton label="Sign in" variant="ghost" size="sm" />
            </EvoTopNav.Actions>
          </EvoTopNav>
        </div>
      </div>

      <EvoDivider />

      {/* --- Accessibility --- */}
      <div className="docs-section">
        <div className="docs-section-title">Accessibility</div>
        <ul className="docs-list">
          <li>
            The root renders as <code>&lt;nav&gt;</code> and forwards{' '}
            <code>aria-label</code>. Always set <code>aria-label</code> when the
            page has more than one <code>&lt;nav&gt;</code>.
          </li>
          <li>
            <code>active</code> on Item / Dropdown / DropdownItem sets{' '}
            <code>aria-current="page"</code>. The visual highlight and the
            screen-reader signal never drift apart.
          </li>
          <li>
            <code>EvoTopNav.Toggle</code> automatically wires{' '}
            <code>aria-expanded</code> and <code>aria-controls</code> pointing at
            the Menu's id, and gives itself a 44&nbsp;px touch target.
          </li>
          <li>
            <code>EvoTopNav.Dropdown</code> exposes{' '}
            <code>aria-haspopup="menu"</code>, <code>aria-expanded</code>, and{' '}
            <code>role="menu"</code> on the panel.{' '}
            <kbd>↓</kbd>/<kbd>↑</kbd> cycle items, <kbd>Home</kbd>/<kbd>End</kbd>{' '}
            jump to first/last, <kbd>Esc</kbd> closes and returns focus to the
            trigger.
          </li>
          <li>
            While the drawer is open, focus is trapped inside the menu, the body
            is scroll-locked, and <kbd>Esc</kbd> closes it. Focus is restored to
            the toggle on close.
          </li>
          <li>
            Hover-to-open is disabled automatically on coarse pointers
            (<code>(hover: none)</code> / <code>(pointer: coarse)</code>) so
            touch devices use click-only.
          </li>
          <li>
            All animations respect <code>prefers-reduced-motion</code>.
          </li>
        </ul>
      </div>

      {/* --- Props --- */}
      <div className="docs-section">
        <div className="docs-section-title">Props</div>
        <PropsTable props={[
          { prop: 'EvoTopNav — children', type: 'ReactNode', required: true, description: 'Accepts Brand, Menu, Actions, Toggle, Dropdown, and DropdownItem sub-components.' },
          { prop: 'EvoTopNav — aria-label', type: 'string', description: 'Accessible name for the nav. Required when the page has more than one <nav>.' },
          { prop: 'EvoTopNav — open', type: 'boolean', description: 'Controlled open state of the mobile drawer.' },
          { prop: 'EvoTopNav — defaultOpen', type: 'boolean', description: 'Uncontrolled initial open state.', default: 'false' },
          { prop: 'EvoTopNav — onOpenChange', type: '(open: boolean) => void', description: 'Fires when the drawer opens or closes.' },
          { prop: 'EvoTopNav — collapseBelow', type: 'number', description: 'Pixel width below which the menu collapses into the drawer.', default: '768' },
          { prop: 'EvoTopNav — className', type: 'string', description: 'Extra class applied to the <nav> element.' },

          { prop: 'EvoTopNav.Brand — children', type: 'ReactNode', required: true, description: 'Logo or brand name displayed on the left.' },

          { prop: 'EvoTopNav.Menu — children', type: 'ReactNode', required: true, description: 'EvoTopNav.Item / .Dropdown elements.' },

          { prop: 'EvoTopNav.Item — children', type: 'ReactNode', required: true, description: 'Item label, or (with asChild) the element to clone.' },
          { prop: 'EvoTopNav.Item — active', type: 'boolean', description: 'Marks the item as current page (sets aria-current="page").' },
          { prop: 'EvoTopNav.Item — icon', type: 'ReactNode', description: 'Icon rendered before the label.' },
          { prop: 'EvoTopNav.Item — href', type: 'string', description: 'Renders the item as <a href={...}>.' },
          { prop: 'EvoTopNav.Item — target', type: "'_self' | '_blank' | '_parent' | '_top'", description: 'Target attribute, only meaningful with href.' },
          { prop: 'EvoTopNav.Item — rel', type: 'string', description: 'Rel attribute. Defaults to "noopener noreferrer" when target="_blank".' },
          { prop: 'EvoTopNav.Item — onClick', type: '(e: MouseEvent) => void', description: 'Click handler. With href, runs alongside default nav.' },
          { prop: 'EvoTopNav.Item — asChild', type: 'boolean', description: 'Clones the single child and merges our props (className, onClick, aria-current). Use for router Link.' },

          { prop: 'EvoTopNav.Actions — children', type: 'ReactNode', required: true, description: 'Right-aligned slot for buttons, badges, avatars.' },

          { prop: 'EvoTopNav.Toggle — icon', type: 'ReactNode', description: 'Custom toggle icon. Defaults to a hamburger / X.' },
          { prop: 'EvoTopNav.Toggle — aria-label', type: 'string', description: 'Accessible name. Defaults to "Open menu" / "Close menu".' },

          { prop: 'EvoTopNav.Dropdown — label', type: 'ReactNode', required: true, description: 'Trigger label.' },
          { prop: 'EvoTopNav.Dropdown — icon', type: 'ReactNode', description: 'Icon shown before the trigger label.' },
          { prop: 'EvoTopNav.Dropdown — active', type: 'boolean', description: 'Marks the dropdown as the current section.' },
          { prop: 'EvoTopNav.Dropdown — hoverable', type: 'boolean', description: 'Open on hover on fine-pointer devices.', default: 'true' },
          { prop: 'EvoTopNav.Dropdown — open', type: 'boolean', description: 'Controlled open state.' },
          { prop: 'EvoTopNav.Dropdown — defaultOpen', type: 'boolean', description: 'Uncontrolled initial open state.', default: 'false' },
          { prop: 'EvoTopNav.Dropdown — onOpenChange', type: '(open: boolean) => void', description: 'Open/close callback.' },
          { prop: 'EvoTopNav.Dropdown — children', type: 'ReactNode', required: true, description: 'EvoTopNav.DropdownItem elements.' },

          { prop: 'EvoTopNav.DropdownItem — children', type: 'ReactNode', required: true, description: 'Item label, or (with asChild) the element to clone.' },
          { prop: 'EvoTopNav.DropdownItem — icon', type: 'ReactNode', description: 'Icon rendered before the label.' },
          { prop: 'EvoTopNav.DropdownItem — active', type: 'boolean', description: 'Marks item as current page (sets aria-current="page").' },
          { prop: 'EvoTopNav.DropdownItem — href', type: 'string', description: 'Renders as <a href={...}>.' },
          { prop: 'EvoTopNav.DropdownItem — onClick', type: '(e: MouseEvent) => void', description: 'Click handler.' },
          { prop: 'EvoTopNav.DropdownItem — asChild', type: 'boolean', description: 'Clones the single child (use for router Link).' },
        ]} />
      </div>
    </div>
  )
}
