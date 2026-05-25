import { useState } from 'react'
import { EvoSelect, EvoDivider } from '@justin_evo/evo-ui'
import { CodeBlock } from '../components/CodeBlock'
import { PropsTable } from '../components/PropsTable'

const countries = [
  { value: 'us', label: 'United States', icon: <span>🇺🇸</span> },
  { value: 'uk', label: 'United Kingdom', icon: <span>🇬🇧</span> },
  { value: 'ca', label: 'Canada', icon: <span>🇨🇦</span> },
  { value: 'au', label: 'Australia', icon: <span>🇦🇺</span> },
  { value: 'de', label: 'Germany', icon: <span>🇩🇪</span> },
  { value: 'jp', label: 'Japan', icon: <span>🇯🇵</span> },
  { value: 'sg', label: 'Singapore', icon: <span>🇸🇬</span> },
  { value: 'fr', label: 'France', icon: <span>🇫🇷</span> },
  { value: 'br', label: 'Brazil', icon: <span>🇧🇷</span> },
  { value: 'in', label: 'India', icon: <span>🇮🇳</span> },
]

const basicCountries = [
  { value: 'us', label: 'United States' },
  { value: 'uk', label: 'United Kingdom' },
  { value: 'ca', label: 'Canada' },
  { value: 'au', label: 'Australia' },
  { value: 'de', label: 'Germany' },
]

const roleOptions = [
  { value: 'admin', label: 'Admin', description: 'Full access to all settings' },
  { value: 'editor', label: 'Editor', description: 'Can create and edit content' },
  { value: 'viewer', label: 'Viewer', description: 'Read-only access' },
  { value: 'guest', label: 'Guest', description: 'Limited preview only', disabled: true },
]

const plans = [
  { value: 'free', label: 'Free', description: '1 project · community support' },
  { value: 'pro', label: 'Pro', description: 'Unlimited projects · priority support' },
  { value: 'team', label: 'Team', description: 'Collaboration · SSO · audit logs' },
  { value: 'enterprise', label: 'Enterprise', description: 'Custom SLAs · dedicated success' },
]

export default function SelectPage() {
  const [country, setCountry] = useState('')
  const [countryWithIcon, setCountryWithIcon] = useState('us')
  const [role, setRole] = useState('')
  const [plan, setPlan] = useState('pro')
  const [search, setSearch] = useState('')
  const [clearable, setClearable] = useState('uk')
  const [multiChips, setMultiChips] = useState<string[]>(['us', 'jp'])
  const [multiCount, setMultiCount] = useState<string[]>(['us', 'uk', 'ca'])
  const [multiCapped, setMultiCapped] = useState<string[]>([])
  const [multiBulk, setMultiBulk] = useState<string[]>([])

  return (
    <div>
      <div className="docs-page-header">
        <div className="docs-page-tag">Component</div>
        <h1 className="docs-page-title">EvoSelect</h1>
        <p className="docs-page-desc">
          A fully custom dropdown — keyboard-navigable, screen-reader friendly,
          with rich options (icons + descriptions), in-menu search, clearable values,
          smooth animations, and a polished dark-mode aesthetic.
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
            options={basicCountries}
            placeholder="Select a country"
            value={country}
            onChange={setCountry}
            helperText="Used for billing region"
          />
          <p className="docs-readout">
            Selected: <strong>{country || 'none'}</strong>
          </p>
        </div>
        <CodeBlock code={`const [country, setCountry] = useState('')

<EvoSelect
  label="Country"
  options={basicCountries}
  placeholder="Select a country"
  value={country}
  onChange={setCountry}
  helperText="Used for billing region"
/>`} />
      </div>

      <div className="docs-section">
        <div className="docs-section-title">With Icons</div>
        <div className="docs-preview col">
          <EvoSelect
            label="Locale"
            options={countries}
            value={countryWithIcon}
            onChange={setCountryWithIcon}
          />
        </div>
        <CodeBlock code={`const countries = [
  { value: 'us', label: 'United States', icon: <span>🇺🇸</span> },
  { value: 'uk', label: 'United Kingdom', icon: <span>🇬🇧</span> },
  // ...
]

<EvoSelect label="Locale" options={countries} value={value} onChange={setValue} />`} />
      </div>

      <div className="docs-section">
        <div className="docs-section-title">Rich Options (description)</div>
        <div className="docs-preview col">
          <EvoSelect
            label="Plan"
            options={plans}
            value={plan}
            onChange={setPlan}
            helperText="You can upgrade or downgrade at any time."
          />
        </div>
        <CodeBlock code={`const plans = [
  { value: 'free', label: 'Free', description: '1 project · community support' },
  { value: 'pro', label: 'Pro', description: 'Unlimited projects · priority support' },
  { value: 'team', label: 'Team', description: 'Collaboration · SSO · audit logs' },
]

<EvoSelect label="Plan" options={plans} value={plan} onChange={setPlan} />`} />
      </div>

      <div className="docs-section">
        <div className="docs-section-title">Searchable</div>
        <div className="docs-preview col">
          <EvoSelect
            label="Country"
            options={countries}
            value={search}
            onChange={setSearch}
            placeholder="Pick a country"
            searchable
          />
        </div>
        <CodeBlock code={`<EvoSelect
  label="Country"
  options={countries}
  value={search}
  onChange={setSearch}
  searchable
/>`} />
      </div>

      <div className="docs-section">
        <div className="docs-section-title">Clearable</div>
        <div className="docs-preview col">
          <EvoSelect
            label="Country"
            options={basicCountries}
            value={clearable}
            onChange={setClearable}
            clearable
            helperText="Hover the value to reveal the clear button."
          />
        </div>
        <CodeBlock code={`<EvoSelect
  label="Country"
  options={countries}
  value={value}
  onChange={setValue}
  clearable
/>`} />
      </div>

      <div className="docs-section">
        <div className="docs-section-title">Multiple — chips</div>
        <p className="docs-section-desc">
          Pass <code>multiple</code> to let the user pick several options. The trigger
          shows each selection as a chip with its own remove button. <code>value</code>{' '}
          and <code>onChange</code> become <code>string[]</code>. The menu stays open
          after each click so multiple picks feel natural.
        </p>
        <div className="docs-preview col">
          <EvoSelect
            multiple
            label="Countries"
            options={countries}
            placeholder="Pick one or more"
            value={multiChips}
            onChange={setMultiChips}
            searchable
            helperText={`Selected: ${multiChips.length || 'none'}`}
          />
        </div>
        <CodeBlock code={`const [values, setValues] = useState<string[]>([])

<EvoSelect
  multiple
  label="Countries"
  options={countries}
  value={values}
  onChange={setValues}
  searchable
/>`} />
      </div>

      <div className="docs-section">
        <div className="docs-section-title">Multiple — count summary</div>
        <p className="docs-section-desc">
          For dense forms, <code>multipleDisplay="count"</code> condenses the
          trigger to the first label plus a <code>+N more</code> hint, so it
          stays the same height regardless of how much is selected.
        </p>
        <div className="docs-preview col">
          <EvoSelect
            multiple
            multipleDisplay="count"
            label="Countries"
            options={countries}
            value={multiCount}
            onChange={setMultiCount}
            clearable
          />
        </div>
        <CodeBlock code={`<EvoSelect
  multiple
  multipleDisplay="count"
  label="Countries"
  options={countries}
  value={values}
  onChange={setValues}
  clearable
/>`} />
      </div>

      <div className="docs-section">
        <div className="docs-section-title">Multiple — capped + Select all</div>
        <p className="docs-section-desc">
          Combine <code>maxSelections</code> with <code>showSelectAll</code> to
          let users either bulk-pick or stop at a hard limit. Once the limit is
          hit, remaining options become non-selectable until the user removes
          one.
        </p>
        <div className="docs-preview col">
          <EvoSelect
            multiple
            showSelectAll
            maxSelections={3}
            label="Pick up to 3"
            options={countries}
            value={multiCapped}
            onChange={setMultiCapped}
            searchable
            helperText="Maximum of three selections."
          />
          <EvoSelect
            multiple
            multipleDisplay="count"
            showSelectAll
            label="Choose any"
            options={basicCountries}
            value={multiBulk}
            onChange={setMultiBulk}
          />
        </div>
        <CodeBlock code={`<EvoSelect
  multiple
  showSelectAll
  maxSelections={3}
  label="Pick up to 3"
  options={countries}
  value={values}
  onChange={setValues}
  searchable
/>`} />
      </div>

      <div className="docs-section">
        <div className="docs-section-title">Disabled Options & Error</div>
        <div className="docs-preview col">
          <EvoSelect
            label="Role"
            options={roleOptions}
            placeholder="Choose a role"
            value={role}
            onChange={setRole}
            error={!role ? 'Please select a role to continue.' : undefined}
          />
        </div>
        <CodeBlock code={`const roleOptions = [
  { value: 'admin', label: 'Admin', description: 'Full access to all settings' },
  { value: 'editor', label: 'Editor', description: 'Can create and edit content' },
  { value: 'guest', label: 'Guest', disabled: true },
]

<EvoSelect
  label="Role"
  options={roleOptions}
  value={role}
  onChange={setRole}
  error="Please select a role to continue."
/>`} />
      </div>

      <div className="docs-section">
        <div className="docs-section-title">Sizes</div>
        <div className="docs-preview col">
          <EvoSelect size="sm" options={basicCountries} placeholder="Small" />
          <EvoSelect size="md" options={basicCountries} placeholder="Medium (default)" />
          <EvoSelect size="lg" options={basicCountries} placeholder="Large" />
        </div>
        <CodeBlock code={`<EvoSelect size="sm" options={options} placeholder="Small" />
<EvoSelect size="md" options={options} placeholder="Medium" />
<EvoSelect size="lg" options={options} placeholder="Large" />`} />
      </div>

      <div className="docs-section">
        <div className="docs-section-title">Disabled</div>
        <div className="docs-preview col">
          <EvoSelect
            label="Country"
            options={basicCountries}
            placeholder="Select a country"
            disabled
          />
        </div>
        <CodeBlock code={`<EvoSelect label="Country" options={options} disabled />`} />
      </div>

      <div className="docs-section">
        <div className="docs-section-title">Full Width</div>
        <div className="docs-preview col">
          <EvoSelect
            fullWidth
            label="Country"
            options={basicCountries}
            placeholder="Select a country"
          />
        </div>
        <CodeBlock code={`<EvoSelect fullWidth label="Country" options={options} />`} />
      </div>

      <EvoDivider />

      <div className="docs-section">
        <div className="docs-section-title">Keyboard</div>
        <div className="docs-preview col">
          <p className="docs-kbd-list">
            <strong>↑ / ↓</strong> — Move the active option<br />
            <strong>Home / End</strong> — Jump to first / last<br />
            <strong>Enter / Space</strong> — Open, or select (in multi mode: toggle without closing)<br />
            <strong>Esc</strong> — Close menu<br />
            <strong>Tab</strong> — Close menu and move focus
          </p>
        </div>
      </div>

      <EvoDivider />

      <div className="docs-section">
        <div className="docs-section-title">Props</div>
        <PropsTable props={[
          { prop: 'options', type: 'SelectOption[]', required: true, description: 'Array of { value, label, description?, icon?, disabled? }.' },
          { prop: 'multiple', type: 'boolean', default: 'false', description: 'Enable multi-select. value/defaultValue/onChange switch to string[] when true.' },
          { prop: 'value', type: 'string | string[]', description: 'Controlled value. string in single mode, string[] in multi mode.' },
          { prop: 'defaultValue', type: 'string | string[]', default: "'' / []", description: 'Initial uncontrolled value. Type follows multiple.' },
          { prop: 'onChange', type: '(value: string) => void | (value: string[]) => void', description: 'Called with the new value. Receives a string[] when multiple is true.' },
          { prop: 'multipleDisplay', type: "'chips' | 'count'", default: "'chips'", description: 'Multi-select only. How selected items render in the trigger.' },
          { prop: 'maxSelections', type: 'number', description: 'Multi-select only. Caps the number of selectable options.' },
          { prop: 'showSelectAll', type: 'boolean', default: 'false', description: 'Multi-select only. Shows Select-all / Clear-all buttons at the top of the menu.' },
          { prop: 'label', type: 'string', description: 'Label above the select.' },
          { prop: 'placeholder', type: 'string', default: "'Select an option'", description: 'Shown when no option is selected.' },
          { prop: 'helperText', type: 'string', description: 'Helper text below the select.' },
          { prop: 'error', type: 'string', description: 'Error message (replaces helperText when set).' },
          { prop: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Select size.' },
          { prop: 'fullWidth', type: 'boolean', default: 'false', description: 'Stretch to the container width.' },
          { prop: 'disabled', type: 'boolean', default: 'false', description: 'Disable the control.' },
          { prop: 'searchable', type: 'boolean', default: 'false', description: 'Show a search field at the top of the menu.' },
          { prop: 'clearable', type: 'boolean', default: 'false', description: 'Show a clear button when a value is selected.' },
          { prop: 'name', type: 'string', description: 'Renders a hidden input for HTML form submission.' },
          { prop: 'id', type: 'string', description: 'Custom id for the trigger (auto-generated if omitted).' },
          { prop: 'className', type: 'string', description: 'Extra class on the outer field wrapper.' },
        ]} />
      </div>
    </div>
  )
}
