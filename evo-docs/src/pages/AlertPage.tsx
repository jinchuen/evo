import { EvoAlert, EvoDivider } from '@justin_evo/evo-ui'
import { CodeBlock } from '../components/CodeBlock'
import { PropsTable } from '../components/PropsTable'

export default function AlertPage() {
  return (
    <div>
      <div className="docs-page-header">
        <div className="docs-page-tag">Component</div>
        <h1 className="docs-page-title">EvoAlert</h1>
        <p className="docs-page-desc">
          Contextual feedback messages with automatic icons. Supports title, dismissible state,
          and four semantic types.
        </p>
        <div className="docs-import-line">
          import {'{ '}<span>EvoAlert</span>{' }'} from '@justin_evo/evo-ui'
        </div>
      </div>

      <div className="docs-section">
        <div className="docs-section-title">Types</div>
        <div className="docs-preview col" style={{ width: '100%' }}>
          <EvoAlert type="info">This is an informational message.</EvoAlert>
          <EvoAlert type="success">Your changes have been saved successfully.</EvoAlert>
          <EvoAlert type="warning">Your session will expire in 5 minutes.</EvoAlert>
          <EvoAlert type="error">Failed to connect to the server. Please try again.</EvoAlert>
        </div>
        <CodeBlock code={`<EvoAlert type="info">This is an informational message.</EvoAlert>
<EvoAlert type="success">Your changes have been saved.</EvoAlert>
<EvoAlert type="warning">Your session will expire soon.</EvoAlert>
<EvoAlert type="error">Failed to connect to the server.</EvoAlert>`} />
      </div>

      <div className="docs-section">
        <div className="docs-section-title">With Title</div>
        <div className="docs-preview col" style={{ width: '100%' }}>
          <EvoAlert type="success" title="Payment received">
            Your invoice has been paid. A receipt has been sent to your email.
          </EvoAlert>
          <EvoAlert type="error" title="Authentication failed">
            Invalid credentials. Please check your email and password and try again.
          </EvoAlert>
        </div>
        <CodeBlock code={`<EvoAlert type="success" title="Payment received">
  Your invoice has been paid.
</EvoAlert>
<EvoAlert type="error" title="Authentication failed">
  Invalid credentials.
</EvoAlert>`} />
      </div>

      <div className="docs-section">
        <div className="docs-section-title">Dismissible</div>
        <div className="docs-preview col" style={{ width: '100%' }}>
          <EvoAlert type="info" title="New features available" dismissible>
            We've shipped new components. Check out the changelog for details.
          </EvoAlert>
          <EvoAlert type="warning" dismissible>
            You have unsaved changes. Don't forget to save before leaving.
          </EvoAlert>
        </div>
        <CodeBlock code={`<EvoAlert type="info" title="New features available" dismissible>
  We've shipped new components.
</EvoAlert>`} />
      </div>

      <EvoDivider />

      <div className="docs-section">
        <div className="docs-section-title">Props</div>
        <PropsTable props={[
          { prop: 'children', type: 'ReactNode', required: true, description: 'Alert body message.' },
          { prop: 'type', type: "'success' | 'error' | 'warning' | 'info'", default: "'info'", description: 'Semantic type. Determines icon and color.' },
          { prop: 'title', type: 'string', description: 'Bold title rendered above the message.' },
          { prop: 'dismissible', type: 'boolean', default: 'false', description: 'Shows a dismiss button that hides the alert.' },
          { prop: 'className', type: 'string', description: 'Additional CSS class.' },
        ]} />
      </div>
    </div>
  )
}
