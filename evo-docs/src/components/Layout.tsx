import { useState, useEffect, useLayoutEffect, useRef } from 'react'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { EvoNav, EvoThemeToggle } from '@justin_evo/evo-ui'
import { navIcons, navIconFallback } from './navIcons'

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
      { label: 'AutoComplete', path: '/components/autocomplete' },
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
      { label: 'Notification', path: '/components/notification' },
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

// Components from the most recent releases — flagged with a "New" pill. Keep
// these labels short: the badge renders inside EvoNav's ellipsis-clipped label,
// so a long label + badge would truncate.
const NEW_PATHS = new Set([
  '/components/image-cropper',
  '/components/autocomplete',
  '/components/tree-select',
])

const SearchIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor"
    strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.2-3.2" />
  </svg>
)

const ClearIcon = () => (
  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" aria-hidden="true">
    <path d="M6 6l12 12M18 6 6 18" />
  </svg>
)

const GitHubIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
    <path d="M12 2C6.48 2 2 6.58 2 12.25c0 4.53 2.87 8.37 6.84 9.73.5.1.68-.22.68-.49 0-.24-.01-.87-.01-1.71-2.78.62-3.37-1.37-3.37-1.37-.46-1.18-1.11-1.5-1.11-1.5-.91-.64.07-.62.07-.62 1 .07 1.53 1.06 1.53 1.06.9 1.56 2.34 1.11 2.91.85.09-.66.35-1.11.63-1.37-2.22-.26-4.56-1.14-4.56-5.07 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.71 0 0 .84-.27 2.75 1.05a9.36 9.36 0 0 1 5 0c1.91-1.32 2.75-1.05 2.75-1.05.55 1.41.2 2.45.1 2.71.64.72 1.03 1.63 1.03 2.75 0 3.94-2.34 4.81-4.57 5.06.36.32.68.94.68 1.9 0 1.37-.01 2.48-.01 2.82 0 .27.18.59.69.49A10.04 10.04 0 0 0 22 12.25C22 6.58 17.52 2 12 2Z" />
  </svg>
)

const NpmIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
    <path d="M2 6h20v11h-9v2H8v-2H2V6Zm2 2v7h3V9h2v6h2V8H4Zm9 0v9h2V9h2v6h2V8h-6Z" />
  </svg>
)

const CollapseIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor"
    strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M13.5 7l-5 5 5 5" />
    <path d="M18.5 7l-5 5 5 5" opacity="0.45" />
  </svg>
)

export default function Layout() {
  const navigate = useNavigate()
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [query, setQuery] = useState('')
  // Group-entrance stagger plays once on first load; this flag drops after the
  // animation window so live-search remounts don't replay it.
  const [initialLoad, setInitialLoad] = useState(true)
  // Are we at the docs mobile breakpoint? Drives `inert` on the closed drawer.
  const [isMobileWidth, setIsMobileWidth] = useState(false)
  // Icon-rail collapse (desktop only), persisted across visits.
  const [collapsed, setCollapsed] = useState(() => {
    try {
      return localStorage.getItem('evo-docs-nav-collapsed') === '1'
    } catch {
      return false
    }
  })
  const effectiveCollapsed = collapsed && !isMobileWidth

  // Close mobile nav when route changes
  useEffect(() => {
    setMobileOpen(false)
  }, [location.pathname])

  useEffect(() => {
    const t = window.setTimeout(() => setInitialLoad(false), 700)
    return () => window.clearTimeout(t)
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return
    const mql = window.matchMedia('(max-width: 900px)')
    const update = () => setIsMobileWidth(mql.matches)
    update()
    mql.addEventListener('change', update)
    return () => mql.removeEventListener('change', update)
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem('evo-docs-nav-collapsed', collapsed ? '1' : '0')
    } catch {
      /* storage unavailable — non-fatal */
    }
  }, [collapsed])

  // Lock body scroll while the mobile drawer is open. EvoNav's own scroll lock
  // is disabled here (breakpoint={1}), so the docs shell must own it.
  useEffect(() => {
    if (!mobileOpen) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [mobileOpen])

  // Escape closes the mobile drawer (parity with EvoNav's own handler, which
  // breakpoint={1} disables).
  useEffect(() => {
    if (!mobileOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileOpen(false)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [mobileOpen])

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

  // Live sidebar filter — substring match on the label. Empty groups drop out
  // so the list stays tight at 30+ components.
  const q = query.trim().toLowerCase()
  const filteredNav = q
    ? nav
        .map((g) => ({ ...g, items: g.items.filter((i) => i.label.toLowerCase().includes(q)) }))
        .filter((g) => g.items.length > 0)
    : nav

  // ── Sliding active rail ──────────────────────────────────────────────
  // A single accent bar that glides to the active row instead of snapping.
  // We measure the row carrying `aria-current="page"` (set by EvoNav) and
  // translate the rail to it. Position is in the nav's *content* coordinate
  // space (+ scrollTop) so the rail stays glued while the list scrolls.
  // Falls back to hidden whenever there is no active/visible row.
  const navWrapRef = useRef<HTMLDivElement>(null)
  const [rail, setRail] = useState<{ y: number; h: number; visible: boolean }>({
    y: 0,
    h: 0,
    visible: false,
  })

  useLayoutEffect(() => {
    const wrap = navWrapRef.current
    if (!wrap) return
    const measure = () => {
      const active = wrap.querySelector<HTMLElement>('[aria-current="page"]')
      // Hide the rail when there's no active row, or the active row sits inside
      // a collapsed (inert) accordion panel / is otherwise not rendered.
      if (!active || active.closest('[inert]')) {
        setRail((r) => (r.visible ? { ...r, visible: false } : r))
        return
      }
      const wr = wrap.getBoundingClientRect()
      const ar = active.getBoundingClientRect()
      if (ar.height < 1) {
        setRail((r) => (r.visible ? { ...r, visible: false } : r))
        return
      }
      setRail({ y: ar.top - wr.top + wrap.scrollTop, h: ar.height, visible: true })
    }
    measure()
    // Re-measure after the entrance stagger settles and after web fonts load —
    // both shift row geometry after the first synchronous measure.
    const settle = window.setTimeout(measure, 420)
    document.fonts?.ready?.then(measure).catch(() => {})
    // Observe the nav content too, so the rail glides as accordion groups
    // expand/collapse (which move rows without resizing the scroll wrap).
    const ro = new ResizeObserver(measure)
    ro.observe(wrap)
    const navEl = wrap.querySelector('nav')
    if (navEl) ro.observe(navEl)
    window.addEventListener('resize', measure)
    return () => {
      window.clearTimeout(settle)
      ro.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [activePath, q, mobileOpen, effectiveCollapsed])

  // On route change, pull the active row into view if it's outside the visible
  // band — deep links can otherwise land with the active row (and its rail)
  // below the fold. Instant scroll keeps it reduced-motion safe.
  useEffect(() => {
    const wrap = navWrapRef.current
    if (!wrap) return
    const active = wrap.querySelector<HTMLElement>('[aria-current="page"]')
    if (!active) return
    const wr = wrap.getBoundingClientRect()
    const ar = active.getBoundingClientRect()
    if (ar.top < wr.top + 16 || ar.bottom > wr.bottom - 16) {
      active.scrollIntoView({ block: 'nearest' })
    }
  }, [activePath])

  return (
    <div className="docs-layout" data-collapsed={effectiveCollapsed ? 'true' : undefined}>
      <aside
        id="docs-sidebar"
        className={`docs-sidebar${mobileOpen ? ' docs-sidebar-open' : ''}`}
        inert={isMobileWidth && !mobileOpen}
      >
        <div className="docs-sidebar-logo">
          <span className="docs-logo-mark" aria-hidden="true">E</span>
          <span className="docs-logo-text">Evo UI</span>
          {/* Keep in sync with evo-ui/package.json version on each release. */}
          <span className="docs-logo-version">v1.1</span>
        </div>

        <div className="docs-sidebar-search">
          <div className="docs-search-field">
            <SearchIcon />
            <input
              className="docs-search-input"
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Escape') setQuery('')
              }}
              placeholder="Search components…"
              aria-label="Search components"
            />
            {query && (
              <button
                type="button"
                className="docs-search-clear"
                aria-label="Clear search"
                onClick={() => setQuery('')}
              >
                <ClearIcon />
              </button>
            )}
          </div>
        </div>

        <div
          className="docs-sidebar-nav"
          ref={navWrapRef}
          data-initial={initialLoad ? 'true' : undefined}
        >
          <span
            className="docs-nav-rail"
            aria-hidden="true"
            data-visible={rail.visible}
            style={{ transform: `translateY(${rail.y}px)`, height: `${rail.h}px` }}
          />
          <EvoNav
            breakpoint={1}
            hideTrigger
            collapsed={effectiveCollapsed}
            aria-label="Documentation"
          >
            {/* The group key flips on search-mode entry/exit so filtered groups
                remount to defaultOpen (force-open results). This resets a manual
                collapse by design; typing more characters keeps the key stable. */}
            {filteredNav.map((section) => (
              <EvoNav.Group
                key={`${section.group}${q ? ':search' : ''}`}
                label={section.group}
                count={section.items.length}
                collapsible
                defaultOpen
              >
                {section.items.map((item) => (
                  <EvoNav.Item
                    key={item.path}
                    icon={navIcons[item.path] ?? navIconFallback}
                    active={activePath === item.path}
                    tooltip={item.label}
                    onClick={() => navigate(item.path)}
                  >
                    {item.label}
                    {NEW_PATHS.has(item.path) && <span className="docs-nav-new">New</span>}
                  </EvoNav.Item>
                ))}
              </EvoNav.Group>
            ))}
          </EvoNav>

          {filteredNav.length === 0 && (
            <p className="docs-nav-empty">
              No components match “{query.trim()}”.
            </p>
          )}
        </div>

        <div className="docs-sidebar-footer">
          <a
            className="docs-sidebar-link"
            href="https://github.com/jinchuen/evo"
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub repository"
            title="GitHub"
          >
            <GitHubIcon />
          </a>
          <a
            className="docs-sidebar-link"
            href="https://www.npmjs.com/package/@justin_evo/evo-ui"
            target="_blank"
            rel="noreferrer"
            aria-label="npm package"
            title="npm"
          >
            <NpmIcon />
          </a>
          <button
            type="button"
            className="docs-collapse-btn"
            onClick={() => setCollapsed((v) => !v)}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            aria-pressed={collapsed}
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            data-collapsed={collapsed ? 'true' : undefined}
          >
            <CollapseIcon />
          </button>
        </div>
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
            aria-label={mobileOpen ? 'Close navigation' : 'Open navigation'}
            aria-expanded={mobileOpen}
            aria-controls="docs-sidebar"
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
