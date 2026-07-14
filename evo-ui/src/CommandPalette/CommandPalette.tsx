import React, { forwardRef, useState, useEffect, useRef, useCallback } from 'react';
import styles from '../css/commandpalette.module.scss';

export interface CommandPaletteItem {
  label: string;
  description?: string;
  group?: string;
  icon?: React.ReactNode;
  shortcut?: string[];
  onSelect: () => void;
}

export interface EvoCommandPaletteProps extends React.HTMLAttributes<HTMLDivElement> {
  items: CommandPaletteItem[];
  placeholder?: string;
  open?: boolean;
  onClose?: () => void;
}

// Merge a forwarded ref with an internally-owned ref onto the same node.
function mergeRefs<T>(...refs: Array<React.Ref<T> | undefined>) {
  return (node: T | null) => {
    refs.forEach(ref => {
      if (!ref) return;
      if (typeof ref === 'function') ref(node);
      else (ref as React.MutableRefObject<T | null>).current = node;
    });
  };
}

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

// Detect Mac for shortcut display only — keyboard handler uses ctrlKey||metaKey for both
const isMac = typeof navigator !== 'undefined' && /Mac|iPhone|iPad|iPod/.test(navigator.userAgent);

const SearchIcon = () => (
  <svg viewBox="0 0 16 16" fill="none" width="16" height="16">
    <circle cx="7" cy="7" r="4.5" stroke="currentColor" strokeWidth="1.5" />
    <path d="M10.5 10.5L13 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

export const EvoCommandPalette = forwardRef<HTMLDivElement, EvoCommandPaletteProps>(function EvoCommandPalette(
  {
    items,
    placeholder = 'Search commands…',
    open: controlledOpen,
    onClose,
    className,
    ...rest
  },
  ref,
) {
  const [internalOpen, setInternalOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [activeIdx, setActiveIdx] = useState(0);
  // Distinguishes a roving keyboard selection from a mouse hover so the two
  // states can be styled differently (see .resultActive vs .resultHover).
  const [activeSource, setActiveSource] = useState<'keyboard' | 'mouse'>('keyboard');
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const paletteRef = useRef<HTMLDivElement>(null);

  const isControlled = controlledOpen !== undefined;
  const isOpen = isControlled ? controlledOpen : internalOpen;

  const close = useCallback(() => {
    if (!isControlled) setInternalOpen(false);
    onClose?.();
  }, [isControlled, onClose]);

  // Ctrl+K (Windows/Linux) / ⌘+K (Mac)
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        if (!isControlled) setInternalOpen(o => !o);
      }
      if (e.key === 'Escape' && isOpen) close();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [isControlled, isOpen, close]);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setActiveIdx(0);
      setActiveSource('keyboard');
      // Small delay so the element is mounted before focus
      const t = setTimeout(() => inputRef.current?.focus(), 30);
      return () => clearTimeout(t);
    }
  }, [isOpen]);

  const filtered = query.trim()
    ? items.filter(item =>
        item.label.toLowerCase().includes(query.toLowerCase()) ||
        item.description?.toLowerCase().includes(query.toLowerCase()) ||
        item.group?.toLowerCase().includes(query.toLowerCase())
      )
    : items;

  const grouped = filtered.reduce<Record<string, CommandPaletteItem[]>>((acc, item) => {
    const g = item.group ?? 'Actions';
    if (!acc[g]) acc[g] = [];
    acc[g].push(item);
    return acc;
  }, {});

  const flat = Object.values(grouped).flat();

  const scrollActiveIntoView = (idx: number) => {
    const el = listRef.current?.querySelector(`[data-idx="${idx}"]`) as HTMLElement | null;
    el?.scrollIntoView({ block: 'nearest' });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveSource('keyboard');
      setActiveIdx(i => {
        const next = Math.min(i + 1, flat.length - 1);
        scrollActiveIntoView(next);
        return next;
      });
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveSource('keyboard');
      setActiveIdx(i => {
        const next = Math.max(i - 1, 0);
        scrollActiveIntoView(next);
        return next;
      });
    } else if (e.key === 'Enter' && flat[activeIdx]) {
      flat[activeIdx].onSelect();
      close();
    } else if (e.key === 'Tab') {
      // Focus trap: Tab must not escape behind the overlay.
      const nodes = paletteRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);
      if (!nodes || nodes.length === 0) return;
      const focusable = Array.from(nodes);
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;

      if (e.shiftKey && active === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    }
  };

  if (!isOpen) return null;

  let globalIdx = 0;

  return (
    <div
      ref={mergeRefs(overlayRef, ref)}
      className={[styles.overlay, className].filter(Boolean).join(' ')}
      onClick={close}
      role="dialog"
      aria-modal="true"
      {...rest}
    >
      <div
        ref={paletteRef}
        className={styles.palette}
        onClick={e => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        <div className={styles.searchRow}>
          <span className={styles.searchIconWrap}><SearchIcon /></span>
          <input
            ref={inputRef}
            className={styles.searchInput}
            placeholder={placeholder}
            value={query}
            onChange={e => { setQuery(e.target.value); setActiveIdx(0); setActiveSource('keyboard'); }}
            aria-label="Command search"
          />
          <kbd className={styles.escBadge}>Esc</kbd>
        </div>

        <div className={styles.results} ref={listRef}>
          {flat.length === 0 && (
            <div className={styles.empty}>No results for &ldquo;{query}&rdquo;</div>
          )}
          {Object.entries(grouped).map(([group, groupItems]) => (
            <div key={group} className={styles.group}>
              <div className={styles.groupLabel}>{group}</div>
              {groupItems.map(item => {
                const idx = globalIdx++;
                return (
                  <button
                    key={item.label}
                    type="button"
                    data-idx={idx}
                    className={[
                      styles.resultItem,
                      idx === activeIdx && activeSource === 'keyboard' ? styles.resultActive : '',
                      idx === activeIdx && activeSource === 'mouse' ? styles.resultHover : '',
                    ]
                      .filter(Boolean)
                      .join(' ')}
                    onClick={() => { item.onSelect(); close(); }}
                    onMouseEnter={() => { setActiveSource('mouse'); setActiveIdx(idx); }}
                  >
                    {item.icon && <span className={styles.resultIcon}>{item.icon}</span>}
                    <span className={styles.resultLabel}>{item.label}</span>
                    {item.description && <span className={styles.resultDesc}>{item.description}</span>}
                    {item.shortcut && (
                      <span className={styles.resultShortcut}>
                        {item.shortcut.map((k, i) => <kbd key={i}>{k}</kbd>)}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        <div className={styles.footer}>
          <span><kbd>↑</kbd><kbd>↓</kbd> navigate</span>
          <span><kbd>↵</kbd> select</span>
          <span><kbd>Esc</kbd> close</span>
          <span className={styles.footerRight}>
            <kbd>{isMac ? '⌘' : 'Ctrl'}</kbd><kbd>K</kbd> toggle
          </span>
        </div>
      </div>
    </div>
  );
});

EvoCommandPalette.displayName = 'EvoCommandPalette';
