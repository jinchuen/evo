import { EvoDivider } from '@justin_evo/evo-ui'
import { CodeBlock } from '../components/CodeBlock'
import { ClassTable } from '../components/ClassTable'

// ─── spacing scale (shared between spacing + sizing sections) ───
const SPACING_SCALE = [
  { n: '0',  rem: '0',       px: '0px' },
  { n: '1',  rem: '0.25rem', px: '4px' },
  { n: '2',  rem: '0.5rem',  px: '8px' },
  { n: '3',  rem: '0.75rem', px: '12px' },
  { n: '4',  rem: '1rem',    px: '16px' },
  { n: '5',  rem: '1.25rem', px: '20px' },
  { n: '6',  rem: '1.5rem',  px: '24px' },
  { n: '7',  rem: '1.75rem', px: '28px' },
  { n: '8',  rem: '2rem',    px: '32px' },
  { n: '9',  rem: '2.25rem', px: '36px' },
  { n: '10', rem: '2.5rem',  px: '40px' },
  { n: '11', rem: '2.75rem', px: '44px' },
  { n: '12', rem: '3rem',    px: '48px' },
  { n: '14', rem: '3.5rem',  px: '56px' },
  { n: '16', rem: '4rem',    px: '64px' },
  { n: '20', rem: '5rem',    px: '80px' },
  { n: '24', rem: '6rem',    px: '96px' },
  { n: '28', rem: '7rem',    px: '112px' },
  { n: '32', rem: '8rem',    px: '128px' },
  { n: '36', rem: '9rem',    px: '144px' },
  { n: '40', rem: '10rem',   px: '160px' },
  { n: '44', rem: '11rem',   px: '176px' },
  { n: '48', rem: '12rem',   px: '192px' },
  { n: '56', rem: '14rem',   px: '224px' },
  { n: '64', rem: '16rem',   px: '256px' },
  { n: '72', rem: '18rem',   px: '288px' },
  { n: '80', rem: '20rem',   px: '320px' },
  { n: '96', rem: '24rem',   px: '384px' },
]

function SectionTitle({ id, children }: { id: string; children: React.ReactNode }) {
  return <div id={id} className="docs-section-title">{children}</div>
}

export default function UtilitiesPage() {
  return (
    <div>

      {/* ── Header ─────────────────────────────────────── */}
      <div className="docs-page-header">
        <div className="docs-page-tag">Utilities</div>
        <h1 className="docs-page-title">Utility Classes</h1>
        <p className="docs-page-desc">
          EVO UI ships a Tailwind-inspired utility layer compiled into{' '}
          <code>evo-ui.css</code>. Every class below maps to exactly one CSS
          property — compose them freely on any HTML element.
        </p>
        <div className="docs-import-line">
          import '@justin_evo/evo-ui/dist/evo-ui.css'
        </div>
      </div>

      {/* ── Table of contents ──────────────────────────── */}
      <div className="docs-section">
        <SectionTitle id="toc">Categories</SectionTitle>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.5rem' }}>
          {[
            ['#colors',      'Colors'],
            ['#spacing',     'Spacing scale'],
            ['#margin',      'Margin'],
            ['#padding',     'Padding'],
            ['#gap',         'Gap'],
            ['#typography',  'Typography'],
            ['#display',     'Display'],
            ['#flexbox',     'Flexbox'],
            ['#grid',        'Grid'],
            ['#sizing',      'Sizing'],
            ['#borders',     'Borders'],
            ['#radius',      'Border radius'],
            ['#shadows',     'Shadows'],
            ['#opacity',     'Opacity'],
            ['#transitions', 'Transitions'],
            ['#transforms',  'Transforms'],
            ['#position',    'Position'],
            ['#inset',       'Inset (top/right/bottom/left)'],
            ['#zindex',      'Z-index'],
            ['#overflow',    'Overflow'],
            ['#cursor',      'Cursor'],
            ['#misc',        'Misc'],
          ].map(([href, label]) => (
            <a
              key={href}
              href={href}
              style={{
                display: 'inline-block',
                padding: '0.25rem 0.75rem',
                borderRadius: '6px',
                fontSize: '0.8rem',
                background: '#1e293b',
                color: '#94a3b8',
                textDecoration: 'none',
                border: '1px solid #334155',
              }}
            >
              {label}
            </a>
          ))}
        </div>
      </div>

      <EvoDivider />

      {/* ═══════════════════════════════════════════════
          COLORS
      ════════════════════════════════════════════════ */}
      <div className="docs-section">
        <SectionTitle id="colors">Colors</SectionTitle>
        <p style={{ color: '#94a3b8', marginBottom: '1rem', lineHeight: '1.6' }}>
          Three utility prefixes cover every color in the EVO palette.
          Color shades run from <strong>100</strong> (lightest) to{' '}
          <strong>900</strong> (darkest). Slate also has <strong>50</strong> and{' '}
          <strong>950</strong>.
        </p>

        <ClassTable rows={[
          { cls: 'text-{color}-{shade}',   prop: 'color',            value: 'e.g. text-cyan-500  → color: #06b6d4' },
          { cls: 'bg-{color}-{shade}',     prop: 'background-color', value: 'e.g. bg-slate-900   → background-color: #0f172a' },
          { cls: 'border-{color}-{shade}', prop: 'border-color',     value: 'e.g. border-rose-400 → border-color: #fb7185' },
        ]} />

        <p style={{ color: '#94a3b8', margin: '1rem 0 0.5rem', fontWeight: 600 }}>Available color families</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '1rem' }}>
          {['blue','gray','red','yellow','green','purple','cyan','rose','emerald','amber','violet','slate','white','black'].map(c => (
            <code key={c} style={{ background: '#1e293b', padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.8rem', color: '#e2e8f0' }}>{c}</code>
          ))}
        </div>

        <p style={{ color: '#94a3b8', marginBottom: '0.5rem', fontWeight: 600 }}>Semantic color aliases</p>
        <ClassTable rows={[
          { cls: 'text-primary',  prop: 'color',            value: '$evo-primary-color  (cyan-600)' },
          { cls: 'text-success',  prop: 'color',            value: '$evo-success-color  (emerald-600)' },
          { cls: 'text-danger',   prop: 'color',            value: '$evo-danger-color   (rose-600)' },
          { cls: 'text-warning',  prop: 'color',            value: '$evo-warning-color  (amber-400)' },
          { cls: 'text-info',     prop: 'color',            value: '$evo-info-color     (violet-600)' },
          { cls: 'text-muted',    prop: 'color',            value: '$color-text-muted   (slate-500)' },
          { cls: 'text-default',  prop: 'color',            value: '$color-text-primary (white-100)' },
          { cls: 'text-white',    prop: 'color',            value: '#fff' },
          { cls: 'text-black',    prop: 'color',            value: '#000' },
          { cls: 'text-transparent', prop: 'color',         value: 'transparent' },
          { cls: 'text-inherit',  prop: 'color',            value: 'inherit' },
          { cls: 'text-current',  prop: 'color',            value: 'currentColor' },
          { cls: 'bg-primary',    prop: 'background-color', value: 'cyan-600' },
          { cls: 'bg-success',    prop: 'background-color', value: 'emerald-600' },
          { cls: 'bg-danger',     prop: 'background-color', value: 'rose-600' },
          { cls: 'bg-warning',    prop: 'background-color', value: 'amber-400' },
          { cls: 'bg-info',       prop: 'background-color', value: 'violet-600' },
          { cls: 'bg-surface',    prop: 'background-color', value: 'slate-900' },
          { cls: 'bg-page',       prop: 'background-color', value: 'slate-950' },
          { cls: 'bg-white',      prop: 'background-color', value: '#fff' },
          { cls: 'bg-black',      prop: 'background-color', value: '#000' },
          { cls: 'bg-transparent', prop: 'background-color', value: 'transparent' },
          { cls: 'border-primary', prop: 'border-color',   value: 'cyan-600' },
          { cls: 'border-success', prop: 'border-color',   value: 'emerald-600' },
          { cls: 'border-danger',  prop: 'border-color',   value: 'rose-600' },
          { cls: 'border-warning', prop: 'border-color',   value: 'amber-400' },
          { cls: 'border-default', prop: 'border-color',   value: '$color-border (slate-700)' },
        ]} />

        <CodeBlock code={`<p class="text-cyan-500">Cyan text</p>
<p class="text-success">Success green</p>
<div class="bg-slate-900 border border-slate-700">Dark card</div>
<div class="bg-primary text-white">Primary button background</div>`} />
      </div>

      <EvoDivider />

      {/* ═══════════════════════════════════════════════
          SPACING SCALE
      ════════════════════════════════════════════════ */}
      <div className="docs-section">
        <SectionTitle id="spacing">Spacing scale</SectionTitle>
        <p style={{ color: '#94a3b8', marginBottom: '1rem', lineHeight: '1.6' }}>
          One unit = <strong>0.25 rem = 4 px</strong>. The same scale applies to
          margin, padding, gap, width, and height utilities.
          Special tokens: <code>px</code> = 1 px, <code>auto</code> = auto.
        </p>
        <div className="docs-props-wrap">
          <table className="docs-props-table">
            <thead>
              <tr><th>n</th><th>rem</th><th>px</th><th>Example classes</th></tr>
            </thead>
            <tbody>
              {SPACING_SCALE.map(({ n, rem, px }) => (
                <tr key={n}>
                  <td><span className="prop-name">{n}</span></td>
                  <td><span className="prop-default">{rem}</span></td>
                  <td><span className="prop-type">{px}</span></td>
                  <td><span className="prop-desc">m-{n}  p-{n}  gap-{n}  w-{n}  h-{n}</span></td>
                </tr>
              ))}
              <tr>
                <td><span className="prop-name">px</span></td>
                <td><span className="prop-default">—</span></td>
                <td><span className="prop-type">1px</span></td>
                <td><span className="prop-desc">m-px  p-px  gap-px</span></td>
              </tr>
              <tr>
                <td><span className="prop-name">auto</span></td>
                <td><span className="prop-default">—</span></td>
                <td><span className="prop-type">auto</span></td>
                <td><span className="prop-desc">m-auto  mx-auto  mt-auto  ml-auto</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <EvoDivider />

      {/* ═══════════════════════════════════════════════
          MARGIN
      ════════════════════════════════════════════════ */}
      <div className="docs-section">
        <SectionTitle id="margin">Margin</SectionTitle>
        <p style={{ color: '#94a3b8', marginBottom: '1rem', lineHeight: '1.6' }}>
          Replace <code>{'{n}'}</code> with any value from the spacing scale (0–96, px, auto).
          Negative margins use a leading dash: <code>-mt-4</code>.
        </p>
        <ClassTable rows={[
          { cls: 'm-{n}',   prop: 'margin',         value: 'all 4 sides' },
          { cls: 'mt-{n}',  prop: 'margin-top',     value: 'top only' },
          { cls: 'mr-{n}',  prop: 'margin-right',   value: 'right only' },
          { cls: 'mb-{n}',  prop: 'margin-bottom',  value: 'bottom only' },
          { cls: 'ml-{n}',  prop: 'margin-left',    value: 'left only' },
          { cls: 'mx-{n}',  prop: 'margin-inline',  value: 'left + right' },
          { cls: 'my-{n}',  prop: 'margin-block',   value: 'top + bottom' },
          { cls: 'm-auto',  prop: 'margin',         value: 'auto' },
          { cls: 'mx-auto', prop: 'margin-inline',  value: 'auto — horizontally centers a block' },
          { cls: 'my-auto', prop: 'margin-block',   value: 'auto — vertically centers in a flex col' },
          { cls: 'mt-auto', prop: 'margin-top',     value: 'auto — pushes element to bottom of flex col' },
          { cls: 'mr-auto', prop: 'margin-right',   value: 'auto — pushes element to the left' },
          { cls: 'mb-auto', prop: 'margin-bottom',  value: 'auto' },
          { cls: 'ml-auto', prop: 'margin-left',    value: 'auto — pushes element to the right' },
          { cls: '-m-{n}',  prop: 'margin',         value: 'negative (e.g. -m-4 → -1rem)' },
          { cls: '-mt-{n}', prop: 'margin-top',     value: 'negative' },
          { cls: '-mr-{n}', prop: 'margin-right',   value: 'negative' },
          { cls: '-mb-{n}', prop: 'margin-bottom',  value: 'negative' },
          { cls: '-ml-{n}', prop: 'margin-left',    value: 'negative' },
          { cls: '-mx-{n}', prop: 'margin-inline',  value: 'negative' },
          { cls: '-my-{n}', prop: 'margin-block',   value: 'negative' },
        ]} />
        <CodeBlock code={`<div class="mx-auto max-w-4xl">Centered container</div>
<div class="flex flex-col">
  <div>Content</div>
  <div class="mt-auto">Pushed to bottom</div>
</div>
<div class="ml-auto">Pushed to the right</div>`} />
      </div>

      <EvoDivider />

      {/* ═══════════════════════════════════════════════
          PADDING
      ════════════════════════════════════════════════ */}
      <div className="docs-section">
        <SectionTitle id="padding">Padding</SectionTitle>
        <ClassTable rows={[
          { cls: 'p-{n}',  prop: 'padding',         value: 'all 4 sides' },
          { cls: 'pt-{n}', prop: 'padding-top',     value: 'top only' },
          { cls: 'pr-{n}', prop: 'padding-right',   value: 'right only' },
          { cls: 'pb-{n}', prop: 'padding-bottom',  value: 'bottom only' },
          { cls: 'pl-{n}', prop: 'padding-left',    value: 'left only' },
          { cls: 'px-{n}', prop: 'padding-inline',  value: 'left + right' },
          { cls: 'py-{n}', prop: 'padding-block',   value: 'top + bottom' },
          { cls: 'p-px',   prop: 'padding',         value: '1px' },
        ]} />
        <CodeBlock code={`<div class="p-4">1rem padding all sides</div>
<div class="px-6 py-3">1.5rem horizontal, 0.75rem vertical</div>
<div class="pt-2 pb-8">0.5rem top, 2rem bottom</div>`} />
      </div>

      <EvoDivider />

      {/* ═══════════════════════════════════════════════
          GAP
      ════════════════════════════════════════════════ */}
      <div className="docs-section">
        <SectionTitle id="gap">Gap</SectionTitle>
        <p style={{ color: '#94a3b8', marginBottom: '1rem' }}>
          Used with <code>flex</code> or <code>grid</code> containers.
        </p>
        <ClassTable rows={[
          { cls: 'gap-{n}',   prop: 'gap',        value: 'row + column gap' },
          { cls: 'gap-x-{n}', prop: 'column-gap', value: 'horizontal gap only' },
          { cls: 'gap-y-{n}', prop: 'row-gap',    value: 'vertical gap only' },
          { cls: 'gap-px',    prop: 'gap',         value: '1px' },
        ]} />
        <CodeBlock code={`<div class="flex gap-4">4 items, 1rem between each</div>
<div class="grid grid-cols-3 gap-x-8 gap-y-4">
  Different horizontal / vertical gaps
</div>`} />
      </div>

      <EvoDivider />

      {/* ═══════════════════════════════════════════════
          TYPOGRAPHY
      ════════════════════════════════════════════════ */}
      <div className="docs-section">
        <SectionTitle id="typography">Typography</SectionTitle>

        <p style={{ color: '#94a3b8', margin: '0 0 0.5rem', fontWeight: 600 }}>Font size</p>
        <ClassTable rows={[
          { cls: 'text-xs',   prop: 'font-size', value: '0.75rem  (12px)' },
          { cls: 'text-sm',   prop: 'font-size', value: '0.875rem (14px)' },
          { cls: 'text-base', prop: 'font-size', value: '1rem     (16px)' },
          { cls: 'text-lg',   prop: 'font-size', value: '1.125rem (18px)' },
          { cls: 'text-xl',   prop: 'font-size', value: '1.25rem  (20px)' },
          { cls: 'text-2xl',  prop: 'font-size', value: '1.5rem   (24px)' },
          { cls: 'text-3xl',  prop: 'font-size', value: '1.875rem (30px)' },
          { cls: 'text-4xl',  prop: 'font-size', value: '2.25rem  (36px)' },
          { cls: 'text-5xl',  prop: 'font-size', value: '3rem     (48px)' },
          { cls: 'text-6xl',  prop: 'font-size', value: '3.75rem  (60px)' },
        ]} />

        <p style={{ color: '#94a3b8', margin: '1rem 0 0.5rem', fontWeight: 600 }}>Font weight</p>
        <ClassTable rows={[
          { cls: 'font-thin',       prop: 'font-weight', value: '100' },
          { cls: 'font-extralight', prop: 'font-weight', value: '200' },
          { cls: 'font-light',      prop: 'font-weight', value: '300' },
          { cls: 'font-normal',     prop: 'font-weight', value: '400' },
          { cls: 'font-medium',     prop: 'font-weight', value: '500' },
          { cls: 'font-semibold',   prop: 'font-weight', value: '600' },
          { cls: 'font-bold',       prop: 'font-weight', value: '700' },
          { cls: 'font-extrabold',  prop: 'font-weight', value: '800' },
          { cls: 'font-black',      prop: 'font-weight', value: '900' },
        ]} />

        <p style={{ color: '#94a3b8', margin: '1rem 0 0.5rem', fontWeight: 600 }}>Font family</p>
        <ClassTable rows={[
          { cls: 'font-sans',    prop: 'font-family', value: 'Inter, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif' },
          { cls: 'font-display', prop: 'font-family', value: 'Cal Sans, Inter, sans-serif' },
          { cls: 'font-mono',    prop: 'font-family', value: 'ui-monospace, Cascadia Code, Source Code Pro, Menlo, monospace' },
        ]} />

        <p style={{ color: '#94a3b8', margin: '1rem 0 0.5rem', fontWeight: 600 }}>Text alignment</p>
        <ClassTable rows={[
          { cls: 'text-left',    prop: 'text-align', value: 'left' },
          { cls: 'text-center',  prop: 'text-align', value: 'center' },
          { cls: 'text-right',   prop: 'text-align', value: 'right' },
          { cls: 'text-justify', prop: 'text-align', value: 'justify' },
          { cls: 'text-start',   prop: 'text-align', value: 'start' },
          { cls: 'text-end',     prop: 'text-align', value: 'end' },
        ]} />

        <p style={{ color: '#94a3b8', margin: '1rem 0 0.5rem', fontWeight: 600 }}>Text transform</p>
        <ClassTable rows={[
          { cls: 'uppercase',   prop: 'text-transform', value: 'uppercase' },
          { cls: 'lowercase',   prop: 'text-transform', value: 'lowercase' },
          { cls: 'capitalize',  prop: 'text-transform', value: 'capitalize' },
          { cls: 'normal-case', prop: 'text-transform', value: 'none' },
        ]} />

        <p style={{ color: '#94a3b8', margin: '1rem 0 0.5rem', fontWeight: 600 }}>Text decoration</p>
        <ClassTable rows={[
          { cls: 'underline',    prop: 'text-decoration-line', value: 'underline' },
          { cls: 'overline',     prop: 'text-decoration-line', value: 'overline' },
          { cls: 'line-through', prop: 'text-decoration-line', value: 'line-through' },
          { cls: 'no-underline', prop: 'text-decoration-line', value: 'none' },
        ]} />

        <p style={{ color: '#94a3b8', margin: '1rem 0 0.5rem', fontWeight: 600 }}>Font style</p>
        <ClassTable rows={[
          { cls: 'italic',     prop: 'font-style', value: 'italic' },
          { cls: 'not-italic', prop: 'font-style', value: 'normal' },
        ]} />

        <p style={{ color: '#94a3b8', margin: '1rem 0 0.5rem', fontWeight: 600 }}>Line height</p>
        <ClassTable rows={[
          { cls: 'leading-none',    prop: 'line-height', value: '1' },
          { cls: 'leading-tight',   prop: 'line-height', value: '1.25' },
          { cls: 'leading-snug',    prop: 'line-height', value: '1.375' },
          { cls: 'leading-normal',  prop: 'line-height', value: '1.5' },
          { cls: 'leading-relaxed', prop: 'line-height', value: '1.625' },
          { cls: 'leading-loose',   prop: 'line-height', value: '2' },
        ]} />

        <p style={{ color: '#94a3b8', margin: '1rem 0 0.5rem', fontWeight: 600 }}>Letter spacing</p>
        <ClassTable rows={[
          { cls: 'tracking-tighter', prop: 'letter-spacing', value: '-0.05em' },
          { cls: 'tracking-tight',   prop: 'letter-spacing', value: '-0.025em' },
          { cls: 'tracking-normal',  prop: 'letter-spacing', value: '0' },
          { cls: 'tracking-wide',    prop: 'letter-spacing', value: '0.025em' },
          { cls: 'tracking-wider',   prop: 'letter-spacing', value: '0.05em' },
          { cls: 'tracking-widest',  prop: 'letter-spacing', value: '0.1em' },
        ]} />

        <p style={{ color: '#94a3b8', margin: '1rem 0 0.5rem', fontWeight: 600 }}>Overflow / truncation</p>
        <ClassTable rows={[
          { cls: 'truncate',       prop: 'overflow + text-overflow + white-space', value: 'hidden + ellipsis + nowrap — single-line clamp' },
          { cls: 'line-clamp-1',   prop: '-webkit-line-clamp',                    value: '1 — hide after 1 line' },
          { cls: 'line-clamp-2',   prop: '-webkit-line-clamp',                    value: '2 — hide after 2 lines' },
          { cls: 'line-clamp-3',   prop: '-webkit-line-clamp',                    value: '3 — hide after 3 lines' },
          { cls: 'line-clamp-4',   prop: '-webkit-line-clamp',                    value: '4 — hide after 4 lines' },
          { cls: 'text-ellipsis',  prop: 'text-overflow',                         value: 'ellipsis' },
          { cls: 'text-clip',      prop: 'text-overflow',                         value: 'clip' },
          { cls: 'whitespace-normal',   prop: 'white-space', value: 'normal' },
          { cls: 'whitespace-nowrap',   prop: 'white-space', value: 'nowrap' },
          { cls: 'whitespace-pre',      prop: 'white-space', value: 'pre' },
          { cls: 'whitespace-pre-line', prop: 'white-space', value: 'pre-line' },
          { cls: 'whitespace-pre-wrap', prop: 'white-space', value: 'pre-wrap' },
          { cls: 'break-normal',   prop: 'overflow-wrap + word-break', value: 'normal + normal' },
          { cls: 'break-words',    prop: 'overflow-wrap',              value: 'break-word' },
          { cls: 'break-all',      prop: 'word-break',                 value: 'break-all' },
        ]} />

        <p style={{ color: '#94a3b8', margin: '1rem 0 0.5rem', fontWeight: 600 }}>List style</p>
        <ClassTable rows={[
          { cls: 'list-none',    prop: 'list-style-type',     value: 'none' },
          { cls: 'list-disc',    prop: 'list-style-type',     value: 'disc' },
          { cls: 'list-decimal', prop: 'list-style-type',     value: 'decimal' },
          { cls: 'list-inside',  prop: 'list-style-position', value: 'inside' },
          { cls: 'list-outside', prop: 'list-style-position', value: 'outside' },
        ]} />

        <p style={{ color: '#94a3b8', margin: '1rem 0 0.5rem', fontWeight: 600 }}>Vertical align</p>
        <ClassTable rows={[
          { cls: 'align-baseline',    prop: 'vertical-align', value: 'baseline' },
          { cls: 'align-top',         prop: 'vertical-align', value: 'top' },
          { cls: 'align-middle',      prop: 'vertical-align', value: 'middle' },
          { cls: 'align-bottom',      prop: 'vertical-align', value: 'bottom' },
          { cls: 'align-text-top',    prop: 'vertical-align', value: 'text-top' },
          { cls: 'align-text-bottom', prop: 'vertical-align', value: 'text-bottom' },
        ]} />
      </div>

      <EvoDivider />

      {/* ═══════════════════════════════════════════════
          DISPLAY
      ════════════════════════════════════════════════ */}
      <div className="docs-section">
        <SectionTitle id="display">Display</SectionTitle>
        <ClassTable rows={[
          { cls: 'block',       prop: 'display', value: 'block' },
          { cls: 'inline-block',prop: 'display', value: 'inline-block' },
          { cls: 'inline',      prop: 'display', value: 'inline' },
          { cls: 'flex',        prop: 'display', value: 'flex' },
          { cls: 'inline-flex', prop: 'display', value: 'inline-flex' },
          { cls: 'grid',        prop: 'display', value: 'grid' },
          { cls: 'inline-grid', prop: 'display', value: 'inline-grid' },
          { cls: 'contents',    prop: 'display', value: 'contents' },
          { cls: 'table',       prop: 'display', value: 'table' },
          { cls: 'hidden',      prop: 'display', value: 'none' },
        ]} />
        <ClassTable rows={[
          { cls: 'visible',   prop: 'visibility', value: 'visible' },
          { cls: 'invisible', prop: 'visibility', value: 'hidden  (takes up space, just not visible)' },
          { cls: 'collapse',  prop: 'visibility', value: 'collapse' },
        ]} />
      </div>

      <EvoDivider />

      {/* ═══════════════════════════════════════════════
          FLEXBOX
      ════════════════════════════════════════════════ */}
      <div className="docs-section">
        <SectionTitle id="flexbox">Flexbox</SectionTitle>
        <p style={{ color: '#94a3b8', marginBottom: '1rem' }}>
          Apply <code>flex</code> or <code>inline-flex</code> to the parent first,
          then use these classes to control direction, alignment, and sizing.
        </p>

        <p style={{ color: '#94a3b8', margin: '0 0 0.5rem', fontWeight: 600 }}>Flex direction</p>
        <ClassTable rows={[
          { cls: 'flex-row',         prop: 'flex-direction', value: 'row          — left → right (default)' },
          { cls: 'flex-row-reverse', prop: 'flex-direction', value: 'row-reverse  — right → left' },
          { cls: 'flex-col',         prop: 'flex-direction', value: 'column       — top → bottom' },
          { cls: 'flex-col-reverse', prop: 'flex-direction', value: 'column-reverse — bottom → top' },
        ]} />

        <p style={{ color: '#94a3b8', margin: '1rem 0 0.5rem', fontWeight: 600 }}>Flex wrap</p>
        <ClassTable rows={[
          { cls: 'flex-nowrap',       prop: 'flex-wrap', value: 'nowrap         — all children on one line (default)' },
          { cls: 'flex-wrap',         prop: 'flex-wrap', value: 'wrap           — children wrap to new lines' },
          { cls: 'flex-wrap-reverse', prop: 'flex-wrap', value: 'wrap-reverse   — wrap upward' },
        ]} />

        <p style={{ color: '#94a3b8', margin: '1rem 0 0.5rem', fontWeight: 600 }}>justify-content — aligns children along the main axis</p>
        <ClassTable rows={[
          { cls: 'justify-start',   prop: 'justify-content', value: 'flex-start    — pack to the start (left in row)' },
          { cls: 'justify-end',     prop: 'justify-content', value: 'flex-end      — pack to the end (right in row)' },
          { cls: 'justify-center',  prop: 'justify-content', value: 'center        — center all children' },
          { cls: 'justify-between', prop: 'justify-content', value: 'space-between — first child at start, last at end, equal gaps between' },
          { cls: 'justify-around',  prop: 'justify-content', value: 'space-around  — equal space around each child' },
          { cls: 'justify-evenly',  prop: 'justify-content', value: 'space-evenly  — equal space between all children including edges' },
          { cls: 'justify-stretch', prop: 'justify-content', value: 'stretch' },
        ]} />

        <p style={{ color: '#94a3b8', margin: '1rem 0 0.5rem', fontWeight: 600 }}>align-items — aligns children along the cross axis</p>
        <ClassTable rows={[
          { cls: 'items-start',    prop: 'align-items', value: 'flex-start — align to the top (in a row)' },
          { cls: 'items-end',      prop: 'align-items', value: 'flex-end   — align to the bottom (in a row)' },
          { cls: 'items-center',   prop: 'align-items', value: 'center     — vertically center (in a row)' },
          { cls: 'items-stretch',  prop: 'align-items', value: 'stretch    — stretch to fill height (default)' },
          { cls: 'items-baseline', prop: 'align-items', value: 'baseline   — align text baselines' },
        ]} />

        <p style={{ color: '#94a3b8', margin: '1rem 0 0.5rem', fontWeight: 600 }}>align-content — aligns multiple rows/columns</p>
        <ClassTable rows={[
          { cls: 'content-start',   prop: 'align-content', value: 'flex-start' },
          { cls: 'content-end',     prop: 'align-content', value: 'flex-end' },
          { cls: 'content-center',  prop: 'align-content', value: 'center' },
          { cls: 'content-between', prop: 'align-content', value: 'space-between' },
          { cls: 'content-around',  prop: 'align-content', value: 'space-around' },
          { cls: 'content-evenly',  prop: 'align-content', value: 'space-evenly' },
          { cls: 'content-stretch', prop: 'align-content', value: 'stretch' },
        ]} />

        <p style={{ color: '#94a3b8', margin: '1rem 0 0.5rem', fontWeight: 600 }}>align-self — overrides align-items on a single child</p>
        <ClassTable rows={[
          { cls: 'self-auto',     prop: 'align-self', value: 'auto' },
          { cls: 'self-start',    prop: 'align-self', value: 'flex-start' },
          { cls: 'self-end',      prop: 'align-self', value: 'flex-end' },
          { cls: 'self-center',   prop: 'align-self', value: 'center' },
          { cls: 'self-stretch',  prop: 'align-self', value: 'stretch' },
          { cls: 'self-baseline', prop: 'align-self', value: 'baseline' },
        ]} />

        <p style={{ color: '#94a3b8', margin: '1rem 0 0.5rem', fontWeight: 600 }}>Flex grow / shrink / basis</p>
        <ClassTable rows={[
          { cls: 'flex-1',      prop: 'flex', value: '1 1 0%   — grow and shrink, start from 0' },
          { cls: 'flex-auto',   prop: 'flex', value: '1 1 auto — grow and shrink, start from natural size' },
          { cls: 'flex-initial',prop: 'flex', value: '0 1 auto — don\'t grow, can shrink' },
          { cls: 'flex-none',   prop: 'flex', value: 'none     — fixed size, won\'t grow or shrink' },
          { cls: 'grow',        prop: 'flex-grow',   value: '1 — element grows to fill available space' },
          { cls: 'grow-0',      prop: 'flex-grow',   value: '0 — element does not grow' },
          { cls: 'shrink',      prop: 'flex-shrink', value: '1 — element shrinks when space is tight' },
          { cls: 'shrink-0',    prop: 'flex-shrink', value: '0 — element will NOT shrink (keeps its size)' },
        ]} />

        <CodeBlock code={`<!-- Horizontal center + vertical center -->
<div class="flex items-center justify-center gap-4">
  <span>Left</span>
  <span>Right</span>
</div>

<!-- Space between: logo left, links right -->
<div class="flex items-center justify-between px-6">
  <div>Logo</div>
  <nav>Links</nav>
</div>

<!-- Push pagination to bottom of a page -->
<div class="flex flex-col min-h-screen">
  <div class="flex-1">Page content</div>
  <div class="mt-auto py-4">
    <EvoPagination ... />
  </div>
</div>

<!-- Push an element to the far right -->
<div class="flex items-center">
  <span>Title</span>
  <button class="ml-auto">Action</button>
</div>`} />
      </div>

      <EvoDivider />

      {/* ═══════════════════════════════════════════════
          GRID
      ════════════════════════════════════════════════ */}
      <div className="docs-section">
        <SectionTitle id="grid">Grid</SectionTitle>
        <p style={{ color: '#94a3b8', marginBottom: '1rem' }}>
          Apply <code>grid</code> to the parent, then control columns and spans on children.
        </p>

        <p style={{ color: '#94a3b8', margin: '0 0 0.5rem', fontWeight: 600 }}>Grid template columns</p>
        <ClassTable rows={[
          { cls: 'grid-cols-1',  prop: 'grid-template-columns', value: 'repeat(1, minmax(0, 1fr))' },
          { cls: 'grid-cols-2',  prop: 'grid-template-columns', value: 'repeat(2, minmax(0, 1fr))' },
          { cls: 'grid-cols-3',  prop: 'grid-template-columns', value: 'repeat(3, minmax(0, 1fr))' },
          { cls: 'grid-cols-4',  prop: 'grid-template-columns', value: 'repeat(4, minmax(0, 1fr))' },
          { cls: 'grid-cols-5',  prop: 'grid-template-columns', value: 'repeat(5, minmax(0, 1fr))' },
          { cls: 'grid-cols-6',  prop: 'grid-template-columns', value: 'repeat(6, minmax(0, 1fr))' },
          { cls: 'grid-cols-7',  prop: 'grid-template-columns', value: 'repeat(7, minmax(0, 1fr))' },
          { cls: 'grid-cols-8',  prop: 'grid-template-columns', value: 'repeat(8, minmax(0, 1fr))' },
          { cls: 'grid-cols-9',  prop: 'grid-template-columns', value: 'repeat(9, minmax(0, 1fr))' },
          { cls: 'grid-cols-10', prop: 'grid-template-columns', value: 'repeat(10, minmax(0, 1fr))' },
          { cls: 'grid-cols-11', prop: 'grid-template-columns', value: 'repeat(11, minmax(0, 1fr))' },
          { cls: 'grid-cols-12', prop: 'grid-template-columns', value: 'repeat(12, minmax(0, 1fr))' },
          { cls: 'grid-cols-none', prop: 'grid-template-columns', value: 'none' },
        ]} />

        <p style={{ color: '#94a3b8', margin: '1rem 0 0.5rem', fontWeight: 600 }}>Column span (child class)</p>
        <ClassTable rows={[
          { cls: 'col-span-1',  prop: 'grid-column', value: 'span 1 / span 1' },
          { cls: 'col-span-2',  prop: 'grid-column', value: 'span 2 / span 2' },
          { cls: 'col-span-3',  prop: 'grid-column', value: 'span 3 / span 3' },
          { cls: 'col-span-4',  prop: 'grid-column', value: 'span 4 / span 4' },
          { cls: 'col-span-5',  prop: 'grid-column', value: 'span 5 / span 5' },
          { cls: 'col-span-6',  prop: 'grid-column', value: 'span 6 / span 6' },
          { cls: 'col-span-7',  prop: 'grid-column', value: 'span 7 / span 7' },
          { cls: 'col-span-8',  prop: 'grid-column', value: 'span 8 / span 8' },
          { cls: 'col-span-9',  prop: 'grid-column', value: 'span 9 / span 9' },
          { cls: 'col-span-10', prop: 'grid-column', value: 'span 10 / span 10' },
          { cls: 'col-span-11', prop: 'grid-column', value: 'span 11 / span 11' },
          { cls: 'col-span-12', prop: 'grid-column', value: 'span 12 / span 12' },
          { cls: 'col-span-full', prop: 'grid-column', value: '1 / -1  — spans ALL columns' },
          { cls: 'col-auto',    prop: 'grid-column', value: 'auto' },
        ]} />

        <p style={{ color: '#94a3b8', margin: '1rem 0 0.5rem', fontWeight: 600 }}>Grid template rows</p>
        <ClassTable rows={[
          { cls: 'grid-rows-1', prop: 'grid-template-rows', value: 'repeat(1, minmax(0, 1fr))' },
          { cls: 'grid-rows-2', prop: 'grid-template-rows', value: 'repeat(2, minmax(0, 1fr))' },
          { cls: 'grid-rows-3', prop: 'grid-template-rows', value: 'repeat(3, minmax(0, 1fr))' },
          { cls: 'grid-rows-4', prop: 'grid-template-rows', value: 'repeat(4, minmax(0, 1fr))' },
          { cls: 'grid-rows-5', prop: 'grid-template-rows', value: 'repeat(5, minmax(0, 1fr))' },
          { cls: 'grid-rows-6', prop: 'grid-template-rows', value: 'repeat(6, minmax(0, 1fr))' },
        ]} />

        <p style={{ color: '#94a3b8', margin: '1rem 0 0.5rem', fontWeight: 600 }}>Row span (child class)</p>
        <ClassTable rows={[
          { cls: 'row-span-1',  prop: 'grid-row', value: 'span 1 / span 1' },
          { cls: 'row-span-2',  prop: 'grid-row', value: 'span 2 / span 2' },
          { cls: 'row-span-3',  prop: 'grid-row', value: 'span 3 / span 3' },
          { cls: 'row-span-4',  prop: 'grid-row', value: 'span 4 / span 4' },
          { cls: 'row-span-5',  prop: 'grid-row', value: 'span 5 / span 5' },
          { cls: 'row-span-6',  prop: 'grid-row', value: 'span 6 / span 6' },
          { cls: 'row-span-full', prop: 'grid-row', value: '1 / -1 — spans ALL rows' },
          { cls: 'row-auto',    prop: 'grid-row', value: 'auto' },
        ]} />

        <CodeBlock code={`<!-- 3-column even grid -->
<div class="grid grid-cols-3 gap-4">
  <div>Card 1</div>
  <div>Card 2</div>
  <div>Card 3</div>
</div>

<!-- 12-column layout (main + sidebar) -->
<div class="grid grid-cols-12 gap-6">
  <div class="col-span-8">Main content</div>
  <div class="col-span-4">Sidebar</div>
</div>

<!-- Feature card that spans full width -->
<div class="grid grid-cols-3 gap-4">
  <div class="col-span-full">Featured</div>
  <div>Card</div>
  <div>Card</div>
  <div>Card</div>
</div>`} />
      </div>

      <EvoDivider />

      {/* ═══════════════════════════════════════════════
          SIZING
      ════════════════════════════════════════════════ */}
      <div className="docs-section">
        <SectionTitle id="sizing">Sizing</SectionTitle>

        <p style={{ color: '#94a3b8', margin: '0 0 0.5rem', fontWeight: 600 }}>Width — special values</p>
        <ClassTable rows={[
          { cls: 'w-auto',   prop: 'width', value: 'auto' },
          { cls: 'w-full',   prop: 'width', value: '100%' },
          { cls: 'w-screen', prop: 'width', value: '100vw' },
          { cls: 'w-min',    prop: 'width', value: 'min-content' },
          { cls: 'w-max',    prop: 'width', value: 'max-content' },
          { cls: 'w-fit',    prop: 'width', value: 'fit-content' },
          { cls: 'w-px',     prop: 'width', value: '1px' },
          { cls: 'w-1/2',    prop: 'width', value: '50%' },
          { cls: 'w-1/3',    prop: 'width', value: '33.333%' },
          { cls: 'w-2/3',    prop: 'width', value: '66.667%' },
          { cls: 'w-1/4',    prop: 'width', value: '25%' },
          { cls: 'w-3/4',    prop: 'width', value: '75%' },
          { cls: 'w-1/5',    prop: 'width', value: '20%' },
          { cls: 'w-2/5',    prop: 'width', value: '40%' },
          { cls: 'w-3/5',    prop: 'width', value: '60%' },
          { cls: 'w-4/5',    prop: 'width', value: '80%' },
          { cls: 'w-1/6',    prop: 'width', value: '16.667%' },
          { cls: 'w-5/6',    prop: 'width', value: '83.333%' },
        ]} />

        <p style={{ color: '#94a3b8', margin: '1rem 0 0.5rem', fontWeight: 600 }}>Height — special values</p>
        <ClassTable rows={[
          { cls: 'h-auto',   prop: 'height', value: 'auto' },
          { cls: 'h-full',   prop: 'height', value: '100%' },
          { cls: 'h-screen', prop: 'height', value: '100vh' },
          { cls: 'h-svh',    prop: 'height', value: '100svh (small viewport)' },
          { cls: 'h-dvh',    prop: 'height', value: '100dvh (dynamic viewport)' },
          { cls: 'h-min',    prop: 'height', value: 'min-content' },
          { cls: 'h-max',    prop: 'height', value: 'max-content' },
          { cls: 'h-fit',    prop: 'height', value: 'fit-content' },
          { cls: 'h-px',     prop: 'height', value: '1px' },
        ]} />

        <p style={{ color: '#94a3b8', margin: '1rem 0 0.5rem', fontWeight: 600 }}>Max width</p>
        <ClassTable rows={[
          { cls: 'max-w-none',   prop: 'max-width', value: 'none' },
          { cls: 'max-w-xs',     prop: 'max-width', value: '20rem  (320px)' },
          { cls: 'max-w-sm',     prop: 'max-width', value: '24rem  (384px)' },
          { cls: 'max-w-md',     prop: 'max-width', value: '28rem  (448px)' },
          { cls: 'max-w-lg',     prop: 'max-width', value: '32rem  (512px)' },
          { cls: 'max-w-xl',     prop: 'max-width', value: '36rem  (576px)' },
          { cls: 'max-w-2xl',    prop: 'max-width', value: '42rem  (672px)' },
          { cls: 'max-w-3xl',    prop: 'max-width', value: '48rem  (768px)' },
          { cls: 'max-w-4xl',    prop: 'max-width', value: '56rem  (896px)' },
          { cls: 'max-w-5xl',    prop: 'max-width', value: '64rem  (1024px)' },
          { cls: 'max-w-6xl',    prop: 'max-width', value: '72rem  (1152px)' },
          { cls: 'max-w-7xl',    prop: 'max-width', value: '80rem  (1280px)' },
          { cls: 'max-w-full',   prop: 'max-width', value: '100%' },
          { cls: 'max-w-prose',  prop: 'max-width', value: '65ch   — ideal reading width' },
          { cls: 'max-w-screen', prop: 'max-width', value: '100vw' },
          { cls: 'max-w-fit',    prop: 'max-width', value: 'fit-content' },
        ]} />

        <p style={{ color: '#94a3b8', margin: '1rem 0 0.5rem', fontWeight: 600 }}>Min width / Min height</p>
        <ClassTable rows={[
          { cls: 'min-w-0',      prop: 'min-width',  value: '0' },
          { cls: 'min-w-full',   prop: 'min-width',  value: '100%' },
          { cls: 'min-w-min',    prop: 'min-width',  value: 'min-content' },
          { cls: 'min-w-max',    prop: 'min-width',  value: 'max-content' },
          { cls: 'min-w-fit',    prop: 'min-width',  value: 'fit-content' },
          { cls: 'min-h-0',      prop: 'min-height', value: '0' },
          { cls: 'min-h-full',   prop: 'min-height', value: '100%' },
          { cls: 'min-h-screen', prop: 'min-height', value: '100vh' },
          { cls: 'min-h-dvh',    prop: 'min-height', value: '100dvh' },
          { cls: 'min-h-fit',    prop: 'min-height', value: 'fit-content' },
        ]} />

        <p style={{ color: '#94a3b8', margin: '1rem 0 0.5rem', fontWeight: 600 }}>size shorthand (width + height together)</p>
        <ClassTable rows={[
          { cls: 'size-{n}',  prop: 'width + height', value: 'same numeric value for both (scale 0–96)' },
          { cls: 'size-auto', prop: 'width + height', value: 'auto auto' },
          { cls: 'size-full', prop: 'width + height', value: '100% 100%' },
          { cls: 'size-fit',  prop: 'width + height', value: 'fit-content fit-content' },
        ]} />

        <CodeBlock code={`<div class="w-full max-w-7xl mx-auto">Full-width, capped at 80rem</div>
<img class="size-12 rounded-full" src="avatar.jpg" />
<div class="w-1/2">Half width</div>
<div class="min-h-screen flex flex-col">Full page layout</div>`} />
      </div>

      <EvoDivider />

      {/* ═══════════════════════════════════════════════
          BORDERS
      ════════════════════════════════════════════════ */}
      <div className="docs-section">
        <SectionTitle id="borders">Borders</SectionTitle>

        <p style={{ color: '#94a3b8', margin: '0 0 0.5rem', fontWeight: 600 }}>Border width</p>
        <ClassTable rows={[
          { cls: 'border',   prop: 'border-width + border-style', value: '1px solid' },
          { cls: 'border-0', prop: 'border-width', value: '0' },
          { cls: 'border-2', prop: 'border-width', value: '2px solid' },
          { cls: 'border-4', prop: 'border-width', value: '4px solid' },
          { cls: 'border-8', prop: 'border-width', value: '8px solid' },
          { cls: 'border-t',   prop: 'border-top-width',    value: '1px solid — top only' },
          { cls: 'border-t-0', prop: 'border-top-width',    value: '0' },
          { cls: 'border-t-2', prop: 'border-top-width',    value: '2px' },
          { cls: 'border-t-4', prop: 'border-top-width',    value: '4px' },
          { cls: 'border-r',   prop: 'border-right-width',  value: '1px solid — right only' },
          { cls: 'border-r-2', prop: 'border-right-width',  value: '2px' },
          { cls: 'border-b',   prop: 'border-bottom-width', value: '1px solid — bottom only' },
          { cls: 'border-b-2', prop: 'border-bottom-width', value: '2px' },
          { cls: 'border-b-4', prop: 'border-bottom-width', value: '4px' },
          { cls: 'border-l',   prop: 'border-left-width',   value: '1px solid — left only' },
          { cls: 'border-l-2', prop: 'border-left-width',   value: '2px' },
          { cls: 'border-x',   prop: 'border-inline-width', value: '1px solid — left + right' },
          { cls: 'border-y',   prop: 'border-block-width',  value: '1px solid — top + bottom' },
        ]} />

        <p style={{ color: '#94a3b8', margin: '1rem 0 0.5rem', fontWeight: 600 }}>Border style</p>
        <ClassTable rows={[
          { cls: 'border-solid',  prop: 'border-style', value: 'solid' },
          { cls: 'border-dashed', prop: 'border-style', value: 'dashed' },
          { cls: 'border-dotted', prop: 'border-style', value: 'dotted' },
          { cls: 'border-double', prop: 'border-style', value: 'double' },
          { cls: 'border-none',   prop: 'border-style', value: 'none' },
        ]} />

        <p style={{ color: '#94a3b8', margin: '1rem 0 0.5rem', fontWeight: 600 }}>Divide — automatic border between children</p>
        <ClassTable rows={[
          { cls: 'divide-y',   prop: 'border-top on every child except first', value: '1px solid' },
          { cls: 'divide-y-2', prop: 'border-top on every child except first', value: '2px solid' },
          { cls: 'divide-x',   prop: 'border-left on every child except first', value: '1px solid' },
          { cls: 'divide-x-2', prop: 'border-left on every child except first', value: '2px solid' },
          { cls: 'divide-none',prop: 'border on children', value: 'none (removes divide)' },
        ]} />

        <p style={{ color: '#94a3b8', margin: '1rem 0 0.5rem', fontWeight: 600 }}>Ring — focus ring via box-shadow</p>
        <ClassTable rows={[
          { cls: 'ring-0', prop: 'box-shadow', value: 'none' },
          { cls: 'ring-1', prop: 'box-shadow', value: '0 0 0 1px (cyan ring color)' },
          { cls: 'ring-2', prop: 'box-shadow', value: '0 0 0 2px (cyan ring color)' },
          { cls: 'ring',   prop: 'box-shadow', value: '0 0 0 3px (cyan ring color)' },
          { cls: 'ring-4', prop: 'box-shadow', value: '0 0 0 4px (cyan ring color)' },
          { cls: 'ring-8', prop: 'box-shadow', value: '0 0 0 8px (cyan ring color)' },
          { cls: 'ring-inset', prop: 'box-shadow', value: 'inset 0 0 0 3px (cyan ring color)' },
        ]} />

        <p style={{ color: '#94a3b8', margin: '1rem 0 0.5rem', fontWeight: 600 }}>Outline</p>
        <ClassTable rows={[
          { cls: 'outline-none',     prop: 'outline', value: 'none' },
          { cls: 'outline',          prop: 'outline', value: '1px solid' },
          { cls: 'outline-2',        prop: 'outline-width', value: '2px' },
          { cls: 'outline-4',        prop: 'outline-width', value: '4px' },
          { cls: 'outline-dashed',   prop: 'outline-style', value: 'dashed' },
          { cls: 'outline-dotted',   prop: 'outline-style', value: 'dotted' },
          { cls: 'outline-offset-0', prop: 'outline-offset', value: '0' },
          { cls: 'outline-offset-2', prop: 'outline-offset', value: '2px' },
          { cls: 'outline-offset-4', prop: 'outline-offset', value: '4px' },
          { cls: 'outline-offset-8', prop: 'outline-offset', value: '8px' },
        ]} />
      </div>

      <EvoDivider />

      {/* ═══════════════════════════════════════════════
          BORDER RADIUS
      ════════════════════════════════════════════════ */}
      <div className="docs-section">
        <SectionTitle id="radius">Border radius</SectionTitle>
        <ClassTable rows={[
          { cls: 'rounded-none', prop: 'border-radius', value: '0' },
          { cls: 'rounded-sm',   prop: 'border-radius', value: '6px' },
          { cls: 'rounded',      prop: 'border-radius', value: '12px' },
          { cls: 'rounded-md',   prop: 'border-radius', value: '12px' },
          { cls: 'rounded-lg',   prop: 'border-radius', value: '16px' },
          { cls: 'rounded-xl',   prop: 'border-radius', value: '20px' },
          { cls: 'rounded-2xl',  prop: 'border-radius', value: '1.5rem (24px)' },
          { cls: 'rounded-3xl',  prop: 'border-radius', value: '2rem   (32px)' },
          { cls: 'rounded-full', prop: 'border-radius', value: '9999px — pill / circle' },
          { cls: 'rounded-t-sm / rounded-t / rounded-t-lg / rounded-t-full', prop: 'border-top-left-radius + border-top-right-radius', value: 'top corners only' },
          { cls: 'rounded-b-sm / rounded-b / rounded-b-lg / rounded-b-full', prop: 'border-bottom-left-radius + border-bottom-right-radius', value: 'bottom corners only' },
          { cls: 'rounded-l-sm / rounded-l / rounded-l-lg / rounded-l-full', prop: 'border-top-left-radius + border-bottom-left-radius', value: 'left corners only' },
          { cls: 'rounded-r-sm / rounded-r / rounded-r-lg / rounded-r-full', prop: 'border-top-right-radius + border-bottom-right-radius', value: 'right corners only' },
        ]} />
      </div>

      <EvoDivider />

      {/* ═══════════════════════════════════════════════
          SHADOWS
      ════════════════════════════════════════════════ */}
      <div className="docs-section">
        <SectionTitle id="shadows">Shadows</SectionTitle>
        <ClassTable rows={[
          { cls: 'shadow-none',  prop: 'box-shadow', value: 'none' },
          { cls: 'shadow-sm',    prop: 'box-shadow', value: '0 1px 2px rgba(0,0,0,0.05)' },
          { cls: 'shadow',       prop: 'box-shadow', value: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -2px rgba(0,0,0,0.1)' },
          { cls: 'shadow-md',    prop: 'box-shadow', value: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -2px rgba(0,0,0,0.1)' },
          { cls: 'shadow-lg',    prop: 'box-shadow', value: '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1)' },
          { cls: 'shadow-xl',    prop: 'box-shadow', value: '0 20px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)' },
          { cls: 'shadow-2xl',   prop: 'box-shadow', value: '0 25px 50px -12px rgba(0,0,0,0.25)' },
          { cls: 'shadow-inner', prop: 'box-shadow', value: 'inset 0 2px 4px 0 rgba(0,0,0,0.05)' },
        ]} />
      </div>

      <EvoDivider />

      {/* ═══════════════════════════════════════════════
          OPACITY
      ════════════════════════════════════════════════ */}
      <div className="docs-section">
        <SectionTitle id="opacity">Opacity</SectionTitle>
        <ClassTable rows={[
          { cls: 'opacity-0',   prop: 'opacity', value: '0     — fully transparent' },
          { cls: 'opacity-5',   prop: 'opacity', value: '0.05' },
          { cls: 'opacity-10',  prop: 'opacity', value: '0.1' },
          { cls: 'opacity-15',  prop: 'opacity', value: '0.15' },
          { cls: 'opacity-20',  prop: 'opacity', value: '0.2' },
          { cls: 'opacity-25',  prop: 'opacity', value: '0.25' },
          { cls: 'opacity-30',  prop: 'opacity', value: '0.3' },
          { cls: 'opacity-40',  prop: 'opacity', value: '0.4' },
          { cls: 'opacity-50',  prop: 'opacity', value: '0.5  — half transparent' },
          { cls: 'opacity-60',  prop: 'opacity', value: '0.6' },
          { cls: 'opacity-70',  prop: 'opacity', value: '0.7' },
          { cls: 'opacity-75',  prop: 'opacity', value: '0.75' },
          { cls: 'opacity-80',  prop: 'opacity', value: '0.8' },
          { cls: 'opacity-90',  prop: 'opacity', value: '0.9' },
          { cls: 'opacity-95',  prop: 'opacity', value: '0.95' },
          { cls: 'opacity-100', prop: 'opacity', value: '1     — fully opaque' },
        ]} />
      </div>

      <EvoDivider />

      {/* ═══════════════════════════════════════════════
          TRANSITIONS
      ════════════════════════════════════════════════ */}
      <div className="docs-section">
        <SectionTitle id="transitions">Transitions</SectionTitle>

        <p style={{ color: '#94a3b8', margin: '0 0 0.5rem', fontWeight: 600 }}>Transition property</p>
        <ClassTable rows={[
          { cls: 'transition-none',      prop: 'transition', value: 'none' },
          { cls: 'transition',           prop: 'transition', value: 'color, background-color, border-color, opacity, box-shadow, transform, filter — 250ms ease' },
          { cls: 'transition-all',       prop: 'transition', value: 'all — 250ms ease' },
          { cls: 'transition-colors',    prop: 'transition', value: 'color, background-color, border-color — 250ms ease' },
          { cls: 'transition-opacity',   prop: 'transition', value: 'opacity — 250ms ease' },
          { cls: 'transition-shadow',    prop: 'transition', value: 'box-shadow — 250ms ease' },
          { cls: 'transition-transform', prop: 'transition', value: 'transform — 250ms ease' },
        ]} />

        <p style={{ color: '#94a3b8', margin: '1rem 0 0.5rem', fontWeight: 600 }}>Duration</p>
        <ClassTable rows={[
          { cls: 'duration-75',   prop: 'transition-duration', value: '75ms' },
          { cls: 'duration-100',  prop: 'transition-duration', value: '100ms' },
          { cls: 'duration-150',  prop: 'transition-duration', value: '150ms' },
          { cls: 'duration-200',  prop: 'transition-duration', value: '200ms' },
          { cls: 'duration-300',  prop: 'transition-duration', value: '300ms' },
          { cls: 'duration-500',  prop: 'transition-duration', value: '500ms' },
          { cls: 'duration-700',  prop: 'transition-duration', value: '700ms' },
          { cls: 'duration-1000', prop: 'transition-duration', value: '1000ms' },
        ]} />

        <p style={{ color: '#94a3b8', margin: '1rem 0 0.5rem', fontWeight: 600 }}>Easing</p>
        <ClassTable rows={[
          { cls: 'ease-linear',  prop: 'transition-timing-function', value: 'linear' },
          { cls: 'ease-in',      prop: 'transition-timing-function', value: 'cubic-bezier(0.4, 0, 1, 1)' },
          { cls: 'ease-out',     prop: 'transition-timing-function', value: 'cubic-bezier(0, 0, 0.2, 1)' },
          { cls: 'ease-in-out',  prop: 'transition-timing-function', value: 'cubic-bezier(0.4, 0, 0.2, 1)' },
          { cls: 'ease-spring',  prop: 'transition-timing-function', value: 'cubic-bezier(0.34, 1.56, 0.64, 1) — bouncy' },
        ]} />

        <CodeBlock code={`<!-- Smooth background color change on hover -->
<button class="transition-colors duration-200 bg-cyan-600 hover:bg-cyan-700">
  Hover me
</button>

<!-- Spring scale effect -->
<div class="transition-transform ease-spring duration-300 hover:scale-105">
  Pop on hover
</div>`} />
      </div>

      <EvoDivider />

      {/* ═══════════════════════════════════════════════
          TRANSFORMS
      ════════════════════════════════════════════════ */}
      <div className="docs-section">
        <SectionTitle id="transforms">Transforms</SectionTitle>

        <p style={{ color: '#94a3b8', margin: '0 0 0.5rem', fontWeight: 600 }}>Scale</p>
        <ClassTable rows={[
          { cls: 'scale-0',   prop: 'transform', value: 'scale(0)' },
          { cls: 'scale-50',  prop: 'transform', value: 'scale(0.5)' },
          { cls: 'scale-75',  prop: 'transform', value: 'scale(0.75)' },
          { cls: 'scale-90',  prop: 'transform', value: 'scale(0.9)' },
          { cls: 'scale-95',  prop: 'transform', value: 'scale(0.95)' },
          { cls: 'scale-100', prop: 'transform', value: 'scale(1) — original' },
          { cls: 'scale-105', prop: 'transform', value: 'scale(1.05)' },
          { cls: 'scale-110', prop: 'transform', value: 'scale(1.1)' },
          { cls: 'scale-125', prop: 'transform', value: 'scale(1.25)' },
          { cls: 'scale-150', prop: 'transform', value: 'scale(1.5)' },
        ]} />

        <p style={{ color: '#94a3b8', margin: '1rem 0 0.5rem', fontWeight: 600 }}>Rotate</p>
        <ClassTable rows={[
          { cls: 'rotate-0',    prop: 'transform', value: 'rotate(0deg)' },
          { cls: 'rotate-1',    prop: 'transform', value: 'rotate(1deg)' },
          { cls: 'rotate-2',    prop: 'transform', value: 'rotate(2deg)' },
          { cls: 'rotate-3',    prop: 'transform', value: 'rotate(3deg)' },
          { cls: 'rotate-6',    prop: 'transform', value: 'rotate(6deg)' },
          { cls: 'rotate-12',   prop: 'transform', value: 'rotate(12deg)' },
          { cls: 'rotate-45',   prop: 'transform', value: 'rotate(45deg)' },
          { cls: 'rotate-90',   prop: 'transform', value: 'rotate(90deg)' },
          { cls: 'rotate-180',  prop: 'transform', value: 'rotate(180deg)' },
          { cls: '-rotate-1',   prop: 'transform', value: 'rotate(-1deg)' },
          { cls: '-rotate-2',   prop: 'transform', value: 'rotate(-2deg)' },
          { cls: '-rotate-45',  prop: 'transform', value: 'rotate(-45deg)' },
          { cls: '-rotate-90',  prop: 'transform', value: 'rotate(-90deg)' },
          { cls: '-rotate-180', prop: 'transform', value: 'rotate(-180deg)' },
        ]} />

        <p style={{ color: '#94a3b8', margin: '1rem 0 0.5rem', fontWeight: 600 }}>Translate</p>
        <ClassTable rows={[
          { cls: 'translate-x-0',      prop: 'transform', value: 'translateX(0)' },
          { cls: 'translate-y-0',      prop: 'transform', value: 'translateY(0)' },
          { cls: 'translate-x-full',   prop: 'transform', value: 'translateX(100%)' },
          { cls: 'translate-y-full',   prop: 'transform', value: 'translateY(100%)' },
          { cls: '-translate-x-full',  prop: 'transform', value: 'translateX(-100%)' },
          { cls: '-translate-y-full',  prop: 'transform', value: 'translateY(-100%)' },
          { cls: '-translate-x-1/2',   prop: 'transform', value: 'translateX(-50%) — center horizontally over anchor' },
          { cls: '-translate-y-1/2',   prop: 'transform', value: 'translateY(-50%) — center vertically over anchor' },
        ]} />

        <p style={{ color: '#94a3b8', margin: '1rem 0 0.5rem', fontWeight: 600 }}>Transform origin</p>
        <ClassTable rows={[
          { cls: 'origin-center',       prop: 'transform-origin', value: 'center' },
          { cls: 'origin-top',          prop: 'transform-origin', value: 'top' },
          { cls: 'origin-top-right',    prop: 'transform-origin', value: 'top right' },
          { cls: 'origin-right',        prop: 'transform-origin', value: 'right' },
          { cls: 'origin-bottom-right', prop: 'transform-origin', value: 'bottom right' },
          { cls: 'origin-bottom',       prop: 'transform-origin', value: 'bottom' },
          { cls: 'origin-bottom-left',  prop: 'transform-origin', value: 'bottom left' },
          { cls: 'origin-left',         prop: 'transform-origin', value: 'left' },
          { cls: 'origin-top-left',     prop: 'transform-origin', value: 'top left' },
        ]} />

        <p style={{ color: '#94a3b8', margin: '1rem 0 0.5rem', fontWeight: 600 }}>Backdrop blur (frosted glass)</p>
        <ClassTable rows={[
          { cls: 'backdrop-blur-none', prop: 'backdrop-filter', value: 'none' },
          { cls: 'backdrop-blur-sm',   prop: 'backdrop-filter', value: 'blur(4px)' },
          { cls: 'backdrop-blur',      prop: 'backdrop-filter', value: 'blur(8px)' },
          { cls: 'backdrop-blur-md',   prop: 'backdrop-filter', value: 'blur(12px)' },
          { cls: 'backdrop-blur-lg',   prop: 'backdrop-filter', value: 'blur(16px)' },
          { cls: 'backdrop-blur-xl',   prop: 'backdrop-filter', value: 'blur(24px)' },
          { cls: 'backdrop-blur-2xl',  prop: 'backdrop-filter', value: 'blur(40px)' },
        ]} />
      </div>

      <EvoDivider />

      {/* ═══════════════════════════════════════════════
          POSITION
      ════════════════════════════════════════════════ */}
      <div className="docs-section">
        <SectionTitle id="position">Position</SectionTitle>
        <ClassTable rows={[
          { cls: 'static',   prop: 'position', value: 'static   — default, in normal flow' },
          { cls: 'relative', prop: 'position', value: 'relative — offset from normal position, creates stacking context' },
          { cls: 'absolute', prop: 'position', value: 'absolute — removed from flow, positioned to nearest relative parent' },
          { cls: 'fixed',    prop: 'position', value: 'fixed    — removed from flow, positioned to the viewport' },
          { cls: 'sticky',   prop: 'position', value: 'sticky   — stays in flow, sticks when scrolled past threshold' },
        ]} />

        <CodeBlock code={`<!-- Badge on a card -->
<div class="relative">
  <img src="card.jpg" />
  <span class="absolute top-2 right-2 bg-cyan-500 rounded-full px-2 py-1 text-xs">
    NEW
  </span>
</div>

<!-- Fixed top navigation -->
<nav class="fixed top-0 left-0 w-full z-modal bg-slate-900 border-b border-slate-700">
  ...
</nav>

<!-- Sticky table header -->
<thead class="sticky top-0 bg-slate-900">...</thead>`} />
      </div>

      <EvoDivider />

      {/* ═══════════════════════════════════════════════
          INSET
      ════════════════════════════════════════════════ */}
      <div className="docs-section">
        <SectionTitle id="inset">Inset (top / right / bottom / left)</SectionTitle>
        <p style={{ color: '#94a3b8', marginBottom: '1rem', lineHeight: '1.6' }}>
          Used with <code>absolute</code>, <code>fixed</code>, or <code>sticky</code> positioning.
          Replace <code>{'{n}'}</code> with 0–64 from the spacing scale.
          Negative versions use <code>{'-top-{n}'}</code>.
        </p>
        <ClassTable rows={[
          { cls: 'inset-0',    prop: 'inset (top+right+bottom+left)', value: '0       — fills parent absolutely' },
          { cls: 'inset-auto', prop: 'inset', value: 'auto' },
          { cls: 'inset-full', prop: 'inset', value: '100%' },
          { cls: 'inset-x-0',  prop: 'left + right', value: '0   — pin to both sides' },
          { cls: 'inset-y-0',  prop: 'top + bottom',  value: '0   — pin to top and bottom' },
          { cls: 'top-{n}',    prop: 'top',           value: 'spacing scale value' },
          { cls: 'right-{n}',  prop: 'right',         value: 'spacing scale value' },
          { cls: 'bottom-{n}', prop: 'bottom',        value: 'spacing scale value' },
          { cls: 'left-{n}',   prop: 'left',          value: 'spacing scale value' },
          { cls: 'top-auto',   prop: 'top',           value: 'auto' },
          { cls: 'right-auto', prop: 'right',         value: 'auto' },
          { cls: 'bottom-auto',prop: 'bottom',        value: 'auto' },
          { cls: 'left-auto',  prop: 'left',          value: 'auto' },
          { cls: 'top-full',   prop: 'top',           value: '100% — place below parent' },
          { cls: 'left-full',  prop: 'left',          value: '100% — place to the right of parent' },
          { cls: 'top-px',     prop: 'top',           value: '1px' },
          { cls: '-top-{n}',   prop: 'top',           value: 'negative — pull above parent' },
          { cls: '-left-{n}',  prop: 'left',          value: 'negative — pull left of parent' },
        ]} />
      </div>

      <EvoDivider />

      {/* ═══════════════════════════════════════════════
          Z-INDEX
      ════════════════════════════════════════════════ */}
      <div className="docs-section">
        <SectionTitle id="zindex">Z-index</SectionTitle>
        <ClassTable rows={[
          { cls: 'z-0',    prop: 'z-index', value: '0' },
          { cls: 'z-10',   prop: 'z-index', value: '10' },
          { cls: 'z-20',   prop: 'z-index', value: '20' },
          { cls: 'z-30',   prop: 'z-index', value: '30' },
          { cls: 'z-40',   prop: 'z-index', value: '40' },
          { cls: 'z-50',   prop: 'z-index', value: '50' },
          { cls: 'z-auto', prop: 'z-index', value: 'auto' },
        ]} />
        <p style={{ color: '#94a3b8', margin: '1rem 0 0.5rem', fontWeight: 600 }}>Named z-index layers (semantic aliases)</p>
        <ClassTable rows={[
          { cls: 'z-base',    prop: 'z-index', value: '0   — normal flow' },
          { cls: 'z-raised',  prop: 'z-index', value: '10  — dropdowns, popovers' },
          { cls: 'z-overlay', prop: 'z-index', value: '100 — backdrop overlays' },
          { cls: 'z-modal',   prop: 'z-index', value: '200 — modal dialogs' },
          { cls: 'z-toast',   prop: 'z-index', value: '300 — toast notifications' },
          { cls: 'z-tooltip', prop: 'z-index', value: '400 — tooltips' },
          { cls: 'z-top',     prop: 'z-index', value: '9999 — always on top' },
        ]} />
      </div>

      <EvoDivider />

      {/* ═══════════════════════════════════════════════
          OVERFLOW
      ════════════════════════════════════════════════ */}
      <div className="docs-section">
        <SectionTitle id="overflow">Overflow</SectionTitle>
        <ClassTable rows={[
          { cls: 'overflow-auto',     prop: 'overflow',   value: 'auto    — scrollbar only when needed' },
          { cls: 'overflow-hidden',   prop: 'overflow',   value: 'hidden  — clip content, no scrollbar' },
          { cls: 'overflow-visible',  prop: 'overflow',   value: 'visible — content can overflow (default)' },
          { cls: 'overflow-scroll',   prop: 'overflow',   value: 'scroll  — always show scrollbar' },
          { cls: 'overflow-clip',     prop: 'overflow',   value: 'clip' },
          { cls: 'overflow-x-auto',   prop: 'overflow-x', value: 'auto' },
          { cls: 'overflow-x-hidden', prop: 'overflow-x', value: 'hidden' },
          { cls: 'overflow-x-scroll', prop: 'overflow-x', value: 'scroll' },
          { cls: 'overflow-y-auto',   prop: 'overflow-y', value: 'auto' },
          { cls: 'overflow-y-hidden', prop: 'overflow-y', value: 'hidden' },
          { cls: 'overflow-y-scroll', prop: 'overflow-y', value: 'scroll' },
        ]} />
      </div>

      <EvoDivider />

      {/* ═══════════════════════════════════════════════
          CURSOR
      ════════════════════════════════════════════════ */}
      <div className="docs-section">
        <SectionTitle id="cursor">Cursor</SectionTitle>
        <ClassTable rows={[
          { cls: 'cursor-auto',        prop: 'cursor', value: 'auto' },
          { cls: 'cursor-default',     prop: 'cursor', value: 'default — arrow pointer' },
          { cls: 'cursor-pointer',     prop: 'cursor', value: 'pointer — hand, for clickable elements' },
          { cls: 'cursor-wait',        prop: 'cursor', value: 'wait — loading spinner' },
          { cls: 'cursor-text',        prop: 'cursor', value: 'text — I-beam for text input' },
          { cls: 'cursor-move',        prop: 'cursor', value: 'move — four-directional arrow' },
          { cls: 'cursor-not-allowed', prop: 'cursor', value: 'not-allowed — crossed circle (disabled)' },
          { cls: 'cursor-none',        prop: 'cursor', value: 'none — hides cursor' },
          { cls: 'cursor-grab',        prop: 'cursor', value: 'grab — open hand (draggable)' },
          { cls: 'cursor-grabbing',    prop: 'cursor', value: 'grabbing — closed hand (dragging)' },
          { cls: 'cursor-crosshair',   prop: 'cursor', value: 'crosshair' },
          { cls: 'cursor-zoom-in',     prop: 'cursor', value: 'zoom-in' },
          { cls: 'cursor-zoom-out',    prop: 'cursor', value: 'zoom-out' },
          { cls: 'cursor-help',        prop: 'cursor', value: 'help — arrow with question mark' },
          { cls: 'cursor-col-resize',  prop: 'cursor', value: 'col-resize — column resizer' },
          { cls: 'cursor-row-resize',  prop: 'cursor', value: 'row-resize — row resizer' },
        ]} />
      </div>

      <EvoDivider />

      {/* ═══════════════════════════════════════════════
          MISC
      ════════════════════════════════════════════════ */}
      <div className="docs-section">
        <SectionTitle id="misc">Misc</SectionTitle>

        <p style={{ color: '#94a3b8', margin: '0 0 0.5rem', fontWeight: 600 }}>Pointer events</p>
        <ClassTable rows={[
          { cls: 'pointer-events-none', prop: 'pointer-events', value: 'none — element ignores all mouse events' },
          { cls: 'pointer-events-auto', prop: 'pointer-events', value: 'auto — restore pointer events' },
        ]} />

        <p style={{ color: '#94a3b8', margin: '1rem 0 0.5rem', fontWeight: 600 }}>User select (text selection)</p>
        <ClassTable rows={[
          { cls: 'select-none', prop: 'user-select', value: 'none — can\'t select text' },
          { cls: 'select-text', prop: 'user-select', value: 'text — normal text selection' },
          { cls: 'select-all',  prop: 'user-select', value: 'all  — click selects entire content' },
          { cls: 'select-auto', prop: 'user-select', value: 'auto' },
        ]} />

        <p style={{ color: '#94a3b8', margin: '1rem 0 0.5rem', fontWeight: 600 }}>Appearance</p>
        <ClassTable rows={[
          { cls: 'appearance-none', prop: 'appearance', value: 'none — remove browser default styling (inputs, selects)' },
          { cls: 'appearance-auto', prop: 'appearance', value: 'auto' },
        ]} />

        <p style={{ color: '#94a3b8', margin: '1rem 0 0.5rem', fontWeight: 600 }}>Resize</p>
        <ClassTable rows={[
          { cls: 'resize-none', prop: 'resize', value: 'none — can\'t resize' },
          { cls: 'resize-x',    prop: 'resize', value: 'horizontal — only horizontal' },
          { cls: 'resize-y',    prop: 'resize', value: 'vertical — only vertical' },
          { cls: 'resize',      prop: 'resize', value: 'both — free resize' },
        ]} />

        <p style={{ color: '#94a3b8', margin: '1rem 0 0.5rem', fontWeight: 600 }}>Scroll behavior</p>
        <ClassTable rows={[
          { cls: 'scroll-auto',   prop: 'scroll-behavior', value: 'auto   — instant jump' },
          { cls: 'scroll-smooth', prop: 'scroll-behavior', value: 'smooth — animated scroll' },
        ]} />

        <p style={{ color: '#94a3b8', margin: '1rem 0 0.5rem', fontWeight: 600 }}>Box sizing</p>
        <ClassTable rows={[
          { cls: 'box-border',  prop: 'box-sizing', value: 'border-box  — padding/border included in width (recommended)' },
          { cls: 'box-content', prop: 'box-sizing', value: 'content-box — padding/border added on top of width (browser default)' },
        ]} />

        <p style={{ color: '#94a3b8', margin: '1rem 0 0.5rem', fontWeight: 600 }}>Aspect ratio</p>
        <ClassTable rows={[
          { cls: 'aspect-auto',   prop: 'aspect-ratio', value: 'auto' },
          { cls: 'aspect-square', prop: 'aspect-ratio', value: '1 / 1   — square' },
          { cls: 'aspect-video',  prop: 'aspect-ratio', value: '16 / 9  — widescreen video' },
        ]} />

        <p style={{ color: '#94a3b8', margin: '1rem 0 0.5rem', fontWeight: 600 }}>Object fit (for img / video)</p>
        <ClassTable rows={[
          { cls: 'object-contain',    prop: 'object-fit', value: 'contain    — whole image visible, may letterbox' },
          { cls: 'object-cover',      prop: 'object-fit', value: 'cover      — fills box, may crop' },
          { cls: 'object-fill',       prop: 'object-fit', value: 'fill       — stretches to fill (default)' },
          { cls: 'object-none',       prop: 'object-fit', value: 'none       — original size, may overflow' },
          { cls: 'object-scale-down', prop: 'object-fit', value: 'scale-down — smaller of contain / none' },
        ]} />

        <p style={{ color: '#94a3b8', margin: '1rem 0 0.5rem', fontWeight: 600 }}>Will change (performance hint)</p>
        <ClassTable rows={[
          { cls: 'will-change-auto',      prop: 'will-change', value: 'auto' },
          { cls: 'will-change-scroll',    prop: 'will-change', value: 'scroll-position' },
          { cls: 'will-change-contents',  prop: 'will-change', value: 'contents' },
          { cls: 'will-change-transform', prop: 'will-change', value: 'transform — hint GPU to promote to its own layer' },
        ]} />

        <p style={{ color: '#94a3b8', margin: '1rem 0 0.5rem', fontWeight: 600 }}>Float / clearfix</p>
        <ClassTable rows={[
          { cls: 'float-left',  prop: 'float', value: 'left' },
          { cls: 'float-right', prop: 'float', value: 'right' },
          { cls: 'float-none',  prop: 'float', value: 'none' },
          { cls: 'clearfix',    prop: '::after pseudo-element', value: 'clears floated children' },
        ]} />

        <p style={{ color: '#94a3b8', margin: '1rem 0 0.5rem', fontWeight: 600 }}>Isolation (creates new stacking context)</p>
        <ClassTable rows={[
          { cls: 'isolate',        prop: 'isolation', value: 'isolate — new stacking context, stops z-index bleed' },
          { cls: 'isolation-auto', prop: 'isolation', value: 'auto' },
        ]} />
      </div>

    </div>
  )
}
