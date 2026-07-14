import { EvoInput, EvoDivider } from '@justin_evo/evo-ui'
import { CodeBlock } from '../components/CodeBlock'
import { PropsTable } from '../components/PropsTable'

export default function InputPage() {
  return (
    <div>
      <div className="docs-page-header">
        <div className="docs-page-tag">Component</div>
        <h1 className="docs-page-title">EvoInput</h1>
        <p className="docs-page-desc">
          A styled text input supporting labels, helper text, error messages, adornments,
          multiple sizes, and all native input attributes.
        </p>
        <div className="docs-import-line">
          import {'{ '}<span>EvoInput</span>{' }'} from '@justin_evo/evo-ui'
        </div>
      </div>

      <div className="docs-section">
        <div className="docs-section-title">Basic</div>
        <div className="docs-preview col">
          <EvoInput label="Username" placeholder="Enter username" />
          <EvoInput placeholder="No label" />
        </div>
        <CodeBlock code={`<EvoInput label="Username" placeholder="Enter username" />
<EvoInput placeholder="No label" />`} />
      </div>

      <div className="docs-section">
        <div className="docs-section-title">Helper Text & Error</div>
        <div className="docs-preview col">
          <EvoInput label="Email" placeholder="you@example.com" helperText="We'll never share your email." />
          <EvoInput label="Password" type="password" placeholder="••••••••" error="Password must be at least 8 characters." />
        </div>
        <CodeBlock code={`<EvoInput
  label="Email"
  placeholder="you@example.com"
  helperText="We'll never share your email."
/>
<EvoInput
  label="Password"
  type="password"
  error="Password must be at least 8 characters."
/>`} />
      </div>

      <div className="docs-section">
        <div className="docs-section-title">Sizes</div>
        <div className="docs-preview col">
          <EvoInput size="sm" placeholder="Small input" />
          <EvoInput size="md" placeholder="Medium input" />
          <EvoInput size="lg" placeholder="Large input" />
        </div>
        <CodeBlock code={`<EvoInput size="sm" placeholder="Small" />
<EvoInput size="md" placeholder="Medium" />
<EvoInput size="lg" placeholder="Large" />`} />
      </div>

      <div className="docs-section">
        <div className="docs-section-title">Adornments</div>
        <div className="docs-preview col">
          <EvoInput
            label="Search"
            placeholder="Search..."
            leadingAdornment={<span style={{ fontSize: '0.9rem' }}>🔍</span>}
          />
          <EvoInput
            label="Amount"
            placeholder="0.00"
            leadingAdornment={<span style={{ color: 'var(--docs-text-muted)', fontWeight: 600 }}>$</span>}
            trailingAdornment={<span style={{ color: 'var(--docs-text-muted)', fontSize: '0.8rem' }}>USD</span>}
          />
        </div>
        <CodeBlock code={`<EvoInput
  label="Search"
  placeholder="Search..."
  leadingAdornment={<SearchIcon />}
/>
<EvoInput
  label="Amount"
  leadingAdornment={<span>$</span>}
  trailingAdornment={<span>USD</span>}
/>`} />
      </div>

      <div className="docs-section">
        <div className="docs-section-title">Full Width</div>
        <div className="docs-preview col" style={{ width: '100%' }}>
          <EvoInput label="Full width input" placeholder="Stretches to container width" fullWidth />
        </div>
        <CodeBlock code={`<EvoInput label="Full width" fullWidth />`} />
      </div>

      <EvoDivider />

      <div className="docs-section">
        <div className="docs-section-title">Props</div>
        <PropsTable props={[
          { prop: 'label', type: 'string', description: 'Label displayed above the input.' },
          { prop: 'helperText', type: 'string', description: 'Helper text below the input. Hidden when error is present.' },
          { prop: 'error', type: 'string', description: 'Error message displayed in red below the input.' },
          { prop: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Input size.' },
          { prop: 'leadingAdornment', type: 'ReactNode', description: 'Element rendered before the input text.' },
          { prop: 'trailingAdornment', type: 'ReactNode', description: 'Element rendered after the input text.' },
          { prop: 'fullWidth', type: 'boolean', default: 'false', description: 'Stretches the input to fill its container.' },
          { prop: 'ref', type: 'React.Ref<HTMLInputElement>', description: 'Forwarded to the native <input> element — use for react-hook-form register(), programmatic focus, or select-on-error.' },
          { prop: '...rest', type: 'InputHTMLAttributes', description: 'All native input attributes (placeholder, type, onChange, disabled, etc.)' },
        ]} />
      </div>

      <div className="docs-section">
        <div className="docs-section-title">Accessibility</div>
        <ul className="docs-list">
          <li>The label is associated to the input via <code>htmlFor</code>/<code>id</code>.</li>
          <li><code>aria-invalid</code> and <code>aria-describedby</code> are set automatically when <code>error</code> or <code>helperText</code> is present.</li>
          <li>The input is a native <code>&lt;input&gt;</code>, so it is keyboard-focusable with a visible focus ring on the wrapper (<code>:focus-within</code>).</li>
          <li>Every size meets the 44px minimum touch target on coarse-pointer (touch) devices.</li>
          <li><code>EvoInput</code> forwards its <code>ref</code> to the underlying <code>&lt;input&gt;</code>, so it works with <code>react-hook-form</code>'s <code>register()</code> and programmatic <code>.focus()</code>/<code>.select()</code> calls.</li>
        </ul>
      </div>
    </div>
  )
}
