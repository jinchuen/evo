# Evo UI — Source of Truth for All Contributors

This file is the contract between **humans, AI coding agents, and the Evo UI
codebase**. Read it before opening a PR, starting a session, or writing a
single line of code. The docs site (`evo-docs/`) and the library (`evo-ui/`)
are tightly coupled — a change in one almost always requires a change in
the other.

> **For AI agents (Claude Code, Cursor, Windsurf, etc.):** Before doing
> anything else, read this entire file. Then, in your first response to the
> user, quote one specific rule from section 9 ("Common mistakes") to prove
> you've read it. If you cannot, stop and re-read.

```
evo/
├── evo-ui/        ← the published package (@justin_evo/evo-ui)
│   └── src/<Component>/<Component>.tsx
├── evo-docs/      ← the documentation site
│   └── src/pages/<Component>Page.tsx
└── CLAUDE.md      ← you are here
```

---

## 0. Design philosophy (read this before anything else)

These are the principles that *every* decision in this codebase descends
from. When in doubt, return here.

### 0.1 API design

- **Orthogonality.** Props are independent axes. `variant` × `severity` ×
  `shape` × `size` should all compose freely. Never bundle two concerns
  into one prop (no `variant="rounded-danger"`).
- **Naming consistency across components.** Open/close state is always
  `open` (never `visible` / `show`). Variants are always `variant` (never
  `type` / `kind`). Sizes are always `'sm' | 'md' | 'lg'`. Change handlers
  are always `onChange` for values, `onXxxChange` for derived state.
- **Composition over configuration.** Prefer `<Form.Field><Form.Label /></Form.Field>`
  over `<Form fields={[{label: '...'}]} />`. Sub-components > prop arrays.
- **Native attributes pass through.** Every component forwards `ref`,
  `className`, and `...rest` to its root element. Never swallow standard
  HTML attributes.
- **`type="button"` always.** Buttons inside `<form>` must not submit by
  accident. The library defaults this for you; do not break it.

### 0.2 Styling

- **CSS variables, not CSS-in-JS.** All theming flows through
  `--evo-color-*`, `--evo-spacing-*`, `--evo-radius-*`. Never write inline
  hex values (`#94a3b8`, `#e2e8f0`, `#1e293b` are common AI defaults — all
  forbidden, they break light mode).
- **Mobile-ready by default.** Every interactive element ≥44px touch
  target on mobile. Use `min-height` with `rem`, not media-query overrides.
- **Dark mode is not an afterthought.** Every visual element must be
  verified in both modes before merge. The cheap mental test: "If the
  background were near-black, would every element still be readable and
  every focus state still visible?"
- **Zero runtime style cost when possible.** Styles are static CSS modules
  scoped per component. No runtime style generation.

### 0.3 AI-readiness

- **Docs are the contract, not the code.** AI tools fetch the docs page,
  not the source. If a prop exists in code but not in docs, **it does not
  exist** to AI consumers.
- **Every public component has a docs page with a complete Props table.**
- **The AI catalogue (`AIPromptPage.tsx`) is the index of truth.** It must
  list every component. If you add a component and forget the catalogue,
  AI tools will hallucinate around its absence.

---

## 1. Updating an existing UI component

Follow this checklist **every time** you change anything in
`evo-ui/src/<Component>/`. The Changelog and AI catalogue steps are the
most often forgotten — treat them as part of the change, not afterthoughts.

### Checklist

- [ ] **Locate the component.** `evo-ui/src/<Component>/<Component>.tsx`.
- [ ] **Read the most similar existing component first.** This is how you
      stay consistent. For form inputs read `Input/Input.tsx` and
      `Checkbox/Checkbox.tsx`. For overlays read `Modal/Modal.tsx`.
- [ ] **Make the code change.** Keep the public API as stable as possible.
      If you must rename or remove a prop, treat it as a *breaking* change
      (see section 4).
- [ ] **Update the component's types & exports.** New prop or new
      sub-component (e.g. `EvoCard.Footer`)? Make sure it's exported from
      `evo-ui/src/<Component>/<Component>.tsx` and that
      `evo-ui/src/index.ts` still picks it up via `export *`.
- [ ] **Rebuild the package.** From `evo-ui/`, run the build so `dist/` is
      fresh — the docs app consumes the `file:` dependency, so an unbuilt
      change won't appear in the docs.
- [ ] **Update the docs page.** Edit `evo-docs/src/pages/<Component>Page.tsx`:
    - Add the new prop to the `PropsTable`.
    - Add or update at least one preview that exercises the new behaviour.
    - **Style rules:** use `.docs-section-desc` for paragraph descriptions
      and `.docs-list` for bulleted explanations — never inline
      `style={{ color: 'var(--docs-text-muted)' }}`. Use theme tokens
      (`var(--docs-text)`, `var(--docs-text-muted)`, `var(--docs-code-bg)`,
      `var(--docs-accent)`). **Never hard-coded hex** like `#94a3b8` /
      `#e2e8f0` / `#1e293b`. These break light mode.
    - If the prop is destructive (e.g. removes default styling), add a
      warning callout next to the example.
- [ ] **Update the Overview preview if relevant.** If the visible shape of
      the component changed, also update
      `evo-docs/src/components/ComponentPreviews.tsx`.
- [ ] **Update the agent skill.** If you added/renamed/removed a prop, variant,
      or sub-component, mirror it in `skills/evo-<kebab-name>/SKILL.md` (props
      table, examples, gotchas). The skill is a published contract just like the
      docs page — a stale skill makes AI consumers hallucinate.
- [ ] **Add a Changelog entry.** Edit `evo-docs/src/pages/ChangelogPage.tsx`
      and prepend a new entry to `RELEASES` (see section 4).
- [ ] **Bump the version.** In `evo-ui/package.json`, follow semver:
    - `patch` (1.0.0 → 1.0.1) — bug fix, no API change.
    - `minor` (1.0.0 → 1.1.0) — new prop / new component / additive.
    - `major` (1.0.0 → 2.0.0) — anything in the **Breaking** section.
- [ ] **Bump the plugin manifest too — whenever this change touched a
      `skills/` file.** The skills ship as a Claude Code plugin that consumers
      cache **by version**, so bump `"version"` in **both**
      `.claude-plugin/plugin.json` and `.claude-plugin/marketplace.json` to the
      same number as `evo-ui/package.json`. Skip it and every existing install
      keeps loading the stale skill (see section 13.3).
- [ ] **Smoke-test.** Run `cd evo-docs && npm run dev`, then verify:
    1. The component's docs page loads without console errors.
    2. All code examples render their live preview correctly.
    3. The Overview homepage tile still looks right.
    4. **Toggle dark mode** — every text element must remain readable,
       every focus state must remain visible.
    5. **Resize to 375px width (iPhone SE)** — nothing overflows, no
       horizontal scroll, touch targets stay ≥44px.
    6. **If the component is interactive** — try it inside an `EvoModal`.
       Cross-component issues (z-index, focus trap, scroll lock) hide
       here.

---

## 2. Adding a new UI component

The workflow above plus extra steps to register it everywhere.

### Before you start: research

Before writing a new component, read the equivalent component in **at
least one** of these libraries (look at the API, not the visuals):

- **Radix UI Primitives** — for compose-based API patterns
- **Mantine** — for prop completeness and edge cases
- **shadcn/ui** — for minimal, copy-paste-friendly structure
- **Ark UI** — for state machine modelling of complex components

Then ask: "What did they get right? What did they get wrong? Which trade-off
do we want?" Document the decision in a comment at the top of the component
file.

### Checklist

- [ ] **Create the source folder.** `evo-ui/src/<Component>/<Component>.tsx`.
      Match the conventions of an existing similarly-shaped component.
- [ ] **Use the `Evo` prefix.** Default export named `Evo<Component>`. Use
      named exports — consumers import from `@justin_evo/evo-ui`, never
      from deep paths.
- [ ] **Use theme tokens.** Style with `var(--evo-color-…)` and spacing
      utilities from `evo-ui/src/css/utilities/`. Zero raw hex values.
- [ ] **Forward ref + spread rest.** All components must follow this shape:

    ```tsx
    const EvoFoo = forwardRef<HTMLDivElement, EvoFooProps>(
      ({ className, ...rest }, ref) => (
        <div ref={ref} className={cn(styles.root, className)} {...rest} />
      )
    )
    EvoFoo.displayName = 'EvoFoo'
    ```

- [ ] **Export from the barrel.** Add to `evo-ui/src/index.ts` in the right
      category section.
- [ ] **Rebuild the package** in `evo-ui/`.
- [ ] **Create the docs page.** `evo-docs/src/pages/<Component>Page.tsx`.
      Copy the structure of the most similar existing page. Required:
    1. `docs-page-header` with tag / title / one-line description.
    2. A "Why <Component>" section if the component is non-obvious.
    3. At least one `<CodeBlock>` example per major variant.
    4. A `<PropsTable>` listing **every** prop, default, and required flag.
    5. A "Variants" section if applicable.
    6. An "Accessibility" section listing keyboard interactions and
       ARIA attributes.
    7. If the component is complex (>5 sections), split into sub-pages
       and link via a "Next steps" section. See `RichTextAreaPage` for
       the canonical example.
- [ ] **Register the route.** Edit `evo-docs/src/App.tsx`:

    ```tsx
    import <Component>Page from './pages/<Component>Page'
    <Route path="/components/<kebab-name>" element={<<Component>Page />} />
    ```

- [ ] **Add to the sidebar.** Edit `evo-docs/src/components/Layout.tsx`,
      right category group.
- [ ] **Add to the Overview homepage.** Edit
      `evo-docs/src/pages/HomePage.tsx` (`groups` array) and
      `evo-docs/src/components/ComponentPreviews.tsx` (small live preview).
- [ ] **Add to the AI catalogue.** Edit
      `evo-docs/src/pages/AIPromptPage.tsx` and append to the right group
      in `CATALOGUE`. **This is the file the AI prompt reads** — skip it
      and AI tools won't know the component exists.
- [ ] **Add an agent skill.** Create `skills/evo-<kebab-name>/SKILL.md`
      (copy the structure of an existing skill — props table, variants,
      sub-components, accessibility, examples, gotchas) and add a row to the
      catalogue in `skills/evo-ui/SKILL.md`. This is the installable plugin
      consumers use; a missing skill makes agents hallucinate the component.
- [ ] **Add a Changelog entry** with an `Added` section.
- [ ] **Bump the minor version** in `evo-ui/package.json`.
- [ ] **Bump the plugin manifest** to the same version in **both**
      `.claude-plugin/plugin.json` and `.claude-plugin/marketplace.json` — a new
      component always adds a `skills/evo-<name>/SKILL.md`, so this is never
      optional (see section 13.3).
- [ ] **Run the full smoke-test from section 1.**

---

## 3. Redesigning / replacing an existing component

This is the workflow when the user asks you to "rebuild" or "redesign" a
component (not a small change — a structural rewrite).

### Before you touch any code

1. **Read the current implementation in full.** Both
   `evo-ui/src/<Component>/<Component>.tsx` and its SCSS module.
2. **Read the current docs page** to understand the documented public API.
3. **Read 2-3 existing similarly-complex components** for style reference
   (e.g. for Form, look at how Modal and RichTextArea are structured).
4. **List the breaking changes.** Output to the user a bullet list of:
    - Props being removed
    - Props being renamed
    - Behaviour changes
    - **STOP and wait for confirmation before writing code.**
5. **Propose the new API in a code block first.** A TypeScript interface
   showing the new public surface. User approves → you write code.

### During implementation

- Keep the SCSS module path stable (`<Component>.module.scss`) so imports
  don't break consumers who somehow reference it.
- Maintain semantic HTML — `<form>` for forms, `<label>` for labels, etc.
- Implement keyboard interactions before visual polish.
- Verify dark mode and mobile (375px) before claiming "done".

### After implementation

- Mark the change as **Breaking** in the Changelog, with a `migration` note.
- Bump the **major** version.

---

## 4. Changelog format (must follow)

Every release entry lives in `evo-docs/src/pages/ChangelogPage.tsx`.
Prepend new entries to the top of the `RELEASES` array.

### Launched (current state)

Evo UI is **live**: published to npm as `@justin_evo/evo-ui` (currently
**1.2.0** — see section 13 for the publish workflow) and the docs are
deployed to Railway. The old pre-launch rule ("append everything to
one v1.0.0 `Created` block") is **retired** — use the four-kind format below
for every new release.

> Cleanup still pending: the existing v1.0.0 `Created` block in
> `ChangelogPage.tsx` should be finalised into proper `Added` sections (and
> the real published versions recorded) the next time someone touches the
> changelog.

### Release format (four kinds)

Prepend a new dated release block to the top of the `RELEASES` array for each
version. Use these four section kinds in this order, **and only these**:

| Kind       | When to use it                                                 |
| ---------- | -------------------------------------------------------------- |
| `Added`    | New components, new props, new variants — additive only.       |
| `Changed`  | Non-breaking behaviour or appearance changes.                  |
| `Fixed`    | Bug fixes.                                                     |
| `Breaking` | Renames, removals, default-value changes that can break users. |

If you have a `Breaking` section, you **must** also set the `migration`
field with a short step-by-step upgrade note. Without it the entry is
incomplete — block the PR.

### Template

```ts
{
  version: '1.2.0',
  date: '2026-06-15',
  summary: 'One-line summary of the release.',
  sections: [
    { kind: 'Added',   items: ['EvoDatePicker component.'] },
    { kind: 'Changed', items: ['EvoButton hover transition is now 120ms.'] },
    { kind: 'Fixed',   items: ['EvoSelect dropdown clipping inside modals.'] },
    // { kind: 'Breaking', items: ['Renamed EvoCard `padding` → `pad`.'] },
  ],
  // migration: 'Search/replace `padding=` with `pad=` on EvoCard usages.',
}
```

---

## 5. When in doubt — decision rules

### "Should I add a new prop or a new component?"

- New prop → it *modifies* an existing thing (e.g. `loading` on Button).
- New component → it has *fundamentally different semantics*
  (e.g. `ToggleButton` vs `Button`).
- Test: "Would a user ever want both at the same time?" Yes → new component.

### "Is this Changed or Breaking?"

- **Changed** → existing code keeps working identically.
- **Breaking** → any existing code using the public API may now behave
  differently or fail to compile.
- Adding an optional prop with a sensible default → `Changed`.
- Changing the default value of an existing prop → `Breaking` (defaults
  are public API).
- Renaming a prop, even if you keep the old one as an alias → `Breaking`
  (the alias is debt and must come off in the next major).

### "Should I create a new file or extend an existing one?"

- New file → if the new thing has its own props, state, or sub-components.
- Extend → if it's a tiny variant (a new `variant` value, a new size).

### "What if a rule above conflicts with what the user asked?"

**Surface the conflict explicitly. Never silently violate the rule.**

Example: "You asked me to use `#94a3b8` for muted text. The contributor
guide forbids hex values (section 0.2). Two options: (a) add a new
semantic token `--evo-color-text-quiet` to `tokens.css` and use that,
(b) override the rule for this one case and accept the dark-mode debt.
Which do you want?"

---

## 6. Files to read before doing anything

| If you're about to…             | Read first                                                                                                                            |
| ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| Update a component              | The component file, its docs page, and one similar component for style                                                                |
| Add a new component             | `Button/Button.tsx` (simple canonical), `Card/Card.tsx` (with sub-components), `src/index.ts`, `ButtonPage.tsx`, `AIPromptPage.tsx`   |
| Redesign a component            | The current implementation + 2-3 similarly-complex components for reference                                                           |
| Touch theming                   | `evo-ui/src/css/tokens.css`, `ThemeProvider/ThemeProvider.tsx`                                                                        |
| Touch the docs site shell       | `evo-docs/src/components/Layout.tsx`, `evo-docs/src/styles/`                                                                          |
| Write a Form-related component  | `Input/Input.tsx`, `Checkbox/Checkbox.tsx`, `Form/Form.tsx`, current `FormPage.tsx`                                                   |
| Release the skills plugin       | `.claude-plugin/plugin.json`, `.claude-plugin/marketplace.json`, and section 13.3                                                     |

---

## 7. Forbidden actions (require explicit user confirmation)

These actions are **blocked** unless the user explicitly approves in the
same conversation. If the user's request requires one of these, **surface
it before doing anything**.

- ❌ Deleting a component or removing a prop (breaking change)
- ❌ Renaming a public export
- ❌ Adding a new runtime dependency to `evo-ui/package.json`
  (zero-deps policy)
- ❌ Editing `evo-ui/src/css/tokens.css` (token changes affect every
  component)
- ❌ Editing any shared file under `evo-docs/src/styles/`
- ❌ Running `npm publish` or `git push` to main
- ❌ Modifying files outside `evo-ui/`, `evo-docs/`, or the skills plugin
  (`skills/`, `.claude-plugin/`) — e.g. workspace config, CI files. Updating a
  component's skill and bumping the plugin manifest on release (sections 1, 2,
  13.3) are expected release work, not forbidden.

Format for surfacing:

> "Your request requires deleting the `EvoBadge.type` prop. This is a
> breaking change (section 4). Confirm before proceeding?"

---

## 8. After you finish — output a structured summary

End every task with this summary so the user (and the next AI session) can
verify the work without re-reading every diff.

### Summary template

```
**Changed files:**
- evo-ui/src/Form/Form.tsx (rewrote with compose-based API)
- evo-ui/src/css/form.module.scss (new token-driven styles)
- evo-docs/src/pages/FormPage.tsx (rewrote with new examples)
- evo-docs/src/pages/ChangelogPage.tsx (added entry)
- evo-ui/package.json (1.0.0 → 1.0.0, still pre-launch)

**Change type:** Breaking (Form API restructured)

**Checklist coverage:**
- [x] Component code
- [x] Types & exports
- [x] Rebuild
- [x] Docs page
- [x] Overview preview (no change needed)
- [x] AI catalogue (no new component, just structural)
- [x] Changelog (Created entry updated for pre-launch)
- [x] Version bump (pre-launch, no bump)
- [ ] Smoke-test → please run manually: cd evo-docs && npm run dev,
      then verify FormPage in light + dark mode + 375px width.

**Files I did NOT touch but you should review:**
- evo-docs/src/pages/AIPromptPage.tsx — Form is already in the catalogue.
- Other components — none depend on Form's internal structure.

**Known limitations of this change:**
- Async validation hook (onValidate) is not implemented yet. Tracked
  as a follow-up.
```

---

## 9. Common mistakes (the "you've read this if you can quote one" list)

AI agents: in your first response, quote one of these to confirm you've
read the file.

- ⚠ Editing the component but forgetting the docs page → AI tools fetching
  the docs page think the new prop doesn't exist.
- ⚠ Skipping the Changelog → consumers can't tell why an upgrade broke them.
- ⚠ Hard-coding a colour (`#94a3b8`, `#e2e8f0`, `#1e293b`) instead of a
  token → silently breaks dark mode.
- ⚠ Renaming a prop without a `Breaking` entry + migration note →
  consumers hit a runtime regression with no upgrade path.
- ⚠ Forgetting to add a new component to `AIPromptPage.tsx` catalogue →
  AI tools hallucinate around its absence.
- ⚠ Skipping `forwardRef` or `displayName` on a new component → breaks
  refs and DevTools labels.
- ⚠ Using `style={{ ... }}` inline in docs pages → breaks the shared
  `.docs-*` token system.
- ⚠ Hard-coding `'submit'` as the default for a button's `type` →
  accidental form submission. Default is always `'button'`.
- ⚠ Touch targets smaller than 44px on mobile → fails WCAG and feels
  cheap. Use `min-height` in `rem`.

---

## 10. Self-test before declaring "done"

Mentally run all of these. If any answer is "no" or "I'm not sure", go
back and fix it.

1. **"Could a fresh AI session understand what I did from the diff alone?"**
   If not, the Changelog entry needs more detail.
2. **"If I deleted the docs page, would the component still be
   discoverable?"** If not, you missed `Layout.tsx` / `HomePage.tsx` /
   `AIPromptPage.tsx`.
3. **"Does this work in dark mode?"** Hard-coded hex = automatic no.
4. **"Does this work at 375px width?"** Open DevTools, set iPhone SE,
   verify.
5. **"Does this work inside `EvoModal`?"** Z-index, focus trap, scroll
   lock — these issues only appear in composition.
6. **"Is every interactive element keyboard-reachable with a visible
   focus ring?"** Tab through it. If the focus ring is invisible, the
   component is not done.
7. **"In 6 months, will someone wonder why this exists?"** If yes, add a
   comment explaining the reasoning.

---

## 11. For AI tooling — the public catalogue

The `/ai` page (`evo-docs/src/pages/AIPromptPage.tsx`) ships a prompt that
teaches AI coding tools (consumers of Evo UI, not contributors to it) how
to use Evo UI without hallucinating. It intentionally contains **only
component names and doc URLs**, not full prop tables.

When you add a new component, the only AI-side step is adding it to the
`CATALOGUE` constant — the prompt body itself does not need to change.

**Note:** This section is about the prompt our library publishes for
*downstream* AI users. The file you're reading right now is the contract
for AI agents *working on* the library itself.

---

## 12. Reserved area — future versions

The docs already has a dedicated route for version updates: **`/changelog`**.
Just append a release entry as described in section 4.

If a release is large enough to warrant its own write-up (migration guide,
"what's new in v2" walkthrough), add it as a new page under
`evo-docs/src/pages/whats-new/v<version>.tsx` and link to it from the
release entry's `migration` field.

---

## 13. Publishing & deployment

This section documents **how Evo UI actually ships** — the library to npm and
the docs site to Railway. The npm pipeline was first wired up on 2026-06-22;
the docs hosting was migrated off Firebase Hosting onto Railway on 2026-06-25.

> ⚠️ Publishing to npm and deploying are **outward-facing and hard to
> reverse**. Per **section 7**, an AI agent must have the user's explicit
> approval in the same conversation before running `npm publish` or a deploy.
> This section is the *how*, not a standing permission to do it unprompted.

### 13.1 Publishing the library to npm

**Identity (not secret — safe to record here):**

- Package: **`@justin_evo/evo-ui`** — a **scoped** package.
- npm account: **`justin_evo`**, which owns the `@justin_evo` scope.
- Latest published version: **1.2.0**.

**Steps (run from `evo-ui/`):**

1. **Install deps & build** so `dist/` is fresh — the docs and consumers read
   `dist/`, not `src/`:

   ```bash
   cd evo-ui
   npm install
   npm run build
   ```

   Confirm `dist/` contains `index.es.js`, `index.cjs.js`, `index.d.ts`, and
   `evo-ui.css` — these are exactly what `main` / `module` / `types` / `style`
   in `package.json` point to.

2. **Bump the version** in `evo-ui/package.json` (semver — see section 1).
   ⚠️ **A version number can NEVER be reused.** Once
   `@justin_evo/evo-ui@X.Y.Z` has been published — *even if you later
   unpublish it* — npm permanently burns that number. (1.0.0 was published,
   then unpublished, and is dead forever — so the live line runs
   1.0.1 → 1.0.2 → 1.1.0 → **1.2.0**.) Every publish needs a new, higher version.

3. **Log in** (once per machine):

   ```bash
   npm login          # account: justin_evo
   ```

4. **Publish.** A scoped package's first publish (and every public publish)
   must be explicitly public, or npm tries to make it private:

   ```bash
   npm publish --access public
   ```

5. **Handle 2FA.** The account has 2FA enabled, so a publish needs **one** of:

   - A **one-time code** from the authenticator app:
     `npm publish --access public --otp=123456`, **or**
   - A **Granular Access Token with "Bypass two-factor authentication"
     checked** (npmjs.com → profile → **Access Tokens** → Generate New Token →
     **Granular**, permission **Read and write**, scope `@justin_evo`). Store
     it once and publishes need no code:

     ```bash
     npm config set //registry.npmjs.org/:_authToken=npm_XXXXXXXX
     ```

     Treat the token like a password: give it a **short expiry**, **never
     commit it**, and revoke it when done.

6. **Verify** it went live:

   ```bash
   npm view @justin_evo/evo-ui
   ```

**How downstream consumers use the published package** (keep this working):

```jsx
// npm install @justin_evo/evo-ui
import '@justin_evo/evo-ui/dist/evo-ui.css'   // styles + theme tokens — import once
import { EvoButton } from '@justin_evo/evo-ui'
```

`react` / `react-dom` are **peer** dependencies (≥17) — the consuming app
provides React. Evo UI stays **zero runtime deps** (section 7); do not add any.

### 13.2 Deploying the docs to Railway

The docs (`evo-docs/`) are a **static Vite SPA**. Railway has **no static
"hosting" product** like Firebase — it runs your app as a container — so the
build output in `dist/` is served by [`serve`](https://www.npmjs.com/package/serve),
a tiny static file server, on the `$PORT` Railway injects. (Migrated off
Firebase Hosting on 2026-06-25.)

**Identity (not secret):**

- Railway service: the `evo-docs/` directory, deployed as a **single service**
  (set the service's **Root Directory** to `evo-docs` in the Railway dashboard
  so it builds only the docs, not the whole monorepo).
- Live URL: **assigned by Railway on first deploy** — generate one under the
  service's **Settings → Networking → Public Networking** (a free
  `*.up.railway.app` domain, or attach a custom domain). Record the final URL
  here and in `README.md` once it exists.
- Deploy config lives in `evo-docs/`:
  - `railway.json` — pins the **Nixpacks** builder, `npm run build` as the
    build command, and `npm run start` as the start command.
  - `package.json` — `"start": "serve dist"` serves the built SPA; `serve` is a
    **runtime `dependency`** (not `devDependency`) so it survives Railway's
    production prune. `serve` auto-binds the `$PORT` env var Railway sets.
  - `public/serve.json` — Vite copies it to `dist/serve.json`, where `serve`
    reads it automatically. It reproduces the old `firebase.json` behaviour:
    a `**` → `/index.html` **rewrite** (so `BrowserRouter` deep links don't
    404) and a long **`Cache-Control: ...immutable`** header on `assets/**`.
    Note: `serve.json` rejects unknown keys — do **not** add a `$schema`
    field, it fails config validation.

**Steps:**

1. One-time setup: `npm install -g @railway/cli`, then `railway login`. In the
   Railway dashboard, create a project, add a service from this repo, and set
   its **Root Directory** to `evo-docs`.
2. Railway builds in the cloud — every push to the connected branch triggers a
   build (`npm run build`) and redeploy (`npm run start`) automatically. Unlike
   Firebase, there is **no local build-then-upload step**; you just push.
3. To deploy manually from your machine instead, run from `evo-docs/`:

   ```bash
   cd evo-docs
   railway up
   ```

   After a deploy, hard-refresh (Ctrl+Shift+R) to bypass the cached old bundle.

**Two gotchas baked into the config — do NOT undo them:**

- ⚠️ **The docs depend on the *published* package, not the local folder.**
  `evo-docs/package.json` uses `"@justin_evo/evo-ui": "^1.2.0"` (not
  `file:../evo-ui`) so the build is portable. After you publish a new evo-ui
  version, bump this range and run `npm install` in `evo-docs/` before
  deploying.
- ⚠️ **Single React copy.** `evo-docs/vite.config.ts` sets
  `resolve.dedupe: ['react', 'react-dom']`. evo-ui is symlinked to
  `../evo-ui` during local dev and carries its own nested `node_modules/react`;
  without dedupe the build bundles **two** Reacts and the live site crashes
  with `Cannot read properties of null (reading 'useState')` (an invalid hook
  call). Keep the dedupe.

### 13.3 Publishing the skills plugin

The `skills/` folder also ships as a **Claude Code plugin**, distributed
straight from this repo — there is no separate registry. Consumers install it
with:

```
/plugin marketplace add jinchuen/evo
/plugin install evo-ui@evo
```

Claude Code caches the plugin under a **version-keyed** directory
(`~/.claude/plugins/cache/evo/evo-ui/<version>/`), where `<version>` is the
`"version"` field of `.claude-plugin/plugin.json`.

**Release rules — do not skip:**

1. ⚠️ **Bump the manifest version in lockstep with the library.** Any release
   that touches `skills/` must set `"version"` in **both**
   `.claude-plugin/plugin.json` and the plugin entry of
   `.claude-plugin/marketplace.json` to the same number as
   `evo-ui/package.json`. That version is the **only** signal `/plugin` has that
   new content exists; leave it unchanged and every already-installed consumer
   keeps loading the **stale** skills no matter how often they update. (Exactly
   this happened from 1.0.0 → 1.4.0: the manifest sat at 1.0.0 while seven new
   components' skills piled up unseen.)

2. ⚠️ **Never force-push `main`.** A consumer's marketplace clone tracks
   `origin/main`; rewriting published history makes their clone
   non-fast-forwardable, so `/plugin marketplace update` can no longer pull and
   they are stranded on old skills. Ship releases as ordinary fast-forward
   merges. If you ever truly must rewrite published history, call it out in the
   release notes and tell consumers to recover with
   `/plugin marketplace remove evo` then `/plugin marketplace add jinchuen/evo`.

There is nothing to build or upload: pushing the version-bumped manifest to
`main` **is** the release. To pick it up, a consumer runs
`/plugin marketplace update evo`, reinstalls (`/plugin uninstall evo-ui@evo`
then `/plugin install evo-ui@evo`), and `/reload-plugins`.

### 13.4 Changelog cleanup still pending

Section 4 has been updated to the launched, four-kind format. The one
remaining task: the existing v1.0.0 `Created` block in
`evo-docs/src/pages/ChangelogPage.tsx` should be finalised into proper
`Added` sections, and the real published history recorded (1.0.0 was
published then unpublished → dead; **1.2.0** is the current live release), the next
time someone edits the changelog.