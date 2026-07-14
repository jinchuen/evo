import { useState } from 'react'
import { EvoButton, EvoDivider, EvoProgressRing, EvoStack } from '@justin_evo/evo-ui'
import { CodeBlock } from '../components/CodeBlock'
import { PropsTable } from '../components/PropsTable'

const StarIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2l2.9 6.6 7.1.6-5.4 4.7 1.7 7-6.3-3.9L5.7 21l1.7-7L2 9.2l7.1-.6L12 2z" />
  </svg>
)

function LiveDemo() {
  const [value, setValue] = useState(35)
  return (
    <EvoStack direction="row" gap="1rem" align="center" wrap>
      <EvoProgressRing value={value} severity="primary" size="lg" />
      <EvoStack direction="row" gap="0.5rem">
        <EvoButton
          label="-10"
          size="sm"
          variant="outline"
          onClick={() => setValue((v) => Math.max(0, v - 10))}
        />
        <EvoButton
          label="+10"
          size="sm"
          onClick={() => setValue((v) => Math.min(100, v + 10))}
        />
      </EvoStack>
    </EvoStack>
  )
}

export default function ProgressRingPage() {
  return (
    <div>
      <div className="docs-page-header">
        <div className="docs-page-tag">Component</div>
        <h1 className="docs-page-title">EvoProgressRing</h1>
        <p className="docs-page-desc">
          A compact radial indicator for dashboard tiles, tier badges, and card
          summaries — two stacked SVG circles with a customizable center slot,
          for places where a full-width <code>EvoProgress</code> bar doesn't fit.
        </p>
        <div className="docs-import-line">
          import {'{ '}<span>EvoProgressRing</span>{' }'} from '@justin_evo/evo-ui'
        </div>
      </div>

      {/* ---------- Why ---------- */}
      <div className="docs-section">
        <div className="docs-section-title">Why EvoProgressRing</div>
        <p className="docs-section-desc">
          People push harder the closer they perceive themselves to be to a
          goal — the goal-gradient effect. A ring rendered at a literal 0% is
          visually indistinguishable from broken or unloaded: a hollow circle
          with no arc at all. <code>minVisible</code> is a purely visual floor
          on the drawn arc — the same mechanism as <code>EvoProgress</code>'s{' '}
          <code>minVisible</code> — that guarantees a small sliver of the
          indicator arc is drawn even at <code>value={'{0}'}</code>, without
          ever touching <code>aria-valuenow</code>, <code>aria-valuetext</code>,
          or the default center label; those always report the real
          percentage. It defaults to <code>0</code> (off), because a real 0%
          is often a legitimate, honest state — set it explicitly (e.g.{' '}
          <code>minVisible={'{4}'}</code>) for the specific tiles where a
          felt head-start matters, like an onboarding-progress widget (see{' '}
          <em>Never starting at 0%</em> below).
        </p>
      </div>

      {/* ---------- Basic usage ---------- */}
      <div className="docs-section">
        <div className="docs-section-title">Basic usage</div>
        <p className="docs-section-desc">
          Pass <code>value</code> (and optionally <code>max</code>, default{' '}
          <code>100</code>). The center label defaults to the rounded
          percentage.
        </p>
        <div className="docs-preview">
          <EvoProgressRing value={72} />
          <EvoProgressRing value={3} max={5} />
        </div>
        <CodeBlock code={`<EvoProgressRing value={72} />
<EvoProgressRing value={3} max={5} />`} />
      </div>

      {/* ---------- Severities ---------- */}
      <div className="docs-section">
        <div className="docs-section-title">Severities</div>
        <p className="docs-section-desc">
          <code>severity</code> colors only the indicator arc — the track
          stays neutral in every severity so the arc itself always carries
          the signal.
        </p>
        <div className="docs-preview">
          <EvoProgressRing value={64} severity="primary" />
          <EvoProgressRing value={64} severity="success" />
          <EvoProgressRing value={64} severity="warning" />
          <EvoProgressRing value={64} severity="danger" />
          <EvoProgressRing value={64} severity="info" />
        </div>
        <CodeBlock code={`<EvoProgressRing value={64} severity="primary" />
<EvoProgressRing value={64} severity="success" />
<EvoProgressRing value={64} severity="warning" />
<EvoProgressRing value={64} severity="danger" />
<EvoProgressRing value={64} severity="info" />`} />
      </div>

      {/* ---------- Sizes ---------- */}
      <div className="docs-section">
        <div className="docs-section-title">Sizes</div>
        <p className="docs-section-desc">
          <code>size</code> accepts <code>sm</code> (48px), <code>md</code>{' '}
          (72px, default), <code>lg</code> (96px), or any explicit diameter in
          pixels. <code>thickness</code> scales with the diameter automatically
          but can be overridden.
        </p>
        <div className="docs-preview">
          <EvoProgressRing value={55} size="sm" />
          <EvoProgressRing value={55} size="md" />
          <EvoProgressRing value={55} size="lg" />
          <EvoProgressRing value={55} size={140} thickness={10} />
        </div>
        <CodeBlock code={`<EvoProgressRing value={55} size="sm" />
<EvoProgressRing value={55} size="md" />
<EvoProgressRing value={55} size="lg" />
<EvoProgressRing value={55} size={140} thickness={10} />`} />
      </div>

      {/* ---------- Never starting at 0% ---------- */}
      <div className="docs-section">
        <div className="docs-section-title">Never starting at 0%</div>
        <p className="docs-section-desc">
          Both rings below report <code>value={'{0}'}</code> — identical
          state, identical <code>aria-valuenow</code>. The left one is the
          default (<code>minVisible={'{0}'}</code>): an honest, literal empty
          ring. The right one opts into the goal-gradient nudge with{' '}
          <code>minVisible={'{4}'}</code>, e.g. for a freshly-created
          onboarding-progress tile that should never look broken.
        </p>
        <div className="docs-preview">
          <EvoStack direction="column" gap="0.4rem" align="center">
            <EvoProgressRing value={0} severity="success" />
            <span>default (minVisible=0)</span>
          </EvoStack>
          <EvoStack direction="column" gap="0.4rem" align="center">
            <EvoProgressRing value={0} severity="success" minVisible={4} />
            <span>minVisible=4</span>
          </EvoStack>
        </div>
        <CodeBlock code={`<EvoProgressRing value={0} severity="success" />
<EvoProgressRing value={0} severity="success" minVisible={4} />`} />
      </div>

      {/* ---------- Center content ---------- */}
      <div className="docs-section">
        <div className="docs-section-title">Center content</div>
        <p className="docs-section-desc">
          Pass <code>children</code> to replace the default percentage label
          — a tier icon, an "X of N" count, anything. <code>svg</code>{' '}
          children are auto-sized to <code>1em</code>, matching the{' '}
          <code>EvoButton</code> icon convention. The accessible{' '}
          <code>aria-valuetext</code> still reports the true percentage
          regardless of what's shown visually.
        </p>
        <div className="docs-preview">
          <EvoProgressRing value={80} severity="warning" size="lg">
            <StarIcon />
          </EvoProgressRing>
          <EvoProgressRing value={3} max={5} severity="info" size="lg">
            3 / 5
          </EvoProgressRing>
          <EvoProgressRing value={100} severity="success" showValue={false} />
        </div>
        <CodeBlock code={`<EvoProgressRing value={80} severity="warning" size="lg">
  <StarIcon />
</EvoProgressRing>

<EvoProgressRing value={3} max={5} severity="info" size="lg">
  3 / 5
</EvoProgressRing>

{/* No children and showValue={false} → empty center */}
<EvoProgressRing value={100} severity="success" showValue={false} />`} />
      </div>

      {/* ---------- Live / animated ---------- */}
      <div className="docs-section">
        <div className="docs-section-title">Live updates</div>
        <p className="docs-section-desc">
          <code>animated</code> (default <code>true</code>) transitions the
          arc smoothly when <code>value</code> changes, and is disabled
          automatically under <code>prefers-reduced-motion: reduce</code>.
        </p>
        <LiveDemo />
        <CodeBlock code={`const [value, setValue] = useState(35)

<EvoProgressRing value={value} severity="primary" size="lg" />
<EvoButton label="+10" onClick={() => setValue((v) => Math.min(100, v + 10))} />`} />
      </div>

      <EvoDivider className="docs-section" />

      {/* ---------- Props ---------- */}
      <div className="docs-section">
        <div className="docs-section-title">Props</div>
        <PropsTable props={[
          { prop: 'value', type: 'number', required: true, description: 'Current value. Clamped to [0, max].' },
          { prop: 'max', type: 'number', default: '100', description: 'The value that represents 100%.' },
          { prop: 'minVisible', type: 'number', default: '0', description: 'Visual-only floor on the rendered arc percentage (0-100), applied even at value=0. Off by default. Never affects aria-valuenow/aria-valuetext or the default center label — those always report the real percentage.' },
          { prop: 'severity', type: "'primary' | 'success' | 'warning' | 'danger' | 'info'", default: "'primary'", description: 'Semantic color of the indicator arc. The track stays neutral in every severity.' },
          { prop: 'size', type: "'sm' | 'md' | 'lg' | number", default: "'md'", description: "Named size (sm=48px, md=72px, lg=96px) or an explicit diameter in pixels." },
          { prop: 'thickness', type: 'number', description: 'Stroke width in pixels. Defaults to a value proportional to the diameter.' },
          { prop: 'showValue', type: 'boolean', default: 'true', description: 'Show the rounded percentage as the default center content when no children are provided.' },
          { prop: 'children', type: 'ReactNode', description: "Custom center content (tier icon, \"3 of 5\", …). Overrides showValue. `<svg>` children auto-size to 1em." },
          { prop: 'animated', type: 'boolean', default: 'true', description: 'Animate the arc transitioning to a new value. Always disabled under prefers-reduced-motion: reduce.' },
          { prop: '...rest', type: 'HTMLAttributes<HTMLDivElement>', description: 'All native div attributes (aria-*, onClick, …) forward to the root. Forwards ref to the underlying <div>.' },
        ]} />
      </div>

      {/* ---------- Accessibility ---------- */}
      <div className="docs-section">
        <div className="docs-section-title">Accessibility</div>
        <ul className="docs-list">
          <li>
            Renders <code>role="progressbar"</code> with{' '}
            <code>aria-valuenow</code>, <code>aria-valuemin={'{0}'}</code>,{' '}
            <code>aria-valuemax</code>, and an <code>aria-valuetext</code>{' '}
            percentage string — screen readers always get the true value, even
            when the visual arc is nudged by <code>minVisible</code> or the
            center slot shows a custom icon instead of a number.
          </li>
          <li>
            The SVG is <code>aria-hidden="true"</code> — the accessible name
            and value come entirely from the root's ARIA attributes, not from
            reading shapes.
          </li>
          <li>
            Passive status display, not an interactive control: it holds no
            focus and has no keyboard interaction, matching the native{' '}
            <code>progressbar</code> role's expected behavior.
          </li>
          <li>
            The arc transition is removed entirely under{' '}
            <code>prefers-reduced-motion: reduce</code>, regardless of the{' '}
            <code>animated</code> prop — the ring still jumps straight to the
            correct value.
          </li>
          <li>
            Center-label digits use <code>font-variant-numeric: tabular-nums</code>{' '}
            so the layout doesn't shift width as the percentage changes.
          </li>
        </ul>
      </div>
    </div>
  )
}
