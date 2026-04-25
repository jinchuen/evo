import { useState } from 'react'
import { EvoRadio, EvoDivider } from '@justin_evo/evo-ui'
import { CodeBlock } from '../components/CodeBlock'
import { PropsTable } from '../components/PropsTable'

export default function RadioPage() {
  const [plan, setPlan] = useState('starter')
  const [size, setSize] = useState('md')

  return (
    <div>
      <div className="docs-page-header">
        <div className="docs-page-tag">Component</div>
        <h1 className="docs-page-title">EvoRadio</h1>
        <p className="docs-page-desc">
          A radio button group for single-selection. Uses context to share state between
          radio items.
        </p>
        <div className="docs-import-line">
          import {'{ '}<span>EvoRadio</span>{' }'} from '@justin_evo/evo-ui'
        </div>
      </div>

      <div className="docs-section">
        <div className="docs-section-title">Basic Group</div>
        <div className="docs-preview col">
          <EvoRadio.Group
            name="plan"
            label="Choose a plan"
            value={plan}
            onChange={setPlan}
          >
            <EvoRadio value="starter" label="Starter — Free forever" />
            <EvoRadio value="pro" label="Pro — $9/month" />
            <EvoRadio value="enterprise" label="Enterprise — Custom pricing" />
          </EvoRadio.Group>
          <p style={{ fontSize: '0.82rem', color: '#64748b' }}>Selected: <strong style={{ color: '#e2e8f0' }}>{plan}</strong></p>
        </div>
        <CodeBlock code={`const [plan, setPlan] = useState('starter')

<EvoRadio.Group name="plan" label="Choose a plan" value={plan} onChange={setPlan}>
  <EvoRadio value="starter" label="Starter — Free forever" />
  <EvoRadio value="pro" label="Pro — $9/month" />
  <EvoRadio value="enterprise" label="Enterprise — Custom pricing" />
</EvoRadio.Group>`} />
      </div>

      <div className="docs-section">
        <div className="docs-section-title">With Disabled Options</div>
        <div className="docs-preview col">
          <EvoRadio.Group name="size" label="Size" value={size} onChange={setSize}>
            <EvoRadio value="sm" label="Small" />
            <EvoRadio value="md" label="Medium" />
            <EvoRadio value="lg" label="Large" />
            <EvoRadio value="xl" label="Extra Large (unavailable)" disabled />
          </EvoRadio.Group>
        </div>
        <CodeBlock code={`<EvoRadio.Group name="size" value={size} onChange={setSize}>
  <EvoRadio value="sm" label="Small" />
  <EvoRadio value="md" label="Medium" />
  <EvoRadio value="lg" label="Large" />
  <EvoRadio value="xl" label="Extra Large" disabled />
</EvoRadio.Group>`} />
      </div>

      <EvoDivider />

      <div className="docs-section">
        <div className="docs-section-title">EvoRadio Props</div>
        <PropsTable props={[
          { prop: 'value', type: 'string', required: true, description: 'Value of this radio option.' },
          { prop: 'label', type: 'string', required: true, description: 'Label displayed next to the radio.' },
          { prop: 'disabled', type: 'boolean', default: 'false', description: 'Disables this radio option.' },
          { prop: 'className', type: 'string', description: 'Additional CSS class.' },
        ]} />
      </div>

      <div className="docs-section">
        <div className="docs-section-title">EvoRadio.Group Props</div>
        <PropsTable props={[
          { prop: 'name', type: 'string', required: true, description: 'HTML name attribute shared by all radios in the group.' },
          { prop: 'value', type: 'string', required: true, description: 'Currently selected value.' },
          { prop: 'onChange', type: '(value: string) => void', required: true, description: 'Called when selection changes.' },
          { prop: 'label', type: 'string', description: 'Group legend label.' },
          { prop: 'className', type: 'string', description: 'Additional CSS class.' },
        ]} />
      </div>
    </div>
  )
}
