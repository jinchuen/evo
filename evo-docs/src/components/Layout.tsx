import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { EvoNav } from '@justin_evo/evo-ui'

const nav = [
  {
    group: 'Getting Started',
    items: [{ label: 'Overview', path: '/' }],
  },
  {
    group: 'Forms',
    items: [
      { label: 'Button', path: '/components/button' },
      { label: 'Input', path: '/components/input' },
      { label: 'Checkbox', path: '/components/checkbox' },
      { label: 'Radio', path: '/components/radio' },
      { label: 'Select', path: '/components/select' },
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
]

export default function Layout() {
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <div className="docs-layout">
      <aside className="docs-sidebar">
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
                  active={location.pathname === item.path}
                  onClick={() => navigate(item.path)}
                >
                  {item.label}
                </EvoNav.Item>
              ))}
            </EvoNav.Group>
          ))}
        </EvoNav>
      </aside>
      <main className="docs-main">
        <Outlet />
      </main>
    </div>
  )
}
