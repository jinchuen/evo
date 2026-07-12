# Task 1 Completion Report: Fix RichTextArea image caret

## Status
**DONE**

## Changes Made

### 1. RichTextArea.tsx — `insertImageAtCaret` function (lines 503–526)
Replaced the 7-line implementation with a 21-line version that:
- Inserts an `<img>` element followed by an empty `<p data-evo-caret><br></p>` paragraph
- Uses a marker element (`data-evo-caret`) to find and position the caret in the new paragraph
- Properly collapses the selection to the start of the new paragraph, ensuring the caret lands below the image
- Includes detailed comments explaining the fix (images are block-level; caret must land on a fresh line below)
- Maintains the same dependency array: `[emitChange]` (only references stable dependencies)

**File:** `D:\evo\evo-ui\src\RichTextArea\RichTextArea.tsx`

### 2. Skill documentation — Gotchas section
Added one new gotcha bullet point to `D:\evo\skills\evo-rich-text-area\SKILL.md` (line 261):
```md
- Inserting an image (button, drag-drop, paste, or the `insertImage` handle) drops the caret onto a fresh empty paragraph **below** the image, so typing continues on a new line rather than beside the block-level image.
```

**File:** `D:\evo\skills\evo-rich-text-area\SKILL.md`

## Build Verification

Ran `cd D:/evo/evo-ui; npm run build` via PowerShell.

**Result:** ✓ Build succeeded with no TypeScript errors

**Build output tail:**
```
✓ 61 modules transformed.
[vite:dts] Declaration files built in 2400ms.
../dist/evo-ui.css    189.44 kB │ gzip: 31.50 kB
../dist/index.cjs.js  143.42 kB │ gzip: 44.79 kB
✓ built in 3.45s
```

The dist/ folder was regenerated successfully with all required outputs: `index.es.js`, `index.cjs.js`, `index.d.ts`, and `evo-ui.css`.

## Commit

**Command used:**
```bash
git -C D:/evo add evo-ui/src/RichTextArea/RichTextArea.tsx skills/evo-rich-text-area/SKILL.md
git -C D:/evo commit -m "fix(RichTextArea): land caret on a new line below inserted images" -m "Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

**Commit SHA:** `7ded16c` (full: `7ded16c7bf952e0d81ed6693f364066aaecb2938`)
**Subject:** `fix(RichTextArea): land caret on a new line below inserted images`
**Files changed:** 2
- `evo-ui/src/RichTextArea/RichTextArea.tsx` (+23 / -3)
- `skills/evo-rich-text-area/SKILL.md` (+1 / 0)

Only the two specified files were staged and committed. No `.superpowers/` or `dist/` artifacts were included.

## Self-Review Checklist

- [x] Edit matches the brief exactly (verbatim code replacement)
- [x] Dependency array is `[emitChange]` as required
- [x] No other parts of the file changed
- [x] Build succeeds with no TypeScript errors
- [x] Commit uses the exact message from the brief
- [x] Only the two required files were staged (no `git add -A`)
- [x] Skill documentation updated with new gotcha line
- [x] Commit SHA confirmed and shows correct author co-authorship

## Implementation Notes

The fix works by leveraging the same marker idiom used in `unwrapBlocks` (lines 236–289):
1. Insert both the image and a trailing paragraph with a marker attribute
2. Query the DOM to find the marker element
3. Create a Range positioned at the start of the marker's container
4. Place the caret there and remove the marker attribute
5. Call `emitChange` to update the editor state

This ensures the caret always lands on a fresh empty line below block-level images, so user typing continues on a new line rather than beside the image's top-right corner.

## Concerns
None. The implementation follows the exact brief specification, the build passes, and the dependency array is correct.
