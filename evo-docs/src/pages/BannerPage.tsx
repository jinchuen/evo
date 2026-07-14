import { EvoBanner, EvoButton, EvoDivider } from '@justin_evo/evo-ui'
import { CodeBlock } from '../components/CodeBlock'
import { PropsTable } from '../components/PropsTable'

const GiftIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 12v10H4V12M2 7h20v5H2zM12 22V7M12 7H7.5a2.5 2.5 0 1 1 0-5C11 2 12 7 12 7zM12 7h4.5a2.5 2.5 0 1 0 0-5C13 2 12 7 12 7z" />
  </svg>
)

const SparkleIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 3v4M12 17v4M3 12h4M17 12h4M6.3 6.3l2.8 2.8M14.9 14.9l2.8 2.8M17.7 6.3l-2.8 2.8M9.1 14.9l-2.8 2.8" />
  </svg>
)

export default function BannerPage() {
  return (
    <div>
      <div className="docs-page-header">
        <div className="docs-page-tag">Component</div>
        <h1 className="docs-page-title">EvoBanner</h1>
        <p className="docs-page-desc">
          A calm, value-first callout — the "give before you ask" primitive. Pairs an icon,
          a short pitch, and a CTA with an optional reassurance note, and stays a passive
          landmark rather than an interruption.
        </p>
        <div className="docs-import-line">
          import {'{ '}<span>EvoBanner</span>{' }'} from '@justin_evo/evo-ui'
        </div>
      </div>

      {/* ---------- Why ---------- */}
      <div className="docs-section">
        <div className="docs-section-title">Why EvoBanner</div>
        <p className="docs-section-desc">
          Reciprocity — offering real value before asking for anything — is one of the
          strongest drivers of trust. <code>EvoAlert</code> is the wrong tool for this: it's{' '}
          <code>role="alert"</code> (an assertive interruption) and coded by status severity
          (success / error / warning / info). A promo or upsell message isn't a status
          update, and it shouldn't interrupt. <code>EvoCard</code> is also the wrong shape —
          it has no CTA slot, no reassurance-copy slot, and no dismiss behaviour.
        </p>
        <p className="docs-section-desc">
          <code>EvoBanner</code> renders a <code>role="region"</code> landmark with a{' '}
          <em>tone</em> (not a severity) and anchors an optional reassurance{' '}
          <code>note</code> — "No card required" — directly under the CTA. Pairing the ask
          with the "no catch" signal is what makes reciprocity actually land.
        </p>
      </div>

      {/* ---------- Basic usage ---------- */}
      <div className="docs-section">
        <div className="docs-section-title">Basic usage</div>
        <p className="docs-section-desc">
          <code>title</code>, <code>icon</code>, <code>action</code>, and <code>note</code> are
          all optional — only <code>children</code> is required.
        </p>
        <div className="docs-preview" style={{ width: '100%' }}>
          <EvoBanner
            icon={<GiftIcon />}
            title="Try the Pro plan free for 14 days"
            action={<EvoButton label="Start free trial" size="md" />}
            note="No card required"
          >
            Unlock unlimited projects, priority support, and advanced analytics — cancel
            anytime.
          </EvoBanner>
        </div>
        <CodeBlock code={`<EvoBanner
  icon={<GiftIcon />}
  title="Try the Pro plan free for 14 days"
  action={<EvoButton label="Start free trial" />}
  note="No card required"
>
  Unlock unlimited projects, priority support, and advanced analytics —
  cancel anytime.
</EvoBanner>`} />
      </div>

      {/* ---------- Tones ---------- */}
      <div className="docs-section">
        <div className="docs-section-title">Tones</div>
        <p className="docs-section-desc">
          Three tones, orthogonal to everything else. <code>brand</code> for the primary
          value pitch, <code>neutral</code> for low-emphasis product tips, and{' '}
          <code>accent</code> for a secondary highlight that still shouldn't compete with{' '}
          <code>brand</code>.
        </p>
        <div className="docs-preview" style={{ width: '100%', flexDirection: 'column', gap: '0.75rem' }}>
          <EvoBanner tone="brand" icon={<GiftIcon />} title="Brand">
            The default tone — use it for the main value offer on a page.
          </EvoBanner>
          <EvoBanner tone="neutral" icon={<SparkleIcon />} title="Neutral">
            Use this for low-emphasis tips that shouldn't pull focus.
          </EvoBanner>
          <EvoBanner tone="accent" icon={<SparkleIcon />} title="Accent">
            Use this for a secondary highlight, e.g. a feature announcement.
          </EvoBanner>
        </div>
        <CodeBlock code={`<EvoBanner tone="brand">…</EvoBanner>
<EvoBanner tone="neutral">…</EvoBanner>
<EvoBanner tone="accent">…</EvoBanner>`} />
      </div>

      {/* ---------- Alignment ---------- */}
      <div className="docs-section">
        <div className="docs-section-title">Alignment</div>
        <p className="docs-section-desc">
          <code>align="start"</code> (default) rows the icon, content, and CTA together for
          dense contexts like a dashboard sidebar. <code>align="center"</code> stacks and
          centers everything for a full-width hero placement.
        </p>
        <div className="docs-preview" style={{ width: '100%' }}>
          <EvoBanner
            align="center"
            tone="accent"
            icon={<SparkleIcon />}
            title="Refer a friend, get a month free"
            action={<EvoButton label="Get your link" size="md" severity="info" />}
            note="Rewards apply automatically"
          >
            Both of you get a free month once they subscribe.
          </EvoBanner>
        </div>
        <CodeBlock code={`<EvoBanner
  align="center"
  tone="accent"
  title="Refer a friend, get a month free"
  action={<EvoButton label="Get your link" severity="info" />}
  note="Rewards apply automatically"
>
  Both of you get a free month once they subscribe.
</EvoBanner>`} />
      </div>

      {/* ---------- Dismissible ---------- */}
      <div className="docs-section">
        <div className="docs-section-title">Dismissible</div>
        <p className="docs-section-desc">
          The dismiss control is a true ghost button — invisible until hover or focus, so it
          never competes with the CTA. The exit animation respects{' '}
          <code>prefers-reduced-motion</code>; <code>onDismiss</code> fires once the banner
          has actually left the DOM.
        </p>
        <div className="docs-preview" style={{ width: '100%' }}>
          <EvoBanner
            tone="neutral"
            title="New: keyboard shortcuts"
            dismissible
            onDismiss={() => console.log('banner dismissed')}
          >
            Press <code>?</code> anywhere in the app to see the full shortcut list.
          </EvoBanner>
        </div>
        <CodeBlock code={`<EvoBanner
  tone="neutral"
  title="New: keyboard shortcuts"
  dismissible
  onDismiss={() => console.log('banner dismissed')}
>
  Press "?" anywhere in the app to see the full shortcut list.
</EvoBanner>`} />
      </div>

      <EvoDivider className="docs-section" />

      {/* ---------- Accessibility ---------- */}
      <div className="docs-section">
        <div className="docs-section-title">Accessibility</div>
        <ul className="docs-list">
          <li>
            Renders a <code>&lt;section role="region"&gt;</code> landmark, never{' '}
            <code>role="alert"</code> — a value banner shouldn't interrupt screen reader
            users the way a status alert does.
          </li>
          <li>
            The region's accessible name comes from <code>aria-label</code> if provided,
            else falls back to <code>title</code> (when it's a plain string), else
            "Banner".
          </li>
          <li>
            The <code>action</code> slot guarantees a 44&nbsp;px minimum tap target (WCAG
            2.5.5) regardless of how small the CTA inside it renders.
          </li>
          <li>
            The dismiss button has an <code>aria-label="Dismiss banner"</code> and a visible{' '}
            <code>:focus-visible</code> outline; its hit area grows to 44&nbsp;px under{' '}
            <code>(pointer: coarse)</code>.
          </li>
          <li>
            The exit animation is skipped entirely under <code>prefers-reduced-motion:
            reduce</code> — the banner is removed on the next tick instead of fading out.
          </li>
        </ul>
      </div>

      {/* ---------- Props ---------- */}
      <div className="docs-section">
        <div className="docs-section-title">Props</div>
        <PropsTable props={[
          { prop: 'tone', type: "'brand' | 'neutral' | 'accent'", default: "'brand'", description: 'Semantic color theme — orthogonal to layout.' },
          { prop: 'title', type: 'ReactNode', description: 'Bold lead-in shown above the body copy.' },
          { prop: 'icon', type: 'ReactNode', description: 'Decorative glyph in a circular badge. Rendered `aria-hidden`.' },
          { prop: 'children', type: 'ReactNode', required: true, description: 'Body copy — the value being offered.' },
          { prop: 'action', type: 'ReactNode', description: 'Primary CTA. Wrapped in a slot with a guaranteed ≥44px tap target.' },
          { prop: 'note', type: 'ReactNode', description: 'Small reassurance copy anchored under the CTA, e.g. "No card required".' },
          { prop: 'dismissible', type: 'boolean', default: 'false', description: 'Shows a ghost dismiss control.' },
          { prop: 'onDismiss', type: '() => void', description: 'Called after the (motion-respecting) exit animation completes.' },
          { prop: 'align', type: "'start' | 'center'", default: "'start'", description: '`start` rows icon/content/action; `center` stacks and centers for hero placements.' },
          { prop: '...rest', type: 'HTMLAttributes<HTMLElement>', description: 'All native attributes (id, style, data-*, aria-*, …). Forwards `ref` to the underlying `<section>`.' },
        ]} />
      </div>
    </div>
  )
}
