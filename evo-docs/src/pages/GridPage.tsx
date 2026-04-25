import { EvoGrid, EvoDivider } from '@justin_evo/evo-ui'
import { CodeBlock } from '../components/CodeBlock'
import { PropsTable } from '../components/PropsTable'

const Cell = ({ children, span }: { children: React.ReactNode; span?: number }) => (
  <EvoGrid.Item colSpan={span}>
    <div style={{
      background: 'rgba(34,211,238,0.08)',
      border: '1px solid rgba(34,211,238,0.25)',
      borderRadius: 6,
      padding: '0.75rem 1rem',
      textAlign: 'center',
      fontSize: '0.8rem',
      color: '#22d3ee',
      fontWeight: 600,
    }}>
      {children}
    </div>
  </EvoGrid.Item>
)

export default function GridPage() {
  return (
    <div>
      <div className="docs-page-header">
        <div className="docs-page-tag">Component</div>
        <h1 className="docs-page-title">EvoGrid</h1>
        <p className="docs-page-desc">
          A CSS Grid layout component. Configure columns, rows, and gaps. Use EvoGrid.Item
          to control column/row spanning.
        </p>
        <div className="docs-import-line">
          import {'{ '}<span>EvoGrid</span>{' }'} from '@justin_evo/evo-ui'
        </div>
      </div>

      <div className="docs-section">
        <div className="docs-section-title">3-Column Grid</div>
        <div className="docs-preview col" style={{ width: '100%' }}>
          <EvoGrid cols={3} gap="0.75rem">
            {Array.from({ length: 6 }, (_, i) => (
              <Cell key={i}>Cell {i + 1}</Cell>
            ))}
          </EvoGrid>
        </div>
        <CodeBlock code={`<EvoGrid cols={3} gap="0.75rem">
  <EvoGrid.Item><div>Cell 1</div></EvoGrid.Item>
  <EvoGrid.Item><div>Cell 2</div></EvoGrid.Item>
  {/* ... */}
</EvoGrid>`} />
      </div>

      <div className="docs-section">
        <div className="docs-section-title">Column Spanning</div>
        <div className="docs-preview col" style={{ width: '100%' }}>
          <EvoGrid cols={4} gap="0.75rem">
            <Cell span={2}>Span 2</Cell>
            <Cell>Col 3</Cell>
            <Cell>Col 4</Cell>
            <Cell>Col 1</Cell>
            <Cell span={3}>Span 3</Cell>
          </EvoGrid>
        </div>
        <CodeBlock code={`<EvoGrid cols={4} gap="0.75rem">
  <EvoGrid.Item colSpan={2}><div>Span 2</div></EvoGrid.Item>
  <EvoGrid.Item><div>Col 3</div></EvoGrid.Item>
  <EvoGrid.Item><div>Col 4</div></EvoGrid.Item>
  <EvoGrid.Item><div>Col 1</div></EvoGrid.Item>
  <EvoGrid.Item colSpan={3}><div>Span 3</div></EvoGrid.Item>
</EvoGrid>`} />
      </div>

      <div className="docs-section">
        <div className="docs-section-title">Custom Template</div>
        <div className="docs-preview col" style={{ width: '100%' }}>
          <EvoGrid cols="1fr 2fr 1fr" gap="0.75rem">
            <Cell>1fr</Cell>
            <Cell>2fr</Cell>
            <Cell>1fr</Cell>
          </EvoGrid>
        </div>
        <CodeBlock code={`<EvoGrid cols="1fr 2fr 1fr" gap="0.75rem">
  {/* ... */}
</EvoGrid>`} />
      </div>

      <EvoDivider />

      <div className="docs-section">
        <div className="docs-section-title">EvoGrid Props</div>
        <PropsTable props={[
          { prop: 'children', type: 'ReactNode', required: true, description: 'Grid children (typically EvoGrid.Item elements).' },
          { prop: 'cols', type: 'number | string', default: '3', description: 'Number of columns or a CSS grid-template-columns value.' },
          { prop: 'rows', type: 'number | string', description: 'Number of rows or CSS grid-template-rows value.' },
          { prop: 'gap', type: 'number | string', default: "'1rem'", description: 'Gap between cells.' },
          { prop: 'colGap', type: 'number | string', description: 'Column gap override.' },
          { prop: 'rowGap', type: 'number | string', description: 'Row gap override.' },
          { prop: 'className', type: 'string', description: 'Additional CSS class.' },
          { prop: 'style', type: 'CSSProperties', description: 'Inline styles.' },
        ]} />
      </div>

      <div className="docs-section">
        <div className="docs-section-title">EvoGrid.Item Props</div>
        <PropsTable props={[
          { prop: 'children', type: 'ReactNode', required: true, description: 'Item content.' },
          { prop: 'colSpan', type: 'number', description: 'Number of columns to span.' },
          { prop: 'rowSpan', type: 'number', description: 'Number of rows to span.' },
          { prop: 'className', type: 'string', description: 'Additional CSS class.' },
          { prop: 'style', type: 'CSSProperties', description: 'Inline styles.' },
        ]} />
      </div>
    </div>
  )
}
