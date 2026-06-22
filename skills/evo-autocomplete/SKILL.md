---
name: evo-autocomplete
description: Use when you need an editable combobox / typeahead / search-as-you-type field that filters a long or remote list, supports keyboard navigation, async loading, typo-tolerant "did you mean" recovery, recent-selection memory, icons/descriptions per option, and clearable input — covers EvoAutoComplete, AutoCompleteOption, RecentsConfig, RecentsStorage, evoLocalRecents.
---

# EvoAutoComplete — Evo UI

> Evo UI component skill. Master index: [[evo-ui]].

## Overview

EvoAutoComplete is an editable combobox with list autocomplete: the user types to filter a set of options, navigates with the keyboard, and commits a selection. It follows the WAI-ARIA "editable combobox with list autocomplete" pattern (focus always stays on the input, the active option is tracked via `aria-activedescendant`) and adds two first-class extras most libraries make you hand-build: Smart Recovery (nearest-match "did you mean…?" on a zero-result query) and Recents memory (recently picked options resurfaced on empty focus through a pluggable storage adapter).

## Import

```tsx
import { EvoAutoComplete, evoLocalRecents } from '@justin_evo/evo-ui';
import type { AutoCompleteOption, RecentsConfig, RecentsStorage } from '@justin_evo/evo-ui';
// One-time stylesheet import (e.g. in your app entry):
// import '@justin_evo/evo-ui/dist/evo-ui.css';
```

## When to use

- The user types to narrow a long (or remote/async) list of options.
- You want graceful failure when a query has no exact match (typo tolerance).
- You want recently picked options remembered and resurfaced on empty focus.
- Controlled `value` (the selection) and `inputValue` (the text) need to be independent — e.g. server-side filtering.
- Options need icons, secondary descriptions, or fully custom row rendering.

## When NOT to use

- A short, fixed set of options where the user picks rather than types — use a plain select ([[evo-select]]).
- A hierarchical / nested option tree — use [[evo-tree-select]].
- A free-text field with no suggestion list — use [[evo-input]].
- A global app-wide command launcher — use [[evo-command-palette]].

## Quick start

```tsx
import { useState } from 'react';
import { EvoAutoComplete } from '@justin_evo/evo-ui';
import type { AutoCompleteOption } from '@justin_evo/evo-ui';

const fruits: AutoCompleteOption[] = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'cherry', label: 'Cherry' },
];

function Example() {
  const [value, setValue] = useState<string | null>(null);
  return (
    <EvoAutoComplete
      label="Fruit"
      options={fruits}
      value={value}
      onChange={setValue}
      placeholder="Search fruit…"
      helperText="Type to filter — matched text is highlighted."
    />
  );
}
```

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `options` | `AutoCompleteOption[]` | — | Yes | The options to match against. In async mode (`filter={false}`) this is the already-filtered set. |
| `value` | `string \| null` | — | No | Selected option value (controlled). |
| `defaultValue` | `string \| null` | `null` | No | Selected option value (uncontrolled initial). |
| `onChange` | `(value: string \| null, option: AutoCompleteOption \| null) => void` | — | No | Fires when a selection is made or cleared. |
| `inputValue` | `string` | — | No | The input's text (controlled — pair with `onInputChange`). |
| `onInputChange` | `(query: string) => void` | — | No | Fires when the typed text changes. Debounced by `debounce`. |
| `label` | `string` | — | No | Field label (renders a `<label>` wired to the input). |
| `placeholder` | `string` | `'Search…'` | No | Input placeholder. |
| `helperText` | `string` | — | No | Helper text below the field (hidden when `error` is set). |
| `error` | `string` | — | No | Error message — also flips the field into the error state. |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | No | Control size. |
| `fullWidth` | `boolean` | `false` | No | Stretch to the container width. |
| `disabled` | `boolean` | `false` | No | Disable the control. |
| `clearable` | `boolean` | `true` | No | Show a clear (✕) button when there is text or a value. |
| `loading` | `boolean` | `false` | No | Render a labelled spinner row instead of results (for async fetches). |
| `debounce` | `number` | `0` | No | Debounce, in ms, applied to `onInputChange`. |
| `minChars` | `number` | `0` | No | Minimum query length before results show. |
| `maxResults` | `number` | `50` | No | Cap on rendered rows — protects against huge lists. |
| `filter` | `false \| ((option: AutoCompleteOption, query: string) => boolean)` | — | No | Filtering strategy: omit for case-insensitive substring match on `label`; pass a predicate for custom matching; pass `false` when the caller pre-filters (async mode) and `options` should render as-is. |
| `highlightMatch` | `boolean` | `true` | No | Bold (highlight) the matched substring in each row. |
| `openOnFocus` | `boolean` | `true` | No | Open the menu when the input receives focus. |
| `emptyMessage` | `React.ReactNode` | `'No results'` | No | Message shown when a non-empty query has no matches. |
| `smartRecovery` | `boolean` | `false` | No | Offer a nearest-match correction (by edit distance) when a query returns zero results. |
| `recents` | `boolean \| RecentsConfig` | `false` | No | Remember recent selections and surface them on empty focus. Pass `true` for in-memory defaults, or a `RecentsConfig` to customise. |
| `renderOption` | `(option: AutoCompleteOption, state: { active: boolean; query: string }) => React.ReactNode` | — | No | Custom row renderer. Overrides the default icon/label/description layout. |
| `id` | `string` | auto-generated | No | Custom id for the input (auto-generated via `useId` if omitted). |
| `name` | `string` | — | No | Renders a hidden `<input>` carrying the value for native form submission; also keys in-memory recents storage. |
| `className` | `string` | `''` | No | Extra class on the outer field wrapper. |

`EvoAutoCompleteProps` extends `React.InputHTMLAttributes<HTMLInputElement>` (with `size`, `onChange`, `value`, and `defaultValue` omitted/redefined). All remaining native input attributes plus `ref` and `className` are forwarded — `ref` and the spread `...rest` go onto the inner `<input role="combobox">`, while `className` is applied to the outer field wrapper `<div>`.

## Sub-components

EvoAutoComplete exposes no compound sub-components, but it ships these supporting exports and types:

### `AutoCompleteOption` (option object shape)

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `value` | `string` | Yes | Stable, unique identifier returned by `onChange`. |
| `label` | `string` | Yes | Human-readable text shown in the list and the input. |
| `description` | `string` | No | Optional secondary line under the label. |
| `icon` | `React.ReactNode` | No | Optional leading icon. |
| `disabled` | `boolean` | No | When true, the option is not selectable or keyboard-reachable. |

### `RecentsConfig` (value of the `recents` prop when an object)

| Field | Type | Default | Description |
| --- | --- | --- | --- |
| `max` | `number` | `5` | Max remembered selections. |
| `storage` | `RecentsStorage` | in-memory (per `id`/`name`) | Where recents live. |
| `label` | `string` | `'Recent'` | Section heading shown above recents. |

### `RecentsStorage` (pluggable persistence interface)

| Method | Type | Description |
| --- | --- | --- |
| `get` | `() => string[]` | Return the stored option values, most-recent first. |
| `set` | `(values: string[]) => void` | Persist the option values, most-recent first. |

### `evoLocalRecents(key: string): RecentsStorage`

A `RecentsStorage` factory backed by `localStorage` — survives reloads, and is SSR-safe (no-ops when `window` is unavailable). Pass its result to `recents.storage`. Keys are namespaced internally as `evo-recents:${key}`.

```tsx
<EvoAutoComplete recents={{ storage: evoLocalRecents('country-picker') }} options={options} />
```

## Variants & options

`size` — controls the field's dimensions (all sizes maintain >=44px touch targets on mobile):

- `sm` — small / compact control.
- `md` — medium (default).
- `lg` — large control.

`filter` — controls matching strategy:

- omitted (`undefined`) — case-insensitive substring match on `label`.
- function `(option, query) => boolean` — custom predicate.
- `false` — caller pre-filters (async mode); render `options` as-is.

`recents` — boolean or config:

- `false` (default) — no recents memory.
- `true` — recents enabled with defaults (max 5, in-memory storage keyed by `name`/`id`, label `'Recent'`).
- `RecentsConfig` object — recents enabled with overridden `max`, `storage`, and/or `label`.

## Examples

### Rich options with icons and descriptions

```tsx
import { useState } from 'react';
import { EvoAutoComplete } from '@justin_evo/evo-ui';
import type { AutoCompleteOption } from '@justin_evo/evo-ui';

const countries: AutoCompleteOption[] = [
  { value: 'us', label: 'United States', icon: <span>🇺🇸</span>, description: 'North America' },
  { value: 'jp', label: 'Japan', icon: <span>🇯🇵</span>, description: 'Asia' },
  { value: 'de', label: 'Germany', icon: <span>🇩🇪</span>, description: 'Europe' },
];

function CountryPicker() {
  const [country, setCountry] = useState<string | null>('jp');
  return (
    <EvoAutoComplete
      label="Country"
      options={countries}
      value={country}
      onChange={setCountry}
      placeholder="Search countries…"
    />
  );
}
```

### Smart Recovery — typo-tolerant "did you mean…?"

```tsx
import { useState } from 'react';
import { EvoAutoComplete } from '@justin_evo/evo-ui';

function TypoTolerant({ countries }) {
  const [value, setValue] = useState<string | null>(null);
  return (
    <EvoAutoComplete
      label="Country (try a typo like 'grmany')"
      options={countries}
      value={value}
      onChange={setValue}
      smartRecovery   // zero-result query offers the nearest option as a one-click fix
      placeholder="Try 'jaipan' or 'grmany'…"
    />
  );
}
```

### Recents memory persisted to localStorage

```tsx
import { useState } from 'react';
import { EvoAutoComplete, evoLocalRecents } from '@justin_evo/evo-ui';

function FruitWithHistory({ fruits }) {
  const [value, setValue] = useState<string | null>(null);
  return (
    <EvoAutoComplete
      label="Fruit (with history)"
      options={fruits}
      value={value}
      onChange={setValue}
      recents={{ max: 4, storage: evoLocalRecents('fruit-picker') }}
      placeholder="Pick a few, then focus again…"
    />
  );
}
```

### Async loading (server-side filtering)

```tsx
import { useRef, useState } from 'react';
import { EvoAutoComplete } from '@justin_evo/evo-ui';
import type { AutoCompleteOption } from '@justin_evo/evo-ui';

function CitySearch() {
  const [value, setValue] = useState<string | null>(null);
  const [input, setInput] = useState('');
  const [options, setOptions] = useState<AutoCompleteOption[]>([]);
  const [loading, setLoading] = useState(false);
  const reqRef = useRef(0);

  const handleSearch = (q: string) => {
    setInput(q);
    if (!q.trim()) {
      setOptions([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const reqId = ++reqRef.current;
    fetchCities(q).then((res) => {
      if (reqId !== reqRef.current) return; // drop stale responses
      setOptions(res);
      setLoading(false);
    });
  };

  return (
    <EvoAutoComplete
      label="City"
      options={options}
      value={value}
      onChange={setValue}
      inputValue={input}
      onInputChange={handleSearch}
      filter={false}     // results are already filtered server-side
      loading={loading}
      debounce={250}
      minChars={2}
      placeholder="Search cities…"
    />
  );
}
```

## Accessibility

EvoAutoComplete implements the WAI-ARIA editable-combobox-with-list-autocomplete pattern. DOM focus stays on the `<input role="combobox">` at all times; the active option is tracked with `aria-activedescendant`.

ARIA / roles on the input:

- `role="combobox"`, `aria-autocomplete="list"`, `autoComplete="off"`.
- `aria-expanded` reflects the open state; `aria-controls` points to the listbox id (`${id}-listbox`).
- `aria-activedescendant` points to the active option's id (`${id}-opt-${index}`) while open.
- `aria-invalid` is set when `error` is present; `aria-describedby` links to the error message (`${id}-error`) or, if no error, the helper text (`${id}-helper`).

ARIA on the menu and rows:

- The dropdown is `role="listbox"` with `aria-label` (the `label`, falling back to `'Suggestions'`).
- Each row is `role="option"` with `aria-selected` (true for the committed value) and `aria-disabled` for disabled options.
- The loading state renders a labelled status row ("Loading…") rather than a silent spinner.

Keyboard model:

- `ArrowDown` / `ArrowUp` — move the active option; opens the menu if it is closed. Disabled options are skipped and movement wraps.
- `Home` / `End` — jump to the first / last selectable option.
- `Enter` — select (commit) the active option, or accept a Smart Recovery suggestion.
- `Escape` — close the menu (snaps the input text back to the selected option's label in uncontrolled-input mode).
- `Tab` — close the menu and move focus on.

The clear (✕) button is `type="button"`, `tabIndex={-1}`, and `aria-label="Clear"`, so it does not steal focus from the input.

## Gotchas

- **`value` and `inputValue` are separate axes.** `value` is the committed selection (an option's `value`); `inputValue` is the visible text. For async/server filtering, control both (`value`/`onChange` and `inputValue`/`onInputChange`) and set `filter={false}` so the component renders your already-filtered `options` verbatim.
- **`filter={false}` does no client-side filtering.** It renders `options` as given (capped by `maxResults`). You are responsible for filtering; typically driven from `onInputChange`.
- **Typing past a committed selection un-commits it.** When the input text no longer equals the selected option's label, the component fires `onChange(null, null)`.
- **`debounce` only delays `onInputChange`.** Internal input text updates immediately; only the `onInputChange` callback is debounced. Pending debounces are flushed/cleared on unmount.
- **`minChars` gates results, not typing.** Until the trimmed query reaches `minChars`, the menu shows a "type N more character(s)…" hint instead of results.
- **`loading` shows a status row instead of results.** While `loading` is true, the menu renders a labelled spinner row and suppresses Smart Recovery.
- **Smart Recovery is conservative.** It only suggests when the query is at least 2 characters, there are zero results, and the nearest option is within a small edit-distance threshold (1–3 edits, ~40% of query length). It is suppressed during loading, below `minChars`, while showing recents, or on an empty query.
- **In-memory recents reset on reload and are keyed by `name`/`id`.** Use `evoLocalRecents(key)` for persistence; implement `RecentsStorage` yourself for server/IndexedDB backing.
- **Provide `name` for native form submission.** When `name` is set, a hidden `<input name=... value={value}>` is rendered so the selected value posts with the form.
- **Each `AutoCompleteOption.value` must be unique and stable** — it is the identity returned by `onChange` and used to match the selected option and recents.
- **The clear button never auto-submits.** It is `type="button"`; consistent with Evo's rule that buttons default to `type="button"`.
- **Theme via `var(--evo-color-*)` tokens** (and `--evo-spacing-*` / `--evo-radius-*`); never hard-code hex. Light + dark mode and >=44px mobile touch targets are built in.
- **Single CSS import, named imports only.** Import `@justin_evo/evo-ui/dist/evo-ui.css` once globally, and import `EvoAutoComplete` / `evoLocalRecents` from `@justin_evo/evo-ui` — never from deep paths.

## Related

- [[evo-select]]
- [[evo-tree-select]]
- [[evo-input]]
- [[evo-command-palette]]
- [[evo-form]]
- [[evo-theming]]
- [[evo-ui]]
