import { useMemo, useRef, useState } from 'react'
import {
  EvoAutoComplete,
  EvoDivider,
  evoLocalRecents,
  type AutoCompleteOption,
} from '@justin_evo/evo-ui'
import { CodeBlock } from '../components/CodeBlock'
import { PropsTable } from '../components/PropsTable'

const countries: AutoCompleteOption[] = [
  { value: 'us', label: 'United States', icon: <span>🇺🇸</span>, description: 'North America' },
  { value: 'uk', label: 'United Kingdom', icon: <span>🇬🇧</span>, description: 'Europe' },
  { value: 'ca', label: 'Canada', icon: <span>🇨🇦</span>, description: 'North America' },
  { value: 'au', label: 'Australia', icon: <span>🇦🇺</span>, description: 'Oceania' },
  { value: 'de', label: 'Germany', icon: <span>🇩🇪</span>, description: 'Europe' },
  { value: 'jp', label: 'Japan', icon: <span>🇯🇵</span>, description: 'Asia' },
  { value: 'sg', label: 'Singapore', icon: <span>🇸🇬</span>, description: 'Asia' },
  { value: 'fr', label: 'France', icon: <span>🇫🇷</span>, description: 'Europe' },
  { value: 'br', label: 'Brazil', icon: <span>🇧🇷</span>, description: 'South America' },
  { value: 'in', label: 'India', icon: <span>🇮🇳</span>, description: 'Asia' },
]

const fruits: AutoCompleteOption[] = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'blueberry', label: 'Blueberry' },
  { value: 'cherry', label: 'Cherry' },
  { value: 'grape', label: 'Grape' },
  { value: 'mango', label: 'Mango' },
  { value: 'orange', label: 'Orange' },
  { value: 'pineapple', label: 'Pineapple' },
  { value: 'strawberry', label: 'Strawberry' },
  { value: 'watermelon', label: 'Watermelon' },
]

// A larger remote-style dataset for the async example.
const allCities = [
  'Amsterdam', 'Athens', 'Bangkok', 'Barcelona', 'Berlin', 'Boston',
  'Cairo', 'Chicago', 'Copenhagen', 'Dubai', 'Dublin', 'Helsinki',
  'Istanbul', 'Lisbon', 'London', 'Madrid', 'Melbourne', 'Mumbai',
  'Munich', 'New York', 'Oslo', 'Paris', 'Prague', 'Rome',
  'San Francisco', 'Seoul', 'Singapore', 'Stockholm', 'Sydney', 'Tokyo',
  'Toronto', 'Vancouver', 'Vienna', 'Warsaw', 'Zurich',
].map((c) => ({ value: c.toLowerCase().replace(/\s+/g, '-'), label: c }))

export default function AutoCompletePage() {
  const [basic, setBasic] = useState<string | null>(null)
  const [country, setCountry] = useState<string | null>('jp')
  const [recovery, setRecovery] = useState<string | null>(null)
  const [recent, setRecent] = useState<string | null>(null)

  // Async example state
  const [cityValue, setCityValue] = useState<string | null>(null)
  const [cityInput, setCityInput] = useState('')
  const [cityOptions, setCityOptions] = useState<AutoCompleteOption[]>([])
  const [cityLoading, setCityLoading] = useState(false)
  const reqRef = useRef(0)

  const handleCitySearch = (q: string) => {
    setCityInput(q)
    if (!q.trim()) {
      setCityOptions([])
      setCityLoading(false)
      return
    }
    setCityLoading(true)
    const reqId = ++reqRef.current
    // Simulate a network request — the reqId guard drops stale responses.
    window.setTimeout(() => {
      if (reqId !== reqRef.current) return
      setCityOptions(
        allCities.filter((c) => c.label.toLowerCase().includes(q.toLowerCase())),
      )
      setCityLoading(false)
    }, 450)
  }

  const recoveryPick = useMemo(
    () => countries.find((c) => c.value === recovery)?.label ?? 'none',
    [recovery],
  )

  return (
    <div>
      <div className="docs-page-header">
        <div className="docs-page-tag">Component</div>
        <h1 className="docs-page-title">EvoAutoComplete</h1>
        <p className="docs-page-desc">
          An editable combobox with list autocomplete — type to filter, navigate
          by keyboard, and pick a suggestion. Built on the WAI-ARIA combobox
          pattern, with two capabilities the rest of the ecosystem makes you
          hand-build: <strong>Smart Recovery</strong> and{' '}
          <strong>Recents memory</strong>.
        </p>
        <div className="docs-import-line">
          import {'{ '}<span>EvoAutoComplete</span>{' }'} from '@justin_evo/evo-ui'
        </div>
      </div>

      <div className="docs-section">
        <div className="docs-section-title">Viewport-aware menu</div>
        <p className="docs-section-desc">
          The dropdown measures available space when it opens and flips upward when the
          trigger sits near the bottom of the viewport. It renders in a portal, so it is
          never clipped by <code>overflow: hidden</code> or scroll containers — including
          inside an <code>EvoModal</code>. Fully automatic; no configuration.
        </p>
      </div>

      <div className="docs-section">
        <div className="docs-section-title">Why EvoAutoComplete</div>
        <p className="docs-section-desc">
          A plain <code>EvoSelect</code> is for short, fixed option sets. Reach
          for <code>EvoAutoComplete</code> when the user types to narrow a long
          (or remote) list, and you want graceful failure when the query has no
          exact match.
        </p>
        <ul className="docs-list">
          <li>
            <strong>Smart Recovery</strong> — a zero-result query no longer dead-ends.
            The component computes the nearest option by edit distance and offers a
            one-click "did you mean…?" correction.
          </li>
          <li>
            <strong>Recents memory</strong> — recently picked options are remembered
            and resurfaced on empty focus, via a pluggable storage adapter
            (in-memory by default, <code>localStorage</code> on request).
          </li>
          <li>
            Controlled <code>value</code> and <code>inputValue</code> are
            independent, so async fetching is a clean fit.
          </li>
          <li>
            Strict combobox a11y — <code>aria-activedescendant</code>, focus stays
            on the input, full keyboard model.
          </li>
        </ul>
      </div>

      <EvoDivider />

      <div className="docs-section">
        <div className="docs-section-title">Basic</div>
        <div className="docs-preview col">
          <EvoAutoComplete
            label="Fruit"
            options={fruits}
            value={basic}
            onChange={setBasic}
            placeholder="Search fruit…"
            helperText="Type to filter — matched text is highlighted."
          />
          <p className="docs-readout">
            Selected: <strong>{basic ?? 'none'}</strong>
          </p>
        </div>
        <CodeBlock code={`const [value, setValue] = useState<string | null>(null)

<EvoAutoComplete
  label="Fruit"
  options={fruits}
  value={value}
  onChange={setValue}
  placeholder="Search fruit…"
/>`} />
      </div>

      <div className="docs-section">
        <div className="docs-section-title">Rich options (icons + descriptions)</div>
        <div className="docs-preview col">
          <EvoAutoComplete
            label="Country"
            options={countries}
            value={country}
            onChange={setCountry}
            placeholder="Search countries…"
          />
        </div>
        <CodeBlock code={`const countries = [
  { value: 'us', label: 'United States', icon: <span>🇺🇸</span>, description: 'North America' },
  { value: 'jp', label: 'Japan', icon: <span>🇯🇵</span>, description: 'Asia' },
  // …
]

<EvoAutoComplete label="Country" options={countries} value={value} onChange={setValue} />`} />
      </div>

      <EvoDivider />

      <div className="docs-section">
        <div className="docs-section-title">
          🆕 Smart Recovery — "did you mean…?"
        </div>
        <p className="docs-section-desc">
          Set <code>smartRecovery</code> and a misspelled query stops being a
          dead end. Try typing <code>jaipan</code>, <code>grmany</code>, or{' '}
          <code>brazl</code> — the component finds the nearest option by edit
          distance and offers it as a one-click fix. No mainstream autocomplete
          library ships this; they all just show "No results".
        </p>
        <div className="docs-preview col">
          <EvoAutoComplete
            label="Country (try a typo)"
            options={countries}
            value={recovery}
            onChange={setRecovery}
            smartRecovery
            placeholder="Try 'jaipan' or 'grmany'…"
          />
          <p className="docs-readout">
            Selected: <strong>{recoveryPick}</strong>
          </p>
        </div>
        <CodeBlock code={`<EvoAutoComplete
  label="Country"
  options={countries}
  value={value}
  onChange={setValue}
  smartRecovery        // ← typo-tolerant zero-result recovery
/>`} />
      </div>

      <div className="docs-section">
        <div className="docs-section-title">🆕 Recents memory</div>
        <p className="docs-section-desc">
          Set <code>recents</code> and the component remembers what was picked,
          resurfacing it the moment the input is focused while empty. Pick a few
          fruits below, clear the field, then focus it again — your history is
          there. This example persists to <code>localStorage</code> via{' '}
          <code>evoLocalRecents</code>, so it even survives a page reload.
        </p>
        <div className="docs-preview col">
          <EvoAutoComplete
            label="Fruit (with history)"
            options={fruits}
            value={recent}
            onChange={setRecent}
            recents={{ max: 4, storage: evoLocalRecents('docs-fruit-demo') }}
            placeholder="Pick a few, then focus again…"
          />
        </div>
        <CodeBlock code={`import { EvoAutoComplete, evoLocalRecents } from '@justin_evo/evo-ui'

// Recents in memory (default — resets on reload):
<EvoAutoComplete options={fruits} recents />

// Recents persisted across reloads:
<EvoAutoComplete
  options={fruits}
  recents={{ max: 4, storage: evoLocalRecents('fruit-picker') }}
/>`} />
      </div>

      <EvoDivider />

      <div className="docs-section">
        <div className="docs-section-title">Async loading</div>
        <p className="docs-section-desc">
          For remote data, drive <code>options</code> yourself from{' '}
          <code>onInputChange</code>, set <code>filter={'{false}'}</code> so the
          component renders your results verbatim, and toggle <code>loading</code>{' '}
          while the request is in flight. <code>debounce</code> throttles the
          callback.
        </p>
        <div className="docs-preview col">
          <EvoAutoComplete
            label="City"
            options={cityOptions}
            value={cityValue}
            onChange={setCityValue}
            inputValue={cityInput}
            onInputChange={handleCitySearch}
            filter={false}
            loading={cityLoading}
            debounce={250}
            minChars={2}
            placeholder="Search cities…"
            helperText="Simulated 450ms request, debounced 250ms."
          />
        </div>
        <CodeBlock code={`const [options, setOptions] = useState([])
const [input, setInput] = useState('')
const [loading, setLoading] = useState(false)

<EvoAutoComplete
  label="City"
  options={options}
  inputValue={input}
  onInputChange={async (q) => {
    setInput(q)
    setLoading(true)
    setOptions(await fetchCities(q))
    setLoading(false)
  }}
  filter={false}     // we already filtered server-side
  loading={loading}
  debounce={250}
  minChars={2}
/>`} />
      </div>

      <div className="docs-section">
        <div className="docs-section-title">Sizes</div>
        <div className="docs-preview col">
          <EvoAutoComplete size="sm" options={fruits} placeholder="Small" />
          <EvoAutoComplete size="md" options={fruits} placeholder="Medium (default)" />
          <EvoAutoComplete size="lg" options={fruits} placeholder="Large" />
        </div>
        <CodeBlock code={`<EvoAutoComplete size="sm" options={options} placeholder="Small" />
<EvoAutoComplete size="md" options={options} placeholder="Medium" />
<EvoAutoComplete size="lg" options={options} placeholder="Large" />`} />
      </div>

      <div className="docs-section">
        <div className="docs-section-title">Error & disabled</div>
        <div className="docs-preview col">
          <EvoAutoComplete
            label="Fruit"
            options={fruits}
            error="Please choose a fruit to continue."
            placeholder="Search fruit…"
          />
          <EvoAutoComplete
            label="Fruit"
            options={fruits}
            disabled
            placeholder="Disabled"
          />
        </div>
        <CodeBlock code={`<EvoAutoComplete label="Fruit" options={fruits} error="Please choose a fruit." />
<EvoAutoComplete label="Fruit" options={fruits} disabled />`} />
      </div>

      <div className="docs-section">
        <div className="docs-section-title">Full width</div>
        <div className="docs-preview col">
          <EvoAutoComplete fullWidth label="Fruit" options={fruits} placeholder="Search fruit…" />
        </div>
        <CodeBlock code={`<EvoAutoComplete fullWidth label="Fruit" options={fruits} />`} />
      </div>

      <EvoDivider />

      <div className="docs-section">
        <div className="docs-section-title">Accessibility</div>
        <p className="docs-section-desc">
          EvoAutoComplete implements the WAI-ARIA{' '}
          <em>editable combobox with list autocomplete</em> pattern. DOM focus
          stays on the <code>{'<input role="combobox">'}</code> at all times; the
          active option is tracked with <code>aria-activedescendant</code>.
        </p>
        <ul className="docs-list">
          <li><code>aria-expanded</code> / <code>aria-controls</code> wire the input to the listbox.</li>
          <li><code>aria-autocomplete="list"</code> announces the suggestion behaviour.</li>
          <li><code>error</code> sets <code>aria-invalid</code> and links the message via <code>aria-describedby</code>.</li>
          <li>The loading state renders a labelled status row, not a silent spinner.</li>
        </ul>
        <p className="docs-kbd-list">
          <strong>↑ / ↓</strong> — Move the active option (opens the menu if closed)<br />
          <strong>Home / End</strong> — Jump to first / last option<br />
          <strong>Enter</strong> — Select the active option (or accept a recovery suggestion)<br />
          <strong>Esc</strong> — Close the menu<br />
          <strong>Tab</strong> — Close the menu and move focus on
        </p>
      </div>

      <EvoDivider />

      <div className="docs-section">
        <div className="docs-section-title">Props</div>
        <PropsTable props={[
          { prop: 'options', type: 'AutoCompleteOption[]', required: true, description: 'Options to match against — { value, label, description?, icon?, disabled? }. In async mode (filter={false}) this is your already-filtered set.' },
          { prop: 'value', type: 'string | null', description: 'Selected option value (controlled).' },
          { prop: 'defaultValue', type: 'string | null', default: 'null', description: 'Initial uncontrolled selected value.' },
          { prop: 'onChange', type: '(value, option) => void', description: 'Fires when a selection is made or cleared.' },
          { prop: 'inputValue', type: 'string', description: 'The input text (controlled — pair with onInputChange).' },
          { prop: 'onInputChange', type: '(query: string) => void', description: 'Fires when the typed text changes. Debounced by `debounce`.' },
          { prop: 'label', type: 'string', description: 'Field label.' },
          { prop: 'placeholder', type: 'string', default: "'Search…'", description: 'Input placeholder.' },
          { prop: 'helperText', type: 'string', description: 'Helper text below the field.' },
          { prop: 'error', type: 'string', description: 'Error message; also flips the field into the error state.' },
          { prop: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Control size.' },
          { prop: 'fullWidth', type: 'boolean', default: 'false', description: 'Stretch to the container width.' },
          { prop: 'disabled', type: 'boolean', default: 'false', description: 'Disable the control.' },
          { prop: 'clearable', type: 'boolean', default: 'true', description: 'Show a clear (✕) button when there is text or a value.' },
          { prop: 'loading', type: 'boolean', default: 'false', description: 'Render a labelled spinner row instead of results.' },
          { prop: 'debounce', type: 'number', default: '0', description: 'Milliseconds to debounce onInputChange.' },
          { prop: 'minChars', type: 'number', default: '0', description: 'Minimum query length before results show.' },
          { prop: 'maxResults', type: 'number', default: '50', description: 'Cap on rendered rows — guards against huge lists.' },
          { prop: 'filter', type: 'false | ((option, query) => boolean)', description: 'Omit for case-insensitive substring match; pass a predicate to customise; pass false when the caller pre-filters (async).' },
          { prop: 'highlightMatch', type: 'boolean', default: 'true', description: 'Bold the matched substring in each row.' },
          { prop: 'openOnFocus', type: 'boolean', default: 'true', description: 'Open the menu when the input receives focus.' },
          { prop: 'emptyMessage', type: 'ReactNode', default: "'No results'", description: 'Shown when a non-empty query has no matches.' },
          { prop: 'smartRecovery', type: 'boolean', default: 'false', description: '🆕 Offer a nearest-match correction when a query returns zero results.' },
          { prop: 'recents', type: 'boolean | RecentsConfig', default: 'false', description: '🆕 Remember recent selections and surface them on empty focus. RecentsConfig = { max?, storage?, label? }.' },
          { prop: 'renderOption', type: '(option, state) => ReactNode', description: 'Custom row renderer; overrides the default icon/label/description layout.' },
          { prop: 'name', type: 'string', description: 'Renders a hidden input carrying the value for HTML form submission.' },
          { prop: 'id', type: 'string', description: 'Custom id for the input (auto-generated if omitted).' },
          { prop: 'className', type: 'string', description: 'Extra class on the outer field wrapper.' },
        ]} />
      </div>

      <div className="docs-section">
        <div className="docs-section-title">Recents storage adapter</div>
        <p className="docs-section-desc">
          <code>recents</code> stores option <em>values</em> through a{' '}
          <code>RecentsStorage</code> — <code>{'{ get, set }'}</code>. The default
          is in-memory (per <code>id</code>/<code>name</code>, resets on reload).
          The exported <code>evoLocalRecents(key)</code> persists to{' '}
          <code>localStorage</code> and is SSR-safe. Implement the interface to
          back recents with a server, IndexedDB, or your own store.
        </p>
        <CodeBlock code={`import { evoLocalRecents, type RecentsStorage } from '@justin_evo/evo-ui'

// Built-in localStorage adapter:
recents={{ storage: evoLocalRecents('country-picker') }}

// Or your own:
const serverRecents: RecentsStorage = {
  get: () => myStore.read('recent-countries'),
  set: (values) => myStore.write('recent-countries', values),
}`} />
      </div>
    </div>
  )
}
