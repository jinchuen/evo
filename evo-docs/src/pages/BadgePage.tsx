import { useState } from 'react'
import { EvoBadge, EvoDivider } from '@justin_evo/evo-ui'
import { CodeBlock } from '../components/CodeBlock'
import { PropsTable } from '../components/PropsTable'

const severities = ['primary', 'secondary', 'success', 'warning', 'danger', 'info'] as const
const variants = ['solid', 'outline', 'subtle'] as const

export default function BadgePage() {
  const [tags, setTags] = useState(['React', 'TypeScript', 'Vite', 'CSS'])

  return (
    <div>
      <div className="docs-page-header">
        <div className="docs-page-tag">Component</div>
        <h1 className="docs-page-title">EvoBadge</h1>
        <p className="docs-page-desc">
          Compact labels for status, categories, or metadata. Supports multiple severities,
          visual variants, sizes, dot indicators, and removable state.
        </p>
        <div className="docs-import-line">
          import {'{ '}<span>EvoBadge</span>{' }'} from '@justin_evo/evo-ui'
        </div>
      </div>

      <div className="docs-section">
        <div className="docs-section-title">Severities</div>
        <div className="docs-preview">
          {severities.map((s) => (
            <EvoBadge key={s} severity={s}>{s}</EvoBadge>
          ))}
        </div>
        <CodeBlock code={`<EvoBadge severity="primary">primary</EvoBadge>
<EvoBadge severity="secondary">secondary</EvoBadge>
<EvoBadge severity="success">success</EvoBadge>
<EvoBadge severity="warning">warning</EvoBadge>
<EvoBadge severity="danger">danger</EvoBadge>
<EvoBadge severity="info">info</EvoBadge>`} />
      </div>

      <div className="docs-section">
        <div className="docs-section-title">Variants</div>
        {variants.map((v) => (
          <div key={v} className="docs-preview" style={{ marginBottom: '0.5rem' }}>
            {severities.map((s) => (
              <EvoBadge key={s} severity={s} variant={v}>{s}</EvoBadge>
            ))}
          </div>
        ))}
        <CodeBlock code={`<EvoBadge variant="solid" severity="success">solid</EvoBadge>
<EvoBadge variant="outline" severity="success">outline</EvoBadge>
<EvoBadge variant="subtle" severity="success">subtle</EvoBadge>`} />
      </div>

      <div className="docs-section">
        <div className="docs-section-title">Sizes</div>
        <div className="docs-preview">
          <EvoBadge size="sm">Small</EvoBadge>
          <EvoBadge size="md">Medium</EvoBadge>
          <EvoBadge size="lg">Large</EvoBadge>
        </div>
        <CodeBlock code={`<EvoBadge size="sm">Small</EvoBadge>
<EvoBadge size="md">Medium</EvoBadge>
<EvoBadge size="lg">Large</EvoBadge>`} />
      </div>

      <div className="docs-section">
        <div className="docs-section-title">Dot Indicator</div>
        <div className="docs-preview">
          {severities.map((s) => (
            <EvoBadge key={s} severity={s} dot>{s}</EvoBadge>
          ))}
        </div>
        <CodeBlock code={`<EvoBadge severity="success" dot>Active</EvoBadge>
<EvoBadge severity="danger" dot>Offline</EvoBadge>`} />
      </div>

      <div className="docs-section">
        <div className="docs-section-title">Removable Tags</div>
        <div className="docs-preview">
          <EvoBadge.Group>
            {tags.map((tag) => (
              <EvoBadge
                key={tag}
                severity="secondary"
                variant="outline"
                removable
                onRemove={() => setTags((t) => t.filter((x) => x !== tag))}
              >
                {tag}
              </EvoBadge>
            ))}
          </EvoBadge.Group>
        </div>
        <CodeBlock code={`const [tags, setTags] = useState(['React', 'TypeScript', 'Vite'])

<EvoBadge.Group>
  {tags.map((tag) => (
    <EvoBadge
      key={tag}
      severity="secondary"
      variant="outline"
      removable
      onRemove={() => setTags((t) => t.filter((x) => x !== tag))}
    >
      {tag}
    </EvoBadge>
  ))}
</EvoBadge.Group>`} />
      </div>

      <EvoDivider />

      <div className="docs-section">
        <div className="docs-section-title">Props</div>
        <PropsTable props={[
          { prop: 'children', type: 'ReactNode', required: true, description: 'Badge content.' },
          { prop: 'severity', type: "'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info'", default: "'primary'", description: 'Color theme.' },
          { prop: 'variant', type: "'solid' | 'outline' | 'subtle'", default: "'solid'", description: 'Visual style.' },
          { prop: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Badge size.' },
          { prop: 'dot', type: 'boolean', default: 'false', description: 'Render a dot indicator before the content.' },
          { prop: 'removable', type: 'boolean', default: 'false', description: 'Show a remove button.' },
          { prop: 'onRemove', type: '() => void', description: 'Called when the remove button is clicked.' },
          { prop: 'className', type: 'string', description: 'Additional CSS class.' },
        ]} />
      </div>
    </div>
  )
}
