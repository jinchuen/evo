# EvoNav

A vertical sidebar navigation component with support for grouped sections, recursive multi-level menus, active state indicators, skeleton loading, and a quick-action button.

---

## Installation

```bash
npm install @justin_evo/evo-ui
```

---

## Import

```tsx
import { EvoNav } from '@justin_evo/evo-ui'
```

---

## Basic Usage

```tsx
import { useState } from 'react'
import { EvoNav } from '@justin_evo/evo-ui'

export default function Sidebar() {
  const [active, setActive] = useState('dashboard')

  return (
    <EvoNav>
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
    </EvoNav>
  )
}
```

---

## Grouped Navigation

Use `EvoNav.Group` to organize items under labelled sections.

```tsx
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
```

---

## With Icons

Pass any React node to the `icon` prop. It renders to the left of the label.

```tsx
import { HomeIcon, ChartIcon, SettingsIcon } from './icons'

<EvoNav>
  <EvoNav.Item icon={<HomeIcon />} active>
    Home
  </EvoNav.Item>
  <EvoNav.Item icon={<ChartIcon />}>
    Analytics
  </EvoNav.Item>
  <EvoNav.Item icon={<SettingsIcon />}>
    Settings
  </EvoNav.Item>
</EvoNav>
```

---

## Nested Multi-level Menus

Pass an `items` array to create a collapsible sub-menu. Clicking the item toggles it open or closed. Nesting is fully recursive — sub-items can have their own `items`.

```tsx
import { EvoNav } from '@justin_evo/evo-ui'
import type { NavSubItem } from '@justin_evo/evo-ui'

const userSubItems: NavSubItem[] = [
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
      { label: 'Admin',  active: active === 'admin',  onClick: () => setActive('admin') },
      { label: 'Editor', active: active === 'editor', onClick: () => setActive('editor') },
    ],
  },
  {
    label: 'Invites',
    active: active === 'invites',
    onClick: () => setActive('invites'),
  },
]

<EvoNav>
  <EvoNav.Item
    icon={<UsersIcon />}
    active={active === 'users'}
    onClick={() => setActive('users')}
    items={userSubItems}
  >
    Users
  </EvoNav.Item>
</EvoNav>
```

Clicking a parent item that has `items` will:
1. Call its `onClick` handler (if provided).
2. Toggle the sub-menu open or closed.

---

## Quick Action Button

`EvoNav.QuickAction` renders a persistent "Create New" (+) button. Place it at the top of the nav so users can trigger a create action from any page.

```tsx
<EvoNav>
  <EvoNav.QuickAction label="Create New" onClick={openCreateModal} />

  <EvoNav.Group label="Main">
    <EvoNav.Item active>Dashboard</EvoNav.Item>
    <EvoNav.Item>Analytics</EvoNav.Item>
  </EvoNav.Group>
</EvoNav>
```

---

## Skeleton Loading

Show `EvoNav.Skeleton` while navigation data is still being fetched. It renders animated shimmer placeholder rows.

```tsx
const { data, isLoading } = useNavItems()

<EvoNav>
  {isLoading ? (
    <EvoNav.Skeleton count={5} />
  ) : (
    <EvoNav.Group label="Main">
      {data.map(item => (
        <EvoNav.Item
          key={item.id}
          active={active === item.id}
          onClick={() => setActive(item.id)}
        >
          {item.label}
        </EvoNav.Item>
      ))}
    </EvoNav.Group>
  )}
</EvoNav>
```

---

## Router Integration (React Router)

```tsx
import { useNavigate, useLocation } from 'react-router-dom'
import { EvoNav } from '@justin_evo/evo-ui'

const links = [
  { label: 'Dashboard', path: '/' },
  { label: 'Analytics', path: '/analytics' },
  { label: 'Settings',  path: '/settings' },
]

export function Sidebar() {
  const navigate  = useNavigate()
  const location  = useLocation()

  return (
    <EvoNav>
      <EvoNav.Group label="Main">
        {links.map(link => (
          <EvoNav.Item
            key={link.path}
            active={location.pathname === link.path}
            onClick={() => navigate(link.path)}
          >
            {link.label}
          </EvoNav.Item>
        ))}
      </EvoNav.Group>
    </EvoNav>
  )
}
```

---

## API Reference

### `EvoNav`

| Prop        | Type          | Default | Description                          |
|-------------|---------------|---------|--------------------------------------|
| `children`  | `ReactNode`   | —       | `EvoNav.Item`, `EvoNav.Group`, etc.  |
| `className` | `string`      | `''`    | Additional CSS class on the `<nav>`. |

---

### `EvoNav.Item`

| Prop        | Type            | Default | Description                                                   |
|-------------|-----------------|---------|---------------------------------------------------------------|
| `children`  | `ReactNode`     | —       | Item label text.                                              |
| `active`    | `boolean`       | `false` | Highlights the item with the accent color and a left indicator. |
| `icon`      | `ReactNode`     | —       | Icon rendered to the left of the label.                       |
| `onClick`   | `() => void`    | —       | Called on click. If `items` is set, also toggles the sub-menu. |
| `items`     | `NavSubItem[]`  | —       | Nested sub-items. Creates a collapsible child list.           |
| `className` | `string`        | `''`    | Additional CSS class on the button element.                   |

---

### `NavSubItem`

Sub-items share the same shape and are recursive.

| Prop      | Type           | Description                                        |
|-----------|----------------|----------------------------------------------------|
| `label`   | `string`       | Display text.                                      |
| `active`  | `boolean`      | Highlights this sub-item.                          |
| `icon`    | `ReactNode`    | Icon for the sub-item.                             |
| `onClick` | `() => void`   | Called on click. Also toggles deeper nesting.      |
| `items`   | `NavSubItem[]` | Deeper sub-items (recursive).                      |

---

### `EvoNav.Group`

| Prop       | Type        | Required | Description                              |
|------------|-------------|----------|------------------------------------------|
| `label`    | `string`    | Yes      | Group heading displayed above the items. |
| `children` | `ReactNode` | Yes      | `EvoNav.Item` elements.                  |

---

### `EvoNav.Skeleton`

| Prop    | Type     | Default | Description                        |
|---------|----------|---------|------------------------------------|
| `count` | `number` | `4`     | Number of shimmer rows to display. |

---

### `EvoNav.QuickAction`

| Prop      | Type         | Default        | Description                          |
|-----------|--------------|----------------|--------------------------------------|
| `label`   | `string`     | `'Create New'` | Button text shown beside the + icon. |
| `onClick` | `() => void` | —              | Called when the button is clicked.   |

---

## Full Example

```tsx
import { useState } from 'react'
import { EvoNav } from '@justin_evo/evo-ui'

export function AppSidebar() {
  const [active, setActive] = useState('dashboard')
  const [loading, setLoading] = useState(false)

  return (
    <aside style={{ width: 240, padding: '0.5rem 0' }}>
      <EvoNav>
        <EvoNav.QuickAction label="Create New" onClick={() => console.log('create')} />

        {loading ? (
          <EvoNav.Skeleton count={6} />
        ) : (
          <>
            <EvoNav.Group label="Main">
              <EvoNav.Item
                icon={<span>🏠</span>}
                active={active === 'dashboard'}
                onClick={() => setActive('dashboard')}
              >
                Dashboard
              </EvoNav.Item>

              <EvoNav.Item
                icon={<span>👥</span>}
                active={active === 'users'}
                onClick={() => setActive('users')}
                items={[
                  { label: 'All Users', active: active === 'all-users', onClick: () => setActive('all-users') },
                  { label: 'Roles',     active: active === 'roles',     onClick: () => setActive('roles') },
                  { label: 'Invites',   active: active === 'invites',   onClick: () => setActive('invites') },
                ]}
              >
                Users
              </EvoNav.Item>

              <EvoNav.Item
                icon={<span>📊</span>}
                active={active === 'analytics'}
                onClick={() => setActive('analytics')}
              >
                Analytics
              </EvoNav.Item>
            </EvoNav.Group>

            <EvoNav.Group label="Settings">
              <EvoNav.Item
                icon={<span>⚙️</span>}
                active={active === 'settings'}
                onClick={() => setActive('settings')}
                items={[
                  { label: 'General',  active: active === 'general',  onClick: () => setActive('general') },
                  { label: 'Security', active: active === 'security', onClick: () => setActive('security') },
                  { label: 'Billing',  active: active === 'billing',  onClick: () => setActive('billing') },
                ]}
              >
                Settings
              </EvoNav.Item>
            </EvoNav.Group>
          </>
        )}
      </EvoNav>
    </aside>
  )
}
```
