import { useState } from 'react'
import {
  EvoCommandPalette,
  EvoButton,
  EvoDivider,
  EvoStack,
  type CommandPaletteItem,
} from '@justin_evo/evo-ui'
import { CodeBlock } from '../components/CodeBlock'
import { PropsTable } from '../components/PropsTable'

export default function CommandPalettePage() {
  const [open, setOpen] = useState(false)
  const [lastAction, setLastAction] = useState<string>('—')

  const items: CommandPaletteItem[] = [
    {
      label: 'New file',
      description: 'Create a blank document',
      group: 'File',
      shortcut: ['⌘', 'N'],
      onSelect: () => setLastAction('New file'),
    },
    {
      label: 'Open recent…',
      description: 'Pick from the last 10 files',
      group: 'File',
      onSelect: () => setLastAction('Open recent'),
    },
    {
      label: 'Save',
      group: 'File',
      shortcut: ['⌘', 'S'],
      onSelect: () => setLastAction('Save'),
    },
    {
      label: 'Toggle theme',
      description: 'Switch between light and dark',
      group: 'View',
      onSelect: () => setLastAction('Toggle theme'),
    },
    {
      label: 'Go to settings',
      group: 'Navigation',
      shortcut: ['⌘', ','],
      onSelect: () => setLastAction('Go to settings'),
    },
    {
      label: 'Sign out',
      group: 'Account',
      onSelect: () => setLastAction('Sign out'),
    },
  ]

  return (
    <div>
      <div className="docs-page-header">
        <div className="docs-page-tag">Component</div>
        <h1 className="docs-page-title">EvoCommandPalette</h1>
        <p className="docs-page-desc">
          A keyboard-driven command launcher. Opens with{' '}
          <code>⌘K</code> / <code>Ctrl K</code>, supports fuzzy search, item groups, and
          per-item keyboard shortcuts. Renders nothing in the DOM until invoked.
        </p>
        <div className="docs-import-line">
          import {'{ '}<span>EvoCommandPalette</span>{' }'} from '@justin_evo/evo-ui'
        </div>
      </div>

      <div className="docs-section">
        <div className="docs-section-title">When to use</div>
        <ul className="docs-list">
          <li>
            <strong>Power-user shortcuts</strong> — let users jump anywhere in the app
            without leaving the keyboard.
          </li>
          <li>
            <strong>Long action menus</strong> — anything bigger than a context menu but
            smaller than a settings page.
          </li>
          <li>
            <strong>Search + execute</strong> — when "find the thing, then do it" is a
            single user intent. Browsers, IDEs, and Linear popularised this pattern.
          </li>
        </ul>
      </div>

      <EvoDivider />

      <div className="docs-section">
        <div className="docs-section-title">Uncontrolled (recommended)</div>
        <p className="docs-section-desc">
          Drop the component anywhere in your tree and forget about it. <code>⌘K</code>{' '}
          (or <code>Ctrl K</code> on Windows / Linux) toggles it open, <code>Esc</code>{' '}
          closes it.
        </p>
        <div className="docs-preview col">
          <p className="docs-readout">
            Press <strong>⌘K</strong> or <strong>Ctrl K</strong> anywhere on this page —
            last action: <strong>{lastAction}</strong>
          </p>
          <EvoCommandPalette items={items} />
        </div>
        <CodeBlock code={`import { EvoCommandPalette, type CommandPaletteItem } from '@justin_evo/evo-ui'

const items: CommandPaletteItem[] = [
  { label: 'New file', group: 'File', shortcut: ['⌘', 'N'], onSelect: () => createFile() },
  { label: 'Save',     group: 'File', shortcut: ['⌘', 'S'], onSelect: () => save() },
  { label: 'Toggle theme', group: 'View', onSelect: () => toggleTheme() },
]

<EvoCommandPalette items={items} />`} />
      </div>

      <div className="docs-section">
        <div className="docs-section-title">Controlled</div>
        <p className="docs-section-desc">
          Drive open / close yourself when you need to wire it to a custom trigger
          (e.g. a top-bar button) or coordinate it with other overlays.
        </p>
        <div className="docs-preview col">
          <EvoStack direction="row" gap="0.5rem" align="center">
            <EvoButton label="Open palette" onClick={() => setOpen(true)} />
            <span className="docs-readout">
              Last action: <strong>{lastAction}</strong>
            </span>
          </EvoStack>
          <EvoCommandPalette
            items={items}
            open={open}
            onClose={() => setOpen(false)}
            placeholder="Search commands…"
          />
        </div>
        <CodeBlock code={`const [open, setOpen] = useState(false)

<EvoButton label="Open" onClick={() => setOpen(true)} />
<EvoCommandPalette
  items={items}
  open={open}
  onClose={() => setOpen(false)}
/>`} />
      </div>

      <div className="docs-section">
        <div className="docs-section-title">Grouping &amp; shortcuts</div>
        <p className="docs-section-desc">
          Pass <code>group</code> to bucket items under headings, and{' '}
          <code>shortcut</code> as an array of keys to display next to the item. The
          shortcut here is purely visual — wire the actual key handling in your own
          app code if you want global hotkeys for each action.
        </p>
        <CodeBlock code={`const items = [
  { label: 'New file', group: 'File',   shortcut: ['⌘', 'N'], onSelect: () => {} },
  { label: 'Save',     group: 'File',   shortcut: ['⌘', 'S'], onSelect: () => {} },
  { label: 'Settings', group: 'Navigation', shortcut: ['⌘', ','], onSelect: () => {} },
]`} />
      </div>

      <div className="docs-section">
        <div className="docs-section-title">Keyboard</div>
        <div className="docs-preview col">
          <p className="docs-kbd-list">
            <strong>⌘ K / Ctrl K</strong> — Toggle the palette (works anywhere on the page)<br />
            <strong>↑ / ↓</strong> — Move the active result<br />
            <strong>Enter</strong> — Run the active item's <code>onSelect</code><br />
            <strong>Esc</strong> — Close the palette<br />
            <strong>Type</strong> — Fuzzy-filter by label, description, or group
          </p>
        </div>
      </div>

      <EvoDivider />

      <div className="docs-section">
        <div className="docs-section-title">Props</div>
        <PropsTable props={[
          { prop: 'items', type: 'CommandPaletteItem[]', required: true, description: 'The actions to display. Re-render with a new array to change them on the fly.' },
          { prop: 'placeholder', type: 'string', default: "'Search commands…'", description: 'Search input placeholder.' },
          { prop: 'open', type: 'boolean', description: 'Controlled open state. Omit for uncontrolled mode (⌘K toggles internally).' },
          { prop: 'onClose', type: '() => void', description: 'Called when the user dismisses the palette (Esc, overlay click, or item selection).' },
        ]} />
      </div>

      <div className="docs-section">
        <div className="docs-section-title">CommandPaletteItem</div>
        <PropsTable props={[
          { prop: 'label', type: 'string', required: true, description: 'Primary text for the result. The fuzzy search indexes this.' },
          { prop: 'description', type: 'string', description: 'Secondary line shown below the label. Also searched.' },
          { prop: 'group', type: 'string', description: "Heading the item is bucketed under. Defaults to 'Actions'." },
          { prop: 'icon', type: 'ReactNode', description: 'Optional icon rendered before the label.' },
          { prop: 'shortcut', type: 'string[]', description: "Keys displayed on the right (e.g. ['⌘','K']). Display-only — wire the actual hotkey yourself." },
          { prop: 'onSelect', type: '() => void', required: true, description: 'Called when the item is activated by click or Enter.' },
        ]} />
      </div>
    </div>
  )
}
