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
  const [showError, setShowError] = useState(false)

  return (
    <div>
      <div className="docs-page-header">
        <div className="docs-page-tag">Component</div>
        <h1 className="docs-page-title">EvoForm</h1>
        <p className="docs-page-desc">
          A lightweight, composable form layout system. EvoForm provides a disabled / size context
          to its children and a small set of slot components — Header, Section, Row, Field, Actions —
          for assembling everything from a single login form to a multi-section settings page.
        </p>
        <div className="docs-import-line">
          import {'{ '}<span>EvoForm</span>{' }'} from '@justin_evo/evo-ui'
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      <div className="docs-section">
        <div className="docs-section-title">Complete Form Example</div>
        <div className="docs-preview col" style={{ width: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.25rem', flexWrap: 'wrap' }}>
            <EvoToggle checked={disabled} onChange={setDisabled} label="Disable entire form" size="sm" />
            <EvoToggle checked={showError} onChange={setShowError} label="Show validation error" size="sm" />
          </div>

          {submitted && (
            <EvoAlert type="success" title="Form submitted" dismissible>
              Your settings have been saved.
            </EvoAlert>
          )}

          <EvoForm
            disabled={disabled}
            maxWidth={640}
            onSubmit={(e) => {
              e.preventDefault()
              setSubmitted(true)
              setTimeout(() => setSubmitted(false), 3000)
            }}
          >
            <EvoForm.Header
              badge="Account"
              title="Profile settings"
              description="Update your personal information and how others see you on the platform."
            />

            <EvoForm.Section
              title="Personal"
              description="Your name and contact information."
            >
              <EvoForm.Row>
                <EvoForm.Field>
                  <EvoInput label="First name" placeholder="Jane" fullWidth />
                </EvoForm.Field>
                <EvoForm.Field>
                  <EvoInput label="Last name" placeholder="Smith" fullWidth />
                </EvoForm.Field>
              </EvoForm.Row>
              <EvoForm.Field>
                <EvoInput
                  label="Email address"
                  type="email"
                  placeholder="jane@example.com"
                  fullWidth
                  error={showError ? 'Please enter a valid work email.' : undefined}
                />
              </EvoForm.Field>
            </EvoForm.Section>

            <EvoForm.Section
              title="Workspace"
              description="Tell us a bit about your role so we can tailor your experience."
            >
              <EvoForm.Row>
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
                  <EvoSelect
                    label="Team size"
                    options={[
                      { value: '1', label: 'Just me' },
                      { value: '2-10', label: '2 – 10' },
                      { value: '11-50', label: '11 – 50' },
                      { value: '50+', label: '50+' },
                    ]}
                    placeholder="Choose size"
                    fullWidth
                  />
                </EvoForm.Field>
              </EvoForm.Row>
              <EvoForm.Field>
                <EvoCheckbox label="Subscribe to product updates" />
              </EvoForm.Field>
            </EvoForm.Section>

            <EvoForm.Actions>
              <EvoButton variant="ghost" label="Cancel" onClick={() => {}} />
              <EvoButton label="Save changes" onClick={() => {}} />
            </EvoForm.Actions>
          </EvoForm>
        </div>
        <CodeBlock code={`<EvoForm disabled={loading} maxWidth={640} onSubmit={handleSubmit}>
  <EvoForm.Header
    badge="Account"
    title="Profile settings"
    description="Update your personal information."
  />

  <EvoForm.Section title="Personal" description="Your name and contact info.">
    <EvoForm.Row>
      <EvoForm.Field><EvoInput label="First name" fullWidth /></EvoForm.Field>
      <EvoForm.Field><EvoInput label="Last name" fullWidth /></EvoForm.Field>
    </EvoForm.Row>
    <EvoForm.Field>
      <EvoInput label="Email" type="email" fullWidth />
    </EvoForm.Field>
  </EvoForm.Section>

  <EvoForm.Section title="Workspace">
    <EvoForm.Field>
      <EvoSelect label="Role" options={roles} fullWidth />
    </EvoForm.Field>
    <EvoForm.Field>
      <EvoCheckbox label="Subscribe to product updates" />
    </EvoForm.Field>
  </EvoForm.Section>

  <EvoForm.Actions>
    <EvoButton variant="ghost" label="Cancel" />
    <EvoButton label="Save changes" />
  </EvoForm.Actions>
</EvoForm>`} />
      </div>

      <EvoDivider />

      {/* ------------------------------------------------------------------ */}
      <div className="docs-section">
        <div className="docs-section-title">Minimal Form</div>
        <div className="docs-preview col" style={{ width: '100%' }}>
          <EvoForm maxWidth={420} onSubmit={(e) => e.preventDefault()}>
            <EvoForm.Field>
              <EvoInput label="Email" type="email" placeholder="you@example.com" fullWidth />
            </EvoForm.Field>
            <EvoForm.Field>
              <EvoInput label="Password" type="password" placeholder="••••••••" fullWidth />
            </EvoForm.Field>
            <EvoForm.Actions align="between" divider={false}>
              <EvoButton variant="ghost" label="Forgot password?" onClick={() => {}} />
              <EvoButton label="Sign in" onClick={() => {}} />
            </EvoForm.Actions>
          </EvoForm>
        </div>
        <CodeBlock code={`<EvoForm maxWidth={420} onSubmit={handleSubmit}>
  <EvoForm.Field>
    <EvoInput label="Email" type="email" fullWidth />
  </EvoForm.Field>
  <EvoForm.Field>
    <EvoInput label="Password" type="password" fullWidth />
  </EvoForm.Field>
  <EvoForm.Actions align="between" divider={false}>
    <EvoButton variant="ghost" label="Forgot password?" />
    <EvoButton label="Sign in" />
  </EvoForm.Actions>
</EvoForm>`} />
      </div>

      {/* ------------------------------------------------------------------ */}
      <div className="docs-section">
        <div className="docs-section-title">Split Section Layout</div>
        <p className="docs-section-desc" style={{ color: 'var(--docs-text-muted, #94a3b8)', margin: '0 0 0.75rem', fontSize: '0.875rem' }}>
          Use <code>variant="split"</code> on a section to place the title and description in a
          dedicated left column on wide screens. Stacks vertically on mobile.
        </p>
        <div className="docs-preview col" style={{ width: '100%' }}>
          <EvoForm onSubmit={(e) => e.preventDefault()}>
            <EvoForm.Section
              variant="split"
              title="Notifications"
              description="Choose what we email you about. You can change these anytime."
            >
              <EvoForm.Field>
                <EvoCheckbox label="Weekly product digest" defaultChecked />
              </EvoForm.Field>
              <EvoForm.Field>
                <EvoCheckbox label="Security alerts" defaultChecked />
              </EvoForm.Field>
              <EvoForm.Field>
                <EvoCheckbox label="Marketing announcements" />
              </EvoForm.Field>
            </EvoForm.Section>
          </EvoForm>
        </div>
        <CodeBlock code={`<EvoForm.Section
  variant="split"
  title="Notifications"
  description="Choose what we email you about."
>
  <EvoForm.Field><EvoCheckbox label="Weekly digest" /></EvoForm.Field>
  <EvoForm.Field><EvoCheckbox label="Security alerts" /></EvoForm.Field>
</EvoForm.Section>`} />
      </div>

      {/* ------------------------------------------------------------------ */}
      <div className="docs-section">
        <div className="docs-section-title">Field with Label / Description / Error</div>
        <p className="docs-section-desc" style={{ color: 'var(--docs-text-muted, #94a3b8)', margin: '0 0 0.75rem', fontSize: '0.875rem' }}>
          <code>EvoForm.Field</code> is a layout wrapper by default. Pass <code>label</code>,
          <code>description</code>, <code>error</code>, or <code>required</code> when you need to
          decorate non-Evo controls (a date picker, file uploader, custom widget, etc.) with
          consistent form metadata.
        </p>
        <div className="docs-preview col" style={{ width: '100%', maxWidth: 480 }}>
          <EvoForm.Field
            label="API key"
            description="Generated automatically. Rotate it from the security tab."
            required
          >
            <code style={{
              display: 'block',
              padding: '0.5rem 0.75rem',
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 6,
              fontSize: '0.8rem',
              fontFamily: 'monospace',
              color: '#cbd5e1',
            }}>
              sk_live_••••••••••••••••a93f
            </code>
          </EvoForm.Field>

          <EvoForm.Field
            label="Webhook URL"
            error="URL must use HTTPS."
            required
          >
            <EvoInput placeholder="https://example.com/webhook" fullWidth />
          </EvoForm.Field>
        </div>
        <CodeBlock code={`<EvoForm.Field
  label="API key"
  description="Generated automatically."
  required
>
  <code>sk_live_••••••••••••a93f</code>
</EvoForm.Field>

<EvoForm.Field label="Webhook URL" error="URL must use HTTPS." required>
  <EvoInput placeholder="https://example.com/webhook" fullWidth />
</EvoForm.Field>`} />
      </div>

      {/* ------------------------------------------------------------------ */}
      <div className="docs-section">
        <div className="docs-section-title">Actions Alignment</div>
        <div className="docs-preview col" style={{ width: '100%', gap: '1.5rem' }}>
          {(['right', 'left', 'center', 'between'] as const).map((align) => (
            <EvoForm key={align} onSubmit={(e) => e.preventDefault()}>
              <EvoForm.Actions align={align} divider={false}>
                <EvoButton variant="ghost" label="Cancel" onClick={() => {}} />
                <EvoButton label={`align="${align}"`} onClick={() => {}} />
              </EvoForm.Actions>
            </EvoForm>
          ))}
        </div>
        <CodeBlock code={`<EvoForm.Actions align="right">   {/* default */}
<EvoForm.Actions align="left">
<EvoForm.Actions align="center">
<EvoForm.Actions align="between">`} />
      </div>

      <EvoDivider />

      {/* ------------------------------------------------------------------ */}
      <div className="docs-section">
        <div className="docs-section-title">EvoForm Props</div>
        <PropsTable props={[
          { prop: 'disabled', type: 'boolean', default: 'false', description: 'Disables all child form inputs via context.' },
          { prop: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Density / spacing preset shared via context.' },
          { prop: 'layout', type: "'vertical' | 'horizontal'", default: "'vertical'", description: 'Reserved layout hint passed via context for child controls.' },
          { prop: 'maxWidth', type: 'number | string', description: 'Caps the form width. Convenient shorthand for the style prop.' },
          { prop: 'children', type: 'ReactNode', required: true, description: 'Form content — typically EvoForm.Header, EvoForm.Section and EvoForm.Actions.' },
          { prop: 'className', type: 'string', description: 'Additional CSS class for the root <form>.' },
          { prop: '...rest', type: 'FormHTMLAttributes', description: 'All native form attributes (onSubmit, action, method, etc.)' },
        ]} />
      </div>

      <div className="docs-section">
        <div className="docs-section-title">EvoForm.Header Props</div>
        <PropsTable props={[
          { prop: 'title', type: 'ReactNode', description: 'Heading shown at the top of the form.' },
          { prop: 'description', type: 'ReactNode', description: 'Subtitle shown below the title.' },
          { prop: 'badge', type: 'ReactNode', description: 'Small label above the title (e.g. "Account", "Step 2 of 4").' },
          { prop: 'children', type: 'ReactNode', description: 'Extra content rendered after the description.' },
        ]} />
      </div>

      <div className="docs-section">
        <div className="docs-section-title">EvoForm.Section Props</div>
        <PropsTable props={[
          { prop: 'title', type: 'ReactNode', description: 'Section heading.' },
          { prop: 'description', type: 'ReactNode', description: 'Supporting copy under the section title.' },
          { prop: 'variant', type: "'stacked' | 'split'", default: "'stacked'", description: '"split" places title/description in a left column on wide screens.' },
          { prop: 'children', type: 'ReactNode', required: true, description: 'Fields and rows belonging to this section.' },
        ]} />
      </div>

      <div className="docs-section">
        <div className="docs-section-title">EvoForm.Row Props</div>
        <PropsTable props={[
          { prop: 'gap', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Horizontal spacing between fields.' },
          { prop: 'align', type: "'start' | 'center' | 'end'", default: "'start'", description: 'Vertical alignment of children.' },
          { prop: 'children', type: 'ReactNode', required: true, description: 'Fields placed side-by-side; wraps on small screens.' },
        ]} />
      </div>

      <div className="docs-section">
        <div className="docs-section-title">EvoForm.Field Props</div>
        <PropsTable props={[
          { prop: 'label', type: 'ReactNode', description: 'Optional label rendered above the control. Use when wrapping non-Evo widgets.' },
          { prop: 'description', type: 'ReactNode', description: 'Helper text shown below the control when there is no error.' },
          { prop: 'error', type: 'ReactNode', description: 'Error message shown below the control. Takes precedence over description.' },
          { prop: 'required', type: 'boolean', default: 'false', description: 'Adds a red asterisk next to the label.' },
          { prop: 'htmlFor', type: 'string', description: 'Sets the label `for` attribute. Auto-generated when omitted.' },
          { prop: 'children', type: 'ReactNode', required: true, description: 'The form control(s) being wrapped.' },
        ]} />
      </div>

      <div className="docs-section">
        <div className="docs-section-title">EvoForm.Actions Props</div>
        <PropsTable props={[
          { prop: 'align', type: "'left' | 'right' | 'center' | 'between'", default: "'right'", description: 'Horizontal alignment of the action buttons.' },
          { prop: 'divider', type: 'boolean', default: 'true', description: 'Renders a subtle top border above the actions row.' },
          { prop: 'children', type: 'ReactNode', required: true, description: 'Typically EvoButton elements (Cancel / Submit).' },
        ]} />
      </div>

      <div className="docs-section">
        <div className="docs-section-title">useFormContext()</div>
        <p style={{ color: 'var(--docs-text-muted, #94a3b8)', fontSize: '0.875rem', margin: '0 0 0.75rem' }}>
          Read the current form context from any child component — useful when building custom
          controls that need to respect the form's <code>disabled</code> or <code>size</code> state.
        </p>
        <CodeBlock code={`import { useFormContext } from '@justin_evo/evo-ui'

const MyCustomField = () => {
  const { disabled, size } = useFormContext()
  return <button disabled={disabled} data-size={size}>…</button>
}`} />
      </div>
    </div>
  )
}
