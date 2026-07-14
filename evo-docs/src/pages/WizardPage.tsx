import { useState } from 'react'
import {
  EvoWizard, EvoForm, EvoInput, EvoSelect, EvoAlert, EvoButton, EvoDivider,
} from '@justin_evo/evo-ui'
import { CodeBlock } from '../components/CodeBlock'
import { PropsTable } from '../components/PropsTable'

function GatedDemo() {
  const [runKey, setRunKey] = useState(0)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [plan, setPlan] = useState('pro')
  const [completed, setCompleted] = useState(false)

  const accountValid = name.trim().length > 0 && email.trim().length > 0

  return (
    <div className="docs-preview col" style={{ width: '100%' }}>
      {completed ? (
        <EvoAlert type="success" title="Workspace created">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'flex-start' }}>
            <span>{name} — {email} — {plan} plan</span>
            <EvoButton
              label="Start over"
              size="sm"
              variant="outline"
              severity="secondary"
              onClick={() => {
                setName(''); setEmail(''); setPlan('pro')
                setCompleted(false); setRunKey((k) => k + 1)
              }}
            />
          </div>
        </EvoAlert>
      ) : (
        <EvoWizard key={runKey} style={{ maxWidth: 560, width: '100%' }} onComplete={() => setCompleted(true)}>
          <EvoWizard.Progress />

          <EvoWizard.Step id="account" title="Account" canAdvance={accountValid}>
            <EvoForm style={{ maxWidth: '100%' }}>
              <EvoForm.Field label="Full name" required>
                <EvoInput value={name} onChange={(e) => setName(e.target.value)} placeholder="Jane Doe" fullWidth />
              </EvoForm.Field>
              <EvoForm.Field label="Email" required>
                <EvoInput type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="jane@example.com" fullWidth />
              </EvoForm.Field>
            </EvoForm>
          </EvoWizard.Step>

          <EvoWizard.Step id="plan" title="Plan">
            <EvoForm style={{ maxWidth: '100%' }}>
              <EvoForm.Field label="Choose a plan">
                <EvoSelect
                  value={plan}
                  onChange={(v) => setPlan(v as string)}
                  fullWidth
                  options={[
                    { label: 'Starter', value: 'starter' },
                    { label: 'Pro', value: 'pro' },
                    { label: 'Enterprise', value: 'enterprise' },
                  ]}
                />
              </EvoForm.Field>
            </EvoForm>
          </EvoWizard.Step>

          <EvoWizard.Review title="Review your workspace">
            <EvoWizard.Review.Item label="Full name" step="account">{name || '—'}</EvoWizard.Review.Item>
            <EvoWizard.Review.Item label="Email" step="account">{email || '—'}</EvoWizard.Review.Item>
            <EvoWizard.Review.Item label="Plan" step="plan">{plan}</EvoWizard.Review.Item>
          </EvoWizard.Review>

          <EvoWizard.Actions finishLabel="Create workspace" />
        </EvoWizard>
      )}
    </div>
  )
}

function NonLinearDemo() {
  const [active, setActive] = useState(0)
  return (
    <div className="docs-preview col" style={{ width: '100%' }}>
      <EvoWizard
        style={{ maxWidth: 480, width: '100%' }}
        linear={false}
        activeStep={active}
        onStepChange={setActive}
        onComplete={() => alert('Wizard complete')}
      >
        <EvoWizard.Progress />
        <EvoWizard.Step id="one" title="Details">
          <p className="docs-section-desc" style={{ margin: 0 }}>
            Every marker below is a real button — click any of them to jump directly, in
            either direction.
          </p>
        </EvoWizard.Step>
        <EvoWizard.Step id="two" title="Preview">
          <p className="docs-section-desc" style={{ margin: 0 }}>Preview content.</p>
        </EvoWizard.Step>
        <EvoWizard.Step id="three" title="Publish">
          <p className="docs-section-desc" style={{ margin: 0 }}>Publish content.</p>
        </EvoWizard.Step>
        <EvoWizard.Actions />
      </EvoWizard>
    </div>
  )
}

export default function WizardPage() {
  return (
    <div>
      <div className="docs-page-header">
        <div className="docs-page-tag">Component</div>
        <h1 className="docs-page-title">EvoWizard</h1>
        <p className="docs-page-desc">
          A stateful multi-step orchestrator — checkout, onboarding, setup flows. Unlike{' '}
          <code>EvoForm</code>, which is purely presentational, EvoWizard owns the active step,
          gates advancement per step, and composes <code>EvoStepper</code>, <code>EvoForm</code>{' '}
          and <code>EvoButton</code> underneath one <code>activeStep</code> index.
        </p>
        <div className="docs-import-line">
          import {'{ '}<span>EvoWizard</span>{' }'} from '@justin_evo/evo-ui'
        </div>
      </div>

      <div className="docs-section">
        <div className="docs-section-title">Why EvoWizard</div>
        <p className="docs-section-desc">
          The IKEA effect says people value what they built with their own hands far more than
          what they were simply handed. A wizard's payoff step is the moment that effect either
          lands or falls flat — so <code>EvoWizard.Review</code> doesn't just print the user's
          answers as inert text. Each <code>EvoWizard.Review.Item</code> row ties its value back
          to the step it came from with a quiet "Edit" affordance that jumps straight there. The
          summary reads as "here is what <em>you</em> assembled," and it stays literally editable
          at the exact moment the user feels proudest of it. Everything else — spacing, the step
          entrance transition, button treatment — stays deliberately quiet.
        </p>
      </div>

      <div className="docs-section">
        <div className="docs-section-title">Gated flow with a review payoff</div>
        <p className="docs-section-desc">
          <code>canAdvance</code> on <code>EvoWizard.Step</code> gates the Next button —
          here it's wired to whether the account fields are filled in. The last step's button
          automatically becomes <strong>Finish</strong> once <code>EvoWizard.Review</code> is
          present; clicking it fires <code>onComplete</code>.
        </p>
        <GatedDemo />
        <CodeBlock code={`const [name, setName] = useState('')
const [email, setEmail] = useState('')
const [plan, setPlan] = useState('pro')

<EvoWizard onComplete={() => console.log('done')}>
  <EvoWizard.Progress />

  <EvoWizard.Step id="account" title="Account" canAdvance={!!name && !!email}>
    <EvoForm>
      <EvoForm.Field label="Full name" required>
        <EvoInput value={name} onChange={(e) => setName(e.target.value)} fullWidth />
      </EvoForm.Field>
      <EvoForm.Field label="Email" required>
        <EvoInput type="email" value={email} onChange={(e) => setEmail(e.target.value)} fullWidth />
      </EvoForm.Field>
    </EvoForm>
  </EvoWizard.Step>

  <EvoWizard.Step id="plan" title="Plan">
    <EvoForm>
      <EvoForm.Field label="Choose a plan">
        <EvoSelect value={plan} onChange={setPlan} options={planOptions} fullWidth />
      </EvoForm.Field>
    </EvoForm>
  </EvoWizard.Step>

  <EvoWizard.Review title="Review your workspace">
    <EvoWizard.Review.Item label="Full name" step="account">{name}</EvoWizard.Review.Item>
    <EvoWizard.Review.Item label="Email" step="account">{email}</EvoWizard.Review.Item>
    <EvoWizard.Review.Item label="Plan" step="plan">{plan}</EvoWizard.Review.Item>
  </EvoWizard.Review>

  <EvoWizard.Actions finishLabel="Create workspace" />
</EvoWizard>`} />
      </div>

      <div className="docs-section">
        <div className="docs-section-title">Linear vs. free navigation</div>
        <p className="docs-section-desc">
          <code>linear</code> defaults to <code>true</code>: <code>EvoWizard.Progress</code>{' '}
          stays a pure, non-clickable display and the only way forward is the gated Next/Finish
          button — <code>EvoStepper</code> has no per-step "not reachable yet" API, so a gated
          flow keeps its progress markers display-only rather than showing a clickable marker
          that silently refuses the click. Set <code>linear={'{false}'}</code> to make every
          marker a real, focusable button for free navigation in either direction — useful for
          an already-filled-in edit flow.
        </p>
        <NonLinearDemo />
        <CodeBlock code={`<EvoWizard linear={false} activeStep={active} onStepChange={setActive}>
  <EvoWizard.Progress />
  <EvoWizard.Step id="one" title="Details">…</EvoWizard.Step>
  <EvoWizard.Step id="two" title="Preview">…</EvoWizard.Step>
  <EvoWizard.Step id="three" title="Publish">…</EvoWizard.Step>
  <EvoWizard.Actions />
</EvoWizard>`} />
      </div>

      <div className="docs-section">
        <div className="docs-section-title">Controlled vs. uncontrolled</div>
        <p className="docs-section-desc">
          Leave <code>activeStep</code> unset (optionally pass <code>defaultStep</code>) for
          EvoWizard to own its own state — this is what the demos above do. Pass{' '}
          <code>activeStep</code> + <code>onStepChange</code> together, as the free-navigation
          demo does, when a parent needs to read or drive the current step (e.g. syncing it to
          a URL param).
        </p>
        <CodeBlock code={`// Uncontrolled — EvoWizard owns the index
<EvoWizard defaultStep={0} onStepChange={(i) => console.log('now on', i)}>…</EvoWizard>

// Controlled — the parent owns the index
const [step, setStep] = useState(0)
<EvoWizard activeStep={step} onStepChange={setStep}>…</EvoWizard>`} />
      </div>

      <EvoDivider />

      <div className="docs-section">
        <div className="docs-section-title">EvoWizard props</div>
        <PropsTable props={[
          { prop: 'activeStep',   type: 'number',                    description: 'Controlled 0-based active step index. Pair with `onStepChange`; `defaultStep` is ignored while set.' },
          { prop: 'defaultStep',  type: 'number', default: '0',       description: 'Initial active step index for uncontrolled use.' },
          { prop: 'onStepChange', type: '(index: number) => void',    description: 'Called with the new index on Next, Back, a Progress click, or a Review "Edit" jump.' },
          { prop: 'onComplete',   type: '() => void',                 description: 'Called when Finish is clicked — on the last step (no Review) or on the Review step.' },
          { prop: 'linear',       type: 'boolean', default: 'true',   description: 'When true, Progress stays a non-clickable display and Next/Finish (gated by `canAdvance`) is the only way forward. When false, every Progress marker is clickable for free navigation.' },
          { prop: 'children',     type: 'ReactNode', required: true,  description: 'EvoWizard.Progress, one or more EvoWizard.Step, an optional EvoWizard.Review, and EvoWizard.Actions.' },
          { prop: 'className',    type: 'string',                     description: 'Additional CSS class on the root.' },
        ]} />
      </div>

      <div className="docs-section">
        <div className="docs-section-title">EvoWizard.Step props</div>
        <PropsTable props={[
          { prop: 'id',          type: 'string',                    description: 'Stable identifier. Referenced by EvoWizard.Review.Item\'s `step` prop. Defaults to the 0-based position.' },
          { prop: 'title',       type: 'ReactNode', required: true,  description: 'Step label, shown in EvoWizard.Progress.' },
          { prop: 'canAdvance',  type: 'boolean', default: 'true',   description: 'Gates the Next/Finish button while this step is active. Wire it to your own validation.' },
          { prop: 'children',    type: 'ReactNode', required: true,  description: 'The step\'s content — typically an EvoForm.' },
        ]} />
      </div>

      <div className="docs-section">
        <div className="docs-section-title">EvoWizard.Progress props</div>
        <PropsTable props={[
          { prop: 'orientation', type: "'horizontal' | 'vertical'",           default: "'horizontal'", description: 'Forwarded to the underlying EvoStepper.' },
          { prop: 'severity',    type: "'primary' | 'success' | 'info'",      default: "'primary'",    description: 'Accent for the current step\'s marker/title, forwarded to EvoStepper.' },
          { prop: 'size',        type: "'sm' | 'md' | 'lg'",                  default: "'md'",         description: 'Forwarded to EvoStepper.' },
        ]} />
      </div>

      <div className="docs-section">
        <div className="docs-section-title">EvoWizard.Review / EvoWizard.Review.Item props</div>
        <PropsTable props={[
          { prop: 'title (Review)',      type: 'ReactNode',                 description: 'Heading shown above the review rows.' },
          { prop: 'children (Review)',   type: 'ReactNode', required: true,  description: 'One or more EvoWizard.Review.Item rows.' },
          { prop: 'label (Review.Item)', type: 'ReactNode', required: true,  description: 'Row label.' },
          { prop: 'step (Review.Item)',  type: 'string | number',           description: 'The originating EvoWizard.Step id or index. Renders an Edit affordance that jumps there.' },
          { prop: 'editLabel (Review.Item)', type: 'string', default: "'Edit'", description: 'Text for the edit affordance.' },
          { prop: 'children (Review.Item)',  type: 'ReactNode', required: true, description: 'The value to display.' },
        ]} />
      </div>

      <div className="docs-section">
        <div className="docs-section-title">EvoWizard.Actions props</div>
        <PropsTable props={[
          { prop: 'backLabel',   type: 'string', default: "'Back'",   description: 'Label for the back button.' },
          { prop: 'nextLabel',   type: 'string', default: "'Next'",   description: 'Label for the forward button on non-final steps.' },
          { prop: 'finishLabel', type: 'string', default: "'Finish'", description: 'Label for the forward button on the final action; the button also switches to the success severity.' },
        ]} />
      </div>

      <div className="docs-section">
        <div className="docs-section-title">Accessibility</div>
        <ul className="docs-list">
          <li>
            Each active step's content renders in a <code>role="group"</code> region labelled
            by its title; inactive steps unmount rather than being visually hidden.
          </li>
          <li>
            <code>EvoWizard.Progress</code> is <code>EvoStepper</code> underneath, so it
            inherits its semantics: a real <code>&lt;ol&gt;</code>/<code>&lt;li&gt;</code> list,
            <code>aria-current="step"</code> on the current step, and an{' '}
            <code>aria-live="polite"</code> region announcing step changes.
          </li>
          <li>
            Back and Next/Finish in <code>EvoWizard.Actions</code> are real{' '}
            <code>&lt;button type="button"&gt;</code> elements with a visible{' '}
            <code>:focus-visible</code> ring; Back is disabled (not hidden) on the first step so
            layout stays stable.
          </li>
          <li>
            The Review "Edit" affordance is a real button with an <code>aria-label</code> like
            "Edit Email" when its label is plain text.
          </li>
          <li>
            The step entrance transition and the Review Edit button's hover/active transition
            both respect <code>prefers-reduced-motion</code>.
          </li>
        </ul>
      </div>
    </div>
  )
}
