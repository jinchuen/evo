---
name: evo-tree-select
description: Use when picking one or many items from a hierarchical/nested tree in a dropdown — category pickers, region/country selectors, org or folder trees, permission scopes — needing expand/collapse, tri-state cascade checkboxes, in-menu search, async lazy loading, or chips with overflow. Covers EvoTreeSelect (and the TreeNode type).
---

# EvoTreeSelect — Evo UI

> Evo UI component skill. Master index: [[evo-ui]].

## Overview

EvoTreeSelect is a hierarchical dropdown selector for choosing one item (single-select) or many items (multi-select with checkboxes) from a tree of nodes. It follows the W3C tree pattern: branches expand/collapse, multi-select supports tri-state cascade checkboxes (checked / mixed / unchecked), search auto-expands ancestors of matches, children can be lazy-loaded asynchronously, and selected values render as chips with "+N" overflow.

## Import

```tsx
import { EvoTreeSelect } from '@justin_evo/evo-ui';
import type { TreeNode } from '@justin_evo/evo-ui';
// One-time, app-wide stylesheet import (includes theme tokens):
// import '@justin_evo/evo-ui/dist/evo-ui.css';
```

## When to use

- Selecting from inherently hierarchical data (regions → countries, departments → teams, folders → files, categories → subcategories).
- You need multi-select where checking a parent cascades to all descendant leaves (and a "mixed" indeterminate state in between).
- The tree is large and you want in-menu search that auto-expands the path to each match.
- Children are expensive to compute and should be fetched on demand (async lazy loading).
- You want chips with overflow collapse for compact multi-select display.

## When NOT to use

- Flat, non-nested option lists — use [[evo-select]] (single/grouped) or [[evo-autocomplete]] (typeahead) instead.
- A single boolean or small mutually-exclusive set — use [[evo-checkbox]], [[evo-radio]], or [[evo-toggle]].
- Free-text entry — use [[evo-input]].

## Quick start

```tsx
import { useState } from 'react';
import { EvoTreeSelect } from '@justin_evo/evo-ui';
import type { TreeNode } from '@justin_evo/evo-ui';

const regions: TreeNode[] = [
  {
    value: 'na',
    label: 'North America',
    children: [
      { value: 'us', label: 'United States' },
      { value: 'ca', label: 'Canada' },
    ],
  },
];

function Example() {
  const [value, setValue] = useState('us');
  return (
    <EvoTreeSelect
      label="Region"
      data={regions}
      value={value}
      onChange={(v) => setValue(v as string)}
      defaultExpandedKeys={['na']}
    />
  );
}
```

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `data` | `TreeNode[]` | — | Yes | The tree of nodes to render. See the TreeNode shape below. |
| `value` | `string \| string[]` | — | No | Controlled value. A `string` for single-select, `string[]` for multi-select. |
| `defaultValue` | `string \| string[]` | — | No | Initial uncontrolled value. |
| `onChange` | `(value: string \| string[], nodes: TreeNode \| TreeNode[] \| null) => void` | — | No | Fires when the selection changes. Receives the new value and the matching node(s): a single `TreeNode` (or `null`) in single-select, an array of `TreeNode` in multi-select. |
| `multiple` | `boolean` | `false` | No | Show checkboxes and allow selecting multiple nodes. |
| `checkStrictly` | `boolean` | `false` | No | When multi-select, decouple parent/child checking — no cascade; each node is picked independently. |
| `checkedStrategy` | `CheckedStrategy` (`'leaf' \| 'parent' \| 'all'`) | `'leaf'` | No | How values returned by `onChange` are filtered when cascading. Ignored when `checkStrictly` or single-select. |
| `expandedKeys` | `string[]` | — | No | Controlled expanded node values. |
| `defaultExpandedKeys` | `string[]` | — | No | Initial uncontrolled expanded node values. |
| `onExpandedChange` | `(keys: string[]) => void` | — | No | Fires when a branch is expanded or collapsed. |
| `defaultExpandAll` | `boolean` | `false` | No | Expand every branch by default on first render. |
| `loadChildren` | `(node: TreeNode) => Promise<TreeNode[]>` | — | No | Async children loader, called the first time a node with `isLeaf === false` is expanded. |
| `searchable` | `boolean` | `false` | No | Show an in-menu search field that filters the tree and auto-expands ancestors of matches. |
| `filter` | `(node: TreeNode, query: string) => boolean` | `defaultFilter` (case-insensitive label `includes`) | No | Custom match function used when searching. |
| `maxTagCount` | `number` | `3` | No | Max number of chips shown in the trigger before collapsing into "+N". |
| `label` | `string` | — | No | Field label rendered above the trigger. |
| `placeholder` | `string` | `multiple ? 'Select items' : 'Select an item'` | No | Trigger text shown when nothing is selected. |
| `helperText` | `string` | — | No | Helper text below the trigger (hidden when `error` is set). |
| `error` | `string` | — | No | Error message below the trigger; replaces `helperText` and sets `aria-invalid` when present. |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | No | Trigger size. |
| `fullWidth` | `boolean` | `false` | No | Stretch the field to fill its container width. |
| `disabled` | `boolean` | `false` | No | Disable the control. |
| `clearable` | `boolean` | `false` | No | Show a clear button in the trigger when any value is selected. |
| `id` | `string` | auto-generated (`evo-tree-<reactId>`) | No | Custom id for the trigger; auto-generated via `useId` if omitted. |
| `name` | `string` | — | No | Renders a hidden `<input>` for native form submission (multi values are comma-joined). |
| `className` | `string` | `''` | No | Extra class applied to the outer field wrapper. |

This component is a custom (non-`forwardRef`) function component. It does not extend a native element attribute type and does not spread `...rest`; only the props listed above are accepted. `className` is applied to the outer field `<div>` wrapper, not the trigger button. There is no `ref` forwarding.

### TreeNode shape

```tsx
interface TreeNode {
  value: string;            // unique identifier
  label: string;            // visible label
  description?: string;     // secondary line rendered under the label
  icon?: React.ReactNode;   // optional leading icon
  disabled?: boolean;       // node is un-selectable / un-checkable
  children?: TreeNode[];    // sub-nodes
  isLeaf?: boolean;         // when false, triggers loadChildren on first expand
}
```

## Variants & options

### `size`
- `sm` — compact trigger height.
- `md` — default trigger height.
- `lg` — larger trigger height.

### `checkedStrategy` (multi-select cascade only)
- `leaf` — `onChange` returns only checked leaf values (default).
- `parent` — fully-checked subtrees collapse to their top-most parent value; partially-checked subtrees return their checked leaves.
- `all` — returns every checked node, including any fully-checked parents in addition to their leaves.

## Examples

### Multi-select with cascade checkboxes

```tsx
import { useState } from 'react';
import { EvoTreeSelect } from '@justin_evo/evo-ui';
import type { TreeNode } from '@justin_evo/evo-ui';

const regions: TreeNode[] = [
  {
    value: 'na',
    label: 'North America',
    children: [
      { value: 'us', label: 'United States' },
      { value: 'ca', label: 'Canada' },
      { value: 'mx', label: 'Mexico' },
    ],
  },
  {
    value: 'eu',
    label: 'Europe',
    children: [
      { value: 'uk', label: 'United Kingdom' },
      { value: 'de', label: 'Germany' },
      { value: 'es', label: 'Spain', disabled: true },
    ],
  },
];

function Countries() {
  const [value, setValue] = useState<string[]>(['us', 'ca']);
  return (
    <EvoTreeSelect
      label="Countries"
      data={regions}
      multiple
      value={value}
      onChange={(v) => setValue(v as string[])}
      placeholder="Pick countries"
      clearable
      defaultExpandAll
      helperText="Checking a region selects every country inside; unchecking propagates too."
    />
  );
}
```

### Searchable, multi-select with descriptions and tag overflow

```tsx
import { useState } from 'react';
import { EvoTreeSelect } from '@justin_evo/evo-ui';
import type { TreeNode } from '@justin_evo/evo-ui';

const departments: TreeNode[] = [
  {
    value: 'eng',
    label: 'Engineering',
    description: '124 people',
    children: [
      { value: 'web', label: 'Web' },
      { value: 'mobile', label: 'Mobile' },
      { value: 'data', label: 'Data', description: '24 people' },
    ],
  },
  {
    value: 'design',
    label: 'Design',
    description: '18 people',
    children: [
      { value: 'brand', label: 'Brand' },
      { value: 'research', label: 'UX Research' },
    ],
  },
];

function Team() {
  const [dept, setDept] = useState<string[]>(['web', 'mobile']);
  return (
    <EvoTreeSelect
      label="Team"
      data={departments}
      multiple
      searchable
      value={dept}
      onChange={(v) => setDept(v as string[])}
      placeholder="Search teams"
      clearable
      maxTagCount={2}
      fullWidth
      defaultExpandedKeys={['eng']}
    />
  );
}
```

### Strict mode (no cascade)

```tsx
import { useState } from 'react';
import { EvoTreeSelect } from '@justin_evo/evo-ui';

function WatchList({ data }) {
  const [value, setValue] = useState<string[]>(['eng', 'web']);
  return (
    <EvoTreeSelect
      label="Watch list"
      data={data}
      multiple
      checkStrictly
      value={value}
      onChange={(v) => setValue(v as string[])}
      defaultExpandAll
      helperText="Each node is picked independently — parents and children don't propagate."
    />
  );
}
```

### Async lazy loading

```tsx
import { useState } from 'react';
import { EvoTreeSelect } from '@justin_evo/evo-ui';
import type { TreeNode } from '@justin_evo/evo-ui';

const lazyRoot: TreeNode[] = [
  { value: 'workspace', label: 'Workspace', isLeaf: false },
  { value: 'shared', label: 'Shared with me', isLeaf: false },
  { value: 'trash', label: 'Trash', isLeaf: false },
];

function FilePicker() {
  const [value, setValue] = useState('');
  return (
    <EvoTreeSelect
      label="File"
      data={lazyRoot}
      value={value}
      onChange={(v) => setValue(v as string)}
      placeholder="Open a folder…"
      loadChildren={async (node) => {
        const res = await fetch(`/api/children?id=${node.value}`);
        return res.json();
      }}
      helperText="Children are fetched the first time a folder is expanded."
    />
  );
}
```

### Sizes, disabled, and error

```tsx
import { EvoTreeSelect } from '@justin_evo/evo-ui';

function Variants({ data }) {
  return (
    <>
      <EvoTreeSelect size="sm" data={data} placeholder="Small" />
      <EvoTreeSelect size="md" data={data} placeholder="Medium (default)" />
      <EvoTreeSelect size="lg" data={data} placeholder="Large" />

      <EvoTreeSelect label="Locked" data={data} disabled placeholder="Region (locked)" />

      <EvoTreeSelect
        label="Required region"
        data={data}
        multiple
        error="Select at least one region."
      />
    </>
  );
}
```

## Accessibility

The trigger is a real `<button type="button">` with `role="combobox"`, `aria-haspopup="tree"`, `aria-expanded` (reflecting open state), `aria-controls` (pointing at the tree list), and `aria-invalid` when `error` is set. A `<label htmlFor>` is associated with the trigger when `label` is provided.

The popup list has `role="tree"`, `aria-labelledby` (the trigger), `aria-multiselectable` when `multiple`, and `aria-activedescendant` tracking the keyboard cursor row. Each row has `role="treeitem"`, `aria-level`, `aria-expanded` (branches only), `aria-selected` (single-select), `aria-checked` of `'true' | 'false' | 'mixed'` (multi-select, where `mixed` is the indeterminate cascade state), and `aria-disabled` for disabled nodes.

Keyboard interactions:
- **Enter / Space / ArrowDown / ArrowUp** (while closed) — open the menu.
- **ArrowDown / ArrowUp** — move the active cursor between visible nodes (skips disabled, wraps around).
- **ArrowRight** — expand a collapsed branch, or step into its first child if already expanded.
- **ArrowLeft** — collapse an expanded branch, or step out to its parent.
- **Enter** — select the focused node (single-select closes and returns focus to the trigger; multi-select toggles).
- **Space** (multi-select) — toggle the focused node's checkbox.
- **Home / End** — jump to the first / last visible non-disabled node.
- **Escape** — close the menu and return focus to the trigger.
- **Tab** — close the menu and move focus onward.

When `searchable`, the search input auto-focuses on open and shares the same key handler so arrow navigation works while typing. Clicking outside closes the menu and clears the query. Matched substrings are visually highlighted in labels.

## Gotchas

- The trigger button uses `type="button"`, so it never accidentally submits a surrounding `<form>`. For native form submission, pass `name` to render a hidden input (multi-select values are comma-joined into a single string).
- `value` typing depends on `multiple`: pass a `string` for single-select and a `string[]` for multi-select. `onChange` mirrors this — cast appropriately (e.g. `v as string` vs `v as string[]`).
- Cascade is on by default in multi-select: checking a parent selects all descendant leaves and `onChange` returns leaves only (`checkedStrategy: 'leaf'`). Use `checkStrictly` to disable cascade, or `checkedStrategy` to return collapsed parents (`'parent'`) or every checked node (`'all'`).
- `loadChildren` only fires for nodes with `isLeaf === false` (or nodes without `children` and not explicitly `isLeaf: true`), and only on their first expand — results are cached per node.
- This component does not forward `ref` and does not spread arbitrary native attributes; only the documented props are accepted, and `className` lands on the outer wrapper, not the trigger button.
- Theme via `var(--evo-color-*)`, `var(--evo-spacing-*)`, `var(--evo-radius-*)` tokens — never hard-coded hex, which breaks dark mode. Touch targets are sized to be ≥44px on mobile.
- Single, app-wide CSS import (`@justin_evo/evo-ui/dist/evo-ui.css`). Use named imports from `@justin_evo/evo-ui` only — never deep paths.

## Related

- [[evo-select]]
- [[evo-autocomplete]]
- [[evo-checkbox]]
- [[evo-form]]
- [[evo-input]]
- [[evo-theming]]
- [[evo-ui]]
