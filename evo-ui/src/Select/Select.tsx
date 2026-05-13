import React, { useCallback, useEffect, useId, useRef, useState } from 'react';
import styles from '../css/select.module.scss';

export interface SelectOption {
  value: string;
  label: string;
  description?: string;
  icon?: React.ReactNode;
  disabled?: boolean;
}

export interface EvoSelectProps {
  label?: string;
  options: SelectOption[];
  placeholder?: string;
  helperText?: string;
  error?: string;
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  searchable?: boolean;
  clearable?: boolean;
  id?: string;
  name?: string;
  className?: string;
}

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

export const EvoSelect = ({
  label,
  options,
  placeholder = 'Select an option',
  helperText,
  error,
  size = 'md',
  fullWidth = false,
  value: controlledValue,
  defaultValue = '',
  onChange,
  disabled = false,
  searchable = false,
  clearable = false,
  id,
  name,
  className = '',
}: EvoSelectProps) => {
  const reactId = useId();
  const selectId = id ?? `evo-select-${reactId}`;
  const listId = `${selectId}-listbox`;

  const isControlled = controlledValue !== undefined;
  const [internalValue, setInternalValue] = useState(defaultValue);
  const value = isControlled ? controlledValue : internalValue;

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

  const selectedOption = options.find(o => o.value === value);

  const setValue = useCallback((next: string) => {
    if (!isControlled) setInternalValue(next);
    onChange?.(next);
  }, [isControlled, onChange]);

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
      const sel = filtered.findIndex(o => o.value === value);
      setActiveIdx(sel >= 0 ? sel : filtered.findIndex(o => !o.disabled));
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
        setValue(opt.value);
        setOpen(false);
        triggerRef.current?.focus();
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
    setValue(opt.value);
    setOpen(false);
    triggerRef.current?.focus();
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    setValue('');
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
          disabled={disabled}
          className={[
            styles.trigger,
            styles[size],
            open ? styles.open : '',
            error ? styles.hasError : '',
          ].filter(Boolean).join(' ')}
          onClick={() => !disabled && setOpen(o => !o)}
          onKeyDown={handleKeyDown}
        >
          <span className={selectedOption ? styles.triggerValue : styles.triggerPlaceholder}>
            {selectedOption?.icon && (
              <span className={styles.triggerIcon}>{selectedOption.icon}</span>
            )}
            <span className={styles.triggerText}>
              {selectedOption?.label ?? placeholder}
            </span>
          </span>

          <span className={styles.triggerActions}>
            {clearable && value && !disabled && (
              <span
                role="button"
                tabIndex={-1}
                aria-label="Clear selection"
                className={styles.clearBtn}
                onClick={handleClear}
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

            <div className={styles.list} ref={listRef} role="presentation">
              {filtered.length === 0 ? (
                <div className={styles.empty}>No results</div>
              ) : (
                filtered.map((opt, idx) => {
                  const isSelected = opt.value === value;
                  const isActive = idx === activeIdx;
                  return (
                    <div
                      key={opt.value}
                      id={`${selectId}-opt-${idx}`}
                      role="option"
                      aria-selected={isSelected}
                      aria-disabled={opt.disabled}
                      data-idx={idx}
                      className={[
                        styles.option,
                        isSelected ? styles.optionSelected : '',
                        isActive ? styles.optionActive : '',
                        opt.disabled ? styles.optionDisabled : '',
                      ].filter(Boolean).join(' ')}
                      onClick={() => handleSelect(opt)}
                      onMouseEnter={() => !opt.disabled && setActiveIdx(idx)}
                    >
                      {opt.icon && <span className={styles.optionIcon}>{opt.icon}</span>}
                      <span className={styles.optionLabel}>
                        <span className={styles.optionTitle}>{opt.label}</span>
                        {opt.description && (
                          <span className={styles.optionDesc}>{opt.description}</span>
                        )}
                      </span>
                      <span className={styles.check} aria-hidden>
                        {isSelected && <CheckIcon />}
                      </span>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {name && <input type="hidden" name={name} value={value} />}
      </div>

      {error && <p className={styles.errorText}>{error}</p>}
      {!error && helperText && <p className={styles.helperText}>{helperText}</p>}
    </div>
  );
};
