import { useState } from 'react'
import { EvoSelect, EvoDivider } from '@justin_evo/evo-ui'
import { CodeBlock } from '../components/CodeBlock'
import { PropsTable } from '../components/PropsTable'

const countries = [
  { value: 'us', label: 'United States' },
  { value: 'uk', label: 'United Kingdom' },
  { value: 'ca', label: 'Canada' },
  { value: 'au', label: 'Australia' },
  { value: 'de', label: 'Germany' },
]

const roleOptions = [
  { value: 'admin', label: 'Admin' },
  { value: 'editor', label: 'Editor' },
  { value: 'viewer', label: 'Viewer' },
  { value: 'guest', label: 'Guest', disabled: true },
]

export default function SelectPage() {
  const [country, setCountry] = useState('')
  const [role, setRole] = useState('')

  return (
    <div>
      <div className="docs-page-header">
        <div className="docs-page-tag">Component</div>
        <h1 className="docs-page-title">EvoSelect</h1>
        <p className="docs-page-desc">
          A styled select dropdown with label, placeholder, helper text, error state,
          and support for disabled options.
        </p>
        <div className="docs-import-line">
          import {'{ '}<span>EvoSelect</span>{' }'} from '@justin_evo/evo-ui'
        </div>
      </div>

      <div className="docs-section">
        <div className="docs-section-title">Basic</div>
        <div className="docs-preview col">
          <EvoSelect
            label="Country"
            options={countries}
            placeholder="Select a country"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
          />
          <p style={{ fontSize: '0.82rem', color: '#64748b' }}>Selected: <strong style={{ color: '#e2e8f0' }}>{country || 'none'}</strong></p>
        </div>
        <CodeBlock code={`const options = [
  { value: 'us', label: 'United States' },
  { value: 'uk', label: 'United Kingdom' },
]

<EvoSelect
  label="Country"
  options={options}
  placeholder="Select a country"
  value={country}
  onChange={(e) => setCountry(e.target.value)}
/>`} />
      </div>

      <div className="docs-section">
        <div className="docs-section-title">With Disabled Options & Error</div>
        <div className="docs-preview col">
          <EvoSelect
            label="Role"
            options={roleOptions}
            placeholder="Choose a role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            error={!role ? 'Please select a role to continue.' : undefined}
          />
        </div>
        <CodeBlock code={`const options = [
  { value: 'admin', label: 'Admin' },
  { value: 'guest', label: 'Guest', disabled: true },
]

<EvoSelect
  label="Role"
  options={options}
  error="Please select a role."
/>`} />
      </div>

      <div className="docs-section">
        <div className="docs-section-title">Sizes</div>
        <div className="docs-preview col">
          <EvoSelect size="sm" options={countries} placeholder="Small" />
          <EvoSelect size="md" options={countries} placeholder="Medium" />
          <EvoSelect size="lg" options={countries} placeholder="Large" />
        </div>
        <CodeBlock code={`<EvoSelect size="sm" options={options} placeholder="Small" />
<EvoSelect size="md" options={options} placeholder="Medium" />
<EvoSelect size="lg" options={options} placeholder="Large" />`} />
      </div>

      <EvoDivider />

      <div className="docs-section">
        <div className="docs-section-title">Props</div>
        <PropsTable props={[
          { prop: 'options', type: 'SelectOption[]', required: true, description: 'Array of { value, label, disabled? } objects.' },
          { prop: 'label', type: 'string', description: 'Label above the select.' },
          { prop: 'placeholder', type: 'string', description: 'Placeholder option text when no value is selected.' },
          { prop: 'helperText', type: 'string', description: 'Helper text below the select.' },
          { prop: 'error', type: 'string', description: 'Error message (shown in red).' },
          { prop: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Select size.' },
          { prop: 'fullWidth', type: 'boolean', default: 'false', description: 'Stretch to container width.' },
          { prop: '...rest', type: 'SelectHTMLAttributes', description: 'All native select attributes (value, onChange, disabled, etc.)' },
        ]} />
      </div>
    </div>
  )
}
