import { useEvoTheme, EvoThemeToggle, EvoStack, EvoBadge, EvoDivider } from '@justin_evo/evo-ui'
import { CodeBlock } from '../components/CodeBlock'
import { PropsTable } from '../components/PropsTable'

const SEMANTIC_TOKENS: { name: string; label: string }[] = [
  { name: '--evo-color-bg',               label: 'Page background' },
  { name: '--evo-color-surface',          label: 'Surface (cards, sidebars)' },
  { name: '--evo-color-surface-elevated', label: 'Elevated surface (modals, menus)' },
  { name: '--evo-color-surface-sunken',   label: 'Sunken surface (insets)' },
  { name: '--evo-color-surface-hover',    label: 'Surface hover state' },
  { name: '--evo-color-border',           label: 'Default border' },
  { name: '--evo-color-border-strong',    label: 'Strong border' },
  { name: '--evo-color-text',             label: 'Primary text' },
  { name: '--evo-color-text-secondary',   label: 'Secondary text' },
  { name: '--evo-color-text-muted',       label: 'Muted text' },
  { name: '--evo-color-primary',          label: 'Brand primary' },
  { name: '--evo-color-primary-hover',    label: 'Primary hover' },
  { name: '--evo-color-primary-fg',       label: 'Foreground on primary' },
  { name: '--evo-color-danger',           label: 'Danger / destructive' },
  { name: '--evo-color-warning',          label: 'Warning' },
  { name: '--evo-color-success',          label: 'Success' },
  { name: '--evo-color-info',             label: 'Info' },
  { name: '--evo-color-overlay',          label: 'Modal overlay' },
]

function TokenSwatch({ name, label }: { name: string; label: string }) {
  return (
    <div className="docs-token-card">
      <div
        className="docs-token-swatch"
        style={{ background: `var(${name})` }}
        aria-hidden="true"
      />
      <div className="docs-token-meta">
        <span className="docs-token-name">{name}</span>
        <span className="docs-token-label">{label}</span>
      </div>
    </div>
  )
}

function CurrentThemeReadout() {
  const { theme, resolvedTheme, setTheme, toggleTheme } = useEvoTheme()
  return (
    <div className="docs-preview" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '0.75rem' }}>
      <EvoStack direction="row" gap="0.5rem" align="center">
        <span style={{ fontSize: '0.85rem', color: 'var(--docs-text-muted)' }}>Current mode:</span>
        <EvoBadge severity={resolvedTheme === 'dark' ? 'info' : 'warning'} variant="subtle">
          {resolvedTheme}
        </EvoBadge>
        <span style={{ fontSize: '0.85rem', color: 'var(--docs-text-muted)' }}>
          (preference: <code>{theme}</code>)
        </span>
      </EvoStack>
      <EvoStack direction="row" gap="0.5rem" align="center">
        <EvoThemeToggle />
        <button
          type="button"
          onClick={() => setTheme('light')}
          style={chipStyle(theme === 'light')}
        >
          Light
        </button>
        <button
          type="button"
          onClick={() => setTheme('dark')}
          style={chipStyle(theme === 'dark')}
        >
          Dark
        </button>
        <button
          type="button"
          onClick={() => setTheme('system')}
          style={chipStyle(theme === 'system')}
        >
          System
        </button>
        <button
          type="button"
          onClick={toggleTheme}
          style={chipStyle(false)}
        >
          Toggle
        </button>
      </EvoStack>
    </div>
  )
}

function chipStyle(active: boolean): React.CSSProperties {
  return {
    background: active ? 'var(--evo-color-primary)' : 'transparent',
    color: active ? 'var(--evo-color-primary-fg)' : 'var(--docs-text)',
    border: `1px solid ${active ? 'var(--evo-color-primary)' : 'var(--docs-border)'}`,
    borderRadius: '6px',
    padding: '0.35rem 0.7rem',
    fontSize: '0.8rem',
    fontWeight: 500,
    cursor: 'pointer',
    fontFamily: 'inherit',
  }
}

export default function ThemingPage() {
  return (
    <div>
      <div className="docs-page-header">
        <div className="docs-page-tag">Getting Started</div>
        <h1 className="docs-page-title">Theming</h1>
        <p className="docs-page-desc">
          Evo UI ships with a built-in <strong>light</strong> and <strong>dark</strong> theme,
          powered by CSS custom properties and a small React provider. Every component
          re-themes itself the moment you flip a single <code>data-theme</code> attribute —
          no re-renders, no CSS reload, and developers can override any token from their own
          stylesheet.
        </p>
        <div className="docs-import-line">
          import {'{ '}<span>EvoThemeProvider</span>, <span>EvoThemeToggle</span>, <span>useEvoTheme</span>{' }'} from '@justin_evo/evo-ui'
        </div>
      </div>

      {/* ── Live demo ─────────────────────────────────────── */}
      <div className="docs-section">
        <div className="docs-section-title">Try it</div>
        <CurrentThemeReadout />
      </div>

      {/* ── Setup ─────────────────────────────────────────── */}
      <div className="docs-section">
        <div className="docs-section-title">1 · Wrap your app</div>
        <p className="docs-page-desc">
          Mount <code>EvoThemeProvider</code> once at the root of your tree. It reads any
          previously-saved choice from <code>localStorage</code>, falls back to the user's OS
          preference, and writes <code>data-theme</code> to the document root.
        </p>
        <CodeBlock code={`import { EvoThemeProvider } from '@justin_evo/evo-ui'
import '@justin_evo/evo-ui/dist/evo-ui.css'

createRoot(document.getElementById('root')!).render(
  <EvoThemeProvider defaultTheme="system">
    <App />
  </EvoThemeProvider>
)`} />
      </div>

      <div className="docs-section">
        <div className="docs-section-title">2 · Add a toggle</div>
        <p className="docs-page-desc">
          Drop in the pre-built <code>EvoThemeToggle</code> for an animated sun/moon switch,
          or build your own with the <code>useEvoTheme</code> hook.
        </p>
        <div className="docs-preview">
          <EvoStack direction="row" gap="0.75rem" align="center">
            <EvoThemeToggle size="sm" />
            <EvoThemeToggle size="md" />
            <EvoThemeToggle size="lg" />
          </EvoStack>
        </div>
        <CodeBlock code={`import { EvoThemeToggle } from '@justin_evo/evo-ui'

<EvoThemeToggle size="md" />`} />
      </div>

      <div className="docs-section">
        <div className="docs-section-title">3 · Or use the hook directly</div>
        <CodeBlock code={`import { useEvoTheme } from '@justin_evo/evo-ui'

function MyToggle() {
  const { theme, resolvedTheme, setTheme, toggleTheme } = useEvoTheme()

  return (
    <button onClick={toggleTheme}>
      {resolvedTheme === 'dark' ? '☀️ Light' : '🌙 Dark'}
    </button>
  )
}`} />
      </div>

      <EvoDivider className="docs-section" />

      {/* ── Tokens ─────────────────────────────────────────── */}
      <div className="docs-section">
        <div className="docs-section-title">Semantic tokens</div>
        <p className="docs-page-desc">
          Components never reference raw palette colors. Instead, they read these semantic
          CSS variables — which automatically resolve to different values in light and dark mode.
          Swatches below reflect <strong>your current theme</strong>:
        </p>
        <div className="docs-token-grid">
          {SEMANTIC_TOKENS.map((t) => (
            <TokenSwatch key={t.name} name={t.name} label={t.label} />
          ))}
        </div>
      </div>

      {/* ── Customising ────────────────────────────────────── */}
      <div className="docs-section">
        <div className="docs-section-title">Customising the theme</div>
        <p className="docs-page-desc">
          Override any token from your own CSS. Scope it to <code>:root</code> to change it
          everywhere, or to a specific <code>data-theme</code> attribute to only override one
          mode.
        </p>
        <CodeBlock lang="css" code={`/* Change brand color in both modes */
:root {
  --evo-color-primary:       #ff6b6b;
  --evo-color-primary-hover: #e8484b;
  --evo-color-primary-fg:    #ffffff;
}

/* Tweak only the dark-mode background */
[data-theme='dark'] {
  --evo-color-bg:      #0a0a0a;
  --evo-color-surface: #141414;
}`} />
      </div>

      {/* ── Manual control ─────────────────────────────────── */}
      <div className="docs-section">
        <div className="docs-section-title">Manual data-theme</div>
        <p className="docs-page-desc">
          If you don't want the React provider, just set the attribute yourself. Components
          still respond instantly because the rules live in CSS.
        </p>
        <CodeBlock lang="html" code={`<html data-theme="dark">
  <!-- everything inside is dark themed -->
</html>`} />
      </div>

      {/* ── SSR / Flash prevention ─────────────────────────── */}
      <div className="docs-section">
        <div className="docs-section-title">Preventing the flash (SSR)</div>
        <p className="docs-page-desc">
          On first paint, the browser hasn't run React yet. To avoid a white flash for
          dark-mode users, inline the bootstrap script in your <code>&lt;head&gt;</code>:
        </p>
        <CodeBlock code={`import { getEvoThemeScript } from '@justin_evo/evo-ui'

// e.g. inside Next.js _document or any HTML template
<script
  dangerouslySetInnerHTML={{ __html: getEvoThemeScript() }}
/>`} />
      </div>

      <EvoDivider className="docs-section" />

      {/* ── Provider props ─────────────────────────────────── */}
      <div className="docs-section">
        <div className="docs-section-title">EvoThemeProvider props</div>
        <PropsTable props={[
          { prop: 'defaultTheme',      type: "'light' | 'dark' | 'system'", default: "'system'",         description: 'Initial mode used before any persisted choice is restored.' },
          { prop: 'storageKey',        type: "string | null",               default: "'evo-ui-theme'",  description: "localStorage key to persist the choice. Pass null to disable persistence." },
          { prop: 'attribute',         type: "'data-theme' | 'class'",      default: "'data-theme'",     description: "Where to apply the theme on <html>. Use 'class' to share with Tailwind." },
          { prop: 'enableTransitions', type: 'boolean',                     default: 'true',             description: 'Animate color changes when the theme flips (respects prefers-reduced-motion).' },
          { prop: 'target',            type: 'HTMLElement',                 default: 'document.documentElement', description: 'Element to write the theme attribute to. Useful for scoping.' },
        ]} />
      </div>

      <div className="docs-section">
        <div className="docs-section-title">useEvoTheme()</div>
        <PropsTable props={[
          { prop: 'theme',         type: "'light' | 'dark' | 'system'", description: 'The user-selected mode (may be system).' },
          { prop: 'resolvedTheme', type: "'light' | 'dark'",            description: 'The mode currently painted, after resolving system against the OS preference.' },
          { prop: 'setTheme',      type: "(t: EvoTheme) => void",       description: 'Switch to a specific mode; persists if storageKey is enabled.' },
          { prop: 'toggleTheme',   type: '() => void',                  description: 'Flip between light and dark.' },
        ]} />
      </div>

      <div className="docs-section">
        <div className="docs-section-title">EvoThemeToggle props</div>
        <PropsTable props={[
          { prop: 'size',      type: "'sm' | 'md' | 'lg'", default: "'md'",                  description: 'Visual size of the toggle.' },
          { prop: 'ariaLabel', type: 'string',             default: "'Toggle color theme'", description: 'Accessible label for screen readers.' },
          { prop: 'className', type: 'string',             description: 'Extra className appended to the built-in styles.' },
        ]} />
      </div>
    </div>
  )
}
