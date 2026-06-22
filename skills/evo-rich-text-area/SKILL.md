---
name: evo-rich-text-area
description: Use when you need an in-app WYSIWYG rich text editor — formatting toolbar (bold, italic, headings, lists, links), inline image upload via paste/drop/file picker, controlled or uncontrolled HTML, custom toolbar tools, or an imperative editor handle; covers EvoRichTextArea and its EvoRichTextHandle ref API.
---

# EvoRichTextArea — Evo UI

> Evo UI component skill. Master index: [[evo-ui]].

## Overview

EvoRichTextArea is a pluggable, dependency-free WYSIWYG rich text editor built on a `contentEditable` surface and the browser Selection/execCommand APIs. Its core design principle is "pick only the tools you need" — the toolbar is driven entirely by a single `tools` array, and image upload (paste, drag-drop, file picker) is built in with zero external dependencies.

## Import

```tsx
import { EvoRichTextArea } from '@justin_evo/evo-ui';
import type { EvoRichTextHandle, EvoRichTextTool, EvoRichTextCustomTool, EvoRichTextBuiltInTool } from '@justin_evo/evo-ui';
// One-time, app-wide stylesheet import (includes theme tokens):
// import '@justin_evo/evo-ui/dist/evo-ui.css';
```

## When to use

- A user needs to author formatted prose: bold/italic/underline, headings, lists, blockquotes, code blocks, links.
- You want inline image embedding via paste, drag-and-drop, or a file picker — with optional upload-to-server hook.
- You want a lightweight editor instead of a heavyweight framework (TipTap/CKEditor).
- You need controlled HTML (React state) or uncontrolled (defaultValue) editing.
- You need to drive the editor imperatively (custom toolbars, slash menus, programmatic insertion) via a ref handle.

## When NOT to use

- You only need plain, unformatted multi-line text — use a native `<textarea>` or [[evo-input]] instead.
- You require collaborative editing, schema validation, or Markdown source round-tripping (not provided; output is HTML).
- You need a single-line text field — use [[evo-input]].

## Quick start

```tsx
import { useState } from 'react';
import { EvoRichTextArea } from '@justin_evo/evo-ui';

function NotesField() {
  const [html, setHtml] = useState('<p>Try editing me — <strong>bold</strong> or <em>italic</em>.</p>');
  return (
    <EvoRichTextArea
      label="Notes"
      placeholder="Write something…"
      value={html}
      onChange={setHtml}
      fullWidth
    />
  );
}
```

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `value` | `string` | — | No | Controlled HTML value. Pair with `onChange` to drive the editor from React state. |
| `defaultValue` | `string` | — | No | Initial HTML for uncontrolled use. Ignored when `value` is set. |
| `onChange` | `(html: string) => void` | — | No | Fires whenever the content changes. Receives the editor's current HTML. |
| `tools` | `EvoRichTextTool[]` | `['bold', 'italic', 'underline', 'divider', 'h1', 'h2', 'divider', 'ul', 'ol', 'divider', 'link', 'image']` | No | Which tools to render in the toolbar. Pass `[]` for no toolbar. |
| `placeholder` | `string` | `'Start writing…'` | No | Placeholder shown when the editor is empty. |
| `minHeight` | `number \| string` | `160` | No | Minimum editor height (CSS). Numbers are treated as pixels. |
| `maxHeight` | `number \| string` | — | No | Maximum editor height before it scrolls (CSS). Toolbar stays sticky at the top. Numbers are treated as pixels. |
| `disabled` | `boolean` | `false` | No | Disables editing; greys out the editor and blocks all interaction. |
| `readOnly` | `boolean` | `false` | No | Read-only — same look as editable, but no editing. |
| `label` | `string` | — | No | Optional label rendered above the editor (associated to the editable surface via `htmlFor`). |
| `helperText` | `string` | — | No | Helper text rendered below. Hidden when `error` is set. |
| `error` | `string` | — | No | Error message — also marks the field invalid (`aria-invalid`) for assistive tech. |
| `fullWidth` | `boolean` | `false` | No | Stretches the editor to fill its container width. |
| `onImageUpload` | `(file: File) => Promise<string>` | — | No | Custom upload handler. Resolve with the URL to embed. Without it, images embed as base64 data URLs. |
| `acceptedImageTypes` | `string[]` | `['image/png', 'image/jpeg', 'image/gif', 'image/webp', 'image/svg+xml']` | No | Accepted image MIME types for the file picker and validation. |
| `maxImageSize` | `number` | — | No | Maximum image size in bytes. Larger images are rejected and trigger `onImageError`. |
| `onImageError` | `(error: { code: 'too-large' \| 'wrong-type' \| 'upload-failed'; message: string }) => void` | — | No | Fires when an image fails validation or upload. |
| `className` | `string` | `''` | No | Optional class name applied to the root wrapper element. |
| `id` | `string` | — | No | Optional id forwarded to the editable surface (for label association). |

The component does NOT spread arbitrary native attributes onto the root. The forwarded `ref` is typed as `EvoRichTextHandle` (an imperative handle), NOT a DOM element ref — see the Sub-components section below. `className` is applied to the root wrapper, and `id` is forwarded to the inner editable surface.

## Sub-components

EvoRichTextArea exposes no compound parts, but it exposes a rich imperative **ref handle** (`EvoRichTextHandle`) and supporting types.

### Ref handle — `EvoRichTextHandle`

Attach a ref typed as `EvoRichTextHandle` to drive the editor from outside (custom toolbars, slash menus, programmatic insertion). The same handle object is passed to custom-tool `onAction` callbacks.

| Method | Signature | Description |
| --- | --- | --- |
| `getHTML` | `() => string` | Returns the editor's current HTML. |
| `setHTML` | `(html: string) => void` | Replaces the editor content with the given HTML (emits change). |
| `getText` | `() => string` | Returns the editor's plain text content (no markup). |
| `focus` | `() => void` | Focuses the editor. |
| `insertImage` | `(src: string, alt?: string) => void` | Inserts an image at the caret. `alt` defaults to `''`. |
| `insertHTML` | `(html: string) => void` | Inserts arbitrary HTML at the caret. |
| `clear` | `() => void` | Clears all content (emits change). |

### Custom tool — `EvoRichTextCustomTool`

Pass an object (instead of a built-in string key) in the `tools` array to add a custom toolbar button.

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `key` | `string` | Yes | Unique React key / identifier for the tool. |
| `label` | `string` | Yes | Accessible label (used for `title`, `aria-label`). |
| `icon` | `React.ReactNode` | Yes | Icon node rendered inside the button. |
| `onAction` | `(api: EvoRichTextHandle) => void` | Yes | Invoked on click; receives the editor handle so you can read or insert content. |
| `isActive` | `() => boolean` | No | Returns whether the tool is currently active (drives `aria-pressed` and active styling). |

### Type aliases

- `EvoRichTextBuiltInTool` — union of all built-in tool string keys (see Variants & options).
- `EvoRichTextTool` — `EvoRichTextBuiltInTool | EvoRichTextCustomTool`.

## Variants & options

The `tools` array accepts these built-in string keys (`EvoRichTextBuiltInTool`):

**Text marks (inline):**
- `'bold'` — Bold text. Shortcut: ⌘B / Ctrl+B.
- `'italic'` — Italic text. Shortcut: ⌘I / Ctrl+I.
- `'underline'` — Underlined text. Shortcut: ⌘U / Ctrl+U.
- `'strike'` — Strikethrough text.

**Block formats (toggle on/off):**
- `'h1'` — Convert current block to Heading 1. Click again to toggle back to paragraph.
- `'h2'` — Convert current block to Heading 2. Toggleable.
- `'h3'` — Convert current block to Heading 3. Toggleable.
- `'paragraph'` — Convert current block to a paragraph; also clears a blockquote, code block, or heading.
- `'ul'` — Bulleted (unordered) list. Toggleable.
- `'ol'` — Numbered (ordered) list. Toggleable.
- `'quote'` — Blockquote. Enter exits to a plain paragraph (Shift+Enter for a line within); click again to toggle the current line back to a paragraph.
- `'code'` — Code block (`<pre>`). Enter exits to a plain paragraph (Shift+Enter for a line break inside); click again to toggle back.
- `'align-left'` — Align text left.
- `'align-center'` — Align text center.
- `'align-right'` — Align text right.

**Inline tools:**
- `'link'` — Opens an inline URL prompt and wraps the selection in `<a>` (new links open in a new tab by default).
- `'image'` — Opens the file picker. Paste & drop are always enabled regardless of this key.

**History & utility:**
- `'undo'` — Browser-native undo. Shortcut: ⌘Z / Ctrl+Z.
- `'redo'` — Browser-native redo. Shortcut: ⇧⌘Z / Ctrl+Y.
- `'clear'` — Removes all formatting from the selection.

**Visual:**
- `'divider'` — A vertical separator in the toolbar (no action; can be repeated for grouping).

You may also pass `EvoRichTextCustomTool` objects anywhere in the array (see Sub-components).

## Examples

### Custom toolbar via `tools` (kitchen sink) and an empty toolbar

```tsx
import { EvoRichTextArea } from '@justin_evo/evo-ui';

// Full set, grouped with dividers:
<EvoRichTextArea
  fullWidth
  tools={[
    'undo', 'redo', 'divider',
    'paragraph', 'h1', 'h2', 'h3', 'divider',
    'bold', 'italic', 'underline', 'strike', 'divider',
    'ul', 'ol', 'quote', 'code', 'divider',
    'align-left', 'align-center', 'align-right', 'divider',
    'link', 'image', 'divider',
    'clear',
  ]}
/>

// No toolbar — keyboard shortcuts (⌘B, ⌘I, ⌘U) still work:
<EvoRichTextArea tools={[]} placeholder="No toolbar." fullWidth />
```

### Image upload with a custom uploader and validation

```tsx
import { EvoRichTextArea } from '@justin_evo/evo-ui';

async function uploadImage(file: File): Promise<string> {
  const form = new FormData();
  form.append('file', file);
  const res = await fetch('/api/uploads', { method: 'POST', body: form });
  const { url } = await res.json();
  return url;
}

<EvoRichTextArea
  fullWidth
  tools={['bold', 'italic', 'divider', 'image']}
  onImageUpload={uploadImage}
  acceptedImageTypes={['image/png', 'image/jpeg']}
  maxImageSize={500 * 1024} // 500 KB
  onImageError={(err) => console.error(err.code, err.message)}
  placeholder="Paste, drop, or click to add a PNG/JPEG under 500 KB."
/>
```

### Imperative ref handle + a custom tool

```tsx
import { useRef } from 'react';
import { EvoRichTextArea, EvoButton, EvoStack } from '@justin_evo/evo-ui';
import type { EvoRichTextHandle } from '@justin_evo/evo-ui';

function Editor() {
  const ref = useRef<EvoRichTextHandle | null>(null);
  return (
    <EvoStack direction="column" gap="0.5rem">
      <EvoRichTextArea
        ref={ref}
        fullWidth
        tools={[
          'bold', 'italic', 'divider',
          {
            key: 'timestamp',
            label: 'Insert timestamp',
            icon: <span style={{ fontSize: 11, fontWeight: 700 }}>⏱</span>,
            onAction: (api) => api.insertHTML(`<span>${new Date().toLocaleString()}</span>&nbsp;`),
          },
        ]}
      />
      <EvoStack direction="row" gap="0.5rem" wrap>
        <EvoButton size="sm" label="Insert HTML" onClick={() => ref.current?.insertHTML('<strong>Hi!</strong> ')} />
        <EvoButton size="sm" variant="outline" label="Get text" onClick={() => alert(ref.current?.getText())} />
        <EvoButton size="sm" variant="ghost" label="Clear" onClick={() => ref.current?.clear()} />
      </EvoStack>
    </EvoStack>
  );
}
```

### Read-only, disabled, and error states

```tsx
<EvoRichTextArea readOnly defaultValue="<p>You can <strong>see</strong> this but can't edit.</p>" fullWidth />
<EvoRichTextArea disabled defaultValue="<p>Disabled — no interaction.</p>" fullWidth />
<EvoRichTextArea label="Bio" error="Bio is required." helperText="(hidden while error shows)" fullWidth />
```

## Accessibility

- The editable surface is a `<div>` with `role="textbox"` and `aria-multiline="true"`.
- It carries `aria-label` (the `label` prop, or `'Rich text editor'` when no label), `aria-invalid` (true when `error` is set), `aria-readonly` (mirrors `readOnly`), and `aria-disabled` (mirrors `disabled`).
- When `label` is provided, it renders a `<label htmlFor>` associated with the editable surface (id derived from `id` or the slugified label).
- The toolbar wrapper has `role="toolbar"` and `aria-label="Formatting toolbar"`. Dividers are `aria-hidden`.
- Every toolbar button is a real `<button type="button">` (never auto-submits), with `title`, `aria-label`, and `aria-pressed` (reflecting active state) where applicable; toolbar buttons are disabled when `disabled` or `readOnly`.
- Keyboard shortcuts inside the editor: ⌘/Ctrl+B (bold), ⌘/Ctrl+I (italic), ⌘/Ctrl+U (underline); ⌘/Ctrl+Z and ⇧⌘Z/Ctrl+Y for browser-native undo/redo.
- Enter inside a code block (`<pre>`) or blockquote exits to a fresh plain paragraph rather than extending the block; Shift+Enter inserts a soft line break within the block.
- The link prompt is a `role="dialog"` with `aria-label="Insert link"`; its input handles Enter (apply) and Escape (cancel).
- The drag-and-drop overlay ("Drop image to upload") is `aria-hidden`.

## Gotchas

- The forwarded `ref` is an `EvoRichTextHandle` imperative object, NOT a DOM element ref. Type your ref as `useRef<EvoRichTextHandle | null>(null)`.
- Inserting an image (button, drag-drop, paste, or the `insertImage` handle) drops the caret onto a fresh empty paragraph **below** the image, so typing continues on a new line rather than beside the block-level image.
- Value is HTML, not Markdown. `onChange` emits the raw `innerHTML`; `getText()` returns plain text. Sanitize on the server before persisting/rendering untrusted HTML.
- Controlled mode: when `value` is set, also provide `onChange`, or edits won't persist. External `value` changes are synced into the DOM only when they differ from the last emitted HTML (to avoid caret jumps during typing).
- Paste & drop image insertion is ALWAYS enabled, even if `'image'` is not in `tools` — the `'image'` key only adds the file-picker button. Pasted plain text is inserted as plain text (foreign styles stripped).
- Without `onImageUpload`, images embed as base64 data URLs — fine for prototypes, but bloats stored HTML; wire `onImageUpload` for production.
- Block tools (`h1`/`h2`/`h3`/`quote`/`code`) are toggles: clicking the active tool reverts the block to a plain paragraph.
- Toolbar buttons default to `type="button"`, so they never accidentally submit a surrounding `<form>`.
- Theme via Evo CSS tokens (`var(--evo-color-*)`, `var(--evo-spacing-*)`, `var(--evo-radius-*)`) — never hard-code hex colors; the editor reads the same `--evo-color-*` tokens as every other component and supports light/dark mode.
- Import the stylesheet `@justin_evo/evo-ui/dist/evo-ui.css` exactly once, app-wide.
- Named imports only from `@justin_evo/evo-ui` — never deep import paths.

## Related

- [[evo-input]]
- [[evo-form]]
- [[evo-image-cropper]]
- [[evo-button]]
- [[evo-theming]]
- [[evo-ui]]
