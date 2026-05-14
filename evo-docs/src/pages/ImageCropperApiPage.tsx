import { EvoDivider } from '@justin_evo/evo-ui'
import { PropsTable } from '../components/PropsTable'
import { CodeBlock } from '../components/CodeBlock'
import { SubPageBack } from '../components/SubPageBack'

export default function ImageCropperApiPage() {
  return (
    <div>
      <SubPageBack to="/components/image-cropper" label="Image Cropper" />
      <div className="docs-page-header">
        <div className="docs-page-tag">Component · Image Cropper</div>
        <h1 className="docs-page-title">EvoImageCropper — API</h1>
        <p className="docs-page-desc">
          Every prop, every imperative method, and the shape of the data the cropper emits.
          See <a href="/components/image-cropper">the overview page</a> for usage examples.
        </p>
      </div>

      <div className="docs-section">
        <div className="docs-section-title">Props</div>
        <PropsTable props={[
          { prop: 'src', type: 'string', required: true, description: 'Source image URL or data URL.' },
          { prop: 'aspectRatio', type: 'number', description: "Locks the crop rectangle's width/height ratio. e.g. 1 for square, 16/9 for widescreen. Omit for free-form." },
          { prop: 'circular', type: 'boolean', default: 'false', description: 'Render the crop region as a circle. Forces aspectRatio to 1.' },
          { prop: 'defaultCrop', type: '{ x, y, width, height }', description: 'Initial crop rectangle as percentages of the stage (0–100).' },
          { prop: 'defaultZoom', type: 'number', default: '1', description: 'Initial zoom level (1 = fit-to-stage).' },
          { prop: 'defaultRotation', type: 'number', default: '0', description: 'Initial rotation in degrees. Snapped to a multiple of 90.' },
          { prop: 'minZoom', type: 'number', default: '1', description: 'Lower zoom bound. Values < 1 let the user zoom out beyond fit.' },
          { prop: 'maxZoom', type: 'number', default: '4', description: 'Upper zoom bound.' },
          { prop: 'showGrid', type: 'boolean', default: 'true', description: 'Show a rule-of-thirds overlay inside the crop rectangle.' },
          { prop: 'showControls', type: 'boolean', default: 'true', description: 'Show the built-in zoom / rotate / reset toolbar.' },
          { prop: 'ratioPresets', type: 'Array<{ label: string; value: number | null }>', description: 'Aspect ratio chips rendered above the canvas. Pass null as a value for free-form. Ignored when circular.' },
          { prop: 'height', type: 'number | string', default: '360', description: 'Height of the stage (canvas) area. Number = pixels, string = any CSS length.' },
          { prop: 'background', type: "'checker' | 'surface' | 'transparent'", default: "'checker'", description: 'Background behind the image. The checkerboard makes transparency obvious.' },
          { prop: 'label', type: 'string', description: 'Label rendered above the cropper.' },
          { prop: 'helperText', type: 'string', description: 'Helper text rendered below the cropper.' },
          { prop: 'onChange', type: '(crop: EvoCropArea) => void', description: 'Fires whenever the resulting crop changes.' },
          { prop: 'onReady', type: '({ naturalWidth, naturalHeight }) => void', description: 'Fires once the image has finished loading.' },
          { prop: 'onError', type: '(error: Error) => void', description: 'Fires if the image fails to load.' },
          { prop: 'disabled', type: 'boolean', default: 'false', description: 'Disable all interaction. The image stays visible but no events fire.' },
          { prop: 'fullWidth', type: 'boolean', default: 'true', description: 'Stretch to the parent container width.' },
          { prop: 'className', type: 'string', description: 'Extra class applied to the root element.' },
          { prop: 'ariaLabel', type: 'string', default: "'Image cropper'", description: 'Accessible label for the cropper region.' },
        ]} />
      </div>

      <EvoDivider />

      <div className="docs-section">
        <div className="docs-section-title">Ref handle: <code>EvoImageCropperHandle</code></div>
        <p className="docs-section-desc">
          Attach a ref to access the cropper imperatively — exporting the result, resetting
          state, or driving the cropper from your own UI.
        </p>
        <PropsTable props={[
          { prop: 'getCrop()', type: '() => EvoCropArea | null', description: 'The current crop in source image pixel coordinates. Returns null until the image has loaded.' },
          { prop: 'getCroppedBlob(opts?)', type: '(opts?: EvoCropOutputOptions) => Promise<Blob>', description: 'Exports the crop as a Blob. Best for uploads via FormData.' },
          { prop: 'getCroppedDataURL(opts?)', type: '(opts?: EvoCropOutputOptions) => Promise<string>', description: 'Exports the crop as a data: URL. Best for previews and <img src>.' },
          { prop: 'getCroppedCanvas(opts?)', type: '(opts?) => HTMLCanvasElement | null', description: 'Returns a fresh, detached canvas containing the cropped pixels. Caller owns it.' },
          { prop: 'reset()', type: '() => void', description: 'Reset crop, zoom, pan, and rotation back to their initial values.' },
          { prop: 'rotate(deg?)', type: '(deg?: 0 | 90 | -90 | 180 | 270) => void', description: 'No argument rotates +90°. Pass an explicit angle to set it absolutely.' },
          { prop: 'setZoom(z)', type: '(zoom: number) => void', description: 'Set the zoom level directly. Clamped to [minZoom, maxZoom].' },
        ]} />
      </div>

      <div className="docs-section">
        <div className="docs-section-title">Output options: <code>EvoCropOutputOptions</code></div>
        <PropsTable props={[
          { prop: 'type', type: "'image/png' | 'image/jpeg' | 'image/webp'", default: "'image/png'", description: 'Output MIME type. PNG keeps transparency (important for circular crops).' },
          { prop: 'quality', type: 'number', default: '0.92', description: 'Quality 0–1 for lossy formats (jpeg, webp). Ignored for png.' },
          { prop: 'maxWidth', type: 'number', description: 'Cap output width in pixels. Height scales to keep the aspect ratio.' },
          { prop: 'maxHeight', type: 'number', description: 'Cap output height in pixels. Width scales to keep the aspect ratio.' },
        ]} />
      </div>

      <div className="docs-section">
        <div className="docs-section-title">Data shape: <code>EvoCropArea</code></div>
        <p className="docs-section-desc">
          Returned by <code>getCrop()</code> and passed to <code>onChange</code>. Always in the
          source image's natural pixel space — stable across zoom, pan, and stage resizes.
        </p>
        <CodeBlock code={`interface EvoCropArea {
  /** Left offset in source image pixels. */
  x: number
  /** Top offset in source image pixels. */
  y: number
  /** Width in source image pixels. */
  width: number
  /** Height in source image pixels. */
  height: number
  /** Rotation applied to the source before cropping (0, 90, 180, 270). */
  rotation: number
  /** Natural dimensions of the source image. */
  sourceWidth: number
  sourceHeight: number
}`} lang="ts" />
      </div>

      <EvoDivider />

      <div className="docs-section">
        <div className="docs-section-title">Recipes</div>

        <div style={{ marginBottom: '1.25rem' }}>
          <div style={{ fontWeight: 600, marginBottom: '0.5rem' }}>Upload a JPEG to a server</div>
          <CodeBlock code={`async function upload() {
  const blob = await ref.current?.getCroppedBlob({
    type: 'image/jpeg',
    quality: 0.85,
    maxWidth: 1920,
  })
  if (!blob) return

  const form = new FormData()
  form.append('file', blob, 'cropped.jpg')
  await fetch('/api/photos', { method: 'POST', body: form })
}`} />
        </div>

        <div style={{ marginBottom: '1.25rem' }}>
          <div style={{ fontWeight: 600, marginBottom: '0.5rem' }}>Drive the cropper from a custom toolbar</div>
          <CodeBlock code={`<EvoImageCropper ref={ref} src={src} showControls={false} />

<div className="my-toolbar">
  <button onClick={() => ref.current?.setZoom(1)}>1x</button>
  <button onClick={() => ref.current?.setZoom(2)}>2x</button>
  <button onClick={() => ref.current?.rotate()}>Rotate</button>
  <button onClick={() => ref.current?.reset()}>Reset</button>
</div>`} />
        </div>

        <div style={{ marginBottom: '0.25rem' }}>
          <div style={{ fontWeight: 600, marginBottom: '0.5rem' }}>Read the crop without exporting</div>
          <CodeBlock code={`<EvoImageCropper
  src={src}
  onChange={(crop) => {
    // crop.x, crop.y, crop.width, crop.height are in source image pixels.
    // Send to a backend that does the actual pixel work:
    debouncedSave({
      imageId,
      crop: {
        x: Math.round(crop.x),
        y: Math.round(crop.y),
        w: Math.round(crop.width),
        h: Math.round(crop.height),
        r: crop.rotation,
      },
    })
  }}
/>`} />
        </div>
      </div>
    </div>
  )
}
