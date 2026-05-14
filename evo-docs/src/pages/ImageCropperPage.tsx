import { useRef, useState } from 'react'
import {
  EvoImageCropper,
  EvoButton,
  EvoDivider,
  type EvoImageCropperHandle,
} from '@justin_evo/evo-ui'
import { CodeBlock } from '../components/CodeBlock'

// A small, safe demo image — Unsplash photo served via their CDN.
const DEMO_IMAGE =
  'https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=1200&q=80'

const AVATAR_IMAGE =
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=1000&q=80'

export default function ImageCropperPage() {
  const handleRef = useRef<EvoImageCropperHandle>(null)
  const avatarRef = useRef<EvoImageCropperHandle>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)

  const exportPng = async () => {
    const url = await handleRef.current?.getCroppedDataURL({ type: 'image/png' })
    if (url) setPreview(url)
  }

  const exportAvatar = async () => {
    const url = await avatarRef.current?.getCroppedDataURL({
      type: 'image/png',
      maxWidth: 256,
    })
    if (url) setAvatarPreview(url)
  }

  return (
    <div>
      <div className="docs-page-header">
        <div className="docs-page-tag">Component</div>
        <h1 className="docs-page-title">EvoImageCropper</h1>
        <p className="docs-page-desc">
          An interactive image cropper for the browser. Drag the rectangle, pinch to zoom,
          rotate in 90&deg; steps, then export the result as a Blob, data URL, or canvas —
          all without a single third-party dependency.
        </p>
        <div className="docs-import-line">
          import {'{ '}<span>EvoImageCropper</span>{' }'} from '@justin_evo/evo-ui'
        </div>
      </div>

      <div className="docs-section">
        <div className="docs-section-title">Is this the right component?</div>
        <p className="docs-section-desc">
          ImageCropper sits a little outside the usual UI primitives. Read this first so
          you ship the right thing.
        </p>
        <ul className="docs-list">
          <li>
            <strong>Use it when</strong> users need to crop, zoom, or rotate an image
            <em> before submitting it</em> — avatar uploads, banner photos, product thumbnails,
            ID document capture, post composers.
          </li>
          <li>
            <strong>Don't use it for</strong> displaying images (use a plain <code>&lt;img&gt;</code>),
            background editing, filters, painting, masking, or AI tooling — those are jobs for a
            full editor like Pintura or a server pipeline.
          </li>
          <li>
            <strong>It runs entirely on the client.</strong> The cropped output never leaves the
            browser unless you upload it yourself. Cross-origin images need the host to allow CORS
            or the canvas export will be tainted.
          </li>
          <li>
            <strong>Zero runtime dependencies.</strong> Pure pointer events + canvas. Adds ~6&nbsp;KB
            gzipped to your bundle.
          </li>
        </ul>
      </div>

      <EvoDivider />

      <div className="docs-section">
        <div className="docs-section-title">Basic usage</div>
        <p className="docs-section-desc">
          Pass <code>src</code>, listen for crop changes via <code>onChange</code>, and grab the
          result from the imperative <code>ref</code> when you're ready to upload.
        </p>
        <div className="docs-preview col">
          <EvoImageCropper
            ref={handleRef}
            src={DEMO_IMAGE}
            aspectRatio={16 / 9}
            height={360}
          />
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <EvoButton label="Export PNG" onClick={exportPng} />
            <EvoButton label="Reset" variant="outline" onClick={() => handleRef.current?.reset()} />
            <EvoButton label="Rotate" variant="ghost" onClick={() => handleRef.current?.rotate()} />
          </div>
          {preview && (
            <div style={{ marginTop: '0.5rem' }}>
              <div className="docs-section-desc" style={{ fontSize: 12 }}>
                Cropped output:
              </div>
              <img
                src={preview}
                alt="Cropped result"
                style={{ maxWidth: '100%', maxHeight: 200, borderRadius: 6, border: '1px solid var(--evo-color-border)' }}
              />
            </div>
          )}
        </div>
        <CodeBlock code={`import { useRef } from 'react'
import { EvoImageCropper, EvoButton, type EvoImageCropperHandle } from '@justin_evo/evo-ui'

function PhotoEditor() {
  const cropperRef = useRef<EvoImageCropperHandle>(null)

  const save = async () => {
    const blob = await cropperRef.current?.getCroppedBlob({ type: 'image/jpeg', quality: 0.9 })
    if (blob) {
      const form = new FormData()
      form.append('file', blob, 'cropped.jpg')
      await fetch('/api/upload', { method: 'POST', body: form })
    }
  }

  return (
    <>
      <EvoImageCropper
        ref={cropperRef}
        src="/uploads/raw.jpg"
        aspectRatio={16 / 9}
      />
      <EvoButton label="Save" onClick={save} />
    </>
  )
}`} />
      </div>

      <div className="docs-section">
        <div className="docs-section-title">Aspect ratios</div>
        <p className="docs-section-desc">
          Pass <code>aspectRatio</code> as a number (e.g. <code>16/9</code>, <code>1</code>,
          <code>4/3</code>) to lock the crop rectangle to a ratio. Omit the prop for free-form
          cropping. The default toolbar exposes a preset chip row so users can switch ratios
          on the fly — pass <code>ratioPresets</code> to customize them, or
          <code> showControls={'{false}'}</code> to hide the toolbar entirely.
        </p>
        <div className="docs-preview col">
          <EvoImageCropper
            src={DEMO_IMAGE}
            ratioPresets={[
              { label: 'Free', value: null },
              { label: 'Square', value: 1 },
              { label: 'Story (9:16)', value: 9 / 16 },
              { label: 'Banner (3:1)', value: 3 },
            ]}
            height={320}
          />
        </div>
        <CodeBlock code={`<EvoImageCropper
  src="/photo.jpg"
  ratioPresets={[
    { label: 'Free', value: null },
    { label: 'Square', value: 1 },
    { label: 'Story (9:16)', value: 9 / 16 },
    { label: 'Banner (3:1)', value: 3 },
  ]}
/>`} />
      </div>

      <div className="docs-section">
        <div className="docs-section-title">Circular crop (avatars)</div>
        <p className="docs-section-desc">
          Pass <code>circular</code> to render the crop region as a circle. The exported image
          is masked to a circle on transparent PNG — drop it straight into an avatar slot. The
          aspect ratio is locked to 1:1 automatically.
        </p>
        <div className="docs-preview col">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '1rem', alignItems: 'center', width: '100%' }}>
            <EvoImageCropper
              ref={avatarRef}
              src={AVATAR_IMAGE}
              circular
              height={300}
              showControls
            />
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
              <div
                style={{
                  width: 96,
                  height: 96,
                  borderRadius: '50%',
                  background: avatarPreview ? `url(${avatarPreview}) center/cover no-repeat` : 'var(--evo-color-surface-active)',
                  border: '2px solid var(--evo-color-border)',
                }}
                aria-label="Avatar preview"
              />
              <EvoButton label="Preview" size="sm" onClick={exportAvatar} />
            </div>
          </div>
        </div>
        <CodeBlock code={`<EvoImageCropper
  src="/profile-raw.jpg"
  circular
  height={300}
/>

// Export as a 256x256 PNG ready for an <img> tag:
const dataUrl = await ref.current.getCroppedDataURL({
  type: 'image/png',
  maxWidth: 256,
})`} />
      </div>

      <div className="docs-section">
        <div className="docs-section-title">Getting the result</div>
        <p className="docs-section-desc">
          Three output formats are available via the <code>ref</code>. Pick what matches your
          upload path. All accept an optional <code>maxWidth</code>/<code>maxHeight</code> to
          downscale for the web.
        </p>
        <CodeBlock code={`const ref = useRef<EvoImageCropperHandle>(null)

// 1. Blob — best for FormData / fetch / File API
const blob = await ref.current.getCroppedBlob({
  type: 'image/jpeg',
  quality: 0.9,
  maxWidth: 1920,
})

// 2. Data URL — best for previews and <img src>
const dataUrl = await ref.current.getCroppedDataURL({ type: 'image/png' })

// 3. Detached canvas — best for further manipulation
const canvas = ref.current.getCroppedCanvas({ maxWidth: 800 })

// Read the current crop in source-image pixels (without exporting):
const crop = ref.current.getCrop()
// → { x, y, width, height, rotation, sourceWidth, sourceHeight }`} />
      </div>

      <div className="docs-section">
        <div className="docs-section-title">Customizing the layout</div>
        <p className="docs-section-desc">
          The default toolbar covers most needs, but if you want to drive the cropper from your
          own UI just hide it and call the ref methods yourself.
        </p>
        <CodeBlock code={`<EvoImageCropper
  ref={ref}
  src="/photo.jpg"
  showControls={false}     // no built-in toolbar
  showGrid={false}         // no rule-of-thirds overlay
  background="transparent" // no checkerboard
  height={500}             // taller canvas area
  minZoom={0.5}            // allow zooming out below fit
  maxZoom={8}
/>

<button onClick={() => ref.current?.setZoom(2)}>2x</button>
<button onClick={() => ref.current?.rotate(90)}>Rotate</button>`} />
      </div>

      <EvoDivider />

      <div className="docs-section">
        <div className="docs-section-title">A note on cross-origin images</div>
        <p className="docs-section-desc">
          The cropper exports through an HTML canvas, which means cross-origin images need
          the host to send <code>Access-Control-Allow-Origin</code> headers. If they don't,
          the canvas is marked tainted and export will throw a <code>SecurityError</code>.
          The safest pattern: let the user pick a local file (<code>URL.createObjectURL</code>),
          or proxy the image through your own backend.
        </p>
        <CodeBlock code={`function FilePickCropper() {
  const [src, setSrc] = useState<string | null>(null)

  return (
    <>
      <input
        type="file"
        accept="image/*"
        onChange={(e) => {
          const f = e.target.files?.[0]
          if (f) setSrc(URL.createObjectURL(f))
        }}
      />
      {src && <EvoImageCropper src={src} aspectRatio={1} />}
    </>
  )
}`} />
      </div>

      <div className="docs-section">
        <div className="docs-section-title">Next steps</div>
        <ul className="docs-next-steps">
          <li><a href="/components/image-cropper/api">API reference →</a> Every prop, every ref method.</li>
        </ul>
      </div>
    </div>
  )
}
