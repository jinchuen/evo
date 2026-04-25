import { EvoButton, EvoDivider } from '@justin_evo/evo-ui'
import { CodeBlock } from '../components/CodeBlock'
import { PropsTable } from '../components/PropsTable'

export default function ButtonPage() {
  return (
    <div>
      <div className="docs-page-header">
        <div className="docs-page-tag">Component</div>
        <h1 className="docs-page-title">EvoButton</h1>
        <p className="docs-page-desc">
          Triggers actions or navigation. Supports multiple visual variants, semantic severities,
          and sizes.
        </p>
        <div className="docs-import-line">
          import {'{ '}<span>EvoButton</span>{' }'} from '@justin_evo/evo-ui'
        </div>
      </div>

      <div className="docs-section">
        <div className="docs-section-title">Variants</div>
        <div className="docs-preview">
          <EvoButton label="Solid" variant="solid" />
          <EvoButton label="Outline" variant="outline" />
          <EvoButton label="Ghost" variant="ghost" />
          <EvoButton label="Rounded" variant="rounded" />
        </div>
        <CodeBlock code={`<EvoButton label="Solid" variant="solid" />
<EvoButton label="Outline" variant="outline" />
<EvoButton label="Ghost" variant="ghost" />
<EvoButton label="Rounded" variant="rounded" />`} />
      </div>

      <div className="docs-section">
        <div className="docs-section-title">Severities</div>
        <div className="docs-preview">
          <EvoButton label="Primary" severity="primary" />
          <EvoButton label="Secondary" severity="secondary" />
          <EvoButton label="Danger" severity="danger" />
          <EvoButton label="Warning" severity="warning" />
          <EvoButton label="Success" severity="success" />
          <EvoButton label="Info" severity="info" />
        </div>
        <CodeBlock code={`<EvoButton label="Primary" severity="primary" />
<EvoButton label="Secondary" severity="secondary" />
<EvoButton label="Danger" severity="danger" />
<EvoButton label="Warning" severity="warning" />
<EvoButton label="Success" severity="success" />
<EvoButton label="Info" severity="info" />`} />
      </div>

      <div className="docs-section">
        <div className="docs-section-title">Sizes</div>
        <div className="docs-preview">
          <EvoButton label="Small" size="sm" />
          <EvoButton label="Medium" size="md" />
          <EvoButton label="Large" size="lg" />
        </div>
        <CodeBlock code={`<EvoButton label="Small" size="sm" />
<EvoButton label="Medium" size="md" />
<EvoButton label="Large" size="lg" />`} />
      </div>

      <div className="docs-section">
        <div className="docs-section-title">Disabled</div>
        <div className="docs-preview">
          <EvoButton label="Disabled Solid" disabled />
          <EvoButton label="Disabled Outline" variant="outline" disabled />
          <EvoButton label="Disabled Ghost" variant="ghost" disabled />
        </div>
        <CodeBlock code={`<EvoButton label="Disabled" disabled />`} />
      </div>

      <EvoDivider className="docs-section" />

      <div className="docs-section">
        <div className="docs-section-title">Props</div>
        <PropsTable props={[
          { prop: 'label', type: 'string', required: true, description: 'Text displayed inside the button.' },
          { prop: 'variant', type: "'solid' | 'outline' | 'ghost' | 'rounded'", default: "'solid'", description: 'Visual style of the button.' },
          { prop: 'severity', type: "'primary' | 'secondary' | 'danger' | 'warning' | 'success' | 'info'", default: "'primary'", description: 'Semantic color theme.' },
          { prop: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Size of the button.' },
          { prop: 'disabled', type: 'boolean', default: 'false', description: 'Disables the button.' },
          { prop: 'onClick', type: '() => void', description: 'Click event handler.' },
        ]} />
      </div>
    </div>
  )
}
