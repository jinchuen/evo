import { EvoBreadcrumb, EvoDivider } from '@justin_evo/evo-ui'
import { CodeBlock } from '../components/CodeBlock'
import { PropsTable } from '../components/PropsTable'

export default function BreadcrumbPage() {
  return (
    <div>
      <div className="docs-page-header">
        <div className="docs-page-tag">Component</div>
        <h1 className="docs-page-title">EvoBreadcrumb</h1>
        <p className="docs-page-desc">
          A trail of navigational links showing the user's location in an app hierarchy.
          Semantic nav with aria-label and aria-current support.
        </p>
        <div className="docs-import-line">
          import {'{ '}<span>EvoBreadcrumb</span>{' }'} from '@justin_evo/evo-ui'
        </div>
      </div>

      <div className="docs-section">
        <div className="docs-section-title">Basic</div>
        <div className="docs-preview">
          <EvoBreadcrumb>
            <EvoBreadcrumb.Item href="#">Home</EvoBreadcrumb.Item>
            <EvoBreadcrumb.Item href="#">Components</EvoBreadcrumb.Item>
            <EvoBreadcrumb.Item current>Breadcrumb</EvoBreadcrumb.Item>
          </EvoBreadcrumb>
        </div>
        <CodeBlock code={`<EvoBreadcrumb>
  <EvoBreadcrumb.Item href="/">Home</EvoBreadcrumb.Item>
  <EvoBreadcrumb.Item href="/components">Components</EvoBreadcrumb.Item>
  <EvoBreadcrumb.Item current>Breadcrumb</EvoBreadcrumb.Item>
</EvoBreadcrumb>`} />
      </div>

      <div className="docs-section">
        <div className="docs-section-title">Custom Separator</div>
        <div className="docs-preview col">
          <EvoBreadcrumb separator="›">
            <EvoBreadcrumb.Item href="#">Home</EvoBreadcrumb.Item>
            <EvoBreadcrumb.Item href="#">Settings</EvoBreadcrumb.Item>
            <EvoBreadcrumb.Item current>Profile</EvoBreadcrumb.Item>
          </EvoBreadcrumb>
          <EvoBreadcrumb separator="→">
            <EvoBreadcrumb.Item href="#">Docs</EvoBreadcrumb.Item>
            <EvoBreadcrumb.Item href="#">API</EvoBreadcrumb.Item>
            <EvoBreadcrumb.Item current>EvoButton</EvoBreadcrumb.Item>
          </EvoBreadcrumb>
          <EvoBreadcrumb separator={<span style={{ color: '#64748b' }}>•</span>}>
            <EvoBreadcrumb.Item href="#">Blog</EvoBreadcrumb.Item>
            <EvoBreadcrumb.Item href="#">2024</EvoBreadcrumb.Item>
            <EvoBreadcrumb.Item current>Article Title</EvoBreadcrumb.Item>
          </EvoBreadcrumb>
        </div>
        <CodeBlock code={`<EvoBreadcrumb separator="›">...</EvoBreadcrumb>
<EvoBreadcrumb separator="→">...</EvoBreadcrumb>
<EvoBreadcrumb separator={<span>•</span>}>...</EvoBreadcrumb>`} />
      </div>

      <EvoDivider />

      <div className="docs-section">
        <div className="docs-section-title">Props</div>
        <PropsTable props={[
          { prop: 'EvoBreadcrumb — children', type: 'ReactNode', required: true, description: 'EvoBreadcrumb.Item elements.' },
          { prop: 'EvoBreadcrumb — separator', type: 'ReactNode', default: "'/'", description: 'Separator rendered between items.' },
          { prop: 'EvoBreadcrumb — className', type: 'string', description: 'Additional CSS class.' },
          { prop: 'EvoBreadcrumb.Item — children', type: 'ReactNode', required: true, description: 'Item label.' },
          { prop: 'EvoBreadcrumb.Item — href', type: 'string', description: 'Link href. Not rendered when current=true.' },
          { prop: 'EvoBreadcrumb.Item — current', type: 'boolean', default: 'false', description: 'Marks this as the current page. Adds aria-current="page" and disables the link.' },
        ]} />
      </div>
    </div>
  )
}
