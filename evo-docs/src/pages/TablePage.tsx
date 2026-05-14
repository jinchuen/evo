import { useState } from 'react'
import { EvoTable, EvoBadge, EvoAlert, EvoDivider, EvoButton } from '@justin_evo/evo-ui'
import { CodeBlock } from '../components/CodeBlock'
import { PropsTable } from '../components/PropsTable'

interface User extends Record<string, unknown> {
  id: number
  name: string
  email: string
  role: { name: string }
  status: 'active' | 'inactive' | 'pending'
  visits: number
}

const data: User[] = [
  { id: 1, name: 'Alice Johnson', email: 'alice@example.com', role: { name: 'Admin' }, status: 'active', visits: 142 },
  { id: 2, name: 'Bob Smith', email: 'bob@example.com', role: { name: 'Editor' }, status: 'inactive', visits: 38 },
  { id: 3, name: 'Carol White', email: 'carol@example.com', role: { name: 'Viewer' }, status: 'active', visits: 87 },
  { id: 4, name: 'Dave Brown', email: 'dave@example.com', role: { name: 'Editor' }, status: 'pending', visits: 12 },
  { id: 5, name: 'Eve Davis', email: 'eve@example.com', role: { name: 'Viewer' }, status: 'active', visits: 64 },
]

const longData: User[] = [
  ...data,
  { id: 6, name: 'Frank Miller', email: 'frank@example.com', role: { name: 'Editor' }, status: 'active', visits: 203 },
  { id: 7, name: 'Grace Lee', email: 'grace@example.com', role: { name: 'Admin' }, status: 'inactive', visits: 5 },
  { id: 8, name: 'Henry Wilson', email: 'henry@example.com', role: { name: 'Viewer' }, status: 'pending', visits: 28 },
  { id: 9, name: 'Iris Chen', email: 'iris@example.com', role: { name: 'Editor' }, status: 'active', visits: 91 },
  { id: 10, name: 'Jack Taylor', email: 'jack@example.com', role: { name: 'Viewer' }, status: 'active', visits: 47 },
]

const statusMap = {
  active: 'success',
  inactive: 'secondary',
  pending: 'warning',
} as const

const columns = [
  { key: 'id', header: '#', width: '64px', align: 'right' as const },
  { key: 'name', header: 'Name', sortable: true },
  { key: 'email', header: 'Email' },
  { key: 'role.name', header: 'Role', sortable: true },
  { key: 'visits', header: 'Visits', align: 'right' as const, sortable: true },
  {
    key: 'status',
    header: 'Status',
    render: (val: unknown) => (
      <EvoBadge severity={statusMap[val as User['status']]} variant="subtle" size="sm" dot>
        {val as string}
      </EvoBadge>
    ),
  },
]

export default function TablePage() {
  const [selected, setSelected] = useState<User | null>(null)
  const [density, setDensity] = useState<'sm' | 'md' | 'lg'>('md')
  const [loading, setLoading] = useState(false)
  const [showEmpty, setShowEmpty] = useState(false)

  return (
    <div>
      <div className="docs-page-header">
        <div className="docs-page-tag">Component</div>
        <h1 className="docs-page-title">EvoTable</h1>
        <p className="docs-page-desc">
          A lightweight, fully-typed data table with sortable columns, density variants,
          sticky headers, loading skeletons, and built-in mobile responsiveness. Themes
          automatically follow the active light/dark mode.
        </p>
        <div className="docs-import-line">
          import {'{ '}<span>EvoTable</span>{' }'} from '@justin_evo/evo-ui'
        </div>
      </div>

      {/* ----- Basic + sortable ----- */}
      <div className="docs-section">
        <div className="docs-section-title">Basic Table</div>
        <p className="docs-section-desc">
          Click any sortable header to cycle through ascending → descending → unsorted.
          Double-click a row to capture it.
        </p>
        {selected && (
          <EvoAlert type="info" dismissible>
            Double-clicked: <strong>{selected.name}</strong>
          </EvoAlert>
        )}
        <EvoTable
          columns={columns}
          data={data}
          rowKey="id"
          onRowDoubleClick={(row) => setSelected(row as unknown as User)}
        />
        <CodeBlock code={`interface User {
  id: number
  name: string
  role: { name: string }
  status: 'active' | 'inactive' | 'pending'
  visits: number
}

const columns = [
  { key: 'id', header: '#', width: '64px', align: 'right' },
  { key: 'name', header: 'Name', sortable: true },
  { key: 'email', header: 'Email' },
  { key: 'role.name', header: 'Role', sortable: true },   // dot notation
  { key: 'visits', header: 'Visits', align: 'right', sortable: true },
  {
    key: 'status',
    header: 'Status',
    render: (val) => <EvoBadge severity="success">{val}</EvoBadge>,
  },
]

<EvoTable
  columns={columns}
  data={data}
  rowKey="id"
  onRowDoubleClick={(row) => console.log(row)}
/>`} />
      </div>

      {/* ----- Density ----- */}
      <div className="docs-section">
        <div className="docs-section-title">Density</div>
        <p className="docs-section-desc">
          Three sizes (<code>sm</code>, <code>md</code>, <code>lg</code>) scale padding
          and font-size together for comfortable or compact data display.
        </p>
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
          {(['sm', 'md', 'lg'] as const).map((s) => (
            <EvoButton
              key={s}
              label={s.toUpperCase()}
              size="sm"
              variant={density === s ? 'solid' : 'outline'}
              severity="primary"
              onClick={() => setDensity(s)}
            />
          ))}
        </div>
        <EvoTable columns={columns} data={data} rowKey="id" size={density} />
        <CodeBlock code={`<EvoTable columns={columns} data={data} size="sm" />
<EvoTable columns={columns} data={data} size="md" />
<EvoTable columns={columns} data={data} size="lg" />`} />
      </div>

      {/* ----- Striped + sticky ----- */}
      <div className="docs-section">
        <div className="docs-section-title">Striped + Sticky Header</div>
        <p className="docs-section-desc">
          Use <code>striped</code> for alternating row backgrounds and{' '}
          <code>stickyHeader</code> to pin the header during vertical scroll.
        </p>
        <EvoTable
          columns={columns}
          data={longData}
          rowKey="id"
          striped
          stickyHeader
        />
        <CodeBlock code={`<EvoTable
  columns={columns}
  data={data}
  striped
  stickyHeader
/>`} />
      </div>

      {/* ----- Loading ----- */}
      <div className="docs-section">
        <div className="docs-section-title">Loading State</div>
        <p className="docs-section-desc">
          Pass <code>loading</code> to render shimmering skeleton rows in place of data.
        </p>
        <div style={{ marginBottom: '0.75rem' }}>
          <EvoButton
            label={loading ? 'Stop Loading' : 'Show Loading'}
            size="sm"
            severity="primary"
            onClick={() => setLoading((v) => !v)}
          />
        </div>
        <EvoTable
          columns={columns}
          data={data}
          rowKey="id"
          loading={loading}
          loadingRows={5}
        />
        <CodeBlock code={`<EvoTable
  columns={columns}
  data={data}
  loading={isFetching}
  loadingRows={5}
/>`} />
      </div>

      {/* ----- Empty state ----- */}
      <div className="docs-section">
        <div className="docs-section-title">Empty State</div>
        <p className="docs-section-desc">
          Provide a plain message via <code>emptyText</code>, or pass any node to{' '}
          <code>emptyState</code> for fully custom empty content.
        </p>
        <div style={{ marginBottom: '0.75rem' }}>
          <EvoButton
            label={showEmpty ? 'Show Data' : 'Show Empty State'}
            size="sm"
            severity="primary"
            onClick={() => setShowEmpty((v) => !v)}
          />
        </div>
        <EvoTable
          columns={columns}
          data={showEmpty ? [] : data}
          rowKey="id"
          emptyState={
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ fontSize: '1rem', fontWeight: 600 }}>No users yet</div>
              <div style={{ fontSize: '0.875rem', opacity: 0.7 }}>
                Invite teammates to see them appear here.
              </div>
              <EvoButton label="Invite user" size="sm" severity="primary" />
            </div>
          }
        />
        <CodeBlock code={`// Simple message
<EvoTable columns={columns} data={[]} emptyText="No users found." />

// Custom slot
<EvoTable
  columns={columns}
  data={[]}
  emptyState={
    <div>
      <h4>No users yet</h4>
      <p>Invite teammates to get started.</p>
      <EvoButton label="Invite user" />
    </div>
  }
/>`} />
      </div>

      {/* ----- Responsive ----- */}
      <div className="docs-section">
        <div className="docs-section-title">Mobile Responsive</div>
        <p className="docs-section-desc">
          On wide screens this table looks normal. Resize below ~640px (or open dev
          tools and toggle mobile view) — each row collapses into a labelled card so
          nothing gets clipped or squished.
        </p>
        <EvoTable
          columns={columns}
          data={data}
          rowKey="id"
          responsive="stack"
        />
        <CodeBlock code={`<EvoTable
  columns={columns}
  data={data}
  responsive="stack"   // 'scroll' (default) | 'stack'
/>`} />
      </div>

      <EvoDivider />

      {/* ----- Props ----- */}
      <div className="docs-section">
        <div className="docs-section-title">EvoTable Props</div>
        <PropsTable props={[
          { prop: 'columns', type: 'TableColumn<T>[]', required: true, description: 'Column definitions.' },
          { prop: 'data', type: 'T[]', required: true, description: 'Row data array.' },
          { prop: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Density variant — controls padding and font size.' },
          { prop: 'striped', type: 'boolean', default: 'false', description: 'Alternating row backgrounds.' },
          { prop: 'hoverable', type: 'boolean', default: 'true', description: 'Highlight rows on hover.' },
          { prop: 'bordered', type: 'boolean', default: 'false', description: 'Add vertical dividers between columns.' },
          { prop: 'stickyHeader', type: 'boolean', default: 'false', description: 'Pin the header while the body scrolls.' },
          { prop: 'loading', type: 'boolean', default: 'false', description: 'Render skeleton rows in place of data.' },
          { prop: 'loadingRows', type: 'number', default: '5', description: 'Number of skeleton rows to display when loading.' },
          { prop: 'rowKey', type: 'keyof T | (row, i) => Key', description: 'Stable React key for each row. Prefer this over array index.' },
          { prop: 'emptyState', type: 'ReactNode', description: 'Custom empty-state node (overrides emptyText).' },
          { prop: 'emptyText', type: 'string', default: "'No data available.'", description: 'Plain-text fallback when data is empty.' },
          { prop: 'onRowClick', type: '(row: T, i: number) => void', description: 'Single-click handler.' },
          { prop: 'onRowDoubleClick', type: '(row: T, i: number) => void', description: 'Double-click handler.' },
          { prop: 'getRowClassName', type: '(row: T, i: number) => string', description: 'Per-row custom class.' },
          { prop: 'responsive', type: "'scroll' | 'stack'", default: "'scroll'", description: "Small-viewport behaviour. 'stack' collapses rows into labelled cards under ~640px." },
          { prop: 'caption', type: 'ReactNode', description: 'Caption rendered above the table.' },
          { prop: 'sort', type: 'TableSortState | null', description: 'Controlled sort state. Pair with onSortChange.' },
          { prop: 'onSortChange', type: '(next) => void', description: 'Sort change callback.' },
          { prop: 'defaultSort', type: 'TableSortState', description: 'Initial sort for uncontrolled mode.' },
          { prop: 'className', type: 'string', description: 'Additional CSS class on the wrapper.' },
        ]} />
      </div>

      <div className="docs-section">
        <div className="docs-section-title">TableColumn Definition</div>
        <PropsTable props={[
          { prop: 'key', type: 'string', required: true, description: "Key in the data object. Supports dot notation for nested fields (e.g. 'role.name')." },
          { prop: 'header', type: 'ReactNode', required: true, description: 'Column header — string or JSX.' },
          { prop: 'width', type: 'string', description: "Optional fixed width, e.g. '120px' or '10%'." },
          { prop: 'align', type: "'left' | 'center' | 'right'", default: "'left'", description: 'Cell alignment.' },
          { prop: 'sortable', type: 'boolean', default: 'false', description: 'Enable click-to-sort on this column.' },
          { prop: 'sortFn', type: '(a, b, dir) => number', description: 'Custom comparator. Defaults to a numeric-aware string compare.' },
          { prop: 'render', type: '(value, row, i) => ReactNode', description: 'Custom cell renderer.' },
          { prop: 'cellClassName', type: 'string', description: 'Extra class for cells in this column.' },
          { prop: 'headerClassName', type: 'string', description: 'Extra class for the header cell.' },
        ]} />
      </div>
    </div>
  )
}
