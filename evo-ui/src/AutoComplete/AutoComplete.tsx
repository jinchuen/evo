import React, {
  forwardRef,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from 'react';
import styles from '../css/autocomplete.module.scss';

/* =====================================================================
 * EvoAutoComplete — editable combobox with list autocomplete.
 *
 * Research / design decisions (see CLAUDE.md §2 "research"):
 *  - MUI Autocomplete  → got the controlled `value` + `inputValue` split
 *    right; we keep it. Got bundle size wrong; we stay zero-runtime CSS.
 *  - Downshift / Headless UI → got strict WAI-ARIA combobox right
 *    (aria-activedescendant, focus stays on the input); we follow it.
 *  - Mantine → CSS Modules, no runtime styling; we match.
 *  - react-select → rich features but degrades on big lists; we cap
 *    rendered rows with `maxResults`.
 *  - react-autosuggest → unmaintained; avoid its tiny API surface.
 *
 * Two things NONE of the 10 surveyed libraries ship — and every team
 * re-builds by hand — so we make them first-class props:
 *  1. `smartRecovery` — when a query returns zero results, compute the
 *     nearest option by edit distance and offer a one-click correction
 *     ("Did you mean…?") instead of a dead-end empty state.
 *  2. `recents` — built-in recent-selection memory with a pluggable
 *     storage adapter (in-memory by default, opt into localStorage via
 *     `evoLocalRecents`). Surfaces a "Recent" group on empty focus.
 * ===================================================================== */

export interface AutoCompleteOption {
  /** Stable, unique identifier returned by `onChange`. */
  value: string;
  /** Human-readable text shown in the list and the input. */
  label: string;
  /** Optional secondary line under the label. */
  description?: string;
  /** Optional leading icon. */
  icon?: React.ReactNode;
  /** When true, the option is not selectable or keyboard-reachable. */
  disabled?: boolean;
}

/** Pluggable persistence layer for the `recents` feature. */
export interface RecentsStorage {
  /** Return the stored option values, most-recent first. */
  get: () => string[];
  /** Persist the option values, most-recent first. */
  set: (values: string[]) => void;
}

export interface RecentsConfig {
  /** Max remembered selections. Default 5. */
  max?: number;
  /** Where recents live. Default: in-memory (per `id`/`name`). */
  storage?: RecentsStorage;
  /** Section heading shown above recents. Default "Recent". */
  label?: string;
}

export interface EvoAutoCompleteProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    'size' | 'onChange' | 'value' | 'defaultValue'
  > {
  /** The options to match against. In async mode, the already-filtered set. */
  options: AutoCompleteOption[];

  /** Selected option value (controlled). */
  value?: string | null;
  /** Selected option value (uncontrolled initial). */
  defaultValue?: string | null;
  /** Fires when a selection is made or cleared. */
  onChange?: (value: string | null, option: AutoCompleteOption | null) => void;

  /** The input's text (controlled — pair with `onInputChange`). */
  inputValue?: string;
  /** Fires when the typed text changes. Debounced by `debounce`. */
  onInputChange?: (query: string) => void;

  /** Field label. */
  label?: string;
  placeholder?: string;
  helperText?: string;
  /** Error message — also flips the field into the error state. */
  error?: string;
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  disabled?: boolean;
  /** Show a clear (✕) button when there is a value. Default true. */
  clearable?: boolean;

  /** Render a spinner row instead of results (for async fetches). */
  loading?: boolean;
  /** Debounce, in ms, applied to `onInputChange`. Default 0. */
  debounce?: number;
  /** Minimum query length before results show. Default 0. */
  minChars?: number;
  /** Cap on rendered rows — protects against huge lists. Default 50. */
  maxResults?: number;
  /**
   * Filtering strategy:
   *  - omitted → case-insensitive substring match on `label`.
   *  - function → custom predicate.
   *  - `false` → caller pre-filters (async mode); render `options` as-is.
   */
  filter?: false | ((option: AutoCompleteOption, query: string) => boolean);
  /** Bold the matched substring in each row. Default true. */
  highlightMatch?: boolean;
  /** Open the menu when the input receives focus. Default true. */
  openOnFocus?: boolean;
  /** Message shown when a non-empty query has no matches. */
  emptyMessage?: React.ReactNode;

  /** 🆕 Offer a nearest-match correction when a query has zero results. */
  smartRecovery?: boolean;
  /** 🆕 Remember recent selections and surface them on empty focus. */
  recents?: boolean | RecentsConfig;

  /** Custom row renderer. Overrides icon/label/description layout. */
  renderOption?: (
    option: AutoCompleteOption,
    state: { active: boolean; query: string },
  ) => React.ReactNode;

  id?: string;
  name?: string;
  className?: string;
}

/* ---------------- Icons ---------------- */
const SearchIcon = () => (
  <svg viewBox="0 0 16 16" width="14" height="14" fill="none" aria-hidden="true">
    <circle cx="7" cy="7" r="4.5" stroke="currentColor" strokeWidth="1.5" />
    <path d="M10.5 10.5L13 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);
const ClearIcon = () => (
  <svg viewBox="0 0 16 16" width="12" height="12" fill="none" aria-hidden="true">
    <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
  </svg>
);
const CheckIcon = () => (
  <svg viewBox="0 0 16 16" width="14" height="14" fill="none" aria-hidden="true">
    <path d="M3.5 8.5l3 3 6-7" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const ClockIcon = () => (
  <svg viewBox="0 0 16 16" width="13" height="13" fill="none" aria-hidden="true">
    <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.5" />
    <path d="M8 4.5V8l2.5 1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const SparkIcon = () => (
  <svg viewBox="0 0 16 16" width="13" height="13" fill="none" aria-hidden="true">
    <path
      d="M8 1.5l1.6 4.9 4.9 1.6-4.9 1.6L8 14.5l-1.6-4.9L1.5 8l4.9-1.6L8 1.5z"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinejoin="round"
    />
  </svg>
);
const SpinnerIcon = () => (
  <svg viewBox="0 0 16 16" width="14" height="14" fill="none" aria-hidden="true" className={styles.spinner}>
    <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="2" strokeOpacity="0.25" />
    <path d="M14 8a6 6 0 0 0-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

/* =====================================================================
 * Recents storage adapters
 * ===================================================================== */

/** Process-lifetime in-memory store, keyed so each field keeps its own. */
const memoryStore = new Map<string, string[]>();
const memoryRecents = (key: string): RecentsStorage => ({
  get: () => memoryStore.get(key) ?? [],
  set: (values) => {
    memoryStore.set(key, values);
  },
});

/**
 * A `RecentsStorage` backed by `localStorage` — survives reloads.
 * SSR-safe: no-ops when `window` is unavailable.
 *
 * @example
 * <EvoAutoComplete recents={{ storage: evoLocalRecents('country-picker') }} />
 */
export const evoLocalRecents = (key: string): RecentsStorage => ({
  get: () => {
    if (typeof window === 'undefined') return [];
    try {
      const raw = window.localStorage.getItem(`evo-recents:${key}`);
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed.filter((v) => typeof v === 'string') : [];
    } catch {
      return [];
    }
  },
  set: (values) => {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.setItem(`evo-recents:${key}`, JSON.stringify(values));
    } catch {
      /* quota / privacy mode — fail silently */
    }
  },
});

/* =====================================================================
 * Smart Recovery — nearest-match via Levenshtein edit distance.
 * Zero-dependency (CLAUDE.md §7 forbids new runtime deps).
 * ===================================================================== */

function editDistance(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  if (m === 0) return n;
  if (n === 0) return m;
  let prev = Array.from({ length: n + 1 }, (_, i) => i);
  let curr = new Array<number>(n + 1);
  for (let i = 1; i <= m; i++) {
    curr[0] = i;
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      curr[j] = Math.min(prev[j] + 1, curr[j - 1] + 1, prev[j - 1] + cost);
    }
    [prev, curr] = [curr, prev];
  }
  return prev[n];
}

interface Recovery {
  option: AutoCompleteOption;
  distance: number;
}

/** Find the closest option to `query`, or null if nothing is close enough. */
function findNearest(options: AutoCompleteOption[], query: string): Recovery | null {
  const q = query.trim().toLowerCase();
  if (q.length < 2) return null;
  let best: AutoCompleteOption | null = null;
  let bestD = Infinity;
  for (const o of options) {
    if (o.disabled) continue;
    const label = o.label.toLowerCase();
    // Compare against the full label AND the label trimmed to the query
    // length — a typo in a long label shouldn't be drowned out.
    const d = Math.min(editDistance(q, label), editDistance(q, label.slice(0, q.length)));
    if (d < bestD) {
      bestD = d;
      best = o;
    }
  }
  if (!best) return null;
  // Only suggest when the fix is small: ~40% of the query length, 1–3 edits.
  const threshold = Math.max(1, Math.min(3, Math.round(q.length * 0.4)));
  return bestD <= threshold ? { option: best, distance: bestD } : null;
}

/* ---------------- Match highlighting ---------------- */
function highlightLabel(label: string, query: string): React.ReactNode {
  const q = query.trim();
  if (!q) return label;
  const idx = label.toLowerCase().indexOf(q.toLowerCase());
  if (idx < 0) return label;
  return (
    <>
      {label.slice(0, idx)}
      <mark className={styles.mark}>{label.slice(idx, idx + q.length)}</mark>
      {label.slice(idx + q.length)}
    </>
  );
}

/* =====================================================================
 * Component
 * ===================================================================== */

export const EvoAutoComplete = forwardRef<HTMLInputElement, EvoAutoCompleteProps>(
  (
    {
      options,
      value: controlledValue,
      defaultValue = null,
      onChange,
      inputValue: controlledInput,
      onInputChange,
      label,
      placeholder = 'Search…',
      helperText,
      error,
      size = 'md',
      fullWidth = false,
      disabled = false,
      clearable = true,
      loading = false,
      debounce = 0,
      minChars = 0,
      maxResults = 50,
      filter,
      highlightMatch = true,
      openOnFocus = true,
      emptyMessage = 'No results',
      smartRecovery = false,
      recents = false,
      renderOption,
      id,
      name,
      className = '',
      ...rest
    },
    ref,
  ) => {
    const reactId = useId();
    const acId = id ?? `evo-autocomplete-${reactId}`;
    const listId = `${acId}-listbox`;

    /* ---- value (selected option) ---- */
    const isValueControlled = controlledValue !== undefined;
    const [internalValue, setInternalValue] = useState<string | null>(defaultValue);
    const value = isValueControlled ? controlledValue! : internalValue;
    const selectedOption = useMemo(
      () => options.find((o) => o.value === value) ?? null,
      [options, value],
    );

    /* ---- input text ---- */
    const isInputControlled = controlledInput !== undefined;
    const [internalInput, setInternalInput] = useState(
      () => options.find((o) => o.value === defaultValue)?.label ?? '',
    );
    const inputText = isInputControlled ? controlledInput! : internalInput;

    /* ---- recents config ---- */
    const recentsCfg: Required<RecentsConfig> | null = useMemo(() => {
      if (!recents) return null;
      const base: Required<RecentsConfig> = {
        max: 5,
        storage: memoryRecents(name ?? acId),
        label: 'Recent',
      };
      return typeof recents === 'object' ? { ...base, ...recents } : base;
    }, [recents, name, acId]);

    const [recentValues, setRecentValues] = useState<string[]>(
      () => recentsCfg?.storage.get() ?? [],
    );

    /* ---- open / active descendant ---- */
    const [open, setOpen] = useState(false);
    const [activeIdx, setActiveIdx] = useState(0);

    const wrapperRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const listRef = useRef<HTMLDivElement>(null);
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    /* Merge the forwarded ref with our internal one. */
    const setInputRef = useCallback(
      (node: HTMLInputElement | null) => {
        inputRef.current = node;
        if (typeof ref === 'function') ref(node);
        else if (ref) (ref as React.MutableRefObject<HTMLInputElement | null>).current = node;
      },
      [ref],
    );

    /* ---- derive what the menu shows ---- */
    const query = inputText;
    const trimmed = query.trim();
    const belowMin = trimmed.length > 0 && trimmed.length < minChars;

    const showRecents =
      !!recentsCfg && trimmed.length === 0 && recentValues.length > 0;

    const recentOptions = useMemo(() => {
      if (!showRecents) return [];
      return recentValues
        .map((v) => options.find((o) => o.value === v))
        .filter((o): o is AutoCompleteOption => !!o && !o.disabled)
        .slice(0, recentsCfg!.max);
    }, [showRecents, recentValues, options, recentsCfg]);

    const filteredOptions = useMemo(() => {
      if (belowMin) return [];
      if (filter === false || trimmed.length === 0) {
        return options.slice(0, maxResults);
      }
      const predicate =
        typeof filter === 'function'
          ? filter
          : (o: AutoCompleteOption, q: string) =>
              o.label.toLowerCase().includes(q.toLowerCase());
      return options.filter((o) => predicate(o, trimmed)).slice(0, maxResults);
    }, [options, filter, trimmed, belowMin, maxResults]);

    const results = showRecents ? recentOptions : filteredOptions;

    const recovery: Recovery | null = useMemo(() => {
      if (!smartRecovery || loading || belowMin) return null;
      if (showRecents || results.length > 0 || trimmed.length === 0) return null;
      return findNearest(options, trimmed);
    }, [smartRecovery, loading, belowMin, showRecents, results.length, trimmed, options]);

    /* The keyboard-navigable set: the recovery suggestion, else the results. */
    const navItems = recovery ? [recovery.option] : results;

    /* ---- close on outside click ---- */
    useEffect(() => {
      if (!open) return;
      const handler = (e: MouseEvent) => {
        if (!wrapperRef.current?.contains(e.target as Node)) closeMenu();
      };
      document.addEventListener('mousedown', handler);
      return () => document.removeEventListener('mousedown', handler);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open]);

    /* ---- keep the active row in view ---- */
    useEffect(() => {
      if (!open) return;
      const el = listRef.current?.querySelector(
        `[data-idx="${activeIdx}"]`,
      ) as HTMLElement | null;
      el?.scrollIntoView({ block: 'nearest' });
    }, [activeIdx, open]);

    /* ---- sync input text when value changes while the menu is closed ---- */
    useEffect(() => {
      if (open || isInputControlled) return;
      setInternalInput(selectedOption?.label ?? '');
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value]);

    /* ---- flush any pending debounce on unmount ---- */
    useEffect(
      () => () => {
        if (debounceRef.current) clearTimeout(debounceRef.current);
      },
      [],
    );

    const emitInputChange = useCallback(
      (next: string) => {
        if (!onInputChange) return;
        if (debounce > 0) {
          if (debounceRef.current) clearTimeout(debounceRef.current);
          debounceRef.current = setTimeout(() => onInputChange(next), debounce);
        } else {
          onInputChange(next);
        }
      },
      [onInputChange, debounce],
    );

    const setValue = useCallback(
      (next: string | null, option: AutoCompleteOption | null) => {
        if (!isValueControlled) setInternalValue(next);
        onChange?.(next, option);
      },
      [isValueControlled, onChange],
    );

    const rememberRecent = useCallback(
      (optionValue: string) => {
        if (!recentsCfg) return;
        setRecentValues((prev) => {
          const next = [optionValue, ...prev.filter((v) => v !== optionValue)].slice(
            0,
            recentsCfg.max,
          );
          recentsCfg.storage.set(next);
          return next;
        });
      },
      [recentsCfg],
    );

    const closeMenu = useCallback(() => {
      setOpen(false);
      setActiveIdx(0);
      // List-autocomplete-with-manual-selection (WAI-ARIA): on close, if a
      // value is selected, snap the text back to it; free text is kept only
      // when nothing is selected.
      if (!isInputControlled && selectedOption) {
        setInternalInput(selectedOption.label);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isInputControlled, selectedOption]);

    const commitOption = useCallback(
      (option: AutoCompleteOption) => {
        if (option.disabled) return;
        setValue(option.value, option);
        if (!isInputControlled) setInternalInput(option.label);
        emitInputChange(option.label);
        rememberRecent(option.value);
        setOpen(false);
        setActiveIdx(0);
        inputRef.current?.focus();
      },
      [setValue, isInputControlled, emitInputChange, rememberRecent],
    );

    const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
      const next = e.target.value;
      if (!isInputControlled) setInternalInput(next);
      emitInputChange(next);
      // Typing past a committed selection un-commits it.
      if (selectedOption && next !== selectedOption.label) setValue(null, null);
      setActiveIdx(0);
      if (!open) setOpen(true);
    };

    const handleClear = () => {
      if (!isInputControlled) setInternalInput('');
      emitInputChange('');
      setValue(null, null);
      setActiveIdx(0);
      inputRef.current?.focus();
      setOpen(true);
    };

    const moveActive = (dir: 1 | -1) => {
      if (navItems.length === 0) return;
      let next = activeIdx;
      for (let i = 0; i < navItems.length; i++) {
        next = (next + dir + navItems.length) % navItems.length;
        if (!navItems[next].disabled) {
          setActiveIdx(next);
          return;
        }
      }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (disabled) return;
      if (!open) {
        if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
          e.preventDefault();
          setOpen(true);
        }
        return;
      }
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          moveActive(1);
          break;
        case 'ArrowUp':
          e.preventDefault();
          moveActive(-1);
          break;
        case 'Home':
          e.preventDefault();
          setActiveIdx(navItems.findIndex((o) => !o.disabled));
          break;
        case 'End':
          e.preventDefault();
          for (let i = navItems.length - 1; i >= 0; i--) {
            if (!navItems[i].disabled) {
              setActiveIdx(i);
              break;
            }
          }
          break;
        case 'Enter': {
          const opt = navItems[activeIdx];
          if (opt && !opt.disabled) {
            e.preventDefault();
            commitOption(opt);
          }
          break;
        }
        case 'Escape':
          e.preventDefault();
          closeMenu();
          break;
        case 'Tab':
          closeMenu();
          break;
        default:
          break;
      }
    };

    const sizeClass = styles[size];
    const activeId =
      open && navItems[activeIdx] ? `${acId}-opt-${activeIdx}` : undefined;

    /* ---- shared row renderer ---- */
    const renderRow = (
      option: AutoCompleteOption,
      idx: number,
      variant: 'option' | 'recent' | 'recovery',
    ) => {
      const isActive = idx === activeIdx;
      const isSelected = option.value === value;
      return (
        <div
          key={`${variant}-${option.value}`}
          id={`${acId}-opt-${idx}`}
          role="option"
          aria-selected={isSelected}
          aria-disabled={option.disabled || undefined}
          data-idx={idx}
          className={[
            styles.option,
            isActive ? styles.optionActive : '',
            isSelected ? styles.optionSelected : '',
            option.disabled ? styles.optionDisabled : '',
            variant === 'recovery' ? styles.optionRecovery : '',
          ]
            .filter(Boolean)
            .join(' ')}
          onClick={() => commitOption(option)}
          onMouseEnter={() => !option.disabled && setActiveIdx(idx)}
        >
          {renderOption ? (
            renderOption(option, { active: isActive, query: trimmed })
          ) : (
            <>
              {variant === 'recent' && (
                <span className={styles.optionIcon} aria-hidden="true">
                  <ClockIcon />
                </span>
              )}
              {variant !== 'recent' && option.icon && (
                <span className={styles.optionIcon} aria-hidden="true">
                  {option.icon}
                </span>
              )}
              <span className={styles.optionLabel}>
                <span className={styles.optionTitle}>
                  {highlightMatch && variant === 'option'
                    ? highlightLabel(option.label, trimmed)
                    : option.label}
                </span>
                {option.description && (
                  <span className={styles.optionDesc}>{option.description}</span>
                )}
              </span>
              {isSelected && (
                <span className={styles.check} aria-hidden="true">
                  <CheckIcon />
                </span>
              )}
            </>
          )}
        </div>
      );
    };

    return (
      <div
        ref={wrapperRef}
        className={[
          styles.field,
          fullWidth ? styles.fullWidth : '',
          disabled ? styles.disabled : '',
          className,
        ]
          .filter(Boolean)
          .join(' ')}
      >
        {label && (
          <label htmlFor={acId} className={styles.label}>
            {label}
          </label>
        )}

        <div className={styles.acWrapper}>
          <div
            className={[
              styles.inputWrapper,
              sizeClass,
              open ? styles.open : '',
              error ? styles.hasError : '',
            ]
              .filter(Boolean)
              .join(' ')}
          >
            <span className={styles.searchIconWrap} aria-hidden="true">
              <SearchIcon />
            </span>

            <input
              {...rest}
              ref={setInputRef}
              id={acId}
              type="text"
              role="combobox"
              autoComplete="off"
              aria-autocomplete="list"
              aria-expanded={open}
              aria-controls={listId}
              aria-activedescendant={activeId}
              aria-invalid={!!error || undefined}
              aria-describedby={
                error ? `${acId}-error` : helperText ? `${acId}-helper` : undefined
              }
              className={styles.input}
              placeholder={placeholder}
              value={inputText}
              disabled={disabled}
              onChange={handleInput}
              onKeyDown={handleKeyDown}
              onFocus={() => openOnFocus && !disabled && setOpen(true)}
            />

            <span className={styles.actions}>
              {loading && (
                <span className={styles.statusIcon} aria-hidden="true">
                  <SpinnerIcon />
                </span>
              )}
              {clearable && !disabled && (inputText.length > 0 || value) && (
                <button
                  type="button"
                  tabIndex={-1}
                  aria-label="Clear"
                  className={styles.clearBtn}
                  onClick={handleClear}
                  onMouseDown={(e) => e.preventDefault()}
                >
                  <ClearIcon />
                </button>
              )}
            </span>
          </div>

          {open && (
            <div
              className={styles.menu}
              role="listbox"
              id={listId}
              aria-label={label ?? 'Suggestions'}
            >
              {loading ? (
                <div className={styles.statusRow}>
                  <SpinnerIcon />
                  <span>Loading…</span>
                </div>
              ) : belowMin ? (
                <div className={styles.empty}>
                  Type {minChars - trimmed.length} more character
                  {minChars - trimmed.length === 1 ? '' : 's'}…
                </div>
              ) : recovery ? (
                /* 🆕 Smart Recovery — nearest match instead of a dead end. */
                <div className={styles.recoveryBox}>
                  <div className={styles.sectionHeader}>
                    <SparkIcon />
                    <span>
                      No exact match — did you mean
                      {recovery.distance === 1 ? ' this' : ''}?
                    </span>
                  </div>
                  <div className={styles.list} ref={listRef} role="presentation">
                    {renderRow(recovery.option, 0, 'recovery')}
                  </div>
                </div>
              ) : navItems.length > 0 ? (
                <>
                  {showRecents && (
                    <div className={styles.sectionHeader}>
                      <ClockIcon />
                      <span>{recentsCfg!.label}</span>
                    </div>
                  )}
                  <div className={styles.list} ref={listRef} role="presentation">
                    {navItems.map((opt, idx) =>
                      renderRow(opt, idx, showRecents ? 'recent' : 'option'),
                    )}
                  </div>
                </>
              ) : trimmed.length === 0 ? (
                <div className={styles.empty}>Type to search…</div>
              ) : (
                <div className={styles.empty}>{emptyMessage}</div>
              )}
            </div>
          )}

          {name && <input type="hidden" name={name} value={value ?? ''} />}
        </div>

        {error && (
          <p id={`${acId}-error`} className={styles.errorText}>
            {error}
          </p>
        )}
        {!error && helperText && (
          <p id={`${acId}-helper`} className={styles.helperText}>
            {helperText}
          </p>
        )}
      </div>
    );
  },
);

EvoAutoComplete.displayName = 'EvoAutoComplete';
