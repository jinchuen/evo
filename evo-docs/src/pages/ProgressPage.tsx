import { useEffect, useState } from 'react'
import { EvoProgress, EvoDivider, EvoStack, EvoButton } from '@justin_evo/evo-ui'
import { CodeBlock } from '../components/CodeBlock'
import { PropsTable } from '../components/PropsTable'

function ZeroStartDemo() {
  const [withFloor, setWithFloor] = useState(false)
  return (
    <div style={{ width: '100%', maxWidth: 420, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      <EvoProgress
        value={0}
        minVisible={withFloor ? 8 : 0}
        label="Profile setup"
        showValue
      />
      <EvoStack direction="row" gap="0.5rem">
        <EvoButton
          label={withFloor ? 'minVisible={8}' : 'minVisible={0} (default)'}
          size="sm"
          variant="outline"
          onClick={() => setWithFloor((v) => !v)}
        />
      </EvoStack>
    </div>
  )
}

function UploadDemo() {
  const [value, setValue] = useState(0)
  useEffect(() => {
    const id = setInterval(() => {
      setValue((v) => (v >= 100 ? 0 : Math.min(100, v + 7)))
    }, 400)
    return () => clearInterval(id)
  }, [])
  return (
    <EvoProgress
      value={value}
      minVisible={6}
      label="Uploading design-assets.zip"
      showValue
      severity={value >= 100 ? 'success' : 'primary'}
    />
  )
}

export default function ProgressPage() {
  return (
    <div>
      <div className="docs-page-header">
        <div className="docs-page-tag">Component</div>
        <h1 className="docs-page-title">EvoProgress</h1>
        <p className="docs-page-desc">
          A determinate or indeterminate progress bar. Its differentiator is{' '}
          <code>minVisible</code> — a purely visual floor on the rendered fill, so a bar at{' '}
          <code>value={'{'}0{'}'}</code> still shows momentum instead of reading as empty, while{' '}
          <code>aria-valuenow</code> keeps reporting the true value to assistive tech.
        </p>
        <div className="docs-import-line">
          import {'{ '}<span>EvoProgress</span>{' }'} from '@justin_evo/evo-ui'
        </div>
      </div>

      {/* ---------- Why EvoProgress ---------- */}
      <div className="docs-section">
        <div className="docs-section-title">Why the fill floor</div>
        <p className="docs-section-desc">
          The goal-gradient effect: motivation to finish rises the closer someone perceives
          themselves to be to the goal — and a bar that starts at a literal 0% width reads as
          "nothing has happened yet." <code>minVisible</code> sets a floor on the rendered
          percentage only; it never changes what's announced to screen readers. Toggle the
          control below — the fill on the left edge is the only thing that changes.
        </p>
        <div className="docs-preview col">
          <ZeroStartDemo />
        </div>
        <CodeBlock code={`<EvoProgress
  value={0}
  minVisible={8}
  label="Profile setup"
  showValue
/>`} />
      </div>

      {/* ---------- Basic usage ---------- */}
      <div className="docs-section">
        <div className="docs-section-title">Basic usage</div>
        <p className="docs-section-desc">
          <code>value</code> and <code>max</code> (default <code>100</code>) are the only
          required inputs. The fill width tracks <code>value / max</code> and animates on
          change unless <code>animated={'{'}false{'}'}</code> or the user prefers reduced motion.
        </p>
        <div className="docs-preview col">
          <EvoProgress value={25} />
          <EvoProgress value={60} />
          <EvoProgress value={90} />
        </div>
        <CodeBlock code={`<EvoProgress value={25} />
<EvoProgress value={60} />
<EvoProgress value={90} />`} />
      </div>

      {/* ---------- Severities ---------- */}
      <div className="docs-section">
        <div className="docs-section-title">Severities</div>
        <p className="docs-section-desc">
          Five semantic colors, orthogonal to every other prop.
        </p>
        <div className="docs-preview col">
          <EvoProgress value={70} severity="primary" label="Primary" />
          <EvoProgress value={70} severity="success" label="Success" />
          <EvoProgress value={70} severity="warning" label="Warning" />
          <EvoProgress value={70} severity="danger" label="Danger" />
          <EvoProgress value={70} severity="info" label="Info" />
        </div>
        <CodeBlock code={`<EvoProgress value={70} severity="primary" label="Primary" />
<EvoProgress value={70} severity="success" label="Success" />
<EvoProgress value={70} severity="warning" label="Warning" />
<EvoProgress value={70} severity="danger"  label="Danger" />
<EvoProgress value={70} severity="info"    label="Info" />`} />
      </div>

      {/* ---------- Sizes ---------- */}
      <div className="docs-section">
        <div className="docs-section-title">Sizes</div>
        <p className="docs-section-desc">
          <code>size</code> controls track height only — <code>sm</code> (6px),{' '}
          <code>md</code> (8px, default), <code>lg</code> (12px).
        </p>
        <div className="docs-preview col">
          <EvoProgress value={55} size="sm" />
          <EvoProgress value={55} size="md" />
          <EvoProgress value={55} size="lg" />
        </div>
        <CodeBlock code={`<EvoProgress value={55} size="sm" />
<EvoProgress value={55} size="md" />
<EvoProgress value={55} size="lg" />`} />
      </div>

      {/* ---------- Label & value ---------- */}
      <div className="docs-section">
        <div className="docs-section-title">Label & value</div>
        <p className="docs-section-desc">
          <code>label</code> renders a caption above the track and doubles as the accessible
          name via <code>aria-labelledby</code>. <code>showValue</code> renders the formatted
          value alongside it; override the format with <code>valueFormat</code>.
        </p>
        <div className="docs-preview col">
          <EvoProgress value={42} label="Storage used" showValue />
          <EvoProgress
            value={640}
            max={1000}
            label="Downloaded"
            showValue
            valueFormat={(v, max) => `${v} / ${max} MB`}
          />
        </div>
        <CodeBlock code={`<EvoProgress value={42} label="Storage used" showValue />

<EvoProgress
  value={640}
  max={1000}
  label="Downloaded"
  showValue
  valueFormat={(v, max) => \`\${v} / \${max} MB\`}
/>`} />
      </div>

      {/* ---------- Indeterminate ---------- */}
      <div className="docs-section">
        <div className="docs-section-title">Indeterminate</div>
        <p className="docs-section-desc">
          For unknown-duration work. The fill becomes a sliding indicator carrying a soft
          glow in its own severity color, and <code>aria-valuenow</code> is omitted entirely
          (per WAI-ARIA) rather than reporting a fake number.
        </p>
        <div className="docs-preview col">
          <EvoProgress indeterminate label="Connecting…" />
          <EvoProgress indeterminate severity="danger" label="Rolling back…" />
        </div>
        <CodeBlock code={`<EvoProgress indeterminate label="Connecting…" />
<EvoProgress indeterminate severity="danger" label="Rolling back…" />`} />
      </div>

      {/* ---------- Live example ---------- */}
      <div className="docs-section">
        <div className="docs-section-title">Live example</div>
        <p className="docs-section-desc">
          A simulated upload: starts with a <code>minVisible</code> head start, ticks up, and
          flips to <code>success</code> severity at 100%.
        </p>
        <div className="docs-preview col" style={{ width: '100%', maxWidth: 420 }}>
          <UploadDemo />
        </div>
        <CodeBlock code={`function UploadProgress() {
  const [value, setValue] = useState(0)
  // ...tick value up as chunks complete...

  return (
    <EvoProgress
      value={value}
      minVisible={6}
      label="Uploading design-assets.zip"
      showValue
      severity={value >= 100 ? 'success' : 'primary'}
    />
  )
}`} />
      </div>

      <EvoDivider className="docs-section" />

      {/* ---------- Props ---------- */}
      <div className="docs-section">
        <div className="docs-section-title">Props</div>
        <PropsTable props={[
          { prop: 'value', type: 'number', default: '0', required: false, description: 'Current value, in the same units as `max`. Clamped to `[0, max]`.' },
          { prop: 'max', type: 'number', default: '100', description: 'Upper bound of `value`.' },
          { prop: 'minVisible', type: 'number', default: '0', description: 'Visual-only floor (0-100) on the rendered fill percentage. Never affects `aria-valuenow`.' },
          { prop: 'severity', type: "'primary' | 'success' | 'warning' | 'danger' | 'info'", default: "'primary'", description: 'Semantic color of the fill.' },
          { prop: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Track height.' },
          { prop: 'indeterminate', type: 'boolean', default: 'false', description: 'Unknown-duration mode: a sliding indicator instead of a fixed-width fill. Omits `aria-valuenow`.' },
          { prop: 'showValue', type: 'boolean', default: 'false', description: 'Renders the formatted value next to `label`. Ignored while `indeterminate`.' },
          { prop: 'valueFormat', type: '(value: number, max: number) => string', default: 'percentage, e.g. "42%"', description: 'Formats the text shown when `showValue` is true.' },
          { prop: 'label', type: 'ReactNode', description: 'Optional caption above the track. Also becomes the accessible name via `aria-labelledby`.' },
          { prop: 'animated', type: 'boolean', default: 'true', description: 'Animates width changes and the indeterminate sweep. Disabled automatically under `prefers-reduced-motion`.' },
          { prop: 'className', type: 'string', description: "Appended to the component's own classes on the root element." },
          { prop: '...rest', type: 'HTMLAttributes<HTMLDivElement>', description: 'All native div attributes (`aria-*`, `data-*`, `style`, …). Forwards `ref` to the root element, which carries `role="progressbar"`.' },
        ]} />
      </div>

      {/* ---------- Accessibility ---------- */}
      <div className="docs-section">
        <div className="docs-section-title">Accessibility</div>
        <ul className="docs-list">
          <li>
            The root carries <code>role="progressbar"</code>, <code>aria-valuemin={'{'}0{'}'}</code>,{' '}
            <code>aria-valuemax</code> (= <code>max</code>), and <code>aria-valuenow</code> (=
            the clamped true <code>value</code>) — never the visually floored number from{' '}
            <code>minVisible</code>.
          </li>
          <li>
            While <code>indeterminate</code>, <code>aria-valuenow</code> is omitted entirely
            rather than set to a placeholder, per the WAI-ARIA Authoring Practices guidance for
            progressbars with an unknown value.
          </li>
          <li>
            When <code>label</code> is provided, its rendered <code>&lt;span&gt;</code> is
            referenced via <code>aria-labelledby</code>, giving the progress bar an accessible
            name for free. Without a <code>label</code>, pass your own <code>aria-label</code>{' '}
            through <code>...rest</code>.
          </li>
          <li>
            Purely a status indicator — it holds no interactive/focusable elements, so there is
            no keyboard interaction model to document.
          </li>
        </ul>
      </div>
    </div>
  )
}
