import { useState } from 'react'
import { EvoRichTextArea, EvoDivider } from '@justin_evo/evo-ui'
import { CodeBlock } from '../components/CodeBlock'

export default function RichTextAreaPage() {
  const [value, setValue] = useState('<p>Try editing me — <strong>bold</strong>, <em>italic</em>, or paste an image.</p>')

  return (
    <div>
      <div className="docs-page-header">
        <div className="docs-page-tag">Component</div>
        <h1 className="docs-page-title">EvoRichTextArea</h1>
        <p className="docs-page-desc">
          A pluggable, dependency-free rich text editor. Pick the tools you need —
          bold, headings, lists, links, images — and ship a tiny editor instead of
          a 200&nbsp;KB framework. Image upload (paste, drop, file picker) is built in.
        </p>
        <div className="docs-import-line">
          import {'{ '}<span>EvoRichTextArea</span>{' }'} from '@justin_evo/evo-ui'
        </div>
      </div>

      <div className="docs-section">
        <div className="docs-section-title">Why RichTextArea</div>
        <p className="docs-section-desc">
          Most editors force you into one of two corners — a heavyweight framework
          (TipTap, CKEditor) or a barebones <code>contentEditable</code> with no
          UX polish. EvoRichTextArea sits between them.
        </p>
        <ul className="docs-list">
          <li><strong>Pluggable.</strong> Pass an array of tool keys; only those buttons render.</li>
          <li><strong>Image-first.</strong> Drag, drop, paste, or click — all work out of the box.</li>
          <li><strong>Zero dependencies.</strong> Pure DOM + Selection API. No bundle bloat.</li>
          <li><strong>Theme-aware.</strong> Reads the same <code>--evo-color-*</code> tokens as every other component.</li>
          <li><strong>Mobile-ready.</strong> Toolbar wraps; tap targets grow on touch screens.</li>
        </ul>
      </div>

      <EvoDivider />

      <div className="docs-section">
        <div className="docs-section-title">Basic</div>
        <div className="docs-preview col">
          <EvoRichTextArea
            label="Notes"
            placeholder="Write something…"
            value={value}
            onChange={setValue}
            fullWidth
          />
        </div>
        <CodeBlock code={`const [value, setValue] = useState('')

<EvoRichTextArea
  label="Notes"
  placeholder="Write something…"
  value={value}
  onChange={setValue}
  fullWidth
/>`} />
      </div>

      <div className="docs-section">
        <div className="docs-section-title">Uncontrolled</div>
        <div className="docs-preview col">
          <EvoRichTextArea
            defaultValue="<p>Starts with content but the parent doesn't track it.</p>"
            fullWidth
          />
        </div>
        <CodeBlock code={`<EvoRichTextArea
  defaultValue="<p>Starts with content…</p>"
  fullWidth
/>`} />
      </div>

      <div className="docs-section">
        <div className="docs-section-title">Helper text & errors</div>
        <div className="docs-preview col">
          <EvoRichTextArea
            label="Description"
            helperText="Markdown-like shortcuts will be added in a future release."
            fullWidth
          />
          <EvoRichTextArea
            label="Bio"
            error="Bio is required."
            fullWidth
          />
        </div>
        <CodeBlock code={`<EvoRichTextArea
  label="Description"
  helperText="Markdown-like shortcuts will be added soon."
/>

<EvoRichTextArea label="Bio" error="Bio is required." />`} />
      </div>

      <div className="docs-section">
        <div className="docs-section-title">Sizing</div>
        <p className="docs-section-desc">
          Use <code>minHeight</code> and <code>maxHeight</code> to control the editor's
          vertical bounds. When content exceeds <code>maxHeight</code>, the editor
          scrolls and the toolbar stays sticky at the top.
        </p>
        <div className="docs-preview col">
          <EvoRichTextArea
            label="Compact"
            minHeight={80}
            maxHeight={160}
            fullWidth
          />
        </div>
        <CodeBlock code={`<EvoRichTextArea minHeight={80} maxHeight={160} fullWidth />`} />
      </div>

      <div className="docs-section">
        <div className="docs-section-title">Read-only & disabled</div>
        <div className="docs-preview col">
          <EvoRichTextArea
            label="Read-only"
            readOnly
            defaultValue="<p>You can <strong>see</strong> this but can't edit.</p>"
            fullWidth
          />
          <EvoRichTextArea
            label="Disabled"
            disabled
            defaultValue="<p>Disabled — no interaction at all.</p>"
            fullWidth
          />
        </div>
        <CodeBlock code={`<EvoRichTextArea readOnly defaultValue="…" />
<EvoRichTextArea disabled defaultValue="…" />`} />
      </div>

      <EvoDivider />

      <div className="docs-section">
        <div className="docs-section-title">Next steps</div>
        <ul className="docs-next-steps">
          <li><a href="/components/rich-text-area/tools">Tools &amp; customization →</a> Pick which buttons appear, add your own.</li>
          <li><a href="/components/rich-text-area/images">Image upload →</a> Paste, drop, or wire a custom uploader.</li>
          <li><a href="/components/rich-text-area/api">API reference →</a> All props and the imperative ref handle.</li>
        </ul>
      </div>
    </div>
  )
}
