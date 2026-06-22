---
name: evo-image-cropper
description: Use when users must crop, zoom, rotate, or mask an image before submitting it — avatar uploads, banner/cover photos, product thumbnails, ID capture, post composers — and you need client-side crop output as a Blob, data URL, or canvas; covers EvoImageCropper.
---

# EvoImageCropper — Evo UI

> Evo UI component skill. Master index: [[evo-ui]].

## Overview

EvoImageCropper is a dependency-free, client-side image cropper for the browser. Users drag the crop rectangle, pan and pinch/wheel to zoom, and rotate in 90° steps; the result is read imperatively through a `ref` as a Blob, data URL, detached canvas, or raw crop rectangle — all in the source image's natural pixel space, stable across zoom, pan, and stage resizes.

## Import

```tsx
import { EvoImageCropper, type EvoImageCropperHandle } from '@justin_evo/evo-ui';
// One-time stylesheet import (e.g. in your app entry):
// import '@justin_evo/evo-ui/dist/evo-ui.css';
```

## When to use

- Users need to crop, zoom, or rotate an image **before** submitting it (avatar uploads, banner photos, product thumbnails, ID document capture, post composers).
- You want circular avatar crops masked to a transparent PNG.
- You want the cropped pixels produced entirely on the client (Blob / data URL / canvas), with no third-party dependency.

## When NOT to use

- Just displaying an image — use a plain `<img>`.
- Background editing, filters, painting, masking, or AI tooling — use a full editor (e.g. Pintura) or a server pipeline.
- Heavy pixel work on huge images that should run on a backend — instead read the crop rect via `onChange` / `getCrop()` and send those coordinates to your server.

## Quick start

```tsx
import { useRef } from 'react';
import { EvoImageCropper, EvoButton, type EvoImageCropperHandle } from '@justin_evo/evo-ui';

function PhotoEditor() {
  const cropperRef = useRef<EvoImageCropperHandle>(null);

  const save = async () => {
    const blob = await cropperRef.current?.getCroppedBlob({ type: 'image/jpeg', quality: 0.9 });
    if (blob) {
      const form = new FormData();
      form.append('file', blob, 'cropped.jpg');
      await fetch('/api/upload', { method: 'POST', body: form });
    }
  };

  return (
    <>
      <EvoImageCropper ref={cropperRef} src="/uploads/raw.jpg" aspectRatio={16 / 9} />
      <EvoButton label="Save" onClick={save} />
    </>
  );
}
```

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `src` | `string` | — | Yes | Source image URL or data URL. |
| `aspectRatio` | `number` | — | No | Locks the crop rectangle to this width/height ratio. Omit for a free-form crop. Use `1` for a square, `16/9` for widescreen, etc. |
| `circular` | `boolean` | `false` | No | Render the crop rect as a circle (avatars). Implies `aspectRatio: 1`. |
| `showGrid` | `boolean` | `true` | No | Show a rule-of-thirds grid inside the crop rectangle. |
| `showControls` | `boolean` | `true` | No | Show the bottom controls toolbar (zoom, rotate, presets / ratio chips). |
| `ratioPresets` | `Array<{ label: string; value: number \| null }>` | (built-in: Free, 1:1, 4:3, 3:4, 16:9, 9:16) | No | Aspect ratio preset chips rendered above the canvas. Use `null` as a value for free-form. Ignored when `circular`. |
| `minZoom` | `number` | `1` | No | Minimum zoom level (relative to fit-to-stage = 1). Values `< 1` let the user zoom out beyond fit. |
| `maxZoom` | `number` | `4` | No | Maximum zoom level. |
| `defaultZoom` | `number` | `1` | No | Initial zoom (1 = fit-to-stage). |
| `defaultRotation` | `number` | `0` | No | Initial rotation in degrees. Snapped to a multiple of 90. |
| `defaultCrop` | `{ x: number; y: number; width: number; height: number }` | — (covers 80% of the visible image) | No | Initial crop rectangle as percentages of the stage (0–100). |
| `height` | `number \| string` | `360` | No | Stage (canvas area) height. Number = pixels, string = any CSS length. |
| `background` | `'checker' \| 'surface' \| 'transparent'` | `'checker'` | No | Background under the image. The checkerboard makes transparency obvious. |
| `label` | `string` | — | No | Optional label rendered above the cropper. |
| `helperText` | `string` | — | No | Optional helper text rendered below the cropper. |
| `onChange` | `(crop: EvoCropArea) => void` | — | No | Fires whenever the resulting crop changes. |
| `onReady` | `(info: { naturalWidth: number; naturalHeight: number }) => void` | — | No | Fires once the image has loaded and is ready to crop. |
| `onError` | `(error: Error) => void` | — | No | Fires if the image fails to load. |
| `disabled` | `boolean` | `false` | No | Disable all interaction. The image stays visible but no events fire. |
| `fullWidth` | `boolean` | `true` | No | Stretch to the parent's width. |
| `className` | `string` | — | No | Extra class applied to the root element. |
| `ariaLabel` | `string` | `'Image cropper'` | No | Accessible label for the cropper region (stage). |

The root is a plain `<div>`. The component forwards `ref` to an imperative handle (`EvoImageCropperHandle`), not to a DOM node — the `ref` is **not** a DOM ref. `className` is applied to the root element. It does not spread arbitrary `...rest` native attributes; only the props listed above are accepted.

## Sub-components

EvoImageCropper has no sub-components, but it exposes an imperative `ref` handle and several data types.

### Imperative handle: `EvoImageCropperHandle`

Attach a `ref` typed `EvoImageCropperHandle` to call these methods.

| Method | Signature | Description |
| --- | --- | --- |
| `getCrop` | `() => EvoCropArea \| null` | Current crop in source image pixel coordinates. Returns `null` until the image has loaded. |
| `getCroppedBlob` | `(opts?: EvoCropOutputOptions) => Promise<Blob>` | Cropped image as a Blob. Best for uploads via `FormData`. Rejects if the cropper is not ready or canvas export fails. |
| `getCroppedDataURL` | `(opts?: EvoCropOutputOptions) => Promise<string>` | Cropped image as a `data:` URL. Best for previews and `<img src>`. |
| `getCroppedCanvas` | `(opts?: Pick<EvoCropOutputOptions, 'maxWidth' \| 'maxHeight'>) => HTMLCanvasElement \| null` | A fresh, detached canvas containing the cropped pixels. Caller owns it. Returns `null` if not ready. |
| `reset` | `() => void` | Reset crop, zoom, pan, and rotation back to their initial (default) values. |
| `rotate` | `(deg?: 90 \| -90 \| 0 \| 180 \| 270) => void` | No argument rotates +90°. Pass an explicit 90° multiple to set rotation absolutely. |
| `setZoom` | `(zoom: number) => void` | Set the zoom level directly. Clamped to `[minZoom, maxZoom]`. |

### Output options: `EvoCropOutputOptions`

| Field | Type | Default | Description |
| --- | --- | --- | --- |
| `type` | `'image/png' \| 'image/jpeg' \| 'image/webp'` | `'image/png'` | Output MIME type. PNG keeps transparency (important for circular crops). |
| `quality` | `number` | `0.92` | Quality, 0–1, for lossy formats (jpeg, webp). Ignored for png. |
| `maxWidth` | `number` | — | Cap the output width in pixels. Height scales to keep the crop's aspect. |
| `maxHeight` | `number` | — | Cap the output height in pixels. Width scales to keep the crop's aspect. |

(`getCroppedCanvas` only accepts `maxWidth` / `maxHeight`.)

### Data shape: `EvoCropArea`

Returned by `getCrop()` and passed to `onChange`. Always in the source image's natural pixel space.

| Field | Type | Description |
| --- | --- | --- |
| `x` | `number` | Left offset in source image pixels. |
| `y` | `number` | Top offset in source image pixels. |
| `width` | `number` | Width in source image pixels. |
| `height` | `number` | Height in source image pixels. |
| `rotation` | `number` | Rotation applied (0, 90, 180, 270). |
| `sourceWidth` | `number` | Natural width of the source image. |
| `sourceHeight` | `number` | Natural height of the source image. |

## Variants & options

`background` — the area under the image:

- `checker` (default) — checkerboard backdrop; makes transparency obvious.
- `surface` — solid surface color.
- `transparent` — no backdrop.

`ratioPresets[].value` and `aspectRatio` accept any number (or `null` for free-form in presets). The built-in preset chips (shown when `showControls` is on and `circular` is off) are:

- `Free` → `null` — free-form, no ratio lock.
- `1:1` → `1` — square.
- `4:3` → `4 / 3` — standard landscape.
- `3:4` → `3 / 4` — standard portrait.
- `16:9` → `16 / 9` — widescreen.
- `9:16` → `9 / 16` — vertical / story.

## Examples

Aspect ratio lock with custom preset chips:

```tsx
import { EvoImageCropper } from '@justin_evo/evo-ui';

function BannerCropper() {
  return (
    <EvoImageCropper
      src="/photo.jpg"
      ratioPresets={[
        { label: 'Free', value: null },
        { label: 'Square', value: 1 },
        { label: 'Story (9:16)', value: 9 / 16 },
        { label: 'Banner (3:1)', value: 3 },
      ]}
      height={320}
    />
  );
}
```

Circular avatar crop, exported as a 256×256 transparent PNG:

```tsx
import { useRef, useState } from 'react';
import { EvoImageCropper, EvoButton, type EvoImageCropperHandle } from '@justin_evo/evo-ui';

function AvatarCropper() {
  const ref = useRef<EvoImageCropperHandle>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const makePreview = async () => {
    const url = await ref.current?.getCroppedDataURL({ type: 'image/png', maxWidth: 256 });
    if (url) setPreview(url);
  };

  return (
    <div>
      <EvoImageCropper ref={ref} src="/profile-raw.jpg" circular height={300} />
      <EvoButton label="Preview" size="sm" onClick={makePreview} />
      {preview && (
        <div
          style={{
            width: 96,
            height: 96,
            borderRadius: '50%',
            background: `url(${preview}) center/cover no-repeat`,
            border: '2px solid var(--evo-color-border)',
          }}
          aria-label="Avatar preview"
        />
      )}
    </div>
  );
}
```

Headless cropper driven by your own toolbar (no built-in controls), reading the crop without exporting:

```tsx
import { useRef } from 'react';
import { EvoImageCropper, type EvoImageCropperHandle, type EvoCropArea } from '@justin_evo/evo-ui';

function CustomToolbarCropper({ src }: { src: string }) {
  const ref = useRef<EvoImageCropperHandle>(null);

  const onChange = (crop: EvoCropArea) => {
    // crop.x / y / width / height are in source image pixels.
    debouncedSave({ x: Math.round(crop.x), y: Math.round(crop.y), r: crop.rotation });
  };

  return (
    <>
      <EvoImageCropper
        ref={ref}
        src={src}
        showControls={false}     // no built-in toolbar
        showGrid={false}         // no rule-of-thirds overlay
        background="transparent" // no checkerboard
        height={500}
        minZoom={0.5}            // allow zooming out below fit
        maxZoom={8}
        onChange={onChange}
      />
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <button type="button" onClick={() => ref.current?.setZoom(2)}>2x</button>
        <button type="button" onClick={() => ref.current?.rotate(90)}>Rotate</button>
        <button type="button" onClick={() => ref.current?.reset()}>Reset</button>
      </div>
    </>
  );
}
```

Local file pick (avoids cross-origin canvas tainting):

```tsx
import { useState } from 'react';
import { EvoImageCropper } from '@justin_evo/evo-ui';

function FilePickCropper() {
  const [src, setSrc] = useState<string | null>(null);
  return (
    <>
      <input
        type="file"
        accept="image/*"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) setSrc(URL.createObjectURL(f));
        }}
      />
      {src && <EvoImageCropper src={src} aspectRatio={1} />}
    </>
  );
}
```

## Accessibility

- The stage renders as `role="application"` with `aria-label` set from the `ariaLabel` prop (default `'Image cropper'`) and `aria-disabled` reflecting `disabled`.
- The aspect ratio preset row is a `role="radiogroup"` with `aria-label="Aspect ratio"`; each chip is `role="radio"` with `aria-checked` reflecting the current selection.
- The built-in toolbar buttons carry descriptive `aria-label`s: "Zoom out", "Zoom in", "Rotate left", "Rotate right", "Reset". The zoom `<input type="range">` is labelled "Zoom level". The controls container is labelled "Cropper controls".
- All toolbar buttons are real `<button type="button">` elements, so they are keyboard-focusable and never submit a surrounding form. The zoom slider is keyboard-operable (arrow keys) as a native range input.
- The rule-of-thirds grid and the decorative spinner are marked `aria-hidden`. The `<img>` uses an empty `alt=""` since it is a manipulation surface, not content.
- Crop drag/resize and pan/pinch use pointer events on the stage and overlay handles; these interactions are pointer-driven (mouse / touch / pen) — there is no keyboard handler for moving or resizing the crop rectangle itself, so provide your own controls (e.g. via the `ref`) if keyboard-only cropping is required.

## Gotchas

- The `ref` returns an `EvoImageCropperHandle` (imperative methods), **not** a DOM element. Type it `useRef<EvoImageCropperHandle>(null)` and call methods like `ref.current?.getCroppedBlob(...)`.
- `getCrop()` / `getCroppedCanvas()` return `null`, and the blob/dataURL methods reject, until the image has loaded — guard with optional chaining and await `onReady` if needed.
- Cross-origin export tainting: the cropper exports through an HTML canvas. Cross-origin images must send `Access-Control-Allow-Origin` headers, or export throws a `SecurityError`. Safest pattern: use a local file via `URL.createObjectURL`, or proxy the image through your own backend. The component loads the image with `crossOrigin = 'anonymous'`.
- `circular` forces `aspectRatio` to `1` and hides the ratio preset chips; export as PNG to keep the transparent circular mask (`type: 'image/jpeg'` would fill the corners).
- `defaultCrop`, `x`/`y`/`width`/`height` are **percentages of the stage (0–100)**, not pixels. The emitted `EvoCropArea`, by contrast, is in **source image pixels**.
- `rotate(deg)` only accepts 90° multiples (`0 | 90 | -90 | 180 | 270`); `defaultRotation` is snapped to the nearest multiple of 90.
- `disabled` keeps the image visible but suppresses all pointer/wheel interaction and disables toolbar buttons.
- All toolbar buttons default to `type="button"` — they never auto-submit a surrounding form.
- Theme via `var(--evo-color-*)` / `var(--evo-radius-*)` / `var(--evo-spacing-*)` tokens; never hard-code hex colors (breaks dark mode). Import the stylesheet `@justin_evo/evo-ui/dist/evo-ui.css` exactly once in your app.
- Import only named exports from `@justin_evo/evo-ui` — never deep paths.

## Related

- [[evo-button]] — trigger exports/reset/rotate from your own UI.
- [[evo-modal]] — host the cropper in a dialog for upload flows.
- [[evo-form]] — wire the cropped Blob into a submit / upload form.
- [[evo-theming]] — the `--evo-color-*` tokens used for styling.
- [[evo-ui]] — master index of all Evo UI components.
