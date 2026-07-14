import { useMemo, useState } from 'react'
import { EvoAlert, EvoBadge, EvoCountdown, EvoDivider, EvoStack } from '@justin_evo/evo-ui'
import { CodeBlock } from '../components/CodeBlock'
import { PropsTable } from '../components/PropsTable'

const MINUTE = 60_000
const HOUR = 60 * MINUTE
const DAY = 24 * HOUR

function useDeadline(offsetMs: number) {
  // Frozen at first render so the demo deadline doesn't drift as you read the page.
  return useMemo(() => Date.now() + offsetMs, [offsetMs])
}

function ExpireDemo() {
  const deadline = useDeadline(8_000)
  const [expired, setExpired] = useState(false)
  return (
    <EvoStack direction="row" gap="0.75rem" align="center" wrap>
      <EvoCountdown deadline={deadline} onExpire={() => setExpired(true)} />
      {expired && <EvoBadge severity="danger" size="sm">onExpire fired</EvoBadge>}
    </EvoStack>
  )
}

function CustomRenderDemo() {
  const deadline = useDeadline(3 * MINUTE + 20_000)
  return (
    <EvoCountdown deadline={deadline}>
      {(remainingMs) => {
        const seconds = Math.ceil(remainingMs / 1000)
        return <span>⏳ {seconds}s to go</span>
      }}
    </EvoCountdown>
  )
}

export default function CountdownPage() {
  const soonDeadline = useDeadline(90_000) // 90s — inside default danger window
  const laterDeadline = useDeadline(45 * MINUTE) // 45min — calm, warning-only
  const daysDeadline = useDeadline(9 * DAY)
  const clockDeadline = useDeadline(3 * HOUR + 5 * MINUTE)
  const autoDeadline = useDeadline(20 * HOUR) // <24h so `auto` resolves to clock
  const customThresholdDeadline = useDeadline(10 * MINUTE)
  const trialDeadline = useDeadline(2 * DAY + 4 * HOUR)

  return (
    <div>
      <div className="docs-page-header">
        <div className="docs-page-tag">Component</div>
        <h1 className="docs-page-title">EvoCountdown</h1>
        <p className="docs-page-desc">
          An inline, literal "shrinking number" — <code>3 days left</code>, <code>04:59</code> —
          for deadlines, trial expirations, and limited-time offers. Ticks itself, pauses
          while the tab is hidden, and escalates from a calm warning tint to danger as the
          deadline nears.
        </p>
        <div className="docs-import-line">
          import {'{ '}<span>EvoCountdown</span>{' }'} from '@justin_evo/evo-ui'
        </div>
      </div>

      {/* ---------- Why ---------- */}
      <div className="docs-section">
        <div className="docs-section-title">Why EvoCountdown</div>
        <p className="docs-section-desc">
          People respond more strongly to the threat of losing something than to the promise
          of gaining it. "Your trial ends in 3 days" moves people more than "upgrade for more
          features" — but only if the countdown itself reads as urgent, not just its digits.
          EvoCountdown carries that urgency in its own color: it renders in{' '}
          <code>--evo-color-warning</code> for its entire visible life, then escalates to{' '}
          <code>--evo-color-danger</code> once the remaining time crosses{' '}
          <code>dangerThreshold</code> — with a single one-shot pulse marking the exact
          moment it happens. You don't have to read "04:59" to know it's late.
        </p>
      </div>

      {/* ---------- Basic usage ---------- */}
      <div className="docs-section">
        <div className="docs-section-title">Basic usage</div>
        <p className="docs-section-desc">
          Pass a <code>deadline</code> — an epoch-ms number or a <code>Date</code>. With no
          other props, format is <code>auto</code>: days while far away, a ticking clock once
          inside the final day.
        </p>
        <div className="docs-preview">
          <EvoCountdown deadline={daysDeadline} />
          <EvoCountdown deadline={soonDeadline} />
        </div>
        <CodeBlock code={`<EvoCountdown deadline={Date.now() + 9 * 24 * 60 * 60 * 1000} />
<EvoCountdown deadline={Date.now() + 90_000} />`} />
      </div>

      {/* ---------- Format ---------- */}
      <div className="docs-section">
        <div className="docs-section-title">Format</div>
        <p className="docs-section-desc">
          <code>days</code> ticks once a minute and never shows seconds. <code>clock</code>{' '}
          ticks once a second and shows <code>H:MM:SS</code> (or <code>MM:SS</code> under an
          hour). <code>auto</code> (default) picks <code>days</code> while 24h or more remain
          and switches to <code>clock</code> inside the final day — so a month-long trial
          doesn't re-render every second for no reason.
        </p>
        <div className="docs-preview">
          <EvoStack direction="column" gap="0.4rem" align="start">
            <EvoStack direction="row" gap="0.5rem" align="center">
              <code>days</code> <EvoCountdown deadline={daysDeadline} format="days" />
            </EvoStack>
            <EvoStack direction="row" gap="0.5rem" align="center">
              <code>clock</code> <EvoCountdown deadline={clockDeadline} format="clock" />
            </EvoStack>
            <EvoStack direction="row" gap="0.5rem" align="center">
              <code>auto</code> (20h left) <EvoCountdown deadline={autoDeadline} format="auto" />
            </EvoStack>
          </EvoStack>
        </div>
        <CodeBlock code={`<EvoCountdown deadline={deadline} format="days" />
<EvoCountdown deadline={deadline} format="clock" />
<EvoCountdown deadline={deadline} format="auto" /> {/* default */}`} />
      </div>

      {/* ---------- Danger threshold ---------- */}
      <div className="docs-section">
        <div className="docs-section-title">Danger threshold</div>
        <p className="docs-section-desc">
          <code>dangerThreshold</code> is the remaining-ms cutoff where the color escalates
          from warning to danger. Left unset, it defaults to <strong>10% of the initial
          remaining duration</strong> (clamped to 30s–24h) — a smart default so a 30-day
          countdown turns urgent with 3 days left and a 10-minute one turns urgent with 1
          minute left, with nothing to configure. Pass it explicitly to override.
        </p>
        <div className="docs-preview">
          <EvoStack direction="column" gap="0.4rem" align="start">
            <EvoStack direction="row" gap="0.5rem" align="center">
              smart default (45min left)
              <EvoCountdown deadline={laterDeadline} format="clock" />
            </EvoStack>
            <EvoStack direction="row" gap="0.5rem" align="center">
              explicit <code>dangerThreshold=300000</code> (10min left)
              <EvoCountdown deadline={customThresholdDeadline} format="clock" dangerThreshold={5 * MINUTE} />
            </EvoStack>
          </EvoStack>
        </div>
        <CodeBlock code={`{/* smart default: turns danger with ~4.5min left of this 45min window */}
<EvoCountdown deadline={deadline} />

{/* explicit: force danger inside the last 5 minutes */}
<EvoCountdown deadline={deadline} dangerThreshold={5 * 60_000} />`} />
      </div>

      {/* ---------- onExpire ---------- */}
      <div className="docs-section">
        <div className="docs-section-title">Expiration</div>
        <p className="docs-section-desc">
          <code>onExpire</code> fires exactly once, on the tick the deadline is reached. The
          display itself freezes on <code>Expired</code> in a muted tone.
        </p>
        <ExpireDemo />
        <CodeBlock code={`<EvoCountdown
  deadline={deadline}
  onExpire={() => console.log('deadline reached')}
/>`} />
      </div>

      {/* ---------- Custom rendering ---------- */}
      <div className="docs-section">
        <div className="docs-section-title">Custom rendering</div>
        <p className="docs-section-desc">
          Pass a function as <code>children</code> to fully control what's displayed. It
          receives the live remaining milliseconds; the built-in "3 days left" / "04:59"
          formatting is skipped. The accessible name (<code>aria-label</code>) still reports
          the accurate remaining duration regardless of what you render.
        </p>
        <CustomRenderDemo />
        <CodeBlock code={`<EvoCountdown deadline={deadline}>
  {(remainingMs) => <span>⏳ {Math.ceil(remainingMs / 1000)}s to go</span>}
</EvoCountdown>`} />
      </div>

      {/* ---------- Composition ---------- */}
      <div className="docs-section">
        <div className="docs-section-title">Inside EvoAlert</div>
        <p className="docs-section-desc">
          EvoCountdown is deliberately chrome-less (no border, no background) so it drops
          into alert or notification copy without fighting the host's own box.
        </p>
        <div className="docs-preview" style={{ width: '100%' }}>
          <EvoAlert type="warning" title="Your trial is ending">
            Upgrade before it ends — access resets in{' '}
            <EvoCountdown deadline={trialDeadline} />.
          </EvoAlert>
        </div>
        <CodeBlock code={`<EvoAlert type="warning" title="Your trial is ending">
  Upgrade before it ends — access resets in <EvoCountdown deadline={trialDeadline} />.
</EvoAlert>`} />
      </div>

      <EvoDivider className="docs-section" />

      {/* ---------- Props ---------- */}
      <div className="docs-section">
        <div className="docs-section-title">Props</div>
        <PropsTable props={[
          { prop: 'deadline', type: 'number | Date', required: true, description: 'Target instant — an epoch-ms timestamp or a Date.' },
          { prop: 'format', type: "'days' | 'clock' | 'auto'", default: "'auto'", description: "'days' ticks once a minute ('3 days left'). 'clock' ticks once a second ('04:59'). 'auto' picks 'days' at ≥24h remaining and switches to 'clock' inside the final day." },
          { prop: 'dangerThreshold', type: 'number', description: 'Remaining ms at which color escalates from warning to danger. Defaults to 10% of the initial remaining duration at mount, clamped to 30s–24h.' },
          { prop: 'onExpire', type: '() => void', description: 'Called exactly once, on the tick the deadline is reached or passed.' },
          { prop: 'children', type: '(remainingMs: number) => ReactNode', description: 'Render prop for full control over the displayed content. Omit to use the built-in formatting.' },
          { prop: '...rest', type: 'HTMLAttributes<HTMLSpanElement>', description: 'All native span attributes (aria-*, onClick, …) forward to the root. Forwards ref to the underlying <span>.' },
        ]} />
      </div>

      {/* ---------- Accessibility ---------- */}
      <div className="docs-section">
        <div className="docs-section-title">Accessibility</div>
        <ul className="docs-list">
          <li>
            Renders <code>role="timer"</code> with <code>aria-live="off"</code> — a
            per-second or per-minute tick is not announced, so screen reader users aren't
            interrupted by a running clock.
          </li>
          <li>
            <code>aria-label</code> always carries the accurate, full remaining duration
            (e.g. "2 days, 4 hours remaining") independent of what's visually shown, including
            when a custom <code>children</code> render is used — a screen reader user landing
            on the element gets the real answer either way.
          </li>
          <li>
            Digits use <code>font-variant-numeric: tabular-nums</code> so the layout doesn't
            shift width as numbers tick down.
          </li>
          <li>
            The tick interval never runs faster than once a second, and pauses entirely while
            the browser tab is hidden (<code>visibilitychange</code>) — no wasted work, and no
            stale display flashing back to "correct" on return.
          </li>
          <li>
            The one-shot pulse fired when the color escalates to danger is removed entirely
            under <code>prefers-reduced-motion: reduce</code>; the color change alone still
            carries the state.
          </li>
          <li>
            The component itself holds no focus and has no default interaction — it's a
            passive status text, meant to sit inside interactive contexts like{' '}
            <code>EvoAlert</code> or <code>EvoBadge.detail</code>, not to be one.
          </li>
        </ul>
      </div>
    </div>
  )
}
