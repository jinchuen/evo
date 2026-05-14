import { EvoBadge, EvoStack } from '@justin_evo/evo-ui'

// Evo UI is still pre-release — nothing has shipped to consumers yet, so every
// change rolls up into a single in-progress v1.0.0 entry under a "Created"
// section. Once the library actually publishes its first release, switch this
// type back to the four-kind format ('Added' | 'Changed' | 'Fixed' | 'Breaking')
// and start a new dated entry per version. See INFO.md §3 for the post-launch
// format.
type ChangeKind = 'Created' | 'Added' | 'Changed' | 'Fixed' | 'Breaking'

type ReleaseSection = { kind: ChangeKind; items: string[] }

type Release = {
  version: string
  date: string
  summary?: string
  sections: ReleaseSection[]
  migration?: string
}

const SEVERITY: Record<ChangeKind, 'success' | 'info' | 'warning' | 'danger'> = {
  Created:  'success',
  Added:    'success',
  Changed:  'info',
  Fixed:    'warning',
  Breaking: 'danger',
}

const RELEASES: Release[] = [
  {
    version: '1.0.0',
    date: '2026-05-14',
    summary:
      'Evo UI is in active pre-release development. Everything built so far is rolled up here. Once we publish, this entry will be finalised and a new release will start above it.',
    sections: [
      {
        kind: 'Added',
        items: [
          'EvoButton redesign — added `iconLeft` / `iconRight` slots, a built-in `loading` state with `loadingText` and a CSS-only spinner, `fullWidth`, an orthogonal `shape` prop (`default` | `rounded` | `square`), a `soft` variant, ref forwarding, and pass-through of every native `<button>` attribute (form, name, autoFocus, aria-*, onMouseEnter, …).',
          'EvoButton now defaults `type` to `"button"` so dropping it inside a `<form>` no longer accidentally submits.',
          'EvoButton sizes use `min-height` (lg = 44px WCAG touch target) and `rem`-based padding, so buttons stay tappable and proportional on mobile without bespoke media queries.',
          '`shape="rounded"` replaces the previous `variant="rounded"` so radius is now orthogonal to the visual variant (rounded + ghost, rounded + danger, etc. all compose).',
          'Forms: EvoButton, EvoInput, EvoCheckbox, EvoRadio, EvoSelect, EvoTreeSelect, EvoToggle, EvoForm.',
          'EvoRichTextArea with pluggable toolbar, paste/drop/file image upload, and a typed imperative ref.',
          'Layout: EvoStack, EvoGrid, EvoContainer, EvoDivider.',
          'Navigation: EvoNav, EvoTopNav, EvoBreadcrumb, EvoTabs, EvoPagination, EvoCommandPalette.',
          'Data Display: EvoCard, EvoTable, EvoBadge, EvoSkeleton.',
          'Feedback: EvoAlert, EvoModal, EvoTooltip, EvoToast.',
          'Media: EvoImageCropper with circular / aspect-ratio crops and Blob / DataURL / Canvas export.',
          'Theming: light + dark CSS-variable tokens, EvoThemeProvider, EvoThemeToggle.',
          'Utilities: spacing, flex, grid, typography, and color helpers (see /utilities).',
          'Docs site at evo-docs: 28 component pages, Theming, Utilities, Changelog, and a Build-with-AI prompt.',
          'Shared docs CSS utilities — .docs-section-desc, .docs-list, .docs-next-steps, .docs-readout, .docs-kbd-list, .docs-util-label — so every page reads from the same theme tokens (no hard-coded slate hex anywhere).',
          'Sidebar follows "one row = one component"; sub-pages (Tools, Image Upload, API references) live under their parent and are reached via in-page Next Steps + a back pill at the top of every sub-page.',
        ],
      },
    ],
  },
]

export default function ChangelogPage() {
  return (
    <div>
      <div className="docs-page-header">
        <div className="docs-page-tag">Releases</div>
        <h1 className="docs-page-title">Changelog</h1>
        <p className="docs-page-desc">
          Tracks every change to <strong>@justin_evo/evo-ui</strong>. Evo UI is still
          in active pre-release development, so everything currently rolls up under
          a single in-progress v1.0.0 entry with a <strong>Created</strong> label.
        </p>
      </div>

      <div className="docs-section">
        <div className="docs-section-title">Release format</div>
        <p className="docs-page-desc">
          <strong>Right now (pre-launch):</strong> append every new piece of work to the{' '}
          <code>Created</code> section of the v1.0.0 entry — no new release blocks yet.
        </p>
        <EvoStack direction="row" gap="0.5rem" wrap>
          <EvoBadge severity="success" variant="subtle">Created</EvoBadge>
        </EvoStack>
        <p className="docs-page-desc" style={{ marginTop: '1.25rem' }}>
          <strong>After v1.0.0 publishes:</strong> finalise the entry, then prepend new
          versions above it using these four kinds. <code>Breaking</code> entries must
          also fill in <code>migration</code> with a short upgrade guide.
        </p>
        <EvoStack direction="row" gap="0.5rem" wrap>
          <EvoBadge severity="success" variant="subtle">Added</EvoBadge>
          <EvoBadge severity="info"    variant="subtle">Changed</EvoBadge>
          <EvoBadge severity="warning" variant="subtle">Fixed</EvoBadge>
          <EvoBadge severity="danger"  variant="subtle">Breaking</EvoBadge>
        </EvoStack>
      </div>

      <div className="docs-changelog">
        {RELEASES.map((release) => (
          <article key={release.version} className="docs-changelog-entry">
            <header className="docs-changelog-head">
              <h2 className="docs-changelog-version">v{release.version}</h2>
              <span className="docs-changelog-date">{release.date}</span>
            </header>
            {release.summary && (
              <p className="docs-changelog-summary">{release.summary}</p>
            )}
            {release.sections.map((section) => (
              <div key={section.kind} className="docs-changelog-section">
                <EvoBadge severity={SEVERITY[section.kind]} variant="subtle">
                  {section.kind}
                </EvoBadge>
                <ul className="docs-changelog-list">
                  {section.items.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
            {release.migration && (
              <div className="docs-changelog-migration">
                <strong>Migration:</strong> {release.migration}
              </div>
            )}
          </article>
        ))}
      </div>
    </div>
  )
}
