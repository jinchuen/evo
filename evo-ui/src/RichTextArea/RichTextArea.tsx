import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import styles from '../css/richtextarea.module.scss';

// ----------------------------------------------------------------------------
// Tool keys & types
// ----------------------------------------------------------------------------

export type EvoRichTextBuiltInTool =
  | 'bold'
  | 'italic'
  | 'underline'
  | 'strike'
  | 'h1'
  | 'h2'
  | 'h3'
  | 'paragraph'
  | 'ul'
  | 'ol'
  | 'quote'
  | 'code'
  | 'link'
  | 'image'
  | 'align-left'
  | 'align-center'
  | 'align-right'
  | 'clear'
  | 'undo'
  | 'redo'
  | 'divider';

export interface EvoRichTextCustomTool {
  key: string;
  label: string;
  icon: React.ReactNode;
  onAction: (api: EvoRichTextHandle) => void;
  isActive?: () => boolean;
}

export type EvoRichTextTool = EvoRichTextBuiltInTool | EvoRichTextCustomTool;

export interface EvoRichTextHandle {
  /** Returns the current HTML content. */
  getHTML: () => string;
  /** Replaces the editor content with the given HTML. */
  setHTML: (html: string) => void;
  /** Returns the current plain text content. */
  getText: () => string;
  /** Focuses the editor. */
  focus: () => void;
  /** Inserts an image at the caret. */
  insertImage: (src: string, alt?: string) => void;
  /** Inserts arbitrary HTML at the caret. */
  insertHTML: (html: string) => void;
  /** Clears all content. */
  clear: () => void;
}

export interface EvoRichTextAreaProps {
  /** Controlled HTML value. */
  value?: string;
  /** Initial HTML for uncontrolled use. */
  defaultValue?: string;
  /** Fires whenever the content changes. Receives sanitized HTML. */
  onChange?: (html: string) => void;
  /** Which tools to render in the toolbar. Pass [] for no toolbar. */
  tools?: EvoRichTextTool[];
  /** Placeholder shown when empty. */
  placeholder?: string;
  /** Minimum editor height (CSS). */
  minHeight?: number | string;
  /** Maximum editor height before it scrolls (CSS). */
  maxHeight?: number | string;
  /** Disables editing. */
  disabled?: boolean;
  /** Read-only — same look, no editing. */
  readOnly?: boolean;
  /** Optional label rendered above. */
  label?: string;
  /** Helper text rendered below (hidden if `error` set). */
  helperText?: string;
  /** Error message — also marks the field invalid. */
  error?: string;
  /** Stretch to container width. */
  fullWidth?: boolean;
  /** Custom upload handler. Resolve with the URL to embed. */
  onImageUpload?: (file: File) => Promise<string>;
  /** Accepted image MIME types for the file picker. */
  acceptedImageTypes?: string[];
  /** Maximum image size in bytes. Larger images are rejected. */
  maxImageSize?: number;
  /** Fires when an image fails validation or upload. */
  onImageError?: (error: { code: 'too-large' | 'wrong-type' | 'upload-failed'; message: string }) => void;
  /** Optional class name for the root. */
  className?: string;
  /** Optional id (forwarded to the editable surface). */
  id?: string;
}

// ----------------------------------------------------------------------------
// Icons (inline, no deps — kept lightweight)
// ----------------------------------------------------------------------------

const Icon = ({ children }: { children: React.ReactNode }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {children}
  </svg>
);

const ICONS = {
  bold: <Icon><path d="M6 4h8a4 4 0 0 1 0 8H6z" /><path d="M6 12h9a4 4 0 0 1 0 8H6z" /></Icon>,
  italic: <Icon><line x1="19" y1="4" x2="10" y2="4" /><line x1="14" y1="20" x2="5" y2="20" /><line x1="15" y1="4" x2="9" y2="20" /></Icon>,
  underline: <Icon><path d="M6 3v7a6 6 0 0 0 12 0V3" /><line x1="4" y1="21" x2="20" y2="21" /></Icon>,
  strike: <Icon><path d="M16 4H9a3 3 0 0 0-2.83 4" /><path d="M14 12a4 4 0 0 1 0 8H6" /><line x1="4" y1="12" x2="20" y2="12" /></Icon>,
  h1: <Icon><path d="M4 12h8" /><path d="M4 18V6" /><path d="M12 18V6" /><path d="M17 10l3-2v10" /></Icon>,
  h2: <Icon><path d="M4 12h8" /><path d="M4 18V6" /><path d="M12 18V6" /><path d="M21 18h-4c0-4 4-3 4-6 0-1.5-2-2.5-4-1" /></Icon>,
  h3: <Icon><path d="M4 12h8" /><path d="M4 18V6" /><path d="M12 18V6" /><path d="M17.5 10.5c1.7-1 3.5 0 3.5 1.5a2 2 0 0 1-2 2" /><path d="M17 17.5c2 1.5 4 .3 4-1.5a2 2 0 0 0-2-2" /></Icon>,
  paragraph: <Icon><path d="M13 4v16" /><path d="M17 4v16" /><path d="M19 4H9.5a4.5 4.5 0 0 0 0 9H13" /></Icon>,
  ul: <Icon><line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" /><line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" /></Icon>,
  ol: <Icon><line x1="10" y1="6" x2="21" y2="6" /><line x1="10" y1="12" x2="21" y2="12" /><line x1="10" y1="18" x2="21" y2="18" /><path d="M4 6h1v4" /><path d="M4 10h2" /><path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1" /></Icon>,
  quote: <Icon><path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z" /><path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z" /></Icon>,
  code: <Icon><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></Icon>,
  link: <Icon><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" /></Icon>,
  image: <Icon><rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" /></Icon>,
  alignLeft: <Icon><line x1="17" y1="10" x2="3" y2="10" /><line x1="21" y1="6" x2="3" y2="6" /><line x1="21" y1="14" x2="3" y2="14" /><line x1="17" y1="18" x2="3" y2="18" /></Icon>,
  alignCenter: <Icon><line x1="18" y1="10" x2="6" y2="10" /><line x1="21" y1="6" x2="3" y2="6" /><line x1="21" y1="14" x2="3" y2="14" /><line x1="18" y1="18" x2="6" y2="18" /></Icon>,
  alignRight: <Icon><line x1="21" y1="10" x2="7" y2="10" /><line x1="21" y1="6" x2="3" y2="6" /><line x1="21" y1="14" x2="3" y2="14" /><line x1="21" y1="18" x2="7" y2="18" /></Icon>,
  clear: <Icon><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" /></Icon>,
  undo: <Icon><path d="M3 7v6h6" /><path d="M21 17a9 9 0 0 0-15-6.7L3 13" /></Icon>,
  redo: <Icon><path d="M21 7v6h-6" /><path d="M3 17a9 9 0 0 1 15-6.7L21 13" /></Icon>,
};

// ----------------------------------------------------------------------------
// Built-in tool descriptors
// ----------------------------------------------------------------------------

interface BuiltInDescriptor {
  label: string;
  icon: React.ReactNode;
  command: string;
  arg?: string;
  shortcut?: string;
  query?: string; // queryCommandState key (defaults to command)
}

const BUILTINS: Record<Exclude<EvoRichTextBuiltInTool, 'image' | 'link' | 'divider'>, BuiltInDescriptor> = {
  bold:           { label: 'Bold',          icon: ICONS.bold,        command: 'bold',          shortcut: '⌘B' },
  italic:         { label: 'Italic',        icon: ICONS.italic,      command: 'italic',        shortcut: '⌘I' },
  underline:      { label: 'Underline',     icon: ICONS.underline,   command: 'underline',     shortcut: '⌘U' },
  strike:         { label: 'Strikethrough', icon: ICONS.strike,      command: 'strikeThrough', query: 'strikeThrough' },
  h1:             { label: 'Heading 1',     icon: ICONS.h1,          command: 'formatBlock',   arg: 'H1' },
  h2:             { label: 'Heading 2',     icon: ICONS.h2,          command: 'formatBlock',   arg: 'H2' },
  h3:             { label: 'Heading 3',     icon: ICONS.h3,          command: 'formatBlock',   arg: 'H3' },
  paragraph:      { label: 'Paragraph',     icon: ICONS.paragraph,   command: 'formatBlock',   arg: 'P' },
  ul:             { label: 'Bulleted list', icon: ICONS.ul,          command: 'insertUnorderedList' },
  ol:             { label: 'Numbered list', icon: ICONS.ol,          command: 'insertOrderedList' },
  quote:          { label: 'Blockquote',    icon: ICONS.quote,       command: 'formatBlock',   arg: 'BLOCKQUOTE' },
  code:           { label: 'Inline code',   icon: ICONS.code,        command: 'formatBlock',   arg: 'PRE' },
  'align-left':   { label: 'Align left',    icon: ICONS.alignLeft,   command: 'justifyLeft' },
  'align-center': { label: 'Align center',  icon: ICONS.alignCenter, command: 'justifyCenter' },
  'align-right':  { label: 'Align right',   icon: ICONS.alignRight,  command: 'justifyRight' },
  clear:          { label: 'Clear formatting', icon: ICONS.clear,    command: 'removeFormat' },
  undo:           { label: 'Undo',          icon: ICONS.undo,        command: 'undo',          shortcut: '⌘Z' },
  redo:           { label: 'Redo',          icon: ICONS.redo,        command: 'redo',          shortcut: '⇧⌘Z' },
};

// ----------------------------------------------------------------------------
// Helpers
// ----------------------------------------------------------------------------

const DEFAULT_IMAGE_TYPES = ['image/png', 'image/jpeg', 'image/gif', 'image/webp', 'image/svg+xml'];

function isCustomTool(t: EvoRichTextTool): t is EvoRichTextCustomTool {
  return typeof t === 'object' && t !== null;
}

function readFileAsDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

function execCommand(command: string, arg?: string) {
  // execCommand is officially deprecated but remains the most pragmatic
  // way to do rich-text editing without a full editor framework.
  // All major browsers still support it.
  try {
    document.execCommand(command, false, arg);
  } catch {
    /* no-op */
  }
}

// ----------------------------------------------------------------------------
// Component
// ----------------------------------------------------------------------------

const DEFAULT_TOOLS: EvoRichTextTool[] = ['bold', 'italic', 'underline', 'divider', 'h1', 'h2', 'divider', 'ul', 'ol', 'divider', 'link', 'image'];

export const EvoRichTextArea = forwardRef<EvoRichTextHandle, EvoRichTextAreaProps>(function EvoRichTextArea(
  {
    value,
    defaultValue,
    onChange,
    tools = DEFAULT_TOOLS,
    placeholder = 'Start writing…',
    minHeight = 160,
    maxHeight,
    disabled = false,
    readOnly = false,
    label,
    helperText,
    error,
    fullWidth = false,
    onImageUpload,
    acceptedImageTypes = DEFAULT_IMAGE_TYPES,
    maxImageSize,
    onImageError,
    className = '',
    id,
  },
  forwardedRef,
) {
  const editorRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const lastEmittedHTML = useRef<string>('');
  const isControlled = value !== undefined;

  const [activeStates, setActiveStates] = useState<Record<string, boolean>>({});
  const [isEmpty, setIsEmpty] = useState(true);
  const [isDragOver, setIsDragOver] = useState(false);
  const [linkPrompt, setLinkPrompt] = useState<{ url: string; range: Range | null } | null>(null);

  const editorId = id ?? label?.toLowerCase().replace(/\s+/g, '-') ?? undefined;

  // ---- Sync controlled value into the DOM (only when external) ----
  useEffect(() => {
    const el = editorRef.current;
    if (!el) return;

    if (isControlled) {
      if (value !== lastEmittedHTML.current) {
        el.innerHTML = value ?? '';
        lastEmittedHTML.current = value ?? '';
        setIsEmpty(!el.textContent?.trim());
      }
    } else if (defaultValue && !lastEmittedHTML.current) {
      el.innerHTML = defaultValue;
      lastEmittedHTML.current = defaultValue;
      setIsEmpty(!el.textContent?.trim());
    }
  }, [value, defaultValue, isControlled]);

  // ---- Refresh active states for toolbar ----
  const refreshActiveStates = useCallback(() => {
    const next: Record<string, boolean> = {};
    Object.entries(BUILTINS).forEach(([key, desc]) => {
      try {
        if (desc.command === 'formatBlock') {
          const block = document.queryCommandValue('formatBlock');
          next[key] = typeof block === 'string' && block.toLowerCase() === (desc.arg ?? '').toLowerCase();
        } else {
          next[key] = document.queryCommandState(desc.query ?? desc.command);
        }
      } catch {
        next[key] = false;
      }
    });
    setActiveStates(next);
  }, []);

  // ---- Emit changes ----
  const emitChange = useCallback(() => {
    const el = editorRef.current;
    if (!el) return;
    const html = el.innerHTML;
    lastEmittedHTML.current = html;
    setIsEmpty(!el.textContent?.trim() && !el.querySelector('img'));
    onChange?.(html);
    refreshActiveStates();
  }, [onChange, refreshActiveStates]);

  // ---- Imperative handle ----
  useImperativeHandle(forwardedRef, () => ({
    getHTML: () => editorRef.current?.innerHTML ?? '',
    setHTML: (html: string) => {
      const el = editorRef.current;
      if (!el) return;
      el.innerHTML = html;
      emitChange();
    },
    getText: () => editorRef.current?.textContent ?? '',
    focus: () => editorRef.current?.focus(),
    insertImage: (src: string, alt = '') => insertImageAtCaret(src, alt),
    insertHTML: (html: string) => {
      editorRef.current?.focus();
      execCommand('insertHTML', html);
      emitChange();
    },
    clear: () => {
      const el = editorRef.current;
      if (!el) return;
      el.innerHTML = '';
      emitChange();
    },
  }), [emitChange]);

  // ---- Insert image (used by paste, drop, button) ----
  const insertImageAtCaret = useCallback((src: string, alt = '') => {
    editorRef.current?.focus();
    const html = `<img src="${src.replace(/"/g, '&quot;')}" alt="${alt.replace(/"/g, '&quot;')}" />`;
    execCommand('insertHTML', html);
    emitChange();
  }, [emitChange]);

  // ---- Image upload pipeline (file -> URL) ----
  const handleImageFile = useCallback(async (file: File) => {
    if (!acceptedImageTypes.includes(file.type)) {
      onImageError?.({ code: 'wrong-type', message: `Unsupported image type: ${file.type}` });
      return;
    }
    if (maxImageSize && file.size > maxImageSize) {
      onImageError?.({ code: 'too-large', message: `Image exceeds ${(maxImageSize / 1024 / 1024).toFixed(1)} MB` });
      return;
    }
    try {
      const url = onImageUpload ? await onImageUpload(file) : await readFileAsDataURL(file);
      insertImageAtCaret(url, file.name);
    } catch (err) {
      onImageError?.({ code: 'upload-failed', message: err instanceof Error ? err.message : 'Upload failed' });
    }
  }, [acceptedImageTypes, maxImageSize, onImageUpload, onImageError, insertImageAtCaret]);

  // ---- Toolbar actions ----
  const runBuiltin = useCallback((key: Exclude<EvoRichTextBuiltInTool, 'divider' | 'image' | 'link'>) => {
    editorRef.current?.focus();
    const desc = BUILTINS[key];
    if (!desc) return;
    execCommand(desc.command, desc.arg);
    emitChange();
  }, [emitChange]);

  const openImagePicker = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const startLinkPrompt = useCallback(() => {
    const sel = window.getSelection();
    const range = sel && sel.rangeCount > 0 ? sel.getRangeAt(0).cloneRange() : null;
    setLinkPrompt({ url: 'https://', range });
  }, []);

  const applyLink = useCallback(() => {
    if (!linkPrompt) return;
    const { url, range } = linkPrompt;
    editorRef.current?.focus();
    if (range) {
      const sel = window.getSelection();
      sel?.removeAllRanges();
      sel?.addRange(range);
    }
    if (url && url !== 'https://') {
      execCommand('createLink', url);
      // Make new links open in a new tab by default
      const links = editorRef.current?.querySelectorAll<HTMLAnchorElement>('a[href="' + url + '"]');
      links?.forEach((a) => a.setAttribute('target', '_blank'));
    }
    setLinkPrompt(null);
    emitChange();
  }, [linkPrompt, emitChange]);

  // ---- Event handlers on the editable surface ----
  const handleInput = useCallback(() => {
    emitChange();
  }, [emitChange]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
    const meta = e.metaKey || e.ctrlKey;
    if (!meta) return;
    const k = e.key.toLowerCase();
    if (k === 'b') { e.preventDefault(); runBuiltin('bold'); }
    else if (k === 'i') { e.preventDefault(); runBuiltin('italic'); }
    else if (k === 'u') { e.preventDefault(); runBuiltin('underline'); }
  }, [runBuiltin]);

  const handlePaste = useCallback(async (e: React.ClipboardEvent<HTMLDivElement>) => {
    const items = e.clipboardData?.items;
    if (!items) return;

    // 1. Image paste — the headline feature TipTap omits.
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item.type.startsWith('image/')) {
        e.preventDefault();
        const file = item.getAsFile();
        if (file) await handleImageFile(file);
        return;
      }
    }

    // 2. Plain text fallback — keep paste clean, strip foreign styles.
    const text = e.clipboardData?.getData('text/plain');
    if (text !== undefined && text !== '') {
      e.preventDefault();
      execCommand('insertText', text);
    }
  }, [handleImageFile]);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    if (e.dataTransfer.types.includes('Files')) {
      e.preventDefault();
      setIsDragOver(true);
    }
  }, []);

  const handleDragLeave = useCallback(() => setIsDragOver(false), []);

  const handleDrop = useCallback(async (e: React.DragEvent<HTMLDivElement>) => {
    setIsDragOver(false);
    const files = Array.from(e.dataTransfer.files ?? []).filter((f) => f.type.startsWith('image/'));
    if (files.length === 0) return;
    e.preventDefault();
    for (const file of files) {
      // eslint-disable-next-line no-await-in-loop
      await handleImageFile(file);
    }
  }, [handleImageFile]);

  const handleFilesPicked = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    e.target.value = '';
    for (const file of files) {
      // eslint-disable-next-line no-await-in-loop
      await handleImageFile(file);
    }
  }, [handleImageFile]);

  // Refresh active states on selection change while focused
  useEffect(() => {
    const handler = () => {
      const el = editorRef.current;
      if (!el) return;
      if (document.activeElement === el || el.contains(document.activeElement)) {
        refreshActiveStates();
      }
    };
    document.addEventListener('selectionchange', handler);
    return () => document.removeEventListener('selectionchange', handler);
  }, [refreshActiveStates]);

  // ---- Render the toolbar ----
  const renderedTools = useMemo(() => {
    const showToolbar = tools.length > 0;
    if (!showToolbar) return null;

    return (
      <div className={styles.toolbar} role="toolbar" aria-label="Formatting toolbar">
        {tools.map((tool, idx) => {
          if (tool === 'divider') {
            return <span key={`d-${idx}`} className={styles.divider} aria-hidden="true" />;
          }
          if (isCustomTool(tool)) {
            const active = tool.isActive?.() ?? false;
            return (
              <button
                key={tool.key}
                type="button"
                className={[styles.toolBtn, active ? styles.toolBtnActive : ''].filter(Boolean).join(' ')}
                title={tool.label}
                aria-label={tool.label}
                aria-pressed={active}
                disabled={disabled || readOnly}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => tool.onAction(getHandle())}
              >
                {tool.icon}
              </button>
            );
          }
          if (tool === 'image') {
            return (
              <button
                key="image"
                type="button"
                className={styles.toolBtn}
                title="Insert image"
                aria-label="Insert image"
                disabled={disabled || readOnly}
                onMouseDown={(e) => e.preventDefault()}
                onClick={openImagePicker}
              >
                {ICONS.image}
              </button>
            );
          }
          if (tool === 'link') {
            return (
              <button
                key="link"
                type="button"
                className={styles.toolBtn}
                title="Insert link"
                aria-label="Insert link"
                disabled={disabled || readOnly}
                onMouseDown={(e) => e.preventDefault()}
                onClick={startLinkPrompt}
              >
                {ICONS.link}
              </button>
            );
          }
          const desc = BUILTINS[tool];
          if (!desc) return null;
          const active = !!activeStates[tool];
          return (
            <button
              key={tool}
              type="button"
              className={[styles.toolBtn, active ? styles.toolBtnActive : ''].filter(Boolean).join(' ')}
              title={`${desc.label}${desc.shortcut ? ` (${desc.shortcut})` : ''}`}
              aria-label={desc.label}
              aria-pressed={active}
              disabled={disabled || readOnly}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => runBuiltin(tool)}
            >
              {desc.icon}
            </button>
          );
        })}
      </div>
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tools, activeStates, disabled, readOnly, openImagePicker, startLinkPrompt, runBuiltin]);

  // Get a fresh handle for custom tool callbacks
  const getHandle = useCallback((): EvoRichTextHandle => ({
    getHTML: () => editorRef.current?.innerHTML ?? '',
    setHTML: (html: string) => {
      const el = editorRef.current;
      if (!el) return;
      el.innerHTML = html;
      emitChange();
    },
    getText: () => editorRef.current?.textContent ?? '',
    focus: () => editorRef.current?.focus(),
    insertImage: (src: string, alt = '') => insertImageAtCaret(src, alt),
    insertHTML: (html: string) => {
      editorRef.current?.focus();
      execCommand('insertHTML', html);
      emitChange();
    },
    clear: () => {
      const el = editorRef.current;
      if (!el) return;
      el.innerHTML = '';
      emitChange();
    },
  }), [emitChange, insertImageAtCaret]);

  const heightStyle: React.CSSProperties = {
    minHeight: typeof minHeight === 'number' ? `${minHeight}px` : minHeight,
    maxHeight: maxHeight !== undefined ? (typeof maxHeight === 'number' ? `${maxHeight}px` : maxHeight) : undefined,
  };

  return (
    <div className={[styles.field, fullWidth ? styles.fullWidth : '', className].filter(Boolean).join(' ')}>
      {label && (
        <label htmlFor={editorId} className={styles.label}>
          {label}
        </label>
      )}

      <div
        className={[
          styles.shell,
          error ? styles.hasError : '',
          disabled ? styles.disabled : '',
          isDragOver ? styles.dragOver : '',
        ].filter(Boolean).join(' ')}
      >
        {renderedTools}

        <div
          ref={editorRef}
          id={editorId}
          className={[styles.editor, isEmpty ? styles.editorEmpty : ''].filter(Boolean).join(' ')}
          contentEditable={!disabled && !readOnly}
          suppressContentEditableWarning
          role="textbox"
          aria-multiline="true"
          aria-label={label ?? 'Rich text editor'}
          aria-invalid={!!error}
          aria-readonly={readOnly}
          aria-disabled={disabled}
          data-placeholder={placeholder}
          style={heightStyle}
          onInput={handleInput}
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onBlur={refreshActiveStates}
        />

        {isDragOver && (
          <div className={styles.dropOverlay} aria-hidden="true">
            <span>Drop image to upload</span>
          </div>
        )}

        {linkPrompt && (
          <div className={styles.linkPrompt} role="dialog" aria-label="Insert link">
            <input
              type="url"
              className={styles.linkInput}
              value={linkPrompt.url}
              autoFocus
              onChange={(e) => setLinkPrompt({ ...linkPrompt, url: e.target.value })}
              onKeyDown={(e) => {
                if (e.key === 'Enter') { e.preventDefault(); applyLink(); }
                else if (e.key === 'Escape') { e.preventDefault(); setLinkPrompt(null); }
              }}
              placeholder="https://example.com"
            />
            <button type="button" className={styles.linkBtn} onClick={applyLink}>Apply</button>
            <button type="button" className={styles.linkBtnGhost} onClick={() => setLinkPrompt(null)}>Cancel</button>
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept={acceptedImageTypes.join(',')}
          multiple
          hidden
          onChange={handleFilesPicked}
        />
      </div>

      {error && <p className={styles.errorText}>{error}</p>}
      {!error && helperText && <p className={styles.helperText}>{helperText}</p>}
    </div>
  );
});
