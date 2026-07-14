import { EvoAlert, EvoDivider, EvoCountdown } from '@justin_evo/evo-ui'
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

      <div className="docs-section">
        <div className="docs-section-title">Urgency (loss aversion)</div>
        <p className="docs-section-desc">
          Set <code>urgency</code> to escalate a <code>warning</code> or <code>error</code> alert
          (or any type) into a higher-attention treatment — a filled soft background, a heavier
          left accent, and a bolder title. It composes with <code>type</code> rather than
          replacing it, so any severity can be urgent or not. Pairing it with{' '}
          <code>EvoCountdown</code> makes the cost of inaction concrete: the shrinking number
          reinforces what's about to be lost.
        </p>
        <div className="docs-preview col" style={{ width: '100%' }}>
          <EvoAlert type="warning" title="Discount expires soon" urgency>
            Your 20% renewal discount expires in{' '}
            <EvoCountdown deadline={Date.now() + 47 * 60 * 60 * 1000} />. Renew now to keep it.
          </EvoAlert>
          <EvoAlert type="error" title="Trial ending" urgency dismissible>
            Your workspace will be downgraded and your data archived in{' '}
            <EvoCountdown deadline={Date.now() + 6 * 60 * 1000} format="clock" />.
          </EvoAlert>
        </div>
        <CodeBlock code={`<EvoAlert type="warning" title="Discount expires soon" urgency>
  Your 20% renewal discount expires in{' '}
  <EvoCountdown deadline={Date.now() + 47 * 60 * 60 * 1000} />. Renew now to keep it.
</EvoAlert>

<EvoAlert type="error" title="Trial ending" urgency dismissible>
  Your workspace will be downgraded and your data archived in{' '}
  <EvoCountdown deadline={Date.now() + 6 * 60 * 1000} format="clock" />.
</EvoAlert>`} />
        <ul className="docs-list">
          <li>Use urgency sparingly — reserve it for messages with a real deadline or real cost, not every warning.</li>
          <li>It never introduces a new color; it only intensifies the existing severity token, so dark mode stays correct automatically.</li>
        </ul>
      </div>

      <EvoDivider />

      <div className="docs-section">
        <div className="docs-section-title">Props</div>
        <PropsTable props={[
          { prop: 'children', type: 'ReactNode', required: true, description: 'Alert body message.' },
          { prop: 'type', type: "'success' | 'error' | 'warning' | 'info'", default: "'info'", description: 'Semantic type. Determines icon and color.' },
          { prop: 'title', type: 'string', description: 'Bold title rendered above the message.' },
          { prop: 'dismissible', type: 'boolean', default: 'false', description: 'Shows a dismiss button that hides the alert.' },
          { prop: 'urgency', type: 'boolean', default: 'false', description: 'Escalates the severity treatment (filled soft background, heavier left accent, bolder title) for higher-attention messages. Orthogonal to type.' },
          { prop: 'className', type: 'string', description: 'Additional CSS class.' },
        ]} />
      </div>
    </div>
  )
}
