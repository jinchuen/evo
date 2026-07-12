# SDD Progress — Viewport-Aware Positioning (evo-ui 1.3.0)

Spec:  docs/superpowers/specs/2026-07-11-viewport-aware-positioning-design.md
Plan:  docs/superpowers/plans/2026-07-11-viewport-aware-positioning.md
Branch: feat/viewport-aware-positioning
Base commit: 56f6e04 (docs: spec + plan)
Issues: #10 (dropdown flip bug), #11 (EvoBadge detail popover)

## Environment notes
- Use the PowerShell tool for git/npm — the Bash tool has no git/coreutils on PATH.
- evo-docs/node_modules/@justin_evo/evo-ui is a junction → D:\evo\evo-ui; rebuild evo-ui
  (`npm run build`) after any evo-ui/src edit so docs see it.
- No unit-test runner: per-task verification = `cd evo-ui && npm run build` (tsc + SCSS).
  Manual browser smoke = human step at the end.

## Tasks
- [x] Task 1: useAnchoredPosition hook (evo-ui/src/hooks/)
- [x] Task 2: Retrofit EvoSelect (portal + hook + click-outside + SCSS)
- [x] Task 3: Retrofit EvoAutoComplete + EvoTreeSelect
- [x] Task 4: EvoBadge `detail` popover (#11)
- [x] Task 5: Retrofit EvoTooltip
- [x] Task 6: Docs + skills + changelog + version bump 1.3.0 + rebuild

## Ledger
(append: `Task N: complete (commits <base7>..<head7>, review clean)`)
Task 1: complete (commits 56f6e04..1d4e9a3, review clean — spec ✅). Fixed 1 Important (matchAnchorWidth used stale natural width in clamp/arrow → now uses anchor width) + 1 Minor (skip no-op reposition re-renders). Accepted 1 Minor by-design: capture-phase scroll listener fires for any scroll (zero-dep trade-off, commented).
Task 2: complete (commits 1d4e9a3..385a68e, review clean — spec ✅, quality Approved). 2 Minor noted (not fixed): (a) `.selectWrapper` comment "positioning context for menu" now stale — clean up in final polish; (b) z-index 10000 ties notification/toast layer — accepted per spec (above modal 9999; toast tie resolved by DOM order).
Task 3: complete (commits 385a68e..521ed26, review clean — AutoComplete ✅ + TreeSelect ✅, quality Approved). No copy-paste cross-contamination (AC anchors inputWrapper, TS reuses triggerRef; keyframe names file-scoped). Reviewer's @keyframes-collision flag = confirmed non-issue (CSS Modules localizes keyframes per file; pre-existing dup already worked, build green). Minor cosmetic: click-outside explanatory comment not carried to AC/TS.
Task 4: complete (commits 521ed26..09da48e, review clean AFTER fixes). Fixed 1 Critical (EvoBadge.Group was invisible to TS — inline cast didn't retype the binding, .d.ts omitted Group, would break docs typecheck; restructured to Card.tsx declaration-site cast → .d.ts now exposes Group, verified) + 1 Important (remove-button click bubbled into new badge onClick → added stopPropagation) + 2 Minor (reset open when detail removed; dropped stray export default). 1 Important (sub-44px touch target) → USER DECISION: document the exception (hover/focus-first supplementary disclosure); note added into Task 6 docs+skill, no code change. Design skill (design-taste-frontend) applied: $shadow-lg token + prefers-reduced-motion guard on popover entrance.
Task 5: complete (commits 09da48e..28bbaa5, review clean — spec ✅, quality Approved). Arrow mapping correct all 4 sides; data-placement uses resolved (post-flip) side; dead .top/.bottom positioning CSS removed; prefers-reduced-motion guard present; no public API change. Design skill applied: reduced-motion guard on tooltip entrance. Minor (not fixed): `.wrapper{position:relative}` now vestigial (harmless).
Task 6: complete (commits 28bbaa5..2f47f6d, review clean — spec ✅, Approved, zero findings). 12 files: docs pages (Badge props+example+44px note, Select/AC/TS/Tooltip behavior notes), 5 skills (evo-badge props+REPLACED false ref note+3 gotchas incl. 44px; 4 others +1 gotcha), Changelog 1.3.0 (Added/Fixed/Changed), package.json 1.2.1→1.3.0. Reviewer verified: no surviving "does NOT forward ref" contradiction; no inline styles/hex; Select/TS skills correctly still say no-ref (only Badge gained forwardRef). ComponentPreviews untouched (justified).

ALL 6 TASKS COMPLETE.
Final whole-branch review (a95f029..2f47f6d, opus): Ready to merge = YES. No Critical/Important. Integration checks all pass (shared hook consistent across 4 consumers; z-index 10000 uniform above modal; click-outside fix in all 3 selects; EvoBadge.Group exposed in .d.ts; non-breaking).
Polish: commit ed9394f applied 1 risk-free Minor (reduced-motion guard on Select+TreeSelect menu entrance → all 5 floating layers now consistent), build green.
Final HEAD: ed9394f. Accepted Minors (not fixed, all harmless): stale .selectWrapper comment; vestigial .wrapper position:relative; click-outside comment parity; capture-scroll breadth (zero-dep trade-off); dead arrow data-placement attr; eslint-deps comment parity; sub-44px badge (user-accepted, documented).
SHIPPED (user-authorized): skill enhanced (evo-badge detail example + when-to-use + a11y note, commit 19755b1) → merged to main (ff a95f029..19755b1) → pushed origin/main → published @justin_evo/evo-ui@1.3.0 to npm (registry latest=1.3.0 confirmed). npm token used transiently + deleted from config (no .npmrc persists it). Issues #10 + #11 closed with release notes.
Token SECURITY: the npm token was pasted in plaintext in chat → advise user to REVOKE/ROTATE it.
Still pending (not requested / user's call): manual browser smoke-test; optional evo-docs dep bump ^1.2.0→^1.3.0 + Railway redeploy; CLAUDE.md §13.1 "latest version" line now stale (1.2.0→1.3.0).
</content>
