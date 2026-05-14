import { useState, useEffect } from 'react'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { EvoNav, EvoThemeToggle } from '@justin_evo/evo-ui'

const nav = [
  {
    group: 'Getting Started',
    items: [
      { label: 'Overview',  path: '/' },
      { label: 'Changelog', path: '/changelog' },
    ],
  },
  {
    group: 'Foundations',
    items: [
      { label: 'Theming',   path: '/theming' },
      { label: 'Utilities', path: '/utilities' },
    ],
  },
  {
    group: 'For AI',
    items: [
      { label: 'Build with AI', path: '/ai' },
    ],
  },
  {
    group: 'Forms',
    items: [
      { label: 'Button', path: '/components/button' },
      { label: 'Input', path: '/components/input' },
      { label: 'Rich Text Area', path: '/components/rich-text-area' },
      { label: 'Checkbox', path: '/components/checkbox' },
      { label: 'Radio', path: '/components/radio' },
      { label: 'Select', path: '/components/select' },
      { label: 'Tree Select', path: '/components/tree-select' },
      { label: 'Toggle', path: '/components/toggle' },
      { label: 'Form', path: '/components/form' },
    ],
  },
  {
    group: 'Layout',
    items: [
      { label: 'Stack', path: '/components/stack' },
      { label: 'Grid', path: '/components/grid' },
      { label: 'Container', path: '/components/container' },
      { label: 'Divider', path: '/components/divider' },
    ],
  },
  {
    group: 'Navigation',
    items: [
      { label: 'Nav', path: '/components/nav' },
      { label: 'TopNav', path: '/components/topnav' },
      { label: 'Breadcrumb', path: '/components/breadcrumb' },
      { label: 'Tabs', path: '/components/tabs' },
      { label: 'Pagination', path: '/components/pagination' },
      { label: 'Command Palette', path: '/components/command-palette' },
    ],
  },
  {
    group: 'Data Display',
    items: [
      { label: 'Card', path: '/components/card' },
      { label: 'Table', path: '/components/table' },
      { label: 'Badge', path: '/components/badge' },
      { label: 'Skeleton', path: '/components/skeleton' },
    ],
  },
  {
    group: 'Feedback',
    items: [
      { label: 'Alert', path: '/components/alert' },
      { label: 'Modal', path: '/components/modal' },
      { label: 'Tooltip', path: '/components/tooltip' },
      { label: 'Toast', path: '/components/toast' },
    ],
  },
  {
    group: 'Media',
    items: [
      { label: 'Image Cropper', path: '/components/image-cropper' },
    ],
  },
]

// Sub-pages that don't appear in the sidebar (one sidebar row = one component)
// but still need a topbar title and a "highlight the parent" rule for the nav.
// Keyed by exact pathname.
const SUB_PAGES: Record<string, { title: string; parentPath: string }> = {
  '/components/rich-text-area/tools': {
    title: 'Rich Text Area · Tools & Customization',
    parentPath: '/components/rich-text-area',
  },
  '/components/rich-text-area/images': {
    title: 'Rich Text Area · Image Upload',
    parentPath: '/components/rich-text-area',
  },
  '/components/rich-text-area/api': {
    title: 'Rich Text Area · API Reference',
    parentPath: '/components/rich-text-area',
  },
  '/components/image-cropper/api': {
    title: 'Image Cropper · API Reference',
    parentPath: '/components/image-cropper',
  },
}

export default function Layout() {
  const navigate = useNavigate()
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)

  // Close mobile nav when route changes
  useEffect(() => {
    setMobileOpen(false)
  }, [location.pathname])

  // Derive a friendly page title for the topbar. Sidebar items win first;
  // sub-pages (not in the sidebar) fall through to the SUB_PAGES map.
  const currentTitle =
    nav.flatMap((g) => g.items).find((i) => i.path === location.pathname)?.label
    ?? SUB_PAGES[location.pathname]?.title
    ?? 'Evo UI'

  // Highlight a sidebar item when either the current path matches it directly
  // or the current path is one of that item's registered sub-pages. This is
  // why /components/rich-text-area/tools still highlights "Rich Text Area".
  const activePath = SUB_PAGES[location.pathname]?.parentPath ?? location.pathname

  // The overview page wants a wider reading column so the component
  // grid can grow beyond ~3 cards per row on large displays.
  const isOverview = location.pathname === '/'

  return (
    <div className="docs-layout">
      <aside className={`docs-sidebar${mobileOpen ? ' docs-sidebar-open' : ''}`}>
        <div className="docs-sidebar-logo">
          <span className="docs-logo-text">Evo UI</span>
          <span className="docs-logo-version">v1.0</span>
        </div>
        <EvoNav>
          {nav.map((section) => (
            <EvoNav.Group key={section.group} label={section.group}>
              {section.items.map((item) => (
                <EvoNav.Item
                  key={item.path}
                  active={activePath === item.path}
                  onClick={() => navigate(item.path)}
                >
                  {item.label}
                </EvoNav.Item>
              ))}
            </EvoNav.Group>
          ))}
        </EvoNav>
      </aside>

      <div
        className={`docs-sidebar-scrim${mobileOpen ? ' docs-sidebar-scrim-open' : ''}`}
        onClick={() => setMobileOpen(false)}
        aria-hidden="true"
      />

      <main className="docs-main">
        <header className="docs-topbar">
          <button
            type="button"
            className="docs-mobile-menu-btn"
            aria-label="Open navigation"
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((v) => !v)}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="3" y1="6"  x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
          <span className="docs-topbar-title">{currentTitle}</span>
          <div className="docs-topbar-actions">
            <EvoThemeToggle />
          </div>
        </header>

        <div className={`docs-main-inner${isOverview ? ' docs-main-inner-wide' : ''}`}>
          <Outlet />
        </div>
      </main>
    </div>
  )
}
