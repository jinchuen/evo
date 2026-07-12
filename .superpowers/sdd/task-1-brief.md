# Task 1: Fix RichTextArea image caret

**Files:**
- Modify: `evo-ui/src/RichTextArea/RichTextArea.tsx` (`insertImageAtCaret`, ~lines 503-509)
- Modify: `skills/evo-rich-text-area/SKILL.md` (add one gotcha line)
- Build: `evo-ui` (`npm run build`)

**Interfaces:**
- Consumes: existing `editorRef`, `execCommand`, `emitChange`.
- Produces: no signature change — `insertImageAtCaret(src: string, alt?: string) => void` stays identical to callers (button pick, drag, paste, imperative `insertImage`).

## Step 1: Replace `insertImageAtCaret`

Replace the current body (RichTextArea.tsx, the `// ---- Insert image (used by paste, drop, button) ----` block, currently lines 503-509) with EXACTLY:

```tsx
  // ---- Insert image (used by paste, drop, button) ----
  const insertImageAtCaret = useCallback((src: string, alt = '') => {
    const el = editorRef.current;
    if (!el) return;
    el.focus();
    const safeSrc = src.replace(/"/g, '&quot;');
    const safeAlt = alt.replace(/"/g, '&quot;');
    // Images render display:block; inserting a bare <img> leaves the caret
    // beside it, which paints at the image's top-right edge. Drop a trailing
    // empty paragraph and move the caret into it, so the user lands on a clean
    // new line *below* the image. (Marker idiom matches unwrapBlocks above.)
    execCommand('insertHTML', `<img src="${safeSrc}" alt="${safeAlt}" /><p data-evo-caret><br></p>`);
    const landing = el.querySelector<HTMLParagraphElement>('p[data-evo-caret]');
    if (landing) {
      landing.removeAttribute('data-evo-caret');
      const sel = window.getSelection();
      const r = document.createRange();
      r.setStart(landing, 0);
      r.collapse(true);
      sel?.removeAllRanges();
      sel?.addRange(r);
    }
    emitChange();
  }, [emitChange]);
```

Note: keep the `useCallback` dependency array as `[emitChange]` (the new code only references `emitChange`, `editorRef`, `execCommand` — all stable/module-scope). Do not change any other part of the file.

## Step 2: Add a gotcha line to the RichTextArea skill

In `skills/evo-rich-text-area/SKILL.md`, find the "## Gotchas" section (a bulleted list) and add this as a new bullet (place it sensibly among the existing bullets):

```md
- Inserting an image (button, drag-drop, paste, or the `insertImage` handle) drops the caret onto a fresh empty paragraph **below** the image, so typing continues on a new line rather than beside the block-level image.
```

## Step 3: Rebuild the library

Run (PowerShell tool): `cd D:/evo/evo-ui; npm run build`
Expected: build completes; `dist/` regenerated with no TypeScript errors. Capture the tail of the output as evidence.

## Step 4: Commit

```
git -C D:/evo add evo-ui/src/RichTextArea/RichTextArea.tsx skills/evo-rich-text-area/SKILL.md
git -C D:/evo commit -m "fix(RichTextArea): land caret on a new line below inserted images" -m "Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```
(Do NOT `git add -A` — stage only the two files above. Do not commit anything under `.superpowers/` or `dist/`.)
