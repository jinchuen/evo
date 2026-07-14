import { useState } from 'react'
import { EvoStepper, EvoButton, EvoDivider } from '@justin_evo/evo-ui'
import { CodeBlock } from '../components/CodeBlock'
import { PropsTable } from '../components/PropsTable'

const orderSteps = [
  { title: 'Cart', description: 'Review items' },
  { title: 'Shipping', description: 'Delivery address' },
  { title: 'Payment', description: 'Card details' },
  { title: 'Confirm', description: 'Place order' },
]

export default function StepperPage() {
  const [active, setActive] = useState(1)

  return (
    <div>
      <div className="docs-page-header">
        <div className="docs-page-tag">Component</div>
        <h1 className="docs-page-title">EvoStepper</h1>
        <p className="docs-page-desc">
          A semantic, ordered progress indicator for multi-step flows — checkout, onboarding,
          wizards. Renders a real <code>&lt;ol&gt;</code>/<code>&lt;li&gt;</code> list, derives
          each step's status from a single <code>active</code> index, and composes from{' '}
          <code>EvoStepper.Step</code> so a step's label or description can be any JSX.
        </p>
        <div className="docs-import-line">
          import {'{ '}<span>EvoStepper</span>{' }'} from '@justin_evo/evo-ui'
        </div>
      </div>

      <div className="docs-section">
        <div className="docs-section-title">Why EvoStepper</div>
        <p className="docs-section-desc">
          The goal-gradient effect says people push harder the closer they feel to a finish
          line — and a flow should never make the user feel like they're starting from
          nothing. EvoStepper's one deliberate flourish serves that directly: the connector
          line after a <strong>completed</strong> step fills solid in the success color and
          eases into place as <code>active</code> advances, so progress already made always
          reads as a visibly "banked" line rather than just a numbered dot. Every other part
          of the component — markers, spacing, focus rings — stays quiet on purpose.
        </p>
      </div>

      <div className="docs-section">
        <div className="docs-section-title">Basic usage</div>
        <p className="docs-section-desc">
          Pass <code>active</code> (0-based) once; every <code>EvoStepper.Step</code> derives
          its own status automatically — no per-step booleans to keep in sync.
        </p>
        <div className="docs-preview center">
          <EvoStepper active={active} style={{ width: '100%', maxWidth: 640 }}>
            {orderSteps.map((s) => (
              <EvoStepper.Step key={s.title} title={s.title} description={s.description} />
            ))}
          </EvoStepper>
        </div>
        <div className="docs-preview" style={{ gap: '0.5rem' }}>
          <EvoButton
            label="Back"
            variant="outline"
            size="sm"
            disabled={active === 0}
            onClick={() => setActive((a) => Math.max(0, a - 1))}
          />
          <EvoButton
            label="Next"
            size="sm"
            disabled={active === orderSteps.length - 1}
            onClick={() => setActive((a) => Math.min(orderSteps.length - 1, a + 1))}
          />
        </div>
        <CodeBlock code={`const [active, setActive] = useState(1)

<EvoStepper active={active}>
  <EvoStepper.Step title="Cart" description="Review items" />
  <EvoStepper.Step title="Shipping" description="Delivery address" />
  <EvoStepper.Step title="Payment" description="Card details" />
  <EvoStepper.Step title="Confirm" description="Place order" />
</EvoStepper>`} />
      </div>

      <div className="docs-section">
        <div className="docs-section-title">Orientation</div>
        <p className="docs-section-desc">
          <code>orientation="vertical"</code> stacks steps top-to-bottom — useful in a sidebar
          or a narrow panel where a horizontal row would wrap.
        </p>
        <div className="docs-preview center">
          <EvoStepper active={1} orientation="vertical" style={{ width: '100%', maxWidth: 320 }}>
            <EvoStepper.Step title="Account details" description="Name and email" />
            <EvoStepper.Step title="Verify email" description="Check your inbox" />
            <EvoStepper.Step title="Set up workspace" description="Name your team" />
          </EvoStepper>
        </div>
        <CodeBlock code={`<EvoStepper active={1} orientation="vertical">
  <EvoStepper.Step title="Account details" description="Name and email" />
  <EvoStepper.Step title="Verify email" description="Check your inbox" />
  <EvoStepper.Step title="Set up workspace" description="Name your team" />
</EvoStepper>`} />
      </div>

      <div className="docs-section">
        <div className="docs-section-title">Severity (current step accent)</div>
        <p className="docs-section-desc">
          <code>severity</code> only recolors the <strong>current</strong> step's marker and
          title. Completed and errored steps keep their own fixed semantic colors (success /
          danger) regardless of <code>severity</code> — those colors carry meaning that
          shouldn't be reinterpreted per flow.
        </p>
        <div className="docs-preview" style={{ flexWrap: 'wrap', gap: '2rem', alignItems: 'flex-start' }}>
          {(['primary', 'success', 'info'] as const).map((sev) => (
            <EvoStepper key={sev} active={1} severity={sev} style={{ width: 220 }}>
              <EvoStepper.Step title="Step one" />
              <EvoStepper.Step title="Step two" />
              <EvoStepper.Step title="Step three" />
            </EvoStepper>
          ))}
        </div>
        <CodeBlock code={`<EvoStepper active={1} severity="success">…</EvoStepper>`} />
      </div>

      <div className="docs-section">
        <div className="docs-section-title">Sizes</div>
        <div className="docs-preview" style={{ flexDirection: 'column', gap: '1.5rem', alignItems: 'stretch' }}>
          {(['sm', 'md', 'lg'] as const).map((sz) => (
            <EvoStepper key={sz} active={1} size={sz}>
              <EvoStepper.Step title="Step one" />
              <EvoStepper.Step title="Step two" />
              <EvoStepper.Step title="Step three" />
            </EvoStepper>
          ))}
        </div>
        <CodeBlock code={`<EvoStepper active={1} size="sm">…</EvoStepper>`} />
      </div>

      <div className="docs-section">
        <div className="docs-section-title">Error status</div>
        <p className="docs-section-desc">
          Override a single step's derived status with <code>status="error"</code> to flag a
          failure regardless of its position relative to <code>active</code>.
        </p>
        <div className="docs-preview center">
          <EvoStepper active={2} style={{ width: '100%', maxWidth: 560 }}>
            <EvoStepper.Step title="Upload" />
            <EvoStepper.Step title="Validate" status="error" description="File format rejected" />
            <EvoStepper.Step title="Publish" />
          </EvoStepper>
        </div>
        <CodeBlock code={`<EvoStepper.Step title="Validate" status="error" description="File format rejected" />`} />
      </div>

      <div className="docs-section">
        <div className="docs-section-title">Clickable steps</div>
        <p className="docs-section-desc">
          Pass <code>onStepClick</code> on the root and every marker becomes a real, focusable{' '}
          <code>&lt;button type="button"&gt;</code> — this is what makes a step navigable, so
          only pass it when jumping between steps is actually allowed.
        </p>
        <div className="docs-preview center">
          <EvoStepper active={active} onStepClick={setActive} style={{ width: '100%', maxWidth: 640 }}>
            {orderSteps.map((s) => (
              <EvoStepper.Step key={s.title} title={s.title} description={s.description} />
            ))}
          </EvoStepper>
        </div>
        <CodeBlock code={`<EvoStepper active={active} onStepClick={setActive}>
  <EvoStepper.Step title="Cart" />
  <EvoStepper.Step title="Shipping" />
  <EvoStepper.Step title="Payment" />
  <EvoStepper.Step title="Confirm" />
</EvoStepper>`} />
      </div>

      <EvoDivider />

      <div className="docs-section">
        <div className="docs-section-title">EvoStepper props</div>
        <PropsTable props={[
          { prop: 'active',      type: 'number', required: true,                                     description: '0-based index of the current step. Drives every step’s derived status.' },
          { prop: 'orientation', type: "'horizontal' | 'vertical'",                default: "'horizontal'", description: 'Layout direction.' },
          { prop: 'severity',    type: "'primary' | 'success' | 'info'",          default: "'primary'",    description: 'Accent for the current step’s marker and title. Complete/error keep fixed colors.' },
          { prop: 'size',        type: "'sm' | 'md' | 'lg'",                      default: "'md'",         description: 'Marker diameter and type scale.' },
          { prop: 'onStepClick', type: '(index: number) => void',                                     description: 'When set, every step marker renders as a focusable button that calls this on activation.' },
          { prop: 'children',    type: 'ReactNode', required: true,                                    description: 'One <EvoStepper.Step> per step.' },
          { prop: 'className',   type: 'string',                                                       description: 'Additional CSS class on the root <ol>.' },
        ]} />
      </div>

      <div className="docs-section">
        <div className="docs-section-title">EvoStepper.Step props</div>
        <PropsTable props={[
          { prop: 'title',       type: 'ReactNode', required: true,                                   description: 'Step label.' },
          { prop: 'description', type: 'ReactNode',                                                    description: 'Optional supporting copy under the title.' },
          { prop: 'icon',        type: 'ReactNode',                                                    description: 'Custom marker content. Defaults to the step number, or a check / warning glyph for complete / error.' },
          { prop: 'status',      type: "'complete' | 'current' | 'upcoming' | 'error'",                description: 'Override the status this step would otherwise derive from the parent’s active index. Use for an error state.' },
          { prop: 'className',   type: 'string',                                                       description: 'Additional CSS class on the <li>.' },
        ]} />
      </div>

      <div className="docs-section">
        <div className="docs-section-title">Accessibility</div>
        <ul className="docs-list">
          <li>
            The root is a real <code>&lt;ol&gt;</code> and every step a real <code>&lt;li&gt;</code>
            — assistive tech gets list semantics and per-item position ("1 of 4") for free.
          </li>
          <li>
            The current step carries <code>aria-current="step"</code>.
          </li>
          <li>
            A visually-hidden <code>aria-live="polite"</code> region announces "Step 2 of 4:
            Shipping" whenever <code>active</code> changes, so screen-reader users following a
            multi-step flow hear progress without re-reading the whole list.
          </li>
          <li>
            When <code>onStepClick</code> is supplied, markers are real <code>&lt;button
            type="button"&gt;</code> elements — keyboard reachable, with a visible{' '}
            <code>:focus-visible</code> ring and an <code>aria-label</code> ("Go to step 2:
            Shipping"). Without <code>onStepClick</code> the stepper is purely a progress
            display and markers are not focusable.
          </li>
          <li>
            Marker glyphs (numbers, check, warning) are <code>aria-hidden</code> — the list
            numbering and the visible title text already carry that information, so it isn't
            announced twice.
          </li>
          <li>
            All transitions (marker color, connector fill) respect{' '}
            <code>prefers-reduced-motion</code>.
          </li>
        </ul>
      </div>
    </div>
  )
}
