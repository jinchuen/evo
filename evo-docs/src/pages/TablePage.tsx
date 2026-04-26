import { useState } from 'react'
import { EvoTable, EvoBadge, EvoAlert, EvoDivider } from '@justin_evo/evo-ui'
import { CodeBlock } from '../components/CodeBlock'
import { PropsTable } from '../components/PropsTable'

interface User extends Record<string, unknown> {
  id: number
  name: string
  email: string
  role: { name: string }
  status: 'active' | 'inactive' | 'pending'
}

const data: User[] = [
  { id: 1, name: 'Alice Johnson', email: 'alice@example.com', role: { name: 'Admin' }, status: 'active' },
  { id: 2, name: 'Bob Smith', email: 'bob@example.com', role: { name: 'Editor' }, status: 'inactive' },
  { id: 3, name: 'Carol White', email: 'carol@example.com', role: { name: 'Viewer' }, status: 'active' },
  { id: 4, name: 'Dave Brown', email: 'dave@example.com', role: { name: 'Editor' }, status: 'pending' },
  { id: 5, name: 'Eve Davis', email: 'eve@example.com', role: { name: 'Viewer' }, status: 'active' },
]

const statusMap = {
  active: 'success',
  inactive: 'secondary',
  pending: 'warning',
} as const

const columns = [
  { key: 'id', header: '#', width: '60px' },
  { key: 'name', header: 'Name' },
  { key: 'email', header: 'Email' },
  { key: 'role.name', header: 'Role' },
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

  return (
    <div>
      <div className="docs-page-header">
        <div className="docs-page-tag">Component</div>
        <h1 className="docs-page-title">EvoTable</h1>
        <p className="docs-page-desc">
          A fully typed data table with custom cell renderers, double-click row handlers,
          and an empty state.
        </p>
        <div className="docs-import-line">
          import {'{ '}<span>EvoTable</span>{' }'} from '@justin_evo/evo-ui'
        </div>
      </div>

      <div className="docs-section">
        <div className="docs-section-title">Basic Table</div>
        {selected && (
          <EvoAlert type="info" dismissible>
            Double-clicked: <strong>{selected.name}</strong>
          </EvoAlert>
        )}
        <EvoTable
          columns={columns}
          data={data}
          onRowDoubleClick={(row) => setSelected(row as unknown as User)}
        />
        <CodeBlock code={`interface User {
  id: number
  name: string
  role: { name: string }
  status: 'active' | 'inactive'
}

const columns = [
  { key: 'id', header: '#', width: '60px' },
  { key: 'name', header: 'Name' },
  { key: 'role.name', header: 'Role' },  // dot notation for nested fields
  {
    key: 'status',
    header: 'Status',
    render: (val) => <EvoBadge severity="success">{val}</EvoBadge>,
  },
]

<EvoTable
  columns={columns}
  data={data}
  onRowDoubleClick={(row) => console.log(row)}
/>`} />
      </div>

      <div className="docs-section">
        <div className="docs-section-title">Empty State</div>
        <EvoTable columns={columns} data={[]} emptyText="No users found." />
        <CodeBlock code={`<EvoTable columns={columns} data={[]} emptyText="No users found." />`} />
      </div>

      <EvoDivider />

      <div className="docs-section">
        <div className="docs-section-title">EvoTable Props</div>
        <PropsTable props={[
          { prop: 'columns', type: 'TableColumn<T>[]', required: true, description: 'Column definitions.' },
          { prop: 'data', type: 'T[]', required: true, description: 'Row data array.' },
          { prop: 'emptyText', type: 'string', default: "'No data available.'", description: 'Message shown when data is empty.' },
          { prop: 'onRowDoubleClick', type: '(row: T) => void', description: 'Called when a row is double-clicked.' },
          { prop: 'className', type: 'string', description: 'Additional CSS class.' },
        ]} />
      </div>

      <div className="docs-section">
        <div className="docs-section-title">TableColumn Definition</div>
        <PropsTable props={[
          { prop: 'key', type: 'string', required: true, description: "Key in the data object to display. Supports dot notation for nested fields (e.g. 'role.name')." },
          { prop: 'header', type: 'string', required: true, description: 'Column header label.' },
          { prop: 'width', type: 'string', description: "Optional fixed width, e.g. '120px' or '10%'." },
          { prop: 'render', type: '(value, row) => ReactNode', description: 'Custom cell renderer.' },
        ]} />
      </div>
    </div>
  )
}
