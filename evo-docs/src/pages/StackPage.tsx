import { EvoStack, EvoDivider } from '@justin_evo/evo-ui'
import { CodeBlock } from '../components/CodeBlock'
import { PropsTable } from '../components/PropsTable'

const Box = ({ children, color = 'var(--docs-accent)' }: { children: React.ReactNode; color?: string }) => (
  <div style={{
    background: `${color}18`,
    border: `1px solid ${color}40`,
    borderRadius: 6,
    padding: '0.6rem 1rem',
    fontSize: '0.8rem',
    color,
    fontWeight: 600,
    whiteSpace: 'nowrap',
  }}>
    {children}
  </div>
)

export default function StackPage() {
  return (
    <div>
      <div className="docs-page-header">
        <div className="docs-page-tag">Component</div>
        <h1 className="docs-page-title">EvoStack</h1>
        <p className="docs-page-desc">
          A flexbox layout primitive for stacking elements horizontally or vertically
          with configurable gap, alignment, and justification.
        </p>
        <div className="docs-import-line">
          import {'{ '}<span>EvoStack</span>{' }'} from '@justin_evo/evo-ui'
        </div>
      </div>

      <div className="docs-section">
        <div className="docs-section-title">Column (default)</div>
        <div className="docs-preview col">
          <EvoStack direction="column" gap="0.75rem">
            <Box>Item 1</Box>
            <Box>Item 2</Box>
            <Box>Item 3</Box>
          </EvoStack>
        </div>
        <CodeBlock code={`<EvoStack direction="column" gap="0.75rem">
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</EvoStack>`} />
      </div>

      <div className="docs-section">
        <div className="docs-section-title">Row</div>
        <div className="docs-preview">
          <EvoStack direction="row" gap="0.75rem">
            <Box>Item 1</Box>
            <Box>Item 2</Box>
            <Box>Item 3</Box>
          </EvoStack>
        </div>
        <CodeBlock code={`<EvoStack direction="row" gap="0.75rem">
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</EvoStack>`} />
      </div>

      <div className="docs-section">
        <div className="docs-section-title">Justify & Align</div>
        <div className="docs-preview col" style={{ width: '100%' }}>
          {(['start', 'center', 'end', 'between'] as const).map((j) => (
            <div key={j} style={{ width: '100%' }}>
              <span className="docs-label">justify="{j}"</span>
              <EvoStack direction="row" justify={j} gap="0.5rem" style={{ width: '100%', background: 'var(--docs-code-bg)', borderRadius: 6, padding: '0.5rem' }}>
                <Box>A</Box>
                <Box>B</Box>
                <Box>C</Box>
              </EvoStack>
            </div>
          ))}
        </div>
        <CodeBlock code={`<EvoStack direction="row" justify="start">...</EvoStack>
<EvoStack direction="row" justify="center">...</EvoStack>
<EvoStack direction="row" justify="end">...</EvoStack>
<EvoStack direction="row" justify="between">...</EvoStack>`} />
      </div>

      <EvoDivider />

      <div className="docs-section">
        <div className="docs-section-title">Props</div>
        <PropsTable props={[
          { prop: 'children', type: 'ReactNode', required: true, description: 'Stack children.' },
          { prop: 'direction', type: "'row' | 'column'", default: "'column'", description: 'Flex direction.' },
          { prop: 'gap', type: 'number | string', default: "'1rem'", description: 'Gap between items (any CSS value).' },
          { prop: 'align', type: "'start' | 'center' | 'end' | 'stretch' | 'baseline'", default: "'stretch'", description: 'align-items value.' },
          { prop: 'justify', type: "'start' | 'center' | 'end' | 'between' | 'around' | 'evenly'", default: "'start'", description: 'justify-content value.' },
          { prop: 'wrap', type: 'boolean', default: 'false', description: 'Enable flex-wrap.' },
          { prop: 'className', type: 'string', description: 'Additional CSS class.' },
          { prop: 'style', type: 'CSSProperties', description: 'Inline styles.' },
        ]} />
      </div>
    </div>
  )
}
