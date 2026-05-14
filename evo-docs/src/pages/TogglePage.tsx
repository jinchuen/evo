import { useState } from 'react'
import { EvoToggle, EvoDivider } from '@justin_evo/evo-ui'
import { CodeBlock } from '../components/CodeBlock'
import { PropsTable } from '../components/PropsTable'

export default function TogglePage() {
  const [on, setOn] = useState(false)
  const [notifications, setNotifications] = useState(true)
  const [darkMode, setDarkMode] = useState(false)

  return (
    <div>
      <div className="docs-page-header">
        <div className="docs-page-tag">Component</div>
        <h1 className="docs-page-title">EvoToggle</h1>
        <p className="docs-page-desc">
          A switch toggle for boolean settings. Fully controlled with label and size support.
        </p>
        <div className="docs-import-line">
          import {'{ '}<span>EvoToggle</span>{' }'} from '@justin_evo/evo-ui'
        </div>
      </div>

      <div className="docs-section">
        <div className="docs-section-title">Basic</div>
        <div className="docs-preview col">
          <EvoToggle
            checked={on}
            onChange={setOn}
            label={on ? 'Enabled' : 'Disabled'}
          />
          <p className="docs-readout">State: <strong>{on ? 'on' : 'off'}</strong></p>
        </div>
        <CodeBlock code={`const [on, setOn] = useState(false)

<EvoToggle checked={on} onChange={setOn} label="Enable feature" />`} />
      </div>

      <div className="docs-section">
        <div className="docs-section-title">Sizes</div>
        <div className="docs-preview col">
          <EvoToggle checked={true} onChange={() => {}} label="Small" size="sm" />
          <EvoToggle checked={true} onChange={() => {}} label="Medium" size="md" />
          <EvoToggle checked={true} onChange={() => {}} label="Large" size="lg" />
        </div>
        <CodeBlock code={`<EvoToggle checked={true} onChange={fn} label="Small" size="sm" />
<EvoToggle checked={true} onChange={fn} label="Medium" size="md" />
<EvoToggle checked={true} onChange={fn} label="Large" size="lg" />`} />
      </div>

      <div className="docs-section">
        <div className="docs-section-title">Settings Example</div>
        <div className="docs-preview col">
          <EvoToggle checked={notifications} onChange={setNotifications} label="Email notifications" />
          <EvoToggle checked={darkMode} onChange={setDarkMode} label="Dark mode" />
          <EvoToggle checked={false} onChange={() => {}} label="Two-factor auth (locked)" disabled />
        </div>
        <CodeBlock code={`<EvoToggle checked={notifications} onChange={setNotifications} label="Email notifications" />
<EvoToggle checked={darkMode} onChange={setDarkMode} label="Dark mode" />
<EvoToggle checked={false} onChange={() => {}} label="Two-factor auth" disabled />`} />
      </div>

      <EvoDivider />

      <div className="docs-section">
        <div className="docs-section-title">Props</div>
        <PropsTable props={[
          { prop: 'checked', type: 'boolean', required: true, description: 'Current toggle state.' },
          { prop: 'onChange', type: '(checked: boolean) => void', required: true, description: 'Called when the toggle state changes.' },
          { prop: 'label', type: 'string', description: 'Label displayed next to the toggle.' },
          { prop: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Toggle size.' },
          { prop: 'disabled', type: 'boolean', default: 'false', description: 'Disables the toggle.' },
          { prop: 'className', type: 'string', description: 'Additional CSS class.' },
        ]} />
      </div>
    </div>
  )
}
