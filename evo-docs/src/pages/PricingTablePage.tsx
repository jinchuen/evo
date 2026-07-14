import { EvoPricingTable, EvoButton, EvoDivider } from '@justin_evo/evo-ui'
import { CodeBlock } from '../components/CodeBlock'
import { PropsTable } from '../components/PropsTable'

export default function PricingTablePage() {
  return (
    <div>
      <div className="docs-page-header">
        <div className="docs-page-tag">Component</div>
        <h1 className="docs-page-title">EvoPricingTable</h1>
        <p className="docs-page-desc">
          A tier-comparison table built from small slot sub-components (<code>Tier</code>,{' '}
          <code>Price</code>, <code>FeatureList</code>, <code>Feature</code>, <code>Cta</code>).
          Tiers are grid-aligned row-for-row so the set reads as one comparable table — a
          struck-through anchor price, a raised recommended tier, and a shared baseline for every
          call to action — instead of a row of independently-sized cards.
        </p>
        <div className="docs-import-line">
          import {'{ '}<span>EvoPricingTable</span>{' }'} from '@justin_evo/evo-ui'
        </div>
      </div>

      <div className="docs-section">
        <div className="docs-section-title">Why a dedicated component</div>
        <p className="docs-section-desc">
          A price only reads as "a good deal" relative to what sits next to it — the contrast
          effect. A hand-rolled <code>Grid</code> of <code>Card</code>s can't guarantee that:
          each card sizes to its own content, so a tier's price line rarely lands at the same
          height as its neighbour's, and the eye can't scan straight across. On desktop (≥768px),
          <code> EvoPricingTable</code> uses CSS Grid <code>subgrid</code> to lock every tier's
          name, price, description and divider onto the same row, and stretches the feature/CTA
          area so every button lands on one shared baseline. Below 768px tiers stack to a single
          column and the alignment math is skipped — there is nothing to align.
        </p>
      </div>

      <div className="docs-section">
        <div className="docs-section-title">Basic usage</div>
        <p className="docs-section-desc">
          Mark the tier that should win the comparison with <code>recommended</code> on the root
          (matched by <code>Tier</code> id), and mark the high flagship tier that anchors the
          comparison with <code>anchor</code> — its price recedes so the recommended tier's price
          pops by contrast. <code>anchorPrice</code> renders a struck-through original price next
          to the live one.
        </p>
        <div className="docs-preview center" style={{ width: '100%' }}>
          <EvoPricingTable recommended="pro" style={{ width: '100%', maxWidth: 900 }}>
            <EvoPricingTable.Tier id="starter" name="Starter" price="$0" period="/mo" description="For side projects.">
              <EvoPricingTable.FeatureList>
                <EvoPricingTable.Feature>3 projects</EvoPricingTable.Feature>
                <EvoPricingTable.Feature>Community support</EvoPricingTable.Feature>
                <EvoPricingTable.Feature included={false}>Priority support</EvoPricingTable.Feature>
                <EvoPricingTable.Feature included={false}>SSO</EvoPricingTable.Feature>
              </EvoPricingTable.FeatureList>
              <EvoPricingTable.Cta>
                <EvoButton label="Get started" variant="outline" fullWidth />
              </EvoPricingTable.Cta>
            </EvoPricingTable.Tier>

            <EvoPricingTable.Tier id="pro" name="Pro" price="$29" anchorPrice="$49" period="/mo" description="For growing teams.">
              <EvoPricingTable.FeatureList>
                <EvoPricingTable.Feature>Unlimited projects</EvoPricingTable.Feature>
                <EvoPricingTable.Feature>Priority support</EvoPricingTable.Feature>
                <EvoPricingTable.Feature>Usage analytics</EvoPricingTable.Feature>
                <EvoPricingTable.Feature included={false}>SSO</EvoPricingTable.Feature>
              </EvoPricingTable.FeatureList>
              <EvoPricingTable.Cta>
                <EvoButton label="Start free trial" fullWidth />
              </EvoPricingTable.Cta>
            </EvoPricingTable.Tier>

            <EvoPricingTable.Tier id="enterprise" name="Enterprise" price="$99" period="/mo" description="For the whole org." anchor>
              <EvoPricingTable.FeatureList>
                <EvoPricingTable.Feature>Unlimited projects</EvoPricingTable.Feature>
                <EvoPricingTable.Feature>Dedicated support</EvoPricingTable.Feature>
                <EvoPricingTable.Feature>Usage analytics</EvoPricingTable.Feature>
                <EvoPricingTable.Feature>SSO</EvoPricingTable.Feature>
              </EvoPricingTable.FeatureList>
              <EvoPricingTable.Cta>
                <EvoButton label="Contact sales" variant="outline" fullWidth />
              </EvoPricingTable.Cta>
            </EvoPricingTable.Tier>
          </EvoPricingTable>
        </div>
        <CodeBlock code={`<EvoPricingTable recommended="pro">
  <EvoPricingTable.Tier id="starter" name="Starter" price="$0" period="/mo" description="For side projects.">
    <EvoPricingTable.FeatureList>
      <EvoPricingTable.Feature>3 projects</EvoPricingTable.Feature>
      <EvoPricingTable.Feature included={false}>Priority support</EvoPricingTable.Feature>
    </EvoPricingTable.FeatureList>
    <EvoPricingTable.Cta>
      <EvoButton label="Get started" variant="outline" fullWidth />
    </EvoPricingTable.Cta>
  </EvoPricingTable.Tier>

  <EvoPricingTable.Tier id="pro" name="Pro" price="$29" anchorPrice="$49" period="/mo" description="For growing teams.">
    <EvoPricingTable.FeatureList>
      <EvoPricingTable.Feature>Unlimited projects</EvoPricingTable.Feature>
      <EvoPricingTable.Feature>Priority support</EvoPricingTable.Feature>
    </EvoPricingTable.FeatureList>
    <EvoPricingTable.Cta>
      <EvoButton label="Start free trial" fullWidth />
    </EvoPricingTable.Cta>
  </EvoPricingTable.Tier>

  {/* anchor: the flagship tier that recedes so "pro" pops by contrast */}
  <EvoPricingTable.Tier id="enterprise" name="Enterprise" price="$99" period="/mo" anchor>
    …
  </EvoPricingTable.Tier>
</EvoPricingTable>`} />
      </div>

      <div className="docs-section">
        <div className="docs-section-title">Recommended badge</div>
        <p className="docs-section-desc">
          A tier matching <code>recommended</code> gets a "Recommended" <code>EvoBadge</code>{' '}
          automatically — one fewer decision to make. Pass your own <code>badge</code> (a string
          is wrapped in <code>EvoBadge</code> for you, or pass any node) to override it, on any
          tier, recommended or not.
        </p>
        <CodeBlock code={`<EvoPricingTable.Tier id="pro" name="Pro" price="$29" badge="Most popular">…</EvoPricingTable.Tier>`} />
      </div>

      <div className="docs-section">
        <div className="docs-section-title">Sizes</div>
        <p className="docs-section-desc">
          <code>size</code> scales padding and type across every tier. <code>md</code> is the
          default.
        </p>
        <CodeBlock code={`<EvoPricingTable size="sm">…</EvoPricingTable>
<EvoPricingTable size="lg">…</EvoPricingTable>`} />
      </div>

      <div className="docs-section">
        <div className="docs-section-title">Billing cadence slot</div>
        <p className="docs-section-desc">
          <code>cadence</code> renders any node (typically a monthly/yearly toggle) centred above
          the tiers. EvoPricingTable doesn't own the toggle's state — pass your own controlled
          control (e.g. <code>EvoToggle</code>) and switch each tier's <code>price</code> yourself.
        </p>
        <CodeBlock code={`<EvoPricingTable cadence={<BillingToggle value={cadence} onChange={setCadence} />}>
  <EvoPricingTable.Tier id="pro" name="Pro" price={cadence === 'yearly' ? '$290' : '$29'} period={cadence === 'yearly' ? '/yr' : '/mo'}>
    …
  </EvoPricingTable.Tier>
</EvoPricingTable>`} />
      </div>

      <div className="docs-section">
        <div className="docs-section-title">Opting out of alignment</div>
        <p className="docs-section-desc">
          Set <code>alignFeatures={'{false}'}</code> to fall back to plain, independently-sized
          cards in a responsive grid — useful when tiers have very different shapes (e.g. one
          tier has a large custom illustration) and forced row alignment would leave awkward gaps.
        </p>
        <CodeBlock code={`<EvoPricingTable alignFeatures={false}>…</EvoPricingTable>`} />
      </div>

      <EvoDivider />

      <div className="docs-section">
        <div className="docs-section-title">EvoPricingTable props</div>
        <PropsTable props={[
          { prop: 'recommended',   type: 'string',                      description: 'id of the Tier to visually elevate as the recommended pick.' },
          { prop: 'size',          type: "'sm' | 'md' | 'lg'",          default: "'md'", description: 'Padding and type scale for every tier.' },
          { prop: 'alignFeatures', type: 'boolean',                     default: 'true', description: 'Grid-align name/price/description/feature rows across tiers on desktop (≥768px). False falls back to independently-sized cards.' },
          { prop: 'cadence',       type: 'ReactNode',                   description: 'Billing-cadence switcher rendered above the tiers (e.g. a monthly/yearly toggle).' },
          { prop: 'children',      type: 'ReactNode', required: true,   description: 'One or more EvoPricingTable.Tier elements.' },
          { prop: 'className',     type: 'string',                      description: 'Additional CSS class.' },
        ]} />
      </div>

      <div className="docs-section">
        <div className="docs-section-title">EvoPricingTable.Tier props</div>
        <PropsTable props={[
          { prop: 'id',           type: 'string', required: true,  description: 'Stable identifier. Match against the root\'s `recommended` prop. Also used as the DOM id.' },
          { prop: 'name',         type: 'ReactNode', required: true, description: 'Tier name, e.g. "Pro".' },
          { prop: 'price',        type: 'ReactNode', required: true, description: 'Current price, e.g. "$29".' },
          { prop: 'anchorPrice',  type: 'ReactNode',                description: 'Original price rendered struck-through beside price, e.g. "$49". Announced to screen readers as "Original price".' },
          { prop: 'anchor',       type: 'boolean',   default: 'false', description: 'Marks this as the flagship tier that anchors the comparison — chrome recedes (flat surface, muted price) so the recommended tier pops by contrast.' },
          { prop: 'recommended',  type: 'boolean',   default: 'false', description: 'Visually elevates this tier. Equivalent to matching the root\'s `recommended` id.' },
          { prop: 'badge',        type: 'ReactNode',                description: 'Ribbon content. A string is wrapped in EvoBadge automatically. Defaults to a "Recommended" badge when the tier is recommended and no badge is given.' },
          { prop: 'description',  type: 'ReactNode',                description: 'One-line summary shown under the name.' },
          { prop: 'period',       type: 'ReactNode',                description: 'Billing period suffix, e.g. "/mo".' },
          { prop: 'children',     type: 'ReactNode',                description: 'Sub-components (FeatureList, Cta).' },
          { prop: 'className',    type: 'string',                  description: 'Additional CSS class.' },
        ]} />
      </div>

      <div className="docs-section">
        <div className="docs-section-title">EvoPricingTable.Price props</div>
        <p className="docs-section-desc">
          Rendered automatically inside <code>Tier</code> from its <code>price</code> /{' '}
          <code>anchorPrice</code> / <code>period</code> props. Exported for advanced custom
          layouts.
        </p>
        <PropsTable props={[
          { prop: 'value',  type: 'ReactNode', required: true, description: 'Current price.' },
          { prop: 'anchor', type: 'ReactNode',                 description: 'Original price, rendered struck-through with a visually-hidden "Original price" label.' },
          { prop: 'period', type: 'ReactNode',                 description: 'Billing period suffix.' },
        ]} />
      </div>

      <div className="docs-section">
        <div className="docs-section-title">EvoPricingTable.Feature props</div>
        <PropsTable props={[
          { prop: 'included', type: 'boolean', default: 'true', description: 'Whether the feature is included in this tier. False renders a muted row with a visually-hidden "Not included" label.' },
          { prop: 'children', type: 'ReactNode',                description: 'Feature description.' },
        ]} />
      </div>

      <div className="docs-section">
        <div className="docs-section-title">Accessibility</div>
        <ul className="docs-list">
          <li>
            Each <code>Tier</code> renders <code>role="group"</code> with{' '}
            <code>aria-labelledby</code> pointing at its name, so assistive tech announces "Pro,
            group" (etc.) before its contents.
          </li>
          <li>
            <code>anchorPrice</code> is preceded by a visually-hidden "Original price" label so
            screen reader users don't hear two bare numbers in a row.
          </li>
          <li>
            <code>Feature included={'{false}'}</code> is preceded by a visually-hidden "Not
            included" label — the strike-through minus icon is <code>aria-hidden</code>.
          </li>
          <li>
            <code>FeatureList</code> renders a real <code>&lt;ul&gt;</code>/<code>&lt;li&gt;</code>{' '}
            list, not styled <code>&lt;div&gt;</code>s.
          </li>
          <li>
            All motion (card transitions) respects <code>prefers-reduced-motion</code>.
          </li>
          <li>
            The row-alignment grid is a visual-only enhancement — content order and semantics are
            identical with or without it, and it never engages below 768px.
          </li>
        </ul>
      </div>
    </div>
  )
}
