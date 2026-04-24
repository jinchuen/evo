import { useState } from 'react'
import { EvoCheckbox, EvoDivider } from '@justin_evo/evo-ui'
import { CodeBlock } from '../components/CodeBlock'
import { PropsTable } from '../components/PropsTable'

export default function CheckboxPage() {
  const [checked, setChecked] = useState(false)
  const [items, setItems] = useState({ a: true, b: false, c: true })

  const allChecked = Object.values(items).every(Boolean)
  const someChecked = Object.values(items).some(Boolean) && !allChecked

  const toggleAll = () => {
    const next = !allChecked
    setItems({ a: next, b: next, c: next })
  }

  return (
    <div>
      <div className="docs-page-header">
        <div className="docs-page-tag">Component</div>
        <h1 className="docs-page-title">EvoCheckbox</h1>
        <p className="docs-page-desc">
          A styled checkbox with label, helper text, indeterminate state, and group support.
        </p>
        <div className="docs-import-line">
          import {'{ '}<span>EvoCheckbox</span>{' }'} from '@justin_evo/evo-ui'
        </div>
      </div>

      <div className="docs-section">
        <div className="docs-section-title">Basic</div>
        <div className="docs-preview col">
          <EvoCheckbox label="Uncontrolled checkbox" />
          <EvoCheckbox
            label="Controlled checkbox"
            checked={checked}
            onChange={(e) => setChecked(e.target.checked)}
          />
        </div>
        <CodeBlock code={`const [checked, setChecked] = useState(false)

<EvoCheckbox
  label="Controlled checkbox"
  checked={checked}
  onChange={(e) => setChecked(e.target.checked)}
/>`} />
      </div>

      <div className="docs-section">
        <div className="docs-section-title">Indeterminate</div>
        <div className="docs-preview col">
          <EvoCheckbox
            label="Select all"
            checked={allChecked}
            indeterminate={someChecked}
            onChange={toggleAll}
          />
          <div style={{ paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            {(['a', 'b', 'c'] as const).map((key) => (
              <EvoCheckbox
                key={key}
                label={`Option ${key.toUpperCase()}`}
                checked={items[key]}
                onChange={(e) => setItems((p) => ({ ...p, [key]: e.target.checked }))}
              />
            ))}
          </div>
        </div>
        <CodeBlock code={`<EvoCheckbox
  label="Select all"
  checked={allChecked}
  indeterminate={someChecked}
  onChange={toggleAll}
/>`} />
      </div>

      <div className="docs-section">
        <div className="docs-section-title">With Helper Text & Disabled</div>
        <div className="docs-preview col">
          <EvoCheckbox label="I agree to the terms" helperText="Required to continue." />
          <EvoCheckbox label="Disabled unchecked" disabled />
          <EvoCheckbox label="Disabled checked" disabled checked />
        </div>
        <CodeBlock code={`<EvoCheckbox label="Agree" helperText="Required to continue." />
<EvoCheckbox label="Disabled" disabled />
<EvoCheckbox label="Disabled checked" disabled checked />`} />
      </div>

      <div className="docs-section">
        <div className="docs-section-title">Checkbox Group</div>
        <div className="docs-preview col">
          <EvoCheckbox.Group label="Preferred contact">
            <EvoCheckbox label="Email" defaultChecked />
            <EvoCheckbox label="Phone" />
            <EvoCheckbox label="SMS" />
          </EvoCheckbox.Group>
        </div>
        <CodeBlock code={`<EvoCheckbox.Group label="Preferred contact">
  <EvoCheckbox label="Email" defaultChecked />
  <EvoCheckbox label="Phone" />
  <EvoCheckbox label="SMS" />
</EvoCheckbox.Group>`} />
      </div>

      <EvoDivider />

      <div className="docs-section">
        <div className="docs-section-title">Props</div>
        <PropsTable props={[
          { prop: 'label', type: 'string', description: 'Label next to the checkbox.' },
          { prop: 'helperText', type: 'string', description: 'Helper text displayed below.' },
          { prop: 'indeterminate', type: 'boolean', default: 'false', description: 'Shows the indeterminate (dash) state.' },
          { prop: 'disabled', type: 'boolean', description: 'Disables the checkbox.' },
          { prop: '...rest', type: 'InputHTMLAttributes', description: 'All native checkbox input attributes (checked, onChange, etc.)' },
        ]} />
        <div style={{ marginTop: '1rem' }}>
          <PropsTable props={[
            { prop: 'EvoCheckbox.Group — label', type: 'string', description: 'Group legend label.' },
            { prop: 'EvoCheckbox.Group — children', type: 'ReactNode', required: true, description: 'EvoCheckbox elements.' },
            { prop: 'EvoCheckbox.Group — className', type: 'string', description: 'Additional CSS class.' },
          ]} />
        </div>
      </div>
    </div>
  )
}
