import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import type { CSSProperties, PointerEvent as ReactPointerEvent, WheelEvent as ReactWheelEvent } from 'react';
import styles from '../css/imagecropper.module.scss';

// ----------------------------------------------------------------------------
// Types
// ----------------------------------------------------------------------------

/** Output of a crop operation, in the source image's natural pixel space. */
export interface EvoCropArea {
  /** Left offset in source image pixels. */
  x: number;
  /** Top offset in source image pixels. */
  y: number;
  /** Width in source image pixels. */
  width: number;
  /** Height in source image pixels. */
  height: number;
  /** Rotation applied (0, 90, 180, 270). */
  rotation: number;
  /** Natural dimensions of the source image — handy for callers. */
  sourceWidth: number;
  sourceHeight: number;
}

/** Options for producing a cropped image from the current state. */
export interface EvoCropOutputOptions {
  /** Output MIME type. @default 'image/png' */
  type?: 'image/png' | 'image/jpeg' | 'image/webp';
  /** Quality, 0–1, for lossy formats. @default 0.92 */
  quality?: number;
  /** Cap the output width. Height scales to keep the crop's aspect. */
  maxWidth?: number;
  /** Cap the output height. Width scales to keep the crop's aspect. */
  maxHeight?: number;
}

/** Imperative handle returned via `ref`. */
export interface EvoImageCropperHandle {
  /** Current crop in source image pixels. */
  getCrop: () => EvoCropArea | null;
  /** Cropped image as a Blob. */
  getCroppedBlob: (opts?: EvoCropOutputOptions) => Promise<Blob>;
  /** Cropped image as a data URL. */
  getCroppedDataURL: (opts?: EvoCropOutputOptions) => Promise<string>;
  /** Cropped image as a fresh, detached canvas (caller owns it). */
  getCroppedCanvas: (opts?: Pick<EvoCropOutputOptions, 'maxWidth' | 'maxHeight'>) => HTMLCanvasElement | null;
  /** Reset crop, zoom, pan, and rotation back to their defaults. */
  reset: () => void;
  /** Rotate by ±90° (or set to a specific 90° multiple). */
  rotate: (deg?: 90 | -90 | 0 | 180 | 270) => void;
  /** Set zoom directly. Clamped to [minZoom, maxZoom]. */
  setZoom: (zoom: number) => void;
}

export interface EvoImageCropperProps {
  /** Source image URL or data URL. Required. */
  src: string;
  /**
   * Locks the crop rectangle to this width/height ratio.
   * Omit for a free-form crop. Use `1` for a square, `16/9` for widescreen, etc.
   */
  aspectRatio?: number;
  /** Render the crop rect as a circle (avatars). Implies `aspectRatio: 1`. */
  circular?: boolean;
  /** Show a rule-of-thirds grid inside the crop rectangle. @default true */
  showGrid?: boolean;
  /** Show the bottom controls toolbar (zoom, rotate, presets). @default true */
  showControls?: boolean;
  /** Show aspect ratio preset chips above the canvas. Ignored if `circular`. */
  ratioPresets?: Array<{ label: string; value: number | null }>;
  /**
   * Minimum zoom level (relative to fit-to-stage = 1). @default 1
   * @example minZoom={0.5} allows zooming out below fit.
   */
  minZoom?: number;
  /** Maximum zoom level. @default 4 */
  maxZoom?: number;
  /** Initial zoom. @default 1 */
  defaultZoom?: number;
  /** Initial rotation in degrees. Snapped to multiples of 90. @default 0 */
  defaultRotation?: number;
  /**
   * Initial crop rectangle as percentages of the stage (0–100).
   * Omit to start with the crop covering 80% of the visible image.
   */
  defaultCrop?: { x: number; y: number; width: number; height: number };
  /** Stage (canvas area) height. @default 360 */
  height?: number | string;
  /** Background under the image. @default 'checker' */
  background?: 'checker' | 'surface' | 'transparent';
  /** Optional label rendered above the cropper. */
  label?: string;
  /** Optional helper text rendered below the cropper. */
  helperText?: string;
  /** Fires whenever the resulting crop changes. */
  onChange?: (crop: EvoCropArea) => void;
  /** Fires once the image has loaded and is ready to crop. */
  onReady?: (info: { naturalWidth: number; naturalHeight: number }) => void;
  /** Fires if the image fails to load. */
  onError?: (error: Error) => void;
  /** Disable all interaction. */
  disabled?: boolean;
  /** Stretch to the parent's width. @default true */
  fullWidth?: boolean;
  /** Extra class on the root element. */
  className?: string;
  /** Accessible label for the cropper region. */
  ariaLabel?: string;
}

// ----------------------------------------------------------------------------
// Constants & helpers
// ----------------------------------------------------------------------------

const DEFAULT_RATIO_PRESETS: NonNullable<EvoImageCropperProps['ratioPresets']> = [
  { label: 'Free', value: null },
  { label: '1:1', value: 1 },
  { label: '4:3', value: 4 / 3 },
  { label: '3:4', value: 3 / 4 },
  { label: '16:9', value: 16 / 9 },
  { label: '9:16', value: 9 / 16 },
];

const MIN_CROP_PX = 24;

const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n));

const normalizeRotation = (deg: number): number => {
  const r = ((Math.round(deg / 90) * 90) % 360 + 360) % 360;
  return r;
};

interface Rect { left: number; top: number; width: number; height: number; }

// ----------------------------------------------------------------------------
// Component
// ----------------------------------------------------------------------------

export const EvoImageCropper = forwardRef<EvoImageCropperHandle, EvoImageCropperProps>(
  function EvoImageCropper(
    {
      src,
      aspectRatio,
      circular = false,
      showGrid = true,
      showControls = true,
      ratioPresets,
      minZoom = 1,
      maxZoom = 4,
      defaultZoom = 1,
      defaultRotation = 0,
      defaultCrop,
      height = 360,
      background = 'checker',
      label,
      helperText,
      onChange,
      onReady,
      onError,
      disabled = false,
      fullWidth = true,
      className,
      ariaLabel,
    },
    ref,
  ) {
    // Circular mode forces a 1:1 aspect.
    const effectiveAspect = circular ? 1 : aspectRatio;

    const stageRef = useRef<HTMLDivElement>(null);
    const imgRef = useRef<HTMLImageElement>(null);

    const [stageSize, setStageSize] = useState({ w: 0, h: 0 });
    const [imgNatural, setImgNatural] = useState<{ w: number; h: number } | null>(null);
    const [imgLoaded, setImgLoaded] = useState(false);
    const [imgError, setImgError] = useState(false);

    // Image transform state
    const [zoom, setZoomState] = useState(defaultZoom);
    const [rotation, setRotation] = useState(normalizeRotation(defaultRotation));
    const [pan, setPan] = useState({ x: 0, y: 0 });

    // Crop rect — stored as stage-relative percentages so it survives resizes.
    const [cropPct, setCropPct] = useState<Rect>({
      left: defaultCrop?.x ?? 10,
      top: defaultCrop?.y ?? 10,
      width: defaultCrop?.width ?? 80,
      height: defaultCrop?.height ?? 80,
    });

    // Aspect ratio chip selection — independently tracked from `aspectRatio`
    // so that uncontrolled callers can let users switch presets at runtime.
    const [selectedRatio, setSelectedRatio] = useState<number | null>(
      effectiveAspect ?? null,
    );
    useEffect(() => {
      setSelectedRatio(effectiveAspect ?? null);
    }, [effectiveAspect]);

    // ---------- Stage size tracking ----------
    useLayoutEffect(() => {
      const el = stageRef.current;
      if (!el) return;
      const update = () => {
        const rect = el.getBoundingClientRect();
        setStageSize({ w: rect.width, h: rect.height });
      };
      update();
      const ro = new ResizeObserver(update);
      ro.observe(el);
      return () => ro.disconnect();
    }, []);

    // ---------- Image load ----------
    useEffect(() => {
      setImgLoaded(false);
      setImgError(false);
      setImgNatural(null);
      if (!src) return;
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        setImgNatural({ w: img.naturalWidth, h: img.naturalHeight });
        setImgLoaded(true);
        onReady?.({ naturalWidth: img.naturalWidth, naturalHeight: img.naturalHeight });
      };
      img.onerror = () => {
        setImgError(true);
        onError?.(new Error(`Failed to load image: ${src}`));
      };
      img.src = src;
      return () => {
        img.onload = null;
        img.onerror = null;
      };
      // onReady/onError intentionally omitted — they're handlers, not deps
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [src]);

    // ---------- Derived: image base size & display rect ----------
    const baseScale = useMemo(() => {
      if (!imgNatural || !stageSize.w || !stageSize.h) return 1;
      // Account for rotation: 90°/270° swap dimensions
      const isQuarter = rotation === 90 || rotation === 270;
      const iw = isQuarter ? imgNatural.h : imgNatural.w;
      const ih = isQuarter ? imgNatural.w : imgNatural.h;
      return Math.min(stageSize.w / iw, stageSize.h / ih);
    }, [imgNatural, stageSize.w, stageSize.h, rotation]);

    // Image displayed size before rotation (the actual rendered <img> size).
    const imgDisplay = useMemo(() => {
      if (!imgNatural) return { w: 0, h: 0 };
      const s = baseScale * zoom;
      return { w: imgNatural.w * s, h: imgNatural.h * s };
    }, [imgNatural, baseScale, zoom]);

    // Crop rect in stage pixels
    const cropPx: Rect = useMemo(() => ({
      left: (cropPct.left / 100) * stageSize.w,
      top: (cropPct.top / 100) * stageSize.h,
      width: (cropPct.width / 100) * stageSize.w,
      height: (cropPct.height / 100) * stageSize.h,
    }), [cropPct, stageSize]);

    // ---------- Crop area in source image coordinates ----------
    const computeCropArea = useCallback((): EvoCropArea | null => {
      if (!imgNatural || !stageSize.w || !stageSize.h) return null;
      const s = baseScale * zoom;
      // Top-left of the *un-rotated* image rect in stage coords:
      // Image is centered at stage center + pan; rotation happens around image center.
      // For axis-aligned (0°/180°) we can compute directly; for 90°/270° dimensions swap.
      const cx = stageSize.w / 2 + pan.x;
      const cy = stageSize.h / 2 + pan.y;

      // Crop rect's center & size in stage coords:
      const rcx = cropPx.left + cropPx.width / 2;
      const rcy = cropPx.top + cropPx.height / 2;

      // Translate crop center into image-local (un-rotated) coords:
      const dx = rcx - cx;
      const dy = rcy - cy;
      // Inverse rotation
      const rad = (-rotation * Math.PI) / 180;
      const ix = dx * Math.cos(rad) - dy * Math.sin(rad);
      const iy = dx * Math.sin(rad) + dy * Math.cos(rad);

      // For 90/270 the crop rect's width/height effectively swap in image space.
      const isQuarter = rotation === 90 || rotation === 270;
      const cw = isQuarter ? cropPx.height : cropPx.width;
      const ch = isQuarter ? cropPx.width : cropPx.height;

      // Source pixel coords (top-left)
      const sx = (ix - cw / 2) / s + imgNatural.w / 2;
      const sy = (iy - ch / 2) / s + imgNatural.h / 2;
      const sw = cw / s;
      const sh = ch / s;

      return {
        x: sx,
        y: sy,
        width: sw,
        height: sh,
        rotation,
        sourceWidth: imgNatural.w,
        sourceHeight: imgNatural.h,
      };
    }, [imgNatural, stageSize, baseScale, zoom, pan, cropPx, rotation]);

    // Fire onChange whenever the derived crop area changes.
    const lastEmittedRef = useRef<string>('');
    useEffect(() => {
      if (!imgLoaded) return;
      const area = computeCropArea();
      if (!area) return;
      const key = `${area.x.toFixed(2)},${area.y.toFixed(2)},${area.width.toFixed(2)},${area.height.toFixed(2)},${area.rotation}`;
      if (key === lastEmittedRef.current) return;
      lastEmittedRef.current = key;
      onChange?.(area);
    }, [imgLoaded, computeCropArea, onChange]);

    // ---------- Aspect ratio enforcement ----------
    // When the selected aspect ratio changes, snap the crop rect to it.
    useEffect(() => {
      if (selectedRatio == null || !stageSize.w || !stageSize.h) return;
      setCropPct((prev) => {
        const w = (prev.width / 100) * stageSize.w;
        const h = (prev.height / 100) * stageSize.h;
        // Keep the larger dimension, derive the other from the ratio.
        const targetH = w / selectedRatio;
        let newW = w;
        let newH = targetH;
        if (targetH > h) {
          newH = h;
          newW = h * selectedRatio;
        }
        // Re-center around the previous center
        const cx = (prev.left + prev.width / 2) / 100 * stageSize.w;
        const cy = (prev.top + prev.height / 2) / 100 * stageSize.h;
        let left = cx - newW / 2;
        let top = cy - newH / 2;
        left = clamp(left, 0, stageSize.w - newW);
        top = clamp(top, 0, stageSize.h - newH);
        return {
          left: (left / stageSize.w) * 100,
          top: (top / stageSize.h) * 100,
          width: (newW / stageSize.w) * 100,
          height: (newH / stageSize.h) * 100,
        };
      });
    }, [selectedRatio, stageSize.w, stageSize.h]);

    // ---------- Pointer interactions ----------
    type DragKind =
      | { type: 'pan'; startX: number; startY: number; startPan: { x: number; y: number } }
      | { type: 'move'; startX: number; startY: number; startCrop: Rect }
      | { type: 'resize'; corner: ResizeCorner; startX: number; startY: number; startCrop: Rect };

    const dragRef = useRef<DragKind | null>(null);
    const pinchRef = useRef<{ startDist: number; startZoom: number } | null>(null);
    const pointersRef = useRef<Map<number, { x: number; y: number }>>(new Map());

    const onStagePointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
      if (disabled || !imgLoaded) return;
      (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
      pointersRef.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
      // Pinch zoom kicks in once a second pointer arrives
      if (pointersRef.current.size === 2) {
        const pts = Array.from(pointersRef.current.values());
        const dist = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
        pinchRef.current = { startDist: dist, startZoom: zoom };
        dragRef.current = null;
        return;
      }
      // Single-pointer: drag the *image* (pan) when stage background was hit.
      dragRef.current = {
        type: 'pan',
        startX: e.clientX,
        startY: e.clientY,
        startPan: pan,
      };
    };

    const onStagePointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
      if (!pointersRef.current.has(e.pointerId)) return;
      pointersRef.current.set(e.pointerId, { x: e.clientX, y: e.clientY });

      // Pinch zoom takes priority
      if (pinchRef.current && pointersRef.current.size >= 2) {
        const pts = Array.from(pointersRef.current.values());
        const dist = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
        const next = clamp(
          pinchRef.current.startZoom * (dist / pinchRef.current.startDist),
          minZoom,
          maxZoom,
        );
        setZoomState(next);
        return;
      }

      const d = dragRef.current;
      if (!d) return;
      const dx = e.clientX - d.startX;
      const dy = e.clientY - d.startY;

      if (d.type === 'pan') {
        setPan({ x: d.startPan.x + dx, y: d.startPan.y + dy });
      } else if (d.type === 'move') {
        moveCropBy(dx, dy, d.startCrop);
      } else if (d.type === 'resize') {
        resizeCrop(d.corner, dx, dy, d.startCrop);
      }
    };

    const endPointer = (e: ReactPointerEvent<HTMLDivElement>) => {
      pointersRef.current.delete(e.pointerId);
      if (pointersRef.current.size < 2) pinchRef.current = null;
      if (pointersRef.current.size === 0) dragRef.current = null;
    };

    // ---------- Wheel zoom ----------
    const onWheel = (e: ReactWheelEvent<HTMLDivElement>) => {
      if (disabled || !imgLoaded) return;
      e.preventDefault();
      const delta = -e.deltaY * 0.0015;
      setZoomState((z) => clamp(z * (1 + delta), minZoom, maxZoom));
    };

    // ---------- Crop rect manipulation ----------
    const moveCropBy = (dx: number, dy: number, startCrop: Rect) => {
      const stageW = stageSize.w, stageH = stageSize.h;
      const startLeft = (startCrop.left / 100) * stageW;
      const startTop = (startCrop.top / 100) * stageH;
      const w = (startCrop.width / 100) * stageW;
      const h = (startCrop.height / 100) * stageH;
      const left = clamp(startLeft + dx, 0, stageW - w);
      const top = clamp(startTop + dy, 0, stageH - h);
      setCropPct({
        left: (left / stageW) * 100,
        top: (top / stageH) * 100,
        width: startCrop.width,
        height: startCrop.height,
      });
    };

    type ResizeCorner = 'tl' | 'tr' | 'bl' | 'br' | 't' | 'b' | 'l' | 'r';

    const resizeCrop = (corner: ResizeCorner, dx: number, dy: number, startCrop: Rect) => {
      const stageW = stageSize.w, stageH = stageSize.h;
      let left = (startCrop.left / 100) * stageW;
      let top = (startCrop.top / 100) * stageH;
      let width = (startCrop.width / 100) * stageW;
      let height = (startCrop.height / 100) * stageH;
      const right = left + width;
      const bottom = top + height;

      let newLeft = left, newTop = top, newRight = right, newBottom = bottom;
      if (corner.includes('l')) newLeft = clamp(left + dx, 0, right - MIN_CROP_PX);
      if (corner.includes('r')) newRight = clamp(right + dx, left + MIN_CROP_PX, stageW);
      if (corner.includes('t')) newTop = clamp(top + dy, 0, bottom - MIN_CROP_PX);
      if (corner.includes('b')) newBottom = clamp(bottom + dy, top + MIN_CROP_PX, stageH);

      let w = newRight - newLeft;
      let h = newBottom - newTop;

      // Enforce aspect ratio if locked
      if (selectedRatio != null) {
        const isCorner = corner.length === 2;
        if (isCorner) {
          // Use the larger axis change to drive the smaller one
          const aw = w;
          const ah = w / selectedRatio;
          if (ah <= h || corner === 'tl' || corner === 'tr' || corner === 'bl' || corner === 'br') {
            h = aw / selectedRatio;
          } else {
            w = ah * selectedRatio;
          }
          if (corner.includes('t')) newTop = newBottom - h;
          if (corner.includes('b')) newBottom = newTop + h;
          if (corner.includes('l')) newLeft = newRight - w;
          if (corner.includes('r')) newRight = newLeft + w;
        } else if (corner === 'l' || corner === 'r') {
          h = w / selectedRatio;
          const cy = (top + bottom) / 2;
          newTop = cy - h / 2;
          newBottom = cy + h / 2;
        } else if (corner === 't' || corner === 'b') {
          w = h * selectedRatio;
          const cx = (left + right) / 2;
          newLeft = cx - w / 2;
          newRight = cx + w / 2;
        }
        // Re-clamp inside the stage; if we overflow, shrink to fit
        if (newLeft < 0) { newRight += -newLeft; newLeft = 0; }
        if (newTop < 0) { newBottom += -newTop; newTop = 0; }
        if (newRight > stageW) { const o = newRight - stageW; newRight = stageW; newLeft -= o; }
        if (newBottom > stageH) { const o = newBottom - stageH; newBottom = stageH; newTop -= o; }
        w = newRight - newLeft;
        h = newBottom - newTop;
        // If clamping broke the aspect, shrink to satisfy it
        if (Math.abs(w / h - selectedRatio) > 0.001) {
          if (w / h > selectedRatio) {
            const targetW = h * selectedRatio;
            const cx = (newLeft + newRight) / 2;
            newLeft = cx - targetW / 2;
            newRight = cx + targetW / 2;
          } else {
            const targetH = w / selectedRatio;
            const cy = (newTop + newBottom) / 2;
            newTop = cy - targetH / 2;
            newBottom = cy + targetH / 2;
          }
        }
      }

      setCropPct({
        left: (newLeft / stageW) * 100,
        top: (newTop / stageH) * 100,
        width: ((newRight - newLeft) / stageW) * 100,
        height: ((newBottom - newTop) / stageH) * 100,
      });
    };

    const onOverlayPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
      if (disabled || !imgLoaded) return;
      e.stopPropagation();
      (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
      pointersRef.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
      dragRef.current = {
        type: 'move',
        startX: e.clientX,
        startY: e.clientY,
        startCrop: { ...cropPct },
      };
    };

    const onHandlePointerDown = (corner: ResizeCorner) => (e: ReactPointerEvent<HTMLDivElement>) => {
      if (disabled || !imgLoaded) return;
      e.stopPropagation();
      (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
      pointersRef.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
      dragRef.current = {
        type: 'resize',
        corner,
        startX: e.clientX,
        startY: e.clientY,
        startCrop: { ...cropPct },
      };
    };

    // ---------- Output (canvas drawing) ----------
    const drawToCanvas = useCallback((opts?: Pick<EvoCropOutputOptions, 'maxWidth' | 'maxHeight'>): HTMLCanvasElement | null => {
      const area = computeCropArea();
      if (!area || !imgRef.current) return null;
      let outW = Math.max(1, Math.round(area.width));
      let outH = Math.max(1, Math.round(area.height));
      const { maxWidth, maxHeight } = opts ?? {};
      if (maxWidth && outW > maxWidth) {
        const r = maxWidth / outW;
        outW = maxWidth;
        outH = Math.round(outH * r);
      }
      if (maxHeight && outH > maxHeight) {
        const r = maxHeight / outH;
        outH = maxHeight;
        outW = Math.round(outW * r);
      }
      const canvas = document.createElement('canvas');
      canvas.width = outW;
      canvas.height = outH;
      const ctx = canvas.getContext('2d');
      if (!ctx) return null;
      ctx.imageSmoothingQuality = 'high';

      const img = imgRef.current;
      // Apply rotation around the canvas center so the *source rect* aligns.
      ctx.save();
      if (area.rotation === 0) {
        ctx.drawImage(img, area.x, area.y, area.width, area.height, 0, 0, outW, outH);
      } else {
        // Rotate the canvas so that the source coordinate system matches.
        ctx.translate(outW / 2, outH / 2);
        ctx.rotate((area.rotation * Math.PI) / 180);
        const swapped = area.rotation === 90 || area.rotation === 270;
        const drawW = swapped ? outH : outW;
        const drawH = swapped ? outW : outH;
        // Map the rotated crop back to source-image coords. For 90/270 the
        // crop's width/height correspond to height/width of the source rect.
        const srcW = swapped ? area.height : area.width;
        const srcH = swapped ? area.width : area.height;
        // The crop area's (x,y) we computed is already in the un-rotated
        // source's coordinate space for the rotated rect — but we computed
        // the un-rotated bounding rect, so use it directly.
        ctx.drawImage(
          img,
          area.x, area.y, srcW, srcH,
          -drawW / 2, -drawH / 2, drawW, drawH,
        );
      }
      ctx.restore();

      // Circular mask
      if (circular) {
        ctx.globalCompositeOperation = 'destination-in';
        ctx.beginPath();
        ctx.arc(outW / 2, outH / 2, Math.min(outW, outH) / 2, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
      }
      return canvas;
    }, [computeCropArea, circular]);

    // ---------- Imperative handle ----------
    useImperativeHandle(ref, () => ({
      getCrop: () => computeCropArea(),
      getCroppedCanvas: (opts) => drawToCanvas(opts),
      getCroppedBlob: (opts) =>
        new Promise<Blob>((resolve, reject) => {
          const canvas = drawToCanvas(opts);
          if (!canvas) return reject(new Error('Cropper not ready'));
          canvas.toBlob(
            (b) => (b ? resolve(b) : reject(new Error('Canvas export failed'))),
            opts?.type ?? 'image/png',
            opts?.quality ?? 0.92,
          );
        }),
      getCroppedDataURL: async (opts) => {
        const canvas = drawToCanvas(opts);
        if (!canvas) throw new Error('Cropper not ready');
        return canvas.toDataURL(opts?.type ?? 'image/png', opts?.quality ?? 0.92);
      },
      reset: () => {
        setZoomState(defaultZoom);
        setRotation(normalizeRotation(defaultRotation));
        setPan({ x: 0, y: 0 });
        setCropPct({
          left: defaultCrop?.x ?? 10,
          top: defaultCrop?.y ?? 10,
          width: defaultCrop?.width ?? 80,
          height: defaultCrop?.height ?? 80,
        });
      },
      rotate: (deg) => {
        if (deg === undefined) {
          setRotation((r) => normalizeRotation(r + 90));
        } else {
          setRotation(normalizeRotation(deg));
        }
      },
      setZoom: (z) => setZoomState(clamp(z, minZoom, maxZoom)),
    }), [computeCropArea, drawToCanvas, defaultZoom, defaultRotation, defaultCrop, minZoom, maxZoom]);

    // ---------- Render ----------
    const stageStyle: CSSProperties = {
      height: typeof height === 'number' ? `${height}px` : height,
    };

    const imageStyle: CSSProperties = imgNatural
      ? {
          width: imgDisplay.w,
          height: imgDisplay.h,
          transform: `translate(${pan.x}px, ${pan.y}px) rotate(${rotation}deg)`,
        }
      : { display: 'none' };

    const overlayStyle: CSSProperties = {
      left: cropPx.left,
      top: cropPx.top,
      width: cropPx.width,
      height: cropPx.height,
    };

    const circleMaskStyle: CSSProperties = circular
      ? ({
          ['--mask-cx' as string]: `${cropPx.left + cropPx.width / 2}px`,
          ['--mask-cy' as string]: `${cropPx.top + cropPx.height / 2}px`,
          ['--mask-r' as string]: `${Math.min(cropPx.width, cropPx.height) / 2}px`,
        } as CSSProperties)
      : {};

    const stageClasses = [
      styles.stage,
      background === 'checker' ? styles.bgChecker : '',
      disabled ? styles.disabled : '',
    ].filter(Boolean).join(' ');

    const rootClasses = [
      styles.root,
      fullWidth ? styles.fullWidth : '',
      className ?? '',
    ].filter(Boolean).join(' ');

    const presets = ratioPresets ?? DEFAULT_RATIO_PRESETS;
    const showPresets = showControls && !circular && presets.length > 0;

    return (
      <div className={rootClasses}>
        {label && <div className={styles.label}>{label}</div>}

        {showPresets && (
          <div className={styles.ratioRow} role="radiogroup" aria-label="Aspect ratio">
            {presets.map((p) => (
              <button
                key={p.label}
                type="button"
                role="radio"
                aria-checked={selectedRatio === p.value}
                className={`${styles.ratioChip} ${selectedRatio === p.value ? styles.active : ''}`}
                disabled={disabled}
                onClick={() => setSelectedRatio(p.value)}
              >
                {p.label}
              </button>
            ))}
          </div>
        )}

        <div
          ref={stageRef}
          className={stageClasses}
          style={stageStyle}
          role="application"
          aria-label={ariaLabel ?? 'Image cropper'}
          aria-disabled={disabled}
          onPointerDown={onStagePointerDown}
          onPointerMove={onStagePointerMove}
          onPointerUp={endPointer}
          onPointerCancel={endPointer}
          onWheel={onWheel}
        >
          {!imgLoaded && !imgError && (
            <div className={styles.placeholder}>
              <div className={styles.spinner} aria-hidden />
              <div>Loading image…</div>
            </div>
          )}
          {imgError && (
            <div className={styles.placeholder}>
              <div>Couldn't load image.</div>
            </div>
          )}

          <div className={styles.imageWrap}>
            <img
              ref={imgRef}
              src={src}
              alt=""
              draggable={false}
              className={styles.image}
              style={imageStyle}
            />
          </div>

          {imgLoaded && (
            <>
              {circular && <div className={styles.circleMask} style={circleMaskStyle} />}
              <div
                className={`${styles.overlay} ${circular ? styles.overlayCircle : ''}`}
                style={overlayStyle}
                onPointerDown={onOverlayPointerDown}
                onPointerMove={onStagePointerMove}
                onPointerUp={endPointer}
                onPointerCancel={endPointer}
              >
                {showGrid && !circular && (
                  <div className={styles.grid} aria-hidden>
                    <div className={`${styles.gridLine} ${styles.h}`} style={{ top: '33.33%' }} />
                    <div className={`${styles.gridLine} ${styles.h}`} style={{ top: '66.66%' }} />
                    <div className={`${styles.gridLine} ${styles.v}`} style={{ left: '33.33%' }} />
                    <div className={`${styles.gridLine} ${styles.v}`} style={{ left: '66.66%' }} />
                  </div>
                )}
                <div className={`${styles.handle} ${styles.handleTL}`} onPointerDown={onHandlePointerDown('tl')} />
                <div className={`${styles.handle} ${styles.handleTR}`} onPointerDown={onHandlePointerDown('tr')} />
                <div className={`${styles.handle} ${styles.handleBL}`} onPointerDown={onHandlePointerDown('bl')} />
                <div className={`${styles.handle} ${styles.handleBR}`} onPointerDown={onHandlePointerDown('br')} />
                <div className={`${styles.handle} ${styles.handleT}`}  onPointerDown={onHandlePointerDown('t')} />
                <div className={`${styles.handle} ${styles.handleB}`}  onPointerDown={onHandlePointerDown('b')} />
                <div className={`${styles.handle} ${styles.handleL}`}  onPointerDown={onHandlePointerDown('l')} />
                <div className={`${styles.handle} ${styles.handleR}`}  onPointerDown={onHandlePointerDown('r')} />
              </div>
            </>
          )}
        </div>

        {showControls && (
          <div
            className={`${styles.controls} ${disabled ? styles.disabled : ''}`}
            aria-label="Cropper controls"
          >
            <div className={styles.controlGroup}>
              <span className={styles.controlLabel}>Zoom</span>
              <button
                type="button"
                className={styles.iconBtn}
                aria-label="Zoom out"
                disabled={disabled || zoom <= minZoom}
                onClick={() => setZoomState((z) => clamp(z - 0.1, minZoom, maxZoom))}
              >
                <MinusIcon />
              </button>
              <input
                type="range"
                className={styles.zoomSlider}
                min={minZoom}
                max={maxZoom}
                step={0.01}
                value={zoom}
                disabled={disabled}
                onChange={(e) => setZoomState(parseFloat(e.target.value))}
                aria-label="Zoom level"
              />
              <button
                type="button"
                className={styles.iconBtn}
                aria-label="Zoom in"
                disabled={disabled || zoom >= maxZoom}
                onClick={() => setZoomState((z) => clamp(z + 0.1, minZoom, maxZoom))}
              >
                <PlusIcon />
              </button>
            </div>
            <div className={styles.divider} aria-hidden />
            <div className={styles.controlGroup}>
              <span className={styles.controlLabel}>Rotate</span>
              <button
                type="button"
                className={styles.iconBtn}
                aria-label="Rotate left"
                disabled={disabled}
                onClick={() => setRotation((r) => normalizeRotation(r - 90))}
              >
                <RotateLeftIcon />
              </button>
              <button
                type="button"
                className={styles.iconBtn}
                aria-label="Rotate right"
                disabled={disabled}
                onClick={() => setRotation((r) => normalizeRotation(r + 90))}
              >
                <RotateRightIcon />
              </button>
            </div>
            <div className={styles.divider} aria-hidden />
            <div className={styles.controlGroup}>
              <button
                type="button"
                className={styles.iconBtn}
                aria-label="Reset"
                disabled={disabled}
                onClick={() => {
                  setZoomState(defaultZoom);
                  setRotation(normalizeRotation(defaultRotation));
                  setPan({ x: 0, y: 0 });
                  setCropPct({
                    left: defaultCrop?.x ?? 10,
                    top: defaultCrop?.y ?? 10,
                    width: defaultCrop?.width ?? 80,
                    height: defaultCrop?.height ?? 80,
                  });
                }}
              >
                <ResetIcon />
              </button>
            </div>
          </div>
        )}

        {helperText && <div className={styles.helper}>{helperText}</div>}
      </div>
    );
  },
);
EvoImageCropper.displayName = 'EvoImageCropper';

// ----------------------------------------------------------------------------
// Inline icons — kept inline so the component has zero external deps
// ----------------------------------------------------------------------------

const iconProps = {
  width: 16,
  height: 16,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
};

const PlusIcon = () => (
  <svg {...iconProps}><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
);
const MinusIcon = () => (
  <svg {...iconProps}><line x1="5" y1="12" x2="19" y2="12" /></svg>
);
const RotateLeftIcon = () => (
  <svg {...iconProps}><polyline points="1 4 1 10 7 10" /><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" /></svg>
);
const RotateRightIcon = () => (
  <svg {...iconProps}><polyline points="23 4 23 10 17 10" /><path d="M20.49 15a9 9 0 1 1-2.13-9.36L23 10" /></svg>
);
const ResetIcon = () => (
  <svg {...iconProps}><path d="M3 12a9 9 0 1 0 3-6.7L3 8" /><polyline points="3 3 3 8 8 8" /></svg>
);
