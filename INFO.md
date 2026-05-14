# Evo UI — Contributor Guide

This file is the source of truth for **how to update and extend the Evo UI
component library**. Read it before opening a PR. The docs site
(`evo-docs/`) and the library (`evo-ui/`) are tightly coupled — a change in
one almost always requires a change in the other.

```
evo/
├── evo-ui/        ← the published package (@justin_evo/evo-ui)
│   └── src/<Component>/<Component>.tsx
├── evo-docs/      ← the documentation site
│   └── src/pages/<Component>Page.tsx
└── INFO.md        ← you are here
```

---

## 1. Updating an existing UI component

Follow this checklist **every time** you change anything in
`evo-ui/src/<Component>/`. The Changelog step is the most often forgotten —
treat it as part of the change, not as an afterthought.

### Checklist

- [ ] **Locate the component.** `evo-ui/src/<Component>/<Component>.tsx`.
- [ ] **Make the code change.** Keep the public API as stable as possible.
      If you must rename or remove a prop, treat it as a *breaking* change
      (see step 6).
- [ ] **Update the component's types & exports.** If you added a new prop or
      a new sub-component (e.g. `EvoCard.Footer`), make sure it's exported
      from the barrel at `evo-ui/src/<Component>/<Component>.tsx` and that
      `evo-ui/src/index.ts` still picks it up via `export *`.
- [ ] **Rebuild the package.** From `evo-ui/`, run the build so `dist/` is
      fresh — the docs app consumes the file: dependency, so an unbuilt
      change won't appear in the docs.
- [ ] **Update the docs page.** Edit `evo-docs/src/pages/<Component>Page.tsx`:
      - Add the new prop to the `PropsTable`.
      - Add or update at least one preview that exercises the new behaviour.
      - **Style rules:** use `.docs-section-desc` for paragraph descriptions and
        `.docs-list` for bulleted explanations — never inline
        `style={{ color: 'var(--docs-text-muted)', ... }}`. Use theme tokens
        (`var(--docs-text)`, `var(--docs-text-muted)`, `var(--docs-code-bg)`,
        `var(--docs-accent)`) — **never hard-coded hex** like `#94a3b8` /
        `#e2e8f0` / `#1e293b`. These break light mode.
      - If the prop is destructive (e.g. removes default styling), add a
        warning callout next to the example.
- [ ] **Update the Overview preview if relevant.** If the visible shape of
      the component changed, also update
      `evo-docs/src/components/ComponentPreviews.tsx` so the homepage tile
      still looks right.
- [ ] **Add a Changelog entry.** Edit
      `evo-docs/src/pages/ChangelogPage.tsx` and prepend a new entry to
      `RELEASES` (see [Changelog format](#3-changelog-format-must-follow)).
- [ ] **Bump the version.** In `evo-ui/package.json`, follow semver:
      - `patch` (1.0.0 → 1.0.1) — bug fix, no API change.
      - `minor` (1.0.0 → 1.1.0) — new prop / new component / additive.
      - `major` (1.0.0 → 2.0.0) — anything in the **Breaking** section.
- [ ] **Smoke-test.** Run the docs site (`evo-docs/`, `npm run dev`) and
      click through the affected component page **and** the Overview tile.
      Toggle dark mode; theme tokens are easy to miss.

### Common mistakes to avoid

- Editing the component but forgetting the docs page → users (and AI tools
  fetching the docs page) think the new prop doesn't exist.
- Skipping the Changelog → consumers can't tell why an upgrade broke them.
- Hard-coding a colour instead of a theme token (`var(--evo-color-…)`) →
  silently breaks dark mode.
- Renaming a prop without a Breaking entry + migration note → consumers
  hit a runtime regression with no upgrade path.

---

## 2. Adding a new UI component

Adding a component is the same workflow as updating, plus a few extra steps
to register it everywhere it needs to be visible.

### Checklist

- [ ] **Create the source folder.** `evo-ui/src/<Component>/<Component>.tsx`.
      Match the conventions of an existing similarly-shaped component (e.g.
      `Button/` for a leaf, `Card/` if you have sub-components).
- [ ] **Use the `Evo` prefix.** The default export must be named
      `Evo<Component>` and use named exports — consumers import everything
      from `@justin_evo/evo-ui`, never from deep paths.
- [ ] **Use theme tokens.** Style with `var(--evo-color-…)` and the spacing
      utilities from `evo-ui/src/css/utilities/`. Avoid raw hex values.
- [ ] **Export from the barrel.** Add `export * from './<Component>/<Component>';`
      to `evo-ui/src/index.ts`, in the correct category section.
- [ ] **Rebuild the package** in `evo-ui/`.
- [ ] **Create the docs page.** `evo-docs/src/pages/<Component>Page.tsx`.
      Copy the structure of the most similar existing page. Required
      sections:
      1. `docs-page-header` with tag / title / one-line description.
      2. At least one `<CodeBlock>` example.
      3. A `<PropsTable>` listing **every** prop, default, and required flag.
      4. A "Variants" section if the component has them.
- [ ] **Register the route.** Edit `evo-docs/src/App.tsx`:
      ```tsx
      import <Component>Page from './pages/<Component>Page'
      // …
      <Route path="/components/<kebab-name>" element={<<Component>Page />} />
      ```
- [ ] **Add it to the sidebar.** Edit `evo-docs/src/components/Layout.tsx`
      and put it in the right group (Forms / Layout / Navigation / …).
- [ ] **Add it to the Overview homepage.** Edit
      `evo-docs/src/pages/HomePage.tsx` (`groups` array) and
      `evo-docs/src/components/ComponentPreviews.tsx` (a small live preview).
- [ ] **Add it to the AI catalogue.** Edit
      `evo-docs/src/pages/AIPromptPage.tsx` and append the new component to
      the right group in `CATALOGUE`. **This is the file the AI prompt
      reads** — if you skip it, AI tools won't know the component exists.
- [ ] **Add a Changelog entry** with an `Added` section.
- [ ] **Bump the minor version** in `evo-ui/package.json` (new component is
      additive, not breaking).
- [ ] **Smoke-test the whole flow:** docs page renders, homepage tile
      renders, sidebar link navigates, AI page lists the new entry.

---

## 3. Changelog format (must follow)

Every release entry lives in `evo-docs/src/pages/ChangelogPage.tsx`. Prepend
new entries to the top of the `RELEASES` array.

### Pre-launch (current state)

Evo UI hasn't published its first release yet. **Do not create new release
blocks.** Append every piece of work to the `items` array inside the
existing v1.0.0 entry's `Created` section. Update the entry's `date` field
to today whenever you add an item. This keeps the audit trail honest while
the library is still moving fast.

### After v1.0.0 ships

Once the library publishes, finalise the v1.0.0 entry and switch to the
four-kind format. Prepend a new dated release block above v1.0.0 for each
version. Use these four section kinds, in this order, and **only** these —
the badges and styling are keyed off them:

| Kind       | When to use it                                                 |
| ---------- | -------------------------------------------------------------- |
| `Added`    | New components, new props, new variants — additive only.       |
| `Changed`  | Non-breaking behaviour or appearance changes.                  |
| `Fixed`    | Bug fixes.                                                     |
| `Breaking` | Renames, removals, default-value changes that can break users. |

If you have a `Breaking` section, you **must** also set the `migration`
field on the release with a short step-by-step upgrade note. Without it the
entry is incomplete — reviewers should block the PR.

### Template

```ts
{
  version: '1.2.0',
  date: '2026-06-15',           // YYYY-MM-DD, the day you publish
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

## 4. Reserved area — future versions

The docs already has a dedicated route for version updates: **`/changelog`**.
You do not need to design a new page each release — just append a release
entry as described above and it will render in the existing timeline UI.

If a release is large enough to warrant its own write-up (migration guide,
a "what's new in v2" walkthrough), add it as a new page under
`evo-docs/src/pages/whats-new/v<version>.tsx` and link to it from the
release entry's `migration` field. This keeps the standard Changelog clean
while leaving room for richer narratives when needed.

---

## 5. For AI tooling

The `/ai` page (`evo-docs/src/pages/AIPromptPage.tsx`) ships a prompt that
teaches AI coding tools how to use Evo UI without hallucinating props. It
intentionally contains **only component names and doc URLs**, not full
prop tables. When you add a new component, the only AI-side step is
adding it to the `CATALOGUE` constant — the prompt body itself does not
need to change.
