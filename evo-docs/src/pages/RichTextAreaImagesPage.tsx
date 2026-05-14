import { useState } from 'react'
import { EvoRichTextArea, EvoDivider, EvoAlert } from '@justin_evo/evo-ui'
import { CodeBlock } from '../components/CodeBlock'
import { SubPageBack } from '../components/SubPageBack'

export default function RichTextAreaImagesPage() {
  const [lastError, setLastError] = useState<string | null>(null)

  // Demo "uploader" — real apps would POST to S3 / their backend.
  const fakeUpload = (file: File) =>
    new Promise<string>((resolve) => {
      const reader = new FileReader()
      reader.onload = () => setTimeout(() => resolve(String(reader.result)), 600)
      reader.readAsDataURL(file)
    })

  return (
    <div>
      <SubPageBack to="/components/rich-text-area" label="Rich Text Area" />
      <div className="docs-page-header">
        <div className="docs-page-tag">Component · Rich Text Area</div>
        <h1 className="docs-page-title">Image upload</h1>
        <p className="docs-page-desc">
          Three input methods, one pipeline. Click the image button, paste from
          the clipboard, or drag a file onto the editor — everything routes through
          the same handler.
        </p>
      </div>

      <div className="docs-section">
        <div className="docs-section-title">The three ways to add an image</div>
        <ul className="docs-list">
          <li><strong>Click the image button</strong> in the toolbar — opens the OS file picker.</li>
          <li><strong>Paste</strong> from the clipboard — works for screenshots and copied images.</li>
          <li><strong>Drag &amp; drop</strong> a file onto the editor — a highlighted overlay appears.</li>
        </ul>
        <p className="docs-section-desc" style={{ marginTop: '0.75rem', marginBottom: 0 }}>
          Without an <code>onImageUpload</code> handler, images are embedded as
          base64 data URLs. Great for prototypes; for production you'll want to
          upload to a real host.
        </p>
      </div>

      <div className="docs-section">
        <div className="docs-section-title">Default (base64 embed)</div>
        <div className="docs-preview col">
          <EvoRichTextArea
            tools={['image']}
            placeholder="Paste a screenshot or drag an image here."
            fullWidth
          />
        </div>
        <CodeBlock code={`<EvoRichTextArea tools={['image']} />`} />
      </div>

      <EvoDivider />

      <div className="docs-section">
        <div className="docs-section-title">Custom uploader</div>
        <p className="docs-section-desc">
          Provide <code>onImageUpload</code> and return the final URL. The editor
          waits for your promise before inserting.
        </p>
        <div className="docs-preview col">
          <EvoRichTextArea
            tools={['bold', 'italic', 'divider', 'image']}
            onImageUpload={fakeUpload}
            placeholder="Try dropping an image — the demo uploader simulates a 600ms round trip."
            fullWidth
          />
        </div>
        <CodeBlock code={`async function uploadImage(file: File): Promise<string> {
  const form = new FormData()
  form.append('file', file)
  const res = await fetch('/api/uploads', { method: 'POST', body: form })
  const { url } = await res.json()
  return url
}

<EvoRichTextArea
  tools={['bold', 'italic', 'divider', 'image']}
  onImageUpload={uploadImage}
/>`} />
      </div>

      <div className="docs-section">
        <div className="docs-section-title">Validation</div>
        <p className="docs-section-desc">
          Restrict allowed types and file size. Rejected files trigger
          <code> onImageError</code> so you can surface a toast or inline message.
        </p>
        <div className="docs-preview col">
          {lastError && (
            <EvoAlert type="error">{lastError}</EvoAlert>
          )}
          <EvoRichTextArea
            tools={['image']}
            acceptedImageTypes={['image/png', 'image/jpeg']}
            maxImageSize={500 * 1024}
            onImageError={(err) => setLastError(err.message)}
            placeholder="Only PNG / JPEG, max 500 KB."
            fullWidth
          />
        </div>
        <CodeBlock code={`<EvoRichTextArea
  tools={['image']}
  acceptedImageTypes={['image/png', 'image/jpeg']}
  maxImageSize={500 * 1024}            // 500 KB
  onImageError={(err) => toast.error(err.message)}
/>`} />
      </div>

      <EvoDivider />

      <div className="docs-section">
        <div className="docs-section-title">Image-related props</div>
        <p className="docs-section-desc">
          See the <a href="/components/rich-text-area/api">API reference</a> for the
          complete list. The image-relevant ones are:
        </p>
        <ul className="docs-list">
          <li><code>onImageUpload?: (file: File) =&gt; Promise&lt;string&gt;</code></li>
          <li><code>acceptedImageTypes?: string[]</code> — defaults to png / jpeg / gif / webp / svg</li>
          <li><code>maxImageSize?: number</code> — bytes</li>
          <li><code>onImageError?: (err) =&gt; void</code> — <code>code</code> is <code>'too-large' | 'wrong-type' | 'upload-failed'</code></li>
        </ul>
      </div>
    </div>
  )
}
