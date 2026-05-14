import { EvoCard, EvoBadge, EvoDivider } from '@justin_evo/evo-ui'
import { CodeBlock } from '../components/CodeBlock'
import { PropsTable } from '../components/PropsTable'

const variants = ['normal', 'glass', 'neon', 'holo', 'pulse', 'tilt'] as const
const colors = ['cyan', 'rose', 'emerald', 'amber', 'violet'] as const

export default function CardPage() {
  return (
    <div>
      <div className="docs-page-header">
        <div className="docs-page-tag">Component</div>
        <h1 className="docs-page-title">EvoCard</h1>
        <p className="docs-page-desc">
          A versatile container with multiple visual themes including glass morphism, neon glow,
          holographic shimmer, animated pulse, and interactive 3D tilt effects.
        </p>
        <div className="docs-import-line">
          import {'{ '}<span>EvoCard</span>{' }'} from '@justin_evo/evo-ui'
        </div>
      </div>

      <div className="docs-section">
        <div className="docs-section-title">Variants</div>
        <div className="docs-preview" style={{ flexWrap: 'wrap', gap: '1rem' }}>
          {variants.map((v) => (
            <EvoCard key={v} variant={v} color="cyan">
              <div style={{ padding: '1rem 1.25rem', minWidth: 120 }}>
                <EvoBadge severity="info" variant="subtle" size="sm">{v}</EvoBadge>
                <p style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: 'var(--docs-text-muted)' }}>
                  Card content
                </p>
              </div>
            </EvoCard>
          ))}
        </div>
        <CodeBlock code={`<EvoCard variant="normal" color="cyan">...</EvoCard>
<EvoCard variant="glass" color="cyan">...</EvoCard>
<EvoCard variant="neon" color="cyan">...</EvoCard>
<EvoCard variant="holo" color="cyan">...</EvoCard>
<EvoCard variant="pulse" color="cyan">...</EvoCard>
<EvoCard variant="tilt" color="cyan">...</EvoCard>`} />
      </div>

      <div className="docs-section">
        <div className="docs-section-title">Colors</div>
        <div className="docs-preview">
          {colors.map((c) => (
            <EvoCard key={c} variant="neon" color={c}>
              <div style={{ padding: '0.75rem 1rem', fontSize: '0.8rem' }}>
                <EvoBadge variant="subtle" size="sm">{c}</EvoBadge>
              </div>
            </EvoCard>
          ))}
        </div>
        <CodeBlock code={`<EvoCard variant="neon" color="cyan">...</EvoCard>
<EvoCard variant="neon" color="rose">...</EvoCard>
<EvoCard variant="neon" color="emerald">...</EvoCard>
<EvoCard variant="neon" color="amber">...</EvoCard>
<EvoCard variant="neon" color="violet">...</EvoCard>`} />
      </div>

      <div className="docs-section">
        <div className="docs-section-title">Flip Card (playable)</div>
        <div className="docs-preview center">
          <EvoCard variant="playable" color="cyan">
            <EvoCard.Front>
              <div style={{ padding: '2rem', textAlign: 'center' }}>
                <p style={{ color: 'var(--docs-text-muted)', fontSize: '0.85rem' }}>Hover to flip →</p>
                <p style={{ fontWeight: 600 }}>Front</p>
              </div>
            </EvoCard.Front>
            <EvoCard.Back>
              <div style={{ padding: '2rem', textAlign: 'center' }}>
                <p style={{ color: 'var(--docs-text-muted)', fontSize: '0.85rem' }}>← Hover back to flip</p>
                <p style={{ fontWeight: 600 }}>Back</p>
              </div>
            </EvoCard.Back>
          </EvoCard>
        </div>
        <CodeBlock code={`<EvoCard variant="playable" color="cyan">
  <EvoCard.Front>
    <p>Front content</p>
  </EvoCard.Front>
  <EvoCard.Back>
    <p>Back content</p>
  </EvoCard.Back>
</EvoCard>`} />
      </div>

      <EvoDivider />

      <div className="docs-section">
        <div className="docs-section-title">Props</div>
        <PropsTable props={[
          { prop: 'variant', type: "'normal' | 'playable' | 'glass' | 'neon' | 'holo' | 'pulse' | 'tilt'", default: "'normal'", description: 'Visual style of the card.' },
          { prop: 'color', type: "'cyan' | 'rose' | 'emerald' | 'amber' | 'violet'", default: "'cyan'", description: 'Accent color theme.' },
          { prop: 'children', type: 'ReactNode', required: true, description: 'Card content. Use EvoCard.Front / EvoCard.Back for playable variant.' },
          { prop: 'className', type: 'string', description: 'Additional CSS class.' },
        ]} />
      </div>
    </div>
  )
}
