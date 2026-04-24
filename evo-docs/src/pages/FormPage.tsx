import { useState } from 'react'
import {
  EvoForm, EvoInput, EvoSelect, EvoCheckbox, EvoToggle,
  EvoButton, EvoAlert, EvoDivider,
} from '@justin_evo/evo-ui'
import { CodeBlock } from '../components/CodeBlock'
import { PropsTable } from '../components/PropsTable'

export default function FormPage() {
  const [submitted, setSubmitted] = useState(false)
  const [disabled, setDisabled] = useState(false)

  return (
    <div>
      <div className="docs-page-header">
        <div className="docs-page-tag">Component</div>
        <h1 className="docs-page-title">EvoForm</h1>
        <p className="docs-page-desc">
          A form wrapper that provides a disabled context to all child inputs via
          EvoForm.Field. Use the useFormContext hook to read the disabled state.
        </p>
        <div className="docs-import-line">
          import {'{ '}<span>EvoForm</span>{' }'} from '@justin_evo/evo-ui'
        </div>
      </div>

      <div className="docs-section">
        <div className="docs-section-title">Complete Form Example</div>
        <div className="docs-preview col" style={{ width: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
            <EvoToggle checked={disabled} onChange={setDisabled} label="Disable entire form" size="sm" />
          </div>
          {submitted && (
            <EvoAlert type="success" title="Form submitted" dismissible>
              Your information has been saved.
            </EvoAlert>
          )}
          <EvoForm
            disabled={disabled}
            onSubmit={(e) => {
              e.preventDefault()
              setSubmitted(true)
              setTimeout(() => setSubmitted(false), 3000)
            }}
            style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%', maxWidth: 480 }}
          >
            <EvoForm.Field>
              <EvoInput label="Full name" placeholder="Jane Smith" fullWidth />
            </EvoForm.Field>
            <EvoForm.Field>
              <EvoInput label="Email address" type="email" placeholder="jane@example.com" fullWidth />
            </EvoForm.Field>
            <EvoForm.Field>
              <EvoSelect
                label="Role"
                options={[
                  { value: 'dev', label: 'Developer' },
                  { value: 'design', label: 'Designer' },
                  { value: 'pm', label: 'Product Manager' },
                ]}
                placeholder="Select a role"
                fullWidth
              />
            </EvoForm.Field>
            <EvoForm.Field>
              <EvoCheckbox label="Subscribe to newsletter" />
            </EvoForm.Field>
            <EvoButton label="Submit" onClick={() => {}} />
          </EvoForm>
        </div>
        <CodeBlock code={`<EvoForm onSubmit={handleSubmit} disabled={loading}>
  <EvoForm.Field>
    <EvoInput label="Full name" placeholder="Jane Smith" fullWidth />
  </EvoForm.Field>
  <EvoForm.Field>
    <EvoInput label="Email" type="email" fullWidth />
  </EvoForm.Field>
  <EvoForm.Field>
    <EvoSelect label="Role" options={roles} fullWidth />
  </EvoForm.Field>
  <EvoForm.Field>
    <EvoCheckbox label="Subscribe to newsletter" />
  </EvoForm.Field>
  <EvoButton label="Submit" type="submit" />
</EvoForm>`} />
      </div>

      <EvoDivider />

      <div className="docs-section">
        <div className="docs-section-title">Props</div>
        <PropsTable props={[
          { prop: 'disabled', type: 'boolean', default: 'false', description: 'Disables all child form inputs via context.' },
          { prop: 'children', type: 'ReactNode', required: true, description: 'Form content.' },
          { prop: 'className', type: 'string', description: 'Additional CSS class.' },
          { prop: '...rest', type: 'FormHTMLAttributes', description: 'All native form attributes (onSubmit, action, etc.)' },
        ]} />
      </div>
    </div>
  )
}
