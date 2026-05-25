import React, { useCallback, useEffect, useId, useRef, useState } from 'react';
import styles from '../css/select.module.scss';

export interface SelectOption {
  value: string;
  label: string;
  description?: string;
  icon?: React.ReactNode;
  disabled?: boolean;
}

interface EvoSelectBaseProps {
  label?: string;
  options: SelectOption[];
  placeholder?: string;
  helperText?: string;
  error?: string;
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  disabled?: boolean;
  searchable?: boolean;
  clearable?: boolean;
  id?: string;
  name?: string;
  className?: string;
}

export interface EvoSelectSingleProps extends EvoSelectBaseProps {
  multiple?: false;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
}

export interface EvoSelectMultipleProps extends EvoSelectBaseProps {
  multiple: true;
  value?: string[];
  defaultValue?: string[];
  onChange?: (value: string[]) => void;
  /** How the trigger displays selected items. Defaults to 'chips'. */
  multipleDisplay?: 'chips' | 'count';
  /** Maximum number of options that can be selected at once. */
  maxSelections?: number;
  /** Show Select-all / Clear-all buttons at the top of the menu. */
  showSelectAll?: boolean;
}

export type EvoSelectProps = EvoSelectSingleProps | EvoSelectMultipleProps;

const ChevronIcon = () => (
  <svg viewBox="0 0 16 16" width="14" height="14" fill="none" aria-hidden="true">
    <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const CheckIcon = () => (
  <svg viewBox="0 0 16 16" width="14" height="14" fill="none" aria-hidden="true">
    <path d="M3.5 8.5l3 3 6-7" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ClearIcon = () => (
  <svg viewBox="0 0 16 16" width="12" height="12" fill="none" aria-hidden="true">
    <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
  </svg>
);

const SearchIcon = () => (
  <svg viewBox="0 0 16 16" width="14" height="14" fill="none" aria-hidden="true">
    <circle cx="7" cy="7" r="4.5" stroke="currentColor" strokeWidth="1.5" />
    <path d="M10.5 10.5L13 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

export const EvoSelect = (props: EvoSelectProps) => {
  const {
    label,
    options,
    placeholder = 'Select an option',
    helperText,
    error,
    size = 'md',
    fullWidth = false,
    disabled = false,
    searchable = false,
    clearable = false,
    id,
    name,
    className = '',
  } = props;

  const isMultiple = props.multiple === true;
  const multipleDisplay = isMultiple ? (props.multipleDisplay ?? 'chips') : 'chips';
  const maxSelections = isMultiple ? props.maxSelections : undefined;
  const showSelectAll = isMultiple ? (props.showSelectAll ?? false) : false;

  const reactId = useId();
  const selectId = id ?? `evo-select-${reactId}`;
  const listId = `${selectId}-listbox`;

  const controlledValue = props.value as string | string[] | undefined;
  const defaultValue = props.defaultValue as string | string[] | undefined;

  const isControlled = controlledValue !== undefined;
  const initial: string | string[] = isMultiple
    ? (Array.isArray(defaultValue) ? defaultValue : [])
    : (typeof defaultValue === 'string' ? defaultValue : '');
  const [internalValue, setInternalValue] = useState<string | string[]>(initial);
  const value = isControlled ? controlledValue! : internalValue;

  const selectedValues: string[] = isMultiple
    ? (Array.isArray(value) ? value : [])
    : (typeof value === 'string' && value ? [value] : []);

  const [open, setOpen] = useState(false);
  const [activeIdx, setActiveIdx] = useState(-1);
  const [query, setQuery] = useState('');

  const wrapperRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const filtered = searchable && query
    ? options.filter(o => o.label.toLowerCase().includes(query.toLowerCase()))
    : options;

  const selectedOption = !isMultiple
    ? options.find(o => o.value === value)
    : undefined;

  const selectedOptions = isMultiple
    ? options.filter(o => selectedValues.includes(o.value))
    : [];

  const atMax = isMultiple && maxSelections !== undefined && selectedValues.length >= maxSelections;

  const emit = useCallback((next: string | string[]) => {
    if (!isControlled) setInternalValue(next);
    if (isMultiple) {
      (props.onChange as ((v: string[]) => void) | undefined)?.(next as string[]);
    } else {
      (props.onChange as ((v: string) => void) | undefined)?.(next as string);
    }
  }, [isControlled, isMultiple, props.onChange]);

  const toggleValue = useCallback((v: string) => {
    if (isMultiple) {
      const current = Array.isArray(value) ? value : [];
      if (current.includes(v)) {
        emit(current.filter(x => x !== v));
      } else {
        if (maxSelections !== undefined && current.length >= maxSelections) return;
        emit([...current, v]);
      }
    } else {
      emit(v);
    }
  }, [emit, isMultiple, maxSelections, value]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (!wrapperRef.current?.contains(e.target as Node)) {
        setOpen(false);
        setQuery('');
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  useEffect(() => {
    if (open) {
      const firstSelectedIdx = filtered.findIndex(o => selectedValues.includes(o.value));
      setActiveIdx(firstSelectedIdx >= 0 ? firstSelectedIdx : filtered.findIndex(o => !o.disabled));
      if (searchable) {
        const t = setTimeout(() => searchRef.current?.focus(), 30);
        return () => clearTimeout(t);
      }
    } else {
      setQuery('');
      setActiveIdx(-1);
    }
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!open || activeIdx < 0) return;
    const el = listRef.current?.querySelector(`[data-idx="${activeIdx}"]`) as HTMLElement | null;
    el?.scrollIntoView({ block: 'nearest' });
  }, [activeIdx, open]);

  const moveActive = (dir: 1 | -1) => {
    if (filtered.length === 0) return;
    let next = activeIdx;
    for (let i = 0; i < filtered.length; i++) {
      next = (next + dir + filtered.length) % filtered.length;
      if (!filtered[next].disabled) {
        setActiveIdx(next);
        return;
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;

    if (!open) {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        setOpen(true);
      }
      return;
    }

    if (e.key === 'Escape') {
      e.preventDefault();
      setOpen(false);
      triggerRef.current?.focus();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      moveActive(1);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      moveActive(-1);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const opt = filtered[activeIdx];
      if (opt && !opt.disabled) {
        const isSelected = selectedValues.includes(opt.value);
        if (!isSelected && atMax) return;
        toggleValue(opt.value);
        if (!isMultiple) {
          setOpen(false);
          triggerRef.current?.focus();
        }
      }
    } else if (e.key === 'Home') {
      e.preventDefault();
      const idx = filtered.findIndex(o => !o.disabled);
      if (idx >= 0) setActiveIdx(idx);
    } else if (e.key === 'End') {
      e.preventDefault();
      for (let i = filtered.length - 1; i >= 0; i--) {
        if (!filtered[i].disabled) { setActiveIdx(i); break; }
      }
    } else if (e.key === 'Tab') {
      setOpen(false);
    }
  };

  const handleSelect = (opt: SelectOption) => {
    if (opt.disabled) return;
    const isSelected = selectedValues.includes(opt.value);
    if (!isSelected && atMax) return;
    toggleValue(opt.value);
    if (!isMultiple) {
      setOpen(false);
      triggerRef.current?.focus();
    }
  };

  const handleClearAll = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isMultiple) emit([]);
    else emit('');
  };

  const handleRemoveChip = (e: React.MouseEvent, v: string) => {
    e.stopPropagation();
    if (!isMultiple) return;
    const current = Array.isArray(value) ? value : [];
    emit(current.filter(x => x !== v));
  };

  const handleSelectAll = () => {
    if (!isMultiple) return;
    const selectable = filtered.filter(o => !o.disabled).map(o => o.value);
    const merged = Array.from(new Set([...(Array.isArray(value) ? value : []), ...selectable]));
    const limited = maxSelections !== undefined ? merged.slice(0, maxSelections) : merged;
    emit(limited);
  };

  const hasSelection = isMultiple ? selectedValues.length > 0 : !!value;

  const renderTriggerContent = () => {
    if (!hasSelection) {
      return (
        <span className={styles.triggerPlaceholder}>
          <span className={styles.triggerText}>{placeholder}</span>
        </span>
      );
    }

    if (!isMultiple) {
      return (
        <span className={styles.triggerValue}>
          {selectedOption?.icon && (
            <span className={styles.triggerIcon}>{selectedOption.icon}</span>
          )}
          <span className={styles.triggerText}>{selectedOption?.label}</span>
        </span>
      );
    }

    if (multipleDisplay === 'count') {
      const first = selectedOptions[0]?.label ?? '';
      const more = selectedOptions.length - 1;
      return (
        <span className={styles.triggerValue}>
          <span className={styles.triggerText}>
            {first}{more > 0 && <span className={styles.countMore}>, +{more} more</span>}
          </span>
        </span>
      );
    }

    return (
      <span className={styles.chipRow}>
        {selectedOptions.map(opt => (
          <span key={opt.value} className={styles.chip}>
            {opt.icon && <span className={styles.chipIcon}>{opt.icon}</span>}
            <span className={styles.chipLabel}>{opt.label}</span>
            {!disabled && (
              <span
                role="button"
                tabIndex={-1}
                aria-label={`Remove ${opt.label}`}
                className={styles.chipRemove}
                onClick={(e) => handleRemoveChip(e, opt.value)}
                onMouseDown={(e) => e.preventDefault()}
              >
                <ClearIcon />
              </span>
            )}
          </span>
        ))}
      </span>
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
      ].filter(Boolean).join(' ')}
    >
      {label && (
        <label htmlFor={selectId} className={styles.label}>
          {label}
        </label>
      )}

      <div className={styles.selectWrapper}>
        <button
          ref={triggerRef}
          id={selectId}
          type="button"
          role="combobox"
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-controls={listId}
          aria-invalid={!!error}
          aria-multiselectable={isMultiple || undefined}
          disabled={disabled}
          className={[
            styles.trigger,
            styles[size],
            open ? styles.open : '',
            error ? styles.hasError : '',
            isMultiple && multipleDisplay === 'chips' && selectedValues.length > 0 ? styles.triggerChips : '',
          ].filter(Boolean).join(' ')}
          onClick={() => !disabled && setOpen(o => !o)}
          onKeyDown={handleKeyDown}
        >
          {renderTriggerContent()}

          <span className={styles.triggerActions}>
            {clearable && hasSelection && !disabled && (
              <span
                role="button"
                tabIndex={-1}
                aria-label="Clear selection"
                className={styles.clearBtn}
                onClick={handleClearAll}
                onMouseDown={(e) => e.preventDefault()}
              >
                <ClearIcon />
              </span>
            )}
            <span className={[styles.chevron, open ? styles.chevronOpen : ''].filter(Boolean).join(' ')}>
              <ChevronIcon />
            </span>
          </span>
        </button>

        {open && (
          <div
            className={styles.menu}
            role="listbox"
            id={listId}
            aria-labelledby={selectId}
            aria-multiselectable={isMultiple || undefined}
            aria-activedescendant={activeIdx >= 0 ? `${selectId}-opt-${activeIdx}` : undefined}
          >
            {searchable && (
              <div className={styles.searchRow}>
                <span className={styles.searchIconWrap}><SearchIcon /></span>
                <input
                  ref={searchRef}
                  type="text"
                  className={styles.searchInput}
                  placeholder="Search..."
                  value={query}
                  onChange={(e) => { setQuery(e.target.value); setActiveIdx(0); }}
                  onKeyDown={handleKeyDown}
                />
              </div>
            )}

            {isMultiple && showSelectAll && filtered.length > 0 && (
              <div className={styles.bulkRow}>
                <button
                  type="button"
                  className={styles.bulkBtn}
                  onClick={handleSelectAll}
                  disabled={maxSelections !== undefined && selectedValues.length >= maxSelections}
                >
                  Select all
                </button>
                <button
                  type="button"
                  className={styles.bulkBtn}
                  onClick={() => emit([])}
                  disabled={selectedValues.length === 0}
                >
                  Clear all
                </button>
                {maxSelections !== undefined && (
                  <span className={styles.bulkCount}>
                    {selectedValues.length} / {maxSelections}
                  </span>
                )}
              </div>
            )}

            <div className={styles.list} ref={listRef} role="presentation">
              {filtered.length === 0 ? (
                <div className={styles.empty}>No results</div>
              ) : (
                filtered.map((opt, idx) => {
                  const isSelected = selectedValues.includes(opt.value);
                  const isActive = idx === activeIdx;
                  const reachedMax = !isSelected && atMax;
                  const rowDisabled = opt.disabled || reachedMax;
                  return (
                    <div
                      key={opt.value}
                      id={`${selectId}-opt-${idx}`}
                      role="option"
                      aria-selected={isSelected}
                      aria-disabled={rowDisabled}
                      data-idx={idx}
                      className={[
                        styles.option,
                        isSelected ? styles.optionSelected : '',
                        isActive ? styles.optionActive : '',
                        rowDisabled ? styles.optionDisabled : '',
                      ].filter(Boolean).join(' ')}
                      onClick={() => !rowDisabled && handleSelect(opt)}
                      onMouseEnter={() => !rowDisabled && setActiveIdx(idx)}
                    >
                      {isMultiple && (
                        <span
                          className={[styles.checkbox, isSelected ? styles.checkboxChecked : ''].filter(Boolean).join(' ')}
                          aria-hidden="true"
                        >
                          {isSelected && <CheckIcon />}
                        </span>
                      )}
                      {opt.icon && <span className={styles.optionIcon}>{opt.icon}</span>}
                      <span className={styles.optionLabel}>
                        <span className={styles.optionTitle}>{opt.label}</span>
                        {opt.description && (
                          <span className={styles.optionDesc}>{opt.description}</span>
                        )}
                      </span>
                      {!isMultiple && (
                        <span className={styles.check} aria-hidden>
                          {isSelected && <CheckIcon />}
                        </span>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {name && !isMultiple && <input type="hidden" name={name} value={value as string} />}
        {name && isMultiple && selectedValues.map(v => (
          <input key={v} type="hidden" name={name} value={v} />
        ))}
      </div>

      {error && <p className={styles.errorText}>{error}</p>}
      {!error && helperText && <p className={styles.helperText}>{helperText}</p>}
    </div>
  );
};
