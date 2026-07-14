import { EvoDivider } from '@justin_evo/evo-ui'
import { CodeBlock } from '../components/CodeBlock'
import { PropsTable } from '../components/PropsTable'

export default function DividerPage() {
  return (
    <div>
      <div className="docs-page-header">
        <div className="docs-page-tag">Component</div>
        <h1 className="docs-page-title">EvoDivider</h1>
        <p className="docs-page-desc">
          A visual separator for horizontal or vertical layouts. Supports an optional
          centered label.
        </p>
        <div className="docs-import-line">
          import {'{ '}<span>EvoDivider</span>{' }'} from '@justin_evo/evo-ui'
        </div>
      </div>

      <div className="docs-section">
        <div className="docs-section-title">Horizontal</div>
        <div className="docs-preview col" style={{ width: '100%' }}>
          <p style={{ color: 'var(--docs-text-muted)', margin: 0, fontSize: '0.85rem' }}>Content above</p>
          <EvoDivider />
          <p style={{ color: 'var(--docs-text-muted)', margin: 0, fontSize: '0.85rem' }}>Content below</p>
        </div>
        <CodeBlock code={`<p>Content above</p>
<EvoDivider />
<p>Content below</p>`} />
      </div>

      <div className="docs-section">
        <div className="docs-section-title">With Label</div>
        <div className="docs-preview col" style={{ width: '100%' }}>
          <EvoDivider label="OR" />
          <EvoDivider label="Section Two" />
          <EvoDivider label="Continue" />
        </div>
        <CodeBlock code={`<EvoDivider label="OR" />
<EvoDivider label="Section Two" />
<EvoDivider label="Continue" />`} />
      </div>

      <div className="docs-section">
        <div className="docs-section-title">Vertical</div>
        <div className="docs-preview" style={{ height: 80, alignItems: 'center' }}>
          <span style={{ color: 'var(--docs-text-muted)', fontSize: '0.85rem' }}>Left</span>
          <EvoDivider orientation="vertical" />
          <span style={{ color: 'var(--docs-text-muted)', fontSize: '0.85rem' }}>Center</span>
          <EvoDivider orientation="vertical" />
          <span style={{ color: 'var(--docs-text-muted)', fontSize: '0.85rem' }}>Right</span>
        </div>
        <CodeBlock code={`<div style={{ display: 'flex', alignItems: 'center', height: 80 }}>
  <span>Left</span>
  <EvoDivider orientation="vertical" />
  <span>Center</span>
  <EvoDivider orientation="vertical" />
  <span>Right</span>
</div>`} />
      </div>

      <EvoDivider />

      <div className="docs-section">
        <div className="docs-section-title">Props</div>
        <PropsTable props={[
          { prop: 'orientation', type: "'horizontal' | 'vertical'", default: "'horizontal'", description: 'Direction of the divider.' },
          { prop: 'label', type: 'string', description: 'Optional text centered in the divider (horizontal only).' },
          { prop: 'className', type: 'string', description: 'Additional CSS class.' },
          { prop: '...rest', type: 'React.HTMLAttributes<HTMLDivElement>', description: 'All other native div attributes (id, style, aria-*, data-*, …) are forwarded to the root element.' },
        ]} />
        <p className="docs-section-desc">
          <code>EvoDivider</code> forwards a <code>ref</code> to its root <code>div</code>.
        </p>
      </div>

      <div className="docs-section">
        <div className="docs-section-title">Accessibility</div>
        <ul className="docs-list">
          <li>The root element has <code>role="separator"</code>.</li>
          <li>
            When <code>orientation="vertical"</code>, <code>aria-orientation="vertical"</code> is set
            automatically (horizontal is the ARIA default, so no attribute is needed).
          </li>
          <li>
            The labeled variant applies <code>aria-label</code> (from the <code>label</code> prop) to the
            outer <code>role="separator"</code> container, and marks its two decorative line segments with
            <code> aria-hidden="true"</code> so assistive tech doesn't announce them.
          </li>
        </ul>
      </div>
    </div>
  )
}
