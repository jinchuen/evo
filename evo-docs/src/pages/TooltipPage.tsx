import { EvoTooltip, EvoButton, EvoBadge, EvoDivider } from '@justin_evo/evo-ui'
import { CodeBlock } from '../components/CodeBlock'
import { PropsTable } from '../components/PropsTable'

export default function TooltipPage() {
  return (
    <div>
      <div className="docs-page-header">
        <div className="docs-page-tag">Component</div>
        <h1 className="docs-page-title">EvoTooltip</h1>
        <p className="docs-page-desc">
          A floating label that appears on hover or focus. Supports four placement directions
          and any ReactNode as content.
        </p>
        <div className="docs-import-line">
          import {'{ '}<span>EvoTooltip</span>{' }'} from '@justin_evo/evo-ui'
        </div>
      </div>

      <div className="docs-section">
        <div className="docs-section-title">Auto-flip</div>
        <p className="docs-section-desc">
          <code>placement</code> is the <em>preferred</em> side. If there isn't room there,
          the tooltip flips to the opposite side and shifts to stay fully on-screen, so it
          never renders off the edge or clipped by a scroll container.
        </p>
      </div>

      <div className="docs-section">
        <div className="docs-section-title">Placements</div>
        <div className="docs-preview center" style={{ gap: '1.5rem', paddingBlock: '3rem' }}>
          <EvoTooltip content="Tooltip on top" placement="top">
            <EvoButton label="Top" variant="outline" />
          </EvoTooltip>
          <EvoTooltip content="Tooltip on bottom" placement="bottom">
            <EvoButton label="Bottom" variant="outline" />
          </EvoTooltip>
          <EvoTooltip content="Tooltip on left" placement="left">
            <EvoButton label="Left" variant="outline" />
          </EvoTooltip>
          <EvoTooltip content="Tooltip on right" placement="right">
            <EvoButton label="Right" variant="outline" />
          </EvoTooltip>
        </div>
        <CodeBlock code={`<EvoTooltip content="Tooltip on top" placement="top">
  <EvoButton label="Top" />
</EvoTooltip>
<EvoTooltip content="Tooltip on bottom" placement="bottom">
  <EvoButton label="Bottom" />
</EvoTooltip>
<EvoTooltip content="Tooltip on left" placement="left">
  <EvoButton label="Left" />
</EvoTooltip>
<EvoTooltip content="Tooltip on right" placement="right">
  <EvoButton label="Right" />
</EvoTooltip>`} />
      </div>

      <div className="docs-section">
        <div className="docs-section-title">Rich Content</div>
        <div className="docs-preview center" style={{ paddingBlock: '2.5rem' }}>
          <EvoTooltip
            content={
              <div style={{ padding: '0.25rem 0' }}>
                <strong>Keyboard shortcut</strong>
                <div style={{ marginTop: '0.25rem', display: 'flex', gap: '0.25rem' }}>
                  <EvoBadge size="sm" variant="outline" severity="secondary">Ctrl</EvoBadge>
                  <EvoBadge size="sm" variant="outline" severity="secondary">S</EvoBadge>
                </div>
              </div>
            }
            placement="top"
          >
            <EvoButton label="Save" variant="outline" />
          </EvoTooltip>
        </div>
        <CodeBlock code={`<EvoTooltip
  content={<span>Rich <strong>content</strong></span>}
  placement="top"
>
  <EvoButton label="Save" />
</EvoTooltip>`} />
      </div>

      <EvoDivider />

      <div className="docs-section">
        <div className="docs-section-title">Props</div>
        <PropsTable props={[
          { prop: 'content', type: 'ReactNode', required: true, description: 'Tooltip content.' },
          { prop: 'children', type: 'ReactNode', required: true, description: 'The element that triggers the tooltip on hover/focus.' },
          { prop: 'placement', type: "'top' | 'bottom' | 'left' | 'right'", default: "'top'", description: 'Preferred tooltip position.' },
          { prop: 'className', type: 'string', description: 'Additional CSS class on the tooltip bubble.' },
        ]} />
      </div>
    </div>
  )
}
