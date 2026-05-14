import { useState } from 'react'
import { EvoButton, EvoDivider, EvoStack } from '@justin_evo/evo-ui'
import { CodeBlock } from '../components/CodeBlock'
import { PropsTable } from '../components/PropsTable'

// Tiny inline icons so the docs page has zero icon-library dependency.
// EvoButton auto-sizes <svg> children inside an `iconLeft` / `iconRight`
// slot to 1em × 1em, so these scale with the button's font-size.
const PlusIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 5v14M5 12h14" />
  </svg>
)
const ArrowRightIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14M13 5l7 7-7 7" />
  </svg>
)
const TrashIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
  </svg>
)
const HeartIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
)

function LoadingDemo() {
  const [loading, setLoading] = useState(false)
  return (
    <EvoStack direction="row" gap="0.5rem" wrap>
      <EvoButton
        label="Save changes"
        loading={loading}
        loadingText="Saving…"
        onClick={() => {
          setLoading(true)
          setTimeout(() => setLoading(false), 1500)
        }}
      />
      <EvoButton label="Always loading" loading />
      <EvoButton label="Loading ghost" variant="ghost" loading loadingText="Working" />
    </EvoStack>
  )
}

export default function ButtonPage() {
  return (
    <div>
      <div className="docs-page-header">
        <div className="docs-page-tag">Component</div>
        <h1 className="docs-page-title">EvoButton</h1>
        <p className="docs-page-desc">
          Triggers actions, submits forms, or navigates. Supports four visual variants,
          six semantic severities, three sizes, three shapes, left/right icons, a built-in
          loading state, and every native <code>&lt;button&gt;</code> attribute.
        </p>
        <div className="docs-import-line">
          import {'{ '}<span>EvoButton</span>{' }'} from '@justin_evo/evo-ui'
        </div>
      </div>

      {/* ---------- Variants ---------- */}
      <div className="docs-section">
        <div className="docs-section-title">Variants</div>
        <p className="docs-section-desc">
          Four orthogonal looks. <code>solid</code> for primary actions, <code>outline</code>{' '}
          for secondary, <code>ghost</code> for tertiary / toolbar use, and <code>soft</code>{' '}
          for tinted-background actions that sit on a busy surface.
        </p>
        <div className="docs-preview">
          <EvoButton label="Solid" variant="solid" />
          <EvoButton label="Outline" variant="outline" />
          <EvoButton label="Ghost" variant="ghost" />
          <EvoButton label="Soft" variant="soft" />
        </div>
        <CodeBlock code={`<EvoButton label="Solid" variant="solid" />
<EvoButton label="Outline" variant="outline" />
<EvoButton label="Ghost" variant="ghost" />
<EvoButton label="Soft" variant="soft" />`} />
      </div>

      {/* ---------- Severities ---------- */}
      <div className="docs-section">
        <div className="docs-section-title">Severities</div>
        <p className="docs-section-desc">
          Convey intent with semantic colors. Pair with <code>variant</code> freely — every
          severity is defined for every variant.
        </p>
        <div className="docs-preview">
          <EvoButton label="Primary" severity="primary" />
          <EvoButton label="Secondary" severity="secondary" />
          <EvoButton label="Danger" severity="danger" />
          <EvoButton label="Warning" severity="warning" />
          <EvoButton label="Success" severity="success" />
          <EvoButton label="Info" severity="info" />
        </div>
        <CodeBlock code={`<EvoButton label="Primary"   severity="primary" />
<EvoButton label="Secondary" severity="secondary" />
<EvoButton label="Danger"    severity="danger" />
<EvoButton label="Warning"   severity="warning" />
<EvoButton label="Success"   severity="success" />
<EvoButton label="Info"      severity="info" />`} />
      </div>

      {/* ---------- Sizes ---------- */}
      <div className="docs-section">
        <div className="docs-section-title">Sizes</div>
        <p className="docs-section-desc">
          Three sizes that scale via <code>rem</code> and use <code>min-height</code> for
          touch-target safety (<code>lg</code> hits the 44px WCAG target).
        </p>
        <div className="docs-preview">
          <EvoButton label="Small" size="sm" />
          <EvoButton label="Medium" size="md" />
          <EvoButton label="Large" size="lg" />
        </div>
        <CodeBlock code={`<EvoButton label="Small"  size="sm" />
<EvoButton label="Medium" size="md" />
<EvoButton label="Large"  size="lg" />`} />
      </div>

      {/* ---------- Shapes ---------- */}
      <div className="docs-section">
        <div className="docs-section-title">Shapes</div>
        <p className="docs-section-desc">
          The <code>shape</code> prop is independent of <code>variant</code> — it only
          controls border-radius and aspect ratio. Use <code>square</code> for icon-only
          buttons (the layout becomes a 1:1 box).
        </p>
        <div className="docs-preview">
          <EvoButton label="Default" />
          <EvoButton label="Rounded" shape="rounded" />
          <EvoButton shape="square" aria-label="Add" iconLeft={<PlusIcon />} />
          <EvoButton shape="square" variant="outline" aria-label="Like" iconLeft={<HeartIcon />} />
        </div>
        <CodeBlock code={`<EvoButton label="Default" />
<EvoButton label="Rounded" shape="rounded" />

{/* Icon-only — pass aria-label for accessibility */}
<EvoButton shape="square" aria-label="Add" iconLeft={<PlusIcon />} />`} />
      </div>

      {/* ---------- Icons ---------- */}
      <div className="docs-section">
        <div className="docs-section-title">Icons</div>
        <p className="docs-section-desc">
          Slot any <code>ReactNode</code> into <code>iconLeft</code> or <code>iconRight</code>.
          <code>&lt;svg&gt;</code> children are auto-sized to <code>1em</code>, so icons scale
          with the button's font-size.
        </p>
        <div className="docs-preview">
          <EvoButton label="New item" iconLeft={<PlusIcon />} />
          <EvoButton label="Continue" iconRight={<ArrowRightIcon />} variant="outline" />
          <EvoButton label="Delete" iconLeft={<TrashIcon />} severity="danger" variant="soft" />
          <EvoButton
            label="Both sides"
            iconLeft={<HeartIcon />}
            iconRight={<ArrowRightIcon />}
            severity="info"
          />
        </div>
        <CodeBlock code={`<EvoButton label="New item" iconLeft={<PlusIcon />} />
<EvoButton label="Continue" iconRight={<ArrowRightIcon />} variant="outline" />
<EvoButton label="Delete"
  iconLeft={<TrashIcon />}
  severity="danger"
  variant="soft"
/>`} />
      </div>

      {/* ---------- Loading ---------- */}
      <div className="docs-section">
        <div className="docs-section-title">Loading</div>
        <p className="docs-section-desc">
          When <code>loading</code> is true, icons are replaced with a CSS-only spinner,
          the button is disabled, and <code>aria-busy</code> is set automatically. Pass
          <code>loadingText</code> to keep the button readable while it works.
        </p>
        <LoadingDemo />
        <CodeBlock code={`const [loading, setLoading] = useState(false)

<EvoButton
  label="Save changes"
  loading={loading}
  loadingText="Saving…"
  onClick={async () => {
    setLoading(true)
    await save()
    setLoading(false)
  }}
/>`} />
      </div>

      {/* ---------- Type & form submission ---------- */}
      <div className="docs-section">
        <div className="docs-section-title">Form type</div>
        <p className="docs-section-desc">
          The <code>type</code> prop maps directly to the native button attribute and
          defaults to <code>"button"</code> — so dropping an <code>EvoButton</code> inside a
          form won't accidentally submit it. Use <code>"submit"</code> or <code>"reset"</code>{' '}
          explicitly when you want that behaviour.
        </p>
        <div className="docs-preview">
          <EvoButton label="Safe default" />
          <EvoButton label="Submit form" type="submit" severity="success" />
          <EvoButton label="Reset form" type="reset" variant="outline" severity="secondary" />
        </div>
        <CodeBlock code={`<form onSubmit={handleSubmit}>
  <EvoButton label="Submit form" type="submit" severity="success" />
  <EvoButton label="Reset form"  type="reset"  variant="outline" />
</form>`} />
      </div>

      {/* ---------- Full width ---------- */}
      <div className="docs-section">
        <div className="docs-section-title">Full width</div>
        <p className="docs-section-desc">
          Useful for stacked mobile layouts, dialog footers, and call-to-action bars.
        </p>
        <div className="docs-preview" style={{ width: '100%' }}>
          <EvoButton label="Continue" fullWidth iconRight={<ArrowRightIcon />} />
        </div>
        <CodeBlock code={`<EvoButton label="Continue" fullWidth iconRight={<ArrowRightIcon />} />`} />
      </div>

      {/* ---------- Disabled ---------- */}
      <div className="docs-section">
        <div className="docs-section-title">Disabled</div>
        <p className="docs-section-desc">
          Disabled buttons can't be clicked, focused via pointer, or submitted. Loading
          buttons share the same disabled state automatically.
        </p>
        <div className="docs-preview">
          <EvoButton label="Disabled Solid" disabled />
          <EvoButton label="Disabled Outline" variant="outline" disabled />
          <EvoButton label="Disabled Soft" variant="soft" disabled />
          <EvoButton label="Disabled Ghost" variant="ghost" disabled />
        </div>
        <CodeBlock code={`<EvoButton label="Disabled" disabled />`} />
      </div>

      <EvoDivider className="docs-section" />

      {/* ---------- Props ---------- */}
      <div className="docs-section">
        <div className="docs-section-title">Props</div>
        <PropsTable props={[
          { prop: 'label', type: 'string', description: 'Text shown inside the button. Shorthand for `children`.' },
          { prop: 'children', type: 'ReactNode', description: 'Custom content — overrides `label` when both are provided.' },
          { prop: 'variant', type: "'solid' | 'outline' | 'ghost' | 'soft'", default: "'solid'", description: 'Visual style of the button.' },
          { prop: 'severity', type: "'primary' | 'secondary' | 'danger' | 'warning' | 'success' | 'info'", default: "'primary'", description: 'Semantic color theme.' },
          { prop: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Button size. `lg` meets the 44px touch-target guideline.' },
          { prop: 'shape', type: "'default' | 'rounded' | 'square'", default: "'default'", description: 'Border-radius and aspect ratio. Use `square` for icon-only buttons.' },
          { prop: 'iconLeft', type: 'ReactNode', description: 'Icon rendered before the label. `<svg>` children are auto-sized to 1em.' },
          { prop: 'iconRight', type: 'ReactNode', description: 'Icon rendered after the label.' },
          { prop: 'loading', type: 'boolean', default: 'false', description: 'Replaces icons with a spinner, disables the button, and sets `aria-busy`.' },
          { prop: 'loadingText', type: 'string', description: 'Text shown next to the spinner while `loading` is true.' },
          { prop: 'fullWidth', type: 'boolean', default: 'false', description: 'Stretches the button to fill its parent.' },
          { prop: 'type', type: "'button' | 'submit' | 'reset'", default: "'button'", description: 'Maps to the native button type. Defaults to `button` to prevent accidental form submission.' },
          { prop: 'disabled', type: 'boolean', default: 'false', description: 'Disables the button.' },
          { prop: 'onClick', type: '(e: MouseEvent) => void', description: 'Click handler. Receives the native event.' },
          { prop: '...rest', type: 'ButtonHTMLAttributes', description: 'All native button props (form, name, autoFocus, aria-*, onMouseEnter, …). Forwards `ref` to the underlying `<button>`.' },
        ]} />
      </div>
    </div>
  )
}
