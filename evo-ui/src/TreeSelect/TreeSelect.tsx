import React, { forwardRef, useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import { useAnchoredPosition } from '../hooks/useAnchoredPosition';
import styles from '../css/treeselect.module.scss';

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

/* ---------------- Types ---------------- */

export interface TreeNode {
  value: string;
  label: string;
  description?: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  children?: TreeNode[];
  /** Marks a node as having children that should be loaded via `loadChildren`. */
  isLeaf?: boolean;
}

export type CheckedStrategy = 'leaf' | 'parent' | 'all';

export interface EvoTreeSelectProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue'> {
  data: TreeNode[];

  /** Controlled value. String for single-select, string[] for multi-select. */
  value?: string | string[];
  defaultValue?: string | string[];
  onChange?: (value: string | string[], nodes: TreeNode | TreeNode[] | null) => void;

  /** Show checkboxes and allow selecting multiple nodes. */
  multiple?: boolean;
  /** When multi-select, decouple parent/child checking (no cascade). */
  checkStrictly?: boolean;
  /** How values returned by onChange are filtered when cascading. */
  checkedStrategy?: CheckedStrategy;

  /** Expanded node values (controlled). */
  expandedKeys?: string[];
  defaultExpandedKeys?: string[];
  onExpandedChange?: (keys: string[]) => void;
  /** Expand every node by default on first open. */
  defaultExpandAll?: boolean;

  /** Async children loader: called the first time a node with `isLeaf === false` is expanded. */
  loadChildren?: (node: TreeNode) => Promise<TreeNode[]>;

  /** Show an in-menu search field. */
  searchable?: boolean;
  filter?: (node: TreeNode, query: string) => boolean;

  /** Max number of chips shown before collapsing into "+N". */
  maxTagCount?: number;

  label?: string;
  placeholder?: string;
  helperText?: string;
  error?: string;
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  disabled?: boolean;
  clearable?: boolean;

  id?: string;
  name?: string;
  className?: string;
}

/* ---------------- Icons ---------------- */

const ChevronDown = () => (
  <svg viewBox="0 0 16 16" width="14" height="14" fill="none" aria-hidden="true">
    <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ChevronRight = () => (
  <svg viewBox="0 0 16 16" width="10" height="10" fill="none" aria-hidden="true">
    <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const CheckIcon = () => (
  <svg viewBox="0 0 16 16" width="12" height="12" fill="none" aria-hidden="true">
    <path d="M3.5 8.5l3 3 6-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const MinusIcon = () => (
  <svg viewBox="0 0 16 16" width="10" height="10" fill="none" aria-hidden="true">
    <path d="M4 8h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
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

/* ---------------- Helpers ---------------- */

interface NodeMaps {
  nodeByValue: Map<string, TreeNode>;
  parentByValue: Map<string, string | null>;
  leafValues: Set<string>;
}

const buildMaps = (data: TreeNode[]): NodeMaps => {
  const nodeByValue = new Map<string, TreeNode>();
  const parentByValue = new Map<string, string | null>();
  const leafValues = new Set<string>();

  const walk = (nodes: TreeNode[], parent: string | null) => {
    for (const n of nodes) {
      nodeByValue.set(n.value, n);
      parentByValue.set(n.value, parent);
      if (!n.children || n.children.length === 0) {
        if (n.isLeaf !== false) leafValues.add(n.value);
      } else {
        walk(n.children, n.value);
      }
    }
  };
  walk(data, null);
  return { nodeByValue, parentByValue, leafValues };
};

const collectDescendantLeaves = (node: TreeNode, acc: string[] = []): string[] => {
  if (!node.children || node.children.length === 0) {
    acc.push(node.value);
    return acc;
  }
  for (const c of node.children) collectDescendantLeaves(c, acc);
  return acc;
};

const collectAllDescendants = (node: TreeNode, acc: string[] = []): string[] => {
  acc.push(node.value);
  if (node.children) for (const c of node.children) collectAllDescendants(c, acc);
  return acc;
};

/** Compute filter result: keep matched nodes + all ancestors. */
const filterTree = (
  data: TreeNode[],
  query: string,
  matcher: (n: TreeNode, q: string) => boolean,
): { visible: Set<string>; matched: Set<string> } => {
  const visible = new Set<string>();
  const matched = new Set<string>();

  const walk = (nodes: TreeNode[], ancestors: string[]): boolean => {
    let anyChildMatch = false;
    for (const n of nodes) {
      const isMatch = matcher(n, query);
      const childMatch = n.children ? walk(n.children, [...ancestors, n.value]) : false;
      if (isMatch || childMatch) {
        visible.add(n.value);
        ancestors.forEach(a => visible.add(a));
        anyChildMatch = true;
        if (isMatch) matched.add(n.value);
      }
    }
    return anyChildMatch;
  };
  walk(data, []);
  return { visible, matched };
};

const defaultFilter = (node: TreeNode, q: string) =>
  node.label.toLowerCase().includes(q.toLowerCase());

/** Highlight matched substring inside a label. */
const renderHighlighted = (label: string, query: string) => {
  if (!query) return label;
  const idx = label.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return label;
  return (
    <>
      {label.slice(0, idx)}
      <span className={styles.match}>{label.slice(idx, idx + query.length)}</span>
      {label.slice(idx + query.length)}
    </>
  );
};

/* ---------------- Component ---------------- */

export const EvoTreeSelect = forwardRef<HTMLDivElement, EvoTreeSelectProps>(({
  data,
  value: controlledValue,
  defaultValue,
  onChange,
  multiple = false,
  checkStrictly = false,
  checkedStrategy = 'leaf',
  expandedKeys: controlledExpanded,
  defaultExpandedKeys,
  onExpandedChange,
  defaultExpandAll = false,
  loadChildren,
  searchable = false,
  filter = defaultFilter,
  maxTagCount = 3,
  label,
  placeholder = multiple ? 'Select items' : 'Select an item',
  helperText,
  error,
  size = 'md',
  fullWidth = false,
  disabled = false,
  clearable = false,
  id,
  name,
  className = '',
  ...rest
}, ref) => {
  const reactId = useId();
  const selectId = id ?? `evo-tree-${reactId}`;
  const listId = `${selectId}-tree`;

  /* -------- Value state -------- */
  const isControlled = controlledValue !== undefined;
  const initial: string[] = useMemo(() => {
    const init = isControlled ? controlledValue : defaultValue;
    if (init == null) return [];
    return Array.isArray(init) ? init : [init];
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  const [internalValues, setInternalValues] = useState<string[]>(initial);

  const values: string[] = useMemo(() => {
    if (!isControlled) return internalValues;
    if (controlledValue == null) return [];
    return Array.isArray(controlledValue) ? controlledValue : [controlledValue];
  }, [isControlled, controlledValue, internalValues]);

  /* -------- Lazy-loaded children + dynamic data -------- */
  const [dynamicChildren, setDynamicChildren] = useState<Record<string, TreeNode[]>>({});
  const [loadingNodes, setLoadingNodes] = useState<Set<string>>(new Set());

  /** A view of `data` with any lazily-loaded children merged in. */
  const mergedData = useMemo(() => {
    if (Object.keys(dynamicChildren).length === 0) return data;
    const inject = (nodes: TreeNode[]): TreeNode[] =>
      nodes.map(n => {
        const loaded = dynamicChildren[n.value];
        const children = loaded ?? n.children;
        return children ? { ...n, children: inject(children) } : n;
      });
    return inject(data);
  }, [data, dynamicChildren]);

  const maps = useMemo(() => buildMaps(mergedData), [mergedData]);

  /* -------- Expanded state -------- */
  const initialExpanded = useMemo(() => {
    if (controlledExpanded) return controlledExpanded;
    if (defaultExpandedKeys) return defaultExpandedKeys;
    if (defaultExpandAll) {
      const all: string[] = [];
      const walk = (nodes: TreeNode[]) => nodes.forEach(n => {
        if (n.children && n.children.length) { all.push(n.value); walk(n.children); }
      });
      walk(data);
      return all;
    }
    return [];
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  const [internalExpanded, setInternalExpanded] = useState<string[]>(initialExpanded);
  const expanded = controlledExpanded ?? internalExpanded;
  const expandedSet = useMemo(() => new Set(expanded), [expanded]);

  const setExpanded = useCallback((next: string[]) => {
    if (controlledExpanded === undefined) setInternalExpanded(next);
    onExpandedChange?.(next);
  }, [controlledExpanded, onExpandedChange]);

  /* -------- Open / focus / search -------- */
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [activeIdx, setActiveIdx] = useState(-1);

  const wrapperRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const { floatingRef, floatingStyles, placement } = useAnchoredPosition({
    open,
    anchorRef: triggerRef,
    placement: 'bottom',
    offset: 6,
    matchAnchorWidth: true,
  });

  /* -------- Filter (search) -------- */
  const filterResult = useMemo(() => {
    if (!searchable || !query.trim()) return null;
    return filterTree(mergedData, query, filter);
  }, [mergedData, query, searchable, filter]);

  /* When searching, auto-expand everything visible so matches are reachable. */
  const effectiveExpanded = useMemo(() => {
    if (filterResult) return filterResult.visible;
    return expandedSet;
  }, [filterResult, expandedSet]);

  /* -------- Flatten for keyboard nav -------- */
  interface FlatRow { node: TreeNode; level: number; hasChildren: boolean }
  const flat: FlatRow[] = useMemo(() => {
    const rows: FlatRow[] = [];
    const walk = (nodes: TreeNode[], level: number) => {
      for (const n of nodes) {
        if (filterResult && !filterResult.visible.has(n.value)) continue;
        const hasChildren =
          (n.children && n.children.length > 0) || n.isLeaf === false;
        rows.push({ node: n, level, hasChildren });
        if (hasChildren && effectiveExpanded.has(n.value) && n.children) {
          walk(n.children, level + 1);
        }
      }
    };
    walk(mergedData, 0);
    return rows;
  }, [mergedData, effectiveExpanded, filterResult]);

  /* -------- Selection helpers (cascade tri-state) -------- */
  type CheckState = 'checked' | 'mixed' | 'unchecked';

  const valueSet = useMemo(() => new Set(values), [values]);

  const checkStateFor = useCallback((node: TreeNode): CheckState => {
    if (!multiple || checkStrictly || !node.children || node.children.length === 0) {
      return valueSet.has(node.value) ? 'checked' : 'unchecked';
    }
    const leaves = collectDescendantLeaves(node);
    if (leaves.length === 0) return valueSet.has(node.value) ? 'checked' : 'unchecked';
    let checked = 0;
    for (const l of leaves) if (valueSet.has(l)) checked++;
    if (checked === 0) return 'unchecked';
    if (checked === leaves.length) return 'checked';
    return 'mixed';
  }, [multiple, checkStrictly, valueSet]);

  /** Returned value, filtered to caller's strategy preference. */
  const projectValue = useCallback((rawLeaves: Set<string>): string[] => {
    if (!multiple || checkStrictly) return Array.from(rawLeaves);
    if (checkedStrategy === 'leaf') {
      return Array.from(rawLeaves).filter(v => maps.leafValues.has(v));
    }
    if (checkedStrategy === 'all') {
      // Add any fully-checked parents to the leaf set.
      const out = new Set(rawLeaves);
      const walk = (nodes: TreeNode[]) => {
        for (const n of nodes) {
          if (n.children && n.children.length) {
            walk(n.children);
            const leaves = collectDescendantLeaves(n);
            if (leaves.every(l => rawLeaves.has(l))) out.add(n.value);
          }
        }
      };
      walk(mergedData);
      return Array.from(out);
    }
    // 'parent': collapse fully-checked subtrees to their topmost parent
    const result: string[] = [];
    const walk = (nodes: TreeNode[]) => {
      for (const n of nodes) {
        if (n.children && n.children.length) {
          const leaves = collectDescendantLeaves(n);
          if (leaves.every(l => rawLeaves.has(l))) {
            result.push(n.value);
          } else {
            walk(n.children);
          }
        } else if (rawLeaves.has(n.value)) {
          result.push(n.value);
        }
      }
    };
    walk(mergedData);
    return result;
  }, [multiple, checkStrictly, checkedStrategy, mergedData, maps.leafValues]);

  const commitMulti = useCallback((nextRawLeaves: Set<string>) => {
    const projected = projectValue(nextRawLeaves);
    if (!isControlled) setInternalValues(projected);
    const nodes = projected.map(v => maps.nodeByValue.get(v)).filter(Boolean) as TreeNode[];
    onChange?.(projected, nodes);
  }, [projectValue, isControlled, maps.nodeByValue, onChange]);

  const commitSingle = useCallback((nextValue: string) => {
    if (!isControlled) setInternalValues(nextValue ? [nextValue] : []);
    onChange?.(nextValue, nextValue ? maps.nodeByValue.get(nextValue) ?? null : null);
  }, [isControlled, maps.nodeByValue, onChange]);

  /** Translate the current `values` into a "raw leaf set" for cascade math. */
  const rawLeafSet = useMemo(() => {
    if (!multiple || checkStrictly) return new Set(values);
    const out = new Set<string>();
    for (const v of values) {
      const node = maps.nodeByValue.get(v);
      if (!node) { out.add(v); continue; }
      if (!node.children || node.children.length === 0) {
        out.add(v);
      } else {
        collectDescendantLeaves(node).forEach(l => out.add(l));
      }
    }
    return out;
  }, [values, multiple, checkStrictly, maps.nodeByValue]);

  /* -------- Toggle handlers -------- */
  const toggleExpand = useCallback((node: TreeNode) => {
    const isOpen = expandedSet.has(node.value);
    if (isOpen) {
      setExpanded(expanded.filter(k => k !== node.value));
      return;
    }
    setExpanded([...expanded, node.value]);
    // Lazy load
    const hasUnloaded = loadChildren && !dynamicChildren[node.value]
      && (node.isLeaf === false || (!node.children && node.isLeaf !== true));
    if (hasUnloaded) {
      setLoadingNodes(s => new Set(s).add(node.value));
      loadChildren!(node).then(kids => {
        setDynamicChildren(prev => ({ ...prev, [node.value]: kids }));
      }).finally(() => {
        setLoadingNodes(s => {
          const ns = new Set(s); ns.delete(node.value); return ns;
        });
      });
    }
  }, [expanded, expandedSet, setExpanded, loadChildren, dynamicChildren]);

  const handleSelect = useCallback((node: TreeNode) => {
    if (node.disabled) return;

    if (!multiple) {
      commitSingle(node.value);
      setOpen(false);
      triggerRef.current?.focus();
      return;
    }

    // Multi-select with checkboxes
    if (checkStrictly) {
      const next = new Set(values);
      if (next.has(node.value)) next.delete(node.value);
      else next.add(node.value);
      const arr = Array.from(next);
      if (!isControlled) setInternalValues(arr);
      const nodes = arr.map(v => maps.nodeByValue.get(v)).filter(Boolean) as TreeNode[];
      onChange?.(arr, nodes);
      return;
    }

    // Cascade
    const nextRaw = new Set(rawLeafSet);
    const state = checkStateFor(node);
    const targets = node.children && node.children.length
      ? collectDescendantLeaves(node)
      : [node.value];
    if (state === 'checked') {
      targets.forEach(t => nextRaw.delete(t));
    } else {
      targets.forEach(t => nextRaw.add(t));
    }
    commitMulti(nextRaw);
  }, [
    multiple, checkStrictly, values, rawLeafSet,
    checkStateFor, commitMulti, commitSingle,
    isControlled, maps.nodeByValue, onChange,
  ]);

  /* -------- Open / close lifecycle -------- */
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      const t = e.target as Node;
      if (!wrapperRef.current?.contains(t) && !floatingRef.current?.contains(t)) {
        setOpen(false);
        setQuery('');
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  useEffect(() => {
    if (open) {
      // Start cursor on first visible row or first selection.
      const firstSelected = flat.findIndex(r => valueSet.has(r.node.value));
      setActiveIdx(firstSelected >= 0 ? firstSelected : flat.findIndex(r => !r.node.disabled));
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

  /* -------- Keyboard navigation -------- */
  const moveActive = (dir: 1 | -1) => {
    if (flat.length === 0) return;
    let next = activeIdx;
    for (let i = 0; i < flat.length; i++) {
      next = (next + dir + flat.length) % flat.length;
      if (!flat[next].node.disabled) { setActiveIdx(next); return; }
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

    const row = flat[activeIdx];

    if (e.key === 'Escape') {
      e.preventDefault();
      setOpen(false);
      triggerRef.current?.focus();
    } else if (e.key === 'ArrowDown') { e.preventDefault(); moveActive(1); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); moveActive(-1); }
    else if (e.key === 'ArrowRight') {
      if (!row) return;
      e.preventDefault();
      if (row.hasChildren && !expandedSet.has(row.node.value)) {
        toggleExpand(row.node);
      } else if (row.hasChildren) {
        // move to first child
        const nextIdx = activeIdx + 1;
        if (nextIdx < flat.length && flat[nextIdx].level > row.level) setActiveIdx(nextIdx);
      }
    } else if (e.key === 'ArrowLeft') {
      if (!row) return;
      e.preventDefault();
      if (row.hasChildren && expandedSet.has(row.node.value)) {
        toggleExpand(row.node);
      } else {
        // Move to parent
        for (let i = activeIdx - 1; i >= 0; i--) {
          if (flat[i].level < row.level) { setActiveIdx(i); break; }
        }
      }
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (row) handleSelect(row.node);
    } else if (e.key === ' ' && multiple) {
      e.preventDefault();
      if (row) handleSelect(row.node);
    } else if (e.key === 'Home') {
      e.preventDefault();
      const idx = flat.findIndex(r => !r.node.disabled);
      if (idx >= 0) setActiveIdx(idx);
    } else if (e.key === 'End') {
      e.preventDefault();
      for (let i = flat.length - 1; i >= 0; i--) {
        if (!flat[i].node.disabled) { setActiveIdx(i); break; }
      }
    } else if (e.key === 'Tab') {
      setOpen(false);
    }
  };

  /* -------- Clear -------- */
  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (multiple) commitMulti(new Set());
    else commitSingle('');
  };

  /* -------- Trigger content -------- */
  const renderTrigger = () => {
    if (multiple) {
      const chips = values
        .map(v => maps.nodeByValue.get(v))
        .filter(Boolean) as TreeNode[];

      if (chips.length === 0) {
        return <span className={styles.triggerPlaceholder}><span className={styles.triggerText}>{placeholder}</span></span>;
      }

      const visibleChips = chips.slice(0, maxTagCount);
      const overflow = chips.length - visibleChips.length;
      return (
        <span className={styles.triggerValue}>
          {visibleChips.map(c => (
            <span key={c.value} className={styles.chip}>
              <span className={styles.chipLabel}>{c.label}</span>
              <span
                role="button"
                aria-label={`Remove ${c.label}`}
                tabIndex={-1}
                className={styles.chipRemove}
                onMouseDown={e => e.preventDefault()}
                onClick={e => { e.stopPropagation(); handleSelect(c); }}
              ><ClearIcon /></span>
            </span>
          ))}
          {overflow > 0 && <span className={styles.chipOverflow}>+{overflow}</span>}
        </span>
      );
    }

    const selected = values[0] ? maps.nodeByValue.get(values[0]) : undefined;
    return (
      <span className={selected ? styles.triggerValue : styles.triggerPlaceholder}>
        {selected?.icon && <span className={styles.rowIcon}>{selected.icon}</span>}
        <span className={styles.triggerText}>{selected?.label ?? placeholder}</span>
      </span>
    );
  };

  /* -------- Render a tree row -------- */
  const renderRow = (row: FlatRow, idx: number) => {
    const { node, level, hasChildren } = row;
    const isExpanded = expandedSet.has(node.value);
    const state = checkStateFor(node);
    const isSelected = !multiple && valueSet.has(node.value);
    const isActive = idx === activeIdx;
    const isLoading = loadingNodes.has(node.value);

    return (
      <div
        key={node.value}
        id={`${selectId}-row-${idx}`}
        role="treeitem"
        aria-level={level + 1}
        aria-expanded={hasChildren ? isExpanded : undefined}
        aria-selected={multiple ? undefined : isSelected}
        aria-checked={
          multiple
            ? state === 'mixed' ? 'mixed' : state === 'checked' ? 'true' : 'false'
            : undefined
        }
        aria-disabled={node.disabled}
        data-idx={idx}
        className={[
          styles.row,
          isActive ? styles.rowActive : '',
          isSelected ? styles.rowSelected : '',
          node.disabled ? styles.rowDisabled : '',
        ].filter(Boolean).join(' ')}
        onClick={() => handleSelect(node)}
        onMouseEnter={() => !node.disabled && setActiveIdx(idx)}
      >
        <span className={styles.indent} aria-hidden>
          {Array.from({ length: level }).map((_, i) => (
            <span key={i} className={styles.indentUnit} />
          ))}
        </span>

        {hasChildren ? (
          isLoading ? (
            <span className={styles.toggle} aria-hidden><span className={styles.spinner} /></span>
          ) : (
            <span
              className={[styles.toggle, isExpanded ? styles.toggleOpen : ''].filter(Boolean).join(' ')}
              role="button"
              tabIndex={-1}
              aria-label={isExpanded ? 'Collapse' : 'Expand'}
              onClick={e => { e.stopPropagation(); toggleExpand(node); }}
              onMouseDown={e => e.preventDefault()}
            >
              <ChevronRight />
            </span>
          )
        ) : (
          <span className={styles.togglePlaceholder} aria-hidden />
        )}

        {multiple && (
          <span
            className={[
              styles.checkbox,
              state === 'checked' ? styles.checkboxChecked : '',
              state === 'mixed' ? styles.checkboxMixed : '',
            ].filter(Boolean).join(' ')}
            aria-hidden
          >
            {state === 'checked' && <CheckIcon />}
            {state === 'mixed' && <MinusIcon />}
          </span>
        )}

        {node.icon && <span className={styles.rowIcon}>{node.icon}</span>}

        <span className={styles.rowText}>
          <span className={styles.rowLabel}>
            {query ? renderHighlighted(node.label, query) : node.label}
          </span>
          {node.description && <span className={styles.rowDesc}>{node.description}</span>}
        </span>

        {!multiple && isSelected && (
          <span className={styles.check} aria-hidden><CheckIcon /></span>
        )}
      </div>
    );
  };

  /* -------- Render -------- */
  const hasValue = values.length > 0;
  const hiddenInputValue = multiple ? values.join(',') : (values[0] ?? '');

  return (
    <div
      ref={mergeRefs(wrapperRef, ref)}
      className={[
        styles.field,
        fullWidth ? styles.fullWidth : '',
        disabled ? styles.disabled : '',
        className,
      ].filter(Boolean).join(' ')}
      {...rest}
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
          aria-haspopup="tree"
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
          {renderTrigger()}

          <span className={styles.triggerActions}>
            {clearable && hasValue && !disabled && (
              <span
                role="button"
                tabIndex={-1}
                aria-label="Clear selection"
                className={styles.clearBtn}
                onClick={handleClear}
                onMouseDown={e => e.preventDefault()}
              ><ClearIcon /></span>
            )}
            <span className={[styles.chevron, open ? styles.chevronOpen : ''].filter(Boolean).join(' ')}>
              <ChevronDown />
            </span>
          </span>
        </button>

        {open && typeof document !== 'undefined' && ReactDOM.createPortal(
          <div
            ref={floatingRef}
            className={styles.menu}
            data-placement={placement}
            style={floatingStyles}
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
                  onChange={e => { setQuery(e.target.value); setActiveIdx(0); }}
                  onKeyDown={handleKeyDown}
                />
              </div>
            )}

            <div
              ref={listRef}
              className={styles.tree}
              role="tree"
              id={listId}
              aria-labelledby={selectId}
              aria-multiselectable={multiple || undefined}
              aria-activedescendant={activeIdx >= 0 ? `${selectId}-row-${activeIdx}` : undefined}
            >
              {flat.length === 0 ? (
                <div className={styles.empty}>No results</div>
              ) : (
                flat.map((row, idx) => renderRow(row, idx))
              )}
            </div>

            {multiple && hasValue && (
              <div className={styles.menuFooter}>
                <span>{values.length} selected</span>
                <button
                  type="button"
                  className={styles.footerBtn}
                  onClick={() => commitMulti(new Set())}
                >Clear all</button>
              </div>
            )}
          </div>,
          document.body,
        )}

        {name && <input type="hidden" name={name} value={hiddenInputValue} />}
      </div>

      {error && <p className={styles.errorText}>{error}</p>}
      {!error && helperText && <p className={styles.helperText}>{helperText}</p>}
    </div>
  );
});

EvoTreeSelect.displayName = 'EvoTreeSelect';
