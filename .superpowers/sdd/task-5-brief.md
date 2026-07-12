# Task 5: Docs — TopNavPage demos + PropsTable

**Files:**
- Modify: `evo-docs/src/pages/TopNavPage.tsx`
- Build/typecheck: `evo-docs` (`npm run build`)

**Interfaces:**
- Consumes `EvoTopNav` with the new props/parts (`entrance`, `sticky`, `scrollBehavior`, `showProgress`, `EvoTopNav.Search`) from the already-rebuilt `evo-ui/dist`. Also uses `EvoBreadcrumb`, `EvoButton`, `CodeBlock`, `PropsTable` (all already in the docs).

Read `evo-docs/src/pages/TopNavPage.tsx` first to see its structure (sections use `.docs-section` / `.docs-section-title` / `.docs-section-desc` + `<CodeBlock>` + `<PropsTable>`). The existing sections in order are: Basic, Polymorphic Item, Dropdown, Mobile drawer, With Icons + Actions, then `<EvoDivider />`, Accessibility, Props.

## Step 1: Add the new demo sections

Insert these four sections AFTER the "With Icons + Actions" `docs-section` and BEFORE the `<EvoDivider />` that precedes Accessibility:

```tsx
      {/* --- Entrance animation --- */}
      <div className="docs-section">
        <div className="docs-section-title">Entrance animation</div>
        <p className="docs-section-desc">
          <code>entrance="rise"</code> staggers the brand, each menu item, and the
          actions up from below on mount (<code>"fade"</code> does opacity only).
          It plays once and is disabled entirely under{' '}
          <code>prefers-reduced-motion</code>. Opt-in — the default is{' '}
          <code>"none"</code>.
        </p>
        <div className="docs-preview col" style={{ width: '100%', padding: 0, overflow: 'hidden', borderRadius: 8 }}>
          <EvoTopNav aria-label="Entrance example" entrance="rise">
            <EvoTopNav.Brand>Evo UI</EvoTopNav.Brand>
            <EvoTopNav.Menu>
              <EvoTopNav.Item href="#home" active>Home</EvoTopNav.Item>
              <EvoTopNav.Item href="#docs">Docs</EvoTopNav.Item>
              <EvoTopNav.Item href="#blog">Blog</EvoTopNav.Item>
            </EvoTopNav.Menu>
            <EvoTopNav.Actions>
              <EvoButton label="Sign in" variant="ghost" size="sm" />
            </EvoTopNav.Actions>
          </EvoTopNav>
        </div>
        <CodeBlock code={`<EvoTopNav aria-label="Primary" entrance="rise">
  <EvoTopNav.Brand>Evo UI</EvoTopNav.Brand>
  <EvoTopNav.Menu>
    <EvoTopNav.Item href="/" active>Home</EvoTopNav.Item>
    <EvoTopNav.Item href="/docs">Docs</EvoTopNav.Item>
  </EvoTopNav.Menu>
</EvoTopNav>`} />
      </div>

      {/* --- Scroll behavior --- */}
      <div className="docs-section">
        <div className="docs-section-title">Sticky + scroll behavior</div>
        <p className="docs-section-desc">
          <code>sticky</code> pins the bar; <code>scrollBehavior</code> reacts to
          scroll — <code>"elevate"</code> adds a blurred background + shadow,{' '}
          <code>"shrink"</code> also reduces height, <code>"hide"</code> auto-hides
          on scroll-down and reveals on scroll-up. <code>showProgress</code> draws a
          thin reading-progress line along the bottom edge.
        </p>
        <CodeBlock code={`<EvoTopNav
  aria-label="Primary"
  sticky
  scrollBehavior="shrink"
  showProgress
>
  <EvoTopNav.Brand>Evo UI</EvoTopNav.Brand>
  <EvoTopNav.Menu>
    <EvoTopNav.Item href="/" active>Home</EvoTopNav.Item>
    <EvoTopNav.Item href="/docs">Docs</EvoTopNav.Item>
  </EvoTopNav.Menu>
</EvoTopNav>`} />
        <p className="docs-section-desc" style={{ marginTop: '0.5rem' }}>
          The docs site's own header uses this treatment — scroll this page to see
          it elevate.
        </p>
      </div>

      {/* --- Quick search (Cmd K) --- */}
      <div className="docs-section">
        <div className="docs-section-title">Quick search (⌘K)</div>
        <p className="docs-section-desc">
          <code>EvoTopNav.Search</code> is a presentational trigger: it renders the
          search affordance + a platform-aware keyboard hint and fires{' '}
          <code>onClick</code>. Wire it to an{' '}
          <code>EvoCommandPalette</code>. Pass <code>shortcut="mod+k"</code> to also
          register a global hotkey. It collapses to an icon-only button below the
          breakpoint.
        </p>
        <div className="docs-preview col" style={{ width: '100%', padding: 0, overflow: 'hidden', borderRadius: 8 }}>
          <EvoTopNav aria-label="Search example">
            <EvoTopNav.Brand>Evo UI</EvoTopNav.Brand>
            <EvoTopNav.Menu>
              <EvoTopNav.Item href="#home" active>Home</EvoTopNav.Item>
              <EvoTopNav.Item href="#docs">Docs</EvoTopNav.Item>
            </EvoTopNav.Menu>
            <EvoTopNav.Search placeholder="Search docs…" onClick={() => alert('open command palette')} />
            <EvoTopNav.Actions>
              <EvoButton label="Sign in" variant="ghost" size="sm" />
            </EvoTopNav.Actions>
          </EvoTopNav>
        </div>
        <CodeBlock code={`const [open, setOpen] = useState(false)

<EvoTopNav aria-label="Primary">
  <EvoTopNav.Brand>Evo UI</EvoTopNav.Brand>
  <EvoTopNav.Menu>
    <EvoTopNav.Item href="/" active>Home</EvoTopNav.Item>
  </EvoTopNav.Menu>
  <EvoTopNav.Search
    placeholder="Search docs…"
    shortcut="mod+k"
    onClick={() => setOpen(true)}
  />
</EvoTopNav>

<EvoCommandPalette open={open} onOpenChange={setOpen} /* … */ />`} />
      </div>

      {/* --- Links + breadcrumb composition --- */}
      <div className="docs-section">
        <div className="docs-section-title">Icon links + breadcrumb</div>
        <p className="docs-section-desc">
          Drop icon links into <code>EvoTopNav.Actions</code>, and compose{' '}
          <code>EvoBreadcrumb</code> inside the bar for a location trail — no extra
          parts needed.
        </p>
        <div className="docs-preview col" style={{ width: '100%', padding: 0, overflow: 'hidden', borderRadius: 8 }}>
          <EvoTopNav aria-label="Links example">
            <EvoTopNav.Brand>Evo UI</EvoTopNav.Brand>
            <EvoTopNav.Menu>
              <EvoTopNav.Item href="#docs" active>Docs</EvoTopNav.Item>
            </EvoTopNav.Menu>
            <EvoTopNav.Actions>
              <EvoBreadcrumb>
                <EvoBreadcrumb.Item>Components</EvoBreadcrumb.Item>
                <EvoBreadcrumb.Item current>TopNav</EvoBreadcrumb.Item>
              </EvoBreadcrumb>
            </EvoTopNav.Actions>
          </EvoTopNav>
        </div>
      </div>
```

IMPORTANT: Before using `<EvoBreadcrumb>` / `<EvoBreadcrumb.Item current>`, OPEN `evo-docs/src/components/ComponentPreviews.tsx` and look at how `EvoBreadcrumb` is actually used there (there is a `BreadcrumbPreview` using `<EvoBreadcrumb><EvoBreadcrumb.Item>…</EvoBreadcrumb.Item><EvoBreadcrumb.Item current>…</EvoBreadcrumb.Item></EvoBreadcrumb>`). Match that real API exactly. If the real API differs from the snippet above (e.g. `current` is not a valid prop, or items take `href`), ADAPT the breadcrumb demo to the real API rather than inventing props — the typecheck (`npm run build`) must pass. Report any adaptation you made.

## Step 2: Add the imports the new demos need

The current import line is:
```tsx
import { EvoTopNav, EvoButton, EvoBadge, EvoDivider } from '@justin_evo/evo-ui'
```
Add `EvoBreadcrumb`:
```tsx
import { EvoTopNav, EvoButton, EvoBadge, EvoDivider, EvoBreadcrumb } from '@justin_evo/evo-ui'
```
(`EvoCommandPalette` appears only inside a CodeBlock STRING, not as a live element — do NOT import it. `useState` is already imported at the top of the file.)

## Step 3: Add new props to the PropsTable

In the `<PropsTable props={[ ... ]} />` array, add these rows to the `EvoTopNav — *` group (after the `collapseBelow` row):

```tsx
          { prop: 'EvoTopNav — entrance', type: "'none' | 'rise' | 'fade'", description: 'Staggered mount animation for the bar contents. Disabled under prefers-reduced-motion.', default: "'none'" },
          { prop: 'EvoTopNav — sticky', type: 'boolean', description: 'Pin the bar with position: sticky; top: 0.', default: 'false' },
          { prop: 'EvoTopNav — scrollBehavior', type: "'none' | 'elevate' | 'shrink' | 'hide'", description: 'On-scroll treatment: elevate (blur+shadow), shrink (also reduces height), or hide (auto-hide on scroll-down).', default: "'none'" },
          { prop: 'EvoTopNav — showProgress', type: 'boolean', description: 'Render a thin scroll-progress accent line along the bottom edge.', default: 'false' },
```

And add a Search group after the `EvoTopNav.Toggle — *` rows:

```tsx
          { prop: 'EvoTopNav.Search — placeholder', type: 'string', description: 'Placeholder text shown inside the trigger.', default: "'Search…'" },
          { prop: 'EvoTopNav.Search — shortcut', type: 'string', description: "Opt-in global hotkey, e.g. 'mod+k' (mod = ⌘ on macOS, Ctrl elsewhere). Default: none." },
          { prop: 'EvoTopNav.Search — shortcutHint', type: 'ReactNode', description: 'Override the keyboard hint shown on the right.', default: 'platform-aware ⌘K / Ctrl K' },
          { prop: 'EvoTopNav.Search — onClick', type: '(e: MouseEvent) => void', description: 'Fires on click (and on the global hotkey, if set). Wire to your command palette.' },
```

## Step 4: Typecheck the docs

Run (PowerShell tool): `cd D:/evo/evo-docs; npm run build`
Expected: `tsc -b` passes (the new props/`Search`/`EvoBreadcrumb` resolve from the rebuilt `dist/index.d.ts`) and the Vite build completes. Capture the output tail. If the build fails on the breadcrumb API, adapt the demo to the real API (per Step 1) and rebuild.

## Step 5: Commit

```
git -C D:/evo add evo-docs/src/pages/TopNavPage.tsx
git -C D:/evo commit -m "docs(TopNav): demo entrance, scroll, Search and breadcrumb composition" -m "Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```
(Stage only this one file. Never `git add -A`. Do not commit `.superpowers/` or `dist/`.)

## Notes / constraints
- Docs style rule (CLAUDE.md): use `.docs-section-desc` / `.docs-list` and theme tokens; never hard-coded hex in docs. The inline `style` objects with `padding: 0, overflow, borderRadius` shown above match the existing sections in this file — keep them consistent with the file's existing previews.
- This is a docs-only change; the library is untouched. Verification is the docs typecheck/build (no library rebuild needed).
