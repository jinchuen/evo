import { EvoStack, EvoDivider } from '@justin_evo/evo-ui'
import { CodeBlock } from '../components/CodeBlock'
import { PropsTable } from '../components/PropsTable'

const Box = ({ children, color = 'var(--docs-accent)' }: { children: React.ReactNode; color?: string }) => (
  <div style={{
    background: `${color}18`,
    border: `1px solid ${color}40`,
    borderRadius: 6,
    padding: '0.6rem 1rem',
    fontSize: '0.8rem',
    color,
    fontWeight: 600,
    whiteSpace: 'nowrap',
  }}>
    {children}
  </div>
)

export default function StackPage() {
  return (
    <div>
      <div className="docs-page-header">
        <div className="docs-page-tag">Component</div>
        <h1 className="docs-page-title">EvoStack</h1>
        <p className="docs-page-desc">
          A flexbox layout primitive for stacking elements horizontally or vertically
          with configurable gap, alignment, and justification.
        </p>
        <div className="docs-import-line">
          import {'{ '}<span>EvoStack</span>{' }'} from '@justin_evo/evo-ui'
        </div>
      </div>

      <div className="docs-section">
        <div className="docs-section-title">Column (default)</div>
        <div className="docs-preview col">
          <EvoStack direction="column" gap="0.75rem">
            <Box>Item 1</Box>
            <Box>Item 2</Box>
            <Box>Item 3</Box>
          </EvoStack>
        </div>
        <CodeBlock code={`<EvoStack direction="column" gap="0.75rem">
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</EvoStack>`} />
      </div>

      <div className="docs-section">
        <div className="docs-section-title">Row</div>
        <div className="docs-preview">
          <EvoStack direction="row" gap="0.75rem">
            <Box>Item 1</Box>
            <Box>Item 2</Box>
            <Box>Item 3</Box>
          </EvoStack>
        </div>
        <CodeBlock code={`<EvoStack direction="row" gap="0.75rem">
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</EvoStack>`} />
      </div>

      <div className="docs-section">
        <div className="docs-section-title">Justify & Align</div>
        <div className="docs-preview col" style={{ width: '100%' }}>
          {(['start', 'center', 'end', 'between'] as const).map((j) => (
            <div key={j} style={{ width: '100%' }}>
              <span className="docs-label">justify="{j}"</span>
              <EvoStack direction="row" justify={j} gap="0.5rem" style={{ width: '100%', background: 'var(--docs-code-bg)', borderRadius: 6, padding: '0.5rem' }}>
                <Box>A</Box>
                <Box>B</Box>
                <Box>C</Box>
              </EvoStack>
            </div>
          ))}
        </div>
        <CodeBlock code={`<EvoStack direction="row" justify="start">...</EvoStack>
<EvoStack direction="row" justify="center">...</EvoStack>
<EvoStack direction="row" justify="end">...</EvoStack>
<EvoStack direction="row" justify="between">...</EvoStack>`} />
      </div>

      <EvoDivider />

      <div className="docs-section">
        <div className="docs-section-title">Props</div>
        <PropsTable props={[
          { prop: 'children', type: 'ReactNode', required: true, description: 'Stack children.' },
          { prop: 'direction', type: "'row' | 'column'", default: "'column'", description: 'Flex direction.' },
          { prop: 'gap', type: 'number | string', default: "'1rem'", description: 'Gap between items. A number is raw pixels; prefer a rem multiple of 4 (e.g. "1rem") or the .gap-{n} utility classes to stay on the 4pt grid — a dev-only console warning fires when a numeric gap is not a multiple of 4.' },
          { prop: 'align', type: "'start' | 'center' | 'end' | 'stretch' | 'baseline'", default: "'stretch'", description: 'align-items value.' },
          { prop: 'justify', type: "'start' | 'center' | 'end' | 'between' | 'around' | 'evenly'", default: "'start'", description: 'justify-content value.' },
          { prop: 'wrap', type: 'boolean', default: 'false', description: 'Enable flex-wrap.' },
          { prop: 'className', type: 'string', description: 'Additional CSS class.' },
          { prop: 'style', type: 'CSSProperties', description: 'Inline styles, merged after the computed flex styles.' },
          { prop: '...rest', type: 'React.HTMLAttributes<HTMLDivElement>', description: 'Any other native div attribute (id, role, aria-*, data-*, onClick, …) is spread onto the root element.' },
        ]} />
      </div>

      <div className="docs-section">
        <div className="docs-section-title">Ref forwarding & native attributes</div>
        <p className="docs-section-desc">
          EvoStack forwards <code>ref</code> to its root <code>&lt;div&gt;</code> and spreads any
          other native attributes you pass — <code>id</code>, <code>role</code>,
          <code> aria-*</code>, <code>data-*</code>, event handlers like <code>onClick</code> —
          straight onto that element, just like every other Evo component.
        </p>
        <CodeBlock code={`const ref = useRef<HTMLDivElement>(null)

<EvoStack ref={ref} role="list" aria-label="Recent items" data-testid="recent-stack">
  <div role="listitem">Item 1</div>
  <div role="listitem">Item 2</div>
</EvoStack>`} />
      </div>

      <div className="docs-section">
        <div className="docs-section-title">Gap and the 4pt grid</div>
        <p className="docs-section-desc">
          Changing the numeric-gap-as-pixels behavior would be a breaking change, so it stays as
          is: a numeric <code>gap</code> is still raw pixels (e.g. <code>{'gap={16}'}</code> →{' '}
          <code>16px</code>). To keep spacing consistent across the app, prefer a{' '}
          <code>rem</code> string that is a multiple of 4px (e.g. <code>gap="1rem"</code>,{' '}
          <code>gap="0.5rem"</code>) or one of the <code>.gap-{'{n}'}</code> spacing utility
          classes instead of an arbitrary pixel number. In development, passing a numeric{' '}
          <code>gap</code> that is not a multiple of 4 logs a one-line console warning to flag the
          off-grid value — it has no effect in production builds.
        </p>
      </div>
    </div>
  )
}
