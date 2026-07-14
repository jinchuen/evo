import { EvoCard, EvoBadge, EvoButton, EvoDivider } from '@justin_evo/evo-ui'
import { CodeBlock } from '../components/CodeBlock'
import { PropsTable } from '../components/PropsTable'

const variants = ['elevated', 'outlined', 'ghost'] as const

export default function CardPage() {
  return (
    <div>
      <div className="docs-page-header">
        <div className="docs-page-tag">Component</div>
        <h1 className="docs-page-title">EvoCard</h1>
        <p className="docs-page-desc">
          A compose-based card primitive. Three structural variants (<code>elevated</code>,{' '}
          <code>outlined</code>, <code>ghost</code>), responsive media layout, and first-class
          interactive support — when a card needs to be clickable it becomes a real{' '}
          <code>&lt;button&gt;</code> or <code>&lt;a&gt;</code>, never a <code>&lt;div onClick&gt;</code>.
        </p>
        <div className="docs-import-line">
          import {'{ '}<span>EvoCard</span>{' }'} from '@justin_evo/evo-ui'
        </div>
      </div>

      <div className="docs-section">
        <div className="docs-section-title">Variants</div>
        <p className="docs-section-desc">
          Pick the variant that matches the card's emphasis: <strong>elevated</strong> for
          hero / floating content, <strong>outlined</strong> for grouped lists, and{' '}
          <strong>ghost</strong> for low-emphasis containers that still need structure.
        </p>
        <div className="docs-preview" style={{ flexWrap: 'wrap', gap: '1rem', alignItems: 'flex-start' }}>
          {variants.map((v) => (
            <EvoCard.Root key={v} variant={v} style={{ width: 240 }}>
              <EvoCard.Header>
                <EvoCard.Title as="h3">{v}</EvoCard.Title>
                <EvoCard.Description>
                  A short summary of what this card is about.
                </EvoCard.Description>
              </EvoCard.Header>
              <EvoCard.Body>
                <EvoBadge severity="info" variant="subtle" size="sm">{v}</EvoBadge>
              </EvoCard.Body>
            </EvoCard.Root>
          ))}
        </div>
        <CodeBlock code={`<EvoCard.Root variant="elevated">
  <EvoCard.Header>
    <EvoCard.Title>Title</EvoCard.Title>
    <EvoCard.Description>Summary</EvoCard.Description>
  </EvoCard.Header>
  <EvoCard.Body>…</EvoCard.Body>
</EvoCard.Root>`} />
      </div>

      <div className="docs-section">
        <div className="docs-section-title">Compose-based layout</div>
        <p className="docs-section-desc">
          A card is built from sub-components. None of them are required individually — only
          include the slots you need.
        </p>
        <div className="docs-preview center">
          <EvoCard.Root variant="elevated" style={{ width: 320 }}>
            <EvoCard.Header>
              <EvoCard.Title as="h2">Project Aurora</EvoCard.Title>
              <EvoCard.Description>Q2 release candidate</EvoCard.Description>
            </EvoCard.Header>
            <EvoCard.Body>
              <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--evo-color-text-secondary)' }}>
                Aurora extends the platform with batch sync and offline queueing.
              </p>
            </EvoCard.Body>
            <EvoCard.Footer>
              <EvoButton label="View details" size="sm" />
            </EvoCard.Footer>
          </EvoCard.Root>
        </div>
        <CodeBlock code={`<EvoCard.Root variant="elevated">
  <EvoCard.Header>
    <EvoCard.Title as="h2">Project Aurora</EvoCard.Title>
    <EvoCard.Description>Q2 release candidate</EvoCard.Description>
  </EvoCard.Header>
  <EvoCard.Body>
    <p>Aurora extends the platform with batch sync and offline queueing.</p>
  </EvoCard.Body>
  <EvoCard.Footer>
    <EvoButton label="View details" size="sm" />
  </EvoCard.Footer>
</EvoCard.Root>`} />
      </div>

      <div className="docs-section">
        <div className="docs-section-title">Media + responsive orientation</div>
        <p className="docs-section-desc">
          Use <code>EvoCard.Media</code> alongside one of the orientation modes. The{' '}
          <code>responsive</code> orientation stacks vertically below 768&nbsp;px and switches to
          a side-by-side grid above it — open this preview on a phone (or resize the window) to
          see the swap.
        </p>
        <div className="docs-preview center">
          <EvoCard.Root variant="outlined" orientation="responsive" style={{ maxWidth: 560 }}>
            <EvoCard.Media
              aspectRatio={16 / 9}
              style={{
                background:
                  'linear-gradient(135deg, var(--evo-color-primary-soft), var(--evo-color-surface-sunken))',
              }}
            />
            <EvoCard.Header>
              <EvoCard.Title as="h3">Responsive card</EvoCard.Title>
              <EvoCard.Description>
                Vertical under 768&nbsp;px, horizontal at or above it.
              </EvoCard.Description>
            </EvoCard.Header>
            <EvoCard.Body>
              <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--evo-color-text-secondary)' }}>
                Media takes 40% of the row in horizontal mode; content fills the rest.
              </p>
            </EvoCard.Body>
          </EvoCard.Root>
        </div>
        <CodeBlock code={`<EvoCard.Root orientation="responsive">
  <EvoCard.Media src="/cover.jpg" alt="" aspectRatio={16 / 9} />
  <EvoCard.Header>
    <EvoCard.Title>Responsive card</EvoCard.Title>
    <EvoCard.Description>Stacks on mobile, splits on tablet+.</EvoCard.Description>
  </EvoCard.Header>
  <EvoCard.Body>…</EvoCard.Body>
</EvoCard.Root>`} />
      </div>

      <div className="docs-section">
        <div className="docs-section-title">Interactive cards</div>
        <p className="docs-section-desc">
          Set <code>interactive</code> to make the whole card clickable. The root becomes a real{' '}
          <code>&lt;button&gt;</code> (or <code>&lt;a&gt;</code> when <code>href</code> is set) so
          keyboard focus, screen-reader semantics and form behaviour all work out of the box.
        </p>
        <div className="docs-preview" style={{ flexWrap: 'wrap', gap: '1rem' }}>
          <EvoCard.Root
            variant="elevated"
            interactive
            onClick={() => alert('Card clicked')}
            style={{ width: 240 }}
          >
            <EvoCard.Header>
              <EvoCard.Title as="h3">Button card</EvoCard.Title>
              <EvoCard.Description>Renders as &lt;button type="button"&gt;.</EvoCard.Description>
            </EvoCard.Header>
          </EvoCard.Root>

          <EvoCard.Root
            variant="outlined"
            interactive
            href="https://example.com"
            target="_blank"
            rel="noreferrer"
            style={{ width: 240 }}
          >
            <EvoCard.Header>
              <EvoCard.Title as="h3">Anchor card</EvoCard.Title>
              <EvoCard.Description>Renders as &lt;a href&gt;.</EvoCard.Description>
            </EvoCard.Header>
          </EvoCard.Root>
        </div>
        <CodeBlock code={`<EvoCard.Root interactive onClick={handleClick}>…</EvoCard.Root>
<EvoCard.Root interactive href="/posts/42">…</EvoCard.Root>`} />
      </div>

      <div className="docs-section">
        <div className="docs-section-title">Heading levels (a11y)</div>
        <p className="docs-section-desc">
          <code>EvoCard.Title</code> takes an <code>as</code> prop (<code>h2</code>–<code>h6</code>).
          The level only changes the rendered tag — visual size stays constant — so you can keep
          the document outline correct without affecting layout.
        </p>
        <CodeBlock code={`<EvoCard.Title as="h2">Page-level card</EvoCard.Title>
<EvoCard.Title as="h4">Card inside a section</EvoCard.Title>`} />
      </div>

      <EvoDivider />

      <div className="docs-section">
        <div className="docs-section-title">EvoCard.Root props</div>
        <PropsTable props={[
          { prop: 'variant',     type: "'elevated' | 'outlined' | 'ghost'",              default: "'elevated'",  description: 'Visual emphasis of the card surface.' },
          { prop: 'orientation', type: "'vertical' | 'horizontal' | 'responsive'",       default: "'vertical'",  description: 'Layout direction. `responsive` stacks <768px and splits ≥768px.' },
          { prop: 'interactive', type: 'boolean',                                        default: 'false',       description: 'Render the root as a real <button> (or <a> when href is set).' },
          { prop: 'href',        type: 'string',                                                                 description: 'When `interactive`, switches the root to an <a>.' },
          { prop: 'type',        type: "'button' | 'submit' | 'reset'",                  default: "'button'",    description: 'Forwarded to the <button> element. Defaults guard against form auto-submit.' },
          { prop: 'children',    type: 'ReactNode', required: true,                                               description: 'Sub-components (Header, Title, Description, Body, Footer, Media).' },
          { prop: 'className',   type: 'string',                                                                  description: 'Additional CSS class.' },
        ]} />
      </div>

      <div className="docs-section">
        <div className="docs-section-title">EvoCard.Title props</div>
        <PropsTable props={[
          { prop: 'as',       type: "'h2' | 'h3' | 'h4' | 'h5' | 'h6'", default: "'h3'", description: 'Semantic heading level — visual size is constant.' },
          { prop: 'children', type: 'ReactNode', required: true,                          description: 'Title text or nodes.' },
        ]} />
      </div>

      <div className="docs-section">
        <div className="docs-section-title">EvoCard.Media props</div>
        <PropsTable props={[
          { prop: 'src',         type: 'string',                                                  description: 'Convenience: renders an <img>. Omit to pass custom children.' },
          { prop: 'alt',         type: 'string',                                                  description: 'Required when `src` is set. Empty string marks the image decorative.' },
          { prop: 'aspectRatio', type: 'number | string',                                         description: 'CSS aspect-ratio applied when no explicit dimensions are given. e.g. 16/9 or "4/3".' },
          { prop: 'children',    type: 'ReactNode',                                               description: 'Custom media content when `src` is omitted.' },
        ]} />
      </div>

      <div className="docs-section">
        <div className="docs-section-title">Accessibility</div>
        <ul className="docs-list">
          <li>
            Interactive cards render as native <code>&lt;button&gt;</code> or <code>&lt;a&gt;</code> — they
            are keyboard-reachable, focusable, and announce their role correctly.
          </li>
          <li>
            Focus is shown via <code>:focus-visible</code> with a 2&nbsp;px outline in the theme's primary
            focus colour.
          </li>
          <li>
            Interactive cards guarantee a 44&nbsp;px minimum touch target (WCAG 2.5.5).
          </li>
          <li>
            <code>EvoCard.Title</code>'s <code>as</code> prop lets you pick <code>h2</code>–<code>h6</code> to
            keep the document outline correct.
          </li>
          <li>
            <code>EvoCard.Media</code> requires <code>alt</code> when <code>src</code> is set. Use{' '}
            <code>alt=""</code> for purely decorative imagery.
          </li>
          <li>
            All motion (hover lift, press) respects <code>prefers-reduced-motion</code>.
          </li>
          <li>
            The interactive button form disables via the native <code>disabled</code> attribute. The
            anchor form has no native disabled state, so pass <code>aria-disabled="true"</code> — the
            component guards the click and calls <code>preventDefault</code> so the link doesn't
            navigate. Both forms keep a visible <code>cursor: not-allowed</code> instead of hiding it
            behind <code>pointer-events: none</code>.
          </li>
        </ul>
      </div>
    </div>
  )
}
