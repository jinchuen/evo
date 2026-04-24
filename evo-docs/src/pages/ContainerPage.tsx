import { EvoContainer, EvoDivider } from '@justin_evo/evo-ui'
import { CodeBlock } from '../components/CodeBlock'
import { PropsTable } from '../components/PropsTable'

const sizes = ['sm', 'md', 'lg', 'xl', 'full'] as const

export default function ContainerPage() {
  return (
    <div>
      <div className="docs-page-header">
        <div className="docs-page-tag">Component</div>
        <h1 className="docs-page-title">EvoContainer</h1>
        <p className="docs-page-desc">
          A centered content wrapper with predefined max-width sizes for consistent
          page layout.
        </p>
        <div className="docs-import-line">
          import {'{ '}<span>EvoContainer</span>{' }'} from '@justin_evo/evo-ui'
        </div>
      </div>

      <div className="docs-section">
        <div className="docs-section-title">Sizes</div>
        <div className="docs-preview col" style={{ width: '100%', gap: '0.5rem' }}>
          {sizes.map((size) => (
            <div key={size} style={{ width: '100%' }}>
              <span className="docs-label">size="{size}"</span>
              <EvoContainer size={size}>
                <div style={{
                  background: 'rgba(34,211,238,0.08)',
                  border: '1px solid rgba(34,211,238,0.25)',
                  borderRadius: 6,
                  padding: '0.6rem 1rem',
                  fontSize: '0.8rem',
                  color: '#22d3ee',
                  textAlign: 'center',
                }}>
                  {size} container
                </div>
              </EvoContainer>
            </div>
          ))}
        </div>
        <CodeBlock code={`<EvoContainer size="sm">...</EvoContainer>
<EvoContainer size="md">...</EvoContainer>
<EvoContainer size="lg">...</EvoContainer>
<EvoContainer size="xl">...</EvoContainer>
<EvoContainer size="full">...</EvoContainer>`} />
      </div>

      <EvoDivider />

      <div className="docs-section">
        <div className="docs-section-title">Props</div>
        <PropsTable props={[
          { prop: 'children', type: 'ReactNode', required: true, description: 'Container content.' },
          { prop: 'size', type: "'sm' | 'md' | 'lg' | 'xl' | 'full'", default: "'lg'", description: 'Max-width preset.' },
          { prop: 'centered', type: 'boolean', default: 'true', description: 'Centers the container horizontally.' },
          { prop: 'className', type: 'string', description: 'Additional CSS class.' },
        ]} />
      </div>
    </div>
  )
}
