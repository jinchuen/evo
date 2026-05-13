import { useState } from 'react'
import { EvoTreeSelect, EvoDivider } from '@justin_evo/evo-ui'
import type { TreeNode } from '@justin_evo/evo-ui'
import { CodeBlock } from '../components/CodeBlock'
import { PropsTable } from '../components/PropsTable'

/* ---------- Sample data ---------- */

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
      { value: 'fr', label: 'France' },
      { value: 'es', label: 'Spain', disabled: true },
    ],
  },
  {
    value: 'apac',
    label: 'Asia Pacific',
    children: [
      { value: 'jp', label: 'Japan' },
      { value: 'sg', label: 'Singapore' },
      { value: 'au', label: 'Australia' },
      { value: 'in', label: 'India' },
    ],
  },
]

const departments: TreeNode[] = [
  {
    value: 'eng',
    label: 'Engineering',
    description: '124 people',
    children: [
      {
        value: 'platform',
        label: 'Platform',
        description: '38 people',
        children: [
          { value: 'infra', label: 'Infrastructure' },
          { value: 'dx', label: 'Developer Experience' },
          { value: 'security', label: 'Security' },
        ],
      },
      {
        value: 'product',
        label: 'Product Engineering',
        description: '62 people',
        children: [
          { value: 'web', label: 'Web' },
          { value: 'mobile', label: 'Mobile' },
          { value: 'growth', label: 'Growth' },
        ],
      },
      { value: 'data', label: 'Data', description: '24 people' },
    ],
  },
  {
    value: 'design',
    label: 'Design',
    description: '18 people',
    children: [
      { value: 'product-design', label: 'Product Design' },
      { value: 'brand', label: 'Brand' },
      { value: 'research', label: 'UX Research' },
    ],
  },
  {
    value: 'gtm',
    label: 'Go-to-Market',
    description: '74 people',
    children: [
      { value: 'sales', label: 'Sales' },
      { value: 'marketing', label: 'Marketing' },
      { value: 'success', label: 'Customer Success' },
    ],
  },
]

/* Lazy loaded sample tree */
const lazyRoot: TreeNode[] = [
  { value: 'workspace', label: 'Workspace', isLeaf: false },
  { value: 'shared', label: 'Shared with me', isLeaf: false },
  { value: 'trash', label: 'Trash', isLeaf: false },
]

const fakeLoad = (parent: TreeNode): Promise<TreeNode[]> =>
  new Promise(resolve => {
    setTimeout(() => {
      resolve([
        { value: `${parent.value}-doc1`, label: 'Spec.md' },
        { value: `${parent.value}-doc2`, label: 'Roadmap.md' },
        {
          value: `${parent.value}-folder`,
          label: 'Drafts',
          children: [
            { value: `${parent.value}-d1`, label: 'idea-1.md' },
            { value: `${parent.value}-d2`, label: 'idea-2.md' },
          ],
        },
      ])
    }, 550)
  })

export default function TreeSelectPage() {
  const [single, setSingle] = useState<string>('uk')
  const [multi, setMulti] = useState<string[]>(['us', 'ca'])
  const [dept, setDept] = useState<string[]>(['web', 'mobile'])
  const [strict, setStrict] = useState<string[]>(['platform', 'web'])
  const [lazyVal, setLazyVal] = useState<string>('')
  const [errored, setErrored] = useState<string[]>([])

  return (
    <div>
      <div className="docs-page-header">
        <div className="docs-page-tag">Component</div>
        <h1 className="docs-page-title">EvoTreeSelect</h1>
        <p className="docs-page-desc">
          A hierarchical dropdown selector for picking one or many items from a tree.
          Built with the W3C tree pattern in mind — expand/collapse, tri-state cascade
          checkboxes, in-menu search that auto-expands matches, async lazy loading,
          and chip rendering with overflow. Lightweight, fully keyboard-driven, and
          tuned to match the rest of the Evo UI dark aesthetic.
        </p>
        <div className="docs-import-line">
          import {'{ '}<span>EvoTreeSelect</span>{' }'} from '@justin_evo/evo-ui'
        </div>
      </div>

      <div className="docs-section">
        <div className="docs-section-title">Basic (single-select)</div>
        <div className="docs-preview col">
          <EvoTreeSelect
            label="Region"
            data={regions}
            value={single}
            onChange={(v) => setSingle(v as string)}
            placeholder="Choose a region"
            defaultExpandedKeys={['eu']}
            helperText="Click a chevron to expand a branch."
          />
          <p style={{ fontSize: '0.82rem', color: '#64748b' }}>
            Selected: <strong style={{ color: '#e2e8f0' }}>{single || 'none'}</strong>
          </p>
        </div>
        <CodeBlock code={`const regions = [
  {
    value: 'na', label: 'North America',
    children: [
      { value: 'us', label: 'United States' },
      { value: 'ca', label: 'Canada' },
    ],
  },
  // ...
]

<EvoTreeSelect
  label="Region"
  data={regions}
  value={value}
  onChange={(v) => setValue(v as string)}
  defaultExpandedKeys={['eu']}
/>`} />
      </div>

      <div className="docs-section">
        <div className="docs-section-title">Multi-select with cascade checkboxes</div>
        <div className="docs-preview col">
          <EvoTreeSelect
            label="Countries"
            data={regions}
            multiple
            value={multi}
            onChange={(v) => setMulti(v as string[])}
            placeholder="Pick countries"
            clearable
            defaultExpandAll
            helperText="Checking a region selects every country inside; uncheck propagates."
          />
          <p style={{ fontSize: '0.82rem', color: '#64748b' }}>
            Selected: <strong style={{ color: '#e2e8f0' }}>{multi.length ? multi.join(', ') : 'none'}</strong>
          </p>
        </div>
        <CodeBlock code={`<EvoTreeSelect
  label="Countries"
  data={regions}
  multiple
  value={multi}
  onChange={(v) => setMulti(v as string[])}
  clearable
  defaultExpandAll
/>`} />
      </div>

      <div className="docs-section">
        <div className="docs-section-title">Searchable with rich descriptions</div>
        <div className="docs-preview col">
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
            defaultExpandedKeys={['eng', 'product']}
          />
        </div>
        <CodeBlock code={`<EvoTreeSelect
  label="Team"
  data={departments}
  multiple
  searchable
  value={dept}
  onChange={(v) => setDept(v as string[])}
  maxTagCount={2}
  fullWidth
/>`} />
      </div>

      <div className="docs-section">
        <div className="docs-section-title">Strict mode (no cascade)</div>
        <div className="docs-preview col">
          <EvoTreeSelect
            label="Watch list"
            data={departments}
            multiple
            checkStrictly
            value={strict}
            onChange={(v) => setStrict(v as string[])}
            defaultExpandAll
            helperText="Each node can be picked independently — parents and children don't propagate."
          />
        </div>
        <CodeBlock code={`<EvoTreeSelect
  data={departments}
  multiple
  checkStrictly
  value={value}
  onChange={(v) => setValue(v as string[])}
/>`} />
      </div>

      <div className="docs-section">
        <div className="docs-section-title">Async lazy loading</div>
        <div className="docs-preview col">
          <EvoTreeSelect
            label="File"
            data={lazyRoot}
            value={lazyVal}
            onChange={(v) => setLazyVal(v as string)}
            loadChildren={fakeLoad}
            placeholder="Open a folder…"
            helperText="Children are fetched the first time a folder is expanded."
          />
        </div>
        <CodeBlock code={`const data = [
  { value: 'workspace', label: 'Workspace', isLeaf: false },
  { value: 'shared',    label: 'Shared with me', isLeaf: false },
]

<EvoTreeSelect
  data={data}
  loadChildren={async (node) => {
    const res = await fetch(\`/api/children?id=\${node.value}\`)
    return res.json()
  }}
/>`} />
      </div>

      <div className="docs-section">
        <div className="docs-section-title">Sizes</div>
        <div className="docs-preview col">
          <EvoTreeSelect size="sm" data={regions} placeholder="Small" />
          <EvoTreeSelect size="md" data={regions} placeholder="Medium (default)" />
          <EvoTreeSelect size="lg" data={regions} placeholder="Large" />
        </div>
        <CodeBlock code={`<EvoTreeSelect size="sm" data={data} />
<EvoTreeSelect size="md" data={data} />
<EvoTreeSelect size="lg" data={data} />`} />
      </div>

      <div className="docs-section">
        <div className="docs-section-title">Disabled & error</div>
        <div className="docs-preview col">
          <EvoTreeSelect
            label="Locked region"
            data={regions}
            disabled
            placeholder="Region (locked)"
          />
          <EvoTreeSelect
            label="Required region"
            data={regions}
            multiple
            value={errored}
            onChange={(v) => setErrored(v as string[])}
            error={errored.length === 0 ? 'Select at least one region.' : undefined}
          />
        </div>
        <CodeBlock code={`<EvoTreeSelect data={data} disabled />
<EvoTreeSelect
  data={data}
  multiple
  value={value}
  onChange={...}
  error="Select at least one region."
/>`} />
      </div>

      <EvoDivider />

      <div className="docs-section">
        <div className="docs-section-title">Keyboard</div>
        <div className="docs-preview col">
          <p style={{ fontSize: '0.85rem', color: '#94a3b8', margin: 0, lineHeight: 1.7 }}>
            <strong style={{ color: '#e2e8f0' }}>↑ / ↓</strong> — Move between visible nodes<br />
            <strong style={{ color: '#e2e8f0' }}>→</strong> — Expand a collapsed branch, or step into its first child<br />
            <strong style={{ color: '#e2e8f0' }}>←</strong> — Collapse an expanded branch, or step out to its parent<br />
            <strong style={{ color: '#e2e8f0' }}>Enter</strong> — Select the focused node (or toggle in multi-select)<br />
            <strong style={{ color: '#e2e8f0' }}>Space</strong> — Toggle the checkbox in multi-select<br />
            <strong style={{ color: '#e2e8f0' }}>Home / End</strong> — Jump to the first / last visible node<br />
            <strong style={{ color: '#e2e8f0' }}>Esc</strong> — Close the menu<br />
            <strong style={{ color: '#e2e8f0' }}>Tab</strong> — Commit and move focus
          </p>
        </div>
      </div>

      <EvoDivider />

      <div className="docs-section">
        <div className="docs-section-title">Props</div>
        <PropsTable props={[
          { prop: 'data', type: 'TreeNode[]', required: true, description: 'Array of { value, label, children?, description?, icon?, disabled?, isLeaf? }.' },
          { prop: 'value', type: 'string | string[]', description: 'Controlled value (single-select string, multi-select string[]).' },
          { prop: 'defaultValue', type: 'string | string[]', description: 'Initial uncontrolled value.' },
          { prop: 'onChange', type: '(value, nodes) => void', description: 'Fires when the selection changes. Receives the new value and the matching node(s).' },
          { prop: 'multiple', type: 'boolean', default: 'false', description: 'Show checkboxes and allow many selections.' },
          { prop: 'checkStrictly', type: 'boolean', default: 'false', description: 'When multiple, disable parent → child cascade so nodes can be picked independently.' },
          { prop: 'checkedStrategy', type: "'leaf' | 'parent' | 'all'", default: "'leaf'", description: 'Which values onChange returns when cascading: only leaves, collapsed top-most parents, or every checked node.' },
          { prop: 'expandedKeys', type: 'string[]', description: 'Controlled expansion state.' },
          { prop: 'defaultExpandedKeys', type: 'string[]', description: 'Initial uncontrolled expansion state.' },
          { prop: 'onExpandedChange', type: '(keys: string[]) => void', description: 'Fires when a branch is expanded or collapsed.' },
          { prop: 'defaultExpandAll', type: 'boolean', default: 'false', description: 'Expand every branch by default.' },
          { prop: 'loadChildren', type: '(node) => Promise<TreeNode[]>', description: 'Async loader, invoked the first time a node with isLeaf=false is expanded.' },
          { prop: 'searchable', type: 'boolean', default: 'false', description: 'Show a search field that filters the tree and auto-expands ancestors of matches.' },
          { prop: 'filter', type: '(node, query) => boolean', description: 'Custom match function (default: case-insensitive label contains).' },
          { prop: 'maxTagCount', type: 'number', default: '3', description: 'Max chips shown in the trigger before collapsing into "+N".' },
          { prop: 'label', type: 'string', description: 'Field label above the trigger.' },
          { prop: 'placeholder', type: 'string', description: 'Trigger placeholder when nothing is selected.' },
          { prop: 'helperText', type: 'string', description: 'Helper text below the trigger.' },
          { prop: 'error', type: 'string', description: 'Error message (replaces helperText when set).' },
          { prop: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Trigger size.' },
          { prop: 'fullWidth', type: 'boolean', default: 'false', description: 'Stretch the field to its container.' },
          { prop: 'disabled', type: 'boolean', default: 'false', description: 'Disable the control.' },
          { prop: 'clearable', type: 'boolean', default: 'false', description: 'Show a clear button when any value is selected.' },
          { prop: 'name', type: 'string', description: 'Renders a hidden input for native form submission (comma-joined for multi).' },
          { prop: 'id', type: 'string', description: 'Custom id (auto-generated if omitted).' },
          { prop: 'className', type: 'string', description: 'Extra class applied to the outer field wrapper.' },
        ]} />
      </div>

      <div className="docs-section">
        <div className="docs-section-title">TreeNode shape</div>
        <CodeBlock code={`interface TreeNode {
  value: string         // unique identifier
  label: string         // visible label
  description?: string  // secondary line under the label
  icon?: ReactNode      // optional leading icon
  disabled?: boolean    // un-selectable / un-checkable
  children?: TreeNode[] // sub-nodes
  isLeaf?: boolean      // when false, triggers loadChildren on first expand
}`} />
      </div>
    </div>
  )
}
